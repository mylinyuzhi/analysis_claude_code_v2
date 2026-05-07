
// @from(Ln 60719, Col 4)
oi7 = p((F_O, ri7) => {
    var {
        Transform: f13
    } = d6("node:stream"), {
        Console: G13
    } = d6("node:console"), v13 = process.versions.icu ? "✅" : "Y ", T13 = process.versions.icu ? "❌" : "N ";
    ri7.exports = class {
        constructor({
            disableColors: K
        } = {}) {
            this.transform = new f13({
                transform(_, z, Y) {
                    Y(null, _)
                }
            }), this.logger = new G13({
                stdout: this.transform,
                inspectOptions: {
                    colors: !K && !0
                }
            })
        }
        format(K) {
            let _ = K.map(({
                method: z,
                path: Y,
                data: {
                    statusCode: A
                },
                persist: O,
                times: w,
                timesInvoked: $,
                origin: j
            }) => ({
                Method: z,
                Origin: j,
                Path: Y,
                "Status code": A,
                Persistent: O ? v13 : T13,
                Invocations: $,
                Remaining: O ? 1 / 0 : w - $
            }));
            return this.logger.table(_), this.transform.read().toString()
        }
    }
})
// @from(Ln 60764, Col 4)
qr7 = p((g_O, ei7) => {
    var {
        kClients: zO6
    } = oj(), V13 = mG6(), {
        kAgent: B21,
        kMockAgentSet: yM8,
        kMockAgentGet: ai7,
        kDispatches: p21,
        kIsMockActive: LM8,
        kNetConnect: YO6,
        kGetNetConnect: k13,
        kOptions: hM8,
        kFactory: RM8
    } = cG6(), N13 = x21(), E13 = m21(), {
        matchValue: y13,
        buildMockOptions: L13
    } = Vd6(), {
        InvalidArgumentError: si7,
        UndiciError: h13
    } = aA(), R13 = nQ6(), S13 = ii7(), C13 = oi7();
    class ti7 extends R13 {
        constructor(q) {
            super(q);
            if (this[YO6] = !0, this[LM8] = !0, q?.agent && typeof q.agent.dispatch !== "function") throw new si7("Argument opts.agent must implement Agent");
            let K = q?.agent ? q.agent : new V13(q);
            this[B21] = K, this[zO6] = K[zO6], this[hM8] = L13(q)
        }
        get(q) {
            let K = this[ai7](q);
            if (!K) K = this[RM8](q), this[yM8](q, K);
            return K
        }
        dispatch(q, K) {
            return this.get(q.origin), this[B21].dispatch(q, K)
        }
        async close() {
            await this[B21].close(), this[zO6].clear()
        }
        deactivate() {
            this[LM8] = !1
        }
        activate() {
            this[LM8] = !0
        }
        enableNetConnect(q) {
            if (typeof q === "string" || typeof q === "function" || q instanceof RegExp)
                if (Array.isArray(this[YO6])) this[YO6].push(q);
                else this[YO6] = [q];
            else if (typeof q > "u") this[YO6] = !0;
            else throw new si7("Unsupported matcher. Must be one of String|Function|RegExp.")
        }
        disableNetConnect() {
            this[YO6] = !1
        }
        get isMockActive() {
            return this[LM8]
        } [yM8](q, K) {
            this[zO6].set(q, K)
        } [RM8](q) {
            let K = Object.assign({
                agent: this
            }, this[hM8]);
            return this[hM8] && this[hM8].connections === 1 ? new N13(q, K) : new E13(q, K)
        } [ai7](q) {
            let K = this[zO6].get(q);
            if (K) return K;
            if (typeof q !== "string") {
                let _ = this[RM8]("http://localhost:9999");
                return this[yM8](q, _), _
            }
            for (let [_, z] of Array.from(this[zO6]))
                if (z && typeof _ !== "string" && y13(_, q)) {
                    let Y = this[RM8](q);
                    return this[yM8](q, Y), Y[p21] = z[p21], Y
                }
        } [k13]() {
            return this[YO6]
        }
        pendingInterceptors() {
            let q = this[zO6];
            return Array.from(q.entries()).flatMap(([K, _]) => _[p21].map((z) => ({
                ...z,
                origin: K
            }))).filter(({
                pending: K
            }) => K)
        }
        assertNoPendingInterceptors({
            pendingInterceptorsFormatter: q = new C13
        } = {}) {
            let K = this.pendingInterceptors();
            if (K.length === 0) return;
            let _ = new S13("interceptor", "interceptors").pluralize(K.length);
            throw new h13(`
${_.count} ${_.noun} ${_.is} pending:

${q.format(K)}
`.trim())
        }
    }
    ei7.exports = ti7
})
// @from(Ln 60866, Col 4)
SM8 = p((U_O, Yr7) => {
    var Kr7 = Symbol.for("undici.globalDispatcher.1"),
        {
            InvalidArgumentError: b13
        } = aA(),
        I13 = mG6();
    if (zr7() === void 0) _r7(new I13);

    function _r7(q) {
        if (!q || typeof q.dispatch !== "function") throw new b13("Argument agent must implement Agent");
        Object.defineProperty(globalThis, Kr7, {
            value: q,
            writable: !0,
            enumerable: !1,
            configurable: !1
        })
    }

    function zr7() {
        return globalThis[Kr7]
    }
    Yr7.exports = {
        setGlobalDispatcher: _r7,
        getGlobalDispatcher: zr7
    }
})
// @from(Ln 60892, Col 4)
CM8 = p((Q_O, Ar7) => {
    Ar7.exports = class {
        #q;
        constructor(K) {
            if (typeof K !== "object" || K === null) throw TypeError("handler must be an object");
            this.#q = K
        }
        onConnect(...K) {
            return this.#q.onConnect?.(...K)
        }
        onError(...K) {
            return this.#q.onError?.(...K)
        }
        onUpgrade(...K) {
            return this.#q.onUpgrade?.(...K)
        }
        onResponseStarted(...K) {
            return this.#q.onResponseStarted?.(...K)
        }
        onHeaders(...K) {
            return this.#q.onHeaders?.(...K)
        }
        onData(...K) {
            return this.#q.onData?.(...K)
        }
        onComplete(...K) {
            return this.#q.onComplete?.(...K)
        }
        onBodySent(...K) {
            return this.#q.onBodySent?.(...K)
        }
    }
})
// @from(Ln 60925, Col 4)
wr7 = p((d_O, Or7) => {
    var x13 = JM8();
    Or7.exports = (q) => {
        let K = q?.maxRedirections;
        return (_) => {
            return function(Y, A) {
                let {
                    maxRedirections: O = K,
                    ...w
                } = Y;
                if (!O) return _(Y, A);
                let $ = new x13(_, O, Y, A);
                return _(w, $)
            }
        }
    }
})
// @from(Ln 60942, Col 4)
jr7 = p((c_O, $r7) => {
    var u13 = TM8();
    $r7.exports = (q) => {
        return (K) => {
            return function(z, Y) {
                return K(z, new u13({
                    ...z,
                    retryOptions: {
                        ...q,
                        ...z.retryOptions
                    }
                }, {
                    handler: Y,
                    dispatch: K
                }))
            }
        }
    }
})
// @from(Ln 60961, Col 4)
Xr7 = p((l_O, Jr7) => {
    var m13 = Hz(),
        {
            InvalidArgumentError: B13,
            RequestAbortedError: p13
        } = aA(),
        F13 = CM8();
    class Hr7 extends F13 {
        #q = 1048576;
        #K = null;
        #_ = !1;
        #Y = !1;
        #z = 0;
        #w = null;
        #A = null;
        constructor({
            maxSize: q
        }, K) {
            super(K);
            if (q != null && (!Number.isFinite(q) || q < 1)) throw new B13("maxSize must be a number greater than 0");
            this.#q = q ?? this.#q, this.#A = K
        }
        onConnect(q) {
            this.#K = q, this.#A.onConnect(this.#$.bind(this))
        }
        #$(q) {
            this.#Y = !0, this.#w = q
        }
        onHeaders(q, K, _, z) {
            let A = m13.parseHeaders(K)["content-length"];
            if (A != null && A > this.#q) throw new p13(`Response size (${A}) larger than maxSize (${this.#q})`);
            if (this.#Y) return !0;
            return this.#A.onHeaders(q, K, _, z)
        }
        onError(q) {
            if (this.#_) return;
            q = this.#w ?? q, this.#A.onError(q)
        }
        onData(q) {
            if (this.#z = this.#z + q.length, this.#z >= this.#q)
                if (this.#_ = !0, this.#Y) this.#A.onError(this.#w);
                else this.#A.onComplete([]);
            return !0
        }
        onComplete(q) {
            if (this.#_) return;
            if (this.#Y) {
                this.#A.onError(this.reason);
                return
            }
            this.#A.onComplete(q)
        }
    }

    function g13({
        maxSize: q
    } = {
        maxSize: 1048576
    }) {
        return (K) => {
            return function(z, Y) {
                let {
                    dumpMaxSize: A = q
                } = z, O = new Hr7({
                    maxSize: A
                }, Y);
                return K(z, O)
            }
        }
    }
    Jr7.exports = g13
})
// @from(Ln 61033, Col 4)
Zr7 = p((n_O, Dr7) => {
    var {
        isIP: U13
    } = d6("node:net"), {
        lookup: Q13
    } = d6("node:dns"), d13 = CM8(), {
        InvalidArgumentError: lG6,
        InformationalError: c13
    } = aA(), Mr7 = Math.pow(2, 31) - 1;
    class Pr7 {
        #q = 0;
        #K = 0;
        #_ = new Map;
        dualStack = !0;
        affinity = null;
        lookup = null;
        pick = null;
        constructor(q) {
            this.#q = q.maxTTL, this.#K = q.maxItems, this.dualStack = q.dualStack, this.affinity = q.affinity, this.lookup = q.lookup ?? this.#Y, this.pick = q.pick ?? this.#z
        }
        get full() {
            return this.#_.size === this.#K
        }
        runLookup(q, K, _) {
            let z = this.#_.get(q.hostname);
            if (z == null && this.full) {
                _(null, q.origin);
                return
            }
            let Y = {
                affinity: this.affinity,
                dualStack: this.dualStack,
                lookup: this.lookup,
                pick: this.pick,
                ...K.dns,
                maxTTL: this.#q,
                maxItems: this.#K
            };
            if (z == null) this.lookup(q, Y, (A, O) => {
                if (A || O == null || O.length === 0) {
                    _(A ?? new c13("No DNS entries found"));
                    return
                }
                this.setRecords(q, O);
                let w = this.#_.get(q.hostname),
                    $ = this.pick(q, w, Y.affinity),
                    j;
                if (typeof $.port === "number") j = `:${$.port}`;
                else if (q.port !== "") j = `:${q.port}`;
                else j = "";
                _(null, `${q.protocol}//${$.family===6?`[${$.address}]`:$.address}${j}`)
            });
            else {
                let A = this.pick(q, z, Y.affinity);
                if (A == null) {
                    this.#_.delete(q.hostname), this.runLookup(q, K, _);
                    return
                }
                let O;
                if (typeof A.port === "number") O = `:${A.port}`;
                else if (q.port !== "") O = `:${q.port}`;
                else O = "";
                _(null, `${q.protocol}//${A.family===6?`[${A.address}]`:A.address}${O}`)
            }
        }
        #Y(q, K, _) {
            Q13(q.hostname, {
                all: !0,
                family: this.dualStack === !1 ? this.affinity : 0,
                order: "ipv4first"
            }, (z, Y) => {
                if (z) return _(z);
                let A = new Map;
                for (let O of Y) A.set(`${O.address}:${O.family}`, O);
                _(null, A.values())
            })
        }
        #z(q, K, _) {
            let z = null,
                {
                    records: Y,
                    offset: A
                } = K,
                O;
            if (this.dualStack) {
                if (_ == null)
                    if (A == null || A === Mr7) K.offset = 0, _ = 4;
                    else K.offset++, _ = (K.offset & 1) === 1 ? 6 : 4;
                if (Y[_] != null && Y[_].ips.length > 0) O = Y[_];
                else O = Y[_ === 4 ? 6 : 4]
            } else O = Y[_];
            if (O == null || O.ips.length === 0) return z;
            if (O.offset == null || O.offset === Mr7) O.offset = 0;
            else O.offset++;
            let w = O.offset % O.ips.length;
            if (z = O.ips[w] ?? null, z == null) return z;
            if (Date.now() - z.timestamp > z.ttl) return O.ips.splice(w, 1), this.pick(q, K, _);
            return z
        }
        setRecords(q, K) {
            let _ = Date.now(),
                z = {
                    records: {
                        4: null,
                        6: null
                    }
                };
            for (let Y of K) {
                if (Y.timestamp = _, typeof Y.ttl === "number") Y.ttl = Math.min(Y.ttl, this.#q);
                else Y.ttl = this.#q;
                let A = z.records[Y.family] ?? {
                    ips: []
                };
                A.ips.push(Y), z.records[Y.family] = A
            }
            this.#_.set(q.hostname, z)
        }
        getHandler(q, K) {
            return new Wr7(this, q, K)
        }
    }
    class Wr7 extends d13 {
        #q = null;
        #K = null;
        #_ = null;
        #Y = null;
        #z = null;
        constructor(q, {
            origin: K,
            handler: _,
            dispatch: z
        }, Y) {
            super(_);
            this.#z = K, this.#Y = _, this.#K = {
                ...Y
            }, this.#q = q, this.#_ = z
        }
        onError(q) {
            switch (q.code) {
                case "ETIMEDOUT":
                case "ECONNREFUSED": {
                    if (this.#q.dualStack) {
                        this.#q.runLookup(this.#z, this.#K, (K, _) => {
                            if (K) return this.#Y.onError(K);
                            let z = {
                                ...this.#K,
                                origin: _
                            };
                            this.#_(z, this)
                        });
                        return
                    }
                    this.#Y.onError(q);
                    return
                }
                case "ENOTFOUND":
                    this.#q.deleteRecord(this.#z);
                default:
                    this.#Y.onError(q);
                    break
            }
        }
    }
    Dr7.exports = (q) => {
        if (q?.maxTTL != null && (typeof q?.maxTTL !== "number" || q?.maxTTL < 0)) throw new lG6("Invalid maxTTL. Must be a positive number");
        if (q?.maxItems != null && (typeof q?.maxItems !== "number" || q?.maxItems < 1)) throw new lG6("Invalid maxItems. Must be a positive number and greater than zero");
        if (q?.affinity != null && q?.affinity !== 4 && q?.affinity !== 6) throw new lG6("Invalid affinity. Must be either 4 or 6");
        if (q?.dualStack != null && typeof q?.dualStack !== "boolean") throw new lG6("Invalid dualStack. Must be a boolean");
        if (q?.lookup != null && typeof q?.lookup !== "function") throw new lG6("Invalid lookup. Must be a function");
        if (q?.pick != null && typeof q?.pick !== "function") throw new lG6("Invalid pick. Must be a function");
        let K = q?.dualStack ?? !0,
            _;
        if (K) _ = q?.affinity ?? null;
        else _ = q?.affinity ?? 4;
        let z = {
                maxTTL: q?.maxTTL ?? 1e4,
                lookup: q?.lookup ?? null,
                pick: q?.pick ?? null,
                dualStack: K,
                affinity: _,
                maxItems: q?.maxItems ?? 1 / 0
            },
            Y = new Pr7(z);
        return (A) => {
            return function(w, $) {
                let j = w.origin.constructor === URL ? w.origin : new URL(w.origin);
                if (U13(j.hostname) !== 0) return A(w, $);
                return Y.runLookup(j, w, (H, J) => {
                    if (H) return $.onError(H);
                    let X = null;
                    X = {
                        ...w,
                        servername: j.hostname,
                        origin: J,
                        headers: {
                            host: j.hostname,
                            ...w.headers
                        }
                    }, A(X, Y.getHandler({
                        origin: j,
                        dispatch: A,
                        handler: $
                    }, w))
                }), !0
            }
        }
    }
})
// @from(Ln 61241, Col 4)
AO6 = p((i_O, Nr7) => {
    var {
        kConstruct: l13
    } = oj(), {
        kEnumerableProperty: nG6
    } = Hz(), {
        iteratorMixin: n13,
        isValidHeaderName: Nd6,
        isValidHeaderValue: Gr7
    } = kh(), {
        webidl: tY
    } = lZ(), F21 = d6("node:assert"), bM8 = d6("node:util"), wP = Symbol("headers map"), yh = Symbol("headers map sorted");

    function fr7(q) {
        return q === 10 || q === 13 || q === 9 || q === 32
    }

    function vr7(q) {
        let K = 0,
            _ = q.length;
        while (_ > K && fr7(q.charCodeAt(_ - 1))) --_;
        while (_ > K && fr7(q.charCodeAt(K))) ++K;
        return K === 0 && _ === q.length ? q : q.substring(K, _)
    }

    function Tr7(q, K) {
        if (Array.isArray(K))
            for (let _ = 0; _ < K.length; ++_) {
                let z = K[_];
                if (z.length !== 2) throw tY.errors.exception({
                    header: "Headers constructor",
                    message: `expected name/value pair to be length 2, found ${z.length}.`
                });
                g21(q, z[0], z[1])
            } else if (typeof K === "object" && K !== null) {
                let _ = Object.keys(K);
                for (let z = 0; z < _.length; ++z) g21(q, _[z], K[_[z]])
            } else throw tY.errors.conversionFailed({
                prefix: "Headers constructor",
                argument: "Argument 1",
                types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
            })
    }

    function g21(q, K, _) {
        if (_ = vr7(_), !Nd6(K)) throw tY.errors.invalidArgument({
            prefix: "Headers.append",
            value: K,
            type: "header name"
        });
        else if (!Gr7(_)) throw tY.errors.invalidArgument({
            prefix: "Headers.append",
            value: _,
            type: "header value"
        });
        if (kr7(q) === "immutable") throw TypeError("immutable");
        return U21(q).append(K, _, !1)
    }

    function Vr7(q, K) {
        return q[0] < K[0] ? -1 : 1
    }
    class IM8 {
        cookies = null;
        constructor(q) {
            if (q instanceof IM8) this[wP] = new Map(q[wP]), this[yh] = q[yh], this.cookies = q.cookies === null ? null : [...q.cookies];
            else this[wP] = new Map(q), this[yh] = null
        }
        contains(q, K) {
            return this[wP].has(K ? q : q.toLowerCase())
        }
        clear() {
            this[wP].clear(), this[yh] = null, this.cookies = null
        }
        append(q, K, _) {
            this[yh] = null;
            let z = _ ? q : q.toLowerCase(),
                Y = this[wP].get(z);
            if (Y) {
                let A = z === "cookie" ? "; " : ", ";
                this[wP].set(z, {
                    name: Y.name,
                    value: `${Y.value}${A}${K}`
                })
            } else this[wP].set(z, {
                name: q,
                value: K
            });
            if (z === "set-cookie")(this.cookies ??= []).push(K)
        }
        set(q, K, _) {
            this[yh] = null;
            let z = _ ? q : q.toLowerCase();
            if (z === "set-cookie") this.cookies = [K];
            this[wP].set(z, {
                name: q,
                value: K
            })
        }
        delete(q, K) {
            if (this[yh] = null, !K) q = q.toLowerCase();
            if (q === "set-cookie") this.cookies = null;
            this[wP].delete(q)
        }
        get(q, K) {
            return this[wP].get(K ? q : q.toLowerCase())?.value ?? null
        }*[Symbol.iterator]() {
            for (let {
                    0: q,
                    1: {
                        value: K
                    }
                }
                of this[wP]) yield [q, K]
        }
        get entries() {
            let q = {};
            if (this[wP].size !== 0)
                for (let {
                        name: K,
                        value: _
                    }
                    of this[wP].values()) q[K] = _;
            return q
        }
        rawValues() {
            return this[wP].values()
        }
        get entriesList() {
            let q = [];
            if (this[wP].size !== 0)
                for (let {
                        0: K,
                        1: {
                            name: _,
                            value: z
                        }
                    }
                    of this[wP])
                    if (K === "set-cookie")
                        for (let Y of this.cookies) q.push([_, Y]);
                    else q.push([_, z]);
            return q
        }
        toSortedArray() {
            let q = this[wP].size,
                K = Array(q);
            if (q <= 32) {
                if (q === 0) return K;
                let _ = this[wP][Symbol.iterator](),
                    z = _.next().value;
                K[0] = [z[0], z[1].value], F21(z[1].value !== null);
                for (let Y = 1, A = 0, O = 0, w = 0, $ = 0, j, H; Y < q; ++Y) {
                    H = _.next().value, j = K[Y] = [H[0], H[1].value], F21(j[1] !== null), w = 0, O = Y;
                    while (w < O)
                        if ($ = w + (O - w >> 1), K[$][0] <= j[0]) w = $ + 1;
                        else O = $;
                    if (Y !== $) {
                        A = Y;
                        while (A > w) K[A] = K[--A];
                        K[w] = j
                    }
                }
                if (!_.next().done) throw TypeError("Unreachable");
                return K
            } else {
                let _ = 0;
                for (let {
                        0: z,
                        1: {
                            value: Y
                        }
                    }
                    of this[wP]) K[_++] = [z, Y], F21(Y !== null);
                return K.sort(Vr7)
            }
        }
    }
    class Mv {
        #q;
        #K;
        constructor(q = void 0) {
            if (tY.util.markAsUncloneable(this), q === l13) return;
            if (this.#K = new IM8, this.#q = "none", q !== void 0) q = tY.converters.HeadersInit(q, "Headers contructor", "init"), Tr7(this, q)
        }
        append(q, K) {
            tY.brandCheck(this, Mv), tY.argumentLengthCheck(arguments, 2, "Headers.append");
            let _ = "Headers.append";
            return q = tY.converters.ByteString(q, _, "name"), K = tY.converters.ByteString(K, _, "value"), g21(this, q, K)
        }
        delete(q) {
            tY.brandCheck(this, Mv), tY.argumentLengthCheck(arguments, 1, "Headers.delete");
            let K = "Headers.delete";
            if (q = tY.converters.ByteString(q, K, "name"), !Nd6(q)) throw tY.errors.invalidArgument({
                prefix: "Headers.delete",
                value: q,
                type: "header name"
            });
            if (this.#q === "immutable") throw TypeError("immutable");
            if (!this.#K.contains(q, !1)) return;
            this.#K.delete(q, !1)
        }
        get(q) {
            tY.brandCheck(this, Mv), tY.argumentLengthCheck(arguments, 1, "Headers.get");
            let K = "Headers.get";
            if (q = tY.converters.ByteString(q, K, "name"), !Nd6(q)) throw tY.errors.invalidArgument({
                prefix: K,
                value: q,
                type: "header name"
            });
            return this.#K.get(q, !1)
        }
        has(q) {
            tY.brandCheck(this, Mv), tY.argumentLengthCheck(arguments, 1, "Headers.has");
            let K = "Headers.has";
            if (q = tY.converters.ByteString(q, K, "name"), !Nd6(q)) throw tY.errors.invalidArgument({
                prefix: K,
                value: q,
                type: "header name"
            });
            return this.#K.contains(q, !1)
        }
        set(q, K) {
            tY.brandCheck(this, Mv), tY.argumentLengthCheck(arguments, 2, "Headers.set");
            let _ = "Headers.set";
            if (q = tY.converters.ByteString(q, _, "name"), K = tY.converters.ByteString(K, _, "value"), K = vr7(K), !Nd6(q)) throw tY.errors.invalidArgument({
                prefix: _,
                value: q,
                type: "header name"
            });
            else if (!Gr7(K)) throw tY.errors.invalidArgument({
                prefix: _,
                value: K,
                type: "header value"
            });
            if (this.#q === "immutable") throw TypeError("immutable");
            this.#K.set(q, K, !1)
        }
        getSetCookie() {
            tY.brandCheck(this, Mv);
            let q = this.#K.cookies;
            if (q) return [...q];
            return []
        }
        get[yh]() {
            if (this.#K[yh]) return this.#K[yh];
            let q = [],
                K = this.#K.toSortedArray(),
                _ = this.#K.cookies;
            if (_ === null || _.length === 1) return this.#K[yh] = K;
            for (let z = 0; z < K.length; ++z) {
                let {
                    0: Y,
                    1: A
                } = K[z];
                if (Y === "set-cookie")
                    for (let O = 0; O < _.length; ++O) q.push([Y, _[O]]);
                else q.push([Y, A])
            }
            return this.#K[yh] = q
        } [bM8.inspect.custom](q, K) {
            return K.depth ??= q, `Headers ${bM8.formatWithOptions(K,this.#K.entries)}`
        }
        static getHeadersGuard(q) {
            return q.#q
        }
        static setHeadersGuard(q, K) {
            q.#q = K
        }
        static getHeadersList(q) {
            return q.#K
        }
        static setHeadersList(q, K) {
            q.#K = K
        }
    }
    var {
        getHeadersGuard: kr7,
        setHeadersGuard: i13,
        getHeadersList: U21,
        setHeadersList: r13
    } = Mv;
    Reflect.deleteProperty(Mv, "getHeadersGuard");
    Reflect.deleteProperty(Mv, "setHeadersGuard");
    Reflect.deleteProperty(Mv, "getHeadersList");
    Reflect.deleteProperty(Mv, "setHeadersList");
    n13("Headers", Mv, yh, 0, 1);
    Object.defineProperties(Mv.prototype, {
        append: nG6,
        delete: nG6,
        get: nG6,
        has: nG6,
        set: nG6,
        getSetCookie: nG6,
        [Symbol.toStringTag]: {
            value: "Headers",
            configurable: !0
        },
        [bM8.inspect.custom]: {
            enumerable: !1
        }
    });
    tY.converters.HeadersInit = function(q, K, _) {
        if (tY.util.Type(q) === "Object") {
            let z = Reflect.get(q, Symbol.iterator);
            if (!bM8.types.isProxy(q) && z === Mv.prototype.entries) try {
                return U21(q).entriesList
            } catch {}
            if (typeof z === "function") return tY.converters["sequence<sequence<ByteString>>"](q, K, _, z.bind(q));
            return tY.converters["record<ByteString, ByteString>"](q, K, _)
        }
        throw tY.errors.conversionFailed({
            prefix: "Headers constructor",
            argument: "Argument 1",
            types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
        })
    };
    Nr7.exports = {
        fill: Tr7,
        compareHeaderName: Vr7,
        Headers: Mv,
        HeadersList: IM8,
        getHeadersGuard: kr7,
        setHeadersGuard: i13,
        setHeadersList: r13,
        getHeadersList: U21
    }
})
// @from(Ln 61569, Col 4)
yd6 = p((r_O, mr7) => {
    var {
        Headers: Sr7,
        HeadersList: Er7,
        fill: o13,
        getHeadersGuard: a13,
        setHeadersGuard: Cr7,
        setHeadersList: br7
    } = AO6(), {
        extractBody: yr7,
        cloneBody: s13,
        mixinBody: t13,
        hasFinalizationRegistry: Ir7,
        streamRegistry: xr7,
        bodyUnusable: e13
    } = LG6(), Q21 = Hz(), Lr7 = d6("node:util"), {
        kEnumerableProperty: Lh
    } = Q21, {
        isValidReasonPhrase: q73,
        isCancelled: K73,
        isAborted: _73,
        isBlobLike: z73,
        serializeJavascriptValueToJSONString: Y73,
        isErrorLike: A73,
        isomorphicEncode: O73,
        environmentSettingsObject: w73
    } = kh(), {
        redirectStatusSet: $73,
        nullBodyStatus: j73
    } = oQ6(), {
        kState: aj,
        kHeaders: pr
    } = l16(), {
        webidl: Z_
    } = lZ(), {
        FormData: H73
    } = qd6(), {
        URLSerializer: hr7
    } = qE(), {
        kConstruct: uM8
    } = oj(), d21 = d6("node:assert"), {
        types: J73
    } = d6("node:util"), X73 = new TextEncoder("utf-8");
    class Pv {
        static error() {
            return Ed6(mM8(), "immutable")
        }
        static json(q, K = {}) {
            if (Z_.argumentLengthCheck(arguments, 1, "Response.json"), K !== null) K = Z_.converters.ResponseInit(K);
            let _ = X73.encode(Y73(q)),
                z = yr7(_),
                Y = Ed6(iG6({}), "response");
            return Rr7(Y, K, {
                body: z[0],
                type: "application/json"
            }), Y
        }
        static redirect(q, K = 302) {
            Z_.argumentLengthCheck(arguments, 1, "Response.redirect"), q = Z_.converters.USVString(q), K = Z_.converters["unsigned short"](K);
            let _;
            try {
                _ = new URL(q, w73.settingsObject.baseUrl)
            } catch (A) {
                throw TypeError(`Failed to parse URL from ${q}`, {
                    cause: A
                })
            }
            if (!$73.has(K)) throw RangeError(`Invalid status code ${K}`);
            let z = Ed6(iG6({}), "immutable");
            z[aj].status = K;
            let Y = O73(hr7(_));
            return z[aj].headersList.append("location", Y, !0), z
        }
        constructor(q = null, K = {}) {
            if (Z_.util.markAsUncloneable(this), q === uM8) return;
            if (q !== null) q = Z_.converters.BodyInit(q);
            K = Z_.converters.ResponseInit(K), this[aj] = iG6({}), this[pr] = new Sr7(uM8), Cr7(this[pr], "response"), br7(this[pr], this[aj].headersList);
            let _ = null;
            if (q != null) {
                let [z, Y] = yr7(q);
                _ = {
                    body: z,
                    type: Y
                }
            }
            Rr7(this, K, _)
        }
        get type() {
            return Z_.brandCheck(this, Pv), this[aj].type
        }
        get url() {
            Z_.brandCheck(this, Pv);
            let q = this[aj].urlList,
                K = q[q.length - 1] ?? null;
            if (K === null) return "";
            return hr7(K, !0)
        }
        get redirected() {
            return Z_.brandCheck(this, Pv), this[aj].urlList.length > 1
        }
        get status() {
            return Z_.brandCheck(this, Pv), this[aj].status
        }
        get ok() {
            return Z_.brandCheck(this, Pv), this[aj].status >= 200 && this[aj].status <= 299
        }
        get statusText() {
            return Z_.brandCheck(this, Pv), this[aj].statusText
        }
        get headers() {
            return Z_.brandCheck(this, Pv), this[pr]
        }
        get body() {
            return Z_.brandCheck(this, Pv), this[aj].body ? this[aj].body.stream : null
        }
        get bodyUsed() {
            return Z_.brandCheck(this, Pv), !!this[aj].body && Q21.isDisturbed(this[aj].body.stream)
        }
        clone() {
            if (Z_.brandCheck(this, Pv), e13(this)) throw Z_.errors.exception({
                header: "Response.clone",
                message: "Body has already been consumed."
            });
            let q = c21(this[aj]);
            if (Ir7 && this[aj].body?.stream) xr7.register(this, new WeakRef(this[aj].body.stream));
            return Ed6(q, a13(this[pr]))
        } [Lr7.inspect.custom](q, K) {
            if (K.depth === null) K.depth = 2;
            K.colors ??= !0;
            let _ = {
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
            return `Response ${Lr7.formatWithOptions(K,_)}`
        }
    }
    t13(Pv);
    Object.defineProperties(Pv.prototype, {
        type: Lh,
        url: Lh,
        status: Lh,
        ok: Lh,
        redirected: Lh,
        statusText: Lh,
        headers: Lh,
        clone: Lh,
        body: Lh,
        bodyUsed: Lh,
        [Symbol.toStringTag]: {
            value: "Response",
            configurable: !0
        }
    });
    Object.defineProperties(Pv, {
        json: Lh,
        redirect: Lh,
        error: Lh
    });

    function c21(q) {
        if (q.internalResponse) return ur7(c21(q.internalResponse), q.type);
        let K = iG6({
            ...q,
            body: null
        });
        if (q.body != null) K.body = s13(K, q.body);
        return K
    }

    function iG6(q) {
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
            ...q,
            headersList: q?.headersList ? new Er7(q?.headersList) : new Er7,
            urlList: q?.urlList ? [...q.urlList] : []
        }
    }

    function mM8(q) {
        let K = A73(q);
        return iG6({
            type: "error",
            status: 0,
            error: K ? q : Error(q ? String(q) : q),
            aborted: q && q.name === "AbortError"
        })
    }

    function M73(q) {
        return q.type === "error" && q.status === 0
    }

    function xM8(q, K) {
        return K = {
            internalResponse: q,
            ...K
        }, new Proxy(q, {
            get(_, z) {
                return z in K ? K[z] : _[z]
            },
            set(_, z, Y) {
                return d21(!(z in K)), _[z] = Y, !0
            }
        })
    }

    function ur7(q, K) {
        if (K === "basic") return xM8(q, {
            type: "basic",
            headersList: q.headersList
        });
        else if (K === "cors") return xM8(q, {
            type: "cors",
            headersList: q.headersList
        });
        else if (K === "opaque") return xM8(q, {
            type: "opaque",
            urlList: Object.freeze([]),
            status: 0,
            statusText: "",
            body: null
        });
        else if (K === "opaqueredirect") return xM8(q, {
            type: "opaqueredirect",
            status: 0,
            statusText: "",
            headersList: [],
            body: null
        });
        else d21(!1)
    }

    function P73(q, K = null) {
        return d21(K73(q)), _73(q) ? mM8(Object.assign(new DOMException("The operation was aborted.", "AbortError"), {
            cause: K
        })) : mM8(Object.assign(new DOMException("Request was cancelled."), {
            cause: K
        }))
    }

    function Rr7(q, K, _) {
        if (K.status !== null && (K.status < 200 || K.status > 599)) throw RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
        if ("statusText" in K && K.statusText != null) {
            if (!q73(String(K.statusText))) throw TypeError("Invalid statusText")
        }
        if ("status" in K && K.status != null) q[aj].status = K.status;
        if ("statusText" in K && K.statusText != null) q[aj].statusText = K.statusText;
        if ("headers" in K && K.headers != null) o13(q[pr], K.headers);
        if (_) {
            if (j73.includes(q.status)) throw Z_.errors.exception({
                header: "Response constructor",
                message: `Invalid response status code ${q.status}`
            });
            if (q[aj].body = _.body, _.type != null && !q[aj].headersList.contains("content-type", !0)) q[aj].headersList.append("content-type", _.type, !0)
        }
    }

    function Ed6(q, K) {
        let _ = new Pv(uM8);
        if (_[aj] = q, _[pr] = new Sr7(uM8), br7(_[pr], q.headersList), Cr7(_[pr], K), Ir7 && q.body?.stream) xr7.register(_, new WeakRef(q.body.stream));
        return _
    }
    Z_.converters.ReadableStream = Z_.interfaceConverter(ReadableStream);
    Z_.converters.FormData = Z_.interfaceConverter(H73);
    Z_.converters.URLSearchParams = Z_.interfaceConverter(URLSearchParams);
    Z_.converters.XMLHttpRequestBodyInit = function(q, K, _) {
        if (typeof q === "string") return Z_.converters.USVString(q, K, _);
        if (z73(q)) return Z_.converters.Blob(q, K, _, {
            strict: !1
        });
        if (ArrayBuffer.isView(q) || J73.isArrayBuffer(q)) return Z_.converters.BufferSource(q, K, _);
        if (Q21.isFormDataLike(q)) return Z_.converters.FormData(q, K, _, {
            strict: !1
        });
        if (q instanceof URLSearchParams) return Z_.converters.URLSearchParams(q, K, _);
        return Z_.converters.DOMString(q, K, _)
    };
    Z_.converters.BodyInit = function(q, K, _) {
        if (q instanceof ReadableStream) return Z_.converters.ReadableStream(q, K, _);
        if (q?.[Symbol.asyncIterator]) return q;
        return Z_.converters.XMLHttpRequestBodyInit(q, K, _)
    };
    Z_.converters.ResponseInit = Z_.dictionaryConverter([{
        key: "status",
        converter: Z_.converters["unsigned short"],
        defaultValue: () => 200
    }, {
        key: "statusText",
        converter: Z_.converters.ByteString,
        defaultValue: () => ""
    }, {
        key: "headers",
        converter: Z_.converters.HeadersInit
    }]);
    mr7.exports = {
        isNetworkError: M73,
        makeNetworkError: mM8,
        makeResponse: iG6,
        makeAppropriateNetworkError: P73,
        filterResponse: ur7,
        Response: Pv,
        cloneResponse: c21,
        fromInnerResponse: Ed6
    }
})
// @from(Ln 61889, Col 4)
Qr7 = p((o_O, Ur7) => {
    var {
        kConnected: Br7,
        kSize: pr7
    } = oj();
    class Fr7 {
        constructor(q) {
            this.value = q
        }
        deref() {
            return this.value[Br7] === 0 && this.value[pr7] === 0 ? void 0 : this.value
        }
    }
    class gr7 {
        constructor(q) {
            this.finalizer = q
        }
        register(q, K) {
            if (q.on) q.on("disconnect", () => {
                if (q[Br7] === 0 && q[pr7] === 0) this.finalizer(K)
            })
        }
        unregister(q) {}
    }
    Ur7.exports = function() {
        if (process.env.NODE_V8_COVERAGE && process.version.startsWith("v18")) return process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
            WeakRef: Fr7,
            FinalizationRegistry: gr7
        };
        return {
            WeakRef,
            FinalizationRegistry
        }
    }
})
// @from(Ln 61924, Col 4)
rG6 = p((a_O, zo7) => {
    var {
        extractBody: W73,
        mixinBody: D73,
        cloneBody: Z73,
        bodyUnusable: dr7
    } = LG6(), {
        Headers: tr7,
        fill: f73,
        HeadersList: gM8,
        setHeadersGuard: n21,
        getHeadersGuard: G73,
        setHeadersList: er7,
        getHeadersList: cr7
    } = AO6(), {
        FinalizationRegistry: v73
    } = Qr7()(), pM8 = Hz(), lr7 = d6("node:util"), {
        isValidHTTPToken: T73,
        sameOrigin: nr7,
        environmentSettingsObject: BM8
    } = kh(), {
        forbiddenMethodsSet: V73,
        corsSafeListedMethodsSet: k73,
        referrerPolicy: N73,
        requestRedirect: E73,
        requestMode: y73,
        requestCredentials: L73,
        requestCache: h73,
        requestDuplex: R73
    } = oQ6(), {
        kEnumerableProperty: $P,
        normalizedMethodRecordsBase: S73,
        normalizedMethodRecords: C73
    } = pM8, {
        kHeaders: hh,
        kSignal: FM8,
        kState: Yj,
        kDispatcher: l21
    } = l16(), {
        webidl: G3
    } = lZ(), {
        URLSerializer: b73
    } = qE(), {
        kConstruct: UM8
    } = oj(), I73 = d6("node:assert"), {
        getMaxListeners: ir7,
        setMaxListeners: rr7,
        getEventListeners: x73,
        defaultMaxListeners: or7
    } = d6("node:events"), u73 = Symbol("abortController"), qo7 = new v73(({
        signal: q,
        abort: K
    }) => {
        q.removeEventListener("abort", K)
    }), QM8 = new WeakMap;

    function ar7(q) {
        return K;

        function K() {
            let _ = q.deref();
            if (_ !== void 0) {
                qo7.unregister(K), this.removeEventListener("abort", K), _.abort(this.reason);
                let z = QM8.get(_.signal);
                if (z !== void 0) {
                    if (z.size !== 0) {
                        for (let Y of z) {
                            let A = Y.deref();
                            if (A !== void 0) A.abort(this.reason)
                        }
                        z.clear()
                    }
                    QM8.delete(_.signal)
                }
            }
        }
    }
    var sr7 = !1;
    class R2 {
        constructor(q, K = {}) {
            if (G3.util.markAsUncloneable(this), q === UM8) return;
            let _ = "Request constructor";
            G3.argumentLengthCheck(arguments, 1, _), q = G3.converters.RequestInfo(q, _, "input"), K = G3.converters.RequestInit(K, _, "init");
            let z = null,
                Y = null,
                A = BM8.settingsObject.baseUrl,
                O = null;
            if (typeof q === "string") {
                this[l21] = K.dispatcher;
                let D;
                try {
                    D = new URL(q, A)
                } catch (Z) {
                    throw TypeError("Failed to parse URL from " + q, {
                        cause: Z
                    })
                }
                if (D.username || D.password) throw TypeError("Request cannot be constructed from a URL that includes credentials: " + q);
                z = dM8({
                    urlList: [D]
                }), Y = "cors"
            } else this[l21] = K.dispatcher || q[l21], I73(q instanceof R2), z = q[Yj], O = q[FM8];
            let w = BM8.settingsObject.origin,
                $ = "client";
            if (z.window?.constructor?.name === "EnvironmentSettingsObject" && nr7(z.window, w)) $ = z.window;
            if (K.window != null) throw TypeError(`'window' option '${$}' must be null`);
            if ("window" in K) $ = "no-window";
            z = dM8({
                method: z.method,
                headersList: z.headersList,
                unsafeRequest: z.unsafeRequest,
                client: BM8.settingsObject,
                window: $,
                priority: z.priority,
                origin: z.origin,
                referrer: z.referrer,
                referrerPolicy: z.referrerPolicy,
                mode: z.mode,
                credentials: z.credentials,
                cache: z.cache,
                redirect: z.redirect,
                integrity: z.integrity,
                keepalive: z.keepalive,
                reloadNavigation: z.reloadNavigation,
                historyNavigation: z.historyNavigation,
                urlList: [...z.urlList]
            });
            let j = Object.keys(K).length !== 0;
            if (j) {
                if (z.mode === "navigate") z.mode = "same-origin";
                z.reloadNavigation = !1, z.historyNavigation = !1, z.origin = "client", z.referrer = "client", z.referrerPolicy = "", z.url = z.urlList[z.urlList.length - 1], z.urlList = [z.url]
            }
            if (K.referrer !== void 0) {
                let D = K.referrer;
                if (D === "") z.referrer = "no-referrer";
                else {
                    let Z;
                    try {
                        Z = new URL(D, A)
                    } catch (G) {
                        throw TypeError(`Referrer "${D}" is not a valid URL.`, {
                            cause: G
                        })
                    }
                    if (Z.protocol === "about:" && Z.hostname === "client" || w && !nr7(Z, BM8.settingsObject.baseUrl)) z.referrer = "client";
                    else z.referrer = Z
                }
            }
            if (K.referrerPolicy !== void 0) z.referrerPolicy = K.referrerPolicy;
            let H;
            if (K.mode !== void 0) H = K.mode;
            else H = Y;
            if (H === "navigate") throw G3.errors.exception({
                header: "Request constructor",
                message: "invalid request mode navigate."
            });
            if (H != null) z.mode = H;
            if (K.credentials !== void 0) z.credentials = K.credentials;
            if (K.cache !== void 0) z.cache = K.cache;
            if (z.cache === "only-if-cached" && z.mode !== "same-origin") throw TypeError("'only-if-cached' can be set only with 'same-origin' mode");
            if (K.redirect !== void 0) z.redirect = K.redirect;
            if (K.integrity != null) z.integrity = String(K.integrity);
            if (K.keepalive !== void 0) z.keepalive = Boolean(K.keepalive);
            if (K.method !== void 0) {
                let D = K.method,
                    Z = C73[D];
                if (Z !== void 0) z.method = Z;
                else {
                    if (!T73(D)) throw TypeError(`'${D}' is not a valid HTTP method.`);
                    let G = D.toUpperCase();
                    if (V73.has(G)) throw TypeError(`'${D}' HTTP method is unsupported.`);
                    D = S73[G] ?? D, z.method = D
                }
                if (!sr7 && z.method === "patch") process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
                    code: "UNDICI-FETCH-patch"
                }), sr7 = !0
            }
            if (K.signal !== void 0) O = K.signal;
            this[Yj] = z;
            let J = new AbortController;
            if (this[FM8] = J.signal, O != null) {
                if (!O || typeof O.aborted !== "boolean" || typeof O.addEventListener !== "function") throw TypeError("Failed to construct 'Request': member signal is not of type AbortSignal.");
                if (O.aborted) J.abort(O.reason);
                else {
                    this[u73] = J;
                    let D = new WeakRef(J),
                        Z = ar7(D);
                    try {
                        if (typeof ir7 === "function" && ir7(O) === or7) rr7(1500, O);
                        else if (x73(O, "abort").length >= or7) rr7(1500, O)
                    } catch {}
                    pM8.addAbortListener(O, Z), qo7.register(J, {
                        signal: O,
                        abort: Z
                    }, Z)
                }
            }
            if (this[hh] = new tr7(UM8), er7(this[hh], z.headersList), n21(this[hh], "request"), H === "no-cors") {
                if (!k73.has(z.method)) throw TypeError(`'${z.method} is unsupported in no-cors mode.`);
                n21(this[hh], "request-no-cors")
            }
            if (j) {
                let D = cr7(this[hh]),
                    Z = K.headers !== void 0 ? K.headers : new gM8(D);
                if (D.clear(), Z instanceof gM8) {
                    for (let {
                            name: G,
                            value: f
                        }
                        of Z.rawValues()) D.append(G, f, !1);
                    D.cookies = Z.cookies
                } else f73(this[hh], Z)
            }
            let X = q instanceof R2 ? q[Yj].body : null;
            if ((K.body != null || X != null) && (z.method === "GET" || z.method === "HEAD")) throw TypeError("Request with GET/HEAD method cannot have body.");
            let M = null;
            if (K.body != null) {
                let [D, Z] = W73(K.body, z.keepalive);
                if (M = D, Z && !cr7(this[hh]).contains("content-type", !0)) this[hh].append("content-type", Z)
            }
            let P = M ?? X;
            if (P != null && P.source == null) {
                if (M != null && K.duplex == null) throw TypeError("RequestInit: duplex option is required when sending a body.");
                if (z.mode !== "same-origin" && z.mode !== "cors") throw TypeError('If request is made from ReadableStream, mode should be "same-origin" or "cors"');
                z.useCORSPreflightFlag = !0
            }
            let W = P;
            if (M == null && X != null) {
                if (dr7(q)) throw TypeError("Cannot construct a Request with a Request object that has already been used.");
                let D = new TransformStream;
                X.stream.pipeThrough(D), W = {
                    source: X.source,
                    length: X.length,
                    stream: D.readable
                }
            }
            this[Yj].body = W
        }
        get method() {
            return G3.brandCheck(this, R2), this[Yj].method
        }
        get url() {
            return G3.brandCheck(this, R2), b73(this[Yj].url)
        }
        get headers() {
            return G3.brandCheck(this, R2), this[hh]
        }
        get destination() {
            return G3.brandCheck(this, R2), this[Yj].destination
        }
        get referrer() {
            if (G3.brandCheck(this, R2), this[Yj].referrer === "no-referrer") return "";
            if (this[Yj].referrer === "client") return "about:client";
            return this[Yj].referrer.toString()
        }
        get referrerPolicy() {
            return G3.brandCheck(this, R2), this[Yj].referrerPolicy
        }
        get mode() {
            return G3.brandCheck(this, R2), this[Yj].mode
        }
        get credentials() {
            return this[Yj].credentials
        }
        get cache() {
            return G3.brandCheck(this, R2), this[Yj].cache
        }
        get redirect() {
            return G3.brandCheck(this, R2), this[Yj].redirect
        }
        get integrity() {
            return G3.brandCheck(this, R2), this[Yj].integrity
        }
        get keepalive() {
            return G3.brandCheck(this, R2), this[Yj].keepalive
        }
        get isReloadNavigation() {
            return G3.brandCheck(this, R2), this[Yj].reloadNavigation
        }
        get isHistoryNavigation() {
            return G3.brandCheck(this, R2), this[Yj].historyNavigation
        }
        get signal() {
            return G3.brandCheck(this, R2), this[FM8]
        }
        get body() {
            return G3.brandCheck(this, R2), this[Yj].body ? this[Yj].body.stream : null
        }
        get bodyUsed() {
            return G3.brandCheck(this, R2), !!this[Yj].body && pM8.isDisturbed(this[Yj].body.stream)
        }
        get duplex() {
            return G3.brandCheck(this, R2), "half"
        }
        clone() {
            if (G3.brandCheck(this, R2), dr7(this)) throw TypeError("unusable");
            let q = Ko7(this[Yj]),
                K = new AbortController;
            if (this.signal.aborted) K.abort(this.signal.reason);
            else {
                let _ = QM8.get(this.signal);
                if (_ === void 0) _ = new Set, QM8.set(this.signal, _);
                let z = new WeakRef(K);
                _.add(z), pM8.addAbortListener(K.signal, ar7(z))
            }
            return _o7(q, K.signal, G73(this[hh]))
        } [lr7.inspect.custom](q, K) {
            if (K.depth === null) K.depth = 2;
            K.colors ??= !0;
            let _ = {
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
            return `Request ${lr7.formatWithOptions(K,_)}`
        }
    }
    D73(R2);

    function dM8(q) {
        return {
            method: q.method ?? "GET",
            localURLsOnly: q.localURLsOnly ?? !1,
            unsafeRequest: q.unsafeRequest ?? !1,
            body: q.body ?? null,
            client: q.client ?? null,
            reservedClient: q.reservedClient ?? null,
            replacesClientId: q.replacesClientId ?? "",
            window: q.window ?? "client",
            keepalive: q.keepalive ?? !1,
            serviceWorkers: q.serviceWorkers ?? "all",
            initiator: q.initiator ?? "",
            destination: q.destination ?? "",
            priority: q.priority ?? null,
            origin: q.origin ?? "client",
            policyContainer: q.policyContainer ?? "client",
            referrer: q.referrer ?? "client",
            referrerPolicy: q.referrerPolicy ?? "",
            mode: q.mode ?? "no-cors",
            useCORSPreflightFlag: q.useCORSPreflightFlag ?? !1,
            credentials: q.credentials ?? "same-origin",
            useCredentials: q.useCredentials ?? !1,
            cache: q.cache ?? "default",
            redirect: q.redirect ?? "follow",
            integrity: q.integrity ?? "",
            cryptoGraphicsNonceMetadata: q.cryptoGraphicsNonceMetadata ?? "",
            parserMetadata: q.parserMetadata ?? "",
            reloadNavigation: q.reloadNavigation ?? !1,
            historyNavigation: q.historyNavigation ?? !1,
            userActivation: q.userActivation ?? !1,
            taintedOrigin: q.taintedOrigin ?? !1,
            redirectCount: q.redirectCount ?? 0,
            responseTainting: q.responseTainting ?? "basic",
            preventNoCacheCacheControlHeaderModification: q.preventNoCacheCacheControlHeaderModification ?? !1,
            done: q.done ?? !1,
            timingAllowFailed: q.timingAllowFailed ?? !1,
            urlList: q.urlList,
            url: q.urlList[0],
            headersList: q.headersList ? new gM8(q.headersList) : new gM8
        }
    }

    function Ko7(q) {
        let K = dM8({
            ...q,
            body: null
        });
        if (q.body != null) K.body = Z73(K, q.body);
        return K
    }

    function _o7(q, K, _) {
        let z = new R2(UM8);
        return z[Yj] = q, z[FM8] = K, z[hh] = new tr7(UM8), er7(z[hh], q.headersList), n21(z[hh], _), z
    }
    Object.defineProperties(R2.prototype, {
        method: $P,
        url: $P,
        headers: $P,
        redirect: $P,
        clone: $P,
        signal: $P,
        duplex: $P,
        destination: $P,
        body: $P,
        bodyUsed: $P,
        isHistoryNavigation: $P,
        isReloadNavigation: $P,
        keepalive: $P,
        integrity: $P,
        cache: $P,
        credentials: $P,
        attribute: $P,
        referrerPolicy: $P,
        referrer: $P,
        mode: $P,
        [Symbol.toStringTag]: {
            value: "Request",
            configurable: !0
        }
    });
    G3.converters.Request = G3.interfaceConverter(R2);
    G3.converters.RequestInfo = function(q, K, _) {
        if (typeof q === "string") return G3.converters.USVString(q, K, _);
        if (q instanceof R2) return G3.converters.Request(q, K, _);
        return G3.converters.USVString(q, K, _)
    };
    G3.converters.AbortSignal = G3.interfaceConverter(AbortSignal);
    G3.converters.RequestInit = G3.dictionaryConverter([{
        key: "method",
        converter: G3.converters.ByteString
    }, {
        key: "headers",
        converter: G3.converters.HeadersInit
    }, {
        key: "body",
        converter: G3.nullableConverter(G3.converters.BodyInit)
    }, {
        key: "referrer",
        converter: G3.converters.USVString
    }, {
        key: "referrerPolicy",
        converter: G3.converters.DOMString,
        allowedValues: N73
    }, {
        key: "mode",
        converter: G3.converters.DOMString,
        allowedValues: y73
    }, {
        key: "credentials",
        converter: G3.converters.DOMString,
        allowedValues: L73
    }, {
        key: "cache",
        converter: G3.converters.DOMString,
        allowedValues: h73
    }, {
        key: "redirect",
        converter: G3.converters.DOMString,
        allowedValues: E73
    }, {
        key: "integrity",
        converter: G3.converters.DOMString
    }, {
        key: "keepalive",
        converter: G3.converters.boolean
    }, {
        key: "signal",
        converter: G3.nullableConverter((q) => G3.converters.AbortSignal(q, "RequestInit", "signal", {
            strict: !1
        }))
    }, {
        key: "window",
        converter: G3.converters.any
    }, {
        key: "duplex",
        converter: G3.converters.DOMString,
        allowedValues: R73
    }, {
        key: "dispatcher",
        converter: G3.converters.any
    }]);
    zo7.exports = {
        Request: R2,
        makeRequest: dM8,
        fromInnerRequest: _o7,
        cloneRequest: Ko7
    }
})
// @from(Ln 62405, Col 4)
hd6 = p((s_O, fo7) => {
    var {
        makeNetworkError: Dw,
        makeAppropriateNetworkError: cM8,
        filterResponse: i21,
        makeResponse: lM8,
        fromInnerResponse: m73
    } = yd6(), {
        HeadersList: Yo7
    } = AO6(), {
        Request: B73,
        cloneRequest: p73
    } = rG6(), z76 = d6("node:zlib"), {
        bytesMatch: F73,
        makePolicyContainer: g73,
        clonePolicyContainer: U73,
        requestBadPort: Q73,
        TAOCheck: d73,
        appendRequestOriginHeader: c73,
        responseLocationURL: l73,
        requestCurrentURL: mU,
        setRequestReferrerPolicyOnRedirect: n73,
        tryUpgradeRequestToAPotentiallyTrustworthyURL: i73,
        createOpaqueTimingInfo: t21,
        appendFetchMetadata: r73,
        corsCheck: o73,
        crossOriginResourcePolicyCheck: a73,
        determineRequestsReferrer: s73,
        coarsenedSharedCurrentTime: Ld6,
        createDeferredPromise: t73,
        isBlobLike: e73,
        sameOrigin: s21,
        isCancelled: OO6,
        isAborted: Ao7,
        isErrorLike: qq3,
        fullyReadBody: Kq3,
        readableStreamClose: _q3,
        isomorphicEncode: nM8,
        urlIsLocal: zq3,
        urlIsHttpHttpsScheme: e21,
        urlHasHttpsScheme: Yq3,
        clampAndCoarsenConnectionTimingInfo: Aq3,
        simpleRangeHeaderValue: Oq3,
        buildContentRange: wq3,
        createInflate: $q3,
        extractMimeType: jq3
    } = kh(), {
        kState: jo7,
        kDispatcher: Hq3
    } = l16(), wO6 = d6("node:assert"), {
        safelyExtractBody: q$1,
        extractBody: Oo7
    } = LG6(), {
        redirectStatusSet: Ho7,
        nullBodyStatus: Jo7,
        safeMethodsSet: Jq3,
        requestBodyHeader: Xq3,
        subresourceSet: Mq3
    } = oQ6(), Pq3 = d6("node:events"), {
        Readable: Wq3,
        pipeline: Dq3,
        finished: Zq3
    } = d6("node:stream"), {
        addAbortListener: fq3,
        isErrored: Gq3,
        isReadable: iM8,
        bufferToLowerCasedHeaderName: wo7
    } = Hz(), {
        dataURLProcessor: vq3,
        serializeAMimeType: Tq3,
        minimizeSupportedMimeType: Vq3
    } = qE(), {
        getGlobalDispatcher: kq3
    } = SM8(), {
        webidl: Nq3
    } = lZ(), {
        STATUS_CODES: Eq3
    } = d6("node:http"), yq3 = ["GET", "HEAD"], Lq3 = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici", r21;
    class K$1 extends Pq3 {
        constructor(q) {
            super();
            this.dispatcher = q, this.connection = null, this.dump = !1, this.state = "ongoing"
        }
        terminate(q) {
            if (this.state !== "ongoing") return;
            this.state = "terminated", this.connection?.destroy(q), this.emit("terminated", q)
        }
        abort(q) {
            if (this.state !== "ongoing") return;
            if (this.state = "aborted", !q) q = new DOMException("The operation was aborted.", "AbortError");
            this.serializedAbortReason = q, this.connection?.destroy(q), this.emit("terminated", q)
        }
    }

    function hq3(q) {
        Xo7(q, "fetch")
    }

    function Rq3(q, K = void 0) {
        Nq3.argumentLengthCheck(arguments, 1, "globalThis.fetch");
        let _ = t73(),
            z;
        try {
            z = new B73(q, K)
        } catch (H) {
            return _.reject(H), _.promise
        }
        let Y = z[jo7];
        if (z.signal.aborted) return o21(_, Y, null, z.signal.reason), _.promise;
        if (Y.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope") Y.serviceWorkers = "none";
        let O = null,
            w = !1,
            $ = null;
        return fq3(z.signal, () => {
            w = !0, wO6($ != null), $.abort(z.signal.reason);
            let H = O?.deref();
            o21(_, Y, H, z.signal.reason)
        }), $ = Po7({
            request: Y,
            processResponseEndOfBody: hq3,
            processResponse: (H) => {
                if (w) return;
                if (H.aborted) {
                    o21(_, Y, O, $.serializedAbortReason);
                    return
                }
                if (H.type === "error") {
                    _.reject(TypeError("fetch failed", {
                        cause: H.error
                    }));
                    return
                }
                O = new WeakRef(m73(H, "immutable")), _.resolve(O.deref()), _ = null
            },
            dispatcher: z[Hq3]
        }), _.promise
    }

    function Xo7(q, K = "other") {
        if (q.type === "error" && q.aborted) return;
        if (!q.urlList?.length) return;
        let _ = q.urlList[0],
            z = q.timingInfo,
            Y = q.cacheState;
        if (!e21(_)) return;
        if (z === null) return;
        if (!q.timingAllowPassed) z = t21({
            startTime: z.startTime
        }), Y = "";
        z.endTime = Ld6(), q.timingInfo = z, Mo7(z, _.href, K, globalThis, Y)
    }
    var Mo7 = performance.markResourceTiming;

    function o21(q, K, _, z) {
        if (q) q.reject(z);
        if (K.body != null && iM8(K.body?.stream)) K.body.stream.cancel(z).catch((A) => {
            if (A.code === "ERR_INVALID_STATE") return;
            throw A
        });
        if (_ == null) return;
        let Y = _[jo7];
        if (Y.body != null && iM8(Y.body?.stream)) Y.body.stream.cancel(z).catch((A) => {
            if (A.code === "ERR_INVALID_STATE") return;
            throw A
        })
    }

    function Po7({
        request: q,
        processRequestBodyChunkLength: K,
        processRequestEndOfBody: _,
        processResponse: z,
        processResponseEndOfBody: Y,
        processResponseConsumeBody: A,
        useParallelQueue: O = !1,
        dispatcher: w = kq3()
    }) {
        wO6(w);
        let $ = null,
            j = !1;
        if (q.client != null) $ = q.client.globalObject, j = q.client.crossOriginIsolatedCapability;
        let H = Ld6(j),
            J = t21({
                startTime: H
            }),
            X = {
                controller: new K$1(w),
                request: q,
                timingInfo: J,
                processRequestBodyChunkLength: K,
                processRequestEndOfBody: _,
                processResponse: z,
                processResponseConsumeBody: A,
                processResponseEndOfBody: Y,
                taskDestination: $,
                crossOriginIsolatedCapability: j
            };
        if (wO6(!q.body || q.body.stream), q.window === "client") q.window = q.client?.globalObject?.constructor?.name === "Window" ? q.client : "no-window";
        if (q.origin === "client") q.origin = q.client.origin;
        if (q.policyContainer === "client")
            if (q.client != null) q.policyContainer = U73(q.client.policyContainer);
            else q.policyContainer = g73();
        if (!q.headersList.contains("accept", !0)) q.headersList.append("accept", "*/*", !0);
        if (!q.headersList.contains("accept-language", !0)) q.headersList.append("accept-language", "*", !0);
        if (q.priority === null);
        if (Mq3.has(q.destination));
        return Wo7(X).catch((M) => {
            X.controller.terminate(M)
        }), X.controller
    }
    async function Wo7(q, K = !1) {
        let _ = q.request,
            z = null;
        if (_.localURLsOnly && !zq3(mU(_))) z = Dw("local URLs only");
        if (i73(_), Q73(_) === "blocked") z = Dw("bad port");
        if (_.referrerPolicy === "") _.referrerPolicy = _.policyContainer.referrerPolicy;
        if (_.referrer !== "no-referrer") _.referrer = s73(_);
        if (z === null) z = await (async () => {
            let A = mU(_);
            if (s21(A, _.url) && _.responseTainting === "basic" || A.protocol === "data:" || (_.mode === "navigate" || _.mode === "websocket")) return _.responseTainting = "basic", await $o7(q);
            if (_.mode === "same-origin") return Dw('request mode cannot be "same-origin"');
            if (_.mode === "no-cors") {
                if (_.redirect !== "follow") return Dw('redirect mode cannot be "follow" for "no-cors" request');
                return _.responseTainting = "opaque", await $o7(q)
            }
            if (!e21(mU(_))) return Dw("URL scheme must be a HTTP(S) scheme");
            return _.responseTainting = "cors", await Do7(q)
        })();
        if (K) return z;
        if (z.status !== 0 && !z.internalResponse) {
            if (_.responseTainting === "cors");
            if (_.responseTainting === "basic") z = i21(z, "basic");
            else if (_.responseTainting === "cors") z = i21(z, "cors");
            else if (_.responseTainting === "opaque") z = i21(z, "opaque");
            else wO6(!1)
        }
        let Y = z.status === 0 ? z : z.internalResponse;
        if (Y.urlList.length === 0) Y.urlList.push(..._.urlList);
        if (!_.timingAllowFailed) z.timingAllowPassed = !0;
        if (z.type === "opaque" && Y.status === 206 && Y.rangeRequested && !_.headers.contains("range", !0)) z = Y = Dw();
        if (z.status !== 0 && (_.method === "HEAD" || _.method === "CONNECT" || Jo7.includes(Y.status))) Y.body = null, q.controller.dump = !0;
        if (_.integrity) {
            let A = (w) => a21(q, Dw(w));
            if (_.responseTainting === "opaque" || z.body == null) {
                A(z.error);
                return
            }
            let O = (w) => {
                if (!F73(w, _.integrity)) {
                    A("integrity mismatch");
                    return
                }
                z.body = q$1(w)[0], a21(q, z)
            };
            await Kq3(z.body, O, A)
        } else a21(q, z)
    }

    function $o7(q) {
        if (OO6(q) && q.request.redirectCount === 0) return Promise.resolve(cM8(q));
        let {
            request: K
        } = q, {
            protocol: _
        } = mU(K);
        switch (_) {
            case "about:":
                return Promise.resolve(Dw("about scheme is not supported"));
            case "blob:": {
                if (!r21) r21 = d6("node:buffer").resolveObjectURL;
                let z = mU(K);
                if (z.search.length !== 0) return Promise.resolve(Dw("NetworkError when attempting to fetch resource."));
                let Y = r21(z.toString());
                if (K.method !== "GET" || !e73(Y)) return Promise.resolve(Dw("invalid method"));
                let A = lM8(),
                    O = Y.size,
                    w = nM8(`${O}`),
                    $ = Y.type;
                if (!K.headersList.contains("range", !0)) {
                    let j = Oo7(Y);
                    A.statusText = "OK", A.body = j[0], A.headersList.set("content-length", w, !0), A.headersList.set("content-type", $, !0)
                } else {
                    A.rangeRequested = !0;
                    let j = K.headersList.get("range", !0),
                        H = Oq3(j, !0);
                    if (H === "failure") return Promise.resolve(Dw("failed to fetch the data URL"));
                    let {
                        rangeStartValue: J,
                        rangeEndValue: X
                    } = H;
                    if (J === null) J = O - X, X = J + X - 1;
                    else {
                        if (J >= O) return Promise.resolve(Dw("Range start is greater than the blob's size."));
                        if (X === null || X >= O) X = O - 1
                    }
                    let M = Y.slice(J, X, $),
                        P = Oo7(M);
                    A.body = P[0];
                    let W = nM8(`${M.size}`),
                        D = wq3(J, X, O);
                    A.status = 206, A.statusText = "Partial Content", A.headersList.set("content-length", W, !0), A.headersList.set("content-type", $, !0), A.headersList.set("content-range", D, !0)
                }
                return Promise.resolve(A)
            }
            case "data:": {
                let z = mU(K),
                    Y = vq3(z);
                if (Y === "failure") return Promise.resolve(Dw("failed to fetch the data URL"));
                let A = Tq3(Y.mimeType);
                return Promise.resolve(lM8({
                    statusText: "OK",
                    headersList: [
                        ["content-type", {
                            name: "Content-Type",
                            value: A
                        }]
                    ],
                    body: q$1(Y.body)[0]
                }))
            }
            case "file:":
                return Promise.resolve(Dw("not implemented... yet..."));
            case "http:":
            case "https:":
                return Do7(q).catch((z) => Dw(z));
            default:
                return Promise.resolve(Dw("unknown scheme"))
        }
    }

    function Sq3(q, K) {
        if (q.request.done = !0, q.processResponseDone != null) queueMicrotask(() => q.processResponseDone(K))
    }

    function a21(q, K) {
        let _ = q.timingInfo,
            z = () => {
                let A = Date.now();
                if (q.request.destination === "document") q.controller.fullTimingInfo = _;
                q.controller.reportTimingSteps = () => {
                    if (q.request.url.protocol !== "https:") return;
                    _.endTime = A;
                    let {
                        cacheState: w,
                        bodyInfo: $
                    } = K;
                    if (!K.timingAllowPassed) _ = t21(_), w = "";
                    let j = 0;
                    if (q.request.mode !== "navigator" || !K.hasCrossOriginRedirects) {
                        j = K.status;
                        let H = jq3(K.headersList);
                        if (H !== "failure") $.contentType = Vq3(H)
                    }
                    if (q.request.initiatorType != null) Mo7(_, q.request.url.href, q.request.initiatorType, globalThis, w, $, j)
                };
                let O = () => {
                    if (q.request.done = !0, q.processResponseEndOfBody != null) queueMicrotask(() => q.processResponseEndOfBody(K));
                    if (q.request.initiatorType != null) q.controller.reportTimingSteps()
                };
                queueMicrotask(() => O())
            };
        if (q.processResponse != null) queueMicrotask(() => {
            q.processResponse(K), q.processResponse = null
        });
        let Y = K.type === "error" ? K : K.internalResponse ?? K;
        if (Y.body == null) z();
        else Zq3(Y.body.stream, () => {
            z()
        })
    }
    async function Do7(q) {
        let K = q.request,
            _ = null,
            z = null,
            Y = q.timingInfo;
        if (K.serviceWorkers === "all");
        if (_ === null) {
            if (K.redirect === "follow") K.serviceWorkers = "none";
            if (z = _ = await Zo7(q), K.responseTainting === "cors" && o73(K, _) === "failure") return Dw("cors failure");
            if (d73(K, _) === "failure") K.timingAllowFailed = !0
        }
        if ((K.responseTainting === "opaque" || _.type === "opaque") && a73(K.origin, K.client, K.destination, z) === "blocked") return Dw("blocked");
        if (Ho7.has(z.status)) {
            if (K.redirect !== "manual") q.controller.connection.destroy(void 0, !1);
            if (K.redirect === "error") _ = Dw("unexpected redirect");
            else if (K.redirect === "manual") _ = z;
            else if (K.redirect === "follow") _ = await Cq3(q, _);
            else wO6(!1)
        }
        return _.timingInfo = Y, _
    }

    function Cq3(q, K) {
        let _ = q.request,
            z = K.internalResponse ? K.internalResponse : K,
            Y;
        try {
            if (Y = l73(z, mU(_).hash), Y == null) return K
        } catch (O) {
            return Promise.resolve(Dw(O))
        }
        if (!e21(Y)) return Promise.resolve(Dw("URL scheme must be a HTTP(S) scheme"));
        if (_.redirectCount === 20) return Promise.resolve(Dw("redirect count exceeded"));
        if (_.redirectCount += 1, _.mode === "cors" && (Y.username || Y.password) && !s21(_, Y)) return Promise.resolve(Dw('cross origin not allowed for request mode "cors"'));
        if (_.responseTainting === "cors" && (Y.username || Y.password)) return Promise.resolve(Dw('URL cannot contain credentials for request mode "cors"'));
        if (z.status !== 303 && _.body != null && _.body.source == null) return Promise.resolve(Dw());
        if ([301, 302].includes(z.status) && _.method === "POST" || z.status === 303 && !yq3.includes(_.method)) {
            _.method = "GET", _.body = null;
            for (let O of Xq3) _.headersList.delete(O)
        }
        if (!s21(mU(_), Y)) _.headersList.delete("authorization", !0), _.headersList.delete("proxy-authorization", !0), _.headersList.delete("cookie", !0), _.headersList.delete("host", !0);
        if (_.body != null) wO6(_.body.source != null), _.body = q$1(_.body.source)[0];
        let A = q.timingInfo;
        if (A.redirectEndTime = A.postRedirectStartTime = Ld6(q.crossOriginIsolatedCapability), A.redirectStartTime === 0) A.redirectStartTime = A.startTime;
        return _.urlList.push(Y), n73(_, z), Wo7(q, !0)
    }
    async function Zo7(q, K = !1, _ = !1) {
        let z = q.request,
            Y = null,
            A = null,
            O = null,
            w = null,
            $ = !1;
        if (z.window === "no-window" && z.redirect === "error") Y = q, A = z;
        else A = p73(z), Y = {
            ...q
        }, Y.request = A;
        let j = z.credentials === "include" || z.credentials === "same-origin" && z.responseTainting === "basic",
            H = A.body ? A.body.length : null,
            J = null;
        if (A.body == null && ["POST", "PUT"].includes(A.method)) J = "0";
        if (H != null) J = nM8(`${H}`);
        if (J != null) A.headersList.append("content-length", J, !0);
        if (H != null && A.keepalive);
        if (A.referrer instanceof URL) A.headersList.append("referer", nM8(A.referrer.href), !0);
        if (c73(A), r73(A), !A.headersList.contains("user-agent", !0)) A.headersList.append("user-agent", Lq3);
        if (A.cache === "default" && (A.headersList.contains("if-modified-since", !0) || A.headersList.contains("if-none-match", !0) || A.headersList.contains("if-unmodified-since", !0) || A.headersList.contains("if-match", !0) || A.headersList.contains("if-range", !0))) A.cache = "no-store";
        if (A.cache === "no-cache" && !A.preventNoCacheCacheControlHeaderModification && !A.headersList.contains("cache-control", !0)) A.headersList.append("cache-control", "max-age=0", !0);
        if (A.cache === "no-store" || A.cache === "reload") {
            if (!A.headersList.contains("pragma", !0)) A.headersList.append("pragma", "no-cache", !0);
            if (!A.headersList.contains("cache-control", !0)) A.headersList.append("cache-control", "no-cache", !0)
        }
        if (A.headersList.contains("range", !0)) A.headersList.append("accept-encoding", "identity", !0);
        if (!A.headersList.contains("accept-encoding", !0))
            if (Yq3(mU(A))) A.headersList.append("accept-encoding", "br, gzip, deflate", !0);
            else A.headersList.append("accept-encoding", "gzip, deflate", !0);
        if (A.headersList.delete("host", !0), w == null) A.cache = "no-store";
        if (A.cache !== "no-store" && A.cache !== "reload");
        if (O == null) {
            if (A.cache === "only-if-cached") return Dw("only if cached");
            let X = await bq3(Y, j, _);
            if (!Jq3.has(A.method) && X.status >= 200 && X.status <= 399);
            if ($ && X.status === 304);
            if (O == null) O = X
        }
        if (O.urlList = [...A.urlList], A.headersList.contains("range", !0)) O.rangeRequested = !0;
        if (O.requestIncludesCredentials = j, O.status === 407) {
            if (z.window === "no-window") return Dw();
            if (OO6(q)) return cM8(q);
            return Dw("proxy authentication required")
        }
        if (O.status === 421 && !_ && (z.body == null || z.body.source != null)) {
            if (OO6(q)) return cM8(q);
            q.controller.connection.destroy(), O = await Zo7(q, K, !0)
        }
        return O
    }
    async function bq3(q, K = !1, _ = !1) {
        wO6(!q.controller.connection || q.controller.connection.destroyed), q.controller.connection = {
            abort: null,
            destroyed: !1,
            destroy(P, W = !0) {
                if (!this.destroyed) {
                    if (this.destroyed = !0, W) this.abort?.(P ?? new DOMException("The operation was aborted.", "AbortError"))
                }
            }
        };
        let z = q.request,
            Y = null,
            A = q.timingInfo;
        if (!0) z.cache = "no-store";
        let w = _ ? "yes" : "no";
        if (z.mode === "websocket");
        let $ = null;
        if (z.body == null && q.processRequestEndOfBody) queueMicrotask(() => q.processRequestEndOfBody());
        else if (z.body != null) {
            let P = async function*(Z) {
                if (OO6(q)) return;
                yield Z, q.processRequestBodyChunkLength?.(Z.byteLength)
            }, W = () => {
                if (OO6(q)) return;
                if (q.processRequestEndOfBody) q.processRequestEndOfBody()
            }, D = (Z) => {
                if (OO6(q)) return;
                if (Z.name === "AbortError") q.controller.abort();
                else q.controller.terminate(Z)
            };
            $ = async function*() {
                try {
                    for await (let Z of z.body.stream) yield* P(Z);
                    W()
                } catch (Z) {
                    D(Z)
                }
            }()
        }
        try {
            let {
                body: P,
                status: W,
                statusText: D,
                headersList: Z,
                socket: G
            } = await M({
                body: $
            });
            if (G) Y = lM8({
                status: W,
                statusText: D,
                headersList: Z,
                socket: G
            });
            else {
                let f = P[Symbol.asyncIterator]();
                q.controller.next = () => f.next(), Y = lM8({
                    status: W,
                    statusText: D,
                    headersList: Z
                })
            }
        } catch (P) {
            if (P.name === "AbortError") return q.controller.connection.destroy(), cM8(q, P);
            return Dw(P)
        }
        let j = async () => {
            await q.controller.resume()
        }, H = (P) => {
            if (!OO6(q)) q.controller.abort(P)
        }, J = new ReadableStream({
            async start(P) {
                q.controller.controller = P
            },
            async pull(P) {
                await j(P)
            },
            async cancel(P) {
                await H(P)
            },
            type: "bytes"
        });
        Y.body = {
            stream: J,
            source: null,
            length: null
        }, q.controller.onAborted = X, q.controller.on("terminated", X), q.controller.resume = async () => {
            while (!0) {
                let P, W;
                try {
                    let {
                        done: Z,
                        value: G
                    } = await q.controller.next();
                    if (Ao7(q)) break;
                    P = Z ? void 0 : G
                } catch (Z) {
                    if (q.controller.ended && !A.encodedBodySize) P = void 0;
                    else P = Z, W = !0
                }
                if (P === void 0) {
                    _q3(q.controller.controller), Sq3(q, Y);
                    return
                }
                if (A.decodedBodySize += P?.byteLength ?? 0, W) {
                    q.controller.terminate(P);
                    return
                }
                let D = new Uint8Array(P);
                if (D.byteLength) q.controller.controller.enqueue(D);
                if (Gq3(J)) {
                    q.controller.terminate();
                    return
                }
                if (q.controller.controller.desiredSize <= 0) return
            }
        };

        function X(P) {
            if (Ao7(q)) {
                if (Y.aborted = !0, iM8(J)) q.controller.controller.error(q.controller.serializedAbortReason)
            } else if (iM8(J)) q.controller.controller.error(TypeError("terminated", {
                cause: qq3(P) ? P : void 0
            }));
            q.controller.connection.destroy()
        }
        return Y;

        function M({
            body: P
        }) {
            let W = mU(z),
                D = q.controller.dispatcher;
            return new Promise((Z, G) => D.dispatch({
                path: W.pathname + W.search,
                origin: W.origin,
                method: z.method,
                body: D.isMockActive ? z.body && (z.body.source || z.body.stream) : P,
                headers: z.headersList.entries,
                maxRedirections: 0,
                upgrade: z.mode === "websocket" ? "websocket" : void 0
            }, {
                body: null,
                abort: null,
                onConnect(f) {
                    let {
                        connection: v
                    } = q.controller;
                    if (A.finalConnectionTimingInfo = Aq3(void 0, A.postRedirectStartTime, q.crossOriginIsolatedCapability), v.destroyed) f(new DOMException("The operation was aborted.", "AbortError"));
                    else q.controller.on("terminated", f), this.abort = v.abort = f;
                    A.finalNetworkRequestStartTime = Ld6(q.crossOriginIsolatedCapability)
                },
                onResponseStarted() {
                    A.finalNetworkResponseStartTime = Ld6(q.crossOriginIsolatedCapability)
                },
                onHeaders(f, v, V, k) {
                    if (f < 200) return;
                    let N = "",
                        R = new Yo7;
                    for (let B = 0; B < v.length; B += 2) R.append(wo7(v[B]), v[B + 1].toString("latin1"), !0);
                    N = R.get("location", !0), this.body = new Wq3({
                        read: V
                    });
                    let h = [],
                        C = N && z.redirect === "follow" && Ho7.has(f);
                    if (z.method !== "HEAD" && z.method !== "CONNECT" && !Jo7.includes(f) && !C) {
                        let B = R.get("content-encoding", !0),
                            m = B ? B.toLowerCase().split(",") : [],
                            S = 5;
                        if (m.length > 5) return G(Error(`too many content-encodings in response: ${m.length}, maximum allowed is 5`)), !0;
                        for (let F = m.length - 1; F >= 0; --F) {
                            let U = m[F].trim();
                            if (U === "x-gzip" || U === "gzip") h.push(z76.createGunzip({
                                flush: z76.constants.Z_SYNC_FLUSH,
                                finishFlush: z76.constants.Z_SYNC_FLUSH
                            }));
                            else if (U === "deflate") h.push($q3({
                                flush: z76.constants.Z_SYNC_FLUSH,
                                finishFlush: z76.constants.Z_SYNC_FLUSH
                            }));
                            else if (U === "br") h.push(z76.createBrotliDecompress({
                                flush: z76.constants.BROTLI_OPERATION_FLUSH,
                                finishFlush: z76.constants.BROTLI_OPERATION_FLUSH
                            }));
                            else {
                                h.length = 0;
                                break
                            }
                        }
                    }
                    let x = this.onError.bind(this);
                    return Z({
                        status: f,
                        statusText: k,
                        headersList: R,
                        body: h.length ? Dq3(this.body, ...h, (B) => {
                            if (B) this.onError(B)
                        }).on("error", x) : this.body.on("error", x)
                    }), !0
                },
                onData(f) {
                    if (q.controller.dump) return;
                    let v = f;
                    return A.encodedBodySize += v.byteLength, this.body.push(v)
                },
                onComplete() {
                    if (this.abort) q.controller.off("terminated", this.abort);
                    if (q.controller.onAborted) q.controller.off("terminated", q.controller.onAborted);
                    q.controller.ended = !0, this.body.push(null)
                },
                onError(f) {
                    if (this.abort) q.controller.off("terminated", this.abort);
                    this.body?.destroy(f), q.controller.terminate(f), G(f)
                },
                onUpgrade(f, v, V) {
                    if (f !== 101) return;
                    let k = new Yo7;
                    for (let N = 0; N < v.length; N += 2) k.append(wo7(v[N]), v[N + 1].toString("latin1"), !0);
                    return Z({
                        status: f,
                        statusText: Eq3[f],
                        headersList: k,
                        socket: V
                    }), !0
                }
            }))
        }
    }
    fo7.exports = {
        fetch: Rq3,
        Fetch: K$1,
        fetching: Po7,
        finalizeAndReportTiming: Xo7
    }
})
// @from(Ln 63108, Col 4)
_$1 = p((t_O, Go7) => {
    Go7.exports = {
        kState: Symbol("FileReader state"),
        kResult: Symbol("FileReader result"),
        kError: Symbol("FileReader error"),
        kLastProgressEventFired: Symbol("FileReader last progress event fired timestamp"),
        kEvents: Symbol("FileReader events"),
        kAborted: Symbol("FileReader aborted")
    }
})
// @from(Ln 63118, Col 4)
To7 = p((e_O, vo7) => {
    var {
        webidl: Rh
    } = lZ(), rM8 = Symbol("ProgressEvent state");
    class Rd6 extends Event {
        constructor(q, K = {}) {
            q = Rh.converters.DOMString(q, "ProgressEvent constructor", "type"), K = Rh.converters.ProgressEventInit(K ?? {});
            super(q, K);
            this[rM8] = {
                lengthComputable: K.lengthComputable,
                loaded: K.loaded,
                total: K.total
            }
        }
        get lengthComputable() {
            return Rh.brandCheck(this, Rd6), this[rM8].lengthComputable
        }
        get loaded() {
            return Rh.brandCheck(this, Rd6), this[rM8].loaded
        }
        get total() {
            return Rh.brandCheck(this, Rd6), this[rM8].total
        }
    }
    Rh.converters.ProgressEventInit = Rh.dictionaryConverter([{
        key: "lengthComputable",
        converter: Rh.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "loaded",
        converter: Rh.converters["unsigned long long"],
        defaultValue: () => 0
    }, {
        key: "total",
        converter: Rh.converters["unsigned long long"],
        defaultValue: () => 0
    }, {
        key: "bubbles",
        converter: Rh.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "cancelable",
        converter: Rh.converters.boolean,
        defaultValue: () => !1
    }, {
        key: "composed",
        converter: Rh.converters.boolean,
        defaultValue: () => !1
    }]);
    vo7.exports = {
        ProgressEvent: Rd6
    }
})
// @from(Ln 63171, Col 4)
ko7 = p((qzO, Vo7) => {
    function Iq3(q) {
        if (!q) return "failure";
        switch (q.trim().toLowerCase()) {
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
    Vo7.exports = {
        getEncoding: Iq3
    }
})