
// @from(Ln 305417, Col 4)
gs4 = p((ps4) => {
    Object.defineProperty(ps4, "__esModule", {
        value: !0
    });
    ps4.hexToBinary = void 0;

    function Bs4(q) {
        if (q >= 48 && q <= 57) return q - 48;
        if (q >= 97 && q <= 102) return q - 87;
        return q - 55
    }

    function QCz(q) {
        let K = new Uint8Array(q.length / 2),
            _ = 0;
        for (let z = 0; z < q.length; z += 2) {
            let Y = Bs4(q.charCodeAt(z)),
                A = Bs4(q.charCodeAt(z + 1));
            K[_++] = Y << 4 | A
        }
        return K
    }
    ps4.hexToBinary = QCz
})
// @from(Ln 305441, Col 4)
Nm8 = p((ls4) => {
    Object.defineProperty(ls4, "__esModule", {
        value: !0
    });
    ls4.getOtlpEncoder = ls4.encodeAsString = ls4.encodeAsLongBits = ls4.toLongBits = ls4.hrTimeToNanos = void 0;
    var dCz = t_(),
        cs1 = gs4();

    function ls1(q) {
        let K = BigInt(1e9);
        return BigInt(Math.trunc(q[0])) * K + BigInt(Math.trunc(q[1]))
    }
    ls4.hrTimeToNanos = ls1;

    function Qs4(q) {
        let K = Number(BigInt.asUintN(32, q)),
            _ = Number(BigInt.asUintN(32, q >> BigInt(32)));
        return {
            low: K,
            high: _
        }
    }
    ls4.toLongBits = Qs4;

    function ns1(q) {
        let K = ls1(q);
        return Qs4(K)
    }
    ls4.encodeAsLongBits = ns1;

    function ds4(q) {
        return ls1(q).toString()
    }
    ls4.encodeAsString = ds4;
    var cCz = typeof BigInt < "u" ? ds4 : dCz.hrTimeToNanoseconds;

    function Us4(q) {
        return q
    }

    function cs4(q) {
        if (q === void 0) return;
        return (0, cs1.hexToBinary)(q)
    }
    var lCz = {
        encodeHrTime: ns1,
        encodeSpanContext: cs1.hexToBinary,
        encodeOptionalSpanContext: cs4
    };

    function nCz(q) {
        if (q === void 0) return lCz;
        let K = q.useLongBits ?? !0,
            _ = q.useHex ?? !1;
        return {
            encodeHrTime: K ? ns1 : cCz,
            encodeSpanContext: _ ? Us4 : cs1.hexToBinary,
            encodeOptionalSpanContext: _ ? Us4 : cs4
        }
    }
    ls4.getOtlpEncoder = nCz
})
// @from(Ln 305503, Col 4)
Em8 = p((rs4) => {
    Object.defineProperty(rs4, "__esModule", {
        value: !0
    });
    rs4.toAnyValue = rs4.toKeyValue = rs4.toAttributes = rs4.createInstrumentationScope = rs4.createResource = void 0;

    function sCz(q) {
        let K = {
                attributes: is4(q.attributes),
                droppedAttributesCount: 0
            },
            _ = q.schemaUrl;
        if (_ && _ !== "") K.schemaUrl = _;
        return K
    }
    rs4.createResource = sCz;

    function tCz(q) {
        return {
            name: q.name,
            version: q.version
        }
    }
    rs4.createInstrumentationScope = tCz;

    function is4(q) {
        return Object.keys(q).map((K) => is1(K, q[K]))
    }
    rs4.toAttributes = is4;

    function is1(q, K) {
        return {
            key: q,
            value: rs1(K)
        }
    }
    rs4.toKeyValue = is1;

    function rs1(q) {
        let K = typeof q;
        if (K === "string") return {
            stringValue: q
        };
        if (K === "number") {
            if (!Number.isInteger(q)) return {
                doubleValue: q
            };
            return {
                intValue: q
            }
        }
        if (K === "boolean") return {
            boolValue: q
        };
        if (q instanceof Uint8Array) return {
            bytesValue: q
        };
        if (Array.isArray(q)) return {
            arrayValue: {
                values: q.map(rs1)
            }
        };
        if (K === "object" && q != null) return {
            kvlistValue: {
                values: Object.entries(q).map(([_, z]) => is1(_, z))
            }
        };
        return {}
    }
    rs4.toAnyValue = rs1
})
// @from(Ln 305574, Col 4)
os1 = p((ss4) => {
    Object.defineProperty(ss4, "__esModule", {
        value: !0
    });
    ss4.toLogAttributes = ss4.createExportLogsServiceRequest = void 0;
    var zbz = Nm8(),
        ym8 = Em8();

    function Ybz(q, K) {
        let _ = (0, zbz.getOtlpEncoder)(K);
        return {
            resourceLogs: Obz(q, _)
        }
    }
    ss4.createExportLogsServiceRequest = Ybz;

    function Abz(q) {
        let K = new Map;
        for (let _ of q) {
            let {
                resource: z,
                instrumentationScope: {
                    name: Y,
                    version: A = "",
                    schemaUrl: O = ""
                }
            } = _, w = K.get(z);
            if (!w) w = new Map, K.set(z, w);
            let $ = `${Y}@${A}:${O}`,
                j = w.get($);
            if (!j) j = [], w.set($, j);
            j.push(_)
        }
        return K
    }

    function Obz(q, K) {
        let _ = Abz(q);
        return Array.from(_, ([z, Y]) => {
            let A = (0, ym8.createResource)(z);
            return {
                resource: A,
                scopeLogs: Array.from(Y, ([, O]) => {
                    return {
                        scope: (0, ym8.createInstrumentationScope)(O[0].instrumentationScope),
                        logRecords: O.map((w) => wbz(w, K)),
                        schemaUrl: O[0].instrumentationScope.schemaUrl
                    }
                }),
                schemaUrl: A.schemaUrl
            }
        })
    }

    function wbz(q, K) {
        return {
            timeUnixNano: K.encodeHrTime(q.hrTime),
            observedTimeUnixNano: K.encodeHrTime(q.hrTimeObserved),
            severityNumber: $bz(q.severityNumber),
            severityText: q.severityText,
            body: (0, ym8.toAnyValue)(q.body),
            eventName: q.eventName,
            attributes: as4(q.attributes),
            droppedAttributesCount: q.droppedAttributesCount,
            flags: q.spanContext?.traceFlags,
            traceId: K.encodeOptionalSpanContext(q.spanContext?.traceId),
            spanId: K.encodeOptionalSpanContext(q.spanContext?.spanId)
        }
    }

    function $bz(q) {
        return q
    }

    function as4(q) {
        return Object.keys(q).map((K) => (0, ym8.toKeyValue)(K, q[K]))
    }
    ss4.toLogAttributes = as4
})
// @from(Ln 305653, Col 4)
_t4 = p((qt4) => {
    Object.defineProperty(qt4, "__esModule", {
        value: !0
    });
    qt4.ProtobufLogsSerializer = void 0;
    var es4 = km8(),
        Hbz = os1(),
        Jbz = es4.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse,
        Xbz = es4.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
    qt4.ProtobufLogsSerializer = {
        serializeRequest: (q) => {
            let K = (0, Hbz.createExportLogsServiceRequest)(q);
            return Xbz.encode(K).finish()
        },
        deserializeResponse: (q) => {
            return Jbz.decode(q)
        }
    }
})
// @from(Ln 305672, Col 4)
zt4 = p((as1) => {
    Object.defineProperty(as1, "__esModule", {
        value: !0
    });
    as1.ProtobufLogsSerializer = void 0;
    var Mbz = _t4();
    Object.defineProperty(as1, "ProtobufLogsSerializer", {
        enumerable: !0,
        get: function() {
            return Mbz.ProtobufLogsSerializer
        }
    })
})
// @from(Ln 305685, Col 4)
At4 = p((Yt4) => {
    Object.defineProperty(Yt4, "__esModule", {
        value: !0
    });
    Yt4.EAggregationTemporality = void 0;
    var Wbz;
    (function(q) {
        q[q.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED", q[q.AGGREGATION_TEMPORALITY_DELTA = 1] = "AGGREGATION_TEMPORALITY_DELTA", q[q.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"
    })(Wbz = Yt4.EAggregationTemporality || (Yt4.EAggregationTemporality = {}))
})
// @from(Ln 305695, Col 4)
ts1 = p((Xt4) => {
    Object.defineProperty(Xt4, "__esModule", {
        value: !0
    });
    Xt4.createExportMetricsServiceRequest = Xt4.toMetric = Xt4.toScopeMetrics = Xt4.toResourceMetrics = void 0;
    var Ot4 = $5(),
        HS6 = pJ6(),
        wt4 = At4(),
        Dbz = Nm8(),
        g78 = Em8();

    function jt4(q, K) {
        let _ = (0, Dbz.getOtlpEncoder)(K),
            z = (0, g78.createResource)(q.resource);
        return {
            resource: z,
            schemaUrl: z.schemaUrl,
            scopeMetrics: Ht4(q.scopeMetrics, _)
        }
    }
    Xt4.toResourceMetrics = jt4;

    function Ht4(q, K) {
        return Array.from(q.map((_) => ({
            scope: (0, g78.createInstrumentationScope)(_.scope),
            metrics: _.metrics.map((z) => Jt4(z, K)),
            schemaUrl: _.scope.schemaUrl
        })))
    }
    Xt4.toScopeMetrics = Ht4;

    function Jt4(q, K) {
        let _ = {
                name: q.descriptor.name,
                description: q.descriptor.description,
                unit: q.descriptor.unit
            },
            z = vbz(q.aggregationTemporality);
        switch (q.dataPointType) {
            case HS6.DataPointType.SUM:
                _.sum = {
                    aggregationTemporality: z,
                    isMonotonic: q.isMonotonic,
                    dataPoints: $t4(q, K)
                };
                break;
            case HS6.DataPointType.GAUGE:
                _.gauge = {
                    dataPoints: $t4(q, K)
                };
                break;
            case HS6.DataPointType.HISTOGRAM:
                _.histogram = {
                    aggregationTemporality: z,
                    dataPoints: fbz(q, K)
                };
                break;
            case HS6.DataPointType.EXPONENTIAL_HISTOGRAM:
                _.exponentialHistogram = {
                    aggregationTemporality: z,
                    dataPoints: Gbz(q, K)
                };
                break
        }
        return _
    }
    Xt4.toMetric = Jt4;

    function Zbz(q, K, _) {
        let z = {
            attributes: (0, g78.toAttributes)(q.attributes),
            startTimeUnixNano: _.encodeHrTime(q.startTime),
            timeUnixNano: _.encodeHrTime(q.endTime)
        };
        switch (K) {
            case Ot4.ValueType.INT:
                z.asInt = q.value;
                break;
            case Ot4.ValueType.DOUBLE:
                z.asDouble = q.value;
                break
        }
        return z
    }

    function $t4(q, K) {
        return q.dataPoints.map((_) => {
            return Zbz(_, q.descriptor.valueType, K)
        })
    }

    function fbz(q, K) {
        return q.dataPoints.map((_) => {
            let z = _.value;
            return {
                attributes: (0, g78.toAttributes)(_.attributes),
                bucketCounts: z.buckets.counts,
                explicitBounds: z.buckets.boundaries,
                count: z.count,
                sum: z.sum,
                min: z.min,
                max: z.max,
                startTimeUnixNano: K.encodeHrTime(_.startTime),
                timeUnixNano: K.encodeHrTime(_.endTime)
            }
        })
    }

    function Gbz(q, K) {
        return q.dataPoints.map((_) => {
            let z = _.value;
            return {
                attributes: (0, g78.toAttributes)(_.attributes),
                count: z.count,
                min: z.min,
                max: z.max,
                sum: z.sum,
                positive: {
                    offset: z.positive.offset,
                    bucketCounts: z.positive.bucketCounts
                },
                negative: {
                    offset: z.negative.offset,
                    bucketCounts: z.negative.bucketCounts
                },
                scale: z.scale,
                zeroCount: z.zeroCount,
                startTimeUnixNano: K.encodeHrTime(_.startTime),
                timeUnixNano: K.encodeHrTime(_.endTime)
            }
        })
    }

    function vbz(q) {
        switch (q) {
            case HS6.AggregationTemporality.DELTA:
                return wt4.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
            case HS6.AggregationTemporality.CUMULATIVE:
                return wt4.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE
        }
    }

    function Tbz(q, K) {
        return {
            resourceMetrics: q.map((_) => jt4(_, K))
        }
    }
    Xt4.createExportMetricsServiceRequest = Tbz
})
// @from(Ln 305844, Col 4)
Zt4 = p((Wt4) => {
    Object.defineProperty(Wt4, "__esModule", {
        value: !0
    });
    Wt4.ProtobufMetricsSerializer = void 0;
    var Pt4 = km8(),
        Ebz = ts1(),
        ybz = Pt4.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse,
        Lbz = Pt4.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
    Wt4.ProtobufMetricsSerializer = {
        serializeRequest: (q) => {
            let K = (0, Ebz.createExportMetricsServiceRequest)([q]);
            return Lbz.encode(K).finish()
        },
        deserializeResponse: (q) => {
            return ybz.decode(q)
        }
    }
})
// @from(Ln 305863, Col 4)
ft4 = p((es1) => {
    Object.defineProperty(es1, "__esModule", {
        value: !0
    });
    es1.ProtobufMetricsSerializer = void 0;
    var hbz = Zt4();
    Object.defineProperty(es1, "ProtobufMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return hbz.ProtobufMetricsSerializer
        }
    })
})
// @from(Ln 305876, Col 4)
qt1 = p((kt4) => {
    Object.defineProperty(kt4, "__esModule", {
        value: !0
    });
    kt4.createExportTraceServiceRequest = kt4.toOtlpSpanEvent = kt4.toOtlpLink = kt4.sdkSpanToOtlpSpan = void 0;
    var U78 = Em8(),
        Sbz = Nm8(),
        Cbz = 256,
        bbz = 512;

    function Gt4(q, K) {
        let _ = q & 255 | Cbz;
        if (K) _ |= bbz;
        return _
    }

    function vt4(q, K) {
        let _ = q.spanContext(),
            z = q.status,
            Y = q.parentSpanContext?.spanId ? K.encodeSpanContext(q.parentSpanContext?.spanId) : void 0;
        return {
            traceId: K.encodeSpanContext(_.traceId),
            spanId: K.encodeSpanContext(_.spanId),
            parentSpanId: Y,
            traceState: _.traceState?.serialize(),
            name: q.name,
            kind: q.kind == null ? 0 : q.kind + 1,
            startTimeUnixNano: K.encodeHrTime(q.startTime),
            endTimeUnixNano: K.encodeHrTime(q.endTime),
            attributes: (0, U78.toAttributes)(q.attributes),
            droppedAttributesCount: q.droppedAttributesCount,
            events: q.events.map((A) => Vt4(A, K)),
            droppedEventsCount: q.droppedEventsCount,
            status: {
                code: z.code,
                message: z.message
            },
            links: q.links.map((A) => Tt4(A, K)),
            droppedLinksCount: q.droppedLinksCount,
            flags: Gt4(_.traceFlags, q.parentSpanContext?.isRemote)
        }
    }
    kt4.sdkSpanToOtlpSpan = vt4;

    function Tt4(q, K) {
        return {
            attributes: q.attributes ? (0, U78.toAttributes)(q.attributes) : [],
            spanId: K.encodeSpanContext(q.context.spanId),
            traceId: K.encodeSpanContext(q.context.traceId),
            traceState: q.context.traceState?.serialize(),
            droppedAttributesCount: q.droppedAttributesCount || 0,
            flags: Gt4(q.context.traceFlags, q.context.isRemote)
        }
    }
    kt4.toOtlpLink = Tt4;

    function Vt4(q, K) {
        return {
            attributes: q.attributes ? (0, U78.toAttributes)(q.attributes) : [],
            name: q.name,
            timeUnixNano: K.encodeHrTime(q.time),
            droppedAttributesCount: q.droppedAttributesCount || 0
        }
    }
    kt4.toOtlpSpanEvent = Vt4;

    function Ibz(q, K) {
        let _ = (0, Sbz.getOtlpEncoder)(K);
        return {
            resourceSpans: ubz(q, _)
        }
    }
    kt4.createExportTraceServiceRequest = Ibz;

    function xbz(q) {
        let K = new Map;
        for (let _ of q) {
            let z = K.get(_.resource);
            if (!z) z = new Map, K.set(_.resource, z);
            let Y = `${_.instrumentationScope.name}@${_.instrumentationScope.version||""}:${_.instrumentationScope.schemaUrl||""}`,
                A = z.get(Y);
            if (!A) A = [], z.set(Y, A);
            A.push(_)
        }
        return K
    }

    function ubz(q, K) {
        let _ = xbz(q),
            z = [],
            Y = _.entries(),
            A = Y.next();
        while (!A.done) {
            let [O, w] = A.value, $ = [], j = w.values(), H = j.next();
            while (!H.done) {
                let M = H.value;
                if (M.length > 0) {
                    let P = M.map((W) => vt4(W, K));
                    $.push({
                        scope: (0, U78.createInstrumentationScope)(M[0].instrumentationScope),
                        spans: P,
                        schemaUrl: M[0].instrumentationScope.schemaUrl
                    })
                }
                H = j.next()
            }
            let J = (0, U78.createResource)(O),
                X = {
                    resource: J,
                    scopeSpans: $,
                    schemaUrl: J.schemaUrl
                };
            z.push(X), A = Y.next()
        }
        return z
    }
})
// @from(Ln 305993, Col 4)
ht4 = p((yt4) => {
    Object.defineProperty(yt4, "__esModule", {
        value: !0
    });
    yt4.ProtobufTraceSerializer = void 0;
    var Et4 = km8(),
        Fbz = qt1(),
        gbz = Et4.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse,
        Ubz = Et4.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
    yt4.ProtobufTraceSerializer = {
        serializeRequest: (q) => {
            let K = (0, Fbz.createExportTraceServiceRequest)(q);
            return Ubz.encode(K).finish()
        },
        deserializeResponse: (q) => {
            return gbz.decode(q)
        }
    }
})
// @from(Ln 306012, Col 4)
Rt4 = p((Kt1) => {
    Object.defineProperty(Kt1, "__esModule", {
        value: !0
    });
    Kt1.ProtobufTraceSerializer = void 0;
    var Qbz = ht4();
    Object.defineProperty(Kt1, "ProtobufTraceSerializer", {
        enumerable: !0,
        get: function() {
            return Qbz.ProtobufTraceSerializer
        }
    })
})
// @from(Ln 306025, Col 4)
bt4 = p((St4) => {
    Object.defineProperty(St4, "__esModule", {
        value: !0
    });
    St4.JsonLogsSerializer = void 0;
    var cbz = os1();
    St4.JsonLogsSerializer = {
        serializeRequest: (q) => {
            let K = (0, cbz.createExportLogsServiceRequest)(q, {
                useHex: !0,
                useLongBits: !1
            });
            return new TextEncoder().encode(JSON.stringify(K))
        },
        deserializeResponse: (q) => {
            if (q.length === 0) return {};
            return JSON.parse(new TextDecoder().decode(q))
        }
    }
})
// @from(Ln 306045, Col 4)
It4 = p((_t1) => {
    Object.defineProperty(_t1, "__esModule", {
        value: !0
    });
    _t1.JsonLogsSerializer = void 0;
    var lbz = bt4();
    Object.defineProperty(_t1, "JsonLogsSerializer", {
        enumerable: !0,
        get: function() {
            return lbz.JsonLogsSerializer
        }
    })
})
// @from(Ln 306058, Col 4)
mt4 = p((xt4) => {
    Object.defineProperty(xt4, "__esModule", {
        value: !0
    });
    xt4.JsonMetricsSerializer = void 0;
    var ibz = ts1();
    xt4.JsonMetricsSerializer = {
        serializeRequest: (q) => {
            let K = (0, ibz.createExportMetricsServiceRequest)([q], {
                useLongBits: !1
            });
            return new TextEncoder().encode(JSON.stringify(K))
        },
        deserializeResponse: (q) => {
            if (q.length === 0) return {};
            return JSON.parse(new TextDecoder().decode(q))
        }
    }
})
// @from(Ln 306077, Col 4)
Bt4 = p((zt1) => {
    Object.defineProperty(zt1, "__esModule", {
        value: !0
    });
    zt1.JsonMetricsSerializer = void 0;
    var rbz = mt4();
    Object.defineProperty(zt1, "JsonMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return rbz.JsonMetricsSerializer
        }
    })
})
// @from(Ln 306090, Col 4)
gt4 = p((pt4) => {
    Object.defineProperty(pt4, "__esModule", {
        value: !0
    });
    pt4.JsonTraceSerializer = void 0;
    var abz = qt1();
    pt4.JsonTraceSerializer = {
        serializeRequest: (q) => {
            let K = (0, abz.createExportTraceServiceRequest)(q, {
                useHex: !0,
                useLongBits: !1
            });
            return new TextEncoder().encode(JSON.stringify(K))
        },
        deserializeResponse: (q) => {
            if (q.length === 0) return {};
            return JSON.parse(new TextDecoder().decode(q))
        }
    }
})
// @from(Ln 306110, Col 4)
Ut4 = p((Yt1) => {
    Object.defineProperty(Yt1, "__esModule", {
        value: !0
    });
    Yt1.JsonTraceSerializer = void 0;
    var sbz = gt4();
    Object.defineProperty(Yt1, "JsonTraceSerializer", {
        enumerable: !0,
        get: function() {
            return sbz.JsonTraceSerializer
        }
    })
})
// @from(Ln 306123, Col 4)
$l = p((V36) => {
    Object.defineProperty(V36, "__esModule", {
        value: !0
    });
    V36.JsonTraceSerializer = V36.JsonMetricsSerializer = V36.JsonLogsSerializer = V36.ProtobufTraceSerializer = V36.ProtobufMetricsSerializer = V36.ProtobufLogsSerializer = void 0;
    var ebz = zt4();
    Object.defineProperty(V36, "ProtobufLogsSerializer", {
        enumerable: !0,
        get: function() {
            return ebz.ProtobufLogsSerializer
        }
    });
    var qIz = ft4();
    Object.defineProperty(V36, "ProtobufMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return qIz.ProtobufMetricsSerializer
        }
    });
    var KIz = Rt4();
    Object.defineProperty(V36, "ProtobufTraceSerializer", {
        enumerable: !0,
        get: function() {
            return KIz.ProtobufTraceSerializer
        }
    });
    var _Iz = It4();
    Object.defineProperty(V36, "JsonLogsSerializer", {
        enumerable: !0,
        get: function() {
            return _Iz.JsonLogsSerializer
        }
    });
    var zIz = Bt4();
    Object.defineProperty(V36, "JsonMetricsSerializer", {
        enumerable: !0,
        get: function() {
            return zIz.JsonMetricsSerializer
        }
    });
    var YIz = Ut4();
    Object.defineProperty(V36, "JsonTraceSerializer", {
        enumerable: !0,
        get: function() {
            return YIz.JsonTraceSerializer
        }
    })
})
// @from(Ln 306171, Col 4)
ct4 = p((Qt4) => {
    Object.defineProperty(Qt4, "__esModule", {
        value: !0
    });
    Qt4.validateAndNormalizeHeaders = void 0;
    var OIz = $5();

    function wIz(q) {
        let K = {};
        return Object.entries(q ?? {}).forEach(([_, z]) => {
            if (typeof z < "u") K[_] = String(z);
            else OIz.diag.warn(`Header "${_}" has invalid value (${z}) and will be ignored`)
        }), K
    }
    Qt4.validateAndNormalizeHeaders = wIz
})
// @from(Ln 306187, Col 4)
rt4 = p((nt4) => {
    Object.defineProperty(nt4, "__esModule", {
        value: !0
    });
    nt4.getHttpConfigurationDefaults = nt4.mergeOtlpHttpConfigurationWithDefaults = void 0;
    var lt4 = u78(),
        $Iz = ct4();

    function jIz(q, K, _) {
        return async () => {
            let z = {
                    ...await _()
                },
                Y = {};
            if (K != null) Object.assign(Y, await K());
            if (q != null) Object.assign(Y, (0, $Iz.validateAndNormalizeHeaders)(await q()));
            return Object.assign(Y, z)
        }
    }

    function HIz(q) {
        if (q == null) return;
        try {
            let K = globalThis.location?.href;
            return new URL(q, K).href
        } catch {
            throw Error(`Configuration: Could not parse user-provided export URL: '${q}'`)
        }
    }

    function JIz(q, K, _) {
        return {
            ...(0, lt4.mergeOtlpSharedConfigurationWithDefaults)(q, K, _),
            headers: jIz(q.headers, K.headers, _.headers),
            url: HIz(q.url) ?? K.url ?? _.url
        }
    }
    nt4.mergeOtlpHttpConfigurationWithDefaults = JIz;

    function XIz(q, K) {
        return {
            ...(0, lt4.getSharedConfigurationDefaults)(),
            headers: async () => q,
            url: "http://localhost:4318/" + K
        }
    }
    nt4.getHttpConfigurationDefaults = XIz
})
// @from(Ln 306235, Col 4)
Lm8 = p((st4) => {
    Object.defineProperty(st4, "__esModule", {
        value: !0
    });
    st4.getNodeHttpConfigurationDefaults = st4.mergeOtlpNodeHttpConfigurationWithDefaults = st4.httpAgentFactoryFromOptions = void 0;
    var ot4 = rt4();

    function at4(q) {
        return async (K) => {
            let _ = K === "http:",
                z = _ ? import("http") : import("https"),
                {
                    Agent: Y
                } = await z;
            if (_) {
                let {
                    ca: A,
                    cert: O,
                    key: w,
                    ...$
                } = q;
                return new Y($)
            }
            return new Y(q)
        }
    }
    st4.httpAgentFactoryFromOptions = at4;

    function PIz(q, K, _) {
        return {
            ...(0, ot4.mergeOtlpHttpConfigurationWithDefaults)(q, K, _),
            agentFactory: q.agentFactory ?? K.agentFactory ?? _.agentFactory,
            userAgent: q.userAgent
        }
    }
    st4.mergeOtlpNodeHttpConfigurationWithDefaults = PIz;

    function WIz(q, K) {
        return {
            ...(0, ot4.getHttpConfigurationDefaults)(q, K),
            agentFactory: at4({
                keepAlive: !0
            })
        }
    }
    st4.getNodeHttpConfigurationDefaults = WIz
})
// @from(Ln 306282, Col 4)
Ke4 = p((et4) => {
    Object.defineProperty(et4, "__esModule", {
        value: !0
    });
    et4.parseRetryAfterToMills = et4.isExportRetryable = void 0;

    function fIz(q) {
        return [429, 502, 503, 504].includes(q)
    }
    et4.isExportRetryable = fIz;

    function GIz(q) {
        if (q == null) return;
        let K = Number.parseInt(q, 10);
        if (Number.isInteger(K)) return K > 0 ? K * 1000 : -1;
        let _ = new Date(q).getTime() - Date.now();
        if (_ >= 0) return _;
        return 0
    }
    et4.parseRetryAfterToMills = GIz
})
// @from(Ln 306303, Col 4)
Ye4 = p((_e4) => {
    Object.defineProperty(_e4, "__esModule", {
        value: !0
    });
    _e4.VERSION = void 0;
    _e4.VERSION = "0.208.0"
})
// @from(Ln 306310, Col 4)
He4 = p(($e4) => {
    Object.defineProperty($e4, "__esModule", {
        value: !0
    });
    $e4.compressAndSend = $e4.sendWithHttp = void 0;
    var TIz = d6("zlib"),
        VIz = d6("stream"),
        Ae4 = Ke4(),
        kIz = Wm8(),
        NIz = Ye4(),
        Oe4 = `OTel-OTLP-Exporter-JavaScript/${NIz.VERSION}`;

    function EIz(q, K, _, z, Y, A, O, w, $) {
        let j = new URL(K);
        if (Y) _["User-Agent"] = `${Y} ${Oe4}`;
        else _["User-Agent"] = Oe4;
        let H = {
                hostname: j.hostname,
                port: j.port,
                path: j.pathname,
                method: "POST",
                headers: _,
                agent: A
            },
            J = q(H, (X) => {
                let M = [];
                X.on("data", (P) => M.push(P)), X.on("end", () => {
                    if (X.statusCode && X.statusCode < 299) w({
                        status: "success",
                        data: Buffer.concat(M)
                    });
                    else if (X.statusCode && (0, Ae4.isExportRetryable)(X.statusCode)) w({
                        status: "retryable",
                        retryInMillis: (0, Ae4.parseRetryAfterToMills)(X.headers["retry-after"])
                    });
                    else {
                        let P = new kIz.OTLPExporterError(X.statusMessage, X.statusCode, Buffer.concat(M).toString());
                        w({
                            status: "failure",
                            error: P
                        })
                    }
                })
            });
        J.setTimeout($, () => {
            J.destroy(), w({
                status: "failure",
                error: Error("Request Timeout")
            })
        }), J.on("error", (X) => {
            w({
                status: "failure",
                error: X
            })
        }), we4(J, z, O, (X) => {
            w({
                status: "failure",
                error: X
            })
        })
    }
    $e4.sendWithHttp = EIz;

    function we4(q, K, _, z) {
        let Y = yIz(_);
        if (K === "gzip") q.setHeader("Content-Encoding", "gzip"), Y = Y.on("error", z).pipe(TIz.createGzip()).on("error", z);
        Y.pipe(q).on("error", z)
    }
    $e4.compressAndSend = we4;

    function yIz(q) {
        let K = new VIz.Readable;
        return K.push(q), K.push(null), K
    }
})
// @from(Ln 306385, Col 4)
Pe4 = p((Xe4) => {
    Object.defineProperty(Xe4, "__esModule", {
        value: !0
    });
    Xe4.createHttpExporterTransport = void 0;
    var hIz = He4();
    class Je4 {
        _parameters;
        _utils = null;
        constructor(q) {
            this._parameters = q
        }
        async send(q, K) {
            let {
                agent: _,
                request: z
            } = await this._loadUtils(), Y = await this._parameters.headers();
            return new Promise((A) => {
                (0, hIz.sendWithHttp)(z, this._parameters.url, Y, this._parameters.compression, this._parameters.userAgent, _, q, (O) => {
                    A(O)
                }, K)
            })
        }
        shutdown() {}
        async _loadUtils() {
            let q = this._utils;
            if (q === null) {
                let K = new URL(this._parameters.url).protocol,
                    [_, z] = await Promise.all([this._parameters.agentFactory(K), RIz(K)]);
                q = this._utils = {
                    agent: _,
                    request: z
                }
            }
            return q
        }
    }
    async function RIz(q) {
        let K = q === "http:" ? import("http") : import("https"),
            {
                request: _
            } = await K;
        return _
    }

    function SIz(q) {
        return new Je4(q)
    }
    Xe4.createHttpExporterTransport = SIz
})
// @from(Ln 306435, Col 4)
Ge4 = p((Ze4) => {
    Object.defineProperty(Ze4, "__esModule", {
        value: !0
    });
    Ze4.createRetryingTransport = void 0;
    var CIz = 5,
        bIz = 1000,
        IIz = 5000,
        xIz = 1.5,
        We4 = 0.2;

    function uIz() {
        return Math.random() * (2 * We4) - We4
    }
    class De4 {
        _transport;
        constructor(q) {
            this._transport = q
        }
        retry(q, K, _) {
            return new Promise((z, Y) => {
                setTimeout(() => {
                    this._transport.send(q, K).then(z, Y)
                }, _)
            })
        }
        async send(q, K) {
            let _ = Date.now() + K,
                z = await this._transport.send(q, K),
                Y = CIz,
                A = bIz;
            while (z.status === "retryable" && Y > 0) {
                Y--;
                let O = Math.max(Math.min(A, IIz) + uIz(), 0);
                A = A * xIz;
                let w = z.retryInMillis ?? O,
                    $ = _ - Date.now();
                if (w > $) return z;
                z = await this.retry(q, $, w)
            }
            return z
        }
        shutdown() {
            return this._transport.shutdown()
        }
    }

    function mIz(q) {
        return new De4(q.transport)
    }
    Ze4.createRetryingTransport = mIz
})
// @from(Ln 306487, Col 4)
Ve4 = p((ve4) => {
    Object.defineProperty(ve4, "__esModule", {
        value: !0
    });
    ve4.createOtlpHttpExportDelegate = void 0;
    var BIz = Vs1(),
        pIz = Pe4(),
        FIz = Ts1(),
        gIz = Ge4();

    function UIz(q, K) {
        return (0, BIz.createOtlpExportDelegate)({
            transport: (0, gIz.createRetryingTransport)({
                transport: (0, pIz.createHttpExporterTransport)(q)
            }),
            serializer: K,
            promiseHandler: (0, FIz.createBoundedQueueExportPromiseHandler)(q)
        }, {
            timeout: q.timeoutMillis
        })
    }
    ve4.createOtlpHttpExportDelegate = UIz
})
// @from(Ln 306510, Col 4)
At1 = p((Le4) => {
    Object.defineProperty(Le4, "__esModule", {
        value: !0
    });
    Le4.getSharedConfigurationFromEnvironment = void 0;
    var Ee4 = t_(),
        ye4 = $5();

    function ke4(q) {
        let K = (0, Ee4.getNumberFromEnv)(q);
        if (K != null) {
            if (Number.isFinite(K) && K > 0) return K;
            ye4.diag.warn(`Configuration: ${q} is invalid, expected number greater than 0 (actual: ${K})`)
        }
        return
    }

    function QIz(q) {
        let K = ke4(`OTEL_EXPORTER_OTLP_${q}_TIMEOUT`),
            _ = ke4("OTEL_EXPORTER_OTLP_TIMEOUT");
        return K ?? _
    }

    function Ne4(q) {
        let K = (0, Ee4.getStringFromEnv)(q)?.trim();
        if (K == null || K === "none" || K === "gzip") return K;
        ye4.diag.warn(`Configuration: ${q} is invalid, expected 'none' or 'gzip' (actual: '${K}')`);
        return
    }

    function dIz(q) {
        let K = Ne4(`OTEL_EXPORTER_OTLP_${q}_COMPRESSION`),
            _ = Ne4("OTEL_EXPORTER_OTLP_COMPRESSION");
        return K ?? _
    }

    function cIz(q) {
        return {
            timeoutMillis: QIz(q),
            compression: dIz(q)
        }
    }
    Le4.getSharedConfigurationFromEnvironment = cIz
})
// @from(Ln 306554, Col 4)
Ce4 = p((Re4) => {
    Object.defineProperty(Re4, "__esModule", {
        value: !0
    });
    Re4.getNodeHttpConfigurationFromEnvironment = void 0;
    var lIz = d6("fs"),
        nIz = d6("path"),
        jl = t_(),
        hm8 = $5(),
        iIz = At1(),
        rIz = u78(),
        oIz = Lm8();

    function aIz(q) {
        let K = (0, jl.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${q}_HEADERS`),
            _ = (0, jl.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"),
            z = (0, jl.parseKeyPairsIntoRecord)(K),
            Y = (0, jl.parseKeyPairsIntoRecord)(_);
        if (Object.keys(z).length === 0 && Object.keys(Y).length === 0) return;
        return Object.assign({}, (0, jl.parseKeyPairsIntoRecord)(_), (0, jl.parseKeyPairsIntoRecord)(K))
    }

    function sIz(q) {
        try {
            return new URL(q).toString()
        } catch {
            hm8.diag.warn(`Configuration: Could not parse environment-provided export URL: '${q}', falling back to undefined`);
            return
        }
    }

    function tIz(q, K) {
        try {
            new URL(q)
        } catch {
            hm8.diag.warn(`Configuration: Could not parse environment-provided export URL: '${q}', falling back to undefined`);
            return
        }
        if (!q.endsWith("/")) q = q + "/";
        q += K;
        try {
            new URL(q)
        } catch {
            hm8.diag.warn(`Configuration: Provided URL appended with '${K}' is not a valid URL, using 'undefined' instead of '${q}'`);
            return
        }
        return q
    }

    function eIz(q) {
        let K = (0, jl.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
        if (K === void 0) return;
        return tIz(K, q)
    }

    function qxz(q) {
        let K = (0, jl.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${q}_ENDPOINT`);
        if (K === void 0) return;
        return sIz(K)
    }

    function Ot1(q, K, _) {
        let z = (0, jl.getStringFromEnv)(q),
            Y = (0, jl.getStringFromEnv)(K),
            A = z ?? Y;
        if (A != null) try {
            return lIz.readFileSync(nIz.resolve(process.cwd(), A))
        } catch {
            hm8.diag.warn(_);
            return
        } else return
    }

    function Kxz(q) {
        return Ot1(`OTEL_EXPORTER_OTLP_${q}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
    }

    function _xz(q) {
        return Ot1(`OTEL_EXPORTER_OTLP_${q}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
    }

    function zxz(q) {
        return Ot1(`OTEL_EXPORTER_OTLP_${q}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
    }

    function Yxz(q, K) {
        return {
            ...(0, iIz.getSharedConfigurationFromEnvironment)(q),
            url: qxz(q) ?? eIz(K),
            headers: (0, rIz.wrapStaticHeadersInFunction)(aIz(q)),
            agentFactory: (0, oIz.httpAgentFactoryFromOptions)({
                keepAlive: !0,
                ca: zxz(q),
                cert: Kxz(q),
                key: _xz(q)
            })
        }
    }
    Re4.getNodeHttpConfigurationFromEnvironment = Yxz
})
// @from(Ln 306654, Col 4)
xe4 = p((be4) => {
    Object.defineProperty(be4, "__esModule", {
        value: !0
    });
    be4.convertLegacyHeaders = void 0;
    var Axz = u78();

    function Oxz(q) {
        if (typeof q.headers === "function") return q.headers;
        return (0, Axz.wrapStaticHeadersInFunction)(q.headers)
    }
    be4.convertLegacyHeaders = Oxz
})
// @from(Ln 306667, Col 4)
pe4 = p((me4) => {
    Object.defineProperty(me4, "__esModule", {
        value: !0
    });
    me4.convertLegacyHttpOptions = void 0;
    var wxz = $5(),
        ue4 = Lm8(),
        $xz = Xt(),
        jxz = Ce4(),
        Hxz = xe4();

    function Jxz(q) {
        if (typeof q.httpAgentOptions === "function") return q.httpAgentOptions;
        let K = q.httpAgentOptions;
        if (q.keepAlive != null) K = {
            keepAlive: q.keepAlive,
            ...K
        };
        if (K != null) return (0, $xz.httpAgentFactoryFromOptions)(K);
        else return
    }

    function Xxz(q, K, _, z) {
        if (q.metadata) wxz.diag.warn("Metadata cannot be set when using http");
        return (0, ue4.mergeOtlpNodeHttpConfigurationWithDefaults)({
            url: q.url,
            headers: (0, Hxz.convertLegacyHeaders)(q),
            concurrencyLimit: q.concurrencyLimit,
            timeoutMillis: q.timeoutMillis,
            compression: q.compression,
            agentFactory: Jxz(q),
            userAgent: q.userAgent
        }, (0, jxz.getNodeHttpConfigurationFromEnvironment)(K, _), (0, ue4.getNodeHttpConfigurationDefaults)(z, _))
    }
    me4.convertLegacyHttpOptions = Xxz
})
// @from(Ln 306703, Col 4)
Xt = p((JS6) => {
    Object.defineProperty(JS6, "__esModule", {
        value: !0
    });
    JS6.convertLegacyHttpOptions = JS6.getSharedConfigurationFromEnvironment = JS6.createOtlpHttpExportDelegate = JS6.httpAgentFactoryFromOptions = void 0;
    var Mxz = Lm8();
    Object.defineProperty(JS6, "httpAgentFactoryFromOptions", {
        enumerable: !0,
        get: function() {
            return Mxz.httpAgentFactoryFromOptions
        }
    });
    var Pxz = Ve4();
    Object.defineProperty(JS6, "createOtlpHttpExportDelegate", {
        enumerable: !0,
        get: function() {
            return Pxz.createOtlpHttpExportDelegate
        }
    });
    var Wxz = At1();
    Object.defineProperty(JS6, "getSharedConfigurationFromEnvironment", {
        enumerable: !0,
        get: function() {
            return Wxz.getSharedConfigurationFromEnvironment
        }
    });
    var Dxz = pe4();
    Object.defineProperty(JS6, "convertLegacyHttpOptions", {
        enumerable: !0,
        get: function() {
            return Dxz.convertLegacyHttpOptions
        }
    })
})
// @from(Ln 306737, Col 4)
de4 = p((Ue4) => {
    Object.defineProperty(Ue4, "__esModule", {
        value: !0
    });
    Ue4.OTLPMetricExporter = void 0;
    var fxz = Es1(),
        Gxz = $l(),
        Fe4 = Xt();
    class ge4 extends fxz.OTLPMetricExporterBase {
        constructor(q) {
            super((0, Fe4.createOtlpHttpExportDelegate)((0, Fe4.convertLegacyHttpOptions)(q ?? {}, "METRICS", "v1/metrics", {
                "Content-Type": "application/json"
            }), Gxz.JsonMetricsSerializer), q)
        }
    }
    Ue4.OTLPMetricExporter = ge4
})
// @from(Ln 306754, Col 4)
ce4 = p((wt1) => {
    Object.defineProperty(wt1, "__esModule", {
        value: !0
    });
    wt1.OTLPMetricExporter = void 0;
    var vxz = de4();
    Object.defineProperty(wt1, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return vxz.OTLPMetricExporter
        }
    })
})
// @from(Ln 306767, Col 4)
le4 = p(($t1) => {
    Object.defineProperty($t1, "__esModule", {
        value: !0
    });
    $t1.OTLPMetricExporter = void 0;
    var Vxz = ce4();
    Object.defineProperty($t1, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return Vxz.OTLPMetricExporter
        }
    })
})
// @from(Ln 306780, Col 4)
Sm8 = p((k36) => {
    Object.defineProperty(k36, "__esModule", {
        value: !0
    });
    k36.OTLPMetricExporterBase = k36.LowMemoryTemporalitySelector = k36.DeltaTemporalitySelector = k36.CumulativeTemporalitySelector = k36.AggregationTemporalityPreference = k36.OTLPMetricExporter = void 0;
    var Nxz = le4();
    Object.defineProperty(k36, "OTLPMetricExporter", {
        enumerable: !0,
        get: function() {
            return Nxz.OTLPMetricExporter
        }
    });
    var Exz = Gs1();
    Object.defineProperty(k36, "AggregationTemporalityPreference", {
        enumerable: !0,
        get: function() {
            return Exz.AggregationTemporalityPreference
        }
    });
    var Rm8 = Es1();
    Object.defineProperty(k36, "CumulativeTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return Rm8.CumulativeTemporalitySelector
        }
    });
    Object.defineProperty(k36, "DeltaTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return Rm8.DeltaTemporalitySelector
        }
    });
    Object.defineProperty(k36, "LowMemoryTemporalitySelector", {
        enumerable: !0,
        get: function() {
            return Rm8.LowMemoryTemporalitySelector
        }
    });
    Object.defineProperty(k36, "OTLPMetricExporterBase", {
        enumerable: !0,
        get: function() {
            return Rm8.OTLPMetricExporterBase
        }
    })
})
// @from(Ln 306825, Col 4)
re4 = p((ne4) => {
    Object.defineProperty(ne4, "__esModule", {
        value: !0
    });
    ne4.VERSION = void 0;
    ne4.VERSION = "0.208.0"
})
// @from(Ln 306832, Col 4)
e_ = p((te4) => {
    Object.defineProperty(te4, "__esModule", {
        value: !0
    });
    te4.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = te4.DEFAULT_MAX_SEND_MESSAGE_LENGTH = te4.Propagate = te4.LogVerbosity = te4.Status = void 0;
    var oe4;
    (function(q) {
        q[q.OK = 0] = "OK", q[q.CANCELLED = 1] = "CANCELLED", q[q.UNKNOWN = 2] = "UNKNOWN", q[q.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", q[q.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", q[q.NOT_FOUND = 5] = "NOT_FOUND", q[q.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", q[q.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", q[q.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", q[q.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", q[q.ABORTED = 10] = "ABORTED", q[q.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", q[q.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", q[q.INTERNAL = 13] = "INTERNAL", q[q.UNAVAILABLE = 14] = "UNAVAILABLE", q[q.DATA_LOSS = 15] = "DATA_LOSS", q[q.UNAUTHENTICATED = 16] = "UNAUTHENTICATED"
    })(oe4 || (te4.Status = oe4 = {}));
    var ae4;
    (function(q) {
        q[q.DEBUG = 0] = "DEBUG", q[q.INFO = 1] = "INFO", q[q.ERROR = 2] = "ERROR", q[q.NONE = 3] = "NONE"
    })(ae4 || (te4.LogVerbosity = ae4 = {}));
    var se4;
    (function(q) {
        q[q.DEADLINE = 1] = "DEADLINE", q[q.CENSUS_STATS_CONTEXT = 2] = "CENSUS_STATS_CONTEXT", q[q.CENSUS_TRACING_CONTEXT = 4] = "CENSUS_TRACING_CONTEXT", q[q.CANCELLATION = 8] = "CANCELLATION", q[q.DEFAULTS = 65535] = "DEFAULTS"
    })(se4 || (te4.Propagate = se4 = {}));
    te4.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
    te4.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4194304
})
// @from(Ln 306852, Col 4)
jt1 = p((v52, Cxz) => {
    Cxz.exports = {
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
// @from(Ln 306927, Col 4)
o2 = p((_6K) => {
    var Ht1, Jt1, Xt1, Mt1;
    Object.defineProperty(_6K, "__esModule", {
        value: !0
    });
    _6K.log = _6K.setLoggerVerbosity = _6K.setLogger = _6K.getLogger = void 0;
    _6K.trace = Qxz;
    _6K.isTracerEnabled = K6K;
    var N36 = e_(),
        bxz = d6("process"),
        Ixz = jt1().version,
        xxz = {
            error: (q, ...K) => {
                console.error("E " + q, ...K)
            },
            info: (q, ...K) => {
                console.error("I " + q, ...K)
            },
            debug: (q, ...K) => {
                console.error("D " + q, ...K)
            }
        },
        cJ6 = xxz,
        XS6 = N36.LogVerbosity.ERROR,
        uxz = (Jt1 = (Ht1 = process.env.GRPC_NODE_VERBOSITY) !== null && Ht1 !== void 0 ? Ht1 : process.env.GRPC_VERBOSITY) !== null && Jt1 !== void 0 ? Jt1 : "";
    switch (uxz.toUpperCase()) {
        case "DEBUG":
            XS6 = N36.LogVerbosity.DEBUG;
            break;
        case "INFO":
            XS6 = N36.LogVerbosity.INFO;
            break;
        case "ERROR":
            XS6 = N36.LogVerbosity.ERROR;
            break;
        case "NONE":
            XS6 = N36.LogVerbosity.NONE;
            break;
        default:
    }
    var mxz = () => {
        return cJ6
    };
    _6K.getLogger = mxz;
    var Bxz = (q) => {
        cJ6 = q
    };
    _6K.setLogger = Bxz;
    var pxz = (q) => {
        XS6 = q
    };
    _6K.setLoggerVerbosity = pxz;
    var Fxz = (q, ...K) => {
        let _;
        if (q >= XS6) {
            switch (q) {
                case N36.LogVerbosity.DEBUG:
                    _ = cJ6.debug;
                    break;
                case N36.LogVerbosity.INFO:
                    _ = cJ6.info;
                    break;
                case N36.LogVerbosity.ERROR:
                    _ = cJ6.error;
                    break
            }
            if (!_) _ = cJ6.error;
            if (_) _.bind(cJ6)(...K)
        }
    };
    _6K.log = Fxz;
    var gxz = (Mt1 = (Xt1 = process.env.GRPC_NODE_TRACE) !== null && Xt1 !== void 0 ? Xt1 : process.env.GRPC_TRACE) !== null && Mt1 !== void 0 ? Mt1 : "",
        Pt1 = new Set,
        q6K = new Set;
    for (let q of gxz.split(","))
        if (q.startsWith("-")) q6K.add(q.substring(1));
        else Pt1.add(q);
    var Uxz = Pt1.has("all");

    function Qxz(q, K, _) {
        if (K6K(K)) _6K.log(q, new Date().toISOString() + " | v" + Ixz + " " + bxz.pid + " | " + K + " | " + _)
    }

    function K6K(q) {
        return !q6K.has(q) && (Uxz || Pt1.has(q))
    }
})
// @from(Ln 307014, Col 4)
Cm8 = p((z6K) => {
    Object.defineProperty(z6K, "__esModule", {
        value: !0
    });
    z6K.getErrorMessage = rxz;
    z6K.getErrorCode = oxz;

    function rxz(q) {
        if (q instanceof Error) return q.message;
        else return String(q)
    }

    function oxz(q) {
        if (typeof q === "object" && q !== null && "code" in q && typeof q.code === "number") return q.code;
        else return null
    }
})
// @from(Ln 307031, Col 4)
QD = p((O6K) => {
    Object.defineProperty(O6K, "__esModule", {
        value: !0
    });
    O6K.Metadata = void 0;
    var txz = o2(),
        exz = e_(),
        quz = Cm8(),
        Kuz = /^[:0-9a-z_.-]+$/,
        _uz = /^[ -~]*$/;

    function zuz(q) {
        return Kuz.test(q)
    }

    function Yuz(q) {
        return _uz.test(q)
    }

    function A6K(q) {
        return q.endsWith("-bin")
    }

    function Auz(q) {
        return !q.startsWith("grpc-")
    }

    function bm8(q) {
        return q.toLowerCase()
    }

    function Y6K(q, K) {
        if (!zuz(q)) throw Error('Metadata key "' + q + '" contains illegal characters');
        if (K !== null && K !== void 0)
            if (A6K(q)) {
                if (!Buffer.isBuffer(K)) throw Error("keys that end with '-bin' must have Buffer values")
            } else {
                if (Buffer.isBuffer(K)) throw Error("keys that don't end with '-bin' must have String values");
                if (!Yuz(K)) throw Error('Metadata string value "' + K + '" contains illegal characters')
            }
    }
    class Im8 {
        constructor(q = {}) {
            this.internalRepr = new Map, this.opaqueData = new Map, this.options = q
        }
        set(q, K) {
            q = bm8(q), Y6K(q, K), this.internalRepr.set(q, [K])
        }
        add(q, K) {
            q = bm8(q), Y6K(q, K);
            let _ = this.internalRepr.get(q);
            if (_ === void 0) this.internalRepr.set(q, [K]);
            else _.push(K)
        }
        remove(q) {
            q = bm8(q), this.internalRepr.delete(q)
        }
        get(q) {
            return q = bm8(q), this.internalRepr.get(q) || []
        }
        getMap() {
            let q = {};
            for (let [K, _] of this.internalRepr)
                if (_.length > 0) {
                    let z = _[0];
                    q[K] = Buffer.isBuffer(z) ? Buffer.from(z) : z
                } return q
        }
        clone() {
            let q = new Im8(this.options),
                K = q.internalRepr;
            for (let [_, z] of this.internalRepr) {
                let Y = z.map((A) => {
                    if (Buffer.isBuffer(A)) return Buffer.from(A);
                    else return A
                });
                K.set(_, Y)
            }
            return q
        }
        merge(q) {
            for (let [K, _] of q.internalRepr) {
                let z = (this.internalRepr.get(K) || []).concat(_);
                this.internalRepr.set(K, z)
            }
        }
        setOptions(q) {
            this.options = q
        }
        getOptions() {
            return this.options
        }
        toHttp2Headers() {
            let q = {};
            for (let [K, _] of this.internalRepr) {
                if (K.startsWith(":")) continue;
                q[K] = _.map(Ouz)
            }
            return q
        }
        toJSON() {
            let q = {};
            for (let [K, _] of this.internalRepr) q[K] = _;
            return q
        }
        setOpaque(q, K) {
            this.opaqueData.set(q, K)
        }
        getOpaque(q) {
            return this.opaqueData.get(q)
        }
        static fromHttp2Headers(q) {
            let K = new Im8;
            for (let _ of Object.keys(q)) {
                if (_.charAt(0) === ":") continue;
                let z = q[_];
                try {
                    if (A6K(_)) {
                        if (Array.isArray(z)) z.forEach((Y) => {
                            K.add(_, Buffer.from(Y, "base64"))
                        });
                        else if (z !== void 0)
                            if (Auz(_)) z.split(",").forEach((Y) => {
                                K.add(_, Buffer.from(Y.trim(), "base64"))
                            });
                            else K.add(_, Buffer.from(z, "base64"))
                    } else if (Array.isArray(z)) z.forEach((Y) => {
                        K.add(_, Y)
                    });
                    else if (z !== void 0) K.add(_, z)
                } catch (Y) {
                    let A = `Failed to add metadata entry ${_}: ${z}. ${(0,quz.getErrorMessage)(Y)}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
                    (0, txz.log)(exz.LogVerbosity.ERROR, A)
                }
            }
            return K
        }
    }
    O6K.Metadata = Im8;
    var Ouz = (q) => {
        return Buffer.isBuffer(q) ? q.toString("base64") : q
    }
})
// @from(Ln 307174, Col 4)
um8 = p(($6K) => {
    Object.defineProperty($6K, "__esModule", {
        value: !0
    });
    $6K.CallCredentials = void 0;
    var Dt1 = QD();

    function wuz(q) {
        return "getRequestHeaders" in q && typeof q.getRequestHeaders === "function"
    }
    class MS6 {
        static createFromMetadataGenerator(q) {
            return new Zt1(q)
        }
        static createFromGoogleCredential(q) {
            return MS6.createFromMetadataGenerator((K, _) => {
                let z;
                if (wuz(q)) z = q.getRequestHeaders(K.service_url);
                else z = new Promise((Y, A) => {
                    q.getRequestMetadata(K.service_url, (O, w) => {
                        if (O) {
                            A(O);
                            return
                        }
                        if (!w) {
                            A(Error("Headers not set by metadata plugin"));
                            return
                        }
                        Y(w)
                    })
                });
                z.then((Y) => {
                    let A = new Dt1.Metadata;
                    for (let O of Object.keys(Y)) A.add(O, Y[O]);
                    _(null, A)
                }, (Y) => {
                    _(Y)
                })
            })
        }
        static createEmpty() {
            return new ft1
        }
    }
    $6K.CallCredentials = MS6;
    class xm8 extends MS6 {
        constructor(q) {
            super();
            this.creds = q
        }
        async generateMetadata(q) {
            let K = new Dt1.Metadata,
                _ = await Promise.all(this.creds.map((z) => z.generateMetadata(q)));
            for (let z of _) K.merge(z);
            return K
        }
        compose(q) {
            return new xm8(this.creds.concat([q]))
        }
        _equals(q) {
            if (this === q) return !0;
            if (q instanceof xm8) return this.creds.every((K, _) => K._equals(q.creds[_]));
            else return !1
        }
    }
    class Zt1 extends MS6 {
        constructor(q) {
            super();
            this.metadataGenerator = q
        }
        generateMetadata(q) {
            return new Promise((K, _) => {
                this.metadataGenerator(q, (z, Y) => {
                    if (Y !== void 0) K(Y);
                    else _(z)
                })
            })
        }
        compose(q) {
            return new xm8([this, q])
        }
        _equals(q) {
            if (this === q) return !0;
            if (q instanceof Zt1) return this.metadataGenerator === q.metadataGenerator;
            else return !1
        }
    }
    class ft1 extends MS6 {
        generateMetadata(q) {
            return Promise.resolve(new Dt1.Metadata)
        }
        compose(q) {
            return q
        }
        _equals(q) {
            return q instanceof ft1
        }
    }
})
// @from(Ln 307273, Col 4)
vt1 = p((J6K) => {
    Object.defineProperty(J6K, "__esModule", {
        value: !0
    });
    J6K.CIPHER_SUITES = void 0;
    J6K.getDefaultRootsData = juz;
    var $uz = d6("fs");
    J6K.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
    var H6K = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH,
        Gt1 = null;

    function juz() {
        if (H6K) {
            if (Gt1 === null) Gt1 = $uz.readFileSync(H6K);
            return Gt1
        }
        return null
    }
})
// @from(Ln 307292, Col 4)
nk = p((P6K) => {
    Object.defineProperty(P6K, "__esModule", {
        value: !0
    });
    P6K.parseUri = Xuz;
    P6K.splitHostPort = Muz;
    P6K.combineHostPort = Puz;
    P6K.uriToString = Wuz;
    var Juz = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;

    function Xuz(q) {
        let K = Juz.exec(q);
        if (K === null) return null;
        return {
            scheme: K[1],
            authority: K[2],
            path: K[3]
        }
    }
    var M6K = /^\d+$/;

    function Muz(q) {
        if (q.startsWith("[")) {
            let K = q.indexOf("]");
            if (K === -1) return null;
            let _ = q.substring(1, K);
            if (_.indexOf(":") === -1) return null;
            if (q.length > K + 1)
                if (q[K + 1] === ":") {
                    let z = q.substring(K + 2);
                    if (M6K.test(z)) return {
                        host: _,
                        port: +z
                    };
                    else return null
                } else return null;
            else return {
                host: _
            }
        } else {
            let K = q.split(":");
            if (K.length === 2)
                if (M6K.test(K[1])) return {
                    host: K[0],
                    port: +K[1]
                };
                else return null;
            else return {
                host: q
            }
        }
    }

    function Puz(q) {
        if (q.port === void 0) return q.host;
        else if (q.host.includes(":")) return `[${q.host}]:${q.port}`;
        else return `${q.host}:${q.port}`
    }

    function Wuz(q) {
        let K = "";
        if (q.scheme !== void 0) K += q.scheme + ":";
        if (q.authority !== void 0) K += "//" + q.authority + "/";
        return K += q.path, K
    }
})
// @from(Ln 307358, Col 4)
GF = p((W6K) => {
    Object.defineProperty(W6K, "__esModule", {
        value: !0
    });
    W6K.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = void 0;
    W6K.registerResolver = vuz;
    W6K.registerDefaultScheme = Tuz;
    W6K.createResolver = Vuz;
    W6K.getDefaultAuthority = kuz;
    W6K.mapUriDefaultScheme = Nuz;
    var Vt1 = nk();
    W6K.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = "grpc.internal.config_selector";
    var PS6 = {},
        Tt1 = null;

    function vuz(q, K) {
        PS6[q] = K
    }

    function Tuz(q) {
        Tt1 = q
    }

    function Vuz(q, K, _) {
        if (q.scheme !== void 0 && q.scheme in PS6) return new PS6[q.scheme](q, K, _);
        else throw Error(`No resolver could be created for target ${(0,Vt1.uriToString)(q)}`)
    }

    function kuz(q) {
        if (q.scheme !== void 0 && q.scheme in PS6) return PS6[q.scheme].getDefaultAuthority(q);
        else throw Error(`Invalid target ${(0,Vt1.uriToString)(q)}`)
    }

    function Nuz(q) {
        if (q.scheme === void 0 || !(q.scheme in PS6))
            if (Tt1 !== null) return {
                scheme: Tt1,
                authority: void 0,
                path: (0, Vt1.uriToString)(q)
            };
            else return null;
        return q
    }
})
// @from(Ln 307402, Col 4)
DS6 = p((v6K) => {
    Object.defineProperty(v6K, "__esModule", {
        value: !0
    });
    v6K.ChannelCredentials = void 0;
    v6K.createCertificateProviderChannelCredentials = Iuz;
    var d78 = d6("tls"),
        pm8 = um8(),
        Nt1 = vt1(),
        Z6K = nk(),
        Suz = GF(),
        Cuz = o2(),
        buz = e_();

    function kt1(q, K) {
        if (q && !(q instanceof Buffer)) throw TypeError(`${K}, if provided, must be a Buffer.`)
    }
    class WS6 {
        compose(q) {
            return new Bm8(this, q)
        }
        static createSsl(q, K, _, z) {
            var Y;
            if (kt1(q, "Root certificate"), kt1(K, "Private key"), kt1(_, "Certificate chain"), K && !_) throw Error("Private key must be given with accompanying certificate chain");
            if (!K && _) throw Error("Certificate chain must be given with accompanying private key");
            let A = (0, d78.createSecureContext)({
                ca: (Y = q !== null && q !== void 0 ? q : (0, Nt1.getDefaultRootsData)()) !== null && Y !== void 0 ? Y : void 0,
                key: K !== null && K !== void 0 ? K : void 0,
                cert: _ !== null && _ !== void 0 ? _ : void 0,
                ciphers: Nt1.CIPHER_SUITES
            });
            return new mm8(A, z !== null && z !== void 0 ? z : {})
        }
        static createFromSecureContext(q, K) {
            return new mm8(q, K !== null && K !== void 0 ? K : {})
        }
        static createInsecure() {
            return new Et1
        }
    }
    v6K.ChannelCredentials = WS6;
    class Et1 extends WS6 {
        constructor() {
            super()
        }
        compose(q) {
            throw Error("Cannot compose insecure credentials")
        }
        _isSecure() {
            return !1
        }
        _equals(q) {
            return q instanceof Et1
        }
        _createSecureConnector(q, K, _) {
            return {
                connect(z) {
                    return Promise.resolve({
                        socket: z,
                        secure: !1
                    })
                },
                waitForReady: () => {
                    return Promise.resolve()
                },
                getCallCredentials: () => {
                    return _ !== null && _ !== void 0 ? _ : pm8.CallCredentials.createEmpty()
                },
                destroy() {}
            }
        }
    }

    function f6K(q, K, _, z) {
        var Y, A;
        let O = {
                secureContext: q
            },
            w = _;
        if ("grpc.http_connect_target" in z) {
            let J = (0, Z6K.parseUri)(z["grpc.http_connect_target"]);
            if (J) w = J
        }
        let $ = (0, Suz.getDefaultAuthority)(w),
            j = (0, Z6K.splitHostPort)($),
            H = (Y = j === null || j === void 0 ? void 0 : j.host) !== null && Y !== void 0 ? Y : $;
        if (O.host = H, K.checkServerIdentity) O.checkServerIdentity = K.checkServerIdentity;
        if (K.rejectUnauthorized !== void 0) O.rejectUnauthorized = K.rejectUnauthorized;
        if (O.ALPNProtocols = ["h2"], z["grpc.ssl_target_name_override"]) {
            let J = z["grpc.ssl_target_name_override"],
                X = (A = O.checkServerIdentity) !== null && A !== void 0 ? A : d78.checkServerIdentity;
            O.checkServerIdentity = (M, P) => {
                return X(J, P)
            }, O.servername = J
        } else O.servername = H;
        if (z["grpc-node.tls_enable_trace"]) O.enableTrace = !0;
        return O
    }
    class G6K {
        constructor(q, K) {
            this.connectionOptions = q, this.callCredentials = K
        }
        connect(q) {
            let K = Object.assign({
                socket: q
            }, this.connectionOptions);
            return new Promise((_, z) => {
                let Y = (0, d78.connect)(K, () => {
                    var A;
                    if (((A = this.connectionOptions.rejectUnauthorized) !== null && A !== void 0 ? A : !0) && !Y.authorized) {
                        z(Y.authorizationError);
                        return
                    }
                    _({
                        socket: Y,
                        secure: !0
                    })
                });
                Y.on("error", (A) => {
                    z(A)
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
    class mm8 extends WS6 {
        constructor(q, K) {
            super();
            this.secureContext = q, this.verifyOptions = K
        }
        _isSecure() {
            return !0
        }
        _equals(q) {
            if (this === q) return !0;
            if (q instanceof mm8) return this.secureContext === q.secureContext && this.verifyOptions.checkServerIdentity === q.verifyOptions.checkServerIdentity;
            else return !1
        }
        _createSecureConnector(q, K, _) {
            let z = f6K(this.secureContext, this.verifyOptions, q, K);
            return new G6K(z, _ !== null && _ !== void 0 ? _ : pm8.CallCredentials.createEmpty())
        }
    }
    class Q78 extends WS6 {
        constructor(q, K, _) {
            super();
            this.caCertificateProvider = q, this.identityCertificateProvider = K, this.verifyOptions = _, this.refcount = 0, this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this), this.secureContextWatchers = []
        }
        _isSecure() {
            return !0
        }
        _equals(q) {
            var K, _;
            if (this === q) return !0;
            if (q instanceof Q78) return this.caCertificateProvider === q.caCertificateProvider && this.identityCertificateProvider === q.identityCertificateProvider && ((K = this.verifyOptions) === null || K === void 0 ? void 0 : K.checkServerIdentity) === ((_ = q.verifyOptions) === null || _ === void 0 ? void 0 : _.checkServerIdentity);
            else return !1
        }
        ref() {
            var q;
            if (this.refcount === 0) this.caCertificateProvider.addCaCertificateListener(this.caCertificateUpdateListener), (q = this.identityCertificateProvider) === null || q === void 0 || q.addIdentityCertificateListener(this.identityCertificateUpdateListener);
            this.refcount += 1
        }
        unref() {
            var q;
            if (this.refcount -= 1, this.refcount === 0) this.caCertificateProvider.removeCaCertificateListener(this.caCertificateUpdateListener), (q = this.identityCertificateProvider) === null || q === void 0 || q.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
        }
        _createSecureConnector(q, K, _) {
            return this.ref(), new Q78.SecureConnectorImpl(this, q, K, _ !== null && _ !== void 0 ? _ : pm8.CallCredentials.createEmpty())
        }
        maybeUpdateWatchers() {
            if (this.hasReceivedUpdates()) {
                for (let q of this.secureContextWatchers) q(this.getLatestSecureContext());
                this.secureContextWatchers = []
            }
        }
        handleCaCertificateUpdate(q) {
            this.latestCaUpdate = q, this.maybeUpdateWatchers()
        }
        handleIdentityCertitificateUpdate(q) {
            this.latestIdentityUpdate = q, this.maybeUpdateWatchers()
        }
        hasReceivedUpdates() {
            if (this.latestCaUpdate === void 0) return !1;
            if (this.identityCertificateProvider && this.latestIdentityUpdate === void 0) return !1;
            return !0
        }
        getSecureContext() {
            if (this.hasReceivedUpdates()) return Promise.resolve(this.getLatestSecureContext());
            else return new Promise((q) => {
                this.secureContextWatchers.push(q)
            })
        }
        getLatestSecureContext() {
            var q, K;
            if (!this.latestCaUpdate) return null;
            if (this.identityCertificateProvider !== null && !this.latestIdentityUpdate) return null;
            try {
                return (0, d78.createSecureContext)({
                    ca: this.latestCaUpdate.caCertificate,
                    key: (q = this.latestIdentityUpdate) === null || q === void 0 ? void 0 : q.privateKey,
                    cert: (K = this.latestIdentityUpdate) === null || K === void 0 ? void 0 : K.certificate,
                    ciphers: Nt1.CIPHER_SUITES
                })
            } catch (_) {
                return (0, Cuz.log)(buz.LogVerbosity.ERROR, "Failed to createSecureContext with error " + _.message), null
            }
        }
    }
    Q78.SecureConnectorImpl = class {
        constructor(q, K, _, z) {
            this.parent = q, this.channelTarget = K, this.options = _, this.callCredentials = z
        }
        connect(q) {
            return new Promise((K, _) => {
                let z = this.parent.getLatestSecureContext();
                if (!z) {
                    _(Error("Failed to load credentials"));
                    return
                }
                if (q.closed) _(Error("Socket closed while loading credentials"));
                let Y = f6K(z, this.parent.verifyOptions, this.channelTarget, this.options),
                    A = Object.assign({
                        socket: q
                    }, Y),
                    O = () => {
                        _(Error("Socket closed"))
                    },
                    w = (j) => {
                        _(j)
                    },
                    $ = (0, d78.connect)(A, () => {
                        var j;
                        if ($.removeListener("close", O), $.removeListener("error", w), ((j = this.parent.verifyOptions.rejectUnauthorized) !== null && j !== void 0 ? j : !0) && !$.authorized) {
                            _($.authorizationError);
                            return
                        }
                        K({
                            socket: $,
                            secure: !0
                        })
                    });
                $.once("close", O), $.once("error", w)
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

    function Iuz(q, K, _) {
        return new Q78(q, K, _ !== null && _ !== void 0 ? _ : {})
    }
    class Bm8 extends WS6 {
        constructor(q, K) {
            super();
            if (this.channelCredentials = q, this.callCredentials = K, !q._isSecure()) throw Error("Cannot compose insecure credentials")
        }
        compose(q) {
            let K = this.callCredentials.compose(q);
            return new Bm8(this.channelCredentials, K)
        }
        _isSecure() {
            return !0
        }
        _equals(q) {
            if (this === q) return !0;
            if (q instanceof Bm8) return this.channelCredentials._equals(q.channelCredentials) && this.callCredentials._equals(q.callCredentials);
            else return !1
        }
        _createSecureConnector(q, K, _) {
            let z = this.callCredentials.compose(_ !== null && _ !== void 0 ? _ : pm8.CallCredentials.createEmpty());
            return this.channelCredentials._createSecureConnector(q, K, z)
        }
    }
})
// @from(Ln 307689, Col 4)
y36 = p((k6K) => {
    Object.defineProperty(k6K, "__esModule", {
        value: !0
    });
    k6K.createChildChannelControlHelper = Buz;
    k6K.registerLoadBalancerType = puz;
    k6K.registerDefaultLoadBalancerType = Fuz;
    k6K.createLoadBalancer = guz;
    k6K.isLoadBalancerNameRegistered = Uuz;
    k6K.parseLoadBalancingConfig = V6K;
    k6K.getDefaultConfig = Quz;
    k6K.selectLbConfigFromList = duz;
    var uuz = o2(),
        muz = e_();

    function Buz(q, K) {
        var _, z, Y, A, O, w, $, j, H, J;
        return {
            createSubchannel: (z = (_ = K.createSubchannel) === null || _ === void 0 ? void 0 : _.bind(K)) !== null && z !== void 0 ? z : q.createSubchannel.bind(q),
            updateState: (A = (Y = K.updateState) === null || Y === void 0 ? void 0 : Y.bind(K)) !== null && A !== void 0 ? A : q.updateState.bind(q),
            requestReresolution: (w = (O = K.requestReresolution) === null || O === void 0 ? void 0 : O.bind(K)) !== null && w !== void 0 ? w : q.requestReresolution.bind(q),
            addChannelzChild: (j = ($ = K.addChannelzChild) === null || $ === void 0 ? void 0 : $.bind(K)) !== null && j !== void 0 ? j : q.addChannelzChild.bind(q),
            removeChannelzChild: (J = (H = K.removeChannelzChild) === null || H === void 0 ? void 0 : H.bind(K)) !== null && J !== void 0 ? J : q.removeChannelzChild.bind(q)
        }
    }
    var E36 = {},
        c78 = null;

    function puz(q, K, _) {
        E36[q] = {
            LoadBalancer: K,
            LoadBalancingConfig: _
        }
    }

    function Fuz(q) {
        c78 = q
    }

    function guz(q, K) {
        let _ = q.getLoadBalancerName();
        if (_ in E36) return new E36[_].LoadBalancer(K);
        else return null
    }

    function Uuz(q) {
        return q in E36
    }

    function V6K(q) {
        let K = Object.keys(q);
        if (K.length !== 1) throw Error("Provided load balancing config has multiple conflicting entries");
        let _ = K[0];
        if (_ in E36) try {
            return E36[_].LoadBalancingConfig.createFromJson(q[_])
        } catch (z) {
            throw Error(`${_}: ${z.message}`)
        } else throw Error(`Unrecognized load balancing config name ${_}`)
    }

    function Quz() {
        if (!c78) throw Error("No default load balancer type registered");
        return new E36[c78].LoadBalancingConfig
    }

    function duz(q, K = !1) {
        for (let _ of q) try {
            return V6K(_)
        } catch (z) {
            (0, uuz.log)(muz.LogVerbosity.DEBUG, "Config parsing failed with error", z.message);
            continue
        }
        if (K)
            if (c78) return new E36[c78].LoadBalancingConfig;
            else return null;
        else return null
    }
})
// @from(Ln 307767, Col 4)
yt1 = p((y6K) => {
    Object.defineProperty(y6K, "__esModule", {
        value: !0
    });
    y6K.validateRetryThrottling = N6K;
    y6K.validateServiceConfig = E6K;
    y6K.extractAndSelectServiceConfig = wmz;
    var tuz = d6("os"),
        Fm8 = e_(),
        gm8 = /^\d+(\.\d{1,9})?s$/,
        euz = "node";

    function qmz(q) {
        if ("service" in q && q.service !== "") {
            if (typeof q.service !== "string") throw Error(`Invalid method config name: invalid service: expected type string, got ${typeof q.service}`);
            if ("method" in q && q.method !== "") {
                if (typeof q.method !== "string") throw Error(`Invalid method config name: invalid method: expected type string, got ${typeof q.service}`);
                return {
                    service: q.service,
                    method: q.method
                }
            } else return {
                service: q.service
            }
        } else {
            if ("method" in q && q.method !== void 0) throw Error("Invalid method config name: method set with empty or unset service");
            return {}
        }
    }

    function Kmz(q) {
        if (!("maxAttempts" in q) || !Number.isInteger(q.maxAttempts) || q.maxAttempts < 2) throw Error("Invalid method config retry policy: maxAttempts must be an integer at least 2");
        if (!("initialBackoff" in q) || typeof q.initialBackoff !== "string" || !gm8.test(q.initialBackoff)) throw Error("Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s");
        if (!("maxBackoff" in q) || typeof q.maxBackoff !== "string" || !gm8.test(q.maxBackoff)) throw Error("Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s");
        if (!("backoffMultiplier" in q) || typeof q.backoffMultiplier !== "number" || q.backoffMultiplier <= 0) throw Error("Invalid method config retry policy: backoffMultiplier must be a number greater than 0");
        if (!(("retryableStatusCodes" in q) && Array.isArray(q.retryableStatusCodes))) throw Error("Invalid method config retry policy: retryableStatusCodes is required");
        if (q.retryableStatusCodes.length === 0) throw Error("Invalid method config retry policy: retryableStatusCodes must be non-empty");
        for (let K of q.retryableStatusCodes)
            if (typeof K === "number") {
                if (!Object.values(Fm8.Status).includes(K)) throw Error("Invalid method config retry policy: retryableStatusCodes value not in status code range")
            } else if (typeof K === "string") {
            if (!Object.values(Fm8.Status).includes(K.toUpperCase())) throw Error("Invalid method config retry policy: retryableStatusCodes value not a status code name")
        } else throw Error("Invalid method config retry policy: retryableStatusCodes value must be a string or number");
        return {
            maxAttempts: q.maxAttempts,
            initialBackoff: q.initialBackoff,
            maxBackoff: q.maxBackoff,
            backoffMultiplier: q.backoffMultiplier,
            retryableStatusCodes: q.retryableStatusCodes
        }
    }

    function _mz(q) {
        if (!("maxAttempts" in q) || !Number.isInteger(q.maxAttempts) || q.maxAttempts < 2) throw Error("Invalid method config hedging policy: maxAttempts must be an integer at least 2");
        if ("hedgingDelay" in q && (typeof q.hedgingDelay !== "string" || !gm8.test(q.hedgingDelay))) throw Error("Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s");
        if ("nonFatalStatusCodes" in q && Array.isArray(q.nonFatalStatusCodes))
            for (let _ of q.nonFatalStatusCodes)
                if (typeof _ === "number") {
                    if (!Object.values(Fm8.Status).includes(_)) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not in status code range")
                } else if (typeof _ === "string") {
            if (!Object.values(Fm8.Status).includes(_.toUpperCase())) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not a status code name")
        } else throw Error("Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number");
        let K = {
            maxAttempts: q.maxAttempts
        };
        if (q.hedgingDelay) K.hedgingDelay = q.hedgingDelay;
        if (q.nonFatalStatusCodes) K.nonFatalStatusCodes = q.nonFatalStatusCodes;
        return K
    }

    function zmz(q) {
        var K;
        let _ = {
            name: []
        };
        if (!("name" in q) || !Array.isArray(q.name)) throw Error("Invalid method config: invalid name array");
        for (let z of q.name) _.name.push(qmz(z));
        if ("waitForReady" in q) {
            if (typeof q.waitForReady !== "boolean") throw Error("Invalid method config: invalid waitForReady");
            _.waitForReady = q.waitForReady
        }
        if ("timeout" in q)
            if (typeof q.timeout === "object") {
                if (!("seconds" in q.timeout) || typeof q.timeout.seconds !== "number") throw Error("Invalid method config: invalid timeout.seconds");
                if (!("nanos" in q.timeout) || typeof q.timeout.nanos !== "number") throw Error("Invalid method config: invalid timeout.nanos");
                _.timeout = q.timeout
            } else if (typeof q.timeout === "string" && gm8.test(q.timeout)) {
            let z = q.timeout.substring(0, q.timeout.length - 1).split(".");
            _.timeout = {
                seconds: z[0] | 0,
                nanos: ((K = z[1]) !== null && K !== void 0 ? K : 0) | 0
            }
        } else throw Error("Invalid method config: invalid timeout");
        if ("maxRequestBytes" in q) {
            if (typeof q.maxRequestBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
            _.maxRequestBytes = q.maxRequestBytes
        }
        if ("maxResponseBytes" in q) {
            if (typeof q.maxResponseBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
            _.maxResponseBytes = q.maxResponseBytes
        }
        if ("retryPolicy" in q)
            if ("hedgingPolicy" in q) throw Error("Invalid method config: retryPolicy and hedgingPolicy cannot both be specified");
            else _.retryPolicy = Kmz(q.retryPolicy);
        else if ("hedgingPolicy" in q) _.hedgingPolicy = _mz(q.hedgingPolicy);
        return _
    }

    function N6K(q) {
        if (!("maxTokens" in q) || typeof q.maxTokens !== "number" || q.maxTokens <= 0 || q.maxTokens > 1000) throw Error("Invalid retryThrottling: maxTokens must be a number in (0, 1000]");
        if (!("tokenRatio" in q) || typeof q.tokenRatio !== "number" || q.tokenRatio <= 0) throw Error("Invalid retryThrottling: tokenRatio must be a number greater than 0");
        return {
            maxTokens: +q.maxTokens.toFixed(3),
            tokenRatio: +q.tokenRatio.toFixed(3)
        }
    }

    function Ymz(q) {
        if (!(typeof q === "object" && q !== null)) throw Error(`Invalid loadBalancingConfig: unexpected type ${typeof q}`);
        let K = Object.keys(q);
        if (K.length > 1) throw Error(`Invalid loadBalancingConfig: unexpected multiple keys ${K}`);
        if (K.length === 0) throw Error("Invalid loadBalancingConfig: load balancing policy name required");
        return {
            [K[0]]: q[K[0]]
        }
    }

    function E6K(q) {
        let K = {
            loadBalancingConfig: [],
            methodConfig: []
        };
        if ("loadBalancingPolicy" in q)
            if (typeof q.loadBalancingPolicy === "string") K.loadBalancingPolicy = q.loadBalancingPolicy;
            else throw Error("Invalid service config: invalid loadBalancingPolicy");
        if ("loadBalancingConfig" in q)
            if (Array.isArray(q.loadBalancingConfig))
                for (let z of q.loadBalancingConfig) K.loadBalancingConfig.push(Ymz(z));
            else throw Error("Invalid service config: invalid loadBalancingConfig");
        if ("methodConfig" in q) {
            if (Array.isArray(q.methodConfig))
                for (let z of q.methodConfig) K.methodConfig.push(zmz(z))
        }
        if ("retryThrottling" in q) K.retryThrottling = N6K(q.retryThrottling);
        let _ = [];
        for (let z of K.methodConfig)
            for (let Y of z.name) {
                for (let A of _)
                    if (Y.service === A.service && Y.method === A.method) throw Error(`Invalid service config: duplicate name ${Y.service}/${Y.method}`);
                _.push(Y)
            }
        return K
    }

    function Amz(q) {
        if (!("serviceConfig" in q)) throw Error("Invalid service config choice: missing service config");
        let K = {
            serviceConfig: E6K(q.serviceConfig)
        };
        if ("clientLanguage" in q)
            if (Array.isArray(q.clientLanguage)) {
                K.clientLanguage = [];
                for (let z of q.clientLanguage)
                    if (typeof z === "string") K.clientLanguage.push(z);
                    else throw Error("Invalid service config choice: invalid clientLanguage")
            } else throw Error("Invalid service config choice: invalid clientLanguage");
        if ("clientHostname" in q)
            if (Array.isArray(q.clientHostname)) {
                K.clientHostname = [];
                for (let z of q.clientHostname)
                    if (typeof z === "string") K.clientHostname.push(z);
                    else throw Error("Invalid service config choice: invalid clientHostname")
            } else throw Error("Invalid service config choice: invalid clientHostname");
        if ("percentage" in q)
            if (typeof q.percentage === "number" && 0 <= q.percentage && q.percentage <= 100) K.percentage = q.percentage;
            else throw Error("Invalid service config choice: invalid percentage");
        let _ = ["clientLanguage", "percentage", "clientHostname", "serviceConfig"];
        for (let z in q)
            if (!_.includes(z)) throw Error(`Invalid service config choice: unexpected field ${z}`);
        return K
    }

    function Omz(q, K) {
        if (!Array.isArray(q)) throw Error("Invalid service config list");
        for (let _ of q) {
            let z = Amz(_);
            if (typeof z.percentage === "number" && K > z.percentage) continue;
            if (Array.isArray(z.clientHostname)) {
                let Y = !1;
                for (let A of z.clientHostname)
                    if (A === tuz.hostname()) Y = !0;
                if (!Y) continue
            }
            if (Array.isArray(z.clientLanguage)) {
                let Y = !1;
                for (let A of z.clientLanguage)
                    if (A === euz) Y = !0;
                if (!Y) continue
            }
            return z.serviceConfig
        }
        throw Error("No matching service config found")
    }

    function wmz(q, K) {
        for (let _ of q)
            if (_.length > 0 && _[0].startsWith("grpc_config=")) {
                let z = _.join("").substring(12),
                    Y = JSON.parse(z);
                return Omz(Y, K)
            } return null
    }
})
// @from(Ln 307980, Col 4)
ik = p((h6K) => {
    Object.defineProperty(h6K, "__esModule", {
        value: !0
    });
    h6K.ConnectivityState = void 0;
    var L6K;
    (function(q) {
        q[q.IDLE = 0] = "IDLE", q[q.CONNECTING = 1] = "CONNECTING", q[q.READY = 2] = "READY", q[q.TRANSIENT_FAILURE = 3] = "TRANSIENT_FAILURE", q[q.SHUTDOWN = 4] = "SHUTDOWN"
    })(L6K || (h6K.ConnectivityState = L6K = {}))
})
// @from(Ln 307990, Col 4)
Mt = p((b6K) => {
    Object.defineProperty(b6K, "__esModule", {
        value: !0
    });
    b6K.QueuePicker = b6K.UnavailablePicker = b6K.PickResultType = void 0;
    var Jmz = QD(),
        Xmz = e_(),
        Um8;
    (function(q) {
        q[q.COMPLETE = 0] = "COMPLETE", q[q.QUEUE = 1] = "QUEUE", q[q.TRANSIENT_FAILURE = 2] = "TRANSIENT_FAILURE", q[q.DROP = 3] = "DROP"
    })(Um8 || (b6K.PickResultType = Um8 = {}));
    class S6K {
        constructor(q) {
            this.status = Object.assign({
                code: Xmz.Status.UNAVAILABLE,
                details: "No connection established",
                metadata: new Jmz.Metadata
            }, q)
        }
        pick(q) {
            return {
                pickResultType: Um8.TRANSIENT_FAILURE,
                subchannel: null,
                status: this.status,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    b6K.UnavailablePicker = S6K;
    class C6K {
        constructor(q, K) {
            this.loadBalancer = q, this.childPicker = K, this.calledExitIdle = !1
        }
        pick(q) {
            if (!this.calledExitIdle) process.nextTick(() => {
                this.loadBalancer.exitIdle()
            }), this.calledExitIdle = !0;
            if (this.childPicker) return this.childPicker.pick(q);
            else return {
                pickResultType: Um8.QUEUE,
                subchannel: null,
                status: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    b6K.QueuePicker = C6K
})
// @from(Ln 308040, Col 4)
ZS6 = p((x6K) => {
    Object.defineProperty(x6K, "__esModule", {
        value: !0
    });
    x6K.BackoffTimeout = void 0;
    var Wmz = e_(),
        Dmz = o2(),
        Zmz = "backoff",
        fmz = 1000,
        Gmz = 1.6,
        vmz = 120000,
        Tmz = 0.2;

    function Vmz(q, K) {
        return Math.random() * (K - q) + q
    }
    class Qm8 {
        constructor(q, K) {
            if (this.callback = q, this.initialDelay = fmz, this.multiplier = Gmz, this.maxDelay = vmz, this.jitter = Tmz, this.running = !1, this.hasRef = !0, this.startTime = new Date, this.endTime = new Date, this.id = Qm8.getNextId(), K) {
                if (K.initialDelay) this.initialDelay = K.initialDelay;
                if (K.multiplier) this.multiplier = K.multiplier;
                if (K.jitter) this.jitter = K.jitter;
                if (K.maxDelay) this.maxDelay = K.maxDelay
            }
            this.trace("constructed initialDelay=" + this.initialDelay + " multiplier=" + this.multiplier + " jitter=" + this.jitter + " maxDelay=" + this.maxDelay), this.nextDelay = this.initialDelay, this.timerId = setTimeout(() => {}, 0), clearTimeout(this.timerId)
        }
        static getNextId() {
            return this.nextId++
        }
        trace(q) {
            Dmz.trace(Wmz.LogVerbosity.DEBUG, Zmz, "{" + this.id + "} " + q)
        }
        runTimer(q) {
            var K, _;
            if (this.trace("runTimer(delay=" + q + ")"), this.endTime = this.startTime, this.endTime.setMilliseconds(this.endTime.getMilliseconds() + q), clearTimeout(this.timerId), this.timerId = setTimeout(() => {
                    this.trace("timer fired"), this.running = !1, this.callback()
                }, q), !this.hasRef)(_ = (K = this.timerId).unref) === null || _ === void 0 || _.call(K)
        }
        runOnce() {
            this.trace("runOnce()"), this.running = !0, this.startTime = new Date, this.runTimer(this.nextDelay);
            let q = Math.min(this.nextDelay * this.multiplier, this.maxDelay),
                K = q * this.jitter;
            this.nextDelay = q + Vmz(-K, K)
        }
        stop() {
            this.trace("stop()"), clearTimeout(this.timerId), this.running = !1
        }
        reset() {
            if (this.trace("reset() running=" + this.running), this.nextDelay = this.initialDelay, this.running) {
                let q = new Date,
                    K = this.startTime;
                if (K.setMilliseconds(K.getMilliseconds() + this.nextDelay), clearTimeout(this.timerId), q < K) this.runTimer(K.getTime() - q.getTime());
                else this.running = !1
            }
        }
        isRunning() {
            return this.running
        }
        ref() {
            var q, K;
            this.hasRef = !0, (K = (q = this.timerId).ref) === null || K === void 0 || K.call(q)
        }
        unref() {
            var q, K;
            this.hasRef = !1, (K = (q = this.timerId).unref) === null || K === void 0 || K.call(q)
        }
        getEndTime() {
            return this.endTime
        }
    }
    x6K.BackoffTimeout = Qm8;
    Qm8.nextId = 0
})
// @from(Ln 308113, Col 4)
dm8 = p((B6K) => {
    Object.defineProperty(B6K, "__esModule", {
        value: !0
    });
    B6K.ChildLoadBalancerHandler = void 0;
    var kmz = y36(),
        Nmz = ik(),
        Emz = "child_load_balancer_helper";
    class m6K {
        constructor(q) {
            this.channelControlHelper = q, this.currentChild = null, this.pendingChild = null, this.latestConfig = null, this.ChildPolicyHelper = class {
                constructor(K) {
                    this.parent = K, this.child = null
                }
                createSubchannel(K, _) {
                    return this.parent.channelControlHelper.createSubchannel(K, _)
                }
                updateState(K, _, z) {
                    var Y;
                    if (this.calledByPendingChild()) {
                        if (K === Nmz.ConnectivityState.CONNECTING) return;
                        (Y = this.parent.currentChild) === null || Y === void 0 || Y.destroy(), this.parent.currentChild = this.parent.pendingChild, this.parent.pendingChild = null
                    } else if (!this.calledByCurrentChild()) return;
                    this.parent.channelControlHelper.updateState(K, _, z)
                }
                requestReresolution() {
                    var K;
                    let _ = (K = this.parent.pendingChild) !== null && K !== void 0 ? K : this.parent.currentChild;
                    if (this.child === _) this.parent.channelControlHelper.requestReresolution()
                }
                setChild(K) {
                    this.child = K
                }
                addChannelzChild(K) {
                    this.parent.channelControlHelper.addChannelzChild(K)
                }
                removeChannelzChild(K) {
                    this.parent.channelControlHelper.removeChannelzChild(K)
                }
                calledByPendingChild() {
                    return this.child === this.parent.pendingChild
                }
                calledByCurrentChild() {
                    return this.child === this.parent.currentChild
                }
            }
        }
        configUpdateRequiresNewPolicyInstance(q, K) {
            return q.getLoadBalancerName() !== K.getLoadBalancerName()
        }
        updateAddressList(q, K, _, z) {
            let Y;
            if (this.currentChild === null || this.latestConfig === null || this.configUpdateRequiresNewPolicyInstance(this.latestConfig, K)) {
                let A = new this.ChildPolicyHelper(this),
                    O = (0, kmz.createLoadBalancer)(K, A);
                if (A.setChild(O), this.currentChild === null) this.currentChild = O, Y = this.currentChild;
                else {
                    if (this.pendingChild) this.pendingChild.destroy();
                    this.pendingChild = O, Y = this.pendingChild
                }
            } else if (this.pendingChild === null) Y = this.currentChild;
            else Y = this.pendingChild;
            return this.latestConfig = K, Y.updateAddressList(q, K, _, z)
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
            return Emz
        }
    }
    B6K.ChildLoadBalancerHandler = m6K
})