
// @from(Start 2098799, End 2101143)
es0 = z((z4A) => {
  var QW4 = z4A && z4A.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(z4A, "__esModule", {
    value: !0
  });
  z4A.StatsigEvaluationsDataAdapter = void 0;
  var Lr = nm(),
    BW4 = Fz1();
  class ts0 extends Lr.DataAdapterCore {
    constructor() {
      super("EvaluationsDataAdapter", "evaluations");
      this._network = null, this._options = null
    }
    attach(A, Q) {
      super.attach(A, Q), this._network = new BW4.default(Q !== null && Q !== void 0 ? Q : {})
    }
    getDataAsync(A, Q, B) {
      return this._getDataAsyncImpl(A, (0, Lr._normalizeUser)(Q, this._options), B)
    }
    prefetchData(A, Q) {
      return this._prefetchDataImpl(A, Q)
    }
    setData(A) {
      let Q = (0, Lr._typedJsonParse)(A, "has_updates", "data");
      if (Q && "user" in Q) super.setData(A, Q.user);
      else Lr.Log.error("StatsigUser not found. You may be using an older server SDK version. Please upgrade your SDK or use setDataLegacy.")
    }
    setDataLegacy(A, Q) {
      super.setData(A, Q)
    }
    _fetchFromNetwork(A, Q, B, G) {
      var Z;
      return QW4(this, void 0, void 0, function*() {
        let I = yield(Z = this._network) === null || Z === void 0 ? void 0 : Z.fetchEvaluations(this._getSdkKey(), A, B === null || B === void 0 ? void 0 : B.priority, Q, G);
        return I !== null && I !== void 0 ? I : null
      })
    }
    _getCacheKey(A) {
      var Q;
      let B = (0, Lr._getStorageKey)(this._getSdkKey(), A, (Q = this._options) === null || Q === void 0 ? void 0 : Q.customUserCacheKeyFunc);
      return `${Lr.DataAdapterCachePrefix}.${this._cacheSuffix}.${B}`
    }
    _isCachedResultValidFor204(A, Q) {
      return A.fullUserHash != null && A.fullUserHash === (0, Lr._getFullUserHash)(Q)
    }
  }
  z4A.StatsigEvaluationsDataAdapter = ts0
})
// @from(Start 2101149, End 2111653)
Qr0 = z((EDA) => {
  var Dz1 = EDA && EDA.__awaiter || function(A, Q, B, G) {
    function Z(I) {
      return I instanceof B ? I : new B(function(Y) {
        Y(I)
      })
    }
    return new(B || (B = Promise))(function(I, Y) {
      function J(V) {
        try {
          X(G.next(V))
        } catch (F) {
          Y(F)
        }
      }

      function W(V) {
        try {
          X(G.throw(V))
        } catch (F) {
          Y(F)
        }
      }

      function X(V) {
        V.done ? I(V.value) : Z(V.value).then(J, W)
      }
      X((G = G.apply(A, Q || [])).next())
    })
  };
  Object.defineProperty(EDA, "__esModule", {
    value: !0
  });
  var L6 = nm(),
    GW4 = ms0(),
    ZW4 = Fz1(),
    Ar0 = os0(),
    IW4 = es0();
  class $bA extends L6.StatsigClientBase {
    static instance(A) {
      let Q = (0, L6._getStatsigGlobal)().instance(A);
      if (Q instanceof $bA) return Q;
      return L6.Log.warn((0, L6._isServerEnv)() ? "StatsigClient.instance is not supported in server environments" : "Unable to find StatsigClient instance"), new $bA(A !== null && A !== void 0 ? A : "", {})
    }
    constructor(A, Q, B = null) {
      var G, Z;
      L6.SDKType._setClientType(A, "javascript-client");
      let I = new ZW4.default(B, (J) => {
        this.$emt(J)
      });
      super(A, (G = B === null || B === void 0 ? void 0 : B.dataAdapter) !== null && G !== void 0 ? G : new IW4.StatsigEvaluationsDataAdapter, I, B);
      this.getFeatureGate = this._memoize(L6.MemoPrefix._gate, this._getFeatureGateImpl.bind(this)), this.getDynamicConfig = this._memoize(L6.MemoPrefix._dynamicConfig, this._getDynamicConfigImpl.bind(this)), this.getExperiment = this._memoize(L6.MemoPrefix._experiment, this._getExperimentImpl.bind(this)), this.getLayer = this._memoize(L6.MemoPrefix._layer, this._getLayerImpl.bind(this)), this.getParameterStore = this._memoize(L6.MemoPrefix._paramStore, this._getParameterStoreImpl.bind(this)), this._store = new GW4.default(A), this._network = I, this._user = this._configureUser(Q, B);
      let Y = (Z = B === null || B === void 0 ? void 0 : B.plugins) !== null && Z !== void 0 ? Z : [];
      for (let J of Y) J.bind(this)
    }
    initializeSync(A) {
      var Q;
      if (this.loadingStatus !== "Uninitialized") return (0, L6.createUpdateDetails)(!0, this._store.getSource(), -1, null, null, ["MultipleInitializations", ...(Q = this._store.getWarnings()) !== null && Q !== void 0 ? Q : []]);
      return this._logger.start(), this.updateUserSync(this._user, A)
    }
    initializeAsync(A) {
      return Dz1(this, void 0, void 0, function*() {
        if (this._initializePromise) return this._initializePromise;
        return this._initializePromise = this._initializeAsyncImpl(A), this._initializePromise
      })
    }
    updateUserSync(A, Q) {
      var B;
      let G = performance.now(),
        Z = [...(B = this._store.getWarnings()) !== null && B !== void 0 ? B : []];
      this._resetForUser(A);
      let I = this.dataAdapter.getDataSync(this._user);
      if (I == null) Z.push("NoCachedValues");
      this._store.setValues(I, this._user), this._finalizeUpdate(I);
      let Y = Q === null || Q === void 0 ? void 0 : Q.disableBackgroundCacheRefresh;
      if (Y === !0 || Y == null && (I === null || I === void 0 ? void 0 : I.source) === "Bootstrap") return (0, L6.createUpdateDetails)(!0, this._store.getSource(), performance.now() - G, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), Z);
      return this._runPostUpdate(I !== null && I !== void 0 ? I : null, this._user), (0, L6.createUpdateDetails)(!0, this._store.getSource(), performance.now() - G, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), Z)
    }
    updateUserAsync(A, Q) {
      return Dz1(this, void 0, void 0, function*() {
        this._resetForUser(A);
        let B = this._user;
        L6.Diagnostics._markInitOverallStart(this._sdkKey);
        let G = this.dataAdapter.getDataSync(B);
        if (this._store.setValues(G, this._user), this._setStatus("Loading", G), G = yield this.dataAdapter.getDataAsync(G, B, Q), B !== this._user) return (0, L6.createUpdateDetails)(!1, this._store.getSource(), -1, Error("User changed during update"), this._network.getLastUsedInitUrlAndReset());
        let Z = !1;
        if (G != null) L6.Diagnostics._markInitProcessStart(this._sdkKey), Z = this._store.setValues(G, this._user), L6.Diagnostics._markInitProcessEnd(this._sdkKey, {
          success: Z
        });
        if (this._finalizeUpdate(G), !Z) this._errorBoundary.attachErrorIfNoneExists(L6.UPDATE_DETAIL_ERROR_MESSAGES.NO_NETWORK_DATA), this.$emt({
          name: "initialization_failure"
        });
        L6.Diagnostics._markInitOverallEnd(this._sdkKey, Z, this._store.getCurrentSourceDetails());
        let I = L6.Diagnostics._enqueueDiagnosticsEvent(this._user, this._logger, this._sdkKey, this._options);
        return (0, L6.createUpdateDetails)(Z, this._store.getSource(), I, this._errorBoundary.getLastSeenErrorAndReset(), this._network.getLastUsedInitUrlAndReset(), this._store.getWarnings())
      })
    }
    getContext() {
      return {
        sdkKey: this._sdkKey,
        options: this._options,
        values: this._store.getValues(),
        user: JSON.parse(JSON.stringify(this._user)),
        errorBoundary: this._errorBoundary,
        session: L6.StatsigSession.get(this._sdkKey),
        stableID: L6.StableID.get(this._sdkKey)
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
      return Dz1(this, void 0, void 0, function*() {
        if (!L6.Storage.isReady()) yield L6.Storage.isReadyResolver();
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
        L6.Log.error("An error occurred after update.", B)
      })
    }
    _resetForUser(A) {
      this._logger.reset(), this._store.reset(), this._user = this._configureUser(A, this._options)
    }
    _configureUser(A, Q) {
      var B;
      let G = (0, L6._normalizeUser)(A, Q),
        Z = (B = G.customIDs) === null || B === void 0 ? void 0 : B.stableID;
      if (Z) L6.StableID.setOverride(Z, this._sdkKey);
      return G
    }
    _getFeatureGateImpl(A, Q) {
      var B, G;
      let {
        result: Z,
        details: I
      } = this._store.getGate(A), Y = (0, L6._makeFeatureGate)(A, I, Z), J = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getGateOverride) === null || G === void 0 ? void 0 : G.call(B, Y, this._user, Q), W = J !== null && J !== void 0 ? J : Y;
      return this._enqueueExposure(A, (0, L6._createGateExposure)(this._user, W, this._store.getExposureMapping()), Q), this.$emt({
        name: "gate_evaluation",
        gate: W
      }), W
    }
    _getDynamicConfigImpl(A, Q) {
      var B, G;
      let {
        result: Z,
        details: I
      } = this._store.getConfig(A), Y = (0, L6._makeDynamicConfig)(A, I, Z), J = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getDynamicConfigOverride) === null || G === void 0 ? void 0 : G.call(B, Y, this._user, Q), W = J !== null && J !== void 0 ? J : Y;
      return this._enqueueExposure(A, (0, L6._createConfigExposure)(this._user, W, this._store.getExposureMapping()), Q), this.$emt({
        name: "dynamic_config_evaluation",
        dynamicConfig: W
      }), W
    }
    _getExperimentImpl(A, Q) {
      var B, G, Z, I;
      let {
        result: Y,
        details: J
      } = this._store.getConfig(A), W = (0, L6._makeExperiment)(A, J, Y);
      if (W.__evaluation != null) W.__evaluation.secondary_exposures = (0, L6._mapExposures)((G = (B = W.__evaluation) === null || B === void 0 ? void 0 : B.secondary_exposures) !== null && G !== void 0 ? G : [], this._store.getExposureMapping());
      let X = (I = (Z = this.overrideAdapter) === null || Z === void 0 ? void 0 : Z.getExperimentOverride) === null || I === void 0 ? void 0 : I.call(Z, W, this._user, Q),
        V = X !== null && X !== void 0 ? X : W;
      return this._enqueueExposure(A, (0, L6._createConfigExposure)(this._user, V, this._store.getExposureMapping()), Q), this.$emt({
        name: "experiment_evaluation",
        experiment: V
      }), V
    }
    _getLayerImpl(A, Q) {
      var B, G, Z;
      let {
        result: I,
        details: Y
      } = this._store.getLayer(A), J = (0, L6._makeLayer)(A, Y, I), W = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getLayerOverride) === null || G === void 0 ? void 0 : G.call(B, J, this._user, Q);
      if (Q === null || Q === void 0 ? void 0 : Q.disableExposureLog) this._logger.incrementNonExposureCount(A);
      let X = (0, L6._mergeOverride)(J, W, (Z = W === null || W === void 0 ? void 0 : W.__value) !== null && Z !== void 0 ? Z : J.__value, (V) => {
        if (Q === null || Q === void 0 ? void 0 : Q.disableExposureLog) return;
        this._enqueueExposure(A, (0, L6._createLayerParameterExposure)(this._user, X, V, this._store.getExposureMapping()), Q)
      });
      return this.$emt({
        name: "layer_evaluation",
        layer: X
      }), X
    }
    _getParameterStoreImpl(A, Q) {
      var B, G;
      let {
        result: Z,
        details: I
      } = this._store.getParamStore(A);
      this._logger.incrementNonExposureCount(A);
      let Y = {
          name: A,
          details: I,
          __configuration: Z,
          get: (0, Ar0._makeParamStoreGetter)(this, Z, Q)
        },
        J = (G = (B = this.overrideAdapter) === null || B === void 0 ? void 0 : B.getParamStoreOverride) === null || G === void 0 ? void 0 : G.call(B, Y, Q);
      if (J != null) Y.__configuration = J.config, Y.details = J.details, Y.get = (0, Ar0._makeParamStoreGetter)(this, J.config, Q);
      return Y
    }
  }
  EDA.default = $bA
})
// @from(Start 2111659, End 2112658)
Gr0 = z((DS) => {
  var YW4 = DS && DS.__createBinding || (Object.create ? function(A, Q, B, G) {
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
    JW4 = DS && DS.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) YW4(Q, A, B)
    };
  Object.defineProperty(DS, "__esModule", {
    value: !0
  });
  DS.StatsigClient = void 0;
  var Br0 = Qr0();
  DS.StatsigClient = Br0.default;
  JW4(nm(), DS);
  __STATSIG__ = Object.assign(Object.assign({}, __STATSIG__ !== null && __STATSIG__ !== void 0 ? __STATSIG__ : {}), {
    StatsigClient: Br0.default
  });
  DS.default = __STATSIG__
})
// @from(Start 2112664, End 2112667)
WW4
// @from(Start 2112669, End 2112672)
XW4
// @from(Start 2112674, End 2112677)
VW4
// @from(Start 2112683, End 2113468)
Zr0 = L(() => {
  WW4 = {
    visibilityState: "visible",
    documentElement: {
      lang: "en"
    },
    addEventListener: (A, Q) => {}
  }, XW4 = {
    document: WW4,
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
  }, VW4 = {
    sendBeacon: (A, Q) => {
      return !0
    },
    userAgent: "Mozilla/5.0 (Node.js) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0",
    language: "en-US"
  };
  if (typeof window > "u") global.window = XW4;
  if (typeof navigator > "u") global.navigator = VW4
})
// @from(Start 2113652, End 2113705)
function U4A() {
  return zDA.join(MQ(), "statsig")
}
// @from(Start 2113706, End 2114768)
class Hz1 {
  cache = new Map;
  ready = !1;
  constructor() {
    try {
      if (!Ir0(U4A())) FW4(U4A(), {
        recursive: !0
      });
      let A = KW4(U4A());
      for (let Q of A) {
        let B = decodeURIComponent(Q),
          G = DW4(zDA.join(U4A(), Q), "utf8");
        this.cache.set(B, G)
      }
      this.ready = !0
    } catch (A) {
      AA(A), this.ready = !0
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
    try {
      let B = encodeURIComponent(A);
      HW4(zDA.join(U4A(), B), Q, "utf8")
    } catch (B) {
      AA(B)
    }
  }
  removeItem(A) {
    this.cache.delete(A);
    let Q = encodeURIComponent(A),
      B = zDA.join(U4A(), Q);
    if (!Ir0(B)) return;
    try {
      CW4(B)
    } catch (G) {
      AA(G)
    }
  }
  getAllKeys() {
    return Array.from(this.cache.keys())
  }
}
// @from(Start 2114773, End 2114806)
Yr0 = L(() => {
  g1();
  hQ()
})
// @from(Start 2114812, End 2114906)
Jr0 = "https://e531a1d9ec1de9064fae9d4affb0b0f4@o1158394.ingest.us.sentry.io/4508259541909504"
// @from(Start 2114910, End 2114968)
Wr0 = "client-RRNS7R65EAtReO5XA4xDC3eU6ZdJQi6lLEP6b5j32Me"
// @from(Start 2114972, End 2114984)
Cz1 = void 0
// @from(Start 2114988, End 2115016)
Xr0 = "sdk-zAZezfDKGoZuXXKe"
// @from(Start 2115019, End 2115053)
function Fr0() {
  return "prod"
}
// @from(Start 2115055, End 2115227)
function Kr0() {
  switch (Fr0()) {
    case "local":
      return "-local-oauth";
    case "staging":
      return "-staging-oauth";
    case "prod":
      return ""
  }
}
// @from(Start 2115229, End 2115256)
function UW4() {
  return
}
// @from(Start 2115258, End 2115415)
function e9() {
  switch (Fr0()) {
    case "local":
      return $W4;
    case "staging":
      return UW4() ?? Vr0;
    case "prod":
      return Vr0
  }
}
// @from(Start 2115420, End 2115442)
wbA = "user:inference"
// @from(Start 2115446, End 2115472)
EW4 = "org:create_api_key"
// @from(Start 2115476, End 2115500)
$4A = "oauth-2025-04-20"
// @from(Start 2115504, End 2115507)
zW4
// @from(Start 2115509, End 2115512)
Ez1
// @from(Start 2115514, End 2115517)
Dr0
// @from(Start 2115519, End 2115522)
Vr0
// @from(Start 2115524, End 2115527)
$W4
// @from(Start 2115533, End 2117249)
NX = L(() => {
  hQ();
  zW4 = [EW4, "user:profile"], Ez1 = ["user:profile", wbA, "user:sessions:claude_code"], Dr0 = Array.from(new Set([...zW4, ...Ez1])), Vr0 = {
    BASE_API_URL: "https://api.anthropic.com",
    CONSOLE_AUTHORIZE_URL: "https://console.anthropic.com/oauth/authorize",
    CLAUDE_AI_AUTHORIZE_URL: "https://claude.ai/oauth/authorize",
    TOKEN_URL: "https://console.anthropic.com/v1/oauth/token",
    API_KEY_URL: "https://api.anthropic.com/api/oauth/claude_cli/create_api_key",
    ROLES_URL: "https://api.anthropic.com/api/oauth/claude_cli/roles",
    CONSOLE_SUCCESS_URL: "https://console.anthropic.com/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
    CLAUDEAI_SUCCESS_URL: "https://console.anthropic.com/oauth/code/success?app=claude-code",
    MANUAL_REDIRECT_URL: "https://console.anthropic.com/oauth/code/callback",
    CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e",
    OAUTH_FILE_SUFFIX: ""
  };
  $W4 = {
    BASE_API_URL: "http://localhost:3000",
    CONSOLE_AUTHORIZE_URL: "http://localhost:3000/oauth/authorize",
    CLAUDE_AI_AUTHORIZE_URL: "http://localhost:4000/oauth/authorize",
    TOKEN_URL: "http://localhost:3000/v1/oauth/token",
    API_KEY_URL: "http://localhost:3000/api/oauth/claude_cli/create_api_key",
    ROLES_URL: "http://localhost:3000/api/oauth/claude_cli/roles",
    CONSOLE_SUCCESS_URL: "http://localhost:3000/buy_credits?returnUrl=/oauth/code/success%3Fapp%3Dclaude-code",
    CLAUDEAI_SUCCESS_URL: "http://localhost:3000/oauth/code/success?app=claude-code",
    MANUAL_REDIRECT_URL: "https://console.staging.ant.dev/oauth/code/callback",
    CLIENT_ID: "22422756-60c9-4084-8eb7-27705fd5cf9a",
    OAUTH_FILE_SUFFIX: "-local-oauth"
  }
})
// @from(Start 2117412, End 2117603)
function nK() {
  if (RA().existsSync(zz1(MQ(), ".config.json"))) return zz1(MQ(), ".config.json");
  let A = `.claude${Kr0()}.json`;
  return zz1(process.env.CLAUDE_CONFIG_DIR || qW4(), A)
}
// @from(Start 2117604, End 2117822)
async function w4A(A) {
  try {
    let {
      cmd: Q
    } = Uz1.findActualExecutable(A, []);
    try {
      return wW4(Q, Hr0.F_OK | Hr0.X_OK), !0
    } catch {
      return !1
    }
  } catch {
    return !1
  }
}
// @from(Start 2117824, End 2120029)
function PW4() {
  if (process.env.CURSOR_TRACE_ID) return "cursor";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("/.cursor-server/")) return "cursor";
  if (process.env.VSCODE_GIT_ASKPASS_MAIN?.includes("/.windsurf-server/")) return "windsurf";
  let A = process.env.__CFBundleIdentifier?.toLowerCase();
  if (A?.includes("vscodium")) return "codium";
  if (A?.includes("windsurf")) return "windsurf";
  if (A?.includes("com.google.android.studio")) return "androidstudio";
  if (A) {
    for (let Q of TW4)
      if (A.includes(Q)) return Q
  }
  if (process.env.VisualStudioVersion) return "visualstudio";
  if (process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm") {
    if (process.platform === "darwin") return "pycharm";
    return "pycharm"
  }
  if (process.env.TERM === "xterm-ghostty") return "ghostty";
  if (process.env.TERM?.includes("kitty")) return "kitty";
  if (process.env.TERM_PROGRAM) return process.env.TERM_PROGRAM;
  if (process.env.STY) return "screen";
  if (process.env.KONSOLE_VERSION) return "konsole";
  if (process.env.GNOME_TERMINAL_SERVICE) return "gnome-terminal";
  if (process.env.XTERM_VERSION) return "xterm";
  if (process.env.VTE_VERSION) return "vte-based";
  if (process.env.TERMINATOR_UUID) return "terminator";
  if (process.env.KITTY_WINDOW_ID) return "kitty";
  if (process.env.ALACRITTY_LOG) return "alacritty";
  if (process.env.TILIX_ID) return "tilix";
  if (process.env.WT_SESSION) return "windows-terminal";
  if (process.env.SESSIONNAME && process.env.TERM === "cygwin") return "cygwin";
  if (process.env.MSYSTEM) return process.env.MSYSTEM.toLowerCase();
  if (process.env.ConEmuANSI || process.env.ConEmuPID || process.env.ConEmuTask) return "conemu";
  if (process.env.WSL_DISTRO_NAME) return `wsl-${process.env.WSL_DISTRO_NAME}`;
  if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY) return "ssh-session";
  if (process.env.TERM) {
    let Q = process.env.TERM;
    if (Q.includes("alacritty")) return "alacritty";
    if (Q.includes("rxvt")) return "rxvt";
    if (Q.includes("termite")) return "termite";
    return process.env.TERM
  }
  if (!process.stdout.isTTY) return "non-interactive";
  return null
}
// @from(Start 2120034, End 2120037)
Uz1
// @from(Start 2120039, End 2120042)
NW4
// @from(Start 2120044, End 2120047)
LW4
// @from(Start 2120049, End 2120052)
MW4
// @from(Start 2120054, End 2120057)
Cr0
// @from(Start 2120059, End 2120062)
OW4
// @from(Start 2120064, End 2120149)
RW4 = () => {
    return process.env.__CFBundleIdentifier === "com.conductor.app"
  }
