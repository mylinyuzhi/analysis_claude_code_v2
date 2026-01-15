
// @from(Ln 218286, Col 4)
P40 = U((F_) => {
  var sj8 = F_ && F_.__importDefault || function (A) {
      return A && A.__esModule ? A : {
        default: A
      }
    },
    kkB;
  Object.defineProperty(F_, "__esModule", {
    value: !0
  });
  F_.GaxiosError = F_.GAXIOS_ERROR_SYMBOL = void 0;
  F_.defaultErrorRedactor = fkB;
  var tj8 = NA("url"),
    j40 = vkB(),
    bkB = sj8(s90());
  F_.GAXIOS_ERROR_SYMBOL = Symbol.for(`${j40.pkg.name}-gaxios-error`);
  class T40 extends Error {
    static[(kkB = F_.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](A) {
      if (A && typeof A === "object" && F_.GAXIOS_ERROR_SYMBOL in A && A[F_.GAXIOS_ERROR_SYMBOL] === j40.pkg.version) return !0;
      return Function.prototype[Symbol.hasInstance].call(T40, A)
    }
    constructor(A, Q, B, G) {
      var Z;
      super(A);
      if (this.config = Q, this.response = B, this.error = G, this[kkB] = j40.pkg.version, this.config = (0, bkB.default)(!0, {}, Q), this.response) this.response.config = (0, bkB.default)(!0, {}, this.response.config);
      if (this.response) {
        try {
          this.response.data = ej8(this.config.responseType, (Z = this.response) === null || Z === void 0 ? void 0 : Z.data)
        } catch (Y) {}
        this.status = this.response.status
      }
      if (G && "code" in G && G.code) this.code = G.code;
      if (Q.errorRedactor) Q.errorRedactor({
        config: this.config,
        response: this.response
      })
    }
  }
  F_.GaxiosError = T40;

  function ej8(A, Q) {
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

  function fkB(A) {
    function B(Y) {
      if (!Y) return;
      for (let J of Object.keys(Y)) {
        if (/^authentication$/i.test(J)) Y[J] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if (/^authorization$/i.test(J)) Y[J] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if (/secret/i.test(J)) Y[J] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
      }
    }

    function G(Y, J) {
      if (typeof Y === "object" && Y !== null && typeof Y[J] === "string") {
        let X = Y[J];
        if (/grant_type=/i.test(X) || /assertion=/i.test(X) || /secret/i.test(X)) Y[J] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
      }
    }

    function Z(Y) {
      if (typeof Y === "object" && Y !== null) {
        if ("grant_type" in Y) Y.grant_type = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if ("assertion" in Y) Y.assertion = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if ("client_secret" in Y) Y.client_secret = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>."
      }
    }
    if (A.config) {
      B(A.config.headers), G(A.config, "data"), Z(A.config.data), G(A.config, "body"), Z(A.config.body);
      try {
        let Y = new tj8.URL("", A.config.url);
        if (Y.searchParams.has("token")) Y.searchParams.set("token", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
        if (Y.searchParams.has("client_secret")) Y.searchParams.set("client_secret", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
        A.config.url = Y.toString()
      } catch (Y) {}
    }
    if (A.response) fkB({
      config: A.response.config
    }), B(A.response.headers), G(A.response, "data"), Z(A.response.data);
    return A
  }
})
// @from(Ln 218380, Col 4)
ukB = U((gkB) => {
  Object.defineProperty(gkB, "__esModule", {
    value: !0
  });
  gkB.getRetryConfig = AT8;
  async function AT8(A) {
    let Q = hkB(A);
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
    if (Q.statusCodesToRetry = Q.statusCodesToRetry || B, A.config.retryConfig = Q, !await (Q.shouldRetry || QT8)(A)) return {
      shouldRetry: !1,
      config: A.config
    };
    let Z = BT8(Q);
    A.config.retryConfig.currentRetryAttempt += 1;
    let Y = Q.retryBackoff ? Q.retryBackoff(A, Z) : new Promise((J) => {
      setTimeout(J, Z)
    });
    if (Q.onRetryAttempt) Q.onRetryAttempt(A);
    return await Y, {
      shouldRetry: !0,
      config: A.config
    }
  }

  function QT8(A) {
    var Q;
    let B = hkB(A);
    if (A.name === "AbortError" || ((Q = A.error) === null || Q === void 0 ? void 0 : Q.name) === "AbortError") return !1;
    if (!B || B.retry === 0) return !1;
    if (!A.response && (B.currentRetryAttempt || 0) >= B.noResponseRetries) return !1;
    if (!A.config.method || B.httpMethodsToRetry.indexOf(A.config.method.toUpperCase()) < 0) return !1;
    if (A.response && A.response.status) {
      let G = !1;
      for (let [Z, Y] of B.statusCodesToRetry) {
        let J = A.response.status;
        if (J >= Z && J <= Y) {
          G = !0;
          break
        }
      }
      if (!G) return !1
    }
    if (B.currentRetryAttempt = B.currentRetryAttempt || 0, B.currentRetryAttempt >= B.retry) return !1;
    return !0
  }

  function hkB(A) {
    if (A && A.config && A.config.retryConfig) return A.config.retryConfig;
    return
  }

  function BT8(A) {
    var Q;
    let G = (A.currentRetryAttempt ? 0 : (Q = A.retryDelay) !== null && Q !== void 0 ? Q : 100) + (Math.pow(A.retryDelayMultiplier, A.currentRetryAttempt) - 1) / 2 * 1000,
      Z = A.totalTimeout - (Date.now() - A.timeOfFirstRequest);
    return Math.min(G, Z, A.maxRetryDelay)
  }
})
// @from(Ln 218447, Col 4)
S40 = U((mkB) => {
  Object.defineProperty(mkB, "__esModule", {
    value: !0
  });
  mkB.default = JT8;
  var ZT8 = YT8(NA("crypto"));

  function YT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var G61 = new Uint8Array(256),
    B61 = G61.length;

  function JT8() {
    if (B61 > G61.length - 16) ZT8.default.randomFillSync(G61), B61 = 0;
    return G61.slice(B61, B61 += 16)
  }
})
// @from(Ln 218467, Col 4)
pkB = U((dkB) => {
  Object.defineProperty(dkB, "__esModule", {
    value: !0
  });
  dkB.default = void 0;
  var IT8 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  dkB.default = IT8
})
// @from(Ln 218475, Col 4)
QTA = U((lkB) => {
  Object.defineProperty(lkB, "__esModule", {
    value: !0
  });
  lkB.default = void 0;
  var DT8 = WT8(pkB());

  function WT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function KT8(A) {
    return typeof A === "string" && DT8.default.test(A)
  }
  var VT8 = KT8;
  lkB.default = VT8
})
// @from(Ln 218494, Col 4)
BTA = U((akB) => {
  Object.defineProperty(akB, "__esModule", {
    value: !0
  });
  akB.default = void 0;
  akB.unsafeStringify = nkB;
  var FT8 = HT8(QTA());

  function HT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var iH = [];
  for (let A = 0; A < 256; ++A) iH.push((A + 256).toString(16).slice(1));

  function nkB(A, Q = 0) {
    return iH[A[Q + 0]] + iH[A[Q + 1]] + iH[A[Q + 2]] + iH[A[Q + 3]] + "-" + iH[A[Q + 4]] + iH[A[Q + 5]] + "-" + iH[A[Q + 6]] + iH[A[Q + 7]] + "-" + iH[A[Q + 8]] + iH[A[Q + 9]] + "-" + iH[A[Q + 10]] + iH[A[Q + 11]] + iH[A[Q + 12]] + iH[A[Q + 13]] + iH[A[Q + 14]] + iH[A[Q + 15]]
  }

  function ET8(A, Q = 0) {
    let B = nkB(A, Q);
    if (!(0, FT8.default)(B)) throw TypeError("Stringified UUID is invalid");
    return B
  }
  var zT8 = ET8;
  akB.default = zT8
})
// @from(Ln 218522, Col 4)
ekB = U((skB) => {
  Object.defineProperty(skB, "__esModule", {
    value: !0
  });
  skB.default = void 0;
  var CT8 = qT8(S40()),
    UT8 = BTA();

  function qT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var rkB, x40, y40 = 0,
    v40 = 0;

  function NT8(A, Q, B) {
    let G = Q && B || 0,
      Z = Q || Array(16);
    A = A || {};
    let Y = A.node || rkB,
      J = A.clockseq !== void 0 ? A.clockseq : x40;
    if (Y == null || J == null) {
      let V = A.random || (A.rng || CT8.default)();
      if (Y == null) Y = rkB = [V[0] | 1, V[1], V[2], V[3], V[4], V[5]];
      if (J == null) J = x40 = (V[6] << 8 | V[7]) & 16383
    }
    let X = A.msecs !== void 0 ? A.msecs : Date.now(),
      I = A.nsecs !== void 0 ? A.nsecs : v40 + 1,
      D = X - y40 + (I - v40) / 1e4;
    if (D < 0 && A.clockseq === void 0) J = J + 1 & 16383;
    if ((D < 0 || X > y40) && A.nsecs === void 0) I = 0;
    if (I >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    y40 = X, v40 = I, x40 = J, X += 12219292800000;
    let W = ((X & 268435455) * 1e4 + I) % 4294967296;
    Z[G++] = W >>> 24 & 255, Z[G++] = W >>> 16 & 255, Z[G++] = W >>> 8 & 255, Z[G++] = W & 255;
    let K = X / 4294967296 * 1e4 & 268435455;
    Z[G++] = K >>> 8 & 255, Z[G++] = K & 255, Z[G++] = K >>> 24 & 15 | 16, Z[G++] = K >>> 16 & 255, Z[G++] = J >>> 8 | 128, Z[G++] = J & 255;
    for (let V = 0; V < 6; ++V) Z[G + V] = Y[V];
    return Q || (0, UT8.unsafeStringify)(Z)
  }
  var wT8 = NT8;
  skB.default = wT8
})
// @from(Ln 218566, Col 4)
k40 = U((AbB) => {
  Object.defineProperty(AbB, "__esModule", {
    value: !0
  });
  AbB.default = void 0;
  var LT8 = OT8(QTA());

  function OT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function MT8(A) {
    if (!(0, LT8.default)(A)) throw TypeError("Invalid UUID");
    let Q, B = new Uint8Array(16);
    return B[0] = (Q = parseInt(A.slice(0, 8), 16)) >>> 24, B[1] = Q >>> 16 & 255, B[2] = Q >>> 8 & 255, B[3] = Q & 255, B[4] = (Q = parseInt(A.slice(9, 13), 16)) >>> 8, B[5] = Q & 255, B[6] = (Q = parseInt(A.slice(14, 18), 16)) >>> 8, B[7] = Q & 255, B[8] = (Q = parseInt(A.slice(19, 23), 16)) >>> 8, B[9] = Q & 255, B[10] = (Q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, B[11] = Q / 4294967296 & 255, B[12] = Q >>> 24 & 255, B[13] = Q >>> 16 & 255, B[14] = Q >>> 8 & 255, B[15] = Q & 255, B
  }
  var RT8 = MT8;
  AbB.default = RT8
})
// @from(Ln 218587, Col 4)
b40 = U((ZbB) => {
  Object.defineProperty(ZbB, "__esModule", {
    value: !0
  });
  ZbB.URL = ZbB.DNS = void 0;
  ZbB.default = ST8;
  var _T8 = BTA(),
    jT8 = TT8(k40());

  function TT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function PT8(A) {
    A = unescape(encodeURIComponent(A));
    let Q = [];
    for (let B = 0; B < A.length; ++B) Q.push(A.charCodeAt(B));
    return Q
  }
  var BbB = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  ZbB.DNS = BbB;
  var GbB = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  ZbB.URL = GbB;

  function ST8(A, Q, B) {
    function G(Z, Y, J, X) {
      var I;
      if (typeof Z === "string") Z = PT8(Z);
      if (typeof Y === "string") Y = (0, jT8.default)(Y);
      if (((I = Y) === null || I === void 0 ? void 0 : I.length) !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let D = new Uint8Array(16 + Z.length);
      if (D.set(Y), D.set(Z, Y.length), D = B(D), D[6] = D[6] & 15 | Q, D[8] = D[8] & 63 | 128, J) {
        X = X || 0;
        for (let W = 0; W < 16; ++W) J[X + W] = D[W];
        return J
      }
      return (0, _T8.unsafeStringify)(D)
    }
    try {
      G.name = A
    } catch (Z) {}
    return G.DNS = BbB, G.URL = GbB, G
  }
})
// @from(Ln 218633, Col 4)
IbB = U((JbB) => {
  Object.defineProperty(JbB, "__esModule", {
    value: !0
  });
  JbB.default = void 0;
  var vT8 = kT8(NA("crypto"));

  function kT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function bT8(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return vT8.default.createHash("md5").update(A).digest()
  }
  var fT8 = bT8;
  JbB.default = fT8
})
// @from(Ln 218654, Col 4)
VbB = U((WbB) => {
  Object.defineProperty(WbB, "__esModule", {
    value: !0
  });
  WbB.default = void 0;
  var hT8 = DbB(b40()),
    gT8 = DbB(IbB());

  function DbB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var uT8 = (0, hT8.default)("v3", 48, gT8.default),
    mT8 = uT8;
  WbB.default = mT8
})
// @from(Ln 218671, Col 4)
EbB = U((FbB) => {
  Object.defineProperty(FbB, "__esModule", {
    value: !0
  });
  FbB.default = void 0;
  var dT8 = cT8(NA("crypto"));

  function cT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var pT8 = {
    randomUUID: dT8.default.randomUUID
  };
  FbB.default = pT8
})
// @from(Ln 218688, Col 4)
qbB = U((CbB) => {
  Object.defineProperty(CbB, "__esModule", {
    value: !0
  });
  CbB.default = void 0;
  var zbB = $bB(EbB()),
    lT8 = $bB(S40()),
    iT8 = BTA();

  function $bB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function nT8(A, Q, B) {
    if (zbB.default.randomUUID && !Q && !A) return zbB.default.randomUUID();
    A = A || {};
    let G = A.random || (A.rng || lT8.default)();
    if (G[6] = G[6] & 15 | 64, G[8] = G[8] & 63 | 128, Q) {
      B = B || 0;
      for (let Z = 0; Z < 16; ++Z) Q[B + Z] = G[Z];
      return Q
    }
    return (0, iT8.unsafeStringify)(G)
  }
  var aT8 = nT8;
  CbB.default = aT8
})
// @from(Ln 218717, Col 4)
LbB = U((NbB) => {
  Object.defineProperty(NbB, "__esModule", {
    value: !0
  });
  NbB.default = void 0;
  var oT8 = rT8(NA("crypto"));

  function rT8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function sT8(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return oT8.default.createHash("sha1").update(A).digest()
  }
  var tT8 = sT8;
  NbB.default = tT8
})
// @from(Ln 218738, Col 4)
_bB = U((MbB) => {
  Object.defineProperty(MbB, "__esModule", {
    value: !0
  });
  MbB.default = void 0;
  var eT8 = ObB(b40()),
    AP8 = ObB(LbB());

  function ObB(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var QP8 = (0, eT8.default)("v5", 80, AP8.default),
    BP8 = QP8;
  MbB.default = BP8
})
// @from(Ln 218755, Col 4)
PbB = U((jbB) => {
  Object.defineProperty(jbB, "__esModule", {
    value: !0
  });
  jbB.default = void 0;
  var GP8 = "00000000-0000-0000-0000-000000000000";
  jbB.default = GP8
})
// @from(Ln 218763, Col 4)
ybB = U((SbB) => {
  Object.defineProperty(SbB, "__esModule", {
    value: !0
  });
  SbB.default = void 0;
  var ZP8 = YP8(QTA());

  function YP8(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function JP8(A) {
    if (!(0, ZP8.default)(A)) throw TypeError("Invalid UUID");
    return parseInt(A.slice(14, 15), 16)
  }
  var XP8 = JP8;
  SbB.default = XP8
})
// @from(Ln 218783, Col 4)
vbB = U((dP) => {
  Object.defineProperty(dP, "__esModule", {
    value: !0
  });
  Object.defineProperty(dP, "NIL", {
    enumerable: !0,
    get: function () {
      return VP8.default
    }
  });
  Object.defineProperty(dP, "parse", {
    enumerable: !0,
    get: function () {
      return zP8.default
    }
  });
  Object.defineProperty(dP, "stringify", {
    enumerable: !0,
    get: function () {
      return EP8.default
    }
  });
  Object.defineProperty(dP, "v1", {
    enumerable: !0,
    get: function () {
      return IP8.default
    }
  });
  Object.defineProperty(dP, "v3", {
    enumerable: !0,
    get: function () {
      return DP8.default
    }
  });
  Object.defineProperty(dP, "v4", {
    enumerable: !0,
    get: function () {
      return WP8.default
    }
  });
  Object.defineProperty(dP, "v5", {
    enumerable: !0,
    get: function () {
      return KP8.default
    }
  });
  Object.defineProperty(dP, "validate", {
    enumerable: !0,
    get: function () {
      return HP8.default
    }
  });
  Object.defineProperty(dP, "version", {
    enumerable: !0,
    get: function () {
      return FP8.default
    }
  });
  var IP8 = wm(ekB()),
    DP8 = wm(VbB()),
    WP8 = wm(qbB()),
    KP8 = wm(_bB()),
    VP8 = wm(PbB()),
    FP8 = wm(ybB()),
    HP8 = wm(QTA()),
    EP8 = wm(BTA()),
    zP8 = wm(k40());

  function wm(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
})
// @from(Ln 218857, Col 4)
f40 = U((bbB) => {
  Object.defineProperty(bbB, "__esModule", {
    value: !0
  });
  bbB.GaxiosInterceptorManager = void 0;
  class kbB extends Set {}
  bbB.GaxiosInterceptorManager = kbB
})
// @from(Ln 218865, Col 4)
abB = U((xz) => {
  var $P8 = xz && xz.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    CP8 = xz && xz.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    UP8 = xz && xz.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) $P8(Q, A, B)
      }
      return CP8(Q, A), Q
    },
    V2A = xz && xz.__classPrivateFieldGet || function (A, Q, B, G) {
      if (B === "a" && !G) throw TypeError("Private accessor was defined without a getter");
      if (typeof Q === "function" ? A !== Q || !G : !Q.has(A)) throw TypeError("Cannot read private member from an object whose class did not declare it");
      return B === "m" ? G : B === "a" ? G.call(A) : G ? G.value : Q.get(A)
    },
    qP8 = xz && xz.__classPrivateFieldSet || function (A, Q, B, G, Z) {
      if (G === "m") throw TypeError("Private method is not writable");
      if (G === "a" && !Z) throw TypeError("Private accessor was defined without a setter");
      if (typeof Q === "function" ? A !== Q || !Z : !Q.has(A)) throw TypeError("Cannot write private member to an object whose class did not declare it");
      return G === "a" ? Z.call(A, B) : Z ? Z.value = B : Q.set(A, B), B
    },
    J61 = xz && xz.__importDefault || function (A) {
      return A && A.__esModule ? A : {
        default: A
      }
    },
    cDA, K2A, hbB, pbB, lbB, ibB, Z61, gbB;
  Object.defineProperty(xz, "__esModule", {
    value: !0
  });
  xz.Gaxios = void 0;
  var NP8 = J61(s90()),
    wP8 = NA("https"),
    LP8 = J61(_40()),
    OP8 = J61(NA("querystring")),
    MP8 = J61(PkB()),
    ubB = NA("url"),
    Y61 = P40(),
    RP8 = ukB(),
    mbB = NA("stream"),
    _P8 = vbB(),
    dbB = f40(),
    jP8 = PP8() ? window.fetch : LP8.default;

  function TP8() {
    return typeof window < "u" && !!window
  }

  function PP8() {
    return TP8() && !!window.fetch
  }

  function SP8() {
    return typeof Buffer < "u"
  }

  function cbB(A, Q) {
    return !!nbB(A, Q)
  }

  function nbB(A, Q) {
    Q = Q.toLowerCase();
    for (let B of Object.keys((A === null || A === void 0 ? void 0 : A.headers) || {}))
      if (Q === B.toLowerCase()) return A.headers[B];
    return
  }
  class h40 {
    constructor(A) {
      cDA.add(this), this.agentCache = new Map, this.defaults = A || {}, this.interceptors = {
        request: new dbB.GaxiosInterceptorManager,
        response: new dbB.GaxiosInterceptorManager
      }
    }
    async request(A = {}) {
      return A = await V2A(this, cDA, "m", ibB).call(this, A), A = await V2A(this, cDA, "m", pbB).call(this, A), V2A(this, cDA, "m", lbB).call(this, this._request(A))
    }
    async _defaultAdapter(A) {
      let B = await (A.fetchImplementation || jP8)(A.url, A),
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
              (B === null || B === void 0 ? void 0 : B.data).on("data", (Y) => {
                G += Y
              }), (B === null || B === void 0 ? void 0 : B.data).on("end", Z)
            }), B.data = G
          }
          throw new Y61.GaxiosError(`Request failed with status code ${B.status}`, A, B)
        }
        return B
      } catch (B) {
        let G = B instanceof Y61.GaxiosError ? B : new Y61.GaxiosError(B.message, A, void 0, B),
          {
            shouldRetry: Z,
            config: Y
          } = await (0, RP8.getRetryConfig)(G);
        if (Z && Y) return G.config.retryConfig.currentRetryAttempt = Y.retryConfig.currentRetryAttempt, A.retryConfig = (Q = G.config) === null || Q === void 0 ? void 0 : Q.retryConfig, this._request(A);
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
      return OP8.default.stringify(A)
    }
    translateResponse(A, Q, B) {
      let G = {};
      return Q.headers.forEach((Z, Y) => {
        G[Y] = Z
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
  xz.Gaxios = h40;
  K2A = h40, cDA = new WeakSet, hbB = function (Q, B = []) {
    var G, Z;
    let Y = new ubB.URL(Q),
      J = [...B],
      X = ((Z = (G = process.env.NO_PROXY) !== null && G !== void 0 ? G : process.env.no_proxy) === null || Z === void 0 ? void 0 : Z.split(",")) || [];
    for (let I of X) J.push(I.trim());
    for (let I of J)
      if (I instanceof RegExp) {
        if (I.test(Y.toString())) return !1
      } else if (I instanceof ubB.URL) {
      if (I.origin === Y.origin) return !1
    } else if (I.startsWith("*.") || I.startsWith(".")) {
      let D = I.replace(/^\*\./, ".");
      if (Y.hostname.endsWith(D)) return !1
    } else if (I === Y.origin || I === Y.hostname || I === Y.href) return !1;
    return !0
  }, pbB = async function (Q) {
    let B = Promise.resolve(Q);
    for (let G of this.interceptors.request.values())
      if (G) B = B.then(G.resolved, G.rejected);
    return B
  }, lbB = async function (Q) {
    let B = Promise.resolve(Q);
    for (let G of this.interceptors.response.values())
      if (G) B = B.then(G.resolved, G.rejected);
    return B
  }, ibB = async function (Q) {
    var B, G, Z, Y;
    let J = (0, NP8.default)(!0, {}, this.defaults, Q);
    if (!J.url) throw Error("URL is required.");
    let X = J.baseUrl || J.baseURL;
    if (X) J.url = X.toString() + J.url;
    if (J.paramsSerializer = J.paramsSerializer || this.paramsSerializer, J.params && Object.keys(J.params).length > 0) {
      let W = J.paramsSerializer(J.params);
      if (W.startsWith("?")) W = W.slice(1);
      let K = J.url.toString().includes("?") ? "&" : "?";
      J.url = J.url + K + W
    }
    if (typeof Q.maxContentLength === "number") J.size = Q.maxContentLength;
    if (typeof Q.maxRedirects === "number") J.follow = Q.maxRedirects;
    if (J.headers = J.headers || {}, J.multipart === void 0 && J.data) {
      let W = typeof FormData > "u" ? !1 : (J === null || J === void 0 ? void 0 : J.data) instanceof FormData;
      if (MP8.default.readable(J.data)) J.body = J.data;
      else if (SP8() && Buffer.isBuffer(J.data)) {
        if (J.body = J.data, !cbB(J, "Content-Type")) J.headers["Content-Type"] = "application/json"
      } else if (typeof J.data === "object") {
        if (!W)
          if (nbB(J, "content-type") === "application/x-www-form-urlencoded") J.body = J.paramsSerializer(J.data);
          else {
            if (!cbB(J, "Content-Type")) J.headers["Content-Type"] = "application/json";
            J.body = JSON.stringify(J.data)
          }
      } else J.body = J.data
    } else if (J.multipart && J.multipart.length > 0) {
      let W = (0, _P8.v4)();
      J.headers["Content-Type"] = `multipart/related; boundary=${W}`;
      let K = new mbB.PassThrough;
      J.body = K, (0, mbB.pipeline)(this.getMultipartRequest(J.multipart, W), K, () => {})
    }
    if (J.validateStatus = J.validateStatus || this.validateStatus, J.responseType = J.responseType || "unknown", !J.headers.Accept && J.responseType === "json") J.headers.Accept = "application/json";
    J.method = J.method || "GET";
    let I = J.proxy || ((B = process === null || process === void 0 ? void 0 : process.env) === null || B === void 0 ? void 0 : B.HTTPS_PROXY) || ((G = process === null || process === void 0 ? void 0 : process.env) === null || G === void 0 ? void 0 : G.https_proxy) || ((Z = process === null || process === void 0 ? void 0 : process.env) === null || Z === void 0 ? void 0 : Z.HTTP_PROXY) || ((Y = process === null || process === void 0 ? void 0 : process.env) === null || Y === void 0 ? void 0 : Y.http_proxy),
      D = V2A(this, cDA, "m", hbB).call(this, J.url, J.noProxy);
    if (J.agent);
    else if (I && D) {
      let W = await V2A(K2A, K2A, "m", gbB).call(K2A);
      if (this.agentCache.has(I)) J.agent = this.agentCache.get(I);
      else J.agent = new W(I, {
        cert: J.cert,
        key: J.key
      }), this.agentCache.set(I, J.agent)
    } else if (J.cert && J.key)
      if (this.agentCache.has(J.key)) J.agent = this.agentCache.get(J.key);
      else J.agent = new wP8.Agent({
        cert: J.cert,
        key: J.key
      }), this.agentCache.set(J.key, J.agent);
    if (typeof J.errorRedactor !== "function" && J.errorRedactor !== !1) J.errorRedactor = Y61.defaultErrorRedactor;
    return J
  }, gbB = async function () {
    return qP8(this, K2A, V2A(this, K2A, "f", Z61) || (await Promise.resolve().then(() => UP8(ELA()))).HttpsProxyAgent, "f", Z61), V2A(this, K2A, "f", Z61)
  };
  Z61 = {
    value: void 0
  }
})
// @from(Ln 219152, Col 4)
cP = U((OC) => {
  var xP8 = OC && OC.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    yP8 = OC && OC.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) xP8(Q, A, B)
    };
  Object.defineProperty(OC, "__esModule", {
    value: !0
  });
  OC.instance = OC.Gaxios = OC.GaxiosError = void 0;
  OC.request = kP8;
  var obB = abB();
  Object.defineProperty(OC, "Gaxios", {
    enumerable: !0,
    get: function () {
      return obB.Gaxios
    }
  });
  var vP8 = P40();
  Object.defineProperty(OC, "GaxiosError", {
    enumerable: !0,
    get: function () {
      return vP8.GaxiosError
    }
  });
  yP8(f40(), OC);
  OC.instance = new obB.Gaxios;
  async function kP8(A) {
    return OC.instance.request(A)
  }
})
// @from(Ln 219196, Col 4)
g40 = U((rbB, X61) => {
  (function (A) {
    var Q, B = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
      G = Math.ceil,
      Z = Math.floor,
      Y = "[BigNumber Error] ",
      J = Y + "Number primitive has more than 15 significant digits: ",
      X = 100000000000000,
      I = 14,
      D = 9007199254740991,
      W = [1, 10, 100, 1000, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 10000000000, 100000000000, 1000000000000, 10000000000000],
      K = 1e7,
      V = 1e9;

    function F(_) {
      var j, x, b, S = IA.prototype = {
          constructor: IA,
          toString: null,
          valueOf: null
        },
        u = new IA(1),
        f = 20,
        AA = 4,
        n = -7,
        y = 21,
        p = -1e7,
        GA = 1e7,
        WA = !1,
        MA = 1,
        TA = 0,
        bA = {
          prefix: "",
          groupSize: 3,
          secondaryGroupSize: 0,
          groupSeparator: ",",
          decimalSeparator: ".",
          fractionGroupSize: 0,
          fractionGroupSeparator: " ",
          suffix: ""
        },
        jA = "0123456789abcdefghijklmnopqrstuvwxyz",
        OA = !0;

      function IA(s, t) {
        var BA, DA, CA, FA, xA, mA, G1, J1, SA = this;
        if (!(SA instanceof IA)) return new IA(s, t);
        if (t == null) {
          if (s && s._isBigNumber === !0) {
            if (SA.s = s.s, !s.c || s.e > GA) SA.c = SA.e = null;
            else if (s.e < p) SA.c = [SA.e = 0];
            else SA.e = s.e, SA.c = s.c.slice();
            return
          }
          if ((mA = typeof s == "number") && s * 0 == 0) {
            if (SA.s = 1 / s < 0 ? (s = -s, -1) : 1, s === ~~s) {
              for (FA = 0, xA = s; xA >= 10; xA /= 10, FA++);
              if (FA > GA) SA.c = SA.e = null;
              else SA.e = FA, SA.c = [s];
              return
            }
            J1 = String(s)
          } else {
            if (!B.test(J1 = String(s))) return b(SA, J1, mA);
            SA.s = J1.charCodeAt(0) == 45 ? (J1 = J1.slice(1), -1) : 1
          }
          if ((FA = J1.indexOf(".")) > -1) J1 = J1.replace(".", "");
          if ((xA = J1.search(/e/i)) > 0) {
            if (FA < 0) FA = xA;
            FA += +J1.slice(xA + 1), J1 = J1.substring(0, xA)
          } else if (FA < 0) FA = J1.length
        } else {
          if ($(t, 2, jA.length, "Base"), t == 10 && OA) return SA = new IA(s), wA(SA, f + SA.e + 1, AA);
          if (J1 = String(s), mA = typeof s == "number") {
            if (s * 0 != 0) return b(SA, J1, mA, t);
            if (SA.s = 1 / s < 0 ? (J1 = J1.slice(1), -1) : 1, IA.DEBUG && J1.replace(/^0\.0*|\./, "").length > 15) throw Error(J + s)
          } else SA.s = J1.charCodeAt(0) === 45 ? (J1 = J1.slice(1), -1) : 1;
          BA = jA.slice(0, t), FA = xA = 0;
          for (G1 = J1.length; xA < G1; xA++)
            if (BA.indexOf(DA = J1.charAt(xA)) < 0) {
              if (DA == ".") {
                if (xA > FA) {
                  FA = G1;
                  continue
                }
              } else if (!CA) {
                if (J1 == J1.toUpperCase() && (J1 = J1.toLowerCase()) || J1 == J1.toLowerCase() && (J1 = J1.toUpperCase())) {
                  CA = !0, xA = -1, FA = 0;
                  continue
                }
              }
              return b(SA, String(s), mA, t)
            } if (mA = !1, J1 = x(J1, t, 10, SA.s), (FA = J1.indexOf(".")) > -1) J1 = J1.replace(".", "");
          else FA = J1.length
        }
        for (xA = 0; J1.charCodeAt(xA) === 48; xA++);
        for (G1 = J1.length; J1.charCodeAt(--G1) === 48;);
        if (J1 = J1.slice(xA, ++G1)) {
          if (G1 -= xA, mA && IA.DEBUG && G1 > 15 && (s > D || s !== Z(s))) throw Error(J + SA.s * s);
          if ((FA = FA - xA - 1) > GA) SA.c = SA.e = null;
          else if (FA < p) SA.c = [SA.e = 0];
          else {
            if (SA.e = FA, SA.c = [], xA = (FA + 1) % I, FA < 0) xA += I;
            if (xA < G1) {
              if (xA) SA.c.push(+J1.slice(0, xA));
              for (G1 -= I; xA < G1;) SA.c.push(+J1.slice(xA, xA += I));
              xA = I - (J1 = J1.slice(xA)).length
            } else xA -= G1;
            for (; xA--; J1 += "0");
            SA.c.push(+J1)
          }
        } else SA.c = [SA.e = 0]
      }
      IA.clone = F, IA.ROUND_UP = 0, IA.ROUND_DOWN = 1, IA.ROUND_CEIL = 2, IA.ROUND_FLOOR = 3, IA.ROUND_HALF_UP = 4, IA.ROUND_HALF_DOWN = 5, IA.ROUND_HALF_EVEN = 6, IA.ROUND_HALF_CEIL = 7, IA.ROUND_HALF_FLOOR = 8, IA.EUCLID = 9, IA.config = IA.set = function (s) {
        var t, BA;
        if (s != null)
          if (typeof s == "object") {
            if (s.hasOwnProperty(t = "DECIMAL_PLACES")) BA = s[t], $(BA, 0, V, t), f = BA;
            if (s.hasOwnProperty(t = "ROUNDING_MODE")) BA = s[t], $(BA, 0, 8, t), AA = BA;
            if (s.hasOwnProperty(t = "EXPONENTIAL_AT"))
              if (BA = s[t], BA && BA.pop) $(BA[0], -V, 0, t), $(BA[1], 0, V, t), n = BA[0], y = BA[1];
              else $(BA, -V, V, t), n = -(y = BA < 0 ? -BA : BA);
            if (s.hasOwnProperty(t = "RANGE"))
              if (BA = s[t], BA && BA.pop) $(BA[0], -V, -1, t), $(BA[1], 1, V, t), p = BA[0], GA = BA[1];
              else if ($(BA, -V, V, t), BA) p = -(GA = BA < 0 ? -BA : BA);
            else throw Error(Y + t + " cannot be zero: " + BA);
            if (s.hasOwnProperty(t = "CRYPTO"))
              if (BA = s[t], BA === !!BA)
                if (BA)
                  if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes)) WA = BA;
                  else throw WA = !BA, Error(Y + "crypto unavailable");
            else WA = BA;
            else throw Error(Y + t + " not true or false: " + BA);
            if (s.hasOwnProperty(t = "MODULO_MODE")) BA = s[t], $(BA, 0, 9, t), MA = BA;
            if (s.hasOwnProperty(t = "POW_PRECISION")) BA = s[t], $(BA, 0, V, t), TA = BA;
            if (s.hasOwnProperty(t = "FORMAT"))
              if (BA = s[t], typeof BA == "object") bA = BA;
              else throw Error(Y + t + " not an object: " + BA);
            if (s.hasOwnProperty(t = "ALPHABET"))
              if (BA = s[t], typeof BA == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(BA)) OA = BA.slice(0, 10) == "0123456789", jA = BA;
              else throw Error(Y + t + " invalid: " + BA)
          } else throw Error(Y + "Object expected: " + s);
        return {
          DECIMAL_PLACES: f,
          ROUNDING_MODE: AA,
          EXPONENTIAL_AT: [n, y],
          RANGE: [p, GA],
          CRYPTO: WA,
          MODULO_MODE: MA,
          POW_PRECISION: TA,
          FORMAT: bA,
          ALPHABET: jA
        }
      }, IA.isBigNumber = function (s) {
        if (!s || s._isBigNumber !== !0) return !1;
        if (!IA.DEBUG) return !0;
        var t, BA, DA = s.c,
          CA = s.e,
          FA = s.s;
        A: if ({}.toString.call(DA) == "[object Array]") {
          if ((FA === 1 || FA === -1) && CA >= -V && CA <= V && CA === Z(CA)) {
            if (DA[0] === 0) {
              if (CA === 0 && DA.length === 1) return !0;
              break A
            }
            if (t = (CA + 1) % I, t < 1) t += I;
            if (String(DA[0]).length == t) {
              for (t = 0; t < DA.length; t++)
                if (BA = DA[t], BA < 0 || BA >= X || BA !== Z(BA)) break A;
              if (BA !== 0) return !0
            }
          }
        } else if (DA === null && CA === null && (FA === null || FA === 1 || FA === -1)) return !0;
        throw Error(Y + "Invalid BigNumber: " + s)
      }, IA.maximum = IA.max = function () {
        return ZA(arguments, -1)
      }, IA.minimum = IA.min = function () {
        return ZA(arguments, 1)
      }, IA.random = function () {
        var s = 9007199254740992,
          t = Math.random() * s & 2097151 ? function () {
            return Z(Math.random() * s)
          } : function () {
            return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0)
          };
        return function (BA) {
          var DA, CA, FA, xA, mA, G1 = 0,
            J1 = [],
            SA = new IA(u);
          if (BA == null) BA = f;
          else $(BA, 0, V);
          if (xA = G(BA / I), WA)
            if (crypto.getRandomValues) {
              DA = crypto.getRandomValues(new Uint32Array(xA *= 2));
              for (; G1 < xA;)
                if (mA = DA[G1] * 131072 + (DA[G1 + 1] >>> 11), mA >= 9000000000000000) CA = crypto.getRandomValues(new Uint32Array(2)), DA[G1] = CA[0], DA[G1 + 1] = CA[1];
                else J1.push(mA % 100000000000000), G1 += 2;
              G1 = xA / 2
            } else if (crypto.randomBytes) {
            DA = crypto.randomBytes(xA *= 7);
            for (; G1 < xA;)
              if (mA = (DA[G1] & 31) * 281474976710656 + DA[G1 + 1] * 1099511627776 + DA[G1 + 2] * 4294967296 + DA[G1 + 3] * 16777216 + (DA[G1 + 4] << 16) + (DA[G1 + 5] << 8) + DA[G1 + 6], mA >= 9000000000000000) crypto.randomBytes(7).copy(DA, G1);
              else J1.push(mA % 100000000000000), G1 += 7;
            G1 = xA / 7
          } else throw WA = !1, Error(Y + "crypto unavailable");
          if (!WA) {
            for (; G1 < xA;)
              if (mA = t(), mA < 9000000000000000) J1[G1++] = mA % 100000000000000
          }
          if (xA = J1[--G1], BA %= I, xA && BA) mA = W[I - BA], J1[G1] = Z(xA / mA) * mA;
          for (; J1[G1] === 0; J1.pop(), G1--);
          if (G1 < 0) J1 = [FA = 0];
          else {
            for (FA = -1; J1[0] === 0; J1.splice(0, 1), FA -= I);
            for (G1 = 1, mA = J1[0]; mA >= 10; mA /= 10, G1++);
            if (G1 < I) FA -= I - G1
          }
          return SA.e = FA, SA.c = J1, SA
        }
      }(), IA.sum = function () {
        var s = 1,
          t = arguments,
          BA = new IA(t[0]);
        for (; s < t.length;) BA = BA.plus(t[s++]);
        return BA
      }, x = function () {
        var s = "0123456789";

        function t(BA, DA, CA, FA) {
          var xA, mA = [0],
            G1, J1 = 0,
            SA = BA.length;
          for (; J1 < SA;) {
            for (G1 = mA.length; G1--; mA[G1] *= DA);
            mA[0] += FA.indexOf(BA.charAt(J1++));
            for (xA = 0; xA < mA.length; xA++)
              if (mA[xA] > CA - 1) {
                if (mA[xA + 1] == null) mA[xA + 1] = 0;
                mA[xA + 1] += mA[xA] / CA | 0, mA[xA] %= CA
              }
          }
          return mA.reverse()
        }
        return function (BA, DA, CA, FA, xA) {
          var mA, G1, J1, SA, A1, n1, S1, L0, VQ = BA.indexOf("."),
            t0 = f,
            QQ = AA;
          if (VQ >= 0) SA = TA, TA = 0, BA = BA.replace(".", ""), L0 = new IA(DA), n1 = L0.pow(BA.length - VQ), TA = SA, L0.c = t(M(E(n1.c), n1.e, "0"), 10, CA, s), L0.e = L0.c.length;
          S1 = t(BA, DA, CA, xA ? (mA = jA, s) : (mA = s, jA)), J1 = SA = S1.length;
          for (; S1[--SA] == 0; S1.pop());
          if (!S1[0]) return mA.charAt(0);
          if (VQ < 0) --J1;
          else n1.c = S1, n1.e = J1, n1.s = FA, n1 = j(n1, L0, t0, QQ, CA), S1 = n1.c, A1 = n1.r, J1 = n1.e;
          if (G1 = J1 + t0 + 1, VQ = S1[G1], SA = CA / 2, A1 = A1 || G1 < 0 || S1[G1 + 1] != null, A1 = QQ < 4 ? (VQ != null || A1) && (QQ == 0 || QQ == (n1.s < 0 ? 3 : 2)) : VQ > SA || VQ == SA && (QQ == 4 || A1 || QQ == 6 && S1[G1 - 1] & 1 || QQ == (n1.s < 0 ? 8 : 7)), G1 < 1 || !S1[0]) BA = A1 ? M(mA.charAt(1), -t0, mA.charAt(0)) : mA.charAt(0);
          else {
            if (S1.length = G1, A1) {
              for (--CA; ++S1[--G1] > CA;)
                if (S1[G1] = 0, !G1) ++J1, S1 = [1].concat(S1)
            }
            for (SA = S1.length; !S1[--SA];);
            for (VQ = 0, BA = ""; VQ <= SA; BA += mA.charAt(S1[VQ++]));
            BA = M(BA, J1, mA.charAt(0))
          }
          return BA
        }
      }(), j = function () {
        function s(DA, CA, FA) {
          var xA, mA, G1, J1, SA = 0,
            A1 = DA.length,
            n1 = CA % K,
            S1 = CA / K | 0;
          for (DA = DA.slice(); A1--;) G1 = DA[A1] % K, J1 = DA[A1] / K | 0, xA = S1 * G1 + J1 * n1, mA = n1 * G1 + xA % K * K + SA, SA = (mA / FA | 0) + (xA / K | 0) + S1 * J1, DA[A1] = mA % FA;
          if (SA) DA = [SA].concat(DA);
          return DA
        }

        function t(DA, CA, FA, xA) {
          var mA, G1;
          if (FA != xA) G1 = FA > xA ? 1 : -1;
          else
            for (mA = G1 = 0; mA < FA; mA++)
              if (DA[mA] != CA[mA]) {
                G1 = DA[mA] > CA[mA] ? 1 : -1;
                break
              } return G1
        }

        function BA(DA, CA, FA, xA) {
          var mA = 0;
          for (; FA--;) DA[FA] -= mA, mA = DA[FA] < CA[FA] ? 1 : 0, DA[FA] = mA * xA + DA[FA] - CA[FA];
          for (; !DA[0] && DA.length > 1; DA.splice(0, 1));
        }
        return function (DA, CA, FA, xA, mA) {
          var G1, J1, SA, A1, n1, S1, L0, VQ, t0, QQ, y1, qQ, K1, $1, i1, Q0, c0, b0 = DA.s == CA.s ? 1 : -1,
            UA = DA.c,
            RA = CA.c;
          if (!UA || !UA[0] || !RA || !RA[0]) return new IA(!DA.s || !CA.s || (UA ? RA && UA[0] == RA[0] : !RA) ? NaN : UA && UA[0] == 0 || !RA ? b0 * 0 : b0 / 0);
          if (VQ = new IA(b0), t0 = VQ.c = [], J1 = DA.e - CA.e, b0 = FA + J1 + 1, !mA) mA = X, J1 = H(DA.e / I) - H(CA.e / I), b0 = b0 / I | 0;
          for (SA = 0; RA[SA] == (UA[SA] || 0); SA++);
          if (RA[SA] > (UA[SA] || 0)) J1--;
          if (b0 < 0) t0.push(1), A1 = !0;
          else {
            if ($1 = UA.length, Q0 = RA.length, SA = 0, b0 += 2, n1 = Z(mA / (RA[0] + 1)), n1 > 1) RA = s(RA, n1, mA), UA = s(UA, n1, mA), Q0 = RA.length, $1 = UA.length;
            K1 = Q0, QQ = UA.slice(0, Q0), y1 = QQ.length;
            for (; y1 < Q0; QQ[y1++] = 0);
            if (c0 = RA.slice(), c0 = [0].concat(c0), i1 = RA[0], RA[1] >= mA / 2) i1++;
            do {
              if (n1 = 0, G1 = t(RA, QQ, Q0, y1), G1 < 0) {
                if (qQ = QQ[0], Q0 != y1) qQ = qQ * mA + (QQ[1] || 0);
                if (n1 = Z(qQ / i1), n1 > 1) {
                  if (n1 >= mA) n1 = mA - 1;
                  S1 = s(RA, n1, mA), L0 = S1.length, y1 = QQ.length;
                  while (t(S1, QQ, L0, y1) == 1) n1--, BA(S1, Q0 < L0 ? c0 : RA, L0, mA), L0 = S1.length, G1 = 1
                } else {
                  if (n1 == 0) G1 = n1 = 1;
                  S1 = RA.slice(), L0 = S1.length
                }
                if (L0 < y1) S1 = [0].concat(S1);
                if (BA(QQ, S1, y1, mA), y1 = QQ.length, G1 == -1)
                  while (t(RA, QQ, Q0, y1) < 1) n1++, BA(QQ, Q0 < y1 ? c0 : RA, y1, mA), y1 = QQ.length
              } else if (G1 === 0) n1++, QQ = [0];
              if (t0[SA++] = n1, QQ[0]) QQ[y1++] = UA[K1] || 0;
              else QQ = [UA[K1]], y1 = 1
            } while ((K1++ < $1 || QQ[0] != null) && b0--);
            if (A1 = QQ[0] != null, !t0[0]) t0.splice(0, 1)
          }
          if (mA == X) {
            for (SA = 1, b0 = t0[0]; b0 >= 10; b0 /= 10, SA++);
            wA(VQ, FA + (VQ.e = SA + J1 * I - 1) + 1, xA, A1)
          } else VQ.e = J1, VQ.r = +A1;
          return VQ
        }
      }();

      function HA(s, t, BA, DA) {
        var CA, FA, xA, mA, G1;
        if (BA == null) BA = AA;
        else $(BA, 0, 8);
        if (!s.c) return s.toString();
        if (CA = s.c[0], xA = s.e, t == null) G1 = E(s.c), G1 = DA == 1 || DA == 2 && (xA <= n || xA >= y) ? L(G1, xA) : M(G1, xA, "0");
        else if (s = wA(new IA(s), t, BA), FA = s.e, G1 = E(s.c), mA = G1.length, DA == 1 || DA == 2 && (t <= FA || FA <= n)) {
          for (; mA < t; G1 += "0", mA++);
          G1 = L(G1, FA)
        } else if (t -= xA, G1 = M(G1, FA, "0"), FA + 1 > mA) {
          if (--t > 0)
            for (G1 += "."; t--; G1 += "0");
        } else if (t += FA - mA, t > 0) {
          if (FA + 1 == mA) G1 += ".";
          for (; t--; G1 += "0");
        }
        return s.s < 0 && CA ? "-" + G1 : G1
      }

      function ZA(s, t) {
        var BA, DA, CA = 1,
          FA = new IA(s[0]);
        for (; CA < s.length; CA++)
          if (DA = new IA(s[CA]), !DA.s || (BA = z(FA, DA)) === t || BA === 0 && FA.s === t) FA = DA;
        return FA
      }

      function zA(s, t, BA) {
        var DA = 1,
          CA = t.length;
        for (; !t[--CA]; t.pop());
        for (CA = t[0]; CA >= 10; CA /= 10, DA++);
        if ((BA = DA + BA * I - 1) > GA) s.c = s.e = null;
        else if (BA < p) s.c = [s.e = 0];
        else s.e = BA, s.c = t;
        return s
      }
      b = function () {
        var s = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
          t = /^([^.]+)\.$/,
          BA = /^\.([^.]+)$/,
          DA = /^-?(Infinity|NaN)$/,
          CA = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
        return function (FA, xA, mA, G1) {
          var J1, SA = mA ? xA : xA.replace(CA, "");
          if (DA.test(SA)) FA.s = isNaN(SA) ? null : SA < 0 ? -1 : 1;
          else {
            if (!mA) {
              if (SA = SA.replace(s, function (A1, n1, S1) {
                  return J1 = (S1 = S1.toLowerCase()) == "x" ? 16 : S1 == "b" ? 2 : 8, !G1 || G1 == J1 ? n1 : A1
                }), G1) J1 = G1, SA = SA.replace(t, "$1").replace(BA, "0.$1");
              if (xA != SA) return new IA(SA, J1)
            }
            if (IA.DEBUG) throw Error(Y + "Not a" + (G1 ? " base " + G1 : "") + " number: " + xA);
            FA.s = null
          }
          FA.c = FA.e = null
        }
      }();

      function wA(s, t, BA, DA) {
        var CA, FA, xA, mA, G1, J1, SA, A1 = s.c,
          n1 = W;
        if (A1) {
          A: {
            for (CA = 1, mA = A1[0]; mA >= 10; mA /= 10, CA++);
            if (FA = t - CA, FA < 0) FA += I,
            xA = t,
            G1 = A1[J1 = 0],
            SA = Z(G1 / n1[CA - xA - 1] % 10);
            else if (J1 = G((FA + 1) / I), J1 >= A1.length)
              if (DA) {
                for (; A1.length <= J1; A1.push(0));
                G1 = SA = 0, CA = 1, FA %= I, xA = FA - I + 1
              } else break A;
            else {
              G1 = mA = A1[J1];
              for (CA = 1; mA >= 10; mA /= 10, CA++);
              FA %= I, xA = FA - I + CA, SA = xA < 0 ? 0 : Z(G1 / n1[CA - xA - 1] % 10)
            }
            if (DA = DA || t < 0 || A1[J1 + 1] != null || (xA < 0 ? G1 : G1 % n1[CA - xA - 1]), DA = BA < 4 ? (SA || DA) && (BA == 0 || BA == (s.s < 0 ? 3 : 2)) : SA > 5 || SA == 5 && (BA == 4 || DA || BA == 6 && (FA > 0 ? xA > 0 ? G1 / n1[CA - xA] : 0 : A1[J1 - 1]) % 10 & 1 || BA == (s.s < 0 ? 8 : 7)), t < 1 || !A1[0]) {
              if (A1.length = 0, DA) t -= s.e + 1, A1[0] = n1[(I - t % I) % I], s.e = -t || 0;
              else A1[0] = s.e = 0;
              return s
            }
            if (FA == 0) A1.length = J1,
            mA = 1,
            J1--;
            else A1.length = J1 + 1,
            mA = n1[I - FA],
            A1[J1] = xA > 0 ? Z(G1 / n1[CA - xA] % n1[xA]) * mA : 0;
            if (DA)
              for (;;)
                if (J1 == 0) {
                  for (FA = 1, xA = A1[0]; xA >= 10; xA /= 10, FA++);
                  xA = A1[0] += mA;
                  for (mA = 1; xA >= 10; xA /= 10, mA++);
                  if (FA != mA) {
                    if (s.e++, A1[0] == X) A1[0] = 1
                  }
                  break
                } else {
                  if (A1[J1] += mA, A1[J1] != X) break;
                  A1[J1--] = 0, mA = 1
                } for (FA = A1.length; A1[--FA] === 0; A1.pop());
          }
          if (s.e > GA) s.c = s.e = null;
          else if (s.e < p) s.c = [s.e = 0]
        }
        return s
      }

      function _A(s) {
        var t, BA = s.e;
        if (BA === null) return s.toString();
        return t = E(s.c), t = BA <= n || BA >= y ? L(t, BA) : M(t, BA, "0"), s.s < 0 ? "-" + t : t
      }
      if (S.absoluteValue = S.abs = function () {
          var s = new IA(this);
          if (s.s < 0) s.s = 1;
          return s
        }, S.comparedTo = function (s, t) {
          return z(this, new IA(s, t))
        }, S.decimalPlaces = S.dp = function (s, t) {
          var BA, DA, CA, FA = this;
          if (s != null) {
            if ($(s, 0, V), t == null) t = AA;
            else $(t, 0, 8);
            return wA(new IA(FA), s + FA.e + 1, t)
          }
          if (!(BA = FA.c)) return null;
          if (DA = ((CA = BA.length - 1) - H(this.e / I)) * I, CA = BA[CA])
            for (; CA % 10 == 0; CA /= 10, DA--);
          if (DA < 0) DA = 0;
          return DA
        }, S.dividedBy = S.div = function (s, t) {
          return j(this, new IA(s, t), f, AA)
        }, S.dividedToIntegerBy = S.idiv = function (s, t) {
          return j(this, new IA(s, t), 0, 1)
        }, S.exponentiatedBy = S.pow = function (s, t) {
          var BA, DA, CA, FA, xA, mA, G1, J1, SA, A1 = this;
          if (s = new IA(s), s.c && !s.isInteger()) throw Error(Y + "Exponent not an integer: " + _A(s));
          if (t != null) t = new IA(t);
          if (mA = s.e > 14, !A1.c || !A1.c[0] || A1.c[0] == 1 && !A1.e && A1.c.length == 1 || !s.c || !s.c[0]) return SA = new IA(Math.pow(+_A(A1), mA ? s.s * (2 - O(s)) : +_A(s))), t ? SA.mod(t) : SA;
          if (G1 = s.s < 0, t) {
            if (t.c ? !t.c[0] : !t.s) return new IA(NaN);
            if (DA = !G1 && A1.isInteger() && t.isInteger(), DA) A1 = A1.mod(t)
          } else if (s.e > 9 && (A1.e > 0 || A1.e < -1 || (A1.e == 0 ? A1.c[0] > 1 || mA && A1.c[1] >= 240000000 : A1.c[0] < 80000000000000 || mA && A1.c[0] <= 99999750000000))) {
            if (FA = A1.s < 0 && O(s) ? -0 : 0, A1.e > -1) FA = 1 / FA;
            return new IA(G1 ? 1 / FA : FA)
          } else if (TA) FA = G(TA / I + 2);
          if (mA) {
            if (BA = new IA(0.5), G1) s.s = 1;
            J1 = O(s)
          } else CA = Math.abs(+_A(s)), J1 = CA % 2;
          SA = new IA(u);
          for (;;) {
            if (J1) {
              if (SA = SA.times(A1), !SA.c) break;
              if (FA) {
                if (SA.c.length > FA) SA.c.length = FA
              } else if (DA) SA = SA.mod(t)
            }
            if (CA) {
              if (CA = Z(CA / 2), CA === 0) break;
              J1 = CA % 2
            } else if (s = s.times(BA), wA(s, s.e + 1, 1), s.e > 14) J1 = O(s);
            else {
              if (CA = +_A(s), CA === 0) break;
              J1 = CA % 2
            }
            if (A1 = A1.times(A1), FA) {
              if (A1.c && A1.c.length > FA) A1.c.length = FA
            } else if (DA) A1 = A1.mod(t)
          }
          if (DA) return SA;
          if (G1) SA = u.div(SA);
          return t ? SA.mod(t) : FA ? wA(SA, TA, AA, xA) : SA
        }, S.integerValue = function (s) {
          var t = new IA(this);
          if (s == null) s = AA;
          else $(s, 0, 8);
          return wA(t, t.e + 1, s)
        }, S.isEqualTo = S.eq = function (s, t) {
          return z(this, new IA(s, t)) === 0
        }, S.isFinite = function () {
          return !!this.c
        }, S.isGreaterThan = S.gt = function (s, t) {
          return z(this, new IA(s, t)) > 0
        }, S.isGreaterThanOrEqualTo = S.gte = function (s, t) {
          return (t = z(this, new IA(s, t))) === 1 || t === 0
        }, S.isInteger = function () {
          return !!this.c && H(this.e / I) > this.c.length - 2
        }, S.isLessThan = S.lt = function (s, t) {
          return z(this, new IA(s, t)) < 0
        }, S.isLessThanOrEqualTo = S.lte = function (s, t) {
          return (t = z(this, new IA(s, t))) === -1 || t === 0
        }, S.isNaN = function () {
          return !this.s
        }, S.isNegative = function () {
          return this.s < 0
        }, S.isPositive = function () {
          return this.s > 0
        }, S.isZero = function () {
          return !!this.c && this.c[0] == 0
        }, S.minus = function (s, t) {
          var BA, DA, CA, FA, xA = this,
            mA = xA.s;
          if (s = new IA(s, t), t = s.s, !mA || !t) return new IA(NaN);
          if (mA != t) return s.s = -t, xA.plus(s);
          var G1 = xA.e / I,
            J1 = s.e / I,
            SA = xA.c,
            A1 = s.c;
          if (!G1 || !J1) {
            if (!SA || !A1) return SA ? (s.s = -t, s) : new IA(A1 ? xA : NaN);
            if (!SA[0] || !A1[0]) return A1[0] ? (s.s = -t, s) : new IA(SA[0] ? xA : AA == 3 ? -0 : 0)
          }
          if (G1 = H(G1), J1 = H(J1), SA = SA.slice(), mA = G1 - J1) {
            if (FA = mA < 0) mA = -mA, CA = SA;
            else J1 = G1, CA = A1;
            CA.reverse();
            for (t = mA; t--; CA.push(0));
            CA.reverse()
          } else {
            DA = (FA = (mA = SA.length) < (t = A1.length)) ? mA : t;
            for (mA = t = 0; t < DA; t++)
              if (SA[t] != A1[t]) {
                FA = SA[t] < A1[t];
                break
              }
          }
          if (FA) CA = SA, SA = A1, A1 = CA, s.s = -s.s;
          if (t = (DA = A1.length) - (BA = SA.length), t > 0)
            for (; t--; SA[BA++] = 0);
          t = X - 1;
          for (; DA > mA;) {
            if (SA[--DA] < A1[DA]) {
              for (BA = DA; BA && !SA[--BA]; SA[BA] = t);
              --SA[BA], SA[DA] += X
            }
            SA[DA] -= A1[DA]
          }
          for (; SA[0] == 0; SA.splice(0, 1), --J1);
          if (!SA[0]) return s.s = AA == 3 ? -1 : 1, s.c = [s.e = 0], s;
          return zA(s, SA, J1)
        }, S.modulo = S.mod = function (s, t) {
          var BA, DA, CA = this;
          if (s = new IA(s, t), !CA.c || !s.s || s.c && !s.c[0]) return new IA(NaN);
          else if (!s.c || CA.c && !CA.c[0]) return new IA(CA);
          if (MA == 9) DA = s.s, s.s = 1, BA = j(CA, s, 0, 3), s.s = DA, BA.s *= DA;
          else BA = j(CA, s, 0, MA);
          if (s = CA.minus(BA.times(s)), !s.c[0] && MA == 1) s.s = CA.s;
          return s
        }, S.multipliedBy = S.times = function (s, t) {
          var BA, DA, CA, FA, xA, mA, G1, J1, SA, A1, n1, S1, L0, VQ, t0, QQ = this,
            y1 = QQ.c,
            qQ = (s = new IA(s, t)).c;
          if (!y1 || !qQ || !y1[0] || !qQ[0]) {
            if (!QQ.s || !s.s || y1 && !y1[0] && !qQ || qQ && !qQ[0] && !y1) s.c = s.e = s.s = null;
            else if (s.s *= QQ.s, !y1 || !qQ) s.c = s.e = null;
            else s.c = [0], s.e = 0;
            return s
          }
          if (DA = H(QQ.e / I) + H(s.e / I), s.s *= QQ.s, G1 = y1.length, A1 = qQ.length, G1 < A1) L0 = y1, y1 = qQ, qQ = L0, CA = G1, G1 = A1, A1 = CA;
          for (CA = G1 + A1, L0 = []; CA--; L0.push(0));
          VQ = X, t0 = K;
          for (CA = A1; --CA >= 0;) {
            BA = 0, n1 = qQ[CA] % t0, S1 = qQ[CA] / t0 | 0;
            for (xA = G1, FA = CA + xA; FA > CA;) J1 = y1[--xA] % t0, SA = y1[xA] / t0 | 0, mA = S1 * J1 + SA * n1, J1 = n1 * J1 + mA % t0 * t0 + L0[FA] + BA, BA = (J1 / VQ | 0) + (mA / t0 | 0) + S1 * SA, L0[FA--] = J1 % VQ;
            L0[FA] = BA
          }
          if (BA) ++DA;
          else L0.splice(0, 1);
          return zA(s, L0, DA)
        }, S.negated = function () {
          var s = new IA(this);
          return s.s = -s.s || null, s
        }, S.plus = function (s, t) {
          var BA, DA = this,
            CA = DA.s;
          if (s = new IA(s, t), t = s.s, !CA || !t) return new IA(NaN);
          if (CA != t) return s.s = -t, DA.minus(s);
          var FA = DA.e / I,
            xA = s.e / I,
            mA = DA.c,
            G1 = s.c;
          if (!FA || !xA) {
            if (!mA || !G1) return new IA(CA / 0);
            if (!mA[0] || !G1[0]) return G1[0] ? s : new IA(mA[0] ? DA : CA * 0)
          }
          if (FA = H(FA), xA = H(xA), mA = mA.slice(), CA = FA - xA) {
            if (CA > 0) xA = FA, BA = G1;
            else CA = -CA, BA = mA;
            BA.reverse();
            for (; CA--; BA.push(0));
            BA.reverse()
          }
          if (CA = mA.length, t = G1.length, CA - t < 0) BA = G1, G1 = mA, mA = BA, t = CA;
          for (CA = 0; t;) CA = (mA[--t] = mA[t] + G1[t] + CA) / X | 0, mA[t] = X === mA[t] ? 0 : mA[t] % X;
          if (CA) mA = [CA].concat(mA), ++xA;
          return zA(s, mA, xA)
        }, S.precision = S.sd = function (s, t) {
          var BA, DA, CA, FA = this;
          if (s != null && s !== !!s) {
            if ($(s, 1, V), t == null) t = AA;
            else $(t, 0, 8);
            return wA(new IA(FA), s, t)
          }
          if (!(BA = FA.c)) return null;
          if (CA = BA.length - 1, DA = CA * I + 1, CA = BA[CA]) {
            for (; CA % 10 == 0; CA /= 10, DA--);
            for (CA = BA[0]; CA >= 10; CA /= 10, DA++);
          }
          if (s && FA.e + 1 > DA) DA = FA.e + 1;
          return DA
        }, S.shiftedBy = function (s) {
          return $(s, -D, D), this.times("1e" + s)
        }, S.squareRoot = S.sqrt = function () {
          var s, t, BA, DA, CA, FA = this,
            xA = FA.c,
            mA = FA.s,
            G1 = FA.e,
            J1 = f + 4,
            SA = new IA("0.5");
          if (mA !== 1 || !xA || !xA[0]) return new IA(!mA || mA < 0 && (!xA || xA[0]) ? NaN : xA ? FA : 1 / 0);
          if (mA = Math.sqrt(+_A(FA)), mA == 0 || mA == 1 / 0) {
            if (t = E(xA), (t.length + G1) % 2 == 0) t += "0";
            if (mA = Math.sqrt(+t), G1 = H((G1 + 1) / 2) - (G1 < 0 || G1 % 2), mA == 1 / 0) t = "5e" + G1;
            else t = mA.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + G1;
            BA = new IA(t)
          } else BA = new IA(mA + "");
          if (BA.c[0]) {
            if (G1 = BA.e, mA = G1 + J1, mA < 3) mA = 0;
            for (;;)
              if (CA = BA, BA = SA.times(CA.plus(j(FA, CA, J1, 1))), E(CA.c).slice(0, mA) === (t = E(BA.c)).slice(0, mA)) {
                if (BA.e < G1) --mA;
                if (t = t.slice(mA - 3, mA + 1), t == "9999" || !DA && t == "4999") {
                  if (!DA) {
                    if (wA(CA, CA.e + f + 2, 0), CA.times(CA).eq(FA)) {
                      BA = CA;
                      break
                    }
                  }
                  J1 += 4, mA += 4, DA = 1
                } else {
                  if (!+t || !+t.slice(1) && t.charAt(0) == "5") wA(BA, BA.e + f + 2, 1), s = !BA.times(BA).eq(FA);
                  break
                }
              }
          }
          return wA(BA, BA.e + f + 1, AA, s)
        }, S.toExponential = function (s, t) {
          if (s != null) $(s, 0, V), s++;
          return HA(this, s, t, 1)
        }, S.toFixed = function (s, t) {
          if (s != null) $(s, 0, V), s = s + this.e + 1;
          return HA(this, s, t)
        }, S.toFormat = function (s, t, BA) {
          var DA, CA = this;
          if (BA == null)
            if (s != null && t && typeof t == "object") BA = t, t = null;
            else if (s && typeof s == "object") BA = s, s = t = null;
          else BA = bA;
          else if (typeof BA != "object") throw Error(Y + "Argument not an object: " + BA);
          if (DA = CA.toFixed(s, t), CA.c) {
            var FA, xA = DA.split("."),
              mA = +BA.groupSize,
              G1 = +BA.secondaryGroupSize,
              J1 = BA.groupSeparator || "",
              SA = xA[0],
              A1 = xA[1],
              n1 = CA.s < 0,
              S1 = n1 ? SA.slice(1) : SA,
              L0 = S1.length;
            if (G1) FA = mA, mA = G1, G1 = FA, L0 -= FA;
            if (mA > 0 && L0 > 0) {
              FA = L0 % mA || mA, SA = S1.substr(0, FA);
              for (; FA < L0; FA += mA) SA += J1 + S1.substr(FA, mA);
              if (G1 > 0) SA += J1 + S1.slice(FA);
              if (n1) SA = "-" + SA
            }
            DA = A1 ? SA + (BA.decimalSeparator || "") + ((G1 = +BA.fractionGroupSize) ? A1.replace(new RegExp("\\d{" + G1 + "}\\B", "g"), "$&" + (BA.fractionGroupSeparator || "")) : A1) : SA
          }
          return (BA.prefix || "") + DA + (BA.suffix || "")
        }, S.toFraction = function (s) {
          var t, BA, DA, CA, FA, xA, mA, G1, J1, SA, A1, n1, S1 = this,
            L0 = S1.c;
          if (s != null) {
            if (mA = new IA(s), !mA.isInteger() && (mA.c || mA.s !== 1) || mA.lt(u)) throw Error(Y + "Argument " + (mA.isInteger() ? "out of range: " : "not an integer: ") + _A(mA))
          }
          if (!L0) return new IA(S1);
          t = new IA(u), J1 = BA = new IA(u), DA = G1 = new IA(u), n1 = E(L0), FA = t.e = n1.length - S1.e - 1, t.c[0] = W[(xA = FA % I) < 0 ? I + xA : xA], s = !s || mA.comparedTo(t) > 0 ? FA > 0 ? t : J1 : mA, xA = GA, GA = 1 / 0, mA = new IA(n1), G1.c[0] = 0;
          for (;;) {
            if (SA = j(mA, t, 0, 1), CA = BA.plus(SA.times(DA)), CA.comparedTo(s) == 1) break;
            BA = DA, DA = CA, J1 = G1.plus(SA.times(CA = J1)), G1 = CA, t = mA.minus(SA.times(CA = t)), mA = CA
          }
          return CA = j(s.minus(BA), DA, 0, 1), G1 = G1.plus(CA.times(J1)), BA = BA.plus(CA.times(DA)), G1.s = J1.s = S1.s, FA = FA * 2, A1 = j(J1, DA, FA, AA).minus(S1).abs().comparedTo(j(G1, BA, FA, AA).minus(S1).abs()) < 1 ? [J1, DA] : [G1, BA], GA = xA, A1
        }, S.toNumber = function () {
          return +_A(this)
        }, S.toPrecision = function (s, t) {
          if (s != null) $(s, 1, V);
          return HA(this, s, t, 2)
        }, S.toString = function (s) {
          var t, BA = this,
            DA = BA.s,
            CA = BA.e;
          if (CA === null)
            if (DA) {
              if (t = "Infinity", DA < 0) t = "-" + t
            } else t = "NaN";
          else {
            if (s == null) t = CA <= n || CA >= y ? L(E(BA.c), CA) : M(E(BA.c), CA, "0");
            else if (s === 10 && OA) BA = wA(new IA(BA), f + CA + 1, AA), t = M(E(BA.c), BA.e, "0");
            else $(s, 2, jA.length, "Base"), t = x(M(E(BA.c), CA, "0"), 10, s, DA, !0);
            if (DA < 0 && BA.c[0]) t = "-" + t
          }
          return t
        }, S.valueOf = S.toJSON = function () {
          return _A(this)
        }, S._isBigNumber = !0, _ != null) IA.set(_);
      return IA
    }

    function H(_) {
      var j = _ | 0;
      return _ > 0 || _ === j ? j : j - 1
    }

    function E(_) {
      var j, x, b = 1,
        S = _.length,
        u = _[0] + "";
      for (; b < S;) {
        j = _[b++] + "", x = I - j.length;
        for (; x--; j = "0" + j);
        u += j
      }
      for (S = u.length; u.charCodeAt(--S) === 48;);
      return u.slice(0, S + 1 || 1)
    }

    function z(_, j) {
      var x, b, S = _.c,
        u = j.c,
        f = _.s,
        AA = j.s,
        n = _.e,
        y = j.e;
      if (!f || !AA) return null;
      if (x = S && !S[0], b = u && !u[0], x || b) return x ? b ? 0 : -AA : f;
      if (f != AA) return f;
      if (x = f < 0, b = n == y, !S || !u) return b ? 0 : !S ^ x ? 1 : -1;
      if (!b) return n > y ^ x ? 1 : -1;
      AA = (n = S.length) < (y = u.length) ? n : y;
      for (f = 0; f < AA; f++)
        if (S[f] != u[f]) return S[f] > u[f] ^ x ? 1 : -1;
      return n == y ? 0 : n > y ^ x ? 1 : -1
    }

    function $(_, j, x, b) {
      if (_ < j || _ > x || _ !== Z(_)) throw Error(Y + (b || "Argument") + (typeof _ == "number" ? _ < j || _ > x ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(_))
    }

    function O(_) {
      var j = _.c.length - 1;
      return H(_.e / I) == j && _.c[j] % 2 != 0
    }

    function L(_, j) {
      return (_.length > 1 ? _.charAt(0) + "." + _.slice(1) : _) + (j < 0 ? "e" : "e+") + j
    }

    function M(_, j, x) {
      var b, S;
      if (j < 0) {
        for (S = x + "."; ++j; S += x);
        _ = S + _
      } else if (b = _.length, ++j > b) {
        for (S = x, j -= b; --j; S += x);
        _ += S
      } else if (j < b) _ = _.slice(0, j) + "." + _.slice(j);
      return _
    }
    if (Q = F(), Q.default = Q.BigNumber = Q, typeof define == "function" && define.amd) define(function () {
      return Q
    });
    else if (typeof X61 < "u" && X61.exports) X61.exports = Q;
    else {
      if (!A) A = typeof self < "u" && self ? self : window;
      A.BigNumber = Q
    }
  })(rbB)
})
// @from(Ln 220023, Col 4)
AfB = U((JpG, ebB) => {
  var sbB = g40(),
    tbB = JpG;
  (function () {
    function A(D) {
      return D < 10 ? "0" + D : D
    }
    var Q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      B = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      G, Z, Y = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': "\\\"",
        "\\": "\\\\"
      },
      J;

    function X(D) {
      return B.lastIndex = 0, B.test(D) ? '"' + D.replace(B, function (W) {
        var K = Y[W];
        return typeof K === "string" ? K : "\\u" + ("0000" + W.charCodeAt(0).toString(16)).slice(-4)
      }) + '"' : '"' + D + '"'
    }

    function I(D, W) {
      var K, V, F, H, E = G,
        z, $ = W[D],
        O = $ != null && ($ instanceof sbB || sbB.isBigNumber($));
      if ($ && typeof $ === "object" && typeof $.toJSON === "function") $ = $.toJSON(D);
      if (typeof J === "function") $ = J.call(W, D, $);
      switch (typeof $) {
        case "string":
          if (O) return $;
          else return X($);
        case "number":
          return isFinite($) ? String($) : "null";
        case "boolean":
        case "null":
        case "bigint":
          return String($);
        case "object":
          if (!$) return "null";
          if (G += Z, z = [], Object.prototype.toString.apply($) === "[object Array]") {
            H = $.length;
            for (K = 0; K < H; K += 1) z[K] = I(K, $) || "null";
            return F = z.length === 0 ? "[]" : G ? `[
` + G + z.join(`,
` + G) + `
` + E + "]" : "[" + z.join(",") + "]", G = E, F
          }
          if (J && typeof J === "object") {
            H = J.length;
            for (K = 0; K < H; K += 1)
              if (typeof J[K] === "string") {
                if (V = J[K], F = I(V, $), F) z.push(X(V) + (G ? ": " : ":") + F)
              }
          } else Object.keys($).forEach(function (L) {
            var M = I(L, $);
            if (M) z.push(X(L) + (G ? ": " : ":") + M)
          });
          return F = z.length === 0 ? "{}" : G ? `{
` + G + z.join(`,
` + G) + `
` + E + "}" : "{" + z.join(",") + "}", G = E, F
      }
    }
    if (typeof tbB.stringify !== "function") tbB.stringify = function (D, W, K) {
      var V;
      if (G = "", Z = "", typeof K === "number")
        for (V = 0; V < K; V += 1) Z += " ";
      else if (typeof K === "string") Z = K;
      if (J = W, W && typeof W !== "function" && (typeof W !== "object" || typeof W.length !== "number")) throw Error("JSON.stringify");
      return I("", {
        "": D
      })
    }
  })()
})
// @from(Ln 220104, Col 4)
BfB = U((XpG, QfB) => {
  var I61 = null,
    bP8 = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/,
    fP8 = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/,
    hP8 = function (A) {
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
        Y, J = function (E) {
          throw {
            name: "SyntaxError",
            message: E,
            at: B,
            text: Y
          }
        },
        X = function (E) {
          if (E && E !== G) J("Expected '" + E + "' instead of '" + G + "'");
          return G = Y.charAt(B), B += 1, G
        },
        I = function () {
          var E, z = "";
          if (G === "-") z = "-", X("-");
          while (G >= "0" && G <= "9") z += G, X();
          if (G === ".") {
            z += ".";
            while (X() && G >= "0" && G <= "9") z += G
          }
          if (G === "e" || G === "E") {
            if (z += G, X(), G === "-" || G === "+") z += G, X();
            while (G >= "0" && G <= "9") z += G, X()
          }
          if (E = +z, !isFinite(E)) J("Bad number");
          else {
            if (I61 == null) I61 = g40();
            if (z.length > 15) return Q.storeAsString ? z : Q.useNativeBigInt ? BigInt(z) : new I61(z);
            else return !Q.alwaysParseAsBig ? E : Q.useNativeBigInt ? BigInt(E) : new I61(E)
          }
        },
        D = function () {
          var E, z, $ = "",
            O;
          if (G === '"') {
            var L = B;
            while (X()) {
              if (G === '"') {
                if (B - 1 > L) $ += Y.substring(L, B - 1);
                return X(), $
              }
              if (G === "\\") {
                if (B - 1 > L) $ += Y.substring(L, B - 1);
                if (X(), G === "u") {
                  O = 0;
                  for (z = 0; z < 4; z += 1) {
                    if (E = parseInt(X(), 16), !isFinite(E)) break;
                    O = O * 16 + E
                  }
                  $ += String.fromCharCode(O)
                } else if (typeof Z[G] === "string") $ += Z[G];
                else break;
                L = B
              }
            }
          }
          J("Bad string")
        },
        W = function () {
          while (G && G <= " ") X()
        },
        K = function () {
          switch (G) {
            case "t":
              return X("t"), X("r"), X("u"), X("e"), !0;
            case "f":
              return X("f"), X("a"), X("l"), X("s"), X("e"), !1;
            case "n":
              return X("n"), X("u"), X("l"), X("l"), null
          }
          J("Unexpected '" + G + "'")
        },
        V, F = function () {
          var E = [];
          if (G === "[") {
            if (X("["), W(), G === "]") return X("]"), E;
            while (G) {
              if (E.push(V()), W(), G === "]") return X("]"), E;
              X(","), W()
            }
          }
          J("Bad array")
        },
        H = function () {
          var E, z = Object.create(null);
          if (G === "{") {
            if (X("{"), W(), G === "}") return X("}"), z;
            while (G) {
              if (E = D(), W(), X(":"), Q.strict === !0 && Object.hasOwnProperty.call(z, E)) J('Duplicate key "' + E + '"');
              if (bP8.test(E) === !0)
                if (Q.protoAction === "error") J("Object contains forbidden prototype property");
                else if (Q.protoAction === "ignore") V();
              else z[E] = V();
              else if (fP8.test(E) === !0)
                if (Q.constructorAction === "error") J("Object contains forbidden constructor property");
                else if (Q.constructorAction === "ignore") V();
              else z[E] = V();
              else z[E] = V();
              if (W(), G === "}") return X("}"), z;
              X(","), W()
            }
          }
          J("Bad object")
        };
      return V = function () {
          switch (W(), G) {
            case "{":
              return H();
            case "[":
              return F();
            case '"':
              return D();
            case "-":
              return I();
            default:
              return G >= "0" && G <= "9" ? I() : K()
          }
        },
        function (E, z) {
          var $;
          if (Y = E + "", B = 0, G = " ", $ = V(), W(), G) J("Syntax error");
          return typeof z === "function" ? function O(L, M) {
            var _, j, x = L[M];
            if (x && typeof x === "object") Object.keys(x).forEach(function (b) {
              if (j = O(x, b), j !== void 0) x[b] = j;
              else delete x[b]
            });
            return z.call(L, M, x)
          }({
            "": $
          }, "") : $
        }
    };
  QfB.exports = hP8
})
// @from(Ln 220273, Col 4)
YfB = U((IpG, D61) => {
  var GfB = AfB().stringify,
    ZfB = BfB();
  D61.exports = function (A) {
    return {
      parse: ZfB(A),
      stringify: GfB
    }
  };
  D61.exports.parse = ZfB();
  D61.exports.stringify = GfB
})
// @from(Ln 220285, Col 4)
u40 = U((VfB) => {
  Object.defineProperty(VfB, "__esModule", {
    value: !0
  });
  VfB.GCE_LINUX_BIOS_PATHS = void 0;
  VfB.isGoogleCloudServerless = IfB;
  VfB.isGoogleComputeEngineLinux = DfB;
  VfB.isGoogleComputeEngineMACAddress = WfB;
  VfB.isGoogleComputeEngine = KfB;
  VfB.detectGCPResidency = uP8;
  var JfB = NA("fs"),
    XfB = NA("os");
  VfB.GCE_LINUX_BIOS_PATHS = {
    BIOS_DATE: "/sys/class/dmi/id/bios_date",
    BIOS_VENDOR: "/sys/class/dmi/id/bios_vendor"
  };
  var gP8 = /^42:01/;

  function IfB() {
    return !!(process.env.CLOUD_RUN_JOB || process.env.FUNCTION_NAME || process.env.K_SERVICE)
  }

  function DfB() {
    if ((0, XfB.platform)() !== "linux") return !1;
    try {
      (0, JfB.statSync)(VfB.GCE_LINUX_BIOS_PATHS.BIOS_DATE);
      let A = (0, JfB.readFileSync)(VfB.GCE_LINUX_BIOS_PATHS.BIOS_VENDOR, "utf8");
      return /Google/.test(A)
    } catch (A) {
      return !1
    }
  }

  function WfB() {
    let A = (0, XfB.networkInterfaces)();
    for (let Q of Object.values(A)) {
      if (!Q) continue;
      for (let {
          mac: B
        }
        of Q)
        if (gP8.test(B)) return !0
    }
    return !1
  }

  function KfB() {
    return DfB() || WfB()
  }

  function uP8() {
    return IfB() || KfB()
  }
})
// @from(Ln 220339, Col 4)
EfB = U((FfB) => {
  Object.defineProperty(FfB, "__esModule", {
    value: !0
  });
  FfB.Colours = void 0;
  class R8 {
    static isEnabled(A) {
      return A.isTTY && (typeof A.getColorDepth === "function" ? A.getColorDepth() > 2 : !0)
    }
    static refresh() {
      if (R8.enabled = R8.isEnabled(process.stderr), !this.enabled) R8.reset = "", R8.bright = "", R8.dim = "", R8.red = "", R8.green = "", R8.yellow = "", R8.blue = "", R8.magenta = "", R8.cyan = "", R8.white = "", R8.grey = "";
      else R8.reset = "\x1B[0m", R8.bright = "\x1B[1m", R8.dim = "\x1B[2m", R8.red = "\x1B[31m", R8.green = "\x1B[32m", R8.yellow = "\x1B[33m", R8.blue = "\x1B[34m", R8.magenta = "\x1B[35m", R8.cyan = "\x1B[36m", R8.white = "\x1B[37m", R8.grey = "\x1B[90m"
    }
  }
  FfB.Colours = R8;
  R8.enabled = !1;
  R8.reset = "";
  R8.bright = "";
  R8.dim = "";
  R8.red = "";
  R8.green = "";
  R8.yellow = "";
  R8.blue = "";
  R8.magenta = "";
  R8.cyan = "";
  R8.white = "";
  R8.grey = "";
  R8.refresh()
})
// @from(Ln 220368, Col 4)
NfB = U((SZ) => {
  var iP8 = SZ && SZ.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    nP8 = SZ && SZ.__setModuleDefault || (Object.create ? function (A, Q) {
      Object.defineProperty(A, "default", {
        enumerable: !0,
        value: Q
      })
    } : function (A, Q) {
      A.default = Q
    }),
    zfB = SZ && SZ.__importStar || function (A) {
      if (A && A.__esModule) return A;
      var Q = {};
      if (A != null) {
        for (var B in A)
          if (B !== "default" && Object.prototype.hasOwnProperty.call(A, B)) iP8(Q, A, B)
      }
      return nP8(Q, A), Q
    };
  Object.defineProperty(SZ, "__esModule", {
    value: !0
  });
  SZ.env = SZ.DebugLogBackendBase = SZ.placeholder = SZ.AdhocDebugLogger = SZ.LogSeverity = void 0;
  SZ.getNodeBackend = m40;
  SZ.getDebugBackend = oP8;
  SZ.getStructuredBackend = rP8;
  SZ.setBackend = sP8;
  SZ.log = qfB;
  var aP8 = NA("node:events"),
    GTA = zfB(NA("node:process")),
    $fB = zfB(NA("node:util")),
    sL = EfB(),
    pP;
  (function (A) {
    A.DEFAULT = "DEFAULT", A.DEBUG = "DEBUG", A.INFO = "INFO", A.WARNING = "WARNING", A.ERROR = "ERROR"
  })(pP || (SZ.LogSeverity = pP = {}));
  class K61 extends aP8.EventEmitter {
    constructor(A, Q) {
      super();
      this.namespace = A, this.upstream = Q, this.func = Object.assign(this.invoke.bind(this), {
        instance: this,
        on: (B, G) => this.on(B, G)
      }), this.func.debug = (...B) => this.invokeSeverity(pP.DEBUG, ...B), this.func.info = (...B) => this.invokeSeverity(pP.INFO, ...B), this.func.warn = (...B) => this.invokeSeverity(pP.WARNING, ...B), this.func.error = (...B) => this.invokeSeverity(pP.ERROR, ...B), this.func.sublog = (B) => qfB(B, this.func)
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
  SZ.AdhocDebugLogger = K61;
  SZ.placeholder = new K61("", () => {}).func;
  class ZTA {
    constructor() {
      var A;
      this.cached = new Map, this.filters = [], this.filtersSet = !1;
      let Q = (A = GTA.env[SZ.env.nodeEnables]) !== null && A !== void 0 ? A : "*";
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
  SZ.DebugLogBackendBase = ZTA;
  class c40 extends ZTA {
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
        let Z = `${sL.Colours.green}${A}${sL.Colours.reset}`,
          Y = `${sL.Colours.yellow}${GTA.pid}${sL.Colours.reset}`,
          J;
        switch (Q.severity) {
          case pP.ERROR:
            J = `${sL.Colours.red}${Q.severity}${sL.Colours.reset}`;
            break;
          case pP.INFO:
            J = `${sL.Colours.magenta}${Q.severity}${sL.Colours.reset}`;
            break;
          case pP.WARNING:
            J = `${sL.Colours.yellow}${Q.severity}${sL.Colours.reset}`;
            break;
          default:
            J = (G = Q.severity) !== null && G !== void 0 ? G : pP.DEFAULT;
            break
        }
        let X = $fB.formatWithOptions({
            colors: sL.Colours.enabled
          }, ...B),
          I = Object.assign({}, Q);
        delete I.severity;
        let D = Object.getOwnPropertyNames(I).length ? JSON.stringify(I) : "",
          W = D ? `${sL.Colours.grey}${D}${sL.Colours.reset}` : "";
        console.error("%s [%s|%s] %s%s", Y, Z, J, X, D ? ` ${W}` : "")
      }
    }
    setFilters() {
      let Q = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
      this.enabledRegexp = new RegExp(`^${Q}$`, "i")
    }
  }

  function m40() {
    return new c40
  }
  class CfB extends ZTA {
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
      let Q = (A = GTA.env.NODE_DEBUG) !== null && A !== void 0 ? A : "";
      GTA.env.NODE_DEBUG = `${Q}${Q?",":""}${this.filters.join(",")}`
    }
  }

  function oP8(A) {
    return new CfB(A)
  }
  class UfB extends ZTA {
    constructor(A) {
      var Q;
      super();
      this.upstream = (Q = A) !== null && Q !== void 0 ? Q : new c40
    }
    makeLogger(A) {
      let Q = this.upstream.makeLogger(A);
      return (B, ...G) => {
        var Z;
        let Y = (Z = B.severity) !== null && Z !== void 0 ? Z : pP.INFO,
          J = Object.assign({
            severity: Y,
            message: $fB.format(...G)
          }, B),
          X = JSON.stringify(J);
        Q(B, X)
      }
    }
    setFilters() {
      this.upstream.setFilters()
    }
  }

  function rP8(A) {
    return new UfB(A)
  }
  SZ.env = {
    nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
  };
  var d40 = new Map,
    H_ = void 0;

  function sP8(A) {
    H_ = A, d40.clear()
  }

  function qfB(A, Q) {
    if (!GTA.env[SZ.env.nodeEnables]) return SZ.placeholder;
    if (!A) return SZ.placeholder;
    if (Q) A = `${Q.instance.namespace}:${A}`;
    let G = d40.get(A);
    if (G) return G.func;
    if (H_ === null) return SZ.placeholder;
    else if (H_ === void 0) H_ = m40();
    let Z = (() => {
      let Y = void 0;
      return new K61(A, (X, ...I) => {
        if (Y !== H_) {
          if (H_ === null) return;
          else if (H_ === void 0) H_ = m40();
          Y = H_
        }
        H_ === null || H_ === void 0 || H_.log(A, X, ...I)
      })
    })();
    return d40.set(A, Z), Z.func
  }
})
// @from(Ln 220585, Col 4)
wfB = U((F2A) => {
  var tP8 = F2A && F2A.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    eP8 = F2A && F2A.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) tP8(Q, A, B)
    };
  Object.defineProperty(F2A, "__esModule", {
    value: !0
  });
  eP8(NfB(), F2A)
})
// @from(Ln 220609, Col 4)
JTA = U((A6) => {
  var AS8 = A6 && A6.__createBinding || (Object.create ? function (A, Q, B, G) {
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
    QS8 = A6 && A6.__exportStar || function (A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) AS8(Q, A, B)
    };
  Object.defineProperty(A6, "__esModule", {
    value: !0
  });
  A6.gcpResidencyCache = A6.METADATA_SERVER_DETECTION = A6.HEADERS = A6.HEADER_VALUE = A6.HEADER_NAME = A6.SECONDARY_HOST_ADDRESS = A6.HOST_ADDRESS = A6.BASE_PATH = void 0;
  A6.instance = XS8;
  A6.project = IS8;
  A6.universe = DS8;
  A6.bulk = WS8;
  A6.isAvailable = VS8;
  A6.resetIsAvailableCache = FS8;
  A6.getGCPResidency = i40;
  A6.setGCPResidency = OfB;
  A6.requestTimeout = MfB;
  var p40 = cP(),
    BS8 = YfB(),
    GS8 = u40(),
    ZS8 = wfB();
  A6.BASE_PATH = "/computeMetadata/v1";
  A6.HOST_ADDRESS = "http://169.254.169.254";
  A6.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
  A6.HEADER_NAME = "Metadata-Flavor";
  A6.HEADER_VALUE = "Google";
  A6.HEADERS = Object.freeze({
    [A6.HEADER_NAME]: A6.HEADER_VALUE
  });
  var LfB = ZS8.log("gcp metadata");
  A6.METADATA_SERVER_DETECTION = Object.freeze({
    "assume-present": "don't try to ping the metadata server, but assume it's present",
    none: "don't try to ping the metadata server, but don't try to use it either",
    "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
    "ping-only": "skip the BIOS probe, and go straight to pinging"
  });

  function l40(A) {
    if (!A) A = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || A6.HOST_ADDRESS;
    if (!/^https?:\/\//.test(A)) A = `http://${A}`;
    return new URL(A6.BASE_PATH, A).href
  }

  function YS8(A) {
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
  async function YTA(A, Q = {}, B = 3, G = !1) {
    let Z = "",
      Y = {},
      J = {};
    if (typeof A === "object") {
      let W = A;
      Z = W.metadataKey, Y = W.params || Y, J = W.headers || J, B = W.noResponseRetries || B, G = W.fastFail || G
    } else Z = A;
    if (typeof Q === "string") Z += `/${Q}`;
    else {
      if (YS8(Q), Q.property) Z += `/${Q.property}`;
      J = Q.headers || J, Y = Q.params || Y
    }
    let X = G ? JS8 : p40.request,
      I = {
        url: `${l40()}/${Z}`,
        headers: {
          ...A6.HEADERS,
          ...J
        },
        retryConfig: {
          noResponseRetries: B
        },
        params: Y,
        responseType: "text",
        timeout: MfB()
      };
    LfB.info("instance request %j", I);
    let D = await X(I);
    if (LfB.info("instance metadata is %s", D.data), D.headers[A6.HEADER_NAME.toLowerCase()] !== A6.HEADER_VALUE) throw Error(`Invalid response from metadata service: incorrect ${A6.HEADER_NAME} header. Expected '${A6.HEADER_VALUE}', got ${D.headers[A6.HEADER_NAME.toLowerCase()]?`'${D.headers[A6.HEADER_NAME.toLowerCase()]}'`:"no header"}`);
    if (typeof D.data === "string") try {
      return BS8.parse(D.data)
    } catch (W) {}
    return D.data
  }
  async function JS8(A) {
    var Q;
    let B = {
        ...A,
        url: (Q = A.url) === null || Q === void 0 ? void 0 : Q.toString().replace(l40(), l40(A6.SECONDARY_HOST_ADDRESS))
      },
      G = !1,
      Z = (0, p40.request)(A).then((J) => {
        return G = !0, J
      }).catch((J) => {
        if (G) return Y;
        else throw G = !0, J
      }),
      Y = (0, p40.request)(B).then((J) => {
        return G = !0, J
      }).catch((J) => {
        if (G) return Z;
        else throw G = !0, J
      });
    return Promise.race([Z, Y])
  }

  function XS8(A) {
    return YTA("instance", A)
  }

  function IS8(A) {
    return YTA("project", A)
  }

  function DS8(A) {
    return YTA("universe", A)
  }
  async function WS8(A) {
    let Q = {};
    return await Promise.all(A.map((B) => {
      return (async () => {
        let G = await YTA(B),
          Z = B.metadataKey;
        Q[Z] = G
      })()
    })), Q
  }

  function KS8() {
    return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0
  }
  var V61;
  async function VS8() {
    if (process.env.METADATA_SERVER_DETECTION) {
      let A = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
      if (!(A in A6.METADATA_SERVER_DETECTION)) throw RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${A}\`, but it should be \`${Object.keys(A6.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
      switch (A) {
        case "assume-present":
          return !0;
        case "none":
          return !1;
        case "bios-only":
          return i40();
        case "ping-only":
      }
    }
    try {
      if (V61 === void 0) V61 = YTA("instance", void 0, KS8(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
      return await V61, !0
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

  function FS8() {
    V61 = void 0
  }
  A6.gcpResidencyCache = null;

  function i40() {
    if (A6.gcpResidencyCache === null) OfB();
    return A6.gcpResidencyCache
  }

  function OfB(A = null) {
    A6.gcpResidencyCache = A !== null ? A : (0, GS8.detectGCPResidency)()
  }

  function MfB() {
    return i40() ? 0 : 3000
  }
  QS8(u40(), A6)
})
// @from(Ln 220816, Col 4)
o40 = U((NS8) => {
  NS8.byteLength = ES8;
  NS8.toByteArray = $S8;
  NS8.fromByteArray = qS8;
  var uk = [],
    E_ = [],
    HS8 = typeof Uint8Array < "u" ? Uint8Array : Array,
    n40 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (Do = 0, a40 = n40.length; Do < a40; ++Do) uk[Do] = n40[Do], E_[n40.charCodeAt(Do)] = Do;
  var Do, a40;
  E_[45] = 62;
  E_[95] = 63;

  function RfB(A) {
    var Q = A.length;
    if (Q % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
    var B = A.indexOf("=");
    if (B === -1) B = Q;
    var G = B === Q ? 0 : 4 - B % 4;
    return [B, G]
  }

  function ES8(A) {
    var Q = RfB(A),
      B = Q[0],
      G = Q[1];
    return (B + G) * 3 / 4 - G
  }

  function zS8(A, Q, B) {
    return (Q + B) * 3 / 4 - B
  }

  function $S8(A) {
    var Q, B = RfB(A),
      G = B[0],
      Z = B[1],
      Y = new HS8(zS8(A, G, Z)),
      J = 0,
      X = Z > 0 ? G - 4 : G,
      I;
    for (I = 0; I < X; I += 4) Q = E_[A.charCodeAt(I)] << 18 | E_[A.charCodeAt(I + 1)] << 12 | E_[A.charCodeAt(I + 2)] << 6 | E_[A.charCodeAt(I + 3)], Y[J++] = Q >> 16 & 255, Y[J++] = Q >> 8 & 255, Y[J++] = Q & 255;
    if (Z === 2) Q = E_[A.charCodeAt(I)] << 2 | E_[A.charCodeAt(I + 1)] >> 4, Y[J++] = Q & 255;
    if (Z === 1) Q = E_[A.charCodeAt(I)] << 10 | E_[A.charCodeAt(I + 1)] << 4 | E_[A.charCodeAt(I + 2)] >> 2, Y[J++] = Q >> 8 & 255, Y[J++] = Q & 255;
    return Y
  }

  function CS8(A) {
    return uk[A >> 18 & 63] + uk[A >> 12 & 63] + uk[A >> 6 & 63] + uk[A & 63]
  }

  function US8(A, Q, B) {
    var G, Z = [];
    for (var Y = Q; Y < B; Y += 3) G = (A[Y] << 16 & 16711680) + (A[Y + 1] << 8 & 65280) + (A[Y + 2] & 255), Z.push(CS8(G));
    return Z.join("")
  }

  function qS8(A) {
    var Q, B = A.length,
      G = B % 3,
      Z = [],
      Y = 16383;
    for (var J = 0, X = B - G; J < X; J += Y) Z.push(US8(A, J, J + Y > X ? X : J + Y));
    if (G === 1) Q = A[B - 1], Z.push(uk[Q >> 2] + uk[Q << 4 & 63] + "==");
    else if (G === 2) Q = (A[B - 2] << 8) + A[B - 1], Z.push(uk[Q >> 10] + uk[Q >> 4 & 63] + uk[Q << 2 & 63] + "=");
    return Z.join("")
  }
})
// @from(Ln 220884, Col 4)
TfB = U((_fB) => {
  Object.defineProperty(_fB, "__esModule", {
    value: !0
  });
  _fB.BrowserCrypto = void 0;
  var pDA = o40(),
    MS8 = lDA();
  class F61 {
    constructor() {
      if (typeof window > "u" || window.crypto === void 0 || window.crypto.subtle === void 0) throw Error("SubtleCrypto not found. Make sure it's an https:// website.")
    }
    async sha256DigestBase64(A) {
      let Q = new TextEncoder().encode(A),
        B = await window.crypto.subtle.digest("SHA-256", Q);
      return pDA.fromByteArray(new Uint8Array(B))
    }
    randomBytesBase64(A) {
      let Q = new Uint8Array(A);
      return window.crypto.getRandomValues(Q), pDA.fromByteArray(Q)
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
        Y = pDA.toByteArray(F61.padBase64(B)),
        J = await window.crypto.subtle.importKey("jwk", A, G, !0, ["verify"]);
      return await window.crypto.subtle.verify(G, J, Y, Z)
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
        Y = await window.crypto.subtle.sign(B, Z, G);
      return pDA.fromByteArray(new Uint8Array(Y))
    }
    decodeBase64StringUtf8(A) {
      let Q = pDA.toByteArray(F61.padBase64(A));
      return new TextDecoder().decode(Q)
    }
    encodeBase64StringUtf8(A) {
      let Q = new TextEncoder().encode(A);
      return pDA.fromByteArray(Q)
    }
    async sha256DigestHex(A) {
      let Q = new TextEncoder().encode(A),
        B = await window.crypto.subtle.digest("SHA-256", Q);
      return (0, MS8.fromArrayBufferToHex)(B)
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
  _fB.BrowserCrypto = F61
})
// @from(Ln 220959, Col 4)
yfB = U((SfB) => {
  Object.defineProperty(SfB, "__esModule", {
    value: !0
  });
  SfB.NodeCrypto = void 0;
  var iDA = NA("crypto");
  class PfB {
    async sha256DigestBase64(A) {
      return iDA.createHash("sha256").update(A).digest("base64")
    }
    randomBytesBase64(A) {
      return iDA.randomBytes(A).toString("base64")
    }
    async verify(A, Q, B) {
      let G = iDA.createVerify("RSA-SHA256");
      return G.update(Q), G.end(), G.verify(A, B, "base64")
    }
    async sign(A, Q) {
      let B = iDA.createSign("RSA-SHA256");
      return B.update(Q), B.end(), B.sign(A, "base64")
    }
    decodeBase64StringUtf8(A) {
      return Buffer.from(A, "base64").toString("utf-8")
    }
    encodeBase64StringUtf8(A) {
      return Buffer.from(A, "utf-8").toString("base64")
    }
    async sha256DigestHex(A) {
      return iDA.createHash("sha256").update(A).digest("hex")
    }
    async signWithHmacSha256(A, Q) {
      let B = typeof A === "string" ? A : _S8(A);
      return RS8(iDA.createHmac("sha256", B).update(Q).digest())
    }
  }
  SfB.NodeCrypto = PfB;

  function RS8(A) {
    return A.buffer.slice(A.byteOffset, A.byteOffset + A.byteLength)
  }

  function _S8(A) {
    return Buffer.from(A)
  }
})
// @from(Ln 221004, Col 4)
lDA = U((kfB) => {
  Object.defineProperty(kfB, "__esModule", {
    value: !0
  });
  kfB.createCrypto = PS8;
  kfB.hasBrowserCrypto = vfB;
  kfB.fromArrayBufferToHex = SS8;
  var jS8 = TfB(),
    TS8 = yfB();

  function PS8() {
    if (vfB()) return new jS8.BrowserCrypto;
    return new TS8.NodeCrypto
  }

  function vfB() {
    return typeof window < "u" && typeof window.crypto < "u" && typeof window.crypto.subtle < "u"
  }

  function SS8(A) {
    return Array.from(new Uint8Array(A)).map((B) => {
      return B.toString(16).padStart(2, "0")
    }).join("")
  }
})
// @from(Ln 221029, Col 4)
ffB = U((bfB) => {
  Object.defineProperty(bfB, "__esModule", {
    value: !0
  });
  bfB.validate = kS8;

  function kS8(A) {
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