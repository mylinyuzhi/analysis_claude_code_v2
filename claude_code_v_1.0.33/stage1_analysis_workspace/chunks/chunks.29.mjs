
// @from(Start 2650924, End 2651185)
M8Q = z((N8Q) => {
  Object.defineProperty(N8Q, "__esModule", {
    value: !0
  });
  N8Q.default = void 0;
  var FT4 = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
  N8Q.default = FT4
})
// @from(Start 2651191, End 2651528)
ZHA = z((O8Q) => {
  Object.defineProperty(O8Q, "__esModule", {
    value: !0
  });
  O8Q.default = void 0;
  var KT4 = DT4(M8Q());

  function DT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function HT4(A) {
    return typeof A === "string" && KT4.default.test(A)
  }
  var CT4 = HT4;
  O8Q.default = CT4
})
// @from(Start 2651534, End 2652365)
IHA = z((P8Q) => {
  Object.defineProperty(P8Q, "__esModule", {
    value: !0
  });
  P8Q.default = void 0;
  P8Q.unsafeStringify = T8Q;
  var ET4 = zT4(ZHA());

  function zT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var tK = [];
  for (let A = 0; A < 256; ++A) tK.push((A + 256).toString(16).slice(1));

  function T8Q(A, Q = 0) {
    return tK[A[Q + 0]] + tK[A[Q + 1]] + tK[A[Q + 2]] + tK[A[Q + 3]] + "-" + tK[A[Q + 4]] + tK[A[Q + 5]] + "-" + tK[A[Q + 6]] + tK[A[Q + 7]] + "-" + tK[A[Q + 8]] + tK[A[Q + 9]] + "-" + tK[A[Q + 10]] + tK[A[Q + 11]] + tK[A[Q + 12]] + tK[A[Q + 13]] + tK[A[Q + 14]] + tK[A[Q + 15]]
  }

  function UT4(A, Q = 0) {
    let B = T8Q(A, Q);
    if (!(0, ET4.default)(B)) throw TypeError("Stringified UUID is invalid");
    return B
  }
  var $T4 = UT4;
  P8Q.default = $T4
})
// @from(Start 2652371, End 2653906)
y8Q = z((_8Q) => {
  Object.defineProperty(_8Q, "__esModule", {
    value: !0
  });
  _8Q.default = void 0;
  var qT4 = LT4(Zw1()),
    NT4 = IHA();

  function LT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var S8Q, Iw1, Yw1 = 0,
    Jw1 = 0;

  function MT4(A, Q, B) {
    let G = Q && B || 0,
      Z = Q || Array(16);
    A = A || {};
    let I = A.node || S8Q,
      Y = A.clockseq !== void 0 ? A.clockseq : Iw1;
    if (I == null || Y == null) {
      let K = A.random || (A.rng || qT4.default)();
      if (I == null) I = S8Q = [K[0] | 1, K[1], K[2], K[3], K[4], K[5]];
      if (Y == null) Y = Iw1 = (K[6] << 8 | K[7]) & 16383
    }
    let J = A.msecs !== void 0 ? A.msecs : Date.now(),
      W = A.nsecs !== void 0 ? A.nsecs : Jw1 + 1,
      X = J - Yw1 + (W - Jw1) / 1e4;
    if (X < 0 && A.clockseq === void 0) Y = Y + 1 & 16383;
    if ((X < 0 || J > Yw1) && A.nsecs === void 0) W = 0;
    if (W >= 1e4) throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
    Yw1 = J, Jw1 = W, Iw1 = Y, J += 12219292800000;
    let V = ((J & 268435455) * 1e4 + W) % 4294967296;
    Z[G++] = V >>> 24 & 255, Z[G++] = V >>> 16 & 255, Z[G++] = V >>> 8 & 255, Z[G++] = V & 255;
    let F = J / 4294967296 * 1e4 & 268435455;
    Z[G++] = F >>> 8 & 255, Z[G++] = F & 255, Z[G++] = F >>> 24 & 15 | 16, Z[G++] = F >>> 16 & 255, Z[G++] = Y >>> 8 | 128, Z[G++] = Y & 255;
    for (let K = 0; K < 6; ++K) Z[G + K] = I[K];
    return Q || (0, NT4.unsafeStringify)(Z)
  }
  var OT4 = MT4;
  _8Q.default = OT4
})
// @from(Start 2653912, End 2654796)
Ww1 = z((x8Q) => {
  Object.defineProperty(x8Q, "__esModule", {
    value: !0
  });
  x8Q.default = void 0;
  var RT4 = TT4(ZHA());

  function TT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function PT4(A) {
    if (!(0, RT4.default)(A)) throw TypeError("Invalid UUID");
    let Q, B = new Uint8Array(16);
    return B[0] = (Q = parseInt(A.slice(0, 8), 16)) >>> 24, B[1] = Q >>> 16 & 255, B[2] = Q >>> 8 & 255, B[3] = Q & 255, B[4] = (Q = parseInt(A.slice(9, 13), 16)) >>> 8, B[5] = Q & 255, B[6] = (Q = parseInt(A.slice(14, 18), 16)) >>> 8, B[7] = Q & 255, B[8] = (Q = parseInt(A.slice(19, 23), 16)) >>> 8, B[9] = Q & 255, B[10] = (Q = parseInt(A.slice(24, 36), 16)) / 1099511627776 & 255, B[11] = Q / 4294967296 & 255, B[12] = Q >>> 24 & 255, B[13] = Q >>> 16 & 255, B[14] = Q >>> 8 & 255, B[15] = Q & 255, B
  }
  var jT4 = PT4;
  x8Q.default = jT4
})
// @from(Start 2654802, End 2656073)
Xw1 = z((h8Q) => {
  Object.defineProperty(h8Q, "__esModule", {
    value: !0
  });
  h8Q.URL = h8Q.DNS = void 0;
  h8Q.default = xT4;
  var ST4 = IHA(),
    _T4 = kT4(Ww1());

  function kT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function yT4(A) {
    A = unescape(encodeURIComponent(A));
    let Q = [];
    for (let B = 0; B < A.length; ++B) Q.push(A.charCodeAt(B));
    return Q
  }
  var b8Q = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  h8Q.DNS = b8Q;
  var f8Q = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
  h8Q.URL = f8Q;

  function xT4(A, Q, B) {
    function G(Z, I, Y, J) {
      var W;
      if (typeof Z === "string") Z = yT4(Z);
      if (typeof I === "string") I = (0, _T4.default)(I);
      if (((W = I) === null || W === void 0 ? void 0 : W.length) !== 16) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
      let X = new Uint8Array(16 + Z.length);
      if (X.set(I), X.set(Z, I.length), X = B(X), X[6] = X[6] & 15 | Q, X[8] = X[8] & 63 | 128, Y) {
        J = J || 0;
        for (let V = 0; V < 16; ++V) Y[J + V] = X[V];
        return Y
      }
      return (0, ST4.unsafeStringify)(X)
    }
    try {
      G.name = A
    } catch (Z) {}
    return G.DNS = b8Q, G.URL = f8Q, G
  }
})
// @from(Start 2656079, End 2656537)
d8Q = z((u8Q) => {
  Object.defineProperty(u8Q, "__esModule", {
    value: !0
  });
  u8Q.default = void 0;
  var fT4 = hT4(UA("crypto"));

  function hT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function gT4(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return fT4.default.createHash("md5").update(A).digest()
  }
  var uT4 = gT4;
  u8Q.default = uT4
})
// @from(Start 2656543, End 2656872)
i8Q = z((p8Q) => {
  Object.defineProperty(p8Q, "__esModule", {
    value: !0
  });
  p8Q.default = void 0;
  var mT4 = c8Q(Xw1()),
    dT4 = c8Q(d8Q());

  function c8Q(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var cT4 = (0, mT4.default)("v3", 48, dT4.default),
    pT4 = cT4;
  p8Q.default = pT4
})
// @from(Start 2656878, End 2657182)
s8Q = z((n8Q) => {
  Object.defineProperty(n8Q, "__esModule", {
    value: !0
  });
  n8Q.default = void 0;
  var lT4 = iT4(UA("crypto"));

  function iT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var nT4 = {
    randomUUID: lT4.default.randomUUID
  };
  n8Q.default = nT4
})
// @from(Start 2657188, End 2657848)
A6Q = z((t8Q) => {
  Object.defineProperty(t8Q, "__esModule", {
    value: !0
  });
  t8Q.default = void 0;
  var r8Q = o8Q(s8Q()),
    aT4 = o8Q(Zw1()),
    sT4 = IHA();

  function o8Q(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function rT4(A, Q, B) {
    if (r8Q.default.randomUUID && !Q && !A) return r8Q.default.randomUUID();
    A = A || {};
    let G = A.random || (A.rng || aT4.default)();
    if (G[6] = G[6] & 15 | 64, G[8] = G[8] & 63 | 128, Q) {
      B = B || 0;
      for (let Z = 0; Z < 16; ++Z) Q[B + Z] = G[Z];
      return Q
    }
    return (0, sT4.unsafeStringify)(G)
  }
  var oT4 = rT4;
  t8Q.default = oT4
})
// @from(Start 2657854, End 2658313)
G6Q = z((Q6Q) => {
  Object.defineProperty(Q6Q, "__esModule", {
    value: !0
  });
  Q6Q.default = void 0;
  var tT4 = eT4(UA("crypto"));

  function eT4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function AP4(A) {
    if (Array.isArray(A)) A = Buffer.from(A);
    else if (typeof A === "string") A = Buffer.from(A, "utf8");
    return tT4.default.createHash("sha1").update(A).digest()
  }
  var QP4 = AP4;
  Q6Q.default = QP4
})
// @from(Start 2658319, End 2658648)
J6Q = z((I6Q) => {
  Object.defineProperty(I6Q, "__esModule", {
    value: !0
  });
  I6Q.default = void 0;
  var BP4 = Z6Q(Xw1()),
    GP4 = Z6Q(G6Q());

  function Z6Q(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
  var ZP4 = (0, BP4.default)("v5", 80, GP4.default),
    IP4 = ZP4;
  I6Q.default = IP4
})
// @from(Start 2658654, End 2658836)
V6Q = z((W6Q) => {
  Object.defineProperty(W6Q, "__esModule", {
    value: !0
  });
  W6Q.default = void 0;
  var YP4 = "00000000-0000-0000-0000-000000000000";
  W6Q.default = YP4
})
// @from(Start 2658842, End 2659227)
D6Q = z((F6Q) => {
  Object.defineProperty(F6Q, "__esModule", {
    value: !0
  });
  F6Q.default = void 0;
  var JP4 = WP4(ZHA());

  function WP4(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }

  function XP4(A) {
    if (!(0, JP4.default)(A)) throw TypeError("Invalid UUID");
    return parseInt(A.slice(14, 15), 16)
  }
  var VP4 = XP4;
  F6Q.default = VP4
})
// @from(Start 2659233, End 2660649)
YHA = z((dR) => {
  Object.defineProperty(dR, "__esModule", {
    value: !0
  });
  Object.defineProperty(dR, "NIL", {
    enumerable: !0,
    get: function() {
      return CP4.default
    }
  });
  Object.defineProperty(dR, "parse", {
    enumerable: !0,
    get: function() {
      return $P4.default
    }
  });
  Object.defineProperty(dR, "stringify", {
    enumerable: !0,
    get: function() {
      return UP4.default
    }
  });
  Object.defineProperty(dR, "v1", {
    enumerable: !0,
    get: function() {
      return FP4.default
    }
  });
  Object.defineProperty(dR, "v3", {
    enumerable: !0,
    get: function() {
      return KP4.default
    }
  });
  Object.defineProperty(dR, "v4", {
    enumerable: !0,
    get: function() {
      return DP4.default
    }
  });
  Object.defineProperty(dR, "v5", {
    enumerable: !0,
    get: function() {
      return HP4.default
    }
  });
  Object.defineProperty(dR, "validate", {
    enumerable: !0,
    get: function() {
      return zP4.default
    }
  });
  Object.defineProperty(dR, "version", {
    enumerable: !0,
    get: function() {
      return EP4.default
    }
  });
  var FP4 = Mv(y8Q()),
    KP4 = Mv(i8Q()),
    DP4 = Mv(A6Q()),
    HP4 = Mv(J6Q()),
    CP4 = Mv(V6Q()),
    EP4 = Mv(D6Q()),
    zP4 = Mv(ZHA()),
    UP4 = Mv(IHA()),
    $P4 = Mv(Ww1());

  function Mv(A) {
    return A && A.__esModule ? A : {
      default: A
    }
  }
})
// @from(Start 2660655, End 2663562)
Fw1 = z((Lz7, z6Q) => {
  var {
    defineProperty: phA,
    getOwnPropertyDescriptor: wP4,
    getOwnPropertyNames: qP4
  } = Object, NP4 = Object.prototype.hasOwnProperty, mr = (A, Q) => phA(A, "name", {
    value: Q,
    configurable: !0
  }), LP4 = (A, Q) => {
    for (var B in Q) phA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, MP4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of qP4(Q))
        if (!NP4.call(A, Z) && Z !== B) phA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = wP4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, OP4 = (A) => MP4(phA({}, "__esModule", {
    value: !0
  }), A), H6Q = {};
  LP4(H6Q, {
    isBrowserNetworkError: () => E6Q,
    isClockSkewCorrectedError: () => C6Q,
    isClockSkewError: () => yP4,
    isRetryableByTrait: () => kP4,
    isServerError: () => vP4,
    isThrottlingError: () => xP4,
    isTransientError: () => Vw1
  });
  z6Q.exports = OP4(H6Q);
  var RP4 = ["AuthFailure", "InvalidSignatureException", "RequestExpired", "RequestInTheFuture", "RequestTimeTooSkewed", "SignatureDoesNotMatch"],
    TP4 = ["BandwidthLimitExceeded", "EC2ThrottledException", "LimitExceededException", "PriorRequestNotComplete", "ProvisionedThroughputExceededException", "RequestLimitExceeded", "RequestThrottled", "RequestThrottledException", "SlowDown", "ThrottledException", "Throttling", "ThrottlingException", "TooManyRequestsException", "TransactionInProgressException"],
    PP4 = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"],
    jP4 = [500, 502, 503, 504],
    SP4 = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"],
    _P4 = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"],
    kP4 = mr((A) => A.$retryable !== void 0, "isRetryableByTrait"),
    yP4 = mr((A) => RP4.includes(A.name), "isClockSkewError"),
    C6Q = mr((A) => A.$metadata?.clockSkewCorrected, "isClockSkewCorrectedError"),
    E6Q = mr((A) => {
      let Q = new Set(["Failed to fetch", "NetworkError when attempting to fetch resource", "The Internet connection appears to be offline", "Load failed", "Network request failed"]);
      if (!(A && A instanceof TypeError)) return !1;
      return Q.has(A.message)
    }, "isBrowserNetworkError"),
    xP4 = mr((A) => A.$metadata?.httpStatusCode === 429 || TP4.includes(A.name) || A.$retryable?.throttling == !0, "isThrottlingError"),
    Vw1 = mr((A, Q = 0) => C6Q(A) || PP4.includes(A.name) || SP4.includes(A?.code || "") || _P4.includes(A?.code || "") || jP4.includes(A.$metadata?.httpStatusCode || 0) || E6Q(A) || A.cause !== void 0 && Q <= 10 && Vw1(A.cause, Q + 1), "isTransientError"),
    vP4 = mr((A) => {
      if (A.$metadata?.httpStatusCode !== void 0) {
        let Q = A.$metadata.httpStatusCode;
        if (500 <= Q && Q <= 599 && !Vw1(A)) return !0;
        return !1
      }
      return !1
    }, "isServerError")
})
// @from(Start 2663568, End 2672461)
KW = z((Mz7, R6Q) => {
  var {
    defineProperty: lhA,
    getOwnPropertyDescriptor: bP4,
    getOwnPropertyNames: fP4
  } = Object, hP4 = Object.prototype.hasOwnProperty, cR = (A, Q) => lhA(A, "name", {
    value: Q,
    configurable: !0
  }), gP4 = (A, Q) => {
    for (var B in Q) lhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uP4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of fP4(Q))
        if (!hP4.call(A, Z) && Z !== B) lhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = bP4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mP4 = (A) => uP4(lhA({}, "__esModule", {
    value: !0
  }), A), $6Q = {};
  gP4($6Q, {
    AdaptiveRetryStrategy: () => nP4,
    ConfiguredRetryStrategy: () => aP4,
    DEFAULT_MAX_ATTEMPTS: () => Kw1,
    DEFAULT_RETRY_DELAY_BASE: () => JHA,
    DEFAULT_RETRY_MODE: () => dP4,
    DefaultRateLimiter: () => q6Q,
    INITIAL_RETRY_TOKENS: () => Dw1,
    INVOCATION_ID_HEADER: () => pP4,
    MAXIMUM_RETRY_DELAY: () => Hw1,
    NO_RETRY_INCREMENT: () => O6Q,
    REQUEST_HEADER: () => lP4,
    RETRY_COST: () => L6Q,
    RETRY_MODES: () => w6Q,
    StandardRetryStrategy: () => Cw1,
    THROTTLING_RETRY_DELAY_BASE: () => N6Q,
    TIMEOUT_RETRY_COST: () => M6Q
  });
  R6Q.exports = mP4($6Q);
  var w6Q = ((A) => {
      return A.STANDARD = "standard", A.ADAPTIVE = "adaptive", A
    })(w6Q || {}),
    Kw1 = 3,
    dP4 = "standard",
    cP4 = Fw1(),
    q6Q = class A {
      constructor(Q) {
        this.currentCapacity = 0, this.enabled = !1, this.lastMaxRate = 0, this.measuredTxRate = 0, this.requestCount = 0, this.lastTimestamp = 0, this.timeWindow = 0, this.beta = Q?.beta ?? 0.7, this.minCapacity = Q?.minCapacity ?? 1, this.minFillRate = Q?.minFillRate ?? 0.5, this.scaleConstant = Q?.scaleConstant ?? 0.4, this.smooth = Q?.smooth ?? 0.8;
        let B = this.getCurrentTimeInSeconds();
        this.lastThrottleTime = B, this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity
      }
      static {
        cR(this, "DefaultRateLimiter")
      }
      static {
        this.setTimeoutFn = setTimeout
      }
      getCurrentTimeInSeconds() {
        return Date.now() / 1000
      }
      async getSendToken() {
        return this.acquireTokenBucket(1)
      }
      async acquireTokenBucket(Q) {
        if (!this.enabled) return;
        if (this.refillTokenBucket(), Q > this.currentCapacity) {
          let B = (Q - this.currentCapacity) / this.fillRate * 1000;
          await new Promise((G) => A.setTimeoutFn(G, B))
        }
        this.currentCapacity = this.currentCapacity - Q
      }
      refillTokenBucket() {
        let Q = this.getCurrentTimeInSeconds();
        if (!this.lastTimestamp) {
          this.lastTimestamp = Q;
          return
        }
        let B = (Q - this.lastTimestamp) * this.fillRate;
        this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + B), this.lastTimestamp = Q
      }
      updateClientSendingRate(Q) {
        let B;
        if (this.updateMeasuredRate(), (0, cP4.isThrottlingError)(Q)) {
          let Z = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
          this.lastMaxRate = Z, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), B = this.cubicThrottle(Z), this.enableTokenBucket()
        } else this.calculateTimeWindow(), B = this.cubicSuccess(this.getCurrentTimeInSeconds());
        let G = Math.min(B, 2 * this.measuredTxRate);
        this.updateTokenBucketRate(G)
      }
      calculateTimeWindow() {
        this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 0.3333333333333333))
      }
      cubicThrottle(Q) {
        return this.getPrecise(Q * this.beta)
      }
      cubicSuccess(Q) {
        return this.getPrecise(this.scaleConstant * Math.pow(Q - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate)
      }
      enableTokenBucket() {
        this.enabled = !0
      }
      updateTokenBucketRate(Q) {
        this.refillTokenBucket(), this.fillRate = Math.max(Q, this.minFillRate), this.maxCapacity = Math.max(Q, this.minCapacity), this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity)
      }
      updateMeasuredRate() {
        let Q = this.getCurrentTimeInSeconds(),
          B = Math.floor(Q * 2) / 2;
        if (this.requestCount++, B > this.lastTxRateBucket) {
          let G = this.requestCount / (B - this.lastTxRateBucket);
          this.measuredTxRate = this.getPrecise(G * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = B
        }
      }
      getPrecise(Q) {
        return parseFloat(Q.toFixed(8))
      }
    },
    JHA = 100,
    Hw1 = 20000,
    N6Q = 500,
    Dw1 = 500,
    L6Q = 5,
    M6Q = 10,
    O6Q = 1,
    pP4 = "amz-sdk-invocation-id",
    lP4 = "amz-sdk-request",
    iP4 = cR(() => {
      let A = JHA;
      return {
        computeNextBackoffDelay: cR((G) => {
          return Math.floor(Math.min(Hw1, Math.random() * 2 ** G * A))
        }, "computeNextBackoffDelay"),
        setDelayBase: cR((G) => {
          A = G
        }, "setDelayBase")
      }
    }, "getDefaultRetryBackoffStrategy"),
    U6Q = cR(({
      retryDelay: A,
      retryCount: Q,
      retryCost: B
    }) => {
      return {
        getRetryCount: cR(() => Q, "getRetryCount"),
        getRetryDelay: cR(() => Math.min(Hw1, A), "getRetryDelay"),
        getRetryCost: cR(() => B, "getRetryCost")
      }
    }, "createDefaultRetryToken"),
    Cw1 = class {
      constructor(A) {
        this.maxAttempts = A, this.mode = "standard", this.capacity = Dw1, this.retryBackoffStrategy = iP4(), this.maxAttemptsProvider = typeof A === "function" ? A : async () => A
      }
      static {
        cR(this, "StandardRetryStrategy")
      }
      async acquireInitialRetryToken(A) {
        return U6Q({
          retryDelay: JHA,
          retryCount: 0
        })
      }
      async refreshRetryTokenForRetry(A, Q) {
        let B = await this.getMaxAttempts();
        if (this.shouldRetry(A, Q, B)) {
          let G = Q.errorType;
          this.retryBackoffStrategy.setDelayBase(G === "THROTTLING" ? N6Q : JHA);
          let Z = this.retryBackoffStrategy.computeNextBackoffDelay(A.getRetryCount()),
            I = Q.retryAfterHint ? Math.max(Q.retryAfterHint.getTime() - Date.now() || 0, Z) : Z,
            Y = this.getCapacityCost(G);
          return this.capacity -= Y, U6Q({
            retryDelay: I,
            retryCount: A.getRetryCount() + 1,
            retryCost: Y
          })
        }
        throw Error("No retry token available")
      }
      recordSuccess(A) {
        this.capacity = Math.max(Dw1, this.capacity + (A.getRetryCost() ?? O6Q))
      }
      getCapacity() {
        return this.capacity
      }
      async getMaxAttempts() {
        try {
          return await this.maxAttemptsProvider()
        } catch (A) {
          return console.warn(`Max attempts provider could not resolve. Using default of ${Kw1}`), Kw1
        }
      }
      shouldRetry(A, Q, B) {
        return A.getRetryCount() + 1 < B && this.capacity >= this.getCapacityCost(Q.errorType) && this.isRetryableError(Q.errorType)
      }
      getCapacityCost(A) {
        return A === "TRANSIENT" ? M6Q : L6Q
      }
      isRetryableError(A) {
        return A === "THROTTLING" || A === "TRANSIENT"
      }
    },
    nP4 = class {
      constructor(A, Q) {
        this.maxAttemptsProvider = A, this.mode = "adaptive";
        let {
          rateLimiter: B
        } = Q ?? {};
        this.rateLimiter = B ?? new q6Q, this.standardRetryStrategy = new Cw1(A)
      }
      static {
        cR(this, "AdaptiveRetryStrategy")
      }
      async acquireInitialRetryToken(A) {
        return await this.rateLimiter.getSendToken(), this.standardRetryStrategy.acquireInitialRetryToken(A)
      }
      async refreshRetryTokenForRetry(A, Q) {
        return this.rateLimiter.updateClientSendingRate(Q), this.standardRetryStrategy.refreshRetryTokenForRetry(A, Q)
      }
      recordSuccess(A) {
        this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(A)
      }
    },
    aP4 = class extends Cw1 {
      static {
        cR(this, "ConfiguredRetryStrategy")
      }
      constructor(A, Q = JHA) {
        super(typeof A === "function" ? A : async () => A);
        if (typeof Q === "number") this.computeNextBackoffDelay = () => Q;
        else this.computeNextBackoffDelay = Q
      }
      async refreshRetryTokenForRetry(A, Q) {
        let B = await super.refreshRetryTokenForRetry(A, Q);
        return B.getRetryDelay = () => this.computeNextBackoffDelay(B.getRetryCount()), B
      }
    }
})
// @from(Start 2672467, End 2686492)
v6Q = z((Pz7, Nw1) => {
  var {
    defineProperty: ihA,
    getOwnPropertyDescriptor: sP4,
    getOwnPropertyNames: rP4
  } = Object, oP4 = Object.prototype.hasOwnProperty, T3 = (A, Q) => ihA(A, "name", {
    value: Q,
    configurable: !0
  }), tP4 = (A, Q) => {
    for (var B in Q) ihA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, zw1 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of rP4(Q))
        if (!oP4.call(A, Z) && Z !== B) ihA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = sP4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, eP4 = (A, Q, B) => (zw1(A, Q, "default"), B && zw1(B, Q, "default")), Aj4 = (A) => zw1(ihA({}, "__esModule", {
    value: !0
  }), A), ww1 = {};
  tP4(ww1, {
    Client: () => Qj4,
    Command: () => j6Q,
    NoOpLogger: () => Uj4,
    SENSITIVE_STRING: () => Gj4,
    ServiceException: () => Ij4,
    _json: () => $w1,
    collectBody: () => Ew1.collectBody,
    convertMap: () => $j4,
    createAggregatedClient: () => Zj4,
    decorateServiceException: () => S6Q,
    emitWarningIfUnsupportedVersion: () => Xj4,
    extendedEncodeURIComponent: () => Ew1.extendedEncodeURIComponent,
    getArrayIfSingleItem: () => Ej4,
    getDefaultClientConfiguration: () => Hj4,
    getDefaultExtensionConfiguration: () => k6Q,
    getValueFromTextNode: () => y6Q,
    isSerializableHeaderValue: () => zj4,
    loadConfigsForDefaultMode: () => Wj4,
    map: () => qw1,
    resolveDefaultRuntimeConfig: () => Cj4,
    resolvedPath: () => Ew1.resolvedPath,
    serializeDateTime: () => Oj4,
    serializeFloat: () => Mj4,
    take: () => wj4,
    throwDefaultError: () => _6Q,
    withBaseException: () => Yj4
  });
  Nw1.exports = Aj4(ww1);
  var P6Q = uR(),
    Qj4 = class {
      constructor(A) {
        this.config = A, this.middlewareStack = (0, P6Q.constructStack)()
      }
      static {
        T3(this, "Client")
      }
      send(A, Q, B) {
        let G = typeof Q !== "function" ? Q : void 0,
          Z = typeof Q === "function" ? Q : B,
          I = G === void 0 && this.config.cacheMiddleware === !0,
          Y;
        if (I) {
          if (!this.handlers) this.handlers = new WeakMap;
          let J = this.handlers;
          if (J.has(A.constructor)) Y = J.get(A.constructor);
          else Y = A.resolveMiddleware(this.middlewareStack, this.config, G), J.set(A.constructor, Y)
        } else delete this.handlers, Y = A.resolveMiddleware(this.middlewareStack, this.config, G);
        if (Z) Y(A).then((J) => Z(null, J.output), (J) => Z(J)).catch(() => {});
        else return Y(A).then((J) => J.output)
      }
      destroy() {
        this.config?.requestHandler?.destroy?.(), delete this.handlers
      }
    },
    Ew1 = w5(),
    Uw1 = Gw1(),
    j6Q = class {
      constructor() {
        this.middlewareStack = (0, P6Q.constructStack)()
      }
      static {
        T3(this, "Command")
      }
      static classBuilder() {
        return new Bj4
      }
      resolveMiddlewareWithContext(A, Q, B, {
        middlewareFn: G,
        clientName: Z,
        commandName: I,
        inputFilterSensitiveLog: Y,
        outputFilterSensitiveLog: J,
        smithyContext: W,
        additionalContext: X,
        CommandCtor: V
      }) {
        for (let C of G.bind(this)(V, A, Q, B)) this.middlewareStack.use(C);
        let F = A.concat(this.middlewareStack),
          {
            logger: K
          } = Q,
          D = {
            logger: K,
            clientName: Z,
            commandName: I,
            inputFilterSensitiveLog: Y,
            outputFilterSensitiveLog: J,
            [Uw1.SMITHY_CONTEXT_KEY]: {
              commandInstance: this,
              ...W
            },
            ...X
          },
          {
            requestHandler: H
          } = Q;
        return F.resolve((C) => H.handle(C.request, B || {}), D)
      }
    },
    Bj4 = class {
      constructor() {
        this._init = () => {}, this._ep = {}, this._middlewareFn = () => [], this._commandName = "", this._clientName = "", this._additionalContext = {}, this._smithyContext = {}, this._inputFilterSensitiveLog = (A) => A, this._outputFilterSensitiveLog = (A) => A, this._serializer = null, this._deserializer = null
      }
      static {
        T3(this, "ClassBuilder")
      }
      init(A) {
        this._init = A
      }
      ep(A) {
        return this._ep = A, this
      }
      m(A) {
        return this._middlewareFn = A, this
      }
      s(A, Q, B = {}) {
        return this._smithyContext = {
          service: A,
          operation: Q,
          ...B
        }, this
      }
      c(A = {}) {
        return this._additionalContext = A, this
      }
      n(A, Q) {
        return this._clientName = A, this._commandName = Q, this
      }
      f(A = (B) => B, Q = (B) => B) {
        return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = Q, this
      }
      ser(A) {
        return this._serializer = A, this
      }
      de(A) {
        return this._deserializer = A, this
      }
      sc(A) {
        return this._operationSchema = A, this._smithyContext.operationSchema = A, this
      }
      build() {
        let A = this,
          Q;
        return Q = class extends j6Q {
          constructor(...[B]) {
            super();
            this.serialize = A._serializer, this.deserialize = A._deserializer, this.input = B ?? {}, A._init(this), this.schema = A._operationSchema
          }
          static {
            T3(this, "CommandRef")
          }
          static getEndpointParameterInstructions() {
            return A._ep
          }
          resolveMiddleware(B, G, Z) {
            return this.resolveMiddlewareWithContext(B, G, Z, {
              CommandCtor: Q,
              middlewareFn: A._middlewareFn,
              clientName: A._clientName,
              commandName: A._commandName,
              inputFilterSensitiveLog: A._inputFilterSensitiveLog,
              outputFilterSensitiveLog: A._outputFilterSensitiveLog,
              smithyContext: A._smithyContext,
              additionalContext: A._additionalContext
            })
          }
        }
      }
    },
    Gj4 = "***SensitiveInformation***",
    Zj4 = T3((A, Q) => {
      for (let B of Object.keys(A)) {
        let G = A[B],
          Z = T3(async function(Y, J, W) {
            let X = new G(Y);
            if (typeof J === "function") this.send(X, J);
            else if (typeof W === "function") {
              if (typeof J !== "object") throw Error(`Expected http options but got ${typeof J}`);
              this.send(X, J || {}, W)
            } else return this.send(X, J)
          }, "methodImpl"),
          I = (B[0].toLowerCase() + B.slice(1)).replace(/Command$/, "");
        Q.prototype[I] = Z
      }
    }, "createAggregatedClient"),
    Ij4 = class A extends Error {
      static {
        T3(this, "ServiceException")
      }
      constructor(Q) {
        super(Q.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = Q.name, this.$fault = Q.$fault, this.$metadata = Q.$metadata
      }
      static isInstance(Q) {
        if (!Q) return !1;
        let B = Q;
        return A.prototype.isPrototypeOf(B) || Boolean(B.$fault) && Boolean(B.$metadata) && (B.$fault === "client" || B.$fault === "server")
      }
      static[Symbol.hasInstance](Q) {
        if (!Q) return !1;
        let B = Q;
        if (this === A) return A.isInstance(Q);
        if (A.isInstance(Q)) {
          if (B.name && this.name) return this.prototype.isPrototypeOf(Q) || B.name === this.name;
          return this.prototype.isPrototypeOf(Q)
        }
        return !1
      }
    },
    S6Q = T3((A, Q = {}) => {
      Object.entries(Q).filter(([, G]) => G !== void 0).forEach(([G, Z]) => {
        if (A[G] == null || A[G] === "") A[G] = Z
      });
      let B = A.message || A.Message || "UnknownError";
      return A.message = B, delete A.Message, A
    }, "decorateServiceException"),
    _6Q = T3(({
      output: A,
      parsedBody: Q,
      exceptionCtor: B,
      errorCode: G
    }) => {
      let Z = Jj4(A),
        I = Z.httpStatusCode ? Z.httpStatusCode + "" : void 0,
        Y = new B({
          name: Q?.code || Q?.Code || G || I || "UnknownError",
          $fault: "client",
          $metadata: Z
        });
      throw S6Q(Y, Q)
    }, "throwDefaultError"),
    Yj4 = T3((A) => {
      return ({
        output: Q,
        parsedBody: B,
        errorCode: G
      }) => {
        _6Q({
          output: Q,
          parsedBody: B,
          exceptionCtor: A,
          errorCode: G
        })
      }
    }, "withBaseException"),
    Jj4 = T3((A) => ({
      httpStatusCode: A.statusCode,
      requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
      extendedRequestId: A.headers["x-amz-id-2"],
      cfId: A.headers["x-amz-cf-id"]
    }), "deserializeMetadata"),
    Wj4 = T3((A) => {
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
    T6Q = !1,
    Xj4 = T3((A) => {
      if (A && !T6Q && parseInt(A.substring(1, A.indexOf("."))) < 16) T6Q = !0
    }, "emitWarningIfUnsupportedVersion"),
    Vj4 = T3((A) => {
      let Q = [];
      for (let B in Uw1.AlgorithmId) {
        let G = Uw1.AlgorithmId[B];
        if (A[G] === void 0) continue;
        Q.push({
          algorithmId: () => G,
          checksumConstructor: () => A[G]
        })
      }
      return {
        addChecksumAlgorithm(B) {
          Q.push(B)
        },
        checksumAlgorithms() {
          return Q
        }
      }
    }, "getChecksumConfiguration"),
    Fj4 = T3((A) => {
      let Q = {};
      return A.checksumAlgorithms().forEach((B) => {
        Q[B.algorithmId()] = B.checksumConstructor()
      }), Q
    }, "resolveChecksumRuntimeConfig"),
    Kj4 = T3((A) => {
      return {
        setRetryStrategy(Q) {
          A.retryStrategy = Q
        },
        retryStrategy() {
          return A.retryStrategy
        }
      }
    }, "getRetryConfiguration"),
    Dj4 = T3((A) => {
      let Q = {};
      return Q.retryStrategy = A.retryStrategy(), Q
    }, "resolveRetryRuntimeConfig"),
    k6Q = T3((A) => {
      return Object.assign(Vj4(A), Kj4(A))
    }, "getDefaultExtensionConfiguration"),
    Hj4 = k6Q,
    Cj4 = T3((A) => {
      return Object.assign(Fj4(A), Dj4(A))
    }, "resolveDefaultRuntimeConfig"),
    Ej4 = T3((A) => Array.isArray(A) ? A : [A], "getArrayIfSingleItem"),
    y6Q = T3((A) => {
      for (let B in A)
        if (A.hasOwnProperty(B) && A[B]["#text"] !== void 0) A[B] = A[B]["#text"];
        else if (typeof A[B] === "object" && A[B] !== null) A[B] = y6Q(A[B]);
      return A
    }, "getValueFromTextNode"),
    zj4 = T3((A) => {
      return A != null
    }, "isSerializableHeaderValue"),
    Uj4 = class {
      static {
        T3(this, "NoOpLogger")
      }
      trace() {}
      debug() {}
      info() {}
      warn() {}
      error() {}
    };

  function qw1(A, Q, B) {
    let G, Z, I;
    if (typeof Q > "u" && typeof B > "u") G = {}, I = A;
    else if (G = A, typeof Q === "function") return Z = Q, I = B, qj4(G, Z, I);
    else I = Q;
    for (let Y of Object.keys(I)) {
      if (!Array.isArray(I[Y])) {
        G[Y] = I[Y];
        continue
      }
      x6Q(G, null, I, Y)
    }
    return G
  }
  T3(qw1, "map");
  var $j4 = T3((A) => {
      let Q = {};
      for (let [B, G] of Object.entries(A || {})) Q[B] = [, G];
      return Q
    }, "convertMap"),
    wj4 = T3((A, Q) => {
      let B = {};
      for (let G in Q) x6Q(B, A, Q, G);
      return B
    }, "take"),
    qj4 = T3((A, Q, B) => {
      return qw1(A, Object.entries(B).reduce((G, [Z, I]) => {
        if (Array.isArray(I)) G[Z] = I;
        else if (typeof I === "function") G[Z] = [Q, I()];
        else G[Z] = [Q, I];
        return G
      }, {}))
    }, "mapWithFilter"),
    x6Q = T3((A, Q, B, G) => {
      if (Q !== null) {
        let Y = B[G];
        if (typeof Y === "function") Y = [, Y];
        let [J = Nj4, W = Lj4, X = G] = Y;
        if (typeof J === "function" && J(Q[X]) || typeof J !== "function" && !!J) A[G] = W(Q[X]);
        return
      }
      let [Z, I] = B[G];
      if (typeof I === "function") {
        let Y, J = Z === void 0 && (Y = I()) != null,
          W = typeof Z === "function" && !!Z(void 0) || typeof Z !== "function" && !!Z;
        if (J) A[G] = Y;
        else if (W) A[G] = I()
      } else {
        let Y = Z === void 0 && I != null,
          J = typeof Z === "function" && !!Z(I) || typeof Z !== "function" && !!Z;
        if (Y || J) A[G] = I
      }
    }, "applyInstruction"),
    Nj4 = T3((A) => A != null, "nonNullish"),
    Lj4 = T3((A) => A, "pass"),
    Mj4 = T3((A) => {
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
    Oj4 = T3((A) => A.toISOString().replace(".000Z", "Z"), "serializeDateTime"),
    $w1 = T3((A) => {
      if (A == null) return {};
      if (Array.isArray(A)) return A.filter((Q) => Q != null).map($w1);
      if (typeof A === "object") {
        let Q = {};
        for (let B of Object.keys(A)) {
          if (A[B] == null) continue;
          Q[B] = $w1(A[B])
        }
        return Q
      }
      return A
    }, "_json");
  eP4(ww1, s6(), Nw1.exports)
})
// @from(Start 2686498, End 2686872)
h6Q = z((b6Q) => {
  Object.defineProperty(b6Q, "__esModule", {
    value: !0
  });
  b6Q.isStreamingPayload = void 0;
  var Rj4 = UA("stream"),
    Tj4 = (A) => (A === null || A === void 0 ? void 0 : A.body) instanceof Rj4.Readable || typeof ReadableStream < "u" && (A === null || A === void 0 ? void 0 : A.body) instanceof ReadableStream;
  b6Q.isStreamingPayload = Tj4
})
// @from(Start 2686878, End 2697541)
D6 = z((vz7, e6Q) => {
  var {
    defineProperty: nhA,
    getOwnPropertyDescriptor: Pj4,
    getOwnPropertyNames: jj4
  } = Object, Sj4 = Object.prototype.hasOwnProperty, MX = (A, Q) => nhA(A, "name", {
    value: Q,
    configurable: !0
  }), _j4 = (A, Q) => {
    for (var B in Q) nhA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, kj4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of jj4(Q))
        if (!Sj4.call(A, Z) && Z !== B) nhA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Pj4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, yj4 = (A) => kj4(nhA({}, "__esModule", {
    value: !0
  }), A), u6Q = {};
  _j4(u6Q, {
    AdaptiveRetryStrategy: () => bj4,
    CONFIG_MAX_ATTEMPTS: () => Mw1,
    CONFIG_RETRY_MODE: () => n6Q,
    ENV_MAX_ATTEMPTS: () => Lw1,
    ENV_RETRY_MODE: () => i6Q,
    NODE_MAX_ATTEMPT_CONFIG_OPTIONS: () => fj4,
    NODE_RETRY_MODE_CONFIG_OPTIONS: () => gj4,
    StandardRetryStrategy: () => l6Q,
    defaultDelayDecider: () => d6Q,
    defaultRetryDecider: () => c6Q,
    getOmitRetryHeadersPlugin: () => uj4,
    getRetryAfterHint: () => t6Q,
    getRetryPlugin: () => ij4,
    omitRetryHeadersMiddleware: () => a6Q,
    omitRetryHeadersMiddlewareOptions: () => s6Q,
    resolveRetryConfig: () => hj4,
    retryMiddleware: () => r6Q,
    retryMiddlewareOptions: () => o6Q
  });
  e6Q.exports = yj4(u6Q);
  var e4A = w8Q(),
    m6Q = YHA(),
    fY = KW(),
    xj4 = MX((A, Q) => {
      let B = A,
        G = Q?.noRetryIncrement ?? fY.NO_RETRY_INCREMENT,
        Z = Q?.retryCost ?? fY.RETRY_COST,
        I = Q?.timeoutRetryCost ?? fY.TIMEOUT_RETRY_COST,
        Y = A,
        J = MX((F) => F.name === "TimeoutError" ? I : Z, "getCapacityAmount"),
        W = MX((F) => J(F) <= Y, "hasRetryTokens");
      return Object.freeze({
        hasRetryTokens: W,
        retrieveRetryTokens: MX((F) => {
          if (!W(F)) throw Error("No retry token available");
          let K = J(F);
          return Y -= K, K
        }, "retrieveRetryTokens"),
        releaseRetryTokens: MX((F) => {
          Y += F ?? G, Y = Math.min(Y, B)
        }, "releaseRetryTokens")
      })
    }, "getDefaultRetryQuota"),
    d6Q = MX((A, Q) => Math.floor(Math.min(fY.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** Q * A)), "defaultDelayDecider"),
    Ud = Fw1(),
    c6Q = MX((A) => {
      if (!A) return !1;
      return (0, Ud.isRetryableByTrait)(A) || (0, Ud.isClockSkewError)(A) || (0, Ud.isThrottlingError)(A) || (0, Ud.isTransientError)(A)
    }, "defaultRetryDecider"),
    p6Q = MX((A) => {
      if (A instanceof Error) return A;
      if (A instanceof Object) return Object.assign(Error(), A);
      if (typeof A === "string") return Error(A);
      return Error(`AWS SDK error wrapper for ${A}`)
    }, "asSdkError"),
    l6Q = class {
      constructor(A, Q) {
        this.maxAttemptsProvider = A, this.mode = fY.RETRY_MODES.STANDARD, this.retryDecider = Q?.retryDecider ?? c6Q, this.delayDecider = Q?.delayDecider ?? d6Q, this.retryQuota = Q?.retryQuota ?? xj4(fY.INITIAL_RETRY_TOKENS)
      }
      static {
        MX(this, "StandardRetryStrategy")
      }
      shouldRetry(A, Q, B) {
        return Q < B && this.retryDecider(A) && this.retryQuota.hasRetryTokens(A)
      }
      async getMaxAttempts() {
        let A;
        try {
          A = await this.maxAttemptsProvider()
        } catch (Q) {
          A = fY.DEFAULT_MAX_ATTEMPTS
        }
        return A
      }
      async retry(A, Q, B) {
        let G, Z = 0,
          I = 0,
          Y = await this.getMaxAttempts(),
          {
            request: J
          } = Q;
        if (e4A.HttpRequest.isInstance(J)) J.headers[fY.INVOCATION_ID_HEADER] = (0, m6Q.v4)();
        while (!0) try {
          if (e4A.HttpRequest.isInstance(J)) J.headers[fY.REQUEST_HEADER] = `attempt=${Z+1}; max=${Y}`;
          if (B?.beforeRequest) await B.beforeRequest();
          let {
            response: W,
            output: X
          } = await A(Q);
          if (B?.afterRequest) B.afterRequest(W);
          return this.retryQuota.releaseRetryTokens(G), X.$metadata.attempts = Z + 1, X.$metadata.totalRetryDelay = I, {
            response: W,
            output: X
          }
        } catch (W) {
          let X = p6Q(W);
          if (Z++, this.shouldRetry(X, Z, Y)) {
            G = this.retryQuota.retrieveRetryTokens(X);
            let V = this.delayDecider((0, Ud.isThrottlingError)(X) ? fY.THROTTLING_RETRY_DELAY_BASE : fY.DEFAULT_RETRY_DELAY_BASE, Z),
              F = vj4(X.$response),
              K = Math.max(F || 0, V);
            I += K, await new Promise((D) => setTimeout(D, K));
            continue
          }
          if (!X.$metadata) X.$metadata = {};
          throw X.$metadata.attempts = Z, X.$metadata.totalRetryDelay = I, X
        }
      }
    },
    vj4 = MX((A) => {
      if (!e4A.HttpResponse.isInstance(A)) return;
      let Q = Object.keys(A.headers).find((I) => I.toLowerCase() === "retry-after");
      if (!Q) return;
      let B = A.headers[Q],
        G = Number(B);
      if (!Number.isNaN(G)) return G * 1000;
      return new Date(B).getTime() - Date.now()
    }, "getDelayFromRetryAfterHeader"),
    bj4 = class extends l6Q {
      static {
        MX(this, "AdaptiveRetryStrategy")
      }
      constructor(A, Q) {
        let {
          rateLimiter: B,
          ...G
        } = Q ?? {};
        super(A, G);
        this.rateLimiter = B ?? new fY.DefaultRateLimiter, this.mode = fY.RETRY_MODES.ADAPTIVE
      }
      async retry(A, Q) {
        return super.retry(A, Q, {
          beforeRequest: async () => {
            return this.rateLimiter.getSendToken()
          },
          afterRequest: (B) => {
            this.rateLimiter.updateClientSendingRate(B)
          }
        })
      }
    },
    g6Q = w7(),
    Lw1 = "AWS_MAX_ATTEMPTS",
    Mw1 = "max_attempts",
    fj4 = {
      environmentVariableSelector: (A) => {
        let Q = A[Lw1];
        if (!Q) return;
        let B = parseInt(Q);
        if (Number.isNaN(B)) throw Error(`Environment variable ${Lw1} mast be a number, got "${Q}"`);
        return B
      },
      configFileSelector: (A) => {
        let Q = A[Mw1];
        if (!Q) return;
        let B = parseInt(Q);
        if (Number.isNaN(B)) throw Error(`Shared config file entry ${Mw1} mast be a number, got "${Q}"`);
        return B
      },
      default: fY.DEFAULT_MAX_ATTEMPTS
    },
    hj4 = MX((A) => {
      let {
        retryStrategy: Q,
        retryMode: B,
        maxAttempts: G
      } = A, Z = (0, g6Q.normalizeProvider)(G ?? fY.DEFAULT_MAX_ATTEMPTS);
      return Object.assign(A, {
        maxAttempts: Z,
        retryStrategy: async () => {
          if (Q) return Q;
          if (await (0, g6Q.normalizeProvider)(B)() === fY.RETRY_MODES.ADAPTIVE) return new fY.AdaptiveRetryStrategy(Z);
          return new fY.StandardRetryStrategy(Z)
        }
      })
    }, "resolveRetryConfig"),
    i6Q = "AWS_RETRY_MODE",
    n6Q = "retry_mode",
    gj4 = {
      environmentVariableSelector: (A) => A[i6Q],
      configFileSelector: (A) => A[n6Q],
      default: fY.DEFAULT_RETRY_MODE
    },
    a6Q = MX(() => (A) => async (Q) => {
      let {
        request: B
      } = Q;
      if (e4A.HttpRequest.isInstance(B)) delete B.headers[fY.INVOCATION_ID_HEADER], delete B.headers[fY.REQUEST_HEADER];
      return A(Q)
    }, "omitRetryHeadersMiddleware"),
    s6Q = {
      name: "omitRetryHeadersMiddleware",
      tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
      relation: "before",
      toMiddleware: "awsAuthMiddleware",
      override: !0
    },
    uj4 = MX((A) => ({
      applyToStack: (Q) => {
        Q.addRelativeTo(a6Q(), s6Q)
      }
    }), "getOmitRetryHeadersPlugin"),
    mj4 = v6Q(),
    dj4 = h6Q(),
    r6Q = MX((A) => (Q, B) => async (G) => {
      let Z = await A.retryStrategy(),
        I = await A.maxAttempts();
      if (cj4(Z)) {
        Z = Z;
        let Y = await Z.acquireInitialRetryToken(B.partition_id),
          J = Error(),
          W = 0,
          X = 0,
          {
            request: V
          } = G,
          F = e4A.HttpRequest.isInstance(V);
        if (F) V.headers[fY.INVOCATION_ID_HEADER] = (0, m6Q.v4)();
        while (!0) try {
          if (F) V.headers[fY.REQUEST_HEADER] = `attempt=${W+1}; max=${I}`;
          let {
            response: K,
            output: D
          } = await Q(G);
          return Z.recordSuccess(Y), D.$metadata.attempts = W + 1, D.$metadata.totalRetryDelay = X, {
            response: K,
            output: D
          }
        } catch (K) {
          let D = pj4(K);
          if (J = p6Q(K), F && (0, dj4.isStreamingPayload)(V)) throw (B.logger instanceof mj4.NoOpLogger ? console : B.logger)?.warn("An error was encountered in a non-retryable streaming request."), J;
          try {
            Y = await Z.refreshRetryTokenForRetry(Y, D)
          } catch (C) {
            if (!J.$metadata) J.$metadata = {};
            throw J.$metadata.attempts = W + 1, J.$metadata.totalRetryDelay = X, J
          }
          W = Y.getRetryCount();
          let H = Y.getRetryDelay();
          X += H, await new Promise((C) => setTimeout(C, H))
        }
      } else {
        if (Z = Z, Z?.mode) B.userAgent = [...B.userAgent || [],
          ["cfg/retry-mode", Z.mode]
        ];
        return Z.retry(Q, G)
      }
    }, "retryMiddleware"),
    cj4 = MX((A) => typeof A.acquireInitialRetryToken < "u" && typeof A.refreshRetryTokenForRetry < "u" && typeof A.recordSuccess < "u", "isRetryStrategyV2"),
    pj4 = MX((A) => {
      let Q = {
          error: A,
          errorType: lj4(A)
        },
        B = t6Q(A.$response);
      if (B) Q.retryAfterHint = B;
      return Q
    }, "getRetryErrorInfo"),
    lj4 = MX((A) => {
      if ((0, Ud.isThrottlingError)(A)) return "THROTTLING";
      if ((0, Ud.isTransientError)(A)) return "TRANSIENT";
      if ((0, Ud.isServerError)(A)) return "SERVER_ERROR";
      return "CLIENT_ERROR"
    }, "getRetryErrorType"),
    o6Q = {
      name: "retryMiddleware",
      tags: ["RETRY"],
      step: "finalizeRequest",
      priority: "high",
      override: !0
    },
    ij4 = MX((A) => ({
      applyToStack: (Q) => {
        Q.add(r6Q(A), o6Q)
      }
    }), "getRetryPlugin"),
    t6Q = MX((A) => {
      if (!e4A.HttpResponse.isInstance(A)) return;
      let Q = Object.keys(A.headers).find((I) => I.toLowerCase() === "retry-after");
      if (!Q) return;
      let B = A.headers[Q],
        G = Number(B);
      if (!Number.isNaN(G)) return new Date(G * 1000);
      return new Date(B)
    }, "getRetryAfterHint")
})
// @from(Start 2697547, End 2699285)
Rw1 = z((Q5Q) => {
  Object.defineProperty(Q5Q, "__esModule", {
    value: !0
  });
  Q5Q.resolveHttpAuthSchemeConfig = Q5Q.resolveStsAuthConfig = Q5Q.defaultSTSHttpAuthSchemeProvider = Q5Q.defaultSTSHttpAuthSchemeParametersProvider = void 0;
  var nj4 = MF(),
    Ow1 = w7(),
    aj4 = WHA(),
    sj4 = async (A, Q, B) => {
      return {
        operation: (0, Ow1.getSmithyContext)(Q).operation,
        region: await (0, Ow1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  Q5Q.defaultSTSHttpAuthSchemeParametersProvider = sj4;

  function rj4(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "sts",
        region: A.region
      },
      propertiesExtractor: (Q, B) => ({
        signingProperties: {
          config: Q,
          context: B
        }
      })
    }
  }

  function A5Q(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var oj4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "AssumeRoleWithSAML": {
        Q.push(A5Q(A));
        break
      }
      case "AssumeRoleWithWebIdentity": {
        Q.push(A5Q(A));
        break
      }
      default:
        Q.push(rj4(A))
    }
    return Q
  };
  Q5Q.defaultSTSHttpAuthSchemeProvider = oj4;
  var tj4 = (A) => Object.assign(A, {
    stsClientCtor: aj4.STSClient
  });
  Q5Q.resolveStsAuthConfig = tj4;
  var ej4 = (A) => {
    let Q = Q5Q.resolveStsAuthConfig(A),
      B = (0, nj4.resolveAwsSdkSigV4Config)(Q);
    return Object.assign(B, {
      authSchemePreference: (0, Ow1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  Q5Q.resolveHttpAuthSchemeConfig = ej4
})
// @from(Start 2699291, End 2700178)
IL = z((Z5Q) => {
  Object.defineProperty(Z5Q, "__esModule", {
    value: !0
  });
  Z5Q.commonParams = Z5Q.resolveClientEndpointParameters = void 0;
  var BS4 = (A) => {
    return Object.assign(A, {
      useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
      useFipsEndpoint: A.useFipsEndpoint ?? !1,
      useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
      defaultSigningName: "sts"
    })
  };
  Z5Q.resolveClientEndpointParameters = BS4;
  Z5Q.commonParams = {
    UseGlobalEndpoint: {
      type: "builtInParams",
      name: "useGlobalEndpoint"
    },
    UseFIPS: {
      type: "builtInParams",
      name: "useFipsEndpoint"
    },
    Endpoint: {
      type: "builtInParams",
      name: "endpoint"
    },
    Region: {
      type: "builtInParams",
      name: "region"
    },
    UseDualStack: {
      type: "builtInParams",
      name: "useDualstackEndpoint"
    }
  }
})
// @from(Start 2700184, End 2703952)
Y5Q = z((uz7, ZS4) => {
  ZS4.exports = {
    name: "@aws-sdk/client-sts",
    description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
    version: "3.840.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-sts",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "rimraf ./dist-types tsconfig.types.tsbuildinfo && tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
      test: "yarn g:vitest run",
      "test:watch": "yarn g:vitest watch"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/credential-provider-node": "3.840.0",
      "@aws-sdk/middleware-host-header": "3.840.0",
      "@aws-sdk/middleware-logger": "3.840.0",
      "@aws-sdk/middleware-recursion-detection": "3.840.0",
      "@aws-sdk/middleware-user-agent": "3.840.0",
      "@aws-sdk/region-config-resolver": "3.840.0",
      "@aws-sdk/types": "3.840.0",
      "@aws-sdk/util-endpoints": "3.840.0",
      "@aws-sdk/util-user-agent-browser": "3.840.0",
      "@aws-sdk/util-user-agent-node": "3.840.0",
      "@smithy/config-resolver": "^4.1.4",
      "@smithy/core": "^3.6.0",
      "@smithy/fetch-http-handler": "^5.0.4",
      "@smithy/hash-node": "^4.0.4",
      "@smithy/invalid-dependency": "^4.0.4",
      "@smithy/middleware-content-length": "^4.0.4",
      "@smithy/middleware-endpoint": "^4.1.13",
      "@smithy/middleware-retry": "^4.1.14",
      "@smithy/middleware-serde": "^4.0.8",
      "@smithy/middleware-stack": "^4.0.4",
      "@smithy/node-config-provider": "^4.1.3",
      "@smithy/node-http-handler": "^4.0.6",
      "@smithy/protocol-http": "^5.1.2",
      "@smithy/smithy-client": "^4.4.5",
      "@smithy/types": "^4.3.1",
      "@smithy/url-parser": "^4.0.4",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.21",
      "@smithy/util-defaults-mode-node": "^4.0.21",
      "@smithy/util-endpoints": "^3.0.6",
      "@smithy/util-middleware": "^4.0.4",
      "@smithy/util-retry": "^4.0.6",
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
      "@types/node": "^18.19.69",
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.8.3"
    },
    engines: {
      node: ">=18.0.0"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["dist-*/**"],
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    browser: {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
    },
    "react-native": {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
    },
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-sts"
    }
  }
})
// @from(Start 2703958, End 2706031)
Tw1 = z((mz7, H5Q) => {
  var {
    defineProperty: ahA,
    getOwnPropertyDescriptor: IS4,
    getOwnPropertyNames: YS4
  } = Object, JS4 = Object.prototype.hasOwnProperty, WS4 = (A, Q) => ahA(A, "name", {
    value: Q,
    configurable: !0
  }), XS4 = (A, Q) => {
    for (var B in Q) ahA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, VS4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of YS4(Q))
        if (!JS4.call(A, Z) && Z !== B) ahA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = IS4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, FS4 = (A) => VS4(ahA({}, "__esModule", {
    value: !0
  }), A), J5Q = {};
  XS4(J5Q, {
    ENV_ACCOUNT_ID: () => D5Q,
    ENV_CREDENTIAL_SCOPE: () => K5Q,
    ENV_EXPIRATION: () => F5Q,
    ENV_KEY: () => W5Q,
    ENV_SECRET: () => X5Q,
    ENV_SESSION: () => V5Q,
    fromEnv: () => HS4
  });
  H5Q.exports = FS4(J5Q);
  var KS4 = QL(),
    DS4 = j2(),
    W5Q = "AWS_ACCESS_KEY_ID",
    X5Q = "AWS_SECRET_ACCESS_KEY",
    V5Q = "AWS_SESSION_TOKEN",
    F5Q = "AWS_CREDENTIAL_EXPIRATION",
    K5Q = "AWS_CREDENTIAL_SCOPE",
    D5Q = "AWS_ACCOUNT_ID",
    HS4 = WS4((A) => async () => {
      A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
      let Q = process.env[W5Q],
        B = process.env[X5Q],
        G = process.env[V5Q],
        Z = process.env[F5Q],
        I = process.env[K5Q],
        Y = process.env[D5Q];
      if (Q && B) {
        let J = {
          accessKeyId: Q,
          secretAccessKey: B,
          ...G && {
            sessionToken: G
          },
          ...Z && {
            expiration: new Date(Z)
          },
          ...I && {
            credentialScope: I
          },
          ...Y && {
            accountId: Y
          }
        };
        return (0, KS4.setCredentialFeature)(J, "CREDENTIALS_ENV_VARS", "g"), J
      }
      throw new DS4.CredentialsProviderError("Unable to find environment variable credentials.", {
        logger: A?.logger
      })
    }, "fromEnv")
})
// @from(Start 2706037, End 2717672)
OV = z((dz7, T5Q) => {
  var {
    defineProperty: ohA,
    getOwnPropertyDescriptor: CS4,
    getOwnPropertyNames: ES4
  } = Object, zS4 = Object.prototype.hasOwnProperty, OX = (A, Q) => ohA(A, "name", {
    value: Q,
    configurable: !0
  }), US4 = (A, Q) => {
    for (var B in Q) ohA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, $S4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ES4(Q))
        if (!zS4.call(A, Z) && Z !== B) ohA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = CS4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, wS4 = (A) => $S4(ohA({}, "__esModule", {
    value: !0
  }), A), U5Q = {};
  US4(U5Q, {
    DEFAULT_MAX_RETRIES: () => N5Q,
    DEFAULT_TIMEOUT: () => q5Q,
    ENV_CMDS_AUTH_TOKEN: () => Sw1,
    ENV_CMDS_FULL_URI: () => shA,
    ENV_CMDS_RELATIVE_URI: () => rhA,
    Endpoint: () => L5Q,
    fromContainerMetadata: () => MS4,
    fromInstanceMetadata: () => lS4,
    getInstanceMetadataEndpoint: () => O5Q,
    httpRequest: () => A8A,
    providerConfigFromInit: () => _w1
  });
  T5Q.exports = wS4(U5Q);
  var qS4 = UA("url"),
    LS = j2(),
    NS4 = UA("buffer"),
    LS4 = UA("http");

  function A8A(A) {
    return new Promise((Q, B) => {
      let G = (0, LS4.request)({
        method: "GET",
        ...A,
        hostname: A.hostname?.replace(/^\[(.+)\]$/, "$1")
      });
      G.on("error", (Z) => {
        B(Object.assign(new LS.ProviderError("Unable to connect to instance metadata service"), Z)), G.destroy()
      }), G.on("timeout", () => {
        B(new LS.ProviderError("TimeoutError from instance metadata service")), G.destroy()
      }), G.on("response", (Z) => {
        let {
          statusCode: I = 400
        } = Z;
        if (I < 200 || 300 <= I) B(Object.assign(new LS.ProviderError("Error response received from instance metadata service"), {
          statusCode: I
        })), G.destroy();
        let Y = [];
        Z.on("data", (J) => {
          Y.push(J)
        }), Z.on("end", () => {
          Q(NS4.Buffer.concat(Y)), G.destroy()
        })
      }), G.end()
    })
  }
  OX(A8A, "httpRequest");
  var $5Q = OX((A) => Boolean(A) && typeof A === "object" && typeof A.AccessKeyId === "string" && typeof A.SecretAccessKey === "string" && typeof A.Token === "string" && typeof A.Expiration === "string", "isImdsCredentials"),
    w5Q = OX((A) => ({
      accessKeyId: A.AccessKeyId,
      secretAccessKey: A.SecretAccessKey,
      sessionToken: A.Token,
      expiration: new Date(A.Expiration),
      ...A.AccountId && {
        accountId: A.AccountId
      }
    }), "fromImdsCredentials"),
    q5Q = 1000,
    N5Q = 0,
    _w1 = OX(({
      maxRetries: A = N5Q,
      timeout: Q = q5Q
    }) => ({
      maxRetries: A,
      timeout: Q
    }), "providerConfigFromInit"),
    jw1 = OX((A, Q) => {
      let B = A();
      for (let G = 0; G < Q; G++) B = B.catch(A);
      return B
    }, "retry"),
    shA = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    rhA = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    Sw1 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    MS4 = OX((A = {}) => {
      let {
        timeout: Q,
        maxRetries: B
      } = _w1(A);
      return () => jw1(async () => {
        let G = await jS4({
            logger: A.logger
          }),
          Z = JSON.parse(await OS4(Q, G));
        if (!$5Q(Z)) throw new LS.CredentialsProviderError("Invalid response received from instance metadata service.", {
          logger: A.logger
        });
        return w5Q(Z)
      }, B)
    }, "fromContainerMetadata"),
    OS4 = OX(async (A, Q) => {
      if (process.env[Sw1]) Q.headers = {
        ...Q.headers,
        Authorization: process.env[Sw1]
      };
      return (await A8A({
        ...Q,
        timeout: A
      })).toString()
    }, "requestFromEcsImds"),
    RS4 = "169.254.170.2",
    TS4 = {
      localhost: !0,
      "127.0.0.1": !0
    },
    PS4 = {
      "http:": !0,
      "https:": !0
    },
    jS4 = OX(async ({
      logger: A
    }) => {
      if (process.env[rhA]) return {
        hostname: RS4,
        path: process.env[rhA]
      };
      if (process.env[shA]) {
        let Q = (0, qS4.parse)(process.env[shA]);
        if (!Q.hostname || !(Q.hostname in TS4)) throw new LS.CredentialsProviderError(`${Q.hostname} is not a valid container metadata service hostname`, {
          tryNextLink: !1,
          logger: A
        });
        if (!Q.protocol || !(Q.protocol in PS4)) throw new LS.CredentialsProviderError(`${Q.protocol} is not a valid container metadata service protocol`, {
          tryNextLink: !1,
          logger: A
        });
        return {
          ...Q,
          port: Q.port ? parseInt(Q.port, 10) : void 0
        }
      }
      throw new LS.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${rhA} or ${shA} environment variable is set`, {
        tryNextLink: !1,
        logger: A
      })
    }, "getCmdsUri"),
    SS4 = class A extends LS.CredentialsProviderError {
      constructor(Q, B = !0) {
        super(Q, B);
        this.tryNextLink = B, this.name = "InstanceMetadataV1FallbackError", Object.setPrototypeOf(this, A.prototype)
      }
      static {
        OX(this, "InstanceMetadataV1FallbackError")
      }
    },
    kw1 = uI(),
    _S4 = NJ(),
    L5Q = ((A) => {
      return A.IPv4 = "http://169.254.169.254", A.IPv6 = "http://[fd00:ec2::254]", A
    })(L5Q || {}),
    kS4 = "AWS_EC2_METADATA_SERVICE_ENDPOINT",
    yS4 = "ec2_metadata_service_endpoint",
    xS4 = {
      environmentVariableSelector: (A) => A[kS4],
      configFileSelector: (A) => A[yS4],
      default: void 0
    },
    M5Q = ((A) => {
      return A.IPv4 = "IPv4", A.IPv6 = "IPv6", A
    })(M5Q || {}),
    vS4 = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE",
    bS4 = "ec2_metadata_service_endpoint_mode",
    fS4 = {
      environmentVariableSelector: (A) => A[vS4],
      configFileSelector: (A) => A[bS4],
      default: "IPv4"
    },
    O5Q = OX(async () => (0, _S4.parseUrl)(await hS4() || await gS4()), "getInstanceMetadataEndpoint"),
    hS4 = OX(async () => (0, kw1.loadConfig)(xS4)(), "getFromEndpointConfig"),
    gS4 = OX(async () => {
      let A = await (0, kw1.loadConfig)(fS4)();
      switch (A) {
        case "IPv4":
          return "http://169.254.169.254";
        case "IPv6":
          return "http://[fd00:ec2::254]";
        default:
          throw Error(`Unsupported endpoint mode: ${A}. Select from ${Object.values(M5Q)}`)
      }
    }, "getFromEndpointModeConfig"),
    uS4 = 300,
    mS4 = 300,
    dS4 = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html",
    C5Q = OX((A, Q) => {
      let B = uS4 + Math.floor(Math.random() * mS4),
        G = new Date(Date.now() + B * 1000);
      Q.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(G)}.
For more information, please visit: ` + dS4);
      let Z = A.originalExpiration ?? A.expiration;
      return {
        ...A,
        ...Z ? {
          originalExpiration: Z
        } : {},
        expiration: G
      }
    }, "getExtendedInstanceMetadataCredentials"),
    cS4 = OX((A, Q = {}) => {
      let B = Q?.logger || console,
        G;
      return async () => {
        let Z;
        try {
          if (Z = await A(), Z.expiration && Z.expiration.getTime() < Date.now()) Z = C5Q(Z, B)
        } catch (I) {
          if (G) B.warn("Credential renew failed: ", I), Z = C5Q(G, B);
          else throw I
        }
        return G = Z, Z
      }
    }, "staticStabilityProvider"),
    R5Q = "/latest/meta-data/iam/security-credentials/",
    pS4 = "/latest/api/token",
    Pw1 = "AWS_EC2_METADATA_V1_DISABLED",
    E5Q = "ec2_metadata_v1_disabled",
    z5Q = "x-aws-ec2-metadata-token",
    lS4 = OX((A = {}) => cS4(iS4(A), {
      logger: A.logger
    }), "fromInstanceMetadata"),
    iS4 = OX((A = {}) => {
      let Q = !1,
        {
          logger: B,
          profile: G
        } = A,
        {
          timeout: Z,
          maxRetries: I
        } = _w1(A),
        Y = OX(async (J, W) => {
          if (Q || W.headers?.[z5Q] == null) {
            let F = !1,
              K = !1,
              D = await (0, kw1.loadConfig)({
                environmentVariableSelector: (H) => {
                  let C = H[Pw1];
                  if (K = !!C && C !== "false", C === void 0) throw new LS.CredentialsProviderError(`${Pw1} not set in env, checking config file next.`, {
                    logger: A.logger
                  });
                  return K
                },
                configFileSelector: (H) => {
                  let C = H[E5Q];
                  return F = !!C && C !== "false", F
                },
                default: !1
              }, {
                profile: G
              })();
            if (A.ec2MetadataV1Disabled || D) {
              let H = [];
              if (A.ec2MetadataV1Disabled) H.push("credential provider initialization (runtime option ec2MetadataV1Disabled)");
              if (F) H.push(`config file profile (${E5Q})`);
              if (K) H.push(`process environment variable (${Pw1})`);
              throw new SS4(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${H.join(", ")}].`)
            }
          }
          let V = (await jw1(async () => {
            let F;
            try {
              F = await aS4(W)
            } catch (K) {
              if (K.statusCode === 401) Q = !1;
              throw K
            }
            return F
          }, J)).trim();
          return jw1(async () => {
            let F;
            try {
              F = await sS4(V, W, A)
            } catch (K) {
              if (K.statusCode === 401) Q = !1;
              throw K
            }
            return F
          }, J)
        }, "getCredentials");
      return async () => {
        let J = await O5Q();
        if (Q) return B?.debug("AWS SDK Instance Metadata", "using v1 fallback (no token fetch)"), Y(I, {
          ...J,
          timeout: Z
        });
        else {
          let W;
          try {
            W = (await nS4({
              ...J,
              timeout: Z
            })).toString()
          } catch (X) {
            if (X?.statusCode === 400) throw Object.assign(X, {
              message: "EC2 Metadata token request returned error"
            });
            else if (X.message === "TimeoutError" || [403, 404, 405].includes(X.statusCode)) Q = !0;
            return B?.debug("AWS SDK Instance Metadata", "using v1 fallback (initial)"), Y(I, {
              ...J,
              timeout: Z
            })
          }
          return Y(I, {
            ...J,
            headers: {
              [z5Q]: W
            },
            timeout: Z
          })
        }
      }
    }, "getInstanceMetadataProvider"),
    nS4 = OX(async (A) => A8A({
      ...A,
      path: pS4,
      method: "PUT",
      headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "21600"
      }
    }), "getMetadataToken"),
    aS4 = OX(async (A) => (await A8A({
      ...A,
      path: R5Q
    })).toString(), "getProfile"),
    sS4 = OX(async (A, Q, B) => {
      let G = JSON.parse((await A8A({
        ...Q,
        path: R5Q + A
      })).toString());
      if (!$5Q(G)) throw new LS.CredentialsProviderError("Invalid response received from instance metadata service.", {
        logger: B.logger
      });
      return w5Q(G)
    }, "getCredentialsFromProfile")
})
// @from(Start 2717678, End 2718801)
S5Q = z((P5Q) => {
  Object.defineProperty(P5Q, "__esModule", {
    value: !0
  });
  P5Q.checkUrl = void 0;
  var rS4 = j2(),
    oS4 = "169.254.170.2",
    tS4 = "169.254.170.23",
    eS4 = "[fd00:ec2::23]",
    A_4 = (A, Q) => {
      if (A.protocol === "https:") return;
      if (A.hostname === oS4 || A.hostname === tS4 || A.hostname === eS4) return;
      if (A.hostname.includes("[")) {
        if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
      } else {
        if (A.hostname === "localhost") return;
        let B = A.hostname.split("."),
          G = (Z) => {
            let I = parseInt(Z, 10);
            return 0 <= I && I <= 255
          };
        if (B[0] === "127" && G(B[1]) && G(B[2]) && G(B[3]) && B.length === 4) return
      }
      throw new rS4.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
        logger: Q
      })
    };
  P5Q.checkUrl = A_4
})
// @from(Start 2718807, End 2720548)
k5Q = z((_5Q) => {
  Object.defineProperty(_5Q, "__esModule", {
    value: !0
  });
  _5Q.createGetRequest = Z_4;
  _5Q.getCredentials = I_4;
  var yw1 = j2(),
    Q_4 = nC(),
    B_4 = K6(),
    G_4 = Xd();

  function Z_4(A) {
    return new Q_4.HttpRequest({
      protocol: A.protocol,
      hostname: A.hostname,
      port: Number(A.port),
      path: A.pathname,
      query: Array.from(A.searchParams.entries()).reduce((Q, [B, G]) => {
        return Q[B] = G, Q
      }, {}),
      fragment: A.hash
    })
  }
  async function I_4(A, Q) {
    let G = await (0, G_4.sdkStreamMixin)(A.body).transformToString();
    if (A.statusCode === 200) {
      let Z = JSON.parse(G);
      if (typeof Z.AccessKeyId !== "string" || typeof Z.SecretAccessKey !== "string" || typeof Z.Token !== "string" || typeof Z.Expiration !== "string") throw new yw1.CredentialsProviderError("HTTP credential provider response not of the required format, an object matching: { AccessKeyId: string, SecretAccessKey: string, Token: string, Expiration: string(rfc3339) }", {
        logger: Q
      });
      return {
        accessKeyId: Z.AccessKeyId,
        secretAccessKey: Z.SecretAccessKey,
        sessionToken: Z.Token,
        expiration: (0, B_4.parseRfc3339DateTime)(Z.Expiration)
      }
    }
    if (A.statusCode >= 400 && A.statusCode < 500) {
      let Z = {};
      try {
        Z = JSON.parse(G)
      } catch (I) {}
      throw Object.assign(new yw1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
        logger: Q
      }), {
        Code: Z.Code,
        Message: Z.Message
      })
    }
    throw new yw1.CredentialsProviderError(`Server responded with status: ${A.statusCode}`, {
      logger: Q
    })
  }
})
// @from(Start 2720554, End 2720924)
v5Q = z((y5Q) => {
  Object.defineProperty(y5Q, "__esModule", {
    value: !0
  });
  y5Q.retryWrapper = void 0;
  var W_4 = (A, Q, B) => {
    return async () => {
      for (let G = 0; G < Q; ++G) try {
        return await A()
      } catch (Z) {
        await new Promise((I) => setTimeout(I, B))
      }
      return await A()
    }
  };
  y5Q.retryWrapper = W_4
})
// @from(Start 2720930, End 2723417)
u5Q = z((h5Q) => {
  Object.defineProperty(h5Q, "__esModule", {
    value: !0
  });
  h5Q.fromHttp = void 0;
  var X_4 = yr(),
    V_4 = QL(),
    F_4 = IZ(),
    b5Q = j2(),
    K_4 = X_4.__importDefault(UA("fs/promises")),
    D_4 = S5Q(),
    f5Q = k5Q(),
    H_4 = v5Q(),
    C_4 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
    E_4 = "http://169.254.170.2",
    z_4 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
    U_4 = "AWS_CONTAINER_AUTHORIZATION_TOKEN_FILE",
    $_4 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
    w_4 = (A = {}) => {
      A.logger?.debug("@aws-sdk/credential-provider-http - fromHttp");
      let Q, B = A.awsContainerCredentialsRelativeUri ?? process.env[C_4],
        G = A.awsContainerCredentialsFullUri ?? process.env[z_4],
        Z = A.awsContainerAuthorizationToken ?? process.env[$_4],
        I = A.awsContainerAuthorizationTokenFile ?? process.env[U_4],
        Y = A.logger?.constructor?.name === "NoOpLogger" || !A.logger ? console.warn : A.logger.warn;
      if (B && G) Y("@aws-sdk/credential-provider-http: you have set both awsContainerCredentialsRelativeUri and awsContainerCredentialsFullUri."), Y("awsContainerCredentialsFullUri will take precedence.");
      if (Z && I) Y("@aws-sdk/credential-provider-http: you have set both awsContainerAuthorizationToken and awsContainerAuthorizationTokenFile."), Y("awsContainerAuthorizationToken will take precedence.");
      if (G) Q = G;
      else if (B) Q = `${E_4}${B}`;
      else throw new b5Q.CredentialsProviderError(`No HTTP credential provider host provided.
Set AWS_CONTAINER_CREDENTIALS_FULL_URI or AWS_CONTAINER_CREDENTIALS_RELATIVE_URI.`, {
        logger: A.logger
      });
      let J = new URL(Q);
      (0, D_4.checkUrl)(J, A.logger);
      let W = new F_4.NodeHttpHandler({
        requestTimeout: A.timeout ?? 1000,
        connectionTimeout: A.timeout ?? 1000
      });
      return (0, H_4.retryWrapper)(async () => {
        let X = (0, f5Q.createGetRequest)(J);
        if (Z) X.headers.Authorization = Z;
        else if (I) X.headers.Authorization = (await K_4.default.readFile(I)).toString();
        try {
          let V = await W.handle(X);
          return (0, f5Q.getCredentials)(V.response).then((F) => (0, V_4.setCredentialFeature)(F, "CREDENTIALS_HTTP", "z"))
        } catch (V) {
          throw new b5Q.CredentialsProviderError(String(V), {
            logger: A.logger
          })
        }
      }, A.maxRetries ?? 3, A.timeout ?? 1000)
    };
  h5Q.fromHttp = w_4
})
// @from(Start 2723423, End 2723675)
vw1 = z((xw1) => {
  Object.defineProperty(xw1, "__esModule", {
    value: !0
  });
  xw1.fromHttp = void 0;
  var q_4 = u5Q();
  Object.defineProperty(xw1, "fromHttp", {
    enumerable: !0,
    get: function() {
      return q_4.fromHttp
    }
  })
})
// @from(Start 2723681, End 2725369)
fw1 = z((m5Q) => {
  Object.defineProperty(m5Q, "__esModule", {
    value: !0
  });
  m5Q.resolveHttpAuthSchemeConfig = m5Q.defaultSSOHttpAuthSchemeProvider = m5Q.defaultSSOHttpAuthSchemeParametersProvider = void 0;
  var L_4 = MF(),
    bw1 = w7(),
    M_4 = async (A, Q, B) => {
      return {
        operation: (0, bw1.getSmithyContext)(Q).operation,
        region: await (0, bw1.normalizeProvider)(A.region)() || (() => {
          throw Error("expected `region` to be configured for `aws.auth#sigv4`")
        })()
      }
    };
  m5Q.defaultSSOHttpAuthSchemeParametersProvider = M_4;

  function O_4(A) {
    return {
      schemeId: "aws.auth#sigv4",
      signingProperties: {
        name: "awsssoportal",
        region: A.region
      },
      propertiesExtractor: (Q, B) => ({
        signingProperties: {
          config: Q,
          context: B
        }
      })
    }
  }

  function thA(A) {
    return {
      schemeId: "smithy.api#noAuth"
    }
  }
  var R_4 = (A) => {
    let Q = [];
    switch (A.operation) {
      case "GetRoleCredentials": {
        Q.push(thA(A));
        break
      }
      case "ListAccountRoles": {
        Q.push(thA(A));
        break
      }
      case "ListAccounts": {
        Q.push(thA(A));
        break
      }
      case "Logout": {
        Q.push(thA(A));
        break
      }
      default:
        Q.push(O_4(A))
    }
    return Q
  };
  m5Q.defaultSSOHttpAuthSchemeProvider = R_4;
  var T_4 = (A) => {
    let Q = (0, L_4.resolveAwsSdkSigV4Config)(A);
    return Object.assign(Q, {
      authSchemePreference: (0, bw1.normalizeProvider)(A.authSchemePreference ?? [])
    })
  };
  m5Q.resolveHttpAuthSchemeConfig = T_4
})
// @from(Start 2725375, End 2728963)
c5Q = z((sz7, S_4) => {
  S_4.exports = {
    name: "@aws-sdk/client-sso",
    description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
    version: "3.840.0",
    scripts: {
      build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
      "build:cjs": "node ../../scripts/compilation/inline client-sso",
      "build:es": "tsc -p tsconfig.es.json",
      "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
      "build:types": "tsc -p tsconfig.types.json",
      "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
      clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
      "extract:docs": "api-extractor run --local",
      "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
    },
    main: "./dist-cjs/index.js",
    types: "./dist-types/index.d.ts",
    module: "./dist-es/index.js",
    sideEffects: !1,
    dependencies: {
      "@aws-crypto/sha256-browser": "5.2.0",
      "@aws-crypto/sha256-js": "5.2.0",
      "@aws-sdk/core": "3.840.0",
      "@aws-sdk/middleware-host-header": "3.840.0",
      "@aws-sdk/middleware-logger": "3.840.0",
      "@aws-sdk/middleware-recursion-detection": "3.840.0",
      "@aws-sdk/middleware-user-agent": "3.840.0",
      "@aws-sdk/region-config-resolver": "3.840.0",
      "@aws-sdk/types": "3.840.0",
      "@aws-sdk/util-endpoints": "3.840.0",
      "@aws-sdk/util-user-agent-browser": "3.840.0",
      "@aws-sdk/util-user-agent-node": "3.840.0",
      "@smithy/config-resolver": "^4.1.4",
      "@smithy/core": "^3.6.0",
      "@smithy/fetch-http-handler": "^5.0.4",
      "@smithy/hash-node": "^4.0.4",
      "@smithy/invalid-dependency": "^4.0.4",
      "@smithy/middleware-content-length": "^4.0.4",
      "@smithy/middleware-endpoint": "^4.1.13",
      "@smithy/middleware-retry": "^4.1.14",
      "@smithy/middleware-serde": "^4.0.8",
      "@smithy/middleware-stack": "^4.0.4",
      "@smithy/node-config-provider": "^4.1.3",
      "@smithy/node-http-handler": "^4.0.6",
      "@smithy/protocol-http": "^5.1.2",
      "@smithy/smithy-client": "^4.4.5",
      "@smithy/types": "^4.3.1",
      "@smithy/url-parser": "^4.0.4",
      "@smithy/util-base64": "^4.0.0",
      "@smithy/util-body-length-browser": "^4.0.0",
      "@smithy/util-body-length-node": "^4.0.0",
      "@smithy/util-defaults-mode-browser": "^4.0.21",
      "@smithy/util-defaults-mode-node": "^4.0.21",
      "@smithy/util-endpoints": "^3.0.6",
      "@smithy/util-middleware": "^4.0.4",
      "@smithy/util-retry": "^4.0.6",
      "@smithy/util-utf8": "^4.0.0",
      tslib: "^2.6.2"
    },
    devDependencies: {
      "@tsconfig/node18": "18.2.4",
      "@types/node": "^18.19.69",
      concurrently: "7.0.0",
      "downlevel-dts": "0.10.1",
      rimraf: "3.0.2",
      typescript: "~5.8.3"
    },
    engines: {
      node: ">=18.0.0"
    },
    typesVersions: {
      "<4.0": {
        "dist-types/*": ["dist-types/ts3.4/*"]
      }
    },
    files: ["dist-*/**"],
    author: {
      name: "AWS SDK for JavaScript Team",
      url: "https://aws.amazon.com/javascript/"
    },
    license: "Apache-2.0",
    browser: {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
    },
    "react-native": {
      "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
    },
    homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
    repository: {
      type: "git",
      url: "https://github.com/aws/aws-sdk-js-v3.git",
      directory: "clients/client-sso"
    }
  }
})
// @from(Start 2728969, End 2731145)
XHA = z((rz7, r5Q) => {
  var {
    defineProperty: AgA,
    getOwnPropertyDescriptor: __4,
    getOwnPropertyNames: k_4
  } = Object, y_4 = Object.prototype.hasOwnProperty, ehA = (A, Q) => AgA(A, "name", {
    value: Q,
    configurable: !0
  }), x_4 = (A, Q) => {
    for (var B in Q) AgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, v_4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of k_4(Q))
        if (!y_4.call(A, Z) && Z !== B) AgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = __4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, b_4 = (A) => v_4(AgA({}, "__esModule", {
    value: !0
  }), A), l5Q = {};
  x_4(l5Q, {
    NODE_APP_ID_CONFIG_OPTIONS: () => m_4,
    UA_APP_ID_ENV_NAME: () => a5Q,
    UA_APP_ID_INI_NAME: () => s5Q,
    createDefaultUserAgentProvider: () => n5Q,
    crtAvailability: () => i5Q,
    defaultUserAgent: () => h_4
  });
  r5Q.exports = b_4(l5Q);
  var p5Q = UA("os"),
    hw1 = UA("process"),
    i5Q = {
      isCrtAvailable: !1
    },
    f_4 = ehA(() => {
      if (i5Q.isCrtAvailable) return ["md/crt-avail"];
      return null
    }, "isCrtAvailable"),
    n5Q = ehA(({
      serviceId: A,
      clientVersion: Q
    }) => {
      return async (B) => {
        let G = [
            ["aws-sdk-js", Q],
            ["ua", "2.1"],
            [`os/${(0,p5Q.platform)()}`, (0, p5Q.release)()],
            ["lang/js"],
            ["md/nodejs", `${hw1.versions.node}`]
          ],
          Z = f_4();
        if (Z) G.push(Z);
        if (A) G.push([`api/${A}`, Q]);
        if (hw1.env.AWS_EXECUTION_ENV) G.push([`exec-env/${hw1.env.AWS_EXECUTION_ENV}`]);
        let I = await B?.userAgentAppId?.();
        return I ? [...G, [`app/${I}`]] : [...G]
      }
    }, "createDefaultUserAgentProvider"),
    h_4 = n5Q,
    g_4 = r4A(),
    a5Q = "AWS_SDK_UA_APP_ID",
    s5Q = "sdk_ua_app_id",
    u_4 = "sdk-ua-app-id",
    m_4 = {
      environmentVariableSelector: ehA((A) => A[a5Q], "environmentVariableSelector"),
      configFileSelector: ehA((A) => A[s5Q] ?? A[u_4], "configFileSelector"),
      default: g_4.DEFAULT_UA_APP_ID
    }
})
// @from(Start 2731151, End 2732824)
RX = z((oz7, A3Q) => {
  var {
    defineProperty: QgA,
    getOwnPropertyDescriptor: d_4,
    getOwnPropertyNames: c_4
  } = Object, p_4 = Object.prototype.hasOwnProperty, t5Q = (A, Q) => QgA(A, "name", {
    value: Q,
    configurable: !0
  }), l_4 = (A, Q) => {
    for (var B in Q) QgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, i_4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of c_4(Q))
        if (!p_4.call(A, Z) && Z !== B) QgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = d_4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, n_4 = (A) => i_4(QgA({}, "__esModule", {
    value: !0
  }), A), e5Q = {};
  l_4(e5Q, {
    Hash: () => r_4
  });
  A3Q.exports = n_4(e5Q);
  var gw1 = hI(),
    a_4 = O2(),
    s_4 = UA("buffer"),
    o5Q = UA("crypto"),
    r_4 = class {
      static {
        t5Q(this, "Hash")
      }
      constructor(A, Q) {
        this.algorithmIdentifier = A, this.secret = Q, this.reset()
      }
      update(A, Q) {
        this.hash.update((0, a_4.toUint8Array)(uw1(A, Q)))
      }
      digest() {
        return Promise.resolve(this.hash.digest())
      }
      reset() {
        this.hash = this.secret ? (0, o5Q.createHmac)(this.algorithmIdentifier, uw1(this.secret)) : (0, o5Q.createHash)(this.algorithmIdentifier)
      }
    };

  function uw1(A, Q) {
    if (s_4.Buffer.isBuffer(A)) return A;
    if (typeof A === "string") return (0, gw1.fromString)(A, Q);
    if (ArrayBuffer.isView(A)) return (0, gw1.fromArrayBuffer)(A.buffer, A.byteOffset, A.byteLength);
    return (0, gw1.fromArrayBuffer)(A)
  }
  t5Q(uw1, "castSourceData")
})
// @from(Start 2732830, End 2734261)
TX = z((ez7, G3Q) => {
  var {
    defineProperty: BgA,
    getOwnPropertyDescriptor: o_4,
    getOwnPropertyNames: t_4
  } = Object, e_4 = Object.prototype.hasOwnProperty, Ak4 = (A, Q) => BgA(A, "name", {
    value: Q,
    configurable: !0
  }), Qk4 = (A, Q) => {
    for (var B in Q) BgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, Bk4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of t_4(Q))
        if (!e_4.call(A, Z) && Z !== B) BgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = o_4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Gk4 = (A) => Bk4(BgA({}, "__esModule", {
    value: !0
  }), A), B3Q = {};
  Qk4(B3Q, {
    calculateBodyLength: () => Zk4
  });
  G3Q.exports = Gk4(B3Q);
  var Q3Q = UA("fs"),
    Zk4 = Ak4((A) => {
      if (!A) return 0;
      if (typeof A === "string") return Buffer.byteLength(A);
      else if (typeof A.byteLength === "number") return A.byteLength;
      else if (typeof A.size === "number") return A.size;
      else if (typeof A.start === "number" && typeof A.end === "number") return A.end + 1 - A.start;
      else if (typeof A.path === "string" || Buffer.isBuffer(A.path)) return (0, Q3Q.lstatSync)(A.path).size;
      else if (typeof A.fd === "number") return (0, Q3Q.fstatSync)(A.fd).size;
      throw Error(`Body Length computation failed for ${A}`)
    }, "calculateBodyLength")
})
// @from(Start 2734267, End 2738964)
w3Q = z((U3Q) => {
  Object.defineProperty(U3Q, "__esModule", {
    value: !0
  });
  U3Q.ruleSet = void 0;
  var H3Q = "required",
    JL = "fn",
    WL = "argv",
    G8A = "ref",
    Z3Q = !0,
    I3Q = "isSet",
    VHA = "booleanEquals",
    Q8A = "error",
    B8A = "endpoint",
    Ov = "tree",
    mw1 = "PartitionResult",
    dw1 = "getAttr",
    Y3Q = {
      [H3Q]: !1,
      type: "String"
    },
    J3Q = {
      [H3Q]: !0,
      default: !1,
      type: "Boolean"
    },
    W3Q = {
      [G8A]: "Endpoint"
    },
    C3Q = {
      [JL]: VHA,
      [WL]: [{
        [G8A]: "UseFIPS"
      }, !0]
    },
    E3Q = {
      [JL]: VHA,
      [WL]: [{
        [G8A]: "UseDualStack"
      }, !0]
    },
    YL = {},
    X3Q = {
      [JL]: dw1,
      [WL]: [{
        [G8A]: mw1
      }, "supportsFIPS"]
    },
    z3Q = {
      [G8A]: mw1
    },
    V3Q = {
      [JL]: VHA,
      [WL]: [!0, {
        [JL]: dw1,
        [WL]: [z3Q, "supportsDualStack"]
      }]
    },
    F3Q = [C3Q],
    K3Q = [E3Q],
    D3Q = [{
      [G8A]: "Region"
    }],
    Ik4 = {
      version: "1.0",
      parameters: {
        Region: Y3Q,
        UseDualStack: J3Q,
        UseFIPS: J3Q,
        Endpoint: Y3Q
      },
      rules: [{
        conditions: [{
          [JL]: I3Q,
          [WL]: [W3Q]
        }],
        rules: [{
          conditions: F3Q,
          error: "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: Q8A
        }, {
          conditions: K3Q,
          error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: Q8A
        }, {
          endpoint: {
            url: W3Q,
            properties: YL,
            headers: YL
          },
          type: B8A
        }],
        type: Ov
      }, {
        conditions: [{
          [JL]: I3Q,
          [WL]: D3Q
        }],
        rules: [{
          conditions: [{
            [JL]: "aws.partition",
            [WL]: D3Q,
            assign: mw1
          }],
          rules: [{
            conditions: [C3Q, E3Q],
            rules: [{
              conditions: [{
                [JL]: VHA,
                [WL]: [Z3Q, X3Q]
              }, V3Q],
              rules: [{
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: YL,
                  headers: YL
                },
                type: B8A
              }],
              type: Ov
            }, {
              error: "FIPS and DualStack are enabled, but this partition does not support one or both",
              type: Q8A
            }],
            type: Ov
          }, {
            conditions: F3Q,
            rules: [{
              conditions: [{
                [JL]: VHA,
                [WL]: [X3Q, Z3Q]
              }],
              rules: [{
                conditions: [{
                  [JL]: "stringEquals",
                  [WL]: [{
                    [JL]: dw1,
                    [WL]: [z3Q, "name"]
                  }, "aws-us-gov"]
                }],
                endpoint: {
                  url: "https://portal.sso.{Region}.amazonaws.com",
                  properties: YL,
                  headers: YL
                },
                type: B8A
              }, {
                endpoint: {
                  url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                  properties: YL,
                  headers: YL
                },
                type: B8A
              }],
              type: Ov
            }, {
              error: "FIPS is enabled but this partition does not support FIPS",
              type: Q8A
            }],
            type: Ov
          }, {
            conditions: K3Q,
            rules: [{
              conditions: [V3Q],
              rules: [{
                endpoint: {
                  url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                  properties: YL,
                  headers: YL
                },
                type: B8A
              }],
              type: Ov
            }, {
              error: "DualStack is enabled but this partition does not support DualStack",
              type: Q8A
            }],
            type: Ov
          }, {
            endpoint: {
              url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
              properties: YL,
              headers: YL
            },
            type: B8A
          }],
          type: Ov
        }],
        type: Ov
      }, {
        error: "Invalid Configuration: Missing Region",
        type: Q8A
      }]
    };
  U3Q.ruleSet = Ik4
})
// @from(Start 2738970, End 2739534)
L3Q = z((q3Q) => {
  Object.defineProperty(q3Q, "__esModule", {
    value: !0
  });
  q3Q.defaultEndpointResolver = void 0;
  var Yk4 = p4A(),
    cw1 = FI(),
    Jk4 = w3Q(),
    Wk4 = new cw1.EndpointCache({
      size: 50,
      params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
    }),
    Xk4 = (A, Q = {}) => {
      return Wk4.get(A, () => (0, cw1.resolveEndpoint)(Jk4.ruleSet, {
        endpointParams: A,
        logger: Q.logger
      }))
    };
  q3Q.defaultEndpointResolver = Xk4;
  cw1.customEndpointFunctions.aws = Yk4.awsEndpointFunctions
})
// @from(Start 2739540, End 2740949)
P3Q = z((R3Q) => {
  Object.defineProperty(R3Q, "__esModule", {
    value: !0
  });
  R3Q.getRuntimeConfig = void 0;
  var Vk4 = MF(),
    Fk4 = iB(),
    Kk4 = K6(),
    Dk4 = NJ(),
    M3Q = Fd(),
    O3Q = O2(),
    Hk4 = fw1(),
    Ck4 = L3Q(),
    Ek4 = (A) => {
      return {
        apiVersion: "2019-06-10",
        base64Decoder: A?.base64Decoder ?? M3Q.fromBase64,
        base64Encoder: A?.base64Encoder ?? M3Q.toBase64,
        disableHostPrefix: A?.disableHostPrefix ?? !1,
        endpointProvider: A?.endpointProvider ?? Ck4.defaultEndpointResolver,
        extensions: A?.extensions ?? [],
        httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? Hk4.defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: A?.httpAuthSchemes ?? [{
          schemeId: "aws.auth#sigv4",
          identityProvider: (Q) => Q.getIdentityProvider("aws.auth#sigv4"),
          signer: new Vk4.AwsSdkSigV4Signer
        }, {
          schemeId: "smithy.api#noAuth",
          identityProvider: (Q) => Q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
          signer: new Fk4.NoAuthSigner
        }],
        logger: A?.logger ?? new Kk4.NoOpLogger,
        serviceId: A?.serviceId ?? "SSO",
        urlParser: A?.urlParser ?? Dk4.parseUrl,
        utf8Decoder: A?.utf8Decoder ?? O3Q.fromUtf8,
        utf8Encoder: A?.utf8Encoder ?? O3Q.toUtf8
      }
    };
  R3Q.getRuntimeConfig = Ek4
})
// @from(Start 2740955, End 2743993)
PX = z((GU7, x3Q) => {
  var {
    create: zk4,
    defineProperty: FHA,
    getOwnPropertyDescriptor: Uk4,
    getOwnPropertyNames: $k4,
    getPrototypeOf: wk4
  } = Object, qk4 = Object.prototype.hasOwnProperty, pw1 = (A, Q) => FHA(A, "name", {
    value: Q,
    configurable: !0
  }), Nk4 = (A, Q) => {
    for (var B in Q) FHA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, k3Q = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of $k4(Q))
        if (!qk4.call(A, Z) && Z !== B) FHA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = Uk4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, Lk4 = (A, Q, B) => (B = A != null ? zk4(wk4(A)) : {}, k3Q(Q || !A || !A.__esModule ? FHA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), Mk4 = (A) => k3Q(FHA({}, "__esModule", {
    value: !0
  }), A), y3Q = {};
  Nk4(y3Q, {
    resolveDefaultsModeConfig: () => xk4
  });
  x3Q.exports = Mk4(y3Q);
  var Ok4 = f8(),
    j3Q = uI(),
    Rk4 = j2(),
    Tk4 = "AWS_EXECUTION_ENV",
    S3Q = "AWS_REGION",
    _3Q = "AWS_DEFAULT_REGION",
    Pk4 = "AWS_EC2_METADATA_DISABLED",
    jk4 = ["in-region", "cross-region", "mobile", "standard", "legacy"],
    Sk4 = "/latest/meta-data/placement/region",
    _k4 = "AWS_DEFAULTS_MODE",
    kk4 = "defaults_mode",
    yk4 = {
      environmentVariableSelector: (A) => {
        return A[_k4]
      },
      configFileSelector: (A) => {
        return A[kk4]
      },
      default: "legacy"
    },
    xk4 = pw1(({
      region: A = (0, j3Q.loadConfig)(Ok4.NODE_REGION_CONFIG_OPTIONS),
      defaultsMode: Q = (0, j3Q.loadConfig)(yk4)
    } = {}) => (0, Rk4.memoize)(async () => {
      let B = typeof Q === "function" ? await Q() : Q;
      switch (B?.toLowerCase()) {
        case "auto":
          return vk4(A);
        case "in-region":
        case "cross-region":
        case "mobile":
        case "standard":
        case "legacy":
          return Promise.resolve(B?.toLocaleLowerCase());
        case void 0:
          return Promise.resolve("legacy");
        default:
          throw Error(`Invalid parameter for "defaultsMode", expect ${jk4.join(", ")}, got ${B}`)
      }
    }), "resolveDefaultsModeConfig"),
    vk4 = pw1(async (A) => {
      if (A) {
        let Q = typeof A === "function" ? await A() : A,
          B = await bk4();
        if (!B) return "standard";
        if (Q === B) return "in-region";
        else return "cross-region"
      }
      return "standard"
    }, "resolveNodeDefaultsModeAuto"),
    bk4 = pw1(async () => {
      if (process.env[Tk4] && (process.env[S3Q] || process.env[_3Q])) return process.env[S3Q] ?? process.env[_3Q];
      if (!process.env[Pk4]) try {
        let {
          getInstanceMetadataEndpoint: A,
          httpRequest: Q
        } = await Promise.resolve().then(() => Lk4(OV())), B = await A();
        return (await Q({
          ...B,
          path: Sk4
        })).toString()
      } catch (A) {}
    }, "inferPhysicalRegion")
})
// @from(Start 2743999, End 2746298)
m3Q = z((g3Q) => {
  Object.defineProperty(g3Q, "__esModule", {
    value: !0
  });
  g3Q.getRuntimeConfig = void 0;
  var fk4 = yr(),
    hk4 = fk4.__importDefault(c5Q()),
    v3Q = MF(),
    b3Q = XHA(),
    GgA = f8(),
    gk4 = RX(),
    f3Q = D6(),
    dr = uI(),
    h3Q = IZ(),
    uk4 = TX(),
    mk4 = KW(),
    dk4 = P3Q(),
    ck4 = K6(),
    pk4 = PX(),
    lk4 = K6(),
    ik4 = (A) => {
      (0, lk4.emitWarningIfUnsupportedVersion)(process.version);
      let Q = (0, pk4.resolveDefaultsModeConfig)(A),
        B = () => Q().then(ck4.loadConfigsForDefaultMode),
        G = (0, dk4.getRuntimeConfig)(A);
      (0, v3Q.emitWarningIfUnsupportedVersion)(process.version);
      let Z = {
        profile: A?.profile,
        logger: G.logger
      };
      return {
        ...G,
        ...A,
        runtime: "node",
        defaultsMode: Q,
        authSchemePreference: A?.authSchemePreference ?? (0, dr.loadConfig)(v3Q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Z),
        bodyLengthChecker: A?.bodyLengthChecker ?? uk4.calculateBodyLength,
        defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, b3Q.createDefaultUserAgentProvider)({
          serviceId: G.serviceId,
          clientVersion: hk4.default.version
        }),
        maxAttempts: A?.maxAttempts ?? (0, dr.loadConfig)(f3Q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
        region: A?.region ?? (0, dr.loadConfig)(GgA.NODE_REGION_CONFIG_OPTIONS, {
          ...GgA.NODE_REGION_CONFIG_FILE_OPTIONS,
          ...Z
        }),
        requestHandler: h3Q.NodeHttpHandler.create(A?.requestHandler ?? B),
        retryMode: A?.retryMode ?? (0, dr.loadConfig)({
          ...f3Q.NODE_RETRY_MODE_CONFIG_OPTIONS,
          default: async () => (await B()).retryMode || mk4.DEFAULT_RETRY_MODE
        }, A),
        sha256: A?.sha256 ?? gk4.Hash.bind(null, "sha256"),
        streamCollector: A?.streamCollector ?? h3Q.streamCollector,
        useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, dr.loadConfig)(GgA.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Z),
        useFipsEndpoint: A?.useFipsEndpoint ?? (0, dr.loadConfig)(GgA.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Z),
        userAgentAppId: A?.userAgentAppId ?? (0, dr.loadConfig)(b3Q.NODE_APP_ID_CONFIG_OPTIONS, Z)
      }
    };
  g3Q.getRuntimeConfig = ik4
})
// @from(Start 2746304, End 2748907)
KHA = z((IU7, n3Q) => {
  var {
    defineProperty: ZgA,
    getOwnPropertyDescriptor: nk4,
    getOwnPropertyNames: ak4
  } = Object, sk4 = Object.prototype.hasOwnProperty, MS = (A, Q) => ZgA(A, "name", {
    value: Q,
    configurable: !0
  }), rk4 = (A, Q) => {
    for (var B in Q) ZgA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, ok4 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of ak4(Q))
        if (!sk4.call(A, Z) && Z !== B) ZgA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = nk4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, tk4 = (A) => ok4(ZgA({}, "__esModule", {
    value: !0
  }), A), c3Q = {};
  rk4(c3Q, {
    NODE_REGION_CONFIG_FILE_OPTIONS: () => By4,
    NODE_REGION_CONFIG_OPTIONS: () => Qy4,
    REGION_ENV_NAME: () => p3Q,
    REGION_INI_NAME: () => l3Q,
    getAwsRegionExtensionConfiguration: () => ek4,
    resolveAwsRegionExtensionConfiguration: () => Ay4,
    resolveRegionConfig: () => Gy4
  });
  n3Q.exports = tk4(c3Q);
  var ek4 = MS((A) => {
      return {
        setRegion(Q) {
          A.region = Q
        },
        region() {
          return A.region
        }
      }
    }, "getAwsRegionExtensionConfiguration"),
    Ay4 = MS((A) => {
      return {
        region: A.region()
      }
    }, "resolveAwsRegionExtensionConfiguration"),
    p3Q = "AWS_REGION",
    l3Q = "region",
    Qy4 = {
      environmentVariableSelector: MS((A) => A[p3Q], "environmentVariableSelector"),
      configFileSelector: MS((A) => A[l3Q], "configFileSelector"),
      default: MS(() => {
        throw Error("Region is missing")
      }, "default")
    },
    By4 = {
      preferredFile: "credentials"
    },
    i3Q = MS((A) => typeof A === "string" && (A.startsWith("fips-") || A.endsWith("-fips")), "isFipsRegion"),
    d3Q = MS((A) => i3Q(A) ? ["fips-aws-global", "aws-fips"].includes(A) ? "us-east-1" : A.replace(/fips-(dkr-|prod-)?|-fips/, "") : A, "getRealRegion"),
    Gy4 = MS((A) => {
      let {
        region: Q,
        useFipsEndpoint: B
      } = A;
      if (!Q) throw Error("Region is missing");
      return Object.assign(A, {
        region: MS(async () => {
          if (typeof Q === "string") return d3Q(Q);
          let G = await Q();
          return d3Q(G)
        }, "region"),
        useFipsEndpoint: MS(async () => {
          let G = typeof Q === "string" ? Q : await Q();
          if (i3Q(G)) return !0;
          return typeof B !== "function" ? Promise.resolve(!!B) : B()
        }, "useFipsEndpoint")
      })
    }, "resolveRegionConfig")
})