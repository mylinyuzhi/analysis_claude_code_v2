
// @from(Ln 290060, Col 4)
$k4 = x((wk4) => {
    Object.defineProperty(wk4, "__esModule", {
        value: !0
    });
    wk4.ExponentialHistogramAggregator = wk4.ExponentialHistogramAccumulation = void 0;
    var rqY = jG6(),
        hU6 = xe(),
        oqY = yq(),
        Yk4 = bV4(),
        zk4 = Kk4(),
        aqY = lG1();
    class DG6 {
        low;
        high;
        static combine(A, q) {
            return new DG6(Math.min(A.low, q.low), Math.max(A.high, q.high))
        }
        constructor(A, q) {
            this.low = A, this.high = q
        }
    }
    var sqY = 20,
        tqY = 160,
        UR8 = 2;
    class nG1 {
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
        constructor(A, q = tqY, K = !0, Y = 0, z = 0, _ = 0, w = Number.POSITIVE_INFINITY, O = Number.NEGATIVE_INFINITY, $ = new Yk4.Buckets, H = new Yk4.Buckets, j = (0, zk4.getMapping)(sqY)) {
            if (this.startTime = A, this._maxSize = q, this._recordMinMax = K, this._sum = Y, this._count = z, this._zeroCount = _, this._min = w, this._max = O, this._positive = $, this._negative = H, this._mapping = j, this._maxSize < UR8) oqY.diag.warn(`Exponential Histogram Max Size set to ${this._maxSize},                 changing to the minimum size of: ${UR8}`), this._maxSize = UR8
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
        updateByIncrement(A, q) {
            if (Number.isNaN(A)) return;
            if (A > this._max) this._max = A;
            if (A < this._min) this._min = A;
            if (this._count += q, A === 0) {
                this._zeroCount += q;
                return
            }
            if (this._sum += A * q, A > 0) this._updateBuckets(this._positive, A, q);
            else this._updateBuckets(this._negative, -A, q)
        }
        merge(A) {
            if (this._count === 0) this._min = A.min, this._max = A.max;
            else if (A.count !== 0) {
                if (A.min < this.min) this._min = A.min;
                if (A.max > this.max) this._max = A.max
            }
            this.startTime = A.startTime, this._sum += A.sum, this._count += A.count, this._zeroCount += A.zeroCount;
            let q = this._minScale(A);
            this._downscale(this.scale - q), this._mergeBuckets(this.positive, A, A.positive, q), this._mergeBuckets(this.negative, A, A.negative, q)
        }
        diff(A) {
            this._min = 1 / 0, this._max = -1 / 0, this._sum -= A.sum, this._count -= A.count, this._zeroCount -= A.zeroCount;
            let q = this._minScale(A);
            this._downscale(this.scale - q), this._diffBuckets(this.positive, A, A.positive, q), this._diffBuckets(this.negative, A, A.negative, q)
        }
        clone() {
            return new nG1(this.startTime, this._maxSize, this._recordMinMax, this._sum, this._count, this._zeroCount, this._min, this._max, this.positive.clone(), this.negative.clone(), this._mapping)
        }
        _updateBuckets(A, q, K) {
            let Y = this._mapping.mapToIndex(q),
                z = !1,
                _ = 0,
                w = 0;
            if (A.length === 0) A.indexStart = Y, A.indexEnd = A.indexStart, A.indexBase = A.indexStart;
            else if (Y < A.indexStart && A.indexEnd - Y >= this._maxSize) z = !0, w = Y, _ = A.indexEnd;
            else if (Y > A.indexEnd && Y - A.indexStart >= this._maxSize) z = !0, w = A.indexStart, _ = Y;
            if (z) {
                let O = this._changeScale(_, w);
                this._downscale(O), Y = this._mapping.mapToIndex(q)
            }
            this._incrementIndexBy(A, Y, K)
        }
        _incrementIndexBy(A, q, K) {
            if (K === 0) return;
            if (A.length === 0) A.indexStart = A.indexEnd = A.indexBase = q;
            if (q < A.indexStart) {
                let z = A.indexEnd - q;
                if (z >= A.backing.length) this._grow(A, z + 1);
                A.indexStart = q
            } else if (q > A.indexEnd) {
                let z = q - A.indexStart;
                if (z >= A.backing.length) this._grow(A, z + 1);
                A.indexEnd = q
            }
            let Y = q - A.indexBase;
            if (Y < 0) Y += A.backing.length;
            A.incrementBucket(Y, K)
        }
        _grow(A, q) {
            let K = A.backing.length,
                Y = A.indexBase - A.indexStart,
                z = K - Y,
                _ = (0, aqY.nextGreaterSquare)(q);
            if (_ > this._maxSize) _ = this._maxSize;
            let w = _ - Y;
            A.backing.growTo(_, z, w)
        }
        _changeScale(A, q) {
            let K = 0;
            while (A - q >= this._maxSize) A >>= 1, q >>= 1, K++;
            return K
        }
        _downscale(A) {
            if (A === 0) return;
            if (A < 0) throw Error(`impossible change of scale: ${this.scale}`);
            let q = this._mapping.scale - A;
            this._positive.downscale(A), this._negative.downscale(A), this._mapping = (0, zk4.getMapping)(q)
        }
        _minScale(A) {
            let q = Math.min(this.scale, A.scale),
                K = DG6.combine(this._highLowAtScale(this.positive, this.scale, q), this._highLowAtScale(A.positive, A.scale, q)),
                Y = DG6.combine(this._highLowAtScale(this.negative, this.scale, q), this._highLowAtScale(A.negative, A.scale, q));
            return Math.min(q - this._changeScale(K.high, K.low), q - this._changeScale(Y.high, Y.low))
        }
        _highLowAtScale(A, q, K) {
            if (A.length === 0) return new DG6(0, -1);
            let Y = q - K;
            return new DG6(A.indexStart >> Y, A.indexEnd >> Y)
        }
        _mergeBuckets(A, q, K, Y) {
            let z = K.offset,
                _ = q.scale - Y;
            for (let w = 0; w < K.length; w++) this._incrementIndexBy(A, z + w >> _, K.at(w))
        }
        _diffBuckets(A, q, K, Y) {
            let z = K.offset,
                _ = q.scale - Y;
            for (let w = 0; w < K.length; w++) {
                let $ = (z + w >> _) - A.indexBase;
                if ($ < 0) $ += A.backing.length;
                A.decrementBucket($, K.at(w))
            }
            A.trim()
        }
    }
    wk4.ExponentialHistogramAccumulation = nG1;
    class _k4 {
        _maxSize;
        _recordMinMax;
        kind = rqY.AggregatorKind.EXPONENTIAL_HISTOGRAM;
        constructor(A, q) {
            this._maxSize = A, this._recordMinMax = q
        }
        createAccumulation(A) {
            return new nG1(A, this._maxSize, this._recordMinMax)
        }
        merge(A, q) {
            let K = q.clone();
            return K.merge(A), K
        }
        diff(A, q) {
            let K = q.clone();
            return K.diff(A), K
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: hU6.DataPointType.EXPONENTIAL_HISTOGRAM,
                dataPoints: K.map(([z, _]) => {
                    let w = _.toPointValue(),
                        O = A.type === hU6.InstrumentType.GAUGE || A.type === hU6.InstrumentType.UP_DOWN_COUNTER || A.type === hU6.InstrumentType.OBSERVABLE_GAUGE || A.type === hU6.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER;
                    return {
                        attributes: z,
                        startTime: _.startTime,
                        endTime: Y,
                        value: {
                            min: w.hasMinMax ? w.min : void 0,
                            max: w.hasMinMax ? w.max : void 0,
                            sum: !O ? w.sum : void 0,
                            positive: {
                                offset: w.positive.offset,
                                bucketCounts: w.positive.bucketCounts
                            },
                            negative: {
                                offset: w.negative.offset,
                                bucketCounts: w.negative.bucketCounts
                            },
                            count: w.count,
                            scale: w.scale,
                            zeroCount: w.zeroCount
                        }
                    }
                })
            }
        }
    }
    wk4.ExponentialHistogramAggregator = _k4
})
// @from(Ln 290309, Col 4)
Mk4 = x((jk4) => {
    Object.defineProperty(jk4, "__esModule", {
        value: !0
    });
    jk4.LastValueAggregator = jk4.LastValueAccumulation = void 0;
    var AKY = jG6(),
        SU6 = K9(),
        qKY = xe();
    class CU6 {
        startTime;
        _current;
        sampleTime;
        constructor(A, q = 0, K = [0, 0]) {
            this.startTime = A, this._current = q, this.sampleTime = K
        }
        record(A) {
            this._current = A, this.sampleTime = (0, SU6.millisToHrTime)(Date.now())
        }
        setStartTime(A) {
            this.startTime = A
        }
        toPointValue() {
            return this._current
        }
    }
    jk4.LastValueAccumulation = CU6;
    class Hk4 {
        kind = AKY.AggregatorKind.LAST_VALUE;
        createAccumulation(A) {
            return new CU6(A)
        }
        merge(A, q) {
            let K = (0, SU6.hrTimeToMicroseconds)(q.sampleTime) >= (0, SU6.hrTimeToMicroseconds)(A.sampleTime) ? q : A;
            return new CU6(A.startTime, K.toPointValue(), K.sampleTime)
        }
        diff(A, q) {
            let K = (0, SU6.hrTimeToMicroseconds)(q.sampleTime) >= (0, SU6.hrTimeToMicroseconds)(A.sampleTime) ? q : A;
            return new CU6(q.startTime, K.toPointValue(), K.sampleTime)
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: qKY.DataPointType.GAUGE,
                dataPoints: K.map(([z, _]) => {
                    return {
                        attributes: z,
                        startTime: _.startTime,
                        endTime: Y,
                        value: _.toPointValue()
                    }
                })
            }
        }
    }
    jk4.LastValueAggregator = Hk4
})
// @from(Ln 290366, Col 4)
Wk4 = x((Xk4) => {
    Object.defineProperty(Xk4, "__esModule", {
        value: !0
    });
    Xk4.SumAggregator = Xk4.SumAccumulation = void 0;
    var YKY = jG6(),
        zKY = xe();
    class s96 {
        startTime;
        monotonic;
        _current;
        reset;
        constructor(A, q, K = 0, Y = !1) {
            this.startTime = A, this.monotonic = q, this._current = K, this.reset = Y
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
    Xk4.SumAccumulation = s96;
    class Dk4 {
        monotonic;
        kind = YKY.AggregatorKind.SUM;
        constructor(A) {
            this.monotonic = A
        }
        createAccumulation(A) {
            return new s96(A, this.monotonic)
        }
        merge(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue();
            if (q.reset) return new s96(q.startTime, this.monotonic, Y, q.reset);
            return new s96(A.startTime, this.monotonic, K + Y)
        }
        diff(A, q) {
            let K = A.toPointValue(),
                Y = q.toPointValue();
            if (this.monotonic && K > Y) return new s96(q.startTime, this.monotonic, Y, !0);
            return new s96(q.startTime, this.monotonic, Y - K)
        }
        toMetricData(A, q, K, Y) {
            return {
                descriptor: A,
                aggregationTemporality: q,
                dataPointType: zKY.DataPointType.SUM,
                dataPoints: K.map(([z, _]) => {
                    return {
                        attributes: z,
                        startTime: _.startTime,
                        endTime: Y,
                        value: _.toPointValue()
                    }
                }),
                isMonotonic: this.monotonic
            }
        }
    }
    Xk4.SumAggregator = Dk4
})
// @from(Ln 290433, Col 4)
vk4 = x((zb) => {
    Object.defineProperty(zb, "__esModule", {
        value: !0
    });
    zb.SumAggregator = zb.SumAccumulation = zb.LastValueAggregator = zb.LastValueAccumulation = zb.ExponentialHistogramAggregator = zb.ExponentialHistogramAccumulation = zb.HistogramAggregator = zb.HistogramAccumulation = zb.DropAggregator = void 0;
    var wKY = yV4();
    Object.defineProperty(zb, "DropAggregator", {
        enumerable: !0,
        get: function() {
            return wKY.DropAggregator
        }
    });
    var Zk4 = SV4();
    Object.defineProperty(zb, "HistogramAccumulation", {
        enumerable: !0,
        get: function() {
            return Zk4.HistogramAccumulation
        }
    });
    Object.defineProperty(zb, "HistogramAggregator", {
        enumerable: !0,
        get: function() {
            return Zk4.HistogramAggregator
        }
    });
    var Gk4 = $k4();
    Object.defineProperty(zb, "ExponentialHistogramAccumulation", {
        enumerable: !0,
        get: function() {
            return Gk4.ExponentialHistogramAccumulation
        }
    });
    Object.defineProperty(zb, "ExponentialHistogramAggregator", {
        enumerable: !0,
        get: function() {
            return Gk4.ExponentialHistogramAggregator
        }
    });
    var fk4 = Mk4();
    Object.defineProperty(zb, "LastValueAccumulation", {
        enumerable: !0,
        get: function() {
            return fk4.LastValueAccumulation
        }
    });
    Object.defineProperty(zb, "LastValueAggregator", {
        enumerable: !0,
        get: function() {
            return fk4.LastValueAggregator
        }
    });
    var Tk4 = Wk4();
    Object.defineProperty(zb, "SumAccumulation", {
        enumerable: !0,
        get: function() {
            return Tk4.SumAccumulation
        }
    });
    Object.defineProperty(zb, "SumAggregator", {
        enumerable: !0,
        get: function() {
            return Tk4.SumAggregator
        }
    })
})
// @from(Ln 290498, Col 4)
Rk4 = x((Nk4) => {
    Object.defineProperty(Nk4, "__esModule", {
        value: !0
    });
    Nk4.DEFAULT_AGGREGATION = Nk4.EXPONENTIAL_HISTOGRAM_AGGREGATION = Nk4.HISTOGRAM_AGGREGATION = Nk4.LAST_VALUE_AGGREGATION = Nk4.SUM_AGGREGATION = Nk4.DROP_AGGREGATION = Nk4.DefaultAggregation = Nk4.ExponentialHistogramAggregation = Nk4.ExplicitBucketHistogramAggregation = Nk4.HistogramAggregation = Nk4.LastValueAggregation = Nk4.SumAggregation = Nk4.DropAggregation = void 0;
    var $KY = yq(),
        t96 = vk4(),
        Xg = xe();
    class rG1 {
        static DEFAULT_INSTANCE = new t96.DropAggregator;
        createAggregator(A) {
            return rG1.DEFAULT_INSTANCE
        }
    }
    Nk4.DropAggregation = rG1;
    class IU6 {
        static MONOTONIC_INSTANCE = new t96.SumAggregator(!0);
        static NON_MONOTONIC_INSTANCE = new t96.SumAggregator(!1);
        createAggregator(A) {
            switch (A.type) {
                case Xg.InstrumentType.COUNTER:
                case Xg.InstrumentType.OBSERVABLE_COUNTER:
                case Xg.InstrumentType.HISTOGRAM:
                    return IU6.MONOTONIC_INSTANCE;
                default:
                    return IU6.NON_MONOTONIC_INSTANCE
            }
        }
    }
    Nk4.SumAggregation = IU6;
    class oG1 {
        static DEFAULT_INSTANCE = new t96.LastValueAggregator;
        createAggregator(A) {
            return oG1.DEFAULT_INSTANCE
        }
    }
    Nk4.LastValueAggregation = oG1;
    class aG1 {
        static DEFAULT_INSTANCE = new t96.HistogramAggregator([0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1000, 2500, 5000, 7500, 1e4], !0);
        createAggregator(A) {
            return aG1.DEFAULT_INSTANCE
        }
    }
    Nk4.HistogramAggregation = aG1;
    class dR8 {
        _recordMinMax;
        _boundaries;
        constructor(A, q = !0) {
            if (this._recordMinMax = q, A == null) throw Error("ExplicitBucketHistogramAggregation should be created with explicit boundaries, if a single bucket histogram is required, please pass an empty array");
            A = A.concat(), A = A.sort((z, _) => z - _);
            let K = A.lastIndexOf(-1 / 0),
                Y = A.indexOf(1 / 0);
            if (Y === -1) Y = void 0;
            this._boundaries = A.slice(K + 1, Y)
        }
        createAggregator(A) {
            return new t96.HistogramAggregator(this._boundaries, this._recordMinMax)
        }
    }
    Nk4.ExplicitBucketHistogramAggregation = dR8;
    class cR8 {
        _maxSize;
        _recordMinMax;
        constructor(A = 160, q = !0) {
            this._maxSize = A, this._recordMinMax = q
        }
        createAggregator(A) {
            return new t96.ExponentialHistogramAggregator(this._maxSize, this._recordMinMax)
        }
    }
    Nk4.ExponentialHistogramAggregation = cR8;
    class lR8 {
        _resolve(A) {
            switch (A.type) {
                case Xg.InstrumentType.COUNTER:
                case Xg.InstrumentType.UP_DOWN_COUNTER:
                case Xg.InstrumentType.OBSERVABLE_COUNTER:
                case Xg.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                    return Nk4.SUM_AGGREGATION;
                case Xg.InstrumentType.GAUGE:
                case Xg.InstrumentType.OBSERVABLE_GAUGE:
                    return Nk4.LAST_VALUE_AGGREGATION;
                case Xg.InstrumentType.HISTOGRAM: {
                    if (A.advice.explicitBucketBoundaries) return new dR8(A.advice.explicitBucketBoundaries);
                    return Nk4.HISTOGRAM_AGGREGATION
                }
            }
            return $KY.diag.warn(`Unable to recognize instrument type: ${A.type}`), Nk4.DROP_AGGREGATION
        }
        createAggregator(A) {
            return this._resolve(A).createAggregator(A)
        }
    }
    Nk4.DefaultAggregation = lR8;
    Nk4.DROP_AGGREGATION = new rG1;
    Nk4.SUM_AGGREGATION = new IU6;
    Nk4.LAST_VALUE_AGGREGATION = new oG1;
    Nk4.HISTOGRAM_AGGREGATION = new aG1;
    Nk4.EXPONENTIAL_HISTOGRAM_AGGREGATION = new cR8;
    Nk4.DEFAULT_AGGREGATION = new lR8
})
// @from(Ln 290599, Col 4)
bU6 = x((Sk4) => {
    Object.defineProperty(Sk4, "__esModule", {
        value: !0
    });
    Sk4.toAggregation = Sk4.AggregationType = void 0;
    var e96 = Rk4(),
        AY6;
    (function(A) {
        A[A.DEFAULT = 0] = "DEFAULT", A[A.DROP = 1] = "DROP", A[A.SUM = 2] = "SUM", A[A.LAST_VALUE = 3] = "LAST_VALUE", A[A.EXPLICIT_BUCKET_HISTOGRAM = 4] = "EXPLICIT_BUCKET_HISTOGRAM", A[A.EXPONENTIAL_HISTOGRAM = 5] = "EXPONENTIAL_HISTOGRAM"
    })(AY6 = Sk4.AggregationType || (Sk4.AggregationType = {}));

    function ZKY(A) {
        switch (A.type) {
            case AY6.DEFAULT:
                return e96.DEFAULT_AGGREGATION;
            case AY6.DROP:
                return e96.DROP_AGGREGATION;
            case AY6.SUM:
                return e96.SUM_AGGREGATION;
            case AY6.LAST_VALUE:
                return e96.LAST_VALUE_AGGREGATION;
            case AY6.EXPONENTIAL_HISTOGRAM: {
                let q = A;
                return new e96.ExponentialHistogramAggregation(q.options?.maxSize, q.options?.recordMinMax)
            }
            case AY6.EXPLICIT_BUCKET_HISTOGRAM: {
                let q = A;
                if (q.options == null) return e96.HISTOGRAM_AGGREGATION;
                else return new e96.ExplicitBucketHistogramAggregation(q.options?.boundaries, q.options?.recordMinMax)
            }
            default:
                throw Error("Unsupported Aggregation")
        }
    }
    Sk4.toAggregation = ZKY
})
// @from(Ln 290635, Col 4)
iR8 = x((Ik4) => {
    Object.defineProperty(Ik4, "__esModule", {
        value: !0
    });
    Ik4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = Ik4.DEFAULT_AGGREGATION_SELECTOR = void 0;
    var GKY = dG1(),
        fKY = bU6(),
        TKY = (A) => {
            return {
                type: fKY.AggregationType.DEFAULT
            }
        };
    Ik4.DEFAULT_AGGREGATION_SELECTOR = TKY;
    var vKY = (A) => GKY.AggregationTemporality.CUMULATIVE;
    Ik4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR = vKY
})
// @from(Ln 290651, Col 4)
nR8 = x((Bk4) => {
    Object.defineProperty(Bk4, "__esModule", {
        value: !0
    });
    Bk4.MetricReader = void 0;
    var xk4 = yq(),
        sG1 = Yb(),
        uk4 = iR8();
    class mk4 {
        _shutdown = !1;
        _metricProducers;
        _sdkMetricProducer;
        _aggregationTemporalitySelector;
        _aggregationSelector;
        _cardinalitySelector;
        constructor(A) {
            this._aggregationSelector = A?.aggregationSelector ?? uk4.DEFAULT_AGGREGATION_SELECTOR, this._aggregationTemporalitySelector = A?.aggregationTemporalitySelector ?? uk4.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR, this._metricProducers = A?.metricProducers ?? [], this._cardinalitySelector = A?.cardinalitySelector
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
            let [q, ...K] = await Promise.all([this._sdkMetricProducer.collect({
                timeoutMillis: A?.timeoutMillis
            }), ...this._metricProducers.map((w) => w.collect({
                timeoutMillis: A?.timeoutMillis
            }))]), Y = q.errors.concat((0, sG1.FlatMap)(K, (w) => w.errors)), z = q.resourceMetrics.resource, _ = q.resourceMetrics.scopeMetrics.concat((0, sG1.FlatMap)(K, (w) => w.resourceMetrics.scopeMetrics));
            return {
                resourceMetrics: {
                    resource: z,
                    scopeMetrics: _
                },
                errors: Y
            }
        }
        async shutdown(A) {
            if (this._shutdown) {
                xk4.diag.error("Cannot call shutdown twice.");
                return
            }
            if (A?.timeoutMillis == null) await this.onShutdown();
            else await (0, sG1.callWithTimeout)(this.onShutdown(), A.timeoutMillis);
            this._shutdown = !0
        }
        async forceFlush(A) {
            if (this._shutdown) {
                xk4.diag.warn("Cannot forceFlush on already shutdown MetricReader.");
                return
            }
            if (A?.timeoutMillis == null) {
                await this.onForceFlush();
                return
            }
            await (0, sG1.callWithTimeout)(this.onForceFlush(), A.timeoutMillis)
        }
    }
    Bk4.MetricReader = mk4
})
// @from(Ln 290722, Col 4)
dk4 = x((Qk4) => {
    Object.defineProperty(Qk4, "__esModule", {
        value: !0
    });
    Qk4.PeriodicExportingMetricReader = void 0;
    var rR8 = yq(),
        tG1 = K9(),
        VKY = nR8(),
        Fk4 = Yb();
    class pk4 extends VKY.MetricReader {
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
                await (0, Fk4.callWithTimeout)(this._doRun(), this._exportTimeout)
            } catch (A) {
                if (A instanceof Fk4.TimeoutError) {
                    rR8.diag.error("Export took longer than %s milliseconds and timed out.", this._exportTimeout);
                    return
                }(0, tG1.globalErrorHandler)(A)
            }
        }
        async _doRun() {
            let {
                resourceMetrics: A,
                errors: q
            } = await this.collect({
                timeoutMillis: this._exportTimeout
            });
            if (q.length > 0) rR8.diag.error("PeriodicExportingMetricReader: metrics collection errors", ...q);
            if (A.resource.asyncAttributesPending) try {
                await A.resource.waitForAsyncAttributes?.()
            } catch (Y) {
                rR8.diag.debug("Error while resolving async portion of resource: ", Y), (0, tG1.globalErrorHandler)(Y)
            }
            if (A.scopeMetrics.length === 0) return;
            let K = await tG1.internal._export(this._exporter, A);
            if (K.code !== tG1.ExportResultCode.SUCCESS) throw Error(`PeriodicExportingMetricReader: metrics export failed (error ${K.error})`)
        }
        onInitialized() {
            if (this._interval = setInterval(() => {
                    this._runOnce()
                }, this._exportInterval), typeof this._interval !== "number") this._interval.unref()
        }
        async onForceFlush() {
            await this._runOnce(), await this._exporter.forceFlush()
        }
        async onShutdown() {
            if (this._interval) clearInterval(this._interval);
            await this.onForceFlush(), await this._exporter.shutdown()
        }
    }
    Qk4.PeriodicExportingMetricReader = pk4
})
// @from(Ln 290789, Col 4)
rk4 = x((ik4) => {
    Object.defineProperty(ik4, "__esModule", {
        value: !0
    });
    ik4.InMemoryMetricExporter = void 0;
    var ck4 = K9();
    class lk4 {
        _shutdown = !1;
        _aggregationTemporality;
        _metrics = [];
        constructor(A) {
            this._aggregationTemporality = A
        }
        export (A, q) {
            if (this._shutdown) {
                setTimeout(() => q({
                    code: ck4.ExportResultCode.FAILED
                }), 0);
                return
            }
            this._metrics.push(A), setTimeout(() => q({
                code: ck4.ExportResultCode.SUCCESS
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
    ik4.InMemoryMetricExporter = lk4
})
// @from(Ln 290831, Col 4)
tk4 = x((ak4) => {
    Object.defineProperty(ak4, "__esModule", {
        value: !0
    });
    ak4.ConsoleMetricExporter = void 0;
    var ok4 = K9(),
        kKY = iR8();
    class oR8 {
        _shutdown = !1;
        _temporalitySelector;
        constructor(A) {
            this._temporalitySelector = A?.temporalitySelector ?? kKY.DEFAULT_AGGREGATION_TEMPORALITY_SELECTOR
        }
        export (A, q) {
            if (this._shutdown) {
                setImmediate(q, {
                    code: ok4.ExportResultCode.FAILED
                });
                return
            }
            return oR8._sendMetrics(A, q)
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
        static _sendMetrics(A, q) {
            for (let K of A.scopeMetrics)
                for (let Y of K.metrics) console.dir({
                    descriptor: Y.descriptor,
                    dataPointType: Y.dataPointType,
                    dataPoints: Y.dataPoints
                }, {
                    depth: null
                });
            q({
                code: ok4.ExportResultCode.SUCCESS
            })
        }
    }
    ak4.ConsoleMetricExporter = oR8
})
// @from(Ln 290878, Col 4)
KE4 = x((AE4) => {
    Object.defineProperty(AE4, "__esModule", {
        value: !0
    });
    AE4.ViewRegistry = void 0;
    class ek4 {
        _registeredViews = [];
        addView(A) {
            this._registeredViews.push(A)
        }
        findViews(A, q) {
            return this._registeredViews.filter((Y) => {
                return this._matchInstrument(Y.instrumentSelector, A) && this._matchMeter(Y.meterSelector, q)
            })
        }
        _matchInstrument(A, q) {
            return (A.getType() === void 0 || q.type === A.getType()) && A.getNameFilter().match(q.name) && A.getUnitFilter().match(q.unit)
        }
        _matchMeter(A, q) {
            return A.getNameFilter().match(q.name) && (q.version === void 0 || A.getVersionFilter().match(q.version)) && (q.schemaUrl === void 0 || A.getSchemaUrlFilter().match(q.schemaUrl))
        }
    }
    AE4.ViewRegistry = ek4
})
// @from(Ln 290902, Col 4)
xU6 = x((_E4) => {
    Object.defineProperty(_E4, "__esModule", {
        value: !0
    });
    _E4.isValidName = _E4.isDescriptorCompatibleWith = _E4.createInstrumentDescriptorWithView = _E4.createInstrumentDescriptor = void 0;
    var YE4 = yq(),
        EKY = Yb();

    function yKY(A, q, K) {
        if (!zE4(A)) YE4.diag.warn(`Invalid metric name: "${A}". The metric name should be a ASCII string with a length no greater than 255 characters.`);
        return {
            name: A,
            type: q,
            description: K?.description ?? "",
            unit: K?.unit ?? "",
            valueType: K?.valueType ?? YE4.ValueType.DOUBLE,
            advice: K?.advice ?? {}
        }
    }
    _E4.createInstrumentDescriptor = yKY;

    function LKY(A, q) {
        return {
            name: A.name ?? q.name,
            description: A.description ?? q.description,
            type: q.type,
            unit: q.unit,
            valueType: q.valueType,
            advice: q.advice
        }
    }
    _E4.createInstrumentDescriptorWithView = LKY;

    function RKY(A, q) {
        return (0, EKY.equalsCaseInsensitive)(A.name, q.name) && A.unit === q.unit && A.type === q.type && A.valueType === q.valueType
    }
    _E4.isDescriptorCompatibleWith = RKY;
    var hKY = /^[a-z][a-z0-9_.\-/]{0,254}$/i;

    function zE4(A) {
        return A.match(hKY) != null
    }
    _E4.isValidName = zE4
})
// @from(Ln 290946, Col 4)
eG1 = x((XE4) => {
    Object.defineProperty(XE4, "__esModule", {
        value: !0
    });
    XE4.isObservableInstrument = XE4.ObservableUpDownCounterInstrument = XE4.ObservableGaugeInstrument = XE4.ObservableCounterInstrument = XE4.ObservableInstrument = XE4.HistogramInstrument = XE4.GaugeInstrument = XE4.CounterInstrument = XE4.UpDownCounterInstrument = XE4.SyncInstrument = void 0;
    var XG6 = yq(),
        bKY = K9();
    class PG6 {
        _writableMetricStorage;
        _descriptor;
        constructor(A, q) {
            this._writableMetricStorage = A, this._descriptor = q
        }
        _record(A, q = {}, K = XG6.context.active()) {
            if (typeof A !== "number") {
                XG6.diag.warn(`non-number value provided to metric ${this._descriptor.name}: ${A}`);
                return
            }
            if (this._descriptor.valueType === XG6.ValueType.INT && !Number.isInteger(A)) {
                if (XG6.diag.warn(`INT value type cannot accept a floating-point value for ${this._descriptor.name}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
            }
            this._writableMetricStorage.record(A, q, K, (0, bKY.millisToHrTime)(Date.now()))
        }
    }
    XE4.SyncInstrument = PG6;
    class OE4 extends PG6 {
        add(A, q, K) {
            this._record(A, q, K)
        }
    }
    XE4.UpDownCounterInstrument = OE4;
    class $E4 extends PG6 {
        add(A, q, K) {
            if (A < 0) {
                XG6.diag.warn(`negative value provided to counter ${this._descriptor.name}: ${A}`);
                return
            }
            this._record(A, q, K)
        }
    }
    XE4.CounterInstrument = $E4;
    class HE4 extends PG6 {
        record(A, q, K) {
            this._record(A, q, K)
        }
    }
    XE4.GaugeInstrument = HE4;
    class jE4 extends PG6 {
        record(A, q, K) {
            if (A < 0) {
                XG6.diag.warn(`negative value provided to histogram ${this._descriptor.name}: ${A}`);
                return
            }
            this._record(A, q, K)
        }
    }
    XE4.HistogramInstrument = jE4;
    class WG6 {
        _observableRegistry;
        _metricStorages;
        _descriptor;
        constructor(A, q, K) {
            this._observableRegistry = K, this._descriptor = A, this._metricStorages = q
        }
        addCallback(A) {
            this._observableRegistry.addCallback(A, this)
        }
        removeCallback(A) {
            this._observableRegistry.removeCallback(A, this)
        }
    }
    XE4.ObservableInstrument = WG6;
    class JE4 extends WG6 {}
    XE4.ObservableCounterInstrument = JE4;
    class ME4 extends WG6 {}
    XE4.ObservableGaugeInstrument = ME4;
    class DE4 extends WG6 {}
    XE4.ObservableUpDownCounterInstrument = DE4;

    function xKY(A) {
        return A instanceof WG6
    }
    XE4.isObservableInstrument = xKY
})
// @from(Ln 291030, Col 4)
fE4 = x((ZE4) => {
    Object.defineProperty(ZE4, "__esModule", {
        value: !0
    });
    ZE4.Meter = void 0;
    var qY6 = xU6(),
        KY6 = eG1(),
        YY6 = xe();
    class WE4 {
        _meterSharedState;
        constructor(A) {
            this._meterSharedState = A
        }
        createGauge(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.GAUGE, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new KY6.GaugeInstrument(Y, K)
        }
        createHistogram(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.HISTOGRAM, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new KY6.HistogramInstrument(Y, K)
        }
        createCounter(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.COUNTER, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new KY6.CounterInstrument(Y, K)
        }
        createUpDownCounter(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.UP_DOWN_COUNTER, q),
                Y = this._meterSharedState.registerMetricStorage(K);
            return new KY6.UpDownCounterInstrument(Y, K)
        }
        createObservableGauge(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.OBSERVABLE_GAUGE, q),
                Y = this._meterSharedState.registerAsyncMetricStorage(K);
            return new KY6.ObservableGaugeInstrument(K, Y, this._meterSharedState.observableRegistry)
        }
        createObservableCounter(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.OBSERVABLE_COUNTER, q),
                Y = this._meterSharedState.registerAsyncMetricStorage(K);
            return new KY6.ObservableCounterInstrument(K, Y, this._meterSharedState.observableRegistry)
        }
        createObservableUpDownCounter(A, q) {
            let K = (0, qY6.createInstrumentDescriptor)(A, YY6.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER, q),
                Y = this._meterSharedState.registerAsyncMetricStorage(K);
            return new KY6.ObservableUpDownCounterInstrument(K, Y, this._meterSharedState.observableRegistry)
        }
        addBatchObservableCallback(A, q) {
            this._meterSharedState.observableRegistry.addBatchCallback(A, q)
        }
        removeBatchObservableCallback(A, q) {
            this._meterSharedState.observableRegistry.removeBatchCallback(A, q)
        }
    }
    ZE4.Meter = WE4
})
// @from(Ln 291087, Col 4)
aR8 = x((vE4) => {
    Object.defineProperty(vE4, "__esModule", {
        value: !0
    });
    vE4.MetricStorage = void 0;
    var cKY = xU6();
    class TE4 {
        _instrumentDescriptor;
        constructor(A) {
            this._instrumentDescriptor = A
        }
        getInstrumentDescriptor() {
            return this._instrumentDescriptor
        }
        updateDescription(A) {
            this._instrumentDescriptor = (0, cKY.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
                description: A,
                valueType: this._instrumentDescriptor.valueType,
                unit: this._instrumentDescriptor.unit,
                advice: this._instrumentDescriptor.advice
            })
        }
    }
    vE4.MetricStorage = TE4
})
// @from(Ln 291112, Col 4)
uU6 = x((kE4) => {
    Object.defineProperty(kE4, "__esModule", {
        value: !0
    });
    kE4.AttributeHashMap = kE4.HashMap = void 0;
    var lKY = Yb();
    class sR8 {
        _hash;
        _valueMap = new Map;
        _keyMap = new Map;
        constructor(A) {
            this._hash = A
        }
        get(A, q) {
            return q ??= this._hash(A), this._valueMap.get(q)
        }
        getOrDefault(A, q) {
            let K = this._hash(A);
            if (this._valueMap.has(K)) return this._valueMap.get(K);
            let Y = q();
            if (!this._keyMap.has(K)) this._keyMap.set(K, A);
            return this._valueMap.set(K, Y), Y
        }
        set(A, q, K) {
            if (K ??= this._hash(A), !this._keyMap.has(K)) this._keyMap.set(K, A);
            this._valueMap.set(K, q)
        }
        has(A, q) {
            return q ??= this._hash(A), this._valueMap.has(q)
        }* keys() {
            let A = this._keyMap.entries(),
                q = A.next();
            while (q.done !== !0) yield [q.value[1], q.value[0]], q = A.next()
        }* entries() {
            let A = this._valueMap.entries(),
                q = A.next();
            while (q.done !== !0) yield [this._keyMap.get(q.value[0]), q.value[1], q.value[0]], q = A.next()
        }
        get size() {
            return this._valueMap.size
        }
    }
    kE4.HashMap = sR8;
    class VE4 extends sR8 {
        constructor() {
            super(lKY.hashAttributes)
        }
    }
    kE4.AttributeHashMap = VE4
})
// @from(Ln 291162, Col 4)
eR8 = x((LE4) => {
    Object.defineProperty(LE4, "__esModule", {
        value: !0
    });
    LE4.DeltaMetricProcessor = void 0;
    var nKY = Yb(),
        tR8 = uU6();
    class yE4 {
        _aggregator;
        _activeCollectionStorage = new tR8.AttributeHashMap;
        _cumulativeMemoStorage = new tR8.AttributeHashMap;
        _cardinalityLimit;
        _overflowAttributes = {
            "otel.metric.overflow": !0
        };
        _overflowHashCode;
        constructor(A, q) {
            this._aggregator = A, this._cardinalityLimit = (q ?? 2000) - 1, this._overflowHashCode = (0, nKY.hashAttributes)(this._overflowAttributes)
        }
        record(A, q, K, Y) {
            let z = this._activeCollectionStorage.get(q);
            if (!z) {
                if (this._activeCollectionStorage.size >= this._cardinalityLimit) {
                    this._activeCollectionStorage.getOrDefault(this._overflowAttributes, () => this._aggregator.createAccumulation(Y))?.record(A);
                    return
                }
                z = this._aggregator.createAccumulation(Y), this._activeCollectionStorage.set(q, z)
            }
            z?.record(A)
        }
        batchCumulate(A, q) {
            Array.from(A.entries()).forEach(([K, Y, z]) => {
                let _ = this._aggregator.createAccumulation(q);
                _?.record(Y);
                let w = _;
                if (this._cumulativeMemoStorage.has(K, z)) {
                    let O = this._cumulativeMemoStorage.get(K, z);
                    w = this._aggregator.diff(O, _)
                } else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
                    if (K = this._overflowAttributes, z = this._overflowHashCode, this._cumulativeMemoStorage.has(K, z)) {
                        let O = this._cumulativeMemoStorage.get(K, z);
                        w = this._aggregator.diff(O, _)
                    }
                }
                if (this._activeCollectionStorage.has(K, z)) {
                    let O = this._activeCollectionStorage.get(K, z);
                    w = this._aggregator.merge(O, w)
                }
                this._cumulativeMemoStorage.set(K, _, z), this._activeCollectionStorage.set(K, w, z)
            })
        }
        collect() {
            let A = this._activeCollectionStorage;
            return this._activeCollectionStorage = new tR8.AttributeHashMap, A
        }
    }
    LE4.DeltaMetricProcessor = yE4
})
// @from(Ln 291220, Col 4)
Ah8 = x((hE4) => {
    Object.defineProperty(hE4, "__esModule", {
        value: !0
    });
    hE4.TemporalMetricProcessor = void 0;
    var rKY = dG1(),
        oKY = uU6();
    class mU6 {
        _aggregator;
        _unreportedAccumulations = new Map;
        _reportHistory = new Map;
        constructor(A, q) {
            this._aggregator = A, q.forEach((K) => {
                this._unreportedAccumulations.set(K, [])
            })
        }
        buildMetrics(A, q, K, Y) {
            this._stashAccumulations(K);
            let z = this._getMergedUnreportedAccumulations(A),
                _ = z,
                w;
            if (this._reportHistory.has(A)) {
                let $ = this._reportHistory.get(A),
                    H = $.collectionTime;
                if (w = $.aggregationTemporality, w === rKY.AggregationTemporality.CUMULATIVE) _ = mU6.merge($.accumulations, z, this._aggregator);
                else _ = mU6.calibrateStartTime($.accumulations, z, H)
            } else w = A.selectAggregationTemporality(q.type);
            this._reportHistory.set(A, {
                accumulations: _,
                collectionTime: Y,
                aggregationTemporality: w
            });
            let O = aKY(_);
            if (O.length === 0) return;
            return this._aggregator.toMetricData(q, w, O, Y)
        }
        _stashAccumulations(A) {
            let q = this._unreportedAccumulations.keys();
            for (let K of q) {
                let Y = this._unreportedAccumulations.get(K);
                if (Y === void 0) Y = [], this._unreportedAccumulations.set(K, Y);
                Y.push(A)
            }
        }
        _getMergedUnreportedAccumulations(A) {
            let q = new oKY.AttributeHashMap,
                K = this._unreportedAccumulations.get(A);
            if (this._unreportedAccumulations.set(A, []), K === void 0) return q;
            for (let Y of K) q = mU6.merge(q, Y, this._aggregator);
            return q
        }
        static merge(A, q, K) {
            let Y = A,
                z = q.entries(),
                _ = z.next();
            while (_.done !== !0) {
                let [w, O, $] = _.value;
                if (A.has(w, $)) {
                    let H = A.get(w, $),
                        j = K.merge(H, O);
                    Y.set(w, j, $)
                } else Y.set(w, O, $);
                _ = z.next()
            }
            return Y
        }
        static calibrateStartTime(A, q, K) {
            for (let [Y, z] of A.keys()) q.get(Y, z)?.setStartTime(K);
            return q
        }
    }
    hE4.TemporalMetricProcessor = mU6;

    function aKY(A) {
        return Array.from(A.entries())
    }
})
// @from(Ln 291297, Col 4)
xE4 = x((IE4) => {
    Object.defineProperty(IE4, "__esModule", {
        value: !0
    });
    IE4.AsyncMetricStorage = void 0;
    var sKY = aR8(),
        tKY = eR8(),
        eKY = Ah8(),
        A5Y = uU6();
    class CE4 extends sKY.MetricStorage {
        _attributesProcessor;
        _aggregationCardinalityLimit;
        _deltaMetricStorage;
        _temporalMetricStorage;
        constructor(A, q, K, Y, z) {
            super(A);
            this._attributesProcessor = K, this._aggregationCardinalityLimit = z, this._deltaMetricStorage = new tKY.DeltaMetricProcessor(q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new eKY.TemporalMetricProcessor(q, Y)
        }
        record(A, q) {
            let K = new A5Y.AttributeHashMap;
            Array.from(A.entries()).forEach(([Y, z]) => {
                K.set(this._attributesProcessor.process(Y), z)
            }), this._deltaMetricStorage.batchCumulate(K, q)
        }
        collect(A, q) {
            let K = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, K, q)
        }
    }
    IE4.AsyncMetricStorage = CE4
})
// @from(Ln 291328, Col 4)
QE4 = x((FE4) => {
    Object.defineProperty(FE4, "__esModule", {
        value: !0
    });
    FE4.getConflictResolutionRecipe = FE4.getDescriptionResolutionRecipe = FE4.getTypeConflictResolutionRecipe = FE4.getUnitConflictResolutionRecipe = FE4.getValueTypeConflictResolutionRecipe = FE4.getIncompatibilityDetails = void 0;

    function q5Y(A, q) {
        let K = "";
        if (A.unit !== q.unit) K += `	- Unit '${A.unit}' does not match '${q.unit}'
`;
        if (A.type !== q.type) K += `	- Type '${A.type}' does not match '${q.type}'
`;
        if (A.valueType !== q.valueType) K += `	- Value Type '${A.valueType}' does not match '${q.valueType}'
`;
        if (A.description !== q.description) K += `	- Description '${A.description}' does not match '${q.description}'
`;
        return K
    }
    FE4.getIncompatibilityDetails = q5Y;

    function uE4(A, q) {
        return `	- use valueType '${A.valueType}' on instrument creation or use an instrument name other than '${q.name}'`
    }
    FE4.getValueTypeConflictResolutionRecipe = uE4;

    function mE4(A, q) {
        return `	- use unit '${A.unit}' on instrument creation or use an instrument name other than '${q.name}'`
    }
    FE4.getUnitConflictResolutionRecipe = mE4;

    function BE4(A, q) {
        let K = {
                name: q.name,
                type: q.type,
                unit: q.unit
            },
            Y = JSON.stringify(K);
        return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${Y}'`
    }
    FE4.getTypeConflictResolutionRecipe = BE4;

    function gE4(A, q) {
        let K = {
                name: q.name,
                type: q.type,
                unit: q.unit
            },
            Y = JSON.stringify(K);
        return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${Y}'
    	- OR - create a new view with the name ${A.name} and description '${A.description}' and InstrumentSelector ${Y}
    	- OR - create a new view with the name ${q.name} and description '${A.description}' and InstrumentSelector ${Y}`
    }
    FE4.getDescriptionResolutionRecipe = gE4;

    function K5Y(A, q) {
        if (A.valueType !== q.valueType) return uE4(A, q);
        if (A.unit !== q.unit) return mE4(A, q);
        if (A.type !== q.type) return BE4(A, q);
        if (A.description !== q.description) return gE4(A, q);
        return ""
    }
    FE4.getConflictResolutionRecipe = K5Y
})
// @from(Ln 291391, Col 4)
lE4 = x((dE4) => {
    Object.defineProperty(dE4, "__esModule", {
        value: !0
    });
    dE4.MetricStorageRegistry = void 0;
    var $5Y = xU6(),
        UE4 = yq(),
        Af1 = QE4();
    class qh8 {
        _sharedRegistry = new Map;
        _perCollectorRegistry = new Map;
        static create() {
            return new qh8
        }
        getStorages(A) {
            let q = [];
            for (let Y of this._sharedRegistry.values()) q = q.concat(Y);
            let K = this._perCollectorRegistry.get(A);
            if (K != null)
                for (let Y of K.values()) q = q.concat(Y);
            return q
        }
        register(A) {
            this._registerStorage(A, this._sharedRegistry)
        }
        registerForCollector(A, q) {
            let K = this._perCollectorRegistry.get(A);
            if (K == null) K = new Map, this._perCollectorRegistry.set(A, K);
            this._registerStorage(q, K)
        }
        findOrUpdateCompatibleStorage(A) {
            let q = this._sharedRegistry.get(A.name);
            if (q === void 0) return null;
            return this._findOrUpdateCompatibleStorage(A, q)
        }
        findOrUpdateCompatibleCollectorStorage(A, q) {
            let K = this._perCollectorRegistry.get(A);
            if (K === void 0) return null;
            let Y = K.get(q.name);
            if (Y === void 0) return null;
            return this._findOrUpdateCompatibleStorage(q, Y)
        }
        _registerStorage(A, q) {
            let K = A.getInstrumentDescriptor(),
                Y = q.get(K.name);
            if (Y === void 0) {
                q.set(K.name, [A]);
                return
            }
            Y.push(A)
        }
        _findOrUpdateCompatibleStorage(A, q) {
            let K = null;
            for (let Y of q) {
                let z = Y.getInstrumentDescriptor();
                if ((0, $5Y.isDescriptorCompatibleWith)(z, A)) {
                    if (z.description !== A.description) {
                        if (A.description.length > z.description.length) Y.updateDescription(A.description);
                        UE4.diag.warn("A view or instrument with the name ", A.name, ` has already been registered, but has a different description and is incompatible with another registered view.
`, `Details:
`, (0, Af1.getIncompatibilityDetails)(z, A), `The longer description will be used.
To resolve the conflict:`, (0, Af1.getConflictResolutionRecipe)(z, A))
                    }
                    K = Y
                } else UE4.diag.warn("A view or instrument with the name ", A.name, ` has already been registered and is incompatible with another registered view.
`, `Details:
`, (0, Af1.getIncompatibilityDetails)(z, A), `To resolve the conflict:
`, (0, Af1.getConflictResolutionRecipe)(z, A))
            }
            return K
        }
    }
    dE4.MetricStorageRegistry = qh8
})
// @from(Ln 291465, Col 4)
oE4 = x((nE4) => {
    Object.defineProperty(nE4, "__esModule", {
        value: !0
    });
    nE4.MultiMetricStorage = void 0;
    class iE4 {
        _backingStorages;
        constructor(A) {
            this._backingStorages = A
        }
        record(A, q, K, Y) {
            this._backingStorages.forEach((z) => {
                z.record(A, q, K, Y)
            })
        }
    }
    nE4.MultiMetricStorage = iE4
})
// @from(Ln 291483, Col 4)
qy4 = x((eE4) => {
    Object.defineProperty(eE4, "__esModule", {
        value: !0
    });
    eE4.BatchObservableResultImpl = eE4.ObservableResultImpl = void 0;
    var ZG6 = yq(),
        aE4 = uU6(),
        H5Y = eG1();
    class sE4 {
        _instrumentName;
        _valueType;
        _buffer = new aE4.AttributeHashMap;
        constructor(A, q) {
            this._instrumentName = A, this._valueType = q
        }
        observe(A, q = {}) {
            if (typeof A !== "number") {
                ZG6.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${A}`);
                return
            }
            if (this._valueType === ZG6.ValueType.INT && !Number.isInteger(A)) {
                if (ZG6.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
            }
            this._buffer.set(q, A)
        }
    }
    eE4.ObservableResultImpl = sE4;
    class tE4 {
        _buffer = new Map;
        observe(A, q, K = {}) {
            if (!(0, H5Y.isObservableInstrument)(A)) return;
            let Y = this._buffer.get(A);
            if (Y == null) Y = new aE4.AttributeHashMap, this._buffer.set(A, Y);
            if (typeof q !== "number") {
                ZG6.diag.warn(`non-number value provided to metric ${A._descriptor.name}: ${q}`);
                return
            }
            if (A._descriptor.valueType === ZG6.ValueType.INT && !Number.isInteger(q)) {
                if (ZG6.diag.warn(`INT value type cannot accept a floating-point value for ${A._descriptor.name}, ignoring the fractional digits.`), q = Math.trunc(q), !Number.isInteger(q)) return
            }
            Y.set(K, q)
        }
    }
    eE4.BatchObservableResultImpl = tE4
})
// @from(Ln 291528, Col 4)
Oy4 = x((_y4) => {
    Object.defineProperty(_y4, "__esModule", {
        value: !0
    });
    _y4.ObservableRegistry = void 0;
    var J5Y = yq(),
        Ky4 = eG1(),
        Yy4 = qy4(),
        BU6 = Yb();
    class zy4 {
        _callbacks = [];
        _batchCallbacks = [];
        addCallback(A, q) {
            if (this._findCallback(A, q) >= 0) return;
            this._callbacks.push({
                callback: A,
                instrument: q
            })
        }
        removeCallback(A, q) {
            let K = this._findCallback(A, q);
            if (K < 0) return;
            this._callbacks.splice(K, 1)
        }
        addBatchCallback(A, q) {
            let K = new Set(q.filter(Ky4.isObservableInstrument));
            if (K.size === 0) {
                J5Y.diag.error("BatchObservableCallback is not associated with valid instruments", q);
                return
            }
            if (this._findBatchCallback(A, K) >= 0) return;
            this._batchCallbacks.push({
                callback: A,
                instruments: K
            })
        }
        removeBatchCallback(A, q) {
            let K = new Set(q.filter(Ky4.isObservableInstrument)),
                Y = this._findBatchCallback(A, K);
            if (Y < 0) return;
            this._batchCallbacks.splice(Y, 1)
        }
        async observe(A, q) {
            let K = this._observeCallbacks(A, q),
                Y = this._observeBatchCallbacks(A, q);
            return (await (0, BU6.PromiseAllSettled)([...K, ...Y])).filter(BU6.isPromiseAllSettledRejectionResult).map((w) => w.reason)
        }
        _observeCallbacks(A, q) {
            return this._callbacks.map(async ({
                callback: K,
                instrument: Y
            }) => {
                let z = new Yy4.ObservableResultImpl(Y._descriptor.name, Y._descriptor.valueType),
                    _ = Promise.resolve(K(z));
                if (q != null) _ = (0, BU6.callWithTimeout)(_, q);
                await _, Y._metricStorages.forEach((w) => {
                    w.record(z._buffer, A)
                })
            })
        }
        _observeBatchCallbacks(A, q) {
            return this._batchCallbacks.map(async ({
                callback: K,
                instruments: Y
            }) => {
                let z = new Yy4.BatchObservableResultImpl,
                    _ = Promise.resolve(K(z));
                if (q != null) _ = (0, BU6.callWithTimeout)(_, q);
                await _, Y.forEach((w) => {
                    let O = z._buffer.get(w);
                    if (O == null) return;
                    w._metricStorages.forEach(($) => {
                        $.record(O, A)
                    })
                })
            })
        }
        _findCallback(A, q) {
            return this._callbacks.findIndex((K) => {
                return K.callback === A && K.instrument === q
            })
        }
        _findBatchCallback(A, q) {
            return this._batchCallbacks.findIndex((K) => {
                return K.callback === A && (0, BU6.setEquals)(K.instruments, q)
            })
        }
    }
    _y4.ObservableRegistry = zy4
})
// @from(Ln 291618, Col 4)
Jy4 = x((Hy4) => {
    Object.defineProperty(Hy4, "__esModule", {
        value: !0
    });
    Hy4.SyncMetricStorage = void 0;
    var M5Y = aR8(),
        D5Y = eR8(),
        X5Y = Ah8();
    class $y4 extends M5Y.MetricStorage {
        _attributesProcessor;
        _aggregationCardinalityLimit;
        _deltaMetricStorage;
        _temporalMetricStorage;
        constructor(A, q, K, Y, z) {
            super(A);
            this._attributesProcessor = K, this._aggregationCardinalityLimit = z, this._deltaMetricStorage = new D5Y.DeltaMetricProcessor(q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new X5Y.TemporalMetricProcessor(q, Y)
        }
        record(A, q, K, Y) {
            q = this._attributesProcessor.process(q, K), this._deltaMetricStorage.record(A, q, K, Y)
        }
        collect(A, q) {
            let K = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, K, q)
        }
    }
    Hy4.SyncMetricStorage = $y4
})
// @from(Ln 291645, Col 4)
qf1 = x((Wy4) => {
    Object.defineProperty(Wy4, "__esModule", {
        value: !0
    });
    Wy4.createDenyListAttributesProcessor = Wy4.createAllowListAttributesProcessor = Wy4.createMultiAttributesProcessor = Wy4.createNoopAttributesProcessor = void 0;
    class My4 {
        process(A, q) {
            return A
        }
    }
    class Dy4 {
        _processors;
        constructor(A) {
            this._processors = A
        }
        process(A, q) {
            let K = A;
            for (let Y of this._processors) K = Y.process(K, q);
            return K
        }
    }
    class Xy4 {
        _allowedAttributeNames;
        constructor(A) {
            this._allowedAttributeNames = A
        }
        process(A, q) {
            let K = {};
            return Object.keys(A).filter((Y) => this._allowedAttributeNames.includes(Y)).forEach((Y) => K[Y] = A[Y]), K
        }
    }
    class Py4 {
        _deniedAttributeNames;
        constructor(A) {
            this._deniedAttributeNames = A
        }
        process(A, q) {
            let K = {};
            return Object.keys(A).filter((Y) => !this._deniedAttributeNames.includes(Y)).forEach((Y) => K[Y] = A[Y]), K
        }
    }

    function P5Y() {
        return f5Y
    }
    Wy4.createNoopAttributesProcessor = P5Y;

    function W5Y(A) {
        return new Dy4(A)
    }
    Wy4.createMultiAttributesProcessor = W5Y;

    function Z5Y(A) {
        return new Xy4(A)
    }
    Wy4.createAllowListAttributesProcessor = Z5Y;

    function G5Y(A) {
        return new Py4(A)
    }
    Wy4.createDenyListAttributesProcessor = G5Y;
    var f5Y = new My4
})
// @from(Ln 291708, Col 4)
vy4 = x((fy4) => {
    Object.defineProperty(fy4, "__esModule", {
        value: !0
    });
    fy4.MeterSharedState = void 0;
    var V5Y = xU6(),
        k5Y = fE4(),
        E5Y = Yb(),
        y5Y = xE4(),
        L5Y = lE4(),
        R5Y = oE4(),
        h5Y = Oy4(),
        S5Y = Jy4(),
        C5Y = qf1();
    class Gy4 {
        _meterProviderSharedState;
        _instrumentationScope;
        metricStorageRegistry = new L5Y.MetricStorageRegistry;
        observableRegistry = new h5Y.ObservableRegistry;
        meter;
        constructor(A, q) {
            this._meterProviderSharedState = A, this._instrumentationScope = q, this.meter = new k5Y.Meter(this)
        }
        registerMetricStorage(A) {
            let q = this._registerMetricStorage(A, S5Y.SyncMetricStorage);
            if (q.length === 1) return q[0];
            return new R5Y.MultiMetricStorage(q)
        }
        registerAsyncMetricStorage(A) {
            return this._registerMetricStorage(A, y5Y.AsyncMetricStorage)
        }
        async collect(A, q, K) {
            let Y = await this.observableRegistry.observe(q, K?.timeoutMillis),
                z = this.metricStorageRegistry.getStorages(A);
            if (z.length === 0) return null;
            let _ = z.map((w) => {
                return w.collect(A, q)
            }).filter(E5Y.isNotNullish);
            if (_.length === 0) return {
                errors: Y
            };
            return {
                scopeMetrics: {
                    scope: this._instrumentationScope,
                    metrics: _
                },
                errors: Y
            }
        }
        _registerMetricStorage(A, q) {
            let Y = this._meterProviderSharedState.viewRegistry.findViews(A, this._instrumentationScope).map((z) => {
                let _ = (0, V5Y.createInstrumentDescriptorWithView)(z, A),
                    w = this.metricStorageRegistry.findOrUpdateCompatibleStorage(_);
                if (w != null) return w;
                let O = z.aggregation.createAggregator(_),
                    $ = new q(_, O, z.attributesProcessor, this._meterProviderSharedState.metricCollectors, z.aggregationCardinalityLimit);
                return this.metricStorageRegistry.register($), $
            });
            if (Y.length === 0) {
                let _ = this._meterProviderSharedState.selectAggregations(A.type).map(([w, O]) => {
                    let $ = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(w, A);
                    if ($ != null) return $;
                    let H = O.createAggregator(A),
                        j = w.selectCardinalityLimit(A.type),
                        J = new q(A, H, (0, C5Y.createNoopAttributesProcessor)(), [w], j);
                    return this.metricStorageRegistry.registerForCollector(w, J), J
                });
                Y = Y.concat(_)
            }
            return Y
        }
    }
    fy4.MeterSharedState = Gy4
})
// @from(Ln 291782, Col 4)
Ey4 = x((Vy4) => {
    Object.defineProperty(Vy4, "__esModule", {
        value: !0
    });
    Vy4.MeterProviderSharedState = void 0;
    var I5Y = Yb(),
        b5Y = KE4(),
        x5Y = vy4(),
        u5Y = bU6();
    class Ny4 {
        resource;
        viewRegistry = new b5Y.ViewRegistry;
        metricCollectors = [];
        meterSharedStates = new Map;
        constructor(A) {
            this.resource = A
        }
        getMeterSharedState(A) {
            let q = (0, I5Y.instrumentationScopeId)(A),
                K = this.meterSharedStates.get(q);
            if (K == null) K = new x5Y.MeterSharedState(this, A), this.meterSharedStates.set(q, K);
            return K
        }
        selectAggregations(A) {
            let q = [];
            for (let K of this.metricCollectors) q.push([K, (0, u5Y.toAggregation)(K.selectAggregation(A))]);
            return q
        }
    }
    Vy4.MeterProviderSharedState = Ny4
})
// @from(Ln 291813, Col 4)
hy4 = x((Ly4) => {
    Object.defineProperty(Ly4, "__esModule", {
        value: !0
    });
    Ly4.MetricCollector = void 0;
    var m5Y = K9();
    class yy4 {
        _sharedState;
        _metricReader;
        constructor(A, q) {
            this._sharedState = A, this._metricReader = q
        }
        async collect(A) {
            let q = (0, m5Y.millisToHrTime)(Date.now()),
                K = [],
                Y = [],
                z = Array.from(this._sharedState.meterSharedStates.values()).map(async (_) => {
                    let w = await _.collect(this, q, A);
                    if (w?.scopeMetrics != null) K.push(w.scopeMetrics);
                    if (w?.errors != null) Y.push(...w.errors)
                });
            return await Promise.all(z), {
                resourceMetrics: {
                    resource: this._sharedState.resource,
                    scopeMetrics: K
                },
                errors: Y
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
    Ly4.MetricCollector = yy4
})
// @from(Ln 291860, Col 4)
Kf1 = x((Cy4) => {
    Object.defineProperty(Cy4, "__esModule", {
        value: !0
    });
    Cy4.ExactPredicate = Cy4.PatternPredicate = void 0;
    var B5Y = /[\^$\\.+?()[\]{}|]/g;
    class Kh8 {
        _matchAll;
        _regexp;
        constructor(A) {
            if (A === "*") this._matchAll = !0, this._regexp = /.*/;
            else this._matchAll = !1, this._regexp = new RegExp(Kh8.escapePattern(A))
        }
        match(A) {
            if (this._matchAll) return !0;
            return this._regexp.test(A)
        }
        static escapePattern(A) {
            return `^${A.replace(B5Y,"\\$&").replace("*",".*")}$`
        }
        static hasWildcard(A) {
            return A.includes("*")
        }
    }
    Cy4.PatternPredicate = Kh8;
    class Sy4 {
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
    Cy4.ExactPredicate = Sy4
})
// @from(Ln 291899, Col 4)
By4 = x((uy4) => {
    Object.defineProperty(uy4, "__esModule", {
        value: !0
    });
    uy4.InstrumentSelector = void 0;
    var by4 = Kf1();
    class xy4 {
        _nameFilter;
        _type;
        _unitFilter;
        constructor(A) {
            this._nameFilter = new by4.PatternPredicate(A?.name ?? "*"), this._type = A?.type, this._unitFilter = new by4.ExactPredicate(A?.unit)
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
    uy4.InstrumentSelector = xy4
})
// @from(Ln 291924, Col 4)
Qy4 = x((Fy4) => {
    Object.defineProperty(Fy4, "__esModule", {
        value: !0
    });
    Fy4.MeterSelector = void 0;
    var Yh8 = Kf1();
    class gy4 {
        _nameFilter;
        _versionFilter;
        _schemaUrlFilter;
        constructor(A) {
            this._nameFilter = new Yh8.ExactPredicate(A?.name), this._versionFilter = new Yh8.ExactPredicate(A?.version), this._schemaUrlFilter = new Yh8.ExactPredicate(A?.schemaUrl)
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
    Fy4.MeterSelector = gy4
})
// @from(Ln 291949, Col 4)
ny4 = x((ly4) => {
    Object.defineProperty(ly4, "__esModule", {
        value: !0
    });
    ly4.View = void 0;
    var F5Y = Kf1(),
        Uy4 = qf1(),
        p5Y = By4(),
        Q5Y = Qy4(),
        dy4 = bU6();

    function U5Y(A) {
        return A.instrumentName == null && A.instrumentType == null && A.instrumentUnit == null && A.meterName == null && A.meterVersion == null && A.meterSchemaUrl == null
    }

    function d5Y(A) {
        if (U5Y(A)) throw Error("Cannot create view with no selector arguments supplied");
        if (A.name != null && (A?.instrumentName == null || F5Y.PatternPredicate.hasWildcard(A.instrumentName))) throw Error("Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.")
    }
    class cy4 {
        name;
        description;
        aggregation;
        attributesProcessor;
        instrumentSelector;
        meterSelector;
        aggregationCardinalityLimit;
        constructor(A) {
            if (d5Y(A), A.attributesProcessors != null) this.attributesProcessor = (0, Uy4.createMultiAttributesProcessor)(A.attributesProcessors);
            else this.attributesProcessor = (0, Uy4.createNoopAttributesProcessor)();
            this.name = A.name, this.description = A.description, this.aggregation = (0, dy4.toAggregation)(A.aggregation ?? {
                type: dy4.AggregationType.DEFAULT
            }), this.instrumentSelector = new p5Y.InstrumentSelector({
                name: A.instrumentName,
                type: A.instrumentType,
                unit: A.instrumentUnit
            }), this.meterSelector = new Q5Y.MeterSelector({
                name: A.meterName,
                version: A.meterVersion,
                schemaUrl: A.meterSchemaUrl
            }), this.aggregationCardinalityLimit = A.aggregationCardinalityLimit
        }
    }
    ly4.View = cy4
})
// @from(Ln 291994, Col 4)
sy4 = x((oy4) => {
    Object.defineProperty(oy4, "__esModule", {
        value: !0
    });
    oy4.MeterProvider = void 0;
    var Yf1 = yq(),
        c5Y = KH6(),
        l5Y = Ey4(),
        i5Y = hy4(),
        n5Y = ny4();
    class ry4 {
        _sharedState;
        _shutdown = !1;
        constructor(A) {
            if (this._sharedState = new l5Y.MeterProviderSharedState(A?.resource ?? (0, c5Y.defaultResource)()), A?.views != null && A.views.length > 0)
                for (let q of A.views) this._sharedState.viewRegistry.addView(new n5Y.View(q));
            if (A?.readers != null && A.readers.length > 0)
                for (let q of A.readers) {
                    let K = new i5Y.MetricCollector(this._sharedState, q);
                    q.setMetricProducer(K), this._sharedState.metricCollectors.push(K)
                }
        }
        getMeter(A, q = "", K = {}) {
            if (this._shutdown) return Yf1.diag.warn("A shutdown MeterProvider cannot provide a Meter"), (0, Yf1.createNoopMeter)();
            return this._sharedState.getMeterSharedState({
                name: A,
                version: q,
                schemaUrl: K.schemaUrl
            }).meter
        }
        async shutdown(A) {
            if (this._shutdown) {
                Yf1.diag.warn("shutdown may only be called once per MeterProvider");
                return
            }
            this._shutdown = !0, await Promise.all(this._sharedState.metricCollectors.map((q) => {
                return q.shutdown(A)
            }))
        }
        async forceFlush(A) {
            if (this._shutdown) {
                Yf1.diag.warn("invalid attempt to force flush after MeterProvider shutdown");
                return
            }
            await Promise.all(this._sharedState.metricCollectors.map((q) => {
                return q.forceFlush(A)
            }))
        }
    }
    oy4.MeterProvider = ry4
})
// @from(Ln 292045, Col 4)
ue = x((qN) => {
    Object.defineProperty(qN, "__esModule", {
        value: !0
    });
    qN.TimeoutError = qN.createDenyListAttributesProcessor = qN.createAllowListAttributesProcessor = qN.AggregationType = qN.MeterProvider = qN.ConsoleMetricExporter = qN.InMemoryMetricExporter = qN.PeriodicExportingMetricReader = qN.MetricReader = qN.InstrumentType = qN.DataPointType = qN.AggregationTemporality = void 0;
    var r5Y = dG1();
    Object.defineProperty(qN, "AggregationTemporality", {
        enumerable: !0,
        get: function() {
            return r5Y.AggregationTemporality
        }
    });
    var ty4 = xe();
    Object.defineProperty(qN, "DataPointType", {
        enumerable: !0,
        get: function() {
            return ty4.DataPointType
        }
    });
    Object.defineProperty(qN, "InstrumentType", {
        enumerable: !0,
        get: function() {
            return ty4.InstrumentType
        }
    });
    var o5Y = nR8();
    Object.defineProperty(qN, "MetricReader", {
        enumerable: !0,
        get: function() {
            return o5Y.MetricReader
        }
    });
    var a5Y = dk4();
    Object.defineProperty(qN, "PeriodicExportingMetricReader", {
        enumerable: !0,
        get: function() {
            return a5Y.PeriodicExportingMetricReader
        }
    });
    var s5Y = rk4();
    Object.defineProperty(qN, "InMemoryMetricExporter", {
        enumerable: !0,
        get: function() {
            return s5Y.InMemoryMetricExporter
        }
    });
    var t5Y = tk4();
    Object.defineProperty(qN, "ConsoleMetricExporter", {
        enumerable: !0,
        get: function() {
            return t5Y.ConsoleMetricExporter
        }
    });
    var e5Y = sy4();
    Object.defineProperty(qN, "MeterProvider", {
        enumerable: !0,
        get: function() {
            return e5Y.MeterProvider
        }
    });
    var A3Y = bU6();
    Object.defineProperty(qN, "AggregationType", {
        enumerable: !0,
        get: function() {
            return A3Y.AggregationType
        }
    });
    var ey4 = qf1();
    Object.defineProperty(qN, "createAllowListAttributesProcessor", {
        enumerable: !0,
        get: function() {
            return ey4.createAllowListAttributesProcessor
        }
    });
    Object.defineProperty(qN, "createDenyListAttributesProcessor", {
        enumerable: !0,
        get: function() {
            return ey4.createDenyListAttributesProcessor
        }
    });
    var q3Y = Yb();
    Object.defineProperty(qN, "TimeoutError", {
        enumerable: !0,
        get: function() {
            return q3Y.TimeoutError
        }
    })
})
// @from(Ln 292133, Col 4)
_h8 = x((AL4) => {
    Object.defineProperty(AL4, "__esModule", {
        value: !0
    });
    AL4.AggregationTemporalityPreference = void 0;
    var Y3Y;
    (function(A) {
        A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE", A[A.LOWMEMORY = 2] = "LOWMEMORY"
    })(Y3Y = AL4.AggregationTemporalityPreference || (AL4.AggregationTemporalityPreference = {}))
})
// @from(Ln 292143, Col 4)
zL4 = x((KL4) => {
    Object.defineProperty(KL4, "__esModule", {
        value: !0
    });
    KL4.OTLPExporterBase = void 0;
    class qL4 {
        _delegate;
        constructor(A) {
            this._delegate = A
        }
        export (A, q) {
            this._delegate.export(A, q)
        }
        forceFlush() {
            return this._delegate.forceFlush()
        }
        shutdown() {
            return this._delegate.shutdown()
        }
    }
    KL4.OTLPExporterBase = qL4
})
// @from(Ln 292165, Col 4)
zf1 = x((wL4) => {
    Object.defineProperty(wL4, "__esModule", {
        value: !0
    });
    wL4.OTLPExporterError = void 0;
    class _L4 extends Error {
        code;
        name = "OTLPExporterError";
        data;
        constructor(A, q, K) {
            super(A);
            this.data = K, this.code = q
        }
    }
    wL4.OTLPExporterError = _L4
})
// @from(Ln 292181, Col 4)
gU6 = x((HL4) => {
    Object.defineProperty(HL4, "__esModule", {
        value: !0
    });
    HL4.getSharedConfigurationDefaults = HL4.mergeOtlpSharedConfigurationWithDefaults = HL4.wrapStaticHeadersInFunction = HL4.validateTimeoutMillis = void 0;

    function $L4(A) {
        if (Number.isFinite(A) && A > 0) return A;
        throw Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${A}')`)
    }
    HL4.validateTimeoutMillis = $L4;

    function z3Y(A) {
        if (A == null) return;
        return async () => A
    }
    HL4.wrapStaticHeadersInFunction = z3Y;

    function _3Y(A, q, K) {
        return {
            timeoutMillis: $L4(A.timeoutMillis ?? q.timeoutMillis ?? K.timeoutMillis),
            concurrencyLimit: A.concurrencyLimit ?? q.concurrencyLimit ?? K.concurrencyLimit,
            compression: A.compression ?? q.compression ?? K.compression
        }
    }
    HL4.mergeOtlpSharedConfigurationWithDefaults = _3Y;

    function w3Y() {
        return {
            timeoutMillis: 1e4,
            concurrencyLimit: 30,
            compression: "none"
        }
    }
    HL4.getSharedConfigurationDefaults = w3Y
})
// @from(Ln 292217, Col 4)
ML4 = x((JL4) => {
    Object.defineProperty(JL4, "__esModule", {
        value: !0
    });
    JL4.CompressionAlgorithm = void 0;
    var j3Y;
    (function(A) {
        A.NONE = "none", A.GZIP = "gzip"
    })(j3Y = JL4.CompressionAlgorithm || (JL4.CompressionAlgorithm = {}))
})
// @from(Ln 292227, Col 4)
Oh8 = x((XL4) => {
    Object.defineProperty(XL4, "__esModule", {
        value: !0
    });
    XL4.createBoundedQueueExportPromiseHandler = void 0;
    class DL4 {
        _concurrencyLimit;
        _sendingPromises = [];
        constructor(A) {
            this._concurrencyLimit = A
        }
        pushPromise(A) {
            if (this.hasReachedLimit()) throw Error("Concurrency Limit reached");
            this._sendingPromises.push(A);
            let q = () => {
                let K = this._sendingPromises.indexOf(A);
                this._sendingPromises.splice(K, 1)
            };
            A.then(q, q)
        }
        hasReachedLimit() {
            return this._sendingPromises.length >= this._concurrencyLimit
        }
        async awaitAll() {
            await Promise.all(this._sendingPromises)
        }
    }

    function J3Y(A) {
        return new DL4(A.concurrencyLimit)
    }
    XL4.createBoundedQueueExportPromiseHandler = J3Y
})
// @from(Ln 292260, Col 4)
GL4 = x((WL4) => {
    Object.defineProperty(WL4, "__esModule", {
        value: !0
    });
    WL4.createLoggingPartialSuccessResponseHandler = void 0;
    var M3Y = yq();

    function D3Y(A) {
        return Object.prototype.hasOwnProperty.call(A, "partialSuccess")
    }

    function X3Y() {
        return {
            handleResponse(A) {
                if (A == null || !D3Y(A) || A.partialSuccess == null || Object.keys(A.partialSuccess).length === 0) return;
                M3Y.diag.warn("Received Partial Success response:", JSON.stringify(A.partialSuccess))
            }
        }
    }
    WL4.createLoggingPartialSuccessResponseHandler = X3Y
})
// @from(Ln 292281, Col 4)
$h8 = x((vL4) => {
    Object.defineProperty(vL4, "__esModule", {
        value: !0
    });
    vL4.createOtlpExportDelegate = void 0;
    var zY6 = K9(),
        fL4 = zf1(),
        P3Y = GL4(),
        W3Y = yq();
    class TL4 {
        _transport;
        _serializer;
        _responseHandler;
        _promiseQueue;
        _timeout;
        _diagLogger;
        constructor(A, q, K, Y, z) {
            this._transport = A, this._serializer = q, this._responseHandler = K, this._promiseQueue = Y, this._timeout = z, this._diagLogger = W3Y.diag.createComponentLogger({
                namespace: "OTLPExportDelegate"
            })
        }
        export (A, q) {
            if (this._diagLogger.debug("items to be sent", A), this._promiseQueue.hasReachedLimit()) {
                q({
                    code: zY6.ExportResultCode.FAILED,
                    error: Error("Concurrent export limit reached")
                });
                return
            }
            let K = this._serializer.serializeRequest(A);
            if (K == null) {
                q({
                    code: zY6.ExportResultCode.FAILED,
                    error: Error("Nothing to send")
                });
                return
            }
            this._promiseQueue.pushPromise(this._transport.send(K, this._timeout).then((Y) => {
                if (Y.status === "success") {
                    if (Y.data != null) try {
                        this._responseHandler.handleResponse(this._serializer.deserializeResponse(Y.data))
                    } catch (z) {
                        this._diagLogger.warn("Export succeeded but could not deserialize response - is the response specification compliant?", z, Y.data)
                    }
                    q({
                        code: zY6.ExportResultCode.SUCCESS
                    });
                    return
                } else if (Y.status === "failure" && Y.error) {
                    q({
                        code: zY6.ExportResultCode.FAILED,
                        error: Y.error
                    });
                    return
                } else if (Y.status === "retryable") q({
                    code: zY6.ExportResultCode.FAILED,
                    error: new fL4.OTLPExporterError("Export failed with retryable status")
                });
                else q({
                    code: zY6.ExportResultCode.FAILED,
                    error: new fL4.OTLPExporterError("Export failed with unknown error")
                })
            }, (Y) => q({
                code: zY6.ExportResultCode.FAILED,
                error: Y
            })))
        }
        forceFlush() {
            return this._promiseQueue.awaitAll()
        }
        async shutdown() {
            this._diagLogger.debug("shutdown started"), await this.forceFlush(), this._transport.shutdown()
        }
    }

    function Z3Y(A, q) {
        return new TL4(A.transport, A.serializer, (0, P3Y.createLoggingPartialSuccessResponseHandler)(), A.promiseHandler, q.timeout)
    }
    vL4.createOtlpExportDelegate = Z3Y
})
// @from(Ln 292361, Col 4)
EL4 = x((VL4) => {
    Object.defineProperty(VL4, "__esModule", {
        value: !0
    });
    VL4.createOtlpNetworkExportDelegate = void 0;
    var G3Y = Oh8(),
        f3Y = $h8();

    function T3Y(A, q, K) {
        return (0, f3Y.createOtlpExportDelegate)({
            transport: K,
            serializer: q,
            promiseHandler: (0, G3Y.createBoundedQueueExportPromiseHandler)(A)
        }, {
            timeout: A.timeoutMillis
        })
    }
    VL4.createOtlpNetworkExportDelegate = T3Y
})
// @from(Ln 292380, Col 4)
Pg = x((me) => {
    Object.defineProperty(me, "__esModule", {
        value: !0
    });
    me.createOtlpNetworkExportDelegate = me.CompressionAlgorithm = me.getSharedConfigurationDefaults = me.mergeOtlpSharedConfigurationWithDefaults = me.OTLPExporterError = me.OTLPExporterBase = void 0;
    var v3Y = zL4();
    Object.defineProperty(me, "OTLPExporterBase", {
        enumerable: !0,
        get: function() {
            return v3Y.OTLPExporterBase
        }
    });
    var N3Y = zf1();
    Object.defineProperty(me, "OTLPExporterError", {
        enumerable: !0,
        get: function() {
            return N3Y.OTLPExporterError
        }
    });
    var yL4 = gU6();
    Object.defineProperty(me, "mergeOtlpSharedConfigurationWithDefaults", {
        enumerable: !0,
        get: function() {
            return yL4.mergeOtlpSharedConfigurationWithDefaults
        }
    });
    Object.defineProperty(me, "getSharedConfigurationDefaults", {
        enumerable: !0,
        get: function() {
            return yL4.getSharedConfigurationDefaults
        }
    });
    var V3Y = ML4();
    Object.defineProperty(me, "CompressionAlgorithm", {
        enumerable: !0,
        get: function() {
            return V3Y.CompressionAlgorithm
        }
    });
    var k3Y = EL4();
    Object.defineProperty(me, "createOtlpNetworkExportDelegate", {
        enumerable: !0,
        get: function() {
            return k3Y.createOtlpNetworkExportDelegate
        }
    })
})
// @from(Ln 292427, Col 4)
Jh8 = x((hL4) => {
    Object.defineProperty(hL4, "__esModule", {
        value: !0
    });
    hL4.OTLPMetricExporterBase = hL4.LowMemoryTemporalitySelector = hL4.DeltaTemporalitySelector = hL4.CumulativeTemporalitySelector = void 0;
    var y3Y = K9(),
        OM = ue(),
        LL4 = _h8(),
        L3Y = Pg(),
        R3Y = yq(),
        h3Y = () => OM.AggregationTemporality.CUMULATIVE;
    hL4.CumulativeTemporalitySelector = h3Y;
    var S3Y = (A) => {
        switch (A) {
            case OM.InstrumentType.COUNTER:
            case OM.InstrumentType.OBSERVABLE_COUNTER:
            case OM.InstrumentType.GAUGE:
            case OM.InstrumentType.HISTOGRAM:
            case OM.InstrumentType.OBSERVABLE_GAUGE:
                return OM.AggregationTemporality.DELTA;
            case OM.InstrumentType.UP_DOWN_COUNTER:
            case OM.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                return OM.AggregationTemporality.CUMULATIVE
        }
    };
    hL4.DeltaTemporalitySelector = S3Y;
    var C3Y = (A) => {
        switch (A) {
            case OM.InstrumentType.COUNTER:
            case OM.InstrumentType.HISTOGRAM:
                return OM.AggregationTemporality.DELTA;
            case OM.InstrumentType.GAUGE:
            case OM.InstrumentType.UP_DOWN_COUNTER:
            case OM.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
            case OM.InstrumentType.OBSERVABLE_COUNTER:
            case OM.InstrumentType.OBSERVABLE_GAUGE:
                return OM.AggregationTemporality.CUMULATIVE
        }
    };
    hL4.LowMemoryTemporalitySelector = C3Y;

    function I3Y() {
        let A = ((0, y3Y.getStringFromEnv)("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE") ?? "cumulative").toLowerCase();
        if (A === "cumulative") return hL4.CumulativeTemporalitySelector;
        if (A === "delta") return hL4.DeltaTemporalitySelector;
        if (A === "lowmemory") return hL4.LowMemoryTemporalitySelector;
        return R3Y.diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${A}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`), hL4.CumulativeTemporalitySelector
    }

    function b3Y(A) {
        if (A != null) {
            if (A === LL4.AggregationTemporalityPreference.DELTA) return hL4.DeltaTemporalitySelector;
            else if (A === LL4.AggregationTemporalityPreference.LOWMEMORY) return hL4.LowMemoryTemporalitySelector;
            return hL4.CumulativeTemporalitySelector
        }
        return I3Y()
    }
    var x3Y = Object.freeze({
        type: OM.AggregationType.DEFAULT
    });

    function u3Y(A) {
        return A?.aggregationPreference ?? (() => x3Y)
    }
    class RL4 extends L3Y.OTLPExporterBase {
        _aggregationTemporalitySelector;
        _aggregationSelector;
        constructor(A, q) {
            super(A);
            this._aggregationSelector = u3Y(q), this._aggregationTemporalitySelector = b3Y(q?.temporalityPreference)
        }
        selectAggregation(A) {
            return this._aggregationSelector(A)
        }
        selectAggregationTemporality(A) {
            return this._aggregationTemporalitySelector(A)
        }
    }
    hL4.OTLPMetricExporterBase = RL4
})
// @from(Ln 292507, Col 4)
Mh8 = x((pDw, CL4) => {
    CL4.exports = m3Y;

    function m3Y(A, q) {
        var K = Array(arguments.length - 1),
            Y = 0,
            z = 2,
            _ = !0;
        while (z < arguments.length) K[Y++] = arguments[z++];
        return new Promise(function(O, $) {
            K[Y] = function(j) {
                if (_)
                    if (_ = !1, j) $(j);
                    else {
                        var J = Array(arguments.length - 1),
                            M = 0;
                        while (M < J.length) J[M++] = arguments[M];
                        O.apply(null, J)
                    }
            };
            try {
                A.apply(q || null, K)
            } catch (H) {
                if (_) _ = !1, $(H)
            }
        })
    }
})
// @from(Ln 292535, Col 4)
uL4 = x((xL4) => {
    var wf1 = xL4;
    wf1.length = function(q) {
        var K = q.length;
        if (!K) return 0;
        var Y = 0;
        while (--K % 4 > 1 && q.charAt(K) === "=") ++Y;
        return Math.ceil(q.length * 3) / 4 - Y
    };
    var GG6 = Array(64),
        bL4 = Array(123);
    for (UR = 0; UR < 64;) bL4[GG6[UR] = UR < 26 ? UR + 65 : UR < 52 ? UR + 71 : UR < 62 ? UR - 4 : UR - 59 | 43] = UR++;
    var UR;
    wf1.encode = function(q, K, Y) {
        var z = null,
            _ = [],
            w = 0,
            O = 0,
            $;
        while (K < Y) {
            var H = q[K++];
            switch (O) {
                case 0:
                    _[w++] = GG6[H >> 2], $ = (H & 3) << 4, O = 1;
                    break;
                case 1:
                    _[w++] = GG6[$ | H >> 4], $ = (H & 15) << 2, O = 2;
                    break;
                case 2:
                    _[w++] = GG6[$ | H >> 6], _[w++] = GG6[H & 63], O = 0;
                    break
            }
            if (w > 8191)(z || (z = [])).push(String.fromCharCode.apply(String, _)), w = 0
        }
        if (O) {
            if (_[w++] = GG6[$], _[w++] = 61, O === 1) _[w++] = 61
        }
        if (z) {
            if (w) z.push(String.fromCharCode.apply(String, _.slice(0, w)));
            return z.join("")
        }
        return String.fromCharCode.apply(String, _.slice(0, w))
    };
    var IL4 = "invalid encoding";
    wf1.decode = function(q, K, Y) {
        var z = Y,
            _ = 0,
            w;
        for (var O = 0; O < q.length;) {
            var $ = q.charCodeAt(O++);
            if ($ === 61 && _ > 1) break;
            if (($ = bL4[$]) === void 0) throw Error(IL4);
            switch (_) {
                case 0:
                    w = $, _ = 1;
                    break;
                case 1:
                    K[Y++] = w << 2 | ($ & 48) >> 4, w = $, _ = 2;
                    break;
                case 2:
                    K[Y++] = (w & 15) << 4 | ($ & 60) >> 2, w = $, _ = 3;
                    break;
                case 3:
                    K[Y++] = (w & 3) << 6 | $, _ = 0;
                    break
            }
        }
        if (_ === 1) throw Error(IL4);
        return Y - z
    };
    wf1.test = function(q) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(q)
    }
})
// @from(Ln 292609, Col 4)
BL4 = x((UDw, mL4) => {
    mL4.exports = Of1;

    function Of1() {
        this._listeners = {}
    }
    Of1.prototype.on = function(q, K, Y) {
        return (this._listeners[q] || (this._listeners[q] = [])).push({
            fn: K,
            ctx: Y || this
        }), this
    };
    Of1.prototype.off = function(q, K) {
        if (q === void 0) this._listeners = {};
        else if (K === void 0) this._listeners[q] = [];
        else {
            var Y = this._listeners[q];
            for (var z = 0; z < Y.length;)
                if (Y[z].fn === K) Y.splice(z, 1);
                else ++z
        }
        return this
    };
    Of1.prototype.emit = function(q) {
        var K = this._listeners[q];
        if (K) {
            var Y = [],
                z = 1;
            for (; z < arguments.length;) Y.push(arguments[z++]);
            for (z = 0; z < K.length;) K[z].fn.apply(K[z++].ctx, Y)
        }
        return this
    }
})
// @from(Ln 292643, Col 4)
cL4 = x((dDw, dL4) => {
    dL4.exports = gL4(gL4);

    function gL4(A) {
        if (typeof Float32Array < "u")(function() {
            var q = new Float32Array([-0]),
                K = new Uint8Array(q.buffer),
                Y = K[3] === 128;

            function z($, H, j) {
                q[0] = $, H[j] = K[0], H[j + 1] = K[1], H[j + 2] = K[2], H[j + 3] = K[3]
            }

            function _($, H, j) {
                q[0] = $, H[j] = K[3], H[j + 1] = K[2], H[j + 2] = K[1], H[j + 3] = K[0]
            }
            A.writeFloatLE = Y ? z : _, A.writeFloatBE = Y ? _ : z;

            function w($, H) {
                return K[0] = $[H], K[1] = $[H + 1], K[2] = $[H + 2], K[3] = $[H + 3], q[0]
            }

            function O($, H) {
                return K[3] = $[H], K[2] = $[H + 1], K[1] = $[H + 2], K[0] = $[H + 3], q[0]
            }
            A.readFloatLE = Y ? w : O, A.readFloatBE = Y ? O : w
        })();
        else(function() {
            function q(Y, z, _, w) {
                var O = z < 0 ? 1 : 0;
                if (O) z = -z;
                if (z === 0) Y(1 / z > 0 ? 0 : 2147483648, _, w);
                else if (isNaN(z)) Y(2143289344, _, w);
                else if (z > 340282346638528860000000000000000000000) Y((O << 31 | 2139095040) >>> 0, _, w);
                else if (z < 0.000000000000000000000000000000000000011754943508222875) Y((O << 31 | Math.round(z / 0.000000000000000000000000000000000000000000001401298464324817)) >>> 0, _, w);
                else {
                    var $ = Math.floor(Math.log(z) / Math.LN2),
                        H = Math.round(z * Math.pow(2, -$) * 8388608) & 8388607;
                    Y((O << 31 | $ + 127 << 23 | H) >>> 0, _, w)
                }
            }
            A.writeFloatLE = q.bind(null, FL4), A.writeFloatBE = q.bind(null, pL4);

            function K(Y, z, _) {
                var w = Y(z, _),
                    O = (w >> 31) * 2 + 1,
                    $ = w >>> 23 & 255,
                    H = w & 8388607;
                return $ === 255 ? H ? NaN : O * (1 / 0) : $ === 0 ? O * 0.000000000000000000000000000000000000000000001401298464324817 * H : O * Math.pow(2, $ - 150) * (H + 8388608)
            }
            A.readFloatLE = K.bind(null, QL4), A.readFloatBE = K.bind(null, UL4)
        })();
        if (typeof Float64Array < "u")(function() {
            var q = new Float64Array([-0]),
                K = new Uint8Array(q.buffer),
                Y = K[7] === 128;

            function z($, H, j) {
                q[0] = $, H[j] = K[0], H[j + 1] = K[1], H[j + 2] = K[2], H[j + 3] = K[3], H[j + 4] = K[4], H[j + 5] = K[5], H[j + 6] = K[6], H[j + 7] = K[7]
            }

            function _($, H, j) {
                q[0] = $, H[j] = K[7], H[j + 1] = K[6], H[j + 2] = K[5], H[j + 3] = K[4], H[j + 4] = K[3], H[j + 5] = K[2], H[j + 6] = K[1], H[j + 7] = K[0]
            }
            A.writeDoubleLE = Y ? z : _, A.writeDoubleBE = Y ? _ : z;

            function w($, H) {
                return K[0] = $[H], K[1] = $[H + 1], K[2] = $[H + 2], K[3] = $[H + 3], K[4] = $[H + 4], K[5] = $[H + 5], K[6] = $[H + 6], K[7] = $[H + 7], q[0]
            }

            function O($, H) {
                return K[7] = $[H], K[6] = $[H + 1], K[5] = $[H + 2], K[4] = $[H + 3], K[3] = $[H + 4], K[2] = $[H + 5], K[1] = $[H + 6], K[0] = $[H + 7], q[0]
            }
            A.readDoubleLE = Y ? w : O, A.readDoubleBE = Y ? O : w
        })();
        else(function() {
            function q(Y, z, _, w, O, $) {
                var H = w < 0 ? 1 : 0;
                if (H) w = -w;
                if (w === 0) Y(0, O, $ + z), Y(1 / w > 0 ? 0 : 2147483648, O, $ + _);
                else if (isNaN(w)) Y(0, O, $ + z), Y(2146959360, O, $ + _);
                else if (w > 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000) Y(0, O, $ + z), Y((H << 31 | 2146435072) >>> 0, O, $ + _);
                else {
                    var j;
                    if (w < 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022250738585072014) j = w / 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005, Y(j >>> 0, O, $ + z), Y((H << 31 | j / 4294967296) >>> 0, O, $ + _);
                    else {
                        var J = Math.floor(Math.log(w) / Math.LN2);
                        if (J === 1024) J = 1023;
                        j = w * Math.pow(2, -J), Y(j * 4503599627370496 >>> 0, O, $ + z), Y((H << 31 | J + 1023 << 20 | j * 1048576 & 1048575) >>> 0, O, $ + _)
                    }
                }
            }
            A.writeDoubleLE = q.bind(null, FL4, 0, 4), A.writeDoubleBE = q.bind(null, pL4, 4, 0);

            function K(Y, z, _, w, O) {
                var $ = Y(w, O + z),
                    H = Y(w, O + _),
                    j = (H >> 31) * 2 + 1,
                    J = H >>> 20 & 2047,
                    M = 4294967296 * (H & 1048575) + $;
                return J === 2047 ? M ? NaN : j * (1 / 0) : J === 0 ? j * 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005 * M : j * Math.pow(2, J - 1075) * (M + 4503599627370496)
            }
            A.readDoubleLE = K.bind(null, QL4, 0, 4), A.readDoubleBE = K.bind(null, UL4, 4, 0)
        })();
        return A
    }

    function FL4(A, q, K) {
        q[K] = A & 255, q[K + 1] = A >>> 8 & 255, q[K + 2] = A >>> 16 & 255, q[K + 3] = A >>> 24
    }

    function pL4(A, q, K) {
        q[K] = A >>> 24, q[K + 1] = A >>> 16 & 255, q[K + 2] = A >>> 8 & 255, q[K + 3] = A & 255
    }

    function QL4(A, q) {
        return (A[q] | A[q + 1] << 8 | A[q + 2] << 16 | A[q + 3] << 24) >>> 0
    }

    function UL4(A, q) {
        return (A[q] << 24 | A[q + 1] << 16 | A[q + 2] << 8 | A[q + 3]) >>> 0
    }
})