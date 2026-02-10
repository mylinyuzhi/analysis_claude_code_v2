
// @from(Ln 283683, Col 4)
Rj4 = R((kj4) => {
    Object.defineProperty(kj4, "__esModule", {
        value: !0
    });
    kj4.hexToBinary = void 0;

    function Ej4(A) {
        if (A >= 48 && A <= 57) return A - 48;
        if (A >= 97 && A <= 102) return A - 87;
        return A - 55
    }

    function m4Y(A) {
        let q = new Uint8Array(A.length / 2),
            K = 0;
        for (let Y = 0; Y < A.length; Y += 2) {
            let z = Ej4(A.charCodeAt(Y)),
                w = Ej4(A.charCodeAt(Y + 1));
            q[K++] = z << 4 | w
        }
        return q
    }
    kj4.hexToBinary = m4Y
})
// @from(Ln 283707, Col 4)
fD6 = R((Ij4) => {
    Object.defineProperty(Ij4, "__esModule", {
        value: !0
    });
    Ij4.getOtlpEncoder = Ij4.encodeAsString = Ij4.encodeAsLongBits = Ij4.toLongBits = Ij4.hrTimeToNanos = void 0;
    var F4Y = G9(),
        WZA = Rj4();

    function GZA(A) {
        let q = BigInt(1e9);
        return BigInt(Math.trunc(A[0])) * q + BigInt(Math.trunc(A[1]))
    }
    Ij4.hrTimeToNanos = GZA;

    function Cj4(A) {
        let q = Number(BigInt.asUintN(32, A)),
            K = Number(BigInt.asUintN(32, A >> BigInt(32)));
        return {
            low: q,
            high: K
        }
    }
    Ij4.toLongBits = Cj4;

    function ZZA(A) {
        let q = GZA(A);
        return Cj4(q)
    }
    Ij4.encodeAsLongBits = ZZA;

    function Sj4(A) {
        return GZA(A).toString()
    }
    Ij4.encodeAsString = Sj4;
    var Q4Y = typeof BigInt < "u" ? Sj4 : F4Y.hrTimeToNanoseconds;

    function yj4(A) {
        return A
    }

    function hj4(A) {
        if (A === void 0) return;
        return (0, WZA.hexToBinary)(A)
    }
    var g4Y = {
        encodeHrTime: ZZA,
        encodeSpanContext: WZA.hexToBinary,
        encodeOptionalSpanContext: hj4
    };

    function U4Y(A) {
        if (A === void 0) return g4Y;
        let q = A.useLongBits ?? !0,
            K = A.useHex ?? !1;
        return {
            encodeHrTime: q ? ZZA : Q4Y,
            encodeSpanContext: K ? yj4 : WZA.hexToBinary,
            encodeOptionalSpanContext: K ? yj4 : hj4
        }
    }
    Ij4.getOtlpEncoder = U4Y
})
// @from(Ln 283769, Col 4)
VD6 = R((uj4) => {
    Object.defineProperty(uj4, "__esModule", {
        value: !0
    });
    uj4.toAnyValue = uj4.toKeyValue = uj4.toAttributes = uj4.createInstrumentationScope = uj4.createResource = void 0;

    function i4Y(A) {
        let q = {
                attributes: bj4(A.attributes),
                droppedAttributesCount: 0
            },
            K = A.schemaUrl;
        if (K && K !== "") q.schemaUrl = K;
        return q
    }
    uj4.createResource = i4Y;

    function n4Y(A) {
        return {
            name: A.name,
            version: A.version
        }
    }
    uj4.createInstrumentationScope = n4Y;

    function bj4(A) {
        return Object.keys(A).map((q) => fZA(q, A[q]))
    }
    uj4.toAttributes = bj4;

    function fZA(A, q) {
        return {
            key: A,
            value: VZA(q)
        }
    }
    uj4.toKeyValue = fZA;

    function VZA(A) {
        let q = typeof A;
        if (q === "string") return {
            stringValue: A
        };
        if (q === "number") {
            if (!Number.isInteger(A)) return {
                doubleValue: A
            };
            return {
                intValue: A
            }
        }
        if (q === "boolean") return {
            boolValue: A
        };
        if (A instanceof Uint8Array) return {
            bytesValue: A
        };
        if (Array.isArray(A)) return {
            arrayValue: {
                values: A.map(VZA)
            }
        };
        if (q === "object" && A != null) return {
            kvlistValue: {
                values: Object.entries(A).map(([K, Y]) => fZA(K, Y))
            }
        };
        return {}
    }
    uj4.toAnyValue = VZA
})
// @from(Ln 283840, Col 4)
NZA = R((Fj4) => {
    Object.defineProperty(Fj4, "__esModule", {
        value: !0
    });
    Fj4.toLogAttributes = Fj4.createExportLogsServiceRequest = void 0;
    var t4Y = fD6(),
        ND6 = VD6();

    function e4Y(A, q) {
        let K = (0, t4Y.getOtlpEncoder)(q);
        return {
            resourceLogs: qqY(A, K)
        }
    }
    Fj4.createExportLogsServiceRequest = e4Y;

    function AqY(A) {
        let q = new Map;
        for (let K of A) {
            let {
                resource: Y,
                instrumentationScope: {
                    name: z,
                    version: w = "",
                    schemaUrl: H = ""
                }
            } = K, $ = q.get(Y);
            if (!$) $ = new Map, q.set(Y, $);
            let O = `${z}@${w}:${H}`,
                _ = $.get(O);
            if (!_) _ = [], $.set(O, _);
            _.push(K)
        }
        return q
    }

    function qqY(A, q) {
        let K = AqY(A);
        return Array.from(K, ([Y, z]) => {
            let w = (0, ND6.createResource)(Y);
            return {
                resource: w,
                scopeLogs: Array.from(z, ([, H]) => {
                    return {
                        scope: (0, ND6.createInstrumentationScope)(H[0].instrumentationScope),
                        logRecords: H.map(($) => KqY($, q)),
                        schemaUrl: H[0].instrumentationScope.schemaUrl
                    }
                }),
                schemaUrl: w.schemaUrl
            }
        })
    }

    function KqY(A, q) {
        return {
            timeUnixNano: q.encodeHrTime(A.hrTime),
            observedTimeUnixNano: q.encodeHrTime(A.hrTimeObserved),
            severityNumber: YqY(A.severityNumber),
            severityText: A.severityText,
            body: (0, ND6.toAnyValue)(A.body),
            eventName: A.eventName,
            attributes: mj4(A.attributes),
            droppedAttributesCount: A.droppedAttributesCount,
            flags: A.spanContext?.traceFlags,
            traceId: q.encodeOptionalSpanContext(A.spanContext?.traceId),
            spanId: q.encodeOptionalSpanContext(A.spanContext?.spanId)
        }
    }

    function YqY(A) {
        return A
    }

    function mj4(A) {
        return Object.keys(A).map((q) => (0, ND6.toKeyValue)(q, A[q]))
    }
    Fj4.toLogAttributes = mj4
})
// @from(Ln 283919, Col 4)
dj4 = R((Uj4) => {
    Object.defineProperty(Uj4, "__esModule", {
        value: !0
    });
    Uj4.ProtobufLogsSerializer = void 0;
    var gj4 = ZD6(),
        wqY = NZA(),
        HqY = gj4.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse,
        $qY = gj4.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
    Uj4.ProtobufLogsSerializer = {
        serializeRequest: (A) => {
            let q = (0, wqY.createExportLogsServiceRequest)(A);
            return $qY.encode(q).finish()
        },
        deserializeResponse: (A) => {
            return HqY.decode(A)
        }
    }
})
// @from(Ln 283938, Col 4)
cj4 = R((TZA) => {
    Object.defineProperty(TZA, "__esModule", {
        value: !0
    });
    TZA.ProtobufLogsSerializer = void 0;
    var OqY = dj4();
    Object.defineProperty(TZA, "ProtobufLogsSerializer", {
        enumerable: !0,
        get: function() {
            return OqY.ProtobufLogsSerializer
        }
    })
})
// @from(Ln 283951, Col 4)
ij4 = R((lj4) => {
    Object.defineProperty(lj4, "__esModule", {
        value: !0
    });
    lj4.EAggregationTemporality = void 0;
    var JqY;
    (function(A) {
        A[A.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED", A[A.AGGREGATION_TEMPORALITY_DELTA = 1] = "AGGREGATION_TEMPORALITY_DELTA", A[A.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"
    })(JqY = lj4.EAggregationTemporality || (lj4.EAggregationTemporality = {}))
})
// @from(Ln 283961, Col 4)
EZA = R((ej4) => {
    Object.defineProperty(ej4, "__esModule", {
        value: !0
    });
    ej4.createExportMetricsServiceRequest = ej4.toMetric = ej4.toScopeMetrics = ej4.toResourceMetrics = void 0;
    var nj4 = Fq(),
        bM1 = Ps(),
        rj4 = ij4(),
        XqY = fD6(),
        km1 = VD6();

    function aj4(A, q) {
        let K = (0, XqY.getOtlpEncoder)(q),
            Y = (0, km1.createResource)(A.resource);
        return {
            resource: Y,
            schemaUrl: Y.schemaUrl,
            scopeMetrics: sj4(A.scopeMetrics, K)
        }
    }
    ej4.toResourceMetrics = aj4;

    function sj4(A, q) {
        return Array.from(A.map((K) => ({
            scope: (0, km1.createInstrumentationScope)(K.scope),
            metrics: K.metrics.map((Y) => tj4(Y, q)),
            schemaUrl: K.scope.schemaUrl
        })))
    }
    ej4.toScopeMetrics = sj4;

    function tj4(A, q) {
        let K = {
                name: A.descriptor.name,
                description: A.descriptor.description,
                unit: A.descriptor.unit
            },
            Y = PqY(A.aggregationTemporality);
        switch (A.dataPointType) {
            case bM1.DataPointType.SUM:
                K.sum = {
                    aggregationTemporality: Y,
                    isMonotonic: A.isMonotonic,
                    dataPoints: oj4(A, q)
                };
                break;
            case bM1.DataPointType.GAUGE:
                K.gauge = {
                    dataPoints: oj4(A, q)
                };
                break;
            case bM1.DataPointType.HISTOGRAM:
                K.histogram = {
                    aggregationTemporality: Y,
                    dataPoints: jqY(A, q)
                };
                break;
            case bM1.DataPointType.EXPONENTIAL_HISTOGRAM:
                K.exponentialHistogram = {
                    aggregationTemporality: Y,
                    dataPoints: MqY(A, q)
                };
                break
        }
        return K
    }
    ej4.toMetric = tj4;

    function DqY(A, q, K) {
        let Y = {
            attributes: (0, km1.toAttributes)(A.attributes),
            startTimeUnixNano: K.encodeHrTime(A.startTime),
            timeUnixNano: K.encodeHrTime(A.endTime)
        };
        switch (q) {
            case nj4.ValueType.INT:
                Y.asInt = A.value;
                break;
            case nj4.ValueType.DOUBLE:
                Y.asDouble = A.value;
                break
        }
        return Y
    }

    function oj4(A, q) {
        return A.dataPoints.map((K) => {
            return DqY(K, A.descriptor.valueType, q)
        })
    }

    function jqY(A, q) {
        return A.dataPoints.map((K) => {
            let Y = K.value;
            return {
                attributes: (0, km1.toAttributes)(K.attributes),
                bucketCounts: Y.buckets.counts,
                explicitBounds: Y.buckets.boundaries,
                count: Y.count,
                sum: Y.sum,
                min: Y.min,
                max: Y.max,
                startTimeUnixNano: q.encodeHrTime(K.startTime),
                timeUnixNano: q.encodeHrTime(K.endTime)
            }
        })
    }

    function MqY(A, q) {
        return A.dataPoints.map((K) => {
            let Y = K.value;
            return {
                attributes: (0, km1.toAttributes)(K.attributes),
                count: Y.count,
                min: Y.min,
                max: Y.max,
                sum: Y.sum,
                positive: {
                    offset: Y.positive.offset,
                    bucketCounts: Y.positive.bucketCounts
                },
                negative: {
                    offset: Y.negative.offset,
                    bucketCounts: Y.negative.bucketCounts
                },
                scale: Y.scale,
                zeroCount: Y.zeroCount,
                startTimeUnixNano: q.encodeHrTime(K.startTime),
                timeUnixNano: q.encodeHrTime(K.endTime)
            }
        })
    }

    function PqY(A) {
        switch (A) {
            case bM1.AggregationTemporality.DELTA:
                return rj4.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
            case bM1.AggregationTemporality.CUMULATIVE:
                return rj4.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE
        }
    }

    function WqY(A, q) {
        return {
            resourceMetrics: A.map((K) => aj4(K, q))
        }
    }
    ej4.createExportMetricsServiceRequest = WqY
})
// @from(Ln 284110, Col 4)
zM4 = R((KM4) => {
    Object.defineProperty(KM4, "__esModule", {
        value: !0
    });
    KM4.ProtobufMetricsSerializer = void 0;
    var qM4 = ZD6(),
        VqY = EZA(),
        NqY = qM4.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse,
        TqY = qM4.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
    KM4.ProtobufMetricsSerializer = {
        serializeRequest: (A) => {
            let q = (0, VqY.createExportMetricsServiceRequest)([A]);
            return TqY.encode(q).finish()
        },
        deserializeResponse: (A) => {
            return NqY.decode(A)
        }
    }
})
// @from(Ln 284129, Col 4)
wM4 = R((kZA) => {
    Object.defineProperty(kZA, "__esModule", {
        value: !0
    });
    kZA.ProtobufMetricsSerializer = void 0;
    var vqY = zM4();
    Object.defineProperty(kZA, "ProtobufMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return vqY.ProtobufMetricsSerializer
        }
    })
})
// @from(Ln 284142, Col 4)
LZA = R((JM4) => {
    Object.defineProperty(JM4, "__esModule", {
        value: !0
    });
    JM4.createExportTraceServiceRequest = JM4.toOtlpSpanEvent = JM4.toOtlpLink = JM4.sdkSpanToOtlpSpan = void 0;
    var Lm1 = VD6(),
        kqY = fD6(),
        LqY = 256,
        RqY = 512;

    function HM4(A, q) {
        let K = A & 255 | LqY;
        if (q) K |= RqY;
        return K
    }

    function $M4(A, q) {
        let K = A.spanContext(),
            Y = A.status,
            z = A.parentSpanContext?.spanId ? q.encodeSpanContext(A.parentSpanContext?.spanId) : void 0;
        return {
            traceId: q.encodeSpanContext(K.traceId),
            spanId: q.encodeSpanContext(K.spanId),
            parentSpanId: z,
            traceState: K.traceState?.serialize(),
            name: A.name,
            kind: A.kind == null ? 0 : A.kind + 1,
            startTimeUnixNano: q.encodeHrTime(A.startTime),
            endTimeUnixNano: q.encodeHrTime(A.endTime),
            attributes: (0, Lm1.toAttributes)(A.attributes),
            droppedAttributesCount: A.droppedAttributesCount,
            events: A.events.map((w) => _M4(w, q)),
            droppedEventsCount: A.droppedEventsCount,
            status: {
                code: Y.code,
                message: Y.message
            },
            links: A.links.map((w) => OM4(w, q)),
            droppedLinksCount: A.droppedLinksCount,
            flags: HM4(K.traceFlags, A.parentSpanContext?.isRemote)
        }
    }
    JM4.sdkSpanToOtlpSpan = $M4;

    function OM4(A, q) {
        return {
            attributes: A.attributes ? (0, Lm1.toAttributes)(A.attributes) : [],
            spanId: q.encodeSpanContext(A.context.spanId),
            traceId: q.encodeSpanContext(A.context.traceId),
            traceState: A.context.traceState?.serialize(),
            droppedAttributesCount: A.droppedAttributesCount || 0,
            flags: HM4(A.context.traceFlags, A.context.isRemote)
        }
    }
    JM4.toOtlpLink = OM4;

    function _M4(A, q) {
        return {
            attributes: A.attributes ? (0, Lm1.toAttributes)(A.attributes) : [],
            name: A.name,
            timeUnixNano: q.encodeHrTime(A.time),
            droppedAttributesCount: A.droppedAttributesCount || 0
        }
    }
    JM4.toOtlpSpanEvent = _M4;

    function yqY(A, q) {
        let K = (0, kqY.getOtlpEncoder)(q);
        return {
            resourceSpans: SqY(A, K)
        }
    }
    JM4.createExportTraceServiceRequest = yqY;

    function CqY(A) {
        let q = new Map;
        for (let K of A) {
            let Y = q.get(K.resource);
            if (!Y) Y = new Map, q.set(K.resource, Y);
            let z = `${K.instrumentationScope.name}@${K.instrumentationScope.version||""}:${K.instrumentationScope.schemaUrl||""}`,
                w = Y.get(z);
            if (!w) w = [], Y.set(z, w);
            w.push(K)
        }
        return q
    }

    function SqY(A, q) {
        let K = CqY(A),
            Y = [],
            z = K.entries(),
            w = z.next();
        while (!w.done) {
            let [H, $] = w.value, O = [], _ = $.values(), J = _.next();
            while (!J.done) {
                let j = J.value;
                if (j.length > 0) {
                    let M = j.map((P) => $M4(P, q));
                    O.push({
                        scope: (0, Lm1.createInstrumentationScope)(j[0].instrumentationScope),
                        spans: M,
                        schemaUrl: j[0].instrumentationScope.schemaUrl
                    })
                }
                J = _.next()
            }
            let X = (0, Lm1.createResource)(H),
                D = {
                    resource: X,
                    scopeSpans: O,
                    schemaUrl: X.schemaUrl
                };
            Y.push(D), w = z.next()
        }
        return Y
    }
})
// @from(Ln 284259, Col 4)
PM4 = R((jM4) => {
    Object.defineProperty(jM4, "__esModule", {
        value: !0
    });
    jM4.ProtobufTraceSerializer = void 0;
    var DM4 = ZD6(),
        bqY = LZA(),
        uqY = DM4.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse,
        BqY = DM4.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
    jM4.ProtobufTraceSerializer = {
        serializeRequest: (A) => {
            let q = (0, bqY.createExportTraceServiceRequest)(A);
            return BqY.encode(q).finish()
        },
        deserializeResponse: (A) => {
            return uqY.decode(A)
        }
    }
})
// @from(Ln 284278, Col 4)
WM4 = R((RZA) => {
    Object.defineProperty(RZA, "__esModule", {
        value: !0
    });
    RZA.ProtobufTraceSerializer = void 0;
    var mqY = PM4();
    Object.defineProperty(RZA, "ProtobufTraceSerializer", {
        enumerable: !0,
        get: function() {
            return mqY.ProtobufTraceSerializer
        }
    })
})
// @from(Ln 284291, Col 4)
fM4 = R((GM4) => {
    Object.defineProperty(GM4, "__esModule", {
        value: !0
    });
    GM4.JsonLogsSerializer = void 0;
    var QqY = NZA();
    GM4.JsonLogsSerializer = {
        serializeRequest: (A) => {
            let q = (0, QqY.createExportLogsServiceRequest)(A, {
                useHex: !0,
                useLongBits: !1
            });
            return new TextEncoder().encode(JSON.stringify(q))
        },
        deserializeResponse: (A) => {
            if (A.length === 0) return {};
            return JSON.parse(new TextDecoder().decode(A))
        }
    }
})
// @from(Ln 284311, Col 4)
VM4 = R((yZA) => {
    Object.defineProperty(yZA, "__esModule", {
        value: !0
    });
    yZA.JsonLogsSerializer = void 0;
    var gqY = fM4();
    Object.defineProperty(yZA, "JsonLogsSerializer", {
        enumerable: !0,
        get: function() {
            return gqY.JsonLogsSerializer
        }
    })
})
// @from(Ln 284324, Col 4)
vM4 = R((NM4) => {
    Object.defineProperty(NM4, "__esModule", {
        value: !0
    });
    NM4.JsonMetricsSerializer = void 0;
    var pqY = EZA();
    NM4.JsonMetricsSerializer = {
        serializeRequest: (A) => {
            let q = (0, pqY.createExportMetricsServiceRequest)([A], {
                useLongBits: !1
            });
            return new TextEncoder().encode(JSON.stringify(q))
        },
        deserializeResponse: (A) => {
            if (A.length === 0) return {};
            return JSON.parse(new TextDecoder().decode(A))
        }
    }
})
// @from(Ln 284343, Col 4)
EM4 = R((CZA) => {
    Object.defineProperty(CZA, "__esModule", {
        value: !0
    });
    CZA.JsonMetricsSerializer = void 0;
    var dqY = vM4();
    Object.defineProperty(CZA, "JsonMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return dqY.JsonMetricsSerializer
        }
    })
})
// @from(Ln 284356, Col 4)
RM4 = R((kM4) => {
    Object.defineProperty(kM4, "__esModule", {
        value: !0
    });
    kM4.JsonTraceSerializer = void 0;
    var lqY = LZA();
    kM4.JsonTraceSerializer = {
        serializeRequest: (A) => {
            let q = (0, lqY.createExportTraceServiceRequest)(A, {
                useHex: !0,
                useLongBits: !1
            });
            return new TextEncoder().encode(JSON.stringify(q))
        },
        deserializeResponse: (A) => {
            if (A.length === 0) return {};
            return JSON.parse(new TextDecoder().decode(A))
        }
    }
})
// @from(Ln 284376, Col 4)
yM4 = R((SZA) => {
    Object.defineProperty(SZA, "__esModule", {
        value: !0
    });
    SZA.JsonTraceSerializer = void 0;
    var iqY = RM4();
    Object.defineProperty(SZA, "JsonTraceSerializer", {
        enumerable: !0,
        get: function() {
            return iqY.JsonTraceSerializer
        }
    })
})
// @from(Ln 284389, Col 4)
Km = R((Vs) => {
    Object.defineProperty(Vs, "__esModule", {
        value: !0
    });
    Vs.JsonTraceSerializer = Vs.JsonMetricsSerializer = Vs.JsonLogsSerializer = Vs.ProtobufTraceSerializer = Vs.ProtobufMetricsSerializer = Vs.ProtobufLogsSerializer = void 0;
    var rqY = cj4();
    Object.defineProperty(Vs, "ProtobufLogsSerializer", {
        enumerable: !0,
        get: function() {
            return rqY.ProtobufLogsSerializer
        }
    });
    var oqY = wM4();
    Object.defineProperty(Vs, "ProtobufMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return oqY.ProtobufMetricsSerializer
        }
    });
    var aqY = WM4();
    Object.defineProperty(Vs, "ProtobufTraceSerializer", {
        enumerable: !0,
        get: function() {
            return aqY.ProtobufTraceSerializer
        }
    });
    var sqY = VM4();
    Object.defineProperty(Vs, "JsonLogsSerializer", {
        enumerable: !0,
        get: function() {
            return sqY.JsonLogsSerializer
        }
    });
    var tqY = EM4();
    Object.defineProperty(Vs, "JsonMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return tqY.JsonMetricsSerializer
        }
    });
    var eqY = yM4();
    Object.defineProperty(Vs, "JsonTraceSerializer", {
        enumerable: !0,
        get: function() {
            return eqY.JsonTraceSerializer
        }
    })
})
// @from(Ln 284437, Col 4)
hM4 = R((CM4) => {
    Object.defineProperty(CM4, "__esModule", {
        value: !0
    });
    CM4.validateAndNormalizeHeaders = void 0;
    var qKY = Fq();

    function KKY(A) {
        let q = {};
        return Object.entries(A ?? {}).forEach(([K, Y]) => {
            if (typeof Y < "u") q[K] = String(Y);
            else qKY.diag.warn(`Header "${K}" has invalid value (${Y}) and will be ignored`)
        }), q
    }
    CM4.validateAndNormalizeHeaders = KKY
})
// @from(Ln 284453, Col 4)
uM4 = R((xM4) => {
    Object.defineProperty(xM4, "__esModule", {
        value: !0
    });
    xM4.getHttpConfigurationDefaults = xM4.mergeOtlpHttpConfigurationWithDefaults = void 0;
    var IM4 = Vm1(),
        YKY = hM4();

    function zKY(A, q, K) {
        return async () => {
            let Y = {
                    ...await K()
                },
                z = {};
            if (q != null) Object.assign(z, await q());
            if (A != null) Object.assign(z, (0, YKY.validateAndNormalizeHeaders)(await A()));
            return Object.assign(z, Y)
        }
    }

    function wKY(A) {
        if (A == null) return;
        try {
            let q = globalThis.location?.href;
            return new URL(A, q).href
        } catch {
            throw Error(`Configuration: Could not parse user-provided export URL: '${A}'`)
        }
    }

    function HKY(A, q, K) {
        return {
            ...(0, IM4.mergeOtlpSharedConfigurationWithDefaults)(A, q, K),
            headers: zKY(A.headers, q.headers, K.headers),
            url: wKY(A.url) ?? q.url ?? K.url
        }
    }
    xM4.mergeOtlpHttpConfigurationWithDefaults = HKY;

    function $KY(A, q) {
        return {
            ...(0, IM4.getSharedConfigurationDefaults)(),
            headers: async () => A,
            url: "http://localhost:4318/" + q
        }
    }
    xM4.getHttpConfigurationDefaults = $KY
})
// @from(Ln 284501, Col 4)
TD6 = R((FM4) => {
    Object.defineProperty(FM4, "__esModule", {
        value: !0
    });
    FM4.getNodeHttpConfigurationDefaults = FM4.mergeOtlpNodeHttpConfigurationWithDefaults = FM4.httpAgentFactoryFromOptions = void 0;
    var BM4 = uM4();

    function mM4(A) {
        return async (q) => {
            let K = q === "http:",
                Y = K ? import("http") : import("https"),
                {
                    Agent: z
                } = await Y;
            if (K) {
                let {
                    ca: w,
                    cert: H,
                    key: $,
                    ...O
                } = A;
                return new z(O)
            }
            return new z(A)
        }
    }
    FM4.httpAgentFactoryFromOptions = mM4;

    function _KY(A, q, K) {
        return {
            ...(0, BM4.mergeOtlpHttpConfigurationWithDefaults)(A, q, K),
            agentFactory: A.agentFactory ?? q.agentFactory ?? K.agentFactory,
            userAgent: A.userAgent
        }
    }
    FM4.mergeOtlpNodeHttpConfigurationWithDefaults = _KY;

    function JKY(A, q) {
        return {
            ...(0, BM4.getHttpConfigurationDefaults)(A, q),
            agentFactory: mM4({
                keepAlive: !0
            })
        }
    }
    FM4.getNodeHttpConfigurationDefaults = JKY
})
// @from(Ln 284548, Col 4)
pM4 = R((gM4) => {
    Object.defineProperty(gM4, "__esModule", {
        value: !0
    });
    gM4.parseRetryAfterToMills = gM4.isExportRetryable = void 0;

    function jKY(A) {
        return [429, 502, 503, 504].includes(A)
    }
    gM4.isExportRetryable = jKY;

    function MKY(A) {
        if (A == null) return;
        let q = Number.parseInt(A, 10);
        if (Number.isInteger(q)) return q > 0 ? q * 1000 : -1;
        let K = new Date(A).getTime() - Date.now();
        if (K >= 0) return K;
        return 0
    }
    gM4.parseRetryAfterToMills = MKY
})
// @from(Ln 284569, Col 4)
lM4 = R((dM4) => {
    Object.defineProperty(dM4, "__esModule", {
        value: !0
    });
    dM4.VERSION = void 0;
    dM4.VERSION = "0.208.0"
})
// @from(Ln 284576, Col 4)
sM4 = R((oM4) => {
    Object.defineProperty(oM4, "__esModule", {
        value: !0
    });
    oM4.compressAndSend = oM4.sendWithHttp = void 0;
    var WKY = h1("zlib"),
        GKY = h1("stream"),
        iM4 = pM4(),
        ZKY = JD6(),
        fKY = lM4(),
        nM4 = `OTel-OTLP-Exporter-JavaScript/${fKY.VERSION}`;

    function VKY(A, q, K, Y, z, w, H, $, O) {
        let _ = new URL(q);
        if (z) K["User-Agent"] = `${z} ${nM4}`;
        else K["User-Agent"] = nM4;
        let J = {
                hostname: _.hostname,
                port: _.port,
                path: _.pathname,
                method: "POST",
                headers: K,
                agent: w
            },
            X = A(J, (D) => {
                let j = [];
                D.on("data", (M) => j.push(M)), D.on("end", () => {
                    if (D.statusCode && D.statusCode < 299) $({
                        status: "success",
                        data: Buffer.concat(j)
                    });
                    else if (D.statusCode && (0, iM4.isExportRetryable)(D.statusCode)) $({
                        status: "retryable",
                        retryInMillis: (0, iM4.parseRetryAfterToMills)(D.headers["retry-after"])
                    });
                    else {
                        let M = new ZKY.OTLPExporterError(D.statusMessage, D.statusCode, Buffer.concat(j).toString());
                        $({
                            status: "failure",
                            error: M
                        })
                    }
                })
            });
        X.setTimeout(O, () => {
            X.destroy(), $({
                status: "failure",
                error: Error("Request Timeout")
            })
        }), X.on("error", (D) => {
            $({
                status: "failure",
                error: D
            })
        }), rM4(X, Y, H, (D) => {
            $({
                status: "failure",
                error: D
            })
        })
    }
    oM4.sendWithHttp = VKY;

    function rM4(A, q, K, Y) {
        let z = NKY(K);
        if (q === "gzip") A.setHeader("Content-Encoding", "gzip"), z = z.on("error", Y).pipe(WKY.createGzip()).on("error", Y);
        z.pipe(A).on("error", Y)
    }
    oM4.compressAndSend = rM4;

    function NKY(A) {
        let q = new GKY.Readable;
        return q.push(A), q.push(null), q
    }
})
// @from(Ln 284651, Col 4)
qP4 = R((eM4) => {
    Object.defineProperty(eM4, "__esModule", {
        value: !0
    });
    eM4.createHttpExporterTransport = void 0;
    var vKY = sM4();
    class tM4 {
        _parameters;
        _utils = null;
        constructor(A) {
            this._parameters = A
        }
        async send(A, q) {
            let {
                agent: K,
                request: Y
            } = await this._loadUtils(), z = await this._parameters.headers();
            return new Promise((w) => {
                (0, vKY.sendWithHttp)(Y, this._parameters.url, z, this._parameters.compression, this._parameters.userAgent, K, A, (H) => {
                    w(H)
                }, q)
            })
        }
        shutdown() {}
        async _loadUtils() {
            let A = this._utils;
            if (A === null) {
                let q = new URL(this._parameters.url).protocol,
                    [K, Y] = await Promise.all([this._parameters.agentFactory(q), EKY(q)]);
                A = this._utils = {
                    agent: K,
                    request: Y
                }
            }
            return A
        }
    }
    async function EKY(A) {
        let q = A === "http:" ? import("http") : import("https"),
            {
                request: K
            } = await q;
        return K
    }

    function kKY(A) {
        return new tM4(A)
    }
    eM4.createHttpExporterTransport = kKY
})
// @from(Ln 284701, Col 4)
HP4 = R((zP4) => {
    Object.defineProperty(zP4, "__esModule", {
        value: !0
    });
    zP4.createRetryingTransport = void 0;
    var LKY = 5,
        RKY = 1000,
        yKY = 5000,
        CKY = 1.5,
        KP4 = 0.2;

    function SKY() {
        return Math.random() * (2 * KP4) - KP4
    }
    class YP4 {
        _transport;
        constructor(A) {
            this._transport = A
        }
        retry(A, q, K) {
            return new Promise((Y, z) => {
                setTimeout(() => {
                    this._transport.send(A, q).then(Y, z)
                }, K)
            })
        }
        async send(A, q) {
            let K = Date.now() + q,
                Y = await this._transport.send(A, q),
                z = LKY,
                w = RKY;
            while (Y.status === "retryable" && z > 0) {
                z--;
                let H = Math.max(Math.min(w, yKY) + SKY(), 0);
                w = w * CKY;
                let $ = Y.retryInMillis ?? H,
                    O = K - Date.now();
                if ($ > O) return Y;
                Y = await this.retry(A, O, $)
            }
            return Y
        }
        shutdown() {
            return this._transport.shutdown()
        }
    }

    function hKY(A) {
        return new YP4(A.transport)
    }
    zP4.createRetryingTransport = hKY
})
// @from(Ln 284753, Col 4)
_P4 = R(($P4) => {
    Object.defineProperty($P4, "__esModule", {
        value: !0
    });
    $P4.createOtlpHttpExportDelegate = void 0;
    var IKY = rGA(),
        xKY = qP4(),
        bKY = nGA(),
        uKY = HP4();

    function BKY(A, q) {
        return (0, IKY.createOtlpExportDelegate)({
            transport: (0, uKY.createRetryingTransport)({
                transport: (0, xKY.createHttpExporterTransport)(A)
            }),
            serializer: q,
            promiseHandler: (0, bKY.createBoundedQueueExportPromiseHandler)(A)
        }, {
            timeout: A.timeoutMillis
        })
    }
    $P4.createOtlpHttpExportDelegate = BKY
})
// @from(Ln 284776, Col 4)
hZA = R((MP4) => {
    Object.defineProperty(MP4, "__esModule", {
        value: !0
    });
    MP4.getSharedConfigurationFromEnvironment = void 0;
    var DP4 = G9(),
        jP4 = Fq();

    function JP4(A) {
        let q = (0, DP4.getNumberFromEnv)(A);
        if (q != null) {
            if (Number.isFinite(q) && q > 0) return q;
            jP4.diag.warn(`Configuration: ${A} is invalid, expected number greater than 0 (actual: ${q})`)
        }
        return
    }

    function mKY(A) {
        let q = JP4(`OTEL_EXPORTER_OTLP_${A}_TIMEOUT`),
            K = JP4("OTEL_EXPORTER_OTLP_TIMEOUT");
        return q ?? K
    }

    function XP4(A) {
        let q = (0, DP4.getStringFromEnv)(A)?.trim();
        if (q == null || q === "none" || q === "gzip") return q;
        jP4.diag.warn(`Configuration: ${A} is invalid, expected 'none' or 'gzip' (actual: '${q}')`);
        return
    }

    function FKY(A) {
        let q = XP4(`OTEL_EXPORTER_OTLP_${A}_COMPRESSION`),
            K = XP4("OTEL_EXPORTER_OTLP_COMPRESSION");
        return q ?? K
    }

    function QKY(A) {
        return {
            timeoutMillis: mKY(A),
            compression: FKY(A)
        }
    }
    MP4.getSharedConfigurationFromEnvironment = QKY
})
// @from(Ln 284820, Col 4)
ZP4 = R((WP4) => {
    Object.defineProperty(WP4, "__esModule", {
        value: !0
    });
    WP4.getNodeHttpConfigurationFromEnvironment = void 0;
    var gKY = h1("fs"),
        UKY = h1("path"),
        Ym = G9(),
        vD6 = Fq(),
        pKY = hZA(),
        dKY = Vm1(),
        cKY = TD6();

    function lKY(A) {
        let q = (0, Ym.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_HEADERS`),
            K = (0, Ym.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"),
            Y = (0, Ym.parseKeyPairsIntoRecord)(q),
            z = (0, Ym.parseKeyPairsIntoRecord)(K);
        if (Object.keys(Y).length === 0 && Object.keys(z).length === 0) return;
        return Object.assign({}, (0, Ym.parseKeyPairsIntoRecord)(K), (0, Ym.parseKeyPairsIntoRecord)(q))
    }

    function iKY(A) {
        try {
            return new URL(A).toString()
        } catch {
            vD6.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
            return
        }
    }

    function nKY(A, q) {
        try {
            new URL(A)
        } catch {
            vD6.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
            return
        }
        if (!A.endsWith("/")) A = A + "/";
        A += q;
        try {
            new URL(A)
        } catch {
            vD6.diag.warn(`Configuration: Provided URL appended with '${q}' is not a valid URL, using 'undefined' instead of '${A}'`);
            return
        }
        return A
    }

    function rKY(A) {
        let q = (0, Ym.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
        if (q === void 0) return;
        return nKY(q, A)
    }

    function oKY(A) {
        let q = (0, Ym.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`);
        if (q === void 0) return;
        return iKY(q)
    }

    function IZA(A, q, K) {
        let Y = (0, Ym.getStringFromEnv)(A),
            z = (0, Ym.getStringFromEnv)(q),
            w = Y ?? z;
        if (w != null) try {
            return gKY.readFileSync(UKY.resolve(process.cwd(), w))
        } catch {
            vD6.diag.warn(K);
            return
        } else return
    }

    function aKY(A) {
        return IZA(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
    }

    function sKY(A) {
        return IZA(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
    }

    function tKY(A) {
        return IZA(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
    }

    function eKY(A, q) {
        return {
            ...(0, pKY.getSharedConfigurationFromEnvironment)(A),
            url: oKY(A) ?? rKY(q),
            headers: (0, dKY.wrapStaticHeadersInFunction)(lKY(A)),
            agentFactory: (0, cKY.httpAgentFactoryFromOptions)({
                keepAlive: !0,
                ca: tKY(A),
                cert: aKY(A),
                key: sKY(A)
            })
        }
    }
    WP4.getNodeHttpConfigurationFromEnvironment = eKY
})
// @from(Ln 284920, Col 4)
NP4 = R((fP4) => {
    Object.defineProperty(fP4, "__esModule", {
        value: !0
    });
    fP4.convertLegacyHeaders = void 0;
    var A3Y = Vm1();

    function q3Y(A) {
        if (typeof A.headers === "function") return A.headers;
        return (0, A3Y.wrapStaticHeadersInFunction)(A.headers)
    }
    fP4.convertLegacyHeaders = q3Y
})
// @from(Ln 284933, Col 4)
kP4 = R((vP4) => {
    Object.defineProperty(vP4, "__esModule", {
        value: !0
    });
    vP4.convertLegacyHttpOptions = void 0;
    var K3Y = Fq(),
        TP4 = TD6(),
        Y3Y = Yd(),
        z3Y = ZP4(),
        w3Y = NP4();

    function H3Y(A) {
        if (typeof A.httpAgentOptions === "function") return A.httpAgentOptions;
        let q = A.httpAgentOptions;
        if (A.keepAlive != null) q = {
            keepAlive: A.keepAlive,
            ...q
        };
        if (q != null) return (0, Y3Y.httpAgentFactoryFromOptions)(q);
        else return
    }

    function $3Y(A, q, K, Y) {
        if (A.metadata) K3Y.diag.warn("Metadata cannot be set when using http");
        return (0, TP4.mergeOtlpNodeHttpConfigurationWithDefaults)({
            url: A.url,
            headers: (0, w3Y.convertLegacyHeaders)(A),
            concurrencyLimit: A.concurrencyLimit,
            timeoutMillis: A.timeoutMillis,
            compression: A.compression,
            agentFactory: H3Y(A),
            userAgent: A.userAgent
        }, (0, z3Y.getNodeHttpConfigurationFromEnvironment)(q, K), (0, TP4.getNodeHttpConfigurationDefaults)(Y, K))
    }
    vP4.convertLegacyHttpOptions = $3Y
})
// @from(Ln 284969, Col 4)
Yd = R((uM1) => {
    Object.defineProperty(uM1, "__esModule", {
        value: !0
    });
    uM1.convertLegacyHttpOptions = uM1.getSharedConfigurationFromEnvironment = uM1.createOtlpHttpExportDelegate = uM1.httpAgentFactoryFromOptions = void 0;
    var O3Y = TD6();
    Object.defineProperty(uM1, "httpAgentFactoryFromOptions", {
        enumerable: !0,
        get: function() {
            return O3Y.httpAgentFactoryFromOptions
        }
    });
    var _3Y = _P4();
    Object.defineProperty(uM1, "createOtlpHttpExportDelegate", {
        enumerable: !0,
        get: function() {
            return _3Y.createOtlpHttpExportDelegate
        }
    });
    var J3Y = hZA();
    Object.defineProperty(uM1, "getSharedConfigurationFromEnvironment", {
        enumerable: !0,
        get: function() {
            return J3Y.getSharedConfigurationFromEnvironment
        }
    });
    var X3Y = kP4();
    Object.defineProperty(uM1, "convertLegacyHttpOptions", {
        enumerable: !0,
        get: function() {
            return X3Y.convertLegacyHttpOptions
        }
    })
})
// @from(Ln 285003, Col 4)
SP4 = R((yP4) => {
    Object.defineProperty(yP4, "__esModule", {
        value: !0
    });
    yP4.OTLPMetricExporter = void 0;
    var j3Y = sGA(),
        M3Y = Km(),
        LP4 = Yd();
    class RP4 extends j3Y.OTLPMetricExporterBase {
        constructor(A) {
            super((0, LP4.createOtlpHttpExportDelegate)((0, LP4.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
                "Content-Type": "application/json"
            }), M3Y.JsonMetricsSerializer), A)
        }
    }
    yP4.OTLPMetricExporter = RP4
})
// @from(Ln 285020, Col 4)
hP4 = R((xZA) => {
    Object.defineProperty(xZA, "__esModule", {
        value: !0
    });
    xZA.OTLPMetricExporter = void 0;
    var P3Y = SP4();
    Object.defineProperty(xZA, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return P3Y.OTLPMetricExporter
        }
    })
})
// @from(Ln 285033, Col 4)
IP4 = R((bZA) => {
    Object.defineProperty(bZA, "__esModule", {
        value: !0
    });
    bZA.OTLPMetricExporter = void 0;
    var G3Y = hP4();
    Object.defineProperty(bZA, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return G3Y.OTLPMetricExporter
        }
    })
})
// @from(Ln 285046, Col 4)
kD6 = R((Ns) => {
    Object.defineProperty(Ns, "__esModule", {
        value: !0
    });
    Ns.OTLPMetricExporterBase = Ns.LowMemoryTemporalitySelector = Ns.DeltaTemporalitySelector = Ns.CumulativeTemporalitySelector = Ns.AggregationTemporalityPreference = Ns.OTLPMetricExporter = void 0;
    var f3Y = IP4();
    Object.defineProperty(Ns, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return f3Y.OTLPMetricExporter
        }
    });
    var V3Y = lGA();
    Object.defineProperty(Ns, "AggregationTemporalityPreference", {
        enumerable: !0,
        get: function() {
            return V3Y.AggregationTemporalityPreference
        }
    });
    var ED6 = sGA();
    Object.defineProperty(Ns, "CumulativeTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return ED6.CumulativeTemporalitySelector
        }
    });
    Object.defineProperty(Ns, "DeltaTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return ED6.DeltaTemporalitySelector
        }
    });
    Object.defineProperty(Ns, "LowMemoryTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return ED6.LowMemoryTemporalitySelector
        }
    });
    Object.defineProperty(Ns, "OTLPMetricExporterBase", {
        enumerable: !0,
        get: function() {
            return ED6.OTLPMetricExporterBase
        }
    })
})
// @from(Ln 285091, Col 4)
mP4 = R((uP4) => {
    Object.defineProperty(uP4, "__esModule", {
        value: !0
    });
    uP4.OTLPMetricExporter = void 0;
    var T3Y = kD6(),
        v3Y = Km(),
        xP4 = Yd();
    class bP4 extends T3Y.OTLPMetricExporterBase {
        constructor(A) {
            super((0, xP4.createOtlpHttpExportDelegate)((0, xP4.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
                "Content-Type": "application/x-protobuf"
            }), v3Y.ProtobufMetricsSerializer), A)
        }
    }
    uP4.OTLPMetricExporter = bP4
})
// @from(Ln 285108, Col 4)
FP4 = R((uZA) => {
    Object.defineProperty(uZA, "__esModule", {
        value: !0
    });
    uZA.OTLPMetricExporter = void 0;
    var E3Y = mP4();
    Object.defineProperty(uZA, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return E3Y.OTLPMetricExporter
        }
    })
})
// @from(Ln 285121, Col 4)
QP4 = R((BZA) => {
    Object.defineProperty(BZA, "__esModule", {
        value: !0
    });
    BZA.OTLPMetricExporter = void 0;
    var L3Y = FP4();
    Object.defineProperty(BZA, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return L3Y.OTLPMetricExporter
        }
    })
})
// @from(Ln 285134, Col 4)
gP4 = R((mZA) => {
    Object.defineProperty(mZA, "__esModule", {
        value: !0
    });
    mZA.OTLPMetricExporter = void 0;
    var y3Y = QP4();
    Object.defineProperty(mZA, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return y3Y.OTLPMetricExporter
        }
    })
})
// @from(Ln 285147, Col 4)
dP4 = R((UP4) => {
    Object.defineProperty(UP4, "__esModule", {
        value: !0
    });
    UP4.VERSION = void 0;
    UP4.VERSION = "0.208.0"
})
// @from(Ln 285154, Col 4)
w9 = R((nP4) => {
    Object.defineProperty(nP4, "__esModule", {
        value: !0
    });
    nP4.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = nP4.DEFAULT_MAX_SEND_MESSAGE_LENGTH = nP4.Propagate = nP4.LogVerbosity = nP4.Status = void 0;
    var cP4;
    (function(A) {
        A[A.OK = 0] = "OK", A[A.CANCELLED = 1] = "CANCELLED", A[A.UNKNOWN = 2] = "UNKNOWN", A[A.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", A[A.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", A[A.NOT_FOUND = 5] = "NOT_FOUND", A[A.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", A[A.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", A[A.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", A[A.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", A[A.ABORTED = 10] = "ABORTED", A[A.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", A[A.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", A[A.INTERNAL = 13] = "INTERNAL", A[A.UNAVAILABLE = 14] = "UNAVAILABLE", A[A.DATA_LOSS = 15] = "DATA_LOSS", A[A.UNAUTHENTICATED = 16] = "UNAUTHENTICATED"
    })(cP4 || (nP4.Status = cP4 = {}));
    var lP4;
    (function(A) {
        A[A.DEBUG = 0] = "DEBUG", A[A.INFO = 1] = "INFO", A[A.ERROR = 2] = "ERROR", A[A.NONE = 3] = "NONE"
    })(lP4 || (nP4.LogVerbosity = lP4 = {}));
    var iP4;
    (function(A) {
        A[A.DEADLINE = 1] = "DEADLINE", A[A.CENSUS_STATS_CONTEXT = 2] = "CENSUS_STATS_CONTEXT", A[A.CENSUS_TRACING_CONTEXT = 4] = "CENSUS_TRACING_CONTEXT", A[A.CANCELLATION = 8] = "CANCELLATION", A[A.DEFAULTS = 65535] = "DEFAULTS"
    })(iP4 || (nP4.Propagate = iP4 = {}));
    nP4.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
    nP4.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4194304
})
// @from(Ln 285174, Col 4)
FZA = R((TBw, b3Y) => {
    b3Y.exports = {
        name: "@grpc/grpc-js",
        version: "1.14.0",
        description: "gRPC Library for Node - pure JS implementation",
        homepage: "https://grpc.io/",
        repository: "https://github.com/grpc/grpc-node/tree/master/packages/grpc-js",
        main: "build/src/index.js",
        engines: {
            node: ">=12.10.0"
        },
        keywords: [],
        author: {
            name: "Google Inc."
        },
        types: "build/src/index.d.ts",
        license: "Apache-2.0",
        devDependencies: {
            "@grpc/proto-loader": "file:../proto-loader",
            "@types/gulp": "^4.0.17",
            "@types/gulp-mocha": "0.0.37",
            "@types/lodash": "^4.14.202",
            "@types/mocha": "^10.0.6",
            "@types/ncp": "^2.0.8",
            "@types/node": ">=20.11.20",
            "@types/pify": "^5.0.4",
            "@types/semver": "^7.5.8",
            "@typescript-eslint/eslint-plugin": "^7.1.0",
            "@typescript-eslint/parser": "^7.1.0",
            "@typescript-eslint/typescript-estree": "^7.1.0",
            "clang-format": "^1.8.0",
            eslint: "^8.42.0",
            "eslint-config-prettier": "^8.8.0",
            "eslint-plugin-node": "^11.1.0",
            "eslint-plugin-prettier": "^4.2.1",
            execa: "^2.0.3",
            gulp: "^4.0.2",
            "gulp-mocha": "^6.0.0",
            lodash: "^4.17.21",
            madge: "^5.0.1",
            "mocha-jenkins-reporter": "^0.4.1",
            ncp: "^2.0.0",
            pify: "^4.0.1",
            prettier: "^2.8.8",
            rimraf: "^3.0.2",
            semver: "^7.6.0",
            "ts-node": "^10.9.2",
            typescript: "^5.3.3"
        },
        contributors: [{
            name: "Google Inc."
        }],
        scripts: {
            build: "npm run compile",
            clean: "rimraf ./build",
            compile: "tsc -p .",
            format: 'clang-format -i -style="{Language: JavaScript, BasedOnStyle: Google, ColumnLimit: 80}" src/*.ts test/*.ts',
            lint: "eslint src/*.ts test/*.ts",
            prepare: "npm run copy-protos && npm run generate-types && npm run generate-test-types && npm run compile",
            test: "gulp test",
            check: "npm run lint",
            fix: "eslint --fix src/*.ts test/*.ts",
            pretest: "npm run generate-types && npm run generate-test-types && npm run compile",
            posttest: "npm run check && madge -c ./build/src",
            "generate-types": "proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --includeComments --includeDirs proto/ --include-dirs proto/ proto/xds/ proto/protoc-gen-validate/ -O src/generated/ --grpcLib ../index channelz.proto xds/service/orca/v3/orca.proto",
            "generate-test-types": "proto-loader-gen-types --keepCase --longs String --enums String --defaults --oneofs --includeComments --include-dirs test/fixtures/ -O test/generated/ --grpcLib ../../src/index test_service.proto echo_service.proto",
            "copy-protos": "node ./copy-protos"
        },
        dependencies: {
            "@grpc/proto-loader": "^0.8.0",
            "@js-sdsl/ordered-map": "^4.4.2"
        },
        files: ["src/**/*.ts", "build/src/**/*.{js,d.ts,js.map}", "proto/**/*.proto", "proto/**/LICENSE", "LICENSE", "deps/envoy-api/envoy/api/v2/**/*.proto", "deps/envoy-api/envoy/config/**/*.proto", "deps/envoy-api/envoy/service/**/*.proto", "deps/envoy-api/envoy/type/**/*.proto", "deps/udpa/udpa/**/*.proto", "deps/googleapis/google/api/*.proto", "deps/googleapis/google/rpc/*.proto", "deps/protoc-gen-validate/validate/**/*.proto"]
    }
})
// @from(Ln 285249, Col 4)
mw = R((sP4) => {
    var QZA, gZA, UZA, pZA;
    Object.defineProperty(sP4, "__esModule", {
        value: !0
    });
    sP4.log = sP4.setLoggerVerbosity = sP4.setLogger = sP4.getLogger = void 0;
    sP4.trace = l3Y;
    sP4.isTracerEnabled = aP4;
    var Ts = w9(),
        u3Y = h1("process"),
        B3Y = FZA().version,
        m3Y = {
            error: (A, ...q) => {
                console.error("E " + A, ...q)
            },
            info: (A, ...q) => {
                console.error("I " + A, ...q)
            },
            debug: (A, ...q) => {
                console.error("D " + A, ...q)
            }
        },
        v31 = m3Y,
        BM1 = Ts.LogVerbosity.ERROR,
        F3Y = (gZA = (QZA = process.env.GRPC_NODE_VERBOSITY) !== null && QZA !== void 0 ? QZA : process.env.GRPC_VERBOSITY) !== null && gZA !== void 0 ? gZA : "";
    switch (F3Y.toUpperCase()) {
        case "DEBUG":
            BM1 = Ts.LogVerbosity.DEBUG;
            break;
        case "INFO":
            BM1 = Ts.LogVerbosity.INFO;
            break;
        case "ERROR":
            BM1 = Ts.LogVerbosity.ERROR;
            break;
        case "NONE":
            BM1 = Ts.LogVerbosity.NONE;
            break;
        default:
    }
    var Q3Y = () => {
        return v31
    };
    sP4.getLogger = Q3Y;
    var g3Y = (A) => {
        v31 = A
    };
    sP4.setLogger = g3Y;
    var U3Y = (A) => {
        BM1 = A
    };
    sP4.setLoggerVerbosity = U3Y;
    var p3Y = (A, ...q) => {
        let K;
        if (A >= BM1) {
            switch (A) {
                case Ts.LogVerbosity.DEBUG:
                    K = v31.debug;
                    break;
                case Ts.LogVerbosity.INFO:
                    K = v31.info;
                    break;
                case Ts.LogVerbosity.ERROR:
                    K = v31.error;
                    break
            }
            if (!K) K = v31.error;
            if (K) K.bind(v31)(...q)
        }
    };
    sP4.log = p3Y;
    var d3Y = (pZA = (UZA = process.env.GRPC_NODE_TRACE) !== null && UZA !== void 0 ? UZA : process.env.GRPC_TRACE) !== null && pZA !== void 0 ? pZA : "",
        dZA = new Set,
        oP4 = new Set;
    for (let A of d3Y.split(","))
        if (A.startsWith("-")) oP4.add(A.substring(1));
        else dZA.add(A);
    var c3Y = dZA.has("all");

    function l3Y(A, q, K) {
        if (aP4(q)) sP4.log(A, new Date().toISOString() + " | v" + B3Y + " " + u3Y.pid + " | " + q + " | " + K)
    }

    function aP4(A) {
        return !oP4.has(A) && (c3Y || dZA.has(A))
    }
})
// @from(Ln 285336, Col 4)
LD6 = R((tP4) => {
    Object.defineProperty(tP4, "__esModule", {
        value: !0
    });
    tP4.getErrorMessage = s3Y;
    tP4.getErrorCode = t3Y;

    function s3Y(A) {
        if (A instanceof Error) return A.message;
        else return String(A)
    }

    function t3Y(A) {
        if (typeof A === "object" && A !== null && "code" in A && typeof A.code === "number") return A.code;
        else return null
    }
})
// @from(Ln 285353, Col 4)
Jj = R((qW4) => {
    Object.defineProperty(qW4, "__esModule", {
        value: !0
    });
    qW4.Metadata = void 0;
    var q5Y = mw(),
        K5Y = w9(),
        Y5Y = LD6(),
        z5Y = /^[:0-9a-z_.-]+$/,
        w5Y = /^[ -~]*$/;

    function H5Y(A) {
        return z5Y.test(A)
    }

    function $5Y(A) {
        return w5Y.test(A)
    }

    function AW4(A) {
        return A.endsWith("-bin")
    }

    function O5Y(A) {
        return !A.startsWith("grpc-")
    }

    function RD6(A) {
        return A.toLowerCase()
    }

    function eP4(A, q) {
        if (!H5Y(A)) throw Error('Metadata key "' + A + '" contains illegal characters');
        if (q !== null && q !== void 0)
            if (AW4(A)) {
                if (!Buffer.isBuffer(q)) throw Error("keys that end with '-bin' must have Buffer values")
            } else {
                if (Buffer.isBuffer(q)) throw Error("keys that don't end with '-bin' must have String values");
                if (!$5Y(q)) throw Error('Metadata string value "' + q + '" contains illegal characters')
            }
    }
    class yD6 {
        constructor(A = {}) {
            this.internalRepr = new Map, this.opaqueData = new Map, this.options = A
        }
        set(A, q) {
            A = RD6(A), eP4(A, q), this.internalRepr.set(A, [q])
        }
        add(A, q) {
            A = RD6(A), eP4(A, q);
            let K = this.internalRepr.get(A);
            if (K === void 0) this.internalRepr.set(A, [q]);
            else K.push(q)
        }
        remove(A) {
            A = RD6(A), this.internalRepr.delete(A)
        }
        get(A) {
            return A = RD6(A), this.internalRepr.get(A) || []
        }
        getMap() {
            let A = {};
            for (let [q, K] of this.internalRepr)
                if (K.length > 0) {
                    let Y = K[0];
                    A[q] = Buffer.isBuffer(Y) ? Buffer.from(Y) : Y
                } return A
        }
        clone() {
            let A = new yD6(this.options),
                q = A.internalRepr;
            for (let [K, Y] of this.internalRepr) {
                let z = Y.map((w) => {
                    if (Buffer.isBuffer(w)) return Buffer.from(w);
                    else return w
                });
                q.set(K, z)
            }
            return A
        }
        merge(A) {
            for (let [q, K] of A.internalRepr) {
                let Y = (this.internalRepr.get(q) || []).concat(K);
                this.internalRepr.set(q, Y)
            }
        }
        setOptions(A) {
            this.options = A
        }
        getOptions() {
            return this.options
        }
        toHttp2Headers() {
            let A = {};
            for (let [q, K] of this.internalRepr) {
                if (q.startsWith(":")) continue;
                A[q] = K.map(_5Y)
            }
            return A
        }
        toJSON() {
            let A = {};
            for (let [q, K] of this.internalRepr) A[q] = K;
            return A
        }
        setOpaque(A, q) {
            this.opaqueData.set(A, q)
        }
        getOpaque(A) {
            return this.opaqueData.get(A)
        }
        static fromHttp2Headers(A) {
            let q = new yD6;
            for (let K of Object.keys(A)) {
                if (K.charAt(0) === ":") continue;
                let Y = A[K];
                try {
                    if (AW4(K)) {
                        if (Array.isArray(Y)) Y.forEach((z) => {
                            q.add(K, Buffer.from(z, "base64"))
                        });
                        else if (Y !== void 0)
                            if (O5Y(K)) Y.split(",").forEach((z) => {
                                q.add(K, Buffer.from(z.trim(), "base64"))
                            });
                            else q.add(K, Buffer.from(Y, "base64"))
                    } else if (Array.isArray(Y)) Y.forEach((z) => {
                        q.add(K, z)
                    });
                    else if (Y !== void 0) q.add(K, Y)
                } catch (z) {
                    let w = `Failed to add metadata entry ${K}: ${Y}. ${(0,Y5Y.getErrorMessage)(z)}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
                    (0, q5Y.log)(K5Y.LogVerbosity.ERROR, w)
                }
            }
            return q
        }
    }
    qW4.Metadata = yD6;
    var _5Y = (A) => {
        return Buffer.isBuffer(A) ? A.toString("base64") : A
    }
})
// @from(Ln 285496, Col 4)
SD6 = R((YW4) => {
    Object.defineProperty(YW4, "__esModule", {
        value: !0
    });
    YW4.CallCredentials = void 0;
    var lZA = Jj();

    function J5Y(A) {
        return "getRequestHeaders" in A && typeof A.getRequestHeaders === "function"
    }
    class mM1 {
        static createFromMetadataGenerator(A) {
            return new iZA(A)
        }
        static createFromGoogleCredential(A) {
            return mM1.createFromMetadataGenerator((q, K) => {
                let Y;
                if (J5Y(A)) Y = A.getRequestHeaders(q.service_url);
                else Y = new Promise((z, w) => {
                    A.getRequestMetadata(q.service_url, (H, $) => {
                        if (H) {
                            w(H);
                            return
                        }
                        if (!$) {
                            w(Error("Headers not set by metadata plugin"));
                            return
                        }
                        z($)
                    })
                });
                Y.then((z) => {
                    let w = new lZA.Metadata;
                    for (let H of Object.keys(z)) w.add(H, z[H]);
                    K(null, w)
                }, (z) => {
                    K(z)
                })
            })
        }
        static createEmpty() {
            return new nZA
        }
    }
    YW4.CallCredentials = mM1;
    class CD6 extends mM1 {
        constructor(A) {
            super();
            this.creds = A
        }
        async generateMetadata(A) {
            let q = new lZA.Metadata,
                K = await Promise.all(this.creds.map((Y) => Y.generateMetadata(A)));
            for (let Y of K) q.merge(Y);
            return q
        }
        compose(A) {
            return new CD6(this.creds.concat([A]))
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof CD6) return this.creds.every((q, K) => q._equals(A.creds[K]));
            else return !1
        }
    }
    class iZA extends mM1 {
        constructor(A) {
            super();
            this.metadataGenerator = A
        }
        generateMetadata(A) {
            return new Promise((q, K) => {
                this.metadataGenerator(A, (Y, z) => {
                    if (z !== void 0) q(z);
                    else K(Y)
                })
            })
        }
        compose(A) {
            return new CD6([this, A])
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof iZA) return this.metadataGenerator === A.metadataGenerator;
            else return !1
        }
    }
    class nZA extends mM1 {
        generateMetadata(A) {
            return Promise.resolve(new lZA.Metadata)
        }
        compose(A) {
            return A
        }
        _equals(A) {
            return A instanceof nZA
        }
    }
})
// @from(Ln 285595, Col 4)
oZA = R((HW4) => {
    Object.defineProperty(HW4, "__esModule", {
        value: !0
    });
    HW4.CIPHER_SUITES = void 0;
    HW4.getDefaultRootsData = D5Y;
    var X5Y = h1("fs");
    HW4.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
    var wW4 = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH,
        rZA = null;

    function D5Y() {
        if (wW4) {
            if (rZA === null) rZA = X5Y.readFileSync(wW4);
            return rZA
        }
        return null
    }
})
// @from(Ln 285614, Col 4)
mZ = R((_W4) => {
    Object.defineProperty(_W4, "__esModule", {
        value: !0
    });
    _W4.parseUri = P5Y;
    _W4.splitHostPort = W5Y;
    _W4.combineHostPort = G5Y;
    _W4.uriToString = Z5Y;
    var M5Y = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;

    function P5Y(A) {
        let q = M5Y.exec(A);
        if (q === null) return null;
        return {
            scheme: q[1],
            authority: q[2],
            path: q[3]
        }
    }
    var OW4 = /^\d+$/;

    function W5Y(A) {
        if (A.startsWith("[")) {
            let q = A.indexOf("]");
            if (q === -1) return null;
            let K = A.substring(1, q);
            if (K.indexOf(":") === -1) return null;
            if (A.length > q + 1)
                if (A[q + 1] === ":") {
                    let Y = A.substring(q + 2);
                    if (OW4.test(Y)) return {
                        host: K,
                        port: +Y
                    };
                    else return null
                } else return null;
            else return {
                host: K
            }
        } else {
            let q = A.split(":");
            if (q.length === 2)
                if (OW4.test(q[1])) return {
                    host: q[0],
                    port: +q[1]
                };
                else return null;
            else return {
                host: A
            }
        }
    }

    function G5Y(A) {
        if (A.port === void 0) return A.host;
        else if (A.host.includes(":")) return `[${A.host}]:${A.port}`;
        else return `${A.host}:${A.port}`
    }

    function Z5Y(A) {
        let q = "";
        if (A.scheme !== void 0) q += A.scheme + ":";
        if (A.authority !== void 0) q += "//" + A.authority + "/";
        return q += A.path, q
    }
})
// @from(Ln 285680, Col 4)
lh = R((JW4) => {
    Object.defineProperty(JW4, "__esModule", {
        value: !0
    });
    JW4.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = void 0;
    JW4.registerResolver = v5Y;
    JW4.registerDefaultScheme = E5Y;
    JW4.createResolver = k5Y;
    JW4.getDefaultAuthority = L5Y;
    JW4.mapUriDefaultScheme = R5Y;
    var sZA = mZ();
    JW4.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = "grpc.internal.config_selector";
    var FM1 = {},
        aZA = null;

    function v5Y(A, q) {
        FM1[A] = q
    }

    function E5Y(A) {
        aZA = A
    }

    function k5Y(A, q, K) {
        if (A.scheme !== void 0 && A.scheme in FM1) return new FM1[A.scheme](A, q, K);
        else throw Error(`No resolver could be created for target ${(0,sZA.uriToString)(A)}`)
    }

    function L5Y(A) {
        if (A.scheme !== void 0 && A.scheme in FM1) return FM1[A.scheme].getDefaultAuthority(A);
        else throw Error(`Invalid target ${(0,sZA.uriToString)(A)}`)
    }

    function R5Y(A) {
        if (A.scheme === void 0 || !(A.scheme in FM1))
            if (aZA !== null) return {
                scheme: aZA,
                authority: void 0,
                path: (0, sZA.uriToString)(A)
            };
            else return null;
        return A
    }
})
// @from(Ln 285724, Col 4)
gM1 = R((PW4) => {
    Object.defineProperty(PW4, "__esModule", {
        value: !0
    });
    PW4.ChannelCredentials = void 0;
    PW4.createCertificateProviderChannelCredentials = B5Y;
    var ym1 = h1("tls"),
        xD6 = SD6(),
        eZA = oZA(),
        DW4 = mZ(),
        x5Y = lh(),
        b5Y = mw(),
        u5Y = w9();

    function tZA(A, q) {
        if (A && !(A instanceof Buffer)) throw TypeError(`${q}, if provided, must be a Buffer.`)
    }
    class QM1 {
        compose(A) {
            return new ID6(this, A)
        }
        static createSsl(A, q, K, Y) {
            var z;
            if (tZA(A, "Root certificate"), tZA(q, "Private key"), tZA(K, "Certificate chain"), q && !K) throw Error("Private key must be given with accompanying certificate chain");
            if (!q && K) throw Error("Certificate chain must be given with accompanying private key");
            let w = (0, ym1.createSecureContext)({
                ca: (z = A !== null && A !== void 0 ? A : (0, eZA.getDefaultRootsData)()) !== null && z !== void 0 ? z : void 0,
                key: q !== null && q !== void 0 ? q : void 0,
                cert: K !== null && K !== void 0 ? K : void 0,
                ciphers: eZA.CIPHER_SUITES
            });
            return new hD6(w, Y !== null && Y !== void 0 ? Y : {})
        }
        static createFromSecureContext(A, q) {
            return new hD6(A, q !== null && q !== void 0 ? q : {})
        }
        static createInsecure() {
            return new AfA
        }
    }
    PW4.ChannelCredentials = QM1;
    class AfA extends QM1 {
        constructor() {
            super()
        }
        compose(A) {
            throw Error("Cannot compose insecure credentials")
        }
        _isSecure() {
            return !1
        }
        _equals(A) {
            return A instanceof AfA
        }
        _createSecureConnector(A, q, K) {
            return {
                connect(Y) {
                    return Promise.resolve({
                        socket: Y,
                        secure: !1
                    })
                },
                waitForReady: () => {
                    return Promise.resolve()
                },
                getCallCredentials: () => {
                    return K !== null && K !== void 0 ? K : xD6.CallCredentials.createEmpty()
                },
                destroy() {}
            }
        }
    }

    function jW4(A, q, K, Y) {
        var z, w;
        let H = {
                secureContext: A
            },
            $ = K;
        if ("grpc.http_connect_target" in Y) {
            let X = (0, DW4.parseUri)(Y["grpc.http_connect_target"]);
            if (X) $ = X
        }
        let O = (0, x5Y.getDefaultAuthority)($),
            _ = (0, DW4.splitHostPort)(O),
            J = (z = _ === null || _ === void 0 ? void 0 : _.host) !== null && z !== void 0 ? z : O;
        if (H.host = J, q.checkServerIdentity) H.checkServerIdentity = q.checkServerIdentity;
        if (q.rejectUnauthorized !== void 0) H.rejectUnauthorized = q.rejectUnauthorized;
        if (H.ALPNProtocols = ["h2"], Y["grpc.ssl_target_name_override"]) {
            let X = Y["grpc.ssl_target_name_override"],
                D = (w = H.checkServerIdentity) !== null && w !== void 0 ? w : ym1.checkServerIdentity;
            H.checkServerIdentity = (j, M) => {
                return D(X, M)
            }, H.servername = X
        } else H.servername = J;
        if (Y["grpc-node.tls_enable_trace"]) H.enableTrace = !0;
        return H
    }
    class MW4 {
        constructor(A, q) {
            this.connectionOptions = A, this.callCredentials = q
        }
        connect(A) {
            let q = Object.assign({
                socket: A
            }, this.connectionOptions);
            return new Promise((K, Y) => {
                let z = (0, ym1.connect)(q, () => {
                    var w;
                    if (((w = this.connectionOptions.rejectUnauthorized) !== null && w !== void 0 ? w : !0) && !z.authorized) {
                        Y(z.authorizationError);
                        return
                    }
                    K({
                        socket: z,
                        secure: !0
                    })
                });
                z.on("error", (w) => {
                    Y(w)
                })
            })
        }
        waitForReady() {
            return Promise.resolve()
        }
        getCallCredentials() {
            return this.callCredentials
        }
        destroy() {}
    }
    class hD6 extends QM1 {
        constructor(A, q) {
            super();
            this.secureContext = A, this.verifyOptions = q
        }
        _isSecure() {
            return !0
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof hD6) return this.secureContext === A.secureContext && this.verifyOptions.checkServerIdentity === A.verifyOptions.checkServerIdentity;
            else return !1
        }
        _createSecureConnector(A, q, K) {
            let Y = jW4(this.secureContext, this.verifyOptions, A, q);
            return new MW4(Y, K !== null && K !== void 0 ? K : xD6.CallCredentials.createEmpty())
        }
    }
    class Rm1 extends QM1 {
        constructor(A, q, K) {
            super();
            this.caCertificateProvider = A, this.identityCertificateProvider = q, this.verifyOptions = K, this.refcount = 0, this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this), this.secureContextWatchers = []
        }
        _isSecure() {
            return !0
        }
        _equals(A) {
            var q, K;
            if (this === A) return !0;
            if (A instanceof Rm1) return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && ((q = this.verifyOptions) === null || q === void 0 ? void 0 : q.checkServerIdentity) === ((K = A.verifyOptions) === null || K === void 0 ? void 0 : K.checkServerIdentity);
            else return !1
        }
        ref() {
            var A;
            if (this.refcount === 0) this.caCertificateProvider.addCaCertificateListener(this.caCertificateUpdateListener), (A = this.identityCertificateProvider) === null || A === void 0 || A.addIdentityCertificateListener(this.identityCertificateUpdateListener);
            this.refcount += 1
        }
        unref() {
            var A;
            if (this.refcount -= 1, this.refcount === 0) this.caCertificateProvider.removeCaCertificateListener(this.caCertificateUpdateListener), (A = this.identityCertificateProvider) === null || A === void 0 || A.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
        }
        _createSecureConnector(A, q, K) {
            return this.ref(), new Rm1.SecureConnectorImpl(this, A, q, K !== null && K !== void 0 ? K : xD6.CallCredentials.createEmpty())
        }
        maybeUpdateWatchers() {
            if (this.hasReceivedUpdates()) {
                for (let A of this.secureContextWatchers) A(this.getLatestSecureContext());
                this.secureContextWatchers = []
            }
        }
        handleCaCertificateUpdate(A) {
            this.latestCaUpdate = A, this.maybeUpdateWatchers()
        }
        handleIdentityCertitificateUpdate(A) {
            this.latestIdentityUpdate = A, this.maybeUpdateWatchers()
        }
        hasReceivedUpdates() {
            if (this.latestCaUpdate === void 0) return !1;
            if (this.identityCertificateProvider && this.latestIdentityUpdate === void 0) return !1;
            return !0
        }
        getSecureContext() {
            if (this.hasReceivedUpdates()) return Promise.resolve(this.getLatestSecureContext());
            else return new Promise((A) => {
                this.secureContextWatchers.push(A)
            })
        }
        getLatestSecureContext() {
            var A, q;
            if (!this.latestCaUpdate) return null;
            if (this.identityCertificateProvider !== null && !this.latestIdentityUpdate) return null;
            try {
                return (0, ym1.createSecureContext)({
                    ca: this.latestCaUpdate.caCertificate,
                    key: (A = this.latestIdentityUpdate) === null || A === void 0 ? void 0 : A.privateKey,
                    cert: (q = this.latestIdentityUpdate) === null || q === void 0 ? void 0 : q.certificate,
                    ciphers: eZA.CIPHER_SUITES
                })
            } catch (K) {
                return (0, b5Y.log)(u5Y.LogVerbosity.ERROR, "Failed to createSecureContext with error " + K.message), null
            }
        }
    }
    Rm1.SecureConnectorImpl = class {
        constructor(A, q, K, Y) {
            this.parent = A, this.channelTarget = q, this.options = K, this.callCredentials = Y
        }
        connect(A) {
            return new Promise((q, K) => {
                let Y = this.parent.getLatestSecureContext();
                if (!Y) {
                    K(Error("Failed to load credentials"));
                    return
                }
                if (A.closed) K(Error("Socket closed while loading credentials"));
                let z = jW4(Y, this.parent.verifyOptions, this.channelTarget, this.options),
                    w = Object.assign({
                        socket: A
                    }, z),
                    H = () => {
                        K(Error("Socket closed"))
                    },
                    $ = (_) => {
                        K(_)
                    },
                    O = (0, ym1.connect)(w, () => {
                        var _;
                        if (O.removeListener("close", H), O.removeListener("error", $), ((_ = this.parent.verifyOptions.rejectUnauthorized) !== null && _ !== void 0 ? _ : !0) && !O.authorized) {
                            K(O.authorizationError);
                            return
                        }
                        q({
                            socket: O,
                            secure: !0
                        })
                    });
                O.once("close", H), O.once("error", $)
            })
        }
        async waitForReady() {
            await this.parent.getSecureContext()
        }
        getCallCredentials() {
            return this.callCredentials
        }
        destroy() {
            this.parent.unref()
        }
    };

    function B5Y(A, q, K) {
        return new Rm1(A, q, K !== null && K !== void 0 ? K : {})
    }
    class ID6 extends QM1 {
        constructor(A, q) {
            super();
            if (this.channelCredentials = A, this.callCredentials = q, !A._isSecure()) throw Error("Cannot compose insecure credentials")
        }
        compose(A) {
            let q = this.callCredentials.compose(A);
            return new ID6(this.channelCredentials, q)
        }
        _isSecure() {
            return !0
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof ID6) return this.channelCredentials._equals(A.channelCredentials) && this.callCredentials._equals(A.callCredentials);
            else return !1
        }
        _createSecureConnector(A, q, K) {
            let Y = this.callCredentials.compose(K !== null && K !== void 0 ? K : xD6.CallCredentials.createEmpty());
            return this.channelCredentials._createSecureConnector(A, q, Y)
        }
    }
})
// @from(Ln 286011, Col 4)
Es = R((ZW4) => {
    Object.defineProperty(ZW4, "__esModule", {
        value: !0
    });
    ZW4.createChildChannelControlHelper = g5Y;
    ZW4.registerLoadBalancerType = U5Y;
    ZW4.registerDefaultLoadBalancerType = p5Y;
    ZW4.createLoadBalancer = d5Y;
    ZW4.isLoadBalancerNameRegistered = c5Y;
    ZW4.parseLoadBalancingConfig = GW4;
    ZW4.getDefaultConfig = l5Y;
    ZW4.selectLbConfigFromList = i5Y;
    var F5Y = mw(),
        Q5Y = w9();

    function g5Y(A, q) {
        var K, Y, z, w, H, $, O, _, J, X;
        return {
            createSubchannel: (Y = (K = q.createSubchannel) === null || K === void 0 ? void 0 : K.bind(q)) !== null && Y !== void 0 ? Y : A.createSubchannel.bind(A),
            updateState: (w = (z = q.updateState) === null || z === void 0 ? void 0 : z.bind(q)) !== null && w !== void 0 ? w : A.updateState.bind(A),
            requestReresolution: ($ = (H = q.requestReresolution) === null || H === void 0 ? void 0 : H.bind(q)) !== null && $ !== void 0 ? $ : A.requestReresolution.bind(A),
            addChannelzChild: (_ = (O = q.addChannelzChild) === null || O === void 0 ? void 0 : O.bind(q)) !== null && _ !== void 0 ? _ : A.addChannelzChild.bind(A),
            removeChannelzChild: (X = (J = q.removeChannelzChild) === null || J === void 0 ? void 0 : J.bind(q)) !== null && X !== void 0 ? X : A.removeChannelzChild.bind(A)
        }
    }
    var vs = {},
        Cm1 = null;

    function U5Y(A, q, K) {
        vs[A] = {
            LoadBalancer: q,
            LoadBalancingConfig: K
        }
    }

    function p5Y(A) {
        Cm1 = A
    }

    function d5Y(A, q) {
        let K = A.getLoadBalancerName();
        if (K in vs) return new vs[K].LoadBalancer(q);
        else return null
    }

    function c5Y(A) {
        return A in vs
    }

    function GW4(A) {
        let q = Object.keys(A);
        if (q.length !== 1) throw Error("Provided load balancing config has multiple conflicting entries");
        let K = q[0];
        if (K in vs) try {
            return vs[K].LoadBalancingConfig.createFromJson(A[K])
        } catch (Y) {
            throw Error(`${K}: ${Y.message}`)
        } else throw Error(`Unrecognized load balancing config name ${K}`)
    }

    function l5Y() {
        if (!Cm1) throw Error("No default load balancer type registered");
        return new vs[Cm1].LoadBalancingConfig
    }

    function i5Y(A, q = !1) {
        for (let K of A) try {
            return GW4(K)
        } catch (Y) {
            (0, F5Y.log)(Q5Y.LogVerbosity.DEBUG, "Config parsing failed with error", Y.message);
            continue
        }
        if (q)
            if (Cm1) return new vs[Cm1].LoadBalancingConfig;
            else return null;
        else return null
    }
})
// @from(Ln 286089, Col 4)
qfA = R((NW4) => {
    Object.defineProperty(NW4, "__esModule", {
        value: !0
    });
    NW4.validateRetryThrottling = fW4;
    NW4.validateServiceConfig = VW4;
    NW4.extractAndSelectServiceConfig = J9Y;
    var q9Y = h1("os"),
        bD6 = w9(),
        uD6 = /^\d+(\.\d{1,9})?s$/,
        K9Y = "node";

    function Y9Y(A) {
        if ("service" in A && A.service !== "") {
            if (typeof A.service !== "string") throw Error(`Invalid method config name: invalid service: expected type string, got ${typeof A.service}`);
            if ("method" in A && A.method !== "") {
                if (typeof A.method !== "string") throw Error(`Invalid method config name: invalid method: expected type string, got ${typeof A.service}`);
                return {
                    service: A.service,
                    method: A.method
                }
            } else return {
                service: A.service
            }
        } else {
            if ("method" in A && A.method !== void 0) throw Error("Invalid method config name: method set with empty or unset service");
            return {}
        }
    }

    function z9Y(A) {
        if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config retry policy: maxAttempts must be an integer at least 2");
        if (!("initialBackoff" in A) || typeof A.initialBackoff !== "string" || !uD6.test(A.initialBackoff)) throw Error("Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s");
        if (!("maxBackoff" in A) || typeof A.maxBackoff !== "string" || !uD6.test(A.maxBackoff)) throw Error("Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s");
        if (!("backoffMultiplier" in A) || typeof A.backoffMultiplier !== "number" || A.backoffMultiplier <= 0) throw Error("Invalid method config retry policy: backoffMultiplier must be a number greater than 0");
        if (!(("retryableStatusCodes" in A) && Array.isArray(A.retryableStatusCodes))) throw Error("Invalid method config retry policy: retryableStatusCodes is required");
        if (A.retryableStatusCodes.length === 0) throw Error("Invalid method config retry policy: retryableStatusCodes must be non-empty");
        for (let q of A.retryableStatusCodes)
            if (typeof q === "number") {
                if (!Object.values(bD6.Status).includes(q)) throw Error("Invalid method config retry policy: retryableStatusCodes value not in status code range")
            } else if (typeof q === "string") {
            if (!Object.values(bD6.Status).includes(q.toUpperCase())) throw Error("Invalid method config retry policy: retryableStatusCodes value not a status code name")
        } else throw Error("Invalid method config retry policy: retryableStatusCodes value must be a string or number");
        return {
            maxAttempts: A.maxAttempts,
            initialBackoff: A.initialBackoff,
            maxBackoff: A.maxBackoff,
            backoffMultiplier: A.backoffMultiplier,
            retryableStatusCodes: A.retryableStatusCodes
        }
    }

    function w9Y(A) {
        if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config hedging policy: maxAttempts must be an integer at least 2");
        if ("hedgingDelay" in A && (typeof A.hedgingDelay !== "string" || !uD6.test(A.hedgingDelay))) throw Error("Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s");
        if ("nonFatalStatusCodes" in A && Array.isArray(A.nonFatalStatusCodes))
            for (let K of A.nonFatalStatusCodes)
                if (typeof K === "number") {
                    if (!Object.values(bD6.Status).includes(K)) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not in status code range")
                } else if (typeof K === "string") {
            if (!Object.values(bD6.Status).includes(K.toUpperCase())) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not a status code name")
        } else throw Error("Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number");
        let q = {
            maxAttempts: A.maxAttempts
        };
        if (A.hedgingDelay) q.hedgingDelay = A.hedgingDelay;
        if (A.nonFatalStatusCodes) q.nonFatalStatusCodes = A.nonFatalStatusCodes;
        return q
    }

    function H9Y(A) {
        var q;
        let K = {
            name: []
        };
        if (!("name" in A) || !Array.isArray(A.name)) throw Error("Invalid method config: invalid name array");
        for (let Y of A.name) K.name.push(Y9Y(Y));
        if ("waitForReady" in A) {
            if (typeof A.waitForReady !== "boolean") throw Error("Invalid method config: invalid waitForReady");
            K.waitForReady = A.waitForReady
        }
        if ("timeout" in A)
            if (typeof A.timeout === "object") {
                if (!("seconds" in A.timeout) || typeof A.timeout.seconds !== "number") throw Error("Invalid method config: invalid timeout.seconds");
                if (!("nanos" in A.timeout) || typeof A.timeout.nanos !== "number") throw Error("Invalid method config: invalid timeout.nanos");
                K.timeout = A.timeout
            } else if (typeof A.timeout === "string" && uD6.test(A.timeout)) {
            let Y = A.timeout.substring(0, A.timeout.length - 1).split(".");
            K.timeout = {
                seconds: Y[0] | 0,
                nanos: ((q = Y[1]) !== null && q !== void 0 ? q : 0) | 0
            }
        } else throw Error("Invalid method config: invalid timeout");
        if ("maxRequestBytes" in A) {
            if (typeof A.maxRequestBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
            K.maxRequestBytes = A.maxRequestBytes
        }
        if ("maxResponseBytes" in A) {
            if (typeof A.maxResponseBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
            K.maxResponseBytes = A.maxResponseBytes
        }
        if ("retryPolicy" in A)
            if ("hedgingPolicy" in A) throw Error("Invalid method config: retryPolicy and hedgingPolicy cannot both be specified");
            else K.retryPolicy = z9Y(A.retryPolicy);
        else if ("hedgingPolicy" in A) K.hedgingPolicy = w9Y(A.hedgingPolicy);
        return K
    }

    function fW4(A) {
        if (!("maxTokens" in A) || typeof A.maxTokens !== "number" || A.maxTokens <= 0 || A.maxTokens > 1000) throw Error("Invalid retryThrottling: maxTokens must be a number in (0, 1000]");
        if (!("tokenRatio" in A) || typeof A.tokenRatio !== "number" || A.tokenRatio <= 0) throw Error("Invalid retryThrottling: tokenRatio must be a number greater than 0");
        return {
            maxTokens: +A.maxTokens.toFixed(3),
            tokenRatio: +A.tokenRatio.toFixed(3)
        }
    }

    function $9Y(A) {
        if (!(typeof A === "object" && A !== null)) throw Error(`Invalid loadBalancingConfig: unexpected type ${typeof A}`);
        let q = Object.keys(A);
        if (q.length > 1) throw Error(`Invalid loadBalancingConfig: unexpected multiple keys ${q}`);
        if (q.length === 0) throw Error("Invalid loadBalancingConfig: load balancing policy name required");
        return {
            [q[0]]: A[q[0]]
        }
    }

    function VW4(A) {
        let q = {
            loadBalancingConfig: [],
            methodConfig: []
        };
        if ("loadBalancingPolicy" in A)
            if (typeof A.loadBalancingPolicy === "string") q.loadBalancingPolicy = A.loadBalancingPolicy;
            else throw Error("Invalid service config: invalid loadBalancingPolicy");
        if ("loadBalancingConfig" in A)
            if (Array.isArray(A.loadBalancingConfig))
                for (let Y of A.loadBalancingConfig) q.loadBalancingConfig.push($9Y(Y));
            else throw Error("Invalid service config: invalid loadBalancingConfig");
        if ("methodConfig" in A) {
            if (Array.isArray(A.methodConfig))
                for (let Y of A.methodConfig) q.methodConfig.push(H9Y(Y))
        }
        if ("retryThrottling" in A) q.retryThrottling = fW4(A.retryThrottling);
        let K = [];
        for (let Y of q.methodConfig)
            for (let z of Y.name) {
                for (let w of K)
                    if (z.service === w.service && z.method === w.method) throw Error(`Invalid service config: duplicate name ${z.service}/${z.method}`);
                K.push(z)
            }
        return q
    }

    function O9Y(A) {
        if (!("serviceConfig" in A)) throw Error("Invalid service config choice: missing service config");
        let q = {
            serviceConfig: VW4(A.serviceConfig)
        };
        if ("clientLanguage" in A)
            if (Array.isArray(A.clientLanguage)) {
                q.clientLanguage = [];
                for (let Y of A.clientLanguage)
                    if (typeof Y === "string") q.clientLanguage.push(Y);
                    else throw Error("Invalid service config choice: invalid clientLanguage")
            } else throw Error("Invalid service config choice: invalid clientLanguage");
        if ("clientHostname" in A)
            if (Array.isArray(A.clientHostname)) {
                q.clientHostname = [];
                for (let Y of A.clientHostname)
                    if (typeof Y === "string") q.clientHostname.push(Y);
                    else throw Error("Invalid service config choice: invalid clientHostname")
            } else throw Error("Invalid service config choice: invalid clientHostname");
        if ("percentage" in A)
            if (typeof A.percentage === "number" && 0 <= A.percentage && A.percentage <= 100) q.percentage = A.percentage;
            else throw Error("Invalid service config choice: invalid percentage");
        let K = ["clientLanguage", "percentage", "clientHostname", "serviceConfig"];
        for (let Y in A)
            if (!K.includes(Y)) throw Error(`Invalid service config choice: unexpected field ${Y}`);
        return q
    }

    function _9Y(A, q) {
        if (!Array.isArray(A)) throw Error("Invalid service config list");
        for (let K of A) {
            let Y = O9Y(K);
            if (typeof Y.percentage === "number" && q > Y.percentage) continue;
            if (Array.isArray(Y.clientHostname)) {
                let z = !1;
                for (let w of Y.clientHostname)
                    if (w === q9Y.hostname()) z = !0;
                if (!z) continue
            }
            if (Array.isArray(Y.clientLanguage)) {
                let z = !1;
                for (let w of Y.clientLanguage)
                    if (w === K9Y) z = !0;
                if (!z) continue
            }
            return Y.serviceConfig
        }
        throw Error("No matching service config found")
    }

    function J9Y(A, q) {
        for (let K of A)
            if (K.length > 0 && K[0].startsWith("grpc_config=")) {
                let Y = K.join("").substring(12),
                    z = JSON.parse(Y);
                return _9Y(z, q)
            } return null
    }
})
// @from(Ln 286302, Col 4)
FZ = R((vW4) => {
    Object.defineProperty(vW4, "__esModule", {
        value: !0
    });
    vW4.ConnectivityState = void 0;
    var TW4;
    (function(A) {
        A[A.IDLE = 0] = "IDLE", A[A.CONNECTING = 1] = "CONNECTING", A[A.READY = 2] = "READY", A[A.TRANSIENT_FAILURE = 3] = "TRANSIENT_FAILURE", A[A.SHUTDOWN = 4] = "SHUTDOWN"
    })(TW4 || (vW4.ConnectivityState = TW4 = {}))
})
// @from(Ln 286312, Col 4)
zd = R((RW4) => {
    Object.defineProperty(RW4, "__esModule", {
        value: !0
    });
    RW4.QueuePicker = RW4.UnavailablePicker = RW4.PickResultType = void 0;
    var M9Y = Jj(),
        P9Y = w9(),
        BD6;
    (function(A) {
        A[A.COMPLETE = 0] = "COMPLETE", A[A.QUEUE = 1] = "QUEUE", A[A.TRANSIENT_FAILURE = 2] = "TRANSIENT_FAILURE", A[A.DROP = 3] = "DROP"
    })(BD6 || (RW4.PickResultType = BD6 = {}));
    class kW4 {
        constructor(A) {
            this.status = Object.assign({
                code: P9Y.Status.UNAVAILABLE,
                details: "No connection established",
                metadata: new M9Y.Metadata
            }, A)
        }
        pick(A) {
            return {
                pickResultType: BD6.TRANSIENT_FAILURE,
                subchannel: null,
                status: this.status,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    RW4.UnavailablePicker = kW4;
    class LW4 {
        constructor(A, q) {
            this.loadBalancer = A, this.childPicker = q, this.calledExitIdle = !1
        }
        pick(A) {
            if (!this.calledExitIdle) process.nextTick(() => {
                this.loadBalancer.exitIdle()
            }), this.calledExitIdle = !0;
            if (this.childPicker) return this.childPicker.pick(A);
            else return {
                pickResultType: BD6.QUEUE,
                subchannel: null,
                status: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    RW4.QueuePicker = LW4
})
// @from(Ln 286362, Col 4)
UM1 = R((CW4) => {
    Object.defineProperty(CW4, "__esModule", {
        value: !0
    });
    CW4.BackoffTimeout = void 0;
    var Z9Y = w9(),
        f9Y = mw(),
        V9Y = "backoff",
        N9Y = 1000,
        T9Y = 1.6,
        v9Y = 120000,
        E9Y = 0.2;

    function k9Y(A, q) {
        return Math.random() * (q - A) + A
    }
    class mD6 {
        constructor(A, q) {
            if (this.callback = A, this.initialDelay = N9Y, this.multiplier = T9Y, this.maxDelay = v9Y, this.jitter = E9Y, this.running = !1, this.hasRef = !0, this.startTime = new Date, this.endTime = new Date, this.id = mD6.getNextId(), q) {
                if (q.initialDelay) this.initialDelay = q.initialDelay;
                if (q.multiplier) this.multiplier = q.multiplier;
                if (q.jitter) this.jitter = q.jitter;
                if (q.maxDelay) this.maxDelay = q.maxDelay
            }
            this.trace("constructed initialDelay=" + this.initialDelay + " multiplier=" + this.multiplier + " jitter=" + this.jitter + " maxDelay=" + this.maxDelay), this.nextDelay = this.initialDelay, this.timerId = setTimeout(() => {}, 0), clearTimeout(this.timerId)
        }
        static getNextId() {
            return this.nextId++
        }
        trace(A) {
            f9Y.trace(Z9Y.LogVerbosity.DEBUG, V9Y, "{" + this.id + "} " + A)
        }
        runTimer(A) {
            var q, K;
            if (this.trace("runTimer(delay=" + A + ")"), this.endTime = this.startTime, this.endTime.setMilliseconds(this.endTime.getMilliseconds() + A), clearTimeout(this.timerId), this.timerId = setTimeout(() => {
                    this.trace("timer fired"), this.running = !1, this.callback()
                }, A), !this.hasRef)(K = (q = this.timerId).unref) === null || K === void 0 || K.call(q)
        }
        runOnce() {
            this.trace("runOnce()"), this.running = !0, this.startTime = new Date, this.runTimer(this.nextDelay);
            let A = Math.min(this.nextDelay * this.multiplier, this.maxDelay),
                q = A * this.jitter;
            this.nextDelay = A + k9Y(-q, q)
        }
        stop() {
            this.trace("stop()"), clearTimeout(this.timerId), this.running = !1
        }
        reset() {
            if (this.trace("reset() running=" + this.running), this.nextDelay = this.initialDelay, this.running) {
                let A = new Date,
                    q = this.startTime;
                if (q.setMilliseconds(q.getMilliseconds() + this.nextDelay), clearTimeout(this.timerId), A < q) this.runTimer(q.getTime() - A.getTime());
                else this.running = !1
            }
        }
        isRunning() {
            return this.running
        }
        ref() {
            var A, q;
            this.hasRef = !0, (q = (A = this.timerId).ref) === null || q === void 0 || q.call(A)
        }
        unref() {
            var A, q;
            this.hasRef = !1, (q = (A = this.timerId).unref) === null || q === void 0 || q.call(A)
        }
        getEndTime() {
            return this.endTime
        }
    }
    CW4.BackoffTimeout = mD6;
    mD6.nextId = 0
})
// @from(Ln 286435, Col 4)
FD6 = R((IW4) => {
    Object.defineProperty(IW4, "__esModule", {
        value: !0
    });
    IW4.ChildLoadBalancerHandler = void 0;
    var L9Y = Es(),
        R9Y = FZ(),
        y9Y = "child_load_balancer_helper";
    class hW4 {
        constructor(A) {
            this.channelControlHelper = A, this.currentChild = null, this.pendingChild = null, this.latestConfig = null, this.ChildPolicyHelper = class {
                constructor(q) {
                    this.parent = q, this.child = null
                }
                createSubchannel(q, K) {
                    return this.parent.channelControlHelper.createSubchannel(q, K)
                }
                updateState(q, K, Y) {
                    var z;
                    if (this.calledByPendingChild()) {
                        if (q === R9Y.ConnectivityState.CONNECTING) return;
                        (z = this.parent.currentChild) === null || z === void 0 || z.destroy(), this.parent.currentChild = this.parent.pendingChild, this.parent.pendingChild = null
                    } else if (!this.calledByCurrentChild()) return;
                    this.parent.channelControlHelper.updateState(q, K, Y)
                }
                requestReresolution() {
                    var q;
                    let K = (q = this.parent.pendingChild) !== null && q !== void 0 ? q : this.parent.currentChild;
                    if (this.child === K) this.parent.channelControlHelper.requestReresolution()
                }
                setChild(q) {
                    this.child = q
                }
                addChannelzChild(q) {
                    this.parent.channelControlHelper.addChannelzChild(q)
                }
                removeChannelzChild(q) {
                    this.parent.channelControlHelper.removeChannelzChild(q)
                }
                calledByPendingChild() {
                    return this.child === this.parent.pendingChild
                }
                calledByCurrentChild() {
                    return this.child === this.parent.currentChild
                }
            }
        }
        configUpdateRequiresNewPolicyInstance(A, q) {
            return A.getLoadBalancerName() !== q.getLoadBalancerName()
        }
        updateAddressList(A, q, K, Y) {
            let z;
            if (this.currentChild === null || this.latestConfig === null || this.configUpdateRequiresNewPolicyInstance(this.latestConfig, q)) {
                let w = new this.ChildPolicyHelper(this),
                    H = (0, L9Y.createLoadBalancer)(q, w);
                if (w.setChild(H), this.currentChild === null) this.currentChild = H, z = this.currentChild;
                else {
                    if (this.pendingChild) this.pendingChild.destroy();
                    this.pendingChild = H, z = this.pendingChild
                }
            } else if (this.pendingChild === null) z = this.currentChild;
            else z = this.pendingChild;
            return this.latestConfig = q, z.updateAddressList(A, q, K, Y)
        }
        exitIdle() {
            if (this.currentChild) {
                if (this.currentChild.exitIdle(), this.pendingChild) this.pendingChild.exitIdle()
            }
        }
        resetBackoff() {
            if (this.currentChild) {
                if (this.currentChild.resetBackoff(), this.pendingChild) this.pendingChild.resetBackoff()
            }
        }
        destroy() {
            if (this.currentChild) this.currentChild.destroy(), this.currentChild = null;
            if (this.pendingChild) this.pendingChild.destroy(), this.pendingChild = null
        }
        getTypeName() {
            return y9Y
        }
    }
    IW4.ChildLoadBalancerHandler = hW4
})