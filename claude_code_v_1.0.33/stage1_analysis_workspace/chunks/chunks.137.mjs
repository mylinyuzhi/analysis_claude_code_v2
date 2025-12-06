
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