
// @from(Start 12572690, End 12579780)
JG1 = z((Fn2) => {
  Object.defineProperty(Fn2, "__esModule", {
    value: !0
  });
  var r0A = i0(),
    Wn2 = ZV(),
    wG3 = UPA(),
    Hg = $PA(),
    Xn2 = XXA(),
    HXA = E$(),
    qG3 = KXA();
  class Vn2 {
    constructor(A = 1000) {
      this._maxlen = A, this.spans = []
    }
    add(A) {
      if (this.spans.length > this._maxlen) A.spanRecorder = void 0;
      else this.spans.push(A)
    }
  }
  class cI0 {
    constructor(A = {}) {
      if (this._traceId = A.traceId || r0A.uuid4(), this._spanId = A.spanId || r0A.uuid4().substring(16), this._startTime = A.startTimestamp || r0A.timestampInSeconds(), this.tags = A.tags ? {
          ...A.tags
        } : {}, this.data = A.data ? {
          ...A.data
        } : {}, this.instrumenter = A.instrumenter || "sentry", this._attributes = {}, this.setAttributes({
          [Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: A.origin || "manual",
          [Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP]: A.op,
          ...A.attributes
        }), this._name = A.name || A.description, A.parentSpanId) this._parentSpanId = A.parentSpanId;
      if ("sampled" in A) this._sampled = A.sampled;
      if (A.status) this._status = A.status;
      if (A.endTimestamp) this._endTime = A.endTimestamp;
      if (A.exclusiveTime !== void 0) this._exclusiveTime = A.exclusiveTime;
      this._measurements = A.measurements ? {
        ...A.measurements
      } : {}
    }
    get name() {
      return this._name || ""
    }
    set name(A) {
      this.updateName(A)
    }
    get description() {
      return this._name
    }
    set description(A) {
      this._name = A
    }
    get traceId() {
      return this._traceId
    }
    set traceId(A) {
      this._traceId = A
    }
    get spanId() {
      return this._spanId
    }
    set spanId(A) {
      this._spanId = A
    }
    set parentSpanId(A) {
      this._parentSpanId = A
    }
    get parentSpanId() {
      return this._parentSpanId
    }
    get sampled() {
      return this._sampled
    }
    set sampled(A) {
      this._sampled = A
    }
    get attributes() {
      return this._attributes
    }
    set attributes(A) {
      this._attributes = A
    }
    get startTimestamp() {
      return this._startTime
    }
    set startTimestamp(A) {
      this._startTime = A
    }
    get endTimestamp() {
      return this._endTime
    }
    set endTimestamp(A) {
      this._endTime = A
    }
    get status() {
      return this._status
    }
    set status(A) {
      this._status = A
    }
    get op() {
      return this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP]
    }
    set op(A) {
      this.setAttribute(Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP, A)
    }
    get origin() {
      return this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]
    }
    set origin(A) {
      this.setAttribute(Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, A)
    }
    spanContext() {
      let {
        _spanId: A,
        _traceId: Q,
        _sampled: B
      } = this;
      return {
        spanId: A,
        traceId: Q,
        traceFlags: B ? HXA.TRACE_FLAG_SAMPLED : HXA.TRACE_FLAG_NONE
      }
    }
    startChild(A) {
      let Q = new cI0({
        ...A,
        parentSpanId: this._spanId,
        sampled: this._sampled,
        traceId: this._traceId
      });
      if (Q.spanRecorder = this.spanRecorder, Q.spanRecorder) Q.spanRecorder.add(Q);
      let B = Xn2.getRootSpan(this);
      if (Q.transaction = B, Wn2.DEBUG_BUILD && B) {
        let G = A && A.op || "< unknown op >",
          Z = HXA.spanToJSON(Q).description || "< unknown name >",
          I = B.spanContext().spanId,
          Y = `[Tracing] Starting '${G}' span on transaction '${Z}' (${I}).`;
        r0A.logger.log(Y), this._logMessage = Y
      }
      return Q
    }
    setTag(A, Q) {
      return this.tags = {
        ...this.tags,
        [A]: Q
      }, this
    }
    setData(A, Q) {
      return this.data = {
        ...this.data,
        [A]: Q
      }, this
    }
    setAttribute(A, Q) {
      if (Q === void 0) delete this._attributes[A];
      else this._attributes[A] = Q
    }
    setAttributes(A) {
      Object.keys(A).forEach((Q) => this.setAttribute(Q, A[Q]))
    }
    setStatus(A) {
      return this._status = A, this
    }
    setHttpStatus(A) {
      return qG3.setHttpStatus(this, A), this
    }
    setName(A) {
      this.updateName(A)
    }
    updateName(A) {
      return this._name = A, this
    }
    isSuccess() {
      return this._status === "ok"
    }
    finish(A) {
      return this.end(A)
    }
    end(A) {
      if (this._endTime) return;
      let Q = Xn2.getRootSpan(this);
      if (Wn2.DEBUG_BUILD && Q && Q.spanContext().spanId !== this._spanId) {
        let B = this._logMessage;
        if (B) r0A.logger.log(B.replace("Starting", "Finishing"))
      }
      this._endTime = HXA.spanTimeInputToSeconds(A)
    }
    toTraceparent() {
      return HXA.spanToTraceHeader(this)
    }
    toContext() {
      return r0A.dropUndefinedKeys({
        data: this._getData(),
        description: this._name,
        endTimestamp: this._endTime,
        op: this.op,
        parentSpanId: this._parentSpanId,
        sampled: this._sampled,
        spanId: this._spanId,
        startTimestamp: this._startTime,
        status: this._status,
        tags: this.tags,
        traceId: this._traceId
      })
    }
    updateWithContext(A) {
      return this.data = A.data || {}, this._name = A.name || A.description, this._endTime = A.endTimestamp, this.op = A.op, this._parentSpanId = A.parentSpanId, this._sampled = A.sampled, this._spanId = A.spanId || this._spanId, this._startTime = A.startTimestamp || this._startTime, this._status = A.status, this.tags = A.tags || {}, this._traceId = A.traceId || this._traceId, this
    }
    getTraceContext() {
      return HXA.spanToTraceContext(this)
    }
    getSpanJSON() {
      return r0A.dropUndefinedKeys({
        data: this._getData(),
        description: this._name,
        op: this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_OP],
        parent_span_id: this._parentSpanId,
        span_id: this._spanId,
        start_timestamp: this._startTime,
        status: this._status,
        tags: Object.keys(this.tags).length > 0 ? this.tags : void 0,
        timestamp: this._endTime,
        trace_id: this._traceId,
        origin: this._attributes[Hg.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
        _metrics_summary: wG3.getMetricSummaryJsonForSpan(this),
        profile_id: this._attributes[Hg.SEMANTIC_ATTRIBUTE_PROFILE_ID],
        exclusive_time: this._exclusiveTime,
        measurements: Object.keys(this._measurements).length > 0 ? this._measurements : void 0
      })
    }
    isRecording() {
      return !this._endTime && !!this._sampled
    }
    toJSON() {
      return this.getSpanJSON()
    }
    _getData() {
      let {
        data: A,
        _attributes: Q
      } = this, B = Object.keys(A).length > 0, G = Object.keys(Q).length > 0;
      if (!B && !G) return;
      if (B && G) return {
        ...A,
        ...Q
      };
      return B ? A : Q
    }
  }
  Fn2.Span = cI0;
  Fn2.SpanRecorder = Vn2
})
// @from(Start 12579786, End 12584636)
VG1 = z((Cn2) => {
  Object.defineProperty(Cn2, "__esModule", {
    value: !0
  });
  var CXA = i0(),
    WG1 = ZV(),
    MG3 = py(),
    OG3 = UPA(),
    wPA = $PA(),
    XG1 = E$(),
    Kn2 = a0A(),
    Dn2 = JG1(),
    RG3 = YG1();
  class Hn2 extends Dn2.Span {
    constructor(A, Q) {
      super(A);
      this._contexts = {}, this._hub = Q || MG3.getCurrentHub(), this._name = A.name || "", this._metadata = {
        ...A.metadata
      }, this._trimEnd = A.trimEnd, this.transaction = this;
      let B = this._metadata.dynamicSamplingContext;
      if (B) this._frozenDynamicSamplingContext = {
        ...B
      }
    }
    get name() {
      return this._name
    }
    set name(A) {
      this.setName(A)
    }
    get metadata() {
      return {
        source: "custom",
        spanMetadata: {},
        ...this._metadata,
        ...this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] && {
          source: this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]
        },
        ...this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] && {
          sampleRate: this._attributes[wPA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]
        }
      }
    }
    set metadata(A) {
      this._metadata = A
    }
    setName(A, Q = "custom") {
      this._name = A, this.setAttribute(wPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, Q)
    }
    updateName(A) {
      return this._name = A, this
    }
    initSpanRecorder(A = 1000) {
      if (!this.spanRecorder) this.spanRecorder = new Dn2.SpanRecorder(A);
      this.spanRecorder.add(this)
    }
    setContext(A, Q) {
      if (Q === null) delete this._contexts[A];
      else this._contexts[A] = Q
    }
    setMeasurement(A, Q, B = "") {
      this._measurements[A] = {
        value: Q,
        unit: B
      }
    }
    setMetadata(A) {
      this._metadata = {
        ...this._metadata,
        ...A
      }
    }
    end(A) {
      let Q = XG1.spanTimeInputToSeconds(A),
        B = this._finishTransaction(Q);
      if (!B) return;
      return this._hub.captureEvent(B)
    }
    toContext() {
      let A = super.toContext();
      return CXA.dropUndefinedKeys({
        ...A,
        name: this._name,
        trimEnd: this._trimEnd
      })
    }
    updateWithContext(A) {
      return super.updateWithContext(A), this._name = A.name || "", this._trimEnd = A.trimEnd, this
    }
    getDynamicSamplingContext() {
      return Kn2.getDynamicSamplingContextFromSpan(this)
    }
    setHub(A) {
      this._hub = A
    }
    getProfileId() {
      if (this._contexts !== void 0 && this._contexts.profile !== void 0) return this._contexts.profile.profile_id;
      return
    }
    _finishTransaction(A) {
      if (this._endTime !== void 0) return;
      if (!this._name) WG1.DEBUG_BUILD && CXA.logger.warn("Transaction has no name, falling back to `<unlabeled transaction>`."), this._name = "<unlabeled transaction>";
      super.end(A);
      let Q = this._hub.getClient();
      if (Q && Q.emit) Q.emit("finishTransaction", this);
      if (this._sampled !== !0) {
        if (WG1.DEBUG_BUILD && CXA.logger.log("[Tracing] Discarding transaction because its trace was not chosen to be sampled."), Q) Q.recordDroppedEvent("sample_rate", "transaction");
        return
      }
      let B = this.spanRecorder ? this.spanRecorder.spans.filter((X) => X !== this && XG1.spanToJSON(X).timestamp) : [];
      if (this._trimEnd && B.length > 0) {
        let X = B.map((V) => XG1.spanToJSON(V).timestamp).filter(Boolean);
        this._endTime = X.reduce((V, F) => {
          return V > F ? V : F
        })
      }
      let {
        scope: G,
        isolationScope: Z
      } = RG3.getCapturedScopesOnSpan(this), {
        metadata: I
      } = this, {
        source: Y
      } = I, J = {
        contexts: {
          ...this._contexts,
          trace: XG1.spanToTraceContext(this)
        },
        spans: B,
        start_timestamp: this._startTime,
        tags: this.tags,
        timestamp: this._endTime,
        transaction: this._name,
        type: "transaction",
        sdkProcessingMetadata: {
          ...I,
          capturedSpanScope: G,
          capturedSpanIsolationScope: Z,
          ...CXA.dropUndefinedKeys({
            dynamicSamplingContext: Kn2.getDynamicSamplingContextFromSpan(this)
          })
        },
        _metrics_summary: OG3.getMetricSummaryJsonForSpan(this),
        ...Y && {
          transaction_info: {
            source: Y
          }
        }
      };
      if (Object.keys(this._measurements).length > 0) WG1.DEBUG_BUILD && CXA.logger.log("[Measurements] Adding measurements to transaction", JSON.stringify(this._measurements, void 0, 2)), J.measurements = this._measurements;
      return WG1.DEBUG_BUILD && CXA.logger.log(`[Tracing] Finishing ${this.op} transaction: ${this._name}.`), J
    }
  }
  Cn2.Transaction = Hn2
})
// @from(Start 12584642, End 12591313)
lI0 = z((zn2) => {
  Object.defineProperty(zn2, "__esModule", {
    value: !0
  });
  var UC = i0(),
    z$ = ZV(),
    FG1 = E$(),
    PG3 = JG1(),
    jG3 = VG1(),
    KG1 = {
      idleTimeout: 1000,
      finalTimeout: 30000,
      heartbeatInterval: 5000
    },
    SG3 = "finishReason",
    EXA = ["heartbeatFailed", "idleTimeout", "documentHidden", "finalTimeout", "externalFinish", "cancelled"];
  class pI0 extends PG3.SpanRecorder {
    constructor(A, Q, B, G) {
      super(G);
      this._pushActivity = A, this._popActivity = Q, this.transactionSpanId = B
    }
    add(A) {
      if (A.spanContext().spanId !== this.transactionSpanId) {
        let Q = A.end;
        if (A.end = (...B) => {
            return this._popActivity(A.spanContext().spanId), Q.apply(A, B)
          }, FG1.spanToJSON(A).timestamp === void 0) this._pushActivity(A.spanContext().spanId)
      }
      super.add(A)
    }
  }
  class En2 extends jG3.Transaction {
    constructor(A, Q, B = KG1.idleTimeout, G = KG1.finalTimeout, Z = KG1.heartbeatInterval, I = !1, Y = !1) {
      super(A, Q);
      if (this._idleHub = Q, this._idleTimeout = B, this._finalTimeout = G, this._heartbeatInterval = Z, this._onScope = I, this.activities = {}, this._heartbeatCounter = 0, this._finished = !1, this._idleTimeoutCanceledPermanently = !1, this._beforeFinishCallbacks = [], this._finishReason = EXA[4], this._autoFinishAllowed = !Y, I) z$.DEBUG_BUILD && UC.logger.log(`Setting idle transaction on scope. Span ID: ${this.spanContext().spanId}`), Q.getScope().setSpan(this);
      if (!Y) this._restartIdleTimeout();
      setTimeout(() => {
        if (!this._finished) this.setStatus("deadline_exceeded"), this._finishReason = EXA[3], this.end()
      }, this._finalTimeout)
    }
    end(A) {
      let Q = FG1.spanTimeInputToSeconds(A);
      if (this._finished = !0, this.activities = {}, this.op === "ui.action.click") this.setAttribute(SG3, this._finishReason);
      if (this.spanRecorder) {
        z$.DEBUG_BUILD && UC.logger.log("[Tracing] finishing IdleTransaction", new Date(Q * 1000).toISOString(), this.op);
        for (let B of this._beforeFinishCallbacks) B(this, Q);
        this.spanRecorder.spans = this.spanRecorder.spans.filter((B) => {
          if (B.spanContext().spanId === this.spanContext().spanId) return !0;
          if (!FG1.spanToJSON(B).timestamp) B.setStatus("cancelled"), B.end(Q), z$.DEBUG_BUILD && UC.logger.log("[Tracing] cancelling span since transaction ended early", JSON.stringify(B, void 0, 2));
          let {
            start_timestamp: G,
            timestamp: Z
          } = FG1.spanToJSON(B), I = G && G < Q, Y = (this._finalTimeout + this._idleTimeout) / 1000, J = Z && G && Z - G < Y;
          if (z$.DEBUG_BUILD) {
            let W = JSON.stringify(B, void 0, 2);
            if (!I) UC.logger.log("[Tracing] discarding Span since it happened after Transaction was finished", W);
            else if (!J) UC.logger.log("[Tracing] discarding Span since it finished after Transaction final timeout", W)
          }
          return I && J
        }), z$.DEBUG_BUILD && UC.logger.log("[Tracing] flushing IdleTransaction")
      } else z$.DEBUG_BUILD && UC.logger.log("[Tracing] No active IdleTransaction");
      if (this._onScope) {
        let B = this._idleHub.getScope();
        if (B.getTransaction() === this) B.setSpan(void 0)
      }
      return super.end(A)
    }
    registerBeforeFinishCallback(A) {
      this._beforeFinishCallbacks.push(A)
    }
    initSpanRecorder(A) {
      if (!this.spanRecorder) {
        let Q = (G) => {
            if (this._finished) return;
            this._pushActivity(G)
          },
          B = (G) => {
            if (this._finished) return;
            this._popActivity(G)
          };
        this.spanRecorder = new pI0(Q, B, this.spanContext().spanId, A), z$.DEBUG_BUILD && UC.logger.log("Starting heartbeat"), this._pingHeartbeat()
      }
      this.spanRecorder.add(this)
    }
    cancelIdleTimeout(A, {
      restartOnChildSpanChange: Q
    } = {
      restartOnChildSpanChange: !0
    }) {
      if (this._idleTimeoutCanceledPermanently = Q === !1, this._idleTimeoutID) {
        if (clearTimeout(this._idleTimeoutID), this._idleTimeoutID = void 0, Object.keys(this.activities).length === 0 && this._idleTimeoutCanceledPermanently) this._finishReason = EXA[5], this.end(A)
      }
    }
    setFinishReason(A) {
      this._finishReason = A
    }
    sendAutoFinishSignal() {
      if (!this._autoFinishAllowed) z$.DEBUG_BUILD && UC.logger.log("[Tracing] Received finish signal for idle transaction."), this._restartIdleTimeout(), this._autoFinishAllowed = !0
    }
    _restartIdleTimeout(A) {
      this.cancelIdleTimeout(), this._idleTimeoutID = setTimeout(() => {
        if (!this._finished && Object.keys(this.activities).length === 0) this._finishReason = EXA[1], this.end(A)
      }, this._idleTimeout)
    }
    _pushActivity(A) {
      this.cancelIdleTimeout(void 0, {
        restartOnChildSpanChange: !this._idleTimeoutCanceledPermanently
      }), z$.DEBUG_BUILD && UC.logger.log(`[Tracing] pushActivity: ${A}`), this.activities[A] = !0, z$.DEBUG_BUILD && UC.logger.log("[Tracing] new activities count", Object.keys(this.activities).length)
    }
    _popActivity(A) {
      if (this.activities[A]) z$.DEBUG_BUILD && UC.logger.log(`[Tracing] popActivity ${A}`), delete this.activities[A], z$.DEBUG_BUILD && UC.logger.log("[Tracing] new activities count", Object.keys(this.activities).length);
      if (Object.keys(this.activities).length === 0) {
        let Q = UC.timestampInSeconds();
        if (this._idleTimeoutCanceledPermanently) {
          if (this._autoFinishAllowed) this._finishReason = EXA[5], this.end(Q)
        } else this._restartIdleTimeout(Q + this._idleTimeout / 1000)
      }
    }
    _beat() {
      if (this._finished) return;
      let A = Object.keys(this.activities).join("");
      if (A === this._prevHeartbeatString) this._heartbeatCounter++;
      else this._heartbeatCounter = 1;
      if (this._prevHeartbeatString = A, this._heartbeatCounter >= 3) {
        if (this._autoFinishAllowed) z$.DEBUG_BUILD && UC.logger.log("[Tracing] Transaction finished because of no change for 3 heart beats"), this.setStatus("deadline_exceeded"), this._finishReason = EXA[0], this.end()
      } else this._pingHeartbeat()
    }
    _pingHeartbeat() {
      z$.DEBUG_BUILD && UC.logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`), setTimeout(() => {
        this._beat()
      }, this._heartbeatInterval)
    }
  }
  zn2.IdleTransaction = En2;
  zn2.IdleTransactionSpanRecorder = pI0;
  zn2.TRACING_DEFAULTS = KG1
})
// @from(Start 12591319, End 12593430)
iI0 = z(($n2) => {
  Object.defineProperty($n2, "__esModule", {
    value: !0
  });
  var o0A = i0(),
    zXA = ZV(),
    DG1 = $PA(),
    xG3 = BG1(),
    vG3 = E$();

  function bG3(A, Q, B) {
    if (!xG3.hasTracingEnabled(Q)) return A.sampled = !1, A;
    if (A.sampled !== void 0) return A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(A.sampled)), A;
    let G;
    if (typeof Q.tracesSampler === "function") G = Q.tracesSampler(B), A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(G));
    else if (B.parentSampled !== void 0) G = B.parentSampled;
    else if (typeof Q.tracesSampleRate < "u") G = Q.tracesSampleRate, A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, Number(G));
    else G = 1, A.setAttribute(DG1.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, G);
    if (!Un2(G)) return zXA.DEBUG_BUILD && o0A.logger.warn("[Tracing] Discarding transaction because of invalid sample rate."), A.sampled = !1, A;
    if (!G) return zXA.DEBUG_BUILD && o0A.logger.log(`[Tracing] Discarding transaction because ${typeof Q.tracesSampler==="function"?"tracesSampler returned 0 or false":"a negative sampling decision was inherited or tracesSampleRate is set to 0"}`), A.sampled = !1, A;
    if (A.sampled = Math.random() < G, !A.sampled) return zXA.DEBUG_BUILD && o0A.logger.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(G)})`), A;
    return zXA.DEBUG_BUILD && o0A.logger.log(`[Tracing] starting ${A.op} transaction - ${vG3.spanToJSON(A).description}`), A
  }

  function Un2(A) {
    if (o0A.isNaN(A) || !(typeof A === "number" || typeof A === "boolean")) return zXA.DEBUG_BUILD && o0A.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(A)} of type ${JSON.stringify(typeof A)}.`), !1;
    if (A < 0 || A > 1) return zXA.DEBUG_BUILD && o0A.logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${A}.`), !1;
    return !0
  }
  $n2.isValidSampleRate = Un2;
  $n2.sampleTransaction = bG3
})
// @from(Start 12593436, End 12595667)
nI0 = z((qn2) => {
  Object.defineProperty(qn2, "__esModule", {
    value: !0
  });
  var gG3 = i0(),
    uG3 = ZV(),
    mG3 = py(),
    dG3 = E$(),
    cG3 = QG1(),
    pG3 = lI0(),
    wn2 = iI0(),
    lG3 = VG1();

  function iG3() {
    let Q = this.getScope().getSpan();
    return Q ? {
      "sentry-trace": dG3.spanToTraceHeader(Q)
    } : {}
  }

  function nG3(A, Q) {
    let B = this.getClient(),
      G = B && B.getOptions() || {},
      Z = G.instrumenter || "sentry",
      I = A.instrumenter || "sentry";
    if (Z !== I) uG3.DEBUG_BUILD && gG3.logger.error(`A transaction was started with instrumenter=\`${I}\`, but the SDK is configured with the \`${Z}\` instrumenter.
The transaction will not be sampled. Please use the ${Z} instrumentation to start transactions.`), A.sampled = !1;
    let Y = new lG3.Transaction(A, this);
    if (Y = wn2.sampleTransaction(Y, G, {
        name: A.name,
        parentSampled: A.parentSampled,
        transactionContext: A,
        attributes: {
          ...A.data,
          ...A.attributes
        },
        ...Q
      }), Y.isRecording()) Y.initSpanRecorder(G._experiments && G._experiments.maxSpans);
    if (B && B.emit) B.emit("startTransaction", Y);
    return Y
  }

  function aG3(A, Q, B, G, Z, I, Y, J = !1) {
    let W = A.getClient(),
      X = W && W.getOptions() || {},
      V = new pG3.IdleTransaction(Q, A, B, G, Y, Z, J);
    if (V = wn2.sampleTransaction(V, X, {
        name: Q.name,
        parentSampled: Q.parentSampled,
        transactionContext: Q,
        attributes: {
          ...Q.data,
          ...Q.attributes
        },
        ...I
      }), V.isRecording()) V.initSpanRecorder(X._experiments && X._experiments.maxSpans);
    if (W && W.emit) W.emit("startTransaction", V);
    return V
  }

  function sG3() {
    let A = mG3.getMainCarrier();
    if (!A.__SENTRY__) return;
    if (A.__SENTRY__.extensions = A.__SENTRY__.extensions || {}, !A.__SENTRY__.extensions.startTransaction) A.__SENTRY__.extensions.startTransaction = nG3;
    if (!A.__SENTRY__.extensions.traceHeaders) A.__SENTRY__.extensions.traceHeaders = iG3;
    cG3.registerErrorInstrumentation()
  }
  qn2.addTracingExtensions = sG3;
  qn2.startIdleTransaction = aG3
})
// @from(Start 12595673, End 12595913)
Ln2 = z((Nn2) => {
  Object.defineProperty(Nn2, "__esModule", {
    value: !0
  });
  var tG3 = AG1();

  function eG3(A, Q, B) {
    let G = tG3.getActiveTransaction();
    if (G) G.setMeasurement(A, Q, B)
  }
  Nn2.setMeasurement = eG3
})
// @from(Start 12595919, End 12597165)
aI0 = z((Mn2) => {
  Object.defineProperty(Mn2, "__esModule", {
    value: !0
  });
  var UXA = i0();

  function QZ3(A, Q) {
    if (!Q) return A;
    return A.sdk = A.sdk || {}, A.sdk.name = A.sdk.name || Q.name, A.sdk.version = A.sdk.version || Q.version, A.sdk.integrations = [...A.sdk.integrations || [], ...Q.integrations || []], A.sdk.packages = [...A.sdk.packages || [], ...Q.packages || []], A
  }

  function BZ3(A, Q, B, G) {
    let Z = UXA.getSdkMetadataForEnvelopeHeader(B),
      I = {
        sent_at: new Date().toISOString(),
        ...Z && {
          sdk: Z
        },
        ...!!G && Q && {
          dsn: UXA.dsnToString(Q)
        }
      },
      Y = "aggregates" in A ? [{
        type: "sessions"
      }, A] : [{
        type: "session"
      }, A.toJSON()];
    return UXA.createEnvelope(I, [Y])
  }

  function GZ3(A, Q, B, G) {
    let Z = UXA.getSdkMetadataForEnvelopeHeader(B),
      I = A.type && A.type !== "replay_event" ? A.type : "event";
    QZ3(A, B && B.sdk);
    let Y = UXA.createEventEnvelopeHeaders(A, Z, G, Q);
    delete A.sdkProcessingMetadata;
    let J = [{
      type: I
    }, A];
    return UXA.createEnvelope(Y, [J])
  }
  Mn2.createEventEnvelope = GZ3;
  Mn2.createSessionEnvelope = BZ3
})
// @from(Start 12597171, End 12598972)
sI0 = z((Rn2) => {
  Object.defineProperty(Rn2, "__esModule", {
    value: !0
  });
  var YZ3 = i0(),
    JZ3 = jO();
  class On2 {
    constructor(A, Q) {
      if (this._client = A, this.flushTimeout = 60, this._pendingAggregates = {}, this._isEnabled = !0, this._intervalId = setInterval(() => this.flush(), this.flushTimeout * 1000), this._intervalId.unref) this._intervalId.unref();
      this._sessionAttrs = Q
    }
    flush() {
      let A = this.getSessionAggregates();
      if (A.aggregates.length === 0) return;
      this._pendingAggregates = {}, this._client.sendSession(A)
    }
    getSessionAggregates() {
      let A = Object.keys(this._pendingAggregates).map((B) => {
          return this._pendingAggregates[parseInt(B)]
        }),
        Q = {
          attrs: this._sessionAttrs,
          aggregates: A
        };
      return YZ3.dropUndefinedKeys(Q)
    }
    close() {
      clearInterval(this._intervalId), this._isEnabled = !1, this.flush()
    }
    incrementSessionStatusCount() {
      if (!this._isEnabled) return;
      let A = JZ3.getCurrentScope(),
        Q = A.getRequestSession();
      if (Q && Q.status) this._incrementSessionStatusCount(Q.status, new Date), A.setRequestSession(void 0)
    }
    _incrementSessionStatusCount(A, Q) {
      let B = new Date(Q).setSeconds(0, 0);
      this._pendingAggregates[B] = this._pendingAggregates[B] || {};
      let G = this._pendingAggregates[B];
      if (!G.started) G.started = new Date(B).toISOString();
      switch (A) {
        case "errored":
          return G.errored = (G.errored || 0) + 1, G.errored;
        case "ok":
          return G.exited = (G.exited || 0) + 1, G.exited;
        default:
          return G.crashed = (G.crashed || 0) + 1, G.crashed
      }
    }
  }
  Rn2.SessionFlusher = On2
})
// @from(Start 12598978, End 12600386)
HG1 = z((Pn2) => {
  Object.defineProperty(Pn2, "__esModule", {
    value: !0
  });
  var rI0 = i0(),
    XZ3 = "7";

  function Tn2(A) {
    let Q = A.protocol ? `${A.protocol}:` : "",
      B = A.port ? `:${A.port}` : "";
    return `${Q}//${A.host}${B}${A.path?`/${A.path}`:""}/api/`
  }

  function VZ3(A) {
    return `${Tn2(A)}${A.projectId}/envelope/`
  }

  function FZ3(A, Q) {
    return rI0.urlEncode({
      sentry_key: A.publicKey,
      sentry_version: XZ3,
      ...Q && {
        sentry_client: `${Q.name}/${Q.version}`
      }
    })
  }

  function KZ3(A, Q = {}) {
    let B = typeof Q === "string" ? Q : Q.tunnel,
      G = typeof Q === "string" || !Q._metadata ? void 0 : Q._metadata.sdk;
    return B ? B : `${VZ3(A)}?${FZ3(A,G)}`
  }

  function DZ3(A, Q) {
    let B = rI0.makeDsn(A);
    if (!B) return "";
    let G = `${Tn2(B)}embed/error-page/`,
      Z = `dsn=${rI0.dsnToString(B)}`;
    for (let I in Q) {
      if (I === "dsn") continue;
      if (I === "onClose") continue;
      if (I === "user") {
        let Y = Q.user;
        if (!Y) continue;
        if (Y.name) Z += `&name=${encodeURIComponent(Y.name)}`;
        if (Y.email) Z += `&email=${encodeURIComponent(Y.email)}`
      } else Z += `&${encodeURIComponent(I)}=${encodeURIComponent(Q[I])}`
    }
    return `${G}?${Z}`
  }
  Pn2.getEnvelopeEndpointWithUrlEncodedAuth = KZ3;
  Pn2.getReportDialogEndpoint = DZ3
})
// @from(Start 12600392, End 12603087)
Cg = z((Sn2) => {
  Object.defineProperty(Sn2, "__esModule", {
    value: !0
  });
  var CG1 = i0(),
    oI0 = ZV(),
    EZ3 = VPA(),
    zZ3 = jO(),
    UZ3 = py(),
    tI0 = [];

  function $Z3(A) {
    let Q = {};
    return A.forEach((B) => {
      let {
        name: G
      } = B, Z = Q[G];
      if (Z && !Z.isDefaultInstance && B.isDefaultInstance) return;
      Q[G] = B
    }), Object.keys(Q).map((B) => Q[B])
  }

  function wZ3(A) {
    let Q = A.defaultIntegrations || [],
      B = A.integrations;
    Q.forEach((Y) => {
      Y.isDefaultInstance = !0
    });
    let G;
    if (Array.isArray(B)) G = [...Q, ...B];
    else if (typeof B === "function") G = CG1.arrayify(B(Q));
    else G = Q;
    let Z = $Z3(G),
      I = MZ3(Z, (Y) => Y.name === "Debug");
    if (I !== -1) {
      let [Y] = Z.splice(I, 1);
      Z.push(Y)
    }
    return Z
  }

  function qZ3(A, Q) {
    let B = {};
    return Q.forEach((G) => {
      if (G) jn2(A, G, B)
    }), B
  }

  function NZ3(A, Q) {
    for (let B of Q)
      if (B && B.afterAllSetup) B.afterAllSetup(A)
  }

  function jn2(A, Q, B) {
    if (B[Q.name]) {
      oI0.DEBUG_BUILD && CG1.logger.log(`Integration skipped because it was already installed: ${Q.name}`);
      return
    }
    if (B[Q.name] = Q, tI0.indexOf(Q.name) === -1) Q.setupOnce(EZ3.addGlobalEventProcessor, UZ3.getCurrentHub), tI0.push(Q.name);
    if (Q.setup && typeof Q.setup === "function") Q.setup(A);
    if (A.on && typeof Q.preprocessEvent === "function") {
      let G = Q.preprocessEvent.bind(Q);
      A.on("preprocessEvent", (Z, I) => G(Z, I, A))
    }
    if (A.addEventProcessor && typeof Q.processEvent === "function") {
      let G = Q.processEvent.bind(Q),
        Z = Object.assign((I, Y) => G(I, Y, A), {
          id: Q.name
        });
      A.addEventProcessor(Z)
    }
    oI0.DEBUG_BUILD && CG1.logger.log(`Integration installed: ${Q.name}`)
  }

  function LZ3(A) {
    let Q = zZ3.getClient();
    if (!Q || !Q.addIntegration) {
      oI0.DEBUG_BUILD && CG1.logger.warn(`Cannot add integration "${A.name}" because no SDK Client is available.`);
      return
    }
    Q.addIntegration(A)
  }

  function MZ3(A, Q) {
    for (let B = 0; B < A.length; B++)
      if (Q(A[B]) === !0) return B;
    return -1
  }

  function OZ3(A, Q) {
    return Object.assign(function(...G) {
      return Q(...G)
    }, {
      id: A
    })
  }

  function RZ3(A) {
    return A
  }
  Sn2.addIntegration = LZ3;
  Sn2.afterSetupIntegrations = NZ3;
  Sn2.convertIntegrationFnToClass = OZ3;
  Sn2.defineIntegration = RZ3;
  Sn2.getIntegrationsToSetup = wZ3;
  Sn2.installedIntegrations = tI0;
  Sn2.setupIntegration = jn2;
  Sn2.setupIntegrations = qZ3
})
// @from(Start 12603093, End 12604673)
qPA = z((_n2) => {
  Object.defineProperty(_n2, "__esModule", {
    value: !0
  });
  var vZ3 = i0();

  function bZ3(A, Q, B, G) {
    let Z = Object.entries(vZ3.dropUndefinedKeys(G)).sort((I, Y) => I[0].localeCompare(Y[0]));
    return `${A}${Q}${B}${Z}`
  }

  function fZ3(A) {
    let Q = 0;
    for (let B = 0; B < A.length; B++) {
      let G = A.charCodeAt(B);
      Q = (Q << 5) - Q + G, Q &= Q
    }
    return Q >>> 0
  }

  function hZ3(A) {
    let Q = "";
    for (let B of A) {
      let G = Object.entries(B.tags),
        Z = G.length > 0 ? `|#${G.map(([I,Y])=>`${I}:${Y}`).join(",")}` : "";
      Q += `${B.name}@${B.unit}:${B.metric}|${B.metricType}${Z}|T${B.timestamp}
`
    }
    return Q
  }

  function gZ3(A) {
    return A.replace(/[^\w]+/gi, "_")
  }

  function uZ3(A) {
    return A.replace(/[^\w\-.]+/gi, "_")
  }

  function mZ3(A) {
    return A.replace(/[^\w\-./]+/gi, "")
  }
  var dZ3 = [
    [`
`, "\\n"],
    ["\r", "\\r"],
    ["\t", "\\t"],
    ["\\", "\\\\"],
    ["|", "\\u{7c}"],
    [",", "\\u{2c}"]
  ];

  function cZ3(A) {
    for (let [Q, B] of dZ3)
      if (A === Q) return B;
    return A
  }

  function pZ3(A) {
    return [...A].reduce((Q, B) => Q + cZ3(B), "")
  }

  function lZ3(A) {
    let Q = {};
    for (let B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) {
        let G = mZ3(B);
        Q[G] = pZ3(String(A[B]))
      } return Q
  }
  _n2.getBucketKey = bZ3;
  _n2.sanitizeMetricKey = uZ3;
  _n2.sanitizeTags = lZ3;
  _n2.sanitizeUnit = gZ3;
  _n2.serializeMetricBuckets = hZ3;
  _n2.simpleHash = fZ3
})
// @from(Start 12604679, End 12605259)
xn2 = z((yn2) => {
  Object.defineProperty(yn2, "__esModule", {
    value: !0
  });
  var kn2 = i0(),
    tZ3 = qPA();

  function eZ3(A, Q, B, G) {
    let Z = {
      sent_at: new Date().toISOString()
    };
    if (B && B.sdk) Z.sdk = {
      name: B.sdk.name,
      version: B.sdk.version
    };
    if (!!G && Q) Z.dsn = kn2.dsnToString(Q);
    let I = AI3(A);
    return kn2.createEnvelope(Z, [I])
  }

  function AI3(A) {
    let Q = tZ3.serializeMetricBuckets(A);
    return [{
      type: "statsd",
      length: Q.length
    }, Q]
  }
  yn2.createMetricEnvelope = eZ3
})
// @from(Start 12605265, End 12617233)
eI0 = z((mn2) => {
  Object.defineProperty(mn2, "__esModule", {
    value: !0
  });
  var V7 = i0(),
    BI3 = HG1(),
    iy = ZV(),
    vn2 = aI0(),
    GI3 = jO(),
    ZI3 = py(),
    EG1 = Cg(),
    II3 = xn2(),
    bn2 = WXA(),
    YI3 = a0A(),
    JI3 = i71(),
    fn2 = "Not capturing exception because it's already been captured.";
  class hn2 {
    constructor(A) {
      if (this._options = A, this._integrations = {}, this._integrationsInitialized = !1, this._numProcessing = 0, this._outcomes = {}, this._hooks = {}, this._eventProcessors = [], A.dsn) this._dsn = V7.makeDsn(A.dsn);
      else iy.DEBUG_BUILD && V7.logger.warn("No DSN provided, client will not send events.");
      if (this._dsn) {
        let Q = BI3.getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, A);
        this._transport = A.transport({
          tunnel: this._options.tunnel,
          recordDroppedEvent: this.recordDroppedEvent.bind(this),
          ...A.transportOptions,
          url: Q
        })
      }
    }
    captureException(A, Q, B) {
      if (V7.checkOrSetAlreadyCaught(A)) {
        iy.DEBUG_BUILD && V7.logger.log(fn2);
        return
      }
      let G = Q && Q.event_id;
      return this._process(this.eventFromException(A, Q).then((Z) => this._captureEvent(Z, Q, B)).then((Z) => {
        G = Z
      })), G
    }
    captureMessage(A, Q, B, G) {
      let Z = B && B.event_id,
        I = V7.isParameterizedString(A) ? A : String(A),
        Y = V7.isPrimitive(A) ? this.eventFromMessage(I, Q, B) : this.eventFromException(A, B);
      return this._process(Y.then((J) => this._captureEvent(J, B, G)).then((J) => {
        Z = J
      })), Z
    }
    captureEvent(A, Q, B) {
      if (Q && Q.originalException && V7.checkOrSetAlreadyCaught(Q.originalException)) {
        iy.DEBUG_BUILD && V7.logger.log(fn2);
        return
      }
      let G = Q && Q.event_id,
        I = (A.sdkProcessingMetadata || {}).capturedSpanScope;
      return this._process(this._captureEvent(A, Q, I || B).then((Y) => {
        G = Y
      })), G
    }
    captureSession(A) {
      if (typeof A.release !== "string") iy.DEBUG_BUILD && V7.logger.warn("Discarded session because of missing or non-string release");
      else this.sendSession(A), bn2.updateSession(A, {
        init: !1
      })
    }
    getDsn() {
      return this._dsn
    }
    getOptions() {
      return this._options
    }
    getSdkMetadata() {
      return this._options._metadata
    }
    getTransport() {
      return this._transport
    }
    flush(A) {
      let Q = this._transport;
      if (Q) {
        if (this.metricsAggregator) this.metricsAggregator.flush();
        return this._isClientDoneProcessing(A).then((B) => {
          return Q.flush(A).then((G) => B && G)
        })
      } else return V7.resolvedSyncPromise(!0)
    }
    close(A) {
      return this.flush(A).then((Q) => {
        if (this.getOptions().enabled = !1, this.metricsAggregator) this.metricsAggregator.close();
        return Q
      })
    }
    getEventProcessors() {
      return this._eventProcessors
    }
    addEventProcessor(A) {
      this._eventProcessors.push(A)
    }
    setupIntegrations(A) {
      if (A && !this._integrationsInitialized || this._isEnabled() && !this._integrationsInitialized) this._setupIntegrations()
    }
    init() {
      if (this._isEnabled()) this._setupIntegrations()
    }
    getIntegrationById(A) {
      return this.getIntegrationByName(A)
    }
    getIntegrationByName(A) {
      return this._integrations[A]
    }
    getIntegration(A) {
      try {
        return this._integrations[A.id] || null
      } catch (Q) {
        return iy.DEBUG_BUILD && V7.logger.warn(`Cannot retrieve integration ${A.id} from the current Client`), null
      }
    }
    addIntegration(A) {
      let Q = this._integrations[A.name];
      if (EG1.setupIntegration(this, A, this._integrations), !Q) EG1.afterSetupIntegrations(this, [A])
    }
    sendEvent(A, Q = {}) {
      this.emit("beforeSendEvent", A, Q);
      let B = vn2.createEventEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      for (let Z of Q.attachments || []) B = V7.addItemToEnvelope(B, V7.createAttachmentEnvelopeItem(Z, this._options.transportOptions && this._options.transportOptions.textEncoder));
      let G = this._sendEnvelope(B);
      if (G) G.then((Z) => this.emit("afterSendEvent", A, Z), null)
    }
    sendSession(A) {
      let Q = vn2.createSessionEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(Q)
    }
    recordDroppedEvent(A, Q, B) {
      if (this._options.sendClientReports) {
        let G = typeof B === "number" ? B : 1,
          Z = `${A}:${Q}`;
        iy.DEBUG_BUILD && V7.logger.log(`Recording outcome: "${Z}"${G>1?` (${G} times)`:""}`), this._outcomes[Z] = (this._outcomes[Z] || 0) + G
      }
    }
    captureAggregateMetrics(A) {
      iy.DEBUG_BUILD && V7.logger.log(`Flushing aggregated metrics, number of metrics: ${A.length}`);
      let Q = II3.createMetricEnvelope(A, this._dsn, this._options._metadata, this._options.tunnel);
      this._sendEnvelope(Q)
    }
    on(A, Q) {
      if (!this._hooks[A]) this._hooks[A] = [];
      this._hooks[A].push(Q)
    }
    emit(A, ...Q) {
      if (this._hooks[A]) this._hooks[A].forEach((B) => B(...Q))
    }
    _setupIntegrations() {
      let {
        integrations: A
      } = this._options;
      this._integrations = EG1.setupIntegrations(this, A), EG1.afterSetupIntegrations(this, A), this._integrationsInitialized = !0
    }
    _updateSessionFromEvent(A, Q) {
      let B = !1,
        G = !1,
        Z = Q.exception && Q.exception.values;
      if (Z) {
        G = !0;
        for (let J of Z) {
          let W = J.mechanism;
          if (W && W.handled === !1) {
            B = !0;
            break
          }
        }
      }
      let I = A.status === "ok";
      if (I && A.errors === 0 || I && B) bn2.updateSession(A, {
        ...B && {
          status: "crashed"
        },
        errors: A.errors || Number(G || B)
      }), this.captureSession(A)
    }
    _isClientDoneProcessing(A) {
      return new V7.SyncPromise((Q) => {
        let B = 0,
          G = 1,
          Z = setInterval(() => {
            if (this._numProcessing == 0) clearInterval(Z), Q(!0);
            else if (B += G, A && B >= A) clearInterval(Z), Q(!1)
          }, G)
      })
    }
    _isEnabled() {
      return this.getOptions().enabled !== !1 && this._transport !== void 0
    }
    _prepareEvent(A, Q, B, G = ZI3.getIsolationScope()) {
      let Z = this.getOptions(),
        I = Object.keys(this._integrations);
      if (!Q.integrations && I.length > 0) Q.integrations = I;
      return this.emit("preprocessEvent", A, Q), JI3.prepareEvent(Z, A, Q, B, this, G).then((Y) => {
        if (Y === null) return Y;
        let J = {
          ...G.getPropagationContext(),
          ...B ? B.getPropagationContext() : void 0
        };
        if (!(Y.contexts && Y.contexts.trace) && J) {
          let {
            traceId: X,
            spanId: V,
            parentSpanId: F,
            dsc: K
          } = J;
          Y.contexts = {
            trace: {
              trace_id: X,
              span_id: V,
              parent_span_id: F
            },
            ...Y.contexts
          };
          let D = K ? K : YI3.getDynamicSamplingContextFromClient(X, this, B);
          Y.sdkProcessingMetadata = {
            dynamicSamplingContext: D,
            ...Y.sdkProcessingMetadata
          }
        }
        return Y
      })
    }
    _captureEvent(A, Q = {}, B) {
      return this._processEvent(A, Q, B).then((G) => {
        return G.event_id
      }, (G) => {
        if (iy.DEBUG_BUILD) {
          let Z = G;
          if (Z.logLevel === "log") V7.logger.log(Z.message);
          else V7.logger.warn(Z)
        }
        return
      })
    }
    _processEvent(A, Q, B) {
      let G = this.getOptions(),
        {
          sampleRate: Z
        } = G,
        I = un2(A),
        Y = gn2(A),
        J = A.type || "error",
        W = `before send for type \`${J}\``;
      if (Y && typeof Z === "number" && Math.random() > Z) return this.recordDroppedEvent("sample_rate", "error", A), V7.rejectedSyncPromise(new V7.SentryError(`Discarding event because it's not included in the random sample (sampling rate = ${Z})`, "log"));
      let X = J === "replay_event" ? "replay" : J,
        F = (A.sdkProcessingMetadata || {}).capturedSpanIsolationScope;
      return this._prepareEvent(A, Q, B, F).then((K) => {
        if (K === null) throw this.recordDroppedEvent("event_processor", X, A), new V7.SentryError("An event processor returned `null`, will not send event.", "log");
        if (Q.data && Q.data.__sentry__ === !0) return K;
        let H = XI3(G, K, Q);
        return WI3(H, W)
      }).then((K) => {
        if (K === null) {
          if (this.recordDroppedEvent("before_send", X, A), I) {
            let E = 1 + (A.spans || []).length;
            this.recordDroppedEvent("before_send", "span", E)
          }
          throw new V7.SentryError(`${W} returned \`null\`, will not send event.`, "log")
        }
        let D = B && B.getSession();
        if (!I && D) this._updateSessionFromEvent(D, K);
        if (I) {
          let C = K.sdkProcessingMetadata && K.sdkProcessingMetadata.spanCountBeforeProcessing || 0,
            E = K.spans ? K.spans.length : 0,
            U = C - E;
          if (U > 0) this.recordDroppedEvent("before_send", "span", U)
        }
        let H = K.transaction_info;
        if (I && H && K.transaction !== A.transaction) K.transaction_info = {
          ...H,
          source: "custom"
        };
        return this.sendEvent(K, Q), K
      }).then(null, (K) => {
        if (K instanceof V7.SentryError) throw K;
        throw this.captureException(K, {
          data: {
            __sentry__: !0
          },
          originalException: K
        }), new V7.SentryError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${K}`)
      })
    }
    _process(A) {
      this._numProcessing++, A.then((Q) => {
        return this._numProcessing--, Q
      }, (Q) => {
        return this._numProcessing--, Q
      })
    }
    _sendEnvelope(A) {
      if (this.emit("beforeEnvelope", A), this._isEnabled() && this._transport) return this._transport.send(A).then(null, (Q) => {
        iy.DEBUG_BUILD && V7.logger.error("Error while sending event:", Q)
      });
      else iy.DEBUG_BUILD && V7.logger.error("Transport disabled")
    }
    _clearOutcomes() {
      let A = this._outcomes;
      return this._outcomes = {}, Object.keys(A).map((Q) => {
        let [B, G] = Q.split(":");
        return {
          reason: B,
          category: G,
          quantity: A[Q]
        }
      })
    }
  }

  function WI3(A, Q) {
    let B = `${Q} must return \`null\` or a valid event.`;
    if (V7.isThenable(A)) return A.then((G) => {
      if (!V7.isPlainObject(G) && G !== null) throw new V7.SentryError(B);
      return G
    }, (G) => {
      throw new V7.SentryError(`${Q} rejected with ${G}`)
    });
    else if (!V7.isPlainObject(A) && A !== null) throw new V7.SentryError(B);
    return A
  }

  function XI3(A, Q, B) {
    let {
      beforeSend: G,
      beforeSendTransaction: Z
    } = A;
    if (gn2(Q) && G) return G(Q, B);
    if (un2(Q) && Z) {
      if (Q.spans) {
        let I = Q.spans.length;
        Q.sdkProcessingMetadata = {
          ...Q.sdkProcessingMetadata,
          spanCountBeforeProcessing: I
        }
      }
      return Z(Q, B)
    }
    return Q
  }

  function gn2(A) {
    return A.type === void 0
  }

  function un2(A) {
    return A.type === "transaction"
  }

  function VI3(A) {
    let Q = GI3.getClient();
    if (!Q || !Q.addEventProcessor) return;
    Q.addEventProcessor(A)
  }
  mn2.BaseClient = hn2;
  mn2.addEventProcessor = VI3
})
// @from(Start 12617239, End 12617790)
QY0 = z((dn2) => {
  Object.defineProperty(dn2, "__esModule", {
    value: !0
  });
  var AY0 = i0();

  function DI3(A, Q, B, G, Z) {
    let I = {
      sent_at: new Date().toISOString()
    };
    if (B && B.sdk) I.sdk = {
      name: B.sdk.name,
      version: B.sdk.version
    };
    if (!!G && !!Z) I.dsn = AY0.dsnToString(Z);
    if (Q) I.trace = AY0.dropUndefinedKeys(Q);
    let Y = HI3(A);
    return AY0.createEnvelope(I, [Y])
  }

  function HI3(A) {
    return [{
      type: "check_in"
    }, A]
  }
  dn2.createCheckInEnvelope = DI3
})
// @from(Start 12617796, End 12618224)
NPA = z((cn2) => {
  Object.defineProperty(cn2, "__esModule", {
    value: !0
  });
  var EI3 = "c",
    zI3 = "g",
    UI3 = "s",
    $I3 = "d",
    wI3 = 5000,
    qI3 = 1e4,
    NI3 = 1e4;
  cn2.COUNTER_METRIC_TYPE = EI3;
  cn2.DEFAULT_BROWSER_FLUSH_INTERVAL = wI3;
  cn2.DEFAULT_FLUSH_INTERVAL = qI3;
  cn2.DISTRIBUTION_METRIC_TYPE = $I3;
  cn2.GAUGE_METRIC_TYPE = zI3;
  cn2.MAX_WEIGHT = NI3;
  cn2.SET_METRIC_TYPE = UI3
})
// @from(Start 12618230, End 12619820)
YY0 = z((pn2) => {
  Object.defineProperty(pn2, "__esModule", {
    value: !0
  });
  var zG1 = NPA(),
    SI3 = qPA();
  class BY0 {
    constructor(A) {
      this._value = A
    }
    get weight() {
      return 1
    }
    add(A) {
      this._value += A
    }
    toString() {
      return `${this._value}`
    }
  }
  class GY0 {
    constructor(A) {
      this._last = A, this._min = A, this._max = A, this._sum = A, this._count = 1
    }
    get weight() {
      return 5
    }
    add(A) {
      if (this._last = A, A < this._min) this._min = A;
      if (A > this._max) this._max = A;
      this._sum += A, this._count++
    }
    toString() {
      return `${this._last}:${this._min}:${this._max}:${this._sum}:${this._count}`
    }
  }
  class ZY0 {
    constructor(A) {
      this._value = [A]
    }
    get weight() {
      return this._value.length
    }
    add(A) {
      this._value.push(A)
    }
    toString() {
      return this._value.join(":")
    }
  }
  class IY0 {
    constructor(A) {
      this.first = A, this._value = new Set([A])
    }
    get weight() {
      return this._value.size
    }
    add(A) {
      this._value.add(A)
    }
    toString() {
      return Array.from(this._value).map((A) => typeof A === "string" ? SI3.simpleHash(A) : A).join(":")
    }
  }
  var _I3 = {
    [zG1.COUNTER_METRIC_TYPE]: BY0,
    [zG1.GAUGE_METRIC_TYPE]: GY0,
    [zG1.DISTRIBUTION_METRIC_TYPE]: ZY0,
    [zG1.SET_METRIC_TYPE]: IY0
  };
  pn2.CounterMetric = BY0;
  pn2.DistributionMetric = ZY0;
  pn2.GaugeMetric = GY0;
  pn2.METRIC_MAP = _I3;
  pn2.SetMetric = IY0
})
// @from(Start 12619826, End 12622126)
an2 = z((nn2) => {
  Object.defineProperty(nn2, "__esModule", {
    value: !0
  });
  var ln2 = i0(),
    LPA = NPA(),
    fI3 = YY0(),
    hI3 = UPA(),
    UG1 = qPA();
  class in2 {
    constructor(A) {
      if (this._client = A, this._buckets = new Map, this._bucketsTotalWeight = 0, this._interval = setInterval(() => this._flush(), LPA.DEFAULT_FLUSH_INTERVAL), this._interval.unref) this._interval.unref();
      this._flushShift = Math.floor(Math.random() * LPA.DEFAULT_FLUSH_INTERVAL / 1000), this._forceFlush = !1
    }
    add(A, Q, B, G = "none", Z = {}, I = ln2.timestampInSeconds()) {
      let Y = Math.floor(I),
        J = UG1.sanitizeMetricKey(Q),
        W = UG1.sanitizeTags(Z),
        X = UG1.sanitizeUnit(G),
        V = UG1.getBucketKey(A, J, X, W),
        F = this._buckets.get(V),
        K = F && A === LPA.SET_METRIC_TYPE ? F.metric.weight : 0;
      if (F) {
        if (F.metric.add(B), F.timestamp < Y) F.timestamp = Y
      } else F = {
        metric: new fI3.METRIC_MAP[A](B),
        timestamp: Y,
        metricType: A,
        name: J,
        unit: X,
        tags: W
      }, this._buckets.set(V, F);
      let D = typeof B === "string" ? F.metric.weight - K : B;
      if (hI3.updateMetricSummaryOnActiveSpan(A, J, D, X, Z, V), this._bucketsTotalWeight += F.metric.weight, this._bucketsTotalWeight >= LPA.MAX_WEIGHT) this.flush()
    }
    flush() {
      this._forceFlush = !0, this._flush()
    }
    close() {
      this._forceFlush = !0, clearInterval(this._interval), this._flush()
    }
    _flush() {
      if (this._forceFlush) {
        this._forceFlush = !1, this._bucketsTotalWeight = 0, this._captureMetrics(this._buckets), this._buckets.clear();
        return
      }
      let A = Math.floor(ln2.timestampInSeconds()) - LPA.DEFAULT_FLUSH_INTERVAL / 1000 - this._flushShift,
        Q = new Map;
      for (let [B, G] of this._buckets)
        if (G.timestamp <= A) Q.set(B, G), this._bucketsTotalWeight -= G.metric.weight;
      for (let [B] of Q) this._buckets.delete(B);
      this._captureMetrics(Q)
    }
    _captureMetrics(A) {
      if (A.size > 0 && this._client.captureAggregateMetrics) {
        let Q = Array.from(A).map(([, B]) => B);
        this._client.captureAggregateMetrics(Q)
      }
    }
  }
  nn2.MetricsAggregator = in2
})
// @from(Start 12622132, End 12626385)
tn2 = z((on2) => {
  Object.defineProperty(on2, "__esModule", {
    value: !0
  });
  var Eg = i0(),
    uI3 = eI0(),
    mI3 = QY0(),
    $G1 = ZV(),
    dI3 = jO(),
    cI3 = an2(),
    pI3 = sI0(),
    lI3 = nI0(),
    iI3 = E$(),
    nI3 = XXA();
  KXA();
  var sn2 = a0A();
  class rn2 extends uI3.BaseClient {
    constructor(A) {
      lI3.addTracingExtensions();
      super(A);
      if (A._experiments && A._experiments.metricsAggregator) this.metricsAggregator = new cI3.MetricsAggregator(this)
    }
    eventFromException(A, Q) {
      return Eg.resolvedSyncPromise(Eg.eventFromUnknownInput(dI3.getClient(), this._options.stackParser, A, Q))
    }
    eventFromMessage(A, Q = "info", B) {
      return Eg.resolvedSyncPromise(Eg.eventFromMessage(this._options.stackParser, A, Q, B, this._options.attachStacktrace))
    }
    captureException(A, Q, B) {
      if (this._options.autoSessionTracking && this._sessionFlusher && B) {
        let G = B.getRequestSession();
        if (G && G.status === "ok") G.status = "errored"
      }
      return super.captureException(A, Q, B)
    }
    captureEvent(A, Q, B) {
      if (this._options.autoSessionTracking && this._sessionFlusher && B) {
        if ((A.type || "exception") === "exception" && A.exception && A.exception.values && A.exception.values.length > 0) {
          let I = B.getRequestSession();
          if (I && I.status === "ok") I.status = "errored"
        }
      }
      return super.captureEvent(A, Q, B)
    }
    close(A) {
      if (this._sessionFlusher) this._sessionFlusher.close();
      return super.close(A)
    }
    initSessionFlusher() {
      let {
        release: A,
        environment: Q
      } = this._options;
      if (!A) $G1.DEBUG_BUILD && Eg.logger.warn("Cannot initialise an instance of SessionFlusher if no release is provided!");
      else this._sessionFlusher = new pI3.SessionFlusher(this, {
        release: A,
        environment: Q
      })
    }
    captureCheckIn(A, Q, B) {
      let G = "checkInId" in A && A.checkInId ? A.checkInId : Eg.uuid4();
      if (!this._isEnabled()) return $G1.DEBUG_BUILD && Eg.logger.warn("SDK not enabled, will not capture checkin."), G;
      let Z = this.getOptions(),
        {
          release: I,
          environment: Y,
          tunnel: J
        } = Z,
        W = {
          check_in_id: G,
          monitor_slug: A.monitorSlug,
          status: A.status,
          release: I,
          environment: Y
        };
      if ("duration" in A) W.duration = A.duration;
      if (Q) W.monitor_config = {
        schedule: Q.schedule,
        checkin_margin: Q.checkinMargin,
        max_runtime: Q.maxRuntime,
        timezone: Q.timezone
      };
      let [X, V] = this._getTraceInfoFromScope(B);
      if (V) W.contexts = {
        trace: V
      };
      let F = mI3.createCheckInEnvelope(W, X, this.getSdkMetadata(), J, this.getDsn());
      return $G1.DEBUG_BUILD && Eg.logger.info("Sending checkin:", A.monitorSlug, A.status), this._sendEnvelope(F), G
    }
    _captureRequestSession() {
      if (!this._sessionFlusher) $G1.DEBUG_BUILD && Eg.logger.warn("Discarded request mode session because autoSessionTracking option was disabled");
      else this._sessionFlusher.incrementSessionStatusCount()
    }
    _prepareEvent(A, Q, B, G) {
      if (this._options.platform) A.platform = A.platform || this._options.platform;
      if (this._options.runtime) A.contexts = {
        ...A.contexts,
        runtime: (A.contexts || {}).runtime || this._options.runtime
      };
      if (this._options.serverName) A.server_name = A.server_name || this._options.serverName;
      return super._prepareEvent(A, Q, B, G)
    }
    _getTraceInfoFromScope(A) {
      if (!A) return [void 0, void 0];
      let Q = A.getSpan();
      if (Q) return [nI3.getRootSpan(Q) ? sn2.getDynamicSamplingContextFromSpan(Q) : void 0, iI3.spanToTraceContext(Q)];
      let {
        traceId: B,
        spanId: G,
        parentSpanId: Z,
        dsc: I
      } = A.getPropagationContext(), Y = {
        trace_id: B,
        span_id: G,
        parent_span_id: Z
      };
      if (I) return [I, Y];
      return [sn2.getDynamicSamplingContextFromClient(B, this, A), Y]
    }
  }
  on2.ServerRuntimeClient = rn2
})
// @from(Start 12626391, End 12627155)
Ba2 = z((Qa2) => {
  Object.defineProperty(Qa2, "__esModule", {
    value: !0
  });
  var en2 = i0(),
    sI3 = ZV(),
    rI3 = jO(),
    oI3 = py();

  function tI3(A, Q) {
    if (Q.debug === !0)
      if (sI3.DEBUG_BUILD) en2.logger.enable();
      else en2.consoleSandbox(() => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.")
      });
    rI3.getCurrentScope().update(Q.initialScope);
    let G = new A(Q);
    Aa2(G), eI3(G)
  }

  function Aa2(A) {
    let B = oI3.getCurrentHub().getStackTop();
    B.client = A, B.scope.setClient(A)
  }

  function eI3(A) {
    if (A.init) A.init();
    else if (A.setupIntegrations) A.setupIntegrations()
  }
  Qa2.initAndBind = tI3;
  Qa2.setCurrentClient = Aa2
})
// @from(Start 12627161, End 12628972)
Ja2 = z((Ya2) => {
  Object.defineProperty(Ya2, "__esModule", {
    value: !0
  });
  var U$ = i0(),
    Ga2 = ZV(),
    Ia2 = 30;

  function BY3(A, Q, B = U$.makePromiseBuffer(A.bufferSize || Ia2)) {
    let G = {},
      Z = (Y) => B.drain(Y);

    function I(Y) {
      let J = [];
      if (U$.forEachEnvelopeItem(Y, (F, K) => {
          let D = U$.envelopeItemTypeToDataCategory(K);
          if (U$.isRateLimited(G, D)) {
            let H = Za2(F, K);
            A.recordDroppedEvent("ratelimit_backoff", D, H)
          } else J.push(F)
        }), J.length === 0) return U$.resolvedSyncPromise();
      let W = U$.createEnvelope(Y[0], J),
        X = (F) => {
          U$.forEachEnvelopeItem(W, (K, D) => {
            let H = Za2(K, D);
            A.recordDroppedEvent(F, U$.envelopeItemTypeToDataCategory(D), H)
          })
        },
        V = () => Q({
          body: U$.serializeEnvelope(W, A.textEncoder)
        }).then((F) => {
          if (F.statusCode !== void 0 && (F.statusCode < 200 || F.statusCode >= 300)) Ga2.DEBUG_BUILD && U$.logger.warn(`Sentry responded with status code ${F.statusCode} to sent event.`);
          return G = U$.updateRateLimits(G, F), F
        }, (F) => {
          throw X("network_error"), F
        });
      return B.add(V).then((F) => F, (F) => {
        if (F instanceof U$.SentryError) return Ga2.DEBUG_BUILD && U$.logger.error("Skipped sending event because buffer is full."), X("queue_overflow"), U$.resolvedSyncPromise();
        else throw F
      })
    }
    return I.__sentry__baseTransport__ = !0, {
      send: I,
      flush: Z
    }
  }

  function Za2(A, Q) {
    if (Q !== "event" && Q !== "transaction") return;
    return Array.isArray(A) ? A[1] : void 0
  }
  Ya2.DEFAULT_TRANSPORT_BUFFER_SIZE = Ia2;
  Ya2.createTransport = BY3
})
// @from(Start 12628978, End 12630802)
Va2 = z((Xa2) => {
  Object.defineProperty(Xa2, "__esModule", {
    value: !0
  });
  var WY0 = i0(),
    IY3 = ZV(),
    Wa2 = 100,
    XY0 = 5000,
    YY3 = 3600000;

  function JY0(A, Q) {
    IY3.DEBUG_BUILD && WY0.logger.info(`[Offline]: ${A}`, Q)
  }

  function JY3(A) {
    return (Q) => {
      let B = A(Q),
        G = Q.createStore ? Q.createStore(Q) : void 0,
        Z = XY0,
        I;

      function Y(V, F, K) {
        if (WY0.envelopeContainsItemType(V, ["replay_event", "replay_recording", "client_report"])) return !1;
        if (Q.shouldStore) return Q.shouldStore(V, F, K);
        return !0
      }

      function J(V) {
        if (!G) return;
        if (I) clearTimeout(I);
        if (I = setTimeout(async () => {
            I = void 0;
            let F = await G.pop();
            if (F) JY0("Attempting to send previously queued event"), X(F).catch((K) => {
              JY0("Failed to retry sending", K)
            })
          }, V), typeof I !== "number" && I.unref) I.unref()
      }

      function W() {
        if (I) return;
        J(Z), Z = Math.min(Z * 2, YY3)
      }
      async function X(V) {
        try {
          let F = await B.send(V),
            K = Wa2;
          if (F) {
            if (F.headers && F.headers["retry-after"]) K = WY0.parseRetryAfterHeader(F.headers["retry-after"]);
            else if ((F.statusCode || 0) >= 400) return F
          }
          return J(K), Z = XY0, F
        } catch (F) {
          if (G && await Y(V, F, Z)) return await G.insert(V), W(), JY0("Error sending. Event queued", F), {};
          else throw F
        }
      }
      if (Q.flushAtStartup) W();
      return {
        send: X,
        flush: (V) => B.flush(V)
      }
    }
  }
  Xa2.MIN_DELAY = Wa2;
  Xa2.START_DELAY = XY0;
  Xa2.makeOfflineTransport = JY3
})
// @from(Start 12630808, End 12632809)
Ka2 = z((Fa2) => {
  Object.defineProperty(Fa2, "__esModule", {
    value: !0
  });
  var VY0 = i0(),
    FY3 = HG1();

  function FY0(A, Q) {
    let B;
    return VY0.forEachEnvelopeItem(A, (G, Z) => {
      if (Q.includes(Z)) B = Array.isArray(G) ? G[1] : void 0;
      return !!B
    }), B
  }

  function KY3(A, Q) {
    return (B) => {
      let G = A(B);
      return {
        ...G,
        send: async (Z) => {
          let I = FY0(Z, ["event", "transaction", "profile", "replay_event"]);
          if (I) I.release = Q;
          return G.send(Z)
        }
      }
    }
  }

  function DY3(A, Q) {
    return VY0.createEnvelope(Q ? {
      ...A[0],
      dsn: Q
    } : A[0], A[1])
  }

  function HY3(A, Q) {
    return (B) => {
      let G = A(B),
        Z = new Map;

      function I(W, X) {
        let V = X ? `${W}:${X}` : W,
          F = Z.get(V);
        if (!F) {
          let K = VY0.dsnFromString(W);
          if (!K) return;
          let D = FY3.getEnvelopeEndpointWithUrlEncodedAuth(K, B.tunnel);
          F = X ? KY3(A, X)({
            ...B,
            url: D
          }) : A({
            ...B,
            url: D
          }), Z.set(V, F)
        }
        return [W, F]
      }
      async function Y(W) {
        function X(K) {
          let D = K && K.length ? K : ["event"];
          return FY0(W, D)
        }
        let V = Q({
          envelope: W,
          getEvent: X
        }).map((K) => {
          if (typeof K === "string") return I(K, void 0);
          else return I(K.dsn, K.release)
        }).filter((K) => !!K);
        if (V.length === 0) V.push(["", G]);
        return (await Promise.all(V.map(([K, D]) => D.send(DY3(W, K)))))[0]
      }
      async function J(W) {
        let X = [await G.flush(W)];
        for (let [, V] of Z) X.push(await V.flush(W));
        return X.every((V) => V)
      }
      return {
        send: Y,
        flush: J
      }
    }
  }
  Fa2.eventFromEnvelope = FY0;
  Fa2.makeMultiplexedTransport = HY3
})
// @from(Start 12632815, End 12633206)
Ca2 = z((Ha2) => {
  Object.defineProperty(Ha2, "__esModule", {
    value: !0
  });
  var Da2 = i0();

  function zY3(A, Q) {
    let B = {
      sent_at: new Date().toISOString()
    };
    if (Q) B.dsn = Da2.dsnToString(Q);
    let G = A.map(UY3);
    return Da2.createEnvelope(B, G)
  }

  function UY3(A) {
    return [{
      type: "span"
    }, A]
  }
  Ha2.createSpanEnvelope = zY3
})
// @from(Start 12633212, End 12633788)
Ua2 = z((za2) => {
  Object.defineProperty(za2, "__esModule", {
    value: !0
  });

  function wY3(A, Q) {
    let B = Q && LY3(Q) ? Q.getClient() : Q,
      G = B && B.getDsn(),
      Z = B && B.getOptions().tunnel;
    return NY3(A, G) || qY3(A, Z)
  }

  function qY3(A, Q) {
    if (!Q) return !1;
    return Ea2(A) === Ea2(Q)
  }

  function NY3(A, Q) {
    return Q ? A.includes(Q.host) : !1
  }

  function Ea2(A) {
    return A[A.length - 1] === "/" ? A.slice(0, -1) : A
  }

  function LY3(A) {
    return A.getClient !== void 0
  }
  za2.isSentryRequestUrl = wY3
})
// @from(Start 12633794, End 12634116)
wa2 = z(($a2) => {
  Object.defineProperty($a2, "__esModule", {
    value: !0
  });

  function OY3(A, ...Q) {
    let B = new String(String.raw(A, ...Q));
    return B.__sentry_template_string__ = A.join("\x00").replace(/%/g, "%%").replace(/\0/g, "%s"), B.__sentry_template_values__ = Q, B
  }
  $a2.parameterize = OY3
})
// @from(Start 12634122, End 12634568)
La2 = z((Na2) => {
  Object.defineProperty(Na2, "__esModule", {
    value: !0
  });
  var qa2 = o71();

  function TY3(A, Q, B = [Q], G = "npm") {
    let Z = A._metadata || {};
    if (!Z.sdk) Z.sdk = {
      name: `sentry.javascript.${Q}`,
      packages: B.map((I) => ({
        name: `${G}:@sentry/${I}`,
        version: qa2.SDK_VERSION
      })),
      version: qa2.SDK_VERSION
    };
    A._metadata = Z
  }
  Na2.applySdkMetadata = TY3
})
// @from(Start 12634574, End 12635817)
Pa2 = z((Ta2) => {
  Object.defineProperty(Ta2, "__esModule", {
    value: !0
  });
  var KY0 = i0(),
    Oa2 = new Map,
    Ma2 = new Set;

  function jY3(A) {
    if (!KY0.GLOBAL_OBJ._sentryModuleMetadata) return;
    for (let Q of Object.keys(KY0.GLOBAL_OBJ._sentryModuleMetadata)) {
      let B = KY0.GLOBAL_OBJ._sentryModuleMetadata[Q];
      if (Ma2.has(Q)) continue;
      Ma2.add(Q);
      let G = A(Q);
      for (let Z of G.reverse())
        if (Z.filename) {
          Oa2.set(Z.filename, B);
          break
        }
    }
  }

  function Ra2(A, Q) {
    return jY3(A), Oa2.get(Q)
  }

  function SY3(A, Q) {
    try {
      Q.exception.values.forEach((B) => {
        if (!B.stacktrace) return;
        for (let G of B.stacktrace.frames || []) {
          if (!G.filename) continue;
          let Z = Ra2(A, G.filename);
          if (Z) G.module_metadata = Z
        }
      })
    } catch (B) {}
  }

  function _Y3(A) {
    try {
      A.exception.values.forEach((Q) => {
        if (!Q.stacktrace) return;
        for (let B of Q.stacktrace.frames || []) delete B.module_metadata
      })
    } catch (Q) {}
  }
  Ta2.addMetadataToStackFrames = SY3;
  Ta2.getMetadataForUrl = Ra2;
  Ta2.stripMetadataFromStackFrames = _Y3
})
// @from(Start 12635823, End 12636758)
xa2 = z((ya2) => {
  Object.defineProperty(ya2, "__esModule", {
    value: !0
  });
  var vY3 = i0(),
    Sa2 = Cg(),
    ja2 = Pa2(),
    _a2 = "ModuleMetadata",
    bY3 = () => {
      return {
        name: _a2,
        setupOnce() {},
        setup(A) {
          if (typeof A.on !== "function") return;
          A.on("beforeEnvelope", (Q) => {
            vY3.forEachEnvelopeItem(Q, (B, G) => {
              if (G === "event") {
                let Z = Array.isArray(B) ? B[1] : void 0;
                if (Z) ja2.stripMetadataFromStackFrames(Z), B[1] = Z
              }
            })
          })
        },
        processEvent(A, Q, B) {
          let G = B.getOptions().stackParser;
          return ja2.addMetadataToStackFrames(G, A), A
        }
      }
    },
    ka2 = Sa2.defineIntegration(bY3),
    fY3 = Sa2.convertIntegrationFnToClass(_a2, ka2);
  ya2.ModuleMetadata = fY3;
  ya2.moduleMetadataIntegration = ka2
})
// @from(Start 12636764, End 12639397)
ua2 = z((ga2) => {
  Object.defineProperty(ga2, "__esModule", {
    value: !0
  });
  var va2 = i0(),
    ba2 = Cg(),
    uY3 = E$(),
    DY0 = {
      include: {
        cookies: !0,
        data: !0,
        headers: !0,
        ip: !1,
        query_string: !0,
        url: !0,
        user: {
          id: !0,
          username: !0,
          email: !0
        }
      },
      transactionNamingScheme: "methodPath"
    },
    fa2 = "RequestData",
    mY3 = (A = {}) => {
      let Q = va2.addRequestDataToEvent,
        B = {
          ...DY0,
          ...A,
          include: {
            method: !0,
            ...DY0.include,
            ...A.include,
            user: A.include && typeof A.include.user === "boolean" ? A.include.user : {
              ...DY0.include.user,
              ...(A.include || {}).user
            }
          }
        };
      return {
        name: fa2,
        setupOnce() {},
        processEvent(G, Z, I) {
          let {
            transactionNamingScheme: Y
          } = B, {
            sdkProcessingMetadata: J = {}
          } = G, W = J.request;
          if (!W) return G;
          let X = J.requestDataOptionsFromExpressHandler || J.requestDataOptionsFromGCPWrapper || cY3(B),
            V = Q(G, W, X);
          if (G.type === "transaction" || Y === "handler") return V;
          let K = W._sentryTransaction;
          if (K) {
            let D = uY3.spanToJSON(K).description || "",
              H = pY3(I) === "sentry.javascript.nextjs" ? D.startsWith("/api") : Y !== "path",
              [C] = va2.extractPathForTransaction(W, {
                path: !0,
                method: H,
                customRoute: D
              });
            V.transaction = C
          }
          return V
        }
      }
    },
    ha2 = ba2.defineIntegration(mY3),
    dY3 = ba2.convertIntegrationFnToClass(fa2, ha2);

  function cY3(A) {
    let {
      transactionNamingScheme: Q,
      include: {
        ip: B,
        user: G,
        ...Z
      }
    } = A, I = [];
    for (let [J, W] of Object.entries(Z))
      if (W) I.push(J);
    let Y;
    if (G === void 0) Y = !0;
    else if (typeof G === "boolean") Y = G;
    else {
      let J = [];
      for (let [W, X] of Object.entries(G))
        if (X) J.push(W);
      Y = J
    }
    return {
      include: {
        ip: B,
        user: Y,
        request: I.length !== 0 ? I : void 0,
        transaction: Q
      }
    }
  }

  function pY3(A) {
    try {
      return A.getOptions()._metadata.sdk.name
    } catch (Q) {
      return
    }
  }
  ga2.RequestData = dY3;
  ga2.requestDataIntegration = ha2
})
// @from(Start 12639403, End 12643427)
HY0 = z((pa2) => {
  Object.defineProperty(pa2, "__esModule", {
    value: !0
  });
  var zK = i0(),
    t0A = ZV(),
    ma2 = Cg(),
    nY3 = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/, /^ResizeObserver loop completed with undelivered notifications.$/, /^Cannot redefine property: googletag$/],
    aY3 = [/^.*\/healthcheck$/, /^.*\/healthy$/, /^.*\/live$/, /^.*\/ready$/, /^.*\/heartbeat$/, /^.*\/health$/, /^.*\/healthz$/],
    da2 = "InboundFilters",
    sY3 = (A = {}) => {
      return {
        name: da2,
        setupOnce() {},
        processEvent(Q, B, G) {
          let Z = G.getOptions(),
            I = oY3(A, Z);
          return tY3(Q, I) ? null : Q
        }
      }
    },
    ca2 = ma2.defineIntegration(sY3),
    rY3 = ma2.convertIntegrationFnToClass(da2, ca2);

  function oY3(A = {}, Q = {}) {
    return {
      allowUrls: [...A.allowUrls || [], ...Q.allowUrls || []],
      denyUrls: [...A.denyUrls || [], ...Q.denyUrls || []],
      ignoreErrors: [...A.ignoreErrors || [], ...Q.ignoreErrors || [], ...A.disableErrorDefaults ? [] : nY3],
      ignoreTransactions: [...A.ignoreTransactions || [], ...Q.ignoreTransactions || [], ...A.disableTransactionDefaults ? [] : aY3],
      ignoreInternal: A.ignoreInternal !== void 0 ? A.ignoreInternal : !0
    }
  }

  function tY3(A, Q) {
    if (Q.ignoreInternal && ZJ3(A)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being internal Sentry Error.
Event: ${zK.getEventDescription(A)}`), !0;
    if (eY3(A, Q.ignoreErrors)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${zK.getEventDescription(A)}`), !0;
    if (AJ3(A, Q.ignoreTransactions)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${zK.getEventDescription(A)}`), !0;
    if (QJ3(A, Q.denyUrls)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to being matched by \`denyUrls\` option.
Event: ${zK.getEventDescription(A)}.
Url: ${wG1(A)}`), !0;
    if (!BJ3(A, Q.allowUrls)) return t0A.DEBUG_BUILD && zK.logger.warn(`Event dropped due to not being matched by \`allowUrls\` option.
Event: ${zK.getEventDescription(A)}.
Url: ${wG1(A)}`), !0;
    return !1
  }

  function eY3(A, Q) {
    if (A.type || !Q || !Q.length) return !1;
    return GJ3(A).some((B) => zK.stringMatchesSomePattern(B, Q))
  }

  function AJ3(A, Q) {
    if (A.type !== "transaction" || !Q || !Q.length) return !1;
    let B = A.transaction;
    return B ? zK.stringMatchesSomePattern(B, Q) : !1
  }

  function QJ3(A, Q) {
    if (!Q || !Q.length) return !1;
    let B = wG1(A);
    return !B ? !1 : zK.stringMatchesSomePattern(B, Q)
  }

  function BJ3(A, Q) {
    if (!Q || !Q.length) return !0;
    let B = wG1(A);
    return !B ? !0 : zK.stringMatchesSomePattern(B, Q)
  }

  function GJ3(A) {
    let Q = [];
    if (A.message) Q.push(A.message);
    let B;
    try {
      B = A.exception.values[A.exception.values.length - 1]
    } catch (G) {}
    if (B) {
      if (B.value) {
        if (Q.push(B.value), B.type) Q.push(`${B.type}: ${B.value}`)
      }
    }
    if (t0A.DEBUG_BUILD && Q.length === 0) zK.logger.error(`Could not extract message for event ${zK.getEventDescription(A)}`);
    return Q
  }

  function ZJ3(A) {
    try {
      return A.exception.values[0].type === "SentryError"
    } catch (Q) {}
    return !1
  }

  function IJ3(A = []) {
    for (let Q = A.length - 1; Q >= 0; Q--) {
      let B = A[Q];
      if (B && B.filename !== "<anonymous>" && B.filename !== "[native code]") return B.filename || null
    }
    return null
  }

  function wG1(A) {
    try {
      let Q;
      try {
        Q = A.exception.values[0].stacktrace.frames
      } catch (B) {}
      return Q ? IJ3(Q) : null
    } catch (Q) {
      return t0A.DEBUG_BUILD && zK.logger.error(`Cannot extract url for event ${zK.getEventDescription(A)}`), null
    }
  }
  pa2.InboundFilters = rY3;
  pa2.inboundFiltersIntegration = ca2
})
// @from(Start 12643433, End 12644264)
CY0 = z((ra2) => {
  Object.defineProperty(ra2, "__esModule", {
    value: !0
  });
  var WJ3 = i0(),
    XJ3 = jO(),
    na2 = Cg(),
    la2, aa2 = "FunctionToString",
    ia2 = new WeakMap,
    VJ3 = () => {
      return {
        name: aa2,
        setupOnce() {
          la2 = Function.prototype.toString;
          try {
            Function.prototype.toString = function(...A) {
              let Q = WJ3.getOriginalFunction(this),
                B = ia2.has(XJ3.getClient()) && Q !== void 0 ? Q : this;
              return la2.apply(B, A)
            }
          } catch (A) {}
        },
        setup(A) {
          ia2.set(A, !0)
        }
      }
    },
    sa2 = na2.defineIntegration(VJ3),
    FJ3 = na2.convertIntegrationFnToClass(aa2, sa2);
  ra2.FunctionToString = FJ3;
  ra2.functionToStringIntegration = sa2
})
// @from(Start 12644270, End 12644944)
EY0 = z((Qs2) => {
  Object.defineProperty(Qs2, "__esModule", {
    value: !0
  });
  var oa2 = i0(),
    ta2 = Cg(),
    HJ3 = "cause",
    CJ3 = 5,
    ea2 = "LinkedErrors",
    EJ3 = (A = {}) => {
      let Q = A.limit || CJ3,
        B = A.key || HJ3;
      return {
        name: ea2,
        setupOnce() {},
        preprocessEvent(G, Z, I) {
          let Y = I.getOptions();
          oa2.applyAggregateErrorsToEvent(oa2.exceptionFromError, Y.stackParser, Y.maxValueLength, B, Q, G, Z)
        }
      }
    },
    As2 = ta2.defineIntegration(EJ3),
    zJ3 = ta2.convertIntegrationFnToClass(ea2, As2);
  Qs2.LinkedErrors = zJ3;
  Qs2.linkedErrorsIntegration = As2
})
// @from(Start 12644950, End 12645217)
Gs2 = z((Bs2) => {
  Object.defineProperty(Bs2, "__esModule", {
    value: !0
  });
  var wJ3 = CY0(),
    qJ3 = HY0(),
    NJ3 = EY0();
  Bs2.FunctionToString = wJ3.FunctionToString;
  Bs2.InboundFilters = qJ3.InboundFilters;
  Bs2.LinkedErrors = NJ3.LinkedErrors
})
// @from(Start 12645223, End 12646680)
Js2 = z((Ys2) => {
  Object.defineProperty(Ys2, "__esModule", {
    value: !0
  });
  var RJ3 = i0(),
    Zs2 = NPA(),
    TJ3 = YY0(),
    PJ3 = UPA(),
    qG1 = qPA();
  class Is2 {
    constructor(A) {
      this._client = A, this._buckets = new Map, this._interval = setInterval(() => this.flush(), Zs2.DEFAULT_BROWSER_FLUSH_INTERVAL)
    }
    add(A, Q, B, G = "none", Z = {}, I = RJ3.timestampInSeconds()) {
      let Y = Math.floor(I),
        J = qG1.sanitizeMetricKey(Q),
        W = qG1.sanitizeTags(Z),
        X = qG1.sanitizeUnit(G),
        V = qG1.getBucketKey(A, J, X, W),
        F = this._buckets.get(V),
        K = F && A === Zs2.SET_METRIC_TYPE ? F.metric.weight : 0;
      if (F) {
        if (F.metric.add(B), F.timestamp < Y) F.timestamp = Y
      } else F = {
        metric: new TJ3.METRIC_MAP[A](B),
        timestamp: Y,
        metricType: A,
        name: J,
        unit: X,
        tags: W
      }, this._buckets.set(V, F);
      let D = typeof B === "string" ? F.metric.weight - K : B;
      PJ3.updateMetricSummaryOnActiveSpan(A, J, D, X, Z, V)
    }
    flush() {
      if (this._buckets.size === 0) return;
      if (this._client.captureAggregateMetrics) {
        let A = Array.from(this._buckets).map(([, Q]) => Q);
        this._client.captureAggregateMetrics(A)
      }
      this._buckets.clear()
    }
    close() {
      clearInterval(this._interval), this.flush()
    }
  }
  Ys2.BrowserMetricsAggregator = Is2
})
// @from(Start 12646686, End 12647189)
Ks2 = z((Fs2) => {
  Object.defineProperty(Fs2, "__esModule", {
    value: !0
  });
  var Ws2 = Cg(),
    SJ3 = Js2(),
    Xs2 = "MetricsAggregator",
    _J3 = () => {
      return {
        name: Xs2,
        setupOnce() {},
        setup(A) {
          A.metricsAggregator = new SJ3.BrowserMetricsAggregator(A)
        }
      }
    },
    Vs2 = Ws2.defineIntegration(_J3),
    kJ3 = Ws2.convertIntegrationFnToClass(Xs2, Vs2);
  Fs2.MetricsAggregator = kJ3;
  Fs2.metricsAggregatorIntegration = Vs2
})
// @from(Start 12647195, End 12648777)
Ns2 = z((qs2) => {
  Object.defineProperty(qs2, "__esModule", {
    value: !0
  });
  var Ds2 = i0(),
    Hs2 = ZV(),
    Cs2 = jO(),
    vJ3 = E$(),
    NG1 = NPA(),
    Es2 = Ks2();

  function LG1(A, Q, B, G = {}) {
    let Z = Cs2.getClient(),
      I = Cs2.getCurrentScope();
    if (Z) {
      if (!Z.metricsAggregator) {
        Hs2.DEBUG_BUILD && Ds2.logger.warn("No metrics aggregator enabled. Please add the MetricsAggregator integration to use metrics APIs");
        return
      }
      let {
        unit: Y,
        tags: J,
        timestamp: W
      } = G, {
        release: X,
        environment: V
      } = Z.getOptions(), F = I.getTransaction(), K = {};
      if (X) K.release = X;
      if (V) K.environment = V;
      if (F) K.transaction = vJ3.spanToJSON(F).description || "";
      Hs2.DEBUG_BUILD && Ds2.logger.log(`Adding value of ${B} to ${A} metric ${Q}`), Z.metricsAggregator.add(A, Q, B, Y, {
        ...K,
        ...J
      }, W)
    }
  }

  function zs2(A, Q = 1, B) {
    LG1(NG1.COUNTER_METRIC_TYPE, A, Q, B)
  }

  function Us2(A, Q, B) {
    LG1(NG1.DISTRIBUTION_METRIC_TYPE, A, Q, B)
  }

  function $s2(A, Q, B) {
    LG1(NG1.SET_METRIC_TYPE, A, Q, B)
  }

  function ws2(A, Q, B) {
    LG1(NG1.GAUGE_METRIC_TYPE, A, Q, B)
  }
  var bJ3 = {
    increment: zs2,
    distribution: Us2,
    set: $s2,
    gauge: ws2,
    MetricsAggregator: Es2.MetricsAggregator,
    metricsAggregatorIntegration: Es2.metricsAggregatorIntegration
  };
  qs2.distribution = Us2;
  qs2.gauge = ws2;
  qs2.increment = zs2;
  qs2.metrics = bJ3;
  qs2.set = $s2
})
// @from(Start 12648783, End 12655239)
_4 = z(($Y0) => {
  Object.defineProperty($Y0, "__esModule", {
    value: !0
  });
  var Ls2 = nI0(),
    Ms2 = lI0(),
    dJ3 = JG1(),
    cJ3 = VG1(),
    Os2 = AG1(),
    MG1 = KXA(),
    e0A = YG1(),
    Rs2 = a0A(),
    pJ3 = Ln2(),
    lJ3 = iI0(),
    MPA = $PA(),
    Ts2 = aI0(),
    sZ = jO(),
    ny = py(),
    zY0 = WXA(),
    iJ3 = sI0(),
    UY0 = a71(),
    Ps2 = VPA(),
    js2 = HG1(),
    Ss2 = eI0(),
    nJ3 = tn2(),
    _s2 = Ba2(),
    aJ3 = Ja2(),
    sJ3 = Va2(),
    rJ3 = Ka2(),
    oJ3 = o71(),
    OG1 = Cg(),
    ks2 = n71(),
    tJ3 = i71(),
    eJ3 = QY0(),
    AW3 = Ca2(),
    QW3 = BG1(),
    BW3 = Ua2(),
    GW3 = mI0(),
    ZW3 = wa2(),
    RG1 = E$(),
    IW3 = XXA(),
    YW3 = La2(),
    JW3 = JXA(),
    ys2 = xa2(),
    xs2 = ua2(),
    vs2 = HY0(),
    bs2 = CY0(),
    fs2 = EY0(),
    WW3 = Gs2(),
    XW3 = Ns2(),
    VW3 = WW3;
  $Y0.addTracingExtensions = Ls2.addTracingExtensions;
  $Y0.startIdleTransaction = Ls2.startIdleTransaction;
  $Y0.IdleTransaction = Ms2.IdleTransaction;
  $Y0.TRACING_DEFAULTS = Ms2.TRACING_DEFAULTS;
  $Y0.Span = dJ3.Span;
  $Y0.Transaction = cJ3.Transaction;
  $Y0.extractTraceparentData = Os2.extractTraceparentData;
  $Y0.getActiveTransaction = Os2.getActiveTransaction;
  Object.defineProperty($Y0, "SpanStatus", {
    enumerable: !0,
    get: () => MG1.SpanStatus
  });
  $Y0.getSpanStatusFromHttpCode = MG1.getSpanStatusFromHttpCode;
  $Y0.setHttpStatus = MG1.setHttpStatus;
  $Y0.spanStatusfromHttpCode = MG1.spanStatusfromHttpCode;
  $Y0.continueTrace = e0A.continueTrace;
  $Y0.getActiveSpan = e0A.getActiveSpan;
  $Y0.startActiveSpan = e0A.startActiveSpan;
  $Y0.startInactiveSpan = e0A.startInactiveSpan;
  $Y0.startSpan = e0A.startSpan;
  $Y0.startSpanManual = e0A.startSpanManual;
  $Y0.trace = e0A.trace;
  $Y0.getDynamicSamplingContextFromClient = Rs2.getDynamicSamplingContextFromClient;
  $Y0.getDynamicSamplingContextFromSpan = Rs2.getDynamicSamplingContextFromSpan;
  $Y0.setMeasurement = pJ3.setMeasurement;
  $Y0.isValidSampleRate = lJ3.isValidSampleRate;
  $Y0.SEMANTIC_ATTRIBUTE_PROFILE_ID = MPA.SEMANTIC_ATTRIBUTE_PROFILE_ID;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_OP = MPA.SEMANTIC_ATTRIBUTE_SENTRY_OP;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = MPA.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = MPA.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
  $Y0.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = MPA.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
  $Y0.createEventEnvelope = Ts2.createEventEnvelope;
  $Y0.createSessionEnvelope = Ts2.createSessionEnvelope;
  $Y0.addBreadcrumb = sZ.addBreadcrumb;
  $Y0.captureCheckIn = sZ.captureCheckIn;
  $Y0.captureEvent = sZ.captureEvent;
  $Y0.captureException = sZ.captureException;
  $Y0.captureMessage = sZ.captureMessage;
  $Y0.captureSession = sZ.captureSession;
  $Y0.close = sZ.close;
  $Y0.configureScope = sZ.configureScope;
  $Y0.endSession = sZ.endSession;
  $Y0.flush = sZ.flush;
  $Y0.getClient = sZ.getClient;
  $Y0.getCurrentScope = sZ.getCurrentScope;
  $Y0.isInitialized = sZ.isInitialized;
  $Y0.lastEventId = sZ.lastEventId;
  $Y0.setContext = sZ.setContext;
  $Y0.setExtra = sZ.setExtra;
  $Y0.setExtras = sZ.setExtras;
  $Y0.setTag = sZ.setTag;
  $Y0.setTags = sZ.setTags;
  $Y0.setUser = sZ.setUser;
  $Y0.startSession = sZ.startSession;
  $Y0.startTransaction = sZ.startTransaction;
  $Y0.withActiveSpan = sZ.withActiveSpan;
  $Y0.withIsolationScope = sZ.withIsolationScope;
  $Y0.withMonitor = sZ.withMonitor;
  $Y0.withScope = sZ.withScope;
  $Y0.Hub = ny.Hub;
  $Y0.ensureHubOnCarrier = ny.ensureHubOnCarrier;
  $Y0.getCurrentHub = ny.getCurrentHub;
  $Y0.getHubFromCarrier = ny.getHubFromCarrier;
  $Y0.getIsolationScope = ny.getIsolationScope;
  $Y0.getMainCarrier = ny.getMainCarrier;
  $Y0.makeMain = ny.makeMain;
  $Y0.runWithAsyncContext = ny.runWithAsyncContext;
  $Y0.setAsyncContextStrategy = ny.setAsyncContextStrategy;
  $Y0.setHubOnCarrier = ny.setHubOnCarrier;
  $Y0.closeSession = zY0.closeSession;
  $Y0.makeSession = zY0.makeSession;
  $Y0.updateSession = zY0.updateSession;
  $Y0.SessionFlusher = iJ3.SessionFlusher;
  $Y0.Scope = UY0.Scope;
  $Y0.getGlobalScope = UY0.getGlobalScope;
  $Y0.setGlobalScope = UY0.setGlobalScope;
  $Y0.addGlobalEventProcessor = Ps2.addGlobalEventProcessor;
  $Y0.notifyEventProcessors = Ps2.notifyEventProcessors;
  $Y0.getEnvelopeEndpointWithUrlEncodedAuth = js2.getEnvelopeEndpointWithUrlEncodedAuth;
  $Y0.getReportDialogEndpoint = js2.getReportDialogEndpoint;
  $Y0.BaseClient = Ss2.BaseClient;
  $Y0.addEventProcessor = Ss2.addEventProcessor;
  $Y0.ServerRuntimeClient = nJ3.ServerRuntimeClient;
  $Y0.initAndBind = _s2.initAndBind;
  $Y0.setCurrentClient = _s2.setCurrentClient;
  $Y0.createTransport = aJ3.createTransport;
  $Y0.makeOfflineTransport = sJ3.makeOfflineTransport;
  $Y0.makeMultiplexedTransport = rJ3.makeMultiplexedTransport;
  $Y0.SDK_VERSION = oJ3.SDK_VERSION;
  $Y0.addIntegration = OG1.addIntegration;
  $Y0.convertIntegrationFnToClass = OG1.convertIntegrationFnToClass;
  $Y0.defineIntegration = OG1.defineIntegration;
  $Y0.getIntegrationsToSetup = OG1.getIntegrationsToSetup;
  $Y0.applyScopeDataToEvent = ks2.applyScopeDataToEvent;
  $Y0.mergeScopeData = ks2.mergeScopeData;
  $Y0.prepareEvent = tJ3.prepareEvent;
  $Y0.createCheckInEnvelope = eJ3.createCheckInEnvelope;
  $Y0.createSpanEnvelope = AW3.createSpanEnvelope;
  $Y0.hasTracingEnabled = QW3.hasTracingEnabled;
  $Y0.isSentryRequestUrl = BW3.isSentryRequestUrl;
  $Y0.handleCallbackErrors = GW3.handleCallbackErrors;
  $Y0.parameterize = ZW3.parameterize;
  $Y0.spanIsSampled = RG1.spanIsSampled;
  $Y0.spanToJSON = RG1.spanToJSON;
  $Y0.spanToTraceContext = RG1.spanToTraceContext;
  $Y0.spanToTraceHeader = RG1.spanToTraceHeader;
  $Y0.getRootSpan = IW3.getRootSpan;
  $Y0.applySdkMetadata = YW3.applySdkMetadata;
  $Y0.DEFAULT_ENVIRONMENT = JW3.DEFAULT_ENVIRONMENT;
  $Y0.ModuleMetadata = ys2.ModuleMetadata;
  $Y0.moduleMetadataIntegration = ys2.moduleMetadataIntegration;
  $Y0.RequestData = xs2.RequestData;
  $Y0.requestDataIntegration = xs2.requestDataIntegration;
  $Y0.InboundFilters = vs2.InboundFilters;
  $Y0.inboundFiltersIntegration = vs2.inboundFiltersIntegration;
  $Y0.FunctionToString = bs2.FunctionToString;
  $Y0.functionToStringIntegration = bs2.functionToStringIntegration;
  $Y0.LinkedErrors = fs2.LinkedErrors;
  $Y0.linkedErrorsIntegration = fs2.linkedErrorsIntegration;
  $Y0.metrics = XW3.metrics;
  $Y0.Integrations = VW3
})
// @from(Start 12655245, End 12655417)
$$ = z((hs2) => {
  Object.defineProperty(hs2, "__esModule", {
    value: !0
  });
  var wV3 = typeof __SENTRY_DEBUG__ > "u" || __SENTRY_DEBUG__;
  hs2.DEBUG_BUILD = wV3
})
// @from(Start 12655423, End 12655861)
tn = z((us2) => {
  var {
    _optionalChain: gs2
  } = i0();
  Object.defineProperty(us2, "__esModule", {
    value: !0
  });

  function NV3(A) {
    let Q = gs2([A, "call", (G) => G(), "access", (G) => G.getClient, "call", (G) => G(), "optionalAccess", (G) => G.getOptions, "call", (G) => G()]);
    return (gs2([Q, "optionalAccess", (G) => G.instrumenter]) || "sentry") !== "sentry"
  }
  us2.shouldDisableAutoInstrumentation = NV3
})
// @from(Start 12655867, End 12662968)
ls2 = z((ps2) => {
  var {
    _optionalChain: lP
  } = i0();
  Object.defineProperty(ps2, "__esModule", {
    value: !0
  });
  var wY0 = _4(),
    w$ = i0(),
    TG1 = $$(),
    MV3 = tn();
  class PG1 {
    static __initStatic() {
      this.id = "Express"
    }
    constructor(A = {}) {
      this.name = PG1.id, this._router = A.router || A.app, this._methods = (Array.isArray(A.methods) ? A.methods : []).concat("use")
    }
    setupOnce(A, Q) {
      if (!this._router) {
        TG1.DEBUG_BUILD && w$.logger.error("ExpressIntegration is missing an Express instance");
        return
      }
      if (MV3.shouldDisableAutoInstrumentation(Q)) {
        TG1.DEBUG_BUILD && w$.logger.log("Express Integration is skipped because of instrumenter configuration.");
        return
      }
      TV3(this._router, this._methods), PV3(this._router)
    }
  }
  PG1.__initStatic();

  function ms2(A, Q) {
    let B = A.length;
    switch (B) {
      case 2:
        return function(G, Z) {
          let I = Z.__sentry_transaction;
          if (I) {
            let Y = I.startChild({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            });
            Z.once("finish", () => {
              Y.end()
            })
          }
          return A.call(this, G, Z)
        };
      case 3:
        return function(G, Z, I) {
          let Y = Z.__sentry_transaction,
            J = lP([Y, "optionalAccess", (W) => W.startChild, "call", (W) => W({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            })]);
          A.call(this, G, Z, function(...W) {
            lP([J, "optionalAccess", (X) => X.end, "call", (X) => X()]), I.call(this, ...W)
          })
        };
      case 4:
        return function(G, Z, I, Y) {
          let J = I.__sentry_transaction,
            W = lP([J, "optionalAccess", (X) => X.startChild, "call", (X) => X({
              description: A.name,
              op: `middleware.express.${Q}`,
              origin: "auto.middleware.express"
            })]);
          A.call(this, G, Z, I, function(...X) {
            lP([W, "optionalAccess", (V) => V.end, "call", (V) => V()]), Y.call(this, ...X)
          })
        };
      default:
        throw Error(`Express middleware takes 2-4 arguments. Got: ${B}`)
    }
  }

  function OV3(A, Q) {
    return A.map((B) => {
      if (typeof B === "function") return ms2(B, Q);
      if (Array.isArray(B)) return B.map((G) => {
        if (typeof G === "function") return ms2(G, Q);
        return G
      });
      return B
    })
  }

  function RV3(A, Q) {
    let B = A[Q];
    return A[Q] = function(...G) {
      return B.call(this, ...OV3(G, Q))
    }, A
  }

  function TV3(A, Q = []) {
    Q.forEach((B) => RV3(A, B))
  }

  function PV3(A) {
    let Q = "settings" in A;
    if (Q && A._router === void 0 && A.lazyrouter) A.lazyrouter();
    let B = Q ? A._router : A;
    if (!B) {
      TG1.DEBUG_BUILD && w$.logger.debug("Cannot instrument router for URL Parameterization (did not find a valid router)."), TG1.DEBUG_BUILD && w$.logger.debug("Routing instrumentation is currently only supported in Express 4.");
      return
    }
    let G = Object.getPrototypeOf(B),
      Z = G.process_params;
    G.process_params = function(Y, J, W, X, V) {
      if (!W._reconstructedRoute) W._reconstructedRoute = "";
      let {
        layerRoutePath: F,
        isRegex: K,
        isArray: D,
        numExtraSegments: H
      } = jV3(Y);
      if (F || K || D) W._hasParameters = !0;
      let C;
      if (F) C = F;
      else C = cs2(W.originalUrl, W._reconstructedRoute, Y.path) || "";
      let E = C.split("/").filter((w) => w.length > 0 && (K || D || !w.includes("*"))).join("/");
      if (E && E.length > 0) W._reconstructedRoute += `/${E}${K?"/":""}`;
      let U = w$.getNumberOfUrlSegments(w$.stripUrlQueryAndFragment(W.originalUrl || "")) + H,
        q = w$.getNumberOfUrlSegments(W._reconstructedRoute);
      if (U === q) {
        if (!W._hasParameters) {
          if (W._reconstructedRoute !== W.originalUrl) W._reconstructedRoute = W.originalUrl ? w$.stripUrlQueryAndFragment(W.originalUrl) : W.originalUrl
        }
        let w = X.__sentry_transaction,
          N = w && wY0.spanToJSON(w).data || {};
        if (w && N[wY0.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] !== "custom") {
          let R = W._reconstructedRoute || "/",
            [T, y] = w$.extractPathForTransaction(W, {
              path: !0,
              method: !0,
              customRoute: R
            });
          w.updateName(T), w.setAttribute(wY0.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, y)
        }
      }
      return Z.call(this, Y, J, W, X, V)
    }
  }
  var ds2 = (A, Q, B) => {
    if (!A || !Q || !B || Object.keys(B).length === 0 || lP([B, "access", (X) => X[0], "optionalAccess", (X) => X.offset]) === void 0 || lP([B, "access", (X) => X[0], "optionalAccess", (X) => X.offset]) === null) return;
    let G = B.sort((X, V) => X.offset - V.offset),
      I = new RegExp(Q, `${Q.flags}d`).exec(A);
    if (!I || !I.indices) return;
    let [, ...Y] = I.indices;
    if (Y.length !== G.length) return;
    let J = A,
      W = 0;
    return Y.forEach((X, V) => {
      if (X) {
        let [F, K] = X, D = J.substring(0, F - W), H = `:${G[V].name}`, C = J.substring(K - W);
        J = D + H + C, W = W + (K - F - H.length)
      }
    }), J
  };

  function jV3(A) {
    let Q = lP([A, "access", (Y) => Y.route, "optionalAccess", (Y) => Y.path]),
      B = w$.isRegExp(Q),
      G = Array.isArray(Q);
    if (!Q) {
      let [Y] = w$.GLOBAL_OBJ.process.versions.node.split(".").map(Number);
      if (Y >= 16) Q = ds2(A.path, A.regexp, A.keys)
    }
    if (!Q) return {
      isRegex: B,
      isArray: G,
      numExtraSegments: 0
    };
    let Z = G ? Math.max(SV3(Q) - w$.getNumberOfUrlSegments(A.path || ""), 0) : 0;
    return {
      layerRoutePath: _V3(G, Q),
      isRegex: B,
      isArray: G,
      numExtraSegments: Z
    }
  }

  function SV3(A) {
    return A.reduce((Q, B) => {
      return Q + w$.getNumberOfUrlSegments(B.toString())
    }, 0)
  }

  function _V3(A, Q) {
    if (A) return Q.map((B) => B.toString()).join(",");
    return Q && Q.toString()
  }

  function cs2(A, Q, B) {
    let G = w$.stripUrlQueryAndFragment(A || ""),
      Z = lP([G, "optionalAccess", (W) => W.split, "call", (W) => W("/"), "access", (W) => W.filter, "call", (W) => W((X) => !!X)]),
      I = 0,
      Y = lP([Q, "optionalAccess", (W) => W.split, "call", (W) => W("/"), "access", (W) => W.filter, "call", (W) => W((X) => !!X), "access", (W) => W.length]) || 0;
    return lP([B, "optionalAccess", (W) => W.split, "call", (W) => W("/"), "access", (W) => W.filter, "call", (W) => W((X) => {
      if (lP([Z, "optionalAccess", (V) => V[Y + I]]) === X) return I += 1, !0;
      return !1
    }), "access", (W) => W.join, "call", (W) => W("/")])
  }
  ps2.Express = PG1;
  ps2.extractOriginalRoute = ds2;
  ps2.preventDuplicateSegments = cs2
})
// @from(Start 12662974, End 12665555)
ns2 = z((is2) => {
  var {
    _optionalChain: $XA
  } = i0();
  Object.defineProperty(is2, "__esModule", {
    value: !0
  });
  var wXA = i0(),
    qY0 = $$(),
    vV3 = tn();
  class jG1 {
    static __initStatic() {
      this.id = "Postgres"
    }
    constructor(A = {}) {
      this.name = jG1.id, this._usePgNative = !!A.usePgNative, this._module = A.module
    }
    loadDependency() {
      return this._module = this._module || wXA.loadModule("pg")
    }
    setupOnce(A, Q) {
      if (vV3.shouldDisableAutoInstrumentation(Q)) {
        qY0.DEBUG_BUILD && wXA.logger.log("Postgres Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        qY0.DEBUG_BUILD && wXA.logger.error("Postgres Integration was unable to require `pg` package.");
        return
      }
      let G = this._usePgNative ? $XA([B, "access", (Z) => Z.native, "optionalAccess", (Z) => Z.Client]) : B.Client;
      if (!G) {
        qY0.DEBUG_BUILD && wXA.logger.error("Postgres Integration was unable to access 'pg-native' bindings.");
        return
      }
      wXA.fill(G.prototype, "query", function(Z) {
        return function(I, Y, J) {
          let X = Q().getScope().getSpan(),
            V = {
              "db.system": "postgresql"
            };
          try {
            if (this.database) V["db.name"] = this.database;
            if (this.host) V["server.address"] = this.host;
            if (this.port) V["server.port"] = this.port;
            if (this.user) V["db.user"] = this.user
          } catch (D) {}
          let F = $XA([X, "optionalAccess", (D) => D.startChild, "call", (D) => D({
            description: typeof I === "string" ? I : I.text,
            op: "db",
            origin: "auto.db.postgres",
            data: V
          })]);
          if (typeof J === "function") return Z.call(this, I, Y, function(D, H) {
            $XA([F, "optionalAccess", (C) => C.end, "call", (C) => C()]), J(D, H)
          });
          if (typeof Y === "function") return Z.call(this, I, function(D, H) {
            $XA([F, "optionalAccess", (C) => C.end, "call", (C) => C()]), Y(D, H)
          });
          let K = typeof Y < "u" ? Z.call(this, I, Y) : Z.call(this, I);
          if (wXA.isThenable(K)) return K.then((D) => {
            return $XA([F, "optionalAccess", (H) => H.end, "call", (H) => H()]), D
          });
          return $XA([F, "optionalAccess", (D) => D.end, "call", (D) => D()]), K
        }
      })
    }
  }
  jG1.__initStatic();
  is2.Postgres = jG1
})
// @from(Start 12665561, End 12667927)
ss2 = z((as2) => {
  var {
    _optionalChain: fV3
  } = i0();
  Object.defineProperty(as2, "__esModule", {
    value: !0
  });
  var OPA = i0(),
    NY0 = $$(),
    hV3 = tn();
  class SG1 {
    static __initStatic() {
      this.id = "Mysql"
    }
    constructor() {
      this.name = SG1.id
    }
    loadDependency() {
      return this._module = this._module || OPA.loadModule("mysql/lib/Connection.js")
    }
    setupOnce(A, Q) {
      if (hV3.shouldDisableAutoInstrumentation(Q)) {
        NY0.DEBUG_BUILD && OPA.logger.log("Mysql Integration is skipped because of instrumenter configuration.");
        return
      }
      let B = this.loadDependency();
      if (!B) {
        NY0.DEBUG_BUILD && OPA.logger.error("Mysql Integration was unable to require `mysql` package.");
        return
      }
      let G = void 0;
      try {
        B.prototype.connect = new Proxy(B.prototype.connect, {
          apply(Y, J, W) {
            if (!G) G = J.config;
            return Y.apply(J, W)
          }
        })
      } catch (Y) {
        NY0.DEBUG_BUILD && OPA.logger.error("Mysql Integration was unable to instrument `mysql` config.")
      }

      function Z() {
        if (!G) return {};
        return {
          "server.address": G.host,
          "server.port": G.port,
          "db.user": G.user
        }
      }

      function I(Y) {
        if (!Y) return;
        let J = Z();
        Object.keys(J).forEach((W) => {
          Y.setAttribute(W, J[W])
        }), Y.end()
      }
      OPA.fill(B, "createQuery", function(Y) {
        return function(J, W, X) {
          let F = Q().getScope().getSpan(),
            K = fV3([F, "optionalAccess", (H) => H.startChild, "call", (H) => H({
              description: typeof J === "string" ? J : J.sql,
              op: "db",
              origin: "auto.db.mysql",
              data: {
                "db.system": "mysql"
              }
            })]);
          if (typeof X === "function") return Y.call(this, J, W, function(H, C, E) {
            I(K), X(H, C, E)
          });
          if (typeof W === "function") return Y.call(this, J, function(H, C, E) {
            I(K), W(H, C, E)
          });
          let D = Y.call(this, J, W);
          return D.on("end", () => {
            I(K)
          }), D
        }
      })
    }
  }
  SG1.__initStatic();
  as2.Mysql = SG1
})