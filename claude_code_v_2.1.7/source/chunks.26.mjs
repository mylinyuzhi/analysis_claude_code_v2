
// @from(Ln 63628, Col 4)
knA = U((rVQ, sVQ) => {
  var {
    _optionalChain: Mk4,
    _optionalChainDelete: nVQ
  } = CQ();
  Object.defineProperty(rVQ, "__esModule", {
    value: !0
  });
  var Rk4 = NA("url"),
    Tg = U6(),
    vnA = CQ(),
    PT1 = g1A(),
    _k4 = iVQ(),
    jk4 = 50,
    Tk4 = 5000;

  function ST1(A, ...Q) {
    vnA.logger.log(`[ANR] ${A}`, ...Q)
  }

  function Pk4() {
    return vnA.GLOBAL_OBJ
  }

  function Sk4() {
    let A = Tg.getGlobalScope().getScopeData();
    return Tg.mergeScopeData(A, Tg.getIsolationScope().getScopeData()), Tg.mergeScopeData(A, Tg.getCurrentScope().getScopeData()), A.attachments = [], A.eventProcessors = [], A
  }

  function xk4() {
    return vnA.dynamicRequire(sVQ, "worker_threads")
  }
  async function yk4(A) {
    let Q = {
        message: "ANR"
      },
      B = {};
    for (let G of A.getEventProcessors()) {
      if (Q === null) break;
      Q = await G(Q, B)
    }
    return Mk4([Q, "optionalAccess", (G) => G.contexts]) || {}
  }
  var aVQ = "Anr",
    vk4 = (A = {}) => {
      if (PT1.NODE_VERSION.major < 16 || PT1.NODE_VERSION.major === 16 && PT1.NODE_VERSION.minor < 17) throw Error("ANR detection requires Node 16.17.0 or later");
      let Q, B, G = Pk4();
      return G.__SENTRY_GET_SCOPES__ = Sk4, {
        name: aVQ,
        setupOnce() {},
        startWorker: () => {
          if (Q) return;
          if (B) Q = bk4(B, A)
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
    oVQ = Tg.defineIntegration(vk4),
    kk4 = Tg.convertIntegrationFnToClass(aVQ, oVQ);
  async function bk4(A, Q) {
    let B = A.getDsn();
    if (!B) return () => {};
    let G = await yk4(A);
    nVQ([G, "access", (W) => W.app, "optionalAccess", (W) => delete W.app_memory]), nVQ([G, "access", (W) => W.device, "optionalAccess", (W) => delete W.free_memory]);
    let Z = A.getOptions(),
      Y = A.getSdkMetadata() || {};
    if (Y.sdk) Y.sdk.integrations = Z.integrations.map((W) => W.name);
    let J = {
      debug: vnA.logger.isEnabled(),
      dsn: B,
      environment: Z.environment || "production",
      release: Z.release,
      dist: Z.dist,
      sdkMetadata: Y,
      appRootPath: Q.appRootPath,
      pollInterval: Q.pollInterval || jk4,
      anrThreshold: Q.anrThreshold || Tk4,
      captureStackTrace: !!Q.captureStackTrace,
      staticTags: Q.staticTags || {},
      contexts: G
    };
    if (J.captureStackTrace) {
      let W = NA("inspector");
      if (!W.url()) W.open(0)
    }
    let {
      Worker: X
    } = xk4(), I = new X(new Rk4.URL(`data:application/javascript;base64,${_k4.base64WorkerScript}`), {
      workerData: J
    });
    process.on("exit", () => {
      I.terminate()
    });
    let D = setInterval(() => {
      try {
        let W = Tg.getCurrentScope().getSession(),
          K = W ? {
            ...W,
            toJSON: void 0
          } : void 0;
        I.postMessage({
          session: K
        })
      } catch (W) {}
    }, J.pollInterval);
    return D.unref(), I.on("message", (W) => {
      if (W === "session-ended") ST1("ANR event sent from ANR worker. Clearing session in this thread."), Tg.getCurrentScope().setSession(void 0)
    }), I.once("error", (W) => {
      clearInterval(D), ST1("ANR worker error", W)
    }), I.once("exit", (W) => {
      clearInterval(D), ST1("ANR worker exit", W)
    }), I.unref(), () => {
      I.terminate(), clearInterval(D)
    }
  }
  rVQ.Anr = kk4;
  rVQ.anrIntegration = oVQ
})
// @from(Ln 63753, Col 4)
eVQ = U((tVQ) => {
  Object.defineProperty(tVQ, "__esModule", {
    value: !0
  });
  var gk4 = U6(),
    uk4 = knA();

  function mk4(A) {
    let Q = gk4.getClient();
    return new uk4.Anr(A).setup(Q), Promise.resolve()
  }
  tVQ.enableAnrDetection = mk4
})
// @from(Ln 63766, Col 4)
xT1 = U((BFQ) => {
  var {
    _optionalChain: AFQ
  } = CQ();
  Object.defineProperty(BFQ, "__esModule", {
    value: !0
  });
  var qZA = U6(),
    QFQ = CQ();

  function ck4(A = {}) {
    return function ({
      path: Q,
      type: B,
      next: G,
      rawInput: Z
    }) {
      let Y = AFQ([qZA.getClient, "call", (D) => D(), "optionalAccess", (D) => D.getOptions, "call", (D) => D()]),
        J = qZA.getCurrentScope().getTransaction();
      if (J) {
        J.updateName(`trpc/${Q}`), J.setAttribute(qZA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, "route"), J.op = "rpc.server";
        let D = {
          procedure_type: B
        };
        if (A.attachRpcInput !== void 0 ? A.attachRpcInput : AFQ([Y, "optionalAccess", (W) => W.sendDefaultPii])) D.input = QFQ.normalize(Z);
        J.setContext("trpc", D)
      }

      function X(D) {
        if (!D.ok) qZA.captureException(D.error, {
          mechanism: {
            handled: !1,
            data: {
              function: "trpcMiddleware"
            }
          }
        })
      }
      let I;
      try {
        I = G()
      } catch (D) {
        throw qZA.captureException(D, {
          mechanism: {
            handled: !1,
            data: {
              function: "trpcMiddleware"
            }
          }
        }), D
      }
      if (QFQ.isThenable(I)) Promise.resolve(I).then((D) => {
        X(D)
      }, (D) => {
        qZA.captureException(D, {
          mechanism: {
            handled: !1,
            data: {
              function: "trpcMiddleware"
            }
          }
        })
      });
      else X(I);
      return I
    }
  }
  BFQ.trpcMiddleware = ck4
})
// @from(Ln 63835, Col 4)
YFQ = U((ZFQ) => {
  Object.defineProperty(ZFQ, "__esModule", {
    value: !0
  });
  var GFQ = CQ();

  function lk4(A, Q) {
    return GFQ.extractRequestData(A, {
      include: Q
    })
  }

  function ik4(A, Q, B = {}) {
    return GFQ.addRequestDataToEvent(A, Q, {
      include: B
    })
  }
  ZFQ.extractRequestData = lk4;
  ZFQ.parseRequest = ik4
})
// @from(Ln 63855, Col 4)
IFQ = U((XFQ) => {
  var {
    _optionalChain: bnA
  } = CQ();
  Object.defineProperty(XFQ, "__esModule", {
    value: !0
  });
  var iV = U6(),
    NZA = CQ(),
    ok4 = iqA(),
    fnA = jT1(),
    rk4 = xT1(),
    JFQ = YFQ();

  function sk4() {
    return function (Q, B, G) {
      let Z = bnA([iV.getClient, "call", (W) => W(), "optionalAccess", (W) => W.getOptions, "call", (W) => W()]);
      if (!Z || Z.instrumenter !== "sentry" || bnA([Q, "access", (W) => W.method, "optionalAccess", (W) => W.toUpperCase, "call", (W) => W()]) === "OPTIONS" || bnA([Q, "access", (W) => W.method, "optionalAccess", (W) => W.toUpperCase, "call", (W) => W()]) === "HEAD") return G();
      let Y = Q.headers && NZA.isString(Q.headers["sentry-trace"]) ? Q.headers["sentry-trace"] : void 0,
        J = bnA([Q, "access", (W) => W.headers, "optionalAccess", (W) => W.baggage]);
      if (!iV.hasTracingEnabled(Z)) return G();
      let [X, I] = NZA.extractPathForTransaction(Q, {
        path: !0,
        method: !0
      }), D = iV.continueTrace({
        sentryTrace: Y,
        baggage: J
      }, (W) => iV.startTransaction({
        name: X,
        op: "http.server",
        origin: "auto.http.node.tracingHandler",
        ...W,
        data: {
          [iV.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: I
        },
        metadata: {
          ...W.metadata,
          request: Q
        }
      }, {
        request: NZA.extractRequestData(Q)
      }));
      iV.getCurrentScope().setSpan(D), B.__sentry_transaction = D, B.once("finish", () => {
        setImmediate(() => {
          NZA.addRequestDataToTransaction(D, Q), iV.setHttpStatus(D, B.statusCode), D.end()
        })
      }), G()
    }
  }

  function tk4(A = {}) {
    let Q;
    if ("include" in A) Q = {
      include: A.include
    };
    else {
      let {
        ip: B,
        request: G,
        transaction: Z,
        user: Y
      } = A;
      if (B || G || Z || Y) Q = {
        include: NZA.dropUndefinedKeys({
          ip: B,
          request: G,
          transaction: Z,
          user: Y
        })
      }
    }
    return Q
  }

  function ek4(A) {
    let Q = tk4(A),
      B = iV.getClient();
    if (B && fnA.isAutoSessionTrackingEnabled(B)) {
      B.initSessionFlusher();
      let G = iV.getCurrentScope();
      if (G.getSession()) G.setSession()
    }
    return function (Z, Y, J) {
      if (A && A.flushTimeout && A.flushTimeout > 0) {
        let X = Y.end;
        Y.end = function (I, D, W) {
          iV.flush(A.flushTimeout).then(() => {
            X.call(this, I, D, W)
          }).then(null, (K) => {
            ok4.DEBUG_BUILD && NZA.logger.error(K), X.call(this, I, D, W)
          })
        }
      }
      iV.runWithAsyncContext(() => {
        let X = iV.getCurrentScope();
        X.setSDKProcessingMetadata({
          request: Z,
          requestDataOptionsFromExpressHandler: Q
        });
        let I = iV.getClient();
        if (fnA.isAutoSessionTrackingEnabled(I)) X.setRequestSession({
          status: "ok"
        });
        Y.once("finish", () => {
          let D = iV.getClient();
          if (fnA.isAutoSessionTrackingEnabled(D)) setImmediate(() => {
            if (D && D._captureRequestSession) D._captureRequestSession()
          })
        }), J()
      })
    }
  }

  function Ab4(A) {
    let Q = A.status || A.statusCode || A.status_code || A.output && A.output.statusCode;
    return Q ? parseInt(Q, 10) : 500
  }

  function Qb4(A) {
    return Ab4(A) >= 500
  }

  function Bb4(A) {
    return function (B, G, Z, Y) {
      if ((A && A.shouldHandleError || Qb4)(B)) {
        iV.withScope((X) => {
          X.setSDKProcessingMetadata({
            request: G
          });
          let I = Z.__sentry_transaction;
          if (I && !iV.getActiveSpan()) X.setSpan(I);
          let D = iV.getClient();
          if (D && fnA.isAutoSessionTrackingEnabled(D)) {
            if (D._sessionFlusher !== void 0) {
              let V = X.getRequestSession();
              if (V && V.status !== void 0) V.status = "crashed"
            }
          }
          let W = iV.captureException(B, {
            mechanism: {
              type: "middleware",
              handled: !1
            }
          });
          Z.sentry = W, Y(B)
        });
        return
      }
      Y(B)
    }
  }
  var Gb4 = rk4.trpcMiddleware;
  XFQ.extractRequestData = JFQ.extractRequestData;
  XFQ.parseRequest = JFQ.parseRequest;
  XFQ.errorHandler = Bb4;
  XFQ.requestHandler = ek4;
  XFQ.tracingHandler = sk4;
  XFQ.trpcMiddleware = Gb4
})
// @from(Ln 64014, Col 4)
yT1 = U((EFQ) => {
  Object.defineProperty(EFQ, "__esModule", {
    value: !0
  });
  var Nq = U6(),
    WFQ = CQ();

  function DFQ(A) {
    return A && A.statusCode !== void 0
  }

  function Wb4(A) {
    return A && A.error !== void 0
  }

  function Kb4(A) {
    Nq.captureException(A, {
      mechanism: {
        type: "hapi",
        handled: !1,
        data: {
          function: "hapiErrorPlugin"
        }
      }
    })
  }
  var KFQ = {
      name: "SentryHapiErrorPlugin",
      version: Nq.SDK_VERSION,
      register: async function (A) {
        A.events.on("request", (B, G) => {
          let Z = Nq.getActiveTransaction();
          if (Wb4(G)) Kb4(G.error);
          if (Z) Z.setStatus("internal_error"), Z.end()
        })
      }
    },
    VFQ = {
      name: "SentryHapiTracingPlugin",
      version: Nq.SDK_VERSION,
      register: async function (A) {
        let Q = A;
        Q.ext("onPreHandler", (B, G) => {
          let Z = Nq.continueTrace({
            sentryTrace: B.headers["sentry-trace"] || void 0,
            baggage: B.headers.baggage || void 0
          }, (Y) => {
            return Nq.startTransaction({
              ...Y,
              op: "hapi.request",
              name: B.route.path,
              description: `${B.route.method} ${B.path}`
            })
          });
          return Nq.getCurrentScope().setSpan(Z), G.continue
        }), Q.ext("onPreResponse", (B, G) => {
          let Z = Nq.getActiveTransaction();
          if (B.response && DFQ(B.response) && Z) {
            let Y = B.response;
            Y.header("sentry-trace", Nq.spanToTraceHeader(Z));
            let J = WFQ.dynamicSamplingContextToSentryBaggageHeader(Nq.getDynamicSamplingContextFromSpan(Z));
            if (J) Y.header("baggage", J)
          }
          return G.continue
        }), Q.ext("onPostHandler", (B, G) => {
          let Z = Nq.getActiveTransaction();
          if (Z) {
            if (B.response && DFQ(B.response)) Nq.setHttpStatus(Z, B.response.statusCode);
            Z.end()
          }
          return G.continue
        })
      }
    },
    FFQ = "Hapi",
    Vb4 = (A = {}) => {
      let Q = A.server;
      return {
        name: FFQ,
        setupOnce() {
          if (!Q) return;
          WFQ.fill(Q, "start", (B) => {
            return async function () {
              return await this.register(VFQ), await this.register(KFQ), B.apply(this)
            }
          })
        }
      }
    },
    HFQ = Nq.defineIntegration(Vb4),
    Fb4 = Nq.convertIntegrationFnToClass(FFQ, HFQ);
  EFQ.Hapi = Fb4;
  EFQ.hapiErrorPlugin = KFQ;
  EFQ.hapiIntegration = HFQ;
  EFQ.hapiTracingPlugin = VFQ
})
// @from(Ln 64110, Col 4)
$FQ = U((zFQ) => {
  Object.defineProperty(zFQ, "__esModule", {
    value: !0
  });
  var Cb4 = znA(),
    Ub4 = qnA(),
    qb4 = _nA(),
    Nb4 = TnA(),
    wb4 = OnA(),
    Lb4 = UnA(),
    Ob4 = $nA(),
    Mb4 = U6(),
    Rb4 = LnA(),
    _b4 = xnA(),
    jb4 = PnA(),
    Tb4 = knA(),
    Pb4 = yT1();
  zFQ.Console = Cb4.Console;
  zFQ.Http = Ub4.Http;
  zFQ.OnUncaughtException = qb4.OnUncaughtException;
  zFQ.OnUnhandledRejection = Nb4.OnUnhandledRejection;
  zFQ.Modules = wb4.Modules;
  zFQ.ContextLines = Lb4.ContextLines;
  zFQ.Context = Ob4.Context;
  zFQ.RequestData = Mb4.RequestData;
  zFQ.LocalVariables = Rb4.LocalVariables;
  zFQ.Undici = _b4.Undici;
  zFQ.Spotlight = jb4.Spotlight;
  zFQ.Anr = Tb4.Anr;
  zFQ.Hapi = Pb4.Hapi
})
// @from(Ln 64141, Col 4)
UFQ = U((CFQ) => {
  Object.defineProperty(CFQ, "__esModule", {
    value: !0
  });
  var l1A = KT1();
  CFQ.Apollo = l1A.Apollo;
  CFQ.Express = l1A.Express;
  CFQ.GraphQL = l1A.GraphQL;
  CFQ.Mongo = l1A.Mongo;
  CFQ.Mysql = l1A.Mysql;
  CFQ.Postgres = l1A.Postgres;
  CFQ.Prisma = l1A.Prisma
})
// @from(Ln 64154, Col 4)
LFQ = U((wFQ) => {
  Object.defineProperty(wFQ, "__esModule", {
    value: !0
  });
  var i1A = U6(),
    n1A = CQ(),
    qFQ = "CaptureConsole",
    sb4 = (A = {}) => {
      let Q = A.levels || n1A.CONSOLE_LEVELS;
      return {
        name: qFQ,
        setupOnce() {},
        setup(B) {
          if (!("console" in n1A.GLOBAL_OBJ)) return;
          n1A.addConsoleInstrumentationHandler(({
            args: G,
            level: Z
          }) => {
            if (i1A.getClient() !== B || !Q.includes(Z)) return;
            eb4(G, Z)
          })
        }
      }
    },
    NFQ = i1A.defineIntegration(sb4),
    tb4 = i1A.convertIntegrationFnToClass(qFQ, NFQ);

  function eb4(A, Q) {
    let B = {
      level: n1A.severityLevelFromString(Q),
      extra: {
        arguments: A
      }
    };
    i1A.withScope((G) => {
      if (G.addEventProcessor((J) => {
          return J.logger = "console", n1A.addExceptionMechanism(J, {
            handled: !1,
            type: "console"
          }), J
        }), Q === "assert" && A[0] === !1) {
        let J = `Assertion failed: ${n1A.safeJoin(A.slice(1)," ")||"console.assert"}`;
        G.setExtra("arguments", A.slice(1)), i1A.captureMessage(J, B);
        return
      }
      let Z = A.find((J) => J instanceof Error);
      if (Q === "error" && Z) {
        i1A.captureException(Z, B);
        return
      }
      let Y = n1A.safeJoin(A, " ");
      i1A.captureMessage(Y, B)
    })
  }
  wFQ.CaptureConsole = tb4;
  wFQ.captureConsoleIntegration = NFQ
})
// @from(Ln 64211, Col 4)
jFQ = U((_FQ) => {
  Object.defineProperty(_FQ, "__esModule", {
    value: !0
  });
  var OFQ = U6(),
    Bf4 = CQ(),
    MFQ = "Debug",
    Gf4 = (A = {}) => {
      let Q = {
        debugger: !1,
        stringify: !1,
        ...A
      };
      return {
        name: MFQ,
        setupOnce() {},
        setup(B) {
          if (!B.on) return;
          B.on("beforeSendEvent", (G, Z) => {
            if (Q.debugger) debugger;
            Bf4.consoleSandbox(() => {
              if (Q.stringify) {
                if (console.log(JSON.stringify(G, null, 2)), Z && Object.keys(Z).length) console.log(JSON.stringify(Z, null, 2))
              } else if (console.log(G), Z && Object.keys(Z).length) console.log(Z)
            })
          })
        }
      }
    },
    RFQ = OFQ.defineIntegration(Gf4),
    Zf4 = OFQ.convertIntegrationFnToClass(MFQ, RFQ);
  _FQ.Debug = Zf4;
  _FQ.debugIntegration = RFQ
})
// @from(Ln 64245, Col 4)
aqA = U((TFQ) => {
  Object.defineProperty(TFQ, "__esModule", {
    value: !0
  });
  var Xf4 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  TFQ.DEBUG_BUILD = Xf4
})
// @from(Ln 64252, Col 4)
gFQ = U((hFQ) => {
  Object.defineProperty(hFQ, "__esModule", {
    value: !0
  });
  var xFQ = U6(),
    Df4 = CQ(),
    Wf4 = aqA(),
    yFQ = "Dedupe",
    Kf4 = () => {
      let A;
      return {
        name: yFQ,
        setupOnce() {},
        processEvent(Q) {
          if (Q.type) return Q;
          try {
            if (kFQ(Q, A)) return Wf4.DEBUG_BUILD && Df4.logger.warn("Event dropped due to being a duplicate of previously captured event."), null
          } catch (B) {}
          return A = Q
        }
      }
    },
    vFQ = xFQ.defineIntegration(Kf4),
    Vf4 = xFQ.convertIntegrationFnToClass(yFQ, vFQ);

  function kFQ(A, Q) {
    if (!Q) return !1;
    if (Ff4(A, Q)) return !0;
    if (Hf4(A, Q)) return !0;
    return !1
  }

  function Ff4(A, Q) {
    let B = A.message,
      G = Q.message;
    if (!B && !G) return !1;
    if (B && !G || !B && G) return !1;
    if (B !== G) return !1;
    if (!fFQ(A, Q)) return !1;
    if (!bFQ(A, Q)) return !1;
    return !0
  }

  function Hf4(A, Q) {
    let B = PFQ(Q),
      G = PFQ(A);
    if (!B || !G) return !1;
    if (B.type !== G.type || B.value !== G.value) return !1;
    if (!fFQ(A, Q)) return !1;
    if (!bFQ(A, Q)) return !1;
    return !0
  }

  function bFQ(A, Q) {
    let B = SFQ(A),
      G = SFQ(Q);
    if (!B && !G) return !0;
    if (B && !G || !B && G) return !1;
    if (B = B, G = G, G.length !== B.length) return !1;
    for (let Z = 0; Z < G.length; Z++) {
      let Y = G[Z],
        J = B[Z];
      if (Y.filename !== J.filename || Y.lineno !== J.lineno || Y.colno !== J.colno || Y.function !== J.function) return !1
    }
    return !0
  }

  function fFQ(A, Q) {
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

  function PFQ(A) {
    return A.exception && A.exception.values && A.exception.values[0]
  }

  function SFQ(A) {
    let Q = A.exception;
    if (Q) try {
      return Q.values[0].stacktrace.frames
    } catch (B) {
      return
    }
    return
  }
  hFQ.Dedupe = Vf4;
  hFQ._shouldDropEvent = kFQ;
  hFQ.dedupeIntegration = vFQ
})
// @from(Ln 64349, Col 4)
pFQ = U((cFQ) => {
  Object.defineProperty(cFQ, "__esModule", {
    value: !0
  });
  var uFQ = U6(),
    Ti = CQ(),
    Cf4 = aqA(),
    mFQ = "ExtraErrorData",
    Uf4 = (A = {}) => {
      let Q = A.depth || 3,
        B = A.captureErrorCause || !1;
      return {
        name: mFQ,
        setupOnce() {},
        processEvent(G, Z) {
          return Nf4(G, Z, Q, B)
        }
      }
    },
    dFQ = uFQ.defineIntegration(Uf4),
    qf4 = uFQ.convertIntegrationFnToClass(mFQ, dFQ);

  function Nf4(A, Q = {}, B, G) {
    if (!Q.originalException || !Ti.isError(Q.originalException)) return A;
    let Z = Q.originalException.name || Q.originalException.constructor.name,
      Y = wf4(Q.originalException, G);
    if (Y) {
      let J = {
          ...A.contexts
        },
        X = Ti.normalize(Y, B);
      if (Ti.isPlainObject(X)) Ti.addNonEnumerableProperty(X, "__sentry_skip_normalization__", !0), J[Z] = X;
      return {
        ...A,
        contexts: J
      }
    }
    return A
  }

  function wf4(A, Q) {
    try {
      let B = ["name", "message", "stack", "line", "column", "fileName", "lineNumber", "columnNumber", "toJSON"],
        G = {};
      for (let Z of Object.keys(A)) {
        if (B.indexOf(Z) !== -1) continue;
        let Y = A[Z];
        G[Z] = Ti.isError(Y) ? Y.toString() : Y
      }
      if (Q && A.cause !== void 0) G.cause = Ti.isError(A.cause) ? A.cause.toString() : A.cause;
      if (typeof A.toJSON === "function") {
        let Z = A.toJSON();
        for (let Y of Object.keys(Z)) {
          let J = Z[Y];
          G[Y] = Ti.isError(J) ? J.toString() : J
        }
      }
      return G
    } catch (B) {
      Cf4.DEBUG_BUILD && Ti.logger.error("Unable to extract extra data from the Error object:", B)
    }
    return null
  }
  cFQ.ExtraErrorData = qf4;
  cFQ.extraErrorDataIntegration = dFQ
})
// @from(Ln 64415, Col 4)
iFQ = U((lFQ, vT1) => {
  /*!
      localForage -- Offline Storage, Improved
      Version 1.10.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  */
  (function (A) {
    if (typeof lFQ === "object" && typeof vT1 < "u") vT1.exports = A();
    else if (typeof define === "function" && define.amd) define([], A);
    else {
      var Q;
      if (typeof window < "u") Q = window;
      else if (typeof global < "u") Q = global;
      else if (typeof self < "u") Q = self;
      else Q = this;
      Q.localforage = A()
    }
  })(function () {
    var A, Q, B;
    return function G(Z, Y, J) {
      function X(W, K) {
        if (!Y[W]) {
          if (!Z[W]) {
            var V = NA;
            if (!K && V) return V(W, !0);
            if (I) return I(W, !0);
            var F = Error("Cannot find module '" + W + "'");
            throw F.code = "MODULE_NOT_FOUND", F
          }
          var H = Y[W] = {
            exports: {}
          };
          Z[W][0].call(H.exports, function (E) {
            var z = Z[W][1][E];
            return X(z ? z : E)
          }, H, H.exports, G, Z, Y, J)
        }
        return Y[W].exports
      }
      var I = NA;
      for (var D = 0; D < J.length; D++) X(J[D]);
      return X
    }({
      1: [function (G, Z, Y) {
        (function (J) {
          var X = J.MutationObserver || J.WebKitMutationObserver,
            I;
          if (X) {
            var D = 0,
              W = new X(E),
              K = J.document.createTextNode("");
            W.observe(K, {
              characterData: !0
            }), I = function () {
              K.data = D = ++D % 2
            }
          } else if (!J.setImmediate && typeof J.MessageChannel < "u") {
            var V = new J.MessageChannel;
            V.port1.onmessage = E, I = function () {
              V.port2.postMessage(0)
            }
          } else if ("document" in J && "onreadystatechange" in J.document.createElement("script")) I = function () {
            var $ = J.document.createElement("script");
            $.onreadystatechange = function () {
              E(), $.onreadystatechange = null, $.parentNode.removeChild($), $ = null
            }, J.document.documentElement.appendChild($)
          };
          else I = function () {
            setTimeout(E, 0)
          };
          var F, H = [];

          function E() {
            F = !0;
            var $, O, L = H.length;
            while (L) {
              O = H, H = [], $ = -1;
              while (++$ < L) O[$]();
              L = H.length
            }
            F = !1
          }
          Z.exports = z;

          function z($) {
            if (H.push($) === 1 && !F) I()
          }
        }).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {})
      }, {}],
      2: [function (G, Z, Y) {
        var J = G(1);

        function X() {}
        var I = {},
          D = ["REJECTED"],
          W = ["FULFILLED"],
          K = ["PENDING"];
        Z.exports = V;

        function V(j) {
          if (typeof j !== "function") throw TypeError("resolver must be a function");
          if (this.state = K, this.queue = [], this.outcome = void 0, j !== X) z(this, j)
        }
        V.prototype.catch = function (j) {
          return this.then(null, j)
        }, V.prototype.then = function (j, x) {
          if (typeof j !== "function" && this.state === W || typeof x !== "function" && this.state === D) return this;
          var b = new this.constructor(X);
          if (this.state !== K) {
            var S = this.state === W ? j : x;
            H(b, S, this.outcome)
          } else this.queue.push(new F(b, j, x));
          return b
        };

        function F(j, x, b) {
          if (this.promise = j, typeof x === "function") this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled;
          if (typeof b === "function") this.onRejected = b, this.callRejected = this.otherCallRejected
        }
        F.prototype.callFulfilled = function (j) {
          I.resolve(this.promise, j)
        }, F.prototype.otherCallFulfilled = function (j) {
          H(this.promise, this.onFulfilled, j)
        }, F.prototype.callRejected = function (j) {
          I.reject(this.promise, j)
        }, F.prototype.otherCallRejected = function (j) {
          H(this.promise, this.onRejected, j)
        };

        function H(j, x, b) {
          J(function () {
            var S;
            try {
              S = x(b)
            } catch (u) {
              return I.reject(j, u)
            }
            if (S === j) I.reject(j, TypeError("Cannot resolve promise with itself"));
            else I.resolve(j, S)
          })
        }
        I.resolve = function (j, x) {
          var b = $(E, x);
          if (b.status === "error") return I.reject(j, b.value);
          var S = b.value;
          if (S) z(j, S);
          else {
            j.state = W, j.outcome = x;
            var u = -1,
              f = j.queue.length;
            while (++u < f) j.queue[u].callFulfilled(x)
          }
          return j
        }, I.reject = function (j, x) {
          j.state = D, j.outcome = x;
          var b = -1,
            S = j.queue.length;
          while (++b < S) j.queue[b].callRejected(x);
          return j
        };

        function E(j) {
          var x = j && j.then;
          if (j && (typeof j === "object" || typeof j === "function") && typeof x === "function") return function () {
            x.apply(j, arguments)
          }
        }

        function z(j, x) {
          var b = !1;

          function S(n) {
            if (b) return;
            b = !0, I.reject(j, n)
          }

          function u(n) {
            if (b) return;
            b = !0, I.resolve(j, n)
          }

          function f() {
            x(u, S)
          }
          var AA = $(f);
          if (AA.status === "error") S(AA.value)
        }

        function $(j, x) {
          var b = {};
          try {
            b.value = j(x), b.status = "success"
          } catch (S) {
            b.status = "error", b.value = S
          }
          return b
        }
        V.resolve = O;

        function O(j) {
          if (j instanceof this) return j;
          return I.resolve(new this(X), j)
        }
        V.reject = L;

        function L(j) {
          var x = new this(X);
          return I.reject(x, j)
        }
        V.all = M;

        function M(j) {
          var x = this;
          if (Object.prototype.toString.call(j) !== "[object Array]") return this.reject(TypeError("must be an array"));
          var b = j.length,
            S = !1;
          if (!b) return this.resolve([]);
          var u = Array(b),
            f = 0,
            AA = -1,
            n = new this(X);
          while (++AA < b) y(j[AA], AA);
          return n;

          function y(p, GA) {
            x.resolve(p).then(WA, function (MA) {
              if (!S) S = !0, I.reject(n, MA)
            });

            function WA(MA) {
              if (u[GA] = MA, ++f === b && !S) S = !0, I.resolve(n, u)
            }
          }
        }
        V.race = _;

        function _(j) {
          var x = this;
          if (Object.prototype.toString.call(j) !== "[object Array]") return this.reject(TypeError("must be an array"));
          var b = j.length,
            S = !1;
          if (!b) return this.resolve([]);
          var u = -1,
            f = new this(X);
          while (++u < b) AA(j[u]);
          return f;

          function AA(n) {
            x.resolve(n).then(function (y) {
              if (!S) S = !0, I.resolve(f, y)
            }, function (y) {
              if (!S) S = !0, I.reject(f, y)
            })
          }
        }
      }, {
        "1": 1
      }],
      3: [function (G, Z, Y) {
        (function (J) {
          if (typeof J.Promise !== "function") J.Promise = G(2)
        }).call(this, typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {})
      }, {
        "2": 2
      }],
      4: [function (G, Z, Y) {
        var J = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (oA) {
          return typeof oA
        } : function (oA) {
          return oA && typeof Symbol === "function" && oA.constructor === Symbol && oA !== Symbol.prototype ? "symbol" : typeof oA
        };

        function X(oA, VA) {
          if (!(oA instanceof VA)) throw TypeError("Cannot call a class as a function")
        }

        function I() {
          try {
            if (typeof indexedDB < "u") return indexedDB;
            if (typeof webkitIndexedDB < "u") return webkitIndexedDB;
            if (typeof mozIndexedDB < "u") return mozIndexedDB;
            if (typeof OIndexedDB < "u") return OIndexedDB;
            if (typeof msIndexedDB < "u") return msIndexedDB
          } catch (oA) {
            return
          }
        }
        var D = I();

        function W() {
          try {
            if (!D || !D.open) return !1;
            var oA = typeof openDatabase < "u" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform),
              VA = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
            return (!oA || VA) && typeof indexedDB < "u" && typeof IDBKeyRange < "u"
          } catch (XA) {
            return !1
          }
        }

        function K(oA, VA) {
          oA = oA || [], VA = VA || {};
          try {
            return new Blob(oA, VA)
          } catch (dA) {
            if (dA.name !== "TypeError") throw dA;
            var XA = typeof BlobBuilder < "u" ? BlobBuilder : typeof MSBlobBuilder < "u" ? MSBlobBuilder : typeof MozBlobBuilder < "u" ? MozBlobBuilder : WebKitBlobBuilder,
              kA = new XA;
            for (var uA = 0; uA < oA.length; uA += 1) kA.append(oA[uA]);
            return kA.getBlob(VA.type)
          }
        }
        if (typeof Promise > "u") G(3);
        var V = Promise;

        function F(oA, VA) {
          if (VA) oA.then(function (XA) {
            VA(null, XA)
          }, function (XA) {
            VA(XA)
          })
        }

        function H(oA, VA, XA) {
          if (typeof VA === "function") oA.then(VA);
          if (typeof XA === "function") oA.catch(XA)
        }

        function E(oA) {
          if (typeof oA !== "string") console.warn(oA + " used as a key, but it is not a string."), oA = String(oA);
          return oA
        }

        function z() {
          if (arguments.length && typeof arguments[arguments.length - 1] === "function") return arguments[arguments.length - 1]
        }
        var $ = "local-forage-detect-blob-support",
          O = void 0,
          L = {},
          M = Object.prototype.toString,
          _ = "readonly",
          j = "readwrite";

        function x(oA) {
          var VA = oA.length,
            XA = new ArrayBuffer(VA),
            kA = new Uint8Array(XA);
          for (var uA = 0; uA < VA; uA++) kA[uA] = oA.charCodeAt(uA);
          return XA
        }

        function b(oA) {
          return new V(function (VA) {
            var XA = oA.transaction($, j),
              kA = K([""]);
            XA.objectStore($).put(kA, "key"), XA.onabort = function (uA) {
              uA.preventDefault(), uA.stopPropagation(), VA(!1)
            }, XA.oncomplete = function () {
              var uA = navigator.userAgent.match(/Chrome\/(\d+)/),
                dA = navigator.userAgent.match(/Edge\//);
              VA(dA || !uA || parseInt(uA[1], 10) >= 43)
            }
          }).catch(function () {
            return !1
          })
        }

        function S(oA) {
          if (typeof O === "boolean") return V.resolve(O);
          return b(oA).then(function (VA) {
            return O = VA, O
          })
        }

        function u(oA) {
          var VA = L[oA.name],
            XA = {};
          if (XA.promise = new V(function (kA, uA) {
              XA.resolve = kA, XA.reject = uA
            }), VA.deferredOperations.push(XA), !VA.dbReady) VA.dbReady = XA.promise;
          else VA.dbReady = VA.dbReady.then(function () {
            return XA.promise
          })
        }

        function f(oA) {
          var VA = L[oA.name],
            XA = VA.deferredOperations.pop();
          if (XA) return XA.resolve(), XA.promise
        }

        function AA(oA, VA) {
          var XA = L[oA.name],
            kA = XA.deferredOperations.pop();
          if (kA) return kA.reject(VA), kA.promise
        }

        function n(oA, VA) {
          return new V(function (XA, kA) {
            if (L[oA.name] = L[oA.name] || IA(), oA.db)
              if (VA) u(oA), oA.db.close();
              else return XA(oA.db);
            var uA = [oA.name];
            if (VA) uA.push(oA.version);
            var dA = D.open.apply(D, uA);
            if (VA) dA.onupgradeneeded = function (C1) {
              var j1 = dA.result;
              try {
                if (j1.createObjectStore(oA.storeName), C1.oldVersion <= 1) j1.createObjectStore($)
              } catch (k1) {
                if (k1.name === "ConstraintError") console.warn('The database "' + oA.name + '" has been upgraded from version ' + C1.oldVersion + " to version " + C1.newVersion + ', but the storage "' + oA.storeName + '" already exists.');
                else throw k1
              }
            };
            dA.onerror = function (C1) {
              C1.preventDefault(), kA(dA.error)
            }, dA.onsuccess = function () {
              var C1 = dA.result;
              C1.onversionchange = function (j1) {
                j1.target.close()
              }, XA(C1), f(oA)
            }
          })
        }

        function y(oA) {
          return n(oA, !1)
        }

        function p(oA) {
          return n(oA, !0)
        }

        function GA(oA, VA) {
          if (!oA.db) return !0;
          var XA = !oA.db.objectStoreNames.contains(oA.storeName),
            kA = oA.version < oA.db.version,
            uA = oA.version > oA.db.version;
          if (kA) {
            if (oA.version !== VA) console.warn('The database "' + oA.name + `" can't be downgraded from version ` + oA.db.version + " to version " + oA.version + ".");
            oA.version = oA.db.version
          }
          if (uA || XA) {
            if (XA) {
              var dA = oA.db.version + 1;
              if (dA > oA.version) oA.version = dA
            }
            return !0
          }
          return !1
        }

        function WA(oA) {
          return new V(function (VA, XA) {
            var kA = new FileReader;
            kA.onerror = XA, kA.onloadend = function (uA) {
              var dA = btoa(uA.target.result || "");
              VA({
                __local_forage_encoded_blob: !0,
                data: dA,
                type: oA.type
              })
            }, kA.readAsBinaryString(oA)
          })
        }

        function MA(oA) {
          var VA = x(atob(oA.data));
          return K([VA], {
            type: oA.type
          })
        }

        function TA(oA) {
          return oA && oA.__local_forage_encoded_blob
        }

        function bA(oA) {
          var VA = this,
            XA = VA._initReady().then(function () {
              var kA = L[VA._dbInfo.name];
              if (kA && kA.dbReady) return kA.dbReady
            });
          return H(XA, oA, oA), XA
        }

        function jA(oA) {
          u(oA);
          var VA = L[oA.name],
            XA = VA.forages;
          for (var kA = 0; kA < XA.length; kA++) {
            var uA = XA[kA];
            if (uA._dbInfo.db) uA._dbInfo.db.close(), uA._dbInfo.db = null
          }
          return oA.db = null, y(oA).then(function (dA) {
            if (oA.db = dA, GA(oA)) return p(oA);
            return dA
          }).then(function (dA) {
            oA.db = VA.db = dA;
            for (var C1 = 0; C1 < XA.length; C1++) XA[C1]._dbInfo.db = dA
          }).catch(function (dA) {
            throw AA(oA, dA), dA
          })
        }

        function OA(oA, VA, XA, kA) {
          if (kA === void 0) kA = 1;
          try {
            var uA = oA.db.transaction(oA.storeName, VA);
            XA(null, uA)
          } catch (dA) {
            if (kA > 0 && (!oA.db || dA.name === "InvalidStateError" || dA.name === "NotFoundError")) return V.resolve().then(function () {
              if (!oA.db || dA.name === "NotFoundError" && !oA.db.objectStoreNames.contains(oA.storeName) && oA.version <= oA.db.version) {
                if (oA.db) oA.version = oA.db.version + 1;
                return p(oA)
              }
            }).then(function () {
              return jA(oA).then(function () {
                OA(oA, VA, XA, kA - 1)
              })
            }).catch(XA);
            XA(dA)
          }
        }

        function IA() {
          return {
            forages: [],
            db: null,
            dbReady: null,
            deferredOperations: []
          }
        }

        function HA(oA) {
          var VA = this,
            XA = {
              db: null
            };
          if (oA)
            for (var kA in oA) XA[kA] = oA[kA];
          var uA = L[XA.name];
          if (!uA) uA = IA(), L[XA.name] = uA;
          if (uA.forages.push(VA), !VA._initReady) VA._initReady = VA.ready, VA.ready = bA;
          var dA = [];

          function C1() {
            return V.resolve()
          }
          for (var j1 = 0; j1 < uA.forages.length; j1++) {
            var k1 = uA.forages[j1];
            if (k1 !== VA) dA.push(k1._initReady().catch(C1))
          }
          var s1 = uA.forages.slice(0);
          return V.all(dA).then(function () {
            return XA.db = uA.db, y(XA)
          }).then(function (p1) {
            if (XA.db = p1, GA(XA, VA._defaultConfig.version)) return p(XA);
            return p1
          }).then(function (p1) {
            XA.db = uA.db = p1, VA._dbInfo = XA;
            for (var M0 = 0; M0 < s1.length; M0++) {
              var gQ = s1[M0];
              if (gQ !== VA) gQ._dbInfo.db = XA.db, gQ._dbInfo.version = XA.version
            }
          })
        }

        function ZA(oA, VA) {
          var XA = this;
          oA = E(oA);
          var kA = new V(function (uA, dA) {
            XA.ready().then(function () {
              OA(XA._dbInfo, _, function (C1, j1) {
                if (C1) return dA(C1);
                try {
                  var k1 = j1.objectStore(XA._dbInfo.storeName),
                    s1 = k1.get(oA);
                  s1.onsuccess = function () {
                    var p1 = s1.result;
                    if (p1 === void 0) p1 = null;
                    if (TA(p1)) p1 = MA(p1);
                    uA(p1)
                  }, s1.onerror = function () {
                    dA(s1.error)
                  }
                } catch (p1) {
                  dA(p1)
                }
              })
            }).catch(dA)
          });
          return F(kA, VA), kA
        }

        function zA(oA, VA) {
          var XA = this,
            kA = new V(function (uA, dA) {
              XA.ready().then(function () {
                OA(XA._dbInfo, _, function (C1, j1) {
                  if (C1) return dA(C1);
                  try {
                    var k1 = j1.objectStore(XA._dbInfo.storeName),
                      s1 = k1.openCursor(),
                      p1 = 1;
                    s1.onsuccess = function () {
                      var M0 = s1.result;
                      if (M0) {
                        var gQ = M0.value;
                        if (TA(gQ)) gQ = MA(gQ);
                        var _B = oA(gQ, M0.key, p1++);
                        if (_B !== void 0) uA(_B);
                        else M0.continue()
                      } else uA()
                    }, s1.onerror = function () {
                      dA(s1.error)
                    }
                  } catch (M0) {
                    dA(M0)
                  }
                })
              }).catch(dA)
            });
          return F(kA, VA), kA
        }

        function wA(oA, VA, XA) {
          var kA = this;
          oA = E(oA);
          var uA = new V(function (dA, C1) {
            var j1;
            kA.ready().then(function () {
              if (j1 = kA._dbInfo, M.call(VA) === "[object Blob]") return S(j1.db).then(function (k1) {
                if (k1) return VA;
                return WA(VA)
              });
              return VA
            }).then(function (k1) {
              OA(kA._dbInfo, j, function (s1, p1) {
                if (s1) return C1(s1);
                try {
                  var M0 = p1.objectStore(kA._dbInfo.storeName);
                  if (k1 === null) k1 = void 0;
                  var gQ = M0.put(k1, oA);
                  p1.oncomplete = function () {
                    if (k1 === void 0) k1 = null;
                    dA(k1)
                  }, p1.onabort = p1.onerror = function () {
                    var _B = gQ.error ? gQ.error : gQ.transaction.error;
                    C1(_B)
                  }
                } catch (_B) {
                  C1(_B)
                }
              })
            }).catch(C1)
          });
          return F(uA, XA), uA
        }

        function _A(oA, VA) {
          var XA = this;
          oA = E(oA);
          var kA = new V(function (uA, dA) {
            XA.ready().then(function () {
              OA(XA._dbInfo, j, function (C1, j1) {
                if (C1) return dA(C1);
                try {
                  var k1 = j1.objectStore(XA._dbInfo.storeName),
                    s1 = k1.delete(oA);
                  j1.oncomplete = function () {
                    uA()
                  }, j1.onerror = function () {
                    dA(s1.error)
                  }, j1.onabort = function () {
                    var p1 = s1.error ? s1.error : s1.transaction.error;
                    dA(p1)
                  }
                } catch (p1) {
                  dA(p1)
                }
              })
            }).catch(dA)
          });
          return F(kA, VA), kA
        }

        function s(oA) {
          var VA = this,
            XA = new V(function (kA, uA) {
              VA.ready().then(function () {
                OA(VA._dbInfo, j, function (dA, C1) {
                  if (dA) return uA(dA);
                  try {
                    var j1 = C1.objectStore(VA._dbInfo.storeName),
                      k1 = j1.clear();
                    C1.oncomplete = function () {
                      kA()
                    }, C1.onabort = C1.onerror = function () {
                      var s1 = k1.error ? k1.error : k1.transaction.error;
                      uA(s1)
                    }
                  } catch (s1) {
                    uA(s1)
                  }
                })
              }).catch(uA)
            });
          return F(XA, oA), XA
        }

        function t(oA) {
          var VA = this,
            XA = new V(function (kA, uA) {
              VA.ready().then(function () {
                OA(VA._dbInfo, _, function (dA, C1) {
                  if (dA) return uA(dA);
                  try {
                    var j1 = C1.objectStore(VA._dbInfo.storeName),
                      k1 = j1.count();
                    k1.onsuccess = function () {
                      kA(k1.result)
                    }, k1.onerror = function () {
                      uA(k1.error)
                    }
                  } catch (s1) {
                    uA(s1)
                  }
                })
              }).catch(uA)
            });
          return F(XA, oA), XA
        }

        function BA(oA, VA) {
          var XA = this,
            kA = new V(function (uA, dA) {
              if (oA < 0) {
                uA(null);
                return
              }
              XA.ready().then(function () {
                OA(XA._dbInfo, _, function (C1, j1) {
                  if (C1) return dA(C1);
                  try {
                    var k1 = j1.objectStore(XA._dbInfo.storeName),
                      s1 = !1,
                      p1 = k1.openKeyCursor();
                    p1.onsuccess = function () {
                      var M0 = p1.result;
                      if (!M0) {
                        uA(null);
                        return
                      }
                      if (oA === 0) uA(M0.key);
                      else if (!s1) s1 = !0, M0.advance(oA);
                      else uA(M0.key)
                    }, p1.onerror = function () {
                      dA(p1.error)
                    }
                  } catch (M0) {
                    dA(M0)
                  }
                })
              }).catch(dA)
            });
          return F(kA, VA), kA
        }

        function DA(oA) {
          var VA = this,
            XA = new V(function (kA, uA) {
              VA.ready().then(function () {
                OA(VA._dbInfo, _, function (dA, C1) {
                  if (dA) return uA(dA);
                  try {
                    var j1 = C1.objectStore(VA._dbInfo.storeName),
                      k1 = j1.openKeyCursor(),
                      s1 = [];
                    k1.onsuccess = function () {
                      var p1 = k1.result;
                      if (!p1) {
                        kA(s1);
                        return
                      }
                      s1.push(p1.key), p1.continue()
                    }, k1.onerror = function () {
                      uA(k1.error)
                    }
                  } catch (p1) {
                    uA(p1)
                  }
                })
              }).catch(uA)
            });
          return F(XA, oA), XA
        }

        function CA(oA, VA) {
          VA = z.apply(this, arguments);
          var XA = this.config();
          if (oA = typeof oA !== "function" && oA || {}, !oA.name) oA.name = oA.name || XA.name, oA.storeName = oA.storeName || XA.storeName;
          var kA = this,
            uA;
          if (!oA.name) uA = V.reject("Invalid arguments");
          else {
            var dA = oA.name === XA.name && kA._dbInfo.db,
              C1 = dA ? V.resolve(kA._dbInfo.db) : y(oA).then(function (j1) {
                var k1 = L[oA.name],
                  s1 = k1.forages;
                k1.db = j1;
                for (var p1 = 0; p1 < s1.length; p1++) s1[p1]._dbInfo.db = j1;
                return j1
              });
            if (!oA.storeName) uA = C1.then(function (j1) {
              u(oA);
              var k1 = L[oA.name],
                s1 = k1.forages;
              j1.close();
              for (var p1 = 0; p1 < s1.length; p1++) {
                var M0 = s1[p1];
                M0._dbInfo.db = null
              }
              var gQ = new V(function (_B, T2) {
                var n2 = D.deleteDatabase(oA.name);
                n2.onerror = function () {
                  var Q4 = n2.result;
                  if (Q4) Q4.close();
                  T2(n2.error)
                }, n2.onblocked = function () {
                  console.warn('dropInstance blocked for database "' + oA.name + '" until all open connections are closed')
                }, n2.onsuccess = function () {
                  var Q4 = n2.result;
                  if (Q4) Q4.close();
                  _B(Q4)
                }
              });
              return gQ.then(function (_B) {
                k1.db = _B;
                for (var T2 = 0; T2 < s1.length; T2++) {
                  var n2 = s1[T2];
                  f(n2._dbInfo)
                }
              }).catch(function (_B) {
                throw (AA(oA, _B) || V.resolve()).catch(function () {}), _B
              })
            });
            else uA = C1.then(function (j1) {
              if (!j1.objectStoreNames.contains(oA.storeName)) return;
              var k1 = j1.version + 1;
              u(oA);
              var s1 = L[oA.name],
                p1 = s1.forages;
              j1.close();
              for (var M0 = 0; M0 < p1.length; M0++) {
                var gQ = p1[M0];
                gQ._dbInfo.db = null, gQ._dbInfo.version = k1
              }
              var _B = new V(function (T2, n2) {
                var Q4 = D.open(oA.name, k1);
                Q4.onerror = function (G8) {
                  var $Z = Q4.result;
                  $Z.close(), n2(G8)
                }, Q4.onupgradeneeded = function () {
                  var G8 = Q4.result;
                  G8.deleteObjectStore(oA.storeName)
                }, Q4.onsuccess = function () {
                  var G8 = Q4.result;
                  G8.close(), T2(G8)
                }
              });
              return _B.then(function (T2) {
                s1.db = T2;
                for (var n2 = 0; n2 < p1.length; n2++) {
                  var Q4 = p1[n2];
                  Q4._dbInfo.db = T2, f(Q4._dbInfo)
                }
              }).catch(function (T2) {
                throw (AA(oA, T2) || V.resolve()).catch(function () {}), T2
              })
            })
          }
          return F(uA, VA), uA
        }
        var FA = {
          _driver: "asyncStorage",
          _initStorage: HA,
          _support: W(),
          iterate: zA,
          getItem: ZA,
          setItem: wA,
          removeItem: _A,
          clear: s,
          length: t,
          key: BA,
          keys: DA,
          dropInstance: CA
        };

        function xA() {
          return typeof openDatabase === "function"
        }
        var mA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
          G1 = "~~local_forage_type~",
          J1 = /^~~local_forage_type~([^~]+)~/,
          SA = "__lfsc__:",
          A1 = SA.length,
          n1 = "arbf",
          S1 = "blob",
          L0 = "si08",
          VQ = "ui08",
          t0 = "uic8",
          QQ = "si16",
          y1 = "si32",
          qQ = "ur16",
          K1 = "ui32",
          $1 = "fl32",
          i1 = "fl64",
          Q0 = A1 + n1.length,
          c0 = Object.prototype.toString;

        function b0(oA) {
          var VA = oA.length * 0.75,
            XA = oA.length,
            kA, uA = 0,
            dA, C1, j1, k1;
          if (oA[oA.length - 1] === "=") {
            if (VA--, oA[oA.length - 2] === "=") VA--
          }
          var s1 = new ArrayBuffer(VA),
            p1 = new Uint8Array(s1);
          for (kA = 0; kA < XA; kA += 4) dA = mA.indexOf(oA[kA]), C1 = mA.indexOf(oA[kA + 1]), j1 = mA.indexOf(oA[kA + 2]), k1 = mA.indexOf(oA[kA + 3]), p1[uA++] = dA << 2 | C1 >> 4, p1[uA++] = (C1 & 15) << 4 | j1 >> 2, p1[uA++] = (j1 & 3) << 6 | k1 & 63;
          return s1
        }

        function UA(oA) {
          var VA = new Uint8Array(oA),
            XA = "",
            kA;
          for (kA = 0; kA < VA.length; kA += 3) XA += mA[VA[kA] >> 2], XA += mA[(VA[kA] & 3) << 4 | VA[kA + 1] >> 4], XA += mA[(VA[kA + 1] & 15) << 2 | VA[kA + 2] >> 6], XA += mA[VA[kA + 2] & 63];
          if (VA.length % 3 === 2) XA = XA.substring(0, XA.length - 1) + "=";
          else if (VA.length % 3 === 1) XA = XA.substring(0, XA.length - 2) + "==";
          return XA
        }

        function RA(oA, VA) {
          var XA = "";
          if (oA) XA = c0.call(oA);
          if (oA && (XA === "[object ArrayBuffer]" || oA.buffer && c0.call(oA.buffer) === "[object ArrayBuffer]")) {
            var kA, uA = SA;
            if (oA instanceof ArrayBuffer) kA = oA, uA += n1;
            else if (kA = oA.buffer, XA === "[object Int8Array]") uA += L0;
            else if (XA === "[object Uint8Array]") uA += VQ;
            else if (XA === "[object Uint8ClampedArray]") uA += t0;
            else if (XA === "[object Int16Array]") uA += QQ;
            else if (XA === "[object Uint16Array]") uA += qQ;
            else if (XA === "[object Int32Array]") uA += y1;
            else if (XA === "[object Uint32Array]") uA += K1;
            else if (XA === "[object Float32Array]") uA += $1;
            else if (XA === "[object Float64Array]") uA += i1;
            else VA(Error("Failed to get type for BinaryArray"));
            VA(uA + UA(kA))
          } else if (XA === "[object Blob]") {
            var dA = new FileReader;
            dA.onload = function () {
              var C1 = G1 + oA.type + "~" + UA(this.result);
              VA(SA + S1 + C1)
            }, dA.readAsArrayBuffer(oA)
          } else try {
            VA(JSON.stringify(oA))
          } catch (C1) {
            console.error("Couldn't convert value into a JSON string: ", oA), VA(null, C1)
          }
        }

        function D1(oA) {
          if (oA.substring(0, A1) !== SA) return JSON.parse(oA);
          var VA = oA.substring(Q0),
            XA = oA.substring(A1, Q0),
            kA;
          if (XA === S1 && J1.test(VA)) {
            var uA = VA.match(J1);
            kA = uA[1], VA = VA.substring(uA[0].length)
          }
          var dA = b0(VA);
          switch (XA) {
            case n1:
              return dA;
            case S1:
              return K([dA], {
                type: kA
              });
            case L0:
              return new Int8Array(dA);
            case VQ:
              return new Uint8Array(dA);
            case t0:
              return new Uint8ClampedArray(dA);
            case QQ:
              return new Int16Array(dA);
            case qQ:
              return new Uint16Array(dA);
            case y1:
              return new Int32Array(dA);
            case K1:
              return new Uint32Array(dA);
            case $1:
              return new Float32Array(dA);
            case i1:
              return new Float64Array(dA);
            default:
              throw Error("Unkown type: " + XA)
          }
        }
        var U1 = {
          serialize: RA,
          deserialize: D1,
          stringToBuffer: b0,
          bufferToString: UA
        };

        function V1(oA, VA, XA, kA) {
          oA.executeSql("CREATE TABLE IF NOT EXISTS " + VA.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], XA, kA)
        }

        function H1(oA) {
          var VA = this,
            XA = {
              db: null
            };
          if (oA)
            for (var kA in oA) XA[kA] = typeof oA[kA] !== "string" ? oA[kA].toString() : oA[kA];
          var uA = new V(function (dA, C1) {
            try {
              XA.db = openDatabase(XA.name, String(XA.version), XA.description, XA.size)
            } catch (j1) {
              return C1(j1)
            }
            XA.db.transaction(function (j1) {
              V1(j1, XA, function () {
                VA._dbInfo = XA, dA()
              }, function (k1, s1) {
                C1(s1)
              })
            }, C1)
          });
          return XA.serializer = U1, uA
        }

        function Y0(oA, VA, XA, kA, uA, dA) {
          oA.executeSql(XA, kA, uA, function (C1, j1) {
            if (j1.code === j1.SYNTAX_ERR) C1.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [VA.storeName], function (k1, s1) {
              if (!s1.rows.length) V1(k1, VA, function () {
                k1.executeSql(XA, kA, uA, dA)
              }, dA);
              else dA(k1, j1)
            }, dA);
            else dA(C1, j1)
          }, dA)
        }

        function c1(oA, VA) {
          var XA = this;
          oA = E(oA);
          var kA = new V(function (uA, dA) {
            XA.ready().then(function () {
              var C1 = XA._dbInfo;
              C1.db.transaction(function (j1) {
                Y0(j1, C1, "SELECT * FROM " + C1.storeName + " WHERE key = ? LIMIT 1", [oA], function (k1, s1) {
                  var p1 = s1.rows.length ? s1.rows.item(0).value : null;
                  if (p1) p1 = C1.serializer.deserialize(p1);
                  uA(p1)
                }, function (k1, s1) {
                  dA(s1)
                })
              })
            }).catch(dA)
          });
          return F(kA, VA), kA
        }

        function p0(oA, VA) {
          var XA = this,
            kA = new V(function (uA, dA) {
              XA.ready().then(function () {
                var C1 = XA._dbInfo;
                C1.db.transaction(function (j1) {
                  Y0(j1, C1, "SELECT * FROM " + C1.storeName, [], function (k1, s1) {
                    var p1 = s1.rows,
                      M0 = p1.length;
                    for (var gQ = 0; gQ < M0; gQ++) {
                      var _B = p1.item(gQ),
                        T2 = _B.value;
                      if (T2) T2 = C1.serializer.deserialize(T2);
                      if (T2 = oA(T2, _B.key, gQ + 1), T2 !== void 0) {
                        uA(T2);
                        return
                      }
                    }
                    uA()
                  }, function (k1, s1) {
                    dA(s1)
                  })
                })
              }).catch(dA)
            });
          return F(kA, VA), kA
        }

        function HQ(oA, VA, XA, kA) {
          var uA = this;
          oA = E(oA);
          var dA = new V(function (C1, j1) {
            uA.ready().then(function () {
              if (VA === void 0) VA = null;
              var k1 = VA,
                s1 = uA._dbInfo;
              s1.serializer.serialize(VA, function (p1, M0) {
                if (M0) j1(M0);
                else s1.db.transaction(function (gQ) {
                  Y0(gQ, s1, "INSERT OR REPLACE INTO " + s1.storeName + " (key, value) VALUES (?, ?)", [oA, p1], function () {
                    C1(k1)
                  }, function (_B, T2) {
                    j1(T2)
                  })
                }, function (gQ) {
                  if (gQ.code === gQ.QUOTA_ERR) {
                    if (kA > 0) {
                      C1(HQ.apply(uA, [oA, k1, XA, kA - 1]));
                      return
                    }
                    j1(gQ)
                  }
                })
              })
            }).catch(j1)
          });
          return F(dA, XA), dA
        }

        function nB(oA, VA, XA) {
          return HQ.apply(this, [oA, VA, XA, 1])
        }

        function AB(oA, VA) {
          var XA = this;
          oA = E(oA);
          var kA = new V(function (uA, dA) {
            XA.ready().then(function () {
              var C1 = XA._dbInfo;
              C1.db.transaction(function (j1) {
                Y0(j1, C1, "DELETE FROM " + C1.storeName + " WHERE key = ?", [oA], function () {
                  uA()
                }, function (k1, s1) {
                  dA(s1)
                })
              })
            }).catch(dA)
          });
          return F(kA, VA), kA
        }

        function RB(oA) {
          var VA = this,
            XA = new V(function (kA, uA) {
              VA.ready().then(function () {
                var dA = VA._dbInfo;
                dA.db.transaction(function (C1) {
                  Y0(C1, dA, "DELETE FROM " + dA.storeName, [], function () {
                    kA()
                  }, function (j1, k1) {
                    uA(k1)
                  })
                })
              }).catch(uA)
            });
          return F(XA, oA), XA
        }

        function C9(oA) {
          var VA = this,
            XA = new V(function (kA, uA) {
              VA.ready().then(function () {
                var dA = VA._dbInfo;
                dA.db.transaction(function (C1) {
                  Y0(C1, dA, "SELECT COUNT(key) as c FROM " + dA.storeName, [], function (j1, k1) {
                    var s1 = k1.rows.item(0).c;
                    kA(s1)
                  }, function (j1, k1) {
                    uA(k1)
                  })
                })
              }).catch(uA)
            });
          return F(XA, oA), XA
        }

        function vB(oA, VA) {
          var XA = this,
            kA = new V(function (uA, dA) {
              XA.ready().then(function () {
                var C1 = XA._dbInfo;
                C1.db.transaction(function (j1) {
                  Y0(j1, C1, "SELECT key FROM " + C1.storeName + " WHERE id = ? LIMIT 1", [oA + 1], function (k1, s1) {
                    var p1 = s1.rows.length ? s1.rows.item(0).key : null;
                    uA(p1)
                  }, function (k1, s1) {
                    dA(s1)
                  })
                })
              }).catch(dA)
            });
          return F(kA, VA), kA
        }

        function c2(oA) {
          var VA = this,
            XA = new V(function (kA, uA) {
              VA.ready().then(function () {
                var dA = VA._dbInfo;
                dA.db.transaction(function (C1) {
                  Y0(C1, dA, "SELECT key FROM " + dA.storeName, [], function (j1, k1) {
                    var s1 = [];
                    for (var p1 = 0; p1 < k1.rows.length; p1++) s1.push(k1.rows.item(p1).key);
                    kA(s1)
                  }, function (j1, k1) {
                    uA(k1)
                  })
                })
              }).catch(uA)
            });
          return F(XA, oA), XA
        }

        function F9(oA) {
          return new V(function (VA, XA) {
            oA.transaction(function (kA) {
              kA.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (uA, dA) {
                var C1 = [];
                for (var j1 = 0; j1 < dA.rows.length; j1++) C1.push(dA.rows.item(j1).name);
                VA({
                  db: oA,
                  storeNames: C1
                })
              }, function (uA, dA) {
                XA(dA)
              })
            }, function (kA) {
              XA(kA)
            })
          })
        }

        function m3(oA, VA) {
          VA = z.apply(this, arguments);
          var XA = this.config();
          if (oA = typeof oA !== "function" && oA || {}, !oA.name) oA.name = oA.name || XA.name, oA.storeName = oA.storeName || XA.storeName;
          var kA = this,
            uA;
          if (!oA.name) uA = V.reject("Invalid arguments");
          else uA = new V(function (dA) {
            var C1;
            if (oA.name === XA.name) C1 = kA._dbInfo.db;
            else C1 = openDatabase(oA.name, "", "", 0);
            if (!oA.storeName) dA(F9(C1));
            else dA({
              db: C1,
              storeNames: [oA.storeName]
            })
          }).then(function (dA) {
            return new V(function (C1, j1) {
              dA.db.transaction(function (k1) {
                function s1(_B) {
                  return new V(function (T2, n2) {
                    k1.executeSql("DROP TABLE IF EXISTS " + _B, [], function () {
                      T2()
                    }, function (Q4, G8) {
                      n2(G8)
                    })
                  })
                }
                var p1 = [];
                for (var M0 = 0, gQ = dA.storeNames.length; M0 < gQ; M0++) p1.push(s1(dA.storeNames[M0]));
                V.all(p1).then(function () {
                  C1()
                }).catch(function (_B) {
                  j1(_B)
                })
              }, function (k1) {
                j1(k1)
              })
            })
          });
          return F(uA, VA), uA
        }
        var s0 = {
          _driver: "webSQLStorage",
          _initStorage: H1,
          _support: xA(),
          iterate: p0,
          getItem: c1,
          setItem: nB,
          removeItem: AB,
          clear: RB,
          length: C9,
          key: vB,
          keys: c2,
          dropInstance: m3
        };

        function u1() {
          try {
            return typeof localStorage < "u" && "setItem" in localStorage && !!localStorage.setItem
          } catch (oA) {
            return !1
          }
        }

        function IQ(oA, VA) {
          var XA = oA.name + "/";
          if (oA.storeName !== VA.storeName) XA += oA.storeName + "/";
          return XA
        }

        function tB() {
          var oA = "_localforage_support_test";
          try {
            return localStorage.setItem(oA, !0), localStorage.removeItem(oA), !1
          } catch (VA) {
            return !0
          }
        }

        function U9() {
          return !tB() || localStorage.length > 0
        }

        function V4(oA) {
          var VA = this,
            XA = {};
          if (oA)
            for (var kA in oA) XA[kA] = oA[kA];
          if (XA.keyPrefix = IQ(oA, VA._defaultConfig), !U9()) return V.reject();
          return VA._dbInfo = XA, XA.serializer = U1, V.resolve()
        }

        function j6(oA) {
          var VA = this,
            XA = VA.ready().then(function () {
              var kA = VA._dbInfo.keyPrefix;
              for (var uA = localStorage.length - 1; uA >= 0; uA--) {
                var dA = localStorage.key(uA);
                if (dA.indexOf(kA) === 0) localStorage.removeItem(dA)
              }
            });
          return F(XA, oA), XA
        }

        function z8(oA, VA) {
          var XA = this;
          oA = E(oA);
          var kA = XA.ready().then(function () {
            var uA = XA._dbInfo,
              dA = localStorage.getItem(uA.keyPrefix + oA);
            if (dA) dA = uA.serializer.deserialize(dA);
            return dA
          });
          return F(kA, VA), kA
        }

        function T6(oA, VA) {
          var XA = this,
            kA = XA.ready().then(function () {
              var uA = XA._dbInfo,
                dA = uA.keyPrefix,
                C1 = dA.length,
                j1 = localStorage.length,
                k1 = 1;
              for (var s1 = 0; s1 < j1; s1++) {
                var p1 = localStorage.key(s1);
                if (p1.indexOf(dA) !== 0) continue;
                var M0 = localStorage.getItem(p1);
                if (M0) M0 = uA.serializer.deserialize(M0);
                if (M0 = oA(M0, p1.substring(C1), k1++), M0 !== void 0) return M0
              }
            });
          return F(kA, VA), kA
        }

        function i8(oA, VA) {
          var XA = this,
            kA = XA.ready().then(function () {
              var uA = XA._dbInfo,
                dA;
              try {
                dA = localStorage.key(oA)
              } catch (C1) {
                dA = null
              }
              if (dA) dA = dA.substring(uA.keyPrefix.length);
              return dA
            });
          return F(kA, VA), kA
        }

        function Q8(oA) {
          var VA = this,
            XA = VA.ready().then(function () {
              var kA = VA._dbInfo,
                uA = localStorage.length,
                dA = [];
              for (var C1 = 0; C1 < uA; C1++) {
                var j1 = localStorage.key(C1);
                if (j1.indexOf(kA.keyPrefix) === 0) dA.push(j1.substring(kA.keyPrefix.length))
              }
              return dA
            });
          return F(XA, oA), XA
        }

        function $G(oA) {
          var VA = this,
            XA = VA.keys().then(function (kA) {
              return kA.length
            });
          return F(XA, oA), XA
        }

        function t7(oA, VA) {
          var XA = this;
          oA = E(oA);
          var kA = XA.ready().then(function () {
            var uA = XA._dbInfo;
            localStorage.removeItem(uA.keyPrefix + oA)
          });
          return F(kA, VA), kA
        }

        function PQ(oA, VA, XA) {
          var kA = this;
          oA = E(oA);
          var uA = kA.ready().then(function () {
            if (VA === void 0) VA = null;
            var dA = VA;
            return new V(function (C1, j1) {
              var k1 = kA._dbInfo;
              k1.serializer.serialize(VA, function (s1, p1) {
                if (p1) j1(p1);
                else try {
                  localStorage.setItem(k1.keyPrefix + oA, s1), C1(dA)
                } catch (M0) {
                  if (M0.name === "QuotaExceededError" || M0.name === "NS_ERROR_DOM_QUOTA_REACHED") j1(M0);
                  j1(M0)
                }
              })
            })
          });
          return F(uA, XA), uA
        }

        function z2(oA, VA) {
          if (VA = z.apply(this, arguments), oA = typeof oA !== "function" && oA || {}, !oA.name) {
            var XA = this.config();
            oA.name = oA.name || XA.name, oA.storeName = oA.storeName || XA.storeName
          }
          var kA = this,
            uA;
          if (!oA.name) uA = V.reject("Invalid arguments");
          else uA = new V(function (dA) {
            if (!oA.storeName) dA(oA.name + "/");
            else dA(IQ(oA, kA._defaultConfig))
          }).then(function (dA) {
            for (var C1 = localStorage.length - 1; C1 >= 0; C1--) {
              var j1 = localStorage.key(C1);
              if (j1.indexOf(dA) === 0) localStorage.removeItem(j1)
            }
          });
          return F(uA, VA), uA
        }
        var w4 = {
            _driver: "localStorageWrapper",
            _initStorage: V4,
            _support: u1(),
            iterate: T6,
            getItem: z8,
            setItem: PQ,
            removeItem: t7,
            clear: j6,
            length: $G,
            key: i8,
            keys: Q8,
            dropInstance: z2
          },
          Y6 = function (VA, XA) {
            return VA === XA || typeof VA === "number" && typeof XA === "number" && isNaN(VA) && isNaN(XA)
          },
          eB = function (VA, XA) {
            var kA = VA.length,
              uA = 0;
            while (uA < kA) {
              if (Y6(VA[uA], XA)) return !0;
              uA++
            }
            return !1
          },
          L4 = Array.isArray || function (oA) {
            return Object.prototype.toString.call(oA) === "[object Array]"
          },
          L5 = {},
          B8 = {},
          F6 = {
            INDEXEDDB: FA,
            WEBSQL: s0,
            LOCALSTORAGE: w4
          },
          cG = [F6.INDEXEDDB._driver, F6.WEBSQL._driver, F6.LOCALSTORAGE._driver],
          P6 = ["dropInstance"],
          pG = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(P6),
          T3 = {
            description: "",
            driver: cG.slice(),
            name: "localforage",
            size: 4980736,
            storeName: "keyvaluepairs",
            version: 1
          };

        function RY(oA, VA) {
          oA[VA] = function () {
            var XA = arguments;
            return oA.ready().then(function () {
              return oA[VA].apply(oA, XA)
            })
          }
        }

        function _Y() {
          for (var oA = 1; oA < arguments.length; oA++) {
            var VA = arguments[oA];
            if (VA) {
              for (var XA in VA)
                if (VA.hasOwnProperty(XA))
                  if (L4(VA[XA])) arguments[0][XA] = VA[XA].slice();
                  else arguments[0][XA] = VA[XA]
            }
          }
          return arguments[0]
        }
        var g5 = function () {
            function oA(VA) {
              X(this, oA);
              for (var XA in F6)
                if (F6.hasOwnProperty(XA)) {
                  var kA = F6[XA],
                    uA = kA._driver;
                  if (this[XA] = uA, !L5[uA]) this.defineDriver(kA)
                } this._defaultConfig = _Y({}, T3), this._config = _Y({}, this._defaultConfig, VA), this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch(function () {})
            }
            return oA.prototype.config = function (XA) {
              if ((typeof XA > "u" ? "undefined" : J(XA)) === "object") {
                if (this._ready) return Error("Can't call config() after localforage has been used.");
                for (var kA in XA) {
                  if (kA === "storeName") XA[kA] = XA[kA].replace(/\W/g, "_");
                  if (kA === "version" && typeof XA[kA] !== "number") return Error("Database version must be a number.");
                  this._config[kA] = XA[kA]
                }
                if ("driver" in XA && XA.driver) return this.setDriver(this._config.driver);
                return !0
              } else if (typeof XA === "string") return this._config[XA];
              else return this._config
            }, oA.prototype.defineDriver = function (XA, kA, uA) {
              var dA = new V(function (C1, j1) {
                try {
                  var k1 = XA._driver,
                    s1 = Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                  if (!XA._driver) {
                    j1(s1);
                    return
                  }
                  var p1 = pG.concat("_initStorage");
                  for (var M0 = 0, gQ = p1.length; M0 < gQ; M0++) {
                    var _B = p1[M0],
                      T2 = !eB(P6, _B);
                    if ((T2 || XA[_B]) && typeof XA[_B] !== "function") {
                      j1(s1);
                      return
                    }
                  }
                  var n2 = function () {
                    var $Z = function (oJ) {
                      return function () {
                        var IJ = Error("Method " + oJ + " is not implemented by the current driver"),
                          MK = V.reject(IJ);
                        return F(MK, arguments[arguments.length - 1]), MK
                      }
                    };
                    for (var S7 = 0, FD = P6.length; S7 < FD; S7++) {
                      var aJ = P6[S7];
                      if (!XA[aJ]) XA[aJ] = $Z(aJ)
                    }
                  };
                  n2();
                  var Q4 = function ($Z) {
                    if (L5[k1]) console.info("Redefining LocalForage driver: " + k1);
                    L5[k1] = XA, B8[k1] = $Z, C1()
                  };
                  if ("_support" in XA)
                    if (XA._support && typeof XA._support === "function") XA._support().then(Q4, j1);
                    else Q4(!!XA._support);
                  else Q4(!0)
                } catch (G8) {
                  j1(G8)
                }
              });
              return H(dA, kA, uA), dA
            }, oA.prototype.driver = function () {
              return this._driver || null
            }, oA.prototype.getDriver = function (XA, kA, uA) {
              var dA = L5[XA] ? V.resolve(L5[XA]) : V.reject(Error("Driver not found."));
              return H(dA, kA, uA), dA
            }, oA.prototype.getSerializer = function (XA) {
              var kA = V.resolve(U1);
              return H(kA, XA), kA
            }, oA.prototype.ready = function (XA) {
              var kA = this,
                uA = kA._driverSet.then(function () {
                  if (kA._ready === null) kA._ready = kA._initDriver();
                  return kA._ready
                });
              return H(uA, XA, XA), uA
            }, oA.prototype.setDriver = function (XA, kA, uA) {
              var dA = this;
              if (!L4(XA)) XA = [XA];
              var C1 = this._getSupportedDrivers(XA);

              function j1() {
                dA._config.driver = dA.driver()
              }

              function k1(M0) {
                return dA._extend(M0), j1(), dA._ready = dA._initStorage(dA._config), dA._ready
              }

              function s1(M0) {
                return function () {
                  var gQ = 0;

                  function _B() {
                    while (gQ < M0.length) {
                      var T2 = M0[gQ];
                      return gQ++, dA._dbInfo = null, dA._ready = null, dA.getDriver(T2).then(k1).catch(_B)
                    }
                    j1();
                    var n2 = Error("No available storage method found.");
                    return dA._driverSet = V.reject(n2), dA._driverSet
                  }
                  return _B()
                }
              }
              var p1 = this._driverSet !== null ? this._driverSet.catch(function () {
                return V.resolve()
              }) : V.resolve();
              return this._driverSet = p1.then(function () {
                var M0 = C1[0];
                return dA._dbInfo = null, dA._ready = null, dA.getDriver(M0).then(function (gQ) {
                  dA._driver = gQ._driver, j1(), dA._wrapLibraryMethodsWithReady(), dA._initDriver = s1(C1)
                })
              }).catch(function () {
                j1();
                var M0 = Error("No available storage method found.");
                return dA._driverSet = V.reject(M0), dA._driverSet
              }), H(this._driverSet, kA, uA), this._driverSet
            }, oA.prototype.supports = function (XA) {
              return !!B8[XA]
            }, oA.prototype._extend = function (XA) {
              _Y(this, XA)
            }, oA.prototype._getSupportedDrivers = function (XA) {
              var kA = [];
              for (var uA = 0, dA = XA.length; uA < dA; uA++) {
                var C1 = XA[uA];
                if (this.supports(C1)) kA.push(C1)
              }
              return kA
            }, oA.prototype._wrapLibraryMethodsWithReady = function () {
              for (var XA = 0, kA = pG.length; XA < kA; XA++) RY(this, pG[XA])
            }, oA.prototype.createInstance = function (XA) {
              return new oA(XA)
            }, oA
          }(),
          n8 = new g5;
        Z.exports = n8
      }, {
        "3": 3
      }]
    }, {}, [4])(4)
  })
})
// @from(Ln 66113, Col 4)
aFQ = U((nFQ) => {
  Object.defineProperty(nFQ, "__esModule", {
    value: !0
  });
  var Iv = CQ(),
    Mf4 = iFQ(),
    a1A = aqA(),
    Pi = Iv.GLOBAL_OBJ;
  class oqA {
    static __initStatic() {
      this.id = "Offline"
    }
    constructor(A = {}) {
      this.name = oqA.id, this.maxStoredEvents = A.maxStoredEvents || 30, this.offlineEventStore = Mf4.createInstance({
        name: "sentry/offlineEventStore"
      })
    }
    setupOnce(A, Q) {
      if (this.hub = Q(), "addEventListener" in Pi) Pi.addEventListener("online", () => {
        this._sendEvents().catch(() => {
          a1A.DEBUG_BUILD && Iv.logger.warn("could not send cached events")
        })
      });
      let B = (G) => {
        if (this.hub && this.hub.getIntegration(oqA)) {
          if ("navigator" in Pi && "onLine" in Pi.navigator && !Pi.navigator.onLine) return a1A.DEBUG_BUILD && Iv.logger.log("Event dropped due to being a offline - caching instead"), this._cacheEvent(G).then((Z) => this._enforceMaxEvents()).catch((Z) => {
            a1A.DEBUG_BUILD && Iv.logger.warn("could not cache event while offline")
          }), null
        }
        return G
      };
      if (B.id = this.name, A(B), "navigator" in Pi && "onLine" in Pi.navigator && Pi.navigator.onLine) this._sendEvents().catch(() => {
        a1A.DEBUG_BUILD && Iv.logger.warn("could not send cached events")
      })
    }
    async _cacheEvent(A) {
      return this.offlineEventStore.setItem(Iv.uuid4(), Iv.normalize(A))
    }
    async _enforceMaxEvents() {
      let A = [];
      return this.offlineEventStore.iterate((Q, B, G) => {
        A.push({
          cacheKey: B,
          event: Q
        })
      }).then(() => this._purgeEvents(A.sort((Q, B) => (B.event.timestamp || 0) - (Q.event.timestamp || 0)).slice(this.maxStoredEvents < A.length ? this.maxStoredEvents : A.length).map((Q) => Q.cacheKey))).catch((Q) => {
        a1A.DEBUG_BUILD && Iv.logger.warn("could not enforce max events")
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
          a1A.DEBUG_BUILD && Iv.logger.warn("could not purge event from cache")
        });
        else a1A.DEBUG_BUILD && Iv.logger.warn("no hub found - could not send cached event")
      })
    }
  }
  oqA.__initStatic();
  nFQ.Offline = oqA
})
// @from(Ln 66180, Col 4)
AHQ = U((eFQ) => {
  Object.defineProperty(eFQ, "__esModule", {
    value: !0
  });
  var rqA = U6(),
    rFQ = CQ(),
    _f4 = rFQ.GLOBAL_OBJ,
    sFQ = "ReportingObserver",
    oFQ = new WeakMap,
    jf4 = (A = {}) => {
      let Q = A.types || ["crash", "deprecation", "intervention"];

      function B(G) {
        if (!oFQ.has(rqA.getClient())) return;
        for (let Z of G) rqA.withScope((Y) => {
          Y.setExtra("url", Z.url);
          let J = `ReportingObserver [${Z.type}]`,
            X = "No details available";
          if (Z.body) {
            let I = {};
            for (let D in Z.body) I[D] = Z.body[D];
            if (Y.setExtra("body", I), Z.type === "crash") {
              let D = Z.body;
              X = [D.crashId || "", D.reason || ""].join(" ").trim() || X
            } else X = Z.body.message || X
          }
          rqA.captureMessage(`${J}: ${X}`)
        })
      }
      return {
        name: sFQ,
        setupOnce() {
          if (!rFQ.supportsReportingObserver()) return;
          new _f4.ReportingObserver(B, {
            buffered: !0,
            types: Q
          }).observe()
        },
        setup(G) {
          oFQ.set(G, !0)
        }
      }
    },
    tFQ = rqA.defineIntegration(jf4),
    Tf4 = rqA.convertIntegrationFnToClass(sFQ, tFQ);
  eFQ.ReportingObserver = Tf4;
  eFQ.reportingObserverIntegration = tFQ
})
// @from(Ln 66228, Col 4)
JHQ = U((YHQ) => {
  Object.defineProperty(YHQ, "__esModule", {
    value: !0
  });
  var BHQ = U6(),
    QHQ = CQ(),
    GHQ = "RewriteFrames",
    xf4 = (A = {}) => {
      let Q = A.root,
        B = A.prefix || "app:///",
        G = A.iteratee || ((J) => {
          if (!J.filename) return J;
          let X = /^[a-zA-Z]:\\/.test(J.filename) || J.filename.includes("\\") && !J.filename.includes("/"),
            I = /^\//.test(J.filename);
          if (X || I) {
            let D = X ? J.filename.replace(/^[a-zA-Z]:/, "").replace(/\\/g, "/") : J.filename,
              W = Q ? QHQ.relative(Q, D) : QHQ.basename(D);
            J.filename = `${B}${W}`
          }
          return J
        });

      function Z(J) {
        try {
          return {
            ...J,
            exception: {
              ...J.exception,
              values: J.exception.values.map((X) => ({
                ...X,
                ...X.stacktrace && {
                  stacktrace: Y(X.stacktrace)
                }
              }))
            }
          }
        } catch (X) {
          return J
        }
      }

      function Y(J) {
        return {
          ...J,
          frames: J && J.frames && J.frames.map((X) => G(X))
        }
      }
      return {
        name: GHQ,
        setupOnce() {},
        processEvent(J) {
          let X = J;
          if (J.exception && Array.isArray(J.exception.values)) X = Z(X);
          return X
        }
      }
    },
    ZHQ = BHQ.defineIntegration(xf4),
    yf4 = BHQ.convertIntegrationFnToClass(GHQ, ZHQ);
  YHQ.RewriteFrames = yf4;
  YHQ.rewriteFramesIntegration = ZHQ
})
// @from(Ln 66290, Col 4)
KHQ = U((WHQ) => {
  Object.defineProperty(WHQ, "__esModule", {
    value: !0
  });
  var XHQ = U6(),
    IHQ = "SessionTiming",
    bf4 = () => {
      let A = Date.now();
      return {
        name: IHQ,
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
    DHQ = XHQ.defineIntegration(bf4),
    ff4 = XHQ.convertIntegrationFnToClass(IHQ, DHQ);
  WHQ.SessionTiming = ff4;
  WHQ.sessionTimingIntegration = DHQ
})
// @from(Ln 66320, Col 4)
HHQ = U((FHQ) => {
  Object.defineProperty(FHQ, "__esModule", {
    value: !0
  });
  var uf4 = U6(),
    VHQ = "Transaction",
    mf4 = () => {
      return {
        name: VHQ,
        setupOnce() {},
        processEvent(A) {
          let Q = cf4(A);
          for (let B = Q.length - 1; B >= 0; B--) {
            let G = Q[B];
            if (G.in_app === !0) {
              A.transaction = pf4(G);
              break
            }
          }
          return A
        }
      }
    },
    df4 = uf4.convertIntegrationFnToClass(VHQ, mf4);

  function cf4(A) {
    let Q = A.exception && A.exception.values && A.exception.values[0];
    return Q && Q.stacktrace && Q.stacktrace.frames || []
  }

  function pf4(A) {
    return A.module || A.function ? `${A.module||"?"}/${A.function||"?"}` : "<unknown>"
  }
  FHQ.Transaction = df4
})
// @from(Ln 66355, Col 4)
wHQ = U((NHQ) => {
  Object.defineProperty(NHQ, "__esModule", {
    value: !0
  });
  var Pg = U6(),
    Dv = CQ(),
    hnA = aqA(),
    EHQ = "HttpClient",
    if4 = (A = {}) => {
      let Q = {
        failedRequestStatusCodes: [
          [500, 599]
        ],
        failedRequestTargets: [/.*/],
        ...A
      };
      return {
        name: EHQ,
        setupOnce() {},
        setup(B) {
          Qh4(B, Q), Bh4(B, Q)
        }
      }
    },
    zHQ = Pg.defineIntegration(if4),
    nf4 = Pg.convertIntegrationFnToClass(EHQ, zHQ);

  function af4(A, Q, B, G) {
    if (CHQ(A, B.status, B.url)) {
      let Z = Gh4(Q, G),
        Y, J, X, I;
      if (qHQ())[{
        headers: Y,
        cookies: X
      }, {
        headers: J,
        cookies: I
      }] = [{
        cookieHeader: "Cookie",
        obj: Z
      }, {
        cookieHeader: "Set-Cookie",
        obj: B
      }].map(({
        cookieHeader: W,
        obj: K
      }) => {
        let V = sf4(K.headers),
          F;
        try {
          let H = V[W] || V[W.toLowerCase()] || void 0;
          if (H) F = $HQ(H)
        } catch (H) {
          hnA.DEBUG_BUILD && Dv.logger.log(`Could not extract cookies from header ${W}`)
        }
        return {
          headers: V,
          cookies: F
        }
      });
      let D = UHQ({
        url: Z.url,
        method: Z.method,
        status: B.status,
        requestHeaders: Y,
        responseHeaders: J,
        requestCookies: X,
        responseCookies: I
      });
      Pg.captureEvent(D)
    }
  }

  function of4(A, Q, B, G) {
    if (CHQ(A, Q.status, Q.responseURL)) {
      let Z, Y, J;
      if (qHQ()) {
        try {
          let I = Q.getResponseHeader("Set-Cookie") || Q.getResponseHeader("set-cookie") || void 0;
          if (I) Y = $HQ(I)
        } catch (I) {
          hnA.DEBUG_BUILD && Dv.logger.log("Could not extract cookies from response headers")
        }
        try {
          J = tf4(Q)
        } catch (I) {
          hnA.DEBUG_BUILD && Dv.logger.log("Could not extract headers from response")
        }
        Z = G
      }
      let X = UHQ({
        url: Q.responseURL,
        method: B,
        status: Q.status,
        requestHeaders: Z,
        responseHeaders: J,
        responseCookies: Y
      });
      Pg.captureEvent(X)
    }
  }

  function rf4(A) {
    if (A) {
      let Q = A["Content-Length"] || A["content-length"];
      if (Q) return parseInt(Q, 10)
    }
    return
  }

  function $HQ(A) {
    return A.split("; ").reduce((Q, B) => {
      let [G, Z] = B.split("=");
      return Q[G] = Z, Q
    }, {})
  }

  function sf4(A) {
    let Q = {};
    return A.forEach((B, G) => {
      Q[G] = B
    }), Q
  }

  function tf4(A) {
    let Q = A.getAllResponseHeaders();
    if (!Q) return {};
    return Q.split(`\r
`).reduce((B, G) => {
      let [Z, Y] = G.split(": ");
      return B[Z] = Y, B
    }, {})
  }

  function ef4(A, Q) {
    return A.some((B) => {
      if (typeof B === "string") return Q.includes(B);
      return B.test(Q)
    })
  }

  function Ah4(A, Q) {
    return A.some((B) => {
      if (typeof B === "number") return B === Q;
      return Q >= B[0] && Q <= B[1]
    })
  }

  function Qh4(A, Q) {
    if (!Dv.supportsNativeFetch()) return;
    Dv.addFetchInstrumentationHandler((B) => {
      if (Pg.getClient() !== A) return;
      let {
        response: G,
        args: Z
      } = B, [Y, J] = Z;
      if (!G) return;
      af4(Q, Y, G, J)
    })
  }

  function Bh4(A, Q) {
    if (!("XMLHttpRequest" in Dv.GLOBAL_OBJ)) return;
    Dv.addXhrInstrumentationHandler((B) => {
      if (Pg.getClient() !== A) return;
      let G = B.xhr,
        Z = G[Dv.SENTRY_XHR_DATA_KEY];
      if (!Z) return;
      let {
        method: Y,
        request_headers: J
      } = Z;
      try {
        of4(Q, G, Y, J)
      } catch (X) {
        hnA.DEBUG_BUILD && Dv.logger.warn("Error while extracting response event form XHR response", X)
      }
    })
  }

  function CHQ(A, Q, B) {
    return Ah4(A.failedRequestStatusCodes, Q) && ef4(A.failedRequestTargets, B) && !Pg.isSentryRequestUrl(B, Pg.getClient())
  }

  function UHQ(A) {
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
            body_size: rf4(A.responseHeaders)
          }
        }
      };
    return Dv.addExceptionMechanism(B, {
      type: "http.client",
      handled: !1
    }), B
  }

  function Gh4(A, Q) {
    if (!Q && A instanceof Request) return A;
    if (A instanceof Request && A.bodyUsed) return A;
    return new Request(A, Q)
  }

  function qHQ() {
    let A = Pg.getClient();
    return A ? Boolean(A.getOptions().sendDefaultPii) : !1
  }
  NHQ.HttpClient = nf4;
  NHQ.httpClientIntegration = zHQ
})
// @from(Ln 66583, Col 4)
jHQ = U((_HQ) => {
  Object.defineProperty(_HQ, "__esModule", {
    value: !0
  });
  var LHQ = U6(),
    bT1 = CQ(),
    kT1 = bT1.GLOBAL_OBJ,
    Jh4 = 7,
    OHQ = "ContextLines",
    Xh4 = (A = {}) => {
      let Q = A.frameContextLines != null ? A.frameContextLines : Jh4;
      return {
        name: OHQ,
        setupOnce() {},
        processEvent(B) {
          return Dh4(B, Q)
        }
      }
    },
    MHQ = LHQ.defineIntegration(Xh4),
    Ih4 = LHQ.convertIntegrationFnToClass(OHQ, MHQ);

  function Dh4(A, Q) {
    let B = kT1.document,
      G = kT1.location && bT1.stripUrlQueryAndFragment(kT1.location.href);
    if (!B || !G) return A;
    let Z = A.exception && A.exception.values;
    if (!Z || !Z.length) return A;
    let Y = B.documentElement.innerHTML;
    if (!Y) return A;
    let J = ["<!DOCTYPE html>", "<html>", ...Y.split(`
`), "</html>"];
    return Z.forEach((X) => {
      let I = X.stacktrace;
      if (I && I.frames) I.frames = I.frames.map((D) => RHQ(D, J, G, Q))
    }), A
  }

  function RHQ(A, Q, B, G) {
    if (A.filename !== B || !A.lineno || !Q.length) return A;
    return bT1.addContextToFrame(Q, A, G), A
  }
  _HQ.ContextLines = Ih4;
  _HQ.applySourceContextToFrame = RHQ;
  _HQ.contextLinesIntegration = MHQ
})
// @from(Ln 66629, Col 4)
gHQ = U((hHQ) => {
  Object.defineProperty(hHQ, "__esModule", {
    value: !0
  });
  var THQ = LFQ(),
    PHQ = jFQ(),
    SHQ = gFQ(),
    xHQ = pFQ(),
    Fh4 = aFQ(),
    yHQ = AHQ(),
    vHQ = JHQ(),
    kHQ = KHQ(),
    Hh4 = HHQ(),
    bHQ = wHQ(),
    fHQ = jHQ();
  hHQ.CaptureConsole = THQ.CaptureConsole;
  hHQ.captureConsoleIntegration = THQ.captureConsoleIntegration;
  hHQ.Debug = PHQ.Debug;
  hHQ.debugIntegration = PHQ.debugIntegration;
  hHQ.Dedupe = SHQ.Dedupe;
  hHQ.dedupeIntegration = SHQ.dedupeIntegration;
  hHQ.ExtraErrorData = xHQ.ExtraErrorData;
  hHQ.extraErrorDataIntegration = xHQ.extraErrorDataIntegration;
  hHQ.Offline = Fh4.Offline;
  hHQ.ReportingObserver = yHQ.ReportingObserver;
  hHQ.reportingObserverIntegration = yHQ.reportingObserverIntegration;
  hHQ.RewriteFrames = vHQ.RewriteFrames;
  hHQ.rewriteFramesIntegration = vHQ.rewriteFramesIntegration;
  hHQ.SessionTiming = kHQ.SessionTiming;
  hHQ.sessionTimingIntegration = kHQ.sessionTimingIntegration;
  hHQ.Transaction = Hh4.Transaction;
  hHQ.HttpClient = bHQ.HttpClient;
  hHQ.httpClientIntegration = bHQ.httpClientIntegration;
  hHQ.ContextLines = fHQ.ContextLines;
  hHQ.contextLinesIntegration = fHQ.contextLinesIntegration
})
// @from(Ln 66665, Col 4)
gnA = U((uHQ) => {
  Object.defineProperty(uHQ, "__esModule", {
    value: !0
  });
  var kh4 = [
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

  function bh4(A) {
    return kh4.reduce((Q, [B, G]) => Q.replace(new RegExp(B, "gi"), G), A)
  }
  uHQ.replaceCronNames = bh4
})
// @from(Ln 66715, Col 4)
lHQ = U((pHQ) => {
  Object.defineProperty(pHQ, "__esModule", {
    value: !0
  });
  var mHQ = U6(),
    dHQ = gnA(),
    cHQ = "Automatic instrumentation of CronJob only supports crontab string";

  function hh4(A, Q) {
    let B = !1;
    return new Proxy(A, {
      construct(G, Z) {
        let [Y, J, X, I, D, ...W] = Z;
        if (typeof Y !== "string") throw Error(cHQ);
        if (B) throw Error(`A job named '${Q}' has already been scheduled`);
        B = !0;
        let K = dHQ.replaceCronNames(Y);

        function V(F, H) {
          return mHQ.withMonitor(Q, () => {
            return J(F, H)
          }, {
            schedule: {
              type: "crontab",
              value: K
            },
            timezone: D || void 0
          })
        }
        return new G(Y, V, X, I, D, ...W)
      },
      get(G, Z) {
        if (Z === "from") return (Y) => {
          let {
            cronTime: J,
            onTick: X,
            timeZone: I
          } = Y;
          if (typeof J !== "string") throw Error(cHQ);
          if (B) throw Error(`A job named '${Q}' has already been scheduled`);
          B = !0;
          let D = dHQ.replaceCronNames(J);
          return Y.onTick = (W, K) => {
            return mHQ.withMonitor(Q, () => {
              return X(W, K)
            }, {
              schedule: {
                type: "crontab",
                value: D
              },
              timezone: I || void 0
            })
          }, G.from(Y)
        };
        else return G[Z]
      }
    })
  }
  pHQ.instrumentCron = hh4
})
// @from(Ln 66775, Col 4)
aHQ = U((nHQ) => {
  var {
    _optionalChain: iHQ
  } = CQ();
  Object.defineProperty(nHQ, "__esModule", {
    value: !0
  });
  var uh4 = U6(),
    mh4 = gnA();

  function dh4(A) {
    return new Proxy(A, {
      get(Q, B) {
        if (B === "schedule" && Q.schedule) return new Proxy(Q.schedule, {
          apply(G, Z, Y) {
            let [J, , X] = Y;
            if (!iHQ([X, "optionalAccess", (I) => I.name])) throw Error('Missing "name" for scheduled job. A name is required for Sentry check-in monitoring.');
            return uh4.withMonitor(X.name, () => {
              return G.apply(Z, Y)
            }, {
              schedule: {
                type: "crontab",
                value: mh4.replaceCronNames(J)
              },
              timezone: iHQ([X, "optionalAccess", (I) => I.timezone])
            })
          }
        });
        else return Q[B]
      }
    })
  }
  nHQ.instrumentNodeCron = dh4
})
// @from(Ln 66809, Col 4)
rHQ = U((oHQ) => {
  Object.defineProperty(oHQ, "__esModule", {
    value: !0
  });
  var ph4 = U6(),
    lh4 = gnA();

  function ih4(A) {
    return new Proxy(A, {
      get(Q, B) {
        if (B === "scheduleJob") return new Proxy(Q.scheduleJob, {
          apply(G, Z, Y) {
            let [J, X] = Y;
            if (typeof J !== "string" || typeof X !== "string") throw Error("Automatic instrumentation of 'node-schedule' requires the first parameter of 'scheduleJob' to be a job name string and the second parameter to be a crontab string");
            let I = J,
              D = X;
            return ph4.withMonitor(I, () => {
              return G.apply(Z, Y)
            }, {
              schedule: {
                type: "crontab",
                value: lh4.replaceCronNames(D)
              }
            })
          }
        });
        return Q[B]
      }
    })
  }
  oHQ.instrumentNodeSchedule = ih4
})