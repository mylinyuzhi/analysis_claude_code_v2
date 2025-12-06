
// @from(Start 10515118, End 10515629)
uF2 = z((hF2) => {
  Object.defineProperty(hF2, "__esModule", {
    value: !0
  });
  hF2.hexToBinary = void 0;

  function fF2(A) {
    if (A >= 48 && A <= 57) return A - 48;
    if (A >= 97 && A <= 102) return A - 87;
    return A - 55
  }

  function mU5(A) {
    let Q = new Uint8Array(A.length / 2),
      B = 0;
    for (let G = 0; G < A.length; G += 2) {
      let Z = fF2(A.charCodeAt(G)),
        I = fF2(A.charCodeAt(G + 1));
      Q[B++] = Z << 4 | I
    }
    return Q
  }
  hF2.hexToBinary = mU5
})
// @from(Start 10515635, End 10516965)
E41 = z((lF2) => {
  Object.defineProperty(lF2, "__esModule", {
    value: !0
  });
  lF2.getOtlpEncoder = lF2.encodeAsString = lF2.encodeAsLongBits = lF2.toLongBits = lF2.hrTimeToNanos = void 0;
  var dU5 = e6(),
    RB0 = uF2();

  function TB0(A) {
    let Q = BigInt(1e9);
    return BigInt(A[0]) * Q + BigInt(A[1])
  }
  lF2.hrTimeToNanos = TB0;

  function dF2(A) {
    let Q = Number(BigInt.asUintN(32, A)),
      B = Number(BigInt.asUintN(32, A >> BigInt(32)));
    return {
      low: Q,
      high: B
    }
  }
  lF2.toLongBits = dF2;

  function PB0(A) {
    let Q = TB0(A);
    return dF2(Q)
  }
  lF2.encodeAsLongBits = PB0;

  function cF2(A) {
    return TB0(A).toString()
  }
  lF2.encodeAsString = cF2;
  var cU5 = typeof BigInt < "u" ? cF2 : dU5.hrTimeToNanoseconds;

  function mF2(A) {
    return A
  }

  function pF2(A) {
    if (A === void 0) return;
    return (0, RB0.hexToBinary)(A)
  }
  var pU5 = {
    encodeHrTime: PB0,
    encodeSpanContext: RB0.hexToBinary,
    encodeOptionalSpanContext: pF2
  };

  function lU5(A) {
    if (A === void 0) return pU5;
    let Q = A.useLongBits ?? !0,
      B = A.useHex ?? !1;
    return {
      encodeHrTime: Q ? PB0 : cU5,
      encodeSpanContext: B ? mF2 : RB0.hexToBinary,
      encodeOptionalSpanContext: B ? mF2 : pF2
    }
  }
  lF2.getOtlpEncoder = lU5
})
// @from(Start 10516971, End 10518397)
z41 = z((aF2) => {
  Object.defineProperty(aF2, "__esModule", {
    value: !0
  });
  aF2.toAnyValue = aF2.toKeyValue = aF2.toAttributes = aF2.createInstrumentationScope = aF2.createResource = void 0;

  function rU5(A) {
    let Q = {
        attributes: nF2(A.attributes),
        droppedAttributesCount: 0
      },
      B = A.schemaUrl;
    if (B && B !== "") Q.schemaUrl = B;
    return Q
  }
  aF2.createResource = rU5;

  function oU5(A) {
    return {
      name: A.name,
      version: A.version
    }
  }
  aF2.createInstrumentationScope = oU5;

  function nF2(A) {
    return Object.keys(A).map((Q) => jB0(Q, A[Q]))
  }
  aF2.toAttributes = nF2;

  function jB0(A, Q) {
    return {
      key: A,
      value: SB0(Q)
    }
  }
  aF2.toKeyValue = jB0;

  function SB0(A) {
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
        values: A.map(SB0)
      }
    };
    if (Q === "object" && A != null) return {
      kvlistValue: {
        values: Object.entries(A).map(([B, G]) => jB0(B, G))
      }
    };
    return {}
  }
  aF2.toAnyValue = SB0
})
// @from(Start 10518403, End 10520386)
_B0 = z((oF2) => {
  Object.defineProperty(oF2, "__esModule", {
    value: !0
  });
  oF2.toLogAttributes = oF2.createExportLogsServiceRequest = void 0;
  var B$5 = E41(),
    U41 = z41();

  function G$5(A, Q) {
    let B = (0, B$5.getOtlpEncoder)(Q);
    return {
      resourceLogs: I$5(A, B)
    }
  }
  oF2.createExportLogsServiceRequest = G$5;

  function Z$5(A) {
    let Q = new Map;
    for (let B of A) {
      let {
        resource: G,
        instrumentationScope: {
          name: Z,
          version: I = "",
          schemaUrl: Y = ""
        }
      } = B, J = Q.get(G);
      if (!J) J = new Map, Q.set(G, J);
      let W = `${Z}@${I}:${Y}`,
        X = J.get(W);
      if (!X) X = [], J.set(W, X);
      X.push(B)
    }
    return Q
  }

  function I$5(A, Q) {
    let B = Z$5(A);
    return Array.from(B, ([G, Z]) => {
      let I = (0, U41.createResource)(G);
      return {
        resource: I,
        scopeLogs: Array.from(Z, ([, Y]) => {
          return {
            scope: (0, U41.createInstrumentationScope)(Y[0].instrumentationScope),
            logRecords: Y.map((J) => Y$5(J, Q)),
            schemaUrl: Y[0].instrumentationScope.schemaUrl
          }
        }),
        schemaUrl: I.schemaUrl
      }
    })
  }

  function Y$5(A, Q) {
    return {
      timeUnixNano: Q.encodeHrTime(A.hrTime),
      observedTimeUnixNano: Q.encodeHrTime(A.hrTimeObserved),
      severityNumber: J$5(A.severityNumber),
      severityText: A.severityText,
      body: (0, U41.toAnyValue)(A.body),
      eventName: A.eventName,
      attributes: rF2(A.attributes),
      droppedAttributesCount: A.droppedAttributesCount,
      flags: A.spanContext?.traceFlags,
      traceId: Q.encodeOptionalSpanContext(A.spanContext?.traceId),
      spanId: Q.encodeOptionalSpanContext(A.spanContext?.spanId)
    }
  }

  function J$5(A) {
    return A
  }

  function rF2(A) {
    return Object.keys(A).map((Q) => (0, U41.toKeyValue)(Q, A[Q]))
  }
  oF2.toLogAttributes = rF2
})
// @from(Start 10520392, End 10520946)
BK2 = z((AK2) => {
  Object.defineProperty(AK2, "__esModule", {
    value: !0
  });
  AK2.ProtobufLogsSerializer = void 0;
  var eF2 = C41(),
    X$5 = _B0(),
    V$5 = eF2.opentelemetry.proto.collector.logs.v1.ExportLogsServiceResponse,
    F$5 = eF2.opentelemetry.proto.collector.logs.v1.ExportLogsServiceRequest;
  AK2.ProtobufLogsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, X$5.createExportLogsServiceRequest)(A);
      return F$5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return V$5.decode(A)
    }
  }
})
// @from(Start 10520952, End 10521246)
GK2 = z((kB0) => {
  Object.defineProperty(kB0, "__esModule", {
    value: !0
  });
  kB0.ProtobufLogsSerializer = void 0;
  var K$5 = BK2();
  Object.defineProperty(kB0, "ProtobufLogsSerializer", {
    enumerable: !0,
    get: function() {
      return K$5.ProtobufLogsSerializer
    }
  })
})
// @from(Start 10521252, End 10521731)
IK2 = z((ZK2) => {
  Object.defineProperty(ZK2, "__esModule", {
    value: !0
  });
  ZK2.EAggregationTemporality = void 0;
  var H$5;
  (function(A) {
    A[A.AGGREGATION_TEMPORALITY_UNSPECIFIED = 0] = "AGGREGATION_TEMPORALITY_UNSPECIFIED", A[A.AGGREGATION_TEMPORALITY_DELTA = 1] = "AGGREGATION_TEMPORALITY_DELTA", A[A.AGGREGATION_TEMPORALITY_CUMULATIVE = 2] = "AGGREGATION_TEMPORALITY_CUMULATIVE"
  })(H$5 = ZK2.EAggregationTemporality || (ZK2.EAggregationTemporality = {}))
})
// @from(Start 10521737, End 10525481)
xB0 = z((KK2) => {
  Object.defineProperty(KK2, "__esModule", {
    value: !0
  });
  KK2.createExportMetricsServiceRequest = KK2.toMetric = KK2.toScopeMetrics = KK2.toResourceMetrics = void 0;
  var YK2 = K9(),
    aYA = vi(),
    JK2 = IK2(),
    C$5 = E41(),
    FOA = z41();

  function XK2(A, Q) {
    let B = (0, C$5.getOtlpEncoder)(Q),
      G = (0, FOA.createResource)(A.resource);
    return {
      resource: G,
      schemaUrl: G.schemaUrl,
      scopeMetrics: VK2(A.scopeMetrics, B)
    }
  }
  KK2.toResourceMetrics = XK2;

  function VK2(A, Q) {
    return Array.from(A.map((B) => ({
      scope: (0, FOA.createInstrumentationScope)(B.scope),
      metrics: B.metrics.map((G) => FK2(G, Q)),
      schemaUrl: B.scope.schemaUrl
    })))
  }
  KK2.toScopeMetrics = VK2;

  function FK2(A, Q) {
    let B = {
        name: A.descriptor.name,
        description: A.descriptor.description,
        unit: A.descriptor.unit
      },
      G = $$5(A.aggregationTemporality);
    switch (A.dataPointType) {
      case aYA.DataPointType.SUM:
        B.sum = {
          aggregationTemporality: G,
          isMonotonic: A.isMonotonic,
          dataPoints: WK2(A, Q)
        };
        break;
      case aYA.DataPointType.GAUGE:
        B.gauge = {
          dataPoints: WK2(A, Q)
        };
        break;
      case aYA.DataPointType.HISTOGRAM:
        B.histogram = {
          aggregationTemporality: G,
          dataPoints: z$5(A, Q)
        };
        break;
      case aYA.DataPointType.EXPONENTIAL_HISTOGRAM:
        B.exponentialHistogram = {
          aggregationTemporality: G,
          dataPoints: U$5(A, Q)
        };
        break
    }
    return B
  }
  KK2.toMetric = FK2;

  function E$5(A, Q, B) {
    let G = {
      attributes: (0, FOA.toAttributes)(A.attributes),
      startTimeUnixNano: B.encodeHrTime(A.startTime),
      timeUnixNano: B.encodeHrTime(A.endTime)
    };
    switch (Q) {
      case YK2.ValueType.INT:
        G.asInt = A.value;
        break;
      case YK2.ValueType.DOUBLE:
        G.asDouble = A.value;
        break
    }
    return G
  }

  function WK2(A, Q) {
    return A.dataPoints.map((B) => {
      return E$5(B, A.descriptor.valueType, Q)
    })
  }

  function z$5(A, Q) {
    return A.dataPoints.map((B) => {
      let G = B.value;
      return {
        attributes: (0, FOA.toAttributes)(B.attributes),
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

  function U$5(A, Q) {
    return A.dataPoints.map((B) => {
      let G = B.value;
      return {
        attributes: (0, FOA.toAttributes)(B.attributes),
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

  function $$5(A) {
    switch (A) {
      case aYA.AggregationTemporality.DELTA:
        return JK2.EAggregationTemporality.AGGREGATION_TEMPORALITY_DELTA;
      case aYA.AggregationTemporality.CUMULATIVE:
        return JK2.EAggregationTemporality.AGGREGATION_TEMPORALITY_CUMULATIVE
    }
  }

  function w$5(A, Q) {
    return {
      resourceMetrics: A.map((B) => XK2(B, Q))
    }
  }
  KK2.createExportMetricsServiceRequest = w$5
})
// @from(Start 10525487, End 10526064)
zK2 = z((CK2) => {
  Object.defineProperty(CK2, "__esModule", {
    value: !0
  });
  CK2.ProtobufMetricsSerializer = void 0;
  var HK2 = C41(),
    M$5 = xB0(),
    O$5 = HK2.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceResponse,
    R$5 = HK2.opentelemetry.proto.collector.metrics.v1.ExportMetricsServiceRequest;
  CK2.ProtobufMetricsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, M$5.createExportMetricsServiceRequest)([A]);
      return R$5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return O$5.decode(A)
    }
  }
})
// @from(Start 10526070, End 10526373)
UK2 = z((vB0) => {
  Object.defineProperty(vB0, "__esModule", {
    value: !0
  });
  vB0.ProtobufMetricsSerializer = void 0;
  var T$5 = zK2();
  Object.defineProperty(vB0, "ProtobufMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return T$5.ProtobufMetricsSerializer
    }
  })
})
// @from(Start 10526379, End 10529454)
bB0 = z((NK2) => {
  Object.defineProperty(NK2, "__esModule", {
    value: !0
  });
  NK2.createExportTraceServiceRequest = NK2.toOtlpSpanEvent = NK2.toOtlpLink = NK2.sdkSpanToOtlpSpan = void 0;
  var KOA = z41(),
    j$5 = E41();

  function $K2(A, Q) {
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
      attributes: (0, KOA.toAttributes)(A.attributes),
      droppedAttributesCount: A.droppedAttributesCount,
      events: A.events.map((I) => qK2(I, Q)),
      droppedEventsCount: A.droppedEventsCount,
      status: {
        code: G.code,
        message: G.message
      },
      links: A.links.map((I) => wK2(I, Q)),
      droppedLinksCount: A.droppedLinksCount
    }
  }
  NK2.sdkSpanToOtlpSpan = $K2;

  function wK2(A, Q) {
    return {
      attributes: A.attributes ? (0, KOA.toAttributes)(A.attributes) : [],
      spanId: Q.encodeSpanContext(A.context.spanId),
      traceId: Q.encodeSpanContext(A.context.traceId),
      traceState: A.context.traceState?.serialize(),
      droppedAttributesCount: A.droppedAttributesCount || 0
    }
  }
  NK2.toOtlpLink = wK2;

  function qK2(A, Q) {
    return {
      attributes: A.attributes ? (0, KOA.toAttributes)(A.attributes) : [],
      name: A.name,
      timeUnixNano: Q.encodeHrTime(A.time),
      droppedAttributesCount: A.droppedAttributesCount || 0
    }
  }
  NK2.toOtlpSpanEvent = qK2;

  function S$5(A, Q) {
    let B = (0, j$5.getOtlpEncoder)(Q);
    return {
      resourceSpans: k$5(A, B)
    }
  }
  NK2.createExportTraceServiceRequest = S$5;

  function _$5(A) {
    let Q = new Map;
    for (let B of A) {
      let G = Q.get(B.resource);
      if (!G) G = new Map, Q.set(B.resource, G);
      let Z = `${B.instrumentationScope.name}@${B.instrumentationScope.version||""}:${B.instrumentationScope.schemaUrl||""}`,
        I = G.get(Z);
      if (!I) I = [], G.set(Z, I);
      I.push(B)
    }
    return Q
  }

  function k$5(A, Q) {
    let B = _$5(A),
      G = [],
      Z = B.entries(),
      I = Z.next();
    while (!I.done) {
      let [Y, J] = I.value, W = [], X = J.values(), V = X.next();
      while (!V.done) {
        let D = V.value;
        if (D.length > 0) {
          let H = D.map((C) => $K2(C, Q));
          W.push({
            scope: (0, KOA.createInstrumentationScope)(D[0].instrumentationScope),
            spans: H,
            schemaUrl: D[0].instrumentationScope.schemaUrl
          })
        }
        V = X.next()
      }
      let F = (0, KOA.createResource)(Y),
        K = {
          resource: F,
          scopeSpans: W,
          schemaUrl: F.schemaUrl
        };
      G.push(K), I = Z.next()
    }
    return G
  }
})
// @from(Start 10529460, End 10530021)
TK2 = z((OK2) => {
  Object.defineProperty(OK2, "__esModule", {
    value: !0
  });
  OK2.ProtobufTraceSerializer = void 0;
  var MK2 = C41(),
    b$5 = bB0(),
    f$5 = MK2.opentelemetry.proto.collector.trace.v1.ExportTraceServiceResponse,
    h$5 = MK2.opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest;
  OK2.ProtobufTraceSerializer = {
    serializeRequest: (A) => {
      let Q = (0, b$5.createExportTraceServiceRequest)(A);
      return h$5.encode(Q).finish()
    },
    deserializeResponse: (A) => {
      return f$5.decode(A)
    }
  }
})
// @from(Start 10530027, End 10530324)
PK2 = z((fB0) => {
  Object.defineProperty(fB0, "__esModule", {
    value: !0
  });
  fB0.ProtobufTraceSerializer = void 0;
  var g$5 = TK2();
  Object.defineProperty(fB0, "ProtobufTraceSerializer", {
    enumerable: !0,
    get: function() {
      return g$5.ProtobufTraceSerializer
    }
  })
})
// @from(Start 10530330, End 10530841)
_K2 = z((jK2) => {
  Object.defineProperty(jK2, "__esModule", {
    value: !0
  });
  jK2.JsonLogsSerializer = void 0;
  var m$5 = _B0();
  jK2.JsonLogsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, m$5.createExportLogsServiceRequest)(A, {
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
// @from(Start 10530847, End 10531129)
kK2 = z((hB0) => {
  Object.defineProperty(hB0, "__esModule", {
    value: !0
  });
  hB0.JsonLogsSerializer = void 0;
  var d$5 = _K2();
  Object.defineProperty(hB0, "JsonLogsSerializer", {
    enumerable: !0,
    get: function() {
      return d$5.JsonLogsSerializer
    }
  })
})
// @from(Start 10531135, End 10531637)
vK2 = z((yK2) => {
  Object.defineProperty(yK2, "__esModule", {
    value: !0
  });
  yK2.JsonMetricsSerializer = void 0;
  var p$5 = xB0();
  yK2.JsonMetricsSerializer = {
    serializeRequest: (A) => {
      let Q = (0, p$5.createExportMetricsServiceRequest)([A], {
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
// @from(Start 10531643, End 10531934)
bK2 = z((gB0) => {
  Object.defineProperty(gB0, "__esModule", {
    value: !0
  });
  gB0.JsonMetricsSerializer = void 0;
  var l$5 = vK2();
  Object.defineProperty(gB0, "JsonMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return l$5.JsonMetricsSerializer
    }
  })
})
// @from(Start 10531940, End 10532454)
gK2 = z((fK2) => {
  Object.defineProperty(fK2, "__esModule", {
    value: !0
  });
  fK2.JsonTraceSerializer = void 0;
  var n$5 = bB0();
  fK2.JsonTraceSerializer = {
    serializeRequest: (A) => {
      let Q = (0, n$5.createExportTraceServiceRequest)(A, {
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
// @from(Start 10532460, End 10532745)
uK2 = z((uB0) => {
  Object.defineProperty(uB0, "__esModule", {
    value: !0
  });
  uB0.JsonTraceSerializer = void 0;
  var a$5 = gK2();
  Object.defineProperty(uB0, "JsonTraceSerializer", {
    enumerable: !0,
    get: function() {
      return a$5.JsonTraceSerializer
    }
  })
})
// @from(Start 10532751, End 10534013)
tk = z((gi) => {
  Object.defineProperty(gi, "__esModule", {
    value: !0
  });
  gi.JsonTraceSerializer = gi.JsonMetricsSerializer = gi.JsonLogsSerializer = gi.ProtobufTraceSerializer = gi.ProtobufMetricsSerializer = gi.ProtobufLogsSerializer = void 0;
  var r$5 = GK2();
  Object.defineProperty(gi, "ProtobufLogsSerializer", {
    enumerable: !0,
    get: function() {
      return r$5.ProtobufLogsSerializer
    }
  });
  var o$5 = UK2();
  Object.defineProperty(gi, "ProtobufMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return o$5.ProtobufMetricsSerializer
    }
  });
  var t$5 = PK2();
  Object.defineProperty(gi, "ProtobufTraceSerializer", {
    enumerable: !0,
    get: function() {
      return t$5.ProtobufTraceSerializer
    }
  });
  var e$5 = kK2();
  Object.defineProperty(gi, "JsonLogsSerializer", {
    enumerable: !0,
    get: function() {
      return e$5.JsonLogsSerializer
    }
  });
  var Aw5 = bK2();
  Object.defineProperty(gi, "JsonMetricsSerializer", {
    enumerable: !0,
    get: function() {
      return Aw5.JsonMetricsSerializer
    }
  });
  var Qw5 = uK2();
  Object.defineProperty(gi, "JsonTraceSerializer", {
    enumerable: !0,
    get: function() {
      return Qw5.JsonTraceSerializer
    }
  })
})
// @from(Start 10534019, End 10534155)
cK2 = z((mK2) => {
  Object.defineProperty(mK2, "__esModule", {
    value: !0
  });
  mK2.VERSION = void 0;
  mK2.VERSION = "0.204.0"
})
// @from(Start 10534161, End 10534627)
iK2 = z((pK2) => {
  Object.defineProperty(pK2, "__esModule", {
    value: !0
  });
  pK2.validateAndNormalizeHeaders = void 0;
  var Gw5 = K9();

  function Zw5(A) {
    return () => {
      let Q = {};
      return Object.entries(A?.() ?? {}).forEach(([B, G]) => {
        if (typeof G < "u") Q[B] = String(G);
        else Gw5.diag.warn(`Header "${B}" has invalid value (${G}) and will be ignored`)
      }), Q
    }
  }
  pK2.validateAndNormalizeHeaders = Zw5
})
// @from(Start 10534633, End 10536218)
mB0 = z((sK2) => {
  Object.defineProperty(sK2, "__esModule", {
    value: !0
  });
  sK2.getHttpConfigurationDefaults = sK2.mergeOtlpHttpConfigurationWithDefaults = sK2.httpAgentFactoryFromOptions = void 0;
  var nK2 = JOA(),
    Iw5 = iK2();

  function Yw5(A, Q, B) {
    let G = {
        ...B()
      },
      Z = {};
    return () => {
      if (Q != null) Object.assign(Z, Q());
      if (A != null) Object.assign(Z, A());
      return Object.assign(Z, G)
    }
  }

  function Jw5(A) {
    if (A == null) return;
    try {
      let Q = globalThis.location?.href;
      return new URL(A, Q).href
    } catch {
      throw Error(`Configuration: Could not parse user-provided export URL: '${A}'`)
    }
  }

  function aK2(A) {
    return async (Q) => {
      let B = Q === "http:" ? import("http") : import("https"),
        {
          Agent: G
        } = await B;
      return new G(A)
    }
  }
  sK2.httpAgentFactoryFromOptions = aK2;

  function Ww5(A, Q, B) {
    return {
      ...(0, nK2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      headers: Yw5((0, Iw5.validateAndNormalizeHeaders)(A.headers), Q.headers, B.headers),
      url: Jw5(A.url) ?? Q.url ?? B.url,
      agentFactory: A.agentFactory ?? Q.agentFactory ?? B.agentFactory
    }
  }
  sK2.mergeOtlpHttpConfigurationWithDefaults = Ww5;

  function Xw5(A, Q) {
    return {
      ...(0, nK2.getSharedConfigurationDefaults)(),
      headers: () => A,
      url: "http://localhost:4318/" + Q,
      agentFactory: aK2({
        keepAlive: !0
      })
    }
  }
  sK2.getHttpConfigurationDefaults = Xw5
})
// @from(Start 10536224, End 10536742)
eK2 = z((oK2) => {
  Object.defineProperty(oK2, "__esModule", {
    value: !0
  });
  oK2.parseRetryAfterToMills = oK2.isExportRetryable = void 0;

  function Kw5(A) {
    return [429, 502, 503, 504].includes(A)
  }
  oK2.isExportRetryable = Kw5;

  function Dw5(A) {
    if (A == null) return;
    let Q = Number.parseInt(A, 10);
    if (Number.isInteger(Q)) return Q > 0 ? Q * 1000 : -1;
    let B = new Date(A).getTime() - Date.now();
    if (B >= 0) return B;
    return 0
  }
  oK2.parseRetryAfterToMills = Dw5
})
// @from(Start 10536748, End 10538612)
ZD2 = z((BD2) => {
  Object.defineProperty(BD2, "__esModule", {
    value: !0
  });
  BD2.compressAndSend = BD2.sendWithHttp = void 0;
  var Cw5 = UA("zlib"),
    Ew5 = UA("stream"),
    AD2 = eK2(),
    zw5 = J41();

  function Uw5(A, Q, B, G, Z, I) {
    let Y = new URL(Q.url),
      J = {
        hostname: Y.hostname,
        port: Y.port,
        path: Y.pathname,
        method: "POST",
        headers: {
          ...Q.headers()
        },
        agent: B
      },
      W = A(J, (X) => {
        let V = [];
        X.on("data", (F) => V.push(F)), X.on("end", () => {
          if (X.statusCode && X.statusCode < 299) Z({
            status: "success",
            data: Buffer.concat(V)
          });
          else if (X.statusCode && (0, AD2.isExportRetryable)(X.statusCode)) Z({
            status: "retryable",
            retryInMillis: (0, AD2.parseRetryAfterToMills)(X.headers["retry-after"])
          });
          else {
            let F = new zw5.OTLPExporterError(X.statusMessage, X.statusCode, Buffer.concat(V).toString());
            Z({
              status: "failure",
              error: F
            })
          }
        })
      });
    W.setTimeout(I, () => {
      W.destroy(), Z({
        status: "failure",
        error: Error("Request Timeout")
      })
    }), W.on("error", (X) => {
      Z({
        status: "failure",
        error: X
      })
    }), QD2(W, Q.compression, G, (X) => {
      Z({
        status: "failure",
        error: X
      })
    })
  }
  BD2.sendWithHttp = Uw5;

  function QD2(A, Q, B, G) {
    let Z = $w5(B);
    if (Q === "gzip") A.setHeader("Content-Encoding", "gzip"), Z = Z.on("error", G).pipe(Cw5.createGzip()).on("error", G);
    Z.pipe(A).on("error", G)
  }
  BD2.compressAndSend = QD2;

  function $w5(A) {
    let Q = new Ew5.Readable;
    return Q.push(A), Q.push(null), Q
  }
})
// @from(Start 10538618, End 10539704)
WD2 = z((YD2) => {
  Object.defineProperty(YD2, "__esModule", {
    value: !0
  });
  YD2.createHttpExporterTransport = void 0;
  var qw5 = ZD2();
  class ID2 {
    _parameters;
    _utils = null;
    constructor(A) {
      this._parameters = A
    }
    async send(A, Q) {
      let {
        agent: B,
        request: G
      } = await this._loadUtils();
      return new Promise((Z) => {
        (0, qw5.sendWithHttp)(G, this._parameters, B, A, (I) => {
          Z(I)
        }, Q)
      })
    }
    shutdown() {}
    async _loadUtils() {
      let A = this._utils;
      if (A === null) {
        let Q = new URL(this._parameters.url).protocol,
          [B, G] = await Promise.all([this._parameters.agentFactory(Q), Nw5(Q)]);
        A = this._utils = {
          agent: B,
          request: G
        }
      }
      return A
    }
  }
  async function Nw5(A) {
    let Q = A === "http:" ? import("http") : import("https"),
      {
        request: B
      } = await Q;
    return B
  }

  function Lw5(A) {
    return new ID2(A)
  }
  YD2.createHttpExporterTransport = Lw5
})
// @from(Start 10539710, End 10540821)
DD2 = z((FD2) => {
  Object.defineProperty(FD2, "__esModule", {
    value: !0
  });
  FD2.createRetryingTransport = void 0;
  var Mw5 = 5,
    Ow5 = 1000,
    Rw5 = 5000,
    Tw5 = 1.5,
    XD2 = 0.2;

  function Pw5() {
    return Math.random() * (2 * XD2) - XD2
  }
  class VD2 {
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
        Z = Mw5,
        I = Ow5;
      while (G.status === "retryable" && Z > 0) {
        Z--;
        let Y = Math.max(Math.min(I, Rw5) + Pw5(), 0);
        I = I * Tw5;
        let J = G.retryInMillis ?? Y,
          W = B - Date.now();
        if (J > W) return G;
        G = await this.retry(A, W, J)
      }
      return G
    }
    shutdown() {
      return this._transport.shutdown()
    }
  }

  function jw5(A) {
    return new VD2(A.transport)
  }
  FD2.createRetryingTransport = jw5
})
// @from(Start 10540827, End 10541406)
ED2 = z((HD2) => {
  Object.defineProperty(HD2, "__esModule", {
    value: !0
  });
  HD2.createOtlpHttpExportDelegate = void 0;
  var Sw5 = IB0(),
    _w5 = WD2(),
    kw5 = ZB0(),
    yw5 = DD2();

  function xw5(A, Q) {
    return (0, Sw5.createOtlpExportDelegate)({
      transport: (0, yw5.createRetryingTransport)({
        transport: (0, _w5.createHttpExporterTransport)(A)
      }),
      serializer: Q,
      promiseHandler: (0, kw5.createBoundedQueueExportPromiseHandler)(A)
    }, {
      timeout: A.timeoutMillis
    })
  }
  HD2.createOtlpHttpExportDelegate = xw5
})
// @from(Start 10541412, End 10542549)
dB0 = z((wD2) => {
  Object.defineProperty(wD2, "__esModule", {
    value: !0
  });
  wD2.getSharedConfigurationFromEnvironment = void 0;
  var $D2 = K9();

  function zD2(A) {
    let Q = process.env[A]?.trim();
    if (Q != null && Q !== "") {
      let B = Number(Q);
      if (Number.isFinite(B) && B > 0) return B;
      $D2.diag.warn(`Configuration: ${A} is invalid, expected number greater than 0 (actual: ${Q})`)
    }
    return
  }

  function vw5(A) {
    let Q = zD2(`OTEL_EXPORTER_OTLP_${A}_TIMEOUT`),
      B = zD2("OTEL_EXPORTER_OTLP_TIMEOUT");
    return Q ?? B
  }

  function UD2(A) {
    let Q = process.env[A]?.trim();
    if (Q === "") return;
    if (Q == null || Q === "none" || Q === "gzip") return Q;
    $D2.diag.warn(`Configuration: ${A} is invalid, expected 'none' or 'gzip' (actual: '${Q}')`);
    return
  }

  function bw5(A) {
    let Q = UD2(`OTEL_EXPORTER_OTLP_${A}_COMPRESSION`),
      B = UD2("OTEL_EXPORTER_OTLP_COMPRESSION");
    return Q ?? B
  }

  function fw5(A) {
    return {
      timeoutMillis: vw5(A),
      compression: bw5(A)
    }
  }
  wD2.getSharedConfigurationFromEnvironment = fw5
})
// @from(Start 10542555, End 10544417)
MD2 = z((ND2) => {
  Object.defineProperty(ND2, "__esModule", {
    value: !0
  });
  ND2.getHttpConfigurationFromEnvironment = void 0;
  var ui = e6(),
    cB0 = K9(),
    hw5 = dB0(),
    gw5 = JOA();

  function uw5(A) {
    let Q = (0, ui.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_HEADERS`),
      B = (0, ui.getStringFromEnv)("OTEL_EXPORTER_OTLP_HEADERS"),
      G = (0, ui.parseKeyPairsIntoRecord)(Q),
      Z = (0, ui.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    return Object.assign({}, (0, ui.parseKeyPairsIntoRecord)(B), (0, ui.parseKeyPairsIntoRecord)(Q))
  }

  function mw5(A) {
    try {
      return new URL(A).toString()
    } catch {
      cB0.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
      return
    }
  }

  function dw5(A, Q) {
    try {
      new URL(A)
    } catch {
      cB0.diag.warn(`Configuration: Could not parse environment-provided export URL: '${A}', falling back to undefined`);
      return
    }
    if (!A.endsWith("/")) A = A + "/";
    A += Q;
    try {
      new URL(A)
    } catch {
      cB0.diag.warn(`Configuration: Provided URL appended with '${Q}' is not a valid URL, using 'undefined' instead of '${A}'`);
      return
    }
    return A
  }

  function cw5(A) {
    let Q = (0, ui.getStringFromEnv)("OTEL_EXPORTER_OTLP_ENDPOINT");
    if (Q === void 0) return;
    return dw5(Q, A)
  }

  function pw5(A) {
    let Q = (0, ui.getStringFromEnv)(`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`);
    if (Q === void 0) return;
    return mw5(Q)
  }

  function lw5(A, Q) {
    return {
      ...(0, hw5.getSharedConfigurationFromEnvironment)(A),
      url: pw5(A) ?? cw5(Q),
      headers: (0, gw5.wrapStaticHeadersInFunction)(uw5(A))
    }
  }
  ND2.getHttpConfigurationFromEnvironment = lw5
})
// @from(Start 10544423, End 10545457)
TD2 = z((OD2) => {
  Object.defineProperty(OD2, "__esModule", {
    value: !0
  });
  OD2.convertLegacyHttpOptions = void 0;
  var pB0 = mB0(),
    iw5 = MD2(),
    nw5 = K9(),
    aw5 = JOA();

  function sw5(A) {
    if (typeof A.httpAgentOptions === "function") return A.httpAgentOptions;
    let Q = A.httpAgentOptions;
    if (A.keepAlive != null) Q = {
      keepAlive: A.keepAlive,
      ...Q
    };
    if (Q != null) return (0, pB0.httpAgentFactoryFromOptions)(Q);
    else return
  }

  function rw5(A, Q, B, G) {
    if (A.metadata) nw5.diag.warn("Metadata cannot be set when using http");
    return (0, pB0.mergeOtlpHttpConfigurationWithDefaults)({
      url: A.url,
      headers: (0, aw5.wrapStaticHeadersInFunction)(A.headers),
      concurrencyLimit: A.concurrencyLimit,
      timeoutMillis: A.timeoutMillis,
      compression: A.compression,
      agentFactory: sw5(A)
    }, (0, iw5.getHttpConfigurationFromEnvironment)(Q, B), (0, pB0.getHttpConfigurationDefaults)(G, B))
  }
  OD2.convertLegacyHttpOptions = rw5
})
// @from(Start 10545463, End 10546437)
mi = z((sYA) => {
  Object.defineProperty(sYA, "__esModule", {
    value: !0
  });
  sYA.convertLegacyHttpOptions = sYA.getSharedConfigurationFromEnvironment = sYA.createOtlpHttpExportDelegate = sYA.httpAgentFactoryFromOptions = void 0;
  var ow5 = mB0();
  Object.defineProperty(sYA, "httpAgentFactoryFromOptions", {
    enumerable: !0,
    get: function() {
      return ow5.httpAgentFactoryFromOptions
    }
  });
  var tw5 = ED2();
  Object.defineProperty(sYA, "createOtlpHttpExportDelegate", {
    enumerable: !0,
    get: function() {
      return tw5.createOtlpHttpExportDelegate
    }
  });
  var ew5 = dB0();
  Object.defineProperty(sYA, "getSharedConfigurationFromEnvironment", {
    enumerable: !0,
    get: function() {
      return ew5.getSharedConfigurationFromEnvironment
    }
  });
  var Aq5 = TD2();
  Object.defineProperty(sYA, "convertLegacyHttpOptions", {
    enumerable: !0,
    get: function() {
      return Aq5.convertLegacyHttpOptions
    }
  })
})
// @from(Start 10546443, End 10547049)
kD2 = z((SD2) => {
  Object.defineProperty(SD2, "__esModule", {
    value: !0
  });
  SD2.OTLPMetricExporter = void 0;
  var Bq5 = WB0(),
    Gq5 = tk(),
    Zq5 = cK2(),
    PD2 = mi(),
    Iq5 = {
      "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Zq5.VERSION}`
    };
  class jD2 extends Bq5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, PD2.createOtlpHttpExportDelegate)((0, PD2.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
        ...Iq5,
        "Content-Type": "application/json"
      }), Gq5.JsonMetricsSerializer), A)
    }
  }
  SD2.OTLPMetricExporter = jD2
})
// @from(Start 10547055, End 10547337)
yD2 = z((lB0) => {
  Object.defineProperty(lB0, "__esModule", {
    value: !0
  });
  lB0.OTLPMetricExporter = void 0;
  var Yq5 = kD2();
  Object.defineProperty(lB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Yq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10547343, End 10547625)
xD2 = z((iB0) => {
  Object.defineProperty(iB0, "__esModule", {
    value: !0
  });
  iB0.OTLPMetricExporter = void 0;
  var Wq5 = yD2();
  Object.defineProperty(iB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Wq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10547631, End 10548912)
w41 = z((di) => {
  Object.defineProperty(di, "__esModule", {
    value: !0
  });
  di.OTLPMetricExporterBase = di.LowMemoryTemporalitySelector = di.DeltaTemporalitySelector = di.CumulativeTemporalitySelector = di.AggregationTemporalityPreference = di.OTLPMetricExporter = void 0;
  var Vq5 = xD2();
  Object.defineProperty(di, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Vq5.OTLPMetricExporter
    }
  });
  var Fq5 = BB0();
  Object.defineProperty(di, "AggregationTemporalityPreference", {
    enumerable: !0,
    get: function() {
      return Fq5.AggregationTemporalityPreference
    }
  });
  var $41 = WB0();
  Object.defineProperty(di, "CumulativeTemporalitySelector", {
    enumerable: !0,
    get: function() {
      return $41.CumulativeTemporalitySelector
    }
  });
  Object.defineProperty(di, "DeltaTemporalitySelector", {
    enumerable: !0,
    get: function() {
      return $41.DeltaTemporalitySelector
    }
  });
  Object.defineProperty(di, "LowMemoryTemporalitySelector", {
    enumerable: !0,
    get: function() {
      return $41.LowMemoryTemporalitySelector
    }
  });
  Object.defineProperty(di, "OTLPMetricExporterBase", {
    enumerable: !0,
    get: function() {
      return $41.OTLPMetricExporterBase
    }
  })
})
// @from(Start 10548918, End 10549054)
fD2 = z((vD2) => {
  Object.defineProperty(vD2, "__esModule", {
    value: !0
  });
  vD2.VERSION = void 0;
  vD2.VERSION = "0.204.0"
})
// @from(Start 10549060, End 10549644)
dD2 = z((uD2) => {
  Object.defineProperty(uD2, "__esModule", {
    value: !0
  });
  uD2.OTLPMetricExporter = void 0;
  var Dq5 = w41(),
    Hq5 = tk(),
    Cq5 = fD2(),
    hD2 = mi();
  class gD2 extends Dq5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, hD2.createOtlpHttpExportDelegate)((0, hD2.convertLegacyHttpOptions)(A ?? {}, "METRICS", "v1/metrics", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Cq5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Hq5.ProtobufMetricsSerializer), A)
    }
  }
  uD2.OTLPMetricExporter = gD2
})
// @from(Start 10549650, End 10549932)
cD2 = z((nB0) => {
  Object.defineProperty(nB0, "__esModule", {
    value: !0
  });
  nB0.OTLPMetricExporter = void 0;
  var Eq5 = dD2();
  Object.defineProperty(nB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Eq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10549938, End 10550220)
pD2 = z((aB0) => {
  Object.defineProperty(aB0, "__esModule", {
    value: !0
  });
  aB0.OTLPMetricExporter = void 0;
  var Uq5 = cD2();
  Object.defineProperty(aB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return Uq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10550226, End 10550508)
lD2 = z((sB0) => {
  Object.defineProperty(sB0, "__esModule", {
    value: !0
  });
  sB0.OTLPMetricExporter = void 0;
  var wq5 = pD2();
  Object.defineProperty(sB0, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return wq5.OTLPMetricExporter
    }
  })
})
// @from(Start 10550514, End 10552056)
E6 = z((sD2) => {
  Object.defineProperty(sD2, "__esModule", {
    value: !0
  });
  sD2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = sD2.DEFAULT_MAX_SEND_MESSAGE_LENGTH = sD2.Propagate = sD2.LogVerbosity = sD2.Status = void 0;
  var iD2;
  (function(A) {
    A[A.OK = 0] = "OK", A[A.CANCELLED = 1] = "CANCELLED", A[A.UNKNOWN = 2] = "UNKNOWN", A[A.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", A[A.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", A[A.NOT_FOUND = 5] = "NOT_FOUND", A[A.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", A[A.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", A[A.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", A[A.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", A[A.ABORTED = 10] = "ABORTED", A[A.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", A[A.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", A[A.INTERNAL = 13] = "INTERNAL", A[A.UNAVAILABLE = 14] = "UNAVAILABLE", A[A.DATA_LOSS = 15] = "DATA_LOSS", A[A.UNAUTHENTICATED = 16] = "UNAUTHENTICATED"
  })(iD2 || (sD2.Status = iD2 = {}));
  var nD2;
  (function(A) {
    A[A.DEBUG = 0] = "DEBUG", A[A.INFO = 1] = "INFO", A[A.ERROR = 2] = "ERROR", A[A.NONE = 3] = "NONE"
  })(nD2 || (sD2.LogVerbosity = nD2 = {}));
  var aD2;
  (function(A) {
    A[A.DEADLINE = 1] = "DEADLINE", A[A.CENSUS_STATS_CONTEXT = 2] = "CENSUS_STATS_CONTEXT", A[A.CENSUS_TRACING_CONTEXT = 4] = "CENSUS_TRACING_CONTEXT", A[A.CANCELLATION = 8] = "CANCELLATION", A[A.DEFAULTS = 65535] = "DEFAULTS"
  })(aD2 || (sD2.Propagate = aD2 = {}));
  sD2.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
  sD2.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4194304
})
// @from(Start 10552062, End 10555380)
rB0 = z((DcG, Rq5) => {
  Rq5.exports = {
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
// @from(Start 10555386, End 10557578)
zZ = z((eD2) => {
  var oB0, tB0, eB0, A20;
  Object.defineProperty(eD2, "__esModule", {
    value: !0
  });
  eD2.log = eD2.setLoggerVerbosity = eD2.setLogger = eD2.getLogger = void 0;
  eD2.trace = fq5;
  eD2.isTracerEnabled = tD2;
  var ci = E6(),
    Tq5 = UA("process"),
    Pq5 = rB0().version,
    jq5 = {
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
    s1A = jq5,
    rYA = ci.LogVerbosity.ERROR,
    Sq5 = (tB0 = (oB0 = process.env.GRPC_NODE_VERBOSITY) !== null && oB0 !== void 0 ? oB0 : process.env.GRPC_VERBOSITY) !== null && tB0 !== void 0 ? tB0 : "";
  switch (Sq5.toUpperCase()) {
    case "DEBUG":
      rYA = ci.LogVerbosity.DEBUG;
      break;
    case "INFO":
      rYA = ci.LogVerbosity.INFO;
      break;
    case "ERROR":
      rYA = ci.LogVerbosity.ERROR;
      break;
    case "NONE":
      rYA = ci.LogVerbosity.NONE;
      break;
    default:
  }
  var _q5 = () => {
    return s1A
  };
  eD2.getLogger = _q5;
  var kq5 = (A) => {
    s1A = A
  };
  eD2.setLogger = kq5;
  var yq5 = (A) => {
    rYA = A
  };
  eD2.setLoggerVerbosity = yq5;
  var xq5 = (A, ...Q) => {
    let B;
    if (A >= rYA) {
      switch (A) {
        case ci.LogVerbosity.DEBUG:
          B = s1A.debug;
          break;
        case ci.LogVerbosity.INFO:
          B = s1A.info;
          break;
        case ci.LogVerbosity.ERROR:
          B = s1A.error;
          break
      }
      if (!B) B = s1A.error;
      if (B) B.bind(s1A)(...Q)
    }
  };
  eD2.log = xq5;
  var vq5 = (A20 = (eB0 = process.env.GRPC_NODE_TRACE) !== null && eB0 !== void 0 ? eB0 : process.env.GRPC_TRACE) !== null && A20 !== void 0 ? A20 : "",
    Q20 = new Set,
    oD2 = new Set;
  for (let A of vq5.split(","))
    if (A.startsWith("-")) oD2.add(A.substring(1));
    else Q20.add(A);
  var bq5 = Q20.has("all");

  function fq5(A, Q, B) {
    if (tD2(Q)) eD2.log(A, new Date().toISOString() + " | v" + Pq5 + " " + Tq5.pid + " | " + Q + " | " + B)
  }

  function tD2(A) {
    return !oD2.has(A) && (bq5 || Q20.has(A))
  }
})
// @from(Start 10557584, End 10557973)
q41 = z((AH2) => {
  Object.defineProperty(AH2, "__esModule", {
    value: !0
  });
  AH2.getErrorMessage = cq5;
  AH2.getErrorCode = pq5;

  function cq5(A) {
    if (A instanceof Error) return A.message;
    else return String(A)
  }

  function pq5(A) {
    if (typeof A === "object" && A !== null && "code" in A && typeof A.code === "number") return A.code;
    else return null
  }
})
// @from(Start 10557979, End 10561711)
YK = z((GH2) => {
  Object.defineProperty(GH2, "__esModule", {
    value: !0
  });
  GH2.Metadata = void 0;
  var nq5 = zZ(),
    aq5 = E6(),
    sq5 = q41(),
    rq5 = /^[:0-9a-z_.-]+$/,
    oq5 = /^[ -~]*$/;

  function tq5(A) {
    return rq5.test(A)
  }

  function eq5(A) {
    return oq5.test(A)
  }

  function BH2(A) {
    return A.endsWith("-bin")
  }

  function AN5(A) {
    return !A.startsWith("grpc-")
  }

  function N41(A) {
    return A.toLowerCase()
  }

  function QH2(A, Q) {
    if (!tq5(A)) throw Error('Metadata key "' + A + '" contains illegal characters');
    if (Q !== null && Q !== void 0)
      if (BH2(A)) {
        if (!Buffer.isBuffer(Q)) throw Error("keys that end with '-bin' must have Buffer values")
      } else {
        if (Buffer.isBuffer(Q)) throw Error("keys that don't end with '-bin' must have String values");
        if (!eq5(Q)) throw Error('Metadata string value "' + Q + '" contains illegal characters')
      }
  }
  class L41 {
    constructor(A = {}) {
      this.internalRepr = new Map, this.opaqueData = new Map, this.options = A
    }
    set(A, Q) {
      A = N41(A), QH2(A, Q), this.internalRepr.set(A, [Q])
    }
    add(A, Q) {
      A = N41(A), QH2(A, Q);
      let B = this.internalRepr.get(A);
      if (B === void 0) this.internalRepr.set(A, [Q]);
      else B.push(Q)
    }
    remove(A) {
      A = N41(A), this.internalRepr.delete(A)
    }
    get(A) {
      return A = N41(A), this.internalRepr.get(A) || []
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
      let A = new L41(this.options),
        Q = A.internalRepr;
      for (let [B, G] of this.internalRepr) {
        let Z = G.map((I) => {
          if (Buffer.isBuffer(I)) return Buffer.from(I);
          else return I
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
        A[Q] = B.map(QN5)
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
      let Q = new L41;
      for (let B of Object.keys(A)) {
        if (B.charAt(0) === ":") continue;
        let G = A[B];
        try {
          if (BH2(B)) {
            if (Array.isArray(G)) G.forEach((Z) => {
              Q.add(B, Buffer.from(Z, "base64"))
            });
            else if (G !== void 0)
              if (AN5(B)) G.split(",").forEach((Z) => {
                Q.add(B, Buffer.from(Z.trim(), "base64"))
              });
              else Q.add(B, Buffer.from(G, "base64"))
          } else if (Array.isArray(G)) G.forEach((Z) => {
            Q.add(B, Z)
          });
          else if (G !== void 0) Q.add(B, G)
        } catch (Z) {
          let I = `Failed to add metadata entry ${B}: ${G}. ${(0,sq5.getErrorMessage)(Z)}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
          (0, nq5.log)(aq5.LogVerbosity.ERROR, I)
        }
      }
      return Q
    }
  }
  GH2.Metadata = L41;
  var QN5 = (A) => {
    return Buffer.isBuffer(A) ? A.toString("base64") : A
  }
})
// @from(Start 10561717, End 10564073)
O41 = z((IH2) => {
  Object.defineProperty(IH2, "__esModule", {
    value: !0
  });
  IH2.CallCredentials = void 0;
  var G20 = YK();

  function BN5(A) {
    return "getRequestHeaders" in A && typeof A.getRequestHeaders === "function"
  }
  class oYA {
    static createFromMetadataGenerator(A) {
      return new Z20(A)
    }
    static createFromGoogleCredential(A) {
      return oYA.createFromMetadataGenerator((Q, B) => {
        let G;
        if (BN5(A)) G = A.getRequestHeaders(Q.service_url);
        else G = new Promise((Z, I) => {
          A.getRequestMetadata(Q.service_url, (Y, J) => {
            if (Y) {
              I(Y);
              return
            }
            if (!J) {
              I(Error("Headers not set by metadata plugin"));
              return
            }
            Z(J)
          })
        });
        G.then((Z) => {
          let I = new G20.Metadata;
          for (let Y of Object.keys(Z)) I.add(Y, Z[Y]);
          B(null, I)
        }, (Z) => {
          B(Z)
        })
      })
    }
    static createEmpty() {
      return new I20
    }
  }
  IH2.CallCredentials = oYA;
  class M41 extends oYA {
    constructor(A) {
      super();
      this.creds = A
    }
    async generateMetadata(A) {
      let Q = new G20.Metadata,
        B = await Promise.all(this.creds.map((G) => G.generateMetadata(A)));
      for (let G of B) Q.merge(G);
      return Q
    }
    compose(A) {
      return new M41(this.creds.concat([A]))
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof M41) return this.creds.every((Q, B) => Q._equals(A.creds[B]));
      else return !1
    }
  }
  class Z20 extends oYA {
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
      return new M41([this, A])
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof Z20) return this.metadataGenerator === A.metadataGenerator;
      else return !1
    }
  }
  class I20 extends oYA {
    generateMetadata(A) {
      return Promise.resolve(new G20.Metadata)
    }
    compose(A) {
      return A
    }
    _equals(A) {
      return A instanceof I20
    }
  }
})
// @from(Start 10564079, End 10564513)
J20 = z((WH2) => {
  Object.defineProperty(WH2, "__esModule", {
    value: !0
  });
  WH2.CIPHER_SUITES = void 0;
  WH2.getDefaultRootsData = ZN5;
  var GN5 = UA("fs");
  WH2.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
  var JH2 = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH,
    Y20 = null;

  function ZN5() {
    if (JH2) {
      if (Y20 === null) Y20 = GN5.readFileSync(JH2);
      return Y20
    }
    return null
  }
})
// @from(Start 10564519, End 10566024)
uE = z((FH2) => {
  Object.defineProperty(FH2, "__esModule", {
    value: !0
  });
  FH2.parseUri = JN5;
  FH2.splitHostPort = WN5;
  FH2.combineHostPort = XN5;
  FH2.uriToString = VN5;
  var YN5 = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;

  function JN5(A) {
    let Q = YN5.exec(A);
    if (Q === null) return null;
    return {
      scheme: Q[1],
      authority: Q[2],
      path: Q[3]
    }
  }
  var VH2 = /^\d+$/;

  function WN5(A) {
    if (A.startsWith("[")) {
      let Q = A.indexOf("]");
      if (Q === -1) return null;
      let B = A.substring(1, Q);
      if (B.indexOf(":") === -1) return null;
      if (A.length > Q + 1)
        if (A[Q + 1] === ":") {
          let G = A.substring(Q + 2);
          if (VH2.test(G)) return {
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
        if (VH2.test(Q[1])) return {
          host: Q[0],
          port: +Q[1]
        };
        else return null;
      else return {
        host: A
      }
    }
  }

  function XN5(A) {
    if (A.port === void 0) return A.host;
    else if (A.host.includes(":")) return `[${A.host}]:${A.port}`;
    else return `${A.host}:${A.port}`
  }

  function VN5(A) {
    let Q = "";
    if (A.scheme !== void 0) Q += A.scheme + ":";
    if (A.authority !== void 0) Q += "//" + A.authority + "/";
    return Q += A.path, Q
  }
})
// @from(Start 10566030, End 10567155)
CP = z((KH2) => {
  Object.defineProperty(KH2, "__esModule", {
    value: !0
  });
  KH2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = void 0;
  KH2.registerResolver = CN5;
  KH2.registerDefaultScheme = EN5;
  KH2.createResolver = zN5;
  KH2.getDefaultAuthority = UN5;
  KH2.mapUriDefaultScheme = $N5;
  var X20 = uE();
  KH2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = "grpc.internal.config_selector";
  var tYA = {},
    W20 = null;

  function CN5(A, Q) {
    tYA[A] = Q
  }

  function EN5(A) {
    W20 = A
  }

  function zN5(A, Q, B) {
    if (A.scheme !== void 0 && A.scheme in tYA) return new tYA[A.scheme](A, Q, B);
    else throw Error(`No resolver could be created for target ${(0,X20.uriToString)(A)}`)
  }

  function UN5(A) {
    if (A.scheme !== void 0 && A.scheme in tYA) return tYA[A.scheme].getDefaultAuthority(A);
    else throw Error(`Invalid target ${(0,X20.uriToString)(A)}`)
  }

  function $N5(A) {
    if (A.scheme === void 0 || !(A.scheme in tYA))
      if (W20 !== null) return {
        scheme: W20,
        authority: void 0,
        path: (0, X20.uriToString)(A)
      };
      else return null;
    return A
  }
})
// @from(Start 10567161, End 10577173)
AJA = z((zH2) => {
  Object.defineProperty(zH2, "__esModule", {
    value: !0
  });
  zH2.ChannelCredentials = void 0;
  zH2.createCertificateProviderChannelCredentials = PN5;
  var HOA = UA("tls"),
    P41 = O41(),
    F20 = J20(),
    HH2 = uE(),
    ON5 = CP(),
    RN5 = zZ(),
    TN5 = E6();

  function V20(A, Q) {
    if (A && !(A instanceof Buffer)) throw TypeError(`${Q}, if provided, must be a Buffer.`)
  }
  class eYA {
    compose(A) {
      return new T41(this, A)
    }
    static createSsl(A, Q, B, G) {
      var Z;
      if (V20(A, "Root certificate"), V20(Q, "Private key"), V20(B, "Certificate chain"), Q && !B) throw Error("Private key must be given with accompanying certificate chain");
      if (!Q && B) throw Error("Certificate chain must be given with accompanying private key");
      let I = (0, HOA.createSecureContext)({
        ca: (Z = A !== null && A !== void 0 ? A : (0, F20.getDefaultRootsData)()) !== null && Z !== void 0 ? Z : void 0,
        key: Q !== null && Q !== void 0 ? Q : void 0,
        cert: B !== null && B !== void 0 ? B : void 0,
        ciphers: F20.CIPHER_SUITES
      });
      return new R41(I, G !== null && G !== void 0 ? G : {})
    }
    static createFromSecureContext(A, Q) {
      return new R41(A, Q !== null && Q !== void 0 ? Q : {})
    }
    static createInsecure() {
      return new K20
    }
  }
  zH2.ChannelCredentials = eYA;
  class K20 extends eYA {
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
      return A instanceof K20
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
          return B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty()
        },
        destroy() {}
      }
    }
  }

  function CH2(A, Q, B, G) {
    var Z, I;
    let Y = {
        secureContext: A
      },
      J = B;
    if ("grpc.http_connect_target" in G) {
      let F = (0, HH2.parseUri)(G["grpc.http_connect_target"]);
      if (F) J = F
    }
    let W = (0, ON5.getDefaultAuthority)(J),
      X = (0, HH2.splitHostPort)(W),
      V = (Z = X === null || X === void 0 ? void 0 : X.host) !== null && Z !== void 0 ? Z : W;
    if (Y.host = V, Q.checkServerIdentity) Y.checkServerIdentity = Q.checkServerIdentity;
    if (Q.rejectUnauthorized !== void 0) Y.rejectUnauthorized = Q.rejectUnauthorized;
    if (Y.ALPNProtocols = ["h2"], G["grpc.ssl_target_name_override"]) {
      let F = G["grpc.ssl_target_name_override"],
        K = (I = Y.checkServerIdentity) !== null && I !== void 0 ? I : HOA.checkServerIdentity;
      Y.checkServerIdentity = (D, H) => {
        return K(F, H)
      }, Y.servername = F
    } else Y.servername = V;
    if (G["grpc-node.tls_enable_trace"]) Y.enableTrace = !0;
    return Y
  }
  class EH2 {
    constructor(A, Q) {
      this.connectionOptions = A, this.callCredentials = Q
    }
    connect(A) {
      let Q = Object.assign({
        socket: A
      }, this.connectionOptions);
      return new Promise((B, G) => {
        let Z = (0, HOA.connect)(Q, () => {
          var I;
          if (((I = this.connectionOptions.rejectUnauthorized) !== null && I !== void 0 ? I : !0) && !Z.authorized) {
            G(Z.authorizationError);
            return
          }
          B({
            socket: Z,
            secure: !0
          })
        });
        Z.on("error", (I) => {
          G(I)
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
  class R41 extends eYA {
    constructor(A, Q) {
      super();
      this.secureContext = A, this.verifyOptions = Q
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof R41) return this.secureContext === A.secureContext && this.verifyOptions.checkServerIdentity === A.verifyOptions.checkServerIdentity;
      else return !1
    }
    _createSecureConnector(A, Q, B) {
      let G = CH2(this.secureContext, this.verifyOptions, A, Q);
      return new EH2(G, B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty())
    }
  }
  class DOA extends eYA {
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
      if (A instanceof DOA) return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && ((Q = this.verifyOptions) === null || Q === void 0 ? void 0 : Q.checkServerIdentity) === ((B = A.verifyOptions) === null || B === void 0 ? void 0 : B.checkServerIdentity);
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
      return this.ref(), new DOA.SecureConnectorImpl(this, A, Q, B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty())
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
        return (0, HOA.createSecureContext)({
          ca: this.latestCaUpdate.caCertificate,
          key: (A = this.latestIdentityUpdate) === null || A === void 0 ? void 0 : A.privateKey,
          cert: (Q = this.latestIdentityUpdate) === null || Q === void 0 ? void 0 : Q.certificate,
          ciphers: F20.CIPHER_SUITES
        })
      } catch (B) {
        return (0, RN5.log)(TN5.LogVerbosity.ERROR, "Failed to createSecureContext with error " + B.message), null
      }
    }
  }
  DOA.SecureConnectorImpl = class {
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
        let Z = CH2(G, this.parent.verifyOptions, this.channelTarget, this.options),
          I = Object.assign({
            socket: A
          }, Z),
          Y = () => {
            B(Error("Socket closed"))
          },
          J = (X) => {
            B(X)
          },
          W = (0, HOA.connect)(I, () => {
            var X;
            if (W.removeListener("close", Y), W.removeListener("error", J), ((X = this.parent.verifyOptions.rejectUnauthorized) !== null && X !== void 0 ? X : !0) && !W.authorized) {
              B(W.authorizationError);
              return
            }
            Q({
              socket: W,
              secure: !0
            })
          });
        W.once("close", Y), W.once("error", J)
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

  function PN5(A, Q, B) {
    return new DOA(A, Q, B !== null && B !== void 0 ? B : {})
  }
  class T41 extends eYA {
    constructor(A, Q) {
      super();
      if (this.channelCredentials = A, this.callCredentials = Q, !A._isSecure()) throw Error("Cannot compose insecure credentials")
    }
    compose(A) {
      let Q = this.callCredentials.compose(A);
      return new T41(this.channelCredentials, Q)
    }
    _isSecure() {
      return !0
    }
    _equals(A) {
      if (this === A) return !0;
      if (A instanceof T41) return this.channelCredentials._equals(A.channelCredentials) && this.callCredentials._equals(A.callCredentials);
      else return !1
    }
    _createSecureConnector(A, Q, B) {
      let G = this.callCredentials.compose(B !== null && B !== void 0 ? B : P41.CallCredentials.createEmpty());
      return this.channelCredentials._createSecureConnector(A, Q, G)
    }
  }
})
// @from(Start 10577179, End 10579689)
li = z((wH2) => {
  Object.defineProperty(wH2, "__esModule", {
    value: !0
  });
  wH2.createChildChannelControlHelper = kN5;
  wH2.registerLoadBalancerType = yN5;
  wH2.registerDefaultLoadBalancerType = xN5;
  wH2.createLoadBalancer = vN5;
  wH2.isLoadBalancerNameRegistered = bN5;
  wH2.parseLoadBalancingConfig = $H2;
  wH2.getDefaultConfig = fN5;
  wH2.selectLbConfigFromList = hN5;
  var SN5 = zZ(),
    _N5 = E6();

  function kN5(A, Q) {
    var B, G, Z, I, Y, J, W, X, V, F;
    return {
      createSubchannel: (G = (B = Q.createSubchannel) === null || B === void 0 ? void 0 : B.bind(Q)) !== null && G !== void 0 ? G : A.createSubchannel.bind(A),
      updateState: (I = (Z = Q.updateState) === null || Z === void 0 ? void 0 : Z.bind(Q)) !== null && I !== void 0 ? I : A.updateState.bind(A),
      requestReresolution: (J = (Y = Q.requestReresolution) === null || Y === void 0 ? void 0 : Y.bind(Q)) !== null && J !== void 0 ? J : A.requestReresolution.bind(A),
      addChannelzChild: (X = (W = Q.addChannelzChild) === null || W === void 0 ? void 0 : W.bind(Q)) !== null && X !== void 0 ? X : A.addChannelzChild.bind(A),
      removeChannelzChild: (F = (V = Q.removeChannelzChild) === null || V === void 0 ? void 0 : V.bind(Q)) !== null && F !== void 0 ? F : A.removeChannelzChild.bind(A)
    }
  }
  var pi = {},
    COA = null;

  function yN5(A, Q, B) {
    pi[A] = {
      LoadBalancer: Q,
      LoadBalancingConfig: B
    }
  }

  function xN5(A) {
    COA = A
  }

  function vN5(A, Q) {
    let B = A.getLoadBalancerName();
    if (B in pi) return new pi[B].LoadBalancer(Q);
    else return null
  }

  function bN5(A) {
    return A in pi
  }

  function $H2(A) {
    let Q = Object.keys(A);
    if (Q.length !== 1) throw Error("Provided load balancing config has multiple conflicting entries");
    let B = Q[0];
    if (B in pi) try {
      return pi[B].LoadBalancingConfig.createFromJson(A[B])
    } catch (G) {
      throw Error(`${B}: ${G.message}`)
    } else throw Error(`Unrecognized load balancing config name ${B}`)
  }

  function fN5() {
    if (!COA) throw Error("No default load balancer type registered");
    return new pi[COA].LoadBalancingConfig
  }

  function hN5(A, Q = !1) {
    for (let B of A) try {
      return $H2(B)
    } catch (G) {
      (0, SN5.log)(_N5.LogVerbosity.DEBUG, "Config parsing failed with error", G.message);
      continue
    }
    if (Q)
      if (COA) return new pi[COA].LoadBalancingConfig;
      else return null;
    else return null
  }
})
// @from(Start 10579695, End 10589995)
D20 = z((LH2) => {
  Object.defineProperty(LH2, "__esModule", {
    value: !0
  });
  LH2.validateRetryThrottling = qH2;
  LH2.validateServiceConfig = NH2;
  LH2.extractAndSelectServiceConfig = BL5;
  var nN5 = UA("os"),
    j41 = E6(),
    S41 = /^\d+(\.\d{1,9})?s$/,
    aN5 = "node";

  function sN5(A) {
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

  function rN5(A) {
    if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config retry policy: maxAttempts must be an integer at least 2");
    if (!("initialBackoff" in A) || typeof A.initialBackoff !== "string" || !S41.test(A.initialBackoff)) throw Error("Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s");
    if (!("maxBackoff" in A) || typeof A.maxBackoff !== "string" || !S41.test(A.maxBackoff)) throw Error("Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s");
    if (!("backoffMultiplier" in A) || typeof A.backoffMultiplier !== "number" || A.backoffMultiplier <= 0) throw Error("Invalid method config retry policy: backoffMultiplier must be a number greater than 0");
    if (!(("retryableStatusCodes" in A) && Array.isArray(A.retryableStatusCodes))) throw Error("Invalid method config retry policy: retryableStatusCodes is required");
    if (A.retryableStatusCodes.length === 0) throw Error("Invalid method config retry policy: retryableStatusCodes must be non-empty");
    for (let Q of A.retryableStatusCodes)
      if (typeof Q === "number") {
        if (!Object.values(j41.Status).includes(Q)) throw Error("Invalid method config retry policy: retryableStatusCodes value not in status code range")
      } else if (typeof Q === "string") {
      if (!Object.values(j41.Status).includes(Q.toUpperCase())) throw Error("Invalid method config retry policy: retryableStatusCodes value not a status code name")
    } else throw Error("Invalid method config retry policy: retryableStatusCodes value must be a string or number");
    return {
      maxAttempts: A.maxAttempts,
      initialBackoff: A.initialBackoff,
      maxBackoff: A.maxBackoff,
      backoffMultiplier: A.backoffMultiplier,
      retryableStatusCodes: A.retryableStatusCodes
    }
  }

  function oN5(A) {
    if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config hedging policy: maxAttempts must be an integer at least 2");
    if ("hedgingDelay" in A && (typeof A.hedgingDelay !== "string" || !S41.test(A.hedgingDelay))) throw Error("Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s");
    if ("nonFatalStatusCodes" in A && Array.isArray(A.nonFatalStatusCodes))
      for (let B of A.nonFatalStatusCodes)
        if (typeof B === "number") {
          if (!Object.values(j41.Status).includes(B)) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not in status code range")
        } else if (typeof B === "string") {
      if (!Object.values(j41.Status).includes(B.toUpperCase())) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not a status code name")
    } else throw Error("Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number");
    let Q = {
      maxAttempts: A.maxAttempts
    };
    if (A.hedgingDelay) Q.hedgingDelay = A.hedgingDelay;
    if (A.nonFatalStatusCodes) Q.nonFatalStatusCodes = A.nonFatalStatusCodes;
    return Q
  }

  function tN5(A) {
    var Q;
    let B = {
      name: []
    };
    if (!("name" in A) || !Array.isArray(A.name)) throw Error("Invalid method config: invalid name array");
    for (let G of A.name) B.name.push(sN5(G));
    if ("waitForReady" in A) {
      if (typeof A.waitForReady !== "boolean") throw Error("Invalid method config: invalid waitForReady");
      B.waitForReady = A.waitForReady
    }
    if ("timeout" in A)
      if (typeof A.timeout === "object") {
        if (!("seconds" in A.timeout) || typeof A.timeout.seconds !== "number") throw Error("Invalid method config: invalid timeout.seconds");
        if (!("nanos" in A.timeout) || typeof A.timeout.nanos !== "number") throw Error("Invalid method config: invalid timeout.nanos");
        B.timeout = A.timeout
      } else if (typeof A.timeout === "string" && S41.test(A.timeout)) {
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
      else B.retryPolicy = rN5(A.retryPolicy);
    else if ("hedgingPolicy" in A) B.hedgingPolicy = oN5(A.hedgingPolicy);
    return B
  }

  function qH2(A) {
    if (!("maxTokens" in A) || typeof A.maxTokens !== "number" || A.maxTokens <= 0 || A.maxTokens > 1000) throw Error("Invalid retryThrottling: maxTokens must be a number in (0, 1000]");
    if (!("tokenRatio" in A) || typeof A.tokenRatio !== "number" || A.tokenRatio <= 0) throw Error("Invalid retryThrottling: tokenRatio must be a number greater than 0");
    return {
      maxTokens: +A.maxTokens.toFixed(3),
      tokenRatio: +A.tokenRatio.toFixed(3)
    }
  }

  function eN5(A) {
    if (!(typeof A === "object" && A !== null)) throw Error(`Invalid loadBalancingConfig: unexpected type ${typeof A}`);
    let Q = Object.keys(A);
    if (Q.length > 1) throw Error(`Invalid loadBalancingConfig: unexpected multiple keys ${Q}`);
    if (Q.length === 0) throw Error("Invalid loadBalancingConfig: load balancing policy name required");
    return {
      [Q[0]]: A[Q[0]]
    }
  }

  function NH2(A) {
    let Q = {
      loadBalancingConfig: [],
      methodConfig: []
    };
    if ("loadBalancingPolicy" in A)
      if (typeof A.loadBalancingPolicy === "string") Q.loadBalancingPolicy = A.loadBalancingPolicy;
      else throw Error("Invalid service config: invalid loadBalancingPolicy");
    if ("loadBalancingConfig" in A)
      if (Array.isArray(A.loadBalancingConfig))
        for (let G of A.loadBalancingConfig) Q.loadBalancingConfig.push(eN5(G));
      else throw Error("Invalid service config: invalid loadBalancingConfig");
    if ("methodConfig" in A) {
      if (Array.isArray(A.methodConfig))
        for (let G of A.methodConfig) Q.methodConfig.push(tN5(G))
    }
    if ("retryThrottling" in A) Q.retryThrottling = qH2(A.retryThrottling);
    let B = [];
    for (let G of Q.methodConfig)
      for (let Z of G.name) {
        for (let I of B)
          if (Z.service === I.service && Z.method === I.method) throw Error(`Invalid service config: duplicate name ${Z.service}/${Z.method}`);
        B.push(Z)
      }
    return Q
  }

  function AL5(A) {
    if (!("serviceConfig" in A)) throw Error("Invalid service config choice: missing service config");
    let Q = {
      serviceConfig: NH2(A.serviceConfig)
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

  function QL5(A, Q) {
    if (!Array.isArray(A)) throw Error("Invalid service config list");
    for (let B of A) {
      let G = AL5(B);
      if (typeof G.percentage === "number" && Q > G.percentage) continue;
      if (Array.isArray(G.clientHostname)) {
        let Z = !1;
        for (let I of G.clientHostname)
          if (I === nN5.hostname()) Z = !0;
        if (!Z) continue
      }
      if (Array.isArray(G.clientLanguage)) {
        let Z = !1;
        for (let I of G.clientLanguage)
          if (I === aN5) Z = !0;
        if (!Z) continue
      }
      return G.serviceConfig
    }
    throw Error("No matching service config found")
  }

  function BL5(A, Q) {
    for (let B of A)
      if (B.length > 0 && B[0].startsWith("grpc_config=")) {
        let G = B.join("").substring(12),
          Z = JSON.parse(G);
        return QL5(Z, Q)
      } return null
  }
})
// @from(Start 10590001, End 10590367)
mE = z((OH2) => {
  Object.defineProperty(OH2, "__esModule", {
    value: !0
  });
  OH2.ConnectivityState = void 0;
  var MH2;
  (function(A) {
    A[A.IDLE = 0] = "IDLE", A[A.CONNECTING = 1] = "CONNECTING", A[A.READY = 2] = "READY", A[A.TRANSIENT_FAILURE = 3] = "TRANSIENT_FAILURE", A[A.SHUTDOWN = 4] = "SHUTDOWN"
  })(MH2 || (OH2.ConnectivityState = MH2 = {}))
})
// @from(Start 10590373, End 10591740)
Ph = z((jH2) => {
  Object.defineProperty(jH2, "__esModule", {
    value: !0
  });
  jH2.QueuePicker = jH2.UnavailablePicker = jH2.PickResultType = void 0;
  var YL5 = YK(),
    JL5 = E6(),
    _41;
  (function(A) {
    A[A.COMPLETE = 0] = "COMPLETE", A[A.QUEUE = 1] = "QUEUE", A[A.TRANSIENT_FAILURE = 2] = "TRANSIENT_FAILURE", A[A.DROP = 3] = "DROP"
  })(_41 || (jH2.PickResultType = _41 = {}));
  class TH2 {
    constructor(A) {
      this.status = Object.assign({
        code: JL5.Status.UNAVAILABLE,
        details: "No connection established",
        metadata: new YL5.Metadata
      }, A)
    }
    pick(A) {
      return {
        pickResultType: _41.TRANSIENT_FAILURE,
        subchannel: null,
        status: this.status,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  jH2.UnavailablePicker = TH2;
  class PH2 {
    constructor(A, Q) {
      this.loadBalancer = A, this.childPicker = Q, this.calledExitIdle = !1
    }
    pick(A) {
      if (!this.calledExitIdle) process.nextTick(() => {
        this.loadBalancer.exitIdle()
      }), this.calledExitIdle = !0;
      if (this.childPicker) return this.childPicker.pick(A);
      else return {
        pickResultType: _41.QUEUE,
        subchannel: null,
        status: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  jH2.QueuePicker = PH2
})
// @from(Start 10591746, End 10594527)
QJA = z((_H2) => {
  Object.defineProperty(_H2, "__esModule", {
    value: !0
  });
  _H2.BackoffTimeout = void 0;
  var VL5 = E6(),
    FL5 = zZ(),
    KL5 = "backoff",
    DL5 = 1000,
    HL5 = 1.6,
    CL5 = 120000,
    EL5 = 0.2;

  function zL5(A, Q) {
    return Math.random() * (Q - A) + A
  }
  class k41 {
    constructor(A, Q) {
      if (this.callback = A, this.initialDelay = DL5, this.multiplier = HL5, this.maxDelay = CL5, this.jitter = EL5, this.running = !1, this.hasRef = !0, this.startTime = new Date, this.endTime = new Date, this.id = k41.getNextId(), Q) {
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
      FL5.trace(VL5.LogVerbosity.DEBUG, KL5, "{" + this.id + "} " + A)
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
      this.nextDelay = A + zL5(-Q, Q)
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
  _H2.BackoffTimeout = k41;
  k41.nextId = 0
})
// @from(Start 10594533, End 10597722)
y41 = z((xH2) => {
  Object.defineProperty(xH2, "__esModule", {
    value: !0
  });
  xH2.ChildLoadBalancerHandler = void 0;
  var UL5 = li(),
    $L5 = mE(),
    wL5 = "child_load_balancer_helper";
  class yH2 {
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
            if (Q === $L5.ConnectivityState.CONNECTING) return;
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
        let I = new this.ChildPolicyHelper(this),
          Y = (0, UL5.createLoadBalancer)(Q, I);
        if (I.setChild(Y), this.currentChild === null) this.currentChild = Y, Z = this.currentChild;
        else {
          if (this.pendingChild) this.pendingChild.destroy();
          this.pendingChild = Y, Z = this.pendingChild
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
      return wL5
    }
  }
  xH2.ChildLoadBalancerHandler = yH2
})
// @from(Start 10597728, End 10604319)
mH2 = z((gH2) => {
  Object.defineProperty(gH2, "__esModule", {
    value: !0
  });
  gH2.ResolvingLoadBalancer = void 0;
  var qL5 = li(),
    NL5 = D20(),
    tU = mE(),
    bH2 = CP(),
    EOA = Ph(),
    LL5 = QJA(),
    H20 = E6(),
    ML5 = YK(),
    OL5 = zZ(),
    RL5 = E6(),
    TL5 = uE(),
    PL5 = y41(),
    jL5 = "resolving_load_balancer";

  function fH2(A) {
    OL5.trace(RL5.LogVerbosity.DEBUG, jL5, A)
  }
  var SL5 = ["SERVICE_AND_METHOD", "SERVICE", "EMPTY"];

  function _L5(A, Q, B, G) {
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

  function kL5(A, Q, B, G) {
    for (let Z of B)
      if (_L5(A, Q, Z, G)) return Z;
    return null
  }

  function yL5(A) {
    return {
      invoke(Q, B) {
        var G, Z;
        let I = Q.split("/").filter((W) => W.length > 0),
          Y = (G = I[0]) !== null && G !== void 0 ? G : "",
          J = (Z = I[1]) !== null && Z !== void 0 ? Z : "";
        if (A && A.methodConfig)
          for (let W of SL5) {
            let X = kL5(Y, J, A.methodConfig, W);
            if (X) return {
              methodConfig: X,
              pickInformation: {},
              status: H20.Status.OK,
              dynamicFilterFactories: []
            }
          }
        return {
          methodConfig: {
            name: []
          },
          pickInformation: {},
          status: H20.Status.OK,
          dynamicFilterFactories: []
        }
      },
      unref() {}
    }
  }
  class hH2 {
    constructor(A, Q, B, G, Z) {
      if (this.target = A, this.channelControlHelper = Q, this.channelOptions = B, this.onSuccessfulResolution = G, this.onFailedResolution = Z, this.latestChildState = tU.ConnectivityState.IDLE, this.latestChildPicker = new EOA.QueuePicker(this), this.latestChildErrorMessage = null, this.currentState = tU.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1, B["grpc.service_config"]) this.defaultServiceConfig = (0, NL5.validateServiceConfig)(JSON.parse(B["grpc.service_config"]));
      else this.defaultServiceConfig = {
        loadBalancingConfig: [],
        methodConfig: []
      };
      this.updateState(tU.ConnectivityState.IDLE, new EOA.QueuePicker(this), null), this.childLoadBalancer = new PL5.ChildLoadBalancerHandler({
        createSubchannel: Q.createSubchannel.bind(Q),
        requestReresolution: () => {
          if (this.backoffTimeout.isRunning()) fH2("requestReresolution delayed by backoff timer until " + this.backoffTimeout.getEndTime().toISOString()), this.continueResolving = !0;
          else this.updateResolution()
        },
        updateState: (Y, J, W) => {
          this.latestChildState = Y, this.latestChildPicker = J, this.latestChildErrorMessage = W, this.updateState(Y, J, W)
        },
        addChannelzChild: Q.addChannelzChild.bind(Q),
        removeChannelzChild: Q.removeChannelzChild.bind(Q)
      }), this.innerResolver = (0, bH2.createResolver)(A, this.handleResolverResult.bind(this), B);
      let I = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      this.backoffTimeout = new LL5.BackoffTimeout(() => {
        if (this.continueResolving) this.updateResolution(), this.continueResolving = !1;
        else this.updateState(this.latestChildState, this.latestChildPicker, this.latestChildErrorMessage)
      }, I), this.backoffTimeout.unref()
    }
    handleResolverResult(A, Q, B, G) {
      var Z, I;
      this.backoffTimeout.stop(), this.backoffTimeout.reset();
      let Y = !0,
        J = null;
      if (B === null) J = this.defaultServiceConfig;
      else if (B.ok) J = B.value;
      else if (this.previousServiceConfig !== null) J = this.previousServiceConfig;
      else Y = !1, this.handleResolutionFailure(B.error);
      if (J !== null) {
        let W = (Z = J === null || J === void 0 ? void 0 : J.loadBalancingConfig) !== null && Z !== void 0 ? Z : [],
          X = (0, qL5.selectLbConfigFromList)(W, !0);
        if (X === null) Y = !1, this.handleResolutionFailure({
          code: H20.Status.UNAVAILABLE,
          details: "All load balancer options in service config are not compatible",
          metadata: new ML5.Metadata
        });
        else Y = this.childLoadBalancer.updateAddressList(A, X, Object.assign(Object.assign({}, this.channelOptions), Q), G)
      }
      if (Y) this.onSuccessfulResolution(J, (I = Q[bH2.CHANNEL_ARGS_CONFIG_SELECTOR_KEY]) !== null && I !== void 0 ? I : yL5(J));
      return Y
    }
    updateResolution() {
      if (this.innerResolver.updateResolution(), this.currentState === tU.ConnectivityState.IDLE) this.updateState(tU.ConnectivityState.CONNECTING, this.latestChildPicker, this.latestChildErrorMessage);
      this.backoffTimeout.runOnce()
    }
    updateState(A, Q, B) {
      if (fH2((0, TL5.uriToString)(this.target) + " " + tU.ConnectivityState[this.currentState] + " -> " + tU.ConnectivityState[A]), A === tU.ConnectivityState.IDLE) Q = new EOA.QueuePicker(this, Q);
      this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    handleResolutionFailure(A) {
      if (this.latestChildState === tU.ConnectivityState.IDLE) this.updateState(tU.ConnectivityState.TRANSIENT_FAILURE, new EOA.UnavailablePicker(A), A.details), this.onFailedResolution(A)
    }
    exitIdle() {
      if (this.currentState === tU.ConnectivityState.IDLE || this.currentState === tU.ConnectivityState.TRANSIENT_FAILURE)
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
      this.childLoadBalancer.destroy(), this.innerResolver.destroy(), this.backoffTimeout.reset(), this.backoffTimeout.stop(), this.latestChildState = tU.ConnectivityState.IDLE, this.latestChildPicker = new EOA.QueuePicker(this), this.currentState = tU.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1
    }
    getTypeName() {
      return "resolving_load_balancer"
    }
  }
  gH2.ResolvingLoadBalancer = hH2
})
// @from(Start 10604325, End 10605984)
pH2 = z((dH2) => {
  Object.defineProperty(dH2, "__esModule", {
    value: !0
  });
  dH2.recognizedOptions = void 0;
  dH2.channelOptionsEqual = xL5;
  dH2.recognizedOptions = {
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

  function xL5(A, Q) {
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
// @from(Start 10605990, End 10608934)
eU = z((sH2) => {
  Object.defineProperty(sH2, "__esModule", {
    value: !0
  });
  sH2.EndpointMap = void 0;
  sH2.isTcpSubchannelAddress = UOA;
  sH2.subchannelAddressEqual = x41;
  sH2.subchannelAddressToString = iH2;
  sH2.stringToSubchannelAddress = fL5;
  sH2.endpointEqual = hL5;
  sH2.endpointToString = gL5;
  sH2.endpointHasAddress = nH2;
  var lH2 = UA("net");

  function UOA(A) {
    return "port" in A
  }

  function x41(A, Q) {
    if (!A && !Q) return !0;
    if (!A || !Q) return !1;
    if (UOA(A)) return UOA(Q) && A.host === Q.host && A.port === Q.port;
    else return !UOA(Q) && A.path === Q.path
  }

  function iH2(A) {
    if (UOA(A))
      if ((0, lH2.isIPv6)(A.host)) return "[" + A.host + "]:" + A.port;
      else return A.host + ":" + A.port;
    else return A.path
  }
  var bL5 = 443;

  function fL5(A, Q) {
    if ((0, lH2.isIP)(A)) return {
      host: A,
      port: Q !== null && Q !== void 0 ? Q : bL5
    };
    else return {
      path: A
    }
  }

  function hL5(A, Q) {
    if (A.addresses.length !== Q.addresses.length) return !1;
    for (let B = 0; B < A.addresses.length; B++)
      if (!x41(A.addresses[B], Q.addresses[B])) return !1;
    return !0
  }

  function gL5(A) {
    return "[" + A.addresses.map(iH2).join(", ") + "]"
  }

  function nH2(A, Q) {
    for (let B of A.addresses)
      if (x41(B, Q)) return !0;
    return !1
  }

  function zOA(A, Q) {
    if (A.addresses.length !== Q.addresses.length) return !1;
    for (let B of A.addresses) {
      let G = !1;
      for (let Z of Q.addresses)
        if (x41(B, Z)) {
          G = !0;
          break
        } if (!G) return !1
    }
    return !0
  }
  class aH2 {
    constructor() {
      this.map = new Set
    }
    get size() {
      return this.map.size
    }
    getForSubchannelAddress(A) {
      for (let Q of this.map)
        if (nH2(Q.key, A)) return Q.value;
      return
    }
    deleteMissing(A) {
      let Q = [];
      for (let B of this.map) {
        let G = !1;
        for (let Z of A)
          if (zOA(Z, B.key)) G = !0;
        if (!G) Q.push(B.value), this.map.delete(B)
      }
      return Q
    }
    get(A) {
      for (let Q of this.map)
        if (zOA(A, Q.key)) return Q.value;
      return
    }
    set(A, Q) {
      for (let B of this.map)
        if (zOA(A, B.key)) {
          B.value = Q;
          return
        } this.map.add({
        key: A,
        value: Q
      })
    }
    delete(A) {
      for (let Q of this.map)
        if (zOA(A, Q.key)) {
          this.map.delete(Q);
          return
        }
    }
    has(A) {
      for (let Q of this.map)
        if (zOA(A, Q.key)) return !0;
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
  sH2.EndpointMap = aH2
})