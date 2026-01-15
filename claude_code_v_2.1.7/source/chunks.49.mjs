
// @from(Ln 129662, Col 4)
TQA = U(($2B) => {
  Object.defineProperty($2B, "__esModule", {
    value: !0
  });
  $2B.unregisterGlobal = $2B.getGlobal = $2B.registerGlobal = void 0;
  var Kf3 = D2B(),
    WXA = Bn1(),
    Vf3 = z2B(),
    Ff3 = WXA.VERSION.split(".")[0],
    oOA = Symbol.for(`opentelemetry.js.api.${Ff3}`),
    rOA = Kf3._globalThis;

  function Hf3(A, Q, B, G = !1) {
    var Z;
    let Y = rOA[oOA] = (Z = rOA[oOA]) !== null && Z !== void 0 ? Z : {
      version: WXA.VERSION
    };
    if (!G && Y[A]) {
      let J = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${A}`);
      return B.error(J.stack || J.message), !1
    }
    if (Y.version !== WXA.VERSION) {
      let J = Error(`@opentelemetry/api: Registration of version v${Y.version} for ${A} does not match previously registered API v${WXA.VERSION}`);
      return B.error(J.stack || J.message), !1
    }
    return Y[A] = Q, B.debug(`@opentelemetry/api: Registered a global for ${A} v${WXA.VERSION}.`), !0
  }
  $2B.registerGlobal = Hf3;

  function Ef3(A) {
    var Q, B;
    let G = (Q = rOA[oOA]) === null || Q === void 0 ? void 0 : Q.version;
    if (!G || !(0, Vf3.isCompatible)(G)) return;
    return (B = rOA[oOA]) === null || B === void 0 ? void 0 : B[A]
  }
  $2B.getGlobal = Ef3;

  function zf3(A, Q) {
    Q.debug(`@opentelemetry/api: Unregistering a global for ${A} v${WXA.VERSION}.`);
    let B = rOA[oOA];
    if (B) delete B[A]
  }
  $2B.unregisterGlobal = zf3
})
// @from(Ln 129706, Col 4)
w2B = U((q2B) => {
  Object.defineProperty(q2B, "__esModule", {
    value: !0
  });
  q2B.DiagComponentLogger = void 0;
  var Uf3 = TQA();
  class U2B {
    constructor(A) {
      this._namespace = A.namespace || "DiagComponentLogger"
    }
    debug(...A) {
      return sOA("debug", this._namespace, A)
    }
    error(...A) {
      return sOA("error", this._namespace, A)
    }
    info(...A) {
      return sOA("info", this._namespace, A)
    }
    warn(...A) {
      return sOA("warn", this._namespace, A)
    }
    verbose(...A) {
      return sOA("verbose", this._namespace, A)
    }
  }
  q2B.DiagComponentLogger = U2B;

  function sOA(A, Q, B) {
    let G = (0, Uf3.getGlobal)("diag");
    if (!G) return;
    return B.unshift(Q), G[A](...B)
  }
})
// @from(Ln 129740, Col 4)
oA1 = U((L2B) => {
  Object.defineProperty(L2B, "__esModule", {
    value: !0
  });
  L2B.DiagLogLevel = void 0;
  var qf3;
  (function (A) {
    A[A.NONE = 0] = "NONE", A[A.ERROR = 30] = "ERROR", A[A.WARN = 50] = "WARN", A[A.INFO = 60] = "INFO", A[A.DEBUG = 70] = "DEBUG", A[A.VERBOSE = 80] = "VERBOSE", A[A.ALL = 9999] = "ALL"
  })(qf3 = L2B.DiagLogLevel || (L2B.DiagLogLevel = {}))
})
// @from(Ln 129750, Col 4)
R2B = U((O2B) => {
  Object.defineProperty(O2B, "__esModule", {
    value: !0
  });
  O2B.createLogLevelDiagLogger = void 0;
  var yu = oA1();

  function Nf3(A, Q) {
    if (A < yu.DiagLogLevel.NONE) A = yu.DiagLogLevel.NONE;
    else if (A > yu.DiagLogLevel.ALL) A = yu.DiagLogLevel.ALL;
    Q = Q || {};

    function B(G, Z) {
      let Y = Q[G];
      if (typeof Y === "function" && A >= Z) return Y.bind(Q);
      return function () {}
    }
    return {
      error: B("error", yu.DiagLogLevel.ERROR),
      warn: B("warn", yu.DiagLogLevel.WARN),
      info: B("info", yu.DiagLogLevel.INFO),
      debug: B("debug", yu.DiagLogLevel.DEBUG),
      verbose: B("verbose", yu.DiagLogLevel.VERBOSE)
    }
  }
  O2B.createLogLevelDiagLogger = Nf3
})
// @from(Ln 129777, Col 4)
PQA = U((j2B) => {
  Object.defineProperty(j2B, "__esModule", {
    value: !0
  });
  j2B.DiagAPI = void 0;
  var wf3 = w2B(),
    Lf3 = R2B(),
    _2B = oA1(),
    rA1 = TQA(),
    Of3 = "diag";
  class Zn1 {
    constructor() {
      function A(G) {
        return function (...Z) {
          let Y = (0, rA1.getGlobal)("diag");
          if (!Y) return;
          return Y[G](...Z)
        }
      }
      let Q = this,
        B = (G, Z = {
          logLevel: _2B.DiagLogLevel.INFO
        }) => {
          var Y, J, X;
          if (G === Q) {
            let W = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            return Q.error((Y = W.stack) !== null && Y !== void 0 ? Y : W.message), !1
          }
          if (typeof Z === "number") Z = {
            logLevel: Z
          };
          let I = (0, rA1.getGlobal)("diag"),
            D = (0, Lf3.createLogLevelDiagLogger)((J = Z.logLevel) !== null && J !== void 0 ? J : _2B.DiagLogLevel.INFO, G);
          if (I && !Z.suppressOverrideMessage) {
            let W = (X = Error().stack) !== null && X !== void 0 ? X : "<failed to generate stacktrace>";
            I.warn(`Current logger will be overwritten from ${W}`), D.warn(`Current logger will overwrite one already registered from ${W}`)
          }
          return (0, rA1.registerGlobal)("diag", D, Q, !0)
        };
      Q.setLogger = B, Q.disable = () => {
        (0, rA1.unregisterGlobal)(Of3, Q)
      }, Q.createComponentLogger = (G) => {
        return new wf3.DiagComponentLogger(G)
      }, Q.verbose = A("verbose"), Q.debug = A("debug"), Q.info = A("info"), Q.warn = A("warn"), Q.error = A("error")
    }
    static instance() {
      if (!this._instance) this._instance = new Zn1;
      return this._instance
    }
  }
  j2B.DiagAPI = Zn1
})
// @from(Ln 129829, Col 4)
x2B = U((P2B) => {
  Object.defineProperty(P2B, "__esModule", {
    value: !0
  });
  P2B.BaggageImpl = void 0;
  class KXA {
    constructor(A) {
      this._entries = A ? new Map(A) : new Map
    }
    getEntry(A) {
      let Q = this._entries.get(A);
      if (!Q) return;
      return Object.assign({}, Q)
    }
    getAllEntries() {
      return Array.from(this._entries.entries()).map(([A, Q]) => [A, Q])
    }
    setEntry(A, Q) {
      let B = new KXA(this._entries);
      return B._entries.set(A, Q), B
    }
    removeEntry(A) {
      let Q = new KXA(this._entries);
      return Q._entries.delete(A), Q
    }
    removeEntries(...A) {
      let Q = new KXA(this._entries);
      for (let B of A) Q._entries.delete(B);
      return Q
    }
    clear() {
      return new KXA
    }
  }
  P2B.BaggageImpl = KXA
})
// @from(Ln 129865, Col 4)
k2B = U((y2B) => {
  Object.defineProperty(y2B, "__esModule", {
    value: !0
  });
  y2B.baggageEntryMetadataSymbol = void 0;
  y2B.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata")
})
// @from(Ln 129872, Col 4)
Yn1 = U((b2B) => {
  Object.defineProperty(b2B, "__esModule", {
    value: !0
  });
  b2B.baggageEntryMetadataFromString = b2B.createBaggage = void 0;
  var Mf3 = PQA(),
    Rf3 = x2B(),
    _f3 = k2B(),
    jf3 = Mf3.DiagAPI.instance();

  function Tf3(A = {}) {
    return new Rf3.BaggageImpl(new Map(Object.entries(A)))
  }
  b2B.createBaggage = Tf3;

  function Pf3(A) {
    if (typeof A !== "string") jf3.error(`Cannot create baggage metadata from unknown type: ${typeof A}`), A = "";
    return {
      __TYPE__: _f3.baggageEntryMetadataSymbol,
      toString() {
        return A
      }
    }
  }
  b2B.baggageEntryMetadataFromString = Pf3
})
// @from(Ln 129898, Col 4)
tOA = U((h2B) => {
  Object.defineProperty(h2B, "__esModule", {
    value: !0
  });
  h2B.ROOT_CONTEXT = h2B.createContextKey = void 0;

  function xf3(A) {
    return Symbol.for(A)
  }
  h2B.createContextKey = xf3;
  class sA1 {
    constructor(A) {
      let Q = this;
      Q._currentContext = A ? new Map(A) : new Map, Q.getValue = (B) => Q._currentContext.get(B), Q.setValue = (B, G) => {
        let Z = new sA1(Q._currentContext);
        return Z._currentContext.set(B, G), Z
      }, Q.deleteValue = (B) => {
        let G = new sA1(Q._currentContext);
        return G._currentContext.delete(B), G
      }
    }
  }
  h2B.ROOT_CONTEXT = new sA1
})
// @from(Ln 129922, Col 4)
c2B = U((m2B) => {
  Object.defineProperty(m2B, "__esModule", {
    value: !0
  });
  m2B.DiagConsoleLogger = void 0;
  var Jn1 = [{
    n: "error",
    c: "error"
  }, {
    n: "warn",
    c: "warn"
  }, {
    n: "info",
    c: "info"
  }, {
    n: "debug",
    c: "debug"
  }, {
    n: "verbose",
    c: "trace"
  }];
  class u2B {
    constructor() {
      function A(Q) {
        return function (...B) {
          if (console) {
            let G = console[Q];
            if (typeof G !== "function") G = console.log;
            if (typeof G === "function") return G.apply(console, B)
          }
        }
      }
      for (let Q = 0; Q < Jn1.length; Q++) this[Jn1[Q].n] = A(Jn1[Q].c)
    }
  }
  m2B.DiagConsoleLogger = u2B
})
// @from(Ln 129959, Col 4)
En1 = U((p2B) => {
  Object.defineProperty(p2B, "__esModule", {
    value: !0
  });
  p2B.createNoopMeter = p2B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = p2B.NOOP_OBSERVABLE_GAUGE_METRIC = p2B.NOOP_OBSERVABLE_COUNTER_METRIC = p2B.NOOP_UP_DOWN_COUNTER_METRIC = p2B.NOOP_HISTOGRAM_METRIC = p2B.NOOP_GAUGE_METRIC = p2B.NOOP_COUNTER_METRIC = p2B.NOOP_METER = p2B.NoopObservableUpDownCounterMetric = p2B.NoopObservableGaugeMetric = p2B.NoopObservableCounterMetric = p2B.NoopObservableMetric = p2B.NoopHistogramMetric = p2B.NoopGaugeMetric = p2B.NoopUpDownCounterMetric = p2B.NoopCounterMetric = p2B.NoopMetric = p2B.NoopMeter = void 0;
  class Xn1 {
    constructor() {}
    createGauge(A, Q) {
      return p2B.NOOP_GAUGE_METRIC
    }
    createHistogram(A, Q) {
      return p2B.NOOP_HISTOGRAM_METRIC
    }
    createCounter(A, Q) {
      return p2B.NOOP_COUNTER_METRIC
    }
    createUpDownCounter(A, Q) {
      return p2B.NOOP_UP_DOWN_COUNTER_METRIC
    }
    createObservableGauge(A, Q) {
      return p2B.NOOP_OBSERVABLE_GAUGE_METRIC
    }
    createObservableCounter(A, Q) {
      return p2B.NOOP_OBSERVABLE_COUNTER_METRIC
    }
    createObservableUpDownCounter(A, Q) {
      return p2B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC
    }
    addBatchObservableCallback(A, Q) {}
    removeBatchObservableCallback(A) {}
  }
  p2B.NoopMeter = Xn1;
  class VXA {}
  p2B.NoopMetric = VXA;
  class In1 extends VXA {
    add(A, Q) {}
  }
  p2B.NoopCounterMetric = In1;
  class Dn1 extends VXA {
    add(A, Q) {}
  }
  p2B.NoopUpDownCounterMetric = Dn1;
  class Wn1 extends VXA {
    record(A, Q) {}
  }
  p2B.NoopGaugeMetric = Wn1;
  class Kn1 extends VXA {
    record(A, Q) {}
  }
  p2B.NoopHistogramMetric = Kn1;
  class eOA {
    addCallback(A) {}
    removeCallback(A) {}
  }
  p2B.NoopObservableMetric = eOA;
  class Vn1 extends eOA {}
  p2B.NoopObservableCounterMetric = Vn1;
  class Fn1 extends eOA {}
  p2B.NoopObservableGaugeMetric = Fn1;
  class Hn1 extends eOA {}
  p2B.NoopObservableUpDownCounterMetric = Hn1;
  p2B.NOOP_METER = new Xn1;
  p2B.NOOP_COUNTER_METRIC = new In1;
  p2B.NOOP_GAUGE_METRIC = new Wn1;
  p2B.NOOP_HISTOGRAM_METRIC = new Kn1;
  p2B.NOOP_UP_DOWN_COUNTER_METRIC = new Dn1;
  p2B.NOOP_OBSERVABLE_COUNTER_METRIC = new Vn1;
  p2B.NOOP_OBSERVABLE_GAUGE_METRIC = new Fn1;
  p2B.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new Hn1;

  function vf3() {
    return p2B.NOOP_METER
  }
  p2B.createNoopMeter = vf3
})
// @from(Ln 130034, Col 4)
Q9B = U((A9B) => {
  Object.defineProperty(A9B, "__esModule", {
    value: !0
  });
  A9B.ValueType = void 0;
  var lf3;
  (function (A) {
    A[A.INT = 0] = "INT", A[A.DOUBLE = 1] = "DOUBLE"
  })(lf3 = A9B.ValueType || (A9B.ValueType = {}))
})
// @from(Ln 130044, Col 4)
$n1 = U((B9B) => {
  Object.defineProperty(B9B, "__esModule", {
    value: !0
  });
  B9B.defaultTextMapSetter = B9B.defaultTextMapGetter = void 0;
  B9B.defaultTextMapGetter = {
    get(A, Q) {
      if (A == null) return;
      return A[Q]
    },
    keys(A) {
      if (A == null) return [];
      return Object.keys(A)
    }
  };
  B9B.defaultTextMapSetter = {
    set(A, Q, B) {
      if (A == null) return;
      A[Q] = B
    }
  }
})
// @from(Ln 130066, Col 4)
X9B = U((Y9B) => {
  Object.defineProperty(Y9B, "__esModule", {
    value: !0
  });
  Y9B.NoopContextManager = void 0;
  var nf3 = tOA();
  class Z9B {
    active() {
      return nf3.ROOT_CONTEXT
    }
    with(A, Q, B, ...G) {
      return Q.call(B, ...G)
    }
    bind(A, Q) {
      return Q
    }
    enable() {
      return this
    }
    disable() {
      return this
    }
  }
  Y9B.NoopContextManager = Z9B
})
// @from(Ln 130091, Col 4)
AMA = U((D9B) => {
  Object.defineProperty(D9B, "__esModule", {
    value: !0
  });
  D9B.ContextAPI = void 0;
  var af3 = X9B(),
    Cn1 = TQA(),
    I9B = PQA(),
    Un1 = "context",
    of3 = new af3.NoopContextManager;
  class qn1 {
    constructor() {}
    static getInstance() {
      if (!this._instance) this._instance = new qn1;
      return this._instance
    }
    setGlobalContextManager(A) {
      return (0, Cn1.registerGlobal)(Un1, A, I9B.DiagAPI.instance())
    }
    active() {
      return this._getContextManager().active()
    }
    with(A, Q, B, ...G) {
      return this._getContextManager().with(A, Q, B, ...G)
    }
    bind(A, Q) {
      return this._getContextManager().bind(A, Q)
    }
    _getContextManager() {
      return (0, Cn1.getGlobal)(Un1) || of3
    }
    disable() {
      this._getContextManager().disable(), (0, Cn1.unregisterGlobal)(Un1, I9B.DiagAPI.instance())
    }
  }
  D9B.ContextAPI = qn1
})
// @from(Ln 130128, Col 4)
wn1 = U((K9B) => {
  Object.defineProperty(K9B, "__esModule", {
    value: !0
  });
  K9B.TraceFlags = void 0;
  var rf3;
  (function (A) {
    A[A.NONE = 0] = "NONE", A[A.SAMPLED = 1] = "SAMPLED"
  })(rf3 = K9B.TraceFlags || (K9B.TraceFlags = {}))
})
// @from(Ln 130138, Col 4)
tA1 = U((V9B) => {
  Object.defineProperty(V9B, "__esModule", {
    value: !0
  });
  V9B.INVALID_SPAN_CONTEXT = V9B.INVALID_TRACEID = V9B.INVALID_SPANID = void 0;
  var sf3 = wn1();
  V9B.INVALID_SPANID = "0000000000000000";
  V9B.INVALID_TRACEID = "00000000000000000000000000000000";
  V9B.INVALID_SPAN_CONTEXT = {
    traceId: V9B.INVALID_TRACEID,
    spanId: V9B.INVALID_SPANID,
    traceFlags: sf3.TraceFlags.NONE
  }
})
// @from(Ln 130152, Col 4)
eA1 = U(($9B) => {
  Object.defineProperty($9B, "__esModule", {
    value: !0
  });
  $9B.NonRecordingSpan = void 0;
  var tf3 = tA1();
  class z9B {
    constructor(A = tf3.INVALID_SPAN_CONTEXT) {
      this._spanContext = A
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      return this
    }
    setAttributes(A) {
      return this
    }
    addEvent(A, Q) {
      return this
    }
    addLink(A) {
      return this
    }
    addLinks(A) {
      return this
    }
    setStatus(A) {
      return this
    }
    updateName(A) {
      return this
    }
    end(A) {}
    isRecording() {
      return !1
    }
    recordException(A, Q) {}
  }
  $9B.NonRecordingSpan = z9B
})
// @from(Ln 130194, Col 4)
Mn1 = U((q9B) => {
  Object.defineProperty(q9B, "__esModule", {
    value: !0
  });
  q9B.getSpanContext = q9B.setSpanContext = q9B.deleteSpan = q9B.setSpan = q9B.getActiveSpan = q9B.getSpan = void 0;
  var ef3 = tOA(),
    Ah3 = eA1(),
    Qh3 = AMA(),
    Ln1 = (0, ef3.createContextKey)("OpenTelemetry Context Key SPAN");

  function On1(A) {
    return A.getValue(Ln1) || void 0
  }
  q9B.getSpan = On1;

  function Bh3() {
    return On1(Qh3.ContextAPI.getInstance().active())
  }
  q9B.getActiveSpan = Bh3;

  function U9B(A, Q) {
    return A.setValue(Ln1, Q)
  }
  q9B.setSpan = U9B;

  function Gh3(A) {
    return A.deleteValue(Ln1)
  }
  q9B.deleteSpan = Gh3;

  function Zh3(A, Q) {
    return U9B(A, new Ah3.NonRecordingSpan(Q))
  }
  q9B.setSpanContext = Zh3;

  function Yh3(A) {
    var Q;
    return (Q = On1(A)) === null || Q === void 0 ? void 0 : Q.spanContext()
  }
  q9B.getSpanContext = Yh3
})
// @from(Ln 130235, Col 4)
A11 = U((M9B) => {
  Object.defineProperty(M9B, "__esModule", {
    value: !0
  });
  M9B.wrapSpanContext = M9B.isSpanContextValid = M9B.isValidSpanId = M9B.isValidTraceId = void 0;
  var w9B = tA1(),
    Kh3 = eA1(),
    Vh3 = /^([0-9a-f]{32})$/i,
    Fh3 = /^[0-9a-f]{16}$/i;

  function L9B(A) {
    return Vh3.test(A) && A !== w9B.INVALID_TRACEID
  }
  M9B.isValidTraceId = L9B;

  function O9B(A) {
    return Fh3.test(A) && A !== w9B.INVALID_SPANID
  }
  M9B.isValidSpanId = O9B;

  function Hh3(A) {
    return L9B(A.traceId) && O9B(A.spanId)
  }
  M9B.isSpanContextValid = Hh3;

  function Eh3(A) {
    return new Kh3.NonRecordingSpan(A)
  }
  M9B.wrapSpanContext = Eh3
})
// @from(Ln 130265, Col 4)
jn1 = U((T9B) => {
  Object.defineProperty(T9B, "__esModule", {
    value: !0
  });
  T9B.NoopTracer = void 0;
  var Uh3 = AMA(),
    _9B = Mn1(),
    Rn1 = eA1(),
    qh3 = A11(),
    _n1 = Uh3.ContextAPI.getInstance();
  class j9B {
    startSpan(A, Q, B = _n1.active()) {
      if (Boolean(Q === null || Q === void 0 ? void 0 : Q.root)) return new Rn1.NonRecordingSpan;
      let Z = B && (0, _9B.getSpanContext)(B);
      if (Nh3(Z) && (0, qh3.isSpanContextValid)(Z)) return new Rn1.NonRecordingSpan(Z);
      else return new Rn1.NonRecordingSpan
    }
    startActiveSpan(A, Q, B, G) {
      let Z, Y, J;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) J = Q;
      else if (arguments.length === 3) Z = Q, J = B;
      else Z = Q, Y = B, J = G;
      let X = Y !== null && Y !== void 0 ? Y : _n1.active(),
        I = this.startSpan(A, Z, X),
        D = (0, _9B.setSpan)(X, I);
      return _n1.with(D, J, void 0, I)
    }
  }
  T9B.NoopTracer = j9B;

  function Nh3(A) {
    return typeof A === "object" && typeof A.spanId === "string" && typeof A.traceId === "string" && typeof A.traceFlags === "number"
  }
})
// @from(Ln 130300, Col 4)
Tn1 = U((x9B) => {
  Object.defineProperty(x9B, "__esModule", {
    value: !0
  });
  x9B.ProxyTracer = void 0;
  var wh3 = jn1(),
    Lh3 = new wh3.NoopTracer;
  class S9B {
    constructor(A, Q, B, G) {
      this._provider = A, this.name = Q, this.version = B, this.options = G
    }
    startSpan(A, Q, B) {
      return this._getTracer().startSpan(A, Q, B)
    }
    startActiveSpan(A, Q, B, G) {
      let Z = this._getTracer();
      return Reflect.apply(Z.startActiveSpan, Z, arguments)
    }
    _getTracer() {
      if (this._delegate) return this._delegate;
      let A = this._provider.getDelegateTracer(this.name, this.version, this.options);
      if (!A) return Lh3;
      return this._delegate = A, this._delegate
    }
  }
  x9B.ProxyTracer = S9B
})
// @from(Ln 130327, Col 4)
f9B = U((k9B) => {
  Object.defineProperty(k9B, "__esModule", {
    value: !0
  });
  k9B.NoopTracerProvider = void 0;
  var Oh3 = jn1();
  class v9B {
    getTracer(A, Q, B) {
      return new Oh3.NoopTracer
    }
  }
  k9B.NoopTracerProvider = v9B
})
// @from(Ln 130340, Col 4)
Pn1 = U((g9B) => {
  Object.defineProperty(g9B, "__esModule", {
    value: !0
  });
  g9B.ProxyTracerProvider = void 0;
  var Mh3 = Tn1(),
    Rh3 = f9B(),
    _h3 = new Rh3.NoopTracerProvider;
  class h9B {
    getTracer(A, Q, B) {
      var G;
      return (G = this.getDelegateTracer(A, Q, B)) !== null && G !== void 0 ? G : new Mh3.ProxyTracer(this, A, Q, B)
    }
    getDelegate() {
      var A;
      return (A = this._delegate) !== null && A !== void 0 ? A : _h3
    }
    setDelegate(A) {
      this._delegate = A
    }
    getDelegateTracer(A, Q, B) {
      var G;
      return (G = this._delegate) === null || G === void 0 ? void 0 : G.getTracer(A, Q, B)
    }
  }
  g9B.ProxyTracerProvider = h9B
})
// @from(Ln 130367, Col 4)
d9B = U((m9B) => {
  Object.defineProperty(m9B, "__esModule", {
    value: !0
  });
  m9B.SamplingDecision = void 0;
  var jh3;
  (function (A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })(jh3 = m9B.SamplingDecision || (m9B.SamplingDecision = {}))
})
// @from(Ln 130377, Col 4)
p9B = U((c9B) => {
  Object.defineProperty(c9B, "__esModule", {
    value: !0
  });
  c9B.SpanKind = void 0;
  var Th3;
  (function (A) {
    A[A.INTERNAL = 0] = "INTERNAL", A[A.SERVER = 1] = "SERVER", A[A.CLIENT = 2] = "CLIENT", A[A.PRODUCER = 3] = "PRODUCER", A[A.CONSUMER = 4] = "CONSUMER"
  })(Th3 = c9B.SpanKind || (c9B.SpanKind = {}))
})
// @from(Ln 130387, Col 4)
i9B = U((l9B) => {
  Object.defineProperty(l9B, "__esModule", {
    value: !0
  });
  l9B.SpanStatusCode = void 0;
  var Ph3;
  (function (A) {
    A[A.UNSET = 0] = "UNSET", A[A.OK = 1] = "OK", A[A.ERROR = 2] = "ERROR"
  })(Ph3 = l9B.SpanStatusCode || (l9B.SpanStatusCode = {}))
})
// @from(Ln 130397, Col 4)
o9B = U((n9B) => {
  Object.defineProperty(n9B, "__esModule", {
    value: !0
  });
  n9B.validateValue = n9B.validateKey = void 0;
  var vn1 = "[_0-9a-z-*/]",
    Sh3 = `[a-z]${vn1}{0,255}`,
    xh3 = `[a-z0-9]${vn1}{0,240}@[a-z]${vn1}{0,13}`,
    yh3 = new RegExp(`^(?:${Sh3}|${xh3})$`),
    vh3 = /^[ -~]{0,255}[!-~]$/,
    kh3 = /,|=/;

  function bh3(A) {
    return yh3.test(A)
  }
  n9B.validateKey = bh3;

  function fh3(A) {
    return vh3.test(A) && !kh3.test(A)
  }
  n9B.validateValue = fh3
})
// @from(Ln 130419, Col 4)
B4B = U((A4B) => {
  Object.defineProperty(A4B, "__esModule", {
    value: !0
  });
  A4B.TraceStateImpl = void 0;
  var r9B = o9B(),
    s9B = 32,
    gh3 = 512,
    t9B = ",",
    e9B = "=";
  class kn1 {
    constructor(A) {
      if (this._internalState = new Map, A) this._parse(A)
    }
    set(A, Q) {
      let B = this._clone();
      if (B._internalState.has(A)) B._internalState.delete(A);
      return B._internalState.set(A, Q), B
    }
    unset(A) {
      let Q = this._clone();
      return Q._internalState.delete(A), Q
    }
    get(A) {
      return this._internalState.get(A)
    }
    serialize() {
      return this._keys().reduce((A, Q) => {
        return A.push(Q + e9B + this.get(Q)), A
      }, []).join(t9B)
    }
    _parse(A) {
      if (A.length > gh3) return;
      if (this._internalState = A.split(t9B).reverse().reduce((Q, B) => {
          let G = B.trim(),
            Z = G.indexOf(e9B);
          if (Z !== -1) {
            let Y = G.slice(0, Z),
              J = G.slice(Z + 1, B.length);
            if ((0, r9B.validateKey)(Y) && (0, r9B.validateValue)(J)) Q.set(Y, J)
          }
          return Q
        }, new Map), this._internalState.size > s9B) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, s9B))
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse()
    }
    _clone() {
      let A = new kn1;
      return A._internalState = new Map(this._internalState), A
    }
  }
  A4B.TraceStateImpl = kn1
})
// @from(Ln 130473, Col 4)
Y4B = U((G4B) => {
  Object.defineProperty(G4B, "__esModule", {
    value: !0
  });
  G4B.createTraceState = void 0;
  var uh3 = B4B();

  function mh3(A) {
    return new uh3.TraceStateImpl(A)
  }
  G4B.createTraceState = mh3
})
// @from(Ln 130485, Col 4)
I4B = U((J4B) => {
  Object.defineProperty(J4B, "__esModule", {
    value: !0
  });
  J4B.context = void 0;
  var dh3 = AMA();
  J4B.context = dh3.ContextAPI.getInstance()
})
// @from(Ln 130493, Col 4)
K4B = U((D4B) => {
  Object.defineProperty(D4B, "__esModule", {
    value: !0
  });
  D4B.diag = void 0;
  var ch3 = PQA();
  D4B.diag = ch3.DiagAPI.instance()
})
// @from(Ln 130501, Col 4)
H4B = U((V4B) => {
  Object.defineProperty(V4B, "__esModule", {
    value: !0
  });
  V4B.NOOP_METER_PROVIDER = V4B.NoopMeterProvider = void 0;
  var ph3 = En1();
  class bn1 {
    getMeter(A, Q, B) {
      return ph3.NOOP_METER
    }
  }
  V4B.NoopMeterProvider = bn1;
  V4B.NOOP_METER_PROVIDER = new bn1
})
// @from(Ln 130515, Col 4)
C4B = U((z4B) => {
  Object.defineProperty(z4B, "__esModule", {
    value: !0
  });
  z4B.MetricsAPI = void 0;
  var ih3 = H4B(),
    fn1 = TQA(),
    E4B = PQA(),
    hn1 = "metrics";
  class gn1 {
    constructor() {}
    static getInstance() {
      if (!this._instance) this._instance = new gn1;
      return this._instance
    }
    setGlobalMeterProvider(A) {
      return (0, fn1.registerGlobal)(hn1, A, E4B.DiagAPI.instance())
    }
    getMeterProvider() {
      return (0, fn1.getGlobal)(hn1) || ih3.NOOP_METER_PROVIDER
    }
    getMeter(A, Q, B) {
      return this.getMeterProvider().getMeter(A, Q, B)
    }
    disable() {
      (0, fn1.unregisterGlobal)(hn1, E4B.DiagAPI.instance())
    }
  }
  z4B.MetricsAPI = gn1
})
// @from(Ln 130545, Col 4)
N4B = U((U4B) => {
  Object.defineProperty(U4B, "__esModule", {
    value: !0
  });
  U4B.metrics = void 0;
  var nh3 = C4B();
  U4B.metrics = nh3.MetricsAPI.getInstance()
})
// @from(Ln 130553, Col 4)
M4B = U((L4B) => {
  Object.defineProperty(L4B, "__esModule", {
    value: !0
  });
  L4B.NoopTextMapPropagator = void 0;
  class w4B {
    inject(A, Q) {}
    extract(A, Q) {
      return A
    }
    fields() {
      return []
    }
  }
  L4B.NoopTextMapPropagator = w4B
})
// @from(Ln 130569, Col 4)
T4B = U((_4B) => {
  Object.defineProperty(_4B, "__esModule", {
    value: !0
  });
  _4B.deleteBaggage = _4B.setBaggage = _4B.getActiveBaggage = _4B.getBaggage = void 0;
  var ah3 = AMA(),
    oh3 = tOA(),
    un1 = (0, oh3.createContextKey)("OpenTelemetry Baggage Key");

  function R4B(A) {
    return A.getValue(un1) || void 0
  }
  _4B.getBaggage = R4B;

  function rh3() {
    return R4B(ah3.ContextAPI.getInstance().active())
  }
  _4B.getActiveBaggage = rh3;

  function sh3(A, Q) {
    return A.setValue(un1, Q)
  }
  _4B.setBaggage = sh3;

  function th3(A) {
    return A.deleteValue(un1)
  }
  _4B.deleteBaggage = th3
})
// @from(Ln 130598, Col 4)
v4B = U((x4B) => {
  Object.defineProperty(x4B, "__esModule", {
    value: !0
  });
  x4B.PropagationAPI = void 0;
  var mn1 = TQA(),
    Bg3 = M4B(),
    P4B = $n1(),
    Q11 = T4B(),
    Gg3 = Yn1(),
    S4B = PQA(),
    dn1 = "propagation",
    Zg3 = new Bg3.NoopTextMapPropagator;
  class cn1 {
    constructor() {
      this.createBaggage = Gg3.createBaggage, this.getBaggage = Q11.getBaggage, this.getActiveBaggage = Q11.getActiveBaggage, this.setBaggage = Q11.setBaggage, this.deleteBaggage = Q11.deleteBaggage
    }
    static getInstance() {
      if (!this._instance) this._instance = new cn1;
      return this._instance
    }
    setGlobalPropagator(A) {
      return (0, mn1.registerGlobal)(dn1, A, S4B.DiagAPI.instance())
    }
    inject(A, Q, B = P4B.defaultTextMapSetter) {
      return this._getGlobalPropagator().inject(A, Q, B)
    }
    extract(A, Q, B = P4B.defaultTextMapGetter) {
      return this._getGlobalPropagator().extract(A, Q, B)
    }
    fields() {
      return this._getGlobalPropagator().fields()
    }
    disable() {
      (0, mn1.unregisterGlobal)(dn1, S4B.DiagAPI.instance())
    }
    _getGlobalPropagator() {
      return (0, mn1.getGlobal)(dn1) || Zg3
    }
  }
  x4B.PropagationAPI = cn1
})
// @from(Ln 130640, Col 4)
f4B = U((k4B) => {
  Object.defineProperty(k4B, "__esModule", {
    value: !0
  });
  k4B.propagation = void 0;
  var Yg3 = v4B();
  k4B.propagation = Yg3.PropagationAPI.getInstance()
})
// @from(Ln 130648, Col 4)
c4B = U((m4B) => {
  Object.defineProperty(m4B, "__esModule", {
    value: !0
  });
  m4B.TraceAPI = void 0;
  var pn1 = TQA(),
    h4B = Pn1(),
    g4B = A11(),
    FXA = Mn1(),
    u4B = PQA(),
    ln1 = "trace";
  class in1 {
    constructor() {
      this._proxyTracerProvider = new h4B.ProxyTracerProvider, this.wrapSpanContext = g4B.wrapSpanContext, this.isSpanContextValid = g4B.isSpanContextValid, this.deleteSpan = FXA.deleteSpan, this.getSpan = FXA.getSpan, this.getActiveSpan = FXA.getActiveSpan, this.getSpanContext = FXA.getSpanContext, this.setSpan = FXA.setSpan, this.setSpanContext = FXA.setSpanContext
    }
    static getInstance() {
      if (!this._instance) this._instance = new in1;
      return this._instance
    }
    setGlobalTracerProvider(A) {
      let Q = (0, pn1.registerGlobal)(ln1, this._proxyTracerProvider, u4B.DiagAPI.instance());
      if (Q) this._proxyTracerProvider.setDelegate(A);
      return Q
    }
    getTracerProvider() {
      return (0, pn1.getGlobal)(ln1) || this._proxyTracerProvider
    }
    getTracer(A, Q) {
      return this.getTracerProvider().getTracer(A, Q)
    }
    disable() {
      (0, pn1.unregisterGlobal)(ln1, u4B.DiagAPI.instance()), this._proxyTracerProvider = new h4B.ProxyTracerProvider
    }
  }
  m4B.TraceAPI = in1
})
// @from(Ln 130684, Col 4)
i4B = U((p4B) => {
  Object.defineProperty(p4B, "__esModule", {
    value: !0
  });
  p4B.trace = void 0;
  var Jg3 = c4B();
  p4B.trace = Jg3.TraceAPI.getInstance()
})
// @from(Ln 130692, Col 4)
p9 = U((GZ) => {
  Object.defineProperty(GZ, "__esModule", {
    value: !0
  });
  GZ.trace = GZ.propagation = GZ.metrics = GZ.diag = GZ.context = GZ.INVALID_SPAN_CONTEXT = GZ.INVALID_TRACEID = GZ.INVALID_SPANID = GZ.isValidSpanId = GZ.isValidTraceId = GZ.isSpanContextValid = GZ.createTraceState = GZ.TraceFlags = GZ.SpanStatusCode = GZ.SpanKind = GZ.SamplingDecision = GZ.ProxyTracerProvider = GZ.ProxyTracer = GZ.defaultTextMapSetter = GZ.defaultTextMapGetter = GZ.ValueType = GZ.createNoopMeter = GZ.DiagLogLevel = GZ.DiagConsoleLogger = GZ.ROOT_CONTEXT = GZ.createContextKey = GZ.baggageEntryMetadataFromString = void 0;
  var Xg3 = Yn1();
  Object.defineProperty(GZ, "baggageEntryMetadataFromString", {
    enumerable: !0,
    get: function () {
      return Xg3.baggageEntryMetadataFromString
    }
  });
  var n4B = tOA();
  Object.defineProperty(GZ, "createContextKey", {
    enumerable: !0,
    get: function () {
      return n4B.createContextKey
    }
  });
  Object.defineProperty(GZ, "ROOT_CONTEXT", {
    enumerable: !0,
    get: function () {
      return n4B.ROOT_CONTEXT
    }
  });
  var Ig3 = c2B();
  Object.defineProperty(GZ, "DiagConsoleLogger", {
    enumerable: !0,
    get: function () {
      return Ig3.DiagConsoleLogger
    }
  });
  var Dg3 = oA1();
  Object.defineProperty(GZ, "DiagLogLevel", {
    enumerable: !0,
    get: function () {
      return Dg3.DiagLogLevel
    }
  });
  var Wg3 = En1();
  Object.defineProperty(GZ, "createNoopMeter", {
    enumerable: !0,
    get: function () {
      return Wg3.createNoopMeter
    }
  });
  var Kg3 = Q9B();
  Object.defineProperty(GZ, "ValueType", {
    enumerable: !0,
    get: function () {
      return Kg3.ValueType
    }
  });
  var a4B = $n1();
  Object.defineProperty(GZ, "defaultTextMapGetter", {
    enumerable: !0,
    get: function () {
      return a4B.defaultTextMapGetter
    }
  });
  Object.defineProperty(GZ, "defaultTextMapSetter", {
    enumerable: !0,
    get: function () {
      return a4B.defaultTextMapSetter
    }
  });
  var Vg3 = Tn1();
  Object.defineProperty(GZ, "ProxyTracer", {
    enumerable: !0,
    get: function () {
      return Vg3.ProxyTracer
    }
  });
  var Fg3 = Pn1();
  Object.defineProperty(GZ, "ProxyTracerProvider", {
    enumerable: !0,
    get: function () {
      return Fg3.ProxyTracerProvider
    }
  });
  var Hg3 = d9B();
  Object.defineProperty(GZ, "SamplingDecision", {
    enumerable: !0,
    get: function () {
      return Hg3.SamplingDecision
    }
  });
  var Eg3 = p9B();
  Object.defineProperty(GZ, "SpanKind", {
    enumerable: !0,
    get: function () {
      return Eg3.SpanKind
    }
  });
  var zg3 = i9B();
  Object.defineProperty(GZ, "SpanStatusCode", {
    enumerable: !0,
    get: function () {
      return zg3.SpanStatusCode
    }
  });
  var $g3 = wn1();
  Object.defineProperty(GZ, "TraceFlags", {
    enumerable: !0,
    get: function () {
      return $g3.TraceFlags
    }
  });
  var Cg3 = Y4B();
  Object.defineProperty(GZ, "createTraceState", {
    enumerable: !0,
    get: function () {
      return Cg3.createTraceState
    }
  });
  var nn1 = A11();
  Object.defineProperty(GZ, "isSpanContextValid", {
    enumerable: !0,
    get: function () {
      return nn1.isSpanContextValid
    }
  });
  Object.defineProperty(GZ, "isValidTraceId", {
    enumerable: !0,
    get: function () {
      return nn1.isValidTraceId
    }
  });
  Object.defineProperty(GZ, "isValidSpanId", {
    enumerable: !0,
    get: function () {
      return nn1.isValidSpanId
    }
  });
  var an1 = tA1();
  Object.defineProperty(GZ, "INVALID_SPANID", {
    enumerable: !0,
    get: function () {
      return an1.INVALID_SPANID
    }
  });
  Object.defineProperty(GZ, "INVALID_TRACEID", {
    enumerable: !0,
    get: function () {
      return an1.INVALID_TRACEID
    }
  });
  Object.defineProperty(GZ, "INVALID_SPAN_CONTEXT", {
    enumerable: !0,
    get: function () {
      return an1.INVALID_SPAN_CONTEXT
    }
  });
  var o4B = I4B();
  Object.defineProperty(GZ, "context", {
    enumerable: !0,
    get: function () {
      return o4B.context
    }
  });
  var r4B = K4B();
  Object.defineProperty(GZ, "diag", {
    enumerable: !0,
    get: function () {
      return r4B.diag
    }
  });
  var s4B = N4B();
  Object.defineProperty(GZ, "metrics", {
    enumerable: !0,
    get: function () {
      return s4B.metrics
    }
  });
  var t4B = f4B();
  Object.defineProperty(GZ, "propagation", {
    enumerable: !0,
    get: function () {
      return t4B.propagation
    }
  });
  var e4B = i4B();
  Object.defineProperty(GZ, "trace", {
    enumerable: !0,
    get: function () {
      return e4B.trace
    }
  });
  GZ.default = {
    context: o4B.context,
    diag: r4B.diag,
    metrics: s4B.metrics,
    propagation: t4B.propagation,
    trace: e4B.trace
  }
})
// @from(Ln 130888, Col 4)
Q6B = U((A6B) => {
  Object.defineProperty(A6B, "__esModule", {
    value: !0
  });
  A6B.SeverityNumber = void 0;
  var Ng3;
  (function (A) {
    A[A.UNSPECIFIED = 0] = "UNSPECIFIED", A[A.TRACE = 1] = "TRACE", A[A.TRACE2 = 2] = "TRACE2", A[A.TRACE3 = 3] = "TRACE3", A[A.TRACE4 = 4] = "TRACE4", A[A.DEBUG = 5] = "DEBUG", A[A.DEBUG2 = 6] = "DEBUG2", A[A.DEBUG3 = 7] = "DEBUG3", A[A.DEBUG4 = 8] = "DEBUG4", A[A.INFO = 9] = "INFO", A[A.INFO2 = 10] = "INFO2", A[A.INFO3 = 11] = "INFO3", A[A.INFO4 = 12] = "INFO4", A[A.WARN = 13] = "WARN", A[A.WARN2 = 14] = "WARN2", A[A.WARN3 = 15] = "WARN3", A[A.WARN4 = 16] = "WARN4", A[A.ERROR = 17] = "ERROR", A[A.ERROR2 = 18] = "ERROR2", A[A.ERROR3 = 19] = "ERROR3", A[A.ERROR4 = 20] = "ERROR4", A[A.FATAL = 21] = "FATAL", A[A.FATAL2 = 22] = "FATAL2", A[A.FATAL3 = 23] = "FATAL3", A[A.FATAL4 = 24] = "FATAL4"
  })(Ng3 = A6B.SeverityNumber || (A6B.SeverityNumber = {}))
})
// @from(Ln 130898, Col 4)
B11 = U((B6B) => {
  Object.defineProperty(B6B, "__esModule", {
    value: !0
  });
  B6B.NOOP_LOGGER = B6B.NoopLogger = void 0;
  class rn1 {
    emit(A) {}
  }
  B6B.NoopLogger = rn1;
  B6B.NOOP_LOGGER = new rn1
})
// @from(Ln 130909, Col 4)
tn1 = U((Z6B) => {
  Object.defineProperty(Z6B, "__esModule", {
    value: !0
  });
  Z6B.NOOP_LOGGER_PROVIDER = Z6B.NoopLoggerProvider = void 0;
  var Lg3 = B11();
  class sn1 {
    getLogger(A, Q, B) {
      return new Lg3.NoopLogger
    }
  }
  Z6B.NoopLoggerProvider = sn1;
  Z6B.NOOP_LOGGER_PROVIDER = new sn1
})
// @from(Ln 130923, Col 4)
D6B = U((X6B) => {
  Object.defineProperty(X6B, "__esModule", {
    value: !0
  });
  X6B.ProxyLogger = void 0;
  var Mg3 = B11();
  class J6B {
    constructor(A, Q, B, G) {
      this._provider = A, this.name = Q, this.version = B, this.options = G
    }
    emit(A) {
      this._getLogger().emit(A)
    }
    _getLogger() {
      if (this._delegate) return this._delegate;
      let A = this._provider._getDelegateLogger(this.name, this.version, this.options);
      if (!A) return Mg3.NOOP_LOGGER;
      return this._delegate = A, this._delegate
    }
  }
  X6B.ProxyLogger = J6B
})
// @from(Ln 130945, Col 4)
en1 = U((K6B) => {
  Object.defineProperty(K6B, "__esModule", {
    value: !0
  });
  K6B.ProxyLoggerProvider = void 0;
  var Rg3 = tn1(),
    _g3 = D6B();
  class W6B {
    getLogger(A, Q, B) {
      var G;
      return (G = this._getDelegateLogger(A, Q, B)) !== null && G !== void 0 ? G : new _g3.ProxyLogger(this, A, Q, B)
    }
    _getDelegate() {
      var A;
      return (A = this._delegate) !== null && A !== void 0 ? A : Rg3.NOOP_LOGGER_PROVIDER
    }
    _setDelegate(A) {
      this._delegate = A
    }
    _getDelegateLogger(A, Q, B) {
      var G;
      return (G = this._delegate) === null || G === void 0 ? void 0 : G.getLogger(A, Q, B)
    }
  }
  K6B.ProxyLoggerProvider = W6B
})
// @from(Ln 130971, Col 4)
E6B = U((F6B) => {
  Object.defineProperty(F6B, "__esModule", {
    value: !0
  });
  F6B._globalThis = void 0;
  F6B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 130978, Col 4)
z6B = U((Aa1) => {
  Object.defineProperty(Aa1, "__esModule", {
    value: !0
  });
  Aa1._globalThis = void 0;
  var jg3 = E6B();
  Object.defineProperty(Aa1, "_globalThis", {
    enumerable: !0,
    get: function () {
      return jg3._globalThis
    }
  })
})
// @from(Ln 130991, Col 4)
$6B = U((Qa1) => {
  Object.defineProperty(Qa1, "__esModule", {
    value: !0
  });
  Qa1._globalThis = void 0;
  var Pg3 = z6B();
  Object.defineProperty(Qa1, "_globalThis", {
    enumerable: !0,
    get: function () {
      return Pg3._globalThis
    }
  })
})
// @from(Ln 131004, Col 4)
q6B = U((C6B) => {
  Object.defineProperty(C6B, "__esModule", {
    value: !0
  });
  C6B.API_BACKWARDS_COMPATIBILITY_VERSION = C6B.makeGetter = C6B._global = C6B.GLOBAL_LOGS_API_KEY = void 0;
  var xg3 = $6B();
  C6B.GLOBAL_LOGS_API_KEY = Symbol.for("io.opentelemetry.js.api.logs");
  C6B._global = xg3._globalThis;

  function yg3(A, Q, B) {
    return (G) => G === A ? Q : B
  }
  C6B.makeGetter = yg3;
  C6B.API_BACKWARDS_COMPATIBILITY_VERSION = 1
})
// @from(Ln 131019, Col 4)
O6B = U((w6B) => {
  Object.defineProperty(w6B, "__esModule", {
    value: !0
  });
  w6B.LogsAPI = void 0;
  var vR = q6B(),
    fg3 = tn1(),
    N6B = en1();
  class Ba1 {
    constructor() {
      this._proxyLoggerProvider = new N6B.ProxyLoggerProvider
    }
    static getInstance() {
      if (!this._instance) this._instance = new Ba1;
      return this._instance
    }
    setGlobalLoggerProvider(A) {
      if (vR._global[vR.GLOBAL_LOGS_API_KEY]) return this.getLoggerProvider();
      return vR._global[vR.GLOBAL_LOGS_API_KEY] = (0, vR.makeGetter)(vR.API_BACKWARDS_COMPATIBILITY_VERSION, A, fg3.NOOP_LOGGER_PROVIDER), this._proxyLoggerProvider._setDelegate(A), A
    }
    getLoggerProvider() {
      var A, Q;
      return (Q = (A = vR._global[vR.GLOBAL_LOGS_API_KEY]) === null || A === void 0 ? void 0 : A.call(vR._global, vR.API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && Q !== void 0 ? Q : this._proxyLoggerProvider
    }
    getLogger(A, Q, B) {
      return this.getLoggerProvider().getLogger(A, Q, B)
    }
    disable() {
      delete vR._global[vR.GLOBAL_LOGS_API_KEY], this._proxyLoggerProvider = new N6B.ProxyLoggerProvider
    }
  }
  w6B.LogsAPI = Ba1
})
// @from(Ln 131052, Col 4)
Ga1 = U((HXA) => {
  Object.defineProperty(HXA, "__esModule", {
    value: !0
  });
  HXA.logs = HXA.ProxyLoggerProvider = HXA.NoopLogger = HXA.NOOP_LOGGER = HXA.SeverityNumber = void 0;
  var hg3 = Q6B();
  Object.defineProperty(HXA, "SeverityNumber", {
    enumerable: !0,
    get: function () {
      return hg3.SeverityNumber
    }
  });
  var M6B = B11();
  Object.defineProperty(HXA, "NOOP_LOGGER", {
    enumerable: !0,
    get: function () {
      return M6B.NOOP_LOGGER
    }
  });
  Object.defineProperty(HXA, "NoopLogger", {
    enumerable: !0,
    get: function () {
      return M6B.NoopLogger
    }
  });
  var gg3 = en1();
  Object.defineProperty(HXA, "ProxyLoggerProvider", {
    enumerable: !0,
    get: function () {
      return gg3.ProxyLoggerProvider
    }
  });
  var ug3 = O6B();
  HXA.logs = ug3.LogsAPI.getInstance()
})
// @from(Ln 131087, Col 4)
QMA = U((_6B) => {
  Object.defineProperty(_6B, "__esModule", {
    value: !0
  });
  _6B.isTracingSuppressed = _6B.unsuppressTracing = _6B.suppressTracing = void 0;
  var mg3 = p9(),
    Za1 = (0, mg3.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

  function dg3(A) {
    return A.setValue(Za1, !0)
  }
  _6B.suppressTracing = dg3;

  function cg3(A) {
    return A.deleteValue(Za1)
  }
  _6B.unsuppressTracing = cg3;

  function pg3(A) {
    return A.getValue(Za1) === !0
  }
  _6B.isTracingSuppressed = pg3
})
// @from(Ln 131110, Col 4)
Ya1 = U((T6B) => {
  Object.defineProperty(T6B, "__esModule", {
    value: !0
  });
  T6B.BAGGAGE_MAX_TOTAL_LENGTH = T6B.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = T6B.BAGGAGE_MAX_NAME_VALUE_PAIRS = T6B.BAGGAGE_HEADER = T6B.BAGGAGE_ITEMS_SEPARATOR = T6B.BAGGAGE_PROPERTIES_SEPARATOR = T6B.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
  T6B.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
  T6B.BAGGAGE_PROPERTIES_SEPARATOR = ";";
  T6B.BAGGAGE_ITEMS_SEPARATOR = ",";
  T6B.BAGGAGE_HEADER = "baggage";
  T6B.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
  T6B.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
  T6B.BAGGAGE_MAX_TOTAL_LENGTH = 8192
})
// @from(Ln 131123, Col 4)
Ja1 = U((x6B) => {
  Object.defineProperty(x6B, "__esModule", {
    value: !0
  });
  x6B.parseKeyPairsIntoRecord = x6B.parsePairKeyValue = x6B.getKeyPairs = x6B.serializeKeyPairs = void 0;
  var eg3 = p9(),
    SQA = Ya1();

  function Au3(A) {
    return A.reduce((Q, B) => {
      let G = `${Q}${Q!==""?SQA.BAGGAGE_ITEMS_SEPARATOR:""}${B}`;
      return G.length > SQA.BAGGAGE_MAX_TOTAL_LENGTH ? Q : G
    }, "")
  }
  x6B.serializeKeyPairs = Au3;

  function Qu3(A) {
    return A.getAllEntries().map(([Q, B]) => {
      let G = `${encodeURIComponent(Q)}=${encodeURIComponent(B.value)}`;
      if (B.metadata !== void 0) G += SQA.BAGGAGE_PROPERTIES_SEPARATOR + B.metadata.toString();
      return G
    })
  }
  x6B.getKeyPairs = Qu3;

  function S6B(A) {
    let Q = A.split(SQA.BAGGAGE_PROPERTIES_SEPARATOR);
    if (Q.length <= 0) return;
    let B = Q.shift();
    if (!B) return;
    let G = B.indexOf(SQA.BAGGAGE_KEY_PAIR_SEPARATOR);
    if (G <= 0) return;
    let Z = decodeURIComponent(B.substring(0, G).trim()),
      Y = decodeURIComponent(B.substring(G + 1).trim()),
      J;
    if (Q.length > 0) J = (0, eg3.baggageEntryMetadataFromString)(Q.join(SQA.BAGGAGE_PROPERTIES_SEPARATOR));
    return {
      key: Z,
      value: Y,
      metadata: J
    }
  }
  x6B.parsePairKeyValue = S6B;

  function Bu3(A) {
    let Q = {};
    if (typeof A === "string" && A.length > 0) A.split(SQA.BAGGAGE_ITEMS_SEPARATOR).forEach((B) => {
      let G = S6B(B);
      if (G !== void 0 && G.value.length > 0) Q[G.key] = G.value
    });
    return Q
  }
  x6B.parseKeyPairsIntoRecord = Bu3
})
// @from(Ln 131177, Col 4)
f6B = U((k6B) => {
  Object.defineProperty(k6B, "__esModule", {
    value: !0
  });
  k6B.W3CBaggagePropagator = void 0;
  var Xa1 = p9(),
    Ju3 = QMA(),
    xQA = Ya1(),
    Ia1 = Ja1();
  class v6B {
    inject(A, Q, B) {
      let G = Xa1.propagation.getBaggage(A);
      if (!G || (0, Ju3.isTracingSuppressed)(A)) return;
      let Z = (0, Ia1.getKeyPairs)(G).filter((J) => {
          return J.length <= xQA.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS
        }).slice(0, xQA.BAGGAGE_MAX_NAME_VALUE_PAIRS),
        Y = (0, Ia1.serializeKeyPairs)(Z);
      if (Y.length > 0) B.set(Q, xQA.BAGGAGE_HEADER, Y)
    }
    extract(A, Q, B) {
      let G = B.get(Q, xQA.BAGGAGE_HEADER),
        Z = Array.isArray(G) ? G.join(xQA.BAGGAGE_ITEMS_SEPARATOR) : G;
      if (!Z) return A;
      let Y = {};
      if (Z.length === 0) return A;
      if (Z.split(xQA.BAGGAGE_ITEMS_SEPARATOR).forEach((X) => {
          let I = (0, Ia1.parsePairKeyValue)(X);
          if (I) {
            let D = {
              value: I.value
            };
            if (I.metadata) D.metadata = I.metadata;
            Y[I.key] = D
          }
        }), Object.entries(Y).length === 0) return A;
      return Xa1.propagation.setBaggage(A, Xa1.propagation.createBaggage(Y))
    }
    fields() {
      return [xQA.BAGGAGE_HEADER]
    }
  }
  k6B.W3CBaggagePropagator = v6B
})
// @from(Ln 131220, Col 4)
m6B = U((g6B) => {
  Object.defineProperty(g6B, "__esModule", {
    value: !0
  });
  g6B.AnchoredClock = void 0;
  class h6B {
    _monotonicClock;
    _epochMillis;
    _performanceMillis;
    constructor(A, Q) {
      this._monotonicClock = Q, this._epochMillis = A.now(), this._performanceMillis = Q.now()
    }
    now() {
      let A = this._monotonicClock.now() - this._performanceMillis;
      return this._epochMillis + A
    }
  }
  g6B.AnchoredClock = h6B
})
// @from(Ln 131239, Col 4)
a6B = U((i6B) => {
  Object.defineProperty(i6B, "__esModule", {
    value: !0
  });
  i6B.isAttributeValue = i6B.isAttributeKey = i6B.sanitizeAttributes = void 0;
  var d6B = p9();

  function Xu3(A) {
    let Q = {};
    if (typeof A !== "object" || A == null) return Q;
    for (let B in A) {
      if (!Object.prototype.hasOwnProperty.call(A, B)) continue;
      if (!c6B(B)) {
        d6B.diag.warn(`Invalid attribute key: ${B}`);
        continue
      }
      let G = A[B];
      if (!p6B(G)) {
        d6B.diag.warn(`Invalid attribute value set for key: ${B}`);
        continue
      }
      if (Array.isArray(G)) Q[B] = G.slice();
      else Q[B] = G
    }
    return Q
  }
  i6B.sanitizeAttributes = Xu3;

  function c6B(A) {
    return typeof A === "string" && A !== ""
  }
  i6B.isAttributeKey = c6B;

  function p6B(A) {
    if (A == null) return !0;
    if (Array.isArray(A)) return Iu3(A);
    return l6B(typeof A)
  }
  i6B.isAttributeValue = p6B;

  function Iu3(A) {
    let Q;
    for (let B of A) {
      if (B == null) continue;
      let G = typeof B;
      if (G === Q) continue;
      if (!Q) {
        if (l6B(G)) {
          Q = G;
          continue
        }
        return !1
      }
      return !1
    }
    return !0
  }

  function l6B(A) {
    switch (A) {
      case "number":
      case "boolean":
      case "string":
        return !0
    }
    return !1
  }
})
// @from(Ln 131307, Col 4)
Da1 = U((o6B) => {
  Object.defineProperty(o6B, "__esModule", {
    value: !0
  });
  o6B.loggingErrorHandler = void 0;
  var Ku3 = p9();

  function Vu3() {
    return (A) => {
      Ku3.diag.error(Fu3(A))
    }
  }
  o6B.loggingErrorHandler = Vu3;

  function Fu3(A) {
    if (typeof A === "string") return A;
    else return JSON.stringify(Hu3(A))
  }

  function Hu3(A) {
    let Q = {},
      B = A;
    while (B !== null) Object.getOwnPropertyNames(B).forEach((G) => {
      if (Q[G]) return;
      let Z = B[G];
      if (Z) Q[G] = String(Z)
    }), B = Object.getPrototypeOf(B);
    return Q
  }
})
// @from(Ln 131337, Col 4)
A3B = U((t6B) => {
  Object.defineProperty(t6B, "__esModule", {
    value: !0
  });
  t6B.globalErrorHandler = t6B.setGlobalErrorHandler = void 0;
  var Eu3 = Da1(),
    s6B = (0, Eu3.loggingErrorHandler)();

  function zu3(A) {
    s6B = A
  }
  t6B.setGlobalErrorHandler = zu3;

  function $u3(A) {
    try {
      s6B(A)
    } catch {}
  }
  t6B.globalErrorHandler = $u3
})
// @from(Ln 131357, Col 4)
J3B = U((Z3B) => {
  Object.defineProperty(Z3B, "__esModule", {
    value: !0
  });
  Z3B.getStringListFromEnv = Z3B.getBooleanFromEnv = Z3B.getStringFromEnv = Z3B.getNumberFromEnv = void 0;
  var Q3B = p9(),
    B3B = NA("util");

  function Uu3(A) {
    let Q = process.env[A];
    if (Q == null || Q.trim() === "") return;
    let B = Number(Q);
    if (isNaN(B)) {
      Q3B.diag.warn(`Unknown value ${(0,B3B.inspect)(Q)} for ${A}, expected a number, using defaults`);
      return
    }
    return B
  }
  Z3B.getNumberFromEnv = Uu3;

  function G3B(A) {
    let Q = process.env[A];
    if (Q == null || Q.trim() === "") return;
    return Q
  }
  Z3B.getStringFromEnv = G3B;

  function qu3(A) {
    let Q = process.env[A]?.trim().toLowerCase();
    if (Q == null || Q === "") return !1;
    if (Q === "true") return !0;
    else if (Q === "false") return !1;
    else return Q3B.diag.warn(`Unknown value ${(0,B3B.inspect)(Q)} for ${A}, expected 'true' or 'false', falling back to 'false' (default)`), !1
  }
  Z3B.getBooleanFromEnv = qu3;

  function Nu3(A) {
    return G3B(A)?.split(",").map((Q) => Q.trim()).filter((Q) => Q !== "")
  }
  Z3B.getStringListFromEnv = Nu3
})
// @from(Ln 131398, Col 4)
D3B = U((X3B) => {
  Object.defineProperty(X3B, "__esModule", {
    value: !0
  });
  X3B._globalThis = void 0;
  X3B._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Ln 131405, Col 4)
V3B = U((W3B) => {
  Object.defineProperty(W3B, "__esModule", {
    value: !0
  });
  W3B.otperformance = void 0;
  var Mu3 = NA("perf_hooks");
  W3B.otperformance = Mu3.performance
})
// @from(Ln 131413, Col 4)
E3B = U((F3B) => {
  Object.defineProperty(F3B, "__esModule", {
    value: !0
  });
  F3B.VERSION = void 0;
  F3B.VERSION = "2.2.0"
})
// @from(Ln 131420, Col 4)
Wa1 = U((z3B) => {
  Object.defineProperty(z3B, "__esModule", {
    value: !0
  });
  z3B.createConstMap = void 0;

  function Ru3(A) {
    let Q = {},
      B = A.length;
    for (let G = 0; G < B; G++) {
      let Z = A[G];
      if (Z) Q[String(Z).toUpperCase().replace(/[-.]/g, "_")] = Z
    }
    return Q
  }
  z3B.createConstMap = Ru3
})
// @from(Ln 131437, Col 4)
HZB = U((XZB) => {
  Object.defineProperty(XZB, "__esModule", {
    value: !0
  });
  XZB.SEMATTRS_NET_HOST_CARRIER_ICC = XZB.SEMATTRS_NET_HOST_CARRIER_MNC = XZB.SEMATTRS_NET_HOST_CARRIER_MCC = XZB.SEMATTRS_NET_HOST_CARRIER_NAME = XZB.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = XZB.SEMATTRS_NET_HOST_CONNECTION_TYPE = XZB.SEMATTRS_NET_HOST_NAME = XZB.SEMATTRS_NET_HOST_PORT = XZB.SEMATTRS_NET_HOST_IP = XZB.SEMATTRS_NET_PEER_NAME = XZB.SEMATTRS_NET_PEER_PORT = XZB.SEMATTRS_NET_PEER_IP = XZB.SEMATTRS_NET_TRANSPORT = XZB.SEMATTRS_FAAS_INVOKED_REGION = XZB.SEMATTRS_FAAS_INVOKED_PROVIDER = XZB.SEMATTRS_FAAS_INVOKED_NAME = XZB.SEMATTRS_FAAS_COLDSTART = XZB.SEMATTRS_FAAS_CRON = XZB.SEMATTRS_FAAS_TIME = XZB.SEMATTRS_FAAS_DOCUMENT_NAME = XZB.SEMATTRS_FAAS_DOCUMENT_TIME = XZB.SEMATTRS_FAAS_DOCUMENT_OPERATION = XZB.SEMATTRS_FAAS_DOCUMENT_COLLECTION = XZB.SEMATTRS_FAAS_EXECUTION = XZB.SEMATTRS_FAAS_TRIGGER = XZB.SEMATTRS_EXCEPTION_ESCAPED = XZB.SEMATTRS_EXCEPTION_STACKTRACE = XZB.SEMATTRS_EXCEPTION_MESSAGE = XZB.SEMATTRS_EXCEPTION_TYPE = XZB.SEMATTRS_DB_SQL_TABLE = XZB.SEMATTRS_DB_MONGODB_COLLECTION = XZB.SEMATTRS_DB_REDIS_DATABASE_INDEX = XZB.SEMATTRS_DB_HBASE_NAMESPACE = XZB.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = XZB.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = XZB.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = XZB.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = XZB.SEMATTRS_DB_CASSANDRA_TABLE = XZB.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = XZB.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = XZB.SEMATTRS_DB_CASSANDRA_KEYSPACE = XZB.SEMATTRS_DB_MSSQL_INSTANCE_NAME = XZB.SEMATTRS_DB_OPERATION = XZB.SEMATTRS_DB_STATEMENT = XZB.SEMATTRS_DB_NAME = XZB.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = XZB.SEMATTRS_DB_USER = XZB.SEMATTRS_DB_CONNECTION_STRING = XZB.SEMATTRS_DB_SYSTEM = XZB.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
  XZB.SEMATTRS_MESSAGING_DESTINATION_KIND = XZB.SEMATTRS_MESSAGING_DESTINATION = XZB.SEMATTRS_MESSAGING_SYSTEM = XZB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = XZB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = XZB.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = XZB.SEMATTRS_AWS_DYNAMODB_COUNT = XZB.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = XZB.SEMATTRS_AWS_DYNAMODB_SEGMENT = XZB.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = XZB.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = XZB.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = XZB.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = XZB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = XZB.SEMATTRS_AWS_DYNAMODB_SELECT = XZB.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = XZB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = XZB.SEMATTRS_AWS_DYNAMODB_LIMIT = XZB.SEMATTRS_AWS_DYNAMODB_PROJECTION = XZB.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = XZB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = XZB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = XZB.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = XZB.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = XZB.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = XZB.SEMATTRS_HTTP_CLIENT_IP = XZB.SEMATTRS_HTTP_ROUTE = XZB.SEMATTRS_HTTP_SERVER_NAME = XZB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = XZB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = XZB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = XZB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = XZB.SEMATTRS_HTTP_USER_AGENT = XZB.SEMATTRS_HTTP_FLAVOR = XZB.SEMATTRS_HTTP_STATUS_CODE = XZB.SEMATTRS_HTTP_SCHEME = XZB.SEMATTRS_HTTP_HOST = XZB.SEMATTRS_HTTP_TARGET = XZB.SEMATTRS_HTTP_URL = XZB.SEMATTRS_HTTP_METHOD = XZB.SEMATTRS_CODE_LINENO = XZB.SEMATTRS_CODE_FILEPATH = XZB.SEMATTRS_CODE_NAMESPACE = XZB.SEMATTRS_CODE_FUNCTION = XZB.SEMATTRS_THREAD_NAME = XZB.SEMATTRS_THREAD_ID = XZB.SEMATTRS_ENDUSER_SCOPE = XZB.SEMATTRS_ENDUSER_ROLE = XZB.SEMATTRS_ENDUSER_ID = XZB.SEMATTRS_PEER_SERVICE = void 0;
  XZB.DBSYSTEMVALUES_FILEMAKER = XZB.DBSYSTEMVALUES_DERBY = XZB.DBSYSTEMVALUES_FIREBIRD = XZB.DBSYSTEMVALUES_ADABAS = XZB.DBSYSTEMVALUES_CACHE = XZB.DBSYSTEMVALUES_EDB = XZB.DBSYSTEMVALUES_FIRSTSQL = XZB.DBSYSTEMVALUES_INGRES = XZB.DBSYSTEMVALUES_HANADB = XZB.DBSYSTEMVALUES_MAXDB = XZB.DBSYSTEMVALUES_PROGRESS = XZB.DBSYSTEMVALUES_HSQLDB = XZB.DBSYSTEMVALUES_CLOUDSCAPE = XZB.DBSYSTEMVALUES_HIVE = XZB.DBSYSTEMVALUES_REDSHIFT = XZB.DBSYSTEMVALUES_POSTGRESQL = XZB.DBSYSTEMVALUES_DB2 = XZB.DBSYSTEMVALUES_ORACLE = XZB.DBSYSTEMVALUES_MYSQL = XZB.DBSYSTEMVALUES_MSSQL = XZB.DBSYSTEMVALUES_OTHER_SQL = XZB.SemanticAttributes = XZB.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = XZB.SEMATTRS_MESSAGE_COMPRESSED_SIZE = XZB.SEMATTRS_MESSAGE_ID = XZB.SEMATTRS_MESSAGE_TYPE = XZB.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = XZB.SEMATTRS_RPC_JSONRPC_ERROR_CODE = XZB.SEMATTRS_RPC_JSONRPC_REQUEST_ID = XZB.SEMATTRS_RPC_JSONRPC_VERSION = XZB.SEMATTRS_RPC_GRPC_STATUS_CODE = XZB.SEMATTRS_RPC_METHOD = XZB.SEMATTRS_RPC_SERVICE = XZB.SEMATTRS_RPC_SYSTEM = XZB.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = XZB.SEMATTRS_MESSAGING_KAFKA_PARTITION = XZB.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = XZB.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = XZB.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = XZB.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = XZB.SEMATTRS_MESSAGING_CONSUMER_ID = XZB.SEMATTRS_MESSAGING_OPERATION = XZB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = XZB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = XZB.SEMATTRS_MESSAGING_CONVERSATION_ID = XZB.SEMATTRS_MESSAGING_MESSAGE_ID = XZB.SEMATTRS_MESSAGING_URL = XZB.SEMATTRS_MESSAGING_PROTOCOL_VERSION = XZB.SEMATTRS_MESSAGING_PROTOCOL = XZB.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
  XZB.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = XZB.FaasDocumentOperationValues = XZB.FAASDOCUMENTOPERATIONVALUES_DELETE = XZB.FAASDOCUMENTOPERATIONVALUES_EDIT = XZB.FAASDOCUMENTOPERATIONVALUES_INSERT = XZB.FaasTriggerValues = XZB.FAASTRIGGERVALUES_OTHER = XZB.FAASTRIGGERVALUES_TIMER = XZB.FAASTRIGGERVALUES_PUBSUB = XZB.FAASTRIGGERVALUES_HTTP = XZB.FAASTRIGGERVALUES_DATASOURCE = XZB.DbCassandraConsistencyLevelValues = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = XZB.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = XZB.DbSystemValues = XZB.DBSYSTEMVALUES_COCKROACHDB = XZB.DBSYSTEMVALUES_MEMCACHED = XZB.DBSYSTEMVALUES_ELASTICSEARCH = XZB.DBSYSTEMVALUES_GEODE = XZB.DBSYSTEMVALUES_NEO4J = XZB.DBSYSTEMVALUES_DYNAMODB = XZB.DBSYSTEMVALUES_COSMOSDB = XZB.DBSYSTEMVALUES_COUCHDB = XZB.DBSYSTEMVALUES_COUCHBASE = XZB.DBSYSTEMVALUES_REDIS = XZB.DBSYSTEMVALUES_MONGODB = XZB.DBSYSTEMVALUES_HBASE = XZB.DBSYSTEMVALUES_CASSANDRA = XZB.DBSYSTEMVALUES_COLDFUSION = XZB.DBSYSTEMVALUES_H2 = XZB.DBSYSTEMVALUES_VERTICA = XZB.DBSYSTEMVALUES_TERADATA = XZB.DBSYSTEMVALUES_SYBASE = XZB.DBSYSTEMVALUES_SQLITE = XZB.DBSYSTEMVALUES_POINTBASE = XZB.DBSYSTEMVALUES_PERVASIVE = XZB.DBSYSTEMVALUES_NETEZZA = XZB.DBSYSTEMVALUES_MARIADB = XZB.DBSYSTEMVALUES_INTERBASE = XZB.DBSYSTEMVALUES_INSTANTDB = XZB.DBSYSTEMVALUES_INFORMIX = void 0;
  XZB.MESSAGINGOPERATIONVALUES_RECEIVE = XZB.MessagingDestinationKindValues = XZB.MESSAGINGDESTINATIONKINDVALUES_TOPIC = XZB.MESSAGINGDESTINATIONKINDVALUES_QUEUE = XZB.HttpFlavorValues = XZB.HTTPFLAVORVALUES_QUIC = XZB.HTTPFLAVORVALUES_SPDY = XZB.HTTPFLAVORVALUES_HTTP_2_0 = XZB.HTTPFLAVORVALUES_HTTP_1_1 = XZB.HTTPFLAVORVALUES_HTTP_1_0 = XZB.NetHostConnectionSubtypeValues = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_NR = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = XZB.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = XZB.NetHostConnectionTypeValues = XZB.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = XZB.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = XZB.NETHOSTCONNECTIONTYPEVALUES_CELL = XZB.NETHOSTCONNECTIONTYPEVALUES_WIRED = XZB.NETHOSTCONNECTIONTYPEVALUES_WIFI = XZB.NetTransportValues = XZB.NETTRANSPORTVALUES_OTHER = XZB.NETTRANSPORTVALUES_INPROC = XZB.NETTRANSPORTVALUES_PIPE = XZB.NETTRANSPORTVALUES_UNIX = XZB.NETTRANSPORTVALUES_IP = XZB.NETTRANSPORTVALUES_IP_UDP = XZB.NETTRANSPORTVALUES_IP_TCP = XZB.FaasInvokedProviderValues = XZB.FAASINVOKEDPROVIDERVALUES_GCP = XZB.FAASINVOKEDPROVIDERVALUES_AZURE = XZB.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
  XZB.MessageTypeValues = XZB.MESSAGETYPEVALUES_RECEIVED = XZB.MESSAGETYPEVALUES_SENT = XZB.RpcGrpcStatusCodeValues = XZB.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = XZB.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = XZB.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = XZB.RPCGRPCSTATUSCODEVALUES_INTERNAL = XZB.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = XZB.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = XZB.RPCGRPCSTATUSCODEVALUES_ABORTED = XZB.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = XZB.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = XZB.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = XZB.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = XZB.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = XZB.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = XZB.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = XZB.RPCGRPCSTATUSCODEVALUES_UNKNOWN = XZB.RPCGRPCSTATUSCODEVALUES_CANCELLED = XZB.RPCGRPCSTATUSCODEVALUES_OK = XZB.MessagingOperationValues = XZB.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
  var kR = Wa1(),
    C3B = "aws.lambda.invoked_arn",
    U3B = "db.system",
    q3B = "db.connection_string",
    N3B = "db.user",
    w3B = "db.jdbc.driver_classname",
    L3B = "db.name",
    O3B = "db.statement",
    M3B = "db.operation",
    R3B = "db.mssql.instance_name",
    _3B = "db.cassandra.keyspace",
    j3B = "db.cassandra.page_size",
    T3B = "db.cassandra.consistency_level",
    P3B = "db.cassandra.table",
    S3B = "db.cassandra.idempotence",
    x3B = "db.cassandra.speculative_execution_count",
    y3B = "db.cassandra.coordinator.id",
    v3B = "db.cassandra.coordinator.dc",
    k3B = "db.hbase.namespace",
    b3B = "db.redis.database_index",
    f3B = "db.mongodb.collection",
    h3B = "db.sql.table",
    g3B = "exception.type",
    u3B = "exception.message",
    m3B = "exception.stacktrace",
    d3B = "exception.escaped",
    c3B = "faas.trigger",
    p3B = "faas.execution",
    l3B = "faas.document.collection",
    i3B = "faas.document.operation",
    n3B = "faas.document.time",
    a3B = "faas.document.name",
    o3B = "faas.time",
    r3B = "faas.cron",
    s3B = "faas.coldstart",
    t3B = "faas.invoked_name",
    e3B = "faas.invoked_provider",
    A8B = "faas.invoked_region",
    Q8B = "net.transport",
    B8B = "net.peer.ip",
    G8B = "net.peer.port",
    Z8B = "net.peer.name",
    Y8B = "net.host.ip",
    J8B = "net.host.port",
    X8B = "net.host.name",
    I8B = "net.host.connection.type",
    D8B = "net.host.connection.subtype",
    W8B = "net.host.carrier.name",
    K8B = "net.host.carrier.mcc",
    V8B = "net.host.carrier.mnc",
    F8B = "net.host.carrier.icc",
    H8B = "peer.service",
    E8B = "enduser.id",
    z8B = "enduser.role",
    $8B = "enduser.scope",
    C8B = "thread.id",
    U8B = "thread.name",
    q8B = "code.function",
    N8B = "code.namespace",
    w8B = "code.filepath",
    L8B = "code.lineno",
    O8B = "http.method",
    M8B = "http.url",
    R8B = "http.target",
    _8B = "http.host",
    j8B = "http.scheme",
    T8B = "http.status_code",
    P8B = "http.flavor",
    S8B = "http.user_agent",
    x8B = "http.request_content_length",
    y8B = "http.request_content_length_uncompressed",
    v8B = "http.response_content_length",
    k8B = "http.response_content_length_uncompressed",
    b8B = "http.server_name",
    f8B = "http.route",
    h8B = "http.client_ip",
    g8B = "aws.dynamodb.table_names",
    u8B = "aws.dynamodb.consumed_capacity",
    m8B = "aws.dynamodb.item_collection_metrics",
    d8B = "aws.dynamodb.provisioned_read_capacity",
    c8B = "aws.dynamodb.provisioned_write_capacity",
    p8B = "aws.dynamodb.consistent_read",
    l8B = "aws.dynamodb.projection",
    i8B = "aws.dynamodb.limit",
    n8B = "aws.dynamodb.attributes_to_get",
    a8B = "aws.dynamodb.index_name",
    o8B = "aws.dynamodb.select",
    r8B = "aws.dynamodb.global_secondary_indexes",
    s8B = "aws.dynamodb.local_secondary_indexes",
    t8B = "aws.dynamodb.exclusive_start_table",
    e8B = "aws.dynamodb.table_count",
    A5B = "aws.dynamodb.scan_forward",
    Q5B = "aws.dynamodb.segment",
    B5B = "aws.dynamodb.total_segments",
    G5B = "aws.dynamodb.count",
    Z5B = "aws.dynamodb.scanned_count",
    Y5B = "aws.dynamodb.attribute_definitions",
    J5B = "aws.dynamodb.global_secondary_index_updates",
    X5B = "messaging.system",
    I5B = "messaging.destination",
    D5B = "messaging.destination_kind",
    W5B = "messaging.temp_destination",
    K5B = "messaging.protocol",
    V5B = "messaging.protocol_version",
    F5B = "messaging.url",
    H5B = "messaging.message_id",
    E5B = "messaging.conversation_id",
    z5B = "messaging.message_payload_size_bytes",
    $5B = "messaging.message_payload_compressed_size_bytes",
    C5B = "messaging.operation",
    U5B = "messaging.consumer_id",
    q5B = "messaging.rabbitmq.routing_key",
    N5B = "messaging.kafka.message_key",
    w5B = "messaging.kafka.consumer_group",
    L5B = "messaging.kafka.client_id",
    O5B = "messaging.kafka.partition",
    M5B = "messaging.kafka.tombstone",
    R5B = "rpc.system",
    _5B = "rpc.service",
    j5B = "rpc.method",
    T5B = "rpc.grpc.status_code",
    P5B = "rpc.jsonrpc.version",
    S5B = "rpc.jsonrpc.request_id",
    x5B = "rpc.jsonrpc.error_code",
    y5B = "rpc.jsonrpc.error_message",
    v5B = "message.type",
    k5B = "message.id",
    b5B = "message.compressed_size",
    f5B = "message.uncompressed_size";
  XZB.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = C3B;
  XZB.SEMATTRS_DB_SYSTEM = U3B;
  XZB.SEMATTRS_DB_CONNECTION_STRING = q3B;
  XZB.SEMATTRS_DB_USER = N3B;
  XZB.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = w3B;
  XZB.SEMATTRS_DB_NAME = L3B;
  XZB.SEMATTRS_DB_STATEMENT = O3B;
  XZB.SEMATTRS_DB_OPERATION = M3B;
  XZB.SEMATTRS_DB_MSSQL_INSTANCE_NAME = R3B;
  XZB.SEMATTRS_DB_CASSANDRA_KEYSPACE = _3B;
  XZB.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = j3B;
  XZB.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = T3B;
  XZB.SEMATTRS_DB_CASSANDRA_TABLE = P3B;
  XZB.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = S3B;
  XZB.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = x3B;
  XZB.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = y3B;
  XZB.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = v3B;
  XZB.SEMATTRS_DB_HBASE_NAMESPACE = k3B;
  XZB.SEMATTRS_DB_REDIS_DATABASE_INDEX = b3B;
  XZB.SEMATTRS_DB_MONGODB_COLLECTION = f3B;
  XZB.SEMATTRS_DB_SQL_TABLE = h3B;
  XZB.SEMATTRS_EXCEPTION_TYPE = g3B;
  XZB.SEMATTRS_EXCEPTION_MESSAGE = u3B;
  XZB.SEMATTRS_EXCEPTION_STACKTRACE = m3B;
  XZB.SEMATTRS_EXCEPTION_ESCAPED = d3B;
  XZB.SEMATTRS_FAAS_TRIGGER = c3B;
  XZB.SEMATTRS_FAAS_EXECUTION = p3B;
  XZB.SEMATTRS_FAAS_DOCUMENT_COLLECTION = l3B;
  XZB.SEMATTRS_FAAS_DOCUMENT_OPERATION = i3B;
  XZB.SEMATTRS_FAAS_DOCUMENT_TIME = n3B;
  XZB.SEMATTRS_FAAS_DOCUMENT_NAME = a3B;
  XZB.SEMATTRS_FAAS_TIME = o3B;
  XZB.SEMATTRS_FAAS_CRON = r3B;
  XZB.SEMATTRS_FAAS_COLDSTART = s3B;
  XZB.SEMATTRS_FAAS_INVOKED_NAME = t3B;
  XZB.SEMATTRS_FAAS_INVOKED_PROVIDER = e3B;
  XZB.SEMATTRS_FAAS_INVOKED_REGION = A8B;
  XZB.SEMATTRS_NET_TRANSPORT = Q8B;
  XZB.SEMATTRS_NET_PEER_IP = B8B;
  XZB.SEMATTRS_NET_PEER_PORT = G8B;
  XZB.SEMATTRS_NET_PEER_NAME = Z8B;
  XZB.SEMATTRS_NET_HOST_IP = Y8B;
  XZB.SEMATTRS_NET_HOST_PORT = J8B;
  XZB.SEMATTRS_NET_HOST_NAME = X8B;
  XZB.SEMATTRS_NET_HOST_CONNECTION_TYPE = I8B;
  XZB.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = D8B;
  XZB.SEMATTRS_NET_HOST_CARRIER_NAME = W8B;
  XZB.SEMATTRS_NET_HOST_CARRIER_MCC = K8B;
  XZB.SEMATTRS_NET_HOST_CARRIER_MNC = V8B;
  XZB.SEMATTRS_NET_HOST_CARRIER_ICC = F8B;
  XZB.SEMATTRS_PEER_SERVICE = H8B;
  XZB.SEMATTRS_ENDUSER_ID = E8B;
  XZB.SEMATTRS_ENDUSER_ROLE = z8B;
  XZB.SEMATTRS_ENDUSER_SCOPE = $8B;
  XZB.SEMATTRS_THREAD_ID = C8B;
  XZB.SEMATTRS_THREAD_NAME = U8B;
  XZB.SEMATTRS_CODE_FUNCTION = q8B;
  XZB.SEMATTRS_CODE_NAMESPACE = N8B;
  XZB.SEMATTRS_CODE_FILEPATH = w8B;
  XZB.SEMATTRS_CODE_LINENO = L8B;
  XZB.SEMATTRS_HTTP_METHOD = O8B;
  XZB.SEMATTRS_HTTP_URL = M8B;
  XZB.SEMATTRS_HTTP_TARGET = R8B;
  XZB.SEMATTRS_HTTP_HOST = _8B;
  XZB.SEMATTRS_HTTP_SCHEME = j8B;
  XZB.SEMATTRS_HTTP_STATUS_CODE = T8B;
  XZB.SEMATTRS_HTTP_FLAVOR = P8B;
  XZB.SEMATTRS_HTTP_USER_AGENT = S8B;
  XZB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = x8B;
  XZB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = y8B;
  XZB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = v8B;
  XZB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = k8B;
  XZB.SEMATTRS_HTTP_SERVER_NAME = b8B;
  XZB.SEMATTRS_HTTP_ROUTE = f8B;
  XZB.SEMATTRS_HTTP_CLIENT_IP = h8B;
  XZB.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = g8B;
  XZB.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = u8B;
  XZB.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = m8B;
  XZB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = d8B;
  XZB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = c8B;
  XZB.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = p8B;
  XZB.SEMATTRS_AWS_DYNAMODB_PROJECTION = l8B;
  XZB.SEMATTRS_AWS_DYNAMODB_LIMIT = i8B;
  XZB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = n8B;
  XZB.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = a8B;
  XZB.SEMATTRS_AWS_DYNAMODB_SELECT = o8B;
  XZB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = r8B;
  XZB.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = s8B;
  XZB.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = t8B;
  XZB.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = e8B;
  XZB.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = A5B;
  XZB.SEMATTRS_AWS_DYNAMODB_SEGMENT = Q5B;
  XZB.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = B5B;
  XZB.SEMATTRS_AWS_DYNAMODB_COUNT = G5B;
  XZB.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = Z5B;
  XZB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = Y5B;
  XZB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = J5B;
  XZB.SEMATTRS_MESSAGING_SYSTEM = X5B;
  XZB.SEMATTRS_MESSAGING_DESTINATION = I5B;
  XZB.SEMATTRS_MESSAGING_DESTINATION_KIND = D5B;
  XZB.SEMATTRS_MESSAGING_TEMP_DESTINATION = W5B;
  XZB.SEMATTRS_MESSAGING_PROTOCOL = K5B;
  XZB.SEMATTRS_MESSAGING_PROTOCOL_VERSION = V5B;
  XZB.SEMATTRS_MESSAGING_URL = F5B;
  XZB.SEMATTRS_MESSAGING_MESSAGE_ID = H5B;
  XZB.SEMATTRS_MESSAGING_CONVERSATION_ID = E5B;
  XZB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = z5B;
  XZB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = $5B;
  XZB.SEMATTRS_MESSAGING_OPERATION = C5B;
  XZB.SEMATTRS_MESSAGING_CONSUMER_ID = U5B;
  XZB.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = q5B;
  XZB.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = N5B;
  XZB.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = w5B;
  XZB.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = L5B;
  XZB.SEMATTRS_MESSAGING_KAFKA_PARTITION = O5B;
  XZB.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = M5B;
  XZB.SEMATTRS_RPC_SYSTEM = R5B;
  XZB.SEMATTRS_RPC_SERVICE = _5B;
  XZB.SEMATTRS_RPC_METHOD = j5B;
  XZB.SEMATTRS_RPC_GRPC_STATUS_CODE = T5B;
  XZB.SEMATTRS_RPC_JSONRPC_VERSION = P5B;
  XZB.SEMATTRS_RPC_JSONRPC_REQUEST_ID = S5B;
  XZB.SEMATTRS_RPC_JSONRPC_ERROR_CODE = x5B;
  XZB.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = y5B;
  XZB.SEMATTRS_MESSAGE_TYPE = v5B;
  XZB.SEMATTRS_MESSAGE_ID = k5B;
  XZB.SEMATTRS_MESSAGE_COMPRESSED_SIZE = b5B;
  XZB.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = f5B;
  XZB.SemanticAttributes = (0, kR.createConstMap)([C3B, U3B, q3B, N3B, w3B, L3B, O3B, M3B, R3B, _3B, j3B, T3B, P3B, S3B, x3B, y3B, v3B, k3B, b3B, f3B, h3B, g3B, u3B, m3B, d3B, c3B, p3B, l3B, i3B, n3B, a3B, o3B, r3B, s3B, t3B, e3B, A8B, Q8B, B8B, G8B, Z8B, Y8B, J8B, X8B, I8B, D8B, W8B, K8B, V8B, F8B, H8B, E8B, z8B, $8B, C8B, U8B, q8B, N8B, w8B, L8B, O8B, M8B, R8B, _8B, j8B, T8B, P8B, S8B, x8B, y8B, v8B, k8B, b8B, f8B, h8B, g8B, u8B, m8B, d8B, c8B, p8B, l8B, i8B, n8B, a8B, o8B, r8B, s8B, t8B, e8B, A5B, Q5B, B5B, G5B, Z5B, Y5B, J5B, X5B, I5B, D5B, W5B, K5B, V5B, F5B, H5B, E5B, z5B, $5B, C5B, U5B, q5B, N5B, w5B, L5B, O5B, M5B, R5B, _5B, j5B, T5B, P5B, S5B, x5B, y5B, v5B, k5B, b5B, f5B]);
  var h5B = "other_sql",
    g5B = "mssql",
    u5B = "mysql",
    m5B = "oracle",
    d5B = "db2",
    c5B = "postgresql",
    p5B = "redshift",
    l5B = "hive",
    i5B = "cloudscape",
    n5B = "hsqldb",
    a5B = "progress",
    o5B = "maxdb",
    r5B = "hanadb",
    s5B = "ingres",
    t5B = "firstsql",
    e5B = "edb",
    A7B = "cache",
    Q7B = "adabas",
    B7B = "firebird",
    G7B = "derby",
    Z7B = "filemaker",
    Y7B = "informix",
    J7B = "instantdb",
    X7B = "interbase",
    I7B = "mariadb",
    D7B = "netezza",
    W7B = "pervasive",
    K7B = "pointbase",
    V7B = "sqlite",
    F7B = "sybase",
    H7B = "teradata",
    E7B = "vertica",
    z7B = "h2",
    $7B = "coldfusion",
    C7B = "cassandra",
    U7B = "hbase",
    q7B = "mongodb",
    N7B = "redis",
    w7B = "couchbase",
    L7B = "couchdb",
    O7B = "cosmosdb",
    M7B = "dynamodb",
    R7B = "neo4j",
    _7B = "geode",
    j7B = "elasticsearch",
    T7B = "memcached",
    P7B = "cockroachdb";
  XZB.DBSYSTEMVALUES_OTHER_SQL = h5B;
  XZB.DBSYSTEMVALUES_MSSQL = g5B;
  XZB.DBSYSTEMVALUES_MYSQL = u5B;
  XZB.DBSYSTEMVALUES_ORACLE = m5B;
  XZB.DBSYSTEMVALUES_DB2 = d5B;
  XZB.DBSYSTEMVALUES_POSTGRESQL = c5B;
  XZB.DBSYSTEMVALUES_REDSHIFT = p5B;
  XZB.DBSYSTEMVALUES_HIVE = l5B;
  XZB.DBSYSTEMVALUES_CLOUDSCAPE = i5B;
  XZB.DBSYSTEMVALUES_HSQLDB = n5B;
  XZB.DBSYSTEMVALUES_PROGRESS = a5B;
  XZB.DBSYSTEMVALUES_MAXDB = o5B;
  XZB.DBSYSTEMVALUES_HANADB = r5B;
  XZB.DBSYSTEMVALUES_INGRES = s5B;
  XZB.DBSYSTEMVALUES_FIRSTSQL = t5B;
  XZB.DBSYSTEMVALUES_EDB = e5B;
  XZB.DBSYSTEMVALUES_CACHE = A7B;
  XZB.DBSYSTEMVALUES_ADABAS = Q7B;
  XZB.DBSYSTEMVALUES_FIREBIRD = B7B;
  XZB.DBSYSTEMVALUES_DERBY = G7B;
  XZB.DBSYSTEMVALUES_FILEMAKER = Z7B;
  XZB.DBSYSTEMVALUES_INFORMIX = Y7B;
  XZB.DBSYSTEMVALUES_INSTANTDB = J7B;
  XZB.DBSYSTEMVALUES_INTERBASE = X7B;
  XZB.DBSYSTEMVALUES_MARIADB = I7B;
  XZB.DBSYSTEMVALUES_NETEZZA = D7B;
  XZB.DBSYSTEMVALUES_PERVASIVE = W7B;
  XZB.DBSYSTEMVALUES_POINTBASE = K7B;
  XZB.DBSYSTEMVALUES_SQLITE = V7B;
  XZB.DBSYSTEMVALUES_SYBASE = F7B;
  XZB.DBSYSTEMVALUES_TERADATA = H7B;
  XZB.DBSYSTEMVALUES_VERTICA = E7B;
  XZB.DBSYSTEMVALUES_H2 = z7B;
  XZB.DBSYSTEMVALUES_COLDFUSION = $7B;
  XZB.DBSYSTEMVALUES_CASSANDRA = C7B;
  XZB.DBSYSTEMVALUES_HBASE = U7B;
  XZB.DBSYSTEMVALUES_MONGODB = q7B;
  XZB.DBSYSTEMVALUES_REDIS = N7B;
  XZB.DBSYSTEMVALUES_COUCHBASE = w7B;
  XZB.DBSYSTEMVALUES_COUCHDB = L7B;
  XZB.DBSYSTEMVALUES_COSMOSDB = O7B;
  XZB.DBSYSTEMVALUES_DYNAMODB = M7B;
  XZB.DBSYSTEMVALUES_NEO4J = R7B;
  XZB.DBSYSTEMVALUES_GEODE = _7B;
  XZB.DBSYSTEMVALUES_ELASTICSEARCH = j7B;
  XZB.DBSYSTEMVALUES_MEMCACHED = T7B;
  XZB.DBSYSTEMVALUES_COCKROACHDB = P7B;
  XZB.DbSystemValues = (0, kR.createConstMap)([h5B, g5B, u5B, m5B, d5B, c5B, p5B, l5B, i5B, n5B, a5B, o5B, r5B, s5B, t5B, e5B, A7B, Q7B, B7B, G7B, Z7B, Y7B, J7B, X7B, I7B, D7B, W7B, K7B, V7B, F7B, H7B, E7B, z7B, $7B, C7B, U7B, q7B, N7B, w7B, L7B, O7B, M7B, R7B, _7B, j7B, T7B, P7B]);
  var S7B = "all",
    x7B = "each_quorum",
    y7B = "quorum",
    v7B = "local_quorum",
    k7B = "one",
    b7B = "two",
    f7B = "three",
    h7B = "local_one",
    g7B = "any",
    u7B = "serial",
    m7B = "local_serial";
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = S7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = x7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = y7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = v7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = k7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = b7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = f7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = h7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = g7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = u7B;
  XZB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = m7B;
  XZB.DbCassandraConsistencyLevelValues = (0, kR.createConstMap)([S7B, x7B, y7B, v7B, k7B, b7B, f7B, h7B, g7B, u7B, m7B]);
  var d7B = "datasource",
    c7B = "http",
    p7B = "pubsub",
    l7B = "timer",
    i7B = "other";
  XZB.FAASTRIGGERVALUES_DATASOURCE = d7B;
  XZB.FAASTRIGGERVALUES_HTTP = c7B;
  XZB.FAASTRIGGERVALUES_PUBSUB = p7B;
  XZB.FAASTRIGGERVALUES_TIMER = l7B;
  XZB.FAASTRIGGERVALUES_OTHER = i7B;
  XZB.FaasTriggerValues = (0, kR.createConstMap)([d7B, c7B, p7B, l7B, i7B]);
  var n7B = "insert",
    a7B = "edit",
    o7B = "delete";
  XZB.FAASDOCUMENTOPERATIONVALUES_INSERT = n7B;
  XZB.FAASDOCUMENTOPERATIONVALUES_EDIT = a7B;
  XZB.FAASDOCUMENTOPERATIONVALUES_DELETE = o7B;
  XZB.FaasDocumentOperationValues = (0, kR.createConstMap)([n7B, a7B, o7B]);
  var r7B = "alibaba_cloud",
    s7B = "aws",
    t7B = "azure",
    e7B = "gcp";
  XZB.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = r7B;
  XZB.FAASINVOKEDPROVIDERVALUES_AWS = s7B;
  XZB.FAASINVOKEDPROVIDERVALUES_AZURE = t7B;
  XZB.FAASINVOKEDPROVIDERVALUES_GCP = e7B;
  XZB.FaasInvokedProviderValues = (0, kR.createConstMap)([r7B, s7B, t7B, e7B]);
  var AGB = "ip_tcp",
    QGB = "ip_udp",
    BGB = "ip",
    GGB = "unix",
    ZGB = "pipe",
    YGB = "inproc",
    JGB = "other";
  XZB.NETTRANSPORTVALUES_IP_TCP = AGB;
  XZB.NETTRANSPORTVALUES_IP_UDP = QGB;
  XZB.NETTRANSPORTVALUES_IP = BGB;
  XZB.NETTRANSPORTVALUES_UNIX = GGB;
  XZB.NETTRANSPORTVALUES_PIPE = ZGB;
  XZB.NETTRANSPORTVALUES_INPROC = YGB;
  XZB.NETTRANSPORTVALUES_OTHER = JGB;
  XZB.NetTransportValues = (0, kR.createConstMap)([AGB, QGB, BGB, GGB, ZGB, YGB, JGB]);
  var XGB = "wifi",
    IGB = "wired",
    DGB = "cell",
    WGB = "unavailable",
    KGB = "unknown";
  XZB.NETHOSTCONNECTIONTYPEVALUES_WIFI = XGB;
  XZB.NETHOSTCONNECTIONTYPEVALUES_WIRED = IGB;
  XZB.NETHOSTCONNECTIONTYPEVALUES_CELL = DGB;
  XZB.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = WGB;
  XZB.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = KGB;
  XZB.NetHostConnectionTypeValues = (0, kR.createConstMap)([XGB, IGB, DGB, WGB, KGB]);
  var VGB = "gprs",
    FGB = "edge",
    HGB = "umts",
    EGB = "cdma",
    zGB = "evdo_0",
    $GB = "evdo_a",
    CGB = "cdma2000_1xrtt",
    UGB = "hsdpa",
    qGB = "hsupa",
    NGB = "hspa",
    wGB = "iden",
    LGB = "evdo_b",
    OGB = "lte",
    MGB = "ehrpd",
    RGB = "hspap",
    _GB = "gsm",
    jGB = "td_scdma",
    TGB = "iwlan",
    PGB = "nr",
    SGB = "nrnsa",
    xGB = "lte_ca";
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = VGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = FGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = HGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = EGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = zGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = $GB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = CGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = UGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = qGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = NGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = wGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = LGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = OGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = MGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = RGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = _GB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = jGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = TGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_NR = PGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = SGB;
  XZB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = xGB;
  XZB.NetHostConnectionSubtypeValues = (0, kR.createConstMap)([VGB, FGB, HGB, EGB, zGB, $GB, CGB, UGB, qGB, NGB, wGB, LGB, OGB, MGB, RGB, _GB, jGB, TGB, PGB, SGB, xGB]);
  var yGB = "1.0",
    vGB = "1.1",
    kGB = "2.0",
    bGB = "SPDY",
    fGB = "QUIC";
  XZB.HTTPFLAVORVALUES_HTTP_1_0 = yGB;
  XZB.HTTPFLAVORVALUES_HTTP_1_1 = vGB;
  XZB.HTTPFLAVORVALUES_HTTP_2_0 = kGB;
  XZB.HTTPFLAVORVALUES_SPDY = bGB;
  XZB.HTTPFLAVORVALUES_QUIC = fGB;
  XZB.HttpFlavorValues = {
    HTTP_1_0: yGB,
    HTTP_1_1: vGB,
    HTTP_2_0: kGB,
    SPDY: bGB,
    QUIC: fGB
  };
  var hGB = "queue",
    gGB = "topic";
  XZB.MESSAGINGDESTINATIONKINDVALUES_QUEUE = hGB;
  XZB.MESSAGINGDESTINATIONKINDVALUES_TOPIC = gGB;
  XZB.MessagingDestinationKindValues = (0, kR.createConstMap)([hGB, gGB]);
  var uGB = "receive",
    mGB = "process";
  XZB.MESSAGINGOPERATIONVALUES_RECEIVE = uGB;
  XZB.MESSAGINGOPERATIONVALUES_PROCESS = mGB;
  XZB.MessagingOperationValues = (0, kR.createConstMap)([uGB, mGB]);
  var dGB = 0,
    cGB = 1,
    pGB = 2,
    lGB = 3,
    iGB = 4,
    nGB = 5,
    aGB = 6,
    oGB = 7,
    rGB = 8,
    sGB = 9,
    tGB = 10,
    eGB = 11,
    AZB = 12,
    QZB = 13,
    BZB = 14,
    GZB = 15,
    ZZB = 16;
  XZB.RPCGRPCSTATUSCODEVALUES_OK = dGB;
  XZB.RPCGRPCSTATUSCODEVALUES_CANCELLED = cGB;
  XZB.RPCGRPCSTATUSCODEVALUES_UNKNOWN = pGB;
  XZB.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = lGB;
  XZB.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = iGB;
  XZB.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = nGB;
  XZB.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = aGB;
  XZB.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = oGB;
  XZB.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = rGB;
  XZB.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = sGB;
  XZB.RPCGRPCSTATUSCODEVALUES_ABORTED = tGB;
  XZB.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = eGB;
  XZB.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = AZB;
  XZB.RPCGRPCSTATUSCODEVALUES_INTERNAL = QZB;
  XZB.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = BZB;
  XZB.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = GZB;
  XZB.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = ZZB;
  XZB.RpcGrpcStatusCodeValues = {
    OK: dGB,
    CANCELLED: cGB,
    UNKNOWN: pGB,
    INVALID_ARGUMENT: lGB,
    DEADLINE_EXCEEDED: iGB,
    NOT_FOUND: nGB,
    ALREADY_EXISTS: aGB,
    PERMISSION_DENIED: oGB,
    RESOURCE_EXHAUSTED: rGB,
    FAILED_PRECONDITION: sGB,
    ABORTED: tGB,
    OUT_OF_RANGE: eGB,
    UNIMPLEMENTED: AZB,
    INTERNAL: QZB,
    UNAVAILABLE: BZB,
    DATA_LOSS: GZB,
    UNAUTHENTICATED: ZZB
  };
  var YZB = "SENT",
    JZB = "RECEIVED";
  XZB.MESSAGETYPEVALUES_SENT = YZB;
  XZB.MESSAGETYPEVALUES_RECEIVED = JZB;
  XZB.MessageTypeValues = (0, kR.createConstMap)([YZB, JZB])
})
// @from(Ln 132005, Col 4)
EZB = U((yQA) => {
  var Ol3 = yQA && yQA.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Ml3 = yQA && yQA.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Ol3(Q, A, B)
    };
  Object.defineProperty(yQA, "__esModule", {
    value: !0
  });
  Ml3(HZB(), yQA)
})
// @from(Ln 132029, Col 4)
pJB = U((uJB) => {
  Object.defineProperty(uJB, "__esModule", {
    value: !0
  });
  uJB.SEMRESATTRS_K8S_STATEFULSET_NAME = uJB.SEMRESATTRS_K8S_STATEFULSET_UID = uJB.SEMRESATTRS_K8S_DEPLOYMENT_NAME = uJB.SEMRESATTRS_K8S_DEPLOYMENT_UID = uJB.SEMRESATTRS_K8S_REPLICASET_NAME = uJB.SEMRESATTRS_K8S_REPLICASET_UID = uJB.SEMRESATTRS_K8S_CONTAINER_NAME = uJB.SEMRESATTRS_K8S_POD_NAME = uJB.SEMRESATTRS_K8S_POD_UID = uJB.SEMRESATTRS_K8S_NAMESPACE_NAME = uJB.SEMRESATTRS_K8S_NODE_UID = uJB.SEMRESATTRS_K8S_NODE_NAME = uJB.SEMRESATTRS_K8S_CLUSTER_NAME = uJB.SEMRESATTRS_HOST_IMAGE_VERSION = uJB.SEMRESATTRS_HOST_IMAGE_ID = uJB.SEMRESATTRS_HOST_IMAGE_NAME = uJB.SEMRESATTRS_HOST_ARCH = uJB.SEMRESATTRS_HOST_TYPE = uJB.SEMRESATTRS_HOST_NAME = uJB.SEMRESATTRS_HOST_ID = uJB.SEMRESATTRS_FAAS_MAX_MEMORY = uJB.SEMRESATTRS_FAAS_INSTANCE = uJB.SEMRESATTRS_FAAS_VERSION = uJB.SEMRESATTRS_FAAS_ID = uJB.SEMRESATTRS_FAAS_NAME = uJB.SEMRESATTRS_DEVICE_MODEL_NAME = uJB.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = uJB.SEMRESATTRS_DEVICE_ID = uJB.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = uJB.SEMRESATTRS_CONTAINER_IMAGE_TAG = uJB.SEMRESATTRS_CONTAINER_IMAGE_NAME = uJB.SEMRESATTRS_CONTAINER_RUNTIME = uJB.SEMRESATTRS_CONTAINER_ID = uJB.SEMRESATTRS_CONTAINER_NAME = uJB.SEMRESATTRS_AWS_LOG_STREAM_ARNS = uJB.SEMRESATTRS_AWS_LOG_STREAM_NAMES = uJB.SEMRESATTRS_AWS_LOG_GROUP_ARNS = uJB.SEMRESATTRS_AWS_LOG_GROUP_NAMES = uJB.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = uJB.SEMRESATTRS_AWS_ECS_TASK_REVISION = uJB.SEMRESATTRS_AWS_ECS_TASK_FAMILY = uJB.SEMRESATTRS_AWS_ECS_TASK_ARN = uJB.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = uJB.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = uJB.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = uJB.SEMRESATTRS_CLOUD_PLATFORM = uJB.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = uJB.SEMRESATTRS_CLOUD_REGION = uJB.SEMRESATTRS_CLOUD_ACCOUNT_ID = uJB.SEMRESATTRS_CLOUD_PROVIDER = void 0;
  uJB.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = uJB.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = uJB.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = uJB.CLOUDPLATFORMVALUES_AZURE_AKS = uJB.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = uJB.CLOUDPLATFORMVALUES_AZURE_VM = uJB.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = uJB.CLOUDPLATFORMVALUES_AWS_LAMBDA = uJB.CLOUDPLATFORMVALUES_AWS_EKS = uJB.CLOUDPLATFORMVALUES_AWS_ECS = uJB.CLOUDPLATFORMVALUES_AWS_EC2 = uJB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = uJB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = uJB.CloudProviderValues = uJB.CLOUDPROVIDERVALUES_GCP = uJB.CLOUDPROVIDERVALUES_AZURE = uJB.CLOUDPROVIDERVALUES_AWS = uJB.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = uJB.SemanticResourceAttributes = uJB.SEMRESATTRS_WEBENGINE_DESCRIPTION = uJB.SEMRESATTRS_WEBENGINE_VERSION = uJB.SEMRESATTRS_WEBENGINE_NAME = uJB.SEMRESATTRS_TELEMETRY_AUTO_VERSION = uJB.SEMRESATTRS_TELEMETRY_SDK_VERSION = uJB.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = uJB.SEMRESATTRS_TELEMETRY_SDK_NAME = uJB.SEMRESATTRS_SERVICE_VERSION = uJB.SEMRESATTRS_SERVICE_INSTANCE_ID = uJB.SEMRESATTRS_SERVICE_NAMESPACE = uJB.SEMRESATTRS_SERVICE_NAME = uJB.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = uJB.SEMRESATTRS_PROCESS_RUNTIME_VERSION = uJB.SEMRESATTRS_PROCESS_RUNTIME_NAME = uJB.SEMRESATTRS_PROCESS_OWNER = uJB.SEMRESATTRS_PROCESS_COMMAND_ARGS = uJB.SEMRESATTRS_PROCESS_COMMAND_LINE = uJB.SEMRESATTRS_PROCESS_COMMAND = uJB.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = uJB.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = uJB.SEMRESATTRS_PROCESS_PID = uJB.SEMRESATTRS_OS_VERSION = uJB.SEMRESATTRS_OS_NAME = uJB.SEMRESATTRS_OS_DESCRIPTION = uJB.SEMRESATTRS_OS_TYPE = uJB.SEMRESATTRS_K8S_CRONJOB_NAME = uJB.SEMRESATTRS_K8S_CRONJOB_UID = uJB.SEMRESATTRS_K8S_JOB_NAME = uJB.SEMRESATTRS_K8S_JOB_UID = uJB.SEMRESATTRS_K8S_DAEMONSET_NAME = uJB.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
  uJB.TelemetrySdkLanguageValues = uJB.TELEMETRYSDKLANGUAGEVALUES_WEBJS = uJB.TELEMETRYSDKLANGUAGEVALUES_RUBY = uJB.TELEMETRYSDKLANGUAGEVALUES_PYTHON = uJB.TELEMETRYSDKLANGUAGEVALUES_PHP = uJB.TELEMETRYSDKLANGUAGEVALUES_NODEJS = uJB.TELEMETRYSDKLANGUAGEVALUES_JAVA = uJB.TELEMETRYSDKLANGUAGEVALUES_GO = uJB.TELEMETRYSDKLANGUAGEVALUES_ERLANG = uJB.TELEMETRYSDKLANGUAGEVALUES_DOTNET = uJB.TELEMETRYSDKLANGUAGEVALUES_CPP = uJB.OsTypeValues = uJB.OSTYPEVALUES_Z_OS = uJB.OSTYPEVALUES_SOLARIS = uJB.OSTYPEVALUES_AIX = uJB.OSTYPEVALUES_HPUX = uJB.OSTYPEVALUES_DRAGONFLYBSD = uJB.OSTYPEVALUES_OPENBSD = uJB.OSTYPEVALUES_NETBSD = uJB.OSTYPEVALUES_FREEBSD = uJB.OSTYPEVALUES_DARWIN = uJB.OSTYPEVALUES_LINUX = uJB.OSTYPEVALUES_WINDOWS = uJB.HostArchValues = uJB.HOSTARCHVALUES_X86 = uJB.HOSTARCHVALUES_PPC64 = uJB.HOSTARCHVALUES_PPC32 = uJB.HOSTARCHVALUES_IA64 = uJB.HOSTARCHVALUES_ARM64 = uJB.HOSTARCHVALUES_ARM32 = uJB.HOSTARCHVALUES_AMD64 = uJB.AwsEcsLaunchtypeValues = uJB.AWSECSLAUNCHTYPEVALUES_FARGATE = uJB.AWSECSLAUNCHTYPEVALUES_EC2 = uJB.CloudPlatformValues = uJB.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = uJB.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = uJB.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = uJB.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
  var vQA = Wa1(),
    zZB = "cloud.provider",
    $ZB = "cloud.account.id",
    CZB = "cloud.region",
    UZB = "cloud.availability_zone",
    qZB = "cloud.platform",
    NZB = "aws.ecs.container.arn",
    wZB = "aws.ecs.cluster.arn",
    LZB = "aws.ecs.launchtype",
    OZB = "aws.ecs.task.arn",
    MZB = "aws.ecs.task.family",
    RZB = "aws.ecs.task.revision",
    _ZB = "aws.eks.cluster.arn",
    jZB = "aws.log.group.names",
    TZB = "aws.log.group.arns",
    PZB = "aws.log.stream.names",
    SZB = "aws.log.stream.arns",
    xZB = "container.name",
    yZB = "container.id",
    vZB = "container.runtime",
    kZB = "container.image.name",
    bZB = "container.image.tag",
    fZB = "deployment.environment",
    hZB = "device.id",
    gZB = "device.model.identifier",
    uZB = "device.model.name",
    mZB = "faas.name",
    dZB = "faas.id",
    cZB = "faas.version",
    pZB = "faas.instance",
    lZB = "faas.max_memory",
    iZB = "host.id",
    nZB = "host.name",
    aZB = "host.type",
    oZB = "host.arch",
    rZB = "host.image.name",
    sZB = "host.image.id",
    tZB = "host.image.version",
    eZB = "k8s.cluster.name",
    AYB = "k8s.node.name",
    QYB = "k8s.node.uid",
    BYB = "k8s.namespace.name",
    GYB = "k8s.pod.uid",
    ZYB = "k8s.pod.name",
    YYB = "k8s.container.name",
    JYB = "k8s.replicaset.uid",
    XYB = "k8s.replicaset.name",
    IYB = "k8s.deployment.uid",
    DYB = "k8s.deployment.name",
    WYB = "k8s.statefulset.uid",
    KYB = "k8s.statefulset.name",
    VYB = "k8s.daemonset.uid",
    FYB = "k8s.daemonset.name",
    HYB = "k8s.job.uid",
    EYB = "k8s.job.name",
    zYB = "k8s.cronjob.uid",
    $YB = "k8s.cronjob.name",
    CYB = "os.type",
    UYB = "os.description",
    qYB = "os.name",
    NYB = "os.version",
    wYB = "process.pid",
    LYB = "process.executable.name",
    OYB = "process.executable.path",
    MYB = "process.command",
    RYB = "process.command_line",
    _YB = "process.command_args",
    jYB = "process.owner",
    TYB = "process.runtime.name",
    PYB = "process.runtime.version",
    SYB = "process.runtime.description",
    xYB = "service.name",
    yYB = "service.namespace",
    vYB = "service.instance.id",
    kYB = "service.version",
    bYB = "telemetry.sdk.name",
    fYB = "telemetry.sdk.language",
    hYB = "telemetry.sdk.version",
    gYB = "telemetry.auto.version",
    uYB = "webengine.name",
    mYB = "webengine.version",
    dYB = "webengine.description";
  uJB.SEMRESATTRS_CLOUD_PROVIDER = zZB;
  uJB.SEMRESATTRS_CLOUD_ACCOUNT_ID = $ZB;
  uJB.SEMRESATTRS_CLOUD_REGION = CZB;
  uJB.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = UZB;
  uJB.SEMRESATTRS_CLOUD_PLATFORM = qZB;
  uJB.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = NZB;
  uJB.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = wZB;
  uJB.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = LZB;
  uJB.SEMRESATTRS_AWS_ECS_TASK_ARN = OZB;
  uJB.SEMRESATTRS_AWS_ECS_TASK_FAMILY = MZB;
  uJB.SEMRESATTRS_AWS_ECS_TASK_REVISION = RZB;
  uJB.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = _ZB;
  uJB.SEMRESATTRS_AWS_LOG_GROUP_NAMES = jZB;
  uJB.SEMRESATTRS_AWS_LOG_GROUP_ARNS = TZB;
  uJB.SEMRESATTRS_AWS_LOG_STREAM_NAMES = PZB;
  uJB.SEMRESATTRS_AWS_LOG_STREAM_ARNS = SZB;
  uJB.SEMRESATTRS_CONTAINER_NAME = xZB;
  uJB.SEMRESATTRS_CONTAINER_ID = yZB;
  uJB.SEMRESATTRS_CONTAINER_RUNTIME = vZB;
  uJB.SEMRESATTRS_CONTAINER_IMAGE_NAME = kZB;
  uJB.SEMRESATTRS_CONTAINER_IMAGE_TAG = bZB;
  uJB.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = fZB;
  uJB.SEMRESATTRS_DEVICE_ID = hZB;
  uJB.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = gZB;
  uJB.SEMRESATTRS_DEVICE_MODEL_NAME = uZB;
  uJB.SEMRESATTRS_FAAS_NAME = mZB;
  uJB.SEMRESATTRS_FAAS_ID = dZB;
  uJB.SEMRESATTRS_FAAS_VERSION = cZB;
  uJB.SEMRESATTRS_FAAS_INSTANCE = pZB;
  uJB.SEMRESATTRS_FAAS_MAX_MEMORY = lZB;
  uJB.SEMRESATTRS_HOST_ID = iZB;
  uJB.SEMRESATTRS_HOST_NAME = nZB;
  uJB.SEMRESATTRS_HOST_TYPE = aZB;
  uJB.SEMRESATTRS_HOST_ARCH = oZB;
  uJB.SEMRESATTRS_HOST_IMAGE_NAME = rZB;
  uJB.SEMRESATTRS_HOST_IMAGE_ID = sZB;
  uJB.SEMRESATTRS_HOST_IMAGE_VERSION = tZB;
  uJB.SEMRESATTRS_K8S_CLUSTER_NAME = eZB;
  uJB.SEMRESATTRS_K8S_NODE_NAME = AYB;
  uJB.SEMRESATTRS_K8S_NODE_UID = QYB;
  uJB.SEMRESATTRS_K8S_NAMESPACE_NAME = BYB;
  uJB.SEMRESATTRS_K8S_POD_UID = GYB;
  uJB.SEMRESATTRS_K8S_POD_NAME = ZYB;
  uJB.SEMRESATTRS_K8S_CONTAINER_NAME = YYB;
  uJB.SEMRESATTRS_K8S_REPLICASET_UID = JYB;
  uJB.SEMRESATTRS_K8S_REPLICASET_NAME = XYB;
  uJB.SEMRESATTRS_K8S_DEPLOYMENT_UID = IYB;
  uJB.SEMRESATTRS_K8S_DEPLOYMENT_NAME = DYB;
  uJB.SEMRESATTRS_K8S_STATEFULSET_UID = WYB;
  uJB.SEMRESATTRS_K8S_STATEFULSET_NAME = KYB;
  uJB.SEMRESATTRS_K8S_DAEMONSET_UID = VYB;
  uJB.SEMRESATTRS_K8S_DAEMONSET_NAME = FYB;
  uJB.SEMRESATTRS_K8S_JOB_UID = HYB;
  uJB.SEMRESATTRS_K8S_JOB_NAME = EYB;
  uJB.SEMRESATTRS_K8S_CRONJOB_UID = zYB;
  uJB.SEMRESATTRS_K8S_CRONJOB_NAME = $YB;
  uJB.SEMRESATTRS_OS_TYPE = CYB;
  uJB.SEMRESATTRS_OS_DESCRIPTION = UYB;
  uJB.SEMRESATTRS_OS_NAME = qYB;
  uJB.SEMRESATTRS_OS_VERSION = NYB;
  uJB.SEMRESATTRS_PROCESS_PID = wYB;
  uJB.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = LYB;
  uJB.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = OYB;
  uJB.SEMRESATTRS_PROCESS_COMMAND = MYB;
  uJB.SEMRESATTRS_PROCESS_COMMAND_LINE = RYB;
  uJB.SEMRESATTRS_PROCESS_COMMAND_ARGS = _YB;
  uJB.SEMRESATTRS_PROCESS_OWNER = jYB;
  uJB.SEMRESATTRS_PROCESS_RUNTIME_NAME = TYB;
  uJB.SEMRESATTRS_PROCESS_RUNTIME_VERSION = PYB;
  uJB.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = SYB;
  uJB.SEMRESATTRS_SERVICE_NAME = xYB;
  uJB.SEMRESATTRS_SERVICE_NAMESPACE = yYB;
  uJB.SEMRESATTRS_SERVICE_INSTANCE_ID = vYB;
  uJB.SEMRESATTRS_SERVICE_VERSION = kYB;
  uJB.SEMRESATTRS_TELEMETRY_SDK_NAME = bYB;
  uJB.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = fYB;
  uJB.SEMRESATTRS_TELEMETRY_SDK_VERSION = hYB;
  uJB.SEMRESATTRS_TELEMETRY_AUTO_VERSION = gYB;
  uJB.SEMRESATTRS_WEBENGINE_NAME = uYB;
  uJB.SEMRESATTRS_WEBENGINE_VERSION = mYB;
  uJB.SEMRESATTRS_WEBENGINE_DESCRIPTION = dYB;
  uJB.SemanticResourceAttributes = (0, vQA.createConstMap)([zZB, $ZB, CZB, UZB, qZB, NZB, wZB, LZB, OZB, MZB, RZB, _ZB, jZB, TZB, PZB, SZB, xZB, yZB, vZB, kZB, bZB, fZB, hZB, gZB, uZB, mZB, dZB, cZB, pZB, lZB, iZB, nZB, aZB, oZB, rZB, sZB, tZB, eZB, AYB, QYB, BYB, GYB, ZYB, YYB, JYB, XYB, IYB, DYB, WYB, KYB, VYB, FYB, HYB, EYB, zYB, $YB, CYB, UYB, qYB, NYB, wYB, LYB, OYB, MYB, RYB, _YB, jYB, TYB, PYB, SYB, xYB, yYB, vYB, kYB, bYB, fYB, hYB, gYB, uYB, mYB, dYB]);
  var cYB = "alibaba_cloud",
    pYB = "aws",
    lYB = "azure",
    iYB = "gcp";
  uJB.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = cYB;
  uJB.CLOUDPROVIDERVALUES_AWS = pYB;
  uJB.CLOUDPROVIDERVALUES_AZURE = lYB;
  uJB.CLOUDPROVIDERVALUES_GCP = iYB;
  uJB.CloudProviderValues = (0, vQA.createConstMap)([cYB, pYB, lYB, iYB]);
  var nYB = "alibaba_cloud_ecs",
    aYB = "alibaba_cloud_fc",
    oYB = "aws_ec2",
    rYB = "aws_ecs",
    sYB = "aws_eks",
    tYB = "aws_lambda",
    eYB = "aws_elastic_beanstalk",
    AJB = "azure_vm",
    QJB = "azure_container_instances",
    BJB = "azure_aks",
    GJB = "azure_functions",
    ZJB = "azure_app_service",
    YJB = "gcp_compute_engine",
    JJB = "gcp_cloud_run",
    XJB = "gcp_kubernetes_engine",
    IJB = "gcp_cloud_functions",
    DJB = "gcp_app_engine";
  uJB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = nYB;
  uJB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = aYB;
  uJB.CLOUDPLATFORMVALUES_AWS_EC2 = oYB;
  uJB.CLOUDPLATFORMVALUES_AWS_ECS = rYB;
  uJB.CLOUDPLATFORMVALUES_AWS_EKS = sYB;
  uJB.CLOUDPLATFORMVALUES_AWS_LAMBDA = tYB;
  uJB.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = eYB;
  uJB.CLOUDPLATFORMVALUES_AZURE_VM = AJB;
  uJB.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = QJB;
  uJB.CLOUDPLATFORMVALUES_AZURE_AKS = BJB;
  uJB.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = GJB;
  uJB.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = ZJB;
  uJB.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = YJB;
  uJB.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = JJB;
  uJB.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = XJB;
  uJB.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = IJB;
  uJB.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = DJB;
  uJB.CloudPlatformValues = (0, vQA.createConstMap)([nYB, aYB, oYB, rYB, sYB, tYB, eYB, AJB, QJB, BJB, GJB, ZJB, YJB, JJB, XJB, IJB, DJB]);
  var WJB = "ec2",
    KJB = "fargate";
  uJB.AWSECSLAUNCHTYPEVALUES_EC2 = WJB;
  uJB.AWSECSLAUNCHTYPEVALUES_FARGATE = KJB;
  uJB.AwsEcsLaunchtypeValues = (0, vQA.createConstMap)([WJB, KJB]);
  var VJB = "amd64",
    FJB = "arm32",
    HJB = "arm64",
    EJB = "ia64",
    zJB = "ppc32",
    $JB = "ppc64",
    CJB = "x86";
  uJB.HOSTARCHVALUES_AMD64 = VJB;
  uJB.HOSTARCHVALUES_ARM32 = FJB;
  uJB.HOSTARCHVALUES_ARM64 = HJB;
  uJB.HOSTARCHVALUES_IA64 = EJB;
  uJB.HOSTARCHVALUES_PPC32 = zJB;
  uJB.HOSTARCHVALUES_PPC64 = $JB;
  uJB.HOSTARCHVALUES_X86 = CJB;
  uJB.HostArchValues = (0, vQA.createConstMap)([VJB, FJB, HJB, EJB, zJB, $JB, CJB]);
  var UJB = "windows",
    qJB = "linux",
    NJB = "darwin",
    wJB = "freebsd",
    LJB = "netbsd",
    OJB = "openbsd",
    MJB = "dragonflybsd",
    RJB = "hpux",
    _JB = "aix",
    jJB = "solaris",
    TJB = "z_os";
  uJB.OSTYPEVALUES_WINDOWS = UJB;
  uJB.OSTYPEVALUES_LINUX = qJB;
  uJB.OSTYPEVALUES_DARWIN = NJB;
  uJB.OSTYPEVALUES_FREEBSD = wJB;
  uJB.OSTYPEVALUES_NETBSD = LJB;
  uJB.OSTYPEVALUES_OPENBSD = OJB;
  uJB.OSTYPEVALUES_DRAGONFLYBSD = MJB;
  uJB.OSTYPEVALUES_HPUX = RJB;
  uJB.OSTYPEVALUES_AIX = _JB;
  uJB.OSTYPEVALUES_SOLARIS = jJB;
  uJB.OSTYPEVALUES_Z_OS = TJB;
  uJB.OsTypeValues = (0, vQA.createConstMap)([UJB, qJB, NJB, wJB, LJB, OJB, MJB, RJB, _JB, jJB, TJB]);
  var PJB = "cpp",
    SJB = "dotnet",
    xJB = "erlang",
    yJB = "go",
    vJB = "java",
    kJB = "nodejs",
    bJB = "php",
    fJB = "python",
    hJB = "ruby",
    gJB = "webjs";
  uJB.TELEMETRYSDKLANGUAGEVALUES_CPP = PJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_DOTNET = SJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_ERLANG = xJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_GO = yJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_JAVA = vJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_NODEJS = kJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_PHP = bJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_PYTHON = fJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_RUBY = hJB;
  uJB.TELEMETRYSDKLANGUAGEVALUES_WEBJS = gJB;
  uJB.TelemetrySdkLanguageValues = (0, vQA.createConstMap)([PJB, SJB, xJB, yJB, vJB, kJB, bJB, fJB, hJB, gJB])
})
// @from(Ln 132309, Col 4)
lJB = U((kQA) => {
  var Aa3 = kQA && kQA.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Qa3 = kQA && kQA.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Aa3(Q, A, B)
    };
  Object.defineProperty(kQA, "__esModule", {
    value: !0
  });
  Qa3(pJB(), kQA)
})