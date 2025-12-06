
// @from(Start 2185535, End 2210278)
bbA = L(() => {
  P4A = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date, Bo0 = new Set, mz1 = typeof process === "object" && !!process ? process : {}, vbA = globalThis.AbortController, Qo0 = globalThis.AbortSignal;
  if (typeof vbA > "u") {
    Qo0 = class {
      onabort;
      _onabort = [];
      reason;
      aborted = !1;
      addEventListener(G, Z) {
        this._onabort.push(Z)
      }
    }, vbA = class {
      constructor() {
        Q()
      }
      signal = new Qo0;
      abort(G) {
        if (this.signal.aborted) return;
        this.signal.reason = G, this.signal.aborted = !0;
        for (let Z of this.signal._onabort) Z(G);
        this.signal.onabort?.(G)
      }
    };
    let A = mz1.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1",
      Q = () => {
        if (!A) return;
        A = !1, Go0("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", Q)
      }
  }
  uK7 = Symbol("type");
  TDA = class TDA extends Array {
    constructor(A) {
      super(A);
      this.fill(0)
    }
  };
  tm = class tm {
    #A;
    #Q;
    #B;
    #Z;
    #G;
    #J;
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
    #I;
    #V;
    #F;
    #W;
    #Y;
    #C;
    #z;
    #H;
    #K;
    #w;
    #D;
    #q;
    #N;
    #U;
    #L;
    #P;
    #E;
    static unsafeExposeInternals(A) {
      return {
        starts: A.#N,
        ttls: A.#U,
        sizes: A.#q,
        keyMap: A.#F,
        keyList: A.#W,
        valList: A.#Y,
        next: A.#C,
        prev: A.#z,
        get head() {
          return A.#H
        },
        get tail() {
          return A.#K
        },
        free: A.#w,
        isBackgroundFetch: (Q) => A.#X(Q),
        backgroundFetch: (Q, B, G, Z) => A.#x(Q, B, G, Z),
        moveToTail: (Q) => A.#_(Q),
        indexes: (Q) => A.#M(Q),
        rindexes: (Q) => A.#O(Q),
        isStale: (Q) => A.#$(Q)
      }
    }
    get max() {
      return this.#A
    }
    get maxSize() {
      return this.#Q
    }
    get calculatedSize() {
      return this.#V
    }
    get size() {
      return this.#I
    }
    get fetchMethod() {
      return this.#G
    }
    get memoMethod() {
      return this.#J
    }
    get dispose() {
      return this.#B
    }
    get disposeAfter() {
      return this.#Z
    }
    constructor(A) {
      let {
        max: Q = 0,
        ttl: B,
        ttlResolution: G = 1,
        ttlAutopurge: Z,
        updateAgeOnGet: I,
        updateAgeOnHas: Y,
        allowStale: J,
        dispose: W,
        disposeAfter: X,
        noDisposeOnSet: V,
        noUpdateTTL: F,
        maxSize: K = 0,
        maxEntrySize: D = 0,
        sizeCalculation: H,
        fetchMethod: C,
        memoMethod: E,
        noDeleteOnFetchRejection: U,
        noDeleteOnStaleGet: q,
        allowStaleOnFetchRejection: w,
        allowStaleOnFetchAbort: N,
        ignoreFetchAbort: R
      } = A;
      if (Q !== 0 && !om(Q)) throw TypeError("max option must be a nonnegative integer");
      let T = Q ? Zo0(Q) : Array;
      if (!T) throw Error("invalid max value: " + Q);
      if (this.#A = Q, this.#Q = K, this.maxEntrySize = D || this.#Q, this.sizeCalculation = H, this.sizeCalculation) {
        if (!this.#Q && !this.maxEntrySize) throw TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
        if (typeof this.sizeCalculation !== "function") throw TypeError("sizeCalculation set to non-function")
      }
      if (E !== void 0 && typeof E !== "function") throw TypeError("memoMethod must be a function if defined");
      if (this.#J = E, C !== void 0 && typeof C !== "function") throw TypeError("fetchMethod must be a function if specified");
      if (this.#G = C, this.#P = !!C, this.#F = new Map, this.#W = Array(Q).fill(void 0), this.#Y = Array(Q).fill(void 0), this.#C = new T(Q), this.#z = new T(Q), this.#H = 0, this.#K = 0, this.#w = j4A.create(Q), this.#I = 0, this.#V = 0, typeof W === "function") this.#B = W;
      if (typeof X === "function") this.#Z = X, this.#D = [];
      else this.#Z = void 0, this.#D = void 0;
      if (this.#L = !!this.#B, this.#E = !!this.#Z, this.noDisposeOnSet = !!V, this.noUpdateTTL = !!F, this.noDeleteOnFetchRejection = !!U, this.allowStaleOnFetchRejection = !!w, this.allowStaleOnFetchAbort = !!N, this.ignoreFetchAbort = !!R, this.maxEntrySize !== 0) {
        if (this.#Q !== 0) {
          if (!om(this.#Q)) throw TypeError("maxSize must be a positive integer if specified")
        }
        if (!om(this.maxEntrySize)) throw TypeError("maxEntrySize must be a positive integer if specified");
        this.#m()
      }
      if (this.allowStale = !!J, this.noDeleteOnStaleGet = !!q, this.updateAgeOnGet = !!I, this.updateAgeOnHas = !!Y, this.ttlResolution = om(G) || G === 0 ? G : 1, this.ttlAutopurge = !!Z, this.ttl = B || 0, this.ttl) {
        if (!om(this.ttl)) throw TypeError("ttl must be a positive integer if specified");
        this.#v()
      }
      if (this.#A === 0 && this.ttl === 0 && this.#Q === 0) throw TypeError("At least one of max, maxSize, or ttl is required");
      if (!this.ttlAutopurge && !this.#A && !this.#Q) {
        if (OX4("LRU_CACHE_UNBOUNDED")) Bo0.add("LRU_CACHE_UNBOUNDED"), Go0("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", "LRU_CACHE_UNBOUNDED", tm)
      }
    }
    getRemainingTTL(A) {
      return this.#F.has(A) ? 1 / 0 : 0
    }
    #v() {
      let A = new TDA(this.#A),
        Q = new TDA(this.#A);
      this.#U = A, this.#N = Q, this.#b = (Z, I, Y = P4A.now()) => {
        if (Q[Z] = I !== 0 ? Y : 0, A[Z] = I, I !== 0 && this.ttlAutopurge) {
          let J = setTimeout(() => {
            if (this.#$(Z)) this.#R(this.#W[Z], "expire")
          }, I + 1);
          if (J.unref) J.unref()
        }
      }, this.#j = (Z) => {
        Q[Z] = A[Z] !== 0 ? P4A.now() : 0
      }, this.#T = (Z, I) => {
        if (A[I]) {
          let Y = A[I],
            J = Q[I];
          if (!Y || !J) return;
          Z.ttl = Y, Z.start = J, Z.now = B || G();
          let W = Z.now - J;
          Z.remainingTTL = Y - W
        }
      };
      let B = 0,
        G = () => {
          let Z = P4A.now();
          if (this.ttlResolution > 0) {
            B = Z;
            let I = setTimeout(() => B = 0, this.ttlResolution);
            if (I.unref) I.unref()
          }
          return Z
        };
      this.getRemainingTTL = (Z) => {
        let I = this.#F.get(Z);
        if (I === void 0) return 0;
        let Y = A[I],
          J = Q[I];
        if (!Y || !J) return 1 / 0;
        let W = (B || G()) - J;
        return Y - W
      }, this.#$ = (Z) => {
        let I = Q[Z],
          Y = A[Z];
        return !!Y && !!I && (B || G()) - I > Y
      }
    }
    #j = () => {};
    #T = () => {};
    #b = () => {};
    #$ = () => !1;
    #m() {
      let A = new TDA(this.#A);
      this.#V = 0, this.#q = A, this.#S = (Q) => {
        this.#V -= A[Q], A[Q] = 0
      }, this.#f = (Q, B, G, Z) => {
        if (this.#X(B)) return 0;
        if (!om(G))
          if (Z) {
            if (typeof Z !== "function") throw TypeError("sizeCalculation must be a function");
            if (G = Z(B, Q), !om(G)) throw TypeError("sizeCalculation return invalid (expect positive integer)")
          } else throw TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        return G
      }, this.#k = (Q, B, G) => {
        if (A[Q] = B, this.#Q) {
          let Z = this.#Q - A[Q];
          while (this.#V > Z) this.#y(!0)
        }
        if (this.#V += A[Q], G) G.entrySize = B, G.totalCalculatedSize = this.#V
      }
    }
    #S = (A) => {};
    #k = (A, Q, B) => {};
    #f = (A, Q, B, G) => {
      if (B || G) throw TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
      return 0
    };* #M({
      allowStale: A = this.allowStale
    } = {}) {
      if (this.#I)
        for (let Q = this.#K;;) {
          if (!this.#h(Q)) break;
          if (A || !this.#$(Q)) yield Q;
          if (Q === this.#H) break;
          else Q = this.#z[Q]
        }
    }* #O({
      allowStale: A = this.allowStale
    } = {}) {
      if (this.#I)
        for (let Q = this.#H;;) {
          if (!this.#h(Q)) break;
          if (A || !this.#$(Q)) yield Q;
          if (Q === this.#K) break;
          else Q = this.#C[Q]
        }
    }
    #h(A) {
      return A !== void 0 && this.#F.get(this.#W[A]) === A
    }* entries() {
      for (let A of this.#M())
        if (this.#Y[A] !== void 0 && this.#W[A] !== void 0 && !this.#X(this.#Y[A])) yield [this.#W[A], this.#Y[A]]
    }* rentries() {
      for (let A of this.#O())
        if (this.#Y[A] !== void 0 && this.#W[A] !== void 0 && !this.#X(this.#Y[A])) yield [this.#W[A], this.#Y[A]]
    }* keys() {
      for (let A of this.#M()) {
        let Q = this.#W[A];
        if (Q !== void 0 && !this.#X(this.#Y[A])) yield Q
      }
    }* rkeys() {
      for (let A of this.#O()) {
        let Q = this.#W[A];
        if (Q !== void 0 && !this.#X(this.#Y[A])) yield Q
      }
    }* values() {
      for (let A of this.#M())
        if (this.#Y[A] !== void 0 && !this.#X(this.#Y[A])) yield this.#Y[A]
    }* rvalues() {
      for (let A of this.#O())
        if (this.#Y[A] !== void 0 && !this.#X(this.#Y[A])) yield this.#Y[A]
    } [Symbol.iterator]() {
      return this.entries()
    } [Symbol.toStringTag] = "LRUCache";
    find(A, Q = {}) {
      for (let B of this.#M()) {
        let G = this.#Y[B],
          Z = this.#X(G) ? G.__staleWhileFetching : G;
        if (Z === void 0) continue;
        if (A(Z, this.#W[B], this)) return this.get(this.#W[B], Q)
      }
    }
    forEach(A, Q = this) {
      for (let B of this.#M()) {
        let G = this.#Y[B],
          Z = this.#X(G) ? G.__staleWhileFetching : G;
        if (Z === void 0) continue;
        A.call(Q, Z, this.#W[B], this)
      }
    }
    rforEach(A, Q = this) {
      for (let B of this.#O()) {
        let G = this.#Y[B],
          Z = this.#X(G) ? G.__staleWhileFetching : G;
        if (Z === void 0) continue;
        A.call(Q, Z, this.#W[B], this)
      }
    }
    purgeStale() {
      let A = !1;
      for (let Q of this.#O({
          allowStale: !0
        }))
        if (this.#$(Q)) this.#R(this.#W[Q], "expire"), A = !0;
      return A
    }
    info(A) {
      let Q = this.#F.get(A);
      if (Q === void 0) return;
      let B = this.#Y[Q],
        G = this.#X(B) ? B.__staleWhileFetching : B;
      if (G === void 0) return;
      let Z = {
        value: G
      };
      if (this.#U && this.#N) {
        let I = this.#U[Q],
          Y = this.#N[Q];
        if (I && Y) {
          let J = I - (P4A.now() - Y);
          Z.ttl = J, Z.start = Date.now()
        }
      }
      if (this.#q) Z.size = this.#q[Q];
      return Z
    }
    dump() {
      let A = [];
      for (let Q of this.#M({
          allowStale: !0
        })) {
        let B = this.#W[Q],
          G = this.#Y[Q],
          Z = this.#X(G) ? G.__staleWhileFetching : G;
        if (Z === void 0 || B === void 0) continue;
        let I = {
          value: Z
        };
        if (this.#U && this.#N) {
          I.ttl = this.#U[Q];
          let Y = P4A.now() - this.#N[Q];
          I.start = Math.floor(Date.now() - Y)
        }
        if (this.#q) I.size = this.#q[Q];
        A.unshift([B, I])
      }
      return A
    }
    load(A) {
      this.clear();
      for (let [Q, B] of A) {
        if (B.start) {
          let G = Date.now() - B.start;
          B.start = P4A.now() - G
        }
        this.set(Q, B.value, B)
      }
    }
    set(A, Q, B = {}) {
      if (Q === void 0) return this.delete(A), this;
      let {
        ttl: G = this.ttl,
        start: Z,
        noDisposeOnSet: I = this.noDisposeOnSet,
        sizeCalculation: Y = this.sizeCalculation,
        status: J
      } = B, {
        noUpdateTTL: W = this.noUpdateTTL
      } = B, X = this.#f(A, Q, B.size || 0, Y);
      if (this.maxEntrySize && X > this.maxEntrySize) {
        if (J) J.set = "miss", J.maxEntrySizeExceeded = !0;
        return this.#R(A, "set"), this
      }
      let V = this.#I === 0 ? void 0 : this.#F.get(A);
      if (V === void 0) {
        if (V = this.#I === 0 ? this.#K : this.#w.length !== 0 ? this.#w.pop() : this.#I === this.#A ? this.#y(!1) : this.#I, this.#W[V] = A, this.#Y[V] = Q, this.#F.set(A, V), this.#C[this.#K] = V, this.#z[V] = this.#K, this.#K = V, this.#I++, this.#k(V, X, J), J) J.set = "add";
        W = !1
      } else {
        this.#_(V);
        let F = this.#Y[V];
        if (Q !== F) {
          if (this.#P && this.#X(F)) {
            F.__abortController.abort(Error("replaced"));
            let {
              __staleWhileFetching: K
            } = F;
            if (K !== void 0 && !I) {
              if (this.#L) this.#B?.(K, A, "set");
              if (this.#E) this.#D?.push([K, A, "set"])
            }
          } else if (!I) {
            if (this.#L) this.#B?.(F, A, "set");
            if (this.#E) this.#D?.push([F, A, "set"])
          }
          if (this.#S(V), this.#k(V, X, J), this.#Y[V] = Q, J) {
            J.set = "replace";
            let K = F && this.#X(F) ? F.__staleWhileFetching : F;
            if (K !== void 0) J.oldValue = K
          }
        } else if (J) J.set = "update"
      }
      if (G !== 0 && !this.#U) this.#v();
      if (this.#U) {
        if (!W) this.#b(V, G, Z);
        if (J) this.#T(J, V)
      }
      if (!I && this.#E && this.#D) {
        let F = this.#D,
          K;
        while (K = F?.shift()) this.#Z?.(...K)
      }
      return this
    }
    pop() {
      try {
        while (this.#I) {
          let A = this.#Y[this.#H];
          if (this.#y(!0), this.#X(A)) {
            if (A.__staleWhileFetching) return A.__staleWhileFetching
          } else if (A !== void 0) return A
        }
      } finally {
        if (this.#E && this.#D) {
          let A = this.#D,
            Q;
          while (Q = A?.shift()) this.#Z?.(...Q)
        }
      }
    }
    #y(A) {
      let Q = this.#H,
        B = this.#W[Q],
        G = this.#Y[Q];
      if (this.#P && this.#X(G)) G.__abortController.abort(Error("evicted"));
      else if (this.#L || this.#E) {
        if (this.#L) this.#B?.(G, B, "evict");
        if (this.#E) this.#D?.push([G, B, "evict"])
      }
      if (this.#S(Q), A) this.#W[Q] = void 0, this.#Y[Q] = void 0, this.#w.push(Q);
      if (this.#I === 1) this.#H = this.#K = 0, this.#w.length = 0;
      else this.#H = this.#C[Q];
      return this.#F.delete(B), this.#I--, Q
    }
    has(A, Q = {}) {
      let {
        updateAgeOnHas: B = this.updateAgeOnHas,
        status: G
      } = Q, Z = this.#F.get(A);
      if (Z !== void 0) {
        let I = this.#Y[Z];
        if (this.#X(I) && I.__staleWhileFetching === void 0) return !1;
        if (!this.#$(Z)) {
          if (B) this.#j(Z);
          if (G) G.has = "hit", this.#T(G, Z);
          return !0
        } else if (G) G.has = "stale", this.#T(G, Z)
      } else if (G) G.has = "miss";
      return !1
    }
    peek(A, Q = {}) {
      let {
        allowStale: B = this.allowStale
      } = Q, G = this.#F.get(A);
      if (G === void 0 || !B && this.#$(G)) return;
      let Z = this.#Y[G];
      return this.#X(Z) ? Z.__staleWhileFetching : Z
    }
    #x(A, Q, B, G) {
      let Z = Q === void 0 ? void 0 : this.#Y[Q];
      if (this.#X(Z)) return Z;
      let I = new vbA,
        {
          signal: Y
        } = B;
      Y?.addEventListener("abort", () => I.abort(Y.reason), {
        signal: I.signal
      });
      let J = {
          signal: I.signal,
          options: B,
          context: G
        },
        W = (H, C = !1) => {
          let {
            aborted: E
          } = I.signal, U = B.ignoreFetchAbort && H !== void 0;
          if (B.status)
            if (E && !C) {
              if (B.status.fetchAborted = !0, B.status.fetchError = I.signal.reason, U) B.status.fetchAbortIgnored = !0
            } else B.status.fetchResolved = !0;
          if (E && !U && !C) return V(I.signal.reason);
          let q = K;
          if (this.#Y[Q] === K)
            if (H === void 0)
              if (q.__staleWhileFetching) this.#Y[Q] = q.__staleWhileFetching;
              else this.#R(A, "fetch");
          else {
            if (B.status) B.status.fetchUpdated = !0;
            this.set(A, H, J.options)
          }
          return H
        },
        X = (H) => {
          if (B.status) B.status.fetchRejected = !0, B.status.fetchError = H;
          return V(H)
        },
        V = (H) => {
          let {
            aborted: C
          } = I.signal, E = C && B.allowStaleOnFetchAbort, U = E || B.allowStaleOnFetchRejection, q = U || B.noDeleteOnFetchRejection, w = K;
          if (this.#Y[Q] === K) {
            if (!q || w.__staleWhileFetching === void 0) this.#R(A, "fetch");
            else if (!E) this.#Y[Q] = w.__staleWhileFetching
          }
          if (U) {
            if (B.status && w.__staleWhileFetching !== void 0) B.status.returnedStale = !0;
            return w.__staleWhileFetching
          } else if (w.__returned === w) throw H
        },
        F = (H, C) => {
          let E = this.#G?.(A, Z, J);
          if (E && E instanceof Promise) E.then((U) => H(U === void 0 ? void 0 : U), C);
          I.signal.addEventListener("abort", () => {
            if (!B.ignoreFetchAbort || B.allowStaleOnFetchAbort) {
              if (H(void 0), B.allowStaleOnFetchAbort) H = (U) => W(U, !0)
            }
          })
        };
      if (B.status) B.status.fetchDispatched = !0;
      let K = new Promise(F).then(W, X),
        D = Object.assign(K, {
          __abortController: I,
          __staleWhileFetching: Z,
          __returned: void 0
        });
      if (Q === void 0) this.set(A, D, {
        ...J.options,
        status: void 0
      }), Q = this.#F.get(A);
      else this.#Y[Q] = D;
      return D
    }
    #X(A) {
      if (!this.#P) return !1;
      let Q = A;
      return !!Q && Q instanceof Promise && Q.hasOwnProperty("__staleWhileFetching") && Q.__abortController instanceof vbA
    }
    async fetch(A, Q = {}) {
      let {
        allowStale: B = this.allowStale,
        updateAgeOnGet: G = this.updateAgeOnGet,
        noDeleteOnStaleGet: Z = this.noDeleteOnStaleGet,
        ttl: I = this.ttl,
        noDisposeOnSet: Y = this.noDisposeOnSet,
        size: J = 0,
        sizeCalculation: W = this.sizeCalculation,
        noUpdateTTL: X = this.noUpdateTTL,
        noDeleteOnFetchRejection: V = this.noDeleteOnFetchRejection,
        allowStaleOnFetchRejection: F = this.allowStaleOnFetchRejection,
        ignoreFetchAbort: K = this.ignoreFetchAbort,
        allowStaleOnFetchAbort: D = this.allowStaleOnFetchAbort,
        context: H,
        forceRefresh: C = !1,
        status: E,
        signal: U
      } = Q;
      if (!this.#P) {
        if (E) E.fetch = "get";
        return this.get(A, {
          allowStale: B,
          updateAgeOnGet: G,
          noDeleteOnStaleGet: Z,
          status: E
        })
      }
      let q = {
          allowStale: B,
          updateAgeOnGet: G,
          noDeleteOnStaleGet: Z,
          ttl: I,
          noDisposeOnSet: Y,
          size: J,
          sizeCalculation: W,
          noUpdateTTL: X,
          noDeleteOnFetchRejection: V,
          allowStaleOnFetchRejection: F,
          allowStaleOnFetchAbort: D,
          ignoreFetchAbort: K,
          status: E,
          signal: U
        },
        w = this.#F.get(A);
      if (w === void 0) {
        if (E) E.fetch = "miss";
        let N = this.#x(A, w, q, H);
        return N.__returned = N
      } else {
        let N = this.#Y[w];
        if (this.#X(N)) {
          let x = B && N.__staleWhileFetching !== void 0;
          if (E) {
            if (E.fetch = "inflight", x) E.returnedStale = !0
          }
          return x ? N.__staleWhileFetching : N.__returned = N
        }
        let R = this.#$(w);
        if (!C && !R) {
          if (E) E.fetch = "hit";
          if (this.#_(w), G) this.#j(w);
          if (E) this.#T(E, w);
          return N
        }
        let T = this.#x(A, w, q, H),
          v = T.__staleWhileFetching !== void 0 && B;
        if (E) {
          if (E.fetch = R ? "stale" : "refresh", v && R) E.returnedStale = !0
        }
        return v ? T.__staleWhileFetching : T.__returned = T
      }
    }
    async forceFetch(A, Q = {}) {
      let B = await this.fetch(A, Q);
      if (B === void 0) throw Error("fetch() returned undefined");
      return B
    }
    memo(A, Q = {}) {
      let B = this.#J;
      if (!B) throw Error("no memoMethod provided to constructor");
      let {
        context: G,
        forceRefresh: Z,
        ...I
      } = Q, Y = this.get(A, I);
      if (!Z && Y !== void 0) return Y;
      let J = B(A, Y, {
        options: I,
        context: G
      });
      return this.set(A, J, I), J
    }
    get(A, Q = {}) {
      let {
        allowStale: B = this.allowStale,
        updateAgeOnGet: G = this.updateAgeOnGet,
        noDeleteOnStaleGet: Z = this.noDeleteOnStaleGet,
        status: I
      } = Q, Y = this.#F.get(A);
      if (Y !== void 0) {
        let J = this.#Y[Y],
          W = this.#X(J);
        if (I) this.#T(I, Y);
        if (this.#$(Y)) {
          if (I) I.get = "stale";
          if (!W) {
            if (!Z) this.#R(A, "expire");
            if (I && B) I.returnedStale = !0;
            return B ? J : void 0
          } else {
            if (I && B && J.__staleWhileFetching !== void 0) I.returnedStale = !0;
            return B ? J.__staleWhileFetching : void 0
          }
        } else {
          if (I) I.get = "hit";
          if (W) return J.__staleWhileFetching;
          if (this.#_(Y), G) this.#j(Y);
          return J
        }
      } else if (I) I.get = "miss"
    }
    #g(A, Q) {
      this.#z[Q] = A, this.#C[A] = Q
    }
    #_(A) {
      if (A !== this.#K) {
        if (A === this.#H) this.#H = this.#C[A];
        else this.#g(this.#z[A], this.#C[A]);
        this.#g(this.#K, A), this.#K = A
      }
    }
    delete(A) {
      return this.#R(A, "delete")
    }
    #R(A, Q) {
      let B = !1;
      if (this.#I !== 0) {
        let G = this.#F.get(A);
        if (G !== void 0)
          if (B = !0, this.#I === 1) this.#u(Q);
          else {
            this.#S(G);
            let Z = this.#Y[G];
            if (this.#X(Z)) Z.__abortController.abort(Error("deleted"));
            else if (this.#L || this.#E) {
              if (this.#L) this.#B?.(Z, A, Q);
              if (this.#E) this.#D?.push([Z, A, Q])
            }
            if (this.#F.delete(A), this.#W[G] = void 0, this.#Y[G] = void 0, G === this.#K) this.#K = this.#z[G];
            else if (G === this.#H) this.#H = this.#C[G];
            else {
              let I = this.#z[G];
              this.#C[I] = this.#C[G];
              let Y = this.#C[G];
              this.#z[Y] = this.#z[G]
            }
            this.#I--, this.#w.push(G)
          }
      }
      if (this.#E && this.#D?.length) {
        let G = this.#D,
          Z;
        while (Z = G?.shift()) this.#Z?.(...Z)
      }
      return B
    }
    clear() {
      return this.#u("delete")
    }
    #u(A) {
      for (let Q of this.#O({
          allowStale: !0
        })) {
        let B = this.#Y[Q];
        if (this.#X(B)) B.__abortController.abort(Error("deleted"));
        else {
          let G = this.#W[Q];
          if (this.#L) this.#B?.(B, G, A);
          if (this.#E) this.#D?.push([B, G, A])
        }
      }
      if (this.#F.clear(), this.#Y.fill(void 0), this.#W.fill(void 0), this.#U && this.#N) this.#U.fill(0), this.#N.fill(0);
      if (this.#q) this.#q.fill(0);
      if (this.#H = 0, this.#K = 0, this.#w.length = 0, this.#V = 0, this.#I = 0, this.#E && this.#D) {
        let Q = this.#D,
          B;
        while (B = Q?.shift()) this.#Z?.(...B)
      }
    }
  }
})
// @from(Start 2210281, End 2211031)
function dz1(A, Q = 300000) {
  let B = new Map,
    G = (...Z) => {
      let I = JSON.stringify(Z),
        Y = B.get(I),
        J = Date.now();
      if (!Y) {
        let W = A(...Z);
        return B.set(I, {
          value: W,
          timestamp: J,
          refreshing: !1
        }), W
      }
      if (Y && J - Y.timestamp > Q && !Y.refreshing) return Y.refreshing = !0, Promise.resolve().then(() => {
        let W = A(...Z);
        B.set(I, {
          value: W,
          timestamp: Date.now(),
          refreshing: !1
        })
      }).catch((W) => {
        AA(W instanceof Error ? W : Error(String(W))), B.delete(I)
      }), Y.value;
      return B.get(I).value
    };
  return G.cache = {
    clear: () => B.clear()
  }, G
}
// @from(Start 2211033, End 2211761)
function fbA(A, Q = 300000) {
  let B = new Map,
    G = async (...Z) => {
      let I = JSON.stringify(Z),
        Y = B.get(I),
        J = Date.now();
      if (!Y) {
        let W = await A(...Z);
        return B.set(I, {
          value: W,
          timestamp: J,
          refreshing: !1
        }), W
      }
      if (Y && J - Y.timestamp > Q && !Y.refreshing) return Y.refreshing = !0, A(...Z).then((W) => {
        B.set(I, {
          value: W,
          timestamp: Date.now(),
          refreshing: !1
        })
      }).catch((W) => {
        AA(W instanceof Error ? W : Error(String(W))), B.delete(I)
      }), Y.value;
      return B.get(I).value
    };
  return G.cache = {
    clear: () => B.clear()
  }, G
}
// @from(Start 2211766, End 2211791)
hbA = L(() => {
  g1()
})
// @from(Start 2211794, End 2214059)
function PX4() {
  let A = new Map;
  for (let [Q, B] of Object.entries(fI)) {
    for (let [G, Z] of Object.entries(B)) fI[G] = {
      open: `\x1B[${Z[0]}m`,
      close: `\x1B[${Z[1]}m`
    }, B[G] = fI[G], A.set(Z[0], Z[1]);
    Object.defineProperty(fI, Q, {
      value: B,
      enumerable: !1
    })
  }
  return Object.defineProperty(fI, "codes", {
    value: A,
    enumerable: !1
  }), fI.color.close = "\x1B[39m", fI.bgColor.close = "\x1B[49m", fI.color.ansi = Io0(), fI.color.ansi256 = Yo0(), fI.color.ansi16m = Jo0(), fI.bgColor.ansi = Io0(10), fI.bgColor.ansi256 = Yo0(10), fI.bgColor.ansi16m = Jo0(10), Object.defineProperties(fI, {
    rgbToAnsi256: {
      value(Q, B, G) {
        if (Q === B && B === G) {
          if (Q < 8) return 16;
          if (Q > 248) return 231;
          return Math.round((Q - 8) / 247 * 24) + 232
        }
        return 16 + 36 * Math.round(Q / 255 * 5) + 6 * Math.round(B / 255 * 5) + Math.round(G / 255 * 5)
      },
      enumerable: !1
    },
    hexToRgb: {
      value(Q) {
        let B = /[a-f\d]{6}|[a-f\d]{3}/i.exec(Q.toString(16));
        if (!B) return [0, 0, 0];
        let [G] = B;
        if (G.length === 3) G = [...G].map((I) => I + I).join("");
        let Z = Number.parseInt(G, 16);
        return [Z >> 16 & 255, Z >> 8 & 255, Z & 255]
      },
      enumerable: !1
    },
    hexToAnsi256: {
      value: (Q) => fI.rgbToAnsi256(...fI.hexToRgb(Q)),
      enumerable: !1
    },
    ansi256ToAnsi: {
      value(Q) {
        if (Q < 8) return 30 + Q;
        if (Q < 16) return 90 + (Q - 8);
        let B, G, Z;
        if (Q >= 232) B = ((Q - 232) * 10 + 8) / 255, G = B, Z = B;
        else {
          Q -= 16;
          let J = Q % 36;
          B = Math.floor(Q / 36) / 5, G = Math.floor(J / 6) / 5, Z = J % 6 / 5
        }
        let I = Math.max(B, G, Z) * 2;
        if (I === 0) return 30;
        let Y = 30 + (Math.round(Z) << 2 | Math.round(G) << 1 | Math.round(B));
        if (I === 2) Y += 60;
        return Y
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: (Q, B, G) => fI.ansi256ToAnsi(fI.rgbToAnsi256(Q, B, G)),
      enumerable: !1
    },
    hexToAnsi: {
      value: (Q) => fI.ansi256ToAnsi(fI.hexToAnsi256(Q)),
      enumerable: !1
    }
  }), fI
}
// @from(Start 2214064, End 2214102)
Io0 = (A = 0) => (Q) => `\x1B[${Q+A}m`
// @from(Start 2214106, End 2214152)
Yo0 = (A = 0) => (Q) => `\x1B[${38+A};5;${Q}m`
// @from(Start 2214156, End 2214218)
Jo0 = (A = 0) => (Q, B, G) => `\x1B[${38+A};2;${Q};${B};${G}m`
// @from(Start 2214222, End 2214224)
fI
// @from(Start 2214226, End 2214229)
pK7
// @from(Start 2214231, End 2214234)
RX4
// @from(Start 2214236, End 2214239)
TX4
// @from(Start 2214241, End 2214244)
lK7
// @from(Start 2214246, End 2214249)
jX4
// @from(Start 2214251, End 2214253)
gR
// @from(Start 2214259, End 2215668)
Wo0 = L(() => {
  fI = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      gray: [90, 39],
      grey: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  }, pK7 = Object.keys(fI.modifier), RX4 = Object.keys(fI.color), TX4 = Object.keys(fI.bgColor), lK7 = [...RX4, ...TX4];
  jX4 = PX4(), gR = jX4
})
// @from(Start 2215758, End 2215987)
function eN(A, Q = globalThis.Deno ? globalThis.Deno.args : cz1.argv) {
  let B = A.startsWith("-") ? "" : A.length === 1 ? "-" : "--",
    G = Q.indexOf(B + A),
    Z = Q.indexOf("--");
  return G !== -1 && (Z === -1 || G < Z)
}
// @from(Start 2215989, End 2216225)
function _X4() {
  if ("FORCE_COLOR" in qJ) {
    if (qJ.FORCE_COLOR === "true") return 1;
    if (qJ.FORCE_COLOR === "false") return 0;
    return qJ.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(qJ.FORCE_COLOR, 10), 3)
  }
}
// @from(Start 2216227, End 2216358)
function kX4(A) {
  if (A === 0) return !1;
  return {
    level: A,
    hasBasic: !0,
    has256: A >= 2,
    has16m: A >= 3
  }
}
// @from(Start 2216360, End 2217872)
function yX4(A, {
  streamIsTTY: Q,
  sniffFlags: B = !0
} = {}) {
  let G = _X4();
  if (G !== void 0) gbA = G;
  let Z = B ? gbA : G;
  if (Z === 0) return 0;
  if (B) {
    if (eN("color=16m") || eN("color=full") || eN("color=truecolor")) return 3;
    if (eN("color=256")) return 2
  }
  if ("TF_BUILD" in qJ && "AGENT_NAME" in qJ) return 1;
  if (A && !Q && Z === void 0) return 0;
  let I = Z || 0;
  if (qJ.TERM === "dumb") return I;
  if (cz1.platform === "win32") {
    let Y = SX4.release().split(".");
    if (Number(Y[0]) >= 10 && Number(Y[2]) >= 10586) return Number(Y[2]) >= 14931 ? 3 : 2;
    return 1
  }
  if ("CI" in qJ) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((Y) => (Y in qJ))) return 3;
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((Y) => (Y in qJ)) || qJ.CI_NAME === "codeship") return 1;
    return I
  }
  if ("TEAMCITY_VERSION" in qJ) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(qJ.TEAMCITY_VERSION) ? 1 : 0;
  if (qJ.COLORTERM === "truecolor") return 3;
  if (qJ.TERM === "xterm-kitty") return 3;
  if ("TERM_PROGRAM" in qJ) {
    let Y = Number.parseInt((qJ.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (qJ.TERM_PROGRAM) {
      case "iTerm.app":
        return Y >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2
    }
  }
  if (/-256(color)?$/i.test(qJ.TERM)) return 2;
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(qJ.TERM)) return 1;
  if ("COLORTERM" in qJ) return 1;
  return I
}
// @from(Start 2217874, End 2217982)
function Vo0(A, Q = {}) {
  let B = yX4(A, {
    streamIsTTY: A && A.isTTY,
    ...Q
  });
  return kX4(B)
}
// @from(Start 2217987, End 2217989)
qJ
// @from(Start 2217991, End 2217994)
gbA
// @from(Start 2217996, End 2217999)
xX4
// @from(Start 2218001, End 2218004)
Fo0
// @from(Start 2218010, End 2218370)
Ko0 = L(() => {
  ({
    env: qJ
  } = cz1);
  if (eN("no-color") || eN("no-colors") || eN("color=false") || eN("color=never")) gbA = 0;
  else if (eN("color") || eN("colors") || eN("color=true") || eN("color=always")) gbA = 1;
  xX4 = {
    stdout: Vo0({
      isTTY: Xo0.isatty(1)
    }),
    stderr: Vo0({
      isTTY: Xo0.isatty(2)
    })
  }, Fo0 = xX4
})
// @from(Start 2218373, End 2218602)
function Do0(A, Q, B) {
  let G = A.indexOf(Q);
  if (G === -1) return A;
  let Z = Q.length,
    I = 0,
    Y = "";
  do Y += A.slice(I, G) + Q + B, I = G + Z, G = A.indexOf(Q, I); while (G !== -1);
  return Y += A.slice(I), Y
}
// @from(Start 2218604, End 2218842)
function Ho0(A, Q, B, G) {
  let Z = 0,
    I = "";
  do {
    let Y = A[G - 1] === "\r";
    I += A.slice(Z, Y ? G - 1 : G) + Q + (Y ? `\r
` : `
`) + B, Z = G + 1, G = A.indexOf(`
`, Z)
  } while (G !== -1);
  return I += A.slice(Z), I
}
// @from(Start 2218844, End 2218879)
function jDA(A) {
  return bX4(A)
}
// @from(Start 2218884, End 2218887)
Co0
// @from(Start 2218889, End 2218892)
Eo0
// @from(Start 2218894, End 2218897)
pz1
// @from(Start 2218899, End 2218902)
S4A
// @from(Start 2218904, End 2218907)
PDA
// @from(Start 2218909, End 2218912)
zo0
// @from(Start 2218914, End 2218917)
_4A
// @from(Start 2218919, End 2219174)
vX4 = (A, Q = {}) => {
    if (Q.level && !(Number.isInteger(Q.level) && Q.level >= 0 && Q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
    let B = Co0 ? Co0.level : 0;
    A.level = Q.level === void 0 ? B : Q.level
  }
// @from(Start 2219178, End 2219296)
bX4 = (A) => {
    let Q = (...B) => B.join(" ");
    return vX4(Q, A), Object.setPrototypeOf(Q, jDA.prototype), Q
  }
// @from(Start 2219300, End 2219624)
lz1 = (A, Q, B, ...G) => {
    if (A === "rgb") {
      if (Q === "ansi16m") return gR[B].ansi16m(...G);
      if (Q === "ansi256") return gR[B].ansi256(gR.rgbToAnsi256(...G));
      return gR[B].ansi(gR.rgbToAnsi(...G))
    }
    if (A === "hex") return lz1("rgb", Q, B, ...gR.hexToRgb(...G));
    return gR[B][A](...G)
  }
// @from(Start 2219628, End 2219631)
fX4
// @from(Start 2219633, End 2219636)
hX4
// @from(Start 2219638, End 2219863)
iz1 = (A, Q, B) => {
    let G, Z;
    if (B === void 0) G = A, Z = Q;
    else G = B.openAll + A, Z = Q + B.closeAll;
    return {
      open: A,
      close: Q,
      openAll: G,
      closeAll: Z,
      parent: B
    }
  }
// @from(Start 2219867, End 2220043)
ubA = (A, Q, B) => {
    let G = (...Z) => gX4(G, Z.length === 1 ? "" + Z[0] : Z.join(" "));
    return Object.setPrototypeOf(G, hX4), G[pz1] = A, G[S4A] = Q, G[PDA] = B, G
  }
// @from(Start 2220047, End 2220415)
gX4 = (A, Q) => {
    if (A.level <= 0 || !Q) return A[PDA] ? "" : Q;
    let B = A[S4A];
    if (B === void 0) return Q;
    let {
      openAll: G,
      closeAll: Z
    } = B;
    if (Q.includes("\x1B"))
      while (B !== void 0) Q = Do0(Q, B.close, B.open), B = B.parent;
    let I = Q.indexOf(`
`);
    if (I !== -1) Q = Ho0(Q, Z, G, I);
    return G + Q + Z
  }
// @from(Start 2220419, End 2220422)
uX4
// @from(Start 2220424, End 2220427)
QD7
// @from(Start 2220429, End 2220431)
tA
// @from(Start 2220437, End 2222078)
F9 = L(() => {
  Wo0();
  Ko0();
  ({
    stdout: Co0,
    stderr: Eo0
  } = Fo0), pz1 = Symbol("GENERATOR"), S4A = Symbol("STYLER"), PDA = Symbol("IS_EMPTY"), zo0 = ["ansi", "ansi", "ansi256", "ansi16m"], _4A = Object.create(null);
  Object.setPrototypeOf(jDA.prototype, Function.prototype);
  for (let [A, Q] of Object.entries(gR)) _4A[A] = {
    get() {
      let B = ubA(this, iz1(Q.open, Q.close, this[S4A]), this[PDA]);
      return Object.defineProperty(this, A, {
        value: B
      }), B
    }
  };
  _4A.visible = {
    get() {
      let A = ubA(this, this[S4A], !0);
      return Object.defineProperty(this, "visible", {
        value: A
      }), A
    }
  };
  fX4 = ["rgb", "hex", "ansi256"];
  for (let A of fX4) {
    _4A[A] = {
      get() {
        let {
          level: B
        } = this;
        return function(...G) {
          let Z = iz1(lz1(A, zo0[B], "color", ...G), gR.color.close, this[S4A]);
          return ubA(this, Z, this[PDA])
        }
      }
    };
    let Q = "bg" + A[0].toUpperCase() + A.slice(1);
    _4A[Q] = {
      get() {
        let {
          level: B
        } = this;
        return function(...G) {
          let Z = iz1(lz1(A, zo0[B], "bgColor", ...G), gR.bgColor.close, this[S4A]);
          return ubA(this, Z, this[PDA])
        }
      }
    }
  }
  hX4 = Object.defineProperties(() => {}, {
    ..._4A,
    level: {
      enumerable: !0,
      get() {
        return this[pz1].level
      },
      set(A) {
        this[pz1].level = A
      }
    }
  });
  Object.defineProperties(jDA.prototype, _4A);
  uX4 = jDA(), QD7 = jDA({
    level: Eo0 ? Eo0.level : 0
  }), tA = uX4
})
// @from(Start 2222081, End 2222689)
function Uo0(A, Q) {
  return {
    name: `${A.name}-with-${Q.name}-fallback`,
    read() {
      let B = A.read();
      if (B !== null && B !== void 0) return B;
      return Q.read() || {}
    },
    update(B) {
      let G = A.read(),
        Z = A.update(B);
      if (Z.success) {
        if (G === null) Q.delete();
        return Z
      }
      let I = Q.update(B);
      if (I.success) return {
        success: !0,
        warning: I.warning
      };
      return {
        success: !1
      }
    },
    delete() {
      let B = A.delete(),
        G = Q.delete();
      return B || G
    }
  }
}
// @from(Start 2222777, End 2222978)
function em(A = "") {
  let Q = MQ(),
    G = !process.env.CLAUDE_CONFIG_DIR ? "" : `-${mX4("sha256").update(Q).digest("hex").substring(0,8)}`;
  return `Claude Code${e9().OAUTH_FILE_SUFFIX}${A}${G}`
}
// @from(Start 2222980, End 2223098)
function SDA() {
  try {
    return process.env.USER || dX4().username
  } catch {
    return "claude-code-user"
  }
}
// @from(Start 2223100, End 2223338)
function wo0() {
  if (process.platform !== "darwin") return !1;
  try {
    return I9A("security", ["show-keychain-info"], {
      reject: !1,
      stdio: ["ignore", "pipe", "pipe"]
    }).exitCode === 36
  } catch {
    return !1
  }
}
// @from(Start 2223343, End 2223346)
$o0
// @from(Start 2223352, End 2224497)
_DA = L(() => {
  hyA();
  hQ();
  NX();
  sFA();
  $o0 = {
    name: "keychain",
    read() {
      try {
        let A = em("-credentials"),
          Q = SDA(),
          B = tG(`security find-generic-password -a "${Q}" -w -s "${A}"`);
        if (B) return JSON.parse(B)
      } catch (A) {
        return null
      }
      return null
    },
    update(A) {
      try {
        let Q = em("-credentials"),
          B = SDA(),
          G = JSON.stringify(A),
          Z = Buffer.from(G, "utf-8").toString("hex"),
          I = `add-generic-password -U -a "${B}" -s "${Q}" -X "${Z}"
`;
        if (I9A("security", ["-i"], {
            input: I,
            stdio: ["pipe", "pipe", "pipe"],
            reject: !1
          }).exitCode !== 0) return {
          success: !1
        };
        return {
          success: !0
        }
      } catch (Q) {
        return {
          success: !1
        }
      }
    },
    delete() {
      try {
        let A = em("-credentials"),
          Q = SDA();
        return tG(`security delete-generic-password -a "${Q}" -s "${A}"`), !0
      } catch (A) {
        return !1
      }
    }
  }
})
// @from(Start 2224579, End 2224721)
function nz1() {
  let A = MQ(),
    Q = ".credentials.json";
  return {
    storageDir: A,
    storagePath: cX4(A, ".credentials.json")
  }
}
// @from(Start 2224726, End 2224729)
az1
// @from(Start 2224735, End 2225773)
qo0 = L(() => {
  AQ();
  hQ();
  az1 = {
    name: "plaintext",
    read() {
      let {
        storagePath: A
      } = nz1();
      if (RA().existsSync(A)) try {
        let Q = RA().readFileSync(A, {
          encoding: "utf8"
        });
        return JSON.parse(Q)
      } catch (Q) {
        return null
      }
      return null
    },
    update(A) {
      try {
        let {
          storageDir: Q,
          storagePath: B
        } = nz1();
        if (!RA().existsSync(Q)) RA().mkdirSync(Q);
        return RA().writeFileSync(B, JSON.stringify(A), {
          encoding: "utf8",
          flush: !1
        }), pX4(B, 384), {
          success: !0,
          warning: "Warning: Storing credentials in plaintext."
        }
      } catch (Q) {
        return {
          success: !1
        }
      }
    },
    delete() {
      let {
        storagePath: A
      } = nz1();
      if (RA().existsSync(A)) try {
        return RA().unlinkSync(A), !0
      } catch (Q) {
        return !1
      }
      return !0
    }
  }
})
// @from(Start 2225776, End 2225865)
function Fw() {
  if (process.platform === "darwin") return Uo0($o0, az1);
  return az1
}
// @from(Start 2225870, End 2225905)
mbA = L(() => {
  _DA();
  qo0()
})
// @from(Start 2225908, End 2226857)
function sz1() {
  let A = sE0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR;
  if (!Q) return X2A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return g(`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), X2A(null), null;
  try {
    let G = RA(),
      Z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${B}` : `/proc/self/fd/${B}`,
      I = G.readFileSync(Z, {
        encoding: "utf8"
      }).trim();
    if (!I) return g("File descriptor contained empty OAuth token", {
      level: "error"
    }), X2A(null), null;
    return g(`Successfully read OAuth token from file descriptor ${B}`), X2A(I), I
  } catch (G) {
    return g(`Failed to read OAuth token from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), X2A(null), null
  }
}
// @from(Start 2226859, End 2227788)
function rz1() {
  let A = rE0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
  if (!Q) return V2A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return g(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), V2A(null), null;
  try {
    let G = RA(),
      Z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${B}` : `/proc/self/fd/${B}`,
      I = G.readFileSync(Z, {
        encoding: "utf8"
      }).trim();
    if (!I) return g("File descriptor contained empty API key", {
      level: "error"
    }), V2A(null), null;
    return g(`Successfully read API key from file descriptor ${B}`), V2A(I), I
  } catch (G) {
    return g(`Failed to read API key from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), V2A(null), null
  }
}
// @from(Start 2227793, End 2227834)
No0 = L(() => {
  V0();
  AQ();
  _0()
})
// @from(Start 2227836, End 2228206)
async function dbA() {
  let Q = N1().oauthAccount?.accountUuid,
    B = Kw();
  if (!Q || !B) return;
  let G = `${e9().BASE_API_URL}/api/claude_cli_profile`;
  try {
    return (await YQ.get(G, {
      headers: {
        "x-api-key": B,
        "anthropic-beta": $4A
      },
      params: {
        account_uuid: Q
      }
    })).data
  } catch (Z) {
    AA(Z)
  }
}
// @from(Start 2228207, End 2228471)
async function k4A(A) {
  let Q = `${e9().BASE_API_URL}/api/oauth/profile`;
  try {
    return (await YQ.get(Q, {
      headers: {
        Authorization: `Bearer ${A}`,
        "Content-Type": "application/json"
      }
    })).data
  } catch (B) {
    AA(B)
  }
}
// @from(Start 2228476, End 2228533)
kDA = L(() => {
  O3();
  NX();
  gB();
  jQ();
  g1()
})
// @from(Start 2228536, End 2228589)
function wv(A) {
  return Boolean(A?.includes(wbA))
}
// @from(Start 2228591, End 2228655)
function cbA(A) {
  return A?.split(" ").filter(Boolean) ?? []
}
// @from(Start 2228657, End 2229406)
function oz1({
  codeChallenge: A,
  state: Q,
  port: B,
  isManual: G,
  loginWithClaudeAi: Z,
  inferenceOnly: I,
  orgUUID: Y
}) {
  let J = Z ? e9().CLAUDE_AI_AUTHORIZE_URL : e9().CONSOLE_AUTHORIZE_URL,
    W = new URL(J);
  W.searchParams.append("code", "true"), W.searchParams.append("client_id", e9().CLIENT_ID), W.searchParams.append("response_type", "code"), W.searchParams.append("redirect_uri", G ? e9().MANUAL_REDIRECT_URL : `http://localhost:${B}/callback`);
  let X = I ? [wbA] : Dr0;
  if (W.searchParams.append("scope", X.join(" ")), W.searchParams.append("code_challenge", A), W.searchParams.append("code_challenge_method", "S256"), W.searchParams.append("state", Q), Y) W.searchParams.append("orgUUID", Y);
  return W.toString()
}
// @from(Start 2229407, End 2230048)
async function Lo0(A, Q, B, G, Z = !1, I) {
  let Y = {
    grant_type: "authorization_code",
    code: A,
    redirect_uri: Z ? e9().MANUAL_REDIRECT_URL : `http://localhost:${G}/callback`,
    client_id: e9().CLIENT_ID,
    code_verifier: B,
    state: Q
  };
  if (I !== void 0) Y.expires_in = I;
  let J = await YQ.post(e9().TOKEN_URL, Y, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (J.status !== 200) throw Error(J.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${J.status}): ${J.statusText}`);
  return GA("tengu_oauth_token_exchange_success", {}), J.data
}
// @from(Start 2230049, End 2231248)
async function Mo0(A) {
  let Q = {
    grant_type: "refresh_token",
    refresh_token: A,
    client_id: e9().CLIENT_ID,
    scope: Ez1.join(" ")
  };
  try {
    let B = await YQ.post(e9().TOKEN_URL, Q, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (B.status !== 200) throw Error(`Token refresh failed: ${B.statusText}`);
    let G = B.data,
      {
        access_token: Z,
        refresh_token: I = A,
        expires_in: Y
      } = G,
      J = Date.now() + Y * 1000,
      W = cbA(G.scope);
    GA("tengu_oauth_token_refresh_success", {});
    let X = await tz1(Z),
      V = N1();
    if (V.oauthAccount) {
      let F = !1;
      if (X.displayName !== void 0) V.oauthAccount.displayName = X.displayName, F = !0;
      if (typeof X.hasExtraUsageEnabled === "boolean") V.oauthAccount.hasExtraUsageEnabled = X.hasExtraUsageEnabled, F = !0;
      if (F) c0(V)
    }
    return {
      accessToken: Z,
      refreshToken: I,
      expiresAt: J,
      scopes: W,
      subscriptionType: X.subscriptionType,
      rateLimitTier: X.rateLimitTier
    }
  } catch (B) {
    throw GA("tengu_oauth_token_refresh_failure", {
      error: B.message
    }), B
  }
}
// @from(Start 2231249, End 2231818)
async function Oo0(A) {
  let Q = await YQ.get(e9().ROLES_URL, {
    headers: {
      Authorization: `Bearer ${A}`
    }
  });
  if (Q.status !== 200) throw Error(`Failed to fetch user roles: ${Q.statusText}`);
  let B = Q.data,
    G = N1();
  if (!G.oauthAccount) throw Error("OAuth account information not found in config");
  G.oauthAccount.organizationRole = B.organization_role, G.oauthAccount.workspaceRole = B.workspace_role, G.oauthAccount.organizationName = B.organization_name, c0(G), GA("tengu_oauth_roles_stored", {
    org_role: B.organization_role
  })
}
// @from(Start 2231819, End 2232291)
async function Ro0(A) {
  try {
    let Q = await YQ.post(e9().API_KEY_URL, null, {
        headers: {
          Authorization: `Bearer ${A}`
        }
      }),
      B = Q.data?.raw_key;
    if (B) return Po0(B), GA("tengu_oauth_api_key", {
      status: "success",
      statusCode: Q.status
    }), B;
    return null
  } catch (Q) {
    throw GA("tengu_oauth_api_key", {
      status: "failure",
      error: Q instanceof Error ? Q.message : String(Q)
    }), Q
  }
}
// @from(Start 2232293, End 2232387)
function Ad(A) {
  if (A === null) return !1;
  let Q = 300000;
  return Date.now() + Q >= A
}
// @from(Start 2232388, End 2233089)
async function tz1(A) {
  let Q = await k4A(A),
    B = Q?.organization?.organization_type,
    G = null;
  switch (B) {
    case "claude_max":
      G = "max";
      break;
    case "claude_pro":
      G = "pro";
      break;
    case "claude_enterprise":
      G = "enterprise";
      break;
    case "claude_team":
      G = "team";
      break;
    default:
      G = null;
      break
  }
  let Z = {
    subscriptionType: G,
    rateLimitTier: Q?.organization?.rate_limit_tier ?? null,
    hasExtraUsageEnabled: Q?.organization?.has_extra_usage_enabled ?? null
  };
  if (Q?.account?.display_name) Z.displayName = Q.account.display_name;
  return GA("tengu_oauth_profile_fetch_success", {}), Z
}
// @from(Start 2233090, End 2233321)
async function HS() {
  let Q = N1().oauthAccount?.organizationUuid;
  if (Q) return Q;
  let B = M6()?.accessToken;
  if (B === void 0) return null;
  let Z = (await k4A(B))?.organization?.uuid;
  if (!Z) return null;
  return Z
}
// @from(Start 2233322, End 2233763)
async function To0() {
  if (N1().oauthAccount || !BB()) return !1;
  let Q = M6();
  if (Q?.accessToken) {
    let B = await k4A(Q.accessToken);
    if (B) return ez1({
      accountUuid: B.account.uuid,
      emailAddress: B.account.email,
      organizationUuid: B.organization.uuid,
      displayName: B.account.display_name || void 0,
      hasExtraUsageEnabled: B.organization.has_extra_usage_enabled ?? !1
    }), !0
  }
  return !1
}
// @from(Start 2233765, End 2234073)
function ez1({
  accountUuid: A,
  emailAddress: Q,
  organizationUuid: B,
  displayName: G,
  hasExtraUsageEnabled: Z
}) {
  let I = {
    accountUuid: A,
    emailAddress: Q,
    organizationUuid: B,
    hasExtraUsageEnabled: Z
  };
  if (G) I.displayName = G;
  let Y = N1();
  Y.oauthAccount = I, c0(Y)
}
// @from(Start 2234078, End 2234143)
AL = L(() => {
  O3();
  NX();
  q0();
  jQ();
  gB();
  kDA()
})
// @from(Start 2234146, End 2234178)
function So0() {
  return null
}
// @from(Start 2234180, End 2234364)
function _o0(A) {
  let Q = So0();
  if (!Q) return A;
  let B = new globalThis.Headers(A);
  return Object.entries(Q).forEach(([G, Z]) => {
    if (Z !== void 0) B.set(G, Z)
  }), B
}
// @from(Start 2234366, End 2234403)
function y4A() {
  return pbA && !1
}
// @from(Start 2234405, End 2234437)
function ko0() {
  return null
}
// @from(Start 2234439, End 2234492)
function yo0() {
  return pbA && jo0 !== null && !1
}
// @from(Start 2234497, End 2234500)
iX4
// @from(Start 2234502, End 2234510)
pbA = !1
// @from(Start 2234514, End 2234524)
jo0 = null
// @from(Start 2234528, End 2234539)
nX4 = "max"
// @from(Start 2234545, End 2234574)
lbA = L(() => {
  iX4 = {}
})
// @from(Start 2234580, End 2234608)
xo0 = "claude-code-20250219"
// @from(Start 2234612, End 2234651)
vo0 = "interleaved-thinking-2025-05-14"
// @from(Start 2234655, End 2234684)
ibA = "context-1m-2025-08-07"
// @from(Start 2234688, End 2234725)
nbA = "context-management-2025-06-27"
// @from(Start 2234729, End 2234766)
bo0 = "structured-outputs-2025-09-17"
// @from(Start 2234770, End 2234799)
AU1 = "web-search-2025-03-05"
// @from(Start 2234803, End 2234835)
abA = "tool-examples-2025-10-29"
// @from(Start 2234839, End 2234842)
QU1
// @from(Start 2234848, End 2234944)
sbA = L(() => {
  QU1 = new Set(["interleaved-thinking-2025-05-14", "context-1m-2025-08-07"])
})
// @from(Start 2234947, End 2235145)
function aX4(A) {
  let Q = V6();
  if (Q === "foundry") return !0;
  if (Q === "firstParty") return !A.includes("claude-3-");
  return A.includes("claude-opus-4") || A.includes("claude-sonnet-4")
}
// @from(Start 2235147, End 2235295)
function sX4(A) {
  let Q = A.toLowerCase();
  return Q.includes("claude-opus-4") || Q.includes("claude-sonnet-4") || Q.includes("claude-haiku-4")
}
// @from(Start 2235297, End 2235352)
function BU1(A) {
  return A.includes("-structured-")
}
// @from(Start 2235354, End 2235486)
function rX4() {
  return (V6() === "firstParty" || V6() === "foundry") && !Y0(process.env.CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS)
}
// @from(Start 2235488, End 2235938)
function ho0(A, Q) {
  let B = Dw(A);
  if (!Q || Q.length === 0) return B;
  if (BB()) return console.warn("Warning: Custom betas are only available for API key users. Ignoring provided betas."), B;
  let G = [];
  for (let Z of Q)
    if (fo0.includes(Z)) G.push(Z);
    else console.warn(`Warning: Beta header '${Z}' is not allowed. Only the following betas are supported: ${fo0.join(", ")}`);
  return [...B, ...G.filter((Z) => !B.includes(Z))]
}
// @from(Start 2235940, End 2236024)
function x4A() {
  GU1.cache?.clear?.(), Dw.cache?.clear?.(), ZU1.cache?.clear?.()
}
// @from(Start 2236029, End 2236032)
fo0
// @from(Start 2236034, End 2236037)
GU1
// @from(Start 2236039, End 2236041)
Dw
// @from(Start 2236043, End 2236046)
ZU1
// @from(Start 2236052, End 2237229)
CS = L(() => {
  l2();
  sbA();
  NX();
  gB();
  hQ();
  lK();
  u2();
  u2();
  fo0 = [ibA];
  GU1 = s1((A) => {
    let Q = [],
      B = A.includes("haiku"),
      G = V6(),
      Z = rX4();
    if (!B) Q.push(xo0);
    if (BB()) Q.push($4A);
    if (A.includes("[1m]")) Q.push(ibA);
    else if (A.includes("claude-sonnet-4-5")) {
      if (BZ("sonnet_45_1m_header", "enabled", !1)) Q.push(ibA)
    }
    if (!Y0(process.env.DISABLE_INTERLEAVED_THINKING) && aX4(A)) Q.push(vo0);
    let I = Z && BZ("preserve_thinking", "enabled", !1);
    if (Y0(process.env.USE_API_CONTEXT_MANAGEMENT) && !1 || I) Q.push(nbA);
    let Y = o2("tengu_tool_pear");
    if (BU1(A) && Y) Q.push(bo0);
    if (Z && BZ("tool_use_examples", "enabled", !1)) Q.push(abA);
    if (G === "vertex" && sX4(A)) Q.push(AU1);
    if (G === "foundry") Q.push(AU1);
    if (process.env.ANTHROPIC_BETAS && !B) Q.push(...process.env.ANTHROPIC_BETAS.split(",").map((J) => J.trim()).filter(Boolean));
    return Q
  }), Dw = s1((A) => {
    let Q = GU1(A);
    if (V6() === "bedrock") return Q.filter((B) => !QU1.has(B));
    return Q
  }), ZU1 = s1((A) => {
    return GU1(A).filter((B) => QU1.has(B))
  })
})
// @from(Start 2237235, End 2240018)
IU1 = z((nD7, no0) => {
  var {
    defineProperty: rbA,
    getOwnPropertyDescriptor: oX4,
    getOwnPropertyNames: tX4
  } = Object, eX4 = Object.prototype.hasOwnProperty, obA = (A, Q) => rbA(A, "name", {
    value: Q,
    configurable: !0
  }), AV4 = (A, Q) => {
    for (var B in Q) rbA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, QV4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of tX4(Q))
        if (!eX4.call(A, Z) && Z !== B) rbA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = oX4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, BV4 = (A) => QV4(rbA({}, "__esModule", {
    value: !0
  }), A), go0 = {};
  AV4(go0, {
    AlgorithmId: () => co0,
    EndpointURLScheme: () => do0,
    FieldPosition: () => po0,
    HttpApiKeyAuthLocation: () => mo0,
    HttpAuthLocation: () => uo0,
    IniSectionType: () => lo0,
    RequestHandlerProtocol: () => io0,
    SMITHY_CONTEXT_KEY: () => JV4,
    getDefaultClientConfiguration: () => IV4,
    resolveDefaultRuntimeConfig: () => YV4
  });
  no0.exports = BV4(go0);
  var uo0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(uo0 || {}),
    mo0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(mo0 || {}),
    do0 = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(do0 || {}),
    co0 = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(co0 || {}),
    GV4 = obA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    ZV4 = obA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    IV4 = obA((A) => {
      return GV4(A)
    }, "getDefaultClientConfiguration"),
    YV4 = obA((A) => {
      return ZV4(A)
    }, "resolveDefaultRuntimeConfig"),
    po0 = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(po0 || {}),
    JV4 = "__smithy_context",
    lo0 = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(lo0 || {}),
    io0 = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(io0 || {})
})
// @from(Start 2240024, End 2244530)
nC = z((aD7, to0) => {
  var {
    defineProperty: tbA,
    getOwnPropertyDescriptor: WV4,
    getOwnPropertyNames: XV4
  } = Object, VV4 = Object.prototype.hasOwnProperty, Qd = (A, Q) => tbA(A, "name", {
    value: Q,
    configurable: !0
  }), FV4 = (A, Q) => {
    for (var B in Q) tbA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, KV4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of XV4(Q))
        if (!VV4.call(A, Z) && Z !== B) tbA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = WV4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, DV4 = (A) => KV4(tbA({}, "__esModule", {
    value: !0
  }), A), ao0 = {};
  FV4(ao0, {
    Field: () => EV4,
    Fields: () => zV4,
    HttpRequest: () => UV4,
    HttpResponse: () => $V4,
    IHttpRequest: () => so0.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => HV4,
    isValidHostname: () => oo0,
    resolveHttpHandlerRuntimeConfig: () => CV4
  });
  to0.exports = DV4(ao0);
  var HV4 = Qd((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    CV4 = Qd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    so0 = IU1(),
    EV4 = class {
      static {
        Qd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = so0.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    zV4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Qd(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    UV4 = class A {
      static {
        Qd(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = ro0(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function ro0(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Qd(ro0, "cloneQuery");
  var $V4 = class {
    static {
      Qd(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function oo0(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Qd(oo0, "isValidHostname")
})
// @from(Start 2244536, End 2246399)
yDA = z((tD7, Gt0) => {
  var {
    defineProperty: AfA,
    getOwnPropertyDescriptor: wV4,
    getOwnPropertyNames: qV4
  } = Object, NV4 = Object.prototype.hasOwnProperty, ebA = (A, Q) => AfA(A, "name", {
    value: Q,
    configurable: !0
  }), LV4 = (A, Q) => {
    for (var B in Q) AfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, MV4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qV4(Q))
        if (!NV4.call(A, Z) && Z !== B) AfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wV4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, OV4 = (A) => MV4(AfA({}, "__esModule", {
    value: !0
  }), A), eo0 = {};
  LV4(eo0, {
    getHostHeaderPlugin: () => TV4,
    hostHeaderMiddleware: () => Qt0,
    hostHeaderMiddlewareOptions: () => Bt0,
    resolveHostHeaderConfig: () => At0
  });
  Gt0.exports = OV4(eo0);
  var RV4 = nC();

  function At0(A) {
    return A
  }
  ebA(At0, "resolveHostHeaderConfig");
  var Qt0 = ebA((A) => (Q) => async (B) => {
      if (!RV4.HttpRequest.isInstance(B.request)) return Q(B);
      let {
        request: G
      } = B, {
        handlerProtocol: Z = ""
      } = A.requestHandler.metadata || {};
      if (Z.indexOf("h2") >= 0 && !G.headers[":authority"]) delete G.headers.host, G.headers[":authority"] = G.hostname + (G.port ? ":" + G.port : "");
      else if (!G.headers.host) {
        let I = G.hostname;
        if (G.port != null) I += `:${G.port}`;
        G.headers.host = I
      }
      return Q(B)
    }, "hostHeaderMiddleware"),
    Bt0 = {
      name: "hostHeaderMiddleware",
      step: "build",
      priority: "low",
      tags: ["HOST"],
      override: !0
    },
    TV4 = ebA((A) => ({
      applyToStack: ebA((Q) => {
        Q.add(Qt0(A), Bt0)
      }, "applyToStack")
    }), "getHostHeaderPlugin")
})
// @from(Start 2246405, End 2248705)
xDA = z((eD7, Jt0) => {
  var {
    defineProperty: QfA,
    getOwnPropertyDescriptor: PV4,
    getOwnPropertyNames: jV4
  } = Object, SV4 = Object.prototype.hasOwnProperty, YU1 = (A, Q) => QfA(A, "name", {
    value: Q,
    configurable: !0
  }), _V4 = (A, Q) => {
    for (var B in Q) QfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, kV4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jV4(Q))
        if (!SV4.call(A, Z) && Z !== B) QfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = PV4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yV4 = (A) => kV4(QfA({}, "__esModule", {
    value: !0
  }), A), Zt0 = {};
  _V4(Zt0, {
    getLoggerPlugin: () => xV4,
    loggerMiddleware: () => It0,
    loggerMiddlewareOptions: () => Yt0
  });
  Jt0.exports = yV4(Zt0);
  var It0 = YU1(() => (A, Q) => async (B) => {
      try {
        let G = await A(B),
          {
            clientName: Z,
            commandName: I,
            logger: Y,
            dynamoDbDocumentClientOptions: J = {}
          } = Q,
          {
            overrideInputFilterSensitiveLog: W,
            overrideOutputFilterSensitiveLog: X
          } = J,
          V = W ?? Q.inputFilterSensitiveLog,
          F = X ?? Q.outputFilterSensitiveLog,
          {
            $metadata: K,
            ...D
          } = G.output;
        return Y?.info?.({
          clientName: Z,
          commandName: I,
          input: V(B.input),
          output: F(D),
          metadata: K
        }), G
      } catch (G) {
        let {
          clientName: Z,
          commandName: I,
          logger: Y,
          dynamoDbDocumentClientOptions: J = {}
        } = Q, {
          overrideInputFilterSensitiveLog: W
        } = J, X = W ?? Q.inputFilterSensitiveLog;
        throw Y?.error?.({
          clientName: Z,
          commandName: I,
          input: X(B.input),
          error: G,
          metadata: G.$metadata
        }), G
      }
    }, "loggerMiddleware"),
    Yt0 = {
      name: "loggerMiddleware",
      tags: ["LOGGER"],
      step: "initialize",
      override: !0
    },
    xV4 = YU1((A) => ({
      applyToStack: YU1((Q) => {
        Q.add(It0(), Yt0)
      }, "applyToStack")
    }), "getLoggerPlugin")
})
// @from(Start 2248711, End 2250643)
vDA = z((AH7, Ft0) => {
  var {
    defineProperty: GfA,
    getOwnPropertyDescriptor: vV4,
    getOwnPropertyNames: bV4
  } = Object, fV4 = Object.prototype.hasOwnProperty, BfA = (A, Q) => GfA(A, "name", {
    value: Q,
    configurable: !0
  }), hV4 = (A, Q) => {
    for (var B in Q) GfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, gV4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of bV4(Q))
        if (!fV4.call(A, Z) && Z !== B) GfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = vV4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, uV4 = (A) => gV4(GfA({}, "__esModule", {
    value: !0
  }), A), Wt0 = {};
  hV4(Wt0, {
    addRecursionDetectionMiddlewareOptions: () => Vt0,
    getRecursionDetectionPlugin: () => pV4,
    recursionDetectionMiddleware: () => Xt0
  });
  Ft0.exports = uV4(Wt0);
  var mV4 = nC(),
    JU1 = "X-Amzn-Trace-Id",
    dV4 = "AWS_LAMBDA_FUNCTION_NAME",
    cV4 = "_X_AMZN_TRACE_ID",
    Xt0 = BfA((A) => (Q) => async (B) => {
      let {
        request: G
      } = B;
      if (!mV4.HttpRequest.isInstance(G) || A.runtime !== "node") return Q(B);
      let Z = Object.keys(G.headers ?? {}).find((W) => W.toLowerCase() === JU1.toLowerCase()) ?? JU1;
      if (G.headers.hasOwnProperty(Z)) return Q(B);
      let I = process.env[dV4],
        Y = process.env[cV4],
        J = BfA((W) => typeof W === "string" && W.length > 0, "nonEmptyString");
      if (J(I) && J(Y)) G.headers[JU1] = Y;
      return Q({
        ...B,
        request: G
      })
    }, "recursionDetectionMiddleware"),
    Vt0 = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: !0,
      priority: "low"
    },
    pV4 = BfA((A) => ({
      applyToStack: BfA((Q) => {
        Q.add(Xt0(A), Vt0)
      }, "applyToStack")
    }), "getRecursionDetectionPlugin")
})
// @from(Start 2250649, End 2253432)
WU1 = z((QH7, wt0) => {
  var {
    defineProperty: ZfA,
    getOwnPropertyDescriptor: lV4,
    getOwnPropertyNames: iV4
  } = Object, nV4 = Object.prototype.hasOwnProperty, IfA = (A, Q) => ZfA(A, "name", {
    value: Q,
    configurable: !0
  }), aV4 = (A, Q) => {
    for (var B in Q) ZfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, sV4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of iV4(Q))
        if (!nV4.call(A, Z) && Z !== B) ZfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = lV4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, rV4 = (A) => sV4(ZfA({}, "__esModule", {
    value: !0
  }), A), Kt0 = {};
  aV4(Kt0, {
    AlgorithmId: () => Et0,
    EndpointURLScheme: () => Ct0,
    FieldPosition: () => zt0,
    HttpApiKeyAuthLocation: () => Ht0,
    HttpAuthLocation: () => Dt0,
    IniSectionType: () => Ut0,
    RequestHandlerProtocol: () => $t0,
    SMITHY_CONTEXT_KEY: () => QF4,
    getDefaultClientConfiguration: () => eV4,
    resolveDefaultRuntimeConfig: () => AF4
  });
  wt0.exports = rV4(Kt0);
  var Dt0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(Dt0 || {}),
    Ht0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(Ht0 || {}),
    Ct0 = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(Ct0 || {}),
    Et0 = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(Et0 || {}),
    oV4 = IfA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    tV4 = IfA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    eV4 = IfA((A) => {
      return oV4(A)
    }, "getDefaultClientConfiguration"),
    AF4 = IfA((A) => {
      return tV4(A)
    }, "resolveDefaultRuntimeConfig"),
    zt0 = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(zt0 || {}),
    QF4 = "__smithy_context",
    Ut0 = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(Ut0 || {}),
    $t0 = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })($t0 || {})
})
// @from(Start 2253438, End 2256221)
St0 = z((BH7, jt0) => {
  var {
    defineProperty: YfA,
    getOwnPropertyDescriptor: BF4,
    getOwnPropertyNames: GF4
  } = Object, ZF4 = Object.prototype.hasOwnProperty, JfA = (A, Q) => YfA(A, "name", {
    value: Q,
    configurable: !0
  }), IF4 = (A, Q) => {
    for (var B in Q) YfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, YF4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of GF4(Q))
        if (!ZF4.call(A, Z) && Z !== B) YfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = BF4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, JF4 = (A) => YF4(YfA({}, "__esModule", {
    value: !0
  }), A), qt0 = {};
  IF4(qt0, {
    AlgorithmId: () => Ot0,
    EndpointURLScheme: () => Mt0,
    FieldPosition: () => Rt0,
    HttpApiKeyAuthLocation: () => Lt0,
    HttpAuthLocation: () => Nt0,
    IniSectionType: () => Tt0,
    RequestHandlerProtocol: () => Pt0,
    SMITHY_CONTEXT_KEY: () => KF4,
    getDefaultClientConfiguration: () => VF4,
    resolveDefaultRuntimeConfig: () => FF4
  });
  jt0.exports = JF4(qt0);
  var Nt0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(Nt0 || {}),
    Lt0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(Lt0 || {}),
    Mt0 = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(Mt0 || {}),
    Ot0 = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(Ot0 || {}),
    WF4 = JfA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    XF4 = JfA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    VF4 = JfA((A) => {
      return WF4(A)
    }, "getDefaultClientConfiguration"),
    FF4 = JfA((A) => {
      return XF4(A)
    }, "resolveDefaultRuntimeConfig"),
    Rt0 = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(Rt0 || {}),
    KF4 = "__smithy_context",
    Tt0 = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(Tt0 || {}),
    Pt0 = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(Pt0 || {})
})
// @from(Start 2256227, End 2257324)
w7 = z((GH7, xt0) => {
  var {
    defineProperty: WfA,
    getOwnPropertyDescriptor: DF4,
    getOwnPropertyNames: HF4
  } = Object, CF4 = Object.prototype.hasOwnProperty, kt0 = (A, Q) => WfA(A, "name", {
    value: Q,
    configurable: !0
  }), EF4 = (A, Q) => {
    for (var B in Q) WfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zF4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of HF4(Q))
        if (!CF4.call(A, Z) && Z !== B) WfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = DF4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, UF4 = (A) => zF4(WfA({}, "__esModule", {
    value: !0
  }), A), yt0 = {};
  EF4(yt0, {
    getSmithyContext: () => $F4,
    normalizeProvider: () => wF4
  });
  xt0.exports = UF4(yt0);
  var _t0 = St0(),
    $F4 = kt0((A) => A[_t0.SMITHY_CONTEXT_KEY] || (A[_t0.SMITHY_CONTEXT_KEY] = {}), "getSmithyContext"),
    wF4 = kt0((A) => {
      if (typeof A === "function") return A;
      let Q = Promise.resolve(A);
      return () => Q
    }, "normalizeProvider")
})
// @from(Start 2257330, End 2260113)
pt0 = z((ZH7, ct0) => {
  var {
    defineProperty: XfA,
    getOwnPropertyDescriptor: qF4,
    getOwnPropertyNames: NF4
  } = Object, LF4 = Object.prototype.hasOwnProperty, VfA = (A, Q) => XfA(A, "name", {
    value: Q,
    configurable: !0
  }), MF4 = (A, Q) => {
    for (var B in Q) XfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, OF4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of NF4(Q))
        if (!LF4.call(A, Z) && Z !== B) XfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = qF4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, RF4 = (A) => OF4(XfA({}, "__esModule", {
    value: !0
  }), A), vt0 = {};
  MF4(vt0, {
    AlgorithmId: () => gt0,
    EndpointURLScheme: () => ht0,
    FieldPosition: () => ut0,
    HttpApiKeyAuthLocation: () => ft0,
    HttpAuthLocation: () => bt0,
    IniSectionType: () => mt0,
    RequestHandlerProtocol: () => dt0,
    SMITHY_CONTEXT_KEY: () => _F4,
    getDefaultClientConfiguration: () => jF4,
    resolveDefaultRuntimeConfig: () => SF4
  });
  ct0.exports = RF4(vt0);
  var bt0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(bt0 || {}),
    ft0 = ((A) => {
      return A.HEADER = "header", A.QUERY = "query", A
    })(ft0 || {}),
    ht0 = ((A) => {
      return A.HTTP = "http", A.HTTPS = "https", A
    })(ht0 || {}),
    gt0 = ((A) => {
      return A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256", A
    })(gt0 || {}),
    TF4 = VfA((A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => "sha256",
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => "md5",
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    PF4 = VfA((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    jF4 = VfA((A) => {
      return TF4(A)
    }, "getDefaultClientConfiguration"),
    SF4 = VfA((A) => {
      return PF4(A)
    }, "resolveDefaultRuntimeConfig"),
    ut0 = ((A) => {
      return A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER", A
    })(ut0 || {}),
    _F4 = "__smithy_context",
    mt0 = ((A) => {
      return A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services", A
    })(mt0 || {}),
    dt0 = ((A) => {
      return A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0", A
    })(dt0 || {})
})
// @from(Start 2260119, End 2264626)
rt0 = z((IH7, st0) => {
  var {
    defineProperty: FfA,
    getOwnPropertyDescriptor: kF4,
    getOwnPropertyNames: yF4
  } = Object, xF4 = Object.prototype.hasOwnProperty, Bd = (A, Q) => FfA(A, "name", {
    value: Q,
    configurable: !0
  }), vF4 = (A, Q) => {
    for (var B in Q) FfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, bF4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of yF4(Q))
        if (!xF4.call(A, Z) && Z !== B) FfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = kF4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, fF4 = (A) => bF4(FfA({}, "__esModule", {
    value: !0
  }), A), lt0 = {};
  vF4(lt0, {
    Field: () => uF4,
    Fields: () => mF4,
    HttpRequest: () => dF4,
    HttpResponse: () => cF4,
    IHttpRequest: () => it0.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => hF4,
    isValidHostname: () => at0,
    resolveHttpHandlerRuntimeConfig: () => gF4
  });
  st0.exports = fF4(lt0);
  var hF4 = Bd((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    gF4 = Bd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    it0 = pt0(),
    uF4 = class {
      static {
        Bd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = it0.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    mF4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Bd(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    dF4 = class A {
      static {
        Bd(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = nt0(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function nt0(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Bd(nt0, "cloneQuery");
  var cF4 = class {
    static {
      Bd(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function at0(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Bd(at0, "isValidHostname")
})
// @from(Start 2264632, End 2268114)
GZ = z((XH7, Ge0) => {
  var {
    defineProperty: KfA,
    getOwnPropertyDescriptor: pF4,
    getOwnPropertyNames: lF4
  } = Object, iF4 = Object.prototype.hasOwnProperty, DfA = (A, Q) => KfA(A, "name", {
    value: Q,
    configurable: !0
  }), nF4 = (A, Q) => {
    for (var B in Q) KfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, aF4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of lF4(Q))
        if (!iF4.call(A, Z) && Z !== B) KfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = pF4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, sF4 = (A) => aF4(KfA({}, "__esModule", {
    value: !0
  }), A), ot0 = {};
  nF4(ot0, {
    deserializerMiddleware: () => tt0,
    deserializerMiddlewareOption: () => Ae0,
    getSerdePlugin: () => Be0,
    serializerMiddleware: () => et0,
    serializerMiddlewareOption: () => Qe0
  });
  Ge0.exports = sF4(ot0);
  var rF4 = rt0(),
    tt0 = DfA((A, Q) => (B, G) => async (Z) => {
      let {
        response: I
      } = await B(Z);
      try {
        let Y = await Q(I, A);
        return {
          response: I,
          output: Y
        }
      } catch (Y) {
        if (Object.defineProperty(Y, "$response", {
            value: I
          }), !("$metadata" in Y)) {
          try {
            Y.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
          } catch (W) {
            if (!G.logger || G.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
            else G.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
          }
          if (typeof Y.$responseBodyText < "u") {
            if (Y.$response) Y.$response.body = Y.$responseBodyText
          }
          try {
            if (rF4.HttpResponse.isInstance(I)) {
              let {
                headers: W = {}
              } = I, X = Object.entries(W);
              Y.$metadata = {
                httpStatusCode: I.statusCode,
                requestId: XU1(/^x-[\w-]+-request-?id$/, X),
                extendedRequestId: XU1(/^x-[\w-]+-id-2$/, X),
                cfId: XU1(/^x-[\w-]+-cf-id$/, X)
              }
            }
          } catch (W) {}
        }
        throw Y
      }
    }, "deserializerMiddleware"),
    XU1 = DfA((A, Q) => {
      return (Q.find(([B]) => {
        return B.match(A)
      }) || [void 0, void 0])[1]
    }, "findHeader"),
    et0 = DfA((A, Q) => (B, G) => async (Z) => {
      let I = A,
        Y = G.endpointV2?.url && I.urlParser ? async () => I.urlParser(G.endpointV2.url): I.endpoint;
      if (!Y) throw Error("No valid endpoint provider available.");
      let J = await Q(Z.input, {
        ...A,
        endpoint: Y
      });
      return B({
        ...Z,
        request: J
      })
    }, "serializerMiddleware"),
    Ae0 = {
      name: "deserializerMiddleware",
      step: "deserialize",
      tags: ["DESERIALIZER"],
      override: !0
    },
    Qe0 = {
      name: "serializerMiddleware",
      step: "serialize",
      tags: ["SERIALIZER"],
      override: !0
    };

  function Be0(A, Q, B) {
    return {
      applyToStack: (G) => {
        G.add(tt0(A, B), Ae0), G.add(et0(A, Q), Qe0)
      }
    }
  }
  DfA(Be0, "getSerdePlugin")
})
// @from(Start 2268120, End 2272626)
Sr = z((VH7, We0) => {
  var {
    defineProperty: HfA,
    getOwnPropertyDescriptor: oF4,
    getOwnPropertyNames: tF4
  } = Object, eF4 = Object.prototype.hasOwnProperty, Gd = (A, Q) => HfA(A, "name", {
    value: Q,
    configurable: !0
  }), AK4 = (A, Q) => {
    for (var B in Q) HfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, QK4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of tF4(Q))
        if (!eF4.call(A, Z) && Z !== B) HfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = oF4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, BK4 = (A) => QK4(HfA({}, "__esModule", {
    value: !0
  }), A), Ze0 = {};
  AK4(Ze0, {
    Field: () => IK4,
    Fields: () => YK4,
    HttpRequest: () => JK4,
    HttpResponse: () => WK4,
    IHttpRequest: () => Ie0.HttpRequest,
    getHttpHandlerExtensionConfiguration: () => GK4,
    isValidHostname: () => Je0,
    resolveHttpHandlerRuntimeConfig: () => ZK4
  });
  We0.exports = BK4(Ze0);
  var GK4 = Gd((A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    }, "getHttpHandlerExtensionConfiguration"),
    ZK4 = Gd((A) => {
      return {
        httpHandler: A.httpHandler()
      }
    }, "resolveHttpHandlerRuntimeConfig"),
    Ie0 = WU1(),
    IK4 = class {
      static {
        Gd(this, "Field")
      }
      constructor({
        name: A,
        kind: Q = Ie0.FieldPosition.HEADER,
        values: B = []
      }) {
        this.name = A, this.kind = Q, this.values = B
      }
      add(A) {
        this.values.push(A)
      }
      set(A) {
        this.values = A
      }
      remove(A) {
        this.values = this.values.filter((Q) => Q !== A)
      }
      toString() {
        return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
      }
      get() {
        return this.values
      }
    },
    YK4 = class {
      constructor({
        fields: A = [],
        encoding: Q = "utf-8"
      }) {
        this.entries = {}, A.forEach(this.setField.bind(this)), this.encoding = Q
      }
      static {
        Gd(this, "Fields")
      }
      setField(A) {
        this.entries[A.name.toLowerCase()] = A
      }
      getField(A) {
        return this.entries[A.toLowerCase()]
      }
      removeField(A) {
        delete this.entries[A.toLowerCase()]
      }
      getByType(A) {
        return Object.values(this.entries).filter((Q) => Q.kind === A)
      }
    },
    JK4 = class A {
      static {
        Gd(this, "HttpRequest")
      }
      constructor(Q) {
        this.method = Q.method || "GET", this.hostname = Q.hostname || "localhost", this.port = Q.port, this.query = Q.query || {}, this.headers = Q.headers || {}, this.body = Q.body, this.protocol = Q.protocol ? Q.protocol.slice(-1) !== ":" ? `${Q.protocol}:` : Q.protocol : "https:", this.path = Q.path ? Q.path.charAt(0) !== "/" ? `/${Q.path}` : Q.path : "/", this.username = Q.username, this.password = Q.password, this.fragment = Q.fragment
      }
      static clone(Q) {
        let B = new A({
          ...Q,
          headers: {
            ...Q.headers
          }
        });
        if (B.query) B.query = Ye0(B.query);
        return B
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return "method" in B && "protocol" in B && "hostname" in B && "path" in B && typeof B.query === "object" && typeof B.headers === "object"
      }
      clone() {
        return A.clone(this)
      }
    };

  function Ye0(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  Gd(Ye0, "cloneQuery");
  var WK4 = class {
    static {
      Gd(this, "HttpResponse")
    }
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  };

  function Je0(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Gd(Je0, "isValidHostname")
})
// @from(Start 2272632, End 2273585)
Fe0 = z((HH7, Ve0) => {
  var {
    defineProperty: CfA,
    getOwnPropertyDescriptor: XK4,
    getOwnPropertyNames: VK4
  } = Object, FK4 = Object.prototype.hasOwnProperty, KK4 = (A, Q) => CfA(A, "name", {
    value: Q,
    configurable: !0
  }), DK4 = (A, Q) => {
    for (var B in Q) CfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, HK4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of VK4(Q))
        if (!FK4.call(A, Z) && Z !== B) CfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = XK4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, CK4 = (A) => HK4(CfA({}, "__esModule", {
    value: !0
  }), A), Xe0 = {};
  DK4(Xe0, {
    isArrayBuffer: () => EK4
  });
  Ve0.exports = CK4(Xe0);
  var EK4 = KK4((A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]", "isArrayBuffer")
})
// @from(Start 2273591, End 2274936)
hI = z((CH7, He0) => {
  var {
    defineProperty: EfA,
    getOwnPropertyDescriptor: zK4,
    getOwnPropertyNames: UK4
  } = Object, $K4 = Object.prototype.hasOwnProperty, Ke0 = (A, Q) => EfA(A, "name", {
    value: Q,
    configurable: !0
  }), wK4 = (A, Q) => {
    for (var B in Q) EfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, qK4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of UK4(Q))
        if (!$K4.call(A, Z) && Z !== B) EfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = zK4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, NK4 = (A) => qK4(EfA({}, "__esModule", {
    value: !0
  }), A), De0 = {};
  wK4(De0, {
    fromArrayBuffer: () => MK4,
    fromString: () => OK4
  });
  He0.exports = NK4(De0);
  var LK4 = Fe0(),
    VU1 = UA("buffer"),
    MK4 = Ke0((A, Q = 0, B = A.byteLength - Q) => {
      if (!(0, LK4.isArrayBuffer)(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return VU1.Buffer.from(A, Q, B)
    }, "fromArrayBuffer"),
    OK4 = Ke0((A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? VU1.Buffer.from(A, Q) : VU1.Buffer.from(A)
    }, "fromString")
})
// @from(Start 2274942, End 2275429)
ze0 = z((Ce0) => {
  Object.defineProperty(Ce0, "__esModule", {
    value: !0
  });
  Ce0.fromBase64 = void 0;
  var RK4 = hI(),
    TK4 = /^[A-Za-z0-9+/]*={0,2}$/,
    PK4 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!TK4.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, RK4.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  Ce0.fromBase64 = PK4
})
// @from(Start 2275435, End 2277096)
O2 = z((zH7, qe0) => {
  var {
    defineProperty: zfA,
    getOwnPropertyDescriptor: jK4,
    getOwnPropertyNames: SK4
  } = Object, _K4 = Object.prototype.hasOwnProperty, FU1 = (A, Q) => zfA(A, "name", {
    value: Q,
    configurable: !0
  }), kK4 = (A, Q) => {
    for (var B in Q) zfA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, yK4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of SK4(Q))
        if (!_K4.call(A, Z) && Z !== B) zfA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = jK4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, xK4 = (A) => yK4(zfA({}, "__esModule", {
    value: !0
  }), A), Ue0 = {};
  kK4(Ue0, {
    fromUtf8: () => we0,
    toUint8Array: () => vK4,
    toUtf8: () => bK4
  });
  qe0.exports = xK4(Ue0);
  var $e0 = hI(),
    we0 = FU1((A) => {
      let Q = (0, $e0.fromString)(A, "utf8");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength / Uint8Array.BYTES_PER_ELEMENT)
    }, "fromUtf8"),
    vK4 = FU1((A) => {
      if (typeof A === "string") return we0(A);
      if (ArrayBuffer.isView(A)) return new Uint8Array(A.buffer, A.byteOffset, A.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      return new Uint8Array(A)
    }, "toUint8Array"),
    bK4 = FU1((A) => {
      if (typeof A === "string") return A;
      if (typeof A !== "object" || typeof A.byteOffset !== "number" || typeof A.byteLength !== "number") throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
      return (0, $e0.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength).toString("utf8")
    }, "toUtf8")
})
// @from(Start 2277102, End 2277681)
Me0 = z((Ne0) => {
  Object.defineProperty(Ne0, "__esModule", {
    value: !0
  });
  Ne0.toBase64 = void 0;
  var fK4 = hI(),
    hK4 = O2(),
    gK4 = (A) => {
      let Q;
      if (typeof A === "string") Q = (0, hK4.fromUtf8)(A);
      else Q = A;
      if (typeof Q !== "object" || typeof Q.byteOffset !== "number" || typeof Q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
      return (0, fK4.fromArrayBuffer)(Q.buffer, Q.byteOffset, Q.byteLength).toString("base64")
    };
  Ne0.toBase64 = gK4
})
// @from(Start 2277687, End 2278383)
v4A = z(($H7, UfA) => {
  var {
    defineProperty: Oe0,
    getOwnPropertyDescriptor: uK4,
    getOwnPropertyNames: mK4
  } = Object, dK4 = Object.prototype.hasOwnProperty, KU1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of mK4(Q))
        if (!dK4.call(A, Z) && Z !== B) Oe0(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = uK4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Re0 = (A, Q, B) => (KU1(A, Q, "default"), B && KU1(B, Q, "default")), cK4 = (A) => KU1(Oe0({}, "__esModule", {
    value: !0
  }), A), DU1 = {};
  UfA.exports = cK4(DU1);
  Re0(DU1, ze0(), UfA.exports);
  Re0(DU1, Me0(), UfA.exports)
})
// @from(Start 2278389, End 2279789)
HU1 = z((Pe0) => {
  Object.defineProperty(Pe0, "__esModule", {
    value: !0
  });
  Pe0.ChecksumStream = void 0;
  var pK4 = v4A(),
    lK4 = UA("stream");
  class Te0 extends lK4.Duplex {
    constructor({
      expectedChecksum: A,
      checksum: Q,
      source: B,
      checksumSourceLocation: G,
      base64Encoder: Z
    }) {
      var I, Y;
      super();
      if (typeof B.pipe === "function") this.source = B;
      else throw Error(`@smithy/util-stream: unsupported source type ${(Y=(I=B===null||B===void 0?void 0:B.constructor)===null||I===void 0?void 0:I.name)!==null&&Y!==void 0?Y:B} in ChecksumStream.`);
      this.base64Encoder = Z !== null && Z !== void 0 ? Z : pK4.toBase64, this.expectedChecksum = A, this.checksum = Q, this.checksumSourceLocation = G, this.source.pipe(this)
    }
    _read(A) {}
    _write(A, Q, B) {
      try {
        this.checksum.update(A), this.push(A)
      } catch (G) {
        return B(G)
      }
      return B()
    }
    async _final(A) {
      try {
        let Q = await this.checksum.digest(),
          B = this.base64Encoder(Q);
        if (this.expectedChecksum !== B) return A(Error(`Checksum mismatch: expected "${this.expectedChecksum}" but received "${B}" in response header "${this.checksumSourceLocation}".`))
      } catch (Q) {
        return A(Q)
      }
      return this.push(null), A()
    }
  }
  Pe0.ChecksumStream = Te0
})
// @from(Start 2279795, End 2280441)
Zd = z((Se0) => {
  Object.defineProperty(Se0, "__esModule", {
    value: !0
  });
  Se0.isBlob = Se0.isReadableStream = void 0;
  var iK4 = (A) => {
    var Q;
    return typeof ReadableStream === "function" && (((Q = A === null || A === void 0 ? void 0 : A.constructor) === null || Q === void 0 ? void 0 : Q.name) === ReadableStream.name || A instanceof ReadableStream)
  };
  Se0.isReadableStream = iK4;
  var nK4 = (A) => {
    var Q;
    return typeof Blob === "function" && (((Q = A === null || A === void 0 ? void 0 : A.constructor) === null || Q === void 0 ? void 0 : Q.name) === Blob.name || A instanceof Blob)
  };
  Se0.isBlob = nK4
})
// @from(Start 2280447, End 2280701)
ve0 = z((ye0) => {
  Object.defineProperty(ye0, "__esModule", {
    value: !0
  });
  ye0.ChecksumStream = void 0;
  var sK4 = typeof ReadableStream === "function" ? ReadableStream : function() {};
  class ke0 extends sK4 {}
  ye0.ChecksumStream = ke0
})