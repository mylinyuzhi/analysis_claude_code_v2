
// @from(Start 13088290, End 13094062)
DJ0 = z((u19) => {
  Object.defineProperty(u19, "__esModule", {
    value: !0
  });
  var R2 = _4(),
    QN3 = mo2(),
    BN3 = mY0(),
    GN3 = pY0(),
    lPA = GJ0(),
    KJ0 = i0(),
    ZN3 = Se2(),
    b19 = BJ0(),
    IN3 = he2(),
    YN3 = ne2(),
    JN3 = BA9(),
    WN3 = ZA9(),
    Ia = M19(),
    XN3 = sG1(),
    VN3 = YZ1(),
    FN3 = WZ1(),
    KN3 = GZ1(),
    DN3 = tG1(),
    HN3 = rG1(),
    CN3 = BZ1(),
    EN3 = XZ1(),
    zN3 = HZ1(),
    f19 = WJ0(),
    h19 = FZ1(),
    g19 = eG1(),
    UN3 = JJ0(),
    $N3 = S19(),
    wN3 = y19(),
    qN3 = v19(),
    NN3 = b19.createGetModuleFromFilename(),
    LN3 = {
      ...R2.Integrations,
      ...JN3,
      ...WN3
    },
    MN3 = {
      instrumentCron: $N3.instrumentCron,
      instrumentNodeCron: wN3.instrumentNodeCron,
      instrumentNodeSchedule: qN3.instrumentNodeSchedule
    };
  u19.Hub = R2.Hub;
  u19.SDK_VERSION = R2.SDK_VERSION;
  u19.SEMANTIC_ATTRIBUTE_SENTRY_OP = R2.SEMANTIC_ATTRIBUTE_SENTRY_OP;
  u19.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = R2.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
  u19.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = R2.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
  u19.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = R2.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
  u19.Scope = R2.Scope;
  u19.addBreadcrumb = R2.addBreadcrumb;
  u19.addEventProcessor = R2.addEventProcessor;
  u19.addGlobalEventProcessor = R2.addGlobalEventProcessor;
  u19.addIntegration = R2.addIntegration;
  u19.captureCheckIn = R2.captureCheckIn;
  u19.captureEvent = R2.captureEvent;
  u19.captureException = R2.captureException;
  u19.captureMessage = R2.captureMessage;
  u19.captureSession = R2.captureSession;
  u19.close = R2.close;
  u19.configureScope = R2.configureScope;
  u19.continueTrace = R2.continueTrace;
  u19.createTransport = R2.createTransport;
  u19.endSession = R2.endSession;
  u19.extractTraceparentData = R2.extractTraceparentData;
  u19.flush = R2.flush;
  u19.functionToStringIntegration = R2.functionToStringIntegration;
  u19.getActiveSpan = R2.getActiveSpan;
  u19.getActiveTransaction = R2.getActiveTransaction;
  u19.getClient = R2.getClient;
  u19.getCurrentHub = R2.getCurrentHub;
  u19.getCurrentScope = R2.getCurrentScope;
  u19.getGlobalScope = R2.getGlobalScope;
  u19.getHubFromCarrier = R2.getHubFromCarrier;
  u19.getIsolationScope = R2.getIsolationScope;
  u19.getSpanStatusFromHttpCode = R2.getSpanStatusFromHttpCode;
  u19.inboundFiltersIntegration = R2.inboundFiltersIntegration;
  u19.isInitialized = R2.isInitialized;
  u19.lastEventId = R2.lastEventId;
  u19.linkedErrorsIntegration = R2.linkedErrorsIntegration;
  u19.makeMain = R2.makeMain;
  u19.metrics = R2.metrics;
  u19.parameterize = R2.parameterize;
  u19.requestDataIntegration = R2.requestDataIntegration;
  u19.runWithAsyncContext = R2.runWithAsyncContext;
  u19.setContext = R2.setContext;
  u19.setCurrentClient = R2.setCurrentClient;
  u19.setExtra = R2.setExtra;
  u19.setExtras = R2.setExtras;
  u19.setHttpStatus = R2.setHttpStatus;
  u19.setMeasurement = R2.setMeasurement;
  u19.setTag = R2.setTag;
  u19.setTags = R2.setTags;
  u19.setUser = R2.setUser;
  u19.spanStatusfromHttpCode = R2.spanStatusfromHttpCode;
  u19.startActiveSpan = R2.startActiveSpan;
  u19.startInactiveSpan = R2.startInactiveSpan;
  u19.startSession = R2.startSession;
  u19.startSpan = R2.startSpan;
  u19.startSpanManual = R2.startSpanManual;
  u19.startTransaction = R2.startTransaction;
  u19.trace = R2.trace;
  u19.withActiveSpan = R2.withActiveSpan;
  u19.withIsolationScope = R2.withIsolationScope;
  u19.withMonitor = R2.withMonitor;
  u19.withScope = R2.withScope;
  u19.autoDiscoverNodePerformanceMonitoringIntegrations = QN3.autoDiscoverNodePerformanceMonitoringIntegrations;
  u19.NodeClient = BN3.NodeClient;
  u19.makeNodeTransport = GN3.makeNodeTransport;
  u19.defaultIntegrations = lPA.defaultIntegrations;
  u19.defaultStackParser = lPA.defaultStackParser;
  u19.getDefaultIntegrations = lPA.getDefaultIntegrations;
  u19.getSentryRelease = lPA.getSentryRelease;
  u19.init = lPA.init;
  u19.DEFAULT_USER_INCLUDES = KJ0.DEFAULT_USER_INCLUDES;
  u19.addRequestDataToEvent = KJ0.addRequestDataToEvent;
  u19.extractRequestData = KJ0.extractRequestData;
  u19.deepReadDirSync = ZN3.deepReadDirSync;
  u19.createGetModuleFromFilename = b19.createGetModuleFromFilename;
  u19.enableAnrDetection = IN3.enableAnrDetection;
  u19.Handlers = YN3;
  u19.captureConsoleIntegration = Ia.captureConsoleIntegration;
  u19.debugIntegration = Ia.debugIntegration;
  u19.dedupeIntegration = Ia.dedupeIntegration;
  u19.extraErrorDataIntegration = Ia.extraErrorDataIntegration;
  u19.httpClientIntegration = Ia.httpClientIntegration;
  u19.reportingObserverIntegration = Ia.reportingObserverIntegration;
  u19.rewriteFramesIntegration = Ia.rewriteFramesIntegration;
  u19.sessionTimingIntegration = Ia.sessionTimingIntegration;
  u19.consoleIntegration = XN3.consoleIntegration;
  u19.onUncaughtExceptionIntegration = VN3.onUncaughtExceptionIntegration;
  u19.onUnhandledRejectionIntegration = FN3.onUnhandledRejectionIntegration;
  u19.modulesIntegration = KN3.modulesIntegration;
  u19.contextLinesIntegration = DN3.contextLinesIntegration;
  u19.nodeContextIntegration = HN3.nodeContextIntegration;
  u19.localVariablesIntegration = CN3.localVariablesIntegration;
  u19.spotlightIntegration = EN3.spotlightIntegration;
  u19.anrIntegration = zN3.anrIntegration;
  u19.hapiErrorPlugin = f19.hapiErrorPlugin;
  u19.hapiIntegration = f19.hapiIntegration;
  u19.Undici = h19.Undici;
  u19.nativeNodeFetchintegration = h19.nativeNodeFetchintegration;
  u19.Http = g19.Http;
  u19.httpIntegration = g19.httpIntegration;
  u19.trpcMiddleware = UN3.trpcMiddleware;
  u19.Integrations = LN3;
  u19.cron = MN3;
  u19.getModuleFromFilename = NN3
})
// @from(Start 13094068, End 13094071)
m19
// @from(Start 13094073, End 13094076)
d19
// @from(Start 13094078, End 13094081)
CQA
// @from(Start 13094087, End 13094567)
$Z1 = L(() => {
  m19 = BA(VA(), 1), d19 = BA(DJ0(), 1);
  CQA = class CQA extends m19.Component {
    constructor(A) {
      super(A);
      this.state = {
        hasError: !1
      }
    }
    static getDerivedStateFromError() {
      return {
        hasError: !0
      }
    }
    componentDidCatch(A) {
      try {
        d19.captureException(A)
      } catch {}
    }
    render() {
      if (this.state.hasError) return null;
      return this.props.children
    }
  }
})
// @from(Start 13094570, End 13094774)
function NM3() {
  if (Tt() === "sonnet") {
    let {
      hasAccess: Q
    } = hc();
    if (Q) return {
      alias: "sonnet[1m]",
      name: "Sonnet 1M",
      multiplier: 5
    }
  }
  return null
}
// @from(Start 13094776, End 13095057)
function EQA(A) {
  let Q = NM3();
  if (!Q) return null;
  switch (A) {
    case "warning":
      return `/model ${Q.alias} for more context`;
    case "tip":
      return `Tip: You have access to ${Q.name} with ${Q.multiplier}x more context`;
    default:
      return null
  }
}
// @from(Start 13095062, End 13095096)
wZ1 = L(() => {
  t2();
  giA()
})
// @from(Start 13095099, End 13095707)
function c19({
  tokenUsage: A
}) {
  let {
    percentLeft: Q,
    isAboveWarningThreshold: B,
    isAboveErrorThreshold: G
  } = x1A(A), Z = nI2();
  if (!B || Z) return null;
  let I = b1A(),
    Y = EQA("warning");
  return zQA.createElement(S, {
    flexDirection: "row"
  }, I ? zQA.createElement($, {
    dimColor: !0
  }, Y ? `Context left until auto-compact: ${Q}% · ${Y}` : `Context left until auto-compact: ${Q}%`) : zQA.createElement($, {
    color: G ? "error" : "warning"
  }, Y ? `Context low (${Q}% remaining) · ${Y}` : `Context low (${Q}% remaining) · Run /compact to compact & continue`))
}
// @from(Start 13095712, End 13095715)
zQA
// @from(Start 13095721, End 13095794)
p19 = L(() => {
  hA();
  v1A();
  y1A();
  wZ1();
  zQA = BA(VA(), 1)
})
// @from(Start 13095797, End 13095856)
function l19(A) {
  return x1A(A).isAboveWarningThreshold
}
// @from(Start 13095861, End 13095887)
i19 = L(() => {
  v1A()
})
// @from(Start 13095890, End 13096084)
function yXA(A) {
  return n19.useMemo(() => {
    let Q = A?.find((B) => B.name === "ide");
    if (!Q) return null;
    return Q.type === "connected" ? "connected" : "disconnected"
  }, [A])
}
// @from(Start 13096089, End 13096092)
n19
// @from(Start 13096098, End 13096136)
qZ1 = L(() => {
  n19 = BA(VA(), 1)
})
// @from(Start 13096181, End 13096693)
function a19({
  ideSelection: A,
  mcpClients: Q
}) {
  let B = yXA(Q),
    G = B === "connected" && (A?.filePath || A?.text && A.lineCount > 0);
  if (B === null || !G || !A) return null;
  if (A.text && A.lineCount > 0) return iPA.createElement($, {
    color: "ide",
    key: "selection-indicator"
  }, "⧉ ", A.lineCount, " ", A.lineCount === 1 ? "line" : "lines", " selected");
  if (A.filePath) return iPA.createElement($, {
    color: "ide",
    key: "selection-indicator"
  }, "⧉ In ", LM3(A.filePath))
}
// @from(Start 13096698, End 13096701)
iPA
// @from(Start 13096707, End 13096762)
s19 = L(() => {
  hA();
  qZ1();
  iPA = BA(VA(), 1)
})
// @from(Start 13096765, End 13096874)
function o19() {
  let [A, Q] = r19.useState(null);

  function B() {
    return
  }
  return CI(B, 1e4), A
}
// @from(Start 13096879, End 13096882)
r19
// @from(Start 13096884, End 13096900)
MM3 = 2147483648
// @from(Start 13096904, End 13096920)
OM3 = 2684354560
// @from(Start 13096926, End 13096972)
t19 = L(() => {
  JE();
  r19 = BA(VA(), 1)
})
// @from(Start 13096975, End 13097024)
function e19() {
  let A = o19();
  return null
}
// @from(Start 13097029, End 13097032)
nPA
// @from(Start 13097038, End 13097101)
A09 = L(() => {
  hA();
  t19();
  R9();
  nPA = BA(VA(), 1)
})
// @from(Start 13097104, End 13097992)
function Q09() {
  let [A, Q] = xXA.useState(0), B = xXA.useRef(null);
  if (xXA.useEffect(() => {
      if (!nQ.isSandboxingEnabled()) return;
      let G = nQ.getSandboxViolationStore(),
        Z = G.getTotalCount(),
        I = G.subscribe(() => {
          let Y = G.getTotalCount(),
            J = Y - Z;
          if (J > 0) {
            if (Q(J), Z = Y, B.current) clearTimeout(B.current);
            B.current = setTimeout(() => {
              Q(0)
            }, 5000)
          }
        });
      return () => {
        if (I(), B.current) clearTimeout(B.current)
      }
    }, []), !nQ.isSandboxingEnabled() || A === 0) return null;
  return aPA.createElement(S, {
    paddingX: 0,
    paddingY: 0
  }, aPA.createElement($, {
    color: "inactive"
  }, "⧈ Sandbox blocked ", A, " ", A === 1 ? "operation" : "operations", " · ctrl+o for details · /sandbox to disable"))
}
// @from(Start 13097997, End 13098000)
aPA
// @from(Start 13098002, End 13098005)
xXA
// @from(Start 13098011, End 13098084)
B09 = L(() => {
  hA();
  $J();
  aPA = BA(VA(), 1), xXA = BA(VA(), 1)
})
// @from(Start 13098087, End 13100436)
function Z09({
  apiKeyStatus: A,
  autoUpdaterResult: Q,
  debug: B,
  isAutoUpdating: G,
  verbose: Z,
  messages: I,
  onAutoUpdaterResult: Y,
  onChangeIsUpdating: J,
  ideSelection: W,
  mcpClients: X,
  isInputWrapped: V = !1,
  shouldShowSearchHint: F = !1
}) {
  let K = NZ1.useMemo(() => {
      let v = nk(I);
      return ZK(v)
    }, [I]),
    D = l19(K),
    H = yXA(X),
    [{
      notifications: C
    }] = OQ(),
    E = w91(),
    q = !(H === "connected" && (W?.filePath || W?.text && W.lineCount > 0)) || G || Q?.status !== "success",
    w = E.isUsingOverage,
    N = f4(),
    R = N === "team" || N === "enterprise",
    T = Jg(),
    y = V && !D && A !== "invalid" && A !== "missing" && T !== void 0;
  return NZ1.useEffect(() => {
    if (y) GA("tengu_external_editor_hint_shown", {})
  }, [y]), w4.createElement(CQA, null, w4.createElement(S, {
    flexDirection: "column",
    alignItems: "flex-end"
  }, w4.createElement(a19, {
    ideSelection: W,
    mcpClients: X
  }), C.current && ("jsx" in C.current ? w4.createElement(S, {
    key: C.current.key
  }, C.current.jsx) : w4.createElement($, {
    color: C.current.color,
    dimColor: !C.current.color
  }, C.current.text)), w && !R && w4.createElement(S, null, w4.createElement($, {
    dimColor: !0
  }, "Now using extra usage")), A === "invalid" && w4.createElement(S, null, w4.createElement($, {
    color: "error"
  }, "Invalid API key · Run /login")), A === "missing" && w4.createElement(S, null, w4.createElement($, {
    color: "error"
  }, "Missing API key · Run /login")), B && w4.createElement(S, null, w4.createElement($, {
    color: "warning"
  }, "Debug mode")), A !== "invalid" && A !== "missing" && Z && w4.createElement(S, null, w4.createElement($, {
    dimColor: !0
  }, K, " tokens")), w4.createElement(c19, {
    tokenUsage: K
  }), q && w4.createElement(Mc2, {
    verbose: Z,
    onAutoUpdaterResult: Y,
    autoUpdaterResult: Q,
    isUpdating: G,
    onChangeIsUpdating: J,
    showSuccessMessage: !D
  }), F ? w4.createElement(S, null, w4.createElement($, {
    dimColor: !0
  }, "ctrl-r to search history")) : y && w4.createElement(S, null, w4.createElement($, {
    dimColor: !0
  }, "ctrl-g to edit prompt in "), w4.createElement($, {
    bold: !0,
    dimColor: !0
  }, aF(T))), w4.createElement(e19, null), w4.createElement(Q09, null)))
}
// @from(Start 13100441, End 13100443)
w4
// @from(Start 13100445, End 13100448)
NZ1
// @from(Start 13100450, End 13100460)
G09 = 5000
// @from(Start 13100466, End 13100666)
HJ0 = L(() => {
  hA();
  Oc2();
  $Z1();
  p19();
  i19();
  s19();
  qZ1();
  z9();
  A09();
  q0();
  pn();
  nY();
  GO();
  cQ();
  B09();
  Pi();
  gB();
  w4 = BA(VA(), 1), NZ1 = BA(VA(), 1)
})
// @from(Start 13100669, End 13102020)
function I09(A, Q, B, G) {
  let [Z, I] = vXA.useState(0), [Y, J] = vXA.useState(void 0), [W, X] = vXA.useState(!1), V = vXA.useRef(!1), F = F71(W ? G09 : 0), K = (q, w, N, R = !1) => {
    A(q, w, N), G?.(R ? 0 : q.length)
  }, D = (q, w = !1) => {
    if (!q) return;
    let N = Wf(q.display),
      R = N === "bash" || N === "memory" || N === "background" ? q.display.slice(1) : q.display;
    K(R, N, q.pastedContents, w)
  };

  function H() {
    (async () => {
      let q = [];
      for await (let N of Cm1()) q.push(N);
      if (Z >= q.length) return;
      if (Z === 0) {
        let N = Q.trim() !== "";
        J(N ? {
          display: Q,
          pastedContents: B
        } : void 0)
      }
      let w = Z + 1;
      if (I(w), D(q[Z], !0), w >= 2 && !V.current) X(!0), V.current = !0
    })()
  }

  function C() {
    return (async () => {
      let q = [];
      for await (let w of Cm1()) q.push(w);
      if (Z > 1) I(Z - 1), D(q[Z - 2]);
      else if (Z === 1)
        if (I(0), Y) D(Y);
        else K("", "prompt", {})
    })(), Z <= 0
  }

  function E() {
    J(void 0), I(0), X(!1)
  }

  function U() {
    X(!1), V.current = !0
  }
  return {
    historyIndex: Z,
    setHistoryIndex: I,
    onHistoryUp: H,
    onHistoryDown: C,
    resetHistory: E,
    shouldShowSearchHint: W && !F,
    dismissSearchHint: U
  }
}
// @from(Start 13102025, End 13102028)
vXA
// @from(Start 13102034, End 13102107)
Y09 = L(() => {
  zp();
  o7A();
  WZ0();
  HJ0();
  vXA = BA(VA(), 1)
})
// @from(Start 13102110, End 13102201)
function Og(A) {
  return !Array.isArray ? H09(A) === "[object Array]" : Array.isArray(A)
}
// @from(Start 13102203, End 13102324)
function TM3(A) {
  if (typeof A == "string") return A;
  let Q = A + "";
  return Q == "0" && 1 / A == -RM3 ? "-0" : Q
}
// @from(Start 13102326, End 13102378)
function PM3(A) {
  return A == null ? "" : TM3(A)
}
// @from(Start 13102380, End 13102429)
function Bx(A) {
  return typeof A === "string"
}
// @from(Start 13102431, End 13102481)
function K09(A) {
  return typeof A === "number"
}
// @from(Start 13102483, End 13102574)
function jM3(A) {
  return A === !0 || A === !1 || SM3(A) && H09(A) == "[object Boolean]"
}
// @from(Start 13102576, End 13102626)
function D09(A) {
  return typeof A === "object"
}
// @from(Start 13102628, End 13102677)
function SM3(A) {
  return D09(A) && A !== null
}
// @from(Start 13102679, End 13102733)
function aq(A) {
  return A !== void 0 && A !== null
}
// @from(Start 13102735, End 13102780)
function CJ0(A) {
  return !A.trim().length
}
// @from(Start 13102782, End 13102912)
function H09(A) {
  return A == null ? A === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(A)
}
// @from(Start 13102913, End 13103310)
class C09 {
  constructor(A) {
    this._keys = [], this._keyMap = {};
    let Q = 0;
    A.forEach((B) => {
      let G = E09(B);
      this._keys.push(G), this._keyMap[G.id] = G, Q += G.weight
    }), this._keys.forEach((B) => {
      B.weight /= Q
    })
  }
  get(A) {
    return this._keyMap[A]
  }
  keys() {
    return this._keys
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}
// @from(Start 13103312, End 13103759)
function E09(A) {
  let Q = null,
    B = null,
    G = null,
    Z = 1,
    I = null;
  if (Bx(A) || Og(A)) G = A, Q = W09(A), B = EJ0(A);
  else {
    if (!J09.call(A, "name")) throw Error(xM3("name"));
    let Y = A.name;
    if (G = Y, J09.call(A, "weight")) {
      if (Z = A.weight, Z <= 0) throw Error(vM3(Y))
    }
    Q = W09(Y), B = EJ0(Y), I = A.getFn
  }
  return {
    path: Q,
    id: B,
    weight: Z,
    src: G,
    getFn: I
  }
}
// @from(Start 13103761, End 13103814)
function W09(A) {
  return Og(A) ? A : A.split(".")
}
// @from(Start 13103816, End 13103868)
function EJ0(A) {
  return Og(A) ? A.join(".") : A
}
// @from(Start 13103870, End 13104390)
function bM3(A, Q) {
  let B = [],
    G = !1,
    Z = (I, Y, J) => {
      if (!aq(I)) return;
      if (!Y[J]) B.push(I);
      else {
        let W = Y[J],
          X = I[W];
        if (!aq(X)) return;
        if (J === Y.length - 1 && (Bx(X) || K09(X) || jM3(X))) B.push(PM3(X));
        else if (Og(X)) {
          G = !0;
          for (let V = 0, F = X.length; V < F; V += 1) Z(X[V], Y, J + 1)
        } else if (Y.length) Z(X, Y, J + 1)
      }
    };
  return Z(A, Bx(Q) ? Q.split(".") : Q, 0), G ? B : B[0]
}
// @from(Start 13104392, End 13104724)
function dM3(A = 1, Q = 3) {
  let B = new Map,
    G = Math.pow(10, Q);
  return {
    get(Z) {
      let I = Z.match(mM3).length;
      if (B.has(I)) return B.get(I);
      let Y = 1 / Math.pow(I, 0.5 * A),
        J = parseFloat(Math.round(Y * G) / G);
      return B.set(I, J), J
    },
    clear() {
      B.clear()
    }
  }
}
// @from(Start 13104725, End 13106999)
class OZ1 {
  constructor({
    getFn: A = B8.getFn,
    fieldNormWeight: Q = B8.fieldNormWeight
  } = {}) {
    this.norm = dM3(Q, 3), this.getFn = A, this.isCreated = !1, this.setIndexRecords()
  }
  setSources(A = []) {
    this.docs = A
  }
  setIndexRecords(A = []) {
    this.records = A
  }
  setKeys(A = []) {
    this.keys = A, this._keysMap = {}, A.forEach((Q, B) => {
      this._keysMap[Q.id] = B
    })
  }
  create() {
    if (this.isCreated || !this.docs.length) return;
    if (this.isCreated = !0, Bx(this.docs[0])) this.docs.forEach((A, Q) => {
      this._addString(A, Q)
    });
    else this.docs.forEach((A, Q) => {
      this._addObject(A, Q)
    });
    this.norm.clear()
  }
  add(A) {
    let Q = this.size();
    if (Bx(A)) this._addString(A, Q);
    else this._addObject(A, Q)
  }
  removeAt(A) {
    this.records.splice(A, 1);
    for (let Q = A, B = this.size(); Q < B; Q += 1) this.records[Q].i -= 1
  }
  getValueForItemAtKeyId(A, Q) {
    return A[this._keysMap[Q]]
  }
  size() {
    return this.records.length
  }
  _addString(A, Q) {
    if (!aq(A) || CJ0(A)) return;
    let B = {
      v: A,
      i: Q,
      n: this.norm.get(A)
    };
    this.records.push(B)
  }
  _addObject(A, Q) {
    let B = {
      i: Q,
      $: {}
    };
    this.keys.forEach((G, Z) => {
      let I = G.getFn ? G.getFn(A) : this.getFn(A, G.path);
      if (!aq(I)) return;
      if (Og(I)) {
        let Y = [],
          J = [{
            nestedArrIndex: -1,
            value: I
          }];
        while (J.length) {
          let {
            nestedArrIndex: W,
            value: X
          } = J.pop();
          if (!aq(X)) continue;
          if (Bx(X) && !CJ0(X)) {
            let V = {
              v: X,
              i: W,
              n: this.norm.get(X)
            };
            Y.push(V)
          } else if (Og(X)) X.forEach((V, F) => {
            J.push({
              nestedArrIndex: F,
              value: V
            })
          })
        }
        B.$[Z] = Y
      } else if (Bx(I) && !CJ0(I)) {
        let Y = {
          v: I,
          n: this.norm.get(I)
        };
        B.$[Z] = Y
      }
    }), this.records.push(B)
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    }
  }
}
// @from(Start 13107001, End 13107224)
function z09(A, Q, {
  getFn: B = B8.getFn,
  fieldNormWeight: G = B8.fieldNormWeight
} = {}) {
  let Z = new OZ1({
    getFn: B,
    fieldNormWeight: G
  });
  return Z.setKeys(A.map(E09)), Z.setSources(Q), Z.create(), Z
}
// @from(Start 13107226, End 13107469)
function cM3(A, {
  getFn: Q = B8.getFn,
  fieldNormWeight: B = B8.fieldNormWeight
} = {}) {
  let {
    keys: G,
    records: Z
  } = A, I = new OZ1({
    getFn: Q,
    fieldNormWeight: B
  });
  return I.setKeys(G), I.setIndexRecords(Z), I
}
// @from(Start 13107471, End 13107756)
function LZ1(A, {
  errors: Q = 0,
  currentLocation: B = 0,
  expectedLocation: G = 0,
  distance: Z = B8.distance,
  ignoreLocation: I = B8.ignoreLocation
} = {}) {
  let Y = Q / A.length;
  if (I) return Y;
  let J = Math.abs(G - B);
  if (!Z) return J ? 1 : Y;
  return Y + J / Z
}
// @from(Start 13107758, End 13108116)
function pM3(A = [], Q = B8.minMatchCharLength) {
  let B = [],
    G = -1,
    Z = -1,
    I = 0;
  for (let Y = A.length; I < Y; I += 1) {
    let J = A[I];
    if (J && G === -1) G = I;
    else if (!J && G !== -1) {
      if (Z = I - 1, Z - G + 1 >= Q) B.push([G, Z]);
      G = -1
    }
  }
  if (A[I - 1] && I - G >= Q) B.push([G, I - 1]);
  return B
}
// @from(Start 13108118, End 13110306)
function lM3(A, Q, B, {
  location: G = B8.location,
  distance: Z = B8.distance,
  threshold: I = B8.threshold,
  findAllMatches: Y = B8.findAllMatches,
  minMatchCharLength: J = B8.minMatchCharLength,
  includeMatches: W = B8.includeMatches,
  ignoreLocation: X = B8.ignoreLocation
} = {}) {
  if (Q.length > UQA) throw Error(yM3(UQA));
  let V = Q.length,
    F = A.length,
    K = Math.max(0, Math.min(G, F)),
    D = I,
    H = K,
    C = J > 1 || W,
    E = C ? Array(F) : [],
    U;
  while ((U = A.indexOf(Q, H)) > -1) {
    let y = LZ1(Q, {
      currentLocation: U,
      expectedLocation: K,
      distance: Z,
      ignoreLocation: X
    });
    if (D = Math.min(y, D), H = U + V, C) {
      let v = 0;
      while (v < V) E[U + v] = 1, v += 1
    }
  }
  H = -1;
  let q = [],
    w = 1,
    N = V + F,
    R = 1 << V - 1;
  for (let y = 0; y < V; y += 1) {
    let v = 0,
      x = N;
    while (v < x) {
      if (LZ1(Q, {
          errors: y,
          currentLocation: K + x,
          expectedLocation: K,
          distance: Z,
          ignoreLocation: X
        }) <= D) v = x;
      else N = x;
      x = Math.floor((N - v) / 2 + v)
    }
    N = x;
    let p = Math.max(1, K - x + 1),
      u = Y ? F : Math.min(K + x, F) + V,
      e = Array(u + 2);
    e[u + 1] = (1 << y) - 1;
    for (let k = u; k >= p; k -= 1) {
      let m = k - 1,
        o = B[A.charAt(m)];
      if (C) E[m] = +!!o;
      if (e[k] = (e[k + 1] << 1 | 1) & o, y) e[k] |= (q[k + 1] | q[k]) << 1 | 1 | q[k + 1];
      if (e[k] & R) {
        if (w = LZ1(Q, {
            errors: y,
            currentLocation: m,
            expectedLocation: K,
            distance: Z,
            ignoreLocation: X
          }), w <= D) {
          if (D = w, H = m, H <= K) break;
          p = Math.max(1, 2 * K - H)
        }
      }
    }
    if (LZ1(Q, {
        errors: y + 1,
        currentLocation: K,
        expectedLocation: K,
        distance: Z,
        ignoreLocation: X
      }) > D) break;
    q = e
  }
  let T = {
    isMatch: H >= 0,
    score: Math.max(0.001, w)
  };
  if (C) {
    let y = pM3(E, J);
    if (!y.length) T.isMatch = !1;
    else if (W) T.indices = y
  }
  return T
}
// @from(Start 13110308, End 13110470)
function iM3(A) {
  let Q = {};
  for (let B = 0, G = A.length; B < G; B += 1) {
    let Z = A.charAt(B);
    Q[Z] = (Q[Z] || 0) | 1 << G - B - 1
  }
  return Q
}
// @from(Start 13110471, End 13112675)
class NJ0 {
  constructor(A, {
    location: Q = B8.location,
    threshold: B = B8.threshold,
    distance: G = B8.distance,
    includeMatches: Z = B8.includeMatches,
    findAllMatches: I = B8.findAllMatches,
    minMatchCharLength: Y = B8.minMatchCharLength,
    isCaseSensitive: J = B8.isCaseSensitive,
    ignoreLocation: W = B8.ignoreLocation
  } = {}) {
    if (this.options = {
        location: Q,
        threshold: B,
        distance: G,
        includeMatches: Z,
        findAllMatches: I,
        minMatchCharLength: Y,
        isCaseSensitive: J,
        ignoreLocation: W
      }, this.pattern = J ? A : A.toLowerCase(), this.chunks = [], !this.pattern.length) return;
    let X = (F, K) => {
        this.chunks.push({
          pattern: F,
          alphabet: iM3(F),
          startIndex: K
        })
      },
      V = this.pattern.length;
    if (V > UQA) {
      let F = 0,
        K = V % UQA,
        D = V - K;
      while (F < D) X(this.pattern.substr(F, UQA), F), F += UQA;
      if (K) {
        let H = V - UQA;
        X(this.pattern.substr(H), H)
      }
    } else X(this.pattern, 0)
  }
  searchIn(A) {
    let {
      isCaseSensitive: Q,
      includeMatches: B
    } = this.options;
    if (!Q) A = A.toLowerCase();
    if (this.pattern === A) {
      let D = {
        isMatch: !0,
        score: 0
      };
      if (B) D.indices = [
        [0, A.length - 1]
      ];
      return D
    }
    let {
      location: G,
      distance: Z,
      threshold: I,
      findAllMatches: Y,
      minMatchCharLength: J,
      ignoreLocation: W
    } = this.options, X = [], V = 0, F = !1;
    this.chunks.forEach(({
      pattern: D,
      alphabet: H,
      startIndex: C
    }) => {
      let {
        isMatch: E,
        score: U,
        indices: q
      } = lM3(A, D, H, {
        location: G + C,
        distance: Z,
        threshold: I,
        findAllMatches: Y,
        minMatchCharLength: J,
        includeMatches: B,
        ignoreLocation: W
      });
      if (E) F = !0;
      if (V += U, E && q) X = [...X, ...q]
    });
    let K = {
      isMatch: F,
      score: F ? V / this.chunks.length : 1
    };
    if (F && B) K.indices = X;
    return K
  }
}
// @from(Start 13112676, End 13112880)
class Rg {
  constructor(A) {
    this.pattern = A
  }
  static isMultiMatch(A) {
    return X09(A, this.multiRegex)
  }
  static isSingleMatch(A) {
    return X09(A, this.singleRegex)
  }
  search() {}
}
// @from(Start 13112882, End 13112951)
function X09(A, Q) {
  let B = A.match(Q);
  return B ? B[1] : null
}
// @from(Start 13112953, End 13113563)
function sM3(A, Q = {}) {
  return A.split(aM3).map((B) => {
    let G = B.trim().split(nM3).filter((I) => I && !!I.trim()),
      Z = [];
    for (let I = 0, Y = G.length; I < Y; I += 1) {
      let J = G[I],
        W = !1,
        X = -1;
      while (!W && ++X < V09) {
        let V = zJ0[X],
          F = V.isMultiMatch(J);
        if (F) Z.push(new V(F, Q)), W = !0
      }
      if (W) continue;
      X = -1;
      while (++X < V09) {
        let V = zJ0[X],
          F = V.isSingleMatch(J);
        if (F) {
          Z.push(new V(F, Q));
          break
        }
      }
    }
    return Z
  })
}
// @from(Start 13113564, End 13115326)
class M09 {
  constructor(A, {
    isCaseSensitive: Q = B8.isCaseSensitive,
    includeMatches: B = B8.includeMatches,
    minMatchCharLength: G = B8.minMatchCharLength,
    ignoreLocation: Z = B8.ignoreLocation,
    findAllMatches: I = B8.findAllMatches,
    location: Y = B8.location,
    threshold: J = B8.threshold,
    distance: W = B8.distance
  } = {}) {
    this.query = null, this.options = {
      isCaseSensitive: Q,
      includeMatches: B,
      minMatchCharLength: G,
      findAllMatches: I,
      ignoreLocation: Z,
      location: Y,
      threshold: J,
      distance: W
    }, this.pattern = Q ? A : A.toLowerCase(), this.query = sM3(this.pattern, this.options)
  }
  static condition(A, Q) {
    return Q.useExtendedSearch
  }
  searchIn(A) {
    let Q = this.query;
    if (!Q) return {
      isMatch: !1,
      score: 1
    };
    let {
      includeMatches: B,
      isCaseSensitive: G
    } = this.options;
    A = G ? A : A.toLowerCase();
    let Z = 0,
      I = [],
      Y = 0;
    for (let J = 0, W = Q.length; J < W; J += 1) {
      let X = Q[J];
      I.length = 0, Z = 0;
      for (let V = 0, F = X.length; V < F; V += 1) {
        let K = X[V],
          {
            isMatch: D,
            indices: H,
            score: C
          } = K.search(A);
        if (D) {
          if (Z += 1, Y += C, B) {
            let E = K.constructor.type;
            if (rM3.has(E)) I = [...I, ...H];
            else I.push(H)
          }
        } else {
          Y = 0, Z = 0, I.length = 0;
          break
        }
      }
      if (Z) {
        let V = {
          isMatch: !0,
          score: Y / Z
        };
        if (B) V.indices = I;
        return V
      }
    }
    return {
      isMatch: !1,
      score: 1
    }
  }
}
// @from(Start 13115328, End 13115367)
function oM3(...A) {
  UJ0.push(...A)
}
// @from(Start 13115369, End 13115535)
function $J0(A, Q) {
  for (let B = 0, G = UJ0.length; B < G; B += 1) {
    let Z = UJ0[B];
    if (Z.condition(A, Q)) return new Z(A, Q)
  }
  return new NJ0(A, Q)
}
// @from(Start 13115537, End 13116208)
function O09(A, Q, {
  auto: B = !0
} = {}) {
  let G = (Z) => {
    let I = Object.keys(Z),
      Y = tM3(Z);
    if (!Y && I.length > 1 && !qJ0(Z)) return G(F09(Z));
    if (eM3(Z)) {
      let W = Y ? Z[wJ0.PATH] : I[0],
        X = Y ? Z[wJ0.PATTERN] : Z[W];
      if (!Bx(X)) throw Error(kM3(W));
      let V = {
        keyId: EJ0(W),
        pattern: X
      };
      if (B) V.searcher = $J0(X, Q);
      return V
    }
    let J = {
      children: [],
      operator: I[0]
    };
    return I.forEach((W) => {
      let X = Z[W];
      if (Og(X)) X.forEach((V) => {
        J.children.push(G(V))
      })
    }), J
  };
  if (!qJ0(A)) A = F09(A);
  return G(A)
}
// @from(Start 13116210, End 13116532)
function AO3(A, {
  ignoreFieldNorm: Q = B8.ignoreFieldNorm
}) {
  A.forEach((B) => {
    let G = 1;
    B.matches.forEach(({
      key: Z,
      norm: I,
      score: Y
    }) => {
      let J = Z ? Z.weight : null;
      G *= Math.pow(Y === 0 && J ? Number.EPSILON : Y, (J || 1) * (Q ? 1 : I))
    }), B.score = G
  })
}
// @from(Start 13116534, End 13116890)
function QO3(A, Q) {
  let B = A.matches;
  if (Q.matches = [], !aq(B)) return;
  B.forEach((G) => {
    if (!aq(G.indices) || !G.indices.length) return;
    let {
      indices: Z,
      value: I
    } = G, Y = {
      indices: Z,
      value: I
    };
    if (G.key) Y.key = G.key.src;
    if (G.idx > -1) Y.refIndex = G.idx;
    Q.matches.push(Y)
  })
}
// @from(Start 13116892, End 13116934)
function BO3(A, Q) {
  Q.score = A.score
}
// @from(Start 13116936, End 13117287)
function GO3(A, Q, {
  includeMatches: B = B8.includeMatches,
  includeScore: G = B8.includeScore
} = {}) {
  let Z = [];
  if (B) Z.push(QO3);
  if (G) Z.push(BO3);
  return A.map((I) => {
    let {
      idx: Y
    } = I, J = {
      item: Q[Y],
      refIndex: Y
    };
    if (Z.length) Z.forEach((W) => {
      W(I, J)
    });
    return J
  })
}
// @from(Start 13117288, End 13121635)
class yO {
  constructor(A, Q = {}, B) {
    this.options = {
      ...B8,
      ...Q
    }, this.options.useExtendedSearch, this._keyStore = new C09(this.options.keys), this.setCollection(A, B)
  }
  setCollection(A, Q) {
    if (this._docs = A, Q && !(Q instanceof OZ1)) throw Error(_M3);
    this._myIndex = Q || z09(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    })
  }
  add(A) {
    if (!aq(A)) return;
    this._docs.push(A), this._myIndex.add(A)
  }
  remove(A = () => !1) {
    let Q = [];
    for (let B = 0, G = this._docs.length; B < G; B += 1) {
      let Z = this._docs[B];
      if (A(Z, B)) this.removeAt(B), B -= 1, G -= 1, Q.push(Z)
    }
    return Q
  }
  removeAt(A) {
    this._docs.splice(A, 1), this._myIndex.removeAt(A)
  }
  getIndex() {
    return this._myIndex
  }
  search(A, {
    limit: Q = -1
  } = {}) {
    let {
      includeMatches: B,
      includeScore: G,
      shouldSort: Z,
      sortFn: I,
      ignoreFieldNorm: Y
    } = this.options, J = Bx(A) ? Bx(this._docs[0]) ? this._searchStringList(A) : this._searchObjectList(A) : this._searchLogical(A);
    if (AO3(J, {
        ignoreFieldNorm: Y
      }), Z) J.sort(I);
    if (K09(Q) && Q > -1) J = J.slice(0, Q);
    return GO3(J, this._docs, {
      includeMatches: B,
      includeScore: G
    })
  }
  _searchStringList(A) {
    let Q = $J0(A, this.options),
      {
        records: B
      } = this._myIndex,
      G = [];
    return B.forEach(({
      v: Z,
      i: I,
      n: Y
    }) => {
      if (!aq(Z)) return;
      let {
        isMatch: J,
        score: W,
        indices: X
      } = Q.searchIn(Z);
      if (J) G.push({
        item: Z,
        idx: I,
        matches: [{
          score: W,
          value: Z,
          norm: Y,
          indices: X
        }]
      })
    }), G
  }
  _searchLogical(A) {
    let Q = O09(A, this.options),
      B = (Y, J, W) => {
        if (!Y.children) {
          let {
            keyId: V,
            searcher: F
          } = Y, K = this._findMatches({
            key: this._keyStore.get(V),
            value: this._myIndex.getValueForItemAtKeyId(J, V),
            searcher: F
          });
          if (K && K.length) return [{
            idx: W,
            item: J,
            matches: K
          }];
          return []
        }
        let X = [];
        for (let V = 0, F = Y.children.length; V < F; V += 1) {
          let K = Y.children[V],
            D = B(K, J, W);
          if (D.length) X.push(...D);
          else if (Y.operator === MZ1.AND) return []
        }
        return X
      },
      G = this._myIndex.records,
      Z = {},
      I = [];
    return G.forEach(({
      $: Y,
      i: J
    }) => {
      if (aq(Y)) {
        let W = B(Q, Y, J);
        if (W.length) {
          if (!Z[J]) Z[J] = {
            idx: J,
            item: Y,
            matches: []
          }, I.push(Z[J]);
          W.forEach(({
            matches: X
          }) => {
            Z[J].matches.push(...X)
          })
        }
      }
    }), I
  }
  _searchObjectList(A) {
    let Q = $J0(A, this.options),
      {
        keys: B,
        records: G
      } = this._myIndex,
      Z = [];
    return G.forEach(({
      $: I,
      i: Y
    }) => {
      if (!aq(I)) return;
      let J = [];
      if (B.forEach((W, X) => {
          J.push(...this._findMatches({
            key: W,
            value: I[X],
            searcher: Q
          }))
        }), J.length) Z.push({
        idx: Y,
        item: I,
        matches: J
      })
    }), Z
  }
  _findMatches({
    key: A,
    value: Q,
    searcher: B
  }) {
    if (!aq(Q)) return [];
    let G = [];
    if (Og(Q)) Q.forEach(({
      v: Z,
      i: I,
      n: Y
    }) => {
      if (!aq(Z)) return;
      let {
        isMatch: J,
        score: W,
        indices: X
      } = B.searchIn(Z);
      if (J) G.push({
        score: W,
        key: A,
        value: Z,
        idx: I,
        norm: Y,
        indices: X
      })
    });
    else {
      let {
        v: Z,
        n: I
      } = Q, {
        isMatch: Y,
        score: J,
        indices: W
      } = B.searchIn(Z);
      if (Y) G.push({
        score: J,
        key: A,
        value: Z,
        norm: I,
        indices: W
      })
    }
    return G
  }
}
// @from(Start 13121640, End 13121651)
RM3 = 1 / 0
// @from(Start 13121655, End 13121685)
_M3 = "Incorrect 'index' type"
// @from(Start 13121689, End 13121730)
kM3 = (A) => `Invalid value for key ${A}`
// @from(Start 13121734, End 13121784)
yM3 = (A) => `Pattern length exceeds max of ${A}.`
// @from(Start 13121788, End 13121831)
xM3 = (A) => `Missing ${A} property in key`
// @from(Start 13121835, End 13121908)
vM3 = (A) => `Property 'weight' in key '${A}' must be a positive integer`
// @from(Start 13121912, End 13121915)
J09
// @from(Start 13121917, End 13121920)
fM3
// @from(Start 13121922, End 13121925)
hM3
// @from(Start 13121927, End 13121930)
gM3
// @from(Start 13121932, End 13121935)
uM3
// @from(Start 13121937, End 13121939)
B8
// @from(Start 13121941, End 13121944)
mM3
// @from(Start 13121946, End 13121954)
UQA = 32
// @from(Start 13121958, End 13121961)
U09
// @from(Start 13121963, End 13121966)
$09
// @from(Start 13121968, End 13121971)
w09
// @from(Start 13121973, End 13121976)
q09
// @from(Start 13121978, End 13121981)
N09
// @from(Start 13121983, End 13121986)
L09
// @from(Start 13121988, End 13121991)
LJ0
// @from(Start 13121993, End 13121996)
MJ0
// @from(Start 13121998, End 13122001)
zJ0
// @from(Start 13122003, End 13122006)
V09
// @from(Start 13122008, End 13122011)
nM3
// @from(Start 13122013, End 13122022)
aM3 = "|"
// @from(Start 13122026, End 13122029)
rM3
// @from(Start 13122031, End 13122034)
UJ0
// @from(Start 13122036, End 13122039)
MZ1
// @from(Start 13122041, End 13122044)
wJ0
// @from(Start 13122046, End 13122086)
qJ0 = (A) => !!(A[MZ1.AND] || A[MZ1.OR])
// @from(Start 13122090, End 13122116)
tM3 = (A) => !!A[wJ0.PATH]
// @from(Start 13122120, End 13122160)
eM3 = (A) => !Og(A) && D09(A) && !qJ0(A)
// @from(Start 13122164, End 13122252)
F09 = (A) => ({
    [MZ1.AND]: Object.keys(A).map((Q) => ({
      [Q]: A[Q]
    }))
  })
// @from(Start 13122258, End 13127322)
RZ1 = L(() => {
  J09 = Object.prototype.hasOwnProperty;
  fM3 = {
    includeMatches: !1,
    findAllMatches: !1,
    minMatchCharLength: 1
  }, hM3 = {
    isCaseSensitive: !1,
    includeScore: !1,
    keys: [],
    shouldSort: !0,
    sortFn: (A, Q) => A.score === Q.score ? A.idx < Q.idx ? -1 : 1 : A.score < Q.score ? -1 : 1
  }, gM3 = {
    location: 0,
    threshold: 0.6,
    distance: 100
  }, uM3 = {
    useExtendedSearch: !1,
    getFn: bM3,
    ignoreLocation: !1,
    ignoreFieldNorm: !1,
    fieldNormWeight: 1
  }, B8 = {
    ...hM3,
    ...fM3,
    ...gM3,
    ...uM3
  }, mM3 = /[^ ]+/g;
  U09 = class U09 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "exact"
    }
    static get multiRegex() {
      return /^="(.*)"$/
    }
    static get singleRegex() {
      return /^=(.*)$/
    }
    search(A) {
      let Q = A === this.pattern;
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      }
    }
  };
  $09 = class $09 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "inverse-exact"
    }
    static get multiRegex() {
      return /^!"(.*)"$/
    }
    static get singleRegex() {
      return /^!(.*)$/
    }
    search(A) {
      let B = A.indexOf(this.pattern) === -1;
      return {
        isMatch: B,
        score: B ? 0 : 1,
        indices: [0, A.length - 1]
      }
    }
  };
  w09 = class w09 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "prefix-exact"
    }
    static get multiRegex() {
      return /^\^"(.*)"$/
    }
    static get singleRegex() {
      return /^\^(.*)$/
    }
    search(A) {
      let Q = A.startsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      }
    }
  };
  q09 = class q09 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "inverse-prefix-exact"
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/
    }
    static get singleRegex() {
      return /^!\^(.*)$/
    }
    search(A) {
      let Q = !A.startsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, A.length - 1]
      }
    }
  };
  N09 = class N09 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "suffix-exact"
    }
    static get multiRegex() {
      return /^"(.*)"\$$/
    }
    static get singleRegex() {
      return /^(.*)\$$/
    }
    search(A) {
      let Q = A.endsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [A.length - this.pattern.length, A.length - 1]
      }
    }
  };
  L09 = class L09 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "inverse-suffix-exact"
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/
    }
    static get singleRegex() {
      return /^!(.*)\$$/
    }
    search(A) {
      let Q = !A.endsWith(this.pattern);
      return {
        isMatch: Q,
        score: Q ? 0 : 1,
        indices: [0, A.length - 1]
      }
    }
  };
  LJ0 = class LJ0 extends Rg {
    constructor(A, {
      location: Q = B8.location,
      threshold: B = B8.threshold,
      distance: G = B8.distance,
      includeMatches: Z = B8.includeMatches,
      findAllMatches: I = B8.findAllMatches,
      minMatchCharLength: Y = B8.minMatchCharLength,
      isCaseSensitive: J = B8.isCaseSensitive,
      ignoreLocation: W = B8.ignoreLocation
    } = {}) {
      super(A);
      this._bitapSearch = new NJ0(A, {
        location: Q,
        threshold: B,
        distance: G,
        includeMatches: Z,
        findAllMatches: I,
        minMatchCharLength: Y,
        isCaseSensitive: J,
        ignoreLocation: W
      })
    }
    static get type() {
      return "fuzzy"
    }
    static get multiRegex() {
      return /^"(.*)"$/
    }
    static get singleRegex() {
      return /^(.*)$/
    }
    search(A) {
      return this._bitapSearch.searchIn(A)
    }
  };
  MJ0 = class MJ0 extends Rg {
    constructor(A) {
      super(A)
    }
    static get type() {
      return "include"
    }
    static get multiRegex() {
      return /^'"(.*)"$/
    }
    static get singleRegex() {
      return /^'(.*)$/
    }
    search(A) {
      let Q = 0,
        B, G = [],
        Z = this.pattern.length;
      while ((B = A.indexOf(this.pattern, Q)) > -1) Q = B + Z, G.push([B, Q - 1]);
      let I = !!G.length;
      return {
        isMatch: I,
        score: I ? 0 : 1,
        indices: G
      }
    }
  };
  zJ0 = [U09, MJ0, w09, q09, L09, N09, $09, LJ0], V09 = zJ0.length, nM3 = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
  rM3 = new Set([LJ0.type, MJ0.type]);
  UJ0 = [];
  MZ1 = {
    AND: "$and",
    OR: "$or"
  }, wJ0 = {
    PATH: "$path",
    PATTERN: "$val"
  };
  yO.version = "7.0.0";
  yO.createIndex = z09;
  yO.parseIndex = cM3;
  yO.config = B8;
  yO.parseQuery = O09;
  oM3(M09)
})
// @from(Start 13127325, End 13127371)
function bXA(A) {
  return A.startsWith("/")
}
// @from(Start 13127373, End 13127499)
function IO3(A) {
  if (!bXA(A)) return !1;
  if (!A.includes(" ")) return !1;
  if (A.endsWith(" ")) return !1;
  return !0
}
// @from(Start 13127501, End 13127538)
function YO3(A) {
  return `/${A} `
}
// @from(Start 13127540, End 13127866)
function R09(A) {
  let Q = A.userFacingName(),
    B = A.aliases && A.aliases.length > 0 ? ` (${A.aliases.join(", ")})` : "";
  return {
    id: Q,
    displayText: `/${Q}${B}`,
    description: A.description + (A.type === "prompt" && A.argNames?.length ? ` (arguments: ${A.argNames.join(", ")})` : ""),
    metadata: A
  }
}
// @from(Start 13127868, End 13129277)
function T09(A, Q) {
  if (!bXA(A)) return [];
  if (IO3(A)) return [];
  let B = A.slice(1).toLowerCase().trim();
  if (B === "") {
    let Y = Q.filter((K) => !K.isHidden),
      J = [],
      W = [],
      X = [],
      V = [];
    Y.forEach((K) => {
      if (K.type === "prompt" && K.source === "localSettings") J.push(K);
      else if (K.type === "prompt" && K.source === "projectSettings") W.push(K);
      else if (K.type === "prompt" && K.source === "policySettings") X.push(K);
      else V.push(K)
    });
    let F = (K, D) => K.userFacingName().localeCompare(D.userFacingName());
    return J.sort(F), W.sort(F), X.sort(F), V.sort(F), [...J, ...W, ...X, ...V].map(R09)
  }
  let G = Q.filter((Y) => !Y.isHidden).map((Y) => {
    let J = Y.userFacingName(),
      W = J.split(ZO3).filter(Boolean);
    return {
      nameKey: J,
      descriptionKey: Y.description.split(" ").map((X) => JO3(X)).filter(Boolean),
      partKey: W.length > 1 ? W : void 0,
      commandName: J,
      command: Y,
      aliasKey: Y.aliases
    }
  });
  return new yO(G, {
    includeScore: !0,
    threshold: 0.3,
    location: 0,
    distance: 100,
    keys: [{
      name: "commandName",
      weight: 3
    }, {
      name: "partKey",
      weight: 2
    }, {
      name: "aliasKey",
      weight: 2
    }, {
      name: "descriptionKey",
      weight: 0.5
    }]
  }).search(B).map((Y) => R09(Y.item.command))
}
// @from(Start 13129279, End 13129349)
function JO3(A) {
  return A.toLowerCase().replace(/[^a-z0-9]/g, "")
}
// @from(Start 13129351, End 13129611)
function OJ0(A, Q, B, G, Z, I) {
  let Y = typeof A === "string" ? A : A.id,
    J = YO3(Y);
  if (G(J), Z(J.length), Q) {
    let W = typeof A === "string" ? Pq(Y, B) : A.metadata;
    if (W.type !== "prompt" || (W.argNames ?? []).length === 0) I(J, !0)
  }
}
// @from(Start 13129616, End 13129619)
ZO3
// @from(Start 13129625, End 13129677)
P09 = L(() => {
  RZ1();
  cE();
  ZO3 = /[:_-]/g
})
// @from(Start 13129769, End 13130046)
function HO3(A, Q) {
  if (!A) return {
    directory: Q || W0(),
    prefix: ""
  };
  let B = b9(A, Q);
  if (A.endsWith("/") || A.endsWith(FO3)) return {
    directory: B,
    prefix: ""
  };
  let G = WO3(B),
    Z = XO3(A);
  return {
    directory: G,
    prefix: Z
  }
}
// @from(Start 13130048, End 13130424)
function CO3(A) {
  let Q = j09.get(A);
  if (Q) return Q;
  try {
    let Z = RA().readdirSync(A).filter((I) => I.isDirectory() && !I.name.startsWith(".")).map((I) => ({
      name: I.name,
      path: VO3(A, I.name),
      type: "directory"
    })).slice(0, 100);
    return j09.set(A, Z), Z
  } catch (B) {
    return AA(B instanceof Error ? B : Error(String(B))), []
  }
}
// @from(Start 13130425, End 13130798)
async function S09(A, Q = {}) {
  let {
    basePath: B = W0(),
    maxResults: G = 10
  } = Q, {
    directory: Z,
    prefix: I
  } = HO3(A, B), Y = CO3(Z), J = I.toLowerCase();
  return Y.filter((X) => X.name.toLowerCase().startsWith(J)).slice(0, G).map((X) => ({
    id: X.path,
    displayText: X.name + "/",
    description: "directory",
    type: "directory"
  }))
}
// @from(Start 13130803, End 13130812)
KO3 = 500
// @from(Start 13130816, End 13130828)
DO3 = 300000
// @from(Start 13130832, End 13130835)
j09
// @from(Start 13130841, End 13130949)
_09 = L(() => {
  bbA();
  U2();
  AQ();
  g1();
  yI();
  j09 = new tm({
    max: KO3,
    ttl: DO3
  })
})
// @from(Start 13130955, End 13130963)
RJ0 = {}
// @from(Start 13131028, End 13131031)
TZ1
// @from(Start 13131033, End 13131036)
EO3
// @from(Start 13131038, End 13131041)
zO3
// @from(Start 13131047, End 13131256)
TJ0 = L(() => {
  try {
    TZ1 = (() => {
      throw new Error("Cannot require module " + "../../file-index.node");
    })()
  } catch (A) {
    TZ1 = null
  }
  EO3 = TZ1?.FileIndex, zO3 = TZ1?.FileIndex
})
// @from(Start 13131286, End 13131713)
async function UO3() {
  if (PJ0) return null;
  if (PZ1) return PZ1;
  if (UX()) try {
    return PZ1 = new(await Promise.resolve().then(() => (TJ0(), RJ0))).FileIndex, PZ1
  } catch (A) {
    return PJ0 = !0, g(`[FileIndex] Rust module unavailable, falling back to Fuse.js: ${A instanceof Error?A.message:String(A)}`), AA(A), null
  } else return PJ0 = !0, g("[FileIndex] Not in bundled mode, using Fuse.js fallback"), null
}
// @from(Start 13131715, End 13131920)
function wO3(A) {
  let Q = new Set;
  return A.forEach((B) => {
    let Z = $K.dirname(B);
    while (Z !== "." && Z !== $K.parse(Z).root) Q.add(Z), Z = $K.dirname(Z)
  }), [...Q].map((B) => B + $K.sep)
}
// @from(Start 13131921, End 13132038)
async function qO3() {
  return (await Promise.all(v09.map((Q) => _n(Q)))).flatMap((Q) => Q.map((B) => B.filePath))
}
// @from(Start 13132039, End 13132777)
async function NO3() {
  let A = o9(),
    Q = setTimeout(() => {
      A.abort()
    }, 1e4);
  try {
    let G = N1().respectGitignore ?? !0,
      Z = ["--files", "--follow", "--hidden", "--glob", "!.git/"];
    if (!G) Z.push("--no-ignore-vcs");
    let [I, Y] = await Promise.all([aj(Z, ".", A.signal).then((K) => K.map((D) => $K.relative(uQ(), D))), qO3()]), J = [...I, ...Y], X = [...wO3(J), ...J], V = [], F = await UO3();
    if (F) try {
      F.loadFromFileList(X)
    } catch (K) {
      g(`[FileIndex] Failed to load Rust index, using Fuse.js fallback: ${K instanceof Error?K.message:String(K)}`), AA(K), V = X
    } else V = X;
    return {
      fileIndex: F,
      fileList: V
    }
  } finally {
    clearTimeout(Q)
  }
}
// @from(Start 13132779, End 13132917)
function LO3(A, Q) {
  let B = Math.min(A.length, Q.length),
    G = 0;
  while (G < B && A[G] === Q[G]) G++;
  return A.substring(0, G)
}
// @from(Start 13132919, End 13133139)
function y09(A) {
  if (A.length === 0) return "";
  let Q = A.map((G) => G.displayText),
    B = Q[0];
  for (let G = 1; G < Q.length; G++) {
    let Z = Q[G];
    if (B = LO3(B, Z), B === "") return ""
  }
  return B
}
// @from(Start 13133141, End 13133280)
function jZ1(A, Q) {
  return {
    id: `file-${A}`,
    displayText: A,
    metadata: Q !== void 0 ? {
      score: Q
    } : void 0
  }
}
// @from(Start 13133281, End 13134570)
async function MO3(A, Q, B) {
  if (A) try {
    return A.search(B, sPA).map((X) => jZ1(X.path, X.score))
  } catch (W) {
    g(`[FileIndex] Rust search failed, falling back to Fuse.js: ${W instanceof Error?W.message:String(W)}`), AA(W)
  }
  g("[FileIndex] Using Fuse.js fallback for search");
  let G = [...new Set(Q)];
  if (!B) {
    let W = new Set;
    for (let X of G) {
      let V = X.split($K.sep)[0];
      if (V) {
        if (W.add(V), W.size >= sPA) break
      }
    }
    return [...W].sort().map(jZ1)
  }
  let Z = G.map((W) => {
      return {
        path: W,
        filename: $K.basename(W),
        testPenalty: W.includes("test") ? 1 : 0
      }
    }),
    I = B.lastIndexOf($K.sep);
  if (I > 2) Z = Z.filter((W) => {
    return W.path.substring(0, I).startsWith(B.substring(0, I))
  });
  let J = new yO(Z, {
    includeScore: !0,
    threshold: 0.5,
    keys: [{
      name: "path",
      weight: 1
    }, {
      name: "filename",
      weight: 2
    }]
  }).search(B, {
    limit: sPA
  });
  return J = J.sort((W, X) => {
    if (W.score === void 0 || X.score === void 0) return 0;
    if (Math.abs(W.score - X.score) > 0.05) return W.score - X.score;
    return W.item.testPenalty - X.item.testPenalty
  }), J.map((W) => W.item.path).slice(0, sPA).map(jZ1)
}
// @from(Start 13134572, End 13134895)
function jJ0() {
  if (!fXA) fXA = NO3().then((A) => {
    return SJ0 = A.fileIndex, _J0 = A.fileList, k09 = Date.now(), fXA = null, A
  }).catch((A) => {
    return g(`[FileIndex] Cache refresh failed: ${A instanceof Error?A.message:String(A)}`), AA(A), fXA = null, {
      fileIndex: null,
      fileList: []
    }
  })
}
// @from(Start 13134896, End 13135158)
async function OO3() {
  let A = RA(),
    Q = W0();
  try {
    return A.readdirSync(Q).map((G) => {
      let Z = $K.join(Q, G.name),
        I = $K.relative(Q, Z);
      return G.isDirectory() ? I + $K.sep : I
    })
  } catch (B) {
    return AA(B), []
  }
}
// @from(Start 13135159, End 13135670)
async function x09(A, Q = !1) {
  if (!A && !Q) return [];
  if (A === "" || A === "." || A === "./") {
    let B = await OO3();
    return jJ0(), B.slice(0, sPA).map(jZ1)
  }
  try {
    let G = Date.now() - k09 > $O3;
    if (!SJ0 && _J0.length === 0) {
      if (jJ0(), fXA) await fXA
    } else if (G) jJ0();
    let Z = A,
      I = "." + $K.sep;
    if (A.startsWith(I)) Z = A.substring(2);
    if (Z.startsWith("~")) Z = b9(Z);
    return await MO3(SJ0, _J0, Z)
  } catch (B) {
    return AA(B), []
  }
}
// @from(Start 13135672, End 13135857)
function SZ1(A, Q, B, G, Z, I) {
  let Y = typeof A === "string" ? A : A.displayText,
    J = Q.substring(0, G) + Y + Q.substring(G + B.length);
  Z(J);
  let W = G + Y.length;
  I(W)
}
// @from(Start 13135862, End 13135872)
PZ1 = null
// @from(Start 13135876, End 13135884)
PJ0 = !1
// @from(Start 13135888, End 13135898)
SJ0 = null
// @from(Start 13135902, End 13135905)
_J0
// @from(Start 13135907, End 13135917)
fXA = null
// @from(Start 13135921, End 13135928)
k09 = 0
// @from(Start 13135932, End 13135943)
$O3 = 60000
// @from(Start 13135947, End 13135955)
sPA = 15
// @from(Start 13135961, End 13136079)
kJ0 = L(() => {
  RZ1();
  _0();
  g1();
  AQ();
  U2();
  _y();
  yI();
  jQ();
  sj();
  OZ();
  V0();
  _J0 = []
})
// @from(Start 13136082, End 13136181)
function f09(A) {
  return typeof A === "object" && A !== null && "op" in A && TO3.includes(A.op)
}
// @from(Start 13136183, End 13136345)
function b09(A) {
  if (A.startsWith("$")) return "variable";
  if (A.includes("/") || A.startsWith("~") || A.startsWith(".")) return "file";
  return "command"
}
// @from(Start 13136347, End 13136506)
function PO3(A) {
  for (let Q = A.length - 1; Q >= 0; Q--)
    if (typeof A[Q] === "string") return {
      token: A[Q],
      index: Q
    };
  return null
}
// @from(Start 13136508, End 13136608)
function jO3(A, Q) {
  if (Q === 0) return !0;
  let B = A[Q - 1];
  return B !== void 0 && f09(B)
}
// @from(Start 13136610, End 13137497)
function SO3(A, Q) {
  let B = A.slice(0, Q),
    G = B.match(/\$[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (G) return {
    prefix: G[0],
    completionType: "variable"
  };
  let Z = JW(B);
  if (!Z.success) {
    let W = B.split(/\s+/),
      X = W[W.length - 1] || "",
      F = W.length === 1 && !B.includes(" ") ? "command" : b09(X);
    return {
      prefix: X,
      completionType: F
    }
  }
  let I = PO3(Z.tokens);
  if (!I) {
    let W = Z.tokens[Z.tokens.length - 1];
    return {
      prefix: "",
      completionType: W && f09(W) ? "command" : "command"
    }
  }
  if (B.endsWith(" ")) return {
    prefix: "",
    completionType: "file"
  };
  let Y = b09(I.token);
  if (Y === "variable" || Y === "file") return {
    prefix: I.token,
    completionType: Y
  };
  let J = jO3(Z.tokens, I.index) ? "command" : "file";
  return {
    prefix: I.token,
    completionType: J
  }
}
// @from(Start 13137499, End 13137827)
function _O3(A, Q) {
  if (Q === "variable") {
    let B = A.slice(1);
    return `compgen -v ${z8([B])} 2>/dev/null`
  } else if (Q === "file") return `compgen -f ${z8([A])} 2>/dev/null | head -${yJ0} | while IFS= read -r f; do [ -d "$f" ] && echo "$f/" || echo "$f "; done`;
  else return `compgen -c ${z8([A])} 2>/dev/null`
}
// @from(Start 13137829, End 13138169)
function kO3(A, Q) {
  if (Q === "variable") {
    let B = A.slice(1);
    return `print -rl -- \${(k)parameters[(I)${z8([B])}*]} 2>/dev/null`
  } else if (Q === "file") return `for f in ${z8([A])}*(N[1,${yJ0}]); do [[ -d "$f" ]] && echo "$f/" || echo "$f "; done`;
  else return `print -rl -- \${(k)commands[(I)${z8([A])}*]} 2>/dev/null`
}
// @from(Start 13138170, End 13138530)
async function yO3(A, Q, B, G) {
  let Z;
  if (A === "bash") Z = _O3(Q, B);
  else if (A === "zsh") Z = kO3(Q, B);
  else return [];
  return (await (await $rA(Z, G, RO3)).result).stdout.split(`
`).filter((J) => J.trim()).slice(0, yJ0).map((J) => ({
    id: J,
    displayText: J,
    description: void 0,
    metadata: {
      completionType: B
    }
  }))
}
// @from(Start 13138531, End 13138939)
async function h09(A, Q, B) {
  let G = GIA();
  if (G !== "bash" && G !== "zsh") return [];
  try {
    let {
      prefix: Z,
      completionType: I
    } = SO3(A, Q);
    if (!Z) return [];
    return (await yO3(G, Z, I, B)).map((J) => ({
      ...J,
      metadata: {
        ...J.metadata,
        inputSnapshot: A
      }
    }))
  } catch (Z) {
    return g(`Shell completion failed: ${Z}`), []
  }
}
// @from(Start 13138944, End 13138952)
yJ0 = 15
// @from(Start 13138956, End 13138966)
RO3 = 1000
// @from(Start 13138970, End 13138973)
TO3
// @from(Start 13138979, End 13139061)
g09 = L(() => {
  xAA();
  u_();
  V0();
  dK();
  TO3 = ["|", "||", "&&", ";"]
})
// @from(Start 13139093, End 13139796)
function u09(A) {
  switch (A.type) {
    case "file":
      return {
        id: `file-${A.path}`, displayText: A.displayText, description: A.description
      };
    case "mcp_resource":
      return {
        id: `mcp-resource-${A.server}__${A.uri}`, displayText: A.displayText, description: A.description
      };
    case "agent":
      return {
        id: `agent-${A.agentType}`, displayText: A.displayText, description: A.description, color: A.color
      };
    case "mcp_server":
      return {
        id: `mcp-server-${A.serverName}`, displayText: A.displayText, description: A.description, metadata: {
          serverName: A.serverName,
          enabled: A.enabled
        }
      }
  }
}
// @from(Start 13139798, End 13139891)
function xO3(A) {
  if (A.length <= m09) return A;
  return A.substring(0, m09 - 3) + "..."
}
// @from(Start 13139893, End 13140369)
function vO3(A, Q, B = !1) {
  if (!Q && !B) return [];
  try {
    let G = A.map((I) => ({
      type: "agent",
      displayText: `agent-${I.agentType}`,
      description: `Agent: ${xO3(I.whenToUse)}`,
      agentType: I.agentType,
      color: PWA(I.agentType)
    }));
    if (!Q) return G;
    let Z = Q.toLowerCase();
    return G.filter((I) => I.agentType.toLowerCase().includes(Z) || I.displayText.toLowerCase().includes(Z))
  } catch (G) {
    return AA(G), []
  }
}
// @from(Start 13140371, End 13140873)
function bO3(A, Q, B = !1) {
  if (!Q && !B) return [];
  let Z = A.filter((Y) => Y.name !== "ide").map((Y) => {
    let J = Y.type !== "disabled",
      W = J ? "✓" : "○",
      X = J ? "enabled" : "disabled";
    return {
      type: "mcp_server",
      displayText: `${W} [mcp] ${Y.name}`,
      description: `${X} (⏎ to toggle)`,
      serverName: Y.name,
      enabled: J
    }
  });
  if (!Q) return Z;
  let I = Q.toLowerCase();
  return Z.filter((Y) => Y.serverName.toLowerCase().includes(I))
}
// @from(Start 13140874, End 13142366)
async function vJ0(A, Q, B, G = !1, Z = []) {
  if (!A && !G) return [];
  let [I, Y, J] = await Promise.all([x09(A, G), Promise.resolve(vO3(B, A, G)), Promise.resolve(bO3(Z, A, G))]), W = I.map((K) => ({
    type: "file",
    displayText: K.displayText,
    description: K.description,
    path: K.displayText,
    filename: d09.basename(K.displayText),
    score: K.metadata?.score
  })), X = Object.values(Q).flat().map((K) => ({
    type: "mcp_resource",
    displayText: `${K.server}:${K.uri}`,
    description: K.name + (K.description ? ` - ${K.description}` : ""),
    server: K.server,
    uri: K.uri,
    name: K.name || K.uri
  }));
  if (!A) return [...J, ...W, ...X, ...Y].slice(0, xJ0).map(u09);
  let V = [...J, ...X, ...Y],
    F = [];
  for (let K of W) F.push({
    source: K,
    score: K.score ?? 0.5
  });
  if (V.length > 0) {
    let D = new yO(V, {
      includeScore: !0,
      threshold: 0.6,
      keys: [{
        name: "displayText",
        weight: 2
      }, {
        name: "name",
        weight: 3
      }, {
        name: "server",
        weight: 1
      }, {
        name: "description",
        weight: 1
      }, {
        name: "agentType",
        weight: 3
      }, {
        name: "serverName",
        weight: 3
      }]
    }).search(A, {
      limit: xJ0
    });
    for (let H of D) F.push({
      source: H.item,
      score: H.score ?? 0.5
    })
  }
  return F.sort((K, D) => K.score - D.score), F.slice(0, xJ0).map((K) => K.source).map(u09)
}
// @from(Start 13142371, End 13142379)
xJ0 = 15
// @from(Start 13142383, End 13142391)
m09 = 60
// @from(Start 13142397, End 13142448)
c09 = L(() => {
  RZ1();
  jy();
  g1();
  kJ0()
})
// @from(Start 13142454, End 13142487)
p09 = L(() => {
  SD();
  g1()
})
// @from(Start 13142490, End 13142597)
function l09(A) {
  let Q = "plugin" in A ? A.plugin : "no-plugin";
  return `${A.type}:${A.source}:${Q}`
}
// @from(Start 13142599, End 13142926)
function i09(A, Q) {
  if (Q.length === 0) return;
  A((B) => {
    let G = new Set(B.plugins.errors.map((I) => l09(I))),
      Z = Q.filter((I) => !G.has(l09(I)));
    if (Z.length === 0) return B;
    return {
      ...B,
      plugins: {
        ...B.plugins,
        errors: [...B.plugins.errors, ...Z]
      }
    }
  })
}
// @from(Start 13142928, End 13149378)
function n09(A, Q = !1, B) {
  let [G, Z] = OQ(), I = oE.useRef(new Map), Y = oE.useCallback((F, K = [], D = [], H) => {
    Z((C) => {
      let E = s09(F.name),
        q = C.mcp.clients.findIndex((w) => w.name === F.name) === -1 ? [...C.mcp.clients, F] : C.mcp.clients.map((w) => w.name === F.name ? F : w);
      return {
        ...C,
        mcp: {
          ...C.mcp,
          clients: q,
          tools: [...CH1(C.mcp.tools, (w) => w.name?.startsWith(E)), ...K],
          commands: [...CH1(C.mcp.commands, (w) => w.name?.startsWith(E)), ...D],
          resources: {
            ...C.mcp.resources,
            ...H && H.length > 0 ? {
              [F.name]: H
            } : uu0(C.mcp.resources, F.name)
          }
        }
      }
    })
  }, [Z]), J = oE.useCallback(({
    client: F,
    tools: K,
    commands: D,
    resources: H
  }) => {
    switch (Y(F, K, D, H), F.type) {
      case "connected": {
        F.client.onclose = () => {
          if (IYA(F.name, F.config).catch(() => {
              g(`Failed to invalidate the server cache: ${F.name}`)
            }), IMA(F.name)) {
            y0(F.name, "Server is disabled, skipping automatic reconnection");
            return
          }
          let C = F.config.type ?? "stdio";
          if (C !== "stdio" && C !== "sdk") {
            let E = gO3(C);
            y0(F.name, `${E} transport closed/disconnected, attempting automatic reconnection`);
            let U = I.current.get(F.name);
            if (U) clearTimeout(U), I.current.delete(F.name);
            (async () => {
              for (let w = 1; w <= hXA; w++) {
                if (IMA(F.name)) {
                  y0(F.name, "Server disabled during reconnection, stopping retry"), I.current.delete(F.name);
                  return
                }
                Y({
                  ...F,
                  type: "pending",
                  reconnectAttempt: w,
                  maxReconnectAttempts: hXA
                });
                let N = Date.now();
                try {
                  let T = await D1A(F.name, F.config),
                    y = Date.now() - N;
                  if (T.client.type === "connected") {
                    y0(F.name, `${E} reconnection successful after ${y}ms (attempt ${w})`), I.current.delete(F.name), J(T);
                    return
                  }
                  if (y0(F.name, `${E} reconnection attempt ${w} completed with status: ${T.client.type}`), w === hXA) {
                    y0(F.name, `Max reconnection attempts (${hXA}) reached, giving up`), I.current.delete(F.name), J(T);
                    return
                  }
                } catch (T) {
                  let y = Date.now() - N;
                  if (WI(F.name, `${E} reconnection attempt ${w} failed after ${y}ms: ${T}`), w === hXA) {
                    y0(F.name, `Max reconnection attempts (${hXA}) reached, giving up`), I.current.delete(F.name), Y({
                      ...F,
                      type: "failed"
                    });
                    return
                  }
                }
                let R = Math.min(fO3 * Math.pow(2, w - 1), hO3);
                y0(F.name, `Scheduling reconnection attempt ${w+1} in ${R}ms`), await new Promise((T) => {
                  let y = setTimeout(T, R);
                  I.current.set(F.name, y)
                })
              }
            })()
          } else Y({
            ...F,
            type: "failed"
          })
        };
        break
      }
      case "needs-auth":
      case "failed":
      case "pending":
      case "disabled":
        break
    }
  }, [Y]), W = e1();
  oE.useEffect(() => {
    async function F() {
      let {
        servers: K,
        errors: D
      } = Q ? {
        servers: {},
        errors: []
      } : await fk(), H = {
        ...K,
        ...A
      };
      i09(Z, D), Z((C) => {
        let E = new Set(C.mcp.clients.map((q) => q.name)),
          U = Object.entries(H).filter(([q]) => !E.has(q)).map(([q, w]) => ({
            name: q,
            type: "pending",
            config: w
          }));
        if (U.length === 0) return C;
        return {
          ...C,
          mcp: {
            ...C.mcp,
            clients: [...C.mcp.clients, ...U]
          }
        }
      })
    }
    F().catch((K) => {
      WI("useManageMCPConnections", `Failed to initialize servers as pending: ${K instanceof Error?K.message:String(K)}`)
    })
  }, [Q, A, Z, W]), oE.useEffect(() => {
    let F = !1;
    async function K() {
      let {
        servers: D,
        errors: H
      } = Q ? {
        servers: {},
        errors: []
      } : await fk();
      if (F) return;
      i09(Z, H);
      let C = {
        ...D,
        ...A
      };
      v10(J, C).catch((E) => {
        WI("useManageMcpConnections", `Failed to get MCP resources: ${E instanceof Error?E.message:String(E)}`)
      })
    }
    return K(), () => {
      F = !0
    }
  }, [Q, A, J, W]), oE.useEffect(() => {
    let F = I.current;
    return () => {
      for (let K of F.values()) clearTimeout(K);
      F.clear()
    }
  }, []), oE.useEffect(() => {}, [G.mcp.clients, Z]), oE.useEffect(() => B?.updateClients(G.mcp.clients), [B, G.mcp.clients]), oE.useEffect(() => B?.updateTools(G.mcp.tools), [B, G.mcp.tools]), oE.useEffect(() => B?.updateResources(G.mcp.resources), [B, G.mcp.resources]);
  let X = oE.useCallback(async (F) => {
      let K = G.mcp.clients.find((C) => C.name === F);
      if (!K) throw Error(`MCP server ${F} not found`);
      let D = I.current.get(F);
      if (D) clearTimeout(D), I.current.delete(F);
      let H = await D1A(F, K.config);
      return J(H), H
    }, [G.mcp.clients, J, Z]),
    V = oE.useCallback(async (F) => {
      let K = G.mcp.clients.find((H) => H.name === F);
      if (!K) throw Error(`MCP server ${F} not found`);
      if (K.type !== "disabled") {
        let H = I.current.get(F);
        if (H) clearTimeout(H), I.current.delete(F);
        if (k10(F, !1), K.type === "connected") await IYA(F, K.config);
        Y({
          name: F,
          type: "disabled",
          config: K.config
        })
      } else {
        k10(F, !0), Y({
          name: F,
          type: "pending",
          config: K.config
        });
        let H = await D1A(F, K.config);
        J(H)
      }
    }, [G.mcp.clients, Y, J, Z]);
  return {
    reconnectMcpServer: X,
    toggleMcpServer: V
  }
}
// @from(Start 13149380, End 13149548)
function gO3(A) {
  switch (A) {
    case "http":
      return "HTTP";
    case "ws":
    case "ws-ide":
      return "WebSocket";
    default:
      return "SSE"
  }
}
// @from(Start 13149553, End 13149555)
oE
// @from(Start 13149557, End 13149564)
hXA = 5
// @from(Start 13149568, End 13149578)
fO3 = 1000
// @from(Start 13149582, End 13149593)
hO3 = 30000
// @from(Start 13149599, End 13149719)
a09 = L(() => {
  _0();
  Ok();
  g1();
  z9();
  mu0();
  au0();
  tM();
  nX();
  V0();
  p09();
  oE = BA(VA(), 1)
})
// @from(Start 13149722, End 13149883)
function gXA() {
  let A = Tg.useContext(bJ0);
  if (!A) throw Error("useMcpReconnect must be used within MCPConnectionManager");
  return A.reconnectMcpServer
}
// @from(Start 13149885, End 13150047)
function uXA() {
  let A = Tg.useContext(bJ0);
  if (!A) throw Error("useMcpToggleEnabled must be used within MCPConnectionManager");
  return A.toggleMcpServer
}
// @from(Start 13150049, End 13150390)
function _Z1({
  children: A,
  dynamicMcpConfig: Q,
  isStrictMcpConfig: B,
  mcpCliEndpoint: G
}) {
  let {
    reconnectMcpServer: Z,
    toggleMcpServer: I
  } = n09(Q, B, G), Y = Tg.useMemo(() => ({
    reconnectMcpServer: Z,
    toggleMcpServer: I
  }), [Z, I]);
  return Tg.default.createElement(bJ0.Provider, {
    value: Y
  }, A)
}
// @from(Start 13150395, End 13150397)
Tg
// @from(Start 13150399, End 13150402)
bJ0
// @from(Start 13150408, End 13150484)
$QA = L(() => {
  a09();
  Tg = BA(VA(), 1), bJ0 = Tg.createContext(null)
})
// @from(Start 13150487, End 13150546)
function r09(A) {
  return A.id.startsWith("mcp-server-")
}
// @from(Start 13150548, End 13150748)
function rPA(A, Q, B) {
  if (Q < 0 || B.length === 0) return B.length > 0 ? 0 : -1;
  if (A.length === B.length && A.every((Z, I) => Z.id === B[I]?.id)) return Math.min(Q, B.length - 1);
  return 0
}
// @from(Start 13150750, End 13150869)
function o09(A) {
  let Q = A.metadata;
  return Q?.sessionId ? `/resume ${Q.sessionId}` : `/resume ${A.displayText}`
}
// @from(Start 13150871, End 13151038)
function t09(A) {
  if (A.isQuoted) return A.token.slice(2).replace(/"$/, "");
  else if (A.token.startsWith("@")) return A.token.substring(1);
  else return A.token
}
// @from(Start 13151040, End 13151346)
function fJ0(A) {
  let {
    displayText: Q,
    mode: B,
    hasAtPrefix: G,
    needsQuotes: Z,
    isQuoted: I,
    isComplete: Y
  } = A, J = Y ? " " : "";
  if (I || Z) return B === "bash" ? `"${Q}"${J}` : `@"${Q}"${J}`;
  else if (G) return B === "bash" ? `${Q}${J}` : `@${Q}${J}`;
  else return Q
}
// @from(Start 13151348, End 13151635)
function hJ0(A, Q, B, G, Z, I) {
  let W = Q.slice(0, B).lastIndexOf(" ") + 1,
    X;
  if (I === "variable") X = "$" + A.displayText + " ";
  else if (I === "command") X = A.displayText + " ";
  else X = A.displayText;
  let V = Q.slice(0, W) + X + Q.slice(B);
  G(V), Z(W + X.length)
}
// @from(Start 13151636, End 13151835)
async function uO3(A, Q) {
  try {
    if (kZ1) kZ1.abort();
    return kZ1 = new AbortController, await h09(A, Q, kZ1.signal)
  } catch {
    return GA("tengu_shell_completion_failed", {}), []
  }
}
// @from(Start 13151837, End 13152336)
function oPA(A, Q, B = !1) {
  if (!A) return null;
  let G = A.substring(0, Q);
  if (B) {
    let Y = /@"([^"]*)"?$/,
      J = G.match(Y);
    if (J && J.index !== void 0) return {
      token: J[0],
      startPos: J.index,
      isQuoted: !0
    }
  }
  let Z = B ? /(@[a-zA-Z0-9_\-./\\()[\]~]*|[a-zA-Z0-9_\-./\\()[\]~]+)$/ : /[a-zA-Z0-9_\-./\\()[\]~]+$/,
    I = G.match(Z);
  if (!I || I.index === void 0) return null;
  return {
    token: I[0],
    startPos: I.index,
    isQuoted: !1
  }
}
// @from(Start 13152338, End 13152579)
function mO3(A) {
  if (bXA(A)) {
    let Q = A.indexOf(" ");
    if (Q === -1) return {
      commandName: A.slice(1),
      args: ""
    };
    return {
      commandName: A.slice(1, Q),
      args: A.slice(Q + 1)
    }
  }
  return null
}
// @from(Start 13152581, End 13152654)
function dO3(A, Q) {
  return !A && Q.includes(" ") && !Q.endsWith(" ")
}
// @from(Start 13152656, End 13163681)
function e09({
  commands: A,
  onInputChange: Q,
  onSubmit: B,
  setCursorOffset: G,
  input: Z,
  cursorOffset: I,
  mode: Y,
  agents: J,
  setSuggestionsState: W,
  suggestionsState: {
    suggestions: X,
    selectedSuggestion: V,
    commandArgumentHint: F
  },
  suppressSuggestions: K = !1
}) {
  let {
    addNotification: D
  } = vZ(), [H, C] = sq.useState("none"), [E, U] = sq.useState(void 0), [q, w] = OQ(), N = uXA(), R = sq.useRef(I);
  R.current = I;
  let T = sq.useCallback(() => {
      W(() => ({
        commandArgumentHint: void 0,
        suggestions: [],
        selectedSuggestion: -1
      })), C("none"), U(void 0)
    }, [W]),
    y = sq.useCallback(async (l, k = !1) => {
      let m = await vJ0(l, q.mcp.resources, J, k, q.mcp.clients);
      if (m.length === 0) {
        W(() => ({
          commandArgumentHint: void 0,
          suggestions: [],
          selectedSuggestion: -1
        })), C("none"), U(void 0);
        return
      }
      W((o) => ({
        commandArgumentHint: void 0,
        suggestions: m,
        selectedSuggestion: rPA(o.suggestions, o.selectedSuggestion, m)
      })), C(m.length > 0 ? "file" : "none"), U(void 0)
    }, [q.mcp.resources, q.mcp.clients, T, W, C, U, J]),
    v = qp(y, 200),
    x = sq.useCallback(async (l, k) => {
      let m = k ?? R.current;
      if (K) {
        v.cancel(), T();
        return
      }
      let o = l.substring(0, m).match(/(^|\s)@([a-zA-Z0-9_\-./\\()[\]~]*|"[^"]*"?)$/),
        IA = m === l.length && m > 0 && l.length > 0 && l[m - 1] === " ";
      if (Y === "prompt" && bXA(l) && m > 0) {
        let FA = mO3(l);
        if (FA && FA.commandName === "add-dir" && FA.args) {
          let {
            args: zA
          } = FA;
          if (zA.match(/\s+$/)) {
            v.cancel(), T();
            return
          }
          let NA = await S09(zA);
          if (NA.length > 0) {
            W((OA) => ({
              suggestions: NA,
              selectedSuggestion: rPA(OA.suggestions, OA.selectedSuggestion, NA),
              commandArgumentHint: void 0
            })), C("directory");
            return
          }
          v.cancel(), T();
          return
        }
        if (FA && FA.commandName === "resume" && FA.args !== void 0 && l.includes(" ")) {
          let {
            args: zA
          } = FA, OA = (await mXA(zA, {
            limit: 10
          })).map((mA) => {
            let wA = VP(mA);
            return {
              id: `resume-title-${wA}`,
              displayText: mA.customTitle,
              description: mzA(mA),
              metadata: {
                sessionId: wA
              }
            }
          });
          if (OA.length > 0) {
            W((mA) => ({
              suggestions: OA,
              selectedSuggestion: rPA(mA.suggestions, mA.selectedSuggestion, OA),
              commandArgumentHint: void 0
            })), C("custom-title");
            return
          }
          T();
          return
        }
      }
      if (Y === "prompt" && bXA(l) && m > 0 && !dO3(IA, l)) {
        let FA = T09(l, A),
          zA = void 0;
        if (l.length > 1) {
          let NA = l.endsWith(" ") ? l.slice(1, -1) : l.slice(1),
            OA = A.find((mA) => mA.userFacingName() === NA && mA.argumentHint);
          if (OA?.argumentHint) zA = OA.argumentHint
        }
        if (W((NA) => ({
            commandArgumentHint: zA,
            suggestions: FA,
            selectedSuggestion: rPA(NA.suggestions, NA.selectedSuggestion, FA)
          })), C(FA.length > 0 ? "command" : "none"), FA.length > 0) {
          let NA = Math.max(...FA.map((OA) => OA.displayText.length));
          U(NA + 5)
        }
        return
      }
      if (H === "command") v.cancel(), T();
      if (H === "custom-title") T();
      if (o) {
        let FA = oPA(l, m, !0);
        if (FA && FA.token.startsWith("@")) {
          let zA = t09(FA);
          v(zA, !0);
          return
        }
      }
      if (H === "file") {
        let FA = oPA(l, m, !0);
        if (FA) {
          let zA = t09(FA);
          v(zA, !1)
        } else v.cancel(), T()
      }
      if (H === "shell") {
        let FA = X[0]?.metadata?.inputSnapshot;
        if (Y !== "bash" || l !== FA) v.cancel(), T()
      }
    }, [H, A, W, T, v, Y, K]);
  sq.useEffect(() => {
    x(Z)
  }, [Z, x]);
  let p = sq.useCallback(async () => {
      if (X.length > 0) {
        v.cancel();
        let l = V === -1 ? 0 : V,
          k = X[l];
        if (k && r09(k)) return;
        if (H === "command" && l < X.length) {
          if (k) OJ0(k, !1, A, Q, G, B), T()
        } else if (H === "custom-title" && X.length > 0) {
          if (k) {
            let m = o09(k);
            Q(m), G(m.length), T()
          }
        } else if (H === "directory" && X.length > 0) {
          let m = X[l];
          if (m) {
            let o = Z.indexOf(" "),
              FA = Z.slice(0, o + 1) + m.id + "/";
            Q(FA), G(FA.length), W((zA) => ({
              ...zA,
              commandArgumentHint: void 0
            })), x(FA, FA.length)
          }
        } else if (H === "shell" && X.length > 0) {
          let m = X[l];
          if (m) {
            let o = m.metadata;
            hJ0(m, Z, I, Q, G, o?.completionType), T()
          }
        } else if (H === "file" && X.length > 0) {
          let m = oPA(Z, I, !0);
          if (!m) {
            T();
            return
          }
          let o = y09(X),
            IA = m.token.startsWith("@"),
            FA;
          if (m.isQuoted) FA = m.token.slice(2).replace(/"$/, "").length;
          else if (IA) FA = m.token.length - 1;
          else FA = m.token.length;
          if (o.length > FA) {
            let zA = fJ0({
              displayText: o,
              mode: Y,
              hasAtPrefix: IA,
              needsQuotes: !1,
              isQuoted: m.isQuoted,
              isComplete: !1
            });
            SZ1(zA, Z, m.token, m.startPos, Q, G), x(Z.replace(m.token, zA), I)
          } else if (l < X.length) {
            let zA = X[l];
            if (zA) {
              let NA = zA.displayText.includes(" "),
                OA = fJ0({
                  displayText: zA.displayText,
                  mode: Y,
                  hasAtPrefix: IA,
                  needsQuotes: NA,
                  isQuoted: m.isQuoted,
                  isComplete: !0
                });
              SZ1(OA, Z, m.token, m.startPos, Q, G), T()
            }
          }
        }
      } else if (Z.trim() !== "") {
        let l, k;
        if (Y === "bash") {
          l = "shell";
          let m = await uO3(Z, I);
          if (m.length === 1) {
            let o = m[0];
            if (o) {
              let IA = o.metadata;
              hJ0(o, Z, I, Q, G, IA?.completionType)
            }
            k = []
          } else k = m
        } else {
          l = "file";
          let m = oPA(Z, I, !0);
          if (m) {
            let o = m.token.startsWith("@"),
              IA = o ? m.token.substring(1) : m.token;
            k = await vJ0(IA, q.mcp.resources, J, o, q.mcp.clients)
          } else k = []
        }
        if (k.length > 0) W((m) => ({
          commandArgumentHint: void 0,
          suggestions: k,
          selectedSuggestion: rPA(m.suggestions, m.selectedSuggestion, k)
        })), C(l), U(void 0)
      }
    }, [X, V, Z, H, A, Y, Q, G, B, T, I, x, q.mcp.resources, q.mcp.clients, W, J, v]),
    u = sq.useCallback(() => {
      if (V < 0 || X.length === 0) return;
      let l = X[V];
      if (l && r09(l)) {
        let k = l.metadata;
        if (k?.serverName) {
          let m = k.enabled;
          N(k.serverName);
          let o = m ? "disabled" : "enabled";
          D({
            key: `mcp-server-toggle-${k.serverName}`,
            jsx: YV.createElement($, null, "MCP server '", k.serverName, "' ", o, ". Use", " ", YV.createElement($, {
              color: "suggestion"
            }, "/mcp"), " to manage servers."),
            priority: "immediate",
            timeoutMs: 3000
          }), Q(""), G(0), v.cancel(), T()
        }
        return
      }
      if (H === "command" && V < X.length) {
        if (l) OJ0(l, !0, A, Q, G, B), v.cancel(), T()
      } else if (H === "custom-title" && V < X.length) {
        if (l) {
          let k = o09(l);
          Q(k), G(k.length), B(k, !0), v.cancel(), T()
        }
      } else if (H === "shell" && V < X.length) {
        let k = X[V];
        if (k) {
          let m = k.metadata;
          hJ0(k, Z, I, Q, G, m?.completionType), v.cancel(), T()
        }
      } else if (H === "file" && V < X.length) {
        let k = oPA(Z, I, !0);
        if (k) {
          if (l) {
            let m = k.token.startsWith("@"),
              o = l.displayText.includes(" "),
              IA = fJ0({
                displayText: l.displayText,
                mode: Y,
                hasAtPrefix: m,
                needsQuotes: o,
                isQuoted: k.isQuoted,
                isComplete: !0
              });
            SZ1(IA, Z, k.token, k.startPos, Q, G), v.cancel(), T()
          }
        }
      }
    }, [X, V, H, A, Z, I, Y, Q, G, B, T, N, D, v]),
    e = Ae(Z).level !== "none";
  return f1((l, k) => {
    if (k.tab && !k.shift) {
      if (X.length === 0 && Y !== "bash" && !Y0(process.env.MAX_THINKING_TOKENS)) {
        if (e) return;
        let m = !q.thinkingEnabled;
        w((o) => ({
          ...o,
          thinkingEnabled: m
        })), D({
          key: `toggled-thinking-${m?"on":"off"}`,
          invalidates: ["toggled-thinking-on", "toggled-thinking-off", "toggled-thinking-initial"],
          jsx: m ? YV.createElement(YV.Fragment, null, YV.createElement($, {
            color: "suggestion"
          }, "Thinking on"), YV.createElement($, {
            dimColor: !0
          }, " ", YV.createElement(E4, {
            shortcut: "tab",
            action: "toggle",
            parens: !0
          }))) : YV.createElement($, {
            dimColor: !0
          }, "Thinking off", " ", YV.createElement(E4, {
            shortcut: "tab",
            action: "toggle",
            parens: !0
          })),
          priority: "immediate",
          timeoutMs: 3000
        }), GA("tengu_thinking_toggled", {
          enabled: m
        })
      } else p();
      return
    }
    if (X.length === 0) return;
    if (k.downArrow || k.ctrl && l === "n") {
      W((m) => ({
        ...m,
        selectedSuggestion: m.selectedSuggestion >= X.length - 1 ? 0 : m.selectedSuggestion + 1
      }));
      return
    }
    if (k.upArrow || k.ctrl && l === "p") {
      W((m) => ({
        ...m,
        selectedSuggestion: m.selectedSuggestion <= 0 ? X.length - 1 : m.selectedSuggestion - 1
      }));
      return
    }
    if (k.return) u();
    if (k.escape) v.cancel(), T()
  }), {
    suggestions: X,
    selectedSuggestion: V,
    suggestionType: H,
    maxColumnWidth: E,
    commandArgumentHint: F
  }
}
// @from(Start 13163686, End 13163688)
sq
// @from(Start 13163690, End 13163692)
YV
// @from(Start 13163694, End 13163704)
kZ1 = null
// @from(Start 13163710, End 13163899)
AQ9 = L(() => {
  hA();
  P09();
  _09();
  S7();
  kJ0();
  g09();
  c09();
  JE();
  z9();
  q0();
  hQ();
  EU();
  hA();
  dF();
  $QA();
  CU();
  sq = BA(VA(), 1), YV = BA(VA(), 1)
})
// @from(Start 13163902, End 13178093)
function QQ9(A) {
  let [Q, B] = Ya.useState("INSERT"), G = Ya.default.useRef(""), Z = Ya.default.useRef(null), I = Ya.default.useRef(""), Y = Ya.default.useRef(""), J = Ya.default.useRef(null), W = FrA(A), X = (y, v) => {
    return y === v && (y === "d" || y === "c")
  }, V = (y, v) => {
    switch (y) {
      case "h":
        return v.left();
      case "l":
        return v.right();
      case "j":
        return v.downLogicalLine();
      case "k":
        return v.upLogicalLine();
      case "0":
        return v.startOfLogicalLine();
      case "^":
        return v.firstNonBlankInLogicalLine();
      case "$":
        return v.endOfLogicalLine();
      case "w":
        return v.nextWord();
      case "e":
        return v.endOfWord();
      case "b":
        return v.prevWord();
      case "W":
        return v.nextWORD();
      case "E":
        return v.endOfWORD();
      case "B":
        return v.prevWORD();
      case "gg":
        return v.startOfFirstLine();
      case "G":
        return v.startOfLastLine();
      default:
        return null
    }
  }, F = (y, v, x = 1) => {
    if (X(y, G.current)) return v.startOfLine();
    let p = v;
    for (let u = 0; u < x; u++) {
      if (!p) break;
      p = V(y, p)
    }
    return p
  }, K = (y, v, x, p = 1) => {
    let u = W.offset,
      e = y === "change";
    if (X(v, G.current)) {
      let k = x.startOfLogicalLine();
      if (x.text.indexOf(`
`) === -1) A.onChange(""), u = 0;
      else {
        let {
          line: m
        } = x.getPosition();
        if (y === "delete") {
          let o = x.text.split(`
`),
            IA = Math.min(p, o.length - m);
          o.splice(m, IA);
          let FA = o.join(`
`);
          A.onChange(FA), u = j7.fromText(FA, A.columns, m < o.length ? k.offset : Math.max(0, k.offset - 1)).offset
        } else if (y === "change") {
          let o = x.text.split(`
`);
          for (let IA = 0; IA < Math.min(p, o.length - m); IA++) o[m + IA] = "";
          A.onChange(o.join(`
`)), u = k.offset
        } else u = k.offset
      }
      return {
        newOffset: u,
        switchToInsert: e
      }
    }
    let l = F(v, x, p);
    if (!l || x.equals(l)) return {
      newOffset: u,
      switchToInsert: e
    };
    if (y === "move") u = l.offset;
    else {
      let [k, m] = x.offset <= l.offset ? [x, l] : [l, x], o = m;
      if (v === "e" && x.offset <= l.offset) o = m.right();
      else if ((v === "w" || v === "W") && y === "change") o = q(x, v, p);
      let IA = k.modifyText(o, "");
      if (A.onChange(IA.text), y === "change") u = k.offset;
      else u = IA.offset
    }
    return {
      newOffset: u,
      switchToInsert: e
    }
  }, D = (y) => {
    if (y !== void 0) W.setOffset(y);
    B("INSERT"), A.onModeChange?.("INSERT")
  }, H = () => {
    B("NORMAL"), A.onModeChange?.("NORMAL")
  }, C = (y) => {
    Z.current = y
  }, E = (y, v) => {
    if (v === "below") {
      let p = y.endOfLogicalLine().insert(`
`);
      return A.onChange(p.text), p.offset
    } else {
      let x = y.startOfLogicalLine(),
        p = x.insert(`
`);
      return A.onChange(p.text), x.offset
    }
  }, U = (y, v) => {
    let x = y.text[y.offset] ?? "";
    return v.test(x)
  }, q = (y, v, x) => {
    let u = v === "w" ? /\w/ : /\S/;
    if (!U(y, u)) return F(v, y, x) || y;
    let e = y;
    while (U(e, u) && !e.isAtEnd()) e = e.right();
    if (x > 1)
      for (let l = 1; l < x; l++) {
        while (!U(e, u) && !e.isAtEnd()) e = e.right();
        while (U(e, u) && !e.isAtEnd()) e = e.right()
      }
    return e
  }, w = (y, v, x, p, u = 1) => {
    let e = y.text,
      l = 0;
    if (x === "forward") {
      for (let k = y.offset + 1; k < e.length; k++)
        if (e[k] === v) {
          if (l++, l === u) {
            let m = p ? Math.max(y.offset, k - 1) : k;
            return new j7(y.measuredText, m)
          }
        }
    } else
      for (let k = y.offset - 1; k >= 0; k--)
        if (e[k] === v) {
          if (l++, l === u) {
            let m = p ? Math.min(y.offset, k + 1) : k;
            return new j7(y.measuredText, m)
          }
        } return null
  }, N = (y) => {
    let v = Z.current;
    if (!v) return;
    switch (v.type) {
      case "delete":
        if (v.motion)
          if (v.motion.length === 2 && "fFtT".includes(v.motion[0])) {
            let x = v.motion[0],
              p = v.motion[1],
              u = x === "f" || x === "t" ? "forward" : "backward",
              e = x === "t" || x === "T",
              l = w(y, p, u, e, v.count || 1);
            if (l) {
              let k = y.offset <= l.offset,
                [m, o] = k ? [y, l] : [l, y],
                IA = o,
                FA = m;
              if (e) IA = o.right();
              else IA = o.right();
              let zA = FA.modifyText(IA, "");
              A.onChange(zA.text), W.setOffset(zA.offset)
            }
          } else {
            let {
              newOffset: x
            } = K("delete", v.motion, y, v.count || 1);
            W.setOffset(x)
          } break;
      case "change":
        if (v.motion)
          if (v.motion.length === 2 && "fFtT".includes(v.motion[0])) {
            let x = v.motion[0],
              p = v.motion[1],
              u = x === "f" || x === "t" ? "forward" : "backward",
              e = x === "t" || x === "T",
              l = w(y, p, u, e, v.count || 1);
            if (l) {
              let k = y.offset <= l.offset,
                [m, o] = k ? [y, l] : [l, y],
                IA = o,
                FA = m;
              if (e) IA = o.right();
              else IA = o.right();
              let zA = FA.modifyText(IA, "");
              A.onChange(zA.text), W.setOffset(FA.offset), D(FA.offset)
            }
          } else {
            let {
              newOffset: x
            } = K("change", v.motion, y, v.count || 1);
            W.setOffset(x), D(x)
          } break;
      case "insert":
        if (v.insertedText) {
          let x = y.insert(v.insertedText);
          A.onChange(x.text), W.setOffset(x.offset)
        }
        break;
      case "x": {
        let x = v.count || 1,
          p = y;
        for (let u = 0; u < x; u++)
          if (!p.equals(p.del())) p = p.del();
        A.onChange(p.text), W.setOffset(p.offset);
        break
      }
      case "o": {
        let x = E(y, "below");
        D(x);
        break
      }
      case "O": {
        let x = E(y, "above");
        D(x);
        break
      }
      case "replace":
        break;
      case "r": {
        if (v.replacementChar) {
          let x = v.count || 1,
            p = y;
          for (let u = 0; u < x; u++)
            if (p = p.modifyText(p.right(), v.replacementChar), u < x - 1) p = j7.fromText(p.text, A.columns, p.offset + 1);
          A.onChange(p.text), W.setOffset(y.offset)
        }
        break
      }
    }
  }, R = (y = !0) => {
    if (!Y.current) return 1;
    let v = parseInt(Y.current, 10);
    if (isNaN(v)) {
      if (y) Y.current = "";
      return 1
    }
    let x = Math.min(v, cO3);
    if (y) Y.current = "";
    return x
  };
  return {
    ...W,
    onInput: (y, v) => {
      let x = j7.fromText(A.value, A.columns, W.offset);
      if (v.ctrl) {
        W.onInput(y, v);
        return
      }
      if (v.escape && Q === "INSERT") {
        if (I.current) C({
          type: "insert",
          insertedText: I.current
        }), I.current = "";
        H();
        return
      }
      if (Q === "NORMAL" && J.current) {
        if (J.current === "change" && y === "c" || J.current === "delete" && y === "d") {
          let m = J.current,
            o = R(),
            {
              newOffset: IA
            } = K(m, y, x, o);
          if (W.setOffset(IA), C({
              type: m,
              motion: y,
              count: o
            }), J.current = null, G.current = "", m === "change") D(IA);
          return
        }
        if (G.current && "fFtT".includes(G.current)) {
          let m = G.current,
            o = R(!1),
            IA = m === "f" || m === "t" ? "forward" : "backward",
            FA = m === "t" || m === "T",
            zA = w(x, y, IA, FA, o || 1);
          if (zA) {
            let NA = J.current,
              OA = x.offset <= zA.offset,
              [mA, wA] = OA ? [x, zA] : [zA, x],
              qA = wA,
              KA = mA;
            if (FA) qA = wA.right();
            else qA = wA.right();
            let yA = KA.modifyText(qA, "");
            A.onChange(yA.text);
            let oA = NA === "change" ? KA.offset : yA.offset;
            if (W.setOffset(oA), C({
                type: NA,
                motion: m + y,
                count: o || 1
              }), NA === "change") D(oA)
          }
          J.current = null, G.current = "", Y.current = "";
          return
        }
        if ("fFtT".includes(y)) {
          G.current = y;
          return
        }
        if ("0123456789".includes(y)) {
          Y.current += y;
          return
        }
        let e = J.current,
          l = R(),
          {
            newOffset: k
          } = K(e, y, x, l);
        if (W.setOffset(k), C({
            type: e,
            motion: y,
            count: l
          }), J.current = null, G.current = "", e === "change") D(k);
        return
      }
      let p = (e, l, k) => {
          let {
            newOffset: m
          } = K(e, l, x, k || 1);
          if (W.setOffset(m), e !== "move") C({
            type: e,
            motion: l,
            count: k
          });
          if (e === "change") D(m);
          G.current = ""
        },
        u = (e) => {
          I.current = "", D(e.offset)
        };
      if (Q === "NORMAL" && G.current) {
        let e = G.current;
        switch (e) {
          case "d":
            if (y === "d") {
              let l = R();
              p("delete", y, l), J.current = null;
              return
            }
            return;
          case "c":
            if (y === "c") {
              let l = R();
              p("change", y, l), J.current = null;
              return
            }
            return;
          case "g":
            if (y === "g") {
              let l = R();
              p("move", "gg", l);
              return
            }
            break;
          case "r": {
            let l = R(),
              k = x;
            for (let m = 0; m < l; m++)
              if (k = k.modifyText(k.right(), y), m < l - 1) k = j7.fromText(k.text, A.columns, k.offset + 1);
            A.onChange(k.text), W.setOffset(x.offset), C({
              type: "r",
              replacementChar: y,
              count: l
            }), G.current = "";
            return
          }
          case "f":
          case "F":
          case "t":
          case "T": {
            let l = R(),
              o = w(x, y, e === "f" || e === "t" ? "forward" : "backward", e === "t" || e === "T", l);
            if (o) W.setOffset(o.offset);
            G.current = "";
            return
          }
        }
        G.current = ""
      }
      if (Q === "NORMAL") {
        if ("0123456789".includes(y)) {
          if (y === "0" && Y.current === "") {
            let {
              newOffset: e
            } = K("move", "0", x);
            W.setOffset(e);
            return
          }
          Y.current += y;
          return
        }
        switch (y) {
          case ".": {
            N(x);
            return
          }
          case "u": {
            if (A.onUndo) A.onUndo();
            return
          }
          case "i":
            Y.current = "", I.current = "", D();
            return;
          case "I": {
            Y.current = "", u(x.startOfLogicalLine());
            return
          }
          case "a": {
            Y.current = "", u(x.right());
            return
          }
          case "A": {
            Y.current = "", u(x.endOfLogicalLine());
            return
          }
          case "o": {
            Y.current = "";
            let e = E(x, "below");
            C({
              type: "o"
            }), I.current = "", D(e);
            return
          }
          case "O": {
            Y.current = "";
            let e = E(x, "above");
            C({
              type: "O"
            }), I.current = "", D(e);
            return
          }
          case "h":
          case "l":
          case "j":
          case "k":
          case "^":
          case "$":
          case "w":
          case "e":
          case "b":
          case "W":
          case "E":
          case "B":
          case "G": {
            let e = R();
            p("move", y, e);
            return
          }
          case "g": {
            G.current = "g";
            return
          }
          case "r": {
            G.current = "r";
            return
          }
          case "f":
          case "F":
          case "t":
          case "T": {
            G.current = y;
            return
          }
          case "x": {
            let e = R(),
              l = x;
            for (let k = 0; k < e; k++)
              if (!l.equals(l.del())) l = l.del();
            A.onChange(l.text), W.setOffset(l.offset), C({
              type: "x",
              count: e
            });
            return
          }
          case "d":
            G.current = "d", J.current = "delete";
            return;
          case "D": {
            let e = R();
            p("delete", "$", e);
            return
          }
          case "c":
            G.current = "c", J.current = "change";
            return;
          case "C": {
            let e = R();
            p("change", "$", e);
            return
          }
          case "?": {
            A.onChange("?");
            return
          }
        }
      }
      if (v.return) {
        W.onInput(y, v);
        return
      }
      if (Q === "INSERT") {
        if (v.backspace || v.delete) {
          if (I.current.length > 0) I.current = I.current.slice(0, -1)
        } else I.current += y;
        W.onInput(y, v)
      }
    },
    mode: Q,
    setMode: B
  }
}
// @from(Start 13178098, End 13178100)
Ya
// @from(Start 13178102, End 13178111)
cO3 = 1e4
// @from(Start 13178117, End 13178172)
BQ9 = L(() => {
  Um1();
  cu1();
  Ya = BA(VA(), 1)
})
// @from(Start 13178175, End 13179333)
function gJ0(A) {
  let [Q] = qB(), B = QQ9({
    value: A.value,
    onChange: A.onChange,
    onSubmit: A.onSubmit,
    onExit: A.onExit,
    onExitMessage: A.onExitMessage,
    onHistoryReset: A.onHistoryReset,
    onHistoryUp: A.onHistoryUp,
    onHistoryDown: A.onHistoryDown,
    focus: A.focus,
    mask: A.mask,
    multiline: A.multiline,
    cursorChar: A.showCursor ? " " : "",
    highlightPastedText: A.highlightPastedText,
    invert: tA.inverse,
    themeText: ZB("text", Q),
    columns: A.columns,
    onImagePaste: A.onImagePaste,
    disableCursorMovementForUpDownKeys: A.disableCursorMovementForUpDownKeys,
    externalOffset: A.cursorOffset,
    onOffsetChange: A.onChangeCursorOffset,
    onModeChange: A.onModeChange,
    isMessageLoading: A.isLoading,
    onUndo: A.onUndo
  }), {
    mode: G,
    setMode: Z
  } = B;
  return yZ1.default.useEffect(() => {
    if (A.initialMode && A.initialMode !== G) Z(A.initialMode)
  }, [A.initialMode, G, Z]), yZ1.default.createElement(S, {
    flexDirection: "column"
  }, yZ1.default.createElement(DrA, {
    inputState: B,
    terminalFocus: !0,
    highlights: A.highlights,
    ...A
  }))
}
// @from(Start 13179338, End 13179341)
yZ1
// @from(Start 13179347, End 13179419)
GQ9 = L(() => {
  hA();
  F9();
  BQ9();
  Mm1();
  yZ1 = BA(VA(), 1)
})
// @from(Start 13179422, End 13179475)
function dXA() {
  return N1().editorMode === "vim"
}
// @from(Start 13179477, End 13179737)
function ZQ9() {
  if (Ep.isEnabled() && d0.terminal === "Apple_Terminal" && yMB()) return "option + ⏎ for newline";
  if (Ep.isEnabled() && kMB()) return "shift + ⏎ for newline";
  return xMB() ? "\\⏎ for newline" : "backslash (\\) + return (⏎) for newline"
}
// @from(Start 13179742, End 13179784)
tPA = L(() => {
  r7A();
  jQ();
  c5()
})
// @from(Start 13179787, End 13179952)
function Ja() {
  let [{
    mainLoopModel: A,
    mainLoopModelForSession: Q
  }] = OQ();
  return IQ9.useMemo(() => {
    return UD(Q ?? A ?? cnA())
  }, [Q, A])
}
// @from(Start 13179957, End 13179960)
IQ9
// @from(Start 13179966, End 13180020)
ePA = L(() => {
  t2();
  z9();
  IQ9 = BA(VA(), 1)
})
// @from(Start 13180023, End 13180356)
function YQ9(A) {
  switch (A.mode) {
    case "default":
      return "acceptEdits";
    case "acceptEdits":
      return "plan";
    case "plan":
      return A.isBypassPermissionsModeAvailable ? "bypassPermissions" : "default";
    case "bypassPermissions":
      return "default";
    case "dontAsk":
      return "default"
  }
}