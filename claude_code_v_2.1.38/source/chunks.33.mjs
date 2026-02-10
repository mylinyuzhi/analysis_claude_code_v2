
// @from(Ln 85227, Col 4)
uk1 = R((q72, dS8) => {
    var jg = h1("node:assert"),
        FS8 = h1("node:net"),
        R23 = h1("node:http"),
        dA1 = W9(),
        {
            channels: S$1
        } = D$1(),
        y23 = Ey8(),
        C23 = W$1(),
        {
            InvalidArgumentError: zJ,
            InformationalError: S23,
            ClientDestroyedError: h23
        } = Lz(),
        I23 = Wk1(),
        {
            kUrl: Cb,
            kServerName: Yn,
            kClient: x23,
            kBusy: Hr6,
            kConnect: b23,
            kResuming: cA1,
            kRunning: xk1,
            kPending: bk1,
            kSize: Ik1,
            kQueue: xC,
            kConnected: u23,
            kConnecting: h$1,
            kNeedDrain: wn,
            kKeepAliveDefaultTimeout: xS8,
            kHostHeader: B23,
            kPendingIdx: bC,
            kRunningIdx: Mg,
            kError: m23,
            kPipelining: H66,
            kKeepAliveTimeoutValue: F23,
            kMaxHeadersSize: Q23,
            kKeepAliveMaxTimeout: g23,
            kKeepAliveTimeoutThreshold: U23,
            kHeadersTimeout: p23,
            kBodyTimeout: d23,
            kStrictContentLength: c23,
            kConnector: Ck1,
            kMaxRedirections: l23,
            kMaxRequests: $r6,
            kCounter: i23,
            kClose: n23,
            kDestroy: r23,
            kDispatch: o23,
            kInterceptors: bS8,
            kLocalAddress: Sk1,
            kMaxResponseSize: a23,
            kOnError: s23,
            kHTTPContext: wJ,
            kMaxConcurrentStreams: t23,
            kResume: hk1
        } = h$(),
        e23 = fS8(),
        Aw3 = RS8(),
        uS8 = !1,
        zn = Symbol("kClosedResolve"),
        BS8 = () => {};

    function QS8(A) {
        return A[H66] ?? A[wJ]?.defaultPipelining ?? 1
    }
    class gS8 extends C23 {
        constructor(A, {
            interceptors: q,
            maxHeaderSize: K,
            headersTimeout: Y,
            socketTimeout: z,
            requestTimeout: w,
            connectTimeout: H,
            bodyTimeout: $,
            idleTimeout: O,
            keepAlive: _,
            keepAliveTimeout: J,
            maxKeepAliveTimeout: X,
            keepAliveMaxTimeout: D,
            keepAliveTimeoutThreshold: j,
            socketPath: M,
            pipelining: P,
            tls: W,
            strictContentLength: G,
            maxCachedSessions: f,
            maxRedirections: Z,
            connect: N,
            maxRequestsPerClient: T,
            localAddress: k,
            maxResponseSize: y,
            autoSelectFamily: B,
            autoSelectFamilyAttemptTimeout: S,
            maxConcurrentStreams: m,
            allowH2: b
        } = {}) {
            super();
            if (_ !== void 0) throw new zJ("unsupported keepAlive, use pipelining=0 instead");
            if (z !== void 0) throw new zJ("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
            if (w !== void 0) throw new zJ("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
            if (O !== void 0) throw new zJ("unsupported idleTimeout, use keepAliveTimeout instead");
            if (X !== void 0) throw new zJ("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
            if (K != null && !Number.isFinite(K)) throw new zJ("invalid maxHeaderSize");
            if (M != null && typeof M !== "string") throw new zJ("invalid socketPath");
            if (H != null && (!Number.isFinite(H) || H < 0)) throw new zJ("invalid connectTimeout");
            if (J != null && (!Number.isFinite(J) || J <= 0)) throw new zJ("invalid keepAliveTimeout");
            if (D != null && (!Number.isFinite(D) || D <= 0)) throw new zJ("invalid keepAliveMaxTimeout");
            if (j != null && !Number.isFinite(j)) throw new zJ("invalid keepAliveTimeoutThreshold");
            if (Y != null && (!Number.isInteger(Y) || Y < 0)) throw new zJ("headersTimeout must be a positive integer or zero");
            if ($ != null && (!Number.isInteger($) || $ < 0)) throw new zJ("bodyTimeout must be a positive integer or zero");
            if (N != null && typeof N !== "function" && typeof N !== "object") throw new zJ("connect must be a function or an object");
            if (Z != null && (!Number.isInteger(Z) || Z < 0)) throw new zJ("maxRedirections must be a positive number");
            if (T != null && (!Number.isInteger(T) || T < 0)) throw new zJ("maxRequestsPerClient must be a positive number");
            if (k != null && (typeof k !== "string" || FS8.isIP(k) === 0)) throw new zJ("localAddress must be valid string IP address");
            if (y != null && (!Number.isInteger(y) || y < -1)) throw new zJ("maxResponseSize must be a positive number");
            if (S != null && (!Number.isInteger(S) || S < -1)) throw new zJ("autoSelectFamilyAttemptTimeout must be a positive number");
            if (b != null && typeof b !== "boolean") throw new zJ("allowH2 must be a valid boolean value");
            if (m != null && (typeof m !== "number" || m < 1)) throw new zJ("maxConcurrentStreams must be a positive integer, greater than 0");
            if (typeof N !== "function") N = I23({
                ...W,
                maxCachedSessions: f,
                allowH2: b,
                socketPath: M,
                timeout: H,
                ...B ? {
                    autoSelectFamily: B,
                    autoSelectFamilyAttemptTimeout: S
                } : void 0,
                ...N
            });
            if (q?.Client && Array.isArray(q.Client)) {
                if (this[bS8] = q.Client, !uS8) uS8 = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
                    code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
                })
            } else this[bS8] = [qw3({
                maxRedirections: Z
            })];
            this[Cb] = dA1.parseOrigin(A), this[Ck1] = N, this[H66] = P != null ? P : 1, this[Q23] = K || R23.maxHeaderSize, this[xS8] = J == null ? 4000 : J, this[g23] = D == null ? 600000 : D, this[U23] = j == null ? 2000 : j, this[F23] = this[xS8], this[Yn] = null, this[Sk1] = k != null ? k : null, this[cA1] = 0, this[wn] = 0, this[B23] = `host: ${this[Cb].hostname}${this[Cb].port?`:${this[Cb].port}`:""}\r
`, this[d23] = $ != null ? $ : 300000, this[p23] = Y != null ? Y : 300000, this[c23] = G == null ? !0 : G, this[l23] = Z, this[$r6] = T, this[zn] = null, this[a23] = y > -1 ? y : -1, this[t23] = m != null ? m : 100, this[wJ] = null, this[xC] = [], this[Mg] = 0, this[bC] = 0, this[hk1] = (g) => Or6(this, g), this[s23] = (g) => US8(this, g)
        }
        get pipelining() {
            return this[H66]
        }
        set pipelining(A) {
            this[H66] = A, this[hk1](!0)
        }
        get[bk1]() {
            return this[xC].length - this[bC]
        }
        get[xk1]() {
            return this[bC] - this[Mg]
        }
        get[Ik1]() {
            return this[xC].length - this[Mg]
        }
        get[u23]() {
            return !!this[wJ] && !this[h$1] && !this[wJ].destroyed
        }
        get[Hr6]() {
            return Boolean(this[wJ]?.busy(null) || this[Ik1] >= (QS8(this) || 1) || this[bk1] > 0)
        } [b23](A) {
            pS8(this), this.once("connect", A)
        } [o23](A, q) {
            let K = A.origin || this[Cb].origin,
                Y = new y23(K, A, q);
            if (this[xC].push(Y), this[cA1]);
            else if (dA1.bodyLength(Y.body) == null && dA1.isIterable(Y.body)) this[cA1] = 1, queueMicrotask(() => Or6(this));
            else this[hk1](!0);
            if (this[cA1] && this[wn] !== 2 && this[Hr6]) this[wn] = 2;
            return this[wn] < 2
        }
        async [n23]() {
            return new Promise((A) => {
                if (this[Ik1]) this[zn] = A;
                else A(null)
            })
        }
        async [r23](A) {
            return new Promise((q) => {
                let K = this[xC].splice(this[bC]);
                for (let z = 0; z < K.length; z++) {
                    let w = K[z];
                    dA1.errorRequest(this, w, A)
                }
                let Y = () => {
                    if (this[zn]) this[zn](), this[zn] = null;
                    q(null)
                };
                if (this[wJ]) this[wJ].destroy(A, Y), this[wJ] = null;
                else queueMicrotask(Y);
                this[hk1]()
            })
        }
    }
    var qw3 = w66();

    function US8(A, q) {
        if (A[xk1] === 0 && q.code !== "UND_ERR_INFO" && q.code !== "UND_ERR_SOCKET") {
            jg(A[bC] === A[Mg]);
            let K = A[xC].splice(A[Mg]);
            for (let Y = 0; Y < K.length; Y++) {
                let z = K[Y];
                dA1.errorRequest(A, z, q)
            }
            jg(A[Ik1] === 0)
        }
    }
    async function pS8(A) {
        jg(!A[h$1]), jg(!A[wJ]);
        let {
            host: q,
            hostname: K,
            protocol: Y,
            port: z
        } = A[Cb];
        if (K[0] === "[") {
            let w = K.indexOf("]");
            jg(w !== -1);
            let H = K.substring(1, w);
            jg(FS8.isIP(H)), K = H
        }
        if (A[h$1] = !0, S$1.beforeConnect.hasSubscribers) S$1.beforeConnect.publish({
            connectParams: {
                host: q,
                hostname: K,
                protocol: Y,
                port: z,
                version: A[wJ]?.version,
                servername: A[Yn],
                localAddress: A[Sk1]
            },
            connector: A[Ck1]
        });
        try {
            let w = await new Promise((H, $) => {
                A[Ck1]({
                    host: q,
                    hostname: K,
                    protocol: Y,
                    port: z,
                    servername: A[Yn],
                    localAddress: A[Sk1]
                }, (O, _) => {
                    if (O) $(O);
                    else H(_)
                })
            });
            if (A.destroyed) {
                dA1.destroy(w.on("error", BS8), new h23);
                return
            }
            jg(w);
            try {
                A[wJ] = w.alpnProtocol === "h2" ? await Aw3(A, w) : await e23(A, w)
            } catch (H) {
                throw w.destroy().on("error", BS8), H
            }
            if (A[h$1] = !1, w[i23] = 0, w[$r6] = A[$r6], w[x23] = A, w[m23] = null, S$1.connected.hasSubscribers) S$1.connected.publish({
                connectParams: {
                    host: q,
                    hostname: K,
                    protocol: Y,
                    port: z,
                    version: A[wJ]?.version,
                    servername: A[Yn],
                    localAddress: A[Sk1]
                },
                connector: A[Ck1],
                socket: w
            });
            A.emit("connect", A[Cb], [A])
        } catch (w) {
            if (A.destroyed) return;
            if (A[h$1] = !1, S$1.connectError.hasSubscribers) S$1.connectError.publish({
                connectParams: {
                    host: q,
                    hostname: K,
                    protocol: Y,
                    port: z,
                    version: A[wJ]?.version,
                    servername: A[Yn],
                    localAddress: A[Sk1]
                },
                connector: A[Ck1],
                error: w
            });
            if (w.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
                jg(A[xk1] === 0);
                while (A[bk1] > 0 && A[xC][A[bC]].servername === A[Yn]) {
                    let H = A[xC][A[bC]++];
                    dA1.errorRequest(A, H, w)
                }
            } else US8(A, w);
            A.emit("connectionError", A[Cb], [A], w)
        }
        A[hk1]()
    }

    function mS8(A) {
        A[wn] = 0, A.emit("drain", A[Cb], [A])
    }

    function Or6(A, q) {
        if (A[cA1] === 2) return;
        if (A[cA1] = 2, Kw3(A, q), A[cA1] = 0, A[Mg] > 256) A[xC].splice(0, A[Mg]), A[bC] -= A[Mg], A[Mg] = 0
    }

    function Kw3(A, q) {
        while (!0) {
            if (A.destroyed) {
                jg(A[bk1] === 0);
                return
            }
            if (A[zn] && !A[Ik1]) {
                A[zn](), A[zn] = null;
                return
            }
            if (A[wJ]) A[wJ].resume();
            if (A[Hr6]) A[wn] = 2;
            else if (A[wn] === 2) {
                if (q) A[wn] = 1, queueMicrotask(() => mS8(A));
                else mS8(A);
                continue
            }
            if (A[bk1] === 0) return;
            if (A[xk1] >= (QS8(A) || 1)) return;
            let K = A[xC][A[bC]];
            if (A[Cb].protocol === "https:" && A[Yn] !== K.servername) {
                if (A[xk1] > 0) return;
                A[Yn] = K.servername, A[wJ]?.destroy(new S23("servername changed"), () => {
                    A[wJ] = null, Or6(A)
                })
            }
            if (A[h$1]) return;
            if (!A[wJ]) {
                pS8(A);
                return
            }
            if (A[wJ].destroyed) return;
            if (A[wJ].busy(K)) return;
            if (!K.aborted && A[wJ].write(K)) A[bC]++;
            else A[xC].splice(A[bC], 1)
        }
    }
    dS8.exports = gS8
})
// @from(Ln 85574, Col 4)
Jr6 = R((K72, cS8) => {
    class _r6 {
        constructor() {
            this.bottom = 0, this.top = 0, this.list = Array(2048), this.next = null
        }
        isEmpty() {
            return this.top === this.bottom
        }
        isFull() {
            return (this.top + 1 & 2047) === this.bottom
        }
        push(A) {
            this.list[this.top] = A, this.top = this.top + 1 & 2047
        }
        shift() {
            let A = this.list[this.bottom];
            if (A === void 0) return null;
            return this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & 2047, A
        }
    }
    cS8.exports = class {
        constructor() {
            this.head = this.tail = new _r6
        }
        isEmpty() {
            return this.head.isEmpty()
        }
        push(q) {
            if (this.head.isFull()) this.head = this.head.next = new _r6;
            this.head.push(q)
        }
        shift() {
            let q = this.tail,
                K = q.shift();
            if (q.isEmpty() && q.next !== null) this.tail = q.next;
            return K
        }
    }
})
// @from(Ln 85613, Col 4)
nS8 = R((Y72, iS8) => {
    var {
        kFree: Yw3,
        kConnected: zw3,
        kPending: ww3,
        kQueued: Hw3,
        kRunning: $w3,
        kSize: Ow3
    } = h$(), lA1 = Symbol("pool");
    class lS8 {
        constructor(A) {
            this[lA1] = A
        }
        get connected() {
            return this[lA1][zw3]
        }
        get free() {
            return this[lA1][Yw3]
        }
        get pending() {
            return this[lA1][ww3]
        }
        get queued() {
            return this[lA1][Hw3]
        }
        get running() {
            return this[lA1][$w3]
        }
        get size() {
            return this[lA1][Ow3]
        }
    }
    iS8.exports = lS8
})
// @from(Ln 85647, Col 4)
Pr6 = R((z72, zh8) => {
    var _w3 = W$1(),
        Jw3 = Jr6(),
        {
            kConnected: Xr6,
            kSize: rS8,
            kRunning: oS8,
            kPending: aS8,
            kQueued: Bk1,
            kBusy: Xw3,
            kFree: Dw3,
            kUrl: jw3,
            kClose: Mw3,
            kDestroy: Pw3,
            kDispatch: Ww3
        } = h$(),
        Gw3 = nS8(),
        YV = Symbol("clients"),
        QG = Symbol("needDrain"),
        mk1 = Symbol("queue"),
        Dr6 = Symbol("closed resolve"),
        jr6 = Symbol("onDrain"),
        sS8 = Symbol("onConnect"),
        tS8 = Symbol("onDisconnect"),
        eS8 = Symbol("onConnectionError"),
        Mr6 = Symbol("get dispatcher"),
        qh8 = Symbol("add client"),
        Kh8 = Symbol("remove client"),
        Ah8 = Symbol("stats");
    class Yh8 extends _w3 {
        constructor() {
            super();
            this[mk1] = new Jw3, this[YV] = [], this[Bk1] = 0;
            let A = this;
            this[jr6] = function(K, Y) {
                let z = A[mk1],
                    w = !1;
                while (!w) {
                    let H = z.shift();
                    if (!H) break;
                    A[Bk1]--, w = !this.dispatch(H.opts, H.handler)
                }
                if (this[QG] = w, !this[QG] && A[QG]) A[QG] = !1, A.emit("drain", K, [A, ...Y]);
                if (A[Dr6] && z.isEmpty()) Promise.all(A[YV].map((H) => H.close())).then(A[Dr6])
            }, this[sS8] = (q, K) => {
                A.emit("connect", q, [A, ...K])
            }, this[tS8] = (q, K, Y) => {
                A.emit("disconnect", q, [A, ...K], Y)
            }, this[eS8] = (q, K, Y) => {
                A.emit("connectionError", q, [A, ...K], Y)
            }, this[Ah8] = new Gw3(this)
        }
        get[Xw3]() {
            return this[QG]
        }
        get[Xr6]() {
            return this[YV].filter((A) => A[Xr6]).length
        }
        get[Dw3]() {
            return this[YV].filter((A) => A[Xr6] && !A[QG]).length
        }
        get[aS8]() {
            let A = this[Bk1];
            for (let {
                    [aS8]: q
                }
                of this[YV]) A += q;
            return A
        }
        get[oS8]() {
            let A = 0;
            for (let {
                    [oS8]: q
                }
                of this[YV]) A += q;
            return A
        }
        get[rS8]() {
            let A = this[Bk1];
            for (let {
                    [rS8]: q
                }
                of this[YV]) A += q;
            return A
        }
        get stats() {
            return this[Ah8]
        }
        async [Mw3]() {
            if (this[mk1].isEmpty()) await Promise.all(this[YV].map((A) => A.close()));
            else await new Promise((A) => {
                this[Dr6] = A
            })
        }
        async [Pw3](A) {
            while (!0) {
                let q = this[mk1].shift();
                if (!q) break;
                q.handler.onError(A)
            }
            await Promise.all(this[YV].map((q) => q.destroy(A)))
        } [Ww3](A, q) {
            let K = this[Mr6]();
            if (!K) this[QG] = !0, this[mk1].push({
                opts: A,
                handler: q
            }), this[Bk1]++;
            else if (!K.dispatch(A, q)) K[QG] = !0, this[QG] = !this[Mr6]();
            return !this[QG]
        } [qh8](A) {
            if (A.on("drain", this[jr6]).on("connect", this[sS8]).on("disconnect", this[tS8]).on("connectionError", this[eS8]), this[YV].push(A), this[QG]) queueMicrotask(() => {
                if (this[QG]) this[jr6](A[jw3], [this, A])
            });
            return this
        } [Kh8](A) {
            A.close(() => {
                let q = this[YV].indexOf(A);
                if (q !== -1) this[YV].splice(q, 1)
            }), this[QG] = this[YV].some((q) => !q[QG] && q.closed !== !0 && q.destroyed !== !0)
        }
    }
    zh8.exports = {
        PoolBase: Yh8,
        kClients: YV,
        kNeedDrain: QG,
        kAddClient: qh8,
        kRemoveClient: Kh8,
        kGetDispatcher: Mr6
    }
})
// @from(Ln 85777, Col 4)
I$1 = R((w72, Jh8) => {
    var {
        PoolBase: Zw3,
        kClients: wh8,
        kNeedDrain: fw3,
        kAddClient: Vw3,
        kGetDispatcher: Nw3
    } = Pr6(), Tw3 = uk1(), {
        InvalidArgumentError: Wr6
    } = Lz(), Hh8 = W9(), {
        kUrl: $h8,
        kInterceptors: vw3
    } = h$(), Ew3 = Wk1(), Gr6 = Symbol("options"), Zr6 = Symbol("connections"), Oh8 = Symbol("factory");

    function kw3(A, q) {
        return new Tw3(A, q)
    }
    class _h8 extends Zw3 {
        constructor(A, {
            connections: q,
            factory: K = kw3,
            connect: Y,
            connectTimeout: z,
            tls: w,
            maxCachedSessions: H,
            socketPath: $,
            autoSelectFamily: O,
            autoSelectFamilyAttemptTimeout: _,
            allowH2: J,
            ...X
        } = {}) {
            super();
            if (q != null && (!Number.isFinite(q) || q < 0)) throw new Wr6("invalid connections");
            if (typeof K !== "function") throw new Wr6("factory must be a function.");
            if (Y != null && typeof Y !== "function" && typeof Y !== "object") throw new Wr6("connect must be a function or an object");
            if (typeof Y !== "function") Y = Ew3({
                ...w,
                maxCachedSessions: H,
                allowH2: J,
                socketPath: $,
                timeout: z,
                ...O ? {
                    autoSelectFamily: O,
                    autoSelectFamilyAttemptTimeout: _
                } : void 0,
                ...Y
            });
            this[vw3] = X.interceptors?.Pool && Array.isArray(X.interceptors.Pool) ? X.interceptors.Pool : [], this[Zr6] = q || null, this[$h8] = Hh8.parseOrigin(A), this[Gr6] = {
                ...Hh8.deepClone(X),
                connect: Y,
                allowH2: J
            }, this[Gr6].interceptors = X.interceptors ? {
                ...X.interceptors
            } : void 0, this[Oh8] = K
        } [Nw3]() {
            for (let A of this[wh8])
                if (!A[fw3]) return A;
            if (!this[Zr6] || this[wh8].length < this[Zr6]) {
                let A = this[Oh8](this[$h8], this[Gr6]);
                return this[Vw3](A), A
            }
        }
    }
    Jh8.exports = _h8
})
// @from(Ln 85842, Col 4)
Wh8 = R((H72, Ph8) => {
    var {
        BalancedPoolMissingUpstreamError: Lw3,
        InvalidArgumentError: Rw3
    } = Lz(), {
        PoolBase: yw3,
        kClients: KW,
        kNeedDrain: Fk1,
        kAddClient: Cw3,
        kRemoveClient: Sw3,
        kGetDispatcher: hw3
    } = Pr6(), Iw3 = I$1(), {
        kUrl: fr6,
        kInterceptors: xw3
    } = h$(), {
        parseOrigin: Xh8
    } = W9(), Dh8 = Symbol("factory"), $66 = Symbol("options"), jh8 = Symbol("kGreatestCommonDivisor"), iA1 = Symbol("kCurrentWeight"), nA1 = Symbol("kIndex"), Fk = Symbol("kWeight"), O66 = Symbol("kMaxWeightPerServer"), _66 = Symbol("kErrorPenalty");

    function bw3(A, q) {
        if (A === 0) return q;
        while (q !== 0) {
            let K = q;
            q = A % q, A = K
        }
        return A
    }

    function uw3(A, q) {
        return new Iw3(A, q)
    }
    class Mh8 extends yw3 {
        constructor(A = [], {
            factory: q = uw3,
            ...K
        } = {}) {
            super();
            if (this[$66] = K, this[nA1] = -1, this[iA1] = 0, this[O66] = this[$66].maxWeightPerServer || 100, this[_66] = this[$66].errorPenalty || 15, !Array.isArray(A)) A = [A];
            if (typeof q !== "function") throw new Rw3("factory must be a function.");
            this[xw3] = K.interceptors?.BalancedPool && Array.isArray(K.interceptors.BalancedPool) ? K.interceptors.BalancedPool : [], this[Dh8] = q;
            for (let Y of A) this.addUpstream(Y);
            this._updateBalancedPoolStats()
        }
        addUpstream(A) {
            let q = Xh8(A).origin;
            if (this[KW].find((Y) => Y[fr6].origin === q && Y.closed !== !0 && Y.destroyed !== !0)) return this;
            let K = this[Dh8](q, Object.assign({}, this[$66]));
            this[Cw3](K), K.on("connect", () => {
                K[Fk] = Math.min(this[O66], K[Fk] + this[_66])
            }), K.on("connectionError", () => {
                K[Fk] = Math.max(1, K[Fk] - this[_66]), this._updateBalancedPoolStats()
            }), K.on("disconnect", (...Y) => {
                let z = Y[2];
                if (z && z.code === "UND_ERR_SOCKET") K[Fk] = Math.max(1, K[Fk] - this[_66]), this._updateBalancedPoolStats()
            });
            for (let Y of this[KW]) Y[Fk] = this[O66];
            return this._updateBalancedPoolStats(), this
        }
        _updateBalancedPoolStats() {
            let A = 0;
            for (let q = 0; q < this[KW].length; q++) A = bw3(this[KW][q][Fk], A);
            this[jh8] = A
        }
        removeUpstream(A) {
            let q = Xh8(A).origin,
                K = this[KW].find((Y) => Y[fr6].origin === q && Y.closed !== !0 && Y.destroyed !== !0);
            if (K) this[Sw3](K);
            return this
        }
        get upstreams() {
            return this[KW].filter((A) => A.closed !== !0 && A.destroyed !== !0).map((A) => A[fr6].origin)
        } [hw3]() {
            if (this[KW].length === 0) throw new Lw3;
            if (!this[KW].find((z) => !z[Fk1] && z.closed !== !0 && z.destroyed !== !0)) return;
            if (this[KW].map((z) => z[Fk1]).reduce((z, w) => z && w, !0)) return;
            let K = 0,
                Y = this[KW].findIndex((z) => !z[Fk1]);
            while (K++ < this[KW].length) {
                this[nA1] = (this[nA1] + 1) % this[KW].length;
                let z = this[KW][this[nA1]];
                if (z[Fk] > this[KW][Y][Fk] && !z[Fk1]) Y = this[nA1];
                if (this[nA1] === 0) {
                    if (this[iA1] = this[iA1] - this[jh8], this[iA1] <= 0) this[iA1] = this[O66]
                }
                if (z[Fk] >= this[iA1] && !z[Fk1]) return z
            }
            return this[iA1] = this[KW][Y][Fk], this[nA1] = Y, this[KW][Y]
        }
    }
    Ph8.exports = Mh8
})
// @from(Ln 85932, Col 4)
x$1 = R(($72, Eh8) => {
    var {
        InvalidArgumentError: J66
    } = Lz(), {
        kClients: Hn,
        kRunning: Gh8,
        kClose: Bw3,
        kDestroy: mw3,
        kDispatch: Fw3,
        kInterceptors: Qw3
    } = h$(), gw3 = W$1(), Uw3 = I$1(), pw3 = uk1(), dw3 = W9(), cw3 = w66(), Zh8 = Symbol("onConnect"), fh8 = Symbol("onDisconnect"), Vh8 = Symbol("onConnectionError"), lw3 = Symbol("maxRedirections"), Nh8 = Symbol("onDrain"), Th8 = Symbol("factory"), Vr6 = Symbol("options");

    function iw3(A, q) {
        return q && q.connections === 1 ? new pw3(A, q) : new Uw3(A, q)
    }
    class vh8 extends gw3 {
        constructor({
            factory: A = iw3,
            maxRedirections: q = 0,
            connect: K,
            ...Y
        } = {}) {
            super();
            if (typeof A !== "function") throw new J66("factory must be a function.");
            if (K != null && typeof K !== "function" && typeof K !== "object") throw new J66("connect must be a function or an object");
            if (!Number.isInteger(q) || q < 0) throw new J66("maxRedirections must be a positive number");
            if (K && typeof K !== "function") K = {
                ...K
            };
            this[Qw3] = Y.interceptors?.Agent && Array.isArray(Y.interceptors.Agent) ? Y.interceptors.Agent : [cw3({
                maxRedirections: q
            })], this[Vr6] = {
                ...dw3.deepClone(Y),
                connect: K
            }, this[Vr6].interceptors = Y.interceptors ? {
                ...Y.interceptors
            } : void 0, this[lw3] = q, this[Th8] = A, this[Hn] = new Map, this[Nh8] = (z, w) => {
                this.emit("drain", z, [this, ...w])
            }, this[Zh8] = (z, w) => {
                this.emit("connect", z, [this, ...w])
            }, this[fh8] = (z, w, H) => {
                this.emit("disconnect", z, [this, ...w], H)
            }, this[Vh8] = (z, w, H) => {
                this.emit("connectionError", z, [this, ...w], H)
            }
        }
        get[Gh8]() {
            let A = 0;
            for (let q of this[Hn].values()) A += q[Gh8];
            return A
        } [Fw3](A, q) {
            let K;
            if (A.origin && (typeof A.origin === "string" || A.origin instanceof URL)) K = String(A.origin);
            else throw new J66("opts.origin must be a non-empty string or URL.");
            let Y = this[Hn].get(K);
            if (!Y) Y = this[Th8](A.origin, this[Vr6]).on("drain", this[Nh8]).on("connect", this[Zh8]).on("disconnect", this[fh8]).on("connectionError", this[Vh8]), this[Hn].set(K, Y);
            return Y.dispatch(A, q)
        }
        async [Bw3]() {
            let A = [];
            for (let q of this[Hn].values()) A.push(q.close());
            this[Hn].clear(), await Promise.all(A)
        }
        async [mw3](A) {
            let q = [];
            for (let K of this[Hn].values()) q.push(K.destroy(A));
            this[Hn].clear(), await Promise.all(q)
        }
    }
    Eh8.exports = vh8
})
// @from(Ln 86003, Col 4)
Tr6 = R((O72, Ch8) => {
    var {
        kProxy: nw3,
        kClose: rw3,
        kDestroy: ow3,
        kInterceptors: aw3
    } = h$(), {
        URL: Qk1
    } = h1("node:url"), sw3 = x$1(), tw3 = I$1(), ew3 = W$1(), {
        InvalidArgumentError: j66,
        RequestAbortedError: AH3,
        SecureProxyConnectionError: qH3
    } = Lz(), kh8 = Wk1(), X66 = Symbol("proxy agent"), D66 = Symbol("proxy client"), gk1 = Symbol("proxy headers"), Nr6 = Symbol("request tls settings"), Lh8 = Symbol("proxy tls settings"), Rh8 = Symbol("connect endpoint function");

    function KH3(A) {
        return A === "https:" ? 443 : 80
    }

    function YH3(A, q) {
        return new tw3(A, q)
    }
    var zH3 = () => {};
    class yh8 extends ew3 {
        constructor(A) {
            super();
            if (!A || typeof A === "object" && !(A instanceof Qk1) && !A.uri) throw new j66("Proxy uri is mandatory");
            let {
                clientFactory: q = YH3
            } = A;
            if (typeof q !== "function") throw new j66("Proxy opts.clientFactory must be a function.");
            let K = this.#A(A),
                {
                    href: Y,
                    origin: z,
                    port: w,
                    protocol: H,
                    username: $,
                    password: O,
                    hostname: _
                } = K;
            if (this[nw3] = {
                    uri: Y,
                    protocol: H
                }, this[aw3] = A.interceptors?.ProxyAgent && Array.isArray(A.interceptors.ProxyAgent) ? A.interceptors.ProxyAgent : [], this[Nr6] = A.requestTls, this[Lh8] = A.proxyTls, this[gk1] = A.headers || {}, A.auth && A.token) throw new j66("opts.auth cannot be used in combination with opts.token");
            else if (A.auth) this[gk1]["proxy-authorization"] = `Basic ${A.auth}`;
            else if (A.token) this[gk1]["proxy-authorization"] = A.token;
            else if ($ && O) this[gk1]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent($)}:${decodeURIComponent(O)}`).toString("base64")}`;
            let J = kh8({
                ...A.proxyTls
            });
            this[Rh8] = kh8({
                ...A.requestTls
            }), this[D66] = q(K, {
                connect: J
            }), this[X66] = new sw3({
                ...A,
                connect: async (X, D) => {
                    let j = X.host;
                    if (!X.port) j += `:${KH3(X.protocol)}`;
                    try {
                        let {
                            socket: M,
                            statusCode: P
                        } = await this[D66].connect({
                            origin: z,
                            port: w,
                            path: j,
                            signal: X.signal,
                            headers: {
                                ...this[gk1],
                                host: X.host
                            },
                            servername: this[Lh8]?.servername || _
                        });
                        if (P !== 200) M.on("error", zH3).destroy(), D(new AH3(`Proxy response (${P}) !== 200 when HTTP Tunneling`));
                        if (X.protocol !== "https:") {
                            D(null, M);
                            return
                        }
                        let W;
                        if (this[Nr6]) W = this[Nr6].servername;
                        else W = X.servername;
                        this[Rh8]({
                            ...X,
                            servername: W,
                            httpSocket: M
                        }, D)
                    } catch (M) {
                        if (M.code === "ERR_TLS_CERT_ALTNAME_INVALID") D(new qH3(M));
                        else D(M)
                    }
                }
            })
        }
        dispatch(A, q) {
            let K = wH3(A.headers);
            if (HH3(K), K && !("host" in K) && !("Host" in K)) {
                let {
                    host: Y
                } = new Qk1(A.origin);
                K.host = Y
            }
            return this[X66].dispatch({
                ...A,
                headers: K
            }, q)
        }
        #A(A) {
            if (typeof A === "string") return new Qk1(A);
            else if (A instanceof Qk1) return A;
            else return new Qk1(A.uri)
        }
        async [rw3]() {
            await this[X66].close(), await this[D66].close()
        }
        async [ow3]() {
            await this[X66].destroy(), await this[D66].destroy()
        }
    }

    function wH3(A) {
        if (Array.isArray(A)) {
            let q = {};
            for (let K = 0; K < A.length; K += 2) q[A[K]] = A[K + 1];
            return q
        }
        return A
    }

    function HH3(A) {
        if (A && Object.keys(A).find((K) => K.toLowerCase() === "proxy-authorization")) throw new j66("Proxy-Authorization should be sent in ProxyAgent constructor")
    }
    Ch8.exports = yh8
})
// @from(Ln 86137, Col 4)
Bh8 = R((_72, uh8) => {
    var $H3 = W$1(),
        {
            kClose: OH3,
            kDestroy: _H3,
            kClosed: Sh8,
            kDestroyed: hh8,
            kDispatch: JH3,
            kNoProxyAgent: Uk1,
            kHttpProxyAgent: $n,
            kHttpsProxyAgent: rA1
        } = h$(),
        Ih8 = Tr6(),
        XH3 = x$1(),
        DH3 = {
            "http:": 80,
            "https:": 443
        },
        xh8 = !1;
    class bh8 extends $H3 {
        #A = null;
        #q = null;
        #K = null;
        constructor(A = {}) {
            super();
            if (this.#K = A, !xh8) xh8 = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
                code: "UNDICI-EHPA"
            });
            let {
                httpProxy: q,
                httpsProxy: K,
                noProxy: Y,
                ...z
            } = A;
            this[Uk1] = new XH3(z);
            let w = q ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
            if (w) this[$n] = new Ih8({
                ...z,
                uri: w
            });
            else this[$n] = this[Uk1];
            let H = K ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
            if (H) this[rA1] = new Ih8({
                ...z,
                uri: H
            });
            else this[rA1] = this[$n];
            this.#$()
        } [JH3](A, q) {
            let K = new URL(A.origin);
            return this.#z(K).dispatch(A, q)
        }
        async [OH3]() {
            if (await this[Uk1].close(), !this[$n][Sh8]) await this[$n].close();
            if (!this[rA1][Sh8]) await this[rA1].close()
        }
        async [_H3](A) {
            if (await this[Uk1].destroy(A), !this[$n][hh8]) await this[$n].destroy(A);
            if (!this[rA1][hh8]) await this[rA1].destroy(A)
        }
        #z(A) {
            let {
                protocol: q,
                host: K,
                port: Y
            } = A;
            if (K = K.replace(/:\d*$/, "").toLowerCase(), Y = Number.parseInt(Y, 10) || DH3[q] || 0, !this.#Y(K, Y)) return this[Uk1];
            if (q === "https:") return this[rA1];
            return this[$n]
        }
        #Y(A, q) {
            if (this.#w) this.#$();
            if (this.#q.length === 0) return !0;
            if (this.#A === "*") return !1;
            for (let K = 0; K < this.#q.length; K++) {
                let Y = this.#q[K];
                if (Y.port && Y.port !== q) continue;
                if (!/^[.*]/.test(Y.hostname)) {
                    if (A === Y.hostname) return !1
                } else if (A.endsWith(Y.hostname.replace(/^\*/, ""))) return !1
            }
            return !0
        }
        #$() {
            let A = this.#K.noProxy ?? this.#_,
                q = A.split(/[,\s]/),
                K = [];
            for (let Y = 0; Y < q.length; Y++) {
                let z = q[Y];
                if (!z) continue;
                let w = z.match(/^(.+):(\d+)$/);
                K.push({
                    hostname: (w ? w[1] : z).toLowerCase(),
                    port: w ? Number.parseInt(w[2], 10) : 0
                })
            }
            this.#A = A, this.#q = K
        }
        get #w() {
            if (this.#K.noProxy !== void 0) return !1;
            return this.#A !== this.#_
        }
        get #_() {
            return process.env.no_proxy ?? process.env.NO_PROXY ?? ""
        }
    }
    uh8.exports = bh8
})
// @from(Ln 86245, Col 4)
M66 = R((J72, gh8) => {
    var b$1 = h1("node:assert"),
        {
            kRetryHandlerDefaultRetry: mh8
        } = h$(),
        {
            RequestRetryError: pk1
        } = Lz(),
        {
            isDisturbed: Fh8,
            parseHeaders: jH3,
            parseRangeHeader: Qh8,
            wrapRequestBody: MH3
        } = W9();

    function PH3(A) {
        let q = Date.now();
        return new Date(A).getTime() - q
    }
    class vr6 {
        constructor(A, q) {
            let {
                retryOptions: K,
                ...Y
            } = A, {
                retry: z,
                maxRetries: w,
                maxTimeout: H,
                minTimeout: $,
                timeoutFactor: O,
                methods: _,
                errorCodes: J,
                retryAfter: X,
                statusCodes: D
            } = K ?? {};
            this.dispatch = q.dispatch, this.handler = q.handler, this.opts = {
                ...Y,
                body: MH3(A.body)
            }, this.abort = null, this.aborted = !1, this.retryOpts = {
                retry: z ?? vr6[mh8],
                retryAfter: X ?? !0,
                maxTimeout: H ?? 30000,
                minTimeout: $ ?? 500,
                timeoutFactor: O ?? 2,
                maxRetries: w ?? 5,
                methods: _ ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
                statusCodes: D ?? [500, 502, 503, 504, 429],
                errorCodes: J ?? ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "ENETDOWN", "ENETUNREACH", "EHOSTDOWN", "EHOSTUNREACH", "EPIPE", "UND_ERR_SOCKET"]
            }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((j) => {
                if (this.aborted = !0, this.abort) this.abort(j);
                else this.reason = j
            })
        }
        onRequestSent() {
            if (this.handler.onRequestSent) this.handler.onRequestSent()
        }
        onUpgrade(A, q, K) {
            if (this.handler.onUpgrade) this.handler.onUpgrade(A, q, K)
        }
        onConnect(A) {
            if (this.aborted) A(this.reason);
            else this.abort = A
        }
        onBodySent(A) {
            if (this.handler.onBodySent) return this.handler.onBodySent(A)
        }
        static[mh8](A, {
            state: q,
            opts: K
        }, Y) {
            let {
                statusCode: z,
                code: w,
                headers: H
            } = A, {
                method: $,
                retryOptions: O
            } = K, {
                maxRetries: _,
                minTimeout: J,
                maxTimeout: X,
                timeoutFactor: D,
                statusCodes: j,
                errorCodes: M,
                methods: P
            } = O, {
                counter: W
            } = q;
            if (w && w !== "UND_ERR_REQ_RETRY" && !M.includes(w)) {
                Y(A);
                return
            }
            if (Array.isArray(P) && !P.includes($)) {
                Y(A);
                return
            }
            if (z != null && Array.isArray(j) && !j.includes(z)) {
                Y(A);
                return
            }
            if (W > _) {
                Y(A);
                return
            }
            let G = H?.["retry-after"];
            if (G) G = Number(G), G = Number.isNaN(G) ? PH3(G) : G * 1000;
            let f = G > 0 ? Math.min(G, X) : Math.min(J * D ** (W - 1), X);
            setTimeout(() => Y(null), f)
        }
        onHeaders(A, q, K, Y) {
            let z = jH3(q);
            if (this.retryCount += 1, A >= 300)
                if (this.retryOpts.statusCodes.includes(A) === !1) return this.handler.onHeaders(A, q, K, Y);
                else return this.abort(new pk1("Request failed", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
            if (this.resume != null) {
                if (this.resume = null, A !== 206 && (this.start > 0 || A !== 200)) return this.abort(new pk1("server does not support the range header and the payload was partially consumed", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                let H = Qh8(z["content-range"]);
                if (!H) return this.abort(new pk1("Content-Range mismatch", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                if (this.etag != null && this.etag !== z.etag) return this.abort(new pk1("ETag mismatch", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                let {
                    start: $,
                    size: O,
                    end: _ = O - 1
                } = H;
                return b$1(this.start === $, "content-range mismatch"), b$1(this.end == null || this.end === _, "content-range mismatch"), this.resume = K, !0
            }
            if (this.end == null) {
                if (A === 206) {
                    let H = Qh8(z["content-range"]);
                    if (H == null) return this.handler.onHeaders(A, q, K, Y);
                    let {
                        start: $,
                        size: O,
                        end: _ = O - 1
                    } = H;
                    b$1($ != null && Number.isFinite($), "content-range mismatch"), b$1(_ != null && Number.isFinite(_), "invalid content-length"), this.start = $, this.end = _
                }
                if (this.end == null) {
                    let H = z["content-length"];
                    this.end = H != null ? Number(H) - 1 : null
                }
                if (b$1(Number.isFinite(this.start)), b$1(this.end == null || Number.isFinite(this.end), "invalid content-length"), this.resume = K, this.etag = z.etag != null ? z.etag : null, this.etag != null && this.etag.startsWith("W/")) this.etag = null;
                return this.handler.onHeaders(A, q, K, Y)
            }
            let w = new pk1("Request failed", A, {
                headers: z,
                data: {
                    count: this.retryCount
                }
            });
            return this.abort(w), !1
        }
        onData(A) {
            return this.start += A.length, this.handler.onData(A)
        }
        onComplete(A) {
            return this.retryCount = 0, this.handler.onComplete(A)
        }
        onError(A) {
            if (this.aborted || Fh8(this.opts.body)) return this.handler.onError(A);
            if (this.retryCount - this.retryCountCheckpoint > 0) this.retryCount = this.retryCountCheckpoint + (this.retryCount - this.retryCountCheckpoint);
            else this.retryCount += 1;
            this.retryOpts.retry(A, {
                state: {
                    counter: this.retryCount
                },
                opts: {
                    retryOptions: this.retryOpts,
                    ...this.opts
                }
            }, q.bind(this));

            function q(K) {
                if (K != null || this.aborted || Fh8(this.opts.body)) return this.handler.onError(K);
                if (this.start !== 0) {
                    let Y = {
                        range: `bytes=${this.start}-${this.end??""}`
                    };
                    if (this.etag != null) Y["if-match"] = this.etag;
                    this.opts = {
                        ...this.opts,
                        headers: {
                            ...this.opts.headers,
                            ...Y
                        }
                    }
                }
                try {
                    this.retryCountCheckpoint = this.retryCount, this.dispatch(this.opts, this)
                } catch (Y) {
                    this.handler.onError(Y)
                }
            }
        }
    }
    gh8.exports = vr6
})
// @from(Ln 86462, Col 4)
dh8 = R((X72, ph8) => {
    var WH3 = Mk1(),
        GH3 = M66();
    class Uh8 extends WH3 {
        #A = null;
        #q = null;
        constructor(A, q = {}) {
            super(q);
            this.#A = A, this.#q = q
        }
        dispatch(A, q) {
            let K = new GH3({
                ...A,
                retryOptions: this.#q
            }, {
                dispatch: this.#A.dispatch.bind(this.#A),
                handler: q
            });
            return this.#A.dispatch(A, K)
        }
        close() {
            return this.#A.close()
        }
        destroy() {
            return this.#A.destroy()
        }
    }
    ph8.exports = Uh8
})
// @from(Ln 86491, Col 4)
yr6 = R((D72, eh8) => {
    var rh8 = h1("node:assert"),
        {
            Readable: ZH3
        } = h1("node:stream"),
        {
            RequestAbortedError: oh8,
            NotSupportedError: fH3,
            InvalidArgumentError: VH3,
            AbortError: Er6
        } = Lz(),
        ah8 = W9(),
        {
            ReadableStreamFrom: NH3
        } = W9(),
        uT = Symbol("kConsume"),
        dk1 = Symbol("kReading"),
        On = Symbol("kBody"),
        ch8 = Symbol("kAbort"),
        sh8 = Symbol("kContentType"),
        lh8 = Symbol("kContentLength"),
        TH3 = () => {};
    class th8 extends ZH3 {
        constructor({
            resume: A,
            abort: q,
            contentType: K = "",
            contentLength: Y,
            highWaterMark: z = 65536
        }) {
            super({
                autoDestroy: !0,
                read: A,
                highWaterMark: z
            });
            this._readableState.dataEmitted = !1, this[ch8] = q, this[uT] = null, this[On] = null, this[sh8] = K, this[lh8] = Y, this[dk1] = !1
        }
        destroy(A) {
            if (!A && !this._readableState.endEmitted) A = new oh8;
            if (A) this[ch8]();
            return super.destroy(A)
        }
        _destroy(A, q) {
            if (!this[dk1]) setImmediate(() => {
                q(A)
            });
            else q(A)
        }
        on(A, ...q) {
            if (A === "data" || A === "readable") this[dk1] = !0;
            return super.on(A, ...q)
        }
        addListener(A, ...q) {
            return this.on(A, ...q)
        }
        off(A, ...q) {
            let K = super.off(A, ...q);
            if (A === "data" || A === "readable") this[dk1] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
            return K
        }
        removeListener(A, ...q) {
            return this.off(A, ...q)
        }
        push(A) {
            if (this[uT] && A !== null) return Lr6(this[uT], A), this[dk1] ? super.push(A) : !0;
            return super.push(A)
        }
        async text() {
            return ck1(this, "text")
        }
        async json() {
            return ck1(this, "json")
        }
        async blob() {
            return ck1(this, "blob")
        }
        async bytes() {
            return ck1(this, "bytes")
        }
        async arrayBuffer() {
            return ck1(this, "arrayBuffer")
        }
        async formData() {
            throw new fH3
        }
        get bodyUsed() {
            return ah8.isDisturbed(this)
        }
        get body() {
            if (!this[On]) {
                if (this[On] = NH3(this), this[uT]) this[On].getReader(), rh8(this[On].locked)
            }
            return this[On]
        }
        async dump(A) {
            let q = Number.isFinite(A?.limit) ? A.limit : 131072,
                K = A?.signal;
            if (K != null && (typeof K !== "object" || !("aborted" in K))) throw new VH3("signal must be an AbortSignal");
            if (K?.throwIfAborted(), this._readableState.closeEmitted) return null;
            return await new Promise((Y, z) => {
                if (this[lh8] > q) this.destroy(new Er6);
                let w = () => {
                    this.destroy(K.reason ?? new Er6)
                };
                K?.addEventListener("abort", w), this.on("close", function() {
                    if (K?.removeEventListener("abort", w), K?.aborted) z(K.reason ?? new Er6);
                    else Y(null)
                }).on("error", TH3).on("data", function(H) {
                    if (q -= H.length, q <= 0) this.destroy()
                }).resume()
            })
        }
    }

    function vH3(A) {
        return A[On] && A[On].locked === !0 || A[uT]
    }

    function EH3(A) {
        return ah8.isDisturbed(A) || vH3(A)
    }
    async function ck1(A, q) {
        return rh8(!A[uT]), new Promise((K, Y) => {
            if (EH3(A)) {
                let z = A._readableState;
                if (z.destroyed && z.closeEmitted === !1) A.on("error", (w) => {
                    Y(w)
                }).on("close", () => {
                    Y(TypeError("unusable"))
                });
                else Y(z.errored ?? TypeError("unusable"))
            } else queueMicrotask(() => {
                A[uT] = {
                    type: q,
                    stream: A,
                    resolve: K,
                    reject: Y,
                    length: 0,
                    body: []
                }, A.on("error", function(z) {
                    Rr6(this[uT], z)
                }).on("close", function() {
                    if (this[uT].body !== null) Rr6(this[uT], new oh8)
                }), kH3(A[uT])
            })
        })
    }

    function kH3(A) {
        if (A.body === null) return;
        let {
            _readableState: q
        } = A.stream;
        if (q.bufferIndex) {
            let K = q.bufferIndex,
                Y = q.buffer.length;
            for (let z = K; z < Y; z++) Lr6(A, q.buffer[z])
        } else
            for (let K of q.buffer) Lr6(A, K);
        if (q.endEmitted) nh8(this[uT]);
        else A.stream.on("end", function() {
            nh8(this[uT])
        });
        A.stream.resume();
        while (A.stream.read() != null);
    }

    function kr6(A, q) {
        if (A.length === 0 || q === 0) return "";
        let K = A.length === 1 ? A[0] : Buffer.concat(A, q),
            Y = K.length,
            z = Y > 2 && K[0] === 239 && K[1] === 187 && K[2] === 191 ? 3 : 0;
        return K.utf8Slice(z, Y)
    }

    function ih8(A, q) {
        if (A.length === 0 || q === 0) return new Uint8Array(0);
        if (A.length === 1) return new Uint8Array(A[0]);
        let K = new Uint8Array(Buffer.allocUnsafeSlow(q).buffer),
            Y = 0;
        for (let z = 0; z < A.length; ++z) {
            let w = A[z];
            K.set(w, Y), Y += w.length
        }
        return K
    }

    function nh8(A) {
        let {
            type: q,
            body: K,
            resolve: Y,
            stream: z,
            length: w
        } = A;
        try {
            if (q === "text") Y(kr6(K, w));
            else if (q === "json") Y(JSON.parse(kr6(K, w)));
            else if (q === "arrayBuffer") Y(ih8(K, w).buffer);
            else if (q === "blob") Y(new Blob(K, {
                type: z[sh8]
            }));
            else if (q === "bytes") Y(ih8(K, w));
            Rr6(A)
        } catch (H) {
            z.destroy(H)
        }
    }

    function Lr6(A, q) {
        A.length += q.length, A.body.push(q)
    }

    function Rr6(A, q) {
        if (A.body === null) return;
        if (q) A.reject(q);
        else A.resolve();
        A.type = null, A.stream = null, A.resolve = null, A.reject = null, A.length = 0, A.body = null
    }
    eh8.exports = {
        Readable: th8,
        chunksDecode: kr6
    }
})
// @from(Ln 86715, Col 4)
Cr6 = R((j72, zI8) => {
    var LH3 = h1("node:assert"),
        {
            ResponseStatusCodeError: AI8
        } = Lz(),
        {
            chunksDecode: qI8
        } = yr6();
    async function RH3({
        callback: A,
        body: q,
        contentType: K,
        statusCode: Y,
        statusMessage: z,
        headers: w
    }) {
        LH3(q);
        let H = [],
            $ = 0;
        try {
            for await (let X of q) if (H.push(X), $ += X.length, $ > 131072) {
                H = [], $ = 0;
                break
            }
        } catch {
            H = [], $ = 0
        }
        let O = `Response status code ${Y}${z?`: ${z}`:""}`;
        if (Y === 204 || !K || !$) {
            queueMicrotask(() => A(new AI8(O, Y, w)));
            return
        }
        let _ = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        let J;
        try {
            if (KI8(K)) J = JSON.parse(qI8(H, $));
            else if (YI8(K)) J = qI8(H, $)
        } catch {} finally {
            Error.stackTraceLimit = _
        }
        queueMicrotask(() => A(new AI8(O, Y, w, J)))
    }
    var KI8 = (A) => {
            return A.length > 15 && A[11] === "/" && A[0] === "a" && A[1] === "p" && A[2] === "p" && A[3] === "l" && A[4] === "i" && A[5] === "c" && A[6] === "a" && A[7] === "t" && A[8] === "i" && A[9] === "o" && A[10] === "n" && A[12] === "j" && A[13] === "s" && A[14] === "o" && A[15] === "n"
        },
        YI8 = (A) => {
            return A.length > 4 && A[4] === "/" && A[0] === "t" && A[1] === "e" && A[2] === "x" && A[3] === "t"
        };
    zI8.exports = {
        getResolveErrorBodyCallback: RH3,
        isContentTypeApplicationJson: KI8,
        isContentTypeText: YI8
    }
})
// @from(Ln 86770, Col 4)
$I8 = R((M72, hr6) => {
    var yH3 = h1("node:assert"),
        {
            Readable: CH3
        } = yr6(),
        {
            InvalidArgumentError: u$1,
            RequestAbortedError: wI8
        } = Lz(),
        BT = W9(),
        {
            getResolveErrorBodyCallback: SH3
        } = Cr6(),
        {
            AsyncResource: hH3
        } = h1("node:async_hooks");
    class Sr6 extends hH3 {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new u$1("invalid opts");
            let {
                signal: K,
                method: Y,
                opaque: z,
                body: w,
                onInfo: H,
                responseHeaders: $,
                throwOnError: O,
                highWaterMark: _
            } = A;
            try {
                if (typeof q !== "function") throw new u$1("invalid callback");
                if (_ && (typeof _ !== "number" || _ < 0)) throw new u$1("invalid highWaterMark");
                if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new u$1("signal must be an EventEmitter or EventTarget");
                if (Y === "CONNECT") throw new u$1("invalid method");
                if (H && typeof H !== "function") throw new u$1("invalid onInfo callback");
                super("UNDICI_REQUEST")
            } catch (J) {
                if (BT.isStream(w)) BT.destroy(w.on("error", BT.nop), J);
                throw J
            }
            if (this.method = Y, this.responseHeaders = $ || null, this.opaque = z || null, this.callback = q, this.res = null, this.abort = null, this.body = w, this.trailers = {}, this.context = null, this.onInfo = H || null, this.throwOnError = O, this.highWaterMark = _, this.signal = K, this.reason = null, this.removeAbortListener = null, BT.isStream(w)) w.on("error", (J) => {
                this.onError(J)
            });
            if (this.signal)
                if (this.signal.aborted) this.reason = this.signal.reason ?? new wI8;
                else this.removeAbortListener = BT.addAbortListener(this.signal, () => {
                    if (this.reason = this.signal.reason ?? new wI8, this.res) BT.destroy(this.res.on("error", BT.nop), this.reason);
                    else if (this.abort) this.abort(this.reason);
                    if (this.removeAbortListener) this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
                })
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            yH3(this.callback), this.abort = A, this.context = q
        }
        onHeaders(A, q, K, Y) {
            let {
                callback: z,
                opaque: w,
                abort: H,
                context: $,
                responseHeaders: O,
                highWaterMark: _
            } = this, J = O === "raw" ? BT.parseRawHeaders(q) : BT.parseHeaders(q);
            if (A < 200) {
                if (this.onInfo) this.onInfo({
                    statusCode: A,
                    headers: J
                });
                return
            }
            let X = O === "raw" ? BT.parseHeaders(q) : J,
                D = X["content-type"],
                j = X["content-length"],
                M = new CH3({
                    resume: K,
                    abort: H,
                    contentType: D,
                    contentLength: this.method !== "HEAD" && j ? Number(j) : null,
                    highWaterMark: _
                });
            if (this.removeAbortListener) M.on("close", this.removeAbortListener);
            if (this.callback = null, this.res = M, z !== null)
                if (this.throwOnError && A >= 400) this.runInAsyncScope(SH3, null, {
                    callback: z,
                    body: M,
                    contentType: D,
                    statusCode: A,
                    statusMessage: Y,
                    headers: J
                });
                else this.runInAsyncScope(z, null, null, {
                    statusCode: A,
                    headers: J,
                    trailers: this.trailers,
                    opaque: w,
                    body: M,
                    context: $
                })
        }
        onData(A) {
            return this.res.push(A)
        }
        onComplete(A) {
            BT.parseHeaders(A, this.trailers), this.res.push(null)
        }
        onError(A) {
            let {
                res: q,
                callback: K,
                body: Y,
                opaque: z
            } = this;
            if (K) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(K, null, A, {
                    opaque: z
                })
            });
            if (q) this.res = null, queueMicrotask(() => {
                BT.destroy(q, A)
            });
            if (Y) this.body = null, BT.destroy(Y, A);
            if (this.removeAbortListener) q?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
        }
    }

    function HI8(A, q) {
        if (q === void 0) return new Promise((K, Y) => {
            HI8.call(this, A, (z, w) => {
                return z ? Y(z) : K(w)
            })
        });
        try {
            this.dispatch(A, new Sr6(A, q))
        } catch (K) {
            if (typeof q !== "function") throw K;
            let Y = A?.opaque;
            queueMicrotask(() => q(K, {
                opaque: Y
            }))
        }
    }
    hr6.exports = HI8;
    hr6.exports.RequestHandler = Sr6
})
// @from(Ln 86918, Col 4)
lk1 = R((P72, JI8) => {
    var {
        addAbortListener: IH3
    } = W9(), {
        RequestAbortedError: xH3
    } = Lz(), B$1 = Symbol("kListener"), Sb = Symbol("kSignal");

    function OI8(A) {
        if (A.abort) A.abort(A[Sb]?.reason);
        else A.reason = A[Sb]?.reason ?? new xH3;
        _I8(A)
    }

    function bH3(A, q) {
        if (A.reason = null, A[Sb] = null, A[B$1] = null, !q) return;
        if (q.aborted) {
            OI8(A);
            return
        }
        A[Sb] = q, A[B$1] = () => {
            OI8(A)
        }, IH3(A[Sb], A[B$1])
    }

    function _I8(A) {
        if (!A[Sb]) return;
        if ("removeEventListener" in A[Sb]) A[Sb].removeEventListener("abort", A[B$1]);
        else A[Sb].removeListener("abort", A[B$1]);
        A[Sb] = null, A[B$1] = null
    }
    JI8.exports = {
        addSignal: bH3,
        removeSignal: _I8
    }
})
// @from(Ln 86953, Col 4)
PI8 = R((W72, MI8) => {
    var uH3 = h1("node:assert"),
        {
            finished: BH3,
            PassThrough: mH3
        } = h1("node:stream"),
        {
            InvalidArgumentError: m$1,
            InvalidReturnValueError: FH3
        } = Lz(),
        uC = W9(),
        {
            getResolveErrorBodyCallback: QH3
        } = Cr6(),
        {
            AsyncResource: gH3
        } = h1("node:async_hooks"),
        {
            addSignal: UH3,
            removeSignal: XI8
        } = lk1();
    class DI8 extends gH3 {
        constructor(A, q, K) {
            if (!A || typeof A !== "object") throw new m$1("invalid opts");
            let {
                signal: Y,
                method: z,
                opaque: w,
                body: H,
                onInfo: $,
                responseHeaders: O,
                throwOnError: _
            } = A;
            try {
                if (typeof K !== "function") throw new m$1("invalid callback");
                if (typeof q !== "function") throw new m$1("invalid factory");
                if (Y && typeof Y.on !== "function" && typeof Y.addEventListener !== "function") throw new m$1("signal must be an EventEmitter or EventTarget");
                if (z === "CONNECT") throw new m$1("invalid method");
                if ($ && typeof $ !== "function") throw new m$1("invalid onInfo callback");
                super("UNDICI_STREAM")
            } catch (J) {
                if (uC.isStream(H)) uC.destroy(H.on("error", uC.nop), J);
                throw J
            }
            if (this.responseHeaders = O || null, this.opaque = w || null, this.factory = q, this.callback = K, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = H, this.onInfo = $ || null, this.throwOnError = _ || !1, uC.isStream(H)) H.on("error", (J) => {
                this.onError(J)
            });
            UH3(this, Y)
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            uH3(this.callback), this.abort = A, this.context = q
        }
        onHeaders(A, q, K, Y) {
            let {
                factory: z,
                opaque: w,
                context: H,
                callback: $,
                responseHeaders: O
            } = this, _ = O === "raw" ? uC.parseRawHeaders(q) : uC.parseHeaders(q);
            if (A < 200) {
                if (this.onInfo) this.onInfo({
                    statusCode: A,
                    headers: _
                });
                return
            }
            this.factory = null;
            let J;
            if (this.throwOnError && A >= 400) {
                let j = (O === "raw" ? uC.parseHeaders(q) : _)["content-type"];
                J = new mH3, this.callback = null, this.runInAsyncScope(QH3, null, {
                    callback: $,
                    body: J,
                    contentType: j,
                    statusCode: A,
                    statusMessage: Y,
                    headers: _
                })
            } else {
                if (z === null) return;
                if (J = this.runInAsyncScope(z, null, {
                        statusCode: A,
                        headers: _,
                        opaque: w,
                        context: H
                    }), !J || typeof J.write !== "function" || typeof J.end !== "function" || typeof J.on !== "function") throw new FH3("expected Writable");
                BH3(J, {
                    readable: !1
                }, (D) => {
                    let {
                        callback: j,
                        res: M,
                        opaque: P,
                        trailers: W,
                        abort: G
                    } = this;
                    if (this.res = null, D || !M.readable) uC.destroy(M, D);
                    if (this.callback = null, this.runInAsyncScope(j, null, D || null, {
                            opaque: P,
                            trailers: W
                        }), D) G()
                })
            }
            return J.on("drain", K), this.res = J, (J.writableNeedDrain !== void 0 ? J.writableNeedDrain : J._writableState?.needDrain) !== !0
        }
        onData(A) {
            let {
                res: q
            } = this;
            return q ? q.write(A) : !0
        }
        onComplete(A) {
            let {
                res: q
            } = this;
            if (XI8(this), !q) return;
            this.trailers = uC.parseHeaders(A), q.end()
        }
        onError(A) {
            let {
                res: q,
                callback: K,
                opaque: Y,
                body: z
            } = this;
            if (XI8(this), this.factory = null, q) this.res = null, uC.destroy(q, A);
            else if (K) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(K, null, A, {
                    opaque: Y
                })
            });
            if (z) this.body = null, uC.destroy(z, A)
        }
    }

    function jI8(A, q, K) {
        if (K === void 0) return new Promise((Y, z) => {
            jI8.call(this, A, q, (w, H) => {
                return w ? z(w) : Y(H)
            })
        });
        try {
            this.dispatch(A, new DI8(A, q, K))
        } catch (Y) {
            if (typeof K !== "function") throw Y;
            let z = A?.opaque;
            queueMicrotask(() => K(Y, {
                opaque: z
            }))
        }
    }
    MI8.exports = jI8
})
// @from(Ln 87111, Col 4)
TI8 = R((G72, NI8) => {
    var {
        Readable: GI8,
        Duplex: pH3,
        PassThrough: dH3
    } = h1("node:stream"), {
        InvalidArgumentError: ik1,
        InvalidReturnValueError: cH3,
        RequestAbortedError: Ir6
    } = Lz(), Qk = W9(), {
        AsyncResource: lH3
    } = h1("node:async_hooks"), {
        addSignal: iH3,
        removeSignal: nH3
    } = lk1(), WI8 = h1("node:assert"), F$1 = Symbol("resume");
    class ZI8 extends GI8 {
        constructor() {
            super({
                autoDestroy: !0
            });
            this[F$1] = null
        }
        _read() {
            let {
                [F$1]: A
            } = this;
            if (A) this[F$1] = null, A()
        }
        _destroy(A, q) {
            this._read(), q(A)
        }
    }
    class fI8 extends GI8 {
        constructor(A) {
            super({
                autoDestroy: !0
            });
            this[F$1] = A
        }
        _read() {
            this[F$1]()
        }
        _destroy(A, q) {
            if (!A && !this._readableState.endEmitted) A = new Ir6;
            q(A)
        }
    }
    class VI8 extends lH3 {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new ik1("invalid opts");
            if (typeof q !== "function") throw new ik1("invalid handler");
            let {
                signal: K,
                method: Y,
                opaque: z,
                onInfo: w,
                responseHeaders: H
            } = A;
            if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new ik1("signal must be an EventEmitter or EventTarget");
            if (Y === "CONNECT") throw new ik1("invalid method");
            if (w && typeof w !== "function") throw new ik1("invalid onInfo callback");
            super("UNDICI_PIPELINE");
            this.opaque = z || null, this.responseHeaders = H || null, this.handler = q, this.abort = null, this.context = null, this.onInfo = w || null, this.req = new ZI8().on("error", Qk.nop), this.ret = new pH3({
                readableObjectMode: A.objectMode,
                autoDestroy: !0,
                read: () => {
                    let {
                        body: $
                    } = this;
                    if ($?.resume) $.resume()
                },
                write: ($, O, _) => {
                    let {
                        req: J
                    } = this;
                    if (J.push($, O) || J._readableState.destroyed) _();
                    else J[F$1] = _
                },
                destroy: ($, O) => {
                    let {
                        body: _,
                        req: J,
                        res: X,
                        ret: D,
                        abort: j
                    } = this;
                    if (!$ && !D._readableState.endEmitted) $ = new Ir6;
                    if (j && $) j();
                    Qk.destroy(_, $), Qk.destroy(J, $), Qk.destroy(X, $), nH3(this), O($)
                }
            }).on("prefinish", () => {
                let {
                    req: $
                } = this;
                $.push(null)
            }), this.res = null, iH3(this, K)
        }
        onConnect(A, q) {
            let {
                ret: K,
                res: Y
            } = this;
            if (this.reason) {
                A(this.reason);
                return
            }
            WI8(!Y, "pipeline cannot be retried"), WI8(!K.destroyed), this.abort = A, this.context = q
        }
        onHeaders(A, q, K) {
            let {
                opaque: Y,
                handler: z,
                context: w
            } = this;
            if (A < 200) {
                if (this.onInfo) {
                    let $ = this.responseHeaders === "raw" ? Qk.parseRawHeaders(q) : Qk.parseHeaders(q);
                    this.onInfo({
                        statusCode: A,
                        headers: $
                    })
                }
                return
            }
            this.res = new fI8(K);
            let H;
            try {
                this.handler = null;
                let $ = this.responseHeaders === "raw" ? Qk.parseRawHeaders(q) : Qk.parseHeaders(q);
                H = this.runInAsyncScope(z, null, {
                    statusCode: A,
                    headers: $,
                    opaque: Y,
                    body: this.res,
                    context: w
                })
            } catch ($) {
                throw this.res.on("error", Qk.nop), $
            }
            if (!H || typeof H.on !== "function") throw new cH3("expected Readable");
            H.on("data", ($) => {
                let {
                    ret: O,
                    body: _
                } = this;
                if (!O.push($) && _.pause) _.pause()
            }).on("error", ($) => {
                let {
                    ret: O
                } = this;
                Qk.destroy(O, $)
            }).on("end", () => {
                let {
                    ret: $
                } = this;
                $.push(null)
            }).on("close", () => {
                let {
                    ret: $
                } = this;
                if (!$._readableState.ended) Qk.destroy($, new Ir6)
            }), this.body = H
        }
        onData(A) {
            let {
                res: q
            } = this;
            return q.push(A)
        }
        onComplete(A) {
            let {
                res: q
            } = this;
            q.push(null)
        }
        onError(A) {
            let {
                ret: q
            } = this;
            this.handler = null, Qk.destroy(q, A)
        }
    }

    function rH3(A, q) {
        try {
            let K = new VI8(A, q);
            return this.dispatch({
                ...A,
                body: K.req
            }, K), K.ret
        } catch (K) {
            return new dH3().destroy(K)
        }
    }
    NI8.exports = rH3
})
// @from(Ln 87307, Col 4)
CI8 = R((Z72, yI8) => {
    var {
        InvalidArgumentError: xr6,
        SocketError: oH3
    } = Lz(), {
        AsyncResource: aH3
    } = h1("node:async_hooks"), vI8 = W9(), {
        addSignal: sH3,
        removeSignal: EI8
    } = lk1(), kI8 = h1("node:assert");
    class LI8 extends aH3 {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new xr6("invalid opts");
            if (typeof q !== "function") throw new xr6("invalid callback");
            let {
                signal: K,
                opaque: Y,
                responseHeaders: z
            } = A;
            if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new xr6("signal must be an EventEmitter or EventTarget");
            super("UNDICI_UPGRADE");
            this.responseHeaders = z || null, this.opaque = Y || null, this.callback = q, this.abort = null, this.context = null, sH3(this, K)
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            kI8(this.callback), this.abort = A, this.context = null
        }
        onHeaders() {
            throw new oH3("bad upgrade", null)
        }
        onUpgrade(A, q, K) {
            kI8(A === 101);
            let {
                callback: Y,
                opaque: z,
                context: w
            } = this;
            EI8(this), this.callback = null;
            let H = this.responseHeaders === "raw" ? vI8.parseRawHeaders(q) : vI8.parseHeaders(q);
            this.runInAsyncScope(Y, null, null, {
                headers: H,
                socket: K,
                opaque: z,
                context: w
            })
        }
        onError(A) {
            let {
                callback: q,
                opaque: K
            } = this;
            if (EI8(this), q) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(q, null, A, {
                    opaque: K
                })
            })
        }
    }

    function RI8(A, q) {
        if (q === void 0) return new Promise((K, Y) => {
            RI8.call(this, A, (z, w) => {
                return z ? Y(z) : K(w)
            })
        });
        try {
            let K = new LI8(A, q);
            this.dispatch({
                ...A,
                method: A.method || "GET",
                upgrade: A.protocol || "Websocket"
            }, K)
        } catch (K) {
            if (typeof q !== "function") throw K;
            let Y = A?.opaque;
            queueMicrotask(() => q(K, {
                opaque: Y
            }))
        }
    }
    yI8.exports = RI8
})
// @from(Ln 87392, Col 4)
uI8 = R((f72, bI8) => {
    var tH3 = h1("node:assert"),
        {
            AsyncResource: eH3
        } = h1("node:async_hooks"),
        {
            InvalidArgumentError: br6,
            SocketError: A$3
        } = Lz(),
        SI8 = W9(),
        {
            addSignal: q$3,
            removeSignal: hI8
        } = lk1();
    class II8 extends eH3 {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new br6("invalid opts");
            if (typeof q !== "function") throw new br6("invalid callback");
            let {
                signal: K,
                opaque: Y,
                responseHeaders: z
            } = A;
            if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new br6("signal must be an EventEmitter or EventTarget");
            super("UNDICI_CONNECT");
            this.opaque = Y || null, this.responseHeaders = z || null, this.callback = q, this.abort = null, q$3(this, K)
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            tH3(this.callback), this.abort = A, this.context = q
        }
        onHeaders() {
            throw new A$3("bad connect", null)
        }
        onUpgrade(A, q, K) {
            let {
                callback: Y,
                opaque: z,
                context: w
            } = this;
            hI8(this), this.callback = null;
            let H = q;
            if (H != null) H = this.responseHeaders === "raw" ? SI8.parseRawHeaders(q) : SI8.parseHeaders(q);
            this.runInAsyncScope(Y, null, null, {
                statusCode: A,
                headers: H,
                socket: K,
                opaque: z,
                context: w
            })
        }
        onError(A) {
            let {
                callback: q,
                opaque: K
            } = this;
            if (hI8(this), q) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(q, null, A, {
                    opaque: K
                })
            })
        }
    }

    function xI8(A, q) {
        if (q === void 0) return new Promise((K, Y) => {
            xI8.call(this, A, (z, w) => {
                return z ? Y(z) : K(w)
            })
        });
        try {
            let K = new II8(A, q);
            this.dispatch({
                ...A,
                method: "CONNECT"
            }, K)
        } catch (K) {
            if (typeof q !== "function") throw K;
            let Y = A?.opaque;
            queueMicrotask(() => q(K, {
                opaque: Y
            }))
        }
    }
    bI8.exports = xI8
})
// @from(Ln 87481, Col 4)
BI8 = R((K$3, Q$1) => {
    K$3.request = $I8();
    K$3.stream = PI8();
    K$3.pipeline = TI8();
    K$3.upgrade = CI8();
    K$3.connect = uI8()
})
// @from(Ln 87488, Col 4)
Br6 = R((V72, mI8) => {
    var {
        UndiciError: O$3
    } = Lz();
    class ur6 extends O$3 {
        constructor(A) {
            super(A);
            Error.captureStackTrace(this, ur6), this.name = "MockNotMatchedError", this.message = A || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED"
        }
    }
    mI8.exports = {
        MockNotMatchedError: ur6
    }
})
// @from(Ln 87502, Col 4)
g$1 = R((N72, FI8) => {
    FI8.exports = {
        kAgent: Symbol("agent"),
        kOptions: Symbol("options"),
        kFactory: Symbol("factory"),
        kDispatches: Symbol("dispatches"),
        kDispatchKey: Symbol("dispatch key"),
        kDefaultHeaders: Symbol("default headers"),
        kDefaultTrailers: Symbol("default trailers"),
        kContentLength: Symbol("content length"),
        kMockAgent: Symbol("mock agent"),
        kMockAgentSet: Symbol("mock agent set"),
        kMockAgentGet: Symbol("mock agent get"),
        kMockDispatch: Symbol("mock dispatch"),
        kClose: Symbol("close"),
        kOriginalClose: Symbol("original agent close"),
        kOrigin: Symbol("origin"),
        kIsMockActive: Symbol("is mock active"),
        kNetConnect: Symbol("net connect"),
        kGetNetConnect: Symbol("get net connect"),
        kConnected: Symbol("connected")
    }
})
// @from(Ln 87525, Col 4)
nk1 = R((T72, oI8) => {
    var {
        MockNotMatchedError: oA1
    } = Br6(), {
        kDispatches: P66,
        kMockAgent: _$3,
        kOriginalDispatch: J$3,
        kOrigin: X$3,
        kGetNetConnect: D$3
    } = g$1(), {
        buildURL: j$3
    } = W9(), {
        STATUS_CODES: M$3
    } = h1("node:http"), {
        types: {
            isPromise: P$3
        }
    } = h1("node:util");

    function Pg(A, q) {
        if (typeof A === "string") return A === q;
        if (A instanceof RegExp) return A.test(q);
        if (typeof A === "function") return A(q) === !0;
        return !1
    }

    function gI8(A) {
        return Object.fromEntries(Object.entries(A).map(([q, K]) => {
            return [q.toLocaleLowerCase(), K]
        }))
    }

    function UI8(A, q) {
        if (Array.isArray(A)) {
            for (let K = 0; K < A.length; K += 2)
                if (A[K].toLocaleLowerCase() === q.toLocaleLowerCase()) return A[K + 1];
            return
        } else if (typeof A.get === "function") return A.get(q);
        else return gI8(A)[q.toLocaleLowerCase()]
    }

    function Qr6(A) {
        let q = A.slice(),
            K = [];
        for (let Y = 0; Y < q.length; Y += 2) K.push([q[Y], q[Y + 1]]);
        return Object.fromEntries(K)
    }

    function pI8(A, q) {
        if (typeof A.headers === "function") {
            if (Array.isArray(q)) q = Qr6(q);
            return A.headers(q ? gI8(q) : {})
        }
        if (typeof A.headers > "u") return !0;
        if (typeof q !== "object" || typeof A.headers !== "object") return !1;
        for (let [K, Y] of Object.entries(A.headers)) {
            let z = UI8(q, K);
            if (!Pg(Y, z)) return !1
        }
        return !0
    }

    function QI8(A) {
        if (typeof A !== "string") return A;
        let q = A.split("?");
        if (q.length !== 2) return A;
        let K = new URLSearchParams(q.pop());
        return K.sort(), [...q, K.toString()].join("?")
    }

    function W$3(A, {
        path: q,
        method: K,
        body: Y,
        headers: z
    }) {
        let w = Pg(A.path, q),
            H = Pg(A.method, K),
            $ = typeof A.body < "u" ? Pg(A.body, Y) : !0,
            O = pI8(A, z);
        return w && H && $ && O
    }

    function dI8(A) {
        if (Buffer.isBuffer(A)) return A;
        else if (A instanceof Uint8Array) return A;
        else if (A instanceof ArrayBuffer) return A;
        else if (typeof A === "object") return JSON.stringify(A);
        else return A.toString()
    }

    function cI8(A, q) {
        let K = q.query ? j$3(q.path, q.query) : q.path,
            Y = typeof K === "string" ? QI8(K) : K,
            z = A.filter(({
                consumed: w
            }) => !w).filter(({
                path: w
            }) => Pg(QI8(w), Y));
        if (z.length === 0) throw new oA1(`Mock dispatch not matched for path '${Y}'`);
        if (z = z.filter(({
                method: w
            }) => Pg(w, q.method)), z.length === 0) throw new oA1(`Mock dispatch not matched for method '${q.method}' on path '${Y}'`);
        if (z = z.filter(({
                body: w
            }) => typeof w < "u" ? Pg(w, q.body) : !0), z.length === 0) throw new oA1(`Mock dispatch not matched for body '${q.body}' on path '${Y}'`);
        if (z = z.filter((w) => pI8(w, q.headers)), z.length === 0) {
            let w = typeof q.headers === "object" ? JSON.stringify(q.headers) : q.headers;
            throw new oA1(`Mock dispatch not matched for headers '${w}' on path '${Y}'`)
        }
        return z[0]
    }

    function G$3(A, q, K) {
        let Y = {
                timesInvoked: 0,
                times: 1,
                persist: !1,
                consumed: !1
            },
            z = typeof K === "function" ? {
                callback: K
            } : {
                ...K
            },
            w = {
                ...Y,
                ...q,
                pending: !0,
                data: {
                    error: null,
                    ...z
                }
            };
        return A.push(w), w
    }

    function mr6(A, q) {
        let K = A.findIndex((Y) => {
            if (!Y.consumed) return !1;
            return W$3(Y, q)
        });
        if (K !== -1) A.splice(K, 1)
    }

    function lI8(A) {
        let {
            path: q,
            method: K,
            body: Y,
            headers: z,
            query: w
        } = A;
        return {
            path: q,
            method: K,
            body: Y,
            headers: z,
            query: w
        }
    }

    function Fr6(A) {
        let q = Object.keys(A),
            K = [];
        for (let Y = 0; Y < q.length; ++Y) {
            let z = q[Y],
                w = A[z],
                H = Buffer.from(`${z}`);
            if (Array.isArray(w))
                for (let $ = 0; $ < w.length; ++$) K.push(H, Buffer.from(`${w[$]}`));
            else K.push(H, Buffer.from(`${w}`))
        }
        return K
    }

    function iI8(A) {
        return M$3[A] || "unknown"
    }
    async function Z$3(A) {
        let q = [];
        for await (let K of A) q.push(K);
        return Buffer.concat(q).toString("utf8")
    }

    function nI8(A, q) {
        let K = lI8(A),
            Y = cI8(this[P66], K);
        if (Y.timesInvoked++, Y.data.callback) Y.data = {
            ...Y.data,
            ...Y.data.callback(A)
        };
        let {
            data: {
                statusCode: z,
                data: w,
                headers: H,
                trailers: $,
                error: O
            },
            delay: _,
            persist: J
        } = Y, {
            timesInvoked: X,
            times: D
        } = Y;
        if (Y.consumed = !J && X >= D, Y.pending = X < D, O !== null) return mr6(this[P66], K), q.onError(O), !0;
        if (typeof _ === "number" && _ > 0) setTimeout(() => {
            j(this[P66])
        }, _);
        else j(this[P66]);

        function j(P, W = w) {
            let G = Array.isArray(A.headers) ? Qr6(A.headers) : A.headers,
                f = typeof W === "function" ? W({
                    ...A,
                    headers: G
                }) : W;
            if (P$3(f)) {
                f.then((k) => j(P, k));
                return
            }
            let Z = dI8(f),
                N = Fr6(H),
                T = Fr6($);
            q.onConnect?.((k) => q.onError(k), null), q.onHeaders?.(z, N, M, iI8(z)), q.onData?.(Buffer.from(Z)), q.onComplete?.(T), mr6(P, K)
        }

        function M() {}
        return !0
    }

    function f$3() {
        let A = this[_$3],
            q = this[X$3],
            K = this[J$3];
        return function(z, w) {
            if (A.isMockActive) try {
                nI8.call(this, z, w)
            } catch (H) {
                if (H instanceof oA1) {
                    let $ = A[D$3]();
                    if ($ === !1) throw new oA1(`${H.message}: subsequent request to origin ${q} was not allowed (net.connect disabled)`);
                    if (rI8($, q)) K.call(this, z, w);
                    else throw new oA1(`${H.message}: subsequent request to origin ${q} was not allowed (net.connect is not enabled for this origin)`)
                } else throw H
            } else K.call(this, z, w)
        }
    }

    function rI8(A, q) {
        let K = new URL(q);
        if (A === !0) return !0;
        else if (Array.isArray(A) && A.some((Y) => Pg(Y, K.host))) return !0;
        return !1
    }

    function V$3(A) {
        if (A) {
            let {
                agent: q,
                ...K
            } = A;
            return K
        }
    }
    oI8.exports = {
        getResponseData: dI8,
        getMockDispatch: cI8,
        addMockDispatch: G$3,
        deleteMockDispatch: mr6,
        buildKey: lI8,
        generateKeyValues: Fr6,
        matchValue: Pg,
        getResponse: Z$3,
        getStatusText: iI8,
        mockDispatch: nI8,
        buildMockDispatch: f$3,
        checkNetConnect: rI8,
        buildMockOptions: V$3,
        getHeaderByName: UI8,
        buildHeadersFromArray: Qr6
    }
})
// @from(Ln 87809, Col 4)
lr6 = R((E$3, cr6) => {
    var {
        getResponseData: N$3,
        buildKey: T$3,
        addMockDispatch: gr6
    } = nk1(), {
        kDispatches: W66,
        kDispatchKey: G66,
        kDefaultHeaders: Ur6,
        kDefaultTrailers: pr6,
        kContentLength: dr6,
        kMockDispatch: Z66
    } = g$1(), {
        InvalidArgumentError: hb
    } = Lz(), {
        buildURL: v$3
    } = W9();
    class rk1 {
        constructor(A) {
            this[Z66] = A
        }
        delay(A) {
            if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new hb("waitInMs must be a valid integer > 0");
            return this[Z66].delay = A, this
        }
        persist() {
            return this[Z66].persist = !0, this
        }
        times(A) {
            if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new hb("repeatTimes must be a valid integer > 0");
            return this[Z66].times = A, this
        }
    }
    class aI8 {
        constructor(A, q) {
            if (typeof A !== "object") throw new hb("opts must be an object");
            if (typeof A.path > "u") throw new hb("opts.path must be defined");
            if (typeof A.method > "u") A.method = "GET";
            if (typeof A.path === "string")
                if (A.query) A.path = v$3(A.path, A.query);
                else {
                    let K = new URL(A.path, "data://");
                    A.path = K.pathname + K.search
                } if (typeof A.method === "string") A.method = A.method.toUpperCase();
            this[G66] = T$3(A), this[W66] = q, this[Ur6] = {}, this[pr6] = {}, this[dr6] = !1
        }
        createMockScopeDispatchData({
            statusCode: A,
            data: q,
            responseOptions: K
        }) {
            let Y = N$3(q),
                z = this[dr6] ? {
                    "content-length": Y.length
                } : {},
                w = {
                    ...this[Ur6],
                    ...z,
                    ...K.headers
                },
                H = {
                    ...this[pr6],
                    ...K.trailers
                };
            return {
                statusCode: A,
                data: q,
                headers: w,
                trailers: H
            }
        }
        validateReplyParameters(A) {
            if (typeof A.statusCode > "u") throw new hb("statusCode must be defined");
            if (typeof A.responseOptions !== "object" || A.responseOptions === null) throw new hb("responseOptions must be an object")
        }
        reply(A) {
            if (typeof A === "function") {
                let z = (H) => {
                        let $ = A(H);
                        if (typeof $ !== "object" || $ === null) throw new hb("reply options callback must return an object");
                        let O = {
                            data: "",
                            responseOptions: {},
                            ...$
                        };
                        return this.validateReplyParameters(O), {
                            ...this.createMockScopeDispatchData(O)
                        }
                    },
                    w = gr6(this[W66], this[G66], z);
                return new rk1(w)
            }
            let q = {
                statusCode: A,
                data: arguments[1] === void 0 ? "" : arguments[1],
                responseOptions: arguments[2] === void 0 ? {} : arguments[2]
            };
            this.validateReplyParameters(q);
            let K = this.createMockScopeDispatchData(q),
                Y = gr6(this[W66], this[G66], K);
            return new rk1(Y)
        }
        replyWithError(A) {
            if (typeof A > "u") throw new hb("error must be defined");
            let q = gr6(this[W66], this[G66], {
                error: A
            });
            return new rk1(q)
        }
        defaultReplyHeaders(A) {
            if (typeof A > "u") throw new hb("headers must be defined");
            return this[Ur6] = A, this
        }
        defaultReplyTrailers(A) {
            if (typeof A > "u") throw new hb("trailers must be defined");
            return this[pr6] = A, this
        }
        replyContentLength() {
            return this[dr6] = !0, this
        }
    }
    E$3.MockInterceptor = aI8;
    E$3.MockScope = rk1
})
// @from(Ln 87933, Col 4)
nr6 = R((v72, zx8) => {
    var {
        promisify: R$3
    } = h1("node:util"), y$3 = uk1(), {
        buildMockDispatch: C$3
    } = nk1(), {
        kDispatches: sI8,
        kMockAgent: tI8,
        kClose: eI8,
        kOriginalClose: Ax8,
        kOrigin: qx8,
        kOriginalDispatch: S$3,
        kConnected: ir6
    } = g$1(), {
        MockInterceptor: h$3
    } = lr6(), Kx8 = h$(), {
        InvalidArgumentError: I$3
    } = Lz();
    class Yx8 extends y$3 {
        constructor(A, q) {
            super(A, q);
            if (!q || !q.agent || typeof q.agent.dispatch !== "function") throw new I$3("Argument opts.agent must implement Agent");
            this[tI8] = q.agent, this[qx8] = A, this[sI8] = [], this[ir6] = 1, this[S$3] = this.dispatch, this[Ax8] = this.close.bind(this), this.dispatch = C$3.call(this), this.close = this[eI8]
        }
        get[Kx8.kConnected]() {
            return this[ir6]
        }
        intercept(A) {
            return new h$3(A, this[sI8])
        }
        async [eI8]() {
            await R$3(this[Ax8])(), this[ir6] = 0, this[tI8][Kx8.kClients].delete(this[qx8])
        }
    }
    zx8.exports = Yx8
})
// @from(Ln 87969, Col 4)
or6 = R((E72, Dx8) => {
    var {
        promisify: x$3
    } = h1("node:util"), b$3 = I$1(), {
        buildMockDispatch: u$3
    } = nk1(), {
        kDispatches: wx8,
        kMockAgent: Hx8,
        kClose: $x8,
        kOriginalClose: Ox8,
        kOrigin: _x8,
        kOriginalDispatch: B$3,
        kConnected: rr6
    } = g$1(), {
        MockInterceptor: m$3
    } = lr6(), Jx8 = h$(), {
        InvalidArgumentError: F$3
    } = Lz();
    class Xx8 extends b$3 {
        constructor(A, q) {
            super(A, q);
            if (!q || !q.agent || typeof q.agent.dispatch !== "function") throw new F$3("Argument opts.agent must implement Agent");
            this[Hx8] = q.agent, this[_x8] = A, this[wx8] = [], this[rr6] = 1, this[B$3] = this.dispatch, this[Ox8] = this.close.bind(this), this.dispatch = u$3.call(this), this.close = this[$x8]
        }
        get[Jx8.kConnected]() {
            return this[rr6]
        }
        intercept(A) {
            return new m$3(A, this[wx8])
        }
        async [$x8]() {
            await x$3(this[Ox8])(), this[rr6] = 0, this[Hx8][Jx8.kClients].delete(this[_x8])
        }
    }
    Dx8.exports = Xx8
})
// @from(Ln 88005, Col 4)
Mx8 = R((k72, jx8) => {
    var Q$3 = {
            pronoun: "it",
            is: "is",
            was: "was",
            this: "this"
        },
        g$3 = {
            pronoun: "they",
            is: "are",
            was: "were",
            this: "these"
        };
    jx8.exports = class {
        constructor(q, K) {
            this.singular = q, this.plural = K
        }
        pluralize(q) {
            let K = q === 1,
                Y = K ? Q$3 : g$3,
                z = K ? this.singular : this.plural;
            return {
                ...Y,
                count: q,
                noun: z
            }
        }
    }
})
// @from(Ln 88034, Col 4)
Wx8 = R((L72, Px8) => {
    var {
        Transform: U$3
    } = h1("node:stream"), {
        Console: p$3
    } = h1("node:console"), d$3 = process.versions.icu ? "✅" : "Y ", c$3 = process.versions.icu ? "❌" : "N ";
    Px8.exports = class {
        constructor({
            disableColors: q
        } = {}) {
            this.transform = new U$3({
                transform(K, Y, z) {
                    z(null, K)
                }
            }), this.logger = new p$3({
                stdout: this.transform,
                inspectOptions: {
                    colors: !q && !0
                }
            })
        }
        format(q) {
            let K = q.map(({
                method: Y,
                path: z,
                data: {
                    statusCode: w
                },
                persist: H,
                times: $,
                timesInvoked: O,
                origin: _
            }) => ({
                Method: Y,
                Origin: _,
                Path: z,
                "Status code": w,
                Persistent: H ? d$3 : c$3,
                Invocations: O,
                Remaining: H ? 1 / 0 : $ - O
            }));
            return this.logger.table(K), this.transform.read().toString()
        }
    }
})