
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