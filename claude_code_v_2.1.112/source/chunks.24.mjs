
// @from(Ln 57836, Col 4)
xG6 = p((P_O, Pl7) => {
    var ur = d6("node:assert"),
        jl7 = d6("node:net"),
        $e5 = d6("node:http"),
        oA6 = Hz(),
        {
            channels: bG6
        } = PG6(),
        je5 = iQ7(),
        He5 = fG6(),
        {
            InvalidArgumentError: eX,
            InformationalError: Je5,
            ClientDestroyedError: Xe5
        } = aA(),
        Me5 = rQ6(),
        {
            kUrl: IU,
            kServerName: a16,
            kClient: Pe5,
            kBusy: nw1,
            kConnect: We5,
            kResuming: aA6,
            kRunning: Jd6,
            kPending: Xd6,
            kSize: Hd6,
            kQueue: pm,
            kConnected: De5,
            kConnecting: IG6,
            kNeedDrain: t16,
            kKeepAliveDefaultTimeout: Yl7,
            kHostHeader: Ze5,
            kPendingIdx: Fm,
            kRunningIdx: mr,
            kError: fe5,
            kPipelining: MM8,
            kKeepAliveTimeoutValue: Ge5,
            kMaxHeadersSize: ve5,
            kKeepAliveMaxTimeout: Te5,
            kKeepAliveTimeoutThreshold: Ve5,
            kHeadersTimeout: ke5,
            kBodyTimeout: Ne5,
            kStrictContentLength: Ee5,
            kConnector: wd6,
            kMaxRedirections: ye5,
            kMaxRequests: iw1,
            kCounter: Le5,
            kClose: he5,
            kDestroy: Re5,
            kDispatch: Se5,
            kInterceptors: Al7,
            kLocalAddress: $d6,
            kMaxResponseSize: Ce5,
            kOnError: be5,
            kHTTPContext: qM,
            kMaxConcurrentStreams: Ie5,
            kResume: jd6
        } = oj(),
        xe5 = cc7(),
        ue5 = tc7(),
        Ol7 = !1,
        s16 = Symbol("kClosedResolve"),
        wl7 = () => {};

    function Hl7(q) {
        return q[MM8] ?? q[qM]?.defaultPipelining ?? 1
    }
    class Jl7 extends He5 {
        constructor(q, {
            interceptors: K,
            maxHeaderSize: _,
            headersTimeout: z,
            socketTimeout: Y,
            requestTimeout: A,
            connectTimeout: O,
            bodyTimeout: w,
            idleTimeout: $,
            keepAlive: j,
            keepAliveTimeout: H,
            maxKeepAliveTimeout: J,
            keepAliveMaxTimeout: X,
            keepAliveTimeoutThreshold: M,
            socketPath: P,
            pipelining: W,
            tls: D,
            strictContentLength: Z,
            maxCachedSessions: G,
            maxRedirections: f,
            connect: v,
            maxRequestsPerClient: V,
            localAddress: k,
            maxResponseSize: N,
            autoSelectFamily: R,
            autoSelectFamilyAttemptTimeout: h,
            maxConcurrentStreams: C,
            allowH2: x
        } = {}) {
            super();
            if (j !== void 0) throw new eX("unsupported keepAlive, use pipelining=0 instead");
            if (Y !== void 0) throw new eX("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
            if (A !== void 0) throw new eX("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
            if ($ !== void 0) throw new eX("unsupported idleTimeout, use keepAliveTimeout instead");
            if (J !== void 0) throw new eX("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
            if (_ != null && !Number.isFinite(_)) throw new eX("invalid maxHeaderSize");
            if (P != null && typeof P !== "string") throw new eX("invalid socketPath");
            if (O != null && (!Number.isFinite(O) || O < 0)) throw new eX("invalid connectTimeout");
            if (H != null && (!Number.isFinite(H) || H <= 0)) throw new eX("invalid keepAliveTimeout");
            if (X != null && (!Number.isFinite(X) || X <= 0)) throw new eX("invalid keepAliveMaxTimeout");
            if (M != null && !Number.isFinite(M)) throw new eX("invalid keepAliveTimeoutThreshold");
            if (z != null && (!Number.isInteger(z) || z < 0)) throw new eX("headersTimeout must be a positive integer or zero");
            if (w != null && (!Number.isInteger(w) || w < 0)) throw new eX("bodyTimeout must be a positive integer or zero");
            if (v != null && typeof v !== "function" && typeof v !== "object") throw new eX("connect must be a function or an object");
            if (f != null && (!Number.isInteger(f) || f < 0)) throw new eX("maxRedirections must be a positive number");
            if (V != null && (!Number.isInteger(V) || V < 0)) throw new eX("maxRequestsPerClient must be a positive number");
            if (k != null && (typeof k !== "string" || jl7.isIP(k) === 0)) throw new eX("localAddress must be valid string IP address");
            if (N != null && (!Number.isInteger(N) || N < -1)) throw new eX("maxResponseSize must be a positive number");
            if (h != null && (!Number.isInteger(h) || h < -1)) throw new eX("autoSelectFamilyAttemptTimeout must be a positive number");
            if (x != null && typeof x !== "boolean") throw new eX("allowH2 must be a valid boolean value");
            if (C != null && (typeof C !== "number" || C < 1)) throw new eX("maxConcurrentStreams must be a positive integer, greater than 0");
            if (typeof v !== "function") v = Me5({
                ...D,
                maxCachedSessions: G,
                allowH2: x,
                socketPath: P,
                timeout: O,
                ...R ? {
                    autoSelectFamily: R,
                    autoSelectFamilyAttemptTimeout: h
                } : void 0,
                ...v
            });
            if (K?.Client && Array.isArray(K.Client)) {
                if (this[Al7] = K.Client, !Ol7) Ol7 = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
                    code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
                })
            } else this[Al7] = [me5({
                maxRedirections: f
            })];
            this[IU] = oA6.parseOrigin(q), this[wd6] = v, this[MM8] = W != null ? W : 1, this[ve5] = _ || $e5.maxHeaderSize, this[Yl7] = H == null ? 4000 : H, this[Te5] = X == null ? 600000 : X, this[Ve5] = M == null ? 2000 : M, this[Ge5] = this[Yl7], this[a16] = null, this[$d6] = k != null ? k : null, this[aA6] = 0, this[t16] = 0, this[Ze5] = `host: ${this[IU].hostname}${this[IU].port?`:${this[IU].port}`:""}\r
`, this[Ne5] = w != null ? w : 300000, this[ke5] = z != null ? z : 300000, this[Ee5] = Z == null ? !0 : Z, this[ye5] = f, this[iw1] = V, this[s16] = null, this[Ce5] = N > -1 ? N : -1, this[Ie5] = C != null ? C : 100, this[qM] = null, this[pm] = [], this[mr] = 0, this[Fm] = 0, this[jd6] = (B) => rw1(this, B), this[be5] = (B) => Xl7(this, B)
        }
        get pipelining() {
            return this[MM8]
        }
        set pipelining(q) {
            this[MM8] = q, this[jd6](!0)
        }
        get[Xd6]() {
            return this[pm].length - this[Fm]
        }
        get[Jd6]() {
            return this[Fm] - this[mr]
        }
        get[Hd6]() {
            return this[pm].length - this[mr]
        }
        get[De5]() {
            return !!this[qM] && !this[IG6] && !this[qM].destroyed
        }
        get[nw1]() {
            return Boolean(this[qM]?.busy(null) || this[Hd6] >= (Hl7(this) || 1) || this[Xd6] > 0)
        } [We5](q) {
            Ml7(this), this.once("connect", q)
        } [Se5](q, K) {
            let _ = q.origin || this[IU].origin,
                z = new je5(_, q, K);
            if (this[pm].push(z), this[aA6]);
            else if (oA6.bodyLength(z.body) == null && oA6.isIterable(z.body)) this[aA6] = 1, queueMicrotask(() => rw1(this));
            else this[jd6](!0);
            if (this[aA6] && this[t16] !== 2 && this[nw1]) this[t16] = 2;
            return this[t16] < 2
        }
        async [he5]() {
            return new Promise((q) => {
                if (this[Hd6]) this[s16] = q;
                else q(null)
            })
        }
        async [Re5](q) {
            return new Promise((K) => {
                let _ = this[pm].splice(this[Fm]);
                for (let Y = 0; Y < _.length; Y++) {
                    let A = _[Y];
                    oA6.errorRequest(this, A, q)
                }
                let z = () => {
                    if (this[s16]) this[s16](), this[s16] = null;
                    K(null)
                };
                if (this[qM]) this[qM].destroy(q, z), this[qM] = null;
                else queueMicrotask(z);
                this[jd6]()
            })
        }
    }
    var me5 = XM8();

    function Xl7(q, K) {
        if (q[Jd6] === 0 && K.code !== "UND_ERR_INFO" && K.code !== "UND_ERR_SOCKET") {
            ur(q[Fm] === q[mr]);
            let _ = q[pm].splice(q[mr]);
            for (let z = 0; z < _.length; z++) {
                let Y = _[z];
                oA6.errorRequest(q, Y, K)
            }
            ur(q[Hd6] === 0)
        }
    }
    async function Ml7(q) {
        ur(!q[IG6]), ur(!q[qM]);
        let {
            host: K,
            hostname: _,
            protocol: z,
            port: Y
        } = q[IU];
        if (_[0] === "[") {
            let A = _.indexOf("]");
            ur(A !== -1);
            let O = _.substring(1, A);
            ur(jl7.isIP(O)), _ = O
        }
        if (q[IG6] = !0, bG6.beforeConnect.hasSubscribers) bG6.beforeConnect.publish({
            connectParams: {
                host: K,
                hostname: _,
                protocol: z,
                port: Y,
                version: q[qM]?.version,
                servername: q[a16],
                localAddress: q[$d6]
            },
            connector: q[wd6]
        });
        try {
            let A = await new Promise((O, w) => {
                q[wd6]({
                    host: K,
                    hostname: _,
                    protocol: z,
                    port: Y,
                    servername: q[a16],
                    localAddress: q[$d6]
                }, ($, j) => {
                    if ($) w($);
                    else O(j)
                })
            });
            if (q.destroyed) {
                oA6.destroy(A.on("error", wl7), new Xe5);
                return
            }
            ur(A);
            try {
                q[qM] = A.alpnProtocol === "h2" ? await ue5(q, A) : await xe5(q, A)
            } catch (O) {
                throw A.destroy().on("error", wl7), O
            }
            if (q[IG6] = !1, A[Le5] = 0, A[iw1] = q[iw1], A[Pe5] = q, A[fe5] = null, bG6.connected.hasSubscribers) bG6.connected.publish({
                connectParams: {
                    host: K,
                    hostname: _,
                    protocol: z,
                    port: Y,
                    version: q[qM]?.version,
                    servername: q[a16],
                    localAddress: q[$d6]
                },
                connector: q[wd6],
                socket: A
            });
            q.emit("connect", q[IU], [q])
        } catch (A) {
            if (q.destroyed) return;
            if (q[IG6] = !1, bG6.connectError.hasSubscribers) bG6.connectError.publish({
                connectParams: {
                    host: K,
                    hostname: _,
                    protocol: z,
                    port: Y,
                    version: q[qM]?.version,
                    servername: q[a16],
                    localAddress: q[$d6]
                },
                connector: q[wd6],
                error: A
            });
            if (A.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
                ur(q[Jd6] === 0);
                while (q[Xd6] > 0 && q[pm][q[Fm]].servername === q[a16]) {
                    let O = q[pm][q[Fm]++];
                    oA6.errorRequest(q, O, A)
                }
            } else Xl7(q, A);
            q.emit("connectionError", q[IU], [q], A)
        }
        q[jd6]()
    }

    function $l7(q) {
        q[t16] = 0, q.emit("drain", q[IU], [q])
    }

    function rw1(q, K) {
        if (q[aA6] === 2) return;
        if (q[aA6] = 2, Be5(q, K), q[aA6] = 0, q[mr] > 256) q[pm].splice(0, q[mr]), q[Fm] -= q[mr], q[mr] = 0
    }

    function Be5(q, K) {
        while (!0) {
            if (q.destroyed) {
                ur(q[Xd6] === 0);
                return
            }
            if (q[s16] && !q[Hd6]) {
                q[s16](), q[s16] = null;
                return
            }
            if (q[qM]) q[qM].resume();
            if (q[nw1]) q[t16] = 2;
            else if (q[t16] === 2) {
                if (K) q[t16] = 1, queueMicrotask(() => $l7(q));
                else $l7(q);
                continue
            }
            if (q[Xd6] === 0) return;
            if (q[Jd6] >= (Hl7(q) || 1)) return;
            let _ = q[pm][q[Fm]];
            if (q[IU].protocol === "https:" && q[a16] !== _.servername) {
                if (q[Jd6] > 0) return;
                q[a16] = _.servername, q[qM]?.destroy(new Je5("servername changed"), () => {
                    q[qM] = null, rw1(q)
                })
            }
            if (q[IG6]) return;
            if (!q[qM]) {
                Ml7(q);
                return
            }
            if (q[qM].destroyed) return;
            if (q[qM].busy(_)) return;
            if (!_.aborted && q[qM].write(_)) q[Fm]++;
            else q[pm].splice(q[Fm], 1)
        }
    }
    Pl7.exports = Jl7
})
// @from(Ln 58183, Col 4)
aw1 = p((W_O, Wl7) => {
    class ow1 {
        constructor() {
            this.bottom = 0, this.top = 0, this.list = Array(2048), this.next = null
        }
        isEmpty() {
            return this.top === this.bottom
        }
        isFull() {
            return (this.top + 1 & 2047) === this.bottom
        }
        push(q) {
            this.list[this.top] = q, this.top = this.top + 1 & 2047
        }
        shift() {
            let q = this.list[this.bottom];
            if (q === void 0) return null;
            return this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & 2047, q
        }
    }
    Wl7.exports = class {
        constructor() {
            this.head = this.tail = new ow1
        }
        isEmpty() {
            return this.head.isEmpty()
        }
        push(K) {
            if (this.head.isFull()) this.head = this.head.next = new ow1;
            this.head.push(K)
        }
        shift() {
            let K = this.tail,
                _ = K.shift();
            if (K.isEmpty() && K.next !== null) this.tail = K.next;
            return _
        }
    }
})
// @from(Ln 58222, Col 4)
fl7 = p((D_O, Zl7) => {
    var {
        kFree: pe5,
        kConnected: Fe5,
        kPending: ge5,
        kQueued: Ue5,
        kRunning: Qe5,
        kSize: de5
    } = oj(), sA6 = Symbol("pool");
    class Dl7 {
        constructor(q) {
            this[sA6] = q
        }
        get connected() {
            return this[sA6][Fe5]
        }
        get free() {
            return this[sA6][pe5]
        }
        get pending() {
            return this[sA6][ge5]
        }
        get queued() {
            return this[sA6][Ue5]
        }
        get running() {
            return this[sA6][Qe5]
        }
        get size() {
            return this[sA6][de5]
        }
    }
    Zl7.exports = Dl7
})
// @from(Ln 58256, Col 4)
K21 = p((Z_O, Rl7) => {
    var ce5 = fG6(),
        le5 = aw1(),
        {
            kConnected: sw1,
            kSize: Gl7,
            kRunning: vl7,
            kPending: Tl7,
            kQueued: Md6,
            kBusy: ne5,
            kFree: ie5,
            kUrl: re5,
            kClose: oe5,
            kDestroy: ae5,
            kDispatch: se5
        } = oj(),
        te5 = fl7(),
        _E = Symbol("clients"),
        CV = Symbol("needDrain"),
        Pd6 = Symbol("queue"),
        tw1 = Symbol("closed resolve"),
        ew1 = Symbol("onDrain"),
        Vl7 = Symbol("onConnect"),
        kl7 = Symbol("onDisconnect"),
        Nl7 = Symbol("onConnectionError"),
        q21 = Symbol("get dispatcher"),
        yl7 = Symbol("add client"),
        Ll7 = Symbol("remove client"),
        El7 = Symbol("stats");
    class hl7 extends ce5 {
        constructor() {
            super();
            this[Pd6] = new le5, this[_E] = [], this[Md6] = 0;
            let q = this;
            this[ew1] = function(_, z) {
                let Y = q[Pd6],
                    A = !1;
                while (!A) {
                    let O = Y.shift();
                    if (!O) break;
                    q[Md6]--, A = !this.dispatch(O.opts, O.handler)
                }
                if (this[CV] = A, !this[CV] && q[CV]) q[CV] = !1, q.emit("drain", _, [q, ...z]);
                if (q[tw1] && Y.isEmpty()) Promise.all(q[_E].map((O) => O.close())).then(q[tw1])
            }, this[Vl7] = (K, _) => {
                q.emit("connect", K, [q, ..._])
            }, this[kl7] = (K, _, z) => {
                q.emit("disconnect", K, [q, ..._], z)
            }, this[Nl7] = (K, _, z) => {
                q.emit("connectionError", K, [q, ..._], z)
            }, this[El7] = new te5(this)
        }
        get[ne5]() {
            return this[CV]
        }
        get[sw1]() {
            return this[_E].filter((q) => q[sw1]).length
        }
        get[ie5]() {
            return this[_E].filter((q) => q[sw1] && !q[CV]).length
        }
        get[Tl7]() {
            let q = this[Md6];
            for (let {
                    [Tl7]: K
                }
                of this[_E]) q += K;
            return q
        }
        get[vl7]() {
            let q = 0;
            for (let {
                    [vl7]: K
                }
                of this[_E]) q += K;
            return q
        }
        get[Gl7]() {
            let q = this[Md6];
            for (let {
                    [Gl7]: K
                }
                of this[_E]) q += K;
            return q
        }
        get stats() {
            return this[El7]
        }
        async [oe5]() {
            if (this[Pd6].isEmpty()) await Promise.all(this[_E].map((q) => q.close()));
            else await new Promise((q) => {
                this[tw1] = q
            })
        }
        async [ae5](q) {
            while (!0) {
                let K = this[Pd6].shift();
                if (!K) break;
                K.handler.onError(q)
            }
            await Promise.all(this[_E].map((K) => K.destroy(q)))
        } [se5](q, K) {
            let _ = this[q21]();
            if (!_) this[CV] = !0, this[Pd6].push({
                opts: q,
                handler: K
            }), this[Md6]++;
            else if (!_.dispatch(q, K)) _[CV] = !0, this[CV] = !this[q21]();
            return !this[CV]
        } [yl7](q) {
            if (q.on("drain", this[ew1]).on("connect", this[Vl7]).on("disconnect", this[kl7]).on("connectionError", this[Nl7]), this[_E].push(q), this[CV]) queueMicrotask(() => {
                if (this[CV]) this[ew1](q[re5], [this, q])
            });
            return this
        } [Ll7](q) {
            q.close(() => {
                let K = this[_E].indexOf(q);
                if (K !== -1) this[_E].splice(K, 1)
            }), this[CV] = this[_E].some((K) => !K[CV] && K.closed !== !0 && K.destroyed !== !0)
        }
    }
    Rl7.exports = {
        PoolBase: hl7,
        kClients: _E,
        kNeedDrain: CV,
        kAddClient: yl7,
        kRemoveClient: Ll7,
        kGetDispatcher: q21
    }
})
// @from(Ln 58386, Col 4)
uG6 = p((f_O, xl7) => {
    var {
        PoolBase: ee5,
        kClients: PM8,
        kNeedDrain: q63,
        kAddClient: K63,
        kGetDispatcher: _63
    } = K21(), z63 = xG6(), {
        InvalidArgumentError: _21
    } = aA(), Sl7 = Hz(), {
        kUrl: Cl7,
        kInterceptors: Y63
    } = oj(), A63 = rQ6(), z21 = Symbol("options"), Y21 = Symbol("connections"), bl7 = Symbol("factory");

    function O63(q, K) {
        return new z63(q, K)
    }
    class Il7 extends ee5 {
        constructor(q, {
            connections: K,
            factory: _ = O63,
            connect: z,
            connectTimeout: Y,
            tls: A,
            maxCachedSessions: O,
            socketPath: w,
            autoSelectFamily: $,
            autoSelectFamilyAttemptTimeout: j,
            allowH2: H,
            ...J
        } = {}) {
            super();
            if (K != null && (!Number.isFinite(K) || K < 0)) throw new _21("invalid connections");
            if (typeof _ !== "function") throw new _21("factory must be a function.");
            if (z != null && typeof z !== "function" && typeof z !== "object") throw new _21("connect must be a function or an object");
            if (typeof z !== "function") z = A63({
                ...A,
                maxCachedSessions: O,
                allowH2: H,
                socketPath: w,
                timeout: Y,
                ...$ ? {
                    autoSelectFamily: $,
                    autoSelectFamilyAttemptTimeout: j
                } : void 0,
                ...z
            });
            this[Y63] = J.interceptors?.Pool && Array.isArray(J.interceptors.Pool) ? J.interceptors.Pool : [], this[Y21] = K || null, this[Cl7] = Sl7.parseOrigin(q), this[z21] = {
                ...Sl7.deepClone(J),
                connect: z,
                allowH2: H
            }, this[z21].interceptors = J.interceptors ? {
                ...J.interceptors
            } : void 0, this[bl7] = _, this.on("connectionError", (X, M, P) => {
                for (let W of M) {
                    let D = this[PM8].indexOf(W);
                    if (D !== -1) this[PM8].splice(D, 1)
                }
            })
        } [_63]() {
            for (let q of this[PM8])
                if (!q[q63]) return q;
            if (!this[Y21] || this[PM8].length < this[Y21]) {
                let q = this[bl7](this[Cl7], this[z21]);
                return this[K63](q), q
            }
        }
    }
    xl7.exports = Il7
})
// @from(Ln 58456, Col 4)
gl7 = p((G_O, Fl7) => {
    var {
        BalancedPoolMissingUpstreamError: w63,
        InvalidArgumentError: $63
    } = aA(), {
        PoolBase: j63,
        kClients: Xv,
        kNeedDrain: Wd6,
        kAddClient: H63,
        kRemoveClient: J63,
        kGetDispatcher: X63
    } = K21(), M63 = uG6(), {
        kUrl: A21,
        kInterceptors: P63
    } = oj(), {
        parseOrigin: ul7
    } = Hz(), ml7 = Symbol("factory"), WM8 = Symbol("options"), Bl7 = Symbol("kGreatestCommonDivisor"), tA6 = Symbol("kCurrentWeight"), eA6 = Symbol("kIndex"), Ab = Symbol("kWeight"), DM8 = Symbol("kMaxWeightPerServer"), ZM8 = Symbol("kErrorPenalty");

    function W63(q, K) {
        if (q === 0) return K;
        while (K !== 0) {
            let _ = K;
            K = q % K, q = _
        }
        return q
    }

    function D63(q, K) {
        return new M63(q, K)
    }
    class pl7 extends j63 {
        constructor(q = [], {
            factory: K = D63,
            ..._
        } = {}) {
            super();
            if (this[WM8] = _, this[eA6] = -1, this[tA6] = 0, this[DM8] = this[WM8].maxWeightPerServer || 100, this[ZM8] = this[WM8].errorPenalty || 15, !Array.isArray(q)) q = [q];
            if (typeof K !== "function") throw new $63("factory must be a function.");
            this[P63] = _.interceptors?.BalancedPool && Array.isArray(_.interceptors.BalancedPool) ? _.interceptors.BalancedPool : [], this[ml7] = K;
            for (let z of q) this.addUpstream(z);
            this._updateBalancedPoolStats()
        }
        addUpstream(q) {
            let K = ul7(q).origin;
            if (this[Xv].find((z) => z[A21].origin === K && z.closed !== !0 && z.destroyed !== !0)) return this;
            let _ = this[ml7](K, Object.assign({}, this[WM8]));
            this[H63](_), _.on("connect", () => {
                _[Ab] = Math.min(this[DM8], _[Ab] + this[ZM8])
            }), _.on("connectionError", () => {
                _[Ab] = Math.max(1, _[Ab] - this[ZM8]), this._updateBalancedPoolStats()
            }), _.on("disconnect", (...z) => {
                let Y = z[2];
                if (Y && Y.code === "UND_ERR_SOCKET") _[Ab] = Math.max(1, _[Ab] - this[ZM8]), this._updateBalancedPoolStats()
            });
            for (let z of this[Xv]) z[Ab] = this[DM8];
            return this._updateBalancedPoolStats(), this
        }
        _updateBalancedPoolStats() {
            let q = 0;
            for (let K = 0; K < this[Xv].length; K++) q = W63(this[Xv][K][Ab], q);
            this[Bl7] = q
        }
        removeUpstream(q) {
            let K = ul7(q).origin,
                _ = this[Xv].find((z) => z[A21].origin === K && z.closed !== !0 && z.destroyed !== !0);
            if (_) this[J63](_);
            return this
        }
        get upstreams() {
            return this[Xv].filter((q) => q.closed !== !0 && q.destroyed !== !0).map((q) => q[A21].origin)
        } [X63]() {
            if (this[Xv].length === 0) throw new w63;
            if (!this[Xv].find((Y) => !Y[Wd6] && Y.closed !== !0 && Y.destroyed !== !0)) return;
            if (this[Xv].map((Y) => Y[Wd6]).reduce((Y, A) => Y && A, !0)) return;
            let _ = 0,
                z = this[Xv].findIndex((Y) => !Y[Wd6]);
            while (_++ < this[Xv].length) {
                this[eA6] = (this[eA6] + 1) % this[Xv].length;
                let Y = this[Xv][this[eA6]];
                if (Y[Ab] > this[Xv][z][Ab] && !Y[Wd6]) z = this[eA6];
                if (this[eA6] === 0) {
                    if (this[tA6] = this[tA6] - this[Bl7], this[tA6] <= 0) this[tA6] = this[DM8]
                }
                if (Y[Ab] >= this[tA6] && !Y[Wd6]) return Y
            }
            return this[tA6] = this[Xv][z][Ab], this[eA6] = z, this[Xv][z]
        }
    }
    Fl7.exports = pl7
})
// @from(Ln 58546, Col 4)
mG6 = p((v_O, rl7) => {
    var {
        InvalidArgumentError: fM8
    } = aA(), {
        kClients: e16,
        kRunning: Ul7,
        kClose: Z63,
        kDestroy: f63,
        kDispatch: G63,
        kInterceptors: v63
    } = oj(), T63 = fG6(), V63 = uG6(), k63 = xG6(), N63 = Hz(), E63 = XM8(), Ql7 = Symbol("onConnect"), dl7 = Symbol("onDisconnect"), cl7 = Symbol("onConnectionError"), y63 = Symbol("maxRedirections"), ll7 = Symbol("onDrain"), nl7 = Symbol("factory"), O21 = Symbol("options");

    function L63(q, K) {
        return K && K.connections === 1 ? new k63(q, K) : new V63(q, K)
    }
    class il7 extends T63 {
        constructor({
            factory: q = L63,
            maxRedirections: K = 0,
            connect: _,
            ...z
        } = {}) {
            super();
            if (typeof q !== "function") throw new fM8("factory must be a function.");
            if (_ != null && typeof _ !== "function" && typeof _ !== "object") throw new fM8("connect must be a function or an object");
            if (!Number.isInteger(K) || K < 0) throw new fM8("maxRedirections must be a positive number");
            if (_ && typeof _ !== "function") _ = {
                ..._
            };
            this[v63] = z.interceptors?.Agent && Array.isArray(z.interceptors.Agent) ? z.interceptors.Agent : [E63({
                maxRedirections: K
            })], this[O21] = {
                ...N63.deepClone(z),
                connect: _
            }, this[O21].interceptors = z.interceptors ? {
                ...z.interceptors
            } : void 0, this[y63] = K, this[nl7] = q, this[e16] = new Map, this[ll7] = (Y, A) => {
                this.emit("drain", Y, [this, ...A])
            }, this[Ql7] = (Y, A) => {
                this.emit("connect", Y, [this, ...A])
            }, this[dl7] = (Y, A, O) => {
                this.emit("disconnect", Y, [this, ...A], O)
            }, this[cl7] = (Y, A, O) => {
                this.emit("connectionError", Y, [this, ...A], O)
            }
        }
        get[Ul7]() {
            let q = 0;
            for (let K of this[e16].values()) q += K[Ul7];
            return q
        } [G63](q, K) {
            let _;
            if (q.origin && (typeof q.origin === "string" || q.origin instanceof URL)) _ = String(q.origin);
            else throw new fM8("opts.origin must be a non-empty string or URL.");
            let z = this[e16].get(_);
            if (!z) z = this[nl7](q.origin, this[O21]).on("drain", this[ll7]).on("connect", this[Ql7]).on("disconnect", this[dl7]).on("connectionError", this[cl7]), this[e16].set(_, z);
            return z.dispatch(q, K)
        }
        async [Z63]() {
            let q = [];
            for (let K of this[e16].values()) q.push(K.close());
            this[e16].clear(), await Promise.all(q)
        }
        async [f63](q) {
            let K = [];
            for (let _ of this[e16].values()) K.push(_.destroy(q));
            this[e16].clear(), await Promise.all(K)
        }
    }
    rl7.exports = il7
})
// @from(Ln 58617, Col 4)
j21 = p((T_O, wn7) => {
    var {
        kProxy: w21,
        kClose: qn7,
        kDestroy: Kn7,
        kDispatch: ol7,
        kInterceptors: h63
    } = oj(), {
        URL: qO6
    } = d6("node:url"), R63 = mG6(), _n7 = uG6(), zn7 = fG6(), {
        InvalidArgumentError: BG6,
        RequestAbortedError: S63,
        SecureProxyConnectionError: C63
    } = aA(), al7 = rQ6(), Yn7 = xG6(), GM8 = Symbol("proxy agent"), vM8 = Symbol("proxy client"), q76 = Symbol("proxy headers"), $21 = Symbol("request tls settings"), sl7 = Symbol("proxy tls settings"), tl7 = Symbol("connect endpoint function"), el7 = Symbol("tunnel proxy");

    function b63(q) {
        return q === "https:" ? 443 : 80
    }

    function I63(q, K) {
        return new _n7(q, K)
    }
    var x63 = () => {};

    function u63(q, K) {
        if (K.connections === 1) return new Yn7(q, K);
        return new _n7(q, K)
    }
    class An7 extends zn7 {
        #q;
        constructor(q, {
            headers: K = {},
            connect: _,
            factory: z
        }) {
            super();
            if (!q) throw new BG6("Proxy URL is mandatory");
            if (this[q76] = K, z) this.#q = z(q, {
                connect: _
            });
            else this.#q = new Yn7(q, {
                connect: _
            })
        } [ol7](q, K) {
            let _ = K.onHeaders;
            K.onHeaders = function(O, w, $) {
                if (O === 407) {
                    if (typeof K.onError === "function") K.onError(new BG6("Proxy Authentication Required (407)"));
                    return
                }
                if (_) _.call(this, O, w, $)
            };
            let {
                origin: z,
                path: Y = "/",
                headers: A = {}
            } = q;
            if (q.path = z + Y, !("host" in A) && !("Host" in A)) {
                let {
                    host: O
                } = new qO6(z);
                A.host = O
            }
            return q.headers = {
                ...this[q76],
                ...A
            }, this.#q[ol7](q, K)
        }
        async [qn7]() {
            return this.#q.close()
        }
        async [Kn7](q) {
            return this.#q.destroy(q)
        }
    }
    class On7 extends zn7 {
        constructor(q) {
            super();
            if (!q || typeof q === "object" && !(q instanceof qO6) && !q.uri) throw new BG6("Proxy uri is mandatory");
            let {
                clientFactory: K = I63
            } = q;
            if (typeof K !== "function") throw new BG6("Proxy opts.clientFactory must be a function.");
            let {
                proxyTunnel: _ = !0
            } = q, z = this.#q(q), {
                href: Y,
                origin: A,
                port: O,
                protocol: w,
                username: $,
                password: j,
                hostname: H
            } = z;
            if (this[w21] = {
                    uri: Y,
                    protocol: w
                }, this[h63] = q.interceptors?.ProxyAgent && Array.isArray(q.interceptors.ProxyAgent) ? q.interceptors.ProxyAgent : [], this[$21] = q.requestTls, this[sl7] = q.proxyTls, this[q76] = q.headers || {}, this[el7] = _, q.auth && q.token) throw new BG6("opts.auth cannot be used in combination with opts.token");
            else if (q.auth) this[q76]["proxy-authorization"] = `Basic ${q.auth}`;
            else if (q.token) this[q76]["proxy-authorization"] = q.token;
            else if ($ && j) this[q76]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent($)}:${decodeURIComponent(j)}`).toString("base64")}`;
            let J = al7({
                ...q.proxyTls
            });
            this[tl7] = al7({
                ...q.requestTls
            });
            let X = q.factory || u63,
                M = (P, W) => {
                    let {
                        protocol: D
                    } = new qO6(P);
                    if (!this[el7] && D === "http:" && this[w21].protocol === "http:") return new An7(this[w21].uri, {
                        headers: this[q76],
                        connect: J,
                        factory: X
                    });
                    return X(P, W)
                };
            this[vM8] = K(z, {
                connect: J
            }), this[GM8] = new R63({
                ...q,
                factory: M,
                connect: async (P, W) => {
                    let D = P.host;
                    if (!P.port) D += `:${b63(P.protocol)}`;
                    try {
                        let {
                            socket: Z,
                            statusCode: G
                        } = await this[vM8].connect({
                            origin: A,
                            port: O,
                            path: D,
                            signal: P.signal,
                            headers: {
                                ...this[q76],
                                host: P.host
                            },
                            servername: this[sl7]?.servername || H
                        });
                        if (G !== 200) Z.on("error", x63).destroy(), W(new S63(`Proxy response (${G}) !== 200 when HTTP Tunneling`));
                        if (P.protocol !== "https:") {
                            W(null, Z);
                            return
                        }
                        let f;
                        if (this[$21]) f = this[$21].servername;
                        else f = P.servername;
                        this[tl7]({
                            ...P,
                            servername: f,
                            httpSocket: Z
                        }, W)
                    } catch (Z) {
                        if (Z.code === "ERR_TLS_CERT_ALTNAME_INVALID") W(new C63(Z));
                        else W(Z)
                    }
                }
            })
        }
        dispatch(q, K) {
            let _ = m63(q.headers);
            if (B63(_), _ && !("host" in _) && !("Host" in _)) {
                let {
                    host: z
                } = new qO6(q.origin);
                _.host = z
            }
            return this[GM8].dispatch({
                ...q,
                headers: _
            }, K)
        }
        #q(q) {
            if (typeof q === "string") return new qO6(q);
            else if (q instanceof qO6) return q;
            else return new qO6(q.uri)
        }
        async [qn7]() {
            await this[GM8].close(), await this[vM8].close()
        }
        async [Kn7]() {
            await this[GM8].destroy(), await this[vM8].destroy()
        }
    }

    function m63(q) {
        if (Array.isArray(q)) {
            let K = {};
            for (let _ = 0; _ < q.length; _ += 2) K[q[_]] = q[_ + 1];
            return K
        }
        return q
    }

    function B63(q) {
        if (q && Object.keys(q).find((_) => _.toLowerCase() === "proxy-authorization")) throw new BG6("Proxy-Authorization should be sent in ProxyAgent constructor")
    }
    wn7.exports = On7
})
// @from(Ln 58819, Col 4)
Pn7 = p((V_O, Mn7) => {
    var p63 = fG6(),
        {
            kClose: F63,
            kDestroy: g63,
            kClosed: $n7,
            kDestroyed: jn7,
            kDispatch: U63,
            kNoProxyAgent: Dd6,
            kHttpProxyAgent: K76,
            kHttpsProxyAgent: KO6
        } = oj(),
        Hn7 = j21(),
        Q63 = mG6(),
        d63 = {
            "http:": 80,
            "https:": 443
        },
        Jn7 = !1;
    class Xn7 extends p63 {
        #q = null;
        #K = null;
        #_ = null;
        constructor(q = {}) {
            super();
            if (this.#_ = q, !Jn7) Jn7 = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
                code: "UNDICI-EHPA"
            });
            let {
                httpProxy: K,
                httpsProxy: _,
                noProxy: z,
                ...Y
            } = q;
            this[Dd6] = new Q63(Y);
            let A = K ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
            if (A) this[K76] = new Hn7({
                ...Y,
                uri: A
            });
            else this[K76] = this[Dd6];
            let O = _ ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
            if (O) this[KO6] = new Hn7({
                ...Y,
                uri: O
            });
            else this[KO6] = this[K76];
            this.#w()
        } [U63](q, K) {
            let _ = new URL(q.origin);
            return this.#Y(_).dispatch(q, K)
        }
        async [F63]() {
            if (await this[Dd6].close(), !this[K76][$n7]) await this[K76].close();
            if (!this[KO6][$n7]) await this[KO6].close()
        }
        async [g63](q) {
            if (await this[Dd6].destroy(q), !this[K76][jn7]) await this[K76].destroy(q);
            if (!this[KO6][jn7]) await this[KO6].destroy(q)
        }
        #Y(q) {
            let {
                protocol: K,
                host: _,
                port: z
            } = q;
            if (_ = _.replace(/:\d*$/, "").toLowerCase(), z = Number.parseInt(z, 10) || d63[K] || 0, !this.#z(_, z)) return this[Dd6];
            if (K === "https:") return this[KO6];
            return this[K76]
        }
        #z(q, K) {
            if (this.#A) this.#w();
            if (this.#K.length === 0) return !0;
            if (this.#q === "*") return !1;
            for (let _ = 0; _ < this.#K.length; _++) {
                let z = this.#K[_];
                if (z.port && z.port !== K) continue;
                if (!/^[.*]/.test(z.hostname)) {
                    if (q === z.hostname) return !1
                } else if (q.endsWith(z.hostname.replace(/^\*/, ""))) return !1
            }
            return !0
        }
        #w() {
            let q = this.#_.noProxy ?? this.#$,
                K = q.split(/[,\s]/),
                _ = [];
            for (let z = 0; z < K.length; z++) {
                let Y = K[z];
                if (!Y) continue;
                let A = Y.match(/^(.+):(\d+)$/);
                _.push({
                    hostname: (A ? A[1] : Y).toLowerCase(),
                    port: A ? Number.parseInt(A[2], 10) : 0
                })
            }
            this.#q = q, this.#K = _
        }
        get #A() {
            if (this.#_.noProxy !== void 0) return !1;
            return this.#q !== this.#$
        }
        get #$() {
            return process.env.no_proxy ?? process.env.NO_PROXY ?? ""
        }
    }
    Mn7.exports = Xn7
})
// @from(Ln 58927, Col 4)
TM8 = p((k_O, fn7) => {
    var pG6 = d6("node:assert"),
        {
            kRetryHandlerDefaultRetry: Wn7
        } = oj(),
        {
            RequestRetryError: Zd6
        } = aA(),
        {
            isDisturbed: Dn7,
            parseHeaders: c63,
            parseRangeHeader: Zn7,
            wrapRequestBody: l63
        } = Hz();

    function n63(q) {
        let K = Date.now();
        return new Date(q).getTime() - K
    }
    class H21 {
        constructor(q, K) {
            let {
                retryOptions: _,
                ...z
            } = q, {
                retry: Y,
                maxRetries: A,
                maxTimeout: O,
                minTimeout: w,
                timeoutFactor: $,
                methods: j,
                errorCodes: H,
                retryAfter: J,
                statusCodes: X
            } = _ ?? {};
            this.dispatch = K.dispatch, this.handler = K.handler, this.opts = {
                ...z,
                body: l63(q.body)
            }, this.abort = null, this.aborted = !1, this.retryOpts = {
                retry: Y ?? H21[Wn7],
                retryAfter: J ?? !0,
                maxTimeout: O ?? 30000,
                minTimeout: w ?? 500,
                timeoutFactor: $ ?? 2,
                maxRetries: A ?? 5,
                methods: j ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
                statusCodes: X ?? [500, 502, 503, 504, 429],
                errorCodes: H ?? ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "ENETDOWN", "ENETUNREACH", "EHOSTDOWN", "EHOSTUNREACH", "EPIPE", "UND_ERR_SOCKET"]
            }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((M) => {
                if (this.aborted = !0, this.abort) this.abort(M);
                else this.reason = M
            })
        }
        onRequestSent() {
            if (this.handler.onRequestSent) this.handler.onRequestSent()
        }
        onUpgrade(q, K, _) {
            if (this.handler.onUpgrade) this.handler.onUpgrade(q, K, _)
        }
        onConnect(q) {
            if (this.aborted) q(this.reason);
            else this.abort = q
        }
        onBodySent(q) {
            if (this.handler.onBodySent) return this.handler.onBodySent(q)
        }
        static[Wn7](q, {
            state: K,
            opts: _
        }, z) {
            let {
                statusCode: Y,
                code: A,
                headers: O
            } = q, {
                method: w,
                retryOptions: $
            } = _, {
                maxRetries: j,
                minTimeout: H,
                maxTimeout: J,
                timeoutFactor: X,
                statusCodes: M,
                errorCodes: P,
                methods: W
            } = $, {
                counter: D
            } = K;
            if (A && A !== "UND_ERR_REQ_RETRY" && !P.includes(A)) {
                z(q);
                return
            }
            if (Array.isArray(W) && !W.includes(w)) {
                z(q);
                return
            }
            if (Y != null && Array.isArray(M) && !M.includes(Y)) {
                z(q);
                return
            }
            if (D > j) {
                z(q);
                return
            }
            let Z = O?.["retry-after"];
            if (Z) Z = Number(Z), Z = Number.isNaN(Z) ? n63(Z) : Z * 1000;
            let G = Z > 0 ? Math.min(Z, J) : Math.min(H * X ** (D - 1), J);
            setTimeout(() => z(null), G)
        }
        onHeaders(q, K, _, z) {
            let Y = c63(K);
            if (this.retryCount += 1, q >= 300)
                if (this.retryOpts.statusCodes.includes(q) === !1) return this.handler.onHeaders(q, K, _, z);
                else return this.abort(new Zd6("Request failed", q, {
                    headers: Y,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
            if (this.resume != null) {
                if (this.resume = null, q !== 206 && (this.start > 0 || q !== 200)) return this.abort(new Zd6("server does not support the range header and the payload was partially consumed", q, {
                    headers: Y,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                let O = Zn7(Y["content-range"]);
                if (!O) return this.abort(new Zd6("Content-Range mismatch", q, {
                    headers: Y,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                if (this.etag != null && this.etag !== Y.etag) return this.abort(new Zd6("ETag mismatch", q, {
                    headers: Y,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                let {
                    start: w,
                    size: $,
                    end: j = $ - 1
                } = O;
                return pG6(this.start === w, "content-range mismatch"), pG6(this.end == null || this.end === j, "content-range mismatch"), this.resume = _, !0
            }
            if (this.end == null) {
                if (q === 206) {
                    let O = Zn7(Y["content-range"]);
                    if (O == null) return this.handler.onHeaders(q, K, _, z);
                    let {
                        start: w,
                        size: $,
                        end: j = $ - 1
                    } = O;
                    pG6(w != null && Number.isFinite(w), "content-range mismatch"), pG6(j != null && Number.isFinite(j), "invalid content-length"), this.start = w, this.end = j
                }
                if (this.end == null) {
                    let O = Y["content-length"];
                    this.end = O != null ? Number(O) - 1 : null
                }
                if (pG6(Number.isFinite(this.start)), pG6(this.end == null || Number.isFinite(this.end), "invalid content-length"), this.resume = _, this.etag = Y.etag != null ? Y.etag : null, this.etag != null && this.etag.startsWith("W/")) this.etag = null;
                return this.handler.onHeaders(q, K, _, z)
            }
            let A = new Zd6("Request failed", q, {
                headers: Y,
                data: {
                    count: this.retryCount
                }
            });
            return this.abort(A), !1
        }
        onData(q) {
            return this.start += q.length, this.handler.onData(q)
        }
        onComplete(q) {
            return this.retryCount = 0, this.handler.onComplete(q)
        }
        onError(q) {
            if (this.aborted || Dn7(this.opts.body)) return this.handler.onError(q);
            if (this.retryCount - this.retryCountCheckpoint > 0) this.retryCount = this.retryCountCheckpoint + (this.retryCount - this.retryCountCheckpoint);
            else this.retryCount += 1;
            this.retryOpts.retry(q, {
                state: {
                    counter: this.retryCount
                },
                opts: {
                    retryOptions: this.retryOpts,
                    ...this.opts
                }
            }, K.bind(this));

            function K(_) {
                if (_ != null || this.aborted || Dn7(this.opts.body)) return this.handler.onError(_);
                if (this.start !== 0) {
                    let z = {
                        range: `bytes=${this.start}-${this.end??""}`
                    };
                    if (this.etag != null) z["if-match"] = this.etag;
                    this.opts = {
                        ...this.opts,
                        headers: {
                            ...this.opts.headers,
                            ...z
                        }
                    }
                }
                try {
                    this.retryCountCheckpoint = this.retryCount, this.dispatch(this.opts, this)
                } catch (z) {
                    this.handler.onError(z)
                }
            }
        }
    }
    fn7.exports = H21
})
// @from(Ln 59144, Col 4)
Tn7 = p((N_O, vn7) => {
    var i63 = nQ6(),
        r63 = TM8();
    class Gn7 extends i63 {
        #q = null;
        #K = null;
        constructor(q, K = {}) {
            super(K);
            this.#q = q, this.#K = K
        }
        dispatch(q, K) {
            let _ = new r63({
                ...q,
                retryOptions: this.#K
            }, {
                dispatch: this.#q.dispatch.bind(this.#q),
                handler: K
            });
            return this.#q.dispatch(q, _)
        }
        close() {
            return this.#q.close()
        }
        destroy() {
            return this.#q.destroy()
        }
    }
    vn7.exports = Gn7
})
// @from(Ln 59173, Col 4)
W21 = p((E_O, Cn7) => {
    var yn7 = d6("node:assert"),
        {
            Readable: o63
        } = d6("node:stream"),
        {
            RequestAbortedError: Ln7,
            NotSupportedError: a63,
            InvalidArgumentError: s63,
            AbortError: J21
        } = aA(),
        hn7 = Hz(),
        {
            ReadableStreamFrom: t63
        } = Hz(),
        Nh = Symbol("kConsume"),
        fd6 = Symbol("kReading"),
        _76 = Symbol("kBody"),
        Vn7 = Symbol("kAbort"),
        Rn7 = Symbol("kContentType"),
        kn7 = Symbol("kContentLength"),
        e63 = () => {};
    class Sn7 extends o63 {
        constructor({
            resume: q,
            abort: K,
            contentType: _ = "",
            contentLength: z,
            highWaterMark: Y = 65536
        }) {
            super({
                autoDestroy: !0,
                read: q,
                highWaterMark: Y
            });
            this._readableState.dataEmitted = !1, this[Vn7] = K, this[Nh] = null, this[_76] = null, this[Rn7] = _, this[kn7] = z, this[fd6] = !1
        }
        destroy(q) {
            if (!q && !this._readableState.endEmitted) q = new Ln7;
            if (q) this[Vn7]();
            return super.destroy(q)
        }
        _destroy(q, K) {
            if (!this[fd6]) setImmediate(() => {
                K(q)
            });
            else K(q)
        }
        on(q, ...K) {
            if (q === "data" || q === "readable") this[fd6] = !0;
            return super.on(q, ...K)
        }
        addListener(q, ...K) {
            return this.on(q, ...K)
        }
        off(q, ...K) {
            let _ = super.off(q, ...K);
            if (q === "data" || q === "readable") this[fd6] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
            return _
        }
        removeListener(q, ...K) {
            return this.off(q, ...K)
        }
        push(q) {
            if (this[Nh] && q !== null) return M21(this[Nh], q), this[fd6] ? super.push(q) : !0;
            return super.push(q)
        }
        async text() {
            return Gd6(this, "text")
        }
        async json() {
            return Gd6(this, "json")
        }
        async blob() {
            return Gd6(this, "blob")
        }
        async bytes() {
            return Gd6(this, "bytes")
        }
        async arrayBuffer() {
            return Gd6(this, "arrayBuffer")
        }
        async formData() {
            throw new a63
        }
        get bodyUsed() {
            return hn7.isDisturbed(this)
        }
        get body() {
            if (!this[_76]) {
                if (this[_76] = t63(this), this[Nh]) this[_76].getReader(), yn7(this[_76].locked)
            }
            return this[_76]
        }
        async dump(q) {
            let K = Number.isFinite(q?.limit) ? q.limit : 131072,
                _ = q?.signal;
            if (_ != null && (typeof _ !== "object" || !("aborted" in _))) throw new s63("signal must be an AbortSignal");
            if (_?.throwIfAborted(), this._readableState.closeEmitted) return null;
            return await new Promise((z, Y) => {
                if (this[kn7] > K) this.destroy(new J21);
                let A = () => {
                    this.destroy(_.reason ?? new J21)
                };
                _?.addEventListener("abort", A), this.on("close", function() {
                    if (_?.removeEventListener("abort", A), _?.aborted) Y(_.reason ?? new J21);
                    else z(null)
                }).on("error", e63).on("data", function(O) {
                    if (K -= O.length, K <= 0) this.destroy()
                }).resume()
            })
        }
    }

    function q83(q) {
        return q[_76] && q[_76].locked === !0 || q[Nh]
    }

    function K83(q) {
        return hn7.isDisturbed(q) || q83(q)
    }
    async function Gd6(q, K) {
        return yn7(!q[Nh]), new Promise((_, z) => {
            if (K83(q)) {
                let Y = q._readableState;
                if (Y.destroyed && Y.closeEmitted === !1) q.on("error", (A) => {
                    z(A)
                }).on("close", () => {
                    z(TypeError("unusable"))
                });
                else z(Y.errored ?? TypeError("unusable"))
            } else queueMicrotask(() => {
                q[Nh] = {
                    type: K,
                    stream: q,
                    resolve: _,
                    reject: z,
                    length: 0,
                    body: []
                }, q.on("error", function(Y) {
                    P21(this[Nh], Y)
                }).on("close", function() {
                    if (this[Nh].body !== null) P21(this[Nh], new Ln7)
                }), _83(q[Nh])
            })
        })
    }

    function _83(q) {
        if (q.body === null) return;
        let {
            _readableState: K
        } = q.stream;
        if (K.bufferIndex) {
            let _ = K.bufferIndex,
                z = K.buffer.length;
            for (let Y = _; Y < z; Y++) M21(q, K.buffer[Y])
        } else
            for (let _ of K.buffer) M21(q, _);
        if (K.endEmitted) En7(this[Nh]);
        else q.stream.on("end", function() {
            En7(this[Nh])
        });
        q.stream.resume();
        while (q.stream.read() != null);
    }

    function X21(q, K) {
        if (q.length === 0 || K === 0) return "";
        let _ = q.length === 1 ? q[0] : Buffer.concat(q, K),
            z = _.length,
            Y = z > 2 && _[0] === 239 && _[1] === 187 && _[2] === 191 ? 3 : 0;
        return _.utf8Slice(Y, z)
    }

    function Nn7(q, K) {
        if (q.length === 0 || K === 0) return new Uint8Array(0);
        if (q.length === 1) return new Uint8Array(q[0]);
        let _ = new Uint8Array(Buffer.allocUnsafeSlow(K).buffer),
            z = 0;
        for (let Y = 0; Y < q.length; ++Y) {
            let A = q[Y];
            _.set(A, z), z += A.length
        }
        return _
    }

    function En7(q) {
        let {
            type: K,
            body: _,
            resolve: z,
            stream: Y,
            length: A
        } = q;
        try {
            if (K === "text") z(X21(_, A));
            else if (K === "json") z(JSON.parse(X21(_, A)));
            else if (K === "arrayBuffer") z(Nn7(_, A).buffer);
            else if (K === "blob") z(new Blob(_, {
                type: Y[Rn7]
            }));
            else if (K === "bytes") z(Nn7(_, A));
            P21(q)
        } catch (O) {
            Y.destroy(O)
        }
    }

    function M21(q, K) {
        q.length += K.length, q.body.push(K)
    }

    function P21(q, K) {
        if (q.body === null) return;
        if (K) q.reject(K);
        else q.resolve();
        q.type = null, q.stream = null, q.resolve = null, q.reject = null, q.length = 0, q.body = null
    }
    Cn7.exports = {
        Readable: Sn7,
        chunksDecode: X21
    }
})
// @from(Ln 59397, Col 4)
D21 = p((y_O, mn7) => {
    var z83 = d6("node:assert"),
        {
            ResponseStatusCodeError: bn7
        } = aA(),
        {
            chunksDecode: In7
        } = W21();
    async function Y83({
        callback: q,
        body: K,
        contentType: _,
        statusCode: z,
        statusMessage: Y,
        headers: A
    }) {
        z83(K);
        let O = [],
            w = 0;
        try {
            for await (let J of K) if (O.push(J), w += J.length, w > 131072) {
                O = [], w = 0;
                break
            }
        } catch {
            O = [], w = 0
        }
        let $ = `Response status code ${z}${Y?`: ${Y}`:""}`;
        if (z === 204 || !_ || !w) {
            queueMicrotask(() => q(new bn7($, z, A)));
            return
        }
        let j = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        let H;
        try {
            if (xn7(_)) H = JSON.parse(In7(O, w));
            else if (un7(_)) H = In7(O, w)
        } catch {} finally {
            Error.stackTraceLimit = j
        }
        queueMicrotask(() => q(new bn7($, z, A, H)))
    }
    var xn7 = (q) => {
            return q.length > 15 && q[11] === "/" && q[0] === "a" && q[1] === "p" && q[2] === "p" && q[3] === "l" && q[4] === "i" && q[5] === "c" && q[6] === "a" && q[7] === "t" && q[8] === "i" && q[9] === "o" && q[10] === "n" && q[12] === "j" && q[13] === "s" && q[14] === "o" && q[15] === "n"
        },
        un7 = (q) => {
            return q.length > 4 && q[4] === "/" && q[0] === "t" && q[1] === "e" && q[2] === "x" && q[3] === "t"
        };
    mn7.exports = {
        getResolveErrorBodyCallback: Y83,
        isContentTypeApplicationJson: xn7,
        isContentTypeText: un7
    }
})
// @from(Ln 59452, Col 4)
Fn7 = p((L_O, f21) => {
    var A83 = d6("node:assert"),
        {
            Readable: O83
        } = W21(),
        {
            InvalidArgumentError: FG6,
            RequestAbortedError: Bn7
        } = aA(),
        Eh = Hz(),
        {
            getResolveErrorBodyCallback: w83
        } = D21(),
        {
            AsyncResource: $83
        } = d6("node:async_hooks");
    class Z21 extends $83 {
        constructor(q, K) {
            if (!q || typeof q !== "object") throw new FG6("invalid opts");
            let {
                signal: _,
                method: z,
                opaque: Y,
                body: A,
                onInfo: O,
                responseHeaders: w,
                throwOnError: $,
                highWaterMark: j
            } = q;
            try {
                if (typeof K !== "function") throw new FG6("invalid callback");
                if (j && (typeof j !== "number" || j < 0)) throw new FG6("invalid highWaterMark");
                if (_ && typeof _.on !== "function" && typeof _.addEventListener !== "function") throw new FG6("signal must be an EventEmitter or EventTarget");
                if (z === "CONNECT") throw new FG6("invalid method");
                if (O && typeof O !== "function") throw new FG6("invalid onInfo callback");
                super("UNDICI_REQUEST")
            } catch (H) {
                if (Eh.isStream(A)) Eh.destroy(A.on("error", Eh.nop), H);
                throw H
            }
            if (this.method = z, this.responseHeaders = w || null, this.opaque = Y || null, this.callback = K, this.res = null, this.abort = null, this.body = A, this.trailers = {}, this.context = null, this.onInfo = O || null, this.throwOnError = $, this.highWaterMark = j, this.signal = _, this.reason = null, this.removeAbortListener = null, Eh.isStream(A)) A.on("error", (H) => {
                this.onError(H)
            });
            if (this.signal)
                if (this.signal.aborted) this.reason = this.signal.reason ?? new Bn7;
                else this.removeAbortListener = Eh.addAbortListener(this.signal, () => {
                    if (this.reason = this.signal.reason ?? new Bn7, this.res) Eh.destroy(this.res.on("error", Eh.nop), this.reason);
                    else if (this.abort) this.abort(this.reason);
                    if (this.removeAbortListener) this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
                })
        }
        onConnect(q, K) {
            if (this.reason) {
                q(this.reason);
                return
            }
            A83(this.callback), this.abort = q, this.context = K
        }
        onHeaders(q, K, _, z) {
            let {
                callback: Y,
                opaque: A,
                abort: O,
                context: w,
                responseHeaders: $,
                highWaterMark: j
            } = this, H = $ === "raw" ? Eh.parseRawHeaders(K) : Eh.parseHeaders(K);
            if (q < 200) {
                if (this.onInfo) this.onInfo({
                    statusCode: q,
                    headers: H
                });
                return
            }
            let J = $ === "raw" ? Eh.parseHeaders(K) : H,
                X = J["content-type"],
                M = J["content-length"],
                P = new O83({
                    resume: _,
                    abort: O,
                    contentType: X,
                    contentLength: this.method !== "HEAD" && M ? Number(M) : null,
                    highWaterMark: j
                });
            if (this.removeAbortListener) P.on("close", this.removeAbortListener);
            if (this.callback = null, this.res = P, Y !== null)
                if (this.throwOnError && q >= 400) this.runInAsyncScope(w83, null, {
                    callback: Y,
                    body: P,
                    contentType: X,
                    statusCode: q,
                    statusMessage: z,
                    headers: H
                });
                else this.runInAsyncScope(Y, null, null, {
                    statusCode: q,
                    headers: H,
                    trailers: this.trailers,
                    opaque: A,
                    body: P,
                    context: w
                })
        }
        onData(q) {
            return this.res.push(q)
        }
        onComplete(q) {
            Eh.parseHeaders(q, this.trailers), this.res.push(null)
        }
        onError(q) {
            let {
                res: K,
                callback: _,
                body: z,
                opaque: Y
            } = this;
            if (_) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(_, null, q, {
                    opaque: Y
                })
            });
            if (K) this.res = null, queueMicrotask(() => {
                Eh.destroy(K, q)
            });
            if (z) this.body = null, Eh.destroy(z, q);
            if (this.removeAbortListener) K?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
        }
    }

    function pn7(q, K) {
        if (K === void 0) return new Promise((_, z) => {
            pn7.call(this, q, (Y, A) => {
                return Y ? z(Y) : _(A)
            })
        });
        try {
            this.dispatch(q, new Z21(q, K))
        } catch (_) {
            if (typeof K !== "function") throw _;
            let z = q?.opaque;
            queueMicrotask(() => K(_, {
                opaque: z
            }))
        }
    }
    f21.exports = pn7;
    f21.exports.RequestHandler = Z21
})
// @from(Ln 59600, Col 4)
vd6 = p((h_O, Qn7) => {
    var {
        addAbortListener: j83
    } = Hz(), {
        RequestAbortedError: H83
    } = aA(), gG6 = Symbol("kListener"), xU = Symbol("kSignal");

    function gn7(q) {
        if (q.abort) q.abort(q[xU]?.reason);
        else q.reason = q[xU]?.reason ?? new H83;
        Un7(q)
    }

    function J83(q, K) {
        if (q.reason = null, q[xU] = null, q[gG6] = null, !K) return;
        if (K.aborted) {
            gn7(q);
            return
        }
        q[xU] = K, q[gG6] = () => {
            gn7(q)
        }, j83(q[xU], q[gG6])
    }

    function Un7(q) {
        if (!q[xU]) return;
        if ("removeEventListener" in q[xU]) q[xU].removeEventListener("abort", q[gG6]);
        else q[xU].removeListener("abort", q[gG6]);
        q[xU] = null, q[gG6] = null
    }
    Qn7.exports = {
        addSignal: J83,
        removeSignal: Un7
    }
})
// @from(Ln 59635, Col 4)
in7 = p((R_O, nn7) => {
    var X83 = d6("node:assert"),
        {
            finished: M83,
            PassThrough: P83
        } = d6("node:stream"),
        {
            InvalidArgumentError: UG6,
            InvalidReturnValueError: W83
        } = aA(),
        gm = Hz(),
        {
            getResolveErrorBodyCallback: D83
        } = D21(),
        {
            AsyncResource: Z83
        } = d6("node:async_hooks"),
        {
            addSignal: f83,
            removeSignal: dn7
        } = vd6();
    class cn7 extends Z83 {
        constructor(q, K, _) {
            if (!q || typeof q !== "object") throw new UG6("invalid opts");
            let {
                signal: z,
                method: Y,
                opaque: A,
                body: O,
                onInfo: w,
                responseHeaders: $,
                throwOnError: j
            } = q;
            try {
                if (typeof _ !== "function") throw new UG6("invalid callback");
                if (typeof K !== "function") throw new UG6("invalid factory");
                if (z && typeof z.on !== "function" && typeof z.addEventListener !== "function") throw new UG6("signal must be an EventEmitter or EventTarget");
                if (Y === "CONNECT") throw new UG6("invalid method");
                if (w && typeof w !== "function") throw new UG6("invalid onInfo callback");
                super("UNDICI_STREAM")
            } catch (H) {
                if (gm.isStream(O)) gm.destroy(O.on("error", gm.nop), H);
                throw H
            }
            if (this.responseHeaders = $ || null, this.opaque = A || null, this.factory = K, this.callback = _, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = O, this.onInfo = w || null, this.throwOnError = j || !1, gm.isStream(O)) O.on("error", (H) => {
                this.onError(H)
            });
            f83(this, z)
        }
        onConnect(q, K) {
            if (this.reason) {
                q(this.reason);
                return
            }
            X83(this.callback), this.abort = q, this.context = K
        }
        onHeaders(q, K, _, z) {
            let {
                factory: Y,
                opaque: A,
                context: O,
                callback: w,
                responseHeaders: $
            } = this, j = $ === "raw" ? gm.parseRawHeaders(K) : gm.parseHeaders(K);
            if (q < 200) {
                if (this.onInfo) this.onInfo({
                    statusCode: q,
                    headers: j
                });
                return
            }
            this.factory = null;
            let H;
            if (this.throwOnError && q >= 400) {
                let M = ($ === "raw" ? gm.parseHeaders(K) : j)["content-type"];
                H = new P83, this.callback = null, this.runInAsyncScope(D83, null, {
                    callback: w,
                    body: H,
                    contentType: M,
                    statusCode: q,
                    statusMessage: z,
                    headers: j
                })
            } else {
                if (Y === null) return;
                if (H = this.runInAsyncScope(Y, null, {
                        statusCode: q,
                        headers: j,
                        opaque: A,
                        context: O
                    }), !H || typeof H.write !== "function" || typeof H.end !== "function" || typeof H.on !== "function") throw new W83("expected Writable");
                M83(H, {
                    readable: !1
                }, (X) => {
                    let {
                        callback: M,
                        res: P,
                        opaque: W,
                        trailers: D,
                        abort: Z
                    } = this;
                    if (this.res = null, X || !P.readable) gm.destroy(P, X);
                    if (this.callback = null, this.runInAsyncScope(M, null, X || null, {
                            opaque: W,
                            trailers: D
                        }), X) Z()
                })
            }
            return H.on("drain", _), this.res = H, (H.writableNeedDrain !== void 0 ? H.writableNeedDrain : H._writableState?.needDrain) !== !0
        }
        onData(q) {
            let {
                res: K
            } = this;
            return K ? K.write(q) : !0
        }
        onComplete(q) {
            let {
                res: K
            } = this;
            if (dn7(this), !K) return;
            this.trailers = gm.parseHeaders(q), K.end()
        }
        onError(q) {
            let {
                res: K,
                callback: _,
                opaque: z,
                body: Y
            } = this;
            if (dn7(this), this.factory = null, K) this.res = null, gm.destroy(K, q);
            else if (_) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(_, null, q, {
                    opaque: z
                })
            });
            if (Y) this.body = null, gm.destroy(Y, q)
        }
    }

    function ln7(q, K, _) {
        if (_ === void 0) return new Promise((z, Y) => {
            ln7.call(this, q, K, (A, O) => {
                return A ? Y(A) : z(O)
            })
        });
        try {
            this.dispatch(q, new cn7(q, K, _))
        } catch (z) {
            if (typeof _ !== "function") throw z;
            let Y = q?.opaque;
            queueMicrotask(() => _(z, {
                opaque: Y
            }))
        }
    }
    nn7.exports = ln7
})
// @from(Ln 59793, Col 4)
qi7 = p((S_O, en7) => {
    var {
        Readable: on7,
        Duplex: G83,
        PassThrough: v83
    } = d6("node:stream"), {
        InvalidArgumentError: Td6,
        InvalidReturnValueError: T83,
        RequestAbortedError: G21
    } = aA(), Ob = Hz(), {
        AsyncResource: V83
    } = d6("node:async_hooks"), {
        addSignal: k83,
        removeSignal: N83
    } = vd6(), rn7 = d6("node:assert"), QG6 = Symbol("resume");
    class an7 extends on7 {
        constructor() {
            super({
                autoDestroy: !0
            });
            this[QG6] = null
        }
        _read() {
            let {
                [QG6]: q
            } = this;
            if (q) this[QG6] = null, q()
        }
        _destroy(q, K) {
            this._read(), K(q)
        }
    }
    class sn7 extends on7 {
        constructor(q) {
            super({
                autoDestroy: !0
            });
            this[QG6] = q
        }
        _read() {
            this[QG6]()
        }
        _destroy(q, K) {
            if (!q && !this._readableState.endEmitted) q = new G21;
            K(q)
        }
    }
    class tn7 extends V83 {
        constructor(q, K) {
            if (!q || typeof q !== "object") throw new Td6("invalid opts");
            if (typeof K !== "function") throw new Td6("invalid handler");
            let {
                signal: _,
                method: z,
                opaque: Y,
                onInfo: A,
                responseHeaders: O
            } = q;
            if (_ && typeof _.on !== "function" && typeof _.addEventListener !== "function") throw new Td6("signal must be an EventEmitter or EventTarget");
            if (z === "CONNECT") throw new Td6("invalid method");
            if (A && typeof A !== "function") throw new Td6("invalid onInfo callback");
            super("UNDICI_PIPELINE");
            this.opaque = Y || null, this.responseHeaders = O || null, this.handler = K, this.abort = null, this.context = null, this.onInfo = A || null, this.req = new an7().on("error", Ob.nop), this.ret = new G83({
                readableObjectMode: q.objectMode,
                autoDestroy: !0,
                read: () => {
                    let {
                        body: w
                    } = this;
                    if (w?.resume) w.resume()
                },
                write: (w, $, j) => {
                    let {
                        req: H
                    } = this;
                    if (H.push(w, $) || H._readableState.destroyed) j();
                    else H[QG6] = j
                },
                destroy: (w, $) => {
                    let {
                        body: j,
                        req: H,
                        res: J,
                        ret: X,
                        abort: M
                    } = this;
                    if (!w && !X._readableState.endEmitted) w = new G21;
                    if (M && w) M();
                    Ob.destroy(j, w), Ob.destroy(H, w), Ob.destroy(J, w), N83(this), $(w)
                }
            }).on("prefinish", () => {
                let {
                    req: w
                } = this;
                w.push(null)
            }), this.res = null, k83(this, _)
        }
        onConnect(q, K) {
            let {
                ret: _,
                res: z
            } = this;
            if (this.reason) {
                q(this.reason);
                return
            }
            rn7(!z, "pipeline cannot be retried"), rn7(!_.destroyed), this.abort = q, this.context = K
        }
        onHeaders(q, K, _) {
            let {
                opaque: z,
                handler: Y,
                context: A
            } = this;
            if (q < 200) {
                if (this.onInfo) {
                    let w = this.responseHeaders === "raw" ? Ob.parseRawHeaders(K) : Ob.parseHeaders(K);
                    this.onInfo({
                        statusCode: q,
                        headers: w
                    })
                }
                return
            }
            this.res = new sn7(_);
            let O;
            try {
                this.handler = null;
                let w = this.responseHeaders === "raw" ? Ob.parseRawHeaders(K) : Ob.parseHeaders(K);
                O = this.runInAsyncScope(Y, null, {
                    statusCode: q,
                    headers: w,
                    opaque: z,
                    body: this.res,
                    context: A
                })
            } catch (w) {
                throw this.res.on("error", Ob.nop), w
            }
            if (!O || typeof O.on !== "function") throw new T83("expected Readable");
            O.on("data", (w) => {
                let {
                    ret: $,
                    body: j
                } = this;
                if (!$.push(w) && j.pause) j.pause()
            }).on("error", (w) => {
                let {
                    ret: $
                } = this;
                Ob.destroy($, w)
            }).on("end", () => {
                let {
                    ret: w
                } = this;
                w.push(null)
            }).on("close", () => {
                let {
                    ret: w
                } = this;
                if (!w._readableState.ended) Ob.destroy(w, new G21)
            }), this.body = O
        }
        onData(q) {
            let {
                res: K
            } = this;
            return K.push(q)
        }
        onComplete(q) {
            let {
                res: K
            } = this;
            K.push(null)
        }
        onError(q) {
            let {
                ret: K
            } = this;
            this.handler = null, Ob.destroy(K, q)
        }
    }

    function E83(q, K) {
        try {
            let _ = new tn7(q, K);
            return this.dispatch({
                ...q,
                body: _.req
            }, _), _.ret
        } catch (_) {
            return new v83().destroy(_)
        }
    }
    en7.exports = E83
})
// @from(Ln 59989, Col 4)
wi7 = p((C_O, Oi7) => {
    var {
        InvalidArgumentError: v21,
        SocketError: y83
    } = aA(), {
        AsyncResource: L83
    } = d6("node:async_hooks"), Ki7 = Hz(), {
        addSignal: h83,
        removeSignal: _i7
    } = vd6(), zi7 = d6("node:assert");
    class Yi7 extends L83 {
        constructor(q, K) {
            if (!q || typeof q !== "object") throw new v21("invalid opts");
            if (typeof K !== "function") throw new v21("invalid callback");
            let {
                signal: _,
                opaque: z,
                responseHeaders: Y
            } = q;
            if (_ && typeof _.on !== "function" && typeof _.addEventListener !== "function") throw new v21("signal must be an EventEmitter or EventTarget");
            super("UNDICI_UPGRADE");
            this.responseHeaders = Y || null, this.opaque = z || null, this.callback = K, this.abort = null, this.context = null, h83(this, _)
        }
        onConnect(q, K) {
            if (this.reason) {
                q(this.reason);
                return
            }
            zi7(this.callback), this.abort = q, this.context = null
        }
        onHeaders() {
            throw new y83("bad upgrade", null)
        }
        onUpgrade(q, K, _) {
            zi7(q === 101);
            let {
                callback: z,
                opaque: Y,
                context: A
            } = this;
            _i7(this), this.callback = null;
            let O = this.responseHeaders === "raw" ? Ki7.parseRawHeaders(K) : Ki7.parseHeaders(K);
            this.runInAsyncScope(z, null, null, {
                headers: O,
                socket: _,
                opaque: Y,
                context: A
            })
        }
        onError(q) {
            let {
                callback: K,
                opaque: _
            } = this;
            if (_i7(this), K) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(K, null, q, {
                    opaque: _
                })
            })
        }
    }

    function Ai7(q, K) {
        if (K === void 0) return new Promise((_, z) => {
            Ai7.call(this, q, (Y, A) => {
                return Y ? z(Y) : _(A)
            })
        });
        try {
            let _ = new Yi7(q, K);
            this.dispatch({
                ...q,
                method: q.method || "GET",
                upgrade: q.protocol || "Websocket"
            }, _)
        } catch (_) {
            if (typeof K !== "function") throw _;
            let z = q?.opaque;
            queueMicrotask(() => K(_, {
                opaque: z
            }))
        }
    }
    Oi7.exports = Ai7
})
// @from(Ln 60074, Col 4)
Mi7 = p((b_O, Xi7) => {
    var R83 = d6("node:assert"),
        {
            AsyncResource: S83
        } = d6("node:async_hooks"),
        {
            InvalidArgumentError: T21,
            SocketError: C83
        } = aA(),
        $i7 = Hz(),
        {
            addSignal: b83,
            removeSignal: ji7
        } = vd6();
    class Hi7 extends S83 {
        constructor(q, K) {
            if (!q || typeof q !== "object") throw new T21("invalid opts");
            if (typeof K !== "function") throw new T21("invalid callback");
            let {
                signal: _,
                opaque: z,
                responseHeaders: Y
            } = q;
            if (_ && typeof _.on !== "function" && typeof _.addEventListener !== "function") throw new T21("signal must be an EventEmitter or EventTarget");
            super("UNDICI_CONNECT");
            this.opaque = z || null, this.responseHeaders = Y || null, this.callback = K, this.abort = null, b83(this, _)
        }
        onConnect(q, K) {
            if (this.reason) {
                q(this.reason);
                return
            }
            R83(this.callback), this.abort = q, this.context = K
        }
        onHeaders() {
            throw new C83("bad connect", null)
        }
        onUpgrade(q, K, _) {
            let {
                callback: z,
                opaque: Y,
                context: A
            } = this;
            ji7(this), this.callback = null;
            let O = K;
            if (O != null) O = this.responseHeaders === "raw" ? $i7.parseRawHeaders(K) : $i7.parseHeaders(K);
            this.runInAsyncScope(z, null, null, {
                statusCode: q,
                headers: O,
                socket: _,
                opaque: Y,
                context: A
            })
        }
        onError(q) {
            let {
                callback: K,
                opaque: _
            } = this;
            if (ji7(this), K) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(K, null, q, {
                    opaque: _
                })
            })
        }
    }

    function Ji7(q, K) {
        if (K === void 0) return new Promise((_, z) => {
            Ji7.call(this, q, (Y, A) => {
                return Y ? z(Y) : _(A)
            })
        });
        try {
            let _ = new Hi7(q, K);
            this.dispatch({
                ...q,
                method: "CONNECT"
            }, _)
        } catch (_) {
            if (typeof K !== "function") throw _;
            let z = q?.opaque;
            queueMicrotask(() => K(_, {
                opaque: z
            }))
        }
    }
    Xi7.exports = Ji7
})
// @from(Ln 60163, Col 4)
Pi7 = p((I83, dG6) => {
    I83.request = Fn7();
    I83.stream = in7();
    I83.pipeline = qi7();
    I83.upgrade = wi7();
    I83.connect = Mi7()
})
// @from(Ln 60170, Col 4)
k21 = p((I_O, Di7) => {
    var {
        UndiciError: F83
    } = aA(), Wi7 = Symbol.for("undici.error.UND_MOCK_ERR_MOCK_NOT_MATCHED");
    class V21 extends F83 {
        constructor(q) {
            super(q);
            Error.captureStackTrace(this, V21), this.name = "MockNotMatchedError", this.message = q || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED"
        }
        static[Symbol.hasInstance](q) {
            return q && q[Wi7] === !0
        } [Wi7] = !0
    }
    Di7.exports = {
        MockNotMatchedError: V21
    }
})
// @from(Ln 60187, Col 4)
cG6 = p((x_O, Zi7) => {
    Zi7.exports = {
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
// @from(Ln 60210, Col 4)
Vd6 = p((u_O, hi7) => {
    var {
        MockNotMatchedError: _O6
    } = k21(), {
        kDispatches: VM8,
        kMockAgent: g83,
        kOriginalDispatch: U83,
        kOrigin: Q83,
        kGetNetConnect: d83
    } = cG6(), {
        buildURL: c83
    } = Hz(), {
        STATUS_CODES: l83
    } = d6("node:http"), {
        types: {
            isPromise: n83
        }
    } = d6("node:util");

    function Br(q, K) {
        if (typeof q === "string") return q === K;
        if (q instanceof RegExp) return q.test(K);
        if (typeof q === "function") return q(K) === !0;
        return !1
    }

    function Gi7(q) {
        return Object.fromEntries(Object.entries(q).map(([K, _]) => {
            return [K.toLocaleLowerCase(), _]
        }))
    }

    function vi7(q, K) {
        if (Array.isArray(q)) {
            for (let _ = 0; _ < q.length; _ += 2)
                if (q[_].toLocaleLowerCase() === K.toLocaleLowerCase()) return q[_ + 1];
            return
        } else if (typeof q.get === "function") return q.get(K);
        else return Gi7(q)[K.toLocaleLowerCase()]
    }

    function y21(q) {
        let K = q.slice(),
            _ = [];
        for (let z = 0; z < K.length; z += 2) _.push([K[z], K[z + 1]]);
        return Object.fromEntries(_)
    }

    function Ti7(q, K) {
        if (typeof q.headers === "function") {
            if (Array.isArray(K)) K = y21(K);
            return q.headers(K ? Gi7(K) : {})
        }
        if (typeof q.headers > "u") return !0;
        if (typeof K !== "object" || typeof q.headers !== "object") return !1;
        for (let [_, z] of Object.entries(q.headers)) {
            let Y = vi7(K, _);
            if (!Br(z, Y)) return !1
        }
        return !0
    }

    function fi7(q) {
        if (typeof q !== "string") return q;
        let K = q.split("?");
        if (K.length !== 2) return q;
        let _ = new URLSearchParams(K.pop());
        return _.sort(), [...K, _.toString()].join("?")
    }

    function i83(q, {
        path: K,
        method: _,
        body: z,
        headers: Y
    }) {
        let A = Br(q.path, K),
            O = Br(q.method, _),
            w = typeof q.body < "u" ? Br(q.body, z) : !0,
            $ = Ti7(q, Y);
        return A && O && w && $
    }

    function Vi7(q) {
        if (Buffer.isBuffer(q)) return q;
        else if (q instanceof Uint8Array) return q;
        else if (q instanceof ArrayBuffer) return q;
        else if (typeof q === "object") return JSON.stringify(q);
        else return q.toString()
    }

    function ki7(q, K) {
        let _ = K.query ? c83(K.path, K.query) : K.path,
            z = typeof _ === "string" ? fi7(_) : _,
            Y = q.filter(({
                consumed: A
            }) => !A).filter(({
                path: A
            }) => Br(fi7(A), z));
        if (Y.length === 0) throw new _O6(`Mock dispatch not matched for path '${z}'`);
        if (Y = Y.filter(({
                method: A
            }) => Br(A, K.method)), Y.length === 0) throw new _O6(`Mock dispatch not matched for method '${K.method}' on path '${z}'`);
        if (Y = Y.filter(({
                body: A
            }) => typeof A < "u" ? Br(A, K.body) : !0), Y.length === 0) throw new _O6(`Mock dispatch not matched for body '${K.body}' on path '${z}'`);
        if (Y = Y.filter((A) => Ti7(A, K.headers)), Y.length === 0) {
            let A = typeof K.headers === "object" ? JSON.stringify(K.headers) : K.headers;
            throw new _O6(`Mock dispatch not matched for headers '${A}' on path '${z}'`)
        }
        return Y[0]
    }

    function r83(q, K, _) {
        let z = {
                timesInvoked: 0,
                times: 1,
                persist: !1,
                consumed: !1
            },
            Y = typeof _ === "function" ? {
                callback: _
            } : {
                ..._
            },
            A = {
                ...z,
                ...K,
                pending: !0,
                data: {
                    error: null,
                    ...Y
                }
            };
        return q.push(A), A
    }

    function N21(q, K) {
        let _ = q.findIndex((z) => {
            if (!z.consumed) return !1;
            return i83(z, K)
        });
        if (_ !== -1) q.splice(_, 1)
    }

    function Ni7(q) {
        let {
            path: K,
            method: _,
            body: z,
            headers: Y,
            query: A
        } = q;
        return {
            path: K,
            method: _,
            body: z,
            headers: Y,
            query: A
        }
    }

    function E21(q) {
        let K = Object.keys(q),
            _ = [];
        for (let z = 0; z < K.length; ++z) {
            let Y = K[z],
                A = q[Y],
                O = Buffer.from(`${Y}`);
            if (Array.isArray(A))
                for (let w = 0; w < A.length; ++w) _.push(O, Buffer.from(`${A[w]}`));
            else _.push(O, Buffer.from(`${A}`))
        }
        return _
    }

    function Ei7(q) {
        return l83[q] || "unknown"
    }
    async function o83(q) {
        let K = [];
        for await (let _ of q) K.push(_);
        return Buffer.concat(K).toString("utf8")
    }

    function yi7(q, K) {
        let _ = Ni7(q),
            z = ki7(this[VM8], _);
        if (z.timesInvoked++, z.data.callback) z.data = {
            ...z.data,
            ...z.data.callback(q)
        };
        let {
            data: {
                statusCode: Y,
                data: A,
                headers: O,
                trailers: w,
                error: $
            },
            delay: j,
            persist: H
        } = z, {
            timesInvoked: J,
            times: X
        } = z;
        if (z.consumed = !H && J >= X, z.pending = J < X, $ !== null) return N21(this[VM8], _), K.onError($), !0;
        if (typeof j === "number" && j > 0) setTimeout(() => {
            M(this[VM8])
        }, j);
        else M(this[VM8]);

        function M(W, D = A) {
            let Z = Array.isArray(q.headers) ? y21(q.headers) : q.headers,
                G = typeof D === "function" ? D({
                    ...q,
                    headers: Z
                }) : D;
            if (n83(G)) {
                G.then((k) => M(W, k));
                return
            }
            let f = Vi7(G),
                v = E21(O),
                V = E21(w);
            K.onConnect?.((k) => K.onError(k), null), K.onHeaders?.(Y, v, P, Ei7(Y)), K.onData?.(Buffer.from(f)), K.onComplete?.(V), N21(W, _)
        }

        function P() {}
        return !0
    }

    function a83() {
        let q = this[g83],
            K = this[Q83],
            _ = this[U83];
        return function(Y, A) {
            if (q.isMockActive) try {
                yi7.call(this, Y, A)
            } catch (O) {
                if (O instanceof _O6) {
                    let w = q[d83]();
                    if (w === !1) throw new _O6(`${O.message}: subsequent request to origin ${K} was not allowed (net.connect disabled)`);
                    if (Li7(w, K)) _.call(this, Y, A);
                    else throw new _O6(`${O.message}: subsequent request to origin ${K} was not allowed (net.connect is not enabled for this origin)`)
                } else throw O
            } else _.call(this, Y, A)
        }
    }

    function Li7(q, K) {
        let _ = new URL(K);
        if (q === !0) return !0;
        else if (Array.isArray(q) && q.some((z) => Br(z, _.host))) return !0;
        return !1
    }

    function s83(q) {
        if (q) {
            let {
                agent: K,
                ..._
            } = q;
            return _
        }
    }
    hi7.exports = {
        getResponseData: Vi7,
        getMockDispatch: ki7,
        addMockDispatch: r83,
        deleteMockDispatch: N21,
        buildKey: Ni7,
        generateKeyValues: E21,
        matchValue: Br,
        getResponse: o83,
        getStatusText: Ei7,
        mockDispatch: yi7,
        buildMockDispatch: a83,
        checkNetConnect: Li7,
        buildMockOptions: s83,
        getHeaderByName: vi7,
        buildHeadersFromArray: y21
    }
})
// @from(Ln 60494, Col 4)
b21 = p((K13, C21) => {
    var {
        getResponseData: t83,
        buildKey: e83,
        addMockDispatch: L21
    } = Vd6(), {
        kDispatches: kM8,
        kDispatchKey: NM8,
        kDefaultHeaders: h21,
        kDefaultTrailers: R21,
        kContentLength: S21,
        kMockDispatch: EM8
    } = cG6(), {
        InvalidArgumentError: uU
    } = aA(), {
        buildURL: q13
    } = Hz();
    class kd6 {
        constructor(q) {
            this[EM8] = q
        }
        delay(q) {
            if (typeof q !== "number" || !Number.isInteger(q) || q <= 0) throw new uU("waitInMs must be a valid integer > 0");
            return this[EM8].delay = q, this
        }
        persist() {
            return this[EM8].persist = !0, this
        }
        times(q) {
            if (typeof q !== "number" || !Number.isInteger(q) || q <= 0) throw new uU("repeatTimes must be a valid integer > 0");
            return this[EM8].times = q, this
        }
    }
    class Ri7 {
        constructor(q, K) {
            if (typeof q !== "object") throw new uU("opts must be an object");
            if (typeof q.path > "u") throw new uU("opts.path must be defined");
            if (typeof q.method > "u") q.method = "GET";
            if (typeof q.path === "string")
                if (q.query) q.path = q13(q.path, q.query);
                else {
                    let _ = new URL(q.path, "data://");
                    q.path = _.pathname + _.search
                } if (typeof q.method === "string") q.method = q.method.toUpperCase();
            this[NM8] = e83(q), this[kM8] = K, this[h21] = {}, this[R21] = {}, this[S21] = !1
        }
        createMockScopeDispatchData({
            statusCode: q,
            data: K,
            responseOptions: _
        }) {
            let z = t83(K),
                Y = this[S21] ? {
                    "content-length": z.length
                } : {},
                A = {
                    ...this[h21],
                    ...Y,
                    ..._.headers
                },
                O = {
                    ...this[R21],
                    ..._.trailers
                };
            return {
                statusCode: q,
                data: K,
                headers: A,
                trailers: O
            }
        }
        validateReplyParameters(q) {
            if (typeof q.statusCode > "u") throw new uU("statusCode must be defined");
            if (typeof q.responseOptions !== "object" || q.responseOptions === null) throw new uU("responseOptions must be an object")
        }
        reply(q) {
            if (typeof q === "function") {
                let Y = (O) => {
                        let w = q(O);
                        if (typeof w !== "object" || w === null) throw new uU("reply options callback must return an object");
                        let $ = {
                            data: "",
                            responseOptions: {},
                            ...w
                        };
                        return this.validateReplyParameters($), {
                            ...this.createMockScopeDispatchData($)
                        }
                    },
                    A = L21(this[kM8], this[NM8], Y);
                return new kd6(A)
            }
            let K = {
                statusCode: q,
                data: arguments[1] === void 0 ? "" : arguments[1],
                responseOptions: arguments[2] === void 0 ? {} : arguments[2]
            };
            this.validateReplyParameters(K);
            let _ = this.createMockScopeDispatchData(K),
                z = L21(this[kM8], this[NM8], _);
            return new kd6(z)
        }
        replyWithError(q) {
            if (typeof q > "u") throw new uU("error must be defined");
            let K = L21(this[kM8], this[NM8], {
                error: q
            });
            return new kd6(K)
        }
        defaultReplyHeaders(q) {
            if (typeof q > "u") throw new uU("headers must be defined");
            return this[h21] = q, this
        }
        defaultReplyTrailers(q) {
            if (typeof q > "u") throw new uU("trailers must be defined");
            return this[R21] = q, this
        }
        replyContentLength() {
            return this[S21] = !0, this
        }
    }
    K13.MockInterceptor = Ri7;
    K13.MockScope = kd6
})
// @from(Ln 60618, Col 4)
x21 = p((m_O, Bi7) => {
    var {
        promisify: Y13
    } = d6("node:util"), A13 = xG6(), {
        buildMockDispatch: O13
    } = Vd6(), {
        kDispatches: Si7,
        kMockAgent: Ci7,
        kClose: bi7,
        kOriginalClose: Ii7,
        kOrigin: xi7,
        kOriginalDispatch: w13,
        kConnected: I21
    } = cG6(), {
        MockInterceptor: $13
    } = b21(), ui7 = oj(), {
        InvalidArgumentError: j13
    } = aA();
    class mi7 extends A13 {
        constructor(q, K) {
            super(q, K);
            if (!K || !K.agent || typeof K.agent.dispatch !== "function") throw new j13("Argument opts.agent must implement Agent");
            this[Ci7] = K.agent, this[xi7] = q, this[Si7] = [], this[I21] = 1, this[w13] = this.dispatch, this[Ii7] = this.close.bind(this), this.dispatch = O13.call(this), this.close = this[bi7]
        }
        get[ui7.kConnected]() {
            return this[I21]
        }
        intercept(q) {
            return new $13(q, this[Si7])
        }
        async [bi7]() {
            await Y13(this[Ii7])(), this[I21] = 0, this[Ci7][ui7.kClients].delete(this[xi7])
        }
    }
    Bi7.exports = mi7
})
// @from(Ln 60654, Col 4)
m21 = p((B_O, li7) => {
    var {
        promisify: H13
    } = d6("node:util"), J13 = uG6(), {
        buildMockDispatch: X13
    } = Vd6(), {
        kDispatches: pi7,
        kMockAgent: Fi7,
        kClose: gi7,
        kOriginalClose: Ui7,
        kOrigin: Qi7,
        kOriginalDispatch: M13,
        kConnected: u21
    } = cG6(), {
        MockInterceptor: P13
    } = b21(), di7 = oj(), {
        InvalidArgumentError: W13
    } = aA();
    class ci7 extends J13 {
        constructor(q, K) {
            super(q, K);
            if (!K || !K.agent || typeof K.agent.dispatch !== "function") throw new W13("Argument opts.agent must implement Agent");
            this[Fi7] = K.agent, this[Qi7] = q, this[pi7] = [], this[u21] = 1, this[M13] = this.dispatch, this[Ui7] = this.close.bind(this), this.dispatch = X13.call(this), this.close = this[gi7]
        }
        get[di7.kConnected]() {
            return this[u21]
        }
        intercept(q) {
            return new P13(q, this[pi7])
        }
        async [gi7]() {
            await H13(this[Ui7])(), this[u21] = 0, this[Fi7][di7.kClients].delete(this[Qi7])
        }
    }
    li7.exports = ci7
})
// @from(Ln 60690, Col 4)
ii7 = p((p_O, ni7) => {
    var D13 = {
            pronoun: "it",
            is: "is",
            was: "was",
            this: "this"
        },
        Z13 = {
            pronoun: "they",
            is: "are",
            was: "were",
            this: "these"
        };
    ni7.exports = class {
        constructor(K, _) {
            this.singular = K, this.plural = _
        }
        pluralize(K) {
            let _ = K === 1,
                z = _ ? D13 : Z13,
                Y = _ ? this.singular : this.plural;
            return {
                ...z,
                count: K,
                noun: Y
            }
        }
    }
})