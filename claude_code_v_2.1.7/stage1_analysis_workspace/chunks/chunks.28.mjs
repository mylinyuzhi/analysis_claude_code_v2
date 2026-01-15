
// @from(Ln 70114, Col 4)
A$Q = U((hZA) => {
  var Ec4 = hZA && hZA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(hZA, "__esModule", {
    value: !0
  });
  hZA._fetchTxtRecords = void 0;
  var zc4 = new Uint8Array([0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 13, 102, 101, 97, 116, 117, 114, 101, 97, 115, 115, 101, 116, 115, 3, 111, 114, 103, 0, 0, 16, 0, 1]),
    $c4 = "https://cloudflare-dns.com/dns-query",
    Cc4 = ["i", "e", "d"],
    Uc4 = 200;

  function qc4(A) {
    return Ec4(this, void 0, void 0, function* () {
      let Q = yield A($c4, {
        method: "POST",
        headers: {
          "Content-Type": "application/dns-message",
          Accept: "application/dns-message"
        },
        body: zc4
      });
      if (!Q.ok) {
        let Z = Error("Failed to fetch TXT records from DNS");
        throw Z.name = "DnsTxtFetchError", Z
      }
      let B = yield Q.arrayBuffer(), G = new Uint8Array(B);
      return Nc4(G)
    })
  }
  hZA._fetchTxtRecords = qc4;

  function Nc4(A) {
    let Q = A.findIndex((G, Z) => Z < Uc4 && String.fromCharCode(G) === "=" && Cc4.includes(String.fromCharCode(A[Z - 1])));
    if (Q === -1) {
      let G = Error("Failed to parse TXT records from DNS");
      throw G.name = "DnsTxtParseError", G
    }
    let B = "";
    for (let G = Q - 1; G < A.length; G++) B += String.fromCharCode(A[G]);
    return B.split(",")
  }
})
// @from(Ln 70184, Col 4)
X$Q = U((fi) => {
  var Q$Q = fi && fi.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(fi, "__esModule", {
    value: !0
  });
  fi._isDomainFailure = fi.NetworkFallbackResolver = void 0;
  var wc4 = A$Q(),
    Lc4 = xZA(),
    Oc4 = Yz(),
    MP1 = vg(),
    B$Q = 604800000,
    Mc4 = 14400000;
  class Z$Q {
    constructor(A) {
      var Q;
      this._fallbackInfo = null, this._errorBoundary = null, this._dnsQueryCooldowns = {}, this._networkOverrideFunc = (Q = A.networkConfig) === null || Q === void 0 ? void 0 : Q.networkOverrideFunc
    }
    setErrorBoundary(A) {
      this._errorBoundary = A
    }
    tryBumpExpiryTime(A, Q) {
      var B;
      let G = (B = this._fallbackInfo) === null || B === void 0 ? void 0 : B[Q.endpoint];
      if (!G) return;
      G.expiryTime = Date.now() + B$Q, OP1(A, Object.assign(Object.assign({}, this._fallbackInfo), {
        [Q.endpoint]: G
      }))
    }
    getActiveFallbackUrl(A, Q) {
      var B, G;
      let Z = this._fallbackInfo;
      if (Z == null) Z = (B = Rc4(A)) !== null && B !== void 0 ? B : {}, this._fallbackInfo = Z;
      let Y = Z[Q.endpoint];
      if (!Y || Date.now() > ((G = Y.expiryTime) !== null && G !== void 0 ? G : 0)) return delete Z[Q.endpoint], this._fallbackInfo = Z, OP1(A, this._fallbackInfo), null;
      if (Y.url) return Y.url;
      return null
    }
    getFallbackFromProvided(A) {
      let Q = G$Q(A);
      if (Q) return A.replace(Q, "");
      return null
    }
    tryFetchUpdatedFallbackInfo(A, Q, B, G) {
      var Z, Y;
      return Q$Q(this, void 0, void 0, function* () {
        try {
          if (!Y$Q(B, G)) return !1;
          let X = Q.customUrl == null && Q.fallbackUrls == null ? yield this._tryFetchFallbackUrlsFromNetwork(Q): Q.fallbackUrls, I = this._pickNewFallbackUrl((Z = this._fallbackInfo) === null || Z === void 0 ? void 0 : Z[Q.endpoint], X);
          if (!I) return !1;
          return this._updateFallbackInfoWithNewUrl(A, Q.endpoint, I), !0
        } catch (J) {
          return (Y = this._errorBoundary) === null || Y === void 0 || Y.logError("tryFetchUpdatedFallbackInfo", J), !1
        }
      })
    }
    _updateFallbackInfoWithNewUrl(A, Q, B) {
      var G, Z, Y;
      let J = {
          url: B,
          expiryTime: Date.now() + B$Q,
          previous: []
        },
        X = (G = this._fallbackInfo) === null || G === void 0 ? void 0 : G[Q];
      if (X) J.previous.push(...X.previous);
      if (J.previous.length > 10) J.previous = [];
      let I = (Y = (Z = this._fallbackInfo) === null || Z === void 0 ? void 0 : Z[Q]) === null || Y === void 0 ? void 0 : Y.url;
      if (I != null) J.previous.push(I);
      this._fallbackInfo = Object.assign(Object.assign({}, this._fallbackInfo), {
        [Q]: J
      }), OP1(A, this._fallbackInfo)
    }
    _tryFetchFallbackUrlsFromNetwork(A) {
      var Q;
      return Q$Q(this, void 0, void 0, function* () {
        let B = this._dnsQueryCooldowns[A.endpoint];
        if (B && Date.now() < B) return null;
        this._dnsQueryCooldowns[A.endpoint] = Date.now() + Mc4;
        let G = [],
          Z = yield(0, wc4._fetchTxtRecords)((Q = this._networkOverrideFunc) !== null && Q !== void 0 ? Q : fetch), Y = G$Q(A.defaultUrl);
        for (let J of Z) {
          if (!J.startsWith(A.endpointDnsKey + "=")) continue;
          let X = J.split("=");
          if (X.length > 1) {
            let I = X[1];
            if (I.endsWith("/")) I = I.slice(0, -1);
            G.push(`https://${I}${Y}`)
          }
        }
        return G
      })
    }
    _pickNewFallbackUrl(A, Q) {
      var B;
      if (Q == null) return null;
      let G = new Set((B = A === null || A === void 0 ? void 0 : A.previous) !== null && B !== void 0 ? B : []),
        Z = A === null || A === void 0 ? void 0 : A.url,
        Y = null;
      for (let J of Q) {
        let X = J.endsWith("/") ? J.slice(0, -1) : J;
        if (!G.has(J) && X !== Z) {
          Y = X;
          break
        }
      }
      return Y
    }
  }
  fi.NetworkFallbackResolver = Z$Q;

  function Y$Q(A, Q) {
    var B;
    let G = (B = A === null || A === void 0 ? void 0 : A.toLowerCase()) !== null && B !== void 0 ? B : "";
    return Q || G.includes("uncaught exception") || G.includes("failed to fetch") || G.includes("networkerror when attempting to fetch resource")
  }
  fi._isDomainFailure = Y$Q;

  function J$Q(A) {
    return `statsig.network_fallback.${(0,Lc4._DJB2)(A)}`
  }

  function OP1(A, Q) {
    let B = J$Q(A);
    if (!Q || Object.keys(Q).length === 0) {
      MP1.Storage.removeItem(B);
      return
    }
    MP1.Storage.setItem(B, JSON.stringify(Q))
  }

  function Rc4(A) {
    let Q = J$Q(A),
      B = MP1.Storage.getItem(Q);
    if (!B) return null;
    try {
      return JSON.parse(B)
    } catch (G) {
      return Oc4.Log.error("Failed to parse FallbackInfo"), null
    }
  }

  function G$Q(A) {
    try {
      return new URL(A).pathname
    } catch (Q) {
      return null
    }
  }
})
// @from(Ln 70360, Col 4)
RP1 = U((D$Q) => {
  Object.defineProperty(D$Q, "__esModule", {
    value: !0
  });
  D$Q.SDKFlags = void 0;
  var I$Q = {};
  D$Q.SDKFlags = {
    setFlags: (A, Q) => {
      I$Q[A] = Q
    },
    get: (A, Q) => {
      var B, G;
      return (G = (B = I$Q[A]) === null || B === void 0 ? void 0 : B[Q]) !== null && G !== void 0 ? G : !1
    }
  }
})
// @from(Ln 70376, Col 4)
qaA = U(($$Q) => {
  Object.defineProperty($$Q, "__esModule", {
    value: !0
  });
  $$Q.StatsigSession = $$Q.SessionID = void 0;
  var _c4 = JNA(),
    jc4 = Yz(),
    V$Q = vg(),
    F$Q = VaA(),
    H$Q = 1800000,
    E$Q = 14400000,
    UaA = {};
  $$Q.SessionID = {
    get: (A) => {
      return $$Q.StatsigSession.get(A).data.sessionID
    }
  };
  $$Q.StatsigSession = {
    get: (A) => {
      if (UaA[A] == null) UaA[A] = Tc4(A);
      let Q = UaA[A];
      return Sc4(Q)
    },
    overrideInitialSessionID: (A, Q) => {
      UaA[Q] = Pc4(A, Q)
    }
  };

  function Tc4(A) {
    let Q = kc4(A),
      B = Date.now();
    if (!Q) Q = {
      sessionID: (0, F$Q.getUUID)(),
      startTime: B,
      lastUpdate: B
    };
    return {
      data: Q,
      sdkKey: A
    }
  }

  function Pc4(A, Q) {
    let B = Date.now();
    return {
      data: {
        sessionID: A,
        startTime: B,
        lastUpdate: B
      },
      sdkKey: Q
    }
  }

  function Sc4(A) {
    let Q = Date.now(),
      B = A.data;
    if (xc4(B) || yc4(B)) B.sessionID = (0, F$Q.getUUID)(), B.startTime = Q;
    B.lastUpdate = Q, vc4(B, A.sdkKey), clearTimeout(A.idleTimeoutID), clearTimeout(A.ageTimeoutID);
    let G = Q - B.startTime,
      Z = A.sdkKey;
    return A.idleTimeoutID = K$Q(Z, H$Q), A.ageTimeoutID = K$Q(Z, E$Q - G), A
  }

  function K$Q(A, Q) {
    return setTimeout(() => {
      let B = __STATSIG__ === null || __STATSIG__ === void 0 ? void 0 : __STATSIG__.instance(A);
      if (B) B.$emt({
        name: "session_expired"
      })
    }, Q)
  }

  function xc4({
    lastUpdate: A
  }) {
    return Date.now() - A > H$Q
  }

  function yc4({
    startTime: A
  }) {
    return Date.now() - A > E$Q
  }

  function z$Q(A) {
    return `statsig.session_id.${(0,_c4._getStorageKey)(A)}`
  }

  function vc4(A, Q) {
    let B = z$Q(Q);
    try {
      (0, V$Q._setObjectInStorage)(B, A)
    } catch (G) {
      jc4.Log.warn("Failed to save SessionID")
    }
  }

  function kc4(A) {
    let Q = z$Q(A);
    return (0, V$Q._getObjectFromStorage)(Q)
  }
})
// @from(Ln 70479, Col 4)
jP1 = U((C$Q) => {
  Object.defineProperty(C$Q, "__esModule", {
    value: !0
  });
  C$Q.ErrorTag = void 0;
  C$Q.ErrorTag = {
    NetworkError: "NetworkError"
  }
})
// @from(Ln 70488, Col 4)
j$Q = U((uZA) => {
  var gZA = uZA && uZA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(uZA, "__esModule", {
    value: !0
  });
  uZA.NetworkCore = void 0;
  s1A();
  var q$Q = s1A(),
    TP1 = enA(),
    A0A = Yz(),
    ST = XNA(),
    fc4 = X$Q(),
    hc4 = RP1(),
    L$Q = CaA(),
    gc4 = t1A(),
    O$Q = qaA(),
    uc4 = HaA(),
    mc4 = jP1(),
    M$Q = KNA(),
    dc4 = WaA(),
    cc4 = 1e4,
    pc4 = 500,
    lc4 = 30000,
    ic4 = 1000,
    R$Q = 50,
    nc4 = R$Q / ic4,
    ac4 = new Set([408, 500, 502, 503, 504, 522, 524, 599]);
  class _$Q {
    constructor(A, Q) {
      if (this._emitter = Q, this._errorBoundary = null, this._timeout = cc4, this._netConfig = {}, this._options = {}, this._leakyBucket = {}, this._lastUsedInitUrl = null, A) this._options = A;
      if (this._options.networkConfig) this._netConfig = this._options.networkConfig;
      if (this._netConfig.networkTimeoutMs) this._timeout = this._netConfig.networkTimeoutMs;
      this._fallbackResolver = new fc4.NetworkFallbackResolver(this._options)
    }
    setErrorBoundary(A) {
      this._errorBoundary = A, this._errorBoundary.wrap(this), this._errorBoundary.wrap(this._fallbackResolver), this._fallbackResolver.setErrorBoundary(A)
    }
    isBeaconSupported() {
      return typeof navigator < "u" && typeof navigator.sendBeacon === "function"
    }
    getLastUsedInitUrlAndReset() {
      let A = this._lastUsedInitUrl;
      return this._lastUsedInitUrl = null, A
    }
    beacon(A) {
      return gZA(this, void 0, void 0, function* () {
        if (!N$Q(A)) return !1;
        let Q = this._getInternalRequestArgs("POST", A);
        yield this._tryToCompressBody(Q);
        let B = yield this._getPopulatedURL(Q), G = navigator;
        return G.sendBeacon.bind(G)(B, Q.body)
      })
    }
    post(A) {
      return gZA(this, void 0, void 0, function* () {
        let Q = this._getInternalRequestArgs("POST", A);
        return this._tryEncodeBody(Q), yield this._tryToCompressBody(Q), this._sendRequest(Q)
      })
    }
    get(A) {
      let Q = this._getInternalRequestArgs("GET", A);
      return this._sendRequest(Q)
    }
    _sendRequest(A) {
      var Q, B, G, Z;
      return gZA(this, void 0, void 0, function* () {
        if (!N$Q(A)) return null;
        if (this._netConfig.preventAllNetworkTraffic) return null;
        let {
          method: Y,
          body: J,
          retries: X,
          attempt: I
        } = A, D = A.urlConfig.endpoint;
        if (this._isRateLimited(D)) return A0A.Log.warn(`Request to ${D} was blocked because you are making requests too frequently.`), null;
        let W = I !== null && I !== void 0 ? I : 1,
          K = typeof AbortController < "u" ? new AbortController : null,
          V = setTimeout(() => {
            K === null || K === void 0 || K.abort(`Timeout of ${this._timeout}ms expired.`)
          }, this._timeout),
          F = yield this._getPopulatedURL(A), H = null, E = (0, dc4._isUnloading)();
        try {
          let z = {
            method: Y,
            body: J,
            headers: Object.assign({}, A.headers),
            signal: K === null || K === void 0 ? void 0 : K.signal,
            priority: A.priority,
            keepalive: E
          };
          tc4(A, W);
          let $ = this._leakyBucket[D];
          if ($) $.lastRequestTime = Date.now(), this._leakyBucket[D] = $;
          if (H = yield((Q = this._netConfig.networkOverrideFunc) !== null && Q !== void 0 ? Q : fetch)(F, z), clearTimeout(V), !H.ok) {
            let M = yield H.text().catch(() => "No Text"), _ = Error(`NetworkError: ${F} ${M}`);
            throw _.name = "NetworkError", _
          }
          let L = yield H.text();
          return w$Q(A, H, W, L), this._fallbackResolver.tryBumpExpiryTime(A.sdkKey, A.urlConfig), {
            body: L,
            code: H.status
          }
        } catch (z) {
          let $ = rc4(K, z),
            O = sc4(K);
          if (w$Q(A, H, W, "", z), yield this._fallbackResolver.tryFetchUpdatedFallbackInfo(A.sdkKey, A.urlConfig, $, O)) A.fallbackUrl = this._fallbackResolver.getActiveFallbackUrl(A.sdkKey, A.urlConfig);
          if (!X || W > X || !ac4.has((B = H === null || H === void 0 ? void 0 : H.status) !== null && B !== void 0 ? B : 500)) {
            (G = this._emitter) === null || G === void 0 || G.call(this, {
              name: "error",
              error: z,
              tag: mc4.ErrorTag.NetworkError,
              requestArgs: A
            });
            let M = `A networking error occurred during ${Y} request to ${F}.`;
            return A0A.Log.error(M, $, z), (Z = this._errorBoundary) === null || Z === void 0 || Z.attachErrorIfNoneExists(M), null
          }
          return yield ec4(W), this._sendRequest(Object.assign(Object.assign({}, A), {
            retries: X,
            attempt: W + 1
          }))
        }
      })
    }
    _isRateLimited(A) {
      var Q;
      let B = Date.now(),
        G = (Q = this._leakyBucket[A]) !== null && Q !== void 0 ? Q : {
          count: 0,
          lastRequestTime: B
        },
        Z = B - G.lastRequestTime,
        Y = Math.floor(Z * nc4);
      if (G.count = Math.max(0, G.count - Y), G.count >= R$Q) return !0;
      return G.count += 1, G.lastRequestTime = B, this._leakyBucket[A] = G, !1
    }
    _getPopulatedURL(A) {
      var Q;
      return gZA(this, void 0, void 0, function* () {
        let B = (Q = A.fallbackUrl) !== null && Q !== void 0 ? Q : A.urlConfig.getUrl();
        if (A.urlConfig.endpoint === ST.Endpoint._initialize || A.urlConfig.endpoint === ST.Endpoint._download_config_specs) this._lastUsedInitUrl = B;
        let G = Object.assign({
            [ST.NetworkParam.SdkKey]: A.sdkKey,
            [ST.NetworkParam.SdkType]: L$Q.SDKType._get(A.sdkKey),
            [ST.NetworkParam.SdkVersion]: M$Q.SDK_VERSION,
            [ST.NetworkParam.Time]: String(Date.now()),
            [ST.NetworkParam.SessionID]: O$Q.SessionID.get(A.sdkKey)
          }, A.params),
          Z = Object.keys(G).map((Y) => {
            return `${encodeURIComponent(Y)}=${encodeURIComponent(G[Y])}`
          }).join("&");
        return `${B}${Z?`?${Z}`:""}`
      })
    }
    _tryEncodeBody(A) {
      var Q;
      let B = (0, gc4._getWindowSafe)(),
        G = A.body;
      if (!A.isStatsigEncodable || this._options.disableStatsigEncoding || typeof G !== "string" || (0, q$Q._getStatsigGlobalFlag)("no-encode") != null || !(B === null || B === void 0 ? void 0 : B.btoa)) return;
      try {
        A.body = B.btoa(G).split("").reverse().join(""), A.params = Object.assign(Object.assign({}, (Q = A.params) !== null && Q !== void 0 ? Q : {}), {
          [ST.NetworkParam.StatsigEncoded]: "1"
        })
      } catch (Z) {
        A0A.Log.warn(`Request encoding failed for ${A.urlConfig.getUrl()}`, Z)
      }
    }
    _tryToCompressBody(A) {
      var Q;
      return gZA(this, void 0, void 0, function* () {
        let B = A.body;
        if (!A.isCompressable || this._options.disableCompression || typeof B !== "string" || hc4.SDKFlags.get(A.sdkKey, "enable_log_event_compression") !== !0 || (0, q$Q._getStatsigGlobalFlag)("no-compress") != null || typeof CompressionStream > "u" || typeof TextEncoder > "u") return;
        try {
          let G = new TextEncoder().encode(B),
            Z = new CompressionStream("gzip"),
            Y = Z.writable.getWriter();
          Y.write(G).catch(A0A.Log.error), Y.close().catch(A0A.Log.error);
          let J = Z.readable.getReader(),
            X = [],
            I;
          while (!(I = yield J.read()).done) X.push(I.value);
          let D = X.reduce((V, F) => V + F.length, 0),
            W = new Uint8Array(D),
            K = 0;
          for (let V of X) W.set(V, K), K += V.length;
          A.body = W, A.params = Object.assign(Object.assign({}, (Q = A.params) !== null && Q !== void 0 ? Q : {}), {
            [ST.NetworkParam.IsGzipped]: "1"
          })
        } catch (G) {
          A0A.Log.warn(`Request compression failed for ${A.urlConfig.getUrl()}`, G)
        }
      })
    }
    _getInternalRequestArgs(A, Q) {
      let B = this._fallbackResolver.getActiveFallbackUrl(Q.sdkKey, Q.urlConfig),
        G = Object.assign(Object.assign({}, Q), {
          method: A,
          fallbackUrl: B
        });
      if ("data" in Q) oc4(G, Q.data);
      return G
    }
  }
  uZA.NetworkCore = _$Q;
  var N$Q = (A) => {
      if (!A.sdkKey) return A0A.Log.warn("Unable to make request without an SDK key"), !1;
      return !0
    },
    oc4 = (A, Q) => {
      let {
        sdkKey: B,
        fallbackUrl: G
      } = A, Z = uc4.StableID.get(B), Y = O$Q.SessionID.get(B), J = L$Q.SDKType._get(B);
      A.body = JSON.stringify(Object.assign(Object.assign({}, Q), {
        statsigMetadata: Object.assign(Object.assign({}, M$Q.StatsigMetadataProvider.get()), {
          stableID: Z,
          sessionID: Y,
          sdkType: J,
          fallbackUrl: G
        })
      }))
    };

  function rc4(A, Q) {
    if ((A === null || A === void 0 ? void 0 : A.signal.aborted) && typeof A.signal.reason === "string") return A.signal.reason;
    if (typeof Q === "string") return Q;
    if (Q instanceof Error) return `${Q.name}: ${Q.message}`;
    return "Unknown Error"
  }

  function sc4(A) {
    return (A === null || A === void 0 ? void 0 : A.signal.aborted) && typeof A.signal.reason === "string" && A.signal.reason.includes("Timeout") || !1
  }

  function tc4(A, Q) {
    if (A.urlConfig.endpoint !== ST.Endpoint._initialize) return;
    TP1.Diagnostics._markInitNetworkReqStart(A.sdkKey, {
      attempt: Q
    })
  }

  function w$Q(A, Q, B, G, Z) {
    if (A.urlConfig.endpoint !== ST.Endpoint._initialize) return;
    TP1.Diagnostics._markInitNetworkReqEnd(A.sdkKey, TP1.Diagnostics._getDiagnosticsData(Q, B, G, Z))
  }

  function ec4(A) {
    return gZA(this, void 0, void 0, function* () {
      yield new Promise((Q) => setTimeout(Q, Math.min(pc4 * (A * A), lc4)))
    })
  }
})
// @from(Ln 70767, Col 4)
P$Q = U((T$Q) => {
  Object.defineProperty(T$Q, "__esModule", {
    value: !0
  })
})
// @from(Ln 70772, Col 4)
x$Q = U((S$Q) => {
  Object.defineProperty(S$Q, "__esModule", {
    value: !0
  })
})
// @from(Ln 70777, Col 4)
v$Q = U((mZA) => {
  var Ap4 = mZA && mZA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(mZA, "__esModule", {
    value: !0
  });
  mZA.StatsigClientBase = void 0;
  s1A();
  var Qp4 = s1A(),
    Bp4 = wP1(),
    Gp4 = $P1(),
    PP1 = Yz(),
    Zp4 = LP1(),
    Yp4 = t1A(),
    Jp4 = qaA(),
    NaA = vg(),
    Xp4 = 3000;
  class y$Q {
    constructor(A, Q, B, G) {
      var Z;
      this.loadingStatus = "Uninitialized", this._initializePromise = null, this._listeners = {};
      let Y = this.$emt.bind(this);
      (G === null || G === void 0 ? void 0 : G.logLevel) != null && (PP1.Log.level = G.logLevel), (G === null || G === void 0 ? void 0 : G.disableStorage) && NaA.Storage._setDisabled(!0), (G === null || G === void 0 ? void 0 : G.initialSessionID) && Jp4.StatsigSession.overrideInitialSessionID(G.initialSessionID, A), (G === null || G === void 0 ? void 0 : G.storageProvider) && NaA.Storage._setProvider(G.storageProvider), this._sdkKey = A, this._options = G !== null && G !== void 0 ? G : {}, this._memoCache = {}, this.overrideAdapter = (Z = G === null || G === void 0 ? void 0 : G.overrideAdapter) !== null && Z !== void 0 ? Z : null, this._logger = new Gp4.EventLogger(A, Y, B, G), this._errorBoundary = new Bp4.ErrorBoundary(A, G, Y), this._errorBoundary.wrap(this), this._errorBoundary.wrap(Q), this._errorBoundary.wrap(this._logger), B.setErrorBoundary(this._errorBoundary), this.dataAdapter = Q, this.dataAdapter.attach(A, G), this.storageProvider = NaA.Storage, this._primeReadyRipcord(), Ip4(A, this)
    }
    updateRuntimeOptions(A) {
      if (A.disableLogging != null) this._options.disableLogging = A.disableLogging, this._logger.setLoggingDisabled(A.disableLogging);
      if (A.disableStorage != null) this._options.disableStorage = A.disableStorage, NaA.Storage._setDisabled(A.disableStorage)
    }
    flush() {
      return this._logger.flush()
    }
    shutdown() {
      return Ap4(this, void 0, void 0, function* () {
        this.$emt({
          name: "pre_shutdown"
        }), this._setStatus("Uninitialized", null), this._initializePromise = null, yield this._logger.stop()
      })
    }
    on(A, Q) {
      if (!this._listeners[A]) this._listeners[A] = [];
      this._listeners[A].push(Q)
    }
    off(A, Q) {
      if (this._listeners[A]) {
        let B = this._listeners[A].indexOf(Q);
        if (B !== -1) this._listeners[A].splice(B, 1)
      }
    }
    $on(A, Q) {
      Q.__isInternal = !0, this.on(A, Q)
    }
    $emt(A) {
      var Q;
      let B = (G) => {
        try {
          G(A)
        } catch (Z) {
          if (G.__isInternal === !0) {
            this._errorBoundary.logError(`__emit:${A.name}`, Z);
            return
          }
          PP1.Log.error("An error occurred in a StatsigClientEvent listener. This is not an issue with Statsig.", A)
        }
      };
      if (this._listeners[A.name]) this._listeners[A.name].forEach((G) => B(G));
      (Q = this._listeners["*"]) === null || Q === void 0 || Q.forEach(B)
    }
    _setStatus(A, Q) {
      this.loadingStatus = A, this._memoCache = {}, this.$emt({
        name: "values_updated",
        status: A,
        values: Q
      })
    }
    _enqueueExposure(A, Q, B) {
      if ((B === null || B === void 0 ? void 0 : B.disableExposureLog) === !0) {
        this._logger.incrementNonExposureCount(A);
        return
      }
      this._logger.enqueue(Q)
    }
    _memoize(A, Q) {
      return (B, G) => {
        if (this._options.disableEvaluationMemoization) return Q(B, G);
        let Z = (0, Zp4.createMemoKey)(A, B, G);
        if (!Z) return Q(B, G);
        if (!(Z in this._memoCache)) {
          if (Object.keys(this._memoCache).length >= Xp4) this._memoCache = {};
          this._memoCache[Z] = Q(B, G)
        }
        return this._memoCache[Z]
      }
    }
  }
  mZA.StatsigClientBase = y$Q;

  function Ip4(A, Q) {
    var B;
    if ((0, Yp4._isServerEnv)()) return;
    let G = (0, Qp4._getStatsigGlobal)(),
      Z = (B = G.instances) !== null && B !== void 0 ? B : {},
      Y = Q;
    if (Z[A] != null) PP1.Log.warn("Creating multiple Statsig clients with the same SDK key can lead to unexpected behavior. Multi-instance support requires different SDK keys.");
    if (Z[A] = Y, !G.firstInstance) G.firstInstance = Y;
    G.instances = Z, __STATSIG__ = G
  }
})
// @from(Ln 70911, Col 4)
f$Q = U((k$Q) => {
  Object.defineProperty(k$Q, "__esModule", {
    value: !0
  });
  k$Q.DataAdapterCachePrefix = void 0;
  k$Q.DataAdapterCachePrefix = "statsig.cached"
})
// @from(Ln 70918, Col 4)
g$Q = U((h$Q) => {
  Object.defineProperty(h$Q, "__esModule", {
    value: !0
  })
})
// @from(Ln 70923, Col 4)
m$Q = U((u$Q) => {
  Object.defineProperty(u$Q, "__esModule", {
    value: !0
  })
})
// @from(Ln 70928, Col 4)
l$Q = U((c$Q) => {
  Object.defineProperty(c$Q, "__esModule", {
    value: !0
  });
  c$Q._makeTypedGet = c$Q._mergeOverride = c$Q._makeLayer = c$Q._makeExperiment = c$Q._makeDynamicConfig = c$Q._makeFeatureGate = void 0;
  var Dp4 = Yz(),
    Wp4 = AaA(),
    Kp4 = "default";

  function SP1(A, Q, B, G) {
    var Z;
    return {
      name: A,
      details: Q,
      ruleID: (Z = B === null || B === void 0 ? void 0 : B.rule_id) !== null && Z !== void 0 ? Z : Kp4,
      __evaluation: B,
      value: G
    }
  }

  function Vp4(A, Q, B) {
    return SP1(A, Q, B, (B === null || B === void 0 ? void 0 : B.value) === !0)
  }
  c$Q._makeFeatureGate = Vp4;

  function d$Q(A, Q, B) {
    var G;
    let Z = (G = B === null || B === void 0 ? void 0 : B.value) !== null && G !== void 0 ? G : {};
    return Object.assign(Object.assign({}, SP1(A, Q, B, Z)), {
      get: waA(A, B === null || B === void 0 ? void 0 : B.value)
    })
  }
  c$Q._makeDynamicConfig = d$Q;

  function Fp4(A, Q, B) {
    var G;
    let Z = d$Q(A, Q, B);
    return Object.assign(Object.assign({}, Z), {
      groupName: (G = B === null || B === void 0 ? void 0 : B.group_name) !== null && G !== void 0 ? G : null
    })
  }
  c$Q._makeExperiment = Fp4;

  function Hp4(A, Q, B, G) {
    var Z, Y;
    return Object.assign(Object.assign({}, SP1(A, Q, B, void 0)), {
      get: waA(A, B === null || B === void 0 ? void 0 : B.value, G),
      groupName: (Z = B === null || B === void 0 ? void 0 : B.group_name) !== null && Z !== void 0 ? Z : null,
      __value: (Y = B === null || B === void 0 ? void 0 : B.value) !== null && Y !== void 0 ? Y : {}
    })
  }
  c$Q._makeLayer = Hp4;

  function Ep4(A, Q, B, G) {
    return Object.assign(Object.assign(Object.assign({}, A), Q), {
      get: waA(A.name, B, G)
    })
  }
  c$Q._mergeOverride = Ep4;

  function waA(A, Q, B) {
    return (G, Z) => {
      var Y;
      let J = (Y = Q === null || Q === void 0 ? void 0 : Q[G]) !== null && Y !== void 0 ? Y : null;
      if (J == null) return Z !== null && Z !== void 0 ? Z : null;
      if (Z != null && !(0, Wp4._isTypeMatch)(J, Z)) return Dp4.Log.warn(`Parameter type mismatch. '${A}.${G}' was found to be type '${typeof J}' but fallback/return type is '${typeof Z}'. See https://docs.statsig.com/client/javascript-sdk/#typed-getters`), Z !== null && Z !== void 0 ? Z : null;
      return B === null || B === void 0 || B(G), J
    }
  }
  c$Q._makeTypedGet = waA
})
// @from(Ln 70999, Col 4)
n$Q = U((i$Q) => {
  Object.defineProperty(i$Q, "__esModule", {
    value: !0
  })
})
// @from(Ln 71004, Col 4)
r$Q = U((a$Q) => {
  Object.defineProperty(a$Q, "__esModule", {
    value: !0
  });
  a$Q.UPDATE_DETAIL_ERROR_MESSAGES = a$Q.createUpdateDetails = void 0;
  var Np4 = (A, Q, B, G, Z, Y) => {
    return {
      duration: B,
      source: Q,
      success: A,
      error: G,
      sourceUrl: Z,
      warnings: Y
    }
  };
  a$Q.createUpdateDetails = Np4;
  a$Q.UPDATE_DETAIL_ERROR_MESSAGES = {
    NO_NETWORK_DATA: "No data was returned from the network. This may be due to a network timeout if a timeout value was specified in the options or ad blocker error."
  }
})
// @from(Ln 71024, Col 4)
hi = U((H4) => {
  var Lp4 = H4 && H4.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    w8 = H4 && H4.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) Lp4(Q, A, B)
    };
  Object.defineProperty(H4, "__esModule", {
    value: !0
  });
  H4.Storage = H4.Log = H4.EventLogger = H4.Diagnostics = void 0;
  s1A();
  var Op4 = enA();
  Object.defineProperty(H4, "Diagnostics", {
    enumerable: !0,
    get: function () {
      return Op4.Diagnostics
    }
  });
  var Mp4 = $P1();
  Object.defineProperty(H4, "EventLogger", {
    enumerable: !0,
    get: function () {
      return Mp4.EventLogger
    }
  });
  var s$Q = Yz();
  Object.defineProperty(H4, "Log", {
    enumerable: !0,
    get: function () {
      return s$Q.Log
    }
  });
  var Rp4 = KNA(),
    _p4 = vg();
  Object.defineProperty(H4, "Storage", {
    enumerable: !0,
    get: function () {
      return _p4.Storage
    }
  });
  w8(s1A(), H4);
  w8(JNA(), H4);
  w8(qzQ(), H4);
  w8(fzQ(), H4);
  w8(enA(), H4);
  w8(gzQ(), H4);
  w8(wP1(), H4);
  w8(nzQ(), H4);
  w8(ozQ(), H4);
  w8(xZA(), H4);
  w8(szQ(), H4);
  w8(Yz(), H4);
  w8(LP1(), H4);
  w8(XNA(), H4);
  w8(j$Q(), H4);
  w8(P$Q(), H4);
  w8(x$Q(), H4);
  w8(t1A(), H4);
  w8(CaA(), H4);
  w8(qaA(), H4);
  w8(HaA(), H4);
  w8(v$Q(), H4);
  w8(jP1(), H4);
  w8(f$Q(), H4);
  w8(DP1(), H4);
  w8(KNA(), H4);
  w8(g$Q(), H4);
  w8(m$Q(), H4);
  w8(l$Q(), H4);
  w8(n$Q(), H4);
  w8(UP1(), H4);
  w8(vg(), H4);
  w8(qP1(), H4);
  w8(AaA(), H4);
  w8(VP1(), H4);
  w8(VaA(), H4);
  w8(WaA(), H4);
  w8(r$Q(), H4);
  w8(RP1(), H4);
  __STATSIG__ = Object.assign(Object.assign({}, __STATSIG__ !== null && __STATSIG__ !== void 0 ? __STATSIG__ : {}), {
    Log: s$Q.Log,
    SDK_VERSION: Rp4.SDK_VERSION
  })
})
// @from(Ln 71121, Col 4)
ACQ = U((e$Q) => {
  Object.defineProperty(e$Q, "__esModule", {
    value: !0
  });
  var Q0A = hi();
  class t$Q {
    constructor(A) {
      this._sdkKey = A, this._rawValues = null, this._values = null, this._source = "Uninitialized", this._lcut = 0, this._receivedAt = 0, this._bootstrapMetadata = null, this._warnings = new Set
    }
    reset() {
      this._values = null, this._rawValues = null, this._source = "Loading", this._lcut = 0, this._receivedAt = 0, this._bootstrapMetadata = null
    }
    finalize() {
      if (this._values) return;
      this._source = "NoValues"
    }
    getValues() {
      return this._rawValues ? (0, Q0A._typedJsonParse)(this._rawValues, "has_updates", "EvaluationStoreValues") : null
    }
    setValues(A, Q) {
      var B;
      if (!A) return !1;
      let G = (0, Q0A._typedJsonParse)(A.data, "has_updates", "EvaluationResponse");
      if (G == null) return !1;
      if (this._source = A.source, (G === null || G === void 0 ? void 0 : G.has_updates) !== !0) return !0;
      if (this._rawValues = A.data, this._lcut = G.time, this._receivedAt = A.receivedAt, this._values = G, this._bootstrapMetadata = this._extractBootstrapMetadata(A.source, G), A.source && G.user) this._setWarningState(Q, G);
      return Q0A.SDKFlags.setFlags(this._sdkKey, (B = G.sdk_flags) !== null && B !== void 0 ? B : {}), !0
    }
    getWarnings() {
      if (this._warnings.size === 0) return;
      return Array.from(this._warnings)
    }
    getGate(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.feature_gates, A)
    }
    getConfig(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.dynamic_configs, A)
    }
    getLayer(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.layer_configs, A)
    }
    getParamStore(A) {
      var Q;
      return this._getDetailedStoreResult((Q = this._values) === null || Q === void 0 ? void 0 : Q.param_stores, A)
    }
    getSource() {
      return this._source
    }
    getExposureMapping() {
      var A;
      return (A = this._values) === null || A === void 0 ? void 0 : A.exposures
    }
    _extractBootstrapMetadata(A, Q) {
      if (A !== "Bootstrap") return null;
      let B = {};
      if (Q.user) B.user = Q.user;
      if (Q.sdkInfo) B.generatorSDKInfo = Q.sdkInfo;
      return B.lcut = Q.time, B
    }
    _getDetailedStoreResult(A, Q) {
      let B = null;
      if (A) B = A[Q] ? A[Q] : A[(0, Q0A._DJB2)(Q)];
      return {
        result: B,
        details: this._getDetails(B == null)
      }
    }
    _setWarningState(A, Q) {
      var B;
      let G = Q0A.StableID.get(this._sdkKey);
      if (((B = A.customIDs) === null || B === void 0 ? void 0 : B.stableID) !== G) {
        this._warnings.add("StableIDMismatch");
        return
      }
      if ("user" in Q) {
        let Z = Q.user;
        if ((0, Q0A._getFullUserHash)(A) !== (0, Q0A._getFullUserHash)(Z)) this._warnings.add("PartialUserMatch")
      }
    }
    getCurrentSourceDetails() {
      if (this._source === "Uninitialized" || this._source === "NoValues") return {
        reason: this._source
      };
      let A = {
        reason: this._source,
        lcut: this._lcut,
        receivedAt: this._receivedAt
      };
      if (this._warnings.size > 0) A.warnings = Array.from(this._warnings);
      return A
    }
    _getDetails(A) {
      var Q, B;
      let G = this.getCurrentSourceDetails(),
        Z = G.reason,
        Y = (Q = G.warnings) !== null && Q !== void 0 ? Q : [];
      if (this._source === "Bootstrap" && Y.length > 0) Z = Z + Y[0];
      if (Z !== "Uninitialized" && Z !== "NoValues") Z = `${Z}:${A?"Unrecognized":"Recognized"}`;
      let J = this._source === "Bootstrap" ? (B = this._bootstrapMetadata) !== null && B !== void 0 ? B : void 0 : void 0;
      if (J) G.bootstrapMetadata = J;
      return Object.assign(Object.assign({}, G), {
        reason: Z
      })
    }
  }
  e$Q.default = t$Q
})
// @from(Ln 71231, Col 4)
ZCQ = U((BCQ) => {
  Object.defineProperty(BCQ, "__esModule", {
    value: !0
  });
  BCQ._resolveDeltasResponse = void 0;
  var QCQ = hi(),
    Tp4 = 2;

  function Pp4(A, Q) {
    let B = (0, QCQ._typedJsonParse)(Q, "checksum", "DeltasEvaluationResponse");
    if (!B) return {
      hadBadDeltaChecksum: !0
    };
    let G = Sp4(A, B),
      Z = xp4(G),
      Y = (0, QCQ._DJB2Object)({
        feature_gates: Z.feature_gates,
        dynamic_configs: Z.dynamic_configs,
        layer_configs: Z.layer_configs
      }, Tp4);
    if (Y !== B.checksumV2) return {
      hadBadDeltaChecksum: !0,
      badChecksum: Y,
      badMergedConfigs: Z,
      badFullResponse: B.deltas_full_response
    };
    return JSON.stringify(Z)
  }
  BCQ._resolveDeltasResponse = Pp4;

  function Sp4(A, Q) {
    return Object.assign(Object.assign(Object.assign({}, A), Q), {
      feature_gates: Object.assign(Object.assign({}, A.feature_gates), Q.feature_gates),
      layer_configs: Object.assign(Object.assign({}, A.layer_configs), Q.layer_configs),
      dynamic_configs: Object.assign(Object.assign({}, A.dynamic_configs), Q.dynamic_configs)
    })
  }

  function xp4(A) {
    let Q = A;
    return xP1(A.deleted_gates, Q.feature_gates), delete Q.deleted_gates, xP1(A.deleted_configs, Q.dynamic_configs), delete Q.deleted_configs, xP1(A.deleted_layers, Q.layer_configs), delete Q.deleted_layers, Q
  }

  function xP1(A, Q) {
    A === null || A === void 0 || A.forEach((B) => {
      delete Q[B]
    })
  }
})
// @from(Ln 71280, Col 4)
yP1 = U((VNA) => {
  var YCQ = VNA && VNA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(VNA, "__esModule", {
    value: !0
  });
  var LaA = hi(),
    yp4 = ZCQ();
  class JCQ extends LaA.NetworkCore {
    constructor(A, Q) {
      super(A, Q);
      let B = A === null || A === void 0 ? void 0 : A.networkConfig;
      this._initializeUrlConfig = new LaA.UrlConfiguration(LaA.Endpoint._initialize, B === null || B === void 0 ? void 0 : B.initializeUrl, B === null || B === void 0 ? void 0 : B.api, B === null || B === void 0 ? void 0 : B.initializeFallbackUrls)
    }
    fetchEvaluations(A, Q, B, G, Z) {
      return YCQ(this, void 0, void 0, function* () {
        let Y = Q ? (0, LaA._typedJsonParse)(Q, "has_updates", "InitializeResponse") : null,
          J = {
            user: G,
            hash: "djb2",
            deltasResponseRequested: !1,
            full_checksum: null
          };
        if (Y === null || Y === void 0 ? void 0 : Y.has_updates) J = Object.assign(Object.assign({}, J), {
          sinceTime: Z ? Y.time : 0,
          previousDerivedFields: "derived_fields" in Y && Z ? Y.derived_fields : {},
          deltasResponseRequested: !0,
          full_checksum: Y.full_checksum
        });
        return this._fetchEvaluations(A, Y, J, B)
      })
    }
    _fetchEvaluations(A, Q, B, G) {
      var Z, Y;
      return YCQ(this, void 0, void 0, function* () {
        let J = yield this.post({
          sdkKey: A,
          urlConfig: this._initializeUrlConfig,
          data: B,
          retries: 2,
          isStatsigEncodable: !0,
          priority: G
        });
        if ((J === null || J === void 0 ? void 0 : J.code) === 204) return '{"has_updates": false}';
        if ((J === null || J === void 0 ? void 0 : J.code) !== 200) return (Z = J === null || J === void 0 ? void 0 : J.body) !== null && Z !== void 0 ? Z : null;
        if ((Q === null || Q === void 0 ? void 0 : Q.has_updates) !== !0 || ((Y = J.body) === null || Y === void 0 ? void 0 : Y.includes('"is_delta":true')) !== !0 || B.deltasResponseRequested !== !0) return J.body;
        let X = (0, yp4._resolveDeltasResponse)(Q, J.body);
        if (typeof X === "string") return X;
        return this._fetchEvaluations(A, Q, Object.assign(Object.assign(Object.assign({}, B), X), {
          deltasResponseRequested: !1
        }), G)
      })
    }
  }
  VNA.default = JCQ
})
// @from(Ln 71363, Col 4)
WCQ = U((ICQ) => {
  Object.defineProperty(ICQ, "__esModule", {
    value: !0
  });
  ICQ._makeParamStoreGetter = void 0;
  var XCQ = hi(),
    OaA = {
      disableExposureLog: !0
    };

  function MaA(A) {
    return A == null || A.disableExposureLog === !1
  }

  function vP1(A, Q) {
    return Q != null && !(0, XCQ._isTypeMatch)(A, Q)
  }

  function vp4(A, Q) {
    return A.value
  }

  function kp4(A, Q, B) {
    if (A.getFeatureGate(Q.gate_name, MaA(B) ? void 0 : OaA).value) return Q.pass_value;
    return Q.fail_value
  }

  function bp4(A, Q, B, G) {
    let Y = A.getDynamicConfig(Q.config_name, OaA).get(Q.param_name);
    if (vP1(Y, B)) return B;
    if (MaA(G)) A.getDynamicConfig(Q.config_name);
    return Y
  }

  function fp4(A, Q, B, G) {
    let Y = A.getExperiment(Q.experiment_name, OaA).get(Q.param_name);
    if (vP1(Y, B)) return B;
    if (MaA(G)) A.getExperiment(Q.experiment_name);
    return Y
  }

  function hp4(A, Q, B, G) {
    let Y = A.getLayer(Q.layer_name, OaA).get(Q.param_name);
    if (vP1(Y, B)) return B;
    if (MaA(G)) A.getLayer(Q.layer_name).get(Q.param_name);
    return Y
  }

  function gp4(A, Q, B) {
    return (G, Z) => {
      if (Q == null) return Z;
      let Y = Q[G];
      if (Y == null || Z != null && (0, XCQ._typeOf)(Z) !== Y.param_type) return Z;
      switch (Y.ref_type) {
        case "static":
          return vp4(Y, B);
        case "gate":
          return kp4(A, Y, B);
        case "dynamic_config":
          return bp4(A, Y, Z, B);
        case "experiment":
          return fp4(A, Y, Z, B);
        case "layer":
          return hp4(A, Y, Z, B);
        default:
          return Z
      }
    }
  }
  ICQ._makeParamStoreGetter = gp4
})
// @from(Ln 71434, Col 4)
VCQ = U((dZA) => {
  var up4 = dZA && dZA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(dZA, "__esModule", {
    value: !0
  });
  dZA.StatsigEvaluationsDataAdapter = void 0;
  var B0A = hi(),
    mp4 = yP1();
  class KCQ extends B0A.DataAdapterCore {
    constructor() {
      super("EvaluationsDataAdapter", "evaluations");
      this._network = null, this._options = null
    }
    attach(A, Q) {
      super.attach(A, Q), this._network = new mp4.default(Q !== null && Q !== void 0 ? Q : {})
    }
    getDataAsync(A, Q, B) {
      return this._getDataAsyncImpl(A, (0, B0A._normalizeUser)(Q, this._options), B)
    }
    prefetchData(A, Q) {
      return this._prefetchDataImpl(A, Q)
    }
    setData(A) {
      let Q = (0, B0A._typedJsonParse)(A, "has_updates", "data");
      if (Q && "user" in Q) super.setData(A, Q.user);
      else B0A.Log.error("StatsigUser not found. You may be using an older server SDK version. Please upgrade your SDK or use setDataLegacy.")
    }
    setDataLegacy(A, Q) {
      super.setData(A, Q)
    }
    _fetchFromNetwork(A, Q, B, G) {
      var Z;
      return up4(this, void 0, void 0, function* () {
        let Y = yield(Z = this._network) === null || Z === void 0 ? void 0 : Z.fetchEvaluations(this._getSdkKey(), A, B === null || B === void 0 ? void 0 : B.priority, Q, G);
        return Y !== null && Y !== void 0 ? Y : null
      })
    }
    _getCacheKey(A) {
      var Q;
      let B = (0, B0A._getStorageKey)(this._getSdkKey(), A, (Q = this._options) === null || Q === void 0 ? void 0 : Q.customUserCacheKeyFunc);
      return `${B0A.DataAdapterCachePrefix}.${this._cacheSuffix}.${B}`
    }
    _isCachedResultValidFor204(A, Q) {
      return A.fullUserHash != null && A.fullUserHash === (0, B0A._getFullUserHash)(Q)
    }
  }
  dZA.StatsigEvaluationsDataAdapter = KCQ
})
// @from(Ln 71510, Col 4)
HCQ = U((FNA) => {
  var kP1 = FNA && FNA.__awaiter || function (A, Q, B, G) {
    function Z(Y) {
      return Y instanceof B ? Y : new B(function (J) {
        J(Y)
      })
    }
    return new(B || (B = Promise))(function (Y, J) {
      function X(W) {
        try {
          D(G.next(W))
        } catch (K) {
          J(K)
        }
      }

      function I(W) {
        try {
          D(G.throw(W))
        } catch (K) {
          J(K)
        }
      }

      function D(W) {
        W.done ? Y(W.value) : Z(W.value).then(X, I)
      }
      D((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(FNA, "__esModule", {
    value: !0
  });
  var v8 = hi(),
    dp4 = ACQ(),
    cp4 = yP1(),
    FCQ = WCQ(),
    pp4 = VCQ();
  class RaA extends v8.StatsigClientBase {
    static instance(A) {
      let Q = (0, v8._getStatsigGlobal)().instance(A);
      if (Q instanceof RaA) return Q;
      return v8.Log.warn((0, v8._isServerEnv)() ? "StatsigClient.instance is not supported in server environments" : "Unable to find StatsigClient instance"), new RaA(A !== null && A !== void 0 ? A : "", {})
    }
    constructor(A, Q, B = null) {
      var G, Z;
      v8.SDKType._setClientType(A, "javascript-client");
      let Y = new cp4.default(B, (X) => {
        this.$emt(X)
      });
      super(A, (G = B === null || B === void 0 ? void 0 : B.dataAdapter) !== null && G !== void 0 ? G : new pp4.StatsigEvaluationsDataAdapter, Y, B);
      this.getFeatureGate = this._memoize(v8.MemoPrefix._gate, this._getFeatureGateImpl.bind(this)), this.getDynamicConfig = this._memoize(v8.MemoPrefix._dynamicConfig, this._getDynamicConfigImpl.bind(this)), this.getExperiment = this._memoize(v8.MemoPrefix._experiment, this._getExperimentImpl.bind(this)), this.getLayer = this._memoize(v8.MemoPrefix._layer, this._getLayerImpl.bind(this)), this.getParameterStore = this._memoize(v8.MemoPrefix._paramStore, this._getParameterStoreImpl.bind(this)), this._store = new dp4.default(A), this._network = Y, this._user = this._configureUser(Q, B);
      let J = (Z = B === null || B === void 0 ? void 0 : B.plugins) !== null && Z !== void 0 ? Z : [];
      for (let X of J) X.bind(this)
    }
    initializeSync(A) {
      var Q;
      if (this.loadingStatus !== "Uninitialized") return (0, v8.createUpdateDetails)(!0, this._store.getSource(), -1, null, null, ["MultipleInitializations", ...(Q = this._store.getWarnings()) !== null && Q !== void 0 ? Q : []]);
      return this._logger.start(), this.updateUserSync(this._user, A)
    }
    initializeAsync(A) {
      return kP1(this, void 0, void 0, function* () {
        if (this._initializePromise) return this._initializePromise;
        return this._initializePromise = this._initializeAsyncImpl(A), this._initializePromise
      })
    }
    updateUserSync(A, Q) {
      var B;
      let G = performance.now(),
        Z = [...(B = this._store.getWarnings()) !== null && B !== void 0 ? B : []];
      this._resetForUser(A);
      let Y = this.dataAdapter.getDataSync(this._user);
      if (Y == null) Z.push("NoCachedValues");
      this._store.setValues(Y, this._user), this._finalizeUpdate(Y);
      let J = Q === null || Q === void 0 ? void 0 : Q.disableBackgroundCacheRefresh;
      if (J === !0 || J == null && (Y === null || Y === void 0 ? void 0 : Y.source) === "Bootstrap") return (0, v8.createUpdateDetails)(!0, this._store.getSource(), performance.now() - G, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), Z);
      return this._runPostUpdate(Y !== null && Y !== void 0 ? Y : null, this._user), (0, v8.createUpdateDetails)(!0, this._store.getSource(), performance.now() - G, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), Z)
    }
    updateUserAsync(A, Q) {
      return kP1(this, void 0, void 0, function* () {
        this._resetForUser(A);
        let B = this._user;
        v8.Diagnostics._markInitOverallStart(this._sdkKey);
        let G = this.dataAdapter.getDataSync(B);
        if (this._store.setValues(G, this._user), this._setStatus("Loading", G), G = yield this.dataAdapter.getDataAsync(G, B, Q), B !== this._user) return (0, v8.createUpdateDetails)(!1, this._store.getSource(), -1, Error("User changed during update"), this._network.getLastUsedInitUrlAndReset());
        let Z = !1;
        if (G != null) v8.Diagnostics._markInitProcessStart(this._sdkKey), Z = this._store.setValues(G, this._user), v8.Diagnostics._markInitProcessEnd(this._sdkKey, {
          success: Z
        });
        if (this._finalizeUpdate(G), !Z) this._errorBoundary.attachErrorIfNoneExists(v8.UPDATE_DETAIL_ERROR_MESSAGES.NO_NETWORK_DATA), this.$emt({
          name: "initialization_failure"
        });
        v8.Diagnostics._markInitOverallEnd(this._sdkKey, Z, this._store.getCurrentSourceDetails());
        let Y = v8.Diagnostics._enqueueDiagnosticsEvent(this._user, this._logger, this._sdkKey, this._options);
        return (0, v8.createUpdateDetails)(Z, this._store.getSource(), Y, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), this._store.getWarnings())
      })
    }
    getContext() {
      return {
        sdkKey: this._sdkKey,
        options: this._options,
        values: this._store.getValues(),
        user: JSON.parse(JSON.stringify(this._user)),
        errorBoundary: this._errorBoundary,
        session: v8.StatsigSession.get(this._sdkKey),
        stableID: v8.StableID.get(this._sdkKey)
      }
    }
    checkGate(A, Q) {
      return this.getFeatureGate(A, Q).value
    }
    logEvent(A, Q, B) {
      let G = typeof A === "string" ? {
        eventName: A,
        value: Q,
        metadata: B
      } : A;
      this._logger.enqueue(Object.assign(Object.assign({}, G), {
        user: this._user,
        time: Date.now()
      }))
    }
    _primeReadyRipcord() {
      this.$on("error", () => {
        this.loadingStatus === "Loading" && this._finalizeUpdate(null)
      })
    }
    _initializeAsyncImpl(A) {
      return kP1(this, void 0, void 0, function* () {
        if (!v8.Storage.isReady()) yield v8.Storage.isReadyResolver();
        return this._logger.start(), this.updateUserAsync(this._user, A)
      })
    }
    _finalizeUpdate(A) {
      this._store.finalize(), this._setStatus("Ready", A)
    }
    _runPostUpdate(A, Q) {
      this.dataAdapter.getDataAsync(A, Q, {
        priority: "low"
      }).catch((B) => {
        v8.Log.error("An error occurred after update.", B)
      })
    }
    _resetForUser(A) {
      this._logger.reset(), this._store.reset(), this._user = this._configureUser(A, this._options)
    }
    _configureUser(A, Q) {
      var B;
      let G = (0, v8._normalizeUser)(A, Q),
        Z = (B = G.customIDs) === null || B === void 0 ? void 0 : B.stableID;
      if (Z) v8.StableID.setOverride(Z, this._sdkKey);
      return G
    }
    _getFeatureGateImpl(A, Q) {
      var B, G;
      let {
        result: Z,
        details: Y
      } = this._store.getGate(A), J = (0, v8._makeFeatureGate)(A, Y, Z), X = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getGateOverride) === null || G === void 0 ? void 0 : G.call(B, J, this._user, Q), I = X !== null && X !== void 0 ? X : J;
      return this._enqueueExposure(A, (0, v8._createGateExposure)(this._user, I, this._store.getExposureMapping()), Q), this.$emt({
        name: "gate_evaluation",
        gate: I
      }), I
    }
    _getDynamicConfigImpl(A, Q) {
      var B, G;
      let {
        result: Z,
        details: Y
      } = this._store.getConfig(A), J = (0, v8._makeDynamicConfig)(A, Y, Z), X = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getDynamicConfigOverride) === null || G === void 0 ? void 0 : G.call(B, J, this._user, Q), I = X !== null && X !== void 0 ? X : J;
      return this._enqueueExposure(A, (0, v8._createConfigExposure)(this._user, I, this._store.getExposureMapping()), Q), this.$emt({
        name: "dynamic_config_evaluation",
        dynamicConfig: I
      }), I
    }
    _getExperimentImpl(A, Q) {
      var B, G, Z, Y;
      let {
        result: J,
        details: X
      } = this._store.getConfig(A), I = (0, v8._makeExperiment)(A, X, J);
      if (I.__evaluation != null) I.__evaluation.secondary_exposures = (0, v8._mapExposures)((G = (B = I.__evaluation) === null || B === void 0 ? void 0 : B.secondary_exposures) !== null && G !== void 0 ? G : [], this._store.getExposureMapping());
      let D = (Y = (Z = this.overrideAdapter) === null || Z === void 0 ? void 0 : Z.getExperimentOverride) === null || Y === void 0 ? void 0 : Y.call(Z, I, this._user, Q),
        W = D !== null && D !== void 0 ? D : I;
      return this._enqueueExposure(A, (0, v8._createConfigExposure)(this._user, W, this._store.getExposureMapping()), Q), this.$emt({
        name: "experiment_evaluation",
        experiment: W
      }), W
    }
    _getLayerImpl(A, Q) {
      var B, G, Z;
      let {
        result: Y,
        details: J
      } = this._store.getLayer(A), X = (0, v8._makeLayer)(A, J, Y), I = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getLayerOverride) === null || G === void 0 ? void 0 : G.call(B, X, this._user, Q);
      if (Q === null || Q === void 0 ? void 0 : Q.disableExposureLog) this._logger.incrementNonExposureCount(A);
      let D = (0, v8._mergeOverride)(X, I, (Z = I === null || I === void 0 ? void 0 : I.__value) !== null && Z !== void 0 ? Z : X.__value, (W) => {
        if (Q === null || Q === void 0 ? void 0 : Q.disableExposureLog) return;
        this._enqueueExposure(A, (0, v8._createLayerParameterExposure)(this._user, D, W, this._store.getExposureMapping()), Q)
      });
      return this.$emt({
        name: "layer_evaluation",
        layer: D
      }), D
    }
    _getParameterStoreImpl(A, Q) {
      var B, G;
      let {
        result: Z,
        details: Y
      } = this._store.getParamStore(A);
      this._logger.incrementNonExposureCount(A);
      let J = {
          name: A,
          details: Y,
          __configuration: Z,
          get: (0, FCQ._makeParamStoreGetter)(this, Z, Q)
        },
        X = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getParamStoreOverride) === null || G === void 0 ? void 0 : G.call(B, J, Q);
      if (X != null) J.__configuration = X.config, J.details = X.details, J.get = (0, FCQ._makeParamStoreGetter)(this, X.config, Q);
      return J
    }
  }
  FNA.default = RaA
})
// @from(Ln 71735, Col 4)
zCQ = U((Vv) => {
  var lp4 = Vv && Vv.__createBinding || (Object.create ? function (A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function () {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function (A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    ip4 = Vv && Vv.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) lp4(Q, A, B)
    };
  Object.defineProperty(Vv, "__esModule", {
    value: !0
  });
  Vv.StatsigClient = void 0;
  var ECQ = HCQ();
  Vv.StatsigClient = ECQ.default;
  ip4(hi(), Vv);
  __STATSIG__ = Object.assign(Object.assign({}, __STATSIG__ !== null && __STATSIG__ !== void 0 ? __STATSIG__ : {}), {
    StatsigClient: ECQ.default
  });
  Vv.default = __STATSIG__
})
// @from(Ln 71766, Col 4)
np4
// @from(Ln 71766, Col 9)
ap4
// @from(Ln 71766, Col 14)
op4
// @from(Ln 71767, Col 4)
$CQ = w(() => {
  np4 = {
    visibilityState: "visible",
    documentElement: {
      lang: "en"
    },
    addEventListener: (A, Q) => {}
  }, ap4 = {
    document: np4,
    location: {
      href: "node://localhost",
      pathname: "/"
    },
    addEventListener: (A, Q) => {
      if (A === "beforeunload") process.on("exit", () => {
        if (typeof Q === "function") Q({});
        else Q.handleEvent({})
      })
    },
    focus: () => {},
    innerHeight: 768,
    innerWidth: 1024
  }, op4 = {
    sendBeacon: (A, Q) => {
      return !0
    },
    userAgent: "Mozilla/5.0 (Node.js) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0",
    language: "en-US"
  };
  if (typeof window > "u") global.window = ap4;
  if (typeof navigator > "u") global.navigator = op4
})
// @from(Ln 71811, Col 0)
function cZA() {
  return HNA.join(zQ(), "statsig")
}
// @from(Ln 71814, Col 0)
class bP1 {
  cache = new Map;
  ready = !1;
  constructor() {
    try {
      if (!CCQ(cZA())) rp4(cZA(), {
        recursive: !0
      });
      let A = sp4(cZA());
      for (let Q of A) {
        let B = decodeURIComponent(Q),
          G = tp4(HNA.join(cZA(), Q), "utf8");
        this.cache.set(B, G)
      }
      this.ready = !0
    } catch (A) {
      e(A), this.ready = !0
    }
  }
  isReady() {
    return this.ready
  }
  isReadyResolver() {
    return this.ready ? Promise.resolve() : null
  }
  getProviderName() {
    return "FileSystemStorageProvider"
  }
  getItem(A) {
    return this.cache.get(A) ?? null
  }
  setItem(A, Q) {
    this.cache.set(A, Q);
    let B = encodeURIComponent(A);
    Al4(HNA.join(cZA(), B), Q, "utf8").catch((G) => e(G))
  }
  removeItem(A) {
    this.cache.delete(A);
    let Q = encodeURIComponent(A),
      B = HNA.join(cZA(), Q);
    if (!CCQ(B)) return;
    try {
      ep4(B)
    } catch (G) {
      e(G)
    }
  }
  getAllKeys() {
    return Array.from(this.cache.keys())
  }
}
// @from(Ln 71865, Col 4)
UCQ = w(() => {
  v1();
  fQ()
})
// @from(Ln 71870, Col 0)
function _aA(A) {
  try {
    let Q = String(A),
      B = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${Q}\\").ParentProcessId"` : `ps -o ppid= -p ${Q}`,
      G = NH(B, {
        timeout: 1000
      });
    return G ? G.trim() : null
  } catch {
    return null
  }
}
// @from(Ln 71883, Col 0)
function jaA(A) {
  try {
    let Q = String(A),
      B = process.platform === "win32" ? `powershell.exe -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \\"ProcessId=${Q}\\").CommandLine"` : `ps -o command= -p ${Q}`,
      G = NH(B, {
        timeout: 1000
      });
    return G ? G.trim() : null
  } catch {
    return null
  }
}
// @from(Ln 71895, Col 4)
TaA = w(() => {
  t4()
})
// @from(Ln 71899, Col 0)
function Yl4() {
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (l0.platform !== "darwin") return Zl4() || "pycharm"
  }
  return l0.terminal
}
// @from(Ln 71905, Col 4)
Ql4
// @from(Ln 71905, Col 9)
Bl4 = () => {
    return process.platform === "linux" && process.env.CLAUDE_CODE_BUBBLEWRAP === "1"
  }
