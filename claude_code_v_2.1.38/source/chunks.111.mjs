
// @from(Ln 275520, Col 4)
BGA = R((VX4) => {
    Object.defineProperty(VX4, "__esModule", {
        value: !0
    });
    VX4.MetricStorage = void 0;
    var u8Y = Wm1();
    class fX4 {
        _instrumentDescriptor;
        constructor(A) {
            this._instrumentDescriptor = A
        }
        getInstrumentDescriptor() {
            return this._instrumentDescriptor
        }
        updateDescription(A) {
            this._instrumentDescriptor = (0, u8Y.createInstrumentDescriptor)(this._instrumentDescriptor.name, this._instrumentDescriptor.type, {
                description: A,
                valueType: this._instrumentDescriptor.valueType,
                unit: this._instrumentDescriptor.unit,
                advice: this._instrumentDescriptor.advice
            })
        }
    }
    VX4.MetricStorage = fX4
})
// @from(Ln 275545, Col 4)
Gm1 = R((vX4) => {
    Object.defineProperty(vX4, "__esModule", {
        value: !0
    });
    vX4.AttributeHashMap = vX4.HashMap = void 0;
    var B8Y = Uh();
    class mGA {
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
    vX4.HashMap = mGA;
    class TX4 extends mGA {
        constructor() {
            super(B8Y.hashAttributes)
        }
    }
    vX4.AttributeHashMap = TX4
})
// @from(Ln 275595, Col 4)
QGA = R((LX4) => {
    Object.defineProperty(LX4, "__esModule", {
        value: !0
    });
    LX4.DeltaMetricProcessor = void 0;
    var F8Y = Uh(),
        FGA = Gm1();
    class kX4 {
        _aggregator;
        _activeCollectionStorage = new FGA.AttributeHashMap;
        _cumulativeMemoStorage = new FGA.AttributeHashMap;
        _cardinalityLimit;
        _overflowAttributes = {
            "otel.metric.overflow": !0
        };
        _overflowHashCode;
        constructor(A, q) {
            this._aggregator = A, this._cardinalityLimit = (q ?? 2000) - 1, this._overflowHashCode = (0, F8Y.hashAttributes)(this._overflowAttributes)
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
                let w = this._aggregator.createAccumulation(q);
                w?.record(Y);
                let H = w;
                if (this._cumulativeMemoStorage.has(K, z)) {
                    let $ = this._cumulativeMemoStorage.get(K, z);
                    H = this._aggregator.diff($, w)
                } else if (this._cumulativeMemoStorage.size >= this._cardinalityLimit) {
                    if (K = this._overflowAttributes, z = this._overflowHashCode, this._cumulativeMemoStorage.has(K, z)) {
                        let $ = this._cumulativeMemoStorage.get(K, z);
                        H = this._aggregator.diff($, w)
                    }
                }
                if (this._activeCollectionStorage.has(K, z)) {
                    let $ = this._activeCollectionStorage.get(K, z);
                    H = this._aggregator.merge($, H)
                }
                this._cumulativeMemoStorage.set(K, w, z), this._activeCollectionStorage.set(K, H, z)
            })
        }
        collect() {
            let A = this._activeCollectionStorage;
            return this._activeCollectionStorage = new FGA.AttributeHashMap, A
        }
    }
    LX4.DeltaMetricProcessor = kX4
})
// @from(Ln 275653, Col 4)
gGA = R((yX4) => {
    Object.defineProperty(yX4, "__esModule", {
        value: !0
    });
    yX4.TemporalMetricProcessor = void 0;
    var Q8Y = oX6(),
        g8Y = Gm1();
    class Zm1 {
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
                w = z,
                H;
            if (this._reportHistory.has(A)) {
                let O = this._reportHistory.get(A),
                    _ = O.collectionTime;
                if (H = O.aggregationTemporality, H === Q8Y.AggregationTemporality.CUMULATIVE) w = Zm1.merge(O.accumulations, z, this._aggregator);
                else w = Zm1.calibrateStartTime(O.accumulations, z, _)
            } else H = A.selectAggregationTemporality(q.type);
            this._reportHistory.set(A, {
                accumulations: w,
                collectionTime: Y,
                aggregationTemporality: H
            });
            let $ = U8Y(w);
            if ($.length === 0) return;
            return this._aggregator.toMetricData(q, H, $, Y)
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
            let q = new g8Y.AttributeHashMap,
                K = this._unreportedAccumulations.get(A);
            if (this._unreportedAccumulations.set(A, []), K === void 0) return q;
            for (let Y of K) q = Zm1.merge(q, Y, this._aggregator);
            return q
        }
        static merge(A, q, K) {
            let Y = A,
                z = q.entries(),
                w = z.next();
            while (w.done !== !0) {
                let [H, $, O] = w.value;
                if (A.has(H, O)) {
                    let _ = A.get(H, O),
                        J = K.merge(_, $);
                    Y.set(H, J, O)
                } else Y.set(H, $, O);
                w = z.next()
            }
            return Y
        }
        static calibrateStartTime(A, q, K) {
            for (let [Y, z] of A.keys()) q.get(Y, z)?.setStartTime(K);
            return q
        }
    }
    yX4.TemporalMetricProcessor = Zm1;

    function U8Y(A) {
        return Array.from(A.entries())
    }
})
// @from(Ln 275730, Col 4)
xX4 = R((hX4) => {
    Object.defineProperty(hX4, "__esModule", {
        value: !0
    });
    hX4.AsyncMetricStorage = void 0;
    var p8Y = BGA(),
        d8Y = QGA(),
        c8Y = gGA(),
        l8Y = Gm1();
    class SX4 extends p8Y.MetricStorage {
        _attributesProcessor;
        _aggregationCardinalityLimit;
        _deltaMetricStorage;
        _temporalMetricStorage;
        constructor(A, q, K, Y, z) {
            super(A);
            this._attributesProcessor = K, this._aggregationCardinalityLimit = z, this._deltaMetricStorage = new d8Y.DeltaMetricProcessor(q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new c8Y.TemporalMetricProcessor(q, Y)
        }
        record(A, q) {
            let K = new l8Y.AttributeHashMap;
            Array.from(A.entries()).forEach(([Y, z]) => {
                K.set(this._attributesProcessor.process(Y), z)
            }), this._deltaMetricStorage.batchCumulate(K, q)
        }
        collect(A, q) {
            let K = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, K, q)
        }
    }
    hX4.AsyncMetricStorage = SX4
})
// @from(Ln 275761, Col 4)
gX4 = R((FX4) => {
    Object.defineProperty(FX4, "__esModule", {
        value: !0
    });
    FX4.getConflictResolutionRecipe = FX4.getDescriptionResolutionRecipe = FX4.getTypeConflictResolutionRecipe = FX4.getUnitConflictResolutionRecipe = FX4.getValueTypeConflictResolutionRecipe = FX4.getIncompatibilityDetails = void 0;

    function i8Y(A, q) {
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
    FX4.getIncompatibilityDetails = i8Y;

    function bX4(A, q) {
        return `	- use valueType '${A.valueType}' on instrument creation or use an instrument name other than '${q.name}'`
    }
    FX4.getValueTypeConflictResolutionRecipe = bX4;

    function uX4(A, q) {
        return `	- use unit '${A.unit}' on instrument creation or use an instrument name other than '${q.name}'`
    }
    FX4.getUnitConflictResolutionRecipe = uX4;

    function BX4(A, q) {
        let K = {
                name: q.name,
                type: q.type,
                unit: q.unit
            },
            Y = JSON.stringify(K);
        return `	- create a new view with a name other than '${A.name}' and InstrumentSelector '${Y}'`
    }
    FX4.getTypeConflictResolutionRecipe = BX4;

    function mX4(A, q) {
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
    FX4.getDescriptionResolutionRecipe = mX4;

    function n8Y(A, q) {
        if (A.valueType !== q.valueType) return bX4(A, q);
        if (A.unit !== q.unit) return uX4(A, q);
        if (A.type !== q.type) return BX4(A, q);
        if (A.description !== q.description) return mX4(A, q);
        return ""
    }
    FX4.getConflictResolutionRecipe = n8Y
})
// @from(Ln 275824, Col 4)
cX4 = R((pX4) => {
    Object.defineProperty(pX4, "__esModule", {
        value: !0
    });
    pX4.MetricStorageRegistry = void 0;
    var e8Y = Wm1(),
        UX4 = Fq(),
        HD6 = gX4();
    class UGA {
        _sharedRegistry = new Map;
        _perCollectorRegistry = new Map;
        static create() {
            return new UGA
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
                if ((0, e8Y.isDescriptorCompatibleWith)(z, A)) {
                    if (z.description !== A.description) {
                        if (A.description.length > z.description.length) Y.updateDescription(A.description);
                        UX4.diag.warn("A view or instrument with the name ", A.name, ` has already been registered, but has a different description and is incompatible with another registered view.
`, `Details:
`, (0, HD6.getIncompatibilityDetails)(z, A), `The longer description will be used.
To resolve the conflict:`, (0, HD6.getConflictResolutionRecipe)(z, A))
                    }
                    K = Y
                } else UX4.diag.warn("A view or instrument with the name ", A.name, ` has already been registered and is incompatible with another registered view.
`, `Details:
`, (0, HD6.getIncompatibilityDetails)(z, A), `To resolve the conflict:
`, (0, HD6.getConflictResolutionRecipe)(z, A))
            }
            return K
        }
    }
    pX4.MetricStorageRegistry = UGA
})
// @from(Ln 275898, Col 4)
rX4 = R((iX4) => {
    Object.defineProperty(iX4, "__esModule", {
        value: !0
    });
    iX4.MultiMetricStorage = void 0;
    class lX4 {
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
    iX4.MultiMetricStorage = lX4
})
// @from(Ln 275916, Col 4)
AD4 = R((tX4) => {
    Object.defineProperty(tX4, "__esModule", {
        value: !0
    });
    tX4.BatchObservableResultImpl = tX4.ObservableResultImpl = void 0;
    var IM1 = Fq(),
        oX4 = Gm1(),
        A7Y = wD6();
    class aX4 {
        _instrumentName;
        _valueType;
        _buffer = new oX4.AttributeHashMap;
        constructor(A, q) {
            this._instrumentName = A, this._valueType = q
        }
        observe(A, q = {}) {
            if (typeof A !== "number") {
                IM1.diag.warn(`non-number value provided to metric ${this._instrumentName}: ${A}`);
                return
            }
            if (this._valueType === IM1.ValueType.INT && !Number.isInteger(A)) {
                if (IM1.diag.warn(`INT value type cannot accept a floating-point value for ${this._instrumentName}, ignoring the fractional digits.`), A = Math.trunc(A), !Number.isInteger(A)) return
            }
            this._buffer.set(q, A)
        }
    }
    tX4.ObservableResultImpl = aX4;
    class sX4 {
        _buffer = new Map;
        observe(A, q, K = {}) {
            if (!(0, A7Y.isObservableInstrument)(A)) return;
            let Y = this._buffer.get(A);
            if (Y == null) Y = new oX4.AttributeHashMap, this._buffer.set(A, Y);
            if (typeof q !== "number") {
                IM1.diag.warn(`non-number value provided to metric ${A._descriptor.name}: ${q}`);
                return
            }
            if (A._descriptor.valueType === IM1.ValueType.INT && !Number.isInteger(q)) {
                if (IM1.diag.warn(`INT value type cannot accept a floating-point value for ${A._descriptor.name}, ignoring the fractional digits.`), q = Math.trunc(q), !Number.isInteger(q)) return
            }
            Y.set(K, q)
        }
    }
    tX4.BatchObservableResultImpl = sX4
})
// @from(Ln 275961, Col 4)
HD4 = R((zD4) => {
    Object.defineProperty(zD4, "__esModule", {
        value: !0
    });
    zD4.ObservableRegistry = void 0;
    var K7Y = Fq(),
        qD4 = wD6(),
        KD4 = AD4(),
        fm1 = Uh();
    class YD4 {
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
            let K = new Set(q.filter(qD4.isObservableInstrument));
            if (K.size === 0) {
                K7Y.diag.error("BatchObservableCallback is not associated with valid instruments", q);
                return
            }
            if (this._findBatchCallback(A, K) >= 0) return;
            this._batchCallbacks.push({
                callback: A,
                instruments: K
            })
        }
        removeBatchCallback(A, q) {
            let K = new Set(q.filter(qD4.isObservableInstrument)),
                Y = this._findBatchCallback(A, K);
            if (Y < 0) return;
            this._batchCallbacks.splice(Y, 1)
        }
        async observe(A, q) {
            let K = this._observeCallbacks(A, q),
                Y = this._observeBatchCallbacks(A, q);
            return (await (0, fm1.PromiseAllSettled)([...K, ...Y])).filter(fm1.isPromiseAllSettledRejectionResult).map((H) => H.reason)
        }
        _observeCallbacks(A, q) {
            return this._callbacks.map(async ({
                callback: K,
                instrument: Y
            }) => {
                let z = new KD4.ObservableResultImpl(Y._descriptor.name, Y._descriptor.valueType),
                    w = Promise.resolve(K(z));
                if (q != null) w = (0, fm1.callWithTimeout)(w, q);
                await w, Y._metricStorages.forEach((H) => {
                    H.record(z._buffer, A)
                })
            })
        }
        _observeBatchCallbacks(A, q) {
            return this._batchCallbacks.map(async ({
                callback: K,
                instruments: Y
            }) => {
                let z = new KD4.BatchObservableResultImpl,
                    w = Promise.resolve(K(z));
                if (q != null) w = (0, fm1.callWithTimeout)(w, q);
                await w, Y.forEach((H) => {
                    let $ = z._buffer.get(H);
                    if ($ == null) return;
                    H._metricStorages.forEach((O) => {
                        O.record($, A)
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
                return K.callback === A && (0, fm1.setEquals)(K.instruments, q)
            })
        }
    }
    zD4.ObservableRegistry = YD4
})
// @from(Ln 276051, Col 4)
JD4 = R((OD4) => {
    Object.defineProperty(OD4, "__esModule", {
        value: !0
    });
    OD4.SyncMetricStorage = void 0;
    var Y7Y = BGA(),
        z7Y = QGA(),
        w7Y = gGA();
    class $D4 extends Y7Y.MetricStorage {
        _attributesProcessor;
        _aggregationCardinalityLimit;
        _deltaMetricStorage;
        _temporalMetricStorage;
        constructor(A, q, K, Y, z) {
            super(A);
            this._attributesProcessor = K, this._aggregationCardinalityLimit = z, this._deltaMetricStorage = new z7Y.DeltaMetricProcessor(q, this._aggregationCardinalityLimit), this._temporalMetricStorage = new w7Y.TemporalMetricProcessor(q, Y)
        }
        record(A, q, K, Y) {
            q = this._attributesProcessor.process(q, K), this._deltaMetricStorage.record(A, q, K, Y)
        }
        collect(A, q) {
            let K = this._deltaMetricStorage.collect();
            return this._temporalMetricStorage.buildMetrics(A, this._instrumentDescriptor, K, q)
        }
    }
    OD4.SyncMetricStorage = $D4
})
// @from(Ln 276078, Col 4)
$D6 = R((PD4) => {
    Object.defineProperty(PD4, "__esModule", {
        value: !0
    });
    PD4.createDenyListAttributesProcessor = PD4.createAllowListAttributesProcessor = PD4.createMultiAttributesProcessor = PD4.createNoopAttributesProcessor = void 0;
    class XD4 {
        process(A, q) {
            return A
        }
    }
    class DD4 {
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
    class jD4 {
        _allowedAttributeNames;
        constructor(A) {
            this._allowedAttributeNames = A
        }
        process(A, q) {
            let K = {};
            return Object.keys(A).filter((Y) => this._allowedAttributeNames.includes(Y)).forEach((Y) => K[Y] = A[Y]), K
        }
    }
    class MD4 {
        _deniedAttributeNames;
        constructor(A) {
            this._deniedAttributeNames = A
        }
        process(A, q) {
            let K = {};
            return Object.keys(A).filter((Y) => !this._deniedAttributeNames.includes(Y)).forEach((Y) => K[Y] = A[Y]), K
        }
    }

    function H7Y() {
        return J7Y
    }
    PD4.createNoopAttributesProcessor = H7Y;

    function $7Y(A) {
        return new DD4(A)
    }
    PD4.createMultiAttributesProcessor = $7Y;

    function O7Y(A) {
        return new jD4(A)
    }
    PD4.createAllowListAttributesProcessor = O7Y;

    function _7Y(A) {
        return new MD4(A)
    }
    PD4.createDenyListAttributesProcessor = _7Y;
    var J7Y = new XD4
})
// @from(Ln 276141, Col 4)
VD4 = R((ZD4) => {
    Object.defineProperty(ZD4, "__esModule", {
        value: !0
    });
    ZD4.MeterSharedState = void 0;
    var M7Y = Wm1(),
        P7Y = ZX4(),
        W7Y = Uh(),
        G7Y = xX4(),
        Z7Y = cX4(),
        f7Y = rX4(),
        V7Y = HD4(),
        N7Y = JD4(),
        T7Y = $D6();
    class GD4 {
        _meterProviderSharedState;
        _instrumentationScope;
        metricStorageRegistry = new Z7Y.MetricStorageRegistry;
        observableRegistry = new V7Y.ObservableRegistry;
        meter;
        constructor(A, q) {
            this._meterProviderSharedState = A, this._instrumentationScope = q, this.meter = new P7Y.Meter(this)
        }
        registerMetricStorage(A) {
            let q = this._registerMetricStorage(A, N7Y.SyncMetricStorage);
            if (q.length === 1) return q[0];
            return new f7Y.MultiMetricStorage(q)
        }
        registerAsyncMetricStorage(A) {
            return this._registerMetricStorage(A, G7Y.AsyncMetricStorage)
        }
        async collect(A, q, K) {
            let Y = await this.observableRegistry.observe(q, K?.timeoutMillis),
                z = this.metricStorageRegistry.getStorages(A);
            if (z.length === 0) return null;
            let w = z.map((H) => {
                return H.collect(A, q)
            }).filter(W7Y.isNotNullish);
            if (w.length === 0) return {
                errors: Y
            };
            return {
                scopeMetrics: {
                    scope: this._instrumentationScope,
                    metrics: w
                },
                errors: Y
            }
        }
        _registerMetricStorage(A, q) {
            let Y = this._meterProviderSharedState.viewRegistry.findViews(A, this._instrumentationScope).map((z) => {
                let w = (0, M7Y.createInstrumentDescriptorWithView)(z, A),
                    H = this.metricStorageRegistry.findOrUpdateCompatibleStorage(w);
                if (H != null) return H;
                let $ = z.aggregation.createAggregator(w),
                    O = new q(w, $, z.attributesProcessor, this._meterProviderSharedState.metricCollectors, z.aggregationCardinalityLimit);
                return this.metricStorageRegistry.register(O), O
            });
            if (Y.length === 0) {
                let w = this._meterProviderSharedState.selectAggregations(A.type).map(([H, $]) => {
                    let O = this.metricStorageRegistry.findOrUpdateCompatibleCollectorStorage(H, A);
                    if (O != null) return O;
                    let _ = $.createAggregator(A),
                        J = H.selectCardinalityLimit(A.type),
                        X = new q(A, _, (0, T7Y.createNoopAttributesProcessor)(), [H], J);
                    return this.metricStorageRegistry.registerForCollector(H, X), X
                });
                Y = Y.concat(w)
            }
            return Y
        }
    }
    ZD4.MeterSharedState = GD4
})
// @from(Ln 276215, Col 4)
ED4 = R((TD4) => {
    Object.defineProperty(TD4, "__esModule", {
        value: !0
    });
    TD4.MeterProviderSharedState = void 0;
    var v7Y = Uh(),
        E7Y = qX4(),
        k7Y = VD4(),
        L7Y = Pm1();
    class ND4 {
        resource;
        viewRegistry = new E7Y.ViewRegistry;
        metricCollectors = [];
        meterSharedStates = new Map;
        constructor(A) {
            this.resource = A
        }
        getMeterSharedState(A) {
            let q = (0, v7Y.instrumentationScopeId)(A),
                K = this.meterSharedStates.get(q);
            if (K == null) K = new k7Y.MeterSharedState(this, A), this.meterSharedStates.set(q, K);
            return K
        }
        selectAggregations(A) {
            let q = [];
            for (let K of this.metricCollectors) q.push([K, (0, L7Y.toAggregation)(K.selectAggregation(A))]);
            return q
        }
    }
    TD4.MeterProviderSharedState = ND4
})
// @from(Ln 276246, Col 4)
yD4 = R((LD4) => {
    Object.defineProperty(LD4, "__esModule", {
        value: !0
    });
    LD4.MetricCollector = void 0;
    var R7Y = G9();
    class kD4 {
        _sharedState;
        _metricReader;
        constructor(A, q) {
            this._sharedState = A, this._metricReader = q
        }
        async collect(A) {
            let q = (0, R7Y.millisToHrTime)(Date.now()),
                K = [],
                Y = [],
                z = Array.from(this._sharedState.meterSharedStates.values()).map(async (w) => {
                    let H = await w.collect(this, q, A);
                    if (H?.scopeMetrics != null) K.push(H.scopeMetrics);
                    if (H?.errors != null) Y.push(...H.errors)
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
    LD4.MetricCollector = kD4
})
// @from(Ln 276293, Col 4)
OD6 = R((SD4) => {
    Object.defineProperty(SD4, "__esModule", {
        value: !0
    });
    SD4.ExactPredicate = SD4.PatternPredicate = void 0;
    var y7Y = /[\^$\\.+?()[\]{}|]/g;
    class pGA {
        _matchAll;
        _regexp;
        constructor(A) {
            if (A === "*") this._matchAll = !0, this._regexp = /.*/;
            else this._matchAll = !1, this._regexp = new RegExp(pGA.escapePattern(A))
        }
        match(A) {
            if (this._matchAll) return !0;
            return this._regexp.test(A)
        }
        static escapePattern(A) {
            return `^${A.replace(y7Y,"\\$&").replace("*",".*")}$`
        }
        static hasWildcard(A) {
            return A.includes("*")
        }
    }
    SD4.PatternPredicate = pGA;
    class CD4 {
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
    SD4.ExactPredicate = CD4
})
// @from(Ln 276332, Col 4)
BD4 = R((bD4) => {
    Object.defineProperty(bD4, "__esModule", {
        value: !0
    });
    bD4.InstrumentSelector = void 0;
    var ID4 = OD6();
    class xD4 {
        _nameFilter;
        _type;
        _unitFilter;
        constructor(A) {
            this._nameFilter = new ID4.PatternPredicate(A?.name ?? "*"), this._type = A?.type, this._unitFilter = new ID4.ExactPredicate(A?.unit)
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
    bD4.InstrumentSelector = xD4
})
// @from(Ln 276357, Col 4)
gD4 = R((FD4) => {
    Object.defineProperty(FD4, "__esModule", {
        value: !0
    });
    FD4.MeterSelector = void 0;
    var dGA = OD6();
    class mD4 {
        _nameFilter;
        _versionFilter;
        _schemaUrlFilter;
        constructor(A) {
            this._nameFilter = new dGA.ExactPredicate(A?.name), this._versionFilter = new dGA.ExactPredicate(A?.version), this._schemaUrlFilter = new dGA.ExactPredicate(A?.schemaUrl)
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
    FD4.MeterSelector = mD4
})
// @from(Ln 276382, Col 4)
iD4 = R((cD4) => {
    Object.defineProperty(cD4, "__esModule", {
        value: !0
    });
    cD4.View = void 0;
    var S7Y = OD6(),
        UD4 = $D6(),
        h7Y = BD4(),
        I7Y = gD4(),
        pD4 = Pm1();

    function x7Y(A) {
        return A.instrumentName == null && A.instrumentType == null && A.instrumentUnit == null && A.meterName == null && A.meterVersion == null && A.meterSchemaUrl == null
    }

    function b7Y(A) {
        if (x7Y(A)) throw Error("Cannot create view with no selector arguments supplied");
        if (A.name != null && (A?.instrumentName == null || S7Y.PatternPredicate.hasWildcard(A.instrumentName))) throw Error("Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.")
    }
    class dD4 {
        name;
        description;
        aggregation;
        attributesProcessor;
        instrumentSelector;
        meterSelector;
        aggregationCardinalityLimit;
        constructor(A) {
            if (b7Y(A), A.attributesProcessors != null) this.attributesProcessor = (0, UD4.createMultiAttributesProcessor)(A.attributesProcessors);
            else this.attributesProcessor = (0, UD4.createNoopAttributesProcessor)();
            this.name = A.name, this.description = A.description, this.aggregation = (0, pD4.toAggregation)(A.aggregation ?? {
                type: pD4.AggregationType.DEFAULT
            }), this.instrumentSelector = new h7Y.InstrumentSelector({
                name: A.instrumentName,
                type: A.instrumentType,
                unit: A.instrumentUnit
            }), this.meterSelector = new I7Y.MeterSelector({
                name: A.meterName,
                version: A.meterVersion,
                schemaUrl: A.meterSchemaUrl
            }), this.aggregationCardinalityLimit = A.aggregationCardinalityLimit
        }
    }
    cD4.View = dD4
})
// @from(Ln 276427, Col 4)
aD4 = R((rD4) => {
    Object.defineProperty(rD4, "__esModule", {
        value: !0
    });
    rD4.MeterProvider = void 0;
    var _D6 = Fq(),
        u7Y = jM1(),
        B7Y = ED4(),
        m7Y = yD4(),
        F7Y = iD4();
    class nD4 {
        _sharedState;
        _shutdown = !1;
        constructor(A) {
            if (this._sharedState = new B7Y.MeterProviderSharedState(A?.resource ?? (0, u7Y.defaultResource)()), A?.views != null && A.views.length > 0)
                for (let q of A.views) this._sharedState.viewRegistry.addView(new F7Y.View(q));
            if (A?.readers != null && A.readers.length > 0)
                for (let q of A.readers) {
                    let K = new m7Y.MetricCollector(this._sharedState, q);
                    q.setMetricProducer(K), this._sharedState.metricCollectors.push(K)
                }
        }
        getMeter(A, q = "", K = {}) {
            if (this._shutdown) return _D6.diag.warn("A shutdown MeterProvider cannot provide a Meter"), (0, _D6.createNoopMeter)();
            return this._sharedState.getMeterSharedState({
                name: A,
                version: q,
                schemaUrl: K.schemaUrl
            }).meter
        }
        async shutdown(A) {
            if (this._shutdown) {
                _D6.diag.warn("shutdown may only be called once per MeterProvider");
                return
            }
            this._shutdown = !0, await Promise.all(this._sharedState.metricCollectors.map((q) => {
                return q.shutdown(A)
            }))
        }
        async forceFlush(A) {
            if (this._shutdown) {
                _D6.diag.warn("invalid attempt to force flush after MeterProvider shutdown");
                return
            }
            await Promise.all(this._sharedState.metricCollectors.map((q) => {
                return q.forceFlush(A)
            }))
        }
    }
    rD4.MeterProvider = nD4
})
// @from(Ln 276478, Col 4)
Ps = R((zN) => {
    Object.defineProperty(zN, "__esModule", {
        value: !0
    });
    zN.TimeoutError = zN.createDenyListAttributesProcessor = zN.createAllowListAttributesProcessor = zN.AggregationType = zN.MeterProvider = zN.ConsoleMetricExporter = zN.InMemoryMetricExporter = zN.PeriodicExportingMetricReader = zN.MetricReader = zN.InstrumentType = zN.DataPointType = zN.AggregationTemporality = void 0;
    var Q7Y = oX6();
    Object.defineProperty(zN, "AggregationTemporality", {
        enumerable: !0,
        get: function() {
            return Q7Y.AggregationTemporality
        }
    });
    var sD4 = Ms();
    Object.defineProperty(zN, "DataPointType", {
        enumerable: !0,
        get: function() {
            return sD4.DataPointType
        }
    });
    Object.defineProperty(zN, "InstrumentType", {
        enumerable: !0,
        get: function() {
            return sD4.InstrumentType
        }
    });
    var g7Y = xGA();
    Object.defineProperty(zN, "MetricReader", {
        enumerable: !0,
        get: function() {
            return g7Y.MetricReader
        }
    });
    var U7Y = pJ4();
    Object.defineProperty(zN, "PeriodicExportingMetricReader", {
        enumerable: !0,
        get: function() {
            return U7Y.PeriodicExportingMetricReader
        }
    });
    var p7Y = nJ4();
    Object.defineProperty(zN, "InMemoryMetricExporter", {
        enumerable: !0,
        get: function() {
            return p7Y.InMemoryMetricExporter
        }
    });
    var d7Y = sJ4();
    Object.defineProperty(zN, "ConsoleMetricExporter", {
        enumerable: !0,
        get: function() {
            return d7Y.ConsoleMetricExporter
        }
    });
    var c7Y = aD4();
    Object.defineProperty(zN, "MeterProvider", {
        enumerable: !0,
        get: function() {
            return c7Y.MeterProvider
        }
    });
    var l7Y = Pm1();
    Object.defineProperty(zN, "AggregationType", {
        enumerable: !0,
        get: function() {
            return l7Y.AggregationType
        }
    });
    var tD4 = $D6();
    Object.defineProperty(zN, "createAllowListAttributesProcessor", {
        enumerable: !0,
        get: function() {
            return tD4.createAllowListAttributesProcessor
        }
    });
    Object.defineProperty(zN, "createDenyListAttributesProcessor", {
        enumerable: !0,
        get: function() {
            return tD4.createDenyListAttributesProcessor
        }
    });
    var i7Y = Uh();
    Object.defineProperty(zN, "TimeoutError", {
        enumerable: !0,
        get: function() {
            return i7Y.TimeoutError
        }
    })
})
// @from(Ln 276566, Col 4)
lGA = R((eD4) => {
    Object.defineProperty(eD4, "__esModule", {
        value: !0
    });
    eD4.AggregationTemporalityPreference = void 0;
    var r7Y;
    (function(A) {
        A[A.DELTA = 0] = "DELTA", A[A.CUMULATIVE = 1] = "CUMULATIVE", A[A.LOWMEMORY = 2] = "LOWMEMORY"
    })(r7Y = eD4.AggregationTemporalityPreference || (eD4.AggregationTemporalityPreference = {}))
})
// @from(Ln 276576, Col 4)
Y04 = R((q04) => {
    Object.defineProperty(q04, "__esModule", {
        value: !0
    });
    q04.OTLPExporterBase = void 0;
    class A04 {
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
    q04.OTLPExporterBase = A04
})
// @from(Ln 276598, Col 4)
JD6 = R((w04) => {
    Object.defineProperty(w04, "__esModule", {
        value: !0
    });
    w04.OTLPExporterError = void 0;
    class z04 extends Error {
        code;
        name = "OTLPExporterError";
        data;
        constructor(A, q, K) {
            super(A);
            this.data = K, this.code = q
        }
    }
    w04.OTLPExporterError = z04
})
// @from(Ln 276614, Col 4)
Vm1 = R((O04) => {
    Object.defineProperty(O04, "__esModule", {
        value: !0
    });
    O04.getSharedConfigurationDefaults = O04.mergeOtlpSharedConfigurationWithDefaults = O04.wrapStaticHeadersInFunction = O04.validateTimeoutMillis = void 0;

    function $04(A) {
        if (Number.isFinite(A) && A > 0) return A;
        throw Error(`Configuration: timeoutMillis is invalid, expected number greater than 0 (actual: '${A}')`)
    }
    O04.validateTimeoutMillis = $04;

    function o7Y(A) {
        if (A == null) return;
        return async () => A
    }
    O04.wrapStaticHeadersInFunction = o7Y;

    function a7Y(A, q, K) {
        return {
            timeoutMillis: $04(A.timeoutMillis ?? q.timeoutMillis ?? K.timeoutMillis),
            concurrencyLimit: A.concurrencyLimit ?? q.concurrencyLimit ?? K.concurrencyLimit,
            compression: A.compression ?? q.compression ?? K.compression
        }
    }
    O04.mergeOtlpSharedConfigurationWithDefaults = a7Y;

    function s7Y() {
        return {
            timeoutMillis: 1e4,
            concurrencyLimit: 30,
            compression: "none"
        }
    }
    O04.getSharedConfigurationDefaults = s7Y
})
// @from(Ln 276650, Col 4)
X04 = R((J04) => {
    Object.defineProperty(J04, "__esModule", {
        value: !0
    });
    J04.CompressionAlgorithm = void 0;
    var q4Y;
    (function(A) {
        A.NONE = "none", A.GZIP = "gzip"
    })(q4Y = J04.CompressionAlgorithm || (J04.CompressionAlgorithm = {}))
})
// @from(Ln 276660, Col 4)
nGA = R((j04) => {
    Object.defineProperty(j04, "__esModule", {
        value: !0
    });
    j04.createBoundedQueueExportPromiseHandler = void 0;
    class D04 {
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

    function K4Y(A) {
        return new D04(A.concurrencyLimit)
    }
    j04.createBoundedQueueExportPromiseHandler = K4Y
})
// @from(Ln 276693, Col 4)
G04 = R((P04) => {
    Object.defineProperty(P04, "__esModule", {
        value: !0
    });
    P04.createLoggingPartialSuccessResponseHandler = void 0;
    var Y4Y = Fq();

    function z4Y(A) {
        return Object.prototype.hasOwnProperty.call(A, "partialSuccess")
    }

    function w4Y() {
        return {
            handleResponse(A) {
                if (A == null || !z4Y(A) || A.partialSuccess == null || Object.keys(A.partialSuccess).length === 0) return;
                Y4Y.diag.warn("Received Partial Success response:", JSON.stringify(A.partialSuccess))
            }
        }
    }
    P04.createLoggingPartialSuccessResponseHandler = w4Y
})
// @from(Ln 276714, Col 4)
rGA = R((V04) => {
    Object.defineProperty(V04, "__esModule", {
        value: !0
    });
    V04.createOtlpExportDelegate = void 0;
    var V31 = G9(),
        Z04 = JD6(),
        H4Y = G04(),
        $4Y = Fq();
    class f04 {
        _transport;
        _serializer;
        _responseHandler;
        _promiseQueue;
        _timeout;
        _diagLogger;
        constructor(A, q, K, Y, z) {
            this._transport = A, this._serializer = q, this._responseHandler = K, this._promiseQueue = Y, this._timeout = z, this._diagLogger = $4Y.diag.createComponentLogger({
                namespace: "OTLPExportDelegate"
            })
        }
        export (A, q) {
            if (this._diagLogger.debug("items to be sent", A), this._promiseQueue.hasReachedLimit()) {
                q({
                    code: V31.ExportResultCode.FAILED,
                    error: Error("Concurrent export limit reached")
                });
                return
            }
            let K = this._serializer.serializeRequest(A);
            if (K == null) {
                q({
                    code: V31.ExportResultCode.FAILED,
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
                        code: V31.ExportResultCode.SUCCESS
                    });
                    return
                } else if (Y.status === "failure" && Y.error) {
                    q({
                        code: V31.ExportResultCode.FAILED,
                        error: Y.error
                    });
                    return
                } else if (Y.status === "retryable") q({
                    code: V31.ExportResultCode.FAILED,
                    error: new Z04.OTLPExporterError("Export failed with retryable status")
                });
                else q({
                    code: V31.ExportResultCode.FAILED,
                    error: new Z04.OTLPExporterError("Export failed with unknown error")
                })
            }, (Y) => q({
                code: V31.ExportResultCode.FAILED,
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

    function O4Y(A, q) {
        return new f04(A.transport, A.serializer, (0, H4Y.createLoggingPartialSuccessResponseHandler)(), A.promiseHandler, q.timeout)
    }
    V04.createOtlpExportDelegate = O4Y
})
// @from(Ln 276794, Col 4)
E04 = R((T04) => {
    Object.defineProperty(T04, "__esModule", {
        value: !0
    });
    T04.createOtlpNetworkExportDelegate = void 0;
    var _4Y = nGA(),
        J4Y = rGA();

    function X4Y(A, q, K) {
        return (0, J4Y.createOtlpExportDelegate)({
            transport: K,
            serializer: q,
            promiseHandler: (0, _4Y.createBoundedQueueExportPromiseHandler)(A)
        }, {
            timeout: A.timeoutMillis
        })
    }
    T04.createOtlpNetworkExportDelegate = X4Y
})
// @from(Ln 276813, Col 4)
eB = R((Ws) => {
    Object.defineProperty(Ws, "__esModule", {
        value: !0
    });
    Ws.createOtlpNetworkExportDelegate = Ws.CompressionAlgorithm = Ws.getSharedConfigurationDefaults = Ws.mergeOtlpSharedConfigurationWithDefaults = Ws.OTLPExporterError = Ws.OTLPExporterBase = void 0;
    var D4Y = Y04();
    Object.defineProperty(Ws, "OTLPExporterBase", {
        enumerable: !0,
        get: function() {
            return D4Y.OTLPExporterBase
        }
    });
    var j4Y = JD6();
    Object.defineProperty(Ws, "OTLPExporterError", {
        enumerable: !0,
        get: function() {
            return j4Y.OTLPExporterError
        }
    });
    var k04 = Vm1();
    Object.defineProperty(Ws, "mergeOtlpSharedConfigurationWithDefaults", {
        enumerable: !0,
        get: function() {
            return k04.mergeOtlpSharedConfigurationWithDefaults
        }
    });
    Object.defineProperty(Ws, "getSharedConfigurationDefaults", {
        enumerable: !0,
        get: function() {
            return k04.getSharedConfigurationDefaults
        }
    });
    var M4Y = X04();
    Object.defineProperty(Ws, "CompressionAlgorithm", {
        enumerable: !0,
        get: function() {
            return M4Y.CompressionAlgorithm
        }
    });
    var P4Y = E04();
    Object.defineProperty(Ws, "createOtlpNetworkExportDelegate", {
        enumerable: !0,
        get: function() {
            return P4Y.createOtlpNetworkExportDelegate
        }
    })
})
// @from(Ln 276860, Col 4)
sGA = R((y04) => {
    Object.defineProperty(y04, "__esModule", {
        value: !0
    });
    y04.OTLPMetricExporterBase = y04.LowMemoryTemporalitySelector = y04.DeltaTemporalitySelector = y04.CumulativeTemporalitySelector = void 0;
    var G4Y = G9(),
        cX = Ps(),
        L04 = lGA(),
        Z4Y = eB(),
        f4Y = Fq(),
        V4Y = () => cX.AggregationTemporality.CUMULATIVE;
    y04.CumulativeTemporalitySelector = V4Y;
    var N4Y = (A) => {
        switch (A) {
            case cX.InstrumentType.COUNTER:
            case cX.InstrumentType.OBSERVABLE_COUNTER:
            case cX.InstrumentType.GAUGE:
            case cX.InstrumentType.HISTOGRAM:
            case cX.InstrumentType.OBSERVABLE_GAUGE:
                return cX.AggregationTemporality.DELTA;
            case cX.InstrumentType.UP_DOWN_COUNTER:
            case cX.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
                return cX.AggregationTemporality.CUMULATIVE
        }
    };
    y04.DeltaTemporalitySelector = N4Y;
    var T4Y = (A) => {
        switch (A) {
            case cX.InstrumentType.COUNTER:
            case cX.InstrumentType.HISTOGRAM:
                return cX.AggregationTemporality.DELTA;
            case cX.InstrumentType.GAUGE:
            case cX.InstrumentType.UP_DOWN_COUNTER:
            case cX.InstrumentType.OBSERVABLE_UP_DOWN_COUNTER:
            case cX.InstrumentType.OBSERVABLE_COUNTER:
            case cX.InstrumentType.OBSERVABLE_GAUGE:
                return cX.AggregationTemporality.CUMULATIVE
        }
    };
    y04.LowMemoryTemporalitySelector = T4Y;

    function v4Y() {
        let A = ((0, G4Y.getStringFromEnv)("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE") ?? "cumulative").toLowerCase();
        if (A === "cumulative") return y04.CumulativeTemporalitySelector;
        if (A === "delta") return y04.DeltaTemporalitySelector;
        if (A === "lowmemory") return y04.LowMemoryTemporalitySelector;
        return f4Y.diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${A}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`), y04.CumulativeTemporalitySelector
    }

    function E4Y(A) {
        if (A != null) {
            if (A === L04.AggregationTemporalityPreference.DELTA) return y04.DeltaTemporalitySelector;
            else if (A === L04.AggregationTemporalityPreference.LOWMEMORY) return y04.LowMemoryTemporalitySelector;
            return y04.CumulativeTemporalitySelector
        }
        return v4Y()
    }
    var k4Y = Object.freeze({
        type: cX.AggregationType.DEFAULT
    });

    function L4Y(A) {
        return A?.aggregationPreference ?? (() => k4Y)
    }
    class R04 extends Z4Y.OTLPExporterBase {
        _aggregationTemporalitySelector;
        _aggregationSelector;
        constructor(A, q) {
            super(A);
            this._aggregationSelector = L4Y(q), this._aggregationTemporalitySelector = E4Y(q?.temporalityPreference)
        }
        selectAggregation(A) {
            return this._aggregationSelector(A)
        }
        selectAggregationTemporality(A) {
            return this._aggregationTemporalitySelector(A)
        }
    }
    y04.OTLPMetricExporterBase = R04
})
// @from(Ln 276940, Col 4)
tGA = R((Yuw, S04) => {
    S04.exports = R4Y;

    function R4Y(A, q) {
        var K = Array(arguments.length - 1),
            Y = 0,
            z = 2,
            w = !0;
        while (z < arguments.length) K[Y++] = arguments[z++];
        return new Promise(function($, O) {
            K[Y] = function(J) {
                if (w)
                    if (w = !1, J) O(J);
                    else {
                        var X = Array(arguments.length - 1),
                            D = 0;
                        while (D < X.length) X[D++] = arguments[D];
                        $.apply(null, X)
                    }
            };
            try {
                A.apply(q || null, K)
            } catch (_) {
                if (w) w = !1, O(_)
            }
        })
    }
})
// @from(Ln 276968, Col 4)
b04 = R((x04) => {
    var DD6 = x04;
    DD6.length = function(q) {
        var K = q.length;
        if (!K) return 0;
        var Y = 0;
        while (--K % 4 > 1 && q.charAt(K) === "=") ++Y;
        return Math.ceil(q.length * 3) / 4 - Y
    };
    var xM1 = Array(64),
        I04 = Array(123);
    for (bR = 0; bR < 64;) I04[xM1[bR] = bR < 26 ? bR + 65 : bR < 52 ? bR + 71 : bR < 62 ? bR - 4 : bR - 59 | 43] = bR++;
    var bR;
    DD6.encode = function(q, K, Y) {
        var z = null,
            w = [],
            H = 0,
            $ = 0,
            O;
        while (K < Y) {
            var _ = q[K++];
            switch ($) {
                case 0:
                    w[H++] = xM1[_ >> 2], O = (_ & 3) << 4, $ = 1;
                    break;
                case 1:
                    w[H++] = xM1[O | _ >> 4], O = (_ & 15) << 2, $ = 2;
                    break;
                case 2:
                    w[H++] = xM1[O | _ >> 6], w[H++] = xM1[_ & 63], $ = 0;
                    break
            }
            if (H > 8191)(z || (z = [])).push(String.fromCharCode.apply(String, w)), H = 0
        }
        if ($) {
            if (w[H++] = xM1[O], w[H++] = 61, $ === 1) w[H++] = 61
        }
        if (z) {
            if (H) z.push(String.fromCharCode.apply(String, w.slice(0, H)));
            return z.join("")
        }
        return String.fromCharCode.apply(String, w.slice(0, H))
    };
    var h04 = "invalid encoding";
    DD6.decode = function(q, K, Y) {
        var z = Y,
            w = 0,
            H;
        for (var $ = 0; $ < q.length;) {
            var O = q.charCodeAt($++);
            if (O === 61 && w > 1) break;
            if ((O = I04[O]) === void 0) throw Error(h04);
            switch (w) {
                case 0:
                    H = O, w = 1;
                    break;
                case 1:
                    K[Y++] = H << 2 | (O & 48) >> 4, H = O, w = 2;
                    break;
                case 2:
                    K[Y++] = (H & 15) << 4 | (O & 60) >> 2, H = O, w = 3;
                    break;
                case 3:
                    K[Y++] = (H & 3) << 6 | O, w = 0;
                    break
            }
        }
        if (w === 1) throw Error(h04);
        return Y - z
    };
    DD6.test = function(q) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(q)
    }
})
// @from(Ln 277042, Col 4)
B04 = R((wuw, u04) => {
    u04.exports = jD6;

    function jD6() {
        this._listeners = {}
    }
    jD6.prototype.on = function(q, K, Y) {
        return (this._listeners[q] || (this._listeners[q] = [])).push({
            fn: K,
            ctx: Y || this
        }), this
    };
    jD6.prototype.off = function(q, K) {
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
    jD6.prototype.emit = function(q) {
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
// @from(Ln 277076, Col 4)
d04 = R((Huw, p04) => {
    p04.exports = m04(m04);

    function m04(A) {
        if (typeof Float32Array < "u")(function() {
            var q = new Float32Array([-0]),
                K = new Uint8Array(q.buffer),
                Y = K[3] === 128;

            function z(O, _, J) {
                q[0] = O, _[J] = K[0], _[J + 1] = K[1], _[J + 2] = K[2], _[J + 3] = K[3]
            }

            function w(O, _, J) {
                q[0] = O, _[J] = K[3], _[J + 1] = K[2], _[J + 2] = K[1], _[J + 3] = K[0]
            }
            A.writeFloatLE = Y ? z : w, A.writeFloatBE = Y ? w : z;

            function H(O, _) {
                return K[0] = O[_], K[1] = O[_ + 1], K[2] = O[_ + 2], K[3] = O[_ + 3], q[0]
            }

            function $(O, _) {
                return K[3] = O[_], K[2] = O[_ + 1], K[1] = O[_ + 2], K[0] = O[_ + 3], q[0]
            }
            A.readFloatLE = Y ? H : $, A.readFloatBE = Y ? $ : H
        })();
        else(function() {
            function q(Y, z, w, H) {
                var $ = z < 0 ? 1 : 0;
                if ($) z = -z;
                if (z === 0) Y(1 / z > 0 ? 0 : 2147483648, w, H);
                else if (isNaN(z)) Y(2143289344, w, H);
                else if (z > 340282346638528860000000000000000000000) Y(($ << 31 | 2139095040) >>> 0, w, H);
                else if (z < 0.000000000000000000000000000000000000011754943508222875) Y(($ << 31 | Math.round(z / 0.000000000000000000000000000000000000000000001401298464324817)) >>> 0, w, H);
                else {
                    var O = Math.floor(Math.log(z) / Math.LN2),
                        _ = Math.round(z * Math.pow(2, -O) * 8388608) & 8388607;
                    Y(($ << 31 | O + 127 << 23 | _) >>> 0, w, H)
                }
            }
            A.writeFloatLE = q.bind(null, F04), A.writeFloatBE = q.bind(null, Q04);

            function K(Y, z, w) {
                var H = Y(z, w),
                    $ = (H >> 31) * 2 + 1,
                    O = H >>> 23 & 255,
                    _ = H & 8388607;
                return O === 255 ? _ ? NaN : $ * (1 / 0) : O === 0 ? $ * 0.000000000000000000000000000000000000000000001401298464324817 * _ : $ * Math.pow(2, O - 150) * (_ + 8388608)
            }
            A.readFloatLE = K.bind(null, g04), A.readFloatBE = K.bind(null, U04)
        })();
        if (typeof Float64Array < "u")(function() {
            var q = new Float64Array([-0]),
                K = new Uint8Array(q.buffer),
                Y = K[7] === 128;

            function z(O, _, J) {
                q[0] = O, _[J] = K[0], _[J + 1] = K[1], _[J + 2] = K[2], _[J + 3] = K[3], _[J + 4] = K[4], _[J + 5] = K[5], _[J + 6] = K[6], _[J + 7] = K[7]
            }

            function w(O, _, J) {
                q[0] = O, _[J] = K[7], _[J + 1] = K[6], _[J + 2] = K[5], _[J + 3] = K[4], _[J + 4] = K[3], _[J + 5] = K[2], _[J + 6] = K[1], _[J + 7] = K[0]
            }
            A.writeDoubleLE = Y ? z : w, A.writeDoubleBE = Y ? w : z;

            function H(O, _) {
                return K[0] = O[_], K[1] = O[_ + 1], K[2] = O[_ + 2], K[3] = O[_ + 3], K[4] = O[_ + 4], K[5] = O[_ + 5], K[6] = O[_ + 6], K[7] = O[_ + 7], q[0]
            }

            function $(O, _) {
                return K[7] = O[_], K[6] = O[_ + 1], K[5] = O[_ + 2], K[4] = O[_ + 3], K[3] = O[_ + 4], K[2] = O[_ + 5], K[1] = O[_ + 6], K[0] = O[_ + 7], q[0]
            }
            A.readDoubleLE = Y ? H : $, A.readDoubleBE = Y ? $ : H
        })();
        else(function() {
            function q(Y, z, w, H, $, O) {
                var _ = H < 0 ? 1 : 0;
                if (_) H = -H;
                if (H === 0) Y(0, $, O + z), Y(1 / H > 0 ? 0 : 2147483648, $, O + w);
                else if (isNaN(H)) Y(0, $, O + z), Y(2146959360, $, O + w);
                else if (H > 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000) Y(0, $, O + z), Y((_ << 31 | 2146435072) >>> 0, $, O + w);
                else {
                    var J;
                    if (H < 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000022250738585072014) J = H / 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005, Y(J >>> 0, $, O + z), Y((_ << 31 | J / 4294967296) >>> 0, $, O + w);
                    else {
                        var X = Math.floor(Math.log(H) / Math.LN2);
                        if (X === 1024) X = 1023;
                        J = H * Math.pow(2, -X), Y(J * 4503599627370496 >>> 0, $, O + z), Y((_ << 31 | X + 1023 << 20 | J * 1048576 & 1048575) >>> 0, $, O + w)
                    }
                }
            }
            A.writeDoubleLE = q.bind(null, F04, 0, 4), A.writeDoubleBE = q.bind(null, Q04, 4, 0);

            function K(Y, z, w, H, $) {
                var O = Y(H, $ + z),
                    _ = Y(H, $ + w),
                    J = (_ >> 31) * 2 + 1,
                    X = _ >>> 20 & 2047,
                    D = 4294967296 * (_ & 1048575) + O;
                return X === 2047 ? D ? NaN : J * (1 / 0) : X === 0 ? J * 0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005 * D : J * Math.pow(2, X - 1075) * (D + 4503599627370496)
            }
            A.readDoubleLE = K.bind(null, g04, 0, 4), A.readDoubleBE = K.bind(null, U04, 4, 0)
        })();
        return A
    }

    function F04(A, q, K) {
        q[K] = A & 255, q[K + 1] = A >>> 8 & 255, q[K + 2] = A >>> 16 & 255, q[K + 3] = A >>> 24
    }

    function Q04(A, q, K) {
        q[K] = A >>> 24, q[K + 1] = A >>> 16 & 255, q[K + 2] = A >>> 8 & 255, q[K + 3] = A & 255
    }

    function g04(A, q) {
        return (A[q] | A[q + 1] << 8 | A[q + 2] << 16 | A[q + 3] << 24) >>> 0
    }

    function U04(A, q) {
        return (A[q] << 24 | A[q + 1] << 16 | A[q + 2] << 8 | A[q + 3]) >>> 0
    }
})
// @from(Ln 277199, Col 4)
c04 = R((Nm1, eGA) => {
    (function(A, q) {
        function K(Y) {
            return Y.default || Y
        }
        if (typeof define === "function" && define.amd) define([], function() {
            var Y = {};
            return q(Y), K(Y)
        });
        else if (typeof Nm1 === "object") {
            if (q(Nm1), typeof eGA === "object") eGA.exports = K(Nm1)
        } else(function() {
            var Y = {};
            q(Y), A.Long = K(Y)
        })()
    })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : Nm1, function(A) {
        Object.defineProperty(A, "__esModule", {
            value: !0
        }), A.default = void 0;
        var q = null;
        try {
            q = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
        } catch {}

        function K(U, x, p) {
            this.low = U | 0, this.high = x | 0, this.unsigned = !!p
        }
        K.prototype.__isLong__, Object.defineProperty(K.prototype, "__isLong__", {
            value: !0
        });

        function Y(U) {
            return (U && U.__isLong__) === !0
        }

        function z(U) {
            var x = Math.clz32(U & -U);
            return U ? 31 - x : x
        }
        K.isLong = Y;
        var w = {},
            H = {};

        function $(U, x) {
            var p, l, r;
            if (x) {
                if (U >>>= 0, r = 0 <= U && U < 256) {
                    if (l = H[U], l) return l
                }
                if (p = _(U, 0, !0), r) H[U] = p;
                return p
            } else {
                if (U |= 0, r = -128 <= U && U < 128) {
                    if (l = w[U], l) return l
                }
                if (p = _(U, U < 0 ? -1 : 0, !1), r) w[U] = p;
                return p
            }
        }
        K.fromInt = $;

        function O(U, x) {
            if (isNaN(U)) return x ? N : Z;
            if (x) {
                if (U < 0) return N;
                if (U >= W) return S
            } else {
                if (U <= -G) return m;
                if (U + 1 >= G) return B
            }
            if (U < 0) return O(-U, x).neg();
            return _(U % P | 0, U / P | 0, x)
        }
        K.fromNumber = O;

        function _(U, x, p) {
            return new K(U, x, p)
        }
        K.fromBits = _;
        var J = Math.pow;

        function X(U, x, p) {
            if (U.length === 0) throw Error("empty string");
            if (typeof x === "number") p = x, x = !1;
            else x = !!x;
            if (U === "NaN" || U === "Infinity" || U === "+Infinity" || U === "-Infinity") return x ? N : Z;
            if (p = p || 10, p < 2 || 36 < p) throw RangeError("radix");
            var l;
            if ((l = U.indexOf("-")) > 0) throw Error("interior hyphen");
            else if (l === 0) return X(U.substring(1), x, p).neg();
            var r = O(J(p, 8)),
                s = Z;
            for (var O1 = 0; O1 < U.length; O1 += 8) {
                var T1 = Math.min(8, U.length - O1),
                    N1 = parseInt(U.substring(O1, O1 + T1), p);
                if (T1 < 8) {
                    var j1 = O(J(p, T1));
                    s = s.mul(j1).add(O(N1))
                } else s = s.mul(r), s = s.add(O(N1))
            }
            return s.unsigned = x, s
        }
        K.fromString = X;

        function D(U, x) {
            if (typeof U === "number") return O(U, x);
            if (typeof U === "string") return X(U, x);
            return _(U.low, U.high, typeof x === "boolean" ? x : U.unsigned)
        }
        K.fromValue = D;
        var j = 65536,
            M = 16777216,
            P = j * j,
            W = P * P,
            G = W / 2,
            f = $(M),
            Z = $(0);
        K.ZERO = Z;
        var N = $(0, !0);
        K.UZERO = N;
        var T = $(1);
        K.ONE = T;
        var k = $(1, !0);
        K.UONE = k;
        var y = $(-1);
        K.NEG_ONE = y;
        var B = _(-1, 2147483647, !1);
        K.MAX_VALUE = B;
        var S = _(-1, -1, !0);
        K.MAX_UNSIGNED_VALUE = S;
        var m = _(0, -2147483648, !1);
        K.MIN_VALUE = m;
        var b = K.prototype;
        if (b.toInt = function() {
                return this.unsigned ? this.low >>> 0 : this.low
            }, b.toNumber = function() {
                if (this.unsigned) return (this.high >>> 0) * P + (this.low >>> 0);
                return this.high * P + (this.low >>> 0)
            }, b.toString = function(x) {
                if (x = x || 10, x < 2 || 36 < x) throw RangeError("radix");
                if (this.isZero()) return "0";
                if (this.isNegative())
                    if (this.eq(m)) {
                        var p = O(x),
                            l = this.div(p),
                            r = l.mul(p).sub(this);
                        return l.toString(x) + r.toInt().toString(x)
                    } else return "-" + this.neg().toString(x);
                var s = O(J(x, 6), this.unsigned),
                    O1 = this,
                    T1 = "";
                while (!0) {
                    var N1 = O1.div(s),
                        j1 = O1.sub(N1.mul(s)).toInt() >>> 0,
                        q1 = j1.toString(x);
                    if (O1 = N1, O1.isZero()) return q1 + T1;
                    else {
                        while (q1.length < 6) q1 = "0" + q1;
                        T1 = "" + q1 + T1
                    }
                }
            }, b.getHighBits = function() {
                return this.high
            }, b.getHighBitsUnsigned = function() {
                return this.high >>> 0
            }, b.getLowBits = function() {
                return this.low
            }, b.getLowBitsUnsigned = function() {
                return this.low >>> 0
            }, b.getNumBitsAbs = function() {
                if (this.isNegative()) return this.eq(m) ? 64 : this.neg().getNumBitsAbs();
                var x = this.high != 0 ? this.high : this.low;
                for (var p = 31; p > 0; p--)
                    if ((x & 1 << p) != 0) break;
                return this.high != 0 ? p + 33 : p + 1
            }, b.isSafeInteger = function() {
                var x = this.high >> 21;
                if (!x) return !0;
                if (this.unsigned) return !1;
                return x === -1 && !(this.low === 0 && this.high === -2097152)
            }, b.isZero = function() {
                return this.high === 0 && this.low === 0
            }, b.eqz = b.isZero, b.isNegative = function() {
                return !this.unsigned && this.high < 0
            }, b.isPositive = function() {
                return this.unsigned || this.high >= 0
            }, b.isOdd = function() {
                return (this.low & 1) === 1
            }, b.isEven = function() {
                return (this.low & 1) === 0
            }, b.equals = function(x) {
                if (!Y(x)) x = D(x);
                if (this.unsigned !== x.unsigned && this.high >>> 31 === 1 && x.high >>> 31 === 1) return !1;
                return this.high === x.high && this.low === x.low
            }, b.eq = b.equals, b.notEquals = function(x) {
                return !this.eq(x)
            }, b.neq = b.notEquals, b.ne = b.notEquals, b.lessThan = function(x) {
                return this.comp(x) < 0
            }, b.lt = b.lessThan, b.lessThanOrEqual = function(x) {
                return this.comp(x) <= 0
            }, b.lte = b.lessThanOrEqual, b.le = b.lessThanOrEqual, b.greaterThan = function(x) {
                return this.comp(x) > 0
            }, b.gt = b.greaterThan, b.greaterThanOrEqual = function(x) {
                return this.comp(x) >= 0
            }, b.gte = b.greaterThanOrEqual, b.ge = b.greaterThanOrEqual, b.compare = function(x) {
                if (!Y(x)) x = D(x);
                if (this.eq(x)) return 0;
                var p = this.isNegative(),
                    l = x.isNegative();
                if (p && !l) return -1;
                if (!p && l) return 1;
                if (!this.unsigned) return this.sub(x).isNegative() ? -1 : 1;
                return x.high >>> 0 > this.high >>> 0 || x.high === this.high && x.low >>> 0 > this.low >>> 0 ? -1 : 1
            }, b.comp = b.compare, b.negate = function() {
                if (!this.unsigned && this.eq(m)) return m;
                return this.not().add(T)
            }, b.neg = b.negate, b.add = function(x) {
                if (!Y(x)) x = D(x);
                var p = this.high >>> 16,
                    l = this.high & 65535,
                    r = this.low >>> 16,
                    s = this.low & 65535,
                    O1 = x.high >>> 16,
                    T1 = x.high & 65535,
                    N1 = x.low >>> 16,
                    j1 = x.low & 65535,
                    q1 = 0,
                    t = 0,
                    J1 = 0,
                    D1 = 0;
                return D1 += s + j1, J1 += D1 >>> 16, D1 &= 65535, J1 += r + N1, t += J1 >>> 16, J1 &= 65535, t += l + T1, q1 += t >>> 16, t &= 65535, q1 += p + O1, q1 &= 65535, _(J1 << 16 | D1, q1 << 16 | t, this.unsigned)
            }, b.subtract = function(x) {
                if (!Y(x)) x = D(x);
                return this.add(x.neg())
            }, b.sub = b.subtract, b.multiply = function(x) {
                if (this.isZero()) return this;
                if (!Y(x)) x = D(x);
                if (q) {
                    var p = q.mul(this.low, this.high, x.low, x.high);
                    return _(p, q.get_high(), this.unsigned)
                }
                if (x.isZero()) return this.unsigned ? N : Z;
                if (this.eq(m)) return x.isOdd() ? m : Z;
                if (x.eq(m)) return this.isOdd() ? m : Z;
                if (this.isNegative())
                    if (x.isNegative()) return this.neg().mul(x.neg());
                    else return this.neg().mul(x).neg();
                else if (x.isNegative()) return this.mul(x.neg()).neg();
                if (this.lt(f) && x.lt(f)) return O(this.toNumber() * x.toNumber(), this.unsigned);
                var l = this.high >>> 16,
                    r = this.high & 65535,
                    s = this.low >>> 16,
                    O1 = this.low & 65535,
                    T1 = x.high >>> 16,
                    N1 = x.high & 65535,
                    j1 = x.low >>> 16,
                    q1 = x.low & 65535,
                    t = 0,
                    J1 = 0,
                    D1 = 0,
                    Z1 = 0;
                return Z1 += O1 * q1, D1 += Z1 >>> 16, Z1 &= 65535, D1 += s * q1, J1 += D1 >>> 16, D1 &= 65535, D1 += O1 * j1, J1 += D1 >>> 16, D1 &= 65535, J1 += r * q1, t += J1 >>> 16, J1 &= 65535, J1 += s * j1, t += J1 >>> 16, J1 &= 65535, J1 += O1 * N1, t += J1 >>> 16, J1 &= 65535, t += l * q1 + r * j1 + s * N1 + O1 * T1, t &= 65535, _(D1 << 16 | Z1, t << 16 | J1, this.unsigned)
            }, b.mul = b.multiply, b.divide = function(x) {
                if (!Y(x)) x = D(x);
                if (x.isZero()) throw Error("division by zero");
                if (q) {
                    if (!this.unsigned && this.high === -2147483648 && x.low === -1 && x.high === -1) return this;
                    var p = (this.unsigned ? q.div_u : q.div_s)(this.low, this.high, x.low, x.high);
                    return _(p, q.get_high(), this.unsigned)
                }
                if (this.isZero()) return this.unsigned ? N : Z;
                var l, r, s;
                if (!this.unsigned) {
                    if (this.eq(m))
                        if (x.eq(T) || x.eq(y)) return m;
                        else if (x.eq(m)) return T;
                    else {
                        var O1 = this.shr(1);
                        if (l = O1.div(x).shl(1), l.eq(Z)) return x.isNegative() ? T : y;
                        else return r = this.sub(x.mul(l)), s = l.add(r.div(x)), s
                    } else if (x.eq(m)) return this.unsigned ? N : Z;
                    if (this.isNegative()) {
                        if (x.isNegative()) return this.neg().div(x.neg());
                        return this.neg().div(x).neg()
                    } else if (x.isNegative()) return this.div(x.neg()).neg();
                    s = Z
                } else {
                    if (!x.unsigned) x = x.toUnsigned();
                    if (x.gt(this)) return N;
                    if (x.gt(this.shru(1))) return k;
                    s = N
                }
                r = this;
                while (r.gte(x)) {
                    l = Math.max(1, Math.floor(r.toNumber() / x.toNumber()));
                    var T1 = Math.ceil(Math.log(l) / Math.LN2),
                        N1 = T1 <= 48 ? 1 : J(2, T1 - 48),
                        j1 = O(l),
                        q1 = j1.mul(x);
                    while (q1.isNegative() || q1.gt(r)) l -= N1, j1 = O(l, this.unsigned), q1 = j1.mul(x);
                    if (j1.isZero()) j1 = T;
                    s = s.add(j1), r = r.sub(q1)
                }
                return s
            }, b.div = b.divide, b.modulo = function(x) {
                if (!Y(x)) x = D(x);
                if (q) {
                    var p = (this.unsigned ? q.rem_u : q.rem_s)(this.low, this.high, x.low, x.high);
                    return _(p, q.get_high(), this.unsigned)
                }
                return this.sub(this.div(x).mul(x))
            }, b.mod = b.modulo, b.rem = b.modulo, b.not = function() {
                return _(~this.low, ~this.high, this.unsigned)
            }, b.countLeadingZeros = function() {
                return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
            }, b.clz = b.countLeadingZeros, b.countTrailingZeros = function() {
                return this.low ? z(this.low) : z(this.high) + 32
            }, b.ctz = b.countTrailingZeros, b.and = function(x) {
                if (!Y(x)) x = D(x);
                return _(this.low & x.low, this.high & x.high, this.unsigned)
            }, b.or = function(x) {
                if (!Y(x)) x = D(x);
                return _(this.low | x.low, this.high | x.high, this.unsigned)
            }, b.xor = function(x) {
                if (!Y(x)) x = D(x);
                return _(this.low ^ x.low, this.high ^ x.high, this.unsigned)
            }, b.shiftLeft = function(x) {
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                else if (x < 32) return _(this.low << x, this.high << x | this.low >>> 32 - x, this.unsigned);
                else return _(0, this.low << x - 32, this.unsigned)
            }, b.shl = b.shiftLeft, b.shiftRight = function(x) {
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                else if (x < 32) return _(this.low >>> x | this.high << 32 - x, this.high >> x, this.unsigned);
                else return _(this.high >> x - 32, this.high >= 0 ? 0 : -1, this.unsigned)
            }, b.shr = b.shiftRight, b.shiftRightUnsigned = function(x) {
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                if (x < 32) return _(this.low >>> x | this.high << 32 - x, this.high >>> x, this.unsigned);
                if (x === 32) return _(this.high, 0, this.unsigned);
                return _(this.high >>> x - 32, 0, this.unsigned)
            }, b.shru = b.shiftRightUnsigned, b.shr_u = b.shiftRightUnsigned, b.rotateLeft = function(x) {
                var p;
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                if (x === 32) return _(this.high, this.low, this.unsigned);
                if (x < 32) return p = 32 - x, _(this.low << x | this.high >>> p, this.high << x | this.low >>> p, this.unsigned);
                return x -= 32, p = 32 - x, _(this.high << x | this.low >>> p, this.low << x | this.high >>> p, this.unsigned)
            }, b.rotl = b.rotateLeft, b.rotateRight = function(x) {
                var p;
                if (Y(x)) x = x.toInt();
                if ((x &= 63) === 0) return this;
                if (x === 32) return _(this.high, this.low, this.unsigned);
                if (x < 32) return p = 32 - x, _(this.high << p | this.low >>> x, this.low << p | this.high >>> x, this.unsigned);
                return x -= 32, p = 32 - x, _(this.low << p | this.high >>> x, this.high << p | this.low >>> x, this.unsigned)
            }, b.rotr = b.rotateRight, b.toSigned = function() {
                if (!this.unsigned) return this;
                return _(this.low, this.high, !1)
            }, b.toUnsigned = function() {
                if (this.unsigned) return this;
                return _(this.low, this.high, !0)
            }, b.toBytes = function(x) {
                return x ? this.toBytesLE() : this.toBytesBE()
            }, b.toBytesLE = function() {
                var x = this.high,
                    p = this.low;
                return [p & 255, p >>> 8 & 255, p >>> 16 & 255, p >>> 24, x & 255, x >>> 8 & 255, x >>> 16 & 255, x >>> 24]
            }, b.toBytesBE = function() {
                var x = this.high,
                    p = this.low;
                return [x >>> 24, x >>> 16 & 255, x >>> 8 & 255, x & 255, p >>> 24, p >>> 16 & 255, p >>> 8 & 255, p & 255]
            }, K.fromBytes = function(x, p, l) {
                return l ? K.fromBytesLE(x, p) : K.fromBytesBE(x, p)
            }, K.fromBytesLE = function(x, p) {
                return new K(x[0] | x[1] << 8 | x[2] << 16 | x[3] << 24, x[4] | x[5] << 8 | x[6] << 16 | x[7] << 24, p)
            }, K.fromBytesBE = function(x, p) {
                return new K(x[4] << 24 | x[5] << 16 | x[6] << 8 | x[7], x[0] << 24 | x[1] << 16 | x[2] << 8 | x[3], p)
            }, typeof BigInt === "function") K.fromBigInt = function(x, p) {
            var l = Number(BigInt.asIntN(32, x)),
                r = Number(BigInt.asIntN(32, x >> BigInt(32)));
            return _(l, r, p)
        }, K.fromValue = function(x, p) {
            if (typeof x === "bigint") return K.fromBigInt(x, p);
            return D(x, p)
        }, b.toBigInt = function() {
            var x = BigInt(this.low >>> 0),
                p = BigInt(this.unsigned ? this.high >>> 0 : this.high);
            return p << BigInt(32) | x
        };
        var g = A.default = K
    })
})
// @from(Ln 277592, Col 4)
qZA = R((l04, AZA) => {
    AZA.exports = y4Y;

    function y4Y(moduleName) {
        try {
            var mod = moduleName === "long" ? c04() : moduleName === "buffer" ? h1("buffer") : moduleName === "fs" ? h1("fs") : eval("quire".replace(/^/, "re"))(moduleName);
            if (mod && (mod.length || Object.keys(mod).length)) return mod
        } catch (A) {}
        return null
    }
})
// @from(Ln 277603, Col 4)
n04 = R((i04) => {
    var KZA = i04;
    KZA.length = function(q) {
        var K = 0,
            Y = 0;
        for (var z = 0; z < q.length; ++z)
            if (Y = q.charCodeAt(z), Y < 128) K += 1;
            else if (Y < 2048) K += 2;
        else if ((Y & 64512) === 55296 && (q.charCodeAt(z + 1) & 64512) === 56320) ++z, K += 4;
        else K += 3;
        return K
    };
    KZA.read = function(q, K, Y) {
        var z = Y - K;
        if (z < 1) return "";
        var w = null,
            H = [],
            $ = 0,
            O;
        while (K < Y) {
            if (O = q[K++], O < 128) H[$++] = O;
            else if (O > 191 && O < 224) H[$++] = (O & 31) << 6 | q[K++] & 63;
            else if (O > 239 && O < 365) O = ((O & 7) << 18 | (q[K++] & 63) << 12 | (q[K++] & 63) << 6 | q[K++] & 63) - 65536, H[$++] = 55296 + (O >> 10), H[$++] = 56320 + (O & 1023);
            else H[$++] = (O & 15) << 12 | (q[K++] & 63) << 6 | q[K++] & 63;
            if ($ > 8191)(w || (w = [])).push(String.fromCharCode.apply(String, H)), $ = 0
        }
        if (w) {
            if ($) w.push(String.fromCharCode.apply(String, H.slice(0, $)));
            return w.join("")
        }
        return String.fromCharCode.apply(String, H.slice(0, $))
    };
    KZA.write = function(q, K, Y) {
        var z = Y,
            w, H;
        for (var $ = 0; $ < q.length; ++$)
            if (w = q.charCodeAt($), w < 128) K[Y++] = w;
            else if (w < 2048) K[Y++] = w >> 6 | 192, K[Y++] = w & 63 | 128;
        else if ((w & 64512) === 55296 && ((H = q.charCodeAt($ + 1)) & 64512) === 56320) w = 65536 + ((w & 1023) << 10) + (H & 1023), ++$, K[Y++] = w >> 18 | 240, K[Y++] = w >> 12 & 63 | 128, K[Y++] = w >> 6 & 63 | 128, K[Y++] = w & 63 | 128;
        else K[Y++] = w >> 12 | 224, K[Y++] = w >> 6 & 63 | 128, K[Y++] = w & 63 | 128;
        return Y - z
    }
})
// @from(Ln 277646, Col 4)
o04 = R((Ouw, r04) => {
    r04.exports = C4Y;

    function C4Y(A, q, K) {
        var Y = K || 8192,
            z = Y >>> 1,
            w = null,
            H = Y;
        return function(O) {
            if (O < 1 || O > z) return A(O);
            if (H + O > Y) w = A(Y), H = 0;
            var _ = q.call(w, H, H += O);
            if (H & 7) H = (H | 7) + 1;
            return _
        }
    }
})
// @from(Ln 277663, Col 4)
s04 = R((_uw, a04) => {
    a04.exports = _j;
    var Tm1 = Am();

    function _j(A, q) {
        this.lo = A >>> 0, this.hi = q >>> 0
    }
    var N31 = _j.zero = new _j(0, 0);
    N31.toNumber = function() {
        return 0
    };
    N31.zzEncode = N31.zzDecode = function() {
        return this
    };
    N31.length = function() {
        return 1
    };
    var S4Y = _j.zeroHash = "\x00\x00\x00\x00\x00\x00\x00\x00";
    _j.fromNumber = function(q) {
        if (q === 0) return N31;
        var K = q < 0;
        if (K) q = -q;
        var Y = q >>> 0,
            z = (q - Y) / 4294967296 >>> 0;
        if (K) {
            if (z = ~z >>> 0, Y = ~Y >>> 0, ++Y > 4294967295) {
                if (Y = 0, ++z > 4294967295) z = 0
            }
        }
        return new _j(Y, z)
    };
    _j.from = function(q) {
        if (typeof q === "number") return _j.fromNumber(q);
        if (Tm1.isString(q))
            if (Tm1.Long) q = Tm1.Long.fromString(q);
            else return _j.fromNumber(parseInt(q, 10));
        return q.low || q.high ? new _j(q.low >>> 0, q.high >>> 0) : N31
    };
    _j.prototype.toNumber = function(q) {
        if (!q && this.hi >>> 31) {
            var K = ~this.lo + 1 >>> 0,
                Y = ~this.hi >>> 0;
            if (!K) Y = Y + 1 >>> 0;
            return -(K + Y * 4294967296)
        }
        return this.lo + this.hi * 4294967296
    };
    _j.prototype.toLong = function(q) {
        return Tm1.Long ? new Tm1.Long(this.lo | 0, this.hi | 0, Boolean(q)) : {
            low: this.lo | 0,
            high: this.hi | 0,
            unsigned: Boolean(q)
        }
    };
    var Gs = String.prototype.charCodeAt;
    _j.fromHash = function(q) {
        if (q === S4Y) return N31;
        return new _j((Gs.call(q, 0) | Gs.call(q, 1) << 8 | Gs.call(q, 2) << 16 | Gs.call(q, 3) << 24) >>> 0, (Gs.call(q, 4) | Gs.call(q, 5) << 8 | Gs.call(q, 6) << 16 | Gs.call(q, 7) << 24) >>> 0)
    };
    _j.prototype.toHash = function() {
        return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
    };
    _j.prototype.zzEncode = function() {
        var q = this.hi >> 31;
        return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ q) >>> 0, this.lo = (this.lo << 1 ^ q) >>> 0, this
    };
    _j.prototype.zzDecode = function() {
        var q = -(this.lo & 1);
        return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ q) >>> 0, this.hi = (this.hi >>> 1 ^ q) >>> 0, this
    };
    _j.prototype.length = function() {
        var q = this.lo,
            K = (this.lo >>> 28 | this.hi << 4) >>> 0,
            Y = this.hi >>> 24;
        return Y === 0 ? K === 0 ? q < 16384 ? q < 128 ? 1 : 2 : q < 2097152 ? 3 : 4 : K < 16384 ? K < 128 ? 5 : 6 : K < 2097152 ? 7 : 8 : Y < 128 ? 9 : 10
    }
})
// @from(Ln 277740, Col 4)
Am = R((YZA) => {
    var Qq = YZA;
    Qq.asPromise = tGA();
    Qq.base64 = b04();
    Qq.EventEmitter = B04();
    Qq.float = d04();
    Qq.inquire = qZA();
    Qq.utf8 = n04();
    Qq.pool = o04();
    Qq.LongBits = s04();
    Qq.isNode = Boolean(typeof global < "u" && global && global.process && global.process.versions && global.process.versions.node);
    Qq.global = Qq.isNode && global || typeof window < "u" && window || typeof self < "u" && self || YZA;
    Qq.emptyArray = Object.freeze ? Object.freeze([]) : [];
    Qq.emptyObject = Object.freeze ? Object.freeze({}) : {};
    Qq.isInteger = Number.isInteger || function(q) {
        return typeof q === "number" && isFinite(q) && Math.floor(q) === q
    };
    Qq.isString = function(q) {
        return typeof q === "string" || q instanceof String
    };
    Qq.isObject = function(q) {
        return q && typeof q === "object"
    };
    Qq.isset = Qq.isSet = function(q, K) {
        var Y = q[K];
        if (Y != null && q.hasOwnProperty(K)) return typeof Y !== "object" || (Array.isArray(Y) ? Y.length : Object.keys(Y).length) > 0;
        return !1
    };
    Qq.Buffer = function() {
        try {
            var A = Qq.inquire("buffer").Buffer;
            return A.prototype.utf8Write ? A : null
        } catch (q) {
            return null
        }
    }();
    Qq._Buffer_from = null;
    Qq._Buffer_allocUnsafe = null;
    Qq.newBuffer = function(q) {
        return typeof q === "number" ? Qq.Buffer ? Qq._Buffer_allocUnsafe(q) : new Qq.Array(q) : Qq.Buffer ? Qq._Buffer_from(q) : typeof Uint8Array > "u" ? q : new Uint8Array(q)
    };
    Qq.Array = typeof Uint8Array < "u" ? Uint8Array : Array;
    Qq.Long = Qq.global.dcodeIO && Qq.global.dcodeIO.Long || Qq.global.Long || Qq.inquire("long");
    Qq.key2Re = /^true|false|0|1$/;
    Qq.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
    Qq.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
    Qq.longToHash = function(q) {
        return q ? Qq.LongBits.from(q).toHash() : Qq.LongBits.zeroHash
    };
    Qq.longFromHash = function(q, K) {
        var Y = Qq.LongBits.fromHash(q);
        if (Qq.Long) return Qq.Long.fromBits(Y.lo, Y.hi, K);
        return Y.toNumber(Boolean(K))
    };

    function t04(A, q, K) {
        for (var Y = Object.keys(q), z = 0; z < Y.length; ++z)
            if (A[Y[z]] === void 0 || !K) A[Y[z]] = q[Y[z]];
        return A
    }
    Qq.merge = t04;
    Qq.lcFirst = function(q) {
        return q.charAt(0).toLowerCase() + q.substring(1)
    };

    function e04(A) {
        function q(K, Y) {
            if (!(this instanceof q)) return new q(K, Y);
            if (Object.defineProperty(this, "message", {
                    get: function() {
                        return K
                    }
                }), Error.captureStackTrace) Error.captureStackTrace(this, q);
            else Object.defineProperty(this, "stack", {
                value: Error().stack || ""
            });
            if (Y) t04(this, Y)
        }
        return q.prototype = Object.create(Error.prototype, {
            constructor: {
                value: q,
                writable: !0,
                enumerable: !1,
                configurable: !0
            },
            name: {
                get: function() {
                    return A
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
        }), q
    }
    Qq.newError = e04;
    Qq.ProtocolError = e04("ProtocolError");
    Qq.oneOfGetter = function(q) {
        var K = {};
        for (var Y = 0; Y < q.length; ++Y) K[q[Y]] = 1;
        return function() {
            for (var z = Object.keys(this), w = z.length - 1; w > -1; --w)
                if (K[z[w]] === 1 && this[z[w]] !== void 0 && this[z[w]] !== null) return z[w]
        }
    };
    Qq.oneOfSetter = function(q) {
        return function(K) {
            for (var Y = 0; Y < q.length; ++Y)
                if (q[Y] !== K) delete this[q[Y]]
        }
    };
    Qq.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: !0
    };
    Qq._configure = function() {
        var A = Qq.Buffer;
        if (!A) {
            Qq._Buffer_from = Qq._Buffer_allocUnsafe = null;
            return
        }
        Qq._Buffer_from = A.from !== Uint8Array.from && A.from || function(K, Y) {
            return new A(K, Y)
        }, Qq._Buffer_allocUnsafe = A.allocUnsafe || function(K) {
            return new A(K)
        }
    }
})
// @from(Ln 277878, Col 4)
PD6 = R((Xuw, Yj4) => {
    Yj4.exports = nY;
    var uR = Am(),
        zZA, MD6 = uR.LongBits,
        Aj4 = uR.base64,
        qj4 = uR.utf8;

    function vm1(A, q, K) {
        this.fn = A, this.len = q, this.next = void 0, this.val = K
    }

    function HZA() {}

    function h4Y(A) {
        this.head = A.head, this.tail = A.tail, this.len = A.len, this.next = A.states
    }

    function nY() {
        this.len = 0, this.head = new vm1(HZA, 0, 0), this.tail = this.head, this.states = null
    }
    var Kj4 = function() {
        return uR.Buffer ? function() {
            return (nY.create = function() {
                return new zZA
            })()
        } : function() {
            return new nY
        }
    };
    nY.create = Kj4();
    nY.alloc = function(q) {
        return new uR.Array(q)
    };
    if (uR.Array !== Array) nY.alloc = uR.pool(nY.alloc, uR.Array.prototype.subarray);
    nY.prototype._push = function(q, K, Y) {
        return this.tail = this.tail.next = new vm1(q, K, Y), this.len += K, this
    };

    function $ZA(A, q, K) {
        q[K] = A & 255
    }

    function I4Y(A, q, K) {
        while (A > 127) q[K++] = A & 127 | 128, A >>>= 7;
        q[K] = A
    }

    function OZA(A, q) {
        this.len = A, this.next = void 0, this.val = q
    }
    OZA.prototype = Object.create(vm1.prototype);
    OZA.prototype.fn = I4Y;
    nY.prototype.uint32 = function(q) {
        return this.len += (this.tail = this.tail.next = new OZA((q = q >>> 0) < 128 ? 1 : q < 16384 ? 2 : q < 2097152 ? 3 : q < 268435456 ? 4 : 5, q)).len, this
    };
    nY.prototype.int32 = function(q) {
        return q < 0 ? this._push(_ZA, 10, MD6.fromNumber(q)) : this.uint32(q)
    };
    nY.prototype.sint32 = function(q) {
        return this.uint32((q << 1 ^ q >> 31) >>> 0)
    };

    function _ZA(A, q, K) {
        while (A.hi) q[K++] = A.lo & 127 | 128, A.lo = (A.lo >>> 7 | A.hi << 25) >>> 0, A.hi >>>= 7;
        while (A.lo > 127) q[K++] = A.lo & 127 | 128, A.lo = A.lo >>> 7;
        q[K++] = A.lo
    }
    nY.prototype.uint64 = function(q) {
        var K = MD6.from(q);
        return this._push(_ZA, K.length(), K)
    };
    nY.prototype.int64 = nY.prototype.uint64;
    nY.prototype.sint64 = function(q) {
        var K = MD6.from(q).zzEncode();
        return this._push(_ZA, K.length(), K)
    };
    nY.prototype.bool = function(q) {
        return this._push($ZA, 1, q ? 1 : 0)
    };

    function wZA(A, q, K) {
        q[K] = A & 255, q[K + 1] = A >>> 8 & 255, q[K + 2] = A >>> 16 & 255, q[K + 3] = A >>> 24
    }
    nY.prototype.fixed32 = function(q) {
        return this._push(wZA, 4, q >>> 0)
    };
    nY.prototype.sfixed32 = nY.prototype.fixed32;
    nY.prototype.fixed64 = function(q) {
        var K = MD6.from(q);
        return this._push(wZA, 4, K.lo)._push(wZA, 4, K.hi)
    };
    nY.prototype.sfixed64 = nY.prototype.fixed64;
    nY.prototype.float = function(q) {
        return this._push(uR.float.writeFloatLE, 4, q)
    };
    nY.prototype.double = function(q) {
        return this._push(uR.float.writeDoubleLE, 8, q)
    };
    var x4Y = uR.Array.prototype.set ? function(q, K, Y) {
        K.set(q, Y)
    } : function(q, K, Y) {
        for (var z = 0; z < q.length; ++z) K[Y + z] = q[z]
    };
    nY.prototype.bytes = function(q) {
        var K = q.length >>> 0;
        if (!K) return this._push($ZA, 1, 0);
        if (uR.isString(q)) {
            var Y = nY.alloc(K = Aj4.length(q));
            Aj4.decode(q, Y, 0), q = Y
        }
        return this.uint32(K)._push(x4Y, K, q)
    };
    nY.prototype.string = function(q) {
        var K = qj4.length(q);
        return K ? this.uint32(K)._push(qj4.write, K, q) : this._push($ZA, 1, 0)
    };
    nY.prototype.fork = function() {
        return this.states = new h4Y(this), this.head = this.tail = new vm1(HZA, 0, 0), this.len = 0, this
    };
    nY.prototype.reset = function() {
        if (this.states) this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next;
        else this.head = this.tail = new vm1(HZA, 0, 0), this.len = 0;
        return this
    };
    nY.prototype.ldelim = function() {
        var q = this.head,
            K = this.tail,
            Y = this.len;
        if (this.reset().uint32(Y), Y) this.tail.next = q.next, this.tail = K, this.len += Y;
        return this
    };
    nY.prototype.finish = function() {
        var q = this.head.next,
            K = this.constructor.alloc(this.len),
            Y = 0;
        while (q) q.fn(q.val, K, Y), Y += q.len, q = q.next;
        return K
    };
    nY._configure = function(A) {
        zZA = A, nY.create = Kj4(), zZA._configure()
    }
})
// @from(Ln 278020, Col 4)
Hj4 = R((Duw, wj4) => {
    wj4.exports = qm;
    var zj4 = PD6();
    (qm.prototype = Object.create(zj4.prototype)).constructor = qm;
    var Zs = Am();

    function qm() {
        zj4.call(this)
    }
    qm._configure = function() {
        qm.alloc = Zs._Buffer_allocUnsafe, qm.writeBytesBuffer = Zs.Buffer && Zs.Buffer.prototype instanceof Uint8Array && Zs.Buffer.prototype.set.name === "set" ? function(q, K, Y) {
            K.set(q, Y)
        } : function(q, K, Y) {
            if (q.copy) q.copy(K, Y, 0, q.length);
            else
                for (var z = 0; z < q.length;) K[Y++] = q[z++]
        }
    };
    qm.prototype.bytes = function(q) {
        if (Zs.isString(q)) q = Zs._Buffer_from(q, "base64");
        var K = q.length >>> 0;
        if (this.uint32(K), K) this._push(qm.writeBytesBuffer, K, q);
        return this
    };

    function b4Y(A, q, K) {
        if (A.length < 40) Zs.utf8.write(A, q, K);
        else if (q.utf8Write) q.utf8Write(A, K);
        else q.write(A, K)
    }
    qm.prototype.string = function(q) {
        var K = Zs.Buffer.byteLength(q);
        if (this.uint32(K), K) this._push(b4Y, K, q);
        return this
    };
    qm._configure()
})