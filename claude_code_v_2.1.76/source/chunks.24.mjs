
// @from(Ln 57420, Col 4)
ZbA = x((JO_, WbA) => {
    var {
        kClients: g76
    } = UO(), huK = CH6(), {
        kAgent: io1,
        kMockAgentSet: i71,
        kMockAgentGet: DbA,
        kDispatches: no1,
        kIsMockActive: n71,
        kNetConnect: F76,
        kGetNetConnect: SuK,
        kOptions: r71,
        kFactory: o71
    } = gH6(), CuK = do1(), IuK = lo1(), {
        matchValue: buK,
        buildMockOptions: xuK
    } = Oh6(), {
        InvalidArgumentError: XbA,
        UndiciError: uuK
    } = mz(), muK = RR6(), BuK = jbA(), guK = MbA();
    class PbA extends muK {
        constructor(A) {
            super(A);
            if (this[F76] = !0, this[n71] = !0, A?.agent && typeof A.agent.dispatch !== "function") throw new XbA("Argument opts.agent must implement Agent");
            let q = A?.agent ? A.agent : new huK(A);
            this[io1] = q, this[g76] = q[g76], this[r71] = xuK(A)
        }
        get(A) {
            let q = this[DbA](A);
            if (!q) q = this[o71](A), this[i71](A, q);
            return q
        }
        dispatch(A, q) {
            return this.get(A.origin), this[io1].dispatch(A, q)
        }
        async close() {
            await this[io1].close(), this[g76].clear()
        }
        deactivate() {
            this[n71] = !1
        }
        activate() {
            this[n71] = !0
        }
        enableNetConnect(A) {
            if (typeof A === "string" || typeof A === "function" || A instanceof RegExp)
                if (Array.isArray(this[F76])) this[F76].push(A);
                else this[F76] = [A];
            else if (typeof A > "u") this[F76] = !0;
            else throw new XbA("Unsupported matcher. Must be one of String|Function|RegExp.")
        }
        disableNetConnect() {
            this[F76] = !1
        }
        get isMockActive() {
            return this[n71]
        } [i71](A, q) {
            this[g76].set(A, q)
        } [o71](A) {
            let q = Object.assign({
                agent: this
            }, this[r71]);
            return this[r71] && this[r71].connections === 1 ? new CuK(A, q) : new IuK(A, q)
        } [DbA](A) {
            let q = this[g76].get(A);
            if (q) return q;
            if (typeof A !== "string") {
                let K = this[o71]("http://localhost:9999");
                return this[i71](A, K), K
            }
            for (let [K, Y] of Array.from(this[g76]))
                if (Y && typeof K !== "string" && buK(K, A)) {
                    let z = this[o71](A);
                    return this[i71](A, z), z[no1] = Y[no1], z
                }
        } [SuK]() {
            return this[F76]
        }
        pendingInterceptors() {
            let A = this[g76];
            return Array.from(A.entries()).flatMap(([q, K]) => K[no1].map((Y) => ({
                ...Y,
                origin: q
            }))).filter(({
                pending: q
            }) => q)
        }
        assertNoPendingInterceptors({
            pendingInterceptorsFormatter: A = new guK
        } = {}) {
            let q = this.pendingInterceptors();
            if (q.length === 0) return;
            let K = new BuK("interceptor", "interceptors").pluralize(q.length);
            throw new uuK(`
${K.count} ${K.noun} ${K.is} pending:

${A.format(q)}
`.trim())
        }
    }
    WbA.exports = PbA
})
// @from(Ln 57522, Col 4)
a71 = x((MO_, vbA) => {
    var GbA = Symbol.for("undici.globalDispatcher.1"),
        {
            InvalidArgumentError: FuK
        } = mz(),
        puK = CH6();
    if (TbA() === void 0) fbA(new puK);

    function fbA(A) {
        if (!A || typeof A.dispatch !== "function") throw new FuK("Argument agent must implement Agent");
        Object.defineProperty(globalThis, GbA, {
            value: A,
            writable: !0,
            enumerable: !1,
            configurable: !1
        })
    }

    function TbA() {
        return globalThis[GbA]
    }
    vbA.exports = {
        setGlobalDispatcher: fbA,
        getGlobalDispatcher: TbA
    }
})
// @from(Ln 57548, Col 4)
s71 = x((DO_, NbA) => {
    NbA.exports = class {
        #A;
        constructor(q) {
            if (typeof q !== "object" || q === null) throw TypeError("handler must be an object");
            this.#A = q
        }
        onConnect(...q) {
            return this.#A.onConnect?.(...q)
        }
        onError(...q) {
            return this.#A.onError?.(...q)
        }
        onUpgrade(...q) {
            return this.#A.onUpgrade?.(...q)
        }
        onResponseStarted(...q) {
            return this.#A.onResponseStarted?.(...q)
        }
        onHeaders(...q) {
            return this.#A.onHeaders?.(...q)
        }
        onData(...q) {
            return this.#A.onData?.(...q)
        }
        onComplete(...q) {
            return this.#A.onComplete?.(...q)
        }
        onBodySent(...q) {
            return this.#A.onBodySent?.(...q)
        }
    }
})
// @from(Ln 57581, Col 4)
kbA = x((XO_, VbA) => {
    var QuK = C71();
    VbA.exports = (A) => {
        let q = A?.maxRedirections;
        return (K) => {
            return function(z, _) {
                let {
                    maxRedirections: w = q,
                    ...O
                } = z;
                if (!w) return K(z, _);
                let $ = new QuK(K, w, z, _);
                return K(O, $)
            }
        }
    }
})
// @from(Ln 57598, Col 4)
ybA = x((PO_, EbA) => {
    var UuK = Q71();
    EbA.exports = (A) => {
        return (q) => {
            return function(Y, z) {
                return q(Y, new UuK({
                    ...Y,
                    retryOptions: {
                        ...A,
                        ...Y.retryOptions
                    }
                }, {
                    handler: z,
                    dispatch: q
                }))
            }
        }
    }
})
// @from(Ln 57617, Col 4)
hbA = x((WO_, RbA) => {
    var duK = Y9(),
        {
            InvalidArgumentError: cuK,
            RequestAbortedError: luK
        } = mz(),
        iuK = s71();
    class LbA extends iuK {
        #A = 1048576;
        #q = null;
        #K = !1;
        #z = !1;
        #Y = 0;
        #w = null;
        #_ = null;
        constructor({
            maxSize: A
        }, q) {
            super(q);
            if (A != null && (!Number.isFinite(A) || A < 1)) throw new cuK("maxSize must be a number greater than 0");
            this.#A = A ?? this.#A, this.#_ = q
        }
        onConnect(A) {
            this.#q = A, this.#_.onConnect(this.#$.bind(this))
        }
        #$(A) {
            this.#z = !0, this.#w = A
        }
        onHeaders(A, q, K, Y) {
            let _ = duK.parseHeaders(q)["content-length"];
            if (_ != null && _ > this.#A) throw new luK(`Response size (${_}) larger than maxSize (${this.#A})`);
            if (this.#z) return !0;
            return this.#_.onHeaders(A, q, K, Y)
        }
        onError(A) {
            if (this.#K) return;
            A = this.#w ?? A, this.#_.onError(A)
        }
        onData(A) {
            if (this.#Y = this.#Y + A.length, this.#Y >= this.#A)
                if (this.#K = !0, this.#z) this.#_.onError(this.#w);
                else this.#_.onComplete([]);
            return !0
        }
        onComplete(A) {
            if (this.#K) return;
            if (this.#z) {
                this.#_.onError(this.reason);
                return
            }
            this.#_.onComplete(A)
        }
    }

    function nuK({
        maxSize: A
    } = {
        maxSize: 1048576
    }) {
        return (q) => {
            return function(Y, z) {
                let {
                    dumpMaxSize: _ = A
                } = Y, w = new LbA({
                    maxSize: _
                }, z);
                return q(Y, w)
            }
        }
    }
    RbA.exports = nuK
})
// @from(Ln 57689, Col 4)
xbA = x((ZO_, bbA) => {
    var {
        isIP: ruK
    } = x6("node:net"), {
        lookup: ouK
    } = x6("node:dns"), auK = s71(), {
        InvalidArgumentError: FH6,
        InformationalError: suK
    } = mz(), SbA = Math.pow(2, 31) - 1;
    class CbA {
        #A = 0;
        #q = 0;
        #K = new Map;
        dualStack = !0;
        affinity = null;
        lookup = null;
        pick = null;
        constructor(A) {
            this.#A = A.maxTTL, this.#q = A.maxItems, this.dualStack = A.dualStack, this.affinity = A.affinity, this.lookup = A.lookup ?? this.#z, this.pick = A.pick ?? this.#Y
        }
        get full() {
            return this.#K.size === this.#q
        }
        runLookup(A, q, K) {
            let Y = this.#K.get(A.hostname);
            if (Y == null && this.full) {
                K(null, A.origin);
                return
            }
            let z = {
                affinity: this.affinity,
                dualStack: this.dualStack,
                lookup: this.lookup,
                pick: this.pick,
                ...q.dns,
                maxTTL: this.#A,
                maxItems: this.#q
            };
            if (Y == null) this.lookup(A, z, (_, w) => {
                if (_ || w == null || w.length === 0) {
                    K(_ ?? new suK("No DNS entries found"));
                    return
                }
                this.setRecords(A, w);
                let O = this.#K.get(A.hostname),
                    $ = this.pick(A, O, z.affinity),
                    H;
                if (typeof $.port === "number") H = `:${$.port}`;
                else if (A.port !== "") H = `:${A.port}`;
                else H = "";
                K(null, `${A.protocol}//${$.family===6?`[${$.address}]`:$.address}${H}`)
            });
            else {
                let _ = this.pick(A, Y, z.affinity);
                if (_ == null) {
                    this.#K.delete(A.hostname), this.runLookup(A, q, K);
                    return
                }
                let w;
                if (typeof _.port === "number") w = `:${_.port}`;
                else if (A.port !== "") w = `:${A.port}`;
                else w = "";
                K(null, `${A.protocol}//${_.family===6?`[${_.address}]`:_.address}${w}`)
            }
        }
        #z(A, q, K) {
            ouK(A.hostname, {
                all: !0,
                family: this.dualStack === !1 ? this.affinity : 0,
                order: "ipv4first"
            }, (Y, z) => {
                if (Y) return K(Y);
                let _ = new Map;
                for (let w of z) _.set(`${w.address}:${w.family}`, w);
                K(null, _.values())
            })
        }
        #Y(A, q, K) {
            let Y = null,
                {
                    records: z,
                    offset: _
                } = q,
                w;
            if (this.dualStack) {
                if (K == null)
                    if (_ == null || _ === SbA) q.offset = 0, K = 4;
                    else q.offset++, K = (q.offset & 1) === 1 ? 6 : 4;
                if (z[K] != null && z[K].ips.length > 0) w = z[K];
                else w = z[K === 4 ? 6 : 4]
            } else w = z[K];
            if (w == null || w.ips.length === 0) return Y;
            if (w.offset == null || w.offset === SbA) w.offset = 0;
            else w.offset++;
            let O = w.offset % w.ips.length;
            if (Y = w.ips[O] ?? null, Y == null) return Y;
            if (Date.now() - Y.timestamp > Y.ttl) return w.ips.splice(O, 1), this.pick(A, q, K);
            return Y
        }
        setRecords(A, q) {
            let K = Date.now(),
                Y = {
                    records: {
                        4: null,
                        6: null
                    }
                };
            for (let z of q) {
                if (z.timestamp = K, typeof z.ttl === "number") z.ttl = Math.min(z.ttl, this.#A);
                else z.ttl = this.#A;
                let _ = Y.records[z.family] ?? {
                    ips: []
                };
                _.ips.push(z), Y.records[z.family] = _
            }
            this.#K.set(A.hostname, Y)
        }
        getHandler(A, q) {
            return new IbA(this, A, q)
        }
    }
    class IbA extends auK {
        #A = null;
        #q = null;
        #K = null;
        #z = null;
        #Y = null;
        constructor(A, {
            origin: q,
            handler: K,
            dispatch: Y
        }, z) {
            super(K);
            this.#Y = q, this.#z = K, this.#q = {
                ...z
            }, this.#A = A, this.#K = Y
        }
        onError(A) {
            switch (A.code) {
                case "ETIMEDOUT":
                case "ECONNREFUSED": {
                    if (this.#A.dualStack) {
                        this.#A.runLookup(this.#Y, this.#q, (q, K) => {
                            if (q) return this.#z.onError(q);
                            let Y = {
                                ...this.#q,
                                origin: K
                            };
                            this.#K(Y, this)
                        });
                        return
                    }
                    this.#z.onError(A);
                    return
                }
                case "ENOTFOUND":
                    this.#A.deleteRecord(this.#Y);
                default:
                    this.#z.onError(A);
                    break
            }
        }
    }
    bbA.exports = (A) => {
        if (A?.maxTTL != null && (typeof A?.maxTTL !== "number" || A?.maxTTL < 0)) throw new FH6("Invalid maxTTL. Must be a positive number");
        if (A?.maxItems != null && (typeof A?.maxItems !== "number" || A?.maxItems < 1)) throw new FH6("Invalid maxItems. Must be a positive number and greater than zero");
        if (A?.affinity != null && A?.affinity !== 4 && A?.affinity !== 6) throw new FH6("Invalid affinity. Must be either 4 or 6");
        if (A?.dualStack != null && typeof A?.dualStack !== "boolean") throw new FH6("Invalid dualStack. Must be a boolean");
        if (A?.lookup != null && typeof A?.lookup !== "function") throw new FH6("Invalid lookup. Must be a function");
        if (A?.pick != null && typeof A?.pick !== "function") throw new FH6("Invalid pick. Must be a function");
        let q = A?.dualStack ?? !0,
            K;
        if (q) K = A?.affinity ?? null;
        else K = A?.affinity ?? 4;
        let Y = {
                maxTTL: A?.maxTTL ?? 1e4,
                lookup: A?.lookup ?? null,
                pick: A?.pick ?? null,
                dualStack: q,
                affinity: K,
                maxItems: A?.maxItems ?? 1 / 0
            },
            z = new CbA(Y);
        return (_) => {
            return function(O, $) {
                let H = O.origin.constructor === URL ? O.origin : new URL(O.origin);
                if (ruK(H.hostname) !== 0) return _(O, $);
                return z.runLookup(H, O, (j, J) => {
                    if (j) return $.onError(j);
                    let M = null;
                    M = {
                        ...O,
                        servername: H.hostname,
                        origin: J,
                        headers: {
                            host: H.hostname,
                            ...O.headers
                        }
                    }, _(M, z.getHandler({
                        origin: H,
                        dispatch: _,
                        handler: $
                    }, O))
                }), !0
            }
        }
    }
})
// @from(Ln 57897, Col 4)
p76 = x((GO_, QbA) => {
    var {
        kConstruct: tuK
    } = UO(), {
        kEnumerableProperty: pH6
    } = Y9(), {
        iteratorMixin: euK,
        isValidHeaderName: Hh6,
        isValidHeaderValue: mbA
    } = SV(), {
        webidl: yY
    } = vP(), ro1 = x6("node:assert"), t71 = x6("node:util"), fJ = Symbol("headers map"), bV = Symbol("headers map sorted");

    function ubA(A) {
        return A === 10 || A === 13 || A === 9 || A === 32
    }

    function BbA(A) {
        let q = 0,
            K = A.length;
        while (K > q && ubA(A.charCodeAt(K - 1))) --K;
        while (K > q && ubA(A.charCodeAt(q))) ++q;
        return q === 0 && K === A.length ? A : A.substring(q, K)
    }

    function gbA(A, q) {
        if (Array.isArray(q))
            for (let K = 0; K < q.length; ++K) {
                let Y = q[K];
                if (Y.length !== 2) throw yY.errors.exception({
                    header: "Headers constructor",
                    message: `expected name/value pair to be length 2, found ${Y.length}.`
                });
                oo1(A, Y[0], Y[1])
            } else if (typeof q === "object" && q !== null) {
                let K = Object.keys(q);
                for (let Y = 0; Y < K.length; ++Y) oo1(A, K[Y], q[K[Y]])
            } else throw yY.errors.conversionFailed({
                prefix: "Headers constructor",
                argument: "Argument 1",
                types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
            })
    }

    function oo1(A, q, K) {
        if (K = BbA(K), !Hh6(q)) throw yY.errors.invalidArgument({
            prefix: "Headers.append",
            value: q,
            type: "header name"
        });
        else if (!mbA(K)) throw yY.errors.invalidArgument({
            prefix: "Headers.append",
            value: K,
            type: "header value"
        });
        if (pbA(A) === "immutable") throw TypeError("immutable");
        return ao1(A).append(q, K, !1)
    }

    function FbA(A, q) {
        return A[0] < q[0] ? -1 : 1
    }
    class e71 {
        cookies = null;
        constructor(A) {
            if (A instanceof e71) this[fJ] = new Map(A[fJ]), this[bV] = A[bV], this.cookies = A.cookies === null ? null : [...A.cookies];
            else this[fJ] = new Map(A), this[bV] = null
        }
        contains(A, q) {
            return this[fJ].has(q ? A : A.toLowerCase())
        }
        clear() {
            this[fJ].clear(), this[bV] = null, this.cookies = null
        }
        append(A, q, K) {
            this[bV] = null;
            let Y = K ? A : A.toLowerCase(),
                z = this[fJ].get(Y);
            if (z) {
                let _ = Y === "cookie" ? "; " : ", ";
                this[fJ].set(Y, {
                    name: z.name,
                    value: `${z.value}${_}${q}`
                })
            } else this[fJ].set(Y, {
                name: A,
                value: q
            });
            if (Y === "set-cookie")(this.cookies ??= []).push(q)
        }
        set(A, q, K) {
            this[bV] = null;
            let Y = K ? A : A.toLowerCase();
            if (Y === "set-cookie") this.cookies = [q];
            this[fJ].set(Y, {
                name: A,
                value: q
            })
        }
        delete(A, q) {
            if (this[bV] = null, !q) A = A.toLowerCase();
            if (A === "set-cookie") this.cookies = null;
            this[fJ].delete(A)
        }
        get(A, q) {
            return this[fJ].get(q ? A : A.toLowerCase())?.value ?? null
        }*[Symbol.iterator]() {
            for (let {
                    0: A,
                    1: {
                        value: q
                    }
                }
                of this[fJ]) yield [A, q]
        }
        get entries() {
            let A = {};
            if (this[fJ].size !== 0)
                for (let {
                        name: q,
                        value: K
                    }
                    of this[fJ].values()) A[q] = K;
            return A
        }
        rawValues() {
            return this[fJ].values()
        }
        get entriesList() {
            let A = [];
            if (this[fJ].size !== 0)
                for (let {
                        0: q,
                        1: {
                            name: K,
                            value: Y
                        }
                    }
                    of this[fJ])
                    if (q === "set-cookie")
                        for (let z of this.cookies) A.push([K, z]);
                    else A.push([K, Y]);
            return A
        }
        toSortedArray() {
            let A = this[fJ].size,
                q = Array(A);
            if (A <= 32) {
                if (A === 0) return q;
                let K = this[fJ][Symbol.iterator](),
                    Y = K.next().value;
                q[0] = [Y[0], Y[1].value], ro1(Y[1].value !== null);
                for (let z = 1, _ = 0, w = 0, O = 0, $ = 0, H, j; z < A; ++z) {
                    j = K.next().value, H = q[z] = [j[0], j[1].value], ro1(H[1] !== null), O = 0, w = z;
                    while (O < w)
                        if ($ = O + (w - O >> 1), q[$][0] <= H[0]) O = $ + 1;
                        else w = $;
                    if (z !== $) {
                        _ = z;
                        while (_ > O) q[_] = q[--_];
                        q[O] = H
                    }
                }
                if (!K.next().done) throw TypeError("Unreachable");
                return q
            } else {
                let K = 0;
                for (let {
                        0: Y,
                        1: {
                            value: z
                        }
                    }
                    of this[fJ]) q[K++] = [Y, z], ro1(z !== null);
                return q.sort(FbA)
            }
        }
    }
    class TW {
        #A;
        #q;
        constructor(A = void 0) {
            if (yY.util.markAsUncloneable(this), A === tuK) return;
            if (this.#q = new e71, this.#A = "none", A !== void 0) A = yY.converters.HeadersInit(A, "Headers contructor", "init"), gbA(this, A)
        }
        append(A, q) {
            yY.brandCheck(this, TW), yY.argumentLengthCheck(arguments, 2, "Headers.append");
            let K = "Headers.append";
            return A = yY.converters.ByteString(A, K, "name"), q = yY.converters.ByteString(q, K, "value"), oo1(this, A, q)
        }
        delete(A) {
            yY.brandCheck(this, TW), yY.argumentLengthCheck(arguments, 1, "Headers.delete");
            let q = "Headers.delete";
            if (A = yY.converters.ByteString(A, q, "name"), !Hh6(A)) throw yY.errors.invalidArgument({
                prefix: "Headers.delete",
                value: A,
                type: "header name"
            });
            if (this.#A === "immutable") throw TypeError("immutable");
            if (!this.#q.contains(A, !1)) return;
            this.#q.delete(A, !1)
        }
        get(A) {
            yY.brandCheck(this, TW), yY.argumentLengthCheck(arguments, 1, "Headers.get");
            let q = "Headers.get";
            if (A = yY.converters.ByteString(A, q, "name"), !Hh6(A)) throw yY.errors.invalidArgument({
                prefix: q,
                value: A,
                type: "header name"
            });
            return this.#q.get(A, !1)
        }
        has(A) {
            yY.brandCheck(this, TW), yY.argumentLengthCheck(arguments, 1, "Headers.has");
            let q = "Headers.has";
            if (A = yY.converters.ByteString(A, q, "name"), !Hh6(A)) throw yY.errors.invalidArgument({
                prefix: q,
                value: A,
                type: "header name"
            });
            return this.#q.contains(A, !1)
        }
        set(A, q) {
            yY.brandCheck(this, TW), yY.argumentLengthCheck(arguments, 2, "Headers.set");
            let K = "Headers.set";
            if (A = yY.converters.ByteString(A, K, "name"), q = yY.converters.ByteString(q, K, "value"), q = BbA(q), !Hh6(A)) throw yY.errors.invalidArgument({
                prefix: K,
                value: A,
                type: "header name"
            });
            else if (!mbA(q)) throw yY.errors.invalidArgument({
                prefix: K,
                value: q,
                type: "header value"
            });
            if (this.#A === "immutable") throw TypeError("immutable");
            this.#q.set(A, q, !1)
        }
        getSetCookie() {
            yY.brandCheck(this, TW);
            let A = this.#q.cookies;
            if (A) return [...A];
            return []
        }
        get[bV]() {
            if (this.#q[bV]) return this.#q[bV];
            let A = [],
                q = this.#q.toSortedArray(),
                K = this.#q.cookies;
            if (K === null || K.length === 1) return this.#q[bV] = q;
            for (let Y = 0; Y < q.length; ++Y) {
                let {
                    0: z,
                    1: _
                } = q[Y];
                if (z === "set-cookie")
                    for (let w = 0; w < K.length; ++w) A.push([z, K[w]]);
                else A.push([z, _])
            }
            return this.#q[bV] = A
        } [t71.inspect.custom](A, q) {
            return q.depth ??= A, `Headers ${t71.formatWithOptions(q,this.#q.entries)}`
        }
        static getHeadersGuard(A) {
            return A.#A
        }
        static setHeadersGuard(A, q) {
            A.#A = q
        }
        static getHeadersList(A) {
            return A.#q
        }
        static setHeadersList(A, q) {
            A.#q = q
        }
    }
    var {
        getHeadersGuard: pbA,
        setHeadersGuard: AmK,
        getHeadersList: ao1,
        setHeadersList: qmK
    } = TW;
    Reflect.deleteProperty(TW, "getHeadersGuard");
    Reflect.deleteProperty(TW, "setHeadersGuard");
    Reflect.deleteProperty(TW, "getHeadersList");
    Reflect.deleteProperty(TW, "setHeadersList");
    euK("Headers", TW, bV, 0, 1);
    Object.defineProperties(TW.prototype, {
        append: pH6,
        delete: pH6,
        get: pH6,
        has: pH6,
        set: pH6,
        getSetCookie: pH6,
        [Symbol.toStringTag]: {
            value: "Headers",
            configurable: !0
        },
        [t71.inspect.custom]: {
            enumerable: !1
        }
    });
    yY.converters.HeadersInit = function(A, q, K) {
        if (yY.util.Type(A) === "Object") {
            let Y = Reflect.get(A, Symbol.iterator);
            if (!t71.types.isProxy(A) && Y === TW.prototype.entries) try {
                return ao1(A).entriesList
            } catch {}
            if (typeof Y === "function") return yY.converters["sequence<sequence<ByteString>>"](A, q, K, Y.bind(A));
            return yY.converters["record<ByteString, ByteString>"](A, q, K)
        }
        throw yY.errors.conversionFailed({
            prefix: "Headers constructor",
            argument: "Argument 1",
            types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
        })
    };
    QbA.exports = {
        fill: gbA,
        compareHeaderName: FbA,
        Headers: TW,
        HeadersList: e71,
        getHeadersGuard: pbA,
        setHeadersGuard: AmK,
        setHeadersList: qmK,
        getHeadersList: ao1
    }
})
// @from(Ln 58225, Col 4)
Jh6 = x((fO_, sbA) => {
    var {
        Headers: nbA,
        HeadersList: UbA,
        fill: KmK,
        getHeadersGuard: YmK,
        setHeadersGuard: rbA,
        setHeadersList: obA
    } = p76(), {
        extractBody: dbA,
        cloneBody: zmK,
        mixinBody: _mK,
        hasFinalizationRegistry: wmK,
        streamRegistry: OmK,
        bodyUnusable: $mK
    } = VH6(), so1 = Y9(), cbA = x6("node:util"), {
        kEnumerableProperty: xV
    } = so1, {
        isValidReasonPhrase: HmK,
        isCancelled: jmK,
        isAborted: JmK,
        isBlobLike: MmK,
        serializeJavascriptValueToJSONString: DmK,
        isErrorLike: XmK,
        isomorphicEncode: PmK,
        environmentSettingsObject: WmK
    } = SV(), {
        redirectStatusSet: ZmK,
        nullBodyStatus: GmK
    } = CR6(), {
        kState: RH,
        kHeaders: OQ
    } = Nr(), {
        webidl: M3
    } = vP(), {
        FormData: fmK
    } = mR6(), {
        URLSerializer: lbA
    } = hT(), {
        kConstruct: q41
    } = UO(), to1 = x6("node:assert"), {
        types: TmK
    } = x6("node:util"), vmK = new TextEncoder("utf-8");
    class vW {
        static error() {
            return jh6(K41(), "immutable")
        }
        static json(A, q = {}) {
            if (M3.argumentLengthCheck(arguments, 1, "Response.json"), q !== null) q = M3.converters.ResponseInit(q);
            let K = vmK.encode(DmK(A)),
                Y = dbA(K),
                z = jh6(QH6({}), "response");
            return ibA(z, q, {
                body: Y[0],
                type: "application/json"
            }), z
        }
        static redirect(A, q = 302) {
            M3.argumentLengthCheck(arguments, 1, "Response.redirect"), A = M3.converters.USVString(A), q = M3.converters["unsigned short"](q);
            let K;
            try {
                K = new URL(A, WmK.settingsObject.baseUrl)
            } catch (_) {
                throw TypeError(`Failed to parse URL from ${A}`, {
                    cause: _
                })
            }
            if (!ZmK.has(q)) throw RangeError(`Invalid status code ${q}`);
            let Y = jh6(QH6({}), "immutable");
            Y[RH].status = q;
            let z = PmK(lbA(K));
            return Y[RH].headersList.append("location", z, !0), Y
        }
        constructor(A = null, q = {}) {
            if (M3.util.markAsUncloneable(this), A === q41) return;
            if (A !== null) A = M3.converters.BodyInit(A);
            q = M3.converters.ResponseInit(q), this[RH] = QH6({}), this[OQ] = new nbA(q41), rbA(this[OQ], "response"), obA(this[OQ], this[RH].headersList);
            let K = null;
            if (A != null) {
                let [Y, z] = dbA(A);
                K = {
                    body: Y,
                    type: z
                }
            }
            ibA(this, q, K)
        }
        get type() {
            return M3.brandCheck(this, vW), this[RH].type
        }
        get url() {
            M3.brandCheck(this, vW);
            let A = this[RH].urlList,
                q = A[A.length - 1] ?? null;
            if (q === null) return "";
            return lbA(q, !0)
        }
        get redirected() {
            return M3.brandCheck(this, vW), this[RH].urlList.length > 1
        }
        get status() {
            return M3.brandCheck(this, vW), this[RH].status
        }
        get ok() {
            return M3.brandCheck(this, vW), this[RH].status >= 200 && this[RH].status <= 299
        }
        get statusText() {
            return M3.brandCheck(this, vW), this[RH].statusText
        }
        get headers() {
            return M3.brandCheck(this, vW), this[OQ]
        }
        get body() {
            return M3.brandCheck(this, vW), this[RH].body ? this[RH].body.stream : null
        }
        get bodyUsed() {
            return M3.brandCheck(this, vW), !!this[RH].body && so1.isDisturbed(this[RH].body.stream)
        }
        clone() {
            if (M3.brandCheck(this, vW), $mK(this)) throw M3.errors.exception({
                header: "Response.clone",
                message: "Body has already been consumed."
            });
            let A = eo1(this[RH]);
            return jh6(A, YmK(this[OQ]))
        } [cbA.inspect.custom](A, q) {
            if (q.depth === null) q.depth = 2;
            q.colors ??= !0;
            let K = {
                status: this.status,
                statusText: this.statusText,
                headers: this.headers,
                body: this.body,
                bodyUsed: this.bodyUsed,
                ok: this.ok,
                redirected: this.redirected,
                type: this.type,
                url: this.url
            };
            return `Response ${cbA.formatWithOptions(q,K)}`
        }
    }
    _mK(vW);
    Object.defineProperties(vW.prototype, {
        type: xV,
        url: xV,
        status: xV,
        ok: xV,
        redirected: xV,
        statusText: xV,
        headers: xV,
        clone: xV,
        body: xV,
        bodyUsed: xV,
        [Symbol.toStringTag]: {
            value: "Response",
            configurable: !0
        }
    });
    Object.defineProperties(vW, {
        json: xV,
        redirect: xV,
        error: xV
    });

    function eo1(A) {
        if (A.internalResponse) return abA(eo1(A.internalResponse), A.type);
        let q = QH6({
            ...A,
            body: null
        });
        if (A.body != null) q.body = zmK(q, A.body);
        return q
    }

    function QH6(A) {
        return {
            aborted: !1,
            rangeRequested: !1,
            timingAllowPassed: !1,
            requestIncludesCredentials: !1,
            type: "default",
            status: 200,
            timingInfo: null,
            cacheState: "",
            statusText: "",
            ...A,
            headersList: A?.headersList ? new UbA(A?.headersList) : new UbA,
            urlList: A?.urlList ? [...A.urlList] : []
        }
    }

    function K41(A) {
        let q = XmK(A);
        return QH6({
            type: "error",
            status: 0,
            error: q ? A : Error(A ? String(A) : A),
            aborted: A && A.name === "AbortError"
        })
    }

    function NmK(A) {
        return A.type === "error" && A.status === 0
    }

    function A41(A, q) {
        return q = {
            internalResponse: A,
            ...q
        }, new Proxy(A, {
            get(K, Y) {
                return Y in q ? q[Y] : K[Y]
            },
            set(K, Y, z) {
                return to1(!(Y in q)), K[Y] = z, !0
            }
        })
    }

    function abA(A, q) {
        if (q === "basic") return A41(A, {
            type: "basic",
            headersList: A.headersList
        });
        else if (q === "cors") return A41(A, {
            type: "cors",
            headersList: A.headersList
        });
        else if (q === "opaque") return A41(A, {
            type: "opaque",
            urlList: Object.freeze([]),
            status: 0,
            statusText: "",
            body: null
        });
        else if (q === "opaqueredirect") return A41(A, {
            type: "opaqueredirect",
            status: 0,
            statusText: "",
            headersList: [],
            body: null
        });
        else to1(!1)
    }

    function VmK(A, q = null) {
        return to1(jmK(A)), JmK(A) ? K41(Object.assign(new DOMException("The operation was aborted.", "AbortError"), {
            cause: q
        })) : K41(Object.assign(new DOMException("Request was cancelled."), {
            cause: q
        }))
    }

    function ibA(A, q, K) {
        if (q.status !== null && (q.status < 200 || q.status > 599)) throw RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
        if ("statusText" in q && q.statusText != null) {
            if (!HmK(String(q.statusText))) throw TypeError("Invalid statusText")
        }
        if ("status" in q && q.status != null) A[RH].status = q.status;
        if ("statusText" in q && q.statusText != null) A[RH].statusText = q.statusText;
        if ("headers" in q && q.headers != null) KmK(A[OQ], q.headers);
        if (K) {
            if (GmK.includes(A.status)) throw M3.errors.exception({
                header: "Response constructor",
                message: `Invalid response status code ${A.status}`
            });
            if (A[RH].body = K.body, K.type != null && !A[RH].headersList.contains("content-type", !0)) A[RH].headersList.append("content-type", K.type, !0)
        }
    }

    function jh6(A, q) {
        let K = new vW(q41);
        if (K[RH] = A, K[OQ] = new nbA(q41), obA(K[OQ], A.headersList), rbA(K[OQ], q), wmK && A.body?.stream) OmK.register(K, new WeakRef(A.body.stream));
        return K
    }
    M3.converters.ReadableStream = M3.interfaceConverter(ReadableStream);
    M3.converters.FormData = M3.interfaceConverter(fmK);
    M3.converters.URLSearchParams = M3.interfaceConverter(URLSearchParams);
    M3.converters.XMLHttpRequestBodyInit = function(A, q, K) {
        if (typeof A === "string") return M3.converters.USVString(A, q, K);
        if (MmK(A)) return M3.converters.Blob(A, q, K, {
            strict: !1
        });
        if (ArrayBuffer.isView(A) || TmK.isArrayBuffer(A)) return M3.converters.BufferSource(A, q, K);
        if (so1.isFormDataLike(A)) return M3.converters.FormData(A, q, K, {
            strict: !1
        });
        if (A instanceof URLSearchParams) return M3.converters.URLSearchParams(A, q, K);
        return M3.converters.DOMString(A, q, K)
    };
    M3.converters.BodyInit = function(A, q, K) {
        if (A instanceof ReadableStream) return M3.converters.ReadableStream(A, q, K);
        if (A?.[Symbol.asyncIterator]) return A;
        return M3.converters.XMLHttpRequestBodyInit(A, q, K)
    };
    M3.converters.ResponseInit = M3.dictionaryConverter([{
        key: "status",
        converter: M3.converters["unsigned short"],
        defaultValue: () => 200
    }, {
        key: "statusText",
        converter: M3.converters.ByteString,
        defaultValue: () => ""
    }, {
        key: "headers",
        converter: M3.converters.HeadersInit
    }]);
    sbA.exports = {
        isNetworkError: NmK,
        makeNetworkError: K41,
        makeResponse: QH6,
        makeAppropriateNetworkError: VmK,
        filterResponse: abA,
        Response: vW,
        cloneResponse: eo1,
        fromInnerResponse: jh6
    }
})
// @from(Ln 58544, Col 4)
YxA = x((TO_, KxA) => {
    var {
        kConnected: tbA,
        kSize: ebA
    } = UO();
    class AxA {
        constructor(A) {
            this.value = A
        }
        deref() {
            return this.value[tbA] === 0 && this.value[ebA] === 0 ? void 0 : this.value
        }
    }
    class qxA {
        constructor(A) {
            this.finalizer = A
        }
        register(A, q) {
            if (A.on) A.on("disconnect", () => {
                if (A[tbA] === 0 && A[ebA] === 0) this.finalizer(q)
            })
        }
        unregister(A) {}
    }
    KxA.exports = function() {
        if (process.env.NODE_V8_COVERAGE && process.version.startsWith("v18")) return process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
            WeakRef: AxA,
            FinalizationRegistry: qxA
        };
        return {
            WeakRef,
            FinalizationRegistry
        }
    }
})
// @from(Ln 58579, Col 4)
UH6 = x((vO_, GxA) => {
    var {
        extractBody: kmK,
        mixinBody: EmK,
        cloneBody: ymK,
        bodyUnusable: zxA
    } = VH6(), {
        Headers: DxA,
        fill: LmK,
        HeadersList: w41,
        setHeadersGuard: qa1,
        getHeadersGuard: RmK,
        setHeadersList: XxA,
        getHeadersList: _xA
    } = p76(), {
        FinalizationRegistry: hmK
    } = YxA()(), z41 = Y9(), wxA = x6("node:util"), {
        isValidHTTPToken: SmK,
        sameOrigin: OxA,
        environmentSettingsObject: Y41
    } = SV(), {
        forbiddenMethodsSet: CmK,
        corsSafeListedMethodsSet: ImK,
        referrerPolicy: bmK,
        requestRedirect: xmK,
        requestMode: umK,
        requestCredentials: mmK,
        requestCache: BmK,
        requestDuplex: gmK
    } = CR6(), {
        kEnumerableProperty: TJ,
        normalizedMethodRecordsBase: FmK,
        normalizedMethodRecords: pmK
    } = z41, {
        kHeaders: uV,
        kSignal: _41,
        kState: _O,
        kDispatcher: Aa1
    } = Nr(), {
        webidl: yK
    } = vP(), {
        URLSerializer: QmK
    } = hT(), {
        kConstruct: O41
    } = UO(), UmK = x6("node:assert"), {
        getMaxListeners: $xA,
        setMaxListeners: HxA,
        getEventListeners: dmK,
        defaultMaxListeners: jxA
    } = x6("node:events"), cmK = Symbol("abortController"), PxA = new hmK(({
        signal: A,
        abort: q
    }) => {
        A.removeEventListener("abort", q)
    }), $41 = new WeakMap;

    function JxA(A) {
        return q;

        function q() {
            let K = A.deref();
            if (K !== void 0) {
                PxA.unregister(q), this.removeEventListener("abort", q), K.abort(this.reason);
                let Y = $41.get(K.signal);
                if (Y !== void 0) {
                    if (Y.size !== 0) {
                        for (let z of Y) {
                            let _ = z.deref();
                            if (_ !== void 0) _.abort(this.reason)
                        }
                        Y.clear()
                    }
                    $41.delete(K.signal)
                }
            }
        }
    }
    var MxA = !1;
    class m2 {
        constructor(A, q = {}) {
            if (yK.util.markAsUncloneable(this), A === O41) return;
            let K = "Request constructor";
            yK.argumentLengthCheck(arguments, 1, K), A = yK.converters.RequestInfo(A, K, "input"), q = yK.converters.RequestInit(q, K, "init");
            let Y = null,
                z = null,
                _ = Y41.settingsObject.baseUrl,
                w = null;
            if (typeof A === "string") {
                this[Aa1] = q.dispatcher;
                let W;
                try {
                    W = new URL(A, _)
                } catch (Z) {
                    throw TypeError("Failed to parse URL from " + A, {
                        cause: Z
                    })
                }
                if (W.username || W.password) throw TypeError("Request cannot be constructed from a URL that includes credentials: " + A);
                Y = H41({
                    urlList: [W]
                }), z = "cors"
            } else this[Aa1] = q.dispatcher || A[Aa1], UmK(A instanceof m2), Y = A[_O], w = A[_41];
            let O = Y41.settingsObject.origin,
                $ = "client";
            if (Y.window?.constructor?.name === "EnvironmentSettingsObject" && OxA(Y.window, O)) $ = Y.window;
            if (q.window != null) throw TypeError(`'window' option '${$}' must be null`);
            if ("window" in q) $ = "no-window";
            Y = H41({
                method: Y.method,
                headersList: Y.headersList,
                unsafeRequest: Y.unsafeRequest,
                client: Y41.settingsObject,
                window: $,
                priority: Y.priority,
                origin: Y.origin,
                referrer: Y.referrer,
                referrerPolicy: Y.referrerPolicy,
                mode: Y.mode,
                credentials: Y.credentials,
                cache: Y.cache,
                redirect: Y.redirect,
                integrity: Y.integrity,
                keepalive: Y.keepalive,
                reloadNavigation: Y.reloadNavigation,
                historyNavigation: Y.historyNavigation,
                urlList: [...Y.urlList]
            });
            let H = Object.keys(q).length !== 0;
            if (H) {
                if (Y.mode === "navigate") Y.mode = "same-origin";
                Y.reloadNavigation = !1, Y.historyNavigation = !1, Y.origin = "client", Y.referrer = "client", Y.referrerPolicy = "", Y.url = Y.urlList[Y.urlList.length - 1], Y.urlList = [Y.url]
            }
            if (q.referrer !== void 0) {
                let W = q.referrer;
                if (W === "") Y.referrer = "no-referrer";
                else {
                    let Z;
                    try {
                        Z = new URL(W, _)
                    } catch (G) {
                        throw TypeError(`Referrer "${W}" is not a valid URL.`, {
                            cause: G
                        })
                    }
                    if (Z.protocol === "about:" && Z.hostname === "client" || O && !OxA(Z, Y41.settingsObject.baseUrl)) Y.referrer = "client";
                    else Y.referrer = Z
                }
            }
            if (q.referrerPolicy !== void 0) Y.referrerPolicy = q.referrerPolicy;
            let j;
            if (q.mode !== void 0) j = q.mode;
            else j = z;
            if (j === "navigate") throw yK.errors.exception({
                header: "Request constructor",
                message: "invalid request mode navigate."
            });
            if (j != null) Y.mode = j;
            if (q.credentials !== void 0) Y.credentials = q.credentials;
            if (q.cache !== void 0) Y.cache = q.cache;
            if (Y.cache === "only-if-cached" && Y.mode !== "same-origin") throw TypeError("'only-if-cached' can be set only with 'same-origin' mode");
            if (q.redirect !== void 0) Y.redirect = q.redirect;
            if (q.integrity != null) Y.integrity = String(q.integrity);
            if (q.keepalive !== void 0) Y.keepalive = Boolean(q.keepalive);
            if (q.method !== void 0) {
                let W = q.method,
                    Z = pmK[W];
                if (Z !== void 0) Y.method = Z;
                else {
                    if (!SmK(W)) throw TypeError(`'${W}' is not a valid HTTP method.`);
                    let G = W.toUpperCase();
                    if (CmK.has(G)) throw TypeError(`'${W}' HTTP method is unsupported.`);
                    W = FmK[G] ?? W, Y.method = W
                }
                if (!MxA && Y.method === "patch") process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
                    code: "UNDICI-FETCH-patch"
                }), MxA = !0
            }
            if (q.signal !== void 0) w = q.signal;
            this[_O] = Y;
            let J = new AbortController;
            if (this[_41] = J.signal, w != null) {
                if (!w || typeof w.aborted !== "boolean" || typeof w.addEventListener !== "function") throw TypeError("Failed to construct 'Request': member signal is not of type AbortSignal.");
                if (w.aborted) J.abort(w.reason);
                else {
                    this[cmK] = J;
                    let W = new WeakRef(J),
                        Z = JxA(W);
                    try {
                        if (typeof $xA === "function" && $xA(w) === jxA) HxA(1500, w);
                        else if (dmK(w, "abort").length >= jxA) HxA(1500, w)
                    } catch {}
                    z41.addAbortListener(w, Z), PxA.register(J, {
                        signal: w,
                        abort: Z
                    }, Z)
                }
            }
            if (this[uV] = new DxA(O41), XxA(this[uV], Y.headersList), qa1(this[uV], "request"), j === "no-cors") {
                if (!ImK.has(Y.method)) throw TypeError(`'${Y.method} is unsupported in no-cors mode.`);
                qa1(this[uV], "request-no-cors")
            }
            if (H) {
                let W = _xA(this[uV]),
                    Z = q.headers !== void 0 ? q.headers : new w41(W);
                if (W.clear(), Z instanceof w41) {
                    for (let {
                            name: G,
                            value: f
                        }
                        of Z.rawValues()) W.append(G, f, !1);
                    W.cookies = Z.cookies
                } else LmK(this[uV], Z)
            }
            let M = A instanceof m2 ? A[_O].body : null;
            if ((q.body != null || M != null) && (Y.method === "GET" || Y.method === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body.");
            let D = null;
            if (q.body != null) {
                let [W, Z] = kmK(q.body, Y.keepalive);
                if (D = W, Z && !_xA(this[uV]).contains("content-type", !0)) this[uV].append("content-type", Z)
            }
            let X = D ?? M;
            if (X != null && X.source == null) {
                if (D != null && q.duplex == null) throw TypeError("RequestInit: duplex option is required when sending a body.");
                if (Y.mode !== "same-origin" && Y.mode !== "cors") throw TypeError('If request is made from ReadableStream, mode should be "same-origin" or "cors"');
                Y.useCORSPreflightFlag = !0
            }
            let P = X;
            if (D == null && M != null) {
                if (zxA(A)) throw TypeError("Cannot construct a Request with a Request object that has already been used.");
                let W = new TransformStream;
                M.stream.pipeThrough(W), P = {
                    source: M.source,
                    length: M.length,
                    stream: W.readable
                }
            }
            this[_O].body = P
        }
        get method() {
            return yK.brandCheck(this, m2), this[_O].method
        }
        get url() {
            return yK.brandCheck(this, m2), QmK(this[_O].url)
        }
        get headers() {
            return yK.brandCheck(this, m2), this[uV]
        }
        get destination() {
            return yK.brandCheck(this, m2), this[_O].destination
        }
        get referrer() {
            if (yK.brandCheck(this, m2), this[_O].referrer === "no-referrer") return "";
            if (this[_O].referrer === "client") return "about:client";
            return this[_O].referrer.toString()
        }
        get referrerPolicy() {
            return yK.brandCheck(this, m2), this[_O].referrerPolicy
        }
        get mode() {
            return yK.brandCheck(this, m2), this[_O].mode
        }
        get credentials() {
            return this[_O].credentials
        }
        get cache() {
            return yK.brandCheck(this, m2), this[_O].cache
        }
        get redirect() {
            return yK.brandCheck(this, m2), this[_O].redirect
        }
        get integrity() {
            return yK.brandCheck(this, m2), this[_O].integrity
        }
        get keepalive() {
            return yK.brandCheck(this, m2), this[_O].keepalive
        }
        get isReloadNavigation() {
            return yK.brandCheck(this, m2), this[_O].reloadNavigation
        }
        get isHistoryNavigation() {
            return yK.brandCheck(this, m2), this[_O].historyNavigation
        }
        get signal() {
            return yK.brandCheck(this, m2), this[_41]
        }
        get body() {
            return yK.brandCheck(this, m2), this[_O].body ? this[_O].body.stream : null
        }
        get bodyUsed() {
            return yK.brandCheck(this, m2), !!this[_O].body && z41.isDisturbed(this[_O].body.stream)
        }
        get duplex() {
            return yK.brandCheck(this, m2), "half"
        }
        clone() {
            if (yK.brandCheck(this, m2), zxA(this)) throw TypeError("unusable");
            let A = WxA(this[_O]),
                q = new AbortController;
            if (this.signal.aborted) q.abort(this.signal.reason);
            else {
                let K = $41.get(this.signal);
                if (K === void 0) K = new Set, $41.set(this.signal, K);
                let Y = new WeakRef(q);
                K.add(Y), z41.addAbortListener(q.signal, JxA(Y))
            }
            return ZxA(A, q.signal, RmK(this[uV]))
        } [wxA.inspect.custom](A, q) {
            if (q.depth === null) q.depth = 2;
            q.colors ??= !0;
            let K = {
                method: this.method,
                url: this.url,
                headers: this.headers,
                destination: this.destination,
                referrer: this.referrer,
                referrerPolicy: this.referrerPolicy,
                mode: this.mode,
                credentials: this.credentials,
                cache: this.cache,
                redirect: this.redirect,
                integrity: this.integrity,
                keepalive: this.keepalive,
                isReloadNavigation: this.isReloadNavigation,
                isHistoryNavigation: this.isHistoryNavigation,
                signal: this.signal
            };
            return `Request ${wxA.formatWithOptions(q,K)}`
        }
    }
    EmK(m2);

    function H41(A) {
        return {
            method: A.method ?? "GET",
            localURLsOnly: A.localURLsOnly ?? !1,
            unsafeRequest: A.unsafeRequest ?? !1,
            body: A.body ?? null,
            client: A.client ?? null,
            reservedClient: A.reservedClient ?? null,
            replacesClientId: A.replacesClientId ?? "",
            window: A.window ?? "client",
            keepalive: A.keepalive ?? !1,
            serviceWorkers: A.serviceWorkers ?? "all",
            initiator: A.initiator ?? "",
            destination: A.destination ?? "",
            priority: A.priority ?? null,
            origin: A.origin ?? "client",
            policyContainer: A.policyContainer ?? "client",
            referrer: A.referrer ?? "client",
            referrerPolicy: A.referrerPolicy ?? "",
            mode: A.mode ?? "no-cors",
            useCORSPreflightFlag: A.useCORSPreflightFlag ?? !1,
            credentials: A.credentials ?? "same-origin",
            useCredentials: A.useCredentials ?? !1,
            cache: A.cache ?? "default",
            redirect: A.redirect ?? "follow",
            integrity: A.integrity ?? "",
            cryptoGraphicsNonceMetadata: A.cryptoGraphicsNonceMetadata ?? "",
            parserMetadata: A.parserMetadata ?? "",
            reloadNavigation: A.reloadNavigation ?? !1,
            historyNavigation: A.historyNavigation ?? !1,
            userActivation: A.userActivation ?? !1,
            taintedOrigin: A.taintedOrigin ?? !1,
            redirectCount: A.redirectCount ?? 0,
            responseTainting: A.responseTainting ?? "basic",
            preventNoCacheCacheControlHeaderModification: A.preventNoCacheCacheControlHeaderModification ?? !1,
            done: A.done ?? !1,
            timingAllowFailed: A.timingAllowFailed ?? !1,
            urlList: A.urlList,
            url: A.urlList[0],
            headersList: A.headersList ? new w41(A.headersList) : new w41
        }
    }

    function WxA(A) {
        let q = H41({
            ...A,
            body: null
        });
        if (A.body != null) q.body = ymK(q, A.body);
        return q
    }

    function ZxA(A, q, K) {
        let Y = new m2(O41);
        return Y[_O] = A, Y[_41] = q, Y[uV] = new DxA(O41), XxA(Y[uV], A.headersList), qa1(Y[uV], K), Y
    }
    Object.defineProperties(m2.prototype, {
        method: TJ,
        url: TJ,
        headers: TJ,
        redirect: TJ,
        clone: TJ,
        signal: TJ,
        duplex: TJ,
        destination: TJ,
        body: TJ,
        bodyUsed: TJ,
        isHistoryNavigation: TJ,
        isReloadNavigation: TJ,
        keepalive: TJ,
        integrity: TJ,
        cache: TJ,
        credentials: TJ,
        attribute: TJ,
        referrerPolicy: TJ,
        referrer: TJ,
        mode: TJ,
        [Symbol.toStringTag]: {
            value: "Request",
            configurable: !0
        }
    });
    yK.converters.Request = yK.interfaceConverter(m2);
    yK.converters.RequestInfo = function(A, q, K) {
        if (typeof A === "string") return yK.converters.USVString(A, q, K);
        if (A instanceof m2) return yK.converters.Request(A, q, K);
        return yK.converters.USVString(A, q, K)
    };
    yK.converters.AbortSignal = yK.interfaceConverter(AbortSignal);
    yK.converters.RequestInit = yK.dictionaryConverter([{
        key: "method",
        converter: yK.converters.ByteString
    }, {
        key: "headers",
        converter: yK.converters.HeadersInit
    }, {
        key: "body",
        converter: yK.nullableConverter(yK.converters.BodyInit)
    }, {
        key: "referrer",
        converter: yK.converters.USVString
    }, {
        key: "referrerPolicy",
        converter: yK.converters.DOMString,
        allowedValues: bmK
    }, {
        key: "mode",
        converter: yK.converters.DOMString,
        allowedValues: umK
    }, {
        key: "credentials",
        converter: yK.converters.DOMString,
        allowedValues: mmK
    }, {
        key: "cache",
        converter: yK.converters.DOMString,
        allowedValues: BmK
    }, {
        key: "redirect",
        converter: yK.converters.DOMString,
        allowedValues: xmK
    }, {
        key: "integrity",
        converter: yK.converters.DOMString
    }, {
        key: "keepalive",
        converter: yK.converters.boolean
    }, {
        key: "signal",
        converter: yK.nullableConverter((A) => yK.converters.AbortSignal(A, "RequestInit", "signal", {
            strict: !1
        }))
    }, {
        key: "window",
        converter: yK.converters.any
    }, {
        key: "duplex",
        converter: yK.converters.DOMString,
        allowedValues: gmK
    }, {
        key: "dispatcher",
        converter: yK.converters.any
    }]);
    GxA.exports = {
        Request: m2,
        makeRequest: H41,
        fromInnerRequest: ZxA,
        cloneRequest: WxA
    }
})
// @from(Ln 59060, Col 4)
Dh6 = x((NO_, bxA) => {
    var {
        makeNetworkError: h_,
        makeAppropriateNetworkError: j41,
        filterResponse: Ka1,
        makeResponse: J41,
        fromInnerResponse: lmK
    } = Jh6(), {
        HeadersList: fxA
    } = p76(), {
        Request: imK,
        cloneRequest: nmK
    } = UH6(), br = x6("node:zlib"), {
        bytesMatch: rmK,
        makePolicyContainer: omK,
        clonePolicyContainer: amK,
        requestBadPort: smK,
        TAOCheck: tmK,
        appendRequestOriginHeader: emK,
        responseLocationURL: ABK,
        requestCurrentURL: ju,
        setRequestReferrerPolicyOnRedirect: qBK,
        tryUpgradeRequestToAPotentiallyTrustworthyURL: KBK,
        createOpaqueTimingInfo: Oa1,
        appendFetchMetadata: YBK,
        corsCheck: zBK,
        crossOriginResourcePolicyCheck: _BK,
        determineRequestsReferrer: wBK,
        coarsenedSharedCurrentTime: Mh6,
        createDeferredPromise: OBK,
        isBlobLike: $BK,
        sameOrigin: wa1,
        isCancelled: Q76,
        isAborted: TxA,
        isErrorLike: HBK,
        fullyReadBody: jBK,
        readableStreamClose: JBK,
        isomorphicEncode: M41,
        urlIsLocal: MBK,
        urlIsHttpHttpsScheme: $a1,
        urlHasHttpsScheme: DBK,
        clampAndCoarsenConnectionTimingInfo: XBK,
        simpleRangeHeaderValue: PBK,
        buildContentRange: WBK,
        createInflate: ZBK,
        extractMimeType: GBK
    } = SV(), {
        kState: kxA,
        kDispatcher: fBK
    } = Nr(), U76 = x6("node:assert"), {
        safelyExtractBody: Ha1,
        extractBody: vxA
    } = VH6(), {
        redirectStatusSet: ExA,
        nullBodyStatus: yxA,
        safeMethodsSet: TBK,
        requestBodyHeader: vBK,
        subresourceSet: NBK
    } = CR6(), VBK = x6("node:events"), {
        Readable: kBK,
        pipeline: EBK,
        finished: yBK
    } = x6("node:stream"), {
        addAbortListener: LBK,
        isErrored: RBK,
        isReadable: D41,
        bufferToLowerCasedHeaderName: NxA
    } = Y9(), {
        dataURLProcessor: hBK,
        serializeAMimeType: SBK,
        minimizeSupportedMimeType: CBK
    } = hT(), {
        getGlobalDispatcher: IBK
    } = a71(), {
        webidl: bBK
    } = vP(), {
        STATUS_CODES: xBK
    } = x6("node:http"), uBK = ["GET", "HEAD"], mBK = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici", Ya1;
    class ja1 extends VBK {
        constructor(A) {
            super();
            this.dispatcher = A, this.connection = null, this.dump = !1, this.state = "ongoing"
        }
        terminate(A) {
            if (this.state !== "ongoing") return;
            this.state = "terminated", this.connection?.destroy(A), this.emit("terminated", A)
        }
        abort(A) {
            if (this.state !== "ongoing") return;
            if (this.state = "aborted", !A) A = new DOMException("The operation was aborted.", "AbortError");
            this.serializedAbortReason = A, this.connection?.destroy(A), this.emit("terminated", A)
        }
    }

    function BBK(A) {
        LxA(A, "fetch")
    }

    function gBK(A, q = void 0) {
        bBK.argumentLengthCheck(arguments, 1, "globalThis.fetch");
        let K = OBK(),
            Y;
        try {
            Y = new imK(A, q)
        } catch (j) {
            return K.reject(j), K.promise
        }
        let z = Y[kxA];
        if (Y.signal.aborted) return za1(K, z, null, Y.signal.reason), K.promise;
        if (z.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope") z.serviceWorkers = "none";
        let w = null,
            O = !1,
            $ = null;
        return LBK(Y.signal, () => {
            O = !0, U76($ != null), $.abort(Y.signal.reason);
            let j = w?.deref();
            za1(K, z, j, Y.signal.reason)
        }), $ = hxA({
            request: z,
            processResponseEndOfBody: BBK,
            processResponse: (j) => {
                if (O) return;
                if (j.aborted) {
                    za1(K, z, w, $.serializedAbortReason);
                    return
                }
                if (j.type === "error") {
                    K.reject(TypeError("fetch failed", {
                        cause: j.error
                    }));
                    return
                }
                w = new WeakRef(lmK(j, "immutable")), K.resolve(w.deref()), K = null
            },
            dispatcher: Y[fBK]
        }), K.promise
    }

    function LxA(A, q = "other") {
        if (A.type === "error" && A.aborted) return;
        if (!A.urlList?.length) return;
        let K = A.urlList[0],
            Y = A.timingInfo,
            z = A.cacheState;
        if (!$a1(K)) return;
        if (Y === null) return;
        if (!A.timingAllowPassed) Y = Oa1({
            startTime: Y.startTime
        }), z = "";
        Y.endTime = Mh6(), A.timingInfo = Y, RxA(Y, K.href, q, globalThis, z)
    }
    var RxA = performance.markResourceTiming;

    function za1(A, q, K, Y) {
        if (A) A.reject(Y);
        if (q.body != null && D41(q.body?.stream)) q.body.stream.cancel(Y).catch((_) => {
            if (_.code === "ERR_INVALID_STATE") return;
            throw _
        });
        if (K == null) return;
        let z = K[kxA];
        if (z.body != null && D41(z.body?.stream)) z.body.stream.cancel(Y).catch((_) => {
            if (_.code === "ERR_INVALID_STATE") return;
            throw _
        })
    }

    function hxA({
        request: A,
        processRequestBodyChunkLength: q,
        processRequestEndOfBody: K,
        processResponse: Y,
        processResponseEndOfBody: z,
        processResponseConsumeBody: _,
        useParallelQueue: w = !1,
        dispatcher: O = IBK()
    }) {
        U76(O);
        let $ = null,
            H = !1;
        if (A.client != null) $ = A.client.globalObject, H = A.client.crossOriginIsolatedCapability;
        let j = Mh6(H),
            J = Oa1({
                startTime: j
            }),
            M = {
                controller: new ja1(O),
                request: A,
                timingInfo: J,
                processRequestBodyChunkLength: q,
                processRequestEndOfBody: K,
                processResponse: Y,
                processResponseConsumeBody: _,
                processResponseEndOfBody: z,
                taskDestination: $,
                crossOriginIsolatedCapability: H
            };
        if (U76(!A.body || A.body.stream), A.window === "client") A.window = A.client?.globalObject?.constructor?.name === "Window" ? A.client : "no-window";
        if (A.origin === "client") A.origin = A.client.origin;
        if (A.policyContainer === "client")
            if (A.client != null) A.policyContainer = amK(A.client.policyContainer);
            else A.policyContainer = omK();
        if (!A.headersList.contains("accept", !0)) A.headersList.append("accept", "*/*", !0);
        if (!A.headersList.contains("accept-language", !0)) A.headersList.append("accept-language", "*", !0);
        if (A.priority === null);
        if (NBK.has(A.destination));
        return SxA(M).catch((D) => {
            M.controller.terminate(D)
        }), M.controller
    }
    async function SxA(A, q = !1) {
        let K = A.request,
            Y = null;
        if (K.localURLsOnly && !MBK(ju(K))) Y = h_("local URLs only");
        if (KBK(K), smK(K) === "blocked") Y = h_("bad port");
        if (K.referrerPolicy === "") K.referrerPolicy = K.policyContainer.referrerPolicy;
        if (K.referrer !== "no-referrer") K.referrer = wBK(K);
        if (Y === null) Y = await (async () => {
            let _ = ju(K);
            if (wa1(_, K.url) && K.responseTainting === "basic" || _.protocol === "data:" || (K.mode === "navigate" || K.mode === "websocket")) return K.responseTainting = "basic", await VxA(A);
            if (K.mode === "same-origin") return h_('request mode cannot be "same-origin"');
            if (K.mode === "no-cors") {
                if (K.redirect !== "follow") return h_('redirect mode cannot be "follow" for "no-cors" request');
                return K.responseTainting = "opaque", await VxA(A)
            }
            if (!$a1(ju(K))) return h_("URL scheme must be a HTTP(S) scheme");
            return K.responseTainting = "cors", await CxA(A)
        })();
        if (q) return Y;
        if (Y.status !== 0 && !Y.internalResponse) {
            if (K.responseTainting === "cors");
            if (K.responseTainting === "basic") Y = Ka1(Y, "basic");
            else if (K.responseTainting === "cors") Y = Ka1(Y, "cors");
            else if (K.responseTainting === "opaque") Y = Ka1(Y, "opaque");
            else U76(!1)
        }
        let z = Y.status === 0 ? Y : Y.internalResponse;
        if (z.urlList.length === 0) z.urlList.push(...K.urlList);
        if (!K.timingAllowFailed) Y.timingAllowPassed = !0;
        if (Y.type === "opaque" && z.status === 206 && z.rangeRequested && !K.headers.contains("range", !0)) Y = z = h_();
        if (Y.status !== 0 && (K.method === "HEAD" || K.method === "CONNECT" || yxA.includes(z.status))) z.body = null, A.controller.dump = !0;
        if (K.integrity) {
            let _ = (O) => _a1(A, h_(O));
            if (K.responseTainting === "opaque" || Y.body == null) {
                _(Y.error);
                return
            }
            let w = (O) => {
                if (!rmK(O, K.integrity)) {
                    _("integrity mismatch");
                    return
                }
                Y.body = Ha1(O)[0], _a1(A, Y)
            };
            await jBK(Y.body, w, _)
        } else _a1(A, Y)
    }

    function VxA(A) {
        if (Q76(A) && A.request.redirectCount === 0) return Promise.resolve(j41(A));
        let {
            request: q
        } = A, {
            protocol: K
        } = ju(q);
        switch (K) {
            case "about:":
                return Promise.resolve(h_("about scheme is not supported"));
            case "blob:": {
                if (!Ya1) Ya1 = x6("node:buffer").resolveObjectURL;
                let Y = ju(q);
                if (Y.search.length !== 0) return Promise.resolve(h_("NetworkError when attempting to fetch resource."));
                let z = Ya1(Y.toString());
                if (q.method !== "GET" || !$BK(z)) return Promise.resolve(h_("invalid method"));
                let _ = J41(),
                    w = z.size,
                    O = M41(`${w}`),
                    $ = z.type;
                if (!q.headersList.contains("range", !0)) {
                    let H = vxA(z);
                    _.statusText = "OK", _.body = H[0], _.headersList.set("content-length", O, !0), _.headersList.set("content-type", $, !0)
                } else {
                    _.rangeRequested = !0;
                    let H = q.headersList.get("range", !0),
                        j = PBK(H, !0);
                    if (j === "failure") return Promise.resolve(h_("failed to fetch the data URL"));
                    let {
                        rangeStartValue: J,
                        rangeEndValue: M
                    } = j;
                    if (J === null) J = w - M, M = J + M - 1;
                    else {
                        if (J >= w) return Promise.resolve(h_("Range start is greater than the blob's size."));
                        if (M === null || M >= w) M = w - 1
                    }
                    let D = z.slice(J, M, $),
                        X = vxA(D);
                    _.body = X[0];
                    let P = M41(`${D.size}`),
                        W = WBK(J, M, w);
                    _.status = 206, _.statusText = "Partial Content", _.headersList.set("content-length", P, !0), _.headersList.set("content-type", $, !0), _.headersList.set("content-range", W, !0)
                }
                return Promise.resolve(_)
            }
            case "data:": {
                let Y = ju(q),
                    z = hBK(Y);
                if (z === "failure") return Promise.resolve(h_("failed to fetch the data URL"));
                let _ = SBK(z.mimeType);
                return Promise.resolve(J41({
                    statusText: "OK",
                    headersList: [
                        ["content-type", {
                            name: "Content-Type",
                            value: _
                        }]
                    ],
                    body: Ha1(z.body)[0]
                }))
            }
            case "file:":
                return Promise.resolve(h_("not implemented... yet..."));
            case "http:":
            case "https:":
                return CxA(A).catch((Y) => h_(Y));
            default:
                return Promise.resolve(h_("unknown scheme"))
        }
    }

    function FBK(A, q) {
        if (A.request.done = !0, A.processResponseDone != null) queueMicrotask(() => A.processResponseDone(q))
    }

    function _a1(A, q) {
        let K = A.timingInfo,
            Y = () => {
                let _ = Date.now();
                if (A.request.destination === "document") A.controller.fullTimingInfo = K;
                A.controller.reportTimingSteps = () => {
                    if (A.request.url.protocol !== "https:") return;
                    K.endTime = _;
                    let {
                        cacheState: O,
                        bodyInfo: $
                    } = q;
                    if (!q.timingAllowPassed) K = Oa1(K), O = "";
                    let H = 0;
                    if (A.request.mode !== "navigator" || !q.hasCrossOriginRedirects) {
                        H = q.status;
                        let j = GBK(q.headersList);
                        if (j !== "failure") $.contentType = CBK(j)
                    }
                    if (A.request.initiatorType != null) RxA(K, A.request.url.href, A.request.initiatorType, globalThis, O, $, H)
                };
                let w = () => {
                    if (A.request.done = !0, A.processResponseEndOfBody != null) queueMicrotask(() => A.processResponseEndOfBody(q));
                    if (A.request.initiatorType != null) A.controller.reportTimingSteps()
                };
                queueMicrotask(() => w())
            };
        if (A.processResponse != null) queueMicrotask(() => {
            A.processResponse(q), A.processResponse = null
        });
        let z = q.type === "error" ? q : q.internalResponse ?? q;
        if (z.body == null) Y();
        else yBK(z.body.stream, () => {
            Y()
        })
    }
    async function CxA(A) {
        let q = A.request,
            K = null,
            Y = null,
            z = A.timingInfo;
        if (q.serviceWorkers === "all");
        if (K === null) {
            if (q.redirect === "follow") q.serviceWorkers = "none";
            if (Y = K = await IxA(A), q.responseTainting === "cors" && zBK(q, K) === "failure") return h_("cors failure");
            if (tmK(q, K) === "failure") q.timingAllowFailed = !0
        }
        if ((q.responseTainting === "opaque" || K.type === "opaque") && _BK(q.origin, q.client, q.destination, Y) === "blocked") return h_("blocked");
        if (ExA.has(Y.status)) {
            if (q.redirect !== "manual") A.controller.connection.destroy(void 0, !1);
            if (q.redirect === "error") K = h_("unexpected redirect");
            else if (q.redirect === "manual") K = Y;
            else if (q.redirect === "follow") K = await pBK(A, K);
            else U76(!1)
        }
        return K.timingInfo = z, K
    }

    function pBK(A, q) {
        let K = A.request,
            Y = q.internalResponse ? q.internalResponse : q,
            z;
        try {
            if (z = ABK(Y, ju(K).hash), z == null) return q
        } catch (w) {
            return Promise.resolve(h_(w))
        }
        if (!$a1(z)) return Promise.resolve(h_("URL scheme must be a HTTP(S) scheme"));
        if (K.redirectCount === 20) return Promise.resolve(h_("redirect count exceeded"));
        if (K.redirectCount += 1, K.mode === "cors" && (z.username || z.password) && !wa1(K, z)) return Promise.resolve(h_('cross origin not allowed for request mode "cors"'));
        if (K.responseTainting === "cors" && (z.username || z.password)) return Promise.resolve(h_('URL cannot contain credentials for request mode "cors"'));
        if (Y.status !== 303 && K.body != null && K.body.source == null) return Promise.resolve(h_());
        if ([301, 302].includes(Y.status) && K.method === "POST" || Y.status === 303 && !uBK.includes(K.method)) {
            K.method = "GET", K.body = null;
            for (let w of vBK) K.headersList.delete(w)
        }
        if (!wa1(ju(K), z)) K.headersList.delete("authorization", !0), K.headersList.delete("proxy-authorization", !0), K.headersList.delete("cookie", !0), K.headersList.delete("host", !0);
        if (K.body != null) U76(K.body.source != null), K.body = Ha1(K.body.source)[0];
        let _ = A.timingInfo;
        if (_.redirectEndTime = _.postRedirectStartTime = Mh6(A.crossOriginIsolatedCapability), _.redirectStartTime === 0) _.redirectStartTime = _.startTime;
        return K.urlList.push(z), qBK(K, Y), SxA(A, !0)
    }
    async function IxA(A, q = !1, K = !1) {
        let Y = A.request,
            z = null,
            _ = null,
            w = null,
            O = null,
            $ = !1;
        if (Y.window === "no-window" && Y.redirect === "error") z = A, _ = Y;
        else _ = nmK(Y), z = {
            ...A
        }, z.request = _;
        let H = Y.credentials === "include" || Y.credentials === "same-origin" && Y.responseTainting === "basic",
            j = _.body ? _.body.length : null,
            J = null;
        if (_.body == null && ["POST", "PUT"].includes(_.method)) J = "0";
        if (j != null) J = M41(`${j}`);
        if (J != null) _.headersList.append("content-length", J, !0);
        if (j != null && _.keepalive);
        if (_.referrer instanceof URL) _.headersList.append("referer", M41(_.referrer.href), !0);
        if (emK(_), YBK(_), !_.headersList.contains("user-agent", !0)) _.headersList.append("user-agent", mBK);
        if (_.cache === "default" && (_.headersList.contains("if-modified-since", !0) || _.headersList.contains("if-none-match", !0) || _.headersList.contains("if-unmodified-since", !0) || _.headersList.contains("if-match", !0) || _.headersList.contains("if-range", !0))) _.cache = "no-store";
        if (_.cache === "no-cache" && !_.preventNoCacheCacheControlHeaderModification && !_.headersList.contains("cache-control", !0)) _.headersList.append("cache-control", "max-age=0", !0);
        if (_.cache === "no-store" || _.cache === "reload") {
            if (!_.headersList.contains("pragma", !0)) _.headersList.append("pragma", "no-cache", !0);
            if (!_.headersList.contains("cache-control", !0)) _.headersList.append("cache-control", "no-cache", !0)
        }
        if (_.headersList.contains("range", !0)) _.headersList.append("accept-encoding", "identity", !0);
        if (!_.headersList.contains("accept-encoding", !0))
            if (DBK(ju(_))) _.headersList.append("accept-encoding", "br, gzip, deflate", !0);
            else _.headersList.append("accept-encoding", "gzip, deflate", !0);
        if (_.headersList.delete("host", !0), O == null) _.cache = "no-store";
        if (_.cache !== "no-store" && _.cache !== "reload");
        if (w == null) {
            if (_.cache === "only-if-cached") return h_("only if cached");
            let M = await QBK(z, H, K);
            if (!TBK.has(_.method) && M.status >= 200 && M.status <= 399);
            if ($ && M.status === 304);
            if (w == null) w = M
        }
        if (w.urlList = [..._.urlList], _.headersList.contains("range", !0)) w.rangeRequested = !0;
        if (w.requestIncludesCredentials = H, w.status === 407) {
            if (Y.window === "no-window") return h_();
            if (Q76(A)) return j41(A);
            return h_("proxy authentication required")
        }
        if (w.status === 421 && !K && (Y.body == null || Y.body.source != null)) {
            if (Q76(A)) return j41(A);
            A.controller.connection.destroy(), w = await IxA(A, q, !0)
        }
        return w
    }
    async function QBK(A, q = !1, K = !1) {
        U76(!A.controller.connection || A.controller.connection.destroyed), A.controller.connection = {
            abort: null,
            destroyed: !1,
            destroy(X, P = !0) {
                if (!this.destroyed) {
                    if (this.destroyed = !0, P) this.abort?.(X ?? new DOMException("The operation was aborted.", "AbortError"))
                }
            }
        };
        let Y = A.request,
            z = null,
            _ = A.timingInfo;
        if (!0) Y.cache = "no-store";
        let O = K ? "yes" : "no";
        if (Y.mode === "websocket");
        let $ = null;
        if (Y.body == null && A.processRequestEndOfBody) queueMicrotask(() => A.processRequestEndOfBody());
        else if (Y.body != null) {
            let X = async function*(Z) {
                if (Q76(A)) return;
                yield Z, A.processRequestBodyChunkLength?.(Z.byteLength)
            }, P = () => {
                if (Q76(A)) return;
                if (A.processRequestEndOfBody) A.processRequestEndOfBody()
            }, W = (Z) => {
                if (Q76(A)) return;
                if (Z.name === "AbortError") A.controller.abort();
                else A.controller.terminate(Z)
            };
            $ = async function*() {
                try {
                    for await (let Z of Y.body.stream) yield* X(Z);
                    P()
                } catch (Z) {
                    W(Z)
                }
            }()
        }
        try {
            let {
                body: X,
                status: P,
                statusText: W,
                headersList: Z,
                socket: G
            } = await D({
                body: $
            });
            if (G) z = J41({
                status: P,
                statusText: W,
                headersList: Z,
                socket: G
            });
            else {
                let f = X[Symbol.asyncIterator]();
                A.controller.next = () => f.next(), z = J41({
                    status: P,
                    statusText: W,
                    headersList: Z
                })
            }
        } catch (X) {
            if (X.name === "AbortError") return A.controller.connection.destroy(), j41(A, X);
            return h_(X)
        }
        let H = async () => {
            await A.controller.resume()
        }, j = (X) => {
            if (!Q76(A)) A.controller.abort(X)
        }, J = new ReadableStream({
            async start(X) {
                A.controller.controller = X
            },
            async pull(X) {
                await H(X)
            },
            async cancel(X) {
                await j(X)
            },
            type: "bytes"
        });
        z.body = {
            stream: J,
            source: null,
            length: null
        }, A.controller.onAborted = M, A.controller.on("terminated", M), A.controller.resume = async () => {
            while (!0) {
                let X, P;
                try {
                    let {
                        done: Z,
                        value: G
                    } = await A.controller.next();
                    if (TxA(A)) break;
                    X = Z ? void 0 : G
                } catch (Z) {
                    if (A.controller.ended && !_.encodedBodySize) X = void 0;
                    else X = Z, P = !0
                }
                if (X === void 0) {
                    JBK(A.controller.controller), FBK(A, z);
                    return
                }
                if (_.decodedBodySize += X?.byteLength ?? 0, P) {
                    A.controller.terminate(X);
                    return
                }
                let W = new Uint8Array(X);
                if (W.byteLength) A.controller.controller.enqueue(W);
                if (RBK(J)) {
                    A.controller.terminate();
                    return
                }
                if (A.controller.controller.desiredSize <= 0) return
            }
        };

        function M(X) {
            if (TxA(A)) {
                if (z.aborted = !0, D41(J)) A.controller.controller.error(A.controller.serializedAbortReason)
            } else if (D41(J)) A.controller.controller.error(TypeError("terminated", {
                cause: HBK(X) ? X : void 0
            }));
            A.controller.connection.destroy()
        }
        return z;

        function D({
            body: X
        }) {
            let P = ju(Y),
                W = A.controller.dispatcher;
            return new Promise((Z, G) => W.dispatch({
                path: P.pathname + P.search,
                origin: P.origin,
                method: Y.method,
                body: W.isMockActive ? Y.body && (Y.body.source || Y.body.stream) : X,
                headers: Y.headersList.entries,
                maxRedirections: 0,
                upgrade: Y.mode === "websocket" ? "websocket" : void 0
            }, {
                body: null,
                abort: null,
                onConnect(f) {
                    let {
                        connection: v
                    } = A.controller;
                    if (_.finalConnectionTimingInfo = XBK(void 0, _.postRedirectStartTime, A.crossOriginIsolatedCapability), v.destroyed) f(new DOMException("The operation was aborted.", "AbortError"));
                    else A.controller.on("terminated", f), this.abort = v.abort = f;
                    _.finalNetworkRequestStartTime = Mh6(A.crossOriginIsolatedCapability)
                },
                onResponseStarted() {
                    _.finalNetworkResponseStartTime = Mh6(A.crossOriginIsolatedCapability)
                },
                onHeaders(f, v, N, V) {
                    if (f < 200) return;
                    let L = [],
                        h = "",
                        R = new fxA;
                    for (let b = 0; b < v.length; b += 2) R.append(NxA(v[b]), v[b + 1].toString("latin1"), !0);
                    let u = R.get("content-encoding", !0);
                    if (u) L = u.toLowerCase().split(",").map((b) => b.trim());
                    h = R.get("location", !0), this.body = new kBK({
                        read: N
                    });
                    let I = [],
                        g = h && Y.redirect === "follow" && ExA.has(f);
                    if (L.length !== 0 && Y.method !== "HEAD" && Y.method !== "CONNECT" && !yxA.includes(f) && !g)
                        for (let b = L.length - 1; b >= 0; --b) {
                            let p = L[b];
                            if (p === "x-gzip" || p === "gzip") I.push(br.createGunzip({
                                flush: br.constants.Z_SYNC_FLUSH,
                                finishFlush: br.constants.Z_SYNC_FLUSH
                            }));
                            else if (p === "deflate") I.push(ZBK({
                                flush: br.constants.Z_SYNC_FLUSH,
                                finishFlush: br.constants.Z_SYNC_FLUSH
                            }));
                            else if (p === "br") I.push(br.createBrotliDecompress({
                                flush: br.constants.BROTLI_OPERATION_FLUSH,
                                finishFlush: br.constants.BROTLI_OPERATION_FLUSH
                            }));
                            else {
                                I.length = 0;
                                break
                            }
                        }
                    let B = this.onError.bind(this);
                    return Z({
                        status: f,
                        statusText: V,
                        headersList: R,
                        body: I.length ? EBK(this.body, ...I, (b) => {
                            if (b) this.onError(b)
                        }).on("error", B) : this.body.on("error", B)
                    }), !0
                },
                onData(f) {
                    if (A.controller.dump) return;
                    let v = f;
                    return _.encodedBodySize += v.byteLength, this.body.push(v)
                },
                onComplete() {
                    if (this.abort) A.controller.off("terminated", this.abort);
                    if (A.controller.onAborted) A.controller.off("terminated", A.controller.onAborted);
                    A.controller.ended = !0, this.body.push(null)
                },
                onError(f) {
                    if (this.abort) A.controller.off("terminated", this.abort);
                    this.body?.destroy(f), A.controller.terminate(f), G(f)
                },
                onUpgrade(f, v, N) {
                    if (f !== 101) return;
                    let V = new fxA;
                    for (let L = 0; L < v.length; L += 2) V.append(NxA(v[L]), v[L + 1].toString("latin1"), !0);
                    return Z({
                        status: f,
                        statusText: xBK[f],
                        headersList: V,
                        socket: N
                    }), !0
                }
            }))
        }
    }
    bxA.exports = {
        fetch: gBK,
        Fetch: ja1,
        fetching: hxA,
        finalizeAndReportTiming: LxA
    }
})
// @from(Ln 59761, Col 4)
Ja1 = x((VO_, xxA) => {
    xxA.exports = {
        kState: Symbol("FileReader state"),
        kResult: Symbol("FileReader result"),
        kError: Symbol("FileReader error"),
        kLastProgressEventFired: Symbol("FileReader last progress event fired timestamp"),
        kEvents: Symbol("FileReader events"),
        kAborted: Symbol("FileReader aborted")
    }
})
// @from(Ln 59771, Col 4)
mxA = x((kO_, uxA) => {
    var {
        webidl: mV
    } = vP(), X41 = Symbol("ProgressEvent state");
    class Xh6 extends Event {
        constructor(A, q = {}) {
            A = mV.converters.DOMString(A, "ProgressEvent constructor", "type"), q = mV.converters.ProgressEventInit(q ?? {});
            super(A, q);
            this[X41] = {
                lengthComputable: q.lengthComputable,
                loaded: q.loaded,
                total: q.total
            }
        }
        get lengthComputable() {
            return mV.brandCheck(this, Xh6), this[X41].lengthComputable
        }
        get loaded() {
            return mV.brandCheck(this, Xh6), this[X41].loaded
        }
        get total() {
            return mV.brandCheck(this, Xh6), this[X41].total
        }
    }
    mV.converters.ProgressEventInit = mV.dictionaryConverter([{
        key: "lengthComputable",
        converter: mV.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "loaded",
        converter: mV.converters["unsigned long long"],
        defaultValue: () => 0
    }, {
        key: "total",
        converter: mV.converters["unsigned long long"],
        defaultValue: () => 0
    }, {
        key: "bubbles",
        converter: mV.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "cancelable",
        converter: mV.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "composed",
        converter: mV.converters.boolean,
        defaultValue: () => !1
    }]);
    uxA.exports = {
        ProgressEvent: Xh6
    }
})
// @from(Ln 59824, Col 4)
gxA = x((EO_, BxA) => {
    function UBK(A) {
        if (!A) return "failure";
        switch (A.trim().toLowerCase()) {
            case "unicode-1-1-utf-8":
            case "unicode11utf8":
            case "unicode20utf8":
            case "utf-8":
            case "utf8":
            case "x-unicode20utf8":
                return "UTF-8";
            case "866":
            case "cp866":
            case "csibm866":
            case "ibm866":
                return "IBM866";
            case "csisolatin2":
            case "iso-8859-2":
            case "iso-ir-101":
            case "iso8859-2":
            case "iso88592":
            case "iso_8859-2":
            case "iso_8859-2:1987":
            case "l2":
            case "latin2":
                return "ISO-8859-2";
            case "csisolatin3":
            case "iso-8859-3":
            case "iso-ir-109":
            case "iso8859-3":
            case "iso88593":
            case "iso_8859-3":
            case "iso_8859-3:1988":
            case "l3":
            case "latin3":
                return "ISO-8859-3";
            case "csisolatin4":
            case "iso-8859-4":
            case "iso-ir-110":
            case "iso8859-4":
            case "iso88594":
            case "iso_8859-4":
            case "iso_8859-4:1988":
            case "l4":
            case "latin4":
                return "ISO-8859-4";
            case "csisolatincyrillic":
            case "cyrillic":
            case "iso-8859-5":
            case "iso-ir-144":
            case "iso8859-5":
            case "iso88595":
            case "iso_8859-5":
            case "iso_8859-5:1988":
                return "ISO-8859-5";
            case "arabic":
            case "asmo-708":
            case "csiso88596e":
            case "csiso88596i":
            case "csisolatinarabic":
            case "ecma-114":
            case "iso-8859-6":
            case "iso-8859-6-e":
            case "iso-8859-6-i":
            case "iso-ir-127":
            case "iso8859-6":
            case "iso88596":
            case "iso_8859-6":
            case "iso_8859-6:1987":
                return "ISO-8859-6";
            case "csisolatingreek":
            case "ecma-118":
            case "elot_928":
            case "greek":
            case "greek8":
            case "iso-8859-7":
            case "iso-ir-126":
            case "iso8859-7":
            case "iso88597":
            case "iso_8859-7":
            case "iso_8859-7:1987":
            case "sun_eu_greek":
                return "ISO-8859-7";
            case "csiso88598e":
            case "csisolatinhebrew":
            case "hebrew":
            case "iso-8859-8":
            case "iso-8859-8-e":
            case "iso-ir-138":
            case "iso8859-8":
            case "iso88598":
            case "iso_8859-8":
            case "iso_8859-8:1988":
            case "visual":
                return "ISO-8859-8";
            case "csiso88598i":
            case "iso-8859-8-i":
            case "logical":
                return "ISO-8859-8-I";
            case "csisolatin6":
            case "iso-8859-10":
            case "iso-ir-157":
            case "iso8859-10":
            case "iso885910":
            case "l6":
            case "latin6":
                return "ISO-8859-10";
            case "iso-8859-13":
            case "iso8859-13":
            case "iso885913":
                return "ISO-8859-13";
            case "iso-8859-14":
            case "iso8859-14":
            case "iso885914":
                return "ISO-8859-14";
            case "csisolatin9":
            case "iso-8859-15":
            case "iso8859-15":
            case "iso885915":
            case "iso_8859-15":
            case "l9":
                return "ISO-8859-15";
            case "iso-8859-16":
                return "ISO-8859-16";
            case "cskoi8r":
            case "koi":
            case "koi8":
            case "koi8-r":
            case "koi8_r":
                return "KOI8-R";
            case "koi8-ru":
            case "koi8-u":
                return "KOI8-U";
            case "csmacintosh":
            case "mac":
            case "macintosh":
            case "x-mac-roman":
                return "macintosh";
            case "iso-8859-11":
            case "iso8859-11":
            case "iso885911":
            case "tis-620":
            case "windows-874":
                return "windows-874";
            case "cp1250":
            case "windows-1250":
            case "x-cp1250":
                return "windows-1250";
            case "cp1251":
            case "windows-1251":
            case "x-cp1251":
                return "windows-1251";
            case "ansi_x3.4-1968":
            case "ascii":
            case "cp1252":
            case "cp819":
            case "csisolatin1":
            case "ibm819":
            case "iso-8859-1":
            case "iso-ir-100":
            case "iso8859-1":
            case "iso88591":
            case "iso_8859-1":
            case "iso_8859-1:1987":
            case "l1":
            case "latin1":
            case "us-ascii":
            case "windows-1252":
            case "x-cp1252":
                return "windows-1252";
            case "cp1253":
            case "windows-1253":
            case "x-cp1253":
                return "windows-1253";
            case "cp1254":
            case "csisolatin5":
            case "iso-8859-9":
            case "iso-ir-148":
            case "iso8859-9":
            case "iso88599":
            case "iso_8859-9":
            case "iso_8859-9:1989":
            case "l5":
            case "latin5":
            case "windows-1254":
            case "x-cp1254":
                return "windows-1254";
            case "cp1255":
            case "windows-1255":
            case "x-cp1255":
                return "windows-1255";
            case "cp1256":
            case "windows-1256":
            case "x-cp1256":
                return "windows-1256";
            case "cp1257":
            case "windows-1257":
            case "x-cp1257":
                return "windows-1257";
            case "cp1258":
            case "windows-1258":
            case "x-cp1258":
                return "windows-1258";
            case "x-mac-cyrillic":
            case "x-mac-ukrainian":
                return "x-mac-cyrillic";
            case "chinese":
            case "csgb2312":
            case "csiso58gb231280":
            case "gb2312":
            case "gb_2312":
            case "gb_2312-80":
            case "gbk":
            case "iso-ir-58":
            case "x-gbk":
                return "GBK";
            case "gb18030":
                return "gb18030";
            case "big5":
            case "big5-hkscs":
            case "cn-big5":
            case "csbig5":
            case "x-x-big5":
                return "Big5";
            case "cseucpkdfmtjapanese":
            case "euc-jp":
            case "x-euc-jp":
                return "EUC-JP";
            case "csiso2022jp":
            case "iso-2022-jp":
                return "ISO-2022-JP";
            case "csshiftjis":
            case "ms932":
            case "ms_kanji":
            case "shift-jis":
            case "shift_jis":
            case "sjis":
            case "windows-31j":
            case "x-sjis":
                return "Shift_JIS";
            case "cseuckr":
            case "csksc56011987":
            case "euc-kr":
            case "iso-ir-149":
            case "korean":
            case "ks_c_5601-1987":
            case "ks_c_5601-1989":
            case "ksc5601":
            case "ksc_5601":
            case "windows-949":
                return "EUC-KR";
            case "csiso2022kr":
            case "hz-gb-2312":
            case "iso-2022-cn":
            case "iso-2022-cn-ext":
            case "iso-2022-kr":
            case "replacement":
                return "replacement";
            case "unicodefffe":
            case "utf-16be":
                return "UTF-16BE";
            case "csunicode":
            case "iso-10646-ucs-2":
            case "ucs-2":
            case "unicode":
            case "unicodefeff":
            case "utf-16":
            case "utf-16le":
                return "UTF-16LE";
            case "x-user-defined":
                return "x-user-defined";
            default:
                return "failure"
        }
    }
    BxA.exports = {
        getEncoding: UBK
    }
})