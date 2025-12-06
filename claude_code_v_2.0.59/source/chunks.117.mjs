
// @from(Start 11084548, End 11099670)
Yq2 = z((Zq2) => {
  var C40;
  Object.defineProperty(Zq2, "__esModule", {
    value: !0
  });
  Zq2.OutlierDetectionLoadBalancer = Zq2.OutlierDetectionLoadBalancingConfig = void 0;
  Zq2.setup = zk5;
  var Jk5 = mE(),
    ew2 = E6(),
    W0A = aOA(),
    Aq2 = X40(),
    Wk5 = li(),
    Xk5 = y41(),
    Vk5 = Ph(),
    E40 = eU(),
    Fk5 = iOA(),
    Kk5 = zZ(),
    Dk5 = "outlier_detection";

  function XK(A) {
    Kk5.trace(ew2.LogVerbosity.DEBUG, Dk5, A)
  }
  var $40 = "outlier_detection",
    Hk5 = ((C40 = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && C40 !== void 0 ? C40 : "true") === "true",
    Ck5 = {
      stdev_factor: 1900,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 100
    },
    Ek5 = {
      threshold: 85,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 50
    };

  function RJA(A, Q, B, G) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) {
      let Z = G ? `${G}.${Q}` : Q;
      throw Error(`outlier detection config ${Z} parse error: expected ${B}, got ${typeof A[Q]}`)
    }
  }

  function z40(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (Q in A && A[Q] !== void 0) {
      if (!(0, W0A.isDuration)(A[Q])) throw Error(`outlier detection config ${G} parse error: expected Duration, got ${typeof A[Q]}`);
      if (!(A[Q].seconds >= 0 && A[Q].seconds <= 315576000000 && A[Q].nanos >= 0 && A[Q].nanos <= 999999999)) throw Error(`outlier detection config ${G} parse error: values out of range for non-negative Duaration`)
    }
  }

  function g81(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (RJA(A, Q, "number", B), Q in A && A[Q] !== void 0 && !(A[Q] >= 0 && A[Q] <= 100)) throw Error(`outlier detection config ${G} parse error: value out of range for percentage (0-100)`)
  }
  class ARA {
    constructor(A, Q, B, G, Z, I, Y) {
      if (this.childPolicy = Y, Y.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
      this.intervalMs = A !== null && A !== void 0 ? A : 1e4, this.baseEjectionTimeMs = Q !== null && Q !== void 0 ? Q : 30000, this.maxEjectionTimeMs = B !== null && B !== void 0 ? B : 300000, this.maxEjectionPercent = G !== null && G !== void 0 ? G : 10, this.successRateEjection = Z ? Object.assign(Object.assign({}, Ck5), Z) : null, this.failurePercentageEjection = I ? Object.assign(Object.assign({}, Ek5), I) : null
    }
    getLoadBalancerName() {
      return $40
    }
    toJsonObject() {
      var A, Q;
      return {
        outlier_detection: {
          interval: (0, W0A.msToDuration)(this.intervalMs),
          base_ejection_time: (0, W0A.msToDuration)(this.baseEjectionTimeMs),
          max_ejection_time: (0, W0A.msToDuration)(this.maxEjectionTimeMs),
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
      if (z40(A, "interval"), z40(A, "base_ejection_time"), z40(A, "max_ejection_time"), g81(A, "max_ejection_percent"), "success_rate_ejection" in A && A.success_rate_ejection !== void 0) {
        if (typeof A.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
        RJA(A.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), g81(A.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), RJA(A.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), RJA(A.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
      }
      if ("failure_percentage_ejection" in A && A.failure_percentage_ejection !== void 0) {
        if (typeof A.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
        g81(A.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), g81(A.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), RJA(A.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), RJA(A.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
      }
      if (!("child_policy" in A) || !Array.isArray(A.child_policy)) throw Error("outlier detection config child_policy must be an array");
      let B = (0, Wk5.selectLbConfigFromList)(A.child_policy);
      if (!B) throw Error("outlier detection config child_policy: no valid recognized policy found");
      return new ARA(A.interval ? (0, W0A.durationToMs)(A.interval) : null, A.base_ejection_time ? (0, W0A.durationToMs)(A.base_ejection_time) : null, A.max_ejection_time ? (0, W0A.durationToMs)(A.max_ejection_time) : null, (Q = A.max_ejection_percent) !== null && Q !== void 0 ? Q : null, A.success_rate_ejection, A.failure_percentage_ejection, B)
    }
  }
  Zq2.OutlierDetectionLoadBalancingConfig = ARA;
  class Qq2 extends Fk5.BaseSubchannelWrapper {
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

  function U40() {
    return {
      success: 0,
      failure: 0
    }
  }
  class Bq2 {
    constructor() {
      this.activeBucket = U40(), this.inactiveBucket = U40()
    }
    addSuccess() {
      this.activeBucket.success += 1
    }
    addFailure() {
      this.activeBucket.failure += 1
    }
    switchBuckets() {
      this.inactiveBucket = this.activeBucket, this.activeBucket = U40()
    }
    getLastSuccesses() {
      return this.inactiveBucket.success
    }
    getLastFailures() {
      return this.inactiveBucket.failure
    }
  }
  class Gq2 {
    constructor(A, Q) {
      this.wrappedPicker = A, this.countCalls = Q
    }
    pick(A) {
      let Q = this.wrappedPicker.pick(A);
      if (Q.pickResultType === Vk5.PickResultType.COMPLETE) {
        let B = Q.subchannel,
          G = B.getMapEntry();
        if (G) {
          let Z = Q.onCallEnded;
          if (this.countCalls) Z = (I, Y, J) => {
            var W;
            if (I === ew2.Status.OK) G.counter.addSuccess();
            else G.counter.addFailure();
            (W = Q.onCallEnded) === null || W === void 0 || W.call(Q, I, Y, J)
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
  class w40 {
    constructor(A) {
      this.entryMap = new E40.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new Xk5.ChildLoadBalancerHandler((0, Aq2.createChildChannelControlHelper)(A, {
        createSubchannel: (Q, B) => {
          let G = A.createSubchannel(Q, B),
            Z = this.entryMap.getForSubchannelAddress(Q),
            I = new Qq2(G, Z);
          if ((Z === null || Z === void 0 ? void 0 : Z.currentEjectionTimestamp) !== null) I.eject();
          return Z === null || Z === void 0 || Z.subchannelWrappers.push(I), I
        },
        updateState: (Q, B, G) => {
          if (Q === Jk5.ConnectivityState.READY) A.updateState(Q, new Gq2(B, this.isCountingEnabled()), G);
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
      XK("Running success rate check");
      let B = Q.request_volume,
        G = 0,
        Z = [];
      for (let [V, F] of this.entryMap.entries()) {
        let K = F.counter.getLastSuccesses(),
          D = F.counter.getLastFailures();
        if (XK("Stats for " + (0, E40.endpointToString)(V) + ": successes=" + K + " failures=" + D + " targetRequestVolume=" + B), K + D >= B) G += 1, Z.push(K / (K + D))
      }
      if (XK("Found " + G + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + Z + "]"), G < Q.minimum_hosts) return;
      let I = Z.reduce((V, F) => V + F) / Z.length,
        Y = 0;
      for (let V of Z) {
        let F = V - I;
        Y += F * F
      }
      let J = Y / Z.length,
        W = Math.sqrt(J),
        X = I - W * (Q.stdev_factor / 1000);
      XK("stdev=" + W + " ejectionThreshold=" + X);
      for (let [V, F] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let K = F.counter.getLastSuccesses(),
          D = F.counter.getLastFailures();
        if (K + D < B) continue;
        let H = K / (K + D);
        if (XK("Checking candidate " + V + " successRate=" + H), H < X) {
          let C = Math.random() * 100;
          if (XK("Candidate " + V + " randomNumber=" + C + " enforcement_percentage=" + Q.enforcement_percentage), C < Q.enforcement_percentage) XK("Ejecting candidate " + V), this.eject(F, A)
        }
      }
    }
    runFailurePercentageCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getFailurePercentageEjectionConfig();
      if (!Q) return;
      XK("Running failure percentage check. threshold=" + Q.threshold + " request volume threshold=" + Q.request_volume);
      let B = 0;
      for (let G of this.entryMap.values()) {
        let Z = G.counter.getLastSuccesses(),
          I = G.counter.getLastFailures();
        if (Z + I >= Q.request_volume) B += 1
      }
      if (B < Q.minimum_hosts) return;
      for (let [G, Z] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let I = Z.counter.getLastSuccesses(),
          Y = Z.counter.getLastFailures();
        if (XK("Candidate successes=" + I + " failures=" + Y), I + Y < Q.request_volume) continue;
        if (Y * 100 / (Y + I) > Q.threshold) {
          let W = Math.random() * 100;
          if (XK("Candidate " + G + " randomNumber=" + W + " enforcement_percentage=" + Q.enforcement_percentage), W < Q.enforcement_percentage) XK("Ejecting candidate " + G), this.eject(Z, A)
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
      if (XK("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
      this.timerStartTime = A, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(A), this.runFailurePercentageCheck(A);
      for (let [Q, B] of this.entryMap.entries())
        if (B.currentEjectionTimestamp === null) {
          if (B.ejectionTimeMultiplier > 0) B.ejectionTimeMultiplier -= 1
        } else {
          let G = this.latestConfig.getBaseEjectionTimeMs(),
            Z = this.latestConfig.getMaxEjectionTimeMs(),
            I = new Date(B.currentEjectionTimestamp.getTime());
          if (I.setMilliseconds(I.getMilliseconds() + Math.min(G * B.ejectionTimeMultiplier, Math.max(G, Z))), I < new Date) XK("Unejecting " + Q), this.uneject(B)
        }
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof ARA)) return !1;
      if (XK("Received update with config: " + JSON.stringify(Q.toJsonObject(), void 0, 2)), A.ok) {
        for (let I of A.value)
          if (!this.entryMap.has(I)) XK("Adding map entry for " + (0, E40.endpointToString)(I)), this.entryMap.set(I, {
            counter: new Bq2,
            currentEjectionTimestamp: null,
            ejectionTimeMultiplier: 0,
            subchannelWrappers: []
          });
        this.entryMap.deleteMissing(A.value)
      }
      let Z = Q.getChildPolicy();
      if (this.childBalancer.updateAddressList(A, Z, B, G), Q.getSuccessRateEjectionConfig() || Q.getFailurePercentageEjectionConfig())
        if (this.timerStartTime) {
          XK("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
          let I = Q.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
          this.startTimer(I)
        } else XK("Starting new timer"), this.timerStartTime = new Date, this.startTimer(Q.getIntervalMs()), this.switchAllBuckets();
      else {
        XK("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
        for (let I of this.entryMap.values()) this.uneject(I), I.ejectionTimeMultiplier = 0
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
      return $40
    }
  }
  Zq2.OutlierDetectionLoadBalancer = w40;

  function zk5() {
    if (Hk5)(0, Aq2.registerLoadBalancerType)($40, w40, ARA)
  }
})
// @from(Start 11099676, End 11101149)
Vq2 = z((Wq2) => {
  Object.defineProperty(Wq2, "__esModule", {
    value: !0
  });
  Wq2.PriorityQueue = void 0;
  var TJA = 0,
    q40 = (A) => Math.floor(A / 2),
    u81 = (A) => A * 2 + 1,
    QRA = (A) => A * 2 + 2;
  class Jq2 {
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
      return this.heap[TJA]
    }
    push(...A) {
      return A.forEach((Q) => {
        this.heap.push(Q), this.siftUp()
      }), this.size()
    }
    pop() {
      let A = this.peek(),
        Q = this.size() - 1;
      if (Q > TJA) this.swap(TJA, Q);
      return this.heap.pop(), this.siftDown(), A
    }
    replace(A) {
      let Q = this.peek();
      return this.heap[TJA] = A, this.siftDown(), Q
    }
    greater(A, Q) {
      return this.comparator(this.heap[A], this.heap[Q])
    }
    swap(A, Q) {
      [this.heap[A], this.heap[Q]] = [this.heap[Q], this.heap[A]]
    }
    siftUp() {
      let A = this.size() - 1;
      while (A > TJA && this.greater(A, q40(A))) this.swap(A, q40(A)), A = q40(A)
    }
    siftDown() {
      let A = TJA;
      while (u81(A) < this.size() && this.greater(u81(A), A) || QRA(A) < this.size() && this.greater(QRA(A), A)) {
        let Q = QRA(A) < this.size() && this.greater(QRA(A), u81(A)) ? QRA(A) : u81(A);
        this.swap(A, Q), A = Q
      }
    }
  }
  Wq2.PriorityQueue = Jq2
})
// @from(Start 11101155, End 11111886)
$q2 = z((zq2) => {
  Object.defineProperty(zq2, "__esModule", {
    value: !0
  });
  zq2.WeightedRoundRobinLoadBalancingConfig = void 0;
  zq2.setup = Sk5;
  var VK = mE(),
    wk5 = E6(),
    Oq = aOA(),
    Dq2 = li(),
    qk5 = oOA(),
    Nk5 = zZ(),
    Hq2 = j81(),
    PJA = Ph(),
    Lk5 = Vq2(),
    Fq2 = eU(),
    Mk5 = "weighted_round_robin";

  function N40(A) {
    Nk5.trace(wk5.LogVerbosity.DEBUG, Mk5, A)
  }
  var L40 = "weighted_round_robin",
    Ok5 = 1e4,
    Rk5 = 1e4,
    Tk5 = 180000,
    Pk5 = 1000,
    jk5 = 1;

  function Kq2(A, Q, B) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) throw Error(`weighted round robin config ${Q} parse error: expected ${B}, got ${typeof A[Q]}`)
  }

  function m81(A, Q) {
    if (Q in A && A[Q] !== void 0 && A[Q] !== null) {
      let B;
      if ((0, Oq.isDuration)(A[Q])) B = A[Q];
      else if ((0, Oq.isDurationMessage)(A[Q])) B = (0, Oq.durationMessageToDuration)(A[Q]);
      else if (typeof A[Q] === "string") {
        let G = (0, Oq.parseDuration)(A[Q]);
        if (!G) throw Error(`weighted round robin config ${Q}: failed to parse duration string ${A[Q]}`);
        B = G
      } else throw Error(`weighted round robin config ${Q}: expected duration, got ${typeof A[Q]}`);
      return (0, Oq.durationToMs)(B)
    }
    return null
  }
  class BRA {
    constructor(A, Q, B, G, Z, I) {
      this.enableOobLoadReport = A !== null && A !== void 0 ? A : !1, this.oobLoadReportingPeriodMs = Q !== null && Q !== void 0 ? Q : Ok5, this.blackoutPeriodMs = B !== null && B !== void 0 ? B : Rk5, this.weightExpirationPeriodMs = G !== null && G !== void 0 ? G : Tk5, this.weightUpdatePeriodMs = Math.max(Z !== null && Z !== void 0 ? Z : Pk5, 100), this.errorUtilizationPenalty = I !== null && I !== void 0 ? I : jk5
    }
    getLoadBalancerName() {
      return L40
    }
    toJsonObject() {
      return {
        enable_oob_load_report: this.enableOobLoadReport,
        oob_load_reporting_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.oobLoadReportingPeriodMs)),
        blackout_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.blackoutPeriodMs)),
        weight_expiration_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.weightExpirationPeriodMs)),
        weight_update_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.weightUpdatePeriodMs)),
        error_utilization_penalty: this.errorUtilizationPenalty
      }
    }
    static createFromJson(A) {
      if (Kq2(A, "enable_oob_load_report", "boolean"), Kq2(A, "error_utilization_penalty", "number"), A.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
      return new BRA(A.enable_oob_load_report, m81(A, "oob_load_reporting_period"), m81(A, "blackout_period"), m81(A, "weight_expiration_period"), m81(A, "weight_update_period"), A.error_utilization_penalty)
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
  zq2.WeightedRoundRobinLoadBalancingConfig = BRA;
  class Cq2 {
    constructor(A, Q) {
      this.metricsHandler = Q, this.queue = new Lk5.PriorityQueue((Z, I) => Z.deadline < I.deadline);
      let B = A.filter((Z) => Z.weight > 0),
        G;
      if (B.length < 2) G = 1;
      else {
        let Z = 0;
        for (let {
            weight: I
          }
          of B) Z += I;
        G = Z / B.length
      }
      for (let Z of A) {
        let I = Z.weight > 0 ? 1 / Z.weight : G;
        this.queue.push({
          endpointName: Z.endpointName,
          picker: Z.picker,
          period: I,
          deadline: Math.random() * I
        })
      }
    }
    pick(A) {
      let Q = this.queue.pop();
      this.queue.push(Object.assign(Object.assign({}, Q), {
        deadline: Q.deadline + Q.period
      }));
      let B = Q.picker.pick(A);
      if (B.pickResultType === PJA.PickResultType.COMPLETE)
        if (this.metricsHandler) return Object.assign(Object.assign({}, B), {
          onCallEnded: (0, Hq2.createMetricsReader)((G) => this.metricsHandler(G, Q.endpointName), B.onCallEnded)
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
  class Eq2 {
    constructor(A) {
      this.channelControlHelper = A, this.latestConfig = null, this.children = new Map, this.currentState = VK.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
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
        application_utilization: I
      } = Q;
      if (I > 0 && Z > 0) I += Q.eps / Z * ((G = (B = this.latestConfig) === null || B === void 0 ? void 0 : B.getErrorUtilizationPenalty()) !== null && G !== void 0 ? G : 0);
      let Y = I === 0 ? 0 : Z / I;
      if (Y === 0) return;
      let J = new Date;
      if (A.nonEmptySince === null) A.nonEmptySince = J;
      A.lastUpdated = J, A.weight = Y
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
      if (this.countChildrenWithState(VK.ConnectivityState.READY) > 0) {
        let A = [];
        for (let [B, G] of this.children) {
          if (G.child.getConnectivityState() !== VK.ConnectivityState.READY) continue;
          A.push({
            endpointName: B,
            picker: G.child.getPicker(),
            weight: this.getWeight(G)
          })
        }
        N40("Created picker with weights: " + A.map((B) => B.endpointName + ":" + B.weight).join(","));
        let Q;
        if (!this.latestConfig.getEnableOobLoadReport()) Q = (B, G) => {
          let Z = this.children.get(G);
          if (Z) this.updateWeight(Z, B)
        };
        else Q = null;
        this.updateState(VK.ConnectivityState.READY, new Cq2(A, Q), null)
      } else if (this.countChildrenWithState(VK.ConnectivityState.CONNECTING) > 0) this.updateState(VK.ConnectivityState.CONNECTING, new PJA.QueuePicker(this), null);
      else if (this.countChildrenWithState(VK.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(VK.ConnectivityState.IDLE, new PJA.QueuePicker(this), null);
      for (let {
          child: A
        }
        of this.children.values())
        if (A.getConnectivityState() === VK.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      N40(VK.ConnectivityState[this.currentState] + " -> " + VK.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    updateAddressList(A, Q, B, G) {
      var Z, I;
      if (!(Q instanceof BRA)) return !1;
      if (!A.ok) {
        if (this.children.size === 0) this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      if (A.value.length === 0) {
        let W = `No addresses resolved. Resolution note: ${G}`;
        return this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker({
          details: W
        }), W), !1
      }
      N40("Connect to endpoint list " + A.value.map(Fq2.endpointToString));
      let Y = new Date,
        J = new Set;
      this.updatesPaused = !0, this.latestConfig = Q;
      for (let W of A.value) {
        let X = (0, Fq2.endpointToString)(W);
        J.add(X);
        let V = this.children.get(X);
        if (!V) V = {
          child: new qk5.LeafLoadBalancer(W, (0, Dq2.createChildChannelControlHelper)(this.channelControlHelper, {
            updateState: (F, K, D) => {
              if (this.currentState === VK.ConnectivityState.READY && F !== VK.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
              if (F === VK.ConnectivityState.READY) V.nonEmptySince = null;
              if (D) this.lastError = D;
              this.calculateAndUpdateState()
            },
            createSubchannel: (F, K) => {
              let D = this.channelControlHelper.createSubchannel(F, K);
              if (V === null || V === void 0 ? void 0 : V.oobMetricsListener) return new Hq2.OrcaOobMetricsSubchannelWrapper(D, V.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
              else return D
            }
          }), B, G),
          lastUpdated: Y,
          nonEmptySince: null,
          weight: 0,
          oobMetricsListener: null
        }, this.children.set(X, V);
        if (Q.getEnableOobLoadReport()) V.oobMetricsListener = (F) => {
          this.updateWeight(V, F)
        };
        else V.oobMetricsListener = null
      }
      for (let [W, X] of this.children)
        if (J.has(W)) X.child.startConnecting();
        else X.child.destroy(), this.children.delete(W);
      if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
      return this.weightUpdateTimer = (I = (Z = setInterval(() => {
        if (this.currentState === VK.ConnectivityState.READY) this.calculateAndUpdateState()
      }, Q.getWeightUpdatePeriodMs())).unref) === null || I === void 0 ? void 0 : I.call(Z), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      for (let A of this.children.values()) A.child.destroy();
      if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
    }
    getTypeName() {
      return L40
    }
  }

  function Sk5() {
    (0, Dq2.registerLoadBalancerType)(L40, Eq2, BRA)
  }
})
// @from(Start 11111892, End 11118500)
GRA = z((zG) => {
  Object.defineProperty(zG, "__esModule", {
    value: !0
  });
  zG.experimental = zG.ServerMetricRecorder = zG.ServerInterceptingCall = zG.ResponderBuilder = zG.ServerListenerBuilder = zG.addAdminServicesToServer = zG.getChannelzHandlers = zG.getChannelzServiceDefinition = zG.InterceptorConfigurationError = zG.InterceptingCall = zG.RequesterBuilder = zG.ListenerBuilder = zG.StatusBuilder = zG.getClientChannel = zG.ServerCredentials = zG.Server = zG.setLogVerbosity = zG.setLogger = zG.load = zG.loadObject = zG.CallCredentials = zG.ChannelCredentials = zG.waitForClientReady = zG.closeClient = zG.Channel = zG.makeGenericClientConstructor = zG.makeClientConstructor = zG.loadPackageDefinition = zG.Client = zG.compressionAlgorithms = zG.propagate = zG.connectivityState = zG.status = zG.logVerbosity = zG.Metadata = zG.credentials = void 0;
  var d81 = O41();
  Object.defineProperty(zG, "CallCredentials", {
    enumerable: !0,
    get: function() {
      return d81.CallCredentials
    }
  });
  var kk5 = N20();
  Object.defineProperty(zG, "Channel", {
    enumerable: !0,
    get: function() {
      return kk5.ChannelImplementation
    }
  });
  var yk5 = w90();
  Object.defineProperty(zG, "compressionAlgorithms", {
    enumerable: !0,
    get: function() {
      return yk5.CompressionAlgorithms
    }
  });
  var xk5 = mE();
  Object.defineProperty(zG, "connectivityState", {
    enumerable: !0,
    get: function() {
      return xk5.ConnectivityState
    }
  });
  var c81 = AJA();
  Object.defineProperty(zG, "ChannelCredentials", {
    enumerable: !0,
    get: function() {
      return c81.ChannelCredentials
    }
  });
  var wq2 = q20();
  Object.defineProperty(zG, "Client", {
    enumerable: !0,
    get: function() {
      return wq2.Client
    }
  });
  var M40 = E6();
  Object.defineProperty(zG, "logVerbosity", {
    enumerable: !0,
    get: function() {
      return M40.LogVerbosity
    }
  });
  Object.defineProperty(zG, "status", {
    enumerable: !0,
    get: function() {
      return M40.Status
    }
  });
  Object.defineProperty(zG, "propagate", {
    enumerable: !0,
    get: function() {
      return M40.Propagate
    }
  });
  var qq2 = zZ(),
    O40 = f41();
  Object.defineProperty(zG, "loadPackageDefinition", {
    enumerable: !0,
    get: function() {
      return O40.loadPackageDefinition
    }
  });
  Object.defineProperty(zG, "makeClientConstructor", {
    enumerable: !0,
    get: function() {
      return O40.makeClientConstructor
    }
  });
  Object.defineProperty(zG, "makeGenericClientConstructor", {
    enumerable: !0,
    get: function() {
      return O40.makeClientConstructor
    }
  });
  var vk5 = YK();
  Object.defineProperty(zG, "Metadata", {
    enumerable: !0,
    get: function() {
      return vk5.Metadata
    }
  });
  var bk5 = Dw2();
  Object.defineProperty(zG, "Server", {
    enumerable: !0,
    get: function() {
      return bk5.Server
    }
  });
  var fk5 = T81();
  Object.defineProperty(zG, "ServerCredentials", {
    enumerable: !0,
    get: function() {
      return fk5.ServerCredentials
    }
  });
  var hk5 = zw2();
  Object.defineProperty(zG, "StatusBuilder", {
    enumerable: !0,
    get: function() {
      return hk5.StatusBuilder
    }
  });
  zG.credentials = {
    combineChannelCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    combineCallCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    createInsecure: c81.ChannelCredentials.createInsecure,
    createSsl: c81.ChannelCredentials.createSsl,
    createFromSecureContext: c81.ChannelCredentials.createFromSecureContext,
    createFromMetadataGenerator: d81.CallCredentials.createFromMetadataGenerator,
    createFromGoogleCredential: d81.CallCredentials.createFromGoogleCredential,
    createEmpty: d81.CallCredentials.createEmpty
  };
  var gk5 = (A) => A.close();
  zG.closeClient = gk5;
  var uk5 = (A, Q, B) => A.waitForReady(Q, B);
  zG.waitForClientReady = uk5;
  var mk5 = (A, Q) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  zG.loadObject = mk5;
  var dk5 = (A, Q, B) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  zG.load = dk5;
  var ck5 = (A) => {
    qq2.setLogger(A)
  };
  zG.setLogger = ck5;
  var pk5 = (A) => {
    qq2.setLoggerVerbosity(A)
  };
  zG.setLogVerbosity = pk5;
  var lk5 = (A) => {
    return wq2.Client.prototype.getChannel.call(A)
  };
  zG.getClientChannel = lk5;
  var p81 = $20();
  Object.defineProperty(zG, "ListenerBuilder", {
    enumerable: !0,
    get: function() {
      return p81.ListenerBuilder
    }
  });
  Object.defineProperty(zG, "RequesterBuilder", {
    enumerable: !0,
    get: function() {
      return p81.RequesterBuilder
    }
  });
  Object.defineProperty(zG, "InterceptingCall", {
    enumerable: !0,
    get: function() {
      return p81.InterceptingCall
    }
  });
  Object.defineProperty(zG, "InterceptorConfigurationError", {
    enumerable: !0,
    get: function() {
      return p81.InterceptorConfigurationError
    }
  });
  var Nq2 = ti();
  Object.defineProperty(zG, "getChannelzServiceDefinition", {
    enumerable: !0,
    get: function() {
      return Nq2.getChannelzServiceDefinition
    }
  });
  Object.defineProperty(zG, "getChannelzHandlers", {
    enumerable: !0,
    get: function() {
      return Nq2.getChannelzHandlers
    }
  });
  var ik5 = v41();
  Object.defineProperty(zG, "addAdminServicesToServer", {
    enumerable: !0,
    get: function() {
      return ik5.addAdminServicesToServer
    }
  });
  var R40 = Q40();
  Object.defineProperty(zG, "ServerListenerBuilder", {
    enumerable: !0,
    get: function() {
      return R40.ServerListenerBuilder
    }
  });
  Object.defineProperty(zG, "ResponderBuilder", {
    enumerable: !0,
    get: function() {
      return R40.ResponderBuilder
    }
  });
  Object.defineProperty(zG, "ServerInterceptingCall", {
    enumerable: !0,
    get: function() {
      return R40.ServerInterceptingCall
    }
  });
  var nk5 = j81();
  Object.defineProperty(zG, "ServerMetricRecorder", {
    enumerable: !0,
    get: function() {
      return nk5.ServerMetricRecorder
    }
  });
  var ak5 = X40();
  zG.experimental = ak5;
  var sk5 = _90(),
    rk5 = hw2(),
    ok5 = lw2(),
    tk5 = oOA(),
    ek5 = tw2(),
    Ay5 = Yq2(),
    Qy5 = $q2(),
    By5 = ti();
  (() => {
    sk5.setup(), rk5.setup(), ok5.setup(), tk5.setup(), ek5.setup(), Ay5.setup(), Qy5.setup(), By5.setup()
  })()
})
// @from(Start 11118506, End 11119161)
Rq2 = z((Mq2) => {
  Object.defineProperty(Mq2, "__esModule", {
    value: !0
  });
  Mq2.createServiceClientConstructor = void 0;
  var Fy5 = GRA();

  function Ky5(A, Q) {
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
    return Fy5.makeGenericClientConstructor(B, Q)
  }
  Mq2.createServiceClientConstructor = Ky5
})
// @from(Start 11119167, End 11121458)
ZRA = z((Tq2) => {
  Object.defineProperty(Tq2, "__esModule", {
    value: !0
  });
  Tq2.createOtlpGrpcExporterTransport = Tq2.GrpcExporterTransport = Tq2.createEmptyMetadata = Tq2.createSslCredentials = Tq2.createInsecureCredentials = void 0;
  var Dy5 = 0,
    Hy5 = 2;

  function Cy5(A) {
    return A === "gzip" ? Hy5 : Dy5
  }

  function Ey5() {
    let {
      credentials: A
    } = GRA();
    return A.createInsecure()
  }
  Tq2.createInsecureCredentials = Ey5;

  function zy5(A, Q, B) {
    let {
      credentials: G
    } = GRA();
    return G.createSsl(A, Q, B)
  }
  Tq2.createSslCredentials = zy5;

  function Uy5() {
    let {
      Metadata: A
    } = GRA();
    return new A
  }
  Tq2.createEmptyMetadata = Uy5;
  class T40 {
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
        } = Rq2();
        try {
          this._metadata = this._parameters.metadata()
        } catch (I) {
          return Promise.resolve({
            status: "failure",
            error: I
          })
        }
        let Z = G(this._parameters.grpcPath, this._parameters.grpcName);
        try {
          this._client = new Z(this._parameters.address, this._parameters.credentials(), {
            "grpc.default_compression_algorithm": Cy5(this._parameters.compression)
          })
        } catch (I) {
          return Promise.resolve({
            status: "failure",
            error: I
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
        }, (I, Y) => {
          if (I) G({
            status: "failure",
            error: I
          });
          else G({
            data: Y,
            status: "success"
          })
        })
      })
    }
  }
  Tq2.GrpcExporterTransport = T40;

  function $y5(A) {
    return new T40(A)
  }
  Tq2.createOtlpGrpcExporterTransport = $y5
})
// @from(Start 11121464, End 11121600)
_q2 = z((jq2) => {
  Object.defineProperty(jq2, "__esModule", {
    value: !0
  });
  jq2.VERSION = void 0;
  jq2.VERSION = "0.204.0"
})
// @from(Start 11121606, End 11123557)
hq2 = z((bq2) => {
  Object.defineProperty(bq2, "__esModule", {
    value: !0
  });
  bq2.getOtlpGrpcDefaultConfiguration = bq2.mergeOtlpGrpcConfigurationWithDefaults = bq2.validateAndNormalizeUrl = void 0;
  var xq2 = sk(),
    IRA = ZRA(),
    My5 = _q2(),
    Oy5 = UA("url"),
    kq2 = K9();

  function vq2(A) {
    if (A = A.trim(), !A.match(/^([\w]{1,8}):\/\//)) A = `https://${A}`;
    let B = new Oy5.URL(A);
    if (B.protocol === "unix:") return A;
    if (B.pathname && B.pathname !== "/") kq2.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
    if (B.protocol !== "" && !B.protocol?.match(/^(http)s?:$/)) kq2.diag.warn("URL protocol should be http(s)://. Using http://.");
    return B.host
  }
  bq2.validateAndNormalizeUrl = vq2;

  function yq2(A, Q) {
    for (let [B, G] of Object.entries(Q.getMap()))
      if (A.get(B).length < 1) A.set(B, G)
  }

  function Ry5(A, Q, B) {
    let G = A.url ?? Q.url ?? B.url;
    return {
      ...(0, xq2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      metadata: () => {
        let Z = B.metadata();
        return yq2(Z, A.metadata?.().clone() ?? (0, IRA.createEmptyMetadata)()), yq2(Z, Q.metadata?.() ?? (0, IRA.createEmptyMetadata)()), Z
      },
      url: vq2(G),
      credentials: A.credentials ?? Q.credentials?.(G) ?? B.credentials(G)
    }
  }
  bq2.mergeOtlpGrpcConfigurationWithDefaults = Ry5;

  function Ty5() {
    return {
      ...(0, xq2.getSharedConfigurationDefaults)(),
      metadata: () => {
        let A = (0, IRA.createEmptyMetadata)();
        return A.set("User-Agent", `OTel-OTLP-Exporter-JavaScript/${My5.VERSION}`), A
      },
      url: "http://localhost:4317",
      credentials: (A) => {
        if (A.startsWith("http://")) return () => (0, IRA.createInsecureCredentials)();
        else return () => (0, IRA.createSslCredentials)()
      }
    }
  }
  bq2.getOtlpGrpcDefaultConfiguration = Ty5
})
// @from(Start 11123563, End 11126631)
lq2 = z((cq2) => {
  Object.defineProperty(cq2, "__esModule", {
    value: !0
  });
  cq2.getOtlpGrpcConfigurationFromEnv = void 0;
  var gq2 = e6(),
    YRA = ZRA(),
    Sy5 = mi(),
    _y5 = UA("fs"),
    ky5 = UA("path"),
    mq2 = K9();

  function P40(A, Q) {
    if (A != null && A !== "") return A;
    if (Q != null && Q !== "") return Q;
    return
  }

  function yy5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_HEADERS`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
      G = (0, gq2.parseKeyPairsIntoRecord)(Q),
      Z = (0, gq2.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    let I = Object.assign({}, Z, G),
      Y = (0, YRA.createEmptyMetadata)();
    for (let [J, W] of Object.entries(I)) Y.set(J, W);
    return Y
  }

  function xy5(A) {
    let Q = yy5(A);
    if (Q == null) return;
    return () => Q
  }

  function vy5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
    return P40(Q, B)
  }

  function by5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_INSECURE`]?.toLowerCase().trim(),
      B = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
    return P40(Q, B) === "true"
  }

  function j40(A, Q, B) {
    let G = process.env[A]?.trim(),
      Z = process.env[Q]?.trim(),
      I = P40(G, Z);
    if (I != null) try {
      return _y5.readFileSync(ky5.resolve(process.cwd(), I))
    } catch {
      mq2.diag.warn(B);
      return
    } else return
  }

  function fy5(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
  }

  function hy5(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
  }

  function uq2(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
  }

  function dq2(A) {
    let Q = hy5(A),
      B = fy5(A),
      G = uq2(A),
      Z = Q != null && B != null;
    if (G != null && !Z) return mq2.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, YRA.createSslCredentials)(uq2(A));
    return (0, YRA.createSslCredentials)(G, Q, B)
  }

  function gy5(A) {
    if (by5(A)) return (0, YRA.createInsecureCredentials)();
    return dq2(A)
  }

  function uy5(A) {
    return {
      ...(0, Sy5.getSharedConfigurationFromEnvironment)(A),
      metadata: xy5(A),
      url: vy5(A),
      credentials: (Q) => {
        if (Q.startsWith("http://")) return () => {
          return (0, YRA.createInsecureCredentials)()
        };
        else if (Q.startsWith("https://")) return () => {
          return dq2(A)
        };
        return () => {
          return gy5(A)
        }
      }
    }
  }
  cq2.getOtlpGrpcConfigurationFromEnv = uy5
})
// @from(Start 11126637, End 11127440)
sq2 = z((nq2) => {
  Object.defineProperty(nq2, "__esModule", {
    value: !0
  });
  nq2.convertLegacyOtlpGrpcOptions = void 0;
  var my5 = K9(),
    iq2 = hq2(),
    dy5 = ZRA(),
    cy5 = lq2();

  function py5(A, Q) {
    if (A.headers) my5.diag.warn("Headers cannot be set when using grpc");
    let B = A.credentials;
    return (0, iq2.mergeOtlpGrpcConfigurationWithDefaults)({
      url: A.url,
      metadata: () => {
        return A.metadata ?? (0, dy5.createEmptyMetadata)()
      },
      compression: A.compression,
      timeoutMillis: A.timeoutMillis,
      concurrencyLimit: A.concurrencyLimit,
      credentials: B != null ? () => B : void 0
    }, (0, cy5.getOtlpGrpcConfigurationFromEnv)(Q), (0, iq2.getOtlpGrpcDefaultConfiguration)())
  }
  nq2.convertLegacyOtlpGrpcOptions = py5
})
// @from(Start 11127446, End 11127951)
tq2 = z((rq2) => {
  Object.defineProperty(rq2, "__esModule", {
    value: !0
  });
  rq2.createOtlpGrpcExportDelegate = void 0;
  var ly5 = sk(),
    iy5 = ZRA();

  function ny5(A, Q, B, G) {
    return (0, ly5.createOtlpNetworkExportDelegate)(A, Q, (0, iy5.createOtlpGrpcExporterTransport)({
      address: A.url,
      compression: A.compression,
      credentials: A.credentials,
      metadata: A.metadata,
      grpcName: B,
      grpcPath: G
    }))
  }
  rq2.createOtlpGrpcExportDelegate = ny5
})
// @from(Start 11127957, End 11128486)
i81 = z((l81) => {
  Object.defineProperty(l81, "__esModule", {
    value: !0
  });
  l81.createOtlpGrpcExportDelegate = l81.convertLegacyOtlpGrpcOptions = void 0;
  var ay5 = sq2();
  Object.defineProperty(l81, "convertLegacyOtlpGrpcOptions", {
    enumerable: !0,
    get: function() {
      return ay5.convertLegacyOtlpGrpcOptions
    }
  });
  var sy5 = tq2();
  Object.defineProperty(l81, "createOtlpGrpcExportDelegate", {
    enumerable: !0,
    get: function() {
      return sy5.createOtlpGrpcExportDelegate
    }
  })
})
// @from(Start 11128492, End 11129011)
GN2 = z((QN2) => {
  Object.defineProperty(QN2, "__esModule", {
    value: !0
  });
  QN2.OTLPMetricExporter = void 0;
  var oy5 = w41(),
    eq2 = i81(),
    ty5 = tk();
  class AN2 extends oy5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, eq2.createOtlpGrpcExportDelegate)((0, eq2.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"), ty5.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), A)
    }
  }
  QN2.OTLPMetricExporter = AN2
})
// @from(Start 11129017, End 11129299)
ZN2 = z((S40) => {
  Object.defineProperty(S40, "__esModule", {
    value: !0
  });
  S40.OTLPMetricExporter = void 0;
  var ey5 = GN2();
  Object.defineProperty(S40, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return ey5.OTLPMetricExporter
    }
  })
})
// @from(Start 11129305, End 11134065)
y40 = z((WN2) => {
  Object.defineProperty(WN2, "__esModule", {
    value: !0
  });
  WN2.PrometheusSerializer = void 0;
  var Qx5 = K9(),
    X0A = vi(),
    IN2 = e6();

  function a81(A) {
    return A.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
  }

  function YN2(A = "") {
    if (typeof A !== "string") A = JSON.stringify(A);
    return a81(A).replace(/"/g, "\\\"")
  }
  var Bx5 = /[^a-z0-9_]/gi,
    Gx5 = /_{2,}/g;

  function k40(A) {
    return A.replace(Bx5, "_").replace(Gx5, "_")
  }

  function _40(A, Q) {
    if (!A.endsWith("_total") && Q.dataPointType === X0A.DataPointType.SUM && Q.isMonotonic) A = A + "_total";
    return A
  }

  function Zx5(A) {
    if (A === 1 / 0) return "+Inf";
    else if (A === -1 / 0) return "-Inf";
    else return `${A}`
  }

  function Ix5(A) {
    switch (A.dataPointType) {
      case X0A.DataPointType.SUM:
        if (A.isMonotonic) return "counter";
        return "gauge";
      case X0A.DataPointType.GAUGE:
        return "gauge";
      case X0A.DataPointType.HISTOGRAM:
        return "histogram";
      default:
        return "untyped"
    }
  }

  function n81(A, Q, B, G, Z) {
    let I = !1,
      Y = "";
    for (let [J, W] of Object.entries(Q)) {
      let X = k40(J);
      I = !0, Y += `${Y.length>0?",":""}${X}="${YN2(W)}"`
    }
    if (Z)
      for (let [J, W] of Object.entries(Z)) {
        let X = k40(J);
        I = !0, Y += `${Y.length>0?",":""}${X}="${YN2(W)}"`
      }
    if (I) A += `{${Y}}`;
    return `${A} ${Zx5(B)}${G!==void 0?" "+String(G):""}
`
  }
  var Yx5 = "# no registered metrics";
  class JN2 {
    _prefix;
    _appendTimestamp;
    _additionalAttributes;
    _withResourceConstantLabels;
    constructor(A, Q = !1, B) {
      if (A) this._prefix = A + "_";
      this._appendTimestamp = Q, this._withResourceConstantLabels = B
    }
    serialize(A) {
      let Q = "";
      this._additionalAttributes = this._filterResourceConstantLabels(A.resource.attributes, this._withResourceConstantLabels);
      for (let B of A.scopeMetrics) Q += this._serializeScopeMetrics(B);
      if (Q === "") Q += Yx5;
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
      let Q = k40(a81(A.descriptor.name));
      if (this._prefix) Q = `${this._prefix}${Q}`;
      let B = A.dataPointType;
      Q = _40(Q, A);
      let G = `# HELP ${Q} ${a81(A.descriptor.description||"description missing")}`,
        Z = A.descriptor.unit ? `
# UNIT ${Q} ${a81(A.descriptor.unit)}` : "",
        I = `# TYPE ${Q} ${Ix5(A)}`,
        Y = "";
      switch (B) {
        case X0A.DataPointType.SUM:
        case X0A.DataPointType.GAUGE: {
          Y = A.dataPoints.map((J) => this._serializeSingularDataPoint(Q, A, J)).join("");
          break
        }
        case X0A.DataPointType.HISTOGRAM: {
          Y = A.dataPoints.map((J) => this._serializeHistogramDataPoint(Q, A, J)).join("");
          break
        }
        default:
          Qx5.diag.error(`Unrecognizable DataPointType: ${B} for metric "${Q}"`)
      }
      return `${G}${Z}
${I}
${Y}`.trim()
    }
    _serializeSingularDataPoint(A, Q, B) {
      let G = "";
      A = _40(A, Q);
      let {
        value: Z,
        attributes: I
      } = B, Y = (0, IN2.hrTimeToMilliseconds)(B.endTime);
      return G += n81(A, I, Z, this._appendTimestamp ? Y : void 0, this._additionalAttributes), G
    }
    _serializeHistogramDataPoint(A, Q, B) {
      let G = "";
      A = _40(A, Q);
      let {
        attributes: Z,
        value: I
      } = B, Y = (0, IN2.hrTimeToMilliseconds)(B.endTime);
      for (let V of ["count", "sum"]) {
        let F = I[V];
        if (F != null) G += n81(A + "_" + V, Z, F, this._appendTimestamp ? Y : void 0, this._additionalAttributes)
      }
      let J = 0,
        W = I.buckets.counts.entries(),
        X = !1;
      for (let [V, F] of W) {
        J += F;
        let K = I.buckets.boundaries[V];
        if (K === void 0 && X) break;
        if (K === 1 / 0) X = !0;
        G += n81(A + "_bucket", Z, J, this._appendTimestamp ? Y : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
          le: K === void 0 || K === 1 / 0 ? "+Inf" : String(K)
        }))
      }
      return G
    }
    _serializeResource(A) {
      return `# HELP target_info Target metadata
# TYPE target_info gauge
${n81("target_info",A.attributes,1).trim()}
`
    }
  }
  WN2.PrometheusSerializer = JN2
})
// @from(Start 11134071, End 11137598)
KN2 = z((VN2) => {
  Object.defineProperty(VN2, "__esModule", {
    value: !0
  });
  VN2.PrometheusExporter = void 0;
  var JRA = K9(),
    Jx5 = e6(),
    x40 = vi(),
    Wx5 = UA("http"),
    Xx5 = y40(),
    Vx5 = UA("url");
  class Zn extends x40.MetricReader {
    static DEFAULT_OPTIONS = {
      host: void 0,
      port: 9464,
      endpoint: "/metrics",
      prefix: "",
      appendTimestamp: !1,
      withResourceConstantLabels: void 0
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
        aggregationSelector: (G) => {
          return {
            type: x40.AggregationType.DEFAULT
          }
        },
        aggregationTemporalitySelector: (G) => x40.AggregationTemporality.CUMULATIVE,
        metricProducers: A.metricProducers
      });
      this._host = A.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || Zn.DEFAULT_OPTIONS.host, this._port = A.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || Zn.DEFAULT_OPTIONS.port, this._prefix = A.prefix || Zn.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof A.appendTimestamp === "boolean" ? A.appendTimestamp : Zn.DEFAULT_OPTIONS.appendTimestamp;
      let B = A.withResourceConstantLabels || Zn.DEFAULT_OPTIONS.withResourceConstantLabels;
      if (this._server = (0, Wx5.createServer)(this._requestHandler).unref(), this._serializer = new Xx5.PrometheusSerializer(this._prefix, this._appendTimestamp, B), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (A.endpoint || Zn.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), A.preventServerStart !== !0) this.startServer().then(Q, (G) => {
        JRA.diag.error(G), Q(G)
      });
      else if (Q) queueMicrotask(Q)
    }
    async onForceFlush() {}
    onShutdown() {
      return this.stopServer()
    }
    stopServer() {
      if (!this._server) return JRA.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
      else return new Promise((A) => {
        this._server.close((Q) => {
          if (!Q) JRA.diag.debug("Prometheus exporter was stopped");
          else if (Q.code !== "ERR_SERVER_NOT_RUNNING")(0, Jx5.globalErrorHandler)(Q);
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
          JRA.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), A()
        })
      }), this._startServerPromise
    }
    getMetricsRequestHandler(A, Q) {
      this._exportMetrics(Q)
    }
    _requestHandler = (A, Q) => {
      if (A.url != null && new Vx5.URL(A.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(Q);
      else this._notFound(Q)
    };
    _exportMetrics = (A) => {
      A.statusCode = 200, A.setHeader("content-type", "text/plain"), this.collect().then((Q) => {
        let {
          resourceMetrics: B,
          errors: G
        } = Q;
        if (G.length) JRA.diag.error("PrometheusExporter: metrics collection errors", ...G);
        A.end(this._serializer.serialize(B))
      }, (Q) => {
        A.end(`# failed to export metrics: ${Q}`)
      })
    };
    _notFound = (A) => {
      A.statusCode = 404, A.end()
    }
  }
  VN2.PrometheusExporter = Zn
})
// @from(Start 11137604, End 11138079)
DN2 = z((s81) => {
  Object.defineProperty(s81, "__esModule", {
    value: !0
  });
  s81.PrometheusSerializer = s81.PrometheusExporter = void 0;
  var Fx5 = KN2();
  Object.defineProperty(s81, "PrometheusExporter", {
    enumerable: !0,
    get: function() {
      return Fx5.PrometheusExporter
    }
  });
  var Kx5 = y40();
  Object.defineProperty(s81, "PrometheusSerializer", {
    enumerable: !0,
    get: function() {
      return Kx5.PrometheusSerializer
    }
  })
})
// @from(Start 11138085, End 11138221)
EN2 = z((HN2) => {
  Object.defineProperty(HN2, "__esModule", {
    value: !0
  });
  HN2.VERSION = void 0;
  HN2.VERSION = "0.204.0"
})
// @from(Start 11138227, End 11138785)
qN2 = z(($N2) => {
  Object.defineProperty($N2, "__esModule", {
    value: !0
  });
  $N2.OTLPLogExporter = void 0;
  var Hx5 = sk(),
    Cx5 = tk(),
    zN2 = mi(),
    Ex5 = EN2();
  class UN2 extends Hx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, zN2.createOtlpHttpExportDelegate)((0, zN2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Ex5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Cx5.ProtobufLogsSerializer))
    }
  }
  $N2.OTLPLogExporter = UN2
})
// @from(Start 11138791, End 11139064)
NN2 = z((v40) => {
  Object.defineProperty(v40, "__esModule", {
    value: !0
  });
  v40.OTLPLogExporter = void 0;
  var zx5 = qN2();
  Object.defineProperty(v40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return zx5.OTLPLogExporter
    }
  })
})
// @from(Start 11139070, End 11139343)
LN2 = z((b40) => {
  Object.defineProperty(b40, "__esModule", {
    value: !0
  });
  b40.OTLPLogExporter = void 0;
  var $x5 = NN2();
  Object.defineProperty(b40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return $x5.OTLPLogExporter
    }
  })
})
// @from(Start 11139349, End 11139622)
MN2 = z((f40) => {
  Object.defineProperty(f40, "__esModule", {
    value: !0
  });
  f40.OTLPLogExporter = void 0;
  var qx5 = LN2();
  Object.defineProperty(f40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return qx5.OTLPLogExporter
    }
  })
})
// @from(Start 11139628, End 11140115)
jN2 = z((TN2) => {
  Object.defineProperty(TN2, "__esModule", {
    value: !0
  });
  TN2.OTLPLogExporter = void 0;
  var ON2 = i81(),
    Lx5 = tk(),
    Mx5 = sk();
  class RN2 extends Mx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, ON2.createOtlpGrpcExportDelegate)((0, ON2.convertLegacyOtlpGrpcOptions)(A, "LOGS"), Lx5.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
    }
  }
  TN2.OTLPLogExporter = RN2
})
// @from(Start 11140121, End 11140394)
SN2 = z((h40) => {
  Object.defineProperty(h40, "__esModule", {
    value: !0
  });
  h40.OTLPLogExporter = void 0;
  var Ox5 = jN2();
  Object.defineProperty(h40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return Ox5.OTLPLogExporter
    }
  })
})
// @from(Start 11140400, End 11140536)
yN2 = z((_N2) => {
  Object.defineProperty(_N2, "__esModule", {
    value: !0
  });
  _N2.VERSION = void 0;
  _N2.VERSION = "0.204.0"
})
// @from(Start 11140542, End 11141090)
hN2 = z((bN2) => {
  Object.defineProperty(bN2, "__esModule", {
    value: !0
  });
  bN2.OTLPLogExporter = void 0;
  var Tx5 = sk(),
    Px5 = tk(),
    jx5 = yN2(),
    xN2 = mi();
  class vN2 extends Tx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, xN2.createOtlpHttpExportDelegate)((0, xN2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${jx5.VERSION}`,
        "Content-Type": "application/json"
      }), Px5.JsonLogsSerializer))
    }
  }
  bN2.OTLPLogExporter = vN2
})
// @from(Start 11141096, End 11141369)
gN2 = z((g40) => {
  Object.defineProperty(g40, "__esModule", {
    value: !0
  });
  g40.OTLPLogExporter = void 0;
  var Sx5 = hN2();
  Object.defineProperty(g40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return Sx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141375, End 11141648)
uN2 = z((u40) => {
  Object.defineProperty(u40, "__esModule", {
    value: !0
  });
  u40.OTLPLogExporter = void 0;
  var kx5 = gN2();
  Object.defineProperty(u40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return kx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141654, End 11141927)
mN2 = z((m40) => {
  Object.defineProperty(m40, "__esModule", {
    value: !0
  });
  m40.OTLPLogExporter = void 0;
  var xx5 = uN2();
  Object.defineProperty(m40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return xx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141933, End 11142093)
pN2 = z((dN2) => {
  Object.defineProperty(dN2, "__esModule", {
    value: !0
  });
  dN2.ExceptionEventName = void 0;
  dN2.ExceptionEventName = "exception"
})
// @from(Start 11142099, End 11148788)
aN2 = z((iN2) => {
  Object.defineProperty(iN2, "__esModule", {
    value: !0
  });
  iN2.SpanImpl = void 0;
  var KO = K9(),
    GC = e6(),
    V0A = qt(),
    bx5 = pN2();
  class lN2 {
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
      code: KO.SpanStatusCode.UNSET
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
      if (this._spanContext = A.spanContext, this._performanceStartTime = GC.otperformance.now(), this._performanceOffset = Q - (this._performanceStartTime + (0, GC.getTimeOrigin)()), this._startTimeProvided = A.startTime != null, this._spanLimits = A.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = A.spanProcessor, this.name = A.name, this.parentSpanContext = A.parentSpanContext, this.kind = A.kind, this.links = A.links || [], this.startTime = this._getTime(A.startTime ?? Q), this.resource = A.resource, this.instrumentationScope = A.scope, A.attributes != null) this.setAttributes(A.attributes);
      this._spanProcessor.onStart(this, A.context)
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      if (Q == null || this._isSpanEnded()) return this;
      if (A.length === 0) return KO.diag.warn(`Invalid attribute key: ${A}`), this;
      if (!(0, GC.isAttributeValue)(Q)) return KO.diag.warn(`Invalid attribute value set for key: ${A}`), this;
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
      if (G === 0) return KO.diag.warn("No events allowed."), this._droppedEventsCount++, this;
      if (G !== void 0 && this.events.length >= G) {
        if (this._droppedEventsCount === 0) KO.diag.debug("Dropping extra events.");
        this.events.shift(), this._droppedEventsCount++
      }
      if ((0, GC.isTimeInput)(Q)) {
        if (!(0, GC.isTimeInput)(B)) B = Q;
        Q = void 0
      }
      let Z = (0, GC.sanitizeAttributes)(Q);
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
        }, this.status.message != null && typeof A.message !== "string") KO.diag.warn(`Dropping invalid status.message of type '${typeof A.message}', expected 'string'`), delete this.status.message;
      return this
    }
    updateName(A) {
      if (this._isSpanEnded()) return this;
      return this.name = A, this
    }
    end(A) {
      if (this._isSpanEnded()) {
        KO.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
        return
      }
      if (this._ended = !0, this.endTime = this._getTime(A), this._duration = (0, GC.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) KO.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
      if (this._droppedEventsCount > 0) KO.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
      this._spanProcessor.onEnd(this)
    }
    _getTime(A) {
      if (typeof A === "number" && A <= GC.otperformance.now()) return (0, GC.hrTime)(A + this._performanceOffset);
      if (typeof A === "number") return (0, GC.millisToHrTime)(A);
      if (A instanceof Date) return (0, GC.millisToHrTime)(A.getTime());
      if ((0, GC.isTimeInputHrTime)(A)) return A;
      if (this._startTimeProvided) return (0, GC.millisToHrTime)(Date.now());
      let Q = GC.otperformance.now() - this._performanceStartTime;
      return (0, GC.addHrTimes)(this.startTime, (0, GC.millisToHrTime)(Q))
    }
    isRecording() {
      return this._ended === !1
    }
    recordException(A, Q) {
      let B = {};
      if (typeof A === "string") B[V0A.ATTR_EXCEPTION_MESSAGE] = A;
      else if (A) {
        if (A.code) B[V0A.ATTR_EXCEPTION_TYPE] = A.code.toString();
        else if (A.name) B[V0A.ATTR_EXCEPTION_TYPE] = A.name;
        if (A.message) B[V0A.ATTR_EXCEPTION_MESSAGE] = A.message;
        if (A.stack) B[V0A.ATTR_EXCEPTION_STACKTRACE] = A.stack
      }
      if (B[V0A.ATTR_EXCEPTION_TYPE] || B[V0A.ATTR_EXCEPTION_MESSAGE]) this.addEvent(bx5.ExceptionEventName, B, Q);
      else KO.diag.warn(`Failed to record an exception ${A}`)
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
        KO.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, A)
      }
      return this._ended
    }
    _truncateToLimitUtil(A, Q) {
      if (A.length <= Q) return A;
      return A.substring(0, Q)
    }
    _truncateToSize(A) {
      let Q = this._attributeValueLengthLimit;
      if (Q <= 0) return KO.diag.warn(`Attribute value limit must be positive, got ${Q}`), A;
      if (typeof A === "string") return this._truncateToLimitUtil(A, Q);
      if (Array.isArray(A)) return A.map((B) => typeof B === "string" ? this._truncateToLimitUtil(B, Q) : B);
      return A
    }
  }
  iN2.SpanImpl = lN2
})
// @from(Start 11148794, End 11149124)
WRA = z((sN2) => {
  Object.defineProperty(sN2, "__esModule", {
    value: !0
  });
  sN2.SamplingDecision = void 0;
  var fx5;
  (function(A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })(fx5 = sN2.SamplingDecision || (sN2.SamplingDecision = {}))
})
// @from(Start 11149130, End 11149470)
r81 = z((oN2) => {
  Object.defineProperty(oN2, "__esModule", {
    value: !0
  });
  oN2.AlwaysOffSampler = void 0;
  var hx5 = WRA();
  class rN2 {
    shouldSample() {
      return {
        decision: hx5.SamplingDecision.NOT_RECORD
      }
    }
    toString() {
      return "AlwaysOffSampler"
    }
  }
  oN2.AlwaysOffSampler = rN2
})
// @from(Start 11149476, End 11149821)
o81 = z((AL2) => {
  Object.defineProperty(AL2, "__esModule", {
    value: !0
  });
  AL2.AlwaysOnSampler = void 0;
  var gx5 = WRA();
  class eN2 {
    shouldSample() {
      return {
        decision: gx5.SamplingDecision.RECORD_AND_SAMPLED
      }
    }
    toString() {
      return "AlwaysOnSampler"
    }
  }
  AL2.AlwaysOnSampler = eN2
})
// @from(Start 11149827, End 11151639)
p40 = z((ZL2) => {
  Object.defineProperty(ZL2, "__esModule", {
    value: !0
  });
  ZL2.ParentBasedSampler = void 0;
  var t81 = K9(),
    ux5 = e6(),
    BL2 = r81(),
    c40 = o81();
  class GL2 {
    _root;
    _remoteParentSampled;
    _remoteParentNotSampled;
    _localParentSampled;
    _localParentNotSampled;
    constructor(A) {
      if (this._root = A.root, !this._root)(0, ux5.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new c40.AlwaysOnSampler;
      this._remoteParentSampled = A.remoteParentSampled ?? new c40.AlwaysOnSampler, this._remoteParentNotSampled = A.remoteParentNotSampled ?? new BL2.AlwaysOffSampler, this._localParentSampled = A.localParentSampled ?? new c40.AlwaysOnSampler, this._localParentNotSampled = A.localParentNotSampled ?? new BL2.AlwaysOffSampler
    }
    shouldSample(A, Q, B, G, Z, I) {
      let Y = t81.trace.getSpanContext(A);
      if (!Y || !(0, t81.isSpanContextValid)(Y)) return this._root.shouldSample(A, Q, B, G, Z, I);
      if (Y.isRemote) {
        if (Y.traceFlags & t81.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(A, Q, B, G, Z, I);
        return this._remoteParentNotSampled.shouldSample(A, Q, B, G, Z, I)
      }
      if (Y.traceFlags & t81.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(A, Q, B, G, Z, I);
      return this._localParentNotSampled.shouldSample(A, Q, B, G, Z, I)
    }
    toString() {
      return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
    }
  }
  ZL2.ParentBasedSampler = GL2
})
// @from(Start 11151645, End 11152656)
l40 = z((WL2) => {
  Object.defineProperty(WL2, "__esModule", {
    value: !0
  });
  WL2.TraceIdRatioBasedSampler = void 0;
  var mx5 = K9(),
    YL2 = WRA();
  class JL2 {
    _ratio;
    _upperBound;
    constructor(A = 0) {
      this._ratio = A, this._ratio = this._normalize(A), this._upperBound = Math.floor(this._ratio * 4294967295)
    }
    shouldSample(A, Q) {
      return {
        decision: (0, mx5.isValidTraceId)(Q) && this._accumulate(Q) < this._upperBound ? YL2.SamplingDecision.RECORD_AND_SAMPLED : YL2.SamplingDecision.NOT_RECORD
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
  WL2.TraceIdRatioBasedSampler = JL2
})
// @from(Start 11152662, End 11155590)
a40 = z((HL2) => {
  Object.defineProperty(HL2, "__esModule", {
    value: !0
  });
  HL2.buildSamplerFromEnv = HL2.loadDefaultConfig = void 0;
  var n40 = K9(),
    Fy = e6(),
    VL2 = r81(),
    i40 = o81(),
    e81 = p40(),
    FL2 = l40(),
    Ky;
  (function(A) {
    A.AlwaysOff = "always_off", A.AlwaysOn = "always_on", A.ParentBasedAlwaysOff = "parentbased_always_off", A.ParentBasedAlwaysOn = "parentbased_always_on", A.ParentBasedTraceIdRatio = "parentbased_traceidratio", A.TraceIdRatio = "traceidratio"
  })(Ky || (Ky = {}));
  var A61 = 1;

  function dx5() {
    return {
      sampler: DL2(),
      forceFlushTimeoutMillis: 30000,
      generalLimits: {
        attributeValueLengthLimit: (0, Fy.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Fy.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
      },
      spanLimits: {
        attributeValueLengthLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
        linkCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
        eventCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
        attributePerEventCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
        attributePerLinkCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
      }
    }
  }
  HL2.loadDefaultConfig = dx5;

  function DL2() {
    let A = (0, Fy.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? Ky.ParentBasedAlwaysOn;
    switch (A) {
      case Ky.AlwaysOn:
        return new i40.AlwaysOnSampler;
      case Ky.AlwaysOff:
        return new VL2.AlwaysOffSampler;
      case Ky.ParentBasedAlwaysOn:
        return new e81.ParentBasedSampler({
          root: new i40.AlwaysOnSampler
        });
      case Ky.ParentBasedAlwaysOff:
        return new e81.ParentBasedSampler({
          root: new VL2.AlwaysOffSampler
        });
      case Ky.TraceIdRatio:
        return new FL2.TraceIdRatioBasedSampler(KL2());
      case Ky.ParentBasedTraceIdRatio:
        return new e81.ParentBasedSampler({
          root: new FL2.TraceIdRatioBasedSampler(KL2())
        });
      default:
        return n40.diag.error(`OTEL_TRACES_SAMPLER value "${A}" invalid, defaulting to "${Ky.ParentBasedAlwaysOn}".`), new e81.ParentBasedSampler({
          root: new i40.AlwaysOnSampler
        })
    }
  }
  HL2.buildSamplerFromEnv = DL2;

  function KL2() {
    let A = (0, Fy.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
    if (A == null) return n40.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${A61}.`), A61;
    if (A < 0 || A > 1) return n40.diag.error(`OTEL_TRACES_SAMPLER_ARG=${A} was given, but it is out of range ([0..1]), defaulting to ${A61}.`), A61;
    return A
  }
})
// @from(Start 11155596, End 11157018)
s40 = z((zL2) => {
  Object.defineProperty(zL2, "__esModule", {
    value: !0
  });
  zL2.reconfigureLimits = zL2.mergeConfig = zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
  var EL2 = a40(),
    Q61 = e6();
  zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

  function px5(A) {
    let Q = {
        sampler: (0, EL2.buildSamplerFromEnv)()
      },
      B = (0, EL2.loadDefaultConfig)(),
      G = Object.assign({}, B, Q, A);
    return G.generalLimits = Object.assign({}, B.generalLimits, A.generalLimits || {}), G.spanLimits = Object.assign({}, B.spanLimits, A.spanLimits || {}), G
  }
  zL2.mergeConfig = px5;

  function lx5(A) {
    let Q = Object.assign({}, A.spanLimits);
    return Q.attributeCountLimit = A.spanLimits?.attributeCountLimit ?? A.generalLimits?.attributeCountLimit ?? (0, Q61.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, Q61.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT, Q.attributeValueLengthLimit = A.spanLimits?.attributeValueLengthLimit ?? A.generalLimits?.attributeValueLengthLimit ?? (0, Q61.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, Q61.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, A, {
      spanLimits: Q
    })
  }
  zL2.reconfigureLimits = lx5
})
// @from(Start 11157024, End 11161747)
ML2 = z((NL2) => {
  Object.defineProperty(NL2, "__esModule", {
    value: !0
  });
  NL2.BatchSpanProcessorBase = void 0;
  var jJA = K9(),
    Dy = e6();
  class qL2 {
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
      if (this._exporter = A, this._maxExportBatchSize = typeof Q?.maxExportBatchSize === "number" ? Q.maxExportBatchSize : (0, Dy.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof Q?.maxQueueSize === "number" ? Q.maxQueueSize : (0, Dy.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof Q?.scheduledDelayMillis === "number" ? Q.scheduledDelayMillis : (0, Dy.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof Q?.exportTimeoutMillis === "number" ? Q.exportTimeoutMillis : (0, Dy.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new Dy.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) jJA.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
    }
    forceFlush() {
      if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
      return this._flushAll()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & jJA.TraceFlags.SAMPLED) === 0) return;
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
        if (this._droppedSpansCount === 0) jJA.diag.debug("maxQueueSize reached, dropping spans");
        this._droppedSpansCount++;
        return
      }
      if (this._droppedSpansCount > 0) jJA.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
      this._finishedSpans.push(A), this._maybeStartTimer()
    }
    _flushAll() {
      return new Promise((A, Q) => {
        let B = [],
          G = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
        for (let Z = 0, I = G; Z < I; Z++) B.push(this._flushOneBatch());
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
        jJA.context.with((0, Dy.suppressTracing)(jJA.context.active()), () => {
          let G;
          if (this._finishedSpans.length <= this._maxExportBatchSize) G = this._finishedSpans, this._finishedSpans = [];
          else G = this._finishedSpans.splice(0, this._maxExportBatchSize);
          let Z = () => this._exporter.export(G, (Y) => {
              if (clearTimeout(B), Y.code === Dy.ExportResultCode.SUCCESS) A();
              else Q(Y.error ?? Error("BatchSpanProcessor: span export failed"))
            }),
            I = null;
          for (let Y = 0, J = G.length; Y < J; Y++) {
            let W = G[Y];
            if (W.resource.asyncAttributesPending && W.resource.waitForAsyncAttributes) I ??= [], I.push(W.resource.waitForAsyncAttributes())
          }
          if (I === null) Z();
          else Promise.all(I).then(Z, (Y) => {
            (0, Dy.globalErrorHandler)(Y), Q(Y)
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
          this._isExporting = !1, (0, Dy.globalErrorHandler)(Q)
        })
      };
      if (this._finishedSpans.length >= this._maxExportBatchSize) return A();
      if (this._timer !== void 0) return;
      this._timer = setTimeout(() => A(), this._scheduledDelayMillis), (0, Dy.unrefTimer)(this._timer)
    }
    _clearTimer() {
      if (this._timer !== void 0) clearTimeout(this._timer), this._timer = void 0
    }
  }
  NL2.BatchSpanProcessorBase = qL2
})
// @from(Start 11161753, End 11161997)
PL2 = z((RL2) => {
  Object.defineProperty(RL2, "__esModule", {
    value: !0
  });
  RL2.BatchSpanProcessor = void 0;
  var nx5 = ML2();
  class OL2 extends nx5.BatchSpanProcessorBase {
    onShutdown() {}
  }
  RL2.BatchSpanProcessor = OL2
})
// @from(Start 11162003, End 11162603)
xL2 = z((kL2) => {
  Object.defineProperty(kL2, "__esModule", {
    value: !0
  });
  kL2.RandomIdGenerator = void 0;
  var ax5 = 8,
    SL2 = 16;
  class _L2 {
    generateTraceId = jL2(SL2);
    generateSpanId = jL2(ax5)
  }
  kL2.RandomIdGenerator = _L2;
  var B61 = Buffer.allocUnsafe(SL2);

  function jL2(A) {
    return function() {
      for (let B = 0; B < A / 4; B++) B61.writeUInt32BE(Math.random() * 4294967296 >>> 0, B * 4);
      for (let B = 0; B < A; B++)
        if (B61[B] > 0) break;
        else if (B === A - 1) B61[A - 1] = 1;
      return B61.toString("hex", 0, A)
    }
  }
})
// @from(Start 11162609, End 11163075)
vL2 = z((G61) => {
  Object.defineProperty(G61, "__esModule", {
    value: !0
  });
  G61.RandomIdGenerator = G61.BatchSpanProcessor = void 0;
  var sx5 = PL2();
  Object.defineProperty(G61, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return sx5.BatchSpanProcessor
    }
  });
  var rx5 = xL2();
  Object.defineProperty(G61, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return rx5.RandomIdGenerator
    }
  })
})
// @from(Start 11163081, End 11163528)
r40 = z((Z61) => {
  Object.defineProperty(Z61, "__esModule", {
    value: !0
  });
  Z61.RandomIdGenerator = Z61.BatchSpanProcessor = void 0;
  var bL2 = vL2();
  Object.defineProperty(Z61, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return bL2.BatchSpanProcessor
    }
  });
  Object.defineProperty(Z61, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return bL2.RandomIdGenerator
    }
  })
})
// @from(Start 11163534, End 11166496)
uL2 = z((hL2) => {
  Object.defineProperty(hL2, "__esModule", {
    value: !0
  });
  hL2.Tracer = void 0;
  var cD = K9(),
    I61 = e6(),
    ex5 = aN2(),
    Av5 = s40(),
    Qv5 = r40();
  class fL2 {
    _sampler;
    _generalLimits;
    _spanLimits;
    _idGenerator;
    instrumentationScope;
    _resource;
    _spanProcessor;
    constructor(A, Q, B, G) {
      let Z = (0, Av5.mergeConfig)(Q);
      this._sampler = Z.sampler, this._generalLimits = Z.generalLimits, this._spanLimits = Z.spanLimits, this._idGenerator = Q.idGenerator || new Qv5.RandomIdGenerator, this._resource = B, this._spanProcessor = G, this.instrumentationScope = A
    }
    startSpan(A, Q = {}, B = cD.context.active()) {
      if (Q.root) B = cD.trace.deleteSpan(B);
      let G = cD.trace.getSpan(B);
      if ((0, I61.isTracingSuppressed)(B)) return cD.diag.debug("Instrumentation suppressed, returning Noop Span"), cD.trace.wrapSpanContext(cD.INVALID_SPAN_CONTEXT);
      let Z = G?.spanContext(),
        I = this._idGenerator.generateSpanId(),
        Y, J, W;
      if (!Z || !cD.trace.isSpanContextValid(Z)) J = this._idGenerator.generateTraceId();
      else J = Z.traceId, W = Z.traceState, Y = Z;
      let X = Q.kind ?? cD.SpanKind.INTERNAL,
        V = (Q.links ?? []).map((U) => {
          return {
            context: U.context,
            attributes: (0, I61.sanitizeAttributes)(U.attributes)
          }
        }),
        F = (0, I61.sanitizeAttributes)(Q.attributes),
        K = this._sampler.shouldSample(B, J, A, X, F, V);
      W = K.traceState ?? W;
      let D = K.decision === cD.SamplingDecision.RECORD_AND_SAMPLED ? cD.TraceFlags.SAMPLED : cD.TraceFlags.NONE,
        H = {
          traceId: J,
          spanId: I,
          traceFlags: D,
          traceState: W
        };
      if (K.decision === cD.SamplingDecision.NOT_RECORD) return cD.diag.debug("Recording is off, propagating context in a non-recording span"), cD.trace.wrapSpanContext(H);
      let C = (0, I61.sanitizeAttributes)(Object.assign(F, K.attributes));
      return new ex5.SpanImpl({
        resource: this._resource,
        scope: this.instrumentationScope,
        context: B,
        spanContext: H,
        name: A,
        kind: X,
        links: V,
        parentSpanContext: Y,
        attributes: C,
        startTime: Q.startTime,
        spanProcessor: this._spanProcessor,
        spanLimits: this._spanLimits
      })
    }
    startActiveSpan(A, Q, B, G) {
      let Z, I, Y;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) Y = Q;
      else if (arguments.length === 3) Z = Q, Y = B;
      else Z = Q, I = B, Y = G;
      let J = I ?? cD.context.active(),
        W = this.startSpan(A, Z, J),
        X = cD.trace.setSpan(J, W);
      return cD.context.with(X, Y, void 0, W)
    }
    getGeneralLimits() {
      return this._generalLimits
    }
    getSpanLimits() {
      return this._spanLimits
    }
  }
  hL2.Tracer = fL2
})
// @from(Start 11166502, End 11167477)
pL2 = z((dL2) => {
  Object.defineProperty(dL2, "__esModule", {
    value: !0
  });
  dL2.MultiSpanProcessor = void 0;
  var Bv5 = e6();
  class mL2 {
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
          (0, Bv5.globalErrorHandler)(B || Error("MultiSpanProcessor: forceFlush failed")), Q()
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
  dL2.MultiSpanProcessor = mL2
})
// @from(Start 11167483, End 11169704)
sL2 = z((nL2) => {
  Object.defineProperty(nL2, "__esModule", {
    value: !0
  });
  nL2.BasicTracerProvider = nL2.ForceFlushState = void 0;
  var Gv5 = e6(),
    Zv5 = t3A(),
    Iv5 = uL2(),
    Yv5 = a40(),
    Jv5 = pL2(),
    Wv5 = s40(),
    SJA;
  (function(A) {
    A[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved"
  })(SJA = nL2.ForceFlushState || (nL2.ForceFlushState = {}));
  class iL2 {
    _config;
    _tracers = new Map;
    _resource;
    _activeSpanProcessor;
    constructor(A = {}) {
      let Q = (0, Gv5.merge)({}, (0, Yv5.loadDefaultConfig)(), (0, Wv5.reconfigureLimits)(A));
      this._resource = Q.resource ?? (0, Zv5.defaultResource)(), this._config = Object.assign({}, Q, {
        resource: this._resource
      });
      let B = [];
      if (A.spanProcessors?.length) B.push(...A.spanProcessors);
      this._activeSpanProcessor = new Jv5.MultiSpanProcessor(B)
    }
    getTracer(A, Q, B) {
      let G = `${A}@${Q||""}:${B?.schemaUrl||""}`;
      if (!this._tracers.has(G)) this._tracers.set(G, new Iv5.Tracer({
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
            let Z, I = setTimeout(() => {
              G(Error(`Span processor did not completed within timeout period of ${A} ms`)), Z = SJA.timeout
            }, A);
            B.forceFlush().then(() => {
              if (clearTimeout(I), Z !== SJA.timeout) Z = SJA.resolved, G(Z)
            }).catch((Y) => {
              clearTimeout(I), Z = SJA.error, G(Y)
            })
          })
        });
      return new Promise((B, G) => {
        Promise.all(Q).then((Z) => {
          let I = Z.filter((Y) => Y !== SJA.resolved);
          if (I.length > 0) G(I);
          else B()
        }).catch((Z) => G([Z]))
      })
    }
    shutdown() {
      return this._activeSpanProcessor.shutdown()
    }
  }
  nL2.BasicTracerProvider = iL2
})
// @from(Start 11169710, End 11170925)
eL2 = z((oL2) => {
  Object.defineProperty(oL2, "__esModule", {
    value: !0
  });
  oL2.ConsoleSpanExporter = void 0;
  var o40 = e6();
  class rL2 {
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
        timestamp: (0, o40.hrTimeToMicroseconds)(A.startTime),
        duration: (0, o40.hrTimeToMicroseconds)(A.duration),
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
        code: o40.ExportResultCode.SUCCESS
      })
    }
  }
  oL2.ConsoleSpanExporter = rL2
})
// @from(Start 11170931, End 11171718)
ZM2 = z((BM2) => {
  Object.defineProperty(BM2, "__esModule", {
    value: !0
  });
  BM2.InMemorySpanExporter = void 0;
  var AM2 = e6();
  class QM2 {
    _finishedSpans = [];
    _stopped = !1;
    export (A, Q) {
      if (this._stopped) return Q({
        code: AM2.ExportResultCode.FAILED,
        error: Error("Exporter has been stopped")
      });
      this._finishedSpans.push(...A), setTimeout(() => Q({
        code: AM2.ExportResultCode.SUCCESS
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
  BM2.InMemorySpanExporter = QM2
})
// @from(Start 11171724, End 11173060)
WM2 = z((YM2) => {
  Object.defineProperty(YM2, "__esModule", {
    value: !0
  });
  YM2.SimpleSpanProcessor = void 0;
  var Xv5 = K9(),
    Y61 = e6();
  class IM2 {
    _exporter;
    _shutdownOnce;
    _pendingExports;
    constructor(A) {
      this._exporter = A, this._shutdownOnce = new Y61.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
    }
    async forceFlush() {
      if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & Xv5.TraceFlags.SAMPLED) === 0) return;
      let Q = this._doExport(A).catch((B) => (0, Y61.globalErrorHandler)(B));
      this._pendingExports.add(Q), Q.finally(() => this._pendingExports.delete(Q))
    }
    async _doExport(A) {
      if (A.resource.asyncAttributesPending) await A.resource.waitForAsyncAttributes?.();
      let Q = await Y61.internal._export(this._exporter, [A]);
      if (Q.code !== Y61.ExportResultCode.SUCCESS) throw Q.error ?? Error(`SimpleSpanProcessor: span export failed (status ${Q})`)
    }
    shutdown() {
      return this._shutdownOnce.call()
    }
    _shutdown() {
      return this._exporter.shutdown()
    }
  }
  YM2.SimpleSpanProcessor = IM2
})
// @from(Start 11173066, End 11173381)
KM2 = z((VM2) => {
  Object.defineProperty(VM2, "__esModule", {
    value: !0
  });
  VM2.NoopSpanProcessor = void 0;
  class XM2 {
    onStart(A, Q) {}
    onEnd(A) {}
    shutdown() {
      return Promise.resolve()
    }
    forceFlush() {
      return Promise.resolve()
    }
  }
  VM2.NoopSpanProcessor = XM2
})
// @from(Start 11173387, End 11175687)
HM2 = z((B$) => {
  Object.defineProperty(B$, "__esModule", {
    value: !0
  });
  B$.SamplingDecision = B$.TraceIdRatioBasedSampler = B$.ParentBasedSampler = B$.AlwaysOnSampler = B$.AlwaysOffSampler = B$.NoopSpanProcessor = B$.SimpleSpanProcessor = B$.InMemorySpanExporter = B$.ConsoleSpanExporter = B$.RandomIdGenerator = B$.BatchSpanProcessor = B$.BasicTracerProvider = void 0;
  var Vv5 = sL2();
  Object.defineProperty(B$, "BasicTracerProvider", {
    enumerable: !0,
    get: function() {
      return Vv5.BasicTracerProvider
    }
  });
  var DM2 = r40();
  Object.defineProperty(B$, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return DM2.BatchSpanProcessor
    }
  });
  Object.defineProperty(B$, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return DM2.RandomIdGenerator
    }
  });
  var Fv5 = eL2();
  Object.defineProperty(B$, "ConsoleSpanExporter", {
    enumerable: !0,
    get: function() {
      return Fv5.ConsoleSpanExporter
    }
  });
  var Kv5 = ZM2();
  Object.defineProperty(B$, "InMemorySpanExporter", {
    enumerable: !0,
    get: function() {
      return Kv5.InMemorySpanExporter
    }
  });
  var Dv5 = WM2();
  Object.defineProperty(B$, "SimpleSpanProcessor", {
    enumerable: !0,
    get: function() {
      return Dv5.SimpleSpanProcessor
    }
  });
  var Hv5 = KM2();
  Object.defineProperty(B$, "NoopSpanProcessor", {
    enumerable: !0,
    get: function() {
      return Hv5.NoopSpanProcessor
    }
  });
  var Cv5 = r81();
  Object.defineProperty(B$, "AlwaysOffSampler", {
    enumerable: !0,
    get: function() {
      return Cv5.AlwaysOffSampler
    }
  });
  var Ev5 = o81();
  Object.defineProperty(B$, "AlwaysOnSampler", {
    enumerable: !0,
    get: function() {
      return Ev5.AlwaysOnSampler
    }
  });
  var zv5 = p40();
  Object.defineProperty(B$, "ParentBasedSampler", {
    enumerable: !0,
    get: function() {
      return zv5.ParentBasedSampler
    }
  });
  var Uv5 = l40();
  Object.defineProperty(B$, "TraceIdRatioBasedSampler", {
    enumerable: !0,
    get: function() {
      return Uv5.TraceIdRatioBasedSampler
    }
  });
  var $v5 = WRA();
  Object.defineProperty(B$, "SamplingDecision", {
    enumerable: !0,
    get: function() {
      return $v5.SamplingDecision
    }
  })
})
// @from(Start 11175693, End 11175829)
zM2 = z((CM2) => {
  Object.defineProperty(CM2, "__esModule", {
    value: !0
  });
  CM2.VERSION = void 0;
  CM2.VERSION = "0.204.0"
})
// @from(Start 11175835, End 11176402)
NM2 = z((wM2) => {
  Object.defineProperty(wM2, "__esModule", {
    value: !0
  });
  wM2.OTLPTraceExporter = void 0;
  var qv5 = sk(),
    Nv5 = tk(),
    Lv5 = zM2(),
    UM2 = mi();
  class $M2 extends qv5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, UM2.createOtlpHttpExportDelegate)((0, UM2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Lv5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Nv5.ProtobufTraceSerializer))
    }
  }
  wM2.OTLPTraceExporter = $M2
})
// @from(Start 11176408, End 11176687)
LM2 = z((t40) => {
  Object.defineProperty(t40, "__esModule", {
    value: !0
  });
  t40.OTLPTraceExporter = void 0;
  var Mv5 = NM2();
  Object.defineProperty(t40, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Mv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11176693, End 11176972)
MM2 = z((e40) => {
  Object.defineProperty(e40, "__esModule", {
    value: !0
  });
  e40.OTLPTraceExporter = void 0;
  var Rv5 = LM2();
  Object.defineProperty(e40, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Rv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11176978, End 11177257)
OM2 = z((A80) => {
  Object.defineProperty(A80, "__esModule", {
    value: !0
  });
  A80.OTLPTraceExporter = void 0;
  var Pv5 = MM2();
  Object.defineProperty(A80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Pv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11177263, End 11177760)
SM2 = z((PM2) => {
  Object.defineProperty(PM2, "__esModule", {
    value: !0
  });
  PM2.OTLPTraceExporter = void 0;
  var RM2 = i81(),
    Sv5 = tk(),
    _v5 = sk();
  class TM2 extends _v5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, RM2.createOtlpGrpcExportDelegate)((0, RM2.convertLegacyOtlpGrpcOptions)(A, "TRACES"), Sv5.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
    }
  }
  PM2.OTLPTraceExporter = TM2
})
// @from(Start 11177766, End 11178045)
_M2 = z((Q80) => {
  Object.defineProperty(Q80, "__esModule", {
    value: !0
  });
  Q80.OTLPTraceExporter = void 0;
  var kv5 = SM2();
  Object.defineProperty(Q80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return kv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11178051, End 11178187)
xM2 = z((kM2) => {
  Object.defineProperty(kM2, "__esModule", {
    value: !0
  });
  kM2.VERSION = void 0;
  kM2.VERSION = "0.204.0"
})
// @from(Start 11178193, End 11178750)
gM2 = z((fM2) => {
  Object.defineProperty(fM2, "__esModule", {
    value: !0
  });
  fM2.OTLPTraceExporter = void 0;
  var xv5 = sk(),
    vv5 = xM2(),
    bv5 = tk(),
    vM2 = mi();
  class bM2 extends xv5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, vM2.createOtlpHttpExportDelegate)((0, vM2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${vv5.VERSION}`,
        "Content-Type": "application/json"
      }), bv5.JsonTraceSerializer))
    }
  }
  fM2.OTLPTraceExporter = bM2
})
// @from(Start 11178756, End 11179035)
uM2 = z((B80) => {
  Object.defineProperty(B80, "__esModule", {
    value: !0
  });
  B80.OTLPTraceExporter = void 0;
  var fv5 = gM2();
  Object.defineProperty(B80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return fv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179041, End 11179320)
mM2 = z((G80) => {
  Object.defineProperty(G80, "__esModule", {
    value: !0
  });
  G80.OTLPTraceExporter = void 0;
  var gv5 = uM2();
  Object.defineProperty(G80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return gv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179326, End 11179605)
dM2 = z((Z80) => {
  Object.defineProperty(Z80, "__esModule", {
    value: !0
  });
  Z80.OTLPTraceExporter = void 0;
  var mv5 = mM2();
  Object.defineProperty(Z80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return mv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179607, End 11179802)
class I80 {
  error(A, ...Q) {
    AA(Error(A))
  }
  warn(A, ...Q) {
    AA(Error(A))
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
// @from(Start 11179807, End 11179832)
cM2 = L(() => {
  g1()
})
// @from(Start 11179834, End 11180718)
async function pv5() {
  let A = DI();
  if (A.error) throw g(`Metrics opt-out check failed: ${A.error}`), Error(`Auth error: ${A.error}`);
  let Q = {
    "Content-Type": "application/json",
    "User-Agent": TV(),
    ...A.headers
  };
  try {
    let G = await YQ.get("https://api.anthropic.com/api/claude_code/organizations/metrics_enabled", {
      headers: Q,
      timeout: 5000
    });
    return g(`Metrics opt-out API response: enabled=${G.data.metrics_logging_enabled}, vcsLinking=${G.data.vcs_account_linking_enabled}`), {
      enabled: G.data.metrics_logging_enabled,
      vcsAccountLinkingEnabled: G.data.vcs_account_linking_enabled,
      hasError: !1
    }
  } catch (B) {
    return g(`Failed to check metrics opt-out status: ${B instanceof Error?B.message:String(B)}`), AA(B), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Start 11180719, End 11180938)
async function J61() {
  try {
    return await lv5()
  } catch (A) {
    return g("Metrics check failed, defaulting to disabled"), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Start 11180943, End 11180956)
cv5 = 3600000
// @from(Start 11180960, End 11180963)
lv5
// @from(Start 11180969, End 11181050)
Y80 = L(() => {
  O3();
  hbA();
  AE();
  V0();
  g1();
  lv5 = fbA(pv5, cv5)
})