
// @from(Ln 58470, Col 4)
mj1 = U((zIQ) => {
  Object.defineProperty(zIQ, "__esModule", {
    value: !0
  });
  var VIQ = CQ(),
    FIQ = Ng(),
    XO4 = "cause",
    IO4 = 5,
    HIQ = "LinkedErrors",
    DO4 = (A = {}) => {
      let Q = A.limit || IO4,
        B = A.key || XO4;
      return {
        name: HIQ,
        setupOnce() {},
        preprocessEvent(G, Z, Y) {
          let J = Y.getOptions();
          VIQ.applyAggregateErrorsToEvent(VIQ.exceptionFromError, J.stackParser, J.maxValueLength, B, Q, G, Z)
        }
      }
    },
    EIQ = FIQ.defineIntegration(DO4),
    WO4 = FIQ.convertIntegrationFnToClass(HIQ, EIQ);
  zIQ.LinkedErrors = WO4;
  zIQ.linkedErrorsIntegration = EIQ
})
// @from(Ln 58496, Col 4)
CIQ = U(($IQ) => {
  Object.defineProperty($IQ, "__esModule", {
    value: !0
  });
  var FO4 = uj1(),
    HO4 = gj1(),
    EO4 = mj1();
  $IQ.FunctionToString = FO4.FunctionToString;
  $IQ.InboundFilters = HO4.InboundFilters;
  $IQ.LinkedErrors = EO4.LinkedErrors
})
// @from(Ln 58507, Col 4)
wIQ = U((NIQ) => {
  Object.defineProperty(NIQ, "__esModule", {
    value: !0
  });
  var UO4 = CQ(),
    UIQ = jqA(),
    qO4 = Sj1(),
    NO4 = OqA(),
    diA = _qA();
  class qIQ {
    constructor(A) {
      this._client = A, this._buckets = new Map, this._interval = setInterval(() => this.flush(), UIQ.DEFAULT_BROWSER_FLUSH_INTERVAL)
    }
    add(A, Q, B, G = "none", Z = {}, Y = UO4.timestampInSeconds()) {
      let J = Math.floor(Y),
        X = diA.sanitizeMetricKey(Q),
        I = diA.sanitizeTags(Z),
        D = diA.sanitizeUnit(G),
        W = diA.getBucketKey(A, X, D, I),
        K = this._buckets.get(W),
        V = K && A === UIQ.SET_METRIC_TYPE ? K.metric.weight : 0;
      if (K) {
        if (K.metric.add(B), K.timestamp < J) K.timestamp = J
      } else K = {
        metric: new qO4.METRIC_MAP[A](B),
        timestamp: J,
        metricType: A,
        name: X,
        unit: D,
        tags: I
      }, this._buckets.set(W, K);
      let F = typeof B === "string" ? K.metric.weight - V : B;
      NO4.updateMetricSummaryOnActiveSpan(A, X, F, D, Z, W)
    }
    flush() {
      if (this._buckets.size === 0) return;
      if (this._client.captureAggregateMetrics) {
        let A = Array.from(this._buckets).map(([, Q]) => Q);
        this._client.captureAggregateMetrics(A)
      }
      this._buckets.clear()
    }
    close() {
      clearInterval(this._interval), this.flush()
    }
  }
  NIQ.BrowserMetricsAggregator = qIQ
})
// @from(Ln 58555, Col 4)
_IQ = U((RIQ) => {
  Object.defineProperty(RIQ, "__esModule", {
    value: !0
  });
  var LIQ = Ng(),
    LO4 = wIQ(),
    OIQ = "MetricsAggregator",
    OO4 = () => {
      return {
        name: OIQ,
        setupOnce() {},
        setup(A) {
          A.metricsAggregator = new LO4.BrowserMetricsAggregator(A)
        }
      }
    },
    MIQ = LIQ.defineIntegration(OO4),
    MO4 = LIQ.convertIntegrationFnToClass(OIQ, MIQ);
  RIQ.MetricsAggregator = MO4;
  RIQ.metricsAggregatorIntegration = MIQ
})
// @from(Ln 58576, Col 4)
fIQ = U((bIQ) => {
  Object.defineProperty(bIQ, "__esModule", {
    value: !0
  });
  var jIQ = CQ(),
    TIQ = jW(),
    PIQ = dM(),
    jO4 = Eq(),
    ciA = jqA(),
    SIQ = _IQ();

  function piA(A, Q, B, G = {}) {
    let Z = PIQ.getClient(),
      Y = PIQ.getCurrentScope();
    if (Z) {
      if (!Z.metricsAggregator) {
        TIQ.DEBUG_BUILD && jIQ.logger.warn("No metrics aggregator enabled. Please add the MetricsAggregator integration to use metrics APIs");
        return
      }
      let {
        unit: J,
        tags: X,
        timestamp: I
      } = G, {
        release: D,
        environment: W
      } = Z.getOptions(), K = Y.getTransaction(), V = {};
      if (D) V.release = D;
      if (W) V.environment = W;
      if (K) V.transaction = jO4.spanToJSON(K).description || "";
      TIQ.DEBUG_BUILD && jIQ.logger.log(`Adding value of ${B} to ${A} metric ${Q}`), Z.metricsAggregator.add(A, Q, B, J, {
        ...V,
        ...X
      }, I)
    }
  }

  function xIQ(A, Q = 1, B) {
    piA(ciA.COUNTER_METRIC_TYPE, A, Q, B)
  }

  function yIQ(A, Q, B) {
    piA(ciA.DISTRIBUTION_METRIC_TYPE, A, Q, B)
  }

  function vIQ(A, Q, B) {
    piA(ciA.SET_METRIC_TYPE, A, Q, B)
  }

  function kIQ(A, Q, B) {
    piA(ciA.GAUGE_METRIC_TYPE, A, Q, B)
  }
  var TO4 = {
    increment: xIQ,
    distribution: yIQ,
    set: vIQ,
    gauge: kIQ,
    MetricsAggregator: SIQ.MetricsAggregator,
    metricsAggregatorIntegration: SIQ.metricsAggregatorIntegration
  };
  bIQ.distribution = yIQ;
  bIQ.gauge = kIQ;
  bIQ.increment = xIQ;
  bIQ.metrics = TO4;
  bIQ.set = vIQ
})
// @from(Ln 58642, Col 4)
U6 = U((pj1) => {
  Object.defineProperty(pj1, "__esModule", {
    value: !0
  });
  var hIQ = Cj1(),
    gIQ = zj1(),
    kO4 = jiA(),
    bO4 = SiA(),
    uIQ = NiA(),
    liA = QZA(),
    y1A = _iA(),
    mIQ = j1A(),
    fO4 = hJQ(),
    hO4 = $j1(),
    PqA = MqA(),
    dIQ = Uj1(),
    fY = dM(),
    Qv = ty(),
    dj1 = sGA(),
    gO4 = qj1(),
    cj1 = EiA(),
    cIQ = zqA(),
    pIQ = kiA(),
    lIQ = Oj1(),
    uO4 = FXQ(),
    iIQ = $XQ(),
    mO4 = wXQ(),
    dO4 = MXQ(),
    cO4 = _XQ(),
    pO4 = CiA(),
    iiA = Ng(),
    nIQ = HiA(),
    lO4 = FiA(),
    iO4 = Rj1(),
    nO4 = PXQ(),
    aO4 = LiA(),
    oO4 = yXQ(),
    rO4 = Vj1(),
    sO4 = kXQ(),
    niA = Eq(),
    tO4 = tGA(),
    eO4 = hXQ(),
    AM4 = rGA(),
    aIQ = oXQ(),
    oIQ = QIQ(),
    rIQ = gj1(),
    sIQ = uj1(),
    tIQ = mj1(),
    QM4 = CIQ(),
    BM4 = fIQ(),
    GM4 = QM4;
  pj1.addTracingExtensions = hIQ.addTracingExtensions;
  pj1.startIdleTransaction = hIQ.startIdleTransaction;
  pj1.IdleTransaction = gIQ.IdleTransaction;
  pj1.TRACING_DEFAULTS = gIQ.TRACING_DEFAULTS;
  pj1.Span = kO4.Span;
  pj1.Transaction = bO4.Transaction;
  pj1.extractTraceparentData = uIQ.extractTraceparentData;
  pj1.getActiveTransaction = uIQ.getActiveTransaction;
  Object.defineProperty(pj1, "SpanStatus", {
    enumerable: !0,
    get: () => liA.SpanStatus
  });
  pj1.getSpanStatusFromHttpCode = liA.getSpanStatusFromHttpCode;
  pj1.setHttpStatus = liA.setHttpStatus;
  pj1.spanStatusfromHttpCode = liA.spanStatusfromHttpCode;
  pj1.continueTrace = y1A.continueTrace;
  pj1.getActiveSpan = y1A.getActiveSpan;
  pj1.startActiveSpan = y1A.startActiveSpan;
  pj1.startInactiveSpan = y1A.startInactiveSpan;
  pj1.startSpan = y1A.startSpan;
  pj1.startSpanManual = y1A.startSpanManual;
  pj1.trace = y1A.trace;
  pj1.getDynamicSamplingContextFromClient = mIQ.getDynamicSamplingContextFromClient;
  pj1.getDynamicSamplingContextFromSpan = mIQ.getDynamicSamplingContextFromSpan;
  pj1.setMeasurement = fO4.setMeasurement;
  pj1.isValidSampleRate = hO4.isValidSampleRate;
  pj1.SEMANTIC_ATTRIBUTE_PROFILE_ID = PqA.SEMANTIC_ATTRIBUTE_PROFILE_ID;
  pj1.SEMANTIC_ATTRIBUTE_SENTRY_OP = PqA.SEMANTIC_ATTRIBUTE_SENTRY_OP;
  pj1.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = PqA.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
  pj1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = PqA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
  pj1.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = PqA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
  pj1.createEventEnvelope = dIQ.createEventEnvelope;
  pj1.createSessionEnvelope = dIQ.createSessionEnvelope;
  pj1.addBreadcrumb = fY.addBreadcrumb;
  pj1.captureCheckIn = fY.captureCheckIn;
  pj1.captureEvent = fY.captureEvent;
  pj1.captureException = fY.captureException;
  pj1.captureMessage = fY.captureMessage;
  pj1.captureSession = fY.captureSession;
  pj1.close = fY.close;
  pj1.configureScope = fY.configureScope;
  pj1.endSession = fY.endSession;
  pj1.flush = fY.flush;
  pj1.getClient = fY.getClient;
  pj1.getCurrentScope = fY.getCurrentScope;
  pj1.isInitialized = fY.isInitialized;
  pj1.lastEventId = fY.lastEventId;
  pj1.setContext = fY.setContext;
  pj1.setExtra = fY.setExtra;
  pj1.setExtras = fY.setExtras;
  pj1.setTag = fY.setTag;
  pj1.setTags = fY.setTags;
  pj1.setUser = fY.setUser;
  pj1.startSession = fY.startSession;
  pj1.startTransaction = fY.startTransaction;
  pj1.withActiveSpan = fY.withActiveSpan;
  pj1.withIsolationScope = fY.withIsolationScope;
  pj1.withMonitor = fY.withMonitor;
  pj1.withScope = fY.withScope;
  pj1.Hub = Qv.Hub;
  pj1.ensureHubOnCarrier = Qv.ensureHubOnCarrier;
  pj1.getCurrentHub = Qv.getCurrentHub;
  pj1.getHubFromCarrier = Qv.getHubFromCarrier;
  pj1.getIsolationScope = Qv.getIsolationScope;
  pj1.getMainCarrier = Qv.getMainCarrier;
  pj1.makeMain = Qv.makeMain;
  pj1.runWithAsyncContext = Qv.runWithAsyncContext;
  pj1.setAsyncContextStrategy = Qv.setAsyncContextStrategy;
  pj1.setHubOnCarrier = Qv.setHubOnCarrier;
  pj1.closeSession = dj1.closeSession;
  pj1.makeSession = dj1.makeSession;
  pj1.updateSession = dj1.updateSession;
  pj1.SessionFlusher = gO4.SessionFlusher;
  pj1.Scope = cj1.Scope;
  pj1.getGlobalScope = cj1.getGlobalScope;
  pj1.setGlobalScope = cj1.setGlobalScope;
  pj1.addGlobalEventProcessor = cIQ.addGlobalEventProcessor;
  pj1.notifyEventProcessors = cIQ.notifyEventProcessors;
  pj1.getEnvelopeEndpointWithUrlEncodedAuth = pIQ.getEnvelopeEndpointWithUrlEncodedAuth;
  pj1.getReportDialogEndpoint = pIQ.getReportDialogEndpoint;
  pj1.BaseClient = lIQ.BaseClient;
  pj1.addEventProcessor = lIQ.addEventProcessor;
  pj1.ServerRuntimeClient = uO4.ServerRuntimeClient;
  pj1.initAndBind = iIQ.initAndBind;
  pj1.setCurrentClient = iIQ.setCurrentClient;
  pj1.createTransport = mO4.createTransport;
  pj1.makeOfflineTransport = dO4.makeOfflineTransport;
  pj1.makeMultiplexedTransport = cO4.makeMultiplexedTransport;
  pj1.SDK_VERSION = pO4.SDK_VERSION;
  pj1.addIntegration = iiA.addIntegration;
  pj1.convertIntegrationFnToClass = iiA.convertIntegrationFnToClass;
  pj1.defineIntegration = iiA.defineIntegration;
  pj1.getIntegrationsToSetup = iiA.getIntegrationsToSetup;
  pj1.applyScopeDataToEvent = nIQ.applyScopeDataToEvent;
  pj1.mergeScopeData = nIQ.mergeScopeData;
  pj1.prepareEvent = lO4.prepareEvent;
  pj1.createCheckInEnvelope = iO4.createCheckInEnvelope;
  pj1.createSpanEnvelope = nO4.createSpanEnvelope;
  pj1.hasTracingEnabled = aO4.hasTracingEnabled;
  pj1.isSentryRequestUrl = oO4.isSentryRequestUrl;
  pj1.handleCallbackErrors = rO4.handleCallbackErrors;
  pj1.parameterize = sO4.parameterize;
  pj1.spanIsSampled = niA.spanIsSampled;
  pj1.spanToJSON = niA.spanToJSON;
  pj1.spanToTraceContext = niA.spanToTraceContext;
  pj1.spanToTraceHeader = niA.spanToTraceHeader;
  pj1.getRootSpan = tO4.getRootSpan;
  pj1.applySdkMetadata = eO4.applySdkMetadata;
  pj1.DEFAULT_ENVIRONMENT = AM4.DEFAULT_ENVIRONMENT;
  pj1.ModuleMetadata = aIQ.ModuleMetadata;
  pj1.moduleMetadataIntegration = aIQ.moduleMetadataIntegration;
  pj1.RequestData = oIQ.RequestData;
  pj1.requestDataIntegration = oIQ.requestDataIntegration;
  pj1.InboundFilters = rIQ.InboundFilters;
  pj1.inboundFiltersIntegration = rIQ.inboundFiltersIntegration;
  pj1.FunctionToString = sIQ.FunctionToString;
  pj1.functionToStringIntegration = sIQ.functionToStringIntegration;
  pj1.LinkedErrors = tIQ.LinkedErrors;
  pj1.linkedErrorsIntegration = tIQ.linkedErrorsIntegration;
  pj1.metrics = BM4.metrics;
  pj1.Integrations = GM4
})
// @from(Ln 58815, Col 4)
Cq = U((eIQ) => {
  Object.defineProperty(eIQ, "__esModule", {
    value: !0
  });
  var F_4 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  eIQ.DEBUG_BUILD = F_4
})
// @from(Ln 58822, Col 4)
Oi = U((QDQ) => {
  var {
    _optionalChain: ADQ
  } = CQ();
  Object.defineProperty(QDQ, "__esModule", {
    value: !0
  });

  function E_4(A) {
    let Q = ADQ([A, "call", (G) => G(), "access", (G) => G.getClient, "call", (G) => G(), "optionalAccess", (G) => G.getOptions, "call", (G) => G()]);
    return (ADQ([Q, "optionalAccess", (G) => G.instrumenter]) || "sentry") !== "sentry"
  }
  QDQ.shouldDisableAutoInstrumentation = E_4
})
// @from(Ln 58836, Col 4)
JDQ = U((YDQ) => {
  var {
    _optionalChain: OT
  } = CQ();
  Object.defineProperty(YDQ, "__esModule", {
    value: !0
  });
  var lj1 = U6(),
    Uq = CQ(),
    aiA = Cq(),
    $_4 = Oi();
  class oiA {
    static __initStatic() {
      this.id = "Express"
    }
    constructor(A = {}) {
      this.name = oiA.id, this._router = A.router || A.app, this._methods = (Array.isArray(A.methods) ? A.methods : []).concat("use")
    }
    setupOnce(A, Q) {
      if (!this._router) {
        aiA.DEBUG_BUILD && Uq.logger.error("ExpressIntegration is missing an Express instance");
        return
      }
      if ($_4.shouldDisableAutoInstrumentation(Q)) {
        aiA.DEBUG_BUILD && Uq.logger.log("Express Integration is skipped because of instrumenter configuration.");
        return
      }
      q_4(this._router, this._methods), N_4(this._router)
    }
  }
  oiA.__initStatic();

  function BDQ(A, Q) {
    let B = A.length;
    switch (B) {
      case 2:
        return function (G, Z) {
          let Y = Z.__sentry_transaction;
          if (Y) {
            let J = Y.startChild({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            });
            Z.once("finish", () => {
              J.end()
            })
          }
          return A.call(this, G, Z)
        };
      case 3:
        return function (G, Z, Y) {
          let J = Z.__sentry_transaction,
            X = OT([J, "optionalAccess", (I) => I.startChild, "call", (I) => I({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            })]);
          A.call(this, G, Z, function (...I) {
            OT([X, "optionalAccess", (D) => D.end, "call", (D) => D()]), Y.call(this, ...I)
          })
        };
      case 4:
        return function (G, Z, Y, J) {
          let X = Y.__sentry_transaction,
            I = OT([X, "optionalAccess", (D) => D.startChild, "call", (D) => D({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            })]);
          A.call(this, G, Z, Y, function (...D) {
            OT([I, "optionalAccess", (W) => W.end, "call", (W) => W()]), J.call(this, ...D)
          })
        };
      default:
        throw Error(`Express middleware takes 2-4 arguments. Got: ${B}`)
    }
  }

  function C_4(A, Q) {
    return A.map((B) => {
      if (typeof B === "function") return BDQ(B, Q);
      if (Array.isArray(B)) return B.map((G) => {
        if (typeof G === "function") return BDQ(G, Q);
        return G
      });
      return B
    })
  }

  function U_4(A, Q) {
    let B = A[Q];
    return A[Q] = function (...G) {
      return B.call(this, ...C_4(G, Q))
    }, A
  }

  function q_4(A, Q = []) {
    Q.forEach((B) => U_4(A, B))
  }

  function N_4(A) {
    let Q = "settings" in A;
    if (Q && A._router === void 0 && A.lazyrouter) A.lazyrouter();
    let B = Q ? A._router : A;
    if (!B) {
      aiA.DEBUG_BUILD && Uq.logger.debug("Cannot instrument router for URL Parameterization (did not find a valid router)."), aiA.DEBUG_BUILD && Uq.logger.debug("Routing instrumentation is currently only supported in Express 4.");
      return
    }
    let G = Object.getPrototypeOf(B),
      Z = G.process_params;
    G.process_params = function (J, X, I, D, W) {
      if (!I._reconstructedRoute) I._reconstructedRoute = "";
      let {
        layerRoutePath: K,
        isRegex: V,
        isArray: F,
        numExtraSegments: H
      } = w_4(J);
      if (K || V || F) I._hasParameters = !0;
      let E;
      if (K) E = K;
      else E = ZDQ(I.originalUrl, I._reconstructedRoute, J.path) || "";
      let z = E.split("/").filter((L) => L.length > 0 && (V || F || !L.includes("*"))).join("/");
      if (z && z.length > 0) I._reconstructedRoute += `/${z}${V?"/":""}`;
      let $ = Uq.getNumberOfUrlSegments(Uq.stripUrlQueryAndFragment(I.originalUrl || "")) + H,
        O = Uq.getNumberOfUrlSegments(I._reconstructedRoute);
      if ($ === O) {
        if (!I._hasParameters) {
          if (I._reconstructedRoute !== I.originalUrl) I._reconstructedRoute = I.originalUrl ? Uq.stripUrlQueryAndFragment(I.originalUrl) : I.originalUrl
        }
        let L = D.__sentry_transaction,
          M = L && lj1.spanToJSON(L).data || {};
        if (L && M[lj1.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] !== "custom") {
          let _ = I._reconstructedRoute || "/",
            [j, x] = Uq.extractPathForTransaction(I, {
              path: !0,
              method: !0,
              customRoute: _
            });
          L.updateName(j), L.setAttribute(lj1.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, x)
        }
      }
      return Z.call(this, J, X, I, D, W)
    }
  }
  var GDQ = (A, Q, B) => {
    if (!A || !Q || !B || Object.keys(B).length === 0 || OT([B, "access", (D) => D[0], "optionalAccess", (D) => D.offset]) === void 0 || OT([B, "access", (D) => D[0], "optionalAccess", (D) => D.offset]) === null) return;
    let G = B.sort((D, W) => D.offset - W.offset),
      Y = new RegExp(Q, `${Q.flags}d`).exec(A);
    if (!Y || !Y.indices) return;
    let [, ...J] = Y.indices;
    if (J.length !== G.length) return;
    let X = A,
      I = 0;
    return J.forEach((D, W) => {
      if (D) {
        let [K, V] = D, F = X.substring(0, K - I), H = `:${G[W].name}`, E = X.substring(V - I);
        X = F + H + E, I = I + (V - K - H.length)
      }
    }), X
  };

  function w_4(A) {
    let Q = OT([A, "access", (J) => J.route, "optionalAccess", (J) => J.path]),
      B = Uq.isRegExp(Q),
      G = Array.isArray(Q);
    if (!Q) {
      let [J] = Uq.GLOBAL_OBJ.process.versions.node.split(".").map(Number);
      if (J >= 16) Q = GDQ(A.path, A.regexp, A.keys)
    }
    if (!Q) return {
      isRegex: B,
      isArray: G,
      numExtraSegments: 0
    };
    let Z = G ? Math.max(L_4(Q) - Uq.getNumberOfUrlSegments(A.path || ""), 0) : 0;
    return {
      layerRoutePath: O_4(G, Q),
      isRegex: B,
      isArray: G,
      numExtraSegments: Z
    }
  }

  function L_4(A) {
    return A.reduce((Q, B) => {
      return Q + Uq.getNumberOfUrlSegments(B.toString())
    }, 0)
  }

  function O_4(A, Q) {
    if (A) return Q.map((B) => B.toString()).join(",");
    return Q && Q.toString()
  }

  function ZDQ(A, Q, B) {
    let G = Uq.stripUrlQueryAndFragment(A || ""),
      Z = OT([G, "optionalAccess", (I) => I.split, "call", (I) => I("/"), "access", (I) => I.filter, "call", (I) => I((D) => !!D)]),
      Y = 0,
      J = OT([Q, "optionalAccess", (I) => I.split, "call", (I) => I("/"), "access", (I) => I.filter, "call", (I) => I((D) => !!D), "access", (I) => I.length]) || 0;
    return OT([B, "optionalAccess", (I) => I.split, "call", (I) => I("/"), "access", (I) => I.filter, "call", (I) => I((D) => {
      if (OT([Z, "optionalAccess", (W) => W[J + Y]]) === D) return Y += 1, !0;
      return !1
    }), "access", (I) => I.join, "call", (I) => I("/")])
  }
  YDQ.Express = oiA;
  YDQ.extractOriginalRoute = GDQ;
  YDQ.preventDuplicateSegments = ZDQ
})
// @from(Ln 59046, Col 4)
IDQ = U((XDQ) => {
  var {
    _optionalChain: IZA
  } = CQ();
  Object.defineProperty(XDQ, "__esModule", {
    value: !0
  });
  var DZA = CQ(),
    ij1 = Cq(),
    j_4 = Oi();
  class riA {
    static __initStatic() {
      this.id = "Postgres"
    }
    constructor(A = {}) {
      this.name = riA.id, this._usePgNative = !!A.usePgNative, this._module = A.module
    }
    loadDependency() {
      return this._module = this._module || DZA.loadModule("pg")
    }
    setupOnce(A, Q) {
      if (j_4.shouldDisableAutoInstrumentation(Q)) {
        ij1.DEBUG_BUILD && DZA.logger.log("Postgres Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        ij1.DEBUG_BUILD && DZA.logger.error("Postgres Integration was unable to require `pg` package.");
        return
      }
      let G = this._usePgNative ? IZA([B, "access", (Z) => Z.native, "optionalAccess", (Z) => Z.Client]) : B.Client;
      if (!G) {
        ij1.DEBUG_BUILD && DZA.logger.error("Postgres Integration was unable to access 'pg-native' bindings.");
        return
      }
      DZA.fill(G.prototype, "query", function (Z) {
        return function (Y, J, X) {
          let D = Q().getScope().getSpan(),
            W = {
              "db.system": "postgresql"
            };
          try {
            if (this.database) W["db.name"] = this.database;
            if (this.host) W["server.address"] = this.host;
            if (this.port) W["server.port"] = this.port;
            if (this.user) W["db.user"] = this.user
          } catch (F) {}
          let K = IZA([D, "optionalAccess", (F) => F.startChild, "call", (F) => F({
            description: typeof Y === "string" ? Y : Y.text,
            op: "db",
            origin: "auto.db.postgres",
            data: W
          })]);
          if (typeof X === "function") return Z.call(this, Y, J, function (F, H) {
            IZA([K, "optionalAccess", (E) => E.end, "call", (E) => E()]), X(F, H)
          });
          if (typeof J === "function") return Z.call(this, Y, function (F, H) {
            IZA([K, "optionalAccess", (E) => E.end, "call", (E) => E()]), J(F, H)
          });
          let V = typeof J < "u" ? Z.call(this, Y, J) : Z.call(this, Y);
          if (DZA.isThenable(V)) return V.then((F) => {
            return IZA([K, "optionalAccess", (H) => H.end, "call", (H) => H()]), F
          });
          return IZA([K, "optionalAccess", (F) => F.end, "call", (F) => F()]), V
        }
      })
    }
  }
  riA.__initStatic();
  XDQ.Postgres = riA
})
// @from(Ln 59117, Col 4)
WDQ = U((DDQ) => {
  var {
    _optionalChain: P_4
  } = CQ();
  Object.defineProperty(DDQ, "__esModule", {
    value: !0
  });
  var SqA = CQ(),
    nj1 = Cq(),
    S_4 = Oi();
  class siA {
    static __initStatic() {
      this.id = "Mysql"
    }
    constructor() {
      this.name = siA.id
    }
    loadDependency() {
      return this._module = this._module || SqA.loadModule("mysql/lib/Connection.js")
    }
    setupOnce(A, Q) {
      if (S_4.shouldDisableAutoInstrumentation(Q)) {
        nj1.DEBUG_BUILD && SqA.logger.log("Mysql Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        nj1.DEBUG_BUILD && SqA.logger.error("Mysql Integration was unable to require `mysql` package.");
        return
      }
      let G = void 0;
      try {
        B.prototype.connect = new Proxy(B.prototype.connect, {
          apply(J, X, I) {
            if (!G) G = X.config;
            return J.apply(X, I)
          }
        })
      } catch (J) {
        nj1.DEBUG_BUILD && SqA.logger.error("Mysql Integration was unable to instrument `mysql` config.")
      }

      function Z() {
        if (!G) return {};
        return {
          "server.address": G.host,
          "server.port": G.port,
          "db.user": G.user
        }
      }

      function Y(J) {
        if (!J) return;
        let X = Z();
        Object.keys(X).forEach((I) => {
          J.setAttribute(I, X[I])
        }), J.end()
      }
      SqA.fill(B, "createQuery", function (J) {
        return function (X, I, D) {
          let K = Q().getScope().getSpan(),
            V = P_4([K, "optionalAccess", (H) => H.startChild, "call", (H) => H({
              description: typeof X === "string" ? X : X.sql,
              op: "db",
              origin: "auto.db.mysql",
              data: {
                "db.system": "mysql"
              }
            })]);
          if (typeof D === "function") return J.call(this, X, I, function (H, E, z) {
            Y(V), D(H, E, z)
          });
          if (typeof I === "function") return J.call(this, X, function (H, E, z) {
            Y(V), I(H, E, z)
          });
          let F = J.call(this, X, I);
          return F.on("end", () => {
            Y(V)
          }), F
        }
      })
    }
  }
  siA.__initStatic();
  DDQ.Mysql = siA
})
// @from(Ln 59203, Col 4)
FDQ = U((VDQ) => {
  var {
    _optionalChain: Mi
  } = CQ();
  Object.defineProperty(VDQ, "__esModule", {
    value: !0
  });
  var xqA = CQ(),
    KDQ = Cq(),
    y_4 = Oi(),
    v_4 = ["aggregate", "bulkWrite", "countDocuments", "createIndex", "createIndexes", "deleteMany", "deleteOne", "distinct", "drop", "dropIndex", "dropIndexes", "estimatedDocumentCount", "find", "findOne", "findOneAndDelete", "findOneAndReplace", "findOneAndUpdate", "indexes", "indexExists", "indexInformation", "initializeOrderedBulkOp", "insertMany", "insertOne", "isCapped", "mapReduce", "options", "parallelCollectionScan", "rename", "replaceOne", "stats", "updateMany", "updateOne"],
    k_4 = {
      bulkWrite: ["operations"],
      countDocuments: ["query"],
      createIndex: ["fieldOrSpec"],
      createIndexes: ["indexSpecs"],
      deleteMany: ["filter"],
      deleteOne: ["filter"],
      distinct: ["key", "query"],
      dropIndex: ["indexName"],
      find: ["query"],
      findOne: ["query"],
      findOneAndDelete: ["filter"],
      findOneAndReplace: ["filter", "replacement"],
      findOneAndUpdate: ["filter", "update"],
      indexExists: ["indexes"],
      insertMany: ["docs"],
      insertOne: ["doc"],
      mapReduce: ["map", "reduce"],
      rename: ["newName"],
      replaceOne: ["filter", "doc"],
      updateMany: ["filter", "update"],
      updateOne: ["filter", "update"]
    };

  function b_4(A) {
    return A && typeof A === "object" && A.once && typeof A.once === "function"
  }
  class tiA {
    static __initStatic() {
      this.id = "Mongo"
    }
    constructor(A = {}) {
      this.name = tiA.id, this._operations = Array.isArray(A.operations) ? A.operations : v_4, this._describeOperations = "describeOperations" in A ? A.describeOperations : !0, this._useMongoose = !!A.useMongoose
    }
    loadDependency() {
      let A = this._useMongoose ? "mongoose" : "mongodb";
      return this._module = this._module || xqA.loadModule(A)
    }
    setupOnce(A, Q) {
      if (y_4.shouldDisableAutoInstrumentation(Q)) {
        KDQ.DEBUG_BUILD && xqA.logger.log("Mongo Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        let G = this._useMongoose ? "mongoose" : "mongodb";
        KDQ.DEBUG_BUILD && xqA.logger.error(`Mongo Integration was unable to require \`${G}\` package.`);
        return
      }
      this._instrumentOperations(B.Collection, this._operations, Q)
    }
    _instrumentOperations(A, Q, B) {
      Q.forEach((G) => this._patchOperation(A, G, B))
    }
    _patchOperation(A, Q, B) {
      if (!(Q in A.prototype)) return;
      let G = this._getSpanContextFromOperationArguments.bind(this);
      xqA.fill(A.prototype, Q, function (Z) {
        return function (...Y) {
          let J = Y[Y.length - 1],
            X = B(),
            I = X.getScope(),
            D = X.getClient(),
            W = I.getSpan(),
            K = Mi([D, "optionalAccess", (F) => F.getOptions, "call", (F) => F(), "access", (F) => F.sendDefaultPii]);
          if (typeof J !== "function" || Q === "mapReduce" && Y.length === 2) {
            let F = Mi([W, "optionalAccess", (E) => E.startChild, "call", (E) => E(G(this, Q, Y, K))]),
              H = Z.call(this, ...Y);
            if (xqA.isThenable(H)) return H.then((E) => {
              return Mi([F, "optionalAccess", (z) => z.end, "call", (z) => z()]), E
            });
            else if (b_4(H)) {
              let E = H;
              try {
                E.once("close", () => {
                  Mi([F, "optionalAccess", (z) => z.end, "call", (z) => z()])
                })
              } catch (z) {
                Mi([F, "optionalAccess", ($) => $.end, "call", ($) => $()])
              }
              return E
            } else return Mi([F, "optionalAccess", (E) => E.end, "call", (E) => E()]), H
          }
          let V = Mi([W, "optionalAccess", (F) => F.startChild, "call", (F) => F(G(this, Q, Y.slice(0, -1)))]);
          return Z.call(this, ...Y.slice(0, -1), function (F, H) {
            Mi([V, "optionalAccess", (E) => E.end, "call", (E) => E()]), J(F, H)
          })
        }
      })
    }
    _getSpanContextFromOperationArguments(A, Q, B, G = !1) {
      let Z = {
          "db.system": "mongodb",
          "db.name": A.dbName,
          "db.operation": Q,
          "db.mongodb.collection": A.collectionName
        },
        Y = {
          op: "db",
          origin: "auto.db.mongo",
          description: Q,
          data: Z
        },
        J = k_4[Q],
        X = Array.isArray(this._describeOperations) ? this._describeOperations.includes(Q) : this._describeOperations;
      if (!J || !X || !G) return Y;
      try {
        if (Q === "mapReduce") {
          let [I, D] = B;
          Z[J[0]] = typeof I === "string" ? I : I.name || "<anonymous>", Z[J[1]] = typeof D === "string" ? D : D.name || "<anonymous>"
        } else
          for (let I = 0; I < J.length; I++) Z[`db.mongodb.${J[I]}`] = JSON.stringify(B[I])
      } catch (I) {}
      return Y
    }
  }
  tiA.__initStatic();
  VDQ.Mongo = tiA
})
// @from(Ln 59333, Col 4)
zDQ = U((EDQ) => {
  Object.defineProperty(EDQ, "__esModule", {
    value: !0
  });
  var aj1 = U6(),
    HDQ = CQ(),
    h_4 = Cq(),
    g_4 = Oi();

  function u_4(A) {
    return !!A && !!A.$use
  }
  class eiA {
    static __initStatic() {
      this.id = "Prisma"
    }
    constructor(A = {}) {
      if (this.name = eiA.id, u_4(A.client) && !A.client._sentryInstrumented) {
        HDQ.addNonEnumerableProperty(A.client, "_sentryInstrumented", !0);
        let Q = {};
        try {
          let B = A.client._engineConfig;
          if (B) {
            let {
              activeProvider: G,
              clientVersion: Z
            } = B;
            if (G) Q["db.system"] = G;
            if (Z) Q["db.prisma.version"] = Z
          }
        } catch (B) {}
        A.client.$use((B, G) => {
          if (g_4.shouldDisableAutoInstrumentation(aj1.getCurrentHub)) return G(B);
          let {
            action: Z,
            model: Y
          } = B;
          return aj1.startSpan({
            name: Y ? `${Y} ${Z}` : Z,
            onlyIfParent: !0,
            op: "db.prisma",
            attributes: {
              [aj1.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.prisma"
            },
            data: {
              ...Q,
              "db.operation": Z
            }
          }, () => G(B))
        })
      } else h_4.DEBUG_BUILD && HDQ.logger.warn("Unsupported Prisma client provided to PrismaIntegration. Provided client:", A.client)
    }
    setupOnce() {}
  }
  eiA.__initStatic();
  EDQ.Prisma = eiA
})
// @from(Ln 59390, Col 4)
UDQ = U((CDQ) => {
  var {
    _optionalChain: WZA
  } = CQ();
  Object.defineProperty(CDQ, "__esModule", {
    value: !0
  });
  var yqA = CQ(),
    $DQ = Cq(),
    d_4 = Oi();
  class AnA {
    static __initStatic() {
      this.id = "GraphQL"
    }
    constructor() {
      this.name = AnA.id
    }
    loadDependency() {
      return this._module = this._module || yqA.loadModule("graphql/execution/execute.js")
    }
    setupOnce(A, Q) {
      if (d_4.shouldDisableAutoInstrumentation(Q)) {
        $DQ.DEBUG_BUILD && yqA.logger.log("GraphQL Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        $DQ.DEBUG_BUILD && yqA.logger.error("GraphQL Integration was unable to require graphql/execution package.");
        return
      }
      yqA.fill(B, "execute", function (G) {
        return function (...Z) {
          let Y = Q().getScope(),
            J = Y.getSpan(),
            X = WZA([J, "optionalAccess", (D) => D.startChild, "call", (D) => D({
              description: "execute",
              op: "graphql.execute",
              origin: "auto.graphql.graphql"
            })]);
          WZA([Y, "optionalAccess", (D) => D.setSpan, "call", (D) => D(X)]);
          let I = G.call(this, ...Z);
          if (yqA.isThenable(I)) return I.then((D) => {
            return WZA([X, "optionalAccess", (W) => W.end, "call", (W) => W()]), WZA([Y, "optionalAccess", (W) => W.setSpan, "call", (W) => W(J)]), D
          });
          return WZA([X, "optionalAccess", (D) => D.end, "call", (D) => D()]), WZA([Y, "optionalAccess", (D) => D.setSpan, "call", (D) => D(J)]), I
        }
      })
    }
  }
  AnA.__initStatic();
  CDQ.GraphQL = AnA
})
// @from(Ln 59442, Col 4)
wDQ = U((NDQ) => {
  var {
    _optionalChain: oj1
  } = CQ();
  Object.defineProperty(NDQ, "__esModule", {
    value: !0
  });
  var Gz = CQ(),
    QnA = Cq(),
    p_4 = Oi();
  class BnA {
    static __initStatic() {
      this.id = "Apollo"
    }
    constructor(A = {
      useNestjs: !1
    }) {
      this.name = BnA.id, this._useNest = !!A.useNestjs
    }
    loadDependency() {
      if (this._useNest) this._module = this._module || Gz.loadModule("@nestjs/graphql");
      else this._module = this._module || Gz.loadModule("apollo-server-core");
      return this._module
    }
    setupOnce(A, Q) {
      if (p_4.shouldDisableAutoInstrumentation(Q)) {
        QnA.DEBUG_BUILD && Gz.logger.log("Apollo Integration is skipped because of instrumenter configuration.");
        return
      }
      if (this._useNest) {
        let B = this.loadDependency();
        if (!B) {
          QnA.DEBUG_BUILD && Gz.logger.error("Apollo-NestJS Integration was unable to require @nestjs/graphql package.");
          return
        }
        Gz.fill(B.GraphQLFactory.prototype, "mergeWithSchema", function (G) {
          return function (...Z) {
            return Gz.fill(this.resolversExplorerService, "explore", function (Y) {
              return function () {
                let J = Gz.arrayify(Y.call(this));
                return qDQ(J, Q)
              }
            }), G.call(this, ...Z)
          }
        })
      } else {
        let B = this.loadDependency();
        if (!B) {
          QnA.DEBUG_BUILD && Gz.logger.error("Apollo Integration was unable to require apollo-server-core package.");
          return
        }
        Gz.fill(B.ApolloServerBase.prototype, "constructSchema", function (G) {
          return function () {
            if (!this.config.resolvers) {
              if (QnA.DEBUG_BUILD) {
                if (this.config.schema) Gz.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `schema` property.If you are using NestJS with Apollo, please use `Sentry.Integrations.Apollo({ useNestjs: true })` instead."), Gz.logger.warn();
                else if (this.config.modules) Gz.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `modules` property.");
                Gz.logger.error("Skipping tracing as no resolvers found on the `ApolloServer` instance.")
              }
              return G.call(this)
            }
            let Z = Gz.arrayify(this.config.resolvers);
            return this.config.resolvers = qDQ(Z, Q), G.call(this)
          }
        })
      }
    }
  }
  BnA.__initStatic();

  function qDQ(A, Q) {
    return A.map((B) => {
      return Object.keys(B).forEach((G) => {
        Object.keys(B[G]).forEach((Z) => {
          if (typeof B[G][Z] !== "function") return;
          l_4(B, G, Z, Q)
        })
      }), B
    })
  }

  function l_4(A, Q, B, G) {
    Gz.fill(A[Q], B, function (Z) {
      return function (...Y) {
        let X = G().getScope().getSpan(),
          I = oj1([X, "optionalAccess", (W) => W.startChild, "call", (W) => W({
            description: `${Q}.${B}`,
            op: "graphql.resolve",
            origin: "auto.graphql.apollo"
          })]),
          D = Z.call(this, ...Y);
        if (Gz.isThenable(D)) return D.then((W) => {
          return oj1([I, "optionalAccess", (K) => K.end, "call", (K) => K()]), W
        });
        return oj1([I, "optionalAccess", (W) => W.end, "call", (W) => W()]), D
      }
    })
  }
  NDQ.Apollo = BnA
})
// @from(Ln 59542, Col 4)
ODQ = U((LDQ, Ri) => {
  Object.defineProperty(LDQ, "__esModule", {
    value: !0
  });
  var v1A = CQ(),
    n_4 = [() => {
      return new(v1A.dynamicRequire(Ri, "./apollo")).Apollo
    }, () => {
      return new(v1A.dynamicRequire(Ri, "./apollo")).Apollo({
        useNestjs: !0
      })
    }, () => {
      return new(v1A.dynamicRequire(Ri, "./graphql")).GraphQL
    }, () => {
      return new(v1A.dynamicRequire(Ri, "./mongo")).Mongo
    }, () => {
      return new(v1A.dynamicRequire(Ri, "./mongo")).Mongo({
        mongoose: !0
      })
    }, () => {
      return new(v1A.dynamicRequire(Ri, "./mysql")).Mysql
    }, () => {
      return new(v1A.dynamicRequire(Ri, "./postgres")).Postgres
    }];
  LDQ.lazyLoadedNodePerformanceMonitoringIntegrations = n_4
})
// @from(Ln 59568, Col 4)
AL = U((MDQ) => {
  Object.defineProperty(MDQ, "__esModule", {
    value: !0
  });
  var o_4 = CQ(),
    r_4 = o_4.GLOBAL_OBJ;
  MDQ.WINDOW = r_4
})
// @from(Ln 59576, Col 4)
sj1 = U((TDQ) => {
  Object.defineProperty(TDQ, "__esModule", {
    value: !0
  });
  var RDQ = U6(),
    _DQ = CQ(),
    jDQ = Cq(),
    rj1 = AL();

  function t_4() {
    if (rj1.WINDOW.document) rj1.WINDOW.document.addEventListener("visibilitychange", () => {
      let A = RDQ.getActiveTransaction();
      if (rj1.WINDOW.document.hidden && A) {
        let {
          op: B,
          status: G
        } = RDQ.spanToJSON(A);
        if (jDQ.DEBUG_BUILD && _DQ.logger.log(`[Tracing] Transaction: cancelled -> since tab moved to the background, op: ${B}`), !G) A.setStatus("cancelled");
        A.setTag("visibilitychange", "document.hidden"), A.end()
      }
    });
    else jDQ.DEBUG_BUILD && _DQ.logger.warn("[Tracing] Could not set up background tab detection due to lack of global document")
  }
  TDQ.registerBackgroundTabDetection = t_4
})
// @from(Ln 59601, Col 4)
KZA = U((PDQ) => {
  Object.defineProperty(PDQ, "__esModule", {
    value: !0
  });
  var Aj4 = (A, Q, B) => {
    let G, Z;
    return (Y) => {
      if (Q.value >= 0) {
        if (Y || B) {
          if (Z = Q.value - (G || 0), Z || G === void 0) G = Q.value, Q.delta = Z, A(Q)
        }
      }
    }
  };
  PDQ.bindReporter = Aj4
})
// @from(Ln 59617, Col 4)
xDQ = U((SDQ) => {
  Object.defineProperty(SDQ, "__esModule", {
    value: !0
  });
  var Bj4 = () => {
    return `v3-${Date.now()}-${Math.floor(Math.random()*8999999999999)+1000000000000}`
  };
  SDQ.generateUniqueID = Bj4
})
// @from(Ln 59626, Col 4)
kqA = U((yDQ) => {
  Object.defineProperty(yDQ, "__esModule", {
    value: !0
  });
  var vqA = AL(),
    Zj4 = () => {
      let A = vqA.WINDOW.performance.timing,
        Q = vqA.WINDOW.performance.navigation.type,
        B = {
          entryType: "navigation",
          startTime: 0,
          type: Q == 2 ? "back_forward" : Q === 1 ? "reload" : "navigate"
        };
      for (let G in A)
        if (G !== "navigationStart" && G !== "toJSON") B[G] = Math.max(A[G] - A.navigationStart, 0);
      return B
    },
    Yj4 = () => {
      if (vqA.WINDOW.__WEB_VITALS_POLYFILL__) return vqA.WINDOW.performance && (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || Zj4());
      else return vqA.WINDOW.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]
    };
  yDQ.getNavigationEntry = Yj4
})
// @from(Ln 59649, Col 4)
GnA = U((vDQ) => {
  Object.defineProperty(vDQ, "__esModule", {
    value: !0
  });
  var Xj4 = kqA(),
    Ij4 = () => {
      let A = Xj4.getNavigationEntry();
      return A && A.activationStart || 0
    };
  vDQ.getActivationStart = Ij4
})
// @from(Ln 59660, Col 4)
VZA = U((bDQ) => {
  Object.defineProperty(bDQ, "__esModule", {
    value: !0
  });
  var kDQ = AL(),
    Wj4 = xDQ(),
    Kj4 = GnA(),
    Vj4 = kqA(),
    Fj4 = (A, Q) => {
      let B = Vj4.getNavigationEntry(),
        G = "navigate";
      if (B)
        if (kDQ.WINDOW.document && kDQ.WINDOW.document.prerendering || Kj4.getActivationStart() > 0) G = "prerender";
        else G = B.type.replace(/_/g, "-");
      return {
        name: A,
        value: typeof Q > "u" ? -1 : Q,
        rating: "good",
        delta: 0,
        entries: [],
        id: Wj4.generateUniqueID(),
        navigationType: G
      }
    };
  bDQ.initMetric = Fj4
})
// @from(Ln 59686, Col 4)
k1A = U((fDQ) => {
  Object.defineProperty(fDQ, "__esModule", {
    value: !0
  });
  var Ej4 = (A, Q, B) => {
    try {
      if (PerformanceObserver.supportedEntryTypes.includes(A)) {
        let G = new PerformanceObserver((Z) => {
          Q(Z.getEntries())
        });
        return G.observe(Object.assign({
          type: A,
          buffered: !0
        }, B || {})), G
      }
    } catch (G) {}
    return
  };
  fDQ.observe = Ej4
})
// @from(Ln 59706, Col 4)
FZA = U((gDQ) => {
  Object.defineProperty(gDQ, "__esModule", {
    value: !0
  });
  var hDQ = AL(),
    $j4 = (A, Q) => {
      let B = (G) => {
        if (G.type === "pagehide" || hDQ.WINDOW.document.visibilityState === "hidden") {
          if (A(G), Q) removeEventListener("visibilitychange", B, !0), removeEventListener("pagehide", B, !0)
        }
      };
      if (hDQ.WINDOW.document) addEventListener("visibilitychange", B, !0), addEventListener("pagehide", B, !0)
    };
  gDQ.onHidden = $j4
})
// @from(Ln 59721, Col 4)
mDQ = U((uDQ) => {
  Object.defineProperty(uDQ, "__esModule", {
    value: !0
  });
  var Uj4 = KZA(),
    qj4 = VZA(),
    Nj4 = k1A(),
    wj4 = FZA(),
    Lj4 = (A, Q = {}) => {
      let B = qj4.initMetric("CLS", 0),
        G, Z = 0,
        Y = [],
        J = (I) => {
          I.forEach((D) => {
            if (!D.hadRecentInput) {
              let W = Y[0],
                K = Y[Y.length - 1];
              if (Z && Y.length !== 0 && D.startTime - K.startTime < 1000 && D.startTime - W.startTime < 5000) Z += D.value, Y.push(D);
              else Z = D.value, Y = [D];
              if (Z > B.value) {
                if (B.value = Z, B.entries = Y, G) G()
              }
            }
          })
        },
        X = Nj4.observe("layout-shift", J);
      if (X) {
        G = Uj4.bindReporter(A, B, Q.reportAllChanges);
        let I = () => {
          J(X.takeRecords()), G(!0)
        };
        return wj4.onHidden(I), I
      }
      return
    };
  uDQ.onCLS = Lj4
})
// @from(Ln 59758, Col 4)
JnA = U((dDQ) => {
  Object.defineProperty(dDQ, "__esModule", {
    value: !0
  });
  var ZnA = AL(),
    Mj4 = FZA(),
    YnA = -1,
    Rj4 = () => {
      if (ZnA.WINDOW.document && ZnA.WINDOW.document.visibilityState) YnA = ZnA.WINDOW.document.visibilityState === "hidden" && !ZnA.WINDOW.document.prerendering ? 0 : 1 / 0
    },
    _j4 = () => {
      Mj4.onHidden(({
        timeStamp: A
      }) => {
        YnA = A
      }, !0)
    },
    jj4 = () => {
      if (YnA < 0) Rj4(), _j4();
      return {
        get firstHiddenTime() {
          return YnA
        }
      }
    };
  dDQ.getVisibilityWatcher = jj4
})
// @from(Ln 59785, Col 4)
pDQ = U((cDQ) => {
  Object.defineProperty(cDQ, "__esModule", {
    value: !0
  });
  var Pj4 = KZA(),
    Sj4 = JnA(),
    xj4 = VZA(),
    yj4 = k1A(),
    vj4 = FZA(),
    kj4 = (A) => {
      let Q = Sj4.getVisibilityWatcher(),
        B = xj4.initMetric("FID"),
        G, Z = (X) => {
          if (X.startTime < Q.firstHiddenTime) B.value = X.processingStart - X.startTime, B.entries.push(X), G(!0)
        },
        Y = (X) => {
          X.forEach(Z)
        },
        J = yj4.observe("first-input", Y);
      if (G = Pj4.bindReporter(A, B), J) vj4.onHidden(() => {
        Y(J.takeRecords()), J.disconnect()
      }, !0)
    };
  cDQ.onFID = kj4
})
// @from(Ln 59810, Col 4)
nDQ = U((iDQ) => {
  Object.defineProperty(iDQ, "__esModule", {
    value: !0
  });
  var fj4 = k1A(),
    lDQ = 0,
    tj1 = 1 / 0,
    XnA = 0,
    hj4 = (A) => {
      A.forEach((Q) => {
        if (Q.interactionId) tj1 = Math.min(tj1, Q.interactionId), XnA = Math.max(XnA, Q.interactionId), lDQ = XnA ? (XnA - tj1) / 7 + 1 : 0
      })
    },
    ej1, gj4 = () => {
      return ej1 ? lDQ : performance.interactionCount || 0
    },
    uj4 = () => {
      if ("interactionCount" in performance || ej1) return;
      ej1 = fj4.observe("event", hj4, {
        type: "event",
        buffered: !0,
        durationThreshold: 0
      })
    };
  iDQ.getInteractionCount = gj4;
  iDQ.initInteractionCountPolyfill = uj4
})
// @from(Ln 59837, Col 4)
eDQ = U((tDQ) => {
  Object.defineProperty(tDQ, "__esModule", {
    value: !0
  });
  var cj4 = KZA(),
    pj4 = VZA(),
    lj4 = k1A(),
    ij4 = FZA(),
    rDQ = nDQ(),
    sDQ = () => {
      return rDQ.getInteractionCount()
    },
    aDQ = 10,
    Lg = [],
    AT1 = {},
    oDQ = (A) => {
      let Q = Lg[Lg.length - 1],
        B = AT1[A.interactionId];
      if (B || Lg.length < aDQ || A.duration > Q.latency) {
        if (B) B.entries.push(A), B.latency = Math.max(B.latency, A.duration);
        else {
          let G = {
            id: A.interactionId,
            latency: A.duration,
            entries: [A]
          };
          AT1[G.id] = G, Lg.push(G)
        }
        Lg.sort((G, Z) => Z.latency - G.latency), Lg.splice(aDQ).forEach((G) => {
          delete AT1[G.id]
        })
      }
    },
    nj4 = () => {
      let A = Math.min(Lg.length - 1, Math.floor(sDQ() / 50));
      return Lg[A]
    },
    aj4 = (A, Q) => {
      Q = Q || {}, rDQ.initInteractionCountPolyfill();
      let B = pj4.initMetric("INP"),
        G, Z = (J) => {
          J.forEach((I) => {
            if (I.interactionId) oDQ(I);
            if (I.entryType === "first-input") {
              if (!Lg.some((W) => {
                  return W.entries.some((K) => {
                    return I.duration === K.duration && I.startTime === K.startTime
                  })
                })) oDQ(I)
            }
          });
          let X = nj4();
          if (X && X.latency !== B.value) B.value = X.latency, B.entries = X.entries, G()
        },
        Y = lj4.observe("event", Z, {
          durationThreshold: Q.durationThreshold || 40
        });
      if (G = cj4.bindReporter(A, B, Q.reportAllChanges), Y) Y.observe({
        type: "first-input",
        buffered: !0
      }), ij4.onHidden(() => {
        if (Z(Y.takeRecords()), B.value < 0 && sDQ() > 0) B.value = 0, B.entries = [];
        G(!0)
      })
    };
  tDQ.onINP = aj4
})
// @from(Ln 59904, Col 4)
BWQ = U((QWQ) => {
  Object.defineProperty(QWQ, "__esModule", {
    value: !0
  });
  var rj4 = AL(),
    sj4 = KZA(),
    tj4 = GnA(),
    ej4 = JnA(),
    AT4 = VZA(),
    QT4 = k1A(),
    BT4 = FZA(),
    AWQ = {},
    GT4 = (A) => {
      let Q = ej4.getVisibilityWatcher(),
        B = AT4.initMetric("LCP"),
        G, Z = (J) => {
          let X = J[J.length - 1];
          if (X) {
            let I = Math.max(X.startTime - tj4.getActivationStart(), 0);
            if (I < Q.firstHiddenTime) B.value = I, B.entries = [X], G()
          }
        },
        Y = QT4.observe("largest-contentful-paint", Z);
      if (Y) {
        G = sj4.bindReporter(A, B);
        let J = () => {
          if (!AWQ[B.id]) Z(Y.takeRecords()), Y.disconnect(), AWQ[B.id] = !0, G(!0)
        };
        return ["keydown", "click"].forEach((X) => {
          if (rj4.WINDOW.document) addEventListener(X, J, {
            once: !0,
            capture: !0
          })
        }), BT4.onHidden(J, !0), J
      }
      return
    };
  QWQ.onLCP = GT4
})
// @from(Ln 59943, Col 4)
ZWQ = U((GWQ) => {
  Object.defineProperty(GWQ, "__esModule", {
    value: !0
  });
  var QT1 = AL(),
    YT4 = KZA(),
    JT4 = GnA(),
    XT4 = kqA(),
    IT4 = VZA(),
    BT1 = (A) => {
      if (!QT1.WINDOW.document) return;
      if (QT1.WINDOW.document.prerendering) addEventListener("prerenderingchange", () => BT1(A), !0);
      else if (QT1.WINDOW.document.readyState !== "complete") addEventListener("load", () => BT1(A), !0);
      else setTimeout(A, 0)
    },
    DT4 = (A, Q) => {
      Q = Q || {};
      let B = IT4.initMetric("TTFB"),
        G = YT4.bindReporter(A, B, Q.reportAllChanges);
      BT1(() => {
        let Z = XT4.getNavigationEntry();
        if (Z) {
          if (B.value = Math.max(Z.responseStart - JT4.getActivationStart(), 0), B.value < 0 || B.value > performance.now()) return;
          B.entries = [Z], G(!0)
        }
      })
    };
  GWQ.onTTFB = DT4
})
// @from(Ln 59972, Col 4)
EZA = U((FWQ) => {
  Object.defineProperty(FWQ, "__esModule", {
    value: !0
  });
  var YWQ = CQ(),
    KT4 = Cq(),
    VT4 = mDQ(),
    FT4 = pDQ(),
    HT4 = eDQ(),
    ET4 = BWQ(),
    zT4 = k1A(),
    $T4 = ZWQ(),
    bqA = {},
    InA = {},
    JWQ, XWQ, IWQ, DWQ, WWQ;

  function CT4(A, Q = !1) {
    return fqA("cls", A, OT4, JWQ, Q)
  }

  function UT4(A, Q = !1) {
    return fqA("lcp", A, RT4, IWQ, Q)
  }

  function qT4(A) {
    return fqA("ttfb", A, _T4, DWQ)
  }

  function NT4(A) {
    return fqA("fid", A, MT4, XWQ)
  }

  function wT4(A) {
    return fqA("inp", A, jT4, WWQ)
  }

  function LT4(A, Q) {
    if (KWQ(A, Q), !InA[A]) TT4(A), InA[A] = !0;
    return VWQ(A, Q)
  }

  function HZA(A, Q) {
    let B = bqA[A];
    if (!B || !B.length) return;
    for (let G of B) try {
      G(Q)
    } catch (Z) {
      KT4.DEBUG_BUILD && YWQ.logger.error(`Error while triggering instrumentation handler.
Type: ${A}
Name: ${YWQ.getFunctionName(G)}
Error:`, Z)
    }
  }

  function OT4() {
    return VT4.onCLS((A) => {
      HZA("cls", {
        metric: A
      }), JWQ = A
    }, {
      reportAllChanges: !0
    })
  }

  function MT4() {
    return FT4.onFID((A) => {
      HZA("fid", {
        metric: A
      }), XWQ = A
    })
  }

  function RT4() {
    return ET4.onLCP((A) => {
      HZA("lcp", {
        metric: A
      }), IWQ = A
    })
  }

  function _T4() {
    return $T4.onTTFB((A) => {
      HZA("ttfb", {
        metric: A
      }), DWQ = A
    })
  }

  function jT4() {
    return HT4.onINP((A) => {
      HZA("inp", {
        metric: A
      }), WWQ = A
    })
  }

  function fqA(A, Q, B, G, Z = !1) {
    KWQ(A, Q);
    let Y;
    if (!InA[A]) Y = B(), InA[A] = !0;
    if (G) Q({
      metric: G
    });
    return VWQ(A, Q, Z ? Y : void 0)
  }

  function TT4(A) {
    let Q = {};
    if (A === "event") Q.durationThreshold = 0;
    zT4.observe(A, (B) => {
      HZA(A, {
        entries: B
      })
    }, Q)
  }

  function KWQ(A, Q) {
    bqA[A] = bqA[A] || [], bqA[A].push(Q)
  }

  function VWQ(A, Q, B) {
    return () => {
      if (B) B();
      let G = bqA[A];
      if (!G) return;
      let Z = G.indexOf(Q);
      if (Z !== -1) G.splice(Z, 1)
    }
  }
  FWQ.addClsInstrumentationHandler = CT4;
  FWQ.addFidInstrumentationHandler = NT4;
  FWQ.addInpInstrumentationHandler = wT4;
  FWQ.addLcpInstrumentationHandler = UT4;
  FWQ.addPerformanceInstrumentationHandler = LT4;
  FWQ.addTtfbInstrumentationHandler = qT4
})
// @from(Ln 60108, Col 4)
EWQ = U((HWQ) => {
  Object.defineProperty(HWQ, "__esModule", {
    value: !0
  });

  function bT4(A) {
    return typeof A === "number" && isFinite(A)
  }

  function fT4(A, {
    startTimestamp: Q,
    ...B
  }) {
    if (Q && A.startTimestamp > Q) A.startTimestamp = Q;
    return A.startChild({
      startTimestamp: Q,
      ...B
    })
  }
  HWQ._startChild = fT4;
  HWQ.isMeasurementValue = bT4
})
// @from(Ln 60130, Col 4)
YT1 = U((qWQ) => {
  Object.defineProperty(qWQ, "__esModule", {
    value: !0
  });
  var Og = U6(),
    rZ = CQ(),
    QL = Cq(),
    b1A = EZA(),
    Mg = AL(),
    uT4 = JnA(),
    Rg = EWQ(),
    mT4 = kqA(),
    dT4 = 2147483647;

  function dK(A) {
    return A / 1000
  }

  function ZT1() {
    return Mg.WINDOW && Mg.WINDOW.addEventListener && Mg.WINDOW.performance
  }
  var zWQ = 0,
    kI = {},
    Bv, hqA;

  function cT4() {
    let A = ZT1();
    if (A && rZ.browserPerformanceTimeOrigin) {
      if (A.mark) Mg.WINDOW.performance.mark("sentry-tracing-init");
      let Q = oT4(),
        B = nT4(),
        G = aT4(),
        Z = rT4();
      return () => {
        Q(), B(), G(), Z()
      }
    }
    return () => {
      return
    }
  }

  function pT4() {
    b1A.addPerformanceInstrumentationHandler("longtask", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Og.getActiveTransaction();
        if (!B) return;
        let G = dK(rZ.browserPerformanceTimeOrigin + Q.startTime),
          Z = dK(Q.duration);
        B.startChild({
          description: "Main UI thread blocked",
          op: "ui.long-task",
          origin: "auto.ui.browser.metrics",
          startTimestamp: G,
          endTimestamp: G + Z
        })
      }
    })
  }

  function lT4() {
    b1A.addPerformanceInstrumentationHandler("event", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Og.getActiveTransaction();
        if (!B) return;
        if (Q.name === "click") {
          let G = dK(rZ.browserPerformanceTimeOrigin + Q.startTime),
            Z = dK(Q.duration),
            Y = {
              description: rZ.htmlTreeAsString(Q.target),
              op: `ui.interaction.${Q.name}`,
              origin: "auto.ui.browser.metrics",
              startTimestamp: G,
              endTimestamp: G + Z
            },
            J = rZ.getComponentName(Q.target);
          if (J) Y.attributes = {
            "ui.component_name": J
          };
          B.startChild(Y)
        }
      }
    })
  }

  function iT4(A, Q) {
    if (ZT1() && rZ.browserPerformanceTimeOrigin) {
      let G = sT4(A, Q);
      return () => {
        G()
      }
    }
    return () => {
      return
    }
  }

  function nT4() {
    return b1A.addClsInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding CLS"), kI.cls = {
        value: A.value,
        unit: ""
      }, hqA = Q
    }, !0)
  }

  function aT4() {
    return b1A.addLcpInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding LCP"), kI.lcp = {
        value: A.value,
        unit: "millisecond"
      }, Bv = Q
    }, !0)
  }

  function oT4() {
    return b1A.addFidInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      let B = dK(rZ.browserPerformanceTimeOrigin),
        G = dK(Q.startTime);
      QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding FID"), kI.fid = {
        value: A.value,
        unit: "millisecond"
      }, kI["mark.fid"] = {
        value: B + G,
        unit: "second"
      }
    })
  }

  function rT4() {
    return b1A.addTtfbInstrumentationHandler(({
      metric: A
    }) => {
      if (!A.entries[A.entries.length - 1]) return;
      QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding TTFB"), kI.ttfb = {
        value: A.value,
        unit: "millisecond"
      }
    })
  }
  var $WQ = {
    click: "click",
    pointerdown: "click",
    pointerup: "click",
    mousedown: "click",
    mouseup: "click",
    touchstart: "click",
    touchend: "click",
    mouseover: "hover",
    mouseout: "hover",
    mouseenter: "hover",
    mouseleave: "hover",
    pointerover: "hover",
    pointerout: "hover",
    pointerenter: "hover",
    pointerleave: "hover",
    dragstart: "drag",
    dragend: "drag",
    drag: "drag",
    dragenter: "drag",
    dragleave: "drag",
    dragover: "drag",
    drop: "drag",
    keydown: "press",
    keyup: "press",
    keypress: "press",
    input: "press"
  };

  function sT4(A, Q) {
    return b1A.addInpInstrumentationHandler(({
      metric: B
    }) => {
      if (B.value === void 0) return;
      let G = B.entries.find((L) => L.duration === B.value && $WQ[L.name] !== void 0),
        Z = Og.getClient();
      if (!G || !Z) return;
      let Y = $WQ[G.name],
        J = Z.getOptions(),
        X = dK(rZ.browserPerformanceTimeOrigin + G.startTime),
        I = dK(B.value),
        D = G.interactionId !== void 0 ? A[G.interactionId] : void 0;
      if (D === void 0) return;
      let {
        routeName: W,
        parentContext: K,
        activeTransaction: V,
        user: F,
        replayId: H
      } = D, E = F !== void 0 ? F.email || F.id || F.ip_address : void 0, z = V !== void 0 ? V.getProfileId() : void 0, $ = new Og.Span({
        startTimestamp: X,
        endTimestamp: X + I,
        op: `ui.interaction.${Y}`,
        name: rZ.htmlTreeAsString(G.target),
        attributes: {
          release: J.release,
          environment: J.environment,
          transaction: W,
          ...E !== void 0 && E !== "" ? {
            user: E
          } : {},
          ...z !== void 0 ? {
            profile_id: z
          } : {},
          ...H !== void 0 ? {
            replay_id: H
          } : {}
        },
        exclusiveTime: B.value,
        measurements: {
          inp: {
            value: B.value,
            unit: "millisecond"
          }
        }
      }), O = ZP4(K, J, Q);
      if (!O) return;
      if (Math.random() < O) {
        let L = $ ? Og.createSpanEnvelope([$], Z.getDsn()) : void 0,
          M = Z && Z.getTransport();
        if (M && L) M.send(L).then(null, (_) => {
          QL.DEBUG_BUILD && rZ.logger.error("Error while sending interaction:", _)
        });
        return
      }
    })
  }

  function tT4(A) {
    let Q = ZT1();
    if (!Q || !Mg.WINDOW.performance.getEntries || !rZ.browserPerformanceTimeOrigin) return;
    QL.DEBUG_BUILD && rZ.logger.log("[Tracing] Adding & adjusting spans using Performance API");
    let B = dK(rZ.browserPerformanceTimeOrigin),
      G = Q.getEntries(),
      {
        op: Z,
        start_timestamp: Y
      } = Og.spanToJSON(A);
    if (G.slice(zWQ).forEach((J) => {
        let X = dK(J.startTime),
          I = dK(J.duration);
        if (A.op === "navigation" && Y && B + X < Y) return;
        switch (J.entryType) {
          case "navigation": {
            eT4(A, J, B);
            break
          }
          case "mark":
          case "paint":
          case "measure": {
            CWQ(A, J, X, I, B);
            let D = uT4.getVisibilityWatcher(),
              W = J.startTime < D.firstHiddenTime;
            if (J.name === "first-paint" && W) QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding FP"), kI.fp = {
              value: J.startTime,
              unit: "millisecond"
            };
            if (J.name === "first-contentful-paint" && W) QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding FCP"), kI.fcp = {
              value: J.startTime,
              unit: "millisecond"
            };
            break
          }
          case "resource": {
            UWQ(A, J, J.name, X, I, B);
            break
          }
        }
      }), zWQ = Math.max(G.length - 1, 0), QP4(A), Z === "pageload") {
      GP4(kI), ["fcp", "fp", "lcp"].forEach((X) => {
        if (!kI[X] || !Y || B >= Y) return;
        let I = kI[X].value,
          D = B + dK(I),
          W = Math.abs((D - Y) * 1000),
          K = W - I;
        QL.DEBUG_BUILD && rZ.logger.log(`[Measurements] Normalized ${X} from ${I} to ${W} (${K})`), kI[X].value = W
      });
      let J = kI["mark.fid"];
      if (J && kI.fid) Rg._startChild(A, {
        description: "first input delay",
        endTimestamp: J.value + dK(kI.fid.value),
        op: "ui.action",
        origin: "auto.ui.browser.metrics",
        startTimestamp: J.value
      }), delete kI["mark.fid"];
      if (!("fcp" in kI)) delete kI.cls;
      Object.keys(kI).forEach((X) => {
        Og.setMeasurement(X, kI[X].value, kI[X].unit)
      }), BP4(A)
    }
    Bv = void 0, hqA = void 0, kI = {}
  }

  function CWQ(A, Q, B, G, Z) {
    let Y = Z + B,
      J = Y + G;
    return Rg._startChild(A, {
      description: Q.name,
      endTimestamp: J,
      op: Q.entryType,
      origin: "auto.resource.browser.metrics",
      startTimestamp: Y
    }), Y
  }

  function eT4(A, Q, B) {
    ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((G) => {
      DnA(A, Q, G, B)
    }), DnA(A, Q, "secureConnection", B, "TLS/SSL", "connectEnd"), DnA(A, Q, "fetch", B, "cache", "domainLookupStart"), DnA(A, Q, "domainLookup", B, "DNS"), AP4(A, Q, B)
  }

  function DnA(A, Q, B, G, Z, Y) {
    let J = Y ? Q[Y] : Q[`${B}End`],
      X = Q[`${B}Start`];
    if (!X || !J) return;
    Rg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: Z || B,
      startTimestamp: G + dK(X),
      endTimestamp: G + dK(J)
    })
  }

  function AP4(A, Q, B) {
    if (Q.responseEnd) Rg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "request",
      startTimestamp: B + dK(Q.requestStart),
      endTimestamp: B + dK(Q.responseEnd)
    }), Rg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "response",
      startTimestamp: B + dK(Q.responseStart),
      endTimestamp: B + dK(Q.responseEnd)
    })
  }

  function UWQ(A, Q, B, G, Z, Y) {
    if (Q.initiatorType === "xmlhttprequest" || Q.initiatorType === "fetch") return;
    let J = rZ.parseUrl(B),
      X = {};
    if (GT1(X, Q, "transferSize", "http.response_transfer_size"), GT1(X, Q, "encodedBodySize", "http.response_content_length"), GT1(X, Q, "decodedBodySize", "http.decoded_response_content_length"), "renderBlockingStatus" in Q) X["resource.render_blocking_status"] = Q.renderBlockingStatus;
    if (J.protocol) X["url.scheme"] = J.protocol.split(":").pop();
    if (J.host) X["server.address"] = J.host;
    X["url.same_origin"] = B.includes(Mg.WINDOW.location.origin);
    let I = Y + G,
      D = I + Z;
    Rg._startChild(A, {
      description: B.replace(Mg.WINDOW.location.origin, ""),
      endTimestamp: D,
      op: Q.initiatorType ? `resource.${Q.initiatorType}` : "resource.other",
      origin: "auto.resource.browser.metrics",
      startTimestamp: I,
      data: X
    })
  }

  function QP4(A) {
    let Q = Mg.WINDOW.navigator;
    if (!Q) return;
    let B = Q.connection;
    if (B) {
      if (B.effectiveType) A.setTag("effectiveConnectionType", B.effectiveType);
      if (B.type) A.setTag("connectionType", B.type);
      if (Rg.isMeasurementValue(B.rtt)) kI["connection.rtt"] = {
        value: B.rtt,
        unit: "millisecond"
      }
    }
    if (Rg.isMeasurementValue(Q.deviceMemory)) A.setTag("deviceMemory", `${Q.deviceMemory} GB`);
    if (Rg.isMeasurementValue(Q.hardwareConcurrency)) A.setTag("hardwareConcurrency", String(Q.hardwareConcurrency))
  }

  function BP4(A) {
    if (Bv) {
      if (QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding LCP Data"), Bv.element) A.setTag("lcp.element", rZ.htmlTreeAsString(Bv.element));
      if (Bv.id) A.setTag("lcp.id", Bv.id);
      if (Bv.url) A.setTag("lcp.url", Bv.url.trim().slice(0, 200));
      A.setTag("lcp.size", Bv.size)
    }
    if (hqA && hqA.sources) QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding CLS Data"), hqA.sources.forEach((Q, B) => A.setTag(`cls.source.${B+1}`, rZ.htmlTreeAsString(Q.node)))
  }

  function GT1(A, Q, B, G) {
    let Z = Q[B];
    if (Z != null && Z < dT4) A[G] = Z
  }

  function GP4(A) {
    let Q = mT4.getNavigationEntry();
    if (!Q) return;
    let {
      responseStart: B,
      requestStart: G
    } = Q;
    if (G <= B) QL.DEBUG_BUILD && rZ.logger.log("[Measurements] Adding TTFB Request Time"), A["ttfb.requestTime"] = {
      value: B - G,
      unit: "millisecond"
    }
  }

  function ZP4(A, Q, B) {
    if (!Og.hasTracingEnabled(Q)) return !1;
    let G;
    if (A !== void 0 && typeof Q.tracesSampler === "function") G = Q.tracesSampler({
      transactionContext: A,
      name: A.name,
      parentSampled: A.parentSampled,
      attributes: {
        ...A.data,
        ...A.attributes
      },
      location: Mg.WINDOW.location
    });
    else if (A !== void 0 && A.sampled !== void 0) G = A.sampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate;
    else G = 1;
    if (!Og.isValidSampleRate(G)) return QL.DEBUG_BUILD && rZ.logger.warn("[Tracing] Discarding interaction span because of invalid sample rate."), !1;
    if (G === !0) return B;
    else if (G === !1) return 0;
    return G * B
  }
  qWQ._addMeasureSpans = CWQ;
  qWQ._addResourceSpans = UWQ;
  qWQ.addPerformanceEntries = tT4;
  qWQ.startTrackingINP = iT4;
  qWQ.startTrackingInteractions = lT4;
  qWQ.startTrackingLongTasks = pT4;
  qWQ.startTrackingWebVitals = cT4
})
// @from(Ln 60579, Col 4)
JT1 = U((wWQ) => {
  Object.defineProperty(wWQ, "__esModule", {
    value: !0
  });
  var Gv = U6(),
    f1A = CQ();

  function VP4(A, Q, B, G, Z = "auto.http.browser") {
    if (!Gv.hasTracingEnabled() || !A.fetchData) return;
    let Y = Q(A.fetchData.url);
    if (A.endTimestamp && Y) {
      let F = A.fetchData.__span;
      if (!F) return;
      let H = G[F];
      if (H) HP4(H, A), delete G[F];
      return
    }
    let J = Gv.getCurrentScope(),
      X = Gv.getClient(),
      {
        method: I,
        url: D
      } = A.fetchData,
      W = FP4(D),
      K = W ? f1A.parseUrl(W).host : void 0,
      V = Y ? Gv.startInactiveSpan({
        name: `${I} ${D}`,
        onlyIfParent: !0,
        attributes: {
          url: D,
          type: "fetch",
          "http.method": I,
          "http.url": W,
          "server.address": K,
          [Gv.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: Z
        },
        op: "http.client"
      }) : void 0;
    if (V) A.fetchData.__span = V.spanContext().spanId, G[V.spanContext().spanId] = V;
    if (B(A.fetchData.url) && X) {
      let F = A.args[0];
      A.args[1] = A.args[1] || {};
      let H = A.args[1];
      H.headers = NWQ(F, X, J, H, V)
    }
    return V
  }

  function NWQ(A, Q, B, G, Z) {
    let Y = Z || B.getSpan(),
      J = Gv.getIsolationScope(),
      {
        traceId: X,
        spanId: I,
        sampled: D,
        dsc: W
      } = {
        ...J.getPropagationContext(),
        ...B.getPropagationContext()
      },
      K = Y ? Gv.spanToTraceHeader(Y) : f1A.generateSentryTraceHeader(X, I, D),
      V = f1A.dynamicSamplingContextToSentryBaggageHeader(W || (Y ? Gv.getDynamicSamplingContextFromSpan(Y) : Gv.getDynamicSamplingContextFromClient(X, Q, B))),
      F = G.headers || (typeof Request < "u" && f1A.isInstanceOf(A, Request) ? A.headers : void 0);
    if (!F) return {
      "sentry-trace": K,
      baggage: V
    };
    else if (typeof Headers < "u" && f1A.isInstanceOf(F, Headers)) {
      let H = new Headers(F);
      if (H.append("sentry-trace", K), V) H.append(f1A.BAGGAGE_HEADER_NAME, V);
      return H
    } else if (Array.isArray(F)) {
      let H = [...F, ["sentry-trace", K]];
      if (V) H.push([f1A.BAGGAGE_HEADER_NAME, V]);
      return H
    } else {
      let H = "baggage" in F ? F.baggage : void 0,
        E = [];
      if (Array.isArray(H)) E.push(...H);
      else if (H) E.push(H);
      if (V) E.push(V);
      return {
        ...F,
        "sentry-trace": K,
        baggage: E.length > 0 ? E.join(",") : void 0
      }
    }
  }

  function FP4(A) {
    try {
      return new URL(A).href
    } catch (Q) {
      return
    }
  }

  function HP4(A, Q) {
    if (Q.response) {
      Gv.setHttpStatus(A, Q.response.status);
      let B = Q.response && Q.response.headers && Q.response.headers.get("content-length");
      if (B) {
        let G = parseInt(B);
        if (G > 0) A.setAttribute("http.response_content_length", G)
      }
    } else if (Q.error) A.setStatus("internal_error");
    A.end()
  }
  wWQ.addTracingHeadersToFetchRequest = NWQ;
  wWQ.instrumentFetchRequest = VP4
})
// @from(Ln 60690, Col 4)
KnA = U((jWQ) => {
  Object.defineProperty(jWQ, "__esModule", {
    value: !0
  });
  var MT = U6(),
    RT = CQ(),
    $P4 = JT1(),
    CP4 = EZA(),
    UP4 = AL(),
    WnA = ["localhost", /^\/(?!\/)/],
    XT1 = {
      traceFetch: !0,
      traceXHR: !0,
      enableHTTPTimings: !0,
      tracingOrigins: WnA,
      tracePropagationTargets: WnA
    };

  function qP4(A) {
    let {
      traceFetch: Q,
      traceXHR: B,
      tracePropagationTargets: G,
      tracingOrigins: Z,
      shouldCreateSpanForRequest: Y,
      enableHTTPTimings: J
    } = {
      traceFetch: XT1.traceFetch,
      traceXHR: XT1.traceXHR,
      ...A
    }, X = typeof Y === "function" ? Y : (W) => !0, I = (W) => MWQ(W, G || Z), D = {};
    if (Q) RT.addFetchInstrumentationHandler((W) => {
      let K = $P4.instrumentFetchRequest(W, X, I, D);
      if (K) {
        let V = _WQ(W.fetchData.url),
          F = V ? RT.parseUrl(V).host : void 0;
        K.setAttributes({
          "http.url": V,
          "server.address": F
        })
      }
      if (J && K) LWQ(K)
    });
    if (B) RT.addXhrInstrumentationHandler((W) => {
      let K = RWQ(W, X, I, D);
      if (J && K) LWQ(K)
    })
  }

  function NP4(A) {
    return A.entryType === "resource" && "initiatorType" in A && typeof A.nextHopProtocol === "string" && (A.initiatorType === "fetch" || A.initiatorType === "xmlhttprequest")
  }

  function LWQ(A) {
    let {
      url: Q
    } = MT.spanToJSON(A).data || {};
    if (!Q || typeof Q !== "string") return;
    let B = CP4.addPerformanceInstrumentationHandler("resource", ({
      entries: G
    }) => {
      G.forEach((Z) => {
        if (NP4(Z) && Z.name.endsWith(Q)) wP4(Z).forEach((J) => A.setAttribute(...J)), setTimeout(B)
      })
    })
  }

  function OWQ(A) {
    let Q = "unknown",
      B = "unknown",
      G = "";
    for (let Z of A) {
      if (Z === "/") {
        [Q, B] = A.split("/");
        break
      }
      if (!isNaN(Number(Z))) {
        Q = G === "h" ? "http" : G, B = A.split(G)[1];
        break
      }
      G += Z
    }
    if (G === A) Q = G;
    return {
      name: Q,
      version: B
    }
  }

  function Zv(A = 0) {
    return ((RT.browserPerformanceTimeOrigin || performance.timeOrigin) + A) / 1000
  }

  function wP4(A) {
    let {
      name: Q,
      version: B
    } = OWQ(A.nextHopProtocol), G = [];
    if (G.push(["network.protocol.version", B], ["network.protocol.name", Q]), !RT.browserPerformanceTimeOrigin) return G;
    return [...G, ["http.request.redirect_start", Zv(A.redirectStart)],
      ["http.request.fetch_start", Zv(A.fetchStart)],
      ["http.request.domain_lookup_start", Zv(A.domainLookupStart)],
      ["http.request.domain_lookup_end", Zv(A.domainLookupEnd)],
      ["http.request.connect_start", Zv(A.connectStart)],
      ["http.request.secure_connection_start", Zv(A.secureConnectionStart)],
      ["http.request.connection_end", Zv(A.connectEnd)],
      ["http.request.request_start", Zv(A.requestStart)],
      ["http.request.response_start", Zv(A.responseStart)],
      ["http.request.response_end", Zv(A.responseEnd)]
    ]
  }

  function MWQ(A, Q) {
    return RT.stringMatchesSomePattern(A, Q || WnA)
  }

  function RWQ(A, Q, B, G) {
    let Z = A.xhr,
      Y = Z && Z[RT.SENTRY_XHR_DATA_KEY];
    if (!MT.hasTracingEnabled() || !Z || Z.__sentry_own_request__ || !Y) return;
    let J = Q(Y.url);
    if (A.endTimestamp && J) {
      let F = Z.__sentry_xhr_span_id__;
      if (!F) return;
      let H = G[F];
      if (H && Y.status_code !== void 0) MT.setHttpStatus(H, Y.status_code), H.end(), delete G[F];
      return
    }
    let X = MT.getCurrentScope(),
      I = MT.getIsolationScope(),
      D = _WQ(Y.url),
      W = D ? RT.parseUrl(D).host : void 0,
      K = J ? MT.startInactiveSpan({
        name: `${Y.method} ${Y.url}`,
        onlyIfParent: !0,
        attributes: {
          type: "xhr",
          "http.method": Y.method,
          "http.url": D,
          url: Y.url,
          "server.address": W,
          [MT.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser"
        },
        op: "http.client"
      }) : void 0;
    if (K) Z.__sentry_xhr_span_id__ = K.spanContext().spanId, G[Z.__sentry_xhr_span_id__] = K;
    let V = MT.getClient();
    if (Z.setRequestHeader && B(Y.url) && V) {
      let {
        traceId: F,
        spanId: H,
        sampled: E,
        dsc: z
      } = {
        ...I.getPropagationContext(),
        ...X.getPropagationContext()
      }, $ = K ? MT.spanToTraceHeader(K) : RT.generateSentryTraceHeader(F, H, E), O = RT.dynamicSamplingContextToSentryBaggageHeader(z || (K ? MT.getDynamicSamplingContextFromSpan(K) : MT.getDynamicSamplingContextFromClient(F, V, X)));
      LP4(Z, $, O)
    }
    return K
  }

  function LP4(A, Q, B) {
    try {
      if (A.setRequestHeader("sentry-trace", Q), B) A.setRequestHeader(RT.BAGGAGE_HEADER_NAME, B)
    } catch (G) {}
  }

  function _WQ(A) {
    try {
      return new URL(A, UP4.WINDOW.location.origin).href
    } catch (Q) {
      return
    }
  }
  jWQ.DEFAULT_TRACE_PROPAGATION_TARGETS = WnA;
  jWQ.defaultRequestInstrumentationOptions = XT1;
  jWQ.extractNetworkProtocol = OWQ;
  jWQ.instrumentOutgoingRequests = qP4;
  jWQ.shouldAttachHeaders = MWQ;
  jWQ.xhrCallback = RWQ
})
// @from(Ln 60872, Col 4)
SWQ = U((PWQ) => {
  Object.defineProperty(PWQ, "__esModule", {
    value: !0
  });
  var gqA = CQ(),
    TWQ = Cq(),
    uqA = AL();

  function PP4(A, Q = !0, B = !0) {
    if (!uqA.WINDOW || !uqA.WINDOW.location) {
      TWQ.DEBUG_BUILD && gqA.logger.warn("Could not initialize routing instrumentation due to invalid location");
      return
    }
    let G = uqA.WINDOW.location.href,
      Z;
    if (Q) Z = A({
      name: uqA.WINDOW.location.pathname,
      startTimestamp: gqA.browserPerformanceTimeOrigin ? gqA.browserPerformanceTimeOrigin / 1000 : void 0,
      op: "pageload",
      origin: "auto.pageload.browser",
      metadata: {
        source: "url"
      }
    });
    if (B) gqA.addHistoryInstrumentationHandler(({
      to: Y,
      from: J
    }) => {
      if (J === void 0 && G && G.indexOf(Y) !== -1) {
        G = void 0;
        return
      }
      if (J !== Y) {
        if (G = void 0, Z) TWQ.DEBUG_BUILD && gqA.logger.log(`[Tracing] Finishing current transaction with op: ${Z.op}`), Z.end();
        Z = A({
          name: uqA.WINDOW.location.pathname,
          op: "navigation",
          origin: "auto.navigation.browser",
          metadata: {
            source: "url"
          }
        })
      }
    })
  }
  PWQ.instrumentRoutingWithDefaults = PP4
})
// @from(Ln 60919, Col 4)
hWQ = U((fWQ) => {
  Object.defineProperty(fWQ, "__esModule", {
    value: !0
  });
  var _T = U6(),
    _g = CQ(),
    _i = Cq(),
    xP4 = sj1(),
    xWQ = EZA(),
    mqA = YT1(),
    vWQ = KnA(),
    yP4 = SWQ(),
    h1A = AL(),
    kWQ = "BrowserTracing",
    vP4 = {
      ..._T.TRACING_DEFAULTS,
      markBackgroundTransactions: !0,
      routingInstrumentation: yP4.instrumentRoutingWithDefaults,
      startTransactionOnLocationChange: !0,
      startTransactionOnPageLoad: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...vWQ.defaultRequestInstrumentationOptions
    },
    yWQ = 10;
  class bWQ {
    constructor(A) {
      if (this.name = kWQ, this._hasSetTracePropagationTargets = !1, _T.addTracingExtensions(), _i.DEBUG_BUILD) this._hasSetTracePropagationTargets = !!(A && (A.tracePropagationTargets || A.tracingOrigins));
      if (this.options = {
          ...vP4,
          ...A
        }, this.options._experiments.enableLongTask !== void 0) this.options.enableLongTask = this.options._experiments.enableLongTask;
      if (A && !A.tracePropagationTargets && A.tracingOrigins) this.options.tracePropagationTargets = A.tracingOrigins;
      if (this._collectWebVitals = mqA.startTrackingWebVitals(), this._interactionIdToRouteNameMapping = {}, this.options.enableInp) mqA.startTrackingINP(this._interactionIdToRouteNameMapping, this.options.interactionsSampleRate);
      if (this.options.enableLongTask) mqA.startTrackingLongTasks();
      if (this.options._experiments.enableInteractions) mqA.startTrackingInteractions();
      this._latestRoute = {
        name: void 0,
        context: void 0
      }
    }
    setupOnce(A, Q) {
      this._getCurrentHub = Q;
      let G = Q().getClient(),
        Z = G && G.getOptions(),
        {
          routingInstrumentation: Y,
          startTransactionOnLocationChange: J,
          startTransactionOnPageLoad: X,
          markBackgroundTransactions: I,
          traceFetch: D,
          traceXHR: W,
          shouldCreateSpanForRequest: K,
          enableHTTPTimings: V,
          _experiments: F
        } = this.options,
        H = Z && Z.tracePropagationTargets,
        E = H || this.options.tracePropagationTargets;
      if (_i.DEBUG_BUILD && this._hasSetTracePropagationTargets && H) _g.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
      if (Y((z) => {
          let $ = this._createRouteTransaction(z);
          return this.options._experiments.onStartRouteTransaction && this.options._experiments.onStartRouteTransaction($, z, Q), $
        }, X, J), I) xP4.registerBackgroundTabDetection();
      if (F.enableInteractions) this._registerInteractionListener();
      if (this.options.enableInp) this._registerInpInteractionListener();
      vWQ.instrumentOutgoingRequests({
        traceFetch: D,
        traceXHR: W,
        tracePropagationTargets: E,
        shouldCreateSpanForRequest: K,
        enableHTTPTimings: V
      })
    }
    _createRouteTransaction(A) {
      if (!this._getCurrentHub) {
        _i.DEBUG_BUILD && _g.logger.warn(`[Tracing] Did not create ${A.op} transaction because _getCurrentHub is invalid.`);
        return
      }
      let Q = this._getCurrentHub(),
        {
          beforeNavigate: B,
          idleTimeout: G,
          finalTimeout: Z,
          heartbeatInterval: Y
        } = this.options,
        J = A.op === "pageload",
        X;
      if (J) {
        let V = J ? IT1("sentry-trace") : "",
          F = J ? IT1("baggage") : void 0,
          {
            traceId: H,
            dsc: E,
            parentSpanId: z,
            sampled: $
          } = _g.propagationContextFromHeaders(V, F);
        X = {
          traceId: H,
          parentSpanId: z,
          parentSampled: $,
          ...A,
          metadata: {
            ...A.metadata,
            dynamicSamplingContext: E
          },
          trimEnd: !0
        }
      } else X = {
        trimEnd: !0,
        ...A
      };
      let I = typeof B === "function" ? B(X) : X,
        D = I === void 0 ? {
          ...X,
          sampled: !1
        } : I;
      if (D.metadata = D.name !== X.name ? {
          ...D.metadata,
          source: "custom"
        } : D.metadata, this._latestRoute.name = D.name, this._latestRoute.context = D, D.sampled === !1) _i.DEBUG_BUILD && _g.logger.log(`[Tracing] Will not send ${D.op} transaction because of beforeNavigate.`);
      _i.DEBUG_BUILD && _g.logger.log(`[Tracing] Starting ${D.op} transaction on scope`);
      let {
        location: W
      } = h1A.WINDOW, K = _T.startIdleTransaction(Q, D, G, Z, !0, {
        location: W
      }, Y, J);
      if (J) {
        if (h1A.WINDOW.document) {
          if (h1A.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(h1A.WINDOW.document.readyState)) K.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(h1A.WINDOW.document.readyState)) K.sendAutoFinishSignal()
        }
      }
      return K.registerBeforeFinishCallback((V) => {
        this._collectWebVitals(), mqA.addPerformanceEntries(V)
      }), K
    }
    _registerInteractionListener() {
      let A, Q = () => {
        let {
          idleTimeout: B,
          finalTimeout: G,
          heartbeatInterval: Z
        } = this.options, Y = "ui.action.click", J = _T.getActiveTransaction();
        if (J && J.op && ["navigation", "pageload"].includes(J.op)) {
          _i.DEBUG_BUILD && _g.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
          return
        }
        if (A) A.setFinishReason("interactionInterrupted"), A.end(), A = void 0;
        if (!this._getCurrentHub) {
          _i.DEBUG_BUILD && _g.logger.warn("[Tracing] Did not create ui.action.click transaction because _getCurrentHub is invalid.");
          return
        }
        if (!this._latestRoute.name) {
          _i.DEBUG_BUILD && _g.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
          return
        }
        let X = this._getCurrentHub(),
          {
            location: I
          } = h1A.WINDOW,
          D = {
            name: this._latestRoute.name,
            op: "ui.action.click",
            trimEnd: !0,
            data: {
              [_T.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: this._latestRoute.context ? kP4(this._latestRoute.context) : "url"
            }
          };
        A = _T.startIdleTransaction(X, D, B, G, !0, {
          location: I
        }, Z)
      };
      ["click"].forEach((B) => {
        if (h1A.WINDOW.document) addEventListener(B, Q, {
          once: !1,
          capture: !0
        })
      })
    }
    _registerInpInteractionListener() {
      let A = ({
        entries: Q
      }) => {
        let B = _T.getClient(),
          G = B !== void 0 && B.getIntegrationByName !== void 0 ? B.getIntegrationByName("Replay") : void 0,
          Z = G !== void 0 ? G.getReplayId() : void 0,
          Y = _T.getActiveTransaction(),
          J = _T.getCurrentScope(),
          X = J !== void 0 ? J.getUser() : void 0;
        Q.forEach((I) => {
          if (bP4(I)) {
            let D = I.interactionId;
            if (D === void 0) return;
            let W = this._interactionIdToRouteNameMapping[D],
              K = I.duration,
              V = I.startTime,
              F = Object.keys(this._interactionIdToRouteNameMapping),
              H = F.length > 0 ? F.reduce((E, z) => {
                return this._interactionIdToRouteNameMapping[E].duration < this._interactionIdToRouteNameMapping[z].duration ? E : z
              }) : void 0;
            if (I.entryType === "first-input") {
              if (F.map((z) => this._interactionIdToRouteNameMapping[z]).some((z) => {
                  return z.duration === K && z.startTime === V
                })) return
            }
            if (!D) return;
            if (W) W.duration = Math.max(W.duration, K);
            else if (F.length < yWQ || H === void 0 || K > this._interactionIdToRouteNameMapping[H].duration) {
              let E = this._latestRoute.name,
                z = this._latestRoute.context;
              if (E && z) {
                if (H && Object.keys(this._interactionIdToRouteNameMapping).length >= yWQ) delete this._interactionIdToRouteNameMapping[H];
                this._interactionIdToRouteNameMapping[D] = {
                  routeName: E,
                  duration: K,
                  parentContext: z,
                  user: X,
                  activeTransaction: Y,
                  replayId: Z,
                  startTime: V
                }
              }
            }
          }
        })
      };
      xWQ.addPerformanceInstrumentationHandler("event", A), xWQ.addPerformanceInstrumentationHandler("first-input", A)
    }
  }

  function IT1(A) {
    let Q = _g.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function kP4(A) {
    let Q = A.attributes && A.attributes[_T.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[_T.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }

  function bP4(A) {
    return "duration" in A
  }
  fWQ.BROWSER_TRACING_INTEGRATION_ID = kWQ;
  fWQ.BrowserTracing = bWQ;
  fWQ.getMetaContent = IT1
})
// @from(Ln 61171, Col 4)
iWQ = U((lWQ) => {
  Object.defineProperty(lWQ, "__esModule", {
    value: !0
  });
  var OD = U6(),
    cM = CQ(),
    ji = Cq(),
    uP4 = sj1(),
    gWQ = EZA(),
    dqA = YT1(),
    mWQ = KnA(),
    BL = AL(),
    dWQ = "BrowserTracing",
    mP4 = {
      ...OD.TRACING_DEFAULTS,
      instrumentNavigation: !0,
      instrumentPageLoad: !0,
      markBackgroundSpan: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...mWQ.defaultRequestInstrumentationOptions
    },
    dP4 = (A = {}) => {
      let Q = ji.DEBUG_BUILD ? !!(A.tracePropagationTargets || A.tracingOrigins) : !1;
      if (OD.addTracingExtensions(), !A.tracePropagationTargets && A.tracingOrigins) A.tracePropagationTargets = A.tracingOrigins;
      let B = {
          ...mP4,
          ...A
        },
        G = dqA.startTrackingWebVitals(),
        Z = {};
      if (B.enableInp) dqA.startTrackingINP(Z, B.interactionsSampleRate);
      if (B.enableLongTask) dqA.startTrackingLongTasks();
      if (B._experiments.enableInteractions) dqA.startTrackingInteractions();
      let Y = {
        name: void 0,
        context: void 0
      };

      function J(X) {
        let I = OD.getCurrentHub(),
          {
            beforeStartSpan: D,
            idleTimeout: W,
            finalTimeout: K,
            heartbeatInterval: V
          } = B,
          F = X.op === "pageload",
          H;
        if (F) {
          let O = F ? DT1("sentry-trace") : "",
            L = F ? DT1("baggage") : void 0,
            {
              traceId: M,
              dsc: _,
              parentSpanId: j,
              sampled: x
            } = cM.propagationContextFromHeaders(O, L);
          H = {
            traceId: M,
            parentSpanId: j,
            parentSampled: x,
            ...X,
            metadata: {
              ...X.metadata,
              dynamicSamplingContext: _
            },
            trimEnd: !0
          }
        } else H = {
          trimEnd: !0,
          ...X
        };
        let E = D ? D(H) : H;
        if (E.metadata = E.name !== H.name ? {
            ...E.metadata,
            source: "custom"
          } : E.metadata, Y.name = E.name, Y.context = E, E.sampled === !1) ji.DEBUG_BUILD && cM.logger.log(`[Tracing] Will not send ${E.op} transaction because of beforeNavigate.`);
        ji.DEBUG_BUILD && cM.logger.log(`[Tracing] Starting ${E.op} transaction on scope`);
        let {
          location: z
        } = BL.WINDOW, $ = OD.startIdleTransaction(I, E, W, K, !0, {
          location: z
        }, V, F);
        if (F && BL.WINDOW.document) {
          if (BL.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(BL.WINDOW.document.readyState)) $.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(BL.WINDOW.document.readyState)) $.sendAutoFinishSignal()
        }
        return $.registerBeforeFinishCallback((O) => {
          G(), dqA.addPerformanceEntries(O)
        }), $
      }
      return {
        name: dWQ,
        setupOnce: () => {},
        afterAllSetup(X) {
          let I = X.getOptions(),
            {
              markBackgroundSpan: D,
              traceFetch: W,
              traceXHR: K,
              shouldCreateSpanForRequest: V,
              enableHTTPTimings: F,
              _experiments: H
            } = B,
            E = I && I.tracePropagationTargets,
            z = E || B.tracePropagationTargets;
          if (ji.DEBUG_BUILD && Q && E) cM.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
          let $, O = BL.WINDOW.location && BL.WINDOW.location.href;
          if (X.on) X.on("startNavigationSpan", (L) => {
            if ($) ji.DEBUG_BUILD && cM.logger.log(`[Tracing] Finishing current transaction with op: ${OD.spanToJSON($).op}`), $.end();
            $ = J({
              op: "navigation",
              ...L
            })
          }), X.on("startPageLoadSpan", (L) => {
            if ($) ji.DEBUG_BUILD && cM.logger.log(`[Tracing] Finishing current transaction with op: ${OD.spanToJSON($).op}`), $.end();
            $ = J({
              op: "pageload",
              ...L
            })
          });
          if (B.instrumentPageLoad && X.emit && BL.WINDOW.location) {
            let L = {
              name: BL.WINDOW.location.pathname,
              startTimestamp: cM.browserPerformanceTimeOrigin ? cM.browserPerformanceTimeOrigin / 1000 : void 0,
              origin: "auto.pageload.browser",
              attributes: {
                [OD.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
              }
            };
            cWQ(X, L)
          }
          if (B.instrumentNavigation && X.emit && BL.WINDOW.location) cM.addHistoryInstrumentationHandler(({
            to: L,
            from: M
          }) => {
            if (M === void 0 && O && O.indexOf(L) !== -1) {
              O = void 0;
              return
            }
            if (M !== L) {
              O = void 0;
              let _ = {
                name: BL.WINDOW.location.pathname,
                origin: "auto.navigation.browser",
                attributes: {
                  [OD.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
                }
              };
              pWQ(X, _)
            }
          });
          if (D) uP4.registerBackgroundTabDetection();
          if (H.enableInteractions) cP4(B, Y);
          if (B.enableInp) lP4(Z, Y);
          mWQ.instrumentOutgoingRequests({
            traceFetch: W,
            traceXHR: K,
            tracePropagationTargets: z,
            shouldCreateSpanForRequest: V,
            enableHTTPTimings: F
          })
        },
        options: B
      }
    };

  function cWQ(A, Q) {
    if (!A.emit) return;
    A.emit("startPageLoadSpan", Q);
    let B = OD.getActiveSpan();
    return (B && OD.spanToJSON(B).op) === "pageload" ? B : void 0
  }

  function pWQ(A, Q) {
    if (!A.emit) return;
    A.emit("startNavigationSpan", Q);
    let B = OD.getActiveSpan();
    return (B && OD.spanToJSON(B).op) === "navigation" ? B : void 0
  }

  function DT1(A) {
    let Q = cM.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function cP4(A, Q) {
    let B, G = () => {
      let {
        idleTimeout: Z,
        finalTimeout: Y,
        heartbeatInterval: J
      } = A, X = "ui.action.click", I = OD.getActiveTransaction();
      if (I && I.op && ["navigation", "pageload"].includes(I.op)) {
        ji.DEBUG_BUILD && cM.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
        return
      }
      if (B) B.setFinishReason("interactionInterrupted"), B.end(), B = void 0;
      if (!Q.name) {
        ji.DEBUG_BUILD && cM.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
        return
      }
      let {
        location: D
      } = BL.WINDOW, W = {
        name: Q.name,
        op: "ui.action.click",
        trimEnd: !0,
        data: {
          [OD.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: Q.context ? iP4(Q.context) : "url"
        }
      };
      B = OD.startIdleTransaction(OD.getCurrentHub(), W, Z, Y, !0, {
        location: D
      }, J)
    };
    ["click"].forEach((Z) => {
      if (BL.WINDOW.document) addEventListener(Z, G, {
        once: !1,
        capture: !0
      })
    })
  }

  function pP4(A) {
    return "duration" in A
  }
  var uWQ = 10;

  function lP4(A, Q) {
    let B = ({
      entries: G
    }) => {
      let Z = OD.getClient(),
        Y = Z !== void 0 && Z.getIntegrationByName !== void 0 ? Z.getIntegrationByName("Replay") : void 0,
        J = Y !== void 0 ? Y.getReplayId() : void 0,
        X = OD.getActiveTransaction(),
        I = OD.getCurrentScope(),
        D = I !== void 0 ? I.getUser() : void 0;
      G.forEach((W) => {
        if (pP4(W)) {
          let K = W.interactionId;
          if (K === void 0) return;
          let V = A[K],
            F = W.duration,
            H = W.startTime,
            E = Object.keys(A),
            z = E.length > 0 ? E.reduce(($, O) => {
              return A[$].duration < A[O].duration ? $ : O
            }) : void 0;
          if (W.entryType === "first-input") {
            if (E.map((O) => A[O]).some((O) => {
                return O.duration === F && O.startTime === H
              })) return
          }
          if (!K) return;
          if (V) V.duration = Math.max(V.duration, F);
          else if (E.length < uWQ || z === void 0 || F > A[z].duration) {
            let {
              name: $,
              context: O
            } = Q;
            if ($ && O) {
              if (z && Object.keys(A).length >= uWQ) delete A[z];
              A[K] = {
                routeName: $,
                duration: F,
                parentContext: O,
                user: D,
                activeTransaction: X,
                replayId: J,
                startTime: H
              }
            }
          }
        }
      })
    };
    gWQ.addPerformanceInstrumentationHandler("event", B), gWQ.addPerformanceInstrumentationHandler("first-input", B)
  }

  function iP4(A) {
    let Q = A.attributes && A.attributes[OD.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[OD.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }
  lWQ.BROWSER_TRACING_INTEGRATION_ID = dWQ;
  lWQ.browserTracingIntegration = dP4;
  lWQ.getMetaContent = DT1;
  lWQ.startBrowserTracingNavigationSpan = pWQ;
  lWQ.startBrowserTracingPageLoadSpan = cWQ
})
// @from(Ln 61468, Col 4)
oWQ = U((aWQ, cqA) => {
  Object.defineProperty(aWQ, "__esModule", {
    value: !0
  });
  var nWQ = U6(),
    zZA = CQ();

  function tP4() {
    let A = nWQ.getMainCarrier();
    if (!A.__SENTRY__) return;
    let Q = {
        mongodb() {
          return new(zZA.dynamicRequire(cqA, "./node/integrations/mongo")).Mongo
        },
        mongoose() {
          return new(zZA.dynamicRequire(cqA, "./node/integrations/mongo")).Mongo
        },
        mysql() {
          return new(zZA.dynamicRequire(cqA, "./node/integrations/mysql")).Mysql
        },
        pg() {
          return new(zZA.dynamicRequire(cqA, "./node/integrations/postgres")).Postgres
        }
      },
      B = Object.keys(Q).filter((G) => !!zZA.loadModule(G)).map((G) => {
        try {
          return Q[G]()
        } catch (Z) {
          return
        }
      }).filter((G) => G);
    if (B.length > 0) A.__SENTRY__.integrations = [...A.__SENTRY__.integrations || [], ...B]
  }

  function eP4() {
    if (nWQ.addTracingExtensions(), zZA.isNodeEnv()) tP4()
  }
  aWQ.addExtensionMethods = eP4
})
// @from(Ln 61507, Col 4)
KT1 = U((AKQ) => {
  Object.defineProperty(AKQ, "__esModule", {
    value: !0
  });
  var jg = U6(),
    rWQ = CQ(),
    QS4 = JDQ(),
    BS4 = IDQ(),
    GS4 = WDQ(),
    ZS4 = FDQ(),
    YS4 = zDQ(),
    JS4 = UDQ(),
    XS4 = wDQ(),
    IS4 = ODQ(),
    sWQ = hWQ(),
    WT1 = iWQ(),
    tWQ = KnA(),
    VnA = EZA(),
    eWQ = JT1(),
    DS4 = oWQ();
  AKQ.IdleTransaction = jg.IdleTransaction;
  AKQ.Span = jg.Span;
  AKQ.SpanStatus = jg.SpanStatus;
  AKQ.Transaction = jg.Transaction;
  AKQ.extractTraceparentData = jg.extractTraceparentData;
  AKQ.getActiveTransaction = jg.getActiveTransaction;
  AKQ.hasTracingEnabled = jg.hasTracingEnabled;
  AKQ.spanStatusfromHttpCode = jg.spanStatusfromHttpCode;
  AKQ.startIdleTransaction = jg.startIdleTransaction;
  AKQ.TRACEPARENT_REGEXP = rWQ.TRACEPARENT_REGEXP;
  AKQ.stripUrlQueryAndFragment = rWQ.stripUrlQueryAndFragment;
  AKQ.Express = QS4.Express;
  AKQ.Postgres = BS4.Postgres;
  AKQ.Mysql = GS4.Mysql;
  AKQ.Mongo = ZS4.Mongo;
  AKQ.Prisma = YS4.Prisma;
  AKQ.GraphQL = JS4.GraphQL;
  AKQ.Apollo = XS4.Apollo;
  AKQ.lazyLoadedNodePerformanceMonitoringIntegrations = IS4.lazyLoadedNodePerformanceMonitoringIntegrations;
  AKQ.BROWSER_TRACING_INTEGRATION_ID = sWQ.BROWSER_TRACING_INTEGRATION_ID;
  AKQ.BrowserTracing = sWQ.BrowserTracing;
  AKQ.browserTracingIntegration = WT1.browserTracingIntegration;
  AKQ.startBrowserTracingNavigationSpan = WT1.startBrowserTracingNavigationSpan;
  AKQ.startBrowserTracingPageLoadSpan = WT1.startBrowserTracingPageLoadSpan;
  AKQ.defaultRequestInstrumentationOptions = tWQ.defaultRequestInstrumentationOptions;
  AKQ.instrumentOutgoingRequests = tWQ.instrumentOutgoingRequests;
  AKQ.addClsInstrumentationHandler = VnA.addClsInstrumentationHandler;
  AKQ.addFidInstrumentationHandler = VnA.addFidInstrumentationHandler;
  AKQ.addLcpInstrumentationHandler = VnA.addLcpInstrumentationHandler;
  AKQ.addPerformanceInstrumentationHandler = VnA.addPerformanceInstrumentationHandler;
  AKQ.addTracingHeadersToFetchRequest = eWQ.addTracingHeadersToFetchRequest;
  AKQ.instrumentFetchRequest = eWQ.instrumentFetchRequest;
  AKQ.addExtensionMethods = DS4.addExtensionMethods
})
// @from(Ln 61561, Col 4)
BKQ = U((QKQ) => {
  Object.defineProperty(QKQ, "__esModule", {
    value: !0
  });
  var cS4 = KT1(),
    pS4 = CQ();

  function lS4() {
    let A = cS4.lazyLoadedNodePerformanceMonitoringIntegrations.map((Q) => {
      try {
        return Q()
      } catch (B) {
        return
      }
    }).filter((Q) => !!Q);
    if (A.length === 0) pS4.logger.warn("Performance monitoring integrations could not be automatically loaded.");
    return A.filter((Q) => !!Q.loadDependency())
  }
  QKQ.autoDiscoverNodePerformanceMonitoringIntegrations = lS4
})
// @from(Ln 61581, Col 4)
VT1 = U((YKQ) => {
  Object.defineProperty(YKQ, "__esModule", {
    value: !0
  });
  var nS4 = NA("os"),
    aS4 = NA("util"),
    GKQ = U6();
  class ZKQ extends GKQ.ServerRuntimeClient {
    constructor(A) {
      GKQ.applySdkMetadata(A, "node"), A.transportOptions = {
        textEncoder: new aS4.TextEncoder,
        ...A.transportOptions
      };
      let Q = {
        ...A,
        platform: "node",
        runtime: {
          name: "node",
          version: global.process.version
        },
        serverName: A.serverName || global.process.env.SENTRY_NAME || nS4.hostname()
      };
      super(Q)
    }
  }
  YKQ.NodeClient = ZKQ
})