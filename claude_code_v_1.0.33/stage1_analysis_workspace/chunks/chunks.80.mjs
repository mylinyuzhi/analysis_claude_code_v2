
// @from(Start 7594709, End 7598431)
Xl1 = z((NM) => {
  var Lu6 = NM && NM.__importDefault || function(A) {
      return A && A.__esModule ? A : {
        default: A
      }
    },
    NuB;
  Object.defineProperty(NM, "__esModule", {
    value: !0
  });
  NM.GaxiosError = NM.GAXIOS_ERROR_SYMBOL = void 0;
  NM.defaultErrorRedactor = MuB;
  var Mu6 = UA("url"),
    Jl1 = quB(),
    LuB = Lu6(Sp1());
  NM.GAXIOS_ERROR_SYMBOL = Symbol.for(`${Jl1.pkg.name}-gaxios-error`);
  class Wl1 extends Error {
    static[(NuB = NM.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](A) {
      if (A && typeof A === "object" && NM.GAXIOS_ERROR_SYMBOL in A && A[NM.GAXIOS_ERROR_SYMBOL] === Jl1.pkg.version) return !0;
      return Function.prototype[Symbol.hasInstance].call(Wl1, A)
    }
    constructor(A, Q, B, G) {
      var Z;
      super(A);
      if (this.config = Q, this.response = B, this.error = G, this[NuB] = Jl1.pkg.version, this.config = (0, LuB.default)(!0, {}, Q), this.response) this.response.config = (0, LuB.default)(!0, {}, this.response.config);
      if (this.response) {
        try {
          this.response.data = Ou6(this.config.responseType, (Z = this.response) === null || Z === void 0 ? void 0 : Z.data)
        } catch (I) {}
        this.status = this.response.status
      }
      if (G && "code" in G && G.code) this.code = G.code;
      if (Q.errorRedactor) Q.errorRedactor({
        config: this.config,
        response: this.response
      })
    }
  }
  NM.GaxiosError = Wl1;

  function Ou6(A, Q) {
    switch (A) {
      case "stream":
        return Q;
      case "json":
        return JSON.parse(JSON.stringify(Q));
      case "arraybuffer":
        return JSON.parse(Buffer.from(Q).toString("utf8"));
      case "blob":
        return JSON.parse(Q.text());
      default:
        return Q
    }
  }

  function MuB(A) {
    function B(I) {
      if (!I) return;
      for (let Y of Object.keys(I)) {
        if (/^authentication$/i.test(Y)) I[Y] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if (/^authorization$/i.test(Y)) I[Y] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if (/secret/i.test(Y)) I[Y] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
      }
    }

    function G(I, Y) {
      if (typeof I === "object" && I !== null && typeof I[Y] === "string") {
        let J = I[Y];
        if (/grant_type=/i.test(J) || /assertion=/i.test(J) || /secret/i.test(J)) I[Y] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
      }
    }

    function Z(I) {
      if (typeof I === "object" && I !== null) {
        if ("grant_type" in I) I.grant_type = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if ("assertion" in I) I.assertion = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if ("client_secret" in I) I.client_secret = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
      }
    }
    if (A.config) {
      B(A.config.headers), G(A.config, "data"), Z(A.config.data), G(A.config, "body"), Z(A.config.body);
      try {
        let I = new Mu6.URL("", A.config.url);
        if (I.searchParams.has("token")) I.searchParams.set("token", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
        if (I.searchParams.has("client_secret")) I.searchParams.set("client_secret", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
        A.config.url = I.toString()
      } catch (I) {}
    }
    if (A.response) MuB({
      config: A.response.config
    }), B(A.response.headers), G(A.response, "data"), Z(A.response.data);
    return A
  }
})
// @from(Start 7598437, End 7601123)
TuB = z((RuB) => {
  Object.defineProperty(RuB, "__esModule", {
    value: !0
  });
  RuB.getRetryConfig = Ru6;
  async function Ru6(A) {
    let Q = OuB(A);
    if (!A || !A.config || !Q && !A.config.retry) return {
      shouldRetry: !1
    };
    Q = Q || {}, Q.currentRetryAttempt = Q.currentRetryAttempt || 0, Q.retry = Q.retry === void 0 || Q.retry === null ? 3 : Q.retry, Q.httpMethodsToRetry = Q.httpMethodsToRetry || ["GET", "HEAD", "PUT", "OPTIONS", "DELETE"], Q.noResponseRetries = Q.noResponseRetries === void 0 || Q.noResponseRetries === null ? 2 : Q.noResponseRetries, Q.retryDelayMultiplier = Q.retryDelayMultiplier ? Q.retryDelayMultiplier : 2, Q.timeOfFirstRequest = Q.timeOfFirstRequest ? Q.timeOfFirstRequest : Date.now(), Q.totalTimeout = Q.totalTimeout ? Q.totalTimeout : Number.MAX_SAFE_INTEGER, Q.maxRetryDelay = Q.maxRetryDelay ? Q.maxRetryDelay : Number.MAX_SAFE_INTEGER;
    let B = [
      [100, 199],
      [408, 408],
      [429, 429],
      [500, 599]
    ];
    if (Q.statusCodesToRetry = Q.statusCodesToRetry || B, A.config.retryConfig = Q, !await (Q.shouldRetry || Tu6)(A)) return {
      shouldRetry: !1,
      config: A.config
    };
    let Z = Pu6(Q);
    A.config.retryConfig.currentRetryAttempt += 1;
    let I = Q.retryBackoff ? Q.retryBackoff(A, Z) : new Promise((Y) => {
      setTimeout(Y, Z)
    });
    if (Q.onRetryAttempt) Q.onRetryAttempt(A);
    return await I, {
      shouldRetry: !0,
      config: A.config
    }
  }

  function Tu6(A) {
    var Q;
    let B = OuB(A);
    if (A.name === "AbortError" || ((Q = A.error) === null || Q === void 0 ? void 0 : Q.name) === "AbortError") return !1;
    if (!B || B.retry === 0) return !1;
    if (!A.response && (B.currentRetryAttempt || 0) >= B.noResponseRetries) return !1;
    if (!A.config.method || B.httpMethodsToRetry.indexOf(A.config.method.toUpperCase()) < 0) return !1;
    if (A.response && A.response.status) {
      let G = !1;
      for (let [Z, I] of B.statusCodesToRetry) {
        let Y = A.response.status;
        if (Y >= Z && Y <= I) {
          G = !0;
          break
        }
      }
      if (!G) return !1
    }
    if (B.currentRetryAttempt = B.currentRetryAttempt || 0, B.currentRetryAttempt >= B.retry) return !1;
    return !0
  }

  function OuB(A) {
    if (A && A.config && A.config.retryConfig) return A.config.retryConfig;
    return
  }

  function Pu6(A) {
    var Q;
    let G = (A.currentRetryAttempt ? 0 : (Q = A.retryDelay) !== null && Q !== void 0 ? Q : 100) + (Math.pow(A.retryDelayMultiplier, A.currentRetryAttempt) - 1) / 2 * 1000,
      Z = A.totalTimeout - (Date.now() - A.timeOfFirstRequest);
    return Math.min(G, Z, A.maxRetryDelay)
  }
})
// @from(Start 7601129, End 7601320)
Vl1 = z((juB) => {
  Object.defineProperty(juB, "__esModule", {
    value: !0
  });
  juB.GaxiosInterceptorManager = void 0;
  class PuB extends Set {}
  juB.GaxiosInterceptorManager = PuB
})
// @from(Start 7601326, End 7612152)
muB = z((iH) => {
  var Su6 = iH && iH.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    _u6 = iH && iH.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    ku6 = iH && iH.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) Su6(Q, A, B)
      }
      return _u6(Q, A), Q
    },
    Ee = iH && iH.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    yu6 = iH && iH.__classPrivateFieldSet || function(A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    WeA = iH && iH.__importDefault || function(A) {
      return A && A.__esModule ? A : {
        default: A
      }
    },
    dGA, Ce, _uB, fuB, huB, guB, YeA, kuB;
  Object.defineProperty(iH, "__esModule", {
    value: !0
  });
  iH.Gaxios = void 0;
  var xu6 = WeA(Sp1()),
    vu6 = UA("https"),
    bu6 = WeA(Yl1()),
    fu6 = WeA(UA("querystring")),
    hu6 = WeA(zuB()),
    yuB = UA("url"),
    JeA = Xl1(),
    gu6 = TuB(),
    xuB = UA("stream"),
    uu6 = YHA(),
    vuB = Vl1(),
    mu6 = cu6() ? window.fetch : bu6.default;

  function du6() {
    return typeof window < "u" && !!window
  }

  function cu6() {
    return du6() && !!window.fetch
  }

  function pu6() {
    return typeof Buffer < "u"
  }

  function buB(A, Q) {
    return !!uuB(A, Q)
  }

  function uuB(A, Q) {
    Q = Q.toLowerCase();
    for (let B of Object.keys((A === null || A === void 0 ? void 0 : A.headers) || {}))
      if (Q === B.toLowerCase()) return A.headers[B];
    return
  }
  class Fl1 {
    constructor(A) {
      dGA.add(this), this.agentCache = new Map, this.defaults = A || {}, this.interceptors = {
        request: new vuB.GaxiosInterceptorManager,
        response: new vuB.GaxiosInterceptorManager
      }
    }
    async request(A = {}) {
      return A = await Ee(this, dGA, "m", guB).call(this, A), A = await Ee(this, dGA, "m", fuB).call(this, A), Ee(this, dGA, "m", huB).call(this, this._request(A))
    }
    async _defaultAdapter(A) {
      let B = await (A.fetchImplementation || mu6)(A.url, A),
        G = await this.getResponseData(A, B);
      return this.translateResponse(A, B, G)
    }
    async _request(A = {}) {
      var Q;
      try {
        let B;
        if (A.adapter) B = await A.adapter(A, this._defaultAdapter.bind(this));
        else B = await this._defaultAdapter(A);
        if (!A.validateStatus(B.status)) {
          if (A.responseType === "stream") {
            let G = "";
            await new Promise((Z) => {
              (B === null || B === void 0 ? void 0 : B.data).on("data", (I) => {
                G += I
              }), (B === null || B === void 0 ? void 0 : B.data).on("end", Z)
            }), B.data = G
          }
          throw new JeA.GaxiosError(`Request failed with status code ${B.status}`, A, B)
        }
        return B
      } catch (B) {
        let G = B instanceof JeA.GaxiosError ? B : new JeA.GaxiosError(B.message, A, void 0, B),
          {
            shouldRetry: Z,
            config: I
          } = await (0, gu6.getRetryConfig)(G);
        if (Z && I) return G.config.retryConfig.currentRetryAttempt = I.retryConfig.currentRetryAttempt, A.retryConfig = (Q = G.config) === null || Q === void 0 ? void 0 : Q.retryConfig, this._request(A);
        throw G
      }
    }
    async getResponseData(A, Q) {
      switch (A.responseType) {
        case "stream":
          return Q.body;
        case "json": {
          let B = await Q.text();
          try {
            B = JSON.parse(B)
          } catch (G) {}
          return B
        }
        case "arraybuffer":
          return Q.arrayBuffer();
        case "blob":
          return Q.blob();
        case "text":
          return Q.text();
        default:
          return this.getResponseDataFromContentType(Q)
      }
    }
    validateStatus(A) {
      return A >= 200 && A < 300
    }
    paramsSerializer(A) {
      return fu6.default.stringify(A)
    }
    translateResponse(A, Q, B) {
      let G = {};
      return Q.headers.forEach((Z, I) => {
        G[I] = Z
      }), {
        config: A,
        data: B,
        headers: G,
        status: Q.status,
        statusText: Q.statusText,
        request: {
          responseURL: Q.url
        }
      }
    }
    async getResponseDataFromContentType(A) {
      let Q = A.headers.get("Content-Type");
      if (Q === null) return A.text();
      if (Q = Q.toLowerCase(), Q.includes("application/json")) {
        let B = await A.text();
        try {
          B = JSON.parse(B)
        } catch (G) {}
        return B
      } else if (Q.match(/^text\//)) return A.text();
      else return A.blob()
    }
    async * getMultipartRequest(A, Q) {
      let B = `--${Q}--`;
      for (let G of A) {
        let Z = G.headers["Content-Type"] || "application/octet-stream";
        if (yield `--${Q}\r
Content-Type: ${Z}\r
\r
`, typeof G.content === "string") yield G.content;
        else yield* G.content;
        yield `\r
`
      }
      yield B
    }
  }
  iH.Gaxios = Fl1;
  Ce = Fl1, dGA = new WeakSet, _uB = function(Q, B = []) {
    var G, Z;
    let I = new yuB.URL(Q),
      Y = [...B],
      J = ((Z = (G = process.env.NO_PROXY) !== null && G !== void 0 ? G : process.env.no_proxy) === null || Z === void 0 ? void 0 : Z.split(",")) || [];
    for (let W of J) Y.push(W.trim());
    for (let W of Y)
      if (W instanceof RegExp) {
        if (W.test(I.toString())) return !1
      } else if (W instanceof yuB.URL) {
      if (W.origin === I.origin) return !1
    } else if (W.startsWith("*.") || W.startsWith(".")) {
      let X = W.replace(/^\*\./, ".");
      if (I.hostname.endsWith(X)) return !1
    } else if (W === I.origin || W === I.hostname || W === I.href) return !1;
    return !0
  }, fuB = async function(Q) {
    let B = Promise.resolve(Q);
    for (let G of this.interceptors.request.values())
      if (G) B = B.then(G.resolved, G.rejected);
    return B
  }, huB = async function(Q) {
    let B = Promise.resolve(Q);
    for (let G of this.interceptors.response.values())
      if (G) B = B.then(G.resolved, G.rejected);
    return B
  }, guB = async function(Q) {
    var B, G, Z, I;
    let Y = (0, xu6.default)(!0, {}, this.defaults, Q);
    if (!Y.url) throw Error("URL is required.");
    let J = Y.baseUrl || Y.baseURL;
    if (J) Y.url = J.toString() + Y.url;
    if (Y.paramsSerializer = Y.paramsSerializer || this.paramsSerializer, Y.params && Object.keys(Y.params).length > 0) {
      let V = Y.paramsSerializer(Y.params);
      if (V.startsWith("?")) V = V.slice(1);
      let F = Y.url.toString().includes("?") ? "&" : "?";
      Y.url = Y.url + F + V
    }
    if (typeof Q.maxContentLength === "number") Y.size = Q.maxContentLength;
    if (typeof Q.maxRedirects === "number") Y.follow = Q.maxRedirects;
    if (Y.headers = Y.headers || {}, Y.multipart === void 0 && Y.data) {
      let V = typeof FormData > "u" ? !1 : (Y === null || Y === void 0 ? void 0 : Y.data) instanceof FormData;
      if (hu6.default.readable(Y.data)) Y.body = Y.data;
      else if (pu6() && Buffer.isBuffer(Y.data)) {
        if (Y.body = Y.data, !buB(Y, "Content-Type")) Y.headers["Content-Type"] = "application/json"
      } else if (typeof Y.data === "object") {
        if (!V)
          if (uuB(Y, "content-type") === "application/x-www-form-urlencoded") Y.body = Y.paramsSerializer(Y.data);
          else {
            if (!buB(Y, "Content-Type")) Y.headers["Content-Type"] = "application/json";
            Y.body = JSON.stringify(Y.data)
          }
      } else Y.body = Y.data
    } else if (Y.multipart && Y.multipart.length > 0) {
      let V = (0, uu6.v4)();
      Y.headers["Content-Type"] = `multipart/related; boundary=${V}`;
      let F = new xuB.PassThrough;
      Y.body = F, (0, xuB.pipeline)(this.getMultipartRequest(Y.multipart, V), F, () => {})
    }
    if (Y.validateStatus = Y.validateStatus || this.validateStatus, Y.responseType = Y.responseType || "unknown", !Y.headers.Accept && Y.responseType === "json") Y.headers.Accept = "application/json";
    Y.method = Y.method || "GET";
    let W = Y.proxy || ((B = process === null || process === void 0 ? void 0 : process.env) === null || B === void 0 ? void 0 : B.HTTPS_PROXY) || ((G = process === null || process === void 0 ? void 0 : process.env) === null || G === void 0 ? void 0 : G.https_proxy) || ((Z = process === null || process === void 0 ? void 0 : process.env) === null || Z === void 0 ? void 0 : Z.HTTP_PROXY) || ((I = process === null || process === void 0 ? void 0 : process.env) === null || I === void 0 ? void 0 : I.http_proxy),
      X = Ee(this, dGA, "m", _uB).call(this, Y.url, Y.noProxy);
    if (Y.agent);
    else if (W && X) {
      let V = await Ee(Ce, Ce, "m", kuB).call(Ce);
      if (this.agentCache.has(W)) Y.agent = this.agentCache.get(W);
      else Y.agent = new V(W, {
        cert: Y.cert,
        key: Y.key
      }), this.agentCache.set(W, Y.agent)
    } else if (Y.cert && Y.key)
      if (this.agentCache.has(Y.key)) Y.agent = this.agentCache.get(Y.key);
      else Y.agent = new vu6.Agent({
        cert: Y.cert,
        key: Y.key
      }), this.agentCache.set(Y.key, Y.agent);
    if (typeof Y.errorRedactor !== "function" && Y.errorRedactor !== !1) Y.errorRedactor = JeA.defaultErrorRedactor;
    return Y
  }, kuB = async function() {
    return yu6(this, Ce, Ee(this, Ce, "f", YeA) || (await Promise.resolve().then(() => ku6(LEA()))).HttpsProxyAgent, "f", YeA), Ee(this, Ce, "f", YeA)
  };
  YeA = {
    value: void 0
  }
})
// @from(Start 7612158, End 7613346)
PT = z((FE) => {
  var lu6 = FE && FE.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    iu6 = FE && FE.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) lu6(Q, A, B)
    };
  Object.defineProperty(FE, "__esModule", {
    value: !0
  });
  FE.instance = FE.Gaxios = FE.GaxiosError = void 0;
  FE.request = au6;
  var duB = muB();
  Object.defineProperty(FE, "Gaxios", {
    enumerable: !0,
    get: function() {
      return duB.Gaxios
    }
  });
  var nu6 = Xl1();
  Object.defineProperty(FE, "GaxiosError", {
    enumerable: !0,
    get: function() {
      return nu6.GaxiosError
    }
  });
  iu6(Vl1(), FE);
  FE.instance = new duB.Gaxios;
  async function au6(A) {
    return FE.instance.request(A)
  }
})
// @from(Start 7613352, End 7649843)
Kl1 = z((cuB, XeA) => {
  (function(A) {
    var Q, B = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
      G = Math.ceil,
      Z = Math.floor,
      I = "[BigNumber Error] ",
      Y = I + "Number primitive has more than 15 significant digits: ",
      J = 100000000000000,
      W = 14,
      X = 9007199254740991,
      V = [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 10000000000, 100000000000, 1000000000000, 10000000000000],
      F = 1e7,
      K = 1e9;

    function D(R) {
      var T, y, v, x = wA.prototype = {
          constructor: wA,
          toString: null,
          valueOf: null
        },
        p = new wA(1),
        u = 20,
        e = 4,
        l = -7,
        k = 21,
        m = -1e7,
        o = 1e7,
        IA = !1,
        FA = 1,
        zA = 0,
        NA = {
          prefix: "",
          groupSize: 3,
          secondaryGroupSize: 0,
          groupSeparator: ",",
          decimalSeparator: ".",
          fractionGroupSize: 0,
          fractionGroupSeparator: " ",
          suffix: ""
        },
        OA = "0123456789abcdefghijklmnopqrstuvwxyz",
        mA = !0;

      function wA(WA, EA) {
        var MA, DA, $A, TA, rA, iA, J1, w1, jA = this;
        if (!(jA instanceof wA)) return new wA(WA, EA);
        if (EA == null) {
          if (WA && WA._isBigNumber === !0) {
            if (jA.s = WA.s, !WA.c || WA.e > o) jA.c = jA.e = null;
            else if (WA.e < m) jA.c = [jA.e = 0];
            else jA.e = WA.e, jA.c = WA.c.slice();
            return
          }
          if ((iA = typeof WA == "number") && WA * 0 == 0) {
            if (jA.s = 1 / WA < 0 ? (WA = -WA, -1) : 1, WA === ~~WA) {
              for (TA = 0, rA = WA; rA >= 10; rA /= 10, TA++);
              if (TA > o) jA.c = jA.e = null;
              else jA.e = TA, jA.c = [WA];
              return
            }
            w1 = String(WA)
          } else {
            if (!B.test(w1 = String(WA))) return v(jA, w1, iA);
            jA.s = w1.charCodeAt(0) == 45 ? (w1 = w1.slice(1), -1) : 1
          }
          if ((TA = w1.indexOf(".")) > -1) w1 = w1.replace(".", "");
          if ((rA = w1.search(/e/i)) > 0) {
            if (TA < 0) TA = rA;
            TA += +w1.slice(rA + 1), w1 = w1.substring(0, rA)
          } else if (TA < 0) TA = w1.length
        } else {
          if (U(EA, 2, OA.length, "Base"), EA == 10 && mA) return jA = new wA(WA), oA(jA, u + jA.e + 1, e);
          if (w1 = String(WA), iA = typeof WA == "number") {
            if (WA * 0 != 0) return v(jA, w1, iA, EA);
            if (jA.s = 1 / WA < 0 ? (w1 = w1.slice(1), -1) : 1, wA.DEBUG && w1.replace(/^0\.0*|\./, "").length > 15) throw Error(Y + WA)
          } else jA.s = w1.charCodeAt(0) === 45 ? (w1 = w1.slice(1), -1) : 1;
          MA = OA.slice(0, EA), TA = rA = 0;
          for (J1 = w1.length; rA < J1; rA++)
            if (MA.indexOf(DA = w1.charAt(rA)) < 0) {
              if (DA == ".") {
                if (rA > TA) {
                  TA = J1;
                  continue
                }
              } else if (!$A) {
                if (w1 == w1.toUpperCase() && (w1 = w1.toLowerCase()) || w1 == w1.toLowerCase() && (w1 = w1.toUpperCase())) {
                  $A = !0, rA = -1, TA = 0;
                  continue
                }
              }
              return v(jA, String(WA), iA, EA)
            } if (iA = !1, w1 = y(w1, EA, 10, jA.s), (TA = w1.indexOf(".")) > -1) w1 = w1.replace(".", "");
          else TA = w1.length
        }
        for (rA = 0; w1.charCodeAt(rA) === 48; rA++);
        for (J1 = w1.length; w1.charCodeAt(--J1) === 48;);
        if (w1 = w1.slice(rA, ++J1)) {
          if (J1 -= rA, iA && wA.DEBUG && J1 > 15 && (WA > X || WA !== Z(WA))) throw Error(Y + jA.s * WA);
          if ((TA = TA - rA - 1) > o) jA.c = jA.e = null;
          else if (TA < m) jA.c = [jA.e = 0];
          else {
            if (jA.e = TA, jA.c = [], rA = (TA + 1) % W, TA < 0) rA += W;
            if (rA < J1) {
              if (rA) jA.c.push(+w1.slice(0, rA));
              for (J1 -= W; rA < J1;) jA.c.push(+w1.slice(rA, rA += W));
              rA = W - (w1 = w1.slice(rA)).length
            } else rA -= J1;
            for (; rA--; w1 += "0");
            jA.c.push(+w1)
          }
        } else jA.c = [jA.e = 0]
      }
      wA.clone = D, wA.ROUND_UP = 0, wA.ROUND_DOWN = 1, wA.ROUND_CEIL = 2, wA.ROUND_FLOOR = 3, wA.ROUND_HALF_UP = 4, wA.ROUND_HALF_DOWN = 5, wA.ROUND_HALF_EVEN = 6, wA.ROUND_HALF_CEIL = 7, wA.ROUND_HALF_FLOOR = 8, wA.EUCLID = 9, wA.config = wA.set = function(WA) {
        var EA, MA;
        if (WA != null)
          if (typeof WA == "object") {
            if (WA.hasOwnProperty(EA = "DECIMAL_PLACES")) MA = WA[EA], U(MA, 0, K, EA), u = MA;
            if (WA.hasOwnProperty(EA = "ROUNDING_MODE")) MA = WA[EA], U(MA, 0, 8, EA), e = MA;
            if (WA.hasOwnProperty(EA = "EXPONENTIAL_AT"))
              if (MA = WA[EA], MA && MA.pop) U(MA[0], -K, 0, EA), U(MA[1], 0, K, EA), l = MA[0], k = MA[1];
              else U(MA, -K, K, EA), l = -(k = MA < 0 ? -MA : MA);
            if (WA.hasOwnProperty(EA = "RANGE"))
              if (MA = WA[EA], MA && MA.pop) U(MA[0], -K, -1, EA), U(MA[1], 1, K, EA), m = MA[0], o = MA[1];
              else if (U(MA, -K, K, EA), MA) m = -(o = MA < 0 ? -MA : MA);
            else throw Error(I + EA + " cannot be zero: " + MA);
            if (WA.hasOwnProperty(EA = "CRYPTO"))
              if (MA = WA[EA], MA === !!MA)
                if (MA)
                  if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) IA = MA;
                  else throw IA = !MA, Error(I + "crypto unavailable");
            else IA = MA;
            else throw Error(I + EA + " not true or false: " + MA);
            if (WA.hasOwnProperty(EA = "MODULO_MODE")) MA = WA[EA], U(MA, 0, 9, EA), FA = MA;
            if (WA.hasOwnProperty(EA = "POW_PRECISION")) MA = WA[EA], U(MA, 0, K, EA), zA = MA;
            if (WA.hasOwnProperty(EA = "FORMAT"))
              if (MA = WA[EA], typeof MA == "object") NA = MA;
              else throw Error(I + EA + " not an object: " + MA);
            if (WA.hasOwnProperty(EA = "ALPHABET"))
              if (MA = WA[EA], typeof MA == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(MA)) mA = MA.slice(0, 10) == "0123456789", OA = MA;
              else throw Error(I + EA + " invalid: " + MA)
          } else throw Error(I + "Object expected: " + WA);
        return {
          DECIMAL_PLACES: u,
          ROUNDING_MODE: e,
          EXPONENTIAL_AT: [l, k],
          RANGE: [m, o],
          CRYPTO: IA,
          MODULO_MODE: FA,
          POW_PRECISION: zA,
          FORMAT: NA,
          ALPHABET: OA
        }
      }, wA.isBigNumber = function(WA) {
        if (!WA || WA._isBigNumber !== !0) return !1;
        if (!wA.DEBUG) return !0;
        var EA, MA, DA = WA.c,
          $A = WA.e,
          TA = WA.s;
        A: if ({}.toString.call(DA) == "[object Array]") {
          if ((TA === 1 || TA === -1) && $A >= -K && $A <= K && $A === Z($A)) {
            if (DA[0] === 0) {
              if ($A === 0 && DA.length === 1) return !0;
              break A
            }
            if (EA = ($A + 1) % W, EA < 1) EA += W;
            if (String(DA[0]).length == EA) {
              for (EA = 0; EA < DA.length; EA++)
                if (MA = DA[EA], MA < 0 || MA >= J || MA !== Z(MA)) break A;
              if (MA !== 0) return !0
            }
          }
        } else if (DA === null && $A === null && (TA === null || TA === 1 || TA === -1)) return !0;
        throw Error(I + "Invalid BigNumber: " + WA)
      }, wA.maximum = wA.max = function() {
        return KA(arguments, -1)
      }, wA.minimum = wA.min = function() {
        return KA(arguments, 1)
      }, wA.random = function() {
        var WA = 9007199254740992,
          EA = Math.random() * WA & 2097151 ? function() {
            return Z(Math.random() * WA)
          } : function() {
            return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0)
          };
        return function(MA) {
          var DA, $A, TA, rA, iA, J1 = 0,
            w1 = [],
            jA = new wA(p);
          if (MA == null) MA = u;
          else U(MA, 0, K);
          if (rA = G(MA / W), IA)
            if (crypto.getRandomValues) {
              DA = crypto.getRandomValues(new Uint32Array(rA *= 2));
              for (; J1 < rA;)
                if (iA = DA[J1] * 131072 + (DA[J1 + 1] >>> 11), iA >= 9000000000000000) $A = crypto.getRandomValues(new Uint32Array(2)), DA[J1] = $A[0], DA[J1 + 1] = $A[1];
                else w1.push(iA % 100000000000000), J1 += 2;
              J1 = rA / 2
            } else if (crypto.randomBytes) {
            DA = crypto.randomBytes(rA *= 7);
            for (; J1 < rA;)
              if (iA = (DA[J1] & 31) * 281474976710656 + DA[J1 + 1] * 1099511627776 + DA[J1 + 2] * 4294967296 + DA[J1 + 3] * 16777216 + (DA[J1 + 4] << 16) + (DA[J1 + 5] << 8) + DA[J1 + 6], iA >= 9000000000000000) crypto.randomBytes(7).copy(DA, J1);
              else w1.push(iA % 100000000000000), J1 += 7;
            J1 = rA / 7
          } else throw IA = !1, Error(I + "crypto unavailable");
          if (!IA) {
            for (; J1 < rA;)
              if (iA = EA(), iA < 9000000000000000) w1[J1++] = iA % 100000000000000
          }
          if (rA = w1[--J1], MA %= W, rA && MA) iA = V[W - MA], w1[J1] = Z(rA / iA) * iA;
          for (; w1[J1] === 0; w1.pop(), J1--);
          if (J1 < 0) w1 = [TA = 0];
          else {
            for (TA = -1; w1[0] === 0; w1.splice(0, 1), TA -= W);
            for (J1 = 1, iA = w1[0]; iA >= 10; iA /= 10, J1++);
            if (J1 < W) TA -= W - J1
          }
          return jA.e = TA, jA.c = w1, jA
        }
      }(), wA.sum = function() {
        var WA = 1,
          EA = arguments,
          MA = new wA(EA[0]);
        for (; WA < EA.length;) MA = MA.plus(EA[WA++]);
        return MA
      }, y = function() {
        var WA = "0123456789";

        function EA(MA, DA, $A, TA) {
          var rA, iA = [0],
            J1, w1 = 0,
            jA = MA.length;
          for (; w1 < jA;) {
            for (J1 = iA.length; J1--; iA[J1] *= DA);
            iA[0] += TA.indexOf(MA.charAt(w1++));
            for (rA = 0; rA < iA.length; rA++)
              if (iA[rA] > $A - 1) {
                if (iA[rA + 1] == null) iA[rA + 1] = 0;
                iA[rA + 1] += iA[rA] / $A | 0, iA[rA] %= $A
              }
          }
          return iA.reverse()
        }
        return function(MA, DA, $A, TA, rA) {
          var iA, J1, w1, jA, eA, t1, v1, F0, g0 = MA.indexOf("."),
            p0 = u,
            n0 = e;
          if (g0 >= 0) jA = zA, zA = 0, MA = MA.replace(".", ""), F0 = new wA(DA), t1 = F0.pow(MA.length - g0), zA = jA, F0.c = EA(N(C(t1.c), t1.e, "0"), 10, $A, WA), F0.e = F0.c.length;
          v1 = EA(MA, DA, $A, rA ? (iA = OA, WA) : (iA = WA, OA)), w1 = jA = v1.length;
          for (; v1[--jA] == 0; v1.pop());
          if (!v1[0]) return iA.charAt(0);
          if (g0 < 0) --w1;
          else t1.c = v1, t1.e = w1, t1.s = TA, t1 = T(t1, F0, p0, n0, $A), v1 = t1.c, eA = t1.r, w1 = t1.e;
          if (J1 = w1 + p0 + 1, g0 = v1[J1], jA = $A / 2, eA = eA || J1 < 0 || v1[J1 + 1] != null, eA = n0 < 4 ? (g0 != null || eA) && (n0 == 0 || n0 == (t1.s < 0 ? 3 : 2)) : g0 > jA || g0 == jA && (n0 == 4 || eA || n0 == 6 && v1[J1 - 1] & 1 || n0 == (t1.s < 0 ? 8 : 7)), J1 < 1 || !v1[0]) MA = eA ? N(iA.charAt(1), -p0, iA.charAt(0)) : iA.charAt(0);
          else {
            if (v1.length = J1, eA) {
              for (--$A; ++v1[--J1] > $A;)
                if (v1[J1] = 0, !J1) ++w1, v1 = [1].concat(v1)
            }
            for (jA = v1.length; !v1[--jA];);
            for (g0 = 0, MA = ""; g0 <= jA; MA += iA.charAt(v1[g0++]));
            MA = N(MA, w1, iA.charAt(0))
          }
          return MA
        }
      }(), T = function() {
        function WA(DA, $A, TA) {
          var rA, iA, J1, w1, jA = 0,
            eA = DA.length,
            t1 = $A % F,
            v1 = $A / F | 0;
          for (DA = DA.slice(); eA--;) J1 = DA[eA] % F, w1 = DA[eA] / F | 0, rA = v1 * J1 + w1 * t1, iA = t1 * J1 + rA % F * F + jA, jA = (iA / TA | 0) + (rA / F | 0) + v1 * w1, DA[eA] = iA % TA;
          if (jA) DA = [jA].concat(DA);
          return DA
        }

        function EA(DA, $A, TA, rA) {
          var iA, J1;
          if (TA != rA) J1 = TA > rA ? 1 : -1;
          else
            for (iA = J1 = 0; iA < TA; iA++)
              if (DA[iA] != $A[iA]) {
                J1 = DA[iA] > $A[iA] ? 1 : -1;
                break
              } return J1
        }

        function MA(DA, $A, TA, rA) {
          var iA = 0;
          for (; TA--;) DA[TA] -= iA, iA = DA[TA] < $A[TA] ? 1 : 0, DA[TA] = iA * rA + DA[TA] - $A[TA];
          for (; !DA[0] && DA.length > 1; DA.splice(0, 1));
        }
        return function(DA, $A, TA, rA, iA) {
          var J1, w1, jA, eA, t1, v1, F0, g0, p0, n0, _1, zQ, W1, O1, a1, C0, v0, k0 = DA.s == $A.s ? 1 : -1,
            f0 = DA.c,
            G0 = $A.c;
          if (!f0 || !f0[0] || !G0 || !G0[0]) return new wA(!DA.s || !$A.s || (f0 ? G0 && f0[0] == G0[0] : !G0) ? NaN : f0 && f0[0] == 0 || !G0 ? k0 * 0 : k0 / 0);
          if (g0 = new wA(k0), p0 = g0.c = [], w1 = DA.e - $A.e, k0 = TA + w1 + 1, !iA) iA = J, w1 = H(DA.e / W) - H($A.e / W), k0 = k0 / W | 0;
          for (jA = 0; G0[jA] == (f0[jA] || 0); jA++);
          if (G0[jA] > (f0[jA] || 0)) w1--;
          if (k0 < 0) p0.push(1), eA = !0;
          else {
            if (O1 = f0.length, C0 = G0.length, jA = 0, k0 += 2, t1 = Z(iA / (G0[0] + 1)), t1 > 1) G0 = WA(G0, t1, iA), f0 = WA(f0, t1, iA), C0 = G0.length, O1 = f0.length;
            W1 = C0, n0 = f0.slice(0, C0), _1 = n0.length;
            for (; _1 < C0; n0[_1++] = 0);
            if (v0 = G0.slice(), v0 = [0].concat(v0), a1 = G0[0], G0[1] >= iA / 2) a1++;
            do {
              if (t1 = 0, J1 = EA(G0, n0, C0, _1), J1 < 0) {
                if (zQ = n0[0], C0 != _1) zQ = zQ * iA + (n0[1] || 0);
                if (t1 = Z(zQ / a1), t1 > 1) {
                  if (t1 >= iA) t1 = iA - 1;
                  v1 = WA(G0, t1, iA), F0 = v1.length, _1 = n0.length;
                  while (EA(v1, n0, F0, _1) == 1) t1--, MA(v1, C0 < F0 ? v0 : G0, F0, iA), F0 = v1.length, J1 = 1
                } else {
                  if (t1 == 0) J1 = t1 = 1;
                  v1 = G0.slice(), F0 = v1.length
                }
                if (F0 < _1) v1 = [0].concat(v1);
                if (MA(n0, v1, _1, iA), _1 = n0.length, J1 == -1)
                  while (EA(G0, n0, C0, _1) < 1) t1++, MA(n0, C0 < _1 ? v0 : G0, _1, iA), _1 = n0.length
              } else if (J1 === 0) t1++, n0 = [0];
              if (p0[jA++] = t1, n0[0]) n0[_1++] = f0[W1] || 0;
              else n0 = [f0[W1]], _1 = 1
            } while ((W1++ < O1 || n0[0] != null) && k0--);
            if (eA = n0[0] != null, !p0[0]) p0.splice(0, 1)
          }
          if (iA == J) {
            for (jA = 1, k0 = p0[0]; k0 >= 10; k0 /= 10, jA++);
            oA(g0, TA + (g0.e = jA + w1 * W - 1) + 1, rA, eA)
          } else g0.e = w1, g0.r = +eA;
          return g0
        }
      }();

      function qA(WA, EA, MA, DA) {
        var $A, TA, rA, iA, J1;
        if (MA == null) MA = e;
        else U(MA, 0, 8);
        if (!WA.c) return WA.toString();
        if ($A = WA.c[0], rA = WA.e, EA == null) J1 = C(WA.c), J1 = DA == 1 || DA == 2 && (rA <= l || rA >= k) ? w(J1, rA) : N(J1, rA, "0");
        else if (WA = oA(new wA(WA), EA, MA), TA = WA.e, J1 = C(WA.c), iA = J1.length, DA == 1 || DA == 2 && (EA <= TA || TA <= l)) {
          for (; iA < EA; J1 += "0", iA++);
          J1 = w(J1, TA)
        } else if (EA -= rA, J1 = N(J1, TA, "0"), TA + 1 > iA) {
          if (--EA > 0)
            for (J1 += "."; EA--; J1 += "0");
        } else if (EA += TA - iA, EA > 0) {
          if (TA + 1 == iA) J1 += ".";
          for (; EA--; J1 += "0");
        }
        return WA.s < 0 && $A ? "-" + J1 : J1
      }

      function KA(WA, EA) {
        var MA, DA, $A = 1,
          TA = new wA(WA[0]);
        for (; $A < WA.length; $A++)
          if (DA = new wA(WA[$A]), !DA.s || (MA = E(TA, DA)) === EA || MA === 0 && TA.s === EA) TA = DA;
        return TA
      }

      function yA(WA, EA, MA) {
        var DA = 1,
          $A = EA.length;
        for (; !EA[--$A]; EA.pop());
        for ($A = EA[0]; $A >= 10; $A /= 10, DA++);
        if ((MA = DA + MA * W - 1) > o) WA.c = WA.e = null;
        else if (MA < m) WA.c = [WA.e = 0];
        else WA.e = MA, WA.c = EA;
        return WA
      }
      v = function() {
        var WA = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
          EA = /^([^.]+)\.$/,
          MA = /^\.([^.]+)$/,
          DA = /^-?(Infinity|NaN)$/,
          $A = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
        return function(TA, rA, iA, J1) {
          var w1, jA = iA ? rA : rA.replace($A, "");
          if (DA.test(jA)) TA.s = isNaN(jA) ? null : jA < 0 ? -1 : 1;
          else {
            if (!iA) {
              if (jA = jA.replace(WA, function(eA, t1, v1) {
                  return w1 = (v1 = v1.toLowerCase()) == "x" ? 16 : v1 == "b" ? 2 : 8, !J1 || J1 == w1 ? t1 : eA
                }), J1) w1 = J1, jA = jA.replace(EA, "$1").replace(MA, "0.$1");
              if (rA != jA) return new wA(jA, w1)
            }
            if (wA.DEBUG) throw Error(I + "Not a" + (J1 ? " base " + J1 : "") + " number: " + rA);
            TA.s = null
          }
          TA.c = TA.e = null
        }
      }();

      function oA(WA, EA, MA, DA) {
        var $A, TA, rA, iA, J1, w1, jA, eA = WA.c,
          t1 = V;
        if (eA) {
          A: {
            for ($A = 1, iA = eA[0]; iA >= 10; iA /= 10, $A++);
            if (TA = EA - $A, TA < 0) TA += W,
            rA = EA,
            J1 = eA[w1 = 0],
            jA = Z(J1 / t1[$A - rA - 1] % 10);
            else if (w1 = G((TA + 1) / W), w1 >= eA.length)
              if (DA) {
                for (; eA.length <= w1; eA.push(0));
                J1 = jA = 0, $A = 1, TA %= W, rA = TA - W + 1
              } else break A;
            else {
              J1 = iA = eA[w1];
              for ($A = 1; iA >= 10; iA /= 10, $A++);
              TA %= W, rA = TA - W + $A, jA = rA < 0 ? 0 : Z(J1 / t1[$A - rA - 1] % 10)
            }
            if (DA = DA || EA < 0 || eA[w1 + 1] != null || (rA < 0 ? J1 : J1 % t1[$A - rA - 1]), DA = MA < 4 ? (jA || DA) && (MA == 0 || MA == (WA.s < 0 ? 3 : 2)) : jA > 5 || jA == 5 && (MA == 4 || DA || MA == 6 && (TA > 0 ? rA > 0 ? J1 / t1[$A - rA] : 0 : eA[w1 - 1]) % 10 & 1 || MA == (WA.s < 0 ? 8 : 7)), EA < 1 || !eA[0]) {
              if (eA.length = 0, DA) EA -= WA.e + 1, eA[0] = t1[(W - EA % W) % W], WA.e = -EA || 0;
              else eA[0] = WA.e = 0;
              return WA
            }
            if (TA == 0) eA.length = w1,
            iA = 1,
            w1--;
            else eA.length = w1 + 1,
            iA = t1[W - TA],
            eA[w1] = rA > 0 ? Z(J1 / t1[$A - rA] % t1[rA]) * iA : 0;
            if (DA)
              for (;;)
                if (w1 == 0) {
                  for (TA = 1, rA = eA[0]; rA >= 10; rA /= 10, TA++);
                  rA = eA[0] += iA;
                  for (iA = 1; rA >= 10; rA /= 10, iA++);
                  if (TA != iA) {
                    if (WA.e++, eA[0] == J) eA[0] = 1
                  }
                  break
                } else {
                  if (eA[w1] += iA, eA[w1] != J) break;
                  eA[w1--] = 0, iA = 1
                } for (TA = eA.length; eA[--TA] === 0; eA.pop());
          }
          if (WA.e > o) WA.c = WA.e = null;
          else if (WA.e < m) WA.c = [WA.e = 0]
        }
        return WA
      }

      function X1(WA) {
        var EA, MA = WA.e;
        if (MA === null) return WA.toString();
        return EA = C(WA.c), EA = MA <= l || MA >= k ? w(EA, MA) : N(EA, MA, "0"), WA.s < 0 ? "-" + EA : EA
      }
      if (x.absoluteValue = x.abs = function() {
          var WA = new wA(this);
          if (WA.s < 0) WA.s = 1;
          return WA
        }, x.comparedTo = function(WA, EA) {
          return E(this, new wA(WA, EA))
        }, x.decimalPlaces = x.dp = function(WA, EA) {
          var MA, DA, $A, TA = this;
          if (WA != null) {
            if (U(WA, 0, K), EA == null) EA = e;
            else U(EA, 0, 8);
            return oA(new wA(TA), WA + TA.e + 1, EA)
          }
          if (!(MA = TA.c)) return null;
          if (DA = (($A = MA.length - 1) - H(this.e / W)) * W, $A = MA[$A])
            for (; $A % 10 == 0; $A /= 10, DA--);
          if (DA < 0) DA = 0;
          return DA
        }, x.dividedBy = x.div = function(WA, EA) {
          return T(this, new wA(WA, EA), u, e)
        }, x.dividedToIntegerBy = x.idiv = function(WA, EA) {
          return T(this, new wA(WA, EA), 0, 1)
        }, x.exponentiatedBy = x.pow = function(WA, EA) {
          var MA, DA, $A, TA, rA, iA, J1, w1, jA, eA = this;
          if (WA = new wA(WA), WA.c && !WA.isInteger()) throw Error(I + "Exponent not an integer: " + X1(WA));
          if (EA != null) EA = new wA(EA);
          if (iA = WA.e > 14, !eA.c || !eA.c[0] || eA.c[0] == 1 && !eA.e && eA.c.length == 1 || !WA.c || !WA.c[0]) return jA = new wA(Math.pow(+X1(eA), iA ? WA.s * (2 - q(WA)) : +X1(WA))), EA ? jA.mod(EA) : jA;
          if (J1 = WA.s < 0, EA) {
            if (EA.c ? !EA.c[0] : !EA.s) return new wA(NaN);
            if (DA = !J1 && eA.isInteger() && EA.isInteger(), DA) eA = eA.mod(EA)
          } else if (WA.e > 9 && (eA.e > 0 || eA.e < -1 || (eA.e == 0 ? eA.c[0] > 1 || iA && eA.c[1] >= 240000000 : eA.c[0] < 80000000000000 || iA && eA.c[0] <= 99999750000000))) {
            if (TA = eA.s < 0 && q(WA) ? -0 : 0, eA.e > -1) TA = 1 / TA;
            return new wA(J1 ? 1 / TA : TA)
          } else if (zA) TA = G(zA / W + 2);
          if (iA) {
            if (MA = new wA(0.5), J1) WA.s = 1;
            w1 = q(WA)
          } else $A = Math.abs(+X1(WA)), w1 = $A % 2;
          jA = new wA(p);
          for (;;) {
            if (w1) {
              if (jA = jA.times(eA), !jA.c) break;
              if (TA) {
                if (jA.c.length > TA) jA.c.length = TA
              } else if (DA) jA = jA.mod(EA)
            }
            if ($A) {
              if ($A = Z($A / 2), $A === 0) break;
              w1 = $A % 2
            } else if (WA = WA.times(MA), oA(WA, WA.e + 1, 1), WA.e > 14) w1 = q(WA);
            else {
              if ($A = +X1(WA), $A === 0) break;
              w1 = $A % 2
            }
            if (eA = eA.times(eA), TA) {
              if (eA.c && eA.c.length > TA) eA.c.length = TA
            } else if (DA) eA = eA.mod(EA)
          }
          if (DA) return jA;
          if (J1) jA = p.div(jA);
          return EA ? jA.mod(EA) : TA ? oA(jA, zA, e, rA) : jA
        }, x.integerValue = function(WA) {
          var EA = new wA(this);
          if (WA == null) WA = e;
          else U(WA, 0, 8);
          return oA(EA, EA.e + 1, WA)
        }, x.isEqualTo = x.eq = function(WA, EA) {
          return E(this, new wA(WA, EA)) === 0
        }, x.isFinite = function() {
          return !!this.c
        }, x.isGreaterThan = x.gt = function(WA, EA) {
          return E(this, new wA(WA, EA)) > 0
        }, x.isGreaterThanOrEqualTo = x.gte = function(WA, EA) {
          return (EA = E(this, new wA(WA, EA))) === 1 || EA === 0
        }, x.isInteger = function() {
          return !!this.c && H(this.e / W) > this.c.length - 2
        }, x.isLessThan = x.lt = function(WA, EA) {
          return E(this, new wA(WA, EA)) < 0
        }, x.isLessThanOrEqualTo = x.lte = function(WA, EA) {
          return (EA = E(this, new wA(WA, EA))) === -1 || EA === 0
        }, x.isNaN = function() {
          return !this.s
        }, x.isNegative = function() {
          return this.s < 0
        }, x.isPositive = function() {
          return this.s > 0
        }, x.isZero = function() {
          return !!this.c && this.c[0] == 0
        }, x.minus = function(WA, EA) {
          var MA, DA, $A, TA, rA = this,
            iA = rA.s;
          if (WA = new wA(WA, EA), EA = WA.s, !iA || !EA) return new wA(NaN);
          if (iA != EA) return WA.s = -EA, rA.plus(WA);
          var J1 = rA.e / W,
            w1 = WA.e / W,
            jA = rA.c,
            eA = WA.c;
          if (!J1 || !w1) {
            if (!jA || !eA) return jA ? (WA.s = -EA, WA) : new wA(eA ? rA : NaN);
            if (!jA[0] || !eA[0]) return eA[0] ? (WA.s = -EA, WA) : new wA(jA[0] ? rA : e == 3 ? -0 : 0)
          }
          if (J1 = H(J1), w1 = H(w1), jA = jA.slice(), iA = J1 - w1) {
            if (TA = iA < 0) iA = -iA, $A = jA;
            else w1 = J1, $A = eA;
            $A.reverse();
            for (EA = iA; EA--; $A.push(0));
            $A.reverse()
          } else {
            DA = (TA = (iA = jA.length) < (EA = eA.length)) ? iA : EA;
            for (iA = EA = 0; EA < DA; EA++)
              if (jA[EA] != eA[EA]) {
                TA = jA[EA] < eA[EA];
                break
              }
          }
          if (TA) $A = jA, jA = eA, eA = $A, WA.s = -WA.s;
          if (EA = (DA = eA.length) - (MA = jA.length), EA > 0)
            for (; EA--; jA[MA++] = 0);
          EA = J - 1;
          for (; DA > iA;) {
            if (jA[--DA] < eA[DA]) {
              for (MA = DA; MA && !jA[--MA]; jA[MA] = EA);
              --jA[MA], jA[DA] += J
            }
            jA[DA] -= eA[DA]
          }
          for (; jA[0] == 0; jA.splice(0, 1), --w1);
          if (!jA[0]) return WA.s = e == 3 ? -1 : 1, WA.c = [WA.e = 0], WA;
          return yA(WA, jA, w1)
        }, x.modulo = x.mod = function(WA, EA) {
          var MA, DA, $A = this;
          if (WA = new wA(WA, EA), !$A.c || !WA.s || WA.c && !WA.c[0]) return new wA(NaN);
          else if (!WA.c || $A.c && !$A.c[0]) return new wA($A);
          if (FA == 9) DA = WA.s, WA.s = 1, MA = T($A, WA, 0, 3), WA.s = DA, MA.s *= DA;
          else MA = T($A, WA, 0, FA);
          if (WA = $A.minus(MA.times(WA)), !WA.c[0] && FA == 1) WA.s = $A.s;
          return WA
        }, x.multipliedBy = x.times = function(WA, EA) {
          var MA, DA, $A, TA, rA, iA, J1, w1, jA, eA, t1, v1, F0, g0, p0, n0 = this,
            _1 = n0.c,
            zQ = (WA = new wA(WA, EA)).c;
          if (!_1 || !zQ || !_1[0] || !zQ[0]) {
            if (!n0.s || !WA.s || _1 && !_1[0] && !zQ || zQ && !zQ[0] && !_1) WA.c = WA.e = WA.s = null;
            else if (WA.s *= n0.s, !_1 || !zQ) WA.c = WA.e = null;
            else WA.c = [0], WA.e = 0;
            return WA
          }
          if (DA = H(n0.e / W) + H(WA.e / W), WA.s *= n0.s, J1 = _1.length, eA = zQ.length, J1 < eA) F0 = _1, _1 = zQ, zQ = F0, $A = J1, J1 = eA, eA = $A;
          for ($A = J1 + eA, F0 = []; $A--; F0.push(0));
          g0 = J, p0 = F;
          for ($A = eA; --$A >= 0;) {
            MA = 0, t1 = zQ[$A] % p0, v1 = zQ[$A] / p0 | 0;
            for (rA = J1, TA = $A + rA; TA > $A;) w1 = _1[--rA] % p0, jA = _1[rA] / p0 | 0, iA = v1 * w1 + jA * t1, w1 = t1 * w1 + iA % p0 * p0 + F0[TA] + MA, MA = (w1 / g0 | 0) + (iA / p0 | 0) + v1 * jA, F0[TA--] = w1 % g0;
            F0[TA] = MA
          }
          if (MA) ++DA;
          else F0.splice(0, 1);
          return yA(WA, F0, DA)
        }, x.negated = function() {
          var WA = new wA(this);
          return WA.s = -WA.s || null, WA
        }, x.plus = function(WA, EA) {
          var MA, DA = this,
            $A = DA.s;
          if (WA = new wA(WA, EA), EA = WA.s, !$A || !EA) return new wA(NaN);
          if ($A != EA) return WA.s = -EA, DA.minus(WA);
          var TA = DA.e / W,
            rA = WA.e / W,
            iA = DA.c,
            J1 = WA.c;
          if (!TA || !rA) {
            if (!iA || !J1) return new wA($A / 0);
            if (!iA[0] || !J1[0]) return J1[0] ? WA : new wA(iA[0] ? DA : $A * 0)
          }
          if (TA = H(TA), rA = H(rA), iA = iA.slice(), $A = TA - rA) {
            if ($A > 0) rA = TA, MA = J1;
            else $A = -$A, MA = iA;
            MA.reverse();
            for (; $A--; MA.push(0));
            MA.reverse()
          }
          if ($A = iA.length, EA = J1.length, $A - EA < 0) MA = J1, J1 = iA, iA = MA, EA = $A;
          for ($A = 0; EA;) $A = (iA[--EA] = iA[EA] + J1[EA] + $A) / J | 0, iA[EA] = J === iA[EA] ? 0 : iA[EA] % J;
          if ($A) iA = [$A].concat(iA), ++rA;
          return yA(WA, iA, rA)
        }, x.precision = x.sd = function(WA, EA) {
          var MA, DA, $A, TA = this;
          if (WA != null && WA !== !!WA) {
            if (U(WA, 1, K), EA == null) EA = e;
            else U(EA, 0, 8);
            return oA(new wA(TA), WA, EA)
          }
          if (!(MA = TA.c)) return null;
          if ($A = MA.length - 1, DA = $A * W + 1, $A = MA[$A]) {
            for (; $A % 10 == 0; $A /= 10, DA--);
            for ($A = MA[0]; $A >= 10; $A /= 10, DA++);
          }
          if (WA && TA.e + 1 > DA) DA = TA.e + 1;
          return DA
        }, x.shiftedBy = function(WA) {
          return U(WA, -X, X), this.times("1e" + WA)
        }, x.squareRoot = x.sqrt = function() {
          var WA, EA, MA, DA, $A, TA = this,
            rA = TA.c,
            iA = TA.s,
            J1 = TA.e,
            w1 = u + 4,
            jA = new wA("0.5");
          if (iA !== 1 || !rA || !rA[0]) return new wA(!iA || iA < 0 && (!rA || rA[0]) ? NaN : rA ? TA : 1 / 0);
          if (iA = Math.sqrt(+X1(TA)), iA == 0 || iA == 1 / 0) {
            if (EA = C(rA), (EA.length + J1) % 2 == 0) EA += "0";
            if (iA = Math.sqrt(+EA), J1 = H((J1 + 1) / 2) - (J1 < 0 || J1 % 2), iA == 1 / 0) EA = "5e" + J1;
            else EA = iA.toExponential(), EA = EA.slice(0, EA.indexOf("e") + 1) + J1;
            MA = new wA(EA)
          } else MA = new wA(iA + "");
          if (MA.c[0]) {
            if (J1 = MA.e, iA = J1 + w1, iA < 3) iA = 0;
            for (;;)
              if ($A = MA, MA = jA.times($A.plus(T(TA, $A, w1, 1))), C($A.c).slice(0, iA) === (EA = C(MA.c)).slice(0, iA)) {
                if (MA.e < J1) --iA;
                if (EA = EA.slice(iA - 3, iA + 1), EA == "9999" || !DA && EA == "4999") {
                  if (!DA) {
                    if (oA($A, $A.e + u + 2, 0), $A.times($A).eq(TA)) {
                      MA = $A;
                      break
                    }
                  }
                  w1 += 4, iA += 4, DA = 1
                } else {
                  if (!+EA || !+EA.slice(1) && EA.charAt(0) == "5") oA(MA, MA.e + u + 2, 1), WA = !MA.times(MA).eq(TA);
                  break
                }
              }
          }
          return oA(MA, MA.e + u + 1, e, WA)
        }, x.toExponential = function(WA, EA) {
          if (WA != null) U(WA, 0, K), WA++;
          return qA(this, WA, EA, 1)
        }, x.toFixed = function(WA, EA) {
          if (WA != null) U(WA, 0, K), WA = WA + this.e + 1;
          return qA(this, WA, EA)
        }, x.toFormat = function(WA, EA, MA) {
          var DA, $A = this;
          if (MA == null)
            if (WA != null && EA && typeof EA == "object") MA = EA, EA = null;
            else if (WA && typeof WA == "object") MA = WA, WA = EA = null;
          else MA = NA;
          else if (typeof MA != "object") throw Error(I + "Argument not an object: " + MA);
          if (DA = $A.toFixed(WA, EA), $A.c) {
            var TA, rA = DA.split("."),
              iA = +MA.groupSize,
              J1 = +MA.secondaryGroupSize,
              w1 = MA.groupSeparator || "",
              jA = rA[0],
              eA = rA[1],
              t1 = $A.s < 0,
              v1 = t1 ? jA.slice(1) : jA,
              F0 = v1.length;
            if (J1) TA = iA, iA = J1, J1 = TA, F0 -= TA;
            if (iA > 0 && F0 > 0) {
              TA = F0 % iA || iA, jA = v1.substr(0, TA);
              for (; TA < F0; TA += iA) jA += w1 + v1.substr(TA, iA);
              if (J1 > 0) jA += w1 + v1.slice(TA);
              if (t1) jA = "-" + jA
            }
            DA = eA ? jA + (MA.decimalSeparator || "") + ((J1 = +MA.fractionGroupSize) ? eA.replace(new RegExp("\\d{" + J1 + "}\\B", "g"), "$&" + (MA.fractionGroupSeparator || "")) : eA) : jA
          }
          return (MA.prefix || "") + DA + (MA.suffix || "")
        }, x.toFraction = function(WA) {
          var EA, MA, DA, $A, TA, rA, iA, J1, w1, jA, eA, t1, v1 = this,
            F0 = v1.c;
          if (WA != null) {
            if (iA = new wA(WA), !iA.isInteger() && (iA.c || iA.s !== 1) || iA.lt(p)) throw Error(I + "Argument " + (iA.isInteger() ? "out of range: " : "not an integer: ") + X1(iA))
          }
          if (!F0) return new wA(v1);
          EA = new wA(p), w1 = MA = new wA(p), DA = J1 = new wA(p), t1 = C(F0), TA = EA.e = t1.length - v1.e - 1, EA.c[0] = V[(rA = TA % W) < 0 ? W + rA : rA], WA = !WA || iA.comparedTo(EA) > 0 ? TA > 0 ? EA : w1 : iA, rA = o, o = 1 / 0, iA = new wA(t1), J1.c[0] = 0;
          for (;;) {
            if (jA = T(iA, EA, 0, 1), $A = MA.plus(jA.times(DA)), $A.comparedTo(WA) == 1) break;
            MA = DA, DA = $A, w1 = J1.plus(jA.times($A = w1)), J1 = $A, EA = iA.minus(jA.times($A = EA)), iA = $A
          }
          return $A = T(WA.minus(MA), DA, 0, 1), J1 = J1.plus($A.times(w1)), MA = MA.plus($A.times(DA)), J1.s = w1.s = v1.s, TA = TA * 2, eA = T(w1, DA, TA, e).minus(v1).abs().comparedTo(T(J1, MA, TA, e).minus(v1).abs()) < 1 ? [w1, DA] : [J1, MA], o = rA, eA
        }, x.toNumber = function() {
          return +X1(this)
        }, x.toPrecision = function(WA, EA) {
          if (WA != null) U(WA, 1, K);
          return qA(this, WA, EA, 2)
        }, x.toString = function(WA) {
          var EA, MA = this,
            DA = MA.s,
            $A = MA.e;
          if ($A === null)
            if (DA) {
              if (EA = "Infinity", DA < 0) EA = "-" + EA
            } else EA = "NaN";
          else {
            if (WA == null) EA = $A <= l || $A >= k ? w(C(MA.c), $A) : N(C(MA.c), $A, "0");
            else if (WA === 10 && mA) MA = oA(new wA(MA), u + $A + 1, e), EA = N(C(MA.c), MA.e, "0");
            else U(WA, 2, OA.length, "Base"), EA = y(N(C(MA.c), $A, "0"), 10, WA, DA, !0);
            if (DA < 0 && MA.c[0]) EA = "-" + EA
          }
          return EA
        }, x.valueOf = x.toJSON = function() {
          return X1(this)
        }, x._isBigNumber = !0, R != null) wA.set(R);
      return wA
    }

    function H(R) {
      var T = R | 0;
      return R > 0 || R === T ? T : T - 1
    }

    function C(R) {
      var T, y, v = 1,
        x = R.length,
        p = R[0] + "";
      for (; v < x;) {
        T = R[v++] + "", y = W - T.length;
        for (; y--; T = "0" + T);
        p += T
      }
      for (x = p.length; p.charCodeAt(--x) === 48;);
      return p.slice(0, x + 1 || 1)
    }

    function E(R, T) {
      var y, v, x = R.c,
        p = T.c,
        u = R.s,
        e = T.s,
        l = R.e,
        k = T.e;
      if (!u || !e) return null;
      if (y = x && !x[0], v = p && !p[0], y || v) return y ? v ? 0 : -e : u;
      if (u != e) return u;
      if (y = u < 0, v = l == k, !x || !p) return v ? 0 : !x ^ y ? 1 : -1;
      if (!v) return l > k ^ y ? 1 : -1;
      e = (l = x.length) < (k = p.length) ? l : k;
      for (u = 0; u < e; u++)
        if (x[u] != p[u]) return x[u] > p[u] ^ y ? 1 : -1;
      return l == k ? 0 : l > k ^ y ? 1 : -1
    }

    function U(R, T, y, v) {
      if (R < T || R > y || R !== Z(R)) throw Error(I + (v || "Argument") + (typeof R == "number" ? R < T || R > y ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(R))
    }

    function q(R) {
      var T = R.c.length - 1;
      return H(R.e / W) == T && R.c[T] % 2 != 0
    }

    function w(R, T) {
      return (R.length > 1 ? R.charAt(0) + "." + R.slice(1) : R) + (T < 0 ? "e" : "e+") + T
    }

    function N(R, T, y) {
      var v, x;
      if (T < 0) {
        for (x = y + "."; ++T; x += y);
        R = x + R
      } else if (v = R.length, ++T > v) {
        for (x = y, T -= v; --T; x += y);
        R += x
      } else if (T < v) R = R.slice(0, T) + "." + R.slice(T);
      return R
    }
    if (Q = D(), Q.default = Q.BigNumber = Q, typeof define == "function" && define.amd) define(function() {
      return Q
    });
    else if (typeof XeA < "u" && XeA.exports) XeA.exports = Q;
    else {
      if (!A) A = typeof self < "u" && self ? self : window;
      A.BigNumber = Q
    }
  })(cuB)
})
// @from(Start 7649849, End 7652592)
nuB = z((w4G, iuB) => {
  var puB = Kl1(),
    luB = w4G;
  (function() {
    function A(X) {
      return X < 10 ? "0" + X : X
    }
    var Q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      B = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      G, Z, I = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': "\\\"",
        "\\": "\\\\"
      },
      Y;

    function J(X) {
      return B.lastIndex = 0, B.test(X) ? '"' + X.replace(B, function(V) {
        var F = I[V];
        return typeof F === "string" ? F : "\\u" + ("0000" + V.charCodeAt(0).toString(16)).slice(-4)
      }) + '"' : '"' + X + '"'
    }

    function W(X, V) {
      var F, K, D, H, C = G,
        E, U = V[X],
        q = U != null && (U instanceof puB || puB.isBigNumber(U));
      if (U && typeof U === "object" && typeof U.toJSON === "function") U = U.toJSON(X);
      if (typeof Y === "function") U = Y.call(V, X, U);
      switch (typeof U) {
        case "string":
          if (q) return U;
          else return J(U);
        case "number":
          return isFinite(U) ? String(U) : "null";
        case "boolean":
        case "null":
        case "bigint":
          return String(U);
        case "object":
          if (!U) return "null";
          if (G += Z, E = [], Object.prototype.toString.apply(U) === "[object Array]") {
            H = U.length;
            for (F = 0; F < H; F += 1) E[F] = W(F, U) || "null";
            return D = E.length === 0 ? "[]" : G ? `[
` + G + E.join(`,
` + G) + `
` + C + "]" : "[" + E.join(",") + "]", G = C, D
          }
          if (Y && typeof Y === "object") {
            H = Y.length;
            for (F = 0; F < H; F += 1)
              if (typeof Y[F] === "string") {
                if (K = Y[F], D = W(K, U), D) E.push(J(K) + (G ? ": " : ":") + D)
              }
          } else Object.keys(U).forEach(function(w) {
            var N = W(w, U);
            if (N) E.push(J(w) + (G ? ": " : ":") + N)
          });
          return D = E.length === 0 ? "{}" : G ? `{
` + G + E.join(`,
` + G) + `
` + C + "}" : "{" + E.join(",") + "}", G = C, D
      }
    }
    if (typeof luB.stringify !== "function") luB.stringify = function(X, V, F) {
      var K;
      if (G = "", Z = "", typeof F === "number")
        for (K = 0; K < F; K += 1) Z += " ";
      else if (typeof F === "string") Z = F;
      if (Y = V, V && typeof V !== "function" && (typeof V !== "object" || typeof V.length !== "number")) throw Error("JSON.stringify");
      return W("", {
        "": X
      })
    }
  })()
})
// @from(Start 7652598, End 7658813)
suB = z((q4G, auB) => {
  var VeA = null,
    su6 = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/,
    ru6 = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/,
    ou6 = function(A) {
      var Q = {
        strict: !1,
        storeAsString: !1,
        alwaysParseAsBig: !1,
        useNativeBigInt: !1,
        protoAction: "error",
        constructorAction: "error"
      };
      if (A !== void 0 && A !== null) {
        if (A.strict === !0) Q.strict = !0;
        if (A.storeAsString === !0) Q.storeAsString = !0;
        if (Q.alwaysParseAsBig = A.alwaysParseAsBig === !0 ? A.alwaysParseAsBig : !1, Q.useNativeBigInt = A.useNativeBigInt === !0 ? A.useNativeBigInt : !1, typeof A.constructorAction < "u")
          if (A.constructorAction === "error" || A.constructorAction === "ignore" || A.constructorAction === "preserve") Q.constructorAction = A.constructorAction;
          else throw Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${A.constructorAction}`);
        if (typeof A.protoAction < "u")
          if (A.protoAction === "error" || A.protoAction === "ignore" || A.protoAction === "preserve") Q.protoAction = A.protoAction;
          else throw Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${A.protoAction}`)
      }
      var B, G, Z = {
          '"': '"',
          "\\": "\\",
          "/": "/",
          b: "\b",
          f: "\f",
          n: `
`,
          r: "\r",
          t: "\t"
        },
        I, Y = function(C) {
          throw {
            name: "SyntaxError",
            message: C,
            at: B,
            text: I
          }
        },
        J = function(C) {
          if (C && C !== G) Y("Expected '" + C + "' instead of '" + G + "'");
          return G = I.charAt(B), B += 1, G
        },
        W = function() {
          var C, E = "";
          if (G === "-") E = "-", J("-");
          while (G >= "0" && G <= "9") E += G, J();
          if (G === ".") {
            E += ".";
            while (J() && G >= "0" && G <= "9") E += G
          }
          if (G === "e" || G === "E") {
            if (E += G, J(), G === "-" || G === "+") E += G, J();
            while (G >= "0" && G <= "9") E += G, J()
          }
          if (C = +E, !isFinite(C)) Y("Bad number");
          else {
            if (VeA == null) VeA = Kl1();
            if (E.length > 15) return Q.storeAsString ? E : Q.useNativeBigInt ? BigInt(E) : new VeA(E);
            else return !Q.alwaysParseAsBig ? C : Q.useNativeBigInt ? BigInt(C) : new VeA(C)
          }
        },
        X = function() {
          var C, E, U = "",
            q;
          if (G === '"') {
            var w = B;
            while (J()) {
              if (G === '"') {
                if (B - 1 > w) U += I.substring(w, B - 1);
                return J(), U
              }
              if (G === "\\") {
                if (B - 1 > w) U += I.substring(w, B - 1);
                if (J(), G === "u") {
                  q = 0;
                  for (E = 0; E < 4; E += 1) {
                    if (C = parseInt(J(), 16), !isFinite(C)) break;
                    q = q * 16 + C
                  }
                  U += String.fromCharCode(q)
                } else if (typeof Z[G] === "string") U += Z[G];
                else break;
                w = B
              }
            }
          }
          Y("Bad string")
        },
        V = function() {
          while (G && G <= " ") J()
        },
        F = function() {
          switch (G) {
            case "t":
              return J("t"), J("r"), J("u"), J("e"), !0;
            case "f":
              return J("f"), J("a"), J("l"), J("s"), J("e"), !1;
            case "n":
              return J("n"), J("u"), J("l"), J("l"), null
          }
          Y("Unexpected '" + G + "'")
        },
        K, D = function() {
          var C = [];
          if (G === "[") {
            if (J("["), V(), G === "]") return J("]"), C;
            while (G) {
              if (C.push(K()), V(), G === "]") return J("]"), C;
              J(","), V()
            }
          }
          Y("Bad array")
        },
        H = function() {
          var C, E = Object.create(null);
          if (G === "{") {
            if (J("{"), V(), G === "}") return J("}"), E;
            while (G) {
              if (C = X(), V(), J(":"), Q.strict === !0 && Object.hasOwnProperty.call(E, C)) Y('Duplicate key "' + C + '"');
              if (su6.test(C) === !0)
                if (Q.protoAction === "error") Y("Object contains forbidden prototype property");
                else if (Q.protoAction === "ignore") K();
              else E[C] = K();
              else if (ru6.test(C) === !0)
                if (Q.constructorAction === "error") Y("Object contains forbidden constructor property");
                else if (Q.constructorAction === "ignore") K();
              else E[C] = K();
              else E[C] = K();
              if (V(), G === "}") return J("}"), E;
              J(","), V()
            }
          }
          Y("Bad object")
        };
      return K = function() {
          switch (V(), G) {
            case "{":
              return H();
            case "[":
              return D();
            case '"':
              return X();
            case "-":
              return W();
            default:
              return G >= "0" && G <= "9" ? W() : F()
          }
        },
        function(C, E) {
          var U;
          if (I = C + "", B = 0, G = " ", U = K(), V(), G) Y("Syntax error");
          return typeof E === "function" ? function q(w, N) {
            var R, T, y = w[N];
            if (y && typeof y === "object") Object.keys(y).forEach(function(v) {
              if (T = q(y, v), T !== void 0) y[v] = T;
              else delete y[v]
            });
            return E.call(w, N, y)
          }({
            "": U
          }, "") : U
        }
    };
  auB.exports = ou6
})
// @from(Start 7658819, End 7659046)
tuB = z((N4G, FeA) => {
  var ruB = nuB().stringify,
    ouB = suB();
  FeA.exports = function(A) {
    return {
      parse: ouB(A),
      stringify: ruB
    }
  };
  FeA.exports.parse = ouB();
  FeA.exports.stringify = ruB
})
// @from(Start 7659052, End 7660319)
Dl1 = z((ImB) => {
  Object.defineProperty(ImB, "__esModule", {
    value: !0
  });
  ImB.GCE_LINUX_BIOS_PATHS = void 0;
  ImB.isGoogleCloudServerless = QmB;
  ImB.isGoogleComputeEngineLinux = BmB;
  ImB.isGoogleComputeEngineMACAddress = GmB;
  ImB.isGoogleComputeEngine = ZmB;
  ImB.detectGCPResidency = eu6;
  var euB = UA("fs"),
    AmB = UA("os");
  ImB.GCE_LINUX_BIOS_PATHS = {
    BIOS_DATE: "/sys/class/dmi/id/bios_date",
    BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
  };
  var tu6 = /^42:01/;

  function QmB() {
    return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE)
  }

  function BmB() {
    if ((0, AmB.platform)() !== "linux") return !1;
    try {
      (0, euB.statSync)(ImB.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
      let A = (0, euB.readFileSync)(ImB.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
      return /Google/.test(A)
    } catch (A) {
      return !1
    }
  }

  function GmB() {
    let A = (0, AmB.networkInterfaces)();
    for (let Q of Object.values(A)) {
      if (!Q) continue;
      for (let {
          mac: B
        }
        of Q)
        if (tu6.test(B)) return !0
    }
    return !1
  }

  function ZmB() {
    return BmB() || GmB()
  }

  function eu6() {
    return QmB() || ZmB()
  }
})
// @from(Start 7660325, End 7661331)
WmB = z((YmB) => {
  Object.defineProperty(YmB, "__esModule", {
    value: !0
  });
  YmB.Colours = void 0;
  class H6 {
    static isEnabled(A) {
      return A.isTTY && (typeof A.getColorDepth === "function" ? A.getColorDepth() > 2 : !0)
    }
    static refresh() {
      if (H6.enabled = H6.isEnabled(process.stderr), !this.enabled) H6.reset = "", H6.bright = "", H6.dim = "", H6.red = "", H6.green = "", H6.yellow = "", H6.blue = "", H6.magenta = "", H6.cyan = "", H6.white = "", H6.grey = "";
      else H6.reset = "\x1B[0m", H6.bright = "\x1B[1m", H6.dim = "\x1B[2m", H6.red = "\x1B[31m", H6.green = "\x1B[32m", H6.yellow = "\x1B[33m", H6.blue = "\x1B[34m", H6.magenta = "\x1B[35m", H6.cyan = "\x1B[36m", H6.white = "\x1B[37m", H6.grey = "\x1B[90m"
    }
  }
  YmB.Colours = H6;
  H6.enabled = !1;
  H6.reset = "";
  H6.bright = "";
  H6.dim = "";
  H6.red = "";
  H6.green = "";
  H6.yellow = "";
  H6.blue = "";
  H6.magenta = "";
  H6.cyan = "";
  H6.white = "";
  H6.grey = "";
  H6.refresh()
})
// @from(Start 7661337, End 7667737)
HmB = z((bG) => {
  var Im6 = bG && bG.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Ym6 = bG && bG.__setModuleDefault || (Object.create ? function(A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function(A, Q) {
      A.default = Q
    }),
    XmB = bG && bG.__importStar || function(A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) Im6(Q, A, B)
      }
      return Ym6(Q, A), Q
    };
  Object.defineProperty(bG, "__esModule", {
    value: !0
  });
  bG.env = bG.DebugLogBackendBase = bG.placeholder = bG.AdhocDebugLogger = bG.LogSeverity = void 0;
  bG.getNodeBackend = Hl1;
  bG.getDebugBackend = Wm6;
  bG.getStructuredBackend = Xm6;
  bG.setBackend = Vm6;
  bG.log = DmB;
  var Jm6 = UA("node:events"),
    LwA = XmB(UA("node:process")),
    VmB = XmB(UA("node:util")),
    Iq = WmB(),
    jT;
  (function(A) {
    A.DEFAULT = "DEFAULT", A.DEBUG = "DEBUG", A.INFO = "INFO", A.WARNING = "WARNING", A.ERROR = "ERROR"
  })(jT || (bG.LogSeverity = jT = {}));
  class DeA extends Jm6.EventEmitter {
    constructor(A, Q) {
      super();
      this.namespace = A, this.upstream = Q, this.func = Object.assign(this.invoke.bind(this), {
        instance: this,
        on: (B, G) => this.on(B, G)
      }), this.func.debug = (...B) => this.invokeSeverity(jT.DEBUG, ...B), this.func.info = (...B) => this.invokeSeverity(jT.INFO, ...B), this.func.warn = (...B) => this.invokeSeverity(jT.WARNING, ...B), this.func.error = (...B) => this.invokeSeverity(jT.ERROR, ...B), this.func.sublog = (B) => DmB(B, this.func)
    }
    invoke(A, ...Q) {
      if (this.upstream) this.upstream(A, ...Q);
      this.emit("log", A, Q)
    }
    invokeSeverity(A, ...Q) {
      this.invoke({
        severity: A
      }, ...Q)
    }
  }
  bG.AdhocDebugLogger = DeA;
  bG.placeholder = new DeA("", () => {}).func;
  class MwA {
    constructor() {
      var A;
      this.cached = new Map, this.filters = [], this.filtersSet = !1;
      let Q = (A = LwA.env[bG.env.nodeEnables]) !== null && A !== void 0 ? A : "*";
      if (Q === "all") Q = "*";
      this.filters = Q.split(",")
    }
    log(A, Q, ...B) {
      try {
        if (!this.filtersSet) this.setFilters(), this.filtersSet = !0;
        let G = this.cached.get(A);
        if (!G) G = this.makeLogger(A), this.cached.set(A, G);
        G(Q, ...B)
      } catch (G) {
        console.error(G)
      }
    }
  }
  bG.DebugLogBackendBase = MwA;
  class El1 extends MwA {
    constructor() {
      super(...arguments);
      this.enabledRegexp = /.*/g
    }
    isEnabled(A) {
      return this.enabledRegexp.test(A)
    }
    makeLogger(A) {
      if (!this.enabledRegexp.test(A)) return () => {};
      return (Q, ...B) => {
        var G;
        let Z = `${Iq.Colours.green}${A}${Iq.Colours.reset}`,
          I = `${Iq.Colours.yellow}${LwA.pid}${Iq.Colours.reset}`,
          Y;
        switch (Q.severity) {
          case jT.ERROR:
            Y = `${Iq.Colours.red}${Q.severity}${Iq.Colours.reset}`;
            break;
          case jT.INFO:
            Y = `${Iq.Colours.magenta}${Q.severity}${Iq.Colours.reset}`;
            break;
          case jT.WARNING:
            Y = `${Iq.Colours.yellow}${Q.severity}${Iq.Colours.reset}`;
            break;
          default:
            Y = (G = Q.severity) !== null && G !== void 0 ? G : jT.DEFAULT;
            break
        }
        let J = VmB.formatWithOptions({
            colors: Iq.Colours.enabled
          }, ...B),
          W = Object.assign({}, Q);
        delete W.severity;
        let X = Object.getOwnPropertyNames(W).length ? JSON.stringify(W) : "",
          V = X ? `${Iq.Colours.grey}${X}${Iq.Colours.reset}` : "";
        console.error("%s [%s|%s] %s%s", I, Z, Y, J, X ? ` ${V}` : "")
      }
    }
    setFilters() {
      let Q = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
      this.enabledRegexp = new RegExp(`^${Q}$`, "i")
    }
  }

  function Hl1() {
    return new El1
  }
  class FmB extends MwA {
    constructor(A) {
      super();
      this.debugPkg = A
    }
    makeLogger(A) {
      let Q = this.debugPkg(A);
      return (B, ...G) => {
        Q(G[0], ...G.slice(1))
      }
    }
    setFilters() {
      var A;
      let Q = (A = LwA.env.NODE_DEBUG) !== null && A !== void 0 ? A : "";
      LwA.env.NODE_DEBUG = `${Q}${Q?",":""}${this.filters.join(",")}`
    }
  }

  function Wm6(A) {
    return new FmB(A)
  }
  class KmB extends MwA {
    constructor(A) {
      var Q;
      super();
      this.upstream = (Q = A) !== null && Q !== void 0 ? Q : new El1
    }
    makeLogger(A) {
      let Q = this.upstream.makeLogger(A);
      return (B, ...G) => {
        var Z;
        let I = (Z = B.severity) !== null && Z !== void 0 ? Z : jT.INFO,
          Y = Object.assign({
            severity: I,
            message: VmB.format(...G)
          }, B),
          J = JSON.stringify(Y);
        Q(B, J)
      }
    }
    setFilters() {
      this.upstream.setFilters()
    }
  }

  function Xm6(A) {
    return new KmB(A)
  }
  bG.env = {
    nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
  };
  var Cl1 = new Map,
    LM = void 0;

  function Vm6(A) {
    LM = A, Cl1.clear()
  }

  function DmB(A, Q) {
    if (!LwA.env[bG.env.nodeEnables]) return bG.placeholder;
    if (!A) return bG.placeholder;
    if (Q) A = `${Q.instance.namespace}:${A}`;
    let G = Cl1.get(A);
    if (G) return G.func;
    if (LM === null) return bG.placeholder;
    else if (LM === void 0) LM = Hl1();
    let Z = (() => {
      let I = void 0;
      return new DeA(A, (J, ...W) => {
        if (I !== LM) {
          if (LM === null) return;
          else if (LM === void 0) LM = Hl1();
          I = LM
        }
        LM === null || LM === void 0 || LM.log(A, J, ...W)
      })
    })();
    return Cl1.set(A, Z), Z.func
  }
})
// @from(Start 7667743, End 7668478)
CmB = z((ze) => {
  var Fm6 = ze && ze.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Km6 = ze && ze.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Fm6(Q, A, B)
    };
  Object.defineProperty(ze, "__esModule", {
    value: !0
  });
  Km6(HmB(), ze)
})
// @from(Start 7668484, End 7674998)
RwA = z((H4) => {
  var Dm6 = H4 && H4.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    Hm6 = H4 && H4.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Dm6(Q, A, B)
    };
  Object.defineProperty(H4, "__esModule", {
    value: !0
  });
  H4.gcpResidencyCache = H4.METADATA_SERVER_DETECTION = H4.HEADERS = H4.HEADER_VALUE = H4.HEADER_NAME = H4.SECONDARY_HOST_ADDRESS = H4.HOST_ADDRESS = H4.BASE_PATH = void 0;
  H4.instance = wm6;
  H4.project = qm6;
  H4.universe = Nm6;
  H4.bulk = Lm6;
  H4.isAvailable = Om6;
  H4.resetIsAvailableCache = Rm6;
  H4.getGCPResidency = $l1;
  H4.setGCPResidency = zmB;
  H4.requestTimeout = UmB;
  var zl1 = PT(),
    Cm6 = tuB(),
    Em6 = Dl1(),
    zm6 = CmB();
  H4.BASE_PATH = "/computeMetadata/v1";
  H4.HOST_ADDRESS = "http://169.254.169.254";
  H4.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
  H4.HEADER_NAME = "Metadata-Flavor";
  H4.HEADER_VALUE = "Google";
  H4.HEADERS = Object.freeze({
    [H4.HEADER_NAME]: H4.HEADER_VALUE
  });
  var EmB = zm6.log("gcp metadata");
  H4.METADATA_SERVER_DETECTION = Object.freeze({
    "assume-present": "don't try to ping the metadata server, but assume it's present",
    none: "don't try to ping the metadata server, but don't try to use it either",
    "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
    "ping-only": "skip the BIOS probe, and go straight to pinging"
  });

  function Ul1(A) {
    if (!A) A = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || H4.HOST_ADDRESS;
    if (!/^https?:\/\//.test(A)) A = `http://${A}`;
    return new URL(H4.BASE_PATH, A).href
  }

  function Um6(A) {
    Object.keys(A).forEach((Q) => {
      switch (Q) {
        case "params":
        case "property":
        case "headers":
          break;
        case "qs":
          throw Error("'qs' is not a valid configuration option. Please use 'params' instead.");
        default:
          throw Error(`'${Q}' is not a valid configuration option.`)
      }
    })
  }
  async function OwA(A, Q = {}, B = 3, G = !1) {
    let Z = "",
      I = {},
      Y = {};
    if (typeof A === "object") {
      let V = A;
      Z = V.metadataKey, I = V.params || I, Y = V.headers || Y, B = V.noResponseRetries || B, G = V.fastFail || G
    } else Z = A;
    if (typeof Q === "string") Z += `/${Q}`;
    else {
      if (Um6(Q), Q.property) Z += `/${Q.property}`;
      Y = Q.headers || Y, I = Q.params || I
    }
    let J = G ? $m6 : zl1.request,
      W = {
        url: `${Ul1()}/${Z}`,
        headers: {
          ...H4.HEADERS,
          ...Y
        },
        retryConfig: {
          noResponseRetries: B
        },
        params: I,
        responseType: "text",
        timeout: UmB()
      };
    EmB.info("instance request %j", W);
    let X = await J(W);
    if (EmB.info("instance metadata is %s", X.data), X.headers[H4.HEADER_NAME.toLowerCase()] !== H4.HEADER_VALUE) throw Error(`Invalid response from metadata service: incorrect ${H4.HEADER_NAME} header. Expected '${H4.HEADER_VALUE}', got ${X.headers[H4.HEADER_NAME.toLowerCase()]?`'${X.headers[H4.HEADER_NAME.toLowerCase()]}'`:"no header"}`);
    if (typeof X.data === "string") try {
      return Cm6.parse(X.data)
    } catch (V) {}
    return X.data
  }
  async function $m6(A) {
    var Q;
    let B = {
        ...A,
        url: (Q = A.url) === null || Q === void 0 ? void 0 : Q.toString().replace(Ul1(), Ul1(H4.SECONDARY_HOST_ADDRESS))
      },
      G = !1,
      Z = (0, zl1.request)(A).then((Y) => {
        return G = !0, Y
      }).catch((Y) => {
        if (G) return I;
        else throw G = !0, Y
      }),
      I = (0, zl1.request)(B).then((Y) => {
        return G = !0, Y
      }).catch((Y) => {
        if (G) return Z;
        else throw G = !0, Y
      });
    return Promise.race([Z, I])
  }

  function wm6(A) {
    return OwA("instance", A)
  }

  function qm6(A) {
    return OwA("project", A)
  }

  function Nm6(A) {
    return OwA("universe", A)
  }
  async function Lm6(A) {
    let Q = {};
    return await Promise.all(A.map((B) => {
      return (async () => {
        let G = await OwA(B),
          Z = B.metadataKey;
        Q[Z] = G
      })()
    })), Q
  }

  function Mm6() {
    return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0
  }
  var HeA;
  async function Om6() {
    if (process.env.METADATA_SERVER_DETECTION) {
      let A = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
      if (!(A in H4.METADATA_SERVER_DETECTION)) throw RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${A}\`, but it should be \`${Object.keys(H4.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
      switch (A) {
        case "assume-present":
          return !0;
        case "none":
          return !1;
        case "bios-only":
          return $l1();
        case "ping-only":
      }
    }
    try {
      if (HeA === void 0) HeA = OwA("instance", void 0, Mm6(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
      return await HeA, !0
    } catch (A) {
      let Q = A;
      if (process.env.DEBUG_AUTH) console.info(Q);
      if (Q.type === "request-timeout") return !1;
      if (Q.response && Q.response.status === 404) return !1;
      else {
        if (!(Q.response && Q.response.status === 404) && (!Q.code || !["EHOSTDOWN", "EHOSTUNREACH", "ENETUNREACH", "ENOENT", "ENOTFOUND", "ECONNREFUSED"].includes(Q.code))) {
          let B = "UNKNOWN";
          if (Q.code) B = Q.code;
          process.emitWarning(`received unexpected error = ${Q.message} code = ${B}`, "MetadataLookupWarning")
        }
        return !1
      }
    }
  }

  function Rm6() {
    HeA = void 0
  }
  H4.gcpResidencyCache = null;

  function $l1() {
    if (H4.gcpResidencyCache === null) zmB();
    return H4.gcpResidencyCache
  }

  function zmB(A = null) {
    H4.gcpResidencyCache = A !== null ? A : (0, Em6.detectGCPResidency)()
  }

  function UmB() {
    return $l1() ? 0 : 3000
  }
  Hm6(Dl1(), H4)
})
// @from(Start 7675004, End 7677152)
Nl1 = z((xm6) => {
  xm6.byteLength = Pm6;
  xm6.toByteArray = Sm6;
  xm6.fromByteArray = ym6;
  var Ak = [],
    MM = [],
    Tm6 = typeof Uint8Array < "u" ? Uint8Array : Array,
    wl1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (cp = 0, ql1 = wl1.length; cp < ql1; ++cp) Ak[cp] = wl1[cp], MM[wl1.charCodeAt(cp)] = cp;
  var cp, ql1;
  MM[45] = 62;
  MM[95] = 63;

  function $mB(A) {
    var Q = A.length;
    if (Q % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
    var B = A.indexOf("=");
    if (B === -1) B = Q;
    var G = B === Q ? 0 : 4 - B % 4;
    return [B, G]
  }

  function Pm6(A) {
    var Q = $mB(A),
      B = Q[0],
      G = Q[1];
    return (B + G) * 3 / 4 - G
  }

  function jm6(A, Q, B) {
    return (Q + B) * 3 / 4 - B
  }

  function Sm6(A) {
    var Q, B = $mB(A),
      G = B[0],
      Z = B[1],
      I = new Tm6(jm6(A, G, Z)),
      Y = 0,
      J = Z > 0 ? G - 4 : G,
      W;
    for (W = 0; W < J; W += 4) Q = MM[A.charCodeAt(W)] << 18 | MM[A.charCodeAt(W + 1)] << 12 | MM[A.charCodeAt(W + 2)] << 6 | MM[A.charCodeAt(W + 3)], I[Y++] = Q >> 16 & 255, I[Y++] = Q >> 8 & 255, I[Y++] = Q & 255;
    if (Z === 2) Q = MM[A.charCodeAt(W)] << 2 | MM[A.charCodeAt(W + 1)] >> 4, I[Y++] = Q & 255;
    if (Z === 1) Q = MM[A.charCodeAt(W)] << 10 | MM[A.charCodeAt(W + 1)] << 4 | MM[A.charCodeAt(W + 2)] >> 2, I[Y++] = Q >> 8 & 255, I[Y++] = Q & 255;
    return I
  }

  function _m6(A) {
    return Ak[A >> 18 & 63] + Ak[A >> 12 & 63] + Ak[A >> 6 & 63] + Ak[A & 63]
  }

  function km6(A, Q, B) {
    var G, Z = [];
    for (var I = Q; I < B; I += 3) G = (A[I] << 16 & 16711680) + (A[I + 1] << 8 & 65280) + (A[I + 2] & 255), Z.push(_m6(G));
    return Z.join("")
  }

  function ym6(A) {
    var Q, B = A.length,
      G = B % 3,
      Z = [],
      I = 16383;
    for (var Y = 0, J = B - G; Y < J; Y += I) Z.push(km6(A, Y, Y + I > J ? J : Y + I));
    if (G === 1) Q = A[B - 1], Z.push(Ak[Q >> 2] + Ak[Q << 4 & 63] + "==");
    else if (G === 2) Q = (A[B - 2] << 8) + A[B - 1], Z.push(Ak[Q >> 10] + Ak[Q >> 4 & 63] + Ak[Q << 2 & 63] + "=");
    return Z.join("")
  }
})
// @from(Start 7677158, End 7679552)
NmB = z((wmB) => {
  Object.defineProperty(wmB, "__esModule", {
    value: !0
  });
  wmB.BrowserCrypto = void 0;
  var cGA = Nl1(),
    hm6 = pGA();
  class CeA {
    constructor() {
      if (typeof window > "u" || window.crypto === void 0 || window.crypto.subtle === void 0) throw Error("SubtleCrypto not found. Make sure it's an https:// website.")
    }
    async sha256DigestBase64(A) {
      let Q = new TextEncoder().encode(A),
        B = await window.crypto.subtle.digest("SHA-256", Q);
      return cGA.fromByteArray(new Uint8Array(B))
    }
    randomBytesBase64(A) {
      let Q = new Uint8Array(A);
      return window.crypto.getRandomValues(Q), cGA.fromByteArray(Q)
    }
    static padBase64(A) {
      while (A.length % 4 !== 0) A += "=";
      return A
    }
    async verify(A, Q, B) {
      let G = {
          name: "RSASSA-PKCS1-v1_5",
          hash: {
            name: "SHA-256"
          }
        },
        Z = new TextEncoder().encode(Q),
        I = cGA.toByteArray(CeA.padBase64(B)),
        Y = await window.crypto.subtle.importKey("jwk", A, G, !0, ["verify"]);
      return await window.crypto.subtle.verify(G, Y, I, Z)
    }
    async sign(A, Q) {
      let B = {
          name: "RSASSA-PKCS1-v1_5",
          hash: {
            name: "SHA-256"
          }
        },
        G = new TextEncoder().encode(Q),
        Z = await window.crypto.subtle.importKey("jwk", A, B, !0, ["sign"]),
        I = await window.crypto.subtle.sign(B, Z, G);
      return cGA.fromByteArray(new Uint8Array(I))
    }
    decodeBase64StringUtf8(A) {
      let Q = cGA.toByteArray(CeA.padBase64(A));
      return new TextDecoder().decode(Q)
    }
    encodeBase64StringUtf8(A) {
      let Q = new TextEncoder().encode(A);
      return cGA.fromByteArray(Q)
    }
    async sha256DigestHex(A) {
      let Q = new TextEncoder().encode(A),
        B = await window.crypto.subtle.digest("SHA-256", Q);
      return (0, hm6.fromArrayBufferToHex)(B)
    }
    async signWithHmacSha256(A, Q) {
      let B = typeof A === "string" ? A : String.fromCharCode(...new Uint16Array(A)),
        G = new TextEncoder,
        Z = await window.crypto.subtle.importKey("raw", G.encode(B), {
          name: "HMAC",
          hash: {
            name: "SHA-256"
          }
        }, !1, ["sign"]);
      return window.crypto.subtle.sign("HMAC", Z, G.encode(Q))
    }
  }
  wmB.BrowserCrypto = CeA
})
// @from(Start 7679558, End 7680786)
RmB = z((MmB) => {
  Object.defineProperty(MmB, "__esModule", {
    value: !0
  });
  MmB.NodeCrypto = void 0;
  var lGA = UA("crypto");
  class LmB {
    async sha256DigestBase64(A) {
      return lGA.createHash("sha256").update(A).digest("base64")
    }
    randomBytesBase64(A) {
      return lGA.randomBytes(A).toString("base64")
    }
    async verify(A, Q, B) {
      let G = lGA.createVerify("RSA-SHA256");
      return G.update(Q), G.end(), G.verify(A, B, "base64")
    }
    async sign(A, Q) {
      let B = lGA.createSign("RSA-SHA256");
      return B.update(Q), B.end(), B.sign(A, "base64")
    }
    decodeBase64StringUtf8(A) {
      return Buffer.from(A, "base64").toString("utf-8")
    }
    encodeBase64StringUtf8(A) {
      return Buffer.from(A, "utf-8").toString("base64")
    }
    async sha256DigestHex(A) {
      return lGA.createHash("sha256").update(A).digest("hex")
    }
    async signWithHmacSha256(A, Q) {
      let B = typeof A === "string" ? A : um6(A);
      return gm6(lGA.createHmac("sha256", B).update(Q).digest())
    }
  }
  MmB.NodeCrypto = LmB;

  function gm6(A) {
    return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
  }

  function um6(A) {
    return Buffer.from(A)
  }
})
// @from(Start 7680792, End 7681365)
pGA = z((PmB) => {
  Object.defineProperty(PmB, "__esModule", {
    value: !0
  });
  PmB.createCrypto = cm6;
  PmB.hasBrowserCrypto = TmB;
  PmB.fromArrayBufferToHex = pm6;
  var mm6 = NmB(),
    dm6 = RmB();

  function cm6() {
    if (TmB()) return new mm6.BrowserCrypto;
    return new dm6.NodeCrypto
  }

  function TmB() {
    return typeof window < "u" && typeof window.crypto < "u" && typeof window.crypto.subtle < "u"
  }

  function pm6(A) {
    return Array.from(new Uint8Array(A)).map((B) => {
      return B.toString(16).padStart(2, "0")
    }).join("")
  }
})
// @from(Start 7681371, End 7681997)
SmB = z((jmB) => {
  Object.defineProperty(jmB, "__esModule", {
    value: !0
  });
  jmB.validate = am6;

  function am6(A) {
    let Q = [{
      invalid: "uri",
      expected: "url"
    }, {
      invalid: "json",
      expected: "data"
    }, {
      invalid: "qs",
      expected: "params"
    }];
    for (let B of Q)
      if (A[B.invalid]) {
        let G = `'${B.invalid}' is not a valid configuration option. Please use '${B.expected}' instead. This library is using Axios for requests. Please see https://github.com/axios/axios to learn more about the valid request options.`;
        throw Error(G)
      }
  }
})
// @from(Start 7682003, End 7684695)
Ll1 = z((y4G, rm6) => {
  rm6.exports = {
    name: "google-auth-library",
    version: "9.15.1",
    author: "Google Inc.",
    description: "Google APIs Authentication Client Library for Node.js",
    engines: {
      node: ">=14"
    },
    main: "./build/src/index.js",
    types: "./build/src/index.d.ts",
    repository: "googleapis/google-auth-library-nodejs.git",
    keywords: ["google", "api", "google apis", "client", "client library"],
    dependencies: {
      "base64-js": "^1.3.0",
      "ecdsa-sig-formatter": "^1.0.11",
      gaxios: "^6.1.1",
      "gcp-metadata": "^6.1.0",
      gtoken: "^7.0.0",
      jws: "^4.0.0"
    },
    devDependencies: {
      "@types/base64-js": "^1.2.5",
      "@types/chai": "^4.1.7",
      "@types/jws": "^3.1.0",
      "@types/mocha": "^9.0.0",
      "@types/mv": "^2.1.0",
      "@types/ncp": "^2.0.1",
      "@types/node": "^20.4.2",
      "@types/sinon": "^17.0.0",
      "assert-rejects": "^1.0.0",
      c8: "^8.0.0",
      chai: "^4.2.0",
      cheerio: "1.0.0-rc.12",
      codecov: "^3.0.2",
      "engine.io": "6.6.2",
      gts: "^5.0.0",
      "is-docker": "^2.0.0",
      jsdoc: "^4.0.0",
      "jsdoc-fresh": "^3.0.0",
      "jsdoc-region-tag": "^3.0.0",
      karma: "^6.0.0",
      "karma-chrome-launcher": "^3.0.0",
      "karma-coverage": "^2.0.0",
      "karma-firefox-launcher": "^2.0.0",
      "karma-mocha": "^2.0.0",
      "karma-sourcemap-loader": "^0.4.0",
      "karma-webpack": "5.0.0",
      keypair: "^1.0.4",
      linkinator: "^4.0.0",
      mocha: "^9.2.2",
      mv: "^2.1.1",
      ncp: "^2.0.0",
      nock: "^13.0.0",
      "null-loader": "^4.0.0",
      pdfmake: "0.2.12",
      puppeteer: "^21.0.0",
      sinon: "^18.0.0",
      "ts-loader": "^8.0.0",
      typescript: "^5.1.6",
      webpack: "^5.21.2",
      "webpack-cli": "^4.0.0"
    },
    files: ["build/src", "!build/src/**/*.map"],
    scripts: {
      test: "c8 mocha build/test",
      clean: "gts clean",
      prepare: "npm run compile",
      lint: "gts check",
      compile: "tsc -p .",
      fix: "gts fix",
      pretest: "npm run compile -- --sourceMap",
      docs: "jsdoc -c .jsdoc.json",
      "samples-setup": "cd samples/ && npm link ../ && npm run setup && cd ../",
      "samples-test": "cd samples/ && npm link ../ && npm test && cd ../",
      "system-test": "mocha build/system-test --timeout 60000",
      "presystem-test": "npm run compile -- --sourceMap",
      webpack: "webpack",
      "browser-test": "karma start",
      "docs-test": "linkinator docs",
      "predocs-test": "npm run docs",
      prelint: "cd samples; npm link ../; npm install",
      precompile: "gts clean"
    },
    license: "Apache-2.0"
  }
})
// @from(Start 7684701, End 7686373)
PwA = z((kmB) => {
  Object.defineProperty(kmB, "__esModule", {
    value: !0
  });
  kmB.DefaultTransporter = void 0;
  var om6 = PT(),
    tm6 = SmB(),
    em6 = Ll1(),
    _mB = "google-api-nodejs-client";
  class TwA {
    constructor() {
      this.instance = new om6.Gaxios
    }
    configure(A = {}) {
      if (A.headers = A.headers || {}, typeof window > "u") {
        let Q = A.headers["User-Agent"];
        if (!Q) A.headers["User-Agent"] = TwA.USER_AGENT;
        else if (!Q.includes(`${_mB}/`)) A.headers["User-Agent"] = `${Q} ${TwA.USER_AGENT}`;
        if (!A.headers["x-goog-api-client"]) {
          let B = process.version.replace(/^v/, "");
          A.headers["x-goog-api-client"] = `gl-node/${B}`
        }
      }
      return A
    }
    request(A) {
      return A = this.configure(A), (0, tm6.validate)(A), this.instance.request(A).catch((Q) => {
        throw this.processError(Q)
      })
    }
    get defaults() {
      return this.instance.defaults
    }
    set defaults(A) {
      this.instance.defaults = A
    }
    processError(A) {
      let Q = A.response,
        B = A,
        G = Q ? Q.data : null;
      if (Q && G && G.error && Q.status !== 200)
        if (typeof G.error === "string") B.message = G.error, B.status = Q.status;
        else if (Array.isArray(G.error.errors)) B.message = G.error.errors.map((Z) => Z.message).join(`
`), B.code = G.error.code, B.errors = G.error.errors;
      else B.message = G.error.message, B.code = G.error.code;
      else if (Q && Q.status >= 400) B.message = G, B.status = Q.status;
      return B
    }
  }
  kmB.DefaultTransporter = TwA;
  TwA.USER_AGENT = `${_mB}/${em6.version}`
})
// @from(Start 7686379, End 7687516)
Bk = z((Ml1, vmB) => {
  /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
  var EeA = UA("buffer"),
    Qk = EeA.Buffer;

  function xmB(A, Q) {
    for (var B in A) Q[B] = A[B]
  }
  if (Qk.from && Qk.alloc && Qk.allocUnsafe && Qk.allocUnsafeSlow) vmB.exports = EeA;
  else xmB(EeA, Ml1), Ml1.Buffer = Ue;

  function Ue(A, Q, B) {
    return Qk(A, Q, B)
  }
  Ue.prototype = Object.create(Qk.prototype);
  xmB(Qk, Ue);
  Ue.from = function(A, Q, B) {
    if (typeof A === "number") throw TypeError("Argument must not be a number");
    return Qk(A, Q, B)
  };
  Ue.alloc = function(A, Q, B) {
    if (typeof A !== "number") throw TypeError("Argument must be a number");
    var G = Qk(A);
    if (Q !== void 0)
      if (typeof B === "string") G.fill(Q, B);
      else G.fill(Q);
    else G.fill(0);
    return G
  };
  Ue.allocUnsafe = function(A) {
    if (typeof A !== "number") throw TypeError("Argument must be a number");
    return Qk(A)
  };
  Ue.allocUnsafeSlow = function(A) {
    if (typeof A !== "number") throw TypeError("Argument must be a number");
    return EeA.SlowBuffer(A)
  }
})
// @from(Start 7687522, End 7687850)
fmB = z((v4G, bmB) => {
  function Ol1(A) {
    var Q = (A / 8 | 0) + (A % 8 === 0 ? 0 : 1);
    return Q
  }
  var Ad6 = {
    ES256: Ol1(256),
    ES384: Ol1(384),
    ES512: Ol1(521)
  };

  function Qd6(A) {
    var Q = Ad6[A];
    if (Q) return Q;
    throw Error('Unknown algorithm "' + A + '"')
  }
  bmB.exports = Qd6
})
// @from(Start 7687856, End 7690673)
weA = z((b4G, cmB) => {
  var zeA = Bk().Buffer,
    gmB = fmB(),
    UeA = 128,
    umB = 0,
    Bd6 = 32,
    Gd6 = 16,
    Zd6 = 2,
    mmB = Gd6 | Bd6 | umB << 6,
    $eA = Zd6 | umB << 6;

  function Id6(A) {
    return A.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }

  function dmB(A) {
    if (zeA.isBuffer(A)) return A;
    else if (typeof A === "string") return zeA.from(A, "base64");
    throw TypeError("ECDSA signature must be a Base64 string or a Buffer")
  }

  function Yd6(A, Q) {
    A = dmB(A);
    var B = gmB(Q),
      G = B + 1,
      Z = A.length,
      I = 0;
    if (A[I++] !== mmB) throw Error('Could not find expected "seq"');
    var Y = A[I++];
    if (Y === (UeA | 1)) Y = A[I++];
    if (Z - I < Y) throw Error('"seq" specified length of "' + Y + '", only "' + (Z - I) + '" remaining');
    if (A[I++] !== $eA) throw Error('Could not find expected "int" for "r"');
    var J = A[I++];
    if (Z - I - 2 < J) throw Error('"r" specified length of "' + J + '", only "' + (Z - I - 2) + '" available');
    if (G < J) throw Error('"r" specified length of "' + J + '", max of "' + G + '" is acceptable');
    var W = I;
    if (I += J, A[I++] !== $eA) throw Error('Could not find expected "int" for "s"');
    var X = A[I++];
    if (Z - I !== X) throw Error('"s" specified length of "' + X + '", expected "' + (Z - I) + '"');
    if (G < X) throw Error('"s" specified length of "' + X + '", max of "' + G + '" is acceptable');
    var V = I;
    if (I += X, I !== Z) throw Error('Expected to consume entire buffer, but "' + (Z - I) + '" bytes remain');
    var F = B - J,
      K = B - X,
      D = zeA.allocUnsafe(F + J + K + X);
    for (I = 0; I < F; ++I) D[I] = 0;
    A.copy(D, I, W + Math.max(-F, 0), W + J), I = B;
    for (var H = I; I < H + K; ++I) D[I] = 0;
    return A.copy(D, I, V + Math.max(-K, 0), V + X), D = D.toString("base64"), D = Id6(D), D
  }

  function hmB(A, Q, B) {
    var G = 0;
    while (Q + G < B && A[Q + G] === 0) ++G;
    var Z = A[Q + G] >= UeA;
    if (Z) --G;
    return G
  }

  function Jd6(A, Q) {
    A = dmB(A);
    var B = gmB(Q),
      G = A.length;
    if (G !== B * 2) throw TypeError('"' + Q + '" signatures must be "' + B * 2 + '" bytes, saw "' + G + '"');
    var Z = hmB(A, 0, B),
      I = hmB(A, B, A.length),
      Y = B - Z,
      J = B - I,
      W = 2 + Y + 1 + 1 + J,
      X = W < UeA,
      V = zeA.allocUnsafe((X ? 2 : 3) + W),
      F = 0;
    if (V[F++] = mmB, X) V[F++] = W;
    else V[F++] = UeA | 1, V[F++] = W & 255;
    if (V[F++] = $eA, V[F++] = Y, Z < 0) V[F++] = 0, F += A.copy(V, F, 0, B);
    else F += A.copy(V, F, Z, B);
    if (V[F++] = $eA, V[F++] = J, I < 0) V[F++] = 0, A.copy(V, F, B);
    else A.copy(V, F, B + I);
    return V
  }
  cmB.exports = {
    derToJose: Yd6,
    joseToDer: Jd6
  }
})
// @from(Start 7690679, End 7692477)
lp = z((pp) => {
  var ST = pp && pp.__classPrivateFieldGet || function(A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    iGA, Lf, Rl1, Tl1;
  Object.defineProperty(pp, "__esModule", {
    value: !0
  });
  pp.LRUCache = void 0;
  pp.snakeToCamel = pmB;
  pp.originalOrCamelOptions = Wd6;

  function pmB(A) {
    return A.replace(/([_][^_])/g, (Q) => Q.slice(1).toUpperCase())
  }

  function Wd6(A) {
    function Q(B) {
      var G;
      let Z = A || {};
      return (G = Z[B]) !== null && G !== void 0 ? G : Z[pmB(B)]
    }
    return {
      get: Q
    }
  }
  class lmB {
    constructor(A) {
      iGA.add(this), Lf.set(this, new Map), this.capacity = A.capacity, this.maxAge = A.maxAge
    }
    set(A, Q) {
      ST(this, iGA, "m", Rl1).call(this, A, Q), ST(this, iGA, "m", Tl1).call(this)
    }
    get(A) {
      let Q = ST(this, Lf, "f").get(A);
      if (!Q) return;
      return ST(this, iGA, "m", Rl1).call(this, A, Q.value), ST(this, iGA, "m", Tl1).call(this), Q.value
    }
  }
  pp.LRUCache = lmB;
  Lf = new WeakMap, iGA = new WeakSet, Rl1 = function(Q, B) {
    ST(this, Lf, "f").delete(Q), ST(this, Lf, "f").set(Q, {
      value: B,
      lastAccessed: Date.now()
    })
  }, Tl1 = function() {
    let Q = this.maxAge ? Date.now() - this.maxAge : 0,
      B = ST(this, Lf, "f").entries().next();
    while (!B.done && (ST(this, Lf, "f").size > this.capacity || B.value[1].lastAccessed < Q)) ST(this, Lf, "f").delete(B.value[0]), B = ST(this, Lf, "f").entries().next()
  }
})