// @from(Ln 71908, Col 2)
Gl4
// @from(Ln 71908, Col 7)
Zl4
// @from(Ln 71908, Col 12)
wq
// @from(Ln 71909, Col 4)
G0A = w(() => {
  t4();
  TaA();
  Y9();
  DQ();
  T1();
  p3();
  Ql4 = W0(async () => {
    let {
      code: A
    } = await TQ("test", ["-f", "/.dockerenv"]);
    if (A !== 0) return !1;
    return process.platform === "linux"
  }), Gl4 = W0(() => {
    if (process.platform !== "linux") return !1;
    let A = vA();
    try {
      if (A.existsSync("/lib/libc.musl-x86_64.so.1") || A.existsSync("/lib/libc.musl-aarch64.so.1")) return !0;
      let Q = NH("ldd /bin/ls 2>/dev/null");
      return Q !== null && Q.includes("musl")
    } catch {
      return k("musl detection failed, assuming glibc"), !1
    }
  }), Zl4 = W0(() => {
    if (process.platform === "darwin") return null;
    try {
      let Q = process.pid.toString();
      for (let B = 0; B < 10; B++) {
        let G = jaA(Q);
        if (G) {
          let Y = G.toLowerCase();
          for (let J of $R1)
            if (Y.includes(J)) return J
        }
        let Z = _aA(Q);
        if (!Z || Z === "0" || Z === Q) break;
        Q = Z
      }
    } catch {}
    return null
  });
  wq = {
    ...l0,
    terminal: Yl4(),
    getIsDocker: Ql4,
    getIsBubblewrapSandbox: Bl4,
    isMuslEnvironment: Gl4
  }
})
// @from(Ln 71959, Col 0)
function qCQ(A) {
  if (R4() === "foundry") return;
  let Q = A.toLowerCase();
  if (Q.includes("claude-sonnet-4-5") && Q.includes("[1m]")) return "Sonnet 4.5 (with 1M context)";
  if (Q.includes("claude-sonnet-4-5")) return "Sonnet 4.5";
  if (Q.includes("claude-sonnet-4") && Q.includes("[1m]")) return "Sonnet 4 (with 1M context)";
  if (Q.includes("claude-sonnet-4")) return "Sonnet 4";
  if (Q.includes("claude-opus-4-5")) return "Opus 4.5";
  if (Q.includes("claude-opus-4-1")) return "Opus 4.1";
  if (Q.includes("claude-opus-4")) return "Opus 4";
  if (Q.includes("claude-3-7-sonnet")) return "Claude 3.7 Sonnet";
  if (Q.includes("claude-3-5-sonnet")) return "Claude 3.5 Sonnet";
  if (Q.includes("claude-haiku-4-5")) return "Haiku 4.5";
  if (Q.includes("claude-3-5-haiku")) return "Claude 3.5 Haiku";
  return
}
// @from(Ln 71975, Col 4)
ENA
// @from(Ln 71975, Col 9)
zNA
// @from(Ln 71975, Col 14)
$NA
// @from(Ln 71975, Col 19)
CNA
// @from(Ln 71975, Col 24)
Z0A
// @from(Ln 71975, Col 29)
fP1
// @from(Ln 71975, Col 34)
UNA
// @from(Ln 71975, Col 39)
qNA
// @from(Ln 71975, Col 44)
NNA
// @from(Ln 71976, Col 4)
wNA = w(() => {
  MD();
  ENA = {
    firstParty: "claude-3-7-sonnet-20250219",
    bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    vertex: "claude-3-7-sonnet@20250219",
    foundry: "claude-3-7-sonnet"
  }, zNA = {
    firstParty: "claude-3-5-sonnet-20241022",
    bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    vertex: "claude-3-5-sonnet-v2@20241022",
    foundry: "claude-3-5-sonnet"
  }, $NA = {
    firstParty: "claude-3-5-haiku-20241022",
    bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    vertex: "claude-3-5-haiku@20241022",
    foundry: "claude-3-5-haiku"
  }, CNA = {
    firstParty: "claude-haiku-4-5-20251001",
    bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
    vertex: "claude-haiku-4-5@20251001",
    foundry: "claude-haiku-4-5"
  }, Z0A = {
    firstParty: "claude-sonnet-4-20250514",
    bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
    vertex: "claude-sonnet-4@20250514",
    foundry: "claude-sonnet-4"
  }, fP1 = {
    firstParty: "claude-sonnet-4-5-20250929",
    bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    vertex: "claude-sonnet-4-5@20250929",
    foundry: "claude-sonnet-4-5"
  }, UNA = {
    firstParty: "claude-opus-4-20250514",
    bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
    vertex: "claude-opus-4@20250514",
    foundry: "claude-opus-4"
  }, qNA = {
    firstParty: "claude-opus-4-1-20250805",
    bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
    vertex: "claude-opus-4-1@20250805",
    foundry: "claude-opus-4-1"
  }, NNA = {
    firstParty: "claude-opus-4-5-20251101",
    bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
    vertex: "claude-opus-4-5@20251101",
    foundry: "claude-opus-4-5"
  }
})
// @from(Ln 72025, Col 4)
NCQ = U((Kl4) => {
  Kl4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(Kl4.HttpAuthLocation || (Kl4.HttpAuthLocation = {}));
  Kl4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(Kl4.HttpApiKeyAuthLocation || (Kl4.HttpApiKeyAuthLocation = {}));
  Kl4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(Kl4.EndpointURLScheme || (Kl4.EndpointURLScheme = {}));
  Kl4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(Kl4.AlgorithmId || (Kl4.AlgorithmId = {}));
  var Jl4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => Kl4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => Kl4.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    Xl4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    Il4 = (A) => {
      return Jl4(A)
    },
    Dl4 = (A) => {
      return Xl4(A)
    };
  Kl4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(Kl4.FieldPosition || (Kl4.FieldPosition = {}));
  var Wl4 = "__smithy_context";
  Kl4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(Kl4.IniSectionType || (Kl4.IniSectionType = {}));
  Kl4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(Kl4.RequestHandlerProtocol || (Kl4.RequestHandlerProtocol = {}));
  Kl4.SMITHY_CONTEXT_KEY = Wl4;
  Kl4.getDefaultClientConfiguration = Il4;
  Kl4.resolveDefaultRuntimeConfig = Dl4
})
// @from(Ln 72090, Col 4)
MCQ = U((ql4) => {
  var El4 = NCQ(),
    zl4 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    $l4 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class wCQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = El4.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class LCQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
    }
    setField(A) {
      this.entries[A.name.toLowerCase()] = A
    }
    getField(A) {
      return this.entries[A.toLowerCase()]
    }
    removeField(A) {
      delete this.entries[A.toLowerCase()]
    }
    getByType(A) {
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class PaA {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(A) {
      this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
    }
    static clone(A) {
      let Q = new PaA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = Cl4(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return PaA.clone(this)
    }
  }

  function Cl4(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class OCQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function Ul4(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  ql4.Field = wCQ;
  ql4.Fields = LCQ;
  ql4.HttpRequest = PaA;
  ql4.HttpResponse = OCQ;
  ql4.getHttpHandlerExtensionConfiguration = zl4;
  ql4.isValidHostname = Ul4;
  ql4.resolveHttpHandlerRuntimeConfig = $l4
})
// @from(Ln 72232, Col 4)
bg = U((Sl4) => {
  var jl4 = MCQ();

  function Tl4(A) {
    return A
  }
  var RCQ = (A) => (Q) => async (B) => {
    if (!jl4.HttpRequest.isInstance(B.request)) return Q(B);
    let {
      request: G
    } = B, {
      handlerProtocol: Z = ""
    } = A.requestHandler.metadata || {};
    if (Z.indexOf("h2") >= 0 && !G.headers[":authority"]) delete G.headers.host, G.headers[":authority"] = G.hostname + (G.port ? ":" + G.port : "");
    else if (!G.headers.host) {
      let Y = G.hostname;
      if (G.port != null) Y += `:${G.port}`;
      G.headers.host = Y
    }
    return Q(B)
  }, _CQ = {
    name: "hostHeaderMiddleware",
    step: "build",
    priority: "low",
    tags: ["HOST"],
    override: !0
  }, Pl4 = (A) => ({
    applyToStack: (Q) => {
      Q.add(RCQ(A), _CQ)
    }
  });
  Sl4.getHostHeaderPlugin = Pl4;
  Sl4.hostHeaderMiddleware = RCQ;
  Sl4.hostHeaderMiddlewareOptions = _CQ;
  Sl4.resolveHostHeaderConfig = Tl4
})
// @from(Ln 72268, Col 4)
fg = U((fl4) => {
  var jCQ = () => (A, Q) => async (B) => {
    try {
      let G = await A(B),
        {
          clientName: Z,
          commandName: Y,
          logger: J,
          dynamoDbDocumentClientOptions: X = {}
        } = Q,
        {
          overrideInputFilterSensitiveLog: I,
          overrideOutputFilterSensitiveLog: D
        } = X,
        W = I ?? Q.inputFilterSensitiveLog,
        K = D ?? Q.outputFilterSensitiveLog,
        {
          $metadata: V,
          ...F
        } = G.output;
      return J?.info?.({
        clientName: Z,
        commandName: Y,
        input: W(B.input),
        output: K(F),
        metadata: V
      }), G
    } catch (G) {
      let {
        clientName: Z,
        commandName: Y,
        logger: J,
        dynamoDbDocumentClientOptions: X = {}
      } = Q, {
        overrideInputFilterSensitiveLog: I
      } = X, D = I ?? Q.inputFilterSensitiveLog;
      throw J?.error?.({
        clientName: Z,
        commandName: Y,
        input: D(B.input),
        error: G,
        metadata: G.$metadata
      }), G
    }
  }, TCQ = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "initialize",
    override: !0
  }, bl4 = (A) => ({
    applyToStack: (Q) => {
      Q.add(jCQ(), TCQ)
    }
  });
  fl4.getLoggerPlugin = bl4;
  fl4.loggerMiddleware = jCQ;
  fl4.loggerMiddlewareOptions = TCQ
})
// @from(Ln 72326, Col 4)
SCQ = U((ml4) => {
  var ONA = {
      REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
      X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
      TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID")
    },
    pP1 = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
  if (!pP1) globalThis.awslambda = globalThis.awslambda || {};
  class SaA {
    static PROTECTED_KEYS = ONA;
    isProtectedKey(A) {
      return Object.values(ONA).includes(A)
    }
    getRequestId() {
      return this.get(ONA.REQUEST_ID) ?? "-"
    }
    getXRayTraceId() {
      return this.get(ONA.X_RAY_TRACE_ID)
    }
    getTenantId() {
      return this.get(ONA.TENANT_ID)
    }
  }
  class PCQ extends SaA {
    currentContext;
    getContext() {
      return this.currentContext
    }
    hasContext() {
      return this.currentContext !== void 0
    }
    get(A) {
      return this.currentContext?.[A]
    }
    set(A, Q) {
      if (this.isProtectedKey(A)) throw Error(`Cannot modify protected Lambda context field: ${String(A)}`);
      this.currentContext = this.currentContext || {}, this.currentContext[A] = Q
    }
    run(A, Q) {
      this.currentContext = A;
      try {
        return Q()
      } finally {
        this.currentContext = void 0
      }
    }
  }
  class iP1 extends SaA {
    als;
    static async create() {
      let A = new iP1,
        Q = await import("node:async_hooks");
      return A.als = new Q.AsyncLocalStorage, A
    }
    getContext() {
      return this.als.getStore()
    }
    hasContext() {
      return this.als.getStore() !== void 0
    }
    get(A) {
      return this.als.getStore()?.[A]
    }
    set(A, Q) {
      if (this.isProtectedKey(A)) throw Error(`Cannot modify protected Lambda context field: ${String(A)}`);
      let B = this.als.getStore();
      if (!B) throw Error("No context available");
      B[A] = Q
    }
    run(A, Q) {
      return this.als.run(A, Q)
    }
  }
  ml4.InvokeStore = void 0;
  (function (A) {
    let Q = null;
    async function B() {
      if (!Q) Q = (async () => {
        let Z = "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await iP1.create() : new PCQ;
        if (!pP1 && globalThis.awslambda?.InvokeStore) return globalThis.awslambda.InvokeStore;
        else if (!pP1 && globalThis.awslambda) return globalThis.awslambda.InvokeStore = Z, Z;
        else return Z
      })();
      return Q
    }
    A.getInstanceAsync = B, A._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? {
      reset: () => {
        if (Q = null, globalThis.awslambda?.InvokeStore) delete globalThis.awslambda.InvokeStore;
        globalThis.awslambda = {}
      }
    } : void 0
  })(ml4.InvokeStore || (ml4.InvokeStore = {}));
  ml4.InvokeStoreBase = SaA
})
// @from(Ln 72420, Col 4)
xCQ = U((al4) => {
  al4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(al4.HttpAuthLocation || (al4.HttpAuthLocation = {}));
  al4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(al4.HttpApiKeyAuthLocation || (al4.HttpApiKeyAuthLocation = {}));
  al4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(al4.EndpointURLScheme || (al4.EndpointURLScheme = {}));
  al4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(al4.AlgorithmId || (al4.AlgorithmId = {}));
  var cl4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => al4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => al4.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    pl4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    ll4 = (A) => {
      return cl4(A)
    },
    il4 = (A) => {
      return pl4(A)
    };
  al4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(al4.FieldPosition || (al4.FieldPosition = {}));
  var nl4 = "__smithy_context";
  al4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(al4.IniSectionType || (al4.IniSectionType = {}));
  al4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(al4.RequestHandlerProtocol || (al4.RequestHandlerProtocol = {}));
  al4.SMITHY_CONTEXT_KEY = nl4;
  al4.getDefaultClientConfiguration = ll4;
  al4.resolveDefaultRuntimeConfig = il4
})
// @from(Ln 72485, Col 4)
bCQ = U((Gi4) => {
  var tl4 = xCQ(),
    el4 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    Ai4 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class yCQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = tl4.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class vCQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
    }
    setField(A) {
      this.entries[A.name.toLowerCase()] = A
    }
    getField(A) {
      return this.entries[A.toLowerCase()]
    }
    removeField(A) {
      delete this.entries[A.toLowerCase()]
    }
    getByType(A) {
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class xaA {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(A) {
      this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
    }
    static clone(A) {
      let Q = new xaA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = Qi4(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return xaA.clone(this)
    }
  }

  function Qi4(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class kCQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function Bi4(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Gi4.Field = yCQ;
  Gi4.Fields = vCQ;
  Gi4.HttpRequest = xaA;
  Gi4.HttpResponse = kCQ;
  Gi4.getHttpHandlerExtensionConfiguration = el4;
  Gi4.isValidHostname = Bi4;
  Gi4.resolveHttpHandlerRuntimeConfig = Ai4
})
// @from(Ln 72627, Col 4)
gCQ = U((fCQ) => {
  Object.defineProperty(fCQ, "__esModule", {
    value: !0
  });
  fCQ.recursionDetectionMiddleware = void 0;
  var Ki4 = SCQ(),
    Vi4 = bCQ(),
    eP1 = "X-Amzn-Trace-Id",
    Fi4 = "AWS_LAMBDA_FUNCTION_NAME",
    Hi4 = "_X_AMZN_TRACE_ID",
    Ei4 = () => (A) => async (Q) => {
      let {
        request: B
      } = Q;
      if (!Vi4.HttpRequest.isInstance(B)) return A(Q);
      let G = Object.keys(B.headers ?? {}).find((W) => W.toLowerCase() === eP1.toLowerCase()) ?? eP1;
      if (B.headers.hasOwnProperty(G)) return A(Q);
      let Z = process.env[Fi4],
        Y = process.env[Hi4],
        I = (await Ki4.InvokeStore.getInstanceAsync())?.getXRayTraceId() ?? Y,
        D = (W) => typeof W === "string" && W.length > 0;
      if (D(Z) && D(I)) B.headers[eP1] = I;
      return A({
        ...Q,
        request: B
      })
    };
  fCQ.recursionDetectionMiddleware = Ei4
})
// @from(Ln 72656, Col 4)
hg = U((QS1) => {
  var AS1 = gCQ(),
    zi4 = {
      step: "build",
      tags: ["RECURSION_DETECTION"],
      name: "recursionDetectionMiddleware",
      override: !0,
      priority: "low"
    },
    $i4 = (A) => ({
      applyToStack: (Q) => {
        Q.add(AS1.recursionDetectionMiddleware(), zi4)
      }
    });
  QS1.getRecursionDetectionPlugin = $i4;
  Object.keys(AS1).forEach(function (A) {
    if (A !== "default" && !Object.prototype.hasOwnProperty.call(QS1, A)) Object.defineProperty(QS1, A, {
      enumerable: !0,
      get: function () {
        return AS1[A]
      }
    })
  })
})
// @from(Ln 72680, Col 4)
IS1 = U((Oi4) => {
  Oi4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(Oi4.HttpAuthLocation || (Oi4.HttpAuthLocation = {}));
  Oi4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(Oi4.HttpApiKeyAuthLocation || (Oi4.HttpApiKeyAuthLocation = {}));
  Oi4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(Oi4.EndpointURLScheme || (Oi4.EndpointURLScheme = {}));
  Oi4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(Oi4.AlgorithmId || (Oi4.AlgorithmId = {}));
  var Ui4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => Oi4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => Oi4.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    qi4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    Ni4 = (A) => {
      return Ui4(A)
    },
    wi4 = (A) => {
      return qi4(A)
    };
  Oi4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(Oi4.FieldPosition || (Oi4.FieldPosition = {}));
  var Li4 = "__smithy_context";
  Oi4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(Oi4.IniSectionType || (Oi4.IniSectionType = {}));
  Oi4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(Oi4.RequestHandlerProtocol || (Oi4.RequestHandlerProtocol = {}));
  Oi4.SMITHY_CONTEXT_KEY = Li4;
  Oi4.getDefaultClientConfiguration = Ni4;
  Oi4.resolveDefaultRuntimeConfig = wi4
})
// @from(Ln 72745, Col 4)
uCQ = U((yi4) => {
  yi4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(yi4.HttpAuthLocation || (yi4.HttpAuthLocation = {}));
  yi4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(yi4.HttpApiKeyAuthLocation || (yi4.HttpApiKeyAuthLocation = {}));
  yi4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(yi4.EndpointURLScheme || (yi4.EndpointURLScheme = {}));
  yi4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(yi4.AlgorithmId || (yi4.AlgorithmId = {}));
  var ji4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => yi4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => yi4.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    Ti4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    Pi4 = (A) => {
      return ji4(A)
    },
    Si4 = (A) => {
      return Ti4(A)
    };
  yi4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(yi4.FieldPosition || (yi4.FieldPosition = {}));
  var xi4 = "__smithy_context";
  yi4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(yi4.IniSectionType || (yi4.IniSectionType = {}));
  yi4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(yi4.RequestHandlerProtocol || (yi4.RequestHandlerProtocol = {}));
  yi4.SMITHY_CONTEXT_KEY = xi4;
  yi4.getDefaultClientConfiguration = Pi4;
  yi4.resolveDefaultRuntimeConfig = Si4
})
// @from(Ln 72810, Col 4)
Jz = U((gi4) => {
  var mCQ = uCQ(),
    fi4 = (A) => A[mCQ.SMITHY_CONTEXT_KEY] || (A[mCQ.SMITHY_CONTEXT_KEY] = {}),
    hi4 = (A) => {
      if (typeof A === "function") return A;
      let Q = Promise.resolve(A);
      return () => Q
    };
  gi4.getSmithyContext = fi4;
  gi4.normalizeProvider = hi4
})
// @from(Ln 72821, Col 4)
dCQ = U((ni4) => {
  ni4.HttpAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(ni4.HttpAuthLocation || (ni4.HttpAuthLocation = {}));
  ni4.HttpApiKeyAuthLocation = void 0;
  (function (A) {
    A.HEADER = "header", A.QUERY = "query"
  })(ni4.HttpApiKeyAuthLocation || (ni4.HttpApiKeyAuthLocation = {}));
  ni4.EndpointURLScheme = void 0;
  (function (A) {
    A.HTTP = "http", A.HTTPS = "https"
  })(ni4.EndpointURLScheme || (ni4.EndpointURLScheme = {}));
  ni4.AlgorithmId = void 0;
  (function (A) {
    A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
  })(ni4.AlgorithmId || (ni4.AlgorithmId = {}));
  var di4 = (A) => {
      let Q = [];
      if (A.sha256 !== void 0) Q.push({
        algorithmId: () => ni4.AlgorithmId.SHA256,
        checksumConstructor: () => A.sha256
      });
      if (A.md5 != null) Q.push({
        algorithmId: () => ni4.AlgorithmId.MD5,
        checksumConstructor: () => A.md5
      });
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    },
    ci4 = (A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    },
    pi4 = (A) => {
      return di4(A)
    },
    li4 = (A) => {
      return ci4(A)
    };
  ni4.FieldPosition = void 0;
  (function (A) {
    A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
  })(ni4.FieldPosition || (ni4.FieldPosition = {}));
  var ii4 = "__smithy_context";
  ni4.IniSectionType = void 0;
  (function (A) {
    A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
  })(ni4.IniSectionType || (ni4.IniSectionType = {}));
  ni4.RequestHandlerProtocol = void 0;
  (function (A) {
    A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
  })(ni4.RequestHandlerProtocol || (ni4.RequestHandlerProtocol = {}));
  ni4.SMITHY_CONTEXT_KEY = ii4;
  ni4.getDefaultClientConfiguration = pi4;
  ni4.resolveDefaultRuntimeConfig = li4
})
// @from(Ln 72886, Col 4)
iCQ = U((Bn4) => {
  var si4 = dCQ(),
    ti4 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    ei4 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class cCQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = si4.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class pCQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
    }
    setField(A) {
      this.entries[A.name.toLowerCase()] = A
    }
    getField(A) {
      return this.entries[A.toLowerCase()]
    }
    removeField(A) {
      delete this.entries[A.toLowerCase()]
    }
    getByType(A) {
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class yaA {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(A) {
      this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
    }
    static clone(A) {
      let Q = new yaA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = An4(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return yaA.clone(this)
    }
  }

  function An4(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class lCQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function Qn4(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Bn4.Field = cCQ;
  Bn4.Fields = pCQ;
  Bn4.HttpRequest = yaA;
  Bn4.HttpResponse = lCQ;
  Bn4.getHttpHandlerExtensionConfiguration = ti4;
  Bn4.isValidHostname = Qn4;
  Bn4.resolveHttpHandlerRuntimeConfig = ei4
})
// @from(Ln 73028, Col 4)
wS1 = U((Vn4) => {
  var Wn4 = iCQ(),
    nCQ = (A, Q) => (B, G) => async (Z) => {
      let {
        response: Y
      } = await B(Z);
      try {
        let J = await Q(Y, A);
        return {
          response: Y,
          output: J
        }
      } catch (J) {
        if (Object.defineProperty(J, "$response", {
            value: Y,
            enumerable: !1,
            writable: !1,
            configurable: !1
          }), !("$metadata" in J)) {
          try {
            J.message += `
  Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`
          } catch (I) {
            if (!G.logger || G.logger?.constructor?.name === "NoOpLogger") console.warn("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.");
            else G.logger?.warn?.("Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.")
          }
          if (typeof J.$responseBodyText < "u") {
            if (J.$response) J.$response.body = J.$responseBodyText
          }
          try {
            if (Wn4.HttpResponse.isInstance(Y)) {
              let {
                headers: I = {}
              } = Y, D = Object.entries(I);
              J.$metadata = {
                httpStatusCode: Y.statusCode,
                requestId: NS1(/^x-[\w-]+-request-?id$/, D),
                extendedRequestId: NS1(/^x-[\w-]+-id-2$/, D),
                cfId: NS1(/^x-[\w-]+-cf-id$/, D)
              }
            }
          } catch (I) {}
        }
        throw J
      }
    }, NS1 = (A, Q) => {
      return (Q.find(([B]) => {
        return B.match(A)
      }) || [void 0, void 0])[1]
    }, aCQ = (A, Q) => (B, G) => async (Z) => {
      let Y = A,
        J = G.endpointV2?.url && Y.urlParser ? async () => Y.urlParser(G.endpointV2.url): Y.endpoint;
      if (!J) throw Error("No valid endpoint provider available.");
      let X = await Q(Z.input, {
        ...A,
        endpoint: J
      });
      return B({
        ...Z,
        request: X
      })
    }, oCQ = {
      name: "deserializerMiddleware",
      step: "deserialize",
      tags: ["DESERIALIZER"],
      override: !0
    }, rCQ = {
      name: "serializerMiddleware",
      step: "serialize",
      tags: ["SERIALIZER"],
      override: !0
    };

  function Kn4(A, Q, B) {
    return {
      applyToStack: (G) => {
        G.add(nCQ(A, B), oCQ), G.add(aCQ(A, Q), rCQ)
      }
    }
  }
  Vn4.deserializerMiddleware = nCQ;
  Vn4.deserializerMiddlewareOption = oCQ;
  Vn4.getSerdePlugin = Kn4;
  Vn4.serializerMiddleware = aCQ;
  Vn4.serializerMiddlewareOption = rCQ
})
// @from(Ln 73114, Col 4)
TNA = U((Ln4) => {
  var Cn4 = IS1(),
    Un4 = (A) => {
      return {
        setHttpHandler(Q) {
          A.httpHandler = Q
        },
        httpHandler() {
          return A.httpHandler
        },
        updateHttpClientConfig(Q, B) {
          A.httpHandler?.updateHttpClientConfig(Q, B)
        },
        httpHandlerConfigs() {
          return A.httpHandler.httpHandlerConfigs()
        }
      }
    },
    qn4 = (A) => {
      return {
        httpHandler: A.httpHandler()
      }
    };
  class sCQ {
    name;
    kind;
    values;
    constructor({
      name: A,
      kind: Q = Cn4.FieldPosition.HEADER,
      values: B = []
    }) {
      this.name = A, this.kind = Q, this.values = B
    }
    add(A) {
      this.values.push(A)
    }
    set(A) {
      this.values = A
    }
    remove(A) {
      this.values = this.values.filter((Q) => Q !== A)
    }
    toString() {
      return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
    }
    get() {
      return this.values
    }
  }
  class tCQ {
    entries = {};
    encoding;
    constructor({
      fields: A = [],
      encoding: Q = "utf-8"
    }) {
      A.forEach(this.setField.bind(this)), this.encoding = Q
    }
    setField(A) {
      this.entries[A.name.toLowerCase()] = A
    }
    getField(A) {
      return this.entries[A.toLowerCase()]
    }
    removeField(A) {
      delete this.entries[A.toLowerCase()]
    }
    getByType(A) {
      return Object.values(this.entries).filter((Q) => Q.kind === A)
    }
  }
  class vaA {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(A) {
      this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
    }
    static clone(A) {
      let Q = new vaA({
        ...A,
        headers: {
          ...A.headers
        }
      });
      if (Q.query) Q.query = Nn4(Q.query);
      return Q
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return "method" in Q && "protocol" in Q && "hostname" in Q && "path" in Q && typeof Q.query === "object" && typeof Q.headers === "object"
    }
    clone() {
      return vaA.clone(this)
    }
  }

  function Nn4(A) {
    return Object.keys(A).reduce((Q, B) => {
      let G = A[B];
      return {
        ...Q,
        [B]: Array.isArray(G) ? [...G] : G
      }
    }, {})
  }
  class eCQ {
    statusCode;
    reason;
    headers;
    body;
    constructor(A) {
      this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
    }
    static isInstance(A) {
      if (!A) return !1;
      let Q = A;
      return typeof Q.statusCode === "number" && typeof Q.headers === "object"
    }
  }

  function wn4(A) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
  }
  Ln4.Field = sCQ;
  Ln4.Fields = tCQ;
  Ln4.HttpRequest = vaA;
  Ln4.HttpResponse = eCQ;
  Ln4.getHttpHandlerExtensionConfiguration = Un4;
  Ln4.isValidHostname = wn4;
  Ln4.resolveHttpHandlerRuntimeConfig = qn4
})
// @from(Ln 73256, Col 4)
AUQ = U((xn4) => {
  var Sn4 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  xn4.isArrayBuffer = Sn4
})
// @from(Ln 73260, Col 4)
kaA = U((fn4) => {
  var vn4 = AUQ(),
    LS1 = NA("buffer"),
    kn4 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!vn4.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return LS1.Buffer.from(A, Q, B)
    },
    bn4 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? LS1.Buffer.from(A, Q) : LS1.Buffer.from(A)
    };
  fn4.fromArrayBuffer = kn4;
  fn4.fromString = bn4
})
// @from(Ln 73274, Col 4)
GUQ = U((QUQ) => {
  Object.defineProperty(QUQ, "__esModule", {
    value: !0
  });
  QUQ.fromBase64 = void 0;
  var un4 = kaA(),
    mn4 = /^[A-Za-z0-9+/]*={0,2}$/,
    dn4 = (A) => {
      if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
      if (!mn4.exec(A)) throw TypeError("Invalid base64 string.");
      let Q = (0, un4.fromString)(A, "base64");
      return new Uint8Array(Q.buffer, Q.byteOffset, Q.byteLength)
    };
  QUQ.fromBase64 = dn4
})
// @from(Ln 73289, Col 4)
ZUQ = U((pn4) => {
  var cn4 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
  pn4.isArrayBuffer = cn4
})
// @from(Ln 73293, Col 4)
YUQ = U((on4) => {
  var in4 = ZUQ(),
    OS1 = NA("buffer"),
    nn4 = (A, Q = 0, B = A.byteLength - Q) => {
      if (!in4.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
      return OS1.Buffer.from(A, Q, B)
    },
    an4 = (A, Q) => {
      if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
      return Q ? OS1.Buffer.from(A, Q) : OS1.Buffer.from(A)
    };
  on4.fromArrayBuffer = nn4;
  on4.fromString = an4
})