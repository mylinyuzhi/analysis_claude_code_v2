
// @from(Ln 199439, Col 4)
yxB = U((GdG, xxB) => {
  var {
    create: ow8,
    defineProperty: mjA,
    getOwnPropertyDescriptor: rw8,
    getOwnPropertyNames: sw8,
    getPrototypeOf: tw8
  } = Object, ew8 = Object.prototype.hasOwnProperty, KF = (A, Q) => mjA(A, "name", {
    value: Q,
    configurable: !0
  }), AL8 = (A, Q) => {
    for (var B in Q) mjA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, qxB = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of sw8(Q))
        if (!ew8.call(A, Z) && Z !== B) mjA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = rw8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, QL8 = (A, Q, B) => (B = A != null ? ow8(tw8(A)) : {}, qxB(Q || !A || !A.__esModule ? mjA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), BL8 = (A) => qxB(mjA({}, "__esModule", {
    value: !0
  }), A), NxB = {};
  AL8(NxB, {
    DEFAULT_REQUEST_TIMEOUT: () => XL8,
    NodeHttp2Handler: () => VL8,
    NodeHttpHandler: () => IL8,
    streamCollector: () => HL8
  });
  xxB.exports = BL8(NxB);
  var wxB = i20(),
    LxB = $xB(),
    q90 = NA("http"),
    N90 = NA("https"),
    GL8 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"],
    OxB = KF((A) => {
      let Q = {};
      for (let B of Object.keys(A)) {
        let G = A[B];
        Q[B] = Array.isArray(G) ? G.join(",") : G
      }
      return Q
    }, "getTransformedHeaders"),
    ZL8 = KF((A, Q, B = 0) => {
      if (!B) return;
      let G = setTimeout(() => {
        A.destroy(), Q(Object.assign(Error(`Socket timed out without establishing a connection within ${B} ms`), {
          name: "TimeoutError"
        }))
      }, B);
      A.on("socket", (Z) => {
        if (Z.connecting) Z.on("connect", () => {
          clearTimeout(G)
        });
        else clearTimeout(G)
      })
    }, "setConnectionTimeout"),
    YL8 = KF((A, {
      keepAlive: Q,
      keepAliveMsecs: B
    }) => {
      if (Q !== !0) return;
      A.on("socket", (G) => {
        G.setKeepAlive(Q, B || 0)
      })
    }, "setSocketKeepAlive"),
    JL8 = KF((A, Q, B = 0) => {
      A.setTimeout(B, () => {
        A.destroy(), Q(Object.assign(Error(`Connection timed out after ${B} ms`), {
          name: "TimeoutError"
        }))
      })
    }, "setSocketTimeout"),
    MxB = NA("stream"),
    CxB = 1000;
  async function w90(A, Q, B = CxB) {
    let G = Q.headers ?? {},
      Z = G.Expect || G.expect,
      Y = -1,
      J = !1;
    if (Z === "100-continue") await Promise.race([new Promise((X) => {
      Y = Number(setTimeout(X, Math.max(CxB, B)))
    }), new Promise((X) => {
      A.on("continue", () => {
        clearTimeout(Y), X()
      }), A.on("error", () => {
        J = !0, clearTimeout(Y), X()
      })
    })]);
    if (!J) RxB(A, Q.body)
  }
  KF(w90, "writeRequestBody");

  function RxB(A, Q) {
    if (Q instanceof MxB.Readable) {
      Q.pipe(A);
      return
    }
    if (Q) {
      if (Buffer.isBuffer(Q) || typeof Q === "string") {
        A.end(Q);
        return
      }
      let B = Q;
      if (typeof B === "object" && B.buffer && typeof B.byteOffset === "number" && typeof B.byteLength === "number") {
        A.end(Buffer.from(B.buffer, B.byteOffset, B.byteLength));
        return
      }
      A.end(Buffer.from(Q));
      return
    }
    A.end()
  }
  KF(RxB, "writeBody");
  var XL8 = 0,
    _xB = class A {
      constructor(Q) {
        this.socketWarningTimestamp = 0, this.metadata = {
          handlerProtocol: "http/1.1"
        }, this.configProvider = new Promise((B, G) => {
          if (typeof Q === "function") Q().then((Z) => {
            B(this.resolveDefaultConfig(Z))
          }).catch(G);
          else B(this.resolveDefaultConfig(Q))
        })
      }
      static create(Q) {
        if (typeof (Q == null ? void 0 : Q.handle) === "function") return Q;
        return new A(Q)
      }
      static checkSocketUsage(Q, B) {
        var G, Z;
        let {
          sockets: Y,
          requests: J,
          maxSockets: X
        } = Q;
        if (typeof X !== "number" || X === 1 / 0) return B;
        let I = 15000;
        if (Date.now() - I < B) return B;
        if (Y && J)
          for (let D in Y) {
            let W = ((G = Y[D]) == null ? void 0 : G.length) ?? 0,
              K = ((Z = J[D]) == null ? void 0 : Z.length) ?? 0;
            if (W >= X && K >= 2 * X) return console.warn("@smithy/node-http-handler:WARN", `socket usage at capacity=${W} and ${K} additional requests are enqueued.`, "See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html", "or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config."), Date.now()
          }
        return B
      }
      resolveDefaultConfig(Q) {
        let {
          requestTimeout: B,
          connectionTimeout: G,
          socketTimeout: Z,
          httpAgent: Y,
          httpsAgent: J
        } = Q || {}, X = !0, I = 50;
        return {
          connectionTimeout: G,
          requestTimeout: B ?? Z,
          httpAgent: (() => {
            if (Y instanceof q90.Agent || typeof (Y == null ? void 0 : Y.destroy) === "function") return Y;
            return new q90.Agent({
              keepAlive: !0,
              maxSockets: 50,
              ...Y
            })
          })(),
          httpsAgent: (() => {
            if (J instanceof N90.Agent || typeof (J == null ? void 0 : J.destroy) === "function") return J;
            return new N90.Agent({
              keepAlive: !0,
              maxSockets: 50,
              ...J
            })
          })()
        }
      }
      destroy() {
        var Q, B, G, Z;
        (B = (Q = this.config) == null ? void 0 : Q.httpAgent) == null || B.destroy(), (Z = (G = this.config) == null ? void 0 : G.httpsAgent) == null || Z.destroy()
      }
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) this.config = await this.configProvider;
        let G;
        return new Promise((Z, Y) => {
          let J = void 0,
            X = KF(async (O) => {
              await J, clearTimeout(G), Z(O)
            }, "resolve"),
            I = KF(async (O) => {
              await J, Y(O)
            }, "reject");
          if (!this.config) throw Error("Node HTTP request handler config is not resolved");
          if (B == null ? void 0 : B.aborted) {
            let O = Error("Request aborted");
            O.name = "AbortError", I(O);
            return
          }
          let D = Q.protocol === "https:",
            W = D ? this.config.httpsAgent : this.config.httpAgent;
          G = setTimeout(() => {
            this.socketWarningTimestamp = A.checkSocketUsage(W, this.socketWarningTimestamp)
          }, this.config.socketAcquisitionWarningTimeout ?? (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000));
          let K = (0, LxB.buildQueryString)(Q.query || {}),
            V = void 0;
          if (Q.username != null || Q.password != null) {
            let O = Q.username ?? "",
              L = Q.password ?? "";
            V = `${O}:${L}`
          }
          let F = Q.path;
          if (K) F += `?${K}`;
          if (Q.fragment) F += `#${Q.fragment}`;
          let H = {
              headers: Q.headers,
              host: Q.hostname,
              method: Q.method,
              path: F,
              port: Q.port,
              agent: W,
              auth: V
            },
            z = (D ? N90.request : q90.request)(H, (O) => {
              let L = new wxB.HttpResponse({
                statusCode: O.statusCode || -1,
                reason: O.statusMessage,
                headers: OxB(O.headers),
                body: O
              });
              X({
                response: L
              })
            });
          if (z.on("error", (O) => {
              if (GL8.includes(O.code)) I(Object.assign(O, {
                name: "TimeoutError"
              }));
              else I(O)
            }), ZL8(z, I, this.config.connectionTimeout), JL8(z, I, this.config.requestTimeout), B) B.onabort = () => {
            z.abort();
            let O = Error("Request aborted");
            O.name = "AbortError", I(O)
          };
          let $ = H.agent;
          if (typeof $ === "object" && "keepAlive" in $) YL8(z, {
            keepAlive: $.keepAlive,
            keepAliveMsecs: $.keepAliveMsecs
          });
          J = w90(z, Q, this.config.requestTimeout).catch(Y)
        })
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return {
            ...G,
            [Q]: B
          }
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
    };
  KF(_xB, "NodeHttpHandler");
  var IL8 = _xB,
    UxB = NA("http2"),
    DL8 = QL8(NA("http2")),
    jxB = class {
      constructor(Q) {
        this.sessions = [], this.sessions = Q ?? []
      }
      poll() {
        if (this.sessions.length > 0) return this.sessions.shift()
      }
      offerLast(Q) {
        this.sessions.push(Q)
      }
      contains(Q) {
        return this.sessions.includes(Q)
      }
      remove(Q) {
        this.sessions = this.sessions.filter((B) => B !== Q)
      } [Symbol.iterator]() {
        return this.sessions[Symbol.iterator]()
      }
      destroy(Q) {
        for (let B of this.sessions)
          if (B === Q) {
            if (!B.destroyed) B.destroy()
          }
      }
    };
  KF(jxB, "NodeHttp2ConnectionPool");
  var WL8 = jxB,
    TxB = class {
      constructor(Q) {
        if (this.sessionCache = new Map, this.config = Q, this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrency must be greater than zero.")
      }
      lease(Q, B) {
        let G = this.getUrlString(Q),
          Z = this.sessionCache.get(G);
        if (Z) {
          let I = Z.poll();
          if (I && !this.config.disableConcurrency) return I
        }
        let Y = DL8.default.connect(G);
        if (this.config.maxConcurrency) Y.settings({
          maxConcurrentStreams: this.config.maxConcurrency
        }, (I) => {
          if (I) throw Error("Fail to set maxConcurrentStreams to " + this.config.maxConcurrency + "when creating new session for " + Q.destination.toString())
        });
        Y.unref();
        let J = KF(() => {
          Y.destroy(), this.deleteSession(G, Y)
        }, "destroySessionCb");
        if (Y.on("goaway", J), Y.on("error", J), Y.on("frameError", J), Y.on("close", () => this.deleteSession(G, Y)), B.requestTimeout) Y.setTimeout(B.requestTimeout, J);
        let X = this.sessionCache.get(G) || new WL8;
        return X.offerLast(Y), this.sessionCache.set(G, X), Y
      }
      deleteSession(Q, B) {
        let G = this.sessionCache.get(Q);
        if (!G) return;
        if (!G.contains(B)) return;
        G.remove(B), this.sessionCache.set(Q, G)
      }
      release(Q, B) {
        var G;
        let Z = this.getUrlString(Q);
        (G = this.sessionCache.get(Z)) == null || G.offerLast(B)
      }
      destroy() {
        for (let [Q, B] of this.sessionCache) {
          for (let G of B) {
            if (!G.destroyed) G.destroy();
            B.remove(G)
          }
          this.sessionCache.delete(Q)
        }
      }
      setMaxConcurrentStreams(Q) {
        if (this.config.maxConcurrency && this.config.maxConcurrency <= 0) throw RangeError("maxConcurrentStreams must be greater than zero.");
        this.config.maxConcurrency = Q
      }
      setDisableConcurrentStreams(Q) {
        this.config.disableConcurrency = Q
      }
      getUrlString(Q) {
        return Q.destination.toString()
      }
    };
  KF(TxB, "NodeHttp2ConnectionManager");
  var KL8 = TxB,
    PxB = class A {
      constructor(Q) {
        this.metadata = {
          handlerProtocol: "h2"
        }, this.connectionManager = new KL8({}), this.configProvider = new Promise((B, G) => {
          if (typeof Q === "function") Q().then((Z) => {
            B(Z || {})
          }).catch(G);
          else B(Q || {})
        })
      }
      static create(Q) {
        if (typeof (Q == null ? void 0 : Q.handle) === "function") return Q;
        return new A(Q)
      }
      destroy() {
        this.connectionManager.destroy()
      }
      async handle(Q, {
        abortSignal: B
      } = {}) {
        if (!this.config) {
          if (this.config = await this.configProvider, this.connectionManager.setDisableConcurrentStreams(this.config.disableConcurrentStreams || !1), this.config.maxConcurrentStreams) this.connectionManager.setMaxConcurrentStreams(this.config.maxConcurrentStreams)
        }
        let {
          requestTimeout: G,
          disableConcurrentStreams: Z
        } = this.config;
        return new Promise((Y, J) => {
          var X;
          let I = !1,
            D = void 0,
            W = KF(async (S) => {
              await D, Y(S)
            }, "resolve"),
            K = KF(async (S) => {
              await D, J(S)
            }, "reject");
          if (B == null ? void 0 : B.aborted) {
            I = !0;
            let S = Error("Request aborted");
            S.name = "AbortError", K(S);
            return
          }
          let {
            hostname: V,
            method: F,
            port: H,
            protocol: E,
            query: z
          } = Q, $ = "";
          if (Q.username != null || Q.password != null) {
            let S = Q.username ?? "",
              u = Q.password ?? "";
            $ = `${S}:${u}@`
          }
          let O = `${E}//${$}${V}${H?`:${H}`:""}`,
            L = {
              destination: new URL(O)
            },
            M = this.connectionManager.lease(L, {
              requestTimeout: (X = this.config) == null ? void 0 : X.sessionTimeout,
              disableConcurrentStreams: Z || !1
            }),
            _ = KF((S) => {
              if (Z) this.destroySession(M);
              I = !0, K(S)
            }, "rejectWithDestroy"),
            j = (0, LxB.buildQueryString)(z || {}),
            x = Q.path;
          if (j) x += `?${j}`;
          if (Q.fragment) x += `#${Q.fragment}`;
          let b = M.request({
            ...Q.headers,
            [UxB.constants.HTTP2_HEADER_PATH]: x,
            [UxB.constants.HTTP2_HEADER_METHOD]: F
          });
          if (M.ref(), b.on("response", (S) => {
              let u = new wxB.HttpResponse({
                statusCode: S[":status"] || -1,
                headers: OxB(S),
                body: b
              });
              if (I = !0, W({
                  response: u
                }), Z) M.close(), this.connectionManager.deleteSession(O, M)
            }), G) b.setTimeout(G, () => {
            b.close();
            let S = Error(`Stream timed out because of no activity for ${G} ms`);
            S.name = "TimeoutError", _(S)
          });
          if (B) B.onabort = () => {
            b.close();
            let S = Error("Request aborted");
            S.name = "AbortError", _(S)
          };
          b.on("frameError", (S, u, f) => {
            _(Error(`Frame type id ${S} in stream id ${f} has failed with code ${u}.`))
          }), b.on("error", _), b.on("aborted", () => {
            _(Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${b.rstCode}.`))
          }), b.on("close", () => {
            if (M.unref(), Z) M.destroy();
            if (!I) _(Error("Unexpected error: http2 request did not get a response"))
          }), D = w90(b, Q, G)
        })
      }
      updateHttpClientConfig(Q, B) {
        this.config = void 0, this.configProvider = this.configProvider.then((G) => {
          return {
            ...G,
            [Q]: B
          }
        })
      }
      httpHandlerConfigs() {
        return this.config ?? {}
      }
      destroySession(Q) {
        if (!Q.destroyed) Q.destroy()
      }
    };
  KF(PxB, "NodeHttp2Handler");
  var VL8 = PxB,
    SxB = class extends MxB.Writable {
      constructor() {
        super(...arguments);
        this.bufferedBytes = []
      }
      _write(Q, B, G) {
        this.bufferedBytes.push(Q), G()
      }
    };
  KF(SxB, "Collector");
  var FL8 = SxB,
    HL8 = KF((A) => new Promise((Q, B) => {
      let G = new FL8;
      A.pipe(G), A.on("error", (Z) => {
        G.end(), B(Z)
      }), G.on("error", B), G.on("finish", function () {
        let Z = new Uint8Array(Buffer.concat(this.bufferedBytes));
        Q(Z)
      })
    }), "streamCollector")
})
// @from(Ln 199944, Col 4)
fxB = U((kxB) => {
  Object.defineProperty(kxB, "__esModule", {
    value: !0
  });
  kxB.sdkStreamMixin = void 0;
  var EL8 = yxB(),
    zL8 = v0A(),
    L90 = NA("stream"),
    $L8 = NA("util"),
    vxB = "The stream has already been transformed.",
    CL8 = (A) => {
      var Q, B;
      if (!(A instanceof L90.Readable)) {
        let Y = ((B = (Q = A === null || A === void 0 ? void 0 : A.__proto__) === null || Q === void 0 ? void 0 : Q.constructor) === null || B === void 0 ? void 0 : B.name) || A;
        throw Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${Y}`)
      }
      let G = !1,
        Z = async () => {
          if (G) throw Error(vxB);
          return G = !0, await (0, EL8.streamCollector)(A)
        };
      return Object.assign(A, {
        transformToByteArray: Z,
        transformToString: async (Y) => {
          let J = await Z();
          if (Y === void 0 || Buffer.isEncoding(Y)) return (0, zL8.fromArrayBuffer)(J.buffer, J.byteOffset, J.byteLength).toString(Y);
          else return new $L8.TextDecoder(Y).decode(J)
        },
        transformToWebStream: () => {
          if (G) throw Error(vxB);
          if (A.readableFlowing !== null) throw Error("The stream has been consumed by other callbacks.");
          if (typeof L90.Readable.toWeb !== "function") throw Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
          return G = !0, L90.Readable.toWeb(A)
        }
      })
    };
  kxB.sdkStreamMixin = CL8
})
// @from(Ln 199982, Col 4)
pxB = U((YdG, R41) => {
  var {
    defineProperty: O41,
    getOwnPropertyDescriptor: UL8,
    getOwnPropertyNames: qL8
  } = Object, NL8 = Object.prototype.hasOwnProperty, R90 = (A, Q) => O41(A, "name", {
    value: Q,
    configurable: !0
  }), wL8 = (A, Q) => {
    for (var B in Q) O41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, O90 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qL8(Q))
        if (!NL8.call(A, Z) && Z !== B) O41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = UL8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, hxB = (A, Q, B) => (O90(A, Q, "default"), B && O90(B, Q, "default")), LL8 = (A) => O90(O41({}, "__esModule", {
    value: !0
  }), A), M41 = {};
  wL8(M41, {
    Uint8ArrayBlobAdapter: () => M90
  });
  R41.exports = LL8(M41);
  var gxB = E90(),
    uxB = JxB();

  function mxB(A, Q = "utf-8") {
    if (Q === "base64") return (0, gxB.toBase64)(A);
    return (0, uxB.toUtf8)(A)
  }
  R90(mxB, "transformToString");

  function dxB(A, Q) {
    if (Q === "base64") return M90.mutate((0, gxB.fromBase64)(A));
    return M90.mutate((0, uxB.fromUtf8)(A))
  }
  R90(dxB, "transformFromString");
  var cxB = class A extends Uint8Array {
    static fromString(Q, B = "utf-8") {
      switch (typeof Q) {
        case "string":
          return dxB(Q, B);
        default:
          throw Error(`Unsupported conversion from ${typeof Q} to Uint8ArrayBlobAdapter.`)
      }
    }
    static mutate(Q) {
      return Object.setPrototypeOf(Q, A.prototype), Q
    }
    transformToString(Q = "utf-8") {
      return mxB(this, Q)
    }
  };
  R90(cxB, "Uint8ArrayBlobAdapter");
  var M90 = cxB;
  hxB(M41, DxB(), R41.exports);
  hxB(M41, fxB(), R41.exports)
})
// @from(Ln 200046, Col 4)
HyB = U((JdG, FyB) => {
  var {
    defineProperty: P41,
    getOwnPropertyDescriptor: OL8,
    getOwnPropertyNames: ML8
  } = Object, RL8 = Object.prototype.hasOwnProperty, G2 = (A, Q) => P41(A, "name", {
    value: Q,
    configurable: !0
  }), _L8 = (A, Q) => {
    for (var B in Q) P41(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, jL8 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ML8(Q))
        if (!RL8.call(A, Z) && Z !== B) P41(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = OL8(Q, Z)) || G.enumerable
        })
    }
    return A
  }, TL8 = (A) => jL8(P41({}, "__esModule", {
    value: !0
  }), A), ixB = {};
  _L8(ixB, {
    Client: () => SL8,
    Command: () => sxB,
    LazyJsonString: () => _O8,
    NoOpLogger: () => PL8,
    SENSITIVE_STRING: () => vL8,
    ServiceException: () => EO8,
    StringWrapper: () => ijA,
    _json: () => y90,
    collectBody: () => xL8,
    convertMap: () => jO8,
    createAggregatedClient: () => kL8,
    dateToUtcString: () => ZyB,
    decorateServiceException: () => JyB,
    emitWarningIfUnsupportedVersion: () => UO8,
    expectBoolean: () => fL8,
    expectByte: () => x90,
    expectFloat32: () => _41,
    expectInt: () => gL8,
    expectInt32: () => P90,
    expectLong: () => pjA,
    expectNonNull: () => mL8,
    expectNumber: () => cjA,
    expectObject: () => exB,
    expectShort: () => S90,
    expectString: () => dL8,
    expectUnion: () => cL8,
    extendedEncodeURIComponent: () => T41,
    getArrayIfSingleItem: () => RO8,
    getDefaultClientConfiguration: () => OO8,
    getDefaultExtensionConfiguration: () => IyB,
    getValueFromTextNode: () => DyB,
    handleFloat: () => iL8,
    limitedParseDouble: () => b90,
    limitedParseFloat: () => nL8,
    limitedParseFloat32: () => aL8,
    loadConfigsForDefaultMode: () => CO8,
    logger: () => ljA,
    map: () => h90,
    parseBoolean: () => bL8,
    parseEpochTimestamp: () => JO8,
    parseRfc3339DateTime: () => eL8,
    parseRfc3339DateTimeWithOffset: () => QO8,
    parseRfc7231DateTime: () => YO8,
    resolveDefaultRuntimeConfig: () => MO8,
    resolvedPath: () => yO8,
    serializeFloat: () => vO8,
    splitEvery: () => VyB,
    strictParseByte: () => GyB,
    strictParseDouble: () => k90,
    strictParseFloat: () => pL8,
    strictParseFloat32: () => AyB,
    strictParseInt: () => oL8,
    strictParseInt32: () => rL8,
    strictParseLong: () => ByB,
    strictParseShort: () => PDA,
    take: () => TO8,
    throwDefaultError: () => XyB,
    withBaseException: () => zO8
  });
  FyB.exports = TL8(ixB);
  var nxB = class {
    trace() {}
    debug() {}
    info() {}
    warn() {}
    error() {}
  };
  G2(nxB, "NoOpLogger");
  var PL8 = nxB,
    axB = QxB(),
    oxB = class {
      constructor(Q) {
        this.middlewareStack = (0, axB.constructStack)(), this.config = Q
      }
      send(Q, B, G) {
        let Z = typeof B !== "function" ? B : void 0,
          Y = typeof B === "function" ? B : G,
          J = Q.resolveMiddleware(this.middlewareStack, this.config, Z);
        if (Y) J(Q).then((X) => Y(null, X.output), (X) => Y(X)).catch(() => {});
        else return J(Q).then((X) => X.output)
      }
      destroy() {
        if (this.config.requestHandler.destroy) this.config.requestHandler.destroy()
      }
    };
  G2(oxB, "Client");
  var SL8 = oxB,
    _90 = pxB(),
    xL8 = G2(async (A = new Uint8Array, Q) => {
      if (A instanceof Uint8Array) return _90.Uint8ArrayBlobAdapter.mutate(A);
      if (!A) return _90.Uint8ArrayBlobAdapter.mutate(new Uint8Array);
      let B = Q.streamCollector(A);
      return _90.Uint8ArrayBlobAdapter.mutate(await B)
    }, "collectBody"),
    T90 = l20(),
    rxB = class {
      constructor() {
        this.middlewareStack = (0, axB.constructStack)()
      }
      static classBuilder() {
        return new yL8
      }
      resolveMiddlewareWithContext(Q, B, G, {
        middlewareFn: Z,
        clientName: Y,
        commandName: J,
        inputFilterSensitiveLog: X,
        outputFilterSensitiveLog: I,
        smithyContext: D,
        additionalContext: W,
        CommandCtor: K
      }) {
        for (let z of Z.bind(this)(K, Q, B, G)) this.middlewareStack.use(z);
        let V = Q.concat(this.middlewareStack),
          {
            logger: F
          } = B,
          H = {
            logger: F,
            clientName: Y,
            commandName: J,
            inputFilterSensitiveLog: X,
            outputFilterSensitiveLog: I,
            [T90.SMITHY_CONTEXT_KEY]: {
              ...D
            },
            ...W
          },
          {
            requestHandler: E
          } = B;
        return V.resolve((z) => E.handle(z.request, G || {}), H)
      }
    };
  G2(rxB, "Command");
  var sxB = rxB,
    txB = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (Q) => Q, this._outputFilterSensitiveLog = (Q) => Q, this._serializer = null, this._deserializer = null
      }
      init(Q) {
        this._init = Q
      }
      ep(Q) {
        return this._ep = Q, this
      }
      m(Q) {
        return this._middlewareFn = Q, this
      }
      s(Q, B, G = {}) {
        return this._smithyContext = {
          service: Q,
          operation: B,
          ...G
        }, this
      }
      c(Q = {}) {
        return this._additionalContext = Q, this
      }
      n(Q, B) {
        return this._clientName = Q, this._commandName = B, this
      }
      f(Q = (G) => G, B = (G) => G) {
        return this._inputFilterSensitiveLog = Q, this._outputFilterSensitiveLog = B, this
      }
      ser(Q) {
        return this._serializer = Q, this
      }
      de(Q) {
        return this._deserializer = Q, this
      }
      build() {
        var Q;
        let B = this,
          G;
        return G = (Q = class extends sxB {
          constructor(...[Z]) {
            super();
            this.serialize = B._serializer, this.deserialize = B._deserializer, this.input = Z ?? {}, B._init(this)
          }
          static getEndpointParameterInstructions() {
            return B._ep
          }
          resolveMiddleware(Z, Y, J) {
            return this.resolveMiddlewareWithContext(Z, Y, J, {
              CommandCtor: G,
              middlewareFn: B._middlewareFn,
              clientName: B._clientName,
              commandName: B._commandName,
              inputFilterSensitiveLog: B._inputFilterSensitiveLog,
              outputFilterSensitiveLog: B._outputFilterSensitiveLog,
              smithyContext: B._smithyContext,
              additionalContext: B._additionalContext
            })
          }
        }, G2(Q, "CommandRef"), Q)
      }
    };
  G2(txB, "ClassBuilder");
  var yL8 = txB,
    vL8 = "***SensitiveInformation***",
    kL8 = G2((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = G2(async function (J, X, I) {
            let D = new G(J);
            if (typeof X === "function") this.send(D, X);
            else if (typeof I === "function") {
              if (typeof X !== "object") throw Error(`Expected http options but got ${typeof X}`);
              this.send(D, X || {}, I)
            } else return this.send(D, X)
          }, "methodImpl"),
          Y = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[Y] = Z
      }
    }, "createAggregatedClient"),
    bL8 = G2((A) => {
      switch (A) {
        case "true":
          return !0;
        case "false":
          return !1;
        default:
          throw Error(`Unable to parse boolean value "${A}"`)
      }
    }, "parseBoolean"),
    fL8 = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "number") {
        if (A === 0 || A === 1) ljA.warn(j41(`Expected boolean, got ${typeof A}: ${A}`));
        if (A === 0) return !1;
        if (A === 1) return !0
      }
      if (typeof A === "string") {
        let Q = A.toLowerCase();
        if (Q === "false" || Q === "true") ljA.warn(j41(`Expected boolean, got ${typeof A}: ${A}`));
        if (Q === "false") return !1;
        if (Q === "true") return !0
      }
      if (typeof A === "boolean") return A;
      throw TypeError(`Expected boolean, got ${typeof A}: ${A}`)
    }, "expectBoolean"),
    cjA = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") {
        let Q = parseFloat(A);
        if (!Number.isNaN(Q)) {
          if (String(Q) !== String(A)) ljA.warn(j41(`Expected number but observed string: ${A}`));
          return Q
        }
      }
      if (typeof A === "number") return A;
      throw TypeError(`Expected number, got ${typeof A}: ${A}`)
    }, "expectNumber"),
    hL8 = Math.ceil(340282346638528860000000000000000000000),
    _41 = G2((A) => {
      let Q = cjA(A);
      if (Q !== void 0 && !Number.isNaN(Q) && Q !== 1 / 0 && Q !== -1 / 0) {
        if (Math.abs(Q) > hL8) throw TypeError(`Expected 32-bit float, got ${A}`)
      }
      return Q
    }, "expectFloat32"),
    pjA = G2((A) => {
      if (A === null || A === void 0) return;
      if (Number.isInteger(A) && !Number.isNaN(A)) return A;
      throw TypeError(`Expected integer, got ${typeof A}: ${A}`)
    }, "expectLong"),
    gL8 = pjA,
    P90 = G2((A) => v90(A, 32), "expectInt32"),
    S90 = G2((A) => v90(A, 16), "expectShort"),
    x90 = G2((A) => v90(A, 8), "expectByte"),
    v90 = G2((A, Q) => {
      let B = pjA(A);
      if (B !== void 0 && uL8(B, Q) !== B) throw TypeError(`Expected ${Q}-bit integer, got ${A}`);
      return B
    }, "expectSizedInt"),
    uL8 = G2((A, Q) => {
      switch (Q) {
        case 32:
          return Int32Array.of(A)[0];
        case 16:
          return Int16Array.of(A)[0];
        case 8:
          return Int8Array.of(A)[0]
      }
    }, "castInt"),
    mL8 = G2((A, Q) => {
      if (A === null || A === void 0) {
        if (Q) throw TypeError(`Expected a non-null value for ${Q}`);
        throw TypeError("Expected a non-null value")
      }
      return A
    }, "expectNonNull"),
    exB = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "object" && !Array.isArray(A)) return A;
      let Q = Array.isArray(A) ? "array" : typeof A;
      throw TypeError(`Expected object, got ${Q}: ${A}`)
    }, "expectObject"),
    dL8 = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A === "string") return A;
      if (["boolean", "number", "bigint"].includes(typeof A)) return ljA.warn(j41(`Expected string, got ${typeof A}: ${A}`)), String(A);
      throw TypeError(`Expected string, got ${typeof A}: ${A}`)
    }, "expectString"),
    cL8 = G2((A) => {
      if (A === null || A === void 0) return;
      let Q = exB(A),
        B = Object.entries(Q).filter(([, G]) => G != null).map(([G]) => G);
      if (B.length === 0) throw TypeError("Unions must have exactly one non-null member. None were found.");
      if (B.length > 1) throw TypeError(`Unions must have exactly one non-null member. Keys ${B} were not null.`);
      return Q
    }, "expectUnion"),
    k90 = G2((A) => {
      if (typeof A == "string") return cjA(xDA(A));
      return cjA(A)
    }, "strictParseDouble"),
    pL8 = k90,
    AyB = G2((A) => {
      if (typeof A == "string") return _41(xDA(A));
      return _41(A)
    }, "strictParseFloat32"),
    lL8 = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g,
    xDA = G2((A) => {
      let Q = A.match(lL8);
      if (Q === null || Q[0].length !== A.length) throw TypeError("Expected real number, got implicit NaN");
      return parseFloat(A)
    }, "parseNumber"),
    b90 = G2((A) => {
      if (typeof A == "string") return QyB(A);
      return cjA(A)
    }, "limitedParseDouble"),
    iL8 = b90,
    nL8 = b90,
    aL8 = G2((A) => {
      if (typeof A == "string") return QyB(A);
      return _41(A)
    }, "limitedParseFloat32"),
    QyB = G2((A) => {
      switch (A) {
        case "NaN":
          return NaN;
        case "Infinity":
          return 1 / 0;
        case "-Infinity":
          return -1 / 0;
        default:
          throw Error(`Unable to parse float value: ${A}`)
      }
    }, "parseFloatString"),
    ByB = G2((A) => {
      if (typeof A === "string") return pjA(xDA(A));
      return pjA(A)
    }, "strictParseLong"),
    oL8 = ByB,
    rL8 = G2((A) => {
      if (typeof A === "string") return P90(xDA(A));
      return P90(A)
    }, "strictParseInt32"),
    PDA = G2((A) => {
      if (typeof A === "string") return S90(xDA(A));
      return S90(A)
    }, "strictParseShort"),
    GyB = G2((A) => {
      if (typeof A === "string") return x90(xDA(A));
      return x90(A)
    }, "strictParseByte"),
    j41 = G2((A) => {
      return String(TypeError(A).stack || A).split(`
`).slice(0, 5).filter((Q) => !Q.includes("stackTraceWarning")).join(`
`)
    }, "stackTraceWarning"),
    ljA = {
      warn: console.warn
    },
    sL8 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    f90 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function ZyB(A) {
    let Q = A.getUTCFullYear(),
      B = A.getUTCMonth(),
      G = A.getUTCDay(),
      Z = A.getUTCDate(),
      Y = A.getUTCHours(),
      J = A.getUTCMinutes(),
      X = A.getUTCSeconds(),
      I = Z < 10 ? `0${Z}` : `${Z}`,
      D = Y < 10 ? `0${Y}` : `${Y}`,
      W = J < 10 ? `0${J}` : `${J}`,
      K = X < 10 ? `0${X}` : `${X}`;
    return `${sL8[G]}, ${I} ${f90[B]} ${Q} ${D}:${W}:${K} GMT`
  }
  G2(ZyB, "dateToUtcString");
  var tL8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/),
    eL8 = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = tL8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, Y, J, X, I, D] = Q, W = PDA(SDA(G)), K = bk(Z, "month", 1, 12), V = bk(Y, "day", 1, 31);
      return djA(W, K, V, {
        hours: J,
        minutes: X,
        seconds: I,
        fractionalMilliseconds: D
      })
    }, "parseRfc3339DateTime"),
    AO8 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/),
    QO8 = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-3339 date-times must be expressed as strings");
      let Q = AO8.exec(A);
      if (!Q) throw TypeError("Invalid RFC-3339 date-time value");
      let [B, G, Z, Y, J, X, I, D, W] = Q, K = PDA(SDA(G)), V = bk(Z, "month", 1, 12), F = bk(Y, "day", 1, 31), H = djA(K, V, F, {
        hours: J,
        minutes: X,
        seconds: I,
        fractionalMilliseconds: D
      });
      if (W.toUpperCase() != "Z") H.setTime(H.getTime() - HO8(W));
      return H
    }, "parseRfc3339DateTimeWithOffset"),
    BO8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    GO8 = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/),
    ZO8 = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/),
    YO8 = G2((A) => {
      if (A === null || A === void 0) return;
      if (typeof A !== "string") throw TypeError("RFC-7231 date-times must be expressed as strings");
      let Q = BO8.exec(A);
      if (Q) {
        let [B, G, Z, Y, J, X, I, D] = Q;
        return djA(PDA(SDA(Y)), j90(Z), bk(G, "day", 1, 31), {
          hours: J,
          minutes: X,
          seconds: I,
          fractionalMilliseconds: D
        })
      }
      if (Q = GO8.exec(A), Q) {
        let [B, G, Z, Y, J, X, I, D] = Q;
        return DO8(djA(XO8(Y), j90(Z), bk(G, "day", 1, 31), {
          hours: J,
          minutes: X,
          seconds: I,
          fractionalMilliseconds: D
        }))
      }
      if (Q = ZO8.exec(A), Q) {
        let [B, G, Z, Y, J, X, I, D] = Q;
        return djA(PDA(SDA(D)), j90(G), bk(Z.trimLeft(), "day", 1, 31), {
          hours: Y,
          minutes: J,
          seconds: X,
          fractionalMilliseconds: I
        })
      }
      throw TypeError("Invalid RFC-7231 date-time value")
    }, "parseRfc7231DateTime"),
    JO8 = G2((A) => {
      if (A === null || A === void 0) return;
      let Q;
      if (typeof A === "number") Q = A;
      else if (typeof A === "string") Q = k90(A);
      else throw TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
      if (Number.isNaN(Q) || Q === 1 / 0 || Q === -1 / 0) throw TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
      return new Date(Math.round(Q * 1000))
    }, "parseEpochTimestamp"),
    djA = G2((A, Q, B, G) => {
      let Z = Q - 1;
      return KO8(A, Z, B), new Date(Date.UTC(A, Z, B, bk(G.hours, "hour", 0, 23), bk(G.minutes, "minute", 0, 59), bk(G.seconds, "seconds", 0, 60), FO8(G.fractionalMilliseconds)))
    }, "buildDate"),
    XO8 = G2((A) => {
      let Q = new Date().getUTCFullYear(),
        B = Math.floor(Q / 100) * 100 + PDA(SDA(A));
      if (B < Q) return B + 100;
      return B
    }, "parseTwoDigitYear"),
    IO8 = 1576800000000,
    DO8 = G2((A) => {
      if (A.getTime() - new Date().getTime() > IO8) return new Date(Date.UTC(A.getUTCFullYear() - 100, A.getUTCMonth(), A.getUTCDate(), A.getUTCHours(), A.getUTCMinutes(), A.getUTCSeconds(), A.getUTCMilliseconds()));
      return A
    }, "adjustRfc850Year"),
    j90 = G2((A) => {
      let Q = f90.indexOf(A);
      if (Q < 0) throw TypeError(`Invalid month: ${A}`);
      return Q + 1
    }, "parseMonthByShortName"),
    WO8 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    KO8 = G2((A, Q, B) => {
      let G = WO8[Q];
      if (Q === 1 && VO8(A)) G = 29;
      if (B > G) throw TypeError(`Invalid day for ${f90[Q]} in ${A}: ${B}`)
    }, "validateDayOfMonth"),
    VO8 = G2((A) => {
      return A % 4 === 0 && (A % 100 !== 0 || A % 400 === 0)
    }, "isLeapYear"),
    bk = G2((A, Q, B, G) => {
      let Z = GyB(SDA(A));
      if (Z < B || Z > G) throw TypeError(`${Q} must be between ${B} and ${G}, inclusive`);
      return Z
    }, "parseDateValue"),
    FO8 = G2((A) => {
      if (A === null || A === void 0) return 0;
      return AyB("0." + A) * 1000
    }, "parseMilliseconds"),
    HO8 = G2((A) => {
      let Q = A[0],
        B = 1;
      if (Q == "+") B = 1;
      else if (Q == "-") B = -1;
      else throw TypeError(`Offset direction, ${Q}, must be "+" or "-"`);
      let G = Number(A.substring(1, 3)),
        Z = Number(A.substring(4, 6));
      return B * (G * 60 + Z) * 60 * 1000
    }, "parseOffsetToMilliseconds"),
    SDA = G2((A) => {
      let Q = 0;
      while (Q < A.length - 1 && A.charAt(Q) === "0") Q++;
      if (Q === 0) return A;
      return A.slice(Q)
    }, "stripLeadingZeroes"),
    YyB = class A extends Error {
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, A.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
    };
  G2(YyB, "ServiceException");
  var EO8 = YyB,
    JyB = G2((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    XyB = G2(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = $O8(A),
        Y = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        J = new B({
          name: (Q == null ? void 0 : Q.code) || (Q == null ? void 0 : Q.Code) || G || Y || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw JyB(J, Q)
    }, "throwDefaultError"),
    zO8 = G2((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        XyB({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    $O8 = G2((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    CO8 = G2((A) => {
      switch (A) {
        case "standard":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "in-region":
          return {
            retryMode: "standard", connectionTimeout: 1100
          };
        case "cross-region":
          return {
            retryMode: "standard", connectionTimeout: 3100
          };
        case "mobile":
          return {
            retryMode: "standard", connectionTimeout: 30000
          };
        default:
          return {}
      }
    }, "loadConfigsForDefaultMode"),
    lxB = !1,
    UO8 = G2((A) => {
      if (A && !lxB && parseInt(A.substring(1, A.indexOf("."))) < 14) lxB = !0
    }, "emitWarningIfUnsupportedVersion"),
    qO8 = G2((A) => {
      let Q = [];
      for (let B in T90.AlgorithmId) {
        let G = T90.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        _checksumAlgorithms: Q,
        addChecksumAlgorithm(B) {
          this._checksumAlgorithms.push(B)
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms
        }
      }
    }, "getChecksumConfiguration"),
    NO8 = G2((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    wO8 = G2((A) => {
      let Q = A.retryStrategy;
      return {
        setRetryStrategy(B) {
          Q = B
        },
        retryStrategy() {
          return Q
        }
      }
    }, "getRetryConfiguration"),
    LO8 = G2((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    IyB = G2((A) => {
      return {
        ...qO8(A),
        ...wO8(A)
      }
    }, "getDefaultExtensionConfiguration"),
    OO8 = IyB,
    MO8 = G2((A) => {
      return {
        ...NO8(A),
        ...LO8(A)
      }
    }, "resolveDefaultRuntimeConfig");

  function T41(A) {
    return encodeURIComponent(A).replace(/[!'()*]/g, function (Q) {
      return "%" + Q.charCodeAt(0).toString(16).toUpperCase()
    })
  }
  G2(T41, "extendedEncodeURIComponent");
  var RO8 = G2((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    DyB = G2((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = DyB(A[B]);
      return A
    }, "getValueFromTextNode"),
    ijA = G2(function () {
      let A = Object.getPrototypeOf(this).constructor,
        B = new(Function.bind.apply(String, [null, ...arguments]));
      return Object.setPrototypeOf(B, A.prototype), B
    }, "StringWrapper");
  ijA.prototype = Object.create(String.prototype, {
    constructor: {
      value: ijA,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  });
  Object.setPrototypeOf(ijA, String);
  var WyB = class A extends ijA {
    deserializeJSON() {
      return JSON.parse(super.toString())
    }
    toJSON() {
      return super.toString()
    }
    static fromObject(Q) {
      if (Q instanceof A) return Q;
      else if (Q instanceof String || typeof Q === "string") return new A(Q);
      return new A(JSON.stringify(Q))
    }
  };
  G2(WyB, "LazyJsonString");
  var _O8 = WyB;

  function h90(A, Q, B) {
    let G, Z, Y;
    if (typeof Q > "u" && typeof B > "u") G = {}, Y = A;
    else if (G = A, typeof Q === "function") return Z = Q, Y = B, PO8(G, Z, Y);
    else Y = Q;
    for (let J of Object.keys(Y)) {
      if (!Array.isArray(Y[J])) {
        G[J] = Y[J];
        continue
      }
      KyB(G, null, Y, J)
    }
    return G
  }
  G2(h90, "map");
  var jO8 = G2((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    TO8 = G2((A, Q) => {
      let B = {};
      for (let G in Q) KyB(B, A, Q, G);
      return B
    }, "take"),
    PO8 = G2((A, Q, B) => {
      return h90(A, Object.entries(B).reduce((G, [Z, Y]) => {
        if (Array.isArray(Y)) G[Z] = Y;
        else if (typeof Y === "function") G[Z] = [Q, Y()];
        else G[Z] = [Q, Y];
        return G
      }, {}))
    }, "mapWithFilter"),
    KyB = G2((A, Q, B, G) => {
      if (Q !== null) {
        let J = B[G];
        if (typeof J === "function") J = [, J];
        let [X = SO8, I = xO8, D = G] = J;
        if (typeof X === "function" && X(Q[D]) || typeof X !== "function" && !!X) A[G] = I(Q[D]);
        return
      }
      let [Z, Y] = B[G];
      if (typeof Y === "function") {
        let J, X = Z === void 0 && (J = Y()) != null,
          I = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (X) A[G] = J;
        else if (I) A[G] = Y()
      } else {
        let J = Z === void 0 && Y != null,
          X = typeof Z === "function" && !!Z(Y) || typeof Z !== "function" && !!Z;
        if (J || X) A[G] = Y
      }
    }, "applyInstruction"),
    SO8 = G2((A) => A != null, "nonNullish"),
    xO8 = G2((A) => A, "pass"),
    yO8 = G2((A, Q, B, G, Z, Y) => {
      if (Q != null && Q[B] !== void 0) {
        let J = G();
        if (J.length <= 0) throw Error("Empty value provided for input HTTP label: " + B + ".");
        A = A.replace(Z, Y ? J.split("/").map((X) => T41(X)).join("/") : T41(J))
      } else throw Error("No value provided for input HTTP label: " + B + ".");
      return A
    }, "resolvedPath"),
    vO8 = G2((A) => {
      if (A !== A) return "NaN";
      switch (A) {
        case 1 / 0:
          return "Infinity";
        case -1 / 0:
          return "-Infinity";
        default:
          return A
      }
    }, "serializeFloat"),
    y90 = G2((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map(y90);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = y90(A[B])
        }
        return Q
      }
      return A
    }, "_json");

  function VyB(A, Q, B) {
    if (B <= 0 || !Number.isInteger(B)) throw Error("Invalid number of delimiters (" + B + ") for splitEvery.");
    let G = A.split(Q);
    if (B === 1) return G;
    let Z = [],
      Y = "";
    for (let J = 0; J < G.length; J++) {
      if (Y === "") Y = G[J];
      else Y += Q + G[J];
      if ((J + 1) % B === 0) Z.push(Y), Y = ""
    }
    if (Y !== "") Z.push(Y);
    return Z
  }
  G2(VyB, "splitEvery")
})
// @from(Ln 200871, Col 4)
dY
// @from(Ln 200871, Col 8)
Bo
// @from(Ln 200871, Col 12)
kO8 = async (A, Q) => {
  let B = dY.map({}),
    G = A.body,
    Z = dY.take(G, {
      message: dY.expectString
    });
  Object.assign(B, Z);
  let Y = new Bo.InternalServerException({
    $metadata: S41(A),
    ...B
  });
  return dY.decorateServiceException(Y, A.body)
}
// @from(Ln 200883, Col 3)
bO8 = async (A, Q) => {
  let B = dY.map({}),
    G = A.body,
    Z = dY.take(G, {
      message: dY.expectString,
      originalMessage: dY.expectString,
      originalStatusCode: dY.expectInt32
    });
  Object.assign(B, Z);
  let Y = new Bo.ModelStreamErrorException({
    $metadata: S41(A),
    ...B
  });
  return dY.decorateServiceException(Y, A.body)
}
// @from(Ln 200897, Col 3)
fO8 = async (A, Q) => {
  let B = dY.map({}),
    G = A.body,
    Z = dY.take(G, {
      message: dY.expectString
    });
  Object.assign(B, Z);
  let Y = new Bo.ThrottlingException({
    $metadata: S41(A),
    ...B
  });
  return dY.decorateServiceException(Y, A.body)
}
// @from(Ln 200909, Col 3)
hO8 = async (A, Q) => {
  let B = dY.map({}),
    G = A.body,
    Z = dY.take(G, {
      message: dY.expectString
    });
  Object.assign(B, Z);
  let Y = new Bo.ValidationException({
    $metadata: S41(A),
    ...B
  });
  return dY.decorateServiceException(Y, A.body)
}
// @from(Ln 200921, Col 3)
EyB = (A, Q) => {
  return Q.eventStreamMarshaller.deserialize(A, async (B) => {
    if (B.chunk != null) return {
      chunk: await mO8(B.chunk, Q)
    };
    if (B.internalServerException != null) return {
      internalServerException: await gO8(B.internalServerException, Q)
    };
    if (B.modelStreamErrorException != null) return {
      modelStreamErrorException: await uO8(B.modelStreamErrorException, Q)
    };
    if (B.validationException != null) return {
      validationException: await cO8(B.validationException, Q)
    };
    if (B.throttlingException != null) return {
      throttlingException: await dO8(B.throttlingException, Q)
    };
    return {
      $unknown: A
    }
  })
}
// @from(Ln 200942, Col 3)
gO8 = async (A, Q) => {
  let B = {
    ...A,
    body: await njA(A.body, Q)
  };
  return kO8(B, Q)
}
// @from(Ln 200948, Col 3)
uO8 = async (A, Q) => {
  let B = {
    ...A,
    body: await njA(A.body, Q)
  };
  return bO8(B, Q)
}
// @from(Ln 200954, Col 3)
mO8 = async (A, Q) => {
  let B = {},
    G = await njA(A.body, Q);
  return Object.assign(B, pO8(G, Q)), B
}
// @from(Ln 200958, Col 3)
dO8 = async (A, Q) => {
  let B = {
    ...A,
    body: await njA(A.body, Q)
  };
  return fO8(B, Q)
}
// @from(Ln 200964, Col 3)
cO8 = async (A, Q) => {
  let B = {
    ...A,
    body: await njA(A.body, Q)
  };
  return hO8(B, Q)
}
// @from(Ln 200970, Col 3)
pO8 = (A, Q) => {
  return dY.take(A, {
    bytes: Q.base64Decoder
  })
}
// @from(Ln 200974, Col 3)
S41 = (A) => ({
  httpStatusCode: A.statusCode,
  requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"] ?? "",
  extendedRequestId: A.headers["x-amz-id-2"] ?? "",
  cfId: A.headers["x-amz-cf-id"] ?? ""
})
// @from(Ln 200979, Col 4)
lO8 = (A, Q) => dY.collectBody(A, Q).then((B) => Q.utf8Encoder(B))
// @from(Ln 200979, Col 72)
njA = (A, Q) => lO8(A, Q).then((B) => {
  if (B.length) return JSON.parse(B);
  return {}
})
// @from(Ln 200983, Col 4)
zyB = w(() => {
  dY = c(HyB(), 1), Bo = c(XtA(), 1)
})
// @from(Ln 200987, Col 0)
function $yB(A) {
  if (A[Symbol.asyncIterator]) return A;
  let Q = A.getReader();
  return {
    async next() {
      try {
        let B = await Q.read();
        if (B?.done) Q.releaseLock();
        return B
      } catch (B) {
        throw Q.releaseLock(), B
      }
    },
    async return () {
      let B = Q.cancel();
      return Q.releaseLock(), await B, {
        done: !0,
        value: void 0
      }
    },
    [Symbol.asyncIterator]() {
      return this
    }
  }
}
// @from(Ln 201012, Col 4)
g90 = w(() => {
  $C()
})
// @from(Ln 201016, Col 0)
function x41(A) {
  return A != null && typeof A === "object" && !Array.isArray(A)
}
// @from(Ln 201019, Col 4)
u90 = (A) => (u90 = Array.isArray, u90(A))
// @from(Ln 201020, Col 2)
m90
// @from(Ln 201020, Col 7)
CyB = (A) => {
    try {
      return JSON.parse(A)
    } catch (Q) {
      return
    }
  }
// @from(Ln 201027, Col 4)
ajA = w(() => {
  g90();
  m90 = u90
})
// @from(Ln 201032, Col 0)
function ojA() {}
// @from(Ln 201034, Col 0)
function y41(A, Q, B) {
  if (!Q || UyB[A] > UyB[B]) return ojA;
  else return Q[A].bind(Q)
}
// @from(Ln 201039, Col 0)
function NyB(A) {
  let Q = A.logger,
    B = A.logLevel ?? "off";
  if (!Q) return iO8;
  let G = qyB.get(Q);
  if (G && G[0] === B) return G[1];
  let Z = {
    error: y41("error", Q, B),
    warn: y41("warn", Q, B),
    info: y41("info", Q, B),
    debug: y41("debug", Q, B)
  };
  return qyB.set(Q, [B, Z]), Z
}
// @from(Ln 201053, Col 4)
UyB
// @from(Ln 201053, Col 9)
iO8
// @from(Ln 201053, Col 14)
qyB
// @from(Ln 201054, Col 4)
wyB = w(() => {
  ajA();
  UyB = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
  };
  iO8 = {
    error: ojA,
    warn: ojA,
    info: ojA,
    debug: ojA
  }, qyB = new WeakMap
})
// @from(Ln 201071, Col 0)
function aO8(A) {
  return typeof A === "object" && A !== null && (("name" in A) && A.name === "AbortError" || ("message" in A) && String(A.message).includes("FetchRequestCanceledException"))
}
// @from(Ln 201074, Col 4)
OyB
// @from(Ln 201074, Col 9)
v41
// @from(Ln 201074, Col 14)
MyB
// @from(Ln 201074, Col 19)
d90 = (A) => new TextDecoder("utf-8").decode(A)
// @from(Ln 201075, Col 2)
LyB = (A) => new TextEncoder().encode(A)
// @from(Ln 201076, Col 2)
nO8 = () => {
    let A = new OyB.EventStreamMarshaller({
      utf8Encoder: d90,
      utf8Decoder: LyB
    });
    return {
      base64Decoder: v41.fromBase64,
      base64Encoder: v41.toBase64,
      utf8Decoder: LyB,
      utf8Encoder: d90,
      eventStreamMarshaller: A,
      streamCollector: MyB.streamCollector
    }
  }
// @from(Ln 201090, Col 2)
k41
// @from(Ln 201091, Col 4)
RyB = w(() => {
  JB1();
  wBA();
  vk();
  zyB();
  ajA();
  wyB();
  OyB = c(fSB(), 1), v41 = c(E90(), 1), MyB = c(p20(), 1);
  k41 = class k41 extends CC {
    static fromSSEResponse(A, Q, B) {
      let G = !1,
        Z = B ? NyB(B) : console;
      async function* Y() {
        if (!A.body) throw Q.abort(), new M2("Attempted to iterate over a response with no body");
        let X = $yB(A.body),
          I = EyB(X, nO8());
        for await (let D of I) if (D.chunk && D.chunk.bytes) yield {
          event: "chunk",
          data: d90(D.chunk.bytes),
          raw: []
        };
        else if (D.internalServerException) yield {
          event: "error",
          data: "InternalServerException",
          raw: []
        };
        else if (D.modelStreamErrorException) yield {
          event: "error",
          data: "ModelStreamErrorException",
          raw: []
        };
        else if (D.validationException) yield {
          event: "error",
          data: "ValidationException",
          raw: []
        };
        else if (D.throttlingException) yield {
          event: "error",
          data: "ThrottlingException",
          raw: []
        }
      }
      async function* J() {
        if (G) throw Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        G = !0;
        let X = !1;
        try {
          for await (let I of Y()) {
            if (I.event === "chunk") try {
              yield JSON.parse(I.data)
            } catch (D) {
              throw Z.error("Could not parse message into JSON:", I.data), Z.error("From chunk:", I.raw), D
            }
            if (I.event === "error") {
              let D = I.data,
                W = CyB(D),
                K = W ? void 0 : D;
              throw D9.generate(void 0, W, K, A.headers)
            }
          }
          X = !0
        } catch (I) {
          if (aO8(I)) return;
          throw I
        } finally {
          if (!X) Q.abort()
        }
      }
      return new k41(J, Q)
    }
  }
})
// @from(Ln 201163, Col 4)
c90 = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Ln 201169, Col 0)
function* oO8(A) {
  if (!A) return;
  if (_yB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let Y of Z) yield [Y, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (m90(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let Y = m90(G[1]) ? G[1] : [G[1]],
      J = !1;
    for (let X of Y) {
      if (X === void 0) continue;
      if (Q && !J) J = !0, yield [Z, null];
      yield [Z, X]
    }
  }
}
// @from(Ln 201197, Col 4)
_yB
// @from(Ln 201197, Col 9)
p90 = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [Y, J] of oO8(G)) {
      let X = Y.toLowerCase();
      if (!Z.has(X)) Q.delete(Y), Z.add(X);
      if (J === null) Q.delete(Y), B.add(X);
      else Q.append(Y, J), B.delete(X)
    }
  }
  return {
    [_yB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Ln 201215, Col 4)
jyB = w(() => {
  ajA();
  _yB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 201220, Col 0)
function PyB(A) {
  return A.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent)
}
// @from(Ln 201223, Col 4)
TyB
// @from(Ln 201223, Col 9)
rO8 = (A = PyB) => function (B, ...G) {
    if (B.length === 1) return B[0];
    let Z = !1,
      Y = [],
      J = B.reduce((W, K, V) => {
        if (/[?#]/.test(K)) Z = !0;
        let F = G[V],
          H = (Z ? encodeURIComponent : A)("" + F);
        if (V !== G.length && (F == null || typeof F === "object" && F.toString === Object.getPrototypeOf(Object.getPrototypeOf(F.hasOwnProperty ?? TyB) ?? TyB)?.toString)) H = F + "", Y.push({
          start: W.length + K.length,
          length: H.length,
          error: `Value of type ${Object.prototype.toString.call(F).slice(8,-1)} is not a valid path parameter`
        });
        return W + K + (V === G.length ? "" : H)
      }, ""),
      X = J.split(/[?#]/, 1)[0],
      I = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi,
      D;
    while ((D = I.exec(X)) !== null) Y.push({
      start: D.index,
      length: D[0].length,
      error: `Value "${D[0]}" can't be safely passed as a path parameter`
    });
    if (Y.sort((W, K) => W.start - K.start), Y.length > 0) {
      let W = 0,
        K = Y.reduce((V, F) => {
          let H = " ".repeat(F.start - W),
            E = "^".repeat(F.length);
          return W = F.start + F.length, V + H + E
        }, "");
      throw new M2(`Path parameters result in path with invalid segments:
${Y.map((V)=>V.error).join(`
`)}
${J}
${K}`)
    }
    return J
  }
// @from(Ln 201261, Col 2)
l90
// @from(Ln 201262, Col 4)
SyB = w(() => {
  g90();
  TyB = Object.freeze(Object.create(null)), l90 = rO8(PyB)
})
// @from(Ln 201267, Col 0)
function eO8(A) {
  let Q = new rL(A);
  return delete Q.batches, delete Q.countTokens, Q
}
// @from(Ln 201272, Col 0)
function AM8(A) {
  let Q = new Pz(A);
  return delete Q.promptCaching, delete Q.messages.batches, delete Q.messages.countTokens, Q
}
// @from(Ln 201276, Col 4)
sO8 = "bedrock-2023-05-31"
// @from(Ln 201277, Col 2)
tO8
// @from(Ln 201277, Col 7)
b41
// @from(Ln 201278, Col 4)
i90 = w(() => {
  $m();
  bjA();
  UPB();
  RyB();
  ajA();
  jyB();
  SyB();
  $m();
  tO8 = new Set(["/v1/complete", "/v1/messages", "/v1/messages?beta=true"]);
  b41 = class b41 extends IZ {
    constructor({
      awsRegion: A = c90("AWS_REGION") ?? "us-east-1",
      baseURL: Q = c90("ANTHROPIC_BEDROCK_BASE_URL") ?? `https://bedrock-runtime.${A}.amazonaws.com`,
      awsSecretKey: B = null,
      awsAccessKey: G = null,
      awsSessionToken: Z = null,
      providerChainResolver: Y = null,
      ...J
    } = {}) {
      super({
        baseURL: Q,
        ...J
      });
      this.skipAuth = !1, this.messages = eO8(this), this.completions = new oa(this), this.beta = AM8(this), this.awsSecretKey = B, this.awsAccessKey = G, this.awsRegion = A, this.awsSessionToken = Z, this.skipAuth = J.skipAuth ?? !1, this.providerChainResolver = Y
    }
    validateHeaders() {}
    async prepareRequest(A, {
      url: Q,
      options: B
    }) {
      if (this.skipAuth) return;
      let G = this.awsRegion;
      if (!G) throw Error("Expected `awsRegion` option to be passed to the client or the `AWS_REGION` environment variable to be present");
      let Z = await CPB(A, {
        url: Q,
        regionName: G,
        awsAccessKey: this.awsAccessKey,
        awsSecretKey: this.awsSecretKey,
        awsSessionToken: this.awsSessionToken,
        fetchOptions: this.fetchOptions,
        providerChainResolver: this.providerChainResolver
      });
      A.headers = p90([Z, A.headers]).values
    }
    async buildRequest(A) {
      if (A.__streamClass = k41, x41(A.body)) A.body = {
        ...A.body
      };
      if (x41(A.body)) {
        if (!A.body.anthropic_version) A.body.anthropic_version = sO8;
        if (A.headers && !A.body.anthropic_beta) {
          let Q = p90([A.headers]).values.get("anthropic-beta");
          if (Q != null) A.body.anthropic_beta = Q.split(",")
        }
      }
      if (tO8.has(A.path) && A.method === "post") {
        if (!x41(A.body)) throw Error("Expected request body to be an object for post /v1/messages");
        let Q = A.body.model;
        A.body.model = void 0;
        let B = A.body.stream;
        if (A.body.stream = void 0, B) A.path = l90`/model/${Q}/invoke-with-response-stream`;
        else A.path = l90`/model/${Q}/invoke`
      }
      return super.buildRequest(A)
    }
  }
})
// @from(Ln 201346, Col 4)
xyB = w(() => {
  i90();
  i90()
})
// @from(Ln 201350, Col 4)
f41 = w(() => {
  $C()
})
// @from(Ln 201353, Col 4)
n90 = (A) => (n90 = Array.isArray, n90(A))
// @from(Ln 201354, Col 2)
a90
// @from(Ln 201355, Col 4)
h41 = w(() => {
  f41();
  a90 = n90
})
// @from(Ln 201360, Col 0)
function* BM8(A) {
  if (!A) return;
  if (yyB in A) {
    let {
      values: G,
      nulls: Z
    } = A;
    yield* G.entries();
    for (let Y of Z) yield [Y, null];
    return
  }
  let Q = !1,
    B;
  if (A instanceof Headers) B = A.entries();
  else if (a90(A)) B = A;
  else Q = !0, B = Object.entries(A ?? {});
  for (let G of B) {
    let Z = G[0];
    if (typeof Z !== "string") throw TypeError("expected header name to be a string");
    let Y = a90(G[1]) ? G[1] : [G[1]],
      J = !1;
    for (let X of Y) {
      if (X === void 0) continue;
      if (Q && !J) J = !0, yield [Z, null];
      yield [Z, X]
    }
  }
}
// @from(Ln 201388, Col 4)
yyB
// @from(Ln 201388, Col 9)
o90 = (A) => {
  let Q = new Headers,
    B = new Set;
  for (let G of A) {
    let Z = new Set;
    for (let [Y, J] of BM8(G)) {
      let X = Y.toLowerCase();
      if (!Z.has(X)) Q.delete(Y), Z.add(X);
      if (J === null) Q.delete(Y), B.add(X);
      else Q.append(Y, J), B.delete(X)
    }
  }
  return {
    [yyB]: !0,
    values: Q,
    nulls: B
  }
}
// @from(Ln 201406, Col 4)
vyB = w(() => {
  h41();
  yyB = Symbol.for("brand.privateNullableHeaders")
})
// @from(Ln 201410, Col 4)
kyB = w(() => {
  f41()
})
// @from(Ln 201413, Col 4)
g41 = (A) => {
  if (typeof globalThis.process < "u") return globalThis.process.env?.[A]?.trim() ?? void 0;
  if (typeof globalThis.Deno < "u") return globalThis.Deno.env?.get?.(A)?.trim();
  return
}
// @from(Ln 201418, Col 4)
byB = w(() => {
  h41()
})
// @from(Ln 201421, Col 4)
fyB = w(() => {
  h41();
  kyB();
  byB()
})
// @from(Ln 201427, Col 0)
function GM8(A) {
  let Q = new rL(A);
  return delete Q.batches, Q
}
// @from(Ln 201432, Col 0)
function ZM8(A) {
  let Q = new Pz(A);
  return delete Q.messages.batches, Q
}
// @from(Ln 201436, Col 4)
u41
// @from(Ln 201437, Col 4)
r90 = w(() => {
  vyB();
  f41();
  fyB();
  $m();
  $m();
  bjA();
  u41 = class u41 extends hP {
    constructor({
      baseURL: A = g41("ANTHROPIC_FOUNDRY_BASE_URL"),
      apiKey: Q = g41("ANTHROPIC_FOUNDRY_API_KEY"),
      resource: B = g41("ANTHROPIC_FOUNDRY_RESOURCE"),
      azureADTokenProvider: G,
      dangerouslyAllowBrowser: Z,
      ...Y
    } = {}) {
      if (typeof G === "function") Z = !0;
      if (!G && !Q) throw new M2("Missing credentials. Please pass one of `apiKey` and `azureTokenProvider`, or set the `ANTHROPIC_FOUNDRY_API_KEY` environment variable.");
      if (G && Q) throw new M2("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
      if (!A) {
        if (!B) throw new M2("Must provide one of the `baseURL` or `resource` arguments, or the `ANTHROPIC_FOUNDRY_RESOURCE` environment variable");
        A = `https://${B}.services.ai.azure.com/anthropic/`
      } else if (B) throw new M2("baseURL and resource are mutually exclusive");
      super({
        apiKey: G ?? Q,
        baseURL: A,
        ...Y,
        ...Z !== void 0 ? {
          dangerouslyAllowBrowser: Z
        } : {}
      });
      this.resource = null, this.messages = GM8(this), this.beta = ZM8(this), this.models = void 0
    }
    async authHeaders() {
      if (typeof this._options.apiKey === "function") {
        let A;
        try {
          A = await this._options.apiKey()
        } catch (Q) {
          if (Q instanceof M2) throw Q;
          throw new M2(`Failed to get token from azureADTokenProvider: ${Q.message}`, {
            cause: Q
          })
        }
        if (typeof A !== "string" || !A) throw new M2(`Expected azureADTokenProvider function argument to return a string but it returned ${A}`);
        return o90([{
          Authorization: `Bearer ${A}`
        }])
      }
      if (typeof this._options.apiKey === "string") return o90([{
        "x-api-key": this.apiKey
      }]);
      return
    }
    validateHeaders() {
      return
    }
  }
})
// @from(Ln 201496, Col 4)
hyB = w(() => {
  r90();
  r90()
})
// @from(Ln 201500, Col 4)
s90 = U((UcG, iyB) => {
  var m41 = Object.prototype.hasOwnProperty,
    lyB = Object.prototype.toString,
    gyB = Object.defineProperty,
    uyB = Object.getOwnPropertyDescriptor,
    myB = function (Q) {
      if (typeof Array.isArray === "function") return Array.isArray(Q);
      return lyB.call(Q) === "[object Array]"
    },
    dyB = function (Q) {
      if (!Q || lyB.call(Q) !== "[object Object]") return !1;
      var B = m41.call(Q, "constructor"),
        G = Q.constructor && Q.constructor.prototype && m41.call(Q.constructor.prototype, "isPrototypeOf");
      if (Q.constructor && !B && !G) return !1;
      var Z;
      for (Z in Q);
      return typeof Z > "u" || m41.call(Q, Z)
    },
    cyB = function (Q, B) {
      if (gyB && B.name === "__proto__") gyB(Q, B.name, {
        enumerable: !0,
        configurable: !0,
        value: B.newValue,
        writable: !0
      });
      else Q[B.name] = B.newValue
    },
    pyB = function (Q, B) {
      if (B === "__proto__") {
        if (!m41.call(Q, B)) return;
        else if (uyB) return uyB(Q, B).value
      }
      return Q[B]
    };
  iyB.exports = function A() {
    var Q, B, G, Z, Y, J, X = arguments[0],
      I = 1,
      D = arguments.length,
      W = !1;
    if (typeof X === "boolean") W = X, X = arguments[1] || {}, I = 2;
    if (X == null || typeof X !== "object" && typeof X !== "function") X = {};
    for (; I < D; ++I)
      if (Q = arguments[I], Q != null) {
        for (B in Q)
          if (G = pyB(X, B), Z = pyB(Q, B), X !== Z) {
            if (W && Z && (dyB(Z) || (Y = myB(Z)))) {
              if (Y) Y = !1, J = G && myB(G) ? G : [];
              else J = G && dyB(G) ? G : {};
              cyB(X, {
                name: B,
                newValue: A(W, J, Z)
              })
            } else if (typeof Z < "u") cyB(X, {
              name: B,
              newValue: Z
            })
          }
      } return X
  }
})
// @from(Ln 201560, Col 4)
c41 = U((ryB) => {
  function TZ(A, Q, B) {
    if (B.globals) A = B.globals[A.name];
    return new A(`${B.context?B.context:"Value"} ${Q}.`)
  }

  function kDA(A, Q) {
    if (typeof A === "bigint") throw TZ(TypeError, "is a BigInt which cannot be converted to a number", Q);
    if (!Q.globals) return Number(A);
    return Q.globals.Number(A)
  }

  function ayB(A) {
    if (A > 0 && A % 1 === 0.5 && (A & 1) === 0 || A < 0 && A % 1 === -0.5 && (A & 1) === 1) return rjA(Math.floor(A));
    return rjA(Math.round(A))
  }

  function d41(A) {
    return rjA(Math.trunc(A))
  }

  function nyB(A) {
    return A < 0 ? -1 : 1
  }

  function YM8(A, Q) {
    let B = A % Q;
    if (nyB(Q) !== nyB(B)) return B + Q;
    return B
  }

  function rjA(A) {
    return A === 0 ? 0 : A
  }

  function bDA(A, {
    unsigned: Q
  }) {
    let B, G;
    if (Q) B = 0, G = 2 ** A - 1;
    else B = -(2 ** (A - 1)), G = 2 ** (A - 1) - 1;
    let Z = 2 ** A,
      Y = 2 ** (A - 1);
    return (J, X = {}) => {
      let I = kDA(J, X);
      if (I = rjA(I), X.enforceRange) {
        if (!Number.isFinite(I)) throw TZ(TypeError, "is not a finite number", X);
        if (I = d41(I), I < B || I > G) throw TZ(TypeError, `is outside the accepted range of ${B} to ${G}, inclusive`, X);
        return I
      }
      if (!Number.isNaN(I) && X.clamp) return I = Math.min(Math.max(I, B), G), I = ayB(I), I;
      if (!Number.isFinite(I) || I === 0) return 0;
      if (I = d41(I), I >= B && I <= G) return I;
      if (I = YM8(I, Z), !Q && I >= Y) return I - Z;
      return I
    }
  }

  function oyB(A, {
    unsigned: Q
  }) {
    let B = Number.MAX_SAFE_INTEGER,
      G = Q ? 0 : Number.MIN_SAFE_INTEGER,
      Z = Q ? BigInt.asUintN : BigInt.asIntN;
    return (Y, J = {}) => {
      let X = kDA(Y, J);
      if (X = rjA(X), J.enforceRange) {
        if (!Number.isFinite(X)) throw TZ(TypeError, "is not a finite number", J);
        if (X = d41(X), X < G || X > B) throw TZ(TypeError, `is outside the accepted range of ${G} to ${B}, inclusive`, J);
        return X
      }
      if (!Number.isNaN(X) && J.clamp) return X = Math.min(Math.max(X, G), B), X = ayB(X), X;
      if (!Number.isFinite(X) || X === 0) return 0;
      let I = BigInt(d41(X));
      return I = Z(A, I), Number(I)
    }
  }
  ryB.any = (A) => {
    return A
  };
  ryB.undefined = () => {
    return
  };
  ryB.boolean = (A) => {
    return Boolean(A)
  };
  ryB.byte = bDA(8, {
    unsigned: !1
  });
  ryB.octet = bDA(8, {
    unsigned: !0
  });
  ryB.short = bDA(16, {
    unsigned: !1
  });
  ryB["unsigned short"] = bDA(16, {
    unsigned: !0
  });
  ryB.long = bDA(32, {
    unsigned: !1
  });
  ryB["unsigned long"] = bDA(32, {
    unsigned: !0
  });
  ryB["long long"] = oyB(64, {
    unsigned: !1
  });
  ryB["unsigned long long"] = oyB(64, {
    unsigned: !0
  });
  ryB.double = (A, Q = {}) => {
    let B = kDA(A, Q);
    if (!Number.isFinite(B)) throw TZ(TypeError, "is not a finite floating-point value", Q);
    return B
  };
  ryB["unrestricted double"] = (A, Q = {}) => {
    return kDA(A, Q)
  };
  ryB.float = (A, Q = {}) => {
    let B = kDA(A, Q);
    if (!Number.isFinite(B)) throw TZ(TypeError, "is not a finite floating-point value", Q);
    if (Object.is(B, -0)) return B;
    let G = Math.fround(B);
    if (!Number.isFinite(G)) throw TZ(TypeError, "is outside the range of a single-precision floating-point value", Q);
    return G
  };
  ryB["unrestricted float"] = (A, Q = {}) => {
    let B = kDA(A, Q);
    if (isNaN(B)) return B;
    if (Object.is(B, -0)) return B;
    return Math.fround(B)
  };
  ryB.DOMString = (A, Q = {}) => {
    if (Q.treatNullAsEmptyString && A === null) return "";
    if (typeof A === "symbol") throw TZ(TypeError, "is a symbol, which cannot be converted to a string", Q);
    return (Q.globals ? Q.globals.String : String)(A)
  };
  ryB.ByteString = (A, Q = {}) => {
    let B = ryB.DOMString(A, Q),
      G;
    for (let Z = 0;
      (G = B.codePointAt(Z)) !== void 0; ++Z)
      if (G > 255) throw TZ(TypeError, "is not a valid ByteString", Q);
    return B
  };
  ryB.USVString = (A, Q = {}) => {
    let B = ryB.DOMString(A, Q),
      G = B.length,
      Z = [];
    for (let Y = 0; Y < G; ++Y) {
      let J = B.charCodeAt(Y);
      if (J < 55296 || J > 57343) Z.push(String.fromCodePoint(J));
      else if (56320 <= J && J <= 57343) Z.push(String.fromCodePoint(65533));
      else if (Y === G - 1) Z.push(String.fromCodePoint(65533));
      else {
        let X = B.charCodeAt(Y + 1);
        if (56320 <= X && X <= 57343) {
          let I = J & 1023,
            D = X & 1023;
          Z.push(String.fromCodePoint(65536 + 1024 * I + D)), ++Y
        } else Z.push(String.fromCodePoint(65533))
      }
    }
    return Z.join("")
  };
  ryB.object = (A, Q = {}) => {
    if (A === null || typeof A !== "object" && typeof A !== "function") throw TZ(TypeError, "is not an object", Q);
    return A
  };
  var JM8 = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get,
    XM8 = typeof SharedArrayBuffer === "function" ? Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get : null;

  function t90(A) {
    try {
      return JM8.call(A), !0
    } catch {
      return !1
    }
  }

  function yDA(A) {
    try {
      return XM8.call(A), !0
    } catch {
      return !1
    }
  }

  function vDA(A) {
    try {
      return new Uint8Array(A), !1
    } catch {
      return !0
    }
  }
  ryB.ArrayBuffer = (A, Q = {}) => {
    if (!t90(A)) {
      if (Q.allowShared && !yDA(A)) throw TZ(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", Q);
      throw TZ(TypeError, "is not an ArrayBuffer", Q)
    }
    if (vDA(A)) throw TZ(TypeError, "is a detached ArrayBuffer", Q);
    return A
  };
  var IM8 = Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
  ryB.DataView = (A, Q = {}) => {
    try {
      IM8.call(A)
    } catch (B) {
      throw TZ(TypeError, "is not a DataView", Q)
    }
    if (!Q.allowShared && yDA(A.buffer)) throw TZ(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", Q);
    if (vDA(A.buffer)) throw TZ(TypeError, "is backed by a detached ArrayBuffer", Q);
    return A
  };
  var DM8 = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array).prototype, Symbol.toStringTag).get;
  [Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Float32Array, Float64Array].forEach((A) => {
    let {
      name: Q
    } = A, B = /^[AEIOU]/u.test(Q) ? "an" : "a";
    ryB[Q] = (G, Z = {}) => {
      if (!ArrayBuffer.isView(G) || DM8.call(G) !== Q) throw TZ(TypeError, `is not ${B} ${Q} object`, Z);
      if (!Z.allowShared && yDA(G.buffer)) throw TZ(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", Z);
      if (vDA(G.buffer)) throw TZ(TypeError, "is a view on a detached ArrayBuffer", Z);
      return G
    }
  });
  ryB.ArrayBufferView = (A, Q = {}) => {
    if (!ArrayBuffer.isView(A)) throw TZ(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", Q);
    if (!Q.allowShared && yDA(A.buffer)) throw TZ(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", Q);
    if (vDA(A.buffer)) throw TZ(TypeError, "is a view on a detached ArrayBuffer", Q);
    return A
  };
  ryB.BufferSource = (A, Q = {}) => {
    if (ArrayBuffer.isView(A)) {
      if (!Q.allowShared && yDA(A.buffer)) throw TZ(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", Q);
      if (vDA(A.buffer)) throw TZ(TypeError, "is a view on a detached ArrayBuffer", Q);
      return A
    }
    if (!Q.allowShared && !t90(A)) throw TZ(TypeError, "is not an ArrayBuffer or a view on one", Q);
    if (Q.allowShared && !yDA(A) && !t90(A)) throw TZ(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", Q);
    if (vDA(A)) throw TZ(TypeError, "is a detached ArrayBuffer", Q);
    return A
  };
  ryB.DOMTimeStamp = ryB["unsigned long long"]
})
// @from(Ln 201805, Col 4)
l41 = U((ZvB, YvB) => {
  function xM8(A) {
    return typeof A === "object" && A !== null || typeof A === "function"
  }
  var tyB = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

  function yM8(A, Q) {
    for (let B of Reflect.ownKeys(Q)) {
      let G = Reflect.getOwnPropertyDescriptor(Q, B);
      if (G && !Reflect.defineProperty(A, B, G)) throw TypeError(`Cannot redefine property: ${String(B)}`)
    }
  }

  function vM8(A, Q) {
    let B = QvB(A);
    return Object.defineProperties(Object.create(B["%Object.prototype%"]), Object.getOwnPropertyDescriptors(Q))
  }
  var eyB = Symbol("wrapper"),
    AvB = Symbol("impl"),
    fDA = Symbol("SameObject caches"),
    p41 = Symbol.for("[webidl2js] constructor registry"),
    kM8 = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);

  function QvB(A) {
    if (tyB(A, p41)) return A[p41];
    let Q = Object.create(null);
    Q["%Object.prototype%"] = A.Object.prototype, Q["%IteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(new A.Array()[Symbol.iterator]()));
    try {
      Q["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(Object.getPrototypeOf(A.eval("(async function* () {})").prototype))
    } catch {
      Q["%AsyncIteratorPrototype%"] = kM8
    }
    return A[p41] = Q, Q
  }

  function bM8(A, Q, B) {
    if (!A[fDA]) A[fDA] = Object.create(null);
    if (Q in A[fDA]) return A[fDA][Q];
    return A[fDA][Q] = B(), A[fDA][Q]
  }

  function BvB(A) {
    return A ? A[eyB] : null
  }

  function GvB(A) {
    return A ? A[AvB] : null
  }

  function fM8(A) {
    let Q = BvB(A);
    return Q ? Q : A
  }

  function hM8(A) {
    let Q = GvB(A);
    return Q ? Q : A
  }
  var gM8 = Symbol("internal");

  function uM8(A) {
    if (typeof A !== "string") return !1;
    let Q = A >>> 0;
    if (Q === 4294967295) return !1;
    let B = `${Q}`;
    if (A !== B) return !1;
    return !0
  }
  var mM8 = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;

  function dM8(A) {
    try {
      return mM8.call(A), !0
    } catch (Q) {
      return !1
    }
  }

  function cM8([A, Q], B) {
    let G;
    switch (B) {
      case "key":
        G = A;
        break;
      case "value":
        G = Q;
        break;
      case "key+value":
        G = [A, Q];
        break
    }
    return {
      value: G,
      done: !1
    }
  }
  var pM8 = Symbol("supports property index"),
    lM8 = Symbol("supported property indices"),
    iM8 = Symbol("supports property name"),
    nM8 = Symbol("supported property names"),
    aM8 = Symbol("indexed property get"),
    oM8 = Symbol("indexed property set new"),
    rM8 = Symbol("indexed property set existing"),
    sM8 = Symbol("named property get"),
    tM8 = Symbol("named property set new"),
    eM8 = Symbol("named property set existing"),
    AR8 = Symbol("named property delete"),
    QR8 = Symbol("async iterator get the next iteration result"),
    BR8 = Symbol("async iterator return steps"),
    GR8 = Symbol("async iterator initialization steps"),
    ZR8 = Symbol("async iterator end of iteration");
  YvB.exports = ZvB = {
    isObject: xM8,
    hasOwn: tyB,
    define: yM8,
    newObjectInRealm: vM8,
    wrapperSymbol: eyB,
    implSymbol: AvB,
    getSameObject: bM8,
    ctorRegistrySymbol: p41,
    initCtorRegistry: QvB,
    wrapperForImpl: BvB,
    implForWrapper: GvB,
    tryWrapperForImpl: fM8,
    tryImplForWrapper: hM8,
    iterInternalSymbol: gM8,
    isArrayBuffer: dM8,
    isArrayIndexPropName: uM8,
    supportsPropertyIndex: pM8,
    supportedPropertyIndices: lM8,
    supportsPropertyName: iM8,
    supportedPropertyNames: nM8,
    indexedGet: aM8,
    indexedSetNew: oM8,
    indexedSetExisting: rM8,
    namedGet: sM8,
    namedSetNew: tM8,
    namedSetExisting: eM8,
    namedDelete: AR8,
    asyncIteratorNext: QR8,
    asyncIteratorReturn: BR8,
    asyncIteratorInit: GR8,
    asyncIteratorEOI: ZR8,
    iteratorResult: cM8
  }
})
// @from(Ln 201951, Col 4)
FvB = U((NcG, VvB) => {
  var YR8 = /^xn--/,
    JR8 = /[^\0-\x7F]/,
    XR8 = /[\x2E\u3002\uFF0E\uFF61]/g,
    IR8 = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    },
    fk = Math.floor,
    A40 = String.fromCharCode;

  function Go(A) {
    throw RangeError(IR8[A])
  }

  function DR8(A, Q) {
    let B = [],
      G = A.length;
    while (G--) B[G] = Q(A[G]);
    return B
  }

  function XvB(A, Q) {
    let B = A.split("@"),
      G = "";
    if (B.length > 1) G = B[0] + "@", A = B[1];
    A = A.replace(XR8, ".");
    let Z = A.split("."),
      Y = DR8(Z, Q).join(".");
    return G + Y
  }

  function IvB(A) {
    let Q = [],
      B = 0,
      G = A.length;
    while (B < G) {
      let Z = A.charCodeAt(B++);
      if (Z >= 55296 && Z <= 56319 && B < G) {
        let Y = A.charCodeAt(B++);
        if ((Y & 64512) == 56320) Q.push(((Z & 1023) << 10) + (Y & 1023) + 65536);
        else Q.push(Z), B--
      } else Q.push(Z)
    }
    return Q
  }
  var WR8 = (A) => String.fromCodePoint(...A),
    KR8 = function (A) {
      if (A >= 48 && A < 58) return 26 + (A - 48);
      if (A >= 65 && A < 91) return A - 65;
      if (A >= 97 && A < 123) return A - 97;
      return 36
    },
    JvB = function (A, Q) {
      return A + 22 + 75 * (A < 26) - ((Q != 0) << 5)
    },
    DvB = function (A, Q, B) {
      let G = 0;
      A = B ? fk(A / 700) : A >> 1, A += fk(A / Q);
      for (; A > 455; G += 36) A = fk(A / 35);
      return fk(G + 36 * A / (A + 38))
    },
    WvB = function (A) {
      let Q = [],
        B = A.length,
        G = 0,
        Z = 128,
        Y = 72,
        J = A.lastIndexOf("-");
      if (J < 0) J = 0;
      for (let X = 0; X < J; ++X) {
        if (A.charCodeAt(X) >= 128) Go("not-basic");
        Q.push(A.charCodeAt(X))
      }
      for (let X = J > 0 ? J + 1 : 0; X < B;) {
        let I = G;
        for (let W = 1, K = 36;; K += 36) {
          if (X >= B) Go("invalid-input");
          let V = KR8(A.charCodeAt(X++));
          if (V >= 36) Go("invalid-input");
          if (V > fk((2147483647 - G) / W)) Go("overflow");
          G += V * W;
          let F = K <= Y ? 1 : K >= Y + 26 ? 26 : K - Y;
          if (V < F) break;
          let H = 36 - F;
          if (W > fk(2147483647 / H)) Go("overflow");
          W *= H
        }
        let D = Q.length + 1;
        if (Y = DvB(G - I, D, I == 0), fk(G / D) > 2147483647 - Z) Go("overflow");
        Z += fk(G / D), G %= D, Q.splice(G++, 0, Z)
      }
      return String.fromCodePoint(...Q)
    },
    KvB = function (A) {
      let Q = [];
      A = IvB(A);
      let B = A.length,
        G = 128,
        Z = 0,
        Y = 72;
      for (let I of A)
        if (I < 128) Q.push(A40(I));
      let J = Q.length,
        X = J;
      if (J) Q.push("-");
      while (X < B) {
        let I = 2147483647;
        for (let W of A)
          if (W >= G && W < I) I = W;
        let D = X + 1;
        if (I - G > fk((2147483647 - Z) / D)) Go("overflow");
        Z += (I - G) * D, G = I;
        for (let W of A) {
          if (W < G && ++Z > 2147483647) Go("overflow");
          if (W === G) {
            let K = Z;
            for (let V = 36;; V += 36) {
              let F = V <= Y ? 1 : V >= Y + 26 ? 26 : V - Y;
              if (K < F) break;
              let H = K - F,
                E = 36 - F;
              Q.push(A40(JvB(F + H % E, 0))), K = fk(H / E)
            }
            Q.push(A40(JvB(K, 0))), Y = DvB(Z, D, X === J), Z = 0, ++X
          }
        }++Z, ++G
      }
      return Q.join("")
    },
    VR8 = function (A) {
      return XvB(A, function (Q) {
        return YR8.test(Q) ? WvB(Q.slice(4).toLowerCase()) : Q
      })
    },
    FR8 = function (A) {
      return XvB(A, function (Q) {
        return JR8.test(Q) ? "xn--" + KvB(Q) : Q
      })
    },
    HR8 = {
      version: "2.3.1",
      ucs2: {
        decode: IvB,
        encode: WR8
      },
      decode: WvB,
      encode: KvB,
      toASCII: FR8,
      toUnicode: VR8
    };
  VvB.exports = HR8
})