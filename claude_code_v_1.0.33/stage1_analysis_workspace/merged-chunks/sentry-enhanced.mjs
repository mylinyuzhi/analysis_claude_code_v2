
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
// @from(Start 12667933, End 12673076)
ts2 = z((os2) => {
  var {
    _optionalChain: en
  } = i0();
  Object.defineProperty(os2, "__esModule", {
    value: !0
  });
  var RPA = i0(),
    rs2 = $$(),
    uV3 = tn(),
    mV3 = ["aggregate", "bulkWrite", "countDocuments", "createIndex", "createIndexes", "deleteMany", "deleteOne", "distinct", "drop", "dropIndex", "dropIndexes", "estimatedDocumentCount", "find", "findOne", "findOneAndDelete", "findOneAndReplace", "findOneAndUpdate", "indexes", "indexExists", "indexInformation", "initializeOrderedBulkOp", "insertMany", "insertOne", "isCapped", "mapReduce", "options", "parallelCollectionScan", "rename", "replaceOne", "stats", "updateMany", "updateOne"],
    dV3 = {
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

  function cV3(A) {
    return A && typeof A === "object" && A.once && typeof A.once === "function"
  }
  class _G1 {
    static __initStatic() {
      this.id = "Mongo"
    }
    constructor(A = {}) {
      this.name = _G1.id, this._operations = Array.isArray(A.operations) ? A.operations : mV3, this._describeOperations = "describeOperations" in A ? A.describeOperations : !0, this._useMongoose = !!A.useMongoose
    }
    loadDependency() {
      let A = this._useMongoose ? "mongoose" : "mongodb";
      return this._module = this._module || RPA.loadModule(A)
    }
    setupOnce(A, Q) {
      if (uV3.shouldDisableAutoInstrumentation(Q)) {
        rs2.DEBUG_BUILD && RPA.logger.log("Mongo Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        let G = this._useMongoose ? "mongoose" : "mongodb";
        rs2.DEBUG_BUILD && RPA.logger.error(`Mongo Integration was unable to require \`${G}\` package.`);
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
      RPA.fill(A.prototype, Q, function(Z) {
        return function(...I) {
          let Y = I[I.length - 1],
            J = B(),
            W = J.getScope(),
            X = J.getClient(),
            V = W.getSpan(),
            F = en([X, "optionalAccess", (D) => D.getOptions, "call", (D) => D(), "access", (D) => D.sendDefaultPii]);
          if (typeof Y !== "function" || Q === "mapReduce" && I.length === 2) {
            let D = en([V, "optionalAccess", (C) => C.startChild, "call", (C) => C(G(this, Q, I, F))]),
              H = Z.call(this, ...I);
            if (RPA.isThenable(H)) return H.then((C) => {
              return en([D, "optionalAccess", (E) => E.end, "call", (E) => E()]), C
            });
            else if (cV3(H)) {
              let C = H;
              try {
                C.once("close", () => {
                  en([D, "optionalAccess", (E) => E.end, "call", (E) => E()])
                })
              } catch (E) {
                en([D, "optionalAccess", (U) => U.end, "call", (U) => U()])
              }
              return C
            } else return en([D, "optionalAccess", (C) => C.end, "call", (C) => C()]), H
          }
          let K = en([V, "optionalAccess", (D) => D.startChild, "call", (D) => D(G(this, Q, I.slice(0, -1)))]);
          return Z.call(this, ...I.slice(0, -1), function(D, H) {
            en([K, "optionalAccess", (C) => C.end, "call", (C) => C()]), Y(D, H)
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
        I = {
          op: "db",
          origin: "auto.db.mongo",
          description: Q,
          data: Z
        },
        Y = dV3[Q],
        J = Array.isArray(this._describeOperations) ? this._describeOperations.includes(Q) : this._describeOperations;
      if (!Y || !J || !G) return I;
      try {
        if (Q === "mapReduce") {
          let [W, X] = B;
          Z[Y[0]] = typeof W === "string" ? W : W.name || "<anonymous>", Z[Y[1]] = typeof X === "string" ? X : X.name || "<anonymous>"
        } else
          for (let W = 0; W < Y.length; W++) Z[`db.mongodb.${Y[W]}`] = JSON.stringify(B[W])
      } catch (W) {}
      return I
    }
  }
  _G1.__initStatic();
  os2.Mongo = _G1
})
// @from(Start 12673082, End 12674621)
Qr2 = z((Ar2) => {
  Object.defineProperty(Ar2, "__esModule", {
    value: !0
  });
  var LY0 = _4(),
    es2 = i0(),
    lV3 = $$(),
    iV3 = tn();

  function nV3(A) {
    return !!A && !!A.$use
  }
  class kG1 {
    static __initStatic() {
      this.id = "Prisma"
    }
    constructor(A = {}) {
      if (this.name = kG1.id, nV3(A.client) && !A.client._sentryInstrumented) {
        es2.addNonEnumerableProperty(A.client, "_sentryInstrumented", !0);
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
          if (iV3.shouldDisableAutoInstrumentation(LY0.getCurrentHub)) return G(B);
          let {
            action: Z,
            model: I
          } = B;
          return LY0.startSpan({
            name: I ? `${I} ${Z}` : Z,
            onlyIfParent: !0,
            op: "db.prisma",
            attributes: {
              [LY0.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.prisma"
            },
            data: {
              ...Q,
              "db.operation": Z
            }
          }, () => G(B))
        })
      } else lV3.DEBUG_BUILD && es2.logger.warn("Unsupported Prisma client provided to PrismaIntegration. Provided client:", A.client)
    }
    setupOnce() {}
  }
  kG1.__initStatic();
  Ar2.Prisma = kG1
})
// @from(Start 12674627, End 12676371)
Zr2 = z((Gr2) => {
  var {
    _optionalChain: qXA
  } = i0();
  Object.defineProperty(Gr2, "__esModule", {
    value: !0
  });
  var TPA = i0(),
    Br2 = $$(),
    sV3 = tn();
  class yG1 {
    static __initStatic() {
      this.id = "GraphQL"
    }
    constructor() {
      this.name = yG1.id
    }
    loadDependency() {
      return this._module = this._module || TPA.loadModule("graphql/execution/execute.js")
    }
    setupOnce(A, Q) {
      if (sV3.shouldDisableAutoInstrumentation(Q)) {
        Br2.DEBUG_BUILD && TPA.logger.log("GraphQL Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        Br2.DEBUG_BUILD && TPA.logger.error("GraphQL Integration was unable to require graphql/execution package.");
        return
      }
      TPA.fill(B, "execute", function(G) {
        return function(...Z) {
          let I = Q().getScope(),
            Y = I.getSpan(),
            J = qXA([Y, "optionalAccess", (X) => X.startChild, "call", (X) => X({
              description: "execute",
              op: "graphql.execute",
              origin: "auto.graphql.graphql"
            })]);
          qXA([I, "optionalAccess", (X) => X.setSpan, "call", (X) => X(J)]);
          let W = G.call(this, ...Z);
          if (TPA.isThenable(W)) return W.then((X) => {
            return qXA([J, "optionalAccess", (V) => V.end, "call", (V) => V()]), qXA([I, "optionalAccess", (V) => V.setSpan, "call", (V) => V(Y)]), X
          });
          return qXA([J, "optionalAccess", (X) => X.end, "call", (X) => X()]), qXA([I, "optionalAccess", (X) => X.setSpan, "call", (X) => X(Y)]), W
        }
      })
    }
  }
  yG1.__initStatic();
  Gr2.GraphQL = yG1
})
// @from(Start 12676377, End 12679903)
Jr2 = z((Yr2) => {
  var {
    _optionalChain: MY0
  } = i0();
  Object.defineProperty(Yr2, "__esModule", {
    value: !0
  });
  var $C = i0(),
    xG1 = $$(),
    oV3 = tn();
  class vG1 {
    static __initStatic() {
      this.id = "Apollo"
    }
    constructor(A = {
      useNestjs: !1
    }) {
      this.name = vG1.id, this._useNest = !!A.useNestjs
    }
    loadDependency() {
      if (this._useNest) this._module = this._module || $C.loadModule("@nestjs/graphql");
      else this._module = this._module || $C.loadModule("apollo-server-core");
      return this._module
    }
    setupOnce(A, Q) {
      if (oV3.shouldDisableAutoInstrumentation(Q)) {
        xG1.DEBUG_BUILD && $C.logger.log("Apollo Integration is skipped because of instrumenter configuration.");
        return
      }
      if (this._useNest) {
        let B = this.loadDependency();
        if (!B) {
          xG1.DEBUG_BUILD && $C.logger.error("Apollo-NestJS Integration was unable to require @nestjs/graphql package.");
          return
        }
        $C.fill(B.GraphQLFactory.prototype, "mergeWithSchema", function(G) {
          return function(...Z) {
            return $C.fill(this.resolversExplorerService, "explore", function(I) {
              return function() {
                let Y = $C.arrayify(I.call(this));
                return Ir2(Y, Q)
              }
            }), G.call(this, ...Z)
          }
        })
      } else {
        let B = this.loadDependency();
        if (!B) {
          xG1.DEBUG_BUILD && $C.logger.error("Apollo Integration was unable to require apollo-server-core package.");
          return
        }
        $C.fill(B.ApolloServerBase.prototype, "constructSchema", function(G) {
          return function() {
            if (!this.config.resolvers) {
              if (xG1.DEBUG_BUILD) {
                if (this.config.schema) $C.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `schema` property.If you are using NestJS with Apollo, please use `Sentry.Integrations.Apollo({ useNestjs: true })` instead."), $C.logger.warn();
                else if (this.config.modules) $C.logger.warn("Apollo integration is not able to trace `ApolloServer` instances constructed via `modules` property.");
                $C.logger.error("Skipping tracing as no resolvers found on the `ApolloServer` instance.")
              }
              return G.call(this)
            }
            let Z = $C.arrayify(this.config.resolvers);
            return this.config.resolvers = Ir2(Z, Q), G.call(this)
          }
        })
      }
    }
  }
  vG1.__initStatic();

  function Ir2(A, Q) {
    return A.map((B) => {
      return Object.keys(B).forEach((G) => {
        Object.keys(B[G]).forEach((Z) => {
          if (typeof B[G][Z] !== "function") return;
          tV3(B, G, Z, Q)
        })
      }), B
    })
  }

  function tV3(A, Q, B, G) {
    $C.fill(A[Q], B, function(Z) {
      return function(...I) {
        let J = G().getScope().getSpan(),
          W = MY0([J, "optionalAccess", (V) => V.startChild, "call", (V) => V({
            description: `${Q}.${B}`,
            op: "graphql.resolve",
            origin: "auto.graphql.apollo"
          })]),
          X = Z.call(this, ...I);
        if ($C.isThenable(X)) return X.then((V) => {
          return MY0([W, "optionalAccess", (F) => F.end, "call", (F) => F()]), V
        });
        return MY0([W, "optionalAccess", (V) => V.end, "call", (V) => V()]), X
      }
    })
  }
  Yr2.Apollo = vG1
})
// @from(Start 12679909, End 12680679)
Xr2 = z((Wr2, Aa) => {
  Object.defineProperty(Wr2, "__esModule", {
    value: !0
  });
  var AQA = i0(),
    AF3 = [() => {
      return new(AQA.dynamicRequire(Aa, "./apollo")).Apollo
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./apollo")).Apollo({
        useNestjs: !0
      })
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./graphql")).GraphQL
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mongo")).Mongo
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mongo")).Mongo({
        mongoose: !0
      })
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./mysql")).Mysql
    }, () => {
      return new(AQA.dynamicRequire(Aa, "./postgres")).Postgres
    }];
  Wr2.lazyLoadedNodePerformanceMonitoringIntegrations = AF3
})
// @from(Start 12680685, End 12680833)
pq = z((Vr2) => {
  Object.defineProperty(Vr2, "__esModule", {
    value: !0
  });
  var BF3 = i0(),
    GF3 = BF3.GLOBAL_OBJ;
  Vr2.WINDOW = GF3
})
// @from(Start 12680839, End 12681692)
RY0 = z((Hr2) => {
  Object.defineProperty(Hr2, "__esModule", {
    value: !0
  });
  var Fr2 = _4(),
    Kr2 = i0(),
    Dr2 = $$(),
    OY0 = pq();

  function IF3() {
    if (OY0.WINDOW.document) OY0.WINDOW.document.addEventListener("visibilitychange", () => {
      let A = Fr2.getActiveTransaction();
      if (OY0.WINDOW.document.hidden && A) {
        let {
          op: B,
          status: G
        } = Fr2.spanToJSON(A);
        if (Dr2.DEBUG_BUILD && Kr2.logger.log(`[Tracing] Transaction: cancelled -> since tab moved to the background, op: ${B}`), !G) A.setStatus("cancelled");
        A.setTag("visibilitychange", "document.hidden"), A.end()
      }
    });
    else Dr2.DEBUG_BUILD && Kr2.logger.warn("[Tracing] Could not set up background tab detection due to lack of global document")
  }
  Hr2.registerBackgroundTabDetection = IF3
})
// @from(Start 12681698, End 12682035)
NXA = z((Cr2) => {
  Object.defineProperty(Cr2, "__esModule", {
    value: !0
  });
  var JF3 = (A, Q, B) => {
    let G, Z;
    return (I) => {
      if (Q.value >= 0) {
        if (I || B) {
          if (Z = Q.value - (G || 0), Z || G === void 0) G = Q.value, Q.delta = Z, A(Q)
        }
      }
    }
  };
  Cr2.bindReporter = JF3
})
// @from(Start 12682041, End 12682268)
zr2 = z((Er2) => {
  Object.defineProperty(Er2, "__esModule", {
    value: !0
  });
  var XF3 = () => {
    return `v3-${Date.now()}-${Math.floor(Math.random()*8999999999999)+1000000000000}`
  };
  Er2.generateUniqueID = XF3
})
// @from(Start 12682274, End 12683144)
jPA = z((Ur2) => {
  Object.defineProperty(Ur2, "__esModule", {
    value: !0
  });
  var PPA = pq(),
    FF3 = () => {
      let A = PPA.WINDOW.performance.timing,
        Q = PPA.WINDOW.performance.navigation.type,
        B = {
          entryType: "navigation",
          startTime: 0,
          type: Q == 2 ? "back_forward" : Q === 1 ? "reload" : "navigate"
        };
      for (let G in A)
        if (G !== "navigationStart" && G !== "toJSON") B[G] = Math.max(A[G] - A.navigationStart, 0);
      return B
    },
    KF3 = () => {
      if (PPA.WINDOW.__WEB_VITALS_POLYFILL__) return PPA.WINDOW.performance && (performance.getEntriesByType && performance.getEntriesByType("navigation")[0] || FF3());
      else return PPA.WINDOW.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0]
    };
  Ur2.getNavigationEntry = KF3
})
// @from(Start 12683150, End 12683392)
bG1 = z(($r2) => {
  Object.defineProperty($r2, "__esModule", {
    value: !0
  });
  var HF3 = jPA(),
    CF3 = () => {
      let A = HF3.getNavigationEntry();
      return A && A.activationStart || 0
    };
  $r2.getActivationStart = CF3
})
// @from(Start 12683398, End 12684049)
LXA = z((qr2) => {
  Object.defineProperty(qr2, "__esModule", {
    value: !0
  });
  var wr2 = pq(),
    zF3 = zr2(),
    UF3 = bG1(),
    $F3 = jPA(),
    wF3 = (A, Q) => {
      let B = $F3.getNavigationEntry(),
        G = "navigate";
      if (B)
        if (wr2.WINDOW.document && wr2.WINDOW.document.prerendering || UF3.getActivationStart() > 0) G = "prerender";
        else G = B.type.replace(/_/g, "-");
      return {
        name: A,
        value: typeof Q > "u" ? -1 : Q,
        rating: "good",
        delta: 0,
        entries: [],
        id: zF3.generateUniqueID(),
        navigationType: G
      }
    };
  qr2.initMetric = wF3
})
// @from(Start 12684055, End 12684502)
QQA = z((Nr2) => {
  Object.defineProperty(Nr2, "__esModule", {
    value: !0
  });
  var NF3 = (A, Q, B) => {
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
  Nr2.observe = NF3
})
// @from(Start 12684508, End 12685015)
MXA = z((Mr2) => {
  Object.defineProperty(Mr2, "__esModule", {
    value: !0
  });
  var Lr2 = pq(),
    MF3 = (A, Q) => {
      let B = (G) => {
        if (G.type === "pagehide" || Lr2.WINDOW.document.visibilityState === "hidden") {
          if (A(G), Q) removeEventListener("visibilitychange", B, !0), removeEventListener("pagehide", B, !0)
        }
      };
      if (Lr2.WINDOW.document) addEventListener("visibilitychange", B, !0), addEventListener("pagehide", B, !0)
    };
  Mr2.onHidden = MF3
})
// @from(Start 12685021, End 12686015)
Rr2 = z((Or2) => {
  Object.defineProperty(Or2, "__esModule", {
    value: !0
  });
  var RF3 = NXA(),
    TF3 = LXA(),
    PF3 = QQA(),
    jF3 = MXA(),
    SF3 = (A, Q = {}) => {
      let B = TF3.initMetric("CLS", 0),
        G, Z = 0,
        I = [],
        Y = (W) => {
          W.forEach((X) => {
            if (!X.hadRecentInput) {
              let V = I[0],
                F = I[I.length - 1];
              if (Z && I.length !== 0 && X.startTime - F.startTime < 1000 && X.startTime - V.startTime < 5000) Z += X.value, I.push(X);
              else Z = X.value, I = [X];
              if (Z > B.value) {
                if (B.value = Z, B.entries = I, G) G()
              }
            }
          })
        },
        J = PF3.observe("layout-shift", Y);
      if (J) {
        G = RF3.bindReporter(A, B, Q.reportAllChanges);
        let W = () => {
          Y(J.takeRecords()), G(!0)
        };
        return jF3.onHidden(W), W
      }
      return
    };
  Or2.onCLS = SF3
})
// @from(Start 12686021, End 12686643)
gG1 = z((Tr2) => {
  Object.defineProperty(Tr2, "__esModule", {
    value: !0
  });
  var fG1 = pq(),
    kF3 = MXA(),
    hG1 = -1,
    yF3 = () => {
      if (fG1.WINDOW.document && fG1.WINDOW.document.visibilityState) hG1 = fG1.WINDOW.document.visibilityState === "hidden" && !fG1.WINDOW.document.prerendering ? 0 : 1 / 0
    },
    xF3 = () => {
      kF3.onHidden(({
        timeStamp: A
      }) => {
        hG1 = A
      }, !0)
    },
    vF3 = () => {
      if (hG1 < 0) yF3(), xF3();
      return {
        get firstHiddenTime() {
          return hG1
        }
      }
    };
  Tr2.getVisibilityWatcher = vF3
})
// @from(Start 12686649, End 12687309)
jr2 = z((Pr2) => {
  Object.defineProperty(Pr2, "__esModule", {
    value: !0
  });
  var fF3 = NXA(),
    hF3 = gG1(),
    gF3 = LXA(),
    uF3 = QQA(),
    mF3 = MXA(),
    dF3 = (A) => {
      let Q = hF3.getVisibilityWatcher(),
        B = gF3.initMetric("FID"),
        G, Z = (J) => {
          if (J.startTime < Q.firstHiddenTime) B.value = J.processingStart - J.startTime, B.entries.push(J), G(!0)
        },
        I = (J) => {
          J.forEach(Z)
        },
        Y = uF3.observe("first-input", I);
      if (G = fF3.bindReporter(A, B), Y) mF3.onHidden(() => {
        I(Y.takeRecords()), Y.disconnect()
      }, !0)
    };
  Pr2.onFID = dF3
})
// @from(Start 12687315, End 12688035)
kr2 = z((_r2) => {
  Object.defineProperty(_r2, "__esModule", {
    value: !0
  });
  var pF3 = QQA(),
    Sr2 = 0,
    TY0 = 1 / 0,
    uG1 = 0,
    lF3 = (A) => {
      A.forEach((Q) => {
        if (Q.interactionId) TY0 = Math.min(TY0, Q.interactionId), uG1 = Math.max(uG1, Q.interactionId), Sr2 = uG1 ? (uG1 - TY0) / 7 + 1 : 0
      })
    },
    PY0, iF3 = () => {
      return PY0 ? Sr2 : performance.interactionCount || 0
    },
    nF3 = () => {
      if ("interactionCount" in performance || PY0) return;
      PY0 = pF3.observe("event", lF3, {
        type: "event",
        buffered: !0,
        durationThreshold: 0
      })
    };
  _r2.getInteractionCount = iF3;
  _r2.initInteractionCountPolyfill = nF3
})
// @from(Start 12688041, End 12689993)
hr2 = z((fr2) => {
  Object.defineProperty(fr2, "__esModule", {
    value: !0
  });
  var rF3 = NXA(),
    oF3 = LXA(),
    tF3 = QQA(),
    eF3 = MXA(),
    vr2 = kr2(),
    br2 = () => {
      return vr2.getInteractionCount()
    },
    yr2 = 10,
    zg = [],
    jY0 = {},
    xr2 = (A) => {
      let Q = zg[zg.length - 1],
        B = jY0[A.interactionId];
      if (B || zg.length < yr2 || A.duration > Q.latency) {
        if (B) B.entries.push(A), B.latency = Math.max(B.latency, A.duration);
        else {
          let G = {
            id: A.interactionId,
            latency: A.duration,
            entries: [A]
          };
          jY0[G.id] = G, zg.push(G)
        }
        zg.sort((G, Z) => Z.latency - G.latency), zg.splice(yr2).forEach((G) => {
          delete jY0[G.id]
        })
      }
    },
    AK3 = () => {
      let A = Math.min(zg.length - 1, Math.floor(br2() / 50));
      return zg[A]
    },
    QK3 = (A, Q) => {
      Q = Q || {}, vr2.initInteractionCountPolyfill();
      let B = oF3.initMetric("INP"),
        G, Z = (Y) => {
          Y.forEach((W) => {
            if (W.interactionId) xr2(W);
            if (W.entryType === "first-input") {
              if (!zg.some((V) => {
                  return V.entries.some((F) => {
                    return W.duration === F.duration && W.startTime === F.startTime
                  })
                })) xr2(W)
            }
          });
          let J = AK3();
          if (J && J.latency !== B.value) B.value = J.latency, B.entries = J.entries, G()
        },
        I = tF3.observe("event", Z, {
          durationThreshold: Q.durationThreshold || 40
        });
      if (G = rF3.bindReporter(A, B, Q.reportAllChanges), I) I.observe({
        type: "first-input",
        buffered: !0
      }), eF3.onHidden(() => {
        if (Z(I.takeRecords()), B.value < 0 && br2() > 0) B.value = 0, B.entries = [];
        G(!0)
      })
    };
  fr2.onINP = QK3
})
// @from(Start 12689999, End 12691041)
mr2 = z((ur2) => {
  Object.defineProperty(ur2, "__esModule", {
    value: !0
  });
  var GK3 = pq(),
    ZK3 = NXA(),
    IK3 = bG1(),
    YK3 = gG1(),
    JK3 = LXA(),
    WK3 = QQA(),
    XK3 = MXA(),
    gr2 = {},
    VK3 = (A) => {
      let Q = YK3.getVisibilityWatcher(),
        B = JK3.initMetric("LCP"),
        G, Z = (Y) => {
          let J = Y[Y.length - 1];
          if (J) {
            let W = Math.max(J.startTime - IK3.getActivationStart(), 0);
            if (W < Q.firstHiddenTime) B.value = W, B.entries = [J], G()
          }
        },
        I = WK3.observe("largest-contentful-paint", Z);
      if (I) {
        G = ZK3.bindReporter(A, B);
        let Y = () => {
          if (!gr2[B.id]) Z(I.takeRecords()), I.disconnect(), gr2[B.id] = !0, G(!0)
        };
        return ["keydown", "click"].forEach((J) => {
          if (GK3.WINDOW.document) addEventListener(J, Y, {
            once: !0,
            capture: !0
          })
        }), XK3.onHidden(Y, !0), Y
      }
      return
    };
  ur2.onLCP = VK3
})
// @from(Start 12691047, End 12691944)
cr2 = z((dr2) => {
  Object.defineProperty(dr2, "__esModule", {
    value: !0
  });
  var SY0 = pq(),
    KK3 = NXA(),
    DK3 = bG1(),
    HK3 = jPA(),
    CK3 = LXA(),
    _Y0 = (A) => {
      if (!SY0.WINDOW.document) return;
      if (SY0.WINDOW.document.prerendering) addEventListener("prerenderingchange", () => _Y0(A), !0);
      else if (SY0.WINDOW.document.readyState !== "complete") addEventListener("load", () => _Y0(A), !0);
      else setTimeout(A, 0)
    },
    EK3 = (A, Q) => {
      Q = Q || {};
      let B = CK3.initMetric("TTFB"),
        G = KK3.bindReporter(A, B, Q.reportAllChanges);
      _Y0(() => {
        let Z = HK3.getNavigationEntry();
        if (Z) {
          if (B.value = Math.max(Z.responseStart - DK3.getActivationStart(), 0), B.value < 0 || B.value > performance.now()) return;
          B.entries = [Z], G(!0)
        }
      })
    };
  dr2.onTTFB = EK3
})
// @from(Start 12691950, End 12694421)
RXA = z((tr2) => {
  Object.defineProperty(tr2, "__esModule", {
    value: !0
  });
  var pr2 = i0(),
    UK3 = $$(),
    $K3 = Rr2(),
    wK3 = jr2(),
    qK3 = hr2(),
    NK3 = mr2(),
    LK3 = QQA(),
    MK3 = cr2(),
    SPA = {},
    mG1 = {},
    lr2, ir2, nr2, ar2, sr2;

  function OK3(A, Q = !1) {
    return _PA("cls", A, _K3, lr2, Q)
  }

  function RK3(A, Q = !1) {
    return _PA("lcp", A, yK3, nr2, Q)
  }

  function TK3(A) {
    return _PA("ttfb", A, xK3, ar2)
  }

  function PK3(A) {
    return _PA("fid", A, kK3, ir2)
  }

  function jK3(A) {
    return _PA("inp", A, vK3, sr2)
  }

  function SK3(A, Q) {
    if (rr2(A, Q), !mG1[A]) bK3(A), mG1[A] = !0;
    return or2(A, Q)
  }

  function OXA(A, Q) {
    let B = SPA[A];
    if (!B || !B.length) return;
    for (let G of B) try {
      G(Q)
    } catch (Z) {
      UK3.DEBUG_BUILD && pr2.logger.error(`Error while triggering instrumentation handler.
Type: ${A}
Name: ${pr2.getFunctionName(G)}
Error:`, Z)
    }
  }

  function _K3() {
    return $K3.onCLS((A) => {
      OXA("cls", {
        metric: A
      }), lr2 = A
    }, {
      reportAllChanges: !0
    })
  }

  function kK3() {
    return wK3.onFID((A) => {
      OXA("fid", {
        metric: A
      }), ir2 = A
    })
  }

  function yK3() {
    return NK3.onLCP((A) => {
      OXA("lcp", {
        metric: A
      }), nr2 = A
    })
  }

  function xK3() {
    return MK3.onTTFB((A) => {
      OXA("ttfb", {
        metric: A
      }), ar2 = A
    })
  }

  function vK3() {
    return qK3.onINP((A) => {
      OXA("inp", {
        metric: A
      }), sr2 = A
    })
  }

  function _PA(A, Q, B, G, Z = !1) {
    rr2(A, Q);
    let I;
    if (!mG1[A]) I = B(), mG1[A] = !0;
    if (G) Q({
      metric: G
    });
    return or2(A, Q, Z ? I : void 0)
  }

  function bK3(A) {
    let Q = {};
    if (A === "event") Q.durationThreshold = 0;
    LK3.observe(A, (B) => {
      OXA(A, {
        entries: B
      })
    }, Q)
  }

  function rr2(A, Q) {
    SPA[A] = SPA[A] || [], SPA[A].push(Q)
  }

  function or2(A, Q, B) {
    return () => {
      if (B) B();
      let G = SPA[A];
      if (!G) return;
      let Z = G.indexOf(Q);
      if (Z !== -1) G.splice(Z, 1)
    }
  }
  tr2.addClsInstrumentationHandler = OK3;
  tr2.addFidInstrumentationHandler = PK3;
  tr2.addInpInstrumentationHandler = jK3;
  tr2.addLcpInstrumentationHandler = RK3;
  tr2.addPerformanceInstrumentationHandler = SK3;
  tr2.addTtfbInstrumentationHandler = TK3
})
// @from(Start 12694427, End 12694832)
Ao2 = z((er2) => {
  Object.defineProperty(er2, "__esModule", {
    value: !0
  });

  function cK3(A) {
    return typeof A === "number" && isFinite(A)
  }

  function pK3(A, {
    startTimestamp: Q,
    ...B
  }) {
    if (Q && A.startTimestamp > Q) A.startTimestamp = Q;
    return A.startChild({
      startTimestamp: Q,
      ...B
    })
  }
  er2._startChild = pK3;
  er2.isMeasurementValue = cK3
})
// @from(Start 12694838, End 12708099)
xY0 = z((Io2) => {
  Object.defineProperty(Io2, "__esModule", {
    value: !0
  });
  var Ug = _4(),
    $Z = i0(),
    lq = $$(),
    BQA = RXA(),
    $g = pq(),
    nK3 = gG1(),
    wg = Ao2(),
    aK3 = jPA(),
    sK3 = 2147483647;

  function rV(A) {
    return A / 1000
  }

  function yY0() {
    return $g.WINDOW && $g.WINDOW.addEventListener && $g.WINDOW.performance
  }
  var Qo2 = 0,
    lJ = {},
    ay, kPA;

  function rK3() {
    let A = yY0();
    if (A && $Z.browserPerformanceTimeOrigin) {
      if (A.mark) $g.WINDOW.performance.mark("sentry-tracing-init");
      let Q = BD3(),
        B = AD3(),
        G = QD3(),
        Z = GD3();
      return () => {
        Q(), B(), G(), Z()
      }
    }
    return () => {
      return
    }
  }

  function oK3() {
    BQA.addPerformanceInstrumentationHandler("longtask", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Ug.getActiveTransaction();
        if (!B) return;
        let G = rV($Z.browserPerformanceTimeOrigin + Q.startTime),
          Z = rV(Q.duration);
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

  function tK3() {
    BQA.addPerformanceInstrumentationHandler("event", ({
      entries: A
    }) => {
      for (let Q of A) {
        let B = Ug.getActiveTransaction();
        if (!B) return;
        if (Q.name === "click") {
          let G = rV($Z.browserPerformanceTimeOrigin + Q.startTime),
            Z = rV(Q.duration),
            I = {
              description: $Z.htmlTreeAsString(Q.target),
              op: `ui.interaction.${Q.name}`,
              origin: "auto.ui.browser.metrics",
              startTimestamp: G,
              endTimestamp: G + Z
            },
            Y = $Z.getComponentName(Q.target);
          if (Y) I.attributes = {
            "ui.component_name": Y
          };
          B.startChild(I)
        }
      }
    })
  }

  function eK3(A, Q) {
    if (yY0() && $Z.browserPerformanceTimeOrigin) {
      let G = ZD3(A, Q);
      return () => {
        G()
      }
    }
    return () => {
      return
    }
  }

  function AD3() {
    return BQA.addClsInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding CLS"), lJ.cls = {
        value: A.value,
        unit: ""
      }, kPA = Q
    }, !0)
  }

  function QD3() {
    return BQA.addLcpInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding LCP"), lJ.lcp = {
        value: A.value,
        unit: "millisecond"
      }, ay = Q
    }, !0)
  }

  function BD3() {
    return BQA.addFidInstrumentationHandler(({
      metric: A
    }) => {
      let Q = A.entries[A.entries.length - 1];
      if (!Q) return;
      let B = rV($Z.browserPerformanceTimeOrigin),
        G = rV(Q.startTime);
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FID"), lJ.fid = {
        value: A.value,
        unit: "millisecond"
      }, lJ["mark.fid"] = {
        value: B + G,
        unit: "second"
      }
    })
  }

  function GD3() {
    return BQA.addTtfbInstrumentationHandler(({
      metric: A
    }) => {
      if (!A.entries[A.entries.length - 1]) return;
      lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding TTFB"), lJ.ttfb = {
        value: A.value,
        unit: "millisecond"
      }
    })
  }
  var Bo2 = {
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

  function ZD3(A, Q) {
    return BQA.addInpInstrumentationHandler(({
      metric: B
    }) => {
      if (B.value === void 0) return;
      let G = B.entries.find((w) => w.duration === B.value && Bo2[w.name] !== void 0),
        Z = Ug.getClient();
      if (!G || !Z) return;
      let I = Bo2[G.name],
        Y = Z.getOptions(),
        J = rV($Z.browserPerformanceTimeOrigin + G.startTime),
        W = rV(B.value),
        X = G.interactionId !== void 0 ? A[G.interactionId] : void 0;
      if (X === void 0) return;
      let {
        routeName: V,
        parentContext: F,
        activeTransaction: K,
        user: D,
        replayId: H
      } = X, C = D !== void 0 ? D.email || D.id || D.ip_address : void 0, E = K !== void 0 ? K.getProfileId() : void 0, U = new Ug.Span({
        startTimestamp: J,
        endTimestamp: J + W,
        op: `ui.interaction.${I}`,
        name: $Z.htmlTreeAsString(G.target),
        attributes: {
          release: Y.release,
          environment: Y.environment,
          transaction: V,
          ...C !== void 0 && C !== "" ? {
            user: C
          } : {},
          ...E !== void 0 ? {
            profile_id: E
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
      }), q = FD3(F, Y, Q);
      if (!q) return;
      if (Math.random() < q) {
        let w = U ? Ug.createSpanEnvelope([U], Z.getDsn()) : void 0,
          N = Z && Z.getTransport();
        if (N && w) N.send(w).then(null, (R) => {
          lq.DEBUG_BUILD && $Z.logger.error("Error while sending interaction:", R)
        });
        return
      }
    })
  }

  function ID3(A) {
    let Q = yY0();
    if (!Q || !$g.WINDOW.performance.getEntries || !$Z.browserPerformanceTimeOrigin) return;
    lq.DEBUG_BUILD && $Z.logger.log("[Tracing] Adding & adjusting spans using Performance API");
    let B = rV($Z.browserPerformanceTimeOrigin),
      G = Q.getEntries(),
      {
        op: Z,
        start_timestamp: I
      } = Ug.spanToJSON(A);
    if (G.slice(Qo2).forEach((Y) => {
        let J = rV(Y.startTime),
          W = rV(Y.duration);
        if (A.op === "navigation" && I && B + J < I) return;
        switch (Y.entryType) {
          case "navigation": {
            YD3(A, Y, B);
            break
          }
          case "mark":
          case "paint":
          case "measure": {
            Go2(A, Y, J, W, B);
            let X = nK3.getVisibilityWatcher(),
              V = Y.startTime < X.firstHiddenTime;
            if (Y.name === "first-paint" && V) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FP"), lJ.fp = {
              value: Y.startTime,
              unit: "millisecond"
            };
            if (Y.name === "first-contentful-paint" && V) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding FCP"), lJ.fcp = {
              value: Y.startTime,
              unit: "millisecond"
            };
            break
          }
          case "resource": {
            Zo2(A, Y, Y.name, J, W, B);
            break
          }
        }
      }), Qo2 = Math.max(G.length - 1, 0), WD3(A), Z === "pageload") {
      VD3(lJ), ["fcp", "fp", "lcp"].forEach((J) => {
        if (!lJ[J] || !I || B >= I) return;
        let W = lJ[J].value,
          X = B + rV(W),
          V = Math.abs((X - I) * 1000),
          F = V - W;
        lq.DEBUG_BUILD && $Z.logger.log(`[Measurements] Normalized ${J} from ${W} to ${V} (${F})`), lJ[J].value = V
      });
      let Y = lJ["mark.fid"];
      if (Y && lJ.fid) wg._startChild(A, {
        description: "first input delay",
        endTimestamp: Y.value + rV(lJ.fid.value),
        op: "ui.action",
        origin: "auto.ui.browser.metrics",
        startTimestamp: Y.value
      }), delete lJ["mark.fid"];
      if (!("fcp" in lJ)) delete lJ.cls;
      Object.keys(lJ).forEach((J) => {
        Ug.setMeasurement(J, lJ[J].value, lJ[J].unit)
      }), XD3(A)
    }
    ay = void 0, kPA = void 0, lJ = {}
  }

  function Go2(A, Q, B, G, Z) {
    let I = Z + B,
      Y = I + G;
    return wg._startChild(A, {
      description: Q.name,
      endTimestamp: Y,
      op: Q.entryType,
      origin: "auto.resource.browser.metrics",
      startTimestamp: I
    }), I
  }

  function YD3(A, Q, B) {
    ["unloadEvent", "redirect", "domContentLoadedEvent", "loadEvent", "connect"].forEach((G) => {
      dG1(A, Q, G, B)
    }), dG1(A, Q, "secureConnection", B, "TLS/SSL", "connectEnd"), dG1(A, Q, "fetch", B, "cache", "domainLookupStart"), dG1(A, Q, "domainLookup", B, "DNS"), JD3(A, Q, B)
  }

  function dG1(A, Q, B, G, Z, I) {
    let Y = I ? Q[I] : Q[`${B}End`],
      J = Q[`${B}Start`];
    if (!J || !Y) return;
    wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: Z || B,
      startTimestamp: G + rV(J),
      endTimestamp: G + rV(Y)
    })
  }

  function JD3(A, Q, B) {
    if (Q.responseEnd) wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "request",
      startTimestamp: B + rV(Q.requestStart),
      endTimestamp: B + rV(Q.responseEnd)
    }), wg._startChild(A, {
      op: "browser",
      origin: "auto.browser.browser.metrics",
      description: "response",
      startTimestamp: B + rV(Q.responseStart),
      endTimestamp: B + rV(Q.responseEnd)
    })
  }

  function Zo2(A, Q, B, G, Z, I) {
    if (Q.initiatorType === "xmlhttprequest" || Q.initiatorType === "fetch") return;
    let Y = $Z.parseUrl(B),
      J = {};
    if (kY0(J, Q, "transferSize", "http.response_transfer_size"), kY0(J, Q, "encodedBodySize", "http.response_content_length"), kY0(J, Q, "decodedBodySize", "http.decoded_response_content_length"), "renderBlockingStatus" in Q) J["resource.render_blocking_status"] = Q.renderBlockingStatus;
    if (Y.protocol) J["url.scheme"] = Y.protocol.split(":").pop();
    if (Y.host) J["server.address"] = Y.host;
    J["url.same_origin"] = B.includes($g.WINDOW.location.origin);
    let W = I + G,
      X = W + Z;
    wg._startChild(A, {
      description: B.replace($g.WINDOW.location.origin, ""),
      endTimestamp: X,
      op: Q.initiatorType ? `resource.${Q.initiatorType}` : "resource.other",
      origin: "auto.resource.browser.metrics",
      startTimestamp: W,
      data: J
    })
  }

  function WD3(A) {
    let Q = $g.WINDOW.navigator;
    if (!Q) return;
    let B = Q.connection;
    if (B) {
      if (B.effectiveType) A.setTag("effectiveConnectionType", B.effectiveType);
      if (B.type) A.setTag("connectionType", B.type);
      if (wg.isMeasurementValue(B.rtt)) lJ["connection.rtt"] = {
        value: B.rtt,
        unit: "millisecond"
      }
    }
    if (wg.isMeasurementValue(Q.deviceMemory)) A.setTag("deviceMemory", `${Q.deviceMemory} GB`);
    if (wg.isMeasurementValue(Q.hardwareConcurrency)) A.setTag("hardwareConcurrency", String(Q.hardwareConcurrency))
  }

  function XD3(A) {
    if (ay) {
      if (lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding LCP Data"), ay.element) A.setTag("lcp.element", $Z.htmlTreeAsString(ay.element));
      if (ay.id) A.setTag("lcp.id", ay.id);
      if (ay.url) A.setTag("lcp.url", ay.url.trim().slice(0, 200));
      A.setTag("lcp.size", ay.size)
    }
    if (kPA && kPA.sources) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding CLS Data"), kPA.sources.forEach((Q, B) => A.setTag(`cls.source.${B+1}`, $Z.htmlTreeAsString(Q.node)))
  }

  function kY0(A, Q, B, G) {
    let Z = Q[B];
    if (Z != null && Z < sK3) A[G] = Z
  }

  function VD3(A) {
    let Q = aK3.getNavigationEntry();
    if (!Q) return;
    let {
      responseStart: B,
      requestStart: G
    } = Q;
    if (G <= B) lq.DEBUG_BUILD && $Z.logger.log("[Measurements] Adding TTFB Request Time"), A["ttfb.requestTime"] = {
      value: B - G,
      unit: "millisecond"
    }
  }

  function FD3(A, Q, B) {
    if (!Ug.hasTracingEnabled(Q)) return !1;
    let G;
    if (A !== void 0 && typeof Q.tracesSampler === "function") G = Q.tracesSampler({
      transactionContext: A,
      name: A.name,
      parentSampled: A.parentSampled,
      attributes: {
        ...A.data,
        ...A.attributes
      },
      location: $g.WINDOW.location
    });
    else if (A !== void 0 && A.sampled !== void 0) G = A.sampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate;
    else G = 1;
    if (!Ug.isValidSampleRate(G)) return lq.DEBUG_BUILD && $Z.logger.warn("[Tracing] Discarding interaction span because of invalid sample rate."), !1;
    if (G === !0) return B;
    else if (G === !1) return 0;
    return G * B
  }
  Io2._addMeasureSpans = Go2;
  Io2._addResourceSpans = Zo2;
  Io2.addPerformanceEntries = ID3;
  Io2.startTrackingINP = eK3;
  Io2.startTrackingInteractions = tK3;
  Io2.startTrackingLongTasks = oK3;
  Io2.startTrackingWebVitals = rK3
})
// @from(Start 12708105, End 12711215)
vY0 = z((Jo2) => {
  Object.defineProperty(Jo2, "__esModule", {
    value: !0
  });
  var sy = _4(),
    GQA = i0();

  function $D3(A, Q, B, G, Z = "auto.http.browser") {
    if (!sy.hasTracingEnabled() || !A.fetchData) return;
    let I = Q(A.fetchData.url);
    if (A.endTimestamp && I) {
      let D = A.fetchData.__span;
      if (!D) return;
      let H = G[D];
      if (H) qD3(H, A), delete G[D];
      return
    }
    let Y = sy.getCurrentScope(),
      J = sy.getClient(),
      {
        method: W,
        url: X
      } = A.fetchData,
      V = wD3(X),
      F = V ? GQA.parseUrl(V).host : void 0,
      K = I ? sy.startInactiveSpan({
        name: `${W} ${X}`,
        onlyIfParent: !0,
        attributes: {
          url: X,
          type: "fetch",
          "http.method": W,
          "http.url": V,
          "server.address": F,
          [sy.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: Z
        },
        op: "http.client"
      }) : void 0;
    if (K) A.fetchData.__span = K.spanContext().spanId, G[K.spanContext().spanId] = K;
    if (B(A.fetchData.url) && J) {
      let D = A.args[0];
      A.args[1] = A.args[1] || {};
      let H = A.args[1];
      H.headers = Yo2(D, J, Y, H, K)
    }
    return K
  }

  function Yo2(A, Q, B, G, Z) {
    let I = Z || B.getSpan(),
      Y = sy.getIsolationScope(),
      {
        traceId: J,
        spanId: W,
        sampled: X,
        dsc: V
      } = {
        ...Y.getPropagationContext(),
        ...B.getPropagationContext()
      },
      F = I ? sy.spanToTraceHeader(I) : GQA.generateSentryTraceHeader(J, W, X),
      K = GQA.dynamicSamplingContextToSentryBaggageHeader(V || (I ? sy.getDynamicSamplingContextFromSpan(I) : sy.getDynamicSamplingContextFromClient(J, Q, B))),
      D = G.headers || (typeof Request < "u" && GQA.isInstanceOf(A, Request) ? A.headers : void 0);
    if (!D) return {
      "sentry-trace": F,
      baggage: K
    };
    else if (typeof Headers < "u" && GQA.isInstanceOf(D, Headers)) {
      let H = new Headers(D);
      if (H.append("sentry-trace", F), K) H.append(GQA.BAGGAGE_HEADER_NAME, K);
      return H
    } else if (Array.isArray(D)) {
      let H = [...D, ["sentry-trace", F]];
      if (K) H.push([GQA.BAGGAGE_HEADER_NAME, K]);
      return H
    } else {
      let H = "baggage" in D ? D.baggage : void 0,
        C = [];
      if (Array.isArray(H)) C.push(...H);
      else if (H) C.push(H);
      if (K) C.push(K);
      return {
        ...D,
        "sentry-trace": F,
        baggage: C.length > 0 ? C.join(",") : void 0
      }
    }
  }

  function wD3(A) {
    try {
      return new URL(A).href
    } catch (Q) {
      return
    }
  }

  function qD3(A, Q) {
    if (Q.response) {
      sy.setHttpStatus(A, Q.response.status);
      let B = Q.response && Q.response.headers && Q.response.headers.get("content-length");
      if (B) {
        let G = parseInt(B);
        if (G > 0) A.setAttribute("http.response_content_length", G)
      }
    } else if (Q.error) A.setStatus("internal_error");
    A.end()
  }
  Jo2.addTracingHeadersToFetchRequest = Yo2;
  Jo2.instrumentFetchRequest = $D3
})
// @from(Start 12711221, End 12716494)
pG1 = z((Do2) => {
  Object.defineProperty(Do2, "__esModule", {
    value: !0
  });
  var iP = _4(),
    nP = i0(),
    MD3 = vY0(),
    OD3 = RXA(),
    RD3 = pq(),
    cG1 = ["localhost", /^\/(?!\/)/],
    bY0 = {
      traceFetch: !0,
      traceXHR: !0,
      enableHTTPTimings: !0,
      tracingOrigins: cG1,
      tracePropagationTargets: cG1
    };

  function TD3(A) {
    let {
      traceFetch: Q,
      traceXHR: B,
      tracePropagationTargets: G,
      tracingOrigins: Z,
      shouldCreateSpanForRequest: I,
      enableHTTPTimings: Y
    } = {
      traceFetch: bY0.traceFetch,
      traceXHR: bY0.traceXHR,
      ...A
    }, J = typeof I === "function" ? I : (V) => !0, W = (V) => Vo2(V, G || Z), X = {};
    if (Q) nP.addFetchInstrumentationHandler((V) => {
      let F = MD3.instrumentFetchRequest(V, J, W, X);
      if (F) {
        let K = Ko2(V.fetchData.url),
          D = K ? nP.parseUrl(K).host : void 0;
        F.setAttributes({
          "http.url": K,
          "server.address": D
        })
      }
      if (Y && F) Wo2(F)
    });
    if (B) nP.addXhrInstrumentationHandler((V) => {
      let F = Fo2(V, J, W, X);
      if (Y && F) Wo2(F)
    })
  }

  function PD3(A) {
    return A.entryType === "resource" && "initiatorType" in A && typeof A.nextHopProtocol === "string" && (A.initiatorType === "fetch" || A.initiatorType === "xmlhttprequest")
  }

  function Wo2(A) {
    let {
      url: Q
    } = iP.spanToJSON(A).data || {};
    if (!Q || typeof Q !== "string") return;
    let B = OD3.addPerformanceInstrumentationHandler("resource", ({
      entries: G
    }) => {
      G.forEach((Z) => {
        if (PD3(Z) && Z.name.endsWith(Q)) jD3(Z).forEach((Y) => A.setAttribute(...Y)), setTimeout(B)
      })
    })
  }

  function Xo2(A) {
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

  function ry(A = 0) {
    return ((nP.browserPerformanceTimeOrigin || performance.timeOrigin) + A) / 1000
  }

  function jD3(A) {
    let {
      name: Q,
      version: B
    } = Xo2(A.nextHopProtocol), G = [];
    if (G.push(["network.protocol.version", B], ["network.protocol.name", Q]), !nP.browserPerformanceTimeOrigin) return G;
    return [...G, ["http.request.redirect_start", ry(A.redirectStart)],
      ["http.request.fetch_start", ry(A.fetchStart)],
      ["http.request.domain_lookup_start", ry(A.domainLookupStart)],
      ["http.request.domain_lookup_end", ry(A.domainLookupEnd)],
      ["http.request.connect_start", ry(A.connectStart)],
      ["http.request.secure_connection_start", ry(A.secureConnectionStart)],
      ["http.request.connection_end", ry(A.connectEnd)],
      ["http.request.request_start", ry(A.requestStart)],
      ["http.request.response_start", ry(A.responseStart)],
      ["http.request.response_end", ry(A.responseEnd)]
    ]
  }

  function Vo2(A, Q) {
    return nP.stringMatchesSomePattern(A, Q || cG1)
  }

  function Fo2(A, Q, B, G) {
    let Z = A.xhr,
      I = Z && Z[nP.SENTRY_XHR_DATA_KEY];
    if (!iP.hasTracingEnabled() || !Z || Z.__sentry_own_request__ || !I) return;
    let Y = Q(I.url);
    if (A.endTimestamp && Y) {
      let D = Z.__sentry_xhr_span_id__;
      if (!D) return;
      let H = G[D];
      if (H && I.status_code !== void 0) iP.setHttpStatus(H, I.status_code), H.end(), delete G[D];
      return
    }
    let J = iP.getCurrentScope(),
      W = iP.getIsolationScope(),
      X = Ko2(I.url),
      V = X ? nP.parseUrl(X).host : void 0,
      F = Y ? iP.startInactiveSpan({
        name: `${I.method} ${I.url}`,
        onlyIfParent: !0,
        attributes: {
          type: "xhr",
          "http.method": I.method,
          "http.url": X,
          url: I.url,
          "server.address": V,
          [iP.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.http.browser"
        },
        op: "http.client"
      }) : void 0;
    if (F) Z.__sentry_xhr_span_id__ = F.spanContext().spanId, G[Z.__sentry_xhr_span_id__] = F;
    let K = iP.getClient();
    if (Z.setRequestHeader && B(I.url) && K) {
      let {
        traceId: D,
        spanId: H,
        sampled: C,
        dsc: E
      } = {
        ...W.getPropagationContext(),
        ...J.getPropagationContext()
      }, U = F ? iP.spanToTraceHeader(F) : nP.generateSentryTraceHeader(D, H, C), q = nP.dynamicSamplingContextToSentryBaggageHeader(E || (F ? iP.getDynamicSamplingContextFromSpan(F) : iP.getDynamicSamplingContextFromClient(D, K, J)));
      SD3(Z, U, q)
    }
    return F
  }

  function SD3(A, Q, B) {
    try {
      if (A.setRequestHeader("sentry-trace", Q), B) A.setRequestHeader(nP.BAGGAGE_HEADER_NAME, B)
    } catch (G) {}
  }

  function Ko2(A) {
    try {
      return new URL(A, RD3.WINDOW.location.origin).href
    } catch (Q) {
      return
    }
  }
  Do2.DEFAULT_TRACE_PROPAGATION_TARGETS = cG1;
  Do2.defaultRequestInstrumentationOptions = bY0;
  Do2.extractNetworkProtocol = Xo2;
  Do2.instrumentOutgoingRequests = TD3;
  Do2.shouldAttachHeaders = Vo2;
  Do2.xhrCallback = Fo2
})
// @from(Start 12716500, End 12717791)
Eo2 = z((Co2) => {
  Object.defineProperty(Co2, "__esModule", {
    value: !0
  });
  var yPA = i0(),
    Ho2 = $$(),
    xPA = pq();

  function fD3(A, Q = !0, B = !0) {
    if (!xPA.WINDOW || !xPA.WINDOW.location) {
      Ho2.DEBUG_BUILD && yPA.logger.warn("Could not initialize routing instrumentation due to invalid location");
      return
    }
    let G = xPA.WINDOW.location.href,
      Z;
    if (Q) Z = A({
      name: xPA.WINDOW.location.pathname,
      startTimestamp: yPA.browserPerformanceTimeOrigin ? yPA.browserPerformanceTimeOrigin / 1000 : void 0,
      op: "pageload",
      origin: "auto.pageload.browser",
      metadata: {
        source: "url"
      }
    });
    if (B) yPA.addHistoryInstrumentationHandler(({
      to: I,
      from: Y
    }) => {
      if (Y === void 0 && G && G.indexOf(I) !== -1) {
        G = void 0;
        return
      }
      if (Y !== I) {
        if (G = void 0, Z) Ho2.DEBUG_BUILD && yPA.logger.log(`[Tracing] Finishing current transaction with op: ${Z.op}`), Z.end();
        Z = A({
          name: xPA.WINDOW.location.pathname,
          op: "navigation",
          origin: "auto.navigation.browser",
          metadata: {
            source: "url"
          }
        })
      }
    })
  }
  Co2.instrumentRoutingWithDefaults = fD3
})
// @from(Start 12717797, End 12727388)
Lo2 = z((No2) => {
  Object.defineProperty(No2, "__esModule", {
    value: !0
  });
  var aP = _4(),
    qg = i0(),
    Qa = $$(),
    gD3 = RY0(),
    zo2 = RXA(),
    vPA = xY0(),
    $o2 = pG1(),
    uD3 = Eo2(),
    ZQA = pq(),
    wo2 = "BrowserTracing",
    mD3 = {
      ...aP.TRACING_DEFAULTS,
      markBackgroundTransactions: !0,
      routingInstrumentation: uD3.instrumentRoutingWithDefaults,
      startTransactionOnLocationChange: !0,
      startTransactionOnPageLoad: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...$o2.defaultRequestInstrumentationOptions
    },
    Uo2 = 10;
  class qo2 {
    constructor(A) {
      if (this.name = wo2, this._hasSetTracePropagationTargets = !1, aP.addTracingExtensions(), Qa.DEBUG_BUILD) this._hasSetTracePropagationTargets = !!(A && (A.tracePropagationTargets || A.tracingOrigins));
      if (this.options = {
          ...mD3,
          ...A
        }, this.options._experiments.enableLongTask !== void 0) this.options.enableLongTask = this.options._experiments.enableLongTask;
      if (A && !A.tracePropagationTargets && A.tracingOrigins) this.options.tracePropagationTargets = A.tracingOrigins;
      if (this._collectWebVitals = vPA.startTrackingWebVitals(), this._interactionIdToRouteNameMapping = {}, this.options.enableInp) vPA.startTrackingINP(this._interactionIdToRouteNameMapping, this.options.interactionsSampleRate);
      if (this.options.enableLongTask) vPA.startTrackingLongTasks();
      if (this.options._experiments.enableInteractions) vPA.startTrackingInteractions();
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
          routingInstrumentation: I,
          startTransactionOnLocationChange: Y,
          startTransactionOnPageLoad: J,
          markBackgroundTransactions: W,
          traceFetch: X,
          traceXHR: V,
          shouldCreateSpanForRequest: F,
          enableHTTPTimings: K,
          _experiments: D
        } = this.options,
        H = Z && Z.tracePropagationTargets,
        C = H || this.options.tracePropagationTargets;
      if (Qa.DEBUG_BUILD && this._hasSetTracePropagationTargets && H) qg.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
      if (I((E) => {
          let U = this._createRouteTransaction(E);
          return this.options._experiments.onStartRouteTransaction && this.options._experiments.onStartRouteTransaction(U, E, Q), U
        }, J, Y), W) gD3.registerBackgroundTabDetection();
      if (D.enableInteractions) this._registerInteractionListener();
      if (this.options.enableInp) this._registerInpInteractionListener();
      $o2.instrumentOutgoingRequests({
        traceFetch: X,
        traceXHR: V,
        tracePropagationTargets: C,
        shouldCreateSpanForRequest: F,
        enableHTTPTimings: K
      })
    }
    _createRouteTransaction(A) {
      if (!this._getCurrentHub) {
        Qa.DEBUG_BUILD && qg.logger.warn(`[Tracing] Did not create ${A.op} transaction because _getCurrentHub is invalid.`);
        return
      }
      let Q = this._getCurrentHub(),
        {
          beforeNavigate: B,
          idleTimeout: G,
          finalTimeout: Z,
          heartbeatInterval: I
        } = this.options,
        Y = A.op === "pageload",
        J;
      if (Y) {
        let K = Y ? fY0("sentry-trace") : "",
          D = Y ? fY0("baggage") : void 0,
          {
            traceId: H,
            dsc: C,
            parentSpanId: E,
            sampled: U
          } = qg.propagationContextFromHeaders(K, D);
        J = {
          traceId: H,
          parentSpanId: E,
          parentSampled: U,
          ...A,
          metadata: {
            ...A.metadata,
            dynamicSamplingContext: C
          },
          trimEnd: !0
        }
      } else J = {
        trimEnd: !0,
        ...A
      };
      let W = typeof B === "function" ? B(J) : J,
        X = W === void 0 ? {
          ...J,
          sampled: !1
        } : W;
      if (X.metadata = X.name !== J.name ? {
          ...X.metadata,
          source: "custom"
        } : X.metadata, this._latestRoute.name = X.name, this._latestRoute.context = X, X.sampled === !1) Qa.DEBUG_BUILD && qg.logger.log(`[Tracing] Will not send ${X.op} transaction because of beforeNavigate.`);
      Qa.DEBUG_BUILD && qg.logger.log(`[Tracing] Starting ${X.op} transaction on scope`);
      let {
        location: V
      } = ZQA.WINDOW, F = aP.startIdleTransaction(Q, X, G, Z, !0, {
        location: V
      }, I, Y);
      if (Y) {
        if (ZQA.WINDOW.document) {
          if (ZQA.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(ZQA.WINDOW.document.readyState)) F.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(ZQA.WINDOW.document.readyState)) F.sendAutoFinishSignal()
        }
      }
      return F.registerBeforeFinishCallback((K) => {
        this._collectWebVitals(), vPA.addPerformanceEntries(K)
      }), F
    }
    _registerInteractionListener() {
      let A, Q = () => {
        let {
          idleTimeout: B,
          finalTimeout: G,
          heartbeatInterval: Z
        } = this.options, I = "ui.action.click", Y = aP.getActiveTransaction();
        if (Y && Y.op && ["navigation", "pageload"].includes(Y.op)) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
          return
        }
        if (A) A.setFinishReason("interactionInterrupted"), A.end(), A = void 0;
        if (!this._getCurrentHub) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because _getCurrentHub is invalid.");
          return
        }
        if (!this._latestRoute.name) {
          Qa.DEBUG_BUILD && qg.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
          return
        }
        let J = this._getCurrentHub(),
          {
            location: W
          } = ZQA.WINDOW,
          X = {
            name: this._latestRoute.name,
            op: "ui.action.click",
            trimEnd: !0,
            data: {
              [aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: this._latestRoute.context ? dD3(this._latestRoute.context) : "url"
            }
          };
        A = aP.startIdleTransaction(J, X, B, G, !0, {
          location: W
        }, Z)
      };
      ["click"].forEach((B) => {
        if (ZQA.WINDOW.document) addEventListener(B, Q, {
          once: !1,
          capture: !0
        })
      })
    }
    _registerInpInteractionListener() {
      let A = ({
        entries: Q
      }) => {
        let B = aP.getClient(),
          G = B !== void 0 && B.getIntegrationByName !== void 0 ? B.getIntegrationByName("Replay") : void 0,
          Z = G !== void 0 ? G.getReplayId() : void 0,
          I = aP.getActiveTransaction(),
          Y = aP.getCurrentScope(),
          J = Y !== void 0 ? Y.getUser() : void 0;
        Q.forEach((W) => {
          if (cD3(W)) {
            let X = W.interactionId;
            if (X === void 0) return;
            let V = this._interactionIdToRouteNameMapping[X],
              F = W.duration,
              K = W.startTime,
              D = Object.keys(this._interactionIdToRouteNameMapping),
              H = D.length > 0 ? D.reduce((C, E) => {
                return this._interactionIdToRouteNameMapping[C].duration < this._interactionIdToRouteNameMapping[E].duration ? C : E
              }) : void 0;
            if (W.entryType === "first-input") {
              if (D.map((E) => this._interactionIdToRouteNameMapping[E]).some((E) => {
                  return E.duration === F && E.startTime === K
                })) return
            }
            if (!X) return;
            if (V) V.duration = Math.max(V.duration, F);
            else if (D.length < Uo2 || H === void 0 || F > this._interactionIdToRouteNameMapping[H].duration) {
              let C = this._latestRoute.name,
                E = this._latestRoute.context;
              if (C && E) {
                if (H && Object.keys(this._interactionIdToRouteNameMapping).length >= Uo2) delete this._interactionIdToRouteNameMapping[H];
                this._interactionIdToRouteNameMapping[X] = {
                  routeName: C,
                  duration: F,
                  parentContext: E,
                  user: J,
                  activeTransaction: I,
                  replayId: Z,
                  startTime: K
                }
              }
            }
          }
        })
      };
      zo2.addPerformanceInstrumentationHandler("event", A), zo2.addPerformanceInstrumentationHandler("first-input", A)
    }
  }

  function fY0(A) {
    let Q = qg.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function dD3(A) {
    let Q = A.attributes && A.attributes[aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[aP.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }

  function cD3(A) {
    return "duration" in A
  }
  No2.BROWSER_TRACING_INTEGRATION_ID = wo2;
  No2.BrowserTracing = qo2;
  No2.getMetaContent = fY0
})
// @from(Start 12727394, End 12737215)
_o2 = z((So2) => {
  Object.defineProperty(So2, "__esModule", {
    value: !0
  });
  var pW = _4(),
    SO = i0(),
    Ba = $$(),
    nD3 = RY0(),
    Mo2 = RXA(),
    bPA = xY0(),
    Ro2 = pG1(),
    iq = pq(),
    To2 = "BrowserTracing",
    aD3 = {
      ...pW.TRACING_DEFAULTS,
      instrumentNavigation: !0,
      instrumentPageLoad: !0,
      markBackgroundSpan: !0,
      enableLongTask: !0,
      enableInp: !1,
      interactionsSampleRate: 1,
      _experiments: {},
      ...Ro2.defaultRequestInstrumentationOptions
    },
    sD3 = (A = {}) => {
      let Q = Ba.DEBUG_BUILD ? !!(A.tracePropagationTargets || A.tracingOrigins) : !1;
      if (pW.addTracingExtensions(), !A.tracePropagationTargets && A.tracingOrigins) A.tracePropagationTargets = A.tracingOrigins;
      let B = {
          ...aD3,
          ...A
        },
        G = bPA.startTrackingWebVitals(),
        Z = {};
      if (B.enableInp) bPA.startTrackingINP(Z, B.interactionsSampleRate);
      if (B.enableLongTask) bPA.startTrackingLongTasks();
      if (B._experiments.enableInteractions) bPA.startTrackingInteractions();
      let I = {
        name: void 0,
        context: void 0
      };

      function Y(J) {
        let W = pW.getCurrentHub(),
          {
            beforeStartSpan: X,
            idleTimeout: V,
            finalTimeout: F,
            heartbeatInterval: K
          } = B,
          D = J.op === "pageload",
          H;
        if (D) {
          let q = D ? hY0("sentry-trace") : "",
            w = D ? hY0("baggage") : void 0,
            {
              traceId: N,
              dsc: R,
              parentSpanId: T,
              sampled: y
            } = SO.propagationContextFromHeaders(q, w);
          H = {
            traceId: N,
            parentSpanId: T,
            parentSampled: y,
            ...J,
            metadata: {
              ...J.metadata,
              dynamicSamplingContext: R
            },
            trimEnd: !0
          }
        } else H = {
          trimEnd: !0,
          ...J
        };
        let C = X ? X(H) : H;
        if (C.metadata = C.name !== H.name ? {
            ...C.metadata,
            source: "custom"
          } : C.metadata, I.name = C.name, I.context = C, C.sampled === !1) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Will not send ${C.op} transaction because of beforeNavigate.`);
        Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Starting ${C.op} transaction on scope`);
        let {
          location: E
        } = iq.WINDOW, U = pW.startIdleTransaction(W, C, V, F, !0, {
          location: E
        }, K, D);
        if (D && iq.WINDOW.document) {
          if (iq.WINDOW.document.addEventListener("readystatechange", () => {
              if (["interactive", "complete"].includes(iq.WINDOW.document.readyState)) U.sendAutoFinishSignal()
            }), ["interactive", "complete"].includes(iq.WINDOW.document.readyState)) U.sendAutoFinishSignal()
        }
        return U.registerBeforeFinishCallback((q) => {
          G(), bPA.addPerformanceEntries(q)
        }), U
      }
      return {
        name: To2,
        setupOnce: () => {},
        afterAllSetup(J) {
          let W = J.getOptions(),
            {
              markBackgroundSpan: X,
              traceFetch: V,
              traceXHR: F,
              shouldCreateSpanForRequest: K,
              enableHTTPTimings: D,
              _experiments: H
            } = B,
            C = W && W.tracePropagationTargets,
            E = C || B.tracePropagationTargets;
          if (Ba.DEBUG_BUILD && Q && C) SO.logger.warn("[Tracing] The `tracePropagationTargets` option was set in the BrowserTracing integration and top level `Sentry.init`. The top level `Sentry.init` value is being used.");
          let U, q = iq.WINDOW.location && iq.WINDOW.location.href;
          if (J.on) J.on("startNavigationSpan", (w) => {
            if (U) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Finishing current transaction with op: ${pW.spanToJSON(U).op}`), U.end();
            U = Y({
              op: "navigation",
              ...w
            })
          }), J.on("startPageLoadSpan", (w) => {
            if (U) Ba.DEBUG_BUILD && SO.logger.log(`[Tracing] Finishing current transaction with op: ${pW.spanToJSON(U).op}`), U.end();
            U = Y({
              op: "pageload",
              ...w
            })
          });
          if (B.instrumentPageLoad && J.emit && iq.WINDOW.location) {
            let w = {
              name: iq.WINDOW.location.pathname,
              startTimestamp: SO.browserPerformanceTimeOrigin ? SO.browserPerformanceTimeOrigin / 1000 : void 0,
              origin: "auto.pageload.browser",
              attributes: {
                [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
              }
            };
            Po2(J, w)
          }
          if (B.instrumentNavigation && J.emit && iq.WINDOW.location) SO.addHistoryInstrumentationHandler(({
            to: w,
            from: N
          }) => {
            if (N === void 0 && q && q.indexOf(w) !== -1) {
              q = void 0;
              return
            }
            if (N !== w) {
              q = void 0;
              let R = {
                name: iq.WINDOW.location.pathname,
                origin: "auto.navigation.browser",
                attributes: {
                  [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
                }
              };
              jo2(J, R)
            }
          });
          if (X) nD3.registerBackgroundTabDetection();
          if (H.enableInteractions) rD3(B, I);
          if (B.enableInp) tD3(Z, I);
          Ro2.instrumentOutgoingRequests({
            traceFetch: V,
            traceXHR: F,
            tracePropagationTargets: E,
            shouldCreateSpanForRequest: K,
            enableHTTPTimings: D
          })
        },
        options: B
      }
    };

  function Po2(A, Q) {
    if (!A.emit) return;
    A.emit("startPageLoadSpan", Q);
    let B = pW.getActiveSpan();
    return (B && pW.spanToJSON(B).op) === "pageload" ? B : void 0
  }

  function jo2(A, Q) {
    if (!A.emit) return;
    A.emit("startNavigationSpan", Q);
    let B = pW.getActiveSpan();
    return (B && pW.spanToJSON(B).op) === "navigation" ? B : void 0
  }

  function hY0(A) {
    let Q = SO.getDomElement(`meta[name=${A}]`);
    return Q ? Q.getAttribute("content") : void 0
  }

  function rD3(A, Q) {
    let B, G = () => {
      let {
        idleTimeout: Z,
        finalTimeout: I,
        heartbeatInterval: Y
      } = A, J = "ui.action.click", W = pW.getActiveTransaction();
      if (W && W.op && ["navigation", "pageload"].includes(W.op)) {
        Ba.DEBUG_BUILD && SO.logger.warn("[Tracing] Did not create ui.action.click transaction because a pageload or navigation transaction is in progress.");
        return
      }
      if (B) B.setFinishReason("interactionInterrupted"), B.end(), B = void 0;
      if (!Q.name) {
        Ba.DEBUG_BUILD && SO.logger.warn("[Tracing] Did not create ui.action.click transaction because _latestRouteName is missing.");
        return
      }
      let {
        location: X
      } = iq.WINDOW, V = {
        name: Q.name,
        op: "ui.action.click",
        trimEnd: !0,
        data: {
          [pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: Q.context ? eD3(Q.context) : "url"
        }
      };
      B = pW.startIdleTransaction(pW.getCurrentHub(), V, Z, I, !0, {
        location: X
      }, Y)
    };
    ["click"].forEach((Z) => {
      if (iq.WINDOW.document) addEventListener(Z, G, {
        once: !1,
        capture: !0
      })
    })
  }

  function oD3(A) {
    return "duration" in A
  }
  var Oo2 = 10;

  function tD3(A, Q) {
    let B = ({
      entries: G
    }) => {
      let Z = pW.getClient(),
        I = Z !== void 0 && Z.getIntegrationByName !== void 0 ? Z.getIntegrationByName("Replay") : void 0,
        Y = I !== void 0 ? I.getReplayId() : void 0,
        J = pW.getActiveTransaction(),
        W = pW.getCurrentScope(),
        X = W !== void 0 ? W.getUser() : void 0;
      G.forEach((V) => {
        if (oD3(V)) {
          let F = V.interactionId;
          if (F === void 0) return;
          let K = A[F],
            D = V.duration,
            H = V.startTime,
            C = Object.keys(A),
            E = C.length > 0 ? C.reduce((U, q) => {
              return A[U].duration < A[q].duration ? U : q
            }) : void 0;
          if (V.entryType === "first-input") {
            if (C.map((q) => A[q]).some((q) => {
                return q.duration === D && q.startTime === H
              })) return
          }
          if (!F) return;
          if (K) K.duration = Math.max(K.duration, D);
          else if (C.length < Oo2 || E === void 0 || D > A[E].duration) {
            let {
              name: U,
              context: q
            } = Q;
            if (U && q) {
              if (E && Object.keys(A).length >= Oo2) delete A[E];
              A[F] = {
                routeName: U,
                duration: D,
                parentContext: q,
                user: X,
                activeTransaction: J,
                replayId: Y,
                startTime: H
              }
            }
          }
        }
      })
    };
    Mo2.addPerformanceInstrumentationHandler("event", B), Mo2.addPerformanceInstrumentationHandler("first-input", B)
  }

  function eD3(A) {
    let Q = A.attributes && A.attributes[pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      B = A.data && A.data[pW.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE],
      G = A.metadata && A.metadata.source;
    return Q || B || G
  }
  So2.BROWSER_TRACING_INTEGRATION_ID = To2;
  So2.browserTracingIntegration = sD3;
  So2.getMetaContent = hY0;
  So2.startBrowserTracingNavigationSpan = jo2;
  So2.startBrowserTracingPageLoadSpan = Po2
})
// @from(Start 12737221, End 12738300)
xo2 = z((yo2, fPA) => {
  Object.defineProperty(yo2, "__esModule", {
    value: !0
  });
  var ko2 = _4(),
    TXA = i0();

  function IH3() {
    let A = ko2.getMainCarrier();
    if (!A.__SENTRY__) return;
    let Q = {
        mongodb() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mongo")).Mongo
        },
        mongoose() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mongo")).Mongo
        },
        mysql() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/mysql")).Mysql
        },
        pg() {
          return new(TXA.dynamicRequire(fPA, "./node/integrations/postgres")).Postgres
        }
      },
      B = Object.keys(Q).filter((G) => !!TXA.loadModule(G)).map((G) => {
        try {
          return Q[G]()
        } catch (Z) {
          return
        }
      }).filter((G) => G);
    if (B.length > 0) A.__SENTRY__.integrations = [...A.__SENTRY__.integrations || [], ...B]
  }

  function YH3() {
    if (ko2.addTracingExtensions(), TXA.isNodeEnv()) IH3()
  }
  yo2.addExtensionMethods = YH3
})
// @from(Start 12738306, End 12740470)
uY0 = z((go2) => {
  Object.defineProperty(go2, "__esModule", {
    value: !0
  });
  var Ng = _4(),
    vo2 = i0(),
    WH3 = ls2(),
    XH3 = ns2(),
    VH3 = ss2(),
    FH3 = ts2(),
    KH3 = Qr2(),
    DH3 = Zr2(),
    HH3 = Jr2(),
    CH3 = Xr2(),
    bo2 = Lo2(),
    gY0 = _o2(),
    fo2 = pG1(),
    lG1 = RXA(),
    ho2 = vY0(),
    EH3 = xo2();
  go2.IdleTransaction = Ng.IdleTransaction;
  go2.Span = Ng.Span;
  go2.SpanStatus = Ng.SpanStatus;
  go2.Transaction = Ng.Transaction;
  go2.extractTraceparentData = Ng.extractTraceparentData;
  go2.getActiveTransaction = Ng.getActiveTransaction;
  go2.hasTracingEnabled = Ng.hasTracingEnabled;
  go2.spanStatusfromHttpCode = Ng.spanStatusfromHttpCode;
  go2.startIdleTransaction = Ng.startIdleTransaction;
  go2.TRACEPARENT_REGEXP = vo2.TRACEPARENT_REGEXP;
  go2.stripUrlQueryAndFragment = vo2.stripUrlQueryAndFragment;
  go2.Express = WH3.Express;
  go2.Postgres = XH3.Postgres;
  go2.Mysql = VH3.Mysql;
  go2.Mongo = FH3.Mongo;
  go2.Prisma = KH3.Prisma;
  go2.GraphQL = DH3.GraphQL;
  go2.Apollo = HH3.Apollo;
  go2.lazyLoadedNodePerformanceMonitoringIntegrations = CH3.lazyLoadedNodePerformanceMonitoringIntegrations;
  go2.BROWSER_TRACING_INTEGRATION_ID = bo2.BROWSER_TRACING_INTEGRATION_ID;
  go2.BrowserTracing = bo2.BrowserTracing;
  go2.browserTracingIntegration = gY0.browserTracingIntegration;
  go2.startBrowserTracingNavigationSpan = gY0.startBrowserTracingNavigationSpan;
  go2.startBrowserTracingPageLoadSpan = gY0.startBrowserTracingPageLoadSpan;
  go2.defaultRequestInstrumentationOptions = fo2.defaultRequestInstrumentationOptions;
  go2.instrumentOutgoingRequests = fo2.instrumentOutgoingRequests;
  go2.addClsInstrumentationHandler = lG1.addClsInstrumentationHandler;
  go2.addFidInstrumentationHandler = lG1.addFidInstrumentationHandler;
  go2.addLcpInstrumentationHandler = lG1.addLcpInstrumentationHandler;
  go2.addPerformanceInstrumentationHandler = lG1.addPerformanceInstrumentationHandler;
  go2.addTracingHeadersToFetchRequest = ho2.addTracingHeadersToFetchRequest;
  go2.instrumentFetchRequest = ho2.instrumentFetchRequest;
  go2.addExtensionMethods = EH3.addExtensionMethods
})
// @from(Start 12740476, End 12741025)
mo2 = z((uo2) => {
  Object.defineProperty(uo2, "__esModule", {
    value: !0
  });
  var rH3 = uY0(),
    oH3 = i0();

  function tH3() {
    let A = rH3.lazyLoadedNodePerformanceMonitoringIntegrations.map((Q) => {
      try {
        return Q()
      } catch (B) {
        return
      }
    }).filter((Q) => !!Q);
    if (A.length === 0) oH3.logger.warn("Performance monitoring integrations could not be automatically loaded.");
    return A.filter((Q) => !!Q.loadDependency())
  }
  uo2.autoDiscoverNodePerformanceMonitoringIntegrations = tH3
})
// @from(Start 12741031, End 12741681)
mY0 = z((po2) => {
  Object.defineProperty(po2, "__esModule", {
    value: !0
  });
  var AC3 = UA("os"),
    QC3 = UA("util"),
    do2 = _4();
  class co2 extends do2.ServerRuntimeClient {
    constructor(A) {
      do2.applySdkMetadata(A, "node"), A.transportOptions = {
        textEncoder: new QC3.TextEncoder,
        ...A.transportOptions
      };
      let Q = {
        ...A,
        platform: "node",
        runtime: {
          name: "node",
          version: global.process.version
        },
        serverName: A.serverName || global.process.env.SENTRY_NAME || AC3.hostname()
      };
      super(Q)
    }
  }
  po2.NodeClient = co2
})
// @from(Start 12741687, End 12743326)
so2 = z((ao2) => {
  var {
    _nullishCoalesce: lo2
  } = i0();
  Object.defineProperty(ao2, "__esModule", {
    value: !0
  });
  var io2 = UA("http");
  UA("https");
  var oy = Symbol("AgentBaseInternalState");
  class no2 extends io2.Agent {
    constructor(A) {
      super(A);
      this[oy] = {}
    }
    isSecureEndpoint(A) {
      if (A) {
        if (typeof A.secureEndpoint === "boolean") return A.secureEndpoint;
        if (typeof A.protocol === "string") return A.protocol === "https:"
      }
      let {
        stack: Q
      } = Error();
      if (typeof Q !== "string") return !1;
      return Q.split(`
`).some((B) => B.indexOf("(https.js:") !== -1 || B.indexOf("node:https:") !== -1)
    }
    createSocket(A, Q, B) {
      let G = {
        ...Q,
        secureEndpoint: this.isSecureEndpoint(Q)
      };
      Promise.resolve().then(() => this.connect(A, G)).then((Z) => {
        if (Z instanceof io2.Agent) return Z.addRequest(A, G);
        this[oy].currentSocket = Z, super.createSocket(A, Q, B)
      }, B)
    }
    createConnection() {
      let A = this[oy].currentSocket;
      if (this[oy].currentSocket = void 0, !A) throw Error("No socket was returned in the `connect()` function");
      return A
    }
    get defaultPort() {
      return lo2(this[oy].defaultPort, () => this.protocol === "https:" ? 443 : 80)
    }
    set defaultPort(A) {
      if (this[oy]) this[oy].defaultPort = A
    }
    get protocol() {
      return lo2(this[oy].protocol, () => this.isSecureEndpoint() ? "https:" : "http:")
    }
    set protocol(A) {
      if (this[oy]) this[oy].protocol = A
    }
  }
  ao2.Agent = no2
})
// @from(Start 12743332, End 12745341)
oo2 = z((ro2) => {
  Object.defineProperty(ro2, "__esModule", {
    value: !0
  });
  var ZC3 = i0();

  function iG1(...A) {
    ZC3.logger.log("[https-proxy-agent:parse-proxy-response]", ...A)
  }

  function IC3(A) {
    return new Promise((Q, B) => {
      let G = 0,
        Z = [];

      function I() {
        let V = A.read();
        if (V) X(V);
        else A.once("readable", I)
      }

      function Y() {
        A.removeListener("end", J), A.removeListener("error", W), A.removeListener("readable", I)
      }

      function J() {
        Y(), iG1("onend"), B(Error("Proxy connection ended before receiving CONNECT response"))
      }

      function W(V) {
        Y(), iG1("onerror %o", V), B(V)
      }

      function X(V) {
        Z.push(V), G += V.length;
        let F = Buffer.concat(Z, G),
          K = F.indexOf(`\r
\r
`);
        if (K === -1) {
          iG1("have not received end of HTTP headers yet..."), I();
          return
        }
        let D = F.slice(0, K).toString("ascii").split(`\r
`),
          H = D.shift();
        if (!H) return A.destroy(), B(Error("No header received from proxy CONNECT response"));
        let C = H.split(" "),
          E = +C[1],
          U = C.slice(2).join(" "),
          q = {};
        for (let w of D) {
          if (!w) continue;
          let N = w.indexOf(":");
          if (N === -1) return A.destroy(), B(Error(`Invalid header from proxy CONNECT response: "${w}"`));
          let R = w.slice(0, N).toLowerCase(),
            T = w.slice(N + 1).trimStart(),
            y = q[R];
          if (typeof y === "string") q[R] = [y, T];
          else if (Array.isArray(y)) y.push(T);
          else q[R] = T
        }
        iG1("got proxy server response: %o %o", H, q), Y(), Q({
          connect: {
            statusCode: E,
            statusText: U,
            headers: q
          },
          buffered: F
        })
      }
      A.on("error", W), A.on("end", J), I()
    })
  }
  ro2.parseProxyResponse = IC3
})
// @from(Start 12745347, End 12748607)
Qt2 = z((At2) => {
  var {
    _nullishCoalesce: JC3,
    _optionalChain: WC3
  } = i0();
  Object.defineProperty(At2, "__esModule", {
    value: !0
  });
  var hPA = UA("net"),
    to2 = UA("tls"),
    XC3 = UA("url"),
    VC3 = i0(),
    FC3 = so2(),
    KC3 = oo2();

  function gPA(...A) {
    VC3.logger.log("[https-proxy-agent]", ...A)
  }
  class dY0 extends FC3.Agent {
    static __initStatic() {
      this.protocols = ["http", "https"]
    }
    constructor(A, Q) {
      super(Q);
      this.options = {}, this.proxy = typeof A === "string" ? new XC3.URL(A) : A, this.proxyHeaders = JC3(WC3([Q, "optionalAccess", (Z) => Z.headers]), () => ({})), gPA("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let B = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""),
        G = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...Q ? eo2(Q, "headers") : null,
        host: B,
        port: G
      }
    }
    async connect(A, Q) {
      let {
        proxy: B
      } = this;
      if (!Q.host) throw TypeError('No "host" provided');
      let G;
      if (B.protocol === "https:") {
        gPA("Creating `tls.Socket`: %o", this.connectOpts);
        let F = this.connectOpts.servername || this.connectOpts.host;
        G = to2.connect({
          ...this.connectOpts,
          servername: F && hPA.isIP(F) ? void 0 : F
        })
      } else gPA("Creating `net.Socket`: %o", this.connectOpts), G = hPA.connect(this.connectOpts);
      let Z = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : {
          ...this.proxyHeaders
        },
        I = hPA.isIPv6(Q.host) ? `[${Q.host}]` : Q.host,
        Y = `CONNECT ${I}:${Q.port} HTTP/1.1\r
`;
      if (B.username || B.password) {
        let F = `${decodeURIComponent(B.username)}:${decodeURIComponent(B.password)}`;
        Z["Proxy-Authorization"] = `Basic ${Buffer.from(F).toString("base64")}`
      }
      if (Z.Host = `${I}:${Q.port}`, !Z["Proxy-Connection"]) Z["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let F of Object.keys(Z)) Y += `${F}: ${Z[F]}\r
`;
      let J = KC3.parseProxyResponse(G);
      G.write(`${Y}\r
`);
      let {
        connect: W,
        buffered: X
      } = await J;
      if (A.emit("proxyConnect", W), this.emit("proxyConnect", W, A), W.statusCode === 200) {
        if (A.once("socket", DC3), Q.secureEndpoint) {
          gPA("Upgrading socket connection to TLS");
          let F = Q.servername || Q.host;
          return to2.connect({
            ...eo2(Q, "host", "path", "port"),
            socket: G,
            servername: hPA.isIP(F) ? void 0 : F
          })
        }
        return G
      }
      G.destroy();
      let V = new hPA.Socket({
        writable: !1
      });
      return V.readable = !0, A.once("socket", (F) => {
        gPA("Replaying proxy buffer for failed request"), F.push(X), F.push(null)
      }), V
    }
  }
  dY0.__initStatic();

  function DC3(A) {
    A.resume()
  }

  function eo2(A, ...Q) {
    let B = {},
      G;
    for (G in A)
      if (!Q.includes(G)) B[G] = A[G];
    return B
  }
  At2.HttpsProxyAgent = dY0
})
// @from(Start 12748613, End 12751142)
pY0 = z((Zt2) => {
  var {
    _nullishCoalesce: cY0
  } = i0();
  Object.defineProperty(Zt2, "__esModule", {
    value: !0
  });
  var CC3 = UA("http"),
    EC3 = UA("https"),
    zC3 = UA("stream"),
    Gt2 = UA("url"),
    UC3 = UA("zlib"),
    Bt2 = _4(),
    $C3 = i0(),
    wC3 = Qt2(),
    qC3 = 32768;

  function NC3(A) {
    return new zC3.Readable({
      read() {
        this.push(A), this.push(null)
      }
    })
  }

  function LC3(A) {
    let Q;
    try {
      Q = new Gt2.URL(A.url)
    } catch (W) {
      return $C3.consoleSandbox(() => {
        console.warn("[@sentry/node]: Invalid dsn or tunnel option, will not send any events. The tunnel option must be a full URL when used.")
      }), Bt2.createTransport(A, () => Promise.resolve({}))
    }
    let B = Q.protocol === "https:",
      G = MC3(Q, A.proxy || (B ? process.env.https_proxy : void 0) || process.env.http_proxy),
      Z = B ? EC3 : CC3,
      I = A.keepAlive === void 0 ? !1 : A.keepAlive,
      Y = G ? new wC3.HttpsProxyAgent(G) : new Z.Agent({
        keepAlive: I,
        maxSockets: 30,
        timeout: 2000
      }),
      J = OC3(A, cY0(A.httpModule, () => Z), Y);
    return Bt2.createTransport(A, J)
  }

  function MC3(A, Q) {
    let {
      no_proxy: B
    } = process.env;
    if (B && B.split(",").some((Z) => A.host.endsWith(Z) || A.hostname.endsWith(Z))) return;
    else return Q
  }

  function OC3(A, Q, B) {
    let {
      hostname: G,
      pathname: Z,
      port: I,
      protocol: Y,
      search: J
    } = new Gt2.URL(A.url);
    return function(X) {
      return new Promise((V, F) => {
        let K = NC3(X.body),
          D = {
            ...A.headers
          };
        if (X.body.length > qC3) D["content-encoding"] = "gzip", K = K.pipe(UC3.createGzip());
        let H = Q.request({
          method: "POST",
          agent: B,
          headers: D,
          hostname: G,
          path: `${Z}${J}`,
          port: I,
          protocol: Y,
          ca: A.caCerts
        }, (C) => {
          C.on("data", () => {}), C.on("end", () => {}), C.setEncoding("utf8");
          let E = cY0(C.headers["retry-after"], () => null),
            U = cY0(C.headers["x-sentry-rate-limits"], () => null);
          V({
            statusCode: C.statusCode,
            headers: {
              "retry-after": E,
              "x-sentry-rate-limits": Array.isArray(U) ? U[0] : U
            }
          })
        });
        H.on("error", F), K.pipe(H)
      })
    }
  }
  Zt2.makeNodeTransport = LC3
})
// @from(Start 12751148, End 12751327)
IQA = z((It2) => {
  Object.defineProperty(It2, "__esModule", {
    value: !0
  });
  var TC3 = i0(),
    PC3 = TC3.parseSemver(process.versions.node);
  It2.NODE_VERSION = PC3
})
// @from(Start 12751333, End 12752244)
Xt2 = z((Wt2) => {
  var {
    _optionalChain: SC3
  } = i0();
  Object.defineProperty(Wt2, "__esModule", {
    value: !0
  });
  var Yt2 = UA("domain"),
    YQA = _4();

  function Jt2() {
    return Yt2.active
  }

  function _C3() {
    let A = Jt2();
    if (!A) return;
    return YQA.ensureHubOnCarrier(A), YQA.getHubFromCarrier(A)
  }

  function kC3(A) {
    let Q = {};
    return YQA.ensureHubOnCarrier(Q, A), YQA.getHubFromCarrier(Q)
  }

  function yC3(A, Q) {
    let B = Jt2();
    if (B && SC3([Q, "optionalAccess", (Y) => Y.reuseExisting])) return A();
    let G = Yt2.create(),
      Z = B ? YQA.getHubFromCarrier(B) : void 0,
      I = kC3(Z);
    return YQA.setHubOnCarrier(G, I), G.bind(() => {
      return A()
    })()
  }

  function xC3() {
    YQA.setAsyncContextStrategy({
      getCurrentHub: _C3,
      runWithAsyncContext: yC3
    })
  }
  Wt2.setDomainAsyncContextStrategy = xC3
})
// @from(Start 12752250, End 12753017)
Ft2 = z((Vt2) => {
  var {
    _optionalChain: bC3
  } = i0();
  Object.defineProperty(Vt2, "__esModule", {
    value: !0
  });
  var lY0 = _4(),
    fC3 = UA("async_hooks"),
    nG1;

  function hC3() {
    if (!nG1) nG1 = new fC3.AsyncLocalStorage;

    function A() {
      return nG1.getStore()
    }

    function Q(G) {
      let Z = {};
      return lY0.ensureHubOnCarrier(Z, G), lY0.getHubFromCarrier(Z)
    }

    function B(G, Z) {
      let I = A();
      if (I && bC3([Z, "optionalAccess", (J) => J.reuseExisting])) return G();
      let Y = Q(I);
      return nG1.run(Y, () => {
        return G()
      })
    }
    lY0.setAsyncContextStrategy({
      getCurrentHub: A,
      runWithAsyncContext: B
    })
  }
  Vt2.setHooksAsyncContextStrategy = hC3
})
// @from(Start 12753023, End 12753345)
Dt2 = z((Kt2) => {
  Object.defineProperty(Kt2, "__esModule", {
    value: !0
  });
  var uC3 = IQA(),
    mC3 = Xt2(),
    dC3 = Ft2();

  function cC3() {
    if (uC3.NODE_VERSION.major >= 14) dC3.setHooksAsyncContextStrategy();
    else mC3.setDomainAsyncContextStrategy()
  }
  Kt2.setNodeAsyncContextStrategy = cC3
})
// @from(Start 12753351, End 12754202)
sG1 = z((zt2) => {
  Object.defineProperty(zt2, "__esModule", {
    value: !0
  });
  var lC3 = UA("util"),
    aG1 = _4(),
    Ht2 = i0(),
    Ct2 = "Console",
    iC3 = () => {
      return {
        name: Ct2,
        setupOnce() {},
        setup(A) {
          Ht2.addConsoleInstrumentationHandler(({
            args: Q,
            level: B
          }) => {
            if (aG1.getClient() !== A) return;
            aG1.addBreadcrumb({
              category: "console",
              level: Ht2.severityLevelFromString(B),
              message: lC3.format.apply(void 0, Q)
            }, {
              input: [...Q],
              level: B
            })
          })
        }
      }
    },
    Et2 = aG1.defineIntegration(iC3),
    nC3 = aG1.convertIntegrationFnToClass(Ct2, Et2);
  zt2.Console = nC3;
  zt2.consoleIntegration = Et2
})
// @from(Start 12754208, End 12762078)
rG1 = z((Tt2) => {
  var {
    _optionalChain: JQA
  } = i0();
  Object.defineProperty(Tt2, "__esModule", {
    value: !0
  });
  var rC3 = UA("child_process"),
    $t2 = UA("fs"),
    _O = UA("os"),
    oC3 = UA("path"),
    wt2 = UA("util"),
    qt2 = _4(),
    Nt2 = wt2.promisify($t2.readFile),
    Lt2 = wt2.promisify($t2.readdir),
    Mt2 = "Context",
    tC3 = (A = {}) => {
      let Q, B = {
        app: !0,
        os: !0,
        device: !0,
        culture: !0,
        cloudResource: !0,
        ...A
      };
      async function G(I) {
        if (Q === void 0) Q = Z();
        let Y = AE3(await Q);
        return I.contexts = {
          ...I.contexts,
          app: {
            ...Y.app,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.app])
          },
          os: {
            ...Y.os,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.os])
          },
          device: {
            ...Y.device,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.device])
          },
          culture: {
            ...Y.culture,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.culture])
          },
          cloud_resource: {
            ...Y.cloud_resource,
            ...JQA([I, "access", (J) => J.contexts, "optionalAccess", (J) => J.cloud_resource])
          }
        }, I
      }
      async function Z() {
        let I = {};
        if (B.os) I.os = await QE3();
        if (B.app) I.app = GE3();
        if (B.device) I.device = Rt2(B.device);
        if (B.culture) {
          let Y = BE3();
          if (Y) I.culture = Y
        }
        if (B.cloudResource) I.cloud_resource = XE3();
        return I
      }
      return {
        name: Mt2,
        setupOnce() {},
        processEvent(I) {
          return G(I)
        }
      }
    },
    Ot2 = qt2.defineIntegration(tC3),
    eC3 = qt2.convertIntegrationFnToClass(Mt2, Ot2);

  function AE3(A) {
    if (JQA([A, "optionalAccess", (Q) => Q.app, "optionalAccess", (Q) => Q.app_memory])) A.app.app_memory = process.memoryUsage().rss;
    if (JQA([A, "optionalAccess", (Q) => Q.device, "optionalAccess", (Q) => Q.free_memory])) A.device.free_memory = _O.freemem();
    return A
  }
  async function QE3() {
    let A = _O.platform();
    switch (A) {
      case "darwin":
        return JE3();
      case "linux":
        return WE3();
      default:
        return {
          name: ZE3[A] || A, version: _O.release()
        }
    }
  }

  function BE3() {
    try {
      if (typeof process.versions.icu !== "string") return;
      let A = new Date(900000000);
      if (new Intl.DateTimeFormat("es", {
          month: "long"
        }).format(A) === "enero") {
        let B = Intl.DateTimeFormat().resolvedOptions();
        return {
          locale: B.locale,
          timezone: B.timeZone
        }
      }
    } catch (A) {}
    return
  }

  function GE3() {
    let A = process.memoryUsage().rss;
    return {
      app_start_time: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      app_memory: A
    }
  }

  function Rt2(A) {
    let Q = {},
      B;
    try {
      B = _O.uptime && _O.uptime()
    } catch (G) {}
    if (typeof B === "number") Q.boot_time = new Date(Date.now() - B * 1000).toISOString();
    if (Q.arch = _O.arch(), A === !0 || A.memory) Q.memory_size = _O.totalmem(), Q.free_memory = _O.freemem();
    if (A === !0 || A.cpu) {
      let G = _O.cpus();
      if (G && G.length) {
        let Z = G[0];
        Q.processor_count = G.length, Q.cpu_description = Z.model, Q.processor_frequency = Z.speed
      }
    }
    return Q
  }
  var ZE3 = {
      aix: "IBM AIX",
      freebsd: "FreeBSD",
      openbsd: "OpenBSD",
      sunos: "SunOS",
      win32: "Windows"
    },
    IE3 = [{
      name: "fedora-release",
      distros: ["Fedora"]
    }, {
      name: "redhat-release",
      distros: ["Red Hat Linux", "Centos"]
    }, {
      name: "redhat_version",
      distros: ["Red Hat Linux"]
    }, {
      name: "SuSE-release",
      distros: ["SUSE Linux"]
    }, {
      name: "lsb-release",
      distros: ["Ubuntu Linux", "Arch Linux"]
    }, {
      name: "debian_version",
      distros: ["Debian"]
    }, {
      name: "debian_release",
      distros: ["Debian"]
    }, {
      name: "arch-release",
      distros: ["Arch Linux"]
    }, {
      name: "gentoo-release",
      distros: ["Gentoo Linux"]
    }, {
      name: "novell-release",
      distros: ["SUSE Linux"]
    }, {
      name: "alpine-release",
      distros: ["Alpine Linux"]
    }],
    YE3 = {
      alpine: (A) => A,
      arch: (A) => ty(/distrib_release=(.*)/, A),
      centos: (A) => ty(/release ([^ ]+)/, A),
      debian: (A) => A,
      fedora: (A) => ty(/release (..)/, A),
      mint: (A) => ty(/distrib_release=(.*)/, A),
      red: (A) => ty(/release ([^ ]+)/, A),
      suse: (A) => ty(/VERSION = (.*)\n/, A),
      ubuntu: (A) => ty(/distrib_release=(.*)/, A)
    };

  function ty(A, Q) {
    let B = A.exec(Q);
    return B ? B[1] : void 0
  }
  async function JE3() {
    let A = {
      kernel_version: _O.release(),
      name: "Mac OS X",
      version: `10.${Number(_O.release().split(".")[0])-4}`
    };
    try {
      let Q = await new Promise((B, G) => {
        rC3.execFile("/usr/bin/sw_vers", (Z, I) => {
          if (Z) {
            G(Z);
            return
          }
          B(I)
        })
      });
      A.name = ty(/^ProductName:\s+(.*)$/m, Q), A.version = ty(/^ProductVersion:\s+(.*)$/m, Q), A.build = ty(/^BuildVersion:\s+(.*)$/m, Q)
    } catch (Q) {}
    return A
  }

  function Ut2(A) {
    return A.split(" ")[0].toLowerCase()
  }
  async function WE3() {
    let A = {
      kernel_version: _O.release(),
      name: "Linux"
    };
    try {
      let Q = await Lt2("/etc"),
        B = IE3.find((J) => Q.includes(J.name));
      if (!B) return A;
      let G = oC3.join("/etc", B.name),
        Z = (await Nt2(G, {
          encoding: "utf-8"
        })).toLowerCase(),
        {
          distros: I
        } = B;
      A.name = I.find((J) => Z.indexOf(Ut2(J)) >= 0) || I[0];
      let Y = Ut2(A.name);
      A.version = YE3[Y](Z)
    } catch (Q) {}
    return A
  }

  function XE3() {
    if (process.env.VERCEL) return {
      "cloud.provider": "vercel",
      "cloud.region": process.env.VERCEL_REGION
    };
    else if (process.env.AWS_REGION) return {
      "cloud.provider": "aws",
      "cloud.region": process.env.AWS_REGION,
      "cloud.platform": process.env.AWS_EXECUTION_ENV
    };
    else if (process.env.GCP_PROJECT) return {
      "cloud.provider": "gcp"
    };
    else if (process.env.ALIYUN_REGION_ID) return {
      "cloud.provider": "alibaba_cloud",
      "cloud.region": process.env.ALIYUN_REGION_ID
    };
    else if (process.env.WEBSITE_SITE_NAME && process.env.REGION_NAME) return {
      "cloud.provider": "azure",
      "cloud.region": process.env.REGION_NAME
    };
    else if (process.env.IBM_CLOUD_REGION) return {
      "cloud.provider": "ibm_cloud",
      "cloud.region": process.env.IBM_CLOUD_REGION
    };
    else if (process.env.TENCENTCLOUD_REGION) return {
      "cloud.provider": "tencent_cloud",
      "cloud.region": process.env.TENCENTCLOUD_REGION,
      "cloud.account.id": process.env.TENCENTCLOUD_APPID,
      "cloud.availability_zone": process.env.TENCENTCLOUD_ZONE
    };
    else if (process.env.NETLIFY) return {
      "cloud.provider": "netlify"
    };
    else if (process.env.FLY_REGION) return {
      "cloud.provider": "fly.io",
      "cloud.region": process.env.FLY_REGION
    };
    else if (process.env.DYNO) return {
      "cloud.provider": "heroku"
    };
    else return
  }
  Tt2.Context = eC3;
  Tt2.getDeviceContext = Rt2;
  Tt2.nodeContextIntegration = Ot2;
  Tt2.readDirAsync = Lt2;
  Tt2.readFileAsync = Nt2
})
// @from(Start 12762084, End 12764161)
tG1 = z((kt2) => {
  var {
    _optionalChain: iY0
  } = i0();
  Object.defineProperty(kt2, "__esModule", {
    value: !0
  });
  var CE3 = UA("fs"),
    Pt2 = _4(),
    jt2 = i0(),
    oG1 = new jt2.LRUMap(100),
    EE3 = 7,
    St2 = "ContextLines";

  function zE3(A) {
    return new Promise((Q, B) => {
      CE3.readFile(A, "utf8", (G, Z) => {
        if (G) B(G);
        else Q(Z)
      })
    })
  }
  var UE3 = (A = {}) => {
      let Q = A.frameContextLines !== void 0 ? A.frameContextLines : EE3;
      return {
        name: St2,
        setupOnce() {},
        processEvent(B) {
          return wE3(B, Q)
        }
      }
    },
    _t2 = Pt2.defineIntegration(UE3),
    $E3 = Pt2.convertIntegrationFnToClass(St2, _t2);
  async function wE3(A, Q) {
    let B = {},
      G = [];
    if (Q > 0 && iY0([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values]))
      for (let Z of A.exception.values) {
        if (!iY0([Z, "access", (I) => I.stacktrace, "optionalAccess", (I) => I.frames])) continue;
        for (let I = Z.stacktrace.frames.length - 1; I >= 0; I--) {
          let Y = Z.stacktrace.frames[I];
          if (Y.filename && !B[Y.filename] && !oG1.get(Y.filename)) G.push(NE3(Y.filename)), B[Y.filename] = 1
        }
      }
    if (G.length > 0) await Promise.all(G);
    if (Q > 0 && iY0([A, "access", (Z) => Z.exception, "optionalAccess", (Z) => Z.values])) {
      for (let Z of A.exception.values)
        if (Z.stacktrace && Z.stacktrace.frames) await qE3(Z.stacktrace.frames, Q)
    }
    return A
  }

  function qE3(A, Q) {
    for (let B of A)
      if (B.filename && B.context_line === void 0) {
        let G = oG1.get(B.filename);
        if (G) try {
          jt2.addContextToFrame(G, B, Q)
        } catch (Z) {}
      }
  }
  async function NE3(A) {
    let Q = oG1.get(A);
    if (Q === null) return null;
    if (Q !== void 0) return Q;
    let B = null;
    try {
      B = (await zE3(A)).split(`
`)
    } catch (G) {}
    return oG1.set(A, B), B
  }
  kt2.ContextLines = $E3;
  kt2.contextLinesIntegration = _t2
})
// @from(Start 12764167, End 12764340)
uPA = z((yt2) => {
  Object.defineProperty(yt2, "__esModule", {
    value: !0
  });
  var OE3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  yt2.DEBUG_BUILD = OE3
})
// @from(Start 12764346, End 12767316)
ft2 = z((bt2) => {
  var {
    _optionalChain: ey
  } = i0();
  Object.defineProperty(bt2, "__esModule", {
    value: !0
  });
  var nY0 = UA("url"),
    TE3 = IQA();

  function PE3(A) {
    let {
      protocol: Q,
      hostname: B,
      port: G
    } = vt2(A), Z = A.path ? A.path : "/";
    return `${Q}//${B}${G}${Z}`
  }

  function xt2(A) {
    let {
      protocol: Q,
      hostname: B,
      port: G
    } = vt2(A), Z = A.pathname || "/", I = A.auth ? jE3(A.auth) : "";
    return `${Q}//${I}${B}${G}${Z}`
  }

  function jE3(A) {
    let [Q, B] = A.split(":");
    return `${Q?"[Filtered]":""}:${B?"[Filtered]":""}@`
  }

  function SE3(A, Q, B) {
    if (!A) return A;
    let [G, Z] = A.split(" ");
    if (Q.host && !Q.protocol) Q.protocol = ey([B, "optionalAccess", (I) => I.agent, "optionalAccess", (I) => I.protocol]), Z = xt2(Q);
    if (ey([Z, "optionalAccess", (I) => I.startsWith, "call", (I) => I("///")])) Z = Z.slice(2);
    return `${G} ${Z}`
  }

  function aY0(A) {
    let Q = {
      protocol: A.protocol,
      hostname: typeof A.hostname === "string" && A.hostname.startsWith("[") ? A.hostname.slice(1, -1) : A.hostname,
      hash: A.hash,
      search: A.search,
      pathname: A.pathname,
      path: `${A.pathname||""}${A.search||""}`,
      href: A.href
    };
    if (A.port !== "") Q.port = Number(A.port);
    if (A.username || A.password) Q.auth = `${A.username}:${A.password}`;
    return Q
  }

  function _E3(A, Q) {
    let B, G;
    if (typeof Q[Q.length - 1] === "function") B = Q.pop();
    if (typeof Q[0] === "string") G = aY0(new nY0.URL(Q[0]));
    else if (Q[0] instanceof nY0.URL) G = aY0(Q[0]);
    else {
      G = Q[0];
      try {
        let Z = new nY0.URL(G.path || "", `${G.protocol||"http:"}//${G.hostname}`);
        G = {
          pathname: Z.pathname,
          search: Z.search,
          hash: Z.hash,
          ...G
        }
      } catch (Z) {}
    }
    if (Q.length === 2) G = {
      ...G,
      ...Q[1]
    };
    if (G.protocol === void 0)
      if (TE3.NODE_VERSION.major > 8) G.protocol = ey([ey([A, "optionalAccess", (Z) => Z.globalAgent]), "optionalAccess", (Z) => Z.protocol]) || ey([G.agent, "optionalAccess", (Z) => Z.protocol]) || ey([G._defaultAgent, "optionalAccess", (Z) => Z.protocol]);
      else G.protocol = ey([G.agent, "optionalAccess", (Z) => Z.protocol]) || ey([G._defaultAgent, "optionalAccess", (Z) => Z.protocol]) || ey([ey([A, "optionalAccess", (Z) => Z.globalAgent]), "optionalAccess", (Z) => Z.protocol]);
    if (B) return [G, B];
    else return [G]
  }

  function vt2(A) {
    let Q = A.protocol || "",
      B = A.hostname || A.host || "",
      G = !A.port || A.port === 80 || A.port === 443 || /^(.*):(\d+)$/.test(B) ? "" : `:${A.port}`;
    return {
      protocol: Q,
      hostname: B,
      port: G
    }
  }
  bt2.cleanSpanDescription = SE3;
  bt2.extractRawUrl = PE3;
  bt2.extractUrl = xt2;
  bt2.normalizeRequestArgs = _E3;
  bt2.urlToOptions = aY0
})
// @from(Start 12767322, End 12773244)
eG1 = z((mt2) => {
  var {
    _optionalChain: PXA
  } = i0();
  Object.defineProperty(mt2, "__esModule", {
    value: !0
  });
  var wC = _4(),
    nq = i0(),
    sY0 = uPA(),
    fE3 = IQA(),
    mPA = ft2(),
    hE3 = (A = {}) => {
      let {
        breadcrumbs: Q,
        tracing: B,
        shouldCreateSpanForRequest: G
      } = A, Z = {
        breadcrumbs: Q,
        tracing: B === !1 ? !1 : nq.dropUndefinedKeys({
          enableIfHasTracingEnabled: B === !0 ? void 0 : !0,
          shouldCreateSpanForRequest: G
        })
      };
      return new WQA(Z)
    },
    gE3 = wC.defineIntegration(hE3);
  class WQA {
    static __initStatic() {
      this.id = "Http"
    }
    __init() {
      this.name = WQA.id
    }
    constructor(A = {}) {
      WQA.prototype.__init.call(this), this._breadcrumbs = typeof A.breadcrumbs > "u" ? !0 : A.breadcrumbs, this._tracing = !A.tracing ? void 0 : A.tracing === !0 ? {} : A.tracing
    }
    setupOnce(A, Q) {
      let B = PXA([Q, "call", (W) => W(), "access", (W) => W.getClient, "call", (W) => W(), "optionalAccess", (W) => W.getOptions, "call", (W) => W()]),
        G = gt2(this._tracing, B);
      if (!this._breadcrumbs && !G) return;
      if (B && B.instrumenter !== "sentry") {
        sY0.DEBUG_BUILD && nq.logger.log("HTTP Integration is skipped because of instrumenter configuration.");
        return
      }
      let Z = ut2(G, this._tracing, B),
        I = PXA([B, "optionalAccess", (W) => W.tracePropagationTargets]) || PXA([this, "access", (W) => W._tracing, "optionalAccess", (W) => W.tracePropagationTargets]),
        Y = UA("http"),
        J = ht2(Y, this._breadcrumbs, Z, I);
      if (nq.fill(Y, "get", J), nq.fill(Y, "request", J), fE3.NODE_VERSION.major > 8) {
        let W = UA("https"),
          X = ht2(W, this._breadcrumbs, Z, I);
        nq.fill(W, "get", X), nq.fill(W, "request", X)
      }
    }
  }
  WQA.__initStatic();

  function ht2(A, Q, B, G) {
    let Z = new nq.LRUMap(100),
      I = new nq.LRUMap(100),
      Y = (X) => {
        if (B === void 0) return !0;
        let V = Z.get(X);
        if (V !== void 0) return V;
        let F = B(X);
        return Z.set(X, F), F
      },
      J = (X) => {
        if (G === void 0) return !0;
        let V = I.get(X);
        if (V !== void 0) return V;
        let F = nq.stringMatchesSomePattern(X, G);
        return I.set(X, F), F
      };

    function W(X, V, F, K) {
      if (!wC.getCurrentHub().getIntegration(WQA)) return;
      wC.addBreadcrumb({
        category: "http",
        data: {
          status_code: K && K.statusCode,
          ...V
        },
        type: "http"
      }, {
        event: X,
        request: F,
        response: K
      })
    }
    return function(V) {
      return function(...K) {
        let D = mPA.normalizeRequestArgs(A, K),
          H = D[0],
          C = mPA.extractRawUrl(H),
          E = mPA.extractUrl(H),
          U = wC.getClient();
        if (wC.isSentryRequestUrl(E, U)) return V.apply(A, D);
        let q = wC.getCurrentScope(),
          w = wC.getIsolationScope(),
          N = wC.getActiveSpan(),
          R = mE3(E, H),
          T = Y(C) ? PXA([N, "optionalAccess", (y) => y.startChild, "call", (y) => y({
            op: "http.client",
            origin: "auto.http.node.http",
            description: `${R["http.method"]} ${R.url}`,
            data: R
          })]) : void 0;
        if (U && J(C)) {
          let {
            traceId: y,
            spanId: v,
            sampled: x,
            dsc: p
          } = {
            ...w.getPropagationContext(),
            ...q.getPropagationContext()
          }, u = T ? wC.spanToTraceHeader(T) : nq.generateSentryTraceHeader(y, v, x), e = nq.dynamicSamplingContextToSentryBaggageHeader(p || (T ? wC.getDynamicSamplingContextFromSpan(T) : wC.getDynamicSamplingContextFromClient(y, U, q)));
          uE3(H, E, u, e)
        } else sY0.DEBUG_BUILD && nq.logger.log(`[Tracing] Not adding sentry-trace header to outgoing request (${E}) due to mismatching tracePropagationTargets option.`);
        return V.apply(A, D).once("response", function(y) {
          let v = this;
          if (Q) W("response", R, v, y);
          if (T) {
            if (y.statusCode) wC.setHttpStatus(T, y.statusCode);
            T.updateName(mPA.cleanSpanDescription(wC.spanToJSON(T).description || "", H, v) || ""), T.end()
          }
        }).once("error", function() {
          let y = this;
          if (Q) W("error", R, y);
          if (T) wC.setHttpStatus(T, 500), T.updateName(mPA.cleanSpanDescription(wC.spanToJSON(T).description || "", H, y) || ""), T.end()
        })
      }
    }
  }

  function uE3(A, Q, B, G) {
    if ((A.headers || {})["sentry-trace"]) return;
    sY0.DEBUG_BUILD && nq.logger.log(`[Tracing] Adding sentry-trace header ${B} to outgoing request to "${Q}": `), A.headers = {
      ...A.headers,
      "sentry-trace": B,
      ...G && G.length > 0 && {
        baggage: dE3(A, G)
      }
    }
  }

  function mE3(A, Q) {
    let B = Q.method || "GET",
      G = {
        url: A,
        "http.method": B
      };
    if (Q.hash) G["http.fragment"] = Q.hash.substring(1);
    if (Q.search) G["http.query"] = Q.search.substring(1);
    return G
  }

  function dE3(A, Q) {
    if (!A.headers || !A.headers.baggage) return Q;
    else if (!Q) return A.headers.baggage;
    else if (Array.isArray(A.headers.baggage)) return [...A.headers.baggage, Q];
    return [A.headers.baggage, Q]
  }

  function gt2(A, Q) {
    return A === void 0 ? !1 : A.enableIfHasTracingEnabled ? wC.hasTracingEnabled(Q) : !0
  }

  function ut2(A, Q, B) {
    return A ? PXA([Q, "optionalAccess", (Z) => Z.shouldCreateSpanForRequest]) || PXA([B, "optionalAccess", (Z) => Z.shouldCreateSpanForRequest]) : () => !1
  }
  mt2.Http = WQA;
  mt2._getShouldCreateSpanForRequest = ut2;
  mt2._shouldCreateSpans = gt2;
  mt2.httpIntegration = gE3
})
// @from(Start 12773250, End 12774194)
pt2 = z((ct2) => {
  Object.defineProperty(ct2, "__esModule", {
    value: !0
  });

  function nE3(A, Q, B) {
    let G = 0,
      Z = 5,
      I = 0;
    return setInterval(() => {
      if (I === 0) {
        if (G > A) {
          if (Z *= 2, B(Z), Z > 86400) Z = 86400;
          I = Z
        }
      } else if (I -= 1, I === 0) Q();
      G = 0
    }, 1000).unref(), () => {
      G += 1
    }
  }

  function rY0(A) {
    return A !== void 0 && (A.length === 0 || A === "?" || A === "<anonymous>")
  }

  function aE3(A, Q) {
    return A === Q || rY0(A) && rY0(Q)
  }

  function dt2(A) {
    if (A === void 0) return;
    return A.slice(-10).reduce((Q, B) => `${Q},${B.function},${B.lineno},${B.colno}`, "")
  }

  function sE3(A, Q) {
    if (Q === void 0) return;
    return dt2(A(Q, 1))
  }
  ct2.createRateLimiter = nE3;
  ct2.functionNamesMatch = aE3;
  ct2.hashFrames = dt2;
  ct2.hashFromStack = sE3;
  ct2.isAnonymous = rY0
})
// @from(Start 12774200, End 12781532)
st2 = z((at2) => {
  var {
    _optionalChain: iJ
  } = i0();
  Object.defineProperty(at2, "__esModule", {
    value: !0
  });
  var oY0 = _4(),
    AZ1 = i0(),
    Qz3 = IQA(),
    QZ1 = pt2();

  function tY0(A) {
    let Q = [],
      B = !1;

    function G(Y) {
      if (Q = [], B) return;
      B = !0, A(Y)
    }
    Q.push(G);

    function Z(Y) {
      Q.push(Y)
    }

    function I(Y) {
      let J = Q.pop() || G;
      try {
        J(Y)
      } catch (W) {
        G(Y)
      }
    }
    return {
      add: Z,
      next: I
    }
  }
  class lt2 {
    constructor() {
      let {
        Session: A
      } = UA("inspector");
      this._session = new A
    }
    configureAndConnect(A, Q) {
      this._session.connect(), this._session.on("Debugger.paused", (B) => {
        A(B, () => {
          this._session.post("Debugger.resume")
        })
      }), this._session.post("Debugger.enable"), this._session.post("Debugger.setPauseOnExceptions", {
        state: Q ? "all" : "uncaught"
      })
    }
    setPauseOnExceptions(A) {
      this._session.post("Debugger.setPauseOnExceptions", {
        state: A ? "all" : "uncaught"
      })
    }
    getLocalVariables(A, Q) {
      this._getProperties(A, (B) => {
        let {
          add: G,
          next: Z
        } = tY0(Q);
        for (let I of B)
          if (iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.objectId]) && iJ([I, "optionalAccess", (Y) => Y.value, "access", (Y) => Y.className]) === "Array") {
            let Y = I.value.objectId;
            G((J) => this._unrollArray(Y, I.name, J, Z))
          } else if (iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.objectId]) && iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.className]) === "Object") {
          let Y = I.value.objectId;
          G((J) => this._unrollObject(Y, I.name, J, Z))
        } else if (iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.value]) != null || iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.description]) != null) G((Y) => this._unrollOther(I, Y, Z));
        Z({})
      })
    }
    _getProperties(A, Q) {
      this._session.post("Runtime.getProperties", {
        objectId: A,
        ownProperties: !0
      }, (B, G) => {
        if (B) Q([]);
        else Q(G.result)
      })
    }
    _unrollArray(A, Q, B, G) {
      this._getProperties(A, (Z) => {
        B[Q] = Z.filter((I) => I.name !== "length" && !isNaN(parseInt(I.name, 10))).sort((I, Y) => parseInt(I.name, 10) - parseInt(Y.name, 10)).map((I) => iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.value])), G(B)
      })
    }
    _unrollObject(A, Q, B, G) {
      this._getProperties(A, (Z) => {
        B[Q] = Z.map((I) => [I.name, iJ([I, "optionalAccess", (Y) => Y.value, "optionalAccess", (Y) => Y.value])]).reduce((I, [Y, J]) => {
          return I[Y] = J, I
        }, {}), G(B)
      })
    }
    _unrollOther(A, Q, B) {
      if (iJ([A, "optionalAccess", (G) => G.value, "optionalAccess", (G) => G.value]) != null) Q[A.name] = A.value.value;
      else if (iJ([A, "optionalAccess", (G) => G.value, "optionalAccess", (G) => G.description]) != null && iJ([A, "optionalAccess", (G) => G.value, "optionalAccess", (G) => G.type]) !== "function") Q[A.name] = `<${A.value.description}>`;
      B(Q)
    }
  }

  function Bz3() {
    try {
      return new lt2
    } catch (A) {
      return
    }
  }
  var it2 = "LocalVariables",
    Gz3 = (A = {}, Q = Bz3()) => {
      let B = new AZ1.LRUMap(20),
        G, Z = !1;

      function I(W, {
        params: {
          reason: X,
          data: V,
          callFrames: F
        }
      }, K) {
        if (X !== "exception" && X !== "promiseRejection") {
          K();
          return
        }
        iJ([G, "optionalCall", (E) => E()]);
        let D = QZ1.hashFromStack(W, iJ([V, "optionalAccess", (E) => E.description]));
        if (D == null) {
          K();
          return
        }
        let {
          add: H,
          next: C
        } = tY0((E) => {
          B.set(D, E), K()
        });
        for (let E = 0; E < Math.min(F.length, 5); E++) {
          let {
            scopeChain: U,
            functionName: q,
            this: w
          } = F[E], N = U.find((T) => T.type === "local"), R = w.className === "global" || !w.className ? q : `${w.className}.${q}`;
          if (iJ([N, "optionalAccess", (T) => T.object, "access", (T) => T.objectId]) === void 0) H((T) => {
            T[E] = {
              function: R
            }, C(T)
          });
          else {
            let T = N.object.objectId;
            H((y) => iJ([Q, "optionalAccess", (v) => v.getLocalVariables, "call", (v) => v(T, (x) => {
              y[E] = {
                function: R,
                vars: x
              }, C(y)
            })]))
          }
        }
        C([])
      }

      function Y(W) {
        let X = QZ1.hashFrames(iJ([W, "optionalAccess", (K) => K.stacktrace, "optionalAccess", (K) => K.frames]));
        if (X === void 0) return;
        let V = B.remove(X);
        if (V === void 0) return;
        let F = (iJ([W, "access", (K) => K.stacktrace, "optionalAccess", (K) => K.frames]) || []).filter((K) => K.function !== "new Promise");
        for (let K = 0; K < F.length; K++) {
          let D = F.length - K - 1;
          if (!F[D] || !V[K]) break;
          if (V[K].vars === void 0 || F[D].in_app === !1 || !QZ1.functionNamesMatch(F[D].function, V[K].function)) continue;
          F[D].vars = V[K].vars
        }
      }

      function J(W) {
        for (let X of iJ([W, "optionalAccess", (V) => V.exception, "optionalAccess", (V) => V.values]) || []) Y(X);
        return W
      }
      return {
        name: it2,
        setupOnce() {
          let W = oY0.getClient(),
            X = iJ([W, "optionalAccess", (V) => V.getOptions, "call", (V) => V()]);
          if (Q && iJ([X, "optionalAccess", (V) => V.includeLocalVariables])) {
            if (Qz3.NODE_VERSION.major < 18) {
              AZ1.logger.log("The `LocalVariables` integration is only supported on Node >= v18.");
              return
            }
            let F = A.captureAllExceptions !== !1;
            if (Q.configureAndConnect((K, D) => I(X.stackParser, K, D), F), F) {
              let K = A.maxExceptionsPerSecond || 50;
              G = QZ1.createRateLimiter(K, () => {
                AZ1.logger.log("Local variables rate-limit lifted."), iJ([Q, "optionalAccess", (D) => D.setPauseOnExceptions, "call", (D) => D(!0)])
              }, (D) => {
                AZ1.logger.log(`Local variables rate-limit exceeded. Disabling capturing of caught exceptions for ${D} seconds.`), iJ([Q, "optionalAccess", (H) => H.setPauseOnExceptions, "call", (H) => H(!1)])
              })
            }
            Z = !0
          }
        },
        processEvent(W) {
          if (Z) return J(W);
          return W
        },
        _getCachedFramesCount() {
          return B.size
        },
        _getFirstCachedFrame() {
          return B.values()[0]
        }
      }
    },
    nt2 = oY0.defineIntegration(Gz3),
    Zz3 = oY0.convertIntegrationFnToClass(it2, nt2);
  at2.LocalVariablesSync = Zz3;
  at2.createCallbackList = tY0;
  at2.localVariablesSyncIntegration = nt2
})
// @from(Start 12781538, End 12781788)
BZ1 = z((ot2) => {
  Object.defineProperty(ot2, "__esModule", {
    value: !0
  });
  var rt2 = st2(),
    Wz3 = rt2.LocalVariablesSync,
    Xz3 = rt2.localVariablesSyncIntegration;
  ot2.LocalVariables = Wz3;
  ot2.localVariablesIntegration = Xz3
})
// @from(Start 12781794, End 12783103)
GZ1 = z((Ge2) => {
  Object.defineProperty(Ge2, "__esModule", {
    value: !0
  });
  var tt2 = UA("fs"),
    et2 = UA("path"),
    Ae2 = _4(),
    eY0, Qe2 = "Modules";

  function Kz3() {
    try {
      return UA.cache ? Object.keys(UA.cache) : []
    } catch (A) {
      return []
    }
  }

  function Dz3() {
    let A = UA.main && UA.main.paths || [],
      Q = Kz3(),
      B = {},
      G = {};
    return Q.forEach((Z) => {
      let I = Z,
        Y = () => {
          let J = I;
          if (I = et2.dirname(J), !I || J === I || G[J]) return;
          if (A.indexOf(I) < 0) return Y();
          let W = et2.join(J, "package.json");
          if (G[J] = !0, !tt2.existsSync(W)) return Y();
          try {
            let X = JSON.parse(tt2.readFileSync(W, "utf8"));
            B[X.name] = X.version
          } catch (X) {}
        };
      Y()
    }), B
  }

  function Hz3() {
    if (!eY0) eY0 = Dz3();
    return eY0
  }
  var Cz3 = () => {
      return {
        name: Qe2,
        setupOnce() {},
        processEvent(A) {
          return A.modules = {
            ...A.modules,
            ...Hz3()
          }, A
        }
      }
    },
    Be2 = Ae2.defineIntegration(Cz3),
    Ez3 = Ae2.convertIntegrationFnToClass(Qe2, Be2);
  Ge2.Modules = Ez3;
  Ge2.modulesIntegration = Be2
})
// @from(Start 12783109, End 12783921)
QJ0 = z((Ze2) => {
  Object.defineProperty(Ze2, "__esModule", {
    value: !0
  });
  var $z3 = _4(),
    ZZ1 = i0(),
    AJ0 = uPA(),
    wz3 = 2000;

  function qz3(A) {
    ZZ1.consoleSandbox(() => {
      console.error(A)
    });
    let Q = $z3.getClient();
    if (Q === void 0) AJ0.DEBUG_BUILD && ZZ1.logger.warn("No NodeClient was defined, we are exiting the process now."), global.process.exit(1);
    let B = Q.getOptions(),
      G = B && B.shutdownTimeout && B.shutdownTimeout > 0 && B.shutdownTimeout || wz3;
    Q.close(G).then((Z) => {
      if (!Z) AJ0.DEBUG_BUILD && ZZ1.logger.warn("We reached the timeout for emptying the request buffer, still exiting now!");
      global.process.exit(1)
    }, (Z) => {
      AJ0.DEBUG_BUILD && ZZ1.logger.error(Z)
    })
  }
  Ze2.logAndExitProcess = qz3
})
// @from(Start 12783927, End 12785859)
YZ1 = z((Xe2) => {
  Object.defineProperty(Xe2, "__esModule", {
    value: !0
  });
  var IZ1 = _4(),
    Lz3 = i0(),
    Mz3 = uPA(),
    Ie2 = QJ0(),
    Ye2 = "OnUncaughtException",
    Oz3 = (A = {}) => {
      let Q = {
        exitEvenIfOtherHandlersAreRegistered: !0,
        ...A
      };
      return {
        name: Ye2,
        setupOnce() {},
        setup(B) {
          global.process.on("uncaughtException", We2(B, Q))
        }
      }
    },
    Je2 = IZ1.defineIntegration(Oz3),
    Rz3 = IZ1.convertIntegrationFnToClass(Ye2, Je2);

  function We2(A, Q) {
    let G = !1,
      Z = !1,
      I = !1,
      Y, J = A.getOptions();
    return Object.assign((W) => {
      let X = Ie2.logAndExitProcess;
      if (Q.onFatalError) X = Q.onFatalError;
      else if (J.onFatalError) X = J.onFatalError;
      let F = global.process.listeners("uncaughtException").reduce((D, H) => {
          if (H.name === "domainUncaughtExceptionClear" || H.tag && H.tag === "sentry_tracingErrorCallback" || H._errorHandler) return D;
          else return D + 1
        }, 0) === 0,
        K = Q.exitEvenIfOtherHandlersAreRegistered || F;
      if (!G) {
        if (Y = W, G = !0, IZ1.getClient() === A) IZ1.captureException(W, {
          originalException: W,
          captureContext: {
            level: "fatal"
          },
          mechanism: {
            handled: !1,
            type: "onuncaughtexception"
          }
        });
        if (!I && K) I = !0, X(W)
      } else if (K) {
        if (I) Mz3.DEBUG_BUILD && Lz3.logger.warn("uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown"), Ie2.logAndExitProcess(W);
        else if (!Z) Z = !0, setTimeout(() => {
          if (!I) I = !0, X(Y, W)
        }, 2000)
      }
    }, {
      _errorHandler: !0
    })
  }
  Xe2.OnUncaughtException = Rz3;
  Xe2.makeErrorHandler = We2;
  Xe2.onUncaughtExceptionIntegration = Je2
})
// @from(Start 12785865, End 12787364)
WZ1 = z((He2) => {
  Object.defineProperty(He2, "__esModule", {
    value: !0
  });
  var JZ1 = _4(),
    Ve2 = i0(),
    Sz3 = QJ0(),
    Fe2 = "OnUnhandledRejection",
    _z3 = (A = {}) => {
      let Q = A.mode || "warn";
      return {
        name: Fe2,
        setupOnce() {},
        setup(B) {
          global.process.on("unhandledRejection", De2(B, {
            mode: Q
          }))
        }
      }
    },
    Ke2 = JZ1.defineIntegration(_z3),
    kz3 = JZ1.convertIntegrationFnToClass(Fe2, Ke2);

  function De2(A, Q) {
    return function(G, Z) {
      if (JZ1.getClient() !== A) return;
      JZ1.captureException(G, {
        originalException: Z,
        captureContext: {
          extra: {
            unhandledPromiseRejection: !0
          }
        },
        mechanism: {
          handled: !1,
          type: "onunhandledrejection"
        }
      }), yz3(G, Q)
    }
  }

  function yz3(A, Q) {
    let B = "This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason:";
    if (Q.mode === "warn") Ve2.consoleSandbox(() => {
      console.warn(B), console.error(A && A.stack ? A.stack : A)
    });
    else if (Q.mode === "strict") Ve2.consoleSandbox(() => {
      console.warn(B)
    }), Sz3.logAndExitProcess(A)
  }
  He2.OnUnhandledRejection = kz3;
  He2.makeUnhandledPromiseHandler = De2;
  He2.onUnhandledRejectionIntegration = Ke2
})
// @from(Start 12787370, End 12789485)
XZ1 = z(($e2) => {
  Object.defineProperty($e2, "__esModule", {
    value: !0
  });
  var fz3 = UA("http"),
    hz3 = UA("url"),
    Ce2 = _4(),
    jXA = i0(),
    Ee2 = "Spotlight",
    gz3 = (A = {}) => {
      let Q = {
        sidecarUrl: A.sidecarUrl || "http://localhost:8969/stream"
      };
      return {
        name: Ee2,
        setupOnce() {},
        setup(B) {
          if (typeof process === "object" && process.env) jXA.logger.warn("[Spotlight] It seems you're not in dev mode. Do you really want to have Spotlight enabled?");
          mz3(B, Q)
        }
      }
    },
    ze2 = Ce2.defineIntegration(gz3),
    uz3 = Ce2.convertIntegrationFnToClass(Ee2, ze2);

  function mz3(A, Q) {
    let B = dz3(Q.sidecarUrl);
    if (!B) return;
    let G = 0;
    if (typeof A.on !== "function") {
      jXA.logger.warn("[Spotlight] Cannot connect to spotlight due to missing method on SDK client (`client.on`)");
      return
    }
    A.on("beforeEnvelope", (Z) => {
      if (G > 3) {
        jXA.logger.warn("[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests");
        return
      }
      let I = jXA.serializeEnvelope(Z),
        J = Ue2()({
          method: "POST",
          path: B.pathname,
          hostname: B.hostname,
          port: B.port,
          headers: {
            "Content-Type": "application/x-sentry-envelope"
          }
        }, (W) => {
          W.on("data", () => {}), W.on("end", () => {}), W.setEncoding("utf8")
        });
      J.on("error", () => {
        G++, jXA.logger.warn("[Spotlight] Failed to send envelope to Spotlight Sidecar")
      }), J.write(I), J.end()
    })
  }

  function dz3(A) {
    try {
      return new hz3.URL(`${A}`)
    } catch (Q) {
      jXA.logger.warn(`[Spotlight] Invalid sidecar URL: ${A}`);
      return
    }
  }

  function Ue2() {
    let {
      request: A
    } = fz3;
    if (cz3(A)) return A.__sentry_original__;
    return A
  }

  function cz3(A) {
    return "__sentry_original__" in A
  }
  $e2.Spotlight = uz3;
  $e2.getNativeHttpRequest = Ue2;
  $e2.spotlightIntegration = ze2
})
// @from(Start 12789491, End 12795338)
FZ1 = z((we2) => {
  var {
    _optionalChain: VZ1
  } = i0();
  Object.defineProperty(we2, "__esModule", {
    value: !0
  });
  var IV = _4(),
    XQA = i0(),
    nz3 = IQA();
  we2.ChannelName = void 0;
  (function(A) {
    A.RequestCreate = "undici:request:create";
    let B = "undici:request:headers";
    A.RequestEnd = B;
    let G = "undici:request:error";
    A.RequestError = G
  })(we2.ChannelName || (we2.ChannelName = {}));
  var az3 = (A) => {
      return new q$(A)
    },
    sz3 = IV.defineIntegration(az3);
  class q$ {
    static __initStatic() {
      this.id = "Undici"
    }
    __init() {
      this.name = q$.id
    }
    __init2() {
      this._createSpanUrlMap = new XQA.LRUMap(100)
    }
    __init3() {
      this._headersUrlMap = new XQA.LRUMap(100)
    }
    constructor(A = {}) {
      q$.prototype.__init.call(this), q$.prototype.__init2.call(this), q$.prototype.__init3.call(this), q$.prototype.__init4.call(this), q$.prototype.__init5.call(this), q$.prototype.__init6.call(this), this._options = {
        breadcrumbs: A.breadcrumbs === void 0 ? !0 : A.breadcrumbs,
        tracing: A.tracing,
        shouldCreateSpanForRequest: A.shouldCreateSpanForRequest
      }
    }
    setupOnce(A) {
      if (nz3.NODE_VERSION.major < 16) return;
      let Q;
      try {
        Q = UA("diagnostics_channel")
      } catch (B) {}
      if (!Q || !Q.subscribe) return;
      Q.subscribe(we2.ChannelName.RequestCreate, this._onRequestCreate), Q.subscribe(we2.ChannelName.RequestEnd, this._onRequestEnd), Q.subscribe(we2.ChannelName.RequestError, this._onRequestError)
    }
    _shouldCreateSpan(A) {
      if (this._options.tracing === !1 || this._options.tracing === void 0 && !IV.hasTracingEnabled()) return !1;
      if (this._options.shouldCreateSpanForRequest === void 0) return !0;
      let Q = this._createSpanUrlMap.get(A);
      if (Q !== void 0) return Q;
      let B = this._options.shouldCreateSpanForRequest(A);
      return this._createSpanUrlMap.set(A, B), B
    }
    __init4() {
      this._onRequestCreate = (A) => {
        if (!VZ1([IV.getClient, "call", (V) => V(), "optionalAccess", (V) => V.getIntegration, "call", (V) => V(q$)])) return;
        let {
          request: Q
        } = A, B = Q.origin ? Q.origin.toString() + Q.path : Q.path, G = IV.getClient();
        if (!G) return;
        if (IV.isSentryRequestUrl(B, G) || Q.__sentry_span__ !== void 0) return;
        let Z = G.getOptions(),
          I = IV.getCurrentScope(),
          Y = IV.getIsolationScope(),
          J = IV.getActiveSpan(),
          W = this._shouldCreateSpan(B) ? oz3(J, Q, B) : void 0;
        if (W) Q.__sentry_span__ = W;
        if (((V) => {
            if (Z.tracePropagationTargets === void 0) return !0;
            let F = this._headersUrlMap.get(V);
            if (F !== void 0) return F;
            let K = XQA.stringMatchesSomePattern(V, Z.tracePropagationTargets);
            return this._headersUrlMap.set(V, K), K
          })(B)) {
          let {
            traceId: V,
            spanId: F,
            sampled: K,
            dsc: D
          } = {
            ...Y.getPropagationContext(),
            ...I.getPropagationContext()
          }, H = W ? IV.spanToTraceHeader(W) : XQA.generateSentryTraceHeader(V, F, K), C = XQA.dynamicSamplingContextToSentryBaggageHeader(D || (W ? IV.getDynamicSamplingContextFromSpan(W) : IV.getDynamicSamplingContextFromClient(V, G, I)));
          rz3(Q, H, C)
        }
      }
    }
    __init5() {
      this._onRequestEnd = (A) => {
        if (!VZ1([IV.getClient, "call", (I) => I(), "optionalAccess", (I) => I.getIntegration, "call", (I) => I(q$)])) return;
        let {
          request: Q,
          response: B
        } = A, G = Q.origin ? Q.origin.toString() + Q.path : Q.path;
        if (IV.isSentryRequestUrl(G, IV.getClient())) return;
        let Z = Q.__sentry_span__;
        if (Z) IV.setHttpStatus(Z, B.statusCode), Z.end();
        if (this._options.breadcrumbs) IV.addBreadcrumb({
          category: "http",
          data: {
            method: Q.method,
            status_code: B.statusCode,
            url: G
          },
          type: "http"
        }, {
          event: "response",
          request: Q,
          response: B
        })
      }
    }
    __init6() {
      this._onRequestError = (A) => {
        if (!VZ1([IV.getClient, "call", (Z) => Z(), "optionalAccess", (Z) => Z.getIntegration, "call", (Z) => Z(q$)])) return;
        let {
          request: Q
        } = A, B = Q.origin ? Q.origin.toString() + Q.path : Q.path;
        if (IV.isSentryRequestUrl(B, IV.getClient())) return;
        let G = Q.__sentry_span__;
        if (G) G.setStatus("internal_error"), G.end();
        if (this._options.breadcrumbs) IV.addBreadcrumb({
          category: "http",
          data: {
            method: Q.method,
            url: B
          },
          level: "error",
          type: "http"
        }, {
          event: "error",
          request: Q
        })
      }
    }
  }
  q$.__initStatic();

  function rz3(A, Q, B) {
    let G;
    if (Array.isArray(A.headers)) G = A.headers.some((Z) => Z === "sentry-trace");
    else G = A.headers.split(`\r
`).some((I) => I.startsWith("sentry-trace:"));
    if (G) return;
    if (A.addHeader("sentry-trace", Q), B) A.addHeader("baggage", B)
  }

  function oz3(A, Q, B) {
    let G = XQA.parseUrl(B),
      Z = Q.method || "GET",
      I = {
        "http.method": Z
      };
    if (G.search) I["http.query"] = G.search;
    if (G.hash) I["http.fragment"] = G.hash;
    return VZ1([A, "optionalAccess", (Y) => Y.startChild, "call", (Y) => Y({
      op: "http.client",
      origin: "auto.http.node.undici",
      description: `${Z} ${XQA.getSanitizedUrlString(G)}`,
      data: I
    })])
  }
  we2.Undici = q$;
  we2.nativeNodeFetchintegration = sz3
})
// @from(Start 12795344, End 12796290)
BJ0 = z((Le2) => {
  Object.defineProperty(Le2, "__esModule", {
    value: !0
  });
  var qe2 = UA("path"),
    AU3 = i0();

  function Ne2(A) {
    return A.replace(/^[A-Z]:/, "").replace(/\\/g, "/")
  }

  function QU3(A = process.argv[1] ? AU3.dirname(process.argv[1]) : process.cwd(), Q = qe2.sep === "\\") {
    let B = Q ? Ne2(A) : A;
    return (G) => {
      if (!G) return;
      let Z = Q ? Ne2(G) : G,
        {
          dir: I,
          base: Y,
          ext: J
        } = qe2.posix.parse(Z);
      if (J === ".js" || J === ".mjs" || J === ".cjs") Y = Y.slice(0, J.length * -1);
      if (!I) I = ".";
      let W = I.lastIndexOf("/node_modules");
      if (W > -1) return `${I.slice(W+14).replace(/\//g,".")}:${Y}`;
      if (I.startsWith(B)) {
        let X = I.slice(B.length + 1).replace(/\//g, ".");
        if (X) X += ":";
        return X += Y, X
      }
      return Y
    }
  }
  Le2.createGetModuleFromFilename = QU3
})
// @from(Start 12796296, End 12800358)
GJ0 = z((Pe2) => {
  var {
    _optionalChain: GU3
  } = i0();
  Object.defineProperty(Pe2, "__esModule", {
    value: !0
  });
  var kO = _4(),
    VQA = i0(),
    ZU3 = Dt2(),
    IU3 = mY0(),
    YU3 = sG1(),
    JU3 = rG1(),
    WU3 = tG1(),
    XU3 = eG1(),
    VU3 = BZ1(),
    FU3 = GZ1(),
    KU3 = YZ1(),
    DU3 = WZ1(),
    HU3 = XZ1(),
    CU3 = FZ1(),
    EU3 = BJ0(),
    zU3 = pY0(),
    Me2 = [kO.inboundFiltersIntegration(), kO.functionToStringIntegration(), kO.linkedErrorsIntegration(), kO.requestDataIntegration(), YU3.consoleIntegration(), XU3.httpIntegration(), CU3.nativeNodeFetchintegration(), KU3.onUncaughtExceptionIntegration(), DU3.onUnhandledRejectionIntegration(), WU3.contextLinesIntegration(), VU3.localVariablesIntegration(), JU3.nodeContextIntegration(), FU3.modulesIntegration()];

  function Oe2(A) {
    let Q = kO.getMainCarrier(),
      B = GU3([Q, "access", (G) => G.__SENTRY__, "optionalAccess", (G) => G.integrations]) || [];
    return [...Me2, ...B]
  }

  function UU3(A = {}) {
    if (ZU3.setNodeAsyncContextStrategy(), A.defaultIntegrations === void 0) A.defaultIntegrations = Oe2();
    if (A.dsn === void 0 && process.env.SENTRY_DSN) A.dsn = process.env.SENTRY_DSN;
    let Q = process.env.SENTRY_TRACES_SAMPLE_RATE;
    if (A.tracesSampleRate === void 0 && Q) {
      let G = parseFloat(Q);
      if (isFinite(G)) A.tracesSampleRate = G
    }
    if (A.release === void 0) {
      let G = Re2();
      if (G !== void 0) A.release = G;
      else A.autoSessionTracking = !1
    }
    if (A.environment === void 0 && process.env.SENTRY_ENVIRONMENT) A.environment = process.env.SENTRY_ENVIRONMENT;
    if (A.autoSessionTracking === void 0 && A.dsn !== void 0) A.autoSessionTracking = !0;
    if (A.instrumenter === void 0) A.instrumenter = "sentry";
    let B = {
      ...A,
      stackParser: VQA.stackParserFromStackParserOptions(A.stackParser || Te2),
      integrations: kO.getIntegrationsToSetup(A),
      transport: A.transport || zU3.makeNodeTransport
    };
    if (kO.initAndBind(A.clientClass || IU3.NodeClient, B), A.autoSessionTracking) wU3();
    if (qU3(), A.spotlight) {
      let G = kO.getClient();
      if (G && G.addIntegration) {
        let Z = G.getOptions().integrations;
        for (let I of Z) G.addIntegration(I);
        G.addIntegration(HU3.spotlightIntegration({
          sidecarUrl: typeof A.spotlight === "string" ? A.spotlight : void 0
        }))
      }
    }
  }

  function $U3(A) {
    if (A === void 0) return !1;
    let Q = A && A.getOptions();
    if (Q && Q.autoSessionTracking !== void 0) return Q.autoSessionTracking;
    return !1
  }

  function Re2(A) {
    if (process.env.SENTRY_RELEASE) return process.env.SENTRY_RELEASE;
    if (VQA.GLOBAL_OBJ.SENTRY_RELEASE && VQA.GLOBAL_OBJ.SENTRY_RELEASE.id) return VQA.GLOBAL_OBJ.SENTRY_RELEASE.id;
    return process.env.GITHUB_SHA || process.env.COMMIT_REF || process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GITHUB_COMMIT_SHA || process.env.VERCEL_GITLAB_COMMIT_SHA || process.env.VERCEL_BITBUCKET_COMMIT_SHA || process.env.ZEIT_GITHUB_COMMIT_SHA || process.env.ZEIT_GITLAB_COMMIT_SHA || process.env.ZEIT_BITBUCKET_COMMIT_SHA || process.env.CF_PAGES_COMMIT_SHA || A
  }
  var Te2 = VQA.createStackParser(VQA.nodeStackLineParser(EU3.createGetModuleFromFilename()));

  function wU3() {
    kO.startSession(), process.on("beforeExit", () => {
      let A = kO.getIsolationScope().getSession();
      if (A && !["exited", "crashed"].includes(A.status)) kO.endSession()
    })
  }

  function qU3() {
    let A = (process.env.SENTRY_USE_ENVIRONMENT || "").toLowerCase();
    if (!["false", "n", "no", "off", "0"].includes(A)) {
      let Q = process.env.SENTRY_TRACE,
        B = process.env.SENTRY_BAGGAGE,
        G = VQA.propagationContextFromHeaders(Q, B);
      kO.getCurrentScope().setPropagationContext(G)
    }
  }
  Pe2.defaultIntegrations = Me2;
  Pe2.defaultStackParser = Te2;
  Pe2.getDefaultIntegrations = Oe2;
  Pe2.getSentryRelease = Re2;
  Pe2.init = UU3;
  Pe2.isAutoSessionTrackingEnabled = $U3
})
// @from(Start 12800364, End 12801057)
Se2 = z((je2) => {
  Object.defineProperty(je2, "__esModule", {
    value: !0
  });
  var KZ1 = UA("fs"),
    ZJ0 = UA("path");

  function PU3(A) {
    let Q = ZJ0.resolve(A);
    if (!KZ1.existsSync(Q)) throw Error(`Cannot read contents of ${Q}. Directory does not exist.`);
    if (!KZ1.statSync(Q).isDirectory()) throw Error(`Cannot read contents of ${Q}, because it is not a directory.`);
    let B = (G) => {
      return KZ1.readdirSync(G).reduce((Z, I) => {
        let Y = ZJ0.join(G, I);
        if (KZ1.statSync(Y).isDirectory()) return Z.concat(B(Y));
        return Z.push(Y), Z
      }, [])
    };
    return B(Q).map((G) => ZJ0.relative(Q, G))
  }
  je2.deepReadDirSync = PU3
})
// @from(Start 12990237, End 12993845)
HZ1 = z((ve2, be2) => {
  var {
    _optionalChain: kU3,
    _optionalChainDelete: ke2
  } = i0();
  Object.defineProperty(ve2, "__esModule", {
    value: !0
  });
  var yU3 = UA("url"),
    Lg = _4(),
    DZ1 = i0(),
    IJ0 = IQA(),
    xU3 = _e2(),
    vU3 = 50,
    bU3 = 5000;

  function YJ0(A, ...Q) {
    DZ1.logger.log(`[ANR] ${A}`, ...Q)
  }

  function fU3() {
    return DZ1.GLOBAL_OBJ
  }

  function hU3() {
    let A = Lg.getGlobalScope().getScopeData();
    return Lg.mergeScopeData(A, Lg.getIsolationScope().getScopeData()), Lg.mergeScopeData(A, Lg.getCurrentScope().getScopeData()), A.attachments = [], A.eventProcessors = [], A
  }

  function gU3() {
    return DZ1.dynamicRequire(be2, "worker_threads")
  }
  async function uU3(A) {
    let Q = {
        message: "ANR"
      },
      B = {};
    for (let G of A.getEventProcessors()) {
      if (Q === null) break;
      Q = await G(Q, B)
    }
    return kU3([Q, "optionalAccess", (G) => G.contexts]) || {}
  }
  var ye2 = "Anr",
    mU3 = (A = {}) => {
      if (IJ0.NODE_VERSION.major < 16 || IJ0.NODE_VERSION.major === 16 && IJ0.NODE_VERSION.minor < 17) throw Error("ANR detection requires Node 16.17.0 or later");
      let Q, B, G = fU3();
      return G.__SENTRY_GET_SCOPES__ = hU3, {
        name: ye2,
        setupOnce() {},
        startWorker: () => {
          if (Q) return;
          if (B) Q = cU3(B, A)
        },
        stopWorker: () => {
          if (Q) Q.then((Z) => {
            Z(), Q = void 0
          })
        },
        setup(Z) {
          B = Z, setImmediate(() => this.startWorker())
        }
      }
    },
    xe2 = Lg.defineIntegration(mU3),
    dU3 = Lg.convertIntegrationFnToClass(ye2, xe2);
  async function cU3(A, Q) {
    let B = A.getDsn();
    if (!B) return () => {};
    let G = await uU3(A);
    ke2([G, "access", (V) => V.app, "optionalAccess", (V) => delete V.app_memory]), ke2([G, "access", (V) => V.device, "optionalAccess", (V) => delete V.free_memory]);
    let Z = A.getOptions(),
      I = A.getSdkMetadata() || {};
    if (I.sdk) I.sdk.integrations = Z.integrations.map((V) => V.name);
    let Y = {
      debug: DZ1.logger.isEnabled(),
      dsn: B,
      environment: Z.environment || "production",
      release: Z.release,
      dist: Z.dist,
      sdkMetadata: I,
      appRootPath: Q.appRootPath,
      pollInterval: Q.pollInterval || vU3,
      anrThreshold: Q.anrThreshold || bU3,
      captureStackTrace: !!Q.captureStackTrace,
      staticTags: Q.staticTags || {},
      contexts: G
    };
    if (Y.captureStackTrace) {
      let V = UA("inspector");
      if (!V.url()) V.open(0)
    }
    let {
      Worker: J
    } = gU3(), W = new J(new yU3.URL(`data:application/javascript;base64,${xU3.base64WorkerScript}`), {
      workerData: Y
    });
    process.on("exit", () => {
      W.terminate()
    });
    let X = setInterval(() => {
      try {
        let V = Lg.getCurrentScope().getSession(),
          F = V ? {
            ...V,
            toJSON: void 0
          } : void 0;
        W.postMessage({
          session: F
        })
      } catch (V) {}
    }, Y.pollInterval);
    return X.unref(), W.on("message", (V) => {
      if (V === "session-ended") YJ0("ANR event sent from ANR worker. Clearing session in this thread."), Lg.getCurrentScope().setSession(void 0)
    }), W.once("error", (V) => {
      clearInterval(X), YJ0("ANR worker error", V)
    }), W.once("exit", (V) => {
      clearInterval(X), YJ0("ANR worker exit", V)
    }), W.unref(), () => {
      W.terminate(), clearInterval(X)
    }
  }
  ve2.Anr = dU3;
  ve2.anrIntegration = xe2
})
// @from(Start 12993851, End 12994111)
he2 = z((fe2) => {
  Object.defineProperty(fe2, "__esModule", {
    value: !0
  });
  var iU3 = _4(),
    nU3 = HZ1();

  function aU3(A) {
    let Q = iU3.getClient();
    return new nU3.Anr(A).setup(Q), Promise.resolve()
  }
  fe2.enableAnrDetection = aU3
})
// @from(Start 12994117, End 12995779)
JJ0 = z((me2) => {
  var {
    _optionalChain: ge2
  } = i0();
  Object.defineProperty(me2, "__esModule", {
    value: !0
  });
  var _XA = _4(),
    ue2 = i0();

  function rU3(A = {}) {
    return function({
      path: Q,
      type: B,
      next: G,
      rawInput: Z
    }) {
      let I = ge2([_XA.getClient, "call", (X) => X(), "optionalAccess", (X) => X.getOptions, "call", (X) => X()]),
        Y = _XA.getCurrentScope().getTransaction();
      if (Y) {
        Y.updateName(`trpc/${Q}`), Y.setAttribute(_XA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, "route"), Y.op = "rpc.server";
        let X = {
          procedure_type: B
        };
        if (A.attachRpcInput !== void 0 ? A.attachRpcInput : ge2([I, "optionalAccess", (V) => V.sendDefaultPii])) X.input = ue2.normalize(Z);
        Y.setContext("trpc", X)
      }

      function J(X) {
        if (!X.ok) _XA.captureException(X.error, {
          mechanism: {
            handled: !1,
            data: {
              function: "trpcMiddleware"
            }
          }
        })
      }
      let W;
      try {
        W = G()
      } catch (X) {
        throw _XA.captureException(X, {
          mechanism: {
            handled: !1,
            data: {
              function: "trpcMiddleware"
            }
          }
        }), X
      }
      if (ue2.isThenable(W)) Promise.resolve(W).then((X) => {
        J(X)
      }, (X) => {
        _XA.captureException(X, {
          mechanism: {
            handled: !1,
            data: {
              function: "trpcMiddleware"
            }
          }
        })
      });
      else J(W);
      return W
    }
  }
  me2.trpcMiddleware = rU3
})
// @from(Start 12995785, End 12996142)
pe2 = z((ce2) => {
  Object.defineProperty(ce2, "__esModule", {
    value: !0
  });
  var de2 = i0();

  function tU3(A, Q) {
    return de2.extractRequestData(A, {
      include: Q
    })
  }

  function eU3(A, Q, B = {}) {
    return de2.addRequestDataToEvent(A, Q, {
      include: B
    })
  }
  ce2.extractRequestData = tU3;
  ce2.parseRequest = eU3
})
// @from(Start 12996148, End 13000701)
ne2 = z((ie2) => {
  var {
    _optionalChain: CZ1
  } = i0();
  Object.defineProperty(ie2, "__esModule", {
    value: !0
  });
  var UK = _4(),
    kXA = i0(),
    B$3 = uPA(),
    EZ1 = GJ0(),
    G$3 = JJ0(),
    le2 = pe2();

  function Z$3() {
    return function(Q, B, G) {
      let Z = CZ1([UK.getClient, "call", (V) => V(), "optionalAccess", (V) => V.getOptions, "call", (V) => V()]);
      if (!Z || Z.instrumenter !== "sentry" || CZ1([Q, "access", (V) => V.method, "optionalAccess", (V) => V.toUpperCase, "call", (V) => V()]) === "OPTIONS" || CZ1([Q, "access", (V) => V.method, "optionalAccess", (V) => V.toUpperCase, "call", (V) => V()]) === "HEAD") return G();
      let I = Q.headers && kXA.isString(Q.headers["sentry-trace"]) ? Q.headers["sentry-trace"] : void 0,
        Y = CZ1([Q, "access", (V) => V.headers, "optionalAccess", (V) => V.baggage]);
      if (!UK.hasTracingEnabled(Z)) return G();
      let [J, W] = kXA.extractPathForTransaction(Q, {
        path: !0,
        method: !0
      }), X = UK.continueTrace({
        sentryTrace: I,
        baggage: Y
      }, (V) => UK.startTransaction({
        name: J,
        op: "http.server",
        origin: "auto.http.node.tracingHandler",
        ...V,
        data: {
          [UK.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: W
        },
        metadata: {
          ...V.metadata,
          request: Q
        }
      }, {
        request: kXA.extractRequestData(Q)
      }));
      UK.getCurrentScope().setSpan(X), B.__sentry_transaction = X, B.once("finish", () => {
        setImmediate(() => {
          kXA.addRequestDataToTransaction(X, Q), UK.setHttpStatus(X, B.statusCode), X.end()
        })
      }), G()
    }
  }

  function I$3(A = {}) {
    let Q;
    if ("include" in A) Q = {
      include: A.include
    };
    else {
      let {
        ip: B,
        request: G,
        transaction: Z,
        user: I
      } = A;
      if (B || G || Z || I) Q = {
        include: kXA.dropUndefinedKeys({
          ip: B,
          request: G,
          transaction: Z,
          user: I
        })
      }
    }
    return Q
  }

  function Y$3(A) {
    let Q = I$3(A),
      B = UK.getClient();
    if (B && EZ1.isAutoSessionTrackingEnabled(B)) {
      B.initSessionFlusher();
      let G = UK.getCurrentScope();
      if (G.getSession()) G.setSession()
    }
    return function(Z, I, Y) {
      if (A && A.flushTimeout && A.flushTimeout > 0) {
        let J = I.end;
        I.end = function(W, X, V) {
          UK.flush(A.flushTimeout).then(() => {
            J.call(this, W, X, V)
          }).then(null, (F) => {
            B$3.DEBUG_BUILD && kXA.logger.error(F), J.call(this, W, X, V)
          })
        }
      }
      UK.runWithAsyncContext(() => {
        let J = UK.getCurrentScope();
        J.setSDKProcessingMetadata({
          request: Z,
          requestDataOptionsFromExpressHandler: Q
        });
        let W = UK.getClient();
        if (EZ1.isAutoSessionTrackingEnabled(W)) J.setRequestSession({
          status: "ok"
        });
        I.once("finish", () => {
          let X = UK.getClient();
          if (EZ1.isAutoSessionTrackingEnabled(X)) setImmediate(() => {
            if (X && X._captureRequestSession) X._captureRequestSession()
          })
        }), Y()
      })
    }
  }

  function J$3(A) {
    let Q = A.status || A.statusCode || A.status_code || A.output && A.output.statusCode;
    return Q ? parseInt(Q, 10) : 500
  }

  function W$3(A) {
    return J$3(A) >= 500
  }

  function X$3(A) {
    return function(B, G, Z, I) {
      if ((A && A.shouldHandleError || W$3)(B)) {
        UK.withScope((J) => {
          J.setSDKProcessingMetadata({
            request: G
          });
          let W = Z.__sentry_transaction;
          if (W && !UK.getActiveSpan()) J.setSpan(W);
          let X = UK.getClient();
          if (X && EZ1.isAutoSessionTrackingEnabled(X)) {
            if (X._sessionFlusher !== void 0) {
              let K = J.getRequestSession();
              if (K && K.status !== void 0) K.status = "crashed"
            }
          }
          let V = UK.captureException(B, {
            mechanism: {
              type: "middleware",
              handled: !1
            }
          });
          Z.sentry = V, I(B)
        });
        return
      }
      I(B)
    }
  }
  var V$3 = G$3.trpcMiddleware;
  ie2.extractRequestData = le2.extractRequestData;
  ie2.parseRequest = le2.parseRequest;
  ie2.errorHandler = X$3;
  ie2.requestHandler = Y$3;
  ie2.tracingHandler = Z$3;
  ie2.trpcMiddleware = V$3
})
// @from(Start 13000707, End 13003374)
WJ0 = z((AA9) => {
  Object.defineProperty(AA9, "__esModule", {
    value: !0
  });
  var N$ = _4(),
    se2 = i0();

  function ae2(A) {
    return A && A.statusCode !== void 0
  }

  function z$3(A) {
    return A && A.error !== void 0
  }

  function U$3(A) {
    N$.captureException(A, {
      mechanism: {
        type: "hapi",
        handled: !1,
        data: {
          function: "hapiErrorPlugin"
        }
      }
    })
  }
  var re2 = {
      name: "SentryHapiErrorPlugin",
      version: N$.SDK_VERSION,
      register: async function(A) {
        A.events.on("request", (B, G) => {
          let Z = N$.getActiveTransaction();
          if (z$3(G)) U$3(G.error);
          if (Z) Z.setStatus("internal_error"), Z.end()
        })
      }
    },
    oe2 = {
      name: "SentryHapiTracingPlugin",
      version: N$.SDK_VERSION,
      register: async function(A) {
        let Q = A;
        Q.ext("onPreHandler", (B, G) => {
          let Z = N$.continueTrace({
            sentryTrace: B.headers["sentry-trace"] || void 0,
            baggage: B.headers.baggage || void 0
          }, (I) => {
            return N$.startTransaction({
              ...I,
              op: "hapi.request",
              name: B.route.path,
              description: `${B.route.method} ${B.path}`
            })
          });
          return N$.getCurrentScope().setSpan(Z), G.continue
        }), Q.ext("onPreResponse", (B, G) => {
          let Z = N$.getActiveTransaction();
          if (B.response && ae2(B.response) && Z) {
            let I = B.response;
            I.header("sentry-trace", N$.spanToTraceHeader(Z));
            let Y = se2.dynamicSamplingContextToSentryBaggageHeader(N$.getDynamicSamplingContextFromSpan(Z));
            if (Y) I.header("baggage", Y)
          }
          return G.continue
        }), Q.ext("onPostHandler", (B, G) => {
          let Z = N$.getActiveTransaction();
          if (Z) {
            if (B.response && ae2(B.response)) N$.setHttpStatus(Z, B.response.statusCode);
            Z.end()
          }
          return G.continue
        })
      }
    },
    te2 = "Hapi",
    $$3 = (A = {}) => {
      let Q = A.server;
      return {
        name: te2,
        setupOnce() {
          if (!Q) return;
          se2.fill(Q, "start", (B) => {
            return async function() {
              return await this.register(oe2), await this.register(re2), B.apply(this)
            }
          })
        }
      }
    },
    ee2 = N$.defineIntegration($$3),
    w$3 = N$.convertIntegrationFnToClass(te2, ee2);
  AA9.Hapi = w$3;
  AA9.hapiErrorPlugin = re2;
  AA9.hapiIntegration = ee2;
  AA9.hapiTracingPlugin = oe2
})
// @from(Start 13003380, End 13004128)
BA9 = z((QA9) => {
  Object.defineProperty(QA9, "__esModule", {
    value: !0
  });
  var O$3 = sG1(),
    R$3 = eG1(),
    T$3 = YZ1(),
    P$3 = WZ1(),
    j$3 = GZ1(),
    S$3 = tG1(),
    _$3 = rG1(),
    k$3 = _4(),
    y$3 = BZ1(),
    x$3 = FZ1(),
    v$3 = XZ1(),
    b$3 = HZ1(),
    f$3 = WJ0();
  QA9.Console = O$3.Console;
  QA9.Http = R$3.Http;
  QA9.OnUncaughtException = T$3.OnUncaughtException;
  QA9.OnUnhandledRejection = P$3.OnUnhandledRejection;
  QA9.Modules = j$3.Modules;
  QA9.ContextLines = S$3.ContextLines;
  QA9.Context = _$3.Context;
  QA9.RequestData = k$3.RequestData;
  QA9.LocalVariables = y$3.LocalVariables;
  QA9.Undici = x$3.Undici;
  QA9.Spotlight = v$3.Spotlight;
  QA9.Anr = b$3.Anr;
  QA9.Hapi = f$3.Hapi
})
// @from(Start 13004134, End 13004431)
ZA9 = z((GA9) => {
  Object.defineProperty(GA9, "__esModule", {
    value: !0
  });
  var FQA = uY0();
  GA9.Apollo = FQA.Apollo;
  GA9.Express = FQA.Express;
  GA9.GraphQL = FQA.GraphQL;
  GA9.Mongo = FQA.Mongo;
  GA9.Mysql = FQA.Mysql;
  GA9.Postgres = FQA.Postgres;
  GA9.Prisma = FQA.Prisma
})
// @from(Start 13004437, End 13005961)
WA9 = z((JA9) => {
  Object.defineProperty(JA9, "__esModule", {
    value: !0
  });
  var KQA = _4(),
    DQA = i0(),
    IA9 = "CaptureConsole",
    Zw3 = (A = {}) => {
      let Q = A.levels || DQA.CONSOLE_LEVELS;
      return {
        name: IA9,
        setupOnce() {},
        setup(B) {
          if (!("console" in DQA.GLOBAL_OBJ)) return;
          DQA.addConsoleInstrumentationHandler(({
            args: G,
            level: Z
          }) => {
            if (KQA.getClient() !== B || !Q.includes(Z)) return;
            Yw3(G, Z)
          })
        }
      }
    },
    YA9 = KQA.defineIntegration(Zw3),
    Iw3 = KQA.convertIntegrationFnToClass(IA9, YA9);

  function Yw3(A, Q) {
    let B = {
      level: DQA.severityLevelFromString(Q),
      extra: {
        arguments: A
      }
    };
    KQA.withScope((G) => {
      if (G.addEventProcessor((Y) => {
          return Y.logger = "console", DQA.addExceptionMechanism(Y, {
            handled: !1,
            type: "console"
          }), Y
        }), Q === "assert" && A[0] === !1) {
        let Y = `Assertion failed: ${DQA.safeJoin(A.slice(1)," ")||"console.assert"}`;
        G.setExtra("arguments", A.slice(1)), KQA.captureMessage(Y, B);
        return
      }
      let Z = A.find((Y) => Y instanceof Error);
      if (Q === "error" && Z) {
        KQA.captureException(Z, B);
        return
      }
      let I = DQA.safeJoin(A, " ");
      KQA.captureMessage(I, B)
    })
  }
  JA9.CaptureConsole = Iw3;
  JA9.captureConsoleIntegration = YA9
})
// @from(Start 13005967, End 13006880)
DA9 = z((KA9) => {
  Object.defineProperty(KA9, "__esModule", {
    value: !0
  });
  var XA9 = _4(),
    Xw3 = i0(),
    VA9 = "Debug",
    Vw3 = (A = {}) => {
      let Q = {
        debugger: !1,
        stringify: !1,
        ...A
      };
      return {
        name: VA9,
        setupOnce() {},
        setup(B) {
          if (!B.on) return;
          B.on("beforeSendEvent", (G, Z) => {
            if (Q.debugger) debugger;
            Xw3.consoleSandbox(() => {
              if (Q.stringify) {
                if (console.log(JSON.stringify(G, null, 2)), Z && Object.keys(Z).length) console.log(JSON.stringify(Z, null, 2))
              } else if (console.log(G), Z && Object.keys(Z).length) console.log(Z)
            })
          })
        }
      }
    },
    FA9 = XA9.defineIntegration(Vw3),
    Fw3 = XA9.convertIntegrationFnToClass(VA9, FA9);
  KA9.Debug = Fw3;
  KA9.debugIntegration = FA9
})
// @from(Start 13006886, End 13007059)
dPA = z((HA9) => {
  Object.defineProperty(HA9, "__esModule", {
    value: !0
  });
  var Hw3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  HA9.DEBUG_BUILD = Hw3
})
// @from(Start 13007065, End 13009298)
MA9 = z((LA9) => {
  Object.defineProperty(LA9, "__esModule", {
    value: !0
  });
  var zA9 = _4(),
    Ew3 = i0(),
    zw3 = dPA(),
    UA9 = "Dedupe",
    Uw3 = () => {
      let A;
      return {
        name: UA9,
        setupOnce() {},
        processEvent(Q) {
          if (Q.type) return Q;
          try {
            if (wA9(Q, A)) return zw3.DEBUG_BUILD && Ew3.logger.warn("Event dropped due to being a duplicate of previously captured event."), null
          } catch (B) {}
          return A = Q
        }
      }
    },
    $A9 = zA9.defineIntegration(Uw3),
    $w3 = zA9.convertIntegrationFnToClass(UA9, $A9);

  function wA9(A, Q) {
    if (!Q) return !1;
    if (ww3(A, Q)) return !0;
    if (qw3(A, Q)) return !0;
    return !1
  }

  function ww3(A, Q) {
    let B = A.message,
      G = Q.message;
    if (!B && !G) return !1;
    if (B && !G || !B && G) return !1;
    if (B !== G) return !1;
    if (!NA9(A, Q)) return !1;
    if (!qA9(A, Q)) return !1;
    return !0
  }

  function qw3(A, Q) {
    let B = CA9(Q),
      G = CA9(A);
    if (!B || !G) return !1;
    if (B.type !== G.type || B.value !== G.value) return !1;
    if (!NA9(A, Q)) return !1;
    if (!qA9(A, Q)) return !1;
    return !0
  }

  function qA9(A, Q) {
    let B = EA9(A),
      G = EA9(Q);
    if (!B && !G) return !0;
    if (B && !G || !B && G) return !1;
    if (B = B, G = G, G.length !== B.length) return !1;
    for (let Z = 0; Z < G.length; Z++) {
      let I = G[Z],
        Y = B[Z];
      if (I.filename !== Y.filename || I.lineno !== Y.lineno || I.colno !== Y.colno || I.function !== Y.function) return !1
    }
    return !0
  }

  function NA9(A, Q) {
    let B = A.fingerprint,
      G = Q.fingerprint;
    if (!B && !G) return !0;
    if (B && !G || !B && G) return !1;
    B = B, G = G;
    try {
      return B.join("") === G.join("")
    } catch (Z) {
      return !1
    }
  }

  function CA9(A) {
    return A.exception && A.exception.values && A.exception.values[0]
  }

  function EA9(A) {
    let Q = A.exception;
    if (Q) try {
      return Q.values[0].stacktrace.frames
    } catch (B) {
      return
    }
    return
  }
  LA9.Dedupe = $w3;
  LA9._shouldDropEvent = wA9;
  LA9.dedupeIntegration = $A9
})
// @from(Start 13009304, End 13011157)
jA9 = z((PA9) => {
  Object.defineProperty(PA9, "__esModule", {
    value: !0
  });
  var OA9 = _4(),
    Ga = i0(),
    Ow3 = dPA(),
    RA9 = "ExtraErrorData",
    Rw3 = (A = {}) => {
      let Q = A.depth || 3,
        B = A.captureErrorCause || !1;
      return {
        name: RA9,
        setupOnce() {},
        processEvent(G, Z) {
          return Pw3(G, Z, Q, B)
        }
      }
    },
    TA9 = OA9.defineIntegration(Rw3),
    Tw3 = OA9.convertIntegrationFnToClass(RA9, TA9);

  function Pw3(A, Q = {}, B, G) {
    if (!Q.originalException || !Ga.isError(Q.originalException)) return A;
    let Z = Q.originalException.name || Q.originalException.constructor.name,
      I = jw3(Q.originalException, G);
    if (I) {
      let Y = {
          ...A.contexts
        },
        J = Ga.normalize(I, B);
      if (Ga.isPlainObject(J)) Ga.addNonEnumerableProperty(J, "__sentry_skip_normalization__", !0), Y[Z] = J;
      return {
        ...A,
        contexts: Y
      }
    }
    return A
  }

  function jw3(A, Q) {
    try {
      let B = ["name", "message", "stack", "line", "column", "fileName", "lineNumber", "columnNumber", "toJSON"],
        G = {};
      for (let Z of Object.keys(A)) {
        if (B.indexOf(Z) !== -1) continue;
        let I = A[Z];
        G[Z] = Ga.isError(I) ? I.toString() : I
      }
      if (Q && A.cause !== void 0) G.cause = Ga.isError(A.cause) ? A.cause.toString() : A.cause;
      if (typeof A.toJSON === "function") {
        let Z = A.toJSON();
        for (let I of Object.keys(Z)) {
          let Y = Z[I];
          G[I] = Ga.isError(Y) ? Y.toString() : Y
        }
      }
      return G
    } catch (B) {
      Ow3.DEBUG_BUILD && Ga.logger.error("Unable to extract extra data from the Error object:", B)
    }
    return null
  }
  PA9.ExtraErrorData = Tw3;
  PA9.extraErrorDataIntegration = TA9
})
// @from(Start 13011163, End 13068987)
_A9 = z((SA9, XJ0) => {
  /*!
      localForage -- Offline Storage, Improved
      Version 1.10.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  */
  (function(A) {
    if (typeof SA9 === "object" && typeof XJ0 < "u") XJ0.exports = A();
    else if (typeof define === "function" && define.amd) define([], A);
    else {
      var Q;
      if (typeof window < "u") Q = window;
      else if (typeof global < "u") Q = global;
      else if (typeof self < "u") Q = self;
      else Q = this;
      Q.localforage = A()
    }
  })(function() {
    var A, Q, B;
    return function G(Z, I, Y) {
      function J(V, F) {
        if (!I[V]) {
          if (!Z[V]) {
            var K = UA;
            if (!F && K) return K(V, !0);
            if (W) return W(V, !0);
            var D = Error("Cannot find module '" + V + "'");
            throw D.code = "MODULE_NOT_FOUND", D
          }
          var H = I[V] = {
            exports: {}
          };
          Z[V][0].call(H.exports, function(C) {
            var E = Z[V][1][C];
            return J(E ? E : C)
          }, H, H.exports, G, Z, I, Y)
        }
        return I[V].exports
      }
      var W = UA;
      for (var X = 0; X < Y.length; X++) J(Y[X]);
      return J
    }({
      1: [function(G, Z, I) {
        (function(Y) {
          var J = Y.MutationObserver || Y.WebKitMutationObserver,
            W;
          if (J) {
            var X = 0,
              V = new J(C),
              F = Y.document.createTextNode("");
            V.observe(F, {
              characterData: !0
            }), W = function() {
              F.data = X = ++X % 2
            }
          } else if (!Y.setImmediate && typeof Y.MessageChannel < "u") {
            var K = new Y.MessageChannel;
            K.port1.onmessage = C, W = function() {
              K.port2.postMessage(0)
            }
          } else if ("document" in Y && "onreadystatechange" in Y.document.createElement("script")) W = function() {
            var U = Y.document.createElement("script");
            U.onreadystatechange = function() {
              C(), U.onreadystatechange = null, U.parentNode.removeChild(U), U = null
            }, Y.document.documentElement.appendChild(U)
          };
          else W = function() {
            setTimeout(C, 0)
          };
          var D, H = [];

          function C() {
            D = !0;
            var U, q, w = H.length;
            while (w) {
              q = H, H = [], U = -1;
              while (++U < w) q[U]();
              w = H.length
            }
            D = !1
          }
          Z.exports = E;

          function E(U) {
            if (H.push(U) === 1 && !D) W()
          }
        }).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {})
      }, {}],
      2: [function(G, Z, I) {
        var Y = G(1);

        function J() {}
        var W = {},
          X = ["REJECTED"],
          V = ["FULFILLED"],
          F = ["PENDING"];
        Z.exports = K;

        function K(T) {
          if (typeof T !== "function") throw TypeError("resolver must be a function");
          if (this.state = F, this.queue = [], this.outcome = void 0, T !== J) E(this, T)
        }
        K.prototype.catch = function(T) {
          return this.then(null, T)
        }, K.prototype.then = function(T, y) {
          if (typeof T !== "function" && this.state === V || typeof y !== "function" && this.state === X) return this;
          var v = new this.constructor(J);
          if (this.state !== F) {
            var x = this.state === V ? T : y;
            H(v, x, this.outcome)
          } else this.queue.push(new D(v, T, y));
          return v
        };

        function D(T, y, v) {
          if (this.promise = T, typeof y === "function") this.onFulfilled = y, this.callFulfilled = this.otherCallFulfilled;
          if (typeof v === "function") this.onRejected = v, this.callRejected = this.otherCallRejected
        }
        D.prototype.callFulfilled = function(T) {
          W.resolve(this.promise, T)
        }, D.prototype.otherCallFulfilled = function(T) {
          H(this.promise, this.onFulfilled, T)
        }, D.prototype.callRejected = function(T) {
          W.reject(this.promise, T)
        }, D.prototype.otherCallRejected = function(T) {
          H(this.promise, this.onRejected, T)
        };

        function H(T, y, v) {
          Y(function() {
            var x;
            try {
              x = y(v)
            } catch (p) {
              return W.reject(T, p)
            }
            if (x === T) W.reject(T, TypeError("Cannot resolve promise with itself"));
            else W.resolve(T, x)
          })
        }
        W.resolve = function(T, y) {
          var v = U(C, y);
          if (v.status === "error") return W.reject(T, v.value);
          var x = v.value;
          if (x) E(T, x);
          else {
            T.state = V, T.outcome = y;
            var p = -1,
              u = T.queue.length;
            while (++p < u) T.queue[p].callFulfilled(y)
          }
          return T
        }, W.reject = function(T, y) {
          T.state = X, T.outcome = y;
          var v = -1,
            x = T.queue.length;
          while (++v < x) T.queue[v].callRejected(y);
          return T
        };

        function C(T) {
          var y = T && T.then;
          if (T && (typeof T === "object" || typeof T === "function") && typeof y === "function") return function() {
            y.apply(T, arguments)
          }
        }

        function E(T, y) {
          var v = !1;

          function x(l) {
            if (v) return;
            v = !0, W.reject(T, l)
          }

          function p(l) {
            if (v) return;
            v = !0, W.resolve(T, l)
          }

          function u() {
            y(p, x)
          }
          var e = U(u);
          if (e.status === "error") x(e.value)
        }

        function U(T, y) {
          var v = {};
          try {
            v.value = T(y), v.status = "success"
          } catch (x) {
            v.status = "error", v.value = x
          }
          return v
        }
        K.resolve = q;

        function q(T) {
          if (T instanceof this) return T;
          return W.resolve(new this(J), T)
        }
        K.reject = w;

        function w(T) {
          var y = new this(J);
          return W.reject(y, T)
        }
        K.all = N;

        function N(T) {
          var y = this;
          if (Object.prototype.toString.call(T) !== "[object Array]") return this.reject(TypeError("must be an array"));
          var v = T.length,
            x = !1;
          if (!v) return this.resolve([]);
          var p = Array(v),
            u = 0,
            e = -1,
            l = new this(J);
          while (++e < v) k(T[e], e);
          return l;

          function k(m, o) {
            y.resolve(m).then(IA, function(FA) {
              if (!x) x = !0, W.reject(l, FA)
            });

            function IA(FA) {
              if (p[o] = FA, ++u === v && !x) x = !0, W.resolve(l, p)
            }
          }
        }
        K.race = R;

        function R(T) {
          var y = this;
          if (Object.prototype.toString.call(T) !== "[object Array]") return this.reject(TypeError("must be an array"));
          var v = T.length,
            x = !1;
          if (!v) return this.resolve([]);
          var p = -1,
            u = new this(J);
          while (++p < v) e(T[p]);
          return u;

          function e(l) {
            y.resolve(l).then(function(k) {
              if (!x) x = !0, W.resolve(u, k)
            }, function(k) {
              if (!x) x = !0, W.reject(u, k)
            })
          }
        }
      }, {
        "1": 1
      }],
      3: [function(G, Z, I) {
        (function(Y) {
          if (typeof Y.Promise !== "function") Y.Promise = G(2)
        }).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {})
      }, {
        "2": 2
      }],
      4: [function(G, Z, I) {
        var Y = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(cA) {
          return typeof cA
        } : function(cA) {
          return cA && typeof Symbol === "function" && cA.constructor === Symbol && cA !== Symbol.prototype ? "symbol" : typeof cA
        };

        function J(cA, YA) {
          if (!(cA instanceof YA)) throw TypeError("Cannot call a class as a function")
        }

        function W() {
          try {
            if (typeof indexedDB < "u") return indexedDB;
            if (typeof webkitIndexedDB < "u") return webkitIndexedDB;
            if (typeof mozIndexedDB < "u") return mozIndexedDB;
            if (typeof OIndexedDB < "u") return OIndexedDB;
            if (typeof msIndexedDB < "u") return msIndexedDB
          } catch (cA) {
            return
          }
        }
        var X = W();

        function V() {
          try {
            if (!X || !X.open) return !1;
            var cA = typeof openDatabase < "u" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform),
              YA = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
            return (!cA || YA) && typeof indexedDB < "u" && typeof IDBKeyRange < "u"
          } catch (ZA) {
            return !1
          }
        }

        function F(cA, YA) {
          cA = cA || [], YA = YA || {};
          try {
            return new Blob(cA, YA)
          } catch (dA) {
            if (dA.name !== "TypeError") throw dA;
            var ZA = typeof BlobBuilder < "u" ? BlobBuilder : typeof MSBlobBuilder < "u" ? MSBlobBuilder : typeof MozBlobBuilder < "u" ? MozBlobBuilder : WebKitBlobBuilder,
              SA = new ZA;
            for (var xA = 0; xA < cA.length; xA += 1) SA.append(cA[xA]);
            return SA.getBlob(YA.type)
          }
        }
        if (typeof Promise > "u") G(3);
        var K = Promise;

        function D(cA, YA) {
          if (YA) cA.then(function(ZA) {
            YA(null, ZA)
          }, function(ZA) {
            YA(ZA)
          })
        }

        function H(cA, YA, ZA) {
          if (typeof YA === "function") cA.then(YA);
          if (typeof ZA === "function") cA.catch(ZA)
        }

        function C(cA) {
          if (typeof cA !== "string") console.warn(cA + " used as a key, but it is not a string."), cA = String(cA);
          return cA
        }

        function E() {
          if (arguments.length && typeof arguments[arguments.length - 1] === "function") return arguments[arguments.length - 1]
        }
        var U = "local-forage-detect-blob-support",
          q = void 0,
          w = {},
          N = Object.prototype.toString,
          R = "readonly",
          T = "readwrite";

        function y(cA) {
          var YA = cA.length,
            ZA = new ArrayBuffer(YA),
            SA = new Uint8Array(ZA);
          for (var xA = 0; xA < YA; xA++) SA[xA] = cA.charCodeAt(xA);
          return ZA
        }

        function v(cA) {
          return new K(function(YA) {
            var ZA = cA.transaction(U, T),
              SA = F([""]);
            ZA.objectStore(U).put(SA, "key"), ZA.onabort = function(xA) {
              xA.preventDefault(), xA.stopPropagation(), YA(!1)
            }, ZA.oncomplete = function() {
              var xA = navigator.userAgent.match(/Chrome\/(\d+)/),
                dA = navigator.userAgent.match(/Edge\//);
              YA(dA || !xA || parseInt(xA[1], 10) >= 43)
            }
          }).catch(function() {
            return !1
          })
        }

        function x(cA) {
          if (typeof q === "boolean") return K.resolve(q);
          return v(cA).then(function(YA) {
            return q = YA, q
          })
        }

        function p(cA) {
          var YA = w[cA.name],
            ZA = {};
          if (ZA.promise = new K(function(SA, xA) {
              ZA.resolve = SA, ZA.reject = xA
            }), YA.deferredOperations.push(ZA), !YA.dbReady) YA.dbReady = ZA.promise;
          else YA.dbReady = YA.dbReady.then(function() {
            return ZA.promise
          })
        }

        function u(cA) {
          var YA = w[cA.name],
            ZA = YA.deferredOperations.pop();
          if (ZA) return ZA.resolve(), ZA.promise
        }

        function e(cA, YA) {
          var ZA = w[cA.name],
            SA = ZA.deferredOperations.pop();
          if (SA) return SA.reject(YA), SA.promise
        }

        function l(cA, YA) {
          return new K(function(ZA, SA) {
            if (w[cA.name] = w[cA.name] || wA(), cA.db)
              if (YA) p(cA), cA.db.close();
              else return ZA(cA.db);
            var xA = [cA.name];
            if (YA) xA.push(cA.version);
            var dA = X.open.apply(X, xA);
            if (YA) dA.onupgradeneeded = function(C1) {
              var j1 = dA.result;
              try {
                if (j1.createObjectStore(cA.storeName), C1.oldVersion <= 1) j1.createObjectStore(U)
              } catch (T1) {
                if (T1.name === "ConstraintError") console.warn('The database "' + cA.name + '" has been upgraded from version ' + C1.oldVersion + " to version " + C1.newVersion + ', but the storage "' + cA.storeName + '" already exists.');
                else throw T1
              }
            };
            dA.onerror = function(C1) {
              C1.preventDefault(), SA(dA.error)
            }, dA.onsuccess = function() {
              var C1 = dA.result;
              C1.onversionchange = function(j1) {
                j1.target.close()
              }, ZA(C1), u(cA)
            }
          })
        }

        function k(cA) {
          return l(cA, !1)
        }

        function m(cA) {
          return l(cA, !0)
        }

        function o(cA, YA) {
          if (!cA.db) return !0;
          var ZA = !cA.db.objectStoreNames.contains(cA.storeName),
            SA = cA.version < cA.db.version,
            xA = cA.version > cA.db.version;
          if (SA) {
            if (cA.version !== YA) console.warn('The database "' + cA.name + `" can't be downgraded from version ` + cA.db.version + " to version " + cA.version + ".");
            cA.version = cA.db.version
          }
          if (xA || ZA) {
            if (ZA) {
              var dA = cA.db.version + 1;
              if (dA > cA.version) cA.version = dA
            }
            return !0
          }
          return !1
        }

        function IA(cA) {
          return new K(function(YA, ZA) {
            var SA = new FileReader;
            SA.onerror = ZA, SA.onloadend = function(xA) {
              var dA = btoa(xA.target.result || "");
              YA({
                __local_forage_encoded_blob: !0,
                data: dA,
                type: cA.type
              })
            }, SA.readAsBinaryString(cA)
          })
        }

        function FA(cA) {
          var YA = y(atob(cA.data));
          return F([YA], {
            type: cA.type
          })
        }

        function zA(cA) {
          return cA && cA.__local_forage_encoded_blob
        }

        function NA(cA) {
          var YA = this,
            ZA = YA._initReady().then(function() {
              var SA = w[YA._dbInfo.name];
              if (SA && SA.dbReady) return SA.dbReady
            });
          return H(ZA, cA, cA), ZA
        }

        function OA(cA) {
          p(cA);
          var YA = w[cA.name],
            ZA = YA.forages;
          for (var SA = 0; SA < ZA.length; SA++) {
            var xA = ZA[SA];
            if (xA._dbInfo.db) xA._dbInfo.db.close(), xA._dbInfo.db = null
          }
          return cA.db = null, k(cA).then(function(dA) {
            if (cA.db = dA, o(cA)) return m(cA);
            return dA
          }).then(function(dA) {
            cA.db = YA.db = dA;
            for (var C1 = 0; C1 < ZA.length; C1++) ZA[C1]._dbInfo.db = dA
          }).catch(function(dA) {
            throw e(cA, dA), dA
          })
        }

        function mA(cA, YA, ZA, SA) {
          if (SA === void 0) SA = 1;
          try {
            var xA = cA.db.transaction(cA.storeName, YA);
            ZA(null, xA)
          } catch (dA) {
            if (SA > 0 && (!cA.db || dA.name === "InvalidStateError" || dA.name === "NotFoundError")) return K.resolve().then(function() {
              if (!cA.db || dA.name === "NotFoundError" && !cA.db.objectStoreNames.contains(cA.storeName) && cA.version <= cA.db.version) {
                if (cA.db) cA.version = cA.db.version + 1;
                return m(cA)
              }
            }).then(function() {
              return OA(cA).then(function() {
                mA(cA, YA, ZA, SA - 1)
              })
            }).catch(ZA);
            ZA(dA)
          }
        }

        function wA() {
          return {
            forages: [],
            db: null,
            dbReady: null,
            deferredOperations: []
          }
        }

        function qA(cA) {
          var YA = this,
            ZA = {
              db: null
            };
          if (cA)
            for (var SA in cA) ZA[SA] = cA[SA];
          var xA = w[ZA.name];
          if (!xA) xA = wA(), w[ZA.name] = xA;
          if (xA.forages.push(YA), !YA._initReady) YA._initReady = YA.ready, YA.ready = NA;
          var dA = [];

          function C1() {
            return K.resolve()
          }
          for (var j1 = 0; j1 < xA.forages.length; j1++) {
            var T1 = xA.forages[j1];
            if (T1 !== YA) dA.push(T1._initReady().catch(C1))
          }
          var m1 = xA.forages.slice(0);
          return K.all(dA).then(function() {
            return ZA.db = xA.db, k(ZA)
          }).then(function(p1) {
            if (ZA.db = p1, o(ZA, YA._defaultConfig.version)) return m(ZA);
            return p1
          }).then(function(p1) {
            ZA.db = xA.db = p1, YA._dbInfo = ZA;
            for (var D0 = 0; D0 < m1.length; D0++) {
              var GQ = m1[D0];
              if (GQ !== YA) GQ._dbInfo.db = ZA.db, GQ._dbInfo.version = ZA.version
            }
          })
        }

        function KA(cA, YA) {
          var ZA = this;
          cA = C(cA);
          var SA = new K(function(xA, dA) {
            ZA.ready().then(function() {
              mA(ZA._dbInfo, R, function(C1, j1) {
                if (C1) return dA(C1);
                try {
                  var T1 = j1.objectStore(ZA._dbInfo.storeName),
                    m1 = T1.get(cA);
                  m1.onsuccess = function() {
                    var p1 = m1.result;
                    if (p1 === void 0) p1 = null;
                    if (zA(p1)) p1 = FA(p1);
                    xA(p1)
                  }, m1.onerror = function() {
                    dA(m1.error)
                  }
                } catch (p1) {
                  dA(p1)
                }
              })
            }).catch(dA)
          });
          return D(SA, YA), SA
        }

        function yA(cA, YA) {
          var ZA = this,
            SA = new K(function(xA, dA) {
              ZA.ready().then(function() {
                mA(ZA._dbInfo, R, function(C1, j1) {
                  if (C1) return dA(C1);
                  try {
                    var T1 = j1.objectStore(ZA._dbInfo.storeName),
                      m1 = T1.openCursor(),
                      p1 = 1;
                    m1.onsuccess = function() {
                      var D0 = m1.result;
                      if (D0) {
                        var GQ = D0.value;
                        if (zA(GQ)) GQ = FA(GQ);
                        var lQ = cA(GQ, D0.key, p1++);
                        if (lQ !== void 0) xA(lQ);
                        else D0.continue()
                      } else xA()
                    }, m1.onerror = function() {
                      dA(m1.error)
                    }
                  } catch (D0) {
                    dA(D0)
                  }
                })
              }).catch(dA)
            });
          return D(SA, YA), SA
        }

        function oA(cA, YA, ZA) {
          var SA = this;
          cA = C(cA);
          var xA = new K(function(dA, C1) {
            var j1;
            SA.ready().then(function() {
              if (j1 = SA._dbInfo, N.call(YA) === "[object Blob]") return x(j1.db).then(function(T1) {
                if (T1) return YA;
                return IA(YA)
              });
              return YA
            }).then(function(T1) {
              mA(SA._dbInfo, T, function(m1, p1) {
                if (m1) return C1(m1);
                try {
                  var D0 = p1.objectStore(SA._dbInfo.storeName);
                  if (T1 === null) T1 = void 0;
                  var GQ = D0.put(T1, cA);
                  p1.oncomplete = function() {
                    if (T1 === void 0) T1 = null;
                    dA(T1)
                  }, p1.onabort = p1.onerror = function() {
                    var lQ = GQ.error ? GQ.error : GQ.transaction.error;
                    C1(lQ)
                  }
                } catch (lQ) {
                  C1(lQ)
                }
              })
            }).catch(C1)
          });
          return D(xA, ZA), xA
        }

        function X1(cA, YA) {
          var ZA = this;
          cA = C(cA);
          var SA = new K(function(xA, dA) {
            ZA.ready().then(function() {
              mA(ZA._dbInfo, T, function(C1, j1) {
                if (C1) return dA(C1);
                try {
                  var T1 = j1.objectStore(ZA._dbInfo.storeName),
                    m1 = T1.delete(cA);
                  j1.oncomplete = function() {
                    xA()
                  }, j1.onerror = function() {
                    dA(m1.error)
                  }, j1.onabort = function() {
                    var p1 = m1.error ? m1.error : m1.transaction.error;
                    dA(p1)
                  }
                } catch (p1) {
                  dA(p1)
                }
              })
            }).catch(dA)
          });
          return D(SA, YA), SA
        }

        function WA(cA) {
          var YA = this,
            ZA = new K(function(SA, xA) {
              YA.ready().then(function() {
                mA(YA._dbInfo, T, function(dA, C1) {
                  if (dA) return xA(dA);
                  try {
                    var j1 = C1.objectStore(YA._dbInfo.storeName),
                      T1 = j1.clear();
                    C1.oncomplete = function() {
                      SA()
                    }, C1.onabort = C1.onerror = function() {
                      var m1 = T1.error ? T1.error : T1.transaction.error;
                      xA(m1)
                    }
                  } catch (m1) {
                    xA(m1)
                  }
                })
              }).catch(xA)
            });
          return D(ZA, cA), ZA
        }

        function EA(cA) {
          var YA = this,
            ZA = new K(function(SA, xA) {
              YA.ready().then(function() {
                mA(YA._dbInfo, R, function(dA, C1) {
                  if (dA) return xA(dA);
                  try {
                    var j1 = C1.objectStore(YA._dbInfo.storeName),
                      T1 = j1.count();
                    T1.onsuccess = function() {
                      SA(T1.result)
                    }, T1.onerror = function() {
                      xA(T1.error)
                    }
                  } catch (m1) {
                    xA(m1)
                  }
                })
              }).catch(xA)
            });
          return D(ZA, cA), ZA
        }

        function MA(cA, YA) {
          var ZA = this,
            SA = new K(function(xA, dA) {
              if (cA < 0) {
                xA(null);
                return
              }
              ZA.ready().then(function() {
                mA(ZA._dbInfo, R, function(C1, j1) {
                  if (C1) return dA(C1);
                  try {
                    var T1 = j1.objectStore(ZA._dbInfo.storeName),
                      m1 = !1,
                      p1 = T1.openKeyCursor();
                    p1.onsuccess = function() {
                      var D0 = p1.result;
                      if (!D0) {
                        xA(null);
                        return
                      }
                      if (cA === 0) xA(D0.key);
                      else if (!m1) m1 = !0, D0.advance(cA);
                      else xA(D0.key)
                    }, p1.onerror = function() {
                      dA(p1.error)
                    }
                  } catch (D0) {
                    dA(D0)
                  }
                })
              }).catch(dA)
            });
          return D(SA, YA), SA
        }

        function DA(cA) {
          var YA = this,
            ZA = new K(function(SA, xA) {
              YA.ready().then(function() {
                mA(YA._dbInfo, R, function(dA, C1) {
                  if (dA) return xA(dA);
                  try {
                    var j1 = C1.objectStore(YA._dbInfo.storeName),
                      T1 = j1.openKeyCursor(),
                      m1 = [];
                    T1.onsuccess = function() {
                      var p1 = T1.result;
                      if (!p1) {
                        SA(m1);
                        return
                      }
                      m1.push(p1.key), p1.continue()
                    }, T1.onerror = function() {
                      xA(T1.error)
                    }
                  } catch (p1) {
                    xA(p1)
                  }
                })
              }).catch(xA)
            });
          return D(ZA, cA), ZA
        }

        function $A(cA, YA) {
          YA = E.apply(this, arguments);
          var ZA = this.config();
          if (cA = typeof cA !== "function" && cA || {}, !cA.name) cA.name = cA.name || ZA.name, cA.storeName = cA.storeName || ZA.storeName;
          var SA = this,
            xA;
          if (!cA.name) xA = K.reject("Invalid arguments");
          else {
            var dA = cA.name === ZA.name && SA._dbInfo.db,
              C1 = dA ? K.resolve(SA._dbInfo.db) : k(cA).then(function(j1) {
                var T1 = w[cA.name],
                  m1 = T1.forages;
                T1.db = j1;
                for (var p1 = 0; p1 < m1.length; p1++) m1[p1]._dbInfo.db = j1;
                return j1
              });
            if (!cA.storeName) xA = C1.then(function(j1) {
              p(cA);
              var T1 = w[cA.name],
                m1 = T1.forages;
              j1.close();
              for (var p1 = 0; p1 < m1.length; p1++) {
                var D0 = m1[p1];
                D0._dbInfo.db = null
              }
              var GQ = new K(function(lQ, lB) {
                var iQ = X.deleteDatabase(cA.name);
                iQ.onerror = function() {
                  var s2 = iQ.result;
                  if (s2) s2.close();
                  lB(iQ.error)
                }, iQ.onblocked = function() {
                  console.warn('dropInstance blocked for database "' + cA.name + '" until all open connections are closed')
                }, iQ.onsuccess = function() {
                  var s2 = iQ.result;
                  if (s2) s2.close();
                  lQ(s2)
                }
              });
              return GQ.then(function(lQ) {
                T1.db = lQ;
                for (var lB = 0; lB < m1.length; lB++) {
                  var iQ = m1[lB];
                  u(iQ._dbInfo)
                }
              }).catch(function(lQ) {
                throw (e(cA, lQ) || K.resolve()).catch(function() {}), lQ
              })
            });
            else xA = C1.then(function(j1) {
              if (!j1.objectStoreNames.contains(cA.storeName)) return;
              var T1 = j1.version + 1;
              p(cA);
              var m1 = w[cA.name],
                p1 = m1.forages;
              j1.close();
              for (var D0 = 0; D0 < p1.length; D0++) {
                var GQ = p1[D0];
                GQ._dbInfo.db = null, GQ._dbInfo.version = T1
              }
              var lQ = new K(function(lB, iQ) {
                var s2 = X.open(cA.name, T1);
                s2.onerror = function(P8) {
                  var C7 = s2.result;
                  C7.close(), iQ(P8)
                }, s2.onupgradeneeded = function() {
                  var P8 = s2.result;
                  P8.deleteObjectStore(cA.storeName)
                }, s2.onsuccess = function() {
                  var P8 = s2.result;
                  P8.close(), lB(P8)
                }
              });
              return lQ.then(function(lB) {
                m1.db = lB;
                for (var iQ = 0; iQ < p1.length; iQ++) {
                  var s2 = p1[iQ];
                  s2._dbInfo.db = lB, u(s2._dbInfo)
                }
              }).catch(function(lB) {
                throw (e(cA, lB) || K.resolve()).catch(function() {}), lB
              })
            })
          }
          return D(xA, YA), xA
        }
        var TA = {
          _driver: "asyncStorage",
          _initStorage: qA,
          _support: V(),
          iterate: yA,
          getItem: KA,
          setItem: oA,
          removeItem: X1,
          clear: WA,
          length: EA,
          key: MA,
          keys: DA,
          dropInstance: $A
        };

        function rA() {
          return typeof openDatabase === "function"
        }
        var iA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
          J1 = "~~local_forage_type~",
          w1 = /^~~local_forage_type~([^~]+)~/,
          jA = "__lfsc__:",
          eA = jA.length,
          t1 = "arbf",
          v1 = "blob",
          F0 = "si08",
          g0 = "ui08",
          p0 = "uic8",
          n0 = "si16",
          _1 = "si32",
          zQ = "ur16",
          W1 = "ui32",
          O1 = "fl32",
          a1 = "fl64",
          C0 = eA + t1.length,
          v0 = Object.prototype.toString;

        function k0(cA) {
          var YA = cA.length * 0.75,
            ZA = cA.length,
            SA, xA = 0,
            dA, C1, j1, T1;
          if (cA[cA.length - 1] === "=") {
            if (YA--, cA[cA.length - 2] === "=") YA--
          }
          var m1 = new ArrayBuffer(YA),
            p1 = new Uint8Array(m1);
          for (SA = 0; SA < ZA; SA += 4) dA = iA.indexOf(cA[SA]), C1 = iA.indexOf(cA[SA + 1]), j1 = iA.indexOf(cA[SA + 2]), T1 = iA.indexOf(cA[SA + 3]), p1[xA++] = dA << 2 | C1 >> 4, p1[xA++] = (C1 & 15) << 4 | j1 >> 2, p1[xA++] = (j1 & 3) << 6 | T1 & 63;
          return m1
        }

        function f0(cA) {
          var YA = new Uint8Array(cA),
            ZA = "",
            SA;
          for (SA = 0; SA < YA.length; SA += 3) ZA += iA[YA[SA] >> 2], ZA += iA[(YA[SA] & 3) << 4 | YA[SA + 1] >> 4], ZA += iA[(YA[SA + 1] & 15) << 2 | YA[SA + 2] >> 6], ZA += iA[YA[SA + 2] & 63];
          if (YA.length % 3 === 2) ZA = ZA.substring(0, ZA.length - 1) + "=";
          else if (YA.length % 3 === 1) ZA = ZA.substring(0, ZA.length - 2) + "==";
          return ZA
        }

        function G0(cA, YA) {
          var ZA = "";
          if (cA) ZA = v0.call(cA);
          if (cA && (ZA === "[object ArrayBuffer]" || cA.buffer && v0.call(cA.buffer) === "[object ArrayBuffer]")) {
            var SA, xA = jA;
            if (cA instanceof ArrayBuffer) SA = cA, xA += t1;
            else if (SA = cA.buffer, ZA === "[object Int8Array]") xA += F0;
            else if (ZA === "[object Uint8Array]") xA += g0;
            else if (ZA === "[object Uint8ClampedArray]") xA += p0;
            else if (ZA === "[object Int16Array]") xA += n0;
            else if (ZA === "[object Uint16Array]") xA += zQ;
            else if (ZA === "[object Int32Array]") xA += _1;
            else if (ZA === "[object Uint32Array]") xA += W1;
            else if (ZA === "[object Float32Array]") xA += O1;
            else if (ZA === "[object Float64Array]") xA += a1;
            else YA(Error("Failed to get type for BinaryArray"));
            YA(xA + f0(SA))
          } else if (ZA === "[object Blob]") {
            var dA = new FileReader;
            dA.onload = function() {
              var C1 = J1 + cA.type + "~" + f0(this.result);
              YA(jA + v1 + C1)
            }, dA.readAsArrayBuffer(cA)
          } else try {
            YA(JSON.stringify(cA))
          } catch (C1) {
            console.error("Couldn't convert value into a JSON string: ", cA), YA(null, C1)
          }
        }

        function yQ(cA) {
          if (cA.substring(0, eA) !== jA) return JSON.parse(cA);
          var YA = cA.substring(C0),
            ZA = cA.substring(eA, C0),
            SA;
          if (ZA === v1 && w1.test(YA)) {
            var xA = YA.match(w1);
            SA = xA[1], YA = YA.substring(xA[0].length)
          }
          var dA = k0(YA);
          switch (ZA) {
            case t1:
              return dA;
            case v1:
              return F([dA], {
                type: SA
              });
            case F0:
              return new Int8Array(dA);
            case g0:
              return new Uint8Array(dA);
            case p0:
              return new Uint8ClampedArray(dA);
            case n0:
              return new Int16Array(dA);
            case zQ:
              return new Uint16Array(dA);
            case _1:
              return new Int32Array(dA);
            case W1:
              return new Uint32Array(dA);
            case O1:
              return new Float32Array(dA);
            case a1:
              return new Float64Array(dA);
            default:
              throw Error("Unkown type: " + ZA)
          }
        }
        var aQ = {
          serialize: G0,
          deserialize: yQ,
          stringToBuffer: k0,
          bufferToString: f0
        };

        function sQ(cA, YA, ZA, SA) {
          cA.executeSql("CREATE TABLE IF NOT EXISTS " + YA.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], ZA, SA)
        }

        function K0(cA) {
          var YA = this,
            ZA = {
              db: null
            };
          if (cA)
            for (var SA in cA) ZA[SA] = typeof cA[SA] !== "string" ? cA[SA].toString() : cA[SA];
          var xA = new K(function(dA, C1) {
            try {
              ZA.db = openDatabase(ZA.name, String(ZA.version), ZA.description, ZA.size)
            } catch (j1) {
              return C1(j1)
            }
            ZA.db.transaction(function(j1) {
              sQ(j1, ZA, function() {
                YA._dbInfo = ZA, dA()
              }, function(T1, m1) {
                C1(m1)
              })
            }, C1)
          });
          return ZA.serializer = aQ, xA
        }

        function mB(cA, YA, ZA, SA, xA, dA) {
          cA.executeSql(ZA, SA, xA, function(C1, j1) {
            if (j1.code === j1.SYNTAX_ERR) C1.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [YA.storeName], function(T1, m1) {
              if (!m1.rows.length) sQ(T1, YA, function() {
                T1.executeSql(ZA, SA, xA, dA)
              }, dA);
              else dA(T1, j1)
            }, dA);
            else dA(C1, j1)
          }, dA)
        }

        function e2(cA, YA) {
          var ZA = this;
          cA = C(cA);
          var SA = new K(function(xA, dA) {
            ZA.ready().then(function() {
              var C1 = ZA._dbInfo;
              C1.db.transaction(function(j1) {
                mB(j1, C1, "SELECT * FROM " + C1.storeName + " WHERE key = ? LIMIT 1", [cA], function(T1, m1) {
                  var p1 = m1.rows.length ? m1.rows.item(0).value : null;
                  if (p1) p1 = C1.serializer.deserialize(p1);
                  xA(p1)
                }, function(T1, m1) {
                  dA(m1)
                })
              })
            }).catch(dA)
          });
          return D(SA, YA), SA
        }

        function s8(cA, YA) {
          var ZA = this,
            SA = new K(function(xA, dA) {
              ZA.ready().then(function() {
                var C1 = ZA._dbInfo;
                C1.db.transaction(function(j1) {
                  mB(j1, C1, "SELECT * FROM " + C1.storeName, [], function(T1, m1) {
                    var p1 = m1.rows,
                      D0 = p1.length;
                    for (var GQ = 0; GQ < D0; GQ++) {
                      var lQ = p1.item(GQ),
                        lB = lQ.value;
                      if (lB) lB = C1.serializer.deserialize(lB);
                      if (lB = cA(lB, lQ.key, GQ + 1), lB !== void 0) {
                        xA(lB);
                        return
                      }
                    }
                    xA()
                  }, function(T1, m1) {
                    dA(m1)
                  })
                })
              }).catch(dA)
            });
          return D(SA, YA), SA
        }

        function K5(cA, YA, ZA, SA) {
          var xA = this;
          cA = C(cA);
          var dA = new K(function(C1, j1) {
            xA.ready().then(function() {
              if (YA === void 0) YA = null;
              var T1 = YA,
                m1 = xA._dbInfo;
              m1.serializer.serialize(YA, function(p1, D0) {
                if (D0) j1(D0);
                else m1.db.transaction(function(GQ) {
                  mB(GQ, m1, "INSERT OR REPLACE INTO " + m1.storeName + " (key, value) VALUES (?, ?)", [cA, p1], function() {
                    C1(T1)
                  }, function(lQ, lB) {
                    j1(lB)
                  })
                }, function(GQ) {
                  if (GQ.code === GQ.QUOTA_ERR) {
                    if (SA > 0) {
                      C1(K5.apply(xA, [cA, T1, ZA, SA - 1]));
                      return
                    }
                    j1(GQ)
                  }
                })
              })
            }).catch(j1)
          });
          return D(dA, ZA), dA
        }

        function g6(cA, YA, ZA) {
          return K5.apply(this, [cA, YA, ZA, 1])
        }

        function c3(cA, YA) {
          var ZA = this;
          cA = C(cA);
          var SA = new K(function(xA, dA) {
            ZA.ready().then(function() {
              var C1 = ZA._dbInfo;
              C1.db.transaction(function(j1) {
                mB(j1, C1, "DELETE FROM " + C1.storeName + " WHERE key = ?", [cA], function() {
                  xA()
                }, function(T1, m1) {
                  dA(m1)
                })
              })
            }).catch(dA)
          });
          return D(SA, YA), SA
        }

        function tZ(cA) {
          var YA = this,
            ZA = new K(function(SA, xA) {
              YA.ready().then(function() {
                var dA = YA._dbInfo;
                dA.db.transaction(function(C1) {
                  mB(C1, dA, "DELETE FROM " + dA.storeName, [], function() {
                    SA()
                  }, function(j1, T1) {
                    xA(T1)
                  })
                })
              }).catch(xA)
            });
          return D(ZA, cA), ZA
        }

        function H7(cA) {
          var YA = this,
            ZA = new K(function(SA, xA) {
              YA.ready().then(function() {
                var dA = YA._dbInfo;
                dA.db.transaction(function(C1) {
                  mB(C1, dA, "SELECT COUNT(key) as c FROM " + dA.storeName, [], function(j1, T1) {
                    var m1 = T1.rows.item(0).c;
                    SA(m1)
                  }, function(j1, T1) {
                    xA(T1)
                  })
                })
              }).catch(xA)
            });
          return D(ZA, cA), ZA
        }

        function H8(cA, YA) {
          var ZA = this,
            SA = new K(function(xA, dA) {
              ZA.ready().then(function() {
                var C1 = ZA._dbInfo;
                C1.db.transaction(function(j1) {
                  mB(j1, C1, "SELECT key FROM " + C1.storeName + " WHERE id = ? LIMIT 1", [cA + 1], function(T1, m1) {
                    var p1 = m1.rows.length ? m1.rows.item(0).key : null;
                    xA(p1)
                  }, function(T1, m1) {
                    dA(m1)
                  })
                })
              }).catch(dA)
            });
          return D(SA, YA), SA
        }

        function r5(cA) {
          var YA = this,
            ZA = new K(function(SA, xA) {
              YA.ready().then(function() {
                var dA = YA._dbInfo;
                dA.db.transaction(function(C1) {
                  mB(C1, dA, "SELECT key FROM " + dA.storeName, [], function(j1, T1) {
                    var m1 = [];
                    for (var p1 = 0; p1 < T1.rows.length; p1++) m1.push(T1.rows.item(p1).key);
                    SA(m1)
                  }, function(j1, T1) {
                    xA(T1)
                  })
                })
              }).catch(xA)
            });
          return D(ZA, cA), ZA
        }

        function nG(cA) {
          return new K(function(YA, ZA) {
            cA.transaction(function(SA) {
              SA.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(xA, dA) {
                var C1 = [];
                for (var j1 = 0; j1 < dA.rows.length; j1++) C1.push(dA.rows.item(j1).name);
                YA({
                  db: cA,
                  storeNames: C1
                })
              }, function(xA, dA) {
                ZA(dA)
              })
            }, function(SA) {
              ZA(SA)
            })
          })
        }

        function aG(cA, YA) {
          YA = E.apply(this, arguments);
          var ZA = this.config();
          if (cA = typeof cA !== "function" && cA || {}, !cA.name) cA.name = cA.name || ZA.name, cA.storeName = cA.storeName || ZA.storeName;
          var SA = this,
            xA;
          if (!cA.name) xA = K.reject("Invalid arguments");
          else xA = new K(function(dA) {
            var C1;
            if (cA.name === ZA.name) C1 = SA._dbInfo.db;
            else C1 = openDatabase(cA.name, "", "", 0);
            if (!cA.storeName) dA(nG(C1));
            else dA({
              db: C1,
              storeNames: [cA.storeName]
            })
          }).then(function(dA) {
            return new K(function(C1, j1) {
              dA.db.transaction(function(T1) {
                function m1(lQ) {
                  return new K(function(lB, iQ) {
                    T1.executeSql("DROP TABLE IF EXISTS " + lQ, [], function() {
                      lB()
                    }, function(s2, P8) {
                      iQ(P8)
                    })
                  })
                }
                var p1 = [];
                for (var D0 = 0, GQ = dA.storeNames.length; D0 < GQ; D0++) p1.push(m1(dA.storeNames[D0]));
                K.all(p1).then(function() {
                  C1()
                }).catch(function(lQ) {
                  j1(lQ)
                })
              }, function(T1) {
                j1(T1)
              })
            })
          });
          return D(xA, YA), xA
        }
        var U1 = {
          _driver: "webSQLStorage",
          _initStorage: K0,
          _support: rA(),
          iterate: s8,
          getItem: e2,
          setItem: g6,
          removeItem: c3,
          clear: tZ,
          length: H7,
          key: H8,
          keys: r5,
          dropInstance: aG
        };

        function sA() {
          try {
            return typeof localStorage < "u" && "setItem" in localStorage && !!localStorage.setItem
          } catch (cA) {
            return !1
          }
        }

        function E1(cA, YA) {
          var ZA = cA.name + "/";
          if (cA.storeName !== YA.storeName) ZA += cA.storeName + "/";
          return ZA
        }

        function M1() {
          var cA = "_localforage_support_test";
          try {
            return localStorage.setItem(cA, !0), localStorage.removeItem(cA), !1
          } catch (YA) {
            return !0
          }
        }

        function k1() {
          return !M1() || localStorage.length > 0
        }

        function O0(cA) {
          var YA = this,
            ZA = {};
          if (cA)
            for (var SA in cA) ZA[SA] = cA[SA];
          if (ZA.keyPrefix = E1(cA, YA._defaultConfig), !k1()) return K.reject();
          return YA._dbInfo = ZA, ZA.serializer = aQ, K.resolve()
        }

        function oQ(cA) {
          var YA = this,
            ZA = YA.ready().then(function() {
              var SA = YA._dbInfo.keyPrefix;
              for (var xA = localStorage.length - 1; xA >= 0; xA--) {
                var dA = localStorage.key(xA);
                if (dA.indexOf(SA) === 0) localStorage.removeItem(dA)
              }
            });
          return D(ZA, cA), ZA
        }

        function tB(cA, YA) {
          var ZA = this;
          cA = C(cA);
          var SA = ZA.ready().then(function() {
            var xA = ZA._dbInfo,
              dA = localStorage.getItem(xA.keyPrefix + cA);
            if (dA) dA = xA.serializer.deserialize(dA);
            return dA
          });
          return D(SA, YA), SA
        }

        function y9(cA, YA) {
          var ZA = this,
            SA = ZA.ready().then(function() {
              var xA = ZA._dbInfo,
                dA = xA.keyPrefix,
                C1 = dA.length,
                j1 = localStorage.length,
                T1 = 1;
              for (var m1 = 0; m1 < j1; m1++) {
                var p1 = localStorage.key(m1);
                if (p1.indexOf(dA) !== 0) continue;
                var D0 = localStorage.getItem(p1);
                if (D0) D0 = xA.serializer.deserialize(D0);
                if (D0 = cA(D0, p1.substring(C1), T1++), D0 !== void 0) return D0
              }
            });
          return D(SA, YA), SA
        }

        function Y6(cA, YA) {
          var ZA = this,
            SA = ZA.ready().then(function() {
              var xA = ZA._dbInfo,
                dA;
              try {
                dA = localStorage.key(cA)
              } catch (C1) {
                dA = null
              }
              if (dA) dA = dA.substring(xA.keyPrefix.length);
              return dA
            });
          return D(SA, YA), SA
        }

        function u9(cA) {
          var YA = this,
            ZA = YA.ready().then(function() {
              var SA = YA._dbInfo,
                xA = localStorage.length,
                dA = [];
              for (var C1 = 0; C1 < xA; C1++) {
                var j1 = localStorage.key(C1);
                if (j1.indexOf(SA.keyPrefix) === 0) dA.push(j1.substring(SA.keyPrefix.length))
              }
              return dA
            });
          return D(ZA, cA), ZA
        }

        function r8(cA) {
          var YA = this,
            ZA = YA.keys().then(function(SA) {
              return SA.length
            });
          return D(ZA, cA), ZA
        }

        function $6(cA, YA) {
          var ZA = this;
          cA = C(cA);
          var SA = ZA.ready().then(function() {
            var xA = ZA._dbInfo;
            localStorage.removeItem(xA.keyPrefix + cA)
          });
          return D(SA, YA), SA
        }

        function T8(cA, YA, ZA) {
          var SA = this;
          cA = C(cA);
          var xA = SA.ready().then(function() {
            if (YA === void 0) YA = null;
            var dA = YA;
            return new K(function(C1, j1) {
              var T1 = SA._dbInfo;
              T1.serializer.serialize(YA, function(m1, p1) {
                if (p1) j1(p1);
                else try {
                  localStorage.setItem(T1.keyPrefix + cA, m1), C1(dA)
                } catch (D0) {
                  if (D0.name === "QuotaExceededError" || D0.name === "NS_ERROR_DOM_QUOTA_REACHED") j1(D0);
                  j1(D0)
                }
              })
            })
          });
          return D(xA, ZA), xA
        }

        function i9(cA, YA) {
          if (YA = E.apply(this, arguments), cA = typeof cA !== "function" && cA || {}, !cA.name) {
            var ZA = this.config();
            cA.name = cA.name || ZA.name, cA.storeName = cA.storeName || ZA.storeName
          }
          var SA = this,
            xA;
          if (!cA.name) xA = K.reject("Invalid arguments");
          else xA = new K(function(dA) {
            if (!cA.storeName) dA(cA.name + "/");
            else dA(E1(cA, SA._defaultConfig))
          }).then(function(dA) {
            for (var C1 = localStorage.length - 1; C1 >= 0; C1--) {
              var j1 = localStorage.key(C1);
              if (j1.indexOf(dA) === 0) localStorage.removeItem(j1)
            }
          });
          return D(xA, YA), xA
        }
        var J6 = {
            _driver: "localStorageWrapper",
            _initStorage: O0,
            _support: sA(),
            iterate: y9,
            getItem: tB,
            setItem: T8,
            removeItem: $6,
            clear: oQ,
            length: r8,
            key: Y6,
            keys: u9,
            dropInstance: i9
          },
          N4 = function(YA, ZA) {
            return YA === ZA || typeof YA === "number" && typeof ZA === "number" && isNaN(YA) && isNaN(ZA)
          },
          QG = function(YA, ZA) {
            var SA = YA.length,
              xA = 0;
            while (xA < SA) {
              if (N4(YA[xA], ZA)) return !0;
              xA++
            }
            return !1
          },
          w6 = Array.isArray || function(cA) {
            return Object.prototype.toString.call(cA) === "[object Array]"
          },
          b5 = {},
          n9 = {},
          I8 = {
            INDEXEDDB: TA,
            WEBSQL: U1,
            LOCALSTORAGE: J6
          },
          f5 = [I8.INDEXEDDB._driver, I8.WEBSQL._driver, I8.LOCALSTORAGE._driver],
          Y8 = ["dropInstance"],
          d4 = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(Y8),
          a9 = {
            description: "",
            driver: f5.slice(),
            name: "localforage",
            size: 4980736,
            storeName: "keyvaluepairs",
            version: 1
          };

        function L4(cA, YA) {
          cA[YA] = function() {
            var ZA = arguments;
            return cA.ready().then(function() {
              return cA[YA].apply(cA, ZA)
            })
          }
        }

        function o5() {
          for (var cA = 1; cA < arguments.length; cA++) {
            var YA = arguments[cA];
            if (YA) {
              for (var ZA in YA)
                if (YA.hasOwnProperty(ZA))
                  if (w6(YA[ZA])) arguments[0][ZA] = YA[ZA].slice();
                  else arguments[0][ZA] = YA[ZA]
            }
          }
          return arguments[0]
        }
        var m9 = function() {
            function cA(YA) {
              J(this, cA);
              for (var ZA in I8)
                if (I8.hasOwnProperty(ZA)) {
                  var SA = I8[ZA],
                    xA = SA._driver;
                  if (this[ZA] = xA, !b5[xA]) this.defineDriver(SA)
                } this._defaultConfig = o5({}, a9), this._config = o5({}, this._defaultConfig, YA), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch(function() {})
            }
            return cA.prototype.config = function(ZA) {
              if ((typeof ZA > "u" ? "undefined" : Y(ZA)) === "object") {
                if (this._ready) return Error("Can't call config() after localforage has been used.");
                for (var SA in ZA) {
                  if (SA === "storeName") ZA[SA] = ZA[SA].replace(/\W/g, "_");
                  if (SA === "version" && typeof ZA[SA] !== "number") return Error("Database version must be a number.");
                  this._config[SA] = ZA[SA]
                }
                if ("driver" in ZA && ZA.driver) return this.setDriver(this._config.driver);
                return !0
              } else if (typeof ZA === "string") return this._config[ZA];
              else return this._config
            }, cA.prototype.defineDriver = function(ZA, SA, xA) {
              var dA = new K(function(C1, j1) {
                try {
                  var T1 = ZA._driver,
                    m1 = Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!ZA._driver) {
                    j1(m1);
                    return
                  }
                  var p1 = d4.concat("_initStorage");
                  for (var D0 = 0, GQ = p1.length; D0 < GQ; D0++) {
                    var lQ = p1[D0],
                      lB = !QG(Y8, lQ);
                    if ((lB || ZA[lQ]) && typeof ZA[lQ] !== "function") {
                      j1(m1);
                      return
                    }
                  }
                  var iQ = function() {
                    var C7 = function(NY) {
                      return function() {
                        var G4 = Error("Method " + NY + " is not implemented by the current driver"),
                          BJ = K.reject(G4);
                        return D(BJ, arguments[arguments.length - 1]), BJ
                      }
                    };
                    for (var D5 = 0, AW = Y8.length; D5 < AW; D5++) {
                      var u6 = Y8[D5];
                      if (!ZA[u6]) ZA[u6] = C7(u6)
                    }
                  };
                  iQ();
                  var s2 = function(C7) {
                    if (b5[T1]) console.info("Redefining LocalForage driver: " + T1);
                    b5[T1] = ZA, n9[T1] = C7, C1()
                  };
                  if ("_support" in ZA)
                    if (ZA._support && typeof ZA._support === "function") ZA._support().then(s2, j1);
                    else s2(!!ZA._support);
                  else s2(!0)
                } catch (P8) {
                  j1(P8)
                }
              });
              return H(dA, SA, xA), dA
            }, cA.prototype.driver = function() {
              return this._driver || null
            }, cA.prototype.getDriver = function(ZA, SA, xA) {
              var dA = b5[ZA] ? K.resolve(b5[ZA]) : K.reject(Error("Driver not found."));
              return H(dA, SA, xA), dA
            }, cA.prototype.getSerializer = function(ZA) {
              var SA = K.resolve(aQ);
              return H(SA, ZA), SA
            }, cA.prototype.ready = function(ZA) {
              var SA = this,
                xA = SA._driverSet.then(function() {
                  if (SA._ready === null) SA._ready = SA._initDriver();
                  return SA._ready
                });
              return H(xA, ZA, ZA), xA
            }, cA.prototype.setDriver = function(ZA, SA, xA) {
              var dA = this;
              if (!w6(ZA)) ZA = [ZA];
              var C1 = this._getSupportedDrivers(ZA);

              function j1() {
                dA._config.driver = dA.driver()
              }

              function T1(D0) {
                return dA._extend(D0), j1(), dA._ready = dA._initStorage(dA._config), dA._ready
              }

              function m1(D0) {
                return function() {
                  var GQ = 0;

                  function lQ() {
                    while (GQ < D0.length) {
                      var lB = D0[GQ];
                      return GQ++, dA._dbInfo = null, dA._ready = null, dA.getDriver(lB).then(T1).catch(lQ)
                    }
                    j1();
                    var iQ = Error("No available storage method found.");
                    return dA._driverSet = K.reject(iQ), dA._driverSet
                  }
                  return lQ()
                }
              }
              var p1 = this._driverSet !== null ? this._driverSet.catch(function() {
                return K.resolve()
              }) : K.resolve();
              return this._driverSet = p1.then(function() {
                var D0 = C1[0];
                return dA._dbInfo = null, dA._ready = null, dA.getDriver(D0).then(function(GQ) {
                  dA._driver = GQ._driver, j1(), dA._wrapLibraryMethodsWithReady(), dA._initDriver = m1(C1)
                })
              }).catch(function() {
                j1();
                var D0 = Error("No available storage method found.");
                return dA._driverSet = K.reject(D0), dA._driverSet
              }), H(this._driverSet, SA, xA), this._driverSet
            }, cA.prototype.supports = function(ZA) {
              return !!n9[ZA]
            }, cA.prototype._extend = function(ZA) {
              o5(this, ZA)
            }, cA.prototype._getSupportedDrivers = function(ZA) {
              var SA = [];
              for (var xA = 0, dA = ZA.length; xA < dA; xA++) {
                var C1 = ZA[xA];
                if (this.supports(C1)) SA.push(C1)
              }
              return SA
            }, cA.prototype._wrapLibraryMethodsWithReady = function() {
              for (var ZA = 0, SA = d4.length; ZA < SA; ZA++) L4(this, d4[ZA])
            }, cA.prototype.createInstance = function(ZA) {
              return new cA(ZA)
            }, cA
          }(),
          d9 = new m9;
        Z.exports = d9
      }, {
        "3": 3
      }]
    }, {}, [4])(4)
  })
})
// @from(Start 13068993, End 13071575)
yA9 = z((kA9) => {
  Object.defineProperty(kA9, "__esModule", {
    value: !0
  });
  var Ax = i0(),
    kw3 = _A9(),
    HQA = dPA(),
    Za = Ax.GLOBAL_OBJ;
  class cPA {
    static __initStatic() {
      this.id = "Offline"
    }
    constructor(A = {}) {
      this.name = cPA.id, this.maxStoredEvents = A.maxStoredEvents || 30, this.offlineEventStore = kw3.createInstance({
        name: "sentry/offlineEventStore"
      })
    }
    setupOnce(A, Q) {
      if (this.hub = Q(), "addEventListener" in Za) Za.addEventListener("online", () => {
        this._sendEvents().catch(() => {
          HQA.DEBUG_BUILD && Ax.logger.warn("could not send cached events")
        })
      });
      let B = (G) => {
        if (this.hub && this.hub.getIntegration(cPA)) {
          if ("navigator" in Za && "onLine" in Za.navigator && !Za.navigator.onLine) return HQA.DEBUG_BUILD && Ax.logger.log("Event dropped due to being a offline - caching instead"), this._cacheEvent(G).then((Z) => this._enforceMaxEvents()).catch((Z) => {
            HQA.DEBUG_BUILD && Ax.logger.warn("could not cache event while offline")
          }), null
        }
        return G
      };
      if (B.id = this.name, A(B), "navigator" in Za && "onLine" in Za.navigator && Za.navigator.onLine) this._sendEvents().catch(() => {
        HQA.DEBUG_BUILD && Ax.logger.warn("could not send cached events")
      })
    }
    async _cacheEvent(A) {
      return this.offlineEventStore.setItem(Ax.uuid4(), Ax.normalize(A))
    }
    async _enforceMaxEvents() {
      let A = [];
      return this.offlineEventStore.iterate((Q, B, G) => {
        A.push({
          cacheKey: B,
          event: Q
        })
      }).then(() => this._purgeEvents(A.sort((Q, B) => (B.event.timestamp || 0) - (Q.event.timestamp || 0)).slice(this.maxStoredEvents < A.length ? this.maxStoredEvents : A.length).map((Q) => Q.cacheKey))).catch((Q) => {
        HQA.DEBUG_BUILD && Ax.logger.warn("could not enforce max events")
      })
    }
    async _purgeEvent(A) {
      return this.offlineEventStore.removeItem(A)
    }
    async _purgeEvents(A) {
      return Promise.all(A.map((Q) => this._purgeEvent(Q))).then()
    }
    async _sendEvents() {
      return this.offlineEventStore.iterate((A, Q, B) => {
        if (this.hub) this.hub.captureEvent(A), this._purgeEvent(Q).catch((G) => {
          HQA.DEBUG_BUILD && Ax.logger.warn("could not purge event from cache")
        });
        else HQA.DEBUG_BUILD && Ax.logger.warn("no hub found - could not send cached event")
      })
    }
  }
  cPA.__initStatic();
  kA9.Offline = cPA
})
// @from(Start 13071581, End 13072965)
gA9 = z((hA9) => {
  Object.defineProperty(hA9, "__esModule", {
    value: !0
  });
  var pPA = _4(),
    vA9 = i0(),
    xw3 = vA9.GLOBAL_OBJ,
    bA9 = "ReportingObserver",
    xA9 = new WeakMap,
    vw3 = (A = {}) => {
      let Q = A.types || ["crash", "deprecation", "intervention"];

      function B(G) {
        if (!xA9.has(pPA.getClient())) return;
        for (let Z of G) pPA.withScope((I) => {
          I.setExtra("url", Z.url);
          let Y = `ReportingObserver [${Z.type}]`,
            J = "No details available";
          if (Z.body) {
            let W = {};
            for (let X in Z.body) W[X] = Z.body[X];
            if (I.setExtra("body", W), Z.type === "crash") {
              let X = Z.body;
              J = [X.crashId || "", X.reason || ""].join(" ").trim() || J
            } else J = Z.body.message || J
          }
          pPA.captureMessage(`${Y}: ${J}`)
        })
      }
      return {
        name: bA9,
        setupOnce() {
          if (!vA9.supportsReportingObserver()) return;
          new xw3.ReportingObserver(B, {
            buffered: !0,
            types: Q
          }).observe()
        },
        setup(G) {
          xA9.set(G, !0)
        }
      }
    },
    fA9 = pPA.defineIntegration(vw3),
    bw3 = pPA.convertIntegrationFnToClass(bA9, fA9);
  hA9.ReportingObserver = bw3;
  hA9.reportingObserverIntegration = fA9
})
// @from(Start 13072971, End 13074602)
lA9 = z((pA9) => {
  Object.defineProperty(pA9, "__esModule", {
    value: !0
  });
  var mA9 = _4(),
    uA9 = i0(),
    dA9 = "RewriteFrames",
    gw3 = (A = {}) => {
      let Q = A.root,
        B = A.prefix || "app:///",
        G = A.iteratee || ((Y) => {
          if (!Y.filename) return Y;
          let J = /^[a-zA-Z]:\\/.test(Y.filename) || Y.filename.includes("\\") && !Y.filename.includes("/"),
            W = /^\//.test(Y.filename);
          if (J || W) {
            let X = J ? Y.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : Y.filename,
              V = Q ? uA9.relative(Q, X) : uA9.basename(X);
            Y.filename = `${B}${V}`
          }
          return Y
        });

      function Z(Y) {
        try {
          return {
            ...Y,
            exception: {
              ...Y.exception,
              values: Y.exception.values.map((J) => ({
                ...J,
                ...J.stacktrace && {
                  stacktrace: I(J.stacktrace)
                }
              }))
            }
          }
        } catch (J) {
          return Y
        }
      }

      function I(Y) {
        return {
          ...Y,
          frames: Y && Y.frames && Y.frames.map((J) => G(J))
        }
      }
      return {
        name: dA9,
        setupOnce() {},
        processEvent(Y) {
          let J = Y;
          if (Y.exception && Array.isArray(Y.exception.values)) J = Z(J);
          return J
        }
      }
    },
    cA9 = mA9.defineIntegration(gw3),
    uw3 = mA9.convertIntegrationFnToClass(dA9, cA9);
  pA9.RewriteFrames = uw3;
  pA9.rewriteFramesIntegration = cA9
})
// @from(Start 13074608, End 13075299)
rA9 = z((sA9) => {
  Object.defineProperty(sA9, "__esModule", {
    value: !0
  });
  var iA9 = _4(),
    nA9 = "SessionTiming",
    cw3 = () => {
      let A = Date.now();
      return {
        name: nA9,
        setupOnce() {},
        processEvent(Q) {
          let B = Date.now();
          return {
            ...Q,
            extra: {
              ...Q.extra,
              ["session:start"]: A,
              ["session:duration"]: B - A,
              ["session:end"]: B
            }
          }
        }
      }
    },
    aA9 = iA9.defineIntegration(cw3),
    pw3 = iA9.convertIntegrationFnToClass(nA9, aA9);
  sA9.SessionTiming = pw3;
  sA9.sessionTimingIntegration = aA9
})
// @from(Start 13075305, End 13076148)
eA9 = z((tA9) => {
  Object.defineProperty(tA9, "__esModule", {
    value: !0
  });
  var nw3 = _4(),
    oA9 = "Transaction",
    aw3 = () => {
      return {
        name: oA9,
        setupOnce() {},
        processEvent(A) {
          let Q = rw3(A);
          for (let B = Q.length - 1; B >= 0; B--) {
            let G = Q[B];
            if (G.in_app === !0) {
              A.transaction = ow3(G);
              break
            }
          }
          return A
        }
      }
    },
    sw3 = nw3.convertIntegrationFnToClass(oA9, aw3);

  function rw3(A) {
    let Q = A.exception && A.exception.values && A.exception.values[0];
    return Q && Q.stacktrace && Q.stacktrace.frames || []
  }

  function ow3(A) {
    return A.module || A.function ? `${A.module||"?"}/${A.function||"?"}` : "<unknown>"
  }
  tA9.Transaction = sw3
})
// @from(Start 13076154, End 13081330)
J19 = z((Y19) => {
  Object.defineProperty(Y19, "__esModule", {
    value: !0
  });
  var Mg = _4(),
    Qx = i0(),
    zZ1 = dPA(),
    A19 = "HttpClient",
    ew3 = (A = {}) => {
      let Q = {
        failedRequestStatusCodes: [
          [500, 599]
        ],
        failedRequestTargets: [/.*/],
        ...A
      };
      return {
        name: A19,
        setupOnce() {},
        setup(B) {
          Wq3(B, Q), Xq3(B, Q)
        }
      }
    },
    Q19 = Mg.defineIntegration(ew3),
    Aq3 = Mg.convertIntegrationFnToClass(A19, Q19);

  function Qq3(A, Q, B, G) {
    if (G19(A, B.status, B.url)) {
      let Z = Vq3(Q, G),
        I, Y, J, W;
      if (I19())[{
        headers: I,
        cookies: J
      }, {
        headers: Y,
        cookies: W
      }] = [{
        cookieHeader: "Cookie",
        obj: Z
      }, {
        cookieHeader: "Set-Cookie",
        obj: B
      }].map(({
        cookieHeader: V,
        obj: F
      }) => {
        let K = Zq3(F.headers),
          D;
        try {
          let H = K[V] || K[V.toLowerCase()] || void 0;
          if (H) D = B19(H)
        } catch (H) {
          zZ1.DEBUG_BUILD && Qx.logger.log(`Could not extract cookies from header ${V}`)
        }
        return {
          headers: K,
          cookies: D
        }
      });
      let X = Z19({
        url: Z.url,
        method: Z.method,
        status: B.status,
        requestHeaders: I,
        responseHeaders: Y,
        requestCookies: J,
        responseCookies: W
      });
      Mg.captureEvent(X)
    }
  }

  function Bq3(A, Q, B, G) {
    if (G19(A, Q.status, Q.responseURL)) {
      let Z, I, Y;
      if (I19()) {
        try {
          let W = Q.getResponseHeader("Set-Cookie") || Q.getResponseHeader("set-cookie") || void 0;
          if (W) I = B19(W)
        } catch (W) {
          zZ1.DEBUG_BUILD && Qx.logger.log("Could not extract cookies from response headers")
        }
        try {
          Y = Iq3(Q)
        } catch (W) {
          zZ1.DEBUG_BUILD && Qx.logger.log("Could not extract headers from response")
        }
        Z = G
      }
      let J = Z19({
        url: Q.responseURL,
        method: B,
        status: Q.status,
        requestHeaders: Z,
        responseHeaders: Y,
        responseCookies: I
      });
      Mg.captureEvent(J)
    }
  }

  function Gq3(A) {
    if (A) {
      let Q = A["Content-Length"] || A["content-length"];
      if (Q) return parseInt(Q, 10)
    }
    return
  }

  function B19(A) {
    return A.split("; ").reduce((Q, B) => {
      let [G, Z] = B.split("=");
      return Q[G] = Z, Q
    }, {})
  }

  function Zq3(A) {
    let Q = {};
    return A.forEach((B, G) => {
      Q[G] = B
    }), Q
  }

  function Iq3(A) {
    let Q = A.getAllResponseHeaders();
    if (!Q) return {};
    return Q.split(`\r
`).reduce((B, G) => {
      let [Z, I] = G.split(": ");
      return B[Z] = I, B
    }, {})
  }

  function Yq3(A, Q) {
    return A.some((B) => {
      if (typeof B === "string") return Q.includes(B);
      return B.test(Q)
    })
  }

  function Jq3(A, Q) {
    return A.some((B) => {
      if (typeof B === "number") return B === Q;
      return Q >= B[0] && Q <= B[1]
    })
  }

  function Wq3(A, Q) {
    if (!Qx.supportsNativeFetch()) return;
    Qx.addFetchInstrumentationHandler((B) => {
      if (Mg.getClient() !== A) return;
      let {
        response: G,
        args: Z
      } = B, [I, Y] = Z;
      if (!G) return;
      Qq3(Q, I, G, Y)
    })
  }

  function Xq3(A, Q) {
    if (!("XMLHttpRequest" in Qx.GLOBAL_OBJ)) return;
    Qx.addXhrInstrumentationHandler((B) => {
      if (Mg.getClient() !== A) return;
      let G = B.xhr,
        Z = G[Qx.SENTRY_XHR_DATA_KEY];
      if (!Z) return;
      let {
        method: I,
        request_headers: Y
      } = Z;
      try {
        Bq3(Q, G, I, Y)
      } catch (J) {
        zZ1.DEBUG_BUILD && Qx.logger.warn("Error while extracting response event form XHR response", J)
      }
    })
  }

  function G19(A, Q, B) {
    return Jq3(A.failedRequestStatusCodes, Q) && Yq3(A.failedRequestTargets, B) && !Mg.isSentryRequestUrl(B, Mg.getClient())
  }

  function Z19(A) {
    let Q = `HTTP Client Error with status code: ${A.status}`,
      B = {
        message: Q,
        exception: {
          values: [{
            type: "Error",
            value: Q
          }]
        },
        request: {
          url: A.url,
          method: A.method,
          headers: A.requestHeaders,
          cookies: A.requestCookies
        },
        contexts: {
          response: {
            status_code: A.status,
            headers: A.responseHeaders,
            cookies: A.responseCookies,
            body_size: Gq3(A.responseHeaders)
          }
        }
      };
    return Qx.addExceptionMechanism(B, {
      type: "http.client",
      handled: !1
    }), B
  }

  function Vq3(A, Q) {
    if (!Q && A instanceof Request) return A;
    if (A instanceof Request && A.bodyUsed) return A;
    return new Request(A, Q)
  }

  function I19() {
    let A = Mg.getClient();
    return A ? Boolean(A.getOptions().sendDefaultPii) : !1
  }
  Y19.HttpClient = Aq3;
  Y19.httpClientIntegration = Q19
})
// @from(Start 13081336, End 13082599)
D19 = z((K19) => {
  Object.defineProperty(K19, "__esModule", {
    value: !0
  });
  var W19 = _4(),
    FJ0 = i0(),
    VJ0 = FJ0.GLOBAL_OBJ,
    Dq3 = 7,
    X19 = "ContextLines",
    Hq3 = (A = {}) => {
      let Q = A.frameContextLines != null ? A.frameContextLines : Dq3;
      return {
        name: X19,
        setupOnce() {},
        processEvent(B) {
          return Eq3(B, Q)
        }
      }
    },
    V19 = W19.defineIntegration(Hq3),
    Cq3 = W19.convertIntegrationFnToClass(X19, V19);

  function Eq3(A, Q) {
    let B = VJ0.document,
      G = VJ0.location && FJ0.stripUrlQueryAndFragment(VJ0.location.href);
    if (!B || !G) return A;
    let Z = A.exception && A.exception.values;
    if (!Z || !Z.length) return A;
    let I = B.documentElement.innerHTML;
    if (!I) return A;
    let Y = ["<!DOCTYPE html>", "<html>", ...I.split(`
`), "</html>"];
    return Z.forEach((J) => {
      let W = J.stacktrace;
      if (W && W.frames) W.frames = W.frames.map((X) => F19(X, Y, G, Q))
    }), A
  }

  function F19(A, Q, B, G) {
    if (A.filename !== B || !A.lineno || !Q.length) return A;
    return FJ0.addContextToFrame(Q, A, G), A
  }
  K19.ContextLines = Cq3;
  K19.applySourceContextToFrame = F19;
  K19.contextLinesIntegration = V19
})
// @from(Start 13082605, End 13083829)
M19 = z((L19) => {
  Object.defineProperty(L19, "__esModule", {
    value: !0
  });
  var H19 = WA9(),
    C19 = DA9(),
    E19 = MA9(),
    z19 = jA9(),
    wq3 = yA9(),
    U19 = gA9(),
    $19 = lA9(),
    w19 = rA9(),
    qq3 = eA9(),
    q19 = J19(),
    N19 = D19();
  L19.CaptureConsole = H19.CaptureConsole;
  L19.captureConsoleIntegration = H19.captureConsoleIntegration;
  L19.Debug = C19.Debug;
  L19.debugIntegration = C19.debugIntegration;
  L19.Dedupe = E19.Dedupe;
  L19.dedupeIntegration = E19.dedupeIntegration;
  L19.ExtraErrorData = z19.ExtraErrorData;
  L19.extraErrorDataIntegration = z19.extraErrorDataIntegration;
  L19.Offline = wq3.Offline;
  L19.ReportingObserver = U19.ReportingObserver;
  L19.reportingObserverIntegration = U19.reportingObserverIntegration;
  L19.RewriteFrames = $19.RewriteFrames;
  L19.rewriteFramesIntegration = $19.rewriteFramesIntegration;
  L19.SessionTiming = w19.SessionTiming;
  L19.sessionTimingIntegration = w19.sessionTimingIntegration;
  L19.Transaction = qq3.Transaction;
  L19.HttpClient = q19.HttpClient;
  L19.httpClientIntegration = q19.httpClientIntegration;
  L19.ContextLines = N19.ContextLines;
  L19.contextLinesIntegration = N19.contextLinesIntegration
})
// @from(Start 13083835, End 13084825)
UZ1 = z((O19) => {
  Object.defineProperty(O19, "__esModule", {
    value: !0
  });
  var dq3 = [
    ["january", "1"],
    ["february", "2"],
    ["march", "3"],
    ["april", "4"],
    ["may", "5"],
    ["june", "6"],
    ["july", "7"],
    ["august", "8"],
    ["september", "9"],
    ["october", "10"],
    ["november", "11"],
    ["december", "12"],
    ["jan", "1"],
    ["feb", "2"],
    ["mar", "3"],
    ["apr", "4"],
    ["may", "5"],
    ["jun", "6"],
    ["jul", "7"],
    ["aug", "8"],
    ["sep", "9"],
    ["oct", "10"],
    ["nov", "11"],
    ["dec", "12"],
    ["sunday", "0"],
    ["monday", "1"],
    ["tuesday", "2"],
    ["wednesday", "3"],
    ["thursday", "4"],
    ["friday", "5"],
    ["saturday", "6"],
    ["sun", "0"],
    ["mon", "1"],
    ["tue", "2"],
    ["wed", "3"],
    ["thu", "4"],
    ["fri", "5"],
    ["sat", "6"]
  ];

  function cq3(A) {
    return dq3.reduce((Q, [B, G]) => Q.replace(new RegExp(B, "gi"), G), A)
  }
  O19.replaceCronNames = cq3
})
// @from(Start 13084831, End 13086411)
S19 = z((j19) => {
  Object.defineProperty(j19, "__esModule", {
    value: !0
  });
  var R19 = _4(),
    T19 = UZ1(),
    P19 = "Automatic instrumentation of CronJob only supports crontab string";

  function lq3(A, Q) {
    let B = !1;
    return new Proxy(A, {
      construct(G, Z) {
        let [I, Y, J, W, X, ...V] = Z;
        if (typeof I !== "string") throw Error(P19);
        if (B) throw Error(`A job named '${Q}' has already been scheduled`);
        B = !0;
        let F = T19.replaceCronNames(I);

        function K(D, H) {
          return R19.withMonitor(Q, () => {
            return Y(D, H)
          }, {
            schedule: {
              type: "crontab",
              value: F
            },
            timezone: X || void 0
          })
        }
        return new G(I, K, J, W, X, ...V)
      },
      get(G, Z) {
        if (Z === "from") return (I) => {
          let {
            cronTime: Y,
            onTick: J,
            timeZone: W
          } = I;
          if (typeof Y !== "string") throw Error(P19);
          if (B) throw Error(`A job named '${Q}' has already been scheduled`);
          B = !0;
          let X = T19.replaceCronNames(Y);
          return I.onTick = (V, F) => {
            return R19.withMonitor(Q, () => {
              return J(V, F)
            }, {
              schedule: {
                type: "crontab",
                value: X
              },
              timezone: W || void 0
            })
          }, G.from(I)
        };
        else return G[Z]
      }
    })
  }
  j19.instrumentCron = lq3
})
// @from(Start 13086417, End 13087350)
y19 = z((k19) => {
  var {
    _optionalChain: _19
  } = i0();
  Object.defineProperty(k19, "__esModule", {
    value: !0
  });
  var nq3 = _4(),
    aq3 = UZ1();

  function sq3(A) {
    return new Proxy(A, {
      get(Q, B) {
        if (B === "schedule" && Q.schedule) return new Proxy(Q.schedule, {
          apply(G, Z, I) {
            let [Y, , J] = I;
            if (!_19([J, "optionalAccess", (W) => W.name])) throw Error('Missing "name" for scheduled job. A name is required for Sentry check-in monitoring.');
            return nq3.withMonitor(J.name, () => {
              return G.apply(Z, I)
            }, {
              schedule: {
                type: "crontab",
                value: aq3.replaceCronNames(Y)
              },
              timezone: _19([J, "optionalAccess", (W) => W.timezone])
            })
          }
        });
        else return Q[B]
      }
    })
  }
  k19.instrumentNodeCron = sq3
})
// @from(Start 13087356, End 13088284)
v19 = z((x19) => {
  Object.defineProperty(x19, "__esModule", {
    value: !0
  });
  var oq3 = _4(),
    tq3 = UZ1();

  function eq3(A) {
    return new Proxy(A, {
      get(Q, B) {
        if (B === "scheduleJob") return new Proxy(Q.scheduleJob, {
          apply(G, Z, I) {
            let [Y, J] = I;
            if (typeof Y !== "string" || typeof J !== "string") throw Error("Automatic instrumentation of 'node-schedule' requires the first parameter of 'scheduleJob' to be a job name string and the second parameter to be a crontab string");
            let W = Y,
              X = J;
            return oq3.withMonitor(W, () => {
              return G.apply(Z, I)
            }, {
              schedule: {
                type: "crontab",
                value: tq3.replaceCronNames(X)
              }
            })
          }
        });
        return Q[B]
      }
    })
  }
  x19.instrumentNodeSchedule = eq3
})
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