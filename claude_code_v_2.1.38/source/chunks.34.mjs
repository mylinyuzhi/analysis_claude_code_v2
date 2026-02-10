
// @from(Ln 88079, Col 4)
Nx8 = R((R72, Vx8) => {
    var {
        kClients: aA1
    } = h$(), l$3 = x$1(), {
        kAgent: ar6,
        kMockAgentSet: f66,
        kMockAgentGet: Gx8,
        kDispatches: sr6,
        kIsMockActive: V66,
        kNetConnect: sA1,
        kGetNetConnect: i$3,
        kOptions: N66,
        kFactory: T66
    } = g$1(), n$3 = nr6(), r$3 = or6(), {
        matchValue: o$3,
        buildMockOptions: a$3
    } = nk1(), {
        InvalidArgumentError: Zx8,
        UndiciError: s$3
    } = Lz(), t$3 = Mk1(), e$3 = Mx8(), AO3 = Wx8();
    class fx8 extends t$3 {
        constructor(A) {
            super(A);
            if (this[sA1] = !0, this[V66] = !0, A?.agent && typeof A.agent.dispatch !== "function") throw new Zx8("Argument opts.agent must implement Agent");
            let q = A?.agent ? A.agent : new l$3(A);
            this[ar6] = q, this[aA1] = q[aA1], this[N66] = a$3(A)
        }
        get(A) {
            let q = this[Gx8](A);
            if (!q) q = this[T66](A), this[f66](A, q);
            return q
        }
        dispatch(A, q) {
            return this.get(A.origin), this[ar6].dispatch(A, q)
        }
        async close() {
            await this[ar6].close(), this[aA1].clear()
        }
        deactivate() {
            this[V66] = !1
        }
        activate() {
            this[V66] = !0
        }
        enableNetConnect(A) {
            if (typeof A === "string" || typeof A === "function" || A instanceof RegExp)
                if (Array.isArray(this[sA1])) this[sA1].push(A);
                else this[sA1] = [A];
            else if (typeof A > "u") this[sA1] = !0;
            else throw new Zx8("Unsupported matcher. Must be one of String|Function|RegExp.")
        }
        disableNetConnect() {
            this[sA1] = !1
        }
        get isMockActive() {
            return this[V66]
        } [f66](A, q) {
            this[aA1].set(A, q)
        } [T66](A) {
            let q = Object.assign({
                agent: this
            }, this[N66]);
            return this[N66] && this[N66].connections === 1 ? new n$3(A, q) : new r$3(A, q)
        } [Gx8](A) {
            let q = this[aA1].get(A);
            if (q) return q;
            if (typeof A !== "string") {
                let K = this[T66]("http://localhost:9999");
                return this[f66](A, K), K
            }
            for (let [K, Y] of Array.from(this[aA1]))
                if (Y && typeof K !== "string" && o$3(K, A)) {
                    let z = this[T66](A);
                    return this[f66](A, z), z[sr6] = Y[sr6], z
                }
        } [i$3]() {
            return this[sA1]
        }
        pendingInterceptors() {
            let A = this[aA1];
            return Array.from(A.entries()).flatMap(([q, K]) => K[sr6].map((Y) => ({
                ...Y,
                origin: q
            }))).filter(({
                pending: q
            }) => q)
        }
        assertNoPendingInterceptors({
            pendingInterceptorsFormatter: A = new AO3
        } = {}) {
            let q = this.pendingInterceptors();
            if (q.length === 0) return;
            let K = new e$3("interceptor", "interceptors").pluralize(q.length);
            throw new s$3(`
${K.count} ${K.noun} ${K.is} pending:

${A.format(q)}
`.trim())
        }
    }
    Vx8.exports = fx8
})
// @from(Ln 88181, Col 4)
v66 = R((y72, kx8) => {
    var Tx8 = Symbol.for("undici.globalDispatcher.1"),
        {
            InvalidArgumentError: qO3
        } = Lz(),
        KO3 = x$1();
    if (Ex8() === void 0) vx8(new KO3);

    function vx8(A) {
        if (!A || typeof A.dispatch !== "function") throw new qO3("Argument agent must implement Agent");
        Object.defineProperty(globalThis, Tx8, {
            value: A,
            writable: !0,
            enumerable: !1,
            configurable: !1
        })
    }

    function Ex8() {
        return globalThis[Tx8]
    }
    kx8.exports = {
        setGlobalDispatcher: vx8,
        getGlobalDispatcher: Ex8
    }
})
// @from(Ln 88207, Col 4)
E66 = R((C72, Lx8) => {
    Lx8.exports = class {
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
// @from(Ln 88240, Col 4)
yx8 = R((S72, Rx8) => {
    var YO3 = z66();
    Rx8.exports = (A) => {
        let q = A?.maxRedirections;
        return (K) => {
            return function(z, w) {
                let {
                    maxRedirections: H = q,
                    ...$
                } = z;
                if (!H) return K(z, w);
                let O = new YO3(K, H, z, w);
                return K($, O)
            }
        }
    }
})
// @from(Ln 88257, Col 4)
Sx8 = R((h72, Cx8) => {
    var zO3 = M66();
    Cx8.exports = (A) => {
        return (q) => {
            return function(Y, z) {
                return q(Y, new zO3({
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
// @from(Ln 88276, Col 4)
xx8 = R((I72, Ix8) => {
    var wO3 = W9(),
        {
            InvalidArgumentError: HO3,
            RequestAbortedError: $O3
        } = Lz(),
        OO3 = E66();
    class hx8 extends OO3 {
        #A = 1048576;
        #q = null;
        #K = !1;
        #z = !1;
        #Y = 0;
        #$ = null;
        #w = null;
        constructor({
            maxSize: A
        }, q) {
            super(q);
            if (A != null && (!Number.isFinite(A) || A < 1)) throw new HO3("maxSize must be a number greater than 0");
            this.#A = A ?? this.#A, this.#w = q
        }
        onConnect(A) {
            this.#q = A, this.#w.onConnect(this.#_.bind(this))
        }
        #_(A) {
            this.#z = !0, this.#$ = A
        }
        onHeaders(A, q, K, Y) {
            let w = wO3.parseHeaders(q)["content-length"];
            if (w != null && w > this.#A) throw new $O3(`Response size (${w}) larger than maxSize (${this.#A})`);
            if (this.#z) return !0;
            return this.#w.onHeaders(A, q, K, Y)
        }
        onError(A) {
            if (this.#K) return;
            A = this.#$ ?? A, this.#w.onError(A)
        }
        onData(A) {
            if (this.#Y = this.#Y + A.length, this.#Y >= this.#A)
                if (this.#K = !0, this.#z) this.#w.onError(this.#$);
                else this.#w.onComplete([]);
            return !0
        }
        onComplete(A) {
            if (this.#K) return;
            if (this.#z) {
                this.#w.onError(this.reason);
                return
            }
            this.#w.onComplete(A)
        }
    }

    function _O3({
        maxSize: A
    } = {
        maxSize: 1048576
    }) {
        return (q) => {
            return function(Y, z) {
                let {
                    dumpMaxSize: w = A
                } = Y, H = new hx8({
                    maxSize: w
                }, z);
                return q(Y, H)
            }
        }
    }
    Ix8.exports = _O3
})
// @from(Ln 88348, Col 4)
Fx8 = R((x72, mx8) => {
    var {
        isIP: JO3
    } = h1("node:net"), {
        lookup: XO3
    } = h1("node:dns"), DO3 = E66(), {
        InvalidArgumentError: U$1,
        InformationalError: jO3
    } = Lz(), bx8 = Math.pow(2, 31) - 1;
    class ux8 {
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
            if (Y == null) this.lookup(A, z, (w, H) => {
                if (w || H == null || H.length === 0) {
                    K(w ?? new jO3("No DNS entries found"));
                    return
                }
                this.setRecords(A, H);
                let $ = this.#K.get(A.hostname),
                    O = this.pick(A, $, z.affinity),
                    _;
                if (typeof O.port === "number") _ = `:${O.port}`;
                else if (A.port !== "") _ = `:${A.port}`;
                else _ = "";
                K(null, `${A.protocol}//${O.family===6?`[${O.address}]`:O.address}${_}`)
            });
            else {
                let w = this.pick(A, Y, z.affinity);
                if (w == null) {
                    this.#K.delete(A.hostname), this.runLookup(A, q, K);
                    return
                }
                let H;
                if (typeof w.port === "number") H = `:${w.port}`;
                else if (A.port !== "") H = `:${A.port}`;
                else H = "";
                K(null, `${A.protocol}//${w.family===6?`[${w.address}]`:w.address}${H}`)
            }
        }
        #z(A, q, K) {
            XO3(A.hostname, {
                all: !0,
                family: this.dualStack === !1 ? this.affinity : 0,
                order: "ipv4first"
            }, (Y, z) => {
                if (Y) return K(Y);
                let w = new Map;
                for (let H of z) w.set(`${H.address}:${H.family}`, H);
                K(null, w.values())
            })
        }
        #Y(A, q, K) {
            let Y = null,
                {
                    records: z,
                    offset: w
                } = q,
                H;
            if (this.dualStack) {
                if (K == null)
                    if (w == null || w === bx8) q.offset = 0, K = 4;
                    else q.offset++, K = (q.offset & 1) === 1 ? 6 : 4;
                if (z[K] != null && z[K].ips.length > 0) H = z[K];
                else H = z[K === 4 ? 6 : 4]
            } else H = z[K];
            if (H == null || H.ips.length === 0) return Y;
            if (H.offset == null || H.offset === bx8) H.offset = 0;
            else H.offset++;
            let $ = H.offset % H.ips.length;
            if (Y = H.ips[$] ?? null, Y == null) return Y;
            if (Date.now() - Y.timestamp > Y.ttl) return H.ips.splice($, 1), this.pick(A, q, K);
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
                let w = Y.records[z.family] ?? {
                    ips: []
                };
                w.ips.push(z), Y.records[z.family] = w
            }
            this.#K.set(A.hostname, Y)
        }
        getHandler(A, q) {
            return new Bx8(this, A, q)
        }
    }
    class Bx8 extends DO3 {
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
    mx8.exports = (A) => {
        if (A?.maxTTL != null && (typeof A?.maxTTL !== "number" || A?.maxTTL < 0)) throw new U$1("Invalid maxTTL. Must be a positive number");
        if (A?.maxItems != null && (typeof A?.maxItems !== "number" || A?.maxItems < 1)) throw new U$1("Invalid maxItems. Must be a positive number and greater than zero");
        if (A?.affinity != null && A?.affinity !== 4 && A?.affinity !== 6) throw new U$1("Invalid affinity. Must be either 4 or 6");
        if (A?.dualStack != null && typeof A?.dualStack !== "boolean") throw new U$1("Invalid dualStack. Must be a boolean");
        if (A?.lookup != null && typeof A?.lookup !== "function") throw new U$1("Invalid lookup. Must be a function");
        if (A?.pick != null && typeof A?.pick !== "function") throw new U$1("Invalid pick. Must be a function");
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
            z = new ux8(Y);
        return (w) => {
            return function($, O) {
                let _ = $.origin.constructor === URL ? $.origin : new URL($.origin);
                if (JO3(_.hostname) !== 0) return w($, O);
                return z.runLookup(_, $, (J, X) => {
                    if (J) return O.onError(J);
                    let D = null;
                    D = {
                        ...$,
                        servername: _.hostname,
                        origin: X,
                        headers: {
                            host: _.hostname,
                            ...$.headers
                        }
                    }, w(D, z.getHandler({
                        origin: _,
                        dispatch: w,
                        handler: O
                    }, $))
                }), !0
            }
        }
    }
})
// @from(Ln 88556, Col 4)
tA1 = R((b72, lx8) => {
    var {
        kConstruct: MO3
    } = h$(), {
        kEnumerableProperty: p$1
    } = W9(), {
        iteratorMixin: PO3,
        isValidHeaderName: ok1,
        isValidHeaderValue: gx8
    } = bT(), {
        webidl: vY
    } = OM(), tr6 = h1("node:assert"), k66 = h1("node:util"), $X = Symbol("headers map"), mT = Symbol("headers map sorted");

    function Qx8(A) {
        return A === 10 || A === 13 || A === 9 || A === 32
    }

    function Ux8(A) {
        let q = 0,
            K = A.length;
        while (K > q && Qx8(A.charCodeAt(K - 1))) --K;
        while (K > q && Qx8(A.charCodeAt(q))) ++q;
        return q === 0 && K === A.length ? A : A.substring(q, K)
    }

    function px8(A, q) {
        if (Array.isArray(q))
            for (let K = 0; K < q.length; ++K) {
                let Y = q[K];
                if (Y.length !== 2) throw vY.errors.exception({
                    header: "Headers constructor",
                    message: `expected name/value pair to be length 2, found ${Y.length}.`
                });
                er6(A, Y[0], Y[1])
            } else if (typeof q === "object" && q !== null) {
                let K = Object.keys(q);
                for (let Y = 0; Y < K.length; ++Y) er6(A, K[Y], q[K[Y]])
            } else throw vY.errors.conversionFailed({
                prefix: "Headers constructor",
                argument: "Argument 1",
                types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
            })
    }

    function er6(A, q, K) {
        if (K = Ux8(K), !ok1(q)) throw vY.errors.invalidArgument({
            prefix: "Headers.append",
            value: q,
            type: "header name"
        });
        else if (!gx8(K)) throw vY.errors.invalidArgument({
            prefix: "Headers.append",
            value: K,
            type: "header value"
        });
        if (cx8(A) === "immutable") throw TypeError("immutable");
        return Ao6(A).append(q, K, !1)
    }

    function dx8(A, q) {
        return A[0] < q[0] ? -1 : 1
    }
    class L66 {
        cookies = null;
        constructor(A) {
            if (A instanceof L66) this[$X] = new Map(A[$X]), this[mT] = A[mT], this.cookies = A.cookies === null ? null : [...A.cookies];
            else this[$X] = new Map(A), this[mT] = null
        }
        contains(A, q) {
            return this[$X].has(q ? A : A.toLowerCase())
        }
        clear() {
            this[$X].clear(), this[mT] = null, this.cookies = null
        }
        append(A, q, K) {
            this[mT] = null;
            let Y = K ? A : A.toLowerCase(),
                z = this[$X].get(Y);
            if (z) {
                let w = Y === "cookie" ? "; " : ", ";
                this[$X].set(Y, {
                    name: z.name,
                    value: `${z.value}${w}${q}`
                })
            } else this[$X].set(Y, {
                name: A,
                value: q
            });
            if (Y === "set-cookie")(this.cookies ??= []).push(q)
        }
        set(A, q, K) {
            this[mT] = null;
            let Y = K ? A : A.toLowerCase();
            if (Y === "set-cookie") this.cookies = [q];
            this[$X].set(Y, {
                name: A,
                value: q
            })
        }
        delete(A, q) {
            if (this[mT] = null, !q) A = A.toLowerCase();
            if (A === "set-cookie") this.cookies = null;
            this[$X].delete(A)
        }
        get(A, q) {
            return this[$X].get(q ? A : A.toLowerCase())?.value ?? null
        }*[Symbol.iterator]() {
            for (let {
                    0: A,
                    1: {
                        value: q
                    }
                }
                of this[$X]) yield [A, q]
        }
        get entries() {
            let A = {};
            if (this[$X].size !== 0)
                for (let {
                        name: q,
                        value: K
                    }
                    of this[$X].values()) A[q] = K;
            return A
        }
        rawValues() {
            return this[$X].values()
        }
        get entriesList() {
            let A = [];
            if (this[$X].size !== 0)
                for (let {
                        0: q,
                        1: {
                            name: K,
                            value: Y
                        }
                    }
                    of this[$X])
                    if (q === "set-cookie")
                        for (let z of this.cookies) A.push([K, z]);
                    else A.push([K, Y]);
            return A
        }
        toSortedArray() {
            let A = this[$X].size,
                q = Array(A);
            if (A <= 32) {
                if (A === 0) return q;
                let K = this[$X][Symbol.iterator](),
                    Y = K.next().value;
                q[0] = [Y[0], Y[1].value], tr6(Y[1].value !== null);
                for (let z = 1, w = 0, H = 0, $ = 0, O = 0, _, J; z < A; ++z) {
                    J = K.next().value, _ = q[z] = [J[0], J[1].value], tr6(_[1] !== null), $ = 0, H = z;
                    while ($ < H)
                        if (O = $ + (H - $ >> 1), q[O][0] <= _[0]) $ = O + 1;
                        else H = O;
                    if (z !== O) {
                        w = z;
                        while (w > $) q[w] = q[--w];
                        q[$] = _
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
                    of this[$X]) q[K++] = [Y, z], tr6(z !== null);
                return q.sort(dx8)
            }
        }
    }
    class YW {
        #A;
        #q;
        constructor(A = void 0) {
            if (vY.util.markAsUncloneable(this), A === MO3) return;
            if (this.#q = new L66, this.#A = "none", A !== void 0) A = vY.converters.HeadersInit(A, "Headers contructor", "init"), px8(this, A)
        }
        append(A, q) {
            vY.brandCheck(this, YW), vY.argumentLengthCheck(arguments, 2, "Headers.append");
            let K = "Headers.append";
            return A = vY.converters.ByteString(A, K, "name"), q = vY.converters.ByteString(q, K, "value"), er6(this, A, q)
        }
        delete(A) {
            vY.brandCheck(this, YW), vY.argumentLengthCheck(arguments, 1, "Headers.delete");
            let q = "Headers.delete";
            if (A = vY.converters.ByteString(A, q, "name"), !ok1(A)) throw vY.errors.invalidArgument({
                prefix: "Headers.delete",
                value: A,
                type: "header name"
            });
            if (this.#A === "immutable") throw TypeError("immutable");
            if (!this.#q.contains(A, !1)) return;
            this.#q.delete(A, !1)
        }
        get(A) {
            vY.brandCheck(this, YW), vY.argumentLengthCheck(arguments, 1, "Headers.get");
            let q = "Headers.get";
            if (A = vY.converters.ByteString(A, q, "name"), !ok1(A)) throw vY.errors.invalidArgument({
                prefix: q,
                value: A,
                type: "header name"
            });
            return this.#q.get(A, !1)
        }
        has(A) {
            vY.brandCheck(this, YW), vY.argumentLengthCheck(arguments, 1, "Headers.has");
            let q = "Headers.has";
            if (A = vY.converters.ByteString(A, q, "name"), !ok1(A)) throw vY.errors.invalidArgument({
                prefix: q,
                value: A,
                type: "header name"
            });
            return this.#q.contains(A, !1)
        }
        set(A, q) {
            vY.brandCheck(this, YW), vY.argumentLengthCheck(arguments, 2, "Headers.set");
            let K = "Headers.set";
            if (A = vY.converters.ByteString(A, K, "name"), q = vY.converters.ByteString(q, K, "value"), q = Ux8(q), !ok1(A)) throw vY.errors.invalidArgument({
                prefix: K,
                value: A,
                type: "header name"
            });
            else if (!gx8(q)) throw vY.errors.invalidArgument({
                prefix: K,
                value: q,
                type: "header value"
            });
            if (this.#A === "immutable") throw TypeError("immutable");
            this.#q.set(A, q, !1)
        }
        getSetCookie() {
            vY.brandCheck(this, YW);
            let A = this.#q.cookies;
            if (A) return [...A];
            return []
        }
        get[mT]() {
            if (this.#q[mT]) return this.#q[mT];
            let A = [],
                q = this.#q.toSortedArray(),
                K = this.#q.cookies;
            if (K === null || K.length === 1) return this.#q[mT] = q;
            for (let Y = 0; Y < q.length; ++Y) {
                let {
                    0: z,
                    1: w
                } = q[Y];
                if (z === "set-cookie")
                    for (let H = 0; H < K.length; ++H) A.push([z, K[H]]);
                else A.push([z, w])
            }
            return this.#q[mT] = A
        } [k66.inspect.custom](A, q) {
            return q.depth ??= A, `Headers ${k66.formatWithOptions(q,this.#q.entries)}`
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
        getHeadersGuard: cx8,
        setHeadersGuard: WO3,
        getHeadersList: Ao6,
        setHeadersList: GO3
    } = YW;
    Reflect.deleteProperty(YW, "getHeadersGuard");
    Reflect.deleteProperty(YW, "setHeadersGuard");
    Reflect.deleteProperty(YW, "getHeadersList");
    Reflect.deleteProperty(YW, "setHeadersList");
    PO3("Headers", YW, mT, 0, 1);
    Object.defineProperties(YW.prototype, {
        append: p$1,
        delete: p$1,
        get: p$1,
        has: p$1,
        set: p$1,
        getSetCookie: p$1,
        [Symbol.toStringTag]: {
            value: "Headers",
            configurable: !0
        },
        [k66.inspect.custom]: {
            enumerable: !1
        }
    });
    vY.converters.HeadersInit = function(A, q, K) {
        if (vY.util.Type(A) === "Object") {
            let Y = Reflect.get(A, Symbol.iterator);
            if (!k66.types.isProxy(A) && Y === YW.prototype.entries) try {
                return Ao6(A).entriesList
            } catch {}
            if (typeof Y === "function") return vY.converters["sequence<sequence<ByteString>>"](A, q, K, Y.bind(A));
            return vY.converters["record<ByteString, ByteString>"](A, q, K)
        }
        throw vY.errors.conversionFailed({
            prefix: "Headers constructor",
            argument: "Argument 1",
            types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
        })
    };
    lx8.exports = {
        fill: px8,
        compareHeaderName: dx8,
        Headers: YW,
        HeadersList: L66,
        getHeadersGuard: cx8,
        setHeadersGuard: WO3,
        setHeadersList: GO3,
        getHeadersList: Ao6
    }
})
// @from(Ln 88884, Col 4)
sk1 = R((u72, qb8) => {
    var {
        Headers: sx8,
        HeadersList: ix8,
        fill: ZO3,
        getHeadersGuard: fO3,
        setHeadersGuard: tx8,
        setHeadersList: ex8
    } = tA1(), {
        extractBody: nx8,
        cloneBody: VO3,
        mixinBody: NO3,
        hasFinalizationRegistry: TO3,
        streamRegistry: vO3,
        bodyUnusable: EO3
    } = k$1(), qo6 = W9(), rx8 = h1("node:util"), {
        kEnumerableProperty: FT
    } = qo6, {
        isValidReasonPhrase: kO3,
        isCancelled: LO3,
        isAborted: RO3,
        isBlobLike: yO3,
        serializeJavascriptValueToJSONString: CO3,
        isErrorLike: SO3,
        isomorphicEncode: hO3,
        environmentSettingsObject: IO3
    } = bT(), {
        redirectStatusSet: xO3,
        nullBodyStatus: bO3
    } = Gk1(), {
        kState: V_,
        kHeaders: Wg
    } = ti(), {
        webidl: h5
    } = OM(), {
        FormData: uO3
    } = Tk1(), {
        URLSerializer: ox8
    } = qV(), {
        kConstruct: y66
    } = h$(), Ko6 = h1("node:assert"), {
        types: BO3
    } = h1("node:util"), mO3 = new TextEncoder("utf-8");
    class zW {
        static error() {
            return ak1(C66(), "immutable")
        }
        static json(A, q = {}) {
            if (h5.argumentLengthCheck(arguments, 1, "Response.json"), q !== null) q = h5.converters.ResponseInit(q);
            let K = mO3.encode(CO3(A)),
                Y = nx8(K),
                z = ak1(d$1({}), "response");
            return ax8(z, q, {
                body: Y[0],
                type: "application/json"
            }), z
        }
        static redirect(A, q = 302) {
            h5.argumentLengthCheck(arguments, 1, "Response.redirect"), A = h5.converters.USVString(A), q = h5.converters["unsigned short"](q);
            let K;
            try {
                K = new URL(A, IO3.settingsObject.baseUrl)
            } catch (w) {
                throw TypeError(`Failed to parse URL from ${A}`, {
                    cause: w
                })
            }
            if (!xO3.has(q)) throw RangeError(`Invalid status code ${q}`);
            let Y = ak1(d$1({}), "immutable");
            Y[V_].status = q;
            let z = hO3(ox8(K));
            return Y[V_].headersList.append("location", z, !0), Y
        }
        constructor(A = null, q = {}) {
            if (h5.util.markAsUncloneable(this), A === y66) return;
            if (A !== null) A = h5.converters.BodyInit(A);
            q = h5.converters.ResponseInit(q), this[V_] = d$1({}), this[Wg] = new sx8(y66), tx8(this[Wg], "response"), ex8(this[Wg], this[V_].headersList);
            let K = null;
            if (A != null) {
                let [Y, z] = nx8(A);
                K = {
                    body: Y,
                    type: z
                }
            }
            ax8(this, q, K)
        }
        get type() {
            return h5.brandCheck(this, zW), this[V_].type
        }
        get url() {
            h5.brandCheck(this, zW);
            let A = this[V_].urlList,
                q = A[A.length - 1] ?? null;
            if (q === null) return "";
            return ox8(q, !0)
        }
        get redirected() {
            return h5.brandCheck(this, zW), this[V_].urlList.length > 1
        }
        get status() {
            return h5.brandCheck(this, zW), this[V_].status
        }
        get ok() {
            return h5.brandCheck(this, zW), this[V_].status >= 200 && this[V_].status <= 299
        }
        get statusText() {
            return h5.brandCheck(this, zW), this[V_].statusText
        }
        get headers() {
            return h5.brandCheck(this, zW), this[Wg]
        }
        get body() {
            return h5.brandCheck(this, zW), this[V_].body ? this[V_].body.stream : null
        }
        get bodyUsed() {
            return h5.brandCheck(this, zW), !!this[V_].body && qo6.isDisturbed(this[V_].body.stream)
        }
        clone() {
            if (h5.brandCheck(this, zW), EO3(this)) throw h5.errors.exception({
                header: "Response.clone",
                message: "Body has already been consumed."
            });
            let A = Yo6(this[V_]);
            return ak1(A, fO3(this[Wg]))
        } [rx8.inspect.custom](A, q) {
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
            return `Response ${rx8.formatWithOptions(q,K)}`
        }
    }
    NO3(zW);
    Object.defineProperties(zW.prototype, {
        type: FT,
        url: FT,
        status: FT,
        ok: FT,
        redirected: FT,
        statusText: FT,
        headers: FT,
        clone: FT,
        body: FT,
        bodyUsed: FT,
        [Symbol.toStringTag]: {
            value: "Response",
            configurable: !0
        }
    });
    Object.defineProperties(zW, {
        json: FT,
        redirect: FT,
        error: FT
    });

    function Yo6(A) {
        if (A.internalResponse) return Ab8(Yo6(A.internalResponse), A.type);
        let q = d$1({
            ...A,
            body: null
        });
        if (A.body != null) q.body = VO3(q, A.body);
        return q
    }

    function d$1(A) {
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
            headersList: A?.headersList ? new ix8(A?.headersList) : new ix8,
            urlList: A?.urlList ? [...A.urlList] : []
        }
    }

    function C66(A) {
        let q = SO3(A);
        return d$1({
            type: "error",
            status: 0,
            error: q ? A : Error(A ? String(A) : A),
            aborted: A && A.name === "AbortError"
        })
    }

    function FO3(A) {
        return A.type === "error" && A.status === 0
    }

    function R66(A, q) {
        return q = {
            internalResponse: A,
            ...q
        }, new Proxy(A, {
            get(K, Y) {
                return Y in q ? q[Y] : K[Y]
            },
            set(K, Y, z) {
                return Ko6(!(Y in q)), K[Y] = z, !0
            }
        })
    }

    function Ab8(A, q) {
        if (q === "basic") return R66(A, {
            type: "basic",
            headersList: A.headersList
        });
        else if (q === "cors") return R66(A, {
            type: "cors",
            headersList: A.headersList
        });
        else if (q === "opaque") return R66(A, {
            type: "opaque",
            urlList: Object.freeze([]),
            status: 0,
            statusText: "",
            body: null
        });
        else if (q === "opaqueredirect") return R66(A, {
            type: "opaqueredirect",
            status: 0,
            statusText: "",
            headersList: [],
            body: null
        });
        else Ko6(!1)
    }

    function QO3(A, q = null) {
        return Ko6(LO3(A)), RO3(A) ? C66(Object.assign(new DOMException("The operation was aborted.", "AbortError"), {
            cause: q
        })) : C66(Object.assign(new DOMException("Request was cancelled."), {
            cause: q
        }))
    }

    function ax8(A, q, K) {
        if (q.status !== null && (q.status < 200 || q.status > 599)) throw RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
        if ("statusText" in q && q.statusText != null) {
            if (!kO3(String(q.statusText))) throw TypeError("Invalid statusText")
        }
        if ("status" in q && q.status != null) A[V_].status = q.status;
        if ("statusText" in q && q.statusText != null) A[V_].statusText = q.statusText;
        if ("headers" in q && q.headers != null) ZO3(A[Wg], q.headers);
        if (K) {
            if (bO3.includes(A.status)) throw h5.errors.exception({
                header: "Response constructor",
                message: `Invalid response status code ${A.status}`
            });
            if (A[V_].body = K.body, K.type != null && !A[V_].headersList.contains("content-type", !0)) A[V_].headersList.append("content-type", K.type, !0)
        }
    }

    function ak1(A, q) {
        let K = new zW(y66);
        if (K[V_] = A, K[Wg] = new sx8(y66), ex8(K[Wg], A.headersList), tx8(K[Wg], q), TO3 && A.body?.stream) vO3.register(K, new WeakRef(A.body.stream));
        return K
    }
    h5.converters.ReadableStream = h5.interfaceConverter(ReadableStream);
    h5.converters.FormData = h5.interfaceConverter(uO3);
    h5.converters.URLSearchParams = h5.interfaceConverter(URLSearchParams);
    h5.converters.XMLHttpRequestBodyInit = function(A, q, K) {
        if (typeof A === "string") return h5.converters.USVString(A, q, K);
        if (yO3(A)) return h5.converters.Blob(A, q, K, {
            strict: !1
        });
        if (ArrayBuffer.isView(A) || BO3.isArrayBuffer(A)) return h5.converters.BufferSource(A, q, K);
        if (qo6.isFormDataLike(A)) return h5.converters.FormData(A, q, K, {
            strict: !1
        });
        if (A instanceof URLSearchParams) return h5.converters.URLSearchParams(A, q, K);
        return h5.converters.DOMString(A, q, K)
    };
    h5.converters.BodyInit = function(A, q, K) {
        if (A instanceof ReadableStream) return h5.converters.ReadableStream(A, q, K);
        if (A?.[Symbol.asyncIterator]) return A;
        return h5.converters.XMLHttpRequestBodyInit(A, q, K)
    };
    h5.converters.ResponseInit = h5.dictionaryConverter([{
        key: "status",
        converter: h5.converters["unsigned short"],
        defaultValue: () => 200
    }, {
        key: "statusText",
        converter: h5.converters.ByteString,
        defaultValue: () => ""
    }, {
        key: "headers",
        converter: h5.converters.HeadersInit
    }]);
    qb8.exports = {
        isNetworkError: FO3,
        makeNetworkError: C66,
        makeResponse: d$1,
        makeAppropriateNetworkError: QO3,
        filterResponse: Ab8,
        Response: zW,
        cloneResponse: Yo6,
        fromInnerResponse: ak1
    }
})
// @from(Ln 89203, Col 4)
$b8 = R((B72, Hb8) => {
    var {
        kConnected: Kb8,
        kSize: Yb8
    } = h$();
    class zb8 {
        constructor(A) {
            this.value = A
        }
        deref() {
            return this.value[Kb8] === 0 && this.value[Yb8] === 0 ? void 0 : this.value
        }
    }
    class wb8 {
        constructor(A) {
            this.finalizer = A
        }
        register(A, q) {
            if (A.on) A.on("disconnect", () => {
                if (A[Kb8] === 0 && A[Yb8] === 0) this.finalizer(q)
            })
        }
        unregister(A) {}
    }
    Hb8.exports = function() {
        if (process.env.NODE_V8_COVERAGE && process.version.startsWith("v18")) return process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
            WeakRef: zb8,
            FinalizationRegistry: wb8
        };
        return {
            WeakRef,
            FinalizationRegistry
        }
    }
})
// @from(Ln 89238, Col 4)
c$1 = R((m72, Tb8) => {
    var {
        extractBody: gO3,
        mixinBody: UO3,
        cloneBody: pO3,
        bodyUnusable: Ob8
    } = k$1(), {
        Headers: Gb8,
        fill: dO3,
        HeadersList: x66,
        setHeadersGuard: wo6,
        getHeadersGuard: cO3,
        setHeadersList: Zb8,
        getHeadersList: _b8
    } = tA1(), {
        FinalizationRegistry: lO3
    } = $b8()(), h66 = W9(), Jb8 = h1("node:util"), {
        isValidHTTPToken: iO3,
        sameOrigin: Xb8,
        environmentSettingsObject: S66
    } = bT(), {
        forbiddenMethodsSet: nO3,
        corsSafeListedMethodsSet: rO3,
        referrerPolicy: oO3,
        requestRedirect: aO3,
        requestMode: sO3,
        requestCredentials: tO3,
        requestCache: eO3,
        requestDuplex: A_3
    } = Gk1(), {
        kEnumerableProperty: OX,
        normalizedMethodRecordsBase: q_3,
        normalizedMethodRecords: K_3
    } = h66, {
        kHeaders: QT,
        kSignal: I66,
        kState: pH,
        kDispatcher: zo6
    } = ti(), {
        webidl: uK
    } = OM(), {
        URLSerializer: Y_3
    } = qV(), {
        kConstruct: b66
    } = h$(), z_3 = h1("node:assert"), {
        getMaxListeners: Db8,
        setMaxListeners: jb8,
        getEventListeners: w_3,
        defaultMaxListeners: Mb8
    } = h1("node:events"), H_3 = Symbol("abortController"), fb8 = new lO3(({
        signal: A,
        abort: q
    }) => {
        A.removeEventListener("abort", q)
    }), u66 = new WeakMap;

    function Pb8(A) {
        return q;

        function q() {
            let K = A.deref();
            if (K !== void 0) {
                fb8.unregister(q), this.removeEventListener("abort", q), K.abort(this.reason);
                let Y = u66.get(K.signal);
                if (Y !== void 0) {
                    if (Y.size !== 0) {
                        for (let z of Y) {
                            let w = z.deref();
                            if (w !== void 0) w.abort(this.reason)
                        }
                        Y.clear()
                    }
                    u66.delete(K.signal)
                }
            }
        }
    }
    var Wb8 = !1;
    class Tw {
        constructor(A, q = {}) {
            if (uK.util.markAsUncloneable(this), A === b66) return;
            let K = "Request constructor";
            uK.argumentLengthCheck(arguments, 1, K), A = uK.converters.RequestInfo(A, K, "input"), q = uK.converters.RequestInit(q, K, "init");
            let Y = null,
                z = null,
                w = S66.settingsObject.baseUrl,
                H = null;
            if (typeof A === "string") {
                this[zo6] = q.dispatcher;
                let W;
                try {
                    W = new URL(A, w)
                } catch (G) {
                    throw TypeError("Failed to parse URL from " + A, {
                        cause: G
                    })
                }
                if (W.username || W.password) throw TypeError("Request cannot be constructed from a URL that includes credentials: " + A);
                Y = B66({
                    urlList: [W]
                }), z = "cors"
            } else this[zo6] = q.dispatcher || A[zo6], z_3(A instanceof Tw), Y = A[pH], H = A[I66];
            let $ = S66.settingsObject.origin,
                O = "client";
            if (Y.window?.constructor?.name === "EnvironmentSettingsObject" && Xb8(Y.window, $)) O = Y.window;
            if (q.window != null) throw TypeError(`'window' option '${O}' must be null`);
            if ("window" in q) O = "no-window";
            Y = B66({
                method: Y.method,
                headersList: Y.headersList,
                unsafeRequest: Y.unsafeRequest,
                client: S66.settingsObject,
                window: O,
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
            let _ = Object.keys(q).length !== 0;
            if (_) {
                if (Y.mode === "navigate") Y.mode = "same-origin";
                Y.reloadNavigation = !1, Y.historyNavigation = !1, Y.origin = "client", Y.referrer = "client", Y.referrerPolicy = "", Y.url = Y.urlList[Y.urlList.length - 1], Y.urlList = [Y.url]
            }
            if (q.referrer !== void 0) {
                let W = q.referrer;
                if (W === "") Y.referrer = "no-referrer";
                else {
                    let G;
                    try {
                        G = new URL(W, w)
                    } catch (f) {
                        throw TypeError(`Referrer "${W}" is not a valid URL.`, {
                            cause: f
                        })
                    }
                    if (G.protocol === "about:" && G.hostname === "client" || $ && !Xb8(G, S66.settingsObject.baseUrl)) Y.referrer = "client";
                    else Y.referrer = G
                }
            }
            if (q.referrerPolicy !== void 0) Y.referrerPolicy = q.referrerPolicy;
            let J;
            if (q.mode !== void 0) J = q.mode;
            else J = z;
            if (J === "navigate") throw uK.errors.exception({
                header: "Request constructor",
                message: "invalid request mode navigate."
            });
            if (J != null) Y.mode = J;
            if (q.credentials !== void 0) Y.credentials = q.credentials;
            if (q.cache !== void 0) Y.cache = q.cache;
            if (Y.cache === "only-if-cached" && Y.mode !== "same-origin") throw TypeError("'only-if-cached' can be set only with 'same-origin' mode");
            if (q.redirect !== void 0) Y.redirect = q.redirect;
            if (q.integrity != null) Y.integrity = String(q.integrity);
            if (q.keepalive !== void 0) Y.keepalive = Boolean(q.keepalive);
            if (q.method !== void 0) {
                let W = q.method,
                    G = K_3[W];
                if (G !== void 0) Y.method = G;
                else {
                    if (!iO3(W)) throw TypeError(`'${W}' is not a valid HTTP method.`);
                    let f = W.toUpperCase();
                    if (nO3.has(f)) throw TypeError(`'${W}' HTTP method is unsupported.`);
                    W = q_3[f] ?? W, Y.method = W
                }
                if (!Wb8 && Y.method === "patch") process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
                    code: "UNDICI-FETCH-patch"
                }), Wb8 = !0
            }
            if (q.signal !== void 0) H = q.signal;
            this[pH] = Y;
            let X = new AbortController;
            if (this[I66] = X.signal, H != null) {
                if (!H || typeof H.aborted !== "boolean" || typeof H.addEventListener !== "function") throw TypeError("Failed to construct 'Request': member signal is not of type AbortSignal.");
                if (H.aborted) X.abort(H.reason);
                else {
                    this[H_3] = X;
                    let W = new WeakRef(X),
                        G = Pb8(W);
                    try {
                        if (typeof Db8 === "function" && Db8(H) === Mb8) jb8(1500, H);
                        else if (w_3(H, "abort").length >= Mb8) jb8(1500, H)
                    } catch {}
                    h66.addAbortListener(H, G), fb8.register(X, {
                        signal: H,
                        abort: G
                    }, G)
                }
            }
            if (this[QT] = new Gb8(b66), Zb8(this[QT], Y.headersList), wo6(this[QT], "request"), J === "no-cors") {
                if (!rO3.has(Y.method)) throw TypeError(`'${Y.method} is unsupported in no-cors mode.`);
                wo6(this[QT], "request-no-cors")
            }
            if (_) {
                let W = _b8(this[QT]),
                    G = q.headers !== void 0 ? q.headers : new x66(W);
                if (W.clear(), G instanceof x66) {
                    for (let {
                            name: f,
                            value: Z
                        }
                        of G.rawValues()) W.append(f, Z, !1);
                    W.cookies = G.cookies
                } else dO3(this[QT], G)
            }
            let D = A instanceof Tw ? A[pH].body : null;
            if ((q.body != null || D != null) && (Y.method === "GET" || Y.method === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body.");
            let j = null;
            if (q.body != null) {
                let [W, G] = gO3(q.body, Y.keepalive);
                if (j = W, G && !_b8(this[QT]).contains("content-type", !0)) this[QT].append("content-type", G)
            }
            let M = j ?? D;
            if (M != null && M.source == null) {
                if (j != null && q.duplex == null) throw TypeError("RequestInit: duplex option is required when sending a body.");
                if (Y.mode !== "same-origin" && Y.mode !== "cors") throw TypeError('If request is made from ReadableStream, mode should be "same-origin" or "cors"');
                Y.useCORSPreflightFlag = !0
            }
            let P = M;
            if (j == null && D != null) {
                if (Ob8(A)) throw TypeError("Cannot construct a Request with a Request object that has already been used.");
                let W = new TransformStream;
                D.stream.pipeThrough(W), P = {
                    source: D.source,
                    length: D.length,
                    stream: W.readable
                }
            }
            this[pH].body = P
        }
        get method() {
            return uK.brandCheck(this, Tw), this[pH].method
        }
        get url() {
            return uK.brandCheck(this, Tw), Y_3(this[pH].url)
        }
        get headers() {
            return uK.brandCheck(this, Tw), this[QT]
        }
        get destination() {
            return uK.brandCheck(this, Tw), this[pH].destination
        }
        get referrer() {
            if (uK.brandCheck(this, Tw), this[pH].referrer === "no-referrer") return "";
            if (this[pH].referrer === "client") return "about:client";
            return this[pH].referrer.toString()
        }
        get referrerPolicy() {
            return uK.brandCheck(this, Tw), this[pH].referrerPolicy
        }
        get mode() {
            return uK.brandCheck(this, Tw), this[pH].mode
        }
        get credentials() {
            return this[pH].credentials
        }
        get cache() {
            return uK.brandCheck(this, Tw), this[pH].cache
        }
        get redirect() {
            return uK.brandCheck(this, Tw), this[pH].redirect
        }
        get integrity() {
            return uK.brandCheck(this, Tw), this[pH].integrity
        }
        get keepalive() {
            return uK.brandCheck(this, Tw), this[pH].keepalive
        }
        get isReloadNavigation() {
            return uK.brandCheck(this, Tw), this[pH].reloadNavigation
        }
        get isHistoryNavigation() {
            return uK.brandCheck(this, Tw), this[pH].historyNavigation
        }
        get signal() {
            return uK.brandCheck(this, Tw), this[I66]
        }
        get body() {
            return uK.brandCheck(this, Tw), this[pH].body ? this[pH].body.stream : null
        }
        get bodyUsed() {
            return uK.brandCheck(this, Tw), !!this[pH].body && h66.isDisturbed(this[pH].body.stream)
        }
        get duplex() {
            return uK.brandCheck(this, Tw), "half"
        }
        clone() {
            if (uK.brandCheck(this, Tw), Ob8(this)) throw TypeError("unusable");
            let A = Vb8(this[pH]),
                q = new AbortController;
            if (this.signal.aborted) q.abort(this.signal.reason);
            else {
                let K = u66.get(this.signal);
                if (K === void 0) K = new Set, u66.set(this.signal, K);
                let Y = new WeakRef(q);
                K.add(Y), h66.addAbortListener(q.signal, Pb8(Y))
            }
            return Nb8(A, q.signal, cO3(this[QT]))
        } [Jb8.inspect.custom](A, q) {
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
            return `Request ${Jb8.formatWithOptions(q,K)}`
        }
    }
    UO3(Tw);

    function B66(A) {
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
            headersList: A.headersList ? new x66(A.headersList) : new x66
        }
    }

    function Vb8(A) {
        let q = B66({
            ...A,
            body: null
        });
        if (A.body != null) q.body = pO3(q, A.body);
        return q
    }

    function Nb8(A, q, K) {
        let Y = new Tw(b66);
        return Y[pH] = A, Y[I66] = q, Y[QT] = new Gb8(b66), Zb8(Y[QT], A.headersList), wo6(Y[QT], K), Y
    }
    Object.defineProperties(Tw.prototype, {
        method: OX,
        url: OX,
        headers: OX,
        redirect: OX,
        clone: OX,
        signal: OX,
        duplex: OX,
        destination: OX,
        body: OX,
        bodyUsed: OX,
        isHistoryNavigation: OX,
        isReloadNavigation: OX,
        keepalive: OX,
        integrity: OX,
        cache: OX,
        credentials: OX,
        attribute: OX,
        referrerPolicy: OX,
        referrer: OX,
        mode: OX,
        [Symbol.toStringTag]: {
            value: "Request",
            configurable: !0
        }
    });
    uK.converters.Request = uK.interfaceConverter(Tw);
    uK.converters.RequestInfo = function(A, q, K) {
        if (typeof A === "string") return uK.converters.USVString(A, q, K);
        if (A instanceof Tw) return uK.converters.Request(A, q, K);
        return uK.converters.USVString(A, q, K)
    };
    uK.converters.AbortSignal = uK.interfaceConverter(AbortSignal);
    uK.converters.RequestInit = uK.dictionaryConverter([{
        key: "method",
        converter: uK.converters.ByteString
    }, {
        key: "headers",
        converter: uK.converters.HeadersInit
    }, {
        key: "body",
        converter: uK.nullableConverter(uK.converters.BodyInit)
    }, {
        key: "referrer",
        converter: uK.converters.USVString
    }, {
        key: "referrerPolicy",
        converter: uK.converters.DOMString,
        allowedValues: oO3
    }, {
        key: "mode",
        converter: uK.converters.DOMString,
        allowedValues: sO3
    }, {
        key: "credentials",
        converter: uK.converters.DOMString,
        allowedValues: tO3
    }, {
        key: "cache",
        converter: uK.converters.DOMString,
        allowedValues: eO3
    }, {
        key: "redirect",
        converter: uK.converters.DOMString,
        allowedValues: aO3
    }, {
        key: "integrity",
        converter: uK.converters.DOMString
    }, {
        key: "keepalive",
        converter: uK.converters.boolean
    }, {
        key: "signal",
        converter: uK.nullableConverter((A) => uK.converters.AbortSignal(A, "RequestInit", "signal", {
            strict: !1
        }))
    }, {
        key: "window",
        converter: uK.converters.any
    }, {
        key: "duplex",
        converter: uK.converters.DOMString,
        allowedValues: A_3
    }, {
        key: "dispatcher",
        converter: uK.converters.any
    }]);
    Tb8.exports = {
        Request: Tw,
        makeRequest: B66,
        fromInnerRequest: Nb8,
        cloneRequest: Vb8
    }
})
// @from(Ln 89719, Col 4)
ek1 = R((F72, mb8) => {
    var {
        makeNetworkError: N2,
        makeAppropriateNetworkError: m66,
        filterResponse: Ho6,
        makeResponse: F66,
        fromInnerResponse: $_3
    } = sk1(), {
        HeadersList: vb8
    } = tA1(), {
        Request: O_3,
        cloneRequest: __3
    } = c$1(), _n = h1("node:zlib"), {
        bytesMatch: J_3,
        makePolicyContainer: X_3,
        clonePolicyContainer: D_3,
        requestBadPort: j_3,
        TAOCheck: M_3,
        appendRequestOriginHeader: P_3,
        responseLocationURL: W_3,
        requestCurrentURL: Ib,
        setRequestReferrerPolicyOnRedirect: G_3,
        tryUpgradeRequestToAPotentiallyTrustworthyURL: Z_3,
        createOpaqueTimingInfo: Xo6,
        appendFetchMetadata: f_3,
        corsCheck: V_3,
        crossOriginResourcePolicyCheck: N_3,
        determineRequestsReferrer: T_3,
        coarsenedSharedCurrentTime: tk1,
        createDeferredPromise: v_3,
        isBlobLike: E_3,
        sameOrigin: Jo6,
        isCancelled: eA1,
        isAborted: Eb8,
        isErrorLike: k_3,
        fullyReadBody: L_3,
        readableStreamClose: R_3,
        isomorphicEncode: Q66,
        urlIsLocal: y_3,
        urlIsHttpHttpsScheme: Do6,
        urlHasHttpsScheme: C_3,
        clampAndCoarsenConnectionTimingInfo: S_3,
        simpleRangeHeaderValue: h_3,
        buildContentRange: I_3,
        createInflate: x_3,
        extractMimeType: b_3
    } = bT(), {
        kState: yb8,
        kDispatcher: u_3
    } = ti(), A81 = h1("node:assert"), {
        safelyExtractBody: jo6,
        extractBody: kb8
    } = k$1(), {
        redirectStatusSet: Cb8,
        nullBodyStatus: Sb8,
        safeMethodsSet: B_3,
        requestBodyHeader: m_3,
        subresourceSet: F_3
    } = Gk1(), Q_3 = h1("node:events"), {
        Readable: g_3,
        pipeline: U_3,
        finished: p_3
    } = h1("node:stream"), {
        addAbortListener: d_3,
        isErrored: c_3,
        isReadable: g66,
        bufferToLowerCasedHeaderName: Lb8
    } = W9(), {
        dataURLProcessor: l_3,
        serializeAMimeType: i_3,
        minimizeSupportedMimeType: n_3
    } = qV(), {
        getGlobalDispatcher: r_3
    } = v66(), {
        webidl: o_3
    } = OM(), {
        STATUS_CODES: a_3
    } = h1("node:http"), s_3 = ["GET", "HEAD"], t_3 = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici", $o6;
    class Mo6 extends Q_3 {
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

    function e_3(A) {
        hb8(A, "fetch")
    }

    function AJ3(A, q = void 0) {
        o_3.argumentLengthCheck(arguments, 1, "globalThis.fetch");
        let K = v_3(),
            Y;
        try {
            Y = new O_3(A, q)
        } catch (J) {
            return K.reject(J), K.promise
        }
        let z = Y[yb8];
        if (Y.signal.aborted) return Oo6(K, z, null, Y.signal.reason), K.promise;
        if (z.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope") z.serviceWorkers = "none";
        let H = null,
            $ = !1,
            O = null;
        return d_3(Y.signal, () => {
            $ = !0, A81(O != null), O.abort(Y.signal.reason);
            let J = H?.deref();
            Oo6(K, z, J, Y.signal.reason)
        }), O = xb8({
            request: z,
            processResponseEndOfBody: e_3,
            processResponse: (J) => {
                if ($) return;
                if (J.aborted) {
                    Oo6(K, z, H, O.serializedAbortReason);
                    return
                }
                if (J.type === "error") {
                    K.reject(TypeError("fetch failed", {
                        cause: J.error
                    }));
                    return
                }
                H = new WeakRef($_3(J, "immutable")), K.resolve(H.deref()), K = null
            },
            dispatcher: Y[u_3]
        }), K.promise
    }

    function hb8(A, q = "other") {
        if (A.type === "error" && A.aborted) return;
        if (!A.urlList?.length) return;
        let K = A.urlList[0],
            Y = A.timingInfo,
            z = A.cacheState;
        if (!Do6(K)) return;
        if (Y === null) return;
        if (!A.timingAllowPassed) Y = Xo6({
            startTime: Y.startTime
        }), z = "";
        Y.endTime = tk1(), A.timingInfo = Y, Ib8(Y, K.href, q, globalThis, z)
    }
    var Ib8 = performance.markResourceTiming;

    function Oo6(A, q, K, Y) {
        if (A) A.reject(Y);
        if (q.body != null && g66(q.body?.stream)) q.body.stream.cancel(Y).catch((w) => {
            if (w.code === "ERR_INVALID_STATE") return;
            throw w
        });
        if (K == null) return;
        let z = K[yb8];
        if (z.body != null && g66(z.body?.stream)) z.body.stream.cancel(Y).catch((w) => {
            if (w.code === "ERR_INVALID_STATE") return;
            throw w
        })
    }

    function xb8({
        request: A,
        processRequestBodyChunkLength: q,
        processRequestEndOfBody: K,
        processResponse: Y,
        processResponseEndOfBody: z,
        processResponseConsumeBody: w,
        useParallelQueue: H = !1,
        dispatcher: $ = r_3()
    }) {
        A81($);
        let O = null,
            _ = !1;
        if (A.client != null) O = A.client.globalObject, _ = A.client.crossOriginIsolatedCapability;
        let J = tk1(_),
            X = Xo6({
                startTime: J
            }),
            D = {
                controller: new Mo6($),
                request: A,
                timingInfo: X,
                processRequestBodyChunkLength: q,
                processRequestEndOfBody: K,
                processResponse: Y,
                processResponseConsumeBody: w,
                processResponseEndOfBody: z,
                taskDestination: O,
                crossOriginIsolatedCapability: _
            };
        if (A81(!A.body || A.body.stream), A.window === "client") A.window = A.client?.globalObject?.constructor?.name === "Window" ? A.client : "no-window";
        if (A.origin === "client") A.origin = A.client.origin;
        if (A.policyContainer === "client")
            if (A.client != null) A.policyContainer = D_3(A.client.policyContainer);
            else A.policyContainer = X_3();
        if (!A.headersList.contains("accept", !0)) A.headersList.append("accept", "*/*", !0);
        if (!A.headersList.contains("accept-language", !0)) A.headersList.append("accept-language", "*", !0);
        if (A.priority === null);
        if (F_3.has(A.destination));
        return bb8(D).catch((j) => {
            D.controller.terminate(j)
        }), D.controller
    }
    async function bb8(A, q = !1) {
        let K = A.request,
            Y = null;
        if (K.localURLsOnly && !y_3(Ib(K))) Y = N2("local URLs only");
        if (Z_3(K), j_3(K) === "blocked") Y = N2("bad port");
        if (K.referrerPolicy === "") K.referrerPolicy = K.policyContainer.referrerPolicy;
        if (K.referrer !== "no-referrer") K.referrer = T_3(K);
        if (Y === null) Y = await (async () => {
            let w = Ib(K);
            if (Jo6(w, K.url) && K.responseTainting === "basic" || w.protocol === "data:" || (K.mode === "navigate" || K.mode === "websocket")) return K.responseTainting = "basic", await Rb8(A);
            if (K.mode === "same-origin") return N2('request mode cannot be "same-origin"');
            if (K.mode === "no-cors") {
                if (K.redirect !== "follow") return N2('redirect mode cannot be "follow" for "no-cors" request');
                return K.responseTainting = "opaque", await Rb8(A)
            }
            if (!Do6(Ib(K))) return N2("URL scheme must be a HTTP(S) scheme");
            return K.responseTainting = "cors", await ub8(A)
        })();
        if (q) return Y;
        if (Y.status !== 0 && !Y.internalResponse) {
            if (K.responseTainting === "cors");
            if (K.responseTainting === "basic") Y = Ho6(Y, "basic");
            else if (K.responseTainting === "cors") Y = Ho6(Y, "cors");
            else if (K.responseTainting === "opaque") Y = Ho6(Y, "opaque");
            else A81(!1)
        }
        let z = Y.status === 0 ? Y : Y.internalResponse;
        if (z.urlList.length === 0) z.urlList.push(...K.urlList);
        if (!K.timingAllowFailed) Y.timingAllowPassed = !0;
        if (Y.type === "opaque" && z.status === 206 && z.rangeRequested && !K.headers.contains("range", !0)) Y = z = N2();
        if (Y.status !== 0 && (K.method === "HEAD" || K.method === "CONNECT" || Sb8.includes(z.status))) z.body = null, A.controller.dump = !0;
        if (K.integrity) {
            let w = ($) => _o6(A, N2($));
            if (K.responseTainting === "opaque" || Y.body == null) {
                w(Y.error);
                return
            }
            let H = ($) => {
                if (!J_3($, K.integrity)) {
                    w("integrity mismatch");
                    return
                }
                Y.body = jo6($)[0], _o6(A, Y)
            };
            await L_3(Y.body, H, w)
        } else _o6(A, Y)
    }

    function Rb8(A) {
        if (eA1(A) && A.request.redirectCount === 0) return Promise.resolve(m66(A));
        let {
            request: q
        } = A, {
            protocol: K
        } = Ib(q);
        switch (K) {
            case "about:":
                return Promise.resolve(N2("about scheme is not supported"));
            case "blob:": {
                if (!$o6) $o6 = h1("node:buffer").resolveObjectURL;
                let Y = Ib(q);
                if (Y.search.length !== 0) return Promise.resolve(N2("NetworkError when attempting to fetch resource."));
                let z = $o6(Y.toString());
                if (q.method !== "GET" || !E_3(z)) return Promise.resolve(N2("invalid method"));
                let w = F66(),
                    H = z.size,
                    $ = Q66(`${H}`),
                    O = z.type;
                if (!q.headersList.contains("range", !0)) {
                    let _ = kb8(z);
                    w.statusText = "OK", w.body = _[0], w.headersList.set("content-length", $, !0), w.headersList.set("content-type", O, !0)
                } else {
                    w.rangeRequested = !0;
                    let _ = q.headersList.get("range", !0),
                        J = h_3(_, !0);
                    if (J === "failure") return Promise.resolve(N2("failed to fetch the data URL"));
                    let {
                        rangeStartValue: X,
                        rangeEndValue: D
                    } = J;
                    if (X === null) X = H - D, D = X + D - 1;
                    else {
                        if (X >= H) return Promise.resolve(N2("Range start is greater than the blob's size."));
                        if (D === null || D >= H) D = H - 1
                    }
                    let j = z.slice(X, D, O),
                        M = kb8(j);
                    w.body = M[0];
                    let P = Q66(`${j.size}`),
                        W = I_3(X, D, H);
                    w.status = 206, w.statusText = "Partial Content", w.headersList.set("content-length", P, !0), w.headersList.set("content-type", O, !0), w.headersList.set("content-range", W, !0)
                }
                return Promise.resolve(w)
            }
            case "data:": {
                let Y = Ib(q),
                    z = l_3(Y);
                if (z === "failure") return Promise.resolve(N2("failed to fetch the data URL"));
                let w = i_3(z.mimeType);
                return Promise.resolve(F66({
                    statusText: "OK",
                    headersList: [
                        ["content-type", {
                            name: "Content-Type",
                            value: w
                        }]
                    ],
                    body: jo6(z.body)[0]
                }))
            }
            case "file:":
                return Promise.resolve(N2("not implemented... yet..."));
            case "http:":
            case "https:":
                return ub8(A).catch((Y) => N2(Y));
            default:
                return Promise.resolve(N2("unknown scheme"))
        }
    }

    function qJ3(A, q) {
        if (A.request.done = !0, A.processResponseDone != null) queueMicrotask(() => A.processResponseDone(q))
    }

    function _o6(A, q) {
        let K = A.timingInfo,
            Y = () => {
                let w = Date.now();
                if (A.request.destination === "document") A.controller.fullTimingInfo = K;
                A.controller.reportTimingSteps = () => {
                    if (A.request.url.protocol !== "https:") return;
                    K.endTime = w;
                    let {
                        cacheState: $,
                        bodyInfo: O
                    } = q;
                    if (!q.timingAllowPassed) K = Xo6(K), $ = "";
                    let _ = 0;
                    if (A.request.mode !== "navigator" || !q.hasCrossOriginRedirects) {
                        _ = q.status;
                        let J = b_3(q.headersList);
                        if (J !== "failure") O.contentType = n_3(J)
                    }
                    if (A.request.initiatorType != null) Ib8(K, A.request.url.href, A.request.initiatorType, globalThis, $, O, _)
                };
                let H = () => {
                    if (A.request.done = !0, A.processResponseEndOfBody != null) queueMicrotask(() => A.processResponseEndOfBody(q));
                    if (A.request.initiatorType != null) A.controller.reportTimingSteps()
                };
                queueMicrotask(() => H())
            };
        if (A.processResponse != null) queueMicrotask(() => {
            A.processResponse(q), A.processResponse = null
        });
        let z = q.type === "error" ? q : q.internalResponse ?? q;
        if (z.body == null) Y();
        else p_3(z.body.stream, () => {
            Y()
        })
    }
    async function ub8(A) {
        let q = A.request,
            K = null,
            Y = null,
            z = A.timingInfo;
        if (q.serviceWorkers === "all");
        if (K === null) {
            if (q.redirect === "follow") q.serviceWorkers = "none";
            if (Y = K = await Bb8(A), q.responseTainting === "cors" && V_3(q, K) === "failure") return N2("cors failure");
            if (M_3(q, K) === "failure") q.timingAllowFailed = !0
        }
        if ((q.responseTainting === "opaque" || K.type === "opaque") && N_3(q.origin, q.client, q.destination, Y) === "blocked") return N2("blocked");
        if (Cb8.has(Y.status)) {
            if (q.redirect !== "manual") A.controller.connection.destroy(void 0, !1);
            if (q.redirect === "error") K = N2("unexpected redirect");
            else if (q.redirect === "manual") K = Y;
            else if (q.redirect === "follow") K = await KJ3(A, K);
            else A81(!1)
        }
        return K.timingInfo = z, K
    }

    function KJ3(A, q) {
        let K = A.request,
            Y = q.internalResponse ? q.internalResponse : q,
            z;
        try {
            if (z = W_3(Y, Ib(K).hash), z == null) return q
        } catch (H) {
            return Promise.resolve(N2(H))
        }
        if (!Do6(z)) return Promise.resolve(N2("URL scheme must be a HTTP(S) scheme"));
        if (K.redirectCount === 20) return Promise.resolve(N2("redirect count exceeded"));
        if (K.redirectCount += 1, K.mode === "cors" && (z.username || z.password) && !Jo6(K, z)) return Promise.resolve(N2('cross origin not allowed for request mode "cors"'));
        if (K.responseTainting === "cors" && (z.username || z.password)) return Promise.resolve(N2('URL cannot contain credentials for request mode "cors"'));
        if (Y.status !== 303 && K.body != null && K.body.source == null) return Promise.resolve(N2());
        if ([301, 302].includes(Y.status) && K.method === "POST" || Y.status === 303 && !s_3.includes(K.method)) {
            K.method = "GET", K.body = null;
            for (let H of m_3) K.headersList.delete(H)
        }
        if (!Jo6(Ib(K), z)) K.headersList.delete("authorization", !0), K.headersList.delete("proxy-authorization", !0), K.headersList.delete("cookie", !0), K.headersList.delete("host", !0);
        if (K.body != null) A81(K.body.source != null), K.body = jo6(K.body.source)[0];
        let w = A.timingInfo;
        if (w.redirectEndTime = w.postRedirectStartTime = tk1(A.crossOriginIsolatedCapability), w.redirectStartTime === 0) w.redirectStartTime = w.startTime;
        return K.urlList.push(z), G_3(K, Y), bb8(A, !0)
    }
    async function Bb8(A, q = !1, K = !1) {
        let Y = A.request,
            z = null,
            w = null,
            H = null,
            $ = null,
            O = !1;
        if (Y.window === "no-window" && Y.redirect === "error") z = A, w = Y;
        else w = __3(Y), z = {
            ...A
        }, z.request = w;
        let _ = Y.credentials === "include" || Y.credentials === "same-origin" && Y.responseTainting === "basic",
            J = w.body ? w.body.length : null,
            X = null;
        if (w.body == null && ["POST", "PUT"].includes(w.method)) X = "0";
        if (J != null) X = Q66(`${J}`);
        if (X != null) w.headersList.append("content-length", X, !0);
        if (J != null && w.keepalive);
        if (w.referrer instanceof URL) w.headersList.append("referer", Q66(w.referrer.href), !0);
        if (P_3(w), f_3(w), !w.headersList.contains("user-agent", !0)) w.headersList.append("user-agent", t_3);
        if (w.cache === "default" && (w.headersList.contains("if-modified-since", !0) || w.headersList.contains("if-none-match", !0) || w.headersList.contains("if-unmodified-since", !0) || w.headersList.contains("if-match", !0) || w.headersList.contains("if-range", !0))) w.cache = "no-store";
        if (w.cache === "no-cache" && !w.preventNoCacheCacheControlHeaderModification && !w.headersList.contains("cache-control", !0)) w.headersList.append("cache-control", "max-age=0", !0);
        if (w.cache === "no-store" || w.cache === "reload") {
            if (!w.headersList.contains("pragma", !0)) w.headersList.append("pragma", "no-cache", !0);
            if (!w.headersList.contains("cache-control", !0)) w.headersList.append("cache-control", "no-cache", !0)
        }
        if (w.headersList.contains("range", !0)) w.headersList.append("accept-encoding", "identity", !0);
        if (!w.headersList.contains("accept-encoding", !0))
            if (C_3(Ib(w))) w.headersList.append("accept-encoding", "br, gzip, deflate", !0);
            else w.headersList.append("accept-encoding", "gzip, deflate", !0);
        if (w.headersList.delete("host", !0), $ == null) w.cache = "no-store";
        if (w.cache !== "no-store" && w.cache !== "reload");
        if (H == null) {
            if (w.cache === "only-if-cached") return N2("only if cached");
            let D = await YJ3(z, _, K);
            if (!B_3.has(w.method) && D.status >= 200 && D.status <= 399);
            if (O && D.status === 304);
            if (H == null) H = D
        }
        if (H.urlList = [...w.urlList], w.headersList.contains("range", !0)) H.rangeRequested = !0;
        if (H.requestIncludesCredentials = _, H.status === 407) {
            if (Y.window === "no-window") return N2();
            if (eA1(A)) return m66(A);
            return N2("proxy authentication required")
        }
        if (H.status === 421 && !K && (Y.body == null || Y.body.source != null)) {
            if (eA1(A)) return m66(A);
            A.controller.connection.destroy(), H = await Bb8(A, q, !0)
        }
        return H
    }
    async function YJ3(A, q = !1, K = !1) {
        A81(!A.controller.connection || A.controller.connection.destroyed), A.controller.connection = {
            abort: null,
            destroyed: !1,
            destroy(M, P = !0) {
                if (!this.destroyed) {
                    if (this.destroyed = !0, P) this.abort?.(M ?? new DOMException("The operation was aborted.", "AbortError"))
                }
            }
        };
        let Y = A.request,
            z = null,
            w = A.timingInfo;
        if (!0) Y.cache = "no-store";
        let $ = K ? "yes" : "no";
        if (Y.mode === "websocket");
        let O = null;
        if (Y.body == null && A.processRequestEndOfBody) queueMicrotask(() => A.processRequestEndOfBody());
        else if (Y.body != null) {
            let M = async function*(G) {
                if (eA1(A)) return;
                yield G, A.processRequestBodyChunkLength?.(G.byteLength)
            }, P = () => {
                if (eA1(A)) return;
                if (A.processRequestEndOfBody) A.processRequestEndOfBody()
            }, W = (G) => {
                if (eA1(A)) return;
                if (G.name === "AbortError") A.controller.abort();
                else A.controller.terminate(G)
            };
            O = async function*() {
                try {
                    for await (let G of Y.body.stream) yield* M(G);
                    P()
                } catch (G) {
                    W(G)
                }
            }()
        }
        try {
            let {
                body: M,
                status: P,
                statusText: W,
                headersList: G,
                socket: f
            } = await j({
                body: O
            });
            if (f) z = F66({
                status: P,
                statusText: W,
                headersList: G,
                socket: f
            });
            else {
                let Z = M[Symbol.asyncIterator]();
                A.controller.next = () => Z.next(), z = F66({
                    status: P,
                    statusText: W,
                    headersList: G
                })
            }
        } catch (M) {
            if (M.name === "AbortError") return A.controller.connection.destroy(), m66(A, M);
            return N2(M)
        }
        let _ = async () => {
            await A.controller.resume()
        }, J = (M) => {
            if (!eA1(A)) A.controller.abort(M)
        }, X = new ReadableStream({
            async start(M) {
                A.controller.controller = M
            },
            async pull(M) {
                await _(M)
            },
            async cancel(M) {
                await J(M)
            },
            type: "bytes"
        });
        z.body = {
            stream: X,
            source: null,
            length: null
        }, A.controller.onAborted = D, A.controller.on("terminated", D), A.controller.resume = async () => {
            while (!0) {
                let M, P;
                try {
                    let {
                        done: G,
                        value: f
                    } = await A.controller.next();
                    if (Eb8(A)) break;
                    M = G ? void 0 : f
                } catch (G) {
                    if (A.controller.ended && !w.encodedBodySize) M = void 0;
                    else M = G, P = !0
                }
                if (M === void 0) {
                    R_3(A.controller.controller), qJ3(A, z);
                    return
                }
                if (w.decodedBodySize += M?.byteLength ?? 0, P) {
                    A.controller.terminate(M);
                    return
                }
                let W = new Uint8Array(M);
                if (W.byteLength) A.controller.controller.enqueue(W);
                if (c_3(X)) {
                    A.controller.terminate();
                    return
                }
                if (A.controller.controller.desiredSize <= 0) return
            }
        };

        function D(M) {
            if (Eb8(A)) {
                if (z.aborted = !0, g66(X)) A.controller.controller.error(A.controller.serializedAbortReason)
            } else if (g66(X)) A.controller.controller.error(TypeError("terminated", {
                cause: k_3(M) ? M : void 0
            }));
            A.controller.connection.destroy()
        }
        return z;

        function j({
            body: M
        }) {
            let P = Ib(Y),
                W = A.controller.dispatcher;
            return new Promise((G, f) => W.dispatch({
                path: P.pathname + P.search,
                origin: P.origin,
                method: Y.method,
                body: W.isMockActive ? Y.body && (Y.body.source || Y.body.stream) : M,
                headers: Y.headersList.entries,
                maxRedirections: 0,
                upgrade: Y.mode === "websocket" ? "websocket" : void 0
            }, {
                body: null,
                abort: null,
                onConnect(Z) {
                    let {
                        connection: N
                    } = A.controller;
                    if (w.finalConnectionTimingInfo = S_3(void 0, w.postRedirectStartTime, A.crossOriginIsolatedCapability), N.destroyed) Z(new DOMException("The operation was aborted.", "AbortError"));
                    else A.controller.on("terminated", Z), this.abort = N.abort = Z;
                    w.finalNetworkRequestStartTime = tk1(A.crossOriginIsolatedCapability)
                },
                onResponseStarted() {
                    w.finalNetworkResponseStartTime = tk1(A.crossOriginIsolatedCapability)
                },
                onHeaders(Z, N, T, k) {
                    if (Z < 200) return;
                    let y = [],
                        B = "",
                        S = new vb8;
                    for (let x = 0; x < N.length; x += 2) S.append(Lb8(N[x]), N[x + 1].toString("latin1"), !0);
                    let m = S.get("content-encoding", !0);
                    if (m) y = m.toLowerCase().split(",").map((x) => x.trim());
                    B = S.get("location", !0), this.body = new g_3({
                        read: T
                    });
                    let b = [],
                        g = B && Y.redirect === "follow" && Cb8.has(Z);
                    if (y.length !== 0 && Y.method !== "HEAD" && Y.method !== "CONNECT" && !Sb8.includes(Z) && !g)
                        for (let x = y.length - 1; x >= 0; --x) {
                            let p = y[x];
                            if (p === "x-gzip" || p === "gzip") b.push(_n.createGunzip({
                                flush: _n.constants.Z_SYNC_FLUSH,
                                finishFlush: _n.constants.Z_SYNC_FLUSH
                            }));
                            else if (p === "deflate") b.push(x_3({
                                flush: _n.constants.Z_SYNC_FLUSH,
                                finishFlush: _n.constants.Z_SYNC_FLUSH
                            }));
                            else if (p === "br") b.push(_n.createBrotliDecompress({
                                flush: _n.constants.BROTLI_OPERATION_FLUSH,
                                finishFlush: _n.constants.BROTLI_OPERATION_FLUSH
                            }));
                            else {
                                b.length = 0;
                                break
                            }
                        }
                    let U = this.onError.bind(this);
                    return G({
                        status: Z,
                        statusText: k,
                        headersList: S,
                        body: b.length ? U_3(this.body, ...b, (x) => {
                            if (x) this.onError(x)
                        }).on("error", U) : this.body.on("error", U)
                    }), !0
                },
                onData(Z) {
                    if (A.controller.dump) return;
                    let N = Z;
                    return w.encodedBodySize += N.byteLength, this.body.push(N)
                },
                onComplete() {
                    if (this.abort) A.controller.off("terminated", this.abort);
                    if (A.controller.onAborted) A.controller.off("terminated", A.controller.onAborted);
                    A.controller.ended = !0, this.body.push(null)
                },
                onError(Z) {
                    if (this.abort) A.controller.off("terminated", this.abort);
                    this.body?.destroy(Z), A.controller.terminate(Z), f(Z)
                },
                onUpgrade(Z, N, T) {
                    if (Z !== 101) return;
                    let k = new vb8;
                    for (let y = 0; y < N.length; y += 2) k.append(Lb8(N[y]), N[y + 1].toString("latin1"), !0);
                    return G({
                        status: Z,
                        statusText: a_3[Z],
                        headersList: k,
                        socket: T
                    }), !0
                }
            }))
        }
    }
    mb8.exports = {
        fetch: AJ3,
        Fetch: Mo6,
        fetching: xb8,
        finalizeAndReportTiming: hb8
    }
})
// @from(Ln 90420, Col 4)
Po6 = R((Q72, Fb8) => {
    Fb8.exports = {
        kState: Symbol("FileReader state"),
        kResult: Symbol("FileReader result"),
        kError: Symbol("FileReader error"),
        kLastProgressEventFired: Symbol("FileReader last progress event fired timestamp"),
        kEvents: Symbol("FileReader events"),
        kAborted: Symbol("FileReader aborted")
    }
})
// @from(Ln 90430, Col 4)
gb8 = R((g72, Qb8) => {
    var {
        webidl: gT
    } = OM(), U66 = Symbol("ProgressEvent state");
    class AL1 extends Event {
        constructor(A, q = {}) {
            A = gT.converters.DOMString(A, "ProgressEvent constructor", "type"), q = gT.converters.ProgressEventInit(q ?? {});
            super(A, q);
            this[U66] = {
                lengthComputable: q.lengthComputable,
                loaded: q.loaded,
                total: q.total
            }
        }
        get lengthComputable() {
            return gT.brandCheck(this, AL1), this[U66].lengthComputable
        }
        get loaded() {
            return gT.brandCheck(this, AL1), this[U66].loaded
        }
        get total() {
            return gT.brandCheck(this, AL1), this[U66].total
        }
    }
    gT.converters.ProgressEventInit = gT.dictionaryConverter([{
        key: "lengthComputable",
        converter: gT.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "loaded",
        converter: gT.converters["unsigned long long"],
        defaultValue: () => 0
    }, {
        key: "total",
        converter: gT.converters["unsigned long long"],
        defaultValue: () => 0
    }, {
        key: "bubbles",
        converter: gT.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "cancelable",
        converter: gT.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "composed",
        converter: gT.converters.boolean,
        defaultValue: () => !1
    }]);
    Qb8.exports = {
        ProgressEvent: AL1
    }
})
// @from(Ln 90483, Col 4)
pb8 = R((U72, Ub8) => {
    function zJ3(A) {
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
    Ub8.exports = {
        getEncoding: zJ3
    }
})