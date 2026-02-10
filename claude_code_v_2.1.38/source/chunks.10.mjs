
// @from(Ln 33608, Col 4)
kw1 = v(() => {
    vw1 = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date, GY8 = new Set, oI6 = typeof process === "object" && !!process ? process : {}, za1 = globalThis.AbortController, WY8 = globalThis.AbortSignal;
    if (typeof za1 > "u") {
        WY8 = class {
            onabort;
            _onabort = [];
            reason;
            aborted = !1;
            addEventListener(Y, z) {
                this._onabort.push(z)
            }
        }, za1 = class {
            constructor() {
                q()
            }
            signal = new WY8;
            abort(Y) {
                if (this.signal.aborted) return;
                this.signal.reason = Y, this.signal.aborted = !0;
                for (let z of this.signal._onabort) z(Y);
                this.signal.onabort?.(Y)
            }
        };
        let A = oI6.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1",
            q = () => {
                if (!A) return;
                A = !1, ZY8("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", q)
            }
    }
    Llz = Symbol("type");
    RT1 = class RT1 extends Array {
        constructor(A) {
            super(A);
            this.fill(0)
        }
    };
    ZT = class ZT {
        #A;
        #q;
        #K;
        #z;
        #Y;
        #$;
        ttl;
        ttlResolution;
        ttlAutopurge;
        updateAgeOnGet;
        updateAgeOnHas;
        allowStale;
        noDisposeOnSet;
        noUpdateTTL;
        maxEntrySize;
        sizeCalculation;
        noDeleteOnFetchRejection;
        noDeleteOnStaleGet;
        allowStaleOnFetchAbort;
        allowStaleOnFetchRejection;
        ignoreFetchAbort;
        #w;
        #_;
        #J;
        #O;
        #H;
        #D;
        #P;
        #W;
        #j;
        #V;
        #M;
        #N;
        #f;
        #Z;
        #T;
        #E;
        #G;
        static unsafeExposeInternals(A) {
            return {
                starts: A.#f,
                ttls: A.#Z,
                sizes: A.#N,
                keyMap: A.#J,
                keyList: A.#O,
                valList: A.#H,
                next: A.#D,
                prev: A.#P,
                get head() {
                    return A.#W
                },
                get tail() {
                    return A.#j
                },
                free: A.#V,
                isBackgroundFetch: (q) => A.#X(q),
                backgroundFetch: (q, K, Y, z) => A.#b(q, K, Y, z),
                moveToTail: (q) => A.#h(q),
                indexes: (q) => A.#k(q),
                rindexes: (q) => A.#L(q),
                isStale: (q) => A.#v(q)
            }
        }
        get max() {
            return this.#A
        }
        get maxSize() {
            return this.#q
        }
        get calculatedSize() {
            return this.#_
        }
        get size() {
            return this.#w
        }
        get fetchMethod() {
            return this.#Y
        }
        get memoMethod() {
            return this.#$
        }
        get dispose() {
            return this.#K
        }
        get disposeAfter() {
            return this.#z
        }
        constructor(A) {
            let {
                max: q = 0,
                ttl: K,
                ttlResolution: Y = 1,
                ttlAutopurge: z,
                updateAgeOnGet: w,
                updateAgeOnHas: H,
                allowStale: $,
                dispose: O,
                disposeAfter: _,
                noDisposeOnSet: J,
                noUpdateTTL: X,
                maxSize: D = 0,
                maxEntrySize: j = 0,
                sizeCalculation: M,
                fetchMethod: P,
                memoMethod: W,
                noDeleteOnFetchRejection: G,
                noDeleteOnStaleGet: f,
                allowStaleOnFetchRejection: Z,
                allowStaleOnFetchAbort: N,
                ignoreFetchAbort: T
            } = A;
            if (q !== 0 && !Zi(q)) throw TypeError("max option must be a nonnegative integer");
            let k = q ? fY8(q) : Array;
            if (!k) throw Error("invalid max value: " + q);
            if (this.#A = q, this.#q = D, this.maxEntrySize = j || this.#q, this.sizeCalculation = M, this.sizeCalculation) {
                if (!this.#q && !this.maxEntrySize) throw TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
                if (typeof this.sizeCalculation !== "function") throw TypeError("sizeCalculation set to non-function")
            }
            if (W !== void 0 && typeof W !== "function") throw TypeError("memoMethod must be a function if defined");
            if (this.#$ = W, P !== void 0 && typeof P !== "function") throw TypeError("fetchMethod must be a function if specified");
            if (this.#Y = P, this.#E = !!P, this.#J = new Map, this.#O = Array(q).fill(void 0), this.#H = Array(q).fill(void 0), this.#D = new k(q), this.#P = new k(q), this.#W = 0, this.#j = 0, this.#V = Ew1.create(q), this.#w = 0, this.#_ = 0, typeof O === "function") this.#K = O;
            if (typeof _ === "function") this.#z = _, this.#M = [];
            else this.#z = void 0, this.#M = void 0;
            if (this.#T = !!this.#K, this.#G = !!this.#z, this.noDisposeOnSet = !!J, this.noUpdateTTL = !!X, this.noDeleteOnFetchRejection = !!G, this.allowStaleOnFetchRejection = !!Z, this.allowStaleOnFetchAbort = !!N, this.ignoreFetchAbort = !!T, this.maxEntrySize !== 0) {
                if (this.#q !== 0) {
                    if (!Zi(this.#q)) throw TypeError("maxSize must be a positive integer if specified")
                }
                if (!Zi(this.maxEntrySize)) throw TypeError("maxEntrySize must be a positive integer if specified");
                this.#U()
            }
            if (this.allowStale = !!$, this.noDeleteOnStaleGet = !!f, this.updateAgeOnGet = !!w, this.updateAgeOnHas = !!H, this.ttlResolution = Zi(Y) || Y === 0 ? Y : 1, this.ttlAutopurge = !!z, this.ttl = K || 0, this.ttl) {
                if (!Zi(this.ttl)) throw TypeError("ttl must be a positive integer if specified");
                this.#u()
            }
            if (this.#A === 0 && this.ttl === 0 && this.#q === 0) throw TypeError("At least one of max, maxSize, or ttl is required");
            if (!this.ttlAutopurge && !this.#A && !this.#q) {
                if (bzK("LRU_CACHE_UNBOUNDED")) GY8.add("LRU_CACHE_UNBOUNDED"), ZY8("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", "LRU_CACHE_UNBOUNDED", ZT)
            }
        }
        getRemainingTTL(A) {
            return this.#J.has(A) ? 1 / 0 : 0
        }
        #u() {
            let A = new RT1(this.#A),
                q = new RT1(this.#A);
            this.#Z = A, this.#f = q, this.#B = (z, w, H = vw1.now()) => {
                if (q[z] = w !== 0 ? H : 0, A[z] = w, w !== 0 && this.ttlAutopurge) {
                    let $ = setTimeout(() => {
                        if (this.#v(z)) this.#R(this.#O[z], "expire")
                    }, w + 1);
                    if ($.unref) $.unref()
                }
            }, this.#C = (z) => {
                q[z] = A[z] !== 0 ? vw1.now() : 0
            }, this.#y = (z, w) => {
                if (A[w]) {
                    let H = A[w],
                        $ = q[w];
                    if (!H || !$) return;
                    z.ttl = H, z.start = $, z.now = K || Y();
                    let O = z.now - $;
                    z.remainingTTL = H - O
                }
            };
            let K = 0,
                Y = () => {
                    let z = vw1.now();
                    if (this.ttlResolution > 0) {
                        K = z;
                        let w = setTimeout(() => K = 0, this.ttlResolution);
                        if (w.unref) w.unref()
                    }
                    return z
                };
            this.getRemainingTTL = (z) => {
                let w = this.#J.get(z);
                if (w === void 0) return 0;
                let H = A[w],
                    $ = q[w];
                if (!H || !$) return 1 / 0;
                let O = (K || Y()) - $;
                return H - O
            }, this.#v = (z) => {
                let w = q[z],
                    H = A[z];
                return !!H && !!w && (K || Y()) - w > H
            }
        }
        #C = () => {};
        #y = () => {};
        #B = () => {};
        #v = () => !1;
        #U() {
            let A = new RT1(this.#A);
            this.#_ = 0, this.#N = A, this.#S = (q) => {
                this.#_ -= A[q], A[q] = 0
            }, this.#m = (q, K, Y, z) => {
                if (this.#X(K)) return 0;
                if (!Zi(Y))
                    if (z) {
                        if (typeof z !== "function") throw TypeError("sizeCalculation must be a function");
                        if (Y = z(K, q), !Zi(Y)) throw TypeError("sizeCalculation return invalid (expect positive integer)")
                    } else throw TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
                return Y
            }, this.#I = (q, K, Y) => {
                if (A[q] = K, this.#q) {
                    let z = this.#q - A[q];
                    while (this.#_ > z) this.#x(!0)
                }
                if (this.#_ += A[q], Y) Y.entrySize = K, Y.totalCalculatedSize = this.#_
            }
        }
        #S = (A) => {};
        #I = (A, q, K) => {};
        #m = (A, q, K, Y) => {
            if (K || Y) throw TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
            return 0
        };* #k({
            allowStale: A = this.allowStale
        } = {}) {
            if (this.#w)
                for (let q = this.#j;;) {
                    if (!this.#F(q)) break;
                    if (A || !this.#v(q)) yield q;
                    if (q === this.#W) break;
                    else q = this.#P[q]
                }
        }* #L({
            allowStale: A = this.allowStale
        } = {}) {
            if (this.#w)
                for (let q = this.#W;;) {
                    if (!this.#F(q)) break;
                    if (A || !this.#v(q)) yield q;
                    if (q === this.#j) break;
                    else q = this.#D[q]
                }
        }
        #F(A) {
            return A !== void 0 && this.#J.get(this.#O[A]) === A
        }* entries() {
            for (let A of this.#k())
                if (this.#H[A] !== void 0 && this.#O[A] !== void 0 && !this.#X(this.#H[A])) yield [this.#O[A], this.#H[A]]
        }* rentries() {
            for (let A of this.#L())
                if (this.#H[A] !== void 0 && this.#O[A] !== void 0 && !this.#X(this.#H[A])) yield [this.#O[A], this.#H[A]]
        }* keys() {
            for (let A of this.#k()) {
                let q = this.#O[A];
                if (q !== void 0 && !this.#X(this.#H[A])) yield q
            }
        }* rkeys() {
            for (let A of this.#L()) {
                let q = this.#O[A];
                if (q !== void 0 && !this.#X(this.#H[A])) yield q
            }
        }* values() {
            for (let A of this.#k())
                if (this.#H[A] !== void 0 && !this.#X(this.#H[A])) yield this.#H[A]
        }* rvalues() {
            for (let A of this.#L())
                if (this.#H[A] !== void 0 && !this.#X(this.#H[A])) yield this.#H[A]
        } [Symbol.iterator]() {
            return this.entries()
        } [Symbol.toStringTag] = "LRUCache";
        find(A, q = {}) {
            for (let K of this.#k()) {
                let Y = this.#H[K],
                    z = this.#X(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0) continue;
                if (A(z, this.#O[K], this)) return this.get(this.#O[K], q)
            }
        }
        forEach(A, q = this) {
            for (let K of this.#k()) {
                let Y = this.#H[K],
                    z = this.#X(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0) continue;
                A.call(q, z, this.#O[K], this)
            }
        }
        rforEach(A, q = this) {
            for (let K of this.#L()) {
                let Y = this.#H[K],
                    z = this.#X(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0) continue;
                A.call(q, z, this.#O[K], this)
            }
        }
        purgeStale() {
            let A = !1;
            for (let q of this.#L({
                    allowStale: !0
                }))
                if (this.#v(q)) this.#R(this.#O[q], "expire"), A = !0;
            return A
        }
        info(A) {
            let q = this.#J.get(A);
            if (q === void 0) return;
            let K = this.#H[q],
                Y = this.#X(K) ? K.__staleWhileFetching : K;
            if (Y === void 0) return;
            let z = {
                value: Y
            };
            if (this.#Z && this.#f) {
                let w = this.#Z[q],
                    H = this.#f[q];
                if (w && H) {
                    let $ = w - (vw1.now() - H);
                    z.ttl = $, z.start = Date.now()
                }
            }
            if (this.#N) z.size = this.#N[q];
            return z
        }
        dump() {
            let A = [];
            for (let q of this.#k({
                    allowStale: !0
                })) {
                let K = this.#O[q],
                    Y = this.#H[q],
                    z = this.#X(Y) ? Y.__staleWhileFetching : Y;
                if (z === void 0 || K === void 0) continue;
                let w = {
                    value: z
                };
                if (this.#Z && this.#f) {
                    w.ttl = this.#Z[q];
                    let H = vw1.now() - this.#f[q];
                    w.start = Math.floor(Date.now() - H)
                }
                if (this.#N) w.size = this.#N[q];
                A.unshift([K, w])
            }
            return A
        }
        load(A) {
            this.clear();
            for (let [q, K] of A) {
                if (K.start) {
                    let Y = Date.now() - K.start;
                    K.start = vw1.now() - Y
                }
                this.set(q, K.value, K)
            }
        }
        set(A, q, K = {}) {
            if (q === void 0) return this.delete(A), this;
            let {
                ttl: Y = this.ttl,
                start: z,
                noDisposeOnSet: w = this.noDisposeOnSet,
                sizeCalculation: H = this.sizeCalculation,
                status: $
            } = K, {
                noUpdateTTL: O = this.noUpdateTTL
            } = K, _ = this.#m(A, q, K.size || 0, H);
            if (this.maxEntrySize && _ > this.maxEntrySize) {
                if ($) $.set = "miss", $.maxEntrySizeExceeded = !0;
                return this.#R(A, "set"), this
            }
            let J = this.#w === 0 ? void 0 : this.#J.get(A);
            if (J === void 0) {
                if (J = this.#w === 0 ? this.#j : this.#V.length !== 0 ? this.#V.pop() : this.#w === this.#A ? this.#x(!1) : this.#w, this.#O[J] = A, this.#H[J] = q, this.#J.set(A, J), this.#D[this.#j] = J, this.#P[J] = this.#j, this.#j = J, this.#w++, this.#I(J, _, $), $) $.set = "add";
                O = !1
            } else {
                this.#h(J);
                let X = this.#H[J];
                if (q !== X) {
                    if (this.#E && this.#X(X)) {
                        X.__abortController.abort(Error("replaced"));
                        let {
                            __staleWhileFetching: D
                        } = X;
                        if (D !== void 0 && !w) {
                            if (this.#T) this.#K?.(D, A, "set");
                            if (this.#G) this.#M?.push([D, A, "set"])
                        }
                    } else if (!w) {
                        if (this.#T) this.#K?.(X, A, "set");
                        if (this.#G) this.#M?.push([X, A, "set"])
                    }
                    if (this.#S(J), this.#I(J, _, $), this.#H[J] = q, $) {
                        $.set = "replace";
                        let D = X && this.#X(X) ? X.__staleWhileFetching : X;
                        if (D !== void 0) $.oldValue = D
                    }
                } else if ($) $.set = "update"
            }
            if (Y !== 0 && !this.#Z) this.#u();
            if (this.#Z) {
                if (!O) this.#B(J, Y, z);
                if ($) this.#y($, J)
            }
            if (!w && this.#G && this.#M) {
                let X = this.#M,
                    D;
                while (D = X?.shift()) this.#z?.(...D)
            }
            return this
        }
        pop() {
            try {
                while (this.#w) {
                    let A = this.#H[this.#W];
                    if (this.#x(!0), this.#X(A)) {
                        if (A.__staleWhileFetching) return A.__staleWhileFetching
                    } else if (A !== void 0) return A
                }
            } finally {
                if (this.#G && this.#M) {
                    let A = this.#M,
                        q;
                    while (q = A?.shift()) this.#z?.(...q)
                }
            }
        }
        #x(A) {
            let q = this.#W,
                K = this.#O[q],
                Y = this.#H[q];
            if (this.#E && this.#X(Y)) Y.__abortController.abort(Error("evicted"));
            else if (this.#T || this.#G) {
                if (this.#T) this.#K?.(Y, K, "evict");
                if (this.#G) this.#M?.push([Y, K, "evict"])
            }
            if (this.#S(q), A) this.#O[q] = void 0, this.#H[q] = void 0, this.#V.push(q);
            if (this.#w === 1) this.#W = this.#j = 0, this.#V.length = 0;
            else this.#W = this.#D[q];
            return this.#J.delete(K), this.#w--, q
        }
        has(A, q = {}) {
            let {
                updateAgeOnHas: K = this.updateAgeOnHas,
                status: Y
            } = q, z = this.#J.get(A);
            if (z !== void 0) {
                let w = this.#H[z];
                if (this.#X(w) && w.__staleWhileFetching === void 0) return !1;
                if (!this.#v(z)) {
                    if (K) this.#C(z);
                    if (Y) Y.has = "hit", this.#y(Y, z);
                    return !0
                } else if (Y) Y.has = "stale", this.#y(Y, z)
            } else if (Y) Y.has = "miss";
            return !1
        }
        peek(A, q = {}) {
            let {
                allowStale: K = this.allowStale
            } = q, Y = this.#J.get(A);
            if (Y === void 0 || !K && this.#v(Y)) return;
            let z = this.#H[Y];
            return this.#X(z) ? z.__staleWhileFetching : z
        }
        #b(A, q, K, Y) {
            let z = q === void 0 ? void 0 : this.#H[q];
            if (this.#X(z)) return z;
            let w = new za1,
                {
                    signal: H
                } = K;
            H?.addEventListener("abort", () => w.abort(H.reason), {
                signal: w.signal
            });
            let $ = {
                    signal: w.signal,
                    options: K,
                    context: Y
                },
                O = (M, P = !1) => {
                    let {
                        aborted: W
                    } = w.signal, G = K.ignoreFetchAbort && M !== void 0;
                    if (K.status)
                        if (W && !P) {
                            if (K.status.fetchAborted = !0, K.status.fetchError = w.signal.reason, G) K.status.fetchAbortIgnored = !0
                        } else K.status.fetchResolved = !0;
                    if (W && !G && !P) return J(w.signal.reason);
                    let f = D;
                    if (this.#H[q] === D)
                        if (M === void 0)
                            if (f.__staleWhileFetching) this.#H[q] = f.__staleWhileFetching;
                            else this.#R(A, "fetch");
                    else {
                        if (K.status) K.status.fetchUpdated = !0;
                        this.set(A, M, $.options)
                    }
                    return M
                },
                _ = (M) => {
                    if (K.status) K.status.fetchRejected = !0, K.status.fetchError = M;
                    return J(M)
                },
                J = (M) => {
                    let {
                        aborted: P
                    } = w.signal, W = P && K.allowStaleOnFetchAbort, G = W || K.allowStaleOnFetchRejection, f = G || K.noDeleteOnFetchRejection, Z = D;
                    if (this.#H[q] === D) {
                        if (!f || Z.__staleWhileFetching === void 0) this.#R(A, "fetch");
                        else if (!W) this.#H[q] = Z.__staleWhileFetching
                    }
                    if (G) {
                        if (K.status && Z.__staleWhileFetching !== void 0) K.status.returnedStale = !0;
                        return Z.__staleWhileFetching
                    } else if (Z.__returned === Z) throw M
                },
                X = (M, P) => {
                    let W = this.#Y?.(A, z, $);
                    if (W && W instanceof Promise) W.then((G) => M(G === void 0 ? void 0 : G), P);
                    w.signal.addEventListener("abort", () => {
                        if (!K.ignoreFetchAbort || K.allowStaleOnFetchAbort) {
                            if (M(void 0), K.allowStaleOnFetchAbort) M = (G) => O(G, !0)
                        }
                    })
                };
            if (K.status) K.status.fetchDispatched = !0;
            let D = new Promise(X).then(O, _),
                j = Object.assign(D, {
                    __abortController: w,
                    __staleWhileFetching: z,
                    __returned: void 0
                });
            if (q === void 0) this.set(A, j, {
                ...$.options,
                status: void 0
            }), q = this.#J.get(A);
            else this.#H[q] = j;
            return j
        }
        #X(A) {
            if (!this.#E) return !1;
            let q = A;
            return !!q && q instanceof Promise && q.hasOwnProperty("__staleWhileFetching") && q.__abortController instanceof za1
        }
        async fetch(A, q = {}) {
            let {
                allowStale: K = this.allowStale,
                updateAgeOnGet: Y = this.updateAgeOnGet,
                noDeleteOnStaleGet: z = this.noDeleteOnStaleGet,
                ttl: w = this.ttl,
                noDisposeOnSet: H = this.noDisposeOnSet,
                size: $ = 0,
                sizeCalculation: O = this.sizeCalculation,
                noUpdateTTL: _ = this.noUpdateTTL,
                noDeleteOnFetchRejection: J = this.noDeleteOnFetchRejection,
                allowStaleOnFetchRejection: X = this.allowStaleOnFetchRejection,
                ignoreFetchAbort: D = this.ignoreFetchAbort,
                allowStaleOnFetchAbort: j = this.allowStaleOnFetchAbort,
                context: M,
                forceRefresh: P = !1,
                status: W,
                signal: G
            } = q;
            if (!this.#E) {
                if (W) W.fetch = "get";
                return this.get(A, {
                    allowStale: K,
                    updateAgeOnGet: Y,
                    noDeleteOnStaleGet: z,
                    status: W
                })
            }
            let f = {
                    allowStale: K,
                    updateAgeOnGet: Y,
                    noDeleteOnStaleGet: z,
                    ttl: w,
                    noDisposeOnSet: H,
                    size: $,
                    sizeCalculation: O,
                    noUpdateTTL: _,
                    noDeleteOnFetchRejection: J,
                    allowStaleOnFetchRejection: X,
                    allowStaleOnFetchAbort: j,
                    ignoreFetchAbort: D,
                    status: W,
                    signal: G
                },
                Z = this.#J.get(A);
            if (Z === void 0) {
                if (W) W.fetch = "miss";
                let N = this.#b(A, Z, f, M);
                return N.__returned = N
            } else {
                let N = this.#H[Z];
                if (this.#X(N)) {
                    let S = K && N.__staleWhileFetching !== void 0;
                    if (W) {
                        if (W.fetch = "inflight", S) W.returnedStale = !0
                    }
                    return S ? N.__staleWhileFetching : N.__returned = N
                }
                let T = this.#v(Z);
                if (!P && !T) {
                    if (W) W.fetch = "hit";
                    if (this.#h(Z), Y) this.#C(Z);
                    if (W) this.#y(W, Z);
                    return N
                }
                let k = this.#b(A, Z, f, M),
                    B = k.__staleWhileFetching !== void 0 && K;
                if (W) {
                    if (W.fetch = T ? "stale" : "refresh", B && T) W.returnedStale = !0
                }
                return B ? k.__staleWhileFetching : k.__returned = k
            }
        }
        async forceFetch(A, q = {}) {
            let K = await this.fetch(A, q);
            if (K === void 0) throw Error("fetch() returned undefined");
            return K
        }
        memo(A, q = {}) {
            let K = this.#$;
            if (!K) throw Error("no memoMethod provided to constructor");
            let {
                context: Y,
                forceRefresh: z,
                ...w
            } = q, H = this.get(A, w);
            if (!z && H !== void 0) return H;
            let $ = K(A, H, {
                options: w,
                context: Y
            });
            return this.set(A, $, w), $
        }
        get(A, q = {}) {
            let {
                allowStale: K = this.allowStale,
                updateAgeOnGet: Y = this.updateAgeOnGet,
                noDeleteOnStaleGet: z = this.noDeleteOnStaleGet,
                status: w
            } = q, H = this.#J.get(A);
            if (H !== void 0) {
                let $ = this.#H[H],
                    O = this.#X($);
                if (w) this.#y(w, H);
                if (this.#v(H)) {
                    if (w) w.get = "stale";
                    if (!O) {
                        if (!z) this.#R(A, "expire");
                        if (w && K) w.returnedStale = !0;
                        return K ? $ : void 0
                    } else {
                        if (w && K && $.__staleWhileFetching !== void 0) w.returnedStale = !0;
                        return K ? $.__staleWhileFetching : void 0
                    }
                } else {
                    if (w) w.get = "hit";
                    if (O) return $.__staleWhileFetching;
                    if (this.#h(H), Y) this.#C(H);
                    return $
                }
            } else if (w) w.get = "miss"
        }
        #Q(A, q) {
            this.#P[q] = A, this.#D[A] = q
        }
        #h(A) {
            if (A !== this.#j) {
                if (A === this.#W) this.#W = this.#D[A];
                else this.#Q(this.#P[A], this.#D[A]);
                this.#Q(this.#j, A), this.#j = A
            }
        }
        delete(A) {
            return this.#R(A, "delete")
        }
        #R(A, q) {
            let K = !1;
            if (this.#w !== 0) {
                let Y = this.#J.get(A);
                if (Y !== void 0)
                    if (K = !0, this.#w === 1) this.#g(q);
                    else {
                        this.#S(Y);
                        let z = this.#H[Y];
                        if (this.#X(z)) z.__abortController.abort(Error("deleted"));
                        else if (this.#T || this.#G) {
                            if (this.#T) this.#K?.(z, A, q);
                            if (this.#G) this.#M?.push([z, A, q])
                        }
                        if (this.#J.delete(A), this.#O[Y] = void 0, this.#H[Y] = void 0, Y === this.#j) this.#j = this.#P[Y];
                        else if (Y === this.#W) this.#W = this.#D[Y];
                        else {
                            let w = this.#P[Y];
                            this.#D[w] = this.#D[Y];
                            let H = this.#D[Y];
                            this.#P[H] = this.#P[Y]
                        }
                        this.#w--, this.#V.push(Y)
                    }
            }
            if (this.#G && this.#M?.length) {
                let Y = this.#M,
                    z;
                while (z = Y?.shift()) this.#z?.(...z)
            }
            return K
        }
        clear() {
            return this.#g("delete")
        }
        #g(A) {
            for (let q of this.#L({
                    allowStale: !0
                })) {
                let K = this.#H[q];
                if (this.#X(K)) K.__abortController.abort(Error("deleted"));
                else {
                    let Y = this.#O[q];
                    if (this.#T) this.#K?.(K, Y, A);
                    if (this.#G) this.#M?.push([K, Y, A])
                }
            }
            if (this.#J.clear(), this.#H.fill(void 0), this.#O.fill(void 0), this.#Z && this.#f) this.#Z.fill(0), this.#f.fill(0);
            if (this.#N) this.#N.fill(0);
            if (this.#W = 0, this.#j = 0, this.#V.length = 0, this.#_ = 0, this.#w = 0, this.#G && this.#M) {
                let q = this.#M,
                    K;
                while (K = q?.shift()) this.#z?.(...K)
            }
        }
    }
})
// @from(Ln 34376, Col 0)
function aI6(A, q = 300000) {
    let K = new Map,
        Y = (...z) => {
            let w = Q1(z),
                H = K.get(w),
                $ = Date.now();
            if (!H) {
                let O = A(...z);
                return K.set(w, {
                    value: O,
                    timestamp: $,
                    refreshing: !1
                }), O
            }
            if (H && $ - H.timestamp > q && !H.refreshing) return H.refreshing = !0, Promise.resolve().then(() => {
                let O = A(...z);
                K.set(w, {
                    value: O,
                    timestamp: Date.now(),
                    refreshing: !1
                })
            }).catch((O) => {
                K1(O instanceof Error ? O : Error(String(O))), K.delete(w)
            }), H.value;
            return K.get(w).value
        };
    return Y.cache = {
        clear: () => K.clear()
    }, Y
}
// @from(Ln 34407, Col 0)
function Lw1(A, q = 300000) {
    let K = new Map,
        Y = async (...z) => {
            let w = Q1(z),
                H = K.get(w),
                $ = Date.now();
            if (!H) {
                let O = await A(...z);
                return K.set(w, {
                    value: O,
                    timestamp: $,
                    refreshing: !1
                }), O
            }
            if (H && $ - H.timestamp > q && !H.refreshing) return H.refreshing = !0, A(...z).then((O) => {
                K.set(w, {
                    value: O,
                    timestamp: Date.now(),
                    refreshing: !1
                })
            }).catch((O) => {
                K1(O instanceof Error ? O : Error(String(O))), K.delete(w)
            }), H.value;
            return K.get(w).value
        };
    return Y.cache = {
        clear: () => K.clear()
    }, Y
}
// @from(Ln 34437, Col 0)
function sI6(A, q, K = 100) {
    let Y = new ZT({
            max: K
        }),
        z = (...w) => {
            let H = q(...w),
                $ = Y.get(H);
            if ($ !== void 0) return $;
            let O = A(...w);
            return Y.set(H, O), O
        };
    return z.cache = {
        clear: () => Y.clear(),
        size: () => Y.size,
        delete: (w) => Y.delete(w)
    }, z
}
// @from(Ln 34454, Col 4)
Rw1 = v(() => {
    kw1();
    y6();
    m6()
})
// @from(Ln 34459, Col 4)
NY8 = R((Ilz, VY8) => {
    VY8.exports = function(q) {
        return q.map(function(K) {
            if (K === "") return "''";
            if (K && typeof K === "object") return K.op.replace(/(.)/g, "\\$1");
            if (/["\s\\]/.test(K) && !/'/.test(K)) return "'" + K.replace(/(['])/g, "\\$1") + "'";
            if (/["'\s]/.test(K)) return '"' + K.replace(/(["\\$`!])/g, "\\$1") + '"';
            return String(K).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2")
        }).join(" ")
    }
})
// @from(Ln 34470, Col 4)
yY8 = R((xlz, RY8) => {
    var LY8 = "(?:" + ["\\|\\|", "\\&\\&", ";;", "\\|\\&", "\\<\\(", "\\<\\<\\<", ">>", ">\\&", "<\\&", "[&;()|<>]"].join("|") + ")",
        TY8 = new RegExp("^" + LY8 + "$"),
        vY8 = "|&;()<> \\t",
        uzK = '"((\\\\"|[^"])*?)"',
        BzK = "'((\\\\'|[^'])*?)'",
        mzK = /^#$/,
        EY8 = "'",
        kY8 = '"',
        tI6 = "$",
        U61 = "",
        FzK = 4294967296;
    for (wa1 = 0; wa1 < 4; wa1++) U61 += (FzK * Math.random()).toString(16);
    var wa1, QzK = new RegExp("^" + U61);

    function gzK(A, q) {
        var K = q.lastIndex,
            Y = [],
            z;
        while (z = q.exec(A))
            if (Y.push(z), q.lastIndex === z.index) q.lastIndex += 1;
        return q.lastIndex = K, Y
    }

    function UzK(A, q, K) {
        var Y = typeof A === "function" ? A(K) : A[K];
        if (typeof Y > "u" && K != "") Y = "";
        else if (typeof Y > "u") Y = "$";
        if (typeof Y === "object") return q + U61 + JSON.stringify(Y) + U61;
        return q + Y
    }

    function pzK(A, q, K) {
        if (!K) K = {};
        var Y = K.escape || "\\",
            z = "(\\" + Y + `['"` + vY8 + `]|[^\\s'"` + vY8 + "])+",
            w = new RegExp(["(" + LY8 + ")", "(" + z + "|" + uzK + "|" + BzK + ")+"].join("|"), "g"),
            H = gzK(A, w);
        if (H.length === 0) return [];
        if (!q) q = {};
        var $ = !1;
        return H.map(function(O) {
            var _ = O[0];
            if (!_ || $) return;
            if (TY8.test(_)) return {
                op: _
            };
            var J = !1,
                X = !1,
                D = "",
                j = !1,
                M;

            function P() {
                M += 1;
                var f, Z, N = _.charAt(M);
                if (N === "{") {
                    if (M += 1, _.charAt(M) === "}") throw Error("Bad substitution: " + _.slice(M - 2, M + 1));
                    if (f = _.indexOf("}", M), f < 0) throw Error("Bad substitution: " + _.slice(M));
                    Z = _.slice(M, f), M = f
                } else if (/[*@#?$!_-]/.test(N)) Z = N, M += 1;
                else {
                    var T = _.slice(M);
                    if (f = T.match(/[^\w\d_]/), !f) Z = T, M = _.length;
                    else Z = T.slice(0, f.index), M += f.index - 1
                }
                return UzK(q, "", Z)
            }
            for (M = 0; M < _.length; M++) {
                var W = _.charAt(M);
                if (j = j || !J && (W === "*" || W === "?"), X) D += W, X = !1;
                else if (J)
                    if (W === J) J = !1;
                    else if (J == EY8) D += W;
                else if (W === Y)
                    if (M += 1, W = _.charAt(M), W === kY8 || W === Y || W === tI6) D += W;
                    else D += Y + W;
                else if (W === tI6) D += P();
                else D += W;
                else if (W === kY8 || W === EY8) J = W;
                else if (TY8.test(W)) return {
                    op: _
                };
                else if (mzK.test(W)) {
                    $ = !0;
                    var G = {
                        comment: A.slice(O.index + M + 1)
                    };
                    if (D.length) return [D, G];
                    return [G]
                } else if (W === Y) X = !0;
                else if (W === tI6) D += P();
                else D += W
            }
            if (j) return {
                op: "glob",
                pattern: D
            };
            return D
        }).reduce(function(O, _) {
            return typeof _ > "u" ? O : O.concat(_)
        }, [])
    }
    RY8.exports = function(q, K, Y) {
        var z = pzK(q, K, Y);
        if (typeof K !== "function") return z;
        return z.reduce(function(w, H) {
            if (typeof H === "object") return w.concat(H);
            var $ = H.split(RegExp("(" + U61 + ".*?" + U61 + ")", "g"));
            if ($.length === 1) return w.concat($[0]);
            return w.concat($.filter(Boolean).map(function(O) {
                if (QzK.test(O)) return JSON.parse(O.split(U61)[1]);
                return O
            }))
        }, [])
    }
})
// @from(Ln 34587, Col 4)
Ha1 = R((dzK) => {
    dzK.quote = NY8();
    dzK.parse = yY8()
})
// @from(Ln 34592, Col 0)
function pz(A, q) {
    try {
        return {
            success: !0,
            tokens: typeof q === "function" ? yw1.parse(A, q) : yw1.parse(A, q)
        }
    } catch (K) {
        if (K instanceof Error) K1(K);
        return {
            success: !1,
            error: K instanceof Error ? K.message : "Unknown parse error"
        }
    }
}
// @from(Ln 34607, Col 0)
function izK(A) {
    try {
        let q = A.map((Y, z) => {
            if (Y === null || Y === void 0) return String(Y);
            let w = typeof Y;
            if (w === "string") return Y;
            if (w === "number" || w === "boolean") return String(Y);
            if (w === "object") throw Error(`Cannot quote argument at index ${z}: object values are not supported`);
            if (w === "symbol") throw Error(`Cannot quote argument at index ${z}: symbol values are not supported`);
            if (w === "function") throw Error(`Cannot quote argument at index ${z}: function values are not supported`);
            throw Error(`Cannot quote argument at index ${z}: unsupported type ${w}`)
        });
        return {
            success: !0,
            quoted: yw1.quote(q)
        }
    } catch (q) {
        if (q instanceof Error) K1(q);
        return {
            success: !1,
            error: q instanceof Error ? q.message : "Unknown quote error"
        }
    }
}
// @from(Ln 34632, Col 0)
function CY8(A) {
    let q = !1,
        K = !1;
    for (let Y = 0; Y < A.length; Y++) {
        let z = A[Y];
        if (z === "\\" && !q) {
            Y++;
            continue
        }
        if (z === '"' && !q) {
            K = !K;
            continue
        }
        if (z === "'" && !K) {
            if (q = !q, !q && Y >= 2 && A[Y - 1] === "\\" && A[Y - 2] === "'") return !0;
            continue
        }
    }
    return !1
}
// @from(Ln 34653, Col 0)
function R7(A) {
    let q = izK([...A]);
    if (q.success) return q.quoted;
    try {
        let K = A.map((Y) => {
            if (Y === null || Y === void 0) return String(Y);
            let z = typeof Y;
            if (z === "string" || z === "number" || z === "boolean") return String(Y);
            return Q1(Y)
        });
        return yw1.quote(K)
    } catch (K) {
        if (K instanceof Error) K1(K);
        throw Error("Failed to quote shell arguments safely")
    }
}
// @from(Ln 34669, Col 4)
yw1
// @from(Ln 34670, Col 4)
M_ = v(() => {
    y6();
    m6();
    yw1 = o(Ha1(), 1)
})
// @from(Ln 34678, Col 0)
function eI6(A) {
    try {
        return $k(`dir "${A}"`, {
            stdio: "pipe"
        }), !0
    } catch {
        return !1
    }
}
// @from(Ln 34688, Col 0)
function nzK(A) {
    if (A === "git") {
        let q = ["C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files (x86)\\Git\\cmd\\git.exe"];
        for (let K of q)
            if (eI6(K)) return K
    }
    try {
        let K = $k(`where.exe ${A}`, {
                stdio: "pipe",
                encoding: "utf8"
            }).trim().split(`\r
`).filter(Boolean),
            Y = h6().toLowerCase();
        for (let z of K) {
            let w = Cw1.resolve(z).toLowerCase();
            if (Cw1.dirname(w).toLowerCase() === Y || w.startsWith(Y + Cw1.sep)) {
                h(`Skipping potentially malicious executable in current directory: ${z}`);
                continue
            }
            return z
        }
        return null
    } catch {
        return null
    }
}
// @from(Ln 34714, Col 4)
hY8 = () => {
        if (eA() === "windows") {
            let A = Ax6();
            process.env.SHELL = A, h(`Using bash path: "${A}"`)
        }
    }
// @from(Ln 34720, Col 4)
Ax6
// @from(Ln 34720, Col 9)
px
// @from(Ln 34720, Col 13)
IY8
// @from(Ln 34721, Col 4)
Sw1 = v(() => {
    eN1();
    zq();
    Rw1();
    M_();
    x3();
    Z6();
    N7();
    Ax6 = KA(() => {
        if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
            if (eI6(process.env.CLAUDE_CODE_GIT_BASH_PATH)) return process.env.CLAUDE_CODE_GIT_BASH_PATH;
            console.error(`Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`), process.exit(1)
        }
        let A = nzK("git");
        if (A) {
            let q = SY8.join(A, "..", "..", "bin", "bash.exe");
            if (eI6(q)) return q
        }
        console.error("Claude Code on Windows requires git-bash (https://git-scm.com/downloads/win). If installed but not in PATH, set environment variable pointing to your bash.exe, similar to: CLAUDE_CODE_GIT_BASH_PATH=C:\\Program Files\\Git\\bin\\bash.exe"), process.exit(1)
    }), px = sI6((A) => {
        let q = R7([A]);
        return $k(`cygpath -u ${q}`, {
            shell: Ax6()
        }).toString().trim()
    }, (A) => A, 500), IY8 = sI6((A) => {
        let q = R7([A]);
        return $k(`cygpath -w ${q}`, {
            shell: Ax6()
        }).toString().trim()
    }, (A) => A, 500)
})
// @from(Ln 34763, Col 0)
function g4(A, q) {
    let K = q ?? h6() ?? b1().cwd();
    if (typeof A !== "string") throw TypeError(`Path must be a string, received ${typeof A}`);
    if (typeof K !== "string") throw TypeError(`Base directory must be a string, received ${typeof K}`);
    if (A.includes("\x00") || K.includes("\x00")) throw Error("Path contains null bytes");
    let Y = A.trim();
    if (!Y) return qx6(K).normalize("NFC");
    if (Y === "~") return xY8().normalize("NFC");
    if (Y.startsWith("~/")) return ozK(xY8(), Y.slice(2)).normalize("NFC");
    let z = Y;
    if (eA() === "windows" && Y.match(/^\/[a-z]\//i)) try {
        z = IY8(Y)
    } catch {
        z = Y
    }
    if (rzK(z)) return qx6(z).normalize("NFC");
    return azK(K, z).normalize("NFC")
}
// @from(Ln 34782, Col 0)
function fQ(A) {
    let q = g4(A);
    if (q.startsWith("\\\\") || q.startsWith("//")) return bY8(q);
    try {
        if (b1().statSync(q).isDirectory()) return q
    } catch {}
    return bY8(q)
}
// @from(Ln 34791, Col 0)
function p61(A) {
    return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(A)
}
// @from(Ln 34795, Col 0)
function dx(A) {
    return A.replace(/[^a-zA-Z0-9]/g, "-")
}
// @from(Ln 34799, Col 0)
function yT1(A) {
    return qx6(A).replace(/\\/g, "/")
}
// @from(Ln 34802, Col 4)
Ez = v(() => {
    N7();
    _8();
    x3();
    Sw1()
})
// @from(Ln 34809, Col 0)
function ST1(A, q) {
    return A instanceof Error && A.message === q
}
// @from(Ln 34812, Col 4)
CT1
// @from(Ln 34812, Col 9)
cx
// @from(Ln 34812, Col 13)
dz
// @from(Ln 34812, Col 17)
hG
// @from(Ln 34812, Col 21)
DC
// @from(Ln 34812, Col 25)
vD
// @from(Ln 34812, Col 29)
Ok
// @from(Ln 34813, Col 4)
qH = v(() => {
    CT1 = class CT1 extends Error {
        constructor(A) {
            super(A);
            this.name = this.constructor.name
        }
    };
    cx = class cx extends Error {};
    dz = class dz extends Error {
        constructor(A) {
            super(A);
            this.name = "AbortError"
        }
    };
    hG = class hG extends Error {
        filePath;
        defaultConfig;
        constructor(A, q, K) {
            super(A);
            this.name = "ConfigParseError", this.filePath = q, this.defaultConfig = K
        }
    };
    DC = class DC extends Error {
        stdout;
        stderr;
        code;
        interrupted;
        constructor(A, q, K, Y) {
            super("Shell command failed");
            this.stdout = A;
            this.stderr = q;
            this.code = K;
            this.interrupted = Y;
            this.name = "ShellError"
        }
    };
    vD = class vD extends Error {
        formattedMessage;
        constructor(A, q) {
            super(A);
            this.formattedMessage = q;
            this.name = "TeleportOperationError"
        }
    };
    Ok = class Ok extends Error {
        telemetryMessage;
        constructor(A, q) {
            super(A);
            this.name = "TelemetrySafeError", this.telemetryMessage = q ?? A
        }
    }
})
// @from(Ln 34865, Col 4)
BY8 = R((Aiz, uY8) => {
    var fi = h1("constants"),
        szK = process.cwd,
        $a1 = null,
        tzK = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
        if (!$a1) $a1 = szK.call(process);
        return $a1
    };
    try {
        process.cwd()
    } catch (A) {}
    if (typeof process.chdir === "function") {
        if (Oa1 = process.chdir, process.chdir = function(A) {
                $a1 = null, Oa1.call(process, A)
            }, Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, Oa1)
    }
    var Oa1;
    uY8.exports = ezK;

    function ezK(A) {
        if (fi.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) q(A);
        if (!A.lutimes) K(A);
        if (A.chown = w(A.chown), A.fchown = w(A.fchown), A.lchown = w(A.lchown), A.chmod = Y(A.chmod), A.fchmod = Y(A.fchmod), A.lchmod = Y(A.lchmod), A.chownSync = H(A.chownSync), A.fchownSync = H(A.fchownSync), A.lchownSync = H(A.lchownSync), A.chmodSync = z(A.chmodSync), A.fchmodSync = z(A.fchmodSync), A.lchmodSync = z(A.lchmodSync), A.stat = $(A.stat), A.fstat = $(A.fstat), A.lstat = $(A.lstat), A.statSync = O(A.statSync), A.fstatSync = O(A.fstatSync), A.lstatSync = O(A.lstatSync), A.chmod && !A.lchmod) A.lchmod = function(J, X, D) {
            if (D) process.nextTick(D)
        }, A.lchmodSync = function() {};
        if (A.chown && !A.lchown) A.lchown = function(J, X, D, j) {
            if (j) process.nextTick(j)
        }, A.lchownSync = function() {};
        if (tzK === "win32") A.rename = typeof A.rename !== "function" ? A.rename : function(J) {
            function X(D, j, M) {
                var P = Date.now(),
                    W = 0;
                J(D, j, function G(f) {
                    if (f && (f.code === "EACCES" || f.code === "EPERM" || f.code === "EBUSY") && Date.now() - P < 60000) {
                        if (setTimeout(function() {
                                A.stat(j, function(Z, N) {
                                    if (Z && Z.code === "ENOENT") J(D, j, G);
                                    else M(f)
                                })
                            }, W), W < 100) W += 10;
                        return
                    }
                    if (M) M(f)
                })
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(X, J);
            return X
        }(A.rename);
        A.read = typeof A.read !== "function" ? A.read : function(J) {
            function X(D, j, M, P, W, G) {
                var f;
                if (G && typeof G === "function") {
                    var Z = 0;
                    f = function(N, T, k) {
                        if (N && N.code === "EAGAIN" && Z < 10) return Z++, J.call(A, D, j, M, P, W, f);
                        G.apply(this, arguments)
                    }
                }
                return J.call(A, D, j, M, P, W, f)
            }
            if (Object.setPrototypeOf) Object.setPrototypeOf(X, J);
            return X
        }(A.read), A.readSync = typeof A.readSync !== "function" ? A.readSync : function(J) {
            return function(X, D, j, M, P) {
                var W = 0;
                while (!0) try {
                    return J.call(A, X, D, j, M, P)
                } catch (G) {
                    if (G.code === "EAGAIN" && W < 10) {
                        W++;
                        continue
                    }
                    throw G
                }
            }
        }(A.readSync);

        function q(J) {
            J.lchmod = function(X, D, j) {
                J.open(X, fi.O_WRONLY | fi.O_SYMLINK, D, function(M, P) {
                    if (M) {
                        if (j) j(M);
                        return
                    }
                    J.fchmod(P, D, function(W) {
                        J.close(P, function(G) {
                            if (j) j(W || G)
                        })
                    })
                })
            }, J.lchmodSync = function(X, D) {
                var j = J.openSync(X, fi.O_WRONLY | fi.O_SYMLINK, D),
                    M = !0,
                    P;
                try {
                    P = J.fchmodSync(j, D), M = !1
                } finally {
                    if (M) try {
                        J.closeSync(j)
                    } catch (W) {} else J.closeSync(j)
                }
                return P
            }
        }

        function K(J) {
            if (fi.hasOwnProperty("O_SYMLINK") && J.futimes) J.lutimes = function(X, D, j, M) {
                J.open(X, fi.O_SYMLINK, function(P, W) {
                    if (P) {
                        if (M) M(P);
                        return
                    }
                    J.futimes(W, D, j, function(G) {
                        J.close(W, function(f) {
                            if (M) M(G || f)
                        })
                    })
                })
            }, J.lutimesSync = function(X, D, j) {
                var M = J.openSync(X, fi.O_SYMLINK),
                    P, W = !0;
                try {
                    P = J.futimesSync(M, D, j), W = !1
                } finally {
                    if (W) try {
                        J.closeSync(M)
                    } catch (G) {} else J.closeSync(M)
                }
                return P
            };
            else if (J.futimes) J.lutimes = function(X, D, j, M) {
                if (M) process.nextTick(M)
            }, J.lutimesSync = function() {}
        }

        function Y(J) {
            if (!J) return J;
            return function(X, D, j) {
                return J.call(A, X, D, function(M) {
                    if (_(M)) M = null;
                    if (j) j.apply(this, arguments)
                })
            }
        }

        function z(J) {
            if (!J) return J;
            return function(X, D) {
                try {
                    return J.call(A, X, D)
                } catch (j) {
                    if (!_(j)) throw j
                }
            }
        }

        function w(J) {
            if (!J) return J;
            return function(X, D, j, M) {
                return J.call(A, X, D, j, function(P) {
                    if (_(P)) P = null;
                    if (M) M.apply(this, arguments)
                })
            }
        }

        function H(J) {
            if (!J) return J;
            return function(X, D, j) {
                try {
                    return J.call(A, X, D, j)
                } catch (M) {
                    if (!_(M)) throw M
                }
            }
        }

        function $(J) {
            if (!J) return J;
            return function(X, D, j) {
                if (typeof D === "function") j = D, D = null;

                function M(P, W) {
                    if (W) {
                        if (W.uid < 0) W.uid += 4294967296;
                        if (W.gid < 0) W.gid += 4294967296
                    }
                    if (j) j.apply(this, arguments)
                }
                return D ? J.call(A, X, D, M) : J.call(A, X, M)
            }
        }

        function O(J) {
            if (!J) return J;
            return function(X, D) {
                var j = D ? J.call(A, X, D) : J.call(A, X);
                if (j) {
                    if (j.uid < 0) j.uid += 4294967296;
                    if (j.gid < 0) j.gid += 4294967296
                }
                return j
            }
        }

        function _(J) {
            if (!J) return !0;
            if (J.code === "ENOSYS") return !0;
            var X = !process.getuid || process.getuid() !== 0;
            if (X) {
                if (J.code === "EINVAL" || J.code === "EPERM") return !0
            }
            return !1
        }
    }
})
// @from(Ln 35082, Col 4)
QY8 = R((qiz, FY8) => {
    var mY8 = h1("stream").Stream;
    FY8.exports = A2K;

    function A2K(A) {
        return {
            ReadStream: q,
            WriteStream: K
        };

        function q(Y, z) {
            if (!(this instanceof q)) return new q(Y, z);
            mY8.call(this);
            var w = this;
            this.path = Y, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, z = z || {};
            var H = Object.keys(z);
            for (var $ = 0, O = H.length; $ < O; $++) {
                var _ = H[$];
                this[_] = z[_]
            }
            if (this.encoding) this.setEncoding(this.encoding);
            if (this.start !== void 0) {
                if (typeof this.start !== "number") throw TypeError("start must be a Number");
                if (this.end === void 0) this.end = 1 / 0;
                else if (typeof this.end !== "number") throw TypeError("end must be a Number");
                if (this.start > this.end) throw Error("start must be <= end");
                this.pos = this.start
            }
            if (this.fd !== null) {
                process.nextTick(function() {
                    w._read()
                });
                return
            }
            A.open(this.path, this.flags, this.mode, function(J, X) {
                if (J) {
                    w.emit("error", J), w.readable = !1;
                    return
                }
                w.fd = X, w.emit("open", X), w._read()
            })
        }

        function K(Y, z) {
            if (!(this instanceof K)) return new K(Y, z);
            mY8.call(this), this.path = Y, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, z = z || {};
            var w = Object.keys(z);
            for (var H = 0, $ = w.length; H < $; H++) {
                var O = w[H];
                this[O] = z[O]
            }
            if (this.start !== void 0) {
                if (typeof this.start !== "number") throw TypeError("start must be a Number");
                if (this.start < 0) throw Error("start must be >= zero");
                this.pos = this.start
            }
            if (this.busy = !1, this._queue = [], this.fd === null) this._open = A.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush()
        }
    }
})
// @from(Ln 35142, Col 4)
UY8 = R((Kiz, gY8) => {
    gY8.exports = K2K;
    var q2K = Object.getPrototypeOf || function(A) {
        return A.__proto__
    };

    function K2K(A) {
        if (A === null || typeof A !== "object") return A;
        if (A instanceof Object) var q = {
            __proto__: q2K(A)
        };
        else var q = Object.create(null);
        return Object.getOwnPropertyNames(A).forEach(function(K) {
            Object.defineProperty(q, K, Object.getOwnPropertyDescriptor(A, K))
        }), q
    }
})
// @from(Ln 35159, Col 4)
cz = R((Yiz, wx6) => {
    var TO = h1("fs"),
        Y2K = BY8(),
        z2K = QY8(),
        w2K = UY8(),
        _a1 = h1("util"),
        nj, Xa1;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") nj = Symbol.for("graceful-fs.queue"), Xa1 = Symbol.for("graceful-fs.previous");
    else nj = "___graceful-fs.queue", Xa1 = "___graceful-fs.previous";

    function H2K() {}

    function dY8(A, q) {
        Object.defineProperty(A, nj, {
            get: function() {
                return q
            }
        })
    }
    var d61 = H2K;
    if (_a1.debuglog) d61 = _a1.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) d61 = function() {
        var A = _a1.format.apply(_a1, arguments);
        A = "GFS4: " + A.split(/\n/).join(`
GFS4: `), console.error(A)
    };
    if (!TO[nj]) {
        if (Kx6 = global[nj] || [], dY8(TO, Kx6), TO.close = function(A) {
                function q(K, Y) {
                    return A.call(TO, K, function(z) {
                        if (!z) pY8();
                        if (typeof Y === "function") Y.apply(this, arguments)
                    })
                }
                return Object.defineProperty(q, Xa1, {
                    value: A
                }), q
            }(TO.close), TO.closeSync = function(A) {
                function q(K) {
                    A.apply(TO, arguments), pY8()
                }
                return Object.defineProperty(q, Xa1, {
                    value: A
                }), q
            }(TO.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function() {
            d61(TO[nj]), h1("assert").equal(TO[nj].length, 0)
        })
    }
    var Kx6;
    if (!global[nj]) dY8(global, TO[nj]);
    wx6.exports = Yx6(w2K(TO));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !TO.__patched) wx6.exports = Yx6(TO), TO.__patched = !0;

    function Yx6(A) {
        Y2K(A), A.gracefulify = Yx6, A.createReadStream = T, A.createWriteStream = k;
        var q = A.readFile;
        A.readFile = K;

        function K(S, m, b) {
            if (typeof m === "function") b = m, m = null;
            return g(S, m, b);

            function g(U, x, p, l) {
                return q(U, x, function(r) {
                    if (r && (r.code === "EMFILE" || r.code === "ENFILE")) hw1([g, [U, x, p], r, l || Date.now(), Date.now()]);
                    else if (typeof p === "function") p.apply(this, arguments)
                })
            }
        }
        var Y = A.writeFile;
        A.writeFile = z;

        function z(S, m, b, g) {
            if (typeof b === "function") g = b, b = null;
            return U(S, m, b, g);

            function U(x, p, l, r, s) {
                return Y(x, p, l, function(O1) {
                    if (O1 && (O1.code === "EMFILE" || O1.code === "ENFILE")) hw1([U, [x, p, l, r], O1, s || Date.now(), Date.now()]);
                    else if (typeof r === "function") r.apply(this, arguments)
                })
            }
        }
        var w = A.appendFile;
        if (w) A.appendFile = H;

        function H(S, m, b, g) {
            if (typeof b === "function") g = b, b = null;
            return U(S, m, b, g);

            function U(x, p, l, r, s) {
                return w(x, p, l, function(O1) {
                    if (O1 && (O1.code === "EMFILE" || O1.code === "ENFILE")) hw1([U, [x, p, l, r], O1, s || Date.now(), Date.now()]);
                    else if (typeof r === "function") r.apply(this, arguments)
                })
            }
        }
        var $ = A.copyFile;
        if ($) A.copyFile = O;

        function O(S, m, b, g) {
            if (typeof b === "function") g = b, b = 0;
            return U(S, m, b, g);

            function U(x, p, l, r, s) {
                return $(x, p, l, function(O1) {
                    if (O1 && (O1.code === "EMFILE" || O1.code === "ENFILE")) hw1([U, [x, p, l, r], O1, s || Date.now(), Date.now()]);
                    else if (typeof r === "function") r.apply(this, arguments)
                })
            }
        }
        var _ = A.readdir;
        A.readdir = X;
        var J = /^v[0-5]\./;

        function X(S, m, b) {
            if (typeof m === "function") b = m, m = null;
            var g = J.test(process.version) ? function(p, l, r, s) {
                return _(p, U(p, l, r, s))
            } : function(p, l, r, s) {
                return _(p, l, U(p, l, r, s))
            };
            return g(S, m, b);

            function U(x, p, l, r) {
                return function(s, O1) {
                    if (s && (s.code === "EMFILE" || s.code === "ENFILE")) hw1([g, [x, p, l], s, r || Date.now(), Date.now()]);
                    else {
                        if (O1 && O1.sort) O1.sort();
                        if (typeof l === "function") l.call(this, s, O1)
                    }
                }
            }
        }
        if (process.version.substr(0, 4) === "v0.8") {
            var D = z2K(A);
            G = D.ReadStream, Z = D.WriteStream
        }
        var j = A.ReadStream;
        if (j) G.prototype = Object.create(j.prototype), G.prototype.open = f;
        var M = A.WriteStream;
        if (M) Z.prototype = Object.create(M.prototype), Z.prototype.open = N;
        Object.defineProperty(A, "ReadStream", {
            get: function() {
                return G
            },
            set: function(S) {
                G = S
            },
            enumerable: !0,
            configurable: !0
        }), Object.defineProperty(A, "WriteStream", {
            get: function() {
                return Z
            },
            set: function(S) {
                Z = S
            },
            enumerable: !0,
            configurable: !0
        });
        var P = G;
        Object.defineProperty(A, "FileReadStream", {
            get: function() {
                return P
            },
            set: function(S) {
                P = S
            },
            enumerable: !0,
            configurable: !0
        });
        var W = Z;
        Object.defineProperty(A, "FileWriteStream", {
            get: function() {
                return W
            },
            set: function(S) {
                W = S
            },
            enumerable: !0,
            configurable: !0
        });

        function G(S, m) {
            if (this instanceof G) return j.apply(this, arguments), this;
            else return G.apply(Object.create(G.prototype), arguments)
        }

        function f() {
            var S = this;
            B(S.path, S.flags, S.mode, function(m, b) {
                if (m) {
                    if (S.autoClose) S.destroy();
                    S.emit("error", m)
                } else S.fd = b, S.emit("open", b), S.read()
            })
        }

        function Z(S, m) {
            if (this instanceof Z) return M.apply(this, arguments), this;
            else return Z.apply(Object.create(Z.prototype), arguments)
        }

        function N() {
            var S = this;
            B(S.path, S.flags, S.mode, function(m, b) {
                if (m) S.destroy(), S.emit("error", m);
                else S.fd = b, S.emit("open", b)
            })
        }

        function T(S, m) {
            return new A.ReadStream(S, m)
        }

        function k(S, m) {
            return new A.WriteStream(S, m)
        }
        var y = A.open;
        A.open = B;

        function B(S, m, b, g) {
            if (typeof b === "function") g = b, b = null;
            return U(S, m, b, g);

            function U(x, p, l, r, s) {
                return y(x, p, l, function(O1, T1) {
                    if (O1 && (O1.code === "EMFILE" || O1.code === "ENFILE")) hw1([U, [x, p, l, r], O1, s || Date.now(), Date.now()]);
                    else if (typeof r === "function") r.apply(this, arguments)
                })
            }
        }
        return A
    }

    function hw1(A) {
        d61("ENQUEUE", A[0].name, A[1]), TO[nj].push(A), zx6()
    }
    var Ja1;

    function pY8() {
        var A = Date.now();
        for (var q = 0; q < TO[nj].length; ++q)
            if (TO[nj][q].length > 2) TO[nj][q][3] = A, TO[nj][q][4] = A;
        zx6()
    }

    function zx6() {
        if (clearTimeout(Ja1), Ja1 = void 0, TO[nj].length === 0) return;
        var A = TO[nj].shift(),
            q = A[0],
            K = A[1],
            Y = A[2],
            z = A[3],
            w = A[4];
        if (z === void 0) d61("RETRY", q.name, K), q.apply(null, K);
        else if (Date.now() - z >= 60000) {
            d61("TIMEOUT", q.name, K);
            var H = K.pop();
            if (typeof H === "function") H.call(null, Y)
        } else {
            var $ = Date.now() - w,
                O = Math.max(w - z, 1),
                _ = Math.min(O * 1.2, 100);
            if ($ >= _) d61("RETRY", q.name, K), q.apply(null, K.concat([z]));
            else TO[nj].push(A)
        }
        if (Ja1 === void 0) Ja1 = setTimeout(zx6, 0)
    }
})
// @from(Ln 35430, Col 4)
lY8 = R((ziz, cY8) => {
    function _k(A, q) {
        if (typeof q === "boolean") q = {
            forever: q
        };
        if (this._originalTimeouts = JSON.parse(JSON.stringify(A)), this._timeouts = A, this._options = q || {}, this._maxRetryTime = q && q.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._options.forever) this._cachedTimeouts = this._timeouts.slice(0)
    }
    cY8.exports = _k;
    _k.prototype.reset = function() {
        this._attempts = 1, this._timeouts = this._originalTimeouts
    };
    _k.prototype.stop = function() {
        if (this._timeout) clearTimeout(this._timeout);
        this._timeouts = [], this._cachedTimeouts = null
    };
    _k.prototype.retry = function(A) {
        if (this._timeout) clearTimeout(this._timeout);
        if (!A) return !1;
        var q = new Date().getTime();
        if (A && q - this._operationStart >= this._maxRetryTime) return this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
        this._errors.push(A);
        var K = this._timeouts.shift();
        if (K === void 0)
            if (this._cachedTimeouts) this._errors.splice(this._errors.length - 1, this._errors.length), this._timeouts = this._cachedTimeouts.slice(0), K = this._timeouts.shift();
            else return !1;
        var Y = this,
            z = setTimeout(function() {
                if (Y._attempts++, Y._operationTimeoutCb) {
                    if (Y._timeout = setTimeout(function() {
                            Y._operationTimeoutCb(Y._attempts)
                        }, Y._operationTimeout), Y._options.unref) Y._timeout.unref()
                }
                Y._fn(Y._attempts)
            }, K);
        if (this._options.unref) z.unref();
        return !0
    };
    _k.prototype.attempt = function(A, q) {
        if (this._fn = A, q) {
            if (q.timeout) this._operationTimeout = q.timeout;
            if (q.cb) this._operationTimeoutCb = q.cb
        }
        var K = this;
        if (this._operationTimeoutCb) this._timeout = setTimeout(function() {
            K._operationTimeoutCb()
        }, K._operationTimeout);
        this._operationStart = new Date().getTime(), this._fn(this._attempts)
    };
    _k.prototype.try = function(A) {
        console.log("Using RetryOperation.try() is deprecated"), this.attempt(A)
    };
    _k.prototype.start = function(A) {
        console.log("Using RetryOperation.start() is deprecated"), this.attempt(A)
    };
    _k.prototype.start = _k.prototype.try;
    _k.prototype.errors = function() {
        return this._errors
    };
    _k.prototype.attempts = function() {
        return this._attempts
    };
    _k.prototype.mainError = function() {
        if (this._errors.length === 0) return null;
        var A = {},
            q = null,
            K = 0;
        for (var Y = 0; Y < this._errors.length; Y++) {
            var z = this._errors[Y],
                w = z.message,
                H = (A[w] || 0) + 1;
            if (A[w] = H, H >= K) q = z, K = H
        }
        return q
    }
})
// @from(Ln 35505, Col 4)
nY8 = R((O2K) => {
    var $2K = lY8();
    O2K.operation = function(A) {
        var q = O2K.timeouts(A);
        return new $2K(q, {
            forever: A && A.forever,
            unref: A && A.unref,
            maxRetryTime: A && A.maxRetryTime
        })
    };
    O2K.timeouts = function(A) {
        if (A instanceof Array) return [].concat(A);
        var q = {
            retries: 10,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 1 / 0,
            randomize: !1
        };
        for (var K in A) q[K] = A[K];
        if (q.minTimeout > q.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
        var Y = [];
        for (var z = 0; z < q.retries; z++) Y.push(this.createTimeout(z, q));
        if (A && A.forever && !Y.length) Y.push(this.createTimeout(z, q));
        return Y.sort(function(w, H) {
            return w - H
        }), Y
    };
    O2K.createTimeout = function(A, q) {
        var K = q.randomize ? Math.random() + 1 : 1,
            Y = Math.round(K * q.minTimeout * Math.pow(q.factor, A));
        return Y = Math.min(Y, q.maxTimeout), Y
    };
    O2K.wrap = function(A, q, K) {
        if (q instanceof Array) K = q, q = null;
        if (!K) {
            K = [];
            for (var Y in A)
                if (typeof A[Y] === "function") K.push(Y)
        }
        for (var z = 0; z < K.length; z++) {
            var w = K[z],
                H = A[w];
            A[w] = function(O) {
                var _ = O2K.operation(q),
                    J = Array.prototype.slice.call(arguments, 1),
                    X = J.pop();
                J.push(function(D) {
                    if (_.retry(D)) return;
                    if (D) arguments[0] = _.mainError();
                    X.apply(this, arguments)
                }), _.attempt(function() {
                    O.apply(A, J)
                })
            }.bind(A, H), A[w].options = q
        }
    }
})
// @from(Ln 35563, Col 4)
rY8 = R((Hiz, Da1) => {
    Da1.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
    if (process.platform !== "win32") Da1.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
    if (process.platform === "linux") Da1.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED")
})
// @from(Ln 35568, Col 4)
oY8 = R(($iz, xw1) => {
    var v$ = global.process,
        c61 = function(A) {
            return A && typeof A === "object" && typeof A.removeListener === "function" && typeof A.emit === "function" && typeof A.reallyExit === "function" && typeof A.listeners === "function" && typeof A.kill === "function" && typeof A.pid === "number" && typeof A.on === "function"
        };
    if (!c61(v$)) xw1.exports = function() {
        return function() {}
    };
    else {
        if (Hx6 = h1("assert"), l61 = rY8(), $x6 = /^win/i.test(v$.platform), Iw1 = h1("events"), typeof Iw1 !== "function") Iw1 = Iw1.EventEmitter;
        if (v$.__signal_exit_emitter__) ED = v$.__signal_exit_emitter__;
        else ED = v$.__signal_exit_emitter__ = new Iw1, ED.count = 0, ED.emitted = {};
        if (!ED.infinite) ED.setMaxListeners(1 / 0), ED.infinite = !0;
        xw1.exports = function(A, q) {
            if (!c61(global.process)) return function() {};
            if (Hx6.equal(typeof A, "function", "a callback must be provided for exit handler"), i61 === !1) ja1();
            var K = "exit";
            if (q && q.alwaysLast) K = "afterexit";
            var Y = function() {
                if (ED.removeListener(K, A), ED.listeners("exit").length === 0 && ED.listeners("afterexit").length === 0) hT1()
            };
            return ED.on(K, A), Y
        }, hT1 = function() {
            if (!i61 || !c61(global.process)) return;
            i61 = !1, l61.forEach(function(q) {
                try {
                    v$.removeListener(q, IT1[q])
                } catch (K) {}
            }), v$.emit = xT1, v$.reallyExit = Ma1, ED.count -= 1
        }, xw1.exports.unload = hT1, Vi = function(q, K, Y) {
            if (ED.emitted[q]) return;
            ED.emitted[q] = !0, ED.emit(q, K, Y)
        }, IT1 = {}, l61.forEach(function(A) {
            IT1[A] = function() {
                if (!c61(global.process)) return;
                var K = v$.listeners(A);
                if (K.length === ED.count) {
                    if (hT1(), Vi("exit", null, A), Vi("afterexit", null, A), $x6 && A === "SIGHUP") A = "SIGINT";
                    v$.kill(v$.pid, A)
                }
            }
        }), xw1.exports.signals = function() {
            return l61
        }, i61 = !1, ja1 = function() {
            if (i61 || !c61(global.process)) return;
            i61 = !0, ED.count += 1, l61 = l61.filter(function(q) {
                try {
                    return v$.on(q, IT1[q]), !0
                } catch (K) {
                    return !1
                }
            }), v$.emit = _x6, v$.reallyExit = Ox6
        }, xw1.exports.load = ja1, Ma1 = v$.reallyExit, Ox6 = function(q) {
            if (!c61(global.process)) return;
            v$.exitCode = q || 0, Vi("exit", v$.exitCode, null), Vi("afterexit", v$.exitCode, null), Ma1.call(v$, v$.exitCode)
        }, xT1 = v$.emit, _x6 = function(q, K) {
            if (q === "exit" && c61(global.process)) {
                if (K !== void 0) v$.exitCode = K;
                var Y = xT1.apply(this, arguments);
                return Vi("exit", v$.exitCode, null), Vi("afterexit", v$.exitCode, null), Y
            } else return xT1.apply(this, arguments)
        }
    }
    var Hx6, l61, $x6, Iw1, ED, hT1, Vi, IT1, i61, ja1, Ma1, Ox6, xT1, _x6
})
// @from(Ln 35633, Col 4)
sY8 = R((M2K, Jx6) => {
    var aY8 = Symbol();

    function D2K(A, q, K) {
        let Y = q[aY8];
        if (Y) return q.stat(A, (w, H) => {
            if (w) return K(w);
            K(null, H.mtime, Y)
        });
        let z = new Date(Math.ceil(Date.now() / 1000) * 1000 + 5);
        q.utimes(A, z, z, (w) => {
            if (w) return K(w);
            q.stat(A, (H, $) => {
                if (H) return K(H);
                let O = $.mtime.getTime() % 1000 === 0 ? "s" : "ms";
                Object.defineProperty(q, aY8, {
                    value: O
                }), K(null, $.mtime, O)
            })
        })
    }

    function j2K(A) {
        let q = Date.now();
        if (A === "s") q = Math.ceil(q / 1000) * 1000;
        return new Date(q)
    }
    M2K.probe = D2K;
    M2K.getMtime = j2K
})
// @from(Ln 35663, Col 4)
Kz8 = R((v2K, uT1) => {
    var G2K = h1("path"),
        jx6 = cz(),
        Z2K = nY8(),
        f2K = oY8(),
        tY8 = sY8(),
        VQ = {};

    function bT1(A, q) {
        return q.lockfilePath || `${A}.lock`
    }

    function Mx6(A, q, K) {
        if (!q.realpath) return K(null, G2K.resolve(A));
        q.fs.realpath(A, K)
    }

    function Dx6(A, q, K) {
        let Y = bT1(A, q);
        q.fs.mkdir(Y, (z) => {
            if (!z) return tY8.probe(Y, q.fs, (w, H, $) => {
                if (w) return q.fs.rmdir(Y, () => {}), K(w);
                K(null, H, $)
            });
            if (z.code !== "EEXIST") return K(z);
            if (q.stale <= 0) return K(Object.assign(Error("Lock file is already being held"), {
                code: "ELOCKED",
                file: A
            }));
            q.fs.stat(Y, (w, H) => {
                if (w) {
                    if (w.code === "ENOENT") return Dx6(A, {
                        ...q,
                        stale: 0
                    }, K);
                    return K(w)
                }
                if (!eY8(H, q)) return K(Object.assign(Error("Lock file is already being held"), {
                    code: "ELOCKED",
                    file: A
                }));
                Az8(A, q, ($) => {
                    if ($) return K($);
                    Dx6(A, {
                        ...q,
                        stale: 0
                    }, K)
                })
            })
        })
    }

    function eY8(A, q) {
        return A.mtime.getTime() < Date.now() - q.stale
    }

    function Az8(A, q, K) {
        q.fs.rmdir(bT1(A, q), (Y) => {
            if (Y && Y.code !== "ENOENT") return K(Y);
            K()
        })
    }

    function Pa1(A, q) {
        let K = VQ[A];
        if (K.updateTimeout) return;
        if (K.updateDelay = K.updateDelay || q.update, K.updateTimeout = setTimeout(() => {
                K.updateTimeout = null, q.fs.stat(K.lockfilePath, (Y, z) => {
                    let w = K.lastUpdate + q.stale < Date.now();
                    if (Y) {
                        if (Y.code === "ENOENT" || w) return Xx6(A, K, Object.assign(Y, {
                            code: "ECOMPROMISED"
                        }));
                        return K.updateDelay = 1000, Pa1(A, q)
                    }
                    if (K.mtime.getTime() !== z.mtime.getTime()) return Xx6(A, K, Object.assign(Error("Unable to update lock within the stale threshold"), {
                        code: "ECOMPROMISED"
                    }));
                    let $ = tY8.getMtime(K.mtimePrecision);
                    q.fs.utimes(K.lockfilePath, $, $, (O) => {
                        let _ = K.lastUpdate + q.stale < Date.now();
                        if (K.released) return;
                        if (O) {
                            if (O.code === "ENOENT" || _) return Xx6(A, K, Object.assign(O, {
                                code: "ECOMPROMISED"
                            }));
                            return K.updateDelay = 1000, Pa1(A, q)
                        }
                        K.mtime = $, K.lastUpdate = Date.now(), K.updateDelay = null, Pa1(A, q)
                    })
                })
            }, K.updateDelay), K.updateTimeout.unref) K.updateTimeout.unref()
    }

    function Xx6(A, q, K) {
        if (q.released = !0, q.updateTimeout) clearTimeout(q.updateTimeout);
        if (VQ[A] === q) delete VQ[A];
        q.options.onCompromised(K)
    }

    function V2K(A, q, K) {
        q = {
            stale: 1e4,
            update: null,
            realpath: !0,
            retries: 0,
            fs: jx6,
            onCompromised: (Y) => {
                throw Y
            },
            ...q
        }, q.retries = q.retries || 0, q.retries = typeof q.retries === "number" ? {
            retries: q.retries
        } : q.retries, q.stale = Math.max(q.stale || 0, 2000), q.update = q.update == null ? q.stale / 2 : q.update || 0, q.update = Math.max(Math.min(q.update, q.stale / 2), 1000), Mx6(A, q, (Y, z) => {
            if (Y) return K(Y);
            let w = Z2K.operation(q.retries);
            w.attempt(() => {
                Dx6(z, q, (H, $, O) => {
                    if (w.retry(H)) return;
                    if (H) return K(w.mainError());
                    let _ = VQ[z] = {
                        lockfilePath: bT1(z, q),
                        mtime: $,
                        mtimePrecision: O,
                        options: q,
                        lastUpdate: Date.now()
                    };
                    Pa1(z, q), K(null, (J) => {
                        if (_.released) return J && J(Object.assign(Error("Lock is already released"), {
                            code: "ERELEASED"
                        }));
                        qz8(z, {
                            ...q,
                            realpath: !1
                        }, J)
                    })
                })
            })
        })
    }

    function qz8(A, q, K) {
        q = {
            fs: jx6,
            realpath: !0,
            ...q
        }, Mx6(A, q, (Y, z) => {
            if (Y) return K(Y);
            let w = VQ[z];
            if (!w) return K(Object.assign(Error("Lock is not acquired/owned by you"), {
                code: "ENOTACQUIRED"
            }));
            w.updateTimeout && clearTimeout(w.updateTimeout), w.released = !0, delete VQ[z], Az8(z, q, K)
        })
    }

    function N2K(A, q, K) {
        q = {
            stale: 1e4,
            realpath: !0,
            fs: jx6,
            ...q
        }, q.stale = Math.max(q.stale || 0, 2000), Mx6(A, q, (Y, z) => {
            if (Y) return K(Y);
            q.fs.stat(bT1(z, q), (w, H) => {
                if (w) return w.code === "ENOENT" ? K(null, !1) : K(w);
                return K(null, !eY8(H, q))
            })
        })
    }

    function T2K() {
        return VQ
    }
    f2K(() => {
        for (let A in VQ) {
            let q = VQ[A].options;
            try {
                q.fs.rmdirSync(bT1(A, q))
            } catch (K) {}
        }
    });
    v2K.lock = V2K;
    v2K.unlock = qz8;
    v2K.check = N2K;
    v2K.getLocks = T2K
})
// @from(Ln 35850, Col 4)
zz8 = R((Oiz, Yz8) => {
    var y2K = cz();

    function C2K(A) {
        let q = ["mkdir", "realpath", "stat", "rmdir", "utimes"],
            K = {
                ...A
            };
        return q.forEach((Y) => {
            K[Y] = (...z) => {
                let w = z.pop(),
                    H;
                try {
                    H = A[`${Y}Sync`](...z)
                } catch ($) {
                    return w($)
                }
                w(null, H)
            }
        }), K
    }

    function S2K(A) {
        return (...q) => new Promise((K, Y) => {
            q.push((z, w) => {
                if (z) Y(z);
                else K(w)
            }), A(...q)
        })
    }

    function h2K(A) {
        return (...q) => {
            let K, Y;
            if (q.push((z, w) => {
                    K = z, Y = w
                }), A(...q), K) throw K;
            return Y
        }
    }

    function I2K(A) {
        if (A = {
                ...A
            }, A.fs = C2K(A.fs || y2K), typeof A.retries === "number" && A.retries > 0 || A.retries && typeof A.retries.retries === "number" && A.retries.retries > 0) throw Object.assign(Error("Cannot use retries with the sync api"), {
            code: "ESYNC"
        });
        return A
    }
    Yz8.exports = {
        toPromise: S2K,
        toSync: h2K,
        toSyncOptions: I2K
    }
})
// @from(Ln 35905, Col 4)
NQ = R((_iz, Ni) => {
    var bw1 = Kz8(),
        {
            toPromise: Wa1,
            toSync: Ga1,
            toSyncOptions: Px6
        } = zz8();
    async function wz8(A, q) {
        let K = await Wa1(bw1.lock)(A, q);
        return Wa1(K)
    }

    function x2K(A, q) {
        let K = Ga1(bw1.lock)(A, Px6(q));
        return Ga1(K)
    }

    function b2K(A, q) {
        return Wa1(bw1.unlock)(A, q)
    }

    function u2K(A, q) {
        return Ga1(bw1.unlock)(A, Px6(q))
    }

    function B2K(A, q) {
        return Wa1(bw1.check)(A, q)
    }

    function m2K(A, q) {
        return Ga1(bw1.check)(A, Px6(q))
    }
    Ni.exports = wz8;
    Ni.exports.lock = wz8;
    Ni.exports.unlock = b2K;
    Ni.exports.lockSync = x2K;
    Ni.exports.unlockSync = u2K;
    Ni.exports.check = B2K;
    Ni.exports.checkSync = m2K
})
// @from(Ln 35946, Col 0)
function Qf(A, q, K = 10 * $z8 * Hz8) {
    let Y;
    if (q === void 0) Y = {};
    else if (q instanceof AbortSignal) Y = {
        abortSignal: q,
        timeout: K
    };
    else Y = q;
    let {
        abortSignal: z,
        timeout: w = 10 * $z8 * Hz8,
        input: H,
        stdio: $ = ["ignore", "pipe", "pipe"]
    } = Y;
    z?.throwIfAborted();
    let O = performance.now();
    try {
        let _ = Aw1(A, {
            env: process.env,
            maxBuffer: 1e6,
            timeout: w,
            cwd: h6(),
            stdio: $,
            shell: !0,
            reject: !1,
            input: H
        });
        if (performance.now() - O > $Q, !_.stdout) return null;
        return _.stdout.trim() || null
    } catch {
        return performance.now() - O > $Q, null
    }
}
// @from(Ln 35979, Col 4)
Hz8 = 1000
// @from(Ln 35980, Col 4)
$z8 = 60
// @from(Ln 35981, Col 4)
Wx6 = v(() => {
    Bf();
    N7();
    Z6();
    m6();
    B6()
})
// @from(Ln 35989, Col 0)
function IA(A, q, K = {
    timeout: 10 * Zx6 * Gx6,
    preserveOutputOnError: !0,
    useCwd: !0
}) {
    return d4(A, q, {
        abortSignal: K.abortSignal,
        timeout: K.timeout,
        preserveOutputOnError: K.preserveOutputOnError,
        cwd: K.useCwd ? h6() : void 0,
        env: K.env,
        stdin: K.stdin
    })
}
// @from(Ln 36004, Col 0)
function F2K(A, q) {
    if (A.shortMessage) return A.shortMessage;
    if (typeof A.signal === "string") return A.signal;
    return String(q)
}
// @from(Ln 36010, Col 0)
function d4(A, q, {
    abortSignal: K,
    timeout: Y = 10 * Zx6 * Gx6,
    preserveOutputOnError: z = !0,
    cwd: w,
    env: H,
    maxBuffer: $,
    shell: O,
    stdin: _
} = {
    timeout: 10 * Zx6 * Gx6,
    preserveOutputOnError: !0,
    maxBuffer: 1e6
}) {
    return new Promise((J) => {
        XY(A, q, {
            maxBuffer: $,
            signal: K,
            timeout: Y,
            cwd: w,
            env: H,
            shell: O,
            stdin: _,
            reject: !1
        }).then((X) => {
            if (X.failed)
                if (z) {
                    let D = X.exitCode ?? 1;
                    J({
                        stdout: X.stdout || "",
                        stderr: X.stderr || "",
                        code: D,
                        error: F2K(X, D)
                    })
                } else J({
                    stdout: "",
                    stderr: "",
                    code: X.exitCode ?? 1
                });
            else J({
                stdout: X.stdout,
                stderr: X.stderr,
                code: 0
            })
        }).catch((X) => {
            K1(X), J({
                stdout: "",
                stderr: "",
                code: 1
            })
        })
    })
}
// @from(Ln 36063, Col 4)
Gx6 = 1000
// @from(Ln 36064, Col 4)
Zx6 = 60
// @from(Ln 36065, Col 4)
tq = v(() => {
    Bf();
    N7();
    y6();
    Wx6()
})
// @from(Ln 36083, Col 0)
function uw1() {
    let A = fa1();
    return {
        rgPath: A.command,
        rgArgs: A.args,
        argv0: A.argv0
    }
}
// @from(Ln 36092, Col 0)
function l2K(A) {
    return A.includes("os error 11") || A.includes("Resource temporarily unavailable")
}
// @from(Ln 36096, Col 0)
function Oz8(A, q, K, Y, z = !1) {
    let {
        rgPath: w,
        rgArgs: H,
        argv0: $
    } = uw1(), O = z ? ["-j", "1"] : [], _ = [...H, ...O, ...A, q], J = eA() === "wsl" ? 60000 : 20000, X = parseInt(process.env.CLAUDE_CODE_GLOB_TIMEOUT_SECONDS || "", 10) || 0, D = X > 0 ? X * 1000 : J;
    if ($) {
        let j = p2K(w, _, {
                argv0: $,
                signal: K,
                windowsHide: !0
            }),
            M = "",
            P = "",
            W = !1,
            G = !1;
        j.stdout?.on("data", (N) => {
            if (!W) {
                if (M += N.toString(), M.length > BT1) M = M.slice(0, BT1), W = !0
            }
        }), j.stderr?.on("data", (N) => {
            if (!G) {
                if (P += N.toString(), P.length > BT1) P = P.slice(0, BT1), G = !0
            }
        });
        let f, Z = setTimeout(() => {
            if (process.platform === "win32") j.kill();
            else j.kill("SIGTERM"), f = setTimeout(() => {
                j.kill("SIGKILL")
            }, 5000)
        }, D);
        return j.on("close", (N, T) => {
            if (clearTimeout(Z), clearTimeout(f), N === 0 || N === 1) Y(null, M, P);
            else {
                let k = Error(`ripgrep exited with code ${N}`);
                k.code = N ?? void 0, k.signal = T ?? void 0, Y(k, M, P)
            }
        }), j.on("error", (N) => {
            clearTimeout(Z), clearTimeout(f), Y(N, M, P)
        }), j
    }
    return U2K(w, _, {
        maxBuffer: BT1,
        signal: K,
        timeout: D,
        killSignal: process.platform === "win32" ? void 0 : "SIGKILL"
    }, Y)
}
// @from(Ln 36144, Col 0)
async function lx(A, q, K) {
    if (!D9()) await n2K();
    return i2K().catch((Y) => {
        K1(Y instanceof Error ? Y : Error(String(Y)))
    }), new Promise((Y, z) => {
        let w = (H, $, O, _) => {
            if (!H) {
                Y($.trim().split(`
`).filter(Boolean));
                return
            }
            if (H.code === 1) {
                Y([]);
                return
            }
            if (["ENOENT", "EACCES", "EPERM"].includes(H.code)) {
                z(H);
                return
            }
            if (!_ && l2K(O)) {
                h("rg EAGAIN error detected, retrying with single-threaded mode (-j 1)"), c("tengu_ripgrep_eagain_retry", {}), Oz8(A, q, K, (P, W, G) => {
                    w(P, W, G, !0)
                }, !0);
                return
            }
            let X = $ && $.trim().length > 0,
                D = H.signal === "SIGTERM" || H.signal === "SIGKILL" || H.code === "ABORT_ERR",
                j = H.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER",
                M = [];
            if (X) {
                if (M = $.trim().split(`
`).filter(Boolean), M.length > 0 && (D || j)) M = M.slice(0, -1)
            }
            if (h(`rg error (signal=${H.signal}, code=${H.code}, stderr: ${O}), ${M.length} results`), H.code !== 2) K1(H);
            if (D && M.length === 0) {
                z(new Xz8(`Ripgrep search timed out after ${eA()==="wsl"?60:20} seconds. The search may have matched files but did not complete in time. Try searching a more specific path or pattern.`, M));
                return
            }
            Y(M)
        };
        Oz8(A, q, K, (H, $, O) => {
            w(H, $, O, !1)
        })
    })
}
// @from(Ln 36189, Col 0)
async function Dz8(A, q, K) {
    try {
        return (await lx(["-l", "."], A, q)).slice(0, K)
    } catch {
        return []
    }
}
// @from(Ln 36197, Col 0)
function jz8() {
    let A = fa1();
    return {
        mode: A.mode,
        path: A.command,
        working: Za1?.working ?? null
    }
}
// @from(Ln 36205, Col 0)
async function n2K() {
    if (process.platform !== "darwin" || _z8) return;
    _z8 = !0;
    let A = fa1();
    if (A.mode !== "builtin" || D9()) return;
    let q = A.command;
    if (!(await IA("codesign", ["-vv", "-d", q], {
            preserveOutputOnError: !1
        })).stdout.split(`
`).find((z) => z.includes("linker-signed"))) return;
    try {
        let z = await IA("codesign", ["--sign", "-", "--force", "--preserve-metadata=entitlements,requirements,flags,runtime", q]);
        if (z.code !== 0) K1(Error(`Failed to sign ripgrep: ${z.stdout} ${z.stderr}`));
        let w = await IA("xattr", ["-d", "com.apple.quarantine", q]);
        if (w.code !== 0) K1(Error(`Failed to remove quarantine: ${w.stdout} ${w.stderr}`))
    } catch (z) {
        K1(z)
    }
}
// @from(Ln 36224, Col 4)
Jz8
// @from(Ln 36224, Col 9)
d2K
// @from(Ln 36224, Col 14)
c2K
// @from(Ln 36224, Col 19)
fa1
// @from(Ln 36224, Col 24)
BT1 = 20000000
// @from(Ln 36225, Col 4)
Xz8
// @from(Ln 36225, Col 9)
Va1
// @from(Ln 36225, Col 14)
Za1 = null
// @from(Ln 36226, Col 4)
i2K
// @from(Ln 36226, Col 9)
_z8 = !1
// @from(Ln 36227, Col 4)
ix = v(() => {
    zq();
    y6();
    tq();
    Z6();
    hA();
    u6();
    x3();
    m6();
    Jz8 = o(FS6(), 1), d2K = Q2K(import.meta.url), c2K = Ti.join(d2K, "../"), fa1 = KA(() => {
        if (FY(process.env.USE_BUILTIN_RIPGREP)) {
            let {
                cmd: Y
            } = Jz8.findActualExecutable("rg", []);
            if (Y !== "rg") return {
                mode: "system",
                command: "rg",
                args: []
            }
        }
        if (D9()) {
            if (process.env.RIPGREP_EMBEDDED === "true") return {
                mode: "embedded",
                command: process.execPath,
                args: [],
                argv0: "rg"
            };
            return {
                mode: "builtin",
                command: process.execPath,
                args: ["--ripgrep"]
            }
        }
        let q = Ti.resolve(c2K, "vendor", "ripgrep");
        return {
            mode: "builtin",
            command: process.platform === "win32" ? Ti.resolve(q, "x64-win32", "rg.exe") : Ti.resolve(q, `${process.arch}-${process.platform}`, "rg"),
            args: []
        }
    });
    Xz8 = class Xz8 extends Error {
        partialResults;
        constructor(A, q) {
            super(A);
            this.partialResults = q;
            this.name = "RipgrepTimeoutError"
        }
    };
    Va1 = KA(async (A, q, K = []) => {
        if (Ti.resolve(A) === Ti.resolve(g2K())) return;
        try {
            let Y = ["--files", "--hidden"];
            K.forEach((O) => {
                Y.push("--glob", `!${O}`)
            });
            let w = (await lx(Y, A, q)).length;
            if (w === 0) return 0;
            let H = Math.floor(Math.log10(w)),
                $ = Math.pow(10, H);
            return Math.round(w / $) * $
        } catch (Y) {
            K1(Y instanceof Error ? Y : Error(String(Y)))
        }
    });
    i2K = KA(async () => {
        if (Za1 !== null) return;
        let A = fa1();
        try {
            let q;
            if (A.argv0) {
                let Y = Bun.spawn([A.command, "--version"], {
                        argv0: A.argv0,
                        stderr: "ignore",
                        stdout: "pipe"
                    }),
                    [z, w] = await Promise.all([Y.stdout.text(), Y.exited]);
                q = {
                    code: w,
                    stdout: z
                }
            } else q = await IA(A.command, [...A.args, "--version"], {
                timeout: 5000
            });
            let K = q.code === 0 && !!q.stdout && q.stdout.startsWith("ripgrep ");
            Za1 = {
                working: K,
                lastTested: Date.now(),
                config: A
            }, h(`Ripgrep first use test: ${K?"PASSED":"FAILED"} (mode=${A.mode}, path=${A.command})`), c("tengu_ripgrep_availability", {
                working: K ? 1 : 0,
                using_system: A.mode === "system" ? 1 : 0
            })
        } catch (q) {
            Za1 = {
                working: !1,
                lastTested: Date.now(),
                config: A
            }, K1(q instanceof Error ? q : Error(String(q)))
        }
    })
})
// @from(Ln 36328, Col 0)
class Mz8 {
    cache = new Map;
    maxCacheSize = 1000;
    readFile(A) {
        let q = b1(),
            K;
        try {
            K = q.statSync(A)
        } catch ($) {
            throw this.cache.delete(A), $
        }
        let Y = A,
            z = this.cache.get(Y);
        if (z && z.mtime === K.mtimeMs) return {
            content: z.content,
            encoding: z.encoding
        };
        let w = AX(A),
            H = q.readFileSync(A, {
                encoding: w
            }).replaceAll(`\r
`, `
`);
        if (this.cache.set(Y, {
                content: H,
                encoding: w,
                mtime: K.mtimeMs
            }), this.cache.size > this.maxCacheSize) {
            let $ = this.cache.keys().next().value;
            if ($) this.cache.delete($)
        }
        return {
            content: H,
            encoding: w
        }
    }
    clear() {
        this.cache.clear()
    }
    invalidate(A) {
        this.cache.delete(A)
    }
    getStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        }
    }
}
// @from(Ln 36377, Col 4)
Pz8
// @from(Ln 36378, Col 4)
Wz8 = v(() => {
    _8();
    wq();
    Pz8 = new Mz8
})
// @from(Ln 36384, Col 0)
function l8() {
    if (!J6(process.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS)) return !1;
    if (!x8("tengu_amber_flint", !0)) return !1;
    return !0
}
// @from(Ln 36389, Col 4)
S9 = v(() => {
    U4();
    hA()
})
// @from(Ln 36395, Col 0)
function fx6() {
    let {
        env: A
    } = Gz8, {
        TERM: q,
        TERM_PROGRAM: K
    } = A;
    if (Gz8.platform !== "win32") return q !== "linux";
    return Boolean(A.WT_SESSION) || Boolean(A.TERMINUS_SUBLIME) || A.ConEmuTask === "{cmd::Cmder}" || K === "Terminus-Sublime" || K === "vscode" || q === "xterm-256color" || q === "alacritty" || q === "rxvt-unicode" || q === "rxvt-unicode-256color" || A.TERMINAL_EMULATOR === "JetBrains-JediTerm"
}
// @from(Ln 36405, Col 4)
Zz8 = () => {}
// @from(Ln 36406, Col 4)
fz8
// @from(Ln 36406, Col 9)
Vz8
// @from(Ln 36406, Col 14)
r2K
// @from(Ln 36406, Col 19)
o2K
// @from(Ln 36406, Col 24)
a2K
// @from(Ln 36406, Col 29)
s2K
// @from(Ln 36406, Col 34)
t2K
// @from(Ln 36406, Col 39)
l1
// @from(Ln 36406, Col 43)
niz