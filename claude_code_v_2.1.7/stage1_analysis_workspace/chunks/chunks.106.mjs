
// @from(Ln 305440, Col 4)
HU2 = U((VU2) => {
  var gF0;
  Object.defineProperty(VU2, "__esModule", {
    value: !0
  });
  VU2.OutlierDetectionLoadBalancer = VU2.OutlierDetectionLoadBalancingConfig = void 0;
  VU2.setup = Bj5;
  var i_5 = XU(),
    XU2 = j8(),
    X6A = mvA(),
    IU2 = yF0(),
    n_5 = Ys(),
    a_5 = lJ1(),
    o_5 = dd(),
    uF0 = hN(),
    r_5 = gvA(),
    s_5 = WY(),
    t_5 = "outlier_detection";

  function SF(A) {
    s_5.trace(XU2.LogVerbosity.DEBUG, t_5, A)
  }
  var cF0 = "outlier_detection",
    e_5 = ((gF0 = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && gF0 !== void 0 ? gF0 : "true") === "true",
    Aj5 = {
      stdev_factor: 1900,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 100
    },
    Qj5 = {
      threshold: 85,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 50
    };

  function gFA(A, Q, B, G) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) {
      let Z = G ? `${G}.${Q}` : Q;
      throw Error(`outlier detection config ${Z} parse error: expected ${B}, got ${typeof A[Q]}`)
    }
  }

  function mF0(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (Q in A && A[Q] !== void 0) {
      if (!(0, X6A.isDuration)(A[Q])) throw Error(`outlier detection config ${G} parse error: expected Duration, got ${typeof A[Q]}`);
      if (!(A[Q].seconds >= 0 && A[Q].seconds <= 315576000000 && A[Q].nanos >= 0 && A[Q].nanos <= 999999999)) throw Error(`outlier detection config ${G} parse error: values out of range for non-negative Duaration`)
    }
  }

  function sX1(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (gFA(A, Q, "number", B), Q in A && A[Q] !== void 0 && !(A[Q] >= 0 && A[Q] <= 100)) throw Error(`outlier detection config ${G} parse error: value out of range for percentage (0-100)`)
  }
  class nvA {
    constructor(A, Q, B, G, Z, Y, J) {
      if (this.childPolicy = J, J.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
      this.intervalMs = A !== null && A !== void 0 ? A : 1e4, this.baseEjectionTimeMs = Q !== null && Q !== void 0 ? Q : 30000, this.maxEjectionTimeMs = B !== null && B !== void 0 ? B : 300000, this.maxEjectionPercent = G !== null && G !== void 0 ? G : 10, this.successRateEjection = Z ? Object.assign(Object.assign({}, Aj5), Z) : null, this.failurePercentageEjection = Y ? Object.assign(Object.assign({}, Qj5), Y) : null
    }
    getLoadBalancerName() {
      return cF0
    }
    toJsonObject() {
      var A, Q;
      return {
        outlier_detection: {
          interval: (0, X6A.msToDuration)(this.intervalMs),
          base_ejection_time: (0, X6A.msToDuration)(this.baseEjectionTimeMs),
          max_ejection_time: (0, X6A.msToDuration)(this.maxEjectionTimeMs),
          max_ejection_percent: this.maxEjectionPercent,
          success_rate_ejection: (A = this.successRateEjection) !== null && A !== void 0 ? A : void 0,
          failure_percentage_ejection: (Q = this.failurePercentageEjection) !== null && Q !== void 0 ? Q : void 0,
          child_policy: [this.childPolicy.toJsonObject()]
        }
      }
    }
    getIntervalMs() {
      return this.intervalMs
    }
    getBaseEjectionTimeMs() {
      return this.baseEjectionTimeMs
    }
    getMaxEjectionTimeMs() {
      return this.maxEjectionTimeMs
    }
    getMaxEjectionPercent() {
      return this.maxEjectionPercent
    }
    getSuccessRateEjectionConfig() {
      return this.successRateEjection
    }
    getFailurePercentageEjectionConfig() {
      return this.failurePercentageEjection
    }
    getChildPolicy() {
      return this.childPolicy
    }
    static createFromJson(A) {
      var Q;
      if (mF0(A, "interval"), mF0(A, "base_ejection_time"), mF0(A, "max_ejection_time"), sX1(A, "max_ejection_percent"), "success_rate_ejection" in A && A.success_rate_ejection !== void 0) {
        if (typeof A.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
        gFA(A.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), sX1(A.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), gFA(A.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), gFA(A.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
      }
      if ("failure_percentage_ejection" in A && A.failure_percentage_ejection !== void 0) {
        if (typeof A.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
        sX1(A.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), sX1(A.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), gFA(A.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), gFA(A.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
      }
      if (!("child_policy" in A) || !Array.isArray(A.child_policy)) throw Error("outlier detection config child_policy must be an array");
      let B = (0, n_5.selectLbConfigFromList)(A.child_policy);
      if (!B) throw Error("outlier detection config child_policy: no valid recognized policy found");
      return new nvA(A.interval ? (0, X6A.durationToMs)(A.interval) : null, A.base_ejection_time ? (0, X6A.durationToMs)(A.base_ejection_time) : null, A.max_ejection_time ? (0, X6A.durationToMs)(A.max_ejection_time) : null, (Q = A.max_ejection_percent) !== null && Q !== void 0 ? Q : null, A.success_rate_ejection, A.failure_percentage_ejection, B)
    }
  }
  VU2.OutlierDetectionLoadBalancingConfig = nvA;
  class DU2 extends r_5.BaseSubchannelWrapper {
    constructor(A, Q) {
      super(A);
      this.mapEntry = Q, this.refCount = 0
    }
    ref() {
      this.child.ref(), this.refCount += 1
    }
    unref() {
      if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) {
        if (this.mapEntry) {
          let A = this.mapEntry.subchannelWrappers.indexOf(this);
          if (A >= 0) this.mapEntry.subchannelWrappers.splice(A, 1)
        }
      }
    }
    eject() {
      this.setHealthy(!1)
    }
    uneject() {
      this.setHealthy(!0)
    }
    getMapEntry() {
      return this.mapEntry
    }
    getWrappedSubchannel() {
      return this.child
    }
  }

  function dF0() {
    return {
      success: 0,
      failure: 0
    }
  }
  class WU2 {
    constructor() {
      this.activeBucket = dF0(), this.inactiveBucket = dF0()
    }
    addSuccess() {
      this.activeBucket.success += 1
    }
    addFailure() {
      this.activeBucket.failure += 1
    }
    switchBuckets() {
      this.inactiveBucket = this.activeBucket, this.activeBucket = dF0()
    }
    getLastSuccesses() {
      return this.inactiveBucket.success
    }
    getLastFailures() {
      return this.inactiveBucket.failure
    }
  }
  class KU2 {
    constructor(A, Q) {
      this.wrappedPicker = A, this.countCalls = Q
    }
    pick(A) {
      let Q = this.wrappedPicker.pick(A);
      if (Q.pickResultType === o_5.PickResultType.COMPLETE) {
        let B = Q.subchannel,
          G = B.getMapEntry();
        if (G) {
          let Z = Q.onCallEnded;
          if (this.countCalls) Z = (Y, J, X) => {
            var I;
            if (Y === XU2.Status.OK) G.counter.addSuccess();
            else G.counter.addFailure();
            (I = Q.onCallEnded) === null || I === void 0 || I.call(Q, Y, J, X)
          };
          return Object.assign(Object.assign({}, Q), {
            subchannel: B.getWrappedSubchannel(),
            onCallEnded: Z
          })
        } else return Object.assign(Object.assign({}, Q), {
          subchannel: B.getWrappedSubchannel()
        })
      } else return Q
    }
  }
  class pF0 {
    constructor(A) {
      this.entryMap = new uF0.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new a_5.ChildLoadBalancerHandler((0, IU2.createChildChannelControlHelper)(A, {
        createSubchannel: (Q, B) => {
          let G = A.createSubchannel(Q, B),
            Z = this.entryMap.getForSubchannelAddress(Q),
            Y = new DU2(G, Z);
          if ((Z === null || Z === void 0 ? void 0 : Z.currentEjectionTimestamp) !== null) Y.eject();
          return Z === null || Z === void 0 || Z.subchannelWrappers.push(Y), Y
        },
        updateState: (Q, B, G) => {
          if (Q === i_5.ConnectivityState.READY) A.updateState(Q, new KU2(B, this.isCountingEnabled()), G);
          else A.updateState(Q, B, G)
        }
      })), this.ejectionTimer = setInterval(() => {}, 0), clearInterval(this.ejectionTimer)
    }
    isCountingEnabled() {
      return this.latestConfig !== null && (this.latestConfig.getSuccessRateEjectionConfig() !== null || this.latestConfig.getFailurePercentageEjectionConfig() !== null)
    }
    getCurrentEjectionPercent() {
      let A = 0;
      for (let Q of this.entryMap.values())
        if (Q.currentEjectionTimestamp !== null) A += 1;
      return A * 100 / this.entryMap.size
    }
    runSuccessRateCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getSuccessRateEjectionConfig();
      if (!Q) return;
      SF("Running success rate check");
      let B = Q.request_volume,
        G = 0,
        Z = [];
      for (let [W, K] of this.entryMap.entries()) {
        let V = K.counter.getLastSuccesses(),
          F = K.counter.getLastFailures();
        if (SF("Stats for " + (0, uF0.endpointToString)(W) + ": successes=" + V + " failures=" + F + " targetRequestVolume=" + B), V + F >= B) G += 1, Z.push(V / (V + F))
      }
      if (SF("Found " + G + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + Z + "]"), G < Q.minimum_hosts) return;
      let Y = Z.reduce((W, K) => W + K) / Z.length,
        J = 0;
      for (let W of Z) {
        let K = W - Y;
        J += K * K
      }
      let X = J / Z.length,
        I = Math.sqrt(X),
        D = Y - I * (Q.stdev_factor / 1000);
      SF("stdev=" + I + " ejectionThreshold=" + D);
      for (let [W, K] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let V = K.counter.getLastSuccesses(),
          F = K.counter.getLastFailures();
        if (V + F < B) continue;
        let H = V / (V + F);
        if (SF("Checking candidate " + W + " successRate=" + H), H < D) {
          let E = Math.random() * 100;
          if (SF("Candidate " + W + " randomNumber=" + E + " enforcement_percentage=" + Q.enforcement_percentage), E < Q.enforcement_percentage) SF("Ejecting candidate " + W), this.eject(K, A)
        }
      }
    }
    runFailurePercentageCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getFailurePercentageEjectionConfig();
      if (!Q) return;
      SF("Running failure percentage check. threshold=" + Q.threshold + " request volume threshold=" + Q.request_volume);
      let B = 0;
      for (let G of this.entryMap.values()) {
        let Z = G.counter.getLastSuccesses(),
          Y = G.counter.getLastFailures();
        if (Z + Y >= Q.request_volume) B += 1
      }
      if (B < Q.minimum_hosts) return;
      for (let [G, Z] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let Y = Z.counter.getLastSuccesses(),
          J = Z.counter.getLastFailures();
        if (SF("Candidate successes=" + Y + " failures=" + J), Y + J < Q.request_volume) continue;
        if (J * 100 / (J + Y) > Q.threshold) {
          let I = Math.random() * 100;
          if (SF("Candidate " + G + " randomNumber=" + I + " enforcement_percentage=" + Q.enforcement_percentage), I < Q.enforcement_percentage) SF("Ejecting candidate " + G), this.eject(Z, A)
        }
      }
    }
    eject(A, Q) {
      A.currentEjectionTimestamp = new Date, A.ejectionTimeMultiplier += 1;
      for (let B of A.subchannelWrappers) B.eject()
    }
    uneject(A) {
      A.currentEjectionTimestamp = null;
      for (let Q of A.subchannelWrappers) Q.uneject()
    }
    switchAllBuckets() {
      for (let A of this.entryMap.values()) A.counter.switchBuckets()
    }
    startTimer(A) {
      var Q, B;
      this.ejectionTimer = setTimeout(() => this.runChecks(), A), (B = (Q = this.ejectionTimer).unref) === null || B === void 0 || B.call(Q)
    }
    runChecks() {
      let A = new Date;
      if (SF("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
      this.timerStartTime = A, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(A), this.runFailurePercentageCheck(A);
      for (let [Q, B] of this.entryMap.entries())
        if (B.currentEjectionTimestamp === null) {
          if (B.ejectionTimeMultiplier > 0) B.ejectionTimeMultiplier -= 1
        } else {
          let G = this.latestConfig.getBaseEjectionTimeMs(),
            Z = this.latestConfig.getMaxEjectionTimeMs(),
            Y = new Date(B.currentEjectionTimestamp.getTime());
          if (Y.setMilliseconds(Y.getMilliseconds() + Math.min(G * B.ejectionTimeMultiplier, Math.max(G, Z))), Y < new Date) SF("Unejecting " + Q), this.uneject(B)
        }
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof nvA)) return !1;
      if (SF("Received update with config: " + JSON.stringify(Q.toJsonObject(), void 0, 2)), A.ok) {
        for (let Y of A.value)
          if (!this.entryMap.has(Y)) SF("Adding map entry for " + (0, uF0.endpointToString)(Y)), this.entryMap.set(Y, {
            counter: new WU2,
            currentEjectionTimestamp: null,
            ejectionTimeMultiplier: 0,
            subchannelWrappers: []
          });
        this.entryMap.deleteMissing(A.value)
      }
      let Z = Q.getChildPolicy();
      if (this.childBalancer.updateAddressList(A, Z, B, G), Q.getSuccessRateEjectionConfig() || Q.getFailurePercentageEjectionConfig())
        if (this.timerStartTime) {
          SF("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
          let Y = Q.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
          this.startTimer(Y)
        } else SF("Starting new timer"), this.timerStartTime = new Date, this.startTimer(Q.getIntervalMs()), this.switchAllBuckets();
      else {
        SF("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
        for (let Y of this.entryMap.values()) this.uneject(Y), Y.ejectionTimeMultiplier = 0
      }
      return this.latestConfig = Q, !0
    }
    exitIdle() {
      this.childBalancer.exitIdle()
    }
    resetBackoff() {
      this.childBalancer.resetBackoff()
    }
    destroy() {
      clearTimeout(this.ejectionTimer), this.childBalancer.destroy()
    }
    getTypeName() {
      return cF0
    }
  }
  VU2.OutlierDetectionLoadBalancer = pF0;

  function Bj5() {
    if (e_5)(0, IU2.registerLoadBalancerType)(cF0, pF0, nvA)
  }
})
// @from(Ln 305796, Col 4)
CU2 = U((zU2) => {
  Object.defineProperty(zU2, "__esModule", {
    value: !0
  });
  zU2.PriorityQueue = void 0;
  var uFA = 0,
    lF0 = (A) => Math.floor(A / 2),
    tX1 = (A) => A * 2 + 1,
    avA = (A) => A * 2 + 2;
  class EU2 {
    constructor(A = (Q, B) => Q > B) {
      this.comparator = A, this.heap = []
    }
    size() {
      return this.heap.length
    }
    isEmpty() {
      return this.size() == 0
    }
    peek() {
      return this.heap[uFA]
    }
    push(...A) {
      return A.forEach((Q) => {
        this.heap.push(Q), this.siftUp()
      }), this.size()
    }
    pop() {
      let A = this.peek(),
        Q = this.size() - 1;
      if (Q > uFA) this.swap(uFA, Q);
      return this.heap.pop(), this.siftDown(), A
    }
    replace(A) {
      let Q = this.peek();
      return this.heap[uFA] = A, this.siftDown(), Q
    }
    greater(A, Q) {
      return this.comparator(this.heap[A], this.heap[Q])
    }
    swap(A, Q) {
      [this.heap[A], this.heap[Q]] = [this.heap[Q], this.heap[A]]
    }
    siftUp() {
      let A = this.size() - 1;
      while (A > uFA && this.greater(A, lF0(A))) this.swap(A, lF0(A)), A = lF0(A)
    }
    siftDown() {
      let A = uFA;
      while (tX1(A) < this.size() && this.greater(tX1(A), A) || avA(A) < this.size() && this.greater(avA(A), A)) {
        let Q = avA(A) < this.size() && this.greater(avA(A), tX1(A)) ? avA(A) : tX1(A);
        this.swap(A, Q), A = Q
      }
    }
  }
  zU2.PriorityQueue = EU2
})
// @from(Ln 305853, Col 4)
_U2 = U((MU2) => {
  Object.defineProperty(MU2, "__esModule", {
    value: !0
  });
  MU2.WeightedRoundRobinLoadBalancingConfig = void 0;
  MU2.setup = Ej5;
  var xF = XU(),
    Yj5 = j8(),
    NO = mvA(),
    NU2 = Ys(),
    Jj5 = pvA(),
    Xj5 = WY(),
    wU2 = mX1(),
    mFA = dd(),
    Ij5 = CU2(),
    UU2 = hN(),
    Dj5 = "weighted_round_robin";

  function iF0(A) {
    Xj5.trace(Yj5.LogVerbosity.DEBUG, Dj5, A)
  }
  var nF0 = "weighted_round_robin",
    Wj5 = 1e4,
    Kj5 = 1e4,
    Vj5 = 180000,
    Fj5 = 1000,
    Hj5 = 1;

  function qU2(A, Q, B) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) throw Error(`weighted round robin config ${Q} parse error: expected ${B}, got ${typeof A[Q]}`)
  }

  function eX1(A, Q) {
    if (Q in A && A[Q] !== void 0 && A[Q] !== null) {
      let B;
      if ((0, NO.isDuration)(A[Q])) B = A[Q];
      else if ((0, NO.isDurationMessage)(A[Q])) B = (0, NO.durationMessageToDuration)(A[Q]);
      else if (typeof A[Q] === "string") {
        let G = (0, NO.parseDuration)(A[Q]);
        if (!G) throw Error(`weighted round robin config ${Q}: failed to parse duration string ${A[Q]}`);
        B = G
      } else throw Error(`weighted round robin config ${Q}: expected duration, got ${typeof A[Q]}`);
      return (0, NO.durationToMs)(B)
    }
    return null
  }
  class ovA {
    constructor(A, Q, B, G, Z, Y) {
      this.enableOobLoadReport = A !== null && A !== void 0 ? A : !1, this.oobLoadReportingPeriodMs = Q !== null && Q !== void 0 ? Q : Wj5, this.blackoutPeriodMs = B !== null && B !== void 0 ? B : Kj5, this.weightExpirationPeriodMs = G !== null && G !== void 0 ? G : Vj5, this.weightUpdatePeriodMs = Math.max(Z !== null && Z !== void 0 ? Z : Fj5, 100), this.errorUtilizationPenalty = Y !== null && Y !== void 0 ? Y : Hj5
    }
    getLoadBalancerName() {
      return nF0
    }
    toJsonObject() {
      return {
        enable_oob_load_report: this.enableOobLoadReport,
        oob_load_reporting_period: (0, NO.durationToString)((0, NO.msToDuration)(this.oobLoadReportingPeriodMs)),
        blackout_period: (0, NO.durationToString)((0, NO.msToDuration)(this.blackoutPeriodMs)),
        weight_expiration_period: (0, NO.durationToString)((0, NO.msToDuration)(this.weightExpirationPeriodMs)),
        weight_update_period: (0, NO.durationToString)((0, NO.msToDuration)(this.weightUpdatePeriodMs)),
        error_utilization_penalty: this.errorUtilizationPenalty
      }
    }
    static createFromJson(A) {
      if (qU2(A, "enable_oob_load_report", "boolean"), qU2(A, "error_utilization_penalty", "number"), A.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
      return new ovA(A.enable_oob_load_report, eX1(A, "oob_load_reporting_period"), eX1(A, "blackout_period"), eX1(A, "weight_expiration_period"), eX1(A, "weight_update_period"), A.error_utilization_penalty)
    }
    getEnableOobLoadReport() {
      return this.enableOobLoadReport
    }
    getOobLoadReportingPeriodMs() {
      return this.oobLoadReportingPeriodMs
    }
    getBlackoutPeriodMs() {
      return this.blackoutPeriodMs
    }
    getWeightExpirationPeriodMs() {
      return this.weightExpirationPeriodMs
    }
    getWeightUpdatePeriodMs() {
      return this.weightUpdatePeriodMs
    }
    getErrorUtilizationPenalty() {
      return this.errorUtilizationPenalty
    }
  }
  MU2.WeightedRoundRobinLoadBalancingConfig = ovA;
  class LU2 {
    constructor(A, Q) {
      this.metricsHandler = Q, this.queue = new Ij5.PriorityQueue((Z, Y) => Z.deadline < Y.deadline);
      let B = A.filter((Z) => Z.weight > 0),
        G;
      if (B.length < 2) G = 1;
      else {
        let Z = 0;
        for (let {
            weight: Y
          }
          of B) Z += Y;
        G = Z / B.length
      }
      for (let Z of A) {
        let Y = Z.weight > 0 ? 1 / Z.weight : G;
        this.queue.push({
          endpointName: Z.endpointName,
          picker: Z.picker,
          period: Y,
          deadline: Math.random() * Y
        })
      }
    }
    pick(A) {
      let Q = this.queue.pop();
      this.queue.push(Object.assign(Object.assign({}, Q), {
        deadline: Q.deadline + Q.period
      }));
      let B = Q.picker.pick(A);
      if (B.pickResultType === mFA.PickResultType.COMPLETE)
        if (this.metricsHandler) return Object.assign(Object.assign({}, B), {
          onCallEnded: (0, wU2.createMetricsReader)((G) => this.metricsHandler(G, Q.endpointName), B.onCallEnded)
        });
        else {
          let G = B.subchannel;
          return Object.assign(Object.assign({}, B), {
            subchannel: G.getWrappedSubchannel()
          })
        }
      else return B
    }
  }
  class OU2 {
    constructor(A) {
      this.channelControlHelper = A, this.latestConfig = null, this.children = new Map, this.currentState = xF.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
    }
    countChildrenWithState(A) {
      let Q = 0;
      for (let B of this.children.values())
        if (B.child.getConnectivityState() === A) Q += 1;
      return Q
    }
    updateWeight(A, Q) {
      var B, G;
      let {
        rps_fractional: Z,
        application_utilization: Y
      } = Q;
      if (Y > 0 && Z > 0) Y += Q.eps / Z * ((G = (B = this.latestConfig) === null || B === void 0 ? void 0 : B.getErrorUtilizationPenalty()) !== null && G !== void 0 ? G : 0);
      let J = Y === 0 ? 0 : Z / Y;
      if (J === 0) return;
      let X = new Date;
      if (A.nonEmptySince === null) A.nonEmptySince = X;
      A.lastUpdated = X, A.weight = J
    }
    getWeight(A) {
      if (!this.latestConfig) return 0;
      let Q = new Date().getTime();
      if (Q - A.lastUpdated.getTime() >= this.latestConfig.getWeightExpirationPeriodMs()) return A.nonEmptySince = null, 0;
      let B = this.latestConfig.getBlackoutPeriodMs();
      if (B > 0 && (A.nonEmptySince === null || Q - A.nonEmptySince.getTime() < B)) return 0;
      return A.weight
    }
    calculateAndUpdateState() {
      if (this.updatesPaused || !this.latestConfig) return;
      if (this.countChildrenWithState(xF.ConnectivityState.READY) > 0) {
        let A = [];
        for (let [B, G] of this.children) {
          if (G.child.getConnectivityState() !== xF.ConnectivityState.READY) continue;
          A.push({
            endpointName: B,
            picker: G.child.getPicker(),
            weight: this.getWeight(G)
          })
        }
        iF0("Created picker with weights: " + A.map((B) => B.endpointName + ":" + B.weight).join(","));
        let Q;
        if (!this.latestConfig.getEnableOobLoadReport()) Q = (B, G) => {
          let Z = this.children.get(G);
          if (Z) this.updateWeight(Z, B)
        };
        else Q = null;
        this.updateState(xF.ConnectivityState.READY, new LU2(A, Q), null)
      } else if (this.countChildrenWithState(xF.ConnectivityState.CONNECTING) > 0) this.updateState(xF.ConnectivityState.CONNECTING, new mFA.QueuePicker(this), null);
      else if (this.countChildrenWithState(xF.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(xF.ConnectivityState.TRANSIENT_FAILURE, new mFA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(xF.ConnectivityState.IDLE, new mFA.QueuePicker(this), null);
      for (let {
          child: A
        }
        of this.children.values())
        if (A.getConnectivityState() === xF.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      iF0(xF.ConnectivityState[this.currentState] + " -> " + xF.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    updateAddressList(A, Q, B, G) {
      var Z, Y;
      if (!(Q instanceof ovA)) return !1;
      if (!A.ok) {
        if (this.children.size === 0) this.updateState(xF.ConnectivityState.TRANSIENT_FAILURE, new mFA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      if (A.value.length === 0) {
        let I = `No addresses resolved. Resolution note: ${G}`;
        return this.updateState(xF.ConnectivityState.TRANSIENT_FAILURE, new mFA.UnavailablePicker({
          details: I
        }), I), !1
      }
      iF0("Connect to endpoint list " + A.value.map(UU2.endpointToString));
      let J = new Date,
        X = new Set;
      this.updatesPaused = !0, this.latestConfig = Q;
      for (let I of A.value) {
        let D = (0, UU2.endpointToString)(I);
        X.add(D);
        let W = this.children.get(D);
        if (!W) W = {
          child: new Jj5.LeafLoadBalancer(I, (0, NU2.createChildChannelControlHelper)(this.channelControlHelper, {
            updateState: (K, V, F) => {
              if (this.currentState === xF.ConnectivityState.READY && K !== xF.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
              if (K === xF.ConnectivityState.READY) W.nonEmptySince = null;
              if (F) this.lastError = F;
              this.calculateAndUpdateState()
            },
            createSubchannel: (K, V) => {
              let F = this.channelControlHelper.createSubchannel(K, V);
              if (W === null || W === void 0 ? void 0 : W.oobMetricsListener) return new wU2.OrcaOobMetricsSubchannelWrapper(F, W.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
              else return F
            }
          }), B, G),
          lastUpdated: J,
          nonEmptySince: null,
          weight: 0,
          oobMetricsListener: null
        }, this.children.set(D, W);
        if (Q.getEnableOobLoadReport()) W.oobMetricsListener = (K) => {
          this.updateWeight(W, K)
        };
        else W.oobMetricsListener = null
      }
      for (let [I, D] of this.children)
        if (X.has(I)) D.child.startConnecting();
        else D.child.destroy(), this.children.delete(I);
      if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
      return this.weightUpdateTimer = (Y = (Z = setInterval(() => {
        if (this.currentState === xF.ConnectivityState.READY) this.calculateAndUpdateState()
      }, Q.getWeightUpdatePeriodMs())).unref) === null || Y === void 0 ? void 0 : Y.call(Z), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      for (let A of this.children.values()) A.child.destroy();
      if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
    }
    getTypeName() {
      return nF0
    }
  }

  function Ej5() {
    (0, NU2.registerLoadBalancerType)(nF0, OU2, ovA)
  }
})
// @from(Ln 306118, Col 4)
rvA = U((VZ) => {
  Object.defineProperty(VZ, "__esModule", {
    value: !0
  });
  VZ.experimental = VZ.ServerMetricRecorder = VZ.ServerInterceptingCall = VZ.ResponderBuilder = VZ.ServerListenerBuilder = VZ.addAdminServicesToServer = VZ.getChannelzHandlers = VZ.getChannelzServiceDefinition = VZ.InterceptorConfigurationError = VZ.InterceptingCall = VZ.RequesterBuilder = VZ.ListenerBuilder = VZ.StatusBuilder = VZ.getClientChannel = VZ.ServerCredentials = VZ.Server = VZ.setLogVerbosity = VZ.setLogger = VZ.load = VZ.loadObject = VZ.CallCredentials = VZ.ChannelCredentials = VZ.waitForClientReady = VZ.closeClient = VZ.Channel = VZ.makeGenericClientConstructor = VZ.makeClientConstructor = VZ.loadPackageDefinition = VZ.Client = VZ.compressionAlgorithms = VZ.propagate = VZ.connectivityState = VZ.status = VZ.logVerbosity = VZ.Metadata = VZ.credentials = void 0;
  var AI1 = fJ1();
  Object.defineProperty(VZ, "CallCredentials", {
    enumerable: !0,
    get: function () {
      return AI1.CallCredentials
    }
  });
  var $j5 = iK0();
  Object.defineProperty(VZ, "Channel", {
    enumerable: !0,
    get: function () {
      return $j5.ChannelImplementation
    }
  });
  var Cj5 = pV0();
  Object.defineProperty(VZ, "compressionAlgorithms", {
    enumerable: !0,
    get: function () {
      return Cj5.CompressionAlgorithms
    }
  });
  var Uj5 = XU();
  Object.defineProperty(VZ, "connectivityState", {
    enumerable: !0,
    get: function () {
      return Uj5.ConnectivityState
    }
  });
  var QI1 = FFA();
  Object.defineProperty(VZ, "ChannelCredentials", {
    enumerable: !0,
    get: function () {
      return QI1.ChannelCredentials
    }
  });
  var jU2 = lK0();
  Object.defineProperty(VZ, "Client", {
    enumerable: !0,
    get: function () {
      return jU2.Client
    }
  });
  var aF0 = j8();
  Object.defineProperty(VZ, "logVerbosity", {
    enumerable: !0,
    get: function () {
      return aF0.LogVerbosity
    }
  });
  Object.defineProperty(VZ, "status", {
    enumerable: !0,
    get: function () {
      return aF0.Status
    }
  });
  Object.defineProperty(VZ, "propagate", {
    enumerable: !0,
    get: function () {
      return aF0.Propagate
    }
  });
  var TU2 = WY(),
    oF0 = oJ1();
  Object.defineProperty(VZ, "loadPackageDefinition", {
    enumerable: !0,
    get: function () {
      return oF0.loadPackageDefinition
    }
  });
  Object.defineProperty(VZ, "makeClientConstructor", {
    enumerable: !0,
    get: function () {
      return oF0.makeClientConstructor
    }
  });
  Object.defineProperty(VZ, "makeGenericClientConstructor", {
    enumerable: !0,
    get: function () {
      return oF0.makeClientConstructor
    }
  });
  var qj5 = jF();
  Object.defineProperty(VZ, "Metadata", {
    enumerable: !0,
    get: function () {
      return qj5.Metadata
    }
  });
  var Nj5 = NC2();
  Object.defineProperty(VZ, "Server", {
    enumerable: !0,
    get: function () {
      return Nj5.Server
    }
  });
  var wj5 = gX1();
  Object.defineProperty(VZ, "ServerCredentials", {
    enumerable: !0,
    get: function () {
      return wj5.ServerCredentials
    }
  });
  var Lj5 = MC2();
  Object.defineProperty(VZ, "StatusBuilder", {
    enumerable: !0,
    get: function () {
      return Lj5.StatusBuilder
    }
  });
  VZ.credentials = {
    combineChannelCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    combineCallCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    createInsecure: QI1.ChannelCredentials.createInsecure,
    createSsl: QI1.ChannelCredentials.createSsl,
    createFromSecureContext: QI1.ChannelCredentials.createFromSecureContext,
    createFromMetadataGenerator: AI1.CallCredentials.createFromMetadataGenerator,
    createFromGoogleCredential: AI1.CallCredentials.createFromGoogleCredential,
    createEmpty: AI1.CallCredentials.createEmpty
  };
  var Oj5 = (A) => A.close();
  VZ.closeClient = Oj5;
  var Mj5 = (A, Q, B) => A.waitForReady(Q, B);
  VZ.waitForClientReady = Mj5;
  var Rj5 = (A, Q) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  VZ.loadObject = Rj5;
  var _j5 = (A, Q, B) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  VZ.load = _j5;
  var jj5 = (A) => {
    TU2.setLogger(A)
  };
  VZ.setLogger = jj5;
  var Tj5 = (A) => {
    TU2.setLoggerVerbosity(A)
  };
  VZ.setLogVerbosity = Tj5;
  var Pj5 = (A) => {
    return jU2.Client.prototype.getChannel.call(A)
  };
  VZ.getClientChannel = Pj5;
  var BI1 = cK0();
  Object.defineProperty(VZ, "ListenerBuilder", {
    enumerable: !0,
    get: function () {
      return BI1.ListenerBuilder
    }
  });
  Object.defineProperty(VZ, "RequesterBuilder", {
    enumerable: !0,
    get: function () {
      return BI1.RequesterBuilder
    }
  });
  Object.defineProperty(VZ, "InterceptingCall", {
    enumerable: !0,
    get: function () {
      return BI1.InterceptingCall
    }
  });
  Object.defineProperty(VZ, "InterceptorConfigurationError", {
    enumerable: !0,
    get: function () {
      return BI1.InterceptorConfigurationError
    }
  });
  var PU2 = Vs();
  Object.defineProperty(VZ, "getChannelzServiceDefinition", {
    enumerable: !0,
    get: function () {
      return PU2.getChannelzServiceDefinition
    }
  });
  Object.defineProperty(VZ, "getChannelzHandlers", {
    enumerable: !0,
    get: function () {
      return PU2.getChannelzHandlers
    }
  });
  var Sj5 = nJ1();
  Object.defineProperty(VZ, "addAdminServicesToServer", {
    enumerable: !0,
    get: function () {
      return Sj5.addAdminServicesToServer
    }
  });
  var rF0 = MF0();
  Object.defineProperty(VZ, "ServerListenerBuilder", {
    enumerable: !0,
    get: function () {
      return rF0.ServerListenerBuilder
    }
  });
  Object.defineProperty(VZ, "ResponderBuilder", {
    enumerable: !0,
    get: function () {
      return rF0.ResponderBuilder
    }
  });
  Object.defineProperty(VZ, "ServerInterceptingCall", {
    enumerable: !0,
    get: function () {
      return rF0.ServerInterceptingCall
    }
  });
  var xj5 = mX1();
  Object.defineProperty(VZ, "ServerMetricRecorder", {
    enumerable: !0,
    get: function () {
      return xj5.ServerMetricRecorder
    }
  });
  var yj5 = yF0();
  VZ.experimental = yj5;
  var vj5 = QF0(),
    kj5 = iC2(),
    bj5 = eC2(),
    fj5 = pvA(),
    hj5 = JU2(),
    gj5 = HU2(),
    uj5 = _U2(),
    mj5 = Vs();
  (() => {
    vj5.setup(), kj5.setup(), bj5.setup(), fj5.setup(), hj5.setup(), gj5.setup(), uj5.setup(), mj5.setup()
  })()
})
// @from(Ln 306355, Col 4)
vU2 = U((xU2) => {
  Object.defineProperty(xU2, "__esModule", {
    value: !0
  });
  xU2.createServiceClientConstructor = void 0;
  var rj5 = rvA();

  function sj5(A, Q) {
    let B = {
      export: {
        path: A,
        requestStream: !1,
        responseStream: !1,
        requestSerialize: (G) => {
          return G
        },
        requestDeserialize: (G) => {
          return G
        },
        responseSerialize: (G) => {
          return G
        },
        responseDeserialize: (G) => {
          return G
        }
      }
    };
    return rj5.makeGenericClientConstructor(B, Q)
  }
  xU2.createServiceClientConstructor = sj5
})
// @from(Ln 306386, Col 4)
svA = U((bU2) => {
  Object.defineProperty(bU2, "__esModule", {
    value: !0
  });
  bU2.createOtlpGrpcExporterTransport = bU2.GrpcExporterTransport = bU2.createEmptyMetadata = bU2.createSslCredentials = bU2.createInsecureCredentials = void 0;
  var tj5 = eK2(),
    kU2 = `OTel-OTLP-Exporter-JavaScript/${tj5.VERSION}`;

  function ej5(A) {
    if (A) return `${A} ${kU2}`;
    return kU2
  }
  var AT5 = 0,
    QT5 = 2;

  function BT5(A) {
    return A === "gzip" ? QT5 : AT5
  }

  function GT5() {
    let {
      credentials: A
    } = rvA();
    return A.createInsecure()
  }
  bU2.createInsecureCredentials = GT5;

  function ZT5(A, Q, B) {
    let {
      credentials: G
    } = rvA();
    return G.createSsl(A, Q, B)
  }
  bU2.createSslCredentials = ZT5;

  function YT5() {
    let {
      Metadata: A
    } = rvA();
    return new A
  }
  bU2.createEmptyMetadata = YT5;
  class sF0 {
    _parameters;
    _client;
    _metadata;
    constructor(A) {
      this._parameters = A
    }
    shutdown() {
      this._client?.close()
    }
    send(A, Q) {
      let B = Buffer.from(A);
      if (this._client == null) {
        let {
          createServiceClientConstructor: G
        } = vU2();
        try {
          this._metadata = this._parameters.metadata()
        } catch (Y) {
          return Promise.resolve({
            status: "failure",
            error: Y
          })
        }
        let Z = G(this._parameters.grpcPath, this._parameters.grpcName);
        try {
          this._client = new Z(this._parameters.address, this._parameters.credentials(), {
            "grpc.default_compression_algorithm": BT5(this._parameters.compression),
            "grpc.primary_user_agent": ej5(this._parameters.userAgent)
          })
        } catch (Y) {
          return Promise.resolve({
            status: "failure",
            error: Y
          })
        }
      }
      return new Promise((G) => {
        let Z = Date.now() + Q;
        if (this._metadata == null) return G({
          error: Error("metadata was null"),
          status: "failure"
        });
        this._client.export(B, this._metadata, {
          deadline: Z
        }, (Y, J) => {
          if (Y) G({
            status: "failure",
            error: Y
          });
          else G({
            data: J,
            status: "success"
          })
        })
      })
    }
  }
  bU2.GrpcExporterTransport = sF0;

  function JT5(A) {
    return new sF0(A)
  }
  bU2.createOtlpGrpcExporterTransport = JT5
})
// @from(Ln 306493, Col 4)
pU2 = U((dU2) => {
  Object.defineProperty(dU2, "__esModule", {
    value: !0
  });
  dU2.getOtlpGrpcDefaultConfiguration = dU2.mergeOtlpGrpcConfigurationWithDefaults = dU2.validateAndNormalizeUrl = void 0;
  var uU2 = ib(),
    tvA = svA(),
    KT5 = NA("url"),
    hU2 = p9();

  function mU2(A) {
    if (A = A.trim(), !A.match(/^([\w]{1,8}):\/\//)) A = `https://${A}`;
    let B = new KT5.URL(A);
    if (B.protocol === "unix:") return A;
    if (B.pathname && B.pathname !== "/") hU2.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
    if (B.protocol !== "" && !B.protocol?.match(/^(http)s?:$/)) hU2.diag.warn("URL protocol should be http(s)://. Using http://.");
    return B.host
  }
  dU2.validateAndNormalizeUrl = mU2;

  function gU2(A, Q) {
    for (let [B, G] of Object.entries(Q.getMap()))
      if (A.get(B).length < 1) A.set(B, G)
  }

  function VT5(A, Q, B) {
    let G = A.url ?? Q.url ?? B.url;
    return {
      ...(0, uU2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      metadata: () => {
        let Z = B.metadata();
        return gU2(Z, A.metadata?.().clone() ?? (0, tvA.createEmptyMetadata)()), gU2(Z, Q.metadata?.() ?? (0, tvA.createEmptyMetadata)()), Z
      },
      url: mU2(G),
      credentials: A.credentials ?? Q.credentials?.(G) ?? B.credentials(G),
      userAgent: A.userAgent
    }
  }
  dU2.mergeOtlpGrpcConfigurationWithDefaults = VT5;

  function FT5() {
    return {
      ...(0, uU2.getSharedConfigurationDefaults)(),
      metadata: () => (0, tvA.createEmptyMetadata)(),
      url: "http://localhost:4317",
      credentials: (A) => {
        if (A.startsWith("http://")) return () => (0, tvA.createInsecureCredentials)();
        else return () => (0, tvA.createSslCredentials)()
      }
    }
  }
  dU2.getOtlpGrpcDefaultConfiguration = FT5
})
// @from(Ln 306546, Col 4)
sU2 = U((oU2) => {
  Object.defineProperty(oU2, "__esModule", {
    value: !0
  });
  oU2.getOtlpGrpcConfigurationFromEnv = void 0;
  var lU2 = h8(),
    evA = svA(),
    zT5 = md(),
    $T5 = NA("fs"),
    CT5 = NA("path"),
    nU2 = p9();

  function tF0(A, Q) {
    if (A != null && A !== "") return A;
    if (Q != null && Q !== "") return Q;
    return
  }

  function UT5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_HEADERS`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
      G = (0, lU2.parseKeyPairsIntoRecord)(Q),
      Z = (0, lU2.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    let Y = Object.assign({}, Z, G),
      J = (0, evA.createEmptyMetadata)();
    for (let [X, I] of Object.entries(Y)) J.set(X, I);
    return J
  }

  function qT5(A) {
    let Q = UT5(A);
    if (Q == null) return;
    return () => Q
  }

  function NT5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
    return tF0(Q, B)
  }

  function wT5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_INSECURE`]?.toLowerCase().trim(),
      B = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
    return tF0(Q, B) === "true"
  }

  function eF0(A, Q, B) {
    let G = process.env[A]?.trim(),
      Z = process.env[Q]?.trim(),
      Y = tF0(G, Z);
    if (Y != null) try {
      return $T5.readFileSync(CT5.resolve(process.cwd(), Y))
    } catch {
      nU2.diag.warn(B);
      return
    } else return
  }

  function LT5(A) {
    return eF0(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
  }

  function OT5(A) {
    return eF0(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
  }

  function iU2(A) {
    return eF0(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
  }

  function aU2(A) {
    let Q = OT5(A),
      B = LT5(A),
      G = iU2(A),
      Z = Q != null && B != null;
    if (G != null && !Z) return nU2.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, evA.createSslCredentials)(iU2(A));
    return (0, evA.createSslCredentials)(G, Q, B)
  }

  function MT5(A) {
    if (wT5(A)) return (0, evA.createInsecureCredentials)();
    return aU2(A)
  }

  function RT5(A) {
    return {
      ...(0, zT5.getSharedConfigurationFromEnvironment)(A),
      metadata: qT5(A),
      url: NT5(A),
      credentials: (Q) => {
        if (Q.startsWith("http://")) return () => {
          return (0, evA.createInsecureCredentials)()
        };
        else if (Q.startsWith("https://")) return () => {
          return aU2(A)
        };
        return () => {
          return MT5(A)
        }
      }
    }
  }
  oU2.getOtlpGrpcConfigurationFromEnv = RT5
})
// @from(Ln 306652, Col 4)
Qq2 = U((eU2) => {
  Object.defineProperty(eU2, "__esModule", {
    value: !0
  });
  eU2.convertLegacyOtlpGrpcOptions = void 0;
  var _T5 = p9(),
    tU2 = pU2(),
    jT5 = svA(),
    TT5 = sU2();

  function PT5(A, Q) {
    if (A.headers) _T5.diag.warn("Headers cannot be set when using grpc");
    let B = A.credentials;
    return (0, tU2.mergeOtlpGrpcConfigurationWithDefaults)({
      url: A.url,
      metadata: () => {
        return A.metadata ?? (0, jT5.createEmptyMetadata)()
      },
      compression: A.compression,
      timeoutMillis: A.timeoutMillis,
      concurrencyLimit: A.concurrencyLimit,
      credentials: B != null ? () => B : void 0,
      userAgent: A.userAgent
    }, (0, TT5.getOtlpGrpcConfigurationFromEnv)(Q), (0, tU2.getOtlpGrpcDefaultConfiguration)())
  }
  eU2.convertLegacyOtlpGrpcOptions = PT5
})
// @from(Ln 306679, Col 4)
Zq2 = U((Bq2) => {
  Object.defineProperty(Bq2, "__esModule", {
    value: !0
  });
  Bq2.createOtlpGrpcExportDelegate = void 0;
  var ST5 = ib(),
    xT5 = svA();

  function yT5(A, Q, B, G) {
    return (0, ST5.createOtlpNetworkExportDelegate)(A, Q, (0, xT5.createOtlpGrpcExporterTransport)({
      address: A.url,
      compression: A.compression,
      credentials: A.credentials,
      metadata: A.metadata,
      userAgent: A.userAgent,
      grpcName: B,
      grpcPath: G
    }))
  }
  Bq2.createOtlpGrpcExportDelegate = yT5
})
// @from(Ln 306700, Col 4)
ZI1 = U((GI1) => {
  Object.defineProperty(GI1, "__esModule", {
    value: !0
  });
  GI1.createOtlpGrpcExportDelegate = GI1.convertLegacyOtlpGrpcOptions = void 0;
  var vT5 = Qq2();
  Object.defineProperty(GI1, "convertLegacyOtlpGrpcOptions", {
    enumerable: !0,
    get: function () {
      return vT5.convertLegacyOtlpGrpcOptions
    }
  });
  var kT5 = Zq2();
  Object.defineProperty(GI1, "createOtlpGrpcExportDelegate", {
    enumerable: !0,
    get: function () {
      return kT5.createOtlpGrpcExportDelegate
    }
  })
})
// @from(Ln 306720, Col 4)
Dq2 = U((Xq2) => {
  Object.defineProperty(Xq2, "__esModule", {
    value: !0
  });
  Xq2.OTLPMetricExporter = void 0;
  var fT5 = xJ1(),
    Yq2 = ZI1(),
    hT5 = ob();
  class Jq2 extends fT5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, Yq2.createOtlpGrpcExportDelegate)((0, Yq2.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"), hT5.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), A)
    }
  }
  Xq2.OTLPMetricExporter = Jq2
})
// @from(Ln 306735, Col 4)
Wq2 = U((AH0) => {
  Object.defineProperty(AH0, "__esModule", {
    value: !0
  });
  AH0.OTLPMetricExporter = void 0;
  var gT5 = Dq2();
  Object.defineProperty(AH0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return gT5.OTLPMetricExporter
    }
  })
})
// @from(Ln 306748, Col 4)
GH0 = U((Hq2) => {
  Object.defineProperty(Hq2, "__esModule", {
    value: !0
  });
  Hq2.PrometheusSerializer = void 0;
  var mT5 = p9(),
    I6A = sr(),
    Kq2 = h8();

  function JI1(A) {
    return A.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
  }

  function Vq2(A = "") {
    if (typeof A !== "string") A = JSON.stringify(A);
    return JI1(A).replace(/"/g, "\\\"")
  }
  var dT5 = /[^a-z0-9_]/gi,
    cT5 = /_{2,}/g;

  function BH0(A) {
    return A.replace(dT5, "_").replace(cT5, "_")
  }

  function QH0(A, Q) {
    if (!A.endsWith("_total") && Q.dataPointType === I6A.DataPointType.SUM && Q.isMonotonic) A = A + "_total";
    return A
  }

  function pT5(A) {
    if (A === 1 / 0) return "+Inf";
    else if (A === -1 / 0) return "-Inf";
    else return `${A}`
  }

  function lT5(A) {
    switch (A.dataPointType) {
      case I6A.DataPointType.SUM:
        if (A.isMonotonic) return "counter";
        return "gauge";
      case I6A.DataPointType.GAUGE:
        return "gauge";
      case I6A.DataPointType.HISTOGRAM:
        return "histogram";
      default:
        return "untyped"
    }
  }

  function YI1(A, Q, B, G, Z) {
    let Y = !1,
      J = "";
    for (let [X, I] of Object.entries(Q)) {
      let D = BH0(X);
      Y = !0, J += `${J.length>0?",":""}${D}="${Vq2(I)}"`
    }
    if (Z)
      for (let [X, I] of Object.entries(Z)) {
        let D = BH0(X);
        Y = !0, J += `${J.length>0?",":""}${D}="${Vq2(I)}"`
      }
    if (Y) A += `{${J}}`;
    return `${A} ${pT5(B)}${G!==void 0?" "+String(G):""}
`
  }
  var iT5 = "# no registered metrics";
  class Fq2 {
    _prefix;
    _appendTimestamp;
    _additionalAttributes;
    _withResourceConstantLabels;
    _withoutTargetInfo;
    constructor(A, Q = !1, B, G) {
      if (A) this._prefix = A + "_";
      this._appendTimestamp = Q, this._withResourceConstantLabels = B, this._withoutTargetInfo = !!G
    }
    serialize(A) {
      let Q = "";
      this._additionalAttributes = this._filterResourceConstantLabels(A.resource.attributes, this._withResourceConstantLabels);
      for (let B of A.scopeMetrics) Q += this._serializeScopeMetrics(B);
      if (Q === "") Q += iT5;
      return this._serializeResource(A.resource) + Q
    }
    _filterResourceConstantLabels(A, Q) {
      if (Q) {
        let B = {};
        for (let [G, Z] of Object.entries(A))
          if (G.match(Q)) B[G] = Z;
        return B
      }
      return
    }
    _serializeScopeMetrics(A) {
      let Q = "";
      for (let B of A.metrics) Q += this._serializeMetricData(B) + `
`;
      return Q
    }
    _serializeMetricData(A) {
      let Q = BH0(JI1(A.descriptor.name));
      if (this._prefix) Q = `${this._prefix}${Q}`;
      let B = A.dataPointType;
      Q = QH0(Q, A);
      let G = `# HELP ${Q} ${JI1(A.descriptor.description||"description missing")}`,
        Z = A.descriptor.unit ? `
# UNIT ${Q} ${JI1(A.descriptor.unit)}` : "",
        Y = `# TYPE ${Q} ${lT5(A)}`,
        J = "";
      switch (B) {
        case I6A.DataPointType.SUM:
        case I6A.DataPointType.GAUGE: {
          J = A.dataPoints.map((X) => this._serializeSingularDataPoint(Q, A, X)).join("");
          break
        }
        case I6A.DataPointType.HISTOGRAM: {
          J = A.dataPoints.map((X) => this._serializeHistogramDataPoint(Q, A, X)).join("");
          break
        }
        default:
          mT5.diag.error(`Unrecognizable DataPointType: ${B} for metric "${Q}"`)
      }
      return `${G}${Z}
${Y}
${J}`.trim()
    }
    _serializeSingularDataPoint(A, Q, B) {
      let G = "";
      A = QH0(A, Q);
      let {
        value: Z,
        attributes: Y
      } = B, J = (0, Kq2.hrTimeToMilliseconds)(B.endTime);
      return G += YI1(A, Y, Z, this._appendTimestamp ? J : void 0, this._additionalAttributes), G
    }
    _serializeHistogramDataPoint(A, Q, B) {
      let G = "";
      A = QH0(A, Q);
      let {
        attributes: Z,
        value: Y
      } = B, J = (0, Kq2.hrTimeToMilliseconds)(B.endTime);
      for (let W of ["count", "sum"]) {
        let K = Y[W];
        if (K != null) G += YI1(A + "_" + W, Z, K, this._appendTimestamp ? J : void 0, this._additionalAttributes)
      }
      let X = 0,
        I = Y.buckets.counts.entries(),
        D = !1;
      for (let [W, K] of I) {
        X += K;
        let V = Y.buckets.boundaries[W];
        if (V === void 0 && D) break;
        if (V === 1 / 0) D = !0;
        G += YI1(A + "_bucket", Z, X, this._appendTimestamp ? J : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
          le: V === void 0 || V === 1 / 0 ? "+Inf" : String(V)
        }))
      }
      return G
    }
    _serializeResource(A) {
      if (this._withoutTargetInfo === !0) return "";
      let Q = "target_info",
        B = `# HELP ${Q} Target metadata`,
        G = `# TYPE ${Q} gauge`,
        Z = YI1(Q, A.attributes, 1).trim();
      return `${B}
${G}
${Z}
`
    }
  }
  Hq2.PrometheusSerializer = Fq2
})
// @from(Ln 306921, Col 4)
Cq2 = U((zq2) => {
  Object.defineProperty(zq2, "__esModule", {
    value: !0
  });
  zq2.PrometheusExporter = void 0;
  var AkA = p9(),
    nT5 = h8(),
    ZH0 = sr(),
    aT5 = NA("http"),
    oT5 = GH0(),
    rT5 = NA("url");
  class td extends ZH0.MetricReader {
    static DEFAULT_OPTIONS = {
      host: void 0,
      port: 9464,
      endpoint: "/metrics",
      prefix: "",
      appendTimestamp: !1,
      withResourceConstantLabels: void 0,
      withoutTargetInfo: !1
    };
    _host;
    _port;
    _baseUrl;
    _endpoint;
    _server;
    _prefix;
    _appendTimestamp;
    _serializer;
    _startServerPromise;
    constructor(A = {}, Q = () => {}) {
      super({
        aggregationSelector: (Z) => {
          return {
            type: ZH0.AggregationType.DEFAULT
          }
        },
        aggregationTemporalitySelector: (Z) => ZH0.AggregationTemporality.CUMULATIVE,
        metricProducers: A.metricProducers
      });
      this._host = A.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || td.DEFAULT_OPTIONS.host, this._port = A.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || td.DEFAULT_OPTIONS.port, this._prefix = A.prefix || td.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof A.appendTimestamp === "boolean" ? A.appendTimestamp : td.DEFAULT_OPTIONS.appendTimestamp;
      let B = A.withResourceConstantLabels || td.DEFAULT_OPTIONS.withResourceConstantLabels,
        G = A.withoutTargetInfo || td.DEFAULT_OPTIONS.withoutTargetInfo;
      if (this._server = (0, aT5.createServer)(this._requestHandler).unref(), this._serializer = new oT5.PrometheusSerializer(this._prefix, this._appendTimestamp, B, G), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (A.endpoint || td.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), A.preventServerStart !== !0) this.startServer().then(Q, (Z) => {
        AkA.diag.error(Z), Q(Z)
      });
      else if (Q) queueMicrotask(Q)
    }
    async onForceFlush() {}
    onShutdown() {
      return this.stopServer()
    }
    stopServer() {
      if (!this._server) return AkA.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
      else return new Promise((A) => {
        this._server.close((Q) => {
          if (!Q) AkA.diag.debug("Prometheus exporter was stopped");
          else if (Q.code !== "ERR_SERVER_NOT_RUNNING")(0, nT5.globalErrorHandler)(Q);
          A()
        })
      })
    }
    startServer() {
      return this._startServerPromise ??= new Promise((A, Q) => {
        this._server.once("error", Q), this._server.listen({
          port: this._port,
          host: this._host
        }, () => {
          AkA.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), A()
        })
      }), this._startServerPromise
    }
    getMetricsRequestHandler(A, Q) {
      this._exportMetrics(Q)
    }
    _requestHandler = (A, Q) => {
      if (A.url != null && new rT5.URL(A.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(Q);
      else this._notFound(Q)
    };
    _exportMetrics = (A) => {
      A.statusCode = 200, A.setHeader("content-type", "text/plain"), this.collect().then((Q) => {
        let {
          resourceMetrics: B,
          errors: G
        } = Q;
        if (G.length) AkA.diag.error("PrometheusExporter: metrics collection errors", ...G);
        A.end(this._serializer.serialize(B))
      }, (Q) => {
        A.end(`# failed to export metrics: ${Q}`)
      })
    };
    _notFound = (A) => {
      A.statusCode = 404, A.end()
    }
  }
  zq2.PrometheusExporter = td
})
// @from(Ln 307018, Col 4)
Uq2 = U((XI1) => {
  Object.defineProperty(XI1, "__esModule", {
    value: !0
  });
  XI1.PrometheusSerializer = XI1.PrometheusExporter = void 0;
  var sT5 = Cq2();
  Object.defineProperty(XI1, "PrometheusExporter", {
    enumerable: !0,
    get: function () {
      return sT5.PrometheusExporter
    }
  });
  var tT5 = GH0();
  Object.defineProperty(XI1, "PrometheusSerializer", {
    enumerable: !0,
    get: function () {
      return tT5.PrometheusSerializer
    }
  })
})
// @from(Ln 307038, Col 4)
Oq2 = U((wq2) => {
  Object.defineProperty(wq2, "__esModule", {
    value: !0
  });
  wq2.OTLPLogExporter = void 0;
  var AP5 = ib(),
    QP5 = ob(),
    qq2 = md();
  class Nq2 extends AP5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, qq2.createOtlpHttpExportDelegate)((0, qq2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "Content-Type": "application/x-protobuf"
      }), QP5.ProtobufLogsSerializer))
    }
  }
  wq2.OTLPLogExporter = Nq2
})
// @from(Ln 307055, Col 4)
Mq2 = U((YH0) => {
  Object.defineProperty(YH0, "__esModule", {
    value: !0
  });
  YH0.OTLPLogExporter = void 0;
  var BP5 = Oq2();
  Object.defineProperty(YH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return BP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307068, Col 4)
Rq2 = U((JH0) => {
  Object.defineProperty(JH0, "__esModule", {
    value: !0
  });
  JH0.OTLPLogExporter = void 0;
  var ZP5 = Mq2();
  Object.defineProperty(JH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return ZP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307081, Col 4)
_q2 = U((XH0) => {
  Object.defineProperty(XH0, "__esModule", {
    value: !0
  });
  XH0.OTLPLogExporter = void 0;
  var JP5 = Rq2();
  Object.defineProperty(XH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return JP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307094, Col 4)
xq2 = U((Pq2) => {
  Object.defineProperty(Pq2, "__esModule", {
    value: !0
  });
  Pq2.OTLPLogExporter = void 0;
  var jq2 = ZI1(),
    IP5 = ob(),
    DP5 = ib();
  class Tq2 extends DP5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, jq2.createOtlpGrpcExportDelegate)((0, jq2.convertLegacyOtlpGrpcOptions)(A, "LOGS"), IP5.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
    }
  }
  Pq2.OTLPLogExporter = Tq2
})
// @from(Ln 307109, Col 4)
yq2 = U((IH0) => {
  Object.defineProperty(IH0, "__esModule", {
    value: !0
  });
  IH0.OTLPLogExporter = void 0;
  var WP5 = xq2();
  Object.defineProperty(IH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return WP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307122, Col 4)
hq2 = U((bq2) => {
  Object.defineProperty(bq2, "__esModule", {
    value: !0
  });
  bq2.OTLPLogExporter = void 0;
  var VP5 = ib(),
    FP5 = ob(),
    vq2 = md();
  class kq2 extends VP5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, vq2.createOtlpHttpExportDelegate)((0, vq2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "Content-Type": "application/json"
      }), FP5.JsonLogsSerializer))
    }
  }
  bq2.OTLPLogExporter = kq2
})
// @from(Ln 307139, Col 4)
gq2 = U((DH0) => {
  Object.defineProperty(DH0, "__esModule", {
    value: !0
  });
  DH0.OTLPLogExporter = void 0;
  var HP5 = hq2();
  Object.defineProperty(DH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return HP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307152, Col 4)
uq2 = U((WH0) => {
  Object.defineProperty(WH0, "__esModule", {
    value: !0
  });
  WH0.OTLPLogExporter = void 0;
  var zP5 = gq2();
  Object.defineProperty(WH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return zP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307165, Col 4)
mq2 = U((KH0) => {
  Object.defineProperty(KH0, "__esModule", {
    value: !0
  });
  KH0.OTLPLogExporter = void 0;
  var CP5 = uq2();
  Object.defineProperty(KH0, "OTLPLogExporter", {
    enumerable: !0,
    get: function () {
      return CP5.OTLPLogExporter
    }
  })
})
// @from(Ln 307178, Col 4)
pq2 = U((dq2) => {
  Object.defineProperty(dq2, "__esModule", {
    value: !0
  });
  dq2.ExceptionEventName = void 0;
  dq2.ExceptionEventName = "exception"
})
// @from(Ln 307185, Col 4)
aq2 = U((iq2) => {
  Object.defineProperty(iq2, "__esModule", {
    value: !0
  });
  iq2.SpanImpl = void 0;
  var e_ = p9(),
    sz = h8(),
    D6A = bQA(),
    qP5 = pq2();
  class lq2 {
    _spanContext;
    kind;
    parentSpanContext;
    attributes = {};
    links = [];
    events = [];
    startTime;
    resource;
    instrumentationScope;
    _droppedAttributesCount = 0;
    _droppedEventsCount = 0;
    _droppedLinksCount = 0;
    name;
    status = {
      code: e_.SpanStatusCode.UNSET
    };
    endTime = [0, 0];
    _ended = !1;
    _duration = [-1, -1];
    _spanProcessor;
    _spanLimits;
    _attributeValueLengthLimit;
    _performanceStartTime;
    _performanceOffset;
    _startTimeProvided;
    constructor(A) {
      let Q = Date.now();
      if (this._spanContext = A.spanContext, this._performanceStartTime = sz.otperformance.now(), this._performanceOffset = Q - (this._performanceStartTime + (0, sz.getTimeOrigin)()), this._startTimeProvided = A.startTime != null, this._spanLimits = A.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = A.spanProcessor, this.name = A.name, this.parentSpanContext = A.parentSpanContext, this.kind = A.kind, this.links = A.links || [], this.startTime = this._getTime(A.startTime ?? Q), this.resource = A.resource, this.instrumentationScope = A.scope, A.attributes != null) this.setAttributes(A.attributes);
      this._spanProcessor.onStart(this, A.context)
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      if (Q == null || this._isSpanEnded()) return this;
      if (A.length === 0) return e_.diag.warn(`Invalid attribute key: ${A}`), this;
      if (!(0, sz.isAttributeValue)(Q)) return e_.diag.warn(`Invalid attribute value set for key: ${A}`), this;
      let {
        attributeCountLimit: B
      } = this._spanLimits;
      if (B !== void 0 && Object.keys(this.attributes).length >= B && !Object.prototype.hasOwnProperty.call(this.attributes, A)) return this._droppedAttributesCount++, this;
      return this.attributes[A] = this._truncateToSize(Q), this
    }
    setAttributes(A) {
      for (let [Q, B] of Object.entries(A)) this.setAttribute(Q, B);
      return this
    }
    addEvent(A, Q, B) {
      if (this._isSpanEnded()) return this;
      let {
        eventCountLimit: G
      } = this._spanLimits;
      if (G === 0) return e_.diag.warn("No events allowed."), this._droppedEventsCount++, this;
      if (G !== void 0 && this.events.length >= G) {
        if (this._droppedEventsCount === 0) e_.diag.debug("Dropping extra events.");
        this.events.shift(), this._droppedEventsCount++
      }
      if ((0, sz.isTimeInput)(Q)) {
        if (!(0, sz.isTimeInput)(B)) B = Q;
        Q = void 0
      }
      let Z = (0, sz.sanitizeAttributes)(Q);
      return this.events.push({
        name: A,
        attributes: Z,
        time: this._getTime(B),
        droppedAttributesCount: 0
      }), this
    }
    addLink(A) {
      return this.links.push(A), this
    }
    addLinks(A) {
      return this.links.push(...A), this
    }
    setStatus(A) {
      if (this._isSpanEnded()) return this;
      if (this.status = {
          ...A
        }, this.status.message != null && typeof A.message !== "string") e_.diag.warn(`Dropping invalid status.message of type '${typeof A.message}', expected 'string'`), delete this.status.message;
      return this
    }
    updateName(A) {
      if (this._isSpanEnded()) return this;
      return this.name = A, this
    }
    end(A) {
      if (this._isSpanEnded()) {
        e_.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
        return
      }
      if (this._ended = !0, this.endTime = this._getTime(A), this._duration = (0, sz.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) e_.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
      if (this._droppedEventsCount > 0) e_.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
      this._spanProcessor.onEnd(this)
    }
    _getTime(A) {
      if (typeof A === "number" && A <= sz.otperformance.now()) return (0, sz.hrTime)(A + this._performanceOffset);
      if (typeof A === "number") return (0, sz.millisToHrTime)(A);
      if (A instanceof Date) return (0, sz.millisToHrTime)(A.getTime());
      if ((0, sz.isTimeInputHrTime)(A)) return A;
      if (this._startTimeProvided) return (0, sz.millisToHrTime)(Date.now());
      let Q = sz.otperformance.now() - this._performanceStartTime;
      return (0, sz.addHrTimes)(this.startTime, (0, sz.millisToHrTime)(Q))
    }
    isRecording() {
      return this._ended === !1
    }
    recordException(A, Q) {
      let B = {};
      if (typeof A === "string") B[D6A.ATTR_EXCEPTION_MESSAGE] = A;
      else if (A) {
        if (A.code) B[D6A.ATTR_EXCEPTION_TYPE] = A.code.toString();
        else if (A.name) B[D6A.ATTR_EXCEPTION_TYPE] = A.name;
        if (A.message) B[D6A.ATTR_EXCEPTION_MESSAGE] = A.message;
        if (A.stack) B[D6A.ATTR_EXCEPTION_STACKTRACE] = A.stack
      }
      if (B[D6A.ATTR_EXCEPTION_TYPE] || B[D6A.ATTR_EXCEPTION_MESSAGE]) this.addEvent(qP5.ExceptionEventName, B, Q);
      else e_.diag.warn(`Failed to record an exception ${A}`)
    }
    get duration() {
      return this._duration
    }
    get ended() {
      return this._ended
    }
    get droppedAttributesCount() {
      return this._droppedAttributesCount
    }
    get droppedEventsCount() {
      return this._droppedEventsCount
    }
    get droppedLinksCount() {
      return this._droppedLinksCount
    }
    _isSpanEnded() {
      if (this._ended) {
        let A = Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
        e_.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, A)
      }
      return this._ended
    }
    _truncateToLimitUtil(A, Q) {
      if (A.length <= Q) return A;
      return A.substring(0, Q)
    }
    _truncateToSize(A) {
      let Q = this._attributeValueLengthLimit;
      if (Q <= 0) return e_.diag.warn(`Attribute value limit must be positive, got ${Q}`), A;
      if (typeof A === "string") return this._truncateToLimitUtil(A, Q);
      if (Array.isArray(A)) return A.map((B) => typeof B === "string" ? this._truncateToLimitUtil(B, Q) : B);
      return A
    }
  }
  iq2.SpanImpl = lq2
})
// @from(Ln 307350, Col 4)
QkA = U((oq2) => {
  Object.defineProperty(oq2, "__esModule", {
    value: !0
  });
  oq2.SamplingDecision = void 0;
  var NP5;
  (function (A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })(NP5 = oq2.SamplingDecision || (oq2.SamplingDecision = {}))
})
// @from(Ln 307360, Col 4)
II1 = U((sq2) => {
  Object.defineProperty(sq2, "__esModule", {
    value: !0
  });
  sq2.AlwaysOffSampler = void 0;
  var wP5 = QkA();
  class rq2 {
    shouldSample() {
      return {
        decision: wP5.SamplingDecision.NOT_RECORD
      }
    }
    toString() {
      return "AlwaysOffSampler"
    }
  }
  sq2.AlwaysOffSampler = rq2
})
// @from(Ln 307378, Col 4)
DI1 = U((AN2) => {
  Object.defineProperty(AN2, "__esModule", {
    value: !0
  });
  AN2.AlwaysOnSampler = void 0;
  var LP5 = QkA();
  class eq2 {
    shouldSample() {
      return {
        decision: LP5.SamplingDecision.RECORD_AND_SAMPLED
      }
    }
    toString() {
      return "AlwaysOnSampler"
    }
  }
  AN2.AlwaysOnSampler = eq2
})
// @from(Ln 307396, Col 4)
HH0 = U((ZN2) => {
  Object.defineProperty(ZN2, "__esModule", {
    value: !0
  });
  ZN2.ParentBasedSampler = void 0;
  var WI1 = p9(),
    OP5 = h8(),
    BN2 = II1(),
    FH0 = DI1();
  class GN2 {
    _root;
    _remoteParentSampled;
    _remoteParentNotSampled;
    _localParentSampled;
    _localParentNotSampled;
    constructor(A) {
      if (this._root = A.root, !this._root)(0, OP5.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new FH0.AlwaysOnSampler;
      this._remoteParentSampled = A.remoteParentSampled ?? new FH0.AlwaysOnSampler, this._remoteParentNotSampled = A.remoteParentNotSampled ?? new BN2.AlwaysOffSampler, this._localParentSampled = A.localParentSampled ?? new FH0.AlwaysOnSampler, this._localParentNotSampled = A.localParentNotSampled ?? new BN2.AlwaysOffSampler
    }
    shouldSample(A, Q, B, G, Z, Y) {
      let J = WI1.trace.getSpanContext(A);
      if (!J || !(0, WI1.isSpanContextValid)(J)) return this._root.shouldSample(A, Q, B, G, Z, Y);
      if (J.isRemote) {
        if (J.traceFlags & WI1.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(A, Q, B, G, Z, Y);
        return this._remoteParentNotSampled.shouldSample(A, Q, B, G, Z, Y)
      }
      if (J.traceFlags & WI1.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(A, Q, B, G, Z, Y);
      return this._localParentNotSampled.shouldSample(A, Q, B, G, Z, Y)
    }
    toString() {
      return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
    }
  }
  ZN2.ParentBasedSampler = GN2
})
// @from(Ln 307431, Col 4)
EH0 = U((IN2) => {
  Object.defineProperty(IN2, "__esModule", {
    value: !0
  });
  IN2.TraceIdRatioBasedSampler = void 0;
  var MP5 = p9(),
    JN2 = QkA();
  class XN2 {
    _ratio;
    _upperBound;
    constructor(A = 0) {
      this._ratio = A, this._ratio = this._normalize(A), this._upperBound = Math.floor(this._ratio * 4294967295)
    }
    shouldSample(A, Q) {
      return {
        decision: (0, MP5.isValidTraceId)(Q) && this._accumulate(Q) < this._upperBound ? JN2.SamplingDecision.RECORD_AND_SAMPLED : JN2.SamplingDecision.NOT_RECORD
      }
    }
    toString() {
      return `TraceIdRatioBased{${this._ratio}}`
    }
    _normalize(A) {
      if (typeof A !== "number" || isNaN(A)) return 0;
      return A >= 1 ? 1 : A <= 0 ? 0 : A
    }
    _accumulate(A) {
      let Q = 0;
      for (let B = 0; B < A.length / 8; B++) {
        let G = B * 8,
          Z = parseInt(A.slice(G, G + 8), 16);
        Q = (Q ^ Z) >>> 0
      }
      return Q
    }
  }
  IN2.TraceIdRatioBasedSampler = XN2
})
// @from(Ln 307468, Col 4)
CH0 = U((HN2) => {
  Object.defineProperty(HN2, "__esModule", {
    value: !0
  });
  HN2.buildSamplerFromEnv = HN2.loadDefaultConfig = void 0;
  var $H0 = p9(),
    Df = h8(),
    WN2 = II1(),
    zH0 = DI1(),
    KI1 = HH0(),
    KN2 = EH0(),
    Wf;
  (function (A) {
    A.AlwaysOff = "always_off", A.AlwaysOn = "always_on", A.ParentBasedAlwaysOff = "parentbased_always_off", A.ParentBasedAlwaysOn = "parentbased_always_on", A.ParentBasedTraceIdRatio = "parentbased_traceidratio", A.TraceIdRatio = "traceidratio"
  })(Wf || (Wf = {}));
  var VI1 = 1;

  function RP5() {
    return {
      sampler: FN2(),
      forceFlushTimeoutMillis: 30000,
      generalLimits: {
        attributeValueLengthLimit: (0, Df.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Df.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
      },
      spanLimits: {
        attributeValueLengthLimit: (0, Df.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Df.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
        linkCountLimit: (0, Df.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
        eventCountLimit: (0, Df.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
        attributePerEventCountLimit: (0, Df.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
        attributePerLinkCountLimit: (0, Df.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
      }
    }
  }
  HN2.loadDefaultConfig = RP5;

  function FN2() {
    let A = (0, Df.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? Wf.ParentBasedAlwaysOn;
    switch (A) {
      case Wf.AlwaysOn:
        return new zH0.AlwaysOnSampler;
      case Wf.AlwaysOff:
        return new WN2.AlwaysOffSampler;
      case Wf.ParentBasedAlwaysOn:
        return new KI1.ParentBasedSampler({
          root: new zH0.AlwaysOnSampler
        });
      case Wf.ParentBasedAlwaysOff:
        return new KI1.ParentBasedSampler({
          root: new WN2.AlwaysOffSampler
        });
      case Wf.TraceIdRatio:
        return new KN2.TraceIdRatioBasedSampler(VN2());
      case Wf.ParentBasedTraceIdRatio:
        return new KI1.ParentBasedSampler({
          root: new KN2.TraceIdRatioBasedSampler(VN2())
        });
      default:
        return $H0.diag.error(`OTEL_TRACES_SAMPLER value "${A}" invalid, defaulting to "${Wf.ParentBasedAlwaysOn}".`), new KI1.ParentBasedSampler({
          root: new zH0.AlwaysOnSampler
        })
    }
  }
  HN2.buildSamplerFromEnv = FN2;

  function VN2() {
    let A = (0, Df.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
    if (A == null) return $H0.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${VI1}.`), VI1;
    if (A < 0 || A > 1) return $H0.diag.error(`OTEL_TRACES_SAMPLER_ARG=${A} was given, but it is out of range ([0..1]), defaulting to ${VI1}.`), VI1;
    return A
  }
})
// @from(Ln 307541, Col 4)
UH0 = U(($N2) => {
  Object.defineProperty($N2, "__esModule", {
    value: !0
  });
  $N2.reconfigureLimits = $N2.mergeConfig = $N2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = $N2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
  var zN2 = CH0(),
    FI1 = h8();
  $N2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  $N2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

  function jP5(A) {
    let Q = {
        sampler: (0, zN2.buildSamplerFromEnv)()
      },
      B = (0, zN2.loadDefaultConfig)(),
      G = Object.assign({}, B, Q, A);
    return G.generalLimits = Object.assign({}, B.generalLimits, A.generalLimits || {}), G.spanLimits = Object.assign({}, B.spanLimits, A.spanLimits || {}), G
  }
  $N2.mergeConfig = jP5;

  function TP5(A) {
    let Q = Object.assign({}, A.spanLimits);
    return Q.attributeCountLimit = A.spanLimits?.attributeCountLimit ?? A.generalLimits?.attributeCountLimit ?? (0, FI1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, FI1.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? $N2.DEFAULT_ATTRIBUTE_COUNT_LIMIT, Q.attributeValueLengthLimit = A.spanLimits?.attributeValueLengthLimit ?? A.generalLimits?.attributeValueLengthLimit ?? (0, FI1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, FI1.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? $N2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, A, {
      spanLimits: Q
    })
  }
  $N2.reconfigureLimits = TP5
})
// @from(Ln 307569, Col 4)
ON2 = U((wN2) => {
  Object.defineProperty(wN2, "__esModule", {
    value: !0
  });
  wN2.BatchSpanProcessorBase = void 0;
  var dFA = p9(),
    ed = h8();
  class NN2 {
    _exporter;
    _maxExportBatchSize;
    _maxQueueSize;
    _scheduledDelayMillis;
    _exportTimeoutMillis;
    _isExporting = !1;
    _finishedSpans = [];
    _timer;
    _shutdownOnce;
    _droppedSpansCount = 0;
    constructor(A, Q) {
      if (this._exporter = A, this._maxExportBatchSize = typeof Q?.maxExportBatchSize === "number" ? Q.maxExportBatchSize : (0, ed.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof Q?.maxQueueSize === "number" ? Q.maxQueueSize : (0, ed.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof Q?.scheduledDelayMillis === "number" ? Q.scheduledDelayMillis : (0, ed.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof Q?.exportTimeoutMillis === "number" ? Q.exportTimeoutMillis : (0, ed.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new ed.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) dFA.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
    }
    forceFlush() {
      if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
      return this._flushAll()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & dFA.TraceFlags.SAMPLED) === 0) return;
      this._addToBuffer(A)
    }
    shutdown() {
      return this._shutdownOnce.call()
    }
    _shutdown() {
      return Promise.resolve().then(() => {
        return this.onShutdown()
      }).then(() => {
        return this._flushAll()
      }).then(() => {
        return this._exporter.shutdown()
      })
    }
    _addToBuffer(A) {
      if (this._finishedSpans.length >= this._maxQueueSize) {
        if (this._droppedSpansCount === 0) dFA.diag.debug("maxQueueSize reached, dropping spans");
        this._droppedSpansCount++;
        return
      }
      if (this._droppedSpansCount > 0) dFA.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
      this._finishedSpans.push(A), this._maybeStartTimer()
    }
    _flushAll() {
      return new Promise((A, Q) => {
        let B = [],
          G = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
        for (let Z = 0, Y = G; Z < Y; Z++) B.push(this._flushOneBatch());
        Promise.all(B).then(() => {
          A()
        }).catch(Q)
      })
    }
    _flushOneBatch() {
      if (this._clearTimer(), this._finishedSpans.length === 0) return Promise.resolve();
      return new Promise((A, Q) => {
        let B = setTimeout(() => {
          Q(Error("Timeout"))
        }, this._exportTimeoutMillis);
        dFA.context.with((0, ed.suppressTracing)(dFA.context.active()), () => {
          let G;
          if (this._finishedSpans.length <= this._maxExportBatchSize) G = this._finishedSpans, this._finishedSpans = [];
          else G = this._finishedSpans.splice(0, this._maxExportBatchSize);
          let Z = () => this._exporter.export(G, (J) => {
              if (clearTimeout(B), J.code === ed.ExportResultCode.SUCCESS) A();
              else Q(J.error ?? Error("BatchSpanProcessor: span export failed"))
            }),
            Y = null;
          for (let J = 0, X = G.length; J < X; J++) {
            let I = G[J];
            if (I.resource.asyncAttributesPending && I.resource.waitForAsyncAttributes) Y ??= [], Y.push(I.resource.waitForAsyncAttributes())
          }
          if (Y === null) Z();
          else Promise.all(Y).then(Z, (J) => {
            (0, ed.globalErrorHandler)(J), Q(J)
          })
        })
      })
    }
    _maybeStartTimer() {
      if (this._isExporting) return;
      let A = () => {
        this._isExporting = !0, this._flushOneBatch().finally(() => {
          if (this._isExporting = !1, this._finishedSpans.length > 0) this._clearTimer(), this._maybeStartTimer()
        }).catch((Q) => {
          this._isExporting = !1, (0, ed.globalErrorHandler)(Q)
        })
      };
      if (this._finishedSpans.length >= this._maxExportBatchSize) return A();
      if (this._timer !== void 0) return;
      if (this._timer = setTimeout(() => A(), this._scheduledDelayMillis), typeof this._timer !== "number") this._timer.unref()
    }
    _clearTimer() {
      if (this._timer !== void 0) clearTimeout(this._timer), this._timer = void 0
    }
  }
  wN2.BatchSpanProcessorBase = NN2
})
// @from(Ln 307676, Col 4)
jN2 = U((RN2) => {
  Object.defineProperty(RN2, "__esModule", {
    value: !0
  });
  RN2.BatchSpanProcessor = void 0;
  var SP5 = ON2();
  class MN2 extends SP5.BatchSpanProcessorBase {
    onShutdown() {}
  }
  RN2.BatchSpanProcessor = MN2
})
// @from(Ln 307687, Col 4)
vN2 = U((xN2) => {
  Object.defineProperty(xN2, "__esModule", {
    value: !0
  });
  xN2.RandomIdGenerator = void 0;
  var xP5 = 8,
    PN2 = 16;
  class SN2 {
    generateTraceId = TN2(PN2);
    generateSpanId = TN2(xP5)
  }
  xN2.RandomIdGenerator = SN2;
  var HI1 = Buffer.allocUnsafe(PN2);

  function TN2(A) {
    return function () {
      for (let B = 0; B < A / 4; B++) HI1.writeUInt32BE(Math.random() * 4294967296 >>> 0, B * 4);
      for (let B = 0; B < A; B++)
        if (HI1[B] > 0) break;
        else if (B === A - 1) HI1[A - 1] = 1;
      return HI1.toString("hex", 0, A)
    }
  }
})
// @from(Ln 307711, Col 4)
kN2 = U((EI1) => {
  Object.defineProperty(EI1, "__esModule", {
    value: !0
  });
  EI1.RandomIdGenerator = EI1.BatchSpanProcessor = void 0;
  var yP5 = jN2();
  Object.defineProperty(EI1, "BatchSpanProcessor", {
    enumerable: !0,
    get: function () {
      return yP5.BatchSpanProcessor
    }
  });
  var vP5 = vN2();
  Object.defineProperty(EI1, "RandomIdGenerator", {
    enumerable: !0,
    get: function () {
      return vP5.RandomIdGenerator
    }
  })
})
// @from(Ln 307731, Col 4)
qH0 = U((zI1) => {
  Object.defineProperty(zI1, "__esModule", {
    value: !0
  });
  zI1.RandomIdGenerator = zI1.BatchSpanProcessor = void 0;
  var bN2 = kN2();
  Object.defineProperty(zI1, "BatchSpanProcessor", {
    enumerable: !0,
    get: function () {
      return bN2.BatchSpanProcessor
    }
  });
  Object.defineProperty(zI1, "RandomIdGenerator", {
    enumerable: !0,
    get: function () {
      return bN2.RandomIdGenerator
    }
  })
})
// @from(Ln 307750, Col 4)
uN2 = U((hN2) => {
  Object.defineProperty(hN2, "__esModule", {
    value: !0
  });
  hN2.Tracer = void 0;
  var zE = p9(),
    $I1 = h8(),
    fP5 = aq2(),
    hP5 = UH0(),
    gP5 = qH0();
  class fN2 {
    _sampler;
    _generalLimits;
    _spanLimits;
    _idGenerator;
    instrumentationScope;
    _resource;
    _spanProcessor;
    constructor(A, Q, B, G) {
      let Z = (0, hP5.mergeConfig)(Q);
      this._sampler = Z.sampler, this._generalLimits = Z.generalLimits, this._spanLimits = Z.spanLimits, this._idGenerator = Q.idGenerator || new gP5.RandomIdGenerator, this._resource = B, this._spanProcessor = G, this.instrumentationScope = A
    }
    startSpan(A, Q = {}, B = zE.context.active()) {
      if (Q.root) B = zE.trace.deleteSpan(B);
      let G = zE.trace.getSpan(B);
      if ((0, $I1.isTracingSuppressed)(B)) return zE.diag.debug("Instrumentation suppressed, returning Noop Span"), zE.trace.wrapSpanContext(zE.INVALID_SPAN_CONTEXT);
      let Z = G?.spanContext(),
        Y = this._idGenerator.generateSpanId(),
        J, X, I;
      if (!Z || !zE.trace.isSpanContextValid(Z)) X = this._idGenerator.generateTraceId();
      else X = Z.traceId, I = Z.traceState, J = Z;
      let D = Q.kind ?? zE.SpanKind.INTERNAL,
        W = (Q.links ?? []).map(($) => {
          return {
            context: $.context,
            attributes: (0, $I1.sanitizeAttributes)($.attributes)
          }
        }),
        K = (0, $I1.sanitizeAttributes)(Q.attributes),
        V = this._sampler.shouldSample(B, X, A, D, K, W);
      I = V.traceState ?? I;
      let F = V.decision === zE.SamplingDecision.RECORD_AND_SAMPLED ? zE.TraceFlags.SAMPLED : zE.TraceFlags.NONE,
        H = {
          traceId: X,
          spanId: Y,
          traceFlags: F,
          traceState: I
        };
      if (V.decision === zE.SamplingDecision.NOT_RECORD) return zE.diag.debug("Recording is off, propagating context in a non-recording span"), zE.trace.wrapSpanContext(H);
      let E = (0, $I1.sanitizeAttributes)(Object.assign(K, V.attributes));
      return new fP5.SpanImpl({
        resource: this._resource,
        scope: this.instrumentationScope,
        context: B,
        spanContext: H,
        name: A,
        kind: D,
        links: W,
        parentSpanContext: J,
        attributes: E,
        startTime: Q.startTime,
        spanProcessor: this._spanProcessor,
        spanLimits: this._spanLimits
      })
    }
    startActiveSpan(A, Q, B, G) {
      let Z, Y, J;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) J = Q;
      else if (arguments.length === 3) Z = Q, J = B;
      else Z = Q, Y = B, J = G;
      let X = Y ?? zE.context.active(),
        I = this.startSpan(A, Z, X),
        D = zE.trace.setSpan(X, I);
      return zE.context.with(D, J, void 0, I)
    }
    getGeneralLimits() {
      return this._generalLimits
    }
    getSpanLimits() {
      return this._spanLimits
    }
  }
  hN2.Tracer = fN2
})
// @from(Ln 307835, Col 4)
pN2 = U((dN2) => {
  Object.defineProperty(dN2, "__esModule", {
    value: !0
  });
  dN2.MultiSpanProcessor = void 0;
  var uP5 = h8();
  class mN2 {
    _spanProcessors;
    constructor(A) {
      this._spanProcessors = A
    }
    forceFlush() {
      let A = [];
      for (let Q of this._spanProcessors) A.push(Q.forceFlush());
      return new Promise((Q) => {
        Promise.all(A).then(() => {
          Q()
        }).catch((B) => {
          (0, uP5.globalErrorHandler)(B || Error("MultiSpanProcessor: forceFlush failed")), Q()
        })
      })
    }
    onStart(A, Q) {
      for (let B of this._spanProcessors) B.onStart(A, Q)
    }
    onEnd(A) {
      for (let Q of this._spanProcessors) Q.onEnd(A)
    }
    shutdown() {
      let A = [];
      for (let Q of this._spanProcessors) A.push(Q.shutdown());
      return new Promise((Q, B) => {
        Promise.all(A).then(() => {
          Q()
        }, B)
      })
    }
  }
  dN2.MultiSpanProcessor = mN2
})
// @from(Ln 307875, Col 4)
oN2 = U((nN2) => {
  Object.defineProperty(nN2, "__esModule", {
    value: !0
  });
  nN2.BasicTracerProvider = nN2.ForceFlushState = void 0;
  var mP5 = h8(),
    dP5 = $XA(),
    cP5 = uN2(),
    pP5 = CH0(),
    lP5 = pN2(),
    iP5 = UH0(),
    cFA;
  (function (A) {
    A[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved"
  })(cFA = nN2.ForceFlushState || (nN2.ForceFlushState = {}));
  class iN2 {
    _config;
    _tracers = new Map;
    _resource;
    _activeSpanProcessor;
    constructor(A = {}) {
      let Q = (0, mP5.merge)({}, (0, pP5.loadDefaultConfig)(), (0, iP5.reconfigureLimits)(A));
      this._resource = Q.resource ?? (0, dP5.defaultResource)(), this._config = Object.assign({}, Q, {
        resource: this._resource
      });
      let B = [];
      if (A.spanProcessors?.length) B.push(...A.spanProcessors);
      this._activeSpanProcessor = new lP5.MultiSpanProcessor(B)
    }
    getTracer(A, Q, B) {
      let G = `${A}@${Q||""}:${B?.schemaUrl||""}`;
      if (!this._tracers.has(G)) this._tracers.set(G, new cP5.Tracer({
        name: A,
        version: Q,
        schemaUrl: B?.schemaUrl
      }, this._config, this._resource, this._activeSpanProcessor));
      return this._tracers.get(G)
    }
    forceFlush() {
      let A = this._config.forceFlushTimeoutMillis,
        Q = this._activeSpanProcessor._spanProcessors.map((B) => {
          return new Promise((G) => {
            let Z, Y = setTimeout(() => {
              G(Error(`Span processor did not completed within timeout period of ${A} ms`)), Z = cFA.timeout
            }, A);
            B.forceFlush().then(() => {
              if (clearTimeout(Y), Z !== cFA.timeout) Z = cFA.resolved, G(Z)
            }).catch((J) => {
              clearTimeout(Y), Z = cFA.error, G(J)
            })
          })
        });
      return new Promise((B, G) => {
        Promise.all(Q).then((Z) => {
          let Y = Z.filter((J) => J !== cFA.resolved);
          if (Y.length > 0) G(Y);
          else B()
        }).catch((Z) => G([Z]))
      })
    }
    shutdown() {
      return this._activeSpanProcessor.shutdown()
    }
  }
  nN2.BasicTracerProvider = iN2
})
// @from(Ln 307941, Col 4)
eN2 = U((sN2) => {
  Object.defineProperty(sN2, "__esModule", {
    value: !0
  });
  sN2.ConsoleSpanExporter = void 0;
  var NH0 = h8();
  class rN2 {
    export (A, Q) {
      return this._sendSpans(A, Q)
    }
    shutdown() {
      return this._sendSpans([]), this.forceFlush()
    }
    forceFlush() {
      return Promise.resolve()
    }
    _exportInfo(A) {
      return {
        resource: {
          attributes: A.resource.attributes
        },
        instrumentationScope: A.instrumentationScope,
        traceId: A.spanContext().traceId,
        parentSpanContext: A.parentSpanContext,
        traceState: A.spanContext().traceState?.serialize(),
        name: A.name,
        id: A.spanContext().spanId,
        kind: A.kind,
        timestamp: (0, NH0.hrTimeToMicroseconds)(A.startTime),
        duration: (0, NH0.hrTimeToMicroseconds)(A.duration),
        attributes: A.attributes,
        status: A.status,
        events: A.events,
        links: A.links
      }
    }
    _sendSpans(A, Q) {
      for (let B of A) console.dir(this._exportInfo(B), {
        depth: 3
      });
      if (Q) return Q({
        code: NH0.ExportResultCode.SUCCESS
      })
    }
  }
  sN2.ConsoleSpanExporter = rN2
})
// @from(Ln 307988, Col 4)
Zw2 = U((Bw2) => {
  Object.defineProperty(Bw2, "__esModule", {
    value: !0
  });
  Bw2.InMemorySpanExporter = void 0;
  var Aw2 = h8();
  class Qw2 {
    _finishedSpans = [];
    _stopped = !1;
    export (A, Q) {
      if (this._stopped) return Q({
        code: Aw2.ExportResultCode.FAILED,
        error: Error("Exporter has been stopped")
      });
      this._finishedSpans.push(...A), setTimeout(() => Q({
        code: Aw2.ExportResultCode.SUCCESS
      }), 0)
    }
    shutdown() {
      return this._stopped = !0, this._finishedSpans = [], this.forceFlush()
    }
    forceFlush() {
      return Promise.resolve()
    }
    reset() {
      this._finishedSpans = []
    }
    getFinishedSpans() {
      return this._finishedSpans
    }
  }
  Bw2.InMemorySpanExporter = Qw2
})
// @from(Ln 308021, Col 4)
Iw2 = U((Jw2) => {
  Object.defineProperty(Jw2, "__esModule", {
    value: !0
  });
  Jw2.SimpleSpanProcessor = void 0;
  var nP5 = p9(),
    CI1 = h8();
  class Yw2 {
    _exporter;
    _shutdownOnce;
    _pendingExports;
    constructor(A) {
      this._exporter = A, this._shutdownOnce = new CI1.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
    }
    async forceFlush() {
      if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & nP5.TraceFlags.SAMPLED) === 0) return;
      let Q = this._doExport(A).catch((B) => (0, CI1.globalErrorHandler)(B));
      this._pendingExports.add(Q), Q.finally(() => this._pendingExports.delete(Q))
    }
    async _doExport(A) {
      if (A.resource.asyncAttributesPending) await A.resource.waitForAsyncAttributes?.();
      let Q = await CI1.internal._export(this._exporter, [A]);
      if (Q.code !== CI1.ExportResultCode.SUCCESS) throw Q.error ?? Error(`SimpleSpanProcessor: span export failed (status ${Q})`)
    }
    shutdown() {
      return this._shutdownOnce.call()
    }
    _shutdown() {
      return this._exporter.shutdown()
    }
  }
  Jw2.SimpleSpanProcessor = Yw2
})
// @from(Ln 308059, Col 4)
Vw2 = U((Ww2) => {
  Object.defineProperty(Ww2, "__esModule", {
    value: !0
  });
  Ww2.NoopSpanProcessor = void 0;
  class Dw2 {
    onStart(A, Q) {}
    onEnd(A) {}
    shutdown() {
      return Promise.resolve()
    }
    forceFlush() {
      return Promise.resolve()
    }
  }
  Ww2.NoopSpanProcessor = Dw2
})
// @from(Ln 308076, Col 4)
Hw2 = U((mN) => {
  Object.defineProperty(mN, "__esModule", {
    value: !0
  });
  mN.SamplingDecision = mN.TraceIdRatioBasedSampler = mN.ParentBasedSampler = mN.AlwaysOnSampler = mN.AlwaysOffSampler = mN.NoopSpanProcessor = mN.SimpleSpanProcessor = mN.InMemorySpanExporter = mN.ConsoleSpanExporter = mN.RandomIdGenerator = mN.BatchSpanProcessor = mN.BasicTracerProvider = void 0;
  var aP5 = oN2();
  Object.defineProperty(mN, "BasicTracerProvider", {
    enumerable: !0,
    get: function () {
      return aP5.BasicTracerProvider
    }
  });
  var Fw2 = qH0();
  Object.defineProperty(mN, "BatchSpanProcessor", {
    enumerable: !0,
    get: function () {
      return Fw2.BatchSpanProcessor
    }
  });
  Object.defineProperty(mN, "RandomIdGenerator", {
    enumerable: !0,
    get: function () {
      return Fw2.RandomIdGenerator
    }
  });
  var oP5 = eN2();
  Object.defineProperty(mN, "ConsoleSpanExporter", {
    enumerable: !0,
    get: function () {
      return oP5.ConsoleSpanExporter
    }
  });
  var rP5 = Zw2();
  Object.defineProperty(mN, "InMemorySpanExporter", {
    enumerable: !0,
    get: function () {
      return rP5.InMemorySpanExporter
    }
  });
  var sP5 = Iw2();
  Object.defineProperty(mN, "SimpleSpanProcessor", {
    enumerable: !0,
    get: function () {
      return sP5.SimpleSpanProcessor
    }
  });
  var tP5 = Vw2();
  Object.defineProperty(mN, "NoopSpanProcessor", {
    enumerable: !0,
    get: function () {
      return tP5.NoopSpanProcessor
    }
  });
  var eP5 = II1();
  Object.defineProperty(mN, "AlwaysOffSampler", {
    enumerable: !0,
    get: function () {
      return eP5.AlwaysOffSampler
    }
  });
  var AS5 = DI1();
  Object.defineProperty(mN, "AlwaysOnSampler", {
    enumerable: !0,
    get: function () {
      return AS5.AlwaysOnSampler
    }
  });
  var QS5 = HH0();
  Object.defineProperty(mN, "ParentBasedSampler", {
    enumerable: !0,
    get: function () {
      return QS5.ParentBasedSampler
    }
  });
  var BS5 = EH0();
  Object.defineProperty(mN, "TraceIdRatioBasedSampler", {
    enumerable: !0,
    get: function () {
      return BS5.TraceIdRatioBasedSampler
    }
  });
  var GS5 = QkA();
  Object.defineProperty(mN, "SamplingDecision", {
    enumerable: !0,
    get: function () {
      return GS5.SamplingDecision
    }
  })
})
// @from(Ln 308165, Col 4)
Uw2 = U(($w2) => {
  Object.defineProperty($w2, "__esModule", {
    value: !0
  });
  $w2.OTLPTraceExporter = void 0;
  var YS5 = ib(),
    JS5 = ob(),
    Ew2 = md();
  class zw2 extends YS5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, Ew2.createOtlpHttpExportDelegate)((0, Ew2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "Content-Type": "application/x-protobuf"
      }), JS5.ProtobufTraceSerializer))
    }
  }
  $w2.OTLPTraceExporter = zw2
})
// @from(Ln 308182, Col 4)
qw2 = U((wH0) => {
  Object.defineProperty(wH0, "__esModule", {
    value: !0
  });
  wH0.OTLPTraceExporter = void 0;
  var XS5 = Uw2();
  Object.defineProperty(wH0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return XS5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308195, Col 4)
Nw2 = U((LH0) => {
  Object.defineProperty(LH0, "__esModule", {
    value: !0
  });
  LH0.OTLPTraceExporter = void 0;
  var DS5 = qw2();
  Object.defineProperty(LH0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return DS5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308208, Col 4)
ww2 = U((OH0) => {
  Object.defineProperty(OH0, "__esModule", {
    value: !0
  });
  OH0.OTLPTraceExporter = void 0;
  var KS5 = Nw2();
  Object.defineProperty(OH0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return KS5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308221, Col 4)
_w2 = U((Mw2) => {
  Object.defineProperty(Mw2, "__esModule", {
    value: !0
  });
  Mw2.OTLPTraceExporter = void 0;
  var Lw2 = ZI1(),
    FS5 = ob(),
    HS5 = ib();
  class Ow2 extends HS5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, Lw2.createOtlpGrpcExportDelegate)((0, Lw2.convertLegacyOtlpGrpcOptions)(A, "TRACES"), FS5.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
    }
  }
  Mw2.OTLPTraceExporter = Ow2
})
// @from(Ln 308236, Col 4)
jw2 = U((MH0) => {
  Object.defineProperty(MH0, "__esModule", {
    value: !0
  });
  MH0.OTLPTraceExporter = void 0;
  var ES5 = _w2();
  Object.defineProperty(MH0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return ES5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308249, Col 4)
yw2 = U((Sw2) => {
  Object.defineProperty(Sw2, "__esModule", {
    value: !0
  });
  Sw2.OTLPTraceExporter = void 0;
  var $S5 = ib(),
    CS5 = ob(),
    Tw2 = md();
  class Pw2 extends $S5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, Tw2.createOtlpHttpExportDelegate)((0, Tw2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "Content-Type": "application/json"
      }), CS5.JsonTraceSerializer))
    }
  }
  Sw2.OTLPTraceExporter = Pw2
})
// @from(Ln 308266, Col 4)
vw2 = U((RH0) => {
  Object.defineProperty(RH0, "__esModule", {
    value: !0
  });
  RH0.OTLPTraceExporter = void 0;
  var US5 = yw2();
  Object.defineProperty(RH0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return US5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308279, Col 4)
kw2 = U((_H0) => {
  Object.defineProperty(_H0, "__esModule", {
    value: !0
  });
  _H0.OTLPTraceExporter = void 0;
  var NS5 = vw2();
  Object.defineProperty(_H0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return NS5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308292, Col 4)
bw2 = U((jH0) => {
  Object.defineProperty(jH0, "__esModule", {
    value: !0
  });
  jH0.OTLPTraceExporter = void 0;
  var LS5 = kw2();
  Object.defineProperty(jH0, "OTLPTraceExporter", {
    enumerable: !0,
    get: function () {
      return LS5.OTLPTraceExporter
    }
  })
})
// @from(Ln 308305, Col 0)
class TH0 {
  error(A, ...Q) {
    e(Error(A))
  }
  warn(A, ...Q) {
    e(Error(A))
  }
  info(A, ...Q) {
    return
  }
  debug(A, ...Q) {
    return
  }
  verbose(A, ...Q) {
    return
  }
}
// @from(Ln 308322, Col 4)
fw2 = w(() => {
  v1()
})
// @from(Ln 308325, Col 0)
async function RS5() {
  let A = CJ();
  if (A.error) throw k(`Metrics opt-out check failed: ${A.error}`), Error(`Auth error: ${A.error}`);
  let Q = {
    "Content-Type": "application/json",
    "User-Agent": PD(),
    ...A.headers
  };
  try {
    let G = await xQ.get("https://api.anthropic.com/api/claude_code/organizations/metrics_enabled", {
      headers: Q,
      timeout: 5000
    });
    return k(`Metrics opt-out API response: enabled=${G.data.metrics_logging_enabled}, vcsLinking=${G.data.vcs_account_linking_enabled}`), {
      enabled: G.data.metrics_logging_enabled,
      vcsAccountLinkingEnabled: G.data.vcs_account_linking_enabled,
      hasError: !1
    }
  } catch (B) {
    return k(`Failed to check metrics opt-out status: ${B instanceof Error?B.message:String(B)}`), e(B), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Ln 308351, Col 0)
async function UI1() {
  try {
    return await _S5()
  } catch (A) {
    return k("Metrics check failed, defaulting to disabled"), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Ln 308362, Col 4)
MS5 = 3600000
// @from(Ln 308363, Col 2)
_S5
// @from(Ln 308364, Col 4)
PH0 = w(() => {
  j5();
  dnA();
  qz();
  T1();
  v1();
  _S5 = mnA(RS5, MS5)
})