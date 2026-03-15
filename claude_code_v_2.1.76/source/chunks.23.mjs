
// @from(Ln 54568, Col 4)
oR6 = x((Fw_, FSA) => {
    var zQ = x6("node:assert"),
        xSA = x6("node:net"),
        JIK = x6("node:http"),
        C76 = Y9(),
        {
            channels: RH6
        } = jH6(),
        MIK = TRA(),
        DIK = XH6(),
        {
            InvalidArgumentError: Tj,
            InformationalError: XIK,
            ClientDestroyedError: PIK
        } = mz(),
        WIK = SR6(),
        {
            kUrl: Ou,
            kServerName: Lr,
            kClient: ZIK,
            kBusy: Ko1,
            kConnect: GIK,
            kResuming: I76,
            kRunning: nR6,
            kPending: rR6,
            kSize: iR6,
            kQueue: QS,
            kConnected: fIK,
            kConnecting: hH6,
            kNeedDrain: hr,
            kKeepAliveDefaultTimeout: hSA,
            kHostHeader: TIK,
            kPendingIdx: US,
            kRunningIdx: _Q,
            kError: vIK,
            kPipelining: b71,
            kKeepAliveTimeoutValue: NIK,
            kMaxHeadersSize: VIK,
            kKeepAliveMaxTimeout: kIK,
            kKeepAliveTimeoutThreshold: EIK,
            kHeadersTimeout: yIK,
            kBodyTimeout: LIK,
            kStrictContentLength: RIK,
            kConnector: dR6,
            kMaxRedirections: hIK,
            kMaxRequests: Yo1,
            kCounter: SIK,
            kClose: CIK,
            kDestroy: IIK,
            kDispatch: bIK,
            kInterceptors: SSA,
            kLocalAddress: cR6,
            kMaxResponseSize: xIK,
            kOnError: uIK,
            kHTTPContext: vj,
            kMaxConcurrentStreams: mIK,
            kResume: lR6
        } = UO(),
        BIK = PSA(),
        gIK = VSA(),
        CSA = !1,
        Rr = Symbol("kClosedResolve"),
        ISA = () => {};

    function uSA(A) {
        return A[b71] ?? A[vj]?.defaultPipelining ?? 1
    }
    class mSA extends DIK {
        constructor(A, {
            interceptors: q,
            maxHeaderSize: K,
            headersTimeout: Y,
            socketTimeout: z,
            requestTimeout: _,
            connectTimeout: w,
            bodyTimeout: O,
            idleTimeout: $,
            keepAlive: H,
            keepAliveTimeout: j,
            maxKeepAliveTimeout: J,
            keepAliveMaxTimeout: M,
            keepAliveTimeoutThreshold: D,
            socketPath: X,
            pipelining: P,
            tls: W,
            strictContentLength: Z,
            maxCachedSessions: G,
            maxRedirections: f,
            connect: v,
            maxRequestsPerClient: N,
            localAddress: V,
            maxResponseSize: L,
            autoSelectFamily: h,
            autoSelectFamilyAttemptTimeout: R,
            maxConcurrentStreams: u,
            allowH2: I
        } = {}) {
            super();
            if (H !== void 0) throw new Tj("unsupported keepAlive, use pipelining=0 instead");
            if (z !== void 0) throw new Tj("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
            if (_ !== void 0) throw new Tj("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
            if ($ !== void 0) throw new Tj("unsupported idleTimeout, use keepAliveTimeout instead");
            if (J !== void 0) throw new Tj("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
            if (K != null && !Number.isFinite(K)) throw new Tj("invalid maxHeaderSize");
            if (X != null && typeof X !== "string") throw new Tj("invalid socketPath");
            if (w != null && (!Number.isFinite(w) || w < 0)) throw new Tj("invalid connectTimeout");
            if (j != null && (!Number.isFinite(j) || j <= 0)) throw new Tj("invalid keepAliveTimeout");
            if (M != null && (!Number.isFinite(M) || M <= 0)) throw new Tj("invalid keepAliveMaxTimeout");
            if (D != null && !Number.isFinite(D)) throw new Tj("invalid keepAliveTimeoutThreshold");
            if (Y != null && (!Number.isInteger(Y) || Y < 0)) throw new Tj("headersTimeout must be a positive integer or zero");
            if (O != null && (!Number.isInteger(O) || O < 0)) throw new Tj("bodyTimeout must be a positive integer or zero");
            if (v != null && typeof v !== "function" && typeof v !== "object") throw new Tj("connect must be a function or an object");
            if (f != null && (!Number.isInteger(f) || f < 0)) throw new Tj("maxRedirections must be a positive number");
            if (N != null && (!Number.isInteger(N) || N < 0)) throw new Tj("maxRequestsPerClient must be a positive number");
            if (V != null && (typeof V !== "string" || xSA.isIP(V) === 0)) throw new Tj("localAddress must be valid string IP address");
            if (L != null && (!Number.isInteger(L) || L < -1)) throw new Tj("maxResponseSize must be a positive number");
            if (R != null && (!Number.isInteger(R) || R < -1)) throw new Tj("autoSelectFamilyAttemptTimeout must be a positive number");
            if (I != null && typeof I !== "boolean") throw new Tj("allowH2 must be a valid boolean value");
            if (u != null && (typeof u !== "number" || u < 1)) throw new Tj("maxConcurrentStreams must be a positive integer, greater than 0");
            if (typeof v !== "function") v = WIK({
                ...W,
                maxCachedSessions: G,
                allowH2: I,
                socketPath: X,
                timeout: w,
                ...h ? {
                    autoSelectFamily: h,
                    autoSelectFamilyAttemptTimeout: R
                } : void 0,
                ...v
            });
            if (q?.Client && Array.isArray(q.Client)) {
                if (this[SSA] = q.Client, !CSA) CSA = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
                    code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
                })
            } else this[SSA] = [FIK({
                maxRedirections: f
            })];
            this[Ou] = C76.parseOrigin(A), this[dR6] = v, this[b71] = P != null ? P : 1, this[VIK] = K || JIK.maxHeaderSize, this[hSA] = j == null ? 4000 : j, this[kIK] = M == null ? 600000 : M, this[EIK] = D == null ? 2000 : D, this[NIK] = this[hSA], this[Lr] = null, this[cR6] = V != null ? V : null, this[I76] = 0, this[hr] = 0, this[TIK] = `host: ${this[Ou].hostname}${this[Ou].port?`:${this[Ou].port}`:""}\r
`, this[LIK] = O != null ? O : 300000, this[yIK] = Y != null ? Y : 300000, this[RIK] = Z == null ? !0 : Z, this[hIK] = f, this[Yo1] = N, this[Rr] = null, this[xIK] = L > -1 ? L : -1, this[mIK] = u != null ? u : 100, this[vj] = null, this[QS] = [], this[_Q] = 0, this[US] = 0, this[lR6] = (g) => zo1(this, g), this[uIK] = (g) => BSA(this, g)
        }
        get pipelining() {
            return this[b71]
        }
        set pipelining(A) {
            this[b71] = A, this[lR6](!0)
        }
        get[rR6]() {
            return this[QS].length - this[US]
        }
        get[nR6]() {
            return this[US] - this[_Q]
        }
        get[iR6]() {
            return this[QS].length - this[_Q]
        }
        get[fIK]() {
            return !!this[vj] && !this[hH6] && !this[vj].destroyed
        }
        get[Ko1]() {
            return Boolean(this[vj]?.busy(null) || this[iR6] >= (uSA(this) || 1) || this[rR6] > 0)
        } [GIK](A) {
            gSA(this), this.once("connect", A)
        } [bIK](A, q) {
            let K = A.origin || this[Ou].origin,
                Y = new MIK(K, A, q);
            if (this[QS].push(Y), this[I76]);
            else if (C76.bodyLength(Y.body) == null && C76.isIterable(Y.body)) this[I76] = 1, queueMicrotask(() => zo1(this));
            else this[lR6](!0);
            if (this[I76] && this[hr] !== 2 && this[Ko1]) this[hr] = 2;
            return this[hr] < 2
        }
        async [CIK]() {
            return new Promise((A) => {
                if (this[iR6]) this[Rr] = A;
                else A(null)
            })
        }
        async [IIK](A) {
            return new Promise((q) => {
                let K = this[QS].splice(this[US]);
                for (let z = 0; z < K.length; z++) {
                    let _ = K[z];
                    C76.errorRequest(this, _, A)
                }
                let Y = () => {
                    if (this[Rr]) this[Rr](), this[Rr] = null;
                    q(null)
                };
                if (this[vj]) this[vj].destroy(A, Y), this[vj] = null;
                else queueMicrotask(Y);
                this[lR6]()
            })
        }
    }
    var FIK = I71();

    function BSA(A, q) {
        if (A[nR6] === 0 && q.code !== "UND_ERR_INFO" && q.code !== "UND_ERR_SOCKET") {
            zQ(A[US] === A[_Q]);
            let K = A[QS].splice(A[_Q]);
            for (let Y = 0; Y < K.length; Y++) {
                let z = K[Y];
                C76.errorRequest(A, z, q)
            }
            zQ(A[iR6] === 0)
        }
    }
    async function gSA(A) {
        zQ(!A[hH6]), zQ(!A[vj]);
        let {
            host: q,
            hostname: K,
            protocol: Y,
            port: z
        } = A[Ou];
        if (K[0] === "[") {
            let _ = K.indexOf("]");
            zQ(_ !== -1);
            let w = K.substring(1, _);
            zQ(xSA.isIP(w)), K = w
        }
        if (A[hH6] = !0, RH6.beforeConnect.hasSubscribers) RH6.beforeConnect.publish({
            connectParams: {
                host: q,
                hostname: K,
                protocol: Y,
                port: z,
                version: A[vj]?.version,
                servername: A[Lr],
                localAddress: A[cR6]
            },
            connector: A[dR6]
        });
        try {
            let _ = await new Promise((w, O) => {
                A[dR6]({
                    host: q,
                    hostname: K,
                    protocol: Y,
                    port: z,
                    servername: A[Lr],
                    localAddress: A[cR6]
                }, ($, H) => {
                    if ($) O($);
                    else w(H)
                })
            });
            if (A.destroyed) {
                C76.destroy(_.on("error", ISA), new PIK);
                return
            }
            zQ(_);
            try {
                A[vj] = _.alpnProtocol === "h2" ? await gIK(A, _) : await BIK(A, _)
            } catch (w) {
                throw _.destroy().on("error", ISA), w
            }
            if (A[hH6] = !1, _[SIK] = 0, _[Yo1] = A[Yo1], _[ZIK] = A, _[vIK] = null, RH6.connected.hasSubscribers) RH6.connected.publish({
                connectParams: {
                    host: q,
                    hostname: K,
                    protocol: Y,
                    port: z,
                    version: A[vj]?.version,
                    servername: A[Lr],
                    localAddress: A[cR6]
                },
                connector: A[dR6],
                socket: _
            });
            A.emit("connect", A[Ou], [A])
        } catch (_) {
            if (A.destroyed) return;
            if (A[hH6] = !1, RH6.connectError.hasSubscribers) RH6.connectError.publish({
                connectParams: {
                    host: q,
                    hostname: K,
                    protocol: Y,
                    port: z,
                    version: A[vj]?.version,
                    servername: A[Lr],
                    localAddress: A[cR6]
                },
                connector: A[dR6],
                error: _
            });
            if (_.code === "ERR_TLS_CERT_ALTNAME_INVALID") {
                zQ(A[nR6] === 0);
                while (A[rR6] > 0 && A[QS][A[US]].servername === A[Lr]) {
                    let w = A[QS][A[US]++];
                    C76.errorRequest(A, w, _)
                }
            } else BSA(A, _);
            A.emit("connectionError", A[Ou], [A], _)
        }
        A[lR6]()
    }

    function bSA(A) {
        A[hr] = 0, A.emit("drain", A[Ou], [A])
    }

    function zo1(A, q) {
        if (A[I76] === 2) return;
        if (A[I76] = 2, pIK(A, q), A[I76] = 0, A[_Q] > 256) A[QS].splice(0, A[_Q]), A[US] -= A[_Q], A[_Q] = 0
    }

    function pIK(A, q) {
        while (!0) {
            if (A.destroyed) {
                zQ(A[rR6] === 0);
                return
            }
            if (A[Rr] && !A[iR6]) {
                A[Rr](), A[Rr] = null;
                return
            }
            if (A[vj]) A[vj].resume();
            if (A[Ko1]) A[hr] = 2;
            else if (A[hr] === 2) {
                if (q) A[hr] = 1, queueMicrotask(() => bSA(A));
                else bSA(A);
                continue
            }
            if (A[rR6] === 0) return;
            if (A[nR6] >= (uSA(A) || 1)) return;
            let K = A[QS][A[US]];
            if (A[Ou].protocol === "https:" && A[Lr] !== K.servername) {
                if (A[nR6] > 0) return;
                A[Lr] = K.servername, A[vj]?.destroy(new XIK("servername changed"), () => {
                    A[vj] = null, zo1(A)
                })
            }
            if (A[hH6]) return;
            if (!A[vj]) {
                gSA(A);
                return
            }
            if (A[vj].destroyed) return;
            if (A[vj].busy(K)) return;
            if (!K.aborted && A[vj].write(K)) A[US]++;
            else A[QS].splice(A[US], 1)
        }
    }
    FSA.exports = mSA
})
// @from(Ln 54915, Col 4)
wo1 = x((pw_, pSA) => {
    class _o1 {
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
    pSA.exports = class {
        constructor() {
            this.head = this.tail = new _o1
        }
        isEmpty() {
            return this.head.isEmpty()
        }
        push(q) {
            if (this.head.isFull()) this.head = this.head.next = new _o1;
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
// @from(Ln 54954, Col 4)
dSA = x((Qw_, USA) => {
    var {
        kFree: QIK,
        kConnected: UIK,
        kPending: dIK,
        kQueued: cIK,
        kRunning: lIK,
        kSize: iIK
    } = UO(), b76 = Symbol("pool");
    class QSA {
        constructor(A) {
            this[b76] = A
        }
        get connected() {
            return this[b76][UIK]
        }
        get free() {
            return this[b76][QIK]
        }
        get pending() {
            return this[b76][dIK]
        }
        get queued() {
            return this[b76][cIK]
        }
        get running() {
            return this[b76][lIK]
        }
        get size() {
            return this[b76][iIK]
        }
    }
    USA.exports = QSA
})
// @from(Ln 54988, Col 4)
Jo1 = x((Uw_, ACA) => {
    var nIK = XH6(),
        rIK = wo1(),
        {
            kConnected: Oo1,
            kSize: cSA,
            kRunning: lSA,
            kPending: iSA,
            kQueued: aR6,
            kBusy: oIK,
            kFree: aIK,
            kUrl: sIK,
            kClose: tIK,
            kDestroy: eIK,
            kDispatch: AbK
        } = UO(),
        qbK = dSA(),
        CT = Symbol("clients"),
        WG = Symbol("needDrain"),
        sR6 = Symbol("queue"),
        $o1 = Symbol("closed resolve"),
        Ho1 = Symbol("onDrain"),
        nSA = Symbol("onConnect"),
        rSA = Symbol("onDisconnect"),
        oSA = Symbol("onConnectionError"),
        jo1 = Symbol("get dispatcher"),
        sSA = Symbol("add client"),
        tSA = Symbol("remove client"),
        aSA = Symbol("stats");
    class eSA extends nIK {
        constructor() {
            super();
            this[sR6] = new rIK, this[CT] = [], this[aR6] = 0;
            let A = this;
            this[Ho1] = function(K, Y) {
                let z = A[sR6],
                    _ = !1;
                while (!_) {
                    let w = z.shift();
                    if (!w) break;
                    A[aR6]--, _ = !this.dispatch(w.opts, w.handler)
                }
                if (this[WG] = _, !this[WG] && A[WG]) A[WG] = !1, A.emit("drain", K, [A, ...Y]);
                if (A[$o1] && z.isEmpty()) Promise.all(A[CT].map((w) => w.close())).then(A[$o1])
            }, this[nSA] = (q, K) => {
                A.emit("connect", q, [A, ...K])
            }, this[rSA] = (q, K, Y) => {
                A.emit("disconnect", q, [A, ...K], Y)
            }, this[oSA] = (q, K, Y) => {
                A.emit("connectionError", q, [A, ...K], Y)
            }, this[aSA] = new qbK(this)
        }
        get[oIK]() {
            return this[WG]
        }
        get[Oo1]() {
            return this[CT].filter((A) => A[Oo1]).length
        }
        get[aIK]() {
            return this[CT].filter((A) => A[Oo1] && !A[WG]).length
        }
        get[iSA]() {
            let A = this[aR6];
            for (let {
                    [iSA]: q
                }
                of this[CT]) A += q;
            return A
        }
        get[lSA]() {
            let A = 0;
            for (let {
                    [lSA]: q
                }
                of this[CT]) A += q;
            return A
        }
        get[cSA]() {
            let A = this[aR6];
            for (let {
                    [cSA]: q
                }
                of this[CT]) A += q;
            return A
        }
        get stats() {
            return this[aSA]
        }
        async [tIK]() {
            if (this[sR6].isEmpty()) await Promise.all(this[CT].map((A) => A.close()));
            else await new Promise((A) => {
                this[$o1] = A
            })
        }
        async [eIK](A) {
            while (!0) {
                let q = this[sR6].shift();
                if (!q) break;
                q.handler.onError(A)
            }
            await Promise.all(this[CT].map((q) => q.destroy(A)))
        } [AbK](A, q) {
            let K = this[jo1]();
            if (!K) this[WG] = !0, this[sR6].push({
                opts: A,
                handler: q
            }), this[aR6]++;
            else if (!K.dispatch(A, q)) K[WG] = !0, this[WG] = !this[jo1]();
            return !this[WG]
        } [sSA](A) {
            if (A.on("drain", this[Ho1]).on("connect", this[nSA]).on("disconnect", this[rSA]).on("connectionError", this[oSA]), this[CT].push(A), this[WG]) queueMicrotask(() => {
                if (this[WG]) this[Ho1](A[sIK], [this, A])
            });
            return this
        } [tSA](A) {
            A.close(() => {
                let q = this[CT].indexOf(A);
                if (q !== -1) this[CT].splice(q, 1)
            }), this[WG] = this[CT].some((q) => !q[WG] && q.closed !== !0 && q.destroyed !== !0)
        }
    }
    ACA.exports = {
        PoolBase: eSA,
        kClients: CT,
        kNeedDrain: WG,
        kAddClient: sSA,
        kRemoveClient: tSA,
        kGetDispatcher: jo1
    }
})
// @from(Ln 55118, Col 4)
SH6 = x((dw_, wCA) => {
    var {
        PoolBase: KbK,
        kClients: qCA,
        kNeedDrain: YbK,
        kAddClient: zbK,
        kGetDispatcher: _bK
    } = Jo1(), wbK = oR6(), {
        InvalidArgumentError: Mo1
    } = mz(), KCA = Y9(), {
        kUrl: YCA,
        kInterceptors: ObK
    } = UO(), $bK = SR6(), Do1 = Symbol("options"), Xo1 = Symbol("connections"), zCA = Symbol("factory");

    function HbK(A, q) {
        return new wbK(A, q)
    }
    class _CA extends KbK {
        constructor(A, {
            connections: q,
            factory: K = HbK,
            connect: Y,
            connectTimeout: z,
            tls: _,
            maxCachedSessions: w,
            socketPath: O,
            autoSelectFamily: $,
            autoSelectFamilyAttemptTimeout: H,
            allowH2: j,
            ...J
        } = {}) {
            super();
            if (q != null && (!Number.isFinite(q) || q < 0)) throw new Mo1("invalid connections");
            if (typeof K !== "function") throw new Mo1("factory must be a function.");
            if (Y != null && typeof Y !== "function" && typeof Y !== "object") throw new Mo1("connect must be a function or an object");
            if (typeof Y !== "function") Y = $bK({
                ..._,
                maxCachedSessions: w,
                allowH2: j,
                socketPath: O,
                timeout: z,
                ...$ ? {
                    autoSelectFamily: $,
                    autoSelectFamilyAttemptTimeout: H
                } : void 0,
                ...Y
            });
            this[ObK] = J.interceptors?.Pool && Array.isArray(J.interceptors.Pool) ? J.interceptors.Pool : [], this[Xo1] = q || null, this[YCA] = KCA.parseOrigin(A), this[Do1] = {
                ...KCA.deepClone(J),
                connect: Y,
                allowH2: j
            }, this[Do1].interceptors = J.interceptors ? {
                ...J.interceptors
            } : void 0, this[zCA] = K
        } [_bK]() {
            for (let A of this[qCA])
                if (!A[YbK]) return A;
            if (!this[Xo1] || this[qCA].length < this[Xo1]) {
                let A = this[zCA](this[YCA], this[Do1]);
                return this[zbK](A), A
            }
        }
    }
    wCA.exports = _CA
})
// @from(Ln 55183, Col 4)
MCA = x((cw_, JCA) => {
    var {
        BalancedPoolMissingUpstreamError: jbK,
        InvalidArgumentError: JbK
    } = mz(), {
        PoolBase: MbK,
        kClients: fW,
        kNeedDrain: tR6,
        kAddClient: DbK,
        kRemoveClient: XbK,
        kGetDispatcher: PbK
    } = Jo1(), WbK = SH6(), {
        kUrl: Po1,
        kInterceptors: ZbK
    } = UO(), {
        parseOrigin: OCA
    } = Y9(), $CA = Symbol("factory"), x71 = Symbol("options"), HCA = Symbol("kGreatestCommonDivisor"), x76 = Symbol("kCurrentWeight"), u76 = Symbol("kIndex"), ky = Symbol("kWeight"), u71 = Symbol("kMaxWeightPerServer"), m71 = Symbol("kErrorPenalty");

    function GbK(A, q) {
        if (A === 0) return q;
        while (q !== 0) {
            let K = q;
            q = A % q, A = K
        }
        return A
    }

    function fbK(A, q) {
        return new WbK(A, q)
    }
    class jCA extends MbK {
        constructor(A = [], {
            factory: q = fbK,
            ...K
        } = {}) {
            super();
            if (this[x71] = K, this[u76] = -1, this[x76] = 0, this[u71] = this[x71].maxWeightPerServer || 100, this[m71] = this[x71].errorPenalty || 15, !Array.isArray(A)) A = [A];
            if (typeof q !== "function") throw new JbK("factory must be a function.");
            this[ZbK] = K.interceptors?.BalancedPool && Array.isArray(K.interceptors.BalancedPool) ? K.interceptors.BalancedPool : [], this[$CA] = q;
            for (let Y of A) this.addUpstream(Y);
            this._updateBalancedPoolStats()
        }
        addUpstream(A) {
            let q = OCA(A).origin;
            if (this[fW].find((Y) => Y[Po1].origin === q && Y.closed !== !0 && Y.destroyed !== !0)) return this;
            let K = this[$CA](q, Object.assign({}, this[x71]));
            this[DbK](K), K.on("connect", () => {
                K[ky] = Math.min(this[u71], K[ky] + this[m71])
            }), K.on("connectionError", () => {
                K[ky] = Math.max(1, K[ky] - this[m71]), this._updateBalancedPoolStats()
            }), K.on("disconnect", (...Y) => {
                let z = Y[2];
                if (z && z.code === "UND_ERR_SOCKET") K[ky] = Math.max(1, K[ky] - this[m71]), this._updateBalancedPoolStats()
            });
            for (let Y of this[fW]) Y[ky] = this[u71];
            return this._updateBalancedPoolStats(), this
        }
        _updateBalancedPoolStats() {
            let A = 0;
            for (let q = 0; q < this[fW].length; q++) A = GbK(this[fW][q][ky], A);
            this[HCA] = A
        }
        removeUpstream(A) {
            let q = OCA(A).origin,
                K = this[fW].find((Y) => Y[Po1].origin === q && Y.closed !== !0 && Y.destroyed !== !0);
            if (K) this[XbK](K);
            return this
        }
        get upstreams() {
            return this[fW].filter((A) => A.closed !== !0 && A.destroyed !== !0).map((A) => A[Po1].origin)
        } [PbK]() {
            if (this[fW].length === 0) throw new jbK;
            if (!this[fW].find((z) => !z[tR6] && z.closed !== !0 && z.destroyed !== !0)) return;
            if (this[fW].map((z) => z[tR6]).reduce((z, _) => z && _, !0)) return;
            let K = 0,
                Y = this[fW].findIndex((z) => !z[tR6]);
            while (K++ < this[fW].length) {
                this[u76] = (this[u76] + 1) % this[fW].length;
                let z = this[fW][this[u76]];
                if (z[ky] > this[fW][Y][ky] && !z[tR6]) Y = this[u76];
                if (this[u76] === 0) {
                    if (this[x76] = this[x76] - this[HCA], this[x76] <= 0) this[x76] = this[u71]
                }
                if (z[ky] >= this[x76] && !z[tR6]) return z
            }
            return this[x76] = this[fW][Y][ky], this[u76] = Y, this[fW][Y]
        }
    }
    JCA.exports = jCA
})
// @from(Ln 55273, Col 4)
CH6 = x((lw_, TCA) => {
    var {
        InvalidArgumentError: B71
    } = mz(), {
        kClients: Sr,
        kRunning: DCA,
        kClose: TbK,
        kDestroy: vbK,
        kDispatch: NbK,
        kInterceptors: VbK
    } = UO(), kbK = XH6(), EbK = SH6(), ybK = oR6(), LbK = Y9(), RbK = I71(), XCA = Symbol("onConnect"), PCA = Symbol("onDisconnect"), WCA = Symbol("onConnectionError"), hbK = Symbol("maxRedirections"), ZCA = Symbol("onDrain"), GCA = Symbol("factory"), Wo1 = Symbol("options");

    function SbK(A, q) {
        return q && q.connections === 1 ? new ybK(A, q) : new EbK(A, q)
    }
    class fCA extends kbK {
        constructor({
            factory: A = SbK,
            maxRedirections: q = 0,
            connect: K,
            ...Y
        } = {}) {
            super();
            if (typeof A !== "function") throw new B71("factory must be a function.");
            if (K != null && typeof K !== "function" && typeof K !== "object") throw new B71("connect must be a function or an object");
            if (!Number.isInteger(q) || q < 0) throw new B71("maxRedirections must be a positive number");
            if (K && typeof K !== "function") K = {
                ...K
            };
            this[VbK] = Y.interceptors?.Agent && Array.isArray(Y.interceptors.Agent) ? Y.interceptors.Agent : [RbK({
                maxRedirections: q
            })], this[Wo1] = {
                ...LbK.deepClone(Y),
                connect: K
            }, this[Wo1].interceptors = Y.interceptors ? {
                ...Y.interceptors
            } : void 0, this[hbK] = q, this[GCA] = A, this[Sr] = new Map, this[ZCA] = (z, _) => {
                this.emit("drain", z, [this, ..._])
            }, this[XCA] = (z, _) => {
                this.emit("connect", z, [this, ..._])
            }, this[PCA] = (z, _, w) => {
                this.emit("disconnect", z, [this, ..._], w)
            }, this[WCA] = (z, _, w) => {
                this.emit("connectionError", z, [this, ..._], w)
            }
        }
        get[DCA]() {
            let A = 0;
            for (let q of this[Sr].values()) A += q[DCA];
            return A
        } [NbK](A, q) {
            let K;
            if (A.origin && (typeof A.origin === "string" || A.origin instanceof URL)) K = String(A.origin);
            else throw new B71("opts.origin must be a non-empty string or URL.");
            let Y = this[Sr].get(K);
            if (!Y) Y = this[GCA](A.origin, this[Wo1]).on("drain", this[ZCA]).on("connect", this[XCA]).on("disconnect", this[PCA]).on("connectionError", this[WCA]), this[Sr].set(K, Y);
            return Y.dispatch(A, q)
        }
        async [TbK]() {
            let A = [];
            for (let q of this[Sr].values()) A.push(q.close());
            this[Sr].clear(), await Promise.all(A)
        }
        async [vbK](A) {
            let q = [];
            for (let K of this[Sr].values()) q.push(K.destroy(A));
            this[Sr].clear(), await Promise.all(q)
        }
    }
    TCA.exports = fCA
})
// @from(Ln 55344, Col 4)
Go1 = x((iw_, ECA) => {
    var {
        kProxy: CbK,
        kClose: IbK,
        kDestroy: bbK,
        kInterceptors: xbK
    } = UO(), {
        URL: eR6
    } = x6("node:url"), ubK = CH6(), mbK = SH6(), BbK = XH6(), {
        InvalidArgumentError: p71,
        RequestAbortedError: gbK,
        SecureProxyConnectionError: FbK
    } = mz(), vCA = SR6(), g71 = Symbol("proxy agent"), F71 = Symbol("proxy client"), Ah6 = Symbol("proxy headers"), Zo1 = Symbol("request tls settings"), NCA = Symbol("proxy tls settings"), VCA = Symbol("connect endpoint function");

    function pbK(A) {
        return A === "https:" ? 443 : 80
    }

    function QbK(A, q) {
        return new mbK(A, q)
    }
    var UbK = () => {};
    class kCA extends BbK {
        constructor(A) {
            super();
            if (!A || typeof A === "object" && !(A instanceof eR6) && !A.uri) throw new p71("Proxy uri is mandatory");
            let {
                clientFactory: q = QbK
            } = A;
            if (typeof q !== "function") throw new p71("Proxy opts.clientFactory must be a function.");
            let K = this.#A(A),
                {
                    href: Y,
                    origin: z,
                    port: _,
                    protocol: w,
                    username: O,
                    password: $,
                    hostname: H
                } = K;
            if (this[CbK] = {
                    uri: Y,
                    protocol: w
                }, this[xbK] = A.interceptors?.ProxyAgent && Array.isArray(A.interceptors.ProxyAgent) ? A.interceptors.ProxyAgent : [], this[Zo1] = A.requestTls, this[NCA] = A.proxyTls, this[Ah6] = A.headers || {}, A.auth && A.token) throw new p71("opts.auth cannot be used in combination with opts.token");
            else if (A.auth) this[Ah6]["proxy-authorization"] = `Basic ${A.auth}`;
            else if (A.token) this[Ah6]["proxy-authorization"] = A.token;
            else if (O && $) this[Ah6]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(O)}:${decodeURIComponent($)}`).toString("base64")}`;
            let j = vCA({
                ...A.proxyTls
            });
            this[VCA] = vCA({
                ...A.requestTls
            }), this[F71] = q(K, {
                connect: j
            }), this[g71] = new ubK({
                ...A,
                connect: async (J, M) => {
                    let D = J.host;
                    if (!J.port) D += `:${pbK(J.protocol)}`;
                    try {
                        let {
                            socket: X,
                            statusCode: P
                        } = await this[F71].connect({
                            origin: z,
                            port: _,
                            path: D,
                            signal: J.signal,
                            headers: {
                                ...this[Ah6],
                                host: J.host
                            },
                            servername: this[NCA]?.servername || H
                        });
                        if (P !== 200) X.on("error", UbK).destroy(), M(new gbK(`Proxy response (${P}) !== 200 when HTTP Tunneling`));
                        if (J.protocol !== "https:") {
                            M(null, X);
                            return
                        }
                        let W;
                        if (this[Zo1]) W = this[Zo1].servername;
                        else W = J.servername;
                        this[VCA]({
                            ...J,
                            servername: W,
                            httpSocket: X
                        }, M)
                    } catch (X) {
                        if (X.code === "ERR_TLS_CERT_ALTNAME_INVALID") M(new FbK(X));
                        else M(X)
                    }
                }
            })
        }
        dispatch(A, q) {
            let K = dbK(A.headers);
            if (cbK(K), K && !("host" in K) && !("Host" in K)) {
                let {
                    host: Y
                } = new eR6(A.origin);
                K.host = Y
            }
            return this[g71].dispatch({
                ...A,
                headers: K
            }, q)
        }
        #A(A) {
            if (typeof A === "string") return new eR6(A);
            else if (A instanceof eR6) return A;
            else return new eR6(A.uri)
        }
        async [IbK]() {
            await this[g71].close(), await this[F71].close()
        }
        async [bbK]() {
            await this[g71].destroy(), await this[F71].destroy()
        }
    }

    function dbK(A) {
        if (Array.isArray(A)) {
            let q = {};
            for (let K = 0; K < A.length; K += 2) q[A[K]] = A[K + 1];
            return q
        }
        return A
    }

    function cbK(A) {
        if (A && Object.keys(A).find((K) => K.toLowerCase() === "proxy-authorization")) throw new p71("Proxy-Authorization should be sent in ProxyAgent constructor")
    }
    ECA.exports = kCA
})
// @from(Ln 55478, Col 4)
ICA = x((nw_, CCA) => {
    var lbK = XH6(),
        {
            kClose: ibK,
            kDestroy: nbK,
            kClosed: yCA,
            kDestroyed: LCA,
            kDispatch: rbK,
            kNoProxyAgent: qh6,
            kHttpProxyAgent: Cr,
            kHttpsProxyAgent: m76
        } = UO(),
        RCA = Go1(),
        obK = CH6(),
        abK = {
            "http:": 80,
            "https:": 443
        },
        hCA = !1;
    class SCA extends lbK {
        #A = null;
        #q = null;
        #K = null;
        constructor(A = {}) {
            super();
            if (this.#K = A, !hCA) hCA = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
                code: "UNDICI-EHPA"
            });
            let {
                httpProxy: q,
                httpsProxy: K,
                noProxy: Y,
                ...z
            } = A;
            this[qh6] = new obK(z);
            let _ = q ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
            if (_) this[Cr] = new RCA({
                ...z,
                uri: _
            });
            else this[Cr] = this[qh6];
            let w = K ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
            if (w) this[m76] = new RCA({
                ...z,
                uri: w
            });
            else this[m76] = this[Cr];
            this.#w()
        } [rbK](A, q) {
            let K = new URL(A.origin);
            return this.#z(K).dispatch(A, q)
        }
        async [ibK]() {
            if (await this[qh6].close(), !this[Cr][yCA]) await this[Cr].close();
            if (!this[m76][yCA]) await this[m76].close()
        }
        async [nbK](A) {
            if (await this[qh6].destroy(A), !this[Cr][LCA]) await this[Cr].destroy(A);
            if (!this[m76][LCA]) await this[m76].destroy(A)
        }
        #z(A) {
            let {
                protocol: q,
                host: K,
                port: Y
            } = A;
            if (K = K.replace(/:\d*$/, "").toLowerCase(), Y = Number.parseInt(Y, 10) || abK[q] || 0, !this.#Y(K, Y)) return this[qh6];
            if (q === "https:") return this[m76];
            return this[Cr]
        }
        #Y(A, q) {
            if (this.#_) this.#w();
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
        #w() {
            let A = this.#K.noProxy ?? this.#$,
                q = A.split(/[,\s]/),
                K = [];
            for (let Y = 0; Y < q.length; Y++) {
                let z = q[Y];
                if (!z) continue;
                let _ = z.match(/^(.+):(\d+)$/);
                K.push({
                    hostname: (_ ? _[1] : z).toLowerCase(),
                    port: _ ? Number.parseInt(_[2], 10) : 0
                })
            }
            this.#A = A, this.#q = K
        }
        get #_() {
            if (this.#K.noProxy !== void 0) return !1;
            return this.#A !== this.#$
        }
        get #$() {
            return process.env.no_proxy ?? process.env.NO_PROXY ?? ""
        }
    }
    CCA.exports = SCA
})
// @from(Ln 55586, Col 4)
Q71 = x((rw_, mCA) => {
    var IH6 = x6("node:assert"),
        {
            kRetryHandlerDefaultRetry: bCA
        } = UO(),
        {
            RequestRetryError: Kh6
        } = mz(),
        {
            isDisturbed: xCA,
            parseHeaders: sbK,
            parseRangeHeader: uCA,
            wrapRequestBody: tbK
        } = Y9();

    function ebK(A) {
        let q = Date.now();
        return new Date(A).getTime() - q
    }
    class fo1 {
        constructor(A, q) {
            let {
                retryOptions: K,
                ...Y
            } = A, {
                retry: z,
                maxRetries: _,
                maxTimeout: w,
                minTimeout: O,
                timeoutFactor: $,
                methods: H,
                errorCodes: j,
                retryAfter: J,
                statusCodes: M
            } = K ?? {};
            this.dispatch = q.dispatch, this.handler = q.handler, this.opts = {
                ...Y,
                body: tbK(A.body)
            }, this.abort = null, this.aborted = !1, this.retryOpts = {
                retry: z ?? fo1[bCA],
                retryAfter: J ?? !0,
                maxTimeout: w ?? 30000,
                minTimeout: O ?? 500,
                timeoutFactor: $ ?? 2,
                maxRetries: _ ?? 5,
                methods: H ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
                statusCodes: M ?? [500, 502, 503, 504, 429],
                errorCodes: j ?? ["ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "ENETDOWN", "ENETUNREACH", "EHOSTDOWN", "EHOSTUNREACH", "EPIPE", "UND_ERR_SOCKET"]
            }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((D) => {
                if (this.aborted = !0, this.abort) this.abort(D);
                else this.reason = D
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
        static[bCA](A, {
            state: q,
            opts: K
        }, Y) {
            let {
                statusCode: z,
                code: _,
                headers: w
            } = A, {
                method: O,
                retryOptions: $
            } = K, {
                maxRetries: H,
                minTimeout: j,
                maxTimeout: J,
                timeoutFactor: M,
                statusCodes: D,
                errorCodes: X,
                methods: P
            } = $, {
                counter: W
            } = q;
            if (_ && _ !== "UND_ERR_REQ_RETRY" && !X.includes(_)) {
                Y(A);
                return
            }
            if (Array.isArray(P) && !P.includes(O)) {
                Y(A);
                return
            }
            if (z != null && Array.isArray(D) && !D.includes(z)) {
                Y(A);
                return
            }
            if (W > H) {
                Y(A);
                return
            }
            let Z = w?.["retry-after"];
            if (Z) Z = Number(Z), Z = Number.isNaN(Z) ? ebK(Z) : Z * 1000;
            let G = Z > 0 ? Math.min(Z, J) : Math.min(j * M ** (W - 1), J);
            setTimeout(() => Y(null), G)
        }
        onHeaders(A, q, K, Y) {
            let z = sbK(q);
            if (this.retryCount += 1, A >= 300)
                if (this.retryOpts.statusCodes.includes(A) === !1) return this.handler.onHeaders(A, q, K, Y);
                else return this.abort(new Kh6("Request failed", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
            if (this.resume != null) {
                if (this.resume = null, A !== 206 && (this.start > 0 || A !== 200)) return this.abort(new Kh6("server does not support the range header and the payload was partially consumed", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                let w = uCA(z["content-range"]);
                if (!w) return this.abort(new Kh6("Content-Range mismatch", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                if (this.etag != null && this.etag !== z.etag) return this.abort(new Kh6("ETag mismatch", A, {
                    headers: z,
                    data: {
                        count: this.retryCount
                    }
                })), !1;
                let {
                    start: O,
                    size: $,
                    end: H = $ - 1
                } = w;
                return IH6(this.start === O, "content-range mismatch"), IH6(this.end == null || this.end === H, "content-range mismatch"), this.resume = K, !0
            }
            if (this.end == null) {
                if (A === 206) {
                    let w = uCA(z["content-range"]);
                    if (w == null) return this.handler.onHeaders(A, q, K, Y);
                    let {
                        start: O,
                        size: $,
                        end: H = $ - 1
                    } = w;
                    IH6(O != null && Number.isFinite(O), "content-range mismatch"), IH6(H != null && Number.isFinite(H), "invalid content-length"), this.start = O, this.end = H
                }
                if (this.end == null) {
                    let w = z["content-length"];
                    this.end = w != null ? Number(w) - 1 : null
                }
                if (IH6(Number.isFinite(this.start)), IH6(this.end == null || Number.isFinite(this.end), "invalid content-length"), this.resume = K, this.etag = z.etag != null ? z.etag : null, this.etag != null && this.etag.startsWith("W/")) this.etag = null;
                return this.handler.onHeaders(A, q, K, Y)
            }
            let _ = new Kh6("Request failed", A, {
                headers: z,
                data: {
                    count: this.retryCount
                }
            });
            return this.abort(_), !1
        }
        onData(A) {
            return this.start += A.length, this.handler.onData(A)
        }
        onComplete(A) {
            return this.retryCount = 0, this.handler.onComplete(A)
        }
        onError(A) {
            if (this.aborted || xCA(this.opts.body)) return this.handler.onError(A);
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
                if (K != null || this.aborted || xCA(this.opts.body)) return this.handler.onError(K);
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
    mCA.exports = fo1
})
// @from(Ln 55803, Col 4)
FCA = x((ow_, gCA) => {
    var AxK = RR6(),
        qxK = Q71();
    class BCA extends AxK {
        #A = null;
        #q = null;
        constructor(A, q = {}) {
            super(q);
            this.#A = A, this.#q = q
        }
        dispatch(A, q) {
            let K = new qxK({
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
    gCA.exports = BCA
})
// @from(Ln 55832, Col 4)
ko1 = x((aw_, oCA) => {
    var cCA = x6("node:assert"),
        {
            Readable: KxK
        } = x6("node:stream"),
        {
            RequestAbortedError: lCA,
            NotSupportedError: YxK,
            InvalidArgumentError: zxK,
            AbortError: To1
        } = mz(),
        iCA = Y9(),
        {
            ReadableStreamFrom: _xK
        } = Y9(),
        CV = Symbol("kConsume"),
        Yh6 = Symbol("kReading"),
        Ir = Symbol("kBody"),
        pCA = Symbol("kAbort"),
        nCA = Symbol("kContentType"),
        QCA = Symbol("kContentLength"),
        wxK = () => {};
    class rCA extends KxK {
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
            this._readableState.dataEmitted = !1, this[pCA] = q, this[CV] = null, this[Ir] = null, this[nCA] = K, this[QCA] = Y, this[Yh6] = !1
        }
        destroy(A) {
            if (!A && !this._readableState.endEmitted) A = new lCA;
            if (A) this[pCA]();
            return super.destroy(A)
        }
        _destroy(A, q) {
            if (!this[Yh6]) setImmediate(() => {
                q(A)
            });
            else q(A)
        }
        on(A, ...q) {
            if (A === "data" || A === "readable") this[Yh6] = !0;
            return super.on(A, ...q)
        }
        addListener(A, ...q) {
            return this.on(A, ...q)
        }
        off(A, ...q) {
            let K = super.off(A, ...q);
            if (A === "data" || A === "readable") this[Yh6] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0;
            return K
        }
        removeListener(A, ...q) {
            return this.off(A, ...q)
        }
        push(A) {
            if (this[CV] && A !== null) return No1(this[CV], A), this[Yh6] ? super.push(A) : !0;
            return super.push(A)
        }
        async text() {
            return zh6(this, "text")
        }
        async json() {
            return zh6(this, "json")
        }
        async blob() {
            return zh6(this, "blob")
        }
        async bytes() {
            return zh6(this, "bytes")
        }
        async arrayBuffer() {
            return zh6(this, "arrayBuffer")
        }
        async formData() {
            throw new YxK
        }
        get bodyUsed() {
            return iCA.isDisturbed(this)
        }
        get body() {
            if (!this[Ir]) {
                if (this[Ir] = _xK(this), this[CV]) this[Ir].getReader(), cCA(this[Ir].locked)
            }
            return this[Ir]
        }
        async dump(A) {
            let q = Number.isFinite(A?.limit) ? A.limit : 131072,
                K = A?.signal;
            if (K != null && (typeof K !== "object" || !("aborted" in K))) throw new zxK("signal must be an AbortSignal");
            if (K?.throwIfAborted(), this._readableState.closeEmitted) return null;
            return await new Promise((Y, z) => {
                if (this[QCA] > q) this.destroy(new To1);
                let _ = () => {
                    this.destroy(K.reason ?? new To1)
                };
                K?.addEventListener("abort", _), this.on("close", function() {
                    if (K?.removeEventListener("abort", _), K?.aborted) z(K.reason ?? new To1);
                    else Y(null)
                }).on("error", wxK).on("data", function(w) {
                    if (q -= w.length, q <= 0) this.destroy()
                }).resume()
            })
        }
    }

    function OxK(A) {
        return A[Ir] && A[Ir].locked === !0 || A[CV]
    }

    function $xK(A) {
        return iCA.isDisturbed(A) || OxK(A)
    }
    async function zh6(A, q) {
        return cCA(!A[CV]), new Promise((K, Y) => {
            if ($xK(A)) {
                let z = A._readableState;
                if (z.destroyed && z.closeEmitted === !1) A.on("error", (_) => {
                    Y(_)
                }).on("close", () => {
                    Y(TypeError("unusable"))
                });
                else Y(z.errored ?? TypeError("unusable"))
            } else queueMicrotask(() => {
                A[CV] = {
                    type: q,
                    stream: A,
                    resolve: K,
                    reject: Y,
                    length: 0,
                    body: []
                }, A.on("error", function(z) {
                    Vo1(this[CV], z)
                }).on("close", function() {
                    if (this[CV].body !== null) Vo1(this[CV], new lCA)
                }), HxK(A[CV])
            })
        })
    }

    function HxK(A) {
        if (A.body === null) return;
        let {
            _readableState: q
        } = A.stream;
        if (q.bufferIndex) {
            let K = q.bufferIndex,
                Y = q.buffer.length;
            for (let z = K; z < Y; z++) No1(A, q.buffer[z])
        } else
            for (let K of q.buffer) No1(A, K);
        if (q.endEmitted) dCA(this[CV]);
        else A.stream.on("end", function() {
            dCA(this[CV])
        });
        A.stream.resume();
        while (A.stream.read() != null);
    }

    function vo1(A, q) {
        if (A.length === 0 || q === 0) return "";
        let K = A.length === 1 ? A[0] : Buffer.concat(A, q),
            Y = K.length,
            z = Y > 2 && K[0] === 239 && K[1] === 187 && K[2] === 191 ? 3 : 0;
        return K.utf8Slice(z, Y)
    }

    function UCA(A, q) {
        if (A.length === 0 || q === 0) return new Uint8Array(0);
        if (A.length === 1) return new Uint8Array(A[0]);
        let K = new Uint8Array(Buffer.allocUnsafeSlow(q).buffer),
            Y = 0;
        for (let z = 0; z < A.length; ++z) {
            let _ = A[z];
            K.set(_, Y), Y += _.length
        }
        return K
    }

    function dCA(A) {
        let {
            type: q,
            body: K,
            resolve: Y,
            stream: z,
            length: _
        } = A;
        try {
            if (q === "text") Y(vo1(K, _));
            else if (q === "json") Y(JSON.parse(vo1(K, _)));
            else if (q === "arrayBuffer") Y(UCA(K, _).buffer);
            else if (q === "blob") Y(new Blob(K, {
                type: z[nCA]
            }));
            else if (q === "bytes") Y(UCA(K, _));
            Vo1(A)
        } catch (w) {
            z.destroy(w)
        }
    }

    function No1(A, q) {
        A.length += q.length, A.body.push(q)
    }

    function Vo1(A, q) {
        if (A.body === null) return;
        if (q) A.reject(q);
        else A.resolve();
        A.type = null, A.stream = null, A.resolve = null, A.reject = null, A.length = 0, A.body = null
    }
    oCA.exports = {
        Readable: rCA,
        chunksDecode: vo1
    }
})
// @from(Ln 56056, Col 4)
Eo1 = x((sw_, AIA) => {
    var jxK = x6("node:assert"),
        {
            ResponseStatusCodeError: aCA
        } = mz(),
        {
            chunksDecode: sCA
        } = ko1();
    async function JxK({
        callback: A,
        body: q,
        contentType: K,
        statusCode: Y,
        statusMessage: z,
        headers: _
    }) {
        jxK(q);
        let w = [],
            O = 0;
        try {
            for await (let J of q) if (w.push(J), O += J.length, O > 131072) {
                w = [], O = 0;
                break
            }
        } catch {
            w = [], O = 0
        }
        let $ = `Response status code ${Y}${z?`: ${z}`:""}`;
        if (Y === 204 || !K || !O) {
            queueMicrotask(() => A(new aCA($, Y, _)));
            return
        }
        let H = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        let j;
        try {
            if (tCA(K)) j = JSON.parse(sCA(w, O));
            else if (eCA(K)) j = sCA(w, O)
        } catch {} finally {
            Error.stackTraceLimit = H
        }
        queueMicrotask(() => A(new aCA($, Y, _, j)))
    }
    var tCA = (A) => {
            return A.length > 15 && A[11] === "/" && A[0] === "a" && A[1] === "p" && A[2] === "p" && A[3] === "l" && A[4] === "i" && A[5] === "c" && A[6] === "a" && A[7] === "t" && A[8] === "i" && A[9] === "o" && A[10] === "n" && A[12] === "j" && A[13] === "s" && A[14] === "o" && A[15] === "n"
        },
        eCA = (A) => {
            return A.length > 4 && A[4] === "/" && A[0] === "t" && A[1] === "e" && A[2] === "x" && A[3] === "t"
        };
    AIA.exports = {
        getResolveErrorBodyCallback: JxK,
        isContentTypeApplicationJson: tCA,
        isContentTypeText: eCA
    }
})
// @from(Ln 56111, Col 4)
YIA = x((tw_, Lo1) => {
    var MxK = x6("node:assert"),
        {
            Readable: DxK
        } = ko1(),
        {
            InvalidArgumentError: bH6,
            RequestAbortedError: qIA
        } = mz(),
        IV = Y9(),
        {
            getResolveErrorBodyCallback: XxK
        } = Eo1(),
        {
            AsyncResource: PxK
        } = x6("node:async_hooks");
    class yo1 extends PxK {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new bH6("invalid opts");
            let {
                signal: K,
                method: Y,
                opaque: z,
                body: _,
                onInfo: w,
                responseHeaders: O,
                throwOnError: $,
                highWaterMark: H
            } = A;
            try {
                if (typeof q !== "function") throw new bH6("invalid callback");
                if (H && (typeof H !== "number" || H < 0)) throw new bH6("invalid highWaterMark");
                if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new bH6("signal must be an EventEmitter or EventTarget");
                if (Y === "CONNECT") throw new bH6("invalid method");
                if (w && typeof w !== "function") throw new bH6("invalid onInfo callback");
                super("UNDICI_REQUEST")
            } catch (j) {
                if (IV.isStream(_)) IV.destroy(_.on("error", IV.nop), j);
                throw j
            }
            if (this.method = Y, this.responseHeaders = O || null, this.opaque = z || null, this.callback = q, this.res = null, this.abort = null, this.body = _, this.trailers = {}, this.context = null, this.onInfo = w || null, this.throwOnError = $, this.highWaterMark = H, this.signal = K, this.reason = null, this.removeAbortListener = null, IV.isStream(_)) _.on("error", (j) => {
                this.onError(j)
            });
            if (this.signal)
                if (this.signal.aborted) this.reason = this.signal.reason ?? new qIA;
                else this.removeAbortListener = IV.addAbortListener(this.signal, () => {
                    if (this.reason = this.signal.reason ?? new qIA, this.res) IV.destroy(this.res.on("error", IV.nop), this.reason);
                    else if (this.abort) this.abort(this.reason);
                    if (this.removeAbortListener) this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
                })
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            MxK(this.callback), this.abort = A, this.context = q
        }
        onHeaders(A, q, K, Y) {
            let {
                callback: z,
                opaque: _,
                abort: w,
                context: O,
                responseHeaders: $,
                highWaterMark: H
            } = this, j = $ === "raw" ? IV.parseRawHeaders(q) : IV.parseHeaders(q);
            if (A < 200) {
                if (this.onInfo) this.onInfo({
                    statusCode: A,
                    headers: j
                });
                return
            }
            let J = $ === "raw" ? IV.parseHeaders(q) : j,
                M = J["content-type"],
                D = J["content-length"],
                X = new DxK({
                    resume: K,
                    abort: w,
                    contentType: M,
                    contentLength: this.method !== "HEAD" && D ? Number(D) : null,
                    highWaterMark: H
                });
            if (this.removeAbortListener) X.on("close", this.removeAbortListener);
            if (this.callback = null, this.res = X, z !== null)
                if (this.throwOnError && A >= 400) this.runInAsyncScope(XxK, null, {
                    callback: z,
                    body: X,
                    contentType: M,
                    statusCode: A,
                    statusMessage: Y,
                    headers: j
                });
                else this.runInAsyncScope(z, null, null, {
                    statusCode: A,
                    headers: j,
                    trailers: this.trailers,
                    opaque: _,
                    body: X,
                    context: O
                })
        }
        onData(A) {
            return this.res.push(A)
        }
        onComplete(A) {
            IV.parseHeaders(A, this.trailers), this.res.push(null)
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
                IV.destroy(q, A)
            });
            if (Y) this.body = null, IV.destroy(Y, A);
            if (this.removeAbortListener) q?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null
        }
    }

    function KIA(A, q) {
        if (q === void 0) return new Promise((K, Y) => {
            KIA.call(this, A, (z, _) => {
                return z ? Y(z) : K(_)
            })
        });
        try {
            this.dispatch(A, new yo1(A, q))
        } catch (K) {
            if (typeof q !== "function") throw K;
            let Y = A?.opaque;
            queueMicrotask(() => q(K, {
                opaque: Y
            }))
        }
    }
    Lo1.exports = KIA;
    Lo1.exports.RequestHandler = yo1
})
// @from(Ln 56259, Col 4)
_h6 = x((ew_, wIA) => {
    var {
        addAbortListener: WxK
    } = Y9(), {
        RequestAbortedError: ZxK
    } = mz(), xH6 = Symbol("kListener"), $u = Symbol("kSignal");

    function zIA(A) {
        if (A.abort) A.abort(A[$u]?.reason);
        else A.reason = A[$u]?.reason ?? new ZxK;
        _IA(A)
    }

    function GxK(A, q) {
        if (A.reason = null, A[$u] = null, A[xH6] = null, !q) return;
        if (q.aborted) {
            zIA(A);
            return
        }
        A[$u] = q, A[xH6] = () => {
            zIA(A)
        }, WxK(A[$u], A[xH6])
    }

    function _IA(A) {
        if (!A[$u]) return;
        if ("removeEventListener" in A[$u]) A[$u].removeEventListener("abort", A[xH6]);
        else A[$u].removeListener("abort", A[xH6]);
        A[$u] = null, A[xH6] = null
    }
    wIA.exports = {
        addSignal: GxK,
        removeSignal: _IA
    }
})
// @from(Ln 56294, Col 4)
JIA = x((AO_, jIA) => {
    var fxK = x6("node:assert"),
        {
            finished: TxK,
            PassThrough: vxK
        } = x6("node:stream"),
        {
            InvalidArgumentError: uH6,
            InvalidReturnValueError: NxK
        } = mz(),
        dS = Y9(),
        {
            getResolveErrorBodyCallback: VxK
        } = Eo1(),
        {
            AsyncResource: kxK
        } = x6("node:async_hooks"),
        {
            addSignal: ExK,
            removeSignal: OIA
        } = _h6();
    class $IA extends kxK {
        constructor(A, q, K) {
            if (!A || typeof A !== "object") throw new uH6("invalid opts");
            let {
                signal: Y,
                method: z,
                opaque: _,
                body: w,
                onInfo: O,
                responseHeaders: $,
                throwOnError: H
            } = A;
            try {
                if (typeof K !== "function") throw new uH6("invalid callback");
                if (typeof q !== "function") throw new uH6("invalid factory");
                if (Y && typeof Y.on !== "function" && typeof Y.addEventListener !== "function") throw new uH6("signal must be an EventEmitter or EventTarget");
                if (z === "CONNECT") throw new uH6("invalid method");
                if (O && typeof O !== "function") throw new uH6("invalid onInfo callback");
                super("UNDICI_STREAM")
            } catch (j) {
                if (dS.isStream(w)) dS.destroy(w.on("error", dS.nop), j);
                throw j
            }
            if (this.responseHeaders = $ || null, this.opaque = _ || null, this.factory = q, this.callback = K, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = w, this.onInfo = O || null, this.throwOnError = H || !1, dS.isStream(w)) w.on("error", (j) => {
                this.onError(j)
            });
            ExK(this, Y)
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            fxK(this.callback), this.abort = A, this.context = q
        }
        onHeaders(A, q, K, Y) {
            let {
                factory: z,
                opaque: _,
                context: w,
                callback: O,
                responseHeaders: $
            } = this, H = $ === "raw" ? dS.parseRawHeaders(q) : dS.parseHeaders(q);
            if (A < 200) {
                if (this.onInfo) this.onInfo({
                    statusCode: A,
                    headers: H
                });
                return
            }
            this.factory = null;
            let j;
            if (this.throwOnError && A >= 400) {
                let D = ($ === "raw" ? dS.parseHeaders(q) : H)["content-type"];
                j = new vxK, this.callback = null, this.runInAsyncScope(VxK, null, {
                    callback: O,
                    body: j,
                    contentType: D,
                    statusCode: A,
                    statusMessage: Y,
                    headers: H
                })
            } else {
                if (z === null) return;
                if (j = this.runInAsyncScope(z, null, {
                        statusCode: A,
                        headers: H,
                        opaque: _,
                        context: w
                    }), !j || typeof j.write !== "function" || typeof j.end !== "function" || typeof j.on !== "function") throw new NxK("expected Writable");
                TxK(j, {
                    readable: !1
                }, (M) => {
                    let {
                        callback: D,
                        res: X,
                        opaque: P,
                        trailers: W,
                        abort: Z
                    } = this;
                    if (this.res = null, M || !X.readable) dS.destroy(X, M);
                    if (this.callback = null, this.runInAsyncScope(D, null, M || null, {
                            opaque: P,
                            trailers: W
                        }), M) Z()
                })
            }
            return j.on("drain", K), this.res = j, (j.writableNeedDrain !== void 0 ? j.writableNeedDrain : j._writableState?.needDrain) !== !0
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
            if (OIA(this), !q) return;
            this.trailers = dS.parseHeaders(A), q.end()
        }
        onError(A) {
            let {
                res: q,
                callback: K,
                opaque: Y,
                body: z
            } = this;
            if (OIA(this), this.factory = null, q) this.res = null, dS.destroy(q, A);
            else if (K) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(K, null, A, {
                    opaque: Y
                })
            });
            if (z) this.body = null, dS.destroy(z, A)
        }
    }

    function HIA(A, q, K) {
        if (K === void 0) return new Promise((Y, z) => {
            HIA.call(this, A, q, (_, w) => {
                return _ ? z(_) : Y(w)
            })
        });
        try {
            this.dispatch(A, new $IA(A, q, K))
        } catch (Y) {
            if (typeof K !== "function") throw Y;
            let z = A?.opaque;
            queueMicrotask(() => K(Y, {
                opaque: z
            }))
        }
    }
    jIA.exports = HIA
})
// @from(Ln 56452, Col 4)
GIA = x((qO_, ZIA) => {
    var {
        Readable: DIA,
        Duplex: yxK,
        PassThrough: LxK
    } = x6("node:stream"), {
        InvalidArgumentError: wh6,
        InvalidReturnValueError: RxK,
        RequestAbortedError: Ro1
    } = mz(), Ey = Y9(), {
        AsyncResource: hxK
    } = x6("node:async_hooks"), {
        addSignal: SxK,
        removeSignal: CxK
    } = _h6(), MIA = x6("node:assert"), mH6 = Symbol("resume");
    class XIA extends DIA {
        constructor() {
            super({
                autoDestroy: !0
            });
            this[mH6] = null
        }
        _read() {
            let {
                [mH6]: A
            } = this;
            if (A) this[mH6] = null, A()
        }
        _destroy(A, q) {
            this._read(), q(A)
        }
    }
    class PIA extends DIA {
        constructor(A) {
            super({
                autoDestroy: !0
            });
            this[mH6] = A
        }
        _read() {
            this[mH6]()
        }
        _destroy(A, q) {
            if (!A && !this._readableState.endEmitted) A = new Ro1;
            q(A)
        }
    }
    class WIA extends hxK {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new wh6("invalid opts");
            if (typeof q !== "function") throw new wh6("invalid handler");
            let {
                signal: K,
                method: Y,
                opaque: z,
                onInfo: _,
                responseHeaders: w
            } = A;
            if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new wh6("signal must be an EventEmitter or EventTarget");
            if (Y === "CONNECT") throw new wh6("invalid method");
            if (_ && typeof _ !== "function") throw new wh6("invalid onInfo callback");
            super("UNDICI_PIPELINE");
            this.opaque = z || null, this.responseHeaders = w || null, this.handler = q, this.abort = null, this.context = null, this.onInfo = _ || null, this.req = new XIA().on("error", Ey.nop), this.ret = new yxK({
                readableObjectMode: A.objectMode,
                autoDestroy: !0,
                read: () => {
                    let {
                        body: O
                    } = this;
                    if (O?.resume) O.resume()
                },
                write: (O, $, H) => {
                    let {
                        req: j
                    } = this;
                    if (j.push(O, $) || j._readableState.destroyed) H();
                    else j[mH6] = H
                },
                destroy: (O, $) => {
                    let {
                        body: H,
                        req: j,
                        res: J,
                        ret: M,
                        abort: D
                    } = this;
                    if (!O && !M._readableState.endEmitted) O = new Ro1;
                    if (D && O) D();
                    Ey.destroy(H, O), Ey.destroy(j, O), Ey.destroy(J, O), CxK(this), $(O)
                }
            }).on("prefinish", () => {
                let {
                    req: O
                } = this;
                O.push(null)
            }), this.res = null, SxK(this, K)
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
            MIA(!Y, "pipeline cannot be retried"), MIA(!K.destroyed), this.abort = A, this.context = q
        }
        onHeaders(A, q, K) {
            let {
                opaque: Y,
                handler: z,
                context: _
            } = this;
            if (A < 200) {
                if (this.onInfo) {
                    let O = this.responseHeaders === "raw" ? Ey.parseRawHeaders(q) : Ey.parseHeaders(q);
                    this.onInfo({
                        statusCode: A,
                        headers: O
                    })
                }
                return
            }
            this.res = new PIA(K);
            let w;
            try {
                this.handler = null;
                let O = this.responseHeaders === "raw" ? Ey.parseRawHeaders(q) : Ey.parseHeaders(q);
                w = this.runInAsyncScope(z, null, {
                    statusCode: A,
                    headers: O,
                    opaque: Y,
                    body: this.res,
                    context: _
                })
            } catch (O) {
                throw this.res.on("error", Ey.nop), O
            }
            if (!w || typeof w.on !== "function") throw new RxK("expected Readable");
            w.on("data", (O) => {
                let {
                    ret: $,
                    body: H
                } = this;
                if (!$.push(O) && H.pause) H.pause()
            }).on("error", (O) => {
                let {
                    ret: $
                } = this;
                Ey.destroy($, O)
            }).on("end", () => {
                let {
                    ret: O
                } = this;
                O.push(null)
            }).on("close", () => {
                let {
                    ret: O
                } = this;
                if (!O._readableState.ended) Ey.destroy(O, new Ro1)
            }), this.body = w
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
            this.handler = null, Ey.destroy(q, A)
        }
    }

    function IxK(A, q) {
        try {
            let K = new WIA(A, q);
            return this.dispatch({
                ...A,
                body: K.req
            }, K), K.ret
        } catch (K) {
            return new LxK().destroy(K)
        }
    }
    ZIA.exports = IxK
})
// @from(Ln 56648, Col 4)
EIA = x((KO_, kIA) => {
    var {
        InvalidArgumentError: ho1,
        SocketError: bxK
    } = mz(), {
        AsyncResource: xxK
    } = x6("node:async_hooks"), fIA = Y9(), {
        addSignal: uxK,
        removeSignal: TIA
    } = _h6(), vIA = x6("node:assert");
    class NIA extends xxK {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new ho1("invalid opts");
            if (typeof q !== "function") throw new ho1("invalid callback");
            let {
                signal: K,
                opaque: Y,
                responseHeaders: z
            } = A;
            if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new ho1("signal must be an EventEmitter or EventTarget");
            super("UNDICI_UPGRADE");
            this.responseHeaders = z || null, this.opaque = Y || null, this.callback = q, this.abort = null, this.context = null, uxK(this, K)
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            vIA(this.callback), this.abort = A, this.context = null
        }
        onHeaders() {
            throw new bxK("bad upgrade", null)
        }
        onUpgrade(A, q, K) {
            vIA(A === 101);
            let {
                callback: Y,
                opaque: z,
                context: _
            } = this;
            TIA(this), this.callback = null;
            let w = this.responseHeaders === "raw" ? fIA.parseRawHeaders(q) : fIA.parseHeaders(q);
            this.runInAsyncScope(Y, null, null, {
                headers: w,
                socket: K,
                opaque: z,
                context: _
            })
        }
        onError(A) {
            let {
                callback: q,
                opaque: K
            } = this;
            if (TIA(this), q) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(q, null, A, {
                    opaque: K
                })
            })
        }
    }

    function VIA(A, q) {
        if (q === void 0) return new Promise((K, Y) => {
            VIA.call(this, A, (z, _) => {
                return z ? Y(z) : K(_)
            })
        });
        try {
            let K = new NIA(A, q);
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
    kIA.exports = VIA
})
// @from(Ln 56733, Col 4)
CIA = x((YO_, SIA) => {
    var mxK = x6("node:assert"),
        {
            AsyncResource: BxK
        } = x6("node:async_hooks"),
        {
            InvalidArgumentError: So1,
            SocketError: gxK
        } = mz(),
        yIA = Y9(),
        {
            addSignal: FxK,
            removeSignal: LIA
        } = _h6();
    class RIA extends BxK {
        constructor(A, q) {
            if (!A || typeof A !== "object") throw new So1("invalid opts");
            if (typeof q !== "function") throw new So1("invalid callback");
            let {
                signal: K,
                opaque: Y,
                responseHeaders: z
            } = A;
            if (K && typeof K.on !== "function" && typeof K.addEventListener !== "function") throw new So1("signal must be an EventEmitter or EventTarget");
            super("UNDICI_CONNECT");
            this.opaque = Y || null, this.responseHeaders = z || null, this.callback = q, this.abort = null, FxK(this, K)
        }
        onConnect(A, q) {
            if (this.reason) {
                A(this.reason);
                return
            }
            mxK(this.callback), this.abort = A, this.context = q
        }
        onHeaders() {
            throw new gxK("bad connect", null)
        }
        onUpgrade(A, q, K) {
            let {
                callback: Y,
                opaque: z,
                context: _
            } = this;
            LIA(this), this.callback = null;
            let w = q;
            if (w != null) w = this.responseHeaders === "raw" ? yIA.parseRawHeaders(q) : yIA.parseHeaders(q);
            this.runInAsyncScope(Y, null, null, {
                statusCode: A,
                headers: w,
                socket: K,
                opaque: z,
                context: _
            })
        }
        onError(A) {
            let {
                callback: q,
                opaque: K
            } = this;
            if (LIA(this), q) this.callback = null, queueMicrotask(() => {
                this.runInAsyncScope(q, null, A, {
                    opaque: K
                })
            })
        }
    }

    function hIA(A, q) {
        if (q === void 0) return new Promise((K, Y) => {
            hIA.call(this, A, (z, _) => {
                return z ? Y(z) : K(_)
            })
        });
        try {
            let K = new RIA(A, q);
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
    SIA.exports = hIA
})
// @from(Ln 56822, Col 4)
IIA = x((pxK, BH6) => {
    pxK.request = YIA();
    pxK.stream = JIA();
    pxK.pipeline = GIA();
    pxK.upgrade = EIA();
    pxK.connect = CIA()
})
// @from(Ln 56829, Col 4)
Io1 = x((zO_, bIA) => {
    var {
        UndiciError: ixK
    } = mz();
    class Co1 extends ixK {
        constructor(A) {
            super(A);
            Error.captureStackTrace(this, Co1), this.name = "MockNotMatchedError", this.message = A || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED"
        }
    }
    bIA.exports = {
        MockNotMatchedError: Co1
    }
})
// @from(Ln 56843, Col 4)
gH6 = x((_O_, xIA) => {
    xIA.exports = {
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
// @from(Ln 56866, Col 4)
Oh6 = x((wO_, lIA) => {
    var {
        MockNotMatchedError: B76
    } = Io1(), {
        kDispatches: U71,
        kMockAgent: nxK,
        kOriginalDispatch: rxK,
        kOrigin: oxK,
        kGetNetConnect: axK
    } = gH6(), {
        buildURL: sxK
    } = Y9(), {
        STATUS_CODES: txK
    } = x6("node:http"), {
        types: {
            isPromise: exK
        }
    } = x6("node:util");

    function wQ(A, q) {
        if (typeof A === "string") return A === q;
        if (A instanceof RegExp) return A.test(q);
        if (typeof A === "function") return A(q) === !0;
        return !1
    }

    function mIA(A) {
        return Object.fromEntries(Object.entries(A).map(([q, K]) => {
            return [q.toLocaleLowerCase(), K]
        }))
    }

    function BIA(A, q) {
        if (Array.isArray(A)) {
            for (let K = 0; K < A.length; K += 2)
                if (A[K].toLocaleLowerCase() === q.toLocaleLowerCase()) return A[K + 1];
            return
        } else if (typeof A.get === "function") return A.get(q);
        else return mIA(A)[q.toLocaleLowerCase()]
    }

    function uo1(A) {
        let q = A.slice(),
            K = [];
        for (let Y = 0; Y < q.length; Y += 2) K.push([q[Y], q[Y + 1]]);
        return Object.fromEntries(K)
    }

    function gIA(A, q) {
        if (typeof A.headers === "function") {
            if (Array.isArray(q)) q = uo1(q);
            return A.headers(q ? mIA(q) : {})
        }
        if (typeof A.headers > "u") return !0;
        if (typeof q !== "object" || typeof A.headers !== "object") return !1;
        for (let [K, Y] of Object.entries(A.headers)) {
            let z = BIA(q, K);
            if (!wQ(Y, z)) return !1
        }
        return !0
    }

    function uIA(A) {
        if (typeof A !== "string") return A;
        let q = A.split("?");
        if (q.length !== 2) return A;
        let K = new URLSearchParams(q.pop());
        return K.sort(), [...q, K.toString()].join("?")
    }

    function AuK(A, {
        path: q,
        method: K,
        body: Y,
        headers: z
    }) {
        let _ = wQ(A.path, q),
            w = wQ(A.method, K),
            O = typeof A.body < "u" ? wQ(A.body, Y) : !0,
            $ = gIA(A, z);
        return _ && w && O && $
    }

    function FIA(A) {
        if (Buffer.isBuffer(A)) return A;
        else if (A instanceof Uint8Array) return A;
        else if (A instanceof ArrayBuffer) return A;
        else if (typeof A === "object") return JSON.stringify(A);
        else return A.toString()
    }

    function pIA(A, q) {
        let K = q.query ? sxK(q.path, q.query) : q.path,
            Y = typeof K === "string" ? uIA(K) : K,
            z = A.filter(({
                consumed: _
            }) => !_).filter(({
                path: _
            }) => wQ(uIA(_), Y));
        if (z.length === 0) throw new B76(`Mock dispatch not matched for path '${Y}'`);
        if (z = z.filter(({
                method: _
            }) => wQ(_, q.method)), z.length === 0) throw new B76(`Mock dispatch not matched for method '${q.method}' on path '${Y}'`);
        if (z = z.filter(({
                body: _
            }) => typeof _ < "u" ? wQ(_, q.body) : !0), z.length === 0) throw new B76(`Mock dispatch not matched for body '${q.body}' on path '${Y}'`);
        if (z = z.filter((_) => gIA(_, q.headers)), z.length === 0) {
            let _ = typeof q.headers === "object" ? JSON.stringify(q.headers) : q.headers;
            throw new B76(`Mock dispatch not matched for headers '${_}' on path '${Y}'`)
        }
        return z[0]
    }

    function quK(A, q, K) {
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
            _ = {
                ...Y,
                ...q,
                pending: !0,
                data: {
                    error: null,
                    ...z
                }
            };
        return A.push(_), _
    }

    function bo1(A, q) {
        let K = A.findIndex((Y) => {
            if (!Y.consumed) return !1;
            return AuK(Y, q)
        });
        if (K !== -1) A.splice(K, 1)
    }

    function QIA(A) {
        let {
            path: q,
            method: K,
            body: Y,
            headers: z,
            query: _
        } = A;
        return {
            path: q,
            method: K,
            body: Y,
            headers: z,
            query: _
        }
    }

    function xo1(A) {
        let q = Object.keys(A),
            K = [];
        for (let Y = 0; Y < q.length; ++Y) {
            let z = q[Y],
                _ = A[z],
                w = Buffer.from(`${z}`);
            if (Array.isArray(_))
                for (let O = 0; O < _.length; ++O) K.push(w, Buffer.from(`${_[O]}`));
            else K.push(w, Buffer.from(`${_}`))
        }
        return K
    }

    function UIA(A) {
        return txK[A] || "unknown"
    }
    async function KuK(A) {
        let q = [];
        for await (let K of A) q.push(K);
        return Buffer.concat(q).toString("utf8")
    }

    function dIA(A, q) {
        let K = QIA(A),
            Y = pIA(this[U71], K);
        if (Y.timesInvoked++, Y.data.callback) Y.data = {
            ...Y.data,
            ...Y.data.callback(A)
        };
        let {
            data: {
                statusCode: z,
                data: _,
                headers: w,
                trailers: O,
                error: $
            },
            delay: H,
            persist: j
        } = Y, {
            timesInvoked: J,
            times: M
        } = Y;
        if (Y.consumed = !j && J >= M, Y.pending = J < M, $ !== null) return bo1(this[U71], K), q.onError($), !0;
        if (typeof H === "number" && H > 0) setTimeout(() => {
            D(this[U71])
        }, H);
        else D(this[U71]);

        function D(P, W = _) {
            let Z = Array.isArray(A.headers) ? uo1(A.headers) : A.headers,
                G = typeof W === "function" ? W({
                    ...A,
                    headers: Z
                }) : W;
            if (exK(G)) {
                G.then((V) => D(P, V));
                return
            }
            let f = FIA(G),
                v = xo1(w),
                N = xo1(O);
            q.onConnect?.((V) => q.onError(V), null), q.onHeaders?.(z, v, X, UIA(z)), q.onData?.(Buffer.from(f)), q.onComplete?.(N), bo1(P, K)
        }

        function X() {}
        return !0
    }

    function YuK() {
        let A = this[nxK],
            q = this[oxK],
            K = this[rxK];
        return function(z, _) {
            if (A.isMockActive) try {
                dIA.call(this, z, _)
            } catch (w) {
                if (w instanceof B76) {
                    let O = A[axK]();
                    if (O === !1) throw new B76(`${w.message}: subsequent request to origin ${q} was not allowed (net.connect disabled)`);
                    if (cIA(O, q)) K.call(this, z, _);
                    else throw new B76(`${w.message}: subsequent request to origin ${q} was not allowed (net.connect is not enabled for this origin)`)
                } else throw w
            } else K.call(this, z, _)
        }
    }

    function cIA(A, q) {
        let K = new URL(q);
        if (A === !0) return !0;
        else if (Array.isArray(A) && A.some((Y) => wQ(Y, K.host))) return !0;
        return !1
    }

    function zuK(A) {
        if (A) {
            let {
                agent: q,
                ...K
            } = A;
            return K
        }
    }
    lIA.exports = {
        getResponseData: FIA,
        getMockDispatch: pIA,
        addMockDispatch: quK,
        deleteMockDispatch: bo1,
        buildKey: QIA,
        generateKeyValues: xo1,
        matchValue: wQ,
        getResponse: KuK,
        getStatusText: UIA,
        mockDispatch: dIA,
        buildMockDispatch: YuK,
        checkNetConnect: cIA,
        buildMockOptions: zuK,
        getHeaderByName: BIA,
        buildHeadersFromArray: uo1
    }
})
// @from(Ln 57150, Col 4)
Qo1 = x(($uK, po1) => {
    var {
        getResponseData: _uK,
        buildKey: wuK,
        addMockDispatch: mo1
    } = Oh6(), {
        kDispatches: d71,
        kDispatchKey: c71,
        kDefaultHeaders: Bo1,
        kDefaultTrailers: go1,
        kContentLength: Fo1,
        kMockDispatch: l71
    } = gH6(), {
        InvalidArgumentError: Hu
    } = mz(), {
        buildURL: OuK
    } = Y9();
    class $h6 {
        constructor(A) {
            this[l71] = A
        }
        delay(A) {
            if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new Hu("waitInMs must be a valid integer > 0");
            return this[l71].delay = A, this
        }
        persist() {
            return this[l71].persist = !0, this
        }
        times(A) {
            if (typeof A !== "number" || !Number.isInteger(A) || A <= 0) throw new Hu("repeatTimes must be a valid integer > 0");
            return this[l71].times = A, this
        }
    }
    class iIA {
        constructor(A, q) {
            if (typeof A !== "object") throw new Hu("opts must be an object");
            if (typeof A.path > "u") throw new Hu("opts.path must be defined");
            if (typeof A.method > "u") A.method = "GET";
            if (typeof A.path === "string")
                if (A.query) A.path = OuK(A.path, A.query);
                else {
                    let K = new URL(A.path, "data://");
                    A.path = K.pathname + K.search
                } if (typeof A.method === "string") A.method = A.method.toUpperCase();
            this[c71] = wuK(A), this[d71] = q, this[Bo1] = {}, this[go1] = {}, this[Fo1] = !1
        }
        createMockScopeDispatchData({
            statusCode: A,
            data: q,
            responseOptions: K
        }) {
            let Y = _uK(q),
                z = this[Fo1] ? {
                    "content-length": Y.length
                } : {},
                _ = {
                    ...this[Bo1],
                    ...z,
                    ...K.headers
                },
                w = {
                    ...this[go1],
                    ...K.trailers
                };
            return {
                statusCode: A,
                data: q,
                headers: _,
                trailers: w
            }
        }
        validateReplyParameters(A) {
            if (typeof A.statusCode > "u") throw new Hu("statusCode must be defined");
            if (typeof A.responseOptions !== "object" || A.responseOptions === null) throw new Hu("responseOptions must be an object")
        }
        reply(A) {
            if (typeof A === "function") {
                let z = (w) => {
                        let O = A(w);
                        if (typeof O !== "object" || O === null) throw new Hu("reply options callback must return an object");
                        let $ = {
                            data: "",
                            responseOptions: {},
                            ...O
                        };
                        return this.validateReplyParameters($), {
                            ...this.createMockScopeDispatchData($)
                        }
                    },
                    _ = mo1(this[d71], this[c71], z);
                return new $h6(_)
            }
            let q = {
                statusCode: A,
                data: arguments[1] === void 0 ? "" : arguments[1],
                responseOptions: arguments[2] === void 0 ? {} : arguments[2]
            };
            this.validateReplyParameters(q);
            let K = this.createMockScopeDispatchData(q),
                Y = mo1(this[d71], this[c71], K);
            return new $h6(Y)
        }
        replyWithError(A) {
            if (typeof A > "u") throw new Hu("error must be defined");
            let q = mo1(this[d71], this[c71], {
                error: A
            });
            return new $h6(q)
        }
        defaultReplyHeaders(A) {
            if (typeof A > "u") throw new Hu("headers must be defined");
            return this[Bo1] = A, this
        }
        defaultReplyTrailers(A) {
            if (typeof A > "u") throw new Hu("trailers must be defined");
            return this[go1] = A, this
        }
        replyContentLength() {
            return this[Fo1] = !0, this
        }
    }
    $uK.MockInterceptor = iIA;
    $uK.MockScope = $h6
})
// @from(Ln 57274, Col 4)
do1 = x((OO_, AbA) => {
    var {
        promisify: JuK
    } = x6("node:util"), MuK = oR6(), {
        buildMockDispatch: DuK
    } = Oh6(), {
        kDispatches: nIA,
        kMockAgent: rIA,
        kClose: oIA,
        kOriginalClose: aIA,
        kOrigin: sIA,
        kOriginalDispatch: XuK,
        kConnected: Uo1
    } = gH6(), {
        MockInterceptor: PuK
    } = Qo1(), tIA = UO(), {
        InvalidArgumentError: WuK
    } = mz();
    class eIA extends MuK {
        constructor(A, q) {
            super(A, q);
            if (!q || !q.agent || typeof q.agent.dispatch !== "function") throw new WuK("Argument opts.agent must implement Agent");
            this[rIA] = q.agent, this[sIA] = A, this[nIA] = [], this[Uo1] = 1, this[XuK] = this.dispatch, this[aIA] = this.close.bind(this), this.dispatch = DuK.call(this), this.close = this[oIA]
        }
        get[tIA.kConnected]() {
            return this[Uo1]
        }
        intercept(A) {
            return new PuK(A, this[nIA])
        }
        async [oIA]() {
            await JuK(this[aIA])(), this[Uo1] = 0, this[rIA][tIA.kClients].delete(this[sIA])
        }
    }
    AbA.exports = eIA
})
// @from(Ln 57310, Col 4)
lo1 = x(($O_, $bA) => {
    var {
        promisify: ZuK
    } = x6("node:util"), GuK = SH6(), {
        buildMockDispatch: fuK
    } = Oh6(), {
        kDispatches: qbA,
        kMockAgent: KbA,
        kClose: YbA,
        kOriginalClose: zbA,
        kOrigin: _bA,
        kOriginalDispatch: TuK,
        kConnected: co1
    } = gH6(), {
        MockInterceptor: vuK
    } = Qo1(), wbA = UO(), {
        InvalidArgumentError: NuK
    } = mz();
    class ObA extends GuK {
        constructor(A, q) {
            super(A, q);
            if (!q || !q.agent || typeof q.agent.dispatch !== "function") throw new NuK("Argument opts.agent must implement Agent");
            this[KbA] = q.agent, this[_bA] = A, this[qbA] = [], this[co1] = 1, this[TuK] = this.dispatch, this[zbA] = this.close.bind(this), this.dispatch = fuK.call(this), this.close = this[YbA]
        }
        get[wbA.kConnected]() {
            return this[co1]
        }
        intercept(A) {
            return new vuK(A, this[qbA])
        }
        async [YbA]() {
            await ZuK(this[zbA])(), this[co1] = 0, this[KbA][wbA.kClients].delete(this[_bA])
        }
    }
    $bA.exports = ObA
})
// @from(Ln 57346, Col 4)
jbA = x((HO_, HbA) => {
    var VuK = {
            pronoun: "it",
            is: "is",
            was: "was",
            this: "this"
        },
        kuK = {
            pronoun: "they",
            is: "are",
            was: "were",
            this: "these"
        };
    HbA.exports = class {
        constructor(q, K) {
            this.singular = q, this.plural = K
        }
        pluralize(q) {
            let K = q === 1,
                Y = K ? VuK : kuK,
                z = K ? this.singular : this.plural;
            return {
                ...Y,
                count: q,
                noun: z
            }
        }
    }
})
// @from(Ln 57375, Col 4)
MbA = x((jO_, JbA) => {
    var {
        Transform: EuK
    } = x6("node:stream"), {
        Console: yuK
    } = x6("node:console"), LuK = process.versions.icu ? "✅" : "Y ", RuK = process.versions.icu ? "❌" : "N ";
    JbA.exports = class {
        constructor({
            disableColors: q
        } = {}) {
            this.transform = new EuK({
                transform(K, Y, z) {
                    z(null, K)
                }
            }), this.logger = new yuK({
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
                    statusCode: _
                },
                persist: w,
                times: O,
                timesInvoked: $,
                origin: H
            }) => ({
                Method: Y,
                Origin: H,
                Path: z,
                "Status code": _,
                Persistent: w ? LuK : RuK,
                Invocations: $,
                Remaining: w ? 1 / 0 : O - $
            }));
            return this.logger.table(K), this.transform.read().toString()
        }
    }
})