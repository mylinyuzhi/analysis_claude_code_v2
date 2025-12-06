
// @from(Start 12476031, End 12478511)
oZ0 = z((Pp2) => {
  Object.defineProperty(Pp2, "__esModule", {
    value: !0
  });
  var x71 = RO(),
    y71 = TO(),
    _03 = EC(),
    v71 = Vg(),
    k03 = _03.GLOBAL_OBJ,
    BPA = "__sentry_xhr_v3__";

  function y03(A) {
    v71.addHandler("xhr", A), v71.maybeInstrument("xhr", Tp2)
  }

  function Tp2() {
    if (!k03.XMLHttpRequest) return;
    let A = XMLHttpRequest.prototype;
    y71.fill(A, "open", function(Q) {
      return function(...B) {
        let G = Date.now(),
          Z = x71.isString(B[0]) ? B[0].toUpperCase() : void 0,
          I = x03(B[1]);
        if (!Z || !I) return Q.apply(this, B);
        if (this[BPA] = {
            method: Z,
            url: I,
            request_headers: {}
          }, Z === "POST" && I.match(/sentry_key/)) this.__sentry_own_request__ = !0;
        let Y = () => {
          let J = this[BPA];
          if (!J) return;
          if (this.readyState === 4) {
            try {
              J.status_code = this.status
            } catch (X) {}
            let W = {
              args: [Z, I],
              endTimestamp: Date.now(),
              startTimestamp: G,
              xhr: this
            };
            v71.triggerHandlers("xhr", W)
          }
        };
        if ("onreadystatechange" in this && typeof this.onreadystatechange === "function") y71.fill(this, "onreadystatechange", function(J) {
          return function(...W) {
            return Y(), J.apply(this, W)
          }
        });
        else this.addEventListener("readystatechange", Y);
        return y71.fill(this, "setRequestHeader", function(J) {
          return function(...W) {
            let [X, V] = W, F = this[BPA];
            if (F && x71.isString(X) && x71.isString(V)) F.request_headers[X.toLowerCase()] = V;
            return J.apply(this, W)
          }
        }), Q.apply(this, B)
      }
    }), y71.fill(A, "send", function(Q) {
      return function(...B) {
        let G = this[BPA];
        if (!G) return Q.apply(this, B);
        if (B[0] !== void 0) G.body = B[0];
        let Z = {
          args: [G.method, G.url],
          startTimestamp: Date.now(),
          xhr: this
        };
        return v71.triggerHandlers("xhr", Z), Q.apply(this, B)
      }
    })
  }

  function x03(A) {
    if (x71.isString(A)) return A;
    try {
      return A.toString()
    } catch (Q) {}
    return
  }
  Pp2.SENTRY_XHR_DATA_KEY = BPA;
  Pp2.addXhrInstrumentationHandler = y03;
  Pp2.instrumentXHR = Tp2
})
// @from(Start 12478517, End 12480153)
bp2 = z((vp2) => {
  Object.defineProperty(vp2, "__esModule", {
    value: !0
  });
  var h03 = my(),
    g03 = pP(),
    jp2 = kZ0(),
    Sp2 = fZ0(),
    _p2 = dZ0(),
    kp2 = lZ0(),
    yp2 = aZ0(),
    xp2 = rZ0(),
    tZ0 = oZ0();

  function u03(A, Q) {
    switch (A) {
      case "console":
        return jp2.addConsoleInstrumentationHandler(Q);
      case "dom":
        return Sp2.addClickKeypressInstrumentationHandler(Q);
      case "xhr":
        return tZ0.addXhrInstrumentationHandler(Q);
      case "fetch":
        return _p2.addFetchInstrumentationHandler(Q);
      case "history":
        return xp2.addHistoryInstrumentationHandler(Q);
      case "error":
        return kp2.addGlobalErrorInstrumentationHandler(Q);
      case "unhandledrejection":
        return yp2.addGlobalUnhandledRejectionInstrumentationHandler(Q);
      default:
        h03.DEBUG_BUILD && g03.logger.warn("unknown instrumentation type:", A)
    }
  }
  vp2.addConsoleInstrumentationHandler = jp2.addConsoleInstrumentationHandler;
  vp2.addClickKeypressInstrumentationHandler = Sp2.addClickKeypressInstrumentationHandler;
  vp2.addFetchInstrumentationHandler = _p2.addFetchInstrumentationHandler;
  vp2.addGlobalErrorInstrumentationHandler = kp2.addGlobalErrorInstrumentationHandler;
  vp2.addGlobalUnhandledRejectionInstrumentationHandler = yp2.addGlobalUnhandledRejectionInstrumentationHandler;
  vp2.addHistoryInstrumentationHandler = xp2.addHistoryInstrumentationHandler;
  vp2.SENTRY_XHR_DATA_KEY = tZ0.SENTRY_XHR_DATA_KEY;
  vp2.addXhrInstrumentationHandler = tZ0.addXhrInstrumentationHandler;
  vp2.addInstrumentationHandler = u03
})
// @from(Start 12480159, End 12480445)
eZ0 = z((fp2) => {
  Object.defineProperty(fp2, "__esModule", {
    value: !0
  });

  function r03() {
    return typeof __SENTRY_BROWSER_BUNDLE__ < "u" && !!__SENTRY_BROWSER_BUNDLE__
  }

  function o03() {
    return "npm"
  }
  fp2.getSDKSource = o03;
  fp2.isBrowserBundle = r03
})
// @from(Start 12480451, End 12481072)
AI0 = z((hp2, f71) => {
  Object.defineProperty(hp2, "__esModule", {
    value: !0
  });
  var AQ3 = eZ0();

  function QQ3() {
    return !AQ3.isBrowserBundle() && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]"
  }

  function b71(A, Q) {
    return A.require(Q)
  }

  function BQ3(A) {
    let Q;
    try {
      Q = b71(f71, A)
    } catch (B) {}
    try {
      let {
        cwd: B
      } = b71(f71, "process");
      Q = b71(f71, `${B()}/node_modules/${A}`)
    } catch (B) {}
    return Q
  }
  hp2.dynamicRequire = b71;
  hp2.isNodeEnv = QQ3;
  hp2.loadModule = BQ3
})
// @from(Start 12481078, End 12481422)
mp2 = z((up2) => {
  Object.defineProperty(up2, "__esModule", {
    value: !0
  });
  var YQ3 = AI0(),
    gp2 = EC();

  function JQ3() {
    return typeof window < "u" && (!YQ3.isNodeEnv() || WQ3())
  }

  function WQ3() {
    return gp2.GLOBAL_OBJ.process !== void 0 && gp2.GLOBAL_OBJ.process.type === "renderer"
  }
  up2.isBrowser = JQ3
})
// @from(Start 12481428, End 12482062)
QI0 = z((dp2) => {
  Object.defineProperty(dp2, "__esModule", {
    value: !0
  });

  function VQ3() {
    let A = typeof WeakSet === "function",
      Q = A ? new WeakSet : [];

    function B(Z) {
      if (A) {
        if (Q.has(Z)) return !0;
        return Q.add(Z), !1
      }
      for (let I = 0; I < Q.length; I++)
        if (Q[I] === Z) return !0;
      return Q.push(Z), !1
    }

    function G(Z) {
      if (A) Q.delete(Z);
      else
        for (let I = 0; I < Q.length; I++)
          if (Q[I] === Z) {
            Q.splice(I, 1);
            break
          }
    }
    return [B, G]
  }
  dp2.memoBuilder = VQ3
})
// @from(Start 12482068, End 12485138)
GPA = z((lp2) => {
  Object.defineProperty(lp2, "__esModule", {
    value: !0
  });
  var BI0 = RO(),
    KQ3 = QI0(),
    DQ3 = TO(),
    HQ3 = M71();

  function cp2(A, Q = 100, B = 1 / 0) {
    try {
      return h71("", A, Q, B)
    } catch (G) {
      return {
        ERROR: `**non-serializable** (${G})`
      }
    }
  }

  function pp2(A, Q = 3, B = 102400) {
    let G = cp2(A, Q);
    if (UQ3(G) > B) return pp2(A, Q - 1, B);
    return G
  }

  function h71(A, Q, B = 1 / 0, G = 1 / 0, Z = KQ3.memoBuilder()) {
    let [I, Y] = Z;
    if (Q == null || ["number", "boolean", "string"].includes(typeof Q) && !BI0.isNaN(Q)) return Q;
    let J = CQ3(A, Q);
    if (!J.startsWith("[object ")) return J;
    if (Q.__sentry_skip_normalization__) return Q;
    let W = typeof Q.__sentry_override_normalization_depth__ === "number" ? Q.__sentry_override_normalization_depth__ : B;
    if (W === 0) return J.replace("object ", "");
    if (I(Q)) return "[Circular ~]";
    let X = Q;
    if (X && typeof X.toJSON === "function") try {
      let D = X.toJSON();
      return h71("", D, W - 1, G, Z)
    } catch (D) {}
    let V = Array.isArray(Q) ? [] : {},
      F = 0,
      K = DQ3.convertToPlainObject(Q);
    for (let D in K) {
      if (!Object.prototype.hasOwnProperty.call(K, D)) continue;
      if (F >= G) {
        V[D] = "[MaxProperties ~]";
        break
      }
      let H = K[D];
      V[D] = h71(D, H, W - 1, G, Z), F++
    }
    return Y(Q), V
  }

  function CQ3(A, Q) {
    try {
      if (A === "domain" && Q && typeof Q === "object" && Q._events) return "[Domain]";
      if (A === "domainEmitter") return "[DomainEmitter]";
      if (typeof global < "u" && Q === global) return "[Global]";
      if (typeof window < "u" && Q === window) return "[Window]";
      if (typeof document < "u" && Q === document) return "[Document]";
      if (BI0.isVueViewModel(Q)) return "[VueViewModel]";
      if (BI0.isSyntheticEvent(Q)) return "[SyntheticEvent]";
      if (typeof Q === "number" && Q !== Q) return "[NaN]";
      if (typeof Q === "function") return `[Function: ${HQ3.getFunctionName(Q)}]`;
      if (typeof Q === "symbol") return `[${String(Q)}]`;
      if (typeof Q === "bigint") return `[BigInt: ${String(Q)}]`;
      let B = EQ3(Q);
      if (/^HTML(\w*)Element$/.test(B)) return `[HTMLElement: ${B}]`;
      return `[object ${B}]`
    } catch (B) {
      return `**non-serializable** (${B})`
    }
  }

  function EQ3(A) {
    let Q = Object.getPrototypeOf(A);
    return Q ? Q.constructor.name : "null prototype"
  }

  function zQ3(A) {
    return ~-encodeURI(A).split(/%..|./).length
  }

  function UQ3(A) {
    return zQ3(JSON.stringify(A))
  }

  function $Q3(A, Q) {
    let B = Q.replace(/\\/g, "/").replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"),
      G = A;
    try {
      G = decodeURI(A)
    } catch (Z) {}
    return G.replace(/\\/g, "/").replace(/webpack:\/?/g, "").replace(new RegExp(`(file://)?/*${B}/*`, "ig"), "app:///")
  }
  lp2.normalize = cp2;
  lp2.normalizeToSize = pp2;
  lp2.normalizeUrlToBase = $Q3;
  lp2.walk = h71
})
// @from(Start 12485144, End 12487509)
tp2 = z((op2) => {
  Object.defineProperty(op2, "__esModule", {
    value: !0
  });

  function np2(A, Q) {
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
  var MQ3 = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;

  function ap2(A) {
    let Q = A.length > 1024 ? `<truncated>${A.slice(-1024)}` : A,
      B = MQ3.exec(Q);
    return B ? B.slice(1) : []
  }

  function GI0(...A) {
    let Q = "",
      B = !1;
    for (let G = A.length - 1; G >= -1 && !B; G--) {
      let Z = G >= 0 ? A[G] : "/";
      if (!Z) continue;
      Q = `${Z}/${Q}`, B = Z.charAt(0) === "/"
    }
    return Q = np2(Q.split("/").filter((G) => !!G), !B).join("/"), (B ? "/" : "") + Q || "."
  }

  function ip2(A) {
    let Q = 0;
    for (; Q < A.length; Q++)
      if (A[Q] !== "") break;
    let B = A.length - 1;
    for (; B >= 0; B--)
      if (A[B] !== "") break;
    if (Q > B) return [];
    return A.slice(Q, B - Q + 1)
  }

  function OQ3(A, Q) {
    A = GI0(A).slice(1), Q = GI0(Q).slice(1);
    let B = ip2(A.split("/")),
      G = ip2(Q.split("/")),
      Z = Math.min(B.length, G.length),
      I = Z;
    for (let J = 0; J < Z; J++)
      if (B[J] !== G[J]) {
        I = J;
        break
      } let Y = [];
    for (let J = I; J < B.length; J++) Y.push("..");
    return Y = Y.concat(G.slice(I)), Y.join("/")
  }

  function sp2(A) {
    let Q = rp2(A),
      B = A.slice(-1) === "/",
      G = np2(A.split("/").filter((Z) => !!Z), !Q).join("/");
    if (!G && !Q) G = ".";
    if (G && B) G += "/";
    return (Q ? "/" : "") + G
  }

  function rp2(A) {
    return A.charAt(0) === "/"
  }

  function RQ3(...A) {
    return sp2(A.join("/"))
  }

  function TQ3(A) {
    let Q = ap2(A),
      B = Q[0],
      G = Q[1];
    if (!B && !G) return ".";
    if (G) G = G.slice(0, G.length - 1);
    return B + G
  }

  function PQ3(A, Q) {
    let B = ap2(A)[2];
    if (Q && B.slice(Q.length * -1) === Q) B = B.slice(0, B.length - Q.length);
    return B
  }
  op2.basename = PQ3;
  op2.dirname = TQ3;
  op2.isAbsolute = rp2;
  op2.join = RQ3;
  op2.normalizePath = sp2;
  op2.relative = OQ3;
  op2.resolve = GI0
})
// @from(Start 12487515, End 12490014)
ZI0 = z((ep2) => {
  Object.defineProperty(ep2, "__esModule", {
    value: !0
  });
  var bQ3 = RO(),
    Fg;
  (function(A) {
    A[A.PENDING = 0] = "PENDING";
    let B = 1;
    A[A.RESOLVED = B] = "RESOLVED";
    let G = 2;
    A[A.REJECTED = G] = "REJECTED"
  })(Fg || (Fg = {}));

  function fQ3(A) {
    return new dy((Q) => {
      Q(A)
    })
  }

  function hQ3(A) {
    return new dy((Q, B) => {
      B(A)
    })
  }
  class dy {
    constructor(A) {
      dy.prototype.__init.call(this), dy.prototype.__init2.call(this), dy.prototype.__init3.call(this), dy.prototype.__init4.call(this), this._state = Fg.PENDING, this._handlers = [];
      try {
        A(this._resolve, this._reject)
      } catch (Q) {
        this._reject(Q)
      }
    }
    then(A, Q) {
      return new dy((B, G) => {
        this._handlers.push([!1, (Z) => {
          if (!A) B(Z);
          else try {
            B(A(Z))
          } catch (I) {
            G(I)
          }
        }, (Z) => {
          if (!Q) G(Z);
          else try {
            B(Q(Z))
          } catch (I) {
            G(I)
          }
        }]), this._executeHandlers()
      })
    } catch (A) {
      return this.then((Q) => Q, A)
    } finally(A) {
      return new dy((Q, B) => {
        let G, Z;
        return this.then((I) => {
          if (Z = !1, G = I, A) A()
        }, (I) => {
          if (Z = !0, G = I, A) A()
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
        this._setResult(Fg.RESOLVED, A)
      }
    }
    __init2() {
      this._reject = (A) => {
        this._setResult(Fg.REJECTED, A)
      }
    }
    __init3() {
      this._setResult = (A, Q) => {
        if (this._state !== Fg.PENDING) return;
        if (bQ3.isThenable(Q)) {
          Q.then(this._resolve, this._reject);
          return
        }
        this._state = A, this._value = Q, this._executeHandlers()
      }
    }
    __init4() {
      this._executeHandlers = () => {
        if (this._state === Fg.PENDING) return;
        let A = this._handlers.slice();
        this._handlers = [], A.forEach((Q) => {
          if (Q[0]) return;
          if (this._state === Fg.RESOLVED) Q[1](this._value);
          if (this._state === Fg.REJECTED) Q[2](this._value);
          Q[0] = !0
        })
      }
    }
  }
  ep2.SyncPromise = dy;
  ep2.rejectedSyncPromise = hQ3;
  ep2.resolvedSyncPromise = fQ3
})
// @from(Start 12490020, End 12491070)
Ql2 = z((Al2) => {
  Object.defineProperty(Al2, "__esModule", {
    value: !0
  });
  var dQ3 = TZ0(),
    II0 = ZI0();

  function cQ3(A) {
    let Q = [];

    function B() {
      return A === void 0 || Q.length < A
    }

    function G(Y) {
      return Q.splice(Q.indexOf(Y), 1)[0]
    }

    function Z(Y) {
      if (!B()) return II0.rejectedSyncPromise(new dQ3.SentryError("Not adding Promise because buffer limit was reached."));
      let J = Y();
      if (Q.indexOf(J) === -1) Q.push(J);
      return J.then(() => G(J)).then(null, () => G(J).then(null, () => {})), J
    }

    function I(Y) {
      return new II0.SyncPromise((J, W) => {
        let X = Q.length;
        if (!X) return J(!0);
        let V = setTimeout(() => {
          if (Y && Y > 0) J(!1)
        }, Y);
        Q.forEach((F) => {
          II0.resolvedSyncPromise(F).then(() => {
            if (!--X) clearTimeout(V), J(!0)
          }, W)
        })
      })
    }
    return {
      $: Q,
      add: Z,
      drain: I
    }
  }
  Al2.makePromiseBuffer = cQ3
})
// @from(Start 12491076, End 12491824)
Gl2 = z((Bl2) => {
  Object.defineProperty(Bl2, "__esModule", {
    value: !0
  });

  function lQ3(A) {
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
      let I = A.slice(B, G).trim();
      if (Q[I] === void 0) {
        let Y = A.slice(G + 1, Z).trim();
        if (Y.charCodeAt(0) === 34) Y = Y.slice(1, -1);
        try {
          Q[I] = Y.indexOf("%") !== -1 ? decodeURIComponent(Y) : Y
        } catch (J) {
          Q[I] = Y
        }
      }
      B = Z + 1
    }
    return Q
  }
  Bl2.parseCookie = lQ3
})
// @from(Start 12491830, End 12492784)
YI0 = z((Zl2) => {
  Object.defineProperty(Zl2, "__esModule", {
    value: !0
  });

  function nQ3(A) {
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

  function aQ3(A) {
    return A.split(/[\?#]/, 1)[0]
  }

  function sQ3(A) {
    return A.split(/\\?\//).filter((Q) => Q.length > 0 && Q !== ",").length
  }

  function rQ3(A) {
    let {
      protocol: Q,
      host: B,
      path: G
    } = A, Z = B && B.replace(/^.*@/, "[filtered]:[filtered]@").replace(/(:80)$/, "").replace(/(:443)$/, "") || "";
    return `${Q?`${Q}://`:""}${Z}${G}`
  }
  Zl2.getNumberOfUrlSegments = sQ3;
  Zl2.getSanitizedUrlString = rQ3;
  Zl2.parseUrl = nQ3;
  Zl2.stripUrlQueryAndFragment = aQ3
})
// @from(Start 12492790, End 12497646)
Vl2 = z((Xl2) => {
  Object.defineProperty(Xl2, "__esModule", {
    value: !0
  });
  var QB3 = Gl2(),
    BB3 = my(),
    Il2 = RO(),
    GB3 = pP(),
    ZB3 = GPA(),
    IB3 = YI0(),
    YB3 = {
      ip: !1,
      request: !0,
      transaction: !0,
      user: !0
    },
    JB3 = ["cookies", "data", "headers", "method", "query_string", "url"],
    Yl2 = ["id", "username", "email"];

  function WB3(A, Q, B) {
    if (!A) return;
    if (!A.metadata.source || A.metadata.source === "url") {
      let [G, Z] = g71(Q, {
        path: !0,
        method: !0
      });
      A.updateName(G), A.setMetadata({
        source: Z
      })
    }
    if (A.setAttribute("url", Q.originalUrl || Q.url), Q.baseUrl) A.setAttribute("baseUrl", Q.baseUrl);
    A.setData("query", Jl2(Q, B))
  }

  function g71(A, Q = {}) {
    let B = A.method && A.method.toUpperCase(),
      G = "",
      Z = "url";
    if (Q.customRoute || A.route) G = Q.customRoute || `${A.baseUrl||""}${A.route&&A.route.path}`, Z = "route";
    else if (A.originalUrl || A.url) G = IB3.stripUrlQueryAndFragment(A.originalUrl || A.url || "");
    let I = "";
    if (Q.method && B) I += B;
    if (Q.method && Q.path) I += " ";
    if (Q.path && G) I += G;
    return [I, Z]
  }

  function XB3(A, Q) {
    switch (Q) {
      case "path":
        return g71(A, {
          path: !0
        })[0];
      case "handler":
        return A.route && A.route.stack && A.route.stack[0] && A.route.stack[0].name || "<anonymous>";
      case "methodPath":
      default: {
        let B = A._reconstructedRoute ? A._reconstructedRoute : void 0;
        return g71(A, {
          path: !0,
          method: !0,
          customRoute: B
        })[0]
      }
    }
  }

  function VB3(A, Q) {
    let B = {};
    return (Array.isArray(Q) ? Q : Yl2).forEach((Z) => {
      if (A && Z in A) B[Z] = A[Z]
    }), B
  }

  function JI0(A, Q) {
    let {
      include: B = JB3,
      deps: G
    } = Q || {}, Z = {}, I = A.headers || {}, Y = A.method, J = I.host || A.hostname || A.host || "<no host>", W = A.protocol === "https" || A.socket && A.socket.encrypted ? "https" : "http", X = A.originalUrl || A.url || "", V = X.startsWith(W) ? X : `${W}://${J}${X}`;
    return B.forEach((F) => {
      switch (F) {
        case "headers": {
          if (Z.headers = I, !B.includes("cookies")) delete Z.headers.cookie;
          break
        }
        case "method": {
          Z.method = Y;
          break
        }
        case "url": {
          Z.url = V;
          break
        }
        case "cookies": {
          Z.cookies = A.cookies || I.cookie && QB3.parseCookie(I.cookie) || {};
          break
        }
        case "query_string": {
          Z.query_string = Jl2(A, G);
          break
        }
        case "data": {
          if (Y === "GET" || Y === "HEAD") break;
          if (A.body !== void 0) Z.data = Il2.isString(A.body) ? A.body : JSON.stringify(ZB3.normalize(A.body));
          break
        }
        default:
          if ({}.hasOwnProperty.call(A, F)) Z[F] = A[F]
      }
    }), Z
  }

  function FB3(A, Q, B) {
    let G = {
      ...YB3,
      ...B && B.include
    };
    if (G.request) {
      let Z = Array.isArray(G.request) ? JI0(Q, {
        include: G.request,
        deps: B && B.deps
      }) : JI0(Q, {
        deps: B && B.deps
      });
      A.request = {
        ...A.request,
        ...Z
      }
    }
    if (G.user) {
      let Z = Q.user && Il2.isPlainObject(Q.user) ? VB3(Q.user, G.user) : {};
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
    if (G.transaction && !A.transaction) A.transaction = XB3(Q, G.transaction);
    return A
  }

  function Jl2(A, Q) {
    let B = A.originalUrl || A.url || "";
    if (!B) return;
    if (B.startsWith("/")) B = `http://dogs.are.great${B}`;
    try {
      return A.query || typeof URL < "u" && new URL(B).search.slice(1) || Q && Q.url && Q.url.parse(B).query || void 0
    } catch (G) {
      return
    }
  }

  function Wl2(A) {
    let Q = {};
    try {
      A.forEach((B, G) => {
        if (typeof B === "string") Q[G] = B
      })
    } catch (B) {
      BB3.DEBUG_BUILD && GB3.logger.warn("Sentry failed extracting headers from a request object. If you see this, please file an issue.")
    }
    return Q
  }

  function KB3(A) {
    let Q = Wl2(A.headers);
    return {
      method: A.method,
      url: A.url,
      headers: Q
    }
  }
  Xl2.DEFAULT_USER_INCLUDES = Yl2;
  Xl2.addRequestDataToEvent = FB3;
  Xl2.addRequestDataToTransaction = WB3;
  Xl2.extractPathForTransaction = g71;
  Xl2.extractRequestData = JI0;
  Xl2.winterCGHeadersToDict = Wl2;
  Xl2.winterCGRequestToRequestData = KB3
})
// @from(Start 12497652, End 12498040)
Hl2 = z((Dl2) => {
  Object.defineProperty(Dl2, "__esModule", {
    value: !0
  });
  var Fl2 = ["fatal", "error", "warning", "log", "info", "debug"];

  function wB3(A) {
    return Kl2(A)
  }

  function Kl2(A) {
    return A === "warn" ? "warning" : Fl2.includes(A) ? A : "log"
  }
  Dl2.severityFromString = wB3;
  Dl2.severityLevelFromString = Kl2;
  Dl2.validSeverityLevels = Fl2
})
// @from(Start 12498046, End 12499394)
WI0 = z(($l2) => {
  Object.defineProperty($l2, "__esModule", {
    value: !0
  });
  var Cl2 = EC(),
    El2 = 1000;

  function zl2() {
    return Date.now() / El2
  }

  function MB3() {
    let {
      performance: A
    } = Cl2.GLOBAL_OBJ;
    if (!A || !A.now) return zl2;
    let Q = Date.now() - A.now(),
      B = A.timeOrigin == null ? Q : A.timeOrigin;
    return () => {
      return (B + A.now()) / El2
    }
  }
  var Ul2 = MB3(),
    OB3 = Ul2;
  $l2._browserPerformanceTimeOriginMode = void 0;
  var RB3 = (() => {
    let {
      performance: A
    } = Cl2.GLOBAL_OBJ;
    if (!A || !A.now) {
      $l2._browserPerformanceTimeOriginMode = "none";
      return
    }
    let Q = 3600000,
      B = A.now(),
      G = Date.now(),
      Z = A.timeOrigin ? Math.abs(A.timeOrigin + B - G) : Q,
      I = Z < Q,
      Y = A.timing && A.timing.navigationStart,
      W = typeof Y === "number" ? Math.abs(Y + B - G) : Q,
      X = W < Q;
    if (I || X)
      if (Z <= W) return $l2._browserPerformanceTimeOriginMode = "timeOrigin", A.timeOrigin;
      else return $l2._browserPerformanceTimeOriginMode = "navigationStart", Y;
    return $l2._browserPerformanceTimeOriginMode = "dateNow", G
  })();
  $l2.browserPerformanceTimeOrigin = RB3;
  $l2.dateTimestampInSeconds = zl2;
  $l2.timestampInSeconds = Ul2;
  $l2.timestampWithMs = OB3
})
// @from(Start 12499400, End 12501193)
VI0 = z((Ll2) => {
  Object.defineProperty(Ll2, "__esModule", {
    value: !0
  });
  var _B3 = my(),
    kB3 = RO(),
    yB3 = pP(),
    xB3 = "baggage",
    XI0 = "sentry-",
    ql2 = /^sentry-/,
    Nl2 = 8192;

  function vB3(A) {
    if (!kB3.isString(A) && !Array.isArray(A)) return;
    let Q = {};
    if (Array.isArray(A)) Q = A.reduce((G, Z) => {
      let I = wl2(Z);
      for (let Y of Object.keys(I)) G[Y] = I[Y];
      return G
    }, {});
    else {
      if (!A) return;
      Q = wl2(A)
    }
    let B = Object.entries(Q).reduce((G, [Z, I]) => {
      if (Z.match(ql2)) {
        let Y = Z.slice(XI0.length);
        G[Y] = I
      }
      return G
    }, {});
    if (Object.keys(B).length > 0) return B;
    else return
  }

  function bB3(A) {
    if (!A) return;
    let Q = Object.entries(A).reduce((B, [G, Z]) => {
      if (Z) B[`${XI0}${G}`] = Z;
      return B
    }, {});
    return fB3(Q)
  }

  function wl2(A) {
    return A.split(",").map((Q) => Q.split("=").map((B) => decodeURIComponent(B.trim()))).reduce((Q, [B, G]) => {
      return Q[B] = G, Q
    }, {})
  }

  function fB3(A) {
    if (Object.keys(A).length === 0) return;
    return Object.entries(A).reduce((Q, [B, G], Z) => {
      let I = `${encodeURIComponent(B)}=${encodeURIComponent(G)}`,
        Y = Z === 0 ? I : `${Q},${I}`;
      if (Y.length > Nl2) return _B3.DEBUG_BUILD && yB3.logger.warn(`Not adding key: ${B} with val: ${G} to baggage header due to exceeding baggage size limits.`), Q;
      else return Y
    }, "")
  }
  Ll2.BAGGAGE_HEADER_NAME = xB3;
  Ll2.MAX_BAGGAGE_STRING_LENGTH = Nl2;
  Ll2.SENTRY_BAGGAGE_KEY_PREFIX = XI0;
  Ll2.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = ql2;
  Ll2.baggageHeaderToDynamicSamplingContext = vB3;
  Ll2.dynamicSamplingContextToSentryBaggageHeader = bB3
})
// @from(Start 12501199, End 12503187)
Tl2 = z((Rl2) => {
  Object.defineProperty(Rl2, "__esModule", {
    value: !0
  });
  var Ml2 = VI0(),
    PO = eTA(),
    Ol2 = new RegExp("^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$");

  function FI0(A) {
    if (!A) return;
    let Q = A.match(Ol2);
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

  function pB3(A, Q) {
    let B = FI0(A),
      G = Ml2.baggageHeaderToDynamicSamplingContext(Q),
      {
        traceId: Z,
        parentSpanId: I,
        parentSampled: Y
      } = B || {};
    if (!B) return {
      traceparentData: B,
      dynamicSamplingContext: void 0,
      propagationContext: {
        traceId: Z || PO.uuid4(),
        spanId: PO.uuid4().substring(16)
      }
    };
    else return {
      traceparentData: B,
      dynamicSamplingContext: G || {},
      propagationContext: {
        traceId: Z || PO.uuid4(),
        parentSpanId: I || PO.uuid4().substring(16),
        spanId: PO.uuid4().substring(16),
        sampled: Y,
        dsc: G || {}
      }
    }
  }

  function lB3(A, Q) {
    let B = FI0(A),
      G = Ml2.baggageHeaderToDynamicSamplingContext(Q),
      {
        traceId: Z,
        parentSpanId: I,
        parentSampled: Y
      } = B || {};
    if (!B) return {
      traceId: Z || PO.uuid4(),
      spanId: PO.uuid4().substring(16)
    };
    else return {
      traceId: Z || PO.uuid4(),
      parentSpanId: I || PO.uuid4().substring(16),
      spanId: PO.uuid4().substring(16),
      sampled: Y,
      dsc: G || {}
    }
  }

  function iB3(A = PO.uuid4(), Q = PO.uuid4().substring(16), B) {
    let G = "";
    if (B !== void 0) G = B ? "-1" : "-0";
    return `${A}-${Q}${G}`
  }
  Rl2.TRACEPARENT_REGEXP = Ol2;
  Rl2.extractTraceparentData = FI0;
  Rl2.generateSentryTraceHeader = iB3;
  Rl2.propagationContextFromHeaders = lB3;
  Rl2.tracingContextFromHeaders = pB3
})
// @from(Start 12503193, End 12506676)
DI0 = z((Sl2) => {
  Object.defineProperty(Sl2, "__esModule", {
    value: !0
  });
  var tB3 = RZ0(),
    eB3 = GPA(),
    Pl2 = TO();

  function A23(A, Q = []) {
    return [A, Q]
  }

  function Q23(A, Q) {
    let [B, G] = A;
    return [B, [...G, Q]]
  }

  function jl2(A, Q) {
    let B = A[1];
    for (let G of B) {
      let Z = G[0].type;
      if (Q(G, Z)) return !0
    }
    return !1
  }

  function B23(A, Q) {
    return jl2(A, (B, G) => Q.includes(G))
  }

  function KI0(A, Q) {
    return (Q || new TextEncoder).encode(A)
  }

  function G23(A, Q) {
    let [B, G] = A, Z = JSON.stringify(B);

    function I(Y) {
      if (typeof Z === "string") Z = typeof Y === "string" ? Z + Y : [KI0(Z, Q), Y];
      else Z.push(typeof Y === "string" ? KI0(Y, Q) : Y)
    }
    for (let Y of G) {
      let [J, W] = Y;
      if (I(`
${JSON.stringify(J)}
`), typeof W === "string" || W instanceof Uint8Array) I(W);
      else {
        let X;
        try {
          X = JSON.stringify(W)
        } catch (V) {
          X = JSON.stringify(eB3.normalize(W))
        }
        I(X)
      }
    }
    return typeof Z === "string" ? Z : Z23(Z)
  }

  function Z23(A) {
    let Q = A.reduce((Z, I) => Z + I.length, 0),
      B = new Uint8Array(Q),
      G = 0;
    for (let Z of A) B.set(Z, G), G += Z.length;
    return B
  }

  function I23(A, Q, B) {
    let G = typeof A === "string" ? Q.encode(A) : A;

    function Z(W) {
      let X = G.subarray(0, W);
      return G = G.subarray(W + 1), X
    }

    function I() {
      let W = G.indexOf(10);
      if (W < 0) W = G.length;
      return JSON.parse(B.decode(Z(W)))
    }
    let Y = I(),
      J = [];
    while (G.length) {
      let W = I(),
        X = typeof W.length === "number" ? W.length : void 0;
      J.push([W, X ? Z(X) : I()])
    }
    return [Y, J]
  }

  function Y23(A, Q) {
    let B = typeof A.data === "string" ? KI0(A.data, Q) : A.data;
    return [Pl2.dropUndefinedKeys({
      type: "attachment",
      length: B.length,
      filename: A.filename,
      content_type: A.contentType,
      attachment_type: A.attachmentType
    }), B]
  }
  var J23 = {
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

  function W23(A) {
    return J23[A]
  }

  function X23(A) {
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

  function V23(A, Q, B, G) {
    let Z = A.sdkProcessingMetadata && A.sdkProcessingMetadata.dynamicSamplingContext;
    return {
      event_id: A.event_id,
      sent_at: new Date().toISOString(),
      ...Q && {
        sdk: Q
      },
      ...!!B && G && {
        dsn: tB3.dsnToString(G)
      },
      ...Z && {
        trace: Pl2.dropUndefinedKeys({
          ...Z
        })
      }
    }
  }
  Sl2.addItemToEnvelope = Q23;
  Sl2.createAttachmentEnvelopeItem = Y23;
  Sl2.createEnvelope = A23;
  Sl2.createEventEnvelopeHeaders = V23;
  Sl2.envelopeContainsItemType = B23;
  Sl2.envelopeItemTypeToDataCategory = W23;
  Sl2.forEachEnvelopeItem = jl2;
  Sl2.getSdkMetadataForEnvelopeHeader = X23;
  Sl2.parseEnvelope = I23;
  Sl2.serializeEnvelope = G23
})
// @from(Start 12506682, End 12507078)
kl2 = z((_l2) => {
  Object.defineProperty(_l2, "__esModule", {
    value: !0
  });
  var q23 = DI0(),
    N23 = WI0();

  function L23(A, Q, B) {
    let G = [{
      type: "client_report"
    }, {
      timestamp: B || N23.dateTimestampInSeconds(),
      discarded_events: A
    }];
    return q23.createEnvelope(Q ? {
      dsn: Q
    } : {}, [G])
  }
  _l2.createClientReportEnvelope = L23
})
// @from(Start 12507084, End 12508330)
fl2 = z((bl2) => {
  Object.defineProperty(bl2, "__esModule", {
    value: !0
  });
  var yl2 = 60000;

  function xl2(A, Q = Date.now()) {
    let B = parseInt(`${A}`, 10);
    if (!isNaN(B)) return B * 1000;
    let G = Date.parse(`${A}`);
    if (!isNaN(G)) return G - Q;
    return yl2
  }

  function vl2(A, Q) {
    return A[Q] || A.all || 0
  }

  function O23(A, Q, B = Date.now()) {
    return vl2(A, Q) > B
  }

  function R23(A, {
    statusCode: Q,
    headers: B
  }, G = Date.now()) {
    let Z = {
        ...A
      },
      I = B && B["x-sentry-rate-limits"],
      Y = B && B["retry-after"];
    if (I)
      for (let J of I.trim().split(",")) {
        let [W, X, , , V] = J.split(":", 5), F = parseInt(W, 10), K = (!isNaN(F) ? F : 60) * 1000;
        if (!X) Z.all = G + K;
        else
          for (let D of X.split(";"))
            if (D === "metric_bucket") {
              if (!V || V.split(";").includes("custom")) Z[D] = G + K
            } else Z[D] = G + K
      } else if (Y) Z.all = G + xl2(Y, G);
      else if (Q === 429) Z.all = G + 60000;
    return Z
  }
  bl2.DEFAULT_RETRY_AFTER = yl2;
  bl2.disabledUntil = vl2;
  bl2.isRateLimited = O23;
  bl2.parseRetryAfterHeader = xl2;
  bl2.updateRateLimits = R23
})
// @from(Start 12508336, End 12509108)
ml2 = z((ul2) => {
  Object.defineProperty(ul2, "__esModule", {
    value: !0
  });

  function hl2(A, Q, B) {
    let G = Q.match(/([a-z_]+)\.(.*)/i);
    if (G === null) A[Q] = B;
    else {
      let Z = A[G[1]];
      hl2(Z, G[2], B)
    }
  }

  function k23(A, Q, B = {}) {
    return Array.isArray(Q) ? gl2(A, Q, B) : y23(A, Q, B)
  }

  function gl2(A, Q, B) {
    let G = Q.find((Z) => Z.name === A.name);
    if (G) {
      for (let [Z, I] of Object.entries(B)) hl2(G, Z, I);
      return Q
    }
    return [...Q, A]
  }

  function y23(A, Q, B) {
    return (Z) => {
      let I = Q(Z);
      if (A.allowExclusionByUser) {
        if (!I.find((J) => J.name === A.name)) return I
      }
      return gl2(A, I, B)
    }
  }
  ul2.addOrUpdateIntegration = k23
})
// @from(Start 12509114, End 12509856)
cl2 = z((dl2) => {
  Object.defineProperty(dl2, "__esModule", {
    value: !0
  });

  function v23(A) {
    let Q = [],
      B = {};
    return {
      add(G, Z) {
        while (Q.length >= A) {
          let I = Q.shift();
          if (I !== void 0) delete B[I]
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
  dl2.makeFifoCache = v23
})
// @from(Start 12509862, End 12512287)
nl2 = z((il2) => {
  Object.defineProperty(il2, "__esModule", {
    value: !0
  });
  var HI0 = RO(),
    pl2 = eTA(),
    f23 = GPA(),
    h23 = TO();

  function CI0(A, Q) {
    return A(Q.stack || "", 1)
  }

  function ll2(A, Q) {
    let B = {
        type: Q.name || Q.constructor.name,
        value: Q.message
      },
      G = CI0(A, Q);
    if (G.length) B.stacktrace = {
      frames: G
    };
    return B
  }

  function g23(A) {
    if ("name" in A && typeof A.name === "string") {
      let Q = `'${A.name}' captured as exception`;
      if ("message" in A && typeof A.message === "string") Q += ` with message '${A.message}'`;
      return Q
    } else if ("message" in A && typeof A.message === "string") return A.message;
    else return `Object captured as exception with keys: ${h23.extractExceptionKeysForMessage(A)}`
  }

  function u23(A, Q, B, G) {
    let Z = typeof A === "function" ? A().getClient() : A,
      I = B,
      J = G && G.data && G.data.mechanism || {
        handled: !0,
        type: "generic"
      },
      W;
    if (!HI0.isError(B)) {
      if (HI0.isPlainObject(B)) {
        let V = Z && Z.getOptions().normalizeDepth;
        W = {
          ["__serialized__"]: f23.normalizeToSize(B, V)
        };
        let F = g23(B);
        I = G && G.syntheticException || Error(F), I.message = F
      } else I = G && G.syntheticException || Error(B), I.message = B;
      J.synthetic = !0
    }
    let X = {
      exception: {
        values: [ll2(Q, I)]
      }
    };
    if (W) X.extra = W;
    return pl2.addExceptionTypeValue(X, void 0, void 0), pl2.addExceptionMechanism(X, J), {
      ...X,
      event_id: G && G.event_id
    }
  }

  function m23(A, Q, B = "info", G, Z) {
    let I = {
      event_id: G && G.event_id,
      level: B
    };
    if (Z && G && G.syntheticException) {
      let Y = CI0(A, G.syntheticException);
      if (Y.length) I.exception = {
        values: [{
          value: Q,
          stacktrace: {
            frames: Y
          }
        }]
      }
    }
    if (HI0.isParameterizedString(Q)) {
      let {
        __sentry_template_string__: Y,
        __sentry_template_values__: J
      } = Q;
      return I.logentry = {
        message: Y,
        params: J
      }, I
    }
    return I.message = Q, I
  }
  il2.eventFromMessage = m23;
  il2.eventFromUnknownInput = u23;
  il2.exceptionFromError = ll2;
  il2.parseStackFrames = CI0
})
// @from(Start 12512293, End 12513257)
sl2 = z((al2) => {
  Object.defineProperty(al2, "__esModule", {
    value: !0
  });
  var i23 = TO(),
    n23 = L71();

  function a23(A, Q, B, G) {
    let Z = A(),
      I = !1,
      Y = !0;
    return setInterval(() => {
      let J = Z.getTimeMs();
      if (I === !1 && J > Q + B) {
        if (I = !0, Y) G()
      }
      if (J < Q + B) I = !1
    }, 20), {
      poll: () => {
        Z.reset()
      },
      enabled: (J) => {
        Y = J
      }
    }
  }

  function s23(A, Q, B) {
    let G = Q ? Q.replace(/^file:\/\//, "") : void 0,
      Z = A.location.columnNumber ? A.location.columnNumber + 1 : void 0,
      I = A.location.lineNumber ? A.location.lineNumber + 1 : void 0;
    return i23.dropUndefinedKeys({
      filename: G,
      module: B(G),
      function: A.functionName || "?",
      colno: Z,
      lineno: I,
      in_app: G ? n23.filenameIsInApp(G) : void 0
    })
  }
  al2.callFrameToStackFrame = s23;
  al2.watchdogTimer = a23
})
// @from(Start 12513263, End 12514116)
tl2 = z((ol2) => {
  Object.defineProperty(ol2, "__esModule", {
    value: !0
  });
  class rl2 {
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
  ol2.LRUMap = rl2
})
// @from(Start 12514122, End 12514296)
EI0 = z((el2) => {
  Object.defineProperty(el2, "__esModule", {
    value: !0
  });

  function e23(A, Q) {
    return A != null ? A : Q()
  }
  el2._nullishCoalesce = e23
})
// @from(Start 12514302, End 12514512)
Qi2 = z((Ai2) => {
  Object.defineProperty(Ai2, "__esModule", {
    value: !0
  });
  var Q93 = EI0();
  async function B93(A, Q) {
    return Q93._nullishCoalesce(A, Q)
  }
  Ai2._asyncNullishCoalesce = B93
})
// @from(Start 12514518, End 12515071)
zI0 = z((Bi2) => {
  Object.defineProperty(Bi2, "__esModule", {
    value: !0
  });
  async function Z93(A) {
    let Q = void 0,
      B = A[0],
      G = 1;
    while (G < A.length) {
      let Z = A[G],
        I = A[G + 1];
      if (G += 2, (Z === "optionalAccess" || Z === "optionalCall") && B == null) return;
      if (Z === "access" || Z === "optionalAccess") Q = B, B = await I(B);
      else if (Z === "call" || Z === "optionalCall") B = await I((...Y) => B.call(Q, ...Y)), Q = void 0
    }
    return B
  }
  Bi2._asyncOptionalChain = Z93
})
// @from(Start 12515077, End 12515326)
Zi2 = z((Gi2) => {
  Object.defineProperty(Gi2, "__esModule", {
    value: !0
  });
  var Y93 = zI0();
  async function J93(A) {
    let Q = await Y93._asyncOptionalChain(A);
    return Q == null ? !0 : Q
  }
  Gi2._asyncOptionalChainDelete = J93
})
// @from(Start 12515332, End 12515863)
UI0 = z((Ii2) => {
  Object.defineProperty(Ii2, "__esModule", {
    value: !0
  });

  function X93(A) {
    let Q = void 0,
      B = A[0],
      G = 1;
    while (G < A.length) {
      let Z = A[G],
        I = A[G + 1];
      if (G += 2, (Z === "optionalAccess" || Z === "optionalCall") && B == null) return;
      if (Z === "access" || Z === "optionalAccess") Q = B, B = I(B);
      else if (Z === "call" || Z === "optionalCall") B = I((...Y) => B.call(Q, ...Y)), Q = void 0
    }
    return B
  }
  Ii2._optionalChain = X93
})
// @from(Start 12515869, End 12516097)
Ji2 = z((Yi2) => {
  Object.defineProperty(Yi2, "__esModule", {
    value: !0
  });
  var F93 = UI0();

  function K93(A) {
    let Q = F93._optionalChain(A);
    return Q == null ? !0 : Q
  }
  Yi2._optionalChainDelete = K93
})
// @from(Start 12516103, End 12516322)
Xi2 = z((Wi2) => {
  Object.defineProperty(Wi2, "__esModule", {
    value: !0
  });

  function H93(A) {
    return A.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
  }
  Wi2.escapeStringForRegex = H93
})
// @from(Start 12516328, End 12525584)
i0 = z((MI0) => {
  Object.defineProperty(MI0, "__esModule", {
    value: !0
  });
  var E93 = vc2(),
    u71 = NZ0(),
    $I0 = RZ0(),
    z93 = TZ0(),
    wI0 = EC(),
    U93 = bp2(),
    zC = RO(),
    $93 = mp2(),
    m71 = pP(),
    w93 = QI0(),
    sn = eTA(),
    qI0 = AI0(),
    d71 = GPA(),
    Kg = TO(),
    l0A = tp2(),
    q93 = Ql2(),
    i0A = Vl2(),
    NI0 = Hl2(),
    IPA = M71(),
    YPA = oTA(),
    rn = uZ0(),
    LI0 = ZI0(),
    JPA = WI0(),
    WPA = Tl2(),
    Vi2 = eZ0(),
    cy = DI0(),
    N93 = kl2(),
    XPA = fl2(),
    YXA = VI0(),
    c71 = YI0(),
    L93 = ml2(),
    M93 = cl2(),
    p71 = nl2(),
    Fi2 = sl2(),
    O93 = tl2(),
    R93 = Qi2(),
    T93 = zI0(),
    P93 = Zi2(),
    j93 = EI0(),
    S93 = UI0(),
    _93 = Ji2(),
    k93 = kZ0(),
    y93 = fZ0(),
    Ki2 = oZ0(),
    x93 = dZ0(),
    v93 = rZ0(),
    b93 = lZ0(),
    f93 = aZ0(),
    h93 = Vg(),
    g93 = L71(),
    u93 = Xi2(),
    m93 = sZ0();
  MI0.applyAggregateErrorsToEvent = E93.applyAggregateErrorsToEvent;
  MI0.getComponentName = u71.getComponentName;
  MI0.getDomElement = u71.getDomElement;
  MI0.getLocationHref = u71.getLocationHref;
  MI0.htmlTreeAsString = u71.htmlTreeAsString;
  MI0.dsnFromString = $I0.dsnFromString;
  MI0.dsnToString = $I0.dsnToString;
  MI0.makeDsn = $I0.makeDsn;
  MI0.SentryError = z93.SentryError;
  MI0.GLOBAL_OBJ = wI0.GLOBAL_OBJ;
  MI0.getGlobalObject = wI0.getGlobalObject;
  MI0.getGlobalSingleton = wI0.getGlobalSingleton;
  MI0.addInstrumentationHandler = U93.addInstrumentationHandler;
  MI0.isDOMError = zC.isDOMError;
  MI0.isDOMException = zC.isDOMException;
  MI0.isElement = zC.isElement;
  MI0.isError = zC.isError;
  MI0.isErrorEvent = zC.isErrorEvent;
  MI0.isEvent = zC.isEvent;
  MI0.isInstanceOf = zC.isInstanceOf;
  MI0.isNaN = zC.isNaN;
  MI0.isParameterizedString = zC.isParameterizedString;
  MI0.isPlainObject = zC.isPlainObject;
  MI0.isPrimitive = zC.isPrimitive;
  MI0.isRegExp = zC.isRegExp;
  MI0.isString = zC.isString;
  MI0.isSyntheticEvent = zC.isSyntheticEvent;
  MI0.isThenable = zC.isThenable;
  MI0.isVueViewModel = zC.isVueViewModel;
  MI0.isBrowser = $93.isBrowser;
  MI0.CONSOLE_LEVELS = m71.CONSOLE_LEVELS;
  MI0.consoleSandbox = m71.consoleSandbox;
  MI0.logger = m71.logger;
  MI0.originalConsoleMethods = m71.originalConsoleMethods;
  MI0.memoBuilder = w93.memoBuilder;
  MI0.addContextToFrame = sn.addContextToFrame;
  MI0.addExceptionMechanism = sn.addExceptionMechanism;
  MI0.addExceptionTypeValue = sn.addExceptionTypeValue;
  MI0.arrayify = sn.arrayify;
  MI0.checkOrSetAlreadyCaught = sn.checkOrSetAlreadyCaught;
  MI0.getEventDescription = sn.getEventDescription;
  MI0.parseSemver = sn.parseSemver;
  MI0.uuid4 = sn.uuid4;
  MI0.dynamicRequire = qI0.dynamicRequire;
  MI0.isNodeEnv = qI0.isNodeEnv;
  MI0.loadModule = qI0.loadModule;
  MI0.normalize = d71.normalize;
  MI0.normalizeToSize = d71.normalizeToSize;
  MI0.normalizeUrlToBase = d71.normalizeUrlToBase;
  MI0.walk = d71.walk;
  MI0.addNonEnumerableProperty = Kg.addNonEnumerableProperty;
  MI0.convertToPlainObject = Kg.convertToPlainObject;
  MI0.dropUndefinedKeys = Kg.dropUndefinedKeys;
  MI0.extractExceptionKeysForMessage = Kg.extractExceptionKeysForMessage;
  MI0.fill = Kg.fill;
  MI0.getOriginalFunction = Kg.getOriginalFunction;
  MI0.markFunctionWrapped = Kg.markFunctionWrapped;
  MI0.objectify = Kg.objectify;
  MI0.urlEncode = Kg.urlEncode;
  MI0.basename = l0A.basename;
  MI0.dirname = l0A.dirname;
  MI0.isAbsolute = l0A.isAbsolute;
  MI0.join = l0A.join;
  MI0.normalizePath = l0A.normalizePath;
  MI0.relative = l0A.relative;
  MI0.resolve = l0A.resolve;
  MI0.makePromiseBuffer = q93.makePromiseBuffer;
  MI0.DEFAULT_USER_INCLUDES = i0A.DEFAULT_USER_INCLUDES;
  MI0.addRequestDataToEvent = i0A.addRequestDataToEvent;
  MI0.addRequestDataToTransaction = i0A.addRequestDataToTransaction;
  MI0.extractPathForTransaction = i0A.extractPathForTransaction;
  MI0.extractRequestData = i0A.extractRequestData;
  MI0.winterCGHeadersToDict = i0A.winterCGHeadersToDict;
  MI0.winterCGRequestToRequestData = i0A.winterCGRequestToRequestData;
  MI0.severityFromString = NI0.severityFromString;
  MI0.severityLevelFromString = NI0.severityLevelFromString;
  MI0.validSeverityLevels = NI0.validSeverityLevels;
  MI0.createStackParser = IPA.createStackParser;
  MI0.getFunctionName = IPA.getFunctionName;
  MI0.nodeStackLineParser = IPA.nodeStackLineParser;
  MI0.stackParserFromStackParserOptions = IPA.stackParserFromStackParserOptions;
  MI0.stripSentryFramesAndReverse = IPA.stripSentryFramesAndReverse;
  MI0.isMatchingPattern = YPA.isMatchingPattern;
  MI0.safeJoin = YPA.safeJoin;
  MI0.snipLine = YPA.snipLine;
  MI0.stringMatchesSomePattern = YPA.stringMatchesSomePattern;
  MI0.truncate = YPA.truncate;
  MI0.isNativeFetch = rn.isNativeFetch;
  MI0.supportsDOMError = rn.supportsDOMError;
  MI0.supportsDOMException = rn.supportsDOMException;
  MI0.supportsErrorEvent = rn.supportsErrorEvent;
  MI0.supportsFetch = rn.supportsFetch;
  MI0.supportsNativeFetch = rn.supportsNativeFetch;
  MI0.supportsReferrerPolicy = rn.supportsReferrerPolicy;
  MI0.supportsReportingObserver = rn.supportsReportingObserver;
  MI0.SyncPromise = LI0.SyncPromise;
  MI0.rejectedSyncPromise = LI0.rejectedSyncPromise;
  MI0.resolvedSyncPromise = LI0.resolvedSyncPromise;
  Object.defineProperty(MI0, "_browserPerformanceTimeOriginMode", {
    enumerable: !0,
    get: () => JPA._browserPerformanceTimeOriginMode
  });
  MI0.browserPerformanceTimeOrigin = JPA.browserPerformanceTimeOrigin;
  MI0.dateTimestampInSeconds = JPA.dateTimestampInSeconds;
  MI0.timestampInSeconds = JPA.timestampInSeconds;
  MI0.timestampWithMs = JPA.timestampWithMs;
  MI0.TRACEPARENT_REGEXP = WPA.TRACEPARENT_REGEXP;
  MI0.extractTraceparentData = WPA.extractTraceparentData;
  MI0.generateSentryTraceHeader = WPA.generateSentryTraceHeader;
  MI0.propagationContextFromHeaders = WPA.propagationContextFromHeaders;
  MI0.tracingContextFromHeaders = WPA.tracingContextFromHeaders;
  MI0.getSDKSource = Vi2.getSDKSource;
  MI0.isBrowserBundle = Vi2.isBrowserBundle;
  MI0.addItemToEnvelope = cy.addItemToEnvelope;
  MI0.createAttachmentEnvelopeItem = cy.createAttachmentEnvelopeItem;
  MI0.createEnvelope = cy.createEnvelope;
  MI0.createEventEnvelopeHeaders = cy.createEventEnvelopeHeaders;
  MI0.envelopeContainsItemType = cy.envelopeContainsItemType;
  MI0.envelopeItemTypeToDataCategory = cy.envelopeItemTypeToDataCategory;
  MI0.forEachEnvelopeItem = cy.forEachEnvelopeItem;
  MI0.getSdkMetadataForEnvelopeHeader = cy.getSdkMetadataForEnvelopeHeader;
  MI0.parseEnvelope = cy.parseEnvelope;
  MI0.serializeEnvelope = cy.serializeEnvelope;
  MI0.createClientReportEnvelope = N93.createClientReportEnvelope;
  MI0.DEFAULT_RETRY_AFTER = XPA.DEFAULT_RETRY_AFTER;
  MI0.disabledUntil = XPA.disabledUntil;
  MI0.isRateLimited = XPA.isRateLimited;
  MI0.parseRetryAfterHeader = XPA.parseRetryAfterHeader;
  MI0.updateRateLimits = XPA.updateRateLimits;
  MI0.BAGGAGE_HEADER_NAME = YXA.BAGGAGE_HEADER_NAME;
  MI0.MAX_BAGGAGE_STRING_LENGTH = YXA.MAX_BAGGAGE_STRING_LENGTH;
  MI0.SENTRY_BAGGAGE_KEY_PREFIX = YXA.SENTRY_BAGGAGE_KEY_PREFIX;
  MI0.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = YXA.SENTRY_BAGGAGE_KEY_PREFIX_REGEX;
  MI0.baggageHeaderToDynamicSamplingContext = YXA.baggageHeaderToDynamicSamplingContext;
  MI0.dynamicSamplingContextToSentryBaggageHeader = YXA.dynamicSamplingContextToSentryBaggageHeader;
  MI0.getNumberOfUrlSegments = c71.getNumberOfUrlSegments;
  MI0.getSanitizedUrlString = c71.getSanitizedUrlString;
  MI0.parseUrl = c71.parseUrl;
  MI0.stripUrlQueryAndFragment = c71.stripUrlQueryAndFragment;
  MI0.addOrUpdateIntegration = L93.addOrUpdateIntegration;
  MI0.makeFifoCache = M93.makeFifoCache;
  MI0.eventFromMessage = p71.eventFromMessage;
  MI0.eventFromUnknownInput = p71.eventFromUnknownInput;
  MI0.exceptionFromError = p71.exceptionFromError;
  MI0.parseStackFrames = p71.parseStackFrames;
  MI0.callFrameToStackFrame = Fi2.callFrameToStackFrame;
  MI0.watchdogTimer = Fi2.watchdogTimer;
  MI0.LRUMap = O93.LRUMap;
  MI0._asyncNullishCoalesce = R93._asyncNullishCoalesce;
  MI0._asyncOptionalChain = T93._asyncOptionalChain;
  MI0._asyncOptionalChainDelete = P93._asyncOptionalChainDelete;
  MI0._nullishCoalesce = j93._nullishCoalesce;
  MI0._optionalChain = S93._optionalChain;
  MI0._optionalChainDelete = _93._optionalChainDelete;
  MI0.addConsoleInstrumentationHandler = k93.addConsoleInstrumentationHandler;
  MI0.addClickKeypressInstrumentationHandler = y93.addClickKeypressInstrumentationHandler;
  MI0.SENTRY_XHR_DATA_KEY = Ki2.SENTRY_XHR_DATA_KEY;
  MI0.addXhrInstrumentationHandler = Ki2.addXhrInstrumentationHandler;
  MI0.addFetchInstrumentationHandler = x93.addFetchInstrumentationHandler;
  MI0.addHistoryInstrumentationHandler = v93.addHistoryInstrumentationHandler;
  MI0.addGlobalErrorInstrumentationHandler = b93.addGlobalErrorInstrumentationHandler;
  MI0.addGlobalUnhandledRejectionInstrumentationHandler = f93.addGlobalUnhandledRejectionInstrumentationHandler;
  MI0.resetInstrumentationHandlers = h93.resetInstrumentationHandlers;
  MI0.filenameIsInApp = g93.filenameIsInApp;
  MI0.escapeStringForRegex = u93.escapeStringForRegex;
  MI0.supportsHistory = m93.supportsHistory
})
// @from(Start 12525590, End 12525762)
ZV = z((Di2) => {
  Object.defineProperty(Di2, "__esModule", {
    value: !0
  });
  var d63 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  Di2.DEBUG_BUILD = d63
})
// @from(Start 12525768, End 12525912)
JXA = z((Hi2) => {
  Object.defineProperty(Hi2, "__esModule", {
    value: !0
  });
  var p63 = "production";
  Hi2.DEFAULT_ENVIRONMENT = p63
})
// @from(Start 12525918, End 12526761)
VPA = z((Ei2) => {
  Object.defineProperty(Ei2, "__esModule", {
    value: !0
  });
  var l71 = i0(),
    i63 = ZV();

  function Ci2() {
    return l71.getGlobalSingleton("globalEventProcessors", () => [])
  }

  function n63(A) {
    Ci2().push(A)
  }

  function OI0(A, Q, B, G = 0) {
    return new l71.SyncPromise((Z, I) => {
      let Y = A[G];
      if (Q === null || typeof Y !== "function") Z(Q);
      else {
        let J = Y({
          ...Q
        }, B);
        if (i63.DEBUG_BUILD && Y.id && J === null && l71.logger.log(`Event processor "${Y.id}" dropped event`), l71.isThenable(J)) J.then((W) => OI0(A, W, B, G + 1).then(Z)).then(null, I);
        else OI0(A, J, B, G + 1).then(Z).then(null, I)
      }
    })
  }
  Ei2.addGlobalEventProcessor = n63;
  Ei2.getGlobalEventProcessors = Ci2;
  Ei2.notifyEventProcessors = OI0
})
// @from(Start 12526767, End 12529185)
WXA = z((zi2) => {
  Object.defineProperty(zi2, "__esModule", {
    value: !0
  });
  var FPA = i0();

  function o63(A) {
    let Q = FPA.timestampInSeconds(),
      B = {
        sid: FPA.uuid4(),
        init: !0,
        timestamp: Q,
        started: Q,
        duration: 0,
        status: "ok",
        errors: 0,
        ignoreDuration: !1,
        toJSON: () => e63(B)
      };
    if (A) RI0(B, A);
    return B
  }

  function RI0(A, Q = {}) {
    if (Q.user) {
      if (!A.ipAddress && Q.user.ip_address) A.ipAddress = Q.user.ip_address;
      if (!A.did && !Q.did) A.did = Q.user.id || Q.user.email || Q.user.username
    }
    if (A.timestamp = Q.timestamp || FPA.timestampInSeconds(), Q.abnormal_mechanism) A.abnormal_mechanism = Q.abnormal_mechanism;
    if (Q.ignoreDuration) A.ignoreDuration = Q.ignoreDuration;
    if (Q.sid) A.sid = Q.sid.length === 32 ? Q.sid : FPA.uuid4();
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

  function t63(A, Q) {
    let B = {};
    if (Q) B = {
      status: Q
    };
    else if (A.status === "ok") B = {
      status: "exited"
    };
    RI0(A, B)
  }

  function e63(A) {
    return FPA.dropUndefinedKeys({
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
  zi2.closeSession = t63;
  zi2.makeSession = o63;
  zi2.updateSession = RI0
})
// @from(Start 12529191, End 12530674)
E$ = z((Ni2) => {
  Object.defineProperty(Ni2, "__esModule", {
    value: !0
  });
  var TI0 = i0(),
    G53 = 0,
    $i2 = 1;

  function Z53(A) {
    let {
      spanId: Q,
      traceId: B
    } = A.spanContext(), {
      data: G,
      op: Z,
      parent_span_id: I,
      status: Y,
      tags: J,
      origin: W
    } = wi2(A);
    return TI0.dropUndefinedKeys({
      data: G,
      op: Z,
      parent_span_id: I,
      span_id: Q,
      status: Y,
      tags: J,
      trace_id: B,
      origin: W
    })
  }

  function I53(A) {
    let {
      traceId: Q,
      spanId: B
    } = A.spanContext(), G = qi2(A);
    return TI0.generateSentryTraceHeader(Q, B, G)
  }

  function Y53(A) {
    if (typeof A === "number") return Ui2(A);
    if (Array.isArray(A)) return A[0] + A[1] / 1e9;
    if (A instanceof Date) return Ui2(A.getTime());
    return TI0.timestampInSeconds()
  }

  function Ui2(A) {
    return A > 9999999999 ? A / 1000 : A
  }

  function wi2(A) {
    if (J53(A)) return A.getSpanJSON();
    if (typeof A.toJSON === "function") return A.toJSON();
    return {}
  }

  function J53(A) {
    return typeof A.getSpanJSON === "function"
  }

  function qi2(A) {
    let {
      traceFlags: Q
    } = A.spanContext();
    return Boolean(Q & $i2)
  }
  Ni2.TRACE_FLAG_NONE = G53;
  Ni2.TRACE_FLAG_SAMPLED = $i2;
  Ni2.spanIsSampled = qi2;
  Ni2.spanTimeInputToSeconds = Y53;
  Ni2.spanToJSON = wi2;
  Ni2.spanToTraceContext = Z53;
  Ni2.spanToTraceHeader = I53
})
// @from(Start 12530680, End 12535695)
i71 = z((Ti2) => {
  Object.defineProperty(Ti2, "__esModule", {
    value: !0
  });
  var cq = i0(),
    C53 = JXA(),
    Li2 = VPA(),
    jI0 = a71(),
    PI0 = n71(),
    E53 = E$();

  function z53(A, Q, B, G, Z, I) {
    let {
      normalizeDepth: Y = 3,
      normalizeMaxBreadth: J = 1000
    } = A, W = {
      ...Q,
      event_id: Q.event_id || B.event_id || cq.uuid4(),
      timestamp: Q.timestamp || cq.dateTimestampInSeconds()
    }, X = B.integrations || A.integrations.map((E) => E.name);
    if (U53(W, A), $53(W, X), Q.type === void 0) Oi2(W, A.stackParser);
    let V = q53(G, B.captureContext);
    if (B.mechanism) cq.addExceptionMechanism(W, B.mechanism);
    let F = Z && Z.getEventProcessors ? Z.getEventProcessors() : [],
      K = jI0.getGlobalScope().getScopeData();
    if (I) {
      let E = I.getScopeData();
      PI0.mergeScopeData(K, E)
    }
    if (V) {
      let E = V.getScopeData();
      PI0.mergeScopeData(K, E)
    }
    let D = [...B.attachments || [], ...K.attachments];
    if (D.length) B.attachments = D;
    PI0.applyScopeDataToEvent(W, K);
    let H = [...F, ...Li2.getGlobalEventProcessors(), ...K.eventProcessors];
    return Li2.notifyEventProcessors(H, W, B).then((E) => {
      if (E) Ri2(E);
      if (typeof Y === "number" && Y > 0) return w53(E, Y, J);
      return E
    })
  }

  function U53(A, Q) {
    let {
      environment: B,
      release: G,
      dist: Z,
      maxValueLength: I = 250
    } = Q;
    if (!("environment" in A)) A.environment = "environment" in Q ? B : C53.DEFAULT_ENVIRONMENT;
    if (A.release === void 0 && G !== void 0) A.release = G;
    if (A.dist === void 0 && Z !== void 0) A.dist = Z;
    if (A.message) A.message = cq.truncate(A.message, I);
    let Y = A.exception && A.exception.values && A.exception.values[0];
    if (Y && Y.value) Y.value = cq.truncate(Y.value, I);
    let J = A.request;
    if (J && J.url) J.url = cq.truncate(J.url, I)
  }
  var Mi2 = new WeakMap;

  function Oi2(A, Q) {
    let B = cq.GLOBAL_OBJ._sentryDebugIds;
    if (!B) return;
    let G, Z = Mi2.get(Q);
    if (Z) G = Z;
    else G = new Map, Mi2.set(Q, G);
    let I = Object.keys(B).reduce((Y, J) => {
      let W, X = G.get(J);
      if (X) W = X;
      else W = Q(J), G.set(J, W);
      for (let V = W.length - 1; V >= 0; V--) {
        let F = W[V];
        if (F.filename) {
          Y[F.filename] = B[J];
          break
        }
      }
      return Y
    }, {});
    try {
      A.exception.values.forEach((Y) => {
        Y.stacktrace.frames.forEach((J) => {
          if (J.filename) J.debug_id = I[J.filename]
        })
      })
    } catch (Y) {}
  }

  function Ri2(A) {
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

  function $53(A, Q) {
    if (Q.length > 0) A.sdk = A.sdk || {}, A.sdk.integrations = [...A.sdk.integrations || [], ...Q]
  }

  function w53(A, Q, B) {
    if (!A) return null;
    let G = {
      ...A,
      ...A.breadcrumbs && {
        breadcrumbs: A.breadcrumbs.map((Z) => ({
          ...Z,
          ...Z.data && {
            data: cq.normalize(Z.data, Q, B)
          }
        }))
      },
      ...A.user && {
        user: cq.normalize(A.user, Q, B)
      },
      ...A.contexts && {
        contexts: cq.normalize(A.contexts, Q, B)
      },
      ...A.extra && {
        extra: cq.normalize(A.extra, Q, B)
      }
    };
    if (A.contexts && A.contexts.trace && G.contexts) {
      if (G.contexts.trace = A.contexts.trace, A.contexts.trace.data) G.contexts.trace.data = cq.normalize(A.contexts.trace.data, Q, B)
    }
    if (A.spans) G.spans = A.spans.map((Z) => {
      let I = E53.spanToJSON(Z).data;
      if (I) Z.data = cq.normalize(I, Q, B);
      return Z
    });
    return G
  }

  function q53(A, Q) {
    if (!Q) return A;
    let B = A ? A.clone() : new jI0.Scope;
    return B.update(Q), B
  }

  function N53(A) {
    if (!A) return;
    if (L53(A)) return {
      captureContext: A
    };
    if (O53(A)) return {
      captureContext: A
    };
    return A
  }

  function L53(A) {
    return A instanceof jI0.Scope || typeof A === "function"
  }
  var M53 = ["user", "level", "extra", "contexts", "tags", "fingerprint", "requestSession", "propagationContext"];

  function O53(A) {
    return Object.keys(A).some((Q) => M53.includes(Q))
  }
  Ti2.applyDebugIds = Oi2;
  Ti2.applyDebugMeta = Ri2;
  Ti2.parseEventHintOrCaptureContext = N53;
  Ti2.prepareEvent = z53
})
// @from(Start 12535701, End 12540670)
jO = z((Si2) => {
  Object.defineProperty(Si2, "__esModule", {
    value: !0
  });
  var Dg = i0(),
    S53 = JXA(),
    s71 = ZV(),
    cW = py(),
    SI0 = WXA(),
    _53 = i71();

  function k53(A, Q) {
    return cW.getCurrentHub().captureException(A, _53.parseEventHintOrCaptureContext(Q))
  }

  function y53(A, Q) {
    let B = typeof Q === "string" ? Q : void 0,
      G = typeof Q !== "string" ? {
        captureContext: Q
      } : void 0;
    return cW.getCurrentHub().captureMessage(A, B, G)
  }

  function x53(A, Q) {
    return cW.getCurrentHub().captureEvent(A, Q)
  }

  function v53(A) {
    cW.getCurrentHub().configureScope(A)
  }

  function b53(A, Q) {
    cW.getCurrentHub().addBreadcrumb(A, Q)
  }

  function f53(A, Q) {
    cW.getCurrentHub().setContext(A, Q)
  }

  function h53(A) {
    cW.getCurrentHub().setExtras(A)
  }

  function g53(A, Q) {
    cW.getCurrentHub().setExtra(A, Q)
  }

  function u53(A) {
    cW.getCurrentHub().setTags(A)
  }

  function m53(A, Q) {
    cW.getCurrentHub().setTag(A, Q)
  }

  function d53(A) {
    cW.getCurrentHub().setUser(A)
  }

  function Pi2(...A) {
    let Q = cW.getCurrentHub();
    if (A.length === 2) {
      let [B, G] = A;
      if (!B) return Q.withScope(G);
      return Q.withScope(() => {
        return Q.getStackTop().scope = B, G(B)
      })
    }
    return Q.withScope(A[0])
  }

  function c53(A) {
    return cW.runWithAsyncContext(() => {
      return A(cW.getIsolationScope())
    })
  }

  function p53(A, Q) {
    return Pi2((B) => {
      return B.setSpan(A), Q(B)
    })
  }

  function l53(A, Q) {
    return cW.getCurrentHub().startTransaction({
      ...A
    }, Q)
  }

  function _I0(A, Q) {
    let B = KPA(),
      G = n0A();
    if (!G) s71.DEBUG_BUILD && Dg.logger.warn("Cannot capture check-in. No client defined.");
    else if (!G.captureCheckIn) s71.DEBUG_BUILD && Dg.logger.warn("Cannot capture check-in. Client does not support sending check-ins.");
    else return G.captureCheckIn(A, Q, B);
    return Dg.uuid4()
  }

  function i53(A, Q, B) {
    let G = _I0({
        monitorSlug: A,
        status: "in_progress"
      }, B),
      Z = Dg.timestampInSeconds();

    function I(J) {
      _I0({
        monitorSlug: A,
        status: J,
        checkInId: G,
        duration: Dg.timestampInSeconds() - Z
      })
    }
    let Y;
    try {
      Y = Q()
    } catch (J) {
      throw I("error"), J
    }
    if (Dg.isThenable(Y)) Promise.resolve(Y).then(() => {
      I("ok")
    }, () => {
      I("error")
    });
    else I("ok");
    return Y
  }
  async function n53(A) {
    let Q = n0A();
    if (Q) return Q.flush(A);
    return s71.DEBUG_BUILD && Dg.logger.warn("Cannot flush events. No client defined."), Promise.resolve(!1)
  }
  async function a53(A) {
    let Q = n0A();
    if (Q) return Q.close(A);
    return s71.DEBUG_BUILD && Dg.logger.warn("Cannot flush events and disable SDK. No client defined."), Promise.resolve(!1)
  }

  function s53() {
    return cW.getCurrentHub().lastEventId()
  }

  function n0A() {
    return cW.getCurrentHub().getClient()
  }

  function r53() {
    return !!n0A()
  }

  function KPA() {
    return cW.getCurrentHub().getScope()
  }

  function o53(A) {
    let Q = n0A(),
      B = cW.getIsolationScope(),
      G = KPA(),
      {
        release: Z,
        environment: I = S53.DEFAULT_ENVIRONMENT
      } = Q && Q.getOptions() || {},
      {
        userAgent: Y
      } = Dg.GLOBAL_OBJ.navigator || {},
      J = SI0.makeSession({
        release: Z,
        environment: I,
        user: G.getUser() || B.getUser(),
        ...Y && {
          userAgent: Y
        },
        ...A
      }),
      W = B.getSession();
    if (W && W.status === "ok") SI0.updateSession(W, {
      status: "exited"
    });
    return kI0(), B.setSession(J), G.setSession(J), J
  }

  function kI0() {
    let A = cW.getIsolationScope(),
      Q = KPA(),
      B = Q.getSession() || A.getSession();
    if (B) SI0.closeSession(B);
    ji2(), A.setSession(), Q.setSession()
  }

  function ji2() {
    let A = cW.getIsolationScope(),
      Q = KPA(),
      B = n0A(),
      G = Q.getSession() || A.getSession();
    if (G && B && B.captureSession) B.captureSession(G)
  }

  function t53(A = !1) {
    if (A) {
      kI0();
      return
    }
    ji2()
  }
  Si2.addBreadcrumb = b53;
  Si2.captureCheckIn = _I0;
  Si2.captureEvent = x53;
  Si2.captureException = k53;
  Si2.captureMessage = y53;
  Si2.captureSession = t53;
  Si2.close = a53;
  Si2.configureScope = v53;
  Si2.endSession = kI0;
  Si2.flush = n53;
  Si2.getClient = n0A;
  Si2.getCurrentScope = KPA;
  Si2.isInitialized = r53;
  Si2.lastEventId = s53;
  Si2.setContext = f53;
  Si2.setExtra = g53;
  Si2.setExtras = h53;
  Si2.setTag = m53;
  Si2.setTags = u53;
  Si2.setUser = d53;
  Si2.startSession = o53;
  Si2.startTransaction = l53;
  Si2.withActiveSpan = p53;
  Si2.withIsolationScope = c53;
  Si2.withMonitor = i53;
  Si2.withScope = Pi2
})
// @from(Start 12540676, End 12540836)
XXA = z((_i2) => {
  Object.defineProperty(_i2, "__esModule", {
    value: !0
  });

  function O33(A) {
    return A.transaction
  }
  _i2.getRootSpan = O33
})
// @from(Start 12540842, End 12542098)
a0A = z((xi2) => {
  Object.defineProperty(xi2, "__esModule", {
    value: !0
  });
  var T33 = i0(),
    P33 = JXA(),
    ki2 = jO(),
    j33 = XXA(),
    yI0 = E$();

  function yi2(A, Q, B) {
    let G = Q.getOptions(),
      {
        publicKey: Z
      } = Q.getDsn() || {},
      {
        segment: I
      } = B && B.getUser() || {},
      Y = T33.dropUndefinedKeys({
        environment: G.environment || P33.DEFAULT_ENVIRONMENT,
        release: G.release,
        user_segment: I,
        public_key: Z,
        trace_id: A
      });
    return Q.emit && Q.emit("createDsc", Y), Y
  }

  function S33(A) {
    let Q = ki2.getClient();
    if (!Q) return {};
    let B = yi2(yI0.spanToJSON(A).trace_id || "", Q, ki2.getCurrentScope()),
      G = j33.getRootSpan(A);
    if (!G) return B;
    let Z = G && G._frozenDynamicSamplingContext;
    if (Z) return Z;
    let {
      sampleRate: I,
      source: Y
    } = G.metadata;
    if (I != null) B.sample_rate = `${I}`;
    let J = yI0.spanToJSON(G);
    if (Y && Y !== "url") B.transaction = J.description;
    return B.sampled = String(yI0.spanIsSampled(G)), Q.emit && Q.emit("createDsc", B), B
  }
  xi2.getDynamicSamplingContextFromClient = yi2;
  xi2.getDynamicSamplingContextFromSpan = S33
})
// @from(Start 12542104, End 12545189)
n71 = z((bi2) => {
  Object.defineProperty(bi2, "__esModule", {
    value: !0
  });
  var DPA = i0(),
    y33 = a0A(),
    x33 = XXA(),
    vi2 = E$();

  function v33(A, Q) {
    let {
      fingerprint: B,
      span: G,
      breadcrumbs: Z,
      sdkProcessingMetadata: I
    } = Q;
    if (f33(A, Q), G) u33(A, G);
    m33(A, B), h33(A, Z), g33(A, I)
  }

  function b33(A, Q) {
    let {
      extra: B,
      tags: G,
      user: Z,
      contexts: I,
      level: Y,
      sdkProcessingMetadata: J,
      breadcrumbs: W,
      fingerprint: X,
      eventProcessors: V,
      attachments: F,
      propagationContext: K,
      transactionName: D,
      span: H
    } = Q;
    if (VXA(A, "extra", B), VXA(A, "tags", G), VXA(A, "user", Z), VXA(A, "contexts", I), VXA(A, "sdkProcessingMetadata", J), Y) A.level = Y;
    if (D) A.transactionName = D;
    if (H) A.span = H;
    if (W.length) A.breadcrumbs = [...A.breadcrumbs, ...W];
    if (X.length) A.fingerprint = [...A.fingerprint, ...X];
    if (V.length) A.eventProcessors = [...A.eventProcessors, ...V];
    if (F.length) A.attachments = [...A.attachments, ...F];
    A.propagationContext = {
      ...A.propagationContext,
      ...K
    }
  }

  function VXA(A, Q, B) {
    if (B && Object.keys(B).length) {
      A[Q] = {
        ...A[Q]
      };
      for (let G in B)
        if (Object.prototype.hasOwnProperty.call(B, G)) A[Q][G] = B[G]
    }
  }

  function f33(A, Q) {
    let {
      extra: B,
      tags: G,
      user: Z,
      contexts: I,
      level: Y,
      transactionName: J
    } = Q, W = DPA.dropUndefinedKeys(B);
    if (W && Object.keys(W).length) A.extra = {
      ...W,
      ...A.extra
    };
    let X = DPA.dropUndefinedKeys(G);
    if (X && Object.keys(X).length) A.tags = {
      ...X,
      ...A.tags
    };
    let V = DPA.dropUndefinedKeys(Z);
    if (V && Object.keys(V).length) A.user = {
      ...V,
      ...A.user
    };
    let F = DPA.dropUndefinedKeys(I);
    if (F && Object.keys(F).length) A.contexts = {
      ...F,
      ...A.contexts
    };
    if (Y) A.level = Y;
    if (J) A.transaction = J
  }

  function h33(A, Q) {
    let B = [...A.breadcrumbs || [], ...Q];
    A.breadcrumbs = B.length ? B : void 0
  }

  function g33(A, Q) {
    A.sdkProcessingMetadata = {
      ...A.sdkProcessingMetadata,
      ...Q
    }
  }

  function u33(A, Q) {
    A.contexts = {
      trace: vi2.spanToTraceContext(Q),
      ...A.contexts
    };
    let B = x33.getRootSpan(Q);
    if (B) {
      A.sdkProcessingMetadata = {
        dynamicSamplingContext: y33.getDynamicSamplingContextFromSpan(Q),
        ...A.sdkProcessingMetadata
      };
      let G = vi2.spanToJSON(B).description;
      if (G) A.tags = {
        transaction: G,
        ...A.tags
      }
    }
  }

  function m33(A, Q) {
    if (A.fingerprint = A.fingerprint ? DPA.arrayify(A.fingerprint) : [], Q) A.fingerprint = A.fingerprint.concat(Q);
    if (A.fingerprint && !A.fingerprint.length) delete A.fingerprint
  }
  bi2.applyScopeDataToEvent = v33;
  bi2.mergeAndOverwriteScopeData = VXA;
  bi2.mergeScopeData = b33
})
// @from(Start 12545195, End 12554007)
a71 = z((gi2) => {
  Object.defineProperty(gi2, "__esModule", {
    value: !0
  });
  var ly = i0(),
    fi2 = VPA(),
    l33 = WXA(),
    i33 = n71(),
    n33 = 100,
    r71;
  class FXA {
    constructor() {
      this._notifyingListeners = !1, this._scopeListeners = [], this._eventProcessors = [], this._breadcrumbs = [], this._attachments = [], this._user = {}, this._tags = {}, this._extra = {}, this._contexts = {}, this._sdkProcessingMetadata = {}, this._propagationContext = hi2()
    }
    static clone(A) {
      return A ? A.clone() : new FXA
    }
    clone() {
      let A = new FXA;
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
        }, this._session) l33.updateSession(this._session, {
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
      if (Q instanceof FXA) {
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
      } else if (ly.isPlainObject(Q)) {
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
      return this._breadcrumbs = [], this._tags = {}, this._extra = {}, this._user = {}, this._contexts = {}, this._level = void 0, this._transactionName = void 0, this._fingerprint = void 0, this._requestSession = void 0, this._span = void 0, this._session = void 0, this._notifyScopeListeners(), this._attachments = [], this._propagationContext = hi2(), this
    }
    addBreadcrumb(A, Q) {
      let B = typeof Q === "number" ? Q : n33;
      if (B <= 0) return this;
      let G = {
          timestamp: ly.dateTimestampInSeconds(),
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
        _user: I,
        _level: Y,
        _fingerprint: J,
        _eventProcessors: W,
        _propagationContext: X,
        _sdkProcessingMetadata: V,
        _transactionName: F,
        _span: K
      } = this;
      return {
        breadcrumbs: A,
        attachments: Q,
        contexts: B,
        tags: G,
        extra: Z,
        user: I,
        level: Y,
        fingerprint: J || [],
        eventProcessors: W,
        propagationContext: X,
        sdkProcessingMetadata: V,
        transactionName: F,
        span: K
      }
    }
    applyToEvent(A, Q = {}, B = []) {
      i33.applyScopeDataToEvent(A, this.getScopeData());
      let G = [...B, ...fi2.getGlobalEventProcessors(), ...this._eventProcessors];
      return fi2.notifyEventProcessors(G, A, Q)
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
      let B = Q && Q.event_id ? Q.event_id : ly.uuid4();
      if (!this._client) return ly.logger.warn("No client configured on scope - will not capture exception!"), B;
      let G = Error("Sentry syntheticException");
      return this._client.captureException(A, {
        originalException: A,
        syntheticException: G,
        ...Q,
        event_id: B
      }, this), B
    }
    captureMessage(A, Q, B) {
      let G = B && B.event_id ? B.event_id : ly.uuid4();
      if (!this._client) return ly.logger.warn("No client configured on scope - will not capture message!"), G;
      let Z = Error(A);
      return this._client.captureMessage(A, Q, {
        originalException: A,
        syntheticException: Z,
        ...B,
        event_id: G
      }, this), G
    }
    captureEvent(A, Q) {
      let B = Q && Q.event_id ? Q.event_id : ly.uuid4();
      if (!this._client) return ly.logger.warn("No client configured on scope - will not capture event!"), B;
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

  function a33() {
    if (!r71) r71 = new FXA;
    return r71
  }

  function s33(A) {
    r71 = A
  }

  function hi2() {
    return {
      traceId: ly.uuid4(),
      spanId: ly.uuid4().substring(16)
    }
  }
  gi2.Scope = FXA;
  gi2.getGlobalScope = a33;
  gi2.setGlobalScope = s33
})
// @from(Start 12554013, End 12554146)
o71 = z((ui2) => {
  Object.defineProperty(ui2, "__esModule", {
    value: !0
  });
  var e33 = "7.120.3";
  ui2.SDK_VERSION = e33
})
// @from(Start 12554152, End 12562218)
py = z((li2) => {
  Object.defineProperty(li2, "__esModule", {
    value: !0
  });
  var rE = i0(),
    Q73 = JXA(),
    xI0 = ZV(),
    mi2 = a71(),
    vI0 = WXA(),
    B73 = o71(),
    t71 = parseFloat(B73.SDK_VERSION),
    G73 = 100;
  class CPA {
    constructor(A, Q, B, G = t71) {
      this._version = G;
      let Z;
      if (!Q) Z = new mi2.Scope, Z.setClient(A);
      else Z = Q;
      let I;
      if (!B) I = new mi2.Scope, I.setClient(A);
      else I = B;
      if (this._stack = [{
          scope: Z
        }], A) this.bindClient(A);
      this._isolationScope = I
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
      if (rE.isThenable(B)) return B.then((G) => {
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
      let B = this._lastEventId = Q && Q.event_id ? Q.event_id : rE.uuid4(),
        G = Error("Sentry syntheticException");
      return this.getScope().captureException(A, {
        originalException: A,
        syntheticException: G,
        ...Q,
        event_id: B
      }), B
    }
    captureMessage(A, Q, B) {
      let G = this._lastEventId = B && B.event_id ? B.event_id : rE.uuid4(),
        Z = Error(A);
      return this.getScope().captureMessage(A, Q, {
        originalException: A,
        syntheticException: Z,
        ...B,
        event_id: G
      }), G
    }
    captureEvent(A, Q) {
      let B = Q && Q.event_id ? Q.event_id : rE.uuid4();
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
        maxBreadcrumbs: I = G73
      } = G.getOptions && G.getOptions() || {};
      if (I <= 0) return;
      let J = {
          timestamp: rE.dateTimestampInSeconds(),
          ...A
        },
        W = Z ? rE.consoleSandbox(() => Z(J, Q)) : J;
      if (W === null) return;
      if (G.emit) G.emit("beforeAddBreadcrumb", W, Q);
      B.addBreadcrumb(W, I)
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
      let Q = bI0(this);
      try {
        A(this)
      } finally {
        bI0(Q)
      }
    }
    getIntegration(A) {
      let Q = this.getClient();
      if (!Q) return null;
      try {
        return Q.getIntegration(A)
      } catch (B) {
        return xI0.DEBUG_BUILD && rE.logger.warn(`Cannot retrieve integration ${A.id} from the current Hub`), null
      }
    }
    startTransaction(A, Q) {
      let B = this._callExtensionMethod("startTransaction", A, Q);
      if (xI0.DEBUG_BUILD && !B)
        if (!this.getClient()) rE.logger.warn("Tracing extension 'startTransaction' is missing. You should 'init' the SDK before calling 'startTransaction'");
        else rE.logger.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
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
      if (B) vI0.closeSession(B);
      this._sendSessionUpdate(), Q.setSession()
    }
    startSession(A) {
      let {
        scope: Q,
        client: B
      } = this.getStackTop(), {
        release: G,
        environment: Z = Q73.DEFAULT_ENVIRONMENT
      } = B && B.getOptions() || {}, {
        userAgent: I
      } = rE.GLOBAL_OBJ.navigator || {}, Y = vI0.makeSession({
        release: G,
        environment: Z,
        user: Q.getUser(),
        ...I && {
          userAgent: I
        },
        ...A
      }), J = Q.getSession && Q.getSession();
      if (J && J.status === "ok") vI0.updateSession(J, {
        status: "exited"
      });
      return this.endSession(), Q.setSession(Y), Y
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
      let G = s0A().__SENTRY__;
      if (G && G.extensions && typeof G.extensions[A] === "function") return G.extensions[A].apply(this, Q);
      xI0.DEBUG_BUILD && rE.logger.warn(`Extension method ${A} couldn't be found, doing nothing.`)
    }
  }

  function s0A() {
    return rE.GLOBAL_OBJ.__SENTRY__ = rE.GLOBAL_OBJ.__SENTRY__ || {
      extensions: {},
      hub: void 0
    }, rE.GLOBAL_OBJ
  }

  function bI0(A) {
    let Q = s0A(),
      B = HPA(Q);
    return e71(Q, A), B
  }

  function di2() {
    let A = s0A();
    if (A.__SENTRY__ && A.__SENTRY__.acs) {
      let Q = A.__SENTRY__.acs.getCurrentHub();
      if (Q) return Q
    }
    return ci2(A)
  }

  function Z73() {
    return di2().getIsolationScope()
  }

  function ci2(A = s0A()) {
    if (!pi2(A) || HPA(A).isOlderThan(t71)) e71(A, new CPA);
    return HPA(A)
  }

  function I73(A, Q = ci2()) {
    if (!pi2(A) || HPA(A).isOlderThan(t71)) {
      let B = Q.getClient(),
        G = Q.getScope(),
        Z = Q.getIsolationScope();
      e71(A, new CPA(B, G.clone(), Z.clone()))
    }
  }

  function Y73(A) {
    let Q = s0A();
    Q.__SENTRY__ = Q.__SENTRY__ || {}, Q.__SENTRY__.acs = A
  }

  function J73(A, Q = {}) {
    let B = s0A();
    if (B.__SENTRY__ && B.__SENTRY__.acs) return B.__SENTRY__.acs.runWithAsyncContext(A, Q);
    return A()
  }

  function pi2(A) {
    return !!(A && A.__SENTRY__ && A.__SENTRY__.hub)
  }

  function HPA(A) {
    return rE.getGlobalSingleton("hub", () => new CPA, A)
  }

  function e71(A, Q) {
    if (!A) return !1;
    let B = A.__SENTRY__ = A.__SENTRY__ || {};
    return B.hub = Q, !0
  }
  li2.API_VERSION = t71;
  li2.Hub = CPA;
  li2.ensureHubOnCarrier = I73;
  li2.getCurrentHub = di2;
  li2.getHubFromCarrier = HPA;
  li2.getIsolationScope = Z73;
  li2.getMainCarrier = s0A;
  li2.makeMain = bI0;
  li2.runWithAsyncContext = J73;
  li2.setAsyncContextStrategy = Y73;
  li2.setHubOnCarrier = e71
})
// @from(Start 12562224, End 12562607)
AG1 = z((ni2) => {
  Object.defineProperty(ni2, "__esModule", {
    value: !0
  });
  var ii2 = i0(),
    $73 = py();

  function w73(A) {
    return (A || $73.getCurrentHub()).getScope().getTransaction()
  }
  var q73 = ii2.extractTraceparentData;
  ni2.stripUrlQueryAndFragment = ii2.stripUrlQueryAndFragment;
  ni2.extractTraceparentData = q73;
  ni2.getActiveTransaction = w73
})
// @from(Start 12562613, End 12563218)
QG1 = z((si2) => {
  Object.defineProperty(si2, "__esModule", {
    value: !0
  });
  var fI0 = i0(),
    O73 = ZV(),
    R73 = AG1(),
    ai2 = !1;

  function T73() {
    if (ai2) return;
    ai2 = !0, fI0.addGlobalErrorInstrumentationHandler(hI0), fI0.addGlobalUnhandledRejectionInstrumentationHandler(hI0)
  }

  function hI0() {
    let A = R73.getActiveTransaction();
    if (A) O73.DEBUG_BUILD && fI0.logger.log("[Tracing] Transaction: internal_error -> Global error occured"), A.setStatus("internal_error")
  }
  hI0.tag = "sentry_tracingErrorCallback";
  si2.registerErrorInstrumentation = T73
})
// @from(Start 12563224, End 12565313)
KXA = z((ri2) => {
  Object.defineProperty(ri2, "__esModule", {
    value: !0
  });
  ri2.SpanStatus = void 0;
  (function(A) {
    A.Ok = "ok";
    let B = "deadline_exceeded";
    A.DeadlineExceeded = B;
    let G = "unauthenticated";
    A.Unauthenticated = G;
    let Z = "permission_denied";
    A.PermissionDenied = Z;
    let I = "not_found";
    A.NotFound = I;
    let Y = "resource_exhausted";
    A.ResourceExhausted = Y;
    let J = "invalid_argument";
    A.InvalidArgument = J;
    let W = "unimplemented";
    A.Unimplemented = W;
    let X = "unavailable";
    A.Unavailable = X;
    let V = "internal_error";
    A.InternalError = V;
    let F = "unknown_error";
    A.UnknownError = F;
    let K = "cancelled";
    A.Cancelled = K;
    let D = "already_exists";
    A.AlreadyExists = D;
    let H = "failed_precondition";
    A.FailedPrecondition = H;
    let C = "aborted";
    A.Aborted = C;
    let E = "out_of_range";
    A.OutOfRange = E;
    let U = "data_loss";
    A.DataLoss = U
  })(ri2.SpanStatus || (ri2.SpanStatus = {}));

  function uI0(A) {
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
  var j73 = uI0;

  function S73(A, Q) {
    A.setTag("http.status_code", String(Q)), A.setData("http.response.status_code", Q);
    let B = uI0(Q);
    if (B !== "unknown_error") A.setStatus(B)
  }
  ri2.getSpanStatusFromHttpCode = uI0;
  ri2.setHttpStatus = S73;
  ri2.spanStatusfromHttpCode = j73
})
// @from(Start 12565319, End 12565774)
mI0 = z((oi2) => {
  Object.defineProperty(oi2, "__esModule", {
    value: !0
  });
  var x73 = i0();

  function v73(A, Q, B = () => {}) {
    let G;
    try {
      G = A()
    } catch (Z) {
      throw Q(Z), B(), Z
    }
    return b73(G, Q, B)
  }

  function b73(A, Q, B) {
    if (x73.isThenable(A)) return A.then((G) => {
      return B(), G
    }, (G) => {
      throw Q(G), B(), G
    });
    return B(), A
  }
  oi2.handleCallbackErrors = v73
})
// @from(Start 12565780, End 12566178)
BG1 = z((ti2) => {
  Object.defineProperty(ti2, "__esModule", {
    value: !0
  });
  var h73 = jO();

  function g73(A) {
    if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) return !1;
    let Q = h73.getClient(),
      B = A || Q && Q.getOptions();
    return !!B && (B.enableTracing || ("tracesSampleRate" in B) || ("tracesSampler" in B))
  }
  ti2.hasTracingEnabled = g73
})
// @from(Start 12566184, End 12571140)
YG1 = z((Zn2) => {
  Object.defineProperty(Zn2, "__esModule", {
    value: !0
  });
  var EPA = i0(),
    m73 = ZV(),
    on = py(),
    GG1 = E$();
  QG1();
  KXA();
  var d73 = a0A(),
    DXA = jO(),
    dI0 = mI0(),
    ei2 = BG1();

  function c73(A, Q, B = () => {}, G = () => {}) {
    let Z = on.getCurrentHub(),
      I = DXA.getCurrentScope(),
      Y = I.getSpan(),
      J = IG1(A),
      W = ZG1(Z, {
        parentSpan: Y,
        spanContext: J,
        forceTransaction: !1,
        scope: I
      });
    return I.setSpan(W), dI0.handleCallbackErrors(() => Q(W), (X) => {
      W && W.setStatus("internal_error"), B(X, W)
    }, () => {
      W && W.end(), I.setSpan(Y), G()
    })
  }

  function An2(A, Q) {
    let B = IG1(A);
    return on.runWithAsyncContext(() => {
      return DXA.withScope(A.scope, (G) => {
        let Z = on.getCurrentHub(),
          I = G.getSpan(),
          J = A.onlyIfParent && !I ? void 0 : ZG1(Z, {
            parentSpan: I,
            spanContext: B,
            forceTransaction: A.forceTransaction,
            scope: G
          });
        return dI0.handleCallbackErrors(() => Q(J), () => {
          if (J) {
            let {
              status: W
            } = GG1.spanToJSON(J);
            if (!W || W === "ok") J.setStatus("internal_error")
          }
        }, () => J && J.end())
      })
    })
  }
  var p73 = An2;

  function l73(A, Q) {
    let B = IG1(A);
    return on.runWithAsyncContext(() => {
      return DXA.withScope(A.scope, (G) => {
        let Z = on.getCurrentHub(),
          I = G.getSpan(),
          J = A.onlyIfParent && !I ? void 0 : ZG1(Z, {
            parentSpan: I,
            spanContext: B,
            forceTransaction: A.forceTransaction,
            scope: G
          });

        function W() {
          J && J.end()
        }
        return dI0.handleCallbackErrors(() => Q(J, W), () => {
          if (J && J.isRecording()) {
            let {
              status: X
            } = GG1.spanToJSON(J);
            if (!X || X === "ok") J.setStatus("internal_error")
          }
        })
      })
    })
  }

  function i73(A) {
    if (!ei2.hasTracingEnabled()) return;
    let Q = IG1(A),
      B = on.getCurrentHub(),
      G = A.scope ? A.scope.getSpan() : Qn2();
    if (A.onlyIfParent && !G) return;
    let Y = (A.scope || DXA.getCurrentScope()).clone();
    return ZG1(B, {
      parentSpan: G,
      spanContext: Q,
      forceTransaction: A.forceTransaction,
      scope: Y
    })
  }

  function Qn2() {
    return DXA.getCurrentScope().getSpan()
  }
  var n73 = ({
    sentryTrace: A,
    baggage: Q
  }, B) => {
    let G = DXA.getCurrentScope(),
      {
        traceparentData: Z,
        dynamicSamplingContext: I,
        propagationContext: Y
      } = EPA.tracingContextFromHeaders(A, Q);
    if (G.setPropagationContext(Y), m73.DEBUG_BUILD && Z) EPA.logger.log(`[Tracing] Continuing trace ${Z.traceId}.`);
    let J = {
      ...Z,
      metadata: EPA.dropUndefinedKeys({
        dynamicSamplingContext: I
      })
    };
    if (!B) return J;
    return on.runWithAsyncContext(() => {
      return B(J)
    })
  };

  function ZG1(A, {
    parentSpan: Q,
    spanContext: B,
    forceTransaction: G,
    scope: Z
  }) {
    if (!ei2.hasTracingEnabled()) return;
    let I = on.getIsolationScope(),
      Y;
    if (Q && !G) Y = Q.startChild(B);
    else if (Q) {
      let J = d73.getDynamicSamplingContextFromSpan(Q),
        {
          traceId: W,
          spanId: X
        } = Q.spanContext(),
        V = GG1.spanIsSampled(Q);
      Y = A.startTransaction({
        traceId: W,
        parentSpanId: X,
        parentSampled: V,
        ...B,
        metadata: {
          dynamicSamplingContext: J,
          ...B.metadata
        }
      })
    } else {
      let {
        traceId: J,
        dsc: W,
        parentSpanId: X,
        sampled: V
      } = {
        ...I.getPropagationContext(),
        ...Z.getPropagationContext()
      };
      Y = A.startTransaction({
        traceId: J,
        parentSpanId: X,
        parentSampled: V,
        ...B,
        metadata: {
          dynamicSamplingContext: W,
          ...B.metadata
        }
      })
    }
    return Z.setSpan(Y), a73(Y, Z, I), Y
  }

  function IG1(A) {
    if (A.startTime) {
      let Q = {
        ...A
      };
      return Q.startTimestamp = GG1.spanTimeInputToSeconds(A.startTime), delete Q.startTime, Q
    }
    return A
  }
  var Bn2 = "_sentryScope",
    Gn2 = "_sentryIsolationScope";

  function a73(A, Q, B) {
    if (A) EPA.addNonEnumerableProperty(A, Gn2, B), EPA.addNonEnumerableProperty(A, Bn2, Q)
  }

  function s73(A) {
    return {
      scope: A[Bn2],
      isolationScope: A[Gn2]
    }
  }
  Zn2.continueTrace = n73;
  Zn2.getActiveSpan = Qn2;
  Zn2.getCapturedScopesOnSpan = s73;
  Zn2.startActiveSpan = p73;
  Zn2.startInactiveSpan = i73;
  Zn2.startSpan = An2;
  Zn2.startSpanManual = l73;
  Zn2.trace = c73
})
// @from(Start 12571146, End 12572230)
UPA = z((Yn2) => {
  Object.defineProperty(Yn2, "__esModule", {
    value: !0
  });
  var ZG3 = i0();
  ZV();
  QG1();
  KXA();
  var IG3 = YG1(),
    zPA;

  function In2(A) {
    return zPA ? zPA.get(A) : void 0
  }

  function YG3(A) {
    let Q = In2(A);
    if (!Q) return;
    let B = {};
    for (let [, [G, Z]] of Q) {
      if (!B[G]) B[G] = [];
      B[G].push(ZG3.dropUndefinedKeys(Z))
    }
    return B
  }

  function JG3(A, Q, B, G, Z, I) {
    let Y = IG3.getActiveSpan();
    if (Y) {
      let J = In2(Y) || new Map,
        W = `${A}:${Q}@${G}`,
        X = J.get(I);
      if (X) {
        let [, V] = X;
        J.set(I, [W, {
          min: Math.min(V.min, B),
          max: Math.max(V.max, B),
          count: V.count += 1,
          sum: V.sum += B,
          tags: V.tags
        }])
      } else J.set(I, [W, {
        min: B,
        max: B,
        count: 1,
        sum: B,
        tags: Z
      }]);
      if (!zPA) zPA = new WeakMap;
      zPA.set(Y, J)
    }
  }
  Yn2.getMetricSummaryJsonForSpan = YG3;
  Yn2.updateMetricSummaryOnActiveSpan = JG3
})
// @from(Start 12572236, End 12572684)
$PA = z((Jn2) => {
  Object.defineProperty(Jn2, "__esModule", {
    value: !0
  });
  var VG3 = "sentry.source",
    FG3 = "sentry.sample_rate",
    KG3 = "sentry.op",
    DG3 = "sentry.origin",
    HG3 = "profile_id";
  Jn2.SEMANTIC_ATTRIBUTE_PROFILE_ID = HG3;
  Jn2.SEMANTIC_ATTRIBUTE_SENTRY_OP = KG3;
  Jn2.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = DG3;
  Jn2.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = FG3;
  Jn2.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = VG3
})