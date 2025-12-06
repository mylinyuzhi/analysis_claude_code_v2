
// @from(Start 10071947, End 10074524)
function PQ0({
  isDisabled: A = !1,
  visibleOptionCount: Q = 5,
  options: B,
  defaultValue: G = [],
  onCancel: Z,
  onChange: I,
  onFocus: Y,
  focusValue: J,
  submitButtonText: W,
  onSubmit: X
}) {
  let V = qY2({
      isDisabled: A,
      visibleOptionCount: Q,
      options: B,
      defaultValue: G,
      onChange: I,
      onCancel: Z,
      onFocus: Y,
      focusValue: J,
      submitButtonText: W,
      onSubmit: X
    }),
    F = B.length.toString().length;
  return QC.default.createElement(S, {
    flexDirection: "column"
  }, QC.default.createElement(S, {
    flexDirection: "column"
  }, V.visibleOptions.map((K, D) => {
    let H = V.focusedValue === K.value && !V.isSubmitFocused,
      C = V.selectedValues.includes(K.value),
      E = K.index === V.visibleFromIndex,
      U = K.index === V.visibleToIndex - 1,
      q = V.visibleToIndex < B.length,
      w = V.visibleFromIndex > 0,
      N = V.visibleFromIndex + D + 1;
    if (K.type === "input") {
      let R = V.inputValues.get(K.value) || "";
      return QC.default.createElement(S, {
        key: String(K.value),
        gap: 1
      }, QC.default.createElement(GGA, {
        option: K,
        isFocused: H,
        isSelected: !1,
        shouldShowDownArrow: q && U,
        shouldShowUpArrow: w && E,
        maxIndexWidth: F,
        index: N,
        inputValue: R,
        onInputChange: (T) => {
          V.updateInputValue(K.value, T)
        },
        onSubmit: () => {},
        onExit: () => {
          Z()
        },
        layout: "compact"
      }, QC.default.createElement($, {
        color: C ? "success" : void 0
      }, "[", C ? H1.tick : " ", "]", " ")))
    }
    return QC.default.createElement(S, {
      key: String(K.value),
      gap: 1
    }, QC.default.createElement(Xp, {
      isFocused: H,
      isSelected: !1,
      shouldShowDownArrow: q && U,
      shouldShowUpArrow: w && E,
      description: K.description
    }, QC.default.createElement($, null, tA.dim(`${N}.`.padEnd(F))), QC.default.createElement($, {
      color: C ? "success" : void 0
    }, "[", C ? H1.tick : " ", "]"), QC.default.createElement($, {
      color: H ? "suggestion" : void 0
    }, K.label)))
  })), W && X && QC.default.createElement(S, {
    marginTop: 0,
    gap: 1
  }, V.isSubmitFocused ? QC.default.createElement($, {
    color: "suggestion"
  }, H1.pointer) : QC.default.createElement($, null, " "), QC.default.createElement(S, {
    marginLeft: 3
  }, QC.default.createElement($, {
    color: V.isSubmitFocused ? "suggestion" : void 0,
    bold: !0
  }, W))))
}
// @from(Start 10074529, End 10074531)
QC
// @from(Start 10074537, End 10074625)
LY2 = L(() => {
  F9();
  V9();
  hA();
  Tm1();
  MsA();
  NY2();
  QC = BA(VA(), 1)
})
// @from(Start 10074631, End 10074664)
J5 = L(() => {
  S5();
  LY2()
})
// @from(Start 10074695, End 10077739)
class jQ0 {
  localServer;
  port = 0;
  promiseResolver = null;
  promiseRejecter = null;
  expectedState = null;
  pendingResponse = null;
  callbackPath;
  constructor(A = "/callback") {
    this.localServer = MY2.createServer(), this.callbackPath = A
  }
  async start(A) {
    return new Promise((Q, B) => {
      this.localServer.once("error", (G) => {
        B(Error(`Failed to start OAuth callback server: ${G.message}`))
      }), this.localServer.listen(A ?? 0, "localhost", () => {
        let G = this.localServer.address();
        this.port = G.port, Q(this.port)
      })
    })
  }
  getPort() {
    return this.port
  }
  hasPendingResponse() {
    return this.pendingResponse !== null
  }
  async waitForAuthorization(A, Q) {
    return new Promise((B, G) => {
      this.promiseResolver = B, this.promiseRejecter = G, this.expectedState = A, this.startLocalListener(Q)
    })
  }
  handleSuccessRedirect(A, Q) {
    if (!this.pendingResponse) return;
    if (Q) {
      Q(this.pendingResponse, A), this.pendingResponse = null, GA("tengu_oauth_automatic_redirect", {
        custom_handler: !0
      });
      return
    }
    let B = wv(A) ? e9().CLAUDEAI_SUCCESS_URL : e9().CONSOLE_SUCCESS_URL;
    this.pendingResponse.writeHead(302, {
      Location: B
    }), this.pendingResponse.end(), this.pendingResponse = null, GA("tengu_oauth_automatic_redirect", {})
  }
  handleErrorRedirect() {
    if (!this.pendingResponse) return;
    let A = e9().CLAUDEAI_SUCCESS_URL;
    this.pendingResponse.writeHead(302, {
      Location: A
    }), this.pendingResponse.end(), this.pendingResponse = null, GA("tengu_oauth_automatic_redirect_error", {})
  }
  startLocalListener(A) {
    this.localServer.on("request", this.handleRedirect.bind(this)), this.localServer.on("error", this.handleError.bind(this)), A()
  }
  handleRedirect(A, Q) {
    let B = new URL(A.url || "", `http://${A.headers.host||"localhost"}`);
    if (B.pathname !== this.callbackPath) {
      Q.writeHead(404), Q.end();
      return
    }
    let G = B.searchParams.get("code") ?? void 0,
      Z = B.searchParams.get("state") ?? void 0;
    this.validateAndRespond(G, Z, Q)
  }
  validateAndRespond(A, Q, B) {
    if (!A) {
      B.writeHead(400), B.end("Authorization code not found"), this.reject(Error("No authorization code received"));
      return
    }
    if (Q !== this.expectedState) {
      B.writeHead(400), B.end("Invalid state parameter"), this.reject(Error("Invalid state parameter"));
      return
    }
    this.pendingResponse = B, this.resolve(A)
  }
  handleError(A) {
    AA(A), this.close(), this.reject(A)
  }
  resolve(A) {
    if (this.promiseResolver) this.promiseResolver(A), this.promiseResolver = null, this.promiseRejecter = null
  }
  reject(A) {
    if (this.promiseRejecter) this.promiseRejecter(A), this.promiseResolver = null, this.promiseRejecter = null
  }
  close() {
    if (this.pendingResponse) this.handleErrorRedirect();
    if (this.localServer) this.localServer.removeAllListeners(), this.localServer.close()
  }
}
// @from(Start 10077744, End 10077793)
OY2 = L(() => {
  NX();
  g1();
  q0();
  AL()
})
// @from(Start 10077827, End 10077934)
function SQ0(A) {
  return A.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}
