
// @from(Ln 288474, Col 4)
fD2 = U((kD2) => {
  Object.defineProperty(kD2, "__esModule", {
    value: !0
  });
  kD2.hexToBinary = void 0;

  function vD2(A) {
    if (A >= 48 && A <= 57) return A - 48;
    if (A >= 97 && A <= 102) return A - 87;
    return A - 55
  }

  function HH5(A) {
    let Q = new Uint8Array(A.length / 2),
      B = 0;
    for (let G = 0; G < A.length; G += 2) {
      let Z = vD2(A.charCodeAt(G)),
        Y = vD2(A.charCodeAt(G + 1));
      Q[B++] = Z << 4 | Y
    }
    return Q
  }
  kD2.hexToBinary = HH5
})
// @from(Ln 288498, Col 4)
RJ1 = U((dD2) => {
  Object.defineProperty(dD2, "__esModule", {
    value: !0
  });
  dD2.getOtlpEncoder = dD2.encodeAsString = dD2.encodeAsLongBits = dD2.toLongBits = dD2.hrTimeToNanos = void 0;
  var EH5 = h8(),
    tW0 = fD2();

  function eW0(A) {
    let Q = BigInt(1e9);
    return BigInt(Math.trunc(A[0])) * Q + BigInt(Math.trunc(A[1]))
  }
  dD2.hrTimeToNanos = eW0;

  function gD2(A) {
    let Q = Number(BigInt.asUintN(32, A)),
      B = Number(BigInt.asUintN(32, A >> BigInt(32)));
    return {
      low: Q,
      high: B
    }
  }
  dD2.toLongBits = gD2;

  function AK0(A) {
    let Q = eW0(A);
    return gD2(Q)
  }
  dD2.encodeAsLongBits = AK0;

  function uD2(A) {
    return eW0(A).toString()
  }
  dD2.encodeAsString = uD2;
  var zH5 = typeof BigInt < "u" ? uD2 : EH5.hrTimeToNanoseconds;

  function hD2(A) {
    return A
  }

  function mD2(A) {
    if (A === void 0) return;
    return (0, tW0.hexToBinary)(A)
  }
  var $H5 = {
    encodeHrTime: AK0,
    encodeSpanContext: tW0.hexToBinary,
    encodeOptionalSpanContext: mD2
  };

  function CH5(A) {
    if (A === void 0) return $H5;
    let Q = A.useLongBits ?? !0,
      B = A.useHex ?? !1;
    return {
      encodeHrTime: Q ? AK0 : zH5,
      encodeSpanContext: B ? hD2 : tW0.hexToBinary,
      encodeOptionalSpanContext: B ? hD2 : mD2
    }
  }
  dD2.getOtlpEncoder = CH5
})
// @from(Ln 288560, Col 4)
_J1 = U((lD2) => {
  Object.defineProperty(lD2, "__esModule", {
    value: !0
  });
  lD2.toAnyValue = lD2.toKeyValue = lD2.toAttributes = lD2.createInstrumentationScope = lD2.createResource = void 0;

  function LH5(A) {
    let Q = {
        attributes: pD2(A.attributes),
        droppedAttributesCount: 0
      },
      B = A.schemaUrl;
    if (B && B !== "") Q.schemaUrl = B;
    return Q
  }
  lD2.createResource = LH5;

  function OH5(A) {
    return {
      name: A.name,
      version: A.version
    }
  }
  lD2.createInstrumentationScope = OH5;

  function pD2(A) {
    return Object.keys(A).map((Q) => QK0(Q, A[Q]))
  }
  lD2.toAttributes = pD2;

  function QK0(A, Q) {
    return {
      key: A,
      value: BK0(Q)
    }
  }
  lD2.toKeyValue = QK0;

  function BK0(A) {
    let Q = typeof A;
    if (Q === "string") return {
      stringValue: A
    };
    if (Q === "number") {
      if (!Number.isInteger(A)) return {
        doubleValue: A
      };
      return {
        intValue: A
      }
    }
    if (Q === "boolean") return {
      boolValue: A
    };
    if (A instanceof Uint8Array) return {
      bytesValue: A
    };
    if (Array.isArray(A)) return {
      arrayValue: {
        values: A.map(BK0)
      }
    };
    if (Q === "object" && A != null) return {
      kvlistValue: {
        values: Object.entries(A).map(([B, G]) => QK0(B, G))
      }
    };
    return {}
  }
  lD2.toAnyValue = BK0
})
// @from(Ln 288631, Col 4)
GK0 = U((aD2) => {
  Object.defineProperty(aD2, "__esModule", {
    value: !0
  });
  aD2.toLogAttributes = aD2.createExportLogsServiceRequest = void 0;
  var TH5 = RJ1(),
    jJ1 = _J1();

  function PH5(A, Q) {
    let B = (0, TH5.getOtlpEncoder)(Q);
    return {
      resourceLogs: xH5(A, B)
    }
  }
  aD2.createExportLogsServiceRequest = PH5;

  function SH5(A) {
    let Q = new Map;
    for (let B of A) {
      let {
        resource: G,
        instrumentationScope: {
          name: Z,
          version: Y = "",
          schemaUrl: J = ""
        }
      } = B, X = Q.get(G);
      if (!X) X = new Map, Q.set(G, X);
      let I = `${Z}@${Y}:${J}`,
        D = X.get(I);
      if (!D) D = [], X.set(I, D);
      D.push(B)
    }
    return Q
  }

  function xH5(A, Q) {
    let B = SH5(A);
    return Array.from(B, ([G, Z]) => {
      let Y = (0, jJ1.createResource)(G);
      return {
        resource: Y,
        scopeLogs: Array.from(Z, ([, J]) => {
          return {
            scope: (0, jJ1.createInstrumentationScope)(J[0].instrumentationScope),
            logRecords: J.map((X) => yH5(X, Q)),
            schemaUrl: J[0].instrumentationScope.schemaUrl
          }
        }),
        schemaUrl: Y.schemaUrl
      }
    })
  }

  function yH5(A, Q) {
    return {
      timeUnixNano: Q.encodeHrTime(A.hrTime),
      observedTimeUnixNano: Q.encodeHrTime(A.hrTimeObserved),
      severityNumber: vH5(A.severityNumber),
      severityText: A.severityText,
      body: (0, jJ1.toAnyValue)(A.body),
      eventName: A.eventName,
      attributes: nD2(A.attributes),
      droppedAttributesCount: A.droppedAttributesCount,
      flags: A.spanContext?.traceFlags,
      traceId: Q.encodeOptionalSpanContext(A.spanContext?.traceId),
      spanId: Q.encodeOptionalSpanContext(A.spanContext?.spanId)
    }
  }

  function vH5(A) {
    return A
  }

  function nD2(A) {
    return Object.keys(A).map((Q) => (0, jJ1.toKeyValue)(Q, A[Q]))
  }
  aD2.toLogAttributes = nD2
})
// @from(Ln 288710, Col 4)
eD2 = U((sD2) => {
  Object.defineProperty(sD2, "__esModule", {
    value: !0
  });
  sD2.ProtobufLogsSerializer = void 0;
  var rD2 = MJ1(),
    bH5 = GK0(),
    fH5 = rD2.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse,
    hH5 = rD2.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
  sD2.ProtobufLogsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, bH5.createExportLogsServiceRequest)(A);
      return hH5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return fH5.decode(A)
    }
  }
})
// @from(Ln 288729, Col 4)
AW2 = U((ZK0) => {
  Object.defineProperty(ZK0, "__esModule", {
    value: !0
  });
  ZK0.ProtobufLogsSerializer = void 0;
  var gH5 = eD2();
  Object.defineProperty(ZK0, "ProtobufLogsSerializer", {
    enumerable: !0,
    get: function () {
      return gH5.ProtobufLogsSerializer
    }
  })
})
// @from(Ln 288742, Col 4)
BW2 = U((QW2) => {
  Object.defineProperty(QW2, "__esModule", {
    value: !0
  });
  QW2.EAggregationTemporality = void 0;
  var mH5;
  (function (A) {
    A[A.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED", A[A.AGGREGATION_TEMPORALITY_DELTA = 1] = "AGGREGATION_TEMPORALITY_DELTA", A[A.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"
  })(mH5 = QW2.EAggregationTemporality || (QW2.EAggregationTemporality = {}))
})
// @from(Ln 288752, Col 4)
JK0 = U((DW2) => {
  Object.defineProperty(DW2, "__esModule", {
    value: !0
  });
  DW2.createExportMetricsServiceRequest = DW2.toMetric = DW2.toScopeMetrics = DW2.toResourceMetrics = void 0;
  var GW2 = p9(),
    XFA = sr(),
    ZW2 = BW2(),
    dH5 = RJ1(),
    ZvA = _J1();

  function JW2(A, Q) {
    let B = (0, dH5.getOtlpEncoder)(Q),
      G = (0, ZvA.createResource)(A.resource);
    return {
      resource: G,
      schemaUrl: G.schemaUrl,
      scopeMetrics: XW2(A.scopeMetrics, B)
    }
  }
  DW2.toResourceMetrics = JW2;

  function XW2(A, Q) {
    return Array.from(A.map((B) => ({
      scope: (0, ZvA.createInstrumentationScope)(B.scope),
      metrics: B.metrics.map((G) => IW2(G, Q)),
      schemaUrl: B.scope.schemaUrl
    })))
  }
  DW2.toScopeMetrics = XW2;

  function IW2(A, Q) {
    let B = {
        name: A.descriptor.name,
        description: A.descriptor.description,
        unit: A.descriptor.unit
      },
      G = iH5(A.aggregationTemporality);
    switch (A.dataPointType) {
      case XFA.DataPointType.SUM:
        B.sum = {
          aggregationTemporality: G,
          isMonotonic: A.isMonotonic,
          dataPoints: YW2(A, Q)
        };
        break;
      case XFA.DataPointType.GAUGE:
        B.gauge = {
          dataPoints: YW2(A, Q)
        };
        break;
      case XFA.DataPointType.HISTOGRAM:
        B.histogram = {
          aggregationTemporality: G,
          dataPoints: pH5(A, Q)
        };
        break;
      case XFA.DataPointType.EXPONENTIAL_HISTOGRAM:
        B.exponentialHistogram = {
          aggregationTemporality: G,
          dataPoints: lH5(A, Q)
        };
        break
    }
    return B
  }
  DW2.toMetric = IW2;

  function cH5(A, Q, B) {
    let G = {
      attributes: (0, ZvA.toAttributes)(A.attributes),
      startTimeUnixNano: B.encodeHrTime(A.startTime),
      timeUnixNano: B.encodeHrTime(A.endTime)
    };
    switch (Q) {
      case GW2.ValueType.INT:
        G.asInt = A.value;
        break;
      case GW2.ValueType.DOUBLE:
        G.asDouble = A.value;
        break
    }
    return G
  }

  function YW2(A, Q) {
    return A.dataPoints.map((B) => {
      return cH5(B, A.descriptor.valueType, Q)
    })
  }

  function pH5(A, Q) {
    return A.dataPoints.map((B) => {
      let G = B.value;
      return {
        attributes: (0, ZvA.toAttributes)(B.attributes),
        bucketCounts: G.buckets.counts,
        explicitBounds: G.buckets.boundaries,
        count: G.count,
        sum: G.sum,
        min: G.min,
        max: G.max,
        startTimeUnixNano: Q.encodeHrTime(B.startTime),
        timeUnixNano: Q.encodeHrTime(B.endTime)
      }
    })
  }

  function lH5(A, Q) {
    return A.dataPoints.map((B) => {
      let G = B.value;
      return {
        attributes: (0, ZvA.toAttributes)(B.attributes),
        count: G.count,
        min: G.min,
        max: G.max,
        sum: G.sum,
        positive: {
          offset: G.positive.offset,
          bucketCounts: G.positive.bucketCounts
        },
        negative: {
          offset: G.negative.offset,
          bucketCounts: G.negative.bucketCounts
        },
        scale: G.scale,
        zeroCount: G.zeroCount,
        startTimeUnixNano: Q.encodeHrTime(B.startTime),
        timeUnixNano: Q.encodeHrTime(B.endTime)
      }
    })
  }

  function iH5(A) {
    switch (A) {
      case XFA.AggregationTemporality.DELTA:
        return ZW2.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
      case XFA.AggregationTemporality.CUMULATIVE:
        return ZW2.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE
    }
  }

  function nH5(A, Q) {
    return {
      resourceMetrics: A.map((B) => JW2(B, Q))
    }
  }
  DW2.createExportMetricsServiceRequest = nH5
})
// @from(Ln 288901, Col 4)
HW2 = U((VW2) => {
  Object.defineProperty(VW2, "__esModule", {
    value: !0
  });
  VW2.ProtobufMetricsSerializer = void 0;
  var KW2 = MJ1(),
    sH5 = JK0(),
    tH5 = KW2.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse,
    eH5 = KW2.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
  VW2.ProtobufMetricsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, sH5.createExportMetricsServiceRequest)([A]);
      return eH5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return tH5.decode(A)
    }
  }
})
// @from(Ln 288920, Col 4)
EW2 = U((XK0) => {
  Object.defineProperty(XK0, "__esModule", {
    value: !0
  });
  XK0.ProtobufMetricsSerializer = void 0;
  var AE5 = HW2();
  Object.defineProperty(XK0, "ProtobufMetricsSerializer", {
    enumerable: !0,
    get: function () {
      return AE5.ProtobufMetricsSerializer
    }
  })
})
// @from(Ln 288933, Col 4)
IK0 = U((qW2) => {
  Object.defineProperty(qW2, "__esModule", {
    value: !0
  });
  qW2.createExportTraceServiceRequest = qW2.toOtlpSpanEvent = qW2.toOtlpLink = qW2.sdkSpanToOtlpSpan = void 0;
  var YvA = _J1(),
    BE5 = RJ1(),
    GE5 = 256,
    ZE5 = 512;

  function zW2(A, Q) {
    let B = A & 255 | GE5;
    if (Q) B |= ZE5;
    return B
  }

  function $W2(A, Q) {
    let B = A.spanContext(),
      G = A.status,
      Z = A.parentSpanContext?.spanId ? Q.encodeSpanContext(A.parentSpanContext?.spanId) : void 0;
    return {
      traceId: Q.encodeSpanContext(B.traceId),
      spanId: Q.encodeSpanContext(B.spanId),
      parentSpanId: Z,
      traceState: B.traceState?.serialize(),
      name: A.name,
      kind: A.kind == null ? 0 : A.kind + 1,
      startTimeUnixNano: Q.encodeHrTime(A.startTime),
      endTimeUnixNano: Q.encodeHrTime(A.endTime),
      attributes: (0, YvA.toAttributes)(A.attributes),
      droppedAttributesCount: A.droppedAttributesCount,
      events: A.events.map((Y) => UW2(Y, Q)),
      droppedEventsCount: A.droppedEventsCount,
      status: {
        code: G.code,
        message: G.message
      },
      links: A.links.map((Y) => CW2(Y, Q)),
      droppedLinksCount: A.droppedLinksCount,
      flags: zW2(B.traceFlags, A.parentSpanContext?.isRemote)
    }
  }
  qW2.sdkSpanToOtlpSpan = $W2;

  function CW2(A, Q) {
    return {
      attributes: A.attributes ? (0, YvA.toAttributes)(A.attributes) : [],
      spanId: Q.encodeSpanContext(A.context.spanId),
      traceId: Q.encodeSpanContext(A.context.traceId),
      traceState: A.context.traceState?.serialize(),
      droppedAttributesCount: A.droppedAttributesCount || 0,
      flags: zW2(A.context.traceFlags, A.context.isRemote)
    }
  }
  qW2.toOtlpLink = CW2;

  function UW2(A, Q) {
    return {
      attributes: A.attributes ? (0, YvA.toAttributes)(A.attributes) : [],
      name: A.name,
      timeUnixNano: Q.encodeHrTime(A.time),
      droppedAttributesCount: A.droppedAttributesCount || 0
    }
  }
  qW2.toOtlpSpanEvent = UW2;

  function YE5(A, Q) {
    let B = (0, BE5.getOtlpEncoder)(Q);
    return {
      resourceSpans: XE5(A, B)
    }
  }
  qW2.createExportTraceServiceRequest = YE5;

  function JE5(A) {
    let Q = new Map;
    for (let B of A) {
      let G = Q.get(B.resource);
      if (!G) G = new Map, Q.set(B.resource, G);
      let Z = `${B.instrumentationScope.name}@${B.instrumentationScope.version||""}:${B.instrumentationScope.schemaUrl||""}`,
        Y = G.get(Z);
      if (!Y) Y = [], G.set(Z, Y);
      Y.push(B)
    }
    return Q
  }

  function XE5(A, Q) {
    let B = JE5(A),
      G = [],
      Z = B.entries(),
      Y = Z.next();
    while (!Y.done) {
      let [J, X] = Y.value, I = [], D = X.values(), W = D.next();
      while (!W.done) {
        let F = W.value;
        if (F.length > 0) {
          let H = F.map((E) => $W2(E, Q));
          I.push({
            scope: (0, YvA.createInstrumentationScope)(F[0].instrumentationScope),
            spans: H,
            schemaUrl: F[0].instrumentationScope.schemaUrl
          })
        }
        W = D.next()
      }
      let K = (0, YvA.createResource)(J),
        V = {
          resource: K,
          scopeSpans: I,
          schemaUrl: K.schemaUrl
        };
      G.push(V), Y = Z.next()
    }
    return G
  }
})
// @from(Ln 289050, Col 4)
MW2 = U((LW2) => {
  Object.defineProperty(LW2, "__esModule", {
    value: !0
  });
  LW2.ProtobufTraceSerializer = void 0;
  var wW2 = MJ1(),
    KE5 = IK0(),
    VE5 = wW2.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse,
    FE5 = wW2.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
  LW2.ProtobufTraceSerializer = {
    serializeRequest: (A) => {
      let Q = (0, KE5.createExportTraceServiceRequest)(A);
      return FE5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return VE5.decode(A)
    }
  }
})
// @from(Ln 289069, Col 4)
RW2 = U((DK0) => {
  Object.defineProperty(DK0, "__esModule", {
    value: !0
  });
  DK0.ProtobufTraceSerializer = void 0;
  var HE5 = MW2();
  Object.defineProperty(DK0, "ProtobufTraceSerializer", {
    enumerable: !0,
    get: function () {
      return HE5.ProtobufTraceSerializer
    }
  })
})
// @from(Ln 289082, Col 4)
TW2 = U((_W2) => {
  Object.defineProperty(_W2, "__esModule", {
    value: !0
  });
  _W2.JsonLogsSerializer = void 0;
  var zE5 = GK0();
  _W2.JsonLogsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, zE5.createExportLogsServiceRequest)(A, {
        useHex: !0,
        useLongBits: !1
      });
      return new TextEncoder().encode(JSON.stringify(Q))
    },
    deserializeResponse: (A) => {
      if (A.length === 0) return {};
      return JSON.parse(new TextDecoder().decode(A))
    }
  }
})
// @from(Ln 289102, Col 4)
PW2 = U((WK0) => {
  Object.defineProperty(WK0, "__esModule", {
    value: !0
  });
  WK0.JsonLogsSerializer = void 0;
  var $E5 = TW2();
  Object.defineProperty(WK0, "JsonLogsSerializer", {
    enumerable: !0,
    get: function () {
      return $E5.JsonLogsSerializer
    }
  })
})
// @from(Ln 289115, Col 4)
yW2 = U((SW2) => {
  Object.defineProperty(SW2, "__esModule", {
    value: !0
  });
  SW2.JsonMetricsSerializer = void 0;
  var UE5 = JK0();
  SW2.JsonMetricsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, UE5.createExportMetricsServiceRequest)([A], {
        useLongBits: !1
      });
      return new TextEncoder().encode(JSON.stringify(Q))
    },
    deserializeResponse: (A) => {
      if (A.length === 0) return {};
      return JSON.parse(new TextDecoder().decode(A))
    }
  }
})
// @from(Ln 289134, Col 4)
vW2 = U((KK0) => {
  Object.defineProperty(KK0, "__esModule", {
    value: !0
  });
  KK0.JsonMetricsSerializer = void 0;
  var qE5 = yW2();
  Object.defineProperty(KK0, "JsonMetricsSerializer", {
    enumerable: !0,
    get: function () {
      return qE5.JsonMetricsSerializer
    }
  })
})
// @from(Ln 289147, Col 4)
fW2 = U((kW2) => {
  Object.defineProperty(kW2, "__esModule", {
    value: !0
  });
  kW2.JsonTraceSerializer = void 0;
  var wE5 = IK0();
  kW2.JsonTraceSerializer = {
    serializeRequest: (A) => {
      let Q = (0, wE5.createExportTraceServiceRequest)(A, {
        useHex: !0,
        useLongBits: !1
      });
      return new TextEncoder().encode(JSON.stringify(Q))
    },
    deserializeResponse: (A) => {
      if (A.length === 0) return {};
      return JSON.parse(new TextDecoder().decode(A))
    }
  }
})
// @from(Ln 289167, Col 4)
hW2 = U((VK0) => {
  Object.defineProperty(VK0, "__esModule", {
    value: !0
  });
  VK0.JsonTraceSerializer = void 0;
  var LE5 = fW2();
  Object.defineProperty(VK0, "JsonTraceSerializer", {
    enumerable: !0,
    get: function () {
      return LE5.JsonTraceSerializer
    }
  })
})
// @from(Ln 289180, Col 4)
ob = U((Qs) => {
  Object.defineProperty(Qs, "__esModule", {
    value: !0
  });
  Qs.JsonTraceSerializer = Qs.JsonMetricsSerializer = Qs.JsonLogsSerializer = Qs.ProtobufTraceSerializer = Qs.ProtobufMetricsSerializer = Qs.ProtobufLogsSerializer = void 0;
  var ME5 = AW2();
  Object.defineProperty(Qs, "ProtobufLogsSerializer", {
    enumerable: !0,
    get: function () {
      return ME5.ProtobufLogsSerializer
    }
  });
  var RE5 = EW2();
  Object.defineProperty(Qs, "ProtobufMetricsSerializer", {
    enumerable: !0,
    get: function () {
      return RE5.ProtobufMetricsSerializer
    }
  });
  var _E5 = RW2();
  Object.defineProperty(Qs, "ProtobufTraceSerializer", {
    enumerable: !0,
    get: function () {
      return _E5.ProtobufTraceSerializer
    }
  });
  var jE5 = PW2();
  Object.defineProperty(Qs, "JsonLogsSerializer", {
    enumerable: !0,
    get: function () {
      return jE5.JsonLogsSerializer
    }
  });
  var TE5 = vW2();
  Object.defineProperty(Qs, "JsonMetricsSerializer", {
    enumerable: !0,
    get: function () {
      return TE5.JsonMetricsSerializer
    }
  });
  var PE5 = hW2();
  Object.defineProperty(Qs, "JsonTraceSerializer", {
    enumerable: !0,
    get: function () {
      return PE5.JsonTraceSerializer
    }
  })
})
// @from(Ln 289228, Col 4)
mW2 = U((gW2) => {
  Object.defineProperty(gW2, "__esModule", {
    value: !0
  });
  gW2.validateAndNormalizeHeaders = void 0;
  var xE5 = p9();

  function yE5(A) {
    let Q = {};
    return Object.entries(A ?? {}).forEach(([B, G]) => {
      if (typeof G < "u") Q[B] = String(G);
      else xE5.diag.warn(`Header "${B}" has invalid value (${G}) and will be ignored`)
    }), Q
  }
  gW2.validateAndNormalizeHeaders = yE5
})
// @from(Ln 289244, Col 4)
lW2 = U((cW2) => {
  Object.defineProperty(cW2, "__esModule", {
    value: !0
  });
  cW2.getHttpConfigurationDefaults = cW2.mergeOtlpHttpConfigurationWithDefaults = void 0;
  var dW2 = eyA(),
    vE5 = mW2();

  function kE5(A, Q, B) {
    return async () => {
      let G = {
          ...await B()
        },
        Z = {};
      if (Q != null) Object.assign(Z, await Q());
      if (A != null) Object.assign(Z, (0, vE5.validateAndNormalizeHeaders)(await A()));
      return Object.assign(Z, G)
    }
  }

  function bE5(A) {
    if (A == null) return;
    try {
      let Q = globalThis.location?.href;
      return new URL(A, Q).href
    } catch {
      throw Error(`Configuration: Could not parse user-provided export URL: '${A}'`)
    }
  }

  function fE5(A, Q, B) {
    return {
      ...(0, dW2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      headers: kE5(A.headers, Q.headers, B.headers),
      url: bE5(A.url) ?? Q.url ?? B.url
    }
  }
  cW2.mergeOtlpHttpConfigurationWithDefaults = fE5;

  function hE5(A, Q) {
    return {
      ...(0, dW2.getSharedConfigurationDefaults)(),
      headers: async () => A,
      url: "http://localhost:4318/" + Q
    }
  }
  cW2.getHttpConfigurationDefaults = hE5
})
// @from(Ln 289292, Col 4)
TJ1 = U((aW2) => {
  Object.defineProperty(aW2, "__esModule", {
    value: !0
  });
  aW2.getNodeHttpConfigurationDefaults = aW2.mergeOtlpNodeHttpConfigurationWithDefaults = aW2.httpAgentFactoryFromOptions = void 0;
  var iW2 = lW2();

  function nW2(A) {
    return async (Q) => {
      let B = Q === "http:",
        G = B ? import("http") : import("https"),
        {
          Agent: Z
        } = await G;
      if (B) {
        let {
          ca: Y,
          cert: J,
          key: X,
          ...I
        } = A;
        return new Z(I)
      }
      return new Z(A)
    }
  }
  aW2.httpAgentFactoryFromOptions = nW2;

  function uE5(A, Q, B) {
    return {
      ...(0, iW2.mergeOtlpHttpConfigurationWithDefaults)(A, Q, B),
      agentFactory: A.agentFactory ?? Q.agentFactory ?? B.agentFactory,
      userAgent: A.userAgent
    }
  }
  aW2.mergeOtlpNodeHttpConfigurationWithDefaults = uE5;

  function mE5(A, Q) {
    return {
      ...(0, iW2.getHttpConfigurationDefaults)(A, Q),
      agentFactory: nW2({
        keepAlive: !0
      })
    }
  }
  aW2.getNodeHttpConfigurationDefaults = mE5
})
// @from(Ln 289339, Col 4)
tW2 = U((rW2) => {
  Object.defineProperty(rW2, "__esModule", {
    value: !0
  });
  rW2.parseRetryAfterToMills = rW2.isExportRetryable = void 0;

  function pE5(A) {
    return [429, 502, 503, 504].includes(A)
  }
  rW2.isExportRetryable = pE5;

  function lE5(A) {
    if (A == null) return;
    let Q = Number.parseInt(A, 10);
    if (Number.isInteger(Q)) return Q > 0 ? Q * 1000 : -1;
    let B = new Date(A).getTime() - Date.now();
    if (B >= 0) return B;
    return 0
  }
  rW2.parseRetryAfterToMills = lE5
})
// @from(Ln 289360, Col 4)
QK2 = U((eW2) => {
  Object.defineProperty(eW2, "__esModule", {
    value: !0
  });
  eW2.VERSION = void 0;
  eW2.VERSION = "0.208.0"
})
// @from(Ln 289367, Col 4)
XK2 = U((YK2) => {
  Object.defineProperty(YK2, "__esModule", {
    value: !0
  });
  YK2.compressAndSend = YK2.sendWithHttp = void 0;
  var nE5 = NA("zlib"),
    aE5 = NA("stream"),
    BK2 = tW2(),
    oE5 = $J1(),
    rE5 = QK2(),
    GK2 = `OTel-OTLP-Exporter-JavaScript/${rE5.VERSION}`;

  function sE5(A, Q, B, G, Z, Y, J, X, I) {
    let D = new URL(Q);
    if (Z) B["User-Agent"] = `${Z} ${GK2}`;
    else B["User-Agent"] = GK2;
    let W = {
        hostname: D.hostname,
        port: D.port,
        path: D.pathname,
        method: "POST",
        headers: B,
        agent: Y
      },
      K = A(W, (V) => {
        let F = [];
        V.on("data", (H) => F.push(H)), V.on("end", () => {
          if (V.statusCode && V.statusCode < 299) X({
            status: "success",
            data: Buffer.concat(F)
          });
          else if (V.statusCode && (0, BK2.isExportRetryable)(V.statusCode)) X({
            status: "retryable",
            retryInMillis: (0, BK2.parseRetryAfterToMills)(V.headers["retry-after"])
          });
          else {
            let H = new oE5.OTLPExporterError(V.statusMessage, V.statusCode, Buffer.concat(F).toString());
            X({
              status: "failure",
              error: H
            })
          }
        })
      });
    K.setTimeout(I, () => {
      K.destroy(), X({
        status: "failure",
        error: Error("Request Timeout")
      })
    }), K.on("error", (V) => {
      X({
        status: "failure",
        error: V
      })
    }), ZK2(K, G, J, (V) => {
      X({
        status: "failure",
        error: V
      })
    })
  }
  YK2.sendWithHttp = sE5;

  function ZK2(A, Q, B, G) {
    let Z = tE5(B);
    if (Q === "gzip") A.setHeader("Content-Encoding", "gzip"), Z = Z.on("error", G).pipe(nE5.createGzip()).on("error", G);
    Z.pipe(A).on("error", G)
  }
  YK2.compressAndSend = ZK2;

  function tE5(A) {
    let Q = new aE5.Readable;
    return Q.push(A), Q.push(null), Q
  }
})
// @from(Ln 289442, Col 4)
KK2 = U((DK2) => {
  Object.defineProperty(DK2, "__esModule", {
    value: !0
  });
  DK2.createHttpExporterTransport = void 0;
  var Az5 = XK2();
  class IK2 {
    _parameters;
    _utils = null;
    constructor(A) {
      this._parameters = A
    }
    async send(A, Q) {
      let {
        agent: B,
        request: G
      } = await this._loadUtils(), Z = await this._parameters.headers();
      return new Promise((Y) => {
        (0, Az5.sendWithHttp)(G, this._parameters.url, Z, this._parameters.compression, this._parameters.userAgent, B, A, (J) => {
          Y(J)
        }, Q)
      })
    }
    shutdown() {}
    async _loadUtils() {
      let A = this._utils;
      if (A === null) {
        let Q = new URL(this._parameters.url).protocol,
          [B, G] = await Promise.all([this._parameters.agentFactory(Q), Qz5(Q)]);
        A = this._utils = {
          agent: B,
          request: G
        }
      }
      return A
    }
  }
  async function Qz5(A) {
    let Q = A === "http:" ? import("http") : import("https"),
      {
        request: B
      } = await Q;
    return B
  }

  function Bz5(A) {
    return new IK2(A)
  }
  DK2.createHttpExporterTransport = Bz5
})
// @from(Ln 289492, Col 4)
zK2 = U((HK2) => {
  Object.defineProperty(HK2, "__esModule", {
    value: !0
  });
  HK2.createRetryingTransport = void 0;
  var Gz5 = 5,
    Zz5 = 1000,
    Yz5 = 5000,
    Jz5 = 1.5,
    VK2 = 0.2;

  function Xz5() {
    return Math.random() * (2 * VK2) - VK2
  }
  class FK2 {
    _transport;
    constructor(A) {
      this._transport = A
    }
    retry(A, Q, B) {
      return new Promise((G, Z) => {
        setTimeout(() => {
          this._transport.send(A, Q).then(G, Z)
        }, B)
      })
    }
    async send(A, Q) {
      let B = Date.now() + Q,
        G = await this._transport.send(A, Q),
        Z = Gz5,
        Y = Zz5;
      while (G.status === "retryable" && Z > 0) {
        Z--;
        let J = Math.max(Math.min(Y, Yz5) + Xz5(), 0);
        Y = Y * Jz5;
        let X = G.retryInMillis ?? J,
          I = B - Date.now();
        if (X > I) return G;
        G = await this.retry(A, I, X)
      }
      return G
    }
    shutdown() {
      return this._transport.shutdown()
    }
  }

  function Iz5(A) {
    return new FK2(A.transport)
  }
  HK2.createRetryingTransport = Iz5
})
// @from(Ln 289544, Col 4)
UK2 = U(($K2) => {
  Object.defineProperty($K2, "__esModule", {
    value: !0
  });
  $K2.createOtlpHttpExportDelegate = void 0;
  var Dz5 = PW0(),
    Wz5 = KK2(),
    Kz5 = TW0(),
    Vz5 = zK2();

  function Fz5(A, Q) {
    return (0, Dz5.createOtlpExportDelegate)({
      transport: (0, Vz5.createRetryingTransport)({
        transport: (0, Wz5.createHttpExporterTransport)(A)
      }),
      serializer: Q,
      promiseHandler: (0, Kz5.createBoundedQueueExportPromiseHandler)(A)
    }, {
      timeout: A.timeoutMillis
    })
  }
  $K2.createOtlpHttpExportDelegate = Fz5
})
// @from(Ln 289567, Col 4)
FK0 = U((OK2) => {
  Object.defineProperty(OK2, "__esModule", {
    value: !0
  });
  OK2.getSharedConfigurationFromEnvironment = void 0;
  var wK2 = h8(),
    LK2 = p9();

  function qK2(A) {
    let Q = (0, wK2.getNumberFromEnv)(A);
    if (Q != null) {
      if (Number.isFinite(Q) && Q > 0) return Q;
      LK2.diag.warn(`Configuration: ${A} is invalid, expected number greater than 0 (actual: ${Q})`)
    }
    return
  }

  function Hz5(A) {
    let Q = qK2(`OTEL_EXPORTER_OTLP_${A}_TIMEOUT`),
      B = qK2("OTEL_EXPORTER_OTLP_TIMEOUT");
    return Q ?? B
  }

  function NK2(A) {
    let Q = (0, wK2.getStringFromEnv)(A)?.trim();
    if (Q == null || Q === "none" || Q === "gzip") return Q;
    LK2.diag.warn(`Configuration: ${A} is invalid, expected 'none' or 'gzip' (actual: '${Q}')`);
    return
  }

  function Ez5(A) {
    let Q = NK2(`OTEL_EXPORTER_OTLP_${A}_COMPRESSION`),
      B = NK2("OTEL_EXPORTER_OTLP_COMPRESSION");
    return Q ?? B
  }

  function zz5(A) {
    return {
      timeoutMillis: Hz5(A),
      compression: Ez5(A)
    }
  }
  OK2.getSharedConfigurationFromEnvironment = zz5
})
// @from(Ln 289611, Col 4)
jK2 = U((RK2) => {
  Object.defineProperty(RK2, "__esModule", {
    value: !0
  });
  RK2.getNodeHttpConfigurationFromEnvironment = void 0;
  var $z5 = NA("fs"),
    Cz5 = NA("path"),
    rb = h8(),
    PJ1 = p9(),
    Uz5 = FK0(),
    qz5 = eyA(),
    Nz5 = TJ1();

  function wz5(A) {
    let Q = (0, rb.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_HEADERS`),
      B = (0, rb.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"),
      G = (0, rb.parseKeyPairsIntoRecord)(Q),
      Z = (0, rb.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    return Object.assign({}, (0, rb.parseKeyPairsIntoRecord)(B), (0, rb.parseKeyPairsIntoRecord)(Q))
  }

  function Lz5(A) {
    try {
      return new URL(A).toString()
    } catch {
      PJ1.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
      return
    }
  }

  function Oz5(A, Q) {
    try {
      new URL(A)
    } catch {
      PJ1.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
      return
    }
    if (!A.endsWith("/")) A = A + "/";
    A += Q;
    try {
      new URL(A)
    } catch {
      PJ1.diag.warn(`Configuration: Provided URL appended with '${Q}' is not a valid URL, using 'undefined' instead of '${A}'`);
      return
    }
    return A
  }

  function Mz5(A) {
    let Q = (0, rb.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
    if (Q === void 0) return;
    return Oz5(Q, A)
  }

  function Rz5(A) {
    let Q = (0, rb.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`);
    if (Q === void 0) return;
    return Lz5(Q)
  }

  function HK0(A, Q, B) {
    let G = (0, rb.getStringFromEnv)(A),
      Z = (0, rb.getStringFromEnv)(Q),
      Y = G ?? Z;
    if (Y != null) try {
      return $z5.readFileSync(Cz5.resolve(process.cwd(), Y))
    } catch {
      PJ1.diag.warn(B);
      return
    } else return
  }

  function _z5(A) {
    return HK0(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
  }

  function jz5(A) {
    return HK0(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
  }

  function Tz5(A) {
    return HK0(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
  }

  function Pz5(A, Q) {
    return {
      ...(0, Uz5.getSharedConfigurationFromEnvironment)(A),
      url: Rz5(A) ?? Mz5(Q),
      headers: (0, qz5.wrapStaticHeadersInFunction)(wz5(A)),
      agentFactory: (0, Nz5.httpAgentFactoryFromOptions)({
        keepAlive: !0,
        ca: Tz5(A),
        cert: _z5(A),
        key: jz5(A)
      })
    }
  }
  RK2.getNodeHttpConfigurationFromEnvironment = Pz5
})
// @from(Ln 289711, Col 4)
SK2 = U((TK2) => {
  Object.defineProperty(TK2, "__esModule", {
    value: !0
  });
  TK2.convertLegacyHeaders = void 0;
  var Sz5 = eyA();

  function xz5(A) {
    if (typeof A.headers === "function") return A.headers;
    return (0, Sz5.wrapStaticHeadersInFunction)(A.headers)
  }
  TK2.convertLegacyHeaders = xz5
})
// @from(Ln 289724, Col 4)
kK2 = U((yK2) => {
  Object.defineProperty(yK2, "__esModule", {
    value: !0
  });
  yK2.convertLegacyHttpOptions = void 0;
  var yz5 = p9(),
    xK2 = TJ1(),
    vz5 = md(),
    kz5 = jK2(),
    bz5 = SK2();

  function fz5(A) {
    if (typeof A.httpAgentOptions === "function") return A.httpAgentOptions;
    let Q = A.httpAgentOptions;
    if (A.keepAlive != null) Q = {
      keepAlive: A.keepAlive,
      ...Q
    };
    if (Q != null) return (0, vz5.httpAgentFactoryFromOptions)(Q);
    else return
  }

  function hz5(A, Q, B, G) {
    if (A.metadata) yz5.diag.warn("Metadata cannot be set when using http");
    return (0, xK2.mergeOtlpNodeHttpConfigurationWithDefaults)({
      url: A.url,
      headers: (0, bz5.convertLegacyHeaders)(A),
      concurrencyLimit: A.concurrencyLimit,
      timeoutMillis: A.timeoutMillis,
      compression: A.compression,
      agentFactory: fz5(A),
      userAgent: A.userAgent
    }, (0, kz5.getNodeHttpConfigurationFromEnvironment)(Q, B), (0, xK2.getNodeHttpConfigurationDefaults)(G, B))
  }
  yK2.convertLegacyHttpOptions = hz5
})
// @from(Ln 289760, Col 4)
md = U((IFA) => {
  Object.defineProperty(IFA, "__esModule", {
    value: !0
  });
  IFA.convertLegacyHttpOptions = IFA.getSharedConfigurationFromEnvironment = IFA.createOtlpHttpExportDelegate = IFA.httpAgentFactoryFromOptions = void 0;
  var gz5 = TJ1();
  Object.defineProperty(IFA, "httpAgentFactoryFromOptions", {
    enumerable: !0,
    get: function () {
      return gz5.httpAgentFactoryFromOptions
    }
  });
  var uz5 = UK2();
  Object.defineProperty(IFA, "createOtlpHttpExportDelegate", {
    enumerable: !0,
    get: function () {
      return uz5.createOtlpHttpExportDelegate
    }
  });
  var mz5 = FK0();
  Object.defineProperty(IFA, "getSharedConfigurationFromEnvironment", {
    enumerable: !0,
    get: function () {
      return mz5.getSharedConfigurationFromEnvironment
    }
  });
  var dz5 = kK2();
  Object.defineProperty(IFA, "convertLegacyHttpOptions", {
    enumerable: !0,
    get: function () {
      return dz5.convertLegacyHttpOptions
    }
  })
})
// @from(Ln 289794, Col 4)
uK2 = U((hK2) => {
  Object.defineProperty(hK2, "__esModule", {
    value: !0
  });
  hK2.OTLPMetricExporter = void 0;
  var pz5 = yW0(),
    lz5 = ob(),
    bK2 = md();
  class fK2 extends pz5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, bK2.createOtlpHttpExportDelegate)((0, bK2.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
        "Content-Type": "application/json"
      }), lz5.JsonMetricsSerializer), A)
    }
  }
  hK2.OTLPMetricExporter = fK2
})
// @from(Ln 289811, Col 4)
mK2 = U((EK0) => {
  Object.defineProperty(EK0, "__esModule", {
    value: !0
  });
  EK0.OTLPMetricExporter = void 0;
  var iz5 = uK2();
  Object.defineProperty(EK0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return iz5.OTLPMetricExporter
    }
  })
})
// @from(Ln 289824, Col 4)
dK2 = U((zK0) => {
  Object.defineProperty(zK0, "__esModule", {
    value: !0
  });
  zK0.OTLPMetricExporter = void 0;
  var az5 = mK2();
  Object.defineProperty(zK0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return az5.OTLPMetricExporter
    }
  })
})
// @from(Ln 289837, Col 4)
xJ1 = U((Bs) => {
  Object.defineProperty(Bs, "__esModule", {
    value: !0
  });
  Bs.OTLPMetricExporterBase = Bs.LowMemoryTemporalitySelector = Bs.DeltaTemporalitySelector = Bs.CumulativeTemporalitySelector = Bs.AggregationTemporalityPreference = Bs.OTLPMetricExporter = void 0;
  var rz5 = dK2();
  Object.defineProperty(Bs, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return rz5.OTLPMetricExporter
    }
  });
  var sz5 = _W0();
  Object.defineProperty(Bs, "AggregationTemporalityPreference", {
    enumerable: !0,
    get: function () {
      return sz5.AggregationTemporalityPreference
    }
  });
  var SJ1 = yW0();
  Object.defineProperty(Bs, "CumulativeTemporalitySelector", {
    enumerable: !0,
    get: function () {
      return SJ1.CumulativeTemporalitySelector
    }
  });
  Object.defineProperty(Bs, "DeltaTemporalitySelector", {
    enumerable: !0,
    get: function () {
      return SJ1.DeltaTemporalitySelector
    }
  });
  Object.defineProperty(Bs, "LowMemoryTemporalitySelector", {
    enumerable: !0,
    get: function () {
      return SJ1.LowMemoryTemporalitySelector
    }
  });
  Object.defineProperty(Bs, "OTLPMetricExporterBase", {
    enumerable: !0,
    get: function () {
      return SJ1.OTLPMetricExporterBase
    }
  })
})
// @from(Ln 289882, Col 4)
nK2 = U((lK2) => {
  Object.defineProperty(lK2, "__esModule", {
    value: !0
  });
  lK2.OTLPMetricExporter = void 0;
  var ez5 = xJ1(),
    A$5 = ob(),
    cK2 = md();
  class pK2 extends ez5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, cK2.createOtlpHttpExportDelegate)((0, cK2.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
        "Content-Type": "application/x-protobuf"
      }), A$5.ProtobufMetricsSerializer), A)
    }
  }
  lK2.OTLPMetricExporter = pK2
})
// @from(Ln 289899, Col 4)
aK2 = U(($K0) => {
  Object.defineProperty($K0, "__esModule", {
    value: !0
  });
  $K0.OTLPMetricExporter = void 0;
  var Q$5 = nK2();
  Object.defineProperty($K0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return Q$5.OTLPMetricExporter
    }
  })
})
// @from(Ln 289912, Col 4)
oK2 = U((CK0) => {
  Object.defineProperty(CK0, "__esModule", {
    value: !0
  });
  CK0.OTLPMetricExporter = void 0;
  var G$5 = aK2();
  Object.defineProperty(CK0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return G$5.OTLPMetricExporter
    }
  })
})
// @from(Ln 289925, Col 4)
rK2 = U((UK0) => {
  Object.defineProperty(UK0, "__esModule", {
    value: !0
  });
  UK0.OTLPMetricExporter = void 0;
  var Y$5 = oK2();
  Object.defineProperty(UK0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function () {
      return Y$5.OTLPMetricExporter
    }
  })
})
// @from(Ln 289938, Col 4)
eK2 = U((sK2) => {
  Object.defineProperty(sK2, "__esModule", {
    value: !0
  });
  sK2.VERSION = void 0;
  sK2.VERSION = "0.208.0"
})
// @from(Ln 289945, Col 4)
j8 = U((GV2) => {
  Object.defineProperty(GV2, "__esModule", {
    value: !0
  });
  GV2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = GV2.DEFAULT_MAX_SEND_MESSAGE_LENGTH = GV2.Propagate = GV2.LogVerbosity = GV2.Status = void 0;
  var AV2;
  (function (A) {
    A[A.OK = 0] = "OK", A[A.CANCELLED = 1] = "CANCELLED", A[A.UNKNOWN = 2] = "UNKNOWN", A[A.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", A[A.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", A[A.NOT_FOUND = 5] = "NOT_FOUND", A[A.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", A[A.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", A[A.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", A[A.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", A[A.ABORTED = 10] = "ABORTED", A[A.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", A[A.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", A[A.INTERNAL = 13] = "INTERNAL", A[A.UNAVAILABLE = 14] = "UNAVAILABLE", A[A.DATA_LOSS = 15] = "DATA_LOSS", A[A.UNAUTHENTICATED = 16] = "UNAUTHENTICATED"
  })(AV2 || (GV2.Status = AV2 = {}));
  var QV2;
  (function (A) {
    A[A.DEBUG = 0] = "DEBUG", A[A.INFO = 1] = "INFO", A[A.ERROR = 2] = "ERROR", A[A.NONE = 3] = "NONE"
  })(QV2 || (GV2.LogVerbosity = QV2 = {}));
  var BV2;
  (function (A) {
    A[A.DEADLINE = 1] = "DEADLINE", A[A.CENSUS_STATS_CONTEXT = 2] = "CENSUS_STATS_CONTEXT", A[A.CENSUS_TRACING_CONTEXT = 4] = "CENSUS_TRACING_CONTEXT", A[A.CANCELLATION = 8] = "CANCELLATION", A[A.DEFAULTS = 65535] = "DEFAULTS"
  })(BV2 || (GV2.Propagate = BV2 = {}));
  GV2.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
  GV2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4194304
})
// @from(Ln 289965, Col 4)
qK0 = U((lPZ, K$5) => {
  K$5.exports = {
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
// @from(Ln 290040, Col 4)
WY = U((XV2) => {
  var NK0, wK0, LK0, OK0;
  Object.defineProperty(XV2, "__esModule", {
    value: !0
  });
  XV2.log = XV2.setLoggerVerbosity = XV2.setLogger = XV2.getLogger = void 0;
  XV2.trace = w$5;
  XV2.isTracerEnabled = JV2;
  var Gs = j8(),
    V$5 = NA("process"),
    F$5 = qK0().version,
    H$5 = {
      error: (A, ...Q) => {
        console.error("E " + A, ...Q)
      },
      info: (A, ...Q) => {
        console.error("I " + A, ...Q)
      },
      debug: (A, ...Q) => {
        console.error("D " + A, ...Q)
      }
    },
    a4A = H$5,
    DFA = Gs.LogVerbosity.ERROR,
    E$5 = (wK0 = (NK0 = process.env.GRPC_NODE_VERBOSITY) !== null && NK0 !== void 0 ? NK0 : process.env.GRPC_VERBOSITY) !== null && wK0 !== void 0 ? wK0 : "";
  switch (E$5.toUpperCase()) {
    case "DEBUG":
      DFA = Gs.LogVerbosity.DEBUG;
      break;
    case "INFO":
      DFA = Gs.LogVerbosity.INFO;
      break;
    case "ERROR":
      DFA = Gs.LogVerbosity.ERROR;
      break;
    case "NONE":
      DFA = Gs.LogVerbosity.NONE;
      break;
    default:
  }
  var z$5 = () => {
    return a4A
  };
  XV2.getLogger = z$5;
  var $$5 = (A) => {
    a4A = A
  };
  XV2.setLogger = $$5;
  var C$5 = (A) => {
    DFA = A
  };
  XV2.setLoggerVerbosity = C$5;
  var U$5 = (A, ...Q) => {
    let B;
    if (A >= DFA) {
      switch (A) {
        case Gs.LogVerbosity.DEBUG:
          B = a4A.debug;
          break;
        case Gs.LogVerbosity.INFO:
          B = a4A.info;
          break;
        case Gs.LogVerbosity.ERROR:
          B = a4A.error;
          break
      }
      if (!B) B = a4A.error;
      if (B) B.bind(a4A)(...Q)
    }
  };
  XV2.log = U$5;
  var q$5 = (OK0 = (LK0 = process.env.GRPC_NODE_TRACE) !== null && LK0 !== void 0 ? LK0 : process.env.GRPC_TRACE) !== null && OK0 !== void 0 ? OK0 : "",
    MK0 = new Set,
    YV2 = new Set;
  for (let A of q$5.split(","))
    if (A.startsWith("-")) YV2.add(A.substring(1));
    else MK0.add(A);
  var N$5 = MK0.has("all");

  function w$5(A, Q, B) {
    if (JV2(Q)) XV2.log(A, new Date().toISOString() + " | v" + F$5 + " " + V$5.pid + " | " + Q + " | " + B)
  }

  function JV2(A) {
    return !YV2.has(A) && (N$5 || MK0.has(A))
  }
})
// @from(Ln 290127, Col 4)
yJ1 = U((IV2) => {
  Object.defineProperty(IV2, "__esModule", {
    value: !0
  });
  IV2.getErrorMessage = j$5;
  IV2.getErrorCode = T$5;

  function j$5(A) {
    if (A instanceof Error) return A.message;
    else return String(A)
  }

  function T$5(A) {
    if (typeof A === "object" && A !== null && "code" in A && typeof A.code === "number") return A.code;
    else return null
  }
})
// @from(Ln 290144, Col 4)
jF = U((KV2) => {
  Object.defineProperty(KV2, "__esModule", {
    value: !0
  });
  KV2.Metadata = void 0;
  var x$5 = WY(),
    y$5 = j8(),
    v$5 = yJ1(),
    k$5 = /^[:0-9a-z_.-]+$/,
    b$5 = /^[ -~]*$/;

  function f$5(A) {
    return k$5.test(A)
  }

  function h$5(A) {
    return b$5.test(A)
  }

  function WV2(A) {
    return A.endsWith("-bin")
  }

  function g$5(A) {
    return !A.startsWith("grpc-")
  }

  function vJ1(A) {
    return A.toLowerCase()
  }

  function DV2(A, Q) {
    if (!f$5(A)) throw Error('Metadata key "' + A + '" contains illegal characters');
    if (Q !== null && Q !== void 0)
      if (WV2(A)) {
        if (!Buffer.isBuffer(Q)) throw Error("keys that end with '-bin' must have Buffer values")
      } else {
        if (Buffer.isBuffer(Q)) throw Error("keys that don't end with '-bin' must have String values");
        if (!h$5(Q)) throw Error('Metadata string value "' + Q + '" contains illegal characters')
      }
  }
  class kJ1 {
    constructor(A = {}) {
      this.internalRepr = new Map, this.opaqueData = new Map, this.options = A
    }
    set(A, Q) {
      A = vJ1(A), DV2(A, Q), this.internalRepr.set(A, [Q])
    }
    add(A, Q) {
      A = vJ1(A), DV2(A, Q);
      let B = this.internalRepr.get(A);
      if (B === void 0) this.internalRepr.set(A, [Q]);
      else B.push(Q)
    }
    remove(A) {
      A = vJ1(A), this.internalRepr.delete(A)
    }
    get(A) {
      return A = vJ1(A), this.internalRepr.get(A) || []
    }
    getMap() {
      let A = {};
      for (let [Q, B] of this.internalRepr)
        if (B.length > 0) {
          let G = B[0];
          A[Q] = Buffer.isBuffer(G) ? Buffer.from(G) : G
        } return A
    }
    clone() {
      let A = new kJ1(this.options),
        Q = A.internalRepr;
      for (let [B, G] of this.internalRepr) {
        let Z = G.map((Y) => {
          if (Buffer.isBuffer(Y)) return Buffer.from(Y);
          else return Y
        });
        Q.set(B, Z)
      }
      return A
    }
    merge(A) {
      for (let [Q, B] of A.internalRepr) {
        let G = (this.internalRepr.get(Q) || []).concat(B);
        this.internalRepr.set(Q, G)
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
      for (let [Q, B] of this.internalRepr) {
        if (Q.startsWith(":")) continue;
        A[Q] = B.map(u$5)
      }
      return A
    }
    toJSON() {
      let A = {};
      for (let [Q, B] of this.internalRepr) A[Q] = B;
      return A
    }
    setOpaque(A, Q) {
      this.opaqueData.set(A, Q)
    }
    getOpaque(A) {
      return this.opaqueData.get(A)
    }
    static fromHttp2Headers(A) {
      let Q = new kJ1;
      for (let B of Object.keys(A)) {
        if (B.charAt(0) === ":") continue;
        let G = A[B];
        try {
          if (WV2(B)) {
            if (Array.isArray(G)) G.forEach((Z) => {
              Q.add(B, Buffer.from(Z, "base64"))
            });
            else if (G !== void 0)
              if (g$5(B)) G.split(",").forEach((Z) => {
                Q.add(B, Buffer.from(Z.trim(), "base64"))
              });
              else Q.add(B, Buffer.from(G, "base64"))
          } else if (Array.isArray(G)) G.forEach((Z) => {
            Q.add(B, Z)
          });
          else if (G !== void 0) Q.add(B, G)
        } catch (Z) {
          let Y = `Failed to add metadata entry ${B}: ${G}. ${(0,v$5.getErrorMessage)(Z)}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
          (0, x$5.log)(y$5.LogVerbosity.ERROR, Y)
        }
      }
      return Q
    }
  }
  KV2.Metadata = kJ1;
  var u$5 = (A) => {
    return Buffer.isBuffer(A) ? A.toString("base64") : A
  }
})
// @from(Ln 290287, Col 4)
fJ1 = U((FV2) => {
  Object.defineProperty(FV2, "__esModule", {
    value: !0
  });
  FV2.CallCredentials = void 0;
  var _K0 = jF();

  function m$5(A) {
    return "getRequestHeaders" in A && typeof A.getRequestHeaders === "function"
  }
  class WFA {
    static createFromMetadataGenerator(A) {
      return new jK0(A)
    }
    static createFromGoogleCredential(A) {
      return WFA.createFromMetadataGenerator((Q, B) => {
        let G;
        if (m$5(A)) G = A.getRequestHeaders(Q.service_url);
        else G = new Promise((Z, Y) => {
          A.getRequestMetadata(Q.service_url, (J, X) => {
            if (J) {
              Y(J);
              return
            }
            if (!X) {
              Y(Error("Headers not set by metadata plugin"));
              return
            }
            Z(X)
          })
        });
        G.then((Z) => {
          let Y = new _K0.Metadata;
          for (let J of Object.keys(Z)) Y.add(J, Z[J]);
          B(null, Y)
        }, (Z) => {
          B(Z)
        })
      })
    }
    static createEmpty() {
      return new TK0
    }
  }
  FV2.CallCredentials = WFA;
  class bJ1 extends WFA {
    constructor(A) {
      super();
      this.creds = A
    }
    async generateMetadata(A) {
      let Q = new _K0.Metadata,
        B = await Promise.all(this.creds.map((G) => G.generateMetadata(A)));
      for (let G of B) Q.merge(G);
      return Q
    }
    compose(A) {
      return new bJ1(this.creds.concat([A]))
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof bJ1) return this.creds.every((Q, B) => Q._equals(A.creds[B]));
      else return !1
    }
  }
  class jK0 extends WFA {
    constructor(A) {
      super();
      this.metadataGenerator = A
    }
    generateMetadata(A) {
      return new Promise((Q, B) => {
        this.metadataGenerator(A, (G, Z) => {
          if (Z !== void 0) Q(Z);
          else B(G)
        })
      })
    }
    compose(A) {
      return new bJ1([this, A])
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof jK0) return this.metadataGenerator === A.metadataGenerator;
      else return !1
    }
  }
  class TK0 extends WFA {
    generateMetadata(A) {
      return Promise.resolve(new _K0.Metadata)
    }
    compose(A) {
      return A
    }
    _equals(A) {
      return A instanceof TK0
    }
  }
})
// @from(Ln 290386, Col 4)
SK0 = U((zV2) => {
  Object.defineProperty(zV2, "__esModule", {
    value: !0
  });
  zV2.CIPHER_SUITES = void 0;
  zV2.getDefaultRootsData = c$5;
  var d$5 = NA("fs");
  zV2.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
  var EV2 = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH,
    PK0 = null;

  function c$5() {
    if (EV2) {
      if (PK0 === null) PK0 = d$5.readFileSync(EV2);
      return PK0
    }
    return null
  }
})
// @from(Ln 290405, Col 4)
JU = U((UV2) => {
  Object.defineProperty(UV2, "__esModule", {
    value: !0
  });
  UV2.parseUri = i$5;
  UV2.splitHostPort = n$5;
  UV2.combineHostPort = a$5;
  UV2.uriToString = o$5;
  var l$5 = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;

  function i$5(A) {
    let Q = l$5.exec(A);
    if (Q === null) return null;
    return {
      scheme: Q[1],
      authority: Q[2],
      path: Q[3]
    }
  }
  var CV2 = /^\d+$/;

  function n$5(A) {
    if (A.startsWith("[")) {
      let Q = A.indexOf("]");
      if (Q === -1) return null;
      let B = A.substring(1, Q);
      if (B.indexOf(":") === -1) return null;
      if (A.length > Q + 1)
        if (A[Q + 1] === ":") {
          let G = A.substring(Q + 2);
          if (CV2.test(G)) return {
            host: B,
            port: +G
          };
          else return null
        } else return null;
      else return {
        host: B
      }
    } else {
      let Q = A.split(":");
      if (Q.length === 2)
        if (CV2.test(Q[1])) return {
          host: Q[0],
          port: +Q[1]
        };
        else return null;
      else return {
        host: A
      }
    }
  }

  function a$5(A) {
    if (A.port === void 0) return A.host;
    else if (A.host.includes(":")) return `[${A.host}]:${A.port}`;
    else return `${A.host}:${A.port}`
  }

  function o$5(A) {
    let Q = "";
    if (A.scheme !== void 0) Q += A.scheme + ":";
    if (A.authority !== void 0) Q += "//" + A.authority + "/";
    return Q += A.path, Q
  }
})
// @from(Ln 290471, Col 4)
gS = U((qV2) => {
  Object.defineProperty(qV2, "__esModule", {
    value: !0
  });
  qV2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = void 0;
  qV2.registerResolver = AC5;
  qV2.registerDefaultScheme = QC5;
  qV2.createResolver = BC5;
  qV2.getDefaultAuthority = GC5;
  qV2.mapUriDefaultScheme = ZC5;
  var yK0 = JU();
  qV2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = "grpc.internal.config_selector";
  var KFA = {},
    xK0 = null;

  function AC5(A, Q) {
    KFA[A] = Q
  }

  function QC5(A) {
    xK0 = A
  }

  function BC5(A, Q, B) {
    if (A.scheme !== void 0 && A.scheme in KFA) return new KFA[A.scheme](A, Q, B);
    else throw Error(`No resolver could be created for target ${(0,yK0.uriToString)(A)}`)
  }

  function GC5(A) {
    if (A.scheme !== void 0 && A.scheme in KFA) return KFA[A.scheme].getDefaultAuthority(A);
    else throw Error(`Invalid target ${(0,yK0.uriToString)(A)}`)
  }

  function ZC5(A) {
    if (A.scheme === void 0 || !(A.scheme in KFA))
      if (xK0 !== null) return {
        scheme: xK0,
        authority: void 0,
        path: (0, yK0.uriToString)(A)
      };
      else return null;
    return A
  }
})
// @from(Ln 290515, Col 4)
FFA = U((MV2) => {
  Object.defineProperty(MV2, "__esModule", {
    value: !0
  });
  MV2.ChannelCredentials = void 0;
  MV2.createCertificateProviderChannelCredentials = FC5;
  var XvA = NA("tls"),
    uJ1 = fJ1(),
    kK0 = SK0(),
    wV2 = JU(),
    WC5 = gS(),
    KC5 = WY(),
    VC5 = j8();

  function vK0(A, Q) {
    if (A && !(A instanceof Buffer)) throw TypeError(`${Q}, if provided, must be a Buffer.`)
  }
  class VFA {
    compose(A) {
      return new gJ1(this, A)
    }
    static createSsl(A, Q, B, G) {
      var Z;
      if (vK0(A, "Root certificate"), vK0(Q, "Private key"), vK0(B, "Certificate chain"), Q && !B) throw Error("Private key must be given with accompanying certificate chain");
      if (!Q && B) throw Error("Certificate chain must be given with accompanying private key");
      let Y = (0, XvA.createSecureContext)({
        ca: (Z = A !== null && A !== void 0 ? A : (0, kK0.getDefaultRootsData)()) !== null && Z !== void 0 ? Z : void 0,
        key: Q !== null && Q !== void 0 ? Q : void 0,
        cert: B !== null && B !== void 0 ? B : void 0,
        ciphers: kK0.CIPHER_SUITES
      });
      return new hJ1(Y, G !== null && G !== void 0 ? G : {})
    }
    static createFromSecureContext(A, Q) {
      return new hJ1(A, Q !== null && Q !== void 0 ? Q : {})
    }
    static createInsecure() {
      return new bK0
    }
  }
  MV2.ChannelCredentials = VFA;
  class bK0 extends VFA {
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
      return A instanceof bK0
    }
    _createSecureConnector(A, Q, B) {
      return {
        connect(G) {
          return Promise.resolve({
            socket: G,
            secure: !1
          })
        },
        waitForReady: () => {
          return Promise.resolve()
        },
        getCallCredentials: () => {
          return B !== null && B !== void 0 ? B : uJ1.CallCredentials.createEmpty()
        },
        destroy() {}
      }
    }
  }

  function LV2(A, Q, B, G) {
    var Z, Y;
    let J = {
        secureContext: A
      },
      X = B;
    if ("grpc.http_connect_target" in G) {
      let K = (0, wV2.parseUri)(G["grpc.http_connect_target"]);
      if (K) X = K
    }
    let I = (0, WC5.getDefaultAuthority)(X),
      D = (0, wV2.splitHostPort)(I),
      W = (Z = D === null || D === void 0 ? void 0 : D.host) !== null && Z !== void 0 ? Z : I;
    if (J.host = W, Q.checkServerIdentity) J.checkServerIdentity = Q.checkServerIdentity;
    if (Q.rejectUnauthorized !== void 0) J.rejectUnauthorized = Q.rejectUnauthorized;
    if (J.ALPNProtocols = ["h2"], G["grpc.ssl_target_name_override"]) {
      let K = G["grpc.ssl_target_name_override"],
        V = (Y = J.checkServerIdentity) !== null && Y !== void 0 ? Y : XvA.checkServerIdentity;
      J.checkServerIdentity = (F, H) => {
        return V(K, H)
      }, J.servername = K
    } else J.servername = W;
    if (G["grpc-node.tls_enable_trace"]) J.enableTrace = !0;
    return J
  }
  class OV2 {
    constructor(A, Q) {
      this.connectionOptions = A, this.callCredentials = Q
    }
    connect(A) {
      let Q = Object.assign({
        socket: A
      }, this.connectionOptions);
      return new Promise((B, G) => {
        let Z = (0, XvA.connect)(Q, () => {
          var Y;
          if (((Y = this.connectionOptions.rejectUnauthorized) !== null && Y !== void 0 ? Y : !0) && !Z.authorized) {
            G(Z.authorizationError);
            return
          }
          B({
            socket: Z,
            secure: !0
          })
        });
        Z.on("error", (Y) => {
          G(Y)
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
  class hJ1 extends VFA {
    constructor(A, Q) {
      super();
      this.secureContext = A, this.verifyOptions = Q
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof hJ1) return this.secureContext === A.secureContext && this.verifyOptions.checkServerIdentity === A.verifyOptions.checkServerIdentity;
      else return !1
    }
    _createSecureConnector(A, Q, B) {
      let G = LV2(this.secureContext, this.verifyOptions, A, Q);
      return new OV2(G, B !== null && B !== void 0 ? B : uJ1.CallCredentials.createEmpty())
    }
  }
  class JvA extends VFA {
    constructor(A, Q, B) {
      super();
      this.caCertificateProvider = A, this.identityCertificateProvider = Q, this.verifyOptions = B, this.refcount = 0, this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this), this.secureContextWatchers = []
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      var Q, B;
      if (this === A) return !0;
      if (A instanceof JvA) return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && ((Q = this.verifyOptions) === null || Q === void 0 ? void 0 : Q.checkServerIdentity) === ((B = A.verifyOptions) === null || B === void 0 ? void 0 : B.checkServerIdentity);
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
    _createSecureConnector(A, Q, B) {
      return this.ref(), new JvA.SecureConnectorImpl(this, A, Q, B !== null && B !== void 0 ? B : uJ1.CallCredentials.createEmpty())
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
      var A, Q;
      if (!this.latestCaUpdate) return null;
      if (this.identityCertificateProvider !== null && !this.latestIdentityUpdate) return null;
      try {
        return (0, XvA.createSecureContext)({
          ca: this.latestCaUpdate.caCertificate,
          key: (A = this.latestIdentityUpdate) === null || A === void 0 ? void 0 : A.privateKey,
          cert: (Q = this.latestIdentityUpdate) === null || Q === void 0 ? void 0 : Q.certificate,
          ciphers: kK0.CIPHER_SUITES
        })
      } catch (B) {
        return (0, KC5.log)(VC5.LogVerbosity.ERROR, "Failed to createSecureContext with error " + B.message), null
      }
    }
  }
  JvA.SecureConnectorImpl = class {
    constructor(A, Q, B, G) {
      this.parent = A, this.channelTarget = Q, this.options = B, this.callCredentials = G
    }
    connect(A) {
      return new Promise((Q, B) => {
        let G = this.parent.getLatestSecureContext();
        if (!G) {
          B(Error("Failed to load credentials"));
          return
        }
        if (A.closed) B(Error("Socket closed while loading credentials"));
        let Z = LV2(G, this.parent.verifyOptions, this.channelTarget, this.options),
          Y = Object.assign({
            socket: A
          }, Z),
          J = () => {
            B(Error("Socket closed"))
          },
          X = (D) => {
            B(D)
          },
          I = (0, XvA.connect)(Y, () => {
            var D;
            if (I.removeListener("close", J), I.removeListener("error", X), ((D = this.parent.verifyOptions.rejectUnauthorized) !== null && D !== void 0 ? D : !0) && !I.authorized) {
              B(I.authorizationError);
              return
            }
            Q({
              socket: I,
              secure: !0
            })
          });
        I.once("close", J), I.once("error", X)
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

  function FC5(A, Q, B) {
    return new JvA(A, Q, B !== null && B !== void 0 ? B : {})
  }
  class gJ1 extends VFA {
    constructor(A, Q) {
      super();
      if (this.channelCredentials = A, this.callCredentials = Q, !A._isSecure()) throw Error("Cannot compose insecure credentials")
    }
    compose(A) {
      let Q = this.callCredentials.compose(A);
      return new gJ1(this.channelCredentials, Q)
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof gJ1) return this.channelCredentials._equals(A.channelCredentials) && this.callCredentials._equals(A.callCredentials);
      else return !1
    }
    _createSecureConnector(A, Q, B) {
      let G = this.callCredentials.compose(B !== null && B !== void 0 ? B : uJ1.CallCredentials.createEmpty());
      return this.channelCredentials._createSecureConnector(A, Q, G)
    }
  }
})
// @from(Ln 290802, Col 4)
Ys = U((jV2) => {
  Object.defineProperty(jV2, "__esModule", {
    value: !0
  });
  jV2.createChildChannelControlHelper = $C5;
  jV2.registerLoadBalancerType = CC5;
  jV2.registerDefaultLoadBalancerType = UC5;
  jV2.createLoadBalancer = qC5;
  jV2.isLoadBalancerNameRegistered = NC5;
  jV2.parseLoadBalancingConfig = _V2;
  jV2.getDefaultConfig = wC5;
  jV2.selectLbConfigFromList = LC5;
  var EC5 = WY(),
    zC5 = j8();

  function $C5(A, Q) {
    var B, G, Z, Y, J, X, I, D, W, K;
    return {
      createSubchannel: (G = (B = Q.createSubchannel) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : A.createSubchannel.bind(A),
      updateState: (Y = (Z = Q.updateState) === null || Z === void 0 ? void 0 : Z.bind(Q)) !== null && Y !== void 0 ? Y : A.updateState.bind(A),
      requestReresolution: (X = (J = Q.requestReresolution) === null || J === void 0 ? void 0 : J.bind(Q)) !== null && X !== void 0 ? X : A.requestReresolution.bind(A),
      addChannelzChild: (D = (I = Q.addChannelzChild) === null || I === void 0 ? void 0 : I.bind(Q)) !== null && D !== void 0 ? D : A.addChannelzChild.bind(A),
      removeChannelzChild: (K = (W = Q.removeChannelzChild) === null || W === void 0 ? void 0 : W.bind(Q)) !== null && K !== void 0 ? K : A.removeChannelzChild.bind(A)
    }
  }
  var Zs = {},
    IvA = null;

  function CC5(A, Q, B) {
    Zs[A] = {
      LoadBalancer: Q,
      LoadBalancingConfig: B
    }
  }

  function UC5(A) {
    IvA = A
  }

  function qC5(A, Q) {
    let B = A.getLoadBalancerName();
    if (B in Zs) return new Zs[B].LoadBalancer(Q);
    else return null
  }

  function NC5(A) {
    return A in Zs
  }

  function _V2(A) {
    let Q = Object.keys(A);
    if (Q.length !== 1) throw Error("Provided load balancing config has multiple conflicting entries");
    let B = Q[0];
    if (B in Zs) try {
      return Zs[B].LoadBalancingConfig.createFromJson(A[B])
    } catch (G) {
      throw Error(`${B}: ${G.message}`)
    } else throw Error(`Unrecognized load balancing config name ${B}`)
  }

  function wC5() {
    if (!IvA) throw Error("No default load balancer type registered");
    return new Zs[IvA].LoadBalancingConfig
  }

  function LC5(A, Q = !1) {
    for (let B of A) try {
      return _V2(B)
    } catch (G) {
      (0, EC5.log)(zC5.LogVerbosity.DEBUG, "Config parsing failed with error", G.message);
      continue
    }
    if (Q)
      if (IvA) return new Zs[IvA].LoadBalancingConfig;
      else return null;
    else return null
  }
})
// @from(Ln 290880, Col 4)
fK0 = U((SV2) => {
  Object.defineProperty(SV2, "__esModule", {
    value: !0
  });
  SV2.validateRetryThrottling = TV2;
  SV2.validateServiceConfig = PV2;
  SV2.extractAndSelectServiceConfig = mC5;
  var xC5 = NA("os"),
    mJ1 = j8(),
    dJ1 = /^\d+(\.\d{1,9})?s$/,
    yC5 = "node";

  function vC5(A) {
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

  function kC5(A) {
    if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config retry policy: maxAttempts must be an integer at least 2");
    if (!("initialBackoff" in A) || typeof A.initialBackoff !== "string" || !dJ1.test(A.initialBackoff)) throw Error("Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s");
    if (!("maxBackoff" in A) || typeof A.maxBackoff !== "string" || !dJ1.test(A.maxBackoff)) throw Error("Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s");
    if (!("backoffMultiplier" in A) || typeof A.backoffMultiplier !== "number" || A.backoffMultiplier <= 0) throw Error("Invalid method config retry policy: backoffMultiplier must be a number greater than 0");
    if (!(("retryableStatusCodes" in A) && Array.isArray(A.retryableStatusCodes))) throw Error("Invalid method config retry policy: retryableStatusCodes is required");
    if (A.retryableStatusCodes.length === 0) throw Error("Invalid method config retry policy: retryableStatusCodes must be non-empty");
    for (let Q of A.retryableStatusCodes)
      if (typeof Q === "number") {
        if (!Object.values(mJ1.Status).includes(Q)) throw Error("Invalid method config retry policy: retryableStatusCodes value not in status code range")
      } else if (typeof Q === "string") {
      if (!Object.values(mJ1.Status).includes(Q.toUpperCase())) throw Error("Invalid method config retry policy: retryableStatusCodes value not a status code name")
    } else throw Error("Invalid method config retry policy: retryableStatusCodes value must be a string or number");
    return {
      maxAttempts: A.maxAttempts,
      initialBackoff: A.initialBackoff,
      maxBackoff: A.maxBackoff,
      backoffMultiplier: A.backoffMultiplier,
      retryableStatusCodes: A.retryableStatusCodes
    }
  }

  function bC5(A) {
    if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config hedging policy: maxAttempts must be an integer at least 2");
    if ("hedgingDelay" in A && (typeof A.hedgingDelay !== "string" || !dJ1.test(A.hedgingDelay))) throw Error("Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s");
    if ("nonFatalStatusCodes" in A && Array.isArray(A.nonFatalStatusCodes))
      for (let B of A.nonFatalStatusCodes)
        if (typeof B === "number") {
          if (!Object.values(mJ1.Status).includes(B)) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not in status code range")
        } else if (typeof B === "string") {
      if (!Object.values(mJ1.Status).includes(B.toUpperCase())) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not a status code name")
    } else throw Error("Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number");
    let Q = {
      maxAttempts: A.maxAttempts
    };
    if (A.hedgingDelay) Q.hedgingDelay = A.hedgingDelay;
    if (A.nonFatalStatusCodes) Q.nonFatalStatusCodes = A.nonFatalStatusCodes;
    return Q
  }

  function fC5(A) {
    var Q;
    let B = {
      name: []
    };
    if (!("name" in A) || !Array.isArray(A.name)) throw Error("Invalid method config: invalid name array");
    for (let G of A.name) B.name.push(vC5(G));
    if ("waitForReady" in A) {
      if (typeof A.waitForReady !== "boolean") throw Error("Invalid method config: invalid waitForReady");
      B.waitForReady = A.waitForReady
    }
    if ("timeout" in A)
      if (typeof A.timeout === "object") {
        if (!("seconds" in A.timeout) || typeof A.timeout.seconds !== "number") throw Error("Invalid method config: invalid timeout.seconds");
        if (!("nanos" in A.timeout) || typeof A.timeout.nanos !== "number") throw Error("Invalid method config: invalid timeout.nanos");
        B.timeout = A.timeout
      } else if (typeof A.timeout === "string" && dJ1.test(A.timeout)) {
      let G = A.timeout.substring(0, A.timeout.length - 1).split(".");
      B.timeout = {
        seconds: G[0] | 0,
        nanos: ((Q = G[1]) !== null && Q !== void 0 ? Q : 0) | 0
      }
    } else throw Error("Invalid method config: invalid timeout");
    if ("maxRequestBytes" in A) {
      if (typeof A.maxRequestBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
      B.maxRequestBytes = A.maxRequestBytes
    }
    if ("maxResponseBytes" in A) {
      if (typeof A.maxResponseBytes !== "number") throw Error("Invalid method config: invalid maxRequestBytes");
      B.maxResponseBytes = A.maxResponseBytes
    }
    if ("retryPolicy" in A)
      if ("hedgingPolicy" in A) throw Error("Invalid method config: retryPolicy and hedgingPolicy cannot both be specified");
      else B.retryPolicy = kC5(A.retryPolicy);
    else if ("hedgingPolicy" in A) B.hedgingPolicy = bC5(A.hedgingPolicy);
    return B
  }

  function TV2(A) {
    if (!("maxTokens" in A) || typeof A.maxTokens !== "number" || A.maxTokens <= 0 || A.maxTokens > 1000) throw Error("Invalid retryThrottling: maxTokens must be a number in (0, 1000]");
    if (!("tokenRatio" in A) || typeof A.tokenRatio !== "number" || A.tokenRatio <= 0) throw Error("Invalid retryThrottling: tokenRatio must be a number greater than 0");
    return {
      maxTokens: +A.maxTokens.toFixed(3),
      tokenRatio: +A.tokenRatio.toFixed(3)
    }
  }

  function hC5(A) {
    if (!(typeof A === "object" && A !== null)) throw Error(`Invalid loadBalancingConfig: unexpected type ${typeof A}`);
    let Q = Object.keys(A);
    if (Q.length > 1) throw Error(`Invalid loadBalancingConfig: unexpected multiple keys ${Q}`);
    if (Q.length === 0) throw Error("Invalid loadBalancingConfig: load balancing policy name required");
    return {
      [Q[0]]: A[Q[0]]
    }
  }

  function PV2(A) {
    let Q = {
      loadBalancingConfig: [],
      methodConfig: []
    };
    if ("loadBalancingPolicy" in A)
      if (typeof A.loadBalancingPolicy === "string") Q.loadBalancingPolicy = A.loadBalancingPolicy;
      else throw Error("Invalid service config: invalid loadBalancingPolicy");
    if ("loadBalancingConfig" in A)
      if (Array.isArray(A.loadBalancingConfig))
        for (let G of A.loadBalancingConfig) Q.loadBalancingConfig.push(hC5(G));
      else throw Error("Invalid service config: invalid loadBalancingConfig");
    if ("methodConfig" in A) {
      if (Array.isArray(A.methodConfig))
        for (let G of A.methodConfig) Q.methodConfig.push(fC5(G))
    }
    if ("retryThrottling" in A) Q.retryThrottling = TV2(A.retryThrottling);
    let B = [];
    for (let G of Q.methodConfig)
      for (let Z of G.name) {
        for (let Y of B)
          if (Z.service === Y.service && Z.method === Y.method) throw Error(`Invalid service config: duplicate name ${Z.service}/${Z.method}`);
        B.push(Z)
      }
    return Q
  }

  function gC5(A) {
    if (!("serviceConfig" in A)) throw Error("Invalid service config choice: missing service config");
    let Q = {
      serviceConfig: PV2(A.serviceConfig)
    };
    if ("clientLanguage" in A)
      if (Array.isArray(A.clientLanguage)) {
        Q.clientLanguage = [];
        for (let G of A.clientLanguage)
          if (typeof G === "string") Q.clientLanguage.push(G);
          else throw Error("Invalid service config choice: invalid clientLanguage")
      } else throw Error("Invalid service config choice: invalid clientLanguage");
    if ("clientHostname" in A)
      if (Array.isArray(A.clientHostname)) {
        Q.clientHostname = [];
        for (let G of A.clientHostname)
          if (typeof G === "string") Q.clientHostname.push(G);
          else throw Error("Invalid service config choice: invalid clientHostname")
      } else throw Error("Invalid service config choice: invalid clientHostname");
    if ("percentage" in A)
      if (typeof A.percentage === "number" && 0 <= A.percentage && A.percentage <= 100) Q.percentage = A.percentage;
      else throw Error("Invalid service config choice: invalid percentage");
    let B = ["clientLanguage", "percentage", "clientHostname", "serviceConfig"];
    for (let G in A)
      if (!B.includes(G)) throw Error(`Invalid service config choice: unexpected field ${G}`);
    return Q
  }

  function uC5(A, Q) {
    if (!Array.isArray(A)) throw Error("Invalid service config list");
    for (let B of A) {
      let G = gC5(B);
      if (typeof G.percentage === "number" && Q > G.percentage) continue;
      if (Array.isArray(G.clientHostname)) {
        let Z = !1;
        for (let Y of G.clientHostname)
          if (Y === xC5.hostname()) Z = !0;
        if (!Z) continue
      }
      if (Array.isArray(G.clientLanguage)) {
        let Z = !1;
        for (let Y of G.clientLanguage)
          if (Y === yC5) Z = !0;
        if (!Z) continue
      }
      return G.serviceConfig
    }
    throw Error("No matching service config found")
  }

  function mC5(A, Q) {
    for (let B of A)
      if (B.length > 0 && B[0].startsWith("grpc_config=")) {
        let G = B.join("").substring(12),
          Z = JSON.parse(G);
        return uC5(Z, Q)
      } return null
  }
})
// @from(Ln 291093, Col 4)
XU = U((yV2) => {
  Object.defineProperty(yV2, "__esModule", {
    value: !0
  });
  yV2.ConnectivityState = void 0;
  var xV2;
  (function (A) {
    A[A.IDLE = 0] = "IDLE", A[A.CONNECTING = 1] = "CONNECTING", A[A.READY = 2] = "READY", A[A.TRANSIENT_FAILURE = 3] = "TRANSIENT_FAILURE", A[A.SHUTDOWN = 4] = "SHUTDOWN"
  })(xV2 || (yV2.ConnectivityState = xV2 = {}))
})
// @from(Ln 291103, Col 4)
dd = U((fV2) => {
  Object.defineProperty(fV2, "__esModule", {
    value: !0
  });
  fV2.QueuePicker = fV2.UnavailablePicker = fV2.PickResultType = void 0;
  var lC5 = jF(),
    iC5 = j8(),
    cJ1;
  (function (A) {
    A[A.COMPLETE = 0] = "COMPLETE", A[A.QUEUE = 1] = "QUEUE", A[A.TRANSIENT_FAILURE = 2] = "TRANSIENT_FAILURE", A[A.DROP = 3] = "DROP"
  })(cJ1 || (fV2.PickResultType = cJ1 = {}));
  class kV2 {
    constructor(A) {
      this.status = Object.assign({
        code: iC5.Status.UNAVAILABLE,
        details: "No connection established",
        metadata: new lC5.Metadata
      }, A)
    }
    pick(A) {
      return {
        pickResultType: cJ1.TRANSIENT_FAILURE,
        subchannel: null,
        status: this.status,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  fV2.UnavailablePicker = kV2;
  class bV2 {
    constructor(A, Q) {
      this.loadBalancer = A, this.childPicker = Q, this.calledExitIdle = !1
    }
    pick(A) {
      if (!this.calledExitIdle) process.nextTick(() => {
        this.loadBalancer.exitIdle()
      }), this.calledExitIdle = !0;
      if (this.childPicker) return this.childPicker.pick(A);
      else return {
        pickResultType: cJ1.QUEUE,
        subchannel: null,
        status: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  fV2.QueuePicker = bV2
})
// @from(Ln 291153, Col 4)
HFA = U((gV2) => {
  Object.defineProperty(gV2, "__esModule", {
    value: !0
  });
  gV2.BackoffTimeout = void 0;
  var oC5 = j8(),
    rC5 = WY(),
    sC5 = "backoff",
    tC5 = 1000,
    eC5 = 1.6,
    AU5 = 120000,
    QU5 = 0.2;

  function BU5(A, Q) {
    return Math.random() * (Q - A) + A
  }
  class pJ1 {
    constructor(A, Q) {
      if (this.callback = A, this.initialDelay = tC5, this.multiplier = eC5, this.maxDelay = AU5, this.jitter = QU5, this.running = !1, this.hasRef = !0, this.startTime = new Date, this.endTime = new Date, this.id = pJ1.getNextId(), Q) {
        if (Q.initialDelay) this.initialDelay = Q.initialDelay;
        if (Q.multiplier) this.multiplier = Q.multiplier;
        if (Q.jitter) this.jitter = Q.jitter;
        if (Q.maxDelay) this.maxDelay = Q.maxDelay
      }
      this.trace("constructed initialDelay=" + this.initialDelay + " multiplier=" + this.multiplier + " jitter=" + this.jitter + " maxDelay=" + this.maxDelay), this.nextDelay = this.initialDelay, this.timerId = setTimeout(() => {}, 0), clearTimeout(this.timerId)
    }
    static getNextId() {
      return this.nextId++
    }
    trace(A) {
      rC5.trace(oC5.LogVerbosity.DEBUG, sC5, "{" + this.id + "} " + A)
    }
    runTimer(A) {
      var Q, B;
      if (this.trace("runTimer(delay=" + A + ")"), this.endTime = this.startTime, this.endTime.setMilliseconds(this.endTime.getMilliseconds() + A), clearTimeout(this.timerId), this.timerId = setTimeout(() => {
          this.trace("timer fired"), this.running = !1, this.callback()
        }, A), !this.hasRef)(B = (Q = this.timerId).unref) === null || B === void 0 || B.call(Q)
    }
    runOnce() {
      this.trace("runOnce()"), this.running = !0, this.startTime = new Date, this.runTimer(this.nextDelay);
      let A = Math.min(this.nextDelay * this.multiplier, this.maxDelay),
        Q = A * this.jitter;
      this.nextDelay = A + BU5(-Q, Q)
    }
    stop() {
      this.trace("stop()"), clearTimeout(this.timerId), this.running = !1
    }
    reset() {
      if (this.trace("reset() running=" + this.running), this.nextDelay = this.initialDelay, this.running) {
        let A = new Date,
          Q = this.startTime;
        if (Q.setMilliseconds(Q.getMilliseconds() + this.nextDelay), clearTimeout(this.timerId), A < Q) this.runTimer(Q.getTime() - A.getTime());
        else this.running = !1
      }
    }
    isRunning() {
      return this.running
    }
    ref() {
      var A, Q;
      this.hasRef = !0, (Q = (A = this.timerId).ref) === null || Q === void 0 || Q.call(A)
    }
    unref() {
      var A, Q;
      this.hasRef = !1, (Q = (A = this.timerId).unref) === null || Q === void 0 || Q.call(A)
    }
    getEndTime() {
      return this.endTime
    }
  }
  gV2.BackoffTimeout = pJ1;
  pJ1.nextId = 0
})
// @from(Ln 291226, Col 4)
lJ1 = U((dV2) => {
  Object.defineProperty(dV2, "__esModule", {
    value: !0
  });
  dV2.ChildLoadBalancerHandler = void 0;
  var GU5 = Ys(),
    ZU5 = XU(),
    YU5 = "child_load_balancer_helper";
  class mV2 {
    constructor(A) {
      this.channelControlHelper = A, this.currentChild = null, this.pendingChild = null, this.latestConfig = null, this.ChildPolicyHelper = class {
        constructor(Q) {
          this.parent = Q, this.child = null
        }
        createSubchannel(Q, B) {
          return this.parent.channelControlHelper.createSubchannel(Q, B)
        }
        updateState(Q, B, G) {
          var Z;
          if (this.calledByPendingChild()) {
            if (Q === ZU5.ConnectivityState.CONNECTING) return;
            (Z = this.parent.currentChild) === null || Z === void 0 || Z.destroy(), this.parent.currentChild = this.parent.pendingChild, this.parent.pendingChild = null
          } else if (!this.calledByCurrentChild()) return;
          this.parent.channelControlHelper.updateState(Q, B, G)
        }
        requestReresolution() {
          var Q;
          let B = (Q = this.parent.pendingChild) !== null && Q !== void 0 ? Q : this.parent.currentChild;
          if (this.child === B) this.parent.channelControlHelper.requestReresolution()
        }
        setChild(Q) {
          this.child = Q
        }
        addChannelzChild(Q) {
          this.parent.channelControlHelper.addChannelzChild(Q)
        }
        removeChannelzChild(Q) {
          this.parent.channelControlHelper.removeChannelzChild(Q)
        }
        calledByPendingChild() {
          return this.child === this.parent.pendingChild
        }
        calledByCurrentChild() {
          return this.child === this.parent.currentChild
        }
      }
    }
    configUpdateRequiresNewPolicyInstance(A, Q) {
      return A.getLoadBalancerName() !== Q.getLoadBalancerName()
    }
    updateAddressList(A, Q, B, G) {
      let Z;
      if (this.currentChild === null || this.latestConfig === null || this.configUpdateRequiresNewPolicyInstance(this.latestConfig, Q)) {
        let Y = new this.ChildPolicyHelper(this),
          J = (0, GU5.createLoadBalancer)(Q, Y);
        if (Y.setChild(J), this.currentChild === null) this.currentChild = J, Z = this.currentChild;
        else {
          if (this.pendingChild) this.pendingChild.destroy();
          this.pendingChild = J, Z = this.pendingChild
        }
      } else if (this.pendingChild === null) Z = this.currentChild;
      else Z = this.pendingChild;
      return this.latestConfig = Q, Z.updateAddressList(A, Q, B, G)
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
      return YU5
    }
  }
  dV2.ChildLoadBalancerHandler = mV2
})
// @from(Ln 291310, Col 4)
oV2 = U((nV2) => {
  Object.defineProperty(nV2, "__esModule", {
    value: !0
  });
  nV2.ResolvingLoadBalancer = void 0;
  var JU5 = Ys(),
    XU5 = fK0(),
    fN = XU(),
    pV2 = gS(),
    DvA = dd(),
    IU5 = HFA(),
    hK0 = j8(),
    DU5 = jF(),
    WU5 = WY(),
    KU5 = j8(),
    VU5 = JU(),
    FU5 = lJ1(),
    HU5 = "resolving_load_balancer";

  function lV2(A) {
    WU5.trace(KU5.LogVerbosity.DEBUG, HU5, A)
  }
  var EU5 = ["SERVICE_AND_METHOD", "SERVICE", "EMPTY"];

  function zU5(A, Q, B, G) {
    for (let Z of B.name) switch (G) {
      case "EMPTY":
        if (!Z.service && !Z.method) return !0;
        break;
      case "SERVICE":
        if (Z.service === A && !Z.method) return !0;
        break;
      case "SERVICE_AND_METHOD":
        if (Z.service === A && Z.method === Q) return !0
    }
    return !1
  }

  function $U5(A, Q, B, G) {
    for (let Z of B)
      if (zU5(A, Q, Z, G)) return Z;
    return null
  }

  function CU5(A) {
    return {
      invoke(Q, B) {
        var G, Z;
        let Y = Q.split("/").filter((I) => I.length > 0),
          J = (G = Y[0]) !== null && G !== void 0 ? G : "",
          X = (Z = Y[1]) !== null && Z !== void 0 ? Z : "";
        if (A && A.methodConfig)
          for (let I of EU5) {
            let D = $U5(J, X, A.methodConfig, I);
            if (D) return {
              methodConfig: D,
              pickInformation: {},
              status: hK0.Status.OK,
              dynamicFilterFactories: []
            }
          }
        return {
          methodConfig: {
            name: []
          },
          pickInformation: {},
          status: hK0.Status.OK,
          dynamicFilterFactories: []
        }
      },
      unref() {}
    }
  }
  class iV2 {
    constructor(A, Q, B, G, Z) {
      if (this.target = A, this.channelControlHelper = Q, this.channelOptions = B, this.onSuccessfulResolution = G, this.onFailedResolution = Z, this.latestChildState = fN.ConnectivityState.IDLE, this.latestChildPicker = new DvA.QueuePicker(this), this.latestChildErrorMessage = null, this.currentState = fN.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1, B["grpc.service_config"]) this.defaultServiceConfig = (0, XU5.validateServiceConfig)(JSON.parse(B["grpc.service_config"]));
      else this.defaultServiceConfig = {
        loadBalancingConfig: [],
        methodConfig: []
      };
      this.updateState(fN.ConnectivityState.IDLE, new DvA.QueuePicker(this), null), this.childLoadBalancer = new FU5.ChildLoadBalancerHandler({
        createSubchannel: Q.createSubchannel.bind(Q),
        requestReresolution: () => {
          if (this.backoffTimeout.isRunning()) lV2("requestReresolution delayed by backoff timer until " + this.backoffTimeout.getEndTime().toISOString()), this.continueResolving = !0;
          else this.updateResolution()
        },
        updateState: (J, X, I) => {
          this.latestChildState = J, this.latestChildPicker = X, this.latestChildErrorMessage = I, this.updateState(J, X, I)
        },
        addChannelzChild: Q.addChannelzChild.bind(Q),
        removeChannelzChild: Q.removeChannelzChild.bind(Q)
      }), this.innerResolver = (0, pV2.createResolver)(A, this.handleResolverResult.bind(this), B);
      let Y = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      this.backoffTimeout = new IU5.BackoffTimeout(() => {
        if (this.continueResolving) this.updateResolution(), this.continueResolving = !1;
        else this.updateState(this.latestChildState, this.latestChildPicker, this.latestChildErrorMessage)
      }, Y), this.backoffTimeout.unref()
    }
    handleResolverResult(A, Q, B, G) {
      var Z, Y;
      this.backoffTimeout.stop(), this.backoffTimeout.reset();
      let J = !0,
        X = null;
      if (B === null) X = this.defaultServiceConfig;
      else if (B.ok) X = B.value;
      else if (this.previousServiceConfig !== null) X = this.previousServiceConfig;
      else J = !1, this.handleResolutionFailure(B.error);
      if (X !== null) {
        let I = (Z = X === null || X === void 0 ? void 0 : X.loadBalancingConfig) !== null && Z !== void 0 ? Z : [],
          D = (0, JU5.selectLbConfigFromList)(I, !0);
        if (D === null) J = !1, this.handleResolutionFailure({
          code: hK0.Status.UNAVAILABLE,
          details: "All load balancer options in service config are not compatible",
          metadata: new DU5.Metadata
        });
        else J = this.childLoadBalancer.updateAddressList(A, D, Object.assign(Object.assign({}, this.channelOptions), Q), G)
      }
      if (J) this.onSuccessfulResolution(X, (Y = Q[pV2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY]) !== null && Y !== void 0 ? Y : CU5(X));
      return J
    }
    updateResolution() {
      if (this.innerResolver.updateResolution(), this.currentState === fN.ConnectivityState.IDLE) this.updateState(fN.ConnectivityState.CONNECTING, this.latestChildPicker, this.latestChildErrorMessage);
      this.backoffTimeout.runOnce()
    }
    updateState(A, Q, B) {
      if (lV2((0, VU5.uriToString)(this.target) + " " + fN.ConnectivityState[this.currentState] + " -> " + fN.ConnectivityState[A]), A === fN.ConnectivityState.IDLE) Q = new DvA.QueuePicker(this, Q);
      this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    handleResolutionFailure(A) {
      if (this.latestChildState === fN.ConnectivityState.IDLE) this.updateState(fN.ConnectivityState.TRANSIENT_FAILURE, new DvA.UnavailablePicker(A), A.details), this.onFailedResolution(A)
    }
    exitIdle() {
      if (this.currentState === fN.ConnectivityState.IDLE || this.currentState === fN.ConnectivityState.TRANSIENT_FAILURE)
        if (this.backoffTimeout.isRunning()) this.continueResolving = !0;
        else this.updateResolution();
      this.childLoadBalancer.exitIdle()
    }
    updateAddressList(A, Q) {
      throw Error("updateAddressList not supported on ResolvingLoadBalancer")
    }
    resetBackoff() {
      this.backoffTimeout.reset(), this.childLoadBalancer.resetBackoff()
    }
    destroy() {
      this.childLoadBalancer.destroy(), this.innerResolver.destroy(), this.backoffTimeout.reset(), this.backoffTimeout.stop(), this.latestChildState = fN.ConnectivityState.IDLE, this.latestChildPicker = new DvA.QueuePicker(this), this.currentState = fN.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1
    }
    getTypeName() {
      return "resolving_load_balancer"
    }
  }
  nV2.ResolvingLoadBalancer = iV2
})
// @from(Ln 291465, Col 4)
tV2 = U((rV2) => {
  Object.defineProperty(rV2, "__esModule", {
    value: !0
  });
  rV2.recognizedOptions = void 0;
  rV2.channelOptionsEqual = UU5;
  rV2.recognizedOptions = {
    "grpc.ssl_target_name_override": !0,
    "grpc.primary_user_agent": !0,
    "grpc.secondary_user_agent": !0,
    "grpc.default_authority": !0,
    "grpc.keepalive_time_ms": !0,
    "grpc.keepalive_timeout_ms": !0,
    "grpc.keepalive_permit_without_calls": !0,
    "grpc.service_config": !0,
    "grpc.max_concurrent_streams": !0,
    "grpc.initial_reconnect_backoff_ms": !0,
    "grpc.max_reconnect_backoff_ms": !0,
    "grpc.use_local_subchannel_pool": !0,
    "grpc.max_send_message_length": !0,
    "grpc.max_receive_message_length": !0,
    "grpc.enable_http_proxy": !0,
    "grpc.enable_channelz": !0,
    "grpc.dns_min_time_between_resolutions_ms": !0,
    "grpc.enable_retries": !0,
    "grpc.per_rpc_retry_buffer_size": !0,
    "grpc.retry_buffer_size": !0,
    "grpc.max_connection_age_ms": !0,
    "grpc.max_connection_age_grace_ms": !0,
    "grpc-node.max_session_memory": !0,
    "grpc.service_config_disable_resolution": !0,
    "grpc.client_idle_timeout_ms": !0,
    "grpc-node.tls_enable_trace": !0,
    "grpc.lb.ring_hash.ring_size_cap": !0,
    "grpc-node.retry_max_attempts_limit": !0,
    "grpc-node.flow_control_window": !0,
    "grpc.server_call_metric_recording": !0
  };

  function UU5(A, Q) {
    let B = Object.keys(A).sort(),
      G = Object.keys(Q).sort();
    if (B.length !== G.length) return !1;
    for (let Z = 0; Z < B.length; Z += 1) {
      if (B[Z] !== G[Z]) return !1;
      if (A[B[Z]] !== Q[G[Z]]) return !1
    }
    return !0
  }
})
// @from(Ln 291515, Col 4)
hN = U((GF2) => {
  Object.defineProperty(GF2, "__esModule", {
    value: !0
  });
  GF2.EndpointMap = void 0;
  GF2.isTcpSubchannelAddress = KvA;
  GF2.subchannelAddressEqual = iJ1;
  GF2.subchannelAddressToString = AF2;
  GF2.stringToSubchannelAddress = wU5;
  GF2.endpointEqual = LU5;
  GF2.endpointToString = OU5;
  GF2.endpointHasAddress = QF2;
  var eV2 = NA("net");

  function KvA(A) {
    return "port" in A
  }

  function iJ1(A, Q) {
    if (!A && !Q) return !0;
    if (!A || !Q) return !1;
    if (KvA(A)) return KvA(Q) && A.host === Q.host && A.port === Q.port;
    else return !KvA(Q) && A.path === Q.path
  }

  function AF2(A) {
    if (KvA(A))
      if ((0, eV2.isIPv6)(A.host)) return "[" + A.host + "]:" + A.port;
      else return A.host + ":" + A.port;
    else return A.path
  }
  var NU5 = 443;

  function wU5(A, Q) {
    if ((0, eV2.isIP)(A)) return {
      host: A,
      port: Q !== null && Q !== void 0 ? Q : NU5
    };
    else return {
      path: A
    }
  }

  function LU5(A, Q) {
    if (A.addresses.length !== Q.addresses.length) return !1;
    for (let B = 0; B < A.addresses.length; B++)
      if (!iJ1(A.addresses[B], Q.addresses[B])) return !1;
    return !0
  }

  function OU5(A) {
    return "[" + A.addresses.map(AF2).join(", ") + "]"
  }

  function QF2(A, Q) {
    for (let B of A.addresses)
      if (iJ1(B, Q)) return !0;
    return !1
  }

  function WvA(A, Q) {
    if (A.addresses.length !== Q.addresses.length) return !1;
    for (let B of A.addresses) {
      let G = !1;
      for (let Z of Q.addresses)
        if (iJ1(B, Z)) {
          G = !0;
          break
        } if (!G) return !1
    }
    return !0
  }
  class BF2 {
    constructor() {
      this.map = new Set
    }
    get size() {
      return this.map.size
    }
    getForSubchannelAddress(A) {
      for (let Q of this.map)
        if (QF2(Q.key, A)) return Q.value;
      return
    }
    deleteMissing(A) {
      let Q = [];
      for (let B of this.map) {
        let G = !1;
        for (let Z of A)
          if (WvA(Z, B.key)) G = !0;
        if (!G) Q.push(B.value), this.map.delete(B)
      }
      return Q
    }
    get(A) {
      for (let Q of this.map)
        if (WvA(A, Q.key)) return Q.value;
      return
    }
    set(A, Q) {
      for (let B of this.map)
        if (WvA(A, B.key)) {
          B.value = Q;
          return
        } this.map.add({
        key: A,
        value: Q
      })
    }
    delete(A) {
      for (let Q of this.map)
        if (WvA(A, Q.key)) {
          this.map.delete(Q);
          return
        }
    }
    has(A) {
      for (let Q of this.map)
        if (WvA(A, Q.key)) return !0;
      return !1
    }
    clear() {
      this.map.clear()
    }* keys() {
      for (let A of this.map) yield A.key
    }* values() {
      for (let A of this.map) yield A.value
    }* entries() {
      for (let A of this.map) yield [A.key, A.value]
    }
  }
  GF2.EndpointMap = BF2
})