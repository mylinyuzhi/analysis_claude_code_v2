
// @from(Ln 302374, Col 4)
hE4 = R((CNA) => {
    Object.defineProperty(CNA, "__esModule", {
        value: !0
    });
    CNA.OTLPLogExporter = void 0;
    var UDY = SE4();
    Object.defineProperty(CNA, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return UDY.OTLPLogExporter
        }
    })
})
// @from(Ln 302387, Col 4)
bE4 = R((IE4) => {
    Object.defineProperty(IE4, "__esModule", {
        value: !0
    });
    IE4.ExceptionEventName = void 0;
    IE4.ExceptionEventName = "exception"
})
// @from(Ln 302394, Col 4)
FE4 = R((BE4) => {
    Object.defineProperty(BE4, "__esModule", {
        value: !0
    });
    BE4.SpanImpl = void 0;
    var QR = Fq(),
        pW = G9(),
        F31 = q31(),
        dDY = bE4();
    class uE4 {
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
            code: QR.SpanStatusCode.UNSET
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
            let q = Date.now();
            if (this._spanContext = A.spanContext, this._performanceStartTime = pW.otperformance.now(), this._performanceOffset = q - (this._performanceStartTime + (0, pW.getTimeOrigin)()), this._startTimeProvided = A.startTime != null, this._spanLimits = A.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = A.spanProcessor, this.name = A.name, this.parentSpanContext = A.parentSpanContext, this.kind = A.kind, this.links = A.links || [], this.startTime = this._getTime(A.startTime ?? q), this.resource = A.resource, this.instrumentationScope = A.scope, A.attributes != null) this.setAttributes(A.attributes);
            this._spanProcessor.onStart(this, A.context)
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(A, q) {
            if (q == null || this._isSpanEnded()) return this;
            if (A.length === 0) return QR.diag.warn(`Invalid attribute key: ${A}`), this;
            if (!(0, pW.isAttributeValue)(q)) return QR.diag.warn(`Invalid attribute value set for key: ${A}`), this;
            let {
                attributeCountLimit: K
            } = this._spanLimits;
            if (K !== void 0 && Object.keys(this.attributes).length >= K && !Object.prototype.hasOwnProperty.call(this.attributes, A)) return this._droppedAttributesCount++, this;
            return this.attributes[A] = this._truncateToSize(q), this
        }
        setAttributes(A) {
            for (let [q, K] of Object.entries(A)) this.setAttribute(q, K);
            return this
        }
        addEvent(A, q, K) {
            if (this._isSpanEnded()) return this;
            let {
                eventCountLimit: Y
            } = this._spanLimits;
            if (Y === 0) return QR.diag.warn("No events allowed."), this._droppedEventsCount++, this;
            if (Y !== void 0 && this.events.length >= Y) {
                if (this._droppedEventsCount === 0) QR.diag.debug("Dropping extra events.");
                this.events.shift(), this._droppedEventsCount++
            }
            if ((0, pW.isTimeInput)(q)) {
                if (!(0, pW.isTimeInput)(K)) K = q;
                q = void 0
            }
            let z = (0, pW.sanitizeAttributes)(q);
            return this.events.push({
                name: A,
                attributes: z,
                time: this._getTime(K),
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
                }, this.status.message != null && typeof A.message !== "string") QR.diag.warn(`Dropping invalid status.message of type '${typeof A.message}', expected 'string'`), delete this.status.message;
            return this
        }
        updateName(A) {
            if (this._isSpanEnded()) return this;
            return this.name = A, this
        }
        end(A) {
            if (this._isSpanEnded()) {
                QR.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
                return
            }
            if (this._ended = !0, this.endTime = this._getTime(A), this._duration = (0, pW.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) QR.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
            if (this._droppedEventsCount > 0) QR.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
            this._spanProcessor.onEnd(this)
        }
        _getTime(A) {
            if (typeof A === "number" && A <= pW.otperformance.now()) return (0, pW.hrTime)(A + this._performanceOffset);
            if (typeof A === "number") return (0, pW.millisToHrTime)(A);
            if (A instanceof Date) return (0, pW.millisToHrTime)(A.getTime());
            if ((0, pW.isTimeInputHrTime)(A)) return A;
            if (this._startTimeProvided) return (0, pW.millisToHrTime)(Date.now());
            let q = pW.otperformance.now() - this._performanceStartTime;
            return (0, pW.addHrTimes)(this.startTime, (0, pW.millisToHrTime)(q))
        }
        isRecording() {
            return this._ended === !1
        }
        recordException(A, q) {
            let K = {};
            if (typeof A === "string") K[F31.ATTR_EXCEPTION_MESSAGE] = A;
            else if (A) {
                if (A.code) K[F31.ATTR_EXCEPTION_TYPE] = A.code.toString();
                else if (A.name) K[F31.ATTR_EXCEPTION_TYPE] = A.name;
                if (A.message) K[F31.ATTR_EXCEPTION_MESSAGE] = A.message;
                if (A.stack) K[F31.ATTR_EXCEPTION_STACKTRACE] = A.stack
            }
            if (K[F31.ATTR_EXCEPTION_TYPE] || K[F31.ATTR_EXCEPTION_MESSAGE]) this.addEvent(dDY.ExceptionEventName, K, q);
            else QR.diag.warn(`Failed to record an exception ${A}`)
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
                QR.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, A)
            }
            return this._ended
        }
        _truncateToLimitUtil(A, q) {
            if (A.length <= q) return A;
            return A.substring(0, q)
        }
        _truncateToSize(A) {
            let q = this._attributeValueLengthLimit;
            if (q <= 0) return QR.diag.warn(`Attribute value limit must be positive, got ${q}`), A;
            if (typeof A === "string") return this._truncateToLimitUtil(A, q);
            if (Array.isArray(A)) return A.map((K) => typeof K === "string" ? this._truncateToLimitUtil(K, q) : K);
            return A
        }
    }
    BE4.SpanImpl = uE4
})
// @from(Ln 302559, Col 4)
TF1 = R((QE4) => {
    Object.defineProperty(QE4, "__esModule", {
        value: !0
    });
    QE4.SamplingDecision = void 0;
    var cDY;
    (function(A) {
        A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    })(cDY = QE4.SamplingDecision || (QE4.SamplingDecision = {}))
})
// @from(Ln 302569, Col 4)
qj6 = R((UE4) => {
    Object.defineProperty(UE4, "__esModule", {
        value: !0
    });
    UE4.AlwaysOffSampler = void 0;
    var lDY = TF1();
    class gE4 {
        shouldSample() {
            return {
                decision: lDY.SamplingDecision.NOT_RECORD
            }
        }
        toString() {
            return "AlwaysOffSampler"
        }
    }
    UE4.AlwaysOffSampler = gE4
})
// @from(Ln 302587, Col 4)
Kj6 = R((cE4) => {
    Object.defineProperty(cE4, "__esModule", {
        value: !0
    });
    cE4.AlwaysOnSampler = void 0;
    var iDY = TF1();
    class dE4 {
        shouldSample() {
            return {
                decision: iDY.SamplingDecision.RECORD_AND_SAMPLED
            }
        }
        toString() {
            return "AlwaysOnSampler"
        }
    }
    cE4.AlwaysOnSampler = dE4
})
// @from(Ln 302605, Col 4)
INA = R((rE4) => {
    Object.defineProperty(rE4, "__esModule", {
        value: !0
    });
    rE4.ParentBasedSampler = void 0;
    var Yj6 = Fq(),
        nDY = G9(),
        iE4 = qj6(),
        hNA = Kj6();
    class nE4 {
        _root;
        _remoteParentSampled;
        _remoteParentNotSampled;
        _localParentSampled;
        _localParentNotSampled;
        constructor(A) {
            if (this._root = A.root, !this._root)(0, nDY.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new hNA.AlwaysOnSampler;
            this._remoteParentSampled = A.remoteParentSampled ?? new hNA.AlwaysOnSampler, this._remoteParentNotSampled = A.remoteParentNotSampled ?? new iE4.AlwaysOffSampler, this._localParentSampled = A.localParentSampled ?? new hNA.AlwaysOnSampler, this._localParentNotSampled = A.localParentNotSampled ?? new iE4.AlwaysOffSampler
        }
        shouldSample(A, q, K, Y, z, w) {
            let H = Yj6.trace.getSpanContext(A);
            if (!H || !(0, Yj6.isSpanContextValid)(H)) return this._root.shouldSample(A, q, K, Y, z, w);
            if (H.isRemote) {
                if (H.traceFlags & Yj6.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(A, q, K, Y, z, w);
                return this._remoteParentNotSampled.shouldSample(A, q, K, Y, z, w)
            }
            if (H.traceFlags & Yj6.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(A, q, K, Y, z, w);
            return this._localParentNotSampled.shouldSample(A, q, K, Y, z, w)
        }
        toString() {
            return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
        }
    }
    rE4.ParentBasedSampler = nE4
})
// @from(Ln 302640, Col 4)
xNA = R((tE4) => {
    Object.defineProperty(tE4, "__esModule", {
        value: !0
    });
    tE4.TraceIdRatioBasedSampler = void 0;
    var rDY = Fq(),
        aE4 = TF1();
    class sE4 {
        _ratio;
        _upperBound;
        constructor(A = 0) {
            this._ratio = A, this._ratio = this._normalize(A), this._upperBound = Math.floor(this._ratio * 4294967295)
        }
        shouldSample(A, q) {
            return {
                decision: (0, rDY.isValidTraceId)(q) && this._accumulate(q) < this._upperBound ? aE4.SamplingDecision.RECORD_AND_SAMPLED : aE4.SamplingDecision.NOT_RECORD
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
            let q = 0;
            for (let K = 0; K < A.length / 8; K++) {
                let Y = K * 8,
                    z = parseInt(A.slice(Y, Y + 8), 16);
                q = (q ^ z) >>> 0
            }
            return q
        }
    }
    tE4.TraceIdRatioBasedSampler = sE4
})
// @from(Ln 302677, Col 4)
BNA = R((zk4) => {
    Object.defineProperty(zk4, "__esModule", {
        value: !0
    });
    zk4.buildSamplerFromEnv = zk4.loadDefaultConfig = void 0;
    var uNA = Fq(),
        Wm = G9(),
        Ak4 = qj6(),
        bNA = Kj6(),
        zj6 = INA(),
        qk4 = xNA(),
        Gm;
    (function(A) {
        A.AlwaysOff = "always_off", A.AlwaysOn = "always_on", A.ParentBasedAlwaysOff = "parentbased_always_off", A.ParentBasedAlwaysOn = "parentbased_always_on", A.ParentBasedTraceIdRatio = "parentbased_traceidratio", A.TraceIdRatio = "traceidratio"
    })(Gm || (Gm = {}));
    var wj6 = 1;

    function oDY() {
        return {
            sampler: Yk4(),
            forceFlushTimeoutMillis: 30000,
            generalLimits: {
                attributeValueLengthLimit: (0, Wm.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
                attributeCountLimit: (0, Wm.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
            },
            spanLimits: {
                attributeValueLengthLimit: (0, Wm.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
                attributeCountLimit: (0, Wm.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
                linkCountLimit: (0, Wm.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
                eventCountLimit: (0, Wm.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
                attributePerEventCountLimit: (0, Wm.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
                attributePerLinkCountLimit: (0, Wm.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
            }
        }
    }
    zk4.loadDefaultConfig = oDY;

    function Yk4() {
        let A = (0, Wm.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? Gm.ParentBasedAlwaysOn;
        switch (A) {
            case Gm.AlwaysOn:
                return new bNA.AlwaysOnSampler;
            case Gm.AlwaysOff:
                return new Ak4.AlwaysOffSampler;
            case Gm.ParentBasedAlwaysOn:
                return new zj6.ParentBasedSampler({
                    root: new bNA.AlwaysOnSampler
                });
            case Gm.ParentBasedAlwaysOff:
                return new zj6.ParentBasedSampler({
                    root: new Ak4.AlwaysOffSampler
                });
            case Gm.TraceIdRatio:
                return new qk4.TraceIdRatioBasedSampler(Kk4());
            case Gm.ParentBasedTraceIdRatio:
                return new zj6.ParentBasedSampler({
                    root: new qk4.TraceIdRatioBasedSampler(Kk4())
                });
            default:
                return uNA.diag.error(`OTEL_TRACES_SAMPLER value "${A}" invalid, defaulting to "${Gm.ParentBasedAlwaysOn}".`), new zj6.ParentBasedSampler({
                    root: new bNA.AlwaysOnSampler
                })
        }
    }
    zk4.buildSamplerFromEnv = Yk4;

    function Kk4() {
        let A = (0, Wm.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
        if (A == null) return uNA.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${wj6}.`), wj6;
        if (A < 0 || A > 1) return uNA.diag.error(`OTEL_TRACES_SAMPLER_ARG=${A} was given, but it is out of range ([0..1]), defaulting to ${wj6}.`), wj6;
        return A
    }
})
// @from(Ln 302750, Col 4)
mNA = R(($k4) => {
    Object.defineProperty($k4, "__esModule", {
        value: !0
    });
    $k4.reconfigureLimits = $k4.mergeConfig = $k4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = $k4.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
    var Hk4 = BNA(),
        Hj6 = G9();
    $k4.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
    $k4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

    function sDY(A) {
        let q = {
                sampler: (0, Hk4.buildSamplerFromEnv)()
            },
            K = (0, Hk4.loadDefaultConfig)(),
            Y = Object.assign({}, K, q, A);
        return Y.generalLimits = Object.assign({}, K.generalLimits, A.generalLimits || {}), Y.spanLimits = Object.assign({}, K.spanLimits, A.spanLimits || {}), Y
    }
    $k4.mergeConfig = sDY;

    function tDY(A) {
        let q = Object.assign({}, A.spanLimits);
        return q.attributeCountLimit = A.spanLimits?.attributeCountLimit ?? A.generalLimits?.attributeCountLimit ?? (0, Hj6.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, Hj6.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? $k4.DEFAULT_ATTRIBUTE_COUNT_LIMIT, q.attributeValueLengthLimit = A.spanLimits?.attributeValueLengthLimit ?? A.generalLimits?.attributeValueLengthLimit ?? (0, Hj6.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, Hj6.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? $k4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, A, {
            spanLimits: q
        })
    }
    $k4.reconfigureLimits = tDY
})
// @from(Ln 302778, Col 4)
Mk4 = R((Dk4) => {
    Object.defineProperty(Dk4, "__esModule", {
        value: !0
    });
    Dk4.BatchSpanProcessorBase = void 0;
    var PP1 = Fq(),
        Pd = G9();
    class Xk4 {
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
        constructor(A, q) {
            if (this._exporter = A, this._maxExportBatchSize = typeof q?.maxExportBatchSize === "number" ? q.maxExportBatchSize : (0, Pd.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof q?.maxQueueSize === "number" ? q.maxQueueSize : (0, Pd.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof q?.scheduledDelayMillis === "number" ? q.scheduledDelayMillis : (0, Pd.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof q?.exportTimeoutMillis === "number" ? q.exportTimeoutMillis : (0, Pd.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new Pd.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) PP1.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
        }
        forceFlush() {
            if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
            return this._flushAll()
        }
        onStart(A, q) {}
        onEnd(A) {
            if (this._shutdownOnce.isCalled) return;
            if ((A.spanContext().traceFlags & PP1.TraceFlags.SAMPLED) === 0) return;
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
                if (this._droppedSpansCount === 0) PP1.diag.debug("maxQueueSize reached, dropping spans");
                this._droppedSpansCount++;
                return
            }
            if (this._droppedSpansCount > 0) PP1.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
            this._finishedSpans.push(A), this._maybeStartTimer()
        }
        _flushAll() {
            return new Promise((A, q) => {
                let K = [],
                    Y = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
                for (let z = 0, w = Y; z < w; z++) K.push(this._flushOneBatch());
                Promise.all(K).then(() => {
                    A()
                }).catch(q)
            })
        }
        _flushOneBatch() {
            if (this._clearTimer(), this._finishedSpans.length === 0) return Promise.resolve();
            return new Promise((A, q) => {
                let K = setTimeout(() => {
                    q(Error("Timeout"))
                }, this._exportTimeoutMillis);
                PP1.context.with((0, Pd.suppressTracing)(PP1.context.active()), () => {
                    let Y;
                    if (this._finishedSpans.length <= this._maxExportBatchSize) Y = this._finishedSpans, this._finishedSpans = [];
                    else Y = this._finishedSpans.splice(0, this._maxExportBatchSize);
                    let z = () => this._exporter.export(Y, (H) => {
                            if (clearTimeout(K), H.code === Pd.ExportResultCode.SUCCESS) A();
                            else q(H.error ?? Error("BatchSpanProcessor: span export failed"))
                        }),
                        w = null;
                    for (let H = 0, $ = Y.length; H < $; H++) {
                        let O = Y[H];
                        if (O.resource.asyncAttributesPending && O.resource.waitForAsyncAttributes) w ??= [], w.push(O.resource.waitForAsyncAttributes())
                    }
                    if (w === null) z();
                    else Promise.all(w).then(z, (H) => {
                        (0, Pd.globalErrorHandler)(H), q(H)
                    })
                })
            })
        }
        _maybeStartTimer() {
            if (this._isExporting) return;
            let A = () => {
                this._isExporting = !0, this._flushOneBatch().finally(() => {
                    if (this._isExporting = !1, this._finishedSpans.length > 0) this._clearTimer(), this._maybeStartTimer()
                }).catch((q) => {
                    this._isExporting = !1, (0, Pd.globalErrorHandler)(q)
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
    Dk4.BatchSpanProcessorBase = Xk4
})
// @from(Ln 302885, Col 4)
Zk4 = R((Wk4) => {
    Object.defineProperty(Wk4, "__esModule", {
        value: !0
    });
    Wk4.BatchSpanProcessor = void 0;
    var A0Y = Mk4();
    class Pk4 extends A0Y.BatchSpanProcessorBase {
        onShutdown() {}
    }
    Wk4.BatchSpanProcessor = Pk4
})
// @from(Ln 302896, Col 4)
Ek4 = R((Tk4) => {
    Object.defineProperty(Tk4, "__esModule", {
        value: !0
    });
    Tk4.RandomIdGenerator = void 0;
    var q0Y = 8,
        Vk4 = 16;
    class Nk4 {
        generateTraceId = fk4(Vk4);
        generateSpanId = fk4(q0Y)
    }
    Tk4.RandomIdGenerator = Nk4;
    var $j6 = Buffer.allocUnsafe(Vk4);

    function fk4(A) {
        return function() {
            for (let K = 0; K < A / 4; K++) $j6.writeUInt32BE(Math.random() * 4294967296 >>> 0, K * 4);
            for (let K = 0; K < A; K++)
                if ($j6[K] > 0) break;
                else if (K === A - 1) $j6[A - 1] = 1;
            return $j6.toString("hex", 0, A)
        }
    }
})
// @from(Ln 302920, Col 4)
kk4 = R((Oj6) => {
    Object.defineProperty(Oj6, "__esModule", {
        value: !0
    });
    Oj6.RandomIdGenerator = Oj6.BatchSpanProcessor = void 0;
    var K0Y = Zk4();
    Object.defineProperty(Oj6, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return K0Y.BatchSpanProcessor
        }
    });
    var Y0Y = Ek4();
    Object.defineProperty(Oj6, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return Y0Y.RandomIdGenerator
        }
    })
})
// @from(Ln 302940, Col 4)
FNA = R((_j6) => {
    Object.defineProperty(_j6, "__esModule", {
        value: !0
    });
    _j6.RandomIdGenerator = _j6.BatchSpanProcessor = void 0;
    var Lk4 = kk4();
    Object.defineProperty(_j6, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return Lk4.BatchSpanProcessor
        }
    });
    Object.defineProperty(_j6, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return Lk4.RandomIdGenerator
        }
    })
})
// @from(Ln 302959, Col 4)
Sk4 = R((yk4) => {
    Object.defineProperty(yk4, "__esModule", {
        value: !0
    });
    yk4.Tracer = void 0;
    var AP = Fq(),
        Jj6 = G9(),
        H0Y = FE4(),
        $0Y = mNA(),
        O0Y = FNA();
    class Rk4 {
        _sampler;
        _generalLimits;
        _spanLimits;
        _idGenerator;
        instrumentationScope;
        _resource;
        _spanProcessor;
        constructor(A, q, K, Y) {
            let z = (0, $0Y.mergeConfig)(q);
            this._sampler = z.sampler, this._generalLimits = z.generalLimits, this._spanLimits = z.spanLimits, this._idGenerator = q.idGenerator || new O0Y.RandomIdGenerator, this._resource = K, this._spanProcessor = Y, this.instrumentationScope = A
        }
        startSpan(A, q = {}, K = AP.context.active()) {
            if (q.root) K = AP.trace.deleteSpan(K);
            let Y = AP.trace.getSpan(K);
            if ((0, Jj6.isTracingSuppressed)(K)) return AP.diag.debug("Instrumentation suppressed, returning Noop Span"), AP.trace.wrapSpanContext(AP.INVALID_SPAN_CONTEXT);
            let z = Y?.spanContext(),
                w = this._idGenerator.generateSpanId(),
                H, $, O;
            if (!z || !AP.trace.isSpanContextValid(z)) $ = this._idGenerator.generateTraceId();
            else $ = z.traceId, O = z.traceState, H = z;
            let _ = q.kind ?? AP.SpanKind.INTERNAL,
                J = (q.links ?? []).map((G) => {
                    return {
                        context: G.context,
                        attributes: (0, Jj6.sanitizeAttributes)(G.attributes)
                    }
                }),
                X = (0, Jj6.sanitizeAttributes)(q.attributes),
                D = this._sampler.shouldSample(K, $, A, _, X, J);
            O = D.traceState ?? O;
            let j = D.decision === AP.SamplingDecision.RECORD_AND_SAMPLED ? AP.TraceFlags.SAMPLED : AP.TraceFlags.NONE,
                M = {
                    traceId: $,
                    spanId: w,
                    traceFlags: j,
                    traceState: O
                };
            if (D.decision === AP.SamplingDecision.NOT_RECORD) return AP.diag.debug("Recording is off, propagating context in a non-recording span"), AP.trace.wrapSpanContext(M);
            let P = (0, Jj6.sanitizeAttributes)(Object.assign(X, D.attributes));
            return new H0Y.SpanImpl({
                resource: this._resource,
                scope: this.instrumentationScope,
                context: K,
                spanContext: M,
                name: A,
                kind: _,
                links: J,
                parentSpanContext: H,
                attributes: P,
                startTime: q.startTime,
                spanProcessor: this._spanProcessor,
                spanLimits: this._spanLimits
            })
        }
        startActiveSpan(A, q, K, Y) {
            let z, w, H;
            if (arguments.length < 2) return;
            else if (arguments.length === 2) H = q;
            else if (arguments.length === 3) z = q, H = K;
            else z = q, w = K, H = Y;
            let $ = w ?? AP.context.active(),
                O = this.startSpan(A, z, $),
                _ = AP.trace.setSpan($, O);
            return AP.context.with(_, H, void 0, O)
        }
        getGeneralLimits() {
            return this._generalLimits
        }
        getSpanLimits() {
            return this._spanLimits
        }
    }
    yk4.Tracer = Rk4
})
// @from(Ln 303044, Col 4)
bk4 = R((Ik4) => {
    Object.defineProperty(Ik4, "__esModule", {
        value: !0
    });
    Ik4.MultiSpanProcessor = void 0;
    var _0Y = G9();
    class hk4 {
        _spanProcessors;
        constructor(A) {
            this._spanProcessors = A
        }
        forceFlush() {
            let A = [];
            for (let q of this._spanProcessors) A.push(q.forceFlush());
            return new Promise((q) => {
                Promise.all(A).then(() => {
                    q()
                }).catch((K) => {
                    (0, _0Y.globalErrorHandler)(K || Error("MultiSpanProcessor: forceFlush failed")), q()
                })
            })
        }
        onStart(A, q) {
            for (let K of this._spanProcessors) K.onStart(A, q)
        }
        onEnd(A) {
            for (let q of this._spanProcessors) q.onEnd(A)
        }
        shutdown() {
            let A = [];
            for (let q of this._spanProcessors) A.push(q.shutdown());
            return new Promise((q, K) => {
                Promise.all(A).then(() => {
                    q()
                }, K)
            })
        }
    }
    Ik4.MultiSpanProcessor = hk4
})
// @from(Ln 303084, Col 4)
Qk4 = R((mk4) => {
    Object.defineProperty(mk4, "__esModule", {
        value: !0
    });
    mk4.BasicTracerProvider = mk4.ForceFlushState = void 0;
    var J0Y = G9(),
        X0Y = jM1(),
        D0Y = Sk4(),
        j0Y = BNA(),
        M0Y = bk4(),
        P0Y = mNA(),
        WP1;
    (function(A) {
        A[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved"
    })(WP1 = mk4.ForceFlushState || (mk4.ForceFlushState = {}));
    class Bk4 {
        _config;
        _tracers = new Map;
        _resource;
        _activeSpanProcessor;
        constructor(A = {}) {
            let q = (0, J0Y.merge)({}, (0, j0Y.loadDefaultConfig)(), (0, P0Y.reconfigureLimits)(A));
            this._resource = q.resource ?? (0, X0Y.defaultResource)(), this._config = Object.assign({}, q, {
                resource: this._resource
            });
            let K = [];
            if (A.spanProcessors?.length) K.push(...A.spanProcessors);
            this._activeSpanProcessor = new M0Y.MultiSpanProcessor(K)
        }
        getTracer(A, q, K) {
            let Y = `${A}@${q||""}:${K?.schemaUrl||""}`;
            if (!this._tracers.has(Y)) this._tracers.set(Y, new D0Y.Tracer({
                name: A,
                version: q,
                schemaUrl: K?.schemaUrl
            }, this._config, this._resource, this._activeSpanProcessor));
            return this._tracers.get(Y)
        }
        forceFlush() {
            let A = this._config.forceFlushTimeoutMillis,
                q = this._activeSpanProcessor._spanProcessors.map((K) => {
                    return new Promise((Y) => {
                        let z, w = setTimeout(() => {
                            Y(Error(`Span processor did not completed within timeout period of ${A} ms`)), z = WP1.timeout
                        }, A);
                        K.forceFlush().then(() => {
                            if (clearTimeout(w), z !== WP1.timeout) z = WP1.resolved, Y(z)
                        }).catch((H) => {
                            clearTimeout(w), z = WP1.error, Y(H)
                        })
                    })
                });
            return new Promise((K, Y) => {
                Promise.all(q).then((z) => {
                    let w = z.filter((H) => H !== WP1.resolved);
                    if (w.length > 0) Y(w);
                    else K()
                }).catch((z) => Y([z]))
            })
        }
        shutdown() {
            return this._activeSpanProcessor.shutdown()
        }
    }
    mk4.BasicTracerProvider = Bk4
})
// @from(Ln 303150, Col 4)
dk4 = R((Uk4) => {
    Object.defineProperty(Uk4, "__esModule", {
        value: !0
    });
    Uk4.ConsoleSpanExporter = void 0;
    var QNA = G9();
    class gk4 {
        export (A, q) {
            return this._sendSpans(A, q)
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
                timestamp: (0, QNA.hrTimeToMicroseconds)(A.startTime),
                duration: (0, QNA.hrTimeToMicroseconds)(A.duration),
                attributes: A.attributes,
                status: A.status,
                events: A.events,
                links: A.links
            }
        }
        _sendSpans(A, q) {
            for (let K of A) console.dir(this._exportInfo(K), {
                depth: 3
            });
            if (q) return q({
                code: QNA.ExportResultCode.SUCCESS
            })
        }
    }
    Uk4.ConsoleSpanExporter = gk4
})
// @from(Ln 303197, Col 4)
rk4 = R((ik4) => {
    Object.defineProperty(ik4, "__esModule", {
        value: !0
    });
    ik4.InMemorySpanExporter = void 0;
    var ck4 = G9();
    class lk4 {
        _finishedSpans = [];
        _stopped = !1;
        export (A, q) {
            if (this._stopped) return q({
                code: ck4.ExportResultCode.FAILED,
                error: Error("Exporter has been stopped")
            });
            this._finishedSpans.push(...A), setTimeout(() => q({
                code: ck4.ExportResultCode.SUCCESS
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
    ik4.InMemorySpanExporter = lk4
})
// @from(Ln 303230, Col 4)
tk4 = R((ak4) => {
    Object.defineProperty(ak4, "__esModule", {
        value: !0
    });
    ak4.SimpleSpanProcessor = void 0;
    var W0Y = Fq(),
        Xj6 = G9();
    class ok4 {
        _exporter;
        _shutdownOnce;
        _pendingExports;
        constructor(A) {
            this._exporter = A, this._shutdownOnce = new Xj6.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
        }
        async forceFlush() {
            if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
        }
        onStart(A, q) {}
        onEnd(A) {
            if (this._shutdownOnce.isCalled) return;
            if ((A.spanContext().traceFlags & W0Y.TraceFlags.SAMPLED) === 0) return;
            let q = this._doExport(A).catch((K) => (0, Xj6.globalErrorHandler)(K));
            this._pendingExports.add(q), q.finally(() => this._pendingExports.delete(q))
        }
        async _doExport(A) {
            if (A.resource.asyncAttributesPending) await A.resource.waitForAsyncAttributes?.();
            let q = await Xj6.internal._export(this._exporter, [A]);
            if (q.code !== Xj6.ExportResultCode.SUCCESS) throw q.error ?? Error(`SimpleSpanProcessor: span export failed (status ${q})`)
        }
        shutdown() {
            return this._shutdownOnce.call()
        }
        _shutdown() {
            return this._exporter.shutdown()
        }
    }
    ak4.SimpleSpanProcessor = ok4
})
// @from(Ln 303268, Col 4)
KL4 = R((AL4) => {
    Object.defineProperty(AL4, "__esModule", {
        value: !0
    });
    AL4.NoopSpanProcessor = void 0;
    class ek4 {
        onStart(A, q) {}
        onEnd(A) {}
        shutdown() {
            return Promise.resolve()
        }
        forceFlush() {
            return Promise.resolve()
        }
    }
    AL4.NoopSpanProcessor = ek4
})
// @from(Ln 303285, Col 4)
zL4 = R((JN) => {
    Object.defineProperty(JN, "__esModule", {
        value: !0
    });
    JN.SamplingDecision = JN.TraceIdRatioBasedSampler = JN.ParentBasedSampler = JN.AlwaysOnSampler = JN.AlwaysOffSampler = JN.NoopSpanProcessor = JN.SimpleSpanProcessor = JN.InMemorySpanExporter = JN.ConsoleSpanExporter = JN.RandomIdGenerator = JN.BatchSpanProcessor = JN.BasicTracerProvider = void 0;
    var G0Y = Qk4();
    Object.defineProperty(JN, "BasicTracerProvider", {
        enumerable: !0,
        get: function() {
            return G0Y.BasicTracerProvider
        }
    });
    var YL4 = FNA();
    Object.defineProperty(JN, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return YL4.BatchSpanProcessor
        }
    });
    Object.defineProperty(JN, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return YL4.RandomIdGenerator
        }
    });
    var Z0Y = dk4();
    Object.defineProperty(JN, "ConsoleSpanExporter", {
        enumerable: !0,
        get: function() {
            return Z0Y.ConsoleSpanExporter
        }
    });
    var f0Y = rk4();
    Object.defineProperty(JN, "InMemorySpanExporter", {
        enumerable: !0,
        get: function() {
            return f0Y.InMemorySpanExporter
        }
    });
    var V0Y = tk4();
    Object.defineProperty(JN, "SimpleSpanProcessor", {
        enumerable: !0,
        get: function() {
            return V0Y.SimpleSpanProcessor
        }
    });
    var N0Y = KL4();
    Object.defineProperty(JN, "NoopSpanProcessor", {
        enumerable: !0,
        get: function() {
            return N0Y.NoopSpanProcessor
        }
    });
    var T0Y = qj6();
    Object.defineProperty(JN, "AlwaysOffSampler", {
        enumerable: !0,
        get: function() {
            return T0Y.AlwaysOffSampler
        }
    });
    var v0Y = Kj6();
    Object.defineProperty(JN, "AlwaysOnSampler", {
        enumerable: !0,
        get: function() {
            return v0Y.AlwaysOnSampler
        }
    });
    var E0Y = INA();
    Object.defineProperty(JN, "ParentBasedSampler", {
        enumerable: !0,
        get: function() {
            return E0Y.ParentBasedSampler
        }
    });
    var k0Y = xNA();
    Object.defineProperty(JN, "TraceIdRatioBasedSampler", {
        enumerable: !0,
        get: function() {
            return k0Y.TraceIdRatioBasedSampler
        }
    });
    var L0Y = TF1();
    Object.defineProperty(JN, "SamplingDecision", {
        enumerable: !0,
        get: function() {
            return L0Y.SamplingDecision
        }
    })
})
// @from(Ln 303374, Col 4)
_L4 = R(($L4) => {
    Object.defineProperty($L4, "__esModule", {
        value: !0
    });
    $L4.OTLPTraceExporter = void 0;
    var y0Y = eB(),
        C0Y = Km(),
        wL4 = Yd();
    class HL4 extends y0Y.OTLPExporterBase {
        constructor(A = {}) {
            super((0, wL4.createOtlpHttpExportDelegate)((0, wL4.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
                "Content-Type": "application/x-protobuf"
            }), C0Y.ProtobufTraceSerializer))
        }
    }
    $L4.OTLPTraceExporter = HL4
})
// @from(Ln 303391, Col 4)
JL4 = R((gNA) => {
    Object.defineProperty(gNA, "__esModule", {
        value: !0
    });
    gNA.OTLPTraceExporter = void 0;
    var S0Y = _L4();
    Object.defineProperty(gNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return S0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303404, Col 4)
XL4 = R((UNA) => {
    Object.defineProperty(UNA, "__esModule", {
        value: !0
    });
    UNA.OTLPTraceExporter = void 0;
    var I0Y = JL4();
    Object.defineProperty(UNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return I0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303417, Col 4)
DL4 = R((pNA) => {
    Object.defineProperty(pNA, "__esModule", {
        value: !0
    });
    pNA.OTLPTraceExporter = void 0;
    var b0Y = XL4();
    Object.defineProperty(pNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return b0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303430, Col 4)
GL4 = R((PL4) => {
    Object.defineProperty(PL4, "__esModule", {
        value: !0
    });
    PL4.OTLPTraceExporter = void 0;
    var jL4 = s06(),
        B0Y = Km(),
        m0Y = eB();
    class ML4 extends m0Y.OTLPExporterBase {
        constructor(A = {}) {
            super((0, jL4.createOtlpGrpcExportDelegate)((0, jL4.convertLegacyOtlpGrpcOptions)(A, "TRACES"), B0Y.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
        }
    }
    PL4.OTLPTraceExporter = ML4
})
// @from(Ln 303445, Col 4)
ZL4 = R((dNA) => {
    Object.defineProperty(dNA, "__esModule", {
        value: !0
    });
    dNA.OTLPTraceExporter = void 0;
    var F0Y = GL4();
    Object.defineProperty(dNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return F0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303458, Col 4)
vL4 = R((NL4) => {
    Object.defineProperty(NL4, "__esModule", {
        value: !0
    });
    NL4.OTLPTraceExporter = void 0;
    var g0Y = eB(),
        U0Y = Km(),
        fL4 = Yd();
    class VL4 extends g0Y.OTLPExporterBase {
        constructor(A = {}) {
            super((0, fL4.createOtlpHttpExportDelegate)((0, fL4.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
                "Content-Type": "application/json"
            }), U0Y.JsonTraceSerializer))
        }
    }
    NL4.OTLPTraceExporter = VL4
})
// @from(Ln 303475, Col 4)
EL4 = R((cNA) => {
    Object.defineProperty(cNA, "__esModule", {
        value: !0
    });
    cNA.OTLPTraceExporter = void 0;
    var p0Y = vL4();
    Object.defineProperty(cNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return p0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303488, Col 4)
kL4 = R((lNA) => {
    Object.defineProperty(lNA, "__esModule", {
        value: !0
    });
    lNA.OTLPTraceExporter = void 0;
    var c0Y = EL4();
    Object.defineProperty(lNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return c0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303501, Col 4)
LL4 = R((iNA) => {
    Object.defineProperty(iNA, "__esModule", {
        value: !0
    });
    iNA.OTLPTraceExporter = void 0;
    var i0Y = kL4();
    Object.defineProperty(iNA, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return i0Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 303514, Col 0)
class nNA {
    error(A, ...q) {
        K1(Error(A))
    }
    warn(A, ...q) {
        K1(Error(A))
    }
    info(A, ...q) {
        return
    }
    debug(A, ...q) {
        return
    }
    verbose(A, ...q) {
        return
    }
}
// @from(Ln 303531, Col 4)
RL4 = v(() => {
    y6()
})
// @from(Ln 303534, Col 0)
async function o0Y() {
    let A = DH();
    if (A.error) throw h(`Metrics opt-out check failed: ${A.error}`), Error(`Auth error: ${A.error}`);
    let q = {
        "Content-Type": "application/json",
        "User-Agent": XH(),
        ...A.headers
    };
    try {
        let Y = await sA.get("https://api.anthropic.com/api/claude_code/organizations/metrics_enabled", {
            headers: q,
            timeout: 5000
        });
        return h(`Metrics opt-out API response: enabled=${Y.data.metrics_logging_enabled}, vcsLinking=${Y.data.vcs_account_linking_enabled}`), {
            enabled: Y.data.metrics_logging_enabled,
            vcsAccountLinkingEnabled: Y.data.vcs_account_linking_enabled,
            hasError: !1
        }
    } catch (K) {
        return h(`Failed to check metrics opt-out status: ${K instanceof Error?K.message:String(K)}`), K1(K), {
            enabled: !1,
            vcsAccountLinkingEnabled: !1,
            hasError: !0
        }
    }
}
// @from(Ln 303560, Col 0)
async function Dj6() {
    try {
        return await a0Y()
    } catch (A) {
        return h("Metrics check failed, defaulting to disabled"), {
            enabled: !1,
            vcsAccountLinkingEnabled: !1,
            hasError: !0
        }
    }
}
// @from(Ln 303571, Col 4)
r0Y = 3600000
// @from(Ln 303572, Col 4)
a0Y
// @from(Ln 303573, Col 4)
rNA = v(() => {
    y5();
    Rw1();
    B0();
    Z6();
    y6();
    a0Y = Lw1(o0Y, r0Y)
})
// @from(Ln 303581, Col 0)
class aNA {
    endpoint;
    timeout;
    pendingExports = [];
    isShutdown = !1;
    constructor(A = {}) {
        this.endpoint = "https://api.anthropic.com/api/claude_code/metrics", this.timeout = A.timeout || 5000
    }
    async export (A, q) {
        if (this.isShutdown) {
            q({
                code: Q31.ExportResultCode.FAILED,
                error: Error("Exporter has been shutdown")
            });
            return
        }
        let K = this.doExport(A, q);
        this.pendingExports.push(K), K.finally(() => {
            let Y = this.pendingExports.indexOf(K);
            if (Y > -1) this.pendingExports.splice(Y, 1)
        })
    }
    async doExport(A, q) {
        try {
            if (!($H(!0) || w4())) {
                h("BigQuery metrics export: trust not established, skipping"), q({
                    code: Q31.ExportResultCode.SUCCESS
                });
                return
            }
            if (!(await Dj6()).enabled) {
                h("Metrics export disabled by organization setting"), q({
                    code: Q31.ExportResultCode.SUCCESS
                });
                return
            }
            let z = this.transformMetricsForInternal(A),
                w = DH();
            if (w.error) {
                h(`Metrics export failed: ${w.error}`), q({
                    code: Q31.ExportResultCode.FAILED,
                    error: Error(w.error)
                });
                return
            }
            let H = {
                    "Content-Type": "application/json",
                    "User-Agent": XH(),
                    ...w.headers
                },
                $ = await sA.post(this.endpoint, z, {
                    timeout: this.timeout,
                    headers: H
                });
            h("BigQuery metrics exported successfully"), h(`BigQuery API Response: ${Q1($.data,null,2)}`), q({
                code: Q31.ExportResultCode.SUCCESS
            })
        } catch (K) {
            h(`BigQuery metrics export failed: ${K instanceof Error?K.message:String(K)}`), K1(K), q({
                code: Q31.ExportResultCode.FAILED,
                error: K instanceof Error ? K : Error("Unknown export error")
            })
        }
    }
    transformMetricsForInternal(A) {
        let q = A.resource.attributes,
            K = {
                "service.name": q["service.name"] || "claude-code",
                "service.version": q["service.version"] || "unknown",
                "os.type": q["os.type"] || "unknown",
                "os.version": q["os.version"] || "unknown",
                "host.arch": q["host.arch"] || "unknown",
                "aggregation.temporality": this.selectAggregationTemporality() === oNA.AggregationTemporality.DELTA ? "delta" : "cumulative"
            };
        if (q["wsl.version"]) K["wsl.version"] = q["wsl.version"];
        if (i8()) {
            K["user.customer_type"] = "claude_ai";
            let z = dK();
            if (z) K["user.subscription_type"] = z
        } else K["user.customer_type"] = "api";
        return {
            resource_attributes: K,
            metrics: A.scopeMetrics.flatMap((z) => z.metrics.map((w) => ({
                name: w.descriptor.name,
                description: w.descriptor.description,
                unit: w.descriptor.unit,
                data_points: this.extractDataPoints(w)
            })))
        }
    }
    extractDataPoints(A) {
        return (A.dataPoints || []).filter((K) => typeof K.value === "number").map((K) => ({
            attributes: this.convertAttributes(K.attributes),
            value: K.value,
            timestamp: this.hrTimeToISOString(K.endTime || K.startTime || [Date.now() / 1000, 0])
        }))
    }
    async shutdown() {
        this.isShutdown = !0, await this.forceFlush(), h("BigQuery metrics exporter shutdown complete")
    }
    async forceFlush() {
        await Promise.all(this.pendingExports), h("BigQuery metrics exporter flush complete")
    }
    convertAttributes(A) {
        let q = {};
        if (A) {
            for (let [K, Y] of Object.entries(A))
                if (Y !== void 0 && Y !== null) q[K] = String(Y)
        }
        return q
    }
    hrTimeToISOString(A) {
        let [q, K] = A;
        return new Date(q * 1000 + K / 1e6).toISOString()
    }
    selectAggregationTemporality() {
        return oNA.AggregationTemporality.DELTA
    }
}
// @from(Ln 303700, Col 4)
oNA
// @from(Ln 303700, Col 9)
Q31
// @from(Ln 303701, Col 4)
yL4 = v(() => {
    y5();
    Z6();
    y6();
    B0();
    rNA();
    J7();
    cA();
    B6();
    m6();
    oNA = o(Ps(), 1), Q31 = o(G9(), 1)
})
// @from(Ln 303713, Col 4)
KTA = {}
// @from(Ln 303721, Col 0)
function QL4() {
    if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE) process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta"
}
// @from(Ln 303725, Col 0)
function t0Y() {
    let A = (process.env.OTEL_METRICS_EXPORTER || "").trim().split(",").filter(Boolean),
        q = parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || s0Y.toString()),
        K = [];
    for (let Y of A)
        if (Y === "console") {
            let z = new EF1.ConsoleMetricExporter,
                w = z.export.bind(z);
            z.export = (H, $) => {
                if (H.resource && H.resource.attributes) h(`
=== Resource Attributes ===`), h(Q1(H.resource.attributes)), h(`===========================
`);
                return w(H, $)
            }, K.push(z)
        } else if (Y === "otlp") {
        let z = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            w = qTA();
        switch (z) {
            case "grpc":
                K.push(new SL4.OTLPMetricExporter);
                break;
            case "http/json":
                K.push(new hL4.OTLPMetricExporter(w));
                break;
            case "http/protobuf":
                K.push(new CL4.OTLPMetricExporter(w));
                break;
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${z}`)
        }
    } else if (Y === "prometheus") K.push(new IL4.PrometheusExporter);
    else throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Y}`);
    return K.map((Y) => {
        if ("export" in Y) return new tNA.PeriodicExportingMetricReader({
            exporter: Y,
            exportIntervalMillis: q
        });
        return Y
    })
}
// @from(Ln 303766, Col 0)
function e0Y() {
    let A = (process.env.OTEL_LOGS_EXPORTER || "").trim().split(",").filter(Boolean),
        q = [];
    for (let K of A)
        if (K === "console") q.push(new Fs.ConsoleLogRecordExporter);
        else if (K === "otlp") {
        let Y = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            z = qTA();
        switch (Y) {
            case "grpc":
                q.push(new bL4.OTLPLogExporter);
                break;
            case "http/json":
                q.push(new eNA.OTLPLogExporter(z));
                break;
            case "http/protobuf":
                q.push(new xL4.OTLPLogExporter(z));
                break;
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Y}`)
        }
    } else throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${K}`);
    return q
}
// @from(Ln 303791, Col 0)
function AjY() {
    let A = (process.env.OTEL_TRACES_EXPORTER || "").trim().split(",").filter(Boolean),
        q = [];
    for (let K of A)
        if (K === "console") q.push(new Qs.ConsoleSpanExporter);
        else if (K === "otlp") {
        let Y = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            z = qTA();
        switch (Y) {
            case "grpc":
                q.push(new BL4.OTLPTraceExporter);
                break;
            case "http/json":
                q.push(new ATA.OTLPTraceExporter(z));
                break;
            case "http/protobuf":
                q.push(new uL4.OTLPTraceExporter(z));
                break;
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Y}`)
        }
    } else throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${K}`);
    return q
}
// @from(Ln 303816, Col 0)
function jj6() {
    return J6(process.env.CLAUDE_CODE_ENABLE_TELEMETRY)
}
// @from(Ln 303820, Col 0)
function qjY() {
    let A = new aNA;
    return new tNA.PeriodicExportingMetricReader({
        exporter: A,
        exportIntervalMillis: 300000
    })
}
// @from(Ln 303828, Col 0)
function KjY() {
    let A = dK(),
        q = i8() && (A === "enterprise" || A === "team");
    return Yi8() || q
}
// @from(Ln 303834, Col 0)
function YjY(A) {
    let q = process.env.BETA_TRACING_ENDPOINT;
    if (!q) return;
    let K = {
            url: `${q}/v1/traces`
        },
        Y = {
            url: `${q}/v1/logs`
        },
        z = new ATA.OTLPTraceExporter(K),
        w = new Qs.BatchSpanProcessor(z, {
            scheduledDelayMillis: FL4
        }),
        H = new Qs.BasicTracerProvider({
            resource: A,
            spanProcessors: [w]
        });
    g31.trace.setGlobalTracerProvider(H), Zn1(H);
    let $ = new eNA.OTLPLogExporter(Y),
        O = new Fs.LoggerProvider({
            resource: A,
            processors: [new Fs.BatchLogRecordProcessor($, {
                scheduledDelayMillis: mL4
            })]
        });
    vF1.logs.setGlobalLoggerProvider(O), Pn1(O);
    let _ = vF1.logs.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION);
    Wn1(_), process.on("beforeExit", async () => {
        await O?.forceFlush(), await H?.forceFlush()
    }), process.on("exit", () => {
        O?.forceFlush(), H?.forceFlush()
    })
}
// @from(Ln 303875, Col 0)
function zjY() {
    EK("telemetry_init_start"), QL4(), g31.diag.setLogger(new nNA, g31.DiagLogLevel.ERROR), Fi7();
    let A = [];
    if (jj6()) A.push(...t0Y());
    if (KjY()) A.push(qjY());
    let q = eA(),
        K = {
            [ms.ATTR_SERVICE_NAME]: "claude-code",
            [ms.ATTR_SERVICE_VERSION]: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION
        };
    if (q === "wsl") {
        let D = g61();
        if (D) K["wsl.version"] = D
    }
    let Y = th.resourceFromAttributes(K),
        z = th.resourceFromAttributes(th.osDetector.detect().attributes || {}),
        w = th.hostDetector.detect(),
        H = w.attributes?.[ms.SEMRESATTRS_HOST_ARCH] ? {
            [ms.SEMRESATTRS_HOST_ARCH]: w.attributes[ms.SEMRESATTRS_HOST_ARCH]
        } : {},
        $ = th.resourceFromAttributes(H),
        O = th.resourceFromAttributes(th.envDetector.detect().attributes || {}),
        _ = Y.merge(z).merge($).merge(O);
    if (FX()) {
        YjY(_);
        let D = new EF1.MeterProvider({
            resource: _,
            views: [],
            readers: A
        });
        return Gn1(D), Tq(async () => {
            let M = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
            try {
                PB1();
                let P = $N1(),
                    W = Y61(),
                    G = [];
                if (P) G.push(P.forceFlush());
                if (W) G.push(W.forceFlush());
                await Promise.all(G);
                let f = [D.shutdown()];
                if (P) f.push(P.shutdown());
                if (W) f.push(W.shutdown());
                await Promise.race([Promise.all(f), new Promise((Z, N) => setTimeout(() => N(Error("OpenTelemetry shutdown timeout")), M))])
            } catch {}
        }), D.getMeter("com.anthropic.claude_code", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.38",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-02-10T00:04:56Z"
        }.VERSION)
    }
    let J = new EF1.MeterProvider({
        resource: _,
        views: [],
        readers: A
    });
    if (Gn1(J), jj6()) {
        let D = e0Y();
        if (D.length > 0) {
            let j = new Fs.LoggerProvider({
                resource: _,
                processors: D.map((P) => new Fs.BatchLogRecordProcessor(P, {
                    scheduledDelayMillis: parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || mL4.toString())
                }))
            });
            vF1.logs.setGlobalLoggerProvider(j), Pn1(j);
            let M = vF1.logs.getLogger("com.anthropic.claude_code.events", {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.38",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-02-10T00:04:56Z"
            }.VERSION);
            Wn1(M), process.on("beforeExit", async () => {
                await j?.forceFlush(), await Y61()?.forceFlush()
            }), process.on("exit", () => {
                j?.forceFlush(), Y61()?.forceFlush()
            })
        }
    }
    if (jj6() && uMA()) {
        let D = AjY();
        if (D.length > 0) {
            let j = D.map((P) => new Qs.BatchSpanProcessor(P, {
                    scheduledDelayMillis: parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL || FL4.toString())
                })),
                M = new Qs.BasicTracerProvider({
                    resource: _,
                    spanProcessors: j
                });
            g31.trace.setGlobalTracerProvider(M), Zn1(M)
        }
    }
    return Tq(async () => {
        let D = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
        try {
            PB1();
            let j = [J.shutdown()],
                M = $N1();
            if (M) j.push(M.shutdown());
            let P = Y61();
            if (P) j.push(P.shutdown());
            await Promise.race([Promise.all(j), new Promise((W, G) => setTimeout(() => G(Error("OpenTelemetry shutdown timeout")), D))])
        } catch (j) {
            if (j instanceof Error && j.message.includes("timeout")) h(`
OpenTelemetry telemetry flush timed out after ${D}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${D}ms
`, {
                level: "error"
            });
            throw j
        }
    }), J.getMeter("com.anthropic.claude_code", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.38",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-02-10T00:04:56Z"
    }.VERSION)
}
// @from(Ln 304013, Col 0)
async function wjY() {
    let A = xL6();
    if (!A) return;
    let q = parseInt(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS || "5000");
    try {
        let K = [A.forceFlush()],
            Y = $N1();
        if (Y) K.push(Y.forceFlush());
        let z = Y61();
        if (z) K.push(z.forceFlush());
        await Promise.race([Promise.all(K), new Promise((w, H) => setTimeout(() => H(Error("OpenTelemetry flush timeout")), q))]), h("Telemetry flushed successfully")
    } catch (K) {
        if (K instanceof Error && K.message.includes("timeout")) h(`Telemetry flush timed out after ${q}ms. Some metrics may not be exported.`, {
            level: "warn"
        });
        else h(`Telemetry flush failed: ${K instanceof Error?K.message:String(K)}`, {
            level: "error"
        })
    }
}
// @from(Ln 304034, Col 0)
function HjY() {
    let A = {},
        q = process.env.OTEL_EXPORTER_OTLP_HEADERS;
    if (q)
        for (let K of q.split(",")) {
            let [Y, ...z] = K.split("=");
            if (Y && z.length > 0) A[Y.trim()] = z.join("=").trim()
        }
    return A
}
// @from(Ln 304045, Col 0)
function qTA() {
    let A = Vg(),
        q = mC(),
        K = C8(),
        Y = {},
        z = HjY();
    if (K?.otelHeadersHelper) Y.headers = async () => {
        let $ = wi8();
        return {
            ...z,
            ...$
        }
    };
    else if (Object.keys(z).length > 0) Y.headers = async () => z;
    let w = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!A || w && PL1(w)) {
        if (q) Y.httpAgentOptions = q;
        return Y
    }
    let H = ($) => {
        return q ? new sNA.HttpsProxyAgent(A, {
            cert: q.cert,
            key: q.key,
            passphrase: q.passphrase
        }) : new sNA.HttpsProxyAgent(A)
    };
    return Y.httpAgentOptions = H, Y
}
// @from(Ln 304073, Col 4)
g31
// @from(Ln 304073, Col 9)
vF1
// @from(Ln 304073, Col 14)
EF1
// @from(Ln 304073, Col 19)
CL4
// @from(Ln 304073, Col 24)
SL4
// @from(Ln 304073, Col 29)
hL4
// @from(Ln 304073, Col 34)
IL4
// @from(Ln 304073, Col 39)
tNA
// @from(Ln 304073, Col 44)
Fs
// @from(Ln 304073, Col 48)
xL4
// @from(Ln 304073, Col 53)
bL4
// @from(Ln 304073, Col 58)
eNA
// @from(Ln 304073, Col 63)
Qs
// @from(Ln 304073, Col 67)
uL4
// @from(Ln 304073, Col 72)
BL4
// @from(Ln 304073, Col 77)
ATA
// @from(Ln 304073, Col 82)
th
// @from(Ln 304073, Col 86)
ms
// @from(Ln 304073, Col 90)
sNA
// @from(Ln 304073, Col 95)
s0Y = 60000
// @from(Ln 304074, Col 4)
mL4 = 5000
// @from(Ln 304075, Col 4)
FL4 = 5000
// @from(Ln 304076, Col 4)
YTA = v(() => {
    RL4();
    yL4();
    Tz();
    bb();
    J7();
    B6();
    As();
    s_6();
    x3();
    J7();
    p8();
    Z6();
    Fl();
    YO1();
    hA();
    m6();
    MB1();
    g31 = o(Fq(), 1), vF1 = o(vWA(), 1), EF1 = o(Ps(), 1), CL4 = o(gP4(), 1), SL4 = o(AE4(), 1), hL4 = o(kD6(), 1), IL4 = o(_E4(), 1), tNA = o(Ps(), 1), Fs = o(qGA(), 1), xL4 = o(GE4(), 1), bL4 = o(vE4(), 1), eNA = o(hE4(), 1), Qs = o(zL4(), 1), uL4 = o(DL4(), 1), BL4 = o(ZL4(), 1), ATA = o(LL4(), 1), th = o(jM1(), 1), ms = o(q31(), 1), sNA = o(Dk1(), 1)
})
// @from(Ln 304096, Col 4)
gL4 = {}
// @from(Ln 304102, Col 0)
async function Mj6({
    clearOnboarding: A = !1
}) {
    let {
        flushTelemetry: q
    } = await Promise.resolve().then(() => (YTA(), KTA));
    await q(), await qi8(), T0().delete(), kF1(), jA((Y) => {
        let z = {
            ...Y
        };
        if (A) {
            if (z.hasCompletedOnboarding = !1, z.subscriptionNoticeCount = 0, z.hasAvailableSubscription = !1, z.customApiKeyResponses?.approved) z.customApiKeyResponses = {
                ...z.customApiKeyResponses,
                approved: []
            }
        }
        return z.oauthAccount = void 0, z
    })
}
// @from(Ln 304121, Col 0)
async function $jY() {
    await Mj6({
        clearOnboarding: !0
    });
    let A = zTA.createElement(V, null, "Successfully logged out from your Anthropic account.");
    return setTimeout(() => {
        w3(0, "logout")
    }, 200), A
}
// @from(Ln 304130, Col 4)
zTA
// @from(Ln 304130, Col 9)
kF1 = () => {
    a4.cache?.clear?.(), At1(), tp.cache?.clear?.(), UL4(), Ds.cache?.clear?.(), fGA(), H$A()
}
// @from(Ln 304133, Col 4)
Pj6 = v(() => {
    cA();
    m1();
    J7();
    ns1();
    Wk();
    _71();
    w$();
    TM1();
    Om1();
    mV();
    U4();
    zTA = o(X1(), 1)
})
// @from(Ln 304147, Col 0)
class LF1 {
    codeVerifier;
    authCodeListener = null;
    port = null;
    manualAuthCodeResolver = null;
    constructor() {
        this.codeVerifier = x74()
    }
    async startOAuthFlow(A, q) {
        this.authCodeListener = new jWA, this.port = await this.authCodeListener.start();
        let K = b74(this.codeVerifier),
            Y = u74(),
            z = {
                codeChallenge: K,
                state: Y,
                port: this.port,
                loginWithClaudeAi: q?.loginWithClaudeAi,
                inferenceOnly: q?.inferenceOnly,
                orgUUID: q?.orgUUID
            },
            w = mF6({
                ...z,
                isManual: !0
            }),
            H = mF6({
                ...z,
                isManual: !1
            }),
            $ = await this.waitForAuthorizationCode(Y, async () => {
                await A(w), await zY(H)
            }),
            O = this.authCodeListener?.hasPendingResponse() ?? !1;
        c("tengu_oauth_auth_code_received", {
            automatic: O
        });
        try {
            let _ = await D$8($, Y, this.codeVerifier, this.port, !O, q?.expiresIn);
            await Mj6({
                clearOnboarding: !1
            });
            let J = await FF6(_.access_token);
            if (_.account) QF6({
                accountUuid: _.account.uuid,
                emailAddress: _.account.email_address,
                organizationUuid: _.organization?.uuid,
                displayName: J.displayName,
                hasExtraUsageEnabled: J.hasExtraUsageEnabled ?? void 0,
                billingType: J.billingType ?? void 0,
                subscriptionCreatedAt: J.subscriptionCreatedAt
            });
            if (O) {
                let X = as1(_.scope);
                this.authCodeListener?.handleSuccessRedirect(X)
            }
            return this.formatTokens(_, J.subscriptionType, J.rateLimitTier)
        } catch (_) {
            if (O) this.authCodeListener?.handleErrorRedirect();
            throw _
        } finally {
            this.authCodeListener?.close()
        }
    }
    async waitForAuthorizationCode(A, q) {
        return new Promise((K, Y) => {
            this.manualAuthCodeResolver = K, this.authCodeListener?.waitForAuthorization(A, q).then((z) => {
                this.manualAuthCodeResolver = null, K(z)
            }).catch((z) => {
                this.manualAuthCodeResolver = null, Y(z)
            })
        })
    }
    handleManualAuthCodeInput(A) {
        if (this.manualAuthCodeResolver) this.manualAuthCodeResolver(A.authorizationCode), this.manualAuthCodeResolver = null, this.authCodeListener?.close()
    }
    formatTokens(A, q, K) {
        return {
            accessToken: A.access_token,
            refreshToken: A.refresh_token,
            expiresAt: Date.now() + A.expires_in * 1000,
            scopes: as1(A.scope),
            subscriptionType: q,
            rateLimitTier: K
        }
    }
    cleanup() {
        this.authCodeListener?.close(), this.manualAuthCodeResolver = null
    }
}
// @from(Ln 304235, Col 4)
wTA = v(() => {
    Oj();
    I74();
    B74();
    Pk();
    Pj6();
    u6()
})
// @from(Ln 304243, Col 0)
async function OjY() {
    try {
        if (J6(process.env.CLAUDE_CODE_USE_BEDROCK) || J6(process.env.CLAUDE_CODE_USE_VERTEX) || J6(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !0;
        return await sA.get("https://api.anthropic.com/api/hello", {
            timeout: 5000,
            headers: {
                "Cache-Control": "no-cache"
            }
        }), !0
    } catch (A) {
        if (!(A instanceof II6)) return !0;
        return A.code !== "EHOSTUNREACH"
    }
}
// @from(Ln 304258, Col 0)
function HTA() {
    let [A, q] = Wj6.useState(null);
    return Wj6.useEffect(() => {
        let K = !0;
        if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
        let Y = async () => {
            if (!K) return;
            let w = await OjY();
            if (K) q(w)
        };
        Y();
        let z = setInterval(Y, _jY);
        return () => {
            K = !1, clearInterval(z)
        }
    }, []), {
        isConnected: A
    }
}
// @from(Ln 304277, Col 4)
Wj6
// @from(Ln 304277, Col 9)
_jY = 30000
// @from(Ln 304278, Col 4)
pL4 = v(() => {
    y5();
    hA();
    Wj6 = o(X1(), 1)
})
// @from(Ln 304283, Col 0)
class GP1 {
    activeOperations = new Set;
    lastUserActivityTime = 0;
    lastCLIRecordedTime = Date.now();
    isCLIActive = !1;
    USER_ACTIVITY_TIMEOUT_MS = 5000;
    static instance = null;
    static getInstance() {
        if (!GP1.instance) GP1.instance = new GP1;
        return GP1.instance
    }
    recordUserActivity() {
        if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
            let q = (Date.now() - this.lastUserActivityTime) / 1000;
            if (q > 0) {
                let K = Mn1();
                if (K) {
                    let Y = this.USER_ACTIVITY_TIMEOUT_MS / 1000;
                    if (q < Y) K.add(q, {
                        type: "user"
                    })
                }
            }
        }
        this.lastUserActivityTime = Date.now()
    }
    startCLIActivity(A) {
        if (this.activeOperations.has(A)) this.endCLIActivity(A);
        let q = this.activeOperations.size === 0;
        if (this.activeOperations.add(A), q) this.isCLIActive = !0, this.lastCLIRecordedTime = Date.now()
    }
    endCLIActivity(A) {
        if (this.activeOperations.delete(A), this.activeOperations.size === 0) {
            let q = Date.now(),
                K = (q - this.lastCLIRecordedTime) / 1000;
            if (K > 0) {
                let Y = Mn1();
                if (Y) Y.add(K, {
                    type: "cli"
                })
            }
            this.lastCLIRecordedTime = q, this.isCLIActive = !1
        }
    }
    async trackOperation(A, q) {
        this.startCLIActivity(A);
        try {
            return await q()
        } finally {
            this.endCLIActivity(A)
        }
    }
    getActivityStates() {
        return {
            isUserActive: (Date.now() - this.lastUserActivityTime) / 1000 < this.USER_ACTIVITY_TIMEOUT_MS / 1000,
            isCLIActive: this.isCLIActive,
            activeOperationCount: this.activeOperations.size
        }
    }
}
// @from(Ln 304343, Col 4)
RF1
// @from(Ln 304344, Col 4)
$TA = v(() => {
    B6();
    RF1 = GP1.getInstance()
})
// @from(Ln 304349, Col 0)
function dL4() {
    let q = l4().spinnerVerbs;
    if (!q) return U31;
    if (q.mode === "replace") return q.verbs.length > 0 ? q.verbs : U31;
    return [...U31, ...q.verbs]
}
// @from(Ln 304355, Col 4)
U31
// @from(Ln 304356, Col 4)
Gj6 = v(() => {
    p8();
    U31 = ["Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking", "Beaming", "Beboppin'", "Befuddling", "Billowing", "Blanching", "Bloviating", "Boogieing", "Boondoggling", "Booping", "Bootstrapping", "Brewing", "Burrowing", "Calculating", "Canoodling", "Caramelizing", "Cascading", "Catapulting", "Cerebrating", "Channeling", "Channelling", "Choreographing", "Churning", "Clauding", "Coalescing", "Cogitating", "Combobulating", "Composing", "Computing", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Crystallizing", "Cultivating", "Deciphering", "Deliberating", "Determining", "Dilly-dallying", "Discombobulating", "Doing", "Doodling", "Drizzling", "Ebbing", "Effecting", "Elucidating", "Embellishing", "Enchanting", "Envisioning", "Evaporating", "Fermenting", "Fiddle-faddling", "Finagling", "Flambéing", "Flibbertigibbeting", "Flowing", "Flummoxing", "Fluttering", "Forging", "Forming", "Frolicking", "Frosting", "Gallivanting", "Galloping", "Garnishing", "Generating", "Germinating", "Gitifying", "Grooving", "Gusting", "Harmonizing", "Hashing", "Hatching", "Herding", "Honking", "Hullaballooing", "Hyperspacing", "Ideating", "Imagining", "Improvising", "Incubating", "Inferring", "Infusing", "Ionizing", "Jitterbugging", "Julienning", "Kneading", "Leavening", "Levitating", "Lollygagging", "Manifesting", "Marinating", "Meandering", "Metamorphosing", "Misting", "Moonwalking", "Moseying", "Mulling", "Mustering", "Musing", "Nebulizing", "Nesting", "Newspapering", "Noodling", "Nucleating", "Orbiting", "Orchestrating", "Osmosing", "Perambulating", "Percolating", "Perusing", "Philosophising", "Photosynthesizing", "Pollinating", "Pondering", "Pontificating", "Pouncing", "Precipitating", "Prestidigitating", "Processing", "Proofing", "Propagating", "Puttering", "Puzzling", "Quantumizing", "Razzle-dazzling", "Razzmatazzing", "Recombobulating", "Reticulating", "Roosting", "Ruminating", "Sautéing", "Scampering", "Schlepping", "Scurrying", "Seasoning", "Shenaniganing", "Shimmying", "Simmering", "Skedaddling", "Sketching", "Slithering", "Smooshing", "Sock-hopping", "Spelunking", "Spinning", "Sprouting", "Stewing", "Sublimating", "Swirling", "Swooping", "Symbioting", "Synthesizing", "Tempering", "Thinking", "Thundering", "Tinkering", "Tomfoolering", "Topsy-turvying", "Transfiguring", "Transmuting", "Twisting", "Undulating", "Unfurling", "Unravelling", "Vibing", "Waddling", "Wandering", "Warping", "Whatchamacalliting", "Whirlpooling", "Whirring", "Whisking", "Wibbling", "Working", "Wrangling", "Zesting", "Zigzagging"]
})
// @from(Ln 304361, Col 0)
function gs(A) {
    let q = e(10),
        {
            todos: K,
            isStandalone: Y
        } = A,
        z = Y === void 0 ? !1 : Y;
    if (K.length === 0) return null;
    let w;
    if (q[0] !== K) w = K.map(JjY), q[0] = K, q[1] = w;
    else w = q[1];
    let H;
    if (q[2] !== w) H = n$.createElement(n$.Fragment, null, w), q[2] = w, q[3] = H;
    else H = q[3];
    let $ = H;
    if (z) {
        let _;
        if (q[4] === Symbol.for("react.memo_cache_sentinel")) _ = n$.createElement(V, {
            bold: !0,
            dimColor: !0
        }, "Todos"), q[4] = _;
        else _ = q[4];
        let J;
        if (q[5] === Symbol.for("react.memo_cache_sentinel")) J = n$.createElement(I, null, _, n$.createElement(V, {
            dimColor: !0
        }, " · ", n$.createElement(YA, {
            shortcut: "ctrl+t",
            action: "hide todos",
            bold: !0
        }))), q[5] = J;
        else J = q[5];
        let X;
        if (q[6] !== $) X = n$.createElement(I, {
            flexDirection: "column",
            marginTop: 1,
            marginLeft: 2
        }, J, $), q[6] = $, q[7] = X;
        else X = q[7];
        return X
    }
    let O;
    if (q[8] !== $) O = n$.createElement(I, {
        flexDirection: "column"
    }, $), q[8] = $, q[9] = O;
    else O = q[9];
    return O
}
// @from(Ln 304409, Col 0)
function JjY(A, q) {
    let K = A.status === "completed" ? l1.checkboxOn : l1.checkboxOff;
    return n$.createElement(I, {
        key: q
    }, n$.createElement(V, {
        dimColor: A.status === "completed"
    }, K, " "), n$.createElement(V, {
        bold: A.status === "in_progress",
        dimColor: A.status === "completed",
        strikethrough: A.status === "completed"
    }, A.content))
}
// @from(Ln 304421, Col 4)
n$
// @from(Ln 304422, Col 4)
yF1 = v(() => {
    i1();
    m1();
    b7();
    wK();
    n$ = o(X1(), 1)
})
// @from(Ln 304430, Col 0)
function Zj6(A, q) {
    let K = parseInt(A.id, 10),
        Y = parseInt(q.id, 10);
    if (!isNaN(K) && !isNaN(Y)) return K - Y;
    return A.id.localeCompare(q.id)
}
// @from(Ln 304437, Col 0)
function fj6({
    tasks: A,
    isStandalone: q = !1
}) {
    let K = v6((m) => m.teamContext),
        Y = v6((m) => m.tasks),
        [, z] = NK.useState(0),
        {
            rows: w,
            columns: H
        } = Z8(),
        $ = w <= 10 ? 0 : Math.min(10, Math.max(3, w - 14)),
        O = new Set(A.filter((m) => m.status === "completed").map((m) => m.id)),
        _ = Date.now();
    for (let m of O)
        if (!lL4.has(m)) ZP1.set(m, _);
    for (let m of ZP1.keys())
        if (!O.has(m)) ZP1.delete(m);
    if (lL4 = O, NK.useEffect(() => {
            if (ZP1.size === 0) return;
            let m = Date.now(),
                b = 1 / 0;
            for (let U of ZP1.values()) {
                let x = U + cL4;
                if (x > m && x < b) b = x
            }
            if (b === 1 / 0) return;
            let g = setTimeout(() => z((U) => U + 1), b - m);
            return () => clearTimeout(g)
        }, [A]), !jH()) return null;
    if (A.length === 0) return null;
    let J = {};
    if (l8() && K?.teammates) {
        for (let m of Object.values(K.teammates))
            if (m.color) {
                let b = lO[m.color];
                if (b) J[m.name] = b
            }
    }
    let X = {},
        D = new Set;
    if (l8()) {
        for (let m of Object.values(Y))
            if (pO(m) && m.status === "running") {
                D.add(m.identity.agentName), D.add(m.identity.agentId);
                let b = m.progress?.recentActivities,
                    g = (b && rB(b)) ?? m.progress?.lastActivity?.activityDescription;
                if (g) X[m.identity.agentName] = g, X[m.identity.agentId] = g
            }
    }
    let j = A.filter((m) => m.status === "completed").length,
        M = A.filter((m) => m.status === "pending").length,
        P = A.length - j - M,
        W = new Set(A.filter((m) => m.status !== "completed").map((m) => m.id)),
        G = [],
        f = [];
    for (let m of A.filter((b) => b.status === "completed")) {
        let b = ZP1.get(m.id);
        if (b && _ - b < cL4) G.push(m);
        else f.push(m)
    }
    G.sort(Zj6), f.sort(Zj6);
    let Z = A.filter((m) => m.status === "in_progress").sort(Zj6),
        N = A.filter((m) => m.status === "pending").sort((m, b) => {
            let g = m.blockedBy.some((x) => W.has(x)),
                U = b.blockedBy.some((x) => W.has(x));
            if (g !== U) return g ? 1 : -1;
            return Zj6(m, b)
        }),
        T = [...G, ...Z, ...N, ...f],
        k = T.slice(0, $),
        y = T.slice($),
        B = "";
    if (y.length > 0) {
        let m = [],
            b = y.filter((x) => x.status === "pending").length,
            g = y.filter((x) => x.status === "in_progress").length,
            U = y.filter((x) => x.status === "completed").length;
        if (g > 0) m.push(`${g} in progress`);
        if (b > 0) m.push(`${b} pending`);
        if (U > 0) m.push(`${U} completed`);
        B = ` … +${m.join(", ")}`
    }
    let S = NK.createElement(NK.Fragment, null, k.map((m) => NK.createElement(DjY, {
        key: m.id,
        task: m,
        ownerColor: m.owner ? J[m.owner] : void 0,
        openBlockers: m.blockedBy.filter((b) => W.has(b)),
        activity: m.owner ? X[m.owner] : void 0,
        ownerActive: m.owner ? D.has(m.owner) : !1,
        columns: H
    })), $ > 0 && B && NK.createElement(V, {
        dimColor: !0
    }, B));
    if (q) return NK.createElement(I, {
        flexDirection: "column",
        marginTop: 1,
        marginLeft: 2
    }, NK.createElement(I, null, NK.createElement(V, {
        dimColor: !0
    }, NK.createElement(V, {
        bold: !0
    }, A.length), " tasks (", NK.createElement(V, {
        bold: !0
    }, j), " done, ", P > 0 && NK.createElement(NK.Fragment, null, NK.createElement(V, {
        bold: !0
    }, P), " in progress, "), NK.createElement(V, {
        bold: !0
    }, M), " open)")), S);
    return NK.createElement(I, {
        flexDirection: "column"
    }, S)
}
// @from(Ln 304551, Col 0)
function XjY(A) {
    switch (A) {
        case "completed":
            return {
                icon: l1.tick, color: "success"
            };
        case "in_progress":
            return {
                icon: l1.squareSmallFilled, color: "claude"
            };
        case "pending":
            return {
                icon: l1.squareSmall, color: void 0
            }
    }
}
// @from(Ln 304568, Col 0)
function DjY(A) {
    let q = e(37),
        {
            task: K,
            ownerColor: Y,
            openBlockers: z,
            activity: w,
            ownerActive: H,
            columns: $
        } = A,
        O = K.status === "completed",
        _ = K.status === "in_progress",
        J = z.length > 0,
        X;
    if (q[0] !== K.status) X = XjY(K.status), q[0] = K.status, q[1] = X;
    else X = q[1];
    let {
        icon: D,
        color: j
    } = X, M = _ && !J && w, P = $ >= 60 && K.owner && H, W;
    if (q[2] !== P || q[3] !== K.owner) W = P ? UA(` (@${K.owner})`) : 0, q[2] = P, q[3] = K.owner, q[4] = W;
    else W = q[4];
    let G = W,
        f = Math.max(15, $ - 15 - G),
        Z;
    if (q[5] !== f || q[6] !== K.subject) Z = K3(K.subject, f), q[5] = f, q[6] = K.subject, q[7] = Z;
    else Z = q[7];
    let N = Z,
        T = Math.max(15, $ - 15),
        k;
    if (q[8] !== w || q[9] !== T) k = w ? K3(w, T) : void 0, q[8] = w, q[9] = T, q[10] = k;
    else k = q[10];
    let y = k,
        B;
    if (q[11] !== j || q[12] !== D) B = NK.createElement(V, {
        color: j
    }, D, " "), q[11] = j, q[12] = D, q[13] = B;
    else B = q[13];
    let S = O || J,
        m;
    if (q[14] !== N || q[15] !== O || q[16] !== _ || q[17] !== S) m = NK.createElement(V, {
        bold: _,
        strikethrough: O,
        dimColor: S
    }, N), q[14] = N, q[15] = O, q[16] = _, q[17] = S, q[18] = m;
    else m = q[18];
    let b;
    if (q[19] !== Y || q[20] !== P || q[21] !== K.owner) b = P && NK.createElement(V, {
        dimColor: !0
    }, " (", Y ? NK.createElement(V, {
        color: Y
    }, "@", K.owner) : `@${K.owner}`, ")"), q[19] = Y, q[20] = P, q[21] = K.owner, q[22] = b;
    else b = q[22];
    let g;
    if (q[23] !== J || q[24] !== z) g = J && NK.createElement(V, {
        dimColor: !0
    }, " ", l1.pointerSmall, " blocked by", " ", [...z].sort(MjY).map(jjY).join(", ")), q[23] = J, q[24] = z, q[25] = g;
    else g = q[25];
    let U;
    if (q[26] !== B || q[27] !== m || q[28] !== b || q[29] !== g) U = NK.createElement(I, null, B, m, b, g), q[26] = B, q[27] = m, q[28] = b, q[29] = g, q[30] = U;
    else U = q[30];
    let x;
    if (q[31] !== y || q[32] !== M) x = M && y && NK.createElement(I, null, NK.createElement(V, {
        dimColor: !0
    }, "  ", y, l1.ellipsis)), q[31] = y, q[32] = M, q[33] = x;
    else x = q[33];
    let p;
    if (q[34] !== U || q[35] !== x) p = NK.createElement(I, {
        flexDirection: "column"
    }, U, x), q[34] = U, q[35] = x, q[36] = p;
    else p = q[36];
    return p
}
// @from(Ln 304642, Col 0)
function jjY(A) {
    return `#${A}`
}
// @from(Ln 304646, Col 0)
function MjY(A, q) {
    return parseInt(A, 10) - parseInt(q, 10)
}
// @from(Ln 304649, Col 4)
NK
// @from(Ln 304649, Col 8)
cL4 = 30000
// @from(Ln 304650, Col 4)
ZP1
// @from(Ln 304650, Col 9)
lL4
// @from(Ln 304651, Col 4)
OTA = v(() => {
    i1();
    m1();
    b7();
    vw();
    d8();
    lM();
    UC1();
    S9();
    mq();
    Eh();
    LY();
    vq();
    NK = o(X1(), 1);
    ZP1 = new Map, lL4 = new Set
})
// @from(Ln 304672, Col 0)
function VP1() {
    let A = v6((Y) => Y.teamContext),
        q = L7(),
        [, K] = Vj6.useState(0);
    if (Vj6.useEffect(() => {
            if (!jH() || A && !PM(A)) return;
            a0A();
            let Y = null,
                z = null,
                w = null,
                H = null;

            function $() {
                let D = WM(),
                    j = WX(D).filter((P) => !P.metadata?._internal);
                fP1 = j;
                let M = j.some((P) => P.status !== "completed");
                if (M || j.length === 0) {
                    if (p31 = null, Y) clearTimeout(Y), Y = null;
                    if (j.length === 0) q((P) => {
                        if (P.expandedView !== "tasks") return P;
                        return {
                            ...P,
                            expandedView: "none"
                        }
                    })
                } else if (p31 === null) p31 = Date.now(), Y = setTimeout(() => {
                    let P = WX(D);
                    if (P.length > 0 && P.every((G) => G.status === "completed")) aq6(D), fP1 = [], p31 = null, q((G) => {
                        if (G.expandedView !== "tasks") return G;
                        return {
                            ...G,
                            expandedView: "none"
                        }
                    });
                    K((G) => G + 1)
                }, iL4);
                if (K((P) => P + 1), w) clearTimeout(w), w = null;
                if (M) w = setTimeout(O, ZjY)
            }

            function O() {
                if (z) clearTimeout(z);
                z = setTimeout($, GjY)
            }
            $();
            let _ = j67(O),
                J = WM(),
                X = WL(J);
            if (WjY(X)) try {
                H = PjY(X, O)
            } catch {}
            return () => {
                if (fP1 = void 0, p31 = null, _(), H) H.close();
                if (w) clearTimeout(w);
                if (z) clearTimeout(z);
                if (Y) clearTimeout(Y)
            }
        }, [A, q]), !fP1 || fP1.length === 0) return;
    if (p31 !== null && Date.now() - p31 >= iL4) return;
    return fP1
}
// @from(Ln 304734, Col 4)
Vj6
// @from(Ln 304734, Col 9)
iL4 = 5000
// @from(Ln 304735, Col 4)
GjY = 50
// @from(Ln 304736, Col 4)
ZjY = 5000
// @from(Ln 304737, Col 4)
p31 = null
// @from(Ln 304738, Col 4)
fP1 = void 0
// @from(Ln 304739, Col 4)
Nj6 = v(() => {
    vw();
    pB();
    Cz();
    d8();
    Vj6 = o(X1(), 1)
})
// @from(Ln 304747, Col 0)
function CF1() {
    if (process.env.TERM === "xterm-ghostty") return ["·", "✢", "✳", "✶", "✻", "*"];
    return process.platform === "darwin" ? ["·", "✢", "✳", "✶", "✻", "✽"] : ["·", "✢", "*", "✶", "✻", "✽"]
}
// @from(Ln 304752, Col 0)
function Wd(A, q, K) {
    return {
        r: Math.round(A.r + (q.r - A.r) * K),
        g: Math.round(A.g + (q.g - A.g) * K),
        b: Math.round(A.b + (q.b - A.b) * K)
    }
}
// @from(Ln 304760, Col 0)
function Us(A) {
    return `rgb(${A.r},${A.g},${A.b})`
}
// @from(Ln 304764, Col 0)
function d31(A) {
    let q = nL4.get(A);
    if (q !== void 0) return q;
    let K = A.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/),
        Y = K ? {
            r: parseInt(K[1], 10),
            g: parseInt(K[2], 10),
            b: parseInt(K[3], 10)
        } : null;
    return nL4.set(A, Y), Y
}
// @from(Ln 304775, Col 4)
nL4
// @from(Ln 304776, Col 4)
NP1 = v(() => {
    nL4 = new Map
})
// @from(Ln 304779, Col 4)
fjY
// @from(Ln 304780, Col 4)
rL4 = v(() => {
    i1();
    m1();
    Wu();
    NP1();
    fjY = o(X1(), 1)
})
// @from(Ln 304788, Col 0)
function JTA(A) {
    let q = e(3),
        {
            char: K,
            index: Y,
            glimmerIndex: z,
            messageColor: w,
            shimmerColor: H
        } = A,
        $ = Y === z,
        O = Math.abs(Y - z) === 1,
        J = $ || O ? H : w,
        X;
    if (q[0] !== K || q[1] !== J) X = _TA.createElement(V, {
        color: J
    }, K), q[0] = K, q[1] = J, q[2] = X;
    else X = q[2];
    return X
}
// @from(Ln 304807, Col 4)
_TA
// @from(Ln 304808, Col 4)
Tj6 = v(() => {
    i1();
    m1();
    _TA = o(X1(), 1)
})
// @from(Ln 304814, Col 0)
function XTA(A) {
    let q = e(70),
        {
            message: K,
            mode: Y,
            isConnected: z,
            messageColor: w,
            glimmerIndex: H,
            flashOpacity: $,
            shimmerColor: O,
            stalledIntensity: _
        } = A,
        J = _ === void 0 ? 0 : _,
        [X] = T7(),
        D;
    if (q[0] !== $ || q[1] !== z || q[2] !== K || q[3] !== w || q[4] !== Y || q[5] !== O || q[6] !== J || q[7] !== X) {
        D = Symbol.for("react.early_return_sentinel");
        A: {
            let m = MW(X);
            if (!K) {
                D = null;
                break A
            }
            if (z === !1) {
                let b;
                if (q[9] !== K || q[10] !== w) b = nq.createElement(V, {
                    color: w
                }, K, " "), q[9] = K, q[10] = w, q[11] = b;
                else b = q[11];
                D = b;
                break A
            }
            if (J > 0) {
                let b = m[w],
                    g = b ? d31(b) : null;
                if (g) {
                    let r = Wd(g, VjY, J),
                        s = Us(r),
                        O1;
                    if (q[12] !== s) O1 = nq.createElement(V, {
                        color: s
                    }, " "), q[12] = s, q[13] = O1;
                    else O1 = q[13];
                    D = nq.createElement(nq.Fragment, null, nq.createElement(V, {
                        color: s
                    }, K), O1);
                    break A
                }
                let U = J > 0.5 ? "error" : w,
                    x;
                if (q[14] !== U || q[15] !== K) x = nq.createElement(V, {
                    color: U
                }, K), q[14] = U, q[15] = K, q[16] = x;
                else x = q[16];
                let p;
                if (q[17] !== U) p = nq.createElement(V, {
                    color: U
                }, " "), q[17] = U, q[18] = p;
                else p = q[18];
                let l;
                if (q[19] !== x || q[20] !== p) l = nq.createElement(nq.Fragment, null, x, p), q[19] = x, q[20] = p, q[21] = l;
                else l = q[21];
                D = l;
                break A
            }
            if (Y === "tool-use") {
                let b = m[w],
                    g = m[O],
                    U = b ? d31(b) : null,
                    x = g ? d31(g) : null;
                if (U && x) {
                    let O1 = Wd(U, x, $),
                        T1 = nq.createElement(V, {
                            color: Us(O1)
                        }, K),
                        N1;
                    if (q[22] !== w) N1 = nq.createElement(V, {
                        color: w
                    }, " "), q[22] = w, q[23] = N1;
                    else N1 = q[23];
                    let j1;
                    if (q[24] !== T1 || q[25] !== N1) j1 = nq.createElement(nq.Fragment, null, T1, N1), q[24] = T1, q[25] = N1, q[26] = j1;
                    else j1 = q[26];
                    D = j1;
                    break A
                }
                let p = $ > 0.5 ? O : w,
                    l;
                if (q[27] !== p || q[28] !== K) l = nq.createElement(V, {
                    color: p
                }, K), q[27] = p, q[28] = K, q[29] = l;
                else l = q[29];
                let r;
                if (q[30] !== w) r = nq.createElement(V, {
                    color: w
                }, " "), q[30] = w, q[31] = r;
                else r = q[31];
                let s;
                if (q[32] !== l || q[33] !== r) s = nq.createElement(nq.Fragment, null, l, r), q[32] = l, q[33] = r, q[34] = s;
                else s = q[34];
                D = s;
                break A
            }
        }
        q[0] = $, q[1] = z, q[2] = K, q[3] = w, q[4] = Y, q[5] = O, q[6] = J, q[7] = X, q[8] = D
    } else D = q[8];
    if (D !== Symbol.for("react.early_return_sentinel")) return D;
    let j = H - 1,
        M = H + 1,
        P = UA(K);
    if (j >= P || M < 0) {
        let m;
        if (q[35] !== K || q[36] !== w) m = nq.createElement(V, {
            color: w
        }, K), q[35] = K, q[36] = w, q[37] = m;
        else m = q[37];
        let b;
        if (q[38] !== w) b = nq.createElement(V, {
            color: w
        }, " "), q[38] = w, q[39] = b;
        else b = q[39];
        let g;
        if (q[40] !== m || q[41] !== b) g = nq.createElement(nq.Fragment, null, m, b), q[40] = m, q[41] = b, q[42] = g;
        else g = q[42];
        return g
    }
    let W = Math.max(0, j),
        G = 0,
        f = "",
        Z = "",
        N = "";
    if (q[43] !== N || q[44] !== f || q[45] !== W || q[46] !== G || q[47] !== K || q[48] !== Z || q[49] !== M) {
        for (let {
                segment: m
            }
            of T_().segment(K)) {
            let b = UA(m);
            if (G + b <= W) f = f + m;
            else if (G > M) N = N + m;
            else Z = Z + m;
            G = G + b
        }
        q[43] = N, q[44] = f, q[45] = W, q[46] = G, q[47] = K, q[48] = Z, q[49] = M, q[50] = f, q[51] = N, q[52] = Z, q[53] = G
    } else f = q[50], N = q[51], Z = q[52], G = q[53];
    let T;
    if (q[54] !== f || q[55] !== w) T = f && nq.createElement(V, {
        color: w
    }, f), q[54] = f, q[55] = w, q[56] = T;
    else T = q[56];
    let k;
    if (q[57] !== Z || q[58] !== O) k = nq.createElement(V, {
        color: O
    }, Z), q[57] = Z, q[58] = O, q[59] = k;
    else k = q[59];
    let y;
    if (q[60] !== N || q[61] !== w) y = N && nq.createElement(V, {
        color: w
    }, N), q[60] = N, q[61] = w, q[62] = y;
    else y = q[62];
    let B;
    if (q[63] !== w) B = nq.createElement(V, {
        color: w
    }, " "), q[63] = w, q[64] = B;
    else B = q[64];
    let S;
    if (q[65] !== T || q[66] !== k || q[67] !== y || q[68] !== B) S = nq.createElement(nq.Fragment, null, T, k, y, B), q[65] = T, q[66] = k, q[67] = y, q[68] = B, q[69] = S;
    else S = q[69];
    return S
}
// @from(Ln 304983, Col 4)
nq
// @from(Ln 304983, Col 8)
VjY
// @from(Ln 304984, Col 4)
oL4 = v(() => {
    i1();
    m1();
    LY();
    Wu();
    OS();
    NP1();
    nq = o(X1(), 1), VjY = {
        r: 171,
        g: 43,
        b: 63
    }
})
// @from(Ln 304998, Col 0)
function SF1(A) {
    let q = e(12),
        {
            frame: K,
            messageColor: Y,
            stalledIntensity: z,
            isConnected: w,
            reducedMotion: H,
            time: $
        } = A,
        O = z === void 0 ? 0 : z,
        _ = H === void 0 ? !1 : H,
        J = $ === void 0 ? 0 : $,
        [X] = T7(),
        D = MW(X);
    if (_) {
        let P = Math.floor(J / (TjY / 2)) % 2 === 1,
            W;
        if (q[0] !== P || q[1] !== Y) W = yJ.createElement(I, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, yJ.createElement(V, {
            color: Y,
            dimColor: P
        }, NjY)), q[0] = P, q[1] = Y, q[2] = W;
        else W = q[2];
        return W
    }
    let j = sL4[K % sL4.length];
    if (w === !1) {
        let P;
        if (q[3] !== Y || q[4] !== j) P = yJ.createElement(I, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, yJ.createElement(V, {
            color: Y
        }, j)), q[3] = Y, q[4] = j, q[5] = P;
        else P = q[5];
        return P
    }
    if (O > 0) {
        let P = D[Y],
            W = P ? d31(P) : null;
        if (W) {
            let Z = Wd(W, vjY, O);
            return yJ.createElement(I, {
                flexWrap: "wrap",
                height: 1,
                width: 2
            }, yJ.createElement(V, {
                color: Us(Z)
            }, j))
        }
        let G = O > 0.5 ? "error" : Y,
            f;
        if (q[6] !== G || q[7] !== j) f = yJ.createElement(I, {
            flexWrap: "wrap",
            height: 1,
            width: 2
        }, yJ.createElement(V, {
            color: G
        }, j)), q[6] = G, q[7] = j, q[8] = f;
        else f = q[8];
        return f
    }
    let M;
    if (q[9] !== Y || q[10] !== j) M = yJ.createElement(I, {
        flexWrap: "wrap",
        height: 1,
        width: 2
    }, yJ.createElement(V, {
        color: Y
    }, j)), q[9] = Y, q[10] = j, q[11] = M;
    else M = q[11];
    return M
}
// @from(Ln 305076, Col 4)
yJ
// @from(Ln 305076, Col 8)
aL4
// @from(Ln 305076, Col 13)
sL4
// @from(Ln 305076, Col 18)
NjY = "●"
// @from(Ln 305077, Col 4)
TjY = 2000
// @from(Ln 305078, Col 4)
vjY
// @from(Ln 305079, Col 4)
DTA = v(() => {
    i1();
    m1();
    Wu();
    NP1();
    yJ = o(X1(), 1), aL4 = CF1(), sL4 = [...aL4, ...[...aL4].reverse()], vjY = {
        r: 171,
        g: 43,
        b: 63
    }
})
// @from(Ln 305091, Col 0)
function hF1(A, q, K, Y) {
    let z = A === "requesting" ? 50 : 200,
        [w, H] = Nv(z);
    if (K === !1 || Y) return [w, -100];
    let $ = Math.floor(H / z),
        O = UA(q),
        _ = O + 20;
    if (A === "requesting") return [w, $ % _ - 10];
    return [w, O + 10 - $ % _]
}
// @from(Ln 305101, Col 4)
vj6 = v(() => {
    m1();
    LY()
})
// @from(Ln 305106, Col 0)
function jTA(A, q, K = !1, Y = !1) {
    let z = TP1.useRef(A),
        w = TP1.useRef(q),
        H = TP1.useRef(A),
        $ = TP1.useRef(0),
        O = TP1.useRef(A);
    if (q > w.current) z.current = A, w.current = q, $.current = 0, O.current = A;
    let _;
    if (K) _ = 0, z.current = A;
    else if (q > 0) _ = A - z.current;
    else _ = A - H.current;
    let J = _ > 3000 && !K,
        X = J ? Math.min((_ - 3000) / 2000, 1) : 0;
    if (!Y && (X > 0 || $.current > 0)) {
        let j = A - O.current;
        if (j >= 50) {
            let M = Math.floor(j / 50),
                P = $.current;
            for (let W = 0; W < M; W++) {
                let G = X - P;
                if (Math.abs(G) < 0.01) {
                    P = X;
                    break
                }
                P += G * 0.1
            }
            $.current = P, O.current = A
        }
    } else $.current = X, O.current = A;
    let D = Y ? X : $.current;
    return {
        isStalled: J,
        stalledIntensity: D
    }
}
// @from(Ln 305141, Col 4)
TP1
// @from(Ln 305142, Col 4)
tL4 = v(() => {
    TP1 = o(X1(), 1)
})
// @from(Ln 305145, Col 4)
eL4 = v(() => {
    rL4();
    Tj6();
    oL4();
    DTA();
    vj6();
    tL4();
    NP1()
})
// @from(Ln 305155, Col 0)
function pv(A, q) {
    return `${A}@${q}`
}