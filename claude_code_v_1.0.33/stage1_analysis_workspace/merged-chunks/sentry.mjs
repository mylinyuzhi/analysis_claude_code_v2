
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
// @from(Start 12572690, End 12579780)
JG1 = z((Fn2) => {
  Object.defineProperty(Fn2, "__esModule", {
    value: !0
  });
  var r0A = i0(),
    Wn2 = ZV(),
    wG3 = UPA(),
    Hg = $PA(),
    Xn2 = XXA(),
    HXA = E$(),
    qG3 = KXA();
  class Vn2 {
    constructor(A = 1000) {
      this._maxlen = A, this.spans = []
    }
    add(A) {
      if (this.spans.length > this._maxlen) A.spanRecorder = void 0;
      else this.spans.push(A)
    }
  }
  class cI0 {
    constructor(A = {}) {
      if (this._traceId = A.traceId || r0A.uuid4(), this._spanId = A.spanId || r0A.uuid4().substring(16), this._startTime = A.startTimestamp || r0A.timestampInSeconds(), this.tags = A.tags ? {
          ...A.tags
        } : {}, this.data = A.data ? {
          ...A.data
        } : {}, this.instrumenter = A.instrumenter || "sentry", this._attributes = {}, this.setAttributes({
          [Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: A.origin || "manual",
          [Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: A.op,
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
      return this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP]
    }
    set op(A) {
      this.setAttribute(Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP, A)
    }
    get origin() {
      return this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]
    }
    set origin(A) {
      this.setAttribute(Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, A)
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
        traceFlags: B ? HXA.TRACE_FLAG_SAMPLED : HXA.TRACE_FLAG_NONE
      }
    }
    startChild(A) {
      let Q = new cI0({
        ...A,
        parentSpanId: this._spanId,
        sampled: this._sampled,
        traceId: this._traceId
      });
      if (Q.spanRecorder = this.spanRecorder, Q.spanRecorder) Q.spanRecorder.add(Q);
      let B = Xn2.getRootSpan(this);
      if (Q.transaction = B, Wn2.DEBUG_BUILD && B) {
        let G = A && A.op || "< unknown op >",
          Z = HXA.spanToJSON(Q).description || "< unknown name >",
          I = B.spanContext().spanId,
          Y = `[Tracing] Starting '${G}' span on transaction '${Z}' (${I}).`;
        r0A.logger.log(Y), this._logMessage = Y
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
      return qG3.setHttpStatus(this, A), this
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
      let Q = Xn2.getRootSpan(this);
      if (Wn2.DEBUG_BUILD && Q && Q.spanContext().spanId !== this._spanId) {
        let B = this._logMessage;
        if (B) r0A.logger.log(B.replace("Starting", "Finishing"))
      }
      this._endTime = HXA.spanTimeInputToSeconds(A)
    }
    toTraceparent() {
      return HXA.spanToTraceHeader(this)
    }
    toContext() {
      return r0A.dropUndefinedKeys({
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
      return HXA.spanToTraceContext(this)
    }
    getSpanJSON() {
      return r0A.dropUndefinedKeys({
        data: this._getData(),
        description: this._name,
        op: this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP],
        parent_span_id: this._parentSpanId,
        span_id: this._spanId,
        start_timestamp: this._startTime,
        status: this._status,
        tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
        timestamp: this._endTime,
        trace_id: this._traceId,
        origin: this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
        _metrics_summary: wG3.getMetricSummaryJsonForSpan(this),
        profile_id: this._attributes[Hg.SEMANTIC_ATTRIBUTE_PROFILE_ID],
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
  Fn2.Span = cI0;
  Fn2.SpanRecorder = Vn2
})
// @from(Start 12579786, End 12584636)
VG1 = z((Cn2) => {
  Object.defineProperty(Cn2, "__esModule", {
    value: !0
  });
  var CXA = i0(),
    WG1 = ZV(),
    MG3 = py(),
    OG3 = UPA(),
    wPA = $PA(),
    XG1 = E$(),
    Kn2 = a0A(),
    Dn2 = JG1(),
    RG3 = YG1();
  class Hn2 extends Dn2.Span {
    constructor(A, Q) {
      super(A);
      this._contexts = {}, this._hub = Q || MG3.getCurrentHub(), this._name = A.name || "", this._metadata = {
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
        ...this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] && {
          source: this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]
        },
        ...this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] && {
          sampleRate: this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]
        }
      }
    }
    set metadata(A) {
      this._metadata = A
    }
    setName(A, Q = "custom") {
      this._name = A, this.setAttribute(wPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, Q)
    }
    updateName(A) {
      return this._name = A, this
    }
    initSpanRecorder(A = 1000) {
      if (!this.spanRecorder) this.spanRecorder = new Dn2.SpanRecorder(A);
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
      let Q = XG1.spanTimeInputToSeconds(A),
        B = this._finishTransaction(Q);
      if (!B) return;
      return this._hub.captureEvent(B)
    }
    toContext() {
      let A = super.toContext();
      return CXA.dropUndefinedKeys({
        ...A,
        name: this._name,
        trimEnd: this._trimEnd
      })
    }
    updateWithContext(A) {
      return super.updateWithContext(A), this._name = A.name || "", this._trimEnd = A.trimEnd, this
    }
    getDynamicSamplingContext() {
      return Kn2.getDynamicSamplingContextFromSpan(this)
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
      if (!this._name) WG1.DEBUG_BUILD && CXA.logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`."), this._name = "<unlabeled transaction>";
      super.end(A);
      let Q = this._hub.getClient();
      if (Q && Q.emit) Q.emit("finishTransaction", this);
      if (this._sampled !== !0) {
        if (WG1.DEBUG_BUILD && CXA.logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled."), Q) Q.recordDroppedEvent("sample_rate", "transaction");
        return
      }
      let B = this.spanRecorder ? this.spanRecorder.spans.filter((X) => X !== this && XG1.spanToJSON(X).timestamp) : [];
      if (this._trimEnd && B.length > 0) {
        let X = B.map((V) => XG1.spanToJSON(V).timestamp).filter(Boolean);
        this._endTime = X.reduce((V, F) => {
          return V > F ? V : F
        })
      }
      let {
        scope: G,
        isolationScope: Z
      } = RG3.getCapturedScopesOnSpan(this), {
        metadata: I
      } = this, {
        source: Y
      } = I, J = {
        contexts: {
          ...this._contexts,
          trace: XG1.spanToTraceContext(this)
        },
        spans: B,
        start_timestamp: this._startTime,
        tags: this.tags,
        timestamp: this._endTime,
        transaction: this._name,
        type: "transaction",
        sdkProcessingMetadata: {
          ...I,
          capturedSpanScope: G,
          capturedSpanIsolationScope: Z,
          ...CXA.dropUndefinedKeys({
            dynamicSamplingContext: Kn2.getDynamicSamplingContextFromSpan(this)
          })
        },
        _metrics_summary: OG3.getMetricSummaryJsonForSpan(this),
        ...Y && {
          transaction_info: {
            source: Y
          }
        }
      };
      if (Object.keys(this._measurements).length > 0) WG1.DEBUG_BUILD && CXA.logger.log("[Measurements] Adding measurements to transaction", JSON.stringify(this._measurements, void 0, 2)), J.measurements = this._measurements;
      return WG1.DEBUG_BUILD && CXA.logger.log(`[Tracing] Finishing ${this.op} transaction: ${this._name}.`), J
    }
  }
  Cn2.Transaction = Hn2
})
// @from(Start 12584642, End 12591313)
lI0 = z((zn2) => {
  Object.defineProperty(zn2, "__esModule", {
    value: !0
  });
  var UC = i0(),
    z$ = ZV(),
    FG1 = E$(),
    PG3 = JG1(),
    jG3 = VG1(),
    KG1 = {
      idleTimeout: 1000,
      finalTimeout: 30000,
      heartbeatInterval: 5000
    },
    SG3 = "finishReason",
    EXA = ["heartbeatFailed", "idleTimeout", "documentHidden", "finalTimeout", "externalFinish", "cancelled"];
  class pI0 extends PG3.SpanRecorder {
    constructor(A, Q, B, G) {
      super(G);
      this._pushActivity = A, this._popActivity = Q, this.transactionSpanId = B
    }
    add(A) {
      if (A.spanContext().spanId !== this.transactionSpanId) {
        let Q = A.end;
        if (A.end = (...B) => {
            return this._popActivity(A.spanContext().spanId), Q.apply(A, B)
          }, FG1.spanToJSON(A).timestamp === void 0) this._pushActivity(A.spanContext().spanId)
      }
      super.add(A)
    }
  }
  class En2 extends jG3.Transaction {
    constructor(A, Q, B = KG1.idleTimeout, G = KG1.finalTimeout, Z = KG1.heartbeatInterval, I = !1, Y = !1) {
      super(A, Q);
      if (this._idleHub = Q, this._idleTimeout = B, this._finalTimeout = G, this._heartbeatInterval = Z, this._onScope = I, this.activities = {}, this._heartbeatCounter = 0, this._finished = !1, this._idleTimeoutCanceledPermanently = !1, this._beforeFinishCallbacks = [], this._finishReason = EXA[4], this._autoFinishAllowed = !Y, I) z$.DEBUG_BUILD && UC.logger.log(`Setting idle transaction on scope. Span ID: ${this.spanContext().spanId}`), Q.getScope().setSpan(this);
      if (!Y) this._restartIdleTimeout();
      setTimeout(() => {
        if (!this._finished) this.setStatus("deadline_exceeded"), this._finishReason = EXA[3], this.end()
      }, this._finalTimeout)
    }
    end(A) {
      let Q = FG1.spanTimeInputToSeconds(A);
      if (this._finished = !0, this.activities = {}, this.op === "ui.action.click") this.setAttribute(SG3, this._finishReason);
      if (this.spanRecorder) {
        z$.DEBUG_BUILD && UC.logger.log("[Tracing] finishing IdleTransaction", new Date(Q * 1000).toISOString(), this.op);
        for (let B of this._beforeFinishCallbacks) B(this, Q);
        this.spanRecorder.spans = this.spanRecorder.spans.filter((B) => {
          if (B.spanContext().spanId === this.spanContext().spanId) return !0;
          if (!FG1.spanToJSON(B).timestamp) B.setStatus("cancelled"), B.end(Q), z$.DEBUG_BUILD && UC.logger.log("[Tracing] cancelling span since transaction ended early", JSON.stringify(B, void 0, 2));
          let {
            start_timestamp: G,
            timestamp: Z
          } = FG1.spanToJSON(B), I = G && G < Q, Y = (this._finalTimeout + this._idleTimeout) / 1000, J = Z && G && Z - G < Y;
          if (z$.DEBUG_BUILD) {
            let W = JSON.stringify(B, void 0, 2);
            if (!I) UC.logger.log("[Tracing] discarding Span since it happened after Transaction was finished", W);
            else if (!J) UC.logger.log("[Tracing] discarding Span since it finished after Transaction final timeout", W)
          }
          return I && J
        }), z$.DEBUG_BUILD && UC.logger.log("[Tracing] flushing IdleTransaction")
      } else z$.DEBUG_BUILD && UC.logger.log("[Tracing] No active IdleTransaction");
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
        this.spanRecorder = new pI0(Q, B, this.spanContext().spanId, A), z$.DEBUG_BUILD && UC.logger.log("Starting heartbeat"), this._pingHeartbeat()
      }
      this.spanRecorder.add(this)
    }
    cancelIdleTimeout(A, {
      restartOnChildSpanChange: Q
    } = {
      restartOnChildSpanChange: !0
    }) {
      if (this._idleTimeoutCanceledPermanently = Q === !1, this._idleTimeoutID) {
        if (clearTimeout(this._idleTimeoutID), this._idleTimeoutID = void 0, Object.keys(this.activities).length === 0 && this._idleTimeoutCanceledPermanently) this._finishReason = EXA[5], this.end(A)
      }
    }
    setFinishReason(A) {
      this._finishReason = A
    }
    sendAutoFinishSignal() {
      if (!this._autoFinishAllowed) z$.DEBUG_BUILD && UC.logger.log("[Tracing] Received finish signal for idle transaction."), this._restartIdleTimeout(), this._autoFinishAllowed = !0
    }
    _restartIdleTimeout(A) {
      this.cancelIdleTimeout(), this._idleTimeoutID = setTimeout(() => {
        if (!this._finished && Object.keys(this.activities).length === 0) this._finishReason = EXA[1], this.end(A)
      }, this._idleTimeout)
    }
    _pushActivity(A) {
      this.cancelIdleTimeout(void 0, {
        restartOnChildSpanChange: !this._idleTimeoutCanceledPermanently
      }), z$.DEBUG_BUILD && UC.logger.log(`[Tracing] pushActivity: ${A}`), this.activities[A] = !0, z$.DEBUG_BUILD && UC.logger.log("[Tracing] new activities count", Object.keys(this.activities).length)
    }
    _popActivity(A) {
      if (this.activities[A]) z$.DEBUG_BUILD && UC.logger.log(`[Tracing] popActivity ${A}`), delete this.activities[A], z$.DEBUG_BUILD && UC.logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
      if (Object.keys(this.activities).length === 0) {
        let Q = UC.timestampInSeconds();
        if (this._idleTimeoutCanceledPermanently) {
          if (this._autoFinishAllowed) this._finishReason = EXA[5], this.end(Q)
        } else this._restartIdleTimeout(Q + this._idleTimeout / 1000)
      }
    }
    _beat() {
      if (this._finished) return;
      let A = Object.keys(this.activities).join("");
      if (A === this._prevHeartbeatString) this._heartbeatCounter++;
      else this._heartbeatCounter = 1;
      if (this._prevHeartbeatString = A, this._heartbeatCounter >= 3) {
        if (this._autoFinishAllowed) z$.DEBUG_BUILD && UC.logger.log("[Tracing] Transaction finished because of no change for 3 heart beats"), this.setStatus("deadline_exceeded"), this._finishReason = EXA[0], this.end()
      } else this._pingHeartbeat()
    }
    _pingHeartbeat() {
      z$.DEBUG_BUILD && UC.logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`), setTimeout(() => {
        this._beat()
      }, this._heartbeatInterval)
    }
  }
  zn2.IdleTransaction = En2;
  zn2.IdleTransactionSpanRecorder = pI0;
  zn2.TRACING_DEFAULTS = KG1
})
// @from(Start 12591319, End 12593430)
iI0 = z(($n2) => {
  Object.defineProperty($n2, "__esModule", {
    value: !0
  });
  var o0A = i0(),
    zXA = ZV(),
    DG1 = $PA(),
    xG3 = BG1(),
    vG3 = E$();

  function bG3(A, Q, B) {
    if (!xG3.hasTracingEnabled(Q)) return A.sampled = !1, A;
    if (A.sampled !== void 0) return A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(A.sampled)), A;
    let G;
    if (typeof Q.tracesSampler === "function") G = Q.tracesSampler(B), A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(G));
    else if (B.parentSampled !== void 0) G = B.parentSampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate, A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(G));
    else G = 1, A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, G);
    if (!Un2(G)) return zXA.DEBUG_BUILD && o0A.logger.warn("[Tracing] Discarding transaction because of invalid sample rate."), A.sampled = !1, A;
    if (!G) return zXA.DEBUG_BUILD && o0A.logger.log(`[Tracing] Discarding transaction because ${typeof Q.tracesSampler==="function"?"tracesSampler returned 0 or false":"a negative sampling decision was inherited or tracesSampleRate is set to 0"}`), A.sampled = !1, A;
    if (A.sampled = Math.random() < G, !A.sampled) return zXA.DEBUG_BUILD && o0A.logger.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(G)})`), A;
    return zXA.DEBUG_BUILD && o0A.logger.log(`[Tracing] starting ${A.op} transaction - ${vG3.spanToJSON(A).description}`), A
  }

  function Un2(A) {
    if (o0A.isNaN(A) || !(typeof A === "number" || typeof A === "boolean")) return zXA.DEBUG_BUILD && o0A.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(A)} of type ${JSON.stringify(typeof A)}.`), !1;
    if (A < 0 || A > 1) return zXA.DEBUG_BUILD && o0A.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${A}.`), !1;
    return !0
  }
  $n2.isValidSampleRate = Un2;
  $n2.sampleTransaction = bG3
})
// @from(Start 12593436, End 12595667)
nI0 = z((qn2) => {
  Object.defineProperty(qn2, "__esModule", {
    value: !0
  });
  var gG3 = i0(),
    uG3 = ZV(),
    mG3 = py(),
    dG3 = E$(),
    cG3 = QG1(),
    pG3 = lI0(),
    wn2 = iI0(),
    lG3 = VG1();

  function iG3() {
    let Q = this.getScope().getSpan();
    return Q ? {
      "sentry-trace": dG3.spanToTraceHeader(Q)
    } : {}
  }

  function nG3(A, Q) {
    let B = this.getClient(),
      G = B && B.getOptions() || {},
      Z = G.instrumenter || "sentry",
      I = A.instrumenter || "sentry";
    if (Z !== I) uG3.DEBUG_BUILD && gG3.logger.error(`A transaction was started with instrumenter=\`${I}\`, but the SDK is configured with the \`${Z}\` instrumenter.
The transaction will not be sampled. Please use the ${Z} instrumentation to start transactions.`), A.sampled = !1;
    let Y = new lG3.Transaction(A, this);
    if (Y = wn2.sampleTransaction(Y, G, {
        name: A.name,
        parentSampled: A.parentSampled,
        transactionContext: A,
        attributes: {
          ...A.data,
          ...A.attributes
        },
        ...Q
      }), Y.isRecording()) Y.initSpanRecorder(G._experiments && G._experiments.maxSpans);
    if (B && B.emit) B.emit("startTransaction", Y);
    return Y
  }

  function aG3(A, Q, B, G, Z, I, Y, J = !1) {
    let W = A.getClient(),
      X = W && W.getOptions() || {},
      V = new pG3.IdleTransaction(Q, A, B, G, Y, Z, J);
    if (V = wn2.sampleTransaction(V, X, {
        name: Q.name,
        parentSampled: Q.parentSampled,
        transactionContext: Q,
        attributes: {
          ...Q.data,
          ...Q.attributes
        },
        ...I
      }), V.isRecording()) V.initSpanRecorder(X._experiments && X._experiments.maxSpans);
    if (W && W.emit) W.emit("startTransaction", V);
    return V
  }

  function sG3() {
    let A = mG3.getMainCarrier();
    if (!A.__SENTRY__) return;
    if (A.__SENTRY__.extensions = A.__SENTRY__.extensions || {}, !A.__SENTRY__.extensions.startTransaction) A.__SENTRY__.extensions.startTransaction = nG3;
    if (!A.__SENTRY__.extensions.traceHeaders) A.__SENTRY__.extensions.traceHeaders = iG3;
    cG3.registerErrorInstrumentation()
  }
  qn2.addTracingExtensions = sG3;
  qn2.startIdleTransaction = aG3
})
// @from(Start 12595673, End 12595913)
Ln2 = z((Nn2) => {
  Object.defineProperty(Nn2, "__esModule", {
    value: !0
  });
  var tG3 = AG1();

  function eG3(A, Q, B) {
    let G = tG3.getActiveTransaction();
    if (G) G.setMeasurement(A, Q, B)
  }
  Nn2.setMeasurement = eG3
})
// @from(Start 12595919, End 12597165)
aI0 = z((Mn2) => {
  Object.defineProperty(Mn2, "__esModule", {
    value: !0
  });
  var UXA = i0();

  function QZ3(A, Q) {
    if (!Q) return A;
    return A.sdk = A.sdk || {}, A.sdk.name = A.sdk.name || Q.name, A.sdk.version = A.sdk.version || Q.version, A.sdk.integrations = [...A.sdk.integrations || [], ...Q.integrations || []], A.sdk.packages = [...A.sdk.packages || [], ...Q.packages || []], A
  }

  function BZ3(A, Q, B, G) {
    let Z = UXA.getSdkMetadataForEnvelopeHeader(B),
      I = {
        sent_at: new Date().toISOString(),
        ...Z && {
          sdk: Z
        },
        ...!!G && Q && {
          dsn: UXA.dsnToString(Q)
        }
      },
      Y = "aggregates" in A ? [{
        type: "sessions"
      }, A] : [{
        type: "session"
      }, A.toJSON()];
    return UXA.createEnvelope(I, [Y])
  }

  function GZ3(A, Q, B, G) {
    let Z = UXA.getSdkMetadataForEnvelopeHeader(B),
      I = A.type && A.type !== "replay_event" ? A.type : "event";
    QZ3(A, B && B.sdk);
    let Y = UXA.createEventEnvelopeHeaders(A, Z, G, Q);
    delete A.sdkProcessingMetadata;
    let J = [{
      type: I
    }, A];
    return UXA.createEnvelope(Y, [J])
  }
  Mn2.createEventEnvelope = GZ3;
  Mn2.createSessionEnvelope = BZ3
})
// @from(Start 12597171, End 12598972)
sI0 = z((Rn2) => {
  Object.defineProperty(Rn2, "__esModule", {
    value: !0
  });
  var YZ3 = i0(),
    JZ3 = jO();
  class On2 {
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
      return YZ3.dropUndefinedKeys(Q)
    }
    close() {
      clearInterval(this._intervalId), this._isEnabled = !1, this.flush()
    }
    incrementSessionStatusCount() {
      if (!this._isEnabled) return;
      let A = JZ3.getCurrentScope(),
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
  Rn2.SessionFlusher = On2
})
// @from(Start 12598978, End 12600386)
HG1 = z((Pn2) => {
  Object.defineProperty(Pn2, "__esModule", {
    value: !0
  });
  var rI0 = i0(),
    XZ3 = "7";

  function Tn2(A) {
    let Q = A.protocol ? `${A.protocol}:` : "",
      B = A.port ? `:${A.port}` : "";
    return `${Q}//${A.host}${B}${A.path?`/${A.path}`:""}/api/`
  }

  function VZ3(A) {
    return `${Tn2(A)}${A.projectId}/envelope/`
  }

  function FZ3(A, Q) {
    return rI0.urlEncode({
      sentry_key: A.publicKey,
      sentry_version: XZ3,
      ...Q && {
        sentry_client: `${Q.name}/${Q.version}`
      }
    })
  }

  function KZ3(A, Q = {}) {
    let B = typeof Q === "string" ? Q : Q.tunnel,
      G = typeof Q === "string" || !Q._metadata ? void 0 : Q._metadata.sdk;
    return B ? B : `${VZ3(A)}?${FZ3(A,G)}`
  }

  function DZ3(A, Q) {
    let B = rI0.makeDsn(A);
    if (!B) return "";
    let G = `${Tn2(B)}embed/error-page/`,
      Z = `dsn=${rI0.dsnToString(B)}`;
    for (let I in Q) {
      if (I === "dsn") continue;
      if (I === "onClose") continue;
      if (I === "user") {
        let Y = Q.user;
        if (!Y) continue;
        if (Y.name) Z += `&name=${encodeURIComponent(Y.name)}`;
        if (Y.email) Z += `&email=${encodeURIComponent(Y.email)}`
      } else Z += `&${encodeURIComponent(I)}=${encodeURIComponent(Q[I])}`
    }
    return `${G}?${Z}`
  }
  Pn2.getEnvelopeEndpointWithUrlEncodedAuth = KZ3;
  Pn2.getReportDialogEndpoint = DZ3
})
// @from(Start 12600392, End 12603087)
Cg = z((Sn2) => {
  Object.defineProperty(Sn2, "__esModule", {
    value: !0
  });
  var CG1 = i0(),
    oI0 = ZV(),
    EZ3 = VPA(),
    zZ3 = jO(),
    UZ3 = py(),
    tI0 = [];

  function $Z3(A) {
    let Q = {};
    return A.forEach((B) => {
      let {
        name: G
      } = B, Z = Q[G];
      if (Z && !Z.isDefaultInstance && B.isDefaultInstance) return;
      Q[G] = B
    }), Object.keys(Q).map((B) => Q[B])
  }

  function wZ3(A) {
    let Q = A.defaultIntegrations || [],
      B = A.integrations;
    Q.forEach((Y) => {
      Y.isDefaultInstance = !0
    });
    let G;
    if (Array.isArray(B)) G = [...Q, ...B];
    else if (typeof B === "function") G = CG1.arrayify(B(Q));
    else G = Q;
    let Z = $Z3(G),
      I = MZ3(Z, (Y) => Y.name === "Debug");
    if (I !== -1) {
      let [Y] = Z.splice(I, 1);
      Z.push(Y)
    }
    return Z
  }

  function qZ3(A, Q) {
    let B = {};
    return Q.forEach((G) => {
      if (G) jn2(A, G, B)
    }), B
  }

  function NZ3(A, Q) {
    for (let B of Q)
      if (B && B.afterAllSetup) B.afterAllSetup(A)
  }

  function jn2(A, Q, B) {
    if (B[Q.name]) {
      oI0.DEBUG_BUILD && CG1.logger.log(`Integration skipped because it was already installed: ${Q.name}`);
      return
    }
    if (B[Q.name] = Q, tI0.indexOf(Q.name) === -1) Q.setupOnce(EZ3.addGlobalEventProcessor, UZ3.getCurrentHub), tI0.push(Q.name);
    if (Q.setup && typeof Q.setup === "function") Q.setup(A);
    if (A.on && typeof Q.preprocessEvent === "function") {
      let G = Q.preprocessEvent.bind(Q);
      A.on("preprocessEvent", (Z, I) => G(Z, I, A))
    }
    if (A.addEventProcessor && typeof Q.processEvent === "function") {
      let G = Q.processEvent.bind(Q),
        Z = Object.assign((I, Y) => G(I, Y, A), {
          id: Q.name
        });
      A.addEventProcessor(Z)
    }
    oI0.DEBUG_BUILD && CG1.logger.log(`Integration installed: ${Q.name}`)
  }

  function LZ3(A) {
    let Q = zZ3.getClient();
    if (!Q || !Q.addIntegration) {
      oI0.DEBUG_BUILD && CG1.logger.warn(`Cannot add integration "${A.name}" because no SDK Client is available.`);
      return
    }
    Q.addIntegration(A)
  }

  function MZ3(A, Q) {
    for (let B = 0; B < A.length; B++)
      if (Q(A[B]) === !0) return B;
    return -1
  }

  function OZ3(A, Q) {
    return Object.assign(function(...G) {
      return Q(...G)
    }, {
      id: A
    })
  }

  function RZ3(A) {
    return A
  }
  Sn2.addIntegration = LZ3;
  Sn2.afterSetupIntegrations = NZ3;
  Sn2.convertIntegrationFnToClass = OZ3;
  Sn2.defineIntegration = RZ3;
  Sn2.getIntegrationsToSetup = wZ3;
  Sn2.installedIntegrations = tI0;
  Sn2.setupIntegration = jn2;
  Sn2.setupIntegrations = qZ3
})
// @from(Start 12603093, End 12604673)
qPA = z((_n2) => {
  Object.defineProperty(_n2, "__esModule", {
    value: !0
  });
  var vZ3 = i0();

  function bZ3(A, Q, B, G) {
    let Z = Object.entries(vZ3.dropUndefinedKeys(G)).sort((I, Y) => I[0].localeCompare(Y[0]));
    return `${A}${Q}${B}${Z}`
  }

  function fZ3(A) {
    let Q = 0;
    for (let B = 0; B < A.length; B++) {
      let G = A.charCodeAt(B);
      Q = (Q << 5) - Q + G, Q &= Q
    }
    return Q >>> 0
  }

  function hZ3(A) {
    let Q = "";
    for (let B of A) {
      let G = Object.entries(B.tags),
        Z = G.length > 0 ? `|#${G.map(([I,Y])=>`${I}:${Y}`).join(",")}` : "";
      Q += `${B.name}@${B.unit}:${B.metric}|${B.metricType}${Z}|T${B.timestamp}
`
    }
    return Q
  }

  function gZ3(A) {
    return A.replace(/[^\w]+/gi, "_")
  }

  function uZ3(A) {
    return A.replace(/[^\w\-.]+/gi, "_")
  }

  function mZ3(A) {
    return A.replace(/[^\w\-./]+/gi, "")
  }
  var dZ3 = [
    [`
`, "\\n"],
    ["\r", "\\r"],
    ["\t", "\\t"],
    ["\\", "\\\\"],
    ["|", "\\u{7c}"],
    [",", "\\u{2c}"]
  ];

  function cZ3(A) {
    for (let [Q, B] of dZ3)
      if (A === Q) return B;
    return A
  }

  function pZ3(A) {
    return [...A].reduce((Q, B) => Q + cZ3(B), "")
  }

  function lZ3(A) {
    let Q = {};
    for (let B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) {
        let G = mZ3(B);
        Q[G] = pZ3(String(A[B]))
      } return Q
  }
  _n2.getBucketKey = bZ3;
  _n2.sanitizeMetricKey = uZ3;
  _n2.sanitizeTags = lZ3;
  _n2.sanitizeUnit = gZ3;
  _n2.serializeMetricBuckets = hZ3;
  _n2.simpleHash = fZ3
})
// @from(Start 12604679, End 12605259)
xn2 = z((yn2) => {
  Object.defineProperty(yn2, "__esModule", {
    value: !0
  });
  var kn2 = i0(),
    tZ3 = qPA();

  function eZ3(A, Q, B, G) {
    let Z = {
      sent_at: new Date().toISOString()
    };
    if (B && B.sdk) Z.sdk = {
      name: B.sdk.name,
      version: B.sdk.version
    };
    if (!!G && Q) Z.dsn = kn2.dsnToString(Q);
    let I = AI3(A);
    return kn2.createEnvelope(Z, [I])
  }

  function AI3(A) {
    let Q = tZ3.serializeMetricBuckets(A);
    return [{
      type: "statsd",
      length: Q.length
    }, Q]
  }
  yn2.createMetricEnvelope = eZ3
})
// @from(Start 12605265, End 12617233)
eI0 = z((mn2) => {
  Object.defineProperty(mn2, "__esModule", {
    value: !0
  });
  var V7 = i0(),
    BI3 = HG1(),
    iy = ZV(),
    vn2 = aI0(),
    GI3 = jO(),
    ZI3 = py(),
    EG1 = Cg(),
    II3 = xn2(),
    bn2 = WXA(),
    YI3 = a0A(),
    JI3 = i71(),
    fn2 = "Not capturing exception because it's already been captured.";
  class hn2 {
    constructor(A) {
      if (this._options = A, this._integrations = {}, this._integrationsInitialized = !1, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], A.dsn) this._dsn = V7.makeDsn(A.dsn);
      else iy.DEBUG_BUILD && V7.logger.warn("No DSN provided, client will not send events.");
      if (this._dsn) {
        let Q = BI3.getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, A);
        this._transport = A.transport({
          tunnel: this._options.tunnel,
          recordDroppedEvent: this.recordDroppedEvent.bind(this),
          ...A.transportOptions,
          url: Q
        })
      }
    }
    captureException(A, Q, B) {
      if (V7.checkOrSetAlreadyCaught(A)) {
        iy.DEBUG_BUILD && V7.logger.log(fn2);
        return
      }
      let G = Q && Q.event_id;
      return this._process(this.eventFromException(A, Q).then((Z) => this._captureEvent(Z, Q, B)).then((Z) => {
        G = Z
      })), G
    }
    captureMessage(A, Q, B, G) {
      let Z = B && B.event_id,
        I = V7.isParameterizedString(A) ? A : String(A),
        Y = V7.isPrimitive(A) ? this.eventFromMessage(I, Q, B) : this.eventFromException(A, B);
      return this._process(Y.then((J) => this._captureEvent(J, B, G)).then((J) => {
        Z = J
      })), Z
    }
    captureEvent(A, Q, B) {
      if (Q && Q.originalException && V7.checkOrSetAlreadyCaught(Q.originalException)) {
        iy.DEBUG_BUILD && V7.logger.log(fn2);
        return
      }
      let G = Q && Q.event_id,
        I = (A.sdkProcessingMetadata || {}).capturedSpanScope;
      return this._process(this._captureEvent(A, Q, I || B).then((Y) => {
        G = Y
      })), G
    }
    captureSession(A) {
      if (typeof A.release !== "string") iy.DEBUG_BUILD && V7.logger.warn("Discarded session because of missing or non-string release");
      else this.sendSession(A), bn2.updateSession(A, {
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
      } else return V7.resolvedSyncPromise(!0)
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
        return iy.DEBUG_BUILD && V7.logger.warn(`Cannot retrieve integration ${A.id} from the current Client`), null
      }
    }
    addIntegration(A) {
      let Q = this._integrations[A.name];
      if (EG1.setupIntegration(this, A, this._integrations), !Q) EG1.afterSetupIntegrations(this, [A])
    }
    sendEvent(A, Q = {}) {
      this.emit("beforeSendEvent", A, Q);
      let B = vn2.createEventEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      for (let Z of Q.attachments || []) B = V7.addItemToEnvelope(B, V7.createAttachmentEnvelopeItem(Z, this._options.transportOptions && this._options.transportOptions.textEncoder));
      let G = this._sendEnvelope(B);
      if (G) G.then((Z) => this.emit("afterSendEvent", A, Z), null)
    }
    sendSession(A) {
      let Q = vn2.createSessionEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(Q)
    }
    recordDroppedEvent(A, Q, B) {
      if (this._options.sendClientReports) {
        let G = typeof B === "number" ? B : 1,
          Z = `${A}:${Q}`;
        iy.DEBUG_BUILD && V7.logger.log(`Recording outcome: "${Z}"${G>1?` (${G} times)`:""}`), this._outcomes[Z] = (this._outcomes[Z] || 0) + G
      }
    }
    captureAggregateMetrics(A) {
      iy.DEBUG_BUILD && V7.logger.log(`Flushing aggregated metrics, number of metrics: ${A.length}`);
      let Q = II3.createMetricEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
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
      this._integrations = EG1.setupIntegrations(this, A), EG1.afterSetupIntegrations(this, A), this._integrationsInitialized = !0
    }
    _updateSessionFromEvent(A, Q) {
      let B = !1,
        G = !1,
        Z = Q.exception && Q.exception.values;
      if (Z) {
        G = !0;
        for (let J of Z) {
          let W = J.mechanism;
          if (W && W.handled === !1) {
            B = !0;
            break
          }
        }
      }
      let I = A.status === "ok";
      if (I && A.errors === 0 || I && B) bn2.updateSession(A, {
        ...B && {
          status: "crashed"
        },
        errors: A.errors || Number(G || B)
      }), this.captureSession(A)
    }
    _isClientDoneProcessing(A) {
      return new V7.SyncPromise((Q) => {
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
    _prepareEvent(A, Q, B, G = ZI3.getIsolationScope()) {
      let Z = this.getOptions(),
        I = Object.keys(this._integrations);
      if (!Q.integrations && I.length > 0) Q.integrations = I;
      return this.emit("preprocessEvent", A, Q), JI3.prepareEvent(Z, A, Q, B, this, G).then((Y) => {
        if (Y === null) return Y;
        let J = {
          ...G.getPropagationContext(),
          ...B ? B.getPropagationContext() : void 0
        };
        if (!(Y.contexts && Y.contexts.trace) && J) {
          let {
            traceId: X,
            spanId: V,
            parentSpanId: F,
            dsc: K
          } = J;
          Y.contexts = {
            trace: {
              trace_id: X,
              span_id: V,
              parent_span_id: F
            },
            ...Y.contexts
          };
          let D = K ? K : YI3.getDynamicSamplingContextFromClient(X, this, B);
          Y.sdkProcessingMetadata = {
            dynamicSamplingContext: D,
            ...Y.sdkProcessingMetadata
          }
        }
        return Y
      })
    }
    _captureEvent(A, Q = {}, B) {
      return this._processEvent(A, Q, B).then((G) => {
        return G.event_id
      }, (G) => {
        if (iy.DEBUG_BUILD) {
          let Z = G;
          if (Z.logLevel === "log") V7.logger.log(Z.message);
          else V7.logger.warn(Z)
        }
        return
      })
    }
    _processEvent(A, Q, B) {
      let G = this.getOptions(),
        {
          sampleRate: Z
        } = G,
        I = un2(A),
        Y = gn2(A),
        J = A.type || "error",
        W = `before send for type \`${J}\``;
      if (Y && typeof Z === "number" && Math.random() > Z) return this.recordDroppedEvent("sample_rate", "error", A), V7.rejectedSyncPromise(new V7.SentryError(`Discarding event because it's not included in the random sample (sampling rate = ${Z})`, "log"));
      let X = J === "replay_event" ? "replay" : J,
        F = (A.sdkProcessingMetadata || {}).capturedSpanIsolationScope;
      return this._prepareEvent(A, Q, B, F).then((K) => {
        if (K === null) throw this.recordDroppedEvent("event_processor", X, A), new V7.SentryError("An event processor returned `null`, will not send event.", "log");
        if (Q.data && Q.data.__sentry__ === !0) return K;
        let H = XI3(G, K, Q);
        return WI3(H, W)
      }).then((K) => {
        if (K === null) {
          if (this.recordDroppedEvent("before_send", X, A), I) {
            let E = 1 + (A.spans || []).length;
            this.recordDroppedEvent("before_send", "span", E)
          }
          throw new V7.SentryError(`${W} returned \`null\`, will not send event.`, "log")
        }
        let D = B && B.getSession();
        if (!I && D) this._updateSessionFromEvent(D, K);
        if (I) {
          let C = K.sdkProcessingMetadata && K.sdkProcessingMetadata.spanCountBeforeProcessing || 0,
            E = K.spans ? K.spans.length : 0,
            U = C - E;
          if (U > 0) this.recordDroppedEvent("before_send", "span", U)
        }
        let H = K.transaction_info;
        if (I && H && K.transaction !== A.transaction) K.transaction_info = {
          ...H,
          source: "custom"
        };
        return this.sendEvent(K, Q), K
      }).then(null, (K) => {
        if (K instanceof V7.SentryError) throw K;
        throw this.captureException(K, {
          data: {
            __sentry__: !0
          },
          originalException: K
        }), new V7.SentryError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${K}`)
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
        iy.DEBUG_BUILD && V7.logger.error("Error while sending event:", Q)
      });
      else iy.DEBUG_BUILD && V7.logger.error("Transport disabled")
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

  function WI3(A, Q) {
    let B = `${Q} must return \`null\` or a valid event.`;
    if (V7.isThenable(A)) return A.then((G) => {
      if (!V7.isPlainObject(G) && G !== null) throw new V7.SentryError(B);
      return G
    }, (G) => {
      throw new V7.SentryError(`${Q} rejected with ${G}`)
    });
    else if (!V7.isPlainObject(A) && A !== null) throw new V7.SentryError(B);
    return A
  }

  function XI3(A, Q, B) {
    let {
      beforeSend: G,
      beforeSendTransaction: Z
    } = A;
    if (gn2(Q) && G) return G(Q, B);
    if (un2(Q) && Z) {
      if (Q.spans) {
        let I = Q.spans.length;
        Q.sdkProcessingMetadata = {
          ...Q.sdkProcessingMetadata,
          spanCountBeforeProcessing: I
        }
      }
      return Z(Q, B)
    }
    return Q
  }

  function gn2(A) {
    return A.type === void 0
  }

  function un2(A) {
    return A.type === "transaction"
  }

  function VI3(A) {
    let Q = GI3.getClient();
    if (!Q || !Q.addEventProcessor) return;
    Q.addEventProcessor(A)
  }
  mn2.BaseClient = hn2;
  mn2.addEventProcessor = VI3
})
// @from(Start 12617239, End 12617790)
QY0 = z((dn2) => {
  Object.defineProperty(dn2, "__esModule", {
    value: !0
  });
  var AY0 = i0();

  function DI3(A, Q, B, G, Z) {
    let I = {
      sent_at: new Date().toISOString()
    };
    if (B && B.sdk) I.sdk = {
      name: B.sdk.name,
      version: B.sdk.version
    };
    if (!!G && !!Z) I.dsn = AY0.dsnToString(Z);
    if (Q) I.trace = AY0.dropUndefinedKeys(Q);
    let Y = HI3(A);
    return AY0.createEnvelope(I, [Y])
  }

  function HI3(A) {
    return [{
      type: "check_in"
    }, A]
  }
  dn2.createCheckInEnvelope = DI3
})
// @from(Start 12617796, End 12618224)
NPA = z((cn2) => {
  Object.defineProperty(cn2, "__esModule", {
    value: !0
  });
  var EI3 = "c",
    zI3 = "g",
    UI3 = "s",
    $I3 = "d",
    wI3 = 5000,
    qI3 = 1e4,
    NI3 = 1e4;
  cn2.COUNTER_METRIC_TYPE = EI3;
  cn2.DEFAULT_BROWSER_FLUSH_INTERVAL = wI3;
  cn2.DEFAULT_FLUSH_INTERVAL = qI3;
  cn2.DISTRIBUTION_METRIC_TYPE = $I3;
  cn2.GAUGE_METRIC_TYPE = zI3;
  cn2.MAX_WEIGHT = NI3;
  cn2.SET_METRIC_TYPE = UI3
})
// @from(Start 12618230, End 12619820)
YY0 = z((pn2) => {
  Object.defineProperty(pn2, "__esModule", {
    value: !0
  });
  var zG1 = NPA(),
    SI3 = qPA();
  class BY0 {
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
  class GY0 {
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
  class ZY0 {
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
  class IY0 {
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
      return Array.from(this._value).map((A) => typeof A === "string" ? SI3.simpleHash(A) : A).join(":")
    }
  }
  var _I3 = {
    [zG1.COUNTER_METRIC_TYPE]: BY0,
    [zG1.GAUGE_METRIC_TYPE]: GY0,
    [zG1.DISTRIBUTION_METRIC_TYPE]: ZY0,
    [zG1.SET_METRIC_TYPE]: IY0
  };
  pn2.CounterMetric = BY0;
  pn2.DistributionMetric = ZY0;
  pn2.GaugeMetric = GY0;
  pn2.METRIC_MAP = _I3;
  pn2.SetMetric = IY0
})
// @from(Start 12619826, End 12622126)
an2 = z((nn2) => {
  Object.defineProperty(nn2, "__esModule", {
    value: !0
  });
  var ln2 = i0(),
    LPA = NPA(),
    fI3 = YY0(),
    hI3 = UPA(),
    UG1 = qPA();
  class in2 {
    constructor(A) {
      if (this._client = A, this._buckets = new Map, this._bucketsTotalWeight = 0, this._interval = setInterval(() => this._flush(), LPA.DEFAULT_FLUSH_INTERVAL), this._interval.unref) this._interval.unref();
      this._flushShift = Math.floor(Math.random() * LPA.DEFAULT_FLUSH_INTERVAL / 1000), this._forceFlush = !1
    }
    add(A, Q, B, G = "none", Z = {}, I = ln2.timestampInSeconds()) {
      let Y = Math.floor(I),
        J = UG1.sanitizeMetricKey(Q),
        W = UG1.sanitizeTags(Z),
        X = UG1.sanitizeUnit(G),
        V = UG1.getBucketKey(A, J, X, W),
        F = this._buckets.get(V),
        K = F && A === LPA.SET_METRIC_TYPE ? F.metric.weight : 0;
      if (F) {
        if (F.metric.add(B), F.timestamp < Y) F.timestamp = Y
      } else F = {
        metric: new fI3.METRIC_MAP[A](B),
        timestamp: Y,
        metricType: A,
        name: J,
        unit: X,
        tags: W
      }, this._buckets.set(V, F);
      let D = typeof B === "string" ? F.metric.weight - K : B;
      if (hI3.updateMetricSummaryOnActiveSpan(A, J, D, X, Z, V), this._bucketsTotalWeight += F.metric.weight, this._bucketsTotalWeight >= LPA.MAX_WEIGHT) this.flush()
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
      let A = Math.floor(ln2.timestampInSeconds()) - LPA.DEFAULT_FLUSH_INTERVAL / 1000 - this._flushShift,
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
  nn2.MetricsAggregator = in2
})
// @from(Start 12622132, End 12626385)
tn2 = z((on2) => {
  Object.defineProperty(on2, "__esModule", {
    value: !0
  });
  var Eg = i0(),
    uI3 = eI0(),
    mI3 = QY0(),
    $G1 = ZV(),
    dI3 = jO(),
    cI3 = an2(),
    pI3 = sI0(),
    lI3 = nI0(),
    iI3 = E$(),
    nI3 = XXA();
  KXA();
  var sn2 = a0A();
  class rn2 extends uI3.BaseClient {
    constructor(A) {
      lI3.addTracingExtensions();
      super(A);
      if (A._experiments && A._experiments.metricsAggregator) this.metricsAggregator = new cI3.MetricsAggregator(this)
    }
    eventFromException(A, Q) {
      return Eg.resolvedSyncPromise(Eg.eventFromUnknownInput(dI3.getClient(), this._options.stackParser, A, Q))
    }
    eventFromMessage(A, Q = "info", B) {
      return Eg.resolvedSyncPromise(Eg.eventFromMessage(this._options.stackParser, A, Q, B, this._options.attachStacktrace))
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
          let I = B.getRequestSession();
          if (I && I.status === "ok") I.status = "errored"
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
      if (!A) $G1.DEBUG_BUILD && Eg.logger.warn("Cannot initialise an instance of SessionFlusher if no release is provided!");
      else this._sessionFlusher = new pI3.SessionFlusher(this, {
        release: A,
        environment: Q
      })
    }
    captureCheckIn(A, Q, B) {
      let G = "checkInId" in A && A.checkInId ? A.checkInId : Eg.uuid4();
      if (!this._isEnabled()) return $G1.DEBUG_BUILD && Eg.logger.warn("SDK not enabled, will not capture checkin."), G;
      let Z = this.getOptions(),
        {
          release: I,
          environment: Y,
          tunnel: J
        } = Z,
        W = {
          check_in_id: G,
          monitor_slug: A.monitorSlug,
          status: A.status,
          release: I,
          environment: Y
        };
      if ("duration" in A) W.duration = A.duration;
      if (Q) W.monitor_config = {
        schedule: Q.schedule,
        checkin_margin: Q.checkinMargin,
        max_runtime: Q.maxRuntime,
        timezone: Q.timezone
      };
      let [X, V] = this._getTraceInfoFromScope(B);
      if (V) W.contexts = {
        trace: V
      };
      let F = mI3.createCheckInEnvelope(W, X, this.getSdkMetadata(), J, this.getDsn());
      return $G1.DEBUG_BUILD && Eg.logger.info("Sending checkin:", A.monitorSlug, A.status), this._sendEnvelope(F), G
    }
    _captureRequestSession() {
      if (!this._sessionFlusher) $G1.DEBUG_BUILD && Eg.logger.warn("Discarded request mode session because autoSessionTracking option was disabled");
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
      if (Q) return [nI3.getRootSpan(Q) ? sn2.getDynamicSamplingContextFromSpan(Q) : void 0, iI3.spanToTraceContext(Q)];
      let {
        traceId: B,
        spanId: G,
        parentSpanId: Z,
        dsc: I
      } = A.getPropagationContext(), Y = {
        trace_id: B,
        span_id: G,
        parent_span_id: Z
      };
      if (I) return [I, Y];
      return [sn2.getDynamicSamplingContextFromClient(B, this, A), Y]
    }
  }
  on2.ServerRuntimeClient = rn2
})
// @from(Start 12626391, End 12627155)
Ba2 = z((Qa2) => {
  Object.defineProperty(Qa2, "__esModule", {
    value: !0
  });
  var en2 = i0(),
    sI3 = ZV(),
    rI3 = jO(),
    oI3 = py();

  function tI3(A, Q) {
    if (Q.debug === !0)
      if (sI3.DEBUG_BUILD) en2.logger.enable();
      else en2.consoleSandbox(() => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.")
      });
    rI3.getCurrentScope().update(Q.initialScope);
    let G = new A(Q);
    Aa2(G), eI3(G)
  }

  function Aa2(A) {
    let B = oI3.getCurrentHub().getStackTop();
    B.client = A, B.scope.setClient(A)
  }

  function eI3(A) {
    if (A.init) A.init();
    else if (A.setupIntegrations) A.setupIntegrations()
  }
  Qa2.initAndBind = tI3;
  Qa2.setCurrentClient = Aa2
})
// @from(Start 12627161, End 12628972)
Ja2 = z((Ya2) => {
  Object.defineProperty(Ya2, "__esModule", {
    value: !0
  });
  var U$ = i0(),
    Ga2 = ZV(),
    Ia2 = 30;

  function BY3(A, Q, B = U$.makePromiseBuffer(A.bufferSize || Ia2)) {
    let G = {},
      Z = (Y) => B.drain(Y);

    function I(Y) {
      let J = [];
      if (U$.forEachEnvelopeItem(Y, (F, K) => {
          let D = U$.envelopeItemTypeToDataCategory(K);
          if (U$.isRateLimited(G, D)) {
            let H = Za2(F, K);
            A.recordDroppedEvent("ratelimit_backoff", D, H)
          } else J.push(F)
        }), J.length === 0) return U$.resolvedSyncPromise();
      let W = U$.createEnvelope(Y[0], J),
        X = (F) => {
          U$.forEachEnvelopeItem(W, (K, D) => {
            let H = Za2(K, D);
            A.recordDroppedEvent(F, U$.envelopeItemTypeToDataCategory(D), H)
          })
        },
        V = () => Q({
          body: U$.serializeEnvelope(W, A.textEncoder)
        }).then((F) => {
          if (F.statusCode !== void 0 && (F.statusCode < 200 || F.statusCode >= 300)) Ga2.DEBUG_BUILD && U$.logger.warn(`Sentry responded with status code ${F.statusCode} to sent event.`);
          return G = U$.updateRateLimits(G, F), F
        }, (F) => {
          throw X("network_error"), F
        });
      return B.add(V).then((F) => F, (F) => {
        if (F instanceof U$.SentryError) return Ga2.DEBUG_BUILD && U$.logger.error("Skipped sending event because buffer is full."), X("queue_overflow"), U$.resolvedSyncPromise();
        else throw F
      })
    }
    return I.__sentry__baseTransport__ = !0, {
      send: I,
      flush: Z
    }
  }

  function Za2(A, Q) {
    if (Q !== "event" && Q !== "transaction") return;
    return Array.isArray(A) ? A[1] : void 0
  }
  Ya2.DEFAULT_TRANSPORT_BUFFER_SIZE = Ia2;
  Ya2.createTransport = BY3
})
// @from(Start 12628978, End 12630802)
Va2 = z((Xa2) => {
  Object.defineProperty(Xa2, "__esModule", {
    value: !0
  });
  var WY0 = i0(),
    IY3 = ZV(),
    Wa2 = 100,
    XY0 = 5000,
    YY3 = 3600000;

  function JY0(A, Q) {
    IY3.DEBUG_BUILD && WY0.logger.info(`[Offline]: ${A}`, Q)
  }

  function JY3(A) {
    return (Q) => {
      let B = A(Q),
        G = Q.createStore ? Q.createStore(Q) : void 0,
        Z = XY0,
        I;

      function Y(V, F, K) {
        if (WY0.envelopeContainsItemType(V, ["replay_event", "replay_recording", "client_report"])) return !1;
        if (Q.shouldStore) return Q.shouldStore(V, F, K);
        return !0
      }

      function J(V) {
        if (!G) return;
        if (I) clearTimeout(I);
        if (I = setTimeout(async () => {
            I = void 0;
            let F = await G.pop();
            if (F) JY0("Attempting to send previously queued event"), X(F).catch((K) => {
              JY0("Failed to retry sending", K)
            })
          }, V), typeof I !== "number" && I.unref) I.unref()
      }

      function W() {
        if (I) return;
        J(Z), Z = Math.min(Z * 2, YY3)
      }
      async function X(V) {
        try {
          let F = await B.send(V),
            K = Wa2;
          if (F) {
            if (F.headers && F.headers["retry-after"]) K = WY0.parseRetryAfterHeader(F.headers["retry-after"]);
            else if ((F.statusCode || 0) >= 400) return F
          }
          return J(K), Z = XY0, F
        } catch (F) {
          if (G && await Y(V, F, Z)) return await G.insert(V), W(), JY0("Error sending. Event queued", F), {};
          else throw F
        }
      }
      if (Q.flushAtStartup) W();
      return {
        send: X,
        flush: (V) => B.flush(V)
      }
    }
  }
  Xa2.MIN_DELAY = Wa2;
  Xa2.START_DELAY = XY0;
  Xa2.makeOfflineTransport = JY3
})
// @from(Start 12630808, End 12632809)
Ka2 = z((Fa2) => {
  Object.defineProperty(Fa2, "__esModule", {
    value: !0
  });
  var VY0 = i0(),
    FY3 = HG1();

  function FY0(A, Q) {
    let B;
    return VY0.forEachEnvelopeItem(A, (G, Z) => {
      if (Q.includes(Z)) B = Array.isArray(G) ? G[1] : void 0;
      return !!B
    }), B
  }

  function KY3(A, Q) {
    return (B) => {
      let G = A(B);
      return {
        ...G,
        send: async (Z) => {
          let I = FY0(Z, ["event", "transaction", "profile", "replay_event"]);
          if (I) I.release = Q;
          return G.send(Z)
        }
      }
    }
  }

  function DY3(A, Q) {
    return VY0.createEnvelope(Q ? {
      ...A[0],
      dsn: Q
    } : A[0], A[1])
  }

  function HY3(A, Q) {
    return (B) => {
      let G = A(B),
        Z = new Map;

      function I(W, X) {
        let V = X ? `${W}:${X}` : W,
          F = Z.get(V);
        if (!F) {
          let K = VY0.dsnFromString(W);
          if (!K) return;
          let D = FY3.getEnvelopeEndpointWithUrlEncodedAuth(K, B.tunnel);
          F = X ? KY3(A, X)({
            ...B,
            url: D
          }) : A({
            ...B,
            url: D
          }), Z.set(V, F)
        }
        return [W, F]
      }
      async function Y(W) {
        function X(K) {
          let D = K && K.length ? K : ["event"];
          return FY0(W, D)
        }
        let V = Q({
          envelope: W,
          getEvent: X
        }).map((K) => {
          if (typeof K === "string") return I(K, void 0);
          else return I(K.dsn, K.release)
        }).filter((K) => !!K);
        if (V.length === 0) V.push(["", G]);
        return (await Promise.all(V.map(([K, D]) => D.send(DY3(W, K)))))[0]
      }
      async function J(W) {
        let X = [await G.flush(W)];
        for (let [, V] of Z) X.push(await V.flush(W));
        return X.every((V) => V)
      }
      return {
        send: Y,
        flush: J
      }
    }
  }
  Fa2.eventFromEnvelope = FY0;
  Fa2.makeMultiplexedTransport = HY3
})
// @from(Start 12632815, End 12633206)
Ca2 = z((Ha2) => {
  Object.defineProperty(Ha2, "__esModule", {
    value: !0
  });
  var Da2 = i0();

  function zY3(A, Q) {
    let B = {
      sent_at: new Date().toISOString()
    };
    if (Q) B.dsn = Da2.dsnToString(Q);
    let G = A.map(UY3);
    return Da2.createEnvelope(B, G)
  }

  function UY3(A) {
    return [{
      type: "span"
    }, A]
  }
  Ha2.createSpanEnvelope = zY3
})
// @from(Start 12633212, End 12633788)
Ua2 = z((za2) => {
  Object.defineProperty(za2, "__esModule", {
    value: !0
  });

  function wY3(A, Q) {
    let B = Q && LY3(Q) ? Q.getClient() : Q,
      G = B && B.getDsn(),
      Z = B && B.getOptions().tunnel;
    return NY3(A, G) || qY3(A, Z)
  }

  function qY3(A, Q) {
    if (!Q) return !1;
    return Ea2(A) === Ea2(Q)
  }

  function NY3(A, Q) {
    return Q ? A.includes(Q.host) : !1
  }

  function Ea2(A) {
    return A[A.length - 1] === "/" ? A.slice(0, -1) : A
  }

  function LY3(A) {
    return A.getClient !== void 0
  }
  za2.isSentryRequestUrl = wY3
})
// @from(Start 12633794, End 12634116)
wa2 = z(($a2) => {
  Object.defineProperty($a2, "__esModule", {
    value: !0
  });

  function OY3(A, ...Q) {
    let B = new String(String.raw(A, ...Q));
    return B.__sentry_template_string__ = A.join("\x00").replace(/%/g, "%%").replace(/\0/g, "%s"), B.__sentry_template_values__ = Q, B
  }
  $a2.parameterize = OY3
})
// @from(Start 12634122, End 12634568)
La2 = z((Na2) => {
  Object.defineProperty(Na2, "__esModule", {
    value: !0
  });
  var qa2 = o71();

  function TY3(A, Q, B = [Q], G = "npm") {
    let Z = A._metadata || {};
    if (!Z.sdk) Z.sdk = {
      name: `sentry.javascript.${Q}`,
      packages: B.map((I) => ({
        name: `${G}:@sentry/${I}`,
        version: qa2.SDK_VERSION
      })),
      version: qa2.SDK_VERSION
    };
    A._metadata = Z
  }
  Na2.applySdkMetadata = TY3
})
// @from(Start 12634574, End 12635817)
Pa2 = z((Ta2) => {
  Object.defineProperty(Ta2, "__esModule", {
    value: !0
  });
  var KY0 = i0(),
    Oa2 = new Map,
    Ma2 = new Set;

  function jY3(A) {
    if (!KY0.GLOBAL_OBJ._sentryModuleMetadata) return;
    for (let Q of Object.keys(KY0.GLOBAL_OBJ._sentryModuleMetadata)) {
      let B = KY0.GLOBAL_OBJ._sentryModuleMetadata[Q];
      if (Ma2.has(Q)) continue;
      Ma2.add(Q);
      let G = A(Q);
      for (let Z of G.reverse())
        if (Z.filename) {
          Oa2.set(Z.filename, B);
          break
        }
    }
  }

  function Ra2(A, Q) {
    return jY3(A), Oa2.get(Q)
  }

  function SY3(A, Q) {
    try {
      Q.exception.values.forEach((B) => {
        if (!B.stacktrace) return;
        for (let G of B.stacktrace.frames || []) {
          if (!G.filename) continue;
          let Z = Ra2(A, G.filename);
          if (Z) G.module_metadata = Z
        }
      })
    } catch (B) {}
  }

  function _Y3(A) {
    try {
      A.exception.values.forEach((Q) => {
        if (!Q.stacktrace) return;
        for (let B of Q.stacktrace.frames || []) delete B.module_metadata
      })
    } catch (Q) {}
  }
  Ta2.addMetadataToStackFrames = SY3;
  Ta2.getMetadataForUrl = Ra2;
  Ta2.stripMetadataFromStackFrames = _Y3
})
// @from(Start 12635823, End 12636758)
xa2 = z((ya2) => {
  Object.defineProperty(ya2, "__esModule", {
    value: !0
  });
  var vY3 = i0(),
    Sa2 = Cg(),
    ja2 = Pa2(),
    _a2 = "ModuleMetadata",
    bY3 = () => {
      return {
        name: _a2,
        setupOnce() {},
        setup(A) {
          if (typeof A.on !== "function") return;
          A.on("beforeEnvelope", (Q) => {
            vY3.forEachEnvelopeItem(Q, (B, G) => {
              if (G === "event") {
                let Z = Array.isArray(B) ? B[1] : void 0;
                if (Z) ja2.stripMetadataFromStackFrames(Z), B[1] = Z
              }
            })
          })
        },
        processEvent(A, Q, B) {
          let G = B.getOptions().stackParser;
          return ja2.addMetadataToStackFrames(G, A), A
        }
      }
    },
    ka2 = Sa2.defineIntegration(bY3),
    fY3 = Sa2.convertIntegrationFnToClass(_a2, ka2);
  ya2.ModuleMetadata = fY3;
  ya2.moduleMetadataIntegration = ka2
})
// @from(Start 12636764, End 12639397)
ua2 = z((ga2) => {
  Object.defineProperty(ga2, "__esModule", {
    value: !0
  });
  var va2 = i0(),
    ba2 = Cg(),
    uY3 = E$(),
    DY0 = {
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
    fa2 = "RequestData",
    mY3 = (A = {}) => {
      let Q = va2.addRequestDataToEvent,
        B = {
          ...DY0,
          ...A,
          include: {
            method: !0,
            ...DY0.include,
            ...A.include,
            user: A.include && typeof A.include.user === "boolean" ? A.include.user : {
              ...DY0.include.user,
              ...(A.include || {}).user
            }
          }
        };
      return {
        name: fa2,
        setupOnce() {},
        processEvent(G, Z, I) {
          let {
            transactionNamingScheme: Y
          } = B, {
            sdkProcessingMetadata: J = {}
          } = G, W = J.request;
          if (!W) return G;
          let X = J.requestDataOptionsFromExpressHandler || J.requestDataOptionsFromGCPWrapper || cY3(B),
            V = Q(G, W, X);
          if (G.type === "transaction" || Y === "handler") return V;
          let K = W._sentryTransaction;
          if (K) {
            let D = uY3.spanToJSON(K).description || "",
              H = pY3(I) === "sentry.javascript.nextjs" ? D.startsWith("/api") : Y !== "path",
              [C] = va2.extractPathForTransaction(W, {
                path: !0,
                method: H,
                customRoute: D
              });
            V.transaction = C
          }
          return V
        }
      }
    },
    ha2 = ba2.defineIntegration(mY3),
    dY3 = ba2.convertIntegrationFnToClass(fa2, ha2);

  function cY3(A) {
    let {
      transactionNamingScheme: Q,
      include: {
        ip: B,
        user: G,
        ...Z
      }
    } = A, I = [];
    for (let [J, W] of Object.entries(Z))
      if (W) I.push(J);
    let Y;
    if (G === void 0) Y = !0;
    else if (typeof G === "boolean") Y = G;
    else {
      let J = [];
      for (let [W, X] of Object.entries(G))
        if (X) J.push(W);
      Y = J
    }
    return {
      include: {
        ip: B,
        user: Y,
        request: I.length !== 0 ? I : void 0,
        transaction: Q
      }
    }
  }

  function pY3(A) {
    try {
      return A.getOptions()._metadata.sdk.name
    } catch (Q) {
      return
    }
  }
  ga2.RequestData = dY3;
  ga2.requestDataIntegration = ha2
})
// @from(Start 12639403, End 12643427)
HY0 = z((pa2) => {
  Object.defineProperty(pa2, "__esModule", {
    value: !0
  });
  var zK = i0(),
    t0A = ZV(),
    ma2 = Cg(),
    nY3 = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/, /^ResizeObserver loop completed with undelivered notifications.$/, /^Cannot redefine property: googletag$/],
    aY3 = [/^.*\/healthcheck$/, /^.*\/healthy$/, /^.*\/live$/, /^.*\/ready$/, /^.*\/heartbeat$/, /^.*\/health$/, /^.*\/healthz$/],
    da2 = "InboundFilters",
    sY3 = (A = {}) => {
      return {
        name: da2,
        setupOnce() {},
        processEvent(Q, B, G) {
          let Z = G.getOptions(),
            I = oY3(A, Z);
          return tY3(Q, I) ? null : Q
        }
      }
    },
    ca2 = ma2.defineIntegration(sY3),
    rY3 = ma2.convertIntegrationFnToClass(da2, ca2);

  function oY3(A = {}, Q = {}) {
    return {
      allowUrls: [...A.allowUrls || [], ...Q.allowUrls || []],
      denyUrls: [...A.denyUrls || [], ...Q.denyUrls || []],
      ignoreErrors: [...A.ignoreErrors || [], ...Q.ignoreErrors || [], ...A.disableErrorDefaults ? [] : nY3],
      ignoreTransactions: [...A.ignoreTransactions || [], ...Q.ignoreTransactions || [], ...A.disableTransactionDefaults ? [] : aY3],
      ignoreInternal: A.ignoreInternal !== void 0 ? A.ignoreInternal : !0
    }
  }

  function tY3(A, Q) {
    if (Q.ignoreInternal && ZJ3(A)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being internal Sentry Error.
Event: ${zK.getEventDescription(A)}`), !0;
    if (eY3(A, Q.ignoreErrors)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${zK.getEventDescription(A)}`), !0;
    if (AJ3(A, Q.ignoreTransactions)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${zK.getEventDescription(A)}`), !0;
    if (QJ3(A, Q.denyUrls)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${zK.getEventDescription(A)}.
Url: ${wG1(A)}`), !0;
    if (!BJ3(A, Q.allowUrls)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${zK.getEventDescription(A)}.
Url: ${wG1(A)}`), !0;
    return !1
  }

  function eY3(A, Q) {
    if (A.type || !Q || !Q.length) return !1;
    return GJ3(A).some((B) => zK.stringMatchesSomePattern(B, Q))
  }

  function AJ3(A, Q) {
    if (A.type !== "transaction" || !Q || !Q.length) return !1;
    let B = A.transaction;
    return B ? zK.stringMatchesSomePattern(B, Q) : !1
  }

  function QJ3(A, Q) {
    if (!Q || !Q.length) return !1;
    let B = wG1(A);
    return !B ? !1 : zK.stringMatchesSomePattern(B, Q)
  }

  function BJ3(A, Q) {
    if (!Q || !Q.length) return !0;
    let B = wG1(A);
    return !B ? !0 : zK.stringMatchesSomePattern(B, Q)
  }

  function GJ3(A) {
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
    if (t0A.DEBUG_BUILD && Q.length === 0) zK.logger.error(`Could not extract message for event ${zK.getEventDescription(A)}`);
    return Q
  }

  function ZJ3(A) {
    try {
      return A.exception.values[0].type === "SentryError"
    } catch (Q) {}
    return !1
  }

  function IJ3(A = []) {
    for (let Q = A.length - 1; Q >= 0; Q--) {
      let B = A[Q];
      if (B && B.filename !== "<anonymous>" && B.filename !== "[native code]") return B.filename || null
    }
    return null
  }

  function wG1(A) {
    try {
      let Q;
      try {
        Q = A.exception.values[0].stacktrace.frames
      } catch (B) {}
      return Q ? IJ3(Q) : null
    } catch (Q) {
      return t0A.DEBUG_BUILD && zK.logger.error(`Cannot extract url for event ${zK.getEventDescription(A)}`), null
    }
  }
  pa2.InboundFilters = rY3;
  pa2.inboundFiltersIntegration = ca2
})
// @from(Start 12643433, End 12644264)
CY0 = z((ra2) => {
  Object.defineProperty(ra2, "__esModule", {
    value: !0
  });
  var WJ3 = i0(),
    XJ3 = jO(),
    na2 = Cg(),
    la2, aa2 = "FunctionToString",
    ia2 = new WeakMap,
    VJ3 = () => {
      return {
        name: aa2,
        setupOnce() {
          la2 = Function.prototype.toString;
          try {
            Function.prototype.toString = function(...A) {
              let Q = WJ3.getOriginalFunction(this),
                B = ia2.has(XJ3.getClient()) && Q !== void 0 ? Q : this;
              return la2.apply(B, A)
            }
          } catch (A) {}
        },
        setup(A) {
          ia2.set(A, !0)
        }
      }
    },
    sa2 = na2.defineIntegration(VJ3),
    FJ3 = na2.convertIntegrationFnToClass(aa2, sa2);
  ra2.FunctionToString = FJ3;
  ra2.functionToStringIntegration = sa2
})
// @from(Start 12644270, End 12644944)
EY0 = z((Qs2) => {
  Object.defineProperty(Qs2, "__esModule", {
    value: !0
  });
  var oa2 = i0(),
    ta2 = Cg(),
    HJ3 = "cause",
    CJ3 = 5,
    ea2 = "LinkedErrors",
    EJ3 = (A = {}) => {
      let Q = A.limit || CJ3,
        B = A.key || HJ3;
      return {
        name: ea2,
        setupOnce() {},
        preprocessEvent(G, Z, I) {
          let Y = I.getOptions();
          oa2.applyAggregateErrorsToEvent(oa2.exceptionFromError, Y.stackParser, Y.maxValueLength, B, Q, G, Z)
        }
      }
    },
    As2 = ta2.defineIntegration(EJ3),
    zJ3 = ta2.convertIntegrationFnToClass(ea2, As2);
  Qs2.LinkedErrors = zJ3;
  Qs2.linkedErrorsIntegration = As2
})
// @from(Start 12644950, End 12645217)
Gs2 = z((Bs2) => {
  Object.defineProperty(Bs2, "__esModule", {
    value: !0
  });
  var wJ3 = CY0(),
    qJ3 = HY0(),
    NJ3 = EY0();
  Bs2.FunctionToString = wJ3.FunctionToString;
  Bs2.InboundFilters = qJ3.InboundFilters;
  Bs2.LinkedErrors = NJ3.LinkedErrors
})
// @from(Start 12645223, End 12646680)
Js2 = z((Ys2) => {
  Object.defineProperty(Ys2, "__esModule", {
    value: !0
  });
  var RJ3 = i0(),
    Zs2 = NPA(),
    TJ3 = YY0(),
    PJ3 = UPA(),
    qG1 = qPA();
  class Is2 {
    constructor(A) {
      this._client = A, this._buckets = new Map, this._interval = setInterval(() => this.flush(), Zs2.DEFAULT_BROWSER_FLUSH_INTERVAL)
    }
    add(A, Q, B, G = "none", Z = {}, I = RJ3.timestampInSeconds()) {
      let Y = Math.floor(I),
        J = qG1.sanitizeMetricKey(Q),
        W = qG1.sanitizeTags(Z),
        X = qG1.sanitizeUnit(G),
        V = qG1.getBucketKey(A, J, X, W),
        F = this._buckets.get(V),
        K = F && A === Zs2.SET_METRIC_TYPE ? F.metric.weight : 0;
      if (F) {
        if (F.metric.add(B), F.timestamp < Y) F.timestamp = Y
      } else F = {
        metric: new TJ3.METRIC_MAP[A](B),
        timestamp: Y,
        metricType: A,
        name: J,
        unit: X,
        tags: W
      }, this._buckets.set(V, F);
      let D = typeof B === "string" ? F.metric.weight - K : B;
      PJ3.updateMetricSummaryOnActiveSpan(A, J, D, X, Z, V)
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
  Ys2.BrowserMetricsAggregator = Is2
})
// @from(Start 12646686, End 12647189)
Ks2 = z((Fs2) => {
  Object.defineProperty(Fs2, "__esModule", {
    value: !0
  });
  var Ws2 = Cg(),
    SJ3 = Js2(),
    Xs2 = "MetricsAggregator",
    _J3 = () => {
      return {
        name: Xs2,
        setupOnce() {},
        setup(A) {
          A.metricsAggregator = new SJ3.BrowserMetricsAggregator(A)
        }
      }
    },
    Vs2 = Ws2.defineIntegration(_J3),
    kJ3 = Ws2.convertIntegrationFnToClass(Xs2, Vs2);
  Fs2.MetricsAggregator = kJ3;
  Fs2.metricsAggregatorIntegration = Vs2
})
// @from(Start 12647195, End 12648777)
Ns2 = z((qs2) => {
  Object.defineProperty(qs2, "__esModule", {
    value: !0
  });
  var Ds2 = i0(),
    Hs2 = ZV(),
    Cs2 = jO(),
    vJ3 = E$(),
    NG1 = NPA(),
    Es2 = Ks2();

  function LG1(A, Q, B, G = {}) {
    let Z = Cs2.getClient(),
      I = Cs2.getCurrentScope();
    if (Z) {
      if (!Z.metricsAggregator) {
        Hs2.DEBUG_BUILD && Ds2.logger.warn("No metrics aggregator enabled. Please add the MetricsAggregator integration to use metrics APIs");
        return
      }
      let {
        unit: Y,
        tags: J,
        timestamp: W
      } = G, {
        release: X,
        environment: V
      } = Z.getOptions(), F = I.getTransaction(), K = {};
      if (X) K.release = X;
      if (V) K.environment = V;
      if (F) K.transaction = vJ3.spanToJSON(F).description || "";
      Hs2.DEBUG_BUILD && Ds2.logger.log(`Adding value of ${B} to ${A} metric ${Q}`), Z.metricsAggregator.add(A, Q, B, Y, {
        ...K,
        ...J
      }, W)
    }
  }

  function zs2(A, Q = 1, B) {
    LG1(NG1.COUNTER_METRIC_TYPE, A, Q, B)
  }

  function Us2(A, Q, B) {
    LG1(NG1.DISTRIBUTION_METRIC_TYPE, A, Q, B)
  }

  function $s2(A, Q, B) {
    LG1(NG1.SET_METRIC_TYPE, A, Q, B)
  }

  function ws2(A, Q, B) {
    LG1(NG1.GAUGE_METRIC_TYPE, A, Q, B)
  }
  var bJ3 = {
    increment: zs2,
    distribution: Us2,
    set: $s2,
    gauge: ws2,
    MetricsAggregator: Es2.MetricsAggregator,
    metricsAggregatorIntegration: Es2.metricsAggregatorIntegration
  };
  qs2.distribution = Us2;
  qs2.gauge = ws2;
  qs2.increment = zs2;
  qs2.metrics = bJ3;
  qs2.set = $s2
})
// @from(Start 12648783, End 12655239)
_4 = z(($Y0) => {
  Object.defineProperty($Y0, "__esModule", {
    value: !0
  });
  var Ls2 = nI0(),
    Ms2 = lI0(),
    dJ3 = JG1(),
    cJ3 = VG1(),
    Os2 = AG1(),
    MG1 = KXA(),
    e0A = YG1(),
    Rs2 = a0A(),
    pJ3 = Ln2(),
    lJ3 = iI0(),
    MPA = $PA(),
    Ts2 = aI0(),
    sZ = jO(),
    ny = py(),
    zY0 = WXA(),
    iJ3 = sI0(),
    UY0 = a71(),
    Ps2 = VPA(),
    js2 = HG1(),
    Ss2 = eI0(),
    nJ3 = tn2(),
    _s2 = Ba2(),
    aJ3 = Ja2(),
    sJ3 = Va2(),
    rJ3 = Ka2(),
    oJ3 = o71(),
    OG1 = Cg(),
    ks2 = n71(),
    tJ3 = i71(),
    eJ3 = QY0(),
    AW3 = Ca2(),
    QW3 = BG1(),
    BW3 = Ua2(),
    GW3 = mI0(),
    ZW3 = wa2(),
    RG1 = E$(),
    IW3 = XXA(),
    YW3 = La2(),
    JW3 = JXA(),
    ys2 = xa2(),
    xs2 = ua2(),
    vs2 = HY0(),
    bs2 = CY0(),
    fs2 = EY0(),
    WW3 = Gs2(),
    XW3 = Ns2(),
    VW3 = WW3;
  $Y0.addTracingExtensions = Ls2.addTracingExtensions;
  $Y0.startIdleTransaction = Ls2.startIdleTransaction;
  $Y0.IdleTransaction = Ms2.IdleTransaction;
  $Y0.TRACING_DEFAULTS = Ms2.TRACING_DEFAULTS;
  $Y0.Span = dJ3.Span;
  $Y0.Transaction = cJ3.Transaction;
  $Y0.extractTraceparentData = Os2.extractTraceparentData;
  $Y0.getActiveTransaction = Os2.getActiveTransaction;
  Object.defineProperty($Y0, "SpanStatus", {
    enumerable: !0,
    get: () => MG1.SpanStatus
  });
  $Y0.getSpanStatusFromHttpCode = MG1.getSpanStatusFromHttpCode;
  $Y0.setHttpStatus = MG1.setHttpStatus;
  $Y0.spanStatusfromHttpCode = MG1.spanStatusfromHttpCode;
  $Y0.continueTrace = e0A.continueTrace;
  $Y0.getActiveSpan = e0A.getActiveSpan;
  $Y0.startActiveSpan = e0A.startActiveSpan;
  $Y0.startInactiveSpan = e0A.startInactiveSpan;
  $Y0.startSpan = e0A.startSpan;
  $Y0.startSpanManual = e0A.startSpanManual;
  $Y0.trace = e0A.trace;
  $Y0.getDynamicSamplingContextFromClient = Rs2.getDynamicSamplingContextFromClient;
  $Y0.getDynamicSamplingContextFromSpan = Rs2.getDynamicSamplingContextFromSpan;
  $Y0.setMeasurement = pJ3.setMeasurement;
  $Y0.isValidSampleRate = lJ3.isValidSampleRate;
  $Y0.SEMANTIC_ATTRIBUTE_PROFILE_ID = MPA.SEMANTIC_ATTRIBUTE_PROFILE_ID;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_OP = MPA.SEMANTIC_ATTRIBUTE_SENTRY_OP;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = MPA.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = MPA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = MPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
  $Y0.createEventEnvelope = Ts2.createEventEnvelope;
  $Y0.createSessionEnvelope = Ts2.createSessionEnvelope;
  $Y0.addBreadcrumb = sZ.addBreadcrumb;
  $Y0.captureCheckIn = sZ.captureCheckIn;
  $Y0.captureEvent = sZ.captureEvent;
  $Y0.captureException = sZ.captureException;
  $Y0.captureMessage = sZ.captureMessage;
  $Y0.captureSession = sZ.captureSession;
  $Y0.close = sZ.close;
  $Y0.configureScope = sZ.configureScope;
  $Y0.endSession = sZ.endSession;
  $Y0.flush = sZ.flush;
  $Y0.getClient = sZ.getClient;
  $Y0.getCurrentScope = sZ.getCurrentScope;
  $Y0.isInitialized = sZ.isInitialized;
  $Y0.lastEventId = sZ.lastEventId;
  $Y0.setContext = sZ.setContext;
  $Y0.setExtra = sZ.setExtra;
  $Y0.setExtras = sZ.setExtras;
  $Y0.setTag = sZ.setTag;
  $Y0.setTags = sZ.setTags;
  $Y0.setUser = sZ.setUser;
  $Y0.startSession = sZ.startSession;
  $Y0.startTransaction = sZ.startTransaction;
  $Y0.withActiveSpan = sZ.withActiveSpan;
  $Y0.withIsolationScope = sZ.withIsolationScope;
  $Y0.withMonitor = sZ.withMonitor;
  $Y0.withScope = sZ.withScope;
  $Y0.Hub = ny.Hub;
  $Y0.ensureHubOnCarrier = ny.ensureHubOnCarrier;
  $Y0.getCurrentHub = ny.getCurrentHub;
  $Y0.getHubFromCarrier = ny.getHubFromCarrier;
  $Y0.getIsolationScope = ny.getIsolationScope;
  $Y0.getMainCarrier = ny.getMainCarrier;
  $Y0.makeMain = ny.makeMain;
  $Y0.runWithAsyncContext = ny.runWithAsyncContext;
  $Y0.setAsyncContextStrategy = ny.setAsyncContextStrategy;
  $Y0.setHubOnCarrier = ny.setHubOnCarrier;
  $Y0.closeSession = zY0.closeSession;
  $Y0.makeSession = zY0.makeSession;
  $Y0.updateSession = zY0.updateSession;
  $Y0.SessionFlusher = iJ3.SessionFlusher;
  $Y0.Scope = UY0.Scope;
  $Y0.getGlobalScope = UY0.getGlobalScope;
  $Y0.setGlobalScope = UY0.setGlobalScope;
  $Y0.addGlobalEventProcessor = Ps2.addGlobalEventProcessor;
  $Y0.notifyEventProcessors = Ps2.notifyEventProcessors;
  $Y0.getEnvelopeEndpointWithUrlEncodedAuth = js2.getEnvelopeEndpointWithUrlEncodedAuth;
  $Y0.getReportDialogEndpoint = js2.getReportDialogEndpoint;
  $Y0.BaseClient = Ss2.BaseClient;
  $Y0.addEventProcessor = Ss2.addEventProcessor;
  $Y0.ServerRuntimeClient = nJ3.ServerRuntimeClient;
  $Y0.initAndBind = _s2.initAndBind;
  $Y0.setCurrentClient = _s2.setCurrentClient;
  $Y0.createTransport = aJ3.createTransport;
  $Y0.makeOfflineTransport = sJ3.makeOfflineTransport;
  $Y0.makeMultiplexedTransport = rJ3.makeMultiplexedTransport;
  $Y0.SDK_VERSION = oJ3.SDK_VERSION;
  $Y0.addIntegration = OG1.addIntegration;
  $Y0.convertIntegrationFnToClass = OG1.convertIntegrationFnToClass;
  $Y0.defineIntegration = OG1.defineIntegration;
  $Y0.getIntegrationsToSetup = OG1.getIntegrationsToSetup;
  $Y0.applyScopeDataToEvent = ks2.applyScopeDataToEvent;
  $Y0.mergeScopeData = ks2.mergeScopeData;
  $Y0.prepareEvent = tJ3.prepareEvent;
  $Y0.createCheckInEnvelope = eJ3.createCheckInEnvelope;
  $Y0.createSpanEnvelope = AW3.createSpanEnvelope;
  $Y0.hasTracingEnabled = QW3.hasTracingEnabled;
  $Y0.isSentryRequestUrl = BW3.isSentryRequestUrl;
  $Y0.handleCallbackErrors = GW3.handleCallbackErrors;
  $Y0.parameterize = ZW3.parameterize;
  $Y0.spanIsSampled = RG1.spanIsSampled;
  $Y0.spanToJSON = RG1.spanToJSON;
  $Y0.spanToTraceContext = RG1.spanToTraceContext;
  $Y0.spanToTraceHeader = RG1.spanToTraceHeader;
  $Y0.getRootSpan = IW3.getRootSpan;
  $Y0.applySdkMetadata = YW3.applySdkMetadata;
  $Y0.DEFAULT_ENVIRONMENT = JW3.DEFAULT_ENVIRONMENT;
  $Y0.ModuleMetadata = ys2.ModuleMetadata;
  $Y0.moduleMetadataIntegration = ys2.moduleMetadataIntegration;
  $Y0.RequestData = xs2.RequestData;
  $Y0.requestDataIntegration = xs2.requestDataIntegration;
  $Y0.InboundFilters = vs2.InboundFilters;
  $Y0.inboundFiltersIntegration = vs2.inboundFiltersIntegration;
  $Y0.FunctionToString = bs2.FunctionToString;
  $Y0.functionToStringIntegration = bs2.functionToStringIntegration;
  $Y0.LinkedErrors = fs2.LinkedErrors;
  $Y0.linkedErrorsIntegration = fs2.linkedErrorsIntegration;
  $Y0.metrics = XW3.metrics;
  $Y0.Integrations = VW3
})
// @from(Start 12655245, End 12655417)
$$ = z((hs2) => {
  Object.defineProperty(hs2, "__esModule", {
    value: !0
  });
  var wV3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  hs2.DEBUG_BUILD = wV3
})
// @from(Start 12655423, End 12655861)
tn = z((us2) => {
  var {
    _optionalChain: gs2
  } = i0();
  Object.defineProperty(us2, "__esModule", {
    value: !0
  });

  function NV3(A) {
    let Q = gs2([A, "call", (G) => G(), "access", (G) => G.getClient, "call", (G) => G(), "optionalAccess", (G) => G.getOptions, "call", (G) => G()]);
    return (gs2([Q, "optionalAccess", (G) => G.instrumenter]) || "sentry") !== "sentry"
  }
  us2.shouldDisableAutoInstrumentation = NV3
})
// @from(Start 12655867, End 12662968)
ls2 = z((ps2) => {
  var {
    _optionalChain: lP
  } = i0();
  Object.defineProperty(ps2, "__esModule", {
    value: !0
  });
  var wY0 = _4(),
    w$ = i0(),
    TG1 = $$(),
    MV3 = tn();
  class PG1 {
    static __initStatic() {
      this.id = "Express"
    }
    constructor(A = {}) {
      this.name = PG1.id, this._router = A.router || A.app, this._methods = (Array.isArray(A.methods) ? A.methods : []).concat("use")
    }
    setupOnce(A, Q) {
      if (!this._router) {
        TG1.DEBUG_BUILD && w$.logger.error("ExpressIntegration is missing an Express instance");
        return
      }
      if (MV3.shouldDisableAutoInstrumentation(Q)) {
        TG1.DEBUG_BUILD && w$.logger.log("Express Integration is skipped because of instrumenter configuration.");
        return
      }
      TV3(this._router, this._methods), PV3(this._router)
    }
  }
  PG1.__initStatic();

  function ms2(A, Q) {
    let B = A.length;
    switch (B) {
      case 2:
        return function(G, Z) {
          let I = Z.__sentry_transaction;
          if (I) {
            let Y = I.startChild({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            });
            Z.once("finish", () => {
              Y.end()
            })
          }
          return A.call(this, G, Z)
        };
      case 3:
        return function(G, Z, I) {
          let Y = Z.__sentry_transaction,
            J = lP([Y, "optionalAccess", (W) => W.startChild, "call", (W) => W({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            })]);
          A.call(this, G, Z, function(...W) {
            lP([J, "optionalAccess", (X) => X.end, "call", (X) => X()]), I.call(this, ...W)
          })
        };
      case 4:
        return function(G, Z, I, Y) {
          let J = I.__sentry_transaction,
            W = lP([J, "optionalAccess", (X) => X.startChild, "call", (X) => X({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            })]);
          A.call(this, G, Z, I, function(...X) {
            lP([W, "optionalAccess", (V) => V.end, "call", (V) => V()]), Y.call(this, ...X)
          })
        };
      default:
        throw Error(`Express middleware takes 2-4 arguments. Got: ${B}`)
    }
  }

  function OV3(A, Q) {
    return A.map((B) => {
      if (typeof B === "function") return ms2(B, Q);
      if (Array.isArray(B)) return B.map((G) => {
        if (typeof G === "function") return ms2(G, Q);
        return G
      });
      return B
    })
  }

  function RV3(A, Q) {
    let B = A[Q];
    return A[Q] = function(...G) {
      return B.call(this, ...OV3(G, Q))
    }, A
  }

  function TV3(A, Q = []) {
    Q.forEach((B) => RV3(A, B))
  }

  function PV3(A) {
    let Q = "settings" in A;
    if (Q && A._router === void 0 && A.lazyrouter) A.lazyrouter();
    let B = Q ? A._router : A;
    if (!B) {
      TG1.DEBUG_BUILD && w$.logger.debug("Cannot instrument router for URL Parameterization (did not find a valid router)."), TG1.DEBUG_BUILD && w$.logger.debug("Routing instrumentation is currently only supported in Express 4.");
      return
    }
    let G = Object.getPrototypeOf(B),
      Z = G.process_params;
    G.process_params = function(Y, J, W, X, V) {
      if (!W._reconstructedRoute) W._reconstructedRoute = "";
      let {
        layerRoutePath: F,
        isRegex: K,
        isArray: D,
        numExtraSegments: H
      } = jV3(Y);
      if (F || K || D) W._hasParameters = !0;
      let C;
      if (F) C = F;
      else C = cs2(W.originalUrl, W._reconstructedRoute, Y.path) || "";
      let E = C.split("/").filter((w) => w.length > 0 && (K || D || !w.includes("*"))).join("/");
      if (E && E.length > 0) W._reconstructedRoute += `/${E}${K?"/":""}`;
      let U = w$.getNumberOfUrlSegments(w$.stripUrlQueryAndFragment(W.originalUrl || "")) + H,
        q = w$.getNumberOfUrlSegments(W._reconstructedRoute);
      if (U === q) {
        if (!W._hasParameters) {
          if (W._reconstructedRoute !== W.originalUrl) W._reconstructedRoute = W.originalUrl ? w$.stripUrlQueryAndFragment(W.originalUrl) : W.originalUrl
        }
        let w = X.__sentry_transaction,
          N = w && wY0.spanToJSON(w).data || {};
        if (w && N[wY0.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] !== "custom") {
          let R = W._reconstructedRoute || "/",
            [T, y] = w$.extractPathForTransaction(W, {
              path: !0,
              method: !0,
              customRoute: R
            });
          w.updateName(T), w.setAttribute(wY0.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, y)
        }
      }
      return Z.call(this, Y, J, W, X, V)
    }
  }
  var ds2 = (A, Q, B) => {
    if (!A || !Q || !B || Object.keys(B).length === 0 || lP([B, "access", (X) => X[0], "optionalAccess", (X) => X.offset]) === void 0 || lP([B, "access", (X) => X[0], "optionalAccess", (X) => X.offset]) === null) return;
    let G = B.sort((X, V) => X.offset - V.offset),
      I = new RegExp(Q, `${Q.flags}d`).exec(A);
    if (!I || !I.indices) return;
    let [, ...Y] = I.indices;
    if (Y.length !== G.length) return;
    let J = A,
      W = 0;
    return Y.forEach((X, V) => {
      if (X) {
        let [F, K] = X, D = J.substring(0, F - W), H = `:${G[V].name}`, C = J.substring(K - W);
        J = D + H + C, W = W + (K - F - H.length)
      }
    }), J
  };

  function jV3(A) {
    let Q = lP([A, "access", (Y) => Y.route, "optionalAccess", (Y) => Y.path]),
      B = w$.isRegExp(Q),
      G = Array.isArray(Q);
    if (!Q) {
      let [Y] = w$.GLOBAL_OBJ.process.versions.node.split(".").map(Number);
      if (Y >= 16) Q = ds2(A.path, A.regexp, A.keys)
    }
    if (!Q) return {
      isRegex: B,
      isArray: G,
      numExtraSegments: 0
    };
    let Z = G ? Math.max(SV3(Q) - w$.getNumberOfUrlSegments(A.path || ""), 0) : 0;
    return {
      layerRoutePath: _V3(G, Q),
      isRegex: B,
      isArray: G,
      numExtraSegments: Z
    }
  }

  function SV3(A) {
    return A.reduce((Q, B) => {
      return Q + w$.getNumberOfUrlSegments(B.toString())
    }, 0)
  }

  function _V3(A, Q) {
    if (A) return Q.map((B) => B.toString()).join(",");
    return Q && Q.toString()
  }

  function cs2(A, Q, B) {
    let G = w$.stripUrlQueryAndFragment(A || ""),
      Z = lP([G, "optionalAccess", (W) => W.split, "call", (W) => W("/"), "access", (W) => W.filter, "call", (W) => W((X) => !!X)]),
      I = 0,
      Y = lP([Q, "optionalAccess", (W) => W.split, "call", (W) => W("/"), "access", (W) => W.filter, "call", (W) => W((X) => !!X), "access", (W) => W.length]) || 0;
    return lP([B, "optionalAccess", (W) => W.split, "call", (W) => W("/"), "access", (W) => W.filter, "call", (W) => W((X) => {
      if (lP([Z, "optionalAccess", (V) => V[Y + I]]) === X) return I += 1, !0;
      return !1
    }), "access", (W) => W.join, "call", (W) => W("/")])
  }
  ps2.Express = PG1;
  ps2.extractOriginalRoute = ds2;
  ps2.preventDuplicateSegments = cs2
})
// @from(Start 12662974, End 12665555)
ns2 = z((is2) => {
  var {
    _optionalChain: $XA
  } = i0();
  Object.defineProperty(is2, "__esModule", {
    value: !0
  });
  var wXA = i0(),
    qY0 = $$(),
    vV3 = tn();
  class jG1 {
    static __initStatic() {
      this.id = "Postgres"
    }
    constructor(A = {}) {
      this.name = jG1.id, this._usePgNative = !!A.usePgNative, this._module = A.module
    }
    loadDependency() {
      return this._module = this._module || wXA.loadModule("pg")
    }
    setupOnce(A, Q) {
      if (vV3.shouldDisableAutoInstrumentation(Q)) {
        qY0.DEBUG_BUILD && wXA.logger.log("Postgres Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        qY0.DEBUG_BUILD && wXA.logger.error("Postgres Integration was unable to require `pg` package.");
        return
      }
      let G = this._usePgNative ? $XA([B, "access", (Z) => Z.native, "optionalAccess", (Z) => Z.Client]) : B.Client;
      if (!G) {
        qY0.DEBUG_BUILD && wXA.logger.error("Postgres Integration was unable to access 'pg-native' bindings.");
        return
      }
      wXA.fill(G.prototype, "query", function(Z) {
        return function(I, Y, J) {
          let X = Q().getScope().getSpan(),
            V = {
              "db.system": "postgresql"
            };
          try {
            if (this.database) V["db.name"] = this.database;
            if (this.host) V["server.address"] = this.host;
            if (this.port) V["server.port"] = this.port;
            if (this.user) V["db.user"] = this.user
          } catch (D) {}
          let F = $XA([X, "optionalAccess", (D) => D.startChild, "call", (D) => D({
            description: typeof I === "string" ? I : I.text,
            op: "db",
            origin: "auto.db.postgres",
            data: V
          })]);
          if (typeof J === "function") return Z.call(this, I, Y, function(D, H) {
            $XA([F, "optionalAccess", (C) => C.end, "call", (C) => C()]), J(D, H)
          });
          if (typeof Y === "function") return Z.call(this, I, function(D, H) {
            $XA([F, "optionalAccess", (C) => C.end, "call", (C) => C()]), Y(D, H)
          });
          let K = typeof Y < "u" ? Z.call(this, I, Y) : Z.call(this, I);
          if (wXA.isThenable(K)) return K.then((D) => {
            return $XA([F, "optionalAccess", (H) => H.end, "call", (H) => H()]), D
          });
          return $XA([F, "optionalAccess", (D) => D.end, "call", (D) => D()]), K
        }
      })
    }
  }
  jG1.__initStatic();
  is2.Postgres = jG1
})
// @from(Start 12665561, End 12667927)
ss2 = z((as2) => {
  var {
    _optionalChain: fV3
  } = i0();
  Object.defineProperty(as2, "__esModule", {
    value: !0
  });
  var OPA = i0(),
    NY0 = $$(),
    hV3 = tn();
  class SG1 {
    static __initStatic() {
      this.id = "Mysql"
    }
    constructor() {
      this.name = SG1.id
    }
    loadDependency() {
      return this._module = this._module || OPA.loadModule("mysql/lib/Connection.js")
    }
    setupOnce(A, Q) {
      if (hV3.shouldDisableAutoInstrumentation(Q)) {
        NY0.DEBUG_BUILD && OPA.logger.log("Mysql Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        NY0.DEBUG_BUILD && OPA.logger.error("Mysql Integration was unable to require `mysql` package.");
        return
      }
      let G = void 0;
      try {
        B.prototype.connect = new Proxy(B.prototype.connect, {
          apply(Y, J, W) {
            if (!G) G = J.config;
            return Y.apply(J, W)
          }
        })
      } catch (Y) {
        NY0.DEBUG_BUILD && OPA.logger.error("Mysql Integration was unable to instrument `mysql` config.")
      }

      function Z() {
        if (!G) return {};
        return {
          "server.address": G.host,
          "server.port": G.port,
          "db.user": G.user
        }
      }

      function I(Y) {
        if (!Y) return;
        let J = Z();
        Object.keys(J).forEach((W) => {
          Y.setAttribute(W, J[W])
        }), Y.end()
      }
      OPA.fill(B, "createQuery", function(Y) {
        return function(J, W, X) {
          let F = Q().getScope().getSpan(),
            K = fV3([F, "optionalAccess", (H) => H.startChild, "call", (H) => H({
              description: typeof J === "string" ? J : J.sql,
              op: "db",
              origin: "auto.db.mysql",
              data: {
                "db.system": "mysql"
              }
            })]);
          if (typeof X === "function") return Y.call(this, J, W, function(H, C, E) {
            I(K), X(H, C, E)
          });
          if (typeof W === "function") return Y.call(this, J, function(H, C, E) {
            I(K), W(H, C, E)
          });
          let D = Y.call(this, J, W);
          return D.on("end", () => {
            I(K)
          }), D
        }
      })
    }
  }
  SG1.__initStatic();
  as2.Mysql = SG1
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
// @from(Start 12801063, End 12990231)
_e2 = z((SU3) => {
  /*! @sentry/node 7.120.3 (5a833b4) | https://github.com/getsentry/sentry-javascript */
  SU3.base64WorkerScript = "aW1wb3J0IHsgU2Vzc2lvbiB9IGZyb20gJ2luc3BlY3Rvcic7CmltcG9ydCB7IHdvcmtlckRhdGEsIHBhcmVudFBvcnQgfSBmcm9tICd3b3JrZXJfdGhyZWFkcyc7CmltcG9ydCB7IHBvc2l4LCBzZXAgfSBmcm9tICdwYXRoJzsKaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJzsKaW1wb3J0ICogYXMgaHR0cHMgZnJvbSAnaHR0cHMnOwppbXBvcnQgeyBSZWFkYWJsZSB9IGZyb20gJ3N0cmVhbSc7CmltcG9ydCB7IFVSTCB9IGZyb20gJ3VybCc7CmltcG9ydCB7IGNyZWF0ZUd6aXAgfSBmcm9tICd6bGliJzsKaW1wb3J0ICogYXMgbmV0IGZyb20gJ25ldCc7CmltcG9ydCAqIGFzIHRscyBmcm9tICd0bHMnOwoKLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC91bmJvdW5kLW1ldGhvZApjb25zdCBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7CgovKioKICogQ2hlY2tzIHdoZXRoZXIgZ2l2ZW4gdmFsdWUncyB0eXBlIGlzIG9uZSBvZiBhIGZldyBFcnJvciBvciBFcnJvci1saWtlCiAqIHtAbGluayBpc0Vycm9yfS4KICoKICogQHBhcmFtIHdhdCBBIHZhbHVlIHRvIGJlIGNoZWNrZWQuCiAqIEByZXR1cm5zIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgdGhlIHJlc3VsdC4KICovCmZ1bmN0aW9uIGlzRXJyb3Iod2F0KSB7CiAgc3dpdGNoIChvYmplY3RUb1N0cmluZy5jYWxsKHdhdCkpIHsKICAgIGNhc2UgJ1tvYmplY3QgRXJyb3JdJzoKICAgIGNhc2UgJ1tvYmplY3QgRXhjZXB0aW9uXSc6CiAgICBjYXNlICdbb2JqZWN0IERPTUV4Y2VwdGlvbl0nOgogICAgICByZXR1cm4gdHJ1ZTsKICAgIGRlZmF1bHQ6CiAgICAgIHJldHVybiBpc0luc3RhbmNlT2Yod2F0LCBFcnJvcik7CiAgfQp9Ci8qKgogKiBDaGVja3Mgd2hldGhlciBnaXZlbiB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gYnVpbHQtaW4gY2xhc3MuCiAqCiAqIEBwYXJhbSB3YXQgVGhlIHZhbHVlIHRvIGJlIGNoZWNrZWQKICogQHBhcmFtIGNsYXNzTmFtZQogKiBAcmV0dXJucyBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIHRoZSByZXN1bHQuCiAqLwpmdW5jdGlvbiBpc0J1aWx0aW4od2F0LCBjbGFzc05hbWUpIHsKICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbCh3YXQpID09PSBgW29iamVjdCAke2NsYXNzTmFtZX1dYDsKfQoKLyoqCiAqIENoZWNrcyB3aGV0aGVyIGdpdmVuIHZhbHVlJ3MgdHlwZSBpcyBhIHN0cmluZwogKiB7QGxpbmsgaXNTdHJpbmd9LgogKgogKiBAcGFyYW0gd2F0IEEgdmFsdWUgdG8gYmUgY2hlY2tlZC4KICogQHJldHVybnMgQSBib29sZWFuIHJlcHJlc2VudGluZyB0aGUgcmVzdWx0LgogKi8KZnVuY3Rpb24gaXNTdHJpbmcod2F0KSB7CiAgcmV0dXJuIGlzQnVpbHRpbih3YXQsICdTdHJpbmcnKTsKfQoKLyoqCiAqIENoZWNrcyB3aGV0aGVyIGdpdmVuIHZhbHVlJ3MgdHlwZSBpcyBhbiBvYmplY3QgbGl0ZXJhbCwgb3IgYSBjbGFzcyBpbnN0YW5jZS4KICoge0BsaW5rIGlzUGxhaW5PYmplY3R9LgogKgogKiBAcGFyYW0gd2F0IEEgdmFsdWUgdG8gYmUgY2hlY2tlZC4KICogQHJldHVybnMgQSBib29sZWFuIHJlcHJlc2VudGluZyB0aGUgcmVzdWx0LgogKi8KZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh3YXQpIHsKICByZXR1cm4gaXNCdWlsdGluKHdhdCwgJ09iamVjdCcpOwp9CgovKioKICogQ2hlY2tzIHdoZXRoZXIgZ2l2ZW4gdmFsdWUncyB0eXBlIGlzIGFuIEV2ZW50IGluc3RhbmNlCiAqIHtAbGluayBpc0V2ZW50fS4KICoKICogQHBhcmFtIHdhdCBBIHZhbHVlIHRvIGJlIGNoZWNrZWQuCiAqIEByZXR1cm5zIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgdGhlIHJlc3VsdC4KICovCmZ1bmN0aW9uIGlzRXZlbnQod2F0KSB7CiAgcmV0dXJuIHR5cGVvZiBFdmVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNJbnN0YW5jZU9mKHdhdCwgRXZlbnQpOwp9CgovKioKICogQ2hlY2tzIHdoZXRoZXIgZ2l2ZW4gdmFsdWUncyB0eXBlIGlzIGFuIEVsZW1lbnQgaW5zdGFuY2UKICoge0BsaW5rIGlzRWxlbWVudH0uCiAqCiAqIEBwYXJhbSB3YXQgQSB2YWx1ZSB0byBiZSBjaGVja2VkLgogKiBAcmV0dXJucyBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIHRoZSByZXN1bHQuCiAqLwpmdW5jdGlvbiBpc0VsZW1lbnQod2F0KSB7CiAgcmV0dXJuIHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBpc0luc3RhbmNlT2Yod2F0LCBFbGVtZW50KTsKfQoKLyoqCiAqIENoZWNrcyB3aGV0aGVyIGdpdmVuIHZhbHVlIGhhcyBhIHRoZW4gZnVuY3Rpb24uCiAqIEBwYXJhbSB3YXQgQSB2YWx1ZSB0byBiZSBjaGVja2VkLgogKi8KZnVuY3Rpb24gaXNUaGVuYWJsZSh3YXQpIHsKICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1tZW1iZXItYWNjZXNzCiAgcmV0dXJuIEJvb2xlYW4od2F0ICYmIHdhdC50aGVuICYmIHR5cGVvZiB3YXQudGhlbiA9PT0gJ2Z1bmN0aW9uJyk7Cn0KCi8qKgogKiBDaGVja3Mgd2hldGhlciBnaXZlbiB2YWx1ZSdzIHR5cGUgaXMgYSBTeW50aGV0aWNFdmVudAogKiB7QGxpbmsgaXNTeW50aGV0aWNFdmVudH0uCiAqCiAqIEBwYXJhbSB3YXQgQSB2YWx1ZSB0byBiZSBjaGVja2VkLgogKiBAcmV0dXJucyBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIHRoZSByZXN1bHQuCiAqLwpmdW5jdGlvbiBpc1N5bnRoZXRpY0V2ZW50KHdhdCkgewogIHJldHVybiBpc1BsYWluT2JqZWN0KHdhdCkgJiYgJ25hdGl2ZUV2ZW50JyBpbiB3YXQgJiYgJ3ByZXZlbnREZWZhdWx0JyBpbiB3YXQgJiYgJ3N0b3BQcm9wYWdhdGlvbicgaW4gd2F0Owp9CgovKioKICogQ2hlY2tzIHdoZXRoZXIgZ2l2ZW4gdmFsdWUgaXMgTmFOCiAqIHtAbGluayBpc05hTn0uCiAqCiAqIEBwYXJhbSB3YXQgQSB2YWx1ZSB0byBiZSBjaGVja2VkLgogKiBAcmV0dXJucyBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIHRoZSByZXN1bHQuCiAqLwpmdW5jdGlvbiBpc05hTiQxKHdhdCkgewogIHJldHVybiB0eXBlb2Ygd2F0ID09PSAnbnVtYmVyJyAmJiB3YXQgIT09IHdhdDsKfQoKLyoqCiAqIENoZWNrcyB3aGV0aGVyIGdpdmVuIHZhbHVlJ3MgdHlwZSBpcyBhbiBpbnN0YW5jZSBvZiBwcm92aWRlZCBjb25zdHJ1Y3Rvci4KICoge0BsaW5rIGlzSW5zdGFuY2VPZn0uCiAqCiAqIEBwYXJhbSB3YXQgQSB2YWx1ZSB0byBiZSBjaGVja2VkLgogKiBAcGFyYW0gYmFzZSBBIGNvbnN0cnVjdG9yIHRvIGJlIHVzZWQgaW4gYSBjaGVjay4KICogQHJldHVybnMgQSBib29sZWFuIHJlcHJlc2VudGluZyB0aGUgcmVzdWx0LgogKi8KZnVuY3Rpb24gaXNJbnN0YW5jZU9mKHdhdCwgYmFzZSkgewogIHRyeSB7CiAgICByZXR1cm4gd2F0IGluc3RhbmNlb2YgYmFzZTsKICB9IGNhdGNoIChfZSkgewogICAgcmV0dXJuIGZhbHNlOwogIH0KfQoKLyoqCiAqIENoZWNrcyB3aGV0aGVyIGdpdmVuIHZhbHVlJ3MgdHlwZSBpcyBhIFZ1ZSBWaWV3TW9kZWwuCiAqCiAqIEBwYXJhbSB3YXQgQSB2YWx1ZSB0byBiZSBjaGVja2VkLgogKiBAcmV0dXJucyBBIGJvb2xlYW4gcmVwcmVzZW50aW5nIHRoZSByZXN1bHQuCiAqLwpmdW5jdGlvbiBpc1Z1ZVZpZXdNb2RlbCh3YXQpIHsKICAvLyBOb3QgdXNpbmcgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyBiZWNhdXNlIGluIFZ1ZSAzIGl0IHdvdWxkIHJlYWQgdGhlIGluc3RhbmNlJ3MgU3ltYm9sKFN5bWJvbC50b1N0cmluZ1RhZykgcHJvcGVydHkuCiAgcmV0dXJuICEhKHR5cGVvZiB3YXQgPT09ICdvYmplY3QnICYmIHdhdCAhPT0gbnVsbCAmJiAoKHdhdCApLl9faXNWdWUgfHwgKHdhdCApLl9pc1Z1ZSkpOwp9CgovKiogSW50ZXJuYWwgZ2xvYmFsIHdpdGggY29tbW9uIHByb3BlcnRpZXMgYW5kIFNlbnRyeSBleHRlbnNpb25zICAqLwoKLy8gVGhlIGNvZGUgYmVsb3cgZm9yICdpc0dsb2JhbE9iaicgYW5kICdHTE9CQUxfT0JKJyB3YXMgY29waWVkIGZyb20gY29yZS1qcyBiZWZvcmUgbW9kaWZpY2F0aW9uCi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2Jsb2IvMWI5NDRkZjU1MjgyY2RjOTljOTBkYjVmNDllYjBiNmVkYTJjYzBhMy9wYWNrYWdlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanMKLy8gY29yZS1qcyBoYXMgdGhlIGZvbGxvd2luZyBsaWNlbmNlOgovLwovLyBDb3B5cmlnaHQgKGMpIDIwMTQtMjAyMiBEZW5pcyBQdXNoa2FyZXYKLy8KLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weQovLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAiU29mdHdhcmUiKSwgdG8gZGVhbAovLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzCi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwKLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzCi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6Ci8vCi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluCi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLgovLwovLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgIkFTIElTIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUgovLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwKLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFCi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIKLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwKLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTgovLyBUSEUgU09GVFdBUkUuCgovKiogUmV0dXJucyAnb2JqJyBpZiBpdCdzIHRoZSBnbG9iYWwgb2JqZWN0LCBvdGhlcndpc2UgcmV0dXJucyB1bmRlZmluZWQgKi8KZnVuY3Rpb24gaXNHbG9iYWxPYmoob2JqKSB7CiAgcmV0dXJuIG9iaiAmJiBvYmouTWF0aCA9PSBNYXRoID8gb2JqIDogdW5kZWZpbmVkOwp9CgovKiogR2V0J3MgdGhlIGdsb2JhbCBvYmplY3QgZm9yIHRoZSBjdXJyZW50IEphdmFTY3JpcHQgcnVudGltZSAqLwpjb25zdCBHTE9CQUxfT0JKID0KICAodHlwZW9mIGdsb2JhbFRoaXMgPT0gJ29iamVjdCcgJiYgaXNHbG9iYWxPYmooZ2xvYmFsVGhpcykpIHx8CiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscwogICh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIGlzR2xvYmFsT2JqKHdpbmRvdykpIHx8CiAgKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIGlzR2xvYmFsT2JqKHNlbGYpKSB8fAogICh0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGlzR2xvYmFsT2JqKGdsb2JhbCkpIHx8CiAgKGZ1bmN0aW9uICgpIHsKICAgIHJldHVybiB0aGlzOwogIH0pKCkgfHwKICB7fTsKCi8qKgogKiBAZGVwcmVjYXRlZCBVc2UgR0xPQkFMX09CSiBpbnN0ZWFkIG9yIFdJTkRPVyBmcm9tIEBzZW50cnkvYnJvd3Nlci4gVGhpcyB3aWxsIGJlIHJlbW92ZWQgaW4gdjgKICovCmZ1bmN0aW9uIGdldEdsb2JhbE9iamVjdCgpIHsKICByZXR1cm4gR0xPQkFMX09CSiA7Cn0KCi8qKgogKiBSZXR1cm5zIGEgZ2xvYmFsIHNpbmdsZXRvbiBjb250YWluZWQgaW4gdGhlIGdsb2JhbCBgX19TRU5UUllfX2Agb2JqZWN0LgogKgogKiBJZiB0aGUgc2luZ2xldG9uIGRvZXNuJ3QgYWxyZWFkeSBleGlzdCBpbiBgX19TRU5UUllfX2AsIGl0IHdpbGwgYmUgY3JlYXRlZCB1c2luZyB0aGUgZ2l2ZW4gZmFjdG9yeQogKiBmdW5jdGlvbiBhbmQgYWRkZWQgdG8gdGhlIGBfX1NFTlRSWV9fYCBvYmplY3QuCiAqCiAqIEBwYXJhbSBuYW1lIG5hbWUgb2YgdGhlIGdsb2JhbCBzaW5nbGV0b24gb24gX19TRU5UUllfXwogKiBAcGFyYW0gY3JlYXRvciBjcmVhdG9yIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBzaW5nbGV0b24gaWYgaXQgZG9lc24ndCBhbHJlYWR5IGV4aXN0IG9uIGBfX1NFTlRSWV9fYAogKiBAcGFyYW0gb2JqIChPcHRpb25hbCkgVGhlIGdsb2JhbCBvYmplY3Qgb24gd2hpY2ggdG8gbG9vayBmb3IgYF9fU0VOVFJZX19gLCBpZiBub3QgYEdMT0JBTF9PQkpgJ3MgcmV0dXJuIHZhbHVlCiAqIEByZXR1cm5zIHRoZSBzaW5nbGV0b24KICovCmZ1bmN0aW9uIGdldEdsb2JhbFNpbmdsZXRvbihuYW1lLCBjcmVhdG9yLCBvYmopIHsKICBjb25zdCBnYmwgPSAob2JqIHx8IEdMT0JBTF9PQkopIDsKICBjb25zdCBfX1NFTlRSWV9fID0gKGdibC5fX1NFTlRSWV9fID0gZ2JsLl9fU0VOVFJZX18gfHwge30pOwogIGNvbnN0IHNpbmdsZXRvbiA9IF9fU0VOVFJZX19bbmFtZV0gfHwgKF9fU0VOVFJZX19bbmFtZV0gPSBjcmVhdG9yKCkpOwogIHJldHVybiBzaW5nbGV0b247Cn0KCi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgpjb25zdCBXSU5ET1cgPSBnZXRHbG9iYWxPYmplY3QoKTsKCmNvbnN0IERFRkFVTFRfTUFYX1NUUklOR19MRU5HVEggPSA4MDsKCi8qKgogKiBHaXZlbiBhIGNoaWxkIERPTSBlbGVtZW50LCByZXR1cm5zIGEgcXVlcnktc2VsZWN0b3Igc3RhdGVtZW50IGRlc2NyaWJpbmcgdGhhdAogKiBhbmQgaXRzIGFuY2VzdG9ycwogKiBlLmcuIFtIVE1MRWxlbWVudF0gPT4gYm9keSA+IGRpdiA+IGlucHV0I2Zvby5idG5bbmFtZT1iYXpdCiAqIEByZXR1cm5zIGdlbmVyYXRlZCBET00gcGF0aAogKi8KZnVuY3Rpb24gaHRtbFRyZWVBc1N0cmluZygKICBlbGVtLAogIG9wdGlvbnMgPSB7fSwKKSB7CiAgaWYgKCFlbGVtKSB7CiAgICByZXR1cm4gJzx1bmtub3duPic7CiAgfQoKICAvLyB0cnkvY2F0Y2ggYm90aDoKICAvLyAtIGFjY2Vzc2luZyBldmVudC50YXJnZXQgKHNlZSBnZXRzZW50cnkvcmF2ZW4tanMjODM4LCAjNzY4KQogIC8vIC0gYGh0bWxUcmVlQXNTdHJpbmdgIGJlY2F1c2UgaXQncyBjb21wbGV4LCBhbmQganVzdCBhY2Nlc3NpbmcgdGhlIERPTSBpbmNvcnJlY3RseQogIC8vIC0gY2FuIHRocm93IGFuIGV4Y2VwdGlvbiBpbiBzb21lIGNpcmN1bXN0YW5jZXMuCiAgdHJ5IHsKICAgIGxldCBjdXJyZW50RWxlbSA9IGVsZW0gOwogICAgY29uc3QgTUFYX1RSQVZFUlNFX0hFSUdIVCA9IDU7CiAgICBjb25zdCBvdXQgPSBbXTsKICAgIGxldCBoZWlnaHQgPSAwOwogICAgbGV0IGxlbiA9IDA7CiAgICBjb25zdCBzZXBhcmF0b3IgPSAnID4gJzsKICAgIGNvbnN0IHNlcExlbmd0aCA9IHNlcGFyYXRvci5sZW5ndGg7CiAgICBsZXQgbmV4dFN0cjsKICAgIGNvbnN0IGtleUF0dHJzID0gQXJyYXkuaXNBcnJheShvcHRpb25zKSA/IG9wdGlvbnMgOiBvcHRpb25zLmtleUF0dHJzOwogICAgY29uc3QgbWF4U3RyaW5nTGVuZ3RoID0gKCFBcnJheS5pc0FycmF5KG9wdGlvbnMpICYmIG9wdGlvbnMubWF4U3RyaW5nTGVuZ3RoKSB8fCBERUZBVUxUX01BWF9TVFJJTkdfTEVOR1RIOwoKICAgIHdoaWxlIChjdXJyZW50RWxlbSAmJiBoZWlnaHQrKyA8IE1BWF9UUkFWRVJTRV9IRUlHSFQpIHsKICAgICAgbmV4dFN0ciA9IF9odG1sRWxlbWVudEFzU3RyaW5nKGN1cnJlbnRFbGVtLCBrZXlBdHRycyk7CiAgICAgIC8vIGJhaWwgb3V0IGlmCiAgICAgIC8vIC0gbmV4dFN0ciBpcyB0aGUgJ2h0bWwnIGVsZW1lbnQKICAgICAgLy8gLSB0aGUgbGVuZ3RoIG9mIHRoZSBzdHJpbmcgdGhhdCB3b3VsZCBiZSBjcmVhdGVkIGV4Y2VlZHMgbWF4U3RyaW5nTGVuZ3RoCiAgICAgIC8vICAgKGlnbm9yZSB0aGlzIGxpbWl0IGlmIHdlIGFyZSBvbiB0aGUgZmlyc3QgaXRlcmF0aW9uKQogICAgICBpZiAobmV4dFN0ciA9PT0gJ2h0bWwnIHx8IChoZWlnaHQgPiAxICYmIGxlbiArIG91dC5sZW5ndGggKiBzZXBMZW5ndGggKyBuZXh0U3RyLmxlbmd0aCA+PSBtYXhTdHJpbmdMZW5ndGgpKSB7CiAgICAgICAgYnJlYWs7CiAgICAgIH0KCiAgICAgIG91dC5wdXNoKG5leHRTdHIpOwoKICAgICAgbGVuICs9IG5leHRTdHIubGVuZ3RoOwogICAgICBjdXJyZW50RWxlbSA9IGN1cnJlbnRFbGVtLnBhcmVudE5vZGU7CiAgICB9CgogICAgcmV0dXJuIG91dC5yZXZlcnNlKCkuam9pbihzZXBhcmF0b3IpOwogIH0gY2F0Y2ggKF9vTykgewogICAgcmV0dXJuICc8dW5rbm93bj4nOwogIH0KfQoKLyoqCiAqIFJldHVybnMgYSBzaW1wbGUsIHF1ZXJ5LXNlbGVjdG9yIHJlcHJlc2VudGF0aW9uIG9mIGEgRE9NIGVsZW1lbnQKICogZS5nLiBbSFRNTEVsZW1lbnRdID0+IGlucHV0I2Zvby5idG5bbmFtZT1iYXpdCiAqIEByZXR1cm5zIGdlbmVyYXRlZCBET00gcGF0aAogKi8KZnVuY3Rpb24gX2h0bWxFbGVtZW50QXNTdHJpbmcoZWwsIGtleUF0dHJzKSB7CiAgY29uc3QgZWxlbSA9IGVsCgo7CgogIGNvbnN0IG91dCA9IFtdOwogIGxldCBjbGFzc05hbWU7CiAgbGV0IGNsYXNzZXM7CiAgbGV0IGtleTsKICBsZXQgYXR0cjsKICBsZXQgaTsKCiAgaWYgKCFlbGVtIHx8ICFlbGVtLnRhZ05hbWUpIHsKICAgIHJldHVybiAnJzsKICB9CgogIC8vIEB0cy1leHBlY3QtZXJyb3IgV0lORE9XIGhhcyBIVE1MRWxlbWVudAogIGlmIChXSU5ET1cuSFRNTEVsZW1lbnQpIHsKICAgIC8vIElmIHVzaW5nIHRoZSBjb21wb25lbnQgbmFtZSBhbm5vdGF0aW9uIHBsdWdpbiwgdGhpcyB2YWx1ZSBtYXkgYmUgYXZhaWxhYmxlIG9uIHRoZSBET00gbm9kZQogICAgaWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCAmJiBlbGVtLmRhdGFzZXQgJiYgZWxlbS5kYXRhc2V0WydzZW50cnlDb21wb25lbnQnXSkgewogICAgICByZXR1cm4gZWxlbS5kYXRhc2V0WydzZW50cnlDb21wb25lbnQnXTsKICAgIH0KICB9CgogIG91dC5wdXNoKGVsZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpKTsKCiAgLy8gUGFpcnMgb2YgYXR0cmlidXRlIGtleXMgZGVmaW5lZCBpbiBgc2VyaWFsaXplQXR0cmlidXRlYCBhbmQgdGhlaXIgdmFsdWVzIG9uIGVsZW1lbnQuCiAgY29uc3Qga2V5QXR0clBhaXJzID0KICAgIGtleUF0dHJzICYmIGtleUF0dHJzLmxlbmd0aAogICAgICA/IGtleUF0dHJzLmZpbHRlcihrZXlBdHRyID0+IGVsZW0uZ2V0QXR0cmlidXRlKGtleUF0dHIpKS5tYXAoa2V5QXR0ciA9PiBba2V5QXR0ciwgZWxlbS5nZXRBdHRyaWJ1dGUoa2V5QXR0cildKQogICAgICA6IG51bGw7CgogIGlmIChrZXlBdHRyUGFpcnMgJiYga2V5QXR0clBhaXJzLmxlbmd0aCkgewogICAga2V5QXR0clBhaXJzLmZvckVhY2goa2V5QXR0clBhaXIgPT4gewogICAgICBvdXQucHVzaChgWyR7a2V5QXR0clBhaXJbMF19PSIke2tleUF0dHJQYWlyWzFdfSJdYCk7CiAgICB9KTsKICB9IGVsc2UgewogICAgaWYgKGVsZW0uaWQpIHsKICAgICAgb3V0LnB1c2goYCMke2VsZW0uaWR9YCk7CiAgICB9CgogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci1jb25zdAogICAgY2xhc3NOYW1lID0gZWxlbS5jbGFzc05hbWU7CiAgICBpZiAoY2xhc3NOYW1lICYmIGlzU3RyaW5nKGNsYXNzTmFtZSkpIHsKICAgICAgY2xhc3NlcyA9IGNsYXNzTmFtZS5zcGxpdCgvXHMrLyk7CiAgICAgIGZvciAoaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgb3V0LnB1c2goYC4ke2NsYXNzZXNbaV19YCk7CiAgICAgIH0KICAgIH0KICB9CiAgY29uc3QgYWxsb3dlZEF0dHJzID0gWydhcmlhLWxhYmVsJywgJ3R5cGUnLCAnbmFtZScsICd0aXRsZScsICdhbHQnXTsKICBmb3IgKGkgPSAwOyBpIDwgYWxsb3dlZEF0dHJzLmxlbmd0aDsgaSsrKSB7CiAgICBrZXkgPSBhbGxvd2VkQXR0cnNbaV07CiAgICBhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoa2V5KTsKICAgIGlmIChhdHRyKSB7CiAgICAgIG91dC5wdXNoKGBbJHtrZXl9PSIke2F0dHJ9Il1gKTsKICAgIH0KICB9CiAgcmV0dXJuIG91dC5qb2luKCcnKTsKfQoKLyoqCiAqIFRoaXMgc2VydmVzIGFzIGEgYnVpbGQgdGltZSBmbGFnIHRoYXQgd2lsbCBiZSB0cnVlIGJ5IGRlZmF1bHQsIGJ1dCBmYWxzZSBpbiBub24tZGVidWcgYnVpbGRzIG9yIGlmIHVzZXJzIHJlcGxhY2UgYF9fU0VOVFJZX0RFQlVHX19gIGluIHRoZWlyIGdlbmVyYXRlZCBjb2RlLgogKgogKiBBVFRFTlRJT046IFRoaXMgY29uc3RhbnQgbXVzdCBuZXZlciBjcm9zcyBwYWNrYWdlIGJvdW5kYXJpZXMgKGkuZS4gYmUgZXhwb3J0ZWQpIHRvIGd1YXJhbnRlZSB0aGF0IGl0IGNhbiBiZSB1c2VkIGZvciB0cmVlIHNoYWtpbmcuCiAqLwpjb25zdCBERUJVR19CVUlMRCQxID0gKHR5cGVvZiBfX1NFTlRSWV9ERUJVR19fID09PSAndW5kZWZpbmVkJyB8fCBfX1NFTlRSWV9ERUJVR19fKTsKCi8qKiBQcmVmaXggZm9yIGxvZ2dpbmcgc3RyaW5ncyAqLwpjb25zdCBQUkVGSVggPSAnU2VudHJ5IExvZ2dlciAnOwoKY29uc3QgQ09OU09MRV9MRVZFTFMgPSBbCiAgJ2RlYnVnJywKICAnaW5mbycsCiAgJ3dhcm4nLAogICdlcnJvcicsCiAgJ2xvZycsCiAgJ2Fzc2VydCcsCiAgJ3RyYWNlJywKXSA7CgovKiogVGhpcyBtYXkgYmUgbXV0YXRlZCBieSB0aGUgY29uc29sZSBpbnN0cnVtZW50YXRpb24uICovCmNvbnN0IG9yaWdpbmFsQ29uc29sZU1ldGhvZHMKCiA9IHt9OwoKLyoqIEpTRG9jICovCgovKioKICogVGVtcG9yYXJpbHkgZGlzYWJsZSBzZW50cnkgY29uc29sZSBpbnN0cnVtZW50YXRpb25zLgogKgogKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIHRvIHJ1biBhZ2FpbnN0IHRoZSBvcmlnaW5hbCBgY29uc29sZWAgbWVzc2FnZXMKICogQHJldHVybnMgVGhlIHJlc3VsdHMgb2YgdGhlIGNhbGxiYWNrCiAqLwpmdW5jdGlvbiBjb25zb2xlU2FuZGJveChjYWxsYmFjaykgewogIGlmICghKCdjb25zb2xlJyBpbiBHTE9CQUxfT0JKKSkgewogICAgcmV0dXJuIGNhbGxiYWNrKCk7CiAgfQoKICBjb25zdCBjb25zb2xlID0gR0xPQkFMX09CSi5jb25zb2xlIDsKICBjb25zdCB3cmFwcGVkRnVuY3MgPSB7fTsKCiAgY29uc3Qgd3JhcHBlZExldmVscyA9IE9iamVjdC5rZXlzKG9yaWdpbmFsQ29uc29sZU1ldGhvZHMpIDsKCiAgLy8gUmVzdG9yZSBhbGwgd3JhcHBlZCBjb25zb2xlIG1ldGhvZHMKICB3cmFwcGVkTGV2ZWxzLmZvckVhY2gobGV2ZWwgPT4gewogICAgY29uc3Qgb3JpZ2luYWxDb25zb2xlTWV0aG9kID0gb3JpZ2luYWxDb25zb2xlTWV0aG9kc1tsZXZlbF0gOwogICAgd3JhcHBlZEZ1bmNzW2xldmVsXSA9IGNvbnNvbGVbbGV2ZWxdIDsKICAgIGNvbnNvbGVbbGV2ZWxdID0gb3JpZ2luYWxDb25zb2xlTWV0aG9kOwogIH0pOwoKICB0cnkgewogICAgcmV0dXJuIGNhbGxiYWNrKCk7CiAgfSBmaW5hbGx5IHsKICAgIC8vIFJldmVydCByZXN0b3JhdGlvbiB0byB3cmFwcGVkIHN0YXRlCiAgICB3cmFwcGVkTGV2ZWxzLmZvckVhY2gobGV2ZWwgPT4gewogICAgICBjb25zb2xlW2xldmVsXSA9IHdyYXBwZWRGdW5jc1tsZXZlbF0gOwogICAgfSk7CiAgfQp9CgpmdW5jdGlvbiBtYWtlTG9nZ2VyKCkgewogIGxldCBlbmFibGVkID0gZmFsc2U7CiAgY29uc3QgbG9nZ2VyID0gewogICAgZW5hYmxlOiAoKSA9PiB7CiAgICAgIGVuYWJsZWQgPSB0cnVlOwogICAgfSwKICAgIGRpc2FibGU6ICgpID0+IHsKICAgICAgZW5hYmxlZCA9IGZhbHNlOwogICAgfSwKICAgIGlzRW5hYmxlZDogKCkgPT4gZW5hYmxlZCwKICB9OwoKICBpZiAoREVCVUdfQlVJTEQkMSkgewogICAgQ09OU09MRV9MRVZFTFMuZm9yRWFjaChuYW1lID0+IHsKICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkKICAgICAgbG9nZ2VyW25hbWVdID0gKC4uLmFyZ3MpID0+IHsKICAgICAgICBpZiAoZW5hYmxlZCkgewogICAgICAgICAgY29uc29sZVNhbmRib3goKCkgPT4gewogICAgICAgICAgICBHTE9CQUxfT0JKLmNvbnNvbGVbbmFtZV0oYCR7UFJFRklYfVske25hbWV9XTpgLCAuLi5hcmdzKTsKICAgICAgICAgIH0pOwogICAgICAgIH0KICAgICAgfTsKICAgIH0pOwogIH0gZWxzZSB7CiAgICBDT05TT0xFX0xFVkVMUy5mb3JFYWNoKG5hbWUgPT4gewogICAgICBsb2dnZXJbbmFtZV0gPSAoKSA9PiB1bmRlZmluZWQ7CiAgICB9KTsKICB9CgogIHJldHVybiBsb2dnZXIgOwp9Cgpjb25zdCBsb2dnZXIgPSBtYWtlTG9nZ2VyKCk7CgovKioKICogUmVuZGVycyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgRHNuLgogKgogKiBCeSBkZWZhdWx0LCB0aGlzIHdpbGwgcmVuZGVyIHRoZSBwdWJsaWMgcmVwcmVzZW50YXRpb24gd2l0aG91dCB0aGUgcGFzc3dvcmQKICogY29tcG9uZW50LiBUbyBnZXQgdGhlIGRlcHJlY2F0ZWQgcHJpdmF0ZSByZXByZXNlbnRhdGlvbiwgc2V0IGB3aXRoUGFzc3dvcmRgCiAqIHRvIHRydWUuCiAqCiAqIEBwYXJhbSB3aXRoUGFzc3dvcmQgV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIHBhc3N3b3JkIHdpbGwgYmUgaW5jbHVkZWQuCiAqLwpmdW5jdGlvbiBkc25Ub1N0cmluZyhkc24sIHdpdGhQYXNzd29yZCA9IGZhbHNlKSB7CiAgY29uc3QgeyBob3N0LCBwYXRoLCBwYXNzLCBwb3J0LCBwcm9qZWN0SWQsIHByb3RvY29sLCBwdWJsaWNLZXkgfSA9IGRzbjsKICByZXR1cm4gKAogICAgYCR7cHJvdG9jb2x9Oi8vJHtwdWJsaWNLZXl9JHt3aXRoUGFzc3dvcmQgJiYgcGFzcyA/IGA6JHtwYXNzfWAgOiAnJ31gICsKICAgIGBAJHtob3N0fSR7cG9ydCA/IGA6JHtwb3J0fWAgOiAnJ30vJHtwYXRoID8gYCR7cGF0aH0vYCA6IHBhdGh9JHtwcm9qZWN0SWR9YAogICk7Cn0KCi8qKiBBbiBlcnJvciBlbWl0dGVkIGJ5IFNlbnRyeSBTREtzIGFuZCByZWxhdGVkIHV0aWxpdGllcy4gKi8KY2xhc3MgU2VudHJ5RXJyb3IgZXh0ZW5kcyBFcnJvciB7CiAgLyoqIERpc3BsYXkgbmFtZSBvZiB0aGlzIGVycm9yIGluc3RhbmNlLiAqLwoKICAgY29uc3RydWN0b3IoIG1lc3NhZ2UsIGxvZ0xldmVsID0gJ3dhcm4nKSB7CiAgICBzdXBlcihtZXNzYWdlKTt0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlOwogICAgdGhpcy5uYW1lID0gbmV3LnRhcmdldC5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZTsKICAgIC8vIFRoaXMgc2V0cyB0aGUgcHJvdG90eXBlIHRvIGJlIGBFcnJvcmAsIG5vdCBgU2VudHJ5RXJyb3JgLiBJdCdzIHVuY2xlYXIgd2h5IHdlIGRvIHRoaXMsIGJ1dCBjb21tZW50aW5nIHRoaXMgbGluZQogICAgLy8gb3V0IGNhdXNlcyB2YXJpb3VzIChzZWVtaW5nbHkgdG90YWxseSB1bnJlbGF0ZWQpIHBsYXl3cmlnaHQgdGVzdHMgY29uc2lzdGVudGx5IHRpbWUgb3V0LiBGWUksIHRoaXMgbWFrZXMKICAgIC8vIGluc3RhbmNlcyBvZiBgU2VudHJ5RXJyb3JgIGZhaWwgYG9iaiBpbnN0YW5jZW9mIFNlbnRyeUVycm9yYCBjaGVja3MuCiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgbmV3LnRhcmdldC5wcm90b3R5cGUpOwogICAgdGhpcy5sb2dMZXZlbCA9IGxvZ0xldmVsOwogIH0KfQoKLyoqCiAqIEVuY29kZXMgZ2l2ZW4gb2JqZWN0IGludG8gdXJsLWZyaWVuZGx5IGZvcm1hdAogKgogKiBAcGFyYW0gb2JqZWN0IEFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHNlcmlhbGl6YWJsZSB2YWx1ZXMKICogQHJldHVybnMgc3RyaW5nIEVuY29kZWQKICovCmZ1bmN0aW9uIHVybEVuY29kZShvYmplY3QpIHsKICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KQogICAgLm1hcChrZXkgPT4gYCR7ZW5jb2RlVVJJQ29tcG9uZW50KGtleSl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KG9iamVjdFtrZXldKX1gKQogICAgLmpvaW4oJyYnKTsKfQoKLyoqCiAqIFRyYW5zZm9ybXMgYW55IGBFcnJvcmAgb3IgYEV2ZW50YCBpbnRvIGEgcGxhaW4gb2JqZWN0IHdpdGggYWxsIG9mIHRoZWlyIGVudW1lcmFibGUgcHJvcGVydGllcywgYW5kIHNvbWUgb2YgdGhlaXIKICogbm9uLWVudW1lcmFibGUgcHJvcGVydGllcyBhdHRhY2hlZC4KICoKICogQHBhcmFtIHZhbHVlIEluaXRpYWwgc291cmNlIHRoYXQgd2UgaGF2ZSB0byB0cmFuc2Zvcm0gaW4gb3JkZXIgZm9yIGl0IHRvIGJlIHVzYWJsZSBieSB0aGUgc2VyaWFsaXplcgogKiBAcmV0dXJucyBBbiBFdmVudCBvciBFcnJvciB0dXJuZWQgaW50byBhbiBvYmplY3QgLSBvciB0aGUgdmFsdWUgYXJndXJtZW50IGl0c2VsZiwgd2hlbiB2YWx1ZSBpcyBuZWl0aGVyIGFuIEV2ZW50IG5vcgogKiAgYW4gRXJyb3IuCiAqLwpmdW5jdGlvbiBjb252ZXJ0VG9QbGFpbk9iamVjdCgKICB2YWx1ZSwKKQoKIHsKICBpZiAoaXNFcnJvcih2YWx1ZSkpIHsKICAgIHJldHVybiB7CiAgICAgIG1lc3NhZ2U6IHZhbHVlLm1lc3NhZ2UsCiAgICAgIG5hbWU6IHZhbHVlLm5hbWUsCiAgICAgIHN0YWNrOiB2YWx1ZS5zdGFjaywKICAgICAgLi4uZ2V0T3duUHJvcGVydGllcyh2YWx1ZSksCiAgICB9OwogIH0gZWxzZSBpZiAoaXNFdmVudCh2YWx1ZSkpIHsKICAgIGNvbnN0IG5ld09iagoKID0gewogICAgICB0eXBlOiB2YWx1ZS50eXBlLAogICAgICB0YXJnZXQ6IHNlcmlhbGl6ZUV2ZW50VGFyZ2V0KHZhbHVlLnRhcmdldCksCiAgICAgIGN1cnJlbnRUYXJnZXQ6IHNlcmlhbGl6ZUV2ZW50VGFyZ2V0KHZhbHVlLmN1cnJlbnRUYXJnZXQpLAogICAgICAuLi5nZXRPd25Qcm9wZXJ0aWVzKHZhbHVlKSwKICAgIH07CgogICAgaWYgKHR5cGVvZiBDdXN0b21FdmVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNJbnN0YW5jZU9mKHZhbHVlLCBDdXN0b21FdmVudCkpIHsKICAgICAgbmV3T2JqLmRldGFpbCA9IHZhbHVlLmRldGFpbDsKICAgIH0KCiAgICByZXR1cm4gbmV3T2JqOwogIH0gZWxzZSB7CiAgICByZXR1cm4gdmFsdWU7CiAgfQp9CgovKiogQ3JlYXRlcyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdGFyZ2V0IG9mIGFuIGBFdmVudGAgb2JqZWN0ICovCmZ1bmN0aW9uIHNlcmlhbGl6ZUV2ZW50VGFyZ2V0KHRhcmdldCkgewogIHRyeSB7CiAgICByZXR1cm4gaXNFbGVtZW50KHRhcmdldCkgPyBodG1sVHJlZUFzU3RyaW5nKHRhcmdldCkgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFyZ2V0KTsKICB9IGNhdGNoIChfb08pIHsKICAgIHJldHVybiAnPHVua25vd24+JzsKICB9Cn0KCi8qKiBGaWx0ZXJzIG91dCBhbGwgYnV0IGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzICovCmZ1bmN0aW9uIGdldE93blByb3BlcnRpZXMob2JqKSB7CiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkgewogICAgY29uc3QgZXh0cmFjdGVkUHJvcHMgPSB7fTsKICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gb2JqKSB7CiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wZXJ0eSkpIHsKICAgICAgICBleHRyYWN0ZWRQcm9wc1twcm9wZXJ0eV0gPSAob2JqIClbcHJvcGVydHldOwogICAgICB9CiAgICB9CiAgICByZXR1cm4gZXh0cmFjdGVkUHJvcHM7CiAgfSBlbHNlIHsKICAgIHJldHVybiB7fTsKICB9Cn0KCi8qKgogKiBHaXZlbiBhbnkgb2JqZWN0LCByZXR1cm4gYSBuZXcgb2JqZWN0IGhhdmluZyByZW1vdmVkIGFsbCBmaWVsZHMgd2hvc2UgdmFsdWUgd2FzIGB1bmRlZmluZWRgLgogKiBXb3JrcyByZWN1cnNpdmVseSBvbiBvYmplY3RzIGFuZCBhcnJheXMuCiAqCiAqIEF0dGVudGlvbjogVGhpcyBmdW5jdGlvbiBrZWVwcyBjaXJjdWxhciByZWZlcmVuY2VzIGluIHRoZSByZXR1cm5lZCBvYmplY3QuCiAqLwpmdW5jdGlvbiBkcm9wVW5kZWZpbmVkS2V5cyhpbnB1dFZhbHVlKSB7CiAgLy8gVGhpcyBtYXAga2VlcHMgdHJhY2sgb2Ygd2hhdCBhbHJlYWR5IHZpc2l0ZWQgbm9kZXMgbWFwIHRvLgogIC8vIE91ciBTZXQgLSBiYXNlZCBtZW1vQnVpbGRlciBkb2Vzbid0IHdvcmsgaGVyZSBiZWNhdXNlIHdlIHdhbnQgdG8gdGhlIG91dHB1dCBvYmplY3QgdG8gaGF2ZSB0aGUgc2FtZSBjaXJjdWxhcgogIC8vIHJlZmVyZW5jZXMgYXMgdGhlIGlucHV0IG9iamVjdC4KICBjb25zdCBtZW1vaXphdGlvbk1hcCA9IG5ldyBNYXAoKTsKCiAgLy8gVGhpcyBmdW5jdGlvbiBqdXN0IHByb3hpZXMgYF9kcm9wVW5kZWZpbmVkS2V5c2AgdG8ga2VlcCB0aGUgYG1lbW9CdWlsZGVyYCBvdXQgb2YgdGhpcyBmdW5jdGlvbidzIEFQSQogIHJldHVybiBfZHJvcFVuZGVmaW5lZEtleXMoaW5wdXRWYWx1ZSwgbWVtb2l6YXRpb25NYXApOwp9CgpmdW5jdGlvbiBfZHJvcFVuZGVmaW5lZEtleXMoaW5wdXRWYWx1ZSwgbWVtb2l6YXRpb25NYXApIHsKICBpZiAoaXNQb2pvKGlucHV0VmFsdWUpKSB7CiAgICAvLyBJZiB0aGlzIG5vZGUgaGFzIGFscmVhZHkgYmVlbiB2aXNpdGVkIGR1ZSB0byBhIGNpcmN1bGFyIHJlZmVyZW5jZSwgcmV0dXJuIHRoZSBvYmplY3QgaXQgd2FzIG1hcHBlZCB0byBpbiB0aGUgbmV3IG9iamVjdAogICAgY29uc3QgbWVtb1ZhbCA9IG1lbW9pemF0aW9uTWFwLmdldChpbnB1dFZhbHVlKTsKICAgIGlmIChtZW1vVmFsICE9PSB1bmRlZmluZWQpIHsKICAgICAgcmV0dXJuIG1lbW9WYWwgOwogICAgfQoKICAgIGNvbnN0IHJldHVyblZhbHVlID0ge307CiAgICAvLyBTdG9yZSB0aGUgbWFwcGluZyBvZiB0aGlzIHZhbHVlIGluIGNhc2Ugd2UgdmlzaXQgaXQgYWdhaW4sIGluIGNhc2Ugb2YgY2lyY3VsYXIgZGF0YQogICAgbWVtb2l6YXRpb25NYXAuc2V0KGlucHV0VmFsdWUsIHJldHVyblZhbHVlKTsKCiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhpbnB1dFZhbHVlKSkgewogICAgICBpZiAodHlwZW9mIGlucHV0VmFsdWVba2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHsKICAgICAgICByZXR1cm5WYWx1ZVtrZXldID0gX2Ryb3BVbmRlZmluZWRLZXlzKGlucHV0VmFsdWVba2V5XSwgbWVtb2l6YXRpb25NYXApOwogICAgICB9CiAgICB9CgogICAgcmV0dXJuIHJldHVyblZhbHVlIDsKICB9CgogIGlmIChBcnJheS5pc0FycmF5KGlucHV0VmFsdWUpKSB7CiAgICAvLyBJZiB0aGlzIG5vZGUgaGFzIGFscmVhZHkgYmVlbiB2aXNpdGVkIGR1ZSB0byBhIGNpcmN1bGFyIHJlZmVyZW5jZSwgcmV0dXJuIHRoZSBhcnJheSBpdCB3YXMgbWFwcGVkIHRvIGluIHRoZSBuZXcgb2JqZWN0CiAgICBjb25zdCBtZW1vVmFsID0gbWVtb2l6YXRpb25NYXAuZ2V0KGlucHV0VmFsdWUpOwogICAgaWYgKG1lbW9WYWwgIT09IHVuZGVmaW5lZCkgewogICAgICByZXR1cm4gbWVtb1ZhbCA7CiAgICB9CgogICAgY29uc3QgcmV0dXJuVmFsdWUgPSBbXTsKICAgIC8vIFN0b3JlIHRoZSBtYXBwaW5nIG9mIHRoaXMgdmFsdWUgaW4gY2FzZSB3ZSB2aXNpdCBpdCBhZ2FpbiwgaW4gY2FzZSBvZiBjaXJjdWxhciBkYXRhCiAgICBtZW1vaXphdGlvbk1hcC5zZXQoaW5wdXRWYWx1ZSwgcmV0dXJuVmFsdWUpOwoKICAgIGlucHV0VmFsdWUuZm9yRWFjaCgoaXRlbSkgPT4gewogICAgICByZXR1cm5WYWx1ZS5wdXNoKF9kcm9wVW5kZWZpbmVkS2V5cyhpdGVtLCBtZW1vaXphdGlvbk1hcCkpOwogICAgfSk7CgogICAgcmV0dXJuIHJldHVyblZhbHVlIDsKICB9CgogIHJldHVybiBpbnB1dFZhbHVlOwp9CgpmdW5jdGlvbiBpc1Bvam8oaW5wdXQpIHsKICBpZiAoIWlzUGxhaW5PYmplY3QoaW5wdXQpKSB7CiAgICByZXR1cm4gZmFsc2U7CiAgfQoKICB0cnkgewogICAgY29uc3QgbmFtZSA9IChPYmplY3QuZ2V0UHJvdG90eXBlT2YoaW5wdXQpICkuY29uc3RydWN0b3IubmFtZTsKICAgIHJldHVybiAhbmFtZSB8fCBuYW1lID09PSAnT2JqZWN0JzsKICB9IGNhdGNoIChlKSB7CiAgICByZXR1cm4gdHJ1ZTsKICB9Cn0KCi8qKgogKiBEb2VzIHRoaXMgZmlsZW5hbWUgbG9vayBsaWtlIGl0J3MgcGFydCBvZiB0aGUgYXBwIGNvZGU/CiAqLwpmdW5jdGlvbiBmaWxlbmFtZUlzSW5BcHAoZmlsZW5hbWUsIGlzTmF0aXZlID0gZmFsc2UpIHsKICBjb25zdCBpc0ludGVybmFsID0KICAgIGlzTmF0aXZlIHx8CiAgICAoZmlsZW5hbWUgJiYKICAgICAgLy8gSXQncyBub3QgaW50ZXJuYWwgaWYgaXQncyBhbiBhYnNvbHV0ZSBsaW51eCBwYXRoCiAgICAgICFmaWxlbmFtZS5zdGFydHNXaXRoKCcvJykgJiYKICAgICAgLy8gSXQncyBub3QgaW50ZXJuYWwgaWYgaXQncyBhbiBhYnNvbHV0ZSB3aW5kb3dzIHBhdGgKICAgICAgIWZpbGVuYW1lLm1hdGNoKC9eW0EtWl06LykgJiYKICAgICAgLy8gSXQncyBub3QgaW50ZXJuYWwgaWYgdGhlIHBhdGggaXMgc3RhcnRpbmcgd2l0aCBhIGRvdAogICAgICAhZmlsZW5hbWUuc3RhcnRzV2l0aCgnLicpICYmCiAgICAgIC8vIEl0J3Mgbm90IGludGVybmFsIGlmIHRoZSBmcmFtZSBoYXMgYSBwcm90b2NvbC4gSW4gbm9kZSwgdGhpcyBpcyB1c3VhbGx5IHRoZSBjYXNlIGlmIHRoZSBmaWxlIGdvdCBwcmUtcHJvY2Vzc2VkIHdpdGggYSBidW5kbGVyIGxpa2Ugd2VicGFjawogICAgICAhZmlsZW5hbWUubWF0Y2goL15bYS16QS1aXShbYS16QS1aMC05LlwtK10pKjpcL1wvLykpOyAvLyBTY2hlbWEgZnJvbTogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzM2NDE3ODIKCiAgLy8gaW5fYXBwIGlzIGFsbCB0aGF0J3Mgbm90IGFuIGludGVybmFsIE5vZGUgZnVuY3Rpb24gb3IgYSBtb2R1bGUgd2l0aGluIG5vZGVfbW9kdWxlcwogIC8vIG5vdGUgdGhhdCBpc05hdGl2ZSBhcHBlYXJzIHRvIHJldHVybiB0cnVlIGV2ZW4gZm9yIG5vZGUgY29yZSBsaWJyYXJpZXMKICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2dldHNlbnRyeS9yYXZlbi1ub2RlL2lzc3Vlcy8xNzYKCiAgcmV0dXJuICFpc0ludGVybmFsICYmIGZpbGVuYW1lICE9PSB1bmRlZmluZWQgJiYgIWZpbGVuYW1lLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvJyk7Cn0KCmNvbnN0IFNUQUNLVFJBQ0VfRlJBTUVfTElNSVQgPSA1MDsKY29uc3QgU1RSSVBfRlJBTUVfUkVHRVhQID0gL2NhcHR1cmVNZXNzYWdlfGNhcHR1cmVFeGNlcHRpb24vOwoKLyoqCiAqIFJlbW92ZXMgU2VudHJ5IGZyYW1lcyBmcm9tIHRoZSB0b3AgYW5kIGJvdHRvbSBvZiB0aGUgc3RhY2sgaWYgcHJlc2VudCBhbmQgZW5mb3JjZXMgYSBsaW1pdCBvZiBtYXggbnVtYmVyIG9mIGZyYW1lcy4KICogQXNzdW1lcyBzdGFjayBpbnB1dCBpcyBvcmRlcmVkIGZyb20gdG9wIHRvIGJvdHRvbSBhbmQgcmV0dXJucyB0aGUgcmV2ZXJzZSByZXByZXNlbnRhdGlvbiBzbyBjYWxsIHNpdGUgb2YgdGhlCiAqIGZ1bmN0aW9uIHRoYXQgY2F1c2VkIHRoZSBjcmFzaCBpcyB0aGUgbGFzdCBmcmFtZSBpbiB0aGUgYXJyYXkuCiAqIEBoaWRkZW4KICovCmZ1bmN0aW9uIHN0cmlwU2VudHJ5RnJhbWVzQW5kUmV2ZXJzZShzdGFjaykgewogIGlmICghc3RhY2subGVuZ3RoKSB7CiAgICByZXR1cm4gW107CiAgfQoKICBjb25zdCBsb2NhbFN0YWNrID0gQXJyYXkuZnJvbShzdGFjayk7CgogIC8vIElmIHN0YWNrIHN0YXJ0cyB3aXRoIG9uZSBvZiBvdXIgQVBJIGNhbGxzLCByZW1vdmUgaXQgKHN0YXJ0cywgbWVhbmluZyBpdCdzIHRoZSB0b3Agb2YgdGhlIHN0YWNrIC0gYWthIGxhc3QgY2FsbCkKICBpZiAoL3NlbnRyeVdyYXBwZWQvLnRlc3QobG9jYWxTdGFja1tsb2NhbFN0YWNrLmxlbmd0aCAtIDFdLmZ1bmN0aW9uIHx8ICcnKSkgewogICAgbG9jYWxTdGFjay5wb3AoKTsKICB9CgogIC8vIFJldmVyc2luZyBpbiB0aGUgbWlkZGxlIG9mIHRoZSBwcm9jZWR1cmUgYWxsb3dzIHVzIHRvIGp1c3QgcG9wIHRoZSB2YWx1ZXMgb2ZmIHRoZSBzdGFjawogIGxvY2FsU3RhY2sucmV2ZXJzZSgpOwoKICAvLyBJZiBzdGFjayBlbmRzIHdpdGggb25lIG9mIG91ciBpbnRlcm5hbCBBUEkgY2FsbHMsIHJlbW92ZSBpdCAoZW5kcywgbWVhbmluZyBpdCdzIHRoZSBib3R0b20gb2YgdGhlIHN0YWNrIC0gYWthIHRvcC1tb3N0IGNhbGwpCiAgaWYgKFNUUklQX0ZSQU1FX1JFR0VYUC50ZXN0KGxvY2FsU3RhY2tbbG9jYWxTdGFjay5sZW5ndGggLSAxXS5mdW5jdGlvbiB8fCAnJykpIHsKICAgIGxvY2FsU3RhY2sucG9wKCk7CgogICAgLy8gV2hlbiB1c2luZyBzeW50aGV0aWMgZXZlbnRzLCB3ZSB3aWxsIGhhdmUgYSAyIGxldmVscyBkZWVwIHN0YWNrLCBhcyBgbmV3IEVycm9yKCdTZW50cnkgc3ludGhldGljRXhjZXB0aW9uJylgCiAgICAvLyBpcyBwcm9kdWNlZCB3aXRoaW4gdGhlIGh1YiBpdHNlbGYsIG1ha2luZyBpdDoKICAgIC8vCiAgICAvLyAgIFNlbnRyeS5jYXB0dXJlRXhjZXB0aW9uKCkKICAgIC8vICAgZ2V0Q3VycmVudEh1YigpLmNhcHR1cmVFeGNlcHRpb24oKQogICAgLy8KICAgIC8vIGluc3RlYWQgb2YganVzdCB0aGUgdG9wIGBTZW50cnlgIGNhbGwgaXRzZWxmLgogICAgLy8gVGhpcyBmb3JjZXMgdXMgdG8gcG9zc2libHkgc3RyaXAgYW4gYWRkaXRpb25hbCBmcmFtZSBpbiB0aGUgZXhhY3Qgc2FtZSB3YXMgYXMgYWJvdmUuCiAgICBpZiAoU1RSSVBfRlJBTUVfUkVHRVhQLnRlc3QobG9jYWxTdGFja1tsb2NhbFN0YWNrLmxlbmd0aCAtIDFdLmZ1bmN0aW9uIHx8ICcnKSkgewogICAgICBsb2NhbFN0YWNrLnBvcCgpOwogICAgfQogIH0KCiAgcmV0dXJuIGxvY2FsU3RhY2suc2xpY2UoMCwgU1RBQ0tUUkFDRV9GUkFNRV9MSU1JVCkubWFwKGZyYW1lID0+ICh7CiAgICAuLi5mcmFtZSwKICAgIGZpbGVuYW1lOiBmcmFtZS5maWxlbmFtZSB8fCBsb2NhbFN0YWNrW2xvY2FsU3RhY2subGVuZ3RoIC0gMV0uZmlsZW5hbWUsCiAgICBmdW5jdGlvbjogZnJhbWUuZnVuY3Rpb24gfHwgJz8nLAogIH0pKTsKfQoKY29uc3QgZGVmYXVsdEZ1bmN0aW9uTmFtZSA9ICc8YW5vbnltb3VzPic7CgovKioKICogU2FmZWx5IGV4dHJhY3QgZnVuY3Rpb24gbmFtZSBmcm9tIGl0c2VsZgogKi8KZnVuY3Rpb24gZ2V0RnVuY3Rpb25OYW1lKGZuKSB7CiAgdHJ5IHsKICAgIGlmICghZm4gfHwgdHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7CiAgICAgIHJldHVybiBkZWZhdWx0RnVuY3Rpb25OYW1lOwogICAgfQogICAgcmV0dXJuIGZuLm5hbWUgfHwgZGVmYXVsdEZ1bmN0aW9uTmFtZTsKICB9IGNhdGNoIChlKSB7CiAgICAvLyBKdXN0IGFjY2Vzc2luZyBjdXN0b20gcHJvcHMgaW4gc29tZSBTZWxlbml1bSBlbnZpcm9ubWVudHMKICAgIC8vIGNhbiBjYXVzZSBhICJQZXJtaXNzaW9uIGRlbmllZCIgZXhjZXB0aW9uIChzZWUgcmF2ZW4tanMjNDk1KS4KICAgIHJldHVybiBkZWZhdWx0RnVuY3Rpb25OYW1lOwogIH0KfQoKLyoqCiAqIFVVSUQ0IGdlbmVyYXRvcgogKgogKiBAcmV0dXJucyBzdHJpbmcgR2VuZXJhdGVkIFVVSUQ0LgogKi8KZnVuY3Rpb24gdXVpZDQoKSB7CiAgY29uc3QgZ2JsID0gR0xPQkFMX09CSiA7CiAgY29uc3QgY3J5cHRvID0gZ2JsLmNyeXB0byB8fCBnYmwubXNDcnlwdG87CgogIGxldCBnZXRSYW5kb21CeXRlID0gKCkgPT4gTWF0aC5yYW5kb20oKSAqIDE2OwogIHRyeSB7CiAgICBpZiAoY3J5cHRvICYmIGNyeXB0by5yYW5kb21VVUlEKSB7CiAgICAgIHJldHVybiBjcnlwdG8ucmFuZG9tVVVJRCgpLnJlcGxhY2UoLy0vZywgJycpOwogICAgfQogICAgaWYgKGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7CiAgICAgIGdldFJhbmRvbUJ5dGUgPSAoKSA9PiB7CiAgICAgICAgLy8gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyBtaWdodCByZXR1cm4gdW5kZWZpbmVkIGluc3RlYWQgb2YgdGhlIHR5cGVkIGFycmF5CiAgICAgICAgLy8gaW4gb2xkIENocm9taXVtIHZlcnNpb25zIChlLmcuIDIzLjAuMTIzNS4wICgxNTE0MjIpKQogICAgICAgIC8vIEhvd2V2ZXIsIGB0eXBlZEFycmF5YCBpcyBzdGlsbCBmaWxsZWQgaW4tcGxhY2UuCiAgICAgICAgLy8gQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQ3J5cHRvL2dldFJhbmRvbVZhbHVlcyN0eXBlZGFycmF5CiAgICAgICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KDEpOwogICAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXModHlwZWRBcnJheSk7CiAgICAgICAgcmV0dXJuIHR5cGVkQXJyYXlbMF07CiAgICAgIH07CiAgICB9CiAgfSBjYXRjaCAoXykgewogICAgLy8gc29tZSBydW50aW1lcyBjYW4gY3Jhc2ggaW52b2tpbmcgY3J5cHRvCiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ2V0c2VudHJ5L3NlbnRyeS1qYXZhc2NyaXB0L2lzc3Vlcy84OTM1CiAgfQoKICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHQvMjExNzUyMyMyMTE3NTIzCiAgLy8gQ29uY2F0ZW5hdGluZyB0aGUgZm9sbG93aW5nIG51bWJlcnMgYXMgc3RyaW5ncyByZXN1bHRzIGluICcxMDAwMDAwMDEwMDA0MDAwODAwMDEwMDAwMDAwMDAwMCcKICByZXR1cm4gKChbMWU3XSApICsgMWUzICsgNGUzICsgOGUzICsgMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgYyA9PgogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2UKICAgICgoYyApIF4gKChnZXRSYW5kb21CeXRlKCkgJiAxNSkgPj4gKChjICkgLyA0KSkpLnRvU3RyaW5nKDE2KSwKICApOwp9CgovKioKICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIGlucHV0IGlzIGFscmVhZHkgYW4gYXJyYXksIGFuZCBpZiBpdCBpc24ndCwgd3JhcHMgaXQgaW4gb25lLgogKgogKiBAcGFyYW0gbWF5YmVBcnJheSBJbnB1dCB0byB0dXJuIGludG8gYW4gYXJyYXksIGlmIG5lY2Vzc2FyeQogKiBAcmV0dXJucyBUaGUgaW5wdXQsIGlmIGFscmVhZHkgYW4gYXJyYXksIG9yIGFuIGFycmF5IHdpdGggdGhlIGlucHV0IGFzIHRoZSBvbmx5IGVsZW1lbnQsIGlmIG5vdAogKi8KZnVuY3Rpb24gYXJyYXlpZnkobWF5YmVBcnJheSkgewogIHJldHVybiBBcnJheS5pc0FycmF5KG1heWJlQXJyYXkpID8gbWF5YmVBcnJheSA6IFttYXliZUFycmF5XTsKfQoKLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1tZW1iZXItYWNjZXNzICovCi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi8KCi8qKgogKiBIZWxwZXIgdG8gZGVjeWNsZSBqc29uIG9iamVjdHMKICovCmZ1bmN0aW9uIG1lbW9CdWlsZGVyKCkgewogIGNvbnN0IGhhc1dlYWtTZXQgPSB0eXBlb2YgV2Vha1NldCA9PT0gJ2Z1bmN0aW9uJzsKICBjb25zdCBpbm5lciA9IGhhc1dlYWtTZXQgPyBuZXcgV2Vha1NldCgpIDogW107CiAgZnVuY3Rpb24gbWVtb2l6ZShvYmopIHsKICAgIGlmIChoYXNXZWFrU2V0KSB7CiAgICAgIGlmIChpbm5lci5oYXMob2JqKSkgewogICAgICAgIHJldHVybiB0cnVlOwogICAgICB9CiAgICAgIGlubmVyLmFkZChvYmopOwogICAgICByZXR1cm4gZmFsc2U7CiAgICB9CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1mb3Itb2YKICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5uZXIubGVuZ3RoOyBpKyspIHsKICAgICAgY29uc3QgdmFsdWUgPSBpbm5lcltpXTsKICAgICAgaWYgKHZhbHVlID09PSBvYmopIHsKICAgICAgICByZXR1cm4gdHJ1ZTsKICAgICAgfQogICAgfQogICAgaW5uZXIucHVzaChvYmopOwogICAgcmV0dXJuIGZhbHNlOwogIH0KCiAgZnVuY3Rpb24gdW5tZW1vaXplKG9iaikgewogICAgaWYgKGhhc1dlYWtTZXQpIHsKICAgICAgaW5uZXIuZGVsZXRlKG9iaik7CiAgICB9IGVsc2UgewogICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlubmVyLmxlbmd0aDsgaSsrKSB7CiAgICAgICAgaWYgKGlubmVyW2ldID09PSBvYmopIHsKICAgICAgICAgIGlubmVyLnNwbGljZShpLCAxKTsKICAgICAgICAgIGJyZWFrOwogICAgICAgIH0KICAgICAgfQogICAgfQogIH0KICByZXR1cm4gW21lbW9pemUsIHVubWVtb2l6ZV07Cn0KCi8qKgogKiBSZWN1cnNpdmVseSBub3JtYWxpemVzIHRoZSBnaXZlbiBvYmplY3QuCiAqCiAqIC0gQ3JlYXRlcyBhIGNvcHkgdG8gcHJldmVudCBvcmlnaW5hbCBpbnB1dCBtdXRhdGlvbgogKiAtIFNraXBzIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMKICogLSBXaGVuIHN0cmluZ2lmeWluZywgY2FsbHMgYHRvSlNPTmAgaWYgaW1wbGVtZW50ZWQKICogLSBSZW1vdmVzIGNpcmN1bGFyIHJlZmVyZW5jZXMKICogLSBUcmFuc2xhdGVzIG5vbi1zZXJpYWxpemFibGUgdmFsdWVzIChgdW5kZWZpbmVkYC9gTmFOYC9mdW5jdGlvbnMpIHRvIHNlcmlhbGl6YWJsZSBmb3JtYXQKICogLSBUcmFuc2xhdGVzIGtub3duIGdsb2JhbCBvYmplY3RzL2NsYXNzZXMgdG8gYSBzdHJpbmcgcmVwcmVzZW50YXRpb25zCiAqIC0gVGFrZXMgY2FyZSBvZiBgRXJyb3JgIG9iamVjdCBzZXJpYWxpemF0aW9uCiAqIC0gT3B0aW9uYWxseSBsaW1pdHMgZGVwdGggb2YgZmluYWwgb3V0cHV0CiAqIC0gT3B0aW9uYWxseSBsaW1pdHMgbnVtYmVyIG9mIHByb3BlcnRpZXMvZWxlbWVudHMgaW5jbHVkZWQgaW4gYW55IHNpbmdsZSBvYmplY3QvYXJyYXkKICoKICogQHBhcmFtIGlucHV0IFRoZSBvYmplY3QgdG8gYmUgbm9ybWFsaXplZC4KICogQHBhcmFtIGRlcHRoIFRoZSBtYXggZGVwdGggdG8gd2hpY2ggdG8gbm9ybWFsaXplIHRoZSBvYmplY3QuIChBbnl0aGluZyBkZWVwZXIgc3RyaW5naWZpZWQgd2hvbGUuKQogKiBAcGFyYW0gbWF4UHJvcGVydGllcyBUaGUgbWF4IG51bWJlciBvZiBlbGVtZW50cyBvciBwcm9wZXJ0aWVzIHRvIGJlIGluY2x1ZGVkIGluIGFueSBzaW5nbGUgYXJyYXkgb3IKICogb2JqZWN0IGluIHRoZSBub3JtYWxsaXplZCBvdXRwdXQuCiAqIEByZXR1cm5zIEEgbm9ybWFsaXplZCB2ZXJzaW9uIG9mIHRoZSBvYmplY3QsIG9yIGAiKipub24tc2VyaWFsaXphYmxlKioiYCBpZiBhbnkgZXJyb3JzIGFyZSB0aHJvd24gZHVyaW5nIG5vcm1hbGl6YXRpb24uCiAqLwovLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueQpmdW5jdGlvbiBub3JtYWxpemUoaW5wdXQsIGRlcHRoID0gMTAwLCBtYXhQcm9wZXJ0aWVzID0gK0luZmluaXR5KSB7CiAgdHJ5IHsKICAgIC8vIHNpbmNlIHdlJ3JlIGF0IHRoZSBvdXRlcm1vc3QgbGV2ZWwsIHdlIGRvbid0IHByb3ZpZGUgYSBrZXkKICAgIHJldHVybiB2aXNpdCgnJywgaW5wdXQsIGRlcHRoLCBtYXhQcm9wZXJ0aWVzKTsKICB9IGNhdGNoIChlcnIpIHsKICAgIHJldHVybiB7IEVSUk9SOiBgKipub24tc2VyaWFsaXphYmxlKiogKCR7ZXJyfSlgIH07CiAgfQp9CgovKioKICogVmlzaXRzIGEgbm9kZSB0byBwZXJmb3JtIG5vcm1hbGl6YXRpb24gb24gaXQKICoKICogQHBhcmFtIGtleSBUaGUga2V5IGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIG5vZGUKICogQHBhcmFtIHZhbHVlIFRoZSBub2RlIHRvIGJlIHZpc2l0ZWQKICogQHBhcmFtIGRlcHRoIE9wdGlvbmFsIG51bWJlciBpbmRpY2F0aW5nIHRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aAogKiBAcGFyYW0gbWF4UHJvcGVydGllcyBPcHRpb25hbCBtYXhpbXVtIG51bWJlciBvZiBwcm9wZXJ0aWVzL2VsZW1lbnRzIGluY2x1ZGVkIGluIGFueSBzaW5nbGUgb2JqZWN0L2FycmF5CiAqIEBwYXJhbSBtZW1vIE9wdGlvbmFsIE1lbW8gY2xhc3MgaGFuZGxpbmcgZGVjeWNsaW5nCiAqLwpmdW5jdGlvbiB2aXNpdCgKICBrZXksCiAgdmFsdWUsCiAgZGVwdGggPSArSW5maW5pdHksCiAgbWF4UHJvcGVydGllcyA9ICtJbmZpbml0eSwKICBtZW1vID0gbWVtb0J1aWxkZXIoKSwKKSB7CiAgY29uc3QgW21lbW9pemUsIHVubWVtb2l6ZV0gPSBtZW1vOwoKICAvLyBHZXQgdGhlIHNpbXBsZSBjYXNlcyBvdXQgb2YgdGhlIHdheSBmaXJzdAogIGlmICgKICAgIHZhbHVlID09IG51bGwgfHwgLy8gdGhpcyBtYXRjaGVzIG51bGwgYW5kIHVuZGVmaW5lZCAtPiBlcWVxIG5vdCBlcWVxZXEKICAgIChbJ251bWJlcicsICdib29sZWFuJywgJ3N0cmluZyddLmluY2x1ZGVzKHR5cGVvZiB2YWx1ZSkgJiYgIWlzTmFOJDEodmFsdWUpKQogICkgewogICAgcmV0dXJuIHZhbHVlIDsKICB9CgogIGNvbnN0IHN0cmluZ2lmaWVkID0gc3RyaW5naWZ5VmFsdWUoa2V5LCB2YWx1ZSk7CgogIC8vIEFueXRoaW5nIHdlIGNvdWxkIHBvdGVudGlhbGx5IGRpZyBpbnRvIG1vcmUgKG9iamVjdHMgb3IgYXJyYXlzKSB3aWxsIGhhdmUgY29tZSBiYWNrIGFzIGAiW29iamVjdCBYWFhYXSJgLgogIC8vIEV2ZXJ5dGhpbmcgZWxzZSB3aWxsIGhhdmUgYWxyZWFkeSBiZWVuIHNlcmlhbGl6ZWQsIHNvIGlmIHdlIGRvbid0IHNlZSB0aGF0IHBhdHRlcm4sIHdlJ3JlIGRvbmUuCiAgaWYgKCFzdHJpbmdpZmllZC5zdGFydHNXaXRoKCdbb2JqZWN0ICcpKSB7CiAgICByZXR1cm4gc3RyaW5naWZpZWQ7CiAgfQoKICAvLyBGcm9tIGhlcmUgb24sIHdlIGNhbiBhc3NlcnQgdGhhdCBgdmFsdWVgIGlzIGVpdGhlciBhbiBvYmplY3Qgb3IgYW4gYXJyYXkuCgogIC8vIERvIG5vdCBub3JtYWxpemUgb2JqZWN0cyB0aGF0IHdlIGtub3cgaGF2ZSBhbHJlYWR5IGJlZW4gbm9ybWFsaXplZC4gQXMgYSBnZW5lcmFsIHJ1bGUsIHRoZQogIC8vICJfX3NlbnRyeV9za2lwX25vcm1hbGl6YXRpb25fXyIgcHJvcGVydHkgc2hvdWxkIG9ubHkgYmUgdXNlZCBzcGFyaW5nbHkgYW5kIG9ubHkgc2hvdWxkIG9ubHkgYmUgc2V0IG9uIG9iamVjdHMgdGhhdAogIC8vIGhhdmUgYWxyZWFkeSBiZWVuIG5vcm1hbGl6ZWQuCiAgaWYgKCh2YWx1ZSApWydfX3NlbnRyeV9za2lwX25vcm1hbGl6YXRpb25fXyddKSB7CiAgICByZXR1cm4gdmFsdWUgOwogIH0KCiAgLy8gV2UgY2FuIHNldCBgX19zZW50cnlfb3ZlcnJpZGVfbm9ybWFsaXphdGlvbl9kZXB0aF9fYCBvbiBhbiBvYmplY3QgdG8gZW5zdXJlIHRoYXQgZnJvbSB0aGVyZQogIC8vIFdlIGtlZXAgYSBjZXJ0YWluIGFtb3VudCBvZiBkZXB0aC4KICAvLyBUaGlzIHNob3VsZCBiZSB1c2VkIHNwYXJpbmdseSwgZS5nLiB3ZSB1c2UgaXQgZm9yIHRoZSByZWR1eCBpbnRlZ3JhdGlvbiB0byBlbnN1cmUgd2UgZ2V0IGEgY2VydGFpbiBhbW91bnQgb2Ygc3RhdGUuCiAgY29uc3QgcmVtYWluaW5nRGVwdGggPQogICAgdHlwZW9mICh2YWx1ZSApWydfX3NlbnRyeV9vdmVycmlkZV9ub3JtYWxpemF0aW9uX2RlcHRoX18nXSA9PT0gJ251bWJlcicKICAgICAgPyAoKHZhbHVlIClbJ19fc2VudHJ5X292ZXJyaWRlX25vcm1hbGl6YXRpb25fZGVwdGhfXyddICkKICAgICAgOiBkZXB0aDsKCiAgLy8gV2UncmUgYWxzbyBkb25lIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIG1heCBkZXB0aAogIGlmIChyZW1haW5pbmdEZXB0aCA9PT0gMCkgewogICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IGBzZXJpYWxpemVkYCBpcyBhIHN0cmluZyBvZiB0aGUgZm9ybSBgIltvYmplY3QgWFhYWF0iYC4gQ2xlYW4gaXQgdXAgc28gaXQncyBqdXN0IGAiW1hYWFhdImAuCiAgICByZXR1cm4gc3RyaW5naWZpZWQucmVwbGFjZSgnb2JqZWN0ICcsICcnKTsKICB9CgogIC8vIElmIHdlJ3ZlIGFscmVhZHkgdmlzaXRlZCB0aGlzIGJyYW5jaCwgYmFpbCBvdXQsIGFzIGl0J3MgY2lyY3VsYXIgcmVmZXJlbmNlLiBJZiBub3QsIG5vdGUgdGhhdCB3ZSdyZSBzZWVpbmcgaXQgbm93LgogIGlmIChtZW1vaXplKHZhbHVlKSkgewogICAgcmV0dXJuICdbQ2lyY3VsYXIgfl0nOwogIH0KCiAgLy8gSWYgdGhlIHZhbHVlIGhhcyBhIGB0b0pTT05gIG1ldGhvZCwgd2UgY2FsbCBpdCB0byBleHRyYWN0IG1vcmUgaW5mb3JtYXRpb24KICBjb25zdCB2YWx1ZVdpdGhUb0pTT04gPSB2YWx1ZSA7CiAgaWYgKHZhbHVlV2l0aFRvSlNPTiAmJiB0eXBlb2YgdmFsdWVXaXRoVG9KU09OLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykgewogICAgdHJ5IHsKICAgICAgY29uc3QganNvblZhbHVlID0gdmFsdWVXaXRoVG9KU09OLnRvSlNPTigpOwogICAgICAvLyBXZSBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgcmV0dXJuIHZhbHVlIG9mIGAudG9KU09OKClgIGluIGNhc2UgaXQgaGFzIGNpcmN1bGFyIHJlZmVyZW5jZXMKICAgICAgcmV0dXJuIHZpc2l0KCcnLCBqc29uVmFsdWUsIHJlbWFpbmluZ0RlcHRoIC0gMSwgbWF4UHJvcGVydGllcywgbWVtbyk7CiAgICB9IGNhdGNoIChlcnIpIHsKICAgICAgLy8gcGFzcyAoVGhlIGJ1aWx0LWluIGB0b0pTT05gIGZhaWxlZCwgYnV0IHdlIGNhbiBzdGlsbCB0cnkgdG8gZG8gaXQgb3Vyc2VsdmVzKQogICAgfQogIH0KCiAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHdlIGVpdGhlciBoYXZlIGFuIG9iamVjdCBvciBhbiBhcnJheSwgd2UgaGF2ZW4ndCBzZWVuIGl0IGJlZm9yZSwgYW5kIHdlJ3JlIGdvaW5nIHRvIHJlY3Vyc2UKICAvLyBiZWNhdXNlIHdlIGhhdmVuJ3QgeWV0IHJlYWNoZWQgdGhlIG1heCBkZXB0aC4gQ3JlYXRlIGFuIGFjY3VtdWxhdG9yIHRvIGhvbGQgdGhlIHJlc3VsdHMgb2YgdmlzaXRpbmcgZWFjaAogIC8vIHByb3BlcnR5L2VudHJ5LCBhbmQga2VlcCB0cmFjayBvZiB0aGUgbnVtYmVyIG9mIGl0ZW1zIHdlIGFkZCB0byBpdC4KICBjb25zdCBub3JtYWxpemVkID0gKEFycmF5LmlzQXJyYXkodmFsdWUpID8gW10gOiB7fSkgOwogIGxldCBudW1BZGRlZCA9IDA7CgogIC8vIEJlZm9yZSB3ZSBiZWdpbiwgY29udmVydGBFcnJvcmAgYW5kYEV2ZW50YCBpbnN0YW5jZXMgaW50byBwbGFpbiBvYmplY3RzLCBzaW5jZSBzb21lIG9mIGVhY2ggb2YgdGhlaXIgcmVsZXZhbnQKICAvLyBwcm9wZXJ0aWVzIGFyZSBub24tZW51bWVyYWJsZSBhbmQgb3RoZXJ3aXNlIHdvdWxkIGdldCBtaXNzZWQuCiAgY29uc3QgdmlzaXRhYmxlID0gY29udmVydFRvUGxhaW5PYmplY3QodmFsdWUgKTsKCiAgZm9yIChjb25zdCB2aXNpdEtleSBpbiB2aXNpdGFibGUpIHsKICAgIC8vIEF2b2lkIGl0ZXJhdGluZyBvdmVyIGZpZWxkcyBpbiB0aGUgcHJvdG90eXBlIGlmIHRoZXkndmUgc29tZWhvdyBiZWVuIGV4cG9zZWQgdG8gZW51bWVyYXRpb24uCiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2aXNpdGFibGUsIHZpc2l0S2V5KSkgewogICAgICBjb250aW51ZTsKICAgIH0KCiAgICBpZiAobnVtQWRkZWQgPj0gbWF4UHJvcGVydGllcykgewogICAgICBub3JtYWxpemVkW3Zpc2l0S2V5XSA9ICdbTWF4UHJvcGVydGllcyB+XSc7CiAgICAgIGJyZWFrOwogICAgfQoKICAgIC8vIFJlY3Vyc2l2ZWx5IHZpc2l0IGFsbCB0aGUgY2hpbGQgbm9kZXMKICAgIGNvbnN0IHZpc2l0VmFsdWUgPSB2aXNpdGFibGVbdmlzaXRLZXldOwogICAgbm9ybWFsaXplZFt2aXNpdEtleV0gPSB2aXNpdCh2aXNpdEtleSwgdmlzaXRWYWx1ZSwgcmVtYWluaW5nRGVwdGggLSAxLCBtYXhQcm9wZXJ0aWVzLCBtZW1vKTsKCiAgICBudW1BZGRlZCsrOwogIH0KCiAgLy8gT25jZSB3ZSd2ZSB2aXNpdGVkIGFsbCB0aGUgYnJhbmNoZXMsIHJlbW92ZSB0aGUgcGFyZW50IGZyb20gbWVtbyBzdG9yYWdlCiAgdW5tZW1vaXplKHZhbHVlKTsKCiAgLy8gUmV0dXJuIGFjY3VtdWxhdGVkIHZhbHVlcwogIHJldHVybiBub3JtYWxpemVkOwp9CgovKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovCi8qKgogKiBTdHJpbmdpZnkgdGhlIGdpdmVuIHZhbHVlLiBIYW5kbGVzIHZhcmlvdXMga25vd24gc3BlY2lhbCB2YWx1ZXMgYW5kIHR5cGVzLgogKgogKiBOb3QgbWVhbnQgdG8gYmUgdXNlZCBvbiBzaW1wbGUgcHJpbWl0aXZlcyB3aGljaCBhbHJlYWR5IGhhdmUgYSBzdHJpbmcgcmVwcmVzZW50YXRpb24sIGFzIGl0IHdpbGwsIGZvciBleGFtcGxlLCB0dXJuCiAqIHRoZSBudW1iZXIgMTIzMSBpbnRvICJbT2JqZWN0IE51bWJlcl0iLCBub3Igb24gYG51bGxgLCBhcyBpdCB3aWxsIHRocm93LgogKgogKiBAcGFyYW0gdmFsdWUgVGhlIHZhbHVlIHRvIHN0cmluZ2lmeQogKiBAcmV0dXJucyBBIHN0cmluZ2lmaWVkIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiB2YWx1ZQogKi8KZnVuY3Rpb24gc3RyaW5naWZ5VmFsdWUoCiAga2V5LAogIC8vIHRoaXMgdHlwZSBpcyBhIHRpbnkgYml0IG9mIGEgY2hlYXQsIHNpbmNlIHRoaXMgZnVuY3Rpb24gZG9lcyBoYW5kbGUgTmFOICh3aGljaCBpcyB0ZWNobmljYWxseSBhIG51bWJlciksIGJ1dCBmb3IKICAvLyBvdXIgaW50ZXJuYWwgdXNlLCBpdCdsbCBkbwogIHZhbHVlLAopIHsKICB0cnkgewogICAgaWYgKGtleSA9PT0gJ2RvbWFpbicgJiYgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAodmFsdWUgKS5fZXZlbnRzKSB7CiAgICAgIHJldHVybiAnW0RvbWFpbl0nOwogICAgfQoKICAgIGlmIChrZXkgPT09ICdkb21haW5FbWl0dGVyJykgewogICAgICByZXR1cm4gJ1tEb21haW5FbWl0dGVyXSc7CiAgICB9CgogICAgLy8gSXQncyBzYWZlIHRvIHVzZSBgZ2xvYmFsYCwgYHdpbmRvd2AsIGFuZCBgZG9jdW1lbnRgIGhlcmUgaW4gdGhpcyBtYW5uZXIsIGFzIHdlIGFyZSBhc3NlcnRpbmcgdXNpbmcgYHR5cGVvZmAgZmlyc3QKICAgIC8vIHdoaWNoIHdvbid0IHRocm93IGlmIHRoZXkgYXJlIG5vdCBwcmVzZW50LgoKICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gZ2xvYmFsKSB7CiAgICAgIHJldHVybiAnW0dsb2JhbF0nOwogICAgfQoKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHMKICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gd2luZG93KSB7CiAgICAgIHJldHVybiAnW1dpbmRvd10nOwogICAgfQoKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHMKICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlID09PSBkb2N1bWVudCkgewogICAgICByZXR1cm4gJ1tEb2N1bWVudF0nOwogICAgfQoKICAgIGlmIChpc1Z1ZVZpZXdNb2RlbCh2YWx1ZSkpIHsKICAgICAgcmV0dXJuICdbVnVlVmlld01vZGVsXSc7CiAgICB9CgogICAgLy8gUmVhY3QncyBTeW50aGV0aWNFdmVudCB0aGluZ3kKICAgIGlmIChpc1N5bnRoZXRpY0V2ZW50KHZhbHVlKSkgewogICAgICByZXR1cm4gJ1tTeW50aGV0aWNFdmVudF0nOwogICAgfQoKICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIHZhbHVlICE9PSB2YWx1ZSkgewogICAgICByZXR1cm4gJ1tOYU5dJzsKICAgIH0KCiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7CiAgICAgIHJldHVybiBgW0Z1bmN0aW9uOiAke2dldEZ1bmN0aW9uTmFtZSh2YWx1ZSl9XWA7CiAgICB9CgogICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpIHsKICAgICAgcmV0dXJuIGBbJHtTdHJpbmcodmFsdWUpfV1gOwogICAgfQoKICAgIC8vIHN0cmluZ2lmaWVkIEJpZ0ludHMgYXJlIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gcmVndWxhciBudW1iZXJzLCBzbyB3ZSBuZWVkIHRvIGxhYmVsIHRoZW0gdG8gYXZvaWQgY29uZnVzaW9uCiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYmlnaW50JykgewogICAgICByZXR1cm4gYFtCaWdJbnQ6ICR7U3RyaW5nKHZhbHVlKX1dYDsKICAgIH0KCiAgICAvLyBOb3cgdGhhdCB3ZSd2ZSBrbm9ja2VkIG91dCBhbGwgdGhlIHNwZWNpYWwgY2FzZXMgYW5kIHRoZSBwcmltaXRpdmVzLCBhbGwgd2UgaGF2ZSBsZWZ0IGFyZSBvYmplY3RzLiBTaW1wbHkgY2FzdGluZwogICAgLy8gdGhlbSB0byBzdHJpbmdzIG1lYW5zIHRoYXQgaW5zdGFuY2VzIG9mIGNsYXNzZXMgd2hpY2ggaGF2ZW4ndCBkZWZpbmVkIHRoZWlyIGB0b1N0cmluZ1RhZ2Agd2lsbCBqdXN0IGNvbWUgb3V0IGFzCiAgICAvLyBgIltvYmplY3QgT2JqZWN0XSJgLiBJZiB3ZSBpbnN0ZWFkIGxvb2sgYXQgdGhlIGNvbnN0cnVjdG9yJ3MgbmFtZSAod2hpY2ggaXMgdGhlIHNhbWUgYXMgdGhlIG5hbWUgb2YgdGhlIGNsYXNzKSwKICAgIC8vIHdlIGNhbiBtYWtlIHN1cmUgdGhhdCBvbmx5IHBsYWluIG9iamVjdHMgY29tZSBvdXQgdGhhdCB3YXkuCiAgICBjb25zdCBvYmpOYW1lID0gZ2V0Q29uc3RydWN0b3JOYW1lKHZhbHVlKTsKCiAgICAvLyBIYW5kbGUgSFRNTCBFbGVtZW50cwogICAgaWYgKC9eSFRNTChcdyopRWxlbWVudCQvLnRlc3Qob2JqTmFtZSkpIHsKICAgICAgcmV0dXJuIGBbSFRNTEVsZW1lbnQ6ICR7b2JqTmFtZX1dYDsKICAgIH0KCiAgICByZXR1cm4gYFtvYmplY3QgJHtvYmpOYW1lfV1gOwogIH0gY2F0Y2ggKGVycikgewogICAgcmV0dXJuIGAqKm5vbi1zZXJpYWxpemFibGUqKiAoJHtlcnJ9KWA7CiAgfQp9Ci8qIGVzbGludC1lbmFibGUgY29tcGxleGl0eSAqLwoKZnVuY3Rpb24gZ2V0Q29uc3RydWN0b3JOYW1lKHZhbHVlKSB7CiAgY29uc3QgcHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTsKCiAgcmV0dXJuIHByb3RvdHlwZSA/IHByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lIDogJ251bGwgcHJvdG90eXBlJzsKfQoKLyoqCiAqIE5vcm1hbGl6ZXMgVVJMcyBpbiBleGNlcHRpb25zIGFuZCBzdGFja3RyYWNlcyB0byBhIGJhc2UgcGF0aCBzbyBTZW50cnkgY2FuIGZpbmdlcnByaW50CiAqIGFjcm9zcyBwbGF0Zm9ybXMgYW5kIHdvcmtpbmcgZGlyZWN0b3J5LgogKgogKiBAcGFyYW0gdXJsIFRoZSBVUkwgdG8gYmUgbm9ybWFsaXplZC4KICogQHBhcmFtIGJhc2VQYXRoIFRoZSBhcHBsaWNhdGlvbiBiYXNlIHBhdGguCiAqIEByZXR1cm5zIFRoZSBub3JtYWxpemVkIFVSTC4KICovCmZ1bmN0aW9uIG5vcm1hbGl6ZVVybFRvQmFzZSh1cmwsIGJhc2VQYXRoKSB7CiAgY29uc3QgZXNjYXBlZEJhc2UgPSBiYXNlUGF0aAogICAgLy8gQmFja3NsYXNoIHRvIGZvcndhcmQKICAgIC5yZXBsYWNlKC9cXC9nLCAnLycpCiAgICAvLyBFc2NhcGUgUmVnRXhwIHNwZWNpYWwgY2hhcmFjdGVycwogICAgLnJlcGxhY2UoL1t8XFx7fSgpW1xdXiQrKj8uXS9nLCAnXFwkJicpOwoKICBsZXQgbmV3VXJsID0gdXJsOwogIHRyeSB7CiAgICBuZXdVcmwgPSBkZWNvZGVVUkkodXJsKTsKICB9IGNhdGNoIChfT28pIHsKICAgIC8vIFNvbWV0aW1lIHRoaXMgYnJlYWtzCiAgfQogIHJldHVybiAoCiAgICBuZXdVcmwKICAgICAgLnJlcGxhY2UoL1xcL2csICcvJykKICAgICAgLnJlcGxhY2UoL3dlYnBhY2s6XC8/L2csICcnKSAvLyBSZW1vdmUgaW50ZXJtZWRpYXRlIGJhc2UgcGF0aAogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHNlbnRyeS1pbnRlcm5hbC9zZGsvbm8tcmVnZXhwLWNvbnN0cnVjdG9yCiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoYChmaWxlOi8vKT8vKiR7ZXNjYXBlZEJhc2V9LypgLCAnaWcnKSwgJ2FwcDovLy8nKQogICk7Cn0KCi8vIFNsaWdodGx5IG1vZGlmaWVkIChubyBJRTggc3VwcG9ydCwgRVM2KSBhbmQgdHJhbnNjcmliZWQgdG8gVHlwZVNjcmlwdAoKLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb24KLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy4KY29uc3Qgc3BsaXRQYXRoUmUgPSAvXihcUys6XFx8XC8/KShbXHNcU10qPykoKD86XC57MSwyfXxbXi9cXF0rP3wpKFwuW14uL1xcXSp8KSkoPzpbL1xcXSopJC87Ci8qKiBKU0RvYyAqLwpmdW5jdGlvbiBzcGxpdFBhdGgoZmlsZW5hbWUpIHsKICAvLyBUcnVuY2F0ZSBmaWxlcyBuYW1lcyBncmVhdGVyIHRoYW4gMTAyNCBjaGFyYWN0ZXJzIHRvIGF2b2lkIHJlZ2V4IGRvcwogIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nZXRzZW50cnkvc2VudHJ5LWphdmFzY3JpcHQvcHVsbC84NzM3I2Rpc2N1c3Npb25fcjEyODU3MTkxNzIKICBjb25zdCB0cnVuY2F0ZWQgPSBmaWxlbmFtZS5sZW5ndGggPiAxMDI0ID8gYDx0cnVuY2F0ZWQ+JHtmaWxlbmFtZS5zbGljZSgtMTAyNCl9YCA6IGZpbGVuYW1lOwogIGNvbnN0IHBhcnRzID0gc3BsaXRQYXRoUmUuZXhlYyh0cnVuY2F0ZWQpOwogIHJldHVybiBwYXJ0cyA/IHBhcnRzLnNsaWNlKDEpIDogW107Cn0KCi8qKiBKU0RvYyAqLwpmdW5jdGlvbiBkaXJuYW1lKHBhdGgpIHsKICBjb25zdCByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCk7CiAgY29uc3Qgcm9vdCA9IHJlc3VsdFswXTsKICBsZXQgZGlyID0gcmVzdWx0WzFdOwoKICBpZiAoIXJvb3QgJiYgIWRpcikgewogICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyCiAgICByZXR1cm4gJy4nOwogIH0KCiAgaWYgKGRpcikgewogICAgLy8gSXQgaGFzIGEgZGlybmFtZSwgc3RyaXAgdHJhaWxpbmcgc2xhc2gKICAgIGRpciA9IGRpci5zbGljZSgwLCBkaXIubGVuZ3RoIC0gMSk7CiAgfQoKICByZXR1cm4gcm9vdCArIGRpcjsKfQoKLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LWZ1bmN0aW9uLXJldHVybi10eXBlICovCgovKiogU3luY1Byb21pc2UgaW50ZXJuYWwgc3RhdGVzICovCnZhciBTdGF0ZXM7IChmdW5jdGlvbiAoU3RhdGVzKSB7CiAgLyoqIFBlbmRpbmcgKi8KICBjb25zdCBQRU5ESU5HID0gMDsgU3RhdGVzW1N0YXRlc1siUEVORElORyJdID0gUEVORElOR10gPSAiUEVORElORyI7CiAgLyoqIFJlc29sdmVkIC8gT0sgKi8KICBjb25zdCBSRVNPTFZFRCA9IDE7IFN0YXRlc1tTdGF0ZXNbIlJFU09MVkVEIl0gPSBSRVNPTFZFRF0gPSAiUkVTT0xWRUQiOwogIC8qKiBSZWplY3RlZCAvIEVycm9yICovCiAgY29uc3QgUkVKRUNURUQgPSAyOyBTdGF0ZXNbU3RhdGVzWyJSRUpFQ1RFRCJdID0gUkVKRUNURURdID0gIlJFSkVDVEVEIjsKfSkoU3RhdGVzIHx8IChTdGF0ZXMgPSB7fSkpOwoKLy8gT3ZlcmxvYWRzIHNvIHdlIGNhbiBjYWxsIHJlc29sdmVkU3luY1Byb21pc2Ugd2l0aG91dCBhcmd1bWVudHMgYW5kIGdlbmVyaWMgYXJndW1lbnQKCi8qKgogKiBDcmVhdGVzIGEgcmVzb2x2ZWQgc3luYyBwcm9taXNlLgogKgogKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIHJlc29sdmUgdGhlIHByb21pc2Ugd2l0aAogKiBAcmV0dXJucyB0aGUgcmVzb2x2ZWQgc3luYyBwcm9taXNlCiAqLwpmdW5jdGlvbiByZXNvbHZlZFN5bmNQcm9taXNlKHZhbHVlKSB7CiAgcmV0dXJuIG5ldyBTeW5jUHJvbWlzZShyZXNvbHZlID0+IHsKICAgIHJlc29sdmUodmFsdWUpOwogIH0pOwp9CgovKioKICogQ3JlYXRlcyBhIHJlamVjdGVkIHN5bmMgcHJvbWlzZS4KICoKICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byByZWplY3QgdGhlIHByb21pc2Ugd2l0aAogKiBAcmV0dXJucyB0aGUgcmVqZWN0ZWQgc3luYyBwcm9taXNlCiAqLwpmdW5jdGlvbiByZWplY3RlZFN5bmNQcm9taXNlKHJlYXNvbikgewogIHJldHVybiBuZXcgU3luY1Byb21pc2UoKF8sIHJlamVjdCkgPT4gewogICAgcmVqZWN0KHJlYXNvbik7CiAgfSk7Cn0KCi8qKgogKiBUaGVuYWJsZSBjbGFzcyB0aGF0IGJlaGF2ZXMgbGlrZSBhIFByb21pc2UgYW5kIGZvbGxvd3MgaXQncyBpbnRlcmZhY2UKICogYnV0IGlzIG5vdCBhc3luYyBpbnRlcm5hbGx5CiAqLwpjbGFzcyBTeW5jUHJvbWlzZSB7CgogICBjb25zdHJ1Y3RvcigKICAgIGV4ZWN1dG9yLAogICkge1N5bmNQcm9taXNlLnByb3RvdHlwZS5fX2luaXQuY2FsbCh0aGlzKTtTeW5jUHJvbWlzZS5wcm90b3R5cGUuX19pbml0Mi5jYWxsKHRoaXMpO1N5bmNQcm9taXNlLnByb3RvdHlwZS5fX2luaXQzLmNhbGwodGhpcyk7U3luY1Byb21pc2UucHJvdG90eXBlLl9faW5pdDQuY2FsbCh0aGlzKTsKICAgIHRoaXMuX3N0YXRlID0gU3RhdGVzLlBFTkRJTkc7CiAgICB0aGlzLl9oYW5kbGVycyA9IFtdOwoKICAgIHRyeSB7CiAgICAgIGV4ZWN1dG9yKHRoaXMuX3Jlc29sdmUsIHRoaXMuX3JlamVjdCk7CiAgICB9IGNhdGNoIChlKSB7CiAgICAgIHRoaXMuX3JlamVjdChlKTsKICAgIH0KICB9CgogIC8qKiBKU0RvYyAqLwogICB0aGVuKAogICAgb25mdWxmaWxsZWQsCiAgICBvbnJlamVjdGVkLAogICkgewogICAgcmV0dXJuIG5ldyBTeW5jUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7CiAgICAgIHRoaXMuX2hhbmRsZXJzLnB1c2goWwogICAgICAgIGZhbHNlLAogICAgICAgIHJlc3VsdCA9PiB7CiAgICAgICAgICBpZiAoIW9uZnVsZmlsbGVkKSB7CiAgICAgICAgICAgIC8vIFRPRE86IMKvXF8o44OEKV8vwq8KICAgICAgICAgICAgLy8gVE9ETzogRklYTUUKICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQgKTsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgcmVzb2x2ZShvbmZ1bGZpbGxlZChyZXN1bHQpKTsKICAgICAgICAgICAgfSBjYXRjaCAoZSkgewogICAgICAgICAgICAgIHJlamVjdChlKTsKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0sCiAgICAgICAgcmVhc29uID0+IHsKICAgICAgICAgIGlmICghb25yZWplY3RlZCkgewogICAgICAgICAgICByZWplY3QocmVhc29uKTsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgcmVzb2x2ZShvbnJlamVjdGVkKHJlYXNvbikpOwogICAgICAgICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgICAgICAgcmVqZWN0KGUpOwogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgXSk7CiAgICAgIHRoaXMuX2V4ZWN1dGVIYW5kbGVycygpOwogICAgfSk7CiAgfQoKICAvKiogSlNEb2MgKi8KICAgY2F0Y2goCiAgICBvbnJlamVjdGVkLAogICkgewogICAgcmV0dXJuIHRoaXMudGhlbih2YWwgPT4gdmFsLCBvbnJlamVjdGVkKTsKICB9CgogIC8qKiBKU0RvYyAqLwogICBmaW5hbGx5KG9uZmluYWxseSkgewogICAgcmV0dXJuIG5ldyBTeW5jUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7CiAgICAgIGxldCB2YWw7CiAgICAgIGxldCBpc1JlamVjdGVkOwoKICAgICAgcmV0dXJuIHRoaXMudGhlbigKICAgICAgICB2YWx1ZSA9PiB7CiAgICAgICAgICBpc1JlamVjdGVkID0gZmFsc2U7CiAgICAgICAgICB2YWwgPSB2YWx1ZTsKICAgICAgICAgIGlmIChvbmZpbmFsbHkpIHsKICAgICAgICAgICAgb25maW5hbGx5KCk7CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICByZWFzb24gPT4gewogICAgICAgICAgaXNSZWplY3RlZCA9IHRydWU7CiAgICAgICAgICB2YWwgPSByZWFzb247CiAgICAgICAgICBpZiAob25maW5hbGx5KSB7CiAgICAgICAgICAgIG9uZmluYWxseSgpOwogICAgICAgICAgfQogICAgICAgIH0sCiAgICAgICkudGhlbigoKSA9PiB7CiAgICAgICAgaWYgKGlzUmVqZWN0ZWQpIHsKICAgICAgICAgIHJlamVjdCh2YWwpOwogICAgICAgICAgcmV0dXJuOwogICAgICAgIH0KCiAgICAgICAgcmVzb2x2ZSh2YWwgKTsKICAgICAgfSk7CiAgICB9KTsKICB9CgogIC8qKiBKU0RvYyAqLwogICAgX19pbml0KCkge3RoaXMuX3Jlc29sdmUgPSAodmFsdWUpID0+IHsKICAgIHRoaXMuX3NldFJlc3VsdChTdGF0ZXMuUkVTT0xWRUQsIHZhbHVlKTsKICB9O30KCiAgLyoqIEpTRG9jICovCiAgICBfX2luaXQyKCkge3RoaXMuX3JlamVjdCA9IChyZWFzb24pID0+IHsKICAgIHRoaXMuX3NldFJlc3VsdChTdGF0ZXMuUkVKRUNURUQsIHJlYXNvbik7CiAgfTt9CgogIC8qKiBKU0RvYyAqLwogICAgX19pbml0MygpIHt0aGlzLl9zZXRSZXN1bHQgPSAoc3RhdGUsIHZhbHVlKSA9PiB7CiAgICBpZiAodGhpcy5fc3RhdGUgIT09IFN0YXRlcy5QRU5ESU5HKSB7CiAgICAgIHJldHVybjsKICAgIH0KCiAgICBpZiAoaXNUaGVuYWJsZSh2YWx1ZSkpIHsKICAgICAgdm9pZCAodmFsdWUgKS50aGVuKHRoaXMuX3Jlc29sdmUsIHRoaXMuX3JlamVjdCk7CiAgICAgIHJldHVybjsKICAgIH0KCiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlOwogICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTsKCiAgICB0aGlzLl9leGVjdXRlSGFuZGxlcnMoKTsKICB9O30KCiAgLyoqIEpTRG9jICovCiAgICBfX2luaXQ0KCkge3RoaXMuX2V4ZWN1dGVIYW5kbGVycyA9ICgpID0+IHsKICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gU3RhdGVzLlBFTkRJTkcpIHsKICAgICAgcmV0dXJuOwogICAgfQoKICAgIGNvbnN0IGNhY2hlZEhhbmRsZXJzID0gdGhpcy5faGFuZGxlcnMuc2xpY2UoKTsKICAgIHRoaXMuX2hhbmRsZXJzID0gW107CgogICAgY2FjaGVkSGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IHsKICAgICAgaWYgKGhhbmRsZXJbMF0pIHsKICAgICAgICByZXR1cm47CiAgICAgIH0KCiAgICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gU3RhdGVzLlJFU09MVkVEKSB7CiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlcwogICAgICAgIGhhbmRsZXJbMV0odGhpcy5fdmFsdWUgKTsKICAgICAgfQoKICAgICAgaWYgKHRoaXMuX3N0YXRlID09PSBTdGF0ZXMuUkVKRUNURUQpIHsKICAgICAgICBoYW5kbGVyWzJdKHRoaXMuX3ZhbHVlKTsKICAgICAgfQoKICAgICAgaGFuZGxlclswXSA9IHRydWU7CiAgICB9KTsKICB9O30KfQoKLyoqCiAqIENyZWF0ZXMgYW4gbmV3IFByb21pc2VCdWZmZXIgb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCBsaW1pdAogKiBAcGFyYW0gbGltaXQgbWF4IG51bWJlciBvZiBwcm9taXNlcyB0aGF0IGNhbiBiZSBzdG9yZWQgaW4gdGhlIGJ1ZmZlcgogKi8KZnVuY3Rpb24gbWFrZVByb21pc2VCdWZmZXIobGltaXQpIHsKICBjb25zdCBidWZmZXIgPSBbXTsKCiAgZnVuY3Rpb24gaXNSZWFkeSgpIHsKICAgIHJldHVybiBsaW1pdCA9PT0gdW5kZWZpbmVkIHx8IGJ1ZmZlci5sZW5ndGggPCBsaW1pdDsKICB9CgogIC8qKgogICAqIFJlbW92ZSBhIHByb21pc2UgZnJvbSB0aGUgcXVldWUuCiAgICoKICAgKiBAcGFyYW0gdGFzayBDYW4gYmUgYW55IFByb21pc2VMaWtlPFQ+CiAgICogQHJldHVybnMgUmVtb3ZlZCBwcm9taXNlLgogICAqLwogIGZ1bmN0aW9uIHJlbW92ZSh0YXNrKSB7CiAgICByZXR1cm4gYnVmZmVyLnNwbGljZShidWZmZXIuaW5kZXhPZih0YXNrKSwgMSlbMF07CiAgfQoKICAvKioKICAgKiBBZGQgYSBwcm9taXNlIChyZXByZXNlbnRpbmcgYW4gaW4tZmxpZ2h0IGFjdGlvbikgdG8gdGhlIHF1ZXVlLCBhbmQgc2V0IGl0IHRvIHJlbW92ZSBpdHNlbGYgb24gZnVsZmlsbG1lbnQuCiAgICoKICAgKiBAcGFyYW0gdGFza1Byb2R1Y2VyIEEgZnVuY3Rpb24gcHJvZHVjaW5nIGFueSBQcm9taXNlTGlrZTxUPjsgSW4gcHJldmlvdXMgdmVyc2lvbnMgdGhpcyB1c2VkIHRvIGJlIGB0YXNrOgogICAqICAgICAgICBQcm9taXNlTGlrZTxUPmAsIGJ1dCB1bmRlciB0aGF0IG1vZGVsLCBQcm9taXNlcyB3ZXJlIGluc3RhbnRseSBjcmVhdGVkIG9uIHRoZSBjYWxsLXNpdGUgYW5kIHRoZWlyIGV4ZWN1dG9yCiAgICogICAgICAgIGZ1bmN0aW9ucyB0aGVyZWZvcmUgcmFuIGltbWVkaWF0ZWx5LiBUaHVzLCBldmVuIGlmIHRoZSBidWZmZXIgd2FzIGZ1bGwsIHRoZSBhY3Rpb24gc3RpbGwgaGFwcGVuZWQuIEJ5CiAgICogICAgICAgIHJlcXVpcmluZyB0aGUgcHJvbWlzZSB0byBiZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24sIHdlIGNhbiBkZWZlciBwcm9taXNlIGNyZWF0aW9uIHVudGlsIGFmdGVyIHRoZSBidWZmZXIKICAgKiAgICAgICAgbGltaXQgY2hlY2suCiAgICogQHJldHVybnMgVGhlIG9yaWdpbmFsIHByb21pc2UuCiAgICovCiAgZnVuY3Rpb24gYWRkKHRhc2tQcm9kdWNlcikgewogICAgaWYgKCFpc1JlYWR5KCkpIHsKICAgICAgcmV0dXJuIHJlamVjdGVkU3luY1Byb21pc2UobmV3IFNlbnRyeUVycm9yKCdOb3QgYWRkaW5nIFByb21pc2UgYmVjYXVzZSBidWZmZXIgbGltaXQgd2FzIHJlYWNoZWQuJykpOwogICAgfQoKICAgIC8vIHN0YXJ0IHRoZSB0YXNrIGFuZCBhZGQgaXRzIHByb21pc2UgdG8gdGhlIHF1ZXVlCiAgICBjb25zdCB0YXNrID0gdGFza1Byb2R1Y2VyKCk7CiAgICBpZiAoYnVmZmVyLmluZGV4T2YodGFzaykgPT09IC0xKSB7CiAgICAgIGJ1ZmZlci5wdXNoKHRhc2spOwogICAgfQogICAgdm9pZCB0YXNrCiAgICAgIC50aGVuKCgpID0+IHJlbW92ZSh0YXNrKSkKICAgICAgLy8gVXNlIGB0aGVuKG51bGwsIHJlamVjdGlvbkhhbmRsZXIpYCByYXRoZXIgdGhhbiBgY2F0Y2gocmVqZWN0aW9uSGFuZGxlcilgIHNvIHRoYXQgd2UgY2FuIHVzZSBgUHJvbWlzZUxpa2VgCiAgICAgIC8vIHJhdGhlciB0aGFuIGBQcm9taXNlYC4gYFByb21pc2VMaWtlYCBkb2Vzbid0IGhhdmUgYSBgLmNhdGNoYCBtZXRob2QsIG1ha2luZyBpdHMgcG9seWZpbGwgc21hbGxlci4gKEVTNSBkaWRuJ3QKICAgICAgLy8gaGF2ZSBwcm9taXNlcywgc28gVFMgaGFzIHRvIHBvbHlmaWxsIHdoZW4gZG93bi1jb21waWxpbmcuKQogICAgICAudGhlbihudWxsLCAoKSA9PgogICAgICAgIHJlbW92ZSh0YXNrKS50aGVuKG51bGwsICgpID0+IHsKICAgICAgICAgIC8vIFdlIGhhdmUgdG8gYWRkIGFub3RoZXIgY2F0Y2ggaGVyZSBiZWNhdXNlIGByZW1vdmUoKWAgc3RhcnRzIGEgbmV3IHByb21pc2UgY2hhaW4uCiAgICAgICAgfSksCiAgICAgICk7CiAgICByZXR1cm4gdGFzazsKICB9CgogIC8qKgogICAqIFdhaXQgZm9yIGFsbCBwcm9taXNlcyBpbiB0aGUgcXVldWUgdG8gcmVzb2x2ZSBvciBmb3IgdGltZW91dCB0byBleHBpcmUsIHdoaWNoZXZlciBjb21lcyBmaXJzdC4KICAgKgogICAqIEBwYXJhbSB0aW1lb3V0IFRoZSB0aW1lLCBpbiBtcywgYWZ0ZXIgd2hpY2ggdG8gcmVzb2x2ZSB0byBgZmFsc2VgIGlmIHRoZSBxdWV1ZSBpcyBzdGlsbCBub24tZW1wdHkuIFBhc3NpbmcgYDBgIChvcgogICAqIG5vdCBwYXNzaW5nIGFueXRoaW5nKSB3aWxsIG1ha2UgdGhlIHByb21pc2Ugd2FpdCBhcyBsb25nIGFzIGl0IHRha2VzIGZvciB0aGUgcXVldWUgdG8gZHJhaW4gYmVmb3JlIHJlc29sdmluZyB0bwogICAqIGB0cnVlYC4KICAgKiBAcmV0dXJucyBBIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHRvIGB0cnVlYCBpZiB0aGUgcXVldWUgaXMgYWxyZWFkeSBlbXB0eSBvciBkcmFpbnMgYmVmb3JlIHRoZSB0aW1lb3V0LCBhbmQKICAgKiBgZmFsc2VgIG90aGVyd2lzZQogICAqLwogIGZ1bmN0aW9uIGRyYWluKHRpbWVvdXQpIHsKICAgIHJldHVybiBuZXcgU3luY1Byb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gewogICAgICBsZXQgY291bnRlciA9IGJ1ZmZlci5sZW5ndGg7CgogICAgICBpZiAoIWNvdW50ZXIpIHsKICAgICAgICByZXR1cm4gcmVzb2x2ZSh0cnVlKTsKICAgICAgfQoKICAgICAgLy8gd2FpdCBmb3IgYHRpbWVvdXRgIG1zIGFuZCB0aGVuIHJlc29sdmUgdG8gYGZhbHNlYCAoaWYgbm90IGNhbmNlbGxlZCBmaXJzdCkKICAgICAgY29uc3QgY2FwdHVyZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7CiAgICAgICAgaWYgKHRpbWVvdXQgJiYgdGltZW91dCA+IDApIHsKICAgICAgICAgIHJlc29sdmUoZmFsc2UpOwogICAgICAgIH0KICAgICAgfSwgdGltZW91dCk7CgogICAgICAvLyBpZiBhbGwgcHJvbWlzZXMgcmVzb2x2ZSBpbiB0aW1lLCBjYW5jZWwgdGhlIHRpbWVyIGFuZCByZXNvbHZlIHRvIGB0cnVlYAogICAgICBidWZmZXIuZm9yRWFjaChpdGVtID0+IHsKICAgICAgICB2b2lkIHJlc29sdmVkU3luY1Byb21pc2UoaXRlbSkudGhlbigoKSA9PiB7CiAgICAgICAgICBpZiAoIS0tY291bnRlcikgewogICAgICAgICAgICBjbGVhclRpbWVvdXQoY2FwdHVyZWRTZXRUaW1lb3V0KTsKICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTsKICAgICAgICAgIH0KICAgICAgICB9LCByZWplY3QpOwogICAgICB9KTsKICAgIH0pOwogIH0KCiAgcmV0dXJuIHsKICAgICQ6IGJ1ZmZlciwKICAgIGFkZCwKICAgIGRyYWluLAogIH07Cn0KCmNvbnN0IE9ORV9TRUNPTkRfSU5fTVMgPSAxMDAwOwoKLyoqCiAqIEEgcGFydGlhbCBkZWZpbml0aW9uIG9mIHRoZSBbUGVyZm9ybWFuY2UgV2ViIEFQSV17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1BlcmZvcm1hbmNlfQogKiBmb3IgYWNjZXNzaW5nIGEgaGlnaC1yZXNvbHV0aW9uIG1vbm90b25pYyBjbG9jay4KICovCgovKioKICogUmV0dXJucyBhIHRpbWVzdGFtcCBpbiBzZWNvbmRzIHNpbmNlIHRoZSBVTklYIGVwb2NoIHVzaW5nIHRoZSBEYXRlIEFQSS4KICoKICogVE9ETyh2OCk6IFJldHVybiB0eXBlIHNob3VsZCBiZSByb3VuZGVkLgogKi8KZnVuY3Rpb24gZGF0ZVRpbWVzdGFtcEluU2Vjb25kcygpIHsKICByZXR1cm4gRGF0ZS5ub3coKSAvIE9ORV9TRUNPTkRfSU5fTVM7Cn0KCi8qKgogKiBSZXR1cm5zIGEgd3JhcHBlciBhcm91bmQgdGhlIG5hdGl2ZSBQZXJmb3JtYW5jZSBBUEkgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiwgb3IgdW5kZWZpbmVkIGZvciBicm93c2VycyB0aGF0IGRvIG5vdAogKiBzdXBwb3J0IHRoZSBBUEkuCiAqCiAqIFdyYXBwaW5nIHRoZSBuYXRpdmUgQVBJIHdvcmtzIGFyb3VuZCBkaWZmZXJlbmNlcyBpbiBiZWhhdmlvciBmcm9tIGRpZmZlcmVudCBicm93c2Vycy4KICovCmZ1bmN0aW9uIGNyZWF0ZVVuaXhUaW1lc3RhbXBJblNlY29uZHNGdW5jKCkgewogIGNvbnN0IHsgcGVyZm9ybWFuY2UgfSA9IEdMT0JBTF9PQkogOwogIGlmICghcGVyZm9ybWFuY2UgfHwgIXBlcmZvcm1hbmNlLm5vdykgewogICAgcmV0dXJuIGRhdGVUaW1lc3RhbXBJblNlY29uZHM7CiAgfQoKICAvLyBTb21lIGJyb3dzZXIgYW5kIGVudmlyb25tZW50cyBkb24ndCBoYXZlIGEgdGltZU9yaWdpbiwgc28gd2UgZmFsbGJhY2sgdG8KICAvLyB1c2luZyBEYXRlLm5vdygpIHRvIGNvbXB1dGUgdGhlIHN0YXJ0aW5nIHRpbWUuCiAgY29uc3QgYXBwcm94U3RhcnRpbmdUaW1lT3JpZ2luID0gRGF0ZS5ub3coKSAtIHBlcmZvcm1hbmNlLm5vdygpOwogIGNvbnN0IHRpbWVPcmlnaW4gPSBwZXJmb3JtYW5jZS50aW1lT3JpZ2luID09IHVuZGVmaW5lZCA/IGFwcHJveFN0YXJ0aW5nVGltZU9yaWdpbiA6IHBlcmZvcm1hbmNlLnRpbWVPcmlnaW47CgogIC8vIHBlcmZvcm1hbmNlLm5vdygpIGlzIGEgbW9ub3RvbmljIGNsb2NrLCB3aGljaCBtZWFucyBpdCBzdGFydHMgYXQgMCB3aGVuIHRoZSBwcm9jZXNzIGJlZ2lucy4gVG8gZ2V0IHRoZSBjdXJyZW50CiAgLy8gd2FsbCBjbG9jayB0aW1lIChhY3R1YWwgVU5JWCB0aW1lc3RhbXApLCB3ZSBuZWVkIHRvIGFkZCB0aGUgc3RhcnRpbmcgdGltZSBvcmlnaW4gYW5kIHRoZSBjdXJyZW50IHRpbWUgZWxhcHNlZC4KICAvLwogIC8vIFRPRE86IFRoaXMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlIGNhc2Ugd2hlcmUgdGhlIG1vbm90b25pYyBjbG9jayB0aGF0IHBvd2VycyBwZXJmb3JtYW5jZS5ub3coKSBkcmlmdHMgZnJvbSB0aGUKICAvLyB3YWxsIGNsb2NrIHRpbWUsIHdoaWNoIGNhdXNlcyB0aGUgcmV0dXJuZWQgdGltZXN0YW1wIHRvIGJlIGluYWNjdXJhdGUuIFdlIHNob3VsZCBpbnZlc3RpZ2F0ZSBob3cgdG8gZGV0ZWN0IGFuZAogIC8vIGNvcnJlY3QgZm9yIHRoaXMuCiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZ2V0c2VudHJ5L3NlbnRyeS1qYXZhc2NyaXB0L2lzc3Vlcy8yNTkwCiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vbWRuL2NvbnRlbnQvaXNzdWVzLzQ3MTMKICAvLyBTZWU6IGh0dHBzOi8vZGV2LnRvL25vYW1yL3doZW4tYS1taWxsaXNlY29uZC1pcy1ub3QtYS1taWxsaXNlY29uZC0zaDYKICByZXR1cm4gKCkgPT4gewogICAgcmV0dXJuICh0aW1lT3JpZ2luICsgcGVyZm9ybWFuY2Uubm93KCkpIC8gT05FX1NFQ09ORF9JTl9NUzsKICB9Owp9CgovKioKICogUmV0dXJucyBhIHRpbWVzdGFtcCBpbiBzZWNvbmRzIHNpbmNlIHRoZSBVTklYIGVwb2NoIHVzaW5nIGVpdGhlciB0aGUgUGVyZm9ybWFuY2Ugb3IgRGF0ZSBBUElzLCBkZXBlbmRpbmcgb24gdGhlCiAqIGF2YWlsYWJpbGl0eSBvZiB0aGUgUGVyZm9ybWFuY2UgQVBJLgogKgogKiBCVUc6IE5vdGUgdGhhdCBiZWNhdXNlIG9mIGhvdyBicm93c2VycyBpbXBsZW1lbnQgdGhlIFBlcmZvcm1hbmNlIEFQSSwgdGhlIGNsb2NrIG1pZ2h0IHN0b3Agd2hlbiB0aGUgY29tcHV0ZXIgaXMKICogYXNsZWVwLiBUaGlzIGNyZWF0ZXMgYSBza2V3IGJldHdlZW4gYGRhdGVUaW1lc3RhbXBJblNlY29uZHNgIGFuZCBgdGltZXN0YW1wSW5TZWNvbmRzYC4gVGhlCiAqIHNrZXcgY2FuIGdyb3cgdG8gYXJiaXRyYXJ5IGFtb3VudHMgbGlrZSBkYXlzLCB3ZWVrcyBvciBtb250aHMuCiAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZ2V0c2VudHJ5L3NlbnRyeS1qYXZhc2NyaXB0L2lzc3Vlcy8yNTkwLgogKi8KY29uc3QgdGltZXN0YW1wSW5TZWNvbmRzID0gY3JlYXRlVW5peFRpbWVzdGFtcEluU2Vjb25kc0Z1bmMoKTsKCi8qKgogKiBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBzaW5jZSB0aGUgVU5JWCBlcG9jaC4gVGhpcyB2YWx1ZSBpcyBvbmx5IHVzYWJsZSBpbiBhIGJyb3dzZXIsIGFuZCBvbmx5IHdoZW4gdGhlCiAqIHBlcmZvcm1hbmNlIEFQSSBpcyBhdmFpbGFibGUuCiAqLwooKCkgPT4gewogIC8vIFVuZm9ydHVuYXRlbHkgYnJvd3NlcnMgbWF5IHJlcG9ydCBhbiBpbmFjY3VyYXRlIHRpbWUgb3JpZ2luIGRhdGEsIHRocm91Z2ggZWl0aGVyIHBlcmZvcm1hbmNlLnRpbWVPcmlnaW4gb3IKICAvLyBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0LCB3aGljaCByZXN1bHRzIGluIHBvb3IgcmVzdWx0cyBpbiBwZXJmb3JtYW5jZSBkYXRhLiBXZSBvbmx5IHRyZWF0IHRpbWUgb3JpZ2luCiAgLy8gZGF0YSBhcyByZWxpYWJsZSBpZiB0aGV5IGFyZSB3aXRoaW4gYSByZWFzb25hYmxlIHRocmVzaG9sZCBvZiB0aGUgY3VycmVudCB0aW1lLgoKICBjb25zdCB7IHBlcmZvcm1hbmNlIH0gPSBHTE9CQUxfT0JKIDsKICBpZiAoIXBlcmZvcm1hbmNlIHx8ICFwZXJmb3JtYW5jZS5ub3cpIHsKICAgIHJldHVybiB1bmRlZmluZWQ7CiAgfQoKICBjb25zdCB0aHJlc2hvbGQgPSAzNjAwICogMTAwMDsKICBjb25zdCBwZXJmb3JtYW5jZU5vdyA9IHBlcmZvcm1hbmNlLm5vdygpOwogIGNvbnN0IGRhdGVOb3cgPSBEYXRlLm5vdygpOwoKICAvLyBpZiB0aW1lT3JpZ2luIGlzbid0IGF2YWlsYWJsZSBzZXQgZGVsdGEgdG8gdGhyZXNob2xkIHNvIGl0IGlzbid0IHVzZWQKICBjb25zdCB0aW1lT3JpZ2luRGVsdGEgPSBwZXJmb3JtYW5jZS50aW1lT3JpZ2luCiAgICA/IE1hdGguYWJzKHBlcmZvcm1hbmNlLnRpbWVPcmlnaW4gKyBwZXJmb3JtYW5jZU5vdyAtIGRhdGVOb3cpCiAgICA6IHRocmVzaG9sZDsKICBjb25zdCB0aW1lT3JpZ2luSXNSZWxpYWJsZSA9IHRpbWVPcmlnaW5EZWx0YSA8IHRocmVzaG9sZDsKCiAgLy8gV2hpbGUgcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCBpcyBkZXByZWNhdGVkIGluIGZhdm9yIG9mIHBlcmZvcm1hbmNlLnRpbWVPcmlnaW4sIHBlcmZvcm1hbmNlLnRpbWVPcmlnaW4KICAvLyBpcyBub3QgYXMgd2lkZWx5IHN1cHBvcnRlZC4gTmFtZWx5LCBwZXJmb3JtYW5jZS50aW1lT3JpZ2luIGlzIHVuZGVmaW5lZCBpbiBTYWZhcmkgYXMgb2Ygd3JpdGluZy4KICAvLyBBbHNvIGFzIG9mIHdyaXRpbmcsIHBlcmZvcm1hbmNlLnRpbWluZyBpcyBub3QgYXZhaWxhYmxlIGluIFdlYiBXb3JrZXJzIGluIG1haW5zdHJlYW0gYnJvd3NlcnMsIHNvIGl0IGlzIG5vdCBhbHdheXMKICAvLyBhIHZhbGlkIGZhbGxiYWNrLiBJbiB0aGUgYWJzZW5jZSBvZiBhbiBpbml0aWFsIHRpbWUgcHJvdmlkZWQgYnkgdGhlIGJyb3dzZXIsIGZhbGxiYWNrIHRvIHRoZSBjdXJyZW50IHRpbWUgZnJvbSB0aGUKICAvLyBEYXRlIEFQSS4KICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICBjb25zdCBuYXZpZ2F0aW9uU3RhcnQgPSBwZXJmb3JtYW5jZS50aW1pbmcgJiYgcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDsKICBjb25zdCBoYXNOYXZpZ2F0aW9uU3RhcnQgPSB0eXBlb2YgbmF2aWdhdGlvblN0YXJ0ID09PSAnbnVtYmVyJzsKICAvLyBpZiBuYXZpZ2F0aW9uU3RhcnQgaXNuJ3QgYXZhaWxhYmxlIHNldCBkZWx0YSB0byB0aHJlc2hvbGQgc28gaXQgaXNuJ3QgdXNlZAogIGNvbnN0IG5hdmlnYXRpb25TdGFydERlbHRhID0gaGFzTmF2aWdhdGlvblN0YXJ0ID8gTWF0aC5hYnMobmF2aWdhdGlvblN0YXJ0ICsgcGVyZm9ybWFuY2VOb3cgLSBkYXRlTm93KSA6IHRocmVzaG9sZDsKICBjb25zdCBuYXZpZ2F0aW9uU3RhcnRJc1JlbGlhYmxlID0gbmF2aWdhdGlvblN0YXJ0RGVsdGEgPCB0aHJlc2hvbGQ7CgogIGlmICh0aW1lT3JpZ2luSXNSZWxpYWJsZSB8fCBuYXZpZ2F0aW9uU3RhcnRJc1JlbGlhYmxlKSB7CiAgICAvLyBVc2UgdGhlIG1vcmUgcmVsaWFibGUgdGltZSBvcmlnaW4KICAgIGlmICh0aW1lT3JpZ2luRGVsdGEgPD0gbmF2aWdhdGlvblN0YXJ0RGVsdGEpIHsKICAgICAgcmV0dXJuIHBlcmZvcm1hbmNlLnRpbWVPcmlnaW47CiAgICB9IGVsc2UgewogICAgICByZXR1cm4gbmF2aWdhdGlvblN0YXJ0OwogICAgfQogIH0KICByZXR1cm4gZGF0ZU5vdzsKfSkoKTsKCi8qKgogKiBDcmVhdGVzIGFuIGVudmVsb3BlLgogKiBNYWtlIHN1cmUgdG8gYWx3YXlzIGV4cGxpY2l0bHkgcHJvdmlkZSB0aGUgZ2VuZXJpYyB0byB0aGlzIGZ1bmN0aW9uCiAqIHNvIHRoYXQgdGhlIGVudmVsb3BlIHR5cGVzIHJlc29sdmUgY29ycmVjdGx5LgogKi8KZnVuY3Rpb24gY3JlYXRlRW52ZWxvcGUoaGVhZGVycywgaXRlbXMgPSBbXSkgewogIHJldHVybiBbaGVhZGVycywgaXRlbXNdIDsKfQoKLyoqCiAqIENvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGxvb3AgdGhyb3VnaCB0aGUgaXRlbXMgYW5kIGl0ZW0gdHlwZXMgb2YgYW4gZW52ZWxvcGUuCiAqIChUaGlzIGZ1bmN0aW9uIHdhcyBtb3N0bHkgY3JlYXRlZCBiZWNhdXNlIHdvcmtpbmcgd2l0aCBlbnZlbG9wZSB0eXBlcyBpcyBwYWluZnVsIGF0IHRoZSBtb21lbnQpCiAqCiAqIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWUsIHRoZSByZXN0IG9mIHRoZSBpdGVtcyB3aWxsIGJlIHNraXBwZWQuCiAqLwpmdW5jdGlvbiBmb3JFYWNoRW52ZWxvcGVJdGVtKAogIGVudmVsb3BlLAogIGNhbGxiYWNrLAopIHsKICBjb25zdCBlbnZlbG9wZUl0ZW1zID0gZW52ZWxvcGVbMV07CgogIGZvciAoY29uc3QgZW52ZWxvcGVJdGVtIG9mIGVudmVsb3BlSXRlbXMpIHsKICAgIGNvbnN0IGVudmVsb3BlSXRlbVR5cGUgPSBlbnZlbG9wZUl0ZW1bMF0udHlwZTsKICAgIGNvbnN0IHJlc3VsdCA9IGNhbGxiYWNrKGVudmVsb3BlSXRlbSwgZW52ZWxvcGVJdGVtVHlwZSk7CgogICAgaWYgKHJlc3VsdCkgewogICAgICByZXR1cm4gdHJ1ZTsKICAgIH0KICB9CgogIHJldHVybiBmYWxzZTsKfQoKLyoqCiAqIEVuY29kZSBhIHN0cmluZyB0byBVVEY4LgogKi8KZnVuY3Rpb24gZW5jb2RlVVRGOChpbnB1dCwgdGV4dEVuY29kZXIpIHsKICBjb25zdCB1dGY4ID0gdGV4dEVuY29kZXIgfHwgbmV3IFRleHRFbmNvZGVyKCk7CiAgcmV0dXJuIHV0ZjguZW5jb2RlKGlucHV0KTsKfQoKLyoqCiAqIFNlcmlhbGl6ZXMgYW4gZW52ZWxvcGUuCiAqLwpmdW5jdGlvbiBzZXJpYWxpemVFbnZlbG9wZShlbnZlbG9wZSwgdGV4dEVuY29kZXIpIHsKICBjb25zdCBbZW52SGVhZGVycywgaXRlbXNdID0gZW52ZWxvcGU7CgogIC8vIEluaXRpYWxseSB3ZSBjb25zdHJ1Y3Qgb3VyIGVudmVsb3BlIGFzIGEgc3RyaW5nIGFuZCBvbmx5IGNvbnZlcnQgdG8gYmluYXJ5IGNodW5rcyBpZiB3ZSBlbmNvdW50ZXIgYmluYXJ5IGRhdGEKICBsZXQgcGFydHMgPSBKU09OLnN0cmluZ2lmeShlbnZIZWFkZXJzKTsKCiAgZnVuY3Rpb24gYXBwZW5kKG5leHQpIHsKICAgIGlmICh0eXBlb2YgcGFydHMgPT09ICdzdHJpbmcnKSB7CiAgICAgIHBhcnRzID0gdHlwZW9mIG5leHQgPT09ICdzdHJpbmcnID8gcGFydHMgKyBuZXh0IDogW2VuY29kZVVURjgocGFydHMsIHRleHRFbmNvZGVyKSwgbmV4dF07CiAgICB9IGVsc2UgewogICAgICBwYXJ0cy5wdXNoKHR5cGVvZiBuZXh0ID09PSAnc3RyaW5nJyA/IGVuY29kZVVURjgobmV4dCwgdGV4dEVuY29kZXIpIDogbmV4dCk7CiAgICB9CiAgfQoKICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHsKICAgIGNvbnN0IFtpdGVtSGVhZGVycywgcGF5bG9hZF0gPSBpdGVtOwoKICAgIGFwcGVuZChgXG4ke0pTT04uc3RyaW5naWZ5KGl0ZW1IZWFkZXJzKX1cbmApOwoKICAgIGlmICh0eXBlb2YgcGF5bG9hZCA9PT0gJ3N0cmluZycgfHwgcGF5bG9hZCBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHsKICAgICAgYXBwZW5kKHBheWxvYWQpOwogICAgfSBlbHNlIHsKICAgICAgbGV0IHN0cmluZ2lmaWVkUGF5bG9hZDsKICAgICAgdHJ5IHsKICAgICAgICBzdHJpbmdpZmllZFBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShwYXlsb2FkKTsKICAgICAgfSBjYXRjaCAoZSkgewogICAgICAgIC8vIEluIGNhc2UsIGRlc3BpdGUgYWxsIG91ciBlZmZvcnRzIHRvIGtlZXAgYHBheWxvYWRgIGNpcmN1bGFyLWRlcGVuZGVuY3ktZnJlZSwgYEpTT04uc3RyaW5pZnkoKWAgc3RpbGwKICAgICAgICAvLyBmYWlscywgd2UgdHJ5IGFnYWluIGFmdGVyIG5vcm1hbGl6aW5nIGl0IGFnYWluIHdpdGggaW5maW5pdGUgbm9ybWFsaXphdGlvbiBkZXB0aC4gVGhpcyBvZiBjb3Vyc2UgaGFzIGEKICAgICAgICAvLyBwZXJmb3JtYW5jZSBpbXBhY3QgYnV0IGluIHRoaXMgY2FzZSBhIHBlcmZvcm1hbmNlIGhpdCBpcyBiZXR0ZXIgdGhhbiB0aHJvd2luZy4KICAgICAgICBzdHJpbmdpZmllZFBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShub3JtYWxpemUocGF5bG9hZCkpOwogICAgICB9CiAgICAgIGFwcGVuZChzdHJpbmdpZmllZFBheWxvYWQpOwogICAgfQogIH0KCiAgcmV0dXJuIHR5cGVvZiBwYXJ0cyA9PT0gJ3N0cmluZycgPyBwYXJ0cyA6IGNvbmNhdEJ1ZmZlcnMocGFydHMpOwp9CgpmdW5jdGlvbiBjb25jYXRCdWZmZXJzKGJ1ZmZlcnMpIHsKICBjb25zdCB0b3RhbExlbmd0aCA9IGJ1ZmZlcnMucmVkdWNlKChhY2MsIGJ1ZikgPT4gYWNjICsgYnVmLmxlbmd0aCwgMCk7CgogIGNvbnN0IG1lcmdlZCA9IG5ldyBVaW50OEFycmF5KHRvdGFsTGVuZ3RoKTsKICBsZXQgb2Zmc2V0ID0gMDsKICBmb3IgKGNvbnN0IGJ1ZmZlciBvZiBidWZmZXJzKSB7CiAgICBtZXJnZWQuc2V0KGJ1ZmZlciwgb2Zmc2V0KTsKICAgIG9mZnNldCArPSBidWZmZXIubGVuZ3RoOwogIH0KCiAgcmV0dXJuIG1lcmdlZDsKfQoKY29uc3QgSVRFTV9UWVBFX1RPX0RBVEFfQ0FURUdPUllfTUFQID0gewogIHNlc3Npb246ICdzZXNzaW9uJywKICBzZXNzaW9uczogJ3Nlc3Npb24nLAogIGF0dGFjaG1lbnQ6ICdhdHRhY2htZW50JywKICB0cmFuc2FjdGlvbjogJ3RyYW5zYWN0aW9uJywKICBldmVudDogJ2Vycm9yJywKICBjbGllbnRfcmVwb3J0OiAnaW50ZXJuYWwnLAogIHVzZXJfcmVwb3J0OiAnZGVmYXVsdCcsCiAgcHJvZmlsZTogJ3Byb2ZpbGUnLAogIHJlcGxheV9ldmVudDogJ3JlcGxheScsCiAgcmVwbGF5X3JlY29yZGluZzogJ3JlcGxheScsCiAgY2hlY2tfaW46ICdtb25pdG9yJywKICBmZWVkYmFjazogJ2ZlZWRiYWNrJywKICBzcGFuOiAnc3BhbicsCiAgc3RhdHNkOiAnbWV0cmljX2J1Y2tldCcsCn07CgovKioKICogTWFwcyB0aGUgdHlwZSBvZiBhbiBlbnZlbG9wZSBpdGVtIHRvIGEgZGF0YSBjYXRlZ29yeS4KICovCmZ1bmN0aW9uIGVudmVsb3BlSXRlbVR5cGVUb0RhdGFDYXRlZ29yeSh0eXBlKSB7CiAgcmV0dXJuIElURU1fVFlQRV9UT19EQVRBX0NBVEVHT1JZX01BUFt0eXBlXTsKfQoKLyoqIEV4dHJhY3RzIHRoZSBtaW5pbWFsIFNESyBpbmZvIGZyb20gdGhlIG1ldGFkYXRhIG9yIGFuIGV2ZW50cyAqLwpmdW5jdGlvbiBnZXRTZGtNZXRhZGF0YUZvckVudmVsb3BlSGVhZGVyKG1ldGFkYXRhT3JFdmVudCkgewogIGlmICghbWV0YWRhdGFPckV2ZW50IHx8ICFtZXRhZGF0YU9yRXZlbnQuc2RrKSB7CiAgICByZXR1cm47CiAgfQogIGNvbnN0IHsgbmFtZSwgdmVyc2lvbiB9ID0gbWV0YWRhdGFPckV2ZW50LnNkazsKICByZXR1cm4geyBuYW1lLCB2ZXJzaW9uIH07Cn0KCi8qKgogKiBDcmVhdGVzIGV2ZW50IGVudmVsb3BlIGhlYWRlcnMsIGJhc2VkIG9uIGV2ZW50LCBzZGsgaW5mbyBhbmQgdHVubmVsCiAqIE5vdGU6IFRoaXMgZnVuY3Rpb24gd2FzIGV4dHJhY3RlZCBmcm9tIHRoZSBjb3JlIHBhY2thZ2UgdG8gbWFrZSBpdCBhdmFpbGFibGUgaW4gUmVwbGF5CiAqLwpmdW5jdGlvbiBjcmVhdGVFdmVudEVudmVsb3BlSGVhZGVycygKICBldmVudCwKICBzZGtJbmZvLAogIHR1bm5lbCwKICBkc24sCikgewogIGNvbnN0IGR5bmFtaWNTYW1wbGluZ0NvbnRleHQgPSBldmVudC5zZGtQcm9jZXNzaW5nTWV0YWRhdGEgJiYgZXZlbnQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhLmR5bmFtaWNTYW1wbGluZ0NvbnRleHQ7CiAgcmV0dXJuIHsKICAgIGV2ZW50X2lkOiBldmVudC5ldmVudF9pZCAsCiAgICBzZW50X2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksCiAgICAuLi4oc2RrSW5mbyAmJiB7IHNkazogc2RrSW5mbyB9KSwKICAgIC4uLighIXR1bm5lbCAmJiBkc24gJiYgeyBkc246IGRzblRvU3RyaW5nKGRzbikgfSksCiAgICAuLi4oZHluYW1pY1NhbXBsaW5nQ29udGV4dCAmJiB7CiAgICAgIHRyYWNlOiBkcm9wVW5kZWZpbmVkS2V5cyh7IC4uLmR5bmFtaWNTYW1wbGluZ0NvbnRleHQgfSksCiAgICB9KSwKICB9Owp9CgovLyBJbnRlbnRpb25hbGx5IGtlZXBpbmcgdGhlIGtleSBicm9hZCwgYXMgd2UgZG9uJ3Qga25vdyBmb3Igc3VyZSB3aGF0IHJhdGUgbGltaXQgaGVhZGVycyBnZXQgcmV0dXJuZWQgZnJvbSBiYWNrZW5kCgpjb25zdCBERUZBVUxUX1JFVFJZX0FGVEVSID0gNjAgKiAxMDAwOyAvLyA2MCBzZWNvbmRzCgovKioKICogRXh0cmFjdHMgUmV0cnktQWZ0ZXIgdmFsdWUgZnJvbSB0aGUgcmVxdWVzdCBoZWFkZXIgb3IgcmV0dXJucyBkZWZhdWx0IHZhbHVlCiAqIEBwYXJhbSBoZWFkZXIgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mICdSZXRyeS1BZnRlcicgaGVhZGVyCiAqIEBwYXJhbSBub3cgY3VycmVudCB1bml4IHRpbWVzdGFtcAogKgogKi8KZnVuY3Rpb24gcGFyc2VSZXRyeUFmdGVySGVhZGVyKGhlYWRlciwgbm93ID0gRGF0ZS5ub3coKSkgewogIGNvbnN0IGhlYWRlckRlbGF5ID0gcGFyc2VJbnQoYCR7aGVhZGVyfWAsIDEwKTsKICBpZiAoIWlzTmFOKGhlYWRlckRlbGF5KSkgewogICAgcmV0dXJuIGhlYWRlckRlbGF5ICogMTAwMDsKICB9CgogIGNvbnN0IGhlYWRlckRhdGUgPSBEYXRlLnBhcnNlKGAke2hlYWRlcn1gKTsKICBpZiAoIWlzTmFOKGhlYWRlckRhdGUpKSB7CiAgICByZXR1cm4gaGVhZGVyRGF0ZSAtIG5vdzsKICB9CgogIHJldHVybiBERUZBVUxUX1JFVFJZX0FGVEVSOwp9CgovKioKICogR2V0cyB0aGUgdGltZSB0aGF0IHRoZSBnaXZlbiBjYXRlZ29yeSBpcyBkaXNhYmxlZCB1bnRpbCBmb3IgcmF0ZSBsaW1pdGluZy4KICogSW4gY2FzZSBubyBjYXRlZ29yeS1zcGVjaWZpYyBsaW1pdCBpcyBzZXQgYnV0IGEgZ2VuZXJhbCByYXRlIGxpbWl0IGFjcm9zcyBhbGwgY2F0ZWdvcmllcyBpcyBhY3RpdmUsCiAqIHRoYXQgdGltZSBpcyByZXR1cm5lZC4KICoKICogQHJldHVybiB0aGUgdGltZSBpbiBtcyB0aGF0IHRoZSBjYXRlZ29yeSBpcyBkaXNhYmxlZCB1bnRpbCBvciAwIGlmIHRoZXJlJ3Mgbm8gYWN0aXZlIHJhdGUgbGltaXQuCiAqLwpmdW5jdGlvbiBkaXNhYmxlZFVudGlsKGxpbWl0cywgZGF0YUNhdGVnb3J5KSB7CiAgcmV0dXJuIGxpbWl0c1tkYXRhQ2F0ZWdvcnldIHx8IGxpbWl0cy5hbGwgfHwgMDsKfQoKLyoqCiAqIENoZWNrcyBpZiBhIGNhdGVnb3J5IGlzIHJhdGUgbGltaXRlZAogKi8KZnVuY3Rpb24gaXNSYXRlTGltaXRlZChsaW1pdHMsIGRhdGFDYXRlZ29yeSwgbm93ID0gRGF0ZS5ub3coKSkgewogIHJldHVybiBkaXNhYmxlZFVudGlsKGxpbWl0cywgZGF0YUNhdGVnb3J5KSA+IG5vdzsKfQoKLyoqCiAqIFVwZGF0ZSByYXRlbGltaXRzIGZyb20gaW5jb21pbmcgaGVhZGVycy4KICoKICogQHJldHVybiB0aGUgdXBkYXRlZCBSYXRlTGltaXRzIG9iamVjdC4KICovCmZ1bmN0aW9uIHVwZGF0ZVJhdGVMaW1pdHMoCiAgbGltaXRzLAogIHsgc3RhdHVzQ29kZSwgaGVhZGVycyB9LAogIG5vdyA9IERhdGUubm93KCksCikgewogIGNvbnN0IHVwZGF0ZWRSYXRlTGltaXRzID0gewogICAgLi4ubGltaXRzLAogIH07CgogIC8vICJUaGUgbmFtZSBpcyBjYXNlLWluc2Vuc2l0aXZlLiIKICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSGVhZGVycy9nZXQKICBjb25zdCByYXRlTGltaXRIZWFkZXIgPSBoZWFkZXJzICYmIGhlYWRlcnNbJ3gtc2VudHJ5LXJhdGUtbGltaXRzJ107CiAgY29uc3QgcmV0cnlBZnRlckhlYWRlciA9IGhlYWRlcnMgJiYgaGVhZGVyc1sncmV0cnktYWZ0ZXInXTsKCiAgaWYgKHJhdGVMaW1pdEhlYWRlcikgewogICAgLyoqCiAgICAgKiByYXRlIGxpbWl0IGhlYWRlcnMgYXJlIG9mIHRoZSBmb3JtCiAgICAgKiAgICAgPGhlYWRlcj4sPGhlYWRlcj4sLi4KICAgICAqIHdoZXJlIGVhY2ggPGhlYWRlcj4gaXMgb2YgdGhlIGZvcm0KICAgICAqICAgICA8cmV0cnlfYWZ0ZXI+OiA8Y2F0ZWdvcmllcz46IDxzY29wZT46IDxyZWFzb25fY29kZT46IDxuYW1lc3BhY2VzPgogICAgICogd2hlcmUKICAgICAqICAgICA8cmV0cnlfYWZ0ZXI+IGlzIGEgZGVsYXkgaW4gc2Vjb25kcwogICAgICogICAgIDxjYXRlZ29yaWVzPiBpcyB0aGUgZXZlbnQgdHlwZShzKSAoZXJyb3IsIHRyYW5zYWN0aW9uLCBldGMpIGJlaW5nIHJhdGUgbGltaXRlZCBhbmQgaXMgb2YgdGhlIGZvcm0KICAgICAqICAgICAgICAgPGNhdGVnb3J5Pjs8Y2F0ZWdvcnk+Oy4uLgogICAgICogICAgIDxzY29wZT4gaXMgd2hhdCdzIGJlaW5nIGxpbWl0ZWQgKG9yZywgcHJvamVjdCwgb3Iga2V5KSAtIGlnbm9yZWQgYnkgU0RLCiAgICAgKiAgICAgPHJlYXNvbl9jb2RlPiBpcyBhbiBhcmJpdHJhcnkgc3RyaW5nIGxpa2UgIm9yZ19xdW90YSIgLSBpZ25vcmVkIGJ5IFNESwogICAgICogICAgIDxuYW1lc3BhY2VzPiBTZW1pY29sb24tc2VwYXJhdGVkIGxpc3Qgb2YgbWV0cmljIG5hbWVzcGFjZSBpZGVudGlmaWVycy4gRGVmaW5lcyB3aGljaCBuYW1lc3BhY2Uocykgd2lsbCBiZSBhZmZlY3RlZC4KICAgICAqICAgICAgICAgT25seSBwcmVzZW50IGlmIHJhdGUgbGltaXQgYXBwbGllcyB0byB0aGUgbWV0cmljX2J1Y2tldCBkYXRhIGNhdGVnb3J5LgogICAgICovCiAgICBmb3IgKGNvbnN0IGxpbWl0IG9mIHJhdGVMaW1pdEhlYWRlci50cmltKCkuc3BsaXQoJywnKSkgewogICAgICBjb25zdCBbcmV0cnlBZnRlciwgY2F0ZWdvcmllcywgLCAsIG5hbWVzcGFjZXNdID0gbGltaXQuc3BsaXQoJzonLCA1KTsKICAgICAgY29uc3QgaGVhZGVyRGVsYXkgPSBwYXJzZUludChyZXRyeUFmdGVyLCAxMCk7CiAgICAgIGNvbnN0IGRlbGF5ID0gKCFpc05hTihoZWFkZXJEZWxheSkgPyBoZWFkZXJEZWxheSA6IDYwKSAqIDEwMDA7IC8vIDYwc2VjIGRlZmF1bHQKICAgICAgaWYgKCFjYXRlZ29yaWVzKSB7CiAgICAgICAgdXBkYXRlZFJhdGVMaW1pdHMuYWxsID0gbm93ICsgZGVsYXk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgZm9yIChjb25zdCBjYXRlZ29yeSBvZiBjYXRlZ29yaWVzLnNwbGl0KCc7JykpIHsKICAgICAgICAgIGlmIChjYXRlZ29yeSA9PT0gJ21ldHJpY19idWNrZXQnKSB7CiAgICAgICAgICAgIC8vIG5hbWVzcGFjZXMgd2lsbCBiZSBwcmVzZW50IHdoZW4gY2F0ZWdvcnkgPT09ICdtZXRyaWNfYnVja2V0JwogICAgICAgICAgICBpZiAoIW5hbWVzcGFjZXMgfHwgbmFtZXNwYWNlcy5zcGxpdCgnOycpLmluY2x1ZGVzKCdjdXN0b20nKSkgewogICAgICAgICAgICAgIHVwZGF0ZWRSYXRlTGltaXRzW2NhdGVnb3J5XSA9IG5vdyArIGRlbGF5OwogICAgICAgICAgICB9CiAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICB1cGRhdGVkUmF0ZUxpbWl0c1tjYXRlZ29yeV0gPSBub3cgKyBkZWxheTsKICAgICAgICAgIH0KICAgICAgICB9CiAgICAgIH0KICAgIH0KICB9IGVsc2UgaWYgKHJldHJ5QWZ0ZXJIZWFkZXIpIHsKICAgIHVwZGF0ZWRSYXRlTGltaXRzLmFsbCA9IG5vdyArIHBhcnNlUmV0cnlBZnRlckhlYWRlcihyZXRyeUFmdGVySGVhZGVyLCBub3cpOwogIH0gZWxzZSBpZiAoc3RhdHVzQ29kZSA9PT0gNDI5KSB7CiAgICB1cGRhdGVkUmF0ZUxpbWl0cy5hbGwgPSBub3cgKyA2MCAqIDEwMDA7CiAgfQoKICByZXR1cm4gdXBkYXRlZFJhdGVMaW1pdHM7Cn0KCi8qKgogKiBBIG5vZGUuanMgd2F0Y2hkb2cgdGltZXIKICogQHBhcmFtIHBvbGxJbnRlcnZhbCBUaGUgaW50ZXJ2YWwgdGhhdCB3ZSBleHBlY3QgdG8gZ2V0IHBvbGxlZCBhdAogKiBAcGFyYW0gYW5yVGhyZXNob2xkIFRoZSB0aHJlc2hvbGQgZm9yIHdoZW4gd2UgY29uc2lkZXIgQU5SCiAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gY2FsbCBmb3IgQU5SCiAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGBwb2xsYCBhbmQgYGVuYWJsZWRgIGZ1bmN0aW9ucyB7QGxpbmsgV2F0Y2hkb2dSZXR1cm59CiAqLwpmdW5jdGlvbiB3YXRjaGRvZ1RpbWVyKAogIGNyZWF0ZVRpbWVyLAogIHBvbGxJbnRlcnZhbCwKICBhbnJUaHJlc2hvbGQsCiAgY2FsbGJhY2ssCikgewogIGNvbnN0IHRpbWVyID0gY3JlYXRlVGltZXIoKTsKICBsZXQgdHJpZ2dlcmVkID0gZmFsc2U7CiAgbGV0IGVuYWJsZWQgPSB0cnVlOwoKICBzZXRJbnRlcnZhbCgoKSA9PiB7CiAgICBjb25zdCBkaWZmTXMgPSB0aW1lci5nZXRUaW1lTXMoKTsKCiAgICBpZiAodHJpZ2dlcmVkID09PSBmYWxzZSAmJiBkaWZmTXMgPiBwb2xsSW50ZXJ2YWwgKyBhbnJUaHJlc2hvbGQpIHsKICAgICAgdHJpZ2dlcmVkID0gdHJ1ZTsKICAgICAgaWYgKGVuYWJsZWQpIHsKICAgICAgICBjYWxsYmFjaygpOwogICAgICB9CiAgICB9CgogICAgaWYgKGRpZmZNcyA8IHBvbGxJbnRlcnZhbCArIGFuclRocmVzaG9sZCkgewogICAgICB0cmlnZ2VyZWQgPSBmYWxzZTsKICAgIH0KICB9LCAyMCk7CgogIHJldHVybiB7CiAgICBwb2xsOiAoKSA9PiB7CiAgICAgIHRpbWVyLnJlc2V0KCk7CiAgICB9LAogICAgZW5hYmxlZDogKHN0YXRlKSA9PiB7CiAgICAgIGVuYWJsZWQgPSBzdGF0ZTsKICAgIH0sCiAgfTsKfQoKLy8gdHlwZXMgY29waWVkIGZyb20gaW5zcGVjdG9yLmQudHMKCi8qKgogKiBDb252ZXJ0cyBEZWJ1Z2dlci5DYWxsRnJhbWUgdG8gU2VudHJ5IFN0YWNrRnJhbWUKICovCmZ1bmN0aW9uIGNhbGxGcmFtZVRvU3RhY2tGcmFtZSgKICBmcmFtZSwKICB1cmwsCiAgZ2V0TW9kdWxlRnJvbUZpbGVuYW1lLAopIHsKICBjb25zdCBmaWxlbmFtZSA9IHVybCA/IHVybC5yZXBsYWNlKC9eZmlsZTpcL1wvLywgJycpIDogdW5kZWZpbmVkOwoKICAvLyBDYWxsRnJhbWUgcm93L2NvbCBhcmUgMCBiYXNlZCwgd2hlcmVhcyBTdGFja0ZyYW1lIGFyZSAxIGJhc2VkCiAgY29uc3QgY29sbm8gPSBmcmFtZS5sb2NhdGlvbi5jb2x1bW5OdW1iZXIgPyBmcmFtZS5sb2NhdGlvbi5jb2x1bW5OdW1iZXIgKyAxIDogdW5kZWZpbmVkOwogIGNvbnN0IGxpbmVubyA9IGZyYW1lLmxvY2F0aW9uLmxpbmVOdW1iZXIgPyBmcmFtZS5sb2NhdGlvbi5saW5lTnVtYmVyICsgMSA6IHVuZGVmaW5lZDsKCiAgcmV0dXJuIGRyb3BVbmRlZmluZWRLZXlzKHsKICAgIGZpbGVuYW1lLAogICAgbW9kdWxlOiBnZXRNb2R1bGVGcm9tRmlsZW5hbWUoZmlsZW5hbWUpLAogICAgZnVuY3Rpb246IGZyYW1lLmZ1bmN0aW9uTmFtZSB8fCAnPycsCiAgICBjb2xubywKICAgIGxpbmVubywKICAgIGluX2FwcDogZmlsZW5hbWUgPyBmaWxlbmFtZUlzSW5BcHAoZmlsZW5hbWUpIDogdW5kZWZpbmVkLAogIH0pOwp9CgovKioKICogVGhpcyBzZXJ2ZXMgYXMgYSBidWlsZCB0aW1lIGZsYWcgdGhhdCB3aWxsIGJlIHRydWUgYnkgZGVmYXVsdCwgYnV0IGZhbHNlIGluIG5vbi1kZWJ1ZyBidWlsZHMgb3IgaWYgdXNlcnMgcmVwbGFjZSBgX19TRU5UUllfREVCVUdfX2AgaW4gdGhlaXIgZ2VuZXJhdGVkIGNvZGUuCiAqCiAqIEFUVEVOVElPTjogVGhpcyBjb25zdGFudCBtdXN0IG5ldmVyIGNyb3NzIHBhY2thZ2UgYm91bmRhcmllcyAoaS5lLiBiZSBleHBvcnRlZCkgdG8gZ3VhcmFudGVlIHRoYXQgaXQgY2FuIGJlIHVzZWQgZm9yIHRyZWUgc2hha2luZy4KICovCmNvbnN0IERFQlVHX0JVSUxEID0gKHR5cGVvZiBfX1NFTlRSWV9ERUJVR19fID09PSAndW5kZWZpbmVkJyB8fCBfX1NFTlRSWV9ERUJVR19fKTsKCmNvbnN0IERFRkFVTFRfRU5WSVJPTk1FTlQgPSAncHJvZHVjdGlvbic7CgovKioKICogUmV0dXJucyB0aGUgZ2xvYmFsIGV2ZW50IHByb2Nlc3NvcnMuCiAqIEBkZXByZWNhdGVkIEdsb2JhbCBldmVudCBwcm9jZXNzb3JzIHdpbGwgYmUgcmVtb3ZlZCBpbiB2OC4KICovCmZ1bmN0aW9uIGdldEdsb2JhbEV2ZW50UHJvY2Vzc29ycygpIHsKICByZXR1cm4gZ2V0R2xvYmFsU2luZ2xldG9uKCdnbG9iYWxFdmVudFByb2Nlc3NvcnMnLCAoKSA9PiBbXSk7Cn0KCi8qKgogKiBQcm9jZXNzIGFuIGFycmF5IG9mIGV2ZW50IHByb2Nlc3NvcnMsIHJldHVybmluZyB0aGUgcHJvY2Vzc2VkIGV2ZW50IChvciBgbnVsbGAgaWYgdGhlIGV2ZW50IHdhcyBkcm9wcGVkKS4KICovCmZ1bmN0aW9uIG5vdGlmeUV2ZW50UHJvY2Vzc29ycygKICBwcm9jZXNzb3JzLAogIGV2ZW50LAogIGhpbnQsCiAgaW5kZXggPSAwLAopIHsKICByZXR1cm4gbmV3IFN5bmNQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsKICAgIGNvbnN0IHByb2Nlc3NvciA9IHByb2Nlc3NvcnNbaW5kZXhdOwogICAgaWYgKGV2ZW50ID09PSBudWxsIHx8IHR5cGVvZiBwcm9jZXNzb3IgIT09ICdmdW5jdGlvbicpIHsKICAgICAgcmVzb2x2ZShldmVudCk7CiAgICB9IGVsc2UgewogICAgICBjb25zdCByZXN1bHQgPSBwcm9jZXNzb3IoeyAuLi5ldmVudCB9LCBoaW50KSA7CgogICAgICBERUJVR19CVUlMRCAmJiBwcm9jZXNzb3IuaWQgJiYgcmVzdWx0ID09PSBudWxsICYmIGxvZ2dlci5sb2coYEV2ZW50IHByb2Nlc3NvciAiJHtwcm9jZXNzb3IuaWR9IiBkcm9wcGVkIGV2ZW50YCk7CgogICAgICBpZiAoaXNUaGVuYWJsZShyZXN1bHQpKSB7CiAgICAgICAgdm9pZCByZXN1bHQKICAgICAgICAgIC50aGVuKGZpbmFsID0+IG5vdGlmeUV2ZW50UHJvY2Vzc29ycyhwcm9jZXNzb3JzLCBmaW5hbCwgaGludCwgaW5kZXggKyAxKS50aGVuKHJlc29sdmUpKQogICAgICAgICAgLnRoZW4obnVsbCwgcmVqZWN0KTsKICAgICAgfSBlbHNlIHsKICAgICAgICB2b2lkIG5vdGlmeUV2ZW50UHJvY2Vzc29ycyhwcm9jZXNzb3JzLCByZXN1bHQsIGhpbnQsIGluZGV4ICsgMSkKICAgICAgICAgIC50aGVuKHJlc29sdmUpCiAgICAgICAgICAudGhlbihudWxsLCByZWplY3QpOwogICAgICB9CiAgICB9CiAgfSk7Cn0KCi8qKgogKiBDcmVhdGVzIGEgbmV3IGBTZXNzaW9uYCBvYmplY3QgYnkgc2V0dGluZyBjZXJ0YWluIGRlZmF1bHQgcGFyYW1ldGVycy4gSWYgb3B0aW9uYWwgQHBhcmFtIGNvbnRleHQKICogaXMgcGFzc2VkLCB0aGUgcGFzc2VkIHByb3BlcnRpZXMgYXJlIGFwcGxpZWQgdG8gdGhlIHNlc3Npb24gb2JqZWN0LgogKgogKiBAcGFyYW0gY29udGV4dCAob3B0aW9uYWwpIGFkZGl0aW9uYWwgcHJvcGVydGllcyB0byBiZSBhcHBsaWVkIHRvIHRoZSByZXR1cm5lZCBzZXNzaW9uIG9iamVjdAogKgogKiBAcmV0dXJucyBhIG5ldyBgU2Vzc2lvbmAgb2JqZWN0CiAqLwpmdW5jdGlvbiBtYWtlU2Vzc2lvbihjb250ZXh0KSB7CiAgLy8gQm90aCB0aW1lc3RhbXAgYW5kIHN0YXJ0ZWQgYXJlIGluIHNlY29uZHMgc2luY2UgdGhlIFVOSVggZXBvY2guCiAgY29uc3Qgc3RhcnRpbmdUaW1lID0gdGltZXN0YW1wSW5TZWNvbmRzKCk7CgogIGNvbnN0IHNlc3Npb24gPSB7CiAgICBzaWQ6IHV1aWQ0KCksCiAgICBpbml0OiB0cnVlLAogICAgdGltZXN0YW1wOiBzdGFydGluZ1RpbWUsCiAgICBzdGFydGVkOiBzdGFydGluZ1RpbWUsCiAgICBkdXJhdGlvbjogMCwKICAgIHN0YXR1czogJ29rJywKICAgIGVycm9yczogMCwKICAgIGlnbm9yZUR1cmF0aW9uOiBmYWxzZSwKICAgIHRvSlNPTjogKCkgPT4gc2Vzc2lvblRvSlNPTihzZXNzaW9uKSwKICB9OwoKICBpZiAoY29udGV4dCkgewogICAgdXBkYXRlU2Vzc2lvbihzZXNzaW9uLCBjb250ZXh0KTsKICB9CgogIHJldHVybiBzZXNzaW9uOwp9CgovKioKICogVXBkYXRlcyBhIHNlc3Npb24gb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgcGFzc2VkIGluIHRoZSBjb250ZXh0LgogKgogKiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbiBtdXRhdGVzIHRoZSBwYXNzZWQgb2JqZWN0IGFuZCByZXR1cm5zIHZvaWQuCiAqIChIYWQgdG8gZG8gdGhpcyBpbnN0ZWFkIG9mIHJldHVybmluZyBhIG5ldyBhbmQgdXBkYXRlZCBzZXNzaW9uIGJlY2F1c2UgY2xvc2luZyBhbmQgc2VuZGluZyBhIHNlc3Npb24KICogbWFrZXMgYW4gdXBkYXRlIHRvIHRoZSBzZXNzaW9uIGFmdGVyIGl0IHdhcyBwYXNzZWQgdG8gdGhlIHNlbmRpbmcgbG9naWMuCiAqIEBzZWUgQmFzZUNsaWVudC5jYXB0dXJlU2Vzc2lvbiApCiAqCiAqIEBwYXJhbSBzZXNzaW9uIHRoZSBgU2Vzc2lvbmAgdG8gdXBkYXRlCiAqIEBwYXJhbSBjb250ZXh0IHRoZSBgU2Vzc2lvbkNvbnRleHRgIGhvbGRpbmcgdGhlIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgYmUgdXBkYXRlZCBpbiBAcGFyYW0gc2Vzc2lvbgogKi8KLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHkKZnVuY3Rpb24gdXBkYXRlU2Vzc2lvbihzZXNzaW9uLCBjb250ZXh0ID0ge30pIHsKICBpZiAoY29udGV4dC51c2VyKSB7CiAgICBpZiAoIXNlc3Npb24uaXBBZGRyZXNzICYmIGNvbnRleHQudXNlci5pcF9hZGRyZXNzKSB7CiAgICAgIHNlc3Npb24uaXBBZGRyZXNzID0gY29udGV4dC51c2VyLmlwX2FkZHJlc3M7CiAgICB9CgogICAgaWYgKCFzZXNzaW9uLmRpZCAmJiAhY29udGV4dC5kaWQpIHsKICAgICAgc2Vzc2lvbi5kaWQgPSBjb250ZXh0LnVzZXIuaWQgfHwgY29udGV4dC51c2VyLmVtYWlsIHx8IGNvbnRleHQudXNlci51c2VybmFtZTsKICAgIH0KICB9CgogIHNlc3Npb24udGltZXN0YW1wID0gY29udGV4dC50aW1lc3RhbXAgfHwgdGltZXN0YW1wSW5TZWNvbmRzKCk7CgogIGlmIChjb250ZXh0LmFibm9ybWFsX21lY2hhbmlzbSkgewogICAgc2Vzc2lvbi5hYm5vcm1hbF9tZWNoYW5pc20gPSBjb250ZXh0LmFibm9ybWFsX21lY2hhbmlzbTsKICB9CgogIGlmIChjb250ZXh0Lmlnbm9yZUR1cmF0aW9uKSB7CiAgICBzZXNzaW9uLmlnbm9yZUR1cmF0aW9uID0gY29udGV4dC5pZ25vcmVEdXJhdGlvbjsKICB9CiAgaWYgKGNvbnRleHQuc2lkKSB7CiAgICAvLyBHb29kIGVub3VnaCB1dWlkIHZhbGlkYXRpb24uIOKAlCBLYW1pbAogICAgc2Vzc2lvbi5zaWQgPSBjb250ZXh0LnNpZC5sZW5ndGggPT09IDMyID8gY29udGV4dC5zaWQgOiB1dWlkNCgpOwogIH0KICBpZiAoY29udGV4dC5pbml0ICE9PSB1bmRlZmluZWQpIHsKICAgIHNlc3Npb24uaW5pdCA9IGNvbnRleHQuaW5pdDsKICB9CiAgaWYgKCFzZXNzaW9uLmRpZCAmJiBjb250ZXh0LmRpZCkgewogICAgc2Vzc2lvbi5kaWQgPSBgJHtjb250ZXh0LmRpZH1gOwogIH0KICBpZiAodHlwZW9mIGNvbnRleHQuc3RhcnRlZCA9PT0gJ251bWJlcicpIHsKICAgIHNlc3Npb24uc3RhcnRlZCA9IGNvbnRleHQuc3RhcnRlZDsKICB9CiAgaWYgKHNlc3Npb24uaWdub3JlRHVyYXRpb24pIHsKICAgIHNlc3Npb24uZHVyYXRpb24gPSB1bmRlZmluZWQ7CiAgfSBlbHNlIGlmICh0eXBlb2YgY29udGV4dC5kdXJhdGlvbiA9PT0gJ251bWJlcicpIHsKICAgIHNlc3Npb24uZHVyYXRpb24gPSBjb250ZXh0LmR1cmF0aW9uOwogIH0gZWxzZSB7CiAgICBjb25zdCBkdXJhdGlvbiA9IHNlc3Npb24udGltZXN0YW1wIC0gc2Vzc2lvbi5zdGFydGVkOwogICAgc2Vzc2lvbi5kdXJhdGlvbiA9IGR1cmF0aW9uID49IDAgPyBkdXJhdGlvbiA6IDA7CiAgfQogIGlmIChjb250ZXh0LnJlbGVhc2UpIHsKICAgIHNlc3Npb24ucmVsZWFzZSA9IGNvbnRleHQucmVsZWFzZTsKICB9CiAgaWYgKGNvbnRleHQuZW52aXJvbm1lbnQpIHsKICAgIHNlc3Npb24uZW52aXJvbm1lbnQgPSBjb250ZXh0LmVudmlyb25tZW50OwogIH0KICBpZiAoIXNlc3Npb24uaXBBZGRyZXNzICYmIGNvbnRleHQuaXBBZGRyZXNzKSB7CiAgICBzZXNzaW9uLmlwQWRkcmVzcyA9IGNvbnRleHQuaXBBZGRyZXNzOwogIH0KICBpZiAoIXNlc3Npb24udXNlckFnZW50ICYmIGNvbnRleHQudXNlckFnZW50KSB7CiAgICBzZXNzaW9uLnVzZXJBZ2VudCA9IGNvbnRleHQudXNlckFnZW50OwogIH0KICBpZiAodHlwZW9mIGNvbnRleHQuZXJyb3JzID09PSAnbnVtYmVyJykgewogICAgc2Vzc2lvbi5lcnJvcnMgPSBjb250ZXh0LmVycm9yczsKICB9CiAgaWYgKGNvbnRleHQuc3RhdHVzKSB7CiAgICBzZXNzaW9uLnN0YXR1cyA9IGNvbnRleHQuc3RhdHVzOwogIH0KfQoKLyoqCiAqIENsb3NlcyBhIHNlc3Npb24gYnkgc2V0dGluZyBpdHMgc3RhdHVzIGFuZCB1cGRhdGluZyB0aGUgc2Vzc2lvbiBvYmplY3Qgd2l0aCBpdC4KICogSW50ZXJuYWxseSBjYWxscyBgdXBkYXRlU2Vzc2lvbmAgdG8gdXBkYXRlIHRoZSBwYXNzZWQgc2Vzc2lvbiBvYmplY3QuCiAqCiAqIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIG11dGF0ZXMgdGhlIHBhc3NlZCBzZXNzaW9uIChAc2VlIHVwZGF0ZVNlc3Npb24gZm9yIGV4cGxhbmF0aW9uKS4KICoKICogQHBhcmFtIHNlc3Npb24gdGhlIGBTZXNzaW9uYCBvYmplY3QgdG8gYmUgY2xvc2VkCiAqIEBwYXJhbSBzdGF0dXMgdGhlIGBTZXNzaW9uU3RhdHVzYCB3aXRoIHdoaWNoIHRoZSBzZXNzaW9uIHdhcyBjbG9zZWQuIElmIHlvdSBkb24ndCBwYXNzIGEgc3RhdHVzLAogKiAgICAgICAgICAgICAgIHRoaXMgZnVuY3Rpb24gd2lsbCBrZWVwIHRoZSBwcmV2aW91c2x5IHNldCBzdGF0dXMsIHVubGVzcyBpdCB3YXMgYCdvaydgIGluIHdoaWNoIGNhc2UKICogICAgICAgICAgICAgICBpdCBpcyBjaGFuZ2VkIHRvIGAnZXhpdGVkJ2AuCiAqLwpmdW5jdGlvbiBjbG9zZVNlc3Npb24oc2Vzc2lvbiwgc3RhdHVzKSB7CiAgbGV0IGNvbnRleHQgPSB7fTsKICBpZiAoc3RhdHVzKSB7CiAgICBjb250ZXh0ID0geyBzdGF0dXMgfTsKICB9IGVsc2UgaWYgKHNlc3Npb24uc3RhdHVzID09PSAnb2snKSB7CiAgICBjb250ZXh0ID0geyBzdGF0dXM6ICdleGl0ZWQnIH07CiAgfQoKICB1cGRhdGVTZXNzaW9uKHNlc3Npb24sIGNvbnRleHQpOwp9CgovKioKICogU2VyaWFsaXplcyBhIHBhc3NlZCBzZXNzaW9uIG9iamVjdCB0byBhIEpTT04gb2JqZWN0IHdpdGggYSBzbGlnaHRseSBkaWZmZXJlbnQgc3RydWN0dXJlLgogKiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBTZW50cnkgYmFja2VuZCByZXF1aXJlcyBhIHNsaWdodGx5IGRpZmZlcmVudCBzY2hlbWEgb2YgYSBzZXNzaW9uCiAqIHRoYW4gdGhlIG9uZSB0aGUgSlMgU0RLcyB1c2UgaW50ZXJuYWxseS4KICoKICogQHBhcmFtIHNlc3Npb24gdGhlIHNlc3Npb24gdG8gYmUgY29udmVydGVkCiAqCiAqIEByZXR1cm5zIGEgSlNPTiBvYmplY3Qgb2YgdGhlIHBhc3NlZCBzZXNzaW9uCiAqLwpmdW5jdGlvbiBzZXNzaW9uVG9KU09OKHNlc3Npb24pIHsKICByZXR1cm4gZHJvcFVuZGVmaW5lZEtleXMoewogICAgc2lkOiBgJHtzZXNzaW9uLnNpZH1gLAogICAgaW5pdDogc2Vzc2lvbi5pbml0LAogICAgLy8gTWFrZSBzdXJlIHRoYXQgc2VjIGlzIGNvbnZlcnRlZCB0byBtcyBmb3IgZGF0ZSBjb25zdHJ1Y3RvcgogICAgc3RhcnRlZDogbmV3IERhdGUoc2Vzc2lvbi5zdGFydGVkICogMTAwMCkudG9JU09TdHJpbmcoKSwKICAgIHRpbWVzdGFtcDogbmV3IERhdGUoc2Vzc2lvbi50aW1lc3RhbXAgKiAxMDAwKS50b0lTT1N0cmluZygpLAogICAgc3RhdHVzOiBzZXNzaW9uLnN0YXR1cywKICAgIGVycm9yczogc2Vzc2lvbi5lcnJvcnMsCiAgICBkaWQ6IHR5cGVvZiBzZXNzaW9uLmRpZCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHNlc3Npb24uZGlkID09PSAnc3RyaW5nJyA/IGAke3Nlc3Npb24uZGlkfWAgOiB1bmRlZmluZWQsCiAgICBkdXJhdGlvbjogc2Vzc2lvbi5kdXJhdGlvbiwKICAgIGFibm9ybWFsX21lY2hhbmlzbTogc2Vzc2lvbi5hYm5vcm1hbF9tZWNoYW5pc20sCiAgICBhdHRyczogewogICAgICByZWxlYXNlOiBzZXNzaW9uLnJlbGVhc2UsCiAgICAgIGVudmlyb25tZW50OiBzZXNzaW9uLmVudmlyb25tZW50LAogICAgICBpcF9hZGRyZXNzOiBzZXNzaW9uLmlwQWRkcmVzcywKICAgICAgdXNlcl9hZ2VudDogc2Vzc2lvbi51c2VyQWdlbnQsCiAgICB9LAogIH0pOwp9Cgpjb25zdCBUUkFDRV9GTEFHX1NBTVBMRUQgPSAweDE7CgovKioKICogQ29udmVydCBhIHNwYW4gdG8gYSB0cmFjZSBjb250ZXh0LCB3aGljaCBjYW4gYmUgc2VudCBhcyB0aGUgYHRyYWNlYCBjb250ZXh0IGluIGFuIGV2ZW50LgogKi8KZnVuY3Rpb24gc3BhblRvVHJhY2VDb250ZXh0KHNwYW4pIHsKICBjb25zdCB7IHNwYW5JZDogc3Bhbl9pZCwgdHJhY2VJZDogdHJhY2VfaWQgfSA9IHNwYW4uc3BhbkNvbnRleHQoKTsKICBjb25zdCB7IGRhdGEsIG9wLCBwYXJlbnRfc3Bhbl9pZCwgc3RhdHVzLCB0YWdzLCBvcmlnaW4gfSA9IHNwYW5Ub0pTT04oc3Bhbik7CgogIHJldHVybiBkcm9wVW5kZWZpbmVkS2V5cyh7CiAgICBkYXRhLAogICAgb3AsCiAgICBwYXJlbnRfc3Bhbl9pZCwKICAgIHNwYW5faWQsCiAgICBzdGF0dXMsCiAgICB0YWdzLAogICAgdHJhY2VfaWQsCiAgICBvcmlnaW4sCiAgfSk7Cn0KCi8qKgogKiBDb252ZXJ0IGEgc3BhbiB0byBhIEpTT04gcmVwcmVzZW50YXRpb24uCiAqIE5vdGUgdGhhdCBhbGwgZmllbGRzIHJldHVybmVkIGhlcmUgYXJlIG9wdGlvbmFsIGFuZCBuZWVkIHRvIGJlIGd1YXJkZWQgYWdhaW5zdC4KICoKICogTm90ZTogQmVjYXVzZSBvZiB0aGlzLCB3ZSBjdXJyZW50bHkgaGF2ZSBhIGNpcmN1bGFyIHR5cGUgZGVwZW5kZW5jeSAod2hpY2ggd2Ugb3B0ZWQgb3V0IG9mIGluIHBhY2thZ2UuanNvbikuCiAqIFRoaXMgaXMgbm90IGF2b2lkYWJsZSBhcyB3ZSBuZWVkIGBzcGFuVG9KU09OYCBpbiBgc3BhblV0aWxzLnRzYCwgd2hpY2ggaW4gdHVybiBpcyBuZWVkZWQgYnkgYHNwYW4udHNgIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4KICogQW5kIGBzcGFuVG9KU09OYCBuZWVkcyB0aGUgU3BhbiBjbGFzcyBmcm9tIGBzcGFuLnRzYCB0byBjaGVjayBoZXJlLgogKiBUT0RPIHY4OiBXaGVuIHdlIHJlbW92ZSB0aGUgZGVwcmVjYXRlZCBzdHVmZiBmcm9tIGBzcGFuLnRzYCwgd2UgY2FuIHJlbW92ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeSBhZ2Fpbi4KICovCmZ1bmN0aW9uIHNwYW5Ub0pTT04oc3BhbikgewogIGlmIChzcGFuSXNTcGFuQ2xhc3Moc3BhbikpIHsKICAgIHJldHVybiBzcGFuLmdldFNwYW5KU09OKCk7CiAgfQoKICAvLyBGYWxsYmFjazogV2UgYWxzbyBjaGVjayBmb3IgYC50b0pTT04oKWAgaGVyZS4uLgogIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogIGlmICh0eXBlb2Ygc3Bhbi50b0pTT04gPT09ICdmdW5jdGlvbicpIHsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgcmV0dXJuIHNwYW4udG9KU09OKCk7CiAgfQoKICByZXR1cm4ge307Cn0KCi8qKgogKiBTYWRseSwgZHVlIHRvIGNpcmN1bGFyIGRlcGVuZGVuY3kgY2hlY2tzIHdlIGNhbm5vdCBhY3R1YWxseSBpbXBvcnQgdGhlIFNwYW4gY2xhc3MgaGVyZSBhbmQgY2hlY2sgZm9yIGluc3RhbmNlb2YuCiAqIDooIFNvIGluc3RlYWQgd2UgYXBwcm94aW1hdGUgdGhpcyBieSBjaGVja2luZyBpZiBpdCBoYXMgdGhlIGBnZXRTcGFuSlNPTmAgbWV0aG9kLgogKi8KZnVuY3Rpb24gc3BhbklzU3BhbkNsYXNzKHNwYW4pIHsKICByZXR1cm4gdHlwZW9mIChzcGFuICkuZ2V0U3BhbkpTT04gPT09ICdmdW5jdGlvbic7Cn0KCi8qKgogKiBSZXR1cm5zIHRydWUgaWYgYSBzcGFuIGlzIHNhbXBsZWQuCiAqIEluIG1vc3QgY2FzZXMsIHlvdSBzaG91bGQganVzdCB1c2UgYHNwYW4uaXNSZWNvcmRpbmcoKWAgaW5zdGVhZC4KICogSG93ZXZlciwgdGhpcyBoYXMgYSBzbGlnaHRseSBkaWZmZXJlbnQgc2VtYW50aWMsIGFzIGl0IGFsc28gcmV0dXJucyBmYWxzZSBpZiB0aGUgc3BhbiBpcyBmaW5pc2hlZC4KICogU28gaW4gdGhlIGNhc2Ugd2hlcmUgdGhpcyBkaXN0aW5jdGlvbiBpcyBpbXBvcnRhbnQsIHVzZSB0aGlzIG1ldGhvZC4KICovCmZ1bmN0aW9uIHNwYW5Jc1NhbXBsZWQoc3BhbikgewogIC8vIFdlIGFsaWduIG91ciB0cmFjZSBmbGFncyB3aXRoIHRoZSBvbmVzIE9wZW5UZWxlbWV0cnkgdXNlCiAgLy8gU28gd2UgYWxzbyBjaGVjayBmb3Igc2FtcGxlZCB0aGUgc2FtZSB3YXkgdGhleSBkby4KICBjb25zdCB7IHRyYWNlRmxhZ3MgfSA9IHNwYW4uc3BhbkNvbnRleHQoKTsKICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYml0d2lzZQogIHJldHVybiBCb29sZWFuKHRyYWNlRmxhZ3MgJiBUUkFDRV9GTEFHX1NBTVBMRUQpOwp9CgovKioKICogR2V0IHRoZSBjdXJyZW50bHkgYWN0aXZlIGNsaWVudC4KICovCmZ1bmN0aW9uIGdldENsaWVudCgpIHsKICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICByZXR1cm4gZ2V0Q3VycmVudEh1YigpLmdldENsaWVudCgpOwp9CgovKioKICogR2V0IHRoZSBjdXJyZW50bHkgYWN0aXZlIHNjb3BlLgogKi8KZnVuY3Rpb24gZ2V0Q3VycmVudFNjb3BlKCkgewogIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogIHJldHVybiBnZXRDdXJyZW50SHViKCkuZ2V0U2NvcGUoKTsKfQoKLyoqCiAqIFJldHVybnMgdGhlIHJvb3Qgc3BhbiBvZiBhIGdpdmVuIHNwYW4uCiAqCiAqIEFzIGxvbmcgYXMgd2UgdXNlIGBUcmFuc2FjdGlvbmBzIGludGVybmFsbHksIHRoZSByZXR1cm5lZCByb290IHNwYW4KICogd2lsbCBiZSBhIGBUcmFuc2FjdGlvbmAgYnV0IGJlIGF3YXJlIHRoYXQgdGhpcyBtaWdodCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS4KICoKICogSWYgdGhlIGdpdmVuIHNwYW4gaGFzIG5vIHJvb3Qgc3BhbiBvciB0cmFuc2FjdGlvbiwgYHVuZGVmaW5lZGAgaXMgcmV0dXJuZWQuCiAqLwpmdW5jdGlvbiBnZXRSb290U3BhbihzcGFuKSB7CiAgLy8gVE9ETyAodjgpOiBSZW1vdmUgdGhpcyBjaGVjayBhbmQganVzdCByZXR1cm4gc3BhbgogIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogIHJldHVybiBzcGFuLnRyYW5zYWN0aW9uOwp9CgovKioKICogQ3JlYXRlcyBhIGR5bmFtaWMgc2FtcGxpbmcgY29udGV4dCBmcm9tIGEgY2xpZW50LgogKgogKiBEaXNwYXRjaGVzIHRoZSBgY3JlYXRlRHNjYCBsaWZlY3ljbGUgaG9vayBhcyBhIHNpZGUgZWZmZWN0LgogKi8KZnVuY3Rpb24gZ2V0RHluYW1pY1NhbXBsaW5nQ29udGV4dEZyb21DbGllbnQoCiAgdHJhY2VfaWQsCiAgY2xpZW50LAogIHNjb3BlLAopIHsKICBjb25zdCBvcHRpb25zID0gY2xpZW50LmdldE9wdGlvbnMoKTsKCiAgY29uc3QgeyBwdWJsaWNLZXk6IHB1YmxpY19rZXkgfSA9IGNsaWVudC5nZXREc24oKSB8fCB7fTsKICAvLyBUT0RPKHY4KTogUmVtb3ZlIHNlZ21lbnQgZnJvbSBVc2VyCiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgY29uc3QgeyBzZWdtZW50OiB1c2VyX3NlZ21lbnQgfSA9IChzY29wZSAmJiBzY29wZS5nZXRVc2VyKCkpIHx8IHt9OwoKICBjb25zdCBkc2MgPSBkcm9wVW5kZWZpbmVkS2V5cyh7CiAgICBlbnZpcm9ubWVudDogb3B0aW9ucy5lbnZpcm9ubWVudCB8fCBERUZBVUxUX0VOVklST05NRU5ULAogICAgcmVsZWFzZTogb3B0aW9ucy5yZWxlYXNlLAogICAgdXNlcl9zZWdtZW50LAogICAgcHVibGljX2tleSwKICAgIHRyYWNlX2lkLAogIH0pIDsKCiAgY2xpZW50LmVtaXQgJiYgY2xpZW50LmVtaXQoJ2NyZWF0ZURzYycsIGRzYyk7CgogIHJldHVybiBkc2M7Cn0KCi8qKgogKiBBIFNwYW4gd2l0aCBhIGZyb3plbiBkeW5hbWljIHNhbXBsaW5nIGNvbnRleHQuCiAqLwoKLyoqCiAqIENyZWF0ZXMgYSBkeW5hbWljIHNhbXBsaW5nIGNvbnRleHQgZnJvbSBhIHNwYW4gKGFuZCBjbGllbnQgYW5kIHNjb3BlKQogKgogKiBAcGFyYW0gc3BhbiB0aGUgc3BhbiBmcm9tIHdoaWNoIGEgZmV3IHZhbHVlcyBsaWtlIHRoZSByb290IHNwYW4gbmFtZSBhbmQgc2FtcGxlIHJhdGUgYXJlIGV4dHJhY3RlZC4KICoKICogQHJldHVybnMgYSBkeW5hbWljIHNhbXBsaW5nIGNvbnRleHQKICovCmZ1bmN0aW9uIGdldER5bmFtaWNTYW1wbGluZ0NvbnRleHRGcm9tU3BhbihzcGFuKSB7CiAgY29uc3QgY2xpZW50ID0gZ2V0Q2xpZW50KCk7CiAgaWYgKCFjbGllbnQpIHsKICAgIHJldHVybiB7fTsKICB9CgogIC8vIHBhc3NpbmcgZW1pdD1mYWxzZSBoZXJlIHRvIG9ubHkgZW1pdCBsYXRlciBvbmNlIHRoZSBEU0MgaXMgYWN0dWFsbHkgcG9wdWxhdGVkCiAgY29uc3QgZHNjID0gZ2V0RHluYW1pY1NhbXBsaW5nQ29udGV4dEZyb21DbGllbnQoc3BhblRvSlNPTihzcGFuKS50cmFjZV9pZCB8fCAnJywgY2xpZW50LCBnZXRDdXJyZW50U2NvcGUoKSk7CgogIC8vIFRPRE8gKHY4KTogUmVtb3ZlIHY3RnJvemVuRHNjIGFzIGEgVHJhbnNhY3Rpb24gd2lsbCBubyBsb25nZXIgaGF2ZSBfZnJvemVuRHluYW1pY1NhbXBsaW5nQ29udGV4dAogIGNvbnN0IHR4biA9IGdldFJvb3RTcGFuKHNwYW4pIDsKICBpZiAoIXR4bikgewogICAgcmV0dXJuIGRzYzsKICB9CgogIC8vIFRPRE8gKHY4KTogUmVtb3ZlIHY3RnJvemVuRHNjIGFzIGEgVHJhbnNhY3Rpb24gd2lsbCBubyBsb25nZXIgaGF2ZSBfZnJvemVuRHluYW1pY1NhbXBsaW5nQ29udGV4dAogIC8vIEZvciBub3cgd2UgbmVlZCB0byBhdm9pZCBicmVha2luZyB1c2VycyB3aG8gZGlyZWN0bHkgY3JlYXRlZCBhIHR4biB3aXRoIGEgRFNDLCB3aGVyZSB0aGlzIGZpZWxkIGlzIHN0aWxsIHNldC4KICAvLyBAc2VlIFRyYW5zYWN0aW9uIGNsYXNzIGNvbnN0cnVjdG9yCiAgY29uc3QgdjdGcm96ZW5Ec2MgPSB0eG4gJiYgdHhuLl9mcm96ZW5EeW5hbWljU2FtcGxpbmdDb250ZXh0OwogIGlmICh2N0Zyb3plbkRzYykgewogICAgcmV0dXJuIHY3RnJvemVuRHNjOwogIH0KCiAgLy8gVE9ETyAodjgpOiBSZXBsYWNlIHR4bi5tZXRhZGF0YSB3aXRoIHR4bi5hdHRyaWJ1dGVzW10KICAvLyBXZSBjYW4ndCBkbyB0aGlzIHlldCBiZWNhdXNlIGF0dHJpYnV0ZXMgYXJlbid0IGFsd2F5cyBzZXQgeWV0LgogIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogIGNvbnN0IHsgc2FtcGxlUmF0ZTogbWF5YmVTYW1wbGVSYXRlLCBzb3VyY2UgfSA9IHR4bi5tZXRhZGF0YTsKICBpZiAobWF5YmVTYW1wbGVSYXRlICE9IG51bGwpIHsKICAgIGRzYy5zYW1wbGVfcmF0ZSA9IGAke21heWJlU2FtcGxlUmF0ZX1gOwogIH0KCiAgLy8gV2UgZG9uJ3Qgd2FudCB0byBoYXZlIGEgdHJhbnNhY3Rpb24gbmFtZSBpbiB0aGUgRFNDIGlmIHRoZSBzb3VyY2UgaXMgInVybCIgYmVjYXVzZSBVUkxzIG1pZ2h0IGNvbnRhaW4gUElJCiAgY29uc3QganNvblNwYW4gPSBzcGFuVG9KU09OKHR4bik7CgogIC8vIGFmdGVyIEpTT04gY29udmVyc2lvbiwgdHhuLm5hbWUgYmVjb21lcyBqc29uU3Bhbi5kZXNjcmlwdGlvbgogIGlmIChzb3VyY2UgJiYgc291cmNlICE9PSAndXJsJykgewogICAgZHNjLnRyYW5zYWN0aW9uID0ganNvblNwYW4uZGVzY3JpcHRpb247CiAgfQoKICBkc2Muc2FtcGxlZCA9IFN0cmluZyhzcGFuSXNTYW1wbGVkKHR4bikpOwoKICBjbGllbnQuZW1pdCAmJiBjbGllbnQuZW1pdCgnY3JlYXRlRHNjJywgZHNjKTsKCiAgcmV0dXJuIGRzYzsKfQoKLyoqCiAqIEFwcGxpZXMgZGF0YSBmcm9tIHRoZSBzY29wZSB0byB0aGUgZXZlbnQgYW5kIHJ1bnMgYWxsIGV2ZW50IHByb2Nlc3NvcnMgb24gaXQuCiAqLwpmdW5jdGlvbiBhcHBseVNjb3BlRGF0YVRvRXZlbnQoZXZlbnQsIGRhdGEpIHsKICBjb25zdCB7IGZpbmdlcnByaW50LCBzcGFuLCBicmVhZGNydW1icywgc2RrUHJvY2Vzc2luZ01ldGFkYXRhIH0gPSBkYXRhOwoKICAvLyBBcHBseSBnZW5lcmFsIGRhdGEKICBhcHBseURhdGFUb0V2ZW50KGV2ZW50LCBkYXRhKTsKCiAgLy8gV2Ugd2FudCB0byBzZXQgdGhlIHRyYWNlIGNvbnRleHQgZm9yIG5vcm1hbCBldmVudHMgb25seSBpZiB0aGVyZSBpc24ndCBhbHJlYWR5CiAgLy8gYSB0cmFjZSBjb250ZXh0IG9uIHRoZSBldmVudC4gVGhlcmUgaXMgYSBwcm9kdWN0IGZlYXR1cmUgaW4gcGxhY2Ugd2hlcmUgd2UgbGluawogIC8vIGVycm9ycyB3aXRoIHRyYW5zYWN0aW9uIGFuZCBpdCByZWxpZXMgb24gdGhhdC4KICBpZiAoc3BhbikgewogICAgYXBwbHlTcGFuVG9FdmVudChldmVudCwgc3Bhbik7CiAgfQoKICBhcHBseUZpbmdlcnByaW50VG9FdmVudChldmVudCwgZmluZ2VycHJpbnQpOwogIGFwcGx5QnJlYWRjcnVtYnNUb0V2ZW50KGV2ZW50LCBicmVhZGNydW1icyk7CiAgYXBwbHlTZGtNZXRhZGF0YVRvRXZlbnQoZXZlbnQsIHNka1Byb2Nlc3NpbmdNZXRhZGF0YSk7Cn0KCmZ1bmN0aW9uIGFwcGx5RGF0YVRvRXZlbnQoZXZlbnQsIGRhdGEpIHsKICBjb25zdCB7CiAgICBleHRyYSwKICAgIHRhZ3MsCiAgICB1c2VyLAogICAgY29udGV4dHMsCiAgICBsZXZlbCwKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdHJhbnNhY3Rpb25OYW1lLAogIH0gPSBkYXRhOwoKICBjb25zdCBjbGVhbmVkRXh0cmEgPSBkcm9wVW5kZWZpbmVkS2V5cyhleHRyYSk7CiAgaWYgKGNsZWFuZWRFeHRyYSAmJiBPYmplY3Qua2V5cyhjbGVhbmVkRXh0cmEpLmxlbmd0aCkgewogICAgZXZlbnQuZXh0cmEgPSB7IC4uLmNsZWFuZWRFeHRyYSwgLi4uZXZlbnQuZXh0cmEgfTsKICB9CgogIGNvbnN0IGNsZWFuZWRUYWdzID0gZHJvcFVuZGVmaW5lZEtleXModGFncyk7CiAgaWYgKGNsZWFuZWRUYWdzICYmIE9iamVjdC5rZXlzKGNsZWFuZWRUYWdzKS5sZW5ndGgpIHsKICAgIGV2ZW50LnRhZ3MgPSB7IC4uLmNsZWFuZWRUYWdzLCAuLi5ldmVudC50YWdzIH07CiAgfQoKICBjb25zdCBjbGVhbmVkVXNlciA9IGRyb3BVbmRlZmluZWRLZXlzKHVzZXIpOwogIGlmIChjbGVhbmVkVXNlciAmJiBPYmplY3Qua2V5cyhjbGVhbmVkVXNlcikubGVuZ3RoKSB7CiAgICBldmVudC51c2VyID0geyAuLi5jbGVhbmVkVXNlciwgLi4uZXZlbnQudXNlciB9OwogIH0KCiAgY29uc3QgY2xlYW5lZENvbnRleHRzID0gZHJvcFVuZGVmaW5lZEtleXMoY29udGV4dHMpOwogIGlmIChjbGVhbmVkQ29udGV4dHMgJiYgT2JqZWN0LmtleXMoY2xlYW5lZENvbnRleHRzKS5sZW5ndGgpIHsKICAgIGV2ZW50LmNvbnRleHRzID0geyAuLi5jbGVhbmVkQ29udGV4dHMsIC4uLmV2ZW50LmNvbnRleHRzIH07CiAgfQoKICBpZiAobGV2ZWwpIHsKICAgIGV2ZW50LmxldmVsID0gbGV2ZWw7CiAgfQoKICBpZiAodHJhbnNhY3Rpb25OYW1lKSB7CiAgICBldmVudC50cmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uTmFtZTsKICB9Cn0KCmZ1bmN0aW9uIGFwcGx5QnJlYWRjcnVtYnNUb0V2ZW50KGV2ZW50LCBicmVhZGNydW1icykgewogIGNvbnN0IG1lcmdlZEJyZWFkY3J1bWJzID0gWy4uLihldmVudC5icmVhZGNydW1icyB8fCBbXSksIC4uLmJyZWFkY3J1bWJzXTsKICBldmVudC5icmVhZGNydW1icyA9IG1lcmdlZEJyZWFkY3J1bWJzLmxlbmd0aCA/IG1lcmdlZEJyZWFkY3J1bWJzIDogdW5kZWZpbmVkOwp9CgpmdW5jdGlvbiBhcHBseVNka01ldGFkYXRhVG9FdmVudChldmVudCwgc2RrUHJvY2Vzc2luZ01ldGFkYXRhKSB7CiAgZXZlbnQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhID0gewogICAgLi4uZXZlbnQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhLAogICAgLi4uc2RrUHJvY2Vzc2luZ01ldGFkYXRhLAogIH07Cn0KCmZ1bmN0aW9uIGFwcGx5U3BhblRvRXZlbnQoZXZlbnQsIHNwYW4pIHsKICBldmVudC5jb250ZXh0cyA9IHsgdHJhY2U6IHNwYW5Ub1RyYWNlQ29udGV4dChzcGFuKSwgLi4uZXZlbnQuY29udGV4dHMgfTsKICBjb25zdCByb290U3BhbiA9IGdldFJvb3RTcGFuKHNwYW4pOwogIGlmIChyb290U3BhbikgewogICAgZXZlbnQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhID0gewogICAgICBkeW5hbWljU2FtcGxpbmdDb250ZXh0OiBnZXREeW5hbWljU2FtcGxpbmdDb250ZXh0RnJvbVNwYW4oc3BhbiksCiAgICAgIC4uLmV2ZW50LnNka1Byb2Nlc3NpbmdNZXRhZGF0YSwKICAgIH07CiAgICBjb25zdCB0cmFuc2FjdGlvbk5hbWUgPSBzcGFuVG9KU09OKHJvb3RTcGFuKS5kZXNjcmlwdGlvbjsKICAgIGlmICh0cmFuc2FjdGlvbk5hbWUpIHsKICAgICAgZXZlbnQudGFncyA9IHsgdHJhbnNhY3Rpb246IHRyYW5zYWN0aW9uTmFtZSwgLi4uZXZlbnQudGFncyB9OwogICAgfQogIH0KfQoKLyoqCiAqIEFwcGxpZXMgZmluZ2VycHJpbnQgZnJvbSB0aGUgc2NvcGUgdG8gdGhlIGV2ZW50IGlmIHRoZXJlJ3Mgb25lLAogKiB1c2VzIG1lc3NhZ2UgaWYgdGhlcmUncyBvbmUgaW5zdGVhZCBvciBnZXQgcmlkIG9mIGVtcHR5IGZpbmdlcnByaW50CiAqLwpmdW5jdGlvbiBhcHBseUZpbmdlcnByaW50VG9FdmVudChldmVudCwgZmluZ2VycHJpbnQpIHsKICAvLyBNYWtlIHN1cmUgaXQncyBhbiBhcnJheSBmaXJzdCBhbmQgd2UgYWN0dWFsbHkgaGF2ZSBzb21ldGhpbmcgaW4gcGxhY2UKICBldmVudC5maW5nZXJwcmludCA9IGV2ZW50LmZpbmdlcnByaW50ID8gYXJyYXlpZnkoZXZlbnQuZmluZ2VycHJpbnQpIDogW107CgogIC8vIElmIHdlIGhhdmUgc29tZXRoaW5nIG9uIHRoZSBzY29wZSwgdGhlbiBtZXJnZSBpdCB3aXRoIGV2ZW50CiAgaWYgKGZpbmdlcnByaW50KSB7CiAgICBldmVudC5maW5nZXJwcmludCA9IGV2ZW50LmZpbmdlcnByaW50LmNvbmNhdChmaW5nZXJwcmludCk7CiAgfQoKICAvLyBJZiB3ZSBoYXZlIG5vIGRhdGEgYXQgYWxsLCByZW1vdmUgZW1wdHkgYXJyYXkgZGVmYXVsdAogIGlmIChldmVudC5maW5nZXJwcmludCAmJiAhZXZlbnQuZmluZ2VycHJpbnQubGVuZ3RoKSB7CiAgICBkZWxldGUgZXZlbnQuZmluZ2VycHJpbnQ7CiAgfQp9CgovKioKICogRGVmYXVsdCB2YWx1ZSBmb3IgbWF4aW11bSBudW1iZXIgb2YgYnJlYWRjcnVtYnMgYWRkZWQgdG8gYW4gZXZlbnQuCiAqLwpjb25zdCBERUZBVUxUX01BWF9CUkVBRENSVU1CUyA9IDEwMDsKCi8qKgogKiBIb2xkcyBhZGRpdGlvbmFsIGV2ZW50IGluZm9ybWF0aW9uLiB7QGxpbmsgU2NvcGUuYXBwbHlUb0V2ZW50fSB3aWxsIGJlCiAqIGNhbGxlZCBieSB0aGUgY2xpZW50IGJlZm9yZSBhbiBldmVudCB3aWxsIGJlIHNlbnQuCiAqLwpjbGFzcyBTY29wZSAgewogIC8qKiBGbGFnIGlmIG5vdGlmeWluZyBpcyBoYXBwZW5pbmcuICovCgogIC8qKiBDYWxsYmFjayBmb3IgY2xpZW50IHRvIHJlY2VpdmUgc2NvcGUgY2hhbmdlcy4gKi8KCiAgLyoqIENhbGxiYWNrIGxpc3QgdGhhdCB3aWxsIGJlIGNhbGxlZCBhZnRlciB7QGxpbmsgYXBwbHlUb0V2ZW50fS4gKi8KCiAgLyoqIEFycmF5IG9mIGJyZWFkY3J1bWJzLiAqLwoKICAvKiogVXNlciAqLwoKICAvKiogVGFncyAqLwoKICAvKiogRXh0cmEgKi8KCiAgLyoqIENvbnRleHRzICovCgogIC8qKiBBdHRhY2htZW50cyAqLwoKICAvKiogUHJvcGFnYXRpb24gQ29udGV4dCBmb3IgZGlzdHJpYnV0ZWQgdHJhY2luZyAqLwoKICAvKioKICAgKiBBIHBsYWNlIHRvIHN0YXNoIGRhdGEgd2hpY2ggaXMgbmVlZGVkIGF0IHNvbWUgcG9pbnQgaW4gdGhlIFNESydzIGV2ZW50IHByb2Nlc3NpbmcgcGlwZWxpbmUgYnV0IHdoaWNoIHNob3VsZG4ndCBnZXQKICAgKiBzZW50IHRvIFNlbnRyeQogICAqLwoKICAvKiogRmluZ2VycHJpbnQgKi8KCiAgLyoqIFNldmVyaXR5ICovCiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCgogIC8qKgogICAqIFRyYW5zYWN0aW9uIE5hbWUKICAgKi8KCiAgLyoqIFNwYW4gKi8KCiAgLyoqIFNlc3Npb24gKi8KCiAgLyoqIFJlcXVlc3QgTW9kZSBTZXNzaW9uIFN0YXR1cyAqLwoKICAvKiogVGhlIGNsaWVudCBvbiB0aGlzIHNjb3BlICovCgogIC8vIE5PVEU6IEFueSBmaWVsZCB3aGljaCBnZXRzIGFkZGVkIGhlcmUgc2hvdWxkIGdldCBhZGRlZCBub3Qgb25seSB0byB0aGUgY29uc3RydWN0b3IgYnV0IGFsc28gdG8gdGhlIGBjbG9uZWAgbWV0aG9kLgoKICAgY29uc3RydWN0b3IoKSB7CiAgICB0aGlzLl9ub3RpZnlpbmdMaXN0ZW5lcnMgPSBmYWxzZTsKICAgIHRoaXMuX3Njb3BlTGlzdGVuZXJzID0gW107CiAgICB0aGlzLl9ldmVudFByb2Nlc3NvcnMgPSBbXTsKICAgIHRoaXMuX2JyZWFkY3J1bWJzID0gW107CiAgICB0aGlzLl9hdHRhY2htZW50cyA9IFtdOwogICAgdGhpcy5fdXNlciA9IHt9OwogICAgdGhpcy5fdGFncyA9IHt9OwogICAgdGhpcy5fZXh0cmEgPSB7fTsKICAgIHRoaXMuX2NvbnRleHRzID0ge307CiAgICB0aGlzLl9zZGtQcm9jZXNzaW5nTWV0YWRhdGEgPSB7fTsKICAgIHRoaXMuX3Byb3BhZ2F0aW9uQ29udGV4dCA9IGdlbmVyYXRlUHJvcGFnYXRpb25Db250ZXh0KCk7CiAgfQoKICAvKioKICAgKiBJbmhlcml0IHZhbHVlcyBmcm9tIHRoZSBwYXJlbnQgc2NvcGUuCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBzY29wZS5jbG9uZSgpYCBhbmQgYG5ldyBTY29wZSgpYCBpbnN0ZWFkLgogICAqLwogICBzdGF0aWMgY2xvbmUoc2NvcGUpIHsKICAgIHJldHVybiBzY29wZSA/IHNjb3BlLmNsb25lKCkgOiBuZXcgU2NvcGUoKTsKICB9CgogIC8qKgogICAqIENsb25lIHRoaXMgc2NvcGUgaW5zdGFuY2UuCiAgICovCiAgIGNsb25lKCkgewogICAgY29uc3QgbmV3U2NvcGUgPSBuZXcgU2NvcGUoKTsKICAgIG5ld1Njb3BlLl9icmVhZGNydW1icyA9IFsuLi50aGlzLl9icmVhZGNydW1ic107CiAgICBuZXdTY29wZS5fdGFncyA9IHsgLi4udGhpcy5fdGFncyB9OwogICAgbmV3U2NvcGUuX2V4dHJhID0geyAuLi50aGlzLl9leHRyYSB9OwogICAgbmV3U2NvcGUuX2NvbnRleHRzID0geyAuLi50aGlzLl9jb250ZXh0cyB9OwogICAgbmV3U2NvcGUuX3VzZXIgPSB0aGlzLl91c2VyOwogICAgbmV3U2NvcGUuX2xldmVsID0gdGhpcy5fbGV2ZWw7CiAgICBuZXdTY29wZS5fc3BhbiA9IHRoaXMuX3NwYW47CiAgICBuZXdTY29wZS5fc2Vzc2lvbiA9IHRoaXMuX3Nlc3Npb247CiAgICBuZXdTY29wZS5fdHJhbnNhY3Rpb25OYW1lID0gdGhpcy5fdHJhbnNhY3Rpb25OYW1lOwogICAgbmV3U2NvcGUuX2ZpbmdlcnByaW50ID0gdGhpcy5fZmluZ2VycHJpbnQ7CiAgICBuZXdTY29wZS5fZXZlbnRQcm9jZXNzb3JzID0gWy4uLnRoaXMuX2V2ZW50UHJvY2Vzc29yc107CiAgICBuZXdTY29wZS5fcmVxdWVzdFNlc3Npb24gPSB0aGlzLl9yZXF1ZXN0U2Vzc2lvbjsKICAgIG5ld1Njb3BlLl9hdHRhY2htZW50cyA9IFsuLi50aGlzLl9hdHRhY2htZW50c107CiAgICBuZXdTY29wZS5fc2RrUHJvY2Vzc2luZ01ldGFkYXRhID0geyAuLi50aGlzLl9zZGtQcm9jZXNzaW5nTWV0YWRhdGEgfTsKICAgIG5ld1Njb3BlLl9wcm9wYWdhdGlvbkNvbnRleHQgPSB7IC4uLnRoaXMuX3Byb3BhZ2F0aW9uQ29udGV4dCB9OwogICAgbmV3U2NvcGUuX2NsaWVudCA9IHRoaXMuX2NsaWVudDsKCiAgICByZXR1cm4gbmV3U2NvcGU7CiAgfQoKICAvKiogVXBkYXRlIHRoZSBjbGllbnQgb24gdGhlIHNjb3BlLiAqLwogICBzZXRDbGllbnQoY2xpZW50KSB7CiAgICB0aGlzLl9jbGllbnQgPSBjbGllbnQ7CiAgfQoKICAvKioKICAgKiBHZXQgdGhlIGNsaWVudCBhc3NpZ25lZCB0byB0aGlzIHNjb3BlLgogICAqCiAgICogSXQgaXMgZ2VuZXJhbGx5IHJlY29tbWVuZGVkIHRvIHVzZSB0aGUgZ2xvYmFsIGZ1bmN0aW9uIGBTZW50cnkuZ2V0Q2xpZW50KClgIGluc3RlYWQsIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSBhcmUgZG9pbmcuCiAgICovCiAgIGdldENsaWVudCgpIHsKICAgIHJldHVybiB0aGlzLl9jbGllbnQ7CiAgfQoKICAvKioKICAgKiBBZGQgaW50ZXJuYWwgb24gY2hhbmdlIGxpc3RlbmVyLiBVc2VkIGZvciBzdWIgU0RLcyB0aGF0IG5lZWQgdG8gc3RvcmUgdGhlIHNjb3BlLgogICAqIEBoaWRkZW4KICAgKi8KICAgYWRkU2NvcGVMaXN0ZW5lcihjYWxsYmFjaykgewogICAgdGhpcy5fc2NvcGVMaXN0ZW5lcnMucHVzaChjYWxsYmFjayk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBhZGRFdmVudFByb2Nlc3NvcihjYWxsYmFjaykgewogICAgdGhpcy5fZXZlbnRQcm9jZXNzb3JzLnB1c2goY2FsbGJhY2spOwogICAgcmV0dXJuIHRoaXM7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBzZXRVc2VyKHVzZXIpIHsKICAgIC8vIElmIG51bGwgaXMgcGFzc2VkIHdlIHdhbnQgdG8gdW5zZXQgZXZlcnl0aGluZywgYnV0IHN0aWxsIGRlZmluZSBrZXlzLAogICAgLy8gc28gdGhhdCBsYXRlciBkb3duIGluIHRoZSBwaXBlbGluZSBhbnkgZXhpc3RpbmcgdmFsdWVzIGFyZSBjbGVhcmVkLgogICAgdGhpcy5fdXNlciA9IHVzZXIgfHwgewogICAgICBlbWFpbDogdW5kZWZpbmVkLAogICAgICBpZDogdW5kZWZpbmVkLAogICAgICBpcF9hZGRyZXNzOiB1bmRlZmluZWQsCiAgICAgIHNlZ21lbnQ6IHVuZGVmaW5lZCwKICAgICAgdXNlcm5hbWU6IHVuZGVmaW5lZCwKICAgIH07CgogICAgaWYgKHRoaXMuX3Nlc3Npb24pIHsKICAgICAgdXBkYXRlU2Vzc2lvbih0aGlzLl9zZXNzaW9uLCB7IHVzZXIgfSk7CiAgICB9CgogICAgdGhpcy5fbm90aWZ5U2NvcGVMaXN0ZW5lcnMoKTsKICAgIHJldHVybiB0aGlzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgZ2V0VXNlcigpIHsKICAgIHJldHVybiB0aGlzLl91c2VyOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgZ2V0UmVxdWVzdFNlc3Npb24oKSB7CiAgICByZXR1cm4gdGhpcy5fcmVxdWVzdFNlc3Npb247CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBzZXRSZXF1ZXN0U2Vzc2lvbihyZXF1ZXN0U2Vzc2lvbikgewogICAgdGhpcy5fcmVxdWVzdFNlc3Npb24gPSByZXF1ZXN0U2Vzc2lvbjsKICAgIHJldHVybiB0aGlzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgc2V0VGFncyh0YWdzKSB7CiAgICB0aGlzLl90YWdzID0gewogICAgICAuLi50aGlzLl90YWdzLAogICAgICAuLi50YWdzLAogICAgfTsKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIHNldFRhZyhrZXksIHZhbHVlKSB7CiAgICB0aGlzLl90YWdzID0geyAuLi50aGlzLl90YWdzLCBba2V5XTogdmFsdWUgfTsKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIHNldEV4dHJhcyhleHRyYXMpIHsKICAgIHRoaXMuX2V4dHJhID0gewogICAgICAuLi50aGlzLl9leHRyYSwKICAgICAgLi4uZXh0cmFzLAogICAgfTsKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIHNldEV4dHJhKGtleSwgZXh0cmEpIHsKICAgIHRoaXMuX2V4dHJhID0geyAuLi50aGlzLl9leHRyYSwgW2tleV06IGV4dHJhIH07CiAgICB0aGlzLl9ub3RpZnlTY29wZUxpc3RlbmVycygpOwogICAgcmV0dXJuIHRoaXM7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBzZXRGaW5nZXJwcmludChmaW5nZXJwcmludCkgewogICAgdGhpcy5fZmluZ2VycHJpbnQgPSBmaW5nZXJwcmludDsKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIHNldExldmVsKAogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICBsZXZlbCwKICApIHsKICAgIHRoaXMuX2xldmVsID0gbGV2ZWw7CiAgICB0aGlzLl9ub3RpZnlTY29wZUxpc3RlbmVycygpOwogICAgcmV0dXJuIHRoaXM7CiAgfQoKICAvKioKICAgKiBTZXRzIHRoZSB0cmFuc2FjdGlvbiBuYW1lIG9uIHRoZSBzY29wZSBmb3IgZnV0dXJlIGV2ZW50cy4KICAgKi8KICAgc2V0VHJhbnNhY3Rpb25OYW1lKG5hbWUpIHsKICAgIHRoaXMuX3RyYW5zYWN0aW9uTmFtZSA9IG5hbWU7CiAgICB0aGlzLl9ub3RpZnlTY29wZUxpc3RlbmVycygpOwogICAgcmV0dXJuIHRoaXM7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBzZXRDb250ZXh0KGtleSwgY29udGV4dCkgewogICAgaWYgKGNvbnRleHQgPT09IG51bGwpIHsKICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1keW5hbWljLWRlbGV0ZQogICAgICBkZWxldGUgdGhpcy5fY29udGV4dHNba2V5XTsKICAgIH0gZWxzZSB7CiAgICAgIHRoaXMuX2NvbnRleHRzW2tleV0gPSBjb250ZXh0OwogICAgfQoKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIFNldHMgdGhlIFNwYW4gb24gdGhlIHNjb3BlLgogICAqIEBwYXJhbSBzcGFuIFNwYW4KICAgKiBAZGVwcmVjYXRlZCBJbnN0ZWFkIG9mIHNldHRpbmcgYSBzcGFuIG9uIGEgc2NvcGUsIHVzZSBgc3RhcnRTcGFuKClgL2BzdGFydFNwYW5NYW51YWwoKWAgaW5zdGVhZC4KICAgKi8KICAgc2V0U3BhbihzcGFuKSB7CiAgICB0aGlzLl9zcGFuID0gc3BhbjsKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIFJldHVybnMgdGhlIGBTcGFuYCBpZiB0aGVyZSBpcyBvbmUuCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRBY3RpdmVTcGFuKClgIGluc3RlYWQuCiAgICovCiAgIGdldFNwYW4oKSB7CiAgICByZXR1cm4gdGhpcy5fc3BhbjsKICB9CgogIC8qKgogICAqIFJldHVybnMgdGhlIGBUcmFuc2FjdGlvbmAgYXR0YWNoZWQgdG8gdGhlIHNjb3BlIChpZiB0aGVyZSBpcyBvbmUpLgogICAqIEBkZXByZWNhdGVkIFlvdSBzaG91bGQgbm90IHJlbHkgb24gdGhlIHRyYW5zYWN0aW9uLCBidXQganVzdCB1c2UgYHN0YXJ0U3BhbigpYCBBUElzIGluc3RlYWQuCiAgICovCiAgIGdldFRyYW5zYWN0aW9uKCkgewogICAgLy8gT2Z0ZW4sIHRoaXMgc3BhbiAoaWYgaXQgZXhpc3RzIGF0IGFsbCkgd2lsbCBiZSBhIHRyYW5zYWN0aW9uLCBidXQgaXQncyBub3QgZ3VhcmFudGVlZCB0byBiZS4gUmVnYXJkbGVzcywgaXQgd2lsbAogICAgLy8gaGF2ZSBhIHBvaW50ZXIgdG8gdGhlIGN1cnJlbnRseS1hY3RpdmUgdHJhbnNhY3Rpb24uCiAgICBjb25zdCBzcGFuID0gdGhpcy5fc3BhbjsKICAgIC8vIENhbm5vdCByZXBsYWNlIHdpdGggZ2V0Um9vdFNwYW4gYmVjYXVzZSBnZXRSb290U3BhbiByZXR1cm5zIGEgc3Bhbiwgbm90IGEgdHJhbnNhY3Rpb24KICAgIC8vIEFsc28sIHRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZCBhbnl3YXkuCiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIHJldHVybiBzcGFuICYmIHNwYW4udHJhbnNhY3Rpb247CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBzZXRTZXNzaW9uKHNlc3Npb24pIHsKICAgIGlmICghc2Vzc2lvbikgewogICAgICBkZWxldGUgdGhpcy5fc2Vzc2lvbjsKICAgIH0gZWxzZSB7CiAgICAgIHRoaXMuX3Nlc3Npb24gPSBzZXNzaW9uOwogICAgfQogICAgdGhpcy5fbm90aWZ5U2NvcGVMaXN0ZW5lcnMoKTsKICAgIHJldHVybiB0aGlzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgZ2V0U2Vzc2lvbigpIHsKICAgIHJldHVybiB0aGlzLl9zZXNzaW9uOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgdXBkYXRlKGNhcHR1cmVDb250ZXh0KSB7CiAgICBpZiAoIWNhcHR1cmVDb250ZXh0KSB7CiAgICAgIHJldHVybiB0aGlzOwogICAgfQoKICAgIGNvbnN0IHNjb3BlVG9NZXJnZSA9IHR5cGVvZiBjYXB0dXJlQ29udGV4dCA9PT0gJ2Z1bmN0aW9uJyA/IGNhcHR1cmVDb250ZXh0KHRoaXMpIDogY2FwdHVyZUNvbnRleHQ7CgogICAgaWYgKHNjb3BlVG9NZXJnZSBpbnN0YW5jZW9mIFNjb3BlKSB7CiAgICAgIGNvbnN0IHNjb3BlRGF0YSA9IHNjb3BlVG9NZXJnZS5nZXRTY29wZURhdGEoKTsKCiAgICAgIHRoaXMuX3RhZ3MgPSB7IC4uLnRoaXMuX3RhZ3MsIC4uLnNjb3BlRGF0YS50YWdzIH07CiAgICAgIHRoaXMuX2V4dHJhID0geyAuLi50aGlzLl9leHRyYSwgLi4uc2NvcGVEYXRhLmV4dHJhIH07CiAgICAgIHRoaXMuX2NvbnRleHRzID0geyAuLi50aGlzLl9jb250ZXh0cywgLi4uc2NvcGVEYXRhLmNvbnRleHRzIH07CiAgICAgIGlmIChzY29wZURhdGEudXNlciAmJiBPYmplY3Qua2V5cyhzY29wZURhdGEudXNlcikubGVuZ3RoKSB7CiAgICAgICAgdGhpcy5fdXNlciA9IHNjb3BlRGF0YS51c2VyOwogICAgICB9CiAgICAgIGlmIChzY29wZURhdGEubGV2ZWwpIHsKICAgICAgICB0aGlzLl9sZXZlbCA9IHNjb3BlRGF0YS5sZXZlbDsKICAgICAgfQogICAgICBpZiAoc2NvcGVEYXRhLmZpbmdlcnByaW50Lmxlbmd0aCkgewogICAgICAgIHRoaXMuX2ZpbmdlcnByaW50ID0gc2NvcGVEYXRhLmZpbmdlcnByaW50OwogICAgICB9CiAgICAgIGlmIChzY29wZVRvTWVyZ2UuZ2V0UmVxdWVzdFNlc3Npb24oKSkgewogICAgICAgIHRoaXMuX3JlcXVlc3RTZXNzaW9uID0gc2NvcGVUb01lcmdlLmdldFJlcXVlc3RTZXNzaW9uKCk7CiAgICAgIH0KICAgICAgaWYgKHNjb3BlRGF0YS5wcm9wYWdhdGlvbkNvbnRleHQpIHsKICAgICAgICB0aGlzLl9wcm9wYWdhdGlvbkNvbnRleHQgPSBzY29wZURhdGEucHJvcGFnYXRpb25Db250ZXh0OwogICAgICB9CiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc2NvcGVUb01lcmdlKSkgewogICAgICBjb25zdCBzY29wZUNvbnRleHQgPSBjYXB0dXJlQ29udGV4dCA7CiAgICAgIHRoaXMuX3RhZ3MgPSB7IC4uLnRoaXMuX3RhZ3MsIC4uLnNjb3BlQ29udGV4dC50YWdzIH07CiAgICAgIHRoaXMuX2V4dHJhID0geyAuLi50aGlzLl9leHRyYSwgLi4uc2NvcGVDb250ZXh0LmV4dHJhIH07CiAgICAgIHRoaXMuX2NvbnRleHRzID0geyAuLi50aGlzLl9jb250ZXh0cywgLi4uc2NvcGVDb250ZXh0LmNvbnRleHRzIH07CiAgICAgIGlmIChzY29wZUNvbnRleHQudXNlcikgewogICAgICAgIHRoaXMuX3VzZXIgPSBzY29wZUNvbnRleHQudXNlcjsKICAgICAgfQogICAgICBpZiAoc2NvcGVDb250ZXh0LmxldmVsKSB7CiAgICAgICAgdGhpcy5fbGV2ZWwgPSBzY29wZUNvbnRleHQubGV2ZWw7CiAgICAgIH0KICAgICAgaWYgKHNjb3BlQ29udGV4dC5maW5nZXJwcmludCkgewogICAgICAgIHRoaXMuX2ZpbmdlcnByaW50ID0gc2NvcGVDb250ZXh0LmZpbmdlcnByaW50OwogICAgICB9CiAgICAgIGlmIChzY29wZUNvbnRleHQucmVxdWVzdFNlc3Npb24pIHsKICAgICAgICB0aGlzLl9yZXF1ZXN0U2Vzc2lvbiA9IHNjb3BlQ29udGV4dC5yZXF1ZXN0U2Vzc2lvbjsKICAgICAgfQogICAgICBpZiAoc2NvcGVDb250ZXh0LnByb3BhZ2F0aW9uQ29udGV4dCkgewogICAgICAgIHRoaXMuX3Byb3BhZ2F0aW9uQ29udGV4dCA9IHNjb3BlQ29udGV4dC5wcm9wYWdhdGlvbkNvbnRleHQ7CiAgICAgIH0KICAgIH0KCiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIGNsZWFyKCkgewogICAgdGhpcy5fYnJlYWRjcnVtYnMgPSBbXTsKICAgIHRoaXMuX3RhZ3MgPSB7fTsKICAgIHRoaXMuX2V4dHJhID0ge307CiAgICB0aGlzLl91c2VyID0ge307CiAgICB0aGlzLl9jb250ZXh0cyA9IHt9OwogICAgdGhpcy5fbGV2ZWwgPSB1bmRlZmluZWQ7CiAgICB0aGlzLl90cmFuc2FjdGlvbk5hbWUgPSB1bmRlZmluZWQ7CiAgICB0aGlzLl9maW5nZXJwcmludCA9IHVuZGVmaW5lZDsKICAgIHRoaXMuX3JlcXVlc3RTZXNzaW9uID0gdW5kZWZpbmVkOwogICAgdGhpcy5fc3BhbiA9IHVuZGVmaW5lZDsKICAgIHRoaXMuX3Nlc3Npb24gPSB1bmRlZmluZWQ7CiAgICB0aGlzLl9ub3RpZnlTY29wZUxpc3RlbmVycygpOwogICAgdGhpcy5fYXR0YWNobWVudHMgPSBbXTsKICAgIHRoaXMuX3Byb3BhZ2F0aW9uQ29udGV4dCA9IGdlbmVyYXRlUHJvcGFnYXRpb25Db250ZXh0KCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIGFkZEJyZWFkY3J1bWIoYnJlYWRjcnVtYiwgbWF4QnJlYWRjcnVtYnMpIHsKICAgIGNvbnN0IG1heENydW1icyA9IHR5cGVvZiBtYXhCcmVhZGNydW1icyA9PT0gJ251bWJlcicgPyBtYXhCcmVhZGNydW1icyA6IERFRkFVTFRfTUFYX0JSRUFEQ1JVTUJTOwoKICAgIC8vIE5vIGRhdGEgaGFzIGJlZW4gY2hhbmdlZCwgc28gZG9uJ3Qgbm90aWZ5IHNjb3BlIGxpc3RlbmVycwogICAgaWYgKG1heENydW1icyA8PSAwKSB7CiAgICAgIHJldHVybiB0aGlzOwogICAgfQoKICAgIGNvbnN0IG1lcmdlZEJyZWFkY3J1bWIgPSB7CiAgICAgIHRpbWVzdGFtcDogZGF0ZVRpbWVzdGFtcEluU2Vjb25kcygpLAogICAgICAuLi5icmVhZGNydW1iLAogICAgfTsKCiAgICBjb25zdCBicmVhZGNydW1icyA9IHRoaXMuX2JyZWFkY3J1bWJzOwogICAgYnJlYWRjcnVtYnMucHVzaChtZXJnZWRCcmVhZGNydW1iKTsKICAgIHRoaXMuX2JyZWFkY3J1bWJzID0gYnJlYWRjcnVtYnMubGVuZ3RoID4gbWF4Q3J1bWJzID8gYnJlYWRjcnVtYnMuc2xpY2UoLW1heENydW1icykgOiBicmVhZGNydW1iczsKCiAgICB0aGlzLl9ub3RpZnlTY29wZUxpc3RlbmVycygpOwoKICAgIHJldHVybiB0aGlzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgZ2V0TGFzdEJyZWFkY3J1bWIoKSB7CiAgICByZXR1cm4gdGhpcy5fYnJlYWRjcnVtYnNbdGhpcy5fYnJlYWRjcnVtYnMubGVuZ3RoIC0gMV07CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBjbGVhckJyZWFkY3J1bWJzKCkgewogICAgdGhpcy5fYnJlYWRjcnVtYnMgPSBbXTsKICAgIHRoaXMuX25vdGlmeVNjb3BlTGlzdGVuZXJzKCk7CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgIGFkZEF0dGFjaG1lbnQoYXR0YWNobWVudCkgewogICAgdGhpcy5fYXR0YWNobWVudHMucHVzaChhdHRhY2htZW50KTsKICAgIHJldHVybiB0aGlzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKiBAZGVwcmVjYXRlZCBVc2UgYGdldFNjb3BlRGF0YSgpYCBpbnN0ZWFkLgogICAqLwogICBnZXRBdHRhY2htZW50cygpIHsKICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldFNjb3BlRGF0YSgpOwoKICAgIHJldHVybiBkYXRhLmF0dGFjaG1lbnRzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgY2xlYXJBdHRhY2htZW50cygpIHsKICAgIHRoaXMuX2F0dGFjaG1lbnRzID0gW107CiAgICByZXR1cm4gdGhpczsKICB9CgogIC8qKiBAaW5oZXJpdERvYyAqLwogICBnZXRTY29wZURhdGEoKSB7CiAgICBjb25zdCB7CiAgICAgIF9icmVhZGNydW1icywKICAgICAgX2F0dGFjaG1lbnRzLAogICAgICBfY29udGV4dHMsCiAgICAgIF90YWdzLAogICAgICBfZXh0cmEsCiAgICAgIF91c2VyLAogICAgICBfbGV2ZWwsCiAgICAgIF9maW5nZXJwcmludCwKICAgICAgX2V2ZW50UHJvY2Vzc29ycywKICAgICAgX3Byb3BhZ2F0aW9uQ29udGV4dCwKICAgICAgX3Nka1Byb2Nlc3NpbmdNZXRhZGF0YSwKICAgICAgX3RyYW5zYWN0aW9uTmFtZSwKICAgICAgX3NwYW4sCiAgICB9ID0gdGhpczsKCiAgICByZXR1cm4gewogICAgICBicmVhZGNydW1iczogX2JyZWFkY3J1bWJzLAogICAgICBhdHRhY2htZW50czogX2F0dGFjaG1lbnRzLAogICAgICBjb250ZXh0czogX2NvbnRleHRzLAogICAgICB0YWdzOiBfdGFncywKICAgICAgZXh0cmE6IF9leHRyYSwKICAgICAgdXNlcjogX3VzZXIsCiAgICAgIGxldmVsOiBfbGV2ZWwsCiAgICAgIGZpbmdlcnByaW50OiBfZmluZ2VycHJpbnQgfHwgW10sCiAgICAgIGV2ZW50UHJvY2Vzc29yczogX2V2ZW50UHJvY2Vzc29ycywKICAgICAgcHJvcGFnYXRpb25Db250ZXh0OiBfcHJvcGFnYXRpb25Db250ZXh0LAogICAgICBzZGtQcm9jZXNzaW5nTWV0YWRhdGE6IF9zZGtQcm9jZXNzaW5nTWV0YWRhdGEsCiAgICAgIHRyYW5zYWN0aW9uTmFtZTogX3RyYW5zYWN0aW9uTmFtZSwKICAgICAgc3BhbjogX3NwYW4sCiAgICB9OwogIH0KCiAgLyoqCiAgICogQXBwbGllcyBkYXRhIGZyb20gdGhlIHNjb3BlIHRvIHRoZSBldmVudCBhbmQgcnVucyBhbGwgZXZlbnQgcHJvY2Vzc29ycyBvbiBpdC4KICAgKgogICAqIEBwYXJhbSBldmVudCBFdmVudAogICAqIEBwYXJhbSBoaW50IE9iamVjdCBjb250YWluaW5nIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG9yaWdpbmFsIGV4Y2VwdGlvbiwgZm9yIHVzZSBieSB0aGUgZXZlbnQgcHJvY2Vzc29ycy4KICAgKiBAaGlkZGVuCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBhcHBseVNjb3BlRGF0YVRvRXZlbnQoKWAgZGlyZWN0bHkKICAgKi8KICAgYXBwbHlUb0V2ZW50KAogICAgZXZlbnQsCiAgICBoaW50ID0ge30sCiAgICBhZGRpdGlvbmFsRXZlbnRQcm9jZXNzb3JzID0gW10sCiAgKSB7CiAgICBhcHBseVNjb3BlRGF0YVRvRXZlbnQoZXZlbnQsIHRoaXMuZ2V0U2NvcGVEYXRhKCkpOwoKICAgIC8vIFRPRE8gKHY4KTogVXBkYXRlIHRoaXMgb3JkZXIgdG8gYmU6IEdsb2JhbCA+IENsaWVudCA+IFNjb3BlCiAgICBjb25zdCBldmVudFByb2Nlc3NvcnMgPSBbCiAgICAgIC4uLmFkZGl0aW9uYWxFdmVudFByb2Nlc3NvcnMsCiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgICAuLi5nZXRHbG9iYWxFdmVudFByb2Nlc3NvcnMoKSwKICAgICAgLi4udGhpcy5fZXZlbnRQcm9jZXNzb3JzLAogICAgXTsKCiAgICByZXR1cm4gbm90aWZ5RXZlbnRQcm9jZXNzb3JzKGV2ZW50UHJvY2Vzc29ycywgZXZlbnQsIGhpbnQpOwogIH0KCiAgLyoqCiAgICogQWRkIGRhdGEgd2hpY2ggd2lsbCBiZSBhY2Nlc3NpYmxlIGR1cmluZyBldmVudCBwcm9jZXNzaW5nIGJ1dCB3b24ndCBnZXQgc2VudCB0byBTZW50cnkKICAgKi8KICAgc2V0U0RLUHJvY2Vzc2luZ01ldGFkYXRhKG5ld0RhdGEpIHsKICAgIHRoaXMuX3Nka1Byb2Nlc3NpbmdNZXRhZGF0YSA9IHsgLi4udGhpcy5fc2RrUHJvY2Vzc2luZ01ldGFkYXRhLCAuLi5uZXdEYXRhIH07CgogICAgcmV0dXJuIHRoaXM7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqLwogICBzZXRQcm9wYWdhdGlvbkNvbnRleHQoY29udGV4dCkgewogICAgdGhpcy5fcHJvcGFnYXRpb25Db250ZXh0ID0gY29udGV4dDsKICAgIHJldHVybiB0aGlzOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKi8KICAgZ2V0UHJvcGFnYXRpb25Db250ZXh0KCkgewogICAgcmV0dXJuIHRoaXMuX3Byb3BhZ2F0aW9uQ29udGV4dDsKICB9CgogIC8qKgogICAqIENhcHR1cmUgYW4gZXhjZXB0aW9uIGZvciB0aGlzIHNjb3BlLgogICAqCiAgICogQHBhcmFtIGV4Y2VwdGlvbiBUaGUgZXhjZXB0aW9uIHRvIGNhcHR1cmUuCiAgICogQHBhcmFtIGhpbnQgT3B0aW5hbCBhZGRpdGlvbmFsIGRhdGEgdG8gYXR0YWNoIHRvIHRoZSBTZW50cnkgZXZlbnQuCiAgICogQHJldHVybnMgdGhlIGlkIG9mIHRoZSBjYXB0dXJlZCBTZW50cnkgZXZlbnQuCiAgICovCiAgIGNhcHR1cmVFeGNlcHRpb24oZXhjZXB0aW9uLCBoaW50KSB7CiAgICBjb25zdCBldmVudElkID0gaGludCAmJiBoaW50LmV2ZW50X2lkID8gaGludC5ldmVudF9pZCA6IHV1aWQ0KCk7CgogICAgaWYgKCF0aGlzLl9jbGllbnQpIHsKICAgICAgbG9nZ2VyLndhcm4oJ05vIGNsaWVudCBjb25maWd1cmVkIG9uIHNjb3BlIC0gd2lsbCBub3QgY2FwdHVyZSBleGNlcHRpb24hJyk7CiAgICAgIHJldHVybiBldmVudElkOwogICAgfQoKICAgIGNvbnN0IHN5bnRoZXRpY0V4Y2VwdGlvbiA9IG5ldyBFcnJvcignU2VudHJ5IHN5bnRoZXRpY0V4Y2VwdGlvbicpOwoKICAgIHRoaXMuX2NsaWVudC5jYXB0dXJlRXhjZXB0aW9uKAogICAgICBleGNlcHRpb24sCiAgICAgIHsKICAgICAgICBvcmlnaW5hbEV4Y2VwdGlvbjogZXhjZXB0aW9uLAogICAgICAgIHN5bnRoZXRpY0V4Y2VwdGlvbiwKICAgICAgICAuLi5oaW50LAogICAgICAgIGV2ZW50X2lkOiBldmVudElkLAogICAgICB9LAogICAgICB0aGlzLAogICAgKTsKCiAgICByZXR1cm4gZXZlbnRJZDsKICB9CgogIC8qKgogICAqIENhcHR1cmUgYSBtZXNzYWdlIGZvciB0aGlzIHNjb3BlLgogICAqCiAgICogQHBhcmFtIG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gY2FwdHVyZS4KICAgKiBAcGFyYW0gbGV2ZWwgQW4gb3B0aW9uYWwgc2V2ZXJpdHkgbGV2ZWwgdG8gcmVwb3J0IHRoZSBtZXNzYWdlIHdpdGguCiAgICogQHBhcmFtIGhpbnQgT3B0aW9uYWwgYWRkaXRpb25hbCBkYXRhIHRvIGF0dGFjaCB0byB0aGUgU2VudHJ5IGV2ZW50LgogICAqIEByZXR1cm5zIHRoZSBpZCBvZiB0aGUgY2FwdHVyZWQgbWVzc2FnZS4KICAgKi8KICAgY2FwdHVyZU1lc3NhZ2UobWVzc2FnZSwgbGV2ZWwsIGhpbnQpIHsKICAgIGNvbnN0IGV2ZW50SWQgPSBoaW50ICYmIGhpbnQuZXZlbnRfaWQgPyBoaW50LmV2ZW50X2lkIDogdXVpZDQoKTsKCiAgICBpZiAoIXRoaXMuX2NsaWVudCkgewogICAgICBsb2dnZXIud2FybignTm8gY2xpZW50IGNvbmZpZ3VyZWQgb24gc2NvcGUgLSB3aWxsIG5vdCBjYXB0dXJlIG1lc3NhZ2UhJyk7CiAgICAgIHJldHVybiBldmVudElkOwogICAgfQoKICAgIGNvbnN0IHN5bnRoZXRpY0V4Y2VwdGlvbiA9IG5ldyBFcnJvcihtZXNzYWdlKTsKCiAgICB0aGlzLl9jbGllbnQuY2FwdHVyZU1lc3NhZ2UoCiAgICAgIG1lc3NhZ2UsCiAgICAgIGxldmVsLAogICAgICB7CiAgICAgICAgb3JpZ2luYWxFeGNlcHRpb246IG1lc3NhZ2UsCiAgICAgICAgc3ludGhldGljRXhjZXB0aW9uLAogICAgICAgIC4uLmhpbnQsCiAgICAgICAgZXZlbnRfaWQ6IGV2ZW50SWQsCiAgICAgIH0sCiAgICAgIHRoaXMsCiAgICApOwoKICAgIHJldHVybiBldmVudElkOwogIH0KCiAgLyoqCiAgICogQ2FwdHVyZXMgYSBtYW51YWxseSBjcmVhdGVkIGV2ZW50IGZvciB0aGlzIHNjb3BlIGFuZCBzZW5kcyBpdCB0byBTZW50cnkuCiAgICoKICAgKiBAcGFyYW0gZXhjZXB0aW9uIFRoZSBldmVudCB0byBjYXB0dXJlLgogICAqIEBwYXJhbSBoaW50IE9wdGlvbmFsIGFkZGl0aW9uYWwgZGF0YSB0byBhdHRhY2ggdG8gdGhlIFNlbnRyeSBldmVudC4KICAgKiBAcmV0dXJucyB0aGUgaWQgb2YgdGhlIGNhcHR1cmVkIGV2ZW50LgogICAqLwogICBjYXB0dXJlRXZlbnQoZXZlbnQsIGhpbnQpIHsKICAgIGNvbnN0IGV2ZW50SWQgPSBoaW50ICYmIGhpbnQuZXZlbnRfaWQgPyBoaW50LmV2ZW50X2lkIDogdXVpZDQoKTsKCiAgICBpZiAoIXRoaXMuX2NsaWVudCkgewogICAgICBsb2dnZXIud2FybignTm8gY2xpZW50IGNvbmZpZ3VyZWQgb24gc2NvcGUgLSB3aWxsIG5vdCBjYXB0dXJlIGV2ZW50IScpOwogICAgICByZXR1cm4gZXZlbnRJZDsKICAgIH0KCiAgICB0aGlzLl9jbGllbnQuY2FwdHVyZUV2ZW50KGV2ZW50LCB7IC4uLmhpbnQsIGV2ZW50X2lkOiBldmVudElkIH0sIHRoaXMpOwoKICAgIHJldHVybiBldmVudElkOwogIH0KCiAgLyoqCiAgICogVGhpcyB3aWxsIGJlIGNhbGxlZCBvbiBldmVyeSBzZXQgY2FsbC4KICAgKi8KICAgX25vdGlmeVNjb3BlTGlzdGVuZXJzKCkgewogICAgLy8gV2UgbmVlZCB0aGlzIGNoZWNrIGZvciB0aGlzLl9ub3RpZnlpbmdMaXN0ZW5lcnMgdG8gYmUgYWJsZSB0byB3b3JrIG9uIHNjb3BlIGR1cmluZyB1cGRhdGVzCiAgICAvLyBJZiB0aGlzIGNoZWNrIGlzIG5vdCBoZXJlIHdlJ2xsIHByb2R1Y2UgZW5kbGVzcyByZWN1cnNpb24gd2hlbiBzb21ldGhpbmcgaXMgZG9uZSB3aXRoIHRoZSBzY29wZQogICAgLy8gZHVyaW5nIHRoZSBjYWxsYmFjay4KICAgIGlmICghdGhpcy5fbm90aWZ5aW5nTGlzdGVuZXJzKSB7CiAgICAgIHRoaXMuX25vdGlmeWluZ0xpc3RlbmVycyA9IHRydWU7CiAgICAgIHRoaXMuX3Njb3BlTGlzdGVuZXJzLmZvckVhY2goY2FsbGJhY2sgPT4gewogICAgICAgIGNhbGxiYWNrKHRoaXMpOwogICAgICB9KTsKICAgICAgdGhpcy5fbm90aWZ5aW5nTGlzdGVuZXJzID0gZmFsc2U7CiAgICB9CiAgfQp9CgpmdW5jdGlvbiBnZW5lcmF0ZVByb3BhZ2F0aW9uQ29udGV4dCgpIHsKICByZXR1cm4gewogICAgdHJhY2VJZDogdXVpZDQoKSwKICAgIHNwYW5JZDogdXVpZDQoKS5zdWJzdHJpbmcoMTYpLAogIH07Cn0KCmNvbnN0IFNES19WRVJTSU9OID0gJzcuMTIwLjMnOwoKLyoqCiAqIEFQSSBjb21wYXRpYmlsaXR5IHZlcnNpb24gb2YgdGhpcyBodWIuCiAqCiAqIFdBUk5JTkc6IFRoaXMgbnVtYmVyIHNob3VsZCBvbmx5IGJlIGluY3JlYXNlZCB3aGVuIHRoZSBnbG9iYWwgaW50ZXJmYWNlCiAqIGNoYW5nZXMgYW5kIG5ldyBtZXRob2RzIGFyZSBpbnRyb2R1Y2VkLgogKgogKiBAaGlkZGVuCiAqLwpjb25zdCBBUElfVkVSU0lPTiA9IHBhcnNlRmxvYXQoU0RLX1ZFUlNJT04pOwoKLyoqCiAqIERlZmF1bHQgbWF4aW11bSBudW1iZXIgb2YgYnJlYWRjcnVtYnMgYWRkZWQgdG8gYW4gZXZlbnQuIENhbiBiZSBvdmVyd3JpdHRlbgogKiB3aXRoIHtAbGluayBPcHRpb25zLm1heEJyZWFkY3J1bWJzfS4KICovCmNvbnN0IERFRkFVTFRfQlJFQURDUlVNQlMgPSAxMDA7CgovKioKICogQGRlcHJlY2F0ZWQgVGhlIGBIdWJgIGNsYXNzIHdpbGwgYmUgcmVtb3ZlZCBpbiB2ZXJzaW9uIDggb2YgdGhlIFNESyBpbiBmYXZvdXIgb2YgYFNjb3BlYCBhbmQgYENsaWVudGAgb2JqZWN0cy4KICoKICogSWYgeW91IHByZXZpb3VzbHkgdXNlZCB0aGUgYEh1YmAgY2xhc3MgZGlyZWN0bHksIHJlcGxhY2UgaXQgd2l0aCBgU2NvcGVgIGFuZCBgQ2xpZW50YCBvYmplY3RzLiBNb3JlIGluZm9ybWF0aW9uOgogKiAtIFtNdWx0aXBsZSBTZW50cnkgSW5zdGFuY2VzXShodHRwczovL2RvY3Muc2VudHJ5LmlvL3BsYXRmb3Jtcy9qYXZhc2NyaXB0L2Jlc3QtcHJhY3RpY2VzL211bHRpcGxlLXNlbnRyeS1pbnN0YW5jZXMvKQogKiAtIFtCcm93c2VyIEV4dGVuc2lvbnNdKGh0dHBzOi8vZG9jcy5zZW50cnkuaW8vcGxhdGZvcm1zL2phdmFzY3JpcHQvYmVzdC1wcmFjdGljZXMvYnJvd3Nlci1leHRlbnNpb25zLykKICoKICogU29tZSBvZiBvdXIgQVBJcyBhcmUgdHlwZWQgd2l0aCB0aGUgSHViIGNsYXNzIGluc3RlYWQgb2YgdGhlIGludGVyZmFjZSAoZS5nLiBgZ2V0Q3VycmVudEh1YmApLiBNb3N0IG9mIHRoZW0gYXJlIGRlcHJlY2F0ZWQKICogdGhlbXNlbHZlcyBhbmQgd2lsbCBhbHNvIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiA4LiBNb3JlIGluZm9ybWF0aW9uOgogKiAtIFtNaWdyYXRpb24gR3VpZGVdKGh0dHBzOi8vZ2l0aHViLmNvbS9nZXRzZW50cnkvc2VudHJ5LWphdmFzY3JpcHQvYmxvYi9kZXZlbG9wL01JR1JBVElPTi5tZCNkZXByZWNhdGUtaHViKQogKi8KLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCmNsYXNzIEh1YiAgewogIC8qKiBJcyBhIHtAbGluayBMYXllcn1bXSBjb250YWluaW5nIHRoZSBjbGllbnQgYW5kIHNjb3BlICovCgogIC8qKiBDb250YWlucyB0aGUgbGFzdCBldmVudCBpZCBvZiBhIGNhcHR1cmVkIGV2ZW50LiAgKi8KCiAgLyoqCiAgICogQ3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgaHViLCB3aWxsIHB1c2ggb25lIHtAbGluayBMYXllcn0gaW50byB0aGUKICAgKiBpbnRlcm5hbCBzdGFjayBvbiBjcmVhdGlvbi4KICAgKgogICAqIEBwYXJhbSBjbGllbnQgYm91bmQgdG8gdGhlIGh1Yi4KICAgKiBAcGFyYW0gc2NvcGUgYm91bmQgdG8gdGhlIGh1Yi4KICAgKiBAcGFyYW0gdmVyc2lvbiBudW1iZXIsIGhpZ2hlciBudW1iZXIgbWVhbnMgaGlnaGVyIHByaW9yaXR5LgogICAqCiAgICogQGRlcHJlY2F0ZWQgSW5zdGFudGlhdGlvbiBvZiBIdWIgb2JqZWN0cyBpcyBkZXByZWNhdGVkIGFuZCB0aGUgY29uc3RydWN0b3Igd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gOCBvZiB0aGUgU0RLLgogICAqCiAgICogSWYgeW91IGFyZSBjdXJyZW50bHkgdXNpbmcgdGhlIEh1YiBmb3IgbXVsdGktY2xpZW50IHVzZSBsaWtlIHNvOgogICAqCiAgICogYGBgCiAgICogLy8gT0xECiAgICogY29uc3QgaHViID0gbmV3IEh1YigpOwogICAqIGh1Yi5iaW5kQ2xpZW50KGNsaWVudCk7CiAgICogbWFrZU1haW4oaHViKQogICAqIGBgYAogICAqCiAgICogaW5zdGVhZCBpbml0aWFsaXplIHRoZSBjbGllbnQgYXMgZm9sbG93czoKICAgKgogICAqIGBgYAogICAqIC8vIE5FVwogICAqIFNlbnRyeS53aXRoSXNvbGF0aW9uU2NvcGUoKCkgPT4gewogICAqICAgIFNlbnRyeS5zZXRDdXJyZW50Q2xpZW50KGNsaWVudCk7CiAgICogICAgY2xpZW50LmluaXQoKTsKICAgKiB9KTsKICAgKiBgYGAKICAgKgogICAqIElmIHlvdSBhcmUgdXNpbmcgdGhlIEh1YiB0byBjYXB0dXJlIGV2ZW50cyBsaWtlIHNvOgogICAqCiAgICogYGBgCiAgICogLy8gT0xECiAgICogY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCgpOwogICAqIGNvbnN0IGh1YiA9IG5ldyBIdWIoY2xpZW50KTsKICAgKiBodWIuY2FwdHVyZUV4Y2VwdGlvbigpCiAgICogYGBgCiAgICoKICAgKiBpbnN0ZWFkIGNhcHR1cmUgaXNvbGF0ZWQgZXZlbnRzIGFzIGZvbGxvd3M6CiAgICoKICAgKiBgYGAKICAgKiAvLyBORVcKICAgKiBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KCk7CiAgICogY29uc3Qgc2NvcGUgPSBuZXcgU2NvcGUoKTsKICAgKiBzY29wZS5zZXRDbGllbnQoY2xpZW50KTsKICAgKiBzY29wZS5jYXB0dXJlRXhjZXB0aW9uKCk7CiAgICogYGBgCiAgICovCiAgIGNvbnN0cnVjdG9yKAogICAgY2xpZW50LAogICAgc2NvcGUsCiAgICBpc29sYXRpb25TY29wZSwKICAgICAgX3ZlcnNpb24gPSBBUElfVkVSU0lPTiwKICApIHt0aGlzLl92ZXJzaW9uID0gX3ZlcnNpb247CiAgICBsZXQgYXNzaWduZWRTY29wZTsKICAgIGlmICghc2NvcGUpIHsKICAgICAgYXNzaWduZWRTY29wZSA9IG5ldyBTY29wZSgpOwogICAgICBhc3NpZ25lZFNjb3BlLnNldENsaWVudChjbGllbnQpOwogICAgfSBlbHNlIHsKICAgICAgYXNzaWduZWRTY29wZSA9IHNjb3BlOwogICAgfQoKICAgIGxldCBhc3NpZ25lZElzb2xhdGlvblNjb3BlOwogICAgaWYgKCFpc29sYXRpb25TY29wZSkgewogICAgICBhc3NpZ25lZElzb2xhdGlvblNjb3BlID0gbmV3IFNjb3BlKCk7CiAgICAgIGFzc2lnbmVkSXNvbGF0aW9uU2NvcGUuc2V0Q2xpZW50KGNsaWVudCk7CiAgICB9IGVsc2UgewogICAgICBhc3NpZ25lZElzb2xhdGlvblNjb3BlID0gaXNvbGF0aW9uU2NvcGU7CiAgICB9CgogICAgdGhpcy5fc3RhY2sgPSBbeyBzY29wZTogYXNzaWduZWRTY29wZSB9XTsKCiAgICBpZiAoY2xpZW50KSB7CiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgICB0aGlzLmJpbmRDbGllbnQoY2xpZW50KTsKICAgIH0KCiAgICB0aGlzLl9pc29sYXRpb25TY29wZSA9IGFzc2lnbmVkSXNvbGF0aW9uU2NvcGU7CiAgfQoKICAvKioKICAgKiBDaGVja3MgaWYgdGhpcyBodWIncyB2ZXJzaW9uIGlzIG9sZGVyIHRoYW4gdGhlIGdpdmVuIHZlcnNpb24uCiAgICoKICAgKiBAcGFyYW0gdmVyc2lvbiBBIHZlcnNpb24gbnVtYmVyIHRvIGNvbXBhcmUgdG8uCiAgICogQHJldHVybiBUcnVlIGlmIHRoZSBnaXZlbiB2ZXJzaW9uIGlzIG5ld2VyOyBvdGhlcndpc2UgZmFsc2UuCiAgICoKICAgKiBAZGVwcmVjYXRlZCBUaGlzIHdpbGwgYmUgcmVtb3ZlZCBpbiB2OC4KICAgKi8KICAgaXNPbGRlclRoYW4odmVyc2lvbikgewogICAgcmV0dXJuIHRoaXMuX3ZlcnNpb24gPCB2ZXJzaW9uOwogIH0KCiAgLyoqCiAgICogVGhpcyBiaW5kcyB0aGUgZ2l2ZW4gY2xpZW50IHRvIHRoZSBjdXJyZW50IHNjb3BlLgogICAqIEBwYXJhbSBjbGllbnQgQW4gU0RLIGNsaWVudCAoY2xpZW50KSBpbnN0YW5jZS4KICAgKgogICAqIEBkZXByZWNhdGVkIFVzZSBgaW5pdEFuZEJpbmQoKWAgZGlyZWN0bHksIG9yIGBzZXRDdXJyZW50Q2xpZW50KClgIGFuZC9vciBgY2xpZW50LmluaXQoKWAgaW5zdGVhZC4KICAgKi8KICAgYmluZENsaWVudChjbGllbnQpIHsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgY29uc3QgdG9wID0gdGhpcy5nZXRTdGFja1RvcCgpOwogICAgdG9wLmNsaWVudCA9IGNsaWVudDsKICAgIHRvcC5zY29wZS5zZXRDbGllbnQoY2xpZW50KTsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgaWYgKGNsaWVudCAmJiBjbGllbnQuc2V0dXBJbnRlZ3JhdGlvbnMpIHsKICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICAgIGNsaWVudC5zZXR1cEludGVncmF0aW9ucygpOwogICAgfQogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKgogICAqIEBkZXByZWNhdGVkIFVzZSBgd2l0aFNjb3BlYCBpbnN0ZWFkLgogICAqLwogICBwdXNoU2NvcGUoKSB7CiAgICAvLyBXZSB3YW50IHRvIGNsb25lIHRoZSBjb250ZW50IG9mIHByZXYgc2NvcGUKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgY29uc3Qgc2NvcGUgPSB0aGlzLmdldFNjb3BlKCkuY2xvbmUoKTsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5nZXRTdGFjaygpLnB1c2goewogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgICAgY2xpZW50OiB0aGlzLmdldENsaWVudCgpLAogICAgICBzY29wZSwKICAgIH0pOwogICAgcmV0dXJuIHNjb3BlOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKgogICAqIEBkZXByZWNhdGVkIFVzZSBgd2l0aFNjb3BlYCBpbnN0ZWFkLgogICAqLwogICBwb3BTY29wZSgpIHsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgaWYgKHRoaXMuZ2V0U3RhY2soKS5sZW5ndGggPD0gMSkgcmV0dXJuIGZhbHNlOwogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICByZXR1cm4gISF0aGlzLmdldFN0YWNrKCkucG9wKCk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBTZW50cnkud2l0aFNjb3BlKClgIGluc3RlYWQuCiAgICovCiAgIHdpdGhTY29wZShjYWxsYmFjaykgewogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICBjb25zdCBzY29wZSA9IHRoaXMucHVzaFNjb3BlKCk7CgogICAgbGV0IG1heWJlUHJvbWlzZVJlc3VsdDsKICAgIHRyeSB7CiAgICAgIG1heWJlUHJvbWlzZVJlc3VsdCA9IGNhbGxiYWNrKHNjb3BlKTsKICAgIH0gY2F0Y2ggKGUpIHsKICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICAgIHRoaXMucG9wU2NvcGUoKTsKICAgICAgdGhyb3cgZTsKICAgIH0KCiAgICBpZiAoaXNUaGVuYWJsZShtYXliZVByb21pc2VSZXN1bHQpKSB7CiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgLSBpc1RoZW5hYmxlIHJldHVybnMgdGhlIHdyb25nIHR5cGUKICAgICAgcmV0dXJuIG1heWJlUHJvbWlzZVJlc3VsdC50aGVuKAogICAgICAgIHJlcyA9PiB7CiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgICAgICAgIHRoaXMucG9wU2NvcGUoKTsKICAgICAgICAgIHJldHVybiByZXM7CiAgICAgICAgfSwKICAgICAgICBlID0+IHsKICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgICAgICAgdGhpcy5wb3BTY29wZSgpOwogICAgICAgICAgdGhyb3cgZTsKICAgICAgICB9LAogICAgICApOwogICAgfQoKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5wb3BTY29wZSgpOwogICAgcmV0dXJuIG1heWJlUHJvbWlzZVJlc3VsdDsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICoKICAgKiBAZGVwcmVjYXRlZCBVc2UgYFNlbnRyeS5nZXRDbGllbnQoKWAgaW5zdGVhZC4KICAgKi8KICAgZ2V0Q2xpZW50KCkgewogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICByZXR1cm4gdGhpcy5nZXRTdGFja1RvcCgpLmNsaWVudCA7CiAgfQoKICAvKioKICAgKiBSZXR1cm5zIHRoZSBzY29wZSBvZiB0aGUgdG9wIHN0YWNrLgogICAqCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBTZW50cnkuZ2V0Q3VycmVudFNjb3BlKClgIGluc3RlYWQuCiAgICovCiAgIGdldFNjb3BlKCkgewogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICByZXR1cm4gdGhpcy5nZXRTdGFja1RvcCgpLnNjb3BlOwogIH0KCiAgLyoqCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBTZW50cnkuZ2V0SXNvbGF0aW9uU2NvcGUoKWAgaW5zdGVhZC4KICAgKi8KICAgZ2V0SXNvbGF0aW9uU2NvcGUoKSB7CiAgICByZXR1cm4gdGhpcy5faXNvbGF0aW9uU2NvcGU7CiAgfQoKICAvKioKICAgKiBSZXR1cm5zIHRoZSBzY29wZSBzdGFjayBmb3IgZG9tYWlucyBvciB0aGUgcHJvY2Vzcy4KICAgKiBAZGVwcmVjYXRlZCBUaGlzIHdpbGwgYmUgcmVtb3ZlZCBpbiB2OC4KICAgKi8KICAgZ2V0U3RhY2soKSB7CiAgICByZXR1cm4gdGhpcy5fc3RhY2s7CiAgfQoKICAvKioKICAgKiBSZXR1cm5zIHRoZSB0b3Btb3N0IHNjb3BlIGxheWVyIGluIHRoZSBvcmRlciBkb21haW4gPiBsb2NhbCA+IHByb2Nlc3MuCiAgICogQGRlcHJlY2F0ZWQgVGhpcyB3aWxsIGJlIHJlbW92ZWQgaW4gdjguCiAgICovCiAgIGdldFN0YWNrVG9wKCkgewogICAgcmV0dXJuIHRoaXMuX3N0YWNrW3RoaXMuX3N0YWNrLmxlbmd0aCAtIDFdOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKgogICAqIEBkZXByZWNhdGVkIFVzZSBgU2VudHJ5LmNhcHR1cmVFeGNlcHRpb24oKWAgaW5zdGVhZC4KICAgKi8KICAgY2FwdHVyZUV4Y2VwdGlvbihleGNlcHRpb24sIGhpbnQpIHsKICAgIGNvbnN0IGV2ZW50SWQgPSAodGhpcy5fbGFzdEV2ZW50SWQgPSBoaW50ICYmIGhpbnQuZXZlbnRfaWQgPyBoaW50LmV2ZW50X2lkIDogdXVpZDQoKSk7CiAgICBjb25zdCBzeW50aGV0aWNFeGNlcHRpb24gPSBuZXcgRXJyb3IoJ1NlbnRyeSBzeW50aGV0aWNFeGNlcHRpb24nKTsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5nZXRTY29wZSgpLmNhcHR1cmVFeGNlcHRpb24oZXhjZXB0aW9uLCB7CiAgICAgIG9yaWdpbmFsRXhjZXB0aW9uOiBleGNlcHRpb24sCiAgICAgIHN5bnRoZXRpY0V4Y2VwdGlvbiwKICAgICAgLi4uaGludCwKICAgICAgZXZlbnRfaWQ6IGV2ZW50SWQsCiAgICB9KTsKCiAgICByZXR1cm4gZXZlbnRJZDsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICoKICAgKiBAZGVwcmVjYXRlZCBVc2UgIGBTZW50cnkuY2FwdHVyZU1lc3NhZ2UoKWAgaW5zdGVhZC4KICAgKi8KICAgY2FwdHVyZU1lc3NhZ2UoCiAgICBtZXNzYWdlLAogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICBsZXZlbCwKICAgIGhpbnQsCiAgKSB7CiAgICBjb25zdCBldmVudElkID0gKHRoaXMuX2xhc3RFdmVudElkID0gaGludCAmJiBoaW50LmV2ZW50X2lkID8gaGludC5ldmVudF9pZCA6IHV1aWQ0KCkpOwogICAgY29uc3Qgc3ludGhldGljRXhjZXB0aW9uID0gbmV3IEVycm9yKG1lc3NhZ2UpOwogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICB0aGlzLmdldFNjb3BlKCkuY2FwdHVyZU1lc3NhZ2UobWVzc2FnZSwgbGV2ZWwsIHsKICAgICAgb3JpZ2luYWxFeGNlcHRpb246IG1lc3NhZ2UsCiAgICAgIHN5bnRoZXRpY0V4Y2VwdGlvbiwKICAgICAgLi4uaGludCwKICAgICAgZXZlbnRfaWQ6IGV2ZW50SWQsCiAgICB9KTsKCiAgICByZXR1cm4gZXZlbnRJZDsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICoKICAgKiBAZGVwcmVjYXRlZCBVc2UgYFNlbnRyeS5jYXB0dXJlRXZlbnQoKWAgaW5zdGVhZC4KICAgKi8KICAgY2FwdHVyZUV2ZW50KGV2ZW50LCBoaW50KSB7CiAgICBjb25zdCBldmVudElkID0gaGludCAmJiBoaW50LmV2ZW50X2lkID8gaGludC5ldmVudF9pZCA6IHV1aWQ0KCk7CiAgICBpZiAoIWV2ZW50LnR5cGUpIHsKICAgICAgdGhpcy5fbGFzdEV2ZW50SWQgPSBldmVudElkOwogICAgfQogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICB0aGlzLmdldFNjb3BlKCkuY2FwdHVyZUV2ZW50KGV2ZW50LCB7IC4uLmhpbnQsIGV2ZW50X2lkOiBldmVudElkIH0pOwogICAgcmV0dXJuIGV2ZW50SWQ7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqCiAgICogQGRlcHJlY2F0ZWQgVGhpcyB3aWxsIGJlIHJlbW92ZWQgaW4gdjguCiAgICovCiAgIGxhc3RFdmVudElkKCkgewogICAgcmV0dXJuIHRoaXMuX2xhc3RFdmVudElkOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKgogICAqIEBkZXByZWNhdGVkIFVzZSBgU2VudHJ5LmFkZEJyZWFkY3J1bWIoKWAgaW5zdGVhZC4KICAgKi8KICAgYWRkQnJlYWRjcnVtYihicmVhZGNydW1iLCBoaW50KSB7CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIGNvbnN0IHsgc2NvcGUsIGNsaWVudCB9ID0gdGhpcy5nZXRTdGFja1RvcCgpOwoKICAgIGlmICghY2xpZW50KSByZXR1cm47CgogICAgY29uc3QgeyBiZWZvcmVCcmVhZGNydW1iID0gbnVsbCwgbWF4QnJlYWRjcnVtYnMgPSBERUZBVUxUX0JSRUFEQ1JVTUJTIH0gPQogICAgICAoY2xpZW50LmdldE9wdGlvbnMgJiYgY2xpZW50LmdldE9wdGlvbnMoKSkgfHwge307CgogICAgaWYgKG1heEJyZWFkY3J1bWJzIDw9IDApIHJldHVybjsKCiAgICBjb25zdCB0aW1lc3RhbXAgPSBkYXRlVGltZXN0YW1wSW5TZWNvbmRzKCk7CiAgICBjb25zdCBtZXJnZWRCcmVhZGNydW1iID0geyB0aW1lc3RhbXAsIC4uLmJyZWFkY3J1bWIgfTsKICAgIGNvbnN0IGZpbmFsQnJlYWRjcnVtYiA9IGJlZm9yZUJyZWFkY3J1bWIKICAgICAgPyAoY29uc29sZVNhbmRib3goKCkgPT4gYmVmb3JlQnJlYWRjcnVtYihtZXJnZWRCcmVhZGNydW1iLCBoaW50KSkgKQogICAgICA6IG1lcmdlZEJyZWFkY3J1bWI7CgogICAgaWYgKGZpbmFsQnJlYWRjcnVtYiA9PT0gbnVsbCkgcmV0dXJuOwoKICAgIGlmIChjbGllbnQuZW1pdCkgewogICAgICBjbGllbnQuZW1pdCgnYmVmb3JlQWRkQnJlYWRjcnVtYicsIGZpbmFsQnJlYWRjcnVtYiwgaGludCk7CiAgICB9CgogICAgLy8gVE9ETyh2OCk6IEkga25vdyB0aGlzIGNvbW1lbnQgZG9lc24ndCBtYWtlIG11Y2ggc2Vuc2UgYmVjYXVzZSB0aGUgaHViIHdpbGwgYmUgZGVwcmVjYXRlZCBidXQgSSBzdGlsbCB3YW50ZWQgdG8KICAgIC8vIHdyaXRlIGl0IGRvd24uIEluIHRoZW9yeSwgd2Ugd291bGQgaGF2ZSB0byBhZGQgdGhlIGJyZWFkY3J1bWJzIHRvIHRoZSBpc29sYXRpb24gc2NvcGUgaGVyZSwgaG93ZXZlciwgdGhhdCB3b3VsZAogICAgLy8gZHVwbGljYXRlIGFsbCBvZiB0aGUgYnJlYWRjcnVtYnMuIFRoZXJlIHdhcyB0aGUgcG9zc2liaWxpdHkgb2YgYWRkaW5nIGJyZWFkY3J1bWJzIHRvIGJvdGgsIHRoZSBpc29sYXRpb24gc2NvcGUKICAgIC8vIGFuZCB0aGUgbm9ybWFsIHNjb3BlLCBhbmQgZGVkdXBsaWNhdGluZyBpdCBkb3duIHRoZSBsaW5lIGluIHRoZSBldmVudCBwcm9jZXNzaW5nIHBpcGVsaW5lLiBIb3dldmVyLCB0aGF0IHdvdWxkCiAgICAvLyBoYXZlIGJlZW4gdmVyeSBmcmFnaWxlLCBiZWNhdXNlIHRoZSBicmVhZGNydW1iIG9iamVjdHMgd291bGQgaGF2ZSBuZWVkZWQgdG8ga2VlcCB0aGVpciBpZGVudGl0eSBhbGwgdGhyb3VnaG91dAogICAgLy8gdGhlIGV2ZW50IHByb2Nlc3NpbmcgcGlwZWxpbmUuCiAgICAvLyBJbiB0aGUgbmV3IGltcGxlbWVudGF0aW9uLCB0aGUgdG9wIGxldmVsIGBTZW50cnkuYWRkQnJlYWRjcnVtYigpYCBzaG91bGQgT05MWSB3cml0ZSB0byB0aGUgaXNvbGF0aW9uIHNjb3BlLgoKICAgIHNjb3BlLmFkZEJyZWFkY3J1bWIoZmluYWxCcmVhZGNydW1iLCBtYXhCcmVhZGNydW1icyk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqIEBkZXByZWNhdGVkIFVzZSBgU2VudHJ5LnNldFVzZXIoKWAgaW5zdGVhZC4KICAgKi8KICAgc2V0VXNlcih1c2VyKSB7CiAgICAvLyBUT0RPKHY4KTogVGhlIHRvcCBsZXZlbCBgU2VudHJ5LnNldFVzZXIoKWAgZnVuY3Rpb24gc2hvdWxkIHdyaXRlIE9OTFkgdG8gdGhlIGlzb2xhdGlvbiBzY29wZS4KICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5nZXRTY29wZSgpLnNldFVzZXIodXNlcik7CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIHRoaXMuZ2V0SXNvbGF0aW9uU2NvcGUoKS5zZXRVc2VyKHVzZXIpOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKiBAZGVwcmVjYXRlZCBVc2UgYFNlbnRyeS5zZXRUYWdzKClgIGluc3RlYWQuCiAgICovCiAgIHNldFRhZ3ModGFncykgewogICAgLy8gVE9ETyh2OCk6IFRoZSB0b3AgbGV2ZWwgYFNlbnRyeS5zZXRUYWdzKClgIGZ1bmN0aW9uIHNob3VsZCB3cml0ZSBPTkxZIHRvIHRoZSBpc29sYXRpb24gc2NvcGUuCiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIHRoaXMuZ2V0U2NvcGUoKS5zZXRUYWdzKHRhZ3MpOwogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICB0aGlzLmdldElzb2xhdGlvblNjb3BlKCkuc2V0VGFncyh0YWdzKTsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBTZW50cnkuc2V0RXh0cmFzKClgIGluc3RlYWQuCiAgICovCiAgIHNldEV4dHJhcyhleHRyYXMpIHsKICAgIC8vIFRPRE8odjgpOiBUaGUgdG9wIGxldmVsIGBTZW50cnkuc2V0RXh0cmFzKClgIGZ1bmN0aW9uIHNob3VsZCB3cml0ZSBPTkxZIHRvIHRoZSBpc29sYXRpb24gc2NvcGUuCiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIHRoaXMuZ2V0U2NvcGUoKS5zZXRFeHRyYXMoZXh0cmFzKTsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5nZXRJc29sYXRpb25TY29wZSgpLnNldEV4dHJhcyhleHRyYXMpOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKiBAZGVwcmVjYXRlZCBVc2UgYFNlbnRyeS5zZXRUYWcoKWAgaW5zdGVhZC4KICAgKi8KICAgc2V0VGFnKGtleSwgdmFsdWUpIHsKICAgIC8vIFRPRE8odjgpOiBUaGUgdG9wIGxldmVsIGBTZW50cnkuc2V0VGFnKClgIGZ1bmN0aW9uIHNob3VsZCB3cml0ZSBPTkxZIHRvIHRoZSBpc29sYXRpb24gc2NvcGUuCiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIHRoaXMuZ2V0U2NvcGUoKS5zZXRUYWcoa2V5LCB2YWx1ZSk7CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIHRoaXMuZ2V0SXNvbGF0aW9uU2NvcGUoKS5zZXRUYWcoa2V5LCB2YWx1ZSk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqIEBkZXByZWNhdGVkIFVzZSBgU2VudHJ5LnNldEV4dHJhKClgIGluc3RlYWQuCiAgICovCiAgIHNldEV4dHJhKGtleSwgZXh0cmEpIHsKICAgIC8vIFRPRE8odjgpOiBUaGUgdG9wIGxldmVsIGBTZW50cnkuc2V0RXh0cmEoKWAgZnVuY3Rpb24gc2hvdWxkIHdyaXRlIE9OTFkgdG8gdGhlIGlzb2xhdGlvbiBzY29wZS4KICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5nZXRTY29wZSgpLnNldEV4dHJhKGtleSwgZXh0cmEpOwogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICB0aGlzLmdldElzb2xhdGlvblNjb3BlKCkuc2V0RXh0cmEoa2V5LCBleHRyYSk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqIEBkZXByZWNhdGVkIFVzZSBgU2VudHJ5LnNldENvbnRleHQoKWAgaW5zdGVhZC4KICAgKi8KICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueQogICBzZXRDb250ZXh0KG5hbWUsIGNvbnRleHQpIHsKICAgIC8vIFRPRE8odjgpOiBUaGUgdG9wIGxldmVsIGBTZW50cnkuc2V0Q29udGV4dCgpYCBmdW5jdGlvbiBzaG91bGQgd3JpdGUgT05MWSB0byB0aGUgaXNvbGF0aW9uIHNjb3BlLgogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICB0aGlzLmdldFNjb3BlKCkuc2V0Q29udGV4dChuYW1lLCBjb250ZXh0KTsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5nZXRJc29sYXRpb25TY29wZSgpLnNldENvbnRleHQobmFtZSwgY29udGV4dCk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRTY29wZSgpYCBkaXJlY3RseS4KICAgKi8KICAgY29uZmlndXJlU2NvcGUoY2FsbGJhY2spIHsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgY29uc3QgeyBzY29wZSwgY2xpZW50IH0gPSB0aGlzLmdldFN0YWNrVG9wKCk7CiAgICBpZiAoY2xpZW50KSB7CiAgICAgIGNhbGxiYWNrKHNjb3BlKTsKICAgIH0KICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICovCiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgIHJ1bihjYWxsYmFjaykgewogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICBjb25zdCBvbGRIdWIgPSBtYWtlTWFpbih0aGlzKTsKICAgIHRyeSB7CiAgICAgIGNhbGxiYWNrKHRoaXMpOwogICAgfSBmaW5hbGx5IHsKICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICAgIG1ha2VNYWluKG9sZEh1Yik7CiAgICB9CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqIEBkZXByZWNhdGVkIFVzZSBgU2VudHJ5LmdldENsaWVudCgpLmdldEludGVncmF0aW9uQnlOYW1lKClgIGluc3RlYWQuCiAgICovCiAgIGdldEludGVncmF0aW9uKGludGVncmF0aW9uKSB7CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIGNvbnN0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50KCk7CiAgICBpZiAoIWNsaWVudCkgcmV0dXJuIG51bGw7CiAgICB0cnkgewogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgICAgcmV0dXJuIGNsaWVudC5nZXRJbnRlZ3JhdGlvbihpbnRlZ3JhdGlvbik7CiAgICB9IGNhdGNoIChfb08pIHsKICAgICAgREVCVUdfQlVJTEQgJiYgbG9nZ2VyLndhcm4oYENhbm5vdCByZXRyaWV2ZSBpbnRlZ3JhdGlvbiAke2ludGVncmF0aW9uLmlkfSBmcm9tIHRoZSBjdXJyZW50IEh1YmApOwogICAgICByZXR1cm4gbnVsbDsKICAgIH0KICB9CgogIC8qKgogICAqIFN0YXJ0cyBhIG5ldyBgVHJhbnNhY3Rpb25gIGFuZCByZXR1cm5zIGl0LiBUaGlzIGlzIHRoZSBlbnRyeSBwb2ludCB0byBtYW51YWwgdHJhY2luZyBpbnN0cnVtZW50YXRpb24uCiAgICoKICAgKiBBIHRyZWUgc3RydWN0dXJlIGNhbiBiZSBidWlsdCBieSBhZGRpbmcgY2hpbGQgc3BhbnMgdG8gdGhlIHRyYW5zYWN0aW9uLCBhbmQgY2hpbGQgc3BhbnMgdG8gb3RoZXIgc3BhbnMuIFRvIHN0YXJ0IGEKICAgKiBuZXcgY2hpbGQgc3BhbiB3aXRoaW4gdGhlIHRyYW5zYWN0aW9uIG9yIGFueSBzcGFuLCBjYWxsIHRoZSByZXNwZWN0aXZlIGAuc3RhcnRDaGlsZCgpYCBtZXRob2QuCiAgICoKICAgKiBFdmVyeSBjaGlsZCBzcGFuIG11c3QgYmUgZmluaXNoZWQgYmVmb3JlIHRoZSB0cmFuc2FjdGlvbiBpcyBmaW5pc2hlZCwgb3RoZXJ3aXNlIHRoZSB1bmZpbmlzaGVkIHNwYW5zIGFyZSBkaXNjYXJkZWQuCiAgICoKICAgKiBUaGUgdHJhbnNhY3Rpb24gbXVzdCBiZSBmaW5pc2hlZCB3aXRoIGEgY2FsbCB0byBpdHMgYC5lbmQoKWAgbWV0aG9kLCBhdCB3aGljaCBwb2ludCB0aGUgdHJhbnNhY3Rpb24gd2l0aCBhbGwgaXRzCiAgICogZmluaXNoZWQgY2hpbGQgc3BhbnMgd2lsbCBiZSBzZW50IHRvIFNlbnRyeS4KICAgKgogICAqIEBwYXJhbSBjb250ZXh0IFByb3BlcnRpZXMgb2YgdGhlIG5ldyBgVHJhbnNhY3Rpb25gLgogICAqIEBwYXJhbSBjdXN0b21TYW1wbGluZ0NvbnRleHQgSW5mb3JtYXRpb24gZ2l2ZW4gdG8gdGhlIHRyYW5zYWN0aW9uIHNhbXBsaW5nIGZ1bmN0aW9uIChhbG9uZyB3aXRoIGNvbnRleHQtZGVwZW5kZW50CiAgICogZGVmYXVsdCB2YWx1ZXMpLiBTZWUge0BsaW5rIE9wdGlvbnMudHJhY2VzU2FtcGxlcn0uCiAgICoKICAgKiBAcmV0dXJucyBUaGUgdHJhbnNhY3Rpb24gd2hpY2ggd2FzIGp1c3Qgc3RhcnRlZAogICAqCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBzdGFydFNwYW4oKWAsIGBzdGFydFNwYW5NYW51YWwoKWAgb3IgYHN0YXJ0SW5hY3RpdmVTcGFuKClgIGluc3RlYWQuCiAgICovCiAgIHN0YXJ0VHJhbnNhY3Rpb24oY29udGV4dCwgY3VzdG9tU2FtcGxpbmdDb250ZXh0KSB7CiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9jYWxsRXh0ZW5zaW9uTWV0aG9kKCdzdGFydFRyYW5zYWN0aW9uJywgY29udGV4dCwgY3VzdG9tU2FtcGxpbmdDb250ZXh0KTsKCiAgICBpZiAoREVCVUdfQlVJTEQgJiYgIXJlc3VsdCkgewogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgICAgY29uc3QgY2xpZW50ID0gdGhpcy5nZXRDbGllbnQoKTsKICAgICAgaWYgKCFjbGllbnQpIHsKICAgICAgICBsb2dnZXIud2FybigKICAgICAgICAgICJUcmFjaW5nIGV4dGVuc2lvbiAnc3RhcnRUcmFuc2FjdGlvbicgaXMgbWlzc2luZy4gWW91IHNob3VsZCAnaW5pdCcgdGhlIFNESyBiZWZvcmUgY2FsbGluZyAnc3RhcnRUcmFuc2FjdGlvbiciLAogICAgICAgICk7CiAgICAgIH0gZWxzZSB7CiAgICAgICAgbG9nZ2VyLndhcm4oYFRyYWNpbmcgZXh0ZW5zaW9uICdzdGFydFRyYW5zYWN0aW9uJyBoYXMgbm90IGJlZW4gYWRkZWQuIENhbGwgJ2FkZFRyYWNpbmdFeHRlbnNpb25zJyBiZWZvcmUgY2FsbGluZyAnaW5pdCc6ClNlbnRyeS5hZGRUcmFjaW5nRXh0ZW5zaW9ucygpOwpTZW50cnkuaW5pdCh7Li4ufSk7CmApOwogICAgICB9CiAgICB9CgogICAgcmV0dXJuIHJlc3VsdDsKICB9CgogIC8qKgogICAqIEBpbmhlcml0RG9jCiAgICogQGRlcHJlY2F0ZWQgVXNlIGBzcGFuVG9UcmFjZUhlYWRlcigpYCBpbnN0ZWFkLgogICAqLwogICB0cmFjZUhlYWRlcnMoKSB7CiAgICByZXR1cm4gdGhpcy5fY2FsbEV4dGVuc2lvbk1ldGhvZCgndHJhY2VIZWFkZXJzJyk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqCiAgICogQGRlcHJlY2F0ZWQgVXNlIHRvcCBsZXZlbCBgY2FwdHVyZVNlc3Npb25gIGluc3RlYWQuCiAgICovCiAgIGNhcHR1cmVTZXNzaW9uKGVuZFNlc3Npb24gPSBmYWxzZSkgewogICAgLy8gYm90aCBzZW5kIHRoZSB1cGRhdGUgYW5kIHB1bGwgdGhlIHNlc3Npb24gZnJvbSB0aGUgc2NvcGUKICAgIGlmIChlbmRTZXNzaW9uKSB7CiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgICByZXR1cm4gdGhpcy5lbmRTZXNzaW9uKCk7CiAgICB9CgogICAgLy8gb25seSBzZW5kIHRoZSB1cGRhdGUKICAgIHRoaXMuX3NlbmRTZXNzaW9uVXBkYXRlKCk7CiAgfQoKICAvKioKICAgKiBAaW5oZXJpdERvYwogICAqIEBkZXByZWNhdGVkIFVzZSB0b3AgbGV2ZWwgYGVuZFNlc3Npb25gIGluc3RlYWQuCiAgICovCiAgIGVuZFNlc3Npb24oKSB7CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIGNvbnN0IGxheWVyID0gdGhpcy5nZXRTdGFja1RvcCgpOwogICAgY29uc3Qgc2NvcGUgPSBsYXllci5zY29wZTsKICAgIGNvbnN0IHNlc3Npb24gPSBzY29wZS5nZXRTZXNzaW9uKCk7CiAgICBpZiAoc2Vzc2lvbikgewogICAgICBjbG9zZVNlc3Npb24oc2Vzc2lvbik7CiAgICB9CiAgICB0aGlzLl9zZW5kU2Vzc2lvblVwZGF0ZSgpOwoKICAgIC8vIHRoZSBzZXNzaW9uIGlzIG92ZXI7IHRha2UgaXQgb2ZmIG9mIHRoZSBzY29wZQogICAgc2NvcGUuc2V0U2Vzc2lvbigpOwogIH0KCiAgLyoqCiAgICogQGluaGVyaXREb2MKICAgKiBAZGVwcmVjYXRlZCBVc2UgdG9wIGxldmVsIGBzdGFydFNlc3Npb25gIGluc3RlYWQuCiAgICovCiAgIHN0YXJ0U2Vzc2lvbihjb250ZXh0KSB7CiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24KICAgIGNvbnN0IHsgc2NvcGUsIGNsaWVudCB9ID0gdGhpcy5nZXRTdGFja1RvcCgpOwogICAgY29uc3QgeyByZWxlYXNlLCBlbnZpcm9ubWVudCA9IERFRkFVTFRfRU5WSVJPTk1FTlQgfSA9IChjbGllbnQgJiYgY2xpZW50LmdldE9wdGlvbnMoKSkgfHwge307CgogICAgLy8gV2lsbCBmZXRjaCB1c2VyQWdlbnQgaWYgY2FsbGVkIGZyb20gYnJvd3NlciBzZGsKICAgIGNvbnN0IHsgdXNlckFnZW50IH0gPSBHTE9CQUxfT0JKLm5hdmlnYXRvciB8fCB7fTsKCiAgICBjb25zdCBzZXNzaW9uID0gbWFrZVNlc3Npb24oewogICAgICByZWxlYXNlLAogICAgICBlbnZpcm9ubWVudCwKICAgICAgdXNlcjogc2NvcGUuZ2V0VXNlcigpLAogICAgICAuLi4odXNlckFnZW50ICYmIHsgdXNlckFnZW50IH0pLAogICAgICAuLi5jb250ZXh0LAogICAgfSk7CgogICAgLy8gRW5kIGV4aXN0aW5nIHNlc3Npb24gaWYgdGhlcmUncyBvbmUKICAgIGNvbnN0IGN1cnJlbnRTZXNzaW9uID0gc2NvcGUuZ2V0U2Vzc2lvbiAmJiBzY29wZS5nZXRTZXNzaW9uKCk7CiAgICBpZiAoY3VycmVudFNlc3Npb24gJiYgY3VycmVudFNlc3Npb24uc3RhdHVzID09PSAnb2snKSB7CiAgICAgIHVwZGF0ZVNlc3Npb24oY3VycmVudFNlc3Npb24sIHsgc3RhdHVzOiAnZXhpdGVkJyB9KTsKICAgIH0KICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgdGhpcy5lbmRTZXNzaW9uKCk7CgogICAgLy8gQWZ0ZXJ3YXJkcyB3ZSBzZXQgdGhlIG5ldyBzZXNzaW9uIG9uIHRoZSBzY29wZQogICAgc2NvcGUuc2V0U2Vzc2lvbihzZXNzaW9uKTsKCiAgICByZXR1cm4gc2Vzc2lvbjsKICB9CgogIC8qKgogICAqIFJldHVybnMgaWYgZGVmYXVsdCBQSUkgc2hvdWxkIGJlIHNlbnQgdG8gU2VudHJ5IGFuZCBwcm9wYWdhdGVkIGluIG91cmdvaW5nIHJlcXVlc3RzCiAgICogd2hlbiBUcmFjaW5nIGlzIHVzZWQuCiAgICoKICAgKiBAZGVwcmVjYXRlZCBVc2UgdG9wLWxldmVsIGBnZXRDbGllbnQoKS5nZXRPcHRpb25zKCkuc2VuZERlZmF1bHRQaWlgIGluc3RlYWQuIFRoaXMgZnVuY3Rpb24KICAgKiBvbmx5IHVubmVjZXNzYXJpbHkgaW5jcmVhc2VkIEFQSSBzdXJmYWNlIGJ1dCBvbmx5IHdyYXBwZWQgYWNjZXNzaW5nIHRoZSBvcHRpb24uCiAgICovCiAgIHNob3VsZFNlbmREZWZhdWx0UGlpKCkgewogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICBjb25zdCBjbGllbnQgPSB0aGlzLmdldENsaWVudCgpOwogICAgY29uc3Qgb3B0aW9ucyA9IGNsaWVudCAmJiBjbGllbnQuZ2V0T3B0aW9ucygpOwogICAgcmV0dXJuIEJvb2xlYW4ob3B0aW9ucyAmJiBvcHRpb25zLnNlbmREZWZhdWx0UGlpKTsKICB9CgogIC8qKgogICAqIFNlbmRzIHRoZSBjdXJyZW50IFNlc3Npb24gb24gdGhlIHNjb3BlCiAgICovCiAgIF9zZW5kU2Vzc2lvblVwZGF0ZSgpIHsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgY29uc3QgeyBzY29wZSwgY2xpZW50IH0gPSB0aGlzLmdldFN0YWNrVG9wKCk7CgogICAgY29uc3Qgc2Vzc2lvbiA9IHNjb3BlLmdldFNlc3Npb24oKTsKICAgIGlmIChzZXNzaW9uICYmIGNsaWVudCAmJiBjbGllbnQuY2FwdHVyZVNlc3Npb24pIHsKICAgICAgY2xpZW50LmNhcHR1cmVTZXNzaW9uKHNlc3Npb24pOwogICAgfQogIH0KCiAgLyoqCiAgICogQ2FsbHMgZ2xvYmFsIGV4dGVuc2lvbiBtZXRob2QgYW5kIGJpbmRpbmcgY3VycmVudCBpbnN0YW5jZSB0byB0aGUgZnVuY3Rpb24gY2FsbAogICAqLwogIC8vIEB0cy1leHBlY3QtZXJyb3IgRnVuY3Rpb24gbGFja3MgZW5kaW5nIHJldHVybiBzdGF0ZW1lbnQgYW5kIHJldHVybiB0eXBlIGRvZXMgbm90IGluY2x1ZGUgJ3VuZGVmaW5lZCcuIHRzKDIzNjYpCiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkKICAgX2NhbGxFeHRlbnNpb25NZXRob2QobWV0aG9kLCAuLi5hcmdzKSB7CiAgICBjb25zdCBjYXJyaWVyID0gZ2V0TWFpbkNhcnJpZXIoKTsKICAgIGNvbnN0IHNlbnRyeSA9IGNhcnJpZXIuX19TRU5UUllfXzsKICAgIGlmIChzZW50cnkgJiYgc2VudHJ5LmV4dGVuc2lvbnMgJiYgdHlwZW9mIHNlbnRyeS5leHRlbnNpb25zW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHsKICAgICAgcmV0dXJuIHNlbnRyeS5leHRlbnNpb25zW21ldGhvZF0uYXBwbHkodGhpcywgYXJncyk7CiAgICB9CiAgICBERUJVR19CVUlMRCAmJiBsb2dnZXIud2FybihgRXh0ZW5zaW9uIG1ldGhvZCAke21ldGhvZH0gY291bGRuJ3QgYmUgZm91bmQsIGRvaW5nIG5vdGhpbmcuYCk7CiAgfQp9CgovKioKICogUmV0dXJucyB0aGUgZ2xvYmFsIHNoaW0gcmVnaXN0cnkuCiAqCiAqIEZJWE1FOiBUaGlzIGZ1bmN0aW9uIGlzIHByb2JsZW1hdGljLCBiZWNhdXNlIGRlc3BpdGUgYWx3YXlzIHJldHVybmluZyBhIHZhbGlkIENhcnJpZXIsCiAqIGl0IGhhcyBhbiBvcHRpb25hbCBgX19TRU5UUllfX2AgcHJvcGVydHksIHdoaWNoIHRoZW4gaW4gdHVybiByZXF1aXJlcyB1cyB0byBhbHdheXMgcGVyZm9ybSBhbiB1bm5lY2Vzc2FyeSBjaGVjawogKiBhdCB0aGUgY2FsbC1zaXRlLiBXZSBhbHdheXMgYWNjZXNzIHRoZSBjYXJyaWVyIHRocm91Z2ggdGhpcyBmdW5jdGlvbiwgc28gd2UgY2FuIGd1YXJhbnRlZSB0aGF0IGBfX1NFTlRSWV9fYCBpcyB0aGVyZS4KICoqLwpmdW5jdGlvbiBnZXRNYWluQ2FycmllcigpIHsKICBHTE9CQUxfT0JKLl9fU0VOVFJZX18gPSBHTE9CQUxfT0JKLl9fU0VOVFJZX18gfHwgewogICAgZXh0ZW5zaW9uczoge30sCiAgICBodWI6IHVuZGVmaW5lZCwKICB9OwogIHJldHVybiBHTE9CQUxfT0JKOwp9CgovKioKICogUmVwbGFjZXMgdGhlIGN1cnJlbnQgbWFpbiBodWIgd2l0aCB0aGUgcGFzc2VkIG9uZSBvbiB0aGUgZ2xvYmFsIG9iamVjdAogKgogKiBAcmV0dXJucyBUaGUgb2xkIHJlcGxhY2VkIGh1YgogKgogKiBAZGVwcmVjYXRlZCBVc2UgYHNldEN1cnJlbnRDbGllbnQoKWAgaW5zdGVhZC4KICovCi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgpmdW5jdGlvbiBtYWtlTWFpbihodWIpIHsKICBjb25zdCByZWdpc3RyeSA9IGdldE1haW5DYXJyaWVyKCk7CiAgY29uc3Qgb2xkSHViID0gZ2V0SHViRnJvbUNhcnJpZXIocmVnaXN0cnkpOwogIHNldEh1Yk9uQ2FycmllcihyZWdpc3RyeSwgaHViKTsKICByZXR1cm4gb2xkSHViOwp9CgovKioKICogUmV0dXJucyB0aGUgZGVmYXVsdCBodWIgaW5zdGFuY2UuCiAqCiAqIElmIGEgaHViIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCBpbiB0aGUgZ2xvYmFsIGNhcnJpZXIgYnV0IHRoaXMgbW9kdWxlCiAqIGNvbnRhaW5zIGEgbW9yZSByZWNlbnQgdmVyc2lvbiwgaXQgcmVwbGFjZXMgdGhlIHJlZ2lzdGVyZWQgdmVyc2lvbi4KICogT3RoZXJ3aXNlLCB0aGUgY3VycmVudGx5IHJlZ2lzdGVyZWQgaHViIHdpbGwgYmUgcmV0dXJuZWQuCiAqCiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgcmVzcGVjdGl2ZSByZXBsYWNlbWVudCBtZXRob2QgZGlyZWN0bHkgaW5zdGVhZC4KICovCi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgpmdW5jdGlvbiBnZXRDdXJyZW50SHViKCkgewogIC8vIEdldCBtYWluIGNhcnJpZXIgKGdsb2JhbCBmb3IgZXZlcnkgZW52aXJvbm1lbnQpCiAgY29uc3QgcmVnaXN0cnkgPSBnZXRNYWluQ2FycmllcigpOwoKICBpZiAocmVnaXN0cnkuX19TRU5UUllfXyAmJiByZWdpc3RyeS5fX1NFTlRSWV9fLmFjcykgewogICAgY29uc3QgaHViID0gcmVnaXN0cnkuX19TRU5UUllfXy5hY3MuZ2V0Q3VycmVudEh1YigpOwoKICAgIGlmIChodWIpIHsKICAgICAgcmV0dXJuIGh1YjsKICAgIH0KICB9CgogIC8vIFJldHVybiBodWIgdGhhdCBsaXZlcyBvbiBhIGdsb2JhbCBvYmplY3QKICByZXR1cm4gZ2V0R2xvYmFsSHViKHJlZ2lzdHJ5KTsKfQoKLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCmZ1bmN0aW9uIGdldEdsb2JhbEh1YihyZWdpc3RyeSA9IGdldE1haW5DYXJyaWVyKCkpIHsKICAvLyBJZiB0aGVyZSdzIG5vIGh1Yiwgb3IgaXRzIGFuIG9sZCBBUEksIGFzc2lnbiBhIG5ldyBvbmUKCiAgaWYgKAogICAgIWhhc0h1Yk9uQ2FycmllcihyZWdpc3RyeSkgfHwKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgogICAgZ2V0SHViRnJvbUNhcnJpZXIocmVnaXN0cnkpLmlzT2xkZXJUaGFuKEFQSV9WRVJTSU9OKQogICkgewogICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgICBzZXRIdWJPbkNhcnJpZXIocmVnaXN0cnksIG5ldyBIdWIoKSk7CiAgfQoKICAvLyBSZXR1cm4gaHViIHRoYXQgbGl2ZXMgb24gYSBnbG9iYWwgb2JqZWN0CiAgcmV0dXJuIGdldEh1YkZyb21DYXJyaWVyKHJlZ2lzdHJ5KTsKfQoKLyoqCiAqIFRoaXMgd2lsbCB0ZWxsIHdoZXRoZXIgYSBjYXJyaWVyIGhhcyBhIGh1YiBvbiBpdCBvciBub3QKICogQHBhcmFtIGNhcnJpZXIgb2JqZWN0CiAqLwpmdW5jdGlvbiBoYXNIdWJPbkNhcnJpZXIoY2FycmllcikgewogIHJldHVybiAhIShjYXJyaWVyICYmIGNhcnJpZXIuX19TRU5UUllfXyAmJiBjYXJyaWVyLl9fU0VOVFJZX18uaHViKTsKfQoKLyoqCiAqIFRoaXMgd2lsbCBjcmVhdGUgYSBuZXcge0BsaW5rIEh1Yn0gYW5kIGFkZCB0byB0aGUgcGFzc2VkIG9iamVjdCBvbgogKiBfX1NFTlRSWV9fLmh1Yi4KICogQHBhcmFtIGNhcnJpZXIgb2JqZWN0CiAqIEBoaWRkZW4KICovCi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgpmdW5jdGlvbiBnZXRIdWJGcm9tQ2FycmllcihjYXJyaWVyKSB7CiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uCiAgcmV0dXJuIGdldEdsb2JhbFNpbmdsZXRvbignaHViJywgKCkgPT4gbmV3IEh1YigpLCBjYXJyaWVyKTsKfQoKLyoqCiAqIFRoaXMgd2lsbCBzZXQgcGFzc2VkIHtAbGluayBIdWJ9IG9uIHRoZSBwYXNzZWQgb2JqZWN0J3MgX19TRU5UUllfXy5odWIgYXR0cmlidXRlCiAqIEBwYXJhbSBjYXJyaWVyIG9iamVjdAogKiBAcGFyYW0gaHViIEh1YgogKiBAcmV0dXJucyBBIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmUKICovCi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbgpmdW5jdGlvbiBzZXRIdWJPbkNhcnJpZXIoY2FycmllciwgaHViKSB7CiAgaWYgKCFjYXJyaWVyKSByZXR1cm4gZmFsc2U7CiAgY29uc3QgX19TRU5UUllfXyA9IChjYXJyaWVyLl9fU0VOVFJZX18gPSBjYXJyaWVyLl9fU0VOVFJZX18gfHwge30pOwogIF9fU0VOVFJZX18uaHViID0gaHViOwogIHJldHVybiB0cnVlOwp9CgovKioKICogQXBwbHkgU2RrSW5mbyAobmFtZSwgdmVyc2lvbiwgcGFja2FnZXMsIGludGVncmF0aW9ucykgdG8gdGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQga2V5LgogKiBNZXJnZSB3aXRoIGV4aXN0aW5nIGRhdGEgaWYgYW55LgogKiovCmZ1bmN0aW9uIGVuaGFuY2VFdmVudFdpdGhTZGtJbmZvKGV2ZW50LCBzZGtJbmZvKSB7CiAgaWYgKCFzZGtJbmZvKSB7CiAgICByZXR1cm4gZXZlbnQ7CiAgfQogIGV2ZW50LnNkayA9IGV2ZW50LnNkayB8fCB7fTsKICBldmVudC5zZGsubmFtZSA9IGV2ZW50LnNkay5uYW1lIHx8IHNka0luZm8ubmFtZTsKICBldmVudC5zZGsudmVyc2lvbiA9IGV2ZW50LnNkay52ZXJzaW9uIHx8IHNka0luZm8udmVyc2lvbjsKICBldmVudC5zZGsuaW50ZWdyYXRpb25zID0gWy4uLihldmVudC5zZGsuaW50ZWdyYXRpb25zIHx8IFtdKSwgLi4uKHNka0luZm8uaW50ZWdyYXRpb25zIHx8IFtdKV07CiAgZXZlbnQuc2RrLnBhY2thZ2VzID0gWy4uLihldmVudC5zZGsucGFja2FnZXMgfHwgW10pLCAuLi4oc2RrSW5mby5wYWNrYWdlcyB8fCBbXSldOwogIHJldHVybiBldmVudDsKfQoKLyoqIENyZWF0ZXMgYW4gZW52ZWxvcGUgZnJvbSBhIFNlc3Npb24gKi8KZnVuY3Rpb24gY3JlYXRlU2Vzc2lvbkVudmVsb3BlKAogIHNlc3Npb24sCiAgZHNuLAogIG1ldGFkYXRhLAogIHR1bm5lbCwKKSB7CiAgY29uc3Qgc2RrSW5mbyA9IGdldFNka01ldGFkYXRhRm9yRW52ZWxvcGVIZWFkZXIobWV0YWRhdGEpOwogIGNvbnN0IGVudmVsb3BlSGVhZGVycyA9IHsKICAgIHNlbnRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSwKICAgIC4uLihzZGtJbmZvICYmIHsgc2RrOiBzZGtJbmZvIH0pLAogICAgLi4uKCEhdHVubmVsICYmIGRzbiAmJiB7IGRzbjogZHNuVG9TdHJpbmcoZHNuKSB9KSwKICB9OwoKICBjb25zdCBlbnZlbG9wZUl0ZW0gPQogICAgJ2FnZ3JlZ2F0ZXMnIGluIHNlc3Npb24gPyBbeyB0eXBlOiAnc2Vzc2lvbnMnIH0sIHNlc3Npb25dIDogW3sgdHlwZTogJ3Nlc3Npb24nIH0sIHNlc3Npb24udG9KU09OKCldOwoKICByZXR1cm4gY3JlYXRlRW52ZWxvcGUoZW52ZWxvcGVIZWFkZXJzLCBbZW52ZWxvcGVJdGVtXSk7Cn0KCi8qKgogKiBDcmVhdGUgYW4gRW52ZWxvcGUgZnJvbSBhbiBldmVudC4KICovCmZ1bmN0aW9uIGNyZWF0ZUV2ZW50RW52ZWxvcGUoCiAgZXZlbnQsCiAgZHNuLAogIG1ldGFkYXRhLAogIHR1bm5lbCwKKSB7CiAgY29uc3Qgc2RrSW5mbyA9IGdldFNka01ldGFkYXRhRm9yRW52ZWxvcGVIZWFkZXIobWV0YWRhdGEpOwoKICAvKgogICAgTm90ZTogRHVlIHRvIFRTLCBldmVudC50eXBlIG1heSBiZSBgcmVwbGF5X2V2ZW50YCwgdGhlb3JldGljYWxseS4KICAgIEluIHByYWN0aWNlLCB3ZSBuZXZlciBjYWxsIGBjcmVhdGVFdmVudEVudmVsb3BlYCB3aXRoIGByZXBsYXlfZXZlbnRgIHR5cGUsCiAgICBhbmQgd2UnZCBoYXZlIHRvIGFkanV0IGEgbG9vb3Qgb2YgdHlwZXMgdG8gbWFrZSB0aGlzIHdvcmsgcHJvcGVybHkuCiAgICBXZSB3YW50IHRvIGF2b2lkIGNhc3RpbmcgdGhpcyBhcm91bmQsIGFzIHRoYXQgY291bGQgbGVhZCB0byBidWdzIChlLmcuIHdoZW4gd2UgYWRkIGFub3RoZXIgdHlwZSkKICAgIFNvIHRoZSBzYWZlIGNob2ljZSBpcyB0byByZWFsbHkgZ3VhcmQgYWdhaW5zdCB0aGUgcmVwbGF5X2V2ZW50IHR5cGUgaGVyZS4KICAqLwogIGNvbnN0IGV2ZW50VHlwZSA9IGV2ZW50LnR5cGUgJiYgZXZlbnQudHlwZSAhPT0gJ3JlcGxheV9ldmVudCcgPyBldmVudC50eXBlIDogJ2V2ZW50JzsKCiAgZW5oYW5jZUV2ZW50V2l0aFNka0luZm8oZXZlbnQsIG1ldGFkYXRhICYmIG1ldGFkYXRhLnNkayk7CgogIGNvbnN0IGVudmVsb3BlSGVhZGVycyA9IGNyZWF0ZUV2ZW50RW52ZWxvcGVIZWFkZXJzKGV2ZW50LCBzZGtJbmZvLCB0dW5uZWwsIGRzbik7CgogIC8vIFByZXZlbnQgdGhpcyBkYXRhICh3aGljaCwgaWYgaXQgZXhpc3RzLCB3YXMgdXNlZCBpbiBlYXJsaWVyIHN0ZXBzIGluIHRoZSBwcm9jZXNzaW5nIHBpcGVsaW5lKSBmcm9tIGJlaW5nIHNlbnQgdG8KICAvLyBzZW50cnkuIChOb3RlOiBPdXIgdXNlIG9mIHRoaXMgcHJvcGVydHkgY29tZXMgYW5kIGdvZXMgd2l0aCB3aGF0ZXZlciB3ZSBtaWdodCBiZSBkZWJ1Z2dpbmcsIHdoYXRldmVyIGhhY2tzIHdlIG1heQogIC8vIGhhdmUgdGVtcG9yYXJpbHkgYWRkZWQsIGV0Yy4gRXZlbiBpZiB3ZSBkb24ndCBoYXBwZW4gdG8gYmUgdXNpbmcgaXQgYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLCBsZXQncyBub3QgZ2V0IHJpZAogIC8vIG9mIHRoaXMgYGRlbGV0ZWAsIGxlc3Qgd2UgbWlzcyBwdXR0aW5nIGl0IGJhY2sgaW4gdGhlIG5leHQgdGltZSB0aGUgcHJvcGVydHkgaXMgaW4gdXNlLikKICBkZWxldGUgZXZlbnQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhOwoKICBjb25zdCBldmVudEl0ZW0gPSBbeyB0eXBlOiBldmVudFR5cGUgfSwgZXZlbnRdOwogIHJldHVybiBjcmVhdGVFbnZlbG9wZShlbnZlbG9wZUhlYWRlcnMsIFtldmVudEl0ZW1dKTsKfQoKY29uc3QgU0VOVFJZX0FQSV9WRVJTSU9OID0gJzcnOwoKLyoqIFJldHVybnMgdGhlIHByZWZpeCB0byBjb25zdHJ1Y3QgU2VudHJ5IGluZ2VzdGlvbiBBUEkgZW5kcG9pbnRzLiAqLwpmdW5jdGlvbiBnZXRCYXNlQXBpRW5kcG9pbnQoZHNuKSB7CiAgY29uc3QgcHJvdG9jb2wgPSBkc24ucHJvdG9jb2wgPyBgJHtkc24ucHJvdG9jb2x9OmAgOiAnJzsKICBjb25zdCBwb3J0ID0gZHNuLnBvcnQgPyBgOiR7ZHNuLnBvcnR9YCA6ICcnOwogIHJldHVybiBgJHtwcm90b2NvbH0vLyR7ZHNuLmhvc3R9JHtwb3J0fSR7ZHNuLnBhdGggPyBgLyR7ZHNuLnBhdGh9YCA6ICcnfS9hcGkvYDsKfQoKLyoqIFJldHVybnMgdGhlIGluZ2VzdCBBUEkgZW5kcG9pbnQgZm9yIHRhcmdldC4gKi8KZnVuY3Rpb24gX2dldEluZ2VzdEVuZHBvaW50KGRzbikgewogIHJldHVybiBgJHtnZXRCYXNlQXBpRW5kcG9pbnQoZHNuKX0ke2Rzbi5wcm9qZWN0SWR9L2VudmVsb3BlL2A7Cn0KCi8qKiBSZXR1cm5zIGEgVVJMLWVuY29kZWQgc3RyaW5nIHdpdGggYXV0aCBjb25maWcgc3VpdGFibGUgZm9yIGEgcXVlcnkgc3RyaW5nLiAqLwpmdW5jdGlvbiBfZW5jb2RlZEF1dGgoZHNuLCBzZGtJbmZvKSB7CiAgcmV0dXJuIHVybEVuY29kZSh7CiAgICAvLyBXZSBzZW5kIG9ubHkgdGhlIG1pbmltdW0gc2V0IG9mIHJlcXVpcmVkIGluZm9ybWF0aW9uLiBTZWUKICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9nZXRzZW50cnkvc2VudHJ5LWphdmFzY3JpcHQvaXNzdWVzLzI1NzIuCiAgICBzZW50cnlfa2V5OiBkc24ucHVibGljS2V5LAogICAgc2VudHJ5X3ZlcnNpb246IFNFTlRSWV9BUElfVkVSU0lPTiwKICAgIC4uLihzZGtJbmZvICYmIHsgc2VudHJ5X2NsaWVudDogYCR7c2RrSW5mby5uYW1lfS8ke3Nka0luZm8udmVyc2lvbn1gIH0pLAogIH0pOwp9CgovKioKICogUmV0dXJucyB0aGUgZW52ZWxvcGUgZW5kcG9pbnQgVVJMIHdpdGggYXV0aCBpbiB0aGUgcXVlcnkgc3RyaW5nLgogKgogKiBTZW5kaW5nIGF1dGggYXMgcGFydCBvZiB0aGUgcXVlcnkgc3RyaW5nIGFuZCBub3QgYXMgY3VzdG9tIEhUVFAgaGVhZGVycyBhdm9pZHMgQ09SUyBwcmVmbGlnaHQgcmVxdWVzdHMuCiAqLwpmdW5jdGlvbiBnZXRFbnZlbG9wZUVuZHBvaW50V2l0aFVybEVuY29kZWRBdXRoKAogIGRzbiwKICAvLyBUT0RPICh2OCk6IFJlbW92ZSBgdHVubmVsT3JPcHRpb25zYCBpbiBmYXZvciBvZiBgb3B0aW9uc2AsIGFuZCB1c2UgdGhlIHN1YnN0aXR1dGUgY29kZSBiZWxvdwogIC8vIG9wdGlvbnM6IENsaWVudE9wdGlvbnMgPSB7fSBhcyBDbGllbnRPcHRpb25zLAogIHR1bm5lbE9yT3B0aW9ucyA9IHt9ICwKKSB7CiAgLy8gVE9ETyAodjgpOiBVc2UgdGhpcyBjb2RlIGluc3RlYWQKICAvLyBjb25zdCB7IHR1bm5lbCwgX21ldGFkYXRhID0ge30gfSA9IG9wdGlvbnM7CiAgLy8gcmV0dXJuIHR1bm5lbCA/IHR1bm5lbCA6IGAke19nZXRJbmdlc3RFbmRwb2ludChkc24pfT8ke19lbmNvZGVkQXV0aChkc24sIF9tZXRhZGF0YS5zZGspfWA7CgogIGNvbnN0IHR1bm5lbCA9IHR5cGVvZiB0dW5uZWxPck9wdGlvbnMgPT09ICdzdHJpbmcnID8gdHVubmVsT3JPcHRpb25zIDogdHVubmVsT3JPcHRpb25zLnR1bm5lbDsKICBjb25zdCBzZGtJbmZvID0KICAgIHR5cGVvZiB0dW5uZWxPck9wdGlvbnMgPT09ICdzdHJpbmcnIHx8ICF0dW5uZWxPck9wdGlvbnMuX21ldGFkYXRhID8gdW5kZWZpbmVkIDogdHVubmVsT3JPcHRpb25zLl9tZXRhZGF0YS5zZGs7CgogIHJldHVybiB0dW5uZWwgPyB0dW5uZWwgOiBgJHtfZ2V0SW5nZXN0RW5kcG9pbnQoZHNuKX0/JHtfZW5jb2RlZEF1dGgoZHNuLCBzZGtJbmZvKX1gOwp9Cgpjb25zdCBERUZBVUxUX1RSQU5TUE9SVF9CVUZGRVJfU0laRSA9IDMwOwoKLyoqCiAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgYSBTZW50cnkgYFRyYW5zcG9ydGAKICoKICogQHBhcmFtIG9wdGlvbnMKICogQHBhcmFtIG1ha2VSZXF1ZXN0CiAqLwpmdW5jdGlvbiBjcmVhdGVUcmFuc3BvcnQoCiAgb3B0aW9ucywKICBtYWtlUmVxdWVzdCwKICBidWZmZXIgPSBtYWtlUHJvbWlzZUJ1ZmZlcigKICAgIG9wdGlvbnMuYnVmZmVyU2l6ZSB8fCBERUZBVUxUX1RSQU5TUE9SVF9CVUZGRVJfU0laRSwKICApLAopIHsKICBsZXQgcmF0ZUxpbWl0cyA9IHt9OwogIGNvbnN0IGZsdXNoID0gKHRpbWVvdXQpID0+IGJ1ZmZlci5kcmFpbih0aW1lb3V0KTsKCiAgZnVuY3Rpb24gc2VuZChlbnZlbG9wZSkgewogICAgY29uc3QgZmlsdGVyZWRFbnZlbG9wZUl0ZW1zID0gW107CgogICAgLy8gRHJvcCByYXRlIGxpbWl0ZWQgaXRlbXMgZnJvbSBlbnZlbG9wZQogICAgZm9yRWFjaEVudmVsb3BlSXRlbShlbnZlbG9wZSwgKGl0ZW0sIHR5cGUpID0+IHsKICAgICAgY29uc3QgZGF0YUNhdGVnb3J5ID0gZW52ZWxvcGVJdGVtVHlwZVRvRGF0YUNhdGVnb3J5KHR5cGUpOwogICAgICBpZiAoaXNSYXRlTGltaXRlZChyYXRlTGltaXRzLCBkYXRhQ2F0ZWdvcnkpKSB7CiAgICAgICAgY29uc3QgZXZlbnQgPSBnZXRFdmVudEZvckVudmVsb3BlSXRlbShpdGVtLCB0eXBlKTsKICAgICAgICBvcHRpb25zLnJlY29yZERyb3BwZWRFdmVudCgncmF0ZWxpbWl0X2JhY2tvZmYnLCBkYXRhQ2F0ZWdvcnksIGV2ZW50KTsKICAgICAgfSBlbHNlIHsKICAgICAgICBmaWx0ZXJlZEVudmVsb3BlSXRlbXMucHVzaChpdGVtKTsKICAgICAgfQogICAgfSk7CgogICAgLy8gU2tpcCBzZW5kaW5nIGlmIGVudmVsb3BlIGlzIGVtcHR5IGFmdGVyIGZpbHRlcmluZyBvdXQgcmF0ZSBsaW1pdGVkIGV2ZW50cwogICAgaWYgKGZpbHRlcmVkRW52ZWxvcGVJdGVtcy5sZW5ndGggPT09IDApIHsKICAgICAgcmV0dXJuIHJlc29sdmVkU3luY1Byb21pc2UoKTsKICAgIH0KCiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueQogICAgY29uc3QgZmlsdGVyZWRFbnZlbG9wZSA9IGNyZWF0ZUVudmVsb3BlKGVudmVsb3BlWzBdLCBmaWx0ZXJlZEVudmVsb3BlSXRlbXMgKTsKCiAgICAvLyBDcmVhdGVzIGNsaWVudCByZXBvcnQgZm9yIGVhY2ggaXRlbSBpbiBhbiBlbnZlbG9wZQogICAgY29uc3QgcmVjb3JkRW52ZWxvcGVMb3NzID0gKHJlYXNvbikgPT4gewogICAgICBmb3JFYWNoRW52ZWxvcGVJdGVtKGZpbHRlcmVkRW52ZWxvcGUsIChpdGVtLCB0eXBlKSA9PiB7CiAgICAgICAgY29uc3QgZXZlbnQgPSBnZXRFdmVudEZvckVudmVsb3BlSXRlbShpdGVtLCB0eXBlKTsKICAgICAgICBvcHRpb25zLnJlY29yZERyb3BwZWRFdmVudChyZWFzb24sIGVudmVsb3BlSXRlbVR5cGVUb0RhdGFDYXRlZ29yeSh0eXBlKSwgZXZlbnQpOwogICAgICB9KTsKICAgIH07CgogICAgY29uc3QgcmVxdWVzdFRhc2sgPSAoKSA9PgogICAgICBtYWtlUmVxdWVzdCh7IGJvZHk6IHNlcmlhbGl6ZUVudmVsb3BlKGZpbHRlcmVkRW52ZWxvcGUsIG9wdGlvbnMudGV4dEVuY29kZXIpIH0pLnRoZW4oCiAgICAgICAgcmVzcG9uc2UgPT4gewogICAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byB0aHJvdyBvbiBOT0sgcmVzcG9uc2VzLCBidXQgd2Ugd2FudCB0byBhdCBsZWFzdCBsb2cgdGhlbQogICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IHVuZGVmaW5lZCAmJiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA8IDIwMCB8fCByZXNwb25zZS5zdGF0dXNDb2RlID49IDMwMCkpIHsKICAgICAgICAgICAgREVCVUdfQlVJTEQgJiYgbG9nZ2VyLndhcm4oYFNlbnRyeSByZXNwb25kZWQgd2l0aCBzdGF0dXMgY29kZSAke3Jlc3BvbnNlLnN0YXR1c0NvZGV9IHRvIHNlbnQgZXZlbnQuYCk7CiAgICAgICAgICB9CgogICAgICAgICAgcmF0ZUxpbWl0cyA9IHVwZGF0ZVJhdGVMaW1pdHMocmF0ZUxpbWl0cywgcmVzcG9uc2UpOwogICAgICAgICAgcmV0dXJuIHJlc3BvbnNlOwogICAgICAgIH0sCiAgICAgICAgZXJyb3IgPT4gewogICAgICAgICAgcmVjb3JkRW52ZWxvcGVMb3NzKCduZXR3b3JrX2Vycm9yJyk7CiAgICAgICAgICB0aHJvdyBlcnJvcjsKICAgICAgICB9LAogICAgICApOwoKICAgIHJldHVybiBidWZmZXIuYWRkKHJlcXVlc3RUYXNrKS50aGVuKAogICAgICByZXN1bHQgPT4gcmVzdWx0LAogICAgICBlcnJvciA9PiB7CiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgU2VudHJ5RXJyb3IpIHsKICAgICAgICAgIERFQlVHX0JVSUxEICYmIGxvZ2dlci5lcnJvcignU2tpcHBlZCBzZW5kaW5nIGV2ZW50IGJlY2F1c2UgYnVmZmVyIGlzIGZ1bGwuJyk7CiAgICAgICAgICByZWNvcmRFbnZlbG9wZUxvc3MoJ3F1ZXVlX292ZXJmbG93Jyk7CiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRTeW5jUHJvbWlzZSgpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICB0aHJvdyBlcnJvcjsKICAgICAgICB9CiAgICAgIH0sCiAgICApOwogIH0KCiAgLy8gV2UgdXNlIHRoaXMgdG8gaWRlbnRpZmlmeSBpZiB0aGUgdHJhbnNwb3J0IGlzIHRoZSBiYXNlIHRyYW5zcG9ydAogIC8vIFRPRE8gKHY4KTogUmVtb3ZlIHRoaXMgYWdhaW4gYXMgd2UnbGwgbm8gbG9uZ2VyIG5lZWQgaXQKICBzZW5kLl9fc2VudHJ5X19iYXNlVHJhbnNwb3J0X18gPSB0cnVlOwoKICByZXR1cm4gewogICAgc2VuZCwKICAgIGZsdXNoLAogIH07Cn0KCmZ1bmN0aW9uIGdldEV2ZW50Rm9yRW52ZWxvcGVJdGVtKGl0ZW0sIHR5cGUpIHsKICBpZiAodHlwZSAhPT0gJ2V2ZW50JyAmJiB0eXBlICE9PSAndHJhbnNhY3Rpb24nKSB7CiAgICByZXR1cm4gdW5kZWZpbmVkOwogIH0KCiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbSkgPyAoaXRlbSApWzFdIDogdW5kZWZpbmVkOwp9CgovKiogbm9ybWFsaXplcyBXaW5kb3dzIHBhdGhzICovCmZ1bmN0aW9uIG5vcm1hbGl6ZVdpbmRvd3NQYXRoKHBhdGgpIHsKICByZXR1cm4gcGF0aAogICAgLnJlcGxhY2UoL15bQS1aXTovLCAnJykgLy8gcmVtb3ZlIFdpbmRvd3Mtc3R5bGUgcHJlZml4CiAgICAucmVwbGFjZSgvXFwvZywgJy8nKTsgLy8gcmVwbGFjZSBhbGwgYFxgIGluc3RhbmNlcyB3aXRoIGAvYAp9CgovKiogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyB0aGUgbW9kdWxlIG5hbWUgZnJvbSBhIGZpbGVuYW1lICovCmZ1bmN0aW9uIGNyZWF0ZUdldE1vZHVsZUZyb21GaWxlbmFtZSgKICBiYXNlUGF0aCA9IHByb2Nlc3MuYXJndlsxXSA/IGRpcm5hbWUocHJvY2Vzcy5hcmd2WzFdKSA6IHByb2Nlc3MuY3dkKCksCiAgaXNXaW5kb3dzID0gc2VwID09PSAnXFwnLAopIHsKICBjb25zdCBub3JtYWxpemVkQmFzZSA9IGlzV2luZG93cyA/IG5vcm1hbGl6ZVdpbmRvd3NQYXRoKGJhc2VQYXRoKSA6IGJhc2VQYXRoOwoKICByZXR1cm4gKGZpbGVuYW1lKSA9PiB7CiAgICBpZiAoIWZpbGVuYW1lKSB7CiAgICAgIHJldHVybjsKICAgIH0KCiAgICBjb25zdCBub3JtYWxpemVkRmlsZW5hbWUgPSBpc1dpbmRvd3MgPyBub3JtYWxpemVXaW5kb3dzUGF0aChmaWxlbmFtZSkgOiBmaWxlbmFtZTsKCiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0CiAgICBsZXQgeyBkaXIsIGJhc2U6IGZpbGUsIGV4dCB9ID0gcG9zaXgucGFyc2Uobm9ybWFsaXplZEZpbGVuYW1lKTsKCiAgICBpZiAoZXh0ID09PSAnLmpzJyB8fCBleHQgPT09ICcubWpzJyB8fCBleHQgPT09ICcuY2pzJykgewogICAgICBmaWxlID0gZmlsZS5zbGljZSgwLCBleHQubGVuZ3RoICogLTEpOwogICAgfQoKICAgIGlmICghZGlyKSB7CiAgICAgIC8vIE5vIGRpcm5hbWUgd2hhdHNvZXZlcgogICAgICBkaXIgPSAnLic7CiAgICB9CgogICAgY29uc3QgbiA9IGRpci5sYXN0SW5kZXhPZignL25vZGVfbW9kdWxlcycpOwogICAgaWYgKG4gPiAtMSkgewogICAgICByZXR1cm4gYCR7ZGlyLnNsaWNlKG4gKyAxNCkucmVwbGFjZSgvXC8vZywgJy4nKX06JHtmaWxlfWA7CiAgICB9CgogICAgLy8gTGV0J3Mgc2VlIGlmIGl0J3MgYSBwYXJ0IG9mIHRoZSBtYWluIG1vZHVsZQogICAgLy8gVG8gYmUgYSBwYXJ0IG9mIG1haW4gbW9kdWxlLCBpdCBoYXMgdG8gc2hhcmUgdGhlIHNhbWUgYmFzZQogICAgaWYgKGRpci5zdGFydHNXaXRoKG5vcm1hbGl6ZWRCYXNlKSkgewogICAgICBsZXQgbW9kdWxlTmFtZSA9IGRpci5zbGljZShub3JtYWxpemVkQmFzZS5sZW5ndGggKyAxKS5yZXBsYWNlKC9cLy9nLCAnLicpOwoKICAgICAgaWYgKG1vZHVsZU5hbWUpIHsKICAgICAgICBtb2R1bGVOYW1lICs9ICc6JzsKICAgICAgfQogICAgICBtb2R1bGVOYW1lICs9IGZpbGU7CgogICAgICByZXR1cm4gbW9kdWxlTmFtZTsKICAgIH0KCiAgICByZXR1cm4gZmlsZTsKICB9Owp9CgpmdW5jdGlvbiBfbnVsbGlzaENvYWxlc2NlJDIobGhzLCByaHNGbikgeyBpZiAobGhzICE9IG51bGwpIHsgcmV0dXJuIGxoczsgfSBlbHNlIHsgcmV0dXJuIHJoc0ZuKCk7IH0gfS8qKgogKiBUaGlzIGNvZGUgd2FzIG9yaWdpbmFsbHkgZm9ya2VkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL1Rvb1RhbGxOYXRlL3Byb3h5LWFnZW50cy90cmVlL2IxMzMyOTVmZDE2ZjY0NzU1NzhiNmIxNWJkOWI0ZTMzZWNiMGQwYjcKICogV2l0aCB0aGUgZm9sbG93aW5nIGxpY2VuY2U6CiAqCiAqIChUaGUgTUlUIExpY2Vuc2UpCiAqCiAqIENvcHlyaWdodCAoYykgMjAxMyBOYXRoYW4gUmFqbGljaCA8bmF0aGFuQHRvb3RhbGxuYXRlLm5ldD4qCiAqCiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZwogKiBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUKICogJ1NvZnR3YXJlJyksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZwogKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsCiAqIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0bwogKiBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8KICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOioKICoKICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUKICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuKgogKgogKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwKICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GCiAqIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4KICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkKICogQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwKICogVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUKICogU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuCiAqLwoKY29uc3QgSU5URVJOQUwgPSBTeW1ib2woJ0FnZW50QmFzZUludGVybmFsU3RhdGUnKTsKCmNsYXNzIEFnZW50IGV4dGVuZHMgaHR0cC5BZ2VudCB7CgogIC8vIFNldCBieSBgaHR0cC5BZ2VudGAgLSBtaXNzaW5nIGZyb20gYEB0eXBlcy9ub2RlYAoKICBjb25zdHJ1Y3RvcihvcHRzKSB7CiAgICBzdXBlcihvcHRzKTsKICAgIHRoaXNbSU5URVJOQUxdID0ge307CiAgfQoKICAvKioKICAgKiBEZXRlcm1pbmUgd2hldGhlciB0aGlzIGlzIGFuIGBodHRwYCBvciBgaHR0cHNgIHJlcXVlc3QuCiAgICovCiAgaXNTZWN1cmVFbmRwb2ludChvcHRpb25zKSB7CiAgICBpZiAob3B0aW9ucykgewogICAgICAvLyBGaXJzdCBjaGVjayB0aGUgYHNlY3VyZUVuZHBvaW50YCBwcm9wZXJ0eSBleHBsaWNpdGx5LCBzaW5jZSB0aGlzCiAgICAgIC8vIG1lYW5zIHRoYXQgYSBwYXJlbnQgYEFnZW50YCBpcyAicGFzc2luZyB0aHJvdWdoIiB0byB0aGlzIGluc3RhbmNlLgogICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueSwgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1tZW1iZXItYWNjZXNzCiAgICAgIGlmICh0eXBlb2YgKG9wdGlvbnMgKS5zZWN1cmVFbmRwb2ludCA9PT0gJ2Jvb2xlYW4nKSB7CiAgICAgICAgcmV0dXJuIG9wdGlvbnMuc2VjdXJlRW5kcG9pbnQ7CiAgICAgIH0KCiAgICAgIC8vIElmIG5vIGV4cGxpY2l0IGBzZWN1cmVgIGVuZHBvaW50LCBjaGVjayBpZiBgcHJvdG9jb2xgIHByb3BlcnR5IGlzCiAgICAgIC8vIHNldC4gVGhpcyB3aWxsIHVzdWFsbHkgYmUgdGhlIGNhc2Ugc2luY2UgdXNpbmcgYSBmdWxsIHN0cmluZyBVUkwKICAgICAgLy8gb3IgYFVSTGAgaW5zdGFuY2Ugc2hvdWxkIGJlIHRoZSBtb3N0IGNvbW1vbiB1c2FnZS4KICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnByb3RvY29sID09PSAnc3RyaW5nJykgewogICAgICAgIHJldHVybiBvcHRpb25zLnByb3RvY29sID09PSAnaHR0cHM6JzsKICAgICAgfQogICAgfQoKICAgIC8vIEZpbmFsbHksIGlmIG5vIGBwcm90b2NvbGAgcHJvcGVydHkgd2FzIHNldCwgdGhlbiBmYWxsIGJhY2sgdG8KICAgIC8vIGNoZWNraW5nIHRoZSBzdGFjayB0cmFjZSBvZiB0aGUgY3VycmVudCBjYWxsIHN0YWNrLCBhbmQgdHJ5IHRvCiAgICAvLyBkZXRlY3QgdGhlICJodHRwcyIgbW9kdWxlLgogICAgY29uc3QgeyBzdGFjayB9ID0gbmV3IEVycm9yKCk7CiAgICBpZiAodHlwZW9mIHN0YWNrICE9PSAnc3RyaW5nJykgcmV0dXJuIGZhbHNlOwogICAgcmV0dXJuIHN0YWNrLnNwbGl0KCdcbicpLnNvbWUobCA9PiBsLmluZGV4T2YoJyhodHRwcy5qczonKSAhPT0gLTEgfHwgbC5pbmRleE9mKCdub2RlOmh0dHBzOicpICE9PSAtMSk7CiAgfQoKICBjcmVhdGVTb2NrZXQocmVxLCBvcHRpb25zLCBjYikgewogICAgY29uc3QgY29ubmVjdE9wdHMgPSB7CiAgICAgIC4uLm9wdGlvbnMsCiAgICAgIHNlY3VyZUVuZHBvaW50OiB0aGlzLmlzU2VjdXJlRW5kcG9pbnQob3B0aW9ucyksCiAgICB9OwogICAgUHJvbWlzZS5yZXNvbHZlKCkKICAgICAgLnRoZW4oKCkgPT4gdGhpcy5jb25uZWN0KHJlcSwgY29ubmVjdE9wdHMpKQogICAgICAudGhlbihzb2NrZXQgPT4gewogICAgICAgIGlmIChzb2NrZXQgaW5zdGFuY2VvZiBodHRwLkFnZW50KSB7CiAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGBhZGRSZXF1ZXN0KClgIGlzbid0IGRlZmluZWQgaW4gYEB0eXBlcy9ub2RlYAogICAgICAgICAgcmV0dXJuIHNvY2tldC5hZGRSZXF1ZXN0KHJlcSwgY29ubmVjdE9wdHMpOwogICAgICAgIH0KICAgICAgICB0aGlzW0lOVEVSTkFMXS5jdXJyZW50U29ja2V0ID0gc29ja2V0OwogICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgYGNyZWF0ZVNvY2tldCgpYCBpc24ndCBkZWZpbmVkIGluIGBAdHlwZXMvbm9kZWAKICAgICAgICBzdXBlci5jcmVhdGVTb2NrZXQocmVxLCBvcHRpb25zLCBjYik7CiAgICAgIH0sIGNiKTsKICB9CgogIGNyZWF0ZUNvbm5lY3Rpb24oKSB7CiAgICBjb25zdCBzb2NrZXQgPSB0aGlzW0lOVEVSTkFMXS5jdXJyZW50U29ja2V0OwogICAgdGhpc1tJTlRFUk5BTF0uY3VycmVudFNvY2tldCA9IHVuZGVmaW5lZDsKICAgIGlmICghc29ja2V0KSB7CiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc29ja2V0IHdhcyByZXR1cm5lZCBpbiB0aGUgYGNvbm5lY3QoKWAgZnVuY3Rpb24nKTsKICAgIH0KICAgIHJldHVybiBzb2NrZXQ7CiAgfQoKICBnZXQgZGVmYXVsdFBvcnQoKSB7CiAgICByZXR1cm4gX251bGxpc2hDb2FsZXNjZSQyKHRoaXNbSU5URVJOQUxdLmRlZmF1bHRQb3J0LCAoKSA9PiAoICh0aGlzLnByb3RvY29sID09PSAnaHR0cHM6JyA/IDQ0MyA6IDgwKSkpOwogIH0KCiAgc2V0IGRlZmF1bHRQb3J0KHYpIHsKICAgIGlmICh0aGlzW0lOVEVSTkFMXSkgewogICAgICB0aGlzW0lOVEVSTkFMXS5kZWZhdWx0UG9ydCA9IHY7CiAgICB9CiAgfQoKICBnZXQgcHJvdG9jb2woKSB7CiAgICByZXR1cm4gX251bGxpc2hDb2FsZXNjZSQyKHRoaXNbSU5URVJOQUxdLnByb3RvY29sLCAoKSA9PiAoICh0aGlzLmlzU2VjdXJlRW5kcG9pbnQoKSA/ICdodHRwczonIDogJ2h0dHA6JykpKTsKICB9CgogIHNldCBwcm90b2NvbCh2KSB7CiAgICBpZiAodGhpc1tJTlRFUk5BTF0pIHsKICAgICAgdGhpc1tJTlRFUk5BTF0ucHJvdG9jb2wgPSB2OwogICAgfQogIH0KfQoKZnVuY3Rpb24gZGVidWckMSguLi5hcmdzKSB7CiAgbG9nZ2VyLmxvZygnW2h0dHBzLXByb3h5LWFnZW50OnBhcnNlLXByb3h5LXJlc3BvbnNlXScsIC4uLmFyZ3MpOwp9CgpmdW5jdGlvbiBwYXJzZVByb3h5UmVzcG9uc2Uoc29ja2V0KSB7CiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHsKICAgIC8vIHdlIG5lZWQgdG8gYnVmZmVyIGFueSBIVFRQIHRyYWZmaWMgdGhhdCBoYXBwZW5zIHdpdGggdGhlIHByb3h5IGJlZm9yZSB3ZSBnZXQKICAgIC8vIHRoZSBDT05ORUNUIHJlc3BvbnNlLCBzbyB0aGF0IGlmIHRoZSByZXNwb25zZSBpcyBhbnl0aGluZyBvdGhlciB0aGFuIGFuICIyMDAiCiAgICAvLyByZXNwb25zZSBjb2RlLCB0aGVuIHdlIGNhbiByZS1wbGF5IHRoZSAiZGF0YSIgZXZlbnRzIG9uIHRoZSBzb2NrZXQgb25jZSB0aGUKICAgIC8vIEhUVFAgcGFyc2VyIGlzIGhvb2tlZCB1cC4uLgogICAgbGV0IGJ1ZmZlcnNMZW5ndGggPSAwOwogICAgY29uc3QgYnVmZmVycyA9IFtdOwoKICAgIGZ1bmN0aW9uIHJlYWQoKSB7CiAgICAgIGNvbnN0IGIgPSBzb2NrZXQucmVhZCgpOwogICAgICBpZiAoYikgb25kYXRhKGIpOwogICAgICBlbHNlIHNvY2tldC5vbmNlKCdyZWFkYWJsZScsIHJlYWQpOwogICAgfQoKICAgIGZ1bmN0aW9uIGNsZWFudXAoKSB7CiAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpOwogICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7CiAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcigncmVhZGFibGUnLCByZWFkKTsKICAgIH0KCiAgICBmdW5jdGlvbiBvbmVuZCgpIHsKICAgICAgY2xlYW51cCgpOwogICAgICBkZWJ1ZyQxKCdvbmVuZCcpOwogICAgICByZWplY3QobmV3IEVycm9yKCdQcm94eSBjb25uZWN0aW9uIGVuZGVkIGJlZm9yZSByZWNlaXZpbmcgQ09OTkVDVCByZXNwb25zZScpKTsKICAgIH0KCiAgICBmdW5jdGlvbiBvbmVycm9yKGVycikgewogICAgICBjbGVhbnVwKCk7CiAgICAgIGRlYnVnJDEoJ29uZXJyb3IgJW8nLCBlcnIpOwogICAgICByZWplY3QoZXJyKTsKICAgIH0KCiAgICBmdW5jdGlvbiBvbmRhdGEoYikgewogICAgICBidWZmZXJzLnB1c2goYik7CiAgICAgIGJ1ZmZlcnNMZW5ndGggKz0gYi5sZW5ndGg7CgogICAgICBjb25zdCBidWZmZXJlZCA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycywgYnVmZmVyc0xlbmd0aCk7CiAgICAgIGNvbnN0IGVuZE9mSGVhZGVycyA9IGJ1ZmZlcmVkLmluZGV4T2YoJ1xyXG5cclxuJyk7CgogICAgICBpZiAoZW5kT2ZIZWFkZXJzID09PSAtMSkgewogICAgICAgIC8vIGtlZXAgYnVmZmVyaW5nCiAgICAgICAgZGVidWckMSgnaGF2ZSBub3QgcmVjZWl2ZWQgZW5kIG9mIEhUVFAgaGVhZGVycyB5ZXQuLi4nKTsKICAgICAgICByZWFkKCk7CiAgICAgICAgcmV0dXJuOwogICAgICB9CgogICAgICBjb25zdCBoZWFkZXJQYXJ0cyA9IGJ1ZmZlcmVkLnNsaWNlKDAsIGVuZE9mSGVhZGVycykudG9TdHJpbmcoJ2FzY2lpJykuc3BsaXQoJ1xyXG4nKTsKICAgICAgY29uc3QgZmlyc3RMaW5lID0gaGVhZGVyUGFydHMuc2hpZnQoKTsKICAgICAgaWYgKCFmaXJzdExpbmUpIHsKICAgICAgICBzb2NrZXQuZGVzdHJveSgpOwogICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKCdObyBoZWFkZXIgcmVjZWl2ZWQgZnJvbSBwcm94eSBDT05ORUNUIHJlc3BvbnNlJykpOwogICAgICB9CiAgICAgIGNvbnN0IGZpcnN0TGluZVBhcnRzID0gZmlyc3RMaW5lLnNwbGl0KCcgJyk7CiAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSArZmlyc3RMaW5lUGFydHNbMV07CiAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBmaXJzdExpbmVQYXJ0cy5zbGljZSgyKS5qb2luKCcgJyk7CiAgICAgIGNvbnN0IGhlYWRlcnMgPSB7fTsKICAgICAgZm9yIChjb25zdCBoZWFkZXIgb2YgaGVhZGVyUGFydHMpIHsKICAgICAgICBpZiAoIWhlYWRlcikgY29udGludWU7CiAgICAgICAgY29uc3QgZmlyc3RDb2xvbiA9IGhlYWRlci5pbmRleE9mKCc6Jyk7CiAgICAgICAgaWYgKGZpcnN0Q29sb24gPT09IC0xKSB7CiAgICAgICAgICBzb2NrZXQuZGVzdHJveSgpOwogICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoYEludmFsaWQgaGVhZGVyIGZyb20gcHJveHkgQ09OTkVDVCByZXNwb25zZTogIiR7aGVhZGVyfSJgKSk7CiAgICAgICAgfQogICAgICAgIGNvbnN0IGtleSA9IGhlYWRlci5zbGljZSgwLCBmaXJzdENvbG9uKS50b0xvd2VyQ2FzZSgpOwogICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyLnNsaWNlKGZpcnN0Q29sb24gKyAxKS50cmltU3RhcnQoKTsKICAgICAgICBjb25zdCBjdXJyZW50ID0gaGVhZGVyc1trZXldOwogICAgICAgIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ3N0cmluZycpIHsKICAgICAgICAgIGhlYWRlcnNba2V5XSA9IFtjdXJyZW50LCB2YWx1ZV07CiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGN1cnJlbnQpKSB7CiAgICAgICAgICBjdXJyZW50LnB1c2godmFsdWUpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICBoZWFkZXJzW2tleV0gPSB2YWx1ZTsKICAgICAgICB9CiAgICAgIH0KICAgICAgZGVidWckMSgnZ290IHByb3h5IHNlcnZlciByZXNwb25zZTogJW8gJW8nLCBmaXJzdExpbmUsIGhlYWRlcnMpOwogICAgICBjbGVhbnVwKCk7CiAgICAgIHJlc29sdmUoewogICAgICAgIGNvbm5lY3Q6IHsKICAgICAgICAgIHN0YXR1c0NvZGUsCiAgICAgICAgICBzdGF0dXNUZXh0LAogICAgICAgICAgaGVhZGVycywKICAgICAgICB9LAogICAgICAgIGJ1ZmZlcmVkLAogICAgICB9KTsKICAgIH0KCiAgICBzb2NrZXQub24oJ2Vycm9yJywgb25lcnJvcik7CiAgICBzb2NrZXQub24oJ2VuZCcsIG9uZW5kKTsKCiAgICByZWFkKCk7CiAgfSk7Cn0KCmZ1bmN0aW9uIF9udWxsaXNoQ29hbGVzY2UkMShsaHMsIHJoc0ZuKSB7IGlmIChsaHMgIT0gbnVsbCkgeyByZXR1cm4gbGhzOyB9IGVsc2UgeyByZXR1cm4gcmhzRm4oKTsgfSB9IGZ1bmN0aW9uIF9vcHRpb25hbENoYWluJDEob3BzKSB7IGxldCBsYXN0QWNjZXNzTEhTID0gdW5kZWZpbmVkOyBsZXQgdmFsdWUgPSBvcHNbMF07IGxldCBpID0gMTsgd2hpbGUgKGkgPCBvcHMubGVuZ3RoKSB7IGNvbnN0IG9wID0gb3BzW2ldOyBjb25zdCBmbiA9IG9wc1tpICsgMV07IGkgKz0gMjsgaWYgKChvcCA9PT0gJ29wdGlvbmFsQWNjZXNzJyB8fCBvcCA9PT0gJ29wdGlvbmFsQ2FsbCcpICYmIHZhbHVlID09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBpZiAob3AgPT09ICdhY2Nlc3MnIHx8IG9wID09PSAnb3B0aW9uYWxBY2Nlc3MnKSB7IGxhc3RBY2Nlc3NMSFMgPSB2YWx1ZTsgdmFsdWUgPSBmbih2YWx1ZSk7IH0gZWxzZSBpZiAob3AgPT09ICdjYWxsJyB8fCBvcCA9PT0gJ29wdGlvbmFsQ2FsbCcpIHsgdmFsdWUgPSBmbigoLi4uYXJncykgPT4gdmFsdWUuY2FsbChsYXN0QWNjZXNzTEhTLCAuLi5hcmdzKSk7IGxhc3RBY2Nlc3NMSFMgPSB1bmRlZmluZWQ7IH0gfSByZXR1cm4gdmFsdWU7IH0KCmZ1bmN0aW9uIGRlYnVnKC4uLmFyZ3MpIHsKICBsb2dnZXIubG9nKCdbaHR0cHMtcHJveHktYWdlbnRdJywgLi4uYXJncyk7Cn0KCi8qKgogKiBUaGUgYEh0dHBzUHJveHlBZ2VudGAgaW1wbGVtZW50cyBhbiBIVFRQIEFnZW50IHN1YmNsYXNzIHRoYXQgY29ubmVjdHMgdG8KICogdGhlIHNwZWNpZmllZCAiSFRUUChzKSBwcm94eSBzZXJ2ZXIiIGluIG9yZGVyIHRvIHByb3h5IEhUVFBTIHJlcXVlc3RzLgogKgogKiBPdXRnb2luZyBIVFRQIHJlcXVlc3RzIGFyZSBmaXJzdCB0dW5uZWxlZCB0aHJvdWdoIHRoZSBwcm94eSBzZXJ2ZXIgdXNpbmcgdGhlCiAqIGBDT05ORUNUYCBIVFRQIHJlcXVlc3QgbWV0aG9kIHRvIGVzdGFibGlzaCBhIGNvbm5lY3Rpb24gdG8gdGhlIHByb3h5IHNlcnZlciwKICogYW5kIHRoZW4gdGhlIHByb3h5IHNlcnZlciBjb25uZWN0cyB0byB0aGUgZGVzdGluYXRpb24gdGFyZ2V0IGFuZCBpc3N1ZXMgdGhlCiAqIEhUVFAgcmVxdWVzdCBmcm9tIHRoZSBwcm94eSBzZXJ2ZXIuCiAqCiAqIGBodHRwczpgIHJlcXVlc3RzIGhhdmUgdGhlaXIgc29ja2V0IGNvbm5lY3Rpb24gdXBncmFkZWQgdG8gVExTIG9uY2UKICogdGhlIGNvbm5lY3Rpb24gdG8gdGhlIHByb3h5IHNlcnZlciBoYXMgYmVlbiBlc3RhYmxpc2hlZC4KICovCmNsYXNzIEh0dHBzUHJveHlBZ2VudCBleHRlbmRzIEFnZW50IHsKICBzdGF0aWMgX19pbml0U3RhdGljKCkge3RoaXMucHJvdG9jb2xzID0gWydodHRwJywgJ2h0dHBzJ107IH0KCiAgY29uc3RydWN0b3IocHJveHksIG9wdHMpIHsKICAgIHN1cGVyKG9wdHMpOwogICAgdGhpcy5vcHRpb25zID0ge307CiAgICB0aGlzLnByb3h5ID0gdHlwZW9mIHByb3h5ID09PSAnc3RyaW5nJyA/IG5ldyBVUkwocHJveHkpIDogcHJveHk7CiAgICB0aGlzLnByb3h5SGVhZGVycyA9IF9udWxsaXNoQ29hbGVzY2UkMShfb3B0aW9uYWxDaGFpbiQxKFtvcHRzLCAnb3B0aW9uYWxBY2Nlc3MnLCBfMiA9PiBfMi5oZWFkZXJzXSksICgpID0+ICgge30pKTsKICAgIGRlYnVnKCdDcmVhdGluZyBuZXcgSHR0cHNQcm94eUFnZW50IGluc3RhbmNlOiAlbycsIHRoaXMucHJveHkuaHJlZik7CgogICAgLy8gVHJpbSBvZmYgdGhlIGJyYWNrZXRzIGZyb20gSVB2NiBhZGRyZXNzZXMKICAgIGNvbnN0IGhvc3QgPSAodGhpcy5wcm94eS5ob3N0bmFtZSB8fCB0aGlzLnByb3h5Lmhvc3QpLnJlcGxhY2UoL15cW3xcXSQvZywgJycpOwogICAgY29uc3QgcG9ydCA9IHRoaXMucHJveHkucG9ydCA/IHBhcnNlSW50KHRoaXMucHJveHkucG9ydCwgMTApIDogdGhpcy5wcm94eS5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyA0NDMgOiA4MDsKICAgIHRoaXMuY29ubmVjdE9wdHMgPSB7CiAgICAgIC8vIEF0dGVtcHQgdG8gbmVnb3RpYXRlIGh0dHAvMS4xIGZvciBwcm94eSBzZXJ2ZXJzIHRoYXQgc3VwcG9ydCBodHRwLzIKICAgICAgQUxQTlByb3RvY29sczogWydodHRwLzEuMSddLAogICAgICAuLi4ob3B0cyA/IG9taXQob3B0cywgJ2hlYWRlcnMnKSA6IG51bGwpLAogICAgICBob3N0LAogICAgICBwb3J0LAogICAgfTsKICB9CgogIC8qKgogICAqIENhbGxlZCB3aGVuIHRoZSBub2RlLWNvcmUgSFRUUCBjbGllbnQgbGlicmFyeSBpcyBjcmVhdGluZyBhCiAgICogbmV3IEhUVFAgcmVxdWVzdC4KICAgKi8KICBhc3luYyBjb25uZWN0KHJlcSwgb3B0cykgewogICAgY29uc3QgeyBwcm94eSB9ID0gdGhpczsKCiAgICBpZiAoIW9wdHMuaG9zdCkgewogICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdObyAiaG9zdCIgcHJvdmlkZWQnKTsKICAgIH0KCiAgICAvLyBDcmVhdGUgYSBzb2NrZXQgY29ubmVjdGlvbiB0byB0aGUgcHJveHkgc2VydmVyLgogICAgbGV0IHNvY2tldDsKICAgIGlmIChwcm94eS5wcm90b2NvbCA9PT0gJ2h0dHBzOicpIHsKICAgICAgZGVidWcoJ0NyZWF0aW5nIGB0bHMuU29ja2V0YDogJW8nLCB0aGlzLmNvbm5lY3RPcHRzKTsKICAgICAgY29uc3Qgc2VydmVybmFtZSA9IHRoaXMuY29ubmVjdE9wdHMuc2VydmVybmFtZSB8fCB0aGlzLmNvbm5lY3RPcHRzLmhvc3Q7CiAgICAgIHNvY2tldCA9IHRscy5jb25uZWN0KHsKICAgICAgICAuLi50aGlzLmNvbm5lY3RPcHRzLAogICAgICAgIHNlcnZlcm5hbWU6IHNlcnZlcm5hbWUgJiYgbmV0LmlzSVAoc2VydmVybmFtZSkgPyB1bmRlZmluZWQgOiBzZXJ2ZXJuYW1lLAogICAgICB9KTsKICAgIH0gZWxzZSB7CiAgICAgIGRlYnVnKCdDcmVhdGluZyBgbmV0LlNvY2tldGA6ICVvJywgdGhpcy5jb25uZWN0T3B0cyk7CiAgICAgIHNvY2tldCA9IG5ldC5jb25uZWN0KHRoaXMuY29ubmVjdE9wdHMpOwogICAgfQoKICAgIGNvbnN0IGhlYWRlcnMgPQogICAgICB0eXBlb2YgdGhpcy5wcm94eUhlYWRlcnMgPT09ICdmdW5jdGlvbicgPyB0aGlzLnByb3h5SGVhZGVycygpIDogeyAuLi50aGlzLnByb3h5SGVhZGVycyB9OwogICAgY29uc3QgaG9zdCA9IG5ldC5pc0lQdjYob3B0cy5ob3N0KSA/IGBbJHtvcHRzLmhvc3R9XWAgOiBvcHRzLmhvc3Q7CiAgICBsZXQgcGF5bG9hZCA9IGBDT05ORUNUICR7aG9zdH06JHtvcHRzLnBvcnR9IEhUVFAvMS4xXHJcbmA7CgogICAgLy8gSW5qZWN0IHRoZSBgUHJveHktQXV0aG9yaXphdGlvbmAgaGVhZGVyIGlmIG5lY2Vzc2FyeS4KICAgIGlmIChwcm94eS51c2VybmFtZSB8fCBwcm94eS5wYXNzd29yZCkgewogICAgICBjb25zdCBhdXRoID0gYCR7ZGVjb2RlVVJJQ29tcG9uZW50KHByb3h5LnVzZXJuYW1lKX06JHtkZWNvZGVVUklDb21wb25lbnQocHJveHkucGFzc3dvcmQpfWA7CiAgICAgIGhlYWRlcnNbJ1Byb3h5LUF1dGhvcml6YXRpb24nXSA9IGBCYXNpYyAke0J1ZmZlci5mcm9tKGF1dGgpLnRvU3RyaW5nKCdiYXNlNjQnKX1gOwogICAgfQoKICAgIGhlYWRlcnMuSG9zdCA9IGAke2hvc3R9OiR7b3B0cy5wb3J0fWA7CgogICAgaWYgKCFoZWFkZXJzWydQcm94eS1Db25uZWN0aW9uJ10pIHsKICAgICAgaGVhZGVyc1snUHJveHktQ29ubmVjdGlvbiddID0gdGhpcy5rZWVwQWxpdmUgPyAnS2VlcC1BbGl2ZScgOiAnY2xvc2UnOwogICAgfQogICAgZm9yIChjb25zdCBuYW1lIG9mIE9iamVjdC5rZXlzKGhlYWRlcnMpKSB7CiAgICAgIHBheWxvYWQgKz0gYCR7bmFtZX06ICR7aGVhZGVyc1tuYW1lXX1cclxuYDsKICAgIH0KCiAgICBjb25zdCBwcm94eVJlc3BvbnNlUHJvbWlzZSA9IHBhcnNlUHJveHlSZXNwb25zZShzb2NrZXQpOwoKICAgIHNvY2tldC53cml0ZShgJHtwYXlsb2FkfVxyXG5gKTsKCiAgICBjb25zdCB7IGNvbm5lY3QsIGJ1ZmZlcmVkIH0gPSBhd2FpdCBwcm94eVJlc3BvbnNlUHJvbWlzZTsKICAgIHJlcS5lbWl0KCdwcm94eUNvbm5lY3QnLCBjb25uZWN0KTsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQKICAgIC8vIEB0cy1pZ25vcmUgTm90IEV2ZW50RW1pdHRlciBpbiBOb2RlIHR5cGVzCiAgICB0aGlzLmVtaXQoJ3Byb3h5Q29ubmVjdCcsIGNvbm5lY3QsIHJlcSk7CgogICAgaWYgKGNvbm5lY3Quc3RhdHVzQ29kZSA9PT0gMjAwKSB7CiAgICAgIHJlcS5vbmNlKCdzb2NrZXQnLCByZXN1bWUpOwoKICAgICAgaWYgKG9wdHMuc2VjdXJlRW5kcG9pbnQpIHsKICAgICAgICAvLyBUaGUgcHJveHkgaXMgY29ubmVjdGluZyB0byBhIFRMUyBzZXJ2ZXIsIHNvIHVwZ3JhZGUKICAgICAgICAvLyB0aGlzIHNvY2tldCBjb25uZWN0aW9uIHRvIGEgVExTIGNvbm5lY3Rpb24uCiAgICAgICAgZGVidWcoJ1VwZ3JhZGluZyBzb2NrZXQgY29ubmVjdGlvbiB0byBUTFMnKTsKICAgICAgICBjb25zdCBzZXJ2ZXJuYW1lID0gb3B0cy5zZXJ2ZXJuYW1lIHx8IG9wdHMuaG9zdDsKICAgICAgICByZXR1cm4gdGxzLmNvbm5lY3QoewogICAgICAgICAgLi4ub21pdChvcHRzLCAnaG9zdCcsICdwYXRoJywgJ3BvcnQnKSwKICAgICAgICAgIHNvY2tldCwKICAgICAgICAgIHNlcnZlcm5hbWU6IG5ldC5pc0lQKHNlcnZlcm5hbWUpID8gdW5kZWZpbmVkIDogc2VydmVybmFtZSwKICAgICAgICB9KTsKICAgICAgfQoKICAgICAgcmV0dXJuIHNvY2tldDsKICAgIH0KCiAgICAvLyBTb21lIG90aGVyIHN0YXR1cyBjb2RlIHRoYXQncyBub3QgMjAwLi4uIG5lZWQgdG8gcmUtcGxheSB0aGUgSFRUUAogICAgLy8gaGVhZGVyICJkYXRhIiBldmVudHMgb250byB0aGUgc29ja2V0IG9uY2UgdGhlIEhUVFAgbWFjaGluZXJ5IGlzCiAgICAvLyBhdHRhY2hlZCBzbyB0aGF0IHRoZSBub2RlIGNvcmUgYGh0dHBgIGNhbiBwYXJzZSBhbmQgaGFuZGxlIHRoZQogICAgLy8gZXJyb3Igc3RhdHVzIGNvZGUuCgogICAgLy8gQ2xvc2UgdGhlIG9yaWdpbmFsIHNvY2tldCwgYW5kIGEgbmV3ICJmYWtlIiBzb2NrZXQgaXMgcmV0dXJuZWQKICAgIC8vIGluc3RlYWQsIHNvIHRoYXQgdGhlIHByb3h5IGRvZXNuJ3QgZ2V0IHRoZSBIVFRQIHJlcXVlc3QKICAgIC8vIHdyaXR0ZW4gdG8gaXQgKHdoaWNoIG1heSBjb250YWluIGBBdXRob3JpemF0aW9uYCBoZWFkZXJzIG9yIG90aGVyCiAgICAvLyBzZW5zaXRpdmUgZGF0YSkuCiAgICAvLwogICAgLy8gU2VlOiBodHRwczovL2hhY2tlcm9uZS5jb20vcmVwb3J0cy81NDE1MDIKICAgIHNvY2tldC5kZXN0cm95KCk7CgogICAgY29uc3QgZmFrZVNvY2tldCA9IG5ldyBuZXQuU29ja2V0KHsgd3JpdGFibGU6IGZhbHNlIH0pOwogICAgZmFrZVNvY2tldC5yZWFkYWJsZSA9IHRydWU7CgogICAgLy8gTmVlZCB0byB3YWl0IGZvciB0aGUgInNvY2tldCIgZXZlbnQgdG8gcmUtcGxheSB0aGUgImRhdGEiIGV2ZW50cy4KICAgIHJlcS5vbmNlKCdzb2NrZXQnLCAocykgPT4gewogICAgICBkZWJ1ZygnUmVwbGF5aW5nIHByb3h5IGJ1ZmZlciBmb3IgZmFpbGVkIHJlcXVlc3QnKTsKICAgICAgLy8gUmVwbGF5IHRoZSAiYnVmZmVyZWQiIEJ1ZmZlciBvbnRvIHRoZSBmYWtlIGBzb2NrZXRgLCBzaW5jZSBhdAogICAgICAvLyB0aGlzIHBvaW50IHRoZSBIVFRQIG1vZHVsZSBtYWNoaW5lcnkgaGFzIGJlZW4gaG9va2VkIHVwIGZvcgogICAgICAvLyB0aGUgdXNlci4KICAgICAgcy5wdXNoKGJ1ZmZlcmVkKTsKICAgICAgcy5wdXNoKG51bGwpOwogICAgfSk7CgogICAgcmV0dXJuIGZha2VTb2NrZXQ7CiAgfQp9IEh0dHBzUHJveHlBZ2VudC5fX2luaXRTdGF0aWMoKTsKCmZ1bmN0aW9uIHJlc3VtZShzb2NrZXQpIHsKICBzb2NrZXQucmVzdW1lKCk7Cn0KCmZ1bmN0aW9uIG9taXQoCiAgb2JqLAogIC4uLmtleXMKKQoKIHsKICBjb25zdCByZXQgPSB7fQoKOwogIGxldCBrZXk7CiAgZm9yIChrZXkgaW4gb2JqKSB7CiAgICBpZiAoIWtleXMuaW5jbHVkZXMoa2V5KSkgewogICAgICByZXRba2V5XSA9IG9ialtrZXldOwogICAgfQogIH0KICByZXR1cm4gcmV0Owp9CgpmdW5jdGlvbiBfbnVsbGlzaENvYWxlc2NlKGxocywgcmhzRm4pIHsgaWYgKGxocyAhPSBudWxsKSB7IHJldHVybiBsaHM7IH0gZWxzZSB7IHJldHVybiByaHNGbigpOyB9IH0KLy8gRXN0aW1hdGVkIG1heGltdW0gc2l6ZSBmb3IgcmVhc29uYWJsZSBzdGFuZGFsb25lIGV2ZW50CmNvbnN0IEdaSVBfVEhSRVNIT0xEID0gMTAyNCAqIDMyOwoKLyoqCiAqIEdldHMgYSBzdHJlYW0gZnJvbSBhIFVpbnQ4QXJyYXkgb3Igc3RyaW5nCiAqIFJlYWRhYmxlLmZyb20gaXMgaWRlYWwgYnV0IHdhcyBhZGRlZCBpbiBub2RlLmpzIHYxMi4zLjAgYW5kIHYxMC4xNy4wCiAqLwpmdW5jdGlvbiBzdHJlYW1Gcm9tQm9keShib2R5KSB7CiAgcmV0dXJuIG5ldyBSZWFkYWJsZSh7CiAgICByZWFkKCkgewogICAgICB0aGlzLnB1c2goYm9keSk7CiAgICAgIHRoaXMucHVzaChudWxsKTsKICAgIH0sCiAgfSk7Cn0KCi8qKgogKiBDcmVhdGVzIGEgVHJhbnNwb3J0IHRoYXQgdXNlcyBuYXRpdmUgdGhlIG5hdGl2ZSAnaHR0cCcgYW5kICdodHRwcycgbW9kdWxlcyB0byBzZW5kIGV2ZW50cyB0byBTZW50cnkuCiAqLwpmdW5jdGlvbiBtYWtlTm9kZVRyYW5zcG9ydChvcHRpb25zKSB7CiAgbGV0IHVybFNlZ21lbnRzOwoKICB0cnkgewogICAgdXJsU2VnbWVudHMgPSBuZXcgVVJMKG9wdGlvbnMudXJsKTsKICB9IGNhdGNoIChlKSB7CiAgICBjb25zb2xlU2FuZGJveCgoKSA9PiB7CiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlCiAgICAgIGNvbnNvbGUud2FybigKICAgICAgICAnW0BzZW50cnkvbm9kZV06IEludmFsaWQgZHNuIG9yIHR1bm5lbCBvcHRpb24sIHdpbGwgbm90IHNlbmQgYW55IGV2ZW50cy4gVGhlIHR1bm5lbCBvcHRpb24gbXVzdCBiZSBhIGZ1bGwgVVJMIHdoZW4gdXNlZC4nLAogICAgICApOwogICAgfSk7CiAgICByZXR1cm4gY3JlYXRlVHJhbnNwb3J0KG9wdGlvbnMsICgpID0+IFByb21pc2UucmVzb2x2ZSh7fSkpOwogIH0KCiAgY29uc3QgaXNIdHRwcyA9IHVybFNlZ21lbnRzLnByb3RvY29sID09PSAnaHR0cHM6JzsKCiAgLy8gUHJveHkgcHJpb3JpdGl6YXRpb246IGh0dHAgPT4gYG9wdGlvbnMucHJveHlgIHwgYHByb2Nlc3MuZW52Lmh0dHBfcHJveHlgCiAgLy8gUHJveHkgcHJpb3JpdGl6YXRpb246IGh0dHBzID0+IGBvcHRpb25zLnByb3h5YCB8IGBwcm9jZXNzLmVudi5odHRwc19wcm94eWAgfCBgcHJvY2Vzcy5lbnYuaHR0cF9wcm94eWAKICBjb25zdCBwcm94eSA9IGFwcGx5Tm9Qcm94eU9wdGlvbigKICAgIHVybFNlZ21lbnRzLAogICAgb3B0aW9ucy5wcm94eSB8fCAoaXNIdHRwcyA/IHByb2Nlc3MuZW52Lmh0dHBzX3Byb3h5IDogdW5kZWZpbmVkKSB8fCBwcm9jZXNzLmVudi5odHRwX3Byb3h5LAogICk7CgogIGNvbnN0IG5hdGl2ZUh0dHBNb2R1bGUgPSBpc0h0dHBzID8gaHR0cHMgOiBodHRwOwogIGNvbnN0IGtlZXBBbGl2ZSA9IG9wdGlvbnMua2VlcEFsaXZlID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IG9wdGlvbnMua2VlcEFsaXZlOwoKICAvLyBUT0RPKHY3KTogRXZhbHVhdGUgaWYgd2UgY2FuIHNldCBrZWVwQWxpdmUgdG8gdHJ1ZS4gVGhpcyB3b3VsZCBpbnZvbHZlIHRlc3RpbmcgZm9yIG1lbW9yeSBsZWFrcyBpbiBvbGRlciBub2RlCiAgLy8gdmVyc2lvbnMoPj0gOCkgYXMgdGhleSBoYWQgbWVtb3J5IGxlYWtzIHdoZW4gdXNpbmcgaXQ6ICMyNTU1CiAgY29uc3QgYWdlbnQgPSBwcm94eQogICAgPyAobmV3IEh0dHBzUHJveHlBZ2VudChwcm94eSkgKQogICAgOiBuZXcgbmF0aXZlSHR0cE1vZHVsZS5BZ2VudCh7IGtlZXBBbGl2ZSwgbWF4U29ja2V0czogMzAsIHRpbWVvdXQ6IDIwMDAgfSk7CgogIGNvbnN0IHJlcXVlc3RFeGVjdXRvciA9IGNyZWF0ZVJlcXVlc3RFeGVjdXRvcihvcHRpb25zLCBfbnVsbGlzaENvYWxlc2NlKG9wdGlvbnMuaHR0cE1vZHVsZSwgKCkgPT4gKCBuYXRpdmVIdHRwTW9kdWxlKSksIGFnZW50KTsKICByZXR1cm4gY3JlYXRlVHJhbnNwb3J0KG9wdGlvbnMsIHJlcXVlc3RFeGVjdXRvcik7Cn0KCi8qKgogKiBIb25vcnMgdGhlIGBub19wcm94eWAgZW52IHZhcmlhYmxlIHdpdGggdGhlIGhpZ2hlc3QgcHJpb3JpdHkgdG8gYWxsb3cgZm9yIGhvc3RzIGV4Y2x1c2lvbi4KICoKICogQHBhcmFtIHRyYW5zcG9ydFVybCBUaGUgVVJMIHRoZSB0cmFuc3BvcnQgaW50ZW5kcyB0byBzZW5kIGV2ZW50cyB0by4KICogQHBhcmFtIHByb3h5IFRoZSBjbGllbnQgY29uZmlndXJlZCBwcm94eS4KICogQHJldHVybnMgQSBwcm94eSB0aGUgdHJhbnNwb3J0IHNob3VsZCB1c2UuCiAqLwpmdW5jdGlvbiBhcHBseU5vUHJveHlPcHRpb24odHJhbnNwb3J0VXJsU2VnbWVudHMsIHByb3h5KSB7CiAgY29uc3QgeyBub19wcm94eSB9ID0gcHJvY2Vzcy5lbnY7CgogIGNvbnN0IHVybElzRXhlbXB0RnJvbVByb3h5ID0KICAgIG5vX3Byb3h5ICYmCiAgICBub19wcm94eQogICAgICAuc3BsaXQoJywnKQogICAgICAuc29tZSgKICAgICAgICBleGVtcHRpb24gPT4gdHJhbnNwb3J0VXJsU2VnbWVudHMuaG9zdC5lbmRzV2l0aChleGVtcHRpb24pIHx8IHRyYW5zcG9ydFVybFNlZ21lbnRzLmhvc3RuYW1lLmVuZHNXaXRoKGV4ZW1wdGlvbiksCiAgICAgICk7CgogIGlmICh1cmxJc0V4ZW1wdEZyb21Qcm94eSkgewogICAgcmV0dXJuIHVuZGVmaW5lZDsKICB9IGVsc2UgewogICAgcmV0dXJuIHByb3h5OwogIH0KfQoKLyoqCiAqIENyZWF0ZXMgYSBSZXF1ZXN0RXhlY3V0b3IgdG8gYmUgdXNlZCB3aXRoIGBjcmVhdGVUcmFuc3BvcnRgLgogKi8KZnVuY3Rpb24gY3JlYXRlUmVxdWVzdEV4ZWN1dG9yKAogIG9wdGlvbnMsCiAgaHR0cE1vZHVsZSwKICBhZ2VudCwKKSB7CiAgY29uc3QgeyBob3N0bmFtZSwgcGF0aG5hbWUsIHBvcnQsIHByb3RvY29sLCBzZWFyY2ggfSA9IG5ldyBVUkwob3B0aW9ucy51cmwpOwogIHJldHVybiBmdW5jdGlvbiBtYWtlUmVxdWVzdChyZXF1ZXN0KSB7CiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gewogICAgICBsZXQgYm9keSA9IHN0cmVhbUZyb21Cb2R5KHJlcXVlc3QuYm9keSk7CgogICAgICBjb25zdCBoZWFkZXJzID0geyAuLi5vcHRpb25zLmhlYWRlcnMgfTsKCiAgICAgIGlmIChyZXF1ZXN0LmJvZHkubGVuZ3RoID4gR1pJUF9USFJFU0hPTEQpIHsKICAgICAgICBoZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ10gPSAnZ3ppcCc7CiAgICAgICAgYm9keSA9IGJvZHkucGlwZShjcmVhdGVHemlwKCkpOwogICAgICB9CgogICAgICBjb25zdCByZXEgPSBodHRwTW9kdWxlLnJlcXVlc3QoCiAgICAgICAgewogICAgICAgICAgbWV0aG9kOiAnUE9TVCcsCiAgICAgICAgICBhZ2VudCwKICAgICAgICAgIGhlYWRlcnMsCiAgICAgICAgICBob3N0bmFtZSwKICAgICAgICAgIHBhdGg6IGAke3BhdGhuYW1lfSR7c2VhcmNofWAsCiAgICAgICAgICBwb3J0LAogICAgICAgICAgcHJvdG9jb2wsCiAgICAgICAgICBjYTogb3B0aW9ucy5jYUNlcnRzLAogICAgICAgIH0sCiAgICAgICAgcmVzID0+IHsKICAgICAgICAgIHJlcy5vbignZGF0YScsICgpID0+IHsKICAgICAgICAgICAgLy8gRHJhaW4gc29ja2V0CiAgICAgICAgICB9KTsKCiAgICAgICAgICByZXMub24oJ2VuZCcsICgpID0+IHsKICAgICAgICAgICAgLy8gRHJhaW4gc29ja2V0CiAgICAgICAgICB9KTsKCiAgICAgICAgICByZXMuc2V0RW5jb2RpbmcoJ3V0ZjgnKTsKCiAgICAgICAgICAvLyAiS2V5LXZhbHVlIHBhaXJzIG9mIGhlYWRlciBuYW1lcyBhbmQgdmFsdWVzLiBIZWFkZXIgbmFtZXMgYXJlIGxvd2VyLWNhc2VkLiIKICAgICAgICAgIC8vIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzCiAgICAgICAgICBjb25zdCByZXRyeUFmdGVySGVhZGVyID0gX251bGxpc2hDb2FsZXNjZShyZXMuaGVhZGVyc1sncmV0cnktYWZ0ZXInXSwgKCkgPT4gKCBudWxsKSk7CiAgICAgICAgICBjb25zdCByYXRlTGltaXRzSGVhZGVyID0gX251bGxpc2hDb2FsZXNjZShyZXMuaGVhZGVyc1sneC1zZW50cnktcmF0ZS1saW1pdHMnXSwgKCkgPT4gKCBudWxsKSk7CgogICAgICAgICAgcmVzb2x2ZSh7CiAgICAgICAgICAgIHN0YXR1c0NvZGU6IHJlcy5zdGF0dXNDb2RlLAogICAgICAgICAgICBoZWFkZXJzOiB7CiAgICAgICAgICAgICAgJ3JldHJ5LWFmdGVyJzogcmV0cnlBZnRlckhlYWRlciwKICAgICAgICAgICAgICAneC1zZW50cnktcmF0ZS1saW1pdHMnOiBBcnJheS5pc0FycmF5KHJhdGVMaW1pdHNIZWFkZXIpID8gcmF0ZUxpbWl0c0hlYWRlclswXSA6IHJhdGVMaW1pdHNIZWFkZXIsCiAgICAgICAgICAgIH0sCiAgICAgICAgICB9KTsKICAgICAgICB9LAogICAgICApOwoKICAgICAgcmVxLm9uKCdlcnJvcicsIHJlamVjdCk7CiAgICAgIGJvZHkucGlwZShyZXEpOwogICAgfSk7CiAgfTsKfQoKZnVuY3Rpb24gX29wdGlvbmFsQ2hhaW4ob3BzKSB7IGxldCBsYXN0QWNjZXNzTEhTID0gdW5kZWZpbmVkOyBsZXQgdmFsdWUgPSBvcHNbMF07IGxldCBpID0gMTsgd2hpbGUgKGkgPCBvcHMubGVuZ3RoKSB7IGNvbnN0IG9wID0gb3BzW2ldOyBjb25zdCBmbiA9IG9wc1tpICsgMV07IGkgKz0gMjsgaWYgKChvcCA9PT0gJ29wdGlvbmFsQWNjZXNzJyB8fCBvcCA9PT0gJ29wdGlvbmFsQ2FsbCcpICYmIHZhbHVlID09IG51bGwpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSBpZiAob3AgPT09ICdhY2Nlc3MnIHx8IG9wID09PSAnb3B0aW9uYWxBY2Nlc3MnKSB7IGxhc3RBY2Nlc3NMSFMgPSB2YWx1ZTsgdmFsdWUgPSBmbih2YWx1ZSk7IH0gZWxzZSBpZiAob3AgPT09ICdjYWxsJyB8fCBvcCA9PT0gJ29wdGlvbmFsQ2FsbCcpIHsgdmFsdWUgPSBmbigoLi4uYXJncykgPT4gdmFsdWUuY2FsbChsYXN0QWNjZXNzTEhTLCAuLi5hcmdzKSk7IGxhc3RBY2Nlc3NMSFMgPSB1bmRlZmluZWQ7IH0gfSByZXR1cm4gdmFsdWU7IH0KY29uc3Qgb3B0aW9ucyA9IHdvcmtlckRhdGE7CmxldCBzZXNzaW9uOwpsZXQgaGFzU2VudEFuckV2ZW50ID0gZmFsc2U7CgpmdW5jdGlvbiBsb2cobXNnKSB7CiAgaWYgKG9wdGlvbnMuZGVidWcpIHsKICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlCiAgICBjb25zb2xlLmxvZyhgW0FOUiBXb3JrZXJdICR7bXNnfWApOwogIH0KfQoKY29uc3QgdXJsID0gZ2V0RW52ZWxvcGVFbmRwb2ludFdpdGhVcmxFbmNvZGVkQXV0aChvcHRpb25zLmRzbik7CmNvbnN0IHRyYW5zcG9ydCA9IG1ha2VOb2RlVHJhbnNwb3J0KHsKICB1cmwsCiAgcmVjb3JkRHJvcHBlZEV2ZW50OiAoKSA9PiB7CiAgICAvLwogIH0sCn0pOwoKYXN5bmMgZnVuY3Rpb24gc2VuZEFibm9ybWFsU2Vzc2lvbigpIHsKICAvLyBvZiB3ZSBoYXZlIGFuIGV4aXN0aW5nIHNlc3Npb24gcGFzc2VkIGZyb20gdGhlIG1haW4gdGhyZWFkLCBzZW5kIGl0IGFzIGFibm9ybWFsCiAgaWYgKHNlc3Npb24pIHsKICAgIGxvZygnU2VuZGluZyBhYm5vcm1hbCBzZXNzaW9uJyk7CiAgICB1cGRhdGVTZXNzaW9uKHNlc3Npb24sIHsgc3RhdHVzOiAnYWJub3JtYWwnLCBhYm5vcm1hbF9tZWNoYW5pc206ICdhbnJfZm9yZWdyb3VuZCcgfSk7CgogICAgY29uc3QgZW52ZWxvcGUgPSBjcmVhdGVTZXNzaW9uRW52ZWxvcGUoc2Vzc2lvbiwgb3B0aW9ucy5kc24sIG9wdGlvbnMuc2RrTWV0YWRhdGEpOwogICAgLy8gTG9nIHRoZSBlbnZlbG9wZSBzbyB0byBhaWQgaW4gdGVzdGluZwogICAgbG9nKEpTT04uc3RyaW5naWZ5KGVudmVsb3BlKSk7CgogICAgYXdhaXQgdHJhbnNwb3J0LnNlbmQoZW52ZWxvcGUpOwoKICAgIHRyeSB7CiAgICAgIC8vIE5vdGlmeSB0aGUgbWFpbiBwcm9jZXNzIHRoYXQgdGhlIHNlc3Npb24gaGFzIGVuZGVkIHNvIHRoZSBzZXNzaW9uIGNhbiBiZSBjbGVhcmVkIGZyb20gdGhlIHNjb3BlCiAgICAgIF9vcHRpb25hbENoYWluKFtwYXJlbnRQb3J0LCAnb3B0aW9uYWxBY2Nlc3MnLCBfMiA9PiBfMi5wb3N0TWVzc2FnZSwgJ2NhbGwnLCBfMyA9PiBfMygnc2Vzc2lvbi1lbmRlZCcpXSk7CiAgICB9IGNhdGNoIChfKSB7CiAgICAgIC8vIGlnbm9yZQogICAgfQogIH0KfQoKbG9nKCdTdGFydGVkJyk7CgpmdW5jdGlvbiBwcmVwYXJlU3RhY2tGcmFtZXMoc3RhY2tGcmFtZXMpIHsKICBpZiAoIXN0YWNrRnJhbWVzKSB7CiAgICByZXR1cm4gdW5kZWZpbmVkOwogIH0KCiAgLy8gU3RyaXAgU2VudHJ5IGZyYW1lcyBhbmQgcmV2ZXJzZSB0aGUgc3RhY2sgZnJhbWVzIHNvIHRoZXkgYXJlIGluIHRoZSBjb3JyZWN0IG9yZGVyCiAgY29uc3Qgc3RyaXBwZWRGcmFtZXMgPSBzdHJpcFNlbnRyeUZyYW1lc0FuZFJldmVyc2Uoc3RhY2tGcmFtZXMpOwoKICAvLyBJZiB3ZSBoYXZlIGFuIGFwcCByb290IHBhdGgsIHJld3JpdGUgdGhlIGZpbGVuYW1lcyB0byBiZSByZWxhdGl2ZSB0byB0aGUgYXBwIHJvb3QKICBpZiAob3B0aW9ucy5hcHBSb290UGF0aCkgewogICAgZm9yIChjb25zdCBmcmFtZSBvZiBzdHJpcHBlZEZyYW1lcykgewogICAgICBpZiAoIWZyYW1lLmZpbGVuYW1lKSB7CiAgICAgICAgY29udGludWU7CiAgICAgIH0KCiAgICAgIGZyYW1lLmZpbGVuYW1lID0gbm9ybWFsaXplVXJsVG9CYXNlKGZyYW1lLmZpbGVuYW1lLCBvcHRpb25zLmFwcFJvb3RQYXRoKTsKICAgIH0KICB9CgogIHJldHVybiBzdHJpcHBlZEZyYW1lczsKfQoKZnVuY3Rpb24gYXBwbHlTY29wZVRvRXZlbnQoZXZlbnQsIHNjb3BlKSB7CiAgYXBwbHlTY29wZURhdGFUb0V2ZW50KGV2ZW50LCBzY29wZSk7CgogIGlmICghX29wdGlvbmFsQ2hhaW4oW2V2ZW50LCAnYWNjZXNzJywgXzQgPT4gXzQuY29udGV4dHMsICdvcHRpb25hbEFjY2VzcycsIF81ID0+IF81LnRyYWNlXSkpIHsKICAgIGNvbnN0IHsgdHJhY2VJZCwgc3BhbklkLCBwYXJlbnRTcGFuSWQgfSA9IHNjb3BlLnByb3BhZ2F0aW9uQ29udGV4dDsKICAgIGV2ZW50LmNvbnRleHRzID0gewogICAgICB0cmFjZTogewogICAgICAgIHRyYWNlX2lkOiB0cmFjZUlkLAogICAgICAgIHNwYW5faWQ6IHNwYW5JZCwKICAgICAgICBwYXJlbnRfc3Bhbl9pZDogcGFyZW50U3BhbklkLAogICAgICB9LAogICAgICAuLi5ldmVudC5jb250ZXh0cywKICAgIH07CiAgfQp9Cgphc3luYyBmdW5jdGlvbiBzZW5kQW5yRXZlbnQoZnJhbWVzLCBzY29wZSkgewogIGlmIChoYXNTZW50QW5yRXZlbnQpIHsKICAgIHJldHVybjsKICB9CgogIGhhc1NlbnRBbnJFdmVudCA9IHRydWU7CgogIGF3YWl0IHNlbmRBYm5vcm1hbFNlc3Npb24oKTsKCiAgbG9nKCdTZW5kaW5nIGV2ZW50Jyk7CgogIGNvbnN0IGV2ZW50ID0gewogICAgZXZlbnRfaWQ6IHV1aWQ0KCksCiAgICBjb250ZXh0czogb3B0aW9ucy5jb250ZXh0cywKICAgIHJlbGVhc2U6IG9wdGlvbnMucmVsZWFzZSwKICAgIGVudmlyb25tZW50OiBvcHRpb25zLmVudmlyb25tZW50LAogICAgZGlzdDogb3B0aW9ucy5kaXN0LAogICAgcGxhdGZvcm06ICdub2RlJywKICAgIGxldmVsOiAnZXJyb3InLAogICAgZXhjZXB0aW9uOiB7CiAgICAgIHZhbHVlczogWwogICAgICAgIHsKICAgICAgICAgIHR5cGU6ICdBcHBsaWNhdGlvbk5vdFJlc3BvbmRpbmcnLAogICAgICAgICAgdmFsdWU6IGBBcHBsaWNhdGlvbiBOb3QgUmVzcG9uZGluZyBmb3IgYXQgbGVhc3QgJHtvcHRpb25zLmFuclRocmVzaG9sZH0gbXNgLAogICAgICAgICAgc3RhY2t0cmFjZTogeyBmcmFtZXM6IHByZXBhcmVTdGFja0ZyYW1lcyhmcmFtZXMpIH0sCiAgICAgICAgICAvLyBUaGlzIGVuc3VyZXMgdGhlIFVJIGRvZXNuJ3Qgc2F5ICdDcmFzaGVkIGluJyBmb3IgdGhlIHN0YWNrIHRyYWNlCiAgICAgICAgICBtZWNoYW5pc206IHsgdHlwZTogJ0FOUicgfSwKICAgICAgICB9LAogICAgICBdLAogICAgfSwKICAgIHRhZ3M6IG9wdGlvbnMuc3RhdGljVGFncywKICB9OwoKICBpZiAoc2NvcGUpIHsKICAgIGFwcGx5U2NvcGVUb0V2ZW50KGV2ZW50LCBzY29wZSk7CiAgfQoKICBjb25zdCBlbnZlbG9wZSA9IGNyZWF0ZUV2ZW50RW52ZWxvcGUoZXZlbnQsIG9wdGlvbnMuZHNuLCBvcHRpb25zLnNka01ldGFkYXRhKTsKICAvLyBMb2cgdGhlIGVudmVsb3BlIHRvIGFpZCBpbiB0ZXN0aW5nCiAgbG9nKEpTT04uc3RyaW5naWZ5KGVudmVsb3BlKSk7CgogIGF3YWl0IHRyYW5zcG9ydC5zZW5kKGVudmVsb3BlKTsKICBhd2FpdCB0cmFuc3BvcnQuZmx1c2goMjAwMCk7CgogIC8vIERlbGF5IGZvciA1IHNlY29uZHMgc28gdGhhdCBzdGRpbyBjYW4gZmx1c2ggaW4gdGhlIG1haW4gZXZlbnQgbG9vcCBldmVyIHJlc3RhcnRzLgogIC8vIFRoaXMgaXMgbWFpbmx5IGZvciB0aGUgYmVuZWZpdCBvZiBsb2dnaW5nL2RlYnVnZ2luZyBpc3N1ZXMuCiAgc2V0VGltZW91dCgoKSA9PiB7CiAgICBwcm9jZXNzLmV4aXQoMCk7CiAgfSwgNTAwMCk7Cn0KCmxldCBkZWJ1Z2dlclBhdXNlOwoKaWYgKG9wdGlvbnMuY2FwdHVyZVN0YWNrVHJhY2UpIHsKICBsb2coJ0Nvbm5lY3RpbmcgdG8gZGVidWdnZXInKTsKCiAgY29uc3Qgc2Vzc2lvbiA9IG5ldyBTZXNzaW9uKCkgOwogIHNlc3Npb24uY29ubmVjdFRvTWFpblRocmVhZCgpOwoKICBsb2coJ0Nvbm5lY3RlZCB0byBkZWJ1Z2dlcicpOwoKICAvLyBDb2xsZWN0IHNjcmlwdElkIC0+IHVybCBtYXAgc28gd2UgY2FuIGxvb2sgdXAgdGhlIGZpbGVuYW1lcyBsYXRlcgogIGNvbnN0IHNjcmlwdHMgPSBuZXcgTWFwKCk7CgogIHNlc3Npb24ub24oJ0RlYnVnZ2VyLnNjcmlwdFBhcnNlZCcsIGV2ZW50ID0+IHsKICAgIHNjcmlwdHMuc2V0KGV2ZW50LnBhcmFtcy5zY3JpcHRJZCwgZXZlbnQucGFyYW1zLnVybCk7CiAgfSk7CgogIHNlc3Npb24ub24oJ0RlYnVnZ2VyLnBhdXNlZCcsIGV2ZW50ID0+IHsKICAgIGlmIChldmVudC5wYXJhbXMucmVhc29uICE9PSAnb3RoZXInKSB7CiAgICAgIHJldHVybjsKICAgIH0KCiAgICB0cnkgewogICAgICBsb2coJ0RlYnVnZ2VyIHBhdXNlZCcpOwoKICAgICAgLy8gY29weSB0aGUgZnJhbWVzCiAgICAgIGNvbnN0IGNhbGxGcmFtZXMgPSBbLi4uZXZlbnQucGFyYW1zLmNhbGxGcmFtZXNdOwoKICAgICAgY29uc3QgZ2V0TW9kdWxlTmFtZSA9IG9wdGlvbnMuYXBwUm9vdFBhdGggPyBjcmVhdGVHZXRNb2R1bGVGcm9tRmlsZW5hbWUob3B0aW9ucy5hcHBSb290UGF0aCkgOiAoKSA9PiB1bmRlZmluZWQ7CiAgICAgIGNvbnN0IHN0YWNrRnJhbWVzID0gY2FsbEZyYW1lcy5tYXAoZnJhbWUgPT4KICAgICAgICBjYWxsRnJhbWVUb1N0YWNrRnJhbWUoZnJhbWUsIHNjcmlwdHMuZ2V0KGZyYW1lLmxvY2F0aW9uLnNjcmlwdElkKSwgZ2V0TW9kdWxlTmFtZSksCiAgICAgICk7CgogICAgICAvLyBFdmFsdWF0ZSBhIHNjcmlwdCBpbiB0aGUgY3VycmVudGx5IHBhdXNlZCBjb250ZXh0CiAgICAgIHNlc3Npb24ucG9zdCgKICAgICAgICAnUnVudGltZS5ldmFsdWF0ZScsCiAgICAgICAgewogICAgICAgICAgLy8gR3JhYiB0aGUgdHJhY2UgY29udGV4dCBmcm9tIHRoZSBjdXJyZW50IHNjb3BlCiAgICAgICAgICBleHByZXNzaW9uOiAnZ2xvYmFsLl9fU0VOVFJZX0dFVF9TQ09QRVNfXygpOycsCiAgICAgICAgICAvLyBEb24ndCByZS10cmlnZ2VyIHRoZSBkZWJ1Z2dlciBpZiB0aGlzIGNhdXNlcyBhbiBlcnJvcgogICAgICAgICAgc2lsZW50OiB0cnVlLAogICAgICAgICAgLy8gU2VyaWFsaXplIHRoZSByZXN1bHQgdG8ganNvbiBvdGhlcndpc2Ugb25seSBwcmltaXRpdmVzIGFyZSBzdXBwb3J0ZWQKICAgICAgICAgIHJldHVybkJ5VmFsdWU6IHRydWUsCiAgICAgICAgfSwKICAgICAgICAoZXJyLCBwYXJhbSkgPT4gewogICAgICAgICAgaWYgKGVycikgewogICAgICAgICAgICBsb2coYEVycm9yIGV4ZWN1dGluZyBzY3JpcHQ6ICcke2Vyci5tZXNzYWdlfSdgKTsKICAgICAgICAgIH0KCiAgICAgICAgICBjb25zdCBzY29wZXMgPSBwYXJhbSAmJiBwYXJhbS5yZXN1bHQgPyAocGFyYW0ucmVzdWx0LnZhbHVlICkgOiB1bmRlZmluZWQ7CgogICAgICAgICAgc2Vzc2lvbi5wb3N0KCdEZWJ1Z2dlci5yZXN1bWUnKTsKICAgICAgICAgIHNlc3Npb24ucG9zdCgnRGVidWdnZXIuZGlzYWJsZScpOwoKICAgICAgICAgIHNlbmRBbnJFdmVudChzdGFja0ZyYW1lcywgc2NvcGVzKS50aGVuKG51bGwsICgpID0+IHsKICAgICAgICAgICAgbG9nKCdTZW5kaW5nIEFOUiBldmVudCBmYWlsZWQuJyk7CiAgICAgICAgICB9KTsKICAgICAgICB9LAogICAgICApOwogICAgfSBjYXRjaCAoZSkgewogICAgICBzZXNzaW9uLnBvc3QoJ0RlYnVnZ2VyLnJlc3VtZScpOwogICAgICBzZXNzaW9uLnBvc3QoJ0RlYnVnZ2VyLmRpc2FibGUnKTsKICAgICAgdGhyb3cgZTsKICAgIH0KICB9KTsKCiAgZGVidWdnZXJQYXVzZSA9ICgpID0+IHsKICAgIHRyeSB7CiAgICAgIHNlc3Npb24ucG9zdCgnRGVidWdnZXIuZW5hYmxlJywgKCkgPT4gewogICAgICAgIHNlc3Npb24ucG9zdCgnRGVidWdnZXIucGF1c2UnKTsKICAgICAgfSk7CiAgICB9IGNhdGNoIChfKSB7CiAgICAgIC8vCiAgICB9CiAgfTsKfQoKZnVuY3Rpb24gY3JlYXRlSHJUaW1lcigpIHsKICAvLyBUT0RPICh2OCk6IFdlIGNhbiB1c2UgcHJvY2Vzcy5ocnRpbWUuYmlnaW50KCkgYWZ0ZXIgd2UgZHJvcCBub2RlIHY4CiAgbGV0IGxhc3RQb2xsID0gcHJvY2Vzcy5ocnRpbWUoKTsKCiAgcmV0dXJuIHsKICAgIGdldFRpbWVNczogKCkgPT4gewogICAgICBjb25zdCBbc2Vjb25kcywgbmFub1NlY29uZHNdID0gcHJvY2Vzcy5ocnRpbWUobGFzdFBvbGwpOwogICAgICByZXR1cm4gTWF0aC5mbG9vcihzZWNvbmRzICogMWUzICsgbmFub1NlY29uZHMgLyAxZTYpOwogICAgfSwKICAgIHJlc2V0OiAoKSA9PiB7CiAgICAgIGxhc3RQb2xsID0gcHJvY2Vzcy5ocnRpbWUoKTsKICAgIH0sCiAgfTsKfQoKZnVuY3Rpb24gd2F0Y2hkb2dUaW1lb3V0KCkgewogIGxvZygnV2F0Y2hkb2cgdGltZW91dCcpOwoKICBpZiAoZGVidWdnZXJQYXVzZSkgewogICAgbG9nKCdQYXVzaW5nIGRlYnVnZ2VyIHRvIGNhcHR1cmUgc3RhY2sgdHJhY2UnKTsKICAgIGRlYnVnZ2VyUGF1c2UoKTsKICB9IGVsc2UgewogICAgbG9nKCdDYXB0dXJpbmcgZXZlbnQgd2l0aG91dCBhIHN0YWNrIHRyYWNlJyk7CiAgICBzZW5kQW5yRXZlbnQoKS50aGVuKG51bGwsICgpID0+IHsKICAgICAgbG9nKCdTZW5kaW5nIEFOUiBldmVudCBmYWlsZWQgb24gd2F0Y2hkb2cgdGltZW91dC4nKTsKICAgIH0pOwogIH0KfQoKY29uc3QgeyBwb2xsIH0gPSB3YXRjaGRvZ1RpbWVyKGNyZWF0ZUhyVGltZXIsIG9wdGlvbnMucG9sbEludGVydmFsLCBvcHRpb25zLmFuclRocmVzaG9sZCwgd2F0Y2hkb2dUaW1lb3V0KTsKCl9vcHRpb25hbENoYWluKFtwYXJlbnRQb3J0LCAnb3B0aW9uYWxBY2Nlc3MnLCBfNiA9PiBfNi5vbiwgJ2NhbGwnLCBfNyA9PiBfNygnbWVzc2FnZScsIChtc2cpID0+IHsKICBpZiAobXNnLnNlc3Npb24pIHsKICAgIHNlc3Npb24gPSBtYWtlU2Vzc2lvbihtc2cuc2Vzc2lvbik7CiAgfQoKICBwb2xsKCk7Cn0pXSk7"
})