// @from(Start 2120153, End 2120156)
TW4
// @from(Start 2120158, End 2120161)
jW4
// @from(Start 2120163, End 2120165)
d0
// @from(Start 2120171, End 2124154)
c5 = L(() => {
  l2();
  O3();
  AQ();
  OZ();
  hQ();
  NX();
  Uz1 = BA(vK1(), 1);
  NW4 = s1(async () => {
    try {
      let A = o9(),
        Q = setTimeout(() => A.abort(), 1000);
      return await YQ.head("http://1.1.1.1", {
        signal: A.signal
      }), clearTimeout(Q), !0
    } catch {
      return !1
    }
  });
  LW4 = s1(async () => {
    let A = [];
    if (await w4A("npm")) A.push("npm");
    if (await w4A("yarn")) A.push("yarn");
    if (await w4A("pnpm")) A.push("pnpm");
    return A
  }), MW4 = s1(async () => {
    let A = [];
    if (await w4A("bun")) A.push("bun");
    if (await w4A("deno")) A.push("deno");
    if (await w4A("node")) A.push("node");
    return A
  }), Cr0 = s1(() => {
    try {
      return RA().existsSync("/proc/sys/fs/binfmt_misc/WSLInterop")
    } catch (A) {
      return !1
    }
  }), OW4 = s1(() => {
    try {
      if (!Cr0()) return !1;
      let {
        cmd: A
      } = Uz1.findActualExecutable("npm", []);
      return A.startsWith("/mnt/c/")
    } catch (A) {
      return !1
    }
  }), TW4 = ["pycharm", "intellij", "webstorm", "phpstorm", "rubymine", "clion", "goland", "rider", "datagrip", "appcode", "dataspell", "aqua", "gateway", "fleet", "jetbrains", "androidstudio"];
  jW4 = s1(() => {
    if (process.env.CODESPACES === "true") return "codespaces";
    if (process.env.GITPOD_WORKSPACE_ID) return "gitpod";
    if (process.env.REPL_ID || process.env.REPL_SLUG) return "replit";
    if (process.env.PROJECT_DOMAIN) return "glitch";
    if (process.env.VERCEL === "1") return "vercel";
    if (process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_SERVICE_NAME) return "railway";
    if (process.env.RENDER === "true") return "render";
    if (process.env.NETLIFY === "true") return "netlify";
    if (process.env.DYNO) return "heroku";
    if (process.env.FLY_APP_NAME || process.env.FLY_MACHINE_ID) return "fly.io";
    if (process.env.CF_PAGES === "1") return "cloudflare-pages";
    if (process.env.DENO_DEPLOYMENT_ID) return "deno-deploy";
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) return "aws-lambda";
    if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_FARGATE") return "aws-fargate";
    if (process.env.AWS_EXECUTION_ENV === "AWS_ECS_EC2") return "aws-ecs";
    try {
      if (RA().existsSync("/sys/hypervisor/uuid")) {
        if (RA().readFileSync("/sys/hypervisor/uuid", {
            encoding: "utf8"
          }).trim().toLowerCase().startsWith("ec2")) return "aws-ec2"
      }
    } catch {}
    if (process.env.K_SERVICE) return "gcp-cloud-run";
    if (process.env.GOOGLE_CLOUD_PROJECT) return "gcp";
    if (process.env.WEBSITE_SITE_NAME || process.env.WEBSITE_SKU) return "azure-app-service";
    if (process.env.AZURE_FUNCTIONS_ENVIRONMENT) return "azure-functions";
    if (process.env.APP_URL?.includes("ondigitalocean.app")) return "digitalocean-app-platform";
    if (process.env.SPACE_CREATOR_USER_ID) return "huggingface-spaces";
    if (process.env.GITHUB_ACTIONS === "true") return "github-actions";
    if (process.env.GITLAB_CI === "true") return "gitlab-ci";
    if (process.env.CIRCLECI) return "circleci";
    if (process.env.BUILDKITE) return "buildkite";
    if (Y0(!1)) return "ci";
    if (process.env.KUBERNETES_SERVICE_HOST) return "kubernetes";
    try {
      if (RA().existsSync("/.dockerenv")) return "docker"
    } catch {}
    if (d0.platform === "darwin") return "unknown-darwin";
    if (d0.platform === "linux") return "unknown-linux";
    if (d0.platform === "win32") return "unknown-win32";
    return "unknown"
  }), d0 = {
    hasInternetAccess: NW4,
    isCI: Y0(!1),
    platform: ["win32", "darwin"].includes(process.platform) ? process.platform : "linux",
    arch: process.arch,
    nodeVersion: process.version,
    terminal: PW4(),
    getPackageManagers: LW4,
    getRuntimes: MW4,
    isRunningWithBun: s1(ms),
    isWslEnvironment: Cr0,
    isNpmFromWindowsPath: OW4,
    isConductor: RW4,
    detectDeploymentEnvironment: jW4
  }
})
// @from(Start 2124157, End 2129642)
function $DA(A, Q = !1) {
  let B = A.length,
    G = 0,
    Z = "",
    I = 0,
    Y = 16,
    J = 0,
    W = 0,
    X = 0,
    V = 0,
    F = 0;

  function K(w, N) {
    let R = 0,
      T = 0;
    while (R < w || !N) {
      let y = A.charCodeAt(G);
      if (y >= 48 && y <= 57) T = T * 16 + y - 48;
      else if (y >= 65 && y <= 70) T = T * 16 + y - 65 + 10;
      else if (y >= 97 && y <= 102) T = T * 16 + y - 97 + 10;
      else break;
      G++, R++
    }
    if (R < w) T = -1;
    return T
  }

  function D(w) {
    G = w, Z = "", I = 0, Y = 16, F = 0
  }

  function H() {
    let w = G;
    if (A.charCodeAt(G) === 48) G++;
    else {
      G++;
      while (G < A.length && q4A(A.charCodeAt(G))) G++
    }
    if (G < A.length && A.charCodeAt(G) === 46)
      if (G++, G < A.length && q4A(A.charCodeAt(G))) {
        G++;
        while (G < A.length && q4A(A.charCodeAt(G))) G++
      } else return F = 3, A.substring(w, G);
    let N = G;
    if (G < A.length && (A.charCodeAt(G) === 69 || A.charCodeAt(G) === 101)) {
      if (G++, G < A.length && A.charCodeAt(G) === 43 || A.charCodeAt(G) === 45) G++;
      if (G < A.length && q4A(A.charCodeAt(G))) {
        G++;
        while (G < A.length && q4A(A.charCodeAt(G))) G++;
        N = G
      } else F = 3
    }
    return A.substring(w, N)
  }

  function C() {
    let w = "",
      N = G;
    while (!0) {
      if (G >= B) {
        w += A.substring(N, G), F = 2;
        break
      }
      let R = A.charCodeAt(G);
      if (R === 34) {
        w += A.substring(N, G), G++;
        break
      }
      if (R === 92) {
        if (w += A.substring(N, G), G++, G >= B) {
          F = 2;
          break
        }
        switch (A.charCodeAt(G++)) {
          case 34:
            w += '"';
            break;
          case 92:
            w += "\\";
            break;
          case 47:
            w += "/";
            break;
          case 98:
            w += "\b";
            break;
          case 102:
            w += "\f";
            break;
          case 110:
            w += `
`;
            break;
          case 114:
            w += "\r";
            break;
          case 116:
            w += "\t";
            break;
          case 117:
            let y = K(4, !0);
            if (y >= 0) w += String.fromCharCode(y);
            else F = 4;
            break;
          default:
            F = 5
        }
        N = G;
        continue
      }
      if (R >= 0 && R <= 31)
        if (UDA(R)) {
          w += A.substring(N, G), F = 2;
          break
        } else F = 6;
      G++
    }
    return w
  }

  function E() {
    if (Z = "", F = 0, I = G, W = J, V = X, G >= B) return I = B, Y = 17;
    let w = A.charCodeAt(G);
    if ($z1(w)) {
      do G++, Z += String.fromCharCode(w), w = A.charCodeAt(G); while ($z1(w));
      return Y = 15
    }
    if (UDA(w)) {
      if (G++, Z += String.fromCharCode(w), w === 13 && A.charCodeAt(G) === 10) G++, Z += `
`;
      return J++, X = G, Y = 14
    }
    switch (w) {
      case 123:
        return G++, Y = 1;
      case 125:
        return G++, Y = 2;
      case 91:
        return G++, Y = 3;
      case 93:
        return G++, Y = 4;
      case 58:
        return G++, Y = 6;
      case 44:
        return G++, Y = 5;
      case 34:
        return G++, Z = C(), Y = 10;
      case 47:
        let N = G - 1;
        if (A.charCodeAt(G + 1) === 47) {
          G += 2;
          while (G < B) {
            if (UDA(A.charCodeAt(G))) break;
            G++
          }
          return Z = A.substring(N, G), Y = 12
        }
        if (A.charCodeAt(G + 1) === 42) {
          G += 2;
          let R = B - 1,
            T = !1;
          while (G < R) {
            let y = A.charCodeAt(G);
            if (y === 42 && A.charCodeAt(G + 1) === 47) {
              G += 2, T = !0;
              break
            }
            if (G++, UDA(y)) {
              if (y === 13 && A.charCodeAt(G) === 10) G++;
              J++, X = G
            }
          }
          if (!T) G++, F = 1;
          return Z = A.substring(N, G), Y = 13
        }
        return Z += String.fromCharCode(w), G++, Y = 16;
      case 45:
        if (Z += String.fromCharCode(w), G++, G === B || !q4A(A.charCodeAt(G))) return Y = 16;
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        return Z += H(), Y = 11;
      default:
        while (G < B && U(w)) G++, w = A.charCodeAt(G);
        if (I !== G) {
          switch (Z = A.substring(I, G), Z) {
            case "true":
              return Y = 8;
            case "false":
              return Y = 9;
            case "null":
              return Y = 7
          }
          return Y = 16
        }
        return Z += String.fromCharCode(w), G++, Y = 16
    }
  }

  function U(w) {
    if ($z1(w) || UDA(w)) return !1;
    switch (w) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return !1
    }
    return !0
  }

  function q() {
    let w;
    do w = E(); while (w >= 12 && w <= 15);
    return w
  }
  return {
    setPosition: D,
    getPosition: () => G,
    scan: Q ? q : E,
    getToken: () => Y,
    getTokenValue: () => Z,
    getTokenOffset: () => I,
    getTokenLength: () => G - I,
    getTokenStartLine: () => W,
    getTokenStartCharacter: () => I - V,
    getTokenError: () => F
  }
}
// @from(Start 2129644, End 2129692)
function $z1(A) {
  return A === 32 || A === 9
}
// @from(Start 2129694, End 2129743)
function UDA(A) {
  return A === 10 || A === 13
}
// @from(Start 2129745, End 2129792)
function q4A(A) {
  return A >= 48 && A <= 57
}
// @from(Start 2129797, End 2129800)
Er0
// @from(Start 2129806, End 2131666)
qbA = L(() => {
  (function(A) {
    A[A.lineFeed = 10] = "lineFeed", A[A.carriageReturn = 13] = "carriageReturn", A[A.space = 32] = "space", A[A._0 = 48] = "_0", A[A._1 = 49] = "_1", A[A._2 = 50] = "_2", A[A._3 = 51] = "_3", A[A._4 = 52] = "_4", A[A._5 = 53] = "_5", A[A._6 = 54] = "_6", A[A._7 = 55] = "_7", A[A._8 = 56] = "_8", A[A._9 = 57] = "_9", A[A.a = 97] = "a", A[A.b = 98] = "b", A[A.c = 99] = "c", A[A.d = 100] = "d", A[A.e = 101] = "e", A[A.f = 102] = "f", A[A.g = 103] = "g", A[A.h = 104] = "h", A[A.i = 105] = "i", A[A.j = 106] = "j", A[A.k = 107] = "k", A[A.l = 108] = "l", A[A.m = 109] = "m", A[A.n = 110] = "n", A[A.o = 111] = "o", A[A.p = 112] = "p", A[A.q = 113] = "q", A[A.r = 114] = "r", A[A.s = 115] = "s", A[A.t = 116] = "t", A[A.u = 117] = "u", A[A.v = 118] = "v", A[A.w = 119] = "w", A[A.x = 120] = "x", A[A.y = 121] = "y", A[A.z = 122] = "z", A[A.A = 65] = "A", A[A.B = 66] = "B", A[A.C = 67] = "C", A[A.D = 68] = "D", A[A.E = 69] = "E", A[A.F = 70] = "F", A[A.G = 71] = "G", A[A.H = 72] = "H", A[A.I = 73] = "I", A[A.J = 74] = "J", A[A.K = 75] = "K", A[A.L = 76] = "L", A[A.M = 77] = "M", A[A.N = 78] = "N", A[A.O = 79] = "O", A[A.P = 80] = "P", A[A.Q = 81] = "Q", A[A.R = 82] = "R", A[A.S = 83] = "S", A[A.T = 84] = "T", A[A.U = 85] = "U", A[A.V = 86] = "V", A[A.W = 87] = "W", A[A.X = 88] = "X", A[A.Y = 89] = "Y", A[A.Z = 90] = "Z", A[A.asterisk = 42] = "asterisk", A[A.backslash = 92] = "backslash", A[A.closeBrace = 125] = "closeBrace", A[A.closeBracket = 93] = "closeBracket", A[A.colon = 58] = "colon", A[A.comma = 44] = "comma", A[A.dot = 46] = "dot", A[A.doubleQuote = 34] = "doubleQuote", A[A.minus = 45] = "minus", A[A.openBrace = 123] = "openBrace", A[A.openBracket = 91] = "openBracket", A[A.plus = 43] = "plus", A[A.slash = 47] = "slash", A[A.formFeed = 12] = "formFeed", A[A.tab = 9] = "tab"
  })(Er0 || (Er0 = {}))
})
// @from(Start 2131672, End 2131674)
Vw
// @from(Start 2131676, End 2131679)
wz1
// @from(Start 2131681, End 2131684)
zr0
// @from(Start 2131690, End 2132417)
Ur0 = L(() => {
  Vw = Array(20).fill(0).map((A, Q) => {
    return " ".repeat(Q)
  }), wz1 = {
    " ": {
      "\n": Array(200).fill(0).map((A, Q) => {
        return `
` + " ".repeat(Q)
      }),
      "\r": Array(200).fill(0).map((A, Q) => {
        return "\r" + " ".repeat(Q)
      }),
      "\r\n": Array(200).fill(0).map((A, Q) => {
        return `\r
` + " ".repeat(Q)
      })
    },
    "\t": {
      "\n": Array(200).fill(0).map((A, Q) => {
        return `
` + "\t".repeat(Q)
      }),
      "\r": Array(200).fill(0).map((A, Q) => {
        return "\r" + "\t".repeat(Q)
      }),
      "\r\n": Array(200).fill(0).map((A, Q) => {
        return `\r
` + "\t".repeat(Q)
      })
    }
  }, zr0 = [`
`, "\r", `\r
`]
})
// @from(Start 2132420, End 2135666)
function qz1(A, Q, B) {
  let G, Z, I, Y, J;
  if (Q) {
    Y = Q.offset, J = Y + Q.length, I = Y;
    while (I > 0 && !wDA(A, I - 1)) I--;
    let R = J;
    while (R < A.length && !wDA(A, R)) R++;
    Z = A.substring(I, R), G = _W4(Z, B)
  } else Z = A, G = 0, I = 0, Y = 0, J = A.length;
  let W = kW4(B, A),
    X = zr0.includes(W),
    V = 0,
    F = 0,
    K;
  if (B.insertSpaces) K = Vw[B.tabSize || 4] ?? N4A(Vw[1], B.tabSize || 4);
  else K = "\t";
  let D = K === "\t" ? "\t" : " ",
    H = $DA(Z, !1),
    C = !1;

  function E() {
    if (V > 1) return N4A(W, V) + N4A(K, G + F);
    let R = K.length * (G + F);
    if (!X || R > wz1[D][W].length) return W + N4A(K, G + F);
    if (R <= 0) return W;
    return wz1[D][W][R]
  }

  function U() {
    let R = H.scan();
    V = 0;
    while (R === 15 || R === 14) {
      if (R === 14 && B.keepLines) V += 1;
      else if (R === 14) V = 1;
      R = H.scan()
    }
    return C = R === 16 || H.getTokenError() !== 0, R
  }
  let q = [];

  function w(R, T, y) {
    if (!C && (!Q || T < J && y > Y) && A.substring(T, y) !== R) q.push({
      offset: T,
      length: y - T,
      content: R
    })
  }
  let N = U();
  if (B.keepLines && V > 0) w(N4A(W, V), 0, 0);
  if (N !== 17) {
    let R = H.getTokenOffset() + I,
      T = K.length * G < 20 && B.insertSpaces ? Vw[K.length * G] : N4A(K, G);
    w(T, I, R)
  }
  while (N !== 17) {
    let R = H.getTokenOffset() + H.getTokenLength() + I,
      T = U(),
      y = "",
      v = !1;
    while (V === 0 && (T === 12 || T === 13)) {
      let p = H.getTokenOffset() + I;
      w(Vw[1], R, p), R = H.getTokenOffset() + H.getTokenLength() + I, v = T === 12, y = v ? E() : "", T = U()
    }
    if (T === 2) {
      if (N !== 1) F--;
      if (B.keepLines && V > 0 || !B.keepLines && N !== 1) y = E();
      else if (B.keepLines) y = Vw[1]
    } else if (T === 4) {
      if (N !== 3) F--;
      if (B.keepLines && V > 0 || !B.keepLines && N !== 3) y = E();
      else if (B.keepLines) y = Vw[1]
    } else {
      switch (N) {
        case 3:
        case 1:
          if (F++, B.keepLines && V > 0 || !B.keepLines) y = E();
          else y = Vw[1];
          break;
        case 5:
          if (B.keepLines && V > 0 || !B.keepLines) y = E();
          else y = Vw[1];
          break;
        case 12:
          y = E();
          break;
        case 13:
          if (V > 0) y = E();
          else if (!v) y = Vw[1];
          break;
        case 6:
          if (B.keepLines && V > 0) y = E();
          else if (!v) y = Vw[1];
          break;
        case 10:
          if (B.keepLines && V > 0) y = E();
          else if (T === 6 && !v) y = "";
          break;
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          if (B.keepLines && V > 0) y = E();
          else if ((T === 12 || T === 13) && !v) y = Vw[1];
          else if (T !== 5 && T !== 17) C = !0;
          break;
        case 16:
          C = !0;
          break
      }
      if (V > 0 && (T === 12 || T === 13)) y = E()
    }
    if (T === 17)
      if (B.keepLines && V > 0) y = E();
      else y = B.insertFinalNewline ? W : "";
    let x = H.getTokenOffset() + I;
    w(y, R, x), N = T
  }
  return q
}
// @from(Start 2135668, End 2135753)
function N4A(A, Q) {
  let B = "";
  for (let G = 0; G < Q; G++) B += A;
  return B
}
// @from(Start 2135755, End 2135989)
function _W4(A, Q) {
  let B = 0,
    G = 0,
    Z = Q.tabSize || 4;
  while (B < A.length) {
    let I = A.charAt(B);
    if (I === Vw[1]) G++;
    else if (I === "\t") G += Z;
    else break;
    B++
  }
  return Math.floor(G / Z)
}
// @from(Start 2135991, End 2136254)
function kW4(A, Q) {
  for (let B = 0; B < Q.length; B++) {
    let G = Q.charAt(B);
    if (G === "\r") {
      if (B + 1 < Q.length && Q.charAt(B + 1) === `
`) return `\r
`;
      return "\r"
    } else if (G === `
`) return `
`
  }
  return A && A.eol || `
`
}
// @from(Start 2136256, End 2136321)
function wDA(A, Q) {
  return `\r
`.indexOf(A.charAt(Q)) !== -1
}
// @from(Start 2136326, End 2136361)
Nz1 = L(() => {
  qbA();
  Ur0()
})
// @from(Start 2136364, End 2137040)
function $r0(A, Q = [], B = qDA.DEFAULT) {
  let G = null,
    Z = [],
    I = [];

  function Y(W) {
    if (Array.isArray(Z)) Z.push(W);
    else if (G !== null) Z[G] = W
  }
  return Mz1(A, {
    onObjectBegin: () => {
      let W = {};
      Y(W), I.push(Z), Z = W, G = null
    },
    onObjectProperty: (W) => {
      G = W
    },
    onObjectEnd: () => {
      Z = I.pop()
    },
    onArrayBegin: () => {
      let W = [];
      Y(W), I.push(Z), Z = W, G = null
    },
    onArrayEnd: () => {
      Z = I.pop()
    },
    onLiteralValue: Y,
    onError: (W, X, V) => {
      Q.push({
        error: W,
        offset: X,
        length: V
      })
    }
  }, B), Z[0]
}
// @from(Start 2137042, End 2138676)
function Lz1(A, Q = [], B = qDA.DEFAULT) {
  let G = {
    type: "array",
    offset: -1,
    length: -1,
    children: [],
    parent: void 0
  };

  function Z(W) {
    if (G.type === "property") G.length = W - G.offset, G = G.parent
  }

  function I(W) {
    return G.children.push(W), W
  }
  Mz1(A, {
    onObjectBegin: (W) => {
      G = I({
        type: "object",
        offset: W,
        length: -1,
        parent: G,
        children: []
      })
    },
    onObjectProperty: (W, X, V) => {
      G = I({
        type: "property",
        offset: X,
        length: -1,
        parent: G,
        children: []
      }), G.children.push({
        type: "string",
        value: W,
        offset: X,
        length: V,
        parent: G
      })
    },
    onObjectEnd: (W, X) => {
      Z(W + X), G.length = W + X - G.offset, G = G.parent, Z(W + X)
    },
    onArrayBegin: (W, X) => {
      G = I({
        type: "array",
        offset: W,
        length: -1,
        parent: G,
        children: []
      })
    },
    onArrayEnd: (W, X) => {
      G.length = W + X - G.offset, G = G.parent, Z(W + X)
    },
    onLiteralValue: (W, X, V) => {
      I({
        type: xW4(W),
        offset: X,
        length: V,
        parent: G,
        value: W
      }), Z(X + V)
    },
    onSeparator: (W, X, V) => {
      if (G.type === "property") {
        if (W === ":") G.colonOffset = X;
        else if (W === ",") Z(X)
      }
    },
    onError: (W, X, V) => {
      Q.push({
        error: W,
        offset: X,
        length: V
      })
    }
  }, B);
  let J = G.children[0];
  if (J) delete J.parent;
  return J
}
// @from(Start 2138678, End 2139249)
function NbA(A, Q) {
  if (!A) return;
  let B = A;
  for (let G of Q)
    if (typeof G === "string") {
      if (B.type !== "object" || !Array.isArray(B.children)) return;
      let Z = !1;
      for (let I of B.children)
        if (Array.isArray(I.children) && I.children[0].value === G && I.children.length === 2) {
          B = I.children[1], Z = !0;
          break
        } if (!Z) return
    } else {
      let Z = G;
      if (B.type !== "array" || Z < 0 || !Array.isArray(B.children) || Z >= B.children.length) return;
      B = B.children[Z]
    } return B
}
// @from(Start 2139251, End 2143198)
function Mz1(A, Q, B = qDA.DEFAULT) {
  let G = $DA(A, !1),
    Z = [];

  function I(e) {
    return e ? () => e(G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter()) : () => !0
  }

  function Y(e) {
    return e ? () => e(G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter(), () => Z.slice()) : () => !0
  }

  function J(e) {
    return e ? (l) => e(l, G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter()) : () => !0
  }

  function W(e) {
    return e ? (l) => e(l, G.getTokenOffset(), G.getTokenLength(), G.getTokenStartLine(), G.getTokenStartCharacter(), () => Z.slice()) : () => !0
  }
  let X = Y(Q.onObjectBegin),
    V = W(Q.onObjectProperty),
    F = I(Q.onObjectEnd),
    K = Y(Q.onArrayBegin),
    D = I(Q.onArrayEnd),
    H = W(Q.onLiteralValue),
    C = J(Q.onSeparator),
    E = I(Q.onComment),
    U = J(Q.onError),
    q = B && B.disallowComments,
    w = B && B.allowTrailingComma;

  function N() {
    while (!0) {
      let e = G.scan();
      switch (G.getTokenError()) {
        case 4:
          R(14);
          break;
        case 5:
          R(15);
          break;
        case 3:
          R(13);
          break;
        case 1:
          if (!q) R(11);
          break;
        case 2:
          R(12);
          break;
        case 6:
          R(16);
          break
      }
      switch (e) {
        case 12:
        case 13:
          if (q) R(10);
          else E();
          break;
        case 16:
          R(1);
          break;
        case 15:
        case 14:
          break;
        default:
          return e
      }
    }
  }

  function R(e, l = [], k = []) {
    if (U(e), l.length + k.length > 0) {
      let m = G.getToken();
      while (m !== 17) {
        if (l.indexOf(m) !== -1) {
          N();
          break
        } else if (k.indexOf(m) !== -1) break;
        m = N()
      }
    }
  }

  function T(e) {
    let l = G.getTokenValue();
    if (e) H(l);
    else V(l), Z.push(l);
    return N(), !0
  }

  function y() {
    switch (G.getToken()) {
      case 11:
        let e = G.getTokenValue(),
          l = Number(e);
        if (isNaN(l)) R(2), l = 0;
        H(l);
        break;
      case 7:
        H(null);
        break;
      case 8:
        H(!0);
        break;
      case 9:
        H(!1);
        break;
      default:
        return !1
    }
    return N(), !0
  }

  function v() {
    if (G.getToken() !== 10) return R(3, [], [2, 5]), !1;
    if (T(!1), G.getToken() === 6) {
      if (C(":"), N(), !u()) R(4, [], [2, 5])
    } else R(5, [], [2, 5]);
    return Z.pop(), !0
  }

  function x() {
    X(), N();
    let e = !1;
    while (G.getToken() !== 2 && G.getToken() !== 17) {
      if (G.getToken() === 5) {
        if (!e) R(4, [], []);
        if (C(","), N(), G.getToken() === 2 && w) break
      } else if (e) R(6, [], []);
      if (!v()) R(4, [], [2, 5]);
      e = !0
    }
    if (F(), G.getToken() !== 2) R(7, [2], []);
    else N();
    return !0
  }

  function p() {
    K(), N();
    let e = !0,
      l = !1;
    while (G.getToken() !== 4 && G.getToken() !== 17) {
      if (G.getToken() === 5) {
        if (!l) R(4, [], []);
        if (C(","), N(), G.getToken() === 4 && w) break
      } else if (l) R(6, [], []);
      if (e) Z.push(0), e = !1;
      else Z[Z.length - 1]++;
      if (!u()) R(4, [], [4, 5]);
      l = !0
    }
    if (D(), !e) Z.pop();
    if (G.getToken() !== 4) R(8, [4], []);
    else N();
    return !0
  }

  function u() {
    switch (G.getToken()) {
      case 3:
        return p();
      case 1:
        return x();
      case 10:
        return T(!0);
      default:
        return y()
    }
  }
  if (N(), G.getToken() === 17) {
    if (B.allowEmptyContent) return !0;
    return R(4, [], []), !1
  }
  if (!u()) return R(4, [], []), !1;
  if (G.getToken() !== 17) R(9, [], []);
  return !0
}
// @from(Start 2143200, End 2143533)
function xW4(A) {
  switch (typeof A) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!A) return "null";
      else if (Array.isArray(A)) return "array";
      return "object"
    }
    default:
      return "null"
  }
}
// @from(Start 2143538, End 2143541)
qDA
// @from(Start 2143547, End 2143668)
Oz1 = L(() => {
  qbA();
  (function(A) {
    A.DEFAULT = {
      allowTrailingComma: !1
    }
  })(qDA || (qDA = {}))
})
// @from(Start 2143671, End 2147621)
function wr0(A, Q, B, G) {
  let Z = Q.slice(),
    Y = Lz1(A, []),
    J = void 0,
    W = void 0;
  while (Z.length > 0)
    if (W = Z.pop(), J = NbA(Y, Z), J === void 0 && B !== void 0)
      if (typeof W === "string") B = {
        [W]: B
      };
      else B = [B];
  else break;
  if (!J) {
    if (B === void 0) throw Error("Can not delete in empty document");
    return Mr(A, {
      offset: Y ? Y.offset : 0,
      length: Y ? Y.length : 0,
      content: JSON.stringify(B)
    }, G)
  } else if (J.type === "object" && typeof W === "string" && Array.isArray(J.children)) {
    let X = NbA(J, [W]);
    if (X !== void 0)
      if (B === void 0) {
        if (!X.parent) throw Error("Malformed AST");
        let V = J.children.indexOf(X.parent),
          F, K = X.parent.offset + X.parent.length;
        if (V > 0) {
          let D = J.children[V - 1];
          F = D.offset + D.length
        } else if (F = J.offset + 1, J.children.length > 1) K = J.children[1].offset;
        return Mr(A, {
          offset: F,
          length: K - F,
          content: ""
        }, G)
      } else return Mr(A, {
        offset: X.offset,
        length: X.length,
        content: JSON.stringify(B)
      }, G);
    else {
      if (B === void 0) return [];
      let V = `${JSON.stringify(W)}: ${JSON.stringify(B)}`,
        F = G.getInsertionIndex ? G.getInsertionIndex(J.children.map((D) => D.children[0].value)) : J.children.length,
        K;
      if (F > 0) {
        let D = J.children[F - 1];
        K = {
          offset: D.offset + D.length,
          length: 0,
          content: "," + V
        }
      } else if (J.children.length === 0) K = {
        offset: J.offset + 1,
        length: 0,
        content: V
      };
      else K = {
        offset: J.offset + 1,
        length: 0,
        content: V + ","
      };
      return Mr(A, K, G)
    }
  } else if (J.type === "array" && typeof W === "number" && Array.isArray(J.children)) {
    let X = W;
    if (X === -1) {
      let V = `${JSON.stringify(B)}`,
        F;
      if (J.children.length === 0) F = {
        offset: J.offset + 1,
        length: 0,
        content: V
      };
      else {
        let K = J.children[J.children.length - 1];
        F = {
          offset: K.offset + K.length,
          length: 0,
          content: "," + V
        }
      }
      return Mr(A, F, G)
    } else if (B === void 0 && J.children.length >= 0) {
      let V = W,
        F = J.children[V],
        K;
      if (J.children.length === 1) K = {
        offset: J.offset + 1,
        length: J.length - 2,
        content: ""
      };
      else if (J.children.length - 1 === V) {
        let D = J.children[V - 1],
          H = D.offset + D.length,
          C = J.offset + J.length;
        K = {
          offset: H,
          length: C - 2 - H,
          content: ""
        }
      } else K = {
        offset: F.offset,
        length: J.children[V + 1].offset - F.offset,
        content: ""
      };
      return Mr(A, K, G)
    } else if (B !== void 0) {
      let V, F = `${JSON.stringify(B)}`;
      if (!G.isArrayInsertion && J.children.length > W) {
        let K = J.children[W];
        V = {
          offset: K.offset,
          length: K.length,
          content: F
        }
      } else if (J.children.length === 0 || W === 0) V = {
        offset: J.offset + 1,
        length: 0,
        content: J.children.length === 0 ? F : F + ","
      };
      else {
        let K = W > J.children.length ? J.children.length : W,
          D = J.children[K - 1];
        V = {
          offset: D.offset + D.length,
          length: 0,
          content: "," + F
        }
      }
      return Mr(A, V, G)
    } else throw Error(`Can not ${B===void 0?"remove":G.isArrayInsertion?"insert":"modify"} Array index ${X} as length is not sufficient`)
  } else throw Error(`Can not add ${typeof W!=="number"?"index":"property"} to parent of type ${J.type}`)
}
// @from(Start 2147623, End 2148314)
function Mr(A, Q, B) {
  if (!B.formattingOptions) return [Q];
  let G = LbA(A, Q),
    Z = Q.offset,
    I = Q.offset + Q.content.length;
  if (Q.length === 0 || Q.content.length === 0) {
    while (Z > 0 && !wDA(G, Z - 1)) Z--;
    while (I < G.length && !wDA(G, I)) I++
  }
  let Y = qz1(G, {
    offset: Z,
    length: I - Z
  }, {
    ...B.formattingOptions,
    keepLines: !1
  });
  for (let W = Y.length - 1; W >= 0; W--) {
    let X = Y[W];
    G = LbA(G, X), Z = Math.min(Z, X.offset), I = Math.max(I, X.offset + X.length), I += X.content.length - X.length
  }
  let J = A.length - (G.length - I) - Z;
  return [{
    offset: Z,
    length: J,
    content: G.substring(Z, I)
  }]
}
// @from(Start 2148316, End 2148419)
function LbA(A, Q) {
  return A.substring(0, Q.offset) + Q.content + A.substring(Q.offset + Q.length)
}
// @from(Start 2148424, End 2148459)
qr0 = L(() => {
  Nz1();
  Oz1()
})
// @from(Start 2148462, End 2148515)
function Or0(A, Q, B, G) {
  return wr0(A, Q, B, G)
}
// @from(Start 2148517, End 2148885)
function Rr0(A, Q) {
  let B = Q.slice(0).sort((Z, I) => {
      let Y = Z.offset - I.offset;
      if (Y === 0) return Z.length - I.length;
      return Y
    }),
    G = A.length;
  for (let Z = B.length - 1; Z >= 0; Z--) {
    let I = B[Z];
    if (I.offset + I.length <= G) A = LbA(A, I);
    else throw Error("Overlapping edit");
    G = I.offset
  }
  return A
}
// @from(Start 2148890, End 2148893)
Nr0
// @from(Start 2148895, End 2148898)
Lr0
// @from(Start 2148900, End 2148903)
Rz1
// @from(Start 2148905, End 2148908)
Mr0
// @from(Start 2148914, End 2150990)
Tr0 = L(() => {
  Nz1();
  qr0();
  qbA();
  Oz1();
  (function(A) {
    A[A.None = 0] = "None", A[A.UnexpectedEndOfComment = 1] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 2] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 3] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 4] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 5] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 6] = "InvalidCharacter"
  })(Nr0 || (Nr0 = {}));
  (function(A) {
    A[A.OpenBraceToken = 1] = "OpenBraceToken", A[A.CloseBraceToken = 2] = "CloseBraceToken", A[A.OpenBracketToken = 3] = "OpenBracketToken", A[A.CloseBracketToken = 4] = "CloseBracketToken", A[A.CommaToken = 5] = "CommaToken", A[A.ColonToken = 6] = "ColonToken", A[A.NullKeyword = 7] = "NullKeyword", A[A.TrueKeyword = 8] = "TrueKeyword", A[A.FalseKeyword = 9] = "FalseKeyword", A[A.StringLiteral = 10] = "StringLiteral", A[A.NumericLiteral = 11] = "NumericLiteral", A[A.LineCommentTrivia = 12] = "LineCommentTrivia", A[A.BlockCommentTrivia = 13] = "BlockCommentTrivia", A[A.LineBreakTrivia = 14] = "LineBreakTrivia", A[A.Trivia = 15] = "Trivia", A[A.Unknown = 16] = "Unknown", A[A.EOF = 17] = "EOF"
  })(Lr0 || (Lr0 = {}));
  Rz1 = $r0;
  (function(A) {
    A[A.InvalidSymbol = 1] = "InvalidSymbol", A[A.InvalidNumberFormat = 2] = "InvalidNumberFormat", A[A.PropertyNameExpected = 3] = "PropertyNameExpected", A[A.ValueExpected = 4] = "ValueExpected", A[A.ColonExpected = 5] = "ColonExpected", A[A.CommaExpected = 6] = "CommaExpected", A[A.CloseBraceExpected = 7] = "CloseBraceExpected", A[A.CloseBracketExpected = 8] = "CloseBracketExpected", A[A.EndOfFileExpected = 9] = "EndOfFileExpected", A[A.InvalidCommentToken = 10] = "InvalidCommentToken", A[A.UnexpectedEndOfComment = 11] = "UnexpectedEndOfComment", A[A.UnexpectedEndOfString = 12] = "UnexpectedEndOfString", A[A.UnexpectedEndOfNumber = 13] = "UnexpectedEndOfNumber", A[A.InvalidUnicode = 14] = "InvalidUnicode", A[A.InvalidEscapeCharacter = 15] = "InvalidEscapeCharacter", A[A.InvalidCharacter = 16] = "InvalidCharacter"
  })(Mr0 || (Mr0 = {}))
})
// @from(Start 2151042, End 2151153)
function Pr0(A) {
  if (!A) return null;
  try {
    return Rz1(A)
  } catch (Q) {
    return AA(Q), null
  }
}
// @from(Start 2151154, End 2151558)
async function Or(A) {
  try {
    let Q = await fW4(A, "utf8");
    if (!Q.trim()) return [];
    return Q.split(`
`).filter((B) => B.trim()).map((B) => {
      try {
        return JSON.parse(B)
      } catch (G) {
        return AA(Error(`Error parsing line in ${A}: ${G}`)), null
      }
    }).filter((B) => B !== null)
  } catch (Q) {
    return AA(Error(`Error opening file ${A}: ${Q}`)), []
  }
}
// @from(Start 2151560, End 2152163)
function jr0(A, Q) {
  try {
    if (!A || A.trim() === "") return JSON.stringify([Q], null, 4);
    let B = Rz1(A);
    if (Array.isArray(B)) {
      let G = B.length,
        Y = Or0(A, G === 0 ? [0] : [G], Q, {
          formattingOptions: {
            insertSpaces: !0,
            tabSize: 4
          },
          isArrayInsertion: !0
        });
      if (!Y || Y.length === 0) {
        let J = [...B, Q];
        return JSON.stringify(J, null, 4)
      }
      return Rr0(A, Y)
    } else return JSON.stringify([Q], null, 4)
  } catch (B) {
    return AA(B), JSON.stringify([Q], null, 4)
  }
}
// @from(Start 2152168, End 2152170)
f7
// @from(Start 2152176, End 2152374)
LF = L(() => {
  g1();
  Tr0();
  l2();
  f7 = s1((A, Q = !0) => {
    if (!A) return null;
    try {
      return JSON.parse(A)
    } catch (B) {
      if (Q) AA(B);
      return null
    }
  })
})
// @from(Start 2152380, End 2158733)
_r0 = z((SK7, Sr0) => {
  var am = UA("constants"),
    hW4 = process.cwd,
    MbA = null,
    gW4 = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    if (!MbA) MbA = hW4.call(process);
    return MbA
  };
  try {
    process.cwd()
  } catch (A) {}
  if (typeof process.chdir === "function") {
    if (ObA = process.chdir, process.chdir = function(A) {
        MbA = null, ObA.call(process, A)
      }, Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, ObA)
  }
  var ObA;
  Sr0.exports = uW4;

  function uW4(A) {
    if (am.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) Q(A);
    if (!A.lutimes) B(A);
    if (A.chown = I(A.chown), A.fchown = I(A.fchown), A.lchown = I(A.lchown), A.chmod = G(A.chmod), A.fchmod = G(A.fchmod), A.lchmod = G(A.lchmod), A.chownSync = Y(A.chownSync), A.fchownSync = Y(A.fchownSync), A.lchownSync = Y(A.lchownSync), A.chmodSync = Z(A.chmodSync), A.fchmodSync = Z(A.fchmodSync), A.lchmodSync = Z(A.lchmodSync), A.stat = J(A.stat), A.fstat = J(A.fstat), A.lstat = J(A.lstat), A.statSync = W(A.statSync), A.fstatSync = W(A.fstatSync), A.lstatSync = W(A.lstatSync), A.chmod && !A.lchmod) A.lchmod = function(V, F, K) {
      if (K) process.nextTick(K)
    }, A.lchmodSync = function() {};
    if (A.chown && !A.lchown) A.lchown = function(V, F, K, D) {
      if (D) process.nextTick(D)
    }, A.lchownSync = function() {};
    if (gW4 === "win32") A.rename = typeof A.rename !== "function" ? A.rename : function(V) {
      function F(K, D, H) {
        var C = Date.now(),
          E = 0;
        V(K, D, function U(q) {
          if (q && (q.code === "EACCES" || q.code === "EPERM" || q.code === "EBUSY") && Date.now() - C < 60000) {
            if (setTimeout(function() {
                A.stat(D, function(w, N) {
                  if (w && w.code === "ENOENT") V(K, D, U);
                  else H(q)
                })
              }, E), E < 100) E += 10;
            return
          }
          if (H) H(q)
        })
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(F, V);
      return F
    }(A.rename);
    A.read = typeof A.read !== "function" ? A.read : function(V) {
      function F(K, D, H, C, E, U) {
        var q;
        if (U && typeof U === "function") {
          var w = 0;
          q = function(N, R, T) {
            if (N && N.code === "EAGAIN" && w < 10) return w++, V.call(A, K, D, H, C, E, q);
            U.apply(this, arguments)
          }
        }
        return V.call(A, K, D, H, C, E, q)
      }
      if (Object.setPrototypeOf) Object.setPrototypeOf(F, V);
      return F
    }(A.read), A.readSync = typeof A.readSync !== "function" ? A.readSync : function(V) {
      return function(F, K, D, H, C) {
        var E = 0;
        while (!0) try {
          return V.call(A, F, K, D, H, C)
        } catch (U) {
          if (U.code === "EAGAIN" && E < 10) {
            E++;
            continue
          }
          throw U
        }
      }
    }(A.readSync);

    function Q(V) {
      V.lchmod = function(F, K, D) {
        V.open(F, am.O_WRONLY | am.O_SYMLINK, K, function(H, C) {
          if (H) {
            if (D) D(H);
            return
          }
          V.fchmod(C, K, function(E) {
            V.close(C, function(U) {
              if (D) D(E || U)
            })
          })
        })
      }, V.lchmodSync = function(F, K) {
        var D = V.openSync(F, am.O_WRONLY | am.O_SYMLINK, K),
          H = !0,
          C;
        try {
          C = V.fchmodSync(D, K), H = !1
        } finally {
          if (H) try {
            V.closeSync(D)
          } catch (E) {} else V.closeSync(D)
        }
        return C
      }
    }

    function B(V) {
      if (am.hasOwnProperty("O_SYMLINK") && V.futimes) V.lutimes = function(F, K, D, H) {
        V.open(F, am.O_SYMLINK, function(C, E) {
          if (C) {
            if (H) H(C);
            return
          }
          V.futimes(E, K, D, function(U) {
            V.close(E, function(q) {
              if (H) H(U || q)
            })
          })
        })
      }, V.lutimesSync = function(F, K, D) {
        var H = V.openSync(F, am.O_SYMLINK),
          C, E = !0;
        try {
          C = V.futimesSync(H, K, D), E = !1
        } finally {
          if (E) try {
            V.closeSync(H)
          } catch (U) {} else V.closeSync(H)
        }
        return C
      };
      else if (V.futimes) V.lutimes = function(F, K, D, H) {
        if (H) process.nextTick(H)
      }, V.lutimesSync = function() {}
    }

    function G(V) {
      if (!V) return V;
      return function(F, K, D) {
        return V.call(A, F, K, function(H) {
          if (X(H)) H = null;
          if (D) D.apply(this, arguments)
        })
      }
    }

    function Z(V) {
      if (!V) return V;
      return function(F, K) {
        try {
          return V.call(A, F, K)
        } catch (D) {
          if (!X(D)) throw D
        }
      }
    }

    function I(V) {
      if (!V) return V;
      return function(F, K, D, H) {
        return V.call(A, F, K, D, function(C) {
          if (X(C)) C = null;
          if (H) H.apply(this, arguments)
        })
      }
    }

    function Y(V) {
      if (!V) return V;
      return function(F, K, D) {
        try {
          return V.call(A, F, K, D)
        } catch (H) {
          if (!X(H)) throw H
        }
      }
    }

    function J(V) {
      if (!V) return V;
      return function(F, K, D) {
        if (typeof K === "function") D = K, K = null;

        function H(C, E) {
          if (E) {
            if (E.uid < 0) E.uid += 4294967296;
            if (E.gid < 0) E.gid += 4294967296
          }
          if (D) D.apply(this, arguments)
        }
        return K ? V.call(A, F, K, H) : V.call(A, F, H)
      }
    }

    function W(V) {
      if (!V) return V;
      return function(F, K) {
        var D = K ? V.call(A, F, K) : V.call(A, F);
        if (D) {
          if (D.uid < 0) D.uid += 4294967296;
          if (D.gid < 0) D.gid += 4294967296
        }
        return D
      }
    }

    function X(V) {
      if (!V) return !0;
      if (V.code === "ENOSYS") return !0;
      var F = !process.getuid || process.getuid() !== 0;
      if (F) {
        if (V.code === "EINVAL" || V.code === "EPERM") return !0
      }
      return !1
    }
  }
})
// @from(Start 2158739, End 2160855)
xr0 = z((_K7, yr0) => {
  var kr0 = UA("stream").Stream;
  yr0.exports = mW4;

  function mW4(A) {
    return {
      ReadStream: Q,
      WriteStream: B
    };

    function Q(G, Z) {
      if (!(this instanceof Q)) return new Q(G, Z);
      kr0.call(this);
      var I = this;
      this.path = G, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, Z = Z || {};
      var Y = Object.keys(Z);
      for (var J = 0, W = Y.length; J < W; J++) {
        var X = Y[J];
        this[X] = Z[X]
      }
      if (this.encoding) this.setEncoding(this.encoding);
      if (this.start !== void 0) {
        if (typeof this.start !== "number") throw TypeError("start must be a Number");
        if (this.end === void 0) this.end = 1 / 0;
        else if (typeof this.end !== "number") throw TypeError("end must be a Number");
        if (this.start > this.end) throw Error("start must be <= end");
        this.pos = this.start
      }
      if (this.fd !== null) {
        process.nextTick(function() {
          I._read()
        });
        return
      }
      A.open(this.path, this.flags, this.mode, function(V, F) {
        if (V) {
          I.emit("error", V), I.readable = !1;
          return
        }
        I.fd = F, I.emit("open", F), I._read()
      })
    }

    function B(G, Z) {
      if (!(this instanceof B)) return new B(G, Z);
      kr0.call(this), this.path = G, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, Z = Z || {};
      var I = Object.keys(Z);
      for (var Y = 0, J = I.length; Y < J; Y++) {
        var W = I[Y];
        this[W] = Z[W]
      }
      if (this.start !== void 0) {
        if (typeof this.start !== "number") throw TypeError("start must be a Number");
        if (this.start < 0) throw Error("start must be >= zero");
        this.pos = this.start
      }
      if (this.busy = !1, this._queue = [], this.fd === null) this._open = A.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush()
    }
  }
})
// @from(Start 2160861, End 2161321)
br0 = z((kK7, vr0) => {
  vr0.exports = cW4;
  var dW4 = Object.getPrototypeOf || function(A) {
    return A.__proto__
  };

  function cW4(A) {
    if (A === null || typeof A !== "object") return A;
    if (A instanceof Object) var Q = {
      __proto__: dW4(A)
    };
    else var Q = Object.create(null);
    return Object.getOwnPropertyNames(A).forEach(function(B) {
      Object.defineProperty(Q, B, Object.getOwnPropertyDescriptor(A, B))
    }), Q
  }
})
// @from(Start 2161327, End 2169066)
sK = z((yK7, Sz1) => {
  var bY = UA("fs"),
    pW4 = _r0(),
    lW4 = xr0(),
    iW4 = br0(),
    RbA = UA("util"),
    aK, PbA;
  if (typeof Symbol === "function" && typeof Symbol.for === "function") aK = Symbol.for("graceful-fs.queue"), PbA = Symbol.for("graceful-fs.previous");
  else aK = "___graceful-fs.queue", PbA = "___graceful-fs.previous";

  function nW4() {}

  function hr0(A, Q) {
    Object.defineProperty(A, aK, {
      get: function() {
        return Q
      }
    })
  }
  var Rr = nW4;
  if (RbA.debuglog) Rr = RbA.debuglog("gfs4");
  else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) Rr = function() {
    var A = RbA.format.apply(RbA, arguments);
    A = "GFS4: " + A.split(/\n/).join(`
GFS4: `), console.error(A)
  };
  if (!bY[aK]) {
    if (Tz1 = global[aK] || [], hr0(bY, Tz1), bY.close = function(A) {
        function Q(B, G) {
          return A.call(bY, B, function(Z) {
            if (!Z) fr0();
            if (typeof G === "function") G.apply(this, arguments)
          })
        }
        return Object.defineProperty(Q, PbA, {
          value: A
        }), Q
      }(bY.close), bY.closeSync = function(A) {
        function Q(B) {
          A.apply(bY, arguments), fr0()
        }
        return Object.defineProperty(Q, PbA, {
          value: A
        }), Q
      }(bY.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function() {
      Rr(bY[aK]), UA("assert").equal(bY[aK].length, 0)
    })
  }
  var Tz1;
  if (!global[aK]) hr0(global, bY[aK]);
  Sz1.exports = Pz1(iW4(bY));
  if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !bY.__patched) Sz1.exports = Pz1(bY), bY.__patched = !0;

  function Pz1(A) {
    pW4(A), A.gracefulify = Pz1, A.createReadStream = R, A.createWriteStream = T;
    var Q = A.readFile;
    A.readFile = B;

    function B(x, p, u) {
      if (typeof p === "function") u = p, p = null;
      return e(x, p, u);

      function e(l, k, m, o) {
        return Q(l, k, function(IA) {
          if (IA && (IA.code === "EMFILE" || IA.code === "ENFILE")) L4A([e, [l, k, m], IA, o || Date.now(), Date.now()]);
          else if (typeof m === "function") m.apply(this, arguments)
        })
      }
    }
    var G = A.writeFile;
    A.writeFile = Z;

    function Z(x, p, u, e) {
      if (typeof u === "function") e = u, u = null;
      return l(x, p, u, e);

      function l(k, m, o, IA, FA) {
        return G(k, m, o, function(zA) {
          if (zA && (zA.code === "EMFILE" || zA.code === "ENFILE")) L4A([l, [k, m, o, IA], zA, FA || Date.now(), Date.now()]);
          else if (typeof IA === "function") IA.apply(this, arguments)
        })
      }
    }
    var I = A.appendFile;
    if (I) A.appendFile = Y;

    function Y(x, p, u, e) {
      if (typeof u === "function") e = u, u = null;
      return l(x, p, u, e);

      function l(k, m, o, IA, FA) {
        return I(k, m, o, function(zA) {
          if (zA && (zA.code === "EMFILE" || zA.code === "ENFILE")) L4A([l, [k, m, o, IA], zA, FA || Date.now(), Date.now()]);
          else if (typeof IA === "function") IA.apply(this, arguments)
        })
      }
    }
    var J = A.copyFile;
    if (J) A.copyFile = W;

    function W(x, p, u, e) {
      if (typeof u === "function") e = u, u = 0;
      return l(x, p, u, e);

      function l(k, m, o, IA, FA) {
        return J(k, m, o, function(zA) {
          if (zA && (zA.code === "EMFILE" || zA.code === "ENFILE")) L4A([l, [k, m, o, IA], zA, FA || Date.now(), Date.now()]);
          else if (typeof IA === "function") IA.apply(this, arguments)
        })
      }
    }
    var X = A.readdir;
    A.readdir = F;
    var V = /^v[0-5]\./;

    function F(x, p, u) {
      if (typeof p === "function") u = p, p = null;
      var e = V.test(process.version) ? function(m, o, IA, FA) {
        return X(m, l(m, o, IA, FA))
      } : function(m, o, IA, FA) {
        return X(m, o, l(m, o, IA, FA))
      };
      return e(x, p, u);

      function l(k, m, o, IA) {
        return function(FA, zA) {
          if (FA && (FA.code === "EMFILE" || FA.code === "ENFILE")) L4A([e, [k, m, o], FA, IA || Date.now(), Date.now()]);
          else {
            if (zA && zA.sort) zA.sort();
            if (typeof o === "function") o.call(this, FA, zA)
          }
        }
      }
    }
    if (process.version.substr(0, 4) === "v0.8") {
      var K = lW4(A);
      U = K.ReadStream, w = K.WriteStream
    }
    var D = A.ReadStream;
    if (D) U.prototype = Object.create(D.prototype), U.prototype.open = q;
    var H = A.WriteStream;
    if (H) w.prototype = Object.create(H.prototype), w.prototype.open = N;
    Object.defineProperty(A, "ReadStream", {
      get: function() {
        return U
      },
      set: function(x) {
        U = x
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(A, "WriteStream", {
      get: function() {
        return w
      },
      set: function(x) {
        w = x
      },
      enumerable: !0,
      configurable: !0
    });
    var C = U;
    Object.defineProperty(A, "FileReadStream", {
      get: function() {
        return C
      },
      set: function(x) {
        C = x
      },
      enumerable: !0,
      configurable: !0
    });
    var E = w;
    Object.defineProperty(A, "FileWriteStream", {
      get: function() {
        return E
      },
      set: function(x) {
        E = x
      },
      enumerable: !0,
      configurable: !0
    });

    function U(x, p) {
      if (this instanceof U) return D.apply(this, arguments), this;
      else return U.apply(Object.create(U.prototype), arguments)
    }

    function q() {
      var x = this;
      v(x.path, x.flags, x.mode, function(p, u) {
        if (p) {
          if (x.autoClose) x.destroy();
          x.emit("error", p)
        } else x.fd = u, x.emit("open", u), x.read()
      })
    }

    function w(x, p) {
      if (this instanceof w) return H.apply(this, arguments), this;
      else return w.apply(Object.create(w.prototype), arguments)
    }

    function N() {
      var x = this;
      v(x.path, x.flags, x.mode, function(p, u) {
        if (p) x.destroy(), x.emit("error", p);
        else x.fd = u, x.emit("open", u)
      })
    }

    function R(x, p) {
      return new A.ReadStream(x, p)
    }

    function T(x, p) {
      return new A.WriteStream(x, p)
    }
    var y = A.open;
    A.open = v;

    function v(x, p, u, e) {
      if (typeof u === "function") e = u, u = null;
      return l(x, p, u, e);

      function l(k, m, o, IA, FA) {
        return y(k, m, o, function(zA, NA) {
          if (zA && (zA.code === "EMFILE" || zA.code === "ENFILE")) L4A([l, [k, m, o, IA], zA, FA || Date.now(), Date.now()]);
          else if (typeof IA === "function") IA.apply(this, arguments)
        })
      }
    }
    return A
  }

  function L4A(A) {
    Rr("ENQUEUE", A[0].name, A[1]), bY[aK].push(A), jz1()
  }
  var TbA;

  function fr0() {
    var A = Date.now();
    for (var Q = 0; Q < bY[aK].length; ++Q)
      if (bY[aK][Q].length > 2) bY[aK][Q][3] = A, bY[aK][Q][4] = A;
    jz1()
  }

  function jz1() {
    if (clearTimeout(TbA), TbA = void 0, bY[aK].length === 0) return;
    var A = bY[aK].shift(),
      Q = A[0],
      B = A[1],
      G = A[2],
      Z = A[3],
      I = A[4];
    if (Z === void 0) Rr("RETRY", Q.name, B), Q.apply(null, B);
    else if (Date.now() - Z >= 60000) {
      Rr("TIMEOUT", Q.name, B);
      var Y = B.pop();
      if (typeof Y === "function") Y.call(null, G)
    } else {
      var J = Date.now() - I,
        W = Math.max(I - Z, 1),
        X = Math.min(W * 1.2, 100);
      if (J >= X) Rr("RETRY", Q.name, B), Q.apply(null, B.concat([Z]));
      else bY[aK].push(A)
    }
    if (TbA === void 0) TbA = setTimeout(jz1, 0)
  }
})
// @from(Start 2169072, End 2171964)
ur0 = z((xK7, gr0) => {
  function tN(A, Q) {
    if (typeof Q === "boolean") Q = {
      forever: Q
    };
    if (this._originalTimeouts = JSON.parse(JSON.stringify(A)), this._timeouts = A, this._options = Q || {}, this._maxRetryTime = Q && Q.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._options.forever) this._cachedTimeouts = this._timeouts.slice(0)
  }
  gr0.exports = tN;
  tN.prototype.reset = function() {
    this._attempts = 1, this._timeouts = this._originalTimeouts
  };
  tN.prototype.stop = function() {
    if (this._timeout) clearTimeout(this._timeout);
    this._timeouts = [], this._cachedTimeouts = null
  };
  tN.prototype.retry = function(A) {
    if (this._timeout) clearTimeout(this._timeout);
    if (!A) return !1;
    var Q = new Date().getTime();
    if (A && Q - this._operationStart >= this._maxRetryTime) return this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
    this._errors.push(A);
    var B = this._timeouts.shift();
    if (B === void 0)
      if (this._cachedTimeouts) this._errors.splice(this._errors.length - 1, this._errors.length), this._timeouts = this._cachedTimeouts.slice(0), B = this._timeouts.shift();
      else return !1;
    var G = this,
      Z = setTimeout(function() {
        if (G._attempts++, G._operationTimeoutCb) {
          if (G._timeout = setTimeout(function() {
              G._operationTimeoutCb(G._attempts)
            }, G._operationTimeout), G._options.unref) G._timeout.unref()
        }
        G._fn(G._attempts)
      }, B);
    if (this._options.unref) Z.unref();
    return !0
  };
  tN.prototype.attempt = function(A, Q) {
    if (this._fn = A, Q) {
      if (Q.timeout) this._operationTimeout = Q.timeout;
      if (Q.cb) this._operationTimeoutCb = Q.cb
    }
    var B = this;
    if (this._operationTimeoutCb) this._timeout = setTimeout(function() {
      B._operationTimeoutCb()
    }, B._operationTimeout);
    this._operationStart = new Date().getTime(), this._fn(this._attempts)
  };
  tN.prototype.try = function(A) {
    console.log("Using RetryOperation.try() is deprecated"), this.attempt(A)
  };
  tN.prototype.start = function(A) {
    console.log("Using RetryOperation.start() is deprecated"), this.attempt(A)
  };
  tN.prototype.start = tN.prototype.try;
  tN.prototype.errors = function() {
    return this._errors
  };
  tN.prototype.attempts = function() {
    return this._attempts
  };
  tN.prototype.mainError = function() {
    if (this._errors.length === 0) return null;
    var A = {},
      Q = null,
      B = 0;
    for (var G = 0; G < this._errors.length; G++) {
      var Z = this._errors[G],
        I = Z.message,
        Y = (A[I] || 0) + 1;
      if (A[I] = Y, Y >= B) Q = Z, B = Y
    }
    return Q
  }
})
// @from(Start 2171970, End 2173633)
dr0 = z((sW4) => {
  var aW4 = ur0();
  sW4.operation = function(A) {
    var Q = sW4.timeouts(A);
    return new aW4(Q, {
      forever: A && A.forever,
      unref: A && A.unref,
      maxRetryTime: A && A.maxRetryTime
    })
  };
  sW4.timeouts = function(A) {
    if (A instanceof Array) return [].concat(A);
    var Q = {
      retries: 10,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 1 / 0,
      randomize: !1
    };
    for (var B in A) Q[B] = A[B];
    if (Q.minTimeout > Q.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
    var G = [];
    for (var Z = 0; Z < Q.retries; Z++) G.push(this.createTimeout(Z, Q));
    if (A && A.forever && !G.length) G.push(this.createTimeout(Z, Q));
    return G.sort(function(I, Y) {
      return I - Y
    }), G
  };
  sW4.createTimeout = function(A, Q) {
    var B = Q.randomize ? Math.random() + 1 : 1,
      G = Math.round(B * Q.minTimeout * Math.pow(Q.factor, A));
    return G = Math.min(G, Q.maxTimeout), G
  };
  sW4.wrap = function(A, Q, B) {
    if (Q instanceof Array) B = Q, Q = null;
    if (!B) {
      B = [];
      for (var G in A)
        if (typeof A[G] === "function") B.push(G)
    }
    for (var Z = 0; Z < B.length; Z++) {
      var I = B[Z],
        Y = A[I];
      A[I] = function(W) {
        var X = sW4.operation(Q),
          V = Array.prototype.slice.call(arguments, 1),
          F = V.pop();
        V.push(function(K) {
          if (X.retry(K)) return;
          if (K) arguments[0] = X.mainError();
          F.apply(this, arguments)
        }), X.attempt(function() {
          W.apply(A, V)
        })
      }.bind(A, Y), A[I].options = Q
    }
  }
})
// @from(Start 2173639, End 2173987)
cr0 = z((bK7, jbA) => {
  jbA.exports = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
  if (process.platform !== "win32") jbA.exports.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
  if (process.platform === "linux") jbA.exports.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED")
})
// @from(Start 2173993, End 2176935)
pr0 = z((fK7, O4A) => {
  var bI = global.process,
    Tr = function(A) {
      return A && typeof A === "object" && typeof A.removeListener === "function" && typeof A.emit === "function" && typeof A.reallyExit === "function" && typeof A.listeners === "function" && typeof A.kill === "function" && typeof A.pid === "number" && typeof A.on === "function"
    };
  if (!Tr(bI)) O4A.exports = function() {
    return function() {}
  };
  else {
    if (_z1 = UA("assert"), Pr = cr0(), kz1 = /^win/i.test(bI.platform), M4A = UA("events"), typeof M4A !== "function") M4A = M4A.EventEmitter;
    if (bI.__signal_exit_emitter__) MV = bI.__signal_exit_emitter__;
    else MV = bI.__signal_exit_emitter__ = new M4A, MV.count = 0, MV.emitted = {};
    if (!MV.infinite) MV.setMaxListeners(1 / 0), MV.infinite = !0;
    O4A.exports = function(A, Q) {
      if (!Tr(global.process)) return function() {};
      if (_z1.equal(typeof A, "function", "a callback must be provided for exit handler"), jr === !1) SbA();
      var B = "exit";
      if (Q && Q.alwaysLast) B = "afterexit";
      var G = function() {
        if (MV.removeListener(B, A), MV.listeners("exit").length === 0 && MV.listeners("afterexit").length === 0) NDA()
      };
      return MV.on(B, A), G
    }, NDA = function() {
      if (!jr || !Tr(global.process)) return;
      jr = !1, Pr.forEach(function(Q) {
        try {
          bI.removeListener(Q, LDA[Q])
        } catch (B) {}
      }), bI.emit = MDA, bI.reallyExit = _bA, MV.count -= 1
    }, O4A.exports.unload = NDA, sm = function(Q, B, G) {
      if (MV.emitted[Q]) return;
      MV.emitted[Q] = !0, MV.emit(Q, B, G)
    }, LDA = {}, Pr.forEach(function(A) {
      LDA[A] = function() {
        if (!Tr(global.process)) return;
        var B = bI.listeners(A);
        if (B.length === MV.count) {
          if (NDA(), sm("exit", null, A), sm("afterexit", null, A), kz1 && A === "SIGHUP") A = "SIGINT";
          bI.kill(bI.pid, A)
        }
      }
    }), O4A.exports.signals = function() {
      return Pr
    }, jr = !1, SbA = function() {
      if (jr || !Tr(global.process)) return;
      jr = !0, MV.count += 1, Pr = Pr.filter(function(Q) {
        try {
          return bI.on(Q, LDA[Q]), !0
        } catch (B) {
          return !1
        }
      }), bI.emit = xz1, bI.reallyExit = yz1
    }, O4A.exports.load = SbA, _bA = bI.reallyExit, yz1 = function(Q) {
      if (!Tr(global.process)) return;
      bI.exitCode = Q || 0, sm("exit", bI.exitCode, null), sm("afterexit", bI.exitCode, null), _bA.call(bI, bI.exitCode)
    }, MDA = bI.emit, xz1 = function(Q, B) {
      if (Q === "exit" && Tr(global.process)) {
        if (B !== void 0) bI.exitCode = B;
        var G = MDA.apply(this, arguments);
        return sm("exit", bI.exitCode, null), sm("afterexit", bI.exitCode, null), G
      } else return MDA.apply(this, arguments)
    }
  }
  var _z1, Pr, kz1, M4A, MV, NDA, sm, LDA, jr, SbA, _bA, yz1, MDA, xz1
})
// @from(Start 2176941, End 2177647)
ir0 = z((QX4, vz1) => {
  var lr0 = Symbol();

  function eW4(A, Q, B) {
    let G = Q[lr0];
    if (G) return Q.stat(A, (I, Y) => {
      if (I) return B(I);
      B(null, Y.mtime, G)
    });
    let Z = new Date(Math.ceil(Date.now() / 1000) * 1000 + 5);
    Q.utimes(A, Z, Z, (I) => {
      if (I) return B(I);
      Q.stat(A, (Y, J) => {
        if (Y) return B(Y);
        let W = J.mtime.getTime() % 1000 === 0 ? "s" : "ms";
        Object.defineProperty(Q, lr0, {
          value: W
        }), B(null, J.mtime, W)
      })
    })
  }

  function AX4(A) {
    let Q = Date.now();
    if (A === "s") Q = Math.ceil(Q / 1000) * 1000;
    return new Date(Q)
  }
  QX4.probe = eW4;
  QX4.getMtime = AX4
})
// @from(Start 2177653, End 2182752)
or0 = z((VX4, RDA) => {
  var ZX4 = UA("path"),
    hz1 = sK(),
    IX4 = dr0(),
    YX4 = pr0(),
    nr0 = ir0(),
    $v = {};

  function ODA(A, Q) {
    return Q.lockfilePath || `${A}.lock`
  }

  function gz1(A, Q, B) {
    if (!Q.realpath) return B(null, ZX4.resolve(A));
    Q.fs.realpath(A, B)
  }

  function fz1(A, Q, B) {
    let G = ODA(A, Q);
    Q.fs.mkdir(G, (Z) => {
      if (!Z) return nr0.probe(G, Q.fs, (I, Y, J) => {
        if (I) return Q.fs.rmdir(G, () => {}), B(I);
        B(null, Y, J)
      });
      if (Z.code !== "EEXIST") return B(Z);
      if (Q.stale <= 0) return B(Object.assign(Error("Lock file is already being held"), {
        code: "ELOCKED",
        file: A
      }));
      Q.fs.stat(G, (I, Y) => {
        if (I) {
          if (I.code === "ENOENT") return fz1(A, {
            ...Q,
            stale: 0
          }, B);
          return B(I)
        }
        if (!ar0(Y, Q)) return B(Object.assign(Error("Lock file is already being held"), {
          code: "ELOCKED",
          file: A
        }));
        sr0(A, Q, (J) => {
          if (J) return B(J);
          fz1(A, {
            ...Q,
            stale: 0
          }, B)
        })
      })
    })
  }

  function ar0(A, Q) {
    return A.mtime.getTime() < Date.now() - Q.stale
  }

  function sr0(A, Q, B) {
    Q.fs.rmdir(ODA(A, Q), (G) => {
      if (G && G.code !== "ENOENT") return B(G);
      B()
    })
  }

  function kbA(A, Q) {
    let B = $v[A];
    if (B.updateTimeout) return;
    if (B.updateDelay = B.updateDelay || Q.update, B.updateTimeout = setTimeout(() => {
        B.updateTimeout = null, Q.fs.stat(B.lockfilePath, (G, Z) => {
          let I = B.lastUpdate + Q.stale < Date.now();
          if (G) {
            if (G.code === "ENOENT" || I) return bz1(A, B, Object.assign(G, {
              code: "ECOMPROMISED"
            }));
            return B.updateDelay = 1000, kbA(A, Q)
          }
          if (B.mtime.getTime() !== Z.mtime.getTime()) return bz1(A, B, Object.assign(Error("Unable to update lock within the stale threshold"), {
            code: "ECOMPROMISED"
          }));
          let J = nr0.getMtime(B.mtimePrecision);
          Q.fs.utimes(B.lockfilePath, J, J, (W) => {
            let X = B.lastUpdate + Q.stale < Date.now();
            if (B.released) return;
            if (W) {
              if (W.code === "ENOENT" || X) return bz1(A, B, Object.assign(W, {
                code: "ECOMPROMISED"
              }));
              return B.updateDelay = 1000, kbA(A, Q)
            }
            B.mtime = J, B.lastUpdate = Date.now(), B.updateDelay = null, kbA(A, Q)
          })
        })
      }, B.updateDelay), B.updateTimeout.unref) B.updateTimeout.unref()
  }

  function bz1(A, Q, B) {
    if (Q.released = !0, Q.updateTimeout) clearTimeout(Q.updateTimeout);
    if ($v[A] === Q) delete $v[A];
    Q.options.onCompromised(B)
  }

  function JX4(A, Q, B) {
    Q = {
      stale: 1e4,
      update: null,
      realpath: !0,
      retries: 0,
      fs: hz1,
      onCompromised: (G) => {
        throw G
      },
      ...Q
    }, Q.retries = Q.retries || 0, Q.retries = typeof Q.retries === "number" ? {
      retries: Q.retries
    } : Q.retries, Q.stale = Math.max(Q.stale || 0, 2000), Q.update = Q.update == null ? Q.stale / 2 : Q.update || 0, Q.update = Math.max(Math.min(Q.update, Q.stale / 2), 1000), gz1(A, Q, (G, Z) => {
      if (G) return B(G);
      let I = IX4.operation(Q.retries);
      I.attempt(() => {
        fz1(Z, Q, (Y, J, W) => {
          if (I.retry(Y)) return;
          if (Y) return B(I.mainError());
          let X = $v[Z] = {
            lockfilePath: ODA(Z, Q),
            mtime: J,
            mtimePrecision: W,
            options: Q,
            lastUpdate: Date.now()
          };
          kbA(Z, Q), B(null, (V) => {
            if (X.released) return V && V(Object.assign(Error("Lock is already released"), {
              code: "ERELEASED"
            }));
            rr0(Z, {
              ...Q,
              realpath: !1
            }, V)
          })
        })
      })
    })
  }

  function rr0(A, Q, B) {
    Q = {
      fs: hz1,
      realpath: !0,
      ...Q
    }, gz1(A, Q, (G, Z) => {
      if (G) return B(G);
      let I = $v[Z];
      if (!I) return B(Object.assign(Error("Lock is not acquired/owned by you"), {
        code: "ENOTACQUIRED"
      }));
      I.updateTimeout && clearTimeout(I.updateTimeout), I.released = !0, delete $v[Z], sr0(Z, Q, B)
    })
  }

  function WX4(A, Q, B) {
    Q = {
      stale: 1e4,
      realpath: !0,
      fs: hz1,
      ...Q
    }, Q.stale = Math.max(Q.stale || 0, 2000), gz1(A, Q, (G, Z) => {
      if (G) return B(G);
      Q.fs.stat(ODA(Z, Q), (I, Y) => {
        if (I) return I.code === "ENOENT" ? B(null, !1) : B(I);
        return B(null, !ar0(Y, Q))
      })
    })
  }

  function XX4() {
    return $v
  }
  YX4(() => {
    for (let A in $v) {
      let Q = $v[A].options;
      try {
        Q.fs.rmdirSync(ODA(A, Q))
      } catch (B) {}
    }
  });
  VX4.lock = JX4;
  VX4.unlock = rr0;
  VX4.check = WX4;
  VX4.getLocks = XX4
})
// @from(Start 2182758, End 2183889)
er0 = z((hK7, tr0) => {
  var CX4 = sK();

  function EX4(A) {
    let Q = ["mkdir", "realpath", "stat", "rmdir", "utimes"],
      B = {
        ...A
      };
    return Q.forEach((G) => {
      B[G] = (...Z) => {
        let I = Z.pop(),
          Y;
        try {
          Y = A[`${G}Sync`](...Z)
        } catch (J) {
          return I(J)
        }
        I(null, Y)
      }
    }), B
  }

  function zX4(A) {
    return (...Q) => new Promise((B, G) => {
      Q.push((Z, I) => {
        if (Z) G(Z);
        else B(I)
      }), A(...Q)
    })
  }

  function UX4(A) {
    return (...Q) => {
      let B, G;
      if (Q.push((Z, I) => {
          B = Z, G = I
        }), A(...Q), B) throw B;
      return G
    }
  }

  function $X4(A) {
    if (A = {
        ...A
      }, A.fs = EX4(A.fs || CX4), typeof A.retries === "number" && A.retries > 0 || A.retries && typeof A.retries.retries === "number" && A.retries.retries > 0) throw Object.assign(Error("Cannot use retries with the sync api"), {
      code: "ESYNC"
    });
    return A
  }
  tr0.exports = {
    toPromise: zX4,
    toSync: UX4,
    toSyncOptions: $X4
  }
})
// @from(Start 2183895, End 2184639)
T4A = z((gK7, rm) => {
  var R4A = or0(),
    {
      toPromise: ybA,
      toSync: xbA,
      toSyncOptions: uz1
    } = er0();
  async function Ao0(A, Q) {
    let B = await ybA(R4A.lock)(A, Q);
    return ybA(B)
  }

  function wX4(A, Q) {
    let B = xbA(R4A.lock)(A, uz1(Q));
    return xbA(B)
  }

  function qX4(A, Q) {
    return ybA(R4A.unlock)(A, Q)
  }

  function NX4(A, Q) {
    return xbA(R4A.unlock)(A, uz1(Q))
  }

  function LX4(A, Q) {
    return ybA(R4A.check)(A, Q)
  }

  function MX4(A, Q) {
    return xbA(R4A.check)(A, uz1(Q))
  }
  rm.exports = Ao0;
  rm.exports.lock = Ao0;
  rm.exports.unlock = qX4;
  rm.exports.lockSync = wX4;
  rm.exports.unlockSync = NX4;
  rm.exports.check = LX4;
  rm.exports.checkSync = MX4
})
// @from(Start 2184641, End 2185072)
class j4A {
  heap;
  length;
  static #A = !1;
  static create(A) {
    let Q = Zo0(A);
    if (!Q) return [];
    j4A.#A = !0;
    let B = new j4A(A, Q);
    return j4A.#A = !1, B
  }
  constructor(A, Q) {
    if (!j4A.#A) throw TypeError("instantiate Stack using Stack.create(n)");
    this.heap = new Q(A), this.length = 0
  }
  push(A) {
    this.heap[this.length++] = A
  }
  pop() {
    return this.heap[--this.length]
  }
}
// @from(Start 2185077, End 2185080)
P4A
// @from(Start 2185082, End 2185085)
Bo0
// @from(Start 2185087, End 2185090)
mz1
// @from(Start 2185092, End 2185228)
Go0 = (A, Q, B, G) => {
    typeof mz1.emitWarning === "function" ? mz1.emitWarning(A, Q, B, G) : console.error(`[${B}] ${Q}: ${A}`)
  }
// @from(Start 2185232, End 2185235)
vbA
// @from(Start 2185237, End 2185240)
Qo0
// @from(Start 2185242, End 2185266)
OX4 = (A) => !Bo0.has(A)
// @from(Start 2185270, End 2185273)
uK7
// @from(Start 2185275, End 2185335)
om = (A) => A && A === Math.floor(A) && A > 0 && isFinite(A)
// @from(Start 2185339, End 2185518)
Zo0 = (A) => !om(A) ? null : A <= Math.pow(2, 8) ? Uint8Array : A <= Math.pow(2, 16) ? Uint16Array : A <= Math.pow(2, 32) ? Uint32Array : A <= Number.MAX_SAFE_INTEGER ? TDA : null
// @from(Start 2185522, End 2185525)
TDA
// @from(Start 2185527, End 2185529)
tm