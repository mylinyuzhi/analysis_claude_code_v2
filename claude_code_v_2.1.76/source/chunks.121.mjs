
// @from(Ln 299250, Col 4)
RR4 = x((yR4) => {
    Object.defineProperty(yR4, "__esModule", {
        value: !0
    });
    yR4.hexToBinary = void 0;

    function ER4(A) {
        if (A >= 48 && A <= 57) return A - 48;
        if (A >= 97 && A <= 102) return A - 87;
        return A - 55
    }

    function i3Y(A) {
        let q = new Uint8Array(A.length / 2),
            K = 0;
        for (let Y = 0; Y < A.length; Y += 2) {
            let z = ER4(A.charCodeAt(Y)),
                _ = ER4(A.charCodeAt(Y + 1));
            q[K++] = z << 4 | _
        }
        return q
    }
    yR4.hexToBinary = i3Y
})
// @from(Ln 299274, Col 4)
Df1 = x((bR4) => {
    Object.defineProperty(bR4, "__esModule", {
        value: !0
    });
    bR4.getOtlpEncoder = bR4.encodeAsString = bR4.encodeAsLongBits = bR4.toLongBits = bR4.hrTimeToNanos = void 0;
    var n3Y = K9(),
        Sh8 = RR4();

    function Ch8(A) {
        let q = BigInt(1e9);
        return BigInt(Math.trunc(A[0])) * q + BigInt(Math.trunc(A[1]))
    }
    bR4.hrTimeToNanos = Ch8;

    function SR4(A) {
        let q = Number(BigInt.asUintN(32, A)),
            K = Number(BigInt.asUintN(32, A >> BigInt(32)));
        return {
            low: q,
            high: K
        }
    }
    bR4.toLongBits = SR4;

    function Ih8(A) {
        let q = Ch8(A);
        return SR4(q)
    }
    bR4.encodeAsLongBits = Ih8;

    function CR4(A) {
        return Ch8(A).toString()
    }
    bR4.encodeAsString = CR4;
    var r3Y = typeof BigInt < "u" ? CR4 : n3Y.hrTimeToNanoseconds;

    function hR4(A) {
        return A
    }

    function IR4(A) {
        if (A === void 0) return;
        return (0, Sh8.hexToBinary)(A)
    }
    var o3Y = {
        encodeHrTime: Ih8,
        encodeSpanContext: Sh8.hexToBinary,
        encodeOptionalSpanContext: IR4
    };

    function a3Y(A) {
        if (A === void 0) return o3Y;
        let q = A.useLongBits ?? !0,
            K = A.useHex ?? !1;
        return {
            encodeHrTime: q ? Ih8 : r3Y,
            encodeSpanContext: K ? hR4 : Sh8.hexToBinary,
            encodeOptionalSpanContext: K ? hR4 : IR4
        }
    }
    bR4.getOtlpEncoder = a3Y
})
// @from(Ln 299336, Col 4)
Xf1 = x((mR4) => {
    Object.defineProperty(mR4, "__esModule", {
        value: !0
    });
    mR4.toAnyValue = mR4.toKeyValue = mR4.toAttributes = mR4.createInstrumentationScope = mR4.createResource = void 0;

    function q9Y(A) {
        let q = {
                attributes: uR4(A.attributes),
                droppedAttributesCount: 0
            },
            K = A.schemaUrl;
        if (K && K !== "") q.schemaUrl = K;
        return q
    }
    mR4.createResource = q9Y;

    function K9Y(A) {
        return {
            name: A.name,
            version: A.version
        }
    }
    mR4.createInstrumentationScope = K9Y;

    function uR4(A) {
        return Object.keys(A).map((q) => bh8(q, A[q]))
    }
    mR4.toAttributes = uR4;

    function bh8(A, q) {
        return {
            key: A,
            value: xh8(q)
        }
    }
    mR4.toKeyValue = bh8;

    function xh8(A) {
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
                values: A.map(xh8)
            }
        };
        if (q === "object" && A != null) return {
            kvlistValue: {
                values: Object.entries(A).map(([K, Y]) => bh8(K, Y))
            }
        };
        return {}
    }
    mR4.toAnyValue = xh8
})
// @from(Ln 299407, Col 4)
uh8 = x((FR4) => {
    Object.defineProperty(FR4, "__esModule", {
        value: !0
    });
    FR4.toLogAttributes = FR4.createExportLogsServiceRequest = void 0;
    var O9Y = Df1(),
        Pf1 = Xf1();

    function $9Y(A, q) {
        let K = (0, O9Y.getOtlpEncoder)(q);
        return {
            resourceLogs: j9Y(A, K)
        }
    }
    FR4.createExportLogsServiceRequest = $9Y;

    function H9Y(A) {
        let q = new Map;
        for (let K of A) {
            let {
                resource: Y,
                instrumentationScope: {
                    name: z,
                    version: _ = "",
                    schemaUrl: w = ""
                }
            } = K, O = q.get(Y);
            if (!O) O = new Map, q.set(Y, O);
            let $ = `${z}@${_}:${w}`,
                H = O.get($);
            if (!H) H = [], O.set($, H);
            H.push(K)
        }
        return q
    }

    function j9Y(A, q) {
        let K = H9Y(A);
        return Array.from(K, ([Y, z]) => {
            let _ = (0, Pf1.createResource)(Y);
            return {
                resource: _,
                scopeLogs: Array.from(z, ([, w]) => {
                    return {
                        scope: (0, Pf1.createInstrumentationScope)(w[0].instrumentationScope),
                        logRecords: w.map((O) => J9Y(O, q)),
                        schemaUrl: w[0].instrumentationScope.schemaUrl
                    }
                }),
                schemaUrl: _.schemaUrl
            }
        })
    }

    function J9Y(A, q) {
        return {
            timeUnixNano: q.encodeHrTime(A.hrTime),
            observedTimeUnixNano: q.encodeHrTime(A.hrTimeObserved),
            severityNumber: M9Y(A.severityNumber),
            severityText: A.severityText,
            body: (0, Pf1.toAnyValue)(A.body),
            eventName: A.eventName,
            attributes: gR4(A.attributes),
            droppedAttributesCount: A.droppedAttributesCount,
            flags: A.spanContext?.traceFlags,
            traceId: q.encodeOptionalSpanContext(A.spanContext?.traceId),
            spanId: q.encodeOptionalSpanContext(A.spanContext?.spanId)
        }
    }

    function M9Y(A) {
        return A
    }

    function gR4(A) {
        return Object.keys(A).map((q) => (0, Pf1.toKeyValue)(q, A[q]))
    }
    FR4.toLogAttributes = gR4
})
// @from(Ln 299486, Col 4)
cR4 = x((UR4) => {
    Object.defineProperty(UR4, "__esModule", {
        value: !0
    });
    UR4.ProtobufLogsSerializer = void 0;
    var QR4 = Mf1(),
        X9Y = uh8(),
        P9Y = QR4.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse,
        W9Y = QR4.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
    UR4.ProtobufLogsSerializer = {
        serializeRequest: (A) => {
            let q = (0, X9Y.createExportLogsServiceRequest)(A);
            return W9Y.encode(q).finish()
        },
        deserializeResponse: (A) => {
            return P9Y.decode(A)
        }
    }
})
// @from(Ln 299505, Col 4)
lR4 = x((mh8) => {
    Object.defineProperty(mh8, "__esModule", {
        value: !0
    });
    mh8.ProtobufLogsSerializer = void 0;
    var Z9Y = cR4();
    Object.defineProperty(mh8, "ProtobufLogsSerializer", {
        enumerable: !0,
        get: function() {
            return Z9Y.ProtobufLogsSerializer
        }
    })
})
// @from(Ln 299518, Col 4)
nR4 = x((iR4) => {
    Object.defineProperty(iR4, "__esModule", {
        value: !0
    });
    iR4.EAggregationTemporality = void 0;
    var f9Y;
    (function(A) {
        A[A.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED", A[A.AGGREGATION_TEMPORALITY_DELTA = 1] = "AGGREGATION_TEMPORALITY_DELTA", A[A.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"
    })(f9Y = iR4.EAggregationTemporality || (iR4.EAggregationTemporality = {}))
})
// @from(Ln 299528, Col 4)
gh8 = x((Ah4) => {
    Object.defineProperty(Ah4, "__esModule", {
        value: !0
    });
    Ah4.createExportMetricsServiceRequest = Ah4.toMetric = Ah4.toScopeMetrics = Ah4.toResourceMetrics = void 0;
    var rR4 = yq(),
        fG6 = ue(),
        oR4 = nR4(),
        T9Y = Df1(),
        dU6 = Xf1();

    function sR4(A, q) {
        let K = (0, T9Y.getOtlpEncoder)(q),
            Y = (0, dU6.createResource)(A.resource);
        return {
            resource: Y,
            schemaUrl: Y.schemaUrl,
            scopeMetrics: tR4(A.scopeMetrics, K)
        }
    }
    Ah4.toResourceMetrics = sR4;

    function tR4(A, q) {
        return Array.from(A.map((K) => ({
            scope: (0, dU6.createInstrumentationScope)(K.scope),
            metrics: K.metrics.map((Y) => eR4(Y, q)),
            schemaUrl: K.scope.schemaUrl
        })))
    }
    Ah4.toScopeMetrics = tR4;

    function eR4(A, q) {
        let K = {
                name: A.descriptor.name,
                description: A.descriptor.description,
                unit: A.descriptor.unit
            },
            Y = k9Y(A.aggregationTemporality);
        switch (A.dataPointType) {
            case fG6.DataPointType.SUM:
                K.sum = {
                    aggregationTemporality: Y,
                    isMonotonic: A.isMonotonic,
                    dataPoints: aR4(A, q)
                };
                break;
            case fG6.DataPointType.GAUGE:
                K.gauge = {
                    dataPoints: aR4(A, q)
                };
                break;
            case fG6.DataPointType.HISTOGRAM:
                K.histogram = {
                    aggregationTemporality: Y,
                    dataPoints: N9Y(A, q)
                };
                break;
            case fG6.DataPointType.EXPONENTIAL_HISTOGRAM:
                K.exponentialHistogram = {
                    aggregationTemporality: Y,
                    dataPoints: V9Y(A, q)
                };
                break
        }
        return K
    }
    Ah4.toMetric = eR4;

    function v9Y(A, q, K) {
        let Y = {
            attributes: (0, dU6.toAttributes)(A.attributes),
            startTimeUnixNano: K.encodeHrTime(A.startTime),
            timeUnixNano: K.encodeHrTime(A.endTime)
        };
        switch (q) {
            case rR4.ValueType.INT:
                Y.asInt = A.value;
                break;
            case rR4.ValueType.DOUBLE:
                Y.asDouble = A.value;
                break
        }
        return Y
    }

    function aR4(A, q) {
        return A.dataPoints.map((K) => {
            return v9Y(K, A.descriptor.valueType, q)
        })
    }

    function N9Y(A, q) {
        return A.dataPoints.map((K) => {
            let Y = K.value;
            return {
                attributes: (0, dU6.toAttributes)(K.attributes),
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

    function V9Y(A, q) {
        return A.dataPoints.map((K) => {
            let Y = K.value;
            return {
                attributes: (0, dU6.toAttributes)(K.attributes),
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

    function k9Y(A) {
        switch (A) {
            case fG6.AggregationTemporality.DELTA:
                return oR4.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
            case fG6.AggregationTemporality.CUMULATIVE:
                return oR4.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE
        }
    }

    function E9Y(A, q) {
        return {
            resourceMetrics: A.map((K) => sR4(K, q))
        }
    }
    Ah4.createExportMetricsServiceRequest = E9Y
})
// @from(Ln 299677, Col 4)
_h4 = x((Yh4) => {
    Object.defineProperty(Yh4, "__esModule", {
        value: !0
    });
    Yh4.ProtobufMetricsSerializer = void 0;
    var Kh4 = Mf1(),
        h9Y = gh8(),
        S9Y = Kh4.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse,
        C9Y = Kh4.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
    Yh4.ProtobufMetricsSerializer = {
        serializeRequest: (A) => {
            let q = (0, h9Y.createExportMetricsServiceRequest)([A]);
            return C9Y.encode(q).finish()
        },
        deserializeResponse: (A) => {
            return S9Y.decode(A)
        }
    }
})
// @from(Ln 299696, Col 4)
wh4 = x((Fh8) => {
    Object.defineProperty(Fh8, "__esModule", {
        value: !0
    });
    Fh8.ProtobufMetricsSerializer = void 0;
    var I9Y = _h4();
    Object.defineProperty(Fh8, "ProtobufMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return I9Y.ProtobufMetricsSerializer
        }
    })
})
// @from(Ln 299709, Col 4)
ph8 = x((Jh4) => {
    Object.defineProperty(Jh4, "__esModule", {
        value: !0
    });
    Jh4.createExportTraceServiceRequest = Jh4.toOtlpSpanEvent = Jh4.toOtlpLink = Jh4.sdkSpanToOtlpSpan = void 0;
    var cU6 = Xf1(),
        x9Y = Df1(),
        u9Y = 256,
        m9Y = 512;

    function Oh4(A, q) {
        let K = A & 255 | u9Y;
        if (q) K |= m9Y;
        return K
    }

    function $h4(A, q) {
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
            attributes: (0, cU6.toAttributes)(A.attributes),
            droppedAttributesCount: A.droppedAttributesCount,
            events: A.events.map((_) => jh4(_, q)),
            droppedEventsCount: A.droppedEventsCount,
            status: {
                code: Y.code,
                message: Y.message
            },
            links: A.links.map((_) => Hh4(_, q)),
            droppedLinksCount: A.droppedLinksCount,
            flags: Oh4(K.traceFlags, A.parentSpanContext?.isRemote)
        }
    }
    Jh4.sdkSpanToOtlpSpan = $h4;

    function Hh4(A, q) {
        return {
            attributes: A.attributes ? (0, cU6.toAttributes)(A.attributes) : [],
            spanId: q.encodeSpanContext(A.context.spanId),
            traceId: q.encodeSpanContext(A.context.traceId),
            traceState: A.context.traceState?.serialize(),
            droppedAttributesCount: A.droppedAttributesCount || 0,
            flags: Oh4(A.context.traceFlags, A.context.isRemote)
        }
    }
    Jh4.toOtlpLink = Hh4;

    function jh4(A, q) {
        return {
            attributes: A.attributes ? (0, cU6.toAttributes)(A.attributes) : [],
            name: A.name,
            timeUnixNano: q.encodeHrTime(A.time),
            droppedAttributesCount: A.droppedAttributesCount || 0
        }
    }
    Jh4.toOtlpSpanEvent = jh4;

    function B9Y(A, q) {
        let K = (0, x9Y.getOtlpEncoder)(q);
        return {
            resourceSpans: F9Y(A, K)
        }
    }
    Jh4.createExportTraceServiceRequest = B9Y;

    function g9Y(A) {
        let q = new Map;
        for (let K of A) {
            let Y = q.get(K.resource);
            if (!Y) Y = new Map, q.set(K.resource, Y);
            let z = `${K.instrumentationScope.name}@${K.instrumentationScope.version||""}:${K.instrumentationScope.schemaUrl||""}`,
                _ = Y.get(z);
            if (!_) _ = [], Y.set(z, _);
            _.push(K)
        }
        return q
    }

    function F9Y(A, q) {
        let K = g9Y(A),
            Y = [],
            z = K.entries(),
            _ = z.next();
        while (!_.done) {
            let [w, O] = _.value, $ = [], H = O.values(), j = H.next();
            while (!j.done) {
                let D = j.value;
                if (D.length > 0) {
                    let X = D.map((P) => $h4(P, q));
                    $.push({
                        scope: (0, cU6.createInstrumentationScope)(D[0].instrumentationScope),
                        spans: X,
                        schemaUrl: D[0].instrumentationScope.schemaUrl
                    })
                }
                j = H.next()
            }
            let J = (0, cU6.createResource)(w),
                M = {
                    resource: J,
                    scopeSpans: $,
                    schemaUrl: J.schemaUrl
                };
            Y.push(M), _ = z.next()
        }
        return Y
    }
})
// @from(Ln 299826, Col 4)
Wh4 = x((Xh4) => {
    Object.defineProperty(Xh4, "__esModule", {
        value: !0
    });
    Xh4.ProtobufTraceSerializer = void 0;
    var Dh4 = Mf1(),
        d9Y = ph8(),
        c9Y = Dh4.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse,
        l9Y = Dh4.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
    Xh4.ProtobufTraceSerializer = {
        serializeRequest: (A) => {
            let q = (0, d9Y.createExportTraceServiceRequest)(A);
            return l9Y.encode(q).finish()
        },
        deserializeResponse: (A) => {
            return c9Y.decode(A)
        }
    }
})
// @from(Ln 299845, Col 4)
Zh4 = x((Qh8) => {
    Object.defineProperty(Qh8, "__esModule", {
        value: !0
    });
    Qh8.ProtobufTraceSerializer = void 0;
    var i9Y = Wh4();
    Object.defineProperty(Qh8, "ProtobufTraceSerializer", {
        enumerable: !0,
        get: function() {
            return i9Y.ProtobufTraceSerializer
        }
    })
})
// @from(Ln 299858, Col 4)
Th4 = x((Gh4) => {
    Object.defineProperty(Gh4, "__esModule", {
        value: !0
    });
    Gh4.JsonLogsSerializer = void 0;
    var r9Y = uh8();
    Gh4.JsonLogsSerializer = {
        serializeRequest: (A) => {
            let q = (0, r9Y.createExportLogsServiceRequest)(A, {
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
// @from(Ln 299878, Col 4)
vh4 = x((Uh8) => {
    Object.defineProperty(Uh8, "__esModule", {
        value: !0
    });
    Uh8.JsonLogsSerializer = void 0;
    var o9Y = Th4();
    Object.defineProperty(Uh8, "JsonLogsSerializer", {
        enumerable: !0,
        get: function() {
            return o9Y.JsonLogsSerializer
        }
    })
})
// @from(Ln 299891, Col 4)
kh4 = x((Nh4) => {
    Object.defineProperty(Nh4, "__esModule", {
        value: !0
    });
    Nh4.JsonMetricsSerializer = void 0;
    var s9Y = gh8();
    Nh4.JsonMetricsSerializer = {
        serializeRequest: (A) => {
            let q = (0, s9Y.createExportMetricsServiceRequest)([A], {
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
// @from(Ln 299910, Col 4)
Eh4 = x((dh8) => {
    Object.defineProperty(dh8, "__esModule", {
        value: !0
    });
    dh8.JsonMetricsSerializer = void 0;
    var t9Y = kh4();
    Object.defineProperty(dh8, "JsonMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return t9Y.JsonMetricsSerializer
        }
    })
})
// @from(Ln 299923, Col 4)
Rh4 = x((yh4) => {
    Object.defineProperty(yh4, "__esModule", {
        value: !0
    });
    yh4.JsonTraceSerializer = void 0;
    var AYY = ph8();
    yh4.JsonTraceSerializer = {
        serializeRequest: (A) => {
            let q = (0, AYY.createExportTraceServiceRequest)(A, {
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
// @from(Ln 299943, Col 4)
hh4 = x((ch8) => {
    Object.defineProperty(ch8, "__esModule", {
        value: !0
    });
    ch8.JsonTraceSerializer = void 0;
    var qYY = Rh4();
    Object.defineProperty(ch8, "JsonTraceSerializer", {
        enumerable: !0,
        get: function() {
            return qYY.JsonTraceSerializer
        }
    })
})
// @from(Ln 299956, Col 4)
Gg = x((Fe) => {
    Object.defineProperty(Fe, "__esModule", {
        value: !0
    });
    Fe.JsonTraceSerializer = Fe.JsonMetricsSerializer = Fe.JsonLogsSerializer = Fe.ProtobufTraceSerializer = Fe.ProtobufMetricsSerializer = Fe.ProtobufLogsSerializer = void 0;
    var YYY = lR4();
    Object.defineProperty(Fe, "ProtobufLogsSerializer", {
        enumerable: !0,
        get: function() {
            return YYY.ProtobufLogsSerializer
        }
    });
    var zYY = wh4();
    Object.defineProperty(Fe, "ProtobufMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return zYY.ProtobufMetricsSerializer
        }
    });
    var _YY = Zh4();
    Object.defineProperty(Fe, "ProtobufTraceSerializer", {
        enumerable: !0,
        get: function() {
            return _YY.ProtobufTraceSerializer
        }
    });
    var wYY = vh4();
    Object.defineProperty(Fe, "JsonLogsSerializer", {
        enumerable: !0,
        get: function() {
            return wYY.JsonLogsSerializer
        }
    });
    var OYY = Eh4();
    Object.defineProperty(Fe, "JsonMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return OYY.JsonMetricsSerializer
        }
    });
    var $YY = hh4();
    Object.defineProperty(Fe, "JsonTraceSerializer", {
        enumerable: !0,
        get: function() {
            return $YY.JsonTraceSerializer
        }
    })
})
// @from(Ln 300004, Col 4)
Ih4 = x((Sh4) => {
    Object.defineProperty(Sh4, "__esModule", {
        value: !0
    });
    Sh4.validateAndNormalizeHeaders = void 0;
    var jYY = yq();

    function JYY(A) {
        let q = {};
        return Object.entries(A ?? {}).forEach(([K, Y]) => {
            if (typeof Y < "u") q[K] = String(Y);
            else jYY.diag.warn(`Header "${K}" has invalid value (${Y}) and will be ignored`)
        }), q
    }
    Sh4.validateAndNormalizeHeaders = JYY
})
// @from(Ln 300020, Col 4)
mh4 = x((xh4) => {
    Object.defineProperty(xh4, "__esModule", {
        value: !0
    });
    xh4.getHttpConfigurationDefaults = xh4.mergeOtlpHttpConfigurationWithDefaults = void 0;
    var bh4 = gU6(),
        MYY = Ih4();

    function DYY(A, q, K) {
        return async () => {
            let Y = {
                    ...await K()
                },
                z = {};
            if (q != null) Object.assign(z, await q());
            if (A != null) Object.assign(z, (0, MYY.validateAndNormalizeHeaders)(await A()));
            return Object.assign(z, Y)
        }
    }

    function XYY(A) {
        if (A == null) return;
        try {
            let q = globalThis.location?.href;
            return new URL(A, q).href
        } catch {
            throw Error(`Configuration: Could not parse user-provided export URL: '${A}'`)
        }
    }

    function PYY(A, q, K) {
        return {
            ...(0, bh4.mergeOtlpSharedConfigurationWithDefaults)(A, q, K),
            headers: DYY(A.headers, q.headers, K.headers),
            url: XYY(A.url) ?? q.url ?? K.url
        }
    }
    xh4.mergeOtlpHttpConfigurationWithDefaults = PYY;

    function WYY(A, q) {
        return {
            ...(0, bh4.getSharedConfigurationDefaults)(),
            headers: async () => A,
            url: "http://localhost:4318/" + q
        }
    }
    xh4.getHttpConfigurationDefaults = WYY
})
// @from(Ln 300068, Col 4)
Wf1 = x((Fh4) => {
    Object.defineProperty(Fh4, "__esModule", {
        value: !0
    });
    Fh4.getNodeHttpConfigurationDefaults = Fh4.mergeOtlpNodeHttpConfigurationWithDefaults = Fh4.httpAgentFactoryFromOptions = void 0;
    var Bh4 = mh4();

    function gh4(A) {
        return async (q) => {
            let K = q === "http:",
                Y = K ? import("http") : import("https"),
                {
                    Agent: z
                } = await Y;
            if (K) {
                let {
                    ca: _,
                    cert: w,
                    key: O,
                    ...$
                } = A;
                return new z($)
            }
            return new z(A)
        }
    }
    Fh4.httpAgentFactoryFromOptions = gh4;

    function GYY(A, q, K) {
        return {
            ...(0, Bh4.mergeOtlpHttpConfigurationWithDefaults)(A, q, K),
            agentFactory: A.agentFactory ?? q.agentFactory ?? K.agentFactory,
            userAgent: A.userAgent
        }
    }
    Fh4.mergeOtlpNodeHttpConfigurationWithDefaults = GYY;

    function fYY(A, q) {
        return {
            ...(0, Bh4.getHttpConfigurationDefaults)(A, q),
            agentFactory: gh4({
                keepAlive: !0
            })
        }
    }
    Fh4.getNodeHttpConfigurationDefaults = fYY
})
// @from(Ln 300115, Col 4)
dh4 = x((Qh4) => {
    Object.defineProperty(Qh4, "__esModule", {
        value: !0
    });
    Qh4.parseRetryAfterToMills = Qh4.isExportRetryable = void 0;

    function NYY(A) {
        return [429, 502, 503, 504].includes(A)
    }
    Qh4.isExportRetryable = NYY;

    function VYY(A) {
        if (A == null) return;
        let q = Number.parseInt(A, 10);
        if (Number.isInteger(q)) return q > 0 ? q * 1000 : -1;
        let K = new Date(A).getTime() - Date.now();
        if (K >= 0) return K;
        return 0
    }
    Qh4.parseRetryAfterToMills = VYY
})
// @from(Ln 300136, Col 4)
ih4 = x((ch4) => {
    Object.defineProperty(ch4, "__esModule", {
        value: !0
    });
    ch4.VERSION = void 0;
    ch4.VERSION = "0.208.0"
})
// @from(Ln 300143, Col 4)
th4 = x((ah4) => {
    Object.defineProperty(ah4, "__esModule", {
        value: !0
    });
    ah4.compressAndSend = ah4.sendWithHttp = void 0;
    var EYY = x6("zlib"),
        yYY = x6("stream"),
        nh4 = dh4(),
        LYY = zf1(),
        RYY = ih4(),
        rh4 = `OTel-OTLP-Exporter-JavaScript/${RYY.VERSION}`;

    function hYY(A, q, K, Y, z, _, w, O, $) {
        let H = new URL(q);
        if (z) K["User-Agent"] = `${z} ${rh4}`;
        else K["User-Agent"] = rh4;
        let j = {
                hostname: H.hostname,
                port: H.port,
                path: H.pathname,
                method: "POST",
                headers: K,
                agent: _
            },
            J = A(j, (M) => {
                let D = [];
                M.on("data", (X) => D.push(X)), M.on("end", () => {
                    if (M.statusCode && M.statusCode < 299) O({
                        status: "success",
                        data: Buffer.concat(D)
                    });
                    else if (M.statusCode && (0, nh4.isExportRetryable)(M.statusCode)) O({
                        status: "retryable",
                        retryInMillis: (0, nh4.parseRetryAfterToMills)(M.headers["retry-after"])
                    });
                    else {
                        let X = new LYY.OTLPExporterError(M.statusMessage, M.statusCode, Buffer.concat(D).toString());
                        O({
                            status: "failure",
                            error: X
                        })
                    }
                })
            });
        J.setTimeout($, () => {
            J.destroy(), O({
                status: "failure",
                error: Error("Request Timeout")
            })
        }), J.on("error", (M) => {
            O({
                status: "failure",
                error: M
            })
        }), oh4(J, Y, w, (M) => {
            O({
                status: "failure",
                error: M
            })
        })
    }
    ah4.sendWithHttp = hYY;

    function oh4(A, q, K, Y) {
        let z = SYY(K);
        if (q === "gzip") A.setHeader("Content-Encoding", "gzip"), z = z.on("error", Y).pipe(EYY.createGzip()).on("error", Y);
        z.pipe(A).on("error", Y)
    }
    ah4.compressAndSend = oh4;

    function SYY(A) {
        let q = new yYY.Readable;
        return q.push(A), q.push(null), q
    }
})
// @from(Ln 300218, Col 4)
KS4 = x((AS4) => {
    Object.defineProperty(AS4, "__esModule", {
        value: !0
    });
    AS4.createHttpExporterTransport = void 0;
    var IYY = th4();
    class eh4 {
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
            return new Promise((_) => {
                (0, IYY.sendWithHttp)(Y, this._parameters.url, z, this._parameters.compression, this._parameters.userAgent, K, A, (w) => {
                    _(w)
                }, q)
            })
        }
        shutdown() {}
        async _loadUtils() {
            let A = this._utils;
            if (A === null) {
                let q = new URL(this._parameters.url).protocol,
                    [K, Y] = await Promise.all([this._parameters.agentFactory(q), bYY(q)]);
                A = this._utils = {
                    agent: K,
                    request: Y
                }
            }
            return A
        }
    }
    async function bYY(A) {
        let q = A === "http:" ? import("http") : import("https"),
            {
                request: K
            } = await q;
        return K
    }

    function xYY(A) {
        return new eh4(A)
    }
    AS4.createHttpExporterTransport = xYY
})
// @from(Ln 300268, Col 4)
OS4 = x((_S4) => {
    Object.defineProperty(_S4, "__esModule", {
        value: !0
    });
    _S4.createRetryingTransport = void 0;
    var uYY = 5,
        mYY = 1000,
        BYY = 5000,
        gYY = 1.5,
        YS4 = 0.2;

    function FYY() {
        return Math.random() * (2 * YS4) - YS4
    }
    class zS4 {
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
                z = uYY,
                _ = mYY;
            while (Y.status === "retryable" && z > 0) {
                z--;
                let w = Math.max(Math.min(_, BYY) + FYY(), 0);
                _ = _ * gYY;
                let O = Y.retryInMillis ?? w,
                    $ = K - Date.now();
                if (O > $) return Y;
                Y = await this.retry(A, $, O)
            }
            return Y
        }
        shutdown() {
            return this._transport.shutdown()
        }
    }

    function pYY(A) {
        return new zS4(A.transport)
    }
    _S4.createRetryingTransport = pYY
})
// @from(Ln 300320, Col 4)
jS4 = x(($S4) => {
    Object.defineProperty($S4, "__esModule", {
        value: !0
    });
    $S4.createOtlpHttpExportDelegate = void 0;
    var QYY = $h8(),
        UYY = KS4(),
        dYY = Oh8(),
        cYY = OS4();

    function lYY(A, q) {
        return (0, QYY.createOtlpExportDelegate)({
            transport: (0, cYY.createRetryingTransport)({
                transport: (0, UYY.createHttpExporterTransport)(A)
            }),
            serializer: q,
            promiseHandler: (0, dYY.createBoundedQueueExportPromiseHandler)(A)
        }, {
            timeout: A.timeoutMillis
        })
    }
    $S4.createOtlpHttpExportDelegate = lYY
})
// @from(Ln 300343, Col 4)
lh8 = x((PS4) => {
    Object.defineProperty(PS4, "__esModule", {
        value: !0
    });
    PS4.getSharedConfigurationFromEnvironment = void 0;
    var DS4 = K9(),
        XS4 = yq();

    function JS4(A) {
        let q = (0, DS4.getNumberFromEnv)(A);
        if (q != null) {
            if (Number.isFinite(q) && q > 0) return q;
            XS4.diag.warn(`Configuration: ${A} is invalid, expected number greater than 0 (actual: ${q})`)
        }
        return
    }

    function iYY(A) {
        let q = JS4(`OTEL_EXPORTER_OTLP_${A}_TIMEOUT`),
            K = JS4("OTEL_EXPORTER_OTLP_TIMEOUT");
        return q ?? K
    }

    function MS4(A) {
        let q = (0, DS4.getStringFromEnv)(A)?.trim();
        if (q == null || q === "none" || q === "gzip") return q;
        XS4.diag.warn(`Configuration: ${A} is invalid, expected 'none' or 'gzip' (actual: '${q}')`);
        return
    }

    function nYY(A) {
        let q = MS4(`OTEL_EXPORTER_OTLP_${A}_COMPRESSION`),
            K = MS4("OTEL_EXPORTER_OTLP_COMPRESSION");
        return q ?? K
    }

    function rYY(A) {
        return {
            timeoutMillis: iYY(A),
            compression: nYY(A)
        }
    }
    PS4.getSharedConfigurationFromEnvironment = rYY
})
// @from(Ln 300387, Col 4)
fS4 = x((ZS4) => {
    Object.defineProperty(ZS4, "__esModule", {
        value: !0
    });
    ZS4.getNodeHttpConfigurationFromEnvironment = void 0;
    var oYY = x6("fs"),
        aYY = x6("path"),
        fg = K9(),
        Zf1 = yq(),
        sYY = lh8(),
        tYY = gU6(),
        eYY = Wf1();

    function AzY(A) {
        let q = (0, fg.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_HEADERS`),
            K = (0, fg.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"),
            Y = (0, fg.parseKeyPairsIntoRecord)(q),
            z = (0, fg.parseKeyPairsIntoRecord)(K);
        if (Object.keys(Y).length === 0 && Object.keys(z).length === 0) return;
        return Object.assign({}, (0, fg.parseKeyPairsIntoRecord)(K), (0, fg.parseKeyPairsIntoRecord)(q))
    }

    function qzY(A) {
        try {
            return new URL(A).toString()
        } catch {
            Zf1.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
            return
        }
    }

    function KzY(A, q) {
        try {
            new URL(A)
        } catch {
            Zf1.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
            return
        }
        if (!A.endsWith("/")) A = A + "/";
        A += q;
        try {
            new URL(A)
        } catch {
            Zf1.diag.warn(`Configuration: Provided URL appended with '${q}' is not a valid URL, using 'undefined' instead of '${A}'`);
            return
        }
        return A
    }

    function YzY(A) {
        let q = (0, fg.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
        if (q === void 0) return;
        return KzY(q, A)
    }

    function zzY(A) {
        let q = (0, fg.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`);
        if (q === void 0) return;
        return qzY(q)
    }

    function ih8(A, q, K) {
        let Y = (0, fg.getStringFromEnv)(A),
            z = (0, fg.getStringFromEnv)(q),
            _ = Y ?? z;
        if (_ != null) try {
            return oYY.readFileSync(aYY.resolve(process.cwd(), _))
        } catch {
            Zf1.diag.warn(K);
            return
        } else return
    }

    function _zY(A) {
        return ih8(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
    }

    function wzY(A) {
        return ih8(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
    }

    function OzY(A) {
        return ih8(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
    }

    function $zY(A, q) {
        return {
            ...(0, sYY.getSharedConfigurationFromEnvironment)(A),
            url: zzY(A) ?? YzY(q),
            headers: (0, tYY.wrapStaticHeadersInFunction)(AzY(A)),
            agentFactory: (0, eYY.httpAgentFactoryFromOptions)({
                keepAlive: !0,
                ca: OzY(A),
                cert: _zY(A),
                key: wzY(A)
            })
        }
    }
    ZS4.getNodeHttpConfigurationFromEnvironment = $zY
})
// @from(Ln 300487, Col 4)
NS4 = x((TS4) => {
    Object.defineProperty(TS4, "__esModule", {
        value: !0
    });
    TS4.convertLegacyHeaders = void 0;
    var HzY = gU6();

    function jzY(A) {
        if (typeof A.headers === "function") return A.headers;
        return (0, HzY.wrapStaticHeadersInFunction)(A.headers)
    }
    TS4.convertLegacyHeaders = jzY
})
// @from(Ln 300500, Col 4)
yS4 = x((kS4) => {
    Object.defineProperty(kS4, "__esModule", {
        value: !0
    });
    kS4.convertLegacyHttpOptions = void 0;
    var JzY = yq(),
        VS4 = Wf1(),
        MzY = Bc(),
        DzY = fS4(),
        XzY = NS4();

    function PzY(A) {
        if (typeof A.httpAgentOptions === "function") return A.httpAgentOptions;
        let q = A.httpAgentOptions;
        if (A.keepAlive != null) q = {
            keepAlive: A.keepAlive,
            ...q
        };
        if (q != null) return (0, MzY.httpAgentFactoryFromOptions)(q);
        else return
    }

    function WzY(A, q, K, Y) {
        if (A.metadata) JzY.diag.warn("Metadata cannot be set when using http");
        return (0, VS4.mergeOtlpNodeHttpConfigurationWithDefaults)({
            url: A.url,
            headers: (0, XzY.convertLegacyHeaders)(A),
            concurrencyLimit: A.concurrencyLimit,
            timeoutMillis: A.timeoutMillis,
            compression: A.compression,
            agentFactory: PzY(A),
            userAgent: A.userAgent
        }, (0, DzY.getNodeHttpConfigurationFromEnvironment)(q, K), (0, VS4.getNodeHttpConfigurationDefaults)(Y, K))
    }
    kS4.convertLegacyHttpOptions = WzY
})
// @from(Ln 300536, Col 4)
Bc = x((TG6) => {
    Object.defineProperty(TG6, "__esModule", {
        value: !0
    });
    TG6.convertLegacyHttpOptions = TG6.getSharedConfigurationFromEnvironment = TG6.createOtlpHttpExportDelegate = TG6.httpAgentFactoryFromOptions = void 0;
    var ZzY = Wf1();
    Object.defineProperty(TG6, "httpAgentFactoryFromOptions", {
        enumerable: !0,
        get: function() {
            return ZzY.httpAgentFactoryFromOptions
        }
    });
    var GzY = jS4();
    Object.defineProperty(TG6, "createOtlpHttpExportDelegate", {
        enumerable: !0,
        get: function() {
            return GzY.createOtlpHttpExportDelegate
        }
    });
    var fzY = lh8();
    Object.defineProperty(TG6, "getSharedConfigurationFromEnvironment", {
        enumerable: !0,
        get: function() {
            return fzY.getSharedConfigurationFromEnvironment
        }
    });
    var TzY = yS4();
    Object.defineProperty(TG6, "convertLegacyHttpOptions", {
        enumerable: !0,
        get: function() {
            return TzY.convertLegacyHttpOptions
        }
    })
})
// @from(Ln 300570, Col 4)
CS4 = x((hS4) => {
    Object.defineProperty(hS4, "__esModule", {
        value: !0
    });
    hS4.OTLPMetricExporter = void 0;
    var NzY = Jh8(),
        VzY = Gg(),
        LS4 = Bc();
    class RS4 extends NzY.OTLPMetricExporterBase {
        constructor(A) {
            super((0, LS4.createOtlpHttpExportDelegate)((0, LS4.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
                "Content-Type": "application/json"
            }), VzY.JsonMetricsSerializer), A)
        }
    }
    hS4.OTLPMetricExporter = RS4
})
// @from(Ln 300587, Col 4)
IS4 = x((nh8) => {
    Object.defineProperty(nh8, "__esModule", {
        value: !0
    });
    nh8.OTLPMetricExporter = void 0;
    var kzY = CS4();
    Object.defineProperty(nh8, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return kzY.OTLPMetricExporter
        }
    })
})
// @from(Ln 300600, Col 4)
bS4 = x((rh8) => {
    Object.defineProperty(rh8, "__esModule", {
        value: !0
    });
    rh8.OTLPMetricExporter = void 0;
    var yzY = IS4();
    Object.defineProperty(rh8, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return yzY.OTLPMetricExporter
        }
    })
})
// @from(Ln 300613, Col 4)
ff1 = x((pe) => {
    Object.defineProperty(pe, "__esModule", {
        value: !0
    });
    pe.OTLPMetricExporterBase = pe.LowMemoryTemporalitySelector = pe.DeltaTemporalitySelector = pe.CumulativeTemporalitySelector = pe.AggregationTemporalityPreference = pe.OTLPMetricExporter = void 0;
    var RzY = bS4();
    Object.defineProperty(pe, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return RzY.OTLPMetricExporter
        }
    });
    var hzY = _h8();
    Object.defineProperty(pe, "AggregationTemporalityPreference", {
        enumerable: !0,
        get: function() {
            return hzY.AggregationTemporalityPreference
        }
    });
    var Gf1 = Jh8();
    Object.defineProperty(pe, "CumulativeTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return Gf1.CumulativeTemporalitySelector
        }
    });
    Object.defineProperty(pe, "DeltaTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return Gf1.DeltaTemporalitySelector
        }
    });
    Object.defineProperty(pe, "LowMemoryTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return Gf1.LowMemoryTemporalitySelector
        }
    });
    Object.defineProperty(pe, "OTLPMetricExporterBase", {
        enumerable: !0,
        get: function() {
            return Gf1.OTLPMetricExporterBase
        }
    })
})
// @from(Ln 300658, Col 4)
gS4 = x((mS4) => {
    Object.defineProperty(mS4, "__esModule", {
        value: !0
    });
    mS4.OTLPMetricExporter = void 0;
    var CzY = ff1(),
        IzY = Gg(),
        xS4 = Bc();
    class uS4 extends CzY.OTLPMetricExporterBase {
        constructor(A) {
            super((0, xS4.createOtlpHttpExportDelegate)((0, xS4.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
                "Content-Type": "application/x-protobuf"
            }), IzY.ProtobufMetricsSerializer), A)
        }
    }
    mS4.OTLPMetricExporter = uS4
})
// @from(Ln 300675, Col 4)
FS4 = x((oh8) => {
    Object.defineProperty(oh8, "__esModule", {
        value: !0
    });
    oh8.OTLPMetricExporter = void 0;
    var bzY = gS4();
    Object.defineProperty(oh8, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return bzY.OTLPMetricExporter
        }
    })
})
// @from(Ln 300688, Col 4)
pS4 = x((ah8) => {
    Object.defineProperty(ah8, "__esModule", {
        value: !0
    });
    ah8.OTLPMetricExporter = void 0;
    var uzY = FS4();
    Object.defineProperty(ah8, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return uzY.OTLPMetricExporter
        }
    })
})
// @from(Ln 300701, Col 4)
QS4 = x((sh8) => {
    Object.defineProperty(sh8, "__esModule", {
        value: !0
    });
    sh8.OTLPMetricExporter = void 0;
    var BzY = pS4();
    Object.defineProperty(sh8, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return BzY.OTLPMetricExporter
        }
    })
})
// @from(Ln 300714, Col 4)
AS8 = x((lS4) => {
    Object.defineProperty(lS4, "__esModule", {
        value: !0
    });
    lS4.PrometheusSerializer = void 0;
    var FzY = yq(),
        OY6 = ue(),
        US4 = K9();

    function vf1(A) {
        return A.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
    }

    function dS4(A = "") {
        if (typeof A !== "string") A = JSON.stringify(A);
        return vf1(A).replace(/"/g, "\\\"")
    }
    var pzY = /[^a-z0-9_]/gi,
        QzY = /_{2,}/g;

    function eh8(A) {
        return A.replace(pzY, "_").replace(QzY, "_")
    }

    function th8(A, q) {
        if (!A.endsWith("_total") && q.dataPointType === OY6.DataPointType.SUM && q.isMonotonic) A = A + "_total";
        return A
    }

    function UzY(A) {
        if (A === 1 / 0) return "+Inf";
        else if (A === -1 / 0) return "-Inf";
        else return `${A}`
    }

    function dzY(A) {
        switch (A.dataPointType) {
            case OY6.DataPointType.SUM:
                if (A.isMonotonic) return "counter";
                return "gauge";
            case OY6.DataPointType.GAUGE:
                return "gauge";
            case OY6.DataPointType.HISTOGRAM:
                return "histogram";
            default:
                return "untyped"
        }
    }

    function Tf1(A, q, K, Y, z) {
        let _ = !1,
            w = "";
        for (let [O, $] of Object.entries(q)) {
            let H = eh8(O);
            _ = !0, w += `${w.length>0?",":""}${H}="${dS4($)}"`
        }
        if (z)
            for (let [O, $] of Object.entries(z)) {
                let H = eh8(O);
                _ = !0, w += `${w.length>0?",":""}${H}="${dS4($)}"`
            }
        if (_) A += `{${w}}`;
        return `${A} ${UzY(K)}${Y!==void 0?" "+String(Y):""}
`
    }
    var czY = "# no registered metrics";
    class cS4 {
        _prefix;
        _appendTimestamp;
        _additionalAttributes;
        _withResourceConstantLabels;
        _withoutTargetInfo;
        constructor(A, q = !1, K, Y) {
            if (A) this._prefix = A + "_";
            this._appendTimestamp = q, this._withResourceConstantLabels = K, this._withoutTargetInfo = !!Y
        }
        serialize(A) {
            let q = "";
            this._additionalAttributes = this._filterResourceConstantLabels(A.resource.attributes, this._withResourceConstantLabels);
            for (let K of A.scopeMetrics) q += this._serializeScopeMetrics(K);
            if (q === "") q += czY;
            return this._serializeResource(A.resource) + q
        }
        _filterResourceConstantLabels(A, q) {
            if (q) {
                let K = {};
                for (let [Y, z] of Object.entries(A))
                    if (Y.match(q)) K[Y] = z;
                return K
            }
            return
        }
        _serializeScopeMetrics(A) {
            let q = "";
            for (let K of A.metrics) q += this._serializeMetricData(K) + `
`;
            return q
        }
        _serializeMetricData(A) {
            let q = eh8(vf1(A.descriptor.name));
            if (this._prefix) q = `${this._prefix}${q}`;
            let K = A.dataPointType;
            q = th8(q, A);
            let Y = `# HELP ${q} ${vf1(A.descriptor.description||"description missing")}`,
                z = A.descriptor.unit ? `
# UNIT ${q} ${vf1(A.descriptor.unit)}` : "",
                _ = `# TYPE ${q} ${dzY(A)}`,
                w = "";
            switch (K) {
                case OY6.DataPointType.SUM:
                case OY6.DataPointType.GAUGE: {
                    w = A.dataPoints.map((O) => this._serializeSingularDataPoint(q, A, O)).join("");
                    break
                }
                case OY6.DataPointType.HISTOGRAM: {
                    w = A.dataPoints.map((O) => this._serializeHistogramDataPoint(q, A, O)).join("");
                    break
                }
                default:
                    FzY.diag.error(`Unrecognizable DataPointType: ${K} for metric "${q}"`)
            }
            return `${Y}${z}
${_}
${w}`.trim()
        }
        _serializeSingularDataPoint(A, q, K) {
            let Y = "";
            A = th8(A, q);
            let {
                value: z,
                attributes: _
            } = K, w = (0, US4.hrTimeToMilliseconds)(K.endTime);
            return Y += Tf1(A, _, z, this._appendTimestamp ? w : void 0, this._additionalAttributes), Y
        }
        _serializeHistogramDataPoint(A, q, K) {
            let Y = "";
            A = th8(A, q);
            let {
                attributes: z,
                value: _
            } = K, w = (0, US4.hrTimeToMilliseconds)(K.endTime);
            for (let j of ["count", "sum"]) {
                let J = _[j];
                if (J != null) Y += Tf1(A + "_" + j, z, J, this._appendTimestamp ? w : void 0, this._additionalAttributes)
            }
            let O = 0,
                $ = _.buckets.counts.entries(),
                H = !1;
            for (let [j, J] of $) {
                O += J;
                let M = _.buckets.boundaries[j];
                if (M === void 0 && H) break;
                if (M === 1 / 0) H = !0;
                Y += Tf1(A + "_bucket", z, O, this._appendTimestamp ? w : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
                    le: M === void 0 || M === 1 / 0 ? "+Inf" : String(M)
                }))
            }
            return Y
        }
        _serializeResource(A) {
            if (this._withoutTargetInfo === !0) return "";
            let q = "target_info",
                K = `# HELP ${q} Target metadata`,
                Y = `# TYPE ${q} gauge`,
                z = Tf1(q, A.attributes, 1).trim();
            return `${K}
${Y}
${z}
`
        }
    }
    lS4.PrometheusSerializer = cS4
})
// @from(Ln 300887, Col 4)
oS4 = x((nS4) => {
    Object.defineProperty(nS4, "__esModule", {
        value: !0
    });
    nS4.PrometheusExporter = void 0;
    var lU6 = yq(),
        lzY = K9(),
        qS8 = ue(),
        izY = x6("http"),
        nzY = AS8(),
        rzY = x6("url");
    class gc extends qS8.MetricReader {
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
        constructor(A = {}, q = () => {}) {
            super({
                aggregationSelector: (z) => {
                    return {
                        type: qS8.AggregationType.DEFAULT
                    }
                },
                aggregationTemporalitySelector: (z) => qS8.AggregationTemporality.CUMULATIVE,
                metricProducers: A.metricProducers
            });
            this._host = A.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || gc.DEFAULT_OPTIONS.host, this._port = A.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || gc.DEFAULT_OPTIONS.port, this._prefix = A.prefix || gc.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof A.appendTimestamp === "boolean" ? A.appendTimestamp : gc.DEFAULT_OPTIONS.appendTimestamp;
            let K = A.withResourceConstantLabels || gc.DEFAULT_OPTIONS.withResourceConstantLabels,
                Y = A.withoutTargetInfo || gc.DEFAULT_OPTIONS.withoutTargetInfo;
            if (this._server = (0, izY.createServer)(this._requestHandler).unref(), this._serializer = new nzY.PrometheusSerializer(this._prefix, this._appendTimestamp, K, Y), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (A.endpoint || gc.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), A.preventServerStart !== !0) this.startServer().then(q, (z) => {
                lU6.diag.error(z), q(z)
            });
            else if (q) queueMicrotask(q)
        }
        async onForceFlush() {}
        onShutdown() {
            return this.stopServer()
        }
        stopServer() {
            if (!this._server) return lU6.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
            else return new Promise((A) => {
                this._server.close((q) => {
                    if (!q) lU6.diag.debug("Prometheus exporter was stopped");
                    else if (q.code !== "ERR_SERVER_NOT_RUNNING")(0, lzY.globalErrorHandler)(q);
                    A()
                })
            })
        }
        startServer() {
            return this._startServerPromise ??= new Promise((A, q) => {
                this._server.once("error", q), this._server.listen({
                    port: this._port,
                    host: this._host
                }, () => {
                    lU6.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), A()
                })
            }), this._startServerPromise
        }
        getMetricsRequestHandler(A, q) {
            this._exportMetrics(q)
        }
        _requestHandler = (A, q) => {
            if (A.url != null && new rzY.URL(A.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(q);
            else this._notFound(q)
        };
        _exportMetrics = (A) => {
            A.statusCode = 200, A.setHeader("content-type", "text/plain"), this.collect().then((q) => {
                let {
                    resourceMetrics: K,
                    errors: Y
                } = q;
                if (Y.length) lU6.diag.error("PrometheusExporter: metrics collection errors", ...Y);
                A.end(this._serializer.serialize(K))
            }, (q) => {
                A.end(`# failed to export metrics: ${q}`)
            })
        };
        _notFound = (A) => {
            A.statusCode = 404, A.end()
        }
    }
    nS4.PrometheusExporter = gc
})
// @from(Ln 300984, Col 4)
aS4 = x((Nf1) => {
    Object.defineProperty(Nf1, "__esModule", {
        value: !0
    });
    Nf1.PrometheusSerializer = Nf1.PrometheusExporter = void 0;
    var ozY = oS4();
    Object.defineProperty(Nf1, "PrometheusExporter", {
        enumerable: !0,
        get: function() {
            return ozY.PrometheusExporter
        }
    });
    var azY = AS8();
    Object.defineProperty(Nf1, "PrometheusSerializer", {
        enumerable: !0,
        get: function() {
            return azY.PrometheusSerializer
        }
    })
})
// @from(Ln 301004, Col 4)
qC4 = x((eS4) => {
    Object.defineProperty(eS4, "__esModule", {
        value: !0
    });
    eS4.OTLPLogExporter = void 0;
    var tzY = Pg(),
        ezY = Gg(),
        sS4 = Bc();
    class tS4 extends tzY.OTLPExporterBase {
        constructor(A = {}) {
            super((0, sS4.createOtlpHttpExportDelegate)((0, sS4.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
                "Content-Type": "application/x-protobuf"
            }), ezY.ProtobufLogsSerializer))
        }
    }
    eS4.OTLPLogExporter = tS4
})
// @from(Ln 301021, Col 4)
KC4 = x((KS8) => {
    Object.defineProperty(KS8, "__esModule", {
        value: !0
    });
    KS8.OTLPLogExporter = void 0;
    var A_Y = qC4();
    Object.defineProperty(KS8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return A_Y.OTLPLogExporter
        }
    })
})
// @from(Ln 301034, Col 4)
YC4 = x((YS8) => {
    Object.defineProperty(YS8, "__esModule", {
        value: !0
    });
    YS8.OTLPLogExporter = void 0;
    var K_Y = KC4();
    Object.defineProperty(YS8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return K_Y.OTLPLogExporter
        }
    })
})
// @from(Ln 301047, Col 4)
zC4 = x((zS8) => {
    Object.defineProperty(zS8, "__esModule", {
        value: !0
    });
    zS8.OTLPLogExporter = void 0;
    var z_Y = YC4();
    Object.defineProperty(zS8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return z_Y.OTLPLogExporter
        }
    })
})
// @from(Ln 301060, Col 4)
HC4 = x((OC4) => {
    Object.defineProperty(OC4, "__esModule", {
        value: !0
    });
    OC4.OTLPLogExporter = void 0;
    var w_Y = Pg(),
        O_Y = Gg(),
        _C4 = Bc();
    class wC4 extends w_Y.OTLPExporterBase {
        constructor(A = {}) {
            super((0, _C4.createOtlpHttpExportDelegate)((0, _C4.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
                "Content-Type": "application/json"
            }), O_Y.JsonLogsSerializer))
        }
    }
    OC4.OTLPLogExporter = wC4
})
// @from(Ln 301077, Col 4)
jC4 = x((_S8) => {
    Object.defineProperty(_S8, "__esModule", {
        value: !0
    });
    _S8.OTLPLogExporter = void 0;
    var $_Y = HC4();
    Object.defineProperty(_S8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return $_Y.OTLPLogExporter
        }
    })
})
// @from(Ln 301090, Col 4)
JC4 = x((wS8) => {
    Object.defineProperty(wS8, "__esModule", {
        value: !0
    });
    wS8.OTLPLogExporter = void 0;
    var j_Y = jC4();
    Object.defineProperty(wS8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return j_Y.OTLPLogExporter
        }
    })
})
// @from(Ln 301103, Col 4)
MC4 = x((OS8) => {
    Object.defineProperty(OS8, "__esModule", {
        value: !0
    });
    OS8.OTLPLogExporter = void 0;
    var M_Y = JC4();
    Object.defineProperty(OS8, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return M_Y.OTLPLogExporter
        }
    })
})
// @from(Ln 301116, Col 4)
PC4 = x((DC4) => {
    Object.defineProperty(DC4, "__esModule", {
        value: !0
    });
    DC4.ExceptionEventName = void 0;
    DC4.ExceptionEventName = "exception"
})
// @from(Ln 301123, Col 4)
fC4 = x((ZC4) => {
    Object.defineProperty(ZC4, "__esModule", {
        value: !0
    });
    ZC4.SpanImpl = void 0;
    var cR = yq(),
        VZ = K9(),
        $Y6 = P76(),
        X_Y = PC4();
    class WC4 {
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
            code: cR.SpanStatusCode.UNSET
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
            if (this._spanContext = A.spanContext, this._performanceStartTime = VZ.otperformance.now(), this._performanceOffset = q - (this._performanceStartTime + (0, VZ.getTimeOrigin)()), this._startTimeProvided = A.startTime != null, this._spanLimits = A.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = A.spanProcessor, this.name = A.name, this.parentSpanContext = A.parentSpanContext, this.kind = A.kind, this.links = A.links || [], this.startTime = this._getTime(A.startTime ?? q), this.resource = A.resource, this.instrumentationScope = A.scope, A.attributes != null) this.setAttributes(A.attributes);
            this._spanProcessor.onStart(this, A.context)
        }
        spanContext() {
            return this._spanContext
        }
        setAttribute(A, q) {
            if (q == null || this._isSpanEnded()) return this;
            if (A.length === 0) return cR.diag.warn(`Invalid attribute key: ${A}`), this;
            if (!(0, VZ.isAttributeValue)(q)) return cR.diag.warn(`Invalid attribute value set for key: ${A}`), this;
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
            if (Y === 0) return cR.diag.warn("No events allowed."), this._droppedEventsCount++, this;
            if (Y !== void 0 && this.events.length >= Y) {
                if (this._droppedEventsCount === 0) cR.diag.debug("Dropping extra events.");
                this.events.shift(), this._droppedEventsCount++
            }
            if ((0, VZ.isTimeInput)(q)) {
                if (!(0, VZ.isTimeInput)(K)) K = q;
                q = void 0
            }
            let z = (0, VZ.sanitizeAttributes)(q);
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
                }, this.status.message != null && typeof A.message !== "string") cR.diag.warn(`Dropping invalid status.message of type '${typeof A.message}', expected 'string'`), delete this.status.message;
            return this
        }
        updateName(A) {
            if (this._isSpanEnded()) return this;
            return this.name = A, this
        }
        end(A) {
            if (this._isSpanEnded()) {
                cR.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
                return
            }
            if (this._ended = !0, this.endTime = this._getTime(A), this._duration = (0, VZ.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) cR.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
            if (this._droppedEventsCount > 0) cR.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
            this._spanProcessor.onEnd(this)
        }
        _getTime(A) {
            if (typeof A === "number" && A <= VZ.otperformance.now()) return (0, VZ.hrTime)(A + this._performanceOffset);
            if (typeof A === "number") return (0, VZ.millisToHrTime)(A);
            if (A instanceof Date) return (0, VZ.millisToHrTime)(A.getTime());
            if ((0, VZ.isTimeInputHrTime)(A)) return A;
            if (this._startTimeProvided) return (0, VZ.millisToHrTime)(Date.now());
            let q = VZ.otperformance.now() - this._performanceStartTime;
            return (0, VZ.addHrTimes)(this.startTime, (0, VZ.millisToHrTime)(q))
        }
        isRecording() {
            return this._ended === !1
        }
        recordException(A, q) {
            let K = {};
            if (typeof A === "string") K[$Y6.ATTR_EXCEPTION_MESSAGE] = A;
            else if (A) {
                if (A.code) K[$Y6.ATTR_EXCEPTION_TYPE] = A.code.toString();
                else if (A.name) K[$Y6.ATTR_EXCEPTION_TYPE] = A.name;
                if (A.message) K[$Y6.ATTR_EXCEPTION_MESSAGE] = A.message;
                if (A.stack) K[$Y6.ATTR_EXCEPTION_STACKTRACE] = A.stack
            }
            if (K[$Y6.ATTR_EXCEPTION_TYPE] || K[$Y6.ATTR_EXCEPTION_MESSAGE]) this.addEvent(X_Y.ExceptionEventName, K, q);
            else cR.diag.warn(`Failed to record an exception ${A}`)
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
                cR.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, A)
            }
            return this._ended
        }
        _truncateToLimitUtil(A, q) {
            if (A.length <= q) return A;
            return A.substring(0, q)
        }
        _truncateToSize(A) {
            let q = this._attributeValueLengthLimit;
            if (q <= 0) return cR.diag.warn(`Attribute value limit must be positive, got ${q}`), A;
            if (typeof A === "string") return this._truncateToLimitUtil(A, q);
            if (Array.isArray(A)) return A.map((K) => typeof K === "string" ? this._truncateToLimitUtil(K, q) : K);
            return A
        }
    }
    ZC4.SpanImpl = WC4
})
// @from(Ln 301288, Col 4)
iU6 = x((TC4) => {
    Object.defineProperty(TC4, "__esModule", {
        value: !0
    });
    TC4.SamplingDecision = void 0;
    var P_Y;
    (function(A) {
        A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
    })(P_Y = TC4.SamplingDecision || (TC4.SamplingDecision = {}))
})
// @from(Ln 301298, Col 4)
Vf1 = x((NC4) => {
    Object.defineProperty(NC4, "__esModule", {
        value: !0
    });
    NC4.AlwaysOffSampler = void 0;
    var W_Y = iU6();
    class vC4 {
        shouldSample() {
            return {
                decision: W_Y.SamplingDecision.NOT_RECORD
            }
        }
        toString() {
            return "AlwaysOffSampler"
        }
    }
    NC4.AlwaysOffSampler = vC4
})
// @from(Ln 301316, Col 4)
kf1 = x((EC4) => {
    Object.defineProperty(EC4, "__esModule", {
        value: !0
    });
    EC4.AlwaysOnSampler = void 0;
    var Z_Y = iU6();
    class kC4 {
        shouldSample() {
            return {
                decision: Z_Y.SamplingDecision.RECORD_AND_SAMPLED
            }
        }
        toString() {
            return "AlwaysOnSampler"
        }
    }
    EC4.AlwaysOnSampler = kC4
})
// @from(Ln 301334, Col 4)
jS8 = x((hC4) => {
    Object.defineProperty(hC4, "__esModule", {
        value: !0
    });
    hC4.ParentBasedSampler = void 0;
    var Ef1 = yq(),
        G_Y = K9(),
        LC4 = Vf1(),
        HS8 = kf1();
    class RC4 {
        _root;
        _remoteParentSampled;
        _remoteParentNotSampled;
        _localParentSampled;
        _localParentNotSampled;
        constructor(A) {
            if (this._root = A.root, !this._root)(0, G_Y.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new HS8.AlwaysOnSampler;
            this._remoteParentSampled = A.remoteParentSampled ?? new HS8.AlwaysOnSampler, this._remoteParentNotSampled = A.remoteParentNotSampled ?? new LC4.AlwaysOffSampler, this._localParentSampled = A.localParentSampled ?? new HS8.AlwaysOnSampler, this._localParentNotSampled = A.localParentNotSampled ?? new LC4.AlwaysOffSampler
        }
        shouldSample(A, q, K, Y, z, _) {
            let w = Ef1.trace.getSpanContext(A);
            if (!w || !(0, Ef1.isSpanContextValid)(w)) return this._root.shouldSample(A, q, K, Y, z, _);
            if (w.isRemote) {
                if (w.traceFlags & Ef1.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(A, q, K, Y, z, _);
                return this._remoteParentNotSampled.shouldSample(A, q, K, Y, z, _)
            }
            if (w.traceFlags & Ef1.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(A, q, K, Y, z, _);
            return this._localParentNotSampled.shouldSample(A, q, K, Y, z, _)
        }
        toString() {
            return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
        }
    }
    hC4.ParentBasedSampler = RC4
})
// @from(Ln 301369, Col 4)
JS8 = x((bC4) => {
    Object.defineProperty(bC4, "__esModule", {
        value: !0
    });
    bC4.TraceIdRatioBasedSampler = void 0;
    var f_Y = yq(),
        CC4 = iU6();
    class IC4 {
        _ratio;
        _upperBound;
        constructor(A = 0) {
            this._ratio = A, this._ratio = this._normalize(A), this._upperBound = Math.floor(this._ratio * 4294967295)
        }
        shouldSample(A, q) {
            return {
                decision: (0, f_Y.isValidTraceId)(q) && this._accumulate(q) < this._upperBound ? CC4.SamplingDecision.RECORD_AND_SAMPLED : CC4.SamplingDecision.NOT_RECORD
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
    bC4.TraceIdRatioBasedSampler = IC4
})
// @from(Ln 301406, Col 4)
XS8 = x((FC4) => {
    Object.defineProperty(FC4, "__esModule", {
        value: !0
    });
    FC4.buildSamplerFromEnv = FC4.loadDefaultConfig = void 0;
    var DS8 = yq(),
        Tg = K9(),
        uC4 = Vf1(),
        MS8 = kf1(),
        yf1 = jS8(),
        mC4 = JS8(),
        vg;
    (function(A) {
        A.AlwaysOff = "always_off", A.AlwaysOn = "always_on", A.ParentBasedAlwaysOff = "parentbased_always_off", A.ParentBasedAlwaysOn = "parentbased_always_on", A.ParentBasedTraceIdRatio = "parentbased_traceidratio", A.TraceIdRatio = "traceidratio"
    })(vg || (vg = {}));
    var Lf1 = 1;

    function T_Y() {
        return {
            sampler: gC4(),
            forceFlushTimeoutMillis: 30000,
            generalLimits: {
                attributeValueLengthLimit: (0, Tg.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
                attributeCountLimit: (0, Tg.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
            },
            spanLimits: {
                attributeValueLengthLimit: (0, Tg.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
                attributeCountLimit: (0, Tg.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
                linkCountLimit: (0, Tg.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
                eventCountLimit: (0, Tg.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
                attributePerEventCountLimit: (0, Tg.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
                attributePerLinkCountLimit: (0, Tg.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
            }
        }
    }
    FC4.loadDefaultConfig = T_Y;

    function gC4() {
        let A = (0, Tg.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? vg.ParentBasedAlwaysOn;
        switch (A) {
            case vg.AlwaysOn:
                return new MS8.AlwaysOnSampler;
            case vg.AlwaysOff:
                return new uC4.AlwaysOffSampler;
            case vg.ParentBasedAlwaysOn:
                return new yf1.ParentBasedSampler({
                    root: new MS8.AlwaysOnSampler
                });
            case vg.ParentBasedAlwaysOff:
                return new yf1.ParentBasedSampler({
                    root: new uC4.AlwaysOffSampler
                });
            case vg.TraceIdRatio:
                return new mC4.TraceIdRatioBasedSampler(BC4());
            case vg.ParentBasedTraceIdRatio:
                return new yf1.ParentBasedSampler({
                    root: new mC4.TraceIdRatioBasedSampler(BC4())
                });
            default:
                return DS8.diag.error(`OTEL_TRACES_SAMPLER value "${A}" invalid, defaulting to "${vg.ParentBasedAlwaysOn}".`), new yf1.ParentBasedSampler({
                    root: new MS8.AlwaysOnSampler
                })
        }
    }
    FC4.buildSamplerFromEnv = gC4;

    function BC4() {
        let A = (0, Tg.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
        if (A == null) return DS8.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${Lf1}.`), Lf1;
        if (A < 0 || A > 1) return DS8.diag.error(`OTEL_TRACES_SAMPLER_ARG=${A} was given, but it is out of range ([0..1]), defaulting to ${Lf1}.`), Lf1;
        return A
    }
})
// @from(Ln 301479, Col 4)
PS8 = x((UC4) => {
    Object.defineProperty(UC4, "__esModule", {
        value: !0
    });
    UC4.reconfigureLimits = UC4.mergeConfig = UC4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = UC4.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
    var QC4 = XS8(),
        Rf1 = K9();
    UC4.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
    UC4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

    function N_Y(A) {
        let q = {
                sampler: (0, QC4.buildSamplerFromEnv)()
            },
            K = (0, QC4.loadDefaultConfig)(),
            Y = Object.assign({}, K, q, A);
        return Y.generalLimits = Object.assign({}, K.generalLimits, A.generalLimits || {}), Y.spanLimits = Object.assign({}, K.spanLimits, A.spanLimits || {}), Y
    }
    UC4.mergeConfig = N_Y;

    function V_Y(A) {
        let q = Object.assign({}, A.spanLimits);
        return q.attributeCountLimit = A.spanLimits?.attributeCountLimit ?? A.generalLimits?.attributeCountLimit ?? (0, Rf1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, Rf1.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? UC4.DEFAULT_ATTRIBUTE_COUNT_LIMIT, q.attributeValueLengthLimit = A.spanLimits?.attributeValueLengthLimit ?? A.generalLimits?.attributeValueLengthLimit ?? (0, Rf1.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, Rf1.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? UC4.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, A, {
            spanLimits: q
        })
    }
    UC4.reconfigureLimits = V_Y
})
// @from(Ln 301507, Col 4)
oC4 = x((nC4) => {
    Object.defineProperty(nC4, "__esModule", {
        value: !0
    });
    nC4.BatchSpanProcessorBase = void 0;
    var vG6 = yq(),
        Fc = K9();
    class iC4 {
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
            if (this._exporter = A, this._maxExportBatchSize = typeof q?.maxExportBatchSize === "number" ? q.maxExportBatchSize : (0, Fc.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof q?.maxQueueSize === "number" ? q.maxQueueSize : (0, Fc.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof q?.scheduledDelayMillis === "number" ? q.scheduledDelayMillis : (0, Fc.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof q?.exportTimeoutMillis === "number" ? q.exportTimeoutMillis : (0, Fc.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new Fc.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) vG6.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
        }
        forceFlush() {
            if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
            return this._flushAll()
        }
        onStart(A, q) {}
        onEnd(A) {
            if (this._shutdownOnce.isCalled) return;
            if ((A.spanContext().traceFlags & vG6.TraceFlags.SAMPLED) === 0) return;
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
                if (this._droppedSpansCount === 0) vG6.diag.debug("maxQueueSize reached, dropping spans");
                this._droppedSpansCount++;
                return
            }
            if (this._droppedSpansCount > 0) vG6.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
            this._finishedSpans.push(A), this._maybeStartTimer()
        }
        _flushAll() {
            return new Promise((A, q) => {
                let K = [],
                    Y = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
                for (let z = 0, _ = Y; z < _; z++) K.push(this._flushOneBatch());
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
                vG6.context.with((0, Fc.suppressTracing)(vG6.context.active()), () => {
                    let Y;
                    if (this._finishedSpans.length <= this._maxExportBatchSize) Y = this._finishedSpans, this._finishedSpans = [];
                    else Y = this._finishedSpans.splice(0, this._maxExportBatchSize);
                    let z = () => this._exporter.export(Y, (w) => {
                            if (clearTimeout(K), w.code === Fc.ExportResultCode.SUCCESS) A();
                            else q(w.error ?? Error("BatchSpanProcessor: span export failed"))
                        }),
                        _ = null;
                    for (let w = 0, O = Y.length; w < O; w++) {
                        let $ = Y[w];
                        if ($.resource.asyncAttributesPending && $.resource.waitForAsyncAttributes) _ ??= [], _.push($.resource.waitForAsyncAttributes())
                    }
                    if (_ === null) z();
                    else Promise.all(_).then(z, (w) => {
                        (0, Fc.globalErrorHandler)(w), q(w)
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
                    this._isExporting = !1, (0, Fc.globalErrorHandler)(q)
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
    nC4.BatchSpanProcessorBase = iC4
})
// @from(Ln 301614, Col 4)
eC4 = x((sC4) => {
    Object.defineProperty(sC4, "__esModule", {
        value: !0
    });
    sC4.BatchSpanProcessor = void 0;
    var E_Y = oC4();
    class aC4 extends E_Y.BatchSpanProcessorBase {
        onShutdown() {}
    }
    sC4.BatchSpanProcessor = aC4
})
// @from(Ln 301625, Col 4)
_I4 = x((YI4) => {
    Object.defineProperty(YI4, "__esModule", {
        value: !0
    });
    YI4.RandomIdGenerator = void 0;
    var y_Y = 8,
        qI4 = 16;
    class KI4 {
        generateTraceId = AI4(qI4);
        generateSpanId = AI4(y_Y)
    }
    YI4.RandomIdGenerator = KI4;
    var hf1 = Buffer.allocUnsafe(qI4);

    function AI4(A) {
        return function() {
            for (let K = 0; K < A / 4; K++) hf1.writeUInt32BE(Math.random() * 4294967296 >>> 0, K * 4);
            for (let K = 0; K < A; K++)
                if (hf1[K] > 0) break;
                else if (K === A - 1) hf1[A - 1] = 1;
            return hf1.toString("hex", 0, A)
        }
    }
})
// @from(Ln 301649, Col 4)
wI4 = x((Sf1) => {
    Object.defineProperty(Sf1, "__esModule", {
        value: !0
    });
    Sf1.RandomIdGenerator = Sf1.BatchSpanProcessor = void 0;
    var L_Y = eC4();
    Object.defineProperty(Sf1, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return L_Y.BatchSpanProcessor
        }
    });
    var R_Y = _I4();
    Object.defineProperty(Sf1, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return R_Y.RandomIdGenerator
        }
    })
})
// @from(Ln 301669, Col 4)
WS8 = x((Cf1) => {
    Object.defineProperty(Cf1, "__esModule", {
        value: !0
    });
    Cf1.RandomIdGenerator = Cf1.BatchSpanProcessor = void 0;
    var OI4 = wI4();
    Object.defineProperty(Cf1, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return OI4.BatchSpanProcessor
        }
    });
    Object.defineProperty(Cf1, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return OI4.RandomIdGenerator
        }
    })
})
// @from(Ln 301688, Col 4)
JI4 = x((HI4) => {
    Object.defineProperty(HI4, "__esModule", {
        value: !0
    });
    HI4.Tracer = void 0;
    var v0 = yq(),
        If1 = K9(),
        C_Y = fC4(),
        I_Y = PS8(),
        b_Y = WS8();
    class $I4 {
        _sampler;
        _generalLimits;
        _spanLimits;
        _idGenerator;
        instrumentationScope;
        _resource;
        _spanProcessor;
        constructor(A, q, K, Y) {
            let z = (0, I_Y.mergeConfig)(q);
            this._sampler = z.sampler, this._generalLimits = z.generalLimits, this._spanLimits = z.spanLimits, this._idGenerator = q.idGenerator || new b_Y.RandomIdGenerator, this._resource = K, this._spanProcessor = Y, this.instrumentationScope = A
        }
        startSpan(A, q = {}, K = v0.context.active()) {
            if (q.root) K = v0.trace.deleteSpan(K);
            let Y = v0.trace.getSpan(K);
            if ((0, If1.isTracingSuppressed)(K)) return v0.diag.debug("Instrumentation suppressed, returning Noop Span"), v0.trace.wrapSpanContext(v0.INVALID_SPAN_CONTEXT);
            let z = Y?.spanContext(),
                _ = this._idGenerator.generateSpanId(),
                w, O, $;
            if (!z || !v0.trace.isSpanContextValid(z)) O = this._idGenerator.generateTraceId();
            else O = z.traceId, $ = z.traceState, w = z;
            let H = q.kind ?? v0.SpanKind.INTERNAL,
                j = (q.links ?? []).map((Z) => {
                    return {
                        context: Z.context,
                        attributes: (0, If1.sanitizeAttributes)(Z.attributes)
                    }
                }),
                J = (0, If1.sanitizeAttributes)(q.attributes),
                M = this._sampler.shouldSample(K, O, A, H, J, j);
            $ = M.traceState ?? $;
            let D = M.decision === v0.SamplingDecision.RECORD_AND_SAMPLED ? v0.TraceFlags.SAMPLED : v0.TraceFlags.NONE,
                X = {
                    traceId: O,
                    spanId: _,
                    traceFlags: D,
                    traceState: $
                };
            if (M.decision === v0.SamplingDecision.NOT_RECORD) return v0.diag.debug("Recording is off, propagating context in a non-recording span"), v0.trace.wrapSpanContext(X);
            let P = (0, If1.sanitizeAttributes)(Object.assign(J, M.attributes));
            return new C_Y.SpanImpl({
                resource: this._resource,
                scope: this.instrumentationScope,
                context: K,
                spanContext: X,
                name: A,
                kind: H,
                links: j,
                parentSpanContext: w,
                attributes: P,
                startTime: q.startTime,
                spanProcessor: this._spanProcessor,
                spanLimits: this._spanLimits
            })
        }
        startActiveSpan(A, q, K, Y) {
            let z, _, w;
            if (arguments.length < 2) return;
            else if (arguments.length === 2) w = q;
            else if (arguments.length === 3) z = q, w = K;
            else z = q, _ = K, w = Y;
            let O = _ ?? v0.context.active(),
                $ = this.startSpan(A, z, O),
                H = v0.trace.setSpan(O, $);
            return v0.context.with(H, w, void 0, $)
        }
        getGeneralLimits() {
            return this._generalLimits
        }
        getSpanLimits() {
            return this._spanLimits
        }
    }
    HI4.Tracer = $I4
})
// @from(Ln 301773, Col 4)
PI4 = x((DI4) => {
    Object.defineProperty(DI4, "__esModule", {
        value: !0
    });
    DI4.MultiSpanProcessor = void 0;
    var x_Y = K9();
    class MI4 {
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
                    (0, x_Y.globalErrorHandler)(K || Error("MultiSpanProcessor: forceFlush failed")), q()
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
    DI4.MultiSpanProcessor = MI4
})
// @from(Ln 301813, Col 4)
TI4 = x((GI4) => {
    Object.defineProperty(GI4, "__esModule", {
        value: !0
    });
    GI4.BasicTracerProvider = GI4.ForceFlushState = void 0;
    var u_Y = K9(),
        m_Y = KH6(),
        B_Y = JI4(),
        g_Y = XS8(),
        F_Y = PI4(),
        p_Y = PS8(),
        NG6;
    (function(A) {
        A[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved"
    })(NG6 = GI4.ForceFlushState || (GI4.ForceFlushState = {}));
    class ZI4 {
        _config;
        _tracers = new Map;
        _resource;
        _activeSpanProcessor;
        constructor(A = {}) {
            let q = (0, u_Y.merge)({}, (0, g_Y.loadDefaultConfig)(), (0, p_Y.reconfigureLimits)(A));
            this._resource = q.resource ?? (0, m_Y.defaultResource)(), this._config = Object.assign({}, q, {
                resource: this._resource
            });
            let K = [];
            if (A.spanProcessors?.length) K.push(...A.spanProcessors);
            this._activeSpanProcessor = new F_Y.MultiSpanProcessor(K)
        }
        getTracer(A, q, K) {
            let Y = `${A}@${q||""}:${K?.schemaUrl||""}`;
            if (!this._tracers.has(Y)) this._tracers.set(Y, new B_Y.Tracer({
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
                        let z, _ = setTimeout(() => {
                            Y(Error(`Span processor did not completed within timeout period of ${A} ms`)), z = NG6.timeout
                        }, A);
                        K.forceFlush().then(() => {
                            if (clearTimeout(_), z !== NG6.timeout) z = NG6.resolved, Y(z)
                        }).catch((w) => {
                            clearTimeout(_), z = NG6.error, Y(w)
                        })
                    })
                });
            return new Promise((K, Y) => {
                Promise.all(q).then((z) => {
                    let _ = z.filter((w) => w !== NG6.resolved);
                    if (_.length > 0) Y(_);
                    else K()
                }).catch((z) => Y([z]))
            })
        }
        shutdown() {
            return this._activeSpanProcessor.shutdown()
        }
    }
    GI4.BasicTracerProvider = ZI4
})
// @from(Ln 301879, Col 4)
kI4 = x((NI4) => {
    Object.defineProperty(NI4, "__esModule", {
        value: !0
    });
    NI4.ConsoleSpanExporter = void 0;
    var ZS8 = K9();
    class vI4 {
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
                timestamp: (0, ZS8.hrTimeToMicroseconds)(A.startTime),
                duration: (0, ZS8.hrTimeToMicroseconds)(A.duration),
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
                code: ZS8.ExportResultCode.SUCCESS
            })
        }
    }
    NI4.ConsoleSpanExporter = vI4
})
// @from(Ln 301926, Col 4)
hI4 = x((LI4) => {
    Object.defineProperty(LI4, "__esModule", {
        value: !0
    });
    LI4.InMemorySpanExporter = void 0;
    var EI4 = K9();
    class yI4 {
        _finishedSpans = [];
        _stopped = !1;
        export (A, q) {
            if (this._stopped) return q({
                code: EI4.ExportResultCode.FAILED,
                error: Error("Exporter has been stopped")
            });
            this._finishedSpans.push(...A), setTimeout(() => q({
                code: EI4.ExportResultCode.SUCCESS
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
    LI4.InMemorySpanExporter = yI4
})
// @from(Ln 301959, Col 4)
bI4 = x((CI4) => {
    Object.defineProperty(CI4, "__esModule", {
        value: !0
    });
    CI4.SimpleSpanProcessor = void 0;
    var Q_Y = yq(),
        bf1 = K9();
    class SI4 {
        _exporter;
        _shutdownOnce;
        _pendingExports;
        constructor(A) {
            this._exporter = A, this._shutdownOnce = new bf1.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
        }
        async forceFlush() {
            if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
        }
        onStart(A, q) {}
        onEnd(A) {
            if (this._shutdownOnce.isCalled) return;
            if ((A.spanContext().traceFlags & Q_Y.TraceFlags.SAMPLED) === 0) return;
            let q = this._doExport(A).catch((K) => (0, bf1.globalErrorHandler)(K));
            this._pendingExports.add(q), q.finally(() => this._pendingExports.delete(q))
        }
        async _doExport(A) {
            if (A.resource.asyncAttributesPending) await A.resource.waitForAsyncAttributes?.();
            let q = await bf1.internal._export(this._exporter, [A]);
            if (q.code !== bf1.ExportResultCode.SUCCESS) throw q.error ?? Error(`SimpleSpanProcessor: span export failed (status ${q})`)
        }
        shutdown() {
            return this._shutdownOnce.call()
        }
        _shutdown() {
            return this._exporter.shutdown()
        }
    }
    CI4.SimpleSpanProcessor = SI4
})
// @from(Ln 301997, Col 4)
BI4 = x((uI4) => {
    Object.defineProperty(uI4, "__esModule", {
        value: !0
    });
    uI4.NoopSpanProcessor = void 0;
    class xI4 {
        onStart(A, q) {}
        onEnd(A) {}
        shutdown() {
            return Promise.resolve()
        }
        forceFlush() {
            return Promise.resolve()
        }
    }
    uI4.NoopSpanProcessor = xI4
})
// @from(Ln 302014, Col 4)
FI4 = x((YN) => {
    Object.defineProperty(YN, "__esModule", {
        value: !0
    });
    YN.SamplingDecision = YN.TraceIdRatioBasedSampler = YN.ParentBasedSampler = YN.AlwaysOnSampler = YN.AlwaysOffSampler = YN.NoopSpanProcessor = YN.SimpleSpanProcessor = YN.InMemorySpanExporter = YN.ConsoleSpanExporter = YN.RandomIdGenerator = YN.BatchSpanProcessor = YN.BasicTracerProvider = void 0;
    var U_Y = TI4();
    Object.defineProperty(YN, "BasicTracerProvider", {
        enumerable: !0,
        get: function() {
            return U_Y.BasicTracerProvider
        }
    });
    var gI4 = WS8();
    Object.defineProperty(YN, "BatchSpanProcessor", {
        enumerable: !0,
        get: function() {
            return gI4.BatchSpanProcessor
        }
    });
    Object.defineProperty(YN, "RandomIdGenerator", {
        enumerable: !0,
        get: function() {
            return gI4.RandomIdGenerator
        }
    });
    var d_Y = kI4();
    Object.defineProperty(YN, "ConsoleSpanExporter", {
        enumerable: !0,
        get: function() {
            return d_Y.ConsoleSpanExporter
        }
    });
    var c_Y = hI4();
    Object.defineProperty(YN, "InMemorySpanExporter", {
        enumerable: !0,
        get: function() {
            return c_Y.InMemorySpanExporter
        }
    });
    var l_Y = bI4();
    Object.defineProperty(YN, "SimpleSpanProcessor", {
        enumerable: !0,
        get: function() {
            return l_Y.SimpleSpanProcessor
        }
    });
    var i_Y = BI4();
    Object.defineProperty(YN, "NoopSpanProcessor", {
        enumerable: !0,
        get: function() {
            return i_Y.NoopSpanProcessor
        }
    });
    var n_Y = Vf1();
    Object.defineProperty(YN, "AlwaysOffSampler", {
        enumerable: !0,
        get: function() {
            return n_Y.AlwaysOffSampler
        }
    });
    var r_Y = kf1();
    Object.defineProperty(YN, "AlwaysOnSampler", {
        enumerable: !0,
        get: function() {
            return r_Y.AlwaysOnSampler
        }
    });
    var o_Y = jS8();
    Object.defineProperty(YN, "ParentBasedSampler", {
        enumerable: !0,
        get: function() {
            return o_Y.ParentBasedSampler
        }
    });
    var a_Y = JS8();
    Object.defineProperty(YN, "TraceIdRatioBasedSampler", {
        enumerable: !0,
        get: function() {
            return a_Y.TraceIdRatioBasedSampler
        }
    });
    var s_Y = iU6();
    Object.defineProperty(YN, "SamplingDecision", {
        enumerable: !0,
        get: function() {
            return s_Y.SamplingDecision
        }
    })
})
// @from(Ln 302103, Col 4)
cI4 = x((UI4) => {
    Object.defineProperty(UI4, "__esModule", {
        value: !0
    });
    UI4.OTLPTraceExporter = void 0;
    var e_Y = Pg(),
        A2Y = Gg(),
        pI4 = Bc();
    class QI4 extends e_Y.OTLPExporterBase {
        constructor(A = {}) {
            super((0, pI4.createOtlpHttpExportDelegate)((0, pI4.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
                "Content-Type": "application/x-protobuf"
            }), A2Y.ProtobufTraceSerializer))
        }
    }
    UI4.OTLPTraceExporter = QI4
})
// @from(Ln 302120, Col 4)
lI4 = x((GS8) => {
    Object.defineProperty(GS8, "__esModule", {
        value: !0
    });
    GS8.OTLPTraceExporter = void 0;
    var q2Y = cI4();
    Object.defineProperty(GS8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return q2Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 302133, Col 4)
iI4 = x((fS8) => {
    Object.defineProperty(fS8, "__esModule", {
        value: !0
    });
    fS8.OTLPTraceExporter = void 0;
    var Y2Y = lI4();
    Object.defineProperty(fS8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return Y2Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 302146, Col 4)
nI4 = x((TS8) => {
    Object.defineProperty(TS8, "__esModule", {
        value: !0
    });
    TS8.OTLPTraceExporter = void 0;
    var _2Y = iI4();
    Object.defineProperty(TS8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return _2Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 302159, Col 4)
tI4 = x((aI4) => {
    Object.defineProperty(aI4, "__esModule", {
        value: !0
    });
    aI4.OTLPTraceExporter = void 0;
    var O2Y = Pg(),
        $2Y = Gg(),
        rI4 = Bc();
    class oI4 extends O2Y.OTLPExporterBase {
        constructor(A = {}) {
            super((0, rI4.createOtlpHttpExportDelegate)((0, rI4.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
                "Content-Type": "application/json"
            }), $2Y.JsonTraceSerializer))
        }
    }
    aI4.OTLPTraceExporter = oI4
})
// @from(Ln 302176, Col 4)
eI4 = x((vS8) => {
    Object.defineProperty(vS8, "__esModule", {
        value: !0
    });
    vS8.OTLPTraceExporter = void 0;
    var H2Y = tI4();
    Object.defineProperty(vS8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return H2Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 302189, Col 4)
Ab4 = x((NS8) => {
    Object.defineProperty(NS8, "__esModule", {
        value: !0
    });
    NS8.OTLPTraceExporter = void 0;
    var J2Y = eI4();
    Object.defineProperty(NS8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return J2Y.OTLPTraceExporter
        }
    })
})