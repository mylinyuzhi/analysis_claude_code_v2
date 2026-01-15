
// @from(Ln 66841, Col 4)
Sg = U((QEQ) => {
  Object.defineProperty(QEQ, "__esModule", {
    value: !0
  });
  var e2 = U6(),
    ah4 = BKQ(),
    oh4 = VT1(),
    rh4 = ET1(),
    sqA = jT1(),
    fT1 = CQ(),
    sh4 = lVQ(),
    sHQ = _T1(),
    th4 = eVQ(),
    eh4 = IFQ(),
    Ag4 = $FQ(),
    Qg4 = UFQ(),
    Si = gHQ(),
    Bg4 = znA(),
    Gg4 = _nA(),
    Zg4 = TnA(),
    Yg4 = OnA(),
    Jg4 = UnA(),
    Xg4 = $nA(),
    Ig4 = LnA(),
    Dg4 = PnA(),
    Wg4 = knA(),
    tHQ = yT1(),
    eHQ = xnA(),
    AEQ = qnA(),
    Kg4 = xT1(),
    Vg4 = lHQ(),
    Fg4 = aHQ(),
    Hg4 = rHQ(),
    Eg4 = sHQ.createGetModuleFromFilename(),
    zg4 = {
      ...e2.Integrations,
      ...Ag4,
      ...Qg4
    },
    $g4 = {
      instrumentCron: Vg4.instrumentCron,
      instrumentNodeCron: Fg4.instrumentNodeCron,
      instrumentNodeSchedule: Hg4.instrumentNodeSchedule
    };
  QEQ.Hub = e2.Hub;
  QEQ.SDK_VERSION = e2.SDK_VERSION;
  QEQ.SEMANTIC_ATTRIBUTE_SENTRY_OP = e2.SEMANTIC_ATTRIBUTE_SENTRY_OP;
  QEQ.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = e2.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
  QEQ.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = e2.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
  QEQ.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = e2.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
  QEQ.Scope = e2.Scope;
  QEQ.addBreadcrumb = e2.addBreadcrumb;
  QEQ.addEventProcessor = e2.addEventProcessor;
  QEQ.addGlobalEventProcessor = e2.addGlobalEventProcessor;
  QEQ.addIntegration = e2.addIntegration;
  QEQ.captureCheckIn = e2.captureCheckIn;
  QEQ.captureEvent = e2.captureEvent;
  QEQ.captureException = e2.captureException;
  QEQ.captureMessage = e2.captureMessage;
  QEQ.captureSession = e2.captureSession;
  QEQ.close = e2.close;
  QEQ.configureScope = e2.configureScope;
  QEQ.continueTrace = e2.continueTrace;
  QEQ.createTransport = e2.createTransport;
  QEQ.endSession = e2.endSession;
  QEQ.extractTraceparentData = e2.extractTraceparentData;
  QEQ.flush = e2.flush;
  QEQ.functionToStringIntegration = e2.functionToStringIntegration;
  QEQ.getActiveSpan = e2.getActiveSpan;
  QEQ.getActiveTransaction = e2.getActiveTransaction;
  QEQ.getClient = e2.getClient;
  QEQ.getCurrentHub = e2.getCurrentHub;
  QEQ.getCurrentScope = e2.getCurrentScope;
  QEQ.getGlobalScope = e2.getGlobalScope;
  QEQ.getHubFromCarrier = e2.getHubFromCarrier;
  QEQ.getIsolationScope = e2.getIsolationScope;
  QEQ.getSpanStatusFromHttpCode = e2.getSpanStatusFromHttpCode;
  QEQ.inboundFiltersIntegration = e2.inboundFiltersIntegration;
  QEQ.isInitialized = e2.isInitialized;
  QEQ.lastEventId = e2.lastEventId;
  QEQ.linkedErrorsIntegration = e2.linkedErrorsIntegration;
  QEQ.makeMain = e2.makeMain;
  QEQ.metrics = e2.metrics;
  QEQ.parameterize = e2.parameterize;
  QEQ.requestDataIntegration = e2.requestDataIntegration;
  QEQ.runWithAsyncContext = e2.runWithAsyncContext;
  QEQ.setContext = e2.setContext;
  QEQ.setCurrentClient = e2.setCurrentClient;
  QEQ.setExtra = e2.setExtra;
  QEQ.setExtras = e2.setExtras;
  QEQ.setHttpStatus = e2.setHttpStatus;
  QEQ.setMeasurement = e2.setMeasurement;
  QEQ.setTag = e2.setTag;
  QEQ.setTags = e2.setTags;
  QEQ.setUser = e2.setUser;
  QEQ.spanStatusfromHttpCode = e2.spanStatusfromHttpCode;
  QEQ.startActiveSpan = e2.startActiveSpan;
  QEQ.startInactiveSpan = e2.startInactiveSpan;
  QEQ.startSession = e2.startSession;
  QEQ.startSpan = e2.startSpan;
  QEQ.startSpanManual = e2.startSpanManual;
  QEQ.startTransaction = e2.startTransaction;
  QEQ.trace = e2.trace;
  QEQ.withActiveSpan = e2.withActiveSpan;
  QEQ.withIsolationScope = e2.withIsolationScope;
  QEQ.withMonitor = e2.withMonitor;
  QEQ.withScope = e2.withScope;
  QEQ.autoDiscoverNodePerformanceMonitoringIntegrations = ah4.autoDiscoverNodePerformanceMonitoringIntegrations;
  QEQ.NodeClient = oh4.NodeClient;
  QEQ.makeNodeTransport = rh4.makeNodeTransport;
  QEQ.defaultIntegrations = sqA.defaultIntegrations;
  QEQ.defaultStackParser = sqA.defaultStackParser;
  QEQ.getDefaultIntegrations = sqA.getDefaultIntegrations;
  QEQ.getSentryRelease = sqA.getSentryRelease;
  QEQ.init = sqA.init;
  QEQ.DEFAULT_USER_INCLUDES = fT1.DEFAULT_USER_INCLUDES;
  QEQ.addRequestDataToEvent = fT1.addRequestDataToEvent;
  QEQ.extractRequestData = fT1.extractRequestData;
  QEQ.deepReadDirSync = sh4.deepReadDirSync;
  QEQ.createGetModuleFromFilename = sHQ.createGetModuleFromFilename;
  QEQ.enableAnrDetection = th4.enableAnrDetection;
  QEQ.Handlers = eh4;
  QEQ.captureConsoleIntegration = Si.captureConsoleIntegration;
  QEQ.debugIntegration = Si.debugIntegration;
  QEQ.dedupeIntegration = Si.dedupeIntegration;
  QEQ.extraErrorDataIntegration = Si.extraErrorDataIntegration;
  QEQ.httpClientIntegration = Si.httpClientIntegration;
  QEQ.reportingObserverIntegration = Si.reportingObserverIntegration;
  QEQ.rewriteFramesIntegration = Si.rewriteFramesIntegration;
  QEQ.sessionTimingIntegration = Si.sessionTimingIntegration;
  QEQ.consoleIntegration = Bg4.consoleIntegration;
  QEQ.onUncaughtExceptionIntegration = Gg4.onUncaughtExceptionIntegration;
  QEQ.onUnhandledRejectionIntegration = Zg4.onUnhandledRejectionIntegration;
  QEQ.modulesIntegration = Yg4.modulesIntegration;
  QEQ.contextLinesIntegration = Jg4.contextLinesIntegration;
  QEQ.nodeContextIntegration = Xg4.nodeContextIntegration;
  QEQ.localVariablesIntegration = Ig4.localVariablesIntegration;
  QEQ.spotlightIntegration = Dg4.spotlightIntegration;
  QEQ.anrIntegration = Wg4.anrIntegration;
  QEQ.hapiErrorPlugin = tHQ.hapiErrorPlugin;
  QEQ.hapiIntegration = tHQ.hapiIntegration;
  QEQ.Undici = eHQ.Undici;
  QEQ.nativeNodeFetchintegration = eHQ.nativeNodeFetchintegration;
  QEQ.Http = AEQ.Http;
  QEQ.httpIntegration = AEQ.httpIntegration;
  QEQ.trpcMiddleware = Kg4.trpcMiddleware;
  QEQ.Integrations = zg4;
  QEQ.cron = $g4;
  QEQ.getModuleFromFilename = Eg4
})
// @from(Ln 66991, Col 0)
class LZA {
  heap;
  length;
  static #A = !1;
  static create(A) {
    let Q = YEQ(A);
    if (!Q) return [];
    LZA.#A = !0;
    let B = new LZA(A, Q);
    return LZA.#A = !1, B
  }
  constructor(A, Q) {
    if (!LZA.#A) throw TypeError("instantiate Stack using Stack.create(n)");
    this.heap = new Q(A), this.length = 0
  }
  push(A) {
    this.heap[this.length++] = A
  }
  pop() {
    return this.heap[--this.length]
  }
}
// @from(Ln 67013, Col 4)
wZA
// @from(Ln 67013, Col 9)
GEQ
// @from(Ln 67013, Col 14)
hT1
// @from(Ln 67013, Col 19)
ZEQ = (A, Q, B, G) => {
    typeof hT1.emitWarning === "function" ? hT1.emitWarning(A, Q, B, G) : console.error(`[${B}] ${Q}: ${A}`)
  }
// @from(Ln 67016, Col 2)
unA
// @from(Ln 67016, Col 7)
BEQ
// @from(Ln 67016, Col 12)
Em4 = (A) => !GEQ.has(A)
// @from(Ln 67017, Col 2)
K3G
// @from(Ln 67017, Col 7)
xi = (A) => A && A === Math.floor(A) && A > 0 && isFinite(A)
// @from(Ln 67018, Col 2)
YEQ = (A) => !xi(A) ? null : A <= Math.pow(2, 8) ? Uint8Array : A <= Math.pow(2, 16) ? Uint16Array : A <= Math.pow(2, 32) ? Uint32Array : A <= Number.MAX_SAFE_INTEGER ? tqA : null
// @from(Ln 67019, Col 2)
tqA
// @from(Ln 67019, Col 7)
jT
// @from(Ln 67020, Col 4)
eqA = w(() => {
  wZA = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date, GEQ = new Set, hT1 = typeof process === "object" && !!process ? process : {}, unA = globalThis.AbortController, BEQ = globalThis.AbortSignal;
  if (typeof unA > "u") {
    BEQ = class {
      onabort;
      _onabort = [];
      reason;
      aborted = !1;
      addEventListener(G, Z) {
        this._onabort.push(Z)
      }
    }, unA = class {
      constructor() {
        Q()
      }
      signal = new BEQ;
      abort(G) {
        if (this.signal.aborted) return;
        this.signal.reason = G, this.signal.aborted = !0;
        for (let Z of this.signal._onabort) Z(G);
        this.signal.onabort?.(G)
      }
    };
    let A = hT1.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1",
      Q = () => {
        if (!A) return;
        A = !1, ZEQ("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", Q)
      }
  }
  K3G = Symbol("type");
  tqA = class tqA extends Array {
    constructor(A) {
      super(A);
      this.fill(0)
    }
  };
  jT = class jT {
    #A;
    #Q;
    #B;
    #Z;
    #G;
    #X;
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
    #Y;
    #W;
    #K;
    #I;
    #J;
    #E;
    #$;
    #H;
    #V;
    #q;
    #F;
    #N;
    #w;
    #C;
    #L;
    #j;
    #z;
    static unsafeExposeInternals(A) {
      return {
        starts: A.#w,
        ttls: A.#C,
        sizes: A.#N,
        keyMap: A.#K,
        keyList: A.#I,
        valList: A.#J,
        next: A.#E,
        prev: A.#$,
        get head() {
          return A.#H
        },
        get tail() {
          return A.#V
        },
        free: A.#q,
        isBackgroundFetch: (Q) => A.#D(Q),
        backgroundFetch: (Q, B, G, Z) => A.#v(Q, B, G, Z),
        moveToTail: (Q) => A.#S(Q),
        indexes: (Q) => A.#O(Q),
        rindexes: (Q) => A.#M(Q),
        isStale: (Q) => A.#U(Q)
      }
    }
    get max() {
      return this.#A
    }
    get maxSize() {
      return this.#Q
    }
    get calculatedSize() {
      return this.#W
    }
    get size() {
      return this.#Y
    }
    get fetchMethod() {
      return this.#G
    }
    get memoMethod() {
      return this.#X
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
        updateAgeOnGet: Y,
        updateAgeOnHas: J,
        allowStale: X,
        dispose: I,
        disposeAfter: D,
        noDisposeOnSet: W,
        noUpdateTTL: K,
        maxSize: V = 0,
        maxEntrySize: F = 0,
        sizeCalculation: H,
        fetchMethod: E,
        memoMethod: z,
        noDeleteOnFetchRejection: $,
        noDeleteOnStaleGet: O,
        allowStaleOnFetchRejection: L,
        allowStaleOnFetchAbort: M,
        ignoreFetchAbort: _
      } = A;
      if (Q !== 0 && !xi(Q)) throw TypeError("max option must be a nonnegative integer");
      let j = Q ? YEQ(Q) : Array;
      if (!j) throw Error("invalid max value: " + Q);
      if (this.#A = Q, this.#Q = V, this.maxEntrySize = F || this.#Q, this.sizeCalculation = H, this.sizeCalculation) {
        if (!this.#Q && !this.maxEntrySize) throw TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
        if (typeof this.sizeCalculation !== "function") throw TypeError("sizeCalculation set to non-function")
      }
      if (z !== void 0 && typeof z !== "function") throw TypeError("memoMethod must be a function if defined");
      if (this.#X = z, E !== void 0 && typeof E !== "function") throw TypeError("fetchMethod must be a function if specified");
      if (this.#G = E, this.#j = !!E, this.#K = new Map, this.#I = Array(Q).fill(void 0), this.#J = Array(Q).fill(void 0), this.#E = new j(Q), this.#$ = new j(Q), this.#H = 0, this.#V = 0, this.#q = LZA.create(Q), this.#Y = 0, this.#W = 0, typeof I === "function") this.#B = I;
      if (typeof D === "function") this.#Z = D, this.#F = [];
      else this.#Z = void 0, this.#F = void 0;
      if (this.#L = !!this.#B, this.#z = !!this.#Z, this.noDisposeOnSet = !!W, this.noUpdateTTL = !!K, this.noDeleteOnFetchRejection = !!$, this.allowStaleOnFetchRejection = !!L, this.allowStaleOnFetchAbort = !!M, this.ignoreFetchAbort = !!_, this.maxEntrySize !== 0) {
        if (this.#Q !== 0) {
          if (!xi(this.#Q)) throw TypeError("maxSize must be a positive integer if specified")
        }
        if (!xi(this.maxEntrySize)) throw TypeError("maxEntrySize must be a positive integer if specified");
        this.#m()
      }
      if (this.allowStale = !!X, this.noDeleteOnStaleGet = !!O, this.updateAgeOnGet = !!Y, this.updateAgeOnHas = !!J, this.ttlResolution = xi(G) || G === 0 ? G : 1, this.ttlAutopurge = !!Z, this.ttl = B || 0, this.ttl) {
        if (!xi(this.ttl)) throw TypeError("ttl must be a positive integer if specified");
        this.#k()
      }
      if (this.#A === 0 && this.ttl === 0 && this.#Q === 0) throw TypeError("At least one of max, maxSize, or ttl is required");
      if (!this.ttlAutopurge && !this.#A && !this.#Q) {
        if (Em4("LRU_CACHE_UNBOUNDED")) GEQ.add("LRU_CACHE_UNBOUNDED"), ZEQ("TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.", "UnboundedCacheWarning", "LRU_CACHE_UNBOUNDED", jT)
      }
    }
    getRemainingTTL(A) {
      return this.#K.has(A) ? 1 / 0 : 0
    }
    #k() {
      let A = new tqA(this.#A),
        Q = new tqA(this.#A);
      this.#C = A, this.#w = Q, this.#b = (Z, Y, J = wZA.now()) => {
        if (Q[Z] = Y !== 0 ? J : 0, A[Z] = Y, Y !== 0 && this.ttlAutopurge) {
          let X = setTimeout(() => {
            if (this.#U(Z)) this.#R(this.#I[Z], "expire")
          }, Y + 1);
          if (X.unref) X.unref()
        }
      }, this.#T = (Z) => {
        Q[Z] = A[Z] !== 0 ? wZA.now() : 0
      }, this.#_ = (Z, Y) => {
        if (A[Y]) {
          let J = A[Y],
            X = Q[Y];
          if (!J || !X) return;
          Z.ttl = J, Z.start = X, Z.now = B || G();
          let I = Z.now - X;
          Z.remainingTTL = J - I
        }
      };
      let B = 0,
        G = () => {
          let Z = wZA.now();
          if (this.ttlResolution > 0) {
            B = Z;
            let Y = setTimeout(() => B = 0, this.ttlResolution);
            if (Y.unref) Y.unref()
          }
          return Z
        };
      this.getRemainingTTL = (Z) => {
        let Y = this.#K.get(Z);
        if (Y === void 0) return 0;
        let J = A[Y],
          X = Q[Y];
        if (!J || !X) return 1 / 0;
        let I = (B || G()) - X;
        return J - I
      }, this.#U = (Z) => {
        let Y = Q[Z],
          J = A[Z];
        return !!J && !!Y && (B || G()) - Y > J
      }
    }
    #T = () => {};
    #_ = () => {};
    #b = () => {};
    #U = () => !1;
    #m() {
      let A = new tqA(this.#A);
      this.#W = 0, this.#N = A, this.#P = (Q) => {
        this.#W -= A[Q], A[Q] = 0
      }, this.#f = (Q, B, G, Z) => {
        if (this.#D(B)) return 0;
        if (!xi(G))
          if (Z) {
            if (typeof Z !== "function") throw TypeError("sizeCalculation must be a function");
            if (G = Z(B, Q), !xi(G)) throw TypeError("sizeCalculation return invalid (expect positive integer)")
          } else throw TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        return G
      }, this.#x = (Q, B, G) => {
        if (A[Q] = B, this.#Q) {
          let Z = this.#Q - A[Q];
          while (this.#W > Z) this.#y(!0)
        }
        if (this.#W += A[Q], G) G.entrySize = B, G.totalCalculatedSize = this.#W
      }
    }
    #P = (A) => {};
    #x = (A, Q, B) => {};
    #f = (A, Q, B, G) => {
      if (B || G) throw TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
      return 0
    };* #O({
      allowStale: A = this.allowStale
    } = {}) {
      if (this.#Y)
        for (let Q = this.#V;;) {
          if (!this.#h(Q)) break;
          if (A || !this.#U(Q)) yield Q;
          if (Q === this.#H) break;
          else Q = this.#$[Q]
        }
    }* #M({
      allowStale: A = this.allowStale
    } = {}) {
      if (this.#Y)
        for (let Q = this.#H;;) {
          if (!this.#h(Q)) break;
          if (A || !this.#U(Q)) yield Q;
          if (Q === this.#V) break;
          else Q = this.#E[Q]
        }
    }
    #h(A) {
      return A !== void 0 && this.#K.get(this.#I[A]) === A
    }* entries() {
      for (let A of this.#O())
        if (this.#J[A] !== void 0 && this.#I[A] !== void 0 && !this.#D(this.#J[A])) yield [this.#I[A], this.#J[A]]
    }* rentries() {
      for (let A of this.#M())
        if (this.#J[A] !== void 0 && this.#I[A] !== void 0 && !this.#D(this.#J[A])) yield [this.#I[A], this.#J[A]]
    }* keys() {
      for (let A of this.#O()) {
        let Q = this.#I[A];
        if (Q !== void 0 && !this.#D(this.#J[A])) yield Q
      }
    }* rkeys() {
      for (let A of this.#M()) {
        let Q = this.#I[A];
        if (Q !== void 0 && !this.#D(this.#J[A])) yield Q
      }
    }* values() {
      for (let A of this.#O())
        if (this.#J[A] !== void 0 && !this.#D(this.#J[A])) yield this.#J[A]
    }* rvalues() {
      for (let A of this.#M())
        if (this.#J[A] !== void 0 && !this.#D(this.#J[A])) yield this.#J[A]
    } [Symbol.iterator]() {
      return this.entries()
    } [Symbol.toStringTag] = "LRUCache";
    find(A, Q = {}) {
      for (let B of this.#O()) {
        let G = this.#J[B],
          Z = this.#D(G) ? G.__staleWhileFetching : G;
        if (Z === void 0) continue;
        if (A(Z, this.#I[B], this)) return this.get(this.#I[B], Q)
      }
    }
    forEach(A, Q = this) {
      for (let B of this.#O()) {
        let G = this.#J[B],
          Z = this.#D(G) ? G.__staleWhileFetching : G;
        if (Z === void 0) continue;
        A.call(Q, Z, this.#I[B], this)
      }
    }
    rforEach(A, Q = this) {
      for (let B of this.#M()) {
        let G = this.#J[B],
          Z = this.#D(G) ? G.__staleWhileFetching : G;
        if (Z === void 0) continue;
        A.call(Q, Z, this.#I[B], this)
      }
    }
    purgeStale() {
      let A = !1;
      for (let Q of this.#M({
          allowStale: !0
        }))
        if (this.#U(Q)) this.#R(this.#I[Q], "expire"), A = !0;
      return A
    }
    info(A) {
      let Q = this.#K.get(A);
      if (Q === void 0) return;
      let B = this.#J[Q],
        G = this.#D(B) ? B.__staleWhileFetching : B;
      if (G === void 0) return;
      let Z = {
        value: G
      };
      if (this.#C && this.#w) {
        let Y = this.#C[Q],
          J = this.#w[Q];
        if (Y && J) {
          let X = Y - (wZA.now() - J);
          Z.ttl = X, Z.start = Date.now()
        }
      }
      if (this.#N) Z.size = this.#N[Q];
      return Z
    }
    dump() {
      let A = [];
      for (let Q of this.#O({
          allowStale: !0
        })) {
        let B = this.#I[Q],
          G = this.#J[Q],
          Z = this.#D(G) ? G.__staleWhileFetching : G;
        if (Z === void 0 || B === void 0) continue;
        let Y = {
          value: Z
        };
        if (this.#C && this.#w) {
          Y.ttl = this.#C[Q];
          let J = wZA.now() - this.#w[Q];
          Y.start = Math.floor(Date.now() - J)
        }
        if (this.#N) Y.size = this.#N[Q];
        A.unshift([B, Y])
      }
      return A
    }
    load(A) {
      this.clear();
      for (let [Q, B] of A) {
        if (B.start) {
          let G = Date.now() - B.start;
          B.start = wZA.now() - G
        }
        this.set(Q, B.value, B)
      }
    }
    set(A, Q, B = {}) {
      if (Q === void 0) return this.delete(A), this;
      let {
        ttl: G = this.ttl,
        start: Z,
        noDisposeOnSet: Y = this.noDisposeOnSet,
        sizeCalculation: J = this.sizeCalculation,
        status: X
      } = B, {
        noUpdateTTL: I = this.noUpdateTTL
      } = B, D = this.#f(A, Q, B.size || 0, J);
      if (this.maxEntrySize && D > this.maxEntrySize) {
        if (X) X.set = "miss", X.maxEntrySizeExceeded = !0;
        return this.#R(A, "set"), this
      }
      let W = this.#Y === 0 ? void 0 : this.#K.get(A);
      if (W === void 0) {
        if (W = this.#Y === 0 ? this.#V : this.#q.length !== 0 ? this.#q.pop() : this.#Y === this.#A ? this.#y(!1) : this.#Y, this.#I[W] = A, this.#J[W] = Q, this.#K.set(A, W), this.#E[this.#V] = W, this.#$[W] = this.#V, this.#V = W, this.#Y++, this.#x(W, D, X), X) X.set = "add";
        I = !1
      } else {
        this.#S(W);
        let K = this.#J[W];
        if (Q !== K) {
          if (this.#j && this.#D(K)) {
            K.__abortController.abort(Error("replaced"));
            let {
              __staleWhileFetching: V
            } = K;
            if (V !== void 0 && !Y) {
              if (this.#L) this.#B?.(V, A, "set");
              if (this.#z) this.#F?.push([V, A, "set"])
            }
          } else if (!Y) {
            if (this.#L) this.#B?.(K, A, "set");
            if (this.#z) this.#F?.push([K, A, "set"])
          }
          if (this.#P(W), this.#x(W, D, X), this.#J[W] = Q, X) {
            X.set = "replace";
            let V = K && this.#D(K) ? K.__staleWhileFetching : K;
            if (V !== void 0) X.oldValue = V
          }
        } else if (X) X.set = "update"
      }
      if (G !== 0 && !this.#C) this.#k();
      if (this.#C) {
        if (!I) this.#b(W, G, Z);
        if (X) this.#_(X, W)
      }
      if (!Y && this.#z && this.#F) {
        let K = this.#F,
          V;
        while (V = K?.shift()) this.#Z?.(...V)
      }
      return this
    }
    pop() {
      try {
        while (this.#Y) {
          let A = this.#J[this.#H];
          if (this.#y(!0), this.#D(A)) {
            if (A.__staleWhileFetching) return A.__staleWhileFetching
          } else if (A !== void 0) return A
        }
      } finally {
        if (this.#z && this.#F) {
          let A = this.#F,
            Q;
          while (Q = A?.shift()) this.#Z?.(...Q)
        }
      }
    }
    #y(A) {
      let Q = this.#H,
        B = this.#I[Q],
        G = this.#J[Q];
      if (this.#j && this.#D(G)) G.__abortController.abort(Error("evicted"));
      else if (this.#L || this.#z) {
        if (this.#L) this.#B?.(G, B, "evict");
        if (this.#z) this.#F?.push([G, B, "evict"])
      }
      if (this.#P(Q), A) this.#I[Q] = void 0, this.#J[Q] = void 0, this.#q.push(Q);
      if (this.#Y === 1) this.#H = this.#V = 0, this.#q.length = 0;
      else this.#H = this.#E[Q];
      return this.#K.delete(B), this.#Y--, Q
    }
    has(A, Q = {}) {
      let {
        updateAgeOnHas: B = this.updateAgeOnHas,
        status: G
      } = Q, Z = this.#K.get(A);
      if (Z !== void 0) {
        let Y = this.#J[Z];
        if (this.#D(Y) && Y.__staleWhileFetching === void 0) return !1;
        if (!this.#U(Z)) {
          if (B) this.#T(Z);
          if (G) G.has = "hit", this.#_(G, Z);
          return !0
        } else if (G) G.has = "stale", this.#_(G, Z)
      } else if (G) G.has = "miss";
      return !1
    }
    peek(A, Q = {}) {
      let {
        allowStale: B = this.allowStale
      } = Q, G = this.#K.get(A);
      if (G === void 0 || !B && this.#U(G)) return;
      let Z = this.#J[G];
      return this.#D(Z) ? Z.__staleWhileFetching : Z
    }
    #v(A, Q, B, G) {
      let Z = Q === void 0 ? void 0 : this.#J[Q];
      if (this.#D(Z)) return Z;
      let Y = new unA,
        {
          signal: J
        } = B;
      J?.addEventListener("abort", () => Y.abort(J.reason), {
        signal: Y.signal
      });
      let X = {
          signal: Y.signal,
          options: B,
          context: G
        },
        I = (H, E = !1) => {
          let {
            aborted: z
          } = Y.signal, $ = B.ignoreFetchAbort && H !== void 0;
          if (B.status)
            if (z && !E) {
              if (B.status.fetchAborted = !0, B.status.fetchError = Y.signal.reason, $) B.status.fetchAbortIgnored = !0
            } else B.status.fetchResolved = !0;
          if (z && !$ && !E) return W(Y.signal.reason);
          let O = V;
          if (this.#J[Q] === V)
            if (H === void 0)
              if (O.__staleWhileFetching) this.#J[Q] = O.__staleWhileFetching;
              else this.#R(A, "fetch");
          else {
            if (B.status) B.status.fetchUpdated = !0;
            this.set(A, H, X.options)
          }
          return H
        },
        D = (H) => {
          if (B.status) B.status.fetchRejected = !0, B.status.fetchError = H;
          return W(H)
        },
        W = (H) => {
          let {
            aborted: E
          } = Y.signal, z = E && B.allowStaleOnFetchAbort, $ = z || B.allowStaleOnFetchRejection, O = $ || B.noDeleteOnFetchRejection, L = V;
          if (this.#J[Q] === V) {
            if (!O || L.__staleWhileFetching === void 0) this.#R(A, "fetch");
            else if (!z) this.#J[Q] = L.__staleWhileFetching
          }
          if ($) {
            if (B.status && L.__staleWhileFetching !== void 0) B.status.returnedStale = !0;
            return L.__staleWhileFetching
          } else if (L.__returned === L) throw H
        },
        K = (H, E) => {
          let z = this.#G?.(A, Z, X);
          if (z && z instanceof Promise) z.then(($) => H($ === void 0 ? void 0 : $), E);
          Y.signal.addEventListener("abort", () => {
            if (!B.ignoreFetchAbort || B.allowStaleOnFetchAbort) {
              if (H(void 0), B.allowStaleOnFetchAbort) H = ($) => I($, !0)
            }
          })
        };
      if (B.status) B.status.fetchDispatched = !0;
      let V = new Promise(K).then(I, D),
        F = Object.assign(V, {
          __abortController: Y,
          __staleWhileFetching: Z,
          __returned: void 0
        });
      if (Q === void 0) this.set(A, F, {
        ...X.options,
        status: void 0
      }), Q = this.#K.get(A);
      else this.#J[Q] = F;
      return F
    }
    #D(A) {
      if (!this.#j) return !1;
      let Q = A;
      return !!Q && Q instanceof Promise && Q.hasOwnProperty("__staleWhileFetching") && Q.__abortController instanceof unA
    }
    async fetch(A, Q = {}) {
      let {
        allowStale: B = this.allowStale,
        updateAgeOnGet: G = this.updateAgeOnGet,
        noDeleteOnStaleGet: Z = this.noDeleteOnStaleGet,
        ttl: Y = this.ttl,
        noDisposeOnSet: J = this.noDisposeOnSet,
        size: X = 0,
        sizeCalculation: I = this.sizeCalculation,
        noUpdateTTL: D = this.noUpdateTTL,
        noDeleteOnFetchRejection: W = this.noDeleteOnFetchRejection,
        allowStaleOnFetchRejection: K = this.allowStaleOnFetchRejection,
        ignoreFetchAbort: V = this.ignoreFetchAbort,
        allowStaleOnFetchAbort: F = this.allowStaleOnFetchAbort,
        context: H,
        forceRefresh: E = !1,
        status: z,
        signal: $
      } = Q;
      if (!this.#j) {
        if (z) z.fetch = "get";
        return this.get(A, {
          allowStale: B,
          updateAgeOnGet: G,
          noDeleteOnStaleGet: Z,
          status: z
        })
      }
      let O = {
          allowStale: B,
          updateAgeOnGet: G,
          noDeleteOnStaleGet: Z,
          ttl: Y,
          noDisposeOnSet: J,
          size: X,
          sizeCalculation: I,
          noUpdateTTL: D,
          noDeleteOnFetchRejection: W,
          allowStaleOnFetchRejection: K,
          allowStaleOnFetchAbort: F,
          ignoreFetchAbort: V,
          status: z,
          signal: $
        },
        L = this.#K.get(A);
      if (L === void 0) {
        if (z) z.fetch = "miss";
        let M = this.#v(A, L, O, H);
        return M.__returned = M
      } else {
        let M = this.#J[L];
        if (this.#D(M)) {
          let S = B && M.__staleWhileFetching !== void 0;
          if (z) {
            if (z.fetch = "inflight", S) z.returnedStale = !0
          }
          return S ? M.__staleWhileFetching : M.__returned = M
        }
        let _ = this.#U(L);
        if (!E && !_) {
          if (z) z.fetch = "hit";
          if (this.#S(L), G) this.#T(L);
          if (z) this.#_(z, L);
          return M
        }
        let j = this.#v(A, L, O, H),
          b = j.__staleWhileFetching !== void 0 && B;
        if (z) {
          if (z.fetch = _ ? "stale" : "refresh", b && _) z.returnedStale = !0
        }
        return b ? j.__staleWhileFetching : j.__returned = j
      }
    }
    async forceFetch(A, Q = {}) {
      let B = await this.fetch(A, Q);
      if (B === void 0) throw Error("fetch() returned undefined");
      return B
    }
    memo(A, Q = {}) {
      let B = this.#X;
      if (!B) throw Error("no memoMethod provided to constructor");
      let {
        context: G,
        forceRefresh: Z,
        ...Y
      } = Q, J = this.get(A, Y);
      if (!Z && J !== void 0) return J;
      let X = B(A, J, {
        options: Y,
        context: G
      });
      return this.set(A, X, Y), X
    }
    get(A, Q = {}) {
      let {
        allowStale: B = this.allowStale,
        updateAgeOnGet: G = this.updateAgeOnGet,
        noDeleteOnStaleGet: Z = this.noDeleteOnStaleGet,
        status: Y
      } = Q, J = this.#K.get(A);
      if (J !== void 0) {
        let X = this.#J[J],
          I = this.#D(X);
        if (Y) this.#_(Y, J);
        if (this.#U(J)) {
          if (Y) Y.get = "stale";
          if (!I) {
            if (!Z) this.#R(A, "expire");
            if (Y && B) Y.returnedStale = !0;
            return B ? X : void 0
          } else {
            if (Y && B && X.__staleWhileFetching !== void 0) Y.returnedStale = !0;
            return B ? X.__staleWhileFetching : void 0
          }
        } else {
          if (Y) Y.get = "hit";
          if (I) return X.__staleWhileFetching;
          if (this.#S(J), G) this.#T(J);
          return X
        }
      } else if (Y) Y.get = "miss"
    }
    #g(A, Q) {
      this.#$[Q] = A, this.#E[A] = Q
    }
    #S(A) {
      if (A !== this.#V) {
        if (A === this.#H) this.#H = this.#E[A];
        else this.#g(this.#$[A], this.#E[A]);
        this.#g(this.#V, A), this.#V = A
      }
    }
    delete(A) {
      return this.#R(A, "delete")
    }
    #R(A, Q) {
      let B = !1;
      if (this.#Y !== 0) {
        let G = this.#K.get(A);
        if (G !== void 0)
          if (B = !0, this.#Y === 1) this.#u(Q);
          else {
            this.#P(G);
            let Z = this.#J[G];
            if (this.#D(Z)) Z.__abortController.abort(Error("deleted"));
            else if (this.#L || this.#z) {
              if (this.#L) this.#B?.(Z, A, Q);
              if (this.#z) this.#F?.push([Z, A, Q])
            }
            if (this.#K.delete(A), this.#I[G] = void 0, this.#J[G] = void 0, G === this.#V) this.#V = this.#$[G];
            else if (G === this.#H) this.#H = this.#E[G];
            else {
              let Y = this.#$[G];
              this.#E[Y] = this.#E[G];
              let J = this.#E[G];
              this.#$[J] = this.#$[G]
            }
            this.#Y--, this.#q.push(G)
          }
      }
      if (this.#z && this.#F?.length) {
        let G = this.#F,
          Z;
        while (Z = G?.shift()) this.#Z?.(...Z)
      }
      return B
    }
    clear() {
      return this.#u("delete")
    }
    #u(A) {
      for (let Q of this.#M({
          allowStale: !0
        })) {
        let B = this.#J[Q];
        if (this.#D(B)) B.__abortController.abort(Error("deleted"));
        else {
          let G = this.#I[Q];
          if (this.#L) this.#B?.(B, G, A);
          if (this.#z) this.#F?.push([B, G, A])
        }
      }
      if (this.#K.clear(), this.#J.fill(void 0), this.#I.fill(void 0), this.#C && this.#w) this.#C.fill(0), this.#w.fill(0);
      if (this.#N) this.#N.fill(0);
      if (this.#H = 0, this.#V = 0, this.#q.length = 0, this.#W = 0, this.#Y = 0, this.#z && this.#F) {
        let Q = this.#F,
          B;
        while (B = Q?.shift()) this.#Z?.(...B)
      }
    }
  }
})
// @from(Ln 67788, Col 0)
function gT1(A, Q = 300000) {
  let B = new Map,
    G = (...Z) => {
      let Y = eA(Z),
        J = B.get(Y),
        X = Date.now();
      if (!J) {
        let I = A(...Z);
        return B.set(Y, {
          value: I,
          timestamp: X,
          refreshing: !1
        }), I
      }
      if (J && X - J.timestamp > Q && !J.refreshing) return J.refreshing = !0, Promise.resolve().then(() => {
        let I = A(...Z);
        B.set(Y, {
          value: I,
          timestamp: Date.now(),
          refreshing: !1
        })
      }).catch((I) => {
        e(I instanceof Error ? I : Error(String(I))), B.delete(Y)
      }), J.value;
      return B.get(Y).value
    };
  return G.cache = {
    clear: () => B.clear()
  }, G
}
// @from(Ln 67819, Col 0)
function mnA(A, Q = 300000) {
  let B = new Map,
    G = async (...Z) => {
      let Y = eA(Z),
        J = B.get(Y),
        X = Date.now();
      if (!J) {
        let I = await A(...Z);
        return B.set(Y, {
          value: I,
          timestamp: X,
          refreshing: !1
        }), I
      }
      if (J && X - J.timestamp > Q && !J.refreshing) return J.refreshing = !0, A(...Z).then((I) => {
        B.set(Y, {
          value: I,
          timestamp: Date.now(),
          refreshing: !1
        })
      }).catch((I) => {
        e(I instanceof Error ? I : Error(String(I))), B.delete(Y)
      }), J.value;
      return B.get(Y).value
    };
  return G.cache = {
    clear: () => B.clear()
  }, G
}
// @from(Ln 67848, Col 4)
dnA = w(() => {
  v1();
  A0()
})
// @from(Ln 67853, Col 0)
function Cm4() {
  let A = new Map;
  for (let [Q, B] of Object.entries(DX)) {
    for (let [G, Z] of Object.entries(B)) DX[G] = {
      open: `\x1B[${Z[0]}m`,
      close: `\x1B[${Z[1]}m`
    }, B[G] = DX[G], A.set(Z[0], Z[1]);
    Object.defineProperty(DX, Q, {
      value: B,
      enumerable: !1
    })
  }
  return Object.defineProperty(DX, "codes", {
    value: A,
    enumerable: !1
  }), DX.color.close = "\x1B[39m", DX.bgColor.close = "\x1B[49m", DX.color.ansi = JEQ(), DX.color.ansi256 = XEQ(), DX.color.ansi16m = IEQ(), DX.bgColor.ansi = JEQ(10), DX.bgColor.ansi256 = XEQ(10), DX.bgColor.ansi16m = IEQ(10), Object.defineProperties(DX, {
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
        if (G.length === 3) G = [...G].map((Y) => Y + Y).join("");
        let Z = Number.parseInt(G, 16);
        return [Z >> 16 & 255, Z >> 8 & 255, Z & 255]
      },
      enumerable: !1
    },
    hexToAnsi256: {
      value: (Q) => DX.rgbToAnsi256(...DX.hexToRgb(Q)),
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
          let X = Q % 36;
          B = Math.floor(Q / 36) / 5, G = Math.floor(X / 6) / 5, Z = X % 6 / 5
        }
        let Y = Math.max(B, G, Z) * 2;
        if (Y === 0) return 30;
        let J = 30 + (Math.round(Z) << 2 | Math.round(G) << 1 | Math.round(B));
        if (Y === 2) J += 60;
        return J
      },
      enumerable: !1
    },
    rgbToAnsi: {
      value: (Q, B, G) => DX.ansi256ToAnsi(DX.rgbToAnsi256(Q, B, G)),
      enumerable: !1
    },
    hexToAnsi: {
      value: (Q) => DX.ansi256ToAnsi(DX.hexToAnsi256(Q)),
      enumerable: !1
    }
  }), DX
}
// @from(Ln 67924, Col 4)
JEQ = (A = 0) => (Q) => `\x1B[${Q+A}m`
// @from(Ln 67925, Col 2)
XEQ = (A = 0) => (Q) => `\x1B[${38+A};5;${Q}m`
// @from(Ln 67926, Col 2)
IEQ = (A = 0) => (Q, B, G) => `\x1B[${38+A};2;${Q};${B};${G}m`
// @from(Ln 67927, Col 2)
DX
// @from(Ln 67927, Col 6)
z3G
// @from(Ln 67927, Col 11)
zm4
// @from(Ln 67927, Col 16)
$m4
// @from(Ln 67927, Col 21)
$3G
// @from(Ln 67927, Col 26)
Um4
// @from(Ln 67927, Col 31)
TT
// @from(Ln 67928, Col 4)
DEQ = w(() => {
  DX = {
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
  }, z3G = Object.keys(DX.modifier), zm4 = Object.keys(DX.color), $m4 = Object.keys(DX.bgColor), $3G = [...zm4, ...$m4];
  Um4 = Cm4(), TT = Um4
})
// @from(Ln 67988, Col 0)
function iM(A, Q = globalThis.Deno ? globalThis.Deno.args : uT1.argv) {
  let B = A.startsWith("-") ? "" : A.length === 1 ? "-" : "--",
    G = Q.indexOf(B + A),
    Z = Q.indexOf("--");
  return G !== -1 && (Z === -1 || G < Z)
}
// @from(Ln 67995, Col 0)
function Nm4() {
  if ("FORCE_COLOR" in fI) {
    if (fI.FORCE_COLOR === "true") return 1;
    if (fI.FORCE_COLOR === "false") return 0;
    return fI.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(fI.FORCE_COLOR, 10), 3)
  }
}
// @from(Ln 68003, Col 0)
function wm4(A) {
  if (A === 0) return !1;
  return {
    level: A,
    hasBasic: !0,
    has256: A >= 2,
    has16m: A >= 3
  }
}
// @from(Ln 68013, Col 0)
function Lm4(A, {
  streamIsTTY: Q,
  sniffFlags: B = !0
} = {}) {
  let G = Nm4();
  if (G !== void 0) cnA = G;
  let Z = B ? cnA : G;
  if (Z === 0) return 0;
  if (B) {
    if (iM("color=16m") || iM("color=full") || iM("color=truecolor")) return 3;
    if (iM("color=256")) return 2
  }
  if ("TF_BUILD" in fI && "AGENT_NAME" in fI) return 1;
  if (A && !Q && Z === void 0) return 0;
  let Y = Z || 0;
  if (fI.TERM === "dumb") return Y;
  if (uT1.platform === "win32") {
    let J = qm4.release().split(".");
    if (Number(J[0]) >= 10 && Number(J[2]) >= 10586) return Number(J[2]) >= 14931 ? 3 : 2;
    return 1
  }
  if ("CI" in fI) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((J) => (J in fI))) return 3;
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((J) => (J in fI)) || fI.CI_NAME === "codeship") return 1;
    return Y
  }
  if ("TEAMCITY_VERSION" in fI) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(fI.TEAMCITY_VERSION) ? 1 : 0;
  if (fI.COLORTERM === "truecolor") return 3;
  if (fI.TERM === "xterm-kitty") return 3;
  if ("TERM_PROGRAM" in fI) {
    let J = Number.parseInt((fI.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (fI.TERM_PROGRAM) {
      case "iTerm.app":
        return J >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2
    }
  }
  if (/-256(color)?$/i.test(fI.TERM)) return 2;
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(fI.TERM)) return 1;
  if ("COLORTERM" in fI) return 1;
  return Y
}
// @from(Ln 68057, Col 0)
function KEQ(A, Q = {}) {
  let B = Lm4(A, {
    streamIsTTY: A && A.isTTY,
    ...Q
  });
  return wm4(B)
}
// @from(Ln 68064, Col 4)
fI
// @from(Ln 68064, Col 8)
cnA
// @from(Ln 68064, Col 13)
Om4
// @from(Ln 68064, Col 18)
VEQ
// @from(Ln 68065, Col 4)
FEQ = w(() => {
  ({
    env: fI
  } = uT1);
  if (iM("no-color") || iM("no-colors") || iM("color=false") || iM("color=never")) cnA = 0;
  else if (iM("color") || iM("colors") || iM("color=true") || iM("color=always")) cnA = 1;
  Om4 = {
    stdout: KEQ({
      isTTY: WEQ.isatty(1)
    }),
    stderr: KEQ({
      isTTY: WEQ.isatty(2)
    })
  }, VEQ = Om4
})
// @from(Ln 68081, Col 0)
function HEQ(A, Q, B) {
  let G = A.indexOf(Q);
  if (G === -1) return A;
  let Z = Q.length,
    Y = 0,
    J = "";
  do J += A.slice(Y, G) + Q + B, Y = G + Z, G = A.indexOf(Q, Y); while (G !== -1);
  return J += A.slice(Y), J
}
// @from(Ln 68091, Col 0)
function EEQ(A, Q, B, G) {
  let Z = 0,
    Y = "";
  do {
    let J = A[G - 1] === "\r";
    Y += A.slice(Z, J ? G - 1 : G) + Q + (J ? `\r
` : `
`) + B, Z = G + 1, G = A.indexOf(`
`, Z)
  } while (G !== -1);
  return Y += A.slice(Z), Y
}
// @from(Ln 68103, Col 0)
class pT1 {
  constructor(A) {
    return UEQ(A)
  }
}
// @from(Ln 68109, Col 0)
function QNA(A) {
  return UEQ(A)
}
// @from(Ln 68112, Col 4)
zEQ
// @from(Ln 68112, Col 9)
$EQ
// @from(Ln 68112, Col 14)
mT1
// @from(Ln 68112, Col 19)
OZA
// @from(Ln 68112, Col 24)
ANA
// @from(Ln 68112, Col 29)
CEQ
// @from(Ln 68112, Col 34)
MZA
// @from(Ln 68112, Col 39)
Mm4 = (A, Q = {}) => {
    if (Q.level && !(Number.isInteger(Q.level) && Q.level >= 0 && Q.level <= 3)) throw Error("The `level` option should be an integer from 0 to 3");
    let B = zEQ ? zEQ.level : 0;
    A.level = Q.level === void 0 ? B : Q.level
  }
// @from(Ln 68117, Col 2)
UEQ = (A) => {
    let Q = (...B) => B.join(" ");
    return Mm4(Q, A), Object.setPrototypeOf(Q, QNA.prototype), Q
  }
// @from(Ln 68121, Col 2)
dT1 = (A, Q, B, ...G) => {
    if (A === "rgb") {
      if (Q === "ansi16m") return TT[B].ansi16m(...G);
      if (Q === "ansi256") return TT[B].ansi256(TT.rgbToAnsi256(...G));
      return TT[B].ansi(TT.rgbToAnsi(...G))
    }
    if (A === "hex") return dT1("rgb", Q, B, ...TT.hexToRgb(...G));
    return TT[B][A](...G)
  }
// @from(Ln 68130, Col 2)
Rm4
// @from(Ln 68130, Col 7)
_m4
// @from(Ln 68130, Col 12)
cT1 = (A, Q, B) => {
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
// @from(Ln 68142, Col 2)
pnA = (A, Q, B) => {
    let G = (...Z) => jm4(G, Z.length === 1 ? "" + Z[0] : Z.join(" "));
    return Object.setPrototypeOf(G, _m4), G[mT1] = A, G[OZA] = Q, G[ANA] = B, G
  }
// @from(Ln 68146, Col 2)
jm4 = (A, Q) => {
    if (A.level <= 0 || !Q) return A[ANA] ? "" : Q;
    let B = A[OZA];
    if (B === void 0) return Q;
    let {
      openAll: G,
      closeAll: Z
    } = B;
    if (Q.includes("\x1B"))
      while (B !== void 0) Q = HEQ(Q, B.close, B.open), B = B.parent;
    let Y = Q.indexOf(`
`);
    if (Y !== -1) Q = EEQ(Q, Z, G, Y);
    return G + Q + Z
  }
// @from(Ln 68161, Col 2)
Tm4
// @from(Ln 68161, Col 7)
_3G
// @from(Ln 68161, Col 12)
I1
// @from(Ln 68162, Col 4)
Z3 = w(() => {
  DEQ();
  FEQ();
  ({
    stdout: zEQ,
    stderr: $EQ
  } = VEQ), mT1 = Symbol("GENERATOR"), OZA = Symbol("STYLER"), ANA = Symbol("IS_EMPTY"), CEQ = ["ansi", "ansi", "ansi256", "ansi16m"], MZA = Object.create(null);
  Object.setPrototypeOf(QNA.prototype, Function.prototype);
  for (let [A, Q] of Object.entries(TT)) MZA[A] = {
    get() {
      let B = pnA(this, cT1(Q.open, Q.close, this[OZA]), this[ANA]);
      return Object.defineProperty(this, A, {
        value: B
      }), B
    }
  };
  MZA.visible = {
    get() {
      let A = pnA(this, this[OZA], !0);
      return Object.defineProperty(this, "visible", {
        value: A
      }), A
    }
  };
  Rm4 = ["rgb", "hex", "ansi256"];
  for (let A of Rm4) {
    MZA[A] = {
      get() {
        let {
          level: B
        } = this;
        return function (...G) {
          let Z = cT1(dT1(A, CEQ[B], "color", ...G), TT.color.close, this[OZA]);
          return pnA(this, Z, this[ANA])
        }
      }
    };
    let Q = "bg" + A[0].toUpperCase() + A.slice(1);
    MZA[Q] = {
      get() {
        let {
          level: B
        } = this;
        return function (...G) {
          let Z = cT1(dT1(A, CEQ[B], "bgColor", ...G), TT.bgColor.close, this[OZA]);
          return pnA(this, Z, this[ANA])
        }
      }
    }
  }
  _m4 = Object.defineProperties(() => {}, {
    ...MZA,
    level: {
      enumerable: !0,
      get() {
        return this[mT1].level
      },
      set(A) {
        this[mT1].level = A
      }
    }
  });
  Object.defineProperties(QNA.prototype, MZA);
  Tm4 = QNA(), _3G = QNA({
    level: $EQ ? $EQ.level : 0
  }), I1 = Tm4
})
// @from(Ln 68230, Col 0)
function qEQ(A, Q) {
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
      let Y = Q.update(B);
      if (Y.success) return {
        success: !0,
        warning: Y.warning
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
// @from(Ln 68268, Col 0)
function yi(A = "") {
  let Q = zQ(),
    G = !process.env.CLAUDE_CONFIG_DIR ? "" : `-${Pm4("sha256").update(Q).digest("hex").substring(0,8)}`;
  return `Claude Code${v9().OAUTH_FILE_SUFFIX}${A}${G}`
}
// @from(Ln 68274, Col 0)
function BNA() {
  try {
    return process.env.USER || Sm4().username
  } catch {
    return "claude-code-user"
  }
}
// @from(Ln 68282, Col 0)
function vi() {
  o1A = {
    data: null,
    valid: !1
  }
}
// @from(Ln 68289, Col 0)
function wEQ() {
  if (process.platform !== "darwin") return !1;
  try {
    return BGA("security", ["show-keychain-info"], {
      reject: !1,
      stdio: ["ignore", "pipe", "pipe"]
    }).exitCode === 36
  } catch {
    return !1
  }
}
// @from(Ln 68300, Col 4)
o1A
// @from(Ln 68300, Col 9)
NEQ
// @from(Ln 68301, Col 4)
GNA = w(() => {
  oL1();
  fQ();
  JX();
  Vq();
  A0();
  o1A = {
    data: null,
    valid: !1
  };
  NEQ = {
    name: "keychain",
    read() {
      if (o1A.valid) return o1A.data;
      try {
        let A = yi("-credentials"),
          Q = BNA(),
          B = NH(`security find-generic-password -a "${Q}" -w -s "${A}"`);
        if (B) {
          let G = AQ(B);
          return o1A = {
            data: G,
            valid: !0
          }, G
        }
      } catch (A) {
        return o1A = {
          data: null,
          valid: !0
        }, null
      }
      return o1A = {
        data: null,
        valid: !0
      }, null
    },
    update(A) {
      vi();
      try {
        let Q = yi("-credentials"),
          B = BNA(),
          G = eA(A),
          Z = Buffer.from(G, "utf-8").toString("hex"),
          Y = `add-generic-password -U -a "${B}" -s "${Q}" -X "${Z}"
`;
        if (BGA("security", ["-i"], {
            input: Y,
            stdio: ["pipe", "pipe", "pipe"],
            reject: !1
          }).exitCode !== 0) return {
          success: !1
        };
        return o1A = {
          data: A,
          valid: !0
        }, {
          success: !0
        }
      } catch (Q) {
        return {
          success: !1
        }
      }
    },
    delete() {
      vi();
      try {
        let A = yi("-credentials"),
          Q = BNA();
        return NH(`security delete-generic-password -a "${Q}" -s "${A}"`), !0
      } catch (A) {
        return !1
      }
    }
  }
})
// @from(Ln 68384, Col 0)
function lT1() {
  let A = zQ(),
    Q = ".credentials.json";
  return {
    storageDir: A,
    storagePath: xm4(A, ".credentials.json")
  }
}
// @from(Ln 68392, Col 4)
iT1
// @from(Ln 68393, Col 4)
LEQ = w(() => {
  DQ();
  fQ();
  A0();
  A0();
  iT1 = {
    name: "plaintext",
    read() {
      let {
        storagePath: A
      } = lT1();
      if (vA().existsSync(A)) try {
        let Q = vA().readFileSync(A, {
          encoding: "utf8"
        });
        return AQ(Q)
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
        } = lT1();
        if (!vA().existsSync(Q)) vA().mkdirSync(Q);
        return bB(B, eA(A), {
          encoding: "utf8",
          flush: !1
        }), ym4(B, 384), {
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
      } = lT1();
      if (vA().existsSync(A)) try {
        return vA().unlinkSync(A), !0
      } catch (Q) {
        return !1
      }
      return !0
    }
  }
})
// @from(Ln 68448, Col 0)
function ZL() {
  if (process.platform === "darwin") return qEQ(NEQ, iT1);
  return iT1
}
// @from(Ln 68452, Col 4)
lnA = w(() => {
  GNA();
  LEQ()
})
// @from(Ln 68457, Col 0)
function nT1() {
  let A = ib0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR;
  if (!Q) return Q7A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return k(`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), Q7A(null), null;
  try {
    let G = vA(),
      Z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${B}` : `/proc/self/fd/${B}`,
      Y = G.readFileSync(Z, {
        encoding: "utf8"
      }).trim();
    if (!Y) return k("File descriptor contained empty OAuth token", {
      level: "error"
    }), Q7A(null), null;
    return k(`Successfully read OAuth token from file descriptor ${B}`), Q7A(Y), Y
  } catch (G) {
    return k(`Failed to read OAuth token from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), Q7A(null), null
  }
}
// @from(Ln 68483, Col 0)
function aT1() {
  let A = nb0();
  if (A !== void 0) return A;
  let Q = process.env.CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR;
  if (!Q) return B7A(null), null;
  let B = parseInt(Q, 10);
  if (Number.isNaN(B)) return k(`CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${Q}`, {
    level: "error"
  }), B7A(null), null;
  try {
    let G = vA(),
      Z = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${B}` : `/proc/self/fd/${B}`,
      Y = G.readFileSync(Z, {
        encoding: "utf8"
      }).trim();
    if (!Y) return k("File descriptor contained empty API key", {
      level: "error"
    }), B7A(null), null;
    return k(`Successfully read API key from file descriptor ${B}`), B7A(Y), Y
  } catch (G) {
    return k(`Failed to read API key from file descriptor ${B}: ${G instanceof Error?G.message:String(G)}`, {
      level: "error"
    }), B7A(null), null
  }
}
// @from(Ln 68508, Col 4)
OEQ = w(() => {
  T1();
  DQ();
  C0()
})
// @from(Ln 68513, Col 0)
async function inA() {
  let Q = L1().oauthAccount?.accountUuid,
    B = YL();
  if (!Q || !B) return;
  let G = `${v9().BASE_API_URL}/api/claude_cli_profile`;
  try {
    return (await xQ.get(G, {
      headers: {
        "x-api-key": B,
        "anthropic-beta": zi
      },
      params: {
        account_uuid: Q
      }
    })).data
  } catch (Z) {
    e(Z)
  }
}
// @from(Ln 68532, Col 0)
async function RZA(A) {
  let Q = `${v9().BASE_API_URL}/api/oauth/profile`;
  try {
    return (await xQ.get(Q, {
      headers: {
        Authorization: `Bearer ${A}`,
        "Content-Type": "application/json"
      }
    })).data
  } catch (B) {
    e(B)
  }
}
// @from(Ln 68545, Col 4)
ZNA = w(() => {
  j5();
  JX();
  Q2();
  GQ();
  v1()
})
// @from(Ln 68553, Col 0)
function xg(A) {
  return Boolean(A?.includes(PGA))
}
// @from(Ln 68557, Col 0)
function nnA(A) {
  return A?.split(" ").filter(Boolean) ?? []
}
// @from(Ln 68561, Col 0)
function oT1({
  codeChallenge: A,
  state: Q,
  port: B,
  isManual: G,
  loginWithClaudeAi: Z,
  inferenceOnly: Y,
  orgUUID: J
}) {
  let X = Z ? v9().CLAUDE_AI_AUTHORIZE_URL : v9().CONSOLE_AUTHORIZE_URL,
    I = new URL(X);
  I.searchParams.append("code", "true"), I.searchParams.append("client_id", v9().CLIENT_ID), I.searchParams.append("response_type", "code"), I.searchParams.append("redirect_uri", G ? v9().MANUAL_REDIRECT_URL : `http://localhost:${B}/callback`);
  let D = Y ? [PGA] : g5Q;
  if (I.searchParams.append("scope", D.join(" ")), I.searchParams.append("code_challenge", A), I.searchParams.append("code_challenge_method", "S256"), I.searchParams.append("state", Q), J) I.searchParams.append("orgUUID", J);
  return I.toString()
}
// @from(Ln 68577, Col 0)
async function MEQ(A, Q, B, G, Z = !1, Y) {
  let J = {
    grant_type: "authorization_code",
    code: A,
    redirect_uri: Z ? v9().MANUAL_REDIRECT_URL : `http://localhost:${G}/callback`,
    client_id: v9().CLIENT_ID,
    code_verifier: B,
    state: Q
  };
  if (Y !== void 0) J.expires_in = Y;
  let X = await xQ.post(v9().TOKEN_URL, J, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (X.status !== 200) throw Error(X.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${X.status}): ${X.statusText}`);
  return l("tengu_oauth_token_exchange_success", {}), X.data
}
// @from(Ln 68595, Col 0)
async function rT1(A) {
  let Q = {
    grant_type: "refresh_token",
    refresh_token: A,
    client_id: v9().CLIENT_ID,
    scope: HR1.join(" ")
  };
  try {
    let B = await xQ.post(v9().TOKEN_URL, Q, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (B.status !== 200) throw Error(`Token refresh failed: ${B.statusText}`);
    let G = B.data,
      {
        access_token: Z,
        refresh_token: Y = A,
        expires_in: J
      } = G,
      X = Date.now() + J * 1000,
      I = nnA(G.scope);
    l("tengu_oauth_token_refresh_success", {});
    let D = await sT1(Z);
    if (L1().oauthAccount) {
      let K = {};
      if (D.displayName !== void 0) K.displayName = D.displayName;
      if (typeof D.hasExtraUsageEnabled === "boolean") K.hasExtraUsageEnabled = D.hasExtraUsageEnabled;
      if (Object.keys(K).length > 0) S0((V) => ({
        ...V,
        oauthAccount: V.oauthAccount ? {
          ...V.oauthAccount,
          ...K
        } : V.oauthAccount
      }))
    }
    return {
      accessToken: Z,
      refreshToken: Y,
      expiresAt: X,
      scopes: I,
      subscriptionType: D.subscriptionType,
      rateLimitTier: D.rateLimitTier
    }
  } catch (B) {
    throw l("tengu_oauth_token_refresh_failure", {
      error: B.message
    }), B
  }
}
// @from(Ln 68645, Col 0)
async function REQ(A) {
  let Q = await xQ.get(v9().ROLES_URL, {
    headers: {
      Authorization: `Bearer ${A}`
    }
  });
  if (Q.status !== 200) throw Error(`Failed to fetch user roles: ${Q.statusText}`);
  let B = Q.data;
  if (!L1().oauthAccount) throw Error("OAuth account information not found in config");
  S0((Z) => ({
    ...Z,
    oauthAccount: Z.oauthAccount ? {
      ...Z.oauthAccount,
      organizationRole: B.organization_role,
      workspaceRole: B.workspace_role,
      organizationName: B.organization_name
    } : Z.oauthAccount
  })), l("tengu_oauth_roles_stored", {
    org_role: B.organization_role
  })
}
// @from(Ln 68666, Col 0)
async function _EQ(A) {
  try {
    let Q = await xQ.post(v9().API_KEY_URL, null, {
        headers: {
          Authorization: `Bearer ${A}`
        }
      }),
      B = Q.data?.raw_key;
    if (B) return await TEQ(B), l("tengu_oauth_api_key", {
      status: "success",
      statusCode: Q.status
    }), B;
    return null
  } catch (Q) {
    throw l("tengu_oauth_api_key", {
      status: "failure",
      error: Q instanceof Error ? Q.message : String(Q)
    }), Q
  }
}
// @from(Ln 68687, Col 0)
function yg(A) {
  if (A === null) return !1;
  let Q = 300000;
  return Date.now() + Q >= A
}
// @from(Ln 68692, Col 0)
async function sT1(A) {
  let Q = await RZA(A),
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
  return l("tengu_oauth_profile_fetch_success", {}), Z
}
// @from(Ln 68721, Col 0)
async function Wv() {
  let Q = L1().oauthAccount?.organizationUuid;
  if (Q) return Q;
  let B = g4()?.accessToken;
  if (B === void 0) return null;
  let Z = (await RZA(B))?.organization?.uuid;
  if (!Z) return null;
  return Z
}
// @from(Ln 68730, Col 0)
async function jEQ() {
  if (L1().oauthAccount || !qB()) return !1;
  let Q = g4();
  if (Q?.accessToken) {
    let B = await RZA(Q.accessToken);
    if (B) return tT1({
      accountUuid: B.account.uuid,
      emailAddress: B.account.email,
      organizationUuid: B.organization.uuid,
      displayName: B.account.display_name || void 0,
      hasExtraUsageEnabled: B.organization.has_extra_usage_enabled ?? !1,
      billingType: B.organization.billing_type ?? void 0
    }), !0
  }
  return !1
}
// @from(Ln 68747, Col 0)
function tT1({
  accountUuid: A,
  emailAddress: Q,
  organizationUuid: B,
  displayName: G,
  hasExtraUsageEnabled: Z,
  billingType: Y
}) {
  let J = {
    accountUuid: A,
    emailAddress: Q,
    organizationUuid: B,
    hasExtraUsageEnabled: Z,
    billingType: Y
  };
  if (G) J.displayName = G;
  S0((X) => {
    if (X.oauthAccount?.accountUuid === J.accountUuid && X.oauthAccount?.emailAddress === J.emailAddress && X.oauthAccount?.organizationUuid === J.organizationUuid && X.oauthAccount?.displayName === J.displayName && X.oauthAccount?.hasExtraUsageEnabled === J.hasExtraUsageEnabled) return X;
    return {
      ...X,
      oauthAccount: J
    }
  })
}
// @from(Ln 68771, Col 4)
JL = w(() => {
  j5();
  JX();
  Z0();
  GQ();
  Q2();
  ZNA()
})
// @from(Ln 68780, Col 0)
function SEQ() {
  return null
}
// @from(Ln 68784, Col 0)
function xEQ(A) {
  let Q = SEQ();
  if (!Q) return A;
  let B = new globalThis.Headers(A);
  return Object.entries(Q).forEach(([G, Z]) => {
    if (Z !== void 0) B.set(G, Z)
  }), B
}
// @from(Ln 68793, Col 0)
function _ZA() {
  return anA && !1
}
// @from(Ln 68797, Col 0)
function yEQ() {
  return null
}
// @from(Ln 68801, Col 0)
function vEQ() {
  return anA && PEQ !== null && !1
}
// @from(Ln 68804, Col 4)
km4
// @from(Ln 68804, Col 9)
anA = !1
// @from(Ln 68805, Col 2)
PEQ = null
// @from(Ln 68806, Col 2)
bm4 = "max"
// @from(Ln 68807, Col 4)
onA = w(() => {
  GQ();
  km4 = {}
})
// @from(Ln 68812, Col 0)
function R4() {
  return a1(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" : a1(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" : a1(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" : "firstParty"
}
// @from(Ln 68816, Col 0)
function PT() {
  return R4()
}
// @from(Ln 68820, Col 0)
function kEQ() {
  let A = process.env.ANTHROPIC_BASE_URL;
  if (!A) return !0;
  try {
    let Q = new URL(A).host;
    return ["api.anthropic.com"].includes(Q)
  } catch {
    return !1
  }
}
// @from(Ln 68830, Col 4)
MD = w(() => {
  fQ()
})
// @from(Ln 68833, Col 4)
Yz = U((bEQ) => {
  Object.defineProperty(bEQ, "__esModule", {
    value: !0
  });
  bEQ.Log = bEQ.LogLevel = void 0;
  var fm4 = " DEBUG ",
    hm4 = "  INFO ",
    gm4 = "  WARN ",
    um4 = " ERROR ";

  function rnA(A) {
    return A.unshift("[Statsig]"), A
  }
  bEQ.LogLevel = {
    None: 0,
    Error: 1,
    Warn: 2,
    Info: 3,
    Debug: 4
  };
  class r1A {
    static info(...A) {
      if (r1A.level >= bEQ.LogLevel.Info) console.info(hm4, ...rnA(A))
    }
    static debug(...A) {
      if (r1A.level >= bEQ.LogLevel.Debug) console.debug(fm4, ...rnA(A))
    }
    static warn(...A) {
      if (r1A.level >= bEQ.LogLevel.Warn) console.warn(gm4, ...rnA(A))
    }
    static error(...A) {
      if (r1A.level >= bEQ.LogLevel.Error) console.error(um4, ...rnA(A))
    }
  }
  bEQ.Log = r1A;
  r1A.level = bEQ.LogLevel.Warn
})
// @from(Ln 68870, Col 4)
s1A = U((mEQ) => {
  var eT1, AP1, QP1;
  Object.defineProperty(mEQ, "__esModule", {
    value: !0
  });
  mEQ._getInstance = mEQ._getStatsigGlobalFlag = mEQ._getStatsigGlobal = void 0;
  var mm4 = Yz(),
    dm4 = () => {
      return __STATSIG__ ? __STATSIG__ : snA
    };
  mEQ._getStatsigGlobal = dm4;
  var cm4 = (A) => {
    return mEQ._getStatsigGlobal()[A]
  };
  mEQ._getStatsigGlobalFlag = cm4;
  var pm4 = (A) => {
    let Q = mEQ._getStatsigGlobal();
    if (!A) {
      if (Q.instances && Object.keys(Q.instances).length > 1) mm4.Log.warn("Call made to Statsig global instance without an SDK key but there is more than one client instance. If you are using mulitple clients, please specify the SDK key.");
      return Q.firstInstance
    }
    return Q.instances && Q.instances[A]
  };
  mEQ._getInstance = pm4;
  var TZA = "__STATSIG__",
    hEQ = typeof window < "u" ? window : {},
    gEQ = typeof global < "u" ? global : {},
    uEQ = typeof globalThis < "u" ? globalThis : {},
    snA = (QP1 = (AP1 = (eT1 = hEQ[TZA]) !== null && eT1 !== void 0 ? eT1 : gEQ[TZA]) !== null && AP1 !== void 0 ? AP1 : uEQ[TZA]) !== null && QP1 !== void 0 ? QP1 : {
      instance: mEQ._getInstance
    };
  hEQ[TZA] = snA;
  gEQ[TZA] = snA;
  uEQ[TZA] = snA
})
// @from(Ln 68905, Col 4)
enA = U((dEQ) => {
  Object.defineProperty(dEQ, "__esModule", {
    value: !0
  });
  dEQ.Diagnostics = void 0;
  var tnA = new Map,
    ZP1 = "start",
    YP1 = "end",
    im4 = "statsig::diagnostics";
  dEQ.Diagnostics = {
    _getMarkers: (A) => {
      return tnA.get(A)
    },
    _markInitOverallStart: (A) => {
      SZA(A, PZA({}, ZP1, "overall"))
    },
    _markInitOverallEnd: (A, Q, B) => {
      SZA(A, PZA({
        success: Q,
        error: Q ? void 0 : {
          name: "InitializeError",
          message: "Failed to initialize"
        },
        evaluationDetails: B
      }, YP1, "overall"))
    },
    _markInitNetworkReqStart: (A, Q) => {
      SZA(A, PZA(Q, ZP1, "initialize", "network_request"))
    },
    _markInitNetworkReqEnd: (A, Q) => {
      SZA(A, PZA(Q, YP1, "initialize", "network_request"))
    },
    _markInitProcessStart: (A) => {
      SZA(A, PZA({}, ZP1, "initialize", "process"))
    },
    _markInitProcessEnd: (A, Q) => {
      SZA(A, PZA(Q, YP1, "initialize", "process"))
    },
    _clearMarkers: (A) => {
      tnA.delete(A)
    },
    _formatError(A) {
      if (!(A && typeof A === "object")) return;
      return {
        code: JP1(A, "code"),
        name: JP1(A, "name"),
        message: JP1(A, "message")
      }
    },
    _getDiagnosticsData(A, Q, B, G) {
      var Z;
      return {
        success: (A === null || A === void 0 ? void 0 : A.ok) === !0,
        statusCode: A === null || A === void 0 ? void 0 : A.status,
        sdkRegion: (Z = A === null || A === void 0 ? void 0 : A.headers) === null || Z === void 0 ? void 0 : Z.get("x-statsig-region"),
        isDelta: B.includes('"is_delta":true') === !0 ? !0 : void 0,
        attempt: Q,
        error: dEQ.Diagnostics._formatError(G)
      }
    },
    _enqueueDiagnosticsEvent(A, Q, B, G) {
      let Z = dEQ.Diagnostics._getMarkers(B);
      if (Z == null || Z.length <= 0) return -1;
      let Y = Z[Z.length - 1].timestamp - Z[0].timestamp;
      dEQ.Diagnostics._clearMarkers(B);
      let J = nm4(A, {
        context: "initialize",
        markers: Z.slice(),
        statsigOptions: G
      });
      return Q.enqueue(J), Y
    }
  };

  function PZA(A, Q, B, G) {
    return Object.assign({
      key: B,
      action: Q,
      step: G,
      timestamp: Date.now()
    }, A)
  }

  function nm4(A, Q) {
    return {
      eventName: im4,
      user: A,
      value: null,
      metadata: Q,
      time: Date.now()
    }
  }

  function SZA(A, Q) {
    var B;
    let G = (B = tnA.get(A)) !== null && B !== void 0 ? B : [];
    G.push(Q), tnA.set(A, G)
  }

  function JP1(A, Q) {
    if (Q in A) return A[Q];
    return
  }
})
// @from(Ln 69009, Col 4)
AaA = U((cEQ) => {
  Object.defineProperty(cEQ, "__esModule", {
    value: !0
  });
  cEQ._isTypeMatch = cEQ._typeOf = void 0;

  function am4(A) {
    return Array.isArray(A) ? "array" : typeof A
  }
  cEQ._typeOf = am4;

  function om4(A, Q) {
    let B = (G) => Array.isArray(G) ? "array" : typeof G;
    return B(A) === B(Q)
  }
  cEQ._isTypeMatch = om4
})
// @from(Ln 69026, Col 4)
xZA = U((lEQ) => {
  Object.defineProperty(lEQ, "__esModule", {
    value: !0
  });
  lEQ._getSortedObject = lEQ._DJB2Object = lEQ._DJB2 = void 0;
  var sm4 = AaA(),
    tm4 = (A) => {
      let Q = 0;
      for (let B = 0; B < A.length; B++) {
        let G = A.charCodeAt(B);
        Q = (Q << 5) - Q + G, Q = Q & Q
      }
      return String(Q >>> 0)
    };
  lEQ._DJB2 = tm4;
  var em4 = (A, Q) => {
    return lEQ._DJB2(JSON.stringify(lEQ._getSortedObject(A, Q)))
  };
  lEQ._DJB2Object = em4;
  var Ad4 = (A, Q) => {
    if (A == null) return null;
    let B = Object.keys(A).sort(),
      G = {};
    return B.forEach((Z) => {
      let Y = A[Z];
      if (Q === 0 || (0, sm4._typeOf)(Y) !== "object") {
        G[Z] = Y;
        return
      }
      G[Z] = lEQ._getSortedObject(Y, Q != null ? Q - 1 : Q)
    }), G
  };
  lEQ._getSortedObject = Ad4
})
// @from(Ln 69060, Col 4)
JNA = U((oEQ) => {
  Object.defineProperty(oEQ, "__esModule", {
    value: !0
  });
  oEQ._getStorageKey = oEQ._getUserStorageKey = void 0;
  var nEQ = xZA();

  function aEQ(A, Q, B) {
    var G;
    if (B) return B(A, Q);
    let Z = Q && Q.customIDs ? Q.customIDs : {},
      Y = [`uid:${(G=Q===null||Q===void 0?void 0:Q.userID)!==null&&G!==void 0?G:""}`, `cids:${Object.keys(Z).sort((J,X)=>J.localeCompare(X)).map((J)=>`${J}-${Z[J]}`).join(",")}`, `k:${A}`];
    return (0, nEQ._DJB2)(Y.join("|"))
  }
  oEQ._getUserStorageKey = aEQ;

  function Bd4(A, Q, B) {
    if (Q) return aEQ(A, Q, B);
    return (0, nEQ._DJB2)(`k:${A}`)
  }
  oEQ._getStorageKey = Bd4
})
// @from(Ln 69082, Col 4)
XNA = U((sEQ) => {
  Object.defineProperty(sEQ, "__esModule", {
    value: !0
  });
  sEQ.NetworkParam = sEQ.NetworkDefault = sEQ.Endpoint = void 0;
  sEQ.Endpoint = {
    _initialize: "initialize",
    _rgstr: "rgstr",
    _download_config_specs: "download_config_specs"
  };
  sEQ.NetworkDefault = {
    [sEQ.Endpoint._rgstr]: "https://prodregistryv2.org/v1",
    [sEQ.Endpoint._initialize]: "https://featureassets.org/v1",
    [sEQ.Endpoint._download_config_specs]: "https://api.statsigcdn.com/v1"
  };
  sEQ.NetworkParam = {
    EventCount: "ec",
    SdkKey: "k",
    SdkType: "st",
    SdkVersion: "sv",
    Time: "t",
    SessionID: "sid",
    StatsigEncoded: "se",
    IsGzipped: "gz"
  }
})
// @from(Ln 69108, Col 4)
t1A = U((eEQ) => {
  Object.defineProperty(eEQ, "__esModule", {
    value: !0
  });
  eEQ._getCurrentPageUrlSafe = eEQ._addDocumentEventListenerSafe = eEQ._addWindowEventListenerSafe = eEQ._isServerEnv = eEQ._getDocumentSafe = eEQ._getWindowSafe = void 0;
  var Yd4 = () => {
    return typeof window < "u" ? window : null
  };
  eEQ._getWindowSafe = Yd4;
  var Jd4 = () => {
    var A;
    let Q = eEQ._getWindowSafe();
    return (A = Q === null || Q === void 0 ? void 0 : Q.document) !== null && A !== void 0 ? A : null
  };
  eEQ._getDocumentSafe = Jd4;
  var Xd4 = () => {
    if (eEQ._getDocumentSafe() !== null) return !1;
    let A = typeof process < "u" && process.versions != null && process.versions.node != null;
    return typeof EdgeRuntime === "string" || A
  };
  eEQ._isServerEnv = Xd4;
  var Id4 = (A, Q) => {
    let B = eEQ._getWindowSafe();
    if (typeof (B === null || B === void 0 ? void 0 : B.addEventListener) === "function") B.addEventListener(A, Q)
  };
  eEQ._addWindowEventListenerSafe = Id4;
  var Dd4 = (A, Q) => {
    let B = eEQ._getDocumentSafe();
    if (typeof (B === null || B === void 0 ? void 0 : B.addEventListener) === "function") B.addEventListener(A, Q)
  };
  eEQ._addDocumentEventListenerSafe = Dd4;
  var Wd4 = () => {
    var A;
    try {
      return (A = eEQ._getWindowSafe()) === null || A === void 0 ? void 0 : A.location.href.split(/[?#]/)[0]
    } catch (Q) {
      return
    }
  };
  eEQ._getCurrentPageUrlSafe = Wd4
})
// @from(Ln 69149, Col 4)
DP1 = U((ZzQ) => {
  Object.defineProperty(ZzQ, "__esModule", {
    value: !0
  });
  ZzQ._createLayerParameterExposure = ZzQ._createConfigExposure = ZzQ._mapExposures = ZzQ._createGateExposure = ZzQ._isExposureEvent = void 0;
  var QzQ = "statsig::config_exposure",
    BzQ = "statsig::gate_exposure",
    GzQ = "statsig::layer_exposure",
    IP1 = (A, Q, B, G, Z) => {
      if (B.bootstrapMetadata) G.bootstrapMetadata = B.bootstrapMetadata;
      return {
        eventName: A,
        user: Q,
        value: null,
        metadata: Cd4(B, G),
        secondaryExposures: Z,
        time: Date.now()
      }
    },
    Hd4 = ({
      eventName: A
    }) => {
      return A === BzQ || A === QzQ || A === GzQ
    };
  ZzQ._isExposureEvent = Hd4;
  var Ed4 = (A, Q, B) => {
    var G, Z, Y;
    let J = {
      gate: Q.name,
      gateValue: String(Q.value),
      ruleID: Q.ruleID
    };
    if (((G = Q.__evaluation) === null || G === void 0 ? void 0 : G.version) != null) J.configVersion = Q.__evaluation.version;
    return IP1(BzQ, A, Q.details, J, ZaA((Y = (Z = Q.__evaluation) === null || Z === void 0 ? void 0 : Z.secondary_exposures) !== null && Y !== void 0 ? Y : [], B))
  };
  ZzQ._createGateExposure = Ed4;

  function ZaA(A, Q) {
    return A.map((B) => {
      if (typeof B === "string") return (Q !== null && Q !== void 0 ? Q : {})[B];
      return B
    }).filter((B) => B != null)
  }
  ZzQ._mapExposures = ZaA;
  var zd4 = (A, Q, B) => {
    var G, Z, Y, J;
    let X = {
      config: Q.name,
      ruleID: Q.ruleID
    };
    if (((G = Q.__evaluation) === null || G === void 0 ? void 0 : G.version) != null) X.configVersion = Q.__evaluation.version;
    if (((Z = Q.__evaluation) === null || Z === void 0 ? void 0 : Z.passed) != null) X.rulePassed = String(Q.__evaluation.passed);
    return IP1(QzQ, A, Q.details, X, ZaA((J = (Y = Q.__evaluation) === null || Y === void 0 ? void 0 : Y.secondary_exposures) !== null && J !== void 0 ? J : [], B))
  };
  ZzQ._createConfigExposure = zd4;
  var $d4 = (A, Q, B, G) => {
    var Z, Y, J, X;
    let I = Q.__evaluation,
      D = ((Z = I === null || I === void 0 ? void 0 : I.explicit_parameters) === null || Z === void 0 ? void 0 : Z.includes(B)) === !0,
      W = "",
      K = (Y = I === null || I === void 0 ? void 0 : I.undelegated_secondary_exposures) !== null && Y !== void 0 ? Y : [];
    if (D) W = (J = I.allocated_experiment_name) !== null && J !== void 0 ? J : "", K = I.secondary_exposures;
    let V = {
      config: Q.name,
      parameterName: B,
      ruleID: Q.ruleID,
      allocatedExperiment: W,
      isExplicitParameter: String(D)
    };
    if (((X = Q.__evaluation) === null || X === void 0 ? void 0 : X.version) != null) V.configVersion = Q.__evaluation.version;
    return IP1(GzQ, A, Q.details, V, ZaA(K, G))
  };
  ZzQ._createLayerParameterExposure = $d4;
  var Cd4 = (A, Q) => {
    if (Q.reason = A.reason, A.lcut) Q.lcut = String(A.lcut);
    if (A.receivedAt) Q.receivedAt = String(A.receivedAt);
    return Q
  }
})
// @from(Ln 69228, Col 4)
vg = U((JzQ) => {
  Object.defineProperty(JzQ, "__esModule", {
    value: !0
  });
  JzQ._setObjectInStorage = JzQ._getObjectFromStorage = JzQ.Storage = void 0;
  var Ld4 = Yz(),
    Od4 = t1A(),
    INA = {},
    KP1 = {
      isReady: () => !0,
      isReadyResolver: () => null,
      getProviderName: () => "InMemory",
      getItem: (A) => INA[A] ? INA[A] : null,
      setItem: (A, Q) => {
        INA[A] = Q
      },
      removeItem: (A) => {
        delete INA[A]
      },
      getAllKeys: () => Object.keys(INA)
    },
    YaA = null;
  try {
    let A = (0, Od4._getWindowSafe)();
    if (A && A.localStorage && typeof A.localStorage.getItem === "function") YaA = {
      isReady: () => !0,
      isReadyResolver: () => null,
      getProviderName: () => "LocalStorage",
      getItem: (Q) => A.localStorage.getItem(Q),
      setItem: (Q, B) => A.localStorage.setItem(Q, B),
      removeItem: (Q) => A.localStorage.removeItem(Q),
      getAllKeys: () => Object.keys(A.localStorage)
    }
  } catch (A) {
    Ld4.Log.warn("Failed to setup localStorageProvider.")
  }
  var WP1 = YaA !== null && YaA !== void 0 ? YaA : KP1,
    Kv = WP1;

  function Md4(A) {
    try {
      return A()
    } catch (Q) {
      if (Q instanceof Error && Q.name === "SecurityError") return JzQ.Storage._setProvider(KP1), null;
      throw Q
    }
  }
  JzQ.Storage = {
    isReady: () => Kv.isReady(),
    isReadyResolver: () => Kv.isReadyResolver(),
    getProviderName: () => Kv.getProviderName(),
    getItem: (A) => Md4(() => Kv.getItem(A)),
    setItem: (A, Q) => Kv.setItem(A, Q),
    removeItem: (A) => Kv.removeItem(A),
    getAllKeys: () => Kv.getAllKeys(),
    _setProvider: (A) => {
      WP1 = A, Kv = A
    },
    _setDisabled: (A) => {
      if (A) Kv = KP1;
      else Kv = WP1
    }
  };

  function Rd4(A) {
    let Q = JzQ.Storage.getItem(A);
    return JSON.parse(Q !== null && Q !== void 0 ? Q : "null")
  }
  JzQ._getObjectFromStorage = Rd4;

  function _d4(A, Q) {
    JzQ.Storage.setItem(A, JSON.stringify(Q))
  }
  JzQ._setObjectInStorage = _d4
})
// @from(Ln 69303, Col 4)
VP1 = U((DzQ) => {
  Object.defineProperty(DzQ, "__esModule", {
    value: !0
  });
  DzQ.UrlConfiguration = void 0;
  var XaA = XNA(),
    Td4 = {
      [XaA.Endpoint._initialize]: "i",
      [XaA.Endpoint._rgstr]: "e",
      [XaA.Endpoint._download_config_specs]: "d"
    };
  class IzQ {
    constructor(A, Q, B, G) {
      if (this.customUrl = null, this.fallbackUrls = null, this.endpoint = A, this.endpointDnsKey = Td4[A], Q) this.customUrl = Q;
      if (!Q && B) this.customUrl = B.endsWith("/") ? `${B}${A}` : `${B}/${A}`;
      if (G) this.fallbackUrls = G;
      let Z = XaA.NetworkDefault[A];
      this.defaultUrl = `${Z}/${A}`
    }
    getUrl() {
      var A;
      return (A = this.customUrl) !== null && A !== void 0 ? A : this.defaultUrl
    }
  }
  DzQ.UrlConfiguration = IzQ
})
// @from(Ln 69329, Col 4)
WaA = U((VzQ) => {
  Object.defineProperty(VzQ, "__esModule", {
    value: !0
  });
  VzQ._notifyVisibilityChanged = VzQ._subscribeToVisiblityChanged = VzQ._isUnloading = VzQ._isCurrentlyVisible = void 0;
  var IaA = t1A(),
    DaA = "foreground",
    HP1 = "background",
    KzQ = [],
    FP1 = DaA,
    EP1 = !1,
    Pd4 = () => {
      return FP1 === DaA
    };
  VzQ._isCurrentlyVisible = Pd4;
  var Sd4 = () => EP1;
  VzQ._isUnloading = Sd4;
  var xd4 = (A) => {
    KzQ.unshift(A)
  };
  VzQ._subscribeToVisiblityChanged = xd4;
  var yd4 = (A) => {
    if (A === FP1) return;
    FP1 = A, KzQ.forEach((Q) => Q(A))
  };
  VzQ._notifyVisibilityChanged = yd4;
  (0, IaA._addWindowEventListenerSafe)("focus", () => {
    EP1 = !1, VzQ._notifyVisibilityChanged(DaA)
  });
  (0, IaA._addWindowEventListenerSafe)("blur", () => VzQ._notifyVisibilityChanged(HP1));
  (0, IaA._addWindowEventListenerSafe)("beforeunload", () => {
    EP1 = !0, VzQ._notifyVisibilityChanged(HP1)
  });
  (0, IaA._addDocumentEventListenerSafe)("visibilitychange", () => {
    VzQ._notifyVisibilityChanged(document.visibilityState === "visible" ? DaA : HP1)
  })
})
// @from(Ln 69366, Col 4)
$P1 = U((bZA) => {
  var vZA = bZA && bZA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(bZA, "__esModule", {
    value: !0
  });
  bZA.EventLogger = void 0;
  var fd4 = JNA(),
    hd4 = xZA(),
    DNA = Yz(),
    FzQ = XNA(),
    zP1 = t1A(),
    gd4 = DP1(),
    kZA = vg(),
    ud4 = VP1(),
    HzQ = WaA(),
    md4 = 100,
    dd4 = 1e4,
    cd4 = 1000,
    pd4 = 600000,
    ld4 = 500,
    EzQ = 200,
    WNA = {},
    KaA = {
      Startup: "startup",
      GainedFocus: "gained_focus"
    };
  class e1A {
    static _safeFlushAndForget(A) {
      var Q;
      (Q = WNA[A]) === null || Q === void 0 || Q.flush().catch(() => {})
    }
    static _safeRetryFailedLogs(A) {
      var Q;
      (Q = WNA[A]) === null || Q === void 0 || Q._retryFailedLogs(KaA.GainedFocus)
    }
    constructor(A, Q, B, G) {
      var Z;
      this._sdkKey = A, this._emitter = Q, this._network = B, this._options = G, this._queue = [], this._lastExposureTimeMap = {}, this._nonExposedChecks = {}, this._hasRunQuickFlush = !1, this._creationTime = Date.now(), this._isLoggingDisabled = (G === null || G === void 0 ? void 0 : G.disableLogging) === !0, this._maxQueueSize = (Z = G === null || G === void 0 ? void 0 : G.loggingBufferMaxSize) !== null && Z !== void 0 ? Z : md4;
      let Y = G === null || G === void 0 ? void 0 : G.networkConfig;
      this._logEventUrlConfig = new ud4.UrlConfiguration(FzQ.Endpoint._rgstr, Y === null || Y === void 0 ? void 0 : Y.logEventUrl, Y === null || Y === void 0 ? void 0 : Y.api, Y === null || Y === void 0 ? void 0 : Y.logEventFallbackUrls)
    }
    setLoggingDisabled(A) {
      this._isLoggingDisabled = A
    }
    enqueue(A) {
      if (!this._shouldLogEvent(A)) return;
      if (this._normalizeAndAppendEvent(A), this._quickFlushIfNeeded(), this._queue.length > this._maxQueueSize) e1A._safeFlushAndForget(this._sdkKey)
    }
    incrementNonExposureCount(A) {
      var Q;
      let B = (Q = this._nonExposedChecks[A]) !== null && Q !== void 0 ? Q : 0;
      this._nonExposedChecks[A] = B + 1
    }
    reset() {
      this._lastExposureTimeMap = {}
    }
    start() {
      if ((0, zP1._isServerEnv)()) return;
      WNA[this._sdkKey] = this, (0, HzQ._subscribeToVisiblityChanged)((A) => {
        if (A === "background") e1A._safeFlushAndForget(this._sdkKey);
        else if (A === "foreground") e1A._safeRetryFailedLogs(this._sdkKey)
      }), this._retryFailedLogs(KaA.Startup), this._startBackgroundFlushInterval()
    }
    stop() {
      return vZA(this, void 0, void 0, function* () {
        if (this._flushIntervalId) clearInterval(this._flushIntervalId), this._flushIntervalId = null;
        delete WNA[this._sdkKey], yield this.flush()
      })
    }
    flush() {
      return vZA(this, void 0, void 0, function* () {
        if (this._appendAndResetNonExposedChecks(), this._queue.length === 0) return;
        let A = this._queue;
        this._queue = [], yield this._sendEvents(A)
      })
    }
    _quickFlushIfNeeded() {
      if (this._hasRunQuickFlush) return;
      if (this._hasRunQuickFlush = !0, Date.now() - this._creationTime > EzQ) return;
      setTimeout(() => e1A._safeFlushAndForget(this._sdkKey), EzQ)
    }
    _shouldLogEvent(A) {
      if ((0, zP1._isServerEnv)()) return !1;
      if (!(0, gd4._isExposureEvent)(A)) return !0;
      let Q = A.user ? A.user : {
          statsigEnvironment: void 0
        },
        B = (0, fd4._getUserStorageKey)(this._sdkKey, Q),
        G = A.metadata ? A.metadata : {},
        Z = [A.eventName, B, G.gate, G.config, G.ruleID, G.allocatedExperiment, G.parameterName, String(G.isExplicitParameter), G.reason].join("|"),
        Y = this._lastExposureTimeMap[Z],
        J = Date.now();
      if (Y && J - Y < pd4) return !1;
      if (Object.keys(this._lastExposureTimeMap).length > cd4) this._lastExposureTimeMap = {};
      return this._lastExposureTimeMap[Z] = J, !0
    }
    _sendEvents(A) {
      var Q, B;
      return vZA(this, void 0, void 0, function* () {
        if (this._isLoggingDisabled) return this._saveFailedLogsToStorage(A), !1;
        try {
          let Z = (0, HzQ._isUnloading)() && this._network.isBeaconSupported() && ((B = (Q = this._options) === null || Q === void 0 ? void 0 : Q.networkConfig) === null || B === void 0 ? void 0 : B.networkOverrideFunc) == null;
          if (this._emitter({
              name: "pre_logs_flushed",
              events: A
            }), (Z ? yield this._sendEventsViaBeacon(A): yield this._sendEventsViaPost(A)).success) return this._emitter({
            name: "logs_flushed",
            events: A
          }), !0;
          else return DNA.Log.warn("Failed to flush events."), this._saveFailedLogsToStorage(A), !1
        } catch (G) {
          return DNA.Log.warn("Failed to flush events."), !1
        }
      })
    }
    _sendEventsViaPost(A) {
      var Q;
      return vZA(this, void 0, void 0, function* () {
        let B = yield this._network.post(this._getRequestData(A)), G = (Q = B === null || B === void 0 ? void 0 : B.code) !== null && Q !== void 0 ? Q : -1;
        return {
          success: G >= 200 && G < 300
        }
      })
    }
    _sendEventsViaBeacon(A) {
      return vZA(this, void 0, void 0, function* () {
        return {
          success: yield this._network.beacon(this._getRequestData(A))
        }
      })
    }
    _getRequestData(A) {
      return {
        sdkKey: this._sdkKey,
        data: {
          events: A
        },
        urlConfig: this._logEventUrlConfig,
        retries: 3,
        isCompressable: !0,
        params: {
          [FzQ.NetworkParam.EventCount]: String(A.length)
        }
      }
    }
    _saveFailedLogsToStorage(A) {
      while (A.length > ld4) A.shift();
      let Q = this._getStorageKey();
      try {
        (0, kZA._setObjectInStorage)(Q, A)
      } catch (B) {
        DNA.Log.warn("Unable to save failed logs to storage")
      }
    }
    _retryFailedLogs(A) {
      let Q = this._getStorageKey();
      (() => vZA(this, void 0, void 0, function* () {
        if (!kZA.Storage.isReady()) yield kZA.Storage.isReadyResolver();
        let B = (0, kZA._getObjectFromStorage)(Q);
        if (!B) return;
        if (A === KaA.Startup) kZA.Storage.removeItem(Q);
        if ((yield this._sendEvents(B)) && A === KaA.GainedFocus) kZA.Storage.removeItem(Q)
      }))().catch(() => {
        DNA.Log.warn("Failed to flush stored logs")
      })
    }
    _getStorageKey() {
      return `statsig.failed_logs.${(0,hd4._DJB2)(this._sdkKey)}`
    }
    _normalizeAndAppendEvent(A) {
      if (A.user) A.user = Object.assign({}, A.user), delete A.user.privateAttributes;
      let Q = {},
        B = this._getCurrentPageUrl();
      if (B) Q.statsigMetadata = {
        currentPage: B
      };
      let G = Object.assign(Object.assign({}, A), Q);
      DNA.Log.debug("Enqueued Event:", G), this._queue.push(G)
    }
    _appendAndResetNonExposedChecks() {
      if (Object.keys(this._nonExposedChecks).length === 0) return;
      this._normalizeAndAppendEvent({
        eventName: "statsig::non_exposed_checks",
        user: null,
        time: Date.now(),
        metadata: {
          checks: Object.assign({}, this._nonExposedChecks)
        }
      }), this._nonExposedChecks = {}
    }
    _getCurrentPageUrl() {
      var A;
      if (((A = this._options) === null || A === void 0 ? void 0 : A.includeCurrentPageUrlWithEvents) === !1) return;
      return (0, zP1._getCurrentPageUrlSafe)()
    }
    _startBackgroundFlushInterval() {
      var A, Q;
      let B = (Q = (A = this._options) === null || A === void 0 ? void 0 : A.loggingIntervalMs) !== null && Q !== void 0 ? Q : dd4,
        G = setInterval(() => {
          let Z = WNA[this._sdkKey];
          if (!Z || Z._flushIntervalId !== G) clearInterval(G);
          else e1A._safeFlushAndForget(this._sdkKey)
        }, B);
      this._flushIntervalId = G
    }
  }
  bZA.EventLogger = e1A
})
// @from(Ln 69602, Col 4)
KNA = U((zzQ) => {
  Object.defineProperty(zzQ, "__esModule", {
    value: !0
  });
  zzQ.StatsigMetadataProvider = zzQ.SDK_VERSION = void 0;
  zzQ.SDK_VERSION = "3.12.1";
  var CP1 = {
    sdkVersion: zzQ.SDK_VERSION,
    sdkType: "js-mono"
  };
  zzQ.StatsigMetadataProvider = {
    get: () => CP1,
    add: (A) => {
      CP1 = Object.assign(Object.assign({}, CP1), A)
    }
  }
})
// @from(Ln 69619, Col 4)
qzQ = U((UzQ) => {
  Object.defineProperty(UzQ, "__esModule", {
    value: !0
  })
})
// @from(Ln 69624, Col 4)
VaA = U((NzQ) => {
  Object.defineProperty(NzQ, "__esModule", {
    value: !0
  });
  NzQ.getUUID = void 0;

  function id4() {
    if (typeof crypto < "u" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    let A = new Date().getTime(),
      Q = typeof performance < "u" && performance.now && performance.now() * 1000 || 0;
    return `xxxxxxxx-xxxx-4xxx-${"89ab"[Math.floor(Math.random()*4)]}xxx-xxxxxxxxxxxx`.replace(/[xy]/g, (G) => {
      let Z = Math.random() * 16;
      if (A > 0) Z = (A + Z) % 16 | 0, A = Math.floor(A / 16);
      else Z = (Q + Z) % 16 | 0, Q = Math.floor(Q / 16);
      return (G === "x" ? Z : Z & 7 | 8).toString(16)
    })
  }
  NzQ.getUUID = id4
})
// @from(Ln 69643, Col 4)
HaA = U((RzQ) => {
  Object.defineProperty(RzQ, "__esModule", {
    value: !0
  });
  RzQ.StableID = void 0;
  var nd4 = JNA(),
    ad4 = Yz(),
    OzQ = vg(),
    od4 = VaA(),
    FaA = {};
  RzQ.StableID = {
    get: (A) => {
      if (FaA[A] == null) {
        let Q = rd4(A);
        if (Q == null) Q = (0, od4.getUUID)(), LzQ(Q, A);
        FaA[A] = Q
      }
      return FaA[A]
    },
    setOverride: (A, Q) => {
      FaA[Q] = A, LzQ(A, Q)
    }
  };

  function MzQ(A) {
    return `statsig.stable_id.${(0,nd4._getStorageKey)(A)}`
  }

  function LzQ(A, Q) {
    let B = MzQ(Q);
    try {
      (0, OzQ._setObjectInStorage)(B, A)
    } catch (G) {
      ad4.Log.warn("Failed to save StableID")
    }
  }

  function rd4(A) {
    let Q = MzQ(A);
    return (0, OzQ._getObjectFromStorage)(Q)
  }
})
// @from(Ln 69685, Col 4)
UP1 = U((jzQ) => {
  Object.defineProperty(jzQ, "__esModule", {
    value: !0
  });
  jzQ._getFullUserHash = jzQ._normalizeUser = void 0;
  var sd4 = xZA(),
    td4 = Yz();

  function ed4(A, Q, B) {
    try {
      let G = JSON.parse(JSON.stringify(A));
      if (Q != null && Q.environment != null) G.statsigEnvironment = Q.environment;
      else if (B != null) G.statsigEnvironment = {
        tier: B
      };
      return G
    } catch (G) {
      return td4.Log.error("Failed to JSON.stringify user"), {
        statsigEnvironment: void 0
      }
    }
  }
  jzQ._normalizeUser = ed4;

  function Ac4(A) {
    return A ? (0, sd4._DJB2Object)(A) : null
  }
  jzQ._getFullUserHash = Ac4
})
// @from(Ln 69714, Col 4)
qP1 = U((PzQ) => {
  Object.defineProperty(PzQ, "__esModule", {
    value: !0
  });
  PzQ._typedJsonParse = void 0;
  var Bc4 = Yz();

  function Gc4(A, Q, B) {
    try {
      let G = JSON.parse(A);
      if (G && typeof G === "object" && Q in G) return G
    } catch (G) {}
    return Bc4.Log.error(`Failed to parse ${B}`), null
  }
  PzQ._typedJsonParse = Gc4
})
// @from(Ln 69730, Col 4)
fzQ = U((bi) => {
  var NP1 = bi && bi.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(bi, "__esModule", {
    value: !0
  });
  bi._makeDataAdapterResult = bi.DataAdapterCore = void 0;
  var EaA = Yz(),
    Zc4 = HaA(),
    zaA = UP1(),
    ki = vg(),
    xzQ = qP1(),
    yzQ = 10;
  class vzQ {
    constructor(A, Q) {
      this._adapterName = A, this._cacheSuffix = Q, this._options = null, this._sdkKey = null, this._lastModifiedStoreKey = `statsig.last_modified_time.${Q}`, this._inMemoryCache = new kzQ
    }
    attach(A, Q) {
      this._sdkKey = A, this._options = Q
    }
    getDataSync(A) {
      let Q = A && (0, zaA._normalizeUser)(A, this._options),
        B = this._getCacheKey(Q),
        G = this._inMemoryCache.get(B, Q);
      if (G) return G;
      let Z = this._loadFromCache(B);
      if (Z) return this._inMemoryCache.add(B, Z), this._inMemoryCache.get(B, Q);
      return null
    }
    setData(A, Q) {
      let B = Q && (0, zaA._normalizeUser)(Q, this._options),
        G = this._getCacheKey(B);
      this._inMemoryCache.add(G, $aA("Bootstrap", A, null, B))
    }
    _getDataAsyncImpl(A, Q, B) {
      return NP1(this, void 0, void 0, function* () {
        if (!ki.Storage.isReady()) yield ki.Storage.isReadyResolver();
        let G = A !== null && A !== void 0 ? A : this.getDataSync(Q),
          Z = [this._fetchAndPrepFromNetwork(G, Q, B)];
        if (B === null || B === void 0 ? void 0 : B.timeoutMs) Z.push(new Promise((Y) => setTimeout(Y, B.timeoutMs)).then(() => {
          return EaA.Log.debug("Fetching latest value timed out"), null
        }));
        return yield Promise.race(Z)
      })
    }
    _prefetchDataImpl(A, Q) {
      return NP1(this, void 0, void 0, function* () {
        let B = A && (0, zaA._normalizeUser)(A, this._options),
          G = this._getCacheKey(B),
          Z = yield this._getDataAsyncImpl(null, B, Q);
        if (Z) this._inMemoryCache.add(G, Object.assign(Object.assign({}, Z), {
          source: "Prefetch"
        }))
      })
    }
    _fetchAndPrepFromNetwork(A, Q, B) {
      var G;
      return NP1(this, void 0, void 0, function* () {
        let Z = (G = A === null || A === void 0 ? void 0 : A.data) !== null && G !== void 0 ? G : null,
          Y = A != null && this._isCachedResultValidFor204(A, Q),
          J = yield this._fetchFromNetwork(Z, Q, B, Y);
        if (!J) return EaA.Log.debug("No response returned for latest value"), null;
        let X = (0, xzQ._typedJsonParse)(J, "has_updates", "Response"),
          I = this._getSdkKey(),
          D = Zc4.StableID.get(I),
          W = null;
        if ((X === null || X === void 0 ? void 0 : X.has_updates) === !0) W = $aA("Network", J, D, Q);
        else if (Z && (X === null || X === void 0 ? void 0 : X.has_updates) === !1) W = $aA("NetworkNotModified", Z, D, Q);
        else return null;
        let K = this._getCacheKey(Q);
        return this._inMemoryCache.add(K, W), this._writeToCache(K, W), W
      })
    }
    _getSdkKey() {
      if (this._sdkKey != null) return this._sdkKey;
      return EaA.Log.error(`${this._adapterName} is not attached to a Client`), ""
    }
    _loadFromCache(A) {
      var Q;
      let B = (Q = ki.Storage.getItem) === null || Q === void 0 ? void 0 : Q.call(ki.Storage, A);
      if (B == null) return null;
      let G = (0, xzQ._typedJsonParse)(B, "source", "Cached Result");
      return G ? Object.assign(Object.assign({}, G), {
        source: "Cache"
      }) : null
    }
    _writeToCache(A, Q) {
      ki.Storage.setItem(A, JSON.stringify(Q)), this._runLocalStorageCacheEviction(A)
    }
    _runLocalStorageCacheEviction(A) {
      var Q;
      let B = (Q = (0, ki._getObjectFromStorage)(this._lastModifiedStoreKey)) !== null && Q !== void 0 ? Q : {};
      B[A] = Date.now();
      let G = bzQ(B, yzQ);
      if (G) delete B[G], ki.Storage.removeItem(G);
      (0, ki._setObjectInStorage)(this._lastModifiedStoreKey, B)
    }
  }
  bi.DataAdapterCore = vzQ;

  function $aA(A, Q, B, G) {
    return {
      source: A,
      data: Q,
      receivedAt: Date.now(),
      stableID: B,
      fullUserHash: (0, zaA._getFullUserHash)(G)
    }
  }
  bi._makeDataAdapterResult = $aA;
  class kzQ {
    constructor() {
      this._data = {}
    }
    get(A, Q) {
      var B;
      let G = this._data[A],
        Z = G === null || G === void 0 ? void 0 : G.stableID,
        Y = (B = Q === null || Q === void 0 ? void 0 : Q.customIDs) === null || B === void 0 ? void 0 : B.stableID;
      if (Y && Z && Y !== Z) return EaA.Log.warn("'StatsigUser.customIDs.stableID' mismatch"), null;
      return G
    }
    add(A, Q) {
      let B = bzQ(this._data, yzQ - 1);
      if (B) delete this._data[B];
      this._data[A] = Q
    }
    merge(A) {
      this._data = Object.assign(Object.assign({}, this._data), A)
    }
  }

  function bzQ(A, Q) {
    let B = Object.keys(A);
    if (B.length <= Q) return null;
    return B.reduce((G, Z) => {
      let Y = A[G],
        J = A[Z];
      if (typeof Y === "object" && typeof J === "object") return J.receivedAt < Y.receivedAt ? Z : G;
      return J < Y ? Z : G
    })
  }
})
// @from(Ln 69900, Col 4)
gzQ = U((hzQ) => {
  Object.defineProperty(hzQ, "__esModule", {
    value: !0
  })
})
// @from(Ln 69905, Col 4)
CaA = U((mzQ) => {
  Object.defineProperty(mzQ, "__esModule", {
    value: !0
  });
  mzQ.SDKType = void 0;
  var uzQ = {},
    fZA;
  mzQ.SDKType = {
    _get: (A) => {
      var Q;
      return ((Q = uzQ[A]) !== null && Q !== void 0 ? Q : "js-mono") + (fZA !== null && fZA !== void 0 ? fZA : "")
    },
    _setClientType(A, Q) {
      uzQ[A] = Q
    },
    _setBindingType(A) {
      if (!fZA || fZA === "-react") fZA = "-" + A
    }
  }
})
// @from(Ln 69925, Col 4)
wP1 = U((kg) => {
  var Yc4 = kg && kg.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(kg, "__esModule", {
    value: !0
  });
  kg.ErrorBoundary = kg.EXCEPTION_ENDPOINT = void 0;
  var Jc4 = Yz(),
    Xc4 = CaA(),
    Ic4 = KNA();
  kg.EXCEPTION_ENDPOINT = "https://statsigapi.net/v1/sdk_exception";
  var pzQ = "[Statsig] UnknownError";
  class lzQ {
    constructor(A, Q, B, G) {
      this._sdkKey = A, this._options = Q, this._emitter = B, this._lastSeenError = G, this._seen = new Set
    }
    wrap(A) {
      try {
        let Q = A;
        Wc4(Q).forEach((B) => {
          let G = Q[B];
          if ("$EB" in G) return;
          Q[B] = (...Z) => {
            return this._capture(B, () => G.apply(A, Z))
          }, Q[B].$EB = !0
        })
      } catch (Q) {
        this._onError("eb:wrap", Q)
      }
    }
    logError(A, Q) {
      this._onError(A, Q)
    }
    getLastSeenErrorAndReset() {
      let A = this._lastSeenError;
      return this._lastSeenError = void 0, A !== null && A !== void 0 ? A : null
    }
    attachErrorIfNoneExists(A) {
      if (this._lastSeenError) return;
      this._lastSeenError = czQ(A)
    }
    _capture(A, Q) {
      try {
        let B = Q();
        if (B && B instanceof Promise) return B.catch((G) => this._onError(A, G));
        return B
      } catch (B) {
        return this._onError(A, B), null
      }
    }
    _onError(A, Q) {
      try {
        Jc4.Log.warn(`Caught error in ${A}`, {
          error: Q
        }), (() => Yc4(this, void 0, void 0, function* () {
          var G, Z, Y, J, X, I, D;
          let W = Q ? Q : Error(pzQ),
            K = W instanceof Error,
            V = K ? W.name : "No Name",
            F = czQ(W);
          if (this._lastSeenError = F, this._seen.has(V)) return;
          if (this._seen.add(V), (Z = (G = this._options) === null || G === void 0 ? void 0 : G.networkConfig) === null || Z === void 0 ? void 0 : Z.preventAllNetworkTraffic) {
            (Y = this._emitter) === null || Y === void 0 || Y.call(this, {
              name: "error",
              error: Q,
              tag: A
            });
            return
          }
          let H = Xc4.SDKType._get(this._sdkKey),
            E = Ic4.StatsigMetadataProvider.get(),
            z = K ? W.stack : Dc4(W),
            $ = JSON.stringify(Object.assign({
              tag: A,
              exception: V,
              info: z
            }, Object.assign(Object.assign({}, E), {
              sdkType: H
            })));
          yield((I = (X = (J = this._options) === null || J === void 0 ? void 0 : J.networkConfig) === null || X === void 0 ? void 0 : X.networkOverrideFunc) !== null && I !== void 0 ? I : fetch)(kg.EXCEPTION_ENDPOINT, {
            method: "POST",
            headers: {
              "STATSIG-API-KEY": this._sdkKey,
              "STATSIG-SDK-TYPE": String(H),
              "STATSIG-SDK-VERSION": String(E.sdkVersion),
              "Content-Type": "application/json"
            },
            body: $
          }), (D = this._emitter) === null || D === void 0 || D.call(this, {
            name: "error",
            error: Q,
            tag: A
          })
        }))().then(() => {}).catch(() => {})
      } catch (B) {}
    }
  }
  kg.ErrorBoundary = lzQ;

  function czQ(A) {
    if (A instanceof Error) return A;
    else if (typeof A === "string") return Error(A);
    else return Error("An unknown error occurred.")
  }

  function Dc4(A) {
    try {
      return JSON.stringify(A)
    } catch (Q) {
      return pzQ
    }
  }

  function Wc4(A) {
    let Q = new Set,
      B = Object.getPrototypeOf(A);
    while (B && B !== Object.prototype) Object.getOwnPropertyNames(B).filter((G) => typeof (B === null || B === void 0 ? void 0 : B[G]) === "function").forEach((G) => Q.add(G)), B = Object.getPrototypeOf(B);
    return Array.from(Q)
  }
})
// @from(Ln 70072, Col 4)
nzQ = U((izQ) => {
  Object.defineProperty(izQ, "__esModule", {
    value: !0
  })
})
// @from(Ln 70077, Col 4)
ozQ = U((azQ) => {
  Object.defineProperty(azQ, "__esModule", {
    value: !0
  })
})
// @from(Ln 70082, Col 4)
szQ = U((rzQ) => {
  Object.defineProperty(rzQ, "__esModule", {
    value: !0
  })
})
// @from(Ln 70087, Col 4)
LP1 = U((tzQ) => {
  Object.defineProperty(tzQ, "__esModule", {
    value: !0
  });
  tzQ.createMemoKey = tzQ.MemoPrefix = void 0;
  tzQ.MemoPrefix = {
    _gate: "g",
    _dynamicConfig: "c",
    _experiment: "e",
    _layer: "l",
    _paramStore: "p"
  };
  var Kc4 = new Set([]),
    Vc4 = new Set(["userPersistedValues"]);

  function Fc4(A, Q, B) {
    let G = `${A}|${Q}`;
    if (!B) return G;
    for (let Z of Object.keys(B)) {
      if (Vc4.has(Z)) return;
      if (Kc4.has(Z)) G += `|${Z}=true`;
      else G += `|${Z}=${B[Z]}`
    }
    return G
  }
  tzQ.createMemoKey = Fc4
})