// @from(Start 10077936, End 10077988)
function RY2() {
  return SQ0(aMA.randomBytes(32))
}
// @from(Start 10077990, End 10078083)
function TY2(A) {
  let Q = aMA.createHash("sha256");
  return Q.update(A), SQ0(Q.digest())
}
// @from(Start 10078085, End 10078137)
function PY2() {
  return SQ0(aMA.randomBytes(32))
}
// @from(Start 10078142, End 10078156)
jY2 = () => {}
// @from(Start 10078158, End 10078491)
async function bYA() {
  try {
    let A = DI();
    if (A.error) return g(`Failed to get auth headers: ${A.error}`), null;
    return (await YQ.get(`${e9().BASE_API_URL}/api/oauth/account/settings`, {
      headers: {
        ...A.headers,
        "User-Agent": TV()
      }
    })).data
  } catch (A) {
    return AA(A), null
  }
}
// @from(Start 10078492, End 10078764)
async function _Q0() {
  try {
    let A = DI();
    if (A.error) return;
    await YQ.post(`${e9().BASE_API_URL}/api/oauth/account/grove_notice_viewed`, {}, {
      headers: {
        ...A.headers,
        "User-Agent": TV()
      }
    })
  } catch (A) {
    AA(A)
  }
}
// @from(Start 10078765, End 10079120)
async function i91(A) {
  try {
    let Q = DI();
    if (Q.error) {
      g(`Failed to get auth headers: ${Q.error}`);
      return
    }
    await YQ.patch(`${e9().BASE_API_URL}/api/oauth/account/settings`, {
      grove_enabled: A
    }, {
      headers: {
        ...Q.headers,
        "User-Agent": TV()
      }
    })
  } catch (Q) {
    AA(Q)
  }
}
// @from(Start 10079121, End 10079231)
async function fYA() {
  if (!OiA()) return !1;
  let A = await yi();
  return A !== null && A.grove_enabled
}
// @from(Start 10079236, End 10079238)
yi
// @from(Start 10079244, End 10080046)
hYA = L(() => {
  O3();
  AE();
  g1();
  NX();
  V0();
  gB();
  l2();
  yi = s1(async () => {
    try {
      let A = DI();
      if (A.error) return g(`Failed to get auth headers: ${A.error}`), null;
      let Q = await YQ.get(`${e9().BASE_API_URL}/api/claude_code_grove`, {
          headers: {
            ...A.headers,
            "User-Agent": fc()
          }
        }),
        {
          grove_enabled: B,
          domain_excluded: G,
          notice_is_grace_period: Z,
          notice_reminder_frequency: I
        } = Q.data;
      return {
        grove_enabled: B,
        domain_excluded: G ?? !1,
        notice_is_grace_period: Z ?? !0,
        notice_reminder_frequency: I
      }
    } catch (A) {
      return g(`Failed to fetch Grove notice config: ${A}`), null
    }
  })
})
// @from(Start 10080052, End 10080346)
n91 = z((SY2) => {
  Object.defineProperty(SY2, "__esModule", {
    value: !0
  });
  SY2.AggregationTemporality = void 0;
  var rH5;
  (function(A) {
    A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE"
  })(rH5 = SY2.AggregationTemporality || (SY2.AggregationTemporality = {}))
})
// @from(Start 10080352, End 10081064)
xi = z((kY2) => {
  Object.defineProperty(kY2, "__esModule", {
    value: !0
  });
  kY2.DataPointType = kY2.InstrumentType = void 0;
  var oH5;
  (function(A) {
    A.COUNTER = "COUNTER", A.GAUGE = "GAUGE", A.HISTOGRAM = "HISTOGRAM", A.UP_DOWN_COUNTER = "UP_DOWN_COUNTER", A.OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER", A.OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE", A.OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER"
  })(oH5 = kY2.InstrumentType || (kY2.InstrumentType = {}));
  var tH5;
  (function(A) {
    A[A.HISTOGRAM = 0] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 1] = "EXPONENTIAL_HISTOGRAM", A[A.GAUGE = 2] = "GAUGE", A[A.SUM = 3] = "SUM"
  })(tH5 = kY2.DataPointType || (kY2.DataPointType = {}))
})
// @from(Start 10081070, End 10083359)
FP = z((yY2) => {
  Object.defineProperty(yY2, "__esModule", {
    value: !0
  });
  yY2.equalsCaseInsensitive = yY2.binarySearchUB = yY2.setEquals = yY2.FlatMap = yY2.isPromiseAllSettledRejectionResult = yY2.PromiseAllSettled = yY2.callWithTimeout = yY2.TimeoutError = yY2.instrumentationScopeId = yY2.hashAttributes = yY2.isNotNullish = void 0;

  function eH5(A) {
    return A !== void 0 && A !== null
  }
  yY2.isNotNullish = eH5;

  function AC5(A) {
    let Q = Object.keys(A);
    if (Q.length === 0) return "";
    return Q = Q.sort(), JSON.stringify(Q.map((B) => [B, A[B]]))
  }
  yY2.hashAttributes = AC5;

  function QC5(A) {
    return `${A.name}:${A.version??""}:${A.schemaUrl??""}`
  }
  yY2.instrumentationScopeId = QC5;
  class a91 extends Error {
    constructor(A) {
      super(A);
      Object.setPrototypeOf(this, a91.prototype)
    }
  }
  yY2.TimeoutError = a91;

  function BC5(A, Q) {
    let B, G = new Promise(function(I, Y) {
      B = setTimeout(function() {
        Y(new a91("Operation timed out."))
      }, Q)
    });
    return Promise.race([A, G]).then((Z) => {
      return clearTimeout(B), Z
    }, (Z) => {
      throw clearTimeout(B), Z
    })
  }
  yY2.callWithTimeout = BC5;
  async function GC5(A) {
    return Promise.all(A.map(async (Q) => {
      try {
        return {
          status: "fulfilled",
          value: await Q
        }
      } catch (B) {
        return {
          status: "rejected",
          reason: B
        }
      }
    }))
  }
  yY2.PromiseAllSettled = GC5;

  function ZC5(A) {
    return A.status === "rejected"
  }
  yY2.isPromiseAllSettledRejectionResult = ZC5;

  function IC5(A, Q) {
    let B = [];
    return A.forEach((G) => {
      B.push(...Q(G))
    }), B
  }
  yY2.FlatMap = IC5;

  function YC5(A, Q) {
    if (A.size !== Q.size) return !1;
    for (let B of A)
      if (!Q.has(B)) return !1;
    return !0
  }
  yY2.setEquals = YC5;

  function JC5(A, Q) {
    let B = 0,
      G = A.length - 1,
      Z = A.length;
    while (G >= B) {
      let I = B + Math.trunc((G - B) / 2);
      if (A[I] < Q) B = I + 1;
      else Z = I, G = I - 1
    }
    return Z
  }
  yY2.binarySearchUB = JC5;

  function WC5(A, Q) {
    return A.toLowerCase() === Q.toLowerCase()
  }
  yY2.equalsCaseInsensitive = WC5
})
// @from(Start 10083365, End 10083747)
gYA = z((vY2) => {
  Object.defineProperty(vY2, "__esModule", {
    value: !0
  });
  vY2.AggregatorKind = void 0;
  var $C5;
  (function(A) {
    A[A.DROP = 0] = "DROP", A[A.SUM = 1] = "SUM", A[A.LAST_VALUE = 2] = "LAST_VALUE", A[A.HISTOGRAM = 3] = "HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 4] = "EXPONENTIAL_HISTOGRAM"
  })($C5 = vY2.AggregatorKind || (vY2.AggregatorKind = {}))
})
// @from(Start 10083753, End 10084139)
gY2 = z((fY2) => {
  Object.defineProperty(fY2, "__esModule", {
    value: !0
  });
  fY2.DropAggregator = void 0;
  var wC5 = gYA();
  class bY2 {
    kind = wC5.AggregatorKind.DROP;
    createAccumulation() {
      return
    }
    merge(A, Q) {
      return
    }
    diff(A, Q) {
      return
    }
    toMetricData(A, Q, B, G) {
      return
    }
  }
  fY2.DropAggregator = bY2
})
// @from(Start 10084145, End 10087851)
cY2 = z((mY2) => {
  Object.defineProperty(mY2, "__esModule", {
    value: !0
  });
  mY2.HistogramAggregator = mY2.HistogramAccumulation = void 0;
  var qC5 = gYA(),
    sMA = xi(),
    NC5 = FP();

  function LC5(A) {
    let Q = A.map(() => 0);
    return Q.push(0), {
      buckets: {
        boundaries: A,
        counts: Q
      },
      sum: 0,
      count: 0,
      hasMinMax: !1,
      min: 1 / 0,
      max: -1 / 0
    }
  }
  class rMA {
    startTime;
    _boundaries;
    _recordMinMax;
    _current;
    constructor(A, Q, B = !0, G = LC5(Q)) {
      this.startTime = A, this._boundaries = Q, this._recordMinMax = B, this._current = G
    }
    record(A) {
      if (Number.isNaN(A)) return;
      if (this._current.count += 1, this._current.sum += A, this._recordMinMax) this._current.min = Math.min(A, this._current.min), this._current.max = Math.max(A, this._current.max), this._current.hasMinMax = !0;
      let Q = (0, NC5.binarySearchUB)(this._boundaries, A);
      this._current.buckets.counts[Q] += 1
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return this._current
    }
  }
  mY2.HistogramAccumulation = rMA;
  class uY2 {
    _boundaries;
    _recordMinMax;
    kind = qC5.AggregatorKind.HISTOGRAM;
    constructor(A, Q) {
      this._boundaries = A, this._recordMinMax = Q
    }
    createAccumulation(A) {
      return new rMA(A, this._boundaries, this._recordMinMax)
    }
    merge(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue(),
        Z = B.buckets.counts,
        I = G.buckets.counts,
        Y = Array(Z.length);
      for (let X = 0; X < Z.length; X++) Y[X] = Z[X] + I[X];
      let J = 1 / 0,
        W = -1 / 0;
      if (this._recordMinMax) {
        if (B.hasMinMax && G.hasMinMax) J = Math.min(B.min, G.min), W = Math.max(B.max, G.max);
        else if (B.hasMinMax) J = B.min, W = B.max;
        else if (G.hasMinMax) J = G.min, W = G.max
      }
      return new rMA(A.startTime, B.buckets.boundaries, this._recordMinMax, {
        buckets: {
          boundaries: B.buckets.boundaries,
          counts: Y
        },
        count: B.count + G.count,
        sum: B.sum + G.sum,
        hasMinMax: this._recordMinMax && (B.hasMinMax || G.hasMinMax),
        min: J,
        max: W
      })
    }
    diff(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue(),
        Z = B.buckets.counts,
        I = G.buckets.counts,
        Y = Array(Z.length);
      for (let J = 0; J < Z.length; J++) Y[J] = I[J] - Z[J];
      return new rMA(Q.startTime, B.buckets.boundaries, this._recordMinMax, {
        buckets: {
          boundaries: B.buckets.boundaries,
          counts: Y
        },
        count: G.count - B.count,
        sum: G.sum - B.sum,
        hasMinMax: !1,
        min: 1 / 0,
        max: -1 / 0
      })
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: sMA.DataPointType.HISTOGRAM,
        dataPoints: B.map(([Z, I]) => {
          let Y = I.toPointValue(),
            J = A.type === sMA.InstrumentType.GAUGE || A.type === sMA.InstrumentType.UP_DOWN_COUNTER || A.type === sMA.InstrumentType.OBSERVABLE_GAUGE || A.type === sMA.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
          return {
            attributes: Z,
            startTime: I.startTime,
            endTime: G,
            value: {
              min: Y.hasMinMax ? Y.min : void 0,
              max: Y.hasMinMax ? Y.max : void 0,
              sum: !J ? Y.sum : void 0,
              buckets: Y.buckets,
              count: Y.count
            }
          }
        })
      }
    }
  }
  mY2.HistogramAggregator = uY2
})
// @from(Start 10087857, End 10091298)
iY2 = z((pY2) => {
  Object.defineProperty(pY2, "__esModule", {
    value: !0
  });
  pY2.Buckets = void 0;
  class vQ0 {
    backing;
    indexBase;
    indexStart;
    indexEnd;
    constructor(A = new bQ0, Q = 0, B = 0, G = 0) {
      this.backing = A, this.indexBase = Q, this.indexStart = B, this.indexEnd = G
    }
    get offset() {
      return this.indexStart
    }
    get length() {
      if (this.backing.length === 0) return 0;
      if (this.indexEnd === this.indexStart && this.at(0) === 0) return 0;
      return this.indexEnd - this.indexStart + 1
    }
    counts() {
      return Array.from({
        length: this.length
      }, (A, Q) => this.at(Q))
    }
    at(A) {
      let Q = this.indexBase - this.indexStart;
      if (A < Q) A += this.backing.length;
      return A -= Q, this.backing.countAt(A)
    }
    incrementBucket(A, Q) {
      this.backing.increment(A, Q)
    }
    decrementBucket(A, Q) {
      this.backing.decrement(A, Q)
    }
    trim() {
      for (let A = 0; A < this.length; A++)
        if (this.at(A) !== 0) {
          this.indexStart += A;
          break
        } else if (A === this.length - 1) {
        this.indexStart = this.indexEnd = this.indexBase = 0;
        return
      }
      for (let A = this.length - 1; A >= 0; A--)
        if (this.at(A) !== 0) {
          this.indexEnd -= this.length - A - 1;
          break
        } this._rotate()
    }
    downscale(A) {
      this._rotate();
      let Q = 1 + this.indexEnd - this.indexStart,
        B = 1 << A,
        G = 0,
        Z = 0;
      for (let I = this.indexStart; I <= this.indexEnd;) {
        let Y = I % B;
        if (Y < 0) Y += B;
        for (let J = Y; J < B && G < Q; J++) this._relocateBucket(Z, G), G++, I++;
        Z++
      }
      this.indexStart >>= A, this.indexEnd >>= A, this.indexBase = this.indexStart
    }
    clone() {
      return new vQ0(this.backing.clone(), this.indexBase, this.indexStart, this.indexEnd)
    }
    _rotate() {
      let A = this.indexBase - this.indexStart;
      if (A === 0) return;
      else if (A > 0) this.backing.reverse(0, this.backing.length), this.backing.reverse(0, A), this.backing.reverse(A, this.backing.length);
      else this.backing.reverse(0, this.backing.length), this.backing.reverse(0, this.backing.length + A);
      this.indexBase = this.indexStart
    }
    _relocateBucket(A, Q) {
      if (A === Q) return;
      this.incrementBucket(A, this.backing.emptyBucket(Q))
    }
  }
  pY2.Buckets = vQ0;
  class bQ0 {
    _counts;
    constructor(A = [0]) {
      this._counts = A
    }
    get length() {
      return this._counts.length
    }
    countAt(A) {
      return this._counts[A]
    }
    growTo(A, Q, B) {
      let G = Array(A).fill(0);
      G.splice(B, this._counts.length - Q, ...this._counts.slice(Q)), G.splice(0, Q, ...this._counts.slice(0, Q)), this._counts = G
    }
    reverse(A, Q) {
      let B = Math.floor((A + Q) / 2) - A;
      for (let G = 0; G < B; G++) {
        let Z = this._counts[A + G];
        this._counts[A + G] = this._counts[Q - G - 1], this._counts[Q - G - 1] = Z
      }
    }
    emptyBucket(A) {
      let Q = this._counts[A];
      return this._counts[A] = 0, Q
    }
    increment(A, Q) {
      this._counts[A] += Q
    }
    decrement(A, Q) {
      if (this._counts[A] >= Q) this._counts[A] -= Q;
      else this._counts[A] = 0
    }
    clone() {
      return new bQ0([...this._counts])
    }
  }
})
// @from(Start 10091304, End 10092118)
hQ0 = z((nY2) => {
  Object.defineProperty(nY2, "__esModule", {
    value: !0
  });
  nY2.getSignificand = nY2.getNormalBase2 = nY2.MIN_VALUE = nY2.MAX_NORMAL_EXPONENT = nY2.MIN_NORMAL_EXPONENT = nY2.SIGNIFICAND_WIDTH = void 0;
  nY2.SIGNIFICAND_WIDTH = 52;
  var OC5 = 2146435072,
    RC5 = 1048575,
    fQ0 = 1023;
  nY2.MIN_NORMAL_EXPONENT = -fQ0 + 1;
  nY2.MAX_NORMAL_EXPONENT = fQ0;
  nY2.MIN_VALUE = Math.pow(2, -1022);

  function TC5(A) {
    let Q = new DataView(new ArrayBuffer(8));
    return Q.setFloat64(0, A), ((Q.getUint32(0) & OC5) >> 20) - fQ0
  }
  nY2.getNormalBase2 = TC5;

  function PC5(A) {
    let Q = new DataView(new ArrayBuffer(8));
    Q.setFloat64(0, A);
    let B = Q.getUint32(0),
      G = Q.getUint32(4);
    return (B & RC5) * Math.pow(2, 32) + G
  }
  nY2.getSignificand = PC5
})
// @from(Start 10092124, End 10092591)
s91 = z((sY2) => {
  Object.defineProperty(sY2, "__esModule", {
    value: !0
  });
  sY2.nextGreaterSquare = sY2.ldexp = void 0;

  function xC5(A, Q) {
    if (A === 0 || A === Number.POSITIVE_INFINITY || A === Number.NEGATIVE_INFINITY || Number.isNaN(A)) return A;
    return A * Math.pow(2, Q)
  }
  sY2.ldexp = xC5;

  function vC5(A) {
    return A--, A |= A >> 1, A |= A >> 2, A |= A >> 4, A |= A >> 8, A |= A >> 16, A++, A
  }
  sY2.nextGreaterSquare = vC5
})
// @from(Start 10092597, End 10092766)
r91 = z((tY2) => {
  Object.defineProperty(tY2, "__esModule", {
    value: !0
  });
  tY2.MappingError = void 0;
  class oY2 extends Error {}
  tY2.MappingError = oY2
})
// @from(Start 10092772, End 10094074)
ZJ2 = z((BJ2) => {
  Object.defineProperty(BJ2, "__esModule", {
    value: !0
  });
  BJ2.ExponentMapping = void 0;
  var uYA = hQ0(),
    fC5 = s91(),
    AJ2 = r91();
  class QJ2 {
    _shift;
    constructor(A) {
      this._shift = -A
    }
    mapToIndex(A) {
      if (A < uYA.MIN_VALUE) return this._minNormalLowerBoundaryIndex();
      let Q = uYA.getNormalBase2(A),
        B = this._rightShift(uYA.getSignificand(A) - 1, uYA.SIGNIFICAND_WIDTH);
      return Q + B >> this._shift
    }
    lowerBoundary(A) {
      let Q = this._minNormalLowerBoundaryIndex();
      if (A < Q) throw new AJ2.MappingError(`underflow: ${A} is < minimum lower boundary: ${Q}`);
      let B = this._maxNormalLowerBoundaryIndex();
      if (A > B) throw new AJ2.MappingError(`overflow: ${A} is > maximum lower boundary: ${B}`);
      return fC5.ldexp(1, A << this._shift)
    }
    get scale() {
      if (this._shift === 0) return 0;
      return -this._shift
    }
    _minNormalLowerBoundaryIndex() {
      let A = uYA.MIN_NORMAL_EXPONENT >> this._shift;
      if (this._shift < 2) A--;
      return A
    }
    _maxNormalLowerBoundaryIndex() {
      return uYA.MAX_NORMAL_EXPONENT >> this._shift
    }
    _rightShift(A, Q) {
      return Math.floor(A * Math.pow(2, -Q))
    }
  }
  BJ2.ExponentMapping = QJ2
})
// @from(Start 10094080, End 10095721)
VJ2 = z((WJ2) => {
  Object.defineProperty(WJ2, "__esModule", {
    value: !0
  });
  WJ2.LogarithmMapping = void 0;
  var mYA = hQ0(),
    IJ2 = s91(),
    YJ2 = r91();
  class JJ2 {
    _scale;
    _scaleFactor;
    _inverseFactor;
    constructor(A) {
      this._scale = A, this._scaleFactor = IJ2.ldexp(Math.LOG2E, A), this._inverseFactor = IJ2.ldexp(Math.LN2, -A)
    }
    mapToIndex(A) {
      if (A <= mYA.MIN_VALUE) return this._minNormalLowerBoundaryIndex() - 1;
      if (mYA.getSignificand(A) === 0) return (mYA.getNormalBase2(A) << this._scale) - 1;
      let Q = Math.floor(Math.log(A) * this._scaleFactor),
        B = this._maxNormalLowerBoundaryIndex();
      if (Q >= B) return B;
      return Q
    }
    lowerBoundary(A) {
      let Q = this._maxNormalLowerBoundaryIndex();
      if (A >= Q) {
        if (A === Q) return 2 * Math.exp((A - (1 << this._scale)) / this._scaleFactor);
        throw new YJ2.MappingError(`overflow: ${A} is > maximum lower boundary: ${Q}`)
      }
      let B = this._minNormalLowerBoundaryIndex();
      if (A <= B) {
        if (A === B) return mYA.MIN_VALUE;
        else if (A === B - 1) return Math.exp((A + (1 << this._scale)) / this._scaleFactor) / 2;
        throw new YJ2.MappingError(`overflow: ${A} is < minimum lower boundary: ${B}`)
      }
      return Math.exp(A * this._inverseFactor)
    }
    get scale() {
      return this._scale
    }
    _minNormalLowerBoundaryIndex() {
      return mYA.MIN_NORMAL_EXPONENT << this._scale
    }
    _maxNormalLowerBoundaryIndex() {
      return (mYA.MAX_NORMAL_EXPONENT + 1 << this._scale) - 1
    }
  }
  WJ2.LogarithmMapping = JJ2
})
// @from(Start 10095727, End 10096272)
CJ2 = z((DJ2) => {
  Object.defineProperty(DJ2, "__esModule", {
    value: !0
  });
  DJ2.getMapping = void 0;
  var hC5 = ZJ2(),
    gC5 = VJ2(),
    uC5 = r91(),
    FJ2 = -10,
    KJ2 = 20,
    mC5 = Array.from({
      length: 31
    }, (A, Q) => {
      if (Q > 10) return new gC5.LogarithmMapping(Q - 10);
      return new hC5.ExponentMapping(Q - 10)
    });

  function dC5(A) {
    if (A > KJ2 || A < FJ2) throw new uC5.MappingError(`expected scale >= ${FJ2} && <= ${KJ2}, got: ${A}`);
    return mC5[A + 10]
  }
  DJ2.getMapping = dC5
})
// @from(Start 10096278, End 10104497)
qJ2 = z(($J2) => {
  Object.defineProperty($J2, "__esModule", {
    value: !0
  });
  $J2.ExponentialHistogramAggregator = $J2.ExponentialHistogramAccumulation = void 0;
  var cC5 = gYA(),
    oMA = xi(),
    pC5 = K9(),
    EJ2 = iY2(),
    zJ2 = CJ2(),
    lC5 = s91();
  class dYA {
    low;
    high;
    static combine(A, Q) {
      return new dYA(Math.min(A.low, Q.low), Math.max(A.high, Q.high))
    }
    constructor(A, Q) {
      this.low = A, this.high = Q
    }
  }
  var iC5 = 20,
    nC5 = 160,
    gQ0 = 2;
  class o91 {
    startTime;
    _maxSize;
    _recordMinMax;
    _sum;
    _count;
    _zeroCount;
    _min;
    _max;
    _positive;
    _negative;
    _mapping;
    constructor(A, Q = nC5, B = !0, G = 0, Z = 0, I = 0, Y = Number.POSITIVE_INFINITY, J = Number.NEGATIVE_INFINITY, W = new EJ2.Buckets, X = new EJ2.Buckets, V = (0, zJ2.getMapping)(iC5)) {
      if (this.startTime = A, this._maxSize = Q, this._recordMinMax = B, this._sum = G, this._count = Z, this._zeroCount = I, this._min = Y, this._max = J, this._positive = W, this._negative = X, this._mapping = V, this._maxSize < gQ0) pC5.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize},                 changing to the minimum size of: ${gQ0}`), this._maxSize = gQ0
    }
    record(A) {
      this.updateByIncrement(A, 1)
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return {
        hasMinMax: this._recordMinMax,
        min: this.min,
        max: this.max,
        sum: this.sum,
        positive: {
          offset: this.positive.offset,
          bucketCounts: this.positive.counts()
        },
        negative: {
          offset: this.negative.offset,
          bucketCounts: this.negative.counts()
        },
        count: this.count,
        scale: this.scale,
        zeroCount: this.zeroCount
      }
    }
    get sum() {
      return this._sum
    }
    get min() {
      return this._min
    }
    get max() {
      return this._max
    }
    get count() {
      return this._count
    }
    get zeroCount() {
      return this._zeroCount
    }
    get scale() {
      if (this._count === this._zeroCount) return 0;
      return this._mapping.scale
    }
    get positive() {
      return this._positive
    }
    get negative() {
      return this._negative
    }
    updateByIncrement(A, Q) {
      if (Number.isNaN(A)) return;
      if (A > this._max) this._max = A;
      if (A < this._min) this._min = A;
      if (this._count += Q, A === 0) {
        this._zeroCount += Q;
        return
      }
      if (this._sum += A * Q, A > 0) this._updateBuckets(this._positive, A, Q);
      else this._updateBuckets(this._negative, -A, Q)
    }
    merge(A) {
      if (this._count === 0) this._min = A.min, this._max = A.max;
      else if (A.count !== 0) {
        if (A.min < this.min) this._min = A.min;
        if (A.max > this.max) this._max = A.max
      }
      this.startTime = A.startTime, this._sum += A.sum, this._count += A.count, this._zeroCount += A.zeroCount;
      let Q = this._minScale(A);
      this._downscale(this.scale - Q), this._mergeBuckets(this.positive, A, A.positive, Q), this._mergeBuckets(this.negative, A, A.negative, Q)
    }
    diff(A) {
      this._min = 1 / 0, this._max = -1 / 0, this._sum -= A.sum, this._count -= A.count, this._zeroCount -= A.zeroCount;
      let Q = this._minScale(A);
      this._downscale(this.scale - Q), this._diffBuckets(this.positive, A, A.positive, Q), this._diffBuckets(this.negative, A, A.negative, Q)
    }
    clone() {
      return new o91(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping)
    }
    _updateBuckets(A, Q, B) {
      let G = this._mapping.mapToIndex(Q),
        Z = !1,
        I = 0,
        Y = 0;
      if (A.length === 0) A.indexStart = G, A.indexEnd = A.indexStart, A.indexBase = A.indexStart;
      else if (G < A.indexStart && A.indexEnd - G >= this._maxSize) Z = !0, Y = G, I = A.indexEnd;
      else if (G > A.indexEnd && G - A.indexStart >= this._maxSize) Z = !0, Y = A.indexStart, I = G;
      if (Z) {
        let J = this._changeScale(I, Y);
        this._downscale(J), G = this._mapping.mapToIndex(Q)
      }
      this._incrementIndexBy(A, G, B)
    }
    _incrementIndexBy(A, Q, B) {
      if (B === 0) return;
      if (A.length === 0) A.indexStart = A.indexEnd = A.indexBase = Q;
      if (Q < A.indexStart) {
        let Z = A.indexEnd - Q;
        if (Z >= A.backing.length) this._grow(A, Z + 1);
        A.indexStart = Q
      } else if (Q > A.indexEnd) {
        let Z = Q - A.indexStart;
        if (Z >= A.backing.length) this._grow(A, Z + 1);
        A.indexEnd = Q
      }
      let G = Q - A.indexBase;
      if (G < 0) G += A.backing.length;
      A.incrementBucket(G, B)
    }
    _grow(A, Q) {
      let B = A.backing.length,
        G = A.indexBase - A.indexStart,
        Z = B - G,
        I = (0, lC5.nextGreaterSquare)(Q);
      if (I > this._maxSize) I = this._maxSize;
      let Y = I - G;
      A.backing.growTo(I, Z, Y)
    }
    _changeScale(A, Q) {
      let B = 0;
      while (A - Q >= this._maxSize) A >>= 1, Q >>= 1, B++;
      return B
    }
    _downscale(A) {
      if (A === 0) return;
      if (A < 0) throw Error(`impossible change of scale: ${this.scale}`);
      let Q = this._mapping.scale - A;
      this._positive.downscale(A), this._negative.downscale(A), this._mapping = (0, zJ2.getMapping)(Q)
    }
    _minScale(A) {
      let Q = Math.min(this.scale, A.scale),
        B = dYA.combine(this._highLowAtScale(this.positive, this.scale, Q), this._highLowAtScale(A.positive, A.scale, Q)),
        G = dYA.combine(this._highLowAtScale(this.negative, this.scale, Q), this._highLowAtScale(A.negative, A.scale, Q));
      return Math.min(Q - this._changeScale(B.high, B.low), Q - this._changeScale(G.high, G.low))
    }
    _highLowAtScale(A, Q, B) {
      if (A.length === 0) return new dYA(0, -1);
      let G = Q - B;
      return new dYA(A.indexStart >> G, A.indexEnd >> G)
    }
    _mergeBuckets(A, Q, B, G) {
      let Z = B.offset,
        I = Q.scale - G;
      for (let Y = 0; Y < B.length; Y++) this._incrementIndexBy(A, Z + Y >> I, B.at(Y))
    }
    _diffBuckets(A, Q, B, G) {
      let Z = B.offset,
        I = Q.scale - G;
      for (let Y = 0; Y < B.length; Y++) {
        let W = (Z + Y >> I) - A.indexBase;
        if (W < 0) W += A.backing.length;
        A.decrementBucket(W, B.at(Y))
      }
      A.trim()
    }
  }
  $J2.ExponentialHistogramAccumulation = o91;
  class UJ2 {
    _maxSize;
    _recordMinMax;
    kind = cC5.AggregatorKind.EXPONENTIAL_HISTOGRAM;
    constructor(A, Q) {
      this._maxSize = A, this._recordMinMax = Q
    }
    createAccumulation(A) {
      return new o91(A, this._maxSize, this._recordMinMax)
    }
    merge(A, Q) {
      let B = Q.clone();
      return B.merge(A), B
    }
    diff(A, Q) {
      let B = Q.clone();
      return B.diff(A), B
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: oMA.DataPointType.EXPONENTIAL_HISTOGRAM,
        dataPoints: B.map(([Z, I]) => {
          let Y = I.toPointValue(),
            J = A.type === oMA.InstrumentType.GAUGE || A.type === oMA.InstrumentType.UP_DOWN_COUNTER || A.type === oMA.InstrumentType.OBSERVABLE_GAUGE || A.type === oMA.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
          return {
            attributes: Z,
            startTime: I.startTime,
            endTime: G,
            value: {
              min: Y.hasMinMax ? Y.min : void 0,
              max: Y.hasMinMax ? Y.max : void 0,
              sum: !J ? Y.sum : void 0,
              positive: {
                offset: Y.positive.offset,
                bucketCounts: Y.positive.bucketCounts
              },
              negative: {
                offset: Y.negative.offset,
                bucketCounts: Y.negative.bucketCounts
              },
              count: Y.count,
              scale: Y.scale,
              zeroCount: Y.zeroCount
            }
          }
        })
      }
    }
  }
  $J2.ExponentialHistogramAggregator = UJ2
})
// @from(Start 10104503, End 10106049)
OJ2 = z((LJ2) => {
  Object.defineProperty(LJ2, "__esModule", {
    value: !0
  });
  LJ2.LastValueAggregator = LJ2.LastValueAccumulation = void 0;
  var sC5 = gYA(),
    tMA = e6(),
    rC5 = xi();
  class eMA {
    startTime;
    _current;
    sampleTime;
    constructor(A, Q = 0, B = [0, 0]) {
      this.startTime = A, this._current = Q, this.sampleTime = B
    }
    record(A) {
      this._current = A, this.sampleTime = (0, tMA.millisToHrTime)(Date.now())
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return this._current
    }
  }
  LJ2.LastValueAccumulation = eMA;
  class NJ2 {
    kind = sC5.AggregatorKind.LAST_VALUE;
    createAccumulation(A) {
      return new eMA(A)
    }
    merge(A, Q) {
      let B = (0, tMA.hrTimeToMicroseconds)(Q.sampleTime) >= (0, tMA.hrTimeToMicroseconds)(A.sampleTime) ? Q : A;
      return new eMA(A.startTime, B.toPointValue(), B.sampleTime)
    }
    diff(A, Q) {
      let B = (0, tMA.hrTimeToMicroseconds)(Q.sampleTime) >= (0, tMA.hrTimeToMicroseconds)(A.sampleTime) ? Q : A;
      return new eMA(Q.startTime, B.toPointValue(), B.sampleTime)
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: rC5.DataPointType.GAUGE,
        dataPoints: B.map(([Z, I]) => {
          return {
            attributes: Z,
            startTime: I.startTime,
            endTime: G,
            value: I.toPointValue()
          }
        })
      }
    }
  }
  LJ2.LastValueAggregator = NJ2
})
// @from(Start 10106055, End 10107726)
jJ2 = z((TJ2) => {
  Object.defineProperty(TJ2, "__esModule", {
    value: !0
  });
  TJ2.SumAggregator = TJ2.SumAccumulation = void 0;
  var tC5 = gYA(),
    eC5 = xi();
  class g1A {
    startTime;
    monotonic;
    _current;
    reset;
    constructor(A, Q, B = 0, G = !1) {
      this.startTime = A, this.monotonic = Q, this._current = B, this.reset = G
    }
    record(A) {
      if (this.monotonic && A < 0) return;
      this._current += A
    }
    setStartTime(A) {
      this.startTime = A
    }
    toPointValue() {
      return this._current
    }
  }
  TJ2.SumAccumulation = g1A;
  class RJ2 {
    monotonic;
    kind = tC5.AggregatorKind.SUM;
    constructor(A) {
      this.monotonic = A
    }
    createAccumulation(A) {
      return new g1A(A, this.monotonic)
    }
    merge(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue();
      if (Q.reset) return new g1A(Q.startTime, this.monotonic, G, Q.reset);
      return new g1A(A.startTime, this.monotonic, B + G)
    }
    diff(A, Q) {
      let B = A.toPointValue(),
        G = Q.toPointValue();
      if (this.monotonic && B > G) return new g1A(Q.startTime, this.monotonic, G, !0);
      return new g1A(Q.startTime, this.monotonic, G - B)
    }
    toMetricData(A, Q, B, G) {
      return {
        descriptor: A,
        aggregationTemporality: Q,
        dataPointType: eC5.DataPointType.SUM,
        dataPoints: B.map(([Z, I]) => {
          return {
            attributes: Z,
            startTime: I.startTime,
            endTime: G,
            value: I.toPointValue()
          }
        }),
        isMonotonic: this.monotonic
      }
    }
  }
  TJ2.SumAggregator = RJ2
})
// @from(Start 10107732, End 10109480)
xJ2 = z((KP) => {
  Object.defineProperty(KP, "__esModule", {
    value: !0
  });
  KP.SumAggregator = KP.SumAccumulation = KP.LastValueAggregator = KP.LastValueAccumulation = KP.ExponentialHistogramAggregator = KP.ExponentialHistogramAccumulation = KP.HistogramAggregator = KP.HistogramAccumulation = KP.DropAggregator = void 0;
  var QE5 = gY2();
  Object.defineProperty(KP, "DropAggregator", {
    enumerable: !0,
    get: function() {
      return QE5.DropAggregator
    }
  });
  var SJ2 = cY2();
  Object.defineProperty(KP, "HistogramAccumulation", {
    enumerable: !0,
    get: function() {
      return SJ2.HistogramAccumulation
    }
  });
  Object.defineProperty(KP, "HistogramAggregator", {
    enumerable: !0,
    get: function() {
      return SJ2.HistogramAggregator
    }
  });
  var _J2 = qJ2();
  Object.defineProperty(KP, "ExponentialHistogramAccumulation", {
    enumerable: !0,
    get: function() {
      return _J2.ExponentialHistogramAccumulation
    }
  });
  Object.defineProperty(KP, "ExponentialHistogramAggregator", {
    enumerable: !0,
    get: function() {
      return _J2.ExponentialHistogramAggregator
    }
  });
  var kJ2 = OJ2();
  Object.defineProperty(KP, "LastValueAccumulation", {
    enumerable: !0,
    get: function() {
      return kJ2.LastValueAccumulation
    }
  });
  Object.defineProperty(KP, "LastValueAggregator", {
    enumerable: !0,
    get: function() {
      return kJ2.LastValueAggregator
    }
  });
  var yJ2 = jJ2();
  Object.defineProperty(KP, "SumAccumulation", {
    enumerable: !0,
    get: function() {
      return yJ2.SumAccumulation
    }
  });
  Object.defineProperty(KP, "SumAggregator", {
    enumerable: !0,
    get: function() {
      return yJ2.SumAggregator
    }
  })
})
// @from(Start 10109486, End 10113105)
mJ2 = z((vJ2) => {
  Object.defineProperty(vJ2, "__esModule", {
    value: !0
  });
  vJ2.DEFAULT_AGGREGATION = vJ2.EXPONENTIAL_HISTOGRAM_AGGREGATION = vJ2.HISTOGRAM_AGGREGATION = vJ2.LAST_VALUE_AGGREGATION = vJ2.SUM_AGGREGATION = vJ2.DROP_AGGREGATION = vJ2.DefaultAggregation = vJ2.ExponentialHistogramAggregation = vJ2.ExplicitBucketHistogramAggregation = vJ2.HistogramAggregation = vJ2.LastValueAggregation = vJ2.SumAggregation = vJ2.DropAggregation = void 0;
  var GE5 = K9(),
    u1A = xJ2(),
    ak = xi();
  class t91 {
    static DEFAULT_INSTANCE = new u1A.DropAggregator;
    createAggregator(A) {
      return t91.DEFAULT_INSTANCE
    }
  }
  vJ2.DropAggregation = t91;
  class AOA {
    static MONOTONIC_INSTANCE = new u1A.SumAggregator(!0);
    static NON_MONOTONIC_INSTANCE = new u1A.SumAggregator(!1);
    createAggregator(A) {
      switch (A.type) {
        case ak.InstrumentType.COUNTER:
        case ak.InstrumentType.OBSERVABLE_COUNTER:
        case ak.InstrumentType.HISTOGRAM:
          return AOA.MONOTONIC_INSTANCE;
        default:
          return AOA.NON_MONOTONIC_INSTANCE
      }
    }
  }
  vJ2.SumAggregation = AOA;
  class e91 {
    static DEFAULT_INSTANCE = new u1A.LastValueAggregator;
    createAggregator(A) {
      return e91.DEFAULT_INSTANCE
    }
  }
  vJ2.LastValueAggregation = e91;
  class A41 {
    static DEFAULT_INSTANCE = new u1A.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 1e4], !0);
    createAggregator(A) {
      return A41.DEFAULT_INSTANCE
    }
  }
  vJ2.HistogramAggregation = A41;
  class uQ0 {
    _recordMinMax;
    _boundaries;
    constructor(A, Q = !0) {
      if (this._recordMinMax = Q, A == null) throw Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
      A = A.concat(), A = A.sort((Z, I) => Z - I);
      let B = A.lastIndexOf(-1 / 0),
        G = A.indexOf(1 / 0);
      if (G === -1) G = void 0;
      this._boundaries = A.slice(B + 1, G)
    }
    createAggregator(A) {
      return new u1A.HistogramAggregator(this._boundaries, this._recordMinMax)
    }
  }
  vJ2.ExplicitBucketHistogramAggregation = uQ0;
  class mQ0 {
    _maxSize;
    _recordMinMax;
    constructor(A = 160, Q = !0) {
      this._maxSize = A, this._recordMinMax = Q
    }
    createAggregator(A) {
      return new u1A.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax)
    }
  }
  vJ2.ExponentialHistogramAggregation = mQ0;
  class dQ0 {
    _resolve(A) {
      switch (A.type) {
        case ak.InstrumentType.COUNTER:
        case ak.InstrumentType.UP_DOWN_COUNTER:
        case ak.InstrumentType.OBSERVABLE_COUNTER:
        case ak.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
          return vJ2.SUM_AGGREGATION;
        case ak.InstrumentType.GAUGE:
        case ak.InstrumentType.OBSERVABLE_GAUGE:
          return vJ2.LAST_VALUE_AGGREGATION;
        case ak.InstrumentType.HISTOGRAM: {
          if (A.advice.explicitBucketBoundaries) return new uQ0(A.advice.explicitBucketBoundaries);
          return vJ2.HISTOGRAM_AGGREGATION
        }
      }
      return GE5.diag.warn(`Unable to recognize instrument type: ${A.type}`), vJ2.DROP_AGGREGATION
    }
    createAggregator(A) {
      return this._resolve(A).createAggregator(A)
    }
  }
  vJ2.DefaultAggregation = dQ0;
  vJ2.DROP_AGGREGATION = new t91;
  vJ2.SUM_AGGREGATION = new AOA;
  vJ2.LAST_VALUE_AGGREGATION = new e91;
  vJ2.HISTOGRAM_AGGREGATION = new A41;
  vJ2.EXPONENTIAL_HISTOGRAM_AGGREGATION = new mQ0;
  vJ2.DEFAULT_AGGREGATION = new dQ0
})
// @from(Start 10113111, End 10114399)
QOA = z((cJ2) => {
  Object.defineProperty(cJ2, "__esModule", {
    value: !0
  });
  cJ2.toAggregation = cJ2.AggregationType = void 0;
  var m1A = mJ2(),
    d1A;
  (function(A) {
    A[A.DEFAULT = 0] = "DEFAULT", A[A.DROP = 1] = "DROP", A[A.SUM = 2] = "SUM", A[A.LAST_VALUE = 3] = "LAST_VALUE", A[A.EXPLICIT_BUCKET_HISTOGRAM = 4] = "EXPLICIT_BUCKET_HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 5] = "EXPONENTIAL_HISTOGRAM"
  })(d1A = cJ2.AggregationType || (cJ2.AggregationType = {}));

  function KE5(A) {
    switch (A.type) {
      case d1A.DEFAULT:
        return m1A.DEFAULT_AGGREGATION;
      case d1A.DROP:
        return m1A.DROP_AGGREGATION;
      case d1A.SUM:
        return m1A.SUM_AGGREGATION;
      case d1A.LAST_VALUE:
        return m1A.LAST_VALUE_AGGREGATION;
      case d1A.EXPONENTIAL_HISTOGRAM: {
        let Q = A;
        return new m1A.ExponentialHistogramAggregation(Q.options?.maxSize, Q.options?.recordMinMax)
      }
      case d1A.EXPLICIT_BUCKET_HISTOGRAM: {
        let Q = A;
        if (Q.options == null) return m1A.HISTOGRAM_AGGREGATION;
        else return new m1A.ExplicitBucketHistogramAggregation(Q.options?.boundaries, Q.options?.recordMinMax)
      }
      default:
        throw Error("Unsupported Aggregation")
    }
  }
  cJ2.toAggregation = KE5
})
// @from(Start 10114405, End 10114863)
cQ0 = z((lJ2) => {
  Object.defineProperty(lJ2, "__esModule", {
    value: !0
  });
  lJ2.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = lJ2.DEFAULT_AGGREGATION_SELECTOR = void 0;
  var DE5 = n91(),
    HE5 = QOA(),
    CE5 = (A) => {
      return {
        type: HE5.AggregationType.DEFAULT
      }
    };
  lJ2.DEFAULT_AGGREGATION_SELECTOR = CE5;
  var EE5 = (A) => DE5.AggregationTemporality.CUMULATIVE;
  lJ2.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = EE5
})
// @from(Start 10114869, End 10117469)
pQ0 = z((rJ2) => {
  Object.defineProperty(rJ2, "__esModule", {
    value: !0
  });
  rJ2.MetricReader = void 0;
  var nJ2 = K9(),
    Q41 = FP(),
    aJ2 = cQ0();
  class sJ2 {
    _shutdown = !1;
    _metricProducers;
    _sdkMetricProducer;
    _aggregationTemporalitySelector;
    _aggregationSelector;
    _cardinalitySelector;
    constructor(A) {
      this._aggregationSelector = A?.aggregationSelector ?? aJ2.DEFAULT_AGGREGATION_SELECTOR, this._aggregationTemporalitySelector = A?.aggregationTemporalitySelector ?? aJ2.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR, this._metricProducers = A?.metricProducers ?? [], this._cardinalitySelector = A?.cardinalitySelector
    }
    setMetricProducer(A) {
      if (this._sdkMetricProducer) throw Error("MetricReader can not be bound to a MeterProvider again.");
      this._sdkMetricProducer = A, this.onInitialized()
    }
    selectAggregation(A) {
      return this._aggregationSelector(A)
    }
    selectAggregationTemporality(A) {
      return this._aggregationTemporalitySelector(A)
    }
    selectCardinalityLimit(A) {
      return this._cardinalitySelector ? this._cardinalitySelector(A) : 2000
    }
    onInitialized() {}
    async collect(A) {
      if (this._sdkMetricProducer === void 0) throw Error("MetricReader is not bound to a MetricProducer");
      if (this._shutdown) throw Error("MetricReader is shutdown");
      let [Q, ...B] = await Promise.all([this._sdkMetricProducer.collect({
        timeoutMillis: A?.timeoutMillis
      }), ...this._metricProducers.map((Y) => Y.collect({
        timeoutMillis: A?.timeoutMillis
      }))]), G = Q.errors.concat((0, Q41.FlatMap)(B, (Y) => Y.errors)), Z = Q.resourceMetrics.resource, I = Q.resourceMetrics.scopeMetrics.concat((0, Q41.FlatMap)(B, (Y) => Y.resourceMetrics.scopeMetrics));
      return {
        resourceMetrics: {
          resource: Z,
          scopeMetrics: I
        },
        errors: G
      }
    }
    async shutdown(A) {
      if (this._shutdown) {
        nJ2.diag.error("Cannot call shutdown twice.");
        return
      }
      if (A?.timeoutMillis == null) await this.onShutdown();
      else await (0, Q41.callWithTimeout)(this.onShutdown(), A.timeoutMillis);
      this._shutdown = !0
    }
    async forceFlush(A) {
      if (this._shutdown) {
        nJ2.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
        return
      }
      if (A?.timeoutMillis == null) {
        await this.onForceFlush();
        return
      }
      await (0, Q41.callWithTimeout)(this.onForceFlush(), A.timeoutMillis)
    }
  }
  rJ2.MetricReader = sJ2
})
// @from(Start 10117475, End 10120260)
BW2 = z((AW2) => {
  Object.defineProperty(AW2, "__esModule", {
    value: !0
  });
  AW2.PeriodicExportingMetricReader = void 0;
  var lQ0 = K9(),
    BOA = e6(),
    UE5 = pQ0(),
    tJ2 = FP();
  class eJ2 extends UE5.MetricReader {
    _interval;
    _exporter;
    _exportInterval;
    _exportTimeout;
    constructor(A) {
      super({
        aggregationSelector: A.exporter.selectAggregation?.bind(A.exporter),
        aggregationTemporalitySelector: A.exporter.selectAggregationTemporality?.bind(A.exporter),
        metricProducers: A.metricProducers
      });
      if (A.exportIntervalMillis !== void 0 && A.exportIntervalMillis <= 0) throw Error("exportIntervalMillis must be greater than 0");
      if (A.exportTimeoutMillis !== void 0 && A.exportTimeoutMillis <= 0) throw Error("exportTimeoutMillis must be greater than 0");
      if (A.exportTimeoutMillis !== void 0 && A.exportIntervalMillis !== void 0 && A.exportIntervalMillis < A.exportTimeoutMillis) throw Error("exportIntervalMillis must be greater than or equal to exportTimeoutMillis");
      this._exportInterval = A.exportIntervalMillis ?? 60000, this._exportTimeout = A.exportTimeoutMillis ?? 30000, this._exporter = A.exporter
    }
    async _runOnce() {
      try {
        await (0, tJ2.callWithTimeout)(this._doRun(), this._exportTimeout)
      } catch (A) {
        if (A instanceof tJ2.TimeoutError) {
          lQ0.diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
          return
        }(0, BOA.globalErrorHandler)(A)
      }
    }
    async _doRun() {
      let {
        resourceMetrics: A,
        errors: Q
      } = await this.collect({
        timeoutMillis: this._exportTimeout
      });
      if (Q.length > 0) lQ0.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...Q);
      if (A.resource.asyncAttributesPending) try {
        await A.resource.waitForAsyncAttributes?.()
      } catch (G) {
        lQ0.diag.debug("Error while resolving async portion of resource: ", G), (0, BOA.globalErrorHandler)(G)
      }
      if (A.scopeMetrics.length === 0) return;
      let B = await BOA.internal._export(this._exporter, A);
      if (B.code !== BOA.ExportResultCode.SUCCESS) throw Error(`PeriodicExportingMetricReader: metrics export failed (error ${B.error})`)
    }
    onInitialized() {
      this._interval = setInterval(() => {
        this._runOnce()
      }, this._exportInterval), (0, BOA.unrefTimer)(this._interval)
    }
    async onForceFlush() {
      await this._runOnce(), await this._exporter.forceFlush()
    }
    async onShutdown() {
      if (this._interval) clearInterval(this._interval);
      await this.onForceFlush(), await this._exporter.shutdown()
    }
  }
  AW2.PeriodicExportingMetricReader = eJ2
})
// @from(Start 10120266, End 10121182)
JW2 = z((IW2) => {
  Object.defineProperty(IW2, "__esModule", {
    value: !0
  });
  IW2.InMemoryMetricExporter = void 0;
  var GW2 = e6();
  class ZW2 {
    _shutdown = !1;
    _aggregationTemporality;
    _metrics = [];
    constructor(A) {
      this._aggregationTemporality = A
    }
    export (A, Q) {
      if (this._shutdown) {
        setTimeout(() => Q({
          code: GW2.ExportResultCode.FAILED
        }), 0);
        return
      }
      this._metrics.push(A), setTimeout(() => Q({
        code: GW2.ExportResultCode.SUCCESS
      }), 0)
    }
    getMetrics() {
      return this._metrics
    }
    forceFlush() {
      return Promise.resolve()
    }
    reset() {
      this._metrics = []
    }
    selectAggregationTemporality(A) {
      return this._aggregationTemporality
    }
    shutdown() {
      return this._shutdown = !0, Promise.resolve()
    }
  }
  IW2.InMemoryMetricExporter = ZW2
})
// @from(Start 10121188, End 10122332)
FW2 = z((XW2) => {
  Object.defineProperty(XW2, "__esModule", {
    value: !0
  });
  XW2.ConsoleMetricExporter = void 0;
  var WW2 = e6(),
    $E5 = cQ0();
  class iQ0 {
    _shutdown = !1;
    _temporalitySelector;
    constructor(A) {
      this._temporalitySelector = A?.temporalitySelector ?? $E5.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR
    }
    export (A, Q) {
      if (this._shutdown) {
        setImmediate(Q, {
          code: WW2.ExportResultCode.FAILED
        });
        return
      }
      return iQ0._sendMetrics(A, Q)
    }
    forceFlush() {
      return Promise.resolve()
    }
    selectAggregationTemporality(A) {
      return this._temporalitySelector(A)
    }
    shutdown() {
      return this._shutdown = !0, Promise.resolve()
    }
    static _sendMetrics(A, Q) {
      for (let B of A.scopeMetrics)
        for (let G of B.metrics) console.dir({
          descriptor: G.descriptor,
          dataPointType: G.dataPointType,
          dataPoints: G.dataPoints
        }, {
          depth: null
        });
      Q({
        code: WW2.ExportResultCode.SUCCESS
      })
    }
  }
  XW2.ConsoleMetricExporter = iQ0
})
// @from(Start 10122338, End 10123156)
CW2 = z((DW2) => {
  Object.defineProperty(DW2, "__esModule", {
    value: !0
  });
  DW2.ViewRegistry = void 0;
  class KW2 {
    _registeredViews = [];
    addView(A) {
      this._registeredViews.push(A)
    }
    findViews(A, Q) {
      return this._registeredViews.filter((G) => {
        return this._matchInstrument(G.instrumentSelector, A) && this._matchMeter(G.meterSelector, Q)
      })
    }
    _matchInstrument(A, Q) {
      return (A.getType() === void 0 || Q.type === A.getType()) && A.getNameFilter().match(Q.name) && A.getUnitFilter().match(Q.unit)
    }
    _matchMeter(A, Q) {
      return A.getNameFilter().match(Q.name) && (Q.version === void 0 || A.getVersionFilter().match(Q.version)) && (Q.schemaUrl === void 0 || A.getSchemaUrlFilter().match(Q.schemaUrl))
    }
  }
  DW2.ViewRegistry = KW2
})
// @from(Start 10123162, End 10124434)
GOA = z((UW2) => {
  Object.defineProperty(UW2, "__esModule", {
    value: !0
  });
  UW2.isValidName = UW2.isDescriptorCompatibleWith = UW2.createInstrumentDescriptorWithView = UW2.createInstrumentDescriptor = void 0;
  var EW2 = K9(),
    wE5 = FP();

  function qE5(A, Q, B) {
    if (!zW2(A)) EW2.diag.warn(`Invalid metric name: "${A}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
    return {
      name: A,
      type: Q,
      description: B?.description ?? "",
      unit: B?.unit ?? "",
      valueType: B?.valueType ?? EW2.ValueType.DOUBLE,
      advice: B?.advice ?? {}
    }
  }
  UW2.createInstrumentDescriptor = qE5;

  function NE5(A, Q) {
    return {
      name: A.name ?? Q.name,
      description: A.description ?? Q.description,
      type: Q.type,
      unit: Q.unit,
      valueType: Q.valueType,
      advice: Q.advice
    }
  }
  UW2.createInstrumentDescriptorWithView = NE5;

  function LE5(A, Q) {
    return (0, wE5.equalsCaseInsensitive)(A.name, Q.name) && A.unit === Q.unit && A.type === Q.type && A.valueType === Q.valueType
  }
  UW2.isDescriptorCompatibleWith = LE5;
  var ME5 = /^[a-z][a-z0-9_.\-/]{0,254}$/i;

  function zW2(A) {
    return A.match(ME5) != null
  }
  UW2.isValidName = zW2
})
// @from(Start 10124440, End 10127046)
B41 = z((TW2) => {
  Object.defineProperty(TW2, "__esModule", {
    value: !0
  });
  TW2.isObservableInstrument = TW2.ObservableUpDownCounterInstrument = TW2.ObservableGaugeInstrument = TW2.ObservableCounterInstrument = TW2.ObservableInstrument = TW2.HistogramInstrument = TW2.GaugeInstrument = TW2.CounterInstrument = TW2.UpDownCounterInstrument = TW2.SyncInstrument = void 0;
  var cYA = K9(),
    PE5 = e6();
  class pYA {
    _writableMetricStorage;
    _descriptor;
    constructor(A, Q) {
      this._writableMetricStorage = A, this._descriptor = Q
    }
    _record(A, Q = {}, B = cYA.context.active()) {
      if (typeof A !== "number") {
        cYA.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${A}`);
        return
      }
      if (this._descriptor.valueType === cYA.ValueType.INT && !Number.isInteger(A)) {
        if (cYA.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
      }
      this._writableMetricStorage.record(A, Q, B, (0, PE5.millisToHrTime)(Date.now()))
    }
  }
  TW2.SyncInstrument = pYA;
  class wW2 extends pYA {
    add(A, Q, B) {
      this._record(A, Q, B)
    }
  }
  TW2.UpDownCounterInstrument = wW2;
  class qW2 extends pYA {
    add(A, Q, B) {
      if (A < 0) {
        cYA.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${A}`);
        return
      }
      this._record(A, Q, B)
    }
  }
  TW2.CounterInstrument = qW2;
  class NW2 extends pYA {
    record(A, Q, B) {
      this._record(A, Q, B)
    }
  }
  TW2.GaugeInstrument = NW2;
  class LW2 extends pYA {
    record(A, Q, B) {
      if (A < 0) {
        cYA.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${A}`);
        return
      }
      this._record(A, Q, B)
    }
  }
  TW2.HistogramInstrument = LW2;
  class lYA {
    _observableRegistry;
    _metricStorages;
    _descriptor;
    constructor(A, Q, B) {
      this._observableRegistry = B, this._descriptor = A, this._metricStorages = Q
    }
    addCallback(A) {
      this._observableRegistry.addCallback(A, this)
    }
    removeCallback(A) {
      this._observableRegistry.removeCallback(A, this)
    }
  }
  TW2.ObservableInstrument = lYA;
  class MW2 extends lYA {}
  TW2.ObservableCounterInstrument = MW2;
  class OW2 extends lYA {}
  TW2.ObservableGaugeInstrument = OW2;
  class RW2 extends lYA {}
  TW2.ObservableUpDownCounterInstrument = RW2;

  function jE5(A) {
    return A instanceof lYA
  }
  TW2.isObservableInstrument = jE5
})
// @from(Start 10127052, End 10129401)
kW2 = z((SW2) => {
  Object.defineProperty(SW2, "__esModule", {
    value: !0
  });
  SW2.Meter = void 0;
  var c1A = GOA(),
    p1A = B41(),
    l1A = xi();
  class jW2 {
    _meterSharedState;
    constructor(A) {
      this._meterSharedState = A
    }
    createGauge(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.GAUGE, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new p1A.GaugeInstrument(G, B)
    }
    createHistogram(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.HISTOGRAM, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new p1A.HistogramInstrument(G, B)
    }
    createCounter(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.COUNTER, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new p1A.CounterInstrument(G, B)
    }
    createUpDownCounter(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.UP_DOWN_COUNTER, Q),
        G = this._meterSharedState.registerMetricStorage(B);
      return new p1A.UpDownCounterInstrument(G, B)
    }
    createObservableGauge(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.OBSERVABLE_GAUGE, Q),
        G = this._meterSharedState.registerAsyncMetricStorage(B);
      return new p1A.ObservableGaugeInstrument(B, G, this._meterSharedState.observableRegistry)
    }
    createObservableCounter(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.OBSERVABLE_COUNTER, Q),
        G = this._meterSharedState.registerAsyncMetricStorage(B);
      return new p1A.ObservableCounterInstrument(B, G, this._meterSharedState.observableRegistry)
    }
    createObservableUpDownCounter(A, Q) {
      let B = (0, c1A.createInstrumentDescriptor)(A, l1A.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, Q),
        G = this._meterSharedState.registerAsyncMetricStorage(B);
      return new p1A.ObservableUpDownCounterInstrument(B, G, this._meterSharedState.observableRegistry)
    }
    addBatchObservableCallback(A, Q) {
      this._meterSharedState.observableRegistry.addBatchCallback(A, Q)
    }
    removeBatchObservableCallback(A, Q) {
      this._meterSharedState.observableRegistry.removeBatchCallback(A, Q)
    }
  }
  SW2.Meter = jW2
})
// @from(Start 10129407, End 10130114)
nQ0 = z((xW2) => {
  Object.defineProperty(xW2, "__esModule", {
    value: !0
  });
  xW2.MetricStorage = void 0;
  var gE5 = GOA();
  class yW2 {
    _instrumentDescriptor;
    constructor(A) {
      this._instrumentDescriptor = A
    }
    getInstrumentDescriptor() {
      return this._instrumentDescriptor
    }
    updateDescription(A) {
      this._instrumentDescriptor = (0, gE5.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
        description: A,
        valueType: this._instrumentDescriptor.valueType,
        unit: this._instrumentDescriptor.unit,
        advice: this._instrumentDescriptor.advice
      })
    }
  }
  xW2.MetricStorage = yW2
})
// @from(Start 10130120, End 10131451)
ZOA = z((fW2) => {
  Object.defineProperty(fW2, "__esModule", {
    value: !0
  });
  fW2.AttributeHashMap = fW2.HashMap = void 0;
  var uE5 = FP();
  class aQ0 {
    _hash;
    _valueMap = new Map;
    _keyMap = new Map;
    constructor(A) {
      this._hash = A
    }
    get(A, Q) {
      return Q ??= this._hash(A), this._valueMap.get(Q)
    }
    getOrDefault(A, Q) {
      let B = this._hash(A);
      if (this._valueMap.has(B)) return this._valueMap.get(B);
      let G = Q();
      if (!this._keyMap.has(B)) this._keyMap.set(B, A);
      return this._valueMap.set(B, G), G
    }
    set(A, Q, B) {
      if (B ??= this._hash(A), !this._keyMap.has(B)) this._keyMap.set(B, A);
      this._valueMap.set(B, Q)
    }
    has(A, Q) {
      return Q ??= this._hash(A), this._valueMap.has(Q)
    }* keys() {
      let A = this._keyMap.entries(),
        Q = A.next();
      while (Q.done !== !0) yield [Q.value[1], Q.value[0]], Q = A.next()
    }* entries() {
      let A = this._valueMap.entries(),
        Q = A.next();
      while (Q.done !== !0) yield [this._keyMap.get(Q.value[0]), Q.value[1], Q.value[0]], Q = A.next()
    }
    get size() {
      return this._valueMap.size
    }
  }
  fW2.HashMap = aQ0;
  class bW2 extends aQ0 {
    constructor() {
      super(uE5.hashAttributes)
    }
  }
  fW2.AttributeHashMap = bW2
})
// @from(Start 10131457, End 10133606)
rQ0 = z((uW2) => {
  Object.defineProperty(uW2, "__esModule", {
    value: !0
  });
  uW2.DeltaMetricProcessor = void 0;
  var dE5 = FP(),
    sQ0 = ZOA();
  class gW2 {
    _aggregator;
    _activeCollectionStorage = new sQ0.AttributeHashMap;
    _cumulativeMemoStorage = new sQ0.AttributeHashMap;
    _cardinalityLimit;
    _overflowAttributes = {
      "otel.metric.overflow": !0
    };
    _overflowHashCode;
    constructor(A, Q) {
      this._aggregator = A, this._cardinalityLimit = (Q ?? 2000) - 1, this._overflowHashCode = (0, dE5.hashAttributes)(this._overflowAttributes)
    }
    record(A, Q, B, G) {
      let Z = this._activeCollectionStorage.get(Q);
      if (!Z) {
        if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
          this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(G))?.record(A);
          return
        }
        Z = this._aggregator.createAccumulation(G), this._activeCollectionStorage.set(Q, Z)
      }
      Z?.record(A)
    }
    batchCumulate(A, Q) {
      Array.from(A.entries()).forEach(([B, G, Z]) => {
        let I = this._aggregator.createAccumulation(Q);
        I?.record(G);
        let Y = I;
        if (this._cumulativeMemoStorage.has(B, Z)) {
          let J = this._cumulativeMemoStorage.get(B, Z);
          Y = this._aggregator.diff(J, I)
        } else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
          if (B = this._overflowAttributes, Z = this._overflowHashCode, this._cumulativeMemoStorage.has(B, Z)) {
            let J = this._cumulativeMemoStorage.get(B, Z);
            Y = this._aggregator.diff(J, I)
          }
        }
        if (this._activeCollectionStorage.has(B, Z)) {
          let J = this._activeCollectionStorage.get(B, Z);
          Y = this._aggregator.merge(J, Y)
        }
        this._cumulativeMemoStorage.set(B, I, Z), this._activeCollectionStorage.set(B, Y, Z)
      })
    }
    collect() {
      let A = this._activeCollectionStorage;
      return this._activeCollectionStorage = new sQ0.AttributeHashMap, A
    }
  }
  uW2.DeltaMetricProcessor = gW2
})
// @from(Start 10133612, End 10135921)
oQ0 = z((dW2) => {
  Object.defineProperty(dW2, "__esModule", {
    value: !0
  });
  dW2.TemporalMetricProcessor = void 0;
  var cE5 = n91(),
    pE5 = ZOA();
  class IOA {
    _aggregator;
    _unreportedAccumulations = new Map;
    _reportHistory = new Map;
    constructor(A, Q) {
      this._aggregator = A, Q.forEach((B) => {
        this._unreportedAccumulations.set(B, [])
      })
    }
    buildMetrics(A, Q, B, G) {
      this._stashAccumulations(B);
      let Z = this._getMergedUnreportedAccumulations(A),
        I = Z,
        Y;
      if (this._reportHistory.has(A)) {
        let W = this._reportHistory.get(A),
          X = W.collectionTime;
        if (Y = W.aggregationTemporality, Y === cE5.AggregationTemporality.CUMULATIVE) I = IOA.merge(W.accumulations, Z, this._aggregator);
        else I = IOA.calibrateStartTime(W.accumulations, Z, X)
      } else Y = A.selectAggregationTemporality(Q.type);
      this._reportHistory.set(A, {
        accumulations: I,
        collectionTime: G,
        aggregationTemporality: Y
      });
      let J = lE5(I);
      if (J.length === 0) return;
      return this._aggregator.toMetricData(Q, Y, J, G)
    }
    _stashAccumulations(A) {
      let Q = this._unreportedAccumulations.keys();
      for (let B of Q) {
        let G = this._unreportedAccumulations.get(B);
        if (G === void 0) G = [], this._unreportedAccumulations.set(B, G);
        G.push(A)
      }
    }
    _getMergedUnreportedAccumulations(A) {
      let Q = new pE5.AttributeHashMap,
        B = this._unreportedAccumulations.get(A);
      if (this._unreportedAccumulations.set(A, []), B === void 0) return Q;
      for (let G of B) Q = IOA.merge(Q, G, this._aggregator);
      return Q
    }
    static merge(A, Q, B) {
      let G = A,
        Z = Q.entries(),
        I = Z.next();
      while (I.done !== !0) {
        let [Y, J, W] = I.value;
        if (A.has(Y, W)) {
          let X = A.get(Y, W),
            V = B.merge(X, J);
          G.set(Y, V, W)
        } else G.set(Y, J, W);
        I = Z.next()
      }
      return G
    }
    static calibrateStartTime(A, Q, B) {
      for (let [G, Z] of A.keys()) Q.get(G, Z)?.setStartTime(B);
      return Q
    }
  }
  dW2.TemporalMetricProcessor = IOA;

  function lE5(A) {
    return Array.from(A.entries())
  }
})
// @from(Start 10135927, End 10136994)
nW2 = z((lW2) => {
  Object.defineProperty(lW2, "__esModule", {
    value: !0
  });
  lW2.AsyncMetricStorage = void 0;
  var iE5 = nQ0(),
    nE5 = rQ0(),
    aE5 = oQ0(),
    sE5 = ZOA();
  class pW2 extends iE5.MetricStorage {
    _attributesProcessor;
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    constructor(A, Q, B, G, Z) {
      super(A);
      this._attributesProcessor = B, this._aggregationCardinalityLimit = Z, this._deltaMetricStorage = new nE5.DeltaMetricProcessor(Q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new aE5.TemporalMetricProcessor(Q, G)
    }
    record(A, Q) {
      let B = new sE5.AttributeHashMap;
      Array.from(A.entries()).forEach(([G, Z]) => {
        B.set(this._attributesProcessor.process(G), Z)
      }), this._deltaMetricStorage.batchCumulate(B, Q)
    }
    collect(A, Q) {
      let B = this._deltaMetricStorage.collect();
      return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, B, Q)
    }
  }
  lW2.AsyncMetricStorage = pW2
})
// @from(Start 10137000, End 10139283)
AX2 = z((tW2) => {
  Object.defineProperty(tW2, "__esModule", {
    value: !0
  });
  tW2.getConflictResolutionRecipe = tW2.getDescriptionResolutionRecipe = tW2.getTypeConflictResolutionRecipe = tW2.getUnitConflictResolutionRecipe = tW2.getValueTypeConflictResolutionRecipe = tW2.getIncompatibilityDetails = void 0;

  function rE5(A, Q) {
    let B = "";
    if (A.unit !== Q.unit) B += `	- Unit '${A.unit}' does not match '${Q.unit}'
`;
    if (A.type !== Q.type) B += `	- Type '${A.type}' does not match '${Q.type}'
`;
    if (A.valueType !== Q.valueType) B += `	- Value Type '${A.valueType}' does not match '${Q.valueType}'
`;
    if (A.description !== Q.description) B += `	- Description '${A.description}' does not match '${Q.description}'
`;
    return B
  }
  tW2.getIncompatibilityDetails = rE5;

  function aW2(A, Q) {
    return `	- use valueType '${A.valueType}' on instrument creation or use an instrument name other than '${Q.name}'`
  }
  tW2.getValueTypeConflictResolutionRecipe = aW2;

  function sW2(A, Q) {
    return `	- use unit '${A.unit}' on instrument creation or use an instrument name other than '${Q.name}'`
  }
  tW2.getUnitConflictResolutionRecipe = sW2;

  function rW2(A, Q) {
    let B = {
        name: Q.name,
        type: Q.type,
        unit: Q.unit
      },
      G = JSON.stringify(B);
    return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${G}'`
  }
  tW2.getTypeConflictResolutionRecipe = rW2;

  function oW2(A, Q) {
    let B = {
        name: Q.name,
        type: Q.type,
        unit: Q.unit
      },
      G = JSON.stringify(B);
    return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${G}'
    	- OR - create a new view with the name ${A.name} and description '${A.description}' and InstrumentSelector ${G}
    	- OR - create a new view with the name ${Q.name} and description '${A.description}' and InstrumentSelector ${G}`
  }
  tW2.getDescriptionResolutionRecipe = oW2;

  function oE5(A, Q) {
    if (A.valueType !== Q.valueType) return aW2(A, Q);
    if (A.unit !== Q.unit) return sW2(A, Q);
    if (A.type !== Q.type) return rW2(A, Q);
    if (A.description !== Q.description) return oW2(A, Q);
    return ""
  }
  tW2.getConflictResolutionRecipe = oE5
})
// @from(Start 10139289, End 10141834)
ZX2 = z((BX2) => {
  Object.defineProperty(BX2, "__esModule", {
    value: !0
  });
  BX2.MetricStorageRegistry = void 0;
  var Gz5 = GOA(),
    QX2 = K9(),
    G41 = AX2();
  class tQ0 {
    _sharedRegistry = new Map;
    _perCollectorRegistry = new Map;
    static create() {
      return new tQ0
    }
    getStorages(A) {
      let Q = [];
      for (let G of this._sharedRegistry.values()) Q = Q.concat(G);
      let B = this._perCollectorRegistry.get(A);
      if (B != null)
        for (let G of B.values()) Q = Q.concat(G);
      return Q
    }
    register(A) {
      this._registerStorage(A, this._sharedRegistry)
    }
    registerForCollector(A, Q) {
      let B = this._perCollectorRegistry.get(A);
      if (B == null) B = new Map, this._perCollectorRegistry.set(A, B);
      this._registerStorage(Q, B)
    }
    findOrUpdateCompatibleStorage(A) {
      let Q = this._sharedRegistry.get(A.name);
      if (Q === void 0) return null;
      return this._findOrUpdateCompatibleStorage(A, Q)
    }
    findOrUpdateCompatibleCollectorStorage(A, Q) {
      let B = this._perCollectorRegistry.get(A);
      if (B === void 0) return null;
      let G = B.get(Q.name);
      if (G === void 0) return null;
      return this._findOrUpdateCompatibleStorage(Q, G)
    }
    _registerStorage(A, Q) {
      let B = A.getInstrumentDescriptor(),
        G = Q.get(B.name);
      if (G === void 0) {
        Q.set(B.name, [A]);
        return
      }
      G.push(A)
    }
    _findOrUpdateCompatibleStorage(A, Q) {
      let B = null;
      for (let G of Q) {
        let Z = G.getInstrumentDescriptor();
        if ((0, Gz5.isDescriptorCompatibleWith)(Z, A)) {
          if (Z.description !== A.description) {
            if (A.description.length > Z.description.length) G.updateDescription(A.description);
            QX2.diag.warn("A view or instrument with the name ", A.name, ` has already been registered, but has a different description and is incompatible with another registered view.
`, `Details:
`, (0, G41.getIncompatibilityDetails)(Z, A), `The longer description will be used.
To resolve the conflict:`, (0, G41.getConflictResolutionRecipe)(Z, A))
          }
          B = G
        } else QX2.diag.warn("A view or instrument with the name ", A.name, ` has already been registered and is incompatible with another registered view.
`, `Details:
`, (0, G41.getIncompatibilityDetails)(Z, A), `To resolve the conflict:
`, (0, G41.getConflictResolutionRecipe)(Z, A))
      }
      return B
    }
  }
  BX2.MetricStorageRegistry = tQ0
})
// @from(Start 10141840, End 10142205)
WX2 = z((YX2) => {
  Object.defineProperty(YX2, "__esModule", {
    value: !0
  });
  YX2.MultiMetricStorage = void 0;
  class IX2 {
    _backingStorages;
    constructor(A) {
      this._backingStorages = A
    }
    record(A, Q, B, G) {
      this._backingStorages.forEach((Z) => {
        Z.record(A, Q, B, G)
      })
    }
  }
  YX2.MultiMetricStorage = IX2
})
// @from(Start 10142211, End 10143837)
HX2 = z((KX2) => {
  Object.defineProperty(KX2, "__esModule", {
    value: !0
  });
  KX2.BatchObservableResultImpl = KX2.ObservableResultImpl = void 0;
  var iYA = K9(),
    XX2 = ZOA(),
    Zz5 = B41();
  class VX2 {
    _instrumentName;
    _valueType;
    _buffer = new XX2.AttributeHashMap;
    constructor(A, Q) {
      this._instrumentName = A, this._valueType = Q
    }
    observe(A, Q = {}) {
      if (typeof A !== "number") {
        iYA.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${A}`);
        return
      }
      if (this._valueType === iYA.ValueType.INT && !Number.isInteger(A)) {
        if (iYA.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
      }
      this._buffer.set(Q, A)
    }
  }
  KX2.ObservableResultImpl = VX2;
  class FX2 {
    _buffer = new Map;
    observe(A, Q, B = {}) {
      if (!(0, Zz5.isObservableInstrument)(A)) return;
      let G = this._buffer.get(A);
      if (G == null) G = new XX2.AttributeHashMap, this._buffer.set(A, G);
      if (typeof Q !== "number") {
        iYA.diag.warn(`non-number value provided to metric ${A._descriptor.name}: ${Q}`);
        return
      }
      if (A._descriptor.valueType === iYA.ValueType.INT && !Number.isInteger(Q)) {
        if (iYA.diag.warn(`INT value type cannot accept a floating-point value for ${A._descriptor.name}, ignoring the fractional digits.`), Q = Math.trunc(Q), !Number.isInteger(Q)) return
      }
      G.set(B, Q)
    }
  }
  KX2.BatchObservableResultImpl = FX2
})
// @from(Start 10143843, End 10146506)
wX2 = z((UX2) => {
  Object.defineProperty(UX2, "__esModule", {
    value: !0
  });
  UX2.ObservableRegistry = void 0;
  var Yz5 = K9(),
    CX2 = B41(),
    EX2 = HX2(),
    YOA = FP();
  class zX2 {
    _callbacks = [];
    _batchCallbacks = [];
    addCallback(A, Q) {
      if (this._findCallback(A, Q) >= 0) return;
      this._callbacks.push({
        callback: A,
        instrument: Q
      })
    }
    removeCallback(A, Q) {
      let B = this._findCallback(A, Q);
      if (B < 0) return;
      this._callbacks.splice(B, 1)
    }
    addBatchCallback(A, Q) {
      let B = new Set(Q.filter(CX2.isObservableInstrument));
      if (B.size === 0) {
        Yz5.diag.error("BatchObservableCallback is not associated with valid instruments", Q);
        return
      }
      if (this._findBatchCallback(A, B) >= 0) return;
      this._batchCallbacks.push({
        callback: A,
        instruments: B
      })
    }
    removeBatchCallback(A, Q) {
      let B = new Set(Q.filter(CX2.isObservableInstrument)),
        G = this._findBatchCallback(A, B);
      if (G < 0) return;
      this._batchCallbacks.splice(G, 1)
    }
    async observe(A, Q) {
      let B = this._observeCallbacks(A, Q),
        G = this._observeBatchCallbacks(A, Q);
      return (await (0, YOA.PromiseAllSettled)([...B, ...G])).filter(YOA.isPromiseAllSettledRejectionResult).map((Y) => Y.reason)
    }
    _observeCallbacks(A, Q) {
      return this._callbacks.map(async ({
        callback: B,
        instrument: G
      }) => {
        let Z = new EX2.ObservableResultImpl(G._descriptor.name, G._descriptor.valueType),
          I = Promise.resolve(B(Z));
        if (Q != null) I = (0, YOA.callWithTimeout)(I, Q);
        await I, G._metricStorages.forEach((Y) => {
          Y.record(Z._buffer, A)
        })
      })
    }
    _observeBatchCallbacks(A, Q) {
      return this._batchCallbacks.map(async ({
        callback: B,
        instruments: G
      }) => {
        let Z = new EX2.BatchObservableResultImpl,
          I = Promise.resolve(B(Z));
        if (Q != null) I = (0, YOA.callWithTimeout)(I, Q);
        await I, G.forEach((Y) => {
          let J = Z._buffer.get(Y);
          if (J == null) return;
          Y._metricStorages.forEach((W) => {
            W.record(J, A)
          })
        })
      })
    }
    _findCallback(A, Q) {
      return this._callbacks.findIndex((B) => {
        return B.callback === A && B.instrument === Q
      })
    }
    _findBatchCallback(A, Q) {
      return this._batchCallbacks.findIndex((B) => {
        return B.callback === A && (0, YOA.setEquals)(B.instruments, Q)
      })
    }
  }
  UX2.ObservableRegistry = zX2
})
// @from(Start 10146512, End 10147459)
MX2 = z((NX2) => {
  Object.defineProperty(NX2, "__esModule", {
    value: !0
  });
  NX2.SyncMetricStorage = void 0;
  var Jz5 = nQ0(),
    Wz5 = rQ0(),
    Xz5 = oQ0();
  class qX2 extends Jz5.MetricStorage {
    _attributesProcessor;
    _aggregationCardinalityLimit;
    _deltaMetricStorage;
    _temporalMetricStorage;
    constructor(A, Q, B, G, Z) {
      super(A);
      this._attributesProcessor = B, this._aggregationCardinalityLimit = Z, this._deltaMetricStorage = new Wz5.DeltaMetricProcessor(Q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new Xz5.TemporalMetricProcessor(Q, G)
    }
    record(A, Q, B, G) {
      Q = this._attributesProcessor.process(Q, B), this._deltaMetricStorage.record(A, Q, B, G)
    }
    collect(A, Q) {
      let B = this._deltaMetricStorage.collect();
      return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, B, Q)
    }
  }
  NX2.SyncMetricStorage = qX2
})
// @from(Start 10147465, End 10148898)
Z41 = z((jX2) => {
  Object.defineProperty(jX2, "__esModule", {
    value: !0
  });
  jX2.createDenyListAttributesProcessor = jX2.createAllowListAttributesProcessor = jX2.createMultiAttributesProcessor = jX2.createNoopAttributesProcessor = void 0;
  class OX2 {
    process(A, Q) {
      return A
    }
  }
  class RX2 {
    _processors;
    constructor(A) {
      this._processors = A
    }
    process(A, Q) {
      let B = A;
      for (let G of this._processors) B = G.process(B, Q);
      return B
    }
  }
  class TX2 {
    _allowedAttributeNames;
    constructor(A) {
      this._allowedAttributeNames = A
    }
    process(A, Q) {
      let B = {};
      return Object.keys(A).filter((G) => this._allowedAttributeNames.includes(G)).forEach((G) => B[G] = A[G]), B
    }
  }
  class PX2 {
    _deniedAttributeNames;
    constructor(A) {
      this._deniedAttributeNames = A
    }
    process(A, Q) {
      let B = {};
      return Object.keys(A).filter((G) => !this._deniedAttributeNames.includes(G)).forEach((G) => B[G] = A[G]), B
    }
  }

  function Vz5() {
    return Hz5
  }
  jX2.createNoopAttributesProcessor = Vz5;

  function Fz5(A) {
    return new RX2(A)
  }
  jX2.createMultiAttributesProcessor = Fz5;

  function Kz5(A) {
    return new TX2(A)
  }
  jX2.createAllowListAttributesProcessor = Kz5;

  function Dz5(A) {
    return new PX2(A)
  }
  jX2.createDenyListAttributesProcessor = Dz5;
  var Hz5 = new OX2
})
// @from(Start 10148904, End 10151467)
xX2 = z((kX2) => {
  Object.defineProperty(kX2, "__esModule", {
    value: !0
  });
  kX2.MeterSharedState = void 0;
  var Uz5 = GOA(),
    $z5 = kW2(),
    wz5 = FP(),
    qz5 = nW2(),
    Nz5 = ZX2(),
    Lz5 = WX2(),
    Mz5 = wX2(),
    Oz5 = MX2(),
    Rz5 = Z41();
  class _X2 {
    _meterProviderSharedState;
    _instrumentationScope;
    metricStorageRegistry = new Nz5.MetricStorageRegistry;
    observableRegistry = new Mz5.ObservableRegistry;
    meter;
    constructor(A, Q) {
      this._meterProviderSharedState = A, this._instrumentationScope = Q, this.meter = new $z5.Meter(this)
    }
    registerMetricStorage(A) {
      let Q = this._registerMetricStorage(A, Oz5.SyncMetricStorage);
      if (Q.length === 1) return Q[0];
      return new Lz5.MultiMetricStorage(Q)
    }
    registerAsyncMetricStorage(A) {
      return this._registerMetricStorage(A, qz5.AsyncMetricStorage)
    }
    async collect(A, Q, B) {
      let G = await this.observableRegistry.observe(Q, B?.timeoutMillis),
        Z = this.metricStorageRegistry.getStorages(A);
      if (Z.length === 0) return null;
      let I = Z.map((Y) => {
        return Y.collect(A, Q)
      }).filter(wz5.isNotNullish);
      if (I.length === 0) return {
        errors: G
      };
      return {
        scopeMetrics: {
          scope: this._instrumentationScope,
          metrics: I
        },
        errors: G
      }
    }
    _registerMetricStorage(A, Q) {
      let G = this._meterProviderSharedState.viewRegistry.findViews(A, this._instrumentationScope).map((Z) => {
        let I = (0, Uz5.createInstrumentDescriptorWithView)(Z, A),
          Y = this.metricStorageRegistry.findOrUpdateCompatibleStorage(I);
        if (Y != null) return Y;
        let J = Z.aggregation.createAggregator(I),
          W = new Q(I, J, Z.attributesProcessor, this._meterProviderSharedState.metricCollectors, Z.aggregationCardinalityLimit);
        return this.metricStorageRegistry.register(W), W
      });
      if (G.length === 0) {
        let I = this._meterProviderSharedState.selectAggregations(A.type).map(([Y, J]) => {
          let W = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(Y, A);
          if (W != null) return W;
          let X = J.createAggregator(A),
            V = Y.selectCardinalityLimit(A.type),
            F = new Q(A, X, (0, Rz5.createNoopAttributesProcessor)(), [Y], V);
          return this.metricStorageRegistry.registerForCollector(Y, F), F
        });
        G = G.concat(I)
      }
      return G
    }
  }
  kX2.MeterSharedState = _X2
})
// @from(Start 10151473, End 10152298)
hX2 = z((bX2) => {
  Object.defineProperty(bX2, "__esModule", {
    value: !0
  });
  bX2.MeterProviderSharedState = void 0;
  var Tz5 = FP(),
    Pz5 = CW2(),
    jz5 = xX2(),
    Sz5 = QOA();
  class vX2 {
    resource;
    viewRegistry = new Pz5.ViewRegistry;
    metricCollectors = [];
    meterSharedStates = new Map;
    constructor(A) {
      this.resource = A
    }
    getMeterSharedState(A) {
      let Q = (0, Tz5.instrumentationScopeId)(A),
        B = this.meterSharedStates.get(Q);
      if (B == null) B = new jz5.MeterSharedState(this, A), this.meterSharedStates.set(Q, B);
      return B
    }
    selectAggregations(A) {
      let Q = [];
      for (let B of this.metricCollectors) Q.push([B, (0, Sz5.toAggregation)(B.selectAggregation(A))]);
      return Q
    }
  }
  bX2.MeterProviderSharedState = vX2
})
// @from(Start 10152304, End 10153605)
dX2 = z((uX2) => {
  Object.defineProperty(uX2, "__esModule", {
    value: !0
  });
  uX2.MetricCollector = void 0;
  var _z5 = e6();
  class gX2 {
    _sharedState;
    _metricReader;
    constructor(A, Q) {
      this._sharedState = A, this._metricReader = Q
    }
    async collect(A) {
      let Q = (0, _z5.millisToHrTime)(Date.now()),
        B = [],
        G = [],
        Z = Array.from(this._sharedState.meterSharedStates.values()).map(async (I) => {
          let Y = await I.collect(this, Q, A);
          if (Y?.scopeMetrics != null) B.push(Y.scopeMetrics);
          if (Y?.errors != null) G.push(...Y.errors)
        });
      return await Promise.all(Z), {
        resourceMetrics: {
          resource: this._sharedState.resource,
          scopeMetrics: B
        },
        errors: G
      }
    }
    async forceFlush(A) {
      await this._metricReader.forceFlush(A)
    }
    async shutdown(A) {
      await this._metricReader.shutdown(A)
    }
    selectAggregationTemporality(A) {
      return this._metricReader.selectAggregationTemporality(A)
    }
    selectAggregation(A) {
      return this._metricReader.selectAggregation(A)
    }
    selectCardinalityLimit(A) {
      return this._metricReader.selectCardinalityLimit?.(A) ?? 2000
    }
  }
  uX2.MetricCollector = gX2
})
// @from(Start 10153611, End 10154555)
I41 = z((pX2) => {
  Object.defineProperty(pX2, "__esModule", {
    value: !0
  });
  pX2.ExactPredicate = pX2.PatternPredicate = void 0;
  var kz5 = /[\^$\\.+?()[\]{}|]/g;
  class eQ0 {
    _matchAll;
    _regexp;
    constructor(A) {
      if (A === "*") this._matchAll = !0, this._regexp = /.*/;
      else this._matchAll = !1, this._regexp = new RegExp(eQ0.escapePattern(A))
    }
    match(A) {
      if (this._matchAll) return !0;
      return this._regexp.test(A)
    }
    static escapePattern(A) {
      return `^${A.replace(kz5,"\\$&").replace("*",".*")}$`
    }
    static hasWildcard(A) {
      return A.includes("*")
    }
  }
  pX2.PatternPredicate = eQ0;
  class cX2 {
    _matchAll;
    _pattern;
    constructor(A) {
      this._matchAll = A === void 0, this._pattern = A
    }
    match(A) {
      if (this._matchAll) return !0;
      if (A === this._pattern) return !0;
      return !1
    }
  }
  pX2.ExactPredicate = cX2
})
// @from(Start 10154561, End 10155124)
rX2 = z((aX2) => {
  Object.defineProperty(aX2, "__esModule", {
    value: !0
  });
  aX2.InstrumentSelector = void 0;
  var iX2 = I41();
  class nX2 {
    _nameFilter;
    _type;
    _unitFilter;
    constructor(A) {
      this._nameFilter = new iX2.PatternPredicate(A?.name ?? "*"), this._type = A?.type, this._unitFilter = new iX2.ExactPredicate(A?.unit)
    }
    getType() {
      return this._type
    }
    getNameFilter() {
      return this._nameFilter
    }
    getUnitFilter() {
      return this._unitFilter
    }
  }
  aX2.InstrumentSelector = nX2
})
// @from(Start 10155130, End 10155762)
AV2 = z((tX2) => {
  Object.defineProperty(tX2, "__esModule", {
    value: !0
  });
  tX2.MeterSelector = void 0;
  var AB0 = I41();
  class oX2 {
    _nameFilter;
    _versionFilter;
    _schemaUrlFilter;
    constructor(A) {
      this._nameFilter = new AB0.ExactPredicate(A?.name), this._versionFilter = new AB0.ExactPredicate(A?.version), this._schemaUrlFilter = new AB0.ExactPredicate(A?.schemaUrl)
    }
    getNameFilter() {
      return this._nameFilter
    }
    getVersionFilter() {
      return this._versionFilter
    }
    getSchemaUrlFilter() {
      return this._schemaUrlFilter
    }
  }
  tX2.MeterSelector = oX2
})
// @from(Start 10155768, End 10157490)
YV2 = z((ZV2) => {
  Object.defineProperty(ZV2, "__esModule", {
    value: !0
  });
  ZV2.View = void 0;
  var xz5 = I41(),
    QV2 = Z41(),
    vz5 = rX2(),
    bz5 = AV2(),
    BV2 = QOA();

  function fz5(A) {
    return A.instrumentName == null && A.instrumentType == null && A.instrumentUnit == null && A.meterName == null && A.meterVersion == null && A.meterSchemaUrl == null
  }

  function hz5(A) {
    if (fz5(A)) throw Error("Cannot create view with no selector arguments supplied");
    if (A.name != null && (A?.instrumentName == null || xz5.PatternPredicate.hasWildcard(A.instrumentName))) throw Error("Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.")
  }
  class GV2 {
    name;
    description;
    aggregation;
    attributesProcessor;
    instrumentSelector;
    meterSelector;
    aggregationCardinalityLimit;
    constructor(A) {
      if (hz5(A), A.attributesProcessors != null) this.attributesProcessor = (0, QV2.createMultiAttributesProcessor)(A.attributesProcessors);
      else this.attributesProcessor = (0, QV2.createNoopAttributesProcessor)();
      this.name = A.name, this.description = A.description, this.aggregation = (0, BV2.toAggregation)(A.aggregation ?? {
        type: BV2.AggregationType.DEFAULT
      }), this.instrumentSelector = new vz5.InstrumentSelector({
        name: A.instrumentName,
        type: A.instrumentType,
        unit: A.instrumentUnit
      }), this.meterSelector = new bz5.MeterSelector({
        name: A.meterName,
        version: A.meterVersion,
        schemaUrl: A.meterSchemaUrl
      }), this.aggregationCardinalityLimit = A.aggregationCardinalityLimit
    }
  }
  ZV2.View = GV2
})
// @from(Start 10157496, End 10159158)
VV2 = z((WV2) => {
  Object.defineProperty(WV2, "__esModule", {
    value: !0
  });
  WV2.MeterProvider = void 0;
  var Y41 = K9(),
    gz5 = t3A(),
    uz5 = hX2(),
    mz5 = dX2(),
    dz5 = YV2();
  class JV2 {
    _sharedState;
    _shutdown = !1;
    constructor(A) {
      if (this._sharedState = new uz5.MeterProviderSharedState(A?.resource ?? (0, gz5.defaultResource)()), A?.views != null && A.views.length > 0)
        for (let Q of A.views) this._sharedState.viewRegistry.addView(new dz5.View(Q));
      if (A?.readers != null && A.readers.length > 0)
        for (let Q of A.readers) {
          let B = new mz5.MetricCollector(this._sharedState, Q);
          Q.setMetricProducer(B), this._sharedState.metricCollectors.push(B)
        }
    }
    getMeter(A, Q = "", B = {}) {
      if (this._shutdown) return Y41.diag.warn("A shutdown MeterProvider cannot provide a Meter"), (0, Y41.createNoopMeter)();
      return this._sharedState.getMeterSharedState({
        name: A,
        version: Q,
        schemaUrl: B.schemaUrl
      }).meter
    }
    async shutdown(A) {
      if (this._shutdown) {
        Y41.diag.warn("shutdown may only be called once per MeterProvider");
        return
      }
      this._shutdown = !0, await Promise.all(this._sharedState.metricCollectors.map((Q) => {
        return Q.shutdown(A)
      }))
    }
    async forceFlush(A) {
      if (this._shutdown) {
        Y41.diag.warn("invalid attempt to force flush after MeterProvider shutdown");
        return
      }
      await Promise.all(this._sharedState.metricCollectors.map((Q) => {
        return Q.forceFlush(A)
      }))
    }
  }
  WV2.MeterProvider = JV2
})
// @from(Start 10159164, End 10161508)
vi = z((rU) => {
  Object.defineProperty(rU, "__esModule", {
    value: !0
  });
  rU.TimeoutError = rU.createDenyListAttributesProcessor = rU.createAllowListAttributesProcessor = rU.AggregationType = rU.MeterProvider = rU.ConsoleMetricExporter = rU.InMemoryMetricExporter = rU.PeriodicExportingMetricReader = rU.MetricReader = rU.InstrumentType = rU.DataPointType = rU.AggregationTemporality = void 0;
  var cz5 = n91();
  Object.defineProperty(rU, "AggregationTemporality", {
    enumerable: !0,
    get: function() {
      return cz5.AggregationTemporality
    }
  });
  var FV2 = xi();
  Object.defineProperty(rU, "DataPointType", {
    enumerable: !0,
    get: function() {
      return FV2.DataPointType
    }
  });
  Object.defineProperty(rU, "InstrumentType", {
    enumerable: !0,
    get: function() {
      return FV2.InstrumentType
    }
  });
  var pz5 = pQ0();
  Object.defineProperty(rU, "MetricReader", {
    enumerable: !0,
    get: function() {
      return pz5.MetricReader
    }
  });
  var lz5 = BW2();
  Object.defineProperty(rU, "PeriodicExportingMetricReader", {
    enumerable: !0,
    get: function() {
      return lz5.PeriodicExportingMetricReader
    }
  });
  var iz5 = JW2();
  Object.defineProperty(rU, "InMemoryMetricExporter", {
    enumerable: !0,
    get: function() {
      return iz5.InMemoryMetricExporter
    }
  });
  var nz5 = FW2();
  Object.defineProperty(rU, "ConsoleMetricExporter", {
    enumerable: !0,
    get: function() {
      return nz5.ConsoleMetricExporter
    }
  });
  var az5 = VV2();
  Object.defineProperty(rU, "MeterProvider", {
    enumerable: !0,
    get: function() {
      return az5.MeterProvider
    }
  });
  var sz5 = QOA();
  Object.defineProperty(rU, "AggregationType", {
    enumerable: !0,
    get: function() {
      return sz5.AggregationType
    }
  });
  var KV2 = Z41();
  Object.defineProperty(rU, "createAllowListAttributesProcessor", {
    enumerable: !0,
    get: function() {
      return KV2.createAllowListAttributesProcessor
    }
  });
  Object.defineProperty(rU, "createDenyListAttributesProcessor", {
    enumerable: !0,
    get: function() {
      return KV2.createDenyListAttributesProcessor
    }
  });
  var rz5 = FP();
  Object.defineProperty(rU, "TimeoutError", {
    enumerable: !0,
    get: function() {
      return rz5.TimeoutError
    }
  })
})
// @from(Start 10161514, End 10161872)
BB0 = z((DV2) => {
  Object.defineProperty(DV2, "__esModule", {
    value: !0
  });
  DV2.AggregationTemporalityPreference = void 0;
  var tz5;
  (function(A) {
    A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE", A[A.LOWMEMORY = 2] = "LOWMEMORY"
  })(tz5 = DV2.AggregationTemporalityPreference || (DV2.AggregationTemporalityPreference = {}))
})
// @from(Start 10161878, End 10162299)
zV2 = z((CV2) => {
  Object.defineProperty(CV2, "__esModule", {
    value: !0
  });
  CV2.OTLPExporterBase = void 0;
  class HV2 {
    _delegate;
    constructor(A) {
      this._delegate = A
    }
    export (A, Q) {
      this._delegate.export(A, Q)
    }
    forceFlush() {
      return this._delegate.forceFlush()
    }
    shutdown() {
      return this._delegate.shutdown()
    }
  }
  CV2.OTLPExporterBase = HV2
})
// @from(Start 10162305, End 10162623)
J41 = z(($V2) => {
  Object.defineProperty($V2, "__esModule", {
    value: !0
  });
  $V2.OTLPExporterError = void 0;
  class UV2 extends Error {
    code;
    name = "OTLPExporterError";
    data;
    constructor(A, Q, B) {
      super(A);
      this.data = B, this.code = Q
    }
  }
  $V2.OTLPExporterError = UV2
})
// @from(Start 10162629, End 10163704)
JOA = z((NV2) => {
  Object.defineProperty(NV2, "__esModule", {
    value: !0
  });
  NV2.getSharedConfigurationDefaults = NV2.mergeOtlpSharedConfigurationWithDefaults = NV2.wrapStaticHeadersInFunction = NV2.validateTimeoutMillis = void 0;

  function qV2(A) {
    if (Number.isFinite(A) && A > 0) return A;
    throw Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${A}')`)
  }
  NV2.validateTimeoutMillis = qV2;

  function ez5(A) {
    if (A == null) return;
    return () => A
  }
  NV2.wrapStaticHeadersInFunction = ez5;

  function AU5(A, Q, B) {
    return {
      timeoutMillis: qV2(A.timeoutMillis ?? Q.timeoutMillis ?? B.timeoutMillis),
      concurrencyLimit: A.concurrencyLimit ?? Q.concurrencyLimit ?? B.concurrencyLimit,
      compression: A.compression ?? Q.compression ?? B.compression
    }
  }
  NV2.mergeOtlpSharedConfigurationWithDefaults = AU5;

  function QU5() {
    return {
      timeoutMillis: 1e4,
      concurrencyLimit: 30,
      compression: "none"
    }
  }
  NV2.getSharedConfigurationDefaults = QU5
})
// @from(Start 10163710, End 10163970)
OV2 = z((MV2) => {
  Object.defineProperty(MV2, "__esModule", {
    value: !0
  });
  MV2.CompressionAlgorithm = void 0;
  var IU5;
  (function(A) {
    A.NONE = "none", A.GZIP = "gzip"
  })(IU5 = MV2.CompressionAlgorithm || (MV2.CompressionAlgorithm = {}))
})
// @from(Start 10163976, End 10164817)
ZB0 = z((TV2) => {
  Object.defineProperty(TV2, "__esModule", {
    value: !0
  });
  TV2.createBoundedQueueExportPromiseHandler = void 0;
  class RV2 {
    _concurrencyLimit;
    _sendingPromises = [];
    constructor(A) {
      this._concurrencyLimit = A
    }
    pushPromise(A) {
      if (this.hasReachedLimit()) throw Error("Concurrency Limit reached");
      this._sendingPromises.push(A);
      let Q = () => {
        let B = this._sendingPromises.indexOf(A);
        this._sendingPromises.splice(B, 1)
      };
      A.then(Q, Q)
    }
    hasReachedLimit() {
      return this._sendingPromises.length >= this._concurrencyLimit
    }
    async awaitAll() {
      await Promise.all(this._sendingPromises)
    }
  }

  function YU5(A) {
    return new RV2(A.concurrencyLimit)
  }
  TV2.createBoundedQueueExportPromiseHandler = YU5
})
// @from(Start 10164823, End 10165422)
_V2 = z((jV2) => {
  Object.defineProperty(jV2, "__esModule", {
    value: !0
  });
  jV2.createLoggingPartialSuccessResponseHandler = void 0;
  var JU5 = K9();

  function WU5(A) {
    return Object.prototype.hasOwnProperty.call(A, "partialSuccess")
  }

  function XU5() {
    return {
      handleResponse(A) {
        if (A == null || !WU5(A) || A.partialSuccess == null || Object.keys(A.partialSuccess).length === 0) return;
        JU5.diag.warn("Received Partial Success response:", JSON.stringify(A.partialSuccess))
      }
    }
  }
  jV2.createLoggingPartialSuccessResponseHandler = XU5
})
// @from(Start 10165428, End 10168017)
IB0 = z((xV2) => {
  Object.defineProperty(xV2, "__esModule", {
    value: !0
  });
  xV2.createOtlpExportDelegate = void 0;
  var i1A = e6(),
    kV2 = J41(),
    VU5 = _V2(),
    FU5 = K9();
  class yV2 {
    _transport;
    _serializer;
    _responseHandler;
    _promiseQueue;
    _timeout;
    _diagLogger;
    constructor(A, Q, B, G, Z) {
      this._transport = A, this._serializer = Q, this._responseHandler = B, this._promiseQueue = G, this._timeout = Z, this._diagLogger = FU5.diag.createComponentLogger({
        namespace: "OTLPExportDelegate"
      })
    }
    export (A, Q) {
      if (this._diagLogger.debug("items to be sent", A), this._promiseQueue.hasReachedLimit()) {
        Q({
          code: i1A.ExportResultCode.FAILED,
          error: Error("Concurrent export limit reached")
        });
        return
      }
      let B = this._serializer.serializeRequest(A);
      if (B == null) {
        Q({
          code: i1A.ExportResultCode.FAILED,
          error: Error("Nothing to send")
        });
        return
      }
      this._promiseQueue.pushPromise(this._transport.send(B, this._timeout).then((G) => {
        if (G.status === "success") {
          if (G.data != null) try {
            this._responseHandler.handleResponse(this._serializer.deserializeResponse(G.data))
          } catch (Z) {
            this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", Z, G.data)
          }
          Q({
            code: i1A.ExportResultCode.SUCCESS
          });
          return
        } else if (G.status === "failure" && G.error) {
          Q({
            code: i1A.ExportResultCode.FAILED,
            error: G.error
          });
          return
        } else if (G.status === "retryable") Q({
          code: i1A.ExportResultCode.FAILED,
          error: new kV2.OTLPExporterError("Export failed with retryable status")
        });
        else Q({
          code: i1A.ExportResultCode.FAILED,
          error: new kV2.OTLPExporterError("Export failed with unknown error")
        })
      }, (G) => Q({
        code: i1A.ExportResultCode.FAILED,
        error: G
      })))
    }
    forceFlush() {
      return this._promiseQueue.awaitAll()
    }
    async shutdown() {
      this._diagLogger.debug("shutdown started"), await this.forceFlush(), this._transport.shutdown()
    }
  }

  function KU5(A, Q) {
    return new yV2(A.transport, A.serializer, (0, VU5.createLoggingPartialSuccessResponseHandler)(), A.promiseHandler, Q.timeout)
  }
  xV2.createOtlpExportDelegate = KU5
})
// @from(Start 10168023, End 10168476)
hV2 = z((bV2) => {
  Object.defineProperty(bV2, "__esModule", {
    value: !0
  });
  bV2.createOtlpNetworkExportDelegate = void 0;
  var DU5 = ZB0(),
    HU5 = IB0();

  function CU5(A, Q, B) {
    return (0, HU5.createOtlpExportDelegate)({
      transport: B,
      serializer: Q,
      promiseHandler: (0, DU5.createBoundedQueueExportPromiseHandler)(A)
    }, {
      timeout: A.timeoutMillis
    })
  }
  bV2.createOtlpNetworkExportDelegate = CU5
})