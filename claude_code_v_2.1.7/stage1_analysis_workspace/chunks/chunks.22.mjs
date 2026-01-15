
// @from(Ln 55068, Col 4)
EiA = U((AJQ) => {
  Object.defineProperty(AJQ, "__esModule", {
    value: !0
  });
  var ey = CQ(),
    tYQ = zqA(),
    hC4 = sGA(),
    gC4 = HiA(),
    uC4 = 100,
    $iA;
  class AZA {
    constructor() {
      this._notifyingListeners = !1, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = eYQ()
    }
    static clone(A) {
      return A ? A.clone() : new AZA
    }
    clone() {
      let A = new AZA;
      return A._breadcrumbs = [...this._breadcrumbs], A._tags = {
        ...this._tags
      }, A._extra = {
        ...this._extra
      }, A._contexts = {
        ...this._contexts
      }, A._user = this._user, A._level = this._level, A._span = this._span, A._session = this._session, A._transactionName = this._transactionName, A._fingerprint = this._fingerprint, A._eventProcessors = [...this._eventProcessors], A._requestSession = this._requestSession, A._attachments = [...this._attachments], A._sdkProcessingMetadata = {
        ...this._sdkProcessingMetadata
      }, A._propagationContext = {
        ...this._propagationContext
      }, A._client = this._client, A
    }
    setClient(A) {
      this._client = A
    }
    getClient() {
      return this._client
    }
    addScopeListener(A) {
      this._scopeListeners.push(A)
    }
    addEventProcessor(A) {
      return this._eventProcessors.push(A), this
    }
    setUser(A) {
      if (this._user = A || {
          email: void 0,
          id: void 0,
          ip_address: void 0,
          segment: void 0,
          username: void 0
        }, this._session) hC4.updateSession(this._session, {
        user: A
      });
      return this._notifyScopeListeners(), this
    }
    getUser() {
      return this._user
    }
    getRequestSession() {
      return this._requestSession
    }
    setRequestSession(A) {
      return this._requestSession = A, this
    }
    setTags(A) {
      return this._tags = {
        ...this._tags,
        ...A
      }, this._notifyScopeListeners(), this
    }
    setTag(A, Q) {
      return this._tags = {
        ...this._tags,
        [A]: Q
      }, this._notifyScopeListeners(), this
    }
    setExtras(A) {
      return this._extra = {
        ...this._extra,
        ...A
      }, this._notifyScopeListeners(), this
    }
    setExtra(A, Q) {
      return this._extra = {
        ...this._extra,
        [A]: Q
      }, this._notifyScopeListeners(), this
    }
    setFingerprint(A) {
      return this._fingerprint = A, this._notifyScopeListeners(), this
    }
    setLevel(A) {
      return this._level = A, this._notifyScopeListeners(), this
    }
    setTransactionName(A) {
      return this._transactionName = A, this._notifyScopeListeners(), this
    }
    setContext(A, Q) {
      if (Q === null) delete this._contexts[A];
      else this._contexts[A] = Q;
      return this._notifyScopeListeners(), this
    }
    setSpan(A) {
      return this._span = A, this._notifyScopeListeners(), this
    }
    getSpan() {
      return this._span
    }
    getTransaction() {
      let A = this._span;
      return A && A.transaction
    }
    setSession(A) {
      if (!A) delete this._session;
      else this._session = A;
      return this._notifyScopeListeners(), this
    }
    getSession() {
      return this._session
    }
    update(A) {
      if (!A) return this;
      let Q = typeof A === "function" ? A(this) : A;
      if (Q instanceof AZA) {
        let B = Q.getScopeData();
        if (this._tags = {
            ...this._tags,
            ...B.tags
          }, this._extra = {
            ...this._extra,
            ...B.extra
          }, this._contexts = {
            ...this._contexts,
            ...B.contexts
          }, B.user && Object.keys(B.user).length) this._user = B.user;
        if (B.level) this._level = B.level;
        if (B.fingerprint.length) this._fingerprint = B.fingerprint;
        if (Q.getRequestSession()) this._requestSession = Q.getRequestSession();
        if (B.propagationContext) this._propagationContext = B.propagationContext
      } else if (ey.isPlainObject(Q)) {
        let B = A;
        if (this._tags = {
            ...this._tags,
            ...B.tags
          }, this._extra = {
            ...this._extra,
            ...B.extra
          }, this._contexts = {
            ...this._contexts,
            ...B.contexts
          }, B.user) this._user = B.user;
        if (B.level) this._level = B.level;
        if (B.fingerprint) this._fingerprint = B.fingerprint;
        if (B.requestSession) this._requestSession = B.requestSession;
        if (B.propagationContext) this._propagationContext = B.propagationContext
      }
      return this
    }
    clear() {
      return this._breadcrumbs = [], this._tags = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._requestSession = void 0, this._span = void 0, this._session = void 0, this._notifyScopeListeners(), this._attachments = [], this._propagationContext = eYQ(), this
    }
    addBreadcrumb(A, Q) {
      let B = typeof Q === "number" ? Q : uC4;
      if (B <= 0) return this;
      let G = {
          timestamp: ey.dateTimestampInSeconds(),
          ...A
        },
        Z = this._breadcrumbs;
      return Z.push(G), this._breadcrumbs = Z.length > B ? Z.slice(-B) : Z, this._notifyScopeListeners(), this
    }
    getLastBreadcrumb() {
      return this._breadcrumbs[this._breadcrumbs.length - 1]
    }
    clearBreadcrumbs() {
      return this._breadcrumbs = [], this._notifyScopeListeners(), this
    }
    addAttachment(A) {
      return this._attachments.push(A), this
    }
    getAttachments() {
      return this.getScopeData().attachments
    }
    clearAttachments() {
      return this._attachments = [], this
    }
    getScopeData() {
      let {
        _breadcrumbs: A,
        _attachments: Q,
        _contexts: B,
        _tags: G,
        _extra: Z,
        _user: Y,
        _level: J,
        _fingerprint: X,
        _eventProcessors: I,
        _propagationContext: D,
        _sdkProcessingMetadata: W,
        _transactionName: K,
        _span: V
      } = this;
      return {
        breadcrumbs: A,
        attachments: Q,
        contexts: B,
        tags: G,
        extra: Z,
        user: Y,
        level: J,
        fingerprint: X || [],
        eventProcessors: I,
        propagationContext: D,
        sdkProcessingMetadata: W,
        transactionName: K,
        span: V
      }
    }
    applyToEvent(A, Q = {}, B = []) {
      gC4.applyScopeDataToEvent(A, this.getScopeData());
      let G = [...B, ...tYQ.getGlobalEventProcessors(), ...this._eventProcessors];
      return tYQ.notifyEventProcessors(G, A, Q)
    }
    setSDKProcessingMetadata(A) {
      return this._sdkProcessingMetadata = {
        ...this._sdkProcessingMetadata,
        ...A
      }, this
    }
    setPropagationContext(A) {
      return this._propagationContext = A, this
    }
    getPropagationContext() {
      return this._propagationContext
    }
    captureException(A, Q) {
      let B = Q && Q.event_id ? Q.event_id : ey.uuid4();
      if (!this._client) return ey.logger.warn("No client configured on scope - will not capture exception!"), B;
      let G = Error("Sentry syntheticException");
      return this._client.captureException(A, {
        originalException: A,
        syntheticException: G,
        ...Q,
        event_id: B
      }, this), B
    }
    captureMessage(A, Q, B) {
      let G = B && B.event_id ? B.event_id : ey.uuid4();
      if (!this._client) return ey.logger.warn("No client configured on scope - will not capture message!"), G;
      let Z = Error(A);
      return this._client.captureMessage(A, Q, {
        originalException: A,
        syntheticException: Z,
        ...B,
        event_id: G
      }, this), G
    }
    captureEvent(A, Q) {
      let B = Q && Q.event_id ? Q.event_id : ey.uuid4();
      if (!this._client) return ey.logger.warn("No client configured on scope - will not capture event!"), B;
      return this._client.captureEvent(A, {
        ...Q,
        event_id: B
      }, this), B
    }
    _notifyScopeListeners() {
      if (!this._notifyingListeners) this._notifyingListeners = !0, this._scopeListeners.forEach((A) => {
        A(this)
      }), this._notifyingListeners = !1
    }
  }

  function mC4() {
    if (!$iA) $iA = new AZA;
    return $iA
  }

  function dC4(A) {
    $iA = A
  }

  function eYQ() {
    return {
      traceId: ey.uuid4(),
      spanId: ey.uuid4().substring(16)
    }
  }
  AJQ.Scope = AZA;
  AJQ.getGlobalScope = mC4;
  AJQ.setGlobalScope = dC4
})
// @from(Ln 55359, Col 4)
CiA = U((QJQ) => {
  Object.defineProperty(QJQ, "__esModule", {
    value: !0
  });
  var iC4 = "7.120.3";
  QJQ.SDK_VERSION = iC4
})
// @from(Ln 55366, Col 4)
ty = U((JJQ) => {
  Object.defineProperty(JJQ, "__esModule", {
    value: !0
  });
  var BC = CQ(),
    aC4 = rGA(),
    Yj1 = jW(),
    BJQ = EiA(),
    Jj1 = sGA(),
    oC4 = CiA(),
    UiA = parseFloat(oC4.SDK_VERSION),
    rC4 = 100;
  class NqA {
    constructor(A, Q, B, G = UiA) {
      this._version = G;
      let Z;
      if (!Q) Z = new BJQ.Scope, Z.setClient(A);
      else Z = Q;
      let Y;
      if (!B) Y = new BJQ.Scope, Y.setClient(A);
      else Y = B;
      if (this._stack = [{
          scope: Z
        }], A) this.bindClient(A);
      this._isolationScope = Y
    }
    isOlderThan(A) {
      return this._version < A
    }
    bindClient(A) {
      let Q = this.getStackTop();
      if (Q.client = A, Q.scope.setClient(A), A && A.setupIntegrations) A.setupIntegrations()
    }
    pushScope() {
      let A = this.getScope().clone();
      return this.getStack().push({
        client: this.getClient(),
        scope: A
      }), A
    }
    popScope() {
      if (this.getStack().length <= 1) return !1;
      return !!this.getStack().pop()
    }
    withScope(A) {
      let Q = this.pushScope(),
        B;
      try {
        B = A(Q)
      } catch (G) {
        throw this.popScope(), G
      }
      if (BC.isThenable(B)) return B.then((G) => {
        return this.popScope(), G
      }, (G) => {
        throw this.popScope(), G
      });
      return this.popScope(), B
    }
    getClient() {
      return this.getStackTop().client
    }
    getScope() {
      return this.getStackTop().scope
    }
    getIsolationScope() {
      return this._isolationScope
    }
    getStack() {
      return this._stack
    }
    getStackTop() {
      return this._stack[this._stack.length - 1]
    }
    captureException(A, Q) {
      let B = this._lastEventId = Q && Q.event_id ? Q.event_id : BC.uuid4(),
        G = Error("Sentry syntheticException");
      return this.getScope().captureException(A, {
        originalException: A,
        syntheticException: G,
        ...Q,
        event_id: B
      }), B
    }
    captureMessage(A, Q, B) {
      let G = this._lastEventId = B && B.event_id ? B.event_id : BC.uuid4(),
        Z = Error(A);
      return this.getScope().captureMessage(A, Q, {
        originalException: A,
        syntheticException: Z,
        ...B,
        event_id: G
      }), G
    }
    captureEvent(A, Q) {
      let B = Q && Q.event_id ? Q.event_id : BC.uuid4();
      if (!A.type) this._lastEventId = B;
      return this.getScope().captureEvent(A, {
        ...Q,
        event_id: B
      }), B
    }
    lastEventId() {
      return this._lastEventId
    }
    addBreadcrumb(A, Q) {
      let {
        scope: B,
        client: G
      } = this.getStackTop();
      if (!G) return;
      let {
        beforeBreadcrumb: Z = null,
        maxBreadcrumbs: Y = rC4
      } = G.getOptions && G.getOptions() || {};
      if (Y <= 0) return;
      let X = {
          timestamp: BC.dateTimestampInSeconds(),
          ...A
        },
        I = Z ? BC.consoleSandbox(() => Z(X, Q)) : X;
      if (I === null) return;
      if (G.emit) G.emit("beforeAddBreadcrumb", I, Q);
      B.addBreadcrumb(I, Y)
    }
    setUser(A) {
      this.getScope().setUser(A), this.getIsolationScope().setUser(A)
    }
    setTags(A) {
      this.getScope().setTags(A), this.getIsolationScope().setTags(A)
    }
    setExtras(A) {
      this.getScope().setExtras(A), this.getIsolationScope().setExtras(A)
    }
    setTag(A, Q) {
      this.getScope().setTag(A, Q), this.getIsolationScope().setTag(A, Q)
    }
    setExtra(A, Q) {
      this.getScope().setExtra(A, Q), this.getIsolationScope().setExtra(A, Q)
    }
    setContext(A, Q) {
      this.getScope().setContext(A, Q), this.getIsolationScope().setContext(A, Q)
    }
    configureScope(A) {
      let {
        scope: Q,
        client: B
      } = this.getStackTop();
      if (B) A(Q)
    }
    run(A) {
      let Q = Xj1(this);
      try {
        A(this)
      } finally {
        Xj1(Q)
      }
    }
    getIntegration(A) {
      let Q = this.getClient();
      if (!Q) return null;
      try {
        return Q.getIntegration(A)
      } catch (B) {
        return Yj1.DEBUG_BUILD && BC.logger.warn(`Cannot retrieve integration ${A.id} from the current Hub`), null
      }
    }
    startTransaction(A, Q) {
      let B = this._callExtensionMethod("startTransaction", A, Q);
      if (Yj1.DEBUG_BUILD && !B)
        if (!this.getClient()) BC.logger.warn("Tracing extension 'startTransaction' is missing. You should 'init' the SDK before calling 'startTransaction'");
        else BC.logger.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
Sentry.addTracingExtensions();
Sentry.init({...});
`);
      return B
    }
    traceHeaders() {
      return this._callExtensionMethod("traceHeaders")
    }
    captureSession(A = !1) {
      if (A) return this.endSession();
      this._sendSessionUpdate()
    }
    endSession() {
      let Q = this.getStackTop().scope,
        B = Q.getSession();
      if (B) Jj1.closeSession(B);
      this._sendSessionUpdate(), Q.setSession()
    }
    startSession(A) {
      let {
        scope: Q,
        client: B
      } = this.getStackTop(), {
        release: G,
        environment: Z = aC4.DEFAULT_ENVIRONMENT
      } = B && B.getOptions() || {}, {
        userAgent: Y
      } = BC.GLOBAL_OBJ.navigator || {}, J = Jj1.makeSession({
        release: G,
        environment: Z,
        user: Q.getUser(),
        ...Y && {
          userAgent: Y
        },
        ...A
      }), X = Q.getSession && Q.getSession();
      if (X && X.status === "ok") Jj1.updateSession(X, {
        status: "exited"
      });
      return this.endSession(), Q.setSession(J), J
    }
    shouldSendDefaultPii() {
      let A = this.getClient(),
        Q = A && A.getOptions();
      return Boolean(Q && Q.sendDefaultPii)
    }
    _sendSessionUpdate() {
      let {
        scope: A,
        client: Q
      } = this.getStackTop(), B = A.getSession();
      if (B && Q && Q.captureSession) Q.captureSession(B)
    }
    _callExtensionMethod(A, ...Q) {
      let G = T1A().__SENTRY__;
      if (G && G.extensions && typeof G.extensions[A] === "function") return G.extensions[A].apply(this, Q);
      Yj1.DEBUG_BUILD && BC.logger.warn(`Extension method ${A} couldn't be found, doing nothing.`)
    }
  }

  function T1A() {
    return BC.GLOBAL_OBJ.__SENTRY__ = BC.GLOBAL_OBJ.__SENTRY__ || {
      extensions: {},
      hub: void 0
    }, BC.GLOBAL_OBJ
  }

  function Xj1(A) {
    let Q = T1A(),
      B = qqA(Q);
    return qiA(Q, A), B
  }

  function GJQ() {
    let A = T1A();
    if (A.__SENTRY__ && A.__SENTRY__.acs) {
      let Q = A.__SENTRY__.acs.getCurrentHub();
      if (Q) return Q
    }
    return ZJQ(A)
  }

  function sC4() {
    return GJQ().getIsolationScope()
  }

  function ZJQ(A = T1A()) {
    if (!YJQ(A) || qqA(A).isOlderThan(UiA)) qiA(A, new NqA);
    return qqA(A)
  }

  function tC4(A, Q = ZJQ()) {
    if (!YJQ(A) || qqA(A).isOlderThan(UiA)) {
      let B = Q.getClient(),
        G = Q.getScope(),
        Z = Q.getIsolationScope();
      qiA(A, new NqA(B, G.clone(), Z.clone()))
    }
  }

  function eC4(A) {
    let Q = T1A();
    Q.__SENTRY__ = Q.__SENTRY__ || {}, Q.__SENTRY__.acs = A
  }

  function AU4(A, Q = {}) {
    let B = T1A();
    if (B.__SENTRY__ && B.__SENTRY__.acs) return B.__SENTRY__.acs.runWithAsyncContext(A, Q);
    return A()
  }

  function YJQ(A) {
    return !!(A && A.__SENTRY__ && A.__SENTRY__.hub)
  }

  function qqA(A) {
    return BC.getGlobalSingleton("hub", () => new NqA, A)
  }

  function qiA(A, Q) {
    if (!A) return !1;
    let B = A.__SENTRY__ = A.__SENTRY__ || {};
    return B.hub = Q, !0
  }
  JJQ.API_VERSION = UiA;
  JJQ.Hub = NqA;
  JJQ.ensureHubOnCarrier = tC4;
  JJQ.getCurrentHub = GJQ;
  JJQ.getHubFromCarrier = qqA;
  JJQ.getIsolationScope = sC4;
  JJQ.getMainCarrier = T1A;
  JJQ.makeMain = Xj1;
  JJQ.runWithAsyncContext = AU4;
  JJQ.setAsyncContextStrategy = eC4;
  JJQ.setHubOnCarrier = qiA
})
// @from(Ln 55674, Col 4)
NiA = U((IJQ) => {
  Object.defineProperty(IJQ, "__esModule", {
    value: !0
  });
  var XJQ = CQ(),
    VU4 = ty();

  function FU4(A) {
    return (A || VU4.getCurrentHub()).getScope().getTransaction()
  }
  var HU4 = XJQ.extractTraceparentData;
  IJQ.stripUrlQueryAndFragment = XJQ.stripUrlQueryAndFragment;
  IJQ.extractTraceparentData = HU4;
  IJQ.getActiveTransaction = FU4
})
// @from(Ln 55689, Col 4)
wiA = U((WJQ) => {
  Object.defineProperty(WJQ, "__esModule", {
    value: !0
  });
  var Ij1 = CQ(),
    CU4 = jW(),
    UU4 = NiA(),
    DJQ = !1;

  function qU4() {
    if (DJQ) return;
    DJQ = !0, Ij1.addGlobalErrorInstrumentationHandler(Dj1), Ij1.addGlobalUnhandledRejectionInstrumentationHandler(Dj1)
  }

  function Dj1() {
    let A = UU4.getActiveTransaction();
    if (A) CU4.DEBUG_BUILD && Ij1.logger.log("[Tracing] Transaction: internal_error -> Global error occured"), A.setStatus("internal_error")
  }
  Dj1.tag = "sentry_tracingErrorCallback";
  WJQ.registerErrorInstrumentation = qU4
})
// @from(Ln 55710, Col 4)
QZA = U((KJQ) => {
  Object.defineProperty(KJQ, "__esModule", {
    value: !0
  });
  KJQ.SpanStatus = void 0;
  (function (A) {
    A.Ok = "ok";
    let B = "deadline_exceeded";
    A.DeadlineExceeded = B;
    let G = "unauthenticated";
    A.Unauthenticated = G;
    let Z = "permission_denied";
    A.PermissionDenied = Z;
    let Y = "not_found";
    A.NotFound = Y;
    let J = "resource_exhausted";
    A.ResourceExhausted = J;
    let X = "invalid_argument";
    A.InvalidArgument = X;
    let I = "unimplemented";
    A.Unimplemented = I;
    let D = "unavailable";
    A.Unavailable = D;
    let W = "internal_error";
    A.InternalError = W;
    let K = "unknown_error";
    A.UnknownError = K;
    let V = "cancelled";
    A.Cancelled = V;
    let F = "already_exists";
    A.AlreadyExists = F;
    let H = "failed_precondition";
    A.FailedPrecondition = H;
    let E = "aborted";
    A.Aborted = E;
    let z = "out_of_range";
    A.OutOfRange = z;
    let $ = "data_loss";
    A.DataLoss = $
  })(KJQ.SpanStatus || (KJQ.SpanStatus = {}));

  function Kj1(A) {
    if (A < 400 && A >= 100) return "ok";
    if (A >= 400 && A < 500) switch (A) {
      case 401:
        return "unauthenticated";
      case 403:
        return "permission_denied";
      case 404:
        return "not_found";
      case 409:
        return "already_exists";
      case 413:
        return "failed_precondition";
      case 429:
        return "resource_exhausted";
      default:
        return "invalid_argument"
    }
    if (A >= 500 && A < 600) switch (A) {
      case 501:
        return "unimplemented";
      case 503:
        return "unavailable";
      case 504:
        return "deadline_exceeded";
      default:
        return "internal_error"
    }
    return "unknown_error"
  }
  var wU4 = Kj1;

  function LU4(A, Q) {
    A.setTag("http.status_code", String(Q)), A.setData("http.response.status_code", Q);
    let B = Kj1(Q);
    if (B !== "unknown_error") A.setStatus(B)
  }
  KJQ.getSpanStatusFromHttpCode = Kj1;
  KJQ.setHttpStatus = LU4;
  KJQ.spanStatusfromHttpCode = wU4
})
// @from(Ln 55792, Col 4)
Vj1 = U((VJQ) => {
  Object.defineProperty(VJQ, "__esModule", {
    value: !0
  });
  var _U4 = CQ();

  function jU4(A, Q, B = () => {}) {
    let G;
    try {
      G = A()
    } catch (Z) {
      throw Q(Z), B(), Z
    }
    return TU4(G, Q, B)
  }

  function TU4(A, Q, B) {
    if (_U4.isThenable(A)) return A.then((G) => {
      return B(), G
    }, (G) => {
      throw Q(G), B(), G
    });
    return B(), A
  }
  VJQ.handleCallbackErrors = jU4
})
// @from(Ln 55818, Col 4)
LiA = U((FJQ) => {
  Object.defineProperty(FJQ, "__esModule", {
    value: !0
  });
  var SU4 = dM();

  function xU4(A) {
    if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) return !1;
    let Q = SU4.getClient(),
      B = A || Q && Q.getOptions();
    return !!B && (B.enableTracing || ("tracesSampleRate" in B) || ("tracesSampler" in B))
  }
  FJQ.hasTracingEnabled = xU4
})
// @from(Ln 55832, Col 4)
_iA = U((UJQ) => {
  Object.defineProperty(UJQ, "__esModule", {
    value: !0
  });
  var wqA = CQ(),
    vU4 = jW(),
    Li = ty(),
    OiA = Eq();
  wiA();
  QZA();
  var kU4 = j1A(),
    BZA = dM(),
    Fj1 = Vj1(),
    HJQ = LiA();

  function bU4(A, Q, B = () => {}, G = () => {}) {
    let Z = Li.getCurrentHub(),
      Y = BZA.getCurrentScope(),
      J = Y.getSpan(),
      X = RiA(A),
      I = MiA(Z, {
        parentSpan: J,
        spanContext: X,
        forceTransaction: !1,
        scope: Y
      });
    return Y.setSpan(I), Fj1.handleCallbackErrors(() => Q(I), (D) => {
      I && I.setStatus("internal_error"), B(D, I)
    }, () => {
      I && I.end(), Y.setSpan(J), G()
    })
  }

  function EJQ(A, Q) {
    let B = RiA(A);
    return Li.runWithAsyncContext(() => {
      return BZA.withScope(A.scope, (G) => {
        let Z = Li.getCurrentHub(),
          Y = G.getSpan(),
          X = A.onlyIfParent && !Y ? void 0 : MiA(Z, {
            parentSpan: Y,
            spanContext: B,
            forceTransaction: A.forceTransaction,
            scope: G
          });
        return Fj1.handleCallbackErrors(() => Q(X), () => {
          if (X) {
            let {
              status: I
            } = OiA.spanToJSON(X);
            if (!I || I === "ok") X.setStatus("internal_error")
          }
        }, () => X && X.end())
      })
    })
  }
  var fU4 = EJQ;

  function hU4(A, Q) {
    let B = RiA(A);
    return Li.runWithAsyncContext(() => {
      return BZA.withScope(A.scope, (G) => {
        let Z = Li.getCurrentHub(),
          Y = G.getSpan(),
          X = A.onlyIfParent && !Y ? void 0 : MiA(Z, {
            parentSpan: Y,
            spanContext: B,
            forceTransaction: A.forceTransaction,
            scope: G
          });

        function I() {
          X && X.end()
        }
        return Fj1.handleCallbackErrors(() => Q(X, I), () => {
          if (X && X.isRecording()) {
            let {
              status: D
            } = OiA.spanToJSON(X);
            if (!D || D === "ok") X.setStatus("internal_error")
          }
        })
      })
    })
  }

  function gU4(A) {
    if (!HJQ.hasTracingEnabled()) return;
    let Q = RiA(A),
      B = Li.getCurrentHub(),
      G = A.scope ? A.scope.getSpan() : zJQ();
    if (A.onlyIfParent && !G) return;
    let J = (A.scope || BZA.getCurrentScope()).clone();
    return MiA(B, {
      parentSpan: G,
      spanContext: Q,
      forceTransaction: A.forceTransaction,
      scope: J
    })
  }

  function zJQ() {
    return BZA.getCurrentScope().getSpan()
  }
  var uU4 = ({
    sentryTrace: A,
    baggage: Q
  }, B) => {
    let G = BZA.getCurrentScope(),
      {
        traceparentData: Z,
        dynamicSamplingContext: Y,
        propagationContext: J
      } = wqA.tracingContextFromHeaders(A, Q);
    if (G.setPropagationContext(J), vU4.DEBUG_BUILD && Z) wqA.logger.log(`[Tracing] Continuing trace ${Z.traceId}.`);
    let X = {
      ...Z,
      metadata: wqA.dropUndefinedKeys({
        dynamicSamplingContext: Y
      })
    };
    if (!B) return X;
    return Li.runWithAsyncContext(() => {
      return B(X)
    })
  };

  function MiA(A, {
    parentSpan: Q,
    spanContext: B,
    forceTransaction: G,
    scope: Z
  }) {
    if (!HJQ.hasTracingEnabled()) return;
    let Y = Li.getIsolationScope(),
      J;
    if (Q && !G) J = Q.startChild(B);
    else if (Q) {
      let X = kU4.getDynamicSamplingContextFromSpan(Q),
        {
          traceId: I,
          spanId: D
        } = Q.spanContext(),
        W = OiA.spanIsSampled(Q);
      J = A.startTransaction({
        traceId: I,
        parentSpanId: D,
        parentSampled: W,
        ...B,
        metadata: {
          dynamicSamplingContext: X,
          ...B.metadata
        }
      })
    } else {
      let {
        traceId: X,
        dsc: I,
        parentSpanId: D,
        sampled: W
      } = {
        ...Y.getPropagationContext(),
        ...Z.getPropagationContext()
      };
      J = A.startTransaction({
        traceId: X,
        parentSpanId: D,
        parentSampled: W,
        ...B,
        metadata: {
          dynamicSamplingContext: I,
          ...B.metadata
        }
      })
    }
    return Z.setSpan(J), mU4(J, Z, Y), J
  }

  function RiA(A) {
    if (A.startTime) {
      let Q = {
        ...A
      };
      return Q.startTimestamp = OiA.spanTimeInputToSeconds(A.startTime), delete Q.startTime, Q
    }
    return A
  }
  var $JQ = "_sentryScope",
    CJQ = "_sentryIsolationScope";

  function mU4(A, Q, B) {
    if (A) wqA.addNonEnumerableProperty(A, CJQ, B), wqA.addNonEnumerableProperty(A, $JQ, Q)
  }

  function dU4(A) {
    return {
      scope: A[$JQ],
      isolationScope: A[CJQ]
    }
  }
  UJQ.continueTrace = uU4;
  UJQ.getActiveSpan = zJQ;
  UJQ.getCapturedScopesOnSpan = dU4;
  UJQ.startActiveSpan = fU4;
  UJQ.startInactiveSpan = gU4;
  UJQ.startSpan = EJQ;
  UJQ.startSpanManual = hU4;
  UJQ.trace = bU4
})
// @from(Ln 56041, Col 4)
OqA = U((NJQ) => {
  Object.defineProperty(NJQ, "__esModule", {
    value: !0
  });
  var sU4 = CQ();
  jW();
  wiA();
  QZA();
  var tU4 = _iA(),
    LqA;

  function qJQ(A) {
    return LqA ? LqA.get(A) : void 0
  }

  function eU4(A) {
    let Q = qJQ(A);
    if (!Q) return;
    let B = {};
    for (let [, [G, Z]] of Q) {
      if (!B[G]) B[G] = [];
      B[G].push(sU4.dropUndefinedKeys(Z))
    }
    return B
  }

  function Aq4(A, Q, B, G, Z, Y) {
    let J = tU4.getActiveSpan();
    if (J) {
      let X = qJQ(J) || new Map,
        I = `${A}:${Q}@${G}`,
        D = X.get(Y);
      if (D) {
        let [, W] = D;
        X.set(Y, [I, {
          min: Math.min(W.min, B),
          max: Math.max(W.max, B),
          count: W.count += 1,
          sum: W.sum += B,
          tags: W.tags
        }])
      } else X.set(Y, [I, {
        min: B,
        max: B,
        count: 1,
        sum: B,
        tags: Z
      }]);
      if (!LqA) LqA = new WeakMap;
      LqA.set(J, X)
    }
  }
  NJQ.getMetricSummaryJsonForSpan = eU4;
  NJQ.updateMetricSummaryOnActiveSpan = Aq4
})
// @from(Ln 56096, Col 4)
MqA = U((wJQ) => {
  Object.defineProperty(wJQ, "__esModule", {
    value: !0
  });
  var Gq4 = "sentry.source",
    Zq4 = "sentry.sample_rate",
    Yq4 = "sentry.op",
    Jq4 = "sentry.origin",
    Xq4 = "profile_id";
  wJQ.SEMANTIC_ATTRIBUTE_PROFILE_ID = Xq4;
  wJQ.SEMANTIC_ATTRIBUTE_SENTRY_OP = Yq4;
  wJQ.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = Jq4;
  wJQ.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = Zq4;
  wJQ.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = Gq4
})
// @from(Ln 56111, Col 4)
jiA = U((RJQ) => {
  Object.defineProperty(RJQ, "__esModule", {
    value: !0
  });
  var P1A = CQ(),
    LJQ = jW(),
    Fq4 = OqA(),
    qg = MqA(),
    OJQ = tGA(),
    GZA = Eq(),
    Hq4 = QZA();
  class MJQ {
    constructor(A = 1000) {
      this._maxlen = A, this.spans = []
    }
    add(A) {
      if (this.spans.length > this._maxlen) A.spanRecorder = void 0;
      else this.spans.push(A)
    }
  }
  class Hj1 {
    constructor(A = {}) {
      if (this._traceId = A.traceId || P1A.uuid4(), this._spanId = A.spanId || P1A.uuid4().substring(16), this._startTime = A.startTimestamp || P1A.timestampInSeconds(), this.tags = A.tags ? {
          ...A.tags
        } : {}, this.data = A.data ? {
          ...A.data
        } : {}, this.instrumenter = A.instrumenter || "sentry", this._attributes = {}, this.setAttributes({
          [qg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: A.origin || "manual",
          [qg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: A.op,
          ...A.attributes
        }), this._name = A.name || A.description, A.parentSpanId) this._parentSpanId = A.parentSpanId;
      if ("sampled" in A) this._sampled = A.sampled;
      if (A.status) this._status = A.status;
      if (A.endTimestamp) this._endTime = A.endTimestamp;
      if (A.exclusiveTime !== void 0) this._exclusiveTime = A.exclusiveTime;
      this._measurements = A.measurements ? {
        ...A.measurements
      } : {}
    }
    get name() {
      return this._name || ""
    }
    set name(A) {
      this.updateName(A)
    }
    get description() {
      return this._name
    }
    set description(A) {
      this._name = A
    }
    get traceId() {
      return this._traceId
    }
    set traceId(A) {
      this._traceId = A
    }
    get spanId() {
      return this._spanId
    }
    set spanId(A) {
      this._spanId = A
    }
    set parentSpanId(A) {
      this._parentSpanId = A
    }
    get parentSpanId() {
      return this._parentSpanId
    }
    get sampled() {
      return this._sampled
    }
    set sampled(A) {
      this._sampled = A
    }
    get attributes() {
      return this._attributes
    }
    set attributes(A) {
      this._attributes = A
    }
    get startTimestamp() {
      return this._startTime
    }
    set startTimestamp(A) {
      this._startTime = A
    }
    get endTimestamp() {
      return this._endTime
    }
    set endTimestamp(A) {
      this._endTime = A
    }
    get status() {
      return this._status
    }
    set status(A) {
      this._status = A
    }
    get op() {
      return this._attributes[qg.SEMANTIC_ATTRIBUTE_SENTRY_OP]
    }
    set op(A) {
      this.setAttribute(qg.SEMANTIC_ATTRIBUTE_SENTRY_OP, A)
    }
    get origin() {
      return this._attributes[qg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]
    }
    set origin(A) {
      this.setAttribute(qg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, A)
    }
    spanContext() {
      let {
        _spanId: A,
        _traceId: Q,
        _sampled: B
      } = this;
      return {
        spanId: A,
        traceId: Q,
        traceFlags: B ? GZA.TRACE_FLAG_SAMPLED : GZA.TRACE_FLAG_NONE
      }
    }
    startChild(A) {
      let Q = new Hj1({
        ...A,
        parentSpanId: this._spanId,
        sampled: this._sampled,
        traceId: this._traceId
      });
      if (Q.spanRecorder = this.spanRecorder, Q.spanRecorder) Q.spanRecorder.add(Q);
      let B = OJQ.getRootSpan(this);
      if (Q.transaction = B, LJQ.DEBUG_BUILD && B) {
        let G = A && A.op || "< unknown op >",
          Z = GZA.spanToJSON(Q).description || "< unknown name >",
          Y = B.spanContext().spanId,
          J = `[Tracing] Starting '${G}' span on transaction '${Z}' (${Y}).`;
        P1A.logger.log(J), this._logMessage = J
      }
      return Q
    }
    setTag(A, Q) {
      return this.tags = {
        ...this.tags,
        [A]: Q
      }, this
    }
    setData(A, Q) {
      return this.data = {
        ...this.data,
        [A]: Q
      }, this
    }
    setAttribute(A, Q) {
      if (Q === void 0) delete this._attributes[A];
      else this._attributes[A] = Q
    }
    setAttributes(A) {
      Object.keys(A).forEach((Q) => this.setAttribute(Q, A[Q]))
    }
    setStatus(A) {
      return this._status = A, this
    }
    setHttpStatus(A) {
      return Hq4.setHttpStatus(this, A), this
    }
    setName(A) {
      this.updateName(A)
    }
    updateName(A) {
      return this._name = A, this
    }
    isSuccess() {
      return this._status === "ok"
    }
    finish(A) {
      return this.end(A)
    }
    end(A) {
      if (this._endTime) return;
      let Q = OJQ.getRootSpan(this);
      if (LJQ.DEBUG_BUILD && Q && Q.spanContext().spanId !== this._spanId) {
        let B = this._logMessage;
        if (B) P1A.logger.log(B.replace("Starting", "Finishing"))
      }
      this._endTime = GZA.spanTimeInputToSeconds(A)
    }
    toTraceparent() {
      return GZA.spanToTraceHeader(this)
    }
    toContext() {
      return P1A.dropUndefinedKeys({
        data: this._getData(),
        description: this._name,
        endTimestamp: this._endTime,
        op: this.op,
        parentSpanId: this._parentSpanId,
        sampled: this._sampled,
        spanId: this._spanId,
        startTimestamp: this._startTime,
        status: this._status,
        tags: this.tags,
        traceId: this._traceId
      })
    }
    updateWithContext(A) {
      return this.data = A.data || {}, this._name = A.name || A.description, this._endTime = A.endTimestamp, this.op = A.op, this._parentSpanId = A.parentSpanId, this._sampled = A.sampled, this._spanId = A.spanId || this._spanId, this._startTime = A.startTimestamp || this._startTime, this._status = A.status, this.tags = A.tags || {}, this._traceId = A.traceId || this._traceId, this
    }
    getTraceContext() {
      return GZA.spanToTraceContext(this)
    }
    getSpanJSON() {
      return P1A.dropUndefinedKeys({
        data: this._getData(),
        description: this._name,
        op: this._attributes[qg.SEMANTIC_ATTRIBUTE_SENTRY_OP],
        parent_span_id: this._parentSpanId,
        span_id: this._spanId,
        start_timestamp: this._startTime,
        status: this._status,
        tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
        timestamp: this._endTime,
        trace_id: this._traceId,
        origin: this._attributes[qg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
        _metrics_summary: Fq4.getMetricSummaryJsonForSpan(this),
        profile_id: this._attributes[qg.SEMANTIC_ATTRIBUTE_PROFILE_ID],
        exclusive_time: this._exclusiveTime,
        measurements: Object.keys(this._measurements).length > 0 ? this._measurements : void 0
      })
    }
    isRecording() {
      return !this._endTime && !!this._sampled
    }
    toJSON() {
      return this.getSpanJSON()
    }
    _getData() {
      let {
        data: A,
        _attributes: Q
      } = this, B = Object.keys(A).length > 0, G = Object.keys(Q).length > 0;
      if (!B && !G) return;
      if (B && G) return {
        ...A,
        ...Q
      };
      return B ? A : Q
    }
  }
  RJQ.Span = Hj1;
  RJQ.SpanRecorder = MJQ
})
// @from(Ln 56363, Col 4)
SiA = U((PJQ) => {
  Object.defineProperty(PJQ, "__esModule", {
    value: !0
  });
  var ZZA = CQ(),
    TiA = jW(),
    $q4 = ty(),
    Cq4 = OqA(),
    RqA = MqA(),
    PiA = Eq(),
    _JQ = j1A(),
    jJQ = jiA(),
    Uq4 = _iA();
  class TJQ extends jJQ.Span {
    constructor(A, Q) {
      super(A);
      this._contexts = {}, this._hub = Q || $q4.getCurrentHub(), this._name = A.name || "", this._metadata = {
        ...A.metadata
      }, this._trimEnd = A.trimEnd, this.transaction = this;
      let B = this._metadata.dynamicSamplingContext;
      if (B) this._frozenDynamicSamplingContext = {
        ...B
      }
    }
    get name() {
      return this._name
    }
    set name(A) {
      this.setName(A)
    }
    get metadata() {
      return {
        source: "custom",
        spanMetadata: {},
        ...this._metadata,
        ...this._attributes[RqA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] && {
          source: this._attributes[RqA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]
        },
        ...this._attributes[RqA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] && {
          sampleRate: this._attributes[RqA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]
        }
      }
    }
    set metadata(A) {
      this._metadata = A
    }
    setName(A, Q = "custom") {
      this._name = A, this.setAttribute(RqA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, Q)
    }
    updateName(A) {
      return this._name = A, this
    }
    initSpanRecorder(A = 1000) {
      if (!this.spanRecorder) this.spanRecorder = new jJQ.SpanRecorder(A);
      this.spanRecorder.add(this)
    }
    setContext(A, Q) {
      if (Q === null) delete this._contexts[A];
      else this._contexts[A] = Q
    }
    setMeasurement(A, Q, B = "") {
      this._measurements[A] = {
        value: Q,
        unit: B
      }
    }
    setMetadata(A) {
      this._metadata = {
        ...this._metadata,
        ...A
      }
    }
    end(A) {
      let Q = PiA.spanTimeInputToSeconds(A),
        B = this._finishTransaction(Q);
      if (!B) return;
      return this._hub.captureEvent(B)
    }
    toContext() {
      let A = super.toContext();
      return ZZA.dropUndefinedKeys({
        ...A,
        name: this._name,
        trimEnd: this._trimEnd
      })
    }
    updateWithContext(A) {
      return super.updateWithContext(A), this._name = A.name || "", this._trimEnd = A.trimEnd, this
    }
    getDynamicSamplingContext() {
      return _JQ.getDynamicSamplingContextFromSpan(this)
    }
    setHub(A) {
      this._hub = A
    }
    getProfileId() {
      if (this._contexts !== void 0 && this._contexts.profile !== void 0) return this._contexts.profile.profile_id;
      return
    }
    _finishTransaction(A) {
      if (this._endTime !== void 0) return;
      if (!this._name) TiA.DEBUG_BUILD && ZZA.logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`."), this._name = "<unlabeled transaction>";
      super.end(A);
      let Q = this._hub.getClient();
      if (Q && Q.emit) Q.emit("finishTransaction", this);
      if (this._sampled !== !0) {
        if (TiA.DEBUG_BUILD && ZZA.logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled."), Q) Q.recordDroppedEvent("sample_rate", "transaction");
        return
      }
      let B = this.spanRecorder ? this.spanRecorder.spans.filter((D) => D !== this && PiA.spanToJSON(D).timestamp) : [];
      if (this._trimEnd && B.length > 0) {
        let D = B.map((W) => PiA.spanToJSON(W).timestamp).filter(Boolean);
        this._endTime = D.reduce((W, K) => {
          return W > K ? W : K
        })
      }
      let {
        scope: G,
        isolationScope: Z
      } = Uq4.getCapturedScopesOnSpan(this), {
        metadata: Y
      } = this, {
        source: J
      } = Y, X = {
        contexts: {
          ...this._contexts,
          trace: PiA.spanToTraceContext(this)
        },
        spans: B,
        start_timestamp: this._startTime,
        tags: this.tags,
        timestamp: this._endTime,
        transaction: this._name,
        type: "transaction",
        sdkProcessingMetadata: {
          ...Y,
          capturedSpanScope: G,
          capturedSpanIsolationScope: Z,
          ...ZZA.dropUndefinedKeys({
            dynamicSamplingContext: _JQ.getDynamicSamplingContextFromSpan(this)
          })
        },
        _metrics_summary: Cq4.getMetricSummaryJsonForSpan(this),
        ...J && {
          transaction_info: {
            source: J
          }
        }
      };
      if (Object.keys(this._measurements).length > 0) TiA.DEBUG_BUILD && ZZA.logger.log("[Measurements] Adding measurements to transaction", JSON.stringify(this._measurements, void 0, 2)), X.measurements = this._measurements;
      return TiA.DEBUG_BUILD && ZZA.logger.log(`[Tracing] Finishing ${this.op} transaction: ${this._name}.`), X
    }
  }
  PJQ.Transaction = TJQ
})
// @from(Ln 56518, Col 4)
zj1 = U((xJQ) => {
  Object.defineProperty(xJQ, "__esModule", {
    value: !0
  });
  var Bz = CQ(),
    zq = jW(),
    xiA = Eq(),
    Nq4 = jiA(),
    wq4 = SiA(),
    yiA = {
      idleTimeout: 1000,
      finalTimeout: 30000,
      heartbeatInterval: 5000
    },
    Lq4 = "finishReason",
    YZA = ["heartbeatFailed", "idleTimeout", "documentHidden", "finalTimeout", "externalFinish", "cancelled"];
  class Ej1 extends Nq4.SpanRecorder {
    constructor(A, Q, B, G) {
      super(G);
      this._pushActivity = A, this._popActivity = Q, this.transactionSpanId = B
    }
    add(A) {
      if (A.spanContext().spanId !== this.transactionSpanId) {
        let Q = A.end;
        if (A.end = (...B) => {
            return this._popActivity(A.spanContext().spanId), Q.apply(A, B)
          }, xiA.spanToJSON(A).timestamp === void 0) this._pushActivity(A.spanContext().spanId)
      }
      super.add(A)
    }
  }
  class SJQ extends wq4.Transaction {
    constructor(A, Q, B = yiA.idleTimeout, G = yiA.finalTimeout, Z = yiA.heartbeatInterval, Y = !1, J = !1) {
      super(A, Q);
      if (this._idleHub = Q, this._idleTimeout = B, this._finalTimeout = G, this._heartbeatInterval = Z, this._onScope = Y, this.activities = {}, this._heartbeatCounter = 0, this._finished = !1, this._idleTimeoutCanceledPermanently = !1, this._beforeFinishCallbacks = [], this._finishReason = YZA[4], this._autoFinishAllowed = !J, Y) zq.DEBUG_BUILD && Bz.logger.log(`Setting idle transaction on scope. Span ID: ${this.spanContext().spanId}`), Q.getScope().setSpan(this);
      if (!J) this._restartIdleTimeout();
      setTimeout(() => {
        if (!this._finished) this.setStatus("deadline_exceeded"), this._finishReason = YZA[3], this.end()
      }, this._finalTimeout)
    }
    end(A) {
      let Q = xiA.spanTimeInputToSeconds(A);
      if (this._finished = !0, this.activities = {}, this.op === "ui.action.click") this.setAttribute(Lq4, this._finishReason);
      if (this.spanRecorder) {
        zq.DEBUG_BUILD && Bz.logger.log("[Tracing] finishing IdleTransaction", new Date(Q * 1000).toISOString(), this.op);
        for (let B of this._beforeFinishCallbacks) B(this, Q);
        this.spanRecorder.spans = this.spanRecorder.spans.filter((B) => {
          if (B.spanContext().spanId === this.spanContext().spanId) return !0;
          if (!xiA.spanToJSON(B).timestamp) B.setStatus("cancelled"), B.end(Q), zq.DEBUG_BUILD && Bz.logger.log("[Tracing] cancelling span since transaction ended early", JSON.stringify(B, void 0, 2));
          let {
            start_timestamp: G,
            timestamp: Z
          } = xiA.spanToJSON(B), Y = G && G < Q, J = (this._finalTimeout + this._idleTimeout) / 1000, X = Z && G && Z - G < J;
          if (zq.DEBUG_BUILD) {
            let I = JSON.stringify(B, void 0, 2);
            if (!Y) Bz.logger.log("[Tracing] discarding Span since it happened after Transaction was finished", I);
            else if (!X) Bz.logger.log("[Tracing] discarding Span since it finished after Transaction final timeout", I)
          }
          return Y && X
        }), zq.DEBUG_BUILD && Bz.logger.log("[Tracing] flushing IdleTransaction")
      } else zq.DEBUG_BUILD && Bz.logger.log("[Tracing] No active IdleTransaction");
      if (this._onScope) {
        let B = this._idleHub.getScope();
        if (B.getTransaction() === this) B.setSpan(void 0)
      }
      return super.end(A)
    }
    registerBeforeFinishCallback(A) {
      this._beforeFinishCallbacks.push(A)
    }
    initSpanRecorder(A) {
      if (!this.spanRecorder) {
        let Q = (G) => {
            if (this._finished) return;
            this._pushActivity(G)
          },
          B = (G) => {
            if (this._finished) return;
            this._popActivity(G)
          };
        this.spanRecorder = new Ej1(Q, B, this.spanContext().spanId, A), zq.DEBUG_BUILD && Bz.logger.log("Starting heartbeat"), this._pingHeartbeat()
      }
      this.spanRecorder.add(this)
    }
    cancelIdleTimeout(A, {
      restartOnChildSpanChange: Q
    } = {
      restartOnChildSpanChange: !0
    }) {
      if (this._idleTimeoutCanceledPermanently = Q === !1, this._idleTimeoutID) {
        if (clearTimeout(this._idleTimeoutID), this._idleTimeoutID = void 0, Object.keys(this.activities).length === 0 && this._idleTimeoutCanceledPermanently) this._finishReason = YZA[5], this.end(A)
      }
    }
    setFinishReason(A) {
      this._finishReason = A
    }
    sendAutoFinishSignal() {
      if (!this._autoFinishAllowed) zq.DEBUG_BUILD && Bz.logger.log("[Tracing] Received finish signal for idle transaction."), this._restartIdleTimeout(), this._autoFinishAllowed = !0
    }
    _restartIdleTimeout(A) {
      this.cancelIdleTimeout(), this._idleTimeoutID = setTimeout(() => {
        if (!this._finished && Object.keys(this.activities).length === 0) this._finishReason = YZA[1], this.end(A)
      }, this._idleTimeout)
    }
    _pushActivity(A) {
      this.cancelIdleTimeout(void 0, {
        restartOnChildSpanChange: !this._idleTimeoutCanceledPermanently
      }), zq.DEBUG_BUILD && Bz.logger.log(`[Tracing] pushActivity: ${A}`), this.activities[A] = !0, zq.DEBUG_BUILD && Bz.logger.log("[Tracing] new activities count", Object.keys(this.activities).length)
    }
    _popActivity(A) {
      if (this.activities[A]) zq.DEBUG_BUILD && Bz.logger.log(`[Tracing] popActivity ${A}`), delete this.activities[A], zq.DEBUG_BUILD && Bz.logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
      if (Object.keys(this.activities).length === 0) {
        let Q = Bz.timestampInSeconds();
        if (this._idleTimeoutCanceledPermanently) {
          if (this._autoFinishAllowed) this._finishReason = YZA[5], this.end(Q)
        } else this._restartIdleTimeout(Q + this._idleTimeout / 1000)
      }
    }
    _beat() {
      if (this._finished) return;
      let A = Object.keys(this.activities).join("");
      if (A === this._prevHeartbeatString) this._heartbeatCounter++;
      else this._heartbeatCounter = 1;
      if (this._prevHeartbeatString = A, this._heartbeatCounter >= 3) {
        if (this._autoFinishAllowed) zq.DEBUG_BUILD && Bz.logger.log("[Tracing] Transaction finished because of no change for 3 heart beats"), this.setStatus("deadline_exceeded"), this._finishReason = YZA[0], this.end()
      } else this._pingHeartbeat()
    }
    _pingHeartbeat() {
      zq.DEBUG_BUILD && Bz.logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`), setTimeout(() => {
        this._beat()
      }, this._heartbeatInterval)
    }
  }
  xJQ.IdleTransaction = SJQ;
  xJQ.IdleTransactionSpanRecorder = Ej1;
  xJQ.TRACING_DEFAULTS = yiA
})
// @from(Ln 56655, Col 4)
$j1 = U((vJQ) => {
  Object.defineProperty(vJQ, "__esModule", {
    value: !0
  });
  var S1A = CQ(),
    JZA = jW(),
    viA = MqA(),
    _q4 = LiA(),
    jq4 = Eq();

  function Tq4(A, Q, B) {
    if (!_q4.hasTracingEnabled(Q)) return A.sampled = !1, A;
    if (A.sampled !== void 0) return A.setAttribute(viA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(A.sampled)), A;
    let G;
    if (typeof Q.tracesSampler === "function") G = Q.tracesSampler(B), A.setAttribute(viA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(G));
    else if (B.parentSampled !== void 0) G = B.parentSampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate, A.setAttribute(viA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(G));
    else G = 1, A.setAttribute(viA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, G);
    if (!yJQ(G)) return JZA.DEBUG_BUILD && S1A.logger.warn("[Tracing] Discarding transaction because of invalid sample rate."), A.sampled = !1, A;
    if (!G) return JZA.DEBUG_BUILD && S1A.logger.log(`[Tracing] Discarding transaction because ${typeof Q.tracesSampler==="function"?"tracesSampler returned 0 or false":"a negative sampling decision was inherited or tracesSampleRate is set to 0"}`), A.sampled = !1, A;
    if (A.sampled = Math.random() < G, !A.sampled) return JZA.DEBUG_BUILD && S1A.logger.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(G)})`), A;
    return JZA.DEBUG_BUILD && S1A.logger.log(`[Tracing] starting ${A.op} transaction - ${jq4.spanToJSON(A).description}`), A
  }

  function yJQ(A) {
    if (S1A.isNaN(A) || !(typeof A === "number" || typeof A === "boolean")) return JZA.DEBUG_BUILD && S1A.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(A)} of type ${JSON.stringify(typeof A)}.`), !1;
    if (A < 0 || A > 1) return JZA.DEBUG_BUILD && S1A.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${A}.`), !1;
    return !0
  }
  vJQ.isValidSampleRate = yJQ;
  vJQ.sampleTransaction = Tq4
})
// @from(Ln 56687, Col 4)
Cj1 = U((bJQ) => {
  Object.defineProperty(bJQ, "__esModule", {
    value: !0
  });
  var xq4 = CQ(),
    yq4 = jW(),
    vq4 = ty(),
    kq4 = Eq(),
    bq4 = wiA(),
    fq4 = zj1(),
    kJQ = $j1(),
    hq4 = SiA();

  function gq4() {
    let Q = this.getScope().getSpan();
    return Q ? {
      "sentry-trace": kq4.spanToTraceHeader(Q)
    } : {}
  }

  function uq4(A, Q) {
    let B = this.getClient(),
      G = B && B.getOptions() || {},
      Z = G.instrumenter || "sentry",
      Y = A.instrumenter || "sentry";
    if (Z !== Y) yq4.DEBUG_BUILD && xq4.logger.error(`A transaction was started with instrumenter=\`${Y}\`, but the SDK is configured with the \`${Z}\` instrumenter.
The transaction will not be sampled. Please use the ${Z} instrumentation to start transactions.`), A.sampled = !1;
    let J = new hq4.Transaction(A, this);
    if (J = kJQ.sampleTransaction(J, G, {
        name: A.name,
        parentSampled: A.parentSampled,
        transactionContext: A,
        attributes: {
          ...A.data,
          ...A.attributes
        },
        ...Q
      }), J.isRecording()) J.initSpanRecorder(G._experiments && G._experiments.maxSpans);
    if (B && B.emit) B.emit("startTransaction", J);
    return J
  }

  function mq4(A, Q, B, G, Z, Y, J, X = !1) {
    let I = A.getClient(),
      D = I && I.getOptions() || {},
      W = new fq4.IdleTransaction(Q, A, B, G, J, Z, X);
    if (W = kJQ.sampleTransaction(W, D, {
        name: Q.name,
        parentSampled: Q.parentSampled,
        transactionContext: Q,
        attributes: {
          ...Q.data,
          ...Q.attributes
        },
        ...Y
      }), W.isRecording()) W.initSpanRecorder(D._experiments && D._experiments.maxSpans);
    if (I && I.emit) I.emit("startTransaction", W);
    return W
  }

  function dq4() {
    let A = vq4.getMainCarrier();
    if (!A.__SENTRY__) return;
    if (A.__SENTRY__.extensions = A.__SENTRY__.extensions || {}, !A.__SENTRY__.extensions.startTransaction) A.__SENTRY__.extensions.startTransaction = uq4;
    if (!A.__SENTRY__.extensions.traceHeaders) A.__SENTRY__.extensions.traceHeaders = gq4;
    bq4.registerErrorInstrumentation()
  }
  bJQ.addTracingExtensions = dq4;
  bJQ.startIdleTransaction = mq4
})
// @from(Ln 56757, Col 4)
hJQ = U((fJQ) => {
  Object.defineProperty(fJQ, "__esModule", {
    value: !0
  });
  var lq4 = NiA();

  function iq4(A, Q, B) {
    let G = lq4.getActiveTransaction();
    if (G) G.setMeasurement(A, Q, B)
  }
  fJQ.setMeasurement = iq4
})
// @from(Ln 56769, Col 4)
Uj1 = U((gJQ) => {
  Object.defineProperty(gJQ, "__esModule", {
    value: !0
  });
  var XZA = CQ();

  function aq4(A, Q) {
    if (!Q) return A;
    return A.sdk = A.sdk || {}, A.sdk.name = A.sdk.name || Q.name, A.sdk.version = A.sdk.version || Q.version, A.sdk.integrations = [...A.sdk.integrations || [], ...Q.integrations || []], A.sdk.packages = [...A.sdk.packages || [], ...Q.packages || []], A
  }

  function oq4(A, Q, B, G) {
    let Z = XZA.getSdkMetadataForEnvelopeHeader(B),
      Y = {
        sent_at: new Date().toISOString(),
        ...Z && {
          sdk: Z
        },
        ...!!G && Q && {
          dsn: XZA.dsnToString(Q)
        }
      },
      J = "aggregates" in A ? [{
        type: "sessions"
      }, A] : [{
        type: "session"
      }, A.toJSON()];
    return XZA.createEnvelope(Y, [J])
  }

  function rq4(A, Q, B, G) {
    let Z = XZA.getSdkMetadataForEnvelopeHeader(B),
      Y = A.type && A.type !== "replay_event" ? A.type : "event";
    aq4(A, B && B.sdk);
    let J = XZA.createEventEnvelopeHeaders(A, Z, G, Q);
    delete A.sdkProcessingMetadata;
    let X = [{
      type: Y
    }, A];
    return XZA.createEnvelope(J, [X])
  }
  gJQ.createEventEnvelope = rq4;
  gJQ.createSessionEnvelope = oq4
})
// @from(Ln 56813, Col 4)
qj1 = U((mJQ) => {
  Object.defineProperty(mJQ, "__esModule", {
    value: !0
  });
  var eq4 = CQ(),
    AN4 = dM();
  class uJQ {
    constructor(A, Q) {
      if (this._client = A, this.flushTimeout = 60, this._pendingAggregates = {}, this._isEnabled = !0, this._intervalId = setInterval(() => this.flush(), this.flushTimeout * 1000), this._intervalId.unref) this._intervalId.unref();
      this._sessionAttrs = Q
    }
    flush() {
      let A = this.getSessionAggregates();
      if (A.aggregates.length === 0) return;
      this._pendingAggregates = {}, this._client.sendSession(A)
    }
    getSessionAggregates() {
      let A = Object.keys(this._pendingAggregates).map((B) => {
          return this._pendingAggregates[parseInt(B)]
        }),
        Q = {
          attrs: this._sessionAttrs,
          aggregates: A
        };
      return eq4.dropUndefinedKeys(Q)
    }
    close() {
      clearInterval(this._intervalId), this._isEnabled = !1, this.flush()
    }
    incrementSessionStatusCount() {
      if (!this._isEnabled) return;
      let A = AN4.getCurrentScope(),
        Q = A.getRequestSession();
      if (Q && Q.status) this._incrementSessionStatusCount(Q.status, new Date), A.setRequestSession(void 0)
    }
    _incrementSessionStatusCount(A, Q) {
      let B = new Date(Q).setSeconds(0, 0);
      this._pendingAggregates[B] = this._pendingAggregates[B] || {};
      let G = this._pendingAggregates[B];
      if (!G.started) G.started = new Date(B).toISOString();
      switch (A) {
        case "errored":
          return G.errored = (G.errored || 0) + 1, G.errored;
        case "ok":
          return G.exited = (G.exited || 0) + 1, G.exited;
        default:
          return G.crashed = (G.crashed || 0) + 1, G.crashed
      }
    }
  }
  mJQ.SessionFlusher = uJQ
})
// @from(Ln 56865, Col 4)
kiA = U((cJQ) => {
  Object.defineProperty(cJQ, "__esModule", {
    value: !0
  });
  var Nj1 = CQ(),
    BN4 = "7";

  function dJQ(A) {
    let Q = A.protocol ? `${A.protocol}:` : "",
      B = A.port ? `:${A.port}` : "";
    return `${Q}//${A.host}${B}${A.path?`/${A.path}`:""}/api/`
  }

  function GN4(A) {
    return `${dJQ(A)}${A.projectId}/envelope/`
  }

  function ZN4(A, Q) {
    return Nj1.urlEncode({
      sentry_key: A.publicKey,
      sentry_version: BN4,
      ...Q && {
        sentry_client: `${Q.name}/${Q.version}`
      }
    })
  }

  function YN4(A, Q = {}) {
    let B = typeof Q === "string" ? Q : Q.tunnel,
      G = typeof Q === "string" || !Q._metadata ? void 0 : Q._metadata.sdk;
    return B ? B : `${GN4(A)}?${ZN4(A,G)}`
  }

  function JN4(A, Q) {
    let B = Nj1.makeDsn(A);
    if (!B) return "";
    let G = `${dJQ(B)}embed/error-page/`,
      Z = `dsn=${Nj1.dsnToString(B)}`;
    for (let Y in Q) {
      if (Y === "dsn") continue;
      if (Y === "onClose") continue;
      if (Y === "user") {
        let J = Q.user;
        if (!J) continue;
        if (J.name) Z += `&name=${encodeURIComponent(J.name)}`;
        if (J.email) Z += `&email=${encodeURIComponent(J.email)}`
      } else Z += `&${encodeURIComponent(Y)}=${encodeURIComponent(Q[Y])}`
    }
    return `${G}?${Z}`
  }
  cJQ.getEnvelopeEndpointWithUrlEncodedAuth = YN4;
  cJQ.getReportDialogEndpoint = JN4
})
// @from(Ln 56918, Col 4)
Ng = U((lJQ) => {
  Object.defineProperty(lJQ, "__esModule", {
    value: !0
  });
  var biA = CQ(),
    wj1 = jW(),
    DN4 = zqA(),
    WN4 = dM(),
    KN4 = ty(),
    Lj1 = [];

  function VN4(A) {
    let Q = {};
    return A.forEach((B) => {
      let {
        name: G
      } = B, Z = Q[G];
      if (Z && !Z.isDefaultInstance && B.isDefaultInstance) return;
      Q[G] = B
    }), Object.keys(Q).map((B) => Q[B])
  }

  function FN4(A) {
    let Q = A.defaultIntegrations || [],
      B = A.integrations;
    Q.forEach((J) => {
      J.isDefaultInstance = !0
    });
    let G;
    if (Array.isArray(B)) G = [...Q, ...B];
    else if (typeof B === "function") G = biA.arrayify(B(Q));
    else G = Q;
    let Z = VN4(G),
      Y = $N4(Z, (J) => J.name === "Debug");
    if (Y !== -1) {
      let [J] = Z.splice(Y, 1);
      Z.push(J)
    }
    return Z
  }

  function HN4(A, Q) {
    let B = {};
    return Q.forEach((G) => {
      if (G) pJQ(A, G, B)
    }), B
  }

  function EN4(A, Q) {
    for (let B of Q)
      if (B && B.afterAllSetup) B.afterAllSetup(A)
  }

  function pJQ(A, Q, B) {
    if (B[Q.name]) {
      wj1.DEBUG_BUILD && biA.logger.log(`Integration skipped because it was already installed: ${Q.name}`);
      return
    }
    if (B[Q.name] = Q, Lj1.indexOf(Q.name) === -1) Q.setupOnce(DN4.addGlobalEventProcessor, KN4.getCurrentHub), Lj1.push(Q.name);
    if (Q.setup && typeof Q.setup === "function") Q.setup(A);
    if (A.on && typeof Q.preprocessEvent === "function") {
      let G = Q.preprocessEvent.bind(Q);
      A.on("preprocessEvent", (Z, Y) => G(Z, Y, A))
    }
    if (A.addEventProcessor && typeof Q.processEvent === "function") {
      let G = Q.processEvent.bind(Q),
        Z = Object.assign((Y, J) => G(Y, J, A), {
          id: Q.name
        });
      A.addEventProcessor(Z)
    }
    wj1.DEBUG_BUILD && biA.logger.log(`Integration installed: ${Q.name}`)
  }

  function zN4(A) {
    let Q = WN4.getClient();
    if (!Q || !Q.addIntegration) {
      wj1.DEBUG_BUILD && biA.logger.warn(`Cannot add integration "${A.name}" because no SDK Client is available.`);
      return
    }
    Q.addIntegration(A)
  }

  function $N4(A, Q) {
    for (let B = 0; B < A.length; B++)
      if (Q(A[B]) === !0) return B;
    return -1
  }

  function CN4(A, Q) {
    return Object.assign(function (...G) {
      return Q(...G)
    }, {
      id: A
    })
  }

  function UN4(A) {
    return A
  }
  lJQ.addIntegration = zN4;
  lJQ.afterSetupIntegrations = EN4;
  lJQ.convertIntegrationFnToClass = CN4;
  lJQ.defineIntegration = UN4;
  lJQ.getIntegrationsToSetup = FN4;
  lJQ.installedIntegrations = Lj1;
  lJQ.setupIntegration = pJQ;
  lJQ.setupIntegrations = HN4
})
// @from(Ln 57027, Col 4)
_qA = U((iJQ) => {
  Object.defineProperty(iJQ, "__esModule", {
    value: !0
  });
  var jN4 = CQ();

  function TN4(A, Q, B, G) {
    let Z = Object.entries(jN4.dropUndefinedKeys(G)).sort((Y, J) => Y[0].localeCompare(J[0]));
    return `${A}${Q}${B}${Z}`
  }

  function PN4(A) {
    let Q = 0;
    for (let B = 0; B < A.length; B++) {
      let G = A.charCodeAt(B);
      Q = (Q << 5) - Q + G, Q &= Q
    }
    return Q >>> 0
  }

  function SN4(A) {
    let Q = "";
    for (let B of A) {
      let G = Object.entries(B.tags),
        Z = G.length > 0 ? `|#${G.map(([Y,J])=>`${Y}:${J}`).join(",")}` : "";
      Q += `${B.name}@${B.unit}:${B.metric}|${B.metricType}${Z}|T${B.timestamp}
`
    }
    return Q
  }

  function xN4(A) {
    return A.replace(/[^\w]+/gi, "_")
  }

  function yN4(A) {
    return A.replace(/[^\w\-.]+/gi, "_")
  }

  function vN4(A) {
    return A.replace(/[^\w\-./]+/gi, "")
  }
  var kN4 = [
    [`
`, "\\n"],
    ["\r", "\\r"],
    ["\t", "\\t"],
    ["\\", "\\\\"],
    ["|", "\\u{7c}"],
    [",", "\\u{2c}"]
  ];

  function bN4(A) {
    for (let [Q, B] of kN4)
      if (A === Q) return B;
    return A
  }

  function fN4(A) {
    return [...A].reduce((Q, B) => Q + bN4(B), "")
  }

  function hN4(A) {
    let Q = {};
    for (let B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) {
        let G = vN4(B);
        Q[G] = fN4(String(A[B]))
      } return Q
  }
  iJQ.getBucketKey = TN4;
  iJQ.sanitizeMetricKey = yN4;
  iJQ.sanitizeTags = hN4;
  iJQ.sanitizeUnit = xN4;
  iJQ.serializeMetricBuckets = SN4;
  iJQ.simpleHash = PN4
})
// @from(Ln 57104, Col 4)
oJQ = U((aJQ) => {
  Object.defineProperty(aJQ, "__esModule", {
    value: !0
  });
  var nJQ = CQ(),
    lN4 = _qA();

  function iN4(A, Q, B, G) {
    let Z = {
      sent_at: new Date().toISOString()
    };
    if (B && B.sdk) Z.sdk = {
      name: B.sdk.name,
      version: B.sdk.version
    };
    if (!!G && Q) Z.dsn = nJQ.dsnToString(Q);
    let Y = nN4(A);
    return nJQ.createEnvelope(Z, [Y])
  }

  function nN4(A) {
    let Q = lN4.serializeMetricBuckets(A);
    return [{
      type: "statsd",
      length: Q.length
    }, Q]
  }
  aJQ.createMetricEnvelope = iN4
})
// @from(Ln 57133, Col 4)
Oj1 = U((BXQ) => {
  Object.defineProperty(BXQ, "__esModule", {
    value: !0
  });
  var h7 = CQ(),
    oN4 = kiA(),
    Av = jW(),
    rJQ = Uj1(),
    rN4 = dM(),
    sN4 = ty(),
    fiA = Ng(),
    tN4 = oJQ(),
    sJQ = sGA(),
    eN4 = j1A(),
    Aw4 = FiA(),
    tJQ = "Not capturing exception because it's already been captured.";
  class eJQ {
    constructor(A) {
      if (this._options = A, this._integrations = {}, this._integrationsInitialized = !1, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], A.dsn) this._dsn = h7.makeDsn(A.dsn);
      else Av.DEBUG_BUILD && h7.logger.warn("No DSN provided, client will not send events.");
      if (this._dsn) {
        let Q = oN4.getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, A);
        this._transport = A.transport({
          tunnel: this._options.tunnel,
          recordDroppedEvent: this.recordDroppedEvent.bind(this),
          ...A.transportOptions,
          url: Q
        })
      }
    }
    captureException(A, Q, B) {
      if (h7.checkOrSetAlreadyCaught(A)) {
        Av.DEBUG_BUILD && h7.logger.log(tJQ);
        return
      }
      let G = Q && Q.event_id;
      return this._process(this.eventFromException(A, Q).then((Z) => this._captureEvent(Z, Q, B)).then((Z) => {
        G = Z
      })), G
    }
    captureMessage(A, Q, B, G) {
      let Z = B && B.event_id,
        Y = h7.isParameterizedString(A) ? A : String(A),
        J = h7.isPrimitive(A) ? this.eventFromMessage(Y, Q, B) : this.eventFromException(A, B);
      return this._process(J.then((X) => this._captureEvent(X, B, G)).then((X) => {
        Z = X
      })), Z
    }
    captureEvent(A, Q, B) {
      if (Q && Q.originalException && h7.checkOrSetAlreadyCaught(Q.originalException)) {
        Av.DEBUG_BUILD && h7.logger.log(tJQ);
        return
      }
      let G = Q && Q.event_id,
        Y = (A.sdkProcessingMetadata || {}).capturedSpanScope;
      return this._process(this._captureEvent(A, Q, Y || B).then((J) => {
        G = J
      })), G
    }
    captureSession(A) {
      if (typeof A.release !== "string") Av.DEBUG_BUILD && h7.logger.warn("Discarded session because of missing or non-string release");
      else this.sendSession(A), sJQ.updateSession(A, {
        init: !1
      })
    }
    getDsn() {
      return this._dsn
    }
    getOptions() {
      return this._options
    }
    getSdkMetadata() {
      return this._options._metadata
    }
    getTransport() {
      return this._transport
    }
    flush(A) {
      let Q = this._transport;
      if (Q) {
        if (this.metricsAggregator) this.metricsAggregator.flush();
        return this._isClientDoneProcessing(A).then((B) => {
          return Q.flush(A).then((G) => B && G)
        })
      } else return h7.resolvedSyncPromise(!0)
    }
    close(A) {
      return this.flush(A).then((Q) => {
        if (this.getOptions().enabled = !1, this.metricsAggregator) this.metricsAggregator.close();
        return Q
      })
    }
    getEventProcessors() {
      return this._eventProcessors
    }
    addEventProcessor(A) {
      this._eventProcessors.push(A)
    }
    setupIntegrations(A) {
      if (A && !this._integrationsInitialized || this._isEnabled() && !this._integrationsInitialized) this._setupIntegrations()
    }
    init() {
      if (this._isEnabled()) this._setupIntegrations()
    }
    getIntegrationById(A) {
      return this.getIntegrationByName(A)
    }
    getIntegrationByName(A) {
      return this._integrations[A]
    }
    getIntegration(A) {
      try {
        return this._integrations[A.id] || null
      } catch (Q) {
        return Av.DEBUG_BUILD && h7.logger.warn(`Cannot retrieve integration ${A.id} from the current Client`), null
      }
    }
    addIntegration(A) {
      let Q = this._integrations[A.name];
      if (fiA.setupIntegration(this, A, this._integrations), !Q) fiA.afterSetupIntegrations(this, [A])
    }
    sendEvent(A, Q = {}) {
      this.emit("beforeSendEvent", A, Q);
      let B = rJQ.createEventEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      for (let Z of Q.attachments || []) B = h7.addItemToEnvelope(B, h7.createAttachmentEnvelopeItem(Z, this._options.transportOptions && this._options.transportOptions.textEncoder));
      let G = this._sendEnvelope(B);
      if (G) G.then((Z) => this.emit("afterSendEvent", A, Z), null)
    }
    sendSession(A) {
      let Q = rJQ.createSessionEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(Q)
    }
    recordDroppedEvent(A, Q, B) {
      if (this._options.sendClientReports) {
        let G = typeof B === "number" ? B : 1,
          Z = `${A}:${Q}`;
        Av.DEBUG_BUILD && h7.logger.log(`Recording outcome: "${Z}"${G>1?` (${G} times)`:""}`), this._outcomes[Z] = (this._outcomes[Z] || 0) + G
      }
    }
    captureAggregateMetrics(A) {
      Av.DEBUG_BUILD && h7.logger.log(`Flushing aggregated metrics, number of metrics: ${A.length}`);
      let Q = tN4.createMetricEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(Q)
    }
    on(A, Q) {
      if (!this._hooks[A]) this._hooks[A] = [];
      this._hooks[A].push(Q)
    }
    emit(A, ...Q) {
      if (this._hooks[A]) this._hooks[A].forEach((B) => B(...Q))
    }
    _setupIntegrations() {
      let {
        integrations: A
      } = this._options;
      this._integrations = fiA.setupIntegrations(this, A), fiA.afterSetupIntegrations(this, A), this._integrationsInitialized = !0
    }
    _updateSessionFromEvent(A, Q) {
      let B = !1,
        G = !1,
        Z = Q.exception && Q.exception.values;
      if (Z) {
        G = !0;
        for (let X of Z) {
          let I = X.mechanism;
          if (I && I.handled === !1) {
            B = !0;
            break
          }
        }
      }
      let Y = A.status === "ok";
      if (Y && A.errors === 0 || Y && B) sJQ.updateSession(A, {
        ...B && {
          status: "crashed"
        },
        errors: A.errors || Number(G || B)
      }), this.captureSession(A)
    }
    _isClientDoneProcessing(A) {
      return new h7.SyncPromise((Q) => {
        let B = 0,
          G = 1,
          Z = setInterval(() => {
            if (this._numProcessing == 0) clearInterval(Z), Q(!0);
            else if (B += G, A && B >= A) clearInterval(Z), Q(!1)
          }, G)
      })
    }
    _isEnabled() {
      return this.getOptions().enabled !== !1 && this._transport !== void 0
    }
    _prepareEvent(A, Q, B, G = sN4.getIsolationScope()) {
      let Z = this.getOptions(),
        Y = Object.keys(this._integrations);
      if (!Q.integrations && Y.length > 0) Q.integrations = Y;
      return this.emit("preprocessEvent", A, Q), Aw4.prepareEvent(Z, A, Q, B, this, G).then((J) => {
        if (J === null) return J;
        let X = {
          ...G.getPropagationContext(),
          ...B ? B.getPropagationContext() : void 0
        };
        if (!(J.contexts && J.contexts.trace) && X) {
          let {
            traceId: D,
            spanId: W,
            parentSpanId: K,
            dsc: V
          } = X;
          J.contexts = {
            trace: {
              trace_id: D,
              span_id: W,
              parent_span_id: K
            },
            ...J.contexts
          };
          let F = V ? V : eN4.getDynamicSamplingContextFromClient(D, this, B);
          J.sdkProcessingMetadata = {
            dynamicSamplingContext: F,
            ...J.sdkProcessingMetadata
          }
        }
        return J
      })
    }
    _captureEvent(A, Q = {}, B) {
      return this._processEvent(A, Q, B).then((G) => {
        return G.event_id
      }, (G) => {
        if (Av.DEBUG_BUILD) {
          let Z = G;
          if (Z.logLevel === "log") h7.logger.log(Z.message);
          else h7.logger.warn(Z)
        }
        return
      })
    }
    _processEvent(A, Q, B) {
      let G = this.getOptions(),
        {
          sampleRate: Z
        } = G,
        Y = QXQ(A),
        J = AXQ(A),
        X = A.type || "error",
        I = `before send for type \`${X}\``;
      if (J && typeof Z === "number" && Math.random() > Z) return this.recordDroppedEvent("sample_rate", "error", A), h7.rejectedSyncPromise(new h7.SentryError(`Discarding event because it's not included in the random sample (sampling rate = ${Z})`, "log"));
      let D = X === "replay_event" ? "replay" : X,
        K = (A.sdkProcessingMetadata || {}).capturedSpanIsolationScope;
      return this._prepareEvent(A, Q, B, K).then((V) => {
        if (V === null) throw this.recordDroppedEvent("event_processor", D, A), new h7.SentryError("An event processor returned `null`, will not send event.", "log");
        if (Q.data && Q.data.__sentry__ === !0) return V;
        let H = Bw4(G, V, Q);
        return Qw4(H, I)
      }).then((V) => {
        if (V === null) {
          if (this.recordDroppedEvent("before_send", D, A), Y) {
            let z = 1 + (A.spans || []).length;
            this.recordDroppedEvent("before_send", "span", z)
          }
          throw new h7.SentryError(`${I} returned \`null\`, will not send event.`, "log")
        }
        let F = B && B.getSession();
        if (!Y && F) this._updateSessionFromEvent(F, V);
        if (Y) {
          let E = V.sdkProcessingMetadata && V.sdkProcessingMetadata.spanCountBeforeProcessing || 0,
            z = V.spans ? V.spans.length : 0,
            $ = E - z;
          if ($ > 0) this.recordDroppedEvent("before_send", "span", $)
        }
        let H = V.transaction_info;
        if (Y && H && V.transaction !== A.transaction) V.transaction_info = {
          ...H,
          source: "custom"
        };
        return this.sendEvent(V, Q), V
      }).then(null, (V) => {
        if (V instanceof h7.SentryError) throw V;
        throw this.captureException(V, {
          data: {
            __sentry__: !0
          },
          originalException: V
        }), new h7.SentryError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${V}`)
      })
    }
    _process(A) {
      this._numProcessing++, A.then((Q) => {
        return this._numProcessing--, Q
      }, (Q) => {
        return this._numProcessing--, Q
      })
    }
    _sendEnvelope(A) {
      if (this.emit("beforeEnvelope", A), this._isEnabled() && this._transport) return this._transport.send(A).then(null, (Q) => {
        Av.DEBUG_BUILD && h7.logger.error("Error while sending event:", Q)
      });
      else Av.DEBUG_BUILD && h7.logger.error("Transport disabled")
    }
    _clearOutcomes() {
      let A = this._outcomes;
      return this._outcomes = {}, Object.keys(A).map((Q) => {
        let [B, G] = Q.split(":");
        return {
          reason: B,
          category: G,
          quantity: A[Q]
        }
      })
    }
  }

  function Qw4(A, Q) {
    let B = `${Q} must return \`null\` or a valid event.`;
    if (h7.isThenable(A)) return A.then((G) => {
      if (!h7.isPlainObject(G) && G !== null) throw new h7.SentryError(B);
      return G
    }, (G) => {
      throw new h7.SentryError(`${Q} rejected with ${G}`)
    });
    else if (!h7.isPlainObject(A) && A !== null) throw new h7.SentryError(B);
    return A
  }

  function Bw4(A, Q, B) {
    let {
      beforeSend: G,
      beforeSendTransaction: Z
    } = A;
    if (AXQ(Q) && G) return G(Q, B);
    if (QXQ(Q) && Z) {
      if (Q.spans) {
        let Y = Q.spans.length;
        Q.sdkProcessingMetadata = {
          ...Q.sdkProcessingMetadata,
          spanCountBeforeProcessing: Y
        }
      }
      return Z(Q, B)
    }
    return Q
  }

  function AXQ(A) {
    return A.type === void 0
  }

  function QXQ(A) {
    return A.type === "transaction"
  }

  function Gw4(A) {
    let Q = rN4.getClient();
    if (!Q || !Q.addEventProcessor) return;
    Q.addEventProcessor(A)
  }
  BXQ.BaseClient = eJQ;
  BXQ.addEventProcessor = Gw4
})
// @from(Ln 57494, Col 4)
Rj1 = U((GXQ) => {
  Object.defineProperty(GXQ, "__esModule", {
    value: !0
  });
  var Mj1 = CQ();

  function Jw4(A, Q, B, G, Z) {
    let Y = {
      sent_at: new Date().toISOString()
    };
    if (B && B.sdk) Y.sdk = {
      name: B.sdk.name,
      version: B.sdk.version
    };
    if (!!G && !!Z) Y.dsn = Mj1.dsnToString(Z);
    if (Q) Y.trace = Mj1.dropUndefinedKeys(Q);
    let J = Xw4(A);
    return Mj1.createEnvelope(Y, [J])
  }

  function Xw4(A) {
    return [{
      type: "check_in"
    }, A]
  }
  GXQ.createCheckInEnvelope = Jw4
})
// @from(Ln 57521, Col 4)
jqA = U((ZXQ) => {
  Object.defineProperty(ZXQ, "__esModule", {
    value: !0
  });
  var Dw4 = "c",
    Ww4 = "g",
    Kw4 = "s",
    Vw4 = "d",
    Fw4 = 5000,
    Hw4 = 1e4,
    Ew4 = 1e4;
  ZXQ.COUNTER_METRIC_TYPE = Dw4;
  ZXQ.DEFAULT_BROWSER_FLUSH_INTERVAL = Fw4;
  ZXQ.DEFAULT_FLUSH_INTERVAL = Hw4;
  ZXQ.DISTRIBUTION_METRIC_TYPE = Vw4;
  ZXQ.GAUGE_METRIC_TYPE = Ww4;
  ZXQ.MAX_WEIGHT = Ew4;
  ZXQ.SET_METRIC_TYPE = Kw4
})
// @from(Ln 57540, Col 4)
Sj1 = U((YXQ) => {
  Object.defineProperty(YXQ, "__esModule", {
    value: !0
  });
  var hiA = jqA(),
    Lw4 = _qA();
  class _j1 {
    constructor(A) {
      this._value = A
    }
    get weight() {
      return 1
    }
    add(A) {
      this._value += A
    }
    toString() {
      return `${this._value}`
    }
  }
  class jj1 {
    constructor(A) {
      this._last = A, this._min = A, this._max = A, this._sum = A, this._count = 1
    }
    get weight() {
      return 5
    }
    add(A) {
      if (this._last = A, A < this._min) this._min = A;
      if (A > this._max) this._max = A;
      this._sum += A, this._count++
    }
    toString() {
      return `${this._last}:${this._min}:${this._max}:${this._sum}:${this._count}`
    }
  }
  class Tj1 {
    constructor(A) {
      this._value = [A]
    }
    get weight() {
      return this._value.length
    }
    add(A) {
      this._value.push(A)
    }
    toString() {
      return this._value.join(":")
    }
  }
  class Pj1 {
    constructor(A) {
      this.first = A, this._value = new Set([A])
    }
    get weight() {
      return this._value.size
    }
    add(A) {
      this._value.add(A)
    }
    toString() {
      return Array.from(this._value).map((A) => typeof A === "string" ? Lw4.simpleHash(A) : A).join(":")
    }
  }
  var Ow4 = {
    [hiA.COUNTER_METRIC_TYPE]: _j1,
    [hiA.GAUGE_METRIC_TYPE]: jj1,
    [hiA.DISTRIBUTION_METRIC_TYPE]: Tj1,
    [hiA.SET_METRIC_TYPE]: Pj1
  };
  YXQ.CounterMetric = _j1;
  YXQ.DistributionMetric = Tj1;
  YXQ.GaugeMetric = jj1;
  YXQ.METRIC_MAP = Ow4;
  YXQ.SetMetric = Pj1
})
// @from(Ln 57616, Col 4)
DXQ = U((IXQ) => {
  Object.defineProperty(IXQ, "__esModule", {
    value: !0
  });
  var JXQ = CQ(),
    TqA = jqA(),
    Pw4 = Sj1(),
    Sw4 = OqA(),
    giA = _qA();
  class XXQ {
    constructor(A) {
      if (this._client = A, this._buckets = new Map, this._bucketsTotalWeight = 0, this._interval = setInterval(() => this._flush(), TqA.DEFAULT_FLUSH_INTERVAL), this._interval.unref) this._interval.unref();
      this._flushShift = Math.floor(Math.random() * TqA.DEFAULT_FLUSH_INTERVAL / 1000), this._forceFlush = !1
    }
    add(A, Q, B, G = "none", Z = {}, Y = JXQ.timestampInSeconds()) {
      let J = Math.floor(Y),
        X = giA.sanitizeMetricKey(Q),
        I = giA.sanitizeTags(Z),
        D = giA.sanitizeUnit(G),
        W = giA.getBucketKey(A, X, D, I),
        K = this._buckets.get(W),
        V = K && A === TqA.SET_METRIC_TYPE ? K.metric.weight : 0;
      if (K) {
        if (K.metric.add(B), K.timestamp < J) K.timestamp = J
      } else K = {
        metric: new Pw4.METRIC_MAP[A](B),
        timestamp: J,
        metricType: A,
        name: X,
        unit: D,
        tags: I
      }, this._buckets.set(W, K);
      let F = typeof B === "string" ? K.metric.weight - V : B;
      if (Sw4.updateMetricSummaryOnActiveSpan(A, X, F, D, Z, W), this._bucketsTotalWeight += K.metric.weight, this._bucketsTotalWeight >= TqA.MAX_WEIGHT) this.flush()
    }
    flush() {
      this._forceFlush = !0, this._flush()
    }
    close() {
      this._forceFlush = !0, clearInterval(this._interval), this._flush()
    }
    _flush() {
      if (this._forceFlush) {
        this._forceFlush = !1, this._bucketsTotalWeight = 0, this._captureMetrics(this._buckets), this._buckets.clear();
        return
      }
      let A = Math.floor(JXQ.timestampInSeconds()) - TqA.DEFAULT_FLUSH_INTERVAL / 1000 - this._flushShift,
        Q = new Map;
      for (let [B, G] of this._buckets)
        if (G.timestamp <= A) Q.set(B, G), this._bucketsTotalWeight -= G.metric.weight;
      for (let [B] of Q) this._buckets.delete(B);
      this._captureMetrics(Q)
    }
    _captureMetrics(A) {
      if (A.size > 0 && this._client.captureAggregateMetrics) {
        let Q = Array.from(A).map(([, B]) => B);
        this._client.captureAggregateMetrics(Q)
      }
    }
  }
  IXQ.MetricsAggregator = XXQ
})
// @from(Ln 57678, Col 4)
FXQ = U((VXQ) => {
  Object.defineProperty(VXQ, "__esModule", {
    value: !0
  });
  var wg = CQ(),
    yw4 = Oj1(),
    vw4 = Rj1(),
    uiA = jW(),
    kw4 = dM(),
    bw4 = DXQ(),
    fw4 = qj1(),
    hw4 = Cj1(),
    gw4 = Eq(),
    uw4 = tGA();
  QZA();
  var WXQ = j1A();
  class KXQ extends yw4.BaseClient {
    constructor(A) {
      hw4.addTracingExtensions();
      super(A);
      if (A._experiments && A._experiments.metricsAggregator) this.metricsAggregator = new bw4.MetricsAggregator(this)
    }
    eventFromException(A, Q) {
      return wg.resolvedSyncPromise(wg.eventFromUnknownInput(kw4.getClient(), this._options.stackParser, A, Q))
    }
    eventFromMessage(A, Q = "info", B) {
      return wg.resolvedSyncPromise(wg.eventFromMessage(this._options.stackParser, A, Q, B, this._options.attachStacktrace))
    }
    captureException(A, Q, B) {
      if (this._options.autoSessionTracking && this._sessionFlusher && B) {
        let G = B.getRequestSession();
        if (G && G.status === "ok") G.status = "errored"
      }
      return super.captureException(A, Q, B)
    }
    captureEvent(A, Q, B) {
      if (this._options.autoSessionTracking && this._sessionFlusher && B) {
        if ((A.type || "exception") === "exception" && A.exception && A.exception.values && A.exception.values.length > 0) {
          let Y = B.getRequestSession();
          if (Y && Y.status === "ok") Y.status = "errored"
        }
      }
      return super.captureEvent(A, Q, B)
    }
    close(A) {
      if (this._sessionFlusher) this._sessionFlusher.close();
      return super.close(A)
    }
    initSessionFlusher() {
      let {
        release: A,
        environment: Q
      } = this._options;
      if (!A) uiA.DEBUG_BUILD && wg.logger.warn("Cannot initialise an instance of SessionFlusher if no release is provided!");
      else this._sessionFlusher = new fw4.SessionFlusher(this, {
        release: A,
        environment: Q
      })
    }
    captureCheckIn(A, Q, B) {
      let G = "checkInId" in A && A.checkInId ? A.checkInId : wg.uuid4();
      if (!this._isEnabled()) return uiA.DEBUG_BUILD && wg.logger.warn("SDK not enabled, will not capture checkin."), G;
      let Z = this.getOptions(),
        {
          release: Y,
          environment: J,
          tunnel: X
        } = Z,
        I = {
          check_in_id: G,
          monitor_slug: A.monitorSlug,
          status: A.status,
          release: Y,
          environment: J
        };
      if ("duration" in A) I.duration = A.duration;
      if (Q) I.monitor_config = {
        schedule: Q.schedule,
        checkin_margin: Q.checkinMargin,
        max_runtime: Q.maxRuntime,
        timezone: Q.timezone
      };
      let [D, W] = this._getTraceInfoFromScope(B);
      if (W) I.contexts = {
        trace: W
      };
      let K = vw4.createCheckInEnvelope(I, D, this.getSdkMetadata(), X, this.getDsn());
      return uiA.DEBUG_BUILD && wg.logger.info("Sending checkin:", A.monitorSlug, A.status), this._sendEnvelope(K), G
    }
    _captureRequestSession() {
      if (!this._sessionFlusher) uiA.DEBUG_BUILD && wg.logger.warn("Discarded request mode session because autoSessionTracking option was disabled");
      else this._sessionFlusher.incrementSessionStatusCount()
    }
    _prepareEvent(A, Q, B, G) {
      if (this._options.platform) A.platform = A.platform || this._options.platform;
      if (this._options.runtime) A.contexts = {
        ...A.contexts,
        runtime: (A.contexts || {}).runtime || this._options.runtime
      };
      if (this._options.serverName) A.server_name = A.server_name || this._options.serverName;
      return super._prepareEvent(A, Q, B, G)
    }
    _getTraceInfoFromScope(A) {
      if (!A) return [void 0, void 0];
      let Q = A.getSpan();
      if (Q) return [uw4.getRootSpan(Q) ? WXQ.getDynamicSamplingContextFromSpan(Q) : void 0, gw4.spanToTraceContext(Q)];
      let {
        traceId: B,
        spanId: G,
        parentSpanId: Z,
        dsc: Y
      } = A.getPropagationContext(), J = {
        trace_id: B,
        span_id: G,
        parent_span_id: Z
      };
      if (Y) return [Y, J];
      return [WXQ.getDynamicSamplingContextFromClient(B, this, A), J]
    }
  }
  VXQ.ServerRuntimeClient = KXQ
})
// @from(Ln 57800, Col 4)
$XQ = U((zXQ) => {
  Object.defineProperty(zXQ, "__esModule", {
    value: !0
  });
  var HXQ = CQ(),
    dw4 = jW(),
    cw4 = dM(),
    pw4 = ty();

  function lw4(A, Q) {
    if (Q.debug === !0)
      if (dw4.DEBUG_BUILD) HXQ.logger.enable();
      else HXQ.consoleSandbox(() => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.")
      });
    cw4.getCurrentScope().update(Q.initialScope);
    let G = new A(Q);
    EXQ(G), iw4(G)
  }

  function EXQ(A) {
    let B = pw4.getCurrentHub().getStackTop();
    B.client = A, B.scope.setClient(A)
  }

  function iw4(A) {
    if (A.init) A.init();
    else if (A.setupIntegrations) A.setupIntegrations()
  }
  zXQ.initAndBind = lw4;
  zXQ.setCurrentClient = EXQ
})
// @from(Ln 57832, Col 4)
wXQ = U((NXQ) => {
  Object.defineProperty(NXQ, "__esModule", {
    value: !0
  });
  var $q = CQ(),
    CXQ = jW(),
    qXQ = 30;

  function ow4(A, Q, B = $q.makePromiseBuffer(A.bufferSize || qXQ)) {
    let G = {},
      Z = (J) => B.drain(J);

    function Y(J) {
      let X = [];
      if ($q.forEachEnvelopeItem(J, (K, V) => {
          let F = $q.envelopeItemTypeToDataCategory(V);
          if ($q.isRateLimited(G, F)) {
            let H = UXQ(K, V);
            A.recordDroppedEvent("ratelimit_backoff", F, H)
          } else X.push(K)
        }), X.length === 0) return $q.resolvedSyncPromise();
      let I = $q.createEnvelope(J[0], X),
        D = (K) => {
          $q.forEachEnvelopeItem(I, (V, F) => {
            let H = UXQ(V, F);
            A.recordDroppedEvent(K, $q.envelopeItemTypeToDataCategory(F), H)
          })
        },
        W = () => Q({
          body: $q.serializeEnvelope(I, A.textEncoder)
        }).then((K) => {
          if (K.statusCode !== void 0 && (K.statusCode < 200 || K.statusCode >= 300)) CXQ.DEBUG_BUILD && $q.logger.warn(`Sentry responded with status code ${K.statusCode} to sent event.`);
          return G = $q.updateRateLimits(G, K), K
        }, (K) => {
          throw D("network_error"), K
        });
      return B.add(W).then((K) => K, (K) => {
        if (K instanceof $q.SentryError) return CXQ.DEBUG_BUILD && $q.logger.error("Skipped sending event because buffer is full."), D("queue_overflow"), $q.resolvedSyncPromise();
        else throw K
      })
    }
    return Y.__sentry__baseTransport__ = !0, {
      send: Y,
      flush: Z
    }
  }

  function UXQ(A, Q) {
    if (Q !== "event" && Q !== "transaction") return;
    return Array.isArray(A) ? A[1] : void 0
  }
  NXQ.DEFAULT_TRANSPORT_BUFFER_SIZE = qXQ;
  NXQ.createTransport = ow4
})
// @from(Ln 57886, Col 4)
MXQ = U((OXQ) => {
  Object.defineProperty(OXQ, "__esModule", {
    value: !0
  });
  var yj1 = CQ(),
    tw4 = jW(),
    LXQ = 100,
    vj1 = 5000,
    ew4 = 3600000;

  function xj1(A, Q) {
    tw4.DEBUG_BUILD && yj1.logger.info(`[Offline]: ${A}`, Q)
  }

  function AL4(A) {
    return (Q) => {
      let B = A(Q),
        G = Q.createStore ? Q.createStore(Q) : void 0,
        Z = vj1,
        Y;

      function J(W, K, V) {
        if (yj1.envelopeContainsItemType(W, ["replay_event", "replay_recording", "client_report"])) return !1;
        if (Q.shouldStore) return Q.shouldStore(W, K, V);
        return !0
      }

      function X(W) {
        if (!G) return;
        if (Y) clearTimeout(Y);
        if (Y = setTimeout(async () => {
            Y = void 0;
            let K = await G.pop();
            if (K) xj1("Attempting to send previously queued event"), D(K).catch((V) => {
              xj1("Failed to retry sending", V)
            })
          }, W), typeof Y !== "number" && Y.unref) Y.unref()
      }

      function I() {
        if (Y) return;
        X(Z), Z = Math.min(Z * 2, ew4)
      }
      async function D(W) {
        try {
          let K = await B.send(W),
            V = LXQ;
          if (K) {
            if (K.headers && K.headers["retry-after"]) V = yj1.parseRetryAfterHeader(K.headers["retry-after"]);
            else if ((K.statusCode || 0) >= 400) return K
          }
          return X(V), Z = vj1, K
        } catch (K) {
          if (G && await J(W, K, Z)) return await G.insert(W), I(), xj1("Error sending. Event queued", K), {};
          else throw K
        }
      }
      if (Q.flushAtStartup) I();
      return {
        send: D,
        flush: (W) => B.flush(W)
      }
    }
  }
  OXQ.MIN_DELAY = LXQ;
  OXQ.START_DELAY = vj1;
  OXQ.makeOfflineTransport = AL4
})
// @from(Ln 57954, Col 4)
_XQ = U((RXQ) => {
  Object.defineProperty(RXQ, "__esModule", {
    value: !0
  });
  var kj1 = CQ(),
    ZL4 = kiA();

  function bj1(A, Q) {
    let B;
    return kj1.forEachEnvelopeItem(A, (G, Z) => {
      if (Q.includes(Z)) B = Array.isArray(G) ? G[1] : void 0;
      return !!B
    }), B
  }

  function YL4(A, Q) {
    return (B) => {
      let G = A(B);
      return {
        ...G,
        send: async (Z) => {
          let Y = bj1(Z, ["event", "transaction", "profile", "replay_event"]);
          if (Y) Y.release = Q;
          return G.send(Z)
        }
      }
    }
  }

  function JL4(A, Q) {
    return kj1.createEnvelope(Q ? {
      ...A[0],
      dsn: Q
    } : A[0], A[1])
  }

  function XL4(A, Q) {
    return (B) => {
      let G = A(B),
        Z = new Map;

      function Y(I, D) {
        let W = D ? `${I}:${D}` : I,
          K = Z.get(W);
        if (!K) {
          let V = kj1.dsnFromString(I);
          if (!V) return;
          let F = ZL4.getEnvelopeEndpointWithUrlEncodedAuth(V, B.tunnel);
          K = D ? YL4(A, D)({
            ...B,
            url: F
          }) : A({
            ...B,
            url: F
          }), Z.set(W, K)
        }
        return [I, K]
      }
      async function J(I) {
        function D(V) {
          let F = V && V.length ? V : ["event"];
          return bj1(I, F)
        }
        let W = Q({
          envelope: I,
          getEvent: D
        }).map((V) => {
          if (typeof V === "string") return Y(V, void 0);
          else return Y(V.dsn, V.release)
        }).filter((V) => !!V);
        if (W.length === 0) W.push(["", G]);
        return (await Promise.all(W.map(([V, F]) => F.send(JL4(I, V)))))[0]
      }
      async function X(I) {
        let D = [await G.flush(I)];
        for (let [, W] of Z) D.push(await W.flush(I));
        return D.every((W) => W)
      }
      return {
        send: J,
        flush: X
      }
    }
  }
  RXQ.eventFromEnvelope = bj1;
  RXQ.makeMultiplexedTransport = XL4
})
// @from(Ln 58041, Col 4)
PXQ = U((TXQ) => {
  Object.defineProperty(TXQ, "__esModule", {
    value: !0
  });
  var jXQ = CQ();

  function WL4(A, Q) {
    let B = {
      sent_at: new Date().toISOString()
    };
    if (Q) B.dsn = jXQ.dsnToString(Q);
    let G = A.map(KL4);
    return jXQ.createEnvelope(B, G)
  }

  function KL4(A) {
    return [{
      type: "span"
    }, A]
  }
  TXQ.createSpanEnvelope = WL4
})
// @from(Ln 58063, Col 4)
yXQ = U((xXQ) => {
  Object.defineProperty(xXQ, "__esModule", {
    value: !0
  });

  function FL4(A, Q) {
    let B = Q && zL4(Q) ? Q.getClient() : Q,
      G = B && B.getDsn(),
      Z = B && B.getOptions().tunnel;
    return EL4(A, G) || HL4(A, Z)
  }

  function HL4(A, Q) {
    if (!Q) return !1;
    return SXQ(A) === SXQ(Q)
  }

  function EL4(A, Q) {
    return Q ? A.includes(Q.host) : !1
  }

  function SXQ(A) {
    return A[A.length - 1] === "/" ? A.slice(0, -1) : A
  }

  function zL4(A) {
    return A.getClient !== void 0
  }
  xXQ.isSentryRequestUrl = FL4
})
// @from(Ln 58093, Col 4)
kXQ = U((vXQ) => {
  Object.defineProperty(vXQ, "__esModule", {
    value: !0
  });

  function CL4(A, ...Q) {
    let B = new String(String.raw(A, ...Q));
    return B.__sentry_template_string__ = A.join("\x00").replace(/%/g, "%%").replace(/\0/g, "%s"), B.__sentry_template_values__ = Q, B
  }
  vXQ.parameterize = CL4
})
// @from(Ln 58104, Col 4)
hXQ = U((fXQ) => {
  Object.defineProperty(fXQ, "__esModule", {
    value: !0
  });
  var bXQ = CiA();

  function qL4(A, Q, B = [Q], G = "npm") {
    let Z = A._metadata || {};
    if (!Z.sdk) Z.sdk = {
      name: `sentry.javascript.${Q}`,
      packages: B.map((Y) => ({
        name: `${G}:@sentry/${Y}`,
        version: bXQ.SDK_VERSION
      })),
      version: bXQ.SDK_VERSION
    };
    A._metadata = Z
  }
  fXQ.applySdkMetadata = qL4
})
// @from(Ln 58124, Col 4)
cXQ = U((dXQ) => {
  Object.defineProperty(dXQ, "__esModule", {
    value: !0
  });
  var fj1 = CQ(),
    uXQ = new Map,
    gXQ = new Set;

  function wL4(A) {
    if (!fj1.GLOBAL_OBJ._sentryModuleMetadata) return;
    for (let Q of Object.keys(fj1.GLOBAL_OBJ._sentryModuleMetadata)) {
      let B = fj1.GLOBAL_OBJ._sentryModuleMetadata[Q];
      if (gXQ.has(Q)) continue;
      gXQ.add(Q);
      let G = A(Q);
      for (let Z of G.reverse())
        if (Z.filename) {
          uXQ.set(Z.filename, B);
          break
        }
    }
  }

  function mXQ(A, Q) {
    return wL4(A), uXQ.get(Q)
  }

  function LL4(A, Q) {
    try {
      Q.exception.values.forEach((B) => {
        if (!B.stacktrace) return;
        for (let G of B.stacktrace.frames || []) {
          if (!G.filename) continue;
          let Z = mXQ(A, G.filename);
          if (Z) G.module_metadata = Z
        }
      })
    } catch (B) {}
  }

  function OL4(A) {
    try {
      A.exception.values.forEach((Q) => {
        if (!Q.stacktrace) return;
        for (let B of Q.stacktrace.frames || []) delete B.module_metadata
      })
    } catch (Q) {}
  }
  dXQ.addMetadataToStackFrames = LL4;
  dXQ.getMetadataForUrl = mXQ;
  dXQ.stripMetadataFromStackFrames = OL4
})
// @from(Ln 58176, Col 4)
oXQ = U((aXQ) => {
  Object.defineProperty(aXQ, "__esModule", {
    value: !0
  });
  var jL4 = CQ(),
    lXQ = Ng(),
    pXQ = cXQ(),
    iXQ = "ModuleMetadata",
    TL4 = () => {
      return {
        name: iXQ,
        setupOnce() {},
        setup(A) {
          if (typeof A.on !== "function") return;
          A.on("beforeEnvelope", (Q) => {
            jL4.forEachEnvelopeItem(Q, (B, G) => {
              if (G === "event") {
                let Z = Array.isArray(B) ? B[1] : void 0;
                if (Z) pXQ.stripMetadataFromStackFrames(Z), B[1] = Z
              }
            })
          })
        },
        processEvent(A, Q, B) {
          let G = B.getOptions().stackParser;
          return pXQ.addMetadataToStackFrames(G, A), A
        }
      }
    },
    nXQ = lXQ.defineIntegration(TL4),
    PL4 = lXQ.convertIntegrationFnToClass(iXQ, nXQ);
  aXQ.ModuleMetadata = PL4;
  aXQ.moduleMetadataIntegration = nXQ
})
// @from(Ln 58210, Col 4)
QIQ = U((AIQ) => {
  Object.defineProperty(AIQ, "__esModule", {
    value: !0
  });
  var rXQ = CQ(),
    sXQ = Ng(),
    yL4 = Eq(),
    hj1 = {
      include: {
        cookies: !0,
        data: !0,
        headers: !0,
        ip: !1,
        query_string: !0,
        url: !0,
        user: {
          id: !0,
          username: !0,
          email: !0
        }
      },
      transactionNamingScheme: "methodPath"
    },
    tXQ = "RequestData",
    vL4 = (A = {}) => {
      let Q = rXQ.addRequestDataToEvent,
        B = {
          ...hj1,
          ...A,
          include: {
            method: !0,
            ...hj1.include,
            ...A.include,
            user: A.include && typeof A.include.user === "boolean" ? A.include.user : {
              ...hj1.include.user,
              ...(A.include || {}).user
            }
          }
        };
      return {
        name: tXQ,
        setupOnce() {},
        processEvent(G, Z, Y) {
          let {
            transactionNamingScheme: J
          } = B, {
            sdkProcessingMetadata: X = {}
          } = G, I = X.request;
          if (!I) return G;
          let D = X.requestDataOptionsFromExpressHandler || X.requestDataOptionsFromGCPWrapper || bL4(B),
            W = Q(G, I, D);
          if (G.type === "transaction" || J === "handler") return W;
          let V = I._sentryTransaction;
          if (V) {
            let F = yL4.spanToJSON(V).description || "",
              H = fL4(Y) === "sentry.javascript.nextjs" ? F.startsWith("/api") : J !== "path",
              [E] = rXQ.extractPathForTransaction(I, {
                path: !0,
                method: H,
                customRoute: F
              });
            W.transaction = E
          }
          return W
        }
      }
    },
    eXQ = sXQ.defineIntegration(vL4),
    kL4 = sXQ.convertIntegrationFnToClass(tXQ, eXQ);

  function bL4(A) {
    let {
      transactionNamingScheme: Q,
      include: {
        ip: B,
        user: G,
        ...Z
      }
    } = A, Y = [];
    for (let [X, I] of Object.entries(Z))
      if (I) Y.push(X);
    let J;
    if (G === void 0) J = !0;
    else if (typeof G === "boolean") J = G;
    else {
      let X = [];
      for (let [I, D] of Object.entries(G))
        if (D) X.push(I);
      J = X
    }
    return {
      include: {
        ip: B,
        user: J,
        request: Y.length !== 0 ? Y : void 0,
        transaction: Q
      }
    }
  }

  function fL4(A) {
    try {
      return A.getOptions()._metadata.sdk.name
    } catch (Q) {
      return
    }
  }
  AIQ.RequestData = kL4;
  AIQ.requestDataIntegration = eXQ
})
// @from(Ln 58320, Col 4)
gj1 = U((YIQ) => {
  Object.defineProperty(YIQ, "__esModule", {
    value: !0
  });
  var lV = CQ(),
    x1A = jW(),
    BIQ = Ng(),
    uL4 = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/, /^ResizeObserver loop completed with undelivered notifications.$/, /^Cannot redefine property: googletag$/],
    mL4 = [/^.*\/healthcheck$/, /^.*\/healthy$/, /^.*\/live$/, /^.*\/ready$/, /^.*\/heartbeat$/, /^.*\/health$/, /^.*\/healthz$/],
    GIQ = "InboundFilters",
    dL4 = (A = {}) => {
      return {
        name: GIQ,
        setupOnce() {},
        processEvent(Q, B, G) {
          let Z = G.getOptions(),
            Y = pL4(A, Z);
          return lL4(Q, Y) ? null : Q
        }
      }
    },
    ZIQ = BIQ.defineIntegration(dL4),
    cL4 = BIQ.convertIntegrationFnToClass(GIQ, ZIQ);

  function pL4(A = {}, Q = {}) {
    return {
      allowUrls: [...A.allowUrls || [], ...Q.allowUrls || []],
      denyUrls: [...A.denyUrls || [], ...Q.denyUrls || []],
      ignoreErrors: [...A.ignoreErrors || [], ...Q.ignoreErrors || [], ...A.disableErrorDefaults ? [] : uL4],
      ignoreTransactions: [...A.ignoreTransactions || [], ...Q.ignoreTransactions || [], ...A.disableTransactionDefaults ? [] : mL4],
      ignoreInternal: A.ignoreInternal !== void 0 ? A.ignoreInternal : !0
    }
  }

  function lL4(A, Q) {
    if (Q.ignoreInternal && sL4(A)) return x1A.DEBUG_BUILD && lV.logger.warn(`Event dropped due to being internal Sentry Error.
Event: ${lV.getEventDescription(A)}`), !0;
    if (iL4(A, Q.ignoreErrors)) return x1A.DEBUG_BUILD && lV.logger.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${lV.getEventDescription(A)}`), !0;
    if (nL4(A, Q.ignoreTransactions)) return x1A.DEBUG_BUILD && lV.logger.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${lV.getEventDescription(A)}`), !0;
    if (aL4(A, Q.denyUrls)) return x1A.DEBUG_BUILD && lV.logger.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${lV.getEventDescription(A)}.
Url: ${miA(A)}`), !0;
    if (!oL4(A, Q.allowUrls)) return x1A.DEBUG_BUILD && lV.logger.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${lV.getEventDescription(A)}.
Url: ${miA(A)}`), !0;
    return !1
  }

  function iL4(A, Q) {
    if (A.type || !Q || !Q.length) return !1;
    return rL4(A).some((B) => lV.stringMatchesSomePattern(B, Q))
  }

  function nL4(A, Q) {
    if (A.type !== "transaction" || !Q || !Q.length) return !1;
    let B = A.transaction;
    return B ? lV.stringMatchesSomePattern(B, Q) : !1
  }

  function aL4(A, Q) {
    if (!Q || !Q.length) return !1;
    let B = miA(A);
    return !B ? !1 : lV.stringMatchesSomePattern(B, Q)
  }

  function oL4(A, Q) {
    if (!Q || !Q.length) return !0;
    let B = miA(A);
    return !B ? !0 : lV.stringMatchesSomePattern(B, Q)
  }

  function rL4(A) {
    let Q = [];
    if (A.message) Q.push(A.message);
    let B;
    try {
      B = A.exception.values[A.exception.values.length - 1]
    } catch (G) {}
    if (B) {
      if (B.value) {
        if (Q.push(B.value), B.type) Q.push(`${B.type}: ${B.value}`)
      }
    }
    if (x1A.DEBUG_BUILD && Q.length === 0) lV.logger.error(`Could not extract message for event ${lV.getEventDescription(A)}`);
    return Q
  }

  function sL4(A) {
    try {
      return A.exception.values[0].type === "SentryError"
    } catch (Q) {}
    return !1
  }

  function tL4(A = []) {
    for (let Q = A.length - 1; Q >= 0; Q--) {
      let B = A[Q];
      if (B && B.filename !== "<anonymous>" && B.filename !== "[native code]") return B.filename || null
    }
    return null
  }

  function miA(A) {
    try {
      let Q;
      try {
        Q = A.exception.values[0].stacktrace.frames
      } catch (B) {}
      return Q ? tL4(Q) : null
    } catch (Q) {
      return x1A.DEBUG_BUILD && lV.logger.error(`Cannot extract url for event ${lV.getEventDescription(A)}`), null
    }
  }
  YIQ.InboundFilters = cL4;
  YIQ.inboundFiltersIntegration = ZIQ
})
// @from(Ln 58438, Col 4)
uj1 = U((KIQ) => {
  Object.defineProperty(KIQ, "__esModule", {
    value: !0
  });
  var QO4 = CQ(),
    BO4 = dM(),
    IIQ = Ng(),
    JIQ, DIQ = "FunctionToString",
    XIQ = new WeakMap,
    GO4 = () => {
      return {
        name: DIQ,
        setupOnce() {
          JIQ = Function.prototype.toString;
          try {
            Function.prototype.toString = function (...A) {
              let Q = QO4.getOriginalFunction(this),
                B = XIQ.has(BO4.getClient()) && Q !== void 0 ? Q : this;
              return JIQ.apply(B, A)
            }
          } catch (A) {}
        },
        setup(A) {
          XIQ.set(A, !0)
        }
      }
    },
    WIQ = IIQ.defineIntegration(GO4),
    ZO4 = IIQ.convertIntegrationFnToClass(DIQ, WIQ);
  KIQ.FunctionToString = ZO4;
  KIQ.functionToStringIntegration = WIQ
})