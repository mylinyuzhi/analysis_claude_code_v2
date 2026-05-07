
// @from(Ln 297091, Col 4)
Fr4 = p((Br4) => {
    Object.defineProperty(Br4, "__esModule", {
        value: !0
    });
    Br4.SpanImpl = void 0;
    var Bx = $5(),
        WT = t_(),
        FJ6 = i26(),
        HSz = ur4();
    class mr4 {
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
            code: Bx.SpanStatusCode.UNSET
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
        constructor(q) {
            let K = Date.now();
            if (this._spanContext = q.spanContext, this._performanceStartTime = WT.otperformance.now(), this._performanceOffset = K - (this._performanceStartTime + (0, WT.getTimeOrigin)()), this._startTimeProvided = q.startTime != null, this._spanLimits = q.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = q.spanProcessor, this.name = q.name, this.parentSpanContext = q.parentSpanContext, this.kind = q.kind, this.links = q.links || [], this.startTime = this._getTime(q.startTime ?? K), this.resource = q.resource, this.instrumentationScope = q.scope, q.attributes != null) this.setAttributes(q.attributes);
            this._spanProcessor.onStart(this, q.context)
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(q, K) {
            if (K == null || this._isSpanEnded()) return this;
            if (q.length === 0) return Bx.diag.warn(`Invalid attribute key: ${q}`), this;
            if (!(0, WT.isAttributeValue)(K)) return Bx.diag.warn(`Invalid attribute value set for key: ${q}`), this;
            let {
                attributeCountLimit: _
            } = this._spanLimits;
            if (_ !== void 0 && Object.keys(this.attributes).length >= _ && !Object.prototype.hasOwnProperty.call(this.attributes, q)) return this._droppedAttributesCount++, this;
            return this.attributes[q] = this._truncateToSize(K), this
        }
        setAttributes(q) {
            for (let [K, _] of Object.entries(q)) this.setAttribute(K, _);
            return this
        }
        addEvent(q, K, _) {
            if (this._isSpanEnded()) return this;
            let {
                eventCountLimit: z
            } = this._spanLimits;
            if (z === 0) return Bx.diag.warn("No events allowed."), this._droppedEventsCount++, this;
            if (z !== void 0 && this.events.length >= z) {
                if (this._droppedEventsCount === 0) Bx.diag.debug("Dropping extra events.");
                this.events.shift(), this._droppedEventsCount++
            }
            if ((0, WT.isTimeInput)(K)) {
                if (!(0, WT.isTimeInput)(_)) _ = K;
                K = void 0
            }
            let Y = (0, WT.sanitizeAttributes)(K);
            return this.events.push({
                name: q,
                attributes: Y,
                time: this._getTime(_),
                droppedAttributesCount: 0
            }), this
        }
        addLink(q) {
            return this.links.push(q), this
        }
        addLinks(q) {
            return this.links.push(...q), this
        }
        setStatus(q) {
            if (this._isSpanEnded()) return this;
            if (this.status = {
                    ...q
                }, this.status.message != null && typeof q.message !== "string") Bx.diag.warn(`Dropping invalid status.message of type '${typeof q.message}', expected 'string'`), delete this.status.message;
            return this
        }
        updateName(q) {
            if (this._isSpanEnded()) return this;
            return this.name = q, this
        }
        end(q) {
            if (this._isSpanEnded()) {
                Bx.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
                return
            }
            if (this._ended = !0, this.endTime = this._getTime(q), this._duration = (0, WT.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) Bx.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
            if (this._droppedEventsCount > 0) Bx.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
            this._spanProcessor.onEnd(this)
        }
        _getTime(q) {
            if (typeof q === "number" && q <= WT.otperformance.now()) return (0, WT.hrTime)(q + this._performanceOffset);
            if (typeof q === "number") return (0, WT.millisToHrTime)(q);
            if (q instanceof Date) return (0, WT.millisToHrTime)(q.getTime());
            if ((0, WT.isTimeInputHrTime)(q)) return q;
            if (this._startTimeProvided) return (0, WT.millisToHrTime)(Date.now());
            let K = WT.otperformance.now() - this._performanceStartTime;
            return (0, WT.addHrTimes)(this.startTime, (0, WT.millisToHrTime)(K))
        }
        isRecording() {
            return this._ended === !1
        }
        recordException(q, K) {
            let _ = {};
            if (typeof q === "string") _[FJ6.ATTR_EXCEPTION_MESSAGE] = q;
            else if (q) {
                if (q.code) _[FJ6.ATTR_EXCEPTION_TYPE] = q.code.toString();
                else if (q.name) _[FJ6.ATTR_EXCEPTION_TYPE] = q.name;
                if (q.message) _[FJ6.ATTR_EXCEPTION_MESSAGE] = q.message;
                if (q.stack) _[FJ6.ATTR_EXCEPTION_STACKTRACE] = q.stack
            }
            if (_[FJ6.ATTR_EXCEPTION_TYPE] || _[FJ6.ATTR_EXCEPTION_MESSAGE]) this.addEvent(HSz.ExceptionEventName, _, K);
            else Bx.diag.warn(`Failed to record an exception ${q}`)
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
                let q = Error(`Operation attempted on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`);
                Bx.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, q)
            }
            return this._ended
        }
        _truncateToLimitUtil(q, K) {
            if (q.length <= K) return q;
            return q.substring(0, K)
        }
        _truncateToSize(q) {
            let K = this._attributeValueLengthLimit;
            if (K <= 0) return Bx.diag.warn(`Attribute value limit must be positive, got ${K}`), q;
            if (typeof q === "string") return this._truncateToLimitUtil(q, K);
            if (Array.isArray(q)) return q.map((_) => typeof _ === "string" ? this._truncateToLimitUtil(_, K) : _);
            return q
        }
    }
    Br4.SpanImpl = mr4
})
// @from(Ln 297256, Col 4)
x78 = p((gr4) => {
    Object.defineProperty(gr4, "__esModule", {
        value: !0
    });
    gr4.SamplingDecision = void 0;
    var JSz;
    (function(q) {
        q[q.NOT_RECORD = 0] = "NOT_RECORD", q[q.RECORD = 1] = "RECORD", q[q.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    })(JSz = gr4.SamplingDecision || (gr4.SamplingDecision = {}))
})
// @from(Ln 297266, Col 4)
Ym8 = p((Qr4) => {
    Object.defineProperty(Qr4, "__esModule", {
        value: !0
    });
    Qr4.AlwaysOffSampler = void 0;
    var XSz = x78();
    class Ur4 {
        shouldSample() {
            return {
                decision: XSz.SamplingDecision.NOT_RECORD
            }
        }
        toString() {
            return "AlwaysOffSampler"
        }
    }
    Qr4.AlwaysOffSampler = Ur4
})
// @from(Ln 297284, Col 4)
Am8 = p((lr4) => {
    Object.defineProperty(lr4, "__esModule", {
        value: !0
    });
    lr4.AlwaysOnSampler = void 0;
    var MSz = x78();
    class cr4 {
        shouldSample() {
            return {
                decision: MSz.SamplingDecision.RECORD_AND_SAMPLED
            }
        }
        toString() {
            return "AlwaysOnSampler"
        }
    }
    lr4.AlwaysOnSampler = cr4
})
// @from(Ln 297302, Col 4)
ws1 = p((or4) => {
    Object.defineProperty(or4, "__esModule", {
        value: !0
    });
    or4.ParentBasedSampler = void 0;
    var Om8 = $5(),
        PSz = t_(),
        ir4 = Ym8(),
        Os1 = Am8();
    class rr4 {
        _root;
        _remoteParentSampled;
        _remoteParentNotSampled;
        _localParentSampled;
        _localParentNotSampled;
        constructor(q) {
            if (this._root = q.root, !this._root)(0, PSz.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new Os1.AlwaysOnSampler;
            this._remoteParentSampled = q.remoteParentSampled ?? new Os1.AlwaysOnSampler, this._remoteParentNotSampled = q.remoteParentNotSampled ?? new ir4.AlwaysOffSampler, this._localParentSampled = q.localParentSampled ?? new Os1.AlwaysOnSampler, this._localParentNotSampled = q.localParentNotSampled ?? new ir4.AlwaysOffSampler
        }
        shouldSample(q, K, _, z, Y, A) {
            let O = Om8.trace.getSpanContext(q);
            if (!O || !(0, Om8.isSpanContextValid)(O)) return this._root.shouldSample(q, K, _, z, Y, A);
            if (O.isRemote) {
                if (O.traceFlags & Om8.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(q, K, _, z, Y, A);
                return this._remoteParentNotSampled.shouldSample(q, K, _, z, Y, A)
            }
            if (O.traceFlags & Om8.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(q, K, _, z, Y, A);
            return this._localParentNotSampled.shouldSample(q, K, _, z, Y, A)
        }
        toString() {
            return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
        }
    }
    or4.ParentBasedSampler = rr4
})
// @from(Ln 297337, Col 4)
$s1 = p((er4) => {
    Object.defineProperty(er4, "__esModule", {
        value: !0
    });
    er4.TraceIdRatioBasedSampler = void 0;
    var WSz = $5(),
        sr4 = x78();
    class tr4 {
        _ratio;
        _upperBound;
        constructor(q = 0) {
            this._ratio = q, this._ratio = this._normalize(q), this._upperBound = Math.floor(this._ratio * 4294967295)
        }
        shouldSample(q, K) {
            return {
                decision: (0, WSz.isValidTraceId)(K) && this._accumulate(K) < this._upperBound ? sr4.SamplingDecision.RECORD_AND_SAMPLED : sr4.SamplingDecision.NOT_RECORD
            }
        }
        toString() {
            return `TraceIdRatioBased{${this._ratio}}`
        }
        _normalize(q) {
            if (typeof q !== "number" || isNaN(q)) return 0;
            return q >= 1 ? 1 : q <= 0 ? 0 : q
        }
        _accumulate(q) {
            let K = 0;
            for (let _ = 0; _ < q.length / 8; _++) {
                let z = _ * 8,
                    Y = parseInt(q.slice(z, z + 8), 16);
                K = (K ^ Y) >>> 0
            }
            return K
        }
    }
    er4.TraceIdRatioBasedSampler = tr4
})
// @from(Ln 297374, Col 4)
Js1 = p((Ao4) => {
    Object.defineProperty(Ao4, "__esModule", {
        value: !0
    });
    Ao4.buildSamplerFromEnv = Ao4.loadDefaultConfig = void 0;
    var Hs1 = $5(),
        zl = t_(),
        Ko4 = Ym8(),
        js1 = Am8(),
        wm8 = ws1(),
        _o4 = $s1(),
        Yl;
    (function(q) {
        q.AlwaysOff = "always_off", q.AlwaysOn = "always_on", q.ParentBasedAlwaysOff = "parentbased_always_off", q.ParentBasedAlwaysOn = "parentbased_always_on", q.ParentBasedTraceIdRatio = "parentbased_traceidratio", q.TraceIdRatio = "traceidratio"
    })(Yl || (Yl = {}));
    var $m8 = 1;

    function DSz() {
        return {
            sampler: Yo4(),
            forceFlushTimeoutMillis: 30000,
            generalLimits: {
                attributeValueLengthLimit: (0, zl.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
                attributeCountLimit: (0, zl.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
            },
            spanLimits: {
                attributeValueLengthLimit: (0, zl.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
                attributeCountLimit: (0, zl.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
                linkCountLimit: (0, zl.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
                eventCountLimit: (0, zl.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
                attributePerEventCountLimit: (0, zl.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
                attributePerLinkCountLimit: (0, zl.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
            }
        }
    }
    Ao4.loadDefaultConfig = DSz;

    function Yo4() {
        let q = (0, zl.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? Yl.ParentBasedAlwaysOn;
        switch (q) {
            case Yl.AlwaysOn:
                return new js1.AlwaysOnSampler;
            case Yl.AlwaysOff:
                return new Ko4.AlwaysOffSampler;
            case Yl.ParentBasedAlwaysOn:
                return new wm8.ParentBasedSampler({
                    root: new js1.AlwaysOnSampler
                });
            case Yl.ParentBasedAlwaysOff:
                return new wm8.ParentBasedSampler({
                    root: new Ko4.AlwaysOffSampler
                });
            case Yl.TraceIdRatio:
                return new _o4.TraceIdRatioBasedSampler(zo4());
            case Yl.ParentBasedTraceIdRatio:
                return new wm8.ParentBasedSampler({
                    root: new _o4.TraceIdRatioBasedSampler(zo4())
                });
            default:
                return Hs1.diag.error(`OTEL_TRACES_SAMPLER value "${q}" invalid, defaulting to "${Yl.ParentBasedAlwaysOn}".`), new wm8.ParentBasedSampler({
                    root: new js1.AlwaysOnSampler
                })
        }
    }
    Ao4.buildSamplerFromEnv = Yo4;

    function zo4() {
        let q = (0, zl.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
        if (q == null) return Hs1.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${$m8}.`), $m8;
        if (q < 0 || q > 1) return Hs1.diag.error(`OTEL_TRACES_SAMPLER_ARG=${q} was given, but it is out of range ([0..1]), defaulting to ${$m8}.`), $m8;
        return q
    }
})
// @from(Ln 297447, Col 4)
Xs1 = p(($o4) => {
    Object.defineProperty($o4, "__esModule", {
        value: !0
    });
    $o4.reconfigureLimits = $o4.mergeConfig = $o4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = $o4.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
    var wo4 = Js1(),
        jm8 = t_();
    $o4.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
    $o4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

    function fSz(q) {
        let K = {
                sampler: (0, wo4.buildSamplerFromEnv)()
            },
            _ = (0, wo4.loadDefaultConfig)(),
            z = Object.assign({}, _, K, q);
        return z.generalLimits = Object.assign({}, _.generalLimits, q.generalLimits || {}), z.spanLimits = Object.assign({}, _.spanLimits, q.spanLimits || {}), z
    }
    $o4.mergeConfig = fSz;

    function GSz(q) {
        let K = Object.assign({}, q.spanLimits);
        return K.attributeCountLimit = q.spanLimits?.attributeCountLimit ?? q.generalLimits?.attributeCountLimit ?? (0, jm8.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, jm8.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? $o4.DEFAULT_ATTRIBUTE_COUNT_LIMIT, K.attributeValueLengthLimit = q.spanLimits?.attributeValueLengthLimit ?? q.generalLimits?.attributeValueLengthLimit ?? (0, jm8.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, jm8.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? $o4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, q, {
            spanLimits: K
        })
    }
    $o4.reconfigureLimits = GSz
})
// @from(Ln 297475, Col 4)
Wo4 = p((Mo4) => {
    Object.defineProperty(Mo4, "__esModule", {
        value: !0
    });
    Mo4.BatchSpanProcessorBase = void 0;
    var wS6 = $5(),
        Jt = t_();
    class Xo4 {
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
        constructor(q, K) {
            if (this._exporter = q, this._maxExportBatchSize = typeof K?.maxExportBatchSize === "number" ? K.maxExportBatchSize : (0, Jt.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof K?.maxQueueSize === "number" ? K.maxQueueSize : (0, Jt.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof K?.scheduledDelayMillis === "number" ? K.scheduledDelayMillis : (0, Jt.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof K?.exportTimeoutMillis === "number" ? K.exportTimeoutMillis : (0, Jt.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new Jt.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) wS6.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
        }
        forceFlush() {
            if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
            return this._flushAll()
        }
        onStart(q, K) {}
        onEnd(q) {
            if (this._shutdownOnce.isCalled) return;
            if ((q.spanContext().traceFlags & wS6.TraceFlags.SAMPLED) === 0) return;
            this._addToBuffer(q)
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
        _addToBuffer(q) {
            if (this._finishedSpans.length >= this._maxQueueSize) {
                if (this._droppedSpansCount === 0) wS6.diag.debug("maxQueueSize reached, dropping spans");
                this._droppedSpansCount++;
                return
            }
            if (this._droppedSpansCount > 0) wS6.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
            this._finishedSpans.push(q), this._maybeStartTimer()
        }
        _flushAll() {
            return new Promise((q, K) => {
                let _ = [],
                    z = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
                for (let Y = 0, A = z; Y < A; Y++) _.push(this._flushOneBatch());
                Promise.all(_).then(() => {
                    q()
                }).catch(K)
            })
        }
        _flushOneBatch() {
            if (this._clearTimer(), this._finishedSpans.length === 0) return Promise.resolve();
            return new Promise((q, K) => {
                let _ = setTimeout(() => {
                    K(Error("Timeout"))
                }, this._exportTimeoutMillis);
                wS6.context.with((0, Jt.suppressTracing)(wS6.context.active()), () => {
                    let z;
                    if (this._finishedSpans.length <= this._maxExportBatchSize) z = this._finishedSpans, this._finishedSpans = [];
                    else z = this._finishedSpans.splice(0, this._maxExportBatchSize);
                    let Y = () => this._exporter.export(z, (O) => {
                            if (clearTimeout(_), O.code === Jt.ExportResultCode.SUCCESS) q();
                            else K(O.error ?? Error("BatchSpanProcessor: span export failed"))
                        }),
                        A = null;
                    for (let O = 0, w = z.length; O < w; O++) {
                        let $ = z[O];
                        if ($.resource.asyncAttributesPending && $.resource.waitForAsyncAttributes) A ??= [], A.push($.resource.waitForAsyncAttributes())
                    }
                    if (A === null) Y();
                    else Promise.all(A).then(Y, (O) => {
                        (0, Jt.globalErrorHandler)(O), K(O)
                    })
                })
            })
        }
        _maybeStartTimer() {
            if (this._isExporting) return;
            let q = () => {
                this._isExporting = !0, this._flushOneBatch().finally(() => {
                    if (this._isExporting = !1, this._finishedSpans.length > 0) this._clearTimer(), this._maybeStartTimer()
                }).catch((K) => {
                    this._isExporting = !1, (0, Jt.globalErrorHandler)(K)
                })
            };
            if (this._finishedSpans.length >= this._maxExportBatchSize) return q();
            if (this._timer !== void 0) return;
            if (this._timer = setTimeout(() => q(), this._scheduledDelayMillis), typeof this._timer !== "number") this._timer.unref()
        }
        _clearTimer() {
            if (this._timer !== void 0) clearTimeout(this._timer), this._timer = void 0
        }
    }
    Mo4.BatchSpanProcessorBase = Xo4
})
// @from(Ln 297582, Col 4)
Go4 = p((Zo4) => {
    Object.defineProperty(Zo4, "__esModule", {
        value: !0
    });
    Zo4.BatchSpanProcessor = void 0;
    var TSz = Wo4();
    class Do4 extends TSz.BatchSpanProcessorBase {
        onShutdown() {}
    }
    Zo4.BatchSpanProcessor = Do4
})
// @from(Ln 297593, Col 4)
Eo4 = p((ko4) => {
    Object.defineProperty(ko4, "__esModule", {
        value: !0
    });
    ko4.RandomIdGenerator = void 0;
    var VSz = 8,
        To4 = 16;
    class Vo4 {
        generateTraceId = vo4(To4);
        generateSpanId = vo4(VSz)
    }
    ko4.RandomIdGenerator = Vo4;
    var Hm8 = Buffer.allocUnsafe(To4);

    function vo4(q) {
        return function() {
            for (let _ = 0; _ < q / 4; _++) Hm8.writeUInt32BE(Math.random() * 4294967296 >>> 0, _ * 4);
            for (let _ = 0; _ < q; _++)
                if (Hm8[_] > 0) break;
                else if (_ === q - 1) Hm8[q - 1] = 1;
            return Hm8.toString("hex", 0, q)
        }
    }
})
// @from(Ln 297617, Col 4)
yo4 = p((Jm8) => {
    Object.defineProperty(Jm8, "__esModule", {
        value: !0
    });
    Jm8.RandomIdGenerator = Jm8.BatchSpanProcessor = void 0;
    var kSz = Go4();
    Object.defineProperty(Jm8, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return kSz.BatchSpanProcessor
        }
    });
    var NSz = Eo4();
    Object.defineProperty(Jm8, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return NSz.RandomIdGenerator
        }
    })
})
// @from(Ln 297637, Col 4)
Ms1 = p((Xm8) => {
    Object.defineProperty(Xm8, "__esModule", {
        value: !0
    });
    Xm8.RandomIdGenerator = Xm8.BatchSpanProcessor = void 0;
    var Lo4 = yo4();
    Object.defineProperty(Xm8, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return Lo4.BatchSpanProcessor
        }
    });
    Object.defineProperty(Xm8, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return Lo4.RandomIdGenerator
        }
    })
})
// @from(Ln 297656, Col 4)
Co4 = p((Ro4) => {
    Object.defineProperty(Ro4, "__esModule", {
        value: !0
    });
    Ro4.Tracer = void 0;
    var sf = $5(),
        Mm8 = t_(),
        LSz = Fr4(),
        hSz = Xs1(),
        RSz = Ms1();
    class ho4 {
        _sampler;
        _generalLimits;
        _spanLimits;
        _idGenerator;
        instrumentationScope;
        _resource;
        _spanProcessor;
        constructor(q, K, _, z) {
            let Y = (0, hSz.mergeConfig)(K);
            this._sampler = Y.sampler, this._generalLimits = Y.generalLimits, this._spanLimits = Y.spanLimits, this._idGenerator = K.idGenerator || new RSz.RandomIdGenerator, this._resource = _, this._spanProcessor = z, this.instrumentationScope = q
        }
        startSpan(q, K = {}, _ = sf.context.active()) {
            if (K.root) _ = sf.trace.deleteSpan(_);
            let z = sf.trace.getSpan(_);
            if ((0, Mm8.isTracingSuppressed)(_)) return sf.diag.debug("Instrumentation suppressed, returning Noop Span"), sf.trace.wrapSpanContext(sf.INVALID_SPAN_CONTEXT);
            let Y = z?.spanContext(),
                A = this._idGenerator.generateSpanId(),
                O, w, $;
            if (!Y || !sf.trace.isSpanContextValid(Y)) w = this._idGenerator.generateTraceId();
            else w = Y.traceId, $ = Y.traceState, O = Y;
            let j = K.kind ?? sf.SpanKind.INTERNAL,
                H = (K.links ?? []).map((Z) => {
                    return {
                        context: Z.context,
                        attributes: (0, Mm8.sanitizeAttributes)(Z.attributes)
                    }
                }),
                J = (0, Mm8.sanitizeAttributes)(K.attributes),
                X = this._sampler.shouldSample(_, w, q, j, J, H);
            $ = X.traceState ?? $;
            let M = X.decision === sf.SamplingDecision.RECORD_AND_SAMPLED ? sf.TraceFlags.SAMPLED : sf.TraceFlags.NONE,
                P = {
                    traceId: w,
                    spanId: A,
                    traceFlags: M,
                    traceState: $
                };
            if (X.decision === sf.SamplingDecision.NOT_RECORD) return sf.diag.debug("Recording is off, propagating context in a non-recording span"), sf.trace.wrapSpanContext(P);
            let W = (0, Mm8.sanitizeAttributes)(Object.assign(J, X.attributes));
            return new LSz.SpanImpl({
                resource: this._resource,
                scope: this.instrumentationScope,
                context: _,
                spanContext: P,
                name: q,
                kind: j,
                links: H,
                parentSpanContext: O,
                attributes: W,
                startTime: K.startTime,
                spanProcessor: this._spanProcessor,
                spanLimits: this._spanLimits
            })
        }
        startActiveSpan(q, K, _, z) {
            let Y, A, O;
            if (arguments.length < 2) return;
            else if (arguments.length === 2) O = K;
            else if (arguments.length === 3) Y = K, O = _;
            else Y = K, A = _, O = z;
            let w = A ?? sf.context.active(),
                $ = this.startSpan(q, Y, w),
                j = sf.trace.setSpan(w, $);
            return sf.context.with(j, O, void 0, $)
        }
        getGeneralLimits() {
            return this._generalLimits
        }
        getSpanLimits() {
            return this._spanLimits
        }
    }
    Ro4.Tracer = ho4
})
// @from(Ln 297741, Col 4)
uo4 = p((Io4) => {
    Object.defineProperty(Io4, "__esModule", {
        value: !0
    });
    Io4.MultiSpanProcessor = void 0;
    var SSz = t_();
    class bo4 {
        _spanProcessors;
        constructor(q) {
            this._spanProcessors = q
        }
        forceFlush() {
            let q = [];
            for (let K of this._spanProcessors) q.push(K.forceFlush());
            return new Promise((K) => {
                Promise.all(q).then(() => {
                    K()
                }).catch((_) => {
                    (0, SSz.globalErrorHandler)(_ || Error("MultiSpanProcessor: forceFlush failed")), K()
                })
            })
        }
        onStart(q, K) {
            for (let _ of this._spanProcessors) _.onStart(q, K)
        }
        onEnd(q) {
            for (let K of this._spanProcessors) K.onEnd(q)
        }
        shutdown() {
            let q = [];
            for (let K of this._spanProcessors) q.push(K.shutdown());
            return new Promise((K, _) => {
                Promise.all(q).then(() => {
                    K()
                }, _)
            })
        }
    }
    Io4.MultiSpanProcessor = bo4
})
// @from(Ln 297781, Col 4)
go4 = p((po4) => {
    Object.defineProperty(po4, "__esModule", {
        value: !0
    });
    po4.BasicTracerProvider = po4.ForceFlushState = void 0;
    var CSz = t_(),
        bSz = Bk6(),
        ISz = Co4(),
        xSz = Js1(),
        uSz = uo4(),
        mSz = Xs1(),
        $S6;
    (function(q) {
        q[q.resolved = 0] = "resolved", q[q.timeout = 1] = "timeout", q[q.error = 2] = "error", q[q.unresolved = 3] = "unresolved"
    })($S6 = po4.ForceFlushState || (po4.ForceFlushState = {}));
    class Bo4 {
        _config;
        _tracers = new Map;
        _resource;
        _activeSpanProcessor;
        constructor(q = {}) {
            let K = (0, CSz.merge)({}, (0, xSz.loadDefaultConfig)(), (0, mSz.reconfigureLimits)(q));
            this._resource = K.resource ?? (0, bSz.defaultResource)(), this._config = Object.assign({}, K, {
                resource: this._resource
            });
            let _ = [];
            if (q.spanProcessors?.length) _.push(...q.spanProcessors);
            this._activeSpanProcessor = new uSz.MultiSpanProcessor(_)
        }
        getTracer(q, K, _) {
            let z = `${q}@${K||""}:${_?.schemaUrl||""}`;
            if (!this._tracers.has(z)) this._tracers.set(z, new ISz.Tracer({
                name: q,
                version: K,
                schemaUrl: _?.schemaUrl
            }, this._config, this._resource, this._activeSpanProcessor));
            return this._tracers.get(z)
        }
        forceFlush() {
            let q = this._config.forceFlushTimeoutMillis,
                K = this._activeSpanProcessor._spanProcessors.map((_) => {
                    return new Promise((z) => {
                        let Y, A = setTimeout(() => {
                            z(Error(`Span processor did not completed within timeout period of ${q} ms`)), Y = $S6.timeout
                        }, q);
                        _.forceFlush().then(() => {
                            if (clearTimeout(A), Y !== $S6.timeout) Y = $S6.resolved, z(Y)
                        }).catch((O) => {
                            clearTimeout(A), Y = $S6.error, z(O)
                        })
                    })
                });
            return new Promise((_, z) => {
                Promise.all(K).then((Y) => {
                    let A = Y.filter((O) => O !== $S6.resolved);
                    if (A.length > 0) z(A);
                    else _()
                }).catch((Y) => z([Y]))
            })
        }
        shutdown() {
            return this._activeSpanProcessor.shutdown()
        }
    }
    po4.BasicTracerProvider = Bo4
})
// @from(Ln 297847, Col 4)
co4 = p((Qo4) => {
    Object.defineProperty(Qo4, "__esModule", {
        value: !0
    });
    Qo4.ConsoleSpanExporter = void 0;
    var Ps1 = t_();
    class Uo4 {
        export (q, K) {
            return this._sendSpans(q, K)
        }
        shutdown() {
            return this._sendSpans([]), this.forceFlush()
        }
        forceFlush() {
            return Promise.resolve()
        }
        _exportInfo(q) {
            return {
                resource: {
                    attributes: q.resource.attributes
                },
                instrumentationScope: q.instrumentationScope,
                traceId: q.spanContext().traceId,
                parentSpanContext: q.parentSpanContext,
                traceState: q.spanContext().traceState?.serialize(),
                name: q.name,
                id: q.spanContext().spanId,
                kind: q.kind,
                timestamp: (0, Ps1.hrTimeToMicroseconds)(q.startTime),
                duration: (0, Ps1.hrTimeToMicroseconds)(q.duration),
                attributes: q.attributes,
                status: q.status,
                events: q.events,
                links: q.links
            }
        }
        _sendSpans(q, K) {
            for (let _ of q) console.dir(this._exportInfo(_), {
                depth: 3
            });
            if (K) return K({
                code: Ps1.ExportResultCode.SUCCESS
            })
        }
    }
    Qo4.ConsoleSpanExporter = Uo4
})
// @from(Ln 297894, Col 4)
oo4 = p((io4) => {
    Object.defineProperty(io4, "__esModule", {
        value: !0
    });
    io4.InMemorySpanExporter = void 0;
    var lo4 = t_();
    class no4 {
        _finishedSpans = [];
        _stopped = !1;
        export (q, K) {
            if (this._stopped) return K({
                code: lo4.ExportResultCode.FAILED,
                error: Error("Exporter has been stopped")
            });
            this._finishedSpans.push(...q), setTimeout(() => K({
                code: lo4.ExportResultCode.SUCCESS
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
    io4.InMemorySpanExporter = no4
})
// @from(Ln 297927, Col 4)
eo4 = p((so4) => {
    Object.defineProperty(so4, "__esModule", {
        value: !0
    });
    so4.SimpleSpanProcessor = void 0;
    var BSz = $5(),
        Pm8 = t_();
    class ao4 {
        _exporter;
        _shutdownOnce;
        _pendingExports;
        constructor(q) {
            this._exporter = q, this._shutdownOnce = new Pm8.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
        }
        async forceFlush() {
            if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
        }
        onStart(q, K) {}
        onEnd(q) {
            if (this._shutdownOnce.isCalled) return;
            if ((q.spanContext().traceFlags & BSz.TraceFlags.SAMPLED) === 0) return;
            let K = this._doExport(q).catch((_) => (0, Pm8.globalErrorHandler)(_));
            this._pendingExports.add(K), K.finally(() => this._pendingExports.delete(K))
        }
        async _doExport(q) {
            if (q.resource.asyncAttributesPending) await q.resource.waitForAsyncAttributes?.();
            let K = await Pm8.internal._export(this._exporter, [q]);
            if (K.code !== Pm8.ExportResultCode.SUCCESS) throw K.error ?? Error(`SimpleSpanProcessor: span export failed (status ${K})`)
        }
        shutdown() {
            return this._shutdownOnce.call()
        }
        _shutdown() {
            return this._exporter.shutdown()
        }
    }
    so4.SimpleSpanProcessor = ao4
})
// @from(Ln 297965, Col 4)
za4 = p((Ka4) => {
    Object.defineProperty(Ka4, "__esModule", {
        value: !0
    });
    Ka4.NoopSpanProcessor = void 0;
    class qa4 {
        onStart(q, K) {}
        onEnd(q) {}
        shutdown() {
            return Promise.resolve()
        }
        forceFlush() {
            return Promise.resolve()
        }
    }
    Ka4.NoopSpanProcessor = qa4
})
// @from(Ln 297982, Col 4)
Aa4 = p((Ry) => {
    Object.defineProperty(Ry, "__esModule", {
        value: !0
    });
    Ry.SamplingDecision = Ry.TraceIdRatioBasedSampler = Ry.ParentBasedSampler = Ry.AlwaysOnSampler = Ry.AlwaysOffSampler = Ry.NoopSpanProcessor = Ry.SimpleSpanProcessor = Ry.InMemorySpanExporter = Ry.ConsoleSpanExporter = Ry.RandomIdGenerator = Ry.BatchSpanProcessor = Ry.BasicTracerProvider = void 0;
    var pSz = go4();
    Object.defineProperty(Ry, "BasicTracerProvider", {
        enumerable: !0,
        get: function() {
            return pSz.BasicTracerProvider
        }
    });
    var Ya4 = Ms1();
    Object.defineProperty(Ry, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return Ya4.BatchSpanProcessor
        }
    });
    Object.defineProperty(Ry, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return Ya4.RandomIdGenerator
        }
    });
    var FSz = co4();
    Object.defineProperty(Ry, "ConsoleSpanExporter", {
        enumerable: !0,
        get: function() {
            return FSz.ConsoleSpanExporter
        }
    });
    var gSz = oo4();
    Object.defineProperty(Ry, "InMemorySpanExporter", {
        enumerable: !0,
        get: function() {
            return gSz.InMemorySpanExporter
        }
    });
    var USz = eo4();
    Object.defineProperty(Ry, "SimpleSpanProcessor", {
        enumerable: !0,
        get: function() {
            return USz.SimpleSpanProcessor
        }
    });
    var QSz = za4();
    Object.defineProperty(Ry, "NoopSpanProcessor", {
        enumerable: !0,
        get: function() {
            return QSz.NoopSpanProcessor
        }
    });
    var dSz = Ym8();
    Object.defineProperty(Ry, "AlwaysOffSampler", {
        enumerable: !0,
        get: function() {
            return dSz.AlwaysOffSampler
        }
    });
    var cSz = Am8();
    Object.defineProperty(Ry, "AlwaysOnSampler", {
        enumerable: !0,
        get: function() {
            return cSz.AlwaysOnSampler
        }
    });
    var lSz = ws1();
    Object.defineProperty(Ry, "ParentBasedSampler", {
        enumerable: !0,
        get: function() {
            return lSz.ParentBasedSampler
        }
    });
    var nSz = $s1();
    Object.defineProperty(Ry, "TraceIdRatioBasedSampler", {
        enumerable: !0,
        get: function() {
            return nSz.TraceIdRatioBasedSampler
        }
    });
    var iSz = x78();
    Object.defineProperty(Ry, "SamplingDecision", {
        enumerable: !0,
        get: function() {
            return iSz.SamplingDecision
        }
    })
})
// @from(Ln 298071, Col 0)
async function aSz() {
    let q = OH();
    if (q.error) throw Error(`Auth error: ${q.error}`);
    let K = {
            "Content-Type": "application/json",
            "User-Agent": yA(),
            ...q.headers
        },
        _ = "https://api.anthropic.com/api/claude_code/organizations/metrics_enabled";
    return (await Z1.get(_, {
        headers: K,
        timeout: 5000
    })).data
}
// @from(Ln 298085, Col 0)
async function sSz() {
    try {
        let q = await Wa(aSz, {
            also403Revoked: !0
        });
        return E(`Metrics opt-out API response: enabled=${q.metrics_logging_enabled}`), {
            enabled: q.metrics_logging_enabled,
            hasError: !1
        }
    } catch (q) {
        return E(`Failed to check metrics opt-out status: ${b6(q)}`), j6(q), {
            enabled: !1,
            hasError: !0
        }
    }
}
// @from(Ln 298101, Col 0)
async function Oa4() {
    let q = await tSz();
    if (q.hasError) return q;
    let K = H8().metricsStatusCache;
    if (K !== void 0 && K.enabled === q.enabled && Date.now() - K.timestamp < wa4) return q;
    return d8((z) => ({
        ...z,
        metricsStatusCache: {
            enabled: q.enabled,
            timestamp: Date.now()
        }
    })), q
}
// @from(Ln 298114, Col 0)
async function $a4() {
    if (i7() && !AD()) return {
        enabled: !1,
        hasError: !1
    };
    let q = H8().metricsStatusCache;
    if (q) {
        if (Date.now() - q.timestamp > wa4) Oa4().catch(j6);
        return {
            enabled: q.enabled,
            hasError: !1
        }
    }
    return Oa4()
}
// @from(Ln 298129, Col 4)
oSz = 3600000
// @from(Ln 298130, Col 4)
wa4 = 86400000
// @from(Ln 298131, Col 4)
tSz
// @from(Ln 298132, Col 4)
ja4 = L(() => {
    CK();
    T7();
    h1();
    K8();
    m8();
    Zf();
    U8();
    Lm();
    tSz = yA6(sSz, oSz)
})
// @from(Ln 298143, Col 0)
class Ds1 {
    endpoint;
    timeout;
    pendingExports = [];
    isShutdown = !1;
    constructor(q = {}) {
        this.endpoint = "https://api.anthropic.com/api/claude_code/metrics", this.timeout = q.timeout || 5000
    }
    async export (q, K) {
        if (this.isShutdown) {
            K({
                code: gJ6.ExportResultCode.FAILED,
                error: Error("Exporter has been shutdown")
            });
            return
        }
        let _ = this.doExport(q, K);
        this.pendingExports.push(_), _.finally(() => {
            let z = this.pendingExports.indexOf(_);
            if (z > -1) this.pendingExports.splice(z, 1)
        })
    }
    async doExport(q, K) {
        try {
            if (!(EA() || I7())) {
                E("BigQuery metrics export: trust not established, skipping"), K({
                    code: gJ6.ExportResultCode.SUCCESS
                });
                return
            }
            if (!(await $a4()).enabled) {
                E("Metrics export disabled by organization setting"), K({
                    code: gJ6.ExportResultCode.SUCCESS
                });
                return
            }
            let Y = this.transformMetricsForInternal(q),
                A = OH();
            if (A.error) {
                E(`Metrics export failed: ${A.error}`), K({
                    code: gJ6.ExportResultCode.FAILED,
                    error: Error(A.error)
                });
                return
            }
            let O = {
                    "Content-Type": "application/json",
                    "User-Agent": yA(),
                    ...A.headers
                },
                w = await Z1.post(this.endpoint, Y, {
                    timeout: this.timeout,
                    headers: O
                });
            E("BigQuery metrics exported successfully"), E(`BigQuery API Response: ${I6(w.data,null,2)}`), K({
                code: gJ6.ExportResultCode.SUCCESS
            })
        } catch (_) {
            E(`BigQuery metrics export failed: ${b6(_)}`), j6(_), K({
                code: gJ6.ExportResultCode.FAILED,
                error: r1(_)
            })
        }
    }
    transformMetricsForInternal(q) {
        let K = q.resource.attributes,
            _ = {
                "service.name": K["service.name"] || "claude-code",
                "service.version": K["service.version"] || "unknown",
                "os.type": K["os.type"] || "unknown",
                "os.version": K["os.version"] || "unknown",
                "host.arch": K["host.arch"] || "unknown",
                "aggregation.temporality": this.selectAggregationTemporality() === Ws1.AggregationTemporality.DELTA ? "delta" : "cumulative"
            };
        if (K["wsl.version"]) _["wsl.version"] = K["wsl.version"];
        if (i7()) {
            _["user.customer_type"] = "claude_ai";
            let Y = MK();
            if (Y) _["user.subscription_type"] = Y
        } else _["user.customer_type"] = "api";
        return {
            resource_attributes: _,
            metrics: q.scopeMetrics.flatMap((Y) => Y.metrics.map((A) => ({
                name: A.descriptor.name,
                description: A.descriptor.description,
                unit: A.descriptor.unit,
                data_points: this.extractDataPoints(A)
            })))
        }
    }
    extractDataPoints(q) {
        return (q.dataPoints || []).filter((_) => typeof _.value === "number").map((_) => ({
            attributes: this.convertAttributes(_.attributes),
            value: _.value,
            timestamp: this.hrTimeToISOString(_.endTime || _.startTime || [Date.now() / 1000, 0])
        }))
    }
    async shutdown() {
        this.isShutdown = !0, await this.forceFlush(), E("BigQuery metrics exporter shutdown complete")
    }
    async forceFlush() {
        await Promise.all(this.pendingExports), E("BigQuery metrics exporter flush complete")
    }
    convertAttributes(q) {
        let K = {};
        if (q) {
            for (let [_, z] of Object.entries(q))
                if (z !== void 0 && z !== null) K[_] = String(z)
        }
        return K
    }
    hrTimeToISOString(q) {
        let [K, _] = q;
        return new Date(K * 1000 + _ / 1e6).toISOString()
    }
    selectAggregationTemporality() {
        return Ws1.AggregationTemporality.DELTA
    }
}
// @from(Ln 298262, Col 4)
gJ6
// @from(Ln 298262, Col 9)
Ws1
// @from(Ln 298263, Col 4)
Ha4 = L(() => {
    CK();
    ja4();
    y8();
    T7();
    h1();
    K8();
    m8();
    Zf();
    U8();
    e8();
    gJ6 = K6(t_(), 1), Ws1 = K6(pJ6(), 1)
})
// @from(Ln 298276, Col 0)
class Zs1 {
    error(q, ...K) {
        E(`[3P telemetry] OTEL diag error: ${q}`, {
            level: "error"
        })
    }
    warn(q, ...K) {
        E(`[3P telemetry] OTEL diag warn: ${q}`, {
            level: "warn"
        })
    }
    info(q, ...K) {
        return
    }
    debug(q, ...K) {
        return
    }
    verbose(q, ...K) {
        return
    }
}
// @from(Ln 298297, Col 4)
Ja4 = L(() => {
    K8()
})
// @from(Ln 298300, Col 4)
Gs1 = p((Xa4) => {
    Object.defineProperty(Xa4, "__esModule", {
        value: !0
    });
    Xa4.AggregationTemporalityPreference = void 0;
    var eSz;
    (function(q) {
        q[q.DELTA = 0] = "DELTA", q[q.CUMULATIVE = 1] = "CUMULATIVE", q[q.LOWMEMORY = 2] = "LOWMEMORY"
    })(eSz = Xa4.AggregationTemporalityPreference || (Xa4.AggregationTemporalityPreference = {}))
})
// @from(Ln 298310, Col 4)
Da4 = p((Pa4) => {
    Object.defineProperty(Pa4, "__esModule", {
        value: !0
    });
    Pa4.OTLPExporterBase = void 0;
    class Ma4 {
        _delegate;
        constructor(q) {
            this._delegate = q
        }
        export (q, K) {
            this._delegate.export(q, K)
        }
        forceFlush() {
            return this._delegate.forceFlush()
        }
        shutdown() {
            return this._delegate.shutdown()
        }
    }
    Pa4.OTLPExporterBase = Ma4
})
// @from(Ln 298332, Col 4)
Wm8 = p((fa4) => {
    Object.defineProperty(fa4, "__esModule", {
        value: !0
    });
    fa4.OTLPExporterError = void 0;
    class Za4 extends Error {
        code;
        name = "OTLPExporterError";
        data;
        constructor(q, K, _) {
            super(q);
            this.data = _, this.code = K
        }
    }
    fa4.OTLPExporterError = Za4
})
// @from(Ln 298348, Col 4)
u78 = p((Ta4) => {
    Object.defineProperty(Ta4, "__esModule", {
        value: !0
    });
    Ta4.getSharedConfigurationDefaults = Ta4.mergeOtlpSharedConfigurationWithDefaults = Ta4.wrapStaticHeadersInFunction = Ta4.validateTimeoutMillis = void 0;

    function va4(q) {
        if (Number.isFinite(q) && q > 0) return q;
        throw Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${q}')`)
    }
    Ta4.validateTimeoutMillis = va4;

    function qCz(q) {
        if (q == null) return;
        return async () => q
    }
    Ta4.wrapStaticHeadersInFunction = qCz;

    function KCz(q, K, _) {
        return {
            timeoutMillis: va4(q.timeoutMillis ?? K.timeoutMillis ?? _.timeoutMillis),
            concurrencyLimit: q.concurrencyLimit ?? K.concurrencyLimit ?? _.concurrencyLimit,
            compression: q.compression ?? K.compression ?? _.compression
        }
    }
    Ta4.mergeOtlpSharedConfigurationWithDefaults = KCz;

    function _Cz() {
        return {
            timeoutMillis: 1e4,
            concurrencyLimit: 30,
            compression: "none"
        }
    }
    Ta4.getSharedConfigurationDefaults = _Cz
})
// @from(Ln 298384, Col 4)
Na4 = p((ka4) => {
    Object.defineProperty(ka4, "__esModule", {
        value: !0
    });
    ka4.CompressionAlgorithm = void 0;
    var OCz;
    (function(q) {
        q.NONE = "none", q.GZIP = "gzip"
    })(OCz = ka4.CompressionAlgorithm || (ka4.CompressionAlgorithm = {}))
})
// @from(Ln 298394, Col 4)
Ts1 = p((ya4) => {
    Object.defineProperty(ya4, "__esModule", {
        value: !0
    });
    ya4.createBoundedQueueExportPromiseHandler = void 0;
    class Ea4 {
        _concurrencyLimit;
        _sendingPromises = [];
        constructor(q) {
            this._concurrencyLimit = q
        }
        pushPromise(q) {
            if (this.hasReachedLimit()) throw Error("Concurrency Limit reached");
            this._sendingPromises.push(q);
            let K = () => {
                let _ = this._sendingPromises.indexOf(q);
                this._sendingPromises.splice(_, 1)
            };
            q.then(K, K)
        }
        hasReachedLimit() {
            return this._sendingPromises.length >= this._concurrencyLimit
        }
        async awaitAll() {
            await Promise.all(this._sendingPromises)
        }
    }

    function wCz(q) {
        return new Ea4(q.concurrencyLimit)
    }
    ya4.createBoundedQueueExportPromiseHandler = wCz
})
// @from(Ln 298427, Col 4)
Sa4 = p((ha4) => {
    Object.defineProperty(ha4, "__esModule", {
        value: !0
    });
    ha4.createLoggingPartialSuccessResponseHandler = void 0;
    var $Cz = $5();

    function jCz(q) {
        return Object.prototype.hasOwnProperty.call(q, "partialSuccess")
    }

    function HCz() {
        return {
            handleResponse(q) {
                if (q == null || !jCz(q) || q.partialSuccess == null || Object.keys(q.partialSuccess).length === 0) return;
                $Cz.diag.warn("Received Partial Success response:", JSON.stringify(q.partialSuccess))
            }
        }
    }
    ha4.createLoggingPartialSuccessResponseHandler = HCz
})
// @from(Ln 298448, Col 4)
Vs1 = p((Ia4) => {
    Object.defineProperty(Ia4, "__esModule", {
        value: !0
    });
    Ia4.createOtlpExportDelegate = void 0;
    var UJ6 = t_(),
        Ca4 = Wm8(),
        JCz = Sa4(),
        XCz = $5();
    class ba4 {
        _transport;
        _serializer;
        _responseHandler;
        _promiseQueue;
        _timeout;
        _diagLogger;
        constructor(q, K, _, z, Y) {
            this._transport = q, this._serializer = K, this._responseHandler = _, this._promiseQueue = z, this._timeout = Y, this._diagLogger = XCz.diag.createComponentLogger({
                namespace: "OTLPExportDelegate"
            })
        }
        export (q, K) {
            if (this._diagLogger.debug("items to be sent", q), this._promiseQueue.hasReachedLimit()) {
                K({
                    code: UJ6.ExportResultCode.FAILED,
                    error: Error("Concurrent export limit reached")
                });
                return
            }
            let _ = this._serializer.serializeRequest(q);
            if (_ == null) {
                K({
                    code: UJ6.ExportResultCode.FAILED,
                    error: Error("Nothing to send")
                });
                return
            }
            this._promiseQueue.pushPromise(this._transport.send(_, this._timeout).then((z) => {
                if (z.status === "success") {
                    if (z.data != null) try {
                        this._responseHandler.handleResponse(this._serializer.deserializeResponse(z.data))
                    } catch (Y) {
                        this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", Y, z.data)
                    }
                    K({
                        code: UJ6.ExportResultCode.SUCCESS
                    });
                    return
                } else if (z.status === "failure" && z.error) {
                    K({
                        code: UJ6.ExportResultCode.FAILED,
                        error: z.error
                    });
                    return
                } else if (z.status === "retryable") K({
                    code: UJ6.ExportResultCode.FAILED,
                    error: new Ca4.OTLPExporterError("Export failed with retryable status")
                });
                else K({
                    code: UJ6.ExportResultCode.FAILED,
                    error: new Ca4.OTLPExporterError("Export failed with unknown error")
                })
            }, (z) => K({
                code: UJ6.ExportResultCode.FAILED,
                error: z
            })))
        }
        forceFlush() {
            return this._promiseQueue.awaitAll()
        }
        async shutdown() {
            this._diagLogger.debug("shutdown started"), await this.forceFlush(), this._transport.shutdown()
        }
    }

    function MCz(q, K) {
        return new ba4(q.transport, q.serializer, (0, JCz.createLoggingPartialSuccessResponseHandler)(), q.promiseHandler, K.timeout)
    }
    Ia4.createOtlpExportDelegate = MCz
})
// @from(Ln 298528, Col 4)
Ba4 = p((ua4) => {
    Object.defineProperty(ua4, "__esModule", {
        value: !0
    });
    ua4.createOtlpNetworkExportDelegate = void 0;
    var PCz = Ts1(),
        WCz = Vs1();

    function DCz(q, K, _) {
        return (0, WCz.createOtlpExportDelegate)({
            transport: _,
            serializer: K,
            promiseHandler: (0, PCz.createBoundedQueueExportPromiseHandler)(q)
        }, {
            timeout: q.timeoutMillis
        })
    }
    ua4.createOtlpNetworkExportDelegate = DCz
})
// @from(Ln 298547, Col 4)
Al = p((G36) => {
    Object.defineProperty(G36, "__esModule", {
        value: !0
    });
    G36.createOtlpNetworkExportDelegate = G36.CompressionAlgorithm = G36.getSharedConfigurationDefaults = G36.mergeOtlpSharedConfigurationWithDefaults = G36.OTLPExporterError = G36.OTLPExporterBase = void 0;
    var ZCz = Da4();
    Object.defineProperty(G36, "OTLPExporterBase", {
        enumerable: !0,
        get: function() {
            return ZCz.OTLPExporterBase
        }
    });
    var fCz = Wm8();
    Object.defineProperty(G36, "OTLPExporterError", {
        enumerable: !0,
        get: function() {
            return fCz.OTLPExporterError
        }
    });
    var pa4 = u78();
    Object.defineProperty(G36, "mergeOtlpSharedConfigurationWithDefaults", {
        enumerable: !0,
        get: function() {
            return pa4.mergeOtlpSharedConfigurationWithDefaults
        }
    });
    Object.defineProperty(G36, "getSharedConfigurationDefaults", {
        enumerable: !0,
        get: function() {
            return pa4.getSharedConfigurationDefaults
        }
    });
    var GCz = Na4();
    Object.defineProperty(G36, "CompressionAlgorithm", {
        enumerable: !0,
        get: function() {
            return GCz.CompressionAlgorithm
        }
    });
    var vCz = Ba4();
    Object.defineProperty(G36, "createOtlpNetworkExportDelegate", {
        enumerable: !0,
        get: function() {
            return vCz.createOtlpNetworkExportDelegate
        }
    })
})
// @from(Ln 298594, Col 4)
Es1 = p((Ua4) => {
    Object.defineProperty(Ua4, "__esModule", {
        value: !0
    });
    Ua4.OTLPMetricExporterBase = Ua4.LowMemoryTemporalitySelector = Ua4.DeltaTemporalitySelector = Ua4.CumulativeTemporalitySelector = void 0;
    var VCz = t_(),
        sP = pJ6(),
        Fa4 = Gs1(),
        kCz = Al(),
        NCz = $5(),
        ECz = () => sP.AggregationTemporality.CUMULATIVE;
    Ua4.CumulativeTemporalitySelector = ECz;
    var yCz = (q) => {
        switch (q) {
            case sP.InstrumentType.COUNTER:
            case sP.InstrumentType.OBSERVABLE_COUNTER:
            case sP.InstrumentType.GAUGE:
            case sP.InstrumentType.HISTOGRAM:
            case sP.InstrumentType.OBSERVABLE_GAUGE:
                return sP.AggregationTemporality.DELTA;
            case sP.InstrumentType.UP_DOWN_COUNTER:
            case sP.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                return sP.AggregationTemporality.CUMULATIVE
        }
    };
    Ua4.DeltaTemporalitySelector = yCz;
    var LCz = (q) => {
        switch (q) {
            case sP.InstrumentType.COUNTER:
            case sP.InstrumentType.HISTOGRAM:
                return sP.AggregationTemporality.DELTA;
            case sP.InstrumentType.GAUGE:
            case sP.InstrumentType.UP_DOWN_COUNTER:
            case sP.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
            case sP.InstrumentType.OBSERVABLE_COUNTER:
            case sP.InstrumentType.OBSERVABLE_GAUGE:
                return sP.AggregationTemporality.CUMULATIVE
        }
    };
    Ua4.LowMemoryTemporalitySelector = LCz;

    function hCz() {
        let q = ((0, VCz.getStringFromEnv)("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE") ?? "cumulative").toLowerCase();
        if (q === "cumulative") return Ua4.CumulativeTemporalitySelector;
        if (q === "delta") return Ua4.DeltaTemporalitySelector;
        if (q === "lowmemory") return Ua4.LowMemoryTemporalitySelector;
        return NCz.diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${q}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`), Ua4.CumulativeTemporalitySelector
    }

    function RCz(q) {
        if (q != null) {
            if (q === Fa4.AggregationTemporalityPreference.DELTA) return Ua4.DeltaTemporalitySelector;
            else if (q === Fa4.AggregationTemporalityPreference.LOWMEMORY) return Ua4.LowMemoryTemporalitySelector;
            return Ua4.CumulativeTemporalitySelector
        }
        return hCz()
    }
    var SCz = Object.freeze({
        type: sP.AggregationType.DEFAULT
    });

    function CCz(q) {
        return q?.aggregationPreference ?? (() => SCz)
    }
    class ga4 extends kCz.OTLPExporterBase {
        _aggregationTemporalitySelector;
        _aggregationSelector;
        constructor(q, K) {
            super(q);
            this._aggregationSelector = CCz(K), this._aggregationTemporalitySelector = RCz(K?.temporalityPreference)
        }
        selectAggregation(q) {
            return this._aggregationSelector(q)
        }
        selectAggregationTemporality(q) {
            return this._aggregationTemporalitySelector(q)
        }
    }
    Ua4.OTLPMetricExporterBase = ga4
})
// @from(Ln 298674, Col 4)
ys1 = p((AK2, da4) => {
    da4.exports = bCz;

    function bCz(q, K) {
        var _ = Array(arguments.length - 1),
            z = 0,
            Y = 2,
            A = !0;
        while (Y < arguments.length) _[z++] = arguments[Y++];
        return new Promise(function(w, $) {
            _[z] = function(H) {
                if (A)
                    if (A = !1, H) $(H);
                    else {
                        var J = Array(arguments.length - 1),
                            X = 0;
                        while (X < J.length) J[X++] = arguments[X];
                        w.apply(null, J)
                    }
            };
            try {
                q.apply(K || null, _)
            } catch (j) {
                if (A) A = !1, $(j)
            }
        })
    }
})
// @from(Ln 298702, Col 4)
ia4 = p((na4) => {
    var Zm8 = na4;
    Zm8.length = function(K) {
        var _ = K.length;
        if (!_) return 0;
        var z = 0;
        while (--_ % 4 > 1 && K.charAt(_) === "=") ++z;
        return Math.ceil(K.length * 3) / 4 - z
    };
    var jS6 = Array(64),
        la4 = Array(123);
    for (px = 0; px < 64;) la4[jS6[px] = px < 26 ? px + 65 : px < 52 ? px + 71 : px < 62 ? px - 4 : px - 59 | 43] = px++;
    var px;
    Zm8.encode = function(K, _, z) {
        var Y = null,
            A = [],
            O = 0,
            w = 0,
            $;
        while (_ < z) {
            var j = K[_++];
            switch (w) {
                case 0:
                    A[O++] = jS6[j >> 2], $ = (j & 3) << 4, w = 1;
                    break;
                case 1:
                    A[O++] = jS6[$ | j >> 4], $ = (j & 15) << 2, w = 2;
                    break;
                case 2:
                    A[O++] = jS6[$ | j >> 6], A[O++] = jS6[j & 63], w = 0;
                    break
            }
            if (O > 8191)(Y || (Y = [])).push(String.fromCharCode.apply(String, A)), O = 0
        }
        if (w) {
            if (A[O++] = jS6[$], A[O++] = 61, w === 1) A[O++] = 61
        }
        if (Y) {
            if (O) Y.push(String.fromCharCode.apply(String, A.slice(0, O)));
            return Y.join("")
        }
        return String.fromCharCode.apply(String, A.slice(0, O))
    };
    var ca4 = "invalid encoding";
    Zm8.decode = function(K, _, z) {
        var Y = z,
            A = 0,
            O;
        for (var w = 0; w < K.length;) {
            var $ = K.charCodeAt(w++);
            if ($ === 61 && A > 1) break;
            if (($ = la4[$]) === void 0) throw Error(ca4);
            switch (A) {
                case 0:
                    O = $, A = 1;
                    break;
                case 1:
                    _[z++] = O << 2 | ($ & 48) >> 4, O = $, A = 2;
                    break;
                case 2:
                    _[z++] = (O & 15) << 4 | ($ & 60) >> 2, O = $, A = 3;
                    break;
                case 3:
                    _[z++] = (O & 3) << 6 | $, A = 0;
                    break
            }
        }
        if (A === 1) throw Error(ca4);
        return z - Y
    };
    Zm8.test = function(K) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(K)
    }
})
// @from(Ln 298776, Col 4)
oa4 = p((wK2, ra4) => {
    ra4.exports = fm8;

    function fm8() {
        this._listeners = {}
    }
    fm8.prototype.on = function(K, _, z) {
        return (this._listeners[K] || (this._listeners[K] = [])).push({
            fn: _,
            ctx: z || this
        }), this
    };
    fm8.prototype.off = function(K, _) {
        if (K === void 0) this._listeners = {};
        else if (_ === void 0) this._listeners[K] = [];
        else {
            var z = this._listeners[K];
            for (var Y = 0; Y < z.length;)
                if (z[Y].fn === _) z.splice(Y, 1);
                else ++Y
        }
        return this
    };
    fm8.prototype.emit = function(K) {
        var _ = this._listeners[K];
        if (_) {
            var z = [],
                Y = 1;
            for (; Y < arguments.length;) z.push(arguments[Y++]);
            for (Y = 0; Y < _.length;) _[Y].fn.apply(_[Y++].ctx, z)
        }
        return this
    }
})
// @from(Ln 298810, Col 4)
_s4 = p(($K2, Ks4) => {
    Ks4.exports = aa4(aa4);

    function aa4(q) {
        if (typeof Float32Array < "u")(function() {
            var K = new Float32Array([-0]),
                _ = new Uint8Array(K.buffer),
                z = _[3] === 128;

            function Y($, j, H) {
                K[0] = $, j[H] = _[0], j[H + 1] = _[1], j[H + 2] = _[2], j[H + 3] = _[3]
            }

            function A($, j, H) {
                K[0] = $, j[H] = _[3], j[H + 1] = _[2], j[H + 2] = _[1], j[H + 3] = _[0]
            }
            q.writeFloatLE = z ? Y : A, q.writeFloatBE = z ? A : Y;

            function O($, j) {
                return _[0] = $[j], _[1] = $[j + 1], _[2] = $[j + 2], _[3] = $[j + 3], K[0]
            }

            function w($, j) {
                return _[3] = $[j], _[2] = $[j + 1], _[1] = $[j + 2], _[0] = $[j + 3], K[0]
            }
            q.readFloatLE = z ? O : w, q.readFloatBE = z ? w : O
        })();
        else(function() {
            function K(z, Y, A, O) {
                var w = Y < 0 ? 1 : 0;
                if (w) Y = -Y;
                if (Y === 0) z(1 / Y > 0 ? 0 : 2147483648, A, O);
                else if (isNaN(Y)) z(2143289344, A, O);
                else if (Y > 340282346638528860000000000000000000000) z((w << 31 | 2139095040) >>> 0, A, O);
                else if (Y < 0.000000000000000000000000000000000000011754943508222875) z((w << 31 | Math.round(Y / 0.000000000000000000000000000000000000000000001401298464324817)) >>> 0, A, O);
                else {
                    var $ = Math.floor(Math.log(Y) / Math.LN2),
                        j = Math.round(Y * Math.pow(2, -$) * 8388608) & 8388607;
                    z((w << 31 | $ + 127 << 23 | j) >>> 0, A, O)
                }
            }
            q.writeFloatLE = K.bind(null, sa4), q.writeFloatBE = K.bind(null, ta4);

            function _(z, Y, A) {
                var O = z(Y, A),
                    w = (O >> 31) * 2 + 1,
                    $ = O >>> 23 & 255,
                    j = O & 8388607;
                return $ === 255 ? j ? NaN : w * (1 / 0) : $ === 0 ? w * 0.000000000000000000000000000000000000000000001401298464324817 * j : w * Math.pow(2, $ - 150) * (j + 8388608)
            }
            q.readFloatLE = _.bind(null, ea4), q.readFloatBE = _.bind(null, qs4)
        })();
        if (typeof Float64Array < "u")(function() {
            var K = new Float64Array([-0]),
                _ = new Uint8Array(K.buffer),
                z = _[7] === 128;

            function Y($, j, H) {
                K[0] = $, j[H] = _[0], j[H + 1] = _[1], j[H + 2] = _[2], j[H + 3] = _[3], j[H + 4] = _[4], j[H + 5] = _[5], j[H + 6] = _[6], j[H + 7] = _[7]
            }

            function A($, j, H) {
                K[0] = $, j[H] = _[7], j[H + 1] = _[6], j[H + 2] = _[5], j[H + 3] = _[4], j[H + 4] = _[3], j[H + 5] = _[2], j[H + 6] = _[1], j[H + 7] = _[0]
            }
            q.writeDoubleLE = z ? Y : A, q.writeDoubleBE = z ? A : Y;

            function O($, j) {
                return _[0] = $[j], _[1] = $[j + 1], _[2] = $[j + 2], _[3] = $[j + 3], _[4] = $[j + 4], _[5] = $[j + 5], _[6] = $[j + 6], _[7] = $[j + 7], K[0]
            }

            function w($, j) {
                return _[7] = $[j], _[6] = $[j + 1], _[5] = $[j + 2], _[4] = $[j + 3], _[3] = $[j + 4], _[2] = $[j + 5], _[1] = $[j + 6], _[0] = $[j + 7], K[0]
            }
            q.readDoubleLE = z ? O : w, q.readDoubleBE = z ? w : O
        })();
        else(function() {
            function K(z, Y, A, O, w, $) {
                var j = O < 0 ? 1 : 0;
                if (j) O = -O;
                if (O === 0) z(0, w, $ + Y), z(1 / O > 0 ? 0 : 2147483648, w, $ + A);
                else if (isNaN(O)) z(0, w, $ + Y), z(2146959360, w, $ + A);
                else if (O > 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000) z(0, w, $ + Y), z((j << 31 | 2146435072) >>> 0, w, $ + A);
                else {
                    var H;
                    if (O < 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022250738585072014) H = O / 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005, z(H >>> 0, w, $ + Y), z((j << 31 | H / 4294967296) >>> 0, w, $ + A);
                    else {
                        var J = Math.floor(Math.log(O) / Math.LN2);
                        if (J === 1024) J = 1023;
                        H = O * Math.pow(2, -J), z(H * 4503599627370496 >>> 0, w, $ + Y), z((j << 31 | J + 1023 << 20 | H * 1048576 & 1048575) >>> 0, w, $ + A)
                    }
                }
            }
            q.writeDoubleLE = K.bind(null, sa4, 0, 4), q.writeDoubleBE = K.bind(null, ta4, 4, 0);

            function _(z, Y, A, O, w) {
                var $ = z(O, w + Y),
                    j = z(O, w + A),
                    H = (j >> 31) * 2 + 1,
                    J = j >>> 20 & 2047,
                    X = 4294967296 * (j & 1048575) + $;
                return J === 2047 ? X ? NaN : H * (1 / 0) : J === 0 ? H * 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005 * X : H * Math.pow(2, J - 1075) * (X + 4503599627370496)
            }
            q.readDoubleLE = _.bind(null, ea4, 0, 4), q.readDoubleBE = _.bind(null, qs4, 4, 0)
        })();
        return q
    }

    function sa4(q, K, _) {
        K[_] = q & 255, K[_ + 1] = q >>> 8 & 255, K[_ + 2] = q >>> 16 & 255, K[_ + 3] = q >>> 24
    }

    function ta4(q, K, _) {
        K[_] = q >>> 24, K[_ + 1] = q >>> 16 & 255, K[_ + 2] = q >>> 8 & 255, K[_ + 3] = q & 255
    }

    function ea4(q, K) {
        return (q[K] | q[K + 1] << 8 | q[K + 2] << 16 | q[K + 3] << 24) >>> 0
    }

    function qs4(q, K) {
        return (q[K] << 24 | q[K + 1] << 16 | q[K + 2] << 8 | q[K + 3]) >>> 0
    }
})
// @from(Ln 298933, Col 4)
zs4 = p((m78, Ls1) => {
    (function(q, K) {
        function _(z) {
            return z.default || z
        }
        if (typeof define === "function" && define.amd) define([], function() {
            var z = {};
            return K(z), _(z)
        });
        else if (typeof m78 === "object") {
            if (K(m78), typeof Ls1 === "object") Ls1.exports = _(m78)
        } else(function() {
            var z = {};
            K(z), q.Long = _(z)
        })()
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : m78, function(q) {
        Object.defineProperty(q, "__esModule", {
            value: !0
        }), q.default = void 0;
        var K = null;
        try {
            K = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
        } catch {}

        function _(m, S, F) {
            this.low = m | 0, this.high = S | 0, this.unsigned = !!F
        }
        _.prototype.__isLong__, Object.defineProperty(_.prototype, "__isLong__", {
            value: !0
        });

        function z(m) {
            return (m && m.__isLong__) === !0
        }

        function Y(m) {
            var S = Math.clz32(m & -m);
            return m ? 31 - S : S
        }
        _.isLong = z;
        var A = {},
            O = {};

        function w(m, S) {
            var F, U, g;
            if (S) {
                if (m >>>= 0, g = 0 <= m && m < 256) {
                    if (U = O[m], U) return U
                }
                if (F = j(m, 0, !0), g) O[m] = F;
                return F
            } else {
                if (m |= 0, g = -128 <= m && m < 128) {
                    if (U = A[m], U) return U
                }
                if (F = j(m, m < 0 ? -1 : 0, !1), g) A[m] = F;
                return F
            }
        }
        _.fromInt = w;

        function $(m, S) {
            if (isNaN(m)) return S ? v : f;
            if (S) {
                if (m < 0) return v;
                if (m >= D) return h
            } else {
                if (m <= -Z) return C;
                if (m + 1 >= Z) return R
            }
            if (m < 0) return $(-m, S).neg();
            return j(m % W | 0, m / W | 0, S)
        }
        _.fromNumber = $;

        function j(m, S, F) {
            return new _(m, S, F)
        }
        _.fromBits = j;
        var H = Math.pow;

        function J(m, S, F) {
            if (m.length === 0) throw Error("empty string");
            if (typeof S === "number") F = S, S = !1;
            else S = !!S;
            if (m === "NaN" || m === "Infinity" || m === "+Infinity" || m === "-Infinity") return S ? v : f;
            if (F = F || 10, F < 2 || 36 < F) throw RangeError("radix");
            var U;
            if ((U = m.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (U === 0) return J(m.substring(1), S, F).neg();
            var g = $(H(F, 8)),
                c = f;
            for (var n = 0; n < m.length; n += 8) {
                var l = Math.min(8, m.length - n),
                    z6 = parseInt(m.substring(n, n + l), F);
                if (l < 8) {
                    var A6 = $(H(F, l));
                    c = c.mul(A6).add($(z6))
                } else c = c.mul(g), c = c.add($(z6))
            }
            return c.unsigned = S, c
        }
        _.fromString = J;

        function X(m, S) {
            if (typeof m === "number") return $(m, S);
            if (typeof m === "string") return J(m, S);
            return j(m.low, m.high, typeof S === "boolean" ? S : m.unsigned)
        }
        _.fromValue = X;
        var M = 65536,
            P = 16777216,
            W = M * M,
            D = W * W,
            Z = D / 2,
            G = w(P),
            f = w(0);
        _.ZERO = f;
        var v = w(0, !0);
        _.UZERO = v;
        var V = w(1);
        _.ONE = V;
        var k = w(1, !0);
        _.UONE = k;
        var N = w(-1);
        _.NEG_ONE = N;
        var R = j(-1, 2147483647, !1);
        _.MAX_VALUE = R;
        var h = j(-1, -1, !0);
        _.MAX_UNSIGNED_VALUE = h;
        var C = j(0, -2147483648, !1);
        _.MIN_VALUE = C;
        var x = _.prototype;
        if (x.toInt = function() {
                return this.unsigned ? this.low >>> 0 : this.low
            }, x.toNumber = function() {
                if (this.unsigned) return (this.high >>> 0) * W + (this.low >>> 0);
                return this.high * W + (this.low >>> 0)
            }, x.toString = function(S) {
                if (S = S || 10, S < 2 || 36 < S) throw RangeError("radix");
                if (this.isZero()) return "0";
                if (this.isNegative())
                    if (this.eq(C)) {
                        var F = $(S),
                            U = this.div(F),
                            g = U.mul(F).sub(this);
                        return U.toString(S) + g.toInt().toString(S)
                    } else return "-" + this.neg().toString(S);
                var c = $(H(S, 6), this.unsigned),
                    n = this,
                    l = "";
                while (!0) {
                    var z6 = n.div(c),
                        A6 = n.sub(z6.mul(c)).toInt() >>> 0,
                        e = A6.toString(S);
                    if (n = z6, n.isZero()) return e + l;
                    else {
                        while (e.length < 6) e = "0" + e;
                        l = "" + e + l
                    }
                }
            }, x.getHighBits = function() {
                return this.high
            }, x.getHighBitsUnsigned = function() {
                return this.high >>> 0
            }, x.getLowBits = function() {
                return this.low
            }, x.getLowBitsUnsigned = function() {
                return this.low >>> 0
            }, x.getNumBitsAbs = function() {
                if (this.isNegative()) return this.eq(C) ? 64 : this.neg().getNumBitsAbs();
                var S = this.high != 0 ? this.high : this.low;
                for (var F = 31; F > 0; F--)
                    if ((S & 1 << F) != 0) break;
                return this.high != 0 ? F + 33 : F + 1
            }, x.isSafeInteger = function() {
                var S = this.high >> 21;
                if (!S) return !0;
                if (this.unsigned) return !1;
                return S === -1 && !(this.low === 0 && this.high === -2097152)
            }, x.isZero = function() {
                return this.high === 0 && this.low === 0
            }, x.eqz = x.isZero, x.isNegative = function() {
                return !this.unsigned && this.high < 0
            }, x.isPositive = function() {
                return this.unsigned || this.high >= 0
            }, x.isOdd = function() {
                return (this.low & 1) === 1
            }, x.isEven = function() {
                return (this.low & 1) === 0
            }, x.equals = function(S) {
                if (!z(S)) S = X(S);
                if (this.unsigned !== S.unsigned && this.high >>> 31 === 1 && S.high >>> 31 === 1) return !1;
                return this.high === S.high && this.low === S.low
            }, x.eq = x.equals, x.notEquals = function(S) {
                return !this.eq(S)
            }, x.neq = x.notEquals, x.ne = x.notEquals, x.lessThan = function(S) {
                return this.comp(S) < 0
            }, x.lt = x.lessThan, x.lessThanOrEqual = function(S) {
                return this.comp(S) <= 0
            }, x.lte = x.lessThanOrEqual, x.le = x.lessThanOrEqual, x.greaterThan = function(S) {
                return this.comp(S) > 0
            }, x.gt = x.greaterThan, x.greaterThanOrEqual = function(S) {
                return this.comp(S) >= 0
            }, x.gte = x.greaterThanOrEqual, x.ge = x.greaterThanOrEqual, x.compare = function(S) {
                if (!z(S)) S = X(S);
                if (this.eq(S)) return 0;
                var F = this.isNegative(),
                    U = S.isNegative();
                if (F && !U) return -1;
                if (!F && U) return 1;
                if (!this.unsigned) return this.sub(S).isNegative() ? -1 : 1;
                return S.high >>> 0 > this.high >>> 0 || S.high === this.high && S.low >>> 0 > this.low >>> 0 ? -1 : 1
            }, x.comp = x.compare, x.negate = function() {
                if (!this.unsigned && this.eq(C)) return C;
                return this.not().add(V)
            }, x.neg = x.negate, x.add = function(S) {
                if (!z(S)) S = X(S);
                var F = this.high >>> 16,
                    U = this.high & 65535,
                    g = this.low >>> 16,
                    c = this.low & 65535,
                    n = S.high >>> 16,
                    l = S.high & 65535,
                    z6 = S.low >>> 16,
                    A6 = S.low & 65535,
                    e = 0,
                    i = 0,
                    O6 = 0,
                    J6 = 0;
                return J6 += c + A6, O6 += J6 >>> 16, J6 &= 65535, O6 += g + z6, i += O6 >>> 16, O6 &= 65535, i += U + l, e += i >>> 16, i &= 65535, e += F + n, e &= 65535, j(O6 << 16 | J6, e << 16 | i, this.unsigned)
            }, x.subtract = function(S) {
                if (!z(S)) S = X(S);
                return this.add(S.neg())
            }, x.sub = x.subtract, x.multiply = function(S) {
                if (this.isZero()) return this;
                if (!z(S)) S = X(S);
                if (K) {
                    var F = K.mul(this.low, this.high, S.low, S.high);
                    return j(F, K.get_high(), this.unsigned)
                }
                if (S.isZero()) return this.unsigned ? v : f;
                if (this.eq(C)) return S.isOdd() ? C : f;
                if (S.eq(C)) return this.isOdd() ? C : f;
                if (this.isNegative())
                    if (S.isNegative()) return this.neg().mul(S.neg());
                    else return this.neg().mul(S).neg();
                else if (S.isNegative()) return this.mul(S.neg()).neg();
                if (this.lt(G) && S.lt(G)) return $(this.toNumber() * S.toNumber(), this.unsigned);
                var U = this.high >>> 16,
                    g = this.high & 65535,
                    c = this.low >>> 16,
                    n = this.low & 65535,
                    l = S.high >>> 16,
                    z6 = S.high & 65535,
                    A6 = S.low >>> 16,
                    e = S.low & 65535,
                    i = 0,
                    O6 = 0,
                    J6 = 0,
                    $6 = 0;
                return $6 += n * e, J6 += $6 >>> 16, $6 &= 65535, J6 += c * e, O6 += J6 >>> 16, J6 &= 65535, J6 += n * A6, O6 += J6 >>> 16, J6 &= 65535, O6 += g * e, i += O6 >>> 16, O6 &= 65535, O6 += c * A6, i += O6 >>> 16, O6 &= 65535, O6 += n * z6, i += O6 >>> 16, O6 &= 65535, i += U * e + g * A6 + c * z6 + n * l, i &= 65535, j(J6 << 16 | $6, i << 16 | O6, this.unsigned)
            }, x.mul = x.multiply, x.divide = function(S) {
                if (!z(S)) S = X(S);
                if (S.isZero()) throw Error("division by zero");
                if (K) {
                    if (!this.unsigned && this.high === -2147483648 && S.low === -1 && S.high === -1) return this;
                    var F = (this.unsigned ? K.div_u : K.div_s)(this.low, this.high, S.low, S.high);
                    return j(F, K.get_high(), this.unsigned)
                }
                if (this.isZero()) return this.unsigned ? v : f;
                var U, g, c;
                if (!this.unsigned) {
                    if (this.eq(C))
                        if (S.eq(V) || S.eq(N)) return C;
                        else if (S.eq(C)) return V;
                    else {
                        var n = this.shr(1);
                        if (U = n.div(S).shl(1), U.eq(f)) return S.isNegative() ? V : N;
                        else return g = this.sub(S.mul(U)), c = U.add(g.div(S)), c
                    } else if (S.eq(C)) return this.unsigned ? v : f;
                    if (this.isNegative()) {
                        if (S.isNegative()) return this.neg().div(S.neg());
                        return this.neg().div(S).neg()
                    } else if (S.isNegative()) return this.div(S.neg()).neg();
                    c = f
                } else {
                    if (!S.unsigned) S = S.toUnsigned();
                    if (S.gt(this)) return v;
                    if (S.gt(this.shru(1))) return k;
                    c = v
                }
                g = this;
                while (g.gte(S)) {
                    U = Math.max(1, Math.floor(g.toNumber() / S.toNumber()));
                    var l = Math.ceil(Math.log(U) / Math.LN2),
                        z6 = l <= 48 ? 1 : H(2, l - 48),
                        A6 = $(U),
                        e = A6.mul(S);
                    while (e.isNegative() || e.gt(g)) U -= z6, A6 = $(U, this.unsigned), e = A6.mul(S);
                    if (A6.isZero()) A6 = V;
                    c = c.add(A6), g = g.sub(e)
                }
                return c
            }, x.div = x.divide, x.modulo = function(S) {
                if (!z(S)) S = X(S);
                if (K) {
                    var F = (this.unsigned ? K.rem_u : K.rem_s)(this.low, this.high, S.low, S.high);
                    return j(F, K.get_high(), this.unsigned)
                }
                return this.sub(this.div(S).mul(S))
            }, x.mod = x.modulo, x.rem = x.modulo, x.not = function() {
                return j(~this.low, ~this.high, this.unsigned)
            }, x.countLeadingZeros = function() {
                return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
            }, x.clz = x.countLeadingZeros, x.countTrailingZeros = function() {
                return this.low ? Y(this.low) : Y(this.high) + 32
            }, x.ctz = x.countTrailingZeros, x.and = function(S) {
                if (!z(S)) S = X(S);
                return j(this.low & S.low, this.high & S.high, this.unsigned)
            }, x.or = function(S) {
                if (!z(S)) S = X(S);
                return j(this.low | S.low, this.high | S.high, this.unsigned)
            }, x.xor = function(S) {
                if (!z(S)) S = X(S);
                return j(this.low ^ S.low, this.high ^ S.high, this.unsigned)
            }, x.shiftLeft = function(S) {
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                else if (S < 32) return j(this.low << S, this.high << S | this.low >>> 32 - S, this.unsigned);
                else return j(0, this.low << S - 32, this.unsigned)
            }, x.shl = x.shiftLeft, x.shiftRight = function(S) {
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                else if (S < 32) return j(this.low >>> S | this.high << 32 - S, this.high >> S, this.unsigned);
                else return j(this.high >> S - 32, this.high >= 0 ? 0 : -1, this.unsigned)
            }, x.shr = x.shiftRight, x.shiftRightUnsigned = function(S) {
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                if (S < 32) return j(this.low >>> S | this.high << 32 - S, this.high >>> S, this.unsigned);
                if (S === 32) return j(this.high, 0, this.unsigned);
                return j(this.high >>> S - 32, 0, this.unsigned)
            }, x.shru = x.shiftRightUnsigned, x.shr_u = x.shiftRightUnsigned, x.rotateLeft = function(S) {
                var F;
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                if (S === 32) return j(this.high, this.low, this.unsigned);
                if (S < 32) return F = 32 - S, j(this.low << S | this.high >>> F, this.high << S | this.low >>> F, this.unsigned);
                return S -= 32, F = 32 - S, j(this.high << S | this.low >>> F, this.low << S | this.high >>> F, this.unsigned)
            }, x.rotl = x.rotateLeft, x.rotateRight = function(S) {
                var F;
                if (z(S)) S = S.toInt();
                if ((S &= 63) === 0) return this;
                if (S === 32) return j(this.high, this.low, this.unsigned);
                if (S < 32) return F = 32 - S, j(this.high << F | this.low >>> S, this.low << F | this.high >>> S, this.unsigned);
                return S -= 32, F = 32 - S, j(this.low << F | this.high >>> S, this.high << F | this.low >>> S, this.unsigned)
            }, x.rotr = x.rotateRight, x.toSigned = function() {
                if (!this.unsigned) return this;
                return j(this.low, this.high, !1)
            }, x.toUnsigned = function() {
                if (this.unsigned) return this;
                return j(this.low, this.high, !0)
            }, x.toBytes = function(S) {
                return S ? this.toBytesLE() : this.toBytesBE()
            }, x.toBytesLE = function() {
                var S = this.high,
                    F = this.low;
                return [F & 255, F >>> 8 & 255, F >>> 16 & 255, F >>> 24, S & 255, S >>> 8 & 255, S >>> 16 & 255, S >>> 24]
            }, x.toBytesBE = function() {
                var S = this.high,
                    F = this.low;
                return [S >>> 24, S >>> 16 & 255, S >>> 8 & 255, S & 255, F >>> 24, F >>> 16 & 255, F >>> 8 & 255, F & 255]
            }, _.fromBytes = function(S, F, U) {
                return U ? _.fromBytesLE(S, F) : _.fromBytesBE(S, F)
            }, _.fromBytesLE = function(S, F) {
                return new _(S[0] | S[1] << 8 | S[2] << 16 | S[3] << 24, S[4] | S[5] << 8 | S[6] << 16 | S[7] << 24, F)
            }, _.fromBytesBE = function(S, F) {
                return new _(S[4] << 24 | S[5] << 16 | S[6] << 8 | S[7], S[0] << 24 | S[1] << 16 | S[2] << 8 | S[3], F)
            }, typeof BigInt === "function") _.fromBigInt = function(S, F) {
            var U = Number(BigInt.asIntN(32, S)),
                g = Number(BigInt.asIntN(32, S >> BigInt(32)));
            return j(U, g, F)
        }, _.fromValue = function(S, F) {
            if (typeof S === "bigint") return _.fromBigInt(S, F);
            return X(S, F)
        }, x.toBigInt = function() {
            var S = BigInt(this.low >>> 0),
                F = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return F << BigInt(32) | S
        };
        var B = q.default = _
    })
})
// @from(Ln 299326, Col 4)
Rs1 = p((Ys4, hs1) => {
    hs1.exports = ICz;

    function ICz(moduleName) {
        try {
            var mod = moduleName === "long" ? zs4() : moduleName === "buffer" ? d6("buffer") : moduleName === "fs" ? d6("fs") : eval("quire".replace(/^/, "re"))(moduleName);
            if (mod && (mod.length || Object.keys(mod).length)) return mod
        } catch (q) {}
        return null
    }
})
// @from(Ln 299337, Col 4)
Os4 = p((As4) => {
    var Ss1 = As4;
    Ss1.length = function(K) {
        var _ = 0,
            z = 0;
        for (var Y = 0; Y < K.length; ++Y)
            if (z = K.charCodeAt(Y), z < 128) _ += 1;
            else if (z < 2048) _ += 2;
        else if ((z & 64512) === 55296 && (K.charCodeAt(Y + 1) & 64512) === 56320) ++Y, _ += 4;
        else _ += 3;
        return _
    };
    Ss1.read = function(K, _, z) {
        var Y = z - _;
        if (Y < 1) return "";
        var A = null,
            O = [],
            w = 0,
            $;
        while (_ < z) {
            if ($ = K[_++], $ < 128) O[w++] = $;
            else if ($ > 191 && $ < 224) O[w++] = ($ & 31) << 6 | K[_++] & 63;
            else if ($ > 239 && $ < 365) $ = (($ & 7) << 18 | (K[_++] & 63) << 12 | (K[_++] & 63) << 6 | K[_++] & 63) - 65536, O[w++] = 55296 + ($ >> 10), O[w++] = 56320 + ($ & 1023);
            else O[w++] = ($ & 15) << 12 | (K[_++] & 63) << 6 | K[_++] & 63;
            if (w > 8191)(A || (A = [])).push(String.fromCharCode.apply(String, O)), w = 0
        }
        if (A) {
            if (w) A.push(String.fromCharCode.apply(String, O.slice(0, w)));
            return A.join("")
        }
        return String.fromCharCode.apply(String, O.slice(0, w))
    };
    Ss1.write = function(K, _, z) {
        var Y = z,
            A, O;
        for (var w = 0; w < K.length; ++w)
            if (A = K.charCodeAt(w), A < 128) _[z++] = A;
            else if (A < 2048) _[z++] = A >> 6 | 192, _[z++] = A & 63 | 128;
        else if ((A & 64512) === 55296 && ((O = K.charCodeAt(w + 1)) & 64512) === 56320) A = 65536 + ((A & 1023) << 10) + (O & 1023), ++w, _[z++] = A >> 18 | 240, _[z++] = A >> 12 & 63 | 128, _[z++] = A >> 6 & 63 | 128, _[z++] = A & 63 | 128;
        else _[z++] = A >> 12 | 224, _[z++] = A >> 6 & 63 | 128, _[z++] = A & 63 | 128;
        return z - Y
    }
})
// @from(Ln 299380, Col 4)
$s4 = p((HK2, ws4) => {
    ws4.exports = xCz;

    function xCz(q, K, _) {
        var z = _ || 8192,
            Y = z >>> 1,
            A = null,
            O = z;
        return function($) {
            if ($ < 1 || $ > Y) return q($);
            if (O + $ > z) A = q(z), O = 0;
            var j = K.call(A, O, O += $);
            if (O & 7) O = (O | 7) + 1;
            return j
        }
    }
})
// @from(Ln 299397, Col 4)
Hs4 = p((JK2, js4) => {
    js4.exports = UD;
    var B78 = Ol();

    function UD(q, K) {
        this.lo = q >>> 0, this.hi = K >>> 0
    }
    var QJ6 = UD.zero = new UD(0, 0);
    QJ6.toNumber = function() {
        return 0
    };
    QJ6.zzEncode = QJ6.zzDecode = function() {
        return this
    };
    QJ6.length = function() {
        return 1
    };
    var uCz = UD.zeroHash = "\x00\x00\x00\x00\x00\x00\x00\x00";
    UD.fromNumber = function(K) {
        if (K === 0) return QJ6;
        var _ = K < 0;
        if (_) K = -K;
        var z = K >>> 0,
            Y = (K - z) / 4294967296 >>> 0;
        if (_) {
            if (Y = ~Y >>> 0, z = ~z >>> 0, ++z > 4294967295) {
                if (z = 0, ++Y > 4294967295) Y = 0
            }
        }
        return new UD(z, Y)
    };
    UD.from = function(K) {
        if (typeof K === "number") return UD.fromNumber(K);
        if (B78.isString(K))
            if (B78.Long) K = B78.Long.fromString(K);
            else return UD.fromNumber(parseInt(K, 10));
        return K.low || K.high ? new UD(K.low >>> 0, K.high >>> 0) : QJ6
    };
    UD.prototype.toNumber = function(K) {
        if (!K && this.hi >>> 31) {
            var _ = ~this.lo + 1 >>> 0,
                z = ~this.hi >>> 0;
            if (!_) z = z + 1 >>> 0;
            return -(_ + z * 4294967296)
        }
        return this.lo + this.hi * 4294967296
    };
    UD.prototype.toLong = function(K) {
        return B78.Long ? new B78.Long(this.lo | 0, this.hi | 0, Boolean(K)) : {
            low: this.lo | 0,
            high: this.hi | 0,
            unsigned: Boolean(K)
        }
    };
    var v36 = String.prototype.charCodeAt;
    UD.fromHash = function(K) {
        if (K === uCz) return QJ6;
        return new UD((v36.call(K, 0) | v36.call(K, 1) << 8 | v36.call(K, 2) << 16 | v36.call(K, 3) << 24) >>> 0, (v36.call(K, 4) | v36.call(K, 5) << 8 | v36.call(K, 6) << 16 | v36.call(K, 7) << 24) >>> 0)
    };
    UD.prototype.toHash = function() {
        return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
    };
    UD.prototype.zzEncode = function() {
        var K = this.hi >> 31;
        return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ K) >>> 0, this.lo = (this.lo << 1 ^ K) >>> 0, this
    };
    UD.prototype.zzDecode = function() {
        var K = -(this.lo & 1);
        return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ K) >>> 0, this.hi = (this.hi >>> 1 ^ K) >>> 0, this
    };
    UD.prototype.length = function() {
        var K = this.lo,
            _ = (this.lo >>> 28 | this.hi << 4) >>> 0,
            z = this.hi >>> 24;
        return z === 0 ? _ === 0 ? K < 16384 ? K < 128 ? 1 : 2 : K < 2097152 ? 3 : 4 : _ < 16384 ? _ < 128 ? 5 : 6 : _ < 2097152 ? 7 : 8 : z < 128 ? 9 : 10
    }
})
// @from(Ln 299474, Col 4)
Ol = p((Cs1) => {
    var H5 = Cs1;
    H5.asPromise = ys1();
    H5.base64 = ia4();
    H5.EventEmitter = oa4();
    H5.float = _s4();
    H5.inquire = Rs1();
    H5.utf8 = Os4();
    H5.pool = $s4();
    H5.LongBits = Hs4();
    H5.isNode = Boolean(typeof global < "u" && global && global.process && global.process.versions && global.process.versions.node);
    H5.global = H5.isNode && global || typeof window < "u" && window || typeof self < "u" && self || Cs1;
    H5.emptyArray = Object.freeze ? Object.freeze([]) : [];
    H5.emptyObject = Object.freeze ? Object.freeze({}) : {};
    H5.isInteger = Number.isInteger || function(K) {
        return typeof K === "number" && isFinite(K) && Math.floor(K) === K
    };
    H5.isString = function(K) {
        return typeof K === "string" || K instanceof String
    };
    H5.isObject = function(K) {
        return K && typeof K === "object"
    };
    H5.isset = H5.isSet = function(K, _) {
        var z = K[_];
        if (z != null && K.hasOwnProperty(_)) return typeof z !== "object" || (Array.isArray(z) ? z.length : Object.keys(z).length) > 0;
        return !1
    };
    H5.Buffer = function() {
        try {
            var q = H5.inquire("buffer").Buffer;
            return q.prototype.utf8Write ? q : null
        } catch (K) {
            return null
        }
    }();
    H5._Buffer_from = null;
    H5._Buffer_allocUnsafe = null;
    H5.newBuffer = function(K) {
        return typeof K === "number" ? H5.Buffer ? H5._Buffer_allocUnsafe(K) : new H5.Array(K) : H5.Buffer ? H5._Buffer_from(K) : typeof Uint8Array > "u" ? K : new Uint8Array(K)
    };
    H5.Array = typeof Uint8Array < "u" ? Uint8Array : Array;
    H5.Long = H5.global.dcodeIO && H5.global.dcodeIO.Long || H5.global.Long || H5.inquire("long");
    H5.key2Re = /^true|false|0|1$/;
    H5.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    H5.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    H5.longToHash = function(K) {
        return K ? H5.LongBits.from(K).toHash() : H5.LongBits.zeroHash
    };
    H5.longFromHash = function(K, _) {
        var z = H5.LongBits.fromHash(K);
        if (H5.Long) return H5.Long.fromBits(z.lo, z.hi, _);
        return z.toNumber(Boolean(_))
    };

    function Js4(q, K, _) {
        for (var z = Object.keys(K), Y = 0; Y < z.length; ++Y)
            if (q[z[Y]] === void 0 || !_) q[z[Y]] = K[z[Y]];
        return q
    }
    H5.merge = Js4;
    H5.lcFirst = function(K) {
        return K.charAt(0).toLowerCase() + K.substring(1)
    };

    function Xs4(q) {
        function K(_, z) {
            if (!(this instanceof K)) return new K(_, z);
            if (Object.defineProperty(this, "message", {
                    get: function() {
                        return _
                    }
                }), Error.captureStackTrace) Error.captureStackTrace(this, K);
            else Object.defineProperty(this, "stack", {
                value: Error().stack || ""
            });
            if (z) Js4(this, z)
        }
        return K.prototype = Object.create(Error.prototype, {
            constructor: {
                value: K,
                writable: !0,
                enumerable: !1,
                configurable: !0
            },
            name: {
                get: function() {
                    return q
                },
                set: void 0,
                enumerable: !1,
                configurable: !0
            },
            toString: {
                value: function() {
                    return this.name + ": " + this.message
                },
                writable: !0,
                enumerable: !1,
                configurable: !0
            }
        }), K
    }
    H5.newError = Xs4;
    H5.ProtocolError = Xs4("ProtocolError");
    H5.oneOfGetter = function(K) {
        var _ = {};
        for (var z = 0; z < K.length; ++z) _[K[z]] = 1;
        return function() {
            for (var Y = Object.keys(this), A = Y.length - 1; A > -1; --A)
                if (_[Y[A]] === 1 && this[Y[A]] !== void 0 && this[Y[A]] !== null) return Y[A]
        }
    };
    H5.oneOfSetter = function(K) {
        return function(_) {
            for (var z = 0; z < K.length; ++z)
                if (K[z] !== _) delete this[K[z]]
        }
    };
    H5.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: !0
    };
    H5._configure = function() {
        var q = H5.Buffer;
        if (!q) {
            H5._Buffer_from = H5._Buffer_allocUnsafe = null;
            return
        }
        H5._Buffer_from = q.from !== Uint8Array.from && q.from || function(_, z) {
            return new q(_, z)
        }, H5._Buffer_allocUnsafe = q.allocUnsafe || function(_) {
            return new q(_)
        }
    }
})