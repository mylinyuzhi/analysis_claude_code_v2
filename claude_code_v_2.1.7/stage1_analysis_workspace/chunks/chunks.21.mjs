
// @from(Ln 51279, Col 4)
Az = U((s7Q) => {
  Object.defineProperty(s7Q, "__esModule", {
    value: !0
  });

  function clA(A) {
    return A && A.Math == Math ? A : void 0
  }
  var iR1 = typeof globalThis == "object" && clA(globalThis) || typeof window == "object" && clA(window) || typeof self == "object" && clA(self) || typeof global == "object" && clA(global) || function () {
    return this
  }() || {};

  function hJ4() {
    return iR1
  }

  function gJ4(A, Q, B) {
    let G = B || iR1,
      Z = G.__SENTRY__ = G.__SENTRY__ || {};
    return Z[A] || (Z[A] = Q())
  }
  s7Q.GLOBAL_OBJ = iR1;
  s7Q.getGlobalObject = hJ4;
  s7Q.getGlobalSingleton = gJ4
})
// @from(Ln 51304, Col 4)
nR1 = U((t7Q) => {
  Object.defineProperty(t7Q, "__esModule", {
    value: !0
  });
  var cJ4 = gM(),
    pJ4 = Az(),
    lGA = pJ4.getGlobalObject(),
    lJ4 = 80;

  function iJ4(A, Q = {}) {
    if (!A) return "<unknown>";
    try {
      let B = A,
        G = 5,
        Z = [],
        Y = 0,
        J = 0,
        X = " > ",
        I = X.length,
        D, W = Array.isArray(Q) ? Q : Q.keyAttrs,
        K = !Array.isArray(Q) && Q.maxStringLength || lJ4;
      while (B && Y++ < G) {
        if (D = nJ4(B, W), D === "html" || Y > 1 && J + Z.length * I + D.length >= K) break;
        Z.push(D), J += D.length, B = B.parentNode
      }
      return Z.reverse().join(X)
    } catch (B) {
      return "<unknown>"
    }
  }

  function nJ4(A, Q) {
    let B = A,
      G = [],
      Z, Y, J, X, I;
    if (!B || !B.tagName) return "";
    if (lGA.HTMLElement) {
      if (B instanceof HTMLElement && B.dataset && B.dataset.sentryComponent) return B.dataset.sentryComponent
    }
    G.push(B.tagName.toLowerCase());
    let D = Q && Q.length ? Q.filter((K) => B.getAttribute(K)).map((K) => [K, B.getAttribute(K)]) : null;
    if (D && D.length) D.forEach((K) => {
      G.push(`[${K[0]}="${K[1]}"]`)
    });
    else {
      if (B.id) G.push(`#${B.id}`);
      if (Z = B.className, Z && cJ4.isString(Z)) {
        Y = Z.split(/\s+/);
        for (I = 0; I < Y.length; I++) G.push(`.${Y[I]}`)
      }
    }
    let W = ["aria-label", "type", "name", "title", "alt"];
    for (I = 0; I < W.length; I++)
      if (J = W[I], X = B.getAttribute(J), X) G.push(`[${J}="${X}"]`);
    return G.join("")
  }

  function aJ4() {
    try {
      return lGA.document.location.href
    } catch (A) {
      return ""
    }
  }

  function oJ4(A) {
    if (lGA.document && lGA.document.querySelector) return lGA.document.querySelector(A);
    return null
  }

  function rJ4(A) {
    if (!lGA.HTMLElement) return null;
    let Q = A,
      B = 5;
    for (let G = 0; G < B; G++) {
      if (!Q) return null;
      if (Q instanceof HTMLElement && Q.dataset.sentryComponent) return Q.dataset.sentryComponent;
      Q = Q.parentNode
    }
    return null
  }
  t7Q.getComponentName = rJ4;
  t7Q.getDomElement = oJ4;
  t7Q.getLocationHref = aJ4;
  t7Q.htmlTreeAsString = iJ4
})
// @from(Ln 51390, Col 4)
oy = U((e7Q) => {
  Object.defineProperty(e7Q, "__esModule", {
    value: !0
  });
  var QX4 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  e7Q.DEBUG_BUILD = QX4
})
// @from(Ln 51397, Col 4)
LT = U((QGQ) => {
  Object.defineProperty(QGQ, "__esModule", {
    value: !0
  });
  var GX4 = oy(),
    aR1 = Az(),
    ZX4 = "Sentry Logger ",
    oR1 = ["debug", "info", "warn", "error", "log", "assert", "trace"],
    rR1 = {};

  function AGQ(A) {
    if (!("console" in aR1.GLOBAL_OBJ)) return A();
    let Q = aR1.GLOBAL_OBJ.console,
      B = {},
      G = Object.keys(rR1);
    G.forEach((Z) => {
      let Y = rR1[Z];
      B[Z] = Q[Z], Q[Z] = Y
    });
    try {
      return A()
    } finally {
      G.forEach((Z) => {
        Q[Z] = B[Z]
      })
    }
  }

  function YX4() {
    let A = !1,
      Q = {
        enable: () => {
          A = !0
        },
        disable: () => {
          A = !1
        },
        isEnabled: () => A
      };
    if (GX4.DEBUG_BUILD) oR1.forEach((B) => {
      Q[B] = (...G) => {
        if (A) AGQ(() => {
          aR1.GLOBAL_OBJ.console[B](`${ZX4}[${B}]:`, ...G)
        })
      }
    });
    else oR1.forEach((B) => {
      Q[B] = () => {
        return
      }
    });
    return Q
  }
  var JX4 = YX4();
  QGQ.CONSOLE_LEVELS = oR1;
  QGQ.consoleSandbox = AGQ;
  QGQ.logger = JX4;
  QGQ.originalConsoleMethods = rR1
})
// @from(Ln 51456, Col 4)
sR1 = U((ZGQ) => {
  Object.defineProperty(ZGQ, "__esModule", {
    value: !0
  });
  var KX4 = oy(),
    ZqA = LT(),
    VX4 = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;

  function FX4(A) {
    return A === "http" || A === "https"
  }

  function HX4(A, Q = !1) {
    let {
      host: B,
      path: G,
      pass: Z,
      port: Y,
      projectId: J,
      protocol: X,
      publicKey: I
    } = A;
    return `${X}://${I}${Q&&Z?`:${Z}`:""}@${B}${Y?`:${Y}`:""}/${G?`${G}/`:G}${J}`
  }

  function BGQ(A) {
    let Q = VX4.exec(A);
    if (!Q) {
      ZqA.consoleSandbox(() => {
        console.error(`Invalid Sentry Dsn: ${A}`)
      });
      return
    }
    let [B, G, Z = "", Y, J = "", X] = Q.slice(1), I = "", D = X, W = D.split("/");
    if (W.length > 1) I = W.slice(0, -1).join("/"), D = W.pop();
    if (D) {
      let K = D.match(/^\d+/);
      if (K) D = K[0]
    }
    return GGQ({
      host: Y,
      pass: Z,
      path: I,
      projectId: D,
      port: J,
      protocol: B,
      publicKey: G
    })
  }

  function GGQ(A) {
    return {
      protocol: A.protocol,
      publicKey: A.publicKey || "",
      pass: A.pass || "",
      host: A.host,
      port: A.port || "",
      path: A.path || "",
      projectId: A.projectId
    }
  }

  function EX4(A) {
    if (!KX4.DEBUG_BUILD) return !0;
    let {
      port: Q,
      projectId: B,
      protocol: G
    } = A;
    if (["protocol", "publicKey", "host", "projectId"].find((J) => {
        if (!A[J]) return ZqA.logger.error(`Invalid Sentry Dsn: ${J} missing`), !0;
        return !1
      })) return !1;
    if (!B.match(/^\d+$/)) return ZqA.logger.error(`Invalid Sentry Dsn: Invalid projectId ${B}`), !1;
    if (!FX4(G)) return ZqA.logger.error(`Invalid Sentry Dsn: Invalid protocol ${G}`), !1;
    if (Q && isNaN(parseInt(Q, 10))) return ZqA.logger.error(`Invalid Sentry Dsn: Invalid port ${Q}`), !1;
    return !0
  }

  function zX4(A) {
    let Q = typeof A === "string" ? BGQ(A) : GGQ(A);
    if (!Q || !EX4(Q)) return;
    return Q
  }
  ZGQ.dsnFromString = BGQ;
  ZGQ.dsnToString = HX4;
  ZGQ.makeDsn = zX4
})
// @from(Ln 51544, Col 4)
tR1 = U((JGQ) => {
  Object.defineProperty(JGQ, "__esModule", {
    value: !0
  });
  class YGQ extends Error {
    constructor(A, Q = "warn") {
      super(A);
      this.message = A, this.name = new.target.prototype.constructor.name, Object.setPrototypeOf(this, new.target.prototype), this.logLevel = Q
    }
  }
  JGQ.SentryError = YGQ
})
// @from(Ln 51556, Col 4)
uM = U((FGQ) => {
  Object.defineProperty(FGQ, "__esModule", {
    value: !0
  });
  var NX4 = nR1(),
    wX4 = oy(),
    iGA = gM(),
    LX4 = LT(),
    XGQ = GqA();

  function OX4(A, Q, B) {
    if (!(Q in A)) return;
    let G = A[Q],
      Z = B(G);
    if (typeof Z === "function") KGQ(Z, G);
    A[Q] = Z
  }

  function WGQ(A, Q, B) {
    try {
      Object.defineProperty(A, Q, {
        value: B,
        writable: !0,
        configurable: !0
      })
    } catch (G) {
      wX4.DEBUG_BUILD && LX4.logger.log(`Failed to add non-enumerable property "${Q}" to object`, A)
    }
  }

  function KGQ(A, Q) {
    try {
      let B = Q.prototype || {};
      A.prototype = Q.prototype = B, WGQ(A, "__sentry_original__", Q)
    } catch (B) {}
  }

  function MX4(A) {
    return A.__sentry_original__
  }

  function RX4(A) {
    return Object.keys(A).map((Q) => `${encodeURIComponent(Q)}=${encodeURIComponent(A[Q])}`).join("&")
  }

  function VGQ(A) {
    if (iGA.isError(A)) return {
      message: A.message,
      name: A.name,
      stack: A.stack,
      ...DGQ(A)
    };
    else if (iGA.isEvent(A)) {
      let Q = {
        type: A.type,
        target: IGQ(A.target),
        currentTarget: IGQ(A.currentTarget),
        ...DGQ(A)
      };
      if (typeof CustomEvent < "u" && iGA.isInstanceOf(A, CustomEvent)) Q.detail = A.detail;
      return Q
    } else return A
  }

  function IGQ(A) {
    try {
      return iGA.isElement(A) ? NX4.htmlTreeAsString(A) : Object.prototype.toString.call(A)
    } catch (Q) {
      return "<unknown>"
    }
  }

  function DGQ(A) {
    if (typeof A === "object" && A !== null) {
      let Q = {};
      for (let B in A)
        if (Object.prototype.hasOwnProperty.call(A, B)) Q[B] = A[B];
      return Q
    } else return {}
  }

  function _X4(A, Q = 40) {
    let B = Object.keys(VGQ(A));
    if (B.sort(), !B.length) return "[object has no keys]";
    if (B[0].length >= Q) return XGQ.truncate(B[0], Q);
    for (let G = B.length; G > 0; G--) {
      let Z = B.slice(0, G).join(", ");
      if (Z.length > Q) continue;
      if (G === B.length) return Z;
      return XGQ.truncate(Z, Q)
    }
    return ""
  }

  function jX4(A) {
    return eR1(A, new Map)
  }

  function eR1(A, Q) {
    if (TX4(A)) {
      let B = Q.get(A);
      if (B !== void 0) return B;
      let G = {};
      Q.set(A, G);
      for (let Z of Object.keys(A))
        if (typeof A[Z] < "u") G[Z] = eR1(A[Z], Q);
      return G
    }
    if (Array.isArray(A)) {
      let B = Q.get(A);
      if (B !== void 0) return B;
      let G = [];
      return Q.set(A, G), A.forEach((Z) => {
        G.push(eR1(Z, Q))
      }), G
    }
    return A
  }

  function TX4(A) {
    if (!iGA.isPlainObject(A)) return !1;
    try {
      let Q = Object.getPrototypeOf(A).constructor.name;
      return !Q || Q === "Object"
    } catch (Q) {
      return !0
    }
  }

  function PX4(A) {
    let Q;
    switch (!0) {
      case (A === void 0 || A === null):
        Q = new String(A);
        break;
      case (typeof A === "symbol" || typeof A === "bigint"):
        Q = Object(A);
        break;
      case iGA.isPrimitive(A):
        Q = new A.constructor(A);
        break;
      default:
        Q = A;
        break
    }
    return Q
  }
  FGQ.addNonEnumerableProperty = WGQ;
  FGQ.convertToPlainObject = VGQ;
  FGQ.dropUndefinedKeys = jX4;
  FGQ.extractExceptionKeysForMessage = _X4;
  FGQ.fill = OX4;
  FGQ.getOriginalFunction = MX4;
  FGQ.markFunctionWrapped = KGQ;
  FGQ.objectify = PX4;
  FGQ.urlEncode = RX4
})
// @from(Ln 51713, Col 4)
plA = U((EGQ) => {
  Object.defineProperty(EGQ, "__esModule", {
    value: !0
  });

  function HGQ(A, Q = !1) {
    return !(Q || A && !A.startsWith("/") && !A.match(/^[A-Z]:/) && !A.startsWith(".") && !A.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//)) && A !== void 0 && !A.includes("node_modules/")
  }

  function uX4(A) {
    let Q = /^\s*[-]{4,}$/,
      B = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
    return (G) => {
      let Z = G.match(B);
      if (Z) {
        let Y, J, X, I, D;
        if (Z[1]) {
          X = Z[1];
          let V = X.lastIndexOf(".");
          if (X[V - 1] === ".") V--;
          if (V > 0) {
            Y = X.slice(0, V), J = X.slice(V + 1);
            let F = Y.indexOf(".Module");
            if (F > 0) X = X.slice(F + 1), Y = Y.slice(0, F)
          }
          I = void 0
        }
        if (J) I = Y, D = J;
        if (J === "<anonymous>") D = void 0, X = void 0;
        if (X === void 0) D = D || "<anonymous>", X = I ? `${I}.${D}` : D;
        let W = Z[2] && Z[2].startsWith("file://") ? Z[2].slice(7) : Z[2],
          K = Z[5] === "native";
        if (W && W.match(/\/[A-Z]:/)) W = W.slice(1);
        if (!W && Z[5] && !K) W = Z[5];
        return {
          filename: W,
          module: A ? A(W) : void 0,
          function: X,
          lineno: parseInt(Z[3], 10) || void 0,
          colno: parseInt(Z[4], 10) || void 0,
          in_app: HGQ(W, K)
        }
      }
      if (G.match(Q)) return {
        filename: G
      };
      return
    }
  }
  EGQ.filenameIsInApp = HGQ;
  EGQ.node = uX4
})
// @from(Ln 51765, Col 4)
llA = U((wGQ) => {
  Object.defineProperty(wGQ, "__esModule", {
    value: !0
  });
  var CGQ = plA(),
    UGQ = 50,
    zGQ = /\(error: (.*)\)/,
    $GQ = /captureMessage|captureException/;

  function qGQ(...A) {
    let Q = A.sort((B, G) => B[0] - G[0]).map((B) => B[1]);
    return (B, G = 0) => {
      let Z = [],
        Y = B.split(`
`);
      for (let J = G; J < Y.length; J++) {
        let X = Y[J];
        if (X.length > 1024) continue;
        let I = zGQ.test(X) ? X.replace(zGQ, "$1") : X;
        if (I.match(/\S*Error: /)) continue;
        for (let D of Q) {
          let W = D(I);
          if (W) {
            Z.push(W);
            break
          }
        }
        if (Z.length >= UGQ) break
      }
      return NGQ(Z)
    }
  }

  function cX4(A) {
    if (Array.isArray(A)) return qGQ(...A);
    return A
  }

  function NGQ(A) {
    if (!A.length) return [];
    let Q = Array.from(A);
    if (/sentryWrapped/.test(Q[Q.length - 1].function || "")) Q.pop();
    if (Q.reverse(), $GQ.test(Q[Q.length - 1].function || "")) {
      if (Q.pop(), $GQ.test(Q[Q.length - 1].function || "")) Q.pop()
    }
    return Q.slice(0, UGQ).map((B) => ({
      ...B,
      filename: B.filename || Q[Q.length - 1].filename,
      function: B.function || "?"
    }))
  }
  var A_1 = "<anonymous>";

  function pX4(A) {
    try {
      if (!A || typeof A !== "function") return A_1;
      return A.name || A_1
    } catch (Q) {
      return A_1
    }
  }

  function lX4(A) {
    return [90, CGQ.node(A)]
  }
  wGQ.filenameIsInApp = CGQ.filenameIsInApp;
  wGQ.createStackParser = qGQ;
  wGQ.getFunctionName = pX4;
  wGQ.nodeStackLineParser = lX4;
  wGQ.stackParserFromStackParserOptions = cX4;
  wGQ.stripSentryFramesAndReverse = NGQ
})
// @from(Ln 51837, Col 4)
zg = U((OGQ) => {
  Object.defineProperty(OGQ, "__esModule", {
    value: !0
  });
  var tX4 = oy(),
    eX4 = LT(),
    AI4 = llA(),
    nGA = {},
    LGQ = {};

  function QI4(A, Q) {
    nGA[A] = nGA[A] || [], nGA[A].push(Q)
  }

  function BI4() {
    Object.keys(nGA).forEach((A) => {
      nGA[A] = void 0
    })
  }

  function GI4(A, Q) {
    if (!LGQ[A]) Q(), LGQ[A] = !0
  }

  function ZI4(A, Q) {
    let B = A && nGA[A];
    if (!B) return;
    for (let G of B) try {
      G(Q)
    } catch (Z) {
      tX4.DEBUG_BUILD && eX4.logger.error(`Error while triggering instrumentation handler.
Type: ${A}
Name: ${AI4.getFunctionName(G)}
Error:`, Z)
    }
  }
  OGQ.addHandler = QI4;
  OGQ.maybeInstrument = GI4;
  OGQ.resetInstrumentationHandlers = BI4;
  OGQ.triggerHandlers = ZI4
})
// @from(Ln 51878, Col 4)
G_1 = U((MGQ) => {
  Object.defineProperty(MGQ, "__esModule", {
    value: !0
  });
  var Q_1 = LT(),
    DI4 = uM(),
    ilA = Az(),
    B_1 = zg();

  function WI4(A) {
    B_1.addHandler("console", A), B_1.maybeInstrument("console", KI4)
  }

  function KI4() {
    if (!("console" in ilA.GLOBAL_OBJ)) return;
    Q_1.CONSOLE_LEVELS.forEach(function (A) {
      if (!(A in ilA.GLOBAL_OBJ.console)) return;
      DI4.fill(ilA.GLOBAL_OBJ.console, A, function (Q) {
        return Q_1.originalConsoleMethods[A] = Q,
          function (...B) {
            let G = {
              args: B,
              level: A
            };
            B_1.triggerHandlers("console", G);
            let Z = Q_1.originalConsoleMethods[A];
            Z && Z.apply(ilA.GLOBAL_OBJ.console, B)
          }
      })
    })
  }
  MGQ.addConsoleInstrumentationHandler = WI4
})
// @from(Ln 51911, Col 4)
YqA = U((_GQ) => {
  Object.defineProperty(_GQ, "__esModule", {
    value: !0
  });
  var FI4 = uM(),
    Z_1 = GqA(),
    HI4 = Az();

  function EI4() {
    let A = HI4.GLOBAL_OBJ,
      Q = A.crypto || A.msCrypto,
      B = () => Math.random() * 16;
    try {
      if (Q && Q.randomUUID) return Q.randomUUID().replace(/-/g, "");
      if (Q && Q.getRandomValues) B = () => {
        let G = new Uint8Array(1);
        return Q.getRandomValues(G), G[0]
      }
    } catch (G) {}
    return ([1e7] + 1000 + 4000 + 8000 + 100000000000).replace(/[018]/g, (G) => (G ^ (B() & 15) >> G / 4).toString(16))
  }

  function RGQ(A) {
    return A.exception && A.exception.values ? A.exception.values[0] : void 0
  }

  function zI4(A) {
    let {
      message: Q,
      event_id: B
    } = A;
    if (Q) return Q;
    let G = RGQ(A);
    if (G) {
      if (G.type && G.value) return `${G.type}: ${G.value}`;
      return G.type || G.value || B || "<unknown>"
    }
    return B || "<unknown>"
  }

  function $I4(A, Q, B) {
    let G = A.exception = A.exception || {},
      Z = G.values = G.values || [],
      Y = Z[0] = Z[0] || {};
    if (!Y.value) Y.value = Q || "";
    if (!Y.type) Y.type = B || "Error"
  }

  function CI4(A, Q) {
    let B = RGQ(A);
    if (!B) return;
    let G = {
        type: "generic",
        handled: !0
      },
      Z = B.mechanism;
    if (B.mechanism = {
        ...G,
        ...Z,
        ...Q
      }, Q && "data" in Q) {
      let Y = {
        ...Z && Z.data,
        ...Q.data
      };
      B.mechanism.data = Y
    }
  }
  var UI4 = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  function qI4(A) {
    let Q = A.match(UI4) || [],
      B = parseInt(Q[1], 10),
      G = parseInt(Q[2], 10),
      Z = parseInt(Q[3], 10);
    return {
      buildmetadata: Q[5],
      major: isNaN(B) ? void 0 : B,
      minor: isNaN(G) ? void 0 : G,
      patch: isNaN(Z) ? void 0 : Z,
      prerelease: Q[4]
    }
  }

  function NI4(A, Q, B = 5) {
    if (Q.lineno === void 0) return;
    let G = A.length,
      Z = Math.max(Math.min(G - 1, Q.lineno - 1), 0);
    Q.pre_context = A.slice(Math.max(0, Z - B), Z).map((Y) => Z_1.snipLine(Y, 0)), Q.context_line = Z_1.snipLine(A[Math.min(G - 1, Z)], Q.colno || 0), Q.post_context = A.slice(Math.min(Z + 1, G), Z + 1 + B).map((Y) => Z_1.snipLine(Y, 0))
  }

  function wI4(A) {
    if (A && A.__sentry_captured__) return !0;
    try {
      FI4.addNonEnumerableProperty(A, "__sentry_captured__", !0)
    } catch (Q) {}
    return !1
  }

  function LI4(A) {
    return Array.isArray(A) ? A : [A]
  }
  _GQ.addContextToFrame = NI4;
  _GQ.addExceptionMechanism = CI4;
  _GQ.addExceptionTypeValue = $I4;
  _GQ.arrayify = LI4;
  _GQ.checkOrSetAlreadyCaught = wI4;
  _GQ.getEventDescription = zI4;
  _GQ.parseSemver = qI4;
  _GQ.uuid4 = EI4
})
// @from(Ln 52022, Col 4)
I_1 = U((SGQ) => {
  Object.defineProperty(SGQ, "__esModule", {
    value: !0
  });
  var xI4 = YqA(),
    nlA = uM(),
    yI4 = Az(),
    Y_1 = zg(),
    aGA = yI4.GLOBAL_OBJ,
    vI4 = 1000,
    jGQ, J_1, X_1;

  function kI4(A) {
    Y_1.addHandler("dom", A), Y_1.maybeInstrument("dom", PGQ)
  }

  function PGQ() {
    if (!aGA.document) return;
    let A = Y_1.triggerHandlers.bind(null, "dom"),
      Q = TGQ(A, !0);
    aGA.document.addEventListener("click", Q, !1), aGA.document.addEventListener("keypress", Q, !1), ["EventTarget", "Node"].forEach((B) => {
      let G = aGA[B] && aGA[B].prototype;
      if (!G || !G.hasOwnProperty || !G.hasOwnProperty("addEventListener")) return;
      nlA.fill(G, "addEventListener", function (Z) {
        return function (Y, J, X) {
          if (Y === "click" || Y == "keypress") try {
            let I = this,
              D = I.__sentry_instrumentation_handlers__ = I.__sentry_instrumentation_handlers__ || {},
              W = D[Y] = D[Y] || {
                refCount: 0
              };
            if (!W.handler) {
              let K = TGQ(A);
              W.handler = K, Z.call(this, Y, K, X)
            }
            W.refCount++
          } catch (I) {}
          return Z.call(this, Y, J, X)
        }
      }), nlA.fill(G, "removeEventListener", function (Z) {
        return function (Y, J, X) {
          if (Y === "click" || Y == "keypress") try {
            let I = this,
              D = I.__sentry_instrumentation_handlers__ || {},
              W = D[Y];
            if (W) {
              if (W.refCount--, W.refCount <= 0) Z.call(this, Y, W.handler, X), W.handler = void 0, delete D[Y];
              if (Object.keys(D).length === 0) delete I.__sentry_instrumentation_handlers__
            }
          } catch (I) {}
          return Z.call(this, Y, J, X)
        }
      })
    })
  }

  function bI4(A) {
    if (A.type !== J_1) return !1;
    try {
      if (!A.target || A.target._sentryId !== X_1) return !1
    } catch (Q) {}
    return !0
  }

  function fI4(A, Q) {
    if (A !== "keypress") return !1;
    if (!Q || !Q.tagName) return !0;
    if (Q.tagName === "INPUT" || Q.tagName === "TEXTAREA" || Q.isContentEditable) return !1;
    return !0
  }

  function TGQ(A, Q = !1) {
    return (B) => {
      if (!B || B._sentryCaptured) return;
      let G = hI4(B);
      if (fI4(B.type, G)) return;
      if (nlA.addNonEnumerableProperty(B, "_sentryCaptured", !0), G && !G._sentryId) nlA.addNonEnumerableProperty(G, "_sentryId", xI4.uuid4());
      let Z = B.type === "keypress" ? "input" : B.type;
      if (!bI4(B)) A({
        event: B,
        name: Z,
        global: Q
      }), J_1 = B.type, X_1 = G ? G._sentryId : void 0;
      clearTimeout(jGQ), jGQ = aGA.setTimeout(() => {
        X_1 = void 0, J_1 = void 0
      }, vI4)
    }
  }

  function hI4(A) {
    try {
      return A.target
    } catch (Q) {
      return null
    }
  }
  SGQ.addClickKeypressInstrumentationHandler = kI4;
  SGQ.instrumentDOM = PGQ
})
// @from(Ln 52121, Col 4)
K_1 = U((xGQ) => {
  Object.defineProperty(xGQ, "__esModule", {
    value: !0
  });
  var mI4 = oy(),
    dI4 = LT(),
    cI4 = Az(),
    alA = cI4.getGlobalObject();

  function pI4() {
    try {
      return new ErrorEvent(""), !0
    } catch (A) {
      return !1
    }
  }

  function lI4() {
    try {
      return new DOMError(""), !0
    } catch (A) {
      return !1
    }
  }

  function iI4() {
    try {
      return new DOMException(""), !0
    } catch (A) {
      return !1
    }
  }

  function W_1() {
    if (!("fetch" in alA)) return !1;
    try {
      return new Request("http://www.example.com"), !0
    } catch (A) {
      return !1
    }
  }

  function D_1(A) {
    return A && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(A.toString())
  }

  function nI4() {
    if (typeof EdgeRuntime === "string") return !0;
    if (!W_1()) return !1;
    if (D_1(alA.fetch)) return !0;
    let A = !1,
      Q = alA.document;
    if (Q && typeof Q.createElement === "function") try {
      let B = Q.createElement("iframe");
      if (B.hidden = !0, Q.head.appendChild(B), B.contentWindow && B.contentWindow.fetch) A = D_1(B.contentWindow.fetch);
      Q.head.removeChild(B)
    } catch (B) {
      mI4.DEBUG_BUILD && dI4.logger.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", B)
    }
    return A
  }

  function aI4() {
    return "ReportingObserver" in alA
  }

  function oI4() {
    if (!W_1()) return !1;
    try {
      return new Request("_", {
        referrerPolicy: "origin"
      }), !0
    } catch (A) {
      return !1
    }
  }
  xGQ.isNativeFetch = D_1;
  xGQ.supportsDOMError = lI4;
  xGQ.supportsDOMException = iI4;
  xGQ.supportsErrorEvent = pI4;
  xGQ.supportsFetch = W_1;
  xGQ.supportsNativeFetch = nI4;
  xGQ.supportsReferrerPolicy = oI4;
  xGQ.supportsReportingObserver = aI4
})
// @from(Ln 52206, Col 4)
F_1 = U((bGQ) => {
  Object.defineProperty(bGQ, "__esModule", {
    value: !0
  });
  var ZD4 = uM(),
    YD4 = K_1(),
    yGQ = Az(),
    JqA = zg();

  function JD4(A) {
    JqA.addHandler("fetch", A), JqA.maybeInstrument("fetch", XD4)
  }

  function XD4() {
    if (!YD4.supportsNativeFetch()) return;
    ZD4.fill(yGQ.GLOBAL_OBJ, "fetch", function (A) {
      return function (...Q) {
        let {
          method: B,
          url: G
        } = kGQ(Q), Z = {
          args: Q,
          fetchData: {
            method: B,
            url: G
          },
          startTimestamp: Date.now()
        };
        return JqA.triggerHandlers("fetch", {
          ...Z
        }), A.apply(yGQ.GLOBAL_OBJ, Q).then((Y) => {
          let J = {
            ...Z,
            endTimestamp: Date.now(),
            response: Y
          };
          return JqA.triggerHandlers("fetch", J), Y
        }, (Y) => {
          let J = {
            ...Z,
            endTimestamp: Date.now(),
            error: Y
          };
          throw JqA.triggerHandlers("fetch", J), Y
        })
      }
    })
  }

  function V_1(A, Q) {
    return !!A && typeof A === "object" && !!A[Q]
  }

  function vGQ(A) {
    if (typeof A === "string") return A;
    if (!A) return "";
    if (V_1(A, "url")) return A.url;
    if (A.toString) return A.toString();
    return ""
  }

  function kGQ(A) {
    if (A.length === 0) return {
      method: "GET",
      url: ""
    };
    if (A.length === 2) {
      let [B, G] = A;
      return {
        url: vGQ(B),
        method: V_1(G, "method") ? String(G.method).toUpperCase() : "GET"
      }
    }
    let Q = A[0];
    return {
      url: vGQ(Q),
      method: V_1(Q, "method") ? String(Q.method).toUpperCase() : "GET"
    }
  }
  bGQ.addFetchInstrumentationHandler = JD4;
  bGQ.parseFetchArgs = kGQ
})
// @from(Ln 52288, Col 4)
z_1 = U((fGQ) => {
  Object.defineProperty(fGQ, "__esModule", {
    value: !0
  });
  var H_1 = Az(),
    E_1 = zg(),
    olA = null;

  function WD4(A) {
    E_1.addHandler("error", A), E_1.maybeInstrument("error", KD4)
  }

  function KD4() {
    olA = H_1.GLOBAL_OBJ.onerror, H_1.GLOBAL_OBJ.onerror = function (A, Q, B, G, Z) {
      let Y = {
        column: G,
        error: Z,
        line: B,
        msg: A,
        url: Q
      };
      if (E_1.triggerHandlers("error", Y), olA && !olA.__SENTRY_LOADER__) return olA.apply(this, arguments);
      return !1
    }, H_1.GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = !0
  }
  fGQ.addGlobalErrorInstrumentationHandler = WD4
})
// @from(Ln 52315, Col 4)
U_1 = U((hGQ) => {
  Object.defineProperty(hGQ, "__esModule", {
    value: !0
  });
  var $_1 = Az(),
    C_1 = zg(),
    rlA = null;

  function FD4(A) {
    C_1.addHandler("unhandledrejection", A), C_1.maybeInstrument("unhandledrejection", HD4)
  }

  function HD4() {
    rlA = $_1.GLOBAL_OBJ.onunhandledrejection, $_1.GLOBAL_OBJ.onunhandledrejection = function (A) {
      let Q = A;
      if (C_1.triggerHandlers("unhandledrejection", Q), rlA && !rlA.__SENTRY_LOADER__) return rlA.apply(this, arguments);
      return !0
    }, $_1.GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = !0
  }
  hGQ.addGlobalUnhandledRejectionInstrumentationHandler = FD4
})
// @from(Ln 52336, Col 4)
q_1 = U((gGQ) => {
  Object.defineProperty(gGQ, "__esModule", {
    value: !0
  });
  var zD4 = Az(),
    slA = zD4.getGlobalObject();

  function $D4() {
    let A = slA.chrome,
      Q = A && A.app && A.app.runtime,
      B = "history" in slA && !!slA.history.pushState && !!slA.history.replaceState;
    return !Q && B
  }
  gGQ.supportsHistory = $D4
})
// @from(Ln 52351, Col 4)
N_1 = U((mGQ) => {
  Object.defineProperty(mGQ, "__esModule", {
    value: !0
  });
  var uGQ = uM();
  oy();
  LT();
  var UD4 = Az(),
    qD4 = q_1(),
    elA = zg(),
    XqA = UD4.GLOBAL_OBJ,
    tlA;

  function ND4(A) {
    elA.addHandler("history", A), elA.maybeInstrument("history", wD4)
  }

  function wD4() {
    if (!qD4.supportsHistory()) return;
    let A = XqA.onpopstate;
    XqA.onpopstate = function (...B) {
      let G = XqA.location.href,
        Z = tlA;
      tlA = G;
      let Y = {
        from: Z,
        to: G
      };
      if (elA.triggerHandlers("history", Y), A) try {
        return A.apply(this, B)
      } catch (J) {}
    };

    function Q(B) {
      return function (...G) {
        let Z = G.length > 2 ? G[2] : void 0;
        if (Z) {
          let Y = tlA,
            J = String(Z);
          tlA = J;
          let X = {
            from: Y,
            to: J
          };
          elA.triggerHandlers("history", X)
        }
        return B.apply(this, G)
      }
    }
    uGQ.fill(XqA.history, "pushState", Q), uGQ.fill(XqA.history, "replaceState", Q)
  }
  mGQ.addHistoryInstrumentationHandler = ND4
})
// @from(Ln 52404, Col 4)
w_1 = U((cGQ) => {
  Object.defineProperty(cGQ, "__esModule", {
    value: !0
  });
  var QiA = gM(),
    AiA = uM(),
    OD4 = Az(),
    BiA = zg(),
    MD4 = OD4.GLOBAL_OBJ,
    IqA = "__sentry_xhr_v3__";

  function RD4(A) {
    BiA.addHandler("xhr", A), BiA.maybeInstrument("xhr", dGQ)
  }

  function dGQ() {
    if (!MD4.XMLHttpRequest) return;
    let A = XMLHttpRequest.prototype;
    AiA.fill(A, "open", function (Q) {
      return function (...B) {
        let G = Date.now(),
          Z = QiA.isString(B[0]) ? B[0].toUpperCase() : void 0,
          Y = _D4(B[1]);
        if (!Z || !Y) return Q.apply(this, B);
        if (this[IqA] = {
            method: Z,
            url: Y,
            request_headers: {}
          }, Z === "POST" && Y.match(/sentry_key/)) this.__sentry_own_request__ = !0;
        let J = () => {
          let X = this[IqA];
          if (!X) return;
          if (this.readyState === 4) {
            try {
              X.status_code = this.status
            } catch (D) {}
            let I = {
              args: [Z, Y],
              endTimestamp: Date.now(),
              startTimestamp: G,
              xhr: this
            };
            BiA.triggerHandlers("xhr", I)
          }
        };
        if ("onreadystatechange" in this && typeof this.onreadystatechange === "function") AiA.fill(this, "onreadystatechange", function (X) {
          return function (...I) {
            return J(), X.apply(this, I)
          }
        });
        else this.addEventListener("readystatechange", J);
        return AiA.fill(this, "setRequestHeader", function (X) {
          return function (...I) {
            let [D, W] = I, K = this[IqA];
            if (K && QiA.isString(D) && QiA.isString(W)) K.request_headers[D.toLowerCase()] = W;
            return X.apply(this, I)
          }
        }), Q.apply(this, B)
      }
    }), AiA.fill(A, "send", function (Q) {
      return function (...B) {
        let G = this[IqA];
        if (!G) return Q.apply(this, B);
        if (B[0] !== void 0) G.body = B[0];
        let Z = {
          args: [G.method, G.url],
          startTimestamp: Date.now(),
          xhr: this
        };
        return BiA.triggerHandlers("xhr", Z), Q.apply(this, B)
      }
    })
  }

  function _D4(A) {
    if (QiA.isString(A)) return A;
    try {
      return A.toString()
    } catch (Q) {}
    return
  }
  cGQ.SENTRY_XHR_DATA_KEY = IqA;
  cGQ.addXhrInstrumentationHandler = RD4;
  cGQ.instrumentXHR = dGQ
})
// @from(Ln 52489, Col 4)
sGQ = U((rGQ) => {
  Object.defineProperty(rGQ, "__esModule", {
    value: !0
  });
  var SD4 = oy(),
    xD4 = LT(),
    pGQ = G_1(),
    lGQ = I_1(),
    iGQ = F_1(),
    nGQ = z_1(),
    aGQ = U_1(),
    oGQ = N_1(),
    L_1 = w_1();

  function yD4(A, Q) {
    switch (A) {
      case "console":
        return pGQ.addConsoleInstrumentationHandler(Q);
      case "dom":
        return lGQ.addClickKeypressInstrumentationHandler(Q);
      case "xhr":
        return L_1.addXhrInstrumentationHandler(Q);
      case "fetch":
        return iGQ.addFetchInstrumentationHandler(Q);
      case "history":
        return oGQ.addHistoryInstrumentationHandler(Q);
      case "error":
        return nGQ.addGlobalErrorInstrumentationHandler(Q);
      case "unhandledrejection":
        return aGQ.addGlobalUnhandledRejectionInstrumentationHandler(Q);
      default:
        SD4.DEBUG_BUILD && xD4.logger.warn("unknown instrumentation type:", A)
    }
  }
  rGQ.addConsoleInstrumentationHandler = pGQ.addConsoleInstrumentationHandler;
  rGQ.addClickKeypressInstrumentationHandler = lGQ.addClickKeypressInstrumentationHandler;
  rGQ.addFetchInstrumentationHandler = iGQ.addFetchInstrumentationHandler;
  rGQ.addGlobalErrorInstrumentationHandler = nGQ.addGlobalErrorInstrumentationHandler;
  rGQ.addGlobalUnhandledRejectionInstrumentationHandler = aGQ.addGlobalUnhandledRejectionInstrumentationHandler;
  rGQ.addHistoryInstrumentationHandler = oGQ.addHistoryInstrumentationHandler;
  rGQ.SENTRY_XHR_DATA_KEY = L_1.SENTRY_XHR_DATA_KEY;
  rGQ.addXhrInstrumentationHandler = L_1.addXhrInstrumentationHandler;
  rGQ.addInstrumentationHandler = yD4
})
// @from(Ln 52533, Col 4)
O_1 = U((tGQ) => {
  Object.defineProperty(tGQ, "__esModule", {
    value: !0
  });

  function cD4() {
    return typeof __SENTRY_BROWSER_BUNDLE__ < "u" && !!__SENTRY_BROWSER_BUNDLE__
  }

  function pD4() {
    return "npm"
  }
  tGQ.getSDKSource = pD4;
  tGQ.isBrowserBundle = cD4
})
// @from(Ln 52548, Col 4)
M_1 = U((eGQ, ZiA) => {
  Object.defineProperty(eGQ, "__esModule", {
    value: !0
  });
  var nD4 = O_1();

  function aD4() {
    return !nD4.isBrowserBundle() && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]"
  }

  function GiA(A, Q) {
    return A.require(Q)
  }

  function oD4(A) {
    let Q;
    try {
      Q = GiA(ZiA, A)
    } catch (B) {}
    try {
      let {
        cwd: B
      } = GiA(ZiA, "process");
      Q = GiA(ZiA, `${B()}/node_modules/${A}`)
    } catch (B) {}
    return Q
  }
  eGQ.dynamicRequire = GiA;
  eGQ.isNodeEnv = aD4;
  eGQ.loadModule = oD4
})
// @from(Ln 52579, Col 4)
BZQ = U((QZQ) => {
  Object.defineProperty(QZQ, "__esModule", {
    value: !0
  });
  var eD4 = M_1(),
    AZQ = Az();

  function AW4() {
    return typeof window < "u" && (!eD4.isNodeEnv() || QW4())
  }

  function QW4() {
    return AZQ.GLOBAL_OBJ.process !== void 0 && AZQ.GLOBAL_OBJ.process.type === "renderer"
  }
  QZQ.isBrowser = AW4
})
// @from(Ln 52595, Col 4)
R_1 = U((GZQ) => {
  Object.defineProperty(GZQ, "__esModule", {
    value: !0
  });

  function GW4() {
    let A = typeof WeakSet === "function",
      Q = A ? new WeakSet : [];

    function B(Z) {
      if (A) {
        if (Q.has(Z)) return !0;
        return Q.add(Z), !1
      }
      for (let Y = 0; Y < Q.length; Y++)
        if (Q[Y] === Z) return !0;
      return Q.push(Z), !1
    }

    function G(Z) {
      if (A) Q.delete(Z);
      else
        for (let Y = 0; Y < Q.length; Y++)
          if (Q[Y] === Z) {
            Q.splice(Y, 1);
            break
          }
    }
    return [B, G]
  }
  GZQ.memoBuilder = GW4
})
// @from(Ln 52627, Col 4)
DqA = U((JZQ) => {
  Object.defineProperty(JZQ, "__esModule", {
    value: !0
  });
  var __1 = gM(),
    YW4 = R_1(),
    JW4 = uM(),
    XW4 = llA();

  function ZZQ(A, Q = 100, B = 1 / 0) {
    try {
      return YiA("", A, Q, B)
    } catch (G) {
      return {
        ERROR: `**non-serializable** (${G})`
      }
    }
  }

  function YZQ(A, Q = 3, B = 102400) {
    let G = ZZQ(A, Q);
    if (KW4(G) > B) return YZQ(A, Q - 1, B);
    return G
  }

  function YiA(A, Q, B = 1 / 0, G = 1 / 0, Z = YW4.memoBuilder()) {
    let [Y, J] = Z;
    if (Q == null || ["number", "boolean", "string"].includes(typeof Q) && !__1.isNaN(Q)) return Q;
    let X = IW4(A, Q);
    if (!X.startsWith("[object ")) return X;
    if (Q.__sentry_skip_normalization__) return Q;
    let I = typeof Q.__sentry_override_normalization_depth__ === "number" ? Q.__sentry_override_normalization_depth__ : B;
    if (I === 0) return X.replace("object ", "");
    if (Y(Q)) return "[Circular ~]";
    let D = Q;
    if (D && typeof D.toJSON === "function") try {
      let F = D.toJSON();
      return YiA("", F, I - 1, G, Z)
    } catch (F) {}
    let W = Array.isArray(Q) ? [] : {},
      K = 0,
      V = JW4.convertToPlainObject(Q);
    for (let F in V) {
      if (!Object.prototype.hasOwnProperty.call(V, F)) continue;
      if (K >= G) {
        W[F] = "[MaxProperties ~]";
        break
      }
      let H = V[F];
      W[F] = YiA(F, H, I - 1, G, Z), K++
    }
    return J(Q), W
  }

  function IW4(A, Q) {
    try {
      if (A === "domain" && Q && typeof Q === "object" && Q._events) return "[Domain]";
      if (A === "domainEmitter") return "[DomainEmitter]";
      if (typeof global < "u" && Q === global) return "[Global]";
      if (typeof window < "u" && Q === window) return "[Window]";
      if (typeof document < "u" && Q === document) return "[Document]";
      if (__1.isVueViewModel(Q)) return "[VueViewModel]";
      if (__1.isSyntheticEvent(Q)) return "[SyntheticEvent]";
      if (typeof Q === "number" && Q !== Q) return "[NaN]";
      if (typeof Q === "function") return `[Function: ${XW4.getFunctionName(Q)}]`;
      if (typeof Q === "symbol") return `[${String(Q)}]`;
      if (typeof Q === "bigint") return `[BigInt: ${String(Q)}]`;
      let B = DW4(Q);
      if (/^HTML(\w*)Element$/.test(B)) return `[HTMLElement: ${B}]`;
      return `[object ${B}]`
    } catch (B) {
      return `**non-serializable** (${B})`
    }
  }

  function DW4(A) {
    let Q = Object.getPrototypeOf(A);
    return Q ? Q.constructor.name : "null prototype"
  }

  function WW4(A) {
    return ~-encodeURI(A).split(/%..|./).length
  }

  function KW4(A) {
    return WW4(JSON.stringify(A))
  }

  function VW4(A, Q) {
    let B = Q.replace(/\\/g, "/").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"),
      G = A;
    try {
      G = decodeURI(A)
    } catch (Z) {}
    return G.replace(/\\/g, "/").replace(/webpack:\/?/g, "").replace(new RegExp(`(file://)?/*${B}/*`, "ig"), "app:///")
  }
  JZQ.normalize = ZZQ;
  JZQ.normalizeToSize = YZQ;
  JZQ.normalizeUrlToBase = VW4;
  JZQ.walk = YiA
})
// @from(Ln 52728, Col 4)
FZQ = U((VZQ) => {
  Object.defineProperty(VZQ, "__esModule", {
    value: !0
  });

  function IZQ(A, Q) {
    let B = 0;
    for (let G = A.length - 1; G >= 0; G--) {
      let Z = A[G];
      if (Z === ".") A.splice(G, 1);
      else if (Z === "..") A.splice(G, 1), B++;
      else if (B) A.splice(G, 1), B--
    }
    if (Q)
      for (; B--; B) A.unshift("..");
    return A
  }
  var $W4 = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;

  function DZQ(A) {
    let Q = A.length > 1024 ? `<truncated>${A.slice(-1024)}` : A,
      B = $W4.exec(Q);
    return B ? B.slice(1) : []
  }

  function j_1(...A) {
    let Q = "",
      B = !1;
    for (let G = A.length - 1; G >= -1 && !B; G--) {
      let Z = G >= 0 ? A[G] : "/";
      if (!Z) continue;
      Q = `${Z}/${Q}`, B = Z.charAt(0) === "/"
    }
    return Q = IZQ(Q.split("/").filter((G) => !!G), !B).join("/"), (B ? "/" : "") + Q || "."
  }

  function XZQ(A) {
    let Q = 0;
    for (; Q < A.length; Q++)
      if (A[Q] !== "") break;
    let B = A.length - 1;
    for (; B >= 0; B--)
      if (A[B] !== "") break;
    if (Q > B) return [];
    return A.slice(Q, B - Q + 1)
  }

  function CW4(A, Q) {
    A = j_1(A).slice(1), Q = j_1(Q).slice(1);
    let B = XZQ(A.split("/")),
      G = XZQ(Q.split("/")),
      Z = Math.min(B.length, G.length),
      Y = Z;
    for (let X = 0; X < Z; X++)
      if (B[X] !== G[X]) {
        Y = X;
        break
      } let J = [];
    for (let X = Y; X < B.length; X++) J.push("..");
    return J = J.concat(G.slice(Y)), J.join("/")
  }

  function WZQ(A) {
    let Q = KZQ(A),
      B = A.slice(-1) === "/",
      G = IZQ(A.split("/").filter((Z) => !!Z), !Q).join("/");
    if (!G && !Q) G = ".";
    if (G && B) G += "/";
    return (Q ? "/" : "") + G
  }

  function KZQ(A) {
    return A.charAt(0) === "/"
  }

  function UW4(...A) {
    return WZQ(A.join("/"))
  }

  function qW4(A) {
    let Q = DZQ(A),
      B = Q[0],
      G = Q[1];
    if (!B && !G) return ".";
    if (G) G = G.slice(0, G.length - 1);
    return B + G
  }

  function NW4(A, Q) {
    let B = DZQ(A)[2];
    if (Q && B.slice(Q.length * -1) === Q) B = B.slice(0, B.length - Q.length);
    return B
  }
  VZQ.basename = NW4;
  VZQ.dirname = qW4;
  VZQ.isAbsolute = KZQ;
  VZQ.join = UW4;
  VZQ.normalizePath = WZQ;
  VZQ.relative = CW4;
  VZQ.resolve = j_1
})
// @from(Ln 52829, Col 4)
T_1 = U((HZQ) => {
  Object.defineProperty(HZQ, "__esModule", {
    value: !0
  });
  var TW4 = gM(),
    $g;
  (function (A) {
    A[A.PENDING = 0] = "PENDING";
    let B = 1;
    A[A.RESOLVED = B] = "RESOLVED";
    let G = 2;
    A[A.REJECTED = G] = "REJECTED"
  })($g || ($g = {}));

  function PW4(A) {
    return new ry((Q) => {
      Q(A)
    })
  }

  function SW4(A) {
    return new ry((Q, B) => {
      B(A)
    })
  }
  class ry {
    constructor(A) {
      ry.prototype.__init.call(this), ry.prototype.__init2.call(this), ry.prototype.__init3.call(this), ry.prototype.__init4.call(this), this._state = $g.PENDING, this._handlers = [];
      try {
        A(this._resolve, this._reject)
      } catch (Q) {
        this._reject(Q)
      }
    }
    then(A, Q) {
      return new ry((B, G) => {
        this._handlers.push([!1, (Z) => {
          if (!A) B(Z);
          else try {
            B(A(Z))
          } catch (Y) {
            G(Y)
          }
        }, (Z) => {
          if (!Q) G(Z);
          else try {
            B(Q(Z))
          } catch (Y) {
            G(Y)
          }
        }]), this._executeHandlers()
      })
    } catch (A) {
      return this.then((Q) => Q, A)
    } finally(A) {
      return new ry((Q, B) => {
        let G, Z;
        return this.then((Y) => {
          if (Z = !1, G = Y, A) A()
        }, (Y) => {
          if (Z = !0, G = Y, A) A()
        }).then(() => {
          if (Z) {
            B(G);
            return
          }
          Q(G)
        })
      })
    }
    __init() {
      this._resolve = (A) => {
        this._setResult($g.RESOLVED, A)
      }
    }
    __init2() {
      this._reject = (A) => {
        this._setResult($g.REJECTED, A)
      }
    }
    __init3() {
      this._setResult = (A, Q) => {
        if (this._state !== $g.PENDING) return;
        if (TW4.isThenable(Q)) {
          Q.then(this._resolve, this._reject);
          return
        }
        this._state = A, this._value = Q, this._executeHandlers()
      }
    }
    __init4() {
      this._executeHandlers = () => {
        if (this._state === $g.PENDING) return;
        let A = this._handlers.slice();
        this._handlers = [], A.forEach((Q) => {
          if (Q[0]) return;
          if (this._state === $g.RESOLVED) Q[1](this._value);
          if (this._state === $g.REJECTED) Q[2](this._value);
          Q[0] = !0
        })
      }
    }
  }
  HZQ.SyncPromise = ry;
  HZQ.rejectedSyncPromise = SW4;
  HZQ.resolvedSyncPromise = PW4
})
// @from(Ln 52936, Col 4)
zZQ = U((EZQ) => {
  Object.defineProperty(EZQ, "__esModule", {
    value: !0
  });
  var kW4 = tR1(),
    P_1 = T_1();

  function bW4(A) {
    let Q = [];

    function B() {
      return A === void 0 || Q.length < A
    }

    function G(J) {
      return Q.splice(Q.indexOf(J), 1)[0]
    }

    function Z(J) {
      if (!B()) return P_1.rejectedSyncPromise(new kW4.SentryError("Not adding Promise because buffer limit was reached."));
      let X = J();
      if (Q.indexOf(X) === -1) Q.push(X);
      return X.then(() => G(X)).then(null, () => G(X).then(null, () => {})), X
    }

    function Y(J) {
      return new P_1.SyncPromise((X, I) => {
        let D = Q.length;
        if (!D) return X(!0);
        let W = setTimeout(() => {
          if (J && J > 0) X(!1)
        }, J);
        Q.forEach((K) => {
          P_1.resolvedSyncPromise(K).then(() => {
            if (!--D) clearTimeout(W), X(!0)
          }, I)
        })
      })
    }
    return {
      $: Q,
      add: Z,
      drain: Y
    }
  }
  EZQ.makePromiseBuffer = bW4
})
// @from(Ln 52983, Col 4)
CZQ = U(($ZQ) => {
  Object.defineProperty($ZQ, "__esModule", {
    value: !0
  });

  function hW4(A) {
    let Q = {},
      B = 0;
    while (B < A.length) {
      let G = A.indexOf("=", B);
      if (G === -1) break;
      let Z = A.indexOf(";", B);
      if (Z === -1) Z = A.length;
      else if (Z < G) {
        B = A.lastIndexOf(";", G - 1) + 1;
        continue
      }
      let Y = A.slice(B, G).trim();
      if (Q[Y] === void 0) {
        let J = A.slice(G + 1, Z).trim();
        if (J.charCodeAt(0) === 34) J = J.slice(1, -1);
        try {
          Q[Y] = J.indexOf("%") !== -1 ? decodeURIComponent(J) : J
        } catch (X) {
          Q[Y] = J
        }
      }
      B = Z + 1
    }
    return Q
  }
  $ZQ.parseCookie = hW4
})
// @from(Ln 53016, Col 4)
S_1 = U((UZQ) => {
  Object.defineProperty(UZQ, "__esModule", {
    value: !0
  });

  function uW4(A) {
    if (!A) return {};
    let Q = A.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!Q) return {};
    let B = Q[6] || "",
      G = Q[8] || "";
    return {
      host: Q[4],
      path: Q[5],
      protocol: Q[2],
      search: B,
      hash: G,
      relative: Q[5] + B + G
    }
  }

  function mW4(A) {
    return A.split(/[\?#]/, 1)[0]
  }

  function dW4(A) {
    return A.split(/\\?\//).filter((Q) => Q.length > 0 && Q !== ",").length
  }

  function cW4(A) {
    let {
      protocol: Q,
      host: B,
      path: G
    } = A, Z = B && B.replace(/^.*@/, "[filtered]:[filtered]@").replace(/(:80)$/, "").replace(/(:443)$/, "") || "";
    return `${Q?`${Q}://`:""}${Z}${G}`
  }
  UZQ.getNumberOfUrlSegments = dW4;
  UZQ.getSanitizedUrlString = cW4;
  UZQ.parseUrl = uW4;
  UZQ.stripUrlQueryAndFragment = mW4
})
// @from(Ln 53058, Col 4)
MZQ = U((OZQ) => {
  Object.defineProperty(OZQ, "__esModule", {
    value: !0
  });
  var aW4 = CZQ(),
    oW4 = oy(),
    qZQ = gM(),
    rW4 = LT(),
    sW4 = DqA(),
    tW4 = S_1(),
    eW4 = {
      ip: !1,
      request: !0,
      transaction: !0,
      user: !0
    },
    AK4 = ["cookies", "data", "headers", "method", "query_string", "url"],
    NZQ = ["id", "username", "email"];

  function QK4(A, Q, B) {
    if (!A) return;
    if (!A.metadata.source || A.metadata.source === "url") {
      let [G, Z] = JiA(Q, {
        path: !0,
        method: !0
      });
      A.updateName(G), A.setMetadata({
        source: Z
      })
    }
    if (A.setAttribute("url", Q.originalUrl || Q.url), Q.baseUrl) A.setAttribute("baseUrl", Q.baseUrl);
    A.setData("query", wZQ(Q, B))
  }

  function JiA(A, Q = {}) {
    let B = A.method && A.method.toUpperCase(),
      G = "",
      Z = "url";
    if (Q.customRoute || A.route) G = Q.customRoute || `${A.baseUrl||""}${A.route&&A.route.path}`, Z = "route";
    else if (A.originalUrl || A.url) G = tW4.stripUrlQueryAndFragment(A.originalUrl || A.url || "");
    let Y = "";
    if (Q.method && B) Y += B;
    if (Q.method && Q.path) Y += " ";
    if (Q.path && G) Y += G;
    return [Y, Z]
  }

  function BK4(A, Q) {
    switch (Q) {
      case "path":
        return JiA(A, {
          path: !0
        })[0];
      case "handler":
        return A.route && A.route.stack && A.route.stack[0] && A.route.stack[0].name || "<anonymous>";
      case "methodPath":
      default: {
        let B = A._reconstructedRoute ? A._reconstructedRoute : void 0;
        return JiA(A, {
          path: !0,
          method: !0,
          customRoute: B
        })[0]
      }
    }
  }

  function GK4(A, Q) {
    let B = {};
    return (Array.isArray(Q) ? Q : NZQ).forEach((Z) => {
      if (A && Z in A) B[Z] = A[Z]
    }), B
  }

  function x_1(A, Q) {
    let {
      include: B = AK4,
      deps: G
    } = Q || {}, Z = {}, Y = A.headers || {}, J = A.method, X = Y.host || A.hostname || A.host || "<no host>", I = A.protocol === "https" || A.socket && A.socket.encrypted ? "https" : "http", D = A.originalUrl || A.url || "", W = D.startsWith(I) ? D : `${I}://${X}${D}`;
    return B.forEach((K) => {
      switch (K) {
        case "headers": {
          if (Z.headers = Y, !B.includes("cookies")) delete Z.headers.cookie;
          break
        }
        case "method": {
          Z.method = J;
          break
        }
        case "url": {
          Z.url = W;
          break
        }
        case "cookies": {
          Z.cookies = A.cookies || Y.cookie && aW4.parseCookie(Y.cookie) || {};
          break
        }
        case "query_string": {
          Z.query_string = wZQ(A, G);
          break
        }
        case "data": {
          if (J === "GET" || J === "HEAD") break;
          if (A.body !== void 0) Z.data = qZQ.isString(A.body) ? A.body : JSON.stringify(sW4.normalize(A.body));
          break
        }
        default:
          if ({}.hasOwnProperty.call(A, K)) Z[K] = A[K]
      }
    }), Z
  }

  function ZK4(A, Q, B) {
    let G = {
      ...eW4,
      ...B && B.include
    };
    if (G.request) {
      let Z = Array.isArray(G.request) ? x_1(Q, {
        include: G.request,
        deps: B && B.deps
      }) : x_1(Q, {
        deps: B && B.deps
      });
      A.request = {
        ...A.request,
        ...Z
      }
    }
    if (G.user) {
      let Z = Q.user && qZQ.isPlainObject(Q.user) ? GK4(Q.user, G.user) : {};
      if (Object.keys(Z).length) A.user = {
        ...A.user,
        ...Z
      }
    }
    if (G.ip) {
      let Z = Q.ip || Q.socket && Q.socket.remoteAddress;
      if (Z) A.user = {
        ...A.user,
        ip_address: Z
      }
    }
    if (G.transaction && !A.transaction) A.transaction = BK4(Q, G.transaction);
    return A
  }

  function wZQ(A, Q) {
    let B = A.originalUrl || A.url || "";
    if (!B) return;
    if (B.startsWith("/")) B = `http://dogs.are.great${B}`;
    try {
      return A.query || typeof URL < "u" && new URL(B).search.slice(1) || Q && Q.url && Q.url.parse(B).query || void 0
    } catch (G) {
      return
    }
  }

  function LZQ(A) {
    let Q = {};
    try {
      A.forEach((B, G) => {
        if (typeof B === "string") Q[G] = B
      })
    } catch (B) {
      oW4.DEBUG_BUILD && rW4.logger.warn("Sentry failed extracting headers from a request object. If you see this, please file an issue.")
    }
    return Q
  }

  function YK4(A) {
    let Q = LZQ(A.headers);
    return {
      method: A.method,
      url: A.url,
      headers: Q
    }
  }
  OZQ.DEFAULT_USER_INCLUDES = NZQ;
  OZQ.addRequestDataToEvent = ZK4;
  OZQ.addRequestDataToTransaction = QK4;
  OZQ.extractPathForTransaction = JiA;
  OZQ.extractRequestData = x_1;
  OZQ.winterCGHeadersToDict = LZQ;
  OZQ.winterCGRequestToRequestData = YK4
})
// @from(Ln 53244, Col 4)
TZQ = U((jZQ) => {
  Object.defineProperty(jZQ, "__esModule", {
    value: !0
  });
  var RZQ = ["fatal", "error", "warning", "log", "info", "debug"];

  function FK4(A) {
    return _ZQ(A)
  }

  function _ZQ(A) {
    return A === "warn" ? "warning" : RZQ.includes(A) ? A : "log"
  }
  jZQ.severityFromString = FK4;
  jZQ.severityLevelFromString = _ZQ;
  jZQ.validSeverityLevels = RZQ
})
// @from(Ln 53261, Col 4)
y_1 = U((vZQ) => {
  Object.defineProperty(vZQ, "__esModule", {
    value: !0
  });
  var PZQ = Az(),
    SZQ = 1000;

  function xZQ() {
    return Date.now() / SZQ
  }

  function $K4() {
    let {
      performance: A
    } = PZQ.GLOBAL_OBJ;
    if (!A || !A.now) return xZQ;
    let Q = Date.now() - A.now(),
      B = A.timeOrigin == null ? Q : A.timeOrigin;
    return () => {
      return (B + A.now()) / SZQ
    }
  }
  var yZQ = $K4(),
    CK4 = yZQ;
  vZQ._browserPerformanceTimeOriginMode = void 0;
  var UK4 = (() => {
    let {
      performance: A
    } = PZQ.GLOBAL_OBJ;
    if (!A || !A.now) {
      vZQ._browserPerformanceTimeOriginMode = "none";
      return
    }
    let Q = 3600000,
      B = A.now(),
      G = Date.now(),
      Z = A.timeOrigin ? Math.abs(A.timeOrigin + B - G) : Q,
      Y = Z < Q,
      J = A.timing && A.timing.navigationStart,
      I = typeof J === "number" ? Math.abs(J + B - G) : Q,
      D = I < Q;
    if (Y || D)
      if (Z <= I) return vZQ._browserPerformanceTimeOriginMode = "timeOrigin", A.timeOrigin;
      else return vZQ._browserPerformanceTimeOriginMode = "navigationStart", J;
    return vZQ._browserPerformanceTimeOriginMode = "dateNow", G
  })();
  vZQ.browserPerformanceTimeOrigin = UK4;
  vZQ.dateTimestampInSeconds = xZQ;
  vZQ.timestampInSeconds = yZQ;
  vZQ.timestampWithMs = CK4
})
// @from(Ln 53312, Col 4)
k_1 = U((hZQ) => {
  Object.defineProperty(hZQ, "__esModule", {
    value: !0
  });
  var OK4 = oy(),
    MK4 = gM(),
    RK4 = LT(),
    _K4 = "baggage",
    v_1 = "sentry-",
    bZQ = /^sentry-/,
    fZQ = 8192;

  function jK4(A) {
    if (!MK4.isString(A) && !Array.isArray(A)) return;
    let Q = {};
    if (Array.isArray(A)) Q = A.reduce((G, Z) => {
      let Y = kZQ(Z);
      for (let J of Object.keys(Y)) G[J] = Y[J];
      return G
    }, {});
    else {
      if (!A) return;
      Q = kZQ(A)
    }
    let B = Object.entries(Q).reduce((G, [Z, Y]) => {
      if (Z.match(bZQ)) {
        let J = Z.slice(v_1.length);
        G[J] = Y
      }
      return G
    }, {});
    if (Object.keys(B).length > 0) return B;
    else return
  }

  function TK4(A) {
    if (!A) return;
    let Q = Object.entries(A).reduce((B, [G, Z]) => {
      if (Z) B[`${v_1}${G}`] = Z;
      return B
    }, {});
    return PK4(Q)
  }

  function kZQ(A) {
    return A.split(",").map((Q) => Q.split("=").map((B) => decodeURIComponent(B.trim()))).reduce((Q, [B, G]) => {
      return Q[B] = G, Q
    }, {})
  }

  function PK4(A) {
    if (Object.keys(A).length === 0) return;
    return Object.entries(A).reduce((Q, [B, G], Z) => {
      let Y = `${encodeURIComponent(B)}=${encodeURIComponent(G)}`,
        J = Z === 0 ? Y : `${Q},${Y}`;
      if (J.length > fZQ) return OK4.DEBUG_BUILD && RK4.logger.warn(`Not adding key: ${B} with val: ${G} to baggage header due to exceeding baggage size limits.`), Q;
      else return J
    }, "")
  }
  hZQ.BAGGAGE_HEADER_NAME = _K4;
  hZQ.MAX_BAGGAGE_STRING_LENGTH = fZQ;
  hZQ.SENTRY_BAGGAGE_KEY_PREFIX = v_1;
  hZQ.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = bZQ;
  hZQ.baggageHeaderToDynamicSamplingContext = jK4;
  hZQ.dynamicSamplingContextToSentryBaggageHeader = TK4
})
// @from(Ln 53378, Col 4)
dZQ = U((mZQ) => {
  Object.defineProperty(mZQ, "__esModule", {
    value: !0
  });
  var gZQ = k_1(),
    mM = YqA(),
    uZQ = new RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");

  function b_1(A) {
    if (!A) return;
    let Q = A.match(uZQ);
    if (!Q) return;
    let B;
    if (Q[3] === "1") B = !0;
    else if (Q[3] === "0") B = !1;
    return {
      traceId: Q[1],
      parentSampled: B,
      parentSpanId: Q[2]
    }
  }

  function fK4(A, Q) {
    let B = b_1(A),
      G = gZQ.baggageHeaderToDynamicSamplingContext(Q),
      {
        traceId: Z,
        parentSpanId: Y,
        parentSampled: J
      } = B || {};
    if (!B) return {
      traceparentData: B,
      dynamicSamplingContext: void 0,
      propagationContext: {
        traceId: Z || mM.uuid4(),
        spanId: mM.uuid4().substring(16)
      }
    };
    else return {
      traceparentData: B,
      dynamicSamplingContext: G || {},
      propagationContext: {
        traceId: Z || mM.uuid4(),
        parentSpanId: Y || mM.uuid4().substring(16),
        spanId: mM.uuid4().substring(16),
        sampled: J,
        dsc: G || {}
      }
    }
  }

  function hK4(A, Q) {
    let B = b_1(A),
      G = gZQ.baggageHeaderToDynamicSamplingContext(Q),
      {
        traceId: Z,
        parentSpanId: Y,
        parentSampled: J
      } = B || {};
    if (!B) return {
      traceId: Z || mM.uuid4(),
      spanId: mM.uuid4().substring(16)
    };
    else return {
      traceId: Z || mM.uuid4(),
      parentSpanId: Y || mM.uuid4().substring(16),
      spanId: mM.uuid4().substring(16),
      sampled: J,
      dsc: G || {}
    }
  }

  function gK4(A = mM.uuid4(), Q = mM.uuid4().substring(16), B) {
    let G = "";
    if (B !== void 0) G = B ? "-1" : "-0";
    return `${A}-${Q}${G}`
  }
  mZQ.TRACEPARENT_REGEXP = uZQ;
  mZQ.extractTraceparentData = b_1;
  mZQ.generateSentryTraceHeader = gK4;
  mZQ.propagationContextFromHeaders = hK4;
  mZQ.tracingContextFromHeaders = fK4
})
// @from(Ln 53461, Col 4)
h_1 = U((lZQ) => {
  Object.defineProperty(lZQ, "__esModule", {
    value: !0
  });
  var lK4 = sR1(),
    iK4 = DqA(),
    cZQ = uM();

  function nK4(A, Q = []) {
    return [A, Q]
  }

  function aK4(A, Q) {
    let [B, G] = A;
    return [B, [...G, Q]]
  }

  function pZQ(A, Q) {
    let B = A[1];
    for (let G of B) {
      let Z = G[0].type;
      if (Q(G, Z)) return !0
    }
    return !1
  }

  function oK4(A, Q) {
    return pZQ(A, (B, G) => Q.includes(G))
  }

  function f_1(A, Q) {
    return (Q || new TextEncoder).encode(A)
  }

  function rK4(A, Q) {
    let [B, G] = A, Z = JSON.stringify(B);

    function Y(J) {
      if (typeof Z === "string") Z = typeof J === "string" ? Z + J : [f_1(Z, Q), J];
      else Z.push(typeof J === "string" ? f_1(J, Q) : J)
    }
    for (let J of G) {
      let [X, I] = J;
      if (Y(`
${JSON.stringify(X)}
`), typeof I === "string" || I instanceof Uint8Array) Y(I);
      else {
        let D;
        try {
          D = JSON.stringify(I)
        } catch (W) {
          D = JSON.stringify(iK4.normalize(I))
        }
        Y(D)
      }
    }
    return typeof Z === "string" ? Z : sK4(Z)
  }

  function sK4(A) {
    let Q = A.reduce((Z, Y) => Z + Y.length, 0),
      B = new Uint8Array(Q),
      G = 0;
    for (let Z of A) B.set(Z, G), G += Z.length;
    return B
  }

  function tK4(A, Q, B) {
    let G = typeof A === "string" ? Q.encode(A) : A;

    function Z(I) {
      let D = G.subarray(0, I);
      return G = G.subarray(I + 1), D
    }

    function Y() {
      let I = G.indexOf(10);
      if (I < 0) I = G.length;
      return JSON.parse(B.decode(Z(I)))
    }
    let J = Y(),
      X = [];
    while (G.length) {
      let I = Y(),
        D = typeof I.length === "number" ? I.length : void 0;
      X.push([I, D ? Z(D) : Y()])
    }
    return [J, X]
  }

  function eK4(A, Q) {
    let B = typeof A.data === "string" ? f_1(A.data, Q) : A.data;
    return [cZQ.dropUndefinedKeys({
      type: "attachment",
      length: B.length,
      filename: A.filename,
      content_type: A.contentType,
      attachment_type: A.attachmentType
    }), B]
  }
  var AV4 = {
    session: "session",
    sessions: "session",
    attachment: "attachment",
    transaction: "transaction",
    event: "error",
    client_report: "internal",
    user_report: "default",
    profile: "profile",
    replay_event: "replay",
    replay_recording: "replay",
    check_in: "monitor",
    feedback: "feedback",
    span: "span",
    statsd: "metric_bucket"
  };

  function QV4(A) {
    return AV4[A]
  }

  function BV4(A) {
    if (!A || !A.sdk) return;
    let {
      name: Q,
      version: B
    } = A.sdk;
    return {
      name: Q,
      version: B
    }
  }

  function GV4(A, Q, B, G) {
    let Z = A.sdkProcessingMetadata && A.sdkProcessingMetadata.dynamicSamplingContext;
    return {
      event_id: A.event_id,
      sent_at: new Date().toISOString(),
      ...Q && {
        sdk: Q
      },
      ...!!B && G && {
        dsn: lK4.dsnToString(G)
      },
      ...Z && {
        trace: cZQ.dropUndefinedKeys({
          ...Z
        })
      }
    }
  }
  lZQ.addItemToEnvelope = aK4;
  lZQ.createAttachmentEnvelopeItem = eK4;
  lZQ.createEnvelope = nK4;
  lZQ.createEventEnvelopeHeaders = GV4;
  lZQ.envelopeContainsItemType = oK4;
  lZQ.envelopeItemTypeToDataCategory = QV4;
  lZQ.forEachEnvelopeItem = pZQ;
  lZQ.getSdkMetadataForEnvelopeHeader = BV4;
  lZQ.parseEnvelope = tK4;
  lZQ.serializeEnvelope = rK4
})
// @from(Ln 53623, Col 4)
nZQ = U((iZQ) => {
  Object.defineProperty(iZQ, "__esModule", {
    value: !0
  });
  var HV4 = h_1(),
    EV4 = y_1();

  function zV4(A, Q, B) {
    let G = [{
      type: "client_report"
    }, {
      timestamp: B || EV4.dateTimestampInSeconds(),
      discarded_events: A
    }];
    return HV4.createEnvelope(Q ? {
      dsn: Q
    } : {}, [G])
  }
  iZQ.createClientReportEnvelope = zV4
})
// @from(Ln 53643, Col 4)
tZQ = U((sZQ) => {
  Object.defineProperty(sZQ, "__esModule", {
    value: !0
  });
  var aZQ = 60000;

  function oZQ(A, Q = Date.now()) {
    let B = parseInt(`${A}`, 10);
    if (!isNaN(B)) return B * 1000;
    let G = Date.parse(`${A}`);
    if (!isNaN(G)) return G - Q;
    return aZQ
  }

  function rZQ(A, Q) {
    return A[Q] || A.all || 0
  }

  function CV4(A, Q, B = Date.now()) {
    return rZQ(A, Q) > B
  }

  function UV4(A, {
    statusCode: Q,
    headers: B
  }, G = Date.now()) {
    let Z = {
        ...A
      },
      Y = B && B["x-sentry-rate-limits"],
      J = B && B["retry-after"];
    if (Y)
      for (let X of Y.trim().split(",")) {
        let [I, D, , , W] = X.split(":", 5), K = parseInt(I, 10), V = (!isNaN(K) ? K : 60) * 1000;
        if (!D) Z.all = G + V;
        else
          for (let F of D.split(";"))
            if (F === "metric_bucket") {
              if (!W || W.split(";").includes("custom")) Z[F] = G + V
            } else Z[F] = G + V
      } else if (J) Z.all = G + oZQ(J, G);
      else if (Q === 429) Z.all = G + 60000;
    return Z
  }
  sZQ.DEFAULT_RETRY_AFTER = aZQ;
  sZQ.disabledUntil = rZQ;
  sZQ.isRateLimited = CV4;
  sZQ.parseRetryAfterHeader = oZQ;
  sZQ.updateRateLimits = UV4
})
// @from(Ln 53693, Col 4)
BYQ = U((QYQ) => {
  Object.defineProperty(QYQ, "__esModule", {
    value: !0
  });

  function eZQ(A, Q, B) {
    let G = Q.match(/([a-z_]+)\.(.*)/i);
    if (G === null) A[Q] = B;
    else {
      let Z = A[G[1]];
      eZQ(Z, G[2], B)
    }
  }

  function MV4(A, Q, B = {}) {
    return Array.isArray(Q) ? AYQ(A, Q, B) : RV4(A, Q, B)
  }

  function AYQ(A, Q, B) {
    let G = Q.find((Z) => Z.name === A.name);
    if (G) {
      for (let [Z, Y] of Object.entries(B)) eZQ(G, Z, Y);
      return Q
    }
    return [...Q, A]
  }

  function RV4(A, Q, B) {
    return (Z) => {
      let Y = Q(Z);
      if (A.allowExclusionByUser) {
        if (!Y.find((X) => X.name === A.name)) return Y
      }
      return AYQ(A, Y, B)
    }
  }
  QYQ.addOrUpdateIntegration = MV4
})
// @from(Ln 53731, Col 4)
ZYQ = U((GYQ) => {
  Object.defineProperty(GYQ, "__esModule", {
    value: !0
  });

  function jV4(A) {
    let Q = [],
      B = {};
    return {
      add(G, Z) {
        while (Q.length >= A) {
          let Y = Q.shift();
          if (Y !== void 0) delete B[Y]
        }
        if (B[G]) this.delete(G);
        Q.push(G), B[G] = Z
      },
      clear() {
        B = {}, Q = []
      },
      get(G) {
        return B[G]
      },
      size() {
        return Q.length
      },
      delete(G) {
        if (!B[G]) return !1;
        delete B[G];
        for (let Z = 0; Z < Q.length; Z++)
          if (Q[Z] === G) {
            Q.splice(Z, 1);
            break
          } return !0
      }
    }
  }
  GYQ.makeFifoCache = jV4
})
// @from(Ln 53770, Col 4)
IYQ = U((XYQ) => {
  Object.defineProperty(XYQ, "__esModule", {
    value: !0
  });
  var g_1 = gM(),
    YYQ = YqA(),
    PV4 = DqA(),
    SV4 = uM();

  function u_1(A, Q) {
    return A(Q.stack || "", 1)
  }

  function JYQ(A, Q) {
    let B = {
        type: Q.name || Q.constructor.name,
        value: Q.message
      },
      G = u_1(A, Q);
    if (G.length) B.stacktrace = {
      frames: G
    };
    return B
  }

  function xV4(A) {
    if ("name" in A && typeof A.name === "string") {
      let Q = `'${A.name}' captured as exception`;
      if ("message" in A && typeof A.message === "string") Q += ` with message '${A.message}'`;
      return Q
    } else if ("message" in A && typeof A.message === "string") return A.message;
    else return `Object captured as exception with keys: ${SV4.extractExceptionKeysForMessage(A)}`
  }

  function yV4(A, Q, B, G) {
    let Z = typeof A === "function" ? A().getClient() : A,
      Y = B,
      X = G && G.data && G.data.mechanism || {
        handled: !0,
        type: "generic"
      },
      I;
    if (!g_1.isError(B)) {
      if (g_1.isPlainObject(B)) {
        let W = Z && Z.getOptions().normalizeDepth;
        I = {
          ["__serialized__"]: PV4.normalizeToSize(B, W)
        };
        let K = xV4(B);
        Y = G && G.syntheticException || Error(K), Y.message = K
      } else Y = G && G.syntheticException || Error(B), Y.message = B;
      X.synthetic = !0
    }
    let D = {
      exception: {
        values: [JYQ(Q, Y)]
      }
    };
    if (I) D.extra = I;
    return YYQ.addExceptionTypeValue(D, void 0, void 0), YYQ.addExceptionMechanism(D, X), {
      ...D,
      event_id: G && G.event_id
    }
  }

  function vV4(A, Q, B = "info", G, Z) {
    let Y = {
      event_id: G && G.event_id,
      level: B
    };
    if (Z && G && G.syntheticException) {
      let J = u_1(A, G.syntheticException);
      if (J.length) Y.exception = {
        values: [{
          value: Q,
          stacktrace: {
            frames: J
          }
        }]
      }
    }
    if (g_1.isParameterizedString(Q)) {
      let {
        __sentry_template_string__: J,
        __sentry_template_values__: X
      } = Q;
      return Y.logentry = {
        message: J,
        params: X
      }, Y
    }
    return Y.message = Q, Y
  }
  XYQ.eventFromMessage = vV4;
  XYQ.eventFromUnknownInput = yV4;
  XYQ.exceptionFromError = JYQ;
  XYQ.parseStackFrames = u_1
})
// @from(Ln 53868, Col 4)
WYQ = U((DYQ) => {
  Object.defineProperty(DYQ, "__esModule", {
    value: !0
  });
  var gV4 = uM(),
    uV4 = plA();

  function mV4(A, Q, B, G) {
    let Z = A(),
      Y = !1,
      J = !0;
    return setInterval(() => {
      let X = Z.getTimeMs();
      if (Y === !1 && X > Q + B) {
        if (Y = !0, J) G()
      }
      if (X < Q + B) Y = !1
    }, 20), {
      poll: () => {
        Z.reset()
      },
      enabled: (X) => {
        J = X
      }
    }
  }

  function dV4(A, Q, B) {
    let G = Q ? Q.replace(/^file:\/\//, "") : void 0,
      Z = A.location.columnNumber ? A.location.columnNumber + 1 : void 0,
      Y = A.location.lineNumber ? A.location.lineNumber + 1 : void 0;
    return gV4.dropUndefinedKeys({
      filename: G,
      module: B(G),
      function: A.functionName || "?",
      colno: Z,
      lineno: Y,
      in_app: G ? uV4.filenameIsInApp(G) : void 0
    })
  }
  DYQ.callFrameToStackFrame = dV4;
  DYQ.watchdogTimer = mV4
})
// @from(Ln 53911, Col 4)
FYQ = U((VYQ) => {
  Object.defineProperty(VYQ, "__esModule", {
    value: !0
  });
  class KYQ {
    constructor(A) {
      this._maxSize = A, this._cache = new Map
    }
    get size() {
      return this._cache.size
    }
    get(A) {
      let Q = this._cache.get(A);
      if (Q === void 0) return;
      return this._cache.delete(A), this._cache.set(A, Q), Q
    }
    set(A, Q) {
      if (this._cache.size >= this._maxSize) this._cache.delete(this._cache.keys().next().value);
      this._cache.set(A, Q)
    }
    remove(A) {
      let Q = this._cache.get(A);
      if (Q) this._cache.delete(A);
      return Q
    }
    clear() {
      this._cache.clear()
    }
    keys() {
      return Array.from(this._cache.keys())
    }
    values() {
      let A = [];
      return this._cache.forEach((Q) => A.push(Q)), A
    }
  }
  VYQ.LRUMap = KYQ
})
// @from(Ln 53949, Col 4)
m_1 = U((HYQ) => {
  Object.defineProperty(HYQ, "__esModule", {
    value: !0
  });

  function iV4(A, Q) {
    return A != null ? A : Q()
  }
  HYQ._nullishCoalesce = iV4
})
// @from(Ln 53959, Col 4)
zYQ = U((EYQ) => {
  Object.defineProperty(EYQ, "__esModule", {
    value: !0
  });
  var aV4 = m_1();
  async function oV4(A, Q) {
    return aV4._nullishCoalesce(A, Q)
  }
  EYQ._asyncNullishCoalesce = oV4
})
// @from(Ln 53969, Col 4)
d_1 = U(($YQ) => {
  Object.defineProperty($YQ, "__esModule", {
    value: !0
  });
  async function sV4(A) {
    let Q = void 0,
      B = A[0],
      G = 1;
    while (G < A.length) {
      let Z = A[G],
        Y = A[G + 1];
      if (G += 2, (Z === "optionalAccess" || Z === "optionalCall") && B == null) return;
      if (Z === "access" || Z === "optionalAccess") Q = B, B = await Y(B);
      else if (Z === "call" || Z === "optionalCall") B = await Y((...J) => B.call(Q, ...J)), Q = void 0
    }
    return B
  }
  $YQ._asyncOptionalChain = sV4
})
// @from(Ln 53988, Col 4)
UYQ = U((CYQ) => {
  Object.defineProperty(CYQ, "__esModule", {
    value: !0
  });
  var eV4 = d_1();
  async function AF4(A) {
    let Q = await eV4._asyncOptionalChain(A);
    return Q == null ? !0 : Q
  }
  CYQ._asyncOptionalChainDelete = AF4
})
// @from(Ln 53999, Col 4)
c_1 = U((qYQ) => {
  Object.defineProperty(qYQ, "__esModule", {
    value: !0
  });

  function BF4(A) {
    let Q = void 0,
      B = A[0],
      G = 1;
    while (G < A.length) {
      let Z = A[G],
        Y = A[G + 1];
      if (G += 2, (Z === "optionalAccess" || Z === "optionalCall") && B == null) return;
      if (Z === "access" || Z === "optionalAccess") Q = B, B = Y(B);
      else if (Z === "call" || Z === "optionalCall") B = Y((...J) => B.call(Q, ...J)), Q = void 0
    }
    return B
  }
  qYQ._optionalChain = BF4
})
// @from(Ln 54019, Col 4)
wYQ = U((NYQ) => {
  Object.defineProperty(NYQ, "__esModule", {
    value: !0
  });
  var ZF4 = c_1();

  function YF4(A) {
    let Q = ZF4._optionalChain(A);
    return Q == null ? !0 : Q
  }
  NYQ._optionalChainDelete = YF4
})
// @from(Ln 54031, Col 4)
OYQ = U((LYQ) => {
  Object.defineProperty(LYQ, "__esModule", {
    value: !0
  });

  function XF4(A) {
    return A.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
  }
  LYQ.escapeStringForRegex = XF4
})
// @from(Ln 54041, Col 4)
CQ = U((o_1) => {
  Object.defineProperty(o_1, "__esModule", {
    value: !0
  });
  var DF4 = r7Q(),
    XiA = nR1(),
    p_1 = sR1(),
    WF4 = tR1(),
    l_1 = Az(),
    KF4 = sGQ(),
    Qz = gM(),
    VF4 = BZQ(),
    IiA = LT(),
    FF4 = R_1(),
    Ni = YqA(),
    i_1 = M_1(),
    DiA = DqA(),
    Cg = uM(),
    M1A = FZQ(),
    HF4 = zZQ(),
    R1A = MZQ(),
    n_1 = TZQ(),
    KqA = llA(),
    VqA = GqA(),
    wi = K_1(),
    a_1 = T_1(),
    FqA = y_1(),
    HqA = dZQ(),
    MYQ = O_1(),
    sy = h_1(),
    EF4 = nZQ(),
    EqA = tZQ(),
    oGA = k_1(),
    WiA = S_1(),
    zF4 = BYQ(),
    $F4 = ZYQ(),
    KiA = IYQ(),
    RYQ = WYQ(),
    CF4 = FYQ(),
    UF4 = zYQ(),
    qF4 = d_1(),
    NF4 = UYQ(),
    wF4 = m_1(),
    LF4 = c_1(),
    OF4 = wYQ(),
    MF4 = G_1(),
    RF4 = I_1(),
    _YQ = w_1(),
    _F4 = F_1(),
    jF4 = N_1(),
    TF4 = z_1(),
    PF4 = U_1(),
    SF4 = zg(),
    xF4 = plA(),
    yF4 = OYQ(),
    vF4 = q_1();
  o_1.applyAggregateErrorsToEvent = DF4.applyAggregateErrorsToEvent;
  o_1.getComponentName = XiA.getComponentName;
  o_1.getDomElement = XiA.getDomElement;
  o_1.getLocationHref = XiA.getLocationHref;
  o_1.htmlTreeAsString = XiA.htmlTreeAsString;
  o_1.dsnFromString = p_1.dsnFromString;
  o_1.dsnToString = p_1.dsnToString;
  o_1.makeDsn = p_1.makeDsn;
  o_1.SentryError = WF4.SentryError;
  o_1.GLOBAL_OBJ = l_1.GLOBAL_OBJ;
  o_1.getGlobalObject = l_1.getGlobalObject;
  o_1.getGlobalSingleton = l_1.getGlobalSingleton;
  o_1.addInstrumentationHandler = KF4.addInstrumentationHandler;
  o_1.isDOMError = Qz.isDOMError;
  o_1.isDOMException = Qz.isDOMException;
  o_1.isElement = Qz.isElement;
  o_1.isError = Qz.isError;
  o_1.isErrorEvent = Qz.isErrorEvent;
  o_1.isEvent = Qz.isEvent;
  o_1.isInstanceOf = Qz.isInstanceOf;
  o_1.isNaN = Qz.isNaN;
  o_1.isParameterizedString = Qz.isParameterizedString;
  o_1.isPlainObject = Qz.isPlainObject;
  o_1.isPrimitive = Qz.isPrimitive;
  o_1.isRegExp = Qz.isRegExp;
  o_1.isString = Qz.isString;
  o_1.isSyntheticEvent = Qz.isSyntheticEvent;
  o_1.isThenable = Qz.isThenable;
  o_1.isVueViewModel = Qz.isVueViewModel;
  o_1.isBrowser = VF4.isBrowser;
  o_1.CONSOLE_LEVELS = IiA.CONSOLE_LEVELS;
  o_1.consoleSandbox = IiA.consoleSandbox;
  o_1.logger = IiA.logger;
  o_1.originalConsoleMethods = IiA.originalConsoleMethods;
  o_1.memoBuilder = FF4.memoBuilder;
  o_1.addContextToFrame = Ni.addContextToFrame;
  o_1.addExceptionMechanism = Ni.addExceptionMechanism;
  o_1.addExceptionTypeValue = Ni.addExceptionTypeValue;
  o_1.arrayify = Ni.arrayify;
  o_1.checkOrSetAlreadyCaught = Ni.checkOrSetAlreadyCaught;
  o_1.getEventDescription = Ni.getEventDescription;
  o_1.parseSemver = Ni.parseSemver;
  o_1.uuid4 = Ni.uuid4;
  o_1.dynamicRequire = i_1.dynamicRequire;
  o_1.isNodeEnv = i_1.isNodeEnv;
  o_1.loadModule = i_1.loadModule;
  o_1.normalize = DiA.normalize;
  o_1.normalizeToSize = DiA.normalizeToSize;
  o_1.normalizeUrlToBase = DiA.normalizeUrlToBase;
  o_1.walk = DiA.walk;
  o_1.addNonEnumerableProperty = Cg.addNonEnumerableProperty;
  o_1.convertToPlainObject = Cg.convertToPlainObject;
  o_1.dropUndefinedKeys = Cg.dropUndefinedKeys;
  o_1.extractExceptionKeysForMessage = Cg.extractExceptionKeysForMessage;
  o_1.fill = Cg.fill;
  o_1.getOriginalFunction = Cg.getOriginalFunction;
  o_1.markFunctionWrapped = Cg.markFunctionWrapped;
  o_1.objectify = Cg.objectify;
  o_1.urlEncode = Cg.urlEncode;
  o_1.basename = M1A.basename;
  o_1.dirname = M1A.dirname;
  o_1.isAbsolute = M1A.isAbsolute;
  o_1.join = M1A.join;
  o_1.normalizePath = M1A.normalizePath;
  o_1.relative = M1A.relative;
  o_1.resolve = M1A.resolve;
  o_1.makePromiseBuffer = HF4.makePromiseBuffer;
  o_1.DEFAULT_USER_INCLUDES = R1A.DEFAULT_USER_INCLUDES;
  o_1.addRequestDataToEvent = R1A.addRequestDataToEvent;
  o_1.addRequestDataToTransaction = R1A.addRequestDataToTransaction;
  o_1.extractPathForTransaction = R1A.extractPathForTransaction;
  o_1.extractRequestData = R1A.extractRequestData;
  o_1.winterCGHeadersToDict = R1A.winterCGHeadersToDict;
  o_1.winterCGRequestToRequestData = R1A.winterCGRequestToRequestData;
  o_1.severityFromString = n_1.severityFromString;
  o_1.severityLevelFromString = n_1.severityLevelFromString;
  o_1.validSeverityLevels = n_1.validSeverityLevels;
  o_1.createStackParser = KqA.createStackParser;
  o_1.getFunctionName = KqA.getFunctionName;
  o_1.nodeStackLineParser = KqA.nodeStackLineParser;
  o_1.stackParserFromStackParserOptions = KqA.stackParserFromStackParserOptions;
  o_1.stripSentryFramesAndReverse = KqA.stripSentryFramesAndReverse;
  o_1.isMatchingPattern = VqA.isMatchingPattern;
  o_1.safeJoin = VqA.safeJoin;
  o_1.snipLine = VqA.snipLine;
  o_1.stringMatchesSomePattern = VqA.stringMatchesSomePattern;
  o_1.truncate = VqA.truncate;
  o_1.isNativeFetch = wi.isNativeFetch;
  o_1.supportsDOMError = wi.supportsDOMError;
  o_1.supportsDOMException = wi.supportsDOMException;
  o_1.supportsErrorEvent = wi.supportsErrorEvent;
  o_1.supportsFetch = wi.supportsFetch;
  o_1.supportsNativeFetch = wi.supportsNativeFetch;
  o_1.supportsReferrerPolicy = wi.supportsReferrerPolicy;
  o_1.supportsReportingObserver = wi.supportsReportingObserver;
  o_1.SyncPromise = a_1.SyncPromise;
  o_1.rejectedSyncPromise = a_1.rejectedSyncPromise;
  o_1.resolvedSyncPromise = a_1.resolvedSyncPromise;
  Object.defineProperty(o_1, "_browserPerformanceTimeOriginMode", {
    enumerable: !0,
    get: () => FqA._browserPerformanceTimeOriginMode
  });
  o_1.browserPerformanceTimeOrigin = FqA.browserPerformanceTimeOrigin;
  o_1.dateTimestampInSeconds = FqA.dateTimestampInSeconds;
  o_1.timestampInSeconds = FqA.timestampInSeconds;
  o_1.timestampWithMs = FqA.timestampWithMs;
  o_1.TRACEPARENT_REGEXP = HqA.TRACEPARENT_REGEXP;
  o_1.extractTraceparentData = HqA.extractTraceparentData;
  o_1.generateSentryTraceHeader = HqA.generateSentryTraceHeader;
  o_1.propagationContextFromHeaders = HqA.propagationContextFromHeaders;
  o_1.tracingContextFromHeaders = HqA.tracingContextFromHeaders;
  o_1.getSDKSource = MYQ.getSDKSource;
  o_1.isBrowserBundle = MYQ.isBrowserBundle;
  o_1.addItemToEnvelope = sy.addItemToEnvelope;
  o_1.createAttachmentEnvelopeItem = sy.createAttachmentEnvelopeItem;
  o_1.createEnvelope = sy.createEnvelope;
  o_1.createEventEnvelopeHeaders = sy.createEventEnvelopeHeaders;
  o_1.envelopeContainsItemType = sy.envelopeContainsItemType;
  o_1.envelopeItemTypeToDataCategory = sy.envelopeItemTypeToDataCategory;
  o_1.forEachEnvelopeItem = sy.forEachEnvelopeItem;
  o_1.getSdkMetadataForEnvelopeHeader = sy.getSdkMetadataForEnvelopeHeader;
  o_1.parseEnvelope = sy.parseEnvelope;
  o_1.serializeEnvelope = sy.serializeEnvelope;
  o_1.createClientReportEnvelope = EF4.createClientReportEnvelope;
  o_1.DEFAULT_RETRY_AFTER = EqA.DEFAULT_RETRY_AFTER;
  o_1.disabledUntil = EqA.disabledUntil;
  o_1.isRateLimited = EqA.isRateLimited;
  o_1.parseRetryAfterHeader = EqA.parseRetryAfterHeader;
  o_1.updateRateLimits = EqA.updateRateLimits;
  o_1.BAGGAGE_HEADER_NAME = oGA.BAGGAGE_HEADER_NAME;
  o_1.MAX_BAGGAGE_STRING_LENGTH = oGA.MAX_BAGGAGE_STRING_LENGTH;
  o_1.SENTRY_BAGGAGE_KEY_PREFIX = oGA.SENTRY_BAGGAGE_KEY_PREFIX;
  o_1.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = oGA.SENTRY_BAGGAGE_KEY_PREFIX_REGEX;
  o_1.baggageHeaderToDynamicSamplingContext = oGA.baggageHeaderToDynamicSamplingContext;
  o_1.dynamicSamplingContextToSentryBaggageHeader = oGA.dynamicSamplingContextToSentryBaggageHeader;
  o_1.getNumberOfUrlSegments = WiA.getNumberOfUrlSegments;
  o_1.getSanitizedUrlString = WiA.getSanitizedUrlString;
  o_1.parseUrl = WiA.parseUrl;
  o_1.stripUrlQueryAndFragment = WiA.stripUrlQueryAndFragment;
  o_1.addOrUpdateIntegration = zF4.addOrUpdateIntegration;
  o_1.makeFifoCache = $F4.makeFifoCache;
  o_1.eventFromMessage = KiA.eventFromMessage;
  o_1.eventFromUnknownInput = KiA.eventFromUnknownInput;
  o_1.exceptionFromError = KiA.exceptionFromError;
  o_1.parseStackFrames = KiA.parseStackFrames;
  o_1.callFrameToStackFrame = RYQ.callFrameToStackFrame;
  o_1.watchdogTimer = RYQ.watchdogTimer;
  o_1.LRUMap = CF4.LRUMap;
  o_1._asyncNullishCoalesce = UF4._asyncNullishCoalesce;
  o_1._asyncOptionalChain = qF4._asyncOptionalChain;
  o_1._asyncOptionalChainDelete = NF4._asyncOptionalChainDelete;
  o_1._nullishCoalesce = wF4._nullishCoalesce;
  o_1._optionalChain = LF4._optionalChain;
  o_1._optionalChainDelete = OF4._optionalChainDelete;
  o_1.addConsoleInstrumentationHandler = MF4.addConsoleInstrumentationHandler;
  o_1.addClickKeypressInstrumentationHandler = RF4.addClickKeypressInstrumentationHandler;
  o_1.SENTRY_XHR_DATA_KEY = _YQ.SENTRY_XHR_DATA_KEY;
  o_1.addXhrInstrumentationHandler = _YQ.addXhrInstrumentationHandler;
  o_1.addFetchInstrumentationHandler = _F4.addFetchInstrumentationHandler;
  o_1.addHistoryInstrumentationHandler = jF4.addHistoryInstrumentationHandler;
  o_1.addGlobalErrorInstrumentationHandler = TF4.addGlobalErrorInstrumentationHandler;
  o_1.addGlobalUnhandledRejectionInstrumentationHandler = PF4.addGlobalUnhandledRejectionInstrumentationHandler;
  o_1.resetInstrumentationHandlers = SF4.resetInstrumentationHandlers;
  o_1.filenameIsInApp = xF4.filenameIsInApp;
  o_1.escapeStringForRegex = yF4.escapeStringForRegex;
  o_1.supportsHistory = vF4.supportsHistory
})
// @from(Ln 54264, Col 4)
jW = U((jYQ) => {
  Object.defineProperty(jYQ, "__esModule", {
    value: !0
  });
  var kz4 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  jYQ.DEBUG_BUILD = kz4
})
// @from(Ln 54271, Col 4)
rGA = U((TYQ) => {
  Object.defineProperty(TYQ, "__esModule", {
    value: !0
  });
  var fz4 = "production";
  TYQ.DEFAULT_ENVIRONMENT = fz4
})
// @from(Ln 54278, Col 4)
zqA = U((SYQ) => {
  Object.defineProperty(SYQ, "__esModule", {
    value: !0
  });
  var ViA = CQ(),
    gz4 = jW();

  function PYQ() {
    return ViA.getGlobalSingleton("globalEventProcessors", () => [])
  }

  function uz4(A) {
    PYQ().push(A)
  }

  function r_1(A, Q, B, G = 0) {
    return new ViA.SyncPromise((Z, Y) => {
      let J = A[G];
      if (Q === null || typeof J !== "function") Z(Q);
      else {
        let X = J({
          ...Q
        }, B);
        if (gz4.DEBUG_BUILD && J.id && X === null && ViA.logger.log(`Event processor "${J.id}" dropped event`), ViA.isThenable(X)) X.then((I) => r_1(A, I, B, G + 1).then(Z)).then(null, Y);
        else r_1(A, X, B, G + 1).then(Z).then(null, Y)
      }
    })
  }
  SYQ.addGlobalEventProcessor = uz4;
  SYQ.getGlobalEventProcessors = PYQ;
  SYQ.notifyEventProcessors = r_1
})
// @from(Ln 54310, Col 4)
sGA = U((xYQ) => {
  Object.defineProperty(xYQ, "__esModule", {
    value: !0
  });
  var $qA = CQ();

  function pz4(A) {
    let Q = $qA.timestampInSeconds(),
      B = {
        sid: $qA.uuid4(),
        init: !0,
        timestamp: Q,
        started: Q,
        duration: 0,
        status: "ok",
        errors: 0,
        ignoreDuration: !1,
        toJSON: () => iz4(B)
      };
    if (A) s_1(B, A);
    return B
  }

  function s_1(A, Q = {}) {
    if (Q.user) {
      if (!A.ipAddress && Q.user.ip_address) A.ipAddress = Q.user.ip_address;
      if (!A.did && !Q.did) A.did = Q.user.id || Q.user.email || Q.user.username
    }
    if (A.timestamp = Q.timestamp || $qA.timestampInSeconds(), Q.abnormal_mechanism) A.abnormal_mechanism = Q.abnormal_mechanism;
    if (Q.ignoreDuration) A.ignoreDuration = Q.ignoreDuration;
    if (Q.sid) A.sid = Q.sid.length === 32 ? Q.sid : $qA.uuid4();
    if (Q.init !== void 0) A.init = Q.init;
    if (!A.did && Q.did) A.did = `${Q.did}`;
    if (typeof Q.started === "number") A.started = Q.started;
    if (A.ignoreDuration) A.duration = void 0;
    else if (typeof Q.duration === "number") A.duration = Q.duration;
    else {
      let B = A.timestamp - A.started;
      A.duration = B >= 0 ? B : 0
    }
    if (Q.release) A.release = Q.release;
    if (Q.environment) A.environment = Q.environment;
    if (!A.ipAddress && Q.ipAddress) A.ipAddress = Q.ipAddress;
    if (!A.userAgent && Q.userAgent) A.userAgent = Q.userAgent;
    if (typeof Q.errors === "number") A.errors = Q.errors;
    if (Q.status) A.status = Q.status
  }

  function lz4(A, Q) {
    let B = {};
    if (Q) B = {
      status: Q
    };
    else if (A.status === "ok") B = {
      status: "exited"
    };
    s_1(A, B)
  }

  function iz4(A) {
    return $qA.dropUndefinedKeys({
      sid: `${A.sid}`,
      init: A.init,
      started: new Date(A.started * 1000).toISOString(),
      timestamp: new Date(A.timestamp * 1000).toISOString(),
      status: A.status,
      errors: A.errors,
      did: typeof A.did === "number" || typeof A.did === "string" ? `${A.did}` : void 0,
      duration: A.duration,
      abnormal_mechanism: A.abnormal_mechanism,
      attrs: {
        release: A.release,
        environment: A.environment,
        ip_address: A.ipAddress,
        user_agent: A.userAgent
      }
    })
  }
  xYQ.closeSession = lz4;
  xYQ.makeSession = pz4;
  xYQ.updateSession = s_1
})
// @from(Ln 54392, Col 4)
Eq = U((fYQ) => {
  Object.defineProperty(fYQ, "__esModule", {
    value: !0
  });
  var t_1 = CQ(),
    rz4 = 0,
    vYQ = 1;

  function sz4(A) {
    let {
      spanId: Q,
      traceId: B
    } = A.spanContext(), {
      data: G,
      op: Z,
      parent_span_id: Y,
      status: J,
      tags: X,
      origin: I
    } = kYQ(A);
    return t_1.dropUndefinedKeys({
      data: G,
      op: Z,
      parent_span_id: Y,
      span_id: Q,
      status: J,
      tags: X,
      trace_id: B,
      origin: I
    })
  }

  function tz4(A) {
    let {
      traceId: Q,
      spanId: B
    } = A.spanContext(), G = bYQ(A);
    return t_1.generateSentryTraceHeader(Q, B, G)
  }

  function ez4(A) {
    if (typeof A === "number") return yYQ(A);
    if (Array.isArray(A)) return A[0] + A[1] / 1e9;
    if (A instanceof Date) return yYQ(A.getTime());
    return t_1.timestampInSeconds()
  }

  function yYQ(A) {
    return A > 9999999999 ? A / 1000 : A
  }

  function kYQ(A) {
    if (A$4(A)) return A.getSpanJSON();
    if (typeof A.toJSON === "function") return A.toJSON();
    return {}
  }

  function A$4(A) {
    return typeof A.getSpanJSON === "function"
  }

  function bYQ(A) {
    let {
      traceFlags: Q
    } = A.spanContext();
    return Boolean(Q & vYQ)
  }
  fYQ.TRACE_FLAG_NONE = rz4;
  fYQ.TRACE_FLAG_SAMPLED = vYQ;
  fYQ.spanIsSampled = bYQ;
  fYQ.spanTimeInputToSeconds = ez4;
  fYQ.spanToJSON = kYQ;
  fYQ.spanToTraceContext = sz4;
  fYQ.spanToTraceHeader = tz4
})
// @from(Ln 54467, Col 4)
FiA = U((dYQ) => {
  Object.defineProperty(dYQ, "__esModule", {
    value: !0
  });
  var ew = CQ(),
    I$4 = rGA(),
    hYQ = zqA(),
    Aj1 = EiA(),
    e_1 = HiA(),
    D$4 = Eq();

  function W$4(A, Q, B, G, Z, Y) {
    let {
      normalizeDepth: J = 3,
      normalizeMaxBreadth: X = 1000
    } = A, I = {
      ...Q,
      event_id: Q.event_id || B.event_id || ew.uuid4(),
      timestamp: Q.timestamp || ew.dateTimestampInSeconds()
    }, D = B.integrations || A.integrations.map((z) => z.name);
    if (K$4(I, A), V$4(I, D), Q.type === void 0) uYQ(I, A.stackParser);
    let W = H$4(G, B.captureContext);
    if (B.mechanism) ew.addExceptionMechanism(I, B.mechanism);
    let K = Z && Z.getEventProcessors ? Z.getEventProcessors() : [],
      V = Aj1.getGlobalScope().getScopeData();
    if (Y) {
      let z = Y.getScopeData();
      e_1.mergeScopeData(V, z)
    }
    if (W) {
      let z = W.getScopeData();
      e_1.mergeScopeData(V, z)
    }
    let F = [...B.attachments || [], ...V.attachments];
    if (F.length) B.attachments = F;
    e_1.applyScopeDataToEvent(I, V);
    let H = [...K, ...hYQ.getGlobalEventProcessors(), ...V.eventProcessors];
    return hYQ.notifyEventProcessors(H, I, B).then((z) => {
      if (z) mYQ(z);
      if (typeof J === "number" && J > 0) return F$4(z, J, X);
      return z
    })
  }

  function K$4(A, Q) {
    let {
      environment: B,
      release: G,
      dist: Z,
      maxValueLength: Y = 250
    } = Q;
    if (!("environment" in A)) A.environment = "environment" in Q ? B : I$4.DEFAULT_ENVIRONMENT;
    if (A.release === void 0 && G !== void 0) A.release = G;
    if (A.dist === void 0 && Z !== void 0) A.dist = Z;
    if (A.message) A.message = ew.truncate(A.message, Y);
    let J = A.exception && A.exception.values && A.exception.values[0];
    if (J && J.value) J.value = ew.truncate(J.value, Y);
    let X = A.request;
    if (X && X.url) X.url = ew.truncate(X.url, Y)
  }
  var gYQ = new WeakMap;

  function uYQ(A, Q) {
    let B = ew.GLOBAL_OBJ._sentryDebugIds;
    if (!B) return;
    let G, Z = gYQ.get(Q);
    if (Z) G = Z;
    else G = new Map, gYQ.set(Q, G);
    let Y = Object.keys(B).reduce((J, X) => {
      let I, D = G.get(X);
      if (D) I = D;
      else I = Q(X), G.set(X, I);
      for (let W = I.length - 1; W >= 0; W--) {
        let K = I[W];
        if (K.filename) {
          J[K.filename] = B[X];
          break
        }
      }
      return J
    }, {});
    try {
      A.exception.values.forEach((J) => {
        J.stacktrace.frames.forEach((X) => {
          if (X.filename) X.debug_id = Y[X.filename]
        })
      })
    } catch (J) {}
  }

  function mYQ(A) {
    let Q = {};
    try {
      A.exception.values.forEach((G) => {
        G.stacktrace.frames.forEach((Z) => {
          if (Z.debug_id) {
            if (Z.abs_path) Q[Z.abs_path] = Z.debug_id;
            else if (Z.filename) Q[Z.filename] = Z.debug_id;
            delete Z.debug_id
          }
        })
      })
    } catch (G) {}
    if (Object.keys(Q).length === 0) return;
    A.debug_meta = A.debug_meta || {}, A.debug_meta.images = A.debug_meta.images || [];
    let B = A.debug_meta.images;
    Object.keys(Q).forEach((G) => {
      B.push({
        type: "sourcemap",
        code_file: G,
        debug_id: Q[G]
      })
    })
  }

  function V$4(A, Q) {
    if (Q.length > 0) A.sdk = A.sdk || {}, A.sdk.integrations = [...A.sdk.integrations || [], ...Q]
  }

  function F$4(A, Q, B) {
    if (!A) return null;
    let G = {
      ...A,
      ...A.breadcrumbs && {
        breadcrumbs: A.breadcrumbs.map((Z) => ({
          ...Z,
          ...Z.data && {
            data: ew.normalize(Z.data, Q, B)
          }
        }))
      },
      ...A.user && {
        user: ew.normalize(A.user, Q, B)
      },
      ...A.contexts && {
        contexts: ew.normalize(A.contexts, Q, B)
      },
      ...A.extra && {
        extra: ew.normalize(A.extra, Q, B)
      }
    };
    if (A.contexts && A.contexts.trace && G.contexts) {
      if (G.contexts.trace = A.contexts.trace, A.contexts.trace.data) G.contexts.trace.data = ew.normalize(A.contexts.trace.data, Q, B)
    }
    if (A.spans) G.spans = A.spans.map((Z) => {
      let Y = D$4.spanToJSON(Z).data;
      if (Y) Z.data = ew.normalize(Y, Q, B);
      return Z
    });
    return G
  }

  function H$4(A, Q) {
    if (!Q) return A;
    let B = A ? A.clone() : new Aj1.Scope;
    return B.update(Q), B
  }

  function E$4(A) {
    if (!A) return;
    if (z$4(A)) return {
      captureContext: A
    };
    if (C$4(A)) return {
      captureContext: A
    };
    return A
  }

  function z$4(A) {
    return A instanceof Aj1.Scope || typeof A === "function"
  }
  var $$4 = ["user", "level", "extra", "contexts", "tags", "fingerprint", "requestSession", "propagationContext"];

  function C$4(A) {
    return Object.keys(A).some((Q) => $$4.includes(Q))
  }
  dYQ.applyDebugIds = uYQ;
  dYQ.applyDebugMeta = mYQ;
  dYQ.parseEventHintOrCaptureContext = E$4;
  dYQ.prepareEvent = W$4
})
// @from(Ln 54649, Col 4)
dM = U((lYQ) => {
  Object.defineProperty(lYQ, "__esModule", {
    value: !0
  });
  var Ug = CQ(),
    L$4 = rGA(),
    ziA = jW(),
    LD = ty(),
    Qj1 = sGA(),
    O$4 = FiA();

  function M$4(A, Q) {
    return LD.getCurrentHub().captureException(A, O$4.parseEventHintOrCaptureContext(Q))
  }

  function R$4(A, Q) {
    let B = typeof Q === "string" ? Q : void 0,
      G = typeof Q !== "string" ? {
        captureContext: Q
      } : void 0;
    return LD.getCurrentHub().captureMessage(A, B, G)
  }

  function _$4(A, Q) {
    return LD.getCurrentHub().captureEvent(A, Q)
  }

  function j$4(A) {
    LD.getCurrentHub().configureScope(A)
  }

  function T$4(A, Q) {
    LD.getCurrentHub().addBreadcrumb(A, Q)
  }

  function P$4(A, Q) {
    LD.getCurrentHub().setContext(A, Q)
  }

  function S$4(A) {
    LD.getCurrentHub().setExtras(A)
  }

  function x$4(A, Q) {
    LD.getCurrentHub().setExtra(A, Q)
  }

  function y$4(A) {
    LD.getCurrentHub().setTags(A)
  }

  function v$4(A, Q) {
    LD.getCurrentHub().setTag(A, Q)
  }

  function k$4(A) {
    LD.getCurrentHub().setUser(A)
  }

  function cYQ(...A) {
    let Q = LD.getCurrentHub();
    if (A.length === 2) {
      let [B, G] = A;
      if (!B) return Q.withScope(G);
      return Q.withScope(() => {
        return Q.getStackTop().scope = B, G(B)
      })
    }
    return Q.withScope(A[0])
  }

  function b$4(A) {
    return LD.runWithAsyncContext(() => {
      return A(LD.getIsolationScope())
    })
  }

  function f$4(A, Q) {
    return cYQ((B) => {
      return B.setSpan(A), Q(B)
    })
  }

  function h$4(A, Q) {
    return LD.getCurrentHub().startTransaction({
      ...A
    }, Q)
  }

  function Bj1(A, Q) {
    let B = CqA(),
      G = _1A();
    if (!G) ziA.DEBUG_BUILD && Ug.logger.warn("Cannot capture check-in. No client defined.");
    else if (!G.captureCheckIn) ziA.DEBUG_BUILD && Ug.logger.warn("Cannot capture check-in. Client does not support sending check-ins.");
    else return G.captureCheckIn(A, Q, B);
    return Ug.uuid4()
  }

  function g$4(A, Q, B) {
    let G = Bj1({
        monitorSlug: A,
        status: "in_progress"
      }, B),
      Z = Ug.timestampInSeconds();

    function Y(X) {
      Bj1({
        monitorSlug: A,
        status: X,
        checkInId: G,
        duration: Ug.timestampInSeconds() - Z
      })
    }
    let J;
    try {
      J = Q()
    } catch (X) {
      throw Y("error"), X
    }
    if (Ug.isThenable(J)) Promise.resolve(J).then(() => {
      Y("ok")
    }, () => {
      Y("error")
    });
    else Y("ok");
    return J
  }
  async function u$4(A) {
    let Q = _1A();
    if (Q) return Q.flush(A);
    return ziA.DEBUG_BUILD && Ug.logger.warn("Cannot flush events. No client defined."), Promise.resolve(!1)
  }
  async function m$4(A) {
    let Q = _1A();
    if (Q) return Q.close(A);
    return ziA.DEBUG_BUILD && Ug.logger.warn("Cannot flush events and disable SDK. No client defined."), Promise.resolve(!1)
  }

  function d$4() {
    return LD.getCurrentHub().lastEventId()
  }

  function _1A() {
    return LD.getCurrentHub().getClient()
  }

  function c$4() {
    return !!_1A()
  }

  function CqA() {
    return LD.getCurrentHub().getScope()
  }

  function p$4(A) {
    let Q = _1A(),
      B = LD.getIsolationScope(),
      G = CqA(),
      {
        release: Z,
        environment: Y = L$4.DEFAULT_ENVIRONMENT
      } = Q && Q.getOptions() || {},
      {
        userAgent: J
      } = Ug.GLOBAL_OBJ.navigator || {},
      X = Qj1.makeSession({
        release: Z,
        environment: Y,
        user: G.getUser() || B.getUser(),
        ...J && {
          userAgent: J
        },
        ...A
      }),
      I = B.getSession();
    if (I && I.status === "ok") Qj1.updateSession(I, {
      status: "exited"
    });
    return Gj1(), B.setSession(X), G.setSession(X), X
  }

  function Gj1() {
    let A = LD.getIsolationScope(),
      Q = CqA(),
      B = Q.getSession() || A.getSession();
    if (B) Qj1.closeSession(B);
    pYQ(), A.setSession(), Q.setSession()
  }

  function pYQ() {
    let A = LD.getIsolationScope(),
      Q = CqA(),
      B = _1A(),
      G = Q.getSession() || A.getSession();
    if (G && B && B.captureSession) B.captureSession(G)
  }

  function l$4(A = !1) {
    if (A) {
      Gj1();
      return
    }
    pYQ()
  }
  lYQ.addBreadcrumb = T$4;
  lYQ.captureCheckIn = Bj1;
  lYQ.captureEvent = _$4;
  lYQ.captureException = M$4;
  lYQ.captureMessage = R$4;
  lYQ.captureSession = l$4;
  lYQ.close = m$4;
  lYQ.configureScope = j$4;
  lYQ.endSession = Gj1;
  lYQ.flush = u$4;
  lYQ.getClient = _1A;
  lYQ.getCurrentScope = CqA;
  lYQ.isInitialized = c$4;
  lYQ.lastEventId = d$4;
  lYQ.setContext = P$4;
  lYQ.setExtra = x$4;
  lYQ.setExtras = S$4;
  lYQ.setTag = v$4;
  lYQ.setTags = y$4;
  lYQ.setUser = k$4;
  lYQ.startSession = p$4;
  lYQ.startTransaction = h$4;
  lYQ.withActiveSpan = f$4;
  lYQ.withIsolationScope = b$4;
  lYQ.withMonitor = g$4;
  lYQ.withScope = cYQ
})
// @from(Ln 54880, Col 4)
tGA = U((iYQ) => {
  Object.defineProperty(iYQ, "__esModule", {
    value: !0
  });

  function CC4(A) {
    return A.transaction
  }
  iYQ.getRootSpan = CC4
})
// @from(Ln 54890, Col 4)
j1A = U((oYQ) => {
  Object.defineProperty(oYQ, "__esModule", {
    value: !0
  });
  var qC4 = CQ(),
    NC4 = rGA(),
    nYQ = dM(),
    wC4 = tGA(),
    Zj1 = Eq();

  function aYQ(A, Q, B) {
    let G = Q.getOptions(),
      {
        publicKey: Z
      } = Q.getDsn() || {},
      {
        segment: Y
      } = B && B.getUser() || {},
      J = qC4.dropUndefinedKeys({
        environment: G.environment || NC4.DEFAULT_ENVIRONMENT,
        release: G.release,
        user_segment: Y,
        public_key: Z,
        trace_id: A
      });
    return Q.emit && Q.emit("createDsc", J), J
  }

  function LC4(A) {
    let Q = nYQ.getClient();
    if (!Q) return {};
    let B = aYQ(Zj1.spanToJSON(A).trace_id || "", Q, nYQ.getCurrentScope()),
      G = wC4.getRootSpan(A);
    if (!G) return B;
    let Z = G && G._frozenDynamicSamplingContext;
    if (Z) return Z;
    let {
      sampleRate: Y,
      source: J
    } = G.metadata;
    if (Y != null) B.sample_rate = `${Y}`;
    let X = Zj1.spanToJSON(G);
    if (J && J !== "url") B.transaction = X.description;
    return B.sampled = String(Zj1.spanIsSampled(G)), Q.emit && Q.emit("createDsc", B), B
  }
  oYQ.getDynamicSamplingContextFromClient = aYQ;
  oYQ.getDynamicSamplingContextFromSpan = LC4
})
// @from(Ln 54938, Col 4)
HiA = U((sYQ) => {
  Object.defineProperty(sYQ, "__esModule", {
    value: !0
  });
  var UqA = CQ(),
    RC4 = j1A(),
    _C4 = tGA(),
    rYQ = Eq();

  function jC4(A, Q) {
    let {
      fingerprint: B,
      span: G,
      breadcrumbs: Z,
      sdkProcessingMetadata: Y
    } = Q;
    if (PC4(A, Q), G) yC4(A, G);
    vC4(A, B), SC4(A, Z), xC4(A, Y)
  }

  function TC4(A, Q) {
    let {
      extra: B,
      tags: G,
      user: Z,
      contexts: Y,
      level: J,
      sdkProcessingMetadata: X,
      breadcrumbs: I,
      fingerprint: D,
      eventProcessors: W,
      attachments: K,
      propagationContext: V,
      transactionName: F,
      span: H
    } = Q;
    if (eGA(A, "extra", B), eGA(A, "tags", G), eGA(A, "user", Z), eGA(A, "contexts", Y), eGA(A, "sdkProcessingMetadata", X), J) A.level = J;
    if (F) A.transactionName = F;
    if (H) A.span = H;
    if (I.length) A.breadcrumbs = [...A.breadcrumbs, ...I];
    if (D.length) A.fingerprint = [...A.fingerprint, ...D];
    if (W.length) A.eventProcessors = [...A.eventProcessors, ...W];
    if (K.length) A.attachments = [...A.attachments, ...K];
    A.propagationContext = {
      ...A.propagationContext,
      ...V
    }
  }

  function eGA(A, Q, B) {
    if (B && Object.keys(B).length) {
      A[Q] = {
        ...A[Q]
      };
      for (let G in B)
        if (Object.prototype.hasOwnProperty.call(B, G)) A[Q][G] = B[G]
    }
  }

  function PC4(A, Q) {
    let {
      extra: B,
      tags: G,
      user: Z,
      contexts: Y,
      level: J,
      transactionName: X
    } = Q, I = UqA.dropUndefinedKeys(B);
    if (I && Object.keys(I).length) A.extra = {
      ...I,
      ...A.extra
    };
    let D = UqA.dropUndefinedKeys(G);
    if (D && Object.keys(D).length) A.tags = {
      ...D,
      ...A.tags
    };
    let W = UqA.dropUndefinedKeys(Z);
    if (W && Object.keys(W).length) A.user = {
      ...W,
      ...A.user
    };
    let K = UqA.dropUndefinedKeys(Y);
    if (K && Object.keys(K).length) A.contexts = {
      ...K,
      ...A.contexts
    };
    if (J) A.level = J;
    if (X) A.transaction = X
  }

  function SC4(A, Q) {
    let B = [...A.breadcrumbs || [], ...Q];
    A.breadcrumbs = B.length ? B : void 0
  }

  function xC4(A, Q) {
    A.sdkProcessingMetadata = {
      ...A.sdkProcessingMetadata,
      ...Q
    }
  }

  function yC4(A, Q) {
    A.contexts = {
      trace: rYQ.spanToTraceContext(Q),
      ...A.contexts
    };
    let B = _C4.getRootSpan(Q);
    if (B) {
      A.sdkProcessingMetadata = {
        dynamicSamplingContext: RC4.getDynamicSamplingContextFromSpan(Q),
        ...A.sdkProcessingMetadata
      };
      let G = rYQ.spanToJSON(B).description;
      if (G) A.tags = {
        transaction: G,
        ...A.tags
      }
    }
  }

  function vC4(A, Q) {
    if (A.fingerprint = A.fingerprint ? UqA.arrayify(A.fingerprint) : [], Q) A.fingerprint = A.fingerprint.concat(Q);
    if (A.fingerprint && !A.fingerprint.length) delete A.fingerprint
  }
  sYQ.applyScopeDataToEvent = jC4;
  sYQ.mergeAndOverwriteScopeData = eGA;
  sYQ.mergeScopeData = TC4
})