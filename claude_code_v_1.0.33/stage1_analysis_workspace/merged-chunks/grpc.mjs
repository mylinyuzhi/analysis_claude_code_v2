
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
// @from(Start 10802909, End 10805977)
Fz2 = z((HpG, mR5) => {
  mR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            nested: {
              Api: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  methods: {
                    rule: "repeated",
                    type: "Method",
                    id: 2
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 3
                  },
                  version: {
                    type: "string",
                    id: 4
                  },
                  sourceContext: {
                    type: "SourceContext",
                    id: 5
                  },
                  mixins: {
                    rule: "repeated",
                    type: "Mixin",
                    id: 6
                  },
                  syntax: {
                    type: "Syntax",
                    id: 7
                  }
                }
              },
              Method: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  requestTypeUrl: {
                    type: "string",
                    id: 2
                  },
                  requestStreaming: {
                    type: "bool",
                    id: 3
                  },
                  responseTypeUrl: {
                    type: "string",
                    id: 4
                  },
                  responseStreaming: {
                    type: "bool",
                    id: 5
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 6
                  },
                  syntax: {
                    type: "Syntax",
                    id: 7
                  }
                }
              },
              Mixin: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  root: {
                    type: "string",
                    id: 2
                  }
                }
              },
              SourceContext: {
                fields: {
                  fileName: {
                    type: "string",
                    id: 1
                  }
                }
              },
              Option: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "Any",
                    id: 2
                  }
                }
              },
              Syntax: {
                values: {
                  SYNTAX_PROTO2: 0,
                  SYNTAX_PROTO3: 1
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10805983, End 10806376)
Kz2 = z((CpG, dR5) => {
  dR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            nested: {
              SourceContext: {
                fields: {
                  fileName: {
                    type: "string",
                    id: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10806382, End 10812007)
Dz2 = z((EpG, cR5) => {
  cR5.exports = {
    nested: {
      google: {
        nested: {
          protobuf: {
            nested: {
              Type: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  fields: {
                    rule: "repeated",
                    type: "Field",
                    id: 2
                  },
                  oneofs: {
                    rule: "repeated",
                    type: "string",
                    id: 3
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 4
                  },
                  sourceContext: {
                    type: "SourceContext",
                    id: 5
                  },
                  syntax: {
                    type: "Syntax",
                    id: 6
                  }
                }
              },
              Field: {
                fields: {
                  kind: {
                    type: "Kind",
                    id: 1
                  },
                  cardinality: {
                    type: "Cardinality",
                    id: 2
                  },
                  number: {
                    type: "int32",
                    id: 3
                  },
                  name: {
                    type: "string",
                    id: 4
                  },
                  typeUrl: {
                    type: "string",
                    id: 6
                  },
                  oneofIndex: {
                    type: "int32",
                    id: 7
                  },
                  packed: {
                    type: "bool",
                    id: 8
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 9
                  },
                  jsonName: {
                    type: "string",
                    id: 10
                  },
                  defaultValue: {
                    type: "string",
                    id: 11
                  }
                },
                nested: {
                  Kind: {
                    values: {
                      TYPE_UNKNOWN: 0,
                      TYPE_DOUBLE: 1,
                      TYPE_FLOAT: 2,
                      TYPE_INT64: 3,
                      TYPE_UINT64: 4,
                      TYPE_INT32: 5,
                      TYPE_FIXED64: 6,
                      TYPE_FIXED32: 7,
                      TYPE_BOOL: 8,
                      TYPE_STRING: 9,
                      TYPE_GROUP: 10,
                      TYPE_MESSAGE: 11,
                      TYPE_BYTES: 12,
                      TYPE_UINT32: 13,
                      TYPE_ENUM: 14,
                      TYPE_SFIXED32: 15,
                      TYPE_SFIXED64: 16,
                      TYPE_SINT32: 17,
                      TYPE_SINT64: 18
                    }
                  },
                  Cardinality: {
                    values: {
                      CARDINALITY_UNKNOWN: 0,
                      CARDINALITY_OPTIONAL: 1,
                      CARDINALITY_REQUIRED: 2,
                      CARDINALITY_REPEATED: 3
                    }
                  }
                }
              },
              Enum: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  enumvalue: {
                    rule: "repeated",
                    type: "EnumValue",
                    id: 2
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 3
                  },
                  sourceContext: {
                    type: "SourceContext",
                    id: 4
                  },
                  syntax: {
                    type: "Syntax",
                    id: 5
                  }
                }
              },
              EnumValue: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  number: {
                    type: "int32",
                    id: 2
                  },
                  options: {
                    rule: "repeated",
                    type: "Option",
                    id: 3
                  }
                }
              },
              Option: {
                fields: {
                  name: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "Any",
                    id: 2
                  }
                }
              },
              Syntax: {
                values: {
                  SYNTAX_PROTO2: 0,
                  SYNTAX_PROTO3: 1
                }
              },
              Any: {
                fields: {
                  type_url: {
                    type: "string",
                    id: 1
                  },
                  value: {
                    type: "bytes",
                    id: 2
                  }
                }
              },
              SourceContext: {
                fields: {
                  fileName: {
                    type: "string",
                    id: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  }
})
// @from(Start 10812013, End 10813707)
$z2 = z((zz2) => {
  Object.defineProperty(zz2, "__esModule", {
    value: !0
  });
  zz2.addCommonProtos = zz2.loadProtosWithOptionsSync = zz2.loadProtosWithOptions = void 0;
  var Hz2 = UA("fs"),
    Cz2 = UA("path"),
    KJA = Z81();

  function Ez2(A, Q) {
    let B = A.resolvePath;
    A.resolvePath = (G, Z) => {
      if (Cz2.isAbsolute(Z)) return Z;
      for (let I of Q) {
        let Y = Cz2.join(I, Z);
        try {
          return Hz2.accessSync(Y, Hz2.constants.R_OK), Y
        } catch (J) {
          continue
        }
      }
      return process.emitWarning(`${Z} not found in any of the include paths ${Q}`), B(G, Z)
    }
  }
  async function pR5(A, Q) {
    let B = new KJA.Root;
    if (Q = Q || {}, Q.includeDirs) {
      if (!Array.isArray(Q.includeDirs)) return Promise.reject(Error("The includeDirs option must be an array"));
      Ez2(B, Q.includeDirs)
    }
    let G = await B.load(A, Q);
    return G.resolveAll(), G
  }
  zz2.loadProtosWithOptions = pR5;

  function lR5(A, Q) {
    let B = new KJA.Root;
    if (Q = Q || {}, Q.includeDirs) {
      if (!Array.isArray(Q.includeDirs)) throw Error("The includeDirs option must be an array");
      Ez2(B, Q.includeDirs)
    }
    let G = B.loadSync(A, Q);
    return G.resolveAll(), G
  }
  zz2.loadProtosWithOptionsSync = lR5;

  function iR5() {
    let A = Fz2(),
      Q = Y90(),
      B = Kz2(),
      G = Dz2();
    KJA.common("api", A.nested.google.nested.protobuf.nested), KJA.common("descriptor", Q.nested.google.nested.protobuf.nested), KJA.common("source_context", B.nested.google.nested.protobuf.nested), KJA.common("type", G.nested.google.nested.protobuf.nested)
  }
  zz2.addCommonProtos = iR5
})
// @from(Start 10813713, End 10830625)
wz2 = z((vOA, W90) => {
  (function(A, Q) {
    function B(G) {
      return "default" in G ? G.default : G
    }
    if (typeof define === "function" && define.amd) define([], function() {
      var G = {};
      return Q(G), B(G)
    });
    else if (typeof vOA === "object") {
      if (Q(vOA), typeof W90 === "object") W90.exports = B(vOA)
    } else(function() {
      var G = {};
      Q(G), A.Long = B(G)
    })()
  })(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : vOA, function(A) {
    Object.defineProperty(A, "__esModule", {
      value: !0
    }), A.default = void 0;
    var Q = null;
    try {
      Q = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
    } catch {}

    function B(l, k, m) {
      this.low = l | 0, this.high = k | 0, this.unsigned = !!m
    }
    B.prototype.__isLong__, Object.defineProperty(B.prototype, "__isLong__", {
      value: !0
    });

    function G(l) {
      return (l && l.__isLong__) === !0
    }

    function Z(l) {
      var k = Math.clz32(l & -l);
      return l ? 31 - k : k
    }
    B.isLong = G;
    var I = {},
      Y = {};

    function J(l, k) {
      var m, o, IA;
      if (k) {
        if (l >>>= 0, IA = 0 <= l && l < 256) {
          if (o = Y[l], o) return o
        }
        if (m = X(l, 0, !0), IA) Y[l] = m;
        return m
      } else {
        if (l |= 0, IA = -128 <= l && l < 128) {
          if (o = I[l], o) return o
        }
        if (m = X(l, l < 0 ? -1 : 0, !1), IA) I[l] = m;
        return m
      }
    }
    B.fromInt = J;

    function W(l, k) {
      if (isNaN(l)) return k ? N : w;
      if (k) {
        if (l < 0) return N;
        if (l >= E) return x
      } else {
        if (l <= -U) return p;
        if (l + 1 >= U) return v
      }
      if (l < 0) return W(-l, k).neg();
      return X(l % C | 0, l / C | 0, k)
    }
    B.fromNumber = W;

    function X(l, k, m) {
      return new B(l, k, m)
    }
    B.fromBits = X;
    var V = Math.pow;

    function F(l, k, m) {
      if (l.length === 0) throw Error("empty string");
      if (typeof k === "number") m = k, k = !1;
      else k = !!k;
      if (l === "NaN" || l === "Infinity" || l === "+Infinity" || l === "-Infinity") return k ? N : w;
      if (m = m || 10, m < 2 || 36 < m) throw RangeError("radix");
      var o;
      if ((o = l.indexOf("-")) > 0) throw Error("interior hyphen");
      else if (o === 0) return F(l.substring(1), k, m).neg();
      var IA = W(V(m, 8)),
        FA = w;
      for (var zA = 0; zA < l.length; zA += 8) {
        var NA = Math.min(8, l.length - zA),
          OA = parseInt(l.substring(zA, zA + NA), m);
        if (NA < 8) {
          var mA = W(V(m, NA));
          FA = FA.mul(mA).add(W(OA))
        } else FA = FA.mul(IA), FA = FA.add(W(OA))
      }
      return FA.unsigned = k, FA
    }
    B.fromString = F;

    function K(l, k) {
      if (typeof l === "number") return W(l, k);
      if (typeof l === "string") return F(l, k);
      return X(l.low, l.high, typeof k === "boolean" ? k : l.unsigned)
    }
    B.fromValue = K;
    var D = 65536,
      H = 16777216,
      C = D * D,
      E = C * C,
      U = E / 2,
      q = J(H),
      w = J(0);
    B.ZERO = w;
    var N = J(0, !0);
    B.UZERO = N;
    var R = J(1);
    B.ONE = R;
    var T = J(1, !0);
    B.UONE = T;
    var y = J(-1);
    B.NEG_ONE = y;
    var v = X(-1, 2147483647, !1);
    B.MAX_VALUE = v;
    var x = X(-1, -1, !0);
    B.MAX_UNSIGNED_VALUE = x;
    var p = X(0, -2147483648, !1);
    B.MIN_VALUE = p;
    var u = B.prototype;
    if (u.toInt = function() {
        return this.unsigned ? this.low >>> 0 : this.low
      }, u.toNumber = function() {
        if (this.unsigned) return (this.high >>> 0) * C + (this.low >>> 0);
        return this.high * C + (this.low >>> 0)
      }, u.toString = function(k) {
        if (k = k || 10, k < 2 || 36 < k) throw RangeError("radix");
        if (this.isZero()) return "0";
        if (this.isNegative())
          if (this.eq(p)) {
            var m = W(k),
              o = this.div(m),
              IA = o.mul(m).sub(this);
            return o.toString(k) + IA.toInt().toString(k)
          } else return "-" + this.neg().toString(k);
        var FA = W(V(k, 6), this.unsigned),
          zA = this,
          NA = "";
        while (!0) {
          var OA = zA.div(FA),
            mA = zA.sub(OA.mul(FA)).toInt() >>> 0,
            wA = mA.toString(k);
          if (zA = OA, zA.isZero()) return wA + NA;
          else {
            while (wA.length < 6) wA = "0" + wA;
            NA = "" + wA + NA
          }
        }
      }, u.getHighBits = function() {
        return this.high
      }, u.getHighBitsUnsigned = function() {
        return this.high >>> 0
      }, u.getLowBits = function() {
        return this.low
      }, u.getLowBitsUnsigned = function() {
        return this.low >>> 0
      }, u.getNumBitsAbs = function() {
        if (this.isNegative()) return this.eq(p) ? 64 : this.neg().getNumBitsAbs();
        var k = this.high != 0 ? this.high : this.low;
        for (var m = 31; m > 0; m--)
          if ((k & 1 << m) != 0) break;
        return this.high != 0 ? m + 33 : m + 1
      }, u.isSafeInteger = function() {
        var k = this.high >> 21;
        if (!k) return !0;
        if (this.unsigned) return !1;
        return k === -1 && !(this.low === 0 && this.high === -2097152)
      }, u.isZero = function() {
        return this.high === 0 && this.low === 0
      }, u.eqz = u.isZero, u.isNegative = function() {
        return !this.unsigned && this.high < 0
      }, u.isPositive = function() {
        return this.unsigned || this.high >= 0
      }, u.isOdd = function() {
        return (this.low & 1) === 1
      }, u.isEven = function() {
        return (this.low & 1) === 0
      }, u.equals = function(k) {
        if (!G(k)) k = K(k);
        if (this.unsigned !== k.unsigned && this.high >>> 31 === 1 && k.high >>> 31 === 1) return !1;
        return this.high === k.high && this.low === k.low
      }, u.eq = u.equals, u.notEquals = function(k) {
        return !this.eq(k)
      }, u.neq = u.notEquals, u.ne = u.notEquals, u.lessThan = function(k) {
        return this.comp(k) < 0
      }, u.lt = u.lessThan, u.lessThanOrEqual = function(k) {
        return this.comp(k) <= 0
      }, u.lte = u.lessThanOrEqual, u.le = u.lessThanOrEqual, u.greaterThan = function(k) {
        return this.comp(k) > 0
      }, u.gt = u.greaterThan, u.greaterThanOrEqual = function(k) {
        return this.comp(k) >= 0
      }, u.gte = u.greaterThanOrEqual, u.ge = u.greaterThanOrEqual, u.compare = function(k) {
        if (!G(k)) k = K(k);
        if (this.eq(k)) return 0;
        var m = this.isNegative(),
          o = k.isNegative();
        if (m && !o) return -1;
        if (!m && o) return 1;
        if (!this.unsigned) return this.sub(k).isNegative() ? -1 : 1;
        return k.high >>> 0 > this.high >>> 0 || k.high === this.high && k.low >>> 0 > this.low >>> 0 ? -1 : 1
      }, u.comp = u.compare, u.negate = function() {
        if (!this.unsigned && this.eq(p)) return p;
        return this.not().add(R)
      }, u.neg = u.negate, u.add = function(k) {
        if (!G(k)) k = K(k);
        var m = this.high >>> 16,
          o = this.high & 65535,
          IA = this.low >>> 16,
          FA = this.low & 65535,
          zA = k.high >>> 16,
          NA = k.high & 65535,
          OA = k.low >>> 16,
          mA = k.low & 65535,
          wA = 0,
          qA = 0,
          KA = 0,
          yA = 0;
        return yA += FA + mA, KA += yA >>> 16, yA &= 65535, KA += IA + OA, qA += KA >>> 16, KA &= 65535, qA += o + NA, wA += qA >>> 16, qA &= 65535, wA += m + zA, wA &= 65535, X(KA << 16 | yA, wA << 16 | qA, this.unsigned)
      }, u.subtract = function(k) {
        if (!G(k)) k = K(k);
        return this.add(k.neg())
      }, u.sub = u.subtract, u.multiply = function(k) {
        if (this.isZero()) return this;
        if (!G(k)) k = K(k);
        if (Q) {
          var m = Q.mul(this.low, this.high, k.low, k.high);
          return X(m, Q.get_high(), this.unsigned)
        }
        if (k.isZero()) return this.unsigned ? N : w;
        if (this.eq(p)) return k.isOdd() ? p : w;
        if (k.eq(p)) return this.isOdd() ? p : w;
        if (this.isNegative())
          if (k.isNegative()) return this.neg().mul(k.neg());
          else return this.neg().mul(k).neg();
        else if (k.isNegative()) return this.mul(k.neg()).neg();
        if (this.lt(q) && k.lt(q)) return W(this.toNumber() * k.toNumber(), this.unsigned);
        var o = this.high >>> 16,
          IA = this.high & 65535,
          FA = this.low >>> 16,
          zA = this.low & 65535,
          NA = k.high >>> 16,
          OA = k.high & 65535,
          mA = k.low >>> 16,
          wA = k.low & 65535,
          qA = 0,
          KA = 0,
          yA = 0,
          oA = 0;
        return oA += zA * wA, yA += oA >>> 16, oA &= 65535, yA += FA * wA, KA += yA >>> 16, yA &= 65535, yA += zA * mA, KA += yA >>> 16, yA &= 65535, KA += IA * wA, qA += KA >>> 16, KA &= 65535, KA += FA * mA, qA += KA >>> 16, KA &= 65535, KA += zA * OA, qA += KA >>> 16, KA &= 65535, qA += o * wA + IA * mA + FA * OA + zA * NA, qA &= 65535, X(yA << 16 | oA, qA << 16 | KA, this.unsigned)
      }, u.mul = u.multiply, u.divide = function(k) {
        if (!G(k)) k = K(k);
        if (k.isZero()) throw Error("division by zero");
        if (Q) {
          if (!this.unsigned && this.high === -2147483648 && k.low === -1 && k.high === -1) return this;
          var m = (this.unsigned ? Q.div_u : Q.div_s)(this.low, this.high, k.low, k.high);
          return X(m, Q.get_high(), this.unsigned)
        }
        if (this.isZero()) return this.unsigned ? N : w;
        var o, IA, FA;
        if (!this.unsigned) {
          if (this.eq(p))
            if (k.eq(R) || k.eq(y)) return p;
            else if (k.eq(p)) return R;
          else {
            var zA = this.shr(1);
            if (o = zA.div(k).shl(1), o.eq(w)) return k.isNegative() ? R : y;
            else return IA = this.sub(k.mul(o)), FA = o.add(IA.div(k)), FA
          } else if (k.eq(p)) return this.unsigned ? N : w;
          if (this.isNegative()) {
            if (k.isNegative()) return this.neg().div(k.neg());
            return this.neg().div(k).neg()
          } else if (k.isNegative()) return this.div(k.neg()).neg();
          FA = w
        } else {
          if (!k.unsigned) k = k.toUnsigned();
          if (k.gt(this)) return N;
          if (k.gt(this.shru(1))) return T;
          FA = N
        }
        IA = this;
        while (IA.gte(k)) {
          o = Math.max(1, Math.floor(IA.toNumber() / k.toNumber()));
          var NA = Math.ceil(Math.log(o) / Math.LN2),
            OA = NA <= 48 ? 1 : V(2, NA - 48),
            mA = W(o),
            wA = mA.mul(k);
          while (wA.isNegative() || wA.gt(IA)) o -= OA, mA = W(o, this.unsigned), wA = mA.mul(k);
          if (mA.isZero()) mA = R;
          FA = FA.add(mA), IA = IA.sub(wA)
        }
        return FA
      }, u.div = u.divide, u.modulo = function(k) {
        if (!G(k)) k = K(k);
        if (Q) {
          var m = (this.unsigned ? Q.rem_u : Q.rem_s)(this.low, this.high, k.low, k.high);
          return X(m, Q.get_high(), this.unsigned)
        }
        return this.sub(this.div(k).mul(k))
      }, u.mod = u.modulo, u.rem = u.modulo, u.not = function() {
        return X(~this.low, ~this.high, this.unsigned)
      }, u.countLeadingZeros = function() {
        return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32
      }, u.clz = u.countLeadingZeros, u.countTrailingZeros = function() {
        return this.low ? Z(this.low) : Z(this.high) + 32
      }, u.ctz = u.countTrailingZeros, u.and = function(k) {
        if (!G(k)) k = K(k);
        return X(this.low & k.low, this.high & k.high, this.unsigned)
      }, u.or = function(k) {
        if (!G(k)) k = K(k);
        return X(this.low | k.low, this.high | k.high, this.unsigned)
      }, u.xor = function(k) {
        if (!G(k)) k = K(k);
        return X(this.low ^ k.low, this.high ^ k.high, this.unsigned)
      }, u.shiftLeft = function(k) {
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        else if (k < 32) return X(this.low << k, this.high << k | this.low >>> 32 - k, this.unsigned);
        else return X(0, this.low << k - 32, this.unsigned)
      }, u.shl = u.shiftLeft, u.shiftRight = function(k) {
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        else if (k < 32) return X(this.low >>> k | this.high << 32 - k, this.high >> k, this.unsigned);
        else return X(this.high >> k - 32, this.high >= 0 ? 0 : -1, this.unsigned)
      }, u.shr = u.shiftRight, u.shiftRightUnsigned = function(k) {
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        if (k < 32) return X(this.low >>> k | this.high << 32 - k, this.high >>> k, this.unsigned);
        if (k === 32) return X(this.high, 0, this.unsigned);
        return X(this.high >>> k - 32, 0, this.unsigned)
      }, u.shru = u.shiftRightUnsigned, u.shr_u = u.shiftRightUnsigned, u.rotateLeft = function(k) {
        var m;
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        if (k === 32) return X(this.high, this.low, this.unsigned);
        if (k < 32) return m = 32 - k, X(this.low << k | this.high >>> m, this.high << k | this.low >>> m, this.unsigned);
        return k -= 32, m = 32 - k, X(this.high << k | this.low >>> m, this.low << k | this.high >>> m, this.unsigned)
      }, u.rotl = u.rotateLeft, u.rotateRight = function(k) {
        var m;
        if (G(k)) k = k.toInt();
        if ((k &= 63) === 0) return this;
        if (k === 32) return X(this.high, this.low, this.unsigned);
        if (k < 32) return m = 32 - k, X(this.high << m | this.low >>> k, this.low << m | this.high >>> k, this.unsigned);
        return k -= 32, m = 32 - k, X(this.low << m | this.high >>> k, this.high << m | this.low >>> k, this.unsigned)
      }, u.rotr = u.rotateRight, u.toSigned = function() {
        if (!this.unsigned) return this;
        return X(this.low, this.high, !1)
      }, u.toUnsigned = function() {
        if (this.unsigned) return this;
        return X(this.low, this.high, !0)
      }, u.toBytes = function(k) {
        return k ? this.toBytesLE() : this.toBytesBE()
      }, u.toBytesLE = function() {
        var k = this.high,
          m = this.low;
        return [m & 255, m >>> 8 & 255, m >>> 16 & 255, m >>> 24, k & 255, k >>> 8 & 255, k >>> 16 & 255, k >>> 24]
      }, u.toBytesBE = function() {
        var k = this.high,
          m = this.low;
        return [k >>> 24, k >>> 16 & 255, k >>> 8 & 255, k & 255, m >>> 24, m >>> 16 & 255, m >>> 8 & 255, m & 255]
      }, B.fromBytes = function(k, m, o) {
        return o ? B.fromBytesLE(k, m) : B.fromBytesBE(k, m)
      }, B.fromBytesLE = function(k, m) {
        return new B(k[0] | k[1] << 8 | k[2] << 16 | k[3] << 24, k[4] | k[5] << 8 | k[6] << 16 | k[7] << 24, m)
      }, B.fromBytesBE = function(k, m) {
        return new B(k[4] << 24 | k[5] << 16 | k[6] << 8 | k[7], k[0] << 24 | k[1] << 16 | k[2] << 8 | k[3], m)
      }, typeof BigInt === "function") B.fromBigInt = function(k, m) {
      var o = Number(BigInt.asIntN(32, k)),
        IA = Number(BigInt.asIntN(32, k >> BigInt(32)));
      return X(o, IA, m)
    }, B.fromValue = function(k, m) {
      if (typeof k === "bigint") return fromBigInt(k, m);
      return K(k, m)
    }, u.toBigInt = function() {
      var k = BigInt(this.low >>> 0),
        m = BigInt(this.unsigned ? this.high >>> 0 : this.high);
      return m << BigInt(32) | k
    };
    var e = A.default = B
  })
})
// @from(Start 10830631, End 10835245)
H90 = z((Rz2) => {
  Object.defineProperty(Rz2, "__esModule", {
    value: !0
  });
  Rz2.loadFileDescriptorSetFromObject = Rz2.loadFileDescriptorSetFromBuffer = Rz2.fromJSON = Rz2.loadSync = Rz2.load = Rz2.IdempotencyLevel = Rz2.isAnyExtension = Rz2.Long = void 0;
  var sR5 = GE2(),
    Iy = Z81(),
    K90 = Vz2(),
    D90 = $z2(),
    rR5 = wz2();
  Rz2.Long = rR5;

  function oR5(A) {
    return "@type" in A && typeof A["@type"] === "string"
  }
  Rz2.isAnyExtension = oR5;
  var Nz2;
  (function(A) {
    A.IDEMPOTENCY_UNKNOWN = "IDEMPOTENCY_UNKNOWN", A.NO_SIDE_EFFECTS = "NO_SIDE_EFFECTS", A.IDEMPOTENT = "IDEMPOTENT"
  })(Nz2 = Rz2.IdempotencyLevel || (Rz2.IdempotencyLevel = {}));
  var Lz2 = {
    longs: String,
    enums: String,
    bytes: String,
    defaults: !0,
    oneofs: !0,
    json: !0
  };

  function tR5(A, Q) {
    if (A === "") return Q;
    else return A + "." + Q
  }

  function eR5(A) {
    return A instanceof Iy.Service || A instanceof Iy.Type || A instanceof Iy.Enum
  }

  function AT5(A) {
    return A instanceof Iy.Namespace || A instanceof Iy.Root
  }

  function Mz2(A, Q) {
    let B = tR5(Q, A.name);
    if (eR5(A)) return [
      [B, A]
    ];
    else if (AT5(A) && typeof A.nested < "u") return Object.keys(A.nested).map((G) => {
      return Mz2(A.nested[G], B)
    }).reduce((G, Z) => G.concat(Z), []);
    return []
  }

  function X90(A, Q) {
    return function(G) {
      return A.toObject(A.decode(G), Q)
    }
  }

  function V90(A) {
    return function(B) {
      if (Array.isArray(B)) throw Error(`Failed to serialize message: expected object with ${A.name} structure, got array instead`);
      let G = A.fromObject(B);
      return A.encode(G).finish()
    }
  }

  function QT5(A) {
    return (A || []).reduce((Q, B) => {
      for (let [G, Z] of Object.entries(B)) switch (G) {
        case "uninterpreted_option":
          Q.uninterpreted_option.push(B.uninterpreted_option);
          break;
        default:
          Q[G] = Z
      }
      return Q
    }, {
      deprecated: !1,
      idempotency_level: Nz2.IDEMPOTENCY_UNKNOWN,
      uninterpreted_option: []
    })
  }

  function BT5(A, Q, B, G) {
    let {
      resolvedRequestType: Z,
      resolvedResponseType: I
    } = A;
    return {
      path: "/" + Q + "/" + A.name,
      requestStream: !!A.requestStream,
      responseStream: !!A.responseStream,
      requestSerialize: V90(Z),
      requestDeserialize: X90(Z, B),
      responseSerialize: V90(I),
      responseDeserialize: X90(I, B),
      originalName: sR5(A.name),
      requestType: F90(Z, B, G),
      responseType: F90(I, B, G),
      options: QT5(A.parsedOptions)
    }
  }

  function GT5(A, Q, B, G) {
    let Z = {};
    for (let I of A.methodsArray) Z[I.name] = BT5(I, Q, B, G);
    return Z
  }

  function F90(A, Q, B) {
    let G = A.toDescriptor("proto3");
    return {
      format: "Protocol Buffer 3 DescriptorProto",
      type: G.$type.toObject(G, Lz2),
      fileDescriptorProtos: B,
      serialize: V90(A),
      deserialize: X90(A, Q)
    }
  }

  function ZT5(A, Q) {
    let B = A.toDescriptor("proto3");
    return {
      format: "Protocol Buffer 3 EnumDescriptorProto",
      type: B.$type.toObject(B, Lz2),
      fileDescriptorProtos: Q
    }
  }

  function IT5(A, Q, B, G) {
    if (A instanceof Iy.Service) return GT5(A, Q, B, G);
    else if (A instanceof Iy.Type) return F90(A, B, G);
    else if (A instanceof Iy.Enum) return ZT5(A, G);
    else throw Error("Type mismatch in reflection object handling")
  }

  function J81(A, Q) {
    let B = {};
    A.resolveAll();
    let Z = A.toDescriptor("proto3").file.map((I) => Buffer.from(K90.FileDescriptorProto.encode(I).finish()));
    for (let [I, Y] of Mz2(A, "")) B[I] = IT5(Y, I, Q, Z);
    return B
  }

  function Oz2(A, Q) {
    Q = Q || {};
    let B = Iy.Root.fromDescriptor(A);
    return B.resolveAll(), J81(B, Q)
  }

  function YT5(A, Q) {
    return (0, D90.loadProtosWithOptions)(A, Q).then((B) => {
      return J81(B, Q)
    })
  }
  Rz2.load = YT5;

  function JT5(A, Q) {
    let B = (0, D90.loadProtosWithOptionsSync)(A, Q);
    return J81(B, Q)
  }
  Rz2.loadSync = JT5;

  function WT5(A, Q) {
    Q = Q || {};
    let B = Iy.Root.fromJSON(A);
    return B.resolveAll(), J81(B, Q)
  }
  Rz2.fromJSON = WT5;

  function XT5(A, Q) {
    let B = K90.FileDescriptorSet.decode(A);
    return Oz2(B, Q)
  }
  Rz2.loadFileDescriptorSetFromBuffer = XT5;

  function VT5(A, Q) {
    let B = K90.FileDescriptorSet.fromObject(A);
    return Oz2(B, Q)
  }
  Rz2.loadFileDescriptorSetFromObject = VT5;
  (0, D90.addCommonProtos)()
})
// @from(Start 10835251, End 10849061)
ti = z((mz2) => {
  var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2204/node_modules/@grpc/grpc-js/build/src";
  Object.defineProperty(mz2, "__esModule", {
    value: !0
  });
  mz2.registerChannelzSocket = mz2.registerChannelzServer = mz2.registerChannelzSubchannel = mz2.registerChannelzChannel = mz2.ChannelzCallTrackerStub = mz2.ChannelzCallTracker = mz2.ChannelzChildrenTrackerStub = mz2.ChannelzChildrenTracker = mz2.ChannelzTrace = mz2.ChannelzTraceStub = void 0;
  mz2.unregisterChannelzRef = qT5;
  mz2.getChannelzHandlers = gz2;
  mz2.getChannelzServiceDefinition = uz2;
  mz2.setup = kT5;
  var X81 = UA("net"),
    G0A = IC2(),
    bOA = mE(),
    fOA = E6(),
    zT5 = eU(),
    UT5 = v41(),
    $T5 = f41();

  function C90(A) {
    return {
      channel_id: A.id,
      name: A.name
    }
  }

  function E90(A) {
    return {
      subchannel_id: A.id,
      name: A.name
    }
  }

  function wT5(A) {
    return {
      server_id: A.id
    }
  }

  function V81(A) {
    return {
      socket_id: A.id,
      name: A.name
    }
  }
  var Pz2 = 32,
    z90 = 100;
  class kz2 {
    constructor() {
      this.events = [], this.creationTimestamp = new Date, this.eventsLogged = 0
    }
    addTrace() {}
    getTraceMessage() {
      return {
        creation_timestamp: Yy(this.creationTimestamp),
        num_events_logged: this.eventsLogged,
        events: []
      }
    }
  }
  mz2.ChannelzTraceStub = kz2;
  class yz2 {
    constructor() {
      this.events = [], this.eventsLogged = 0, this.creationTimestamp = new Date
    }
    addTrace(A, Q, B) {
      let G = new Date;
      if (this.events.push({
          description: Q,
          severity: A,
          timestamp: G,
          childChannel: (B === null || B === void 0 ? void 0 : B.kind) === "channel" ? B : void 0,
          childSubchannel: (B === null || B === void 0 ? void 0 : B.kind) === "subchannel" ? B : void 0
        }), this.events.length >= Pz2 * 2) this.events = this.events.slice(Pz2);
      this.eventsLogged += 1
    }
    getTraceMessage() {
      return {
        creation_timestamp: Yy(this.creationTimestamp),
        num_events_logged: this.eventsLogged,
        events: this.events.map((A) => {
          return {
            description: A.description,
            severity: A.severity,
            timestamp: Yy(A.timestamp),
            channel_ref: A.childChannel ? C90(A.childChannel) : null,
            subchannel_ref: A.childSubchannel ? E90(A.childSubchannel) : null
          }
        })
      }
    }
  }
  mz2.ChannelzTrace = yz2;
  class U90 {
    constructor() {
      this.channelChildren = new G0A.OrderedMap, this.subchannelChildren = new G0A.OrderedMap, this.socketChildren = new G0A.OrderedMap, this.trackerMap = {
        ["channel"]: this.channelChildren,
        ["subchannel"]: this.subchannelChildren,
        ["socket"]: this.socketChildren
      }
    }
    refChild(A) {
      let Q = this.trackerMap[A.kind],
        B = Q.find(A.id);
      if (B.equals(Q.end())) Q.setElement(A.id, {
        ref: A,
        count: 1
      }, B);
      else B.pointer[1].count += 1
    }
    unrefChild(A) {
      let Q = this.trackerMap[A.kind],
        B = Q.getElementByKey(A.id);
      if (B !== void 0) {
        if (B.count -= 1, B.count === 0) Q.eraseElementByKey(A.id)
      }
    }
    getChildLists() {
      return {
        channels: this.channelChildren,
        subchannels: this.subchannelChildren,
        sockets: this.socketChildren
      }
    }
  }
  mz2.ChannelzChildrenTracker = U90;
  class xz2 extends U90 {
    refChild() {}
    unrefChild() {}
  }
  mz2.ChannelzChildrenTrackerStub = xz2;
  class $90 {
    constructor() {
      this.callsStarted = 0, this.callsSucceeded = 0, this.callsFailed = 0, this.lastCallStartedTimestamp = null
    }
    addCallStarted() {
      this.callsStarted += 1, this.lastCallStartedTimestamp = new Date
    }
    addCallSucceeded() {
      this.callsSucceeded += 1
    }
    addCallFailed() {
      this.callsFailed += 1
    }
  }
  mz2.ChannelzCallTracker = $90;
  class vz2 extends $90 {
    addCallStarted() {}
    addCallSucceeded() {}
    addCallFailed() {}
  }
  mz2.ChannelzCallTrackerStub = vz2;
  var vh = {
      ["channel"]: new G0A.OrderedMap,
      ["subchannel"]: new G0A.OrderedMap,
      ["server"]: new G0A.OrderedMap,
      ["socket"]: new G0A.OrderedMap
    },
    F81 = (A) => {
      let Q = 1;

      function B() {
        return Q++
      }
      let G = vh[A];
      return (Z, I, Y) => {
        let J = B(),
          W = {
            id: J,
            name: Z,
            kind: A
          };
        if (Y) G.setElement(J, {
          ref: W,
          getInfo: I
        });
        return W
      }
    };
  mz2.registerChannelzChannel = F81("channel");
  mz2.registerChannelzSubchannel = F81("subchannel");
  mz2.registerChannelzServer = F81("server");
  mz2.registerChannelzSocket = F81("socket");

  function qT5(A) {
    vh[A.kind].eraseElementByKey(A.id)
  }

  function NT5(A) {
    let Q = Number.parseInt(A, 16);
    return [Q / 256 | 0, Q % 256]
  }

  function jz2(A) {
    if (A === "") return [];
    let Q = A.split(":").map((G) => NT5(G));
    return [].concat(...Q)
  }

  function LT5(A) {
    return (0, X81.isIPv6)(A) && A.toLowerCase().startsWith("::ffff:") && (0, X81.isIPv4)(A.substring(7))
  }

  function Sz2(A) {
    return Buffer.from(Uint8Array.from(A.split(".").map((Q) => Number.parseInt(Q))))
  }

  function MT5(A) {
    if ((0, X81.isIPv4)(A)) return Sz2(A);
    else if (LT5(A)) return Sz2(A.substring(7));
    else if ((0, X81.isIPv6)(A)) {
      let Q, B, G = A.indexOf("::");
      if (G === -1) Q = A, B = "";
      else Q = A.substring(0, G), B = A.substring(G + 2);
      let Z = Buffer.from(jz2(Q)),
        I = Buffer.from(jz2(B)),
        Y = Buffer.alloc(16 - Z.length - I.length, 0);
      return Buffer.concat([Z, Y, I])
    } else return null
  }

  function bz2(A) {
    switch (A) {
      case bOA.ConnectivityState.CONNECTING:
        return {
          state: "CONNECTING"
        };
      case bOA.ConnectivityState.IDLE:
        return {
          state: "IDLE"
        };
      case bOA.ConnectivityState.READY:
        return {
          state: "READY"
        };
      case bOA.ConnectivityState.SHUTDOWN:
        return {
          state: "SHUTDOWN"
        };
      case bOA.ConnectivityState.TRANSIENT_FAILURE:
        return {
          state: "TRANSIENT_FAILURE"
        };
      default:
        return {
          state: "UNKNOWN"
        }
    }
  }

  function Yy(A) {
    if (!A) return null;
    let Q = A.getTime();
    return {
      seconds: Q / 1000 | 0,
      nanos: Q % 1000 * 1e6
    }
  }

  function fz2(A) {
    let Q = A.getInfo(),
      B = [],
      G = [];
    return Q.children.channels.forEach((Z) => {
      B.push(C90(Z[1].ref))
    }), Q.children.subchannels.forEach((Z) => {
      G.push(E90(Z[1].ref))
    }), {
      ref: C90(A.ref),
      data: {
        target: Q.target,
        state: bz2(Q.state),
        calls_started: Q.callTracker.callsStarted,
        calls_succeeded: Q.callTracker.callsSucceeded,
        calls_failed: Q.callTracker.callsFailed,
        last_call_started_timestamp: Yy(Q.callTracker.lastCallStartedTimestamp),
        trace: Q.trace.getTraceMessage()
      },
      channel_ref: B,
      subchannel_ref: G
    }
  }

  function OT5(A, Q) {
    let B = parseInt(A.request.channel_id, 10),
      G = vh.channel.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No channel data found for id " + B
      });
      return
    }
    Q(null, {
      channel: fz2(G)
    })
  }

  function RT5(A, Q) {
    let B = parseInt(A.request.max_results, 10) || z90,
      G = [],
      Z = parseInt(A.request.start_channel_id, 10),
      I = vh.channel,
      Y;
    for (Y = I.lowerBound(Z); !Y.equals(I.end()) && G.length < B; Y = Y.next()) G.push(fz2(Y.pointer[1]));
    Q(null, {
      channel: G,
      end: Y.equals(I.end())
    })
  }

  function hz2(A) {
    let Q = A.getInfo(),
      B = [];
    return Q.listenerChildren.sockets.forEach((G) => {
      B.push(V81(G[1].ref))
    }), {
      ref: wT5(A.ref),
      data: {
        calls_started: Q.callTracker.callsStarted,
        calls_succeeded: Q.callTracker.callsSucceeded,
        calls_failed: Q.callTracker.callsFailed,
        last_call_started_timestamp: Yy(Q.callTracker.lastCallStartedTimestamp),
        trace: Q.trace.getTraceMessage()
      },
      listen_socket: B
    }
  }

  function TT5(A, Q) {
    let B = parseInt(A.request.server_id, 10),
      Z = vh.server.getElementByKey(B);
    if (Z === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No server data found for id " + B
      });
      return
    }
    Q(null, {
      server: hz2(Z)
    })
  }

  function PT5(A, Q) {
    let B = parseInt(A.request.max_results, 10) || z90,
      G = parseInt(A.request.start_server_id, 10),
      Z = vh.server,
      I = [],
      Y;
    for (Y = Z.lowerBound(G); !Y.equals(Z.end()) && I.length < B; Y = Y.next()) I.push(hz2(Y.pointer[1]));
    Q(null, {
      server: I,
      end: Y.equals(Z.end())
    })
  }

  function jT5(A, Q) {
    let B = parseInt(A.request.subchannel_id, 10),
      G = vh.subchannel.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No subchannel data found for id " + B
      });
      return
    }
    let Z = G.getInfo(),
      I = [];
    Z.children.sockets.forEach((J) => {
      I.push(V81(J[1].ref))
    });
    let Y = {
      ref: E90(G.ref),
      data: {
        target: Z.target,
        state: bz2(Z.state),
        calls_started: Z.callTracker.callsStarted,
        calls_succeeded: Z.callTracker.callsSucceeded,
        calls_failed: Z.callTracker.callsFailed,
        last_call_started_timestamp: Yy(Z.callTracker.lastCallStartedTimestamp),
        trace: Z.trace.getTraceMessage()
      },
      socket_ref: I
    };
    Q(null, {
      subchannel: Y
    })
  }

  function _z2(A) {
    var Q;
    if ((0, zT5.isTcpSubchannelAddress)(A)) return {
      address: "tcpip_address",
      tcpip_address: {
        ip_address: (Q = MT5(A.host)) !== null && Q !== void 0 ? Q : void 0,
        port: A.port
      }
    };
    else return {
      address: "uds_address",
      uds_address: {
        filename: A.path
      }
    }
  }

  function ST5(A, Q) {
    var B, G, Z, I, Y;
    let J = parseInt(A.request.socket_id, 10),
      W = vh.socket.getElementByKey(J);
    if (W === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No socket data found for id " + J
      });
      return
    }
    let X = W.getInfo(),
      V = X.security ? {
        model: "tls",
        tls: {
          cipher_suite: X.security.cipherSuiteStandardName ? "standard_name" : "other_name",
          standard_name: (B = X.security.cipherSuiteStandardName) !== null && B !== void 0 ? B : void 0,
          other_name: (G = X.security.cipherSuiteOtherName) !== null && G !== void 0 ? G : void 0,
          local_certificate: (Z = X.security.localCertificate) !== null && Z !== void 0 ? Z : void 0,
          remote_certificate: (I = X.security.remoteCertificate) !== null && I !== void 0 ? I : void 0
        }
      } : null,
      F = {
        ref: V81(W.ref),
        local: X.localAddress ? _z2(X.localAddress) : null,
        remote: X.remoteAddress ? _z2(X.remoteAddress) : null,
        remote_name: (Y = X.remoteName) !== null && Y !== void 0 ? Y : void 0,
        security: V,
        data: {
          keep_alives_sent: X.keepAlivesSent,
          streams_started: X.streamsStarted,
          streams_succeeded: X.streamsSucceeded,
          streams_failed: X.streamsFailed,
          last_local_stream_created_timestamp: Yy(X.lastLocalStreamCreatedTimestamp),
          last_remote_stream_created_timestamp: Yy(X.lastRemoteStreamCreatedTimestamp),
          messages_received: X.messagesReceived,
          messages_sent: X.messagesSent,
          last_message_received_timestamp: Yy(X.lastMessageReceivedTimestamp),
          last_message_sent_timestamp: Yy(X.lastMessageSentTimestamp),
          local_flow_control_window: X.localFlowControlWindow ? {
            value: X.localFlowControlWindow
          } : null,
          remote_flow_control_window: X.remoteFlowControlWindow ? {
            value: X.remoteFlowControlWindow
          } : null
        }
      };
    Q(null, {
      socket: F
    })
  }

  function _T5(A, Q) {
    let B = parseInt(A.request.server_id, 10),
      G = vh.server.getElementByKey(B);
    if (G === void 0) {
      Q({
        code: fOA.Status.NOT_FOUND,
        details: "No server data found for id " + B
      });
      return
    }
    let Z = parseInt(A.request.start_socket_id, 10),
      I = parseInt(A.request.max_results, 10) || z90,
      J = G.getInfo().sessionChildren.sockets,
      W = [],
      X;
    for (X = J.lowerBound(Z); !X.equals(J.end()) && W.length < I; X = X.next()) W.push(V81(X.pointer[1].ref));
    Q(null, {
      socket_ref: W,
      end: X.equals(J.end())
    })
  }

  function gz2() {
    return {
      GetChannel: OT5,
      GetTopChannels: RT5,
      GetServer: TT5,
      GetServers: PT5,
      GetSubchannel: jT5,
      GetSocket: ST5,
      GetServerSockets: _T5
    }
  }
  var W81 = null;

  function uz2() {
    if (W81) return W81;
    let A = H90().loadSync,
      Q = A("channelz.proto", {
        keepCase: !0,
        longs: String,
        enums: String,
        defaults: !0,
        oneofs: !0,
        includeDirs: [`${__dirname}/../../proto`]
      });
    return W81 = (0, $T5.loadPackageDefinition)(Q).grpc.channelz.v1.Channelz.service, W81
  }

  function kT5() {
    (0, UT5.registerAdminService)(uz2, gz2)
  }
})
// @from(Start 10849067, End 10849240)
K81 = z((cz2) => {
  Object.defineProperty(cz2, "__esModule", {
    value: !0
  });
  cz2.getNextCallNumber = nT5;
  var iT5 = 0;

  function nT5() {
    return iT5++
  }
})
// @from(Start 10849246, End 10849539)
w90 = z((lz2) => {
  Object.defineProperty(lz2, "__esModule", {
    value: !0
  });
  lz2.CompressionAlgorithms = void 0;
  var pz2;
  (function(A) {
    A[A.identity = 0] = "identity", A[A.deflate = 1] = "deflate", A[A.gzip = 2] = "gzip"
  })(pz2 || (lz2.CompressionAlgorithms = pz2 = {}))
})
// @from(Start 10849545, End 10849939)
q90 = z((az2) => {
  Object.defineProperty(az2, "__esModule", {
    value: !0
  });
  az2.BaseFilter = void 0;
  class nz2 {
    async sendMetadata(A) {
      return A
    }
    receiveMetadata(A) {
      return A
    }
    async sendMessage(A) {
      return A
    }
    async receiveMessage(A) {
      return A
    }
    receiveTrailers(A) {
      return A
    }
  }
  az2.BaseFilter = nz2
})
// @from(Start 10849945, End 10856301)
L90 = z((BU2) => {
  Object.defineProperty(BU2, "__esModule", {
    value: !0
  });
  BU2.CompressionFilterFactory = BU2.CompressionFilter = void 0;
  var D81 = UA("zlib"),
    oz2 = w90(),
    DJA = E6(),
    sT5 = q90(),
    rT5 = zZ(),
    oT5 = (A) => {
      return typeof A === "number" && typeof oz2.CompressionAlgorithms[A] === "string"
    };
  class hOA {
    async writeMessage(A, Q) {
      let B = A;
      if (Q) B = await this.compressMessage(B);
      let G = Buffer.allocUnsafe(B.length + 5);
      return G.writeUInt8(Q ? 1 : 0, 0), G.writeUInt32BE(B.length, 1), B.copy(G, 5), G
    }
    async readMessage(A) {
      let Q = A.readUInt8(0) === 1,
        B = A.slice(5);
      if (Q) B = await this.decompressMessage(B);
      return B
    }
  }
  class HJA extends hOA {
    async compressMessage(A) {
      return A
    }
    async writeMessage(A, Q) {
      let B = Buffer.allocUnsafe(A.length + 5);
      return B.writeUInt8(0, 0), B.writeUInt32BE(A.length, 1), A.copy(B, 5), B
    }
    decompressMessage(A) {
      return Promise.reject(Error('Received compressed message but "grpc-encoding" header was identity'))
    }
  }
  class tz2 extends hOA {
    constructor(A) {
      super();
      this.maxRecvMessageLength = A
    }
    compressMessage(A) {
      return new Promise((Q, B) => {
        D81.deflate(A, (G, Z) => {
          if (G) B(G);
          else Q(Z)
        })
      })
    }
    decompressMessage(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = [],
          I = D81.createInflate();
        I.on("data", (Y) => {
          if (Z.push(Y), G += Y.byteLength, this.maxRecvMessageLength !== -1 && G > this.maxRecvMessageLength) I.destroy(), B({
            code: DJA.Status.RESOURCE_EXHAUSTED,
            details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
          })
        }), I.on("end", () => {
          Q(Buffer.concat(Z))
        }), I.write(A), I.end()
      })
    }
  }
  class ez2 extends hOA {
    constructor(A) {
      super();
      this.maxRecvMessageLength = A
    }
    compressMessage(A) {
      return new Promise((Q, B) => {
        D81.gzip(A, (G, Z) => {
          if (G) B(G);
          else Q(Z)
        })
      })
    }
    decompressMessage(A) {
      return new Promise((Q, B) => {
        let G = 0,
          Z = [],
          I = D81.createGunzip();
        I.on("data", (Y) => {
          if (Z.push(Y), G += Y.byteLength, this.maxRecvMessageLength !== -1 && G > this.maxRecvMessageLength) I.destroy(), B({
            code: DJA.Status.RESOURCE_EXHAUSTED,
            details: `Received message that decompresses to a size larger than ${this.maxRecvMessageLength}`
          })
        }), I.on("end", () => {
          Q(Buffer.concat(Z))
        }), I.write(A), I.end()
      })
    }
  }
  class AU2 extends hOA {
    constructor(A) {
      super();
      this.compressionName = A
    }
    compressMessage(A) {
      return Promise.reject(Error(`Received message compressed with unsupported compression method ${this.compressionName}`))
    }
    decompressMessage(A) {
      return Promise.reject(Error(`Compression method not supported: ${this.compressionName}`))
    }
  }

  function rz2(A, Q) {
    switch (A) {
      case "identity":
        return new HJA;
      case "deflate":
        return new tz2(Q);
      case "gzip":
        return new ez2(Q);
      default:
        return new AU2(A)
    }
  }
  class N90 extends sT5.BaseFilter {
    constructor(A, Q) {
      var B, G, Z;
      super();
      this.sharedFilterConfig = Q, this.sendCompression = new HJA, this.receiveCompression = new HJA, this.currentCompressionAlgorithm = "identity";
      let I = A["grpc.default_compression_algorithm"];
      if (this.maxReceiveMessageLength = (B = A["grpc.max_receive_message_length"]) !== null && B !== void 0 ? B : DJA.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.maxSendMessageLength = (G = A["grpc.max_send_message_length"]) !== null && G !== void 0 ? G : DJA.DEFAULT_MAX_SEND_MESSAGE_LENGTH, I !== void 0)
        if (oT5(I)) {
          let Y = oz2.CompressionAlgorithms[I],
            J = (Z = Q.serverSupportedEncodingHeader) === null || Z === void 0 ? void 0 : Z.split(",");
          if (!J || J.includes(Y)) this.currentCompressionAlgorithm = Y, this.sendCompression = rz2(this.currentCompressionAlgorithm, -1)
        } else rT5.log(DJA.LogVerbosity.ERROR, `Invalid value provided for grpc.default_compression_algorithm option: ${I}`)
    }
    async sendMetadata(A) {
      let Q = await A;
      if (Q.set("grpc-accept-encoding", "identity,deflate,gzip"), Q.set("accept-encoding", "identity"), this.currentCompressionAlgorithm === "identity") Q.remove("grpc-encoding");
      else Q.set("grpc-encoding", this.currentCompressionAlgorithm);
      return Q
    }
    receiveMetadata(A) {
      let Q = A.get("grpc-encoding");
      if (Q.length > 0) {
        let G = Q[0];
        if (typeof G === "string") this.receiveCompression = rz2(G, this.maxReceiveMessageLength)
      }
      A.remove("grpc-encoding");
      let B = A.get("grpc-accept-encoding")[0];
      if (B) {
        if (this.sharedFilterConfig.serverSupportedEncodingHeader = B, !B.split(",").includes(this.currentCompressionAlgorithm)) this.sendCompression = new HJA, this.currentCompressionAlgorithm = "identity"
      }
      return A.remove("grpc-accept-encoding"), A
    }
    async sendMessage(A) {
      var Q;
      let B = await A;
      if (this.maxSendMessageLength !== -1 && B.message.length > this.maxSendMessageLength) throw {
        code: DJA.Status.RESOURCE_EXHAUSTED,
        details: `Attempted to send message with a size larger than ${this.maxSendMessageLength}`
      };
      let G;
      if (this.sendCompression instanceof HJA) G = !1;
      else G = (((Q = B.flags) !== null && Q !== void 0 ? Q : 0) & 2) === 0;
      return {
        message: await this.sendCompression.writeMessage(B.message, G),
        flags: B.flags
      }
    }
    async receiveMessage(A) {
      return this.receiveCompression.readMessage(await A)
    }
  }
  BU2.CompressionFilter = N90;
  class QU2 {
    constructor(A, Q) {
      this.options = Q, this.sharedFilterConfig = {}
    }
    createFilter() {
      return new N90(this.options, this.sharedFilterConfig)
    }
  }
  BU2.CompressionFilterFactory = QU2
})
// @from(Start 10856307, End 10856885)
gOA = z((ZU2) => {
  Object.defineProperty(ZU2, "__esModule", {
    value: !0
  });
  ZU2.restrictControlPlaneStatusCode = AP5;
  var Jy = E6(),
    eT5 = [Jy.Status.OK, Jy.Status.INVALID_ARGUMENT, Jy.Status.NOT_FOUND, Jy.Status.ALREADY_EXISTS, Jy.Status.FAILED_PRECONDITION, Jy.Status.ABORTED, Jy.Status.OUT_OF_RANGE, Jy.Status.DATA_LOSS];

  function AP5(A, Q) {
    if (eT5.includes(A)) return {
      code: Jy.Status.INTERNAL,
      details: `Invalid status from control plane: ${A} ${Jy.Status[A]} ${Q}`
    };
    else return {
      code: A,
      details: Q
    }
  }
})
// @from(Start 10856891, End 10858207)
CJA = z((IU2) => {
  Object.defineProperty(IU2, "__esModule", {
    value: !0
  });
  IU2.minDeadline = BP5;
  IU2.getDeadlineTimeoutString = ZP5;
  IU2.getRelativeTimeout = YP5;
  IU2.deadlineToString = JP5;
  IU2.formatDateDifference = WP5;

  function BP5(...A) {
    let Q = 1 / 0;
    for (let B of A) {
      let G = B instanceof Date ? B.getTime() : B;
      if (G < Q) Q = G
    }
    return Q
  }
  var GP5 = [
    ["m", 1],
    ["S", 1000],
    ["M", 60000],
    ["H", 3600000]
  ];

  function ZP5(A) {
    let Q = new Date().getTime();
    if (A instanceof Date) A = A.getTime();
    let B = Math.max(A - Q, 0);
    for (let [G, Z] of GP5) {
      let I = B / Z;
      if (I < 1e8) return String(Math.ceil(I)) + G
    }
    throw Error("Deadline is too far in the future")
  }
  var IP5 = 2147483647;

  function YP5(A) {
    let Q = A instanceof Date ? A.getTime() : A,
      B = new Date().getTime(),
      G = Q - B;
    if (G < 0) return 0;
    else if (G > IP5) return 1 / 0;
    else return G
  }

  function JP5(A) {
    if (A instanceof Date) return A.toISOString();
    else {
      let Q = new Date(A);
      if (Number.isNaN(Q.getTime())) return "" + A;
      else return Q.toISOString()
    }
  }

  function WP5(A, Q) {
    return ((Q.getTime() - A.getTime()) / 1000).toFixed(3) + "s"
  }
})
// @from(Start 10858213, End 10859634)
H81 = z((YU2) => {
  Object.defineProperty(YU2, "__esModule", {
    value: !0
  });
  YU2.FilterStackFactory = YU2.FilterStack = void 0;
  class M90 {
    constructor(A) {
      this.filters = A
    }
    sendMetadata(A) {
      let Q = A;
      for (let B = 0; B < this.filters.length; B++) Q = this.filters[B].sendMetadata(Q);
      return Q
    }
    receiveMetadata(A) {
      let Q = A;
      for (let B = this.filters.length - 1; B >= 0; B--) Q = this.filters[B].receiveMetadata(Q);
      return Q
    }
    sendMessage(A) {
      let Q = A;
      for (let B = 0; B < this.filters.length; B++) Q = this.filters[B].sendMessage(Q);
      return Q
    }
    receiveMessage(A) {
      let Q = A;
      for (let B = this.filters.length - 1; B >= 0; B--) Q = this.filters[B].receiveMessage(Q);
      return Q
    }
    receiveTrailers(A) {
      let Q = A;
      for (let B = this.filters.length - 1; B >= 0; B--) Q = this.filters[B].receiveTrailers(Q);
      return Q
    }
    push(A) {
      this.filters.unshift(...A)
    }
    getFilters() {
      return this.filters
    }
  }
  YU2.FilterStack = M90;
  class O90 {
    constructor(A) {
      this.factories = A
    }
    push(A) {
      this.factories.unshift(...A)
    }
    clone() {
      return new O90([...this.factories])
    }
    createFilter() {
      return new M90(this.factories.map((A) => A.createFilter()))
    }
  }
  YU2.FilterStackFactory = O90
})
// @from(Start 10859640, End 10866066)
KU2 = z((VU2) => {
  Object.defineProperty(VU2, "__esModule", {
    value: !0
  });
  VU2.SingleSubchannelChannel = void 0;
  var CP5 = K81(),
    uOA = ti(),
    EP5 = L90(),
    zP5 = mE(),
    mOA = E6(),
    UP5 = gOA(),
    $P5 = CJA(),
    wP5 = H81(),
    R90 = YK(),
    qP5 = CP(),
    C81 = uE();
  class WU2 {
    constructor(A, Q, B, G, Z) {
      var I, Y;
      this.subchannel = A, this.method = Q, this.options = G, this.callNumber = Z, this.childCall = null, this.pendingMessage = null, this.readPending = !1, this.halfClosePending = !1, this.pendingStatus = null, this.readFilterPending = !1, this.writeFilterPending = !1;
      let J = this.method.split("/"),
        W = "";
      if (J.length >= 2) W = J[1];
      let X = (Y = (I = (0, C81.splitHostPort)(this.options.host)) === null || I === void 0 ? void 0 : I.host) !== null && Y !== void 0 ? Y : "localhost";
      this.serviceUrl = `https://${X}/${W}`;
      let V = (0, $P5.getRelativeTimeout)(G.deadline);
      if (V !== 1 / 0)
        if (V <= 0) this.cancelWithStatus(mOA.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
        else setTimeout(() => {
          this.cancelWithStatus(mOA.Status.DEADLINE_EXCEEDED, "Deadline exceeded")
        }, V);
      this.filterStack = B.createFilter()
    }
    cancelWithStatus(A, Q) {
      if (this.childCall) this.childCall.cancelWithStatus(A, Q);
      else this.pendingStatus = {
        code: A,
        details: Q,
        metadata: new R90.Metadata
      }
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.childCall) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : this.subchannel.getAddress()
    }
    async start(A, Q) {
      if (this.pendingStatus) {
        Q.onReceiveStatus(this.pendingStatus);
        return
      }
      if (this.subchannel.getConnectivityState() !== zP5.ConnectivityState.READY) {
        Q.onReceiveStatus({
          code: mOA.Status.UNAVAILABLE,
          details: "Subchannel not ready",
          metadata: new R90.Metadata
        });
        return
      }
      let B = await this.filterStack.sendMetadata(Promise.resolve(A)),
        G;
      try {
        G = await this.subchannel.getCallCredentials().generateMetadata({
          method_name: this.method,
          service_url: this.serviceUrl
        })
      } catch (I) {
        let Y = I,
          {
            code: J,
            details: W
          } = (0, UP5.restrictControlPlaneStatusCode)(typeof Y.code === "number" ? Y.code : mOA.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${Y.message}`);
        Q.onReceiveStatus({
          code: J,
          details: W,
          metadata: new R90.Metadata
        });
        return
      }
      G.merge(B);
      let Z = {
        onReceiveMetadata: async (I) => {
          Q.onReceiveMetadata(await this.filterStack.receiveMetadata(I))
        },
        onReceiveMessage: async (I) => {
          this.readFilterPending = !0;
          let Y = await this.filterStack.receiveMessage(I);
          if (this.readFilterPending = !1, Q.onReceiveMessage(Y), this.pendingStatus) Q.onReceiveStatus(this.pendingStatus)
        },
        onReceiveStatus: async (I) => {
          let Y = await this.filterStack.receiveTrailers(I);
          if (this.readFilterPending) this.pendingStatus = Y;
          else Q.onReceiveStatus(Y)
        }
      };
      if (this.childCall = this.subchannel.createCall(G, this.options.host, this.method, Z), this.readPending) this.childCall.startRead();
      if (this.pendingMessage) this.childCall.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
      if (this.halfClosePending && !this.writeFilterPending) this.childCall.halfClose()
    }
    async sendMessageWithContext(A, Q) {
      this.writeFilterPending = !0;
      let B = await this.filterStack.sendMessage(Promise.resolve({
        message: Q,
        flags: A.flags
      }));
      if (this.writeFilterPending = !1, this.childCall) {
        if (this.childCall.sendMessageWithContext(A, B.message), this.halfClosePending) this.childCall.halfClose()
      } else this.pendingMessage = {
        context: A,
        message: B.message
      }
    }
    startRead() {
      if (this.childCall) this.childCall.startRead();
      else this.readPending = !0
    }
    halfClose() {
      if (this.childCall && !this.writeFilterPending) this.childCall.halfClose();
      else this.halfClosePending = !0
    }
    getCallNumber() {
      return this.callNumber
    }
    setCredentials(A) {
      throw Error("Method not implemented.")
    }
    getAuthContext() {
      if (this.childCall) return this.childCall.getAuthContext();
      else return null
    }
  }
  class XU2 {
    constructor(A, Q, B) {
      if (this.subchannel = A, this.target = Q, this.channelzEnabled = !1, this.channelzTrace = new uOA.ChannelzTrace, this.callTracker = new uOA.ChannelzCallTracker, this.childrenTracker = new uOA.ChannelzChildrenTracker, this.channelzEnabled = B["grpc.enable_channelz"] !== 0, this.channelzRef = (0, uOA.registerChannelzChannel)((0, C81.uriToString)(Q), () => ({
          target: `${(0,C81.uriToString)(Q)} (${A.getAddress()})`,
          state: this.subchannel.getConnectivityState(),
          trace: this.channelzTrace,
          callTracker: this.callTracker,
          children: this.childrenTracker.getChildLists()
        }), this.channelzEnabled), this.channelzEnabled) this.childrenTracker.refChild(A.getChannelzRef());
      this.filterStackFactory = new wP5.FilterStackFactory([new EP5.CompressionFilterFactory(this, B)])
    }
    close() {
      if (this.channelzEnabled) this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
      (0, uOA.unregisterChannelzRef)(this.channelzRef)
    }
    getTarget() {
      return (0, C81.uriToString)(this.target)
    }
    getConnectivityState(A) {
      throw Error("Method not implemented.")
    }
    watchConnectivityState(A, Q, B) {
      throw Error("Method not implemented.")
    }
    getChannelzRef() {
      return this.channelzRef
    }
    createCall(A, Q) {
      let B = {
        deadline: Q,
        host: (0, qP5.getDefaultAuthority)(this.target),
        flags: mOA.Propagate.DEFAULTS,
        parentCall: null
      };
      return new WU2(this.subchannel, A, this.filterStackFactory, B, (0, CP5.getNextCallNumber)())
    }
  }
  VU2.SingleSubchannelChannel = XU2
})
// @from(Start 10866072, End 10874803)
EU2 = z((HU2) => {
  Object.defineProperty(HU2, "__esModule", {
    value: !0
  });
  HU2.Subchannel = void 0;
  var dG = mE(),
    NP5 = QJA(),
    T90 = zZ(),
    E81 = E6(),
    LP5 = uE(),
    MP5 = eU(),
    Wy = ti(),
    OP5 = KU2(),
    RP5 = "subchannel",
    TP5 = 2147483647;
  class DU2 {
    constructor(A, Q, B, G, Z) {
      var I;
      this.channelTarget = A, this.subchannelAddress = Q, this.options = B, this.connector = Z, this.connectivityState = dG.ConnectivityState.IDLE, this.transport = null, this.continueConnecting = !1, this.stateListeners = new Set, this.refcount = 0, this.channelzEnabled = !0, this.dataProducers = new Map, this.subchannelChannel = null;
      let Y = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      if (this.backoffTimeout = new NP5.BackoffTimeout(() => {
          this.handleBackoffTimer()
        }, Y), this.backoffTimeout.unref(), this.subchannelAddressString = (0, MP5.subchannelAddressToString)(Q), this.keepaliveTime = (I = B["grpc.keepalive_time_ms"]) !== null && I !== void 0 ? I : -1, B["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new Wy.ChannelzTraceStub, this.callTracker = new Wy.ChannelzCallTrackerStub, this.childrenTracker = new Wy.ChannelzChildrenTrackerStub, this.streamTracker = new Wy.ChannelzCallTrackerStub;
      else this.channelzTrace = new Wy.ChannelzTrace, this.callTracker = new Wy.ChannelzCallTracker, this.childrenTracker = new Wy.ChannelzChildrenTracker, this.streamTracker = new Wy.ChannelzCallTracker;
      this.channelzRef = (0, Wy.registerChannelzSubchannel)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Subchannel created"), this.trace("Subchannel constructed with options " + JSON.stringify(B, void 0, 2)), this.secureConnector = G._createSecureConnector(A, B)
    }
    getChannelzInfo() {
      return {
        state: this.connectivityState,
        trace: this.channelzTrace,
        callTracker: this.callTracker,
        children: this.childrenTracker.getChildLists(),
        target: this.subchannelAddressString
      }
    }
    trace(A) {
      T90.trace(E81.LogVerbosity.DEBUG, RP5, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    refTrace(A) {
      T90.trace(E81.LogVerbosity.DEBUG, "subchannel_refcount", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    handleBackoffTimer() {
      if (this.continueConnecting) this.transitionToState([dG.ConnectivityState.TRANSIENT_FAILURE], dG.ConnectivityState.CONNECTING);
      else this.transitionToState([dG.ConnectivityState.TRANSIENT_FAILURE], dG.ConnectivityState.IDLE)
    }
    startBackoff() {
      this.backoffTimeout.runOnce()
    }
    stopBackoff() {
      this.backoffTimeout.stop(), this.backoffTimeout.reset()
    }
    startConnectingInternal() {
      let A = this.options;
      if (A["grpc.keepalive_time_ms"]) {
        let Q = Math.min(this.keepaliveTime, TP5);
        A = Object.assign(Object.assign({}, A), {
          "grpc.keepalive_time_ms": Q
        })
      }
      this.connector.connect(this.subchannelAddress, this.secureConnector, A).then((Q) => {
        if (this.transitionToState([dG.ConnectivityState.CONNECTING], dG.ConnectivityState.READY)) {
          if (this.transport = Q, this.channelzEnabled) this.childrenTracker.refChild(Q.getChannelzRef());
          Q.addDisconnectListener((B) => {
            if (this.transitionToState([dG.ConnectivityState.READY], dG.ConnectivityState.IDLE), B && this.keepaliveTime > 0) this.keepaliveTime *= 2, T90.log(E81.LogVerbosity.ERROR, `Connection to ${(0,LP5.uriToString)(this.channelTarget)} at ${this.subchannelAddressString} rejected by server because of excess pings. Increasing ping interval to ${this.keepaliveTime} ms`)
          })
        } else Q.shutdown()
      }, (Q) => {
        this.transitionToState([dG.ConnectivityState.CONNECTING], dG.ConnectivityState.TRANSIENT_FAILURE, `${Q}`)
      })
    }
    transitionToState(A, Q, B) {
      var G, Z;
      if (A.indexOf(this.connectivityState) === -1) return !1;
      if (B) this.trace(dG.ConnectivityState[this.connectivityState] + " -> " + dG.ConnectivityState[Q] + ' with error "' + B + '"');
      else this.trace(dG.ConnectivityState[this.connectivityState] + " -> " + dG.ConnectivityState[Q]);
      if (this.channelzEnabled) this.channelzTrace.addTrace("CT_INFO", "Connectivity state change to " + dG.ConnectivityState[Q]);
      let I = this.connectivityState;
      switch (this.connectivityState = Q, Q) {
        case dG.ConnectivityState.READY:
          this.stopBackoff();
          break;
        case dG.ConnectivityState.CONNECTING:
          this.startBackoff(), this.startConnectingInternal(), this.continueConnecting = !1;
          break;
        case dG.ConnectivityState.TRANSIENT_FAILURE:
          if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
          if ((G = this.transport) === null || G === void 0 || G.shutdown(), this.transport = null, !this.backoffTimeout.isRunning()) process.nextTick(() => {
            this.handleBackoffTimer()
          });
          break;
        case dG.ConnectivityState.IDLE:
          if (this.channelzEnabled && this.transport) this.childrenTracker.unrefChild(this.transport.getChannelzRef());
          (Z = this.transport) === null || Z === void 0 || Z.shutdown(), this.transport = null;
          break;
        default:
          throw Error(`Invalid state: unknown ConnectivityState ${Q}`)
      }
      for (let Y of this.stateListeners) Y(this, I, Q, this.keepaliveTime, B);
      return !0
    }
    ref() {
      this.refTrace("refcount " + this.refcount + " -> " + (this.refcount + 1)), this.refcount += 1
    }
    unref() {
      if (this.refTrace("refcount " + this.refcount + " -> " + (this.refcount - 1)), this.refcount -= 1, this.refcount === 0) this.channelzTrace.addTrace("CT_INFO", "Shutting down"), (0, Wy.unregisterChannelzRef)(this.channelzRef), this.secureConnector.destroy(), process.nextTick(() => {
        this.transitionToState([dG.ConnectivityState.CONNECTING, dG.ConnectivityState.READY], dG.ConnectivityState.IDLE)
      })
    }
    unrefIfOneRef() {
      if (this.refcount === 1) return this.unref(), !0;
      return !1
    }
    createCall(A, Q, B, G) {
      if (!this.transport) throw Error("Cannot create call, subchannel not READY");
      let Z;
      if (this.channelzEnabled) this.callTracker.addCallStarted(), this.streamTracker.addCallStarted(), Z = {
        onCallEnd: (I) => {
          if (I.code === E81.Status.OK) this.callTracker.addCallSucceeded();
          else this.callTracker.addCallFailed()
        }
      };
      else Z = {};
      return this.transport.createCall(A, Q, B, G, Z)
    }
    startConnecting() {
      process.nextTick(() => {
        if (!this.transitionToState([dG.ConnectivityState.IDLE], dG.ConnectivityState.CONNECTING)) {
          if (this.connectivityState === dG.ConnectivityState.TRANSIENT_FAILURE) this.continueConnecting = !0
        }
      })
    }
    getConnectivityState() {
      return this.connectivityState
    }
    addConnectivityStateListener(A) {
      this.stateListeners.add(A)
    }
    removeConnectivityStateListener(A) {
      this.stateListeners.delete(A)
    }
    resetBackoff() {
      process.nextTick(() => {
        this.backoffTimeout.reset(), this.transitionToState([dG.ConnectivityState.TRANSIENT_FAILURE], dG.ConnectivityState.CONNECTING)
      })
    }
    getAddress() {
      return this.subchannelAddressString
    }
    getChannelzRef() {
      return this.channelzRef
    }
    isHealthy() {
      return !0
    }
    addHealthStateWatcher(A) {}
    removeHealthStateWatcher(A) {}
    getRealSubchannel() {
      return this
    }
    realSubchannelEquals(A) {
      return A.getRealSubchannel() === this
    }
    throttleKeepalive(A) {
      if (A > this.keepaliveTime) this.keepaliveTime = A
    }
    getCallCredentials() {
      return this.secureConnector.getCallCredentials()
    }
    getChannel() {
      if (!this.subchannelChannel) this.subchannelChannel = new OP5.SingleSubchannelChannel(this, this.channelTarget, this.options);
      return this.subchannelChannel
    }
    addDataWatcher(A) {
      throw Error("Not implemented")
    }
    getOrCreateDataProducer(A, Q) {
      let B = this.dataProducers.get(A);
      if (B) return B;
      let G = Q(this);
      return this.dataProducers.set(A, G), G
    }
    removeDataProducer(A) {
      this.dataProducers.delete(A)
    }
  }
  HU2.Subchannel = DU2
})
// @from(Start 10874809, End 10875111)
$U2 = z((zU2) => {
  var P90;
  Object.defineProperty(zU2, "__esModule", {
    value: !0
  });
  zU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = void 0;
  zU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER = ((P90 = process.env.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) !== null && P90 !== void 0 ? P90 : "false") === "true"
})
// @from(Start 10875117, End 10883122)
_90 = z((MU2) => {
  Object.defineProperty(MU2, "__esModule", {
    value: !0
  });
  MU2.DEFAULT_PORT = void 0;
  MU2.setup = vP5;
  var wU2 = CP(),
    j90 = UA("dns"),
    PP5 = D20(),
    S90 = E6(),
    EJA = o1A(),
    jP5 = YK(),
    SP5 = zZ(),
    _P5 = E6(),
    ei = uE(),
    qU2 = UA("net"),
    kP5 = QJA(),
    NU2 = $U2(),
    yP5 = "dns_resolver";

  function Xy(A) {
    SP5.trace(_P5.LogVerbosity.DEBUG, yP5, A)
  }
  MU2.DEFAULT_PORT = 443;
  var xP5 = 30000;
  class LU2 {
    constructor(A, Q, B) {
      var G, Z, I;
      if (this.target = A, this.listener = Q, this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.continueResolving = !1, this.isNextResolutionTimerRunning = !1, this.isServiceConfigEnabled = !0, this.returnedIpResult = !1, this.alternativeResolver = new j90.promises.Resolver, Xy("Resolver constructed for target " + (0, ei.uriToString)(A)), A.authority) this.alternativeResolver.setServers([A.authority]);
      let Y = (0, ei.splitHostPort)(A.path);
      if (Y === null) this.ipResult = null, this.dnsHostname = null, this.port = null;
      else if ((0, qU2.isIPv4)(Y.host) || (0, qU2.isIPv6)(Y.host)) this.ipResult = [{
        addresses: [{
          host: Y.host,
          port: (G = Y.port) !== null && G !== void 0 ? G : MU2.DEFAULT_PORT
        }]
      }], this.dnsHostname = null, this.port = null;
      else this.ipResult = null, this.dnsHostname = Y.host, this.port = (Z = Y.port) !== null && Z !== void 0 ? Z : MU2.DEFAULT_PORT;
      if (this.percentage = Math.random() * 100, B["grpc.service_config_disable_resolution"] === 1) this.isServiceConfigEnabled = !1;
      this.defaultResolutionError = {
        code: S90.Status.UNAVAILABLE,
        details: `Name resolution failed for target ${(0,ei.uriToString)(this.target)}`,
        metadata: new jP5.Metadata
      };
      let J = {
        initialDelay: B["grpc.initial_reconnect_backoff_ms"],
        maxDelay: B["grpc.max_reconnect_backoff_ms"]
      };
      this.backoff = new kP5.BackoffTimeout(() => {
        if (this.continueResolving) this.startResolutionWithBackoff()
      }, J), this.backoff.unref(), this.minTimeBetweenResolutionsMs = (I = B["grpc.dns_min_time_between_resolutions_ms"]) !== null && I !== void 0 ? I : xP5, this.nextResolutionTimer = setTimeout(() => {}, 0), clearTimeout(this.nextResolutionTimer)
    }
    startResolution() {
      if (this.ipResult !== null) {
        if (!this.returnedIpResult) Xy("Returning IP address for target " + (0, ei.uriToString)(this.target)), setImmediate(() => {
          this.listener((0, EJA.statusOrFromValue)(this.ipResult), {}, null, "")
        }), this.returnedIpResult = !0;
        this.backoff.stop(), this.backoff.reset(), this.stopNextResolutionTimer();
        return
      }
      if (this.dnsHostname === null) Xy("Failed to parse DNS address " + (0, ei.uriToString)(this.target)), setImmediate(() => {
        this.listener((0, EJA.statusOrFromError)({
          code: S90.Status.UNAVAILABLE,
          details: `Failed to parse DNS address ${(0,ei.uriToString)(this.target)}`
        }), {}, null, "")
      }), this.stopNextResolutionTimer();
      else {
        if (this.pendingLookupPromise !== null) return;
        Xy("Looking up DNS hostname " + this.dnsHostname), this.latestLookupResult = null;
        let A = this.dnsHostname;
        if (this.pendingLookupPromise = this.lookup(A), this.pendingLookupPromise.then((Q) => {
            if (this.pendingLookupPromise === null) return;
            this.pendingLookupPromise = null, this.latestLookupResult = (0, EJA.statusOrFromValue)(Q.map((Z) => ({
              addresses: [Z]
            })));
            let B = "[" + Q.map((Z) => Z.host + ":" + Z.port).join(",") + "]";
            Xy("Resolved addresses for target " + (0, ei.uriToString)(this.target) + ": " + B);
            let G = this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "");
            this.handleHealthStatus(G)
          }, (Q) => {
            if (this.pendingLookupPromise === null) return;
            Xy("Resolution error for target " + (0, ei.uriToString)(this.target) + ": " + Q.message), this.pendingLookupPromise = null, this.stopNextResolutionTimer(), this.listener((0, EJA.statusOrFromError)(this.defaultResolutionError), {}, this.latestServiceConfigResult, "")
          }), this.isServiceConfigEnabled && this.pendingTxtPromise === null) this.pendingTxtPromise = this.resolveTxt(A), this.pendingTxtPromise.then((Q) => {
          if (this.pendingTxtPromise === null) return;
          this.pendingTxtPromise = null;
          let B;
          try {
            if (B = (0, PP5.extractAndSelectServiceConfig)(Q, this.percentage), B) this.latestServiceConfigResult = (0, EJA.statusOrFromValue)(B);
            else this.latestServiceConfigResult = null
          } catch (G) {
            this.latestServiceConfigResult = (0, EJA.statusOrFromError)({
              code: S90.Status.UNAVAILABLE,
              details: `Parsing service config failed with error ${G.message}`
            })
          }
          if (this.latestLookupResult !== null) this.listener(this.latestLookupResult, {}, this.latestServiceConfigResult, "")
        }, (Q) => {})
      }
    }
    handleHealthStatus(A) {
      if (A) this.backoff.stop(), this.backoff.reset();
      else this.continueResolving = !0
    }
    async lookup(A) {
      if (NU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) {
        Xy("Using alternative DNS resolver.");
        let B = await Promise.allSettled([this.alternativeResolver.resolve4(A), this.alternativeResolver.resolve6(A)]);
        if (B.every((G) => G.status === "rejected")) throw Error(B[0].reason);
        return B.reduce((G, Z) => {
          return Z.status === "fulfilled" ? [...G, ...Z.value] : G
        }, []).map((G) => ({
          host: G,
          port: +this.port
        }))
      }
      return (await j90.promises.lookup(A, {
        all: !0
      })).map((B) => ({
        host: B.address,
        port: +this.port
      }))
    }
    async resolveTxt(A) {
      if (NU2.GRPC_NODE_USE_ALTERNATIVE_RESOLVER) return Xy("Using alternative DNS resolver."), this.alternativeResolver.resolveTxt(A);
      return j90.promises.resolveTxt(A)
    }
    startNextResolutionTimer() {
      var A, Q;
      clearTimeout(this.nextResolutionTimer), this.nextResolutionTimer = setTimeout(() => {
        if (this.stopNextResolutionTimer(), this.continueResolving) this.startResolutionWithBackoff()
      }, this.minTimeBetweenResolutionsMs), (Q = (A = this.nextResolutionTimer).unref) === null || Q === void 0 || Q.call(A), this.isNextResolutionTimerRunning = !0
    }
    stopNextResolutionTimer() {
      clearTimeout(this.nextResolutionTimer), this.isNextResolutionTimerRunning = !1
    }
    startResolutionWithBackoff() {
      if (this.pendingLookupPromise === null) this.continueResolving = !1, this.backoff.runOnce(), this.startNextResolutionTimer(), this.startResolution()
    }
    updateResolution() {
      if (this.pendingLookupPromise === null)
        if (this.isNextResolutionTimerRunning || this.backoff.isRunning()) {
          if (this.isNextResolutionTimerRunning) Xy('resolution update delayed by "min time between resolutions" rate limit');
          else Xy("resolution update delayed by backoff timer until " + this.backoff.getEndTime().toISOString());
          this.continueResolving = !0
        } else this.startResolutionWithBackoff()
    }
    destroy() {
      this.continueResolving = !1, this.backoff.reset(), this.backoff.stop(), this.stopNextResolutionTimer(), this.pendingLookupPromise = null, this.pendingTxtPromise = null, this.latestLookupResult = null, this.latestServiceConfigResult = null, this.returnedIpResult = !1
    }
    static getDefaultAuthority(A) {
      return A.path
    }
  }

  function vP5() {
    (0, wU2.registerResolver)("dns", LU2), (0, wU2.registerDefaultScheme)("dns")
  }
})
// @from(Start 10883128, End 10887906)
k90 = z((jU2) => {
  Object.defineProperty(jU2, "__esModule", {
    value: !0
  });
  jU2.parseCIDR = TU2;
  jU2.mapProxyName = iP5;
  jU2.getProxiedConnection = nP5;
  var dOA = zZ(),
    zJA = E6(),
    RU2 = UA("net"),
    fP5 = UA("http"),
    hP5 = zZ(),
    OU2 = eU(),
    cOA = uE(),
    gP5 = UA("url"),
    uP5 = _90(),
    mP5 = "proxy";

  function UJA(A) {
    hP5.trace(zJA.LogVerbosity.DEBUG, mP5, A)
  }

  function dP5() {
    let A = "",
      Q = "";
    if (process.env.grpc_proxy) Q = "grpc_proxy", A = process.env.grpc_proxy;
    else if (process.env.https_proxy) Q = "https_proxy", A = process.env.https_proxy;
    else if (process.env.http_proxy) Q = "http_proxy", A = process.env.http_proxy;
    else return {};
    let B;
    try {
      B = new gP5.URL(A)
    } catch (J) {
      return (0, dOA.log)(zJA.LogVerbosity.ERROR, `cannot parse value of "${Q}" env var`), {}
    }
    if (B.protocol !== "http:") return (0, dOA.log)(zJA.LogVerbosity.ERROR, `"${B.protocol}" scheme not supported in proxy URI`), {};
    let G = null;
    if (B.username)
      if (B.password)(0, dOA.log)(zJA.LogVerbosity.INFO, "userinfo found in proxy URI"), G = decodeURIComponent(`${B.username}:${B.password}`);
      else G = B.username;
    let {
      hostname: Z,
      port: I
    } = B;
    if (I === "") I = "80";
    let Y = {
      address: `${Z}:${I}`
    };
    if (G) Y.creds = G;
    return UJA("Proxy server " + Y.address + " set by environment variable " + Q), Y
  }

  function cP5() {
    let A = process.env.no_grpc_proxy,
      Q = "no_grpc_proxy";
    if (!A) A = process.env.no_proxy, Q = "no_proxy";
    if (A) return UJA("No proxy server list set by environment variable " + Q), A.split(",");
    else return []
  }

  function TU2(A) {
    let Q = A.split("/");
    if (Q.length !== 2) return null;
    let B = parseInt(Q[1], 10);
    if (!(0, RU2.isIPv4)(Q[0]) || Number.isNaN(B) || B < 0 || B > 32) return null;
    return {
      ip: PU2(Q[0]),
      prefixLength: B
    }
  }

  function PU2(A) {
    return A.split(".").reduce((Q, B) => (Q << 8) + parseInt(B, 10), 0)
  }

  function pP5(A, Q) {
    let B = A.ip,
      G = -1 << 32 - A.prefixLength;
    return (PU2(Q) & G) === (B & G)
  }

  function lP5(A) {
    for (let Q of cP5()) {
      let B = TU2(Q);
      if ((0, RU2.isIPv4)(A) && B && pP5(B, A)) return !0;
      else if (A.endsWith(Q)) return !0
    }
    return !1
  }

  function iP5(A, Q) {
    var B;
    let G = {
      target: A,
      extraOptions: {}
    };
    if (((B = Q["grpc.enable_http_proxy"]) !== null && B !== void 0 ? B : 1) === 0) return G;
    if (A.scheme === "unix") return G;
    let Z = dP5();
    if (!Z.address) return G;
    let I = (0, cOA.splitHostPort)(A.path);
    if (!I) return G;
    let Y = I.host;
    if (lP5(Y)) return UJA("Not using proxy for target in no_proxy list: " + (0, cOA.uriToString)(A)), G;
    let J = {
      "grpc.http_connect_target": (0, cOA.uriToString)(A)
    };
    if (Z.creds) J["grpc.http_connect_creds"] = Z.creds;
    return {
      target: {
        scheme: "dns",
        path: Z.address
      },
      extraOptions: J
    }
  }

  function nP5(A, Q) {
    var B;
    if (!("grpc.http_connect_target" in Q)) return Promise.resolve(null);
    let G = Q["grpc.http_connect_target"],
      Z = (0, cOA.parseUri)(G);
    if (Z === null) return Promise.resolve(null);
    let I = (0, cOA.splitHostPort)(Z.path);
    if (I === null) return Promise.resolve(null);
    let Y = `${I.host}:${(B=I.port)!==null&&B!==void 0?B:uP5.DEFAULT_PORT}`,
      J = {
        method: "CONNECT",
        path: Y
      },
      W = {
        Host: Y
      };
    if ((0, OU2.isTcpSubchannelAddress)(A)) J.host = A.host, J.port = A.port;
    else J.socketPath = A.path;
    if ("grpc.http_connect_creds" in Q) W["Proxy-Authorization"] = "Basic " + Buffer.from(Q["grpc.http_connect_creds"]).toString("base64");
    J.headers = W;
    let X = (0, OU2.subchannelAddressToString)(A);
    return UJA("Using proxy " + X + " to connect to " + J.path), new Promise((V, F) => {
      let K = fP5.request(J);
      K.once("connect", (D, H, C) => {
        if (K.removeAllListeners(), H.removeAllListeners(), D.statusCode === 200) {
          if (UJA("Successfully connected to " + J.path + " through proxy " + X), C.length > 0) H.unshift(C);
          UJA("Successfully established a plaintext connection to " + J.path + " through proxy " + X), V(H)
        } else(0, dOA.log)(zJA.LogVerbosity.ERROR, "Failed to connect to " + J.path + " through proxy " + X + " with status " + D.statusCode), F()
      }), K.once("error", (D) => {
        K.removeAllListeners(), (0, dOA.log)(zJA.LogVerbosity.ERROR, "Failed to connect to proxy " + X + " with error " + D.message), F()
      }), K.end()
    })
  }
})
// @from(Start 10887912, End 10890314)
y90 = z((_U2) => {
  Object.defineProperty(_U2, "__esModule", {
    value: !0
  });
  _U2.StreamDecoder = void 0;
  var Vy;
  (function(A) {
    A[A.NO_DATA = 0] = "NO_DATA", A[A.READING_SIZE = 1] = "READING_SIZE", A[A.READING_MESSAGE = 2] = "READING_MESSAGE"
  })(Vy || (Vy = {}));
  class SU2 {
    constructor(A) {
      this.maxReadMessageLength = A, this.readState = Vy.NO_DATA, this.readCompressFlag = Buffer.alloc(1), this.readPartialSize = Buffer.alloc(4), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readPartialMessage = [], this.readMessageRemaining = 0
    }
    write(A) {
      let Q = 0,
        B, G = [];
      while (Q < A.length) switch (this.readState) {
        case Vy.NO_DATA:
          this.readCompressFlag = A.slice(Q, Q + 1), Q += 1, this.readState = Vy.READING_SIZE, this.readPartialSize.fill(0), this.readSizeRemaining = 4, this.readMessageSize = 0, this.readMessageRemaining = 0, this.readPartialMessage = [];
          break;
        case Vy.READING_SIZE:
          if (B = Math.min(A.length - Q, this.readSizeRemaining), A.copy(this.readPartialSize, 4 - this.readSizeRemaining, Q, Q + B), this.readSizeRemaining -= B, Q += B, this.readSizeRemaining === 0) {
            if (this.readMessageSize = this.readPartialSize.readUInt32BE(0), this.maxReadMessageLength !== -1 && this.readMessageSize > this.maxReadMessageLength) throw Error(`Received message larger than max (${this.readMessageSize} vs ${this.maxReadMessageLength})`);
            if (this.readMessageRemaining = this.readMessageSize, this.readMessageRemaining > 0) this.readState = Vy.READING_MESSAGE;
            else {
              let Z = Buffer.concat([this.readCompressFlag, this.readPartialSize], 5);
              this.readState = Vy.NO_DATA, G.push(Z)
            }
          }
          break;
        case Vy.READING_MESSAGE:
          if (B = Math.min(A.length - Q, this.readMessageRemaining), this.readPartialMessage.push(A.slice(Q, Q + B)), this.readMessageRemaining -= B, Q += B, this.readMessageRemaining === 0) {
            let Z = [this.readCompressFlag, this.readPartialSize].concat(this.readPartialMessage),
              I = Buffer.concat(Z, this.readMessageSize + 5);
            this.readState = Vy.NO_DATA, G.push(I)
          }
          break;
        default:
          throw Error("Unexpected read state")
      }
      return G
    }
  }
  _U2.StreamDecoder = SU2
})
// @from(Start 10890320, End 10901275)
bU2 = z((xU2) => {
  Object.defineProperty(xU2, "__esModule", {
    value: !0
  });
  xU2.Http2SubchannelCall = void 0;
  var bh = UA("http2"),
    oP5 = UA("os"),
    cG = E6(),
    fh = YK(),
    tP5 = y90(),
    eP5 = zZ(),
    Aj5 = E6(),
    Qj5 = "subchannel_call";

  function Bj5(A) {
    for (let [Q, B] of Object.entries(oP5.constants.errno))
      if (B === A) return Q;
    return "Unknown system error " + A
  }

  function x90(A) {
    let Q = `Received HTTP status code ${A}`,
      B;
    switch (A) {
      case 400:
        B = cG.Status.INTERNAL;
        break;
      case 401:
        B = cG.Status.UNAUTHENTICATED;
        break;
      case 403:
        B = cG.Status.PERMISSION_DENIED;
        break;
      case 404:
        B = cG.Status.UNIMPLEMENTED;
        break;
      case 429:
      case 502:
      case 503:
      case 504:
        B = cG.Status.UNAVAILABLE;
        break;
      default:
        B = cG.Status.UNKNOWN
    }
    return {
      code: B,
      details: Q,
      metadata: new fh.Metadata
    }
  }
  class yU2 {
    constructor(A, Q, B, G, Z) {
      var I;
      this.http2Stream = A, this.callEventTracker = Q, this.listener = B, this.transport = G, this.callId = Z, this.isReadFilterPending = !1, this.isPushPending = !1, this.canPush = !1, this.readsClosed = !1, this.statusOutput = !1, this.unpushedReadMessages = [], this.finalStatus = null, this.internalError = null, this.serverEndedCall = !1, this.connectionDropped = !1;
      let Y = (I = G.getOptions()["grpc.max_receive_message_length"]) !== null && I !== void 0 ? I : cG.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
      this.decoder = new tP5.StreamDecoder(Y), A.on("response", (J, W) => {
        let X = "";
        for (let V of Object.keys(J)) X += "\t\t" + V + ": " + J[V] + `
`;
        if (this.trace(`Received server headers:
` + X), this.httpStatusCode = J[":status"], W & bh.constants.NGHTTP2_FLAG_END_STREAM) this.handleTrailers(J);
        else {
          let V;
          try {
            V = fh.Metadata.fromHttp2Headers(J)
          } catch (F) {
            this.endCall({
              code: cG.Status.UNKNOWN,
              details: F.message,
              metadata: new fh.Metadata
            });
            return
          }
          this.listener.onReceiveMetadata(V)
        }
      }), A.on("trailers", (J) => {
        this.handleTrailers(J)
      }), A.on("data", (J) => {
        if (this.statusOutput) return;
        this.trace("receive HTTP/2 data frame of length " + J.length);
        let W;
        try {
          W = this.decoder.write(J)
        } catch (X) {
          if (this.httpStatusCode !== void 0 && this.httpStatusCode !== 200) {
            let V = x90(this.httpStatusCode);
            this.cancelWithStatus(V.code, V.details)
          } else this.cancelWithStatus(cG.Status.RESOURCE_EXHAUSTED, X.message);
          return
        }
        for (let X of W) this.trace("parsed message of length " + X.length), this.callEventTracker.addMessageReceived(), this.tryPush(X)
      }), A.on("end", () => {
        this.readsClosed = !0, this.maybeOutputStatus()
      }), A.on("close", () => {
        this.serverEndedCall = !0, process.nextTick(() => {
          var J;
          if (this.trace("HTTP/2 stream closed with code " + A.rstCode), ((J = this.finalStatus) === null || J === void 0 ? void 0 : J.code) === cG.Status.OK) return;
          let W, X = "";
          switch (A.rstCode) {
            case bh.constants.NGHTTP2_NO_ERROR:
              if (this.finalStatus !== null) return;
              if (this.httpStatusCode && this.httpStatusCode !== 200) {
                let V = x90(this.httpStatusCode);
                W = V.code, X = V.details
              } else W = cG.Status.INTERNAL, X = `Received RST_STREAM with code ${A.rstCode} (Call ended without gRPC status)`;
              break;
            case bh.constants.NGHTTP2_REFUSED_STREAM:
              W = cG.Status.UNAVAILABLE, X = "Stream refused by server";
              break;
            case bh.constants.NGHTTP2_CANCEL:
              if (this.connectionDropped) W = cG.Status.UNAVAILABLE, X = "Connection dropped";
              else W = cG.Status.CANCELLED, X = "Call cancelled";
              break;
            case bh.constants.NGHTTP2_ENHANCE_YOUR_CALM:
              W = cG.Status.RESOURCE_EXHAUSTED, X = "Bandwidth exhausted or memory limit exceeded";
              break;
            case bh.constants.NGHTTP2_INADEQUATE_SECURITY:
              W = cG.Status.PERMISSION_DENIED, X = "Protocol not secure enough";
              break;
            case bh.constants.NGHTTP2_INTERNAL_ERROR:
              if (W = cG.Status.INTERNAL, this.internalError === null) X = `Received RST_STREAM with code ${A.rstCode} (Internal server error)`;
              else if (this.internalError.code === "ECONNRESET" || this.internalError.code === "ETIMEDOUT") W = cG.Status.UNAVAILABLE, X = this.internalError.message;
              else X = `Received RST_STREAM with code ${A.rstCode} triggered by internal client error: ${this.internalError.message}`;
              break;
            default:
              W = cG.Status.INTERNAL, X = `Received RST_STREAM with code ${A.rstCode}`
          }
          this.endCall({
            code: W,
            details: X,
            metadata: new fh.Metadata,
            rstCode: A.rstCode
          })
        })
      }), A.on("error", (J) => {
        if (J.code !== "ERR_HTTP2_STREAM_ERROR") this.trace("Node error event: message=" + J.message + " code=" + J.code + " errno=" + Bj5(J.errno) + " syscall=" + J.syscall), this.internalError = J;
        this.callEventTracker.onStreamEnd(!1)
      })
    }
    getDeadlineInfo() {
      return [`remote_addr=${this.getPeer()}`]
    }
    onDisconnect() {
      this.connectionDropped = !0, setImmediate(() => {
        this.endCall({
          code: cG.Status.UNAVAILABLE,
          details: "Connection dropped",
          metadata: new fh.Metadata
        })
      })
    }
    outputStatus() {
      if (!this.statusOutput) this.statusOutput = !0, this.trace("ended with status: code=" + this.finalStatus.code + ' details="' + this.finalStatus.details + '"'), this.callEventTracker.onCallEnd(this.finalStatus), process.nextTick(() => {
        this.listener.onReceiveStatus(this.finalStatus)
      }), this.http2Stream.resume()
    }
    trace(A) {
      eP5.trace(Aj5.LogVerbosity.DEBUG, Qj5, "[" + this.callId + "] " + A)
    }
    endCall(A) {
      if (this.finalStatus === null || this.finalStatus.code === cG.Status.OK) this.finalStatus = A, this.maybeOutputStatus();
      this.destroyHttp2Stream()
    }
    maybeOutputStatus() {
      if (this.finalStatus !== null) {
        if (this.finalStatus.code !== cG.Status.OK || this.readsClosed && this.unpushedReadMessages.length === 0 && !this.isReadFilterPending && !this.isPushPending) this.outputStatus()
      }
    }
    push(A) {
      this.trace("pushing to reader message of length " + (A instanceof Buffer ? A.length : null)), this.canPush = !1, this.isPushPending = !0, process.nextTick(() => {
        if (this.isPushPending = !1, this.statusOutput) return;
        this.listener.onReceiveMessage(A), this.maybeOutputStatus()
      })
    }
    tryPush(A) {
      if (this.canPush) this.http2Stream.pause(), this.push(A);
      else this.trace("unpushedReadMessages.push message of length " + A.length), this.unpushedReadMessages.push(A)
    }
    handleTrailers(A) {
      this.serverEndedCall = !0, this.callEventTracker.onStreamEnd(!0);
      let Q = "";
      for (let I of Object.keys(A)) Q += "\t\t" + I + ": " + A[I] + `
`;
      this.trace(`Received server trailers:
` + Q);
      let B;
      try {
        B = fh.Metadata.fromHttp2Headers(A)
      } catch (I) {
        B = new fh.Metadata
      }
      let G = B.getMap(),
        Z;
      if (typeof G["grpc-status"] === "string") {
        let I = Number(G["grpc-status"]);
        this.trace("received status code " + I + " from server"), B.remove("grpc-status");
        let Y = "";
        if (typeof G["grpc-message"] === "string") {
          try {
            Y = decodeURI(G["grpc-message"])
          } catch (J) {
            Y = G["grpc-message"]
          }
          B.remove("grpc-message"), this.trace('received status details string "' + Y + '" from server')
        }
        Z = {
          code: I,
          details: Y,
          metadata: B
        }
      } else if (this.httpStatusCode) Z = x90(this.httpStatusCode), Z.metadata = B;
      else Z = {
        code: cG.Status.UNKNOWN,
        details: "No status information received",
        metadata: B
      };
      this.endCall(Z)
    }
    destroyHttp2Stream() {
      var A;
      if (this.http2Stream.destroyed) return;
      if (this.serverEndedCall) this.http2Stream.end();
      else {
        let Q;
        if (((A = this.finalStatus) === null || A === void 0 ? void 0 : A.code) === cG.Status.OK) Q = bh.constants.NGHTTP2_NO_ERROR;
        else Q = bh.constants.NGHTTP2_CANCEL;
        this.trace("close http2 stream with code " + Q), this.http2Stream.close(Q)
      }
    }
    cancelWithStatus(A, Q) {
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), this.endCall({
        code: A,
        details: Q,
        metadata: new fh.Metadata
      })
    }
    getStatus() {
      return this.finalStatus
    }
    getPeer() {
      return this.transport.getPeerName()
    }
    getCallNumber() {
      return this.callId
    }
    getAuthContext() {
      return this.transport.getAuthContext()
    }
    startRead() {
      if (this.finalStatus !== null && this.finalStatus.code !== cG.Status.OK) {
        this.readsClosed = !0, this.maybeOutputStatus();
        return
      }
      if (this.canPush = !0, this.unpushedReadMessages.length > 0) {
        let A = this.unpushedReadMessages.shift();
        this.push(A);
        return
      }
      this.http2Stream.resume()
    }
    sendMessageWithContext(A, Q) {
      this.trace("write() called with message of length " + Q.length);
      let B = (G) => {
        process.nextTick(() => {
          var Z;
          let I = cG.Status.UNAVAILABLE;
          if ((G === null || G === void 0 ? void 0 : G.code) === "ERR_STREAM_WRITE_AFTER_END") I = cG.Status.INTERNAL;
          if (G) this.cancelWithStatus(I, `Write error: ${G.message}`);
          (Z = A.callback) === null || Z === void 0 || Z.call(A)
        })
      };
      this.trace("sending data chunk of length " + Q.length), this.callEventTracker.addMessageSent();
      try {
        this.http2Stream.write(Q, B)
      } catch (G) {
        this.endCall({
          code: cG.Status.UNAVAILABLE,
          details: `Write failed with error ${G.message}`,
          metadata: new fh.Metadata
        })
      }
    }
    halfClose() {
      this.trace("end() called"), this.trace("calling end() on HTTP/2 stream"), this.http2Stream.end()
    }
  }
  xU2.Http2SubchannelCall = yU2
})
// @from(Start 10901281, End 10916529)
mU2 = z((gU2) => {
  Object.defineProperty(gU2, "__esModule", {
    value: !0
  });
  gU2.Http2SubchannelConnector = void 0;
  var Z0A = UA("http2"),
    Gj5 = UA("tls"),
    U81 = ti(),
    pOA = E6(),
    Zj5 = k90(),
    $JA = zZ(),
    Ij5 = CP(),
    $81 = eU(),
    v90 = uE(),
    Yj5 = UA("net"),
    Jj5 = bU2(),
    Wj5 = K81(),
    b90 = "transport",
    Xj5 = "transport_flowctrl",
    Vj5 = rB0().version,
    {
      HTTP2_HEADER_AUTHORITY: Fj5,
      HTTP2_HEADER_CONTENT_TYPE: Kj5,
      HTTP2_HEADER_METHOD: Dj5,
      HTTP2_HEADER_PATH: Hj5,
      HTTP2_HEADER_TE: Cj5,
      HTTP2_HEADER_USER_AGENT: Ej5
    } = Z0A.constants,
    zj5 = 20000,
    Uj5 = Buffer.from("too_many_pings", "ascii");
  class fU2 {
    constructor(A, Q, B, G) {
      if (this.session = A, this.options = B, this.remoteName = G, this.keepaliveTimer = null, this.pendingSendKeepalivePing = !1, this.activeCalls = new Set, this.disconnectListeners = [], this.disconnectHandled = !1, this.channelzEnabled = !0, this.keepalivesSent = 0, this.messagesSent = 0, this.messagesReceived = 0, this.lastMessageSentTimestamp = null, this.lastMessageReceivedTimestamp = null, this.subchannelAddressString = (0, $81.subchannelAddressToString)(Q), B["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.streamTracker = new U81.ChannelzCallTrackerStub;
      else this.streamTracker = new U81.ChannelzCallTracker;
      if (this.channelzRef = (0, U81.registerChannelzSocket)(this.subchannelAddressString, () => this.getChannelzInfo(), this.channelzEnabled), this.userAgent = [B["grpc.primary_user_agent"], `grpc-node-js/${Vj5}`, B["grpc.secondary_user_agent"]].filter((Z) => Z).join(" "), "grpc.keepalive_time_ms" in B) this.keepaliveTimeMs = B["grpc.keepalive_time_ms"];
      else this.keepaliveTimeMs = -1;
      if ("grpc.keepalive_timeout_ms" in B) this.keepaliveTimeoutMs = B["grpc.keepalive_timeout_ms"];
      else this.keepaliveTimeoutMs = zj5;
      if ("grpc.keepalive_permit_without_calls" in B) this.keepaliveWithoutCalls = B["grpc.keepalive_permit_without_calls"] === 1;
      else this.keepaliveWithoutCalls = !1;
      if (A.once("close", () => {
          this.trace("session closed"), this.handleDisconnect()
        }), A.once("goaway", (Z, I, Y) => {
          let J = !1;
          if (Z === Z0A.constants.NGHTTP2_ENHANCE_YOUR_CALM && Y && Y.equals(Uj5)) J = !0;
          this.trace("connection closed by GOAWAY with code " + Z + " and data " + (Y === null || Y === void 0 ? void 0 : Y.toString())), this.reportDisconnectToOwner(J)
        }), A.once("error", (Z) => {
          this.trace("connection closed with error " + Z.message), this.handleDisconnect()
        }), A.socket.once("close", (Z) => {
          this.trace("connection closed. hadError=" + Z), this.handleDisconnect()
        }), $JA.isTracerEnabled(b90)) A.on("remoteSettings", (Z) => {
        this.trace("new settings received" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(Z))
      }), A.on("localSettings", (Z) => {
        this.trace("local settings acknowledged by remote" + (this.session !== A ? " on the old connection" : "") + ": " + JSON.stringify(Z))
      });
      if (this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer();
      if (A.socket instanceof Gj5.TLSSocket) this.authContext = {
        transportSecurityType: "ssl",
        sslPeerCertificate: A.socket.getPeerCertificate()
      };
      else this.authContext = {}
    }
    getChannelzInfo() {
      var A, Q, B;
      let G = this.session.socket,
        Z = G.remoteAddress ? (0, $81.stringToSubchannelAddress)(G.remoteAddress, G.remotePort) : null,
        I = G.localAddress ? (0, $81.stringToSubchannelAddress)(G.localAddress, G.localPort) : null,
        Y;
      if (this.session.encrypted) {
        let W = G,
          X = W.getCipher(),
          V = W.getCertificate(),
          F = W.getPeerCertificate();
        Y = {
          cipherSuiteStandardName: (A = X.standardName) !== null && A !== void 0 ? A : null,
          cipherSuiteOtherName: X.standardName ? null : X.name,
          localCertificate: V && "raw" in V ? V.raw : null,
          remoteCertificate: F && "raw" in F ? F.raw : null
        }
      } else Y = null;
      return {
        remoteAddress: Z,
        localAddress: I,
        security: Y,
        remoteName: this.remoteName,
        streamsStarted: this.streamTracker.callsStarted,
        streamsSucceeded: this.streamTracker.callsSucceeded,
        streamsFailed: this.streamTracker.callsFailed,
        messagesSent: this.messagesSent,
        messagesReceived: this.messagesReceived,
        keepAlivesSent: this.keepalivesSent,
        lastLocalStreamCreatedTimestamp: this.streamTracker.lastCallStartedTimestamp,
        lastRemoteStreamCreatedTimestamp: null,
        lastMessageSentTimestamp: this.lastMessageSentTimestamp,
        lastMessageReceivedTimestamp: this.lastMessageReceivedTimestamp,
        localFlowControlWindow: (Q = this.session.state.localWindowSize) !== null && Q !== void 0 ? Q : null,
        remoteFlowControlWindow: (B = this.session.state.remoteWindowSize) !== null && B !== void 0 ? B : null
      }
    }
    trace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, b90, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    keepaliveTrace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    flowControlTrace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, Xj5, "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    internalsTrace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, "transport_internals", "(" + this.channelzRef.id + ") " + this.subchannelAddressString + " " + A)
    }
    reportDisconnectToOwner(A) {
      if (this.disconnectHandled) return;
      this.disconnectHandled = !0, this.disconnectListeners.forEach((Q) => Q(A))
    }
    handleDisconnect() {
      this.clearKeepaliveTimeout(), this.reportDisconnectToOwner(!1);
      for (let A of this.activeCalls) A.onDisconnect();
      setImmediate(() => {
        this.session.destroy()
      })
    }
    addDisconnectListener(A) {
      this.disconnectListeners.push(A)
    }
    canSendPing() {
      return !this.session.destroyed && this.keepaliveTimeMs > 0 && (this.keepaliveWithoutCalls || this.activeCalls.size > 0)
    }
    maybeSendPing() {
      var A, Q;
      if (!this.canSendPing()) {
        this.pendingSendKeepalivePing = !0;
        return
      }
      if (this.keepaliveTimer) {
        console.error("keepaliveTimeout is not null");
        return
      }
      if (this.channelzEnabled) this.keepalivesSent += 1;
      this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms"), this.keepaliveTimer = setTimeout(() => {
        this.keepaliveTimer = null, this.keepaliveTrace("Ping timeout passed without response"), this.handleDisconnect()
      }, this.keepaliveTimeoutMs), (Q = (A = this.keepaliveTimer).unref) === null || Q === void 0 || Q.call(A);
      let B = "";
      try {
        if (!this.session.ping((Z, I, Y) => {
            if (this.clearKeepaliveTimeout(), Z) this.keepaliveTrace("Ping failed with error " + Z.message), this.handleDisconnect();
            else this.keepaliveTrace("Received ping response"), this.maybeStartKeepalivePingTimer()
          })) B = "Ping returned false"
      } catch (G) {
        B = (G instanceof Error ? G.message : "") || "Unknown error"
      }
      if (B) this.keepaliveTrace("Ping send failed: " + B), this.handleDisconnect()
    }
    maybeStartKeepalivePingTimer() {
      var A, Q;
      if (!this.canSendPing()) return;
      if (this.pendingSendKeepalivePing) this.pendingSendKeepalivePing = !1, this.maybeSendPing();
      else if (!this.keepaliveTimer) this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), this.keepaliveTimer = setTimeout(() => {
        this.keepaliveTimer = null, this.maybeSendPing()
      }, this.keepaliveTimeMs), (Q = (A = this.keepaliveTimer).unref) === null || Q === void 0 || Q.call(A)
    }
    clearKeepaliveTimeout() {
      if (this.keepaliveTimer) clearTimeout(this.keepaliveTimer), this.keepaliveTimer = null
    }
    removeActiveCall(A) {
      if (this.activeCalls.delete(A), this.activeCalls.size === 0) this.session.unref()
    }
    addActiveCall(A) {
      if (this.activeCalls.add(A), this.activeCalls.size === 1) {
        if (this.session.ref(), !this.keepaliveWithoutCalls) this.maybeStartKeepalivePingTimer()
      }
    }
    createCall(A, Q, B, G, Z) {
      let I = A.toHttp2Headers();
      I[Fj5] = Q, I[Ej5] = this.userAgent, I[Kj5] = "application/grpc", I[Dj5] = "POST", I[Hj5] = B, I[Cj5] = "trailers";
      let Y;
      try {
        Y = this.session.request(I)
      } catch (X) {
        throw this.handleDisconnect(), X
      }
      this.flowControlTrace("local window size: " + this.session.state.localWindowSize + " remote window size: " + this.session.state.remoteWindowSize), this.internalsTrace("session.closed=" + this.session.closed + " session.destroyed=" + this.session.destroyed + " session.socket.destroyed=" + this.session.socket.destroyed);
      let J, W;
      if (this.channelzEnabled) this.streamTracker.addCallStarted(), J = {
        addMessageSent: () => {
          var X;
          this.messagesSent += 1, this.lastMessageSentTimestamp = new Date, (X = Z.addMessageSent) === null || X === void 0 || X.call(Z)
        },
        addMessageReceived: () => {
          var X;
          this.messagesReceived += 1, this.lastMessageReceivedTimestamp = new Date, (X = Z.addMessageReceived) === null || X === void 0 || X.call(Z)
        },
        onCallEnd: (X) => {
          var V;
          (V = Z.onCallEnd) === null || V === void 0 || V.call(Z, X), this.removeActiveCall(W)
        },
        onStreamEnd: (X) => {
          var V;
          if (X) this.streamTracker.addCallSucceeded();
          else this.streamTracker.addCallFailed();
          (V = Z.onStreamEnd) === null || V === void 0 || V.call(Z, X)
        }
      };
      else J = {
        addMessageSent: () => {
          var X;
          (X = Z.addMessageSent) === null || X === void 0 || X.call(Z)
        },
        addMessageReceived: () => {
          var X;
          (X = Z.addMessageReceived) === null || X === void 0 || X.call(Z)
        },
        onCallEnd: (X) => {
          var V;
          (V = Z.onCallEnd) === null || V === void 0 || V.call(Z, X), this.removeActiveCall(W)
        },
        onStreamEnd: (X) => {
          var V;
          (V = Z.onStreamEnd) === null || V === void 0 || V.call(Z, X)
        }
      };
      return W = new Jj5.Http2SubchannelCall(Y, J, G, this, (0, Wj5.getNextCallNumber)()), this.addActiveCall(W), W
    }
    getChannelzRef() {
      return this.channelzRef
    }
    getPeerName() {
      return this.subchannelAddressString
    }
    getOptions() {
      return this.options
    }
    getAuthContext() {
      return this.authContext
    }
    shutdown() {
      this.session.close(), (0, U81.unregisterChannelzRef)(this.channelzRef)
    }
  }
  class hU2 {
    constructor(A) {
      this.channelTarget = A, this.session = null, this.isShutdown = !1
    }
    trace(A) {
      $JA.trace(pOA.LogVerbosity.DEBUG, b90, (0, v90.uriToString)(this.channelTarget) + " " + A)
    }
    createSession(A, Q, B) {
      if (this.isShutdown) return Promise.reject();
      if (A.socket.closed) return Promise.reject("Connection closed before starting HTTP/2 handshake");
      return new Promise((G, Z) => {
        var I, Y, J, W, X, V, F;
        let K = null,
          D = this.channelTarget;
        if ("grpc.http_connect_target" in B) {
          let v = (0, v90.parseUri)(B["grpc.http_connect_target"]);
          if (v) D = v, K = (0, v90.uriToString)(v)
        }
        let H = A.secure ? "https" : "http",
          C = (0, Ij5.getDefaultAuthority)(D),
          E = () => {
            var v;
            (v = this.session) === null || v === void 0 || v.destroy(), this.session = null, setImmediate(() => {
              if (!y) y = !0, Z(`${T.trim()} (${new Date().toISOString()})`)
            })
          },
          U = (v) => {
            var x;
            if ((x = this.session) === null || x === void 0 || x.destroy(), T = v.message, this.trace("connection failed with error " + T), !y) y = !0, Z(`${T} (${new Date().toISOString()})`)
          },
          q = {
            createConnection: (v, x) => {
              return A.socket
            },
            settings: {
              initialWindowSize: (W = (I = B["grpc-node.flow_control_window"]) !== null && I !== void 0 ? I : (J = (Y = Z0A.getDefaultSettings) === null || Y === void 0 ? void 0 : Y.call(Z0A)) === null || J === void 0 ? void 0 : J.initialWindowSize) !== null && W !== void 0 ? W : 65535
            }
          },
          w = Z0A.connect(`${H}://${C}`, q),
          N = (F = (V = (X = Z0A.getDefaultSettings) === null || X === void 0 ? void 0 : X.call(Z0A)) === null || V === void 0 ? void 0 : V.initialWindowSize) !== null && F !== void 0 ? F : 65535,
          R = B["grpc-node.flow_control_window"];
        this.session = w;
        let T = "Failed to connect",
          y = !1;
        w.unref(), w.once("remoteSettings", () => {
          var v;
          if (R && R > N) try {
            w.setLocalWindowSize(R)
          } catch (x) {
            let p = R - ((v = w.state.localWindowSize) !== null && v !== void 0 ? v : N);
            if (p > 0) w.incrementWindowSize(p)
          }
          w.removeAllListeners(), A.socket.removeListener("close", E), A.socket.removeListener("error", U), G(new fU2(w, Q, B, K)), this.session = null
        }), w.once("close", E), w.once("error", U), A.socket.once("close", E), A.socket.once("error", U)
      })
    }
    tcpConnect(A, Q) {
      return (0, Zj5.getProxiedConnection)(A, Q).then((B) => {
        if (B) return B;
        else return new Promise((G, Z) => {
          let I = () => {
              Z(Error("Socket closed"))
            },
            Y = (W) => {
              Z(W)
            },
            J = Yj5.connect(A, () => {
              J.removeListener("close", I), J.removeListener("error", Y), G(J)
            });
          J.once("close", I), J.once("error", Y)
        })
      })
    }
    async connect(A, Q, B) {
      if (this.isShutdown) return Promise.reject();
      let G = null,
        Z = null,
        I = (0, $81.subchannelAddressToString)(A);
      try {
        return this.trace(I + " Waiting for secureConnector to be ready"), await Q.waitForReady(), this.trace(I + " secureConnector is ready"), G = await this.tcpConnect(A, B), G.setNoDelay(), this.trace(I + " Established TCP connection"), Z = await Q.connect(G), this.trace(I + " Established secure connection"), this.createSession(Z, A, B)
      } catch (Y) {
        throw G === null || G === void 0 || G.destroy(), Z === null || Z === void 0 || Z.socket.destroy(), Y
      }
    }
    shutdown() {
      var A;
      this.isShutdown = !0, (A = this.session) === null || A === void 0 || A.close(), this.session = null
    }
  }
  gU2.Http2SubchannelConnector = hU2
})
// @from(Start 10916535, End 10918283)
pU2 = z((dU2) => {
  Object.defineProperty(dU2, "__esModule", {
    value: !0
  });
  dU2.SubchannelPool = void 0;
  dU2.getSubchannelPool = Rj5;
  var $j5 = pH2(),
    wj5 = EU2(),
    qj5 = eU(),
    Nj5 = uE(),
    Lj5 = mU2(),
    Mj5 = 1e4;
  class w81 {
    constructor() {
      this.pool = Object.create(null), this.cleanupTimer = null
    }
    unrefUnusedSubchannels() {
      let A = !0;
      for (let Q in this.pool) {
        let G = this.pool[Q].filter((Z) => !Z.subchannel.unrefIfOneRef());
        if (G.length > 0) A = !1;
        this.pool[Q] = G
      }
      if (A && this.cleanupTimer !== null) clearInterval(this.cleanupTimer), this.cleanupTimer = null
    }
    ensureCleanupTask() {
      var A, Q;
      if (this.cleanupTimer === null) this.cleanupTimer = setInterval(() => {
        this.unrefUnusedSubchannels()
      }, Mj5), (Q = (A = this.cleanupTimer).unref) === null || Q === void 0 || Q.call(A)
    }
    getOrCreateSubchannel(A, Q, B, G) {
      this.ensureCleanupTask();
      let Z = (0, Nj5.uriToString)(A);
      if (Z in this.pool) {
        let Y = this.pool[Z];
        for (let J of Y)
          if ((0, qj5.subchannelAddressEqual)(Q, J.subchannelAddress) && (0, $j5.channelOptionsEqual)(B, J.channelArguments) && G._equals(J.channelCredentials)) return J.subchannel
      }
      let I = new wj5.Subchannel(A, Q, B, G, new Lj5.Http2SubchannelConnector(A));
      if (!(Z in this.pool)) this.pool[Z] = [];
      return this.pool[Z].push({
        subchannelAddress: Q,
        channelArguments: B,
        channelCredentials: G,
        subchannel: I
      }), I.ref(), I
    }
  }
  dU2.SubchannelPool = w81;
  var Oj5 = new w81;

  function Rj5(A) {
    if (A) return Oj5;
    else return new w81
  }
})
// @from(Start 10918289, End 10926754)
rU2 = z((aU2) => {
  Object.defineProperty(aU2, "__esModule", {
    value: !0
  });
  aU2.LoadBalancingCall = void 0;
  var lU2 = mE(),
    q81 = E6(),
    iU2 = CJA(),
    N81 = YK(),
    lOA = Ph(),
    Pj5 = uE(),
    jj5 = zZ(),
    f90 = gOA(),
    Sj5 = UA("http2"),
    _j5 = "load_balancing_call";
  class nU2 {
    constructor(A, Q, B, G, Z, I, Y) {
      var J, W;
      this.channel = A, this.callConfig = Q, this.methodName = B, this.host = G, this.credentials = Z, this.deadline = I, this.callNumber = Y, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.metadata = null, this.listener = null, this.onCallEnded = null, this.childStartTime = null;
      let X = this.methodName.split("/"),
        V = "";
      if (X.length >= 2) V = X[1];
      let F = (W = (J = (0, Pj5.splitHostPort)(this.host)) === null || J === void 0 ? void 0 : J.host) !== null && W !== void 0 ? W : "localhost";
      this.serviceUrl = `https://${F}/${V}`, this.startTime = new Date
    }
    getDeadlineInfo() {
      var A, Q;
      let B = [];
      if (this.childStartTime) {
        if (this.childStartTime > this.startTime) {
          if ((A = this.metadata) === null || A === void 0 ? void 0 : A.getOptions().waitForReady) B.push("wait_for_ready");
          B.push(`LB pick: ${(0,iU2.formatDateDifference)(this.startTime,this.childStartTime)}`)
        }
        return B.push(...this.child.getDeadlineInfo()), B
      } else {
        if ((Q = this.metadata) === null || Q === void 0 ? void 0 : Q.getOptions().waitForReady) B.push("wait_for_ready");
        B.push("Waiting for LB pick")
      }
      return B
    }
    trace(A) {
      jj5.trace(q81.LogVerbosity.DEBUG, _j5, "[" + this.callNumber + "] " + A)
    }
    outputStatus(A, Q) {
      var B, G;
      if (!this.ended) {
        this.ended = !0, this.trace("ended with status: code=" + A.code + ' details="' + A.details + '" start time=' + this.startTime.toISOString());
        let Z = Object.assign(Object.assign({}, A), {
          progress: Q
        });
        (B = this.listener) === null || B === void 0 || B.onReceiveStatus(Z), (G = this.onCallEnded) === null || G === void 0 || G.call(this, Z.code, Z.details, Z.metadata)
      }
    }
    doPick() {
      var A, Q;
      if (this.ended) return;
      if (!this.metadata) throw Error("doPick called before start");
      this.trace("Pick called");
      let B = this.metadata.clone(),
        G = this.channel.doPick(B, this.callConfig.pickInformation),
        Z = G.subchannel ? "(" + G.subchannel.getChannelzRef().id + ") " + G.subchannel.getAddress() : "" + G.subchannel;
      switch (this.trace("Pick result: " + lOA.PickResultType[G.pickResultType] + " subchannel: " + Z + " status: " + ((A = G.status) === null || A === void 0 ? void 0 : A.code) + " " + ((Q = G.status) === null || Q === void 0 ? void 0 : Q.details)), G.pickResultType) {
        case lOA.PickResultType.COMPLETE:
          this.credentials.compose(G.subchannel.getCallCredentials()).generateMetadata({
            method_name: this.methodName,
            service_url: this.serviceUrl
          }).then((W) => {
            var X;
            if (this.ended) {
              this.trace("Credentials metadata generation finished after call ended");
              return
            }
            if (B.merge(W), B.get("authorization").length > 1) this.outputStatus({
              code: q81.Status.INTERNAL,
              details: '"authorization" metadata cannot have multiple values',
              metadata: new N81.Metadata
            }, "PROCESSED");
            if (G.subchannel.getConnectivityState() !== lU2.ConnectivityState.READY) {
              this.trace("Picked subchannel " + Z + " has state " + lU2.ConnectivityState[G.subchannel.getConnectivityState()] + " after getting credentials metadata. Retrying pick"), this.doPick();
              return
            }
            if (this.deadline !== 1 / 0) B.set("grpc-timeout", (0, iU2.getDeadlineTimeoutString)(this.deadline));
            try {
              this.child = G.subchannel.getRealSubchannel().createCall(B, this.host, this.methodName, {
                onReceiveMetadata: (V) => {
                  this.trace("Received metadata"), this.listener.onReceiveMetadata(V)
                },
                onReceiveMessage: (V) => {
                  this.trace("Received message"), this.listener.onReceiveMessage(V)
                },
                onReceiveStatus: (V) => {
                  if (this.trace("Received status"), V.rstCode === Sj5.constants.NGHTTP2_REFUSED_STREAM) this.outputStatus(V, "REFUSED");
                  else this.outputStatus(V, "PROCESSED")
                }
              }), this.childStartTime = new Date
            } catch (V) {
              this.trace("Failed to start call on picked subchannel " + Z + " with error " + V.message), this.outputStatus({
                code: q81.Status.INTERNAL,
                details: "Failed to start HTTP/2 stream with error " + V.message,
                metadata: new N81.Metadata
              }, "NOT_STARTED");
              return
            }
            if ((X = G.onCallStarted) === null || X === void 0 || X.call(G), this.onCallEnded = G.onCallEnded, this.trace("Created child call [" + this.child.getCallNumber() + "]"), this.readPending) this.child.startRead();
            if (this.pendingMessage) this.child.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
            if (this.pendingHalfClose) this.child.halfClose()
          }, (W) => {
            let {
              code: X,
              details: V
            } = (0, f90.restrictControlPlaneStatusCode)(typeof W.code === "number" ? W.code : q81.Status.UNKNOWN, `Getting metadata from plugin failed with error: ${W.message}`);
            this.outputStatus({
              code: X,
              details: V,
              metadata: new N81.Metadata
            }, "PROCESSED")
          });
          break;
        case lOA.PickResultType.DROP:
          let {
            code: Y, details: J
          } = (0, f90.restrictControlPlaneStatusCode)(G.status.code, G.status.details);
          setImmediate(() => {
            this.outputStatus({
              code: Y,
              details: J,
              metadata: G.status.metadata
            }, "DROP")
          });
          break;
        case lOA.PickResultType.TRANSIENT_FAILURE:
          if (this.metadata.getOptions().waitForReady) this.channel.queueCallForPick(this);
          else {
            let {
              code: W,
              details: X
            } = (0, f90.restrictControlPlaneStatusCode)(G.status.code, G.status.details);
            setImmediate(() => {
              this.outputStatus({
                code: W,
                details: X,
                metadata: G.status.metadata
              }, "PROCESSED")
            })
          }
          break;
        case lOA.PickResultType.QUEUE:
          this.channel.queueCallForPick(this)
      }
    }
    cancelWithStatus(A, Q) {
      var B;
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), (B = this.child) === null || B === void 0 || B.cancelWithStatus(A, Q), this.outputStatus({
        code: A,
        details: Q,
        metadata: new N81.Metadata
      }, "PROCESSED")
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.child) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : this.channel.getTarget()
    }
    start(A, Q) {
      this.trace("start called"), this.listener = Q, this.metadata = A, this.doPick()
    }
    sendMessageWithContext(A, Q) {
      if (this.trace("write() called with message of length " + Q.length), this.child) this.child.sendMessageWithContext(A, Q);
      else this.pendingMessage = {
        context: A,
        message: Q
      }
    }
    startRead() {
      if (this.trace("startRead called"), this.child) this.child.startRead();
      else this.readPending = !0
    }
    halfClose() {
      if (this.trace("halfClose called"), this.child) this.child.halfClose();
      else this.pendingHalfClose = !0
    }
    setCredentials(A) {
      throw Error("Method not implemented.")
    }
    getCallNumber() {
      return this.callNumber
    }
    getAuthContext() {
      if (this.child) return this.child.getAuthContext();
      else return null
    }
  }
  aU2.LoadBalancingCall = nU2
})
// @from(Start 10926760, End 10935169)
Q$2 = z((eU2) => {
  Object.defineProperty(eU2, "__esModule", {
    value: !0
  });
  eU2.ResolvingCall = void 0;
  var kj5 = O41(),
    I0A = E6(),
    Y0A = CJA(),
    oU2 = YK(),
    yj5 = zZ(),
    xj5 = gOA(),
    vj5 = "resolving_call";
  class tU2 {
    constructor(A, Q, B, G, Z) {
      if (this.channel = A, this.method = Q, this.filterStackFactory = G, this.callNumber = Z, this.child = null, this.readPending = !1, this.pendingMessage = null, this.pendingHalfClose = !1, this.ended = !1, this.readFilterPending = !1, this.writeFilterPending = !1, this.pendingChildStatus = null, this.metadata = null, this.listener = null, this.statusWatchers = [], this.deadlineTimer = setTimeout(() => {}, 0), this.filterStack = null, this.deadlineStartTime = null, this.configReceivedTime = null, this.childStartTime = null, this.credentials = kj5.CallCredentials.createEmpty(), this.deadline = B.deadline, this.host = B.host, B.parentCall) {
        if (B.flags & I0A.Propagate.CANCELLATION) B.parentCall.on("cancelled", () => {
          this.cancelWithStatus(I0A.Status.CANCELLED, "Cancelled by parent call")
        });
        if (B.flags & I0A.Propagate.DEADLINE) this.trace("Propagating deadline from parent: " + B.parentCall.getDeadline()), this.deadline = (0, Y0A.minDeadline)(this.deadline, B.parentCall.getDeadline())
      }
      this.trace("Created"), this.runDeadlineTimer()
    }
    trace(A) {
      yj5.trace(I0A.LogVerbosity.DEBUG, vj5, "[" + this.callNumber + "] " + A)
    }
    runDeadlineTimer() {
      clearTimeout(this.deadlineTimer), this.deadlineStartTime = new Date, this.trace("Deadline: " + (0, Y0A.deadlineToString)(this.deadline));
      let A = (0, Y0A.getRelativeTimeout)(this.deadline);
      if (A !== 1 / 0) {
        this.trace("Deadline will be reached in " + A + "ms");
        let Q = () => {
          if (!this.deadlineStartTime) {
            this.cancelWithStatus(I0A.Status.DEADLINE_EXCEEDED, "Deadline exceeded");
            return
          }
          let B = [],
            G = new Date;
          if (B.push(`Deadline exceeded after ${(0,Y0A.formatDateDifference)(this.deadlineStartTime,G)}`), this.configReceivedTime) {
            if (this.configReceivedTime > this.deadlineStartTime) B.push(`name resolution: ${(0,Y0A.formatDateDifference)(this.deadlineStartTime,this.configReceivedTime)}`);
            if (this.childStartTime) {
              if (this.childStartTime > this.configReceivedTime) B.push(`metadata filters: ${(0,Y0A.formatDateDifference)(this.configReceivedTime,this.childStartTime)}`)
            } else B.push("waiting for metadata filters")
          } else B.push("waiting for name resolution");
          if (this.child) B.push(...this.child.getDeadlineInfo());
          this.cancelWithStatus(I0A.Status.DEADLINE_EXCEEDED, B.join(","))
        };
        if (A <= 0) process.nextTick(Q);
        else this.deadlineTimer = setTimeout(Q, A)
      }
    }
    outputStatus(A) {
      if (!this.ended) {
        if (this.ended = !0, !this.filterStack) this.filterStack = this.filterStackFactory.createFilter();
        clearTimeout(this.deadlineTimer);
        let Q = this.filterStack.receiveTrailers(A);
        this.trace("ended with status: code=" + Q.code + ' details="' + Q.details + '"'), this.statusWatchers.forEach((B) => B(Q)), process.nextTick(() => {
          var B;
          (B = this.listener) === null || B === void 0 || B.onReceiveStatus(Q)
        })
      }
    }
    sendMessageOnChild(A, Q) {
      if (!this.child) throw Error("sendMessageonChild called with child not populated");
      let B = this.child;
      this.writeFilterPending = !0, this.filterStack.sendMessage(Promise.resolve({
        message: Q,
        flags: A.flags
      })).then((G) => {
        if (this.writeFilterPending = !1, B.sendMessageWithContext(A, G.message), this.pendingHalfClose) B.halfClose()
      }, (G) => {
        this.cancelWithStatus(G.code, G.details)
      })
    }
    getConfig() {
      if (this.ended) return;
      if (!this.metadata || !this.listener) throw Error("getConfig called before start");
      let A = this.channel.getConfig(this.method, this.metadata);
      if (A.type === "NONE") {
        this.channel.queueCallForConfig(this);
        return
      } else if (A.type === "ERROR") {
        if (this.metadata.getOptions().waitForReady) this.channel.queueCallForConfig(this);
        else this.outputStatus(A.error);
        return
      }
      this.configReceivedTime = new Date;
      let Q = A.config;
      if (Q.status !== I0A.Status.OK) {
        let {
          code: B,
          details: G
        } = (0, xj5.restrictControlPlaneStatusCode)(Q.status, "Failed to route call to method " + this.method);
        this.outputStatus({
          code: B,
          details: G,
          metadata: new oU2.Metadata
        });
        return
      }
      if (Q.methodConfig.timeout) {
        let B = new Date;
        B.setSeconds(B.getSeconds() + Q.methodConfig.timeout.seconds), B.setMilliseconds(B.getMilliseconds() + Q.methodConfig.timeout.nanos / 1e6), this.deadline = (0, Y0A.minDeadline)(this.deadline, B), this.runDeadlineTimer()
      }
      this.filterStackFactory.push(Q.dynamicFilterFactories), this.filterStack = this.filterStackFactory.createFilter(), this.filterStack.sendMetadata(Promise.resolve(this.metadata)).then((B) => {
        if (this.child = this.channel.createRetryingCall(Q, this.method, this.host, this.credentials, this.deadline), this.trace("Created child [" + this.child.getCallNumber() + "]"), this.childStartTime = new Date, this.child.start(B, {
            onReceiveMetadata: (G) => {
              this.trace("Received metadata"), this.listener.onReceiveMetadata(this.filterStack.receiveMetadata(G))
            },
            onReceiveMessage: (G) => {
              this.trace("Received message"), this.readFilterPending = !0, this.filterStack.receiveMessage(G).then((Z) => {
                if (this.trace("Finished filtering received message"), this.readFilterPending = !1, this.listener.onReceiveMessage(Z), this.pendingChildStatus) this.outputStatus(this.pendingChildStatus)
              }, (Z) => {
                this.cancelWithStatus(Z.code, Z.details)
              })
            },
            onReceiveStatus: (G) => {
              if (this.trace("Received status"), this.readFilterPending) this.pendingChildStatus = G;
              else this.outputStatus(G)
            }
          }), this.readPending) this.child.startRead();
        if (this.pendingMessage) this.sendMessageOnChild(this.pendingMessage.context, this.pendingMessage.message);
        else if (this.pendingHalfClose) this.child.halfClose()
      }, (B) => {
        this.outputStatus(B)
      })
    }
    reportResolverError(A) {
      var Q;
      if ((Q = this.metadata) === null || Q === void 0 ? void 0 : Q.getOptions().waitForReady) this.channel.queueCallForConfig(this);
      else this.outputStatus(A)
    }
    cancelWithStatus(A, Q) {
      var B;
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), (B = this.child) === null || B === void 0 || B.cancelWithStatus(A, Q), this.outputStatus({
        code: A,
        details: Q,
        metadata: new oU2.Metadata
      })
    }
    getPeer() {
      var A, Q;
      return (Q = (A = this.child) === null || A === void 0 ? void 0 : A.getPeer()) !== null && Q !== void 0 ? Q : this.channel.getTarget()
    }
    start(A, Q) {
      this.trace("start called"), this.metadata = A.clone(), this.listener = Q, this.getConfig()
    }
    sendMessageWithContext(A, Q) {
      if (this.trace("write() called with message of length " + Q.length), this.child) this.sendMessageOnChild(A, Q);
      else this.pendingMessage = {
        context: A,
        message: Q
      }
    }
    startRead() {
      if (this.trace("startRead called"), this.child) this.child.startRead();
      else this.readPending = !0
    }
    halfClose() {
      if (this.trace("halfClose called"), this.child && !this.writeFilterPending) this.child.halfClose();
      else this.pendingHalfClose = !0
    }
    setCredentials(A) {
      this.credentials = A
    }
    addStatusWatcher(A) {
      this.statusWatchers.push(A)
    }
    getCallNumber() {
      return this.callNumber
    }
    getAuthContext() {
      if (this.child) return this.child.getAuthContext();
      else return null
    }
  }
  eU2.ResolvingCall = tU2
})
// @from(Start 10935175, End 10952324)
J$2 = z((I$2) => {
  Object.defineProperty(I$2, "__esModule", {
    value: !0
  });
  I$2.RetryingCall = I$2.MessageBufferTracker = I$2.RetryThrottler = void 0;
  var L81 = E6(),
    bj5 = CJA(),
    fj5 = YK(),
    hj5 = zZ(),
    gj5 = "retrying_call";
  class B$2 {
    constructor(A, Q, B) {
      if (this.maxTokens = A, this.tokenRatio = Q, B) this.tokens = B.tokens * (A / B.maxTokens);
      else this.tokens = A
    }
    addCallSucceeded() {
      this.tokens = Math.min(this.tokens + this.tokenRatio, this.maxTokens)
    }
    addCallFailed() {
      this.tokens = Math.max(this.tokens - 1, 0)
    }
    canRetryCall() {
      return this.tokens > this.maxTokens / 2
    }
  }
  I$2.RetryThrottler = B$2;
  class G$2 {
    constructor(A, Q) {
      this.totalLimit = A, this.limitPerCall = Q, this.totalAllocated = 0, this.allocatedPerCall = new Map
    }
    allocate(A, Q) {
      var B;
      let G = (B = this.allocatedPerCall.get(Q)) !== null && B !== void 0 ? B : 0;
      if (this.limitPerCall - G < A || this.totalLimit - this.totalAllocated < A) return !1;
      return this.allocatedPerCall.set(Q, G + A), this.totalAllocated += A, !0
    }
    free(A, Q) {
      var B;
      if (this.totalAllocated < A) throw Error(`Invalid buffer allocation state: call ${Q} freed ${A} > total allocated ${this.totalAllocated}`);
      this.totalAllocated -= A;
      let G = (B = this.allocatedPerCall.get(Q)) !== null && B !== void 0 ? B : 0;
      if (G < A) throw Error(`Invalid buffer allocation state: call ${Q} freed ${A} > allocated for call ${G}`);
      this.allocatedPerCall.set(Q, G - A)
    }
    freeAll(A) {
      var Q;
      let B = (Q = this.allocatedPerCall.get(A)) !== null && Q !== void 0 ? Q : 0;
      if (this.totalAllocated < B) throw Error(`Invalid buffer allocation state: call ${A} allocated ${B} > total allocated ${this.totalAllocated}`);
      this.totalAllocated -= B, this.allocatedPerCall.delete(A)
    }
  }
  I$2.MessageBufferTracker = G$2;
  var h90 = "grpc-previous-rpc-attempts",
    uj5 = 5;
  class Z$2 {
    constructor(A, Q, B, G, Z, I, Y, J, W) {
      var X;
      this.channel = A, this.callConfig = Q, this.methodName = B, this.host = G, this.credentials = Z, this.deadline = I, this.callNumber = Y, this.bufferTracker = J, this.retryThrottler = W, this.listener = null, this.initialMetadata = null, this.underlyingCalls = [], this.writeBuffer = [], this.writeBufferOffset = 0, this.readStarted = !1, this.transparentRetryUsed = !1, this.attempts = 0, this.hedgingTimer = null, this.committedCallIndex = null, this.initialRetryBackoffSec = 0, this.nextRetryBackoffSec = 0;
      let V = (X = A.getOptions()["grpc-node.retry_max_attempts_limit"]) !== null && X !== void 0 ? X : uj5;
      if (A.getOptions()["grpc.enable_retries"] === 0) this.state = "NO_RETRY", this.maxAttempts = 1;
      else if (Q.methodConfig.retryPolicy) {
        this.state = "RETRY";
        let F = Q.methodConfig.retryPolicy;
        this.nextRetryBackoffSec = this.initialRetryBackoffSec = Number(F.initialBackoff.substring(0, F.initialBackoff.length - 1)), this.maxAttempts = Math.min(F.maxAttempts, V)
      } else if (Q.methodConfig.hedgingPolicy) this.state = "HEDGING", this.maxAttempts = Math.min(Q.methodConfig.hedgingPolicy.maxAttempts, V);
      else this.state = "TRANSPARENT_ONLY", this.maxAttempts = 1;
      this.startTime = new Date
    }
    getDeadlineInfo() {
      if (this.underlyingCalls.length === 0) return [];
      let A = [],
        Q = this.underlyingCalls[this.underlyingCalls.length - 1];
      if (this.underlyingCalls.length > 1) A.push(`previous attempts: ${this.underlyingCalls.length-1}`);
      if (Q.startTime > this.startTime) A.push(`time to current attempt start: ${(0,bj5.formatDateDifference)(this.startTime,Q.startTime)}`);
      return A.push(...Q.call.getDeadlineInfo()), A
    }
    getCallNumber() {
      return this.callNumber
    }
    trace(A) {
      hj5.trace(L81.LogVerbosity.DEBUG, gj5, "[" + this.callNumber + "] " + A)
    }
    reportStatus(A) {
      this.trace("ended with status: code=" + A.code + ' details="' + A.details + '" start time=' + this.startTime.toISOString()), this.bufferTracker.freeAll(this.callNumber), this.writeBufferOffset = this.writeBufferOffset + this.writeBuffer.length, this.writeBuffer = [], process.nextTick(() => {
        var Q;
        (Q = this.listener) === null || Q === void 0 || Q.onReceiveStatus({
          code: A.code,
          details: A.details,
          metadata: A.metadata
        })
      })
    }
    cancelWithStatus(A, Q) {
      this.trace("cancelWithStatus code: " + A + ' details: "' + Q + '"'), this.reportStatus({
        code: A,
        details: Q,
        metadata: new fj5.Metadata
      });
      for (let {
          call: B
        }
        of this.underlyingCalls) B.cancelWithStatus(A, Q)
    }
    getPeer() {
      if (this.committedCallIndex !== null) return this.underlyingCalls[this.committedCallIndex].call.getPeer();
      else return "unknown"
    }
    getBufferEntry(A) {
      var Q;
      return (Q = this.writeBuffer[A - this.writeBufferOffset]) !== null && Q !== void 0 ? Q : {
        entryType: "FREED",
        allocated: !1
      }
    }
    getNextBufferIndex() {
      return this.writeBufferOffset + this.writeBuffer.length
    }
    clearSentMessages() {
      if (this.state !== "COMMITTED") return;
      let A;
      if (this.underlyingCalls[this.committedCallIndex].state === "COMPLETED") A = this.getNextBufferIndex();
      else A = this.underlyingCalls[this.committedCallIndex].nextMessageToSend;
      for (let Q = this.writeBufferOffset; Q < A; Q++) {
        let B = this.getBufferEntry(Q);
        if (B.allocated) this.bufferTracker.free(B.message.message.length, this.callNumber)
      }
      this.writeBuffer = this.writeBuffer.slice(A - this.writeBufferOffset), this.writeBufferOffset = A
    }
    commitCall(A) {
      var Q, B;
      if (this.state === "COMMITTED") return;
      this.trace("Committing call [" + this.underlyingCalls[A].call.getCallNumber() + "] at index " + A), this.state = "COMMITTED", (B = (Q = this.callConfig).onCommitted) === null || B === void 0 || B.call(Q), this.committedCallIndex = A;
      for (let G = 0; G < this.underlyingCalls.length; G++) {
        if (G === A) continue;
        if (this.underlyingCalls[G].state === "COMPLETED") continue;
        this.underlyingCalls[G].state = "COMPLETED", this.underlyingCalls[G].call.cancelWithStatus(L81.Status.CANCELLED, "Discarded in favor of other hedged attempt")
      }
      this.clearSentMessages()
    }
    commitCallWithMostMessages() {
      if (this.state === "COMMITTED") return;
      let A = -1,
        Q = -1;
      for (let [B, G] of this.underlyingCalls.entries())
        if (G.state === "ACTIVE" && G.nextMessageToSend > A) A = G.nextMessageToSend, Q = B;
      if (Q === -1) this.state = "TRANSPARENT_ONLY";
      else this.commitCall(Q)
    }
    isStatusCodeInList(A, Q) {
      return A.some((B) => {
        var G;
        return B === Q || B.toString().toLowerCase() === ((G = L81.Status[Q]) === null || G === void 0 ? void 0 : G.toLowerCase())
      })
    }
    getNextRetryJitter() {
      return Math.random() * 0.3999999999999999 + 0.8
    }
    getNextRetryBackoffMs() {
      var A;
      let Q = (A = this.callConfig) === null || A === void 0 ? void 0 : A.methodConfig.retryPolicy;
      if (!Q) return 0;
      let G = this.getNextRetryJitter() * this.nextRetryBackoffSec * 1000,
        Z = Number(Q.maxBackoff.substring(0, Q.maxBackoff.length - 1));
      return this.nextRetryBackoffSec = Math.min(this.nextRetryBackoffSec * Q.backoffMultiplier, Z), G
    }
    maybeRetryCall(A, Q) {
      if (this.state !== "RETRY") {
        Q(!1);
        return
      }
      if (this.attempts >= this.maxAttempts) {
        Q(!1);
        return
      }
      let B;
      if (A === null) B = this.getNextRetryBackoffMs();
      else if (A < 0) {
        this.state = "TRANSPARENT_ONLY", Q(!1);
        return
      } else B = A, this.nextRetryBackoffSec = this.initialRetryBackoffSec;
      setTimeout(() => {
        var G, Z;
        if (this.state !== "RETRY") {
          Q(!1);
          return
        }
        if ((Z = (G = this.retryThrottler) === null || G === void 0 ? void 0 : G.canRetryCall()) !== null && Z !== void 0 ? Z : !0) Q(!0), this.attempts += 1, this.startNewAttempt();
        else this.trace("Retry attempt denied by throttling policy"), Q(!1)
      }, B)
    }
    countActiveCalls() {
      let A = 0;
      for (let Q of this.underlyingCalls)
        if ((Q === null || Q === void 0 ? void 0 : Q.state) === "ACTIVE") A += 1;
      return A
    }
    handleProcessedStatus(A, Q, B) {
      var G, Z, I;
      switch (this.state) {
        case "COMMITTED":
        case "NO_RETRY":
        case "TRANSPARENT_ONLY":
          this.commitCall(Q), this.reportStatus(A);
          break;
        case "HEDGING":
          if (this.isStatusCodeInList((G = this.callConfig.methodConfig.hedgingPolicy.nonFatalStatusCodes) !== null && G !== void 0 ? G : [], A.code)) {
            (Z = this.retryThrottler) === null || Z === void 0 || Z.addCallFailed();
            let Y;
            if (B === null) Y = 0;
            else if (B < 0) {
              this.state = "TRANSPARENT_ONLY", this.commitCall(Q), this.reportStatus(A);
              return
            } else Y = B;
            setTimeout(() => {
              if (this.maybeStartHedgingAttempt(), this.countActiveCalls() === 0) this.commitCall(Q), this.reportStatus(A)
            }, Y)
          } else this.commitCall(Q), this.reportStatus(A);
          break;
        case "RETRY":
          if (this.isStatusCodeInList(this.callConfig.methodConfig.retryPolicy.retryableStatusCodes, A.code))(I = this.retryThrottler) === null || I === void 0 || I.addCallFailed(), this.maybeRetryCall(B, (Y) => {
            if (!Y) this.commitCall(Q), this.reportStatus(A)
          });
          else this.commitCall(Q), this.reportStatus(A);
          break
      }
    }
    getPushback(A) {
      let Q = A.get("grpc-retry-pushback-ms");
      if (Q.length === 0) return null;
      try {
        return parseInt(Q[0])
      } catch (B) {
        return -1
      }
    }
    handleChildStatus(A, Q) {
      var B;
      if (this.underlyingCalls[Q].state === "COMPLETED") return;
      if (this.trace("state=" + this.state + " handling status with progress " + A.progress + " from child [" + this.underlyingCalls[Q].call.getCallNumber() + "] in state " + this.underlyingCalls[Q].state), this.underlyingCalls[Q].state = "COMPLETED", A.code === L81.Status.OK) {
        (B = this.retryThrottler) === null || B === void 0 || B.addCallSucceeded(), this.commitCall(Q), this.reportStatus(A);
        return
      }
      if (this.state === "NO_RETRY") {
        this.commitCall(Q), this.reportStatus(A);
        return
      }
      if (this.state === "COMMITTED") {
        this.reportStatus(A);
        return
      }
      let G = this.getPushback(A.metadata);
      switch (A.progress) {
        case "NOT_STARTED":
          this.startNewAttempt();
          break;
        case "REFUSED":
          if (this.transparentRetryUsed) this.handleProcessedStatus(A, Q, G);
          else this.transparentRetryUsed = !0, this.startNewAttempt();
          break;
        case "DROP":
          this.commitCall(Q), this.reportStatus(A);
          break;
        case "PROCESSED":
          this.handleProcessedStatus(A, Q, G);
          break
      }
    }
    maybeStartHedgingAttempt() {
      if (this.state !== "HEDGING") return;
      if (!this.callConfig.methodConfig.hedgingPolicy) return;
      if (this.attempts >= this.maxAttempts) return;
      this.attempts += 1, this.startNewAttempt(), this.maybeStartHedgingTimer()
    }
    maybeStartHedgingTimer() {
      var A, Q, B;
      if (this.hedgingTimer) clearTimeout(this.hedgingTimer);
      if (this.state !== "HEDGING") return;
      if (!this.callConfig.methodConfig.hedgingPolicy) return;
      let G = this.callConfig.methodConfig.hedgingPolicy;
      if (this.attempts >= this.maxAttempts) return;
      let Z = (A = G.hedgingDelay) !== null && A !== void 0 ? A : "0s",
        I = Number(Z.substring(0, Z.length - 1));
      this.hedgingTimer = setTimeout(() => {
        this.maybeStartHedgingAttempt()
      }, I * 1000), (B = (Q = this.hedgingTimer).unref) === null || B === void 0 || B.call(Q)
    }
    startNewAttempt() {
      let A = this.channel.createLoadBalancingCall(this.callConfig, this.methodName, this.host, this.credentials, this.deadline);
      this.trace("Created child call [" + A.getCallNumber() + "] for attempt " + this.attempts);
      let Q = this.underlyingCalls.length;
      this.underlyingCalls.push({
        state: "ACTIVE",
        call: A,
        nextMessageToSend: 0,
        startTime: new Date
      });
      let B = this.attempts - 1,
        G = this.initialMetadata.clone();
      if (B > 0) G.set(h90, `${B}`);
      let Z = !1;
      if (A.start(G, {
          onReceiveMetadata: (I) => {
            if (this.trace("Received metadata from child [" + A.getCallNumber() + "]"), this.commitCall(Q), Z = !0, B > 0) I.set(h90, `${B}`);
            if (this.underlyingCalls[Q].state === "ACTIVE") this.listener.onReceiveMetadata(I)
          },
          onReceiveMessage: (I) => {
            if (this.trace("Received message from child [" + A.getCallNumber() + "]"), this.commitCall(Q), this.underlyingCalls[Q].state === "ACTIVE") this.listener.onReceiveMessage(I)
          },
          onReceiveStatus: (I) => {
            if (this.trace("Received status from child [" + A.getCallNumber() + "]"), !Z && B > 0) I.metadata.set(h90, `${B}`);
            this.handleChildStatus(I, Q)
          }
        }), this.sendNextChildMessage(Q), this.readStarted) A.startRead()
    }
    start(A, Q) {
      this.trace("start called"), this.listener = Q, this.initialMetadata = A, this.attempts += 1, this.startNewAttempt(), this.maybeStartHedgingTimer()
    }
    handleChildWriteCompleted(A) {
      var Q, B;
      let G = this.underlyingCalls[A],
        Z = G.nextMessageToSend;
      (B = (Q = this.getBufferEntry(Z)).callback) === null || B === void 0 || B.call(Q), this.clearSentMessages(), G.nextMessageToSend += 1, this.sendNextChildMessage(A)
    }
    sendNextChildMessage(A) {
      let Q = this.underlyingCalls[A];
      if (Q.state === "COMPLETED") return;
      if (this.getBufferEntry(Q.nextMessageToSend)) {
        let B = this.getBufferEntry(Q.nextMessageToSend);
        switch (B.entryType) {
          case "MESSAGE":
            Q.call.sendMessageWithContext({
              callback: (G) => {
                this.handleChildWriteCompleted(A)
              }
            }, B.message.message);
            break;
          case "HALF_CLOSE":
            Q.nextMessageToSend += 1, Q.call.halfClose();
            break;
          case "FREED":
            break
        }
      }
    }
    sendMessageWithContext(A, Q) {
      var B;
      this.trace("write() called with message of length " + Q.length);
      let G = {
          message: Q,
          flags: A.flags
        },
        Z = this.getNextBufferIndex(),
        I = {
          entryType: "MESSAGE",
          message: G,
          allocated: this.bufferTracker.allocate(Q.length, this.callNumber)
        };
      if (this.writeBuffer.push(I), I.allocated) {
        (B = A.callback) === null || B === void 0 || B.call(A);
        for (let [Y, J] of this.underlyingCalls.entries())
          if (J.state === "ACTIVE" && J.nextMessageToSend === Z) J.call.sendMessageWithContext({
            callback: (W) => {
              this.handleChildWriteCompleted(Y)
            }
          }, Q)
      } else {
        if (this.commitCallWithMostMessages(), this.committedCallIndex === null) return;
        let Y = this.underlyingCalls[this.committedCallIndex];
        if (I.callback = A.callback, Y.state === "ACTIVE" && Y.nextMessageToSend === Z) Y.call.sendMessageWithContext({
          callback: (J) => {
            this.handleChildWriteCompleted(this.committedCallIndex)
          }
        }, Q)
      }
    }
    startRead() {
      this.trace("startRead called"), this.readStarted = !0;
      for (let A of this.underlyingCalls)
        if ((A === null || A === void 0 ? void 0 : A.state) === "ACTIVE") A.call.startRead()
    }
    halfClose() {
      this.trace("halfClose called");
      let A = this.getNextBufferIndex();
      this.writeBuffer.push({
        entryType: "HALF_CLOSE",
        allocated: !1
      });
      for (let Q of this.underlyingCalls)
        if ((Q === null || Q === void 0 ? void 0 : Q.state) === "ACTIVE" && Q.nextMessageToSend === A) Q.nextMessageToSend += 1, Q.call.halfClose()
    }
    setCredentials(A) {
      throw Error("Method not implemented.")
    }
    getMethod() {
      return this.methodName
    }
    getHost() {
      return this.host
    }
    getAuthContext() {
      if (this.committedCallIndex !== null) return this.underlyingCalls[this.committedCallIndex].call.getAuthContext();
      else return null
    }
  }
  I$2.RetryingCall = Z$2
})
// @from(Start 10952330, End 10954424)
iOA = z((X$2) => {
  Object.defineProperty(X$2, "__esModule", {
    value: !0
  });
  X$2.BaseSubchannelWrapper = void 0;
  class W$2 {
    constructor(A) {
      this.child = A, this.healthy = !0, this.healthListeners = new Set, this.refcount = 0, this.dataWatchers = new Set, A.addHealthStateWatcher((Q) => {
        if (this.healthy) this.updateHealthListeners()
      })
    }
    updateHealthListeners() {
      for (let A of this.healthListeners) A(this.isHealthy())
    }
    getConnectivityState() {
      return this.child.getConnectivityState()
    }
    addConnectivityStateListener(A) {
      this.child.addConnectivityStateListener(A)
    }
    removeConnectivityStateListener(A) {
      this.child.removeConnectivityStateListener(A)
    }
    startConnecting() {
      this.child.startConnecting()
    }
    getAddress() {
      return this.child.getAddress()
    }
    throttleKeepalive(A) {
      this.child.throttleKeepalive(A)
    }
    ref() {
      this.child.ref(), this.refcount += 1
    }
    unref() {
      if (this.child.unref(), this.refcount -= 1, this.refcount === 0) this.destroy()
    }
    destroy() {
      for (let A of this.dataWatchers) A.destroy()
    }
    getChannelzRef() {
      return this.child.getChannelzRef()
    }
    isHealthy() {
      return this.healthy && this.child.isHealthy()
    }
    addHealthStateWatcher(A) {
      this.healthListeners.add(A)
    }
    removeHealthStateWatcher(A) {
      this.healthListeners.delete(A)
    }
    addDataWatcher(A) {
      A.setSubchannel(this.getRealSubchannel()), this.dataWatchers.add(A)
    }
    setHealthy(A) {
      if (A !== this.healthy) {
        if (this.healthy = A, this.child.isHealthy()) this.updateHealthListeners()
      }
    }
    getRealSubchannel() {
      return this.child.getRealSubchannel()
    }
    realSubchannelEquals(A) {
      return this.getRealSubchannel() === A.getRealSubchannel()
    }
    getCallCredentials() {
      return this.child.getCallCredentials()
    }
    getChannel() {
      return this.child.getChannel()
    }
  }
  X$2.BaseSubchannelWrapper = W$2
})
// @from(Start 10954430, End 10970463)
d90 = z((E$2) => {
  Object.defineProperty(E$2, "__esModule", {
    value: !0
  });
  E$2.InternalChannel = E$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = void 0;
  var cj5 = AJA(),
    pj5 = mH2(),
    lj5 = pU2(),
    m90 = Ph(),
    ij5 = YK(),
    An = E6(),
    nj5 = H81(),
    aj5 = L90(),
    F$2 = CP(),
    M81 = zZ(),
    sj5 = k90(),
    O81 = uE(),
    FO = mE(),
    nOA = ti(),
    rj5 = rU2(),
    oj5 = CJA(),
    tj5 = Q$2(),
    g90 = K81(),
    ej5 = gOA(),
    u90 = J$2(),
    AS5 = iOA(),
    QS5 = 2147483647,
    BS5 = 1000,
    GS5 = 1800000,
    R81 = new Map,
    ZS5 = 16777216,
    IS5 = 1048576;
  class K$2 extends AS5.BaseSubchannelWrapper {
    constructor(A, Q) {
      super(A);
      this.channel = Q, this.refCount = 0, this.subchannelStateListener = (B, G, Z, I) => {
        Q.throttleKeepalive(I)
      }
    }
    ref() {
      if (this.refCount === 0) this.child.addConnectivityStateListener(this.subchannelStateListener), this.channel.addWrappedSubchannel(this);
      this.child.ref(), this.refCount += 1
    }
    unref() {
      if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) this.child.removeConnectivityStateListener(this.subchannelStateListener), this.channel.removeWrappedSubchannel(this)
    }
  }
  class D$2 {
    pick(A) {
      return {
        pickResultType: m90.PickResultType.DROP,
        status: {
          code: An.Status.UNAVAILABLE,
          details: "Channel closed before call started",
          metadata: new ij5.Metadata
        },
        subchannel: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }
  E$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = "grpc.internal.no_subchannel";
  class H$2 {
    constructor(A) {
      this.target = A, this.trace = new nOA.ChannelzTrace, this.callTracker = new nOA.ChannelzCallTracker, this.childrenTracker = new nOA.ChannelzChildrenTracker, this.state = FO.ConnectivityState.IDLE
    }
    getChannelzInfoCallback() {
      return () => {
        return {
          target: this.target,
          state: this.state,
          trace: this.trace,
          callTracker: this.callTracker,
          children: this.childrenTracker.getChildLists()
        }
      }
    }
  }
  class C$2 {
    constructor(A, Q, B) {
      var G, Z, I, Y, J, W;
      if (this.credentials = Q, this.options = B, this.connectivityState = FO.ConnectivityState.IDLE, this.currentPicker = new m90.UnavailablePicker, this.configSelectionQueue = [], this.pickQueue = [], this.connectivityStateWatchers = [], this.callRefTimer = null, this.configSelector = null, this.currentResolutionError = null, this.wrappedSubchannels = new Set, this.callCount = 0, this.idleTimer = null, this.channelzEnabled = !0, this.randomChannelId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER), typeof A !== "string") throw TypeError("Channel target must be a string");
      if (!(Q instanceof cj5.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
      if (B) {
        if (typeof B !== "object") throw TypeError("Channel options must be an object")
      }
      this.channelzInfoTracker = new H$2(A);
      let X = (0, O81.parseUri)(A);
      if (X === null) throw Error(`Could not parse target name "${A}"`);
      let V = (0, F$2.mapUriDefaultScheme)(X);
      if (V === null) throw Error(`Could not find a default scheme for target name "${A}"`);
      if (this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1;
      if (this.channelzRef = (0, nOA.registerChannelzChannel)(A, this.channelzInfoTracker.getChannelzInfoCallback(), this.channelzEnabled), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Channel created");
      if (this.options["grpc.default_authority"]) this.defaultAuthority = this.options["grpc.default_authority"];
      else this.defaultAuthority = (0, F$2.getDefaultAuthority)(V);
      let F = (0, sj5.mapProxyName)(V, B);
      this.target = F.target, this.options = Object.assign({}, this.options, F.extraOptions), this.subchannelPool = (0, lj5.getSubchannelPool)(((G = this.options["grpc.use_local_subchannel_pool"]) !== null && G !== void 0 ? G : 0) === 0), this.retryBufferTracker = new u90.MessageBufferTracker((Z = this.options["grpc.retry_buffer_size"]) !== null && Z !== void 0 ? Z : ZS5, (I = this.options["grpc.per_rpc_retry_buffer_size"]) !== null && I !== void 0 ? I : IS5), this.keepaliveTime = (Y = this.options["grpc.keepalive_time_ms"]) !== null && Y !== void 0 ? Y : -1, this.idleTimeoutMs = Math.max((J = this.options["grpc.client_idle_timeout_ms"]) !== null && J !== void 0 ? J : GS5, BS5);
      let K = {
        createSubchannel: (H, C) => {
          let E = {};
          for (let [w, N] of Object.entries(C))
            if (!w.startsWith(E$2.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX)) E[w] = N;
          let U = this.subchannelPool.getOrCreateSubchannel(this.target, H, E, this.credentials);
          if (U.throttleKeepalive(this.keepaliveTime), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Created subchannel or used existing subchannel", U.getChannelzRef());
          return new K$2(U, this)
        },
        updateState: (H, C) => {
          this.currentPicker = C;
          let E = this.pickQueue.slice();
          if (this.pickQueue = [], E.length > 0) this.callRefTimerUnref();
          for (let U of E) U.doPick();
          this.updateState(H)
        },
        requestReresolution: () => {
          throw Error("Resolving load balancer should never call requestReresolution")
        },
        addChannelzChild: (H) => {
          if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.refChild(H)
        },
        removeChannelzChild: (H) => {
          if (this.channelzEnabled) this.channelzInfoTracker.childrenTracker.unrefChild(H)
        }
      };
      this.resolvingLoadBalancer = new pj5.ResolvingLoadBalancer(this.target, K, this.options, (H, C) => {
        var E;
        if (H.retryThrottling) R81.set(this.getTarget(), new u90.RetryThrottler(H.retryThrottling.maxTokens, H.retryThrottling.tokenRatio, R81.get(this.getTarget())));
        else R81.delete(this.getTarget());
        if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Address resolution succeeded");
        (E = this.configSelector) === null || E === void 0 || E.unref(), this.configSelector = C, this.currentResolutionError = null, process.nextTick(() => {
          let U = this.configSelectionQueue;
          if (this.configSelectionQueue = [], U.length > 0) this.callRefTimerUnref();
          for (let q of U) q.getConfig()
        })
      }, (H) => {
        if (this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_WARNING", "Address resolution failed with code " + H.code + ' and details "' + H.details + '"');
        if (this.configSelectionQueue.length > 0) this.trace("Name resolution failed with calls queued for config selection");
        if (this.configSelector === null) this.currentResolutionError = Object.assign(Object.assign({}, (0, ej5.restrictControlPlaneStatusCode)(H.code, H.details)), {
          metadata: H.metadata
        });
        let C = this.configSelectionQueue;
        if (this.configSelectionQueue = [], C.length > 0) this.callRefTimerUnref();
        for (let E of C) E.reportResolverError(H)
      }), this.filterStackFactory = new nj5.FilterStackFactory([new aj5.CompressionFilterFactory(this, this.options)]), this.trace("Channel constructed with options " + JSON.stringify(B, void 0, 2));
      let D = Error();
      if ((0, M81.isTracerEnabled)("channel_stacktrace"))(0, M81.trace)(An.LogVerbosity.DEBUG, "channel_stacktrace", "(" + this.channelzRef.id + `) Channel constructed 
` + ((W = D.stack) === null || W === void 0 ? void 0 : W.substring(D.stack.indexOf(`
`) + 1)));
      this.lastActivityTimestamp = new Date
    }
    trace(A, Q) {
      (0, M81.trace)(Q !== null && Q !== void 0 ? Q : An.LogVerbosity.DEBUG, "channel", "(" + this.channelzRef.id + ") " + (0, O81.uriToString)(this.target) + " " + A)
    }
    callRefTimerRef() {
      var A, Q, B, G;
      if (!this.callRefTimer) this.callRefTimer = setInterval(() => {}, QS5);
      if (!((Q = (A = this.callRefTimer).hasRef) === null || Q === void 0 ? void 0 : Q.call(A))) this.trace("callRefTimer.ref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (G = (B = this.callRefTimer).ref) === null || G === void 0 || G.call(B)
    }
    callRefTimerUnref() {
      var A, Q, B;
      if (!((A = this.callRefTimer) === null || A === void 0 ? void 0 : A.hasRef) || this.callRefTimer.hasRef()) this.trace("callRefTimer.unref | configSelectionQueue.length=" + this.configSelectionQueue.length + " pickQueue.length=" + this.pickQueue.length), (B = (Q = this.callRefTimer) === null || Q === void 0 ? void 0 : Q.unref) === null || B === void 0 || B.call(Q)
    }
    removeConnectivityStateWatcher(A) {
      let Q = this.connectivityStateWatchers.findIndex((B) => B === A);
      if (Q >= 0) this.connectivityStateWatchers.splice(Q, 1)
    }
    updateState(A) {
      if ((0, M81.trace)(An.LogVerbosity.DEBUG, "connectivity_state", "(" + this.channelzRef.id + ") " + (0, O81.uriToString)(this.target) + " " + FO.ConnectivityState[this.connectivityState] + " -> " + FO.ConnectivityState[A]), this.channelzEnabled) this.channelzInfoTracker.trace.addTrace("CT_INFO", "Connectivity state change to " + FO.ConnectivityState[A]);
      this.connectivityState = A, this.channelzInfoTracker.state = A;
      let Q = this.connectivityStateWatchers.slice();
      for (let B of Q)
        if (A !== B.currentState) {
          if (B.timer) clearTimeout(B.timer);
          this.removeConnectivityStateWatcher(B), B.callback()
        } if (A !== FO.ConnectivityState.TRANSIENT_FAILURE) this.currentResolutionError = null
    }
    throttleKeepalive(A) {
      if (A > this.keepaliveTime) {
        this.keepaliveTime = A;
        for (let Q of this.wrappedSubchannels) Q.throttleKeepalive(A)
      }
    }
    addWrappedSubchannel(A) {
      this.wrappedSubchannels.add(A)
    }
    removeWrappedSubchannel(A) {
      this.wrappedSubchannels.delete(A)
    }
    doPick(A, Q) {
      return this.currentPicker.pick({
        metadata: A,
        extraPickInfo: Q
      })
    }
    queueCallForPick(A) {
      this.pickQueue.push(A), this.callRefTimerRef()
    }
    getConfig(A, Q) {
      if (this.connectivityState !== FO.ConnectivityState.SHUTDOWN) this.resolvingLoadBalancer.exitIdle();
      if (this.configSelector) return {
        type: "SUCCESS",
        config: this.configSelector.invoke(A, Q, this.randomChannelId)
      };
      else if (this.currentResolutionError) return {
        type: "ERROR",
        error: this.currentResolutionError
      };
      else return {
        type: "NONE"
      }
    }
    queueCallForConfig(A) {
      this.configSelectionQueue.push(A), this.callRefTimerRef()
    }
    enterIdle() {
      if (this.resolvingLoadBalancer.destroy(), this.updateState(FO.ConnectivityState.IDLE), this.currentPicker = new m90.QueuePicker(this.resolvingLoadBalancer), this.idleTimer) clearTimeout(this.idleTimer), this.idleTimer = null;
      if (this.callRefTimer) clearInterval(this.callRefTimer), this.callRefTimer = null
    }
    startIdleTimeout(A) {
      var Q, B;
      this.idleTimer = setTimeout(() => {
        if (this.callCount > 0) {
          this.startIdleTimeout(this.idleTimeoutMs);
          return
        }
        let Z = new Date().valueOf() - this.lastActivityTimestamp.valueOf();
        if (Z >= this.idleTimeoutMs) this.trace("Idle timer triggered after " + this.idleTimeoutMs + "ms of inactivity"), this.enterIdle();
        else this.startIdleTimeout(this.idleTimeoutMs - Z)
      }, A), (B = (Q = this.idleTimer).unref) === null || B === void 0 || B.call(Q)
    }
    maybeStartIdleTimer() {
      if (this.connectivityState !== FO.ConnectivityState.SHUTDOWN && !this.idleTimer) this.startIdleTimeout(this.idleTimeoutMs)
    }
    onCallStart() {
      if (this.channelzEnabled) this.channelzInfoTracker.callTracker.addCallStarted();
      this.callCount += 1
    }
    onCallEnd(A) {
      if (this.channelzEnabled)
        if (A.code === An.Status.OK) this.channelzInfoTracker.callTracker.addCallSucceeded();
        else this.channelzInfoTracker.callTracker.addCallFailed();
      this.callCount -= 1, this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer()
    }
    createLoadBalancingCall(A, Q, B, G, Z) {
      let I = (0, g90.getNextCallNumber)();
      return this.trace("createLoadBalancingCall [" + I + '] method="' + Q + '"'), new rj5.LoadBalancingCall(this, A, Q, B, G, Z, I)
    }
    createRetryingCall(A, Q, B, G, Z) {
      let I = (0, g90.getNextCallNumber)();
      return this.trace("createRetryingCall [" + I + '] method="' + Q + '"'), new u90.RetryingCall(this, A, Q, B, G, Z, I, this.retryBufferTracker, R81.get(this.getTarget()))
    }
    createResolvingCall(A, Q, B, G, Z) {
      let I = (0, g90.getNextCallNumber)();
      this.trace("createResolvingCall [" + I + '] method="' + A + '", deadline=' + (0, oj5.deadlineToString)(Q));
      let Y = {
          deadline: Q,
          flags: Z !== null && Z !== void 0 ? Z : An.Propagate.DEFAULTS,
          host: B !== null && B !== void 0 ? B : this.defaultAuthority,
          parentCall: G
        },
        J = new tj5.ResolvingCall(this, A, Y, this.filterStackFactory.clone(), I);
      return this.onCallStart(), J.addStatusWatcher((W) => {
        this.onCallEnd(W)
      }), J
    }
    close() {
      var A;
      this.resolvingLoadBalancer.destroy(), this.updateState(FO.ConnectivityState.SHUTDOWN), this.currentPicker = new D$2;
      for (let Q of this.configSelectionQueue) Q.cancelWithStatus(An.Status.UNAVAILABLE, "Channel closed before call started");
      this.configSelectionQueue = [];
      for (let Q of this.pickQueue) Q.cancelWithStatus(An.Status.UNAVAILABLE, "Channel closed before call started");
      if (this.pickQueue = [], this.callRefTimer) clearInterval(this.callRefTimer);
      if (this.idleTimer) clearTimeout(this.idleTimer);
      if (this.channelzEnabled)(0, nOA.unregisterChannelzRef)(this.channelzRef);
      this.subchannelPool.unrefUnusedSubchannels(), (A = this.configSelector) === null || A === void 0 || A.unref(), this.configSelector = null
    }
    getTarget() {
      return (0, O81.uriToString)(this.target)
    }
    getConnectivityState(A) {
      let Q = this.connectivityState;
      if (A) this.resolvingLoadBalancer.exitIdle(), this.lastActivityTimestamp = new Date, this.maybeStartIdleTimer();
      return Q
    }
    watchConnectivityState(A, Q, B) {
      if (this.connectivityState === FO.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
      let G = null;
      if (Q !== 1 / 0) {
        let I = Q instanceof Date ? Q : new Date(Q),
          Y = new Date;
        if (Q === -1 / 0 || I <= Y) {
          process.nextTick(B, Error("Deadline passed without connectivity state change"));
          return
        }
        G = setTimeout(() => {
          this.removeConnectivityStateWatcher(Z), B(Error("Deadline passed without connectivity state change"))
        }, I.getTime() - Y.getTime())
      }
      let Z = {
        currentState: A,
        callback: B,
        timer: G
      };
      this.connectivityStateWatchers.push(Z)
    }
    getChannelzRef() {
      return this.channelzRef
    }
    createCall(A, Q, B, G, Z) {
      if (typeof A !== "string") throw TypeError("Channel#createCall: method must be a string");
      if (!(typeof Q === "number" || Q instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
      if (this.connectivityState === FO.ConnectivityState.SHUTDOWN) throw Error("Channel has been shut down");
      return this.createResolvingCall(A, Q, B, G, Z)
    }
    getOptions() {
      return this.options
    }
  }
  E$2.InternalChannel = C$2
})
// @from(Start 10970469, End 10971826)
N20 = z((w$2) => {
  Object.defineProperty(w$2, "__esModule", {
    value: !0
  });
  w$2.ChannelImplementation = void 0;
  var YS5 = AJA(),
    JS5 = d90();
  class $$2 {
    constructor(A, Q, B) {
      if (typeof A !== "string") throw TypeError("Channel target must be a string");
      if (!(Q instanceof YS5.ChannelCredentials)) throw TypeError("Channel credentials must be a ChannelCredentials object");
      if (B) {
        if (typeof B !== "object") throw TypeError("Channel options must be an object")
      }
      this.internalChannel = new JS5.InternalChannel(A, Q, B)
    }
    close() {
      this.internalChannel.close()
    }
    getTarget() {
      return this.internalChannel.getTarget()
    }
    getConnectivityState(A) {
      return this.internalChannel.getConnectivityState(A)
    }
    watchConnectivityState(A, Q, B) {
      this.internalChannel.watchConnectivityState(A, Q, B)
    }
    getChannelzRef() {
      return this.internalChannel.getChannelzRef()
    }
    createCall(A, Q, B, G, Z) {
      if (typeof A !== "string") throw TypeError("Channel#createCall: method must be a string");
      if (!(typeof Q === "number" || Q instanceof Date)) throw TypeError("Channel#createCall: deadline must be a number or Date");
      return this.internalChannel.createCall(A, Q, B, G, Z)
    }
  }
  w$2.ChannelImplementation = $$2
})
// @from(Start 10971832, End 10976531)
j$2 = z((T$2) => {
  Object.defineProperty(T$2, "__esModule", {
    value: !0
  });
  T$2.ServerDuplexStreamImpl = T$2.ServerWritableStreamImpl = T$2.ServerReadableStreamImpl = T$2.ServerUnaryCallImpl = void 0;
  T$2.serverErrorToStatus = l90;
  var WS5 = UA("events"),
    c90 = UA("stream"),
    p90 = E6(),
    N$2 = YK();

  function l90(A, Q) {
    var B;
    let G = {
      code: p90.Status.UNKNOWN,
      details: "message" in A ? A.message : "Unknown Error",
      metadata: (B = Q !== null && Q !== void 0 ? Q : A.metadata) !== null && B !== void 0 ? B : null
    };
    if ("code" in A && typeof A.code === "number" && Number.isInteger(A.code)) {
      if (G.code = A.code, "details" in A && typeof A.details === "string") G.details = A.details
    }
    return G
  }
  class L$2 extends WS5.EventEmitter {
    constructor(A, Q, B, G) {
      super();
      this.path = A, this.call = Q, this.metadata = B, this.request = G, this.cancelled = !1
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
  }
  T$2.ServerUnaryCallImpl = L$2;
  class M$2 extends c90.Readable {
    constructor(A, Q, B) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.cancelled = !1
    }
    _read(A) {
      this.call.startRead()
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
  }
  T$2.ServerReadableStreamImpl = M$2;
  class O$2 extends c90.Writable {
    constructor(A, Q, B, G) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.request = G, this.pendingStatus = {
        code: p90.Status.OK,
        details: "OK"
      }, this.cancelled = !1, this.trailingMetadata = new N$2.Metadata, this.on("error", (Z) => {
        this.pendingStatus = l90(Z), this.end()
      })
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
    _write(A, Q, B) {
      this.call.sendMessage(A, B)
    }
    _final(A) {
      var Q;
      A(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
        metadata: (Q = this.pendingStatus.metadata) !== null && Q !== void 0 ? Q : this.trailingMetadata
      }))
    }
    end(A) {
      if (A) this.trailingMetadata = A;
      return super.end()
    }
  }
  T$2.ServerWritableStreamImpl = O$2;
  class R$2 extends c90.Duplex {
    constructor(A, Q, B) {
      super({
        objectMode: !0
      });
      this.path = A, this.call = Q, this.metadata = B, this.pendingStatus = {
        code: p90.Status.OK,
        details: "OK"
      }, this.cancelled = !1, this.trailingMetadata = new N$2.Metadata, this.on("error", (G) => {
        this.pendingStatus = l90(G), this.end()
      })
    }
    getPeer() {
      return this.call.getPeer()
    }
    sendMetadata(A) {
      this.call.sendMetadata(A)
    }
    getDeadline() {
      return this.call.getDeadline()
    }
    getPath() {
      return this.path
    }
    getHost() {
      return this.call.getHost()
    }
    getAuthContext() {
      return this.call.getAuthContext()
    }
    getMetricsRecorder() {
      return this.call.getMetricsRecorder()
    }
    _read(A) {
      this.call.startRead()
    }
    _write(A, Q, B) {
      this.call.sendMessage(A, B)
    }
    _final(A) {
      var Q;
      A(null), this.call.sendStatus(Object.assign(Object.assign({}, this.pendingStatus), {
        metadata: (Q = this.pendingStatus.metadata) !== null && Q !== void 0 ? Q : this.trailingMetadata
      }))
    }
    end(A) {
      if (A) this.trailingMetadata = A;
      return super.end()
    }
  }
  T$2.ServerDuplexStreamImpl = R$2
})
// @from(Start 10976537, End 10983784)
T81 = z((S$2) => {
  Object.defineProperty(S$2, "__esModule", {
    value: !0
  });
  S$2.ServerCredentials = void 0;
  S$2.createCertificateProviderServerCredentials = DS5;
  S$2.createServerCredentialsWithInterceptors = HS5;
  var i90 = J20();
  class wJA {
    constructor(A, Q) {
      this.serverConstructorOptions = A, this.watchers = new Set, this.latestContextOptions = null, this.latestContextOptions = Q !== null && Q !== void 0 ? Q : null
    }
    _addWatcher(A) {
      this.watchers.add(A)
    }
    _removeWatcher(A) {
      this.watchers.delete(A)
    }
    getWatcherCount() {
      return this.watchers.size
    }
    updateSecureContextOptions(A) {
      this.latestContextOptions = A;
      for (let Q of this.watchers) Q(this.latestContextOptions)
    }
    _isSecure() {
      return this.serverConstructorOptions !== null
    }
    _getSecureContextOptions() {
      return this.latestContextOptions
    }
    _getConstructorOptions() {
      return this.serverConstructorOptions
    }
    _getInterceptors() {
      return []
    }
    static createInsecure() {
      return new n90
    }
    static createSsl(A, Q, B = !1) {
      var G;
      if (A !== null && !Buffer.isBuffer(A)) throw TypeError("rootCerts must be null or a Buffer");
      if (!Array.isArray(Q)) throw TypeError("keyCertPairs must be an array");
      if (typeof B !== "boolean") throw TypeError("checkClientCertificate must be a boolean");
      let Z = [],
        I = [];
      for (let Y = 0; Y < Q.length; Y++) {
        let J = Q[Y];
        if (J === null || typeof J !== "object") throw TypeError(`keyCertPair[${Y}] must be an object`);
        if (!Buffer.isBuffer(J.private_key)) throw TypeError(`keyCertPair[${Y}].private_key must be a Buffer`);
        if (!Buffer.isBuffer(J.cert_chain)) throw TypeError(`keyCertPair[${Y}].cert_chain must be a Buffer`);
        Z.push(J.cert_chain), I.push(J.private_key)
      }
      return new a90({
        requestCert: B,
        ciphers: i90.CIPHER_SUITES
      }, {
        ca: (G = A !== null && A !== void 0 ? A : (0, i90.getDefaultRootsData)()) !== null && G !== void 0 ? G : void 0,
        cert: Z,
        key: I
      })
    }
  }
  S$2.ServerCredentials = wJA;
  class n90 extends wJA {
    constructor() {
      super(null)
    }
    _getSettings() {
      return null
    }
    _equals(A) {
      return A instanceof n90
    }
  }
  class a90 extends wJA {
    constructor(A, Q) {
      super(A, Q);
      this.options = Object.assign(Object.assign({}, A), Q)
    }
    _equals(A) {
      if (this === A) return !0;
      if (!(A instanceof a90)) return !1;
      if (Buffer.isBuffer(this.options.ca) && Buffer.isBuffer(A.options.ca)) {
        if (!this.options.ca.equals(A.options.ca)) return !1
      } else if (this.options.ca !== A.options.ca) return !1;
      if (Array.isArray(this.options.cert) && Array.isArray(A.options.cert)) {
        if (this.options.cert.length !== A.options.cert.length) return !1;
        for (let Q = 0; Q < this.options.cert.length; Q++) {
          let B = this.options.cert[Q],
            G = A.options.cert[Q];
          if (Buffer.isBuffer(B) && Buffer.isBuffer(G)) {
            if (!B.equals(G)) return !1
          } else if (B !== G) return !1
        }
      } else if (this.options.cert !== A.options.cert) return !1;
      if (Array.isArray(this.options.key) && Array.isArray(A.options.key)) {
        if (this.options.key.length !== A.options.key.length) return !1;
        for (let Q = 0; Q < this.options.key.length; Q++) {
          let B = this.options.key[Q],
            G = A.options.key[Q];
          if (Buffer.isBuffer(B) && Buffer.isBuffer(G)) {
            if (!B.equals(G)) return !1
          } else if (B !== G) return !1
        }
      } else if (this.options.key !== A.options.key) return !1;
      if (this.options.requestCert !== A.options.requestCert) return !1;
      return !0
    }
  }
  class s90 extends wJA {
    constructor(A, Q, B) {
      super({
        requestCert: Q !== null,
        rejectUnauthorized: B,
        ciphers: i90.CIPHER_SUITES
      });
      this.identityCertificateProvider = A, this.caCertificateProvider = Q, this.requireClientCertificate = B, this.latestCaUpdate = null, this.latestIdentityUpdate = null, this.caCertificateUpdateListener = this.handleCaCertificateUpdate.bind(this), this.identityCertificateUpdateListener = this.handleIdentityCertitificateUpdate.bind(this)
    }
    _addWatcher(A) {
      var Q;
      if (this.getWatcherCount() === 0)(Q = this.caCertificateProvider) === null || Q === void 0 || Q.addCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.addIdentityCertificateListener(this.identityCertificateUpdateListener);
      super._addWatcher(A)
    }
    _removeWatcher(A) {
      var Q;
      if (super._removeWatcher(A), this.getWatcherCount() === 0)(Q = this.caCertificateProvider) === null || Q === void 0 || Q.removeCaCertificateListener(this.caCertificateUpdateListener), this.identityCertificateProvider.removeIdentityCertificateListener(this.identityCertificateUpdateListener)
    }
    _equals(A) {
      if (this === A) return !0;
      if (!(A instanceof s90)) return !1;
      return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && this.requireClientCertificate === A.requireClientCertificate
    }
    calculateSecureContextOptions() {
      var A;
      if (this.latestIdentityUpdate === null) return null;
      if (this.caCertificateProvider !== null && this.latestCaUpdate === null) return null;
      return {
        ca: (A = this.latestCaUpdate) === null || A === void 0 ? void 0 : A.caCertificate,
        cert: [this.latestIdentityUpdate.certificate],
        key: [this.latestIdentityUpdate.privateKey]
      }
    }
    finalizeUpdate() {
      let A = this.calculateSecureContextOptions();
      this.updateSecureContextOptions(A)
    }
    handleCaCertificateUpdate(A) {
      this.latestCaUpdate = A, this.finalizeUpdate()
    }
    handleIdentityCertitificateUpdate(A) {
      this.latestIdentityUpdate = A, this.finalizeUpdate()
    }
  }

  function DS5(A, Q, B) {
    return new s90(A, Q, B)
  }
  class r90 extends wJA {
    constructor(A, Q) {
      super({});
      this.childCredentials = A, this.interceptors = Q
    }
    _isSecure() {
      return this.childCredentials._isSecure()
    }
    _equals(A) {
      if (!(A instanceof r90)) return !1;
      if (!this.childCredentials._equals(A.childCredentials)) return !1;
      if (this.interceptors.length !== A.interceptors.length) return !1;
      for (let Q = 0; Q < this.interceptors.length; Q++)
        if (this.interceptors[Q] !== A.interceptors[Q]) return !1;
      return !0
    }
    _getInterceptors() {
      return this.interceptors
    }
    _addWatcher(A) {
      this.childCredentials._addWatcher(A)
    }
    _removeWatcher(A) {
      this.childCredentials._removeWatcher(A)
    }
    _getConstructorOptions() {
      return this.childCredentials._getConstructorOptions()
    }
    _getSecureContextOptions() {
      return this.childCredentials._getSecureContextOptions()
    }
  }

  function HS5(A, Q) {
    return new r90(A, Q)
  }
})
// @from(Start 10983790, End 10985019)
aOA = z((k$2) => {
  Object.defineProperty(k$2, "__esModule", {
    value: !0
  });
  k$2.durationMessageToDuration = zS5;
  k$2.msToDuration = US5;
  k$2.durationToMs = $S5;
  k$2.isDuration = wS5;
  k$2.isDurationMessage = qS5;
  k$2.parseDuration = LS5;
  k$2.durationToString = MS5;

  function zS5(A) {
    return {
      seconds: Number.parseInt(A.seconds),
      nanos: A.nanos
    }
  }

  function US5(A) {
    return {
      seconds: A / 1000 | 0,
      nanos: A % 1000 * 1e6 | 0
    }
  }

  function $S5(A) {
    return A.seconds * 1000 + A.nanos / 1e6 | 0
  }

  function wS5(A) {
    return typeof A.seconds === "number" && typeof A.nanos === "number"
  }

  function qS5(A) {
    return typeof A.seconds === "string" && typeof A.nanos === "number"
  }
  var NS5 = /^(\d+)(?:\.(\d+))?s$/;

  function LS5(A) {
    let Q = A.match(NS5);
    if (!Q) return null;
    return {
      seconds: Number.parseInt(Q[1], 10),
      nanos: Q[2] ? Number.parseInt(Q[2].padEnd(9, "0"), 10) : 0
    }
  }

  function MS5(A) {
    if (A.nanos === 0) return `${A.seconds}s`;
    let Q;
    if (A.nanos % 1e6 === 0) Q = 1e6;
    else if (A.nanos % 1000 === 0) Q = 1000;
    else Q = 1;
    return `${A.seconds}.${A.nanos/Q}s`
  }
})
// @from(Start 10985025, End 10991938)
j81 = z((c$2) => {
  var __dirname = "/home/runner/code/tmp/claude-cli-external-build-2204/node_modules/@grpc/grpc-js/build/src";
  Object.defineProperty(c$2, "__esModule", {
    value: !0
  });
  c$2.OrcaOobMetricsSubchannelWrapper = c$2.GRPC_METRICS_HEADER = c$2.ServerMetricRecorder = c$2.PerRequestMetricRecorder = void 0;
  c$2.createOrcaClient = h$2;
  c$2.createMetricsReader = hS5;
  var kS5 = f41(),
    o90 = aOA(),
    yS5 = AJA(),
    xS5 = iOA(),
    y$2 = E6(),
    vS5 = QJA(),
    bS5 = mE(),
    x$2 = null;

  function P81() {
    if (x$2) return x$2;
    let A = H90().loadSync,
      Q = A("xds/service/orca/v3/orca.proto", {
        keepCase: !0,
        longs: String,
        enums: String,
        defaults: !0,
        oneofs: !0,
        includeDirs: [`${__dirname}/../../proto/xds`, `${__dirname}/../../proto/protoc-gen-validate`]
      });
    return (0, kS5.loadPackageDefinition)(Q)
  }
  class b$2 {
    constructor() {
      this.message = {}
    }
    recordRequestCostMetric(A, Q) {
      if (!this.message.request_cost) this.message.request_cost = {};
      this.message.request_cost[A] = Q
    }
    recordUtilizationMetric(A, Q) {
      if (!this.message.utilization) this.message.utilization = {};
      this.message.utilization[A] = Q
    }
    recordNamedMetric(A, Q) {
      if (!this.message.named_metrics) this.message.named_metrics = {};
      this.message.named_metrics[A] = Q
    }
    recordCPUUtilizationMetric(A) {
      this.message.cpu_utilization = A
    }
    recordMemoryUtilizationMetric(A) {
      this.message.mem_utilization = A
    }
    recordApplicationUtilizationMetric(A) {
      this.message.application_utilization = A
    }
    recordQpsMetric(A) {
      this.message.rps_fractional = A
    }
    recordEpsMetric(A) {
      this.message.eps = A
    }
    serialize() {
      return P81().xds.data.orca.v3.OrcaLoadReport.serialize(this.message)
    }
  }
  c$2.PerRequestMetricRecorder = b$2;
  var fS5 = 30000;
  class f$2 {
    constructor() {
      this.message = {}, this.serviceImplementation = {
        StreamCoreMetrics: (A) => {
          let Q = A.request.report_interval ? (0, o90.durationToMs)((0, o90.durationMessageToDuration)(A.request.report_interval)) : fS5,
            B = setInterval(() => {
              A.write(this.message)
            }, Q);
          A.on("cancelled", () => {
            clearInterval(B)
          })
        }
      }
    }
    putUtilizationMetric(A, Q) {
      if (!this.message.utilization) this.message.utilization = {};
      this.message.utilization[A] = Q
    }
    setAllUtilizationMetrics(A) {
      this.message.utilization = Object.assign({}, A)
    }
    deleteUtilizationMetric(A) {
      var Q;
      (Q = this.message.utilization) === null || Q === void 0 || delete Q[A]
    }
    setCpuUtilizationMetric(A) {
      this.message.cpu_utilization = A
    }
    deleteCpuUtilizationMetric() {
      delete this.message.cpu_utilization
    }
    setApplicationUtilizationMetric(A) {
      this.message.application_utilization = A
    }
    deleteApplicationUtilizationMetric() {
      delete this.message.application_utilization
    }
    setQpsMetric(A) {
      this.message.rps_fractional = A
    }
    deleteQpsMetric() {
      delete this.message.rps_fractional
    }
    setEpsMetric(A) {
      this.message.eps = A
    }
    deleteEpsMetric() {
      delete this.message.eps
    }
    addToServer(A) {
      let Q = P81().xds.service.orca.v3.OpenRcaService.service;
      A.addService(Q, this.serviceImplementation)
    }
  }
  c$2.ServerMetricRecorder = f$2;

  function h$2(A) {
    return new(P81()).xds.service.orca.v3.OpenRcaService("unused", yS5.ChannelCredentials.createInsecure(), {
      channelOverride: A
    })
  }
  c$2.GRPC_METRICS_HEADER = "endpoint-load-metrics-bin";
  var v$2 = "grpc_orca_load_report";

  function hS5(A, Q) {
    return (B, G, Z) => {
      let I = Z.getOpaque(v$2);
      if (I) A(I);
      else {
        let Y = Z.get(c$2.GRPC_METRICS_HEADER);
        if (Y.length > 0) I = P81().xds.data.orca.v3.OrcaLoadReport.deserialize(Y[0]), A(I), Z.setOpaque(v$2, I)
      }
      if (Q) Q(B, G, Z)
    }
  }
  var g$2 = "orca_oob_metrics";
  class u$2 {
    constructor(A, Q) {
      this.metricsListener = A, this.intervalMs = Q, this.dataProducer = null
    }
    setSubchannel(A) {
      let Q = A.getOrCreateDataProducer(g$2, gS5);
      this.dataProducer = Q, Q.addDataWatcher(this)
    }
    destroy() {
      var A;
      (A = this.dataProducer) === null || A === void 0 || A.removeDataWatcher(this)
    }
    getInterval() {
      return this.intervalMs
    }
    onMetricsUpdate(A) {
      this.metricsListener(A)
    }
  }
  class m$2 {
    constructor(A) {
      this.subchannel = A, this.dataWatchers = new Set, this.orcaSupported = !0, this.metricsCall = null, this.currentInterval = 1 / 0, this.backoffTimer = new vS5.BackoffTimeout(() => this.updateMetricsSubscription()), this.subchannelStateListener = () => this.updateMetricsSubscription();
      let Q = A.getChannel();
      this.client = h$2(Q), A.addConnectivityStateListener(this.subchannelStateListener)
    }
    addDataWatcher(A) {
      this.dataWatchers.add(A), this.updateMetricsSubscription()
    }
    removeDataWatcher(A) {
      var Q;
      if (this.dataWatchers.delete(A), this.dataWatchers.size === 0) this.subchannel.removeDataProducer(g$2), (Q = this.metricsCall) === null || Q === void 0 || Q.cancel(), this.metricsCall = null, this.client.close(), this.subchannel.removeConnectivityStateListener(this.subchannelStateListener);
      else this.updateMetricsSubscription()
    }
    updateMetricsSubscription() {
      var A;
      if (this.dataWatchers.size === 0 || !this.orcaSupported || this.subchannel.getConnectivityState() !== bS5.ConnectivityState.READY) return;
      let Q = Math.min(...Array.from(this.dataWatchers).map((B) => B.getInterval()));
      if (!this.metricsCall || Q !== this.currentInterval) {
        (A = this.metricsCall) === null || A === void 0 || A.cancel(), this.currentInterval = Q;
        let B = this.client.streamCoreMetrics({
          report_interval: (0, o90.msToDuration)(Q)
        });
        this.metricsCall = B, B.on("data", (G) => {
          this.dataWatchers.forEach((Z) => {
            Z.onMetricsUpdate(G)
          })
        }), B.on("error", (G) => {
          if (this.metricsCall = null, G.code === y$2.Status.UNIMPLEMENTED) {
            this.orcaSupported = !1;
            return
          }
          if (G.code === y$2.Status.CANCELLED) return;
          this.backoffTimer.runOnce()
        })
      }
    }
  }
  class d$2 extends xS5.BaseSubchannelWrapper {
    constructor(A, Q, B) {
      super(A);
      this.addDataWatcher(new u$2(Q, B))
    }
    getWrappedSubchannel() {
      return this.child
    }
  }
  c$2.OrcaOobMetricsSubchannelWrapper = d$2;

  function gS5(A) {
    return new m$2(A)
  }
})
// @from(Start 10991944, End 11011737)
Q40 = z((Iw2) => {
  Object.defineProperty(Iw2, "__esModule", {
    value: !0
  });
  Iw2.BaseServerInterceptingCall = Iw2.ServerInterceptingCall = Iw2.ResponderBuilder = Iw2.ServerListenerBuilder = void 0;
  Iw2.isInterceptingServerListener = iS5;
  Iw2.getServerInterceptingCall = oS5;
  var k81 = YK(),
    A$ = E6(),
    qJA = UA("http2"),
    i$2 = q41(),
    n$2 = UA("zlib"),
    pS5 = y90(),
    t$2 = zZ(),
    lS5 = UA("tls"),
    a$2 = j81(),
    e$2 = "server_call";

  function J0A(A) {
    t$2.trace(A$.LogVerbosity.DEBUG, e$2, A)
  }
  class Aw2 {
    constructor() {
      this.metadata = void 0, this.message = void 0, this.halfClose = void 0, this.cancel = void 0
    }
    withOnReceiveMetadata(A) {
      return this.metadata = A, this
    }
    withOnReceiveMessage(A) {
      return this.message = A, this
    }
    withOnReceiveHalfClose(A) {
      return this.halfClose = A, this
    }
    withOnCancel(A) {
      return this.cancel = A, this
    }
    build() {
      return {
        onReceiveMetadata: this.metadata,
        onReceiveMessage: this.message,
        onReceiveHalfClose: this.halfClose,
        onCancel: this.cancel
      }
    }
  }
  Iw2.ServerListenerBuilder = Aw2;

  function iS5(A) {
    return A.onReceiveMetadata !== void 0 && A.onReceiveMetadata.length === 1
  }
  class Qw2 {
    constructor(A, Q) {
      this.listener = A, this.nextListener = Q, this.cancelled = !1, this.processingMetadata = !1, this.hasPendingMessage = !1, this.pendingMessage = null, this.processingMessage = !1, this.hasPendingHalfClose = !1
    }
    processPendingMessage() {
      if (this.hasPendingMessage) this.nextListener.onReceiveMessage(this.pendingMessage), this.pendingMessage = null, this.hasPendingMessage = !1
    }
    processPendingHalfClose() {
      if (this.hasPendingHalfClose) this.nextListener.onReceiveHalfClose(), this.hasPendingHalfClose = !1
    }
    onReceiveMetadata(A) {
      if (this.cancelled) return;
      this.processingMetadata = !0, this.listener.onReceiveMetadata(A, (Q) => {
        if (this.processingMetadata = !1, this.cancelled) return;
        this.nextListener.onReceiveMetadata(Q), this.processPendingMessage(), this.processPendingHalfClose()
      })
    }
    onReceiveMessage(A) {
      if (this.cancelled) return;
      this.processingMessage = !0, this.listener.onReceiveMessage(A, (Q) => {
        if (this.processingMessage = !1, this.cancelled) return;
        if (this.processingMetadata) this.pendingMessage = Q, this.hasPendingMessage = !0;
        else this.nextListener.onReceiveMessage(Q), this.processPendingHalfClose()
      })
    }
    onReceiveHalfClose() {
      if (this.cancelled) return;
      this.listener.onReceiveHalfClose(() => {
        if (this.cancelled) return;
        if (this.processingMetadata || this.processingMessage) this.hasPendingHalfClose = !0;
        else this.nextListener.onReceiveHalfClose()
      })
    }
    onCancel() {
      this.cancelled = !0, this.listener.onCancel(), this.nextListener.onCancel()
    }
  }
  class Bw2 {
    constructor() {
      this.start = void 0, this.metadata = void 0, this.message = void 0, this.status = void 0
    }
    withStart(A) {
      return this.start = A, this
    }
    withSendMetadata(A) {
      return this.metadata = A, this
    }
    withSendMessage(A) {
      return this.message = A, this
    }
    withSendStatus(A) {
      return this.status = A, this
    }
    build() {
      return {
        start: this.start,
        sendMetadata: this.metadata,
        sendMessage: this.message,
        sendStatus: this.status
      }
    }
  }
  Iw2.ResponderBuilder = Bw2;
  var S81 = {
      onReceiveMetadata: (A, Q) => {
        Q(A)
      },
      onReceiveMessage: (A, Q) => {
        Q(A)
      },
      onReceiveHalfClose: (A) => {
        A()
      },
      onCancel: () => {}
    },
    _81 = {
      start: (A) => {
        A()
      },
      sendMetadata: (A, Q) => {
        Q(A)
      },
      sendMessage: (A, Q) => {
        Q(A)
      },
      sendStatus: (A, Q) => {
        Q(A)
      }
    };
  class Gw2 {
    constructor(A, Q) {
      var B, G, Z, I;
      this.nextCall = A, this.processingMetadata = !1, this.sentMetadata = !1, this.processingMessage = !1, this.pendingMessage = null, this.pendingMessageCallback = null, this.pendingStatus = null, this.responder = {
        start: (B = Q === null || Q === void 0 ? void 0 : Q.start) !== null && B !== void 0 ? B : _81.start,
        sendMetadata: (G = Q === null || Q === void 0 ? void 0 : Q.sendMetadata) !== null && G !== void 0 ? G : _81.sendMetadata,
        sendMessage: (Z = Q === null || Q === void 0 ? void 0 : Q.sendMessage) !== null && Z !== void 0 ? Z : _81.sendMessage,
        sendStatus: (I = Q === null || Q === void 0 ? void 0 : Q.sendStatus) !== null && I !== void 0 ? I : _81.sendStatus
      }
    }
    processPendingMessage() {
      if (this.pendingMessageCallback) this.nextCall.sendMessage(this.pendingMessage, this.pendingMessageCallback), this.pendingMessage = null, this.pendingMessageCallback = null
    }
    processPendingStatus() {
      if (this.pendingStatus) this.nextCall.sendStatus(this.pendingStatus), this.pendingStatus = null
    }
    start(A) {
      this.responder.start((Q) => {
        var B, G, Z, I;
        let Y = {
            onReceiveMetadata: (B = Q === null || Q === void 0 ? void 0 : Q.onReceiveMetadata) !== null && B !== void 0 ? B : S81.onReceiveMetadata,
            onReceiveMessage: (G = Q === null || Q === void 0 ? void 0 : Q.onReceiveMessage) !== null && G !== void 0 ? G : S81.onReceiveMessage,
            onReceiveHalfClose: (Z = Q === null || Q === void 0 ? void 0 : Q.onReceiveHalfClose) !== null && Z !== void 0 ? Z : S81.onReceiveHalfClose,
            onCancel: (I = Q === null || Q === void 0 ? void 0 : Q.onCancel) !== null && I !== void 0 ? I : S81.onCancel
          },
          J = new Qw2(Y, A);
        this.nextCall.start(J)
      })
    }
    sendMetadata(A) {
      this.processingMetadata = !0, this.sentMetadata = !0, this.responder.sendMetadata(A, (Q) => {
        this.processingMetadata = !1, this.nextCall.sendMetadata(Q), this.processPendingMessage(), this.processPendingStatus()
      })
    }
    sendMessage(A, Q) {
      if (this.processingMessage = !0, !this.sentMetadata) this.sendMetadata(new k81.Metadata);
      this.responder.sendMessage(A, (B) => {
        if (this.processingMessage = !1, this.processingMetadata) this.pendingMessage = B, this.pendingMessageCallback = Q;
        else this.nextCall.sendMessage(B, Q)
      })
    }
    sendStatus(A) {
      this.responder.sendStatus(A, (Q) => {
        if (this.processingMetadata || this.processingMessage) this.pendingStatus = Q;
        else this.nextCall.sendStatus(Q)
      })
    }
    startRead() {
      this.nextCall.startRead()
    }
    getPeer() {
      return this.nextCall.getPeer()
    }
    getDeadline() {
      return this.nextCall.getDeadline()
    }
    getHost() {
      return this.nextCall.getHost()
    }
    getAuthContext() {
      return this.nextCall.getAuthContext()
    }
    getConnectionInfo() {
      return this.nextCall.getConnectionInfo()
    }
    getMetricsRecorder() {
      return this.nextCall.getMetricsRecorder()
    }
  }
  Iw2.ServerInterceptingCall = Gw2;
  var Zw2 = "grpc-accept-encoding",
    e90 = "grpc-encoding",
    s$2 = "grpc-message",
    r$2 = "grpc-status",
    t90 = "grpc-timeout",
    nS5 = /(\d{1,8})\s*([HMSmun])/,
    aS5 = {
      H: 3600000,
      M: 60000,
      S: 1000,
      m: 1,
      u: 0.001,
      n: 0.000001
    },
    sS5 = {
      [Zw2]: "identity,deflate,gzip",
      [e90]: "identity"
    },
    o$2 = {
      [qJA.constants.HTTP2_HEADER_STATUS]: qJA.constants.HTTP_STATUS_OK,
      [qJA.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
    },
    rS5 = {
      waitForTrailers: !0
    };
  class A40 {
    constructor(A, Q, B, G, Z) {
      var I, Y;
      if (this.stream = A, this.callEventTracker = B, this.handler = G, this.listener = null, this.deadlineTimer = null, this.deadline = 1 / 0, this.maxSendMessageSize = A$.DEFAULT_MAX_SEND_MESSAGE_LENGTH, this.maxReceiveMessageSize = A$.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH, this.cancelled = !1, this.metadataSent = !1, this.wantTrailers = !1, this.cancelNotified = !1, this.incomingEncoding = "identity", this.readQueue = [], this.isReadPending = !1, this.receivedHalfClose = !1, this.streamEnded = !1, this.metricsRecorder = new a$2.PerRequestMetricRecorder, this.stream.once("error", (F) => {}), this.stream.once("close", () => {
          var F;
          if (J0A("Request to method " + ((F = this.handler) === null || F === void 0 ? void 0 : F.path) + " stream closed with rstCode " + this.stream.rstCode), this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!1), this.callEventTracker.onCallEnd({
            code: A$.Status.CANCELLED,
            details: "Stream closed before sending status",
            metadata: null
          });
          this.notifyOnCancel()
        }), this.stream.on("data", (F) => {
          this.handleDataFrame(F)
        }), this.stream.pause(), this.stream.on("end", () => {
          this.handleEndEvent()
        }), "grpc.max_send_message_length" in Z) this.maxSendMessageSize = Z["grpc.max_send_message_length"];
      if ("grpc.max_receive_message_length" in Z) this.maxReceiveMessageSize = Z["grpc.max_receive_message_length"];
      this.host = (I = Q[":authority"]) !== null && I !== void 0 ? I : Q.host, this.decoder = new pS5.StreamDecoder(this.maxReceiveMessageSize);
      let J = k81.Metadata.fromHttp2Headers(Q);
      if (t$2.isTracerEnabled(e$2)) J0A("Request to " + this.handler.path + " received headers " + JSON.stringify(J.toJSON()));
      let W = J.get(t90);
      if (W.length > 0) this.handleTimeoutHeader(W[0]);
      let X = J.get(e90);
      if (X.length > 0) this.incomingEncoding = X[0];
      J.remove(t90), J.remove(e90), J.remove(Zw2), J.remove(qJA.constants.HTTP2_HEADER_ACCEPT_ENCODING), J.remove(qJA.constants.HTTP2_HEADER_TE), J.remove(qJA.constants.HTTP2_HEADER_CONTENT_TYPE), this.metadata = J;
      let V = (Y = A.session) === null || Y === void 0 ? void 0 : Y.socket;
      this.connectionInfo = {
        localAddress: V === null || V === void 0 ? void 0 : V.localAddress,
        localPort: V === null || V === void 0 ? void 0 : V.localPort,
        remoteAddress: V === null || V === void 0 ? void 0 : V.remoteAddress,
        remotePort: V === null || V === void 0 ? void 0 : V.remotePort
      }, this.shouldSendMetrics = !!Z["grpc.server_call_metric_recording"]
    }
    handleTimeoutHeader(A) {
      let Q = A.toString().match(nS5);
      if (Q === null) {
        let Z = {
          code: A$.Status.INTERNAL,
          details: `Invalid ${t90} value "${A}"`,
          metadata: null
        };
        process.nextTick(() => {
          this.sendStatus(Z)
        });
        return
      }
      let B = +Q[1] * aS5[Q[2]] | 0,
        G = new Date;
      this.deadline = G.setMilliseconds(G.getMilliseconds() + B), this.deadlineTimer = setTimeout(() => {
        let Z = {
          code: A$.Status.DEADLINE_EXCEEDED,
          details: "Deadline exceeded",
          metadata: null
        };
        this.sendStatus(Z)
      }, B)
    }
    checkCancelled() {
      if (!this.cancelled && (this.stream.destroyed || this.stream.closed)) this.notifyOnCancel(), this.cancelled = !0;
      return this.cancelled
    }
    notifyOnCancel() {
      if (this.cancelNotified) return;
      if (this.cancelNotified = !0, this.cancelled = !0, process.nextTick(() => {
          var A;
          (A = this.listener) === null || A === void 0 || A.onCancel()
        }), this.deadlineTimer) clearTimeout(this.deadlineTimer);
      this.stream.resume()
    }
    maybeSendMetadata() {
      if (!this.metadataSent) this.sendMetadata(new k81.Metadata)
    }
    serializeMessage(A) {
      let Q = this.handler.serialize(A),
        B = Q.byteLength,
        G = Buffer.allocUnsafe(B + 5);
      return G.writeUInt8(0, 0), G.writeUInt32BE(B, 1), Q.copy(G, 5), G
    }
    decompressMessage(A, Q) {
      let B = A.subarray(5);
      if (Q === "identity") return B;
      else if (Q === "deflate" || Q === "gzip") {
        let G;
        if (Q === "deflate") G = n$2.createInflate();
        else G = n$2.createGunzip();
        return new Promise((Z, I) => {
          let Y = 0,
            J = [];
          G.on("data", (W) => {
            if (J.push(W), Y += W.byteLength, this.maxReceiveMessageSize !== -1 && Y > this.maxReceiveMessageSize) G.destroy(), I({
              code: A$.Status.RESOURCE_EXHAUSTED,
              details: `Received message that decompresses to a size larger than ${this.maxReceiveMessageSize}`
            })
          }), G.on("end", () => {
            Z(Buffer.concat(J))
          }), G.write(B), G.end()
        })
      } else return Promise.reject({
        code: A$.Status.UNIMPLEMENTED,
        details: `Received message compressed with unsupported encoding "${Q}"`
      })
    }
    async decompressAndMaybePush(A) {
      if (A.type !== "COMPRESSED") throw Error(`Invalid queue entry type: ${A.type}`);
      let B = A.compressedMessage.readUInt8(0) === 1 ? this.incomingEncoding : "identity",
        G;
      try {
        G = await this.decompressMessage(A.compressedMessage, B)
      } catch (Z) {
        this.sendStatus(Z);
        return
      }
      try {
        A.parsedMessage = this.handler.deserialize(G)
      } catch (Z) {
        this.sendStatus({
          code: A$.Status.INTERNAL,
          details: `Error deserializing request: ${Z.message}`
        });
        return
      }
      A.type = "READABLE", this.maybePushNextMessage()
    }
    maybePushNextMessage() {
      if (this.listener && this.isReadPending && this.readQueue.length > 0 && this.readQueue[0].type !== "COMPRESSED") {
        this.isReadPending = !1;
        let A = this.readQueue.shift();
        if (A.type === "READABLE") this.listener.onReceiveMessage(A.parsedMessage);
        else this.listener.onReceiveHalfClose()
      }
    }
    handleDataFrame(A) {
      var Q;
      if (this.checkCancelled()) return;
      J0A("Request to " + this.handler.path + " received data frame of size " + A.length);
      let B;
      try {
        B = this.decoder.write(A)
      } catch (G) {
        this.sendStatus({
          code: A$.Status.RESOURCE_EXHAUSTED,
          details: G.message
        });
        return
      }
      for (let G of B) {
        this.stream.pause();
        let Z = {
          type: "COMPRESSED",
          compressedMessage: G,
          parsedMessage: null
        };
        this.readQueue.push(Z), this.decompressAndMaybePush(Z), (Q = this.callEventTracker) === null || Q === void 0 || Q.addMessageReceived()
      }
    }
    handleEndEvent() {
      this.readQueue.push({
        type: "HALF_CLOSE",
        compressedMessage: null,
        parsedMessage: null
      }), this.receivedHalfClose = !0, this.maybePushNextMessage()
    }
    start(A) {
      if (J0A("Request to " + this.handler.path + " start called"), this.checkCancelled()) return;
      this.listener = A, A.onReceiveMetadata(this.metadata)
    }
    sendMetadata(A) {
      if (this.checkCancelled()) return;
      if (this.metadataSent) return;
      this.metadataSent = !0;
      let Q = A ? A.toHttp2Headers() : null,
        B = Object.assign(Object.assign(Object.assign({}, o$2), sS5), Q);
      this.stream.respond(B, rS5)
    }
    sendMessage(A, Q) {
      if (this.checkCancelled()) return;
      let B;
      try {
        B = this.serializeMessage(A)
      } catch (G) {
        this.sendStatus({
          code: A$.Status.INTERNAL,
          details: `Error serializing response: ${(0,i$2.getErrorMessage)(G)}`,
          metadata: null
        });
        return
      }
      if (this.maxSendMessageSize !== -1 && B.length - 5 > this.maxSendMessageSize) {
        this.sendStatus({
          code: A$.Status.RESOURCE_EXHAUSTED,
          details: `Sent message larger than max (${B.length} vs. ${this.maxSendMessageSize})`,
          metadata: null
        });
        return
      }
      this.maybeSendMetadata(), J0A("Request to " + this.handler.path + " sent data frame of size " + B.length), this.stream.write(B, (G) => {
        var Z;
        if (G) {
          this.sendStatus({
            code: A$.Status.INTERNAL,
            details: `Error writing message: ${(0,i$2.getErrorMessage)(G)}`,
            metadata: null
          });
          return
        }(Z = this.callEventTracker) === null || Z === void 0 || Z.addMessageSent(), Q()
      })
    }
    sendStatus(A) {
      var Q, B, G;
      if (this.checkCancelled()) return;
      J0A("Request to method " + ((Q = this.handler) === null || Q === void 0 ? void 0 : Q.path) + " ended with status code: " + A$.Status[A.code] + " details: " + A.details);
      let Z = (G = (B = A.metadata) === null || B === void 0 ? void 0 : B.clone()) !== null && G !== void 0 ? G : new k81.Metadata;
      if (this.shouldSendMetrics) Z.set(a$2.GRPC_METRICS_HEADER, this.metricsRecorder.serialize());
      if (this.metadataSent)
        if (!this.wantTrailers) this.wantTrailers = !0, this.stream.once("wantTrailers", () => {
          if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
          let I = Object.assign({
            [r$2]: A.code,
            [s$2]: encodeURI(A.details)
          }, Z.toHttp2Headers());
          this.stream.sendTrailers(I), this.notifyOnCancel()
        }), this.stream.end();
        else this.notifyOnCancel();
      else {
        if (this.callEventTracker && !this.streamEnded) this.streamEnded = !0, this.callEventTracker.onStreamEnd(!0), this.callEventTracker.onCallEnd(A);
        let I = Object.assign(Object.assign({
          [r$2]: A.code,
          [s$2]: encodeURI(A.details)
        }, o$2), Z.toHttp2Headers());
        this.stream.respond(I, {
          endStream: !0
        }), this.notifyOnCancel()
      }
    }
    startRead() {
      if (J0A("Request to " + this.handler.path + " startRead called"), this.checkCancelled()) return;
      if (this.isReadPending = !0, this.readQueue.length === 0) {
        if (!this.receivedHalfClose) this.stream.resume()
      } else this.maybePushNextMessage()
    }
    getPeer() {
      var A;
      let Q = (A = this.stream.session) === null || A === void 0 ? void 0 : A.socket;
      if (Q === null || Q === void 0 ? void 0 : Q.remoteAddress)
        if (Q.remotePort) return `${Q.remoteAddress}:${Q.remotePort}`;
        else return Q.remoteAddress;
      else return "unknown"
    }
    getDeadline() {
      return this.deadline
    }
    getHost() {
      return this.host
    }
    getAuthContext() {
      var A;
      if (((A = this.stream.session) === null || A === void 0 ? void 0 : A.socket) instanceof lS5.TLSSocket) {
        let Q = this.stream.session.socket.getPeerCertificate();
        return {
          transportSecurityType: "ssl",
          sslPeerCertificate: Q.raw ? Q : void 0
        }
      } else return {}
    }
    getConnectionInfo() {
      return this.connectionInfo
    }
    getMetricsRecorder() {
      return this.metricsRecorder
    }
  }
  Iw2.BaseServerInterceptingCall = A40;

  function oS5(A, Q, B, G, Z, I) {
    let Y = {
        path: Z.path,
        requestStream: Z.type === "clientStream" || Z.type === "bidi",
        responseStream: Z.type === "serverStream" || Z.type === "bidi",
        requestDeserialize: Z.deserialize,
        responseSerialize: Z.serialize
      },
      J = new A40(Q, B, G, Z, I);
    return A.reduce((W, X) => {
      return X(Y, W)
    }, J)
  }
})
// @from(Start 11011743, End 11054111)
Dw2 = z((Bn) => {
  var G_5 = Bn && Bn.__runInitializers || function(A, Q, B) {
      var G = arguments.length > 2;
      for (var Z = 0; Z < Q.length; Z++) B = G ? Q[Z].call(A, B) : Q[Z].call(A);
      return G ? B : void 0
    },
    Z_5 = Bn && Bn.__esDecorate || function(A, Q, B, G, Z, I) {
      function Y(U) {
        if (U !== void 0 && typeof U !== "function") throw TypeError("Function expected");
        return U
      }
      var J = G.kind,
        W = J === "getter" ? "get" : J === "setter" ? "set" : "value",
        X = !Q && A ? G.static ? A : A.prototype : null,
        V = Q || (X ? Object.getOwnPropertyDescriptor(X, G.name) : {}),
        F, K = !1;
      for (var D = B.length - 1; D >= 0; D--) {
        var H = {};
        for (var C in G) H[C] = C === "access" ? {} : G[C];
        for (var C in G.access) H.access[C] = G.access[C];
        H.addInitializer = function(U) {
          if (K) throw TypeError("Cannot add initializers after decoration has completed");
          I.push(Y(U || null))
        };
        var E = (0, B[D])(J === "accessor" ? {
          get: V.get,
          set: V.set
        } : V[W], H);
        if (J === "accessor") {
          if (E === void 0) continue;
          if (E === null || typeof E !== "object") throw TypeError("Object expected");
          if (F = Y(E.get)) V.get = F;
          if (F = Y(E.set)) V.set = F;
          if (F = Y(E.init)) Z.unshift(F)
        } else if (F = Y(E))
          if (J === "field") Z.unshift(F);
          else V[W] = F
      }
      if (X) Object.defineProperty(X, G.name, V);
      K = !0
    };
  Object.defineProperty(Bn, "__esModule", {
    value: !0
  });
  Bn.Server = void 0;
  var Q$ = UA("http2"),
    I_5 = UA("util"),
    vW = E6(),
    MJA = j$2(),
    B40 = T81(),
    Jw2 = CP(),
    LJA = zZ(),
    Qn = eU(),
    qP = uE(),
    mV = ti(),
    Ww2 = Q40(),
    NJA = 2147483647,
    G40 = 2147483647,
    Y_5 = 20000,
    Xw2 = 2147483647,
    {
      HTTP2_HEADER_PATH: Vw2
    } = Q$.constants,
    J_5 = "server",
    Fw2 = Buffer.from("max_age");

  function Kw2(A) {
    LJA.trace(vW.LogVerbosity.DEBUG, "server_call", A)
  }

  function W_5() {}

  function X_5(A) {
    return function(Q, B) {
      return I_5.deprecate(Q, A)
    }
  }

  function Z40(A) {
    return {
      code: vW.Status.UNIMPLEMENTED,
      details: `The server does not implement the method ${A}`
    }
  }

  function V_5(A, Q) {
    let B = Z40(Q);
    switch (A) {
      case "unary":
        return (G, Z) => {
          Z(B, null)
        };
      case "clientStream":
        return (G, Z) => {
          Z(B, null)
        };
      case "serverStream":
        return (G) => {
          G.emit("error", B)
        };
      case "bidi":
        return (G) => {
          G.emit("error", B)
        };
      default:
        throw Error(`Invalid handlerType ${A}`)
    }
  }
  var F_5 = (() => {
    var A;
    let Q = [],
      B;
    return A = class {
      constructor(Z) {
        var I, Y, J, W, X, V;
        if (this.boundPorts = (G_5(this, Q), new Map), this.http2Servers = new Map, this.sessionIdleTimeouts = new Map, this.handlers = new Map, this.sessions = new Map, this.started = !1, this.shutdown = !1, this.serverAddressString = "null", this.channelzEnabled = !0, this.options = Z !== null && Z !== void 0 ? Z : {}, this.options["grpc.enable_channelz"] === 0) this.channelzEnabled = !1, this.channelzTrace = new mV.ChannelzTraceStub, this.callTracker = new mV.ChannelzCallTrackerStub, this.listenerChildrenTracker = new mV.ChannelzChildrenTrackerStub, this.sessionChildrenTracker = new mV.ChannelzChildrenTrackerStub;
        else this.channelzTrace = new mV.ChannelzTrace, this.callTracker = new mV.ChannelzCallTracker, this.listenerChildrenTracker = new mV.ChannelzChildrenTracker, this.sessionChildrenTracker = new mV.ChannelzChildrenTracker;
        if (this.channelzRef = (0, mV.registerChannelzServer)("server", () => this.getChannelzInfo(), this.channelzEnabled), this.channelzTrace.addTrace("CT_INFO", "Server created"), this.maxConnectionAgeMs = (I = this.options["grpc.max_connection_age_ms"]) !== null && I !== void 0 ? I : NJA, this.maxConnectionAgeGraceMs = (Y = this.options["grpc.max_connection_age_grace_ms"]) !== null && Y !== void 0 ? Y : NJA, this.keepaliveTimeMs = (J = this.options["grpc.keepalive_time_ms"]) !== null && J !== void 0 ? J : G40, this.keepaliveTimeoutMs = (W = this.options["grpc.keepalive_timeout_ms"]) !== null && W !== void 0 ? W : Y_5, this.sessionIdleTimeout = (X = this.options["grpc.max_connection_idle_ms"]) !== null && X !== void 0 ? X : Xw2, this.commonServerOptions = {
            maxSendHeaderBlockLength: Number.MAX_SAFE_INTEGER
          }, "grpc-node.max_session_memory" in this.options) this.commonServerOptions.maxSessionMemory = this.options["grpc-node.max_session_memory"];
        else this.commonServerOptions.maxSessionMemory = Number.MAX_SAFE_INTEGER;
        if ("grpc.max_concurrent_streams" in this.options) this.commonServerOptions.settings = {
          maxConcurrentStreams: this.options["grpc.max_concurrent_streams"]
        };
        this.interceptors = (V = this.options.interceptors) !== null && V !== void 0 ? V : [], this.trace("Server constructed")
      }
      getChannelzInfo() {
        return {
          trace: this.channelzTrace,
          callTracker: this.callTracker,
          listenerChildren: this.listenerChildrenTracker.getChildLists(),
          sessionChildren: this.sessionChildrenTracker.getChildLists()
        }
      }
      getChannelzSessionInfo(Z) {
        var I, Y, J;
        let W = this.sessions.get(Z),
          X = Z.socket,
          V = X.remoteAddress ? (0, Qn.stringToSubchannelAddress)(X.remoteAddress, X.remotePort) : null,
          F = X.localAddress ? (0, Qn.stringToSubchannelAddress)(X.localAddress, X.localPort) : null,
          K;
        if (Z.encrypted) {
          let H = X,
            C = H.getCipher(),
            E = H.getCertificate(),
            U = H.getPeerCertificate();
          K = {
            cipherSuiteStandardName: (I = C.standardName) !== null && I !== void 0 ? I : null,
            cipherSuiteOtherName: C.standardName ? null : C.name,
            localCertificate: E && "raw" in E ? E.raw : null,
            remoteCertificate: U && "raw" in U ? U.raw : null
          }
        } else K = null;
        return {
          remoteAddress: V,
          localAddress: F,
          security: K,
          remoteName: null,
          streamsStarted: W.streamTracker.callsStarted,
          streamsSucceeded: W.streamTracker.callsSucceeded,
          streamsFailed: W.streamTracker.callsFailed,
          messagesSent: W.messagesSent,
          messagesReceived: W.messagesReceived,
          keepAlivesSent: W.keepAlivesSent,
          lastLocalStreamCreatedTimestamp: null,
          lastRemoteStreamCreatedTimestamp: W.streamTracker.lastCallStartedTimestamp,
          lastMessageSentTimestamp: W.lastMessageSentTimestamp,
          lastMessageReceivedTimestamp: W.lastMessageReceivedTimestamp,
          localFlowControlWindow: (Y = Z.state.localWindowSize) !== null && Y !== void 0 ? Y : null,
          remoteFlowControlWindow: (J = Z.state.remoteWindowSize) !== null && J !== void 0 ? J : null
        }
      }
      trace(Z) {
        LJA.trace(vW.LogVerbosity.DEBUG, J_5, "(" + this.channelzRef.id + ") " + Z)
      }
      keepaliveTrace(Z) {
        LJA.trace(vW.LogVerbosity.DEBUG, "keepalive", "(" + this.channelzRef.id + ") " + Z)
      }
      addProtoService() {
        throw Error("Not implemented. Use addService() instead")
      }
      addService(Z, I) {
        if (Z === null || typeof Z !== "object" || I === null || typeof I !== "object") throw Error("addService() requires two objects as arguments");
        let Y = Object.keys(Z);
        if (Y.length === 0) throw Error("Cannot add an empty service to a server");
        Y.forEach((J) => {
          let W = Z[J],
            X;
          if (W.requestStream)
            if (W.responseStream) X = "bidi";
            else X = "clientStream";
          else if (W.responseStream) X = "serverStream";
          else X = "unary";
          let V = I[J],
            F;
          if (V === void 0 && typeof W.originalName === "string") V = I[W.originalName];
          if (V !== void 0) F = V.bind(I);
          else F = V_5(X, J);
          if (this.register(W.path, F, W.responseSerialize, W.requestDeserialize, X) === !1) throw Error(`Method handler for ${W.path} already provided.`)
        })
      }
      removeService(Z) {
        if (Z === null || typeof Z !== "object") throw Error("removeService() requires object as argument");
        Object.keys(Z).forEach((Y) => {
          let J = Z[Y];
          this.unregister(J.path)
        })
      }
      bind(Z, I) {
        throw Error("Not implemented. Use bindAsync() instead")
      }
      experimentalRegisterListenerToChannelz(Z) {
        return (0, mV.registerChannelzSocket)((0, Qn.subchannelAddressToString)(Z), () => {
          return {
            localAddress: Z,
            remoteAddress: null,
            security: null,
            remoteName: null,
            streamsStarted: 0,
            streamsSucceeded: 0,
            streamsFailed: 0,
            messagesSent: 0,
            messagesReceived: 0,
            keepAlivesSent: 0,
            lastLocalStreamCreatedTimestamp: null,
            lastRemoteStreamCreatedTimestamp: null,
            lastMessageSentTimestamp: null,
            lastMessageReceivedTimestamp: null,
            localFlowControlWindow: null,
            remoteFlowControlWindow: null
          }
        }, this.channelzEnabled)
      }
      experimentalUnregisterListenerFromChannelz(Z) {
        (0, mV.unregisterChannelzRef)(Z)
      }
      createHttp2Server(Z) {
        let I;
        if (Z._isSecure()) {
          let Y = Z._getConstructorOptions(),
            J = Z._getSecureContextOptions(),
            W = Object.assign(Object.assign(Object.assign(Object.assign({}, this.commonServerOptions), Y), J), {
              enableTrace: this.options["grpc-node.tls_enable_trace"] === 1
            }),
            X = J !== null;
          this.trace("Initial credentials valid: " + X), I = Q$.createSecureServer(W), I.prependListener("connection", (F) => {
            if (!X) this.trace("Dropped connection from " + JSON.stringify(F.address()) + " due to unloaded credentials"), F.destroy()
          }), I.on("secureConnection", (F) => {
            F.on("error", (K) => {
              this.trace("An incoming TLS connection closed with error: " + K.message)
            })
          });
          let V = (F) => {
            if (F) {
              let K = I;
              try {
                K.setSecureContext(F)
              } catch (D) {
                LJA.log(vW.LogVerbosity.ERROR, "Failed to set secure context with error " + D.message), F = null
              }
            }
            X = F !== null, this.trace("Post-update credentials valid: " + X)
          };
          Z._addWatcher(V), I.on("close", () => {
            Z._removeWatcher(V)
          })
        } else I = Q$.createServer(this.commonServerOptions);
        return I.setTimeout(0, W_5), this._setupHandlers(I, Z._getInterceptors()), I
      }
      bindOneAddress(Z, I) {
        this.trace("Attempting to bind " + (0, Qn.subchannelAddressToString)(Z));
        let Y = this.createHttp2Server(I.credentials);
        return new Promise((J, W) => {
          let X = (V) => {
            this.trace("Failed to bind " + (0, Qn.subchannelAddressToString)(Z) + " with error " + V.message), J({
              port: "port" in Z ? Z.port : 1,
              error: V.message
            })
          };
          Y.once("error", X), Y.listen(Z, () => {
            let V = Y.address(),
              F;
            if (typeof V === "string") F = {
              path: V
            };
            else F = {
              host: V.address,
              port: V.port
            };
            let K = this.experimentalRegisterListenerToChannelz(F);
            this.listenerChildrenTracker.refChild(K), this.http2Servers.set(Y, {
              channelzRef: K,
              sessions: new Set,
              ownsChannelzRef: !0
            }), I.listeningServers.add(Y), this.trace("Successfully bound " + (0, Qn.subchannelAddressToString)(F)), J({
              port: "port" in F ? F.port : 1
            }), Y.removeListener("error", X)
          })
        })
      }
      async bindManyPorts(Z, I) {
        if (Z.length === 0) return {
          count: 0,
          port: 0,
          errors: []
        };
        if ((0, Qn.isTcpSubchannelAddress)(Z[0]) && Z[0].port === 0) {
          let Y = await this.bindOneAddress(Z[0], I);
          if (Y.error) {
            let J = await this.bindManyPorts(Z.slice(1), I);
            return Object.assign(Object.assign({}, J), {
              errors: [Y.error, ...J.errors]
            })
          } else {
            let J = Z.slice(1).map((V) => (0, Qn.isTcpSubchannelAddress)(V) ? {
                host: V.host,
                port: Y.port
              } : V),
              W = await Promise.all(J.map((V) => this.bindOneAddress(V, I))),
              X = [Y, ...W];
            return {
              count: X.filter((V) => V.error === void 0).length,
              port: Y.port,
              errors: X.filter((V) => V.error).map((V) => V.error)
            }
          }
        } else {
          let Y = await Promise.all(Z.map((J) => this.bindOneAddress(J, I)));
          return {
            count: Y.filter((J) => J.error === void 0).length,
            port: Y[0].port,
            errors: Y.filter((J) => J.error).map((J) => J.error)
          }
        }
      }
      async bindAddressList(Z, I) {
        let Y = await this.bindManyPorts(Z, I);
        if (Y.count > 0) {
          if (Y.count < Z.length) LJA.log(vW.LogVerbosity.INFO, `WARNING Only ${Y.count} addresses added out of total ${Z.length} resolved`);
          return Y.port
        } else {
          let J = `No address added out of total ${Z.length} resolved`;
          throw LJA.log(vW.LogVerbosity.ERROR, J), Error(`${J} errors: [${Y.errors.join(",")}]`)
        }
      }
      resolvePort(Z) {
        return new Promise((I, Y) => {
          let J = !1,
            W = (V, F, K, D) => {
              if (J) return !0;
              if (J = !0, !V.ok) return Y(Error(V.error.details)), !0;
              let H = [].concat(...V.value.map((C) => C.addresses));
              if (H.length === 0) return Y(Error(`No addresses resolved for port ${Z}`)), !0;
              return I(H), !0
            };
          (0, Jw2.createResolver)(Z, W, this.options).updateResolution()
        })
      }
      async bindPort(Z, I) {
        let Y = await this.resolvePort(Z);
        if (I.cancelled) throw this.completeUnbind(I), Error("bindAsync operation cancelled by unbind call");
        let J = await this.bindAddressList(Y, I);
        if (I.cancelled) throw this.completeUnbind(I), Error("bindAsync operation cancelled by unbind call");
        return J
      }
      normalizePort(Z) {
        let I = (0, qP.parseUri)(Z);
        if (I === null) throw Error(`Could not parse port "${Z}"`);
        let Y = (0, Jw2.mapUriDefaultScheme)(I);
        if (Y === null) throw Error(`Could not get a default scheme for port "${Z}"`);
        return Y
      }
      bindAsync(Z, I, Y) {
        if (this.shutdown) throw Error("bindAsync called after shutdown");
        if (typeof Z !== "string") throw TypeError("port must be a string");
        if (I === null || !(I instanceof B40.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        if (typeof Y !== "function") throw TypeError("callback must be a function");
        this.trace("bindAsync port=" + Z);
        let J = this.normalizePort(Z),
          W = (K, D) => {
            process.nextTick(() => Y(K, D))
          },
          X = this.boundPorts.get((0, qP.uriToString)(J));
        if (X) {
          if (!I._equals(X.credentials)) {
            W(Error(`${Z} already bound with incompatible credentials`), 0);
            return
          }
          if (X.cancelled = !1, X.completionPromise) X.completionPromise.then((K) => Y(null, K), (K) => Y(K, 0));
          else W(null, X.portNumber);
          return
        }
        X = {
          mapKey: (0, qP.uriToString)(J),
          originalUri: J,
          completionPromise: null,
          cancelled: !1,
          portNumber: 0,
          credentials: I,
          listeningServers: new Set
        };
        let V = (0, qP.splitHostPort)(J.path),
          F = this.bindPort(J, X);
        if (X.completionPromise = F, (V === null || V === void 0 ? void 0 : V.port) === 0) F.then((K) => {
          let D = {
            scheme: J.scheme,
            authority: J.authority,
            path: (0, qP.combineHostPort)({
              host: V.host,
              port: K
            })
          };
          X.mapKey = (0, qP.uriToString)(D), X.completionPromise = null, X.portNumber = K, this.boundPorts.set(X.mapKey, X), Y(null, K)
        }, (K) => {
          Y(K, 0)
        });
        else this.boundPorts.set(X.mapKey, X), F.then((K) => {
          X.completionPromise = null, X.portNumber = K, Y(null, K)
        }, (K) => {
          Y(K, 0)
        })
      }
      registerInjectorToChannelz() {
        return (0, mV.registerChannelzSocket)("injector", () => {
          return {
            localAddress: null,
            remoteAddress: null,
            security: null,
            remoteName: null,
            streamsStarted: 0,
            streamsSucceeded: 0,
            streamsFailed: 0,
            messagesSent: 0,
            messagesReceived: 0,
            keepAlivesSent: 0,
            lastLocalStreamCreatedTimestamp: null,
            lastRemoteStreamCreatedTimestamp: null,
            lastMessageSentTimestamp: null,
            lastMessageReceivedTimestamp: null,
            localFlowControlWindow: null,
            remoteFlowControlWindow: null
          }
        }, this.channelzEnabled)
      }
      experimentalCreateConnectionInjectorWithChannelzRef(Z, I, Y = !1) {
        if (Z === null || !(Z instanceof B40.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        if (this.channelzEnabled) this.listenerChildrenTracker.refChild(I);
        let J = this.createHttp2Server(Z),
          W = new Set;
        return this.http2Servers.set(J, {
          channelzRef: I,
          sessions: W,
          ownsChannelzRef: Y
        }), {
          injectConnection: (X) => {
            J.emit("connection", X)
          },
          drain: (X) => {
            var V, F;
            for (let K of W) this.closeSession(K);
            (F = (V = setTimeout(() => {
              for (let K of W) K.destroy(Q$.constants.NGHTTP2_CANCEL)
            }, X)).unref) === null || F === void 0 || F.call(V)
          },
          destroy: () => {
            this.closeServer(J);
            for (let X of W) this.closeSession(X)
          }
        }
      }
      createConnectionInjector(Z) {
        if (Z === null || !(Z instanceof B40.ServerCredentials)) throw TypeError("creds must be a ServerCredentials object");
        let I = this.registerInjectorToChannelz();
        return this.experimentalCreateConnectionInjectorWithChannelzRef(Z, I, !0)
      }
      closeServer(Z, I) {
        this.trace("Closing server with address " + JSON.stringify(Z.address()));
        let Y = this.http2Servers.get(Z);
        Z.close(() => {
          if (Y && Y.ownsChannelzRef) this.listenerChildrenTracker.unrefChild(Y.channelzRef), (0, mV.unregisterChannelzRef)(Y.channelzRef);
          this.http2Servers.delete(Z), I === null || I === void 0 || I()
        })
      }
      closeSession(Z, I) {
        var Y;
        this.trace("Closing session initiated by " + ((Y = Z.socket) === null || Y === void 0 ? void 0 : Y.remoteAddress));
        let J = this.sessions.get(Z),
          W = () => {
            if (J) this.sessionChildrenTracker.unrefChild(J.ref), (0, mV.unregisterChannelzRef)(J.ref);
            I === null || I === void 0 || I()
          };
        if (Z.closed) queueMicrotask(W);
        else Z.close(W)
      }
      completeUnbind(Z) {
        for (let I of Z.listeningServers) {
          let Y = this.http2Servers.get(I);
          if (this.closeServer(I, () => {
              Z.listeningServers.delete(I)
            }), Y)
            for (let J of Y.sessions) this.closeSession(J)
        }
        this.boundPorts.delete(Z.mapKey)
      }
      unbind(Z) {
        this.trace("unbind port=" + Z);
        let I = this.normalizePort(Z),
          Y = (0, qP.splitHostPort)(I.path);
        if ((Y === null || Y === void 0 ? void 0 : Y.port) === 0) throw Error("Cannot unbind port 0");
        let J = this.boundPorts.get((0, qP.uriToString)(I));
        if (J)
          if (this.trace("unbinding " + J.mapKey + " originally bound as " + (0, qP.uriToString)(J.originalUri)), J.completionPromise) J.cancelled = !0;
          else this.completeUnbind(J)
      }
      drain(Z, I) {
        var Y, J;
        this.trace("drain port=" + Z + " graceTimeMs=" + I);
        let W = this.normalizePort(Z),
          X = (0, qP.splitHostPort)(W.path);
        if ((X === null || X === void 0 ? void 0 : X.port) === 0) throw Error("Cannot drain port 0");
        let V = this.boundPorts.get((0, qP.uriToString)(W));
        if (!V) return;
        let F = new Set;
        for (let K of V.listeningServers) {
          let D = this.http2Servers.get(K);
          if (D)
            for (let H of D.sessions) F.add(H), this.closeSession(H, () => {
              F.delete(H)
            })
        }(J = (Y = setTimeout(() => {
          for (let K of F) K.destroy(Q$.constants.NGHTTP2_CANCEL)
        }, I)).unref) === null || J === void 0 || J.call(Y)
      }
      forceShutdown() {
        for (let Z of this.boundPorts.values()) Z.cancelled = !0;
        this.boundPorts.clear();
        for (let Z of this.http2Servers.keys()) this.closeServer(Z);
        this.sessions.forEach((Z, I) => {
          this.closeSession(I), I.destroy(Q$.constants.NGHTTP2_CANCEL)
        }), this.sessions.clear(), (0, mV.unregisterChannelzRef)(this.channelzRef), this.shutdown = !0
      }
      register(Z, I, Y, J, W) {
        if (this.handlers.has(Z)) return !1;
        return this.handlers.set(Z, {
          func: I,
          serialize: Y,
          deserialize: J,
          type: W,
          path: Z
        }), !0
      }
      unregister(Z) {
        return this.handlers.delete(Z)
      }
      start() {
        if (this.http2Servers.size === 0 || [...this.http2Servers.keys()].every((Z) => !Z.listening)) throw Error("server must be bound in order to start");
        if (this.started === !0) throw Error("server is already started");
        this.started = !0
      }
      tryShutdown(Z) {
        var I;
        let Y = (X) => {
            (0, mV.unregisterChannelzRef)(this.channelzRef), Z(X)
          },
          J = 0;

        function W() {
          if (J--, J === 0) Y()
        }
        this.shutdown = !0;
        for (let [X, V] of this.http2Servers.entries()) {
          J++;
          let F = V.channelzRef.name;
          this.trace("Waiting for server " + F + " to close"), this.closeServer(X, () => {
            this.trace("Server " + F + " finished closing"), W()
          });
          for (let K of V.sessions.keys()) {
            J++;
            let D = (I = K.socket) === null || I === void 0 ? void 0 : I.remoteAddress;
            this.trace("Waiting for session " + D + " to close"), this.closeSession(K, () => {
              this.trace("Session " + D + " finished closing"), W()
            })
          }
        }
        if (J === 0) Y()
      }
      addHttp2Port() {
        throw Error("Not yet implemented")
      }
      getChannelzRef() {
        return this.channelzRef
      }
      _verifyContentType(Z, I) {
        let Y = I[Q$.constants.HTTP2_HEADER_CONTENT_TYPE];
        if (typeof Y !== "string" || !Y.startsWith("application/grpc")) return Z.respond({
          [Q$.constants.HTTP2_HEADER_STATUS]: Q$.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE
        }, {
          endStream: !0
        }), !1;
        return !0
      }
      _retrieveHandler(Z) {
        Kw2("Received call to method " + Z + " at address " + this.serverAddressString);
        let I = this.handlers.get(Z);
        if (I === void 0) return Kw2("No handler registered for method " + Z + ". Sending UNIMPLEMENTED status."), null;
        return I
      }
      _respondWithError(Z, I, Y = null) {
        var J, W;
        let X = Object.assign({
          "grpc-status": (J = Z.code) !== null && J !== void 0 ? J : vW.Status.INTERNAL,
          "grpc-message": Z.details,
          [Q$.constants.HTTP2_HEADER_STATUS]: Q$.constants.HTTP_STATUS_OK,
          [Q$.constants.HTTP2_HEADER_CONTENT_TYPE]: "application/grpc+proto"
        }, (W = Z.metadata) === null || W === void 0 ? void 0 : W.toHttp2Headers());
        I.respond(X, {
          endStream: !0
        }), this.callTracker.addCallFailed(), Y === null || Y === void 0 || Y.streamTracker.addCallFailed()
      }
      _channelzHandler(Z, I, Y) {
        this.onStreamOpened(I);
        let J = this.sessions.get(I.session);
        if (this.callTracker.addCallStarted(), J === null || J === void 0 || J.streamTracker.addCallStarted(), !this._verifyContentType(I, Y)) {
          this.callTracker.addCallFailed(), J === null || J === void 0 || J.streamTracker.addCallFailed();
          return
        }
        let W = Y[Vw2],
          X = this._retrieveHandler(W);
        if (!X) {
          this._respondWithError(Z40(W), I, J);
          return
        }
        let V = {
            addMessageSent: () => {
              if (J) J.messagesSent += 1, J.lastMessageSentTimestamp = new Date
            },
            addMessageReceived: () => {
              if (J) J.messagesReceived += 1, J.lastMessageReceivedTimestamp = new Date
            },
            onCallEnd: (K) => {
              if (K.code === vW.Status.OK) this.callTracker.addCallSucceeded();
              else this.callTracker.addCallFailed()
            },
            onStreamEnd: (K) => {
              if (J)
                if (K) J.streamTracker.addCallSucceeded();
                else J.streamTracker.addCallFailed()
            }
          },
          F = (0, Ww2.getServerInterceptingCall)([...Z, ...this.interceptors], I, Y, V, X, this.options);
        if (!this._runHandlerForCall(F, X)) this.callTracker.addCallFailed(), J === null || J === void 0 || J.streamTracker.addCallFailed(), F.sendStatus({
          code: vW.Status.INTERNAL,
          details: `Unknown handler type: ${X.type}`
        })
      }
      _streamHandler(Z, I, Y) {
        if (this.onStreamOpened(I), this._verifyContentType(I, Y) !== !0) return;
        let J = Y[Vw2],
          W = this._retrieveHandler(J);
        if (!W) {
          this._respondWithError(Z40(J), I, null);
          return
        }
        let X = (0, Ww2.getServerInterceptingCall)([...Z, ...this.interceptors], I, Y, null, W, this.options);
        if (!this._runHandlerForCall(X, W)) X.sendStatus({
          code: vW.Status.INTERNAL,
          details: `Unknown handler type: ${W.type}`
        })
      }
      _runHandlerForCall(Z, I) {
        let {
          type: Y
        } = I;
        if (Y === "unary") K_5(Z, I);
        else if (Y === "clientStream") D_5(Z, I);
        else if (Y === "serverStream") H_5(Z, I);
        else if (Y === "bidi") C_5(Z, I);
        else return !1;
        return !0
      }
      _setupHandlers(Z, I) {
        if (Z === null) return;
        let Y = Z.address(),
          J = "null";
        if (Y)
          if (typeof Y === "string") J = Y;
          else J = Y.address + ":" + Y.port;
        this.serverAddressString = J;
        let W = this.channelzEnabled ? this._channelzHandler : this._streamHandler,
          X = this.channelzEnabled ? this._channelzSessionHandler(Z) : this._sessionHandler(Z);
        Z.on("stream", W.bind(this, I)), Z.on("session", X)
      }
      _sessionHandler(Z) {
        return (I) => {
          var Y, J;
          (Y = this.http2Servers.get(Z)) === null || Y === void 0 || Y.sessions.add(I);
          let W = null,
            X = null,
            V = null,
            F = !1,
            K = this.enableIdleTimeout(I);
          if (this.maxConnectionAgeMs !== NJA) {
            let U = this.maxConnectionAgeMs / 10,
              q = Math.random() * U * 2 - U;
            W = setTimeout(() => {
              var w, N;
              F = !0, this.trace("Connection dropped by max connection age: " + ((w = I.socket) === null || w === void 0 ? void 0 : w.remoteAddress));
              try {
                I.goaway(Q$.constants.NGHTTP2_NO_ERROR, 2147483647, Fw2)
              } catch (R) {
                I.destroy();
                return
              }
              if (I.close(), this.maxConnectionAgeGraceMs !== NJA) X = setTimeout(() => {
                I.destroy()
              }, this.maxConnectionAgeGraceMs), (N = X.unref) === null || N === void 0 || N.call(X)
            }, this.maxConnectionAgeMs + q), (J = W.unref) === null || J === void 0 || J.call(W)
          }
          let D = () => {
              if (V) clearTimeout(V), V = null
            },
            H = () => {
              return !I.destroyed && this.keepaliveTimeMs < G40 && this.keepaliveTimeMs > 0
            },
            C, E = () => {
              var U;
              if (!H()) return;
              this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), V = setTimeout(() => {
                D(), C()
              }, this.keepaliveTimeMs), (U = V.unref) === null || U === void 0 || U.call(V)
            };
          C = () => {
            var U;
            if (!H()) return;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
            let q = "";
            try {
              if (!I.ping((N, R, T) => {
                  if (D(), N) this.keepaliveTrace("Ping failed with error: " + N.message), F = !0, I.close();
                  else this.keepaliveTrace("Received ping response"), E()
                })) q = "Ping returned false"
            } catch (w) {
              q = (w instanceof Error ? w.message : "") || "Unknown error"
            }
            if (q) {
              this.keepaliveTrace("Ping send failed: " + q), this.trace("Connection dropped due to ping send error: " + q), F = !0, I.close();
              return
            }
            V = setTimeout(() => {
              D(), this.keepaliveTrace("Ping timeout passed without response"), this.trace("Connection dropped by keepalive timeout"), F = !0, I.close()
            }, this.keepaliveTimeoutMs), (U = V.unref) === null || U === void 0 || U.call(V)
          }, E(), I.on("close", () => {
            var U, q;
            if (!F) this.trace(`Connection dropped by client ${(U=I.socket)===null||U===void 0?void 0:U.remoteAddress}`);
            if (W) clearTimeout(W);
            if (X) clearTimeout(X);
            if (D(), K !== null) clearTimeout(K.timeout), this.sessionIdleTimeouts.delete(I);
            (q = this.http2Servers.get(Z)) === null || q === void 0 || q.sessions.delete(I)
          })
        }
      }
      _channelzSessionHandler(Z) {
        return (I) => {
          var Y, J, W, X;
          let V = (0, mV.registerChannelzSocket)((J = (Y = I.socket) === null || Y === void 0 ? void 0 : Y.remoteAddress) !== null && J !== void 0 ? J : "unknown", this.getChannelzSessionInfo.bind(this, I), this.channelzEnabled),
            F = {
              ref: V,
              streamTracker: new mV.ChannelzCallTracker,
              messagesSent: 0,
              messagesReceived: 0,
              keepAlivesSent: 0,
              lastMessageSentTimestamp: null,
              lastMessageReceivedTimestamp: null
            };
          (W = this.http2Servers.get(Z)) === null || W === void 0 || W.sessions.add(I), this.sessions.set(I, F);
          let K = `${I.socket.remoteAddress}:${I.socket.remotePort}`;
          this.channelzTrace.addTrace("CT_INFO", "Connection established by client " + K), this.trace("Connection established by client " + K), this.sessionChildrenTracker.refChild(V);
          let D = null,
            H = null,
            C = null,
            E = !1,
            U = this.enableIdleTimeout(I);
          if (this.maxConnectionAgeMs !== NJA) {
            let T = this.maxConnectionAgeMs / 10,
              y = Math.random() * T * 2 - T;
            D = setTimeout(() => {
              var v;
              E = !0, this.channelzTrace.addTrace("CT_INFO", "Connection dropped by max connection age from " + K);
              try {
                I.goaway(Q$.constants.NGHTTP2_NO_ERROR, 2147483647, Fw2)
              } catch (x) {
                I.destroy();
                return
              }
              if (I.close(), this.maxConnectionAgeGraceMs !== NJA) H = setTimeout(() => {
                I.destroy()
              }, this.maxConnectionAgeGraceMs), (v = H.unref) === null || v === void 0 || v.call(H)
            }, this.maxConnectionAgeMs + y), (X = D.unref) === null || X === void 0 || X.call(D)
          }
          let q = () => {
              if (C) clearTimeout(C), C = null
            },
            w = () => {
              return !I.destroyed && this.keepaliveTimeMs < G40 && this.keepaliveTimeMs > 0
            },
            N, R = () => {
              var T;
              if (!w()) return;
              this.keepaliveTrace("Starting keepalive timer for " + this.keepaliveTimeMs + "ms"), C = setTimeout(() => {
                q(), N()
              }, this.keepaliveTimeMs), (T = C.unref) === null || T === void 0 || T.call(C)
            };
          N = () => {
            var T;
            if (!w()) return;
            this.keepaliveTrace("Sending ping with timeout " + this.keepaliveTimeoutMs + "ms");
            let y = "";
            try {
              if (!I.ping((x, p, u) => {
                  if (q(), x) this.keepaliveTrace("Ping failed with error: " + x.message), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to error of a ping frame " + x.message + " return in " + p), E = !0, I.close();
                  else this.keepaliveTrace("Received ping response"), R()
                })) y = "Ping returned false"
            } catch (v) {
              y = (v instanceof Error ? v.message : "") || "Unknown error"
            }
            if (y) {
              this.keepaliveTrace("Ping send failed: " + y), this.channelzTrace.addTrace("CT_INFO", "Connection dropped due to ping send error: " + y), E = !0, I.close();
              return
            }
            F.keepAlivesSent += 1, C = setTimeout(() => {
              q(), this.keepaliveTrace("Ping timeout passed without response"), this.channelzTrace.addTrace("CT_INFO", "Connection dropped by keepalive timeout from " + K), E = !0, I.close()
            }, this.keepaliveTimeoutMs), (T = C.unref) === null || T === void 0 || T.call(C)
          }, R(), I.on("close", () => {
            var T;
            if (!E) this.channelzTrace.addTrace("CT_INFO", "Connection dropped by client " + K);
            if (this.sessionChildrenTracker.unrefChild(V), (0, mV.unregisterChannelzRef)(V), D) clearTimeout(D);
            if (H) clearTimeout(H);
            if (q(), U !== null) clearTimeout(U.timeout), this.sessionIdleTimeouts.delete(I);
            (T = this.http2Servers.get(Z)) === null || T === void 0 || T.sessions.delete(I), this.sessions.delete(I)
          })
        }
      }
      enableIdleTimeout(Z) {
        var I, Y;
        if (this.sessionIdleTimeout >= Xw2) return null;
        let J = {
          activeStreams: 0,
          lastIdle: Date.now(),
          onClose: this.onStreamClose.bind(this, Z),
          timeout: setTimeout(this.onIdleTimeout, this.sessionIdleTimeout, this, Z)
        };
        (Y = (I = J.timeout).unref) === null || Y === void 0 || Y.call(I), this.sessionIdleTimeouts.set(Z, J);
        let {
          socket: W
        } = Z;
        return this.trace("Enable idle timeout for " + W.remoteAddress + ":" + W.remotePort), J
      }
      onIdleTimeout(Z, I) {
        let {
          socket: Y
        } = I, J = Z.sessionIdleTimeouts.get(I);
        if (J !== void 0 && J.activeStreams === 0)
          if (Date.now() - J.lastIdle >= Z.sessionIdleTimeout) Z.trace("Session idle timeout triggered for " + (Y === null || Y === void 0 ? void 0 : Y.remoteAddress) + ":" + (Y === null || Y === void 0 ? void 0 : Y.remotePort) + " last idle at " + J.lastIdle), Z.closeSession(I);
          else J.timeout.refresh()
      }
      onStreamOpened(Z) {
        let I = Z.session,
          Y = this.sessionIdleTimeouts.get(I);
        if (Y) Y.activeStreams += 1, Z.once("close", Y.onClose)
      }
      onStreamClose(Z) {
        var I, Y;
        let J = this.sessionIdleTimeouts.get(Z);
        if (J) {
          if (J.activeStreams -= 1, J.activeStreams === 0) J.lastIdle = Date.now(), J.timeout.refresh(), this.trace("Session onStreamClose" + ((I = Z.socket) === null || I === void 0 ? void 0 : I.remoteAddress) + ":" + ((Y = Z.socket) === null || Y === void 0 ? void 0 : Y.remotePort) + " at " + J.lastIdle)
        }
      }
    }, (() => {
      let G = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
      if (B = [X_5("Calling start() is no longer necessary. It can be safely omitted.")], Z_5(A, null, B, {
          kind: "method",
          name: "start",
          static: !1,
          private: !1,
          access: {
            has: (Z) => ("start" in Z),
            get: (Z) => Z.start
          },
          metadata: G
        }, null, Q), G) Object.defineProperty(A, Symbol.metadata, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: G
      })
    })(), A
  })();
  Bn.Server = F_5;
  async function K_5(A, Q) {
    let B;

    function G(Y, J, W, X) {
      if (Y) {
        A.sendStatus((0, MJA.serverErrorToStatus)(Y, W));
        return
      }
      A.sendMessage(J, () => {
        A.sendStatus({
          code: vW.Status.OK,
          details: "OK",
          metadata: W !== null && W !== void 0 ? W : null
        })
      })
    }
    let Z, I = null;
    A.start({
      onReceiveMetadata(Y) {
        Z = Y, A.startRead()
      },
      onReceiveMessage(Y) {
        if (I) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received a second request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        I = Y, A.startRead()
      },
      onReceiveHalfClose() {
        if (!I) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received no request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        B = new MJA.ServerWritableStreamImpl(Q.path, A, Z, I);
        try {
          Q.func(B, G)
        } catch (Y) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${Y.message}`,
            metadata: null
          })
        }
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled")
      }
    })
  }

  function D_5(A, Q) {
    let B;

    function G(Z, I, Y, J) {
      if (Z) {
        A.sendStatus((0, MJA.serverErrorToStatus)(Z, Y));
        return
      }
      A.sendMessage(I, () => {
        A.sendStatus({
          code: vW.Status.OK,
          details: "OK",
          metadata: Y !== null && Y !== void 0 ? Y : null
        })
      })
    }
    A.start({
      onReceiveMetadata(Z) {
        B = new MJA.ServerDuplexStreamImpl(Q.path, A, Z);
        try {
          Q.func(B, G)
        } catch (I) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${I.message}`,
            metadata: null
          })
        }
      },
      onReceiveMessage(Z) {
        B.push(Z)
      },
      onReceiveHalfClose() {
        B.push(null)
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }

  function H_5(A, Q) {
    let B, G, Z = null;
    A.start({
      onReceiveMetadata(I) {
        G = I, A.startRead()
      },
      onReceiveMessage(I) {
        if (Z) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received a second request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        Z = I, A.startRead()
      },
      onReceiveHalfClose() {
        if (!Z) {
          A.sendStatus({
            code: vW.Status.UNIMPLEMENTED,
            details: `Received no request message for server streaming method ${Q.path}`,
            metadata: null
          });
          return
        }
        B = new MJA.ServerWritableStreamImpl(Q.path, A, G, Z);
        try {
          Q.func(B)
        } catch (I) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${I.message}`,
            metadata: null
          })
        }
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }

  function C_5(A, Q) {
    let B;
    A.start({
      onReceiveMetadata(G) {
        B = new MJA.ServerDuplexStreamImpl(Q.path, A, G);
        try {
          Q.func(B)
        } catch (Z) {
          A.sendStatus({
            code: vW.Status.UNKNOWN,
            details: `Server method handler threw error ${Z.message}`,
            metadata: null
          })
        }
      },
      onReceiveMessage(G) {
        B.push(G)
      },
      onReceiveHalfClose() {
        B.push(null)
      },
      onCancel() {
        if (B) B.cancelled = !0, B.emit("cancelled", "cancelled"), B.destroy()
      }
    })
  }
})
// @from(Start 11054117, End 11054778)
zw2 = z((Cw2) => {
  Object.defineProperty(Cw2, "__esModule", {
    value: !0
  });
  Cw2.StatusBuilder = void 0;
  class Hw2 {
    constructor() {
      this.code = null, this.details = null, this.metadata = null
    }
    withCode(A) {
      return this.code = A, this
    }
    withDetails(A) {
      return this.details = A, this
    }
    withMetadata(A) {
      return this.metadata = A, this
    }
    build() {
      let A = {};
      if (this.code !== null) A.code = this.code;
      if (this.details !== null) A.details = this.details;
      if (this.metadata !== null) A.metadata = this.metadata;
      return A
    }
  }
  Cw2.StatusBuilder = Hw2
})
// @from(Start 11054784, End 11066564)
oOA = z((Ow2) => {
  Object.defineProperty(Ow2, "__esModule", {
    value: !0
  });
  Ow2.LeafLoadBalancer = Ow2.PickFirstLoadBalancer = Ow2.PickFirstLoadBalancingConfig = void 0;
  Ow2.shuffled = Nw2;
  Ow2.setup = L_5;
  var I40 = li(),
    bW = mE(),
    Gn = Ph(),
    Uw2 = eU(),
    E_5 = zZ(),
    z_5 = E6(),
    $w2 = eU(),
    ww2 = UA("net"),
    U_5 = o1A(),
    $_5 = "pick_first";

  function sOA(A) {
    E_5.trace(z_5.LogVerbosity.DEBUG, $_5, A)
  }
  var rOA = "pick_first",
    w_5 = 250;
  class OJA {
    constructor(A) {
      this.shuffleAddressList = A
    }
    getLoadBalancerName() {
      return rOA
    }
    toJsonObject() {
      return {
        [rOA]: {
          shuffleAddressList: this.shuffleAddressList
        }
      }
    }
    getShuffleAddressList() {
      return this.shuffleAddressList
    }
    static createFromJson(A) {
      if ("shuffleAddressList" in A && typeof A.shuffleAddressList !== "boolean") throw Error("pick_first config field shuffleAddressList must be a boolean if provided");
      return new OJA(A.shuffleAddressList === !0)
    }
  }
  Ow2.PickFirstLoadBalancingConfig = OJA;
  class qw2 {
    constructor(A) {
      this.subchannel = A
    }
    pick(A) {
      return {
        pickResultType: Gn.PickResultType.COMPLETE,
        subchannel: this.subchannel,
        status: null,
        onCallStarted: null,
        onCallEnded: null
      }
    }
  }

  function Nw2(A) {
    let Q = A.slice();
    for (let B = Q.length - 1; B > 1; B--) {
      let G = Math.floor(Math.random() * (B + 1)),
        Z = Q[B];
      Q[B] = Q[G], Q[G] = Z
    }
    return Q
  }

  function q_5(A) {
    if (A.length === 0) return [];
    let Q = [],
      B = [],
      G = [],
      Z = (0, $w2.isTcpSubchannelAddress)(A[0]) && (0, ww2.isIPv6)(A[0].host);
    for (let J of A)
      if ((0, $w2.isTcpSubchannelAddress)(J) && (0, ww2.isIPv6)(J.host)) B.push(J);
      else G.push(J);
    let I = Z ? B : G,
      Y = Z ? G : B;
    for (let J = 0; J < Math.max(I.length, Y.length); J++) {
      if (J < I.length) Q.push(I[J]);
      if (J < Y.length) Q.push(Y[J])
    }
    return Q
  }
  var Lw2 = "grpc-node.internal.pick-first.report_health_status";
  class y81 {
    constructor(A) {
      this.channelControlHelper = A, this.children = [], this.currentState = bW.ConnectivityState.IDLE, this.currentSubchannelIndex = 0, this.currentPick = null, this.subchannelStateListener = (Q, B, G, Z, I) => {
        this.onSubchannelStateUpdate(Q, B, G, I)
      }, this.pickedSubchannelHealthListener = () => this.calculateAndReportNewState(), this.stickyTransientFailureMode = !1, this.reportHealthStatus = !1, this.lastError = null, this.latestAddressList = null, this.latestOptions = {}, this.latestResolutionNote = "", this.connectionDelayTimeout = setTimeout(() => {}, 0), clearTimeout(this.connectionDelayTimeout)
    }
    allChildrenHaveReportedTF() {
      return this.children.every((A) => A.hasReportedTransientFailure)
    }
    resetChildrenReportedTF() {
      this.children.every((A) => A.hasReportedTransientFailure = !1)
    }
    calculateAndReportNewState() {
      var A;
      if (this.currentPick)
        if (this.reportHealthStatus && !this.currentPick.isHealthy()) {
          let Q = `Picked subchannel ${this.currentPick.getAddress()} is unhealthy`;
          this.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker({
            details: Q
          }), Q)
        } else this.updateState(bW.ConnectivityState.READY, new qw2(this.currentPick), null);
      else if (((A = this.latestAddressList) === null || A === void 0 ? void 0 : A.length) === 0) {
        let Q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
        this.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker({
          details: Q
        }), Q)
      } else if (this.children.length === 0) this.updateState(bW.ConnectivityState.IDLE, new Gn.QueuePicker(this), null);
      else if (this.stickyTransientFailureMode) {
        let Q = `No connection established. Last error: ${this.lastError}. Resolution note: ${this.latestResolutionNote}`;
        this.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker({
          details: Q
        }), Q)
      } else this.updateState(bW.ConnectivityState.CONNECTING, new Gn.QueuePicker(this), null)
    }
    requestReresolution() {
      this.channelControlHelper.requestReresolution()
    }
    maybeEnterStickyTransientFailureMode() {
      if (!this.allChildrenHaveReportedTF()) return;
      if (this.requestReresolution(), this.resetChildrenReportedTF(), this.stickyTransientFailureMode) {
        this.calculateAndReportNewState();
        return
      }
      this.stickyTransientFailureMode = !0;
      for (let {
          subchannel: A
        }
        of this.children) A.startConnecting();
      this.calculateAndReportNewState()
    }
    removeCurrentPick() {
      if (this.currentPick !== null) this.currentPick.removeConnectivityStateListener(this.subchannelStateListener), this.channelControlHelper.removeChannelzChild(this.currentPick.getChannelzRef()), this.currentPick.removeHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick.unref(), this.currentPick = null
    }
    onSubchannelStateUpdate(A, Q, B, G) {
      var Z;
      if ((Z = this.currentPick) === null || Z === void 0 ? void 0 : Z.realSubchannelEquals(A)) {
        if (B !== bW.ConnectivityState.READY) this.removeCurrentPick(), this.calculateAndReportNewState();
        return
      }
      for (let [I, Y] of this.children.entries())
        if (A.realSubchannelEquals(Y.subchannel)) {
          if (B === bW.ConnectivityState.READY) this.pickSubchannel(Y.subchannel);
          if (B === bW.ConnectivityState.TRANSIENT_FAILURE) {
            if (Y.hasReportedTransientFailure = !0, G) this.lastError = G;
            if (this.maybeEnterStickyTransientFailureMode(), I === this.currentSubchannelIndex) this.startNextSubchannelConnecting(I + 1)
          }
          Y.subchannel.startConnecting();
          return
        }
    }
    startNextSubchannelConnecting(A) {
      clearTimeout(this.connectionDelayTimeout);
      for (let [Q, B] of this.children.entries())
        if (Q >= A) {
          let G = B.subchannel.getConnectivityState();
          if (G === bW.ConnectivityState.IDLE || G === bW.ConnectivityState.CONNECTING) {
            this.startConnecting(Q);
            return
          }
        } this.maybeEnterStickyTransientFailureMode()
    }
    startConnecting(A) {
      var Q, B;
      if (clearTimeout(this.connectionDelayTimeout), this.currentSubchannelIndex = A, this.children[A].subchannel.getConnectivityState() === bW.ConnectivityState.IDLE) sOA("Start connecting to subchannel with address " + this.children[A].subchannel.getAddress()), process.nextTick(() => {
        var G;
        (G = this.children[A]) === null || G === void 0 || G.subchannel.startConnecting()
      });
      this.connectionDelayTimeout = setTimeout(() => {
        this.startNextSubchannelConnecting(A + 1)
      }, w_5), (B = (Q = this.connectionDelayTimeout).unref) === null || B === void 0 || B.call(Q)
    }
    pickSubchannel(A) {
      sOA("Pick subchannel with address " + A.getAddress()), this.stickyTransientFailureMode = !1, A.ref(), this.channelControlHelper.addChannelzChild(A.getChannelzRef()), this.removeCurrentPick(), this.resetSubchannelList(), A.addConnectivityStateListener(this.subchannelStateListener), A.addHealthStateWatcher(this.pickedSubchannelHealthListener), this.currentPick = A, clearTimeout(this.connectionDelayTimeout), this.calculateAndReportNewState()
    }
    updateState(A, Q, B) {
      sOA(bW.ConnectivityState[this.currentState] + " -> " + bW.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    resetSubchannelList() {
      for (let A of this.children) A.subchannel.removeConnectivityStateListener(this.subchannelStateListener), A.subchannel.unref(), this.channelControlHelper.removeChannelzChild(A.subchannel.getChannelzRef());
      this.currentSubchannelIndex = 0, this.children = []
    }
    connectToAddressList(A, Q) {
      sOA("connectToAddressList([" + A.map((G) => (0, Uw2.subchannelAddressToString)(G)) + "])");
      let B = A.map((G) => ({
        subchannel: this.channelControlHelper.createSubchannel(G, Q),
        hasReportedTransientFailure: !1
      }));
      for (let {
          subchannel: G
        }
        of B)
        if (G.getConnectivityState() === bW.ConnectivityState.READY) {
          this.pickSubchannel(G);
          return
        } for (let {
          subchannel: G
        }
        of B) G.ref(), this.channelControlHelper.addChannelzChild(G.getChannelzRef());
      this.resetSubchannelList(), this.children = B;
      for (let {
          subchannel: G
        }
        of this.children) G.addConnectivityStateListener(this.subchannelStateListener);
      for (let G of this.children)
        if (G.subchannel.getConnectivityState() === bW.ConnectivityState.TRANSIENT_FAILURE) G.hasReportedTransientFailure = !0;
      this.startNextSubchannelConnecting(0), this.calculateAndReportNewState()
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof OJA)) return !1;
      if (!A.ok) {
        if (this.children.length === 0 && this.currentPick === null) this.channelControlHelper.updateState(bW.ConnectivityState.TRANSIENT_FAILURE, new Gn.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      let Z = A.value;
      if (this.reportHealthStatus = B[Lw2], Q.getShuffleAddressList()) Z = Nw2(Z);
      let I = [].concat(...Z.map((J) => J.addresses));
      sOA("updateAddressList([" + I.map((J) => (0, Uw2.subchannelAddressToString)(J)) + "])");
      let Y = q_5(I);
      if (this.latestAddressList = Y, this.latestOptions = B, this.connectToAddressList(Y, B), this.latestResolutionNote = G, I.length > 0) return !0;
      else return this.lastError = "No addresses resolved", !1
    }
    exitIdle() {
      if (this.currentState === bW.ConnectivityState.IDLE && this.latestAddressList) this.connectToAddressList(this.latestAddressList, this.latestOptions)
    }
    resetBackoff() {}
    destroy() {
      this.resetSubchannelList(), this.removeCurrentPick()
    }
    getTypeName() {
      return rOA
    }
  }
  Ow2.PickFirstLoadBalancer = y81;
  var N_5 = new OJA(!1);
  class Mw2 {
    constructor(A, Q, B, G) {
      this.endpoint = A, this.options = B, this.resolutionNote = G, this.latestState = bW.ConnectivityState.IDLE;
      let Z = (0, I40.createChildChannelControlHelper)(Q, {
        updateState: (I, Y, J) => {
          this.latestState = I, this.latestPicker = Y, Q.updateState(I, Y, J)
        }
      });
      this.pickFirstBalancer = new y81(Z), this.latestPicker = new Gn.QueuePicker(this.pickFirstBalancer)
    }
    startConnecting() {
      this.pickFirstBalancer.updateAddressList((0, U_5.statusOrFromValue)([this.endpoint]), N_5, Object.assign(Object.assign({}, this.options), {
        [Lw2]: !0
      }), this.resolutionNote)
    }
    updateEndpoint(A, Q) {
      if (this.options = Q, this.endpoint = A, this.latestState !== bW.ConnectivityState.IDLE) this.startConnecting()
    }
    getConnectivityState() {
      return this.latestState
    }
    getPicker() {
      return this.latestPicker
    }
    getEndpoint() {
      return this.endpoint
    }
    exitIdle() {
      this.pickFirstBalancer.exitIdle()
    }
    destroy() {
      this.pickFirstBalancer.destroy()
    }
  }
  Ow2.LeafLoadBalancer = Mw2;

  function L_5() {
    (0, I40.registerLoadBalancerType)(rOA, y81, OJA), (0, I40.registerDefaultLoadBalancerType)(rOA)
  }
})
// @from(Start 11066570, End 11070208)
Sw2 = z((Pw2) => {
  Object.defineProperty(Pw2, "__esModule", {
    value: !0
  });
  Pw2.FileWatcherCertificateProvider = void 0;
  var P_5 = UA("fs"),
    j_5 = zZ(),
    S_5 = E6(),
    __5 = UA("util"),
    k_5 = "certificate_provider";

  function x81(A) {
    j_5.trace(S_5.LogVerbosity.DEBUG, k_5, A)
  }
  var Y40 = (0, __5.promisify)(P_5.readFile);
  class Tw2 {
    constructor(A) {
      if (this.config = A, this.refreshTimer = null, this.fileResultPromise = null, this.latestCaUpdate = void 0, this.caListeners = new Set, this.latestIdentityUpdate = void 0, this.identityListeners = new Set, this.lastUpdateTime = null, A.certificateFile === void 0 !== (A.privateKeyFile === void 0)) throw Error("certificateFile and privateKeyFile must be set or unset together");
      if (A.certificateFile === void 0 && A.caCertificateFile === void 0) throw Error("At least one of certificateFile and caCertificateFile must be set");
      x81("File watcher constructed with config " + JSON.stringify(A))
    }
    updateCertificates() {
      if (this.fileResultPromise) return;
      this.fileResultPromise = Promise.allSettled([this.config.certificateFile ? Y40(this.config.certificateFile) : Promise.reject(), this.config.privateKeyFile ? Y40(this.config.privateKeyFile) : Promise.reject(), this.config.caCertificateFile ? Y40(this.config.caCertificateFile) : Promise.reject()]), this.fileResultPromise.then(([A, Q, B]) => {
        if (!this.refreshTimer) return;
        if (x81("File watcher read certificates certificate " + A.status + ", privateKey " + Q.status + ", CA certificate " + B.status), this.lastUpdateTime = new Date, this.fileResultPromise = null, A.status === "fulfilled" && Q.status === "fulfilled") this.latestIdentityUpdate = {
          certificate: A.value,
          privateKey: Q.value
        };
        else this.latestIdentityUpdate = null;
        if (B.status === "fulfilled") this.latestCaUpdate = {
          caCertificate: B.value
        };
        else this.latestCaUpdate = null;
        for (let G of this.identityListeners) G(this.latestIdentityUpdate);
        for (let G of this.caListeners) G(this.latestCaUpdate)
      }), x81("File watcher initiated certificate update")
    }
    maybeStartWatchingFiles() {
      if (!this.refreshTimer) {
        let A = this.lastUpdateTime ? new Date().getTime() - this.lastUpdateTime.getTime() : 1 / 0;
        if (A > this.config.refreshIntervalMs) this.updateCertificates();
        if (A > this.config.refreshIntervalMs * 2) this.latestCaUpdate = void 0, this.latestIdentityUpdate = void 0;
        this.refreshTimer = setInterval(() => this.updateCertificates(), this.config.refreshIntervalMs), x81("File watcher started watching")
      }
    }
    maybeStopWatchingFiles() {
      if (this.caListeners.size === 0 && this.identityListeners.size === 0) {
        if (this.fileResultPromise = null, this.refreshTimer) clearInterval(this.refreshTimer), this.refreshTimer = null
      }
    }
    addCaCertificateListener(A) {
      if (this.caListeners.add(A), this.maybeStartWatchingFiles(), this.latestCaUpdate !== void 0) process.nextTick(A, this.latestCaUpdate)
    }
    removeCaCertificateListener(A) {
      this.caListeners.delete(A), this.maybeStopWatchingFiles()
    }
    addIdentityCertificateListener(A) {
      if (this.identityListeners.add(A), this.maybeStartWatchingFiles(), this.latestIdentityUpdate !== void 0) process.nextTick(A, this.latestIdentityUpdate)
    }
    removeIdentityCertificateListener(A) {
      this.identityListeners.delete(A), this.maybeStopWatchingFiles()
    }
  }
  Pw2.FileWatcherCertificateProvider = Tw2
})
// @from(Start 11070214, End 11076697)
X40 = z((W5) => {
  Object.defineProperty(W5, "__esModule", {
    value: !0
  });
  W5.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX = W5.createCertificateProviderChannelCredentials = W5.FileWatcherCertificateProvider = W5.createCertificateProviderServerCredentials = W5.createServerCredentialsWithInterceptors = W5.BaseSubchannelWrapper = W5.registerAdminService = W5.FilterStackFactory = W5.BaseFilter = W5.statusOrFromError = W5.statusOrFromValue = W5.PickResultType = W5.QueuePicker = W5.UnavailablePicker = W5.ChildLoadBalancerHandler = W5.EndpointMap = W5.endpointHasAddress = W5.endpointToString = W5.subchannelAddressToString = W5.LeafLoadBalancer = W5.isLoadBalancerNameRegistered = W5.parseLoadBalancingConfig = W5.selectLbConfigFromList = W5.registerLoadBalancerType = W5.createChildChannelControlHelper = W5.BackoffTimeout = W5.parseDuration = W5.durationToMs = W5.splitHostPort = W5.uriToString = W5.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = W5.createResolver = W5.registerResolver = W5.log = W5.trace = void 0;
  var _w2 = zZ();
  Object.defineProperty(W5, "trace", {
    enumerable: !0,
    get: function() {
      return _w2.trace
    }
  });
  Object.defineProperty(W5, "log", {
    enumerable: !0,
    get: function() {
      return _w2.log
    }
  });
  var J40 = CP();
  Object.defineProperty(W5, "registerResolver", {
    enumerable: !0,
    get: function() {
      return J40.registerResolver
    }
  });
  Object.defineProperty(W5, "createResolver", {
    enumerable: !0,
    get: function() {
      return J40.createResolver
    }
  });
  Object.defineProperty(W5, "CHANNEL_ARGS_CONFIG_SELECTOR_KEY", {
    enumerable: !0,
    get: function() {
      return J40.CHANNEL_ARGS_CONFIG_SELECTOR_KEY
    }
  });
  var kw2 = uE();
  Object.defineProperty(W5, "uriToString", {
    enumerable: !0,
    get: function() {
      return kw2.uriToString
    }
  });
  Object.defineProperty(W5, "splitHostPort", {
    enumerable: !0,
    get: function() {
      return kw2.splitHostPort
    }
  });
  var yw2 = aOA();
  Object.defineProperty(W5, "durationToMs", {
    enumerable: !0,
    get: function() {
      return yw2.durationToMs
    }
  });
  Object.defineProperty(W5, "parseDuration", {
    enumerable: !0,
    get: function() {
      return yw2.parseDuration
    }
  });
  var y_5 = QJA();
  Object.defineProperty(W5, "BackoffTimeout", {
    enumerable: !0,
    get: function() {
      return y_5.BackoffTimeout
    }
  });
  var tOA = li();
  Object.defineProperty(W5, "createChildChannelControlHelper", {
    enumerable: !0,
    get: function() {
      return tOA.createChildChannelControlHelper
    }
  });
  Object.defineProperty(W5, "registerLoadBalancerType", {
    enumerable: !0,
    get: function() {
      return tOA.registerLoadBalancerType
    }
  });
  Object.defineProperty(W5, "selectLbConfigFromList", {
    enumerable: !0,
    get: function() {
      return tOA.selectLbConfigFromList
    }
  });
  Object.defineProperty(W5, "parseLoadBalancingConfig", {
    enumerable: !0,
    get: function() {
      return tOA.parseLoadBalancingConfig
    }
  });
  Object.defineProperty(W5, "isLoadBalancerNameRegistered", {
    enumerable: !0,
    get: function() {
      return tOA.isLoadBalancerNameRegistered
    }
  });
  var x_5 = oOA();
  Object.defineProperty(W5, "LeafLoadBalancer", {
    enumerable: !0,
    get: function() {
      return x_5.LeafLoadBalancer
    }
  });
  var v81 = eU();
  Object.defineProperty(W5, "subchannelAddressToString", {
    enumerable: !0,
    get: function() {
      return v81.subchannelAddressToString
    }
  });
  Object.defineProperty(W5, "endpointToString", {
    enumerable: !0,
    get: function() {
      return v81.endpointToString
    }
  });
  Object.defineProperty(W5, "endpointHasAddress", {
    enumerable: !0,
    get: function() {
      return v81.endpointHasAddress
    }
  });
  Object.defineProperty(W5, "EndpointMap", {
    enumerable: !0,
    get: function() {
      return v81.EndpointMap
    }
  });
  var v_5 = y41();
  Object.defineProperty(W5, "ChildLoadBalancerHandler", {
    enumerable: !0,
    get: function() {
      return v_5.ChildLoadBalancerHandler
    }
  });
  var W40 = Ph();
  Object.defineProperty(W5, "UnavailablePicker", {
    enumerable: !0,
    get: function() {
      return W40.UnavailablePicker
    }
  });
  Object.defineProperty(W5, "QueuePicker", {
    enumerable: !0,
    get: function() {
      return W40.QueuePicker
    }
  });
  Object.defineProperty(W5, "PickResultType", {
    enumerable: !0,
    get: function() {
      return W40.PickResultType
    }
  });
  var xw2 = o1A();
  Object.defineProperty(W5, "statusOrFromValue", {
    enumerable: !0,
    get: function() {
      return xw2.statusOrFromValue
    }
  });
  Object.defineProperty(W5, "statusOrFromError", {
    enumerable: !0,
    get: function() {
      return xw2.statusOrFromError
    }
  });
  var b_5 = q90();
  Object.defineProperty(W5, "BaseFilter", {
    enumerable: !0,
    get: function() {
      return b_5.BaseFilter
    }
  });
  var f_5 = H81();
  Object.defineProperty(W5, "FilterStackFactory", {
    enumerable: !0,
    get: function() {
      return f_5.FilterStackFactory
    }
  });
  var h_5 = v41();
  Object.defineProperty(W5, "registerAdminService", {
    enumerable: !0,
    get: function() {
      return h_5.registerAdminService
    }
  });
  var g_5 = iOA();
  Object.defineProperty(W5, "BaseSubchannelWrapper", {
    enumerable: !0,
    get: function() {
      return g_5.BaseSubchannelWrapper
    }
  });
  var vw2 = T81();
  Object.defineProperty(W5, "createServerCredentialsWithInterceptors", {
    enumerable: !0,
    get: function() {
      return vw2.createServerCredentialsWithInterceptors
    }
  });
  Object.defineProperty(W5, "createCertificateProviderServerCredentials", {
    enumerable: !0,
    get: function() {
      return vw2.createCertificateProviderServerCredentials
    }
  });
  var u_5 = Sw2();
  Object.defineProperty(W5, "FileWatcherCertificateProvider", {
    enumerable: !0,
    get: function() {
      return u_5.FileWatcherCertificateProvider
    }
  });
  var m_5 = AJA();
  Object.defineProperty(W5, "createCertificateProviderChannelCredentials", {
    enumerable: !0,
    get: function() {
      return m_5.createCertificateProviderChannelCredentials
    }
  });
  var d_5 = d90();
  Object.defineProperty(W5, "SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX", {
    enumerable: !0,
    get: function() {
      return d_5.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX
    }
  })
})
// @from(Start 11076703, End 11077514)
hw2 = z((fw2) => {
  Object.defineProperty(fw2, "__esModule", {
    value: !0
  });
  fw2.setup = i_5;
  var p_5 = CP(),
    l_5 = o1A();
  class bw2 {
    constructor(A, Q, B) {
      this.listener = Q, this.hasReturnedResult = !1, this.endpoints = [];
      let G;
      if (A.authority === "") G = "/" + A.path;
      else G = A.path;
      this.endpoints = [{
        addresses: [{
          path: G
        }]
      }]
    }
    updateResolution() {
      if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(this.listener, (0, l_5.statusOrFromValue)(this.endpoints), {}, null, "")
    }
    destroy() {
      this.hasReturnedResult = !1
    }
    static getDefaultAuthority(A) {
      return "localhost"
    }
  }

  function i_5() {
    (0, p_5.registerResolver)("unix", bw2)
  }
})
// @from(Start 11077520, End 11079887)
lw2 = z((pw2) => {
  Object.defineProperty(pw2, "__esModule", {
    value: !0
  });
  pw2.setup = t_5;
  var gw2 = UA("net"),
    uw2 = o1A(),
    b81 = E6(),
    V40 = YK(),
    mw2 = CP(),
    a_5 = eU(),
    dw2 = uE(),
    s_5 = zZ(),
    r_5 = "ip_resolver";

  function cw2(A) {
    s_5.trace(b81.LogVerbosity.DEBUG, r_5, A)
  }
  var F40 = "ipv4",
    K40 = "ipv6",
    o_5 = 443;
  class D40 {
    constructor(A, Q, B) {
      var G;
      this.listener = Q, this.endpoints = [], this.error = null, this.hasReturnedResult = !1, cw2("Resolver constructed for target " + (0, dw2.uriToString)(A));
      let Z = [];
      if (!(A.scheme === F40 || A.scheme === K40)) {
        this.error = {
          code: b81.Status.UNAVAILABLE,
          details: `Unrecognized scheme ${A.scheme} in IP resolver`,
          metadata: new V40.Metadata
        };
        return
      }
      let I = A.path.split(",");
      for (let Y of I) {
        let J = (0, dw2.splitHostPort)(Y);
        if (J === null) {
          this.error = {
            code: b81.Status.UNAVAILABLE,
            details: `Failed to parse ${A.scheme} address ${Y}`,
            metadata: new V40.Metadata
          };
          return
        }
        if (A.scheme === F40 && !(0, gw2.isIPv4)(J.host) || A.scheme === K40 && !(0, gw2.isIPv6)(J.host)) {
          this.error = {
            code: b81.Status.UNAVAILABLE,
            details: `Failed to parse ${A.scheme} address ${Y}`,
            metadata: new V40.Metadata
          };
          return
        }
        Z.push({
          host: J.host,
          port: (G = J.port) !== null && G !== void 0 ? G : o_5
        })
      }
      this.endpoints = Z.map((Y) => ({
        addresses: [Y]
      })), cw2("Parsed " + A.scheme + " address list " + Z.map(a_5.subchannelAddressToString))
    }
    updateResolution() {
      if (!this.hasReturnedResult) this.hasReturnedResult = !0, process.nextTick(() => {
        if (this.error) this.listener((0, uw2.statusOrFromError)(this.error), {}, null, "");
        else this.listener((0, uw2.statusOrFromValue)(this.endpoints), {}, null, "")
      })
    }
    destroy() {
      this.hasReturnedResult = !1
    }
    static getDefaultAuthority(A) {
      return A.path.split(",")[0]
    }
  }

  function t_5() {
    (0, mw2.registerResolver)(F40, D40), (0, mw2.registerResolver)(K40, D40)
  }
})
// @from(Start 11079893, End 11084542)
tw2 = z((rw2) => {
  Object.defineProperty(rw2, "__esModule", {
    value: !0
  });
  rw2.RoundRobinLoadBalancer = void 0;
  rw2.setup = Ik5;
  var aw2 = li(),
    dD = mE(),
    eOA = Ph(),
    Ak5 = zZ(),
    Qk5 = E6(),
    iw2 = eU(),
    Bk5 = oOA(),
    Gk5 = "round_robin";

  function nw2(A) {
    Ak5.trace(Qk5.LogVerbosity.DEBUG, Gk5, A)
  }
  var f81 = "round_robin";
  class h81 {
    getLoadBalancerName() {
      return f81
    }
    constructor() {}
    toJsonObject() {
      return {
        [f81]: {}
      }
    }
    static createFromJson(A) {
      return new h81
    }
  }
  class sw2 {
    constructor(A, Q = 0) {
      this.children = A, this.nextIndex = Q
    }
    pick(A) {
      let Q = this.children[this.nextIndex].picker;
      return this.nextIndex = (this.nextIndex + 1) % this.children.length, Q.pick(A)
    }
    peekNextEndpoint() {
      return this.children[this.nextIndex].endpoint
    }
  }

  function Zk5(A, Q) {
    return [...A.slice(Q), ...A.slice(0, Q)]
  }
  class H40 {
    constructor(A) {
      this.channelControlHelper = A, this.children = [], this.currentState = dD.ConnectivityState.IDLE, this.currentReadyPicker = null, this.updatesPaused = !1, this.lastError = null, this.childChannelControlHelper = (0, aw2.createChildChannelControlHelper)(A, {
        updateState: (Q, B, G) => {
          if (this.currentState === dD.ConnectivityState.READY && Q !== dD.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
          if (G) this.lastError = G;
          this.calculateAndUpdateState()
        }
      })
    }
    countChildrenWithState(A) {
      return this.children.filter((Q) => Q.getConnectivityState() === A).length
    }
    calculateAndUpdateState() {
      if (this.updatesPaused) return;
      if (this.countChildrenWithState(dD.ConnectivityState.READY) > 0) {
        let A = this.children.filter((B) => B.getConnectivityState() === dD.ConnectivityState.READY),
          Q = 0;
        if (this.currentReadyPicker !== null) {
          let B = this.currentReadyPicker.peekNextEndpoint();
          if (Q = A.findIndex((G) => (0, iw2.endpointEqual)(G.getEndpoint(), B)), Q < 0) Q = 0
        }
        this.updateState(dD.ConnectivityState.READY, new sw2(A.map((B) => ({
          endpoint: B.getEndpoint(),
          picker: B.getPicker()
        })), Q), null)
      } else if (this.countChildrenWithState(dD.ConnectivityState.CONNECTING) > 0) this.updateState(dD.ConnectivityState.CONNECTING, new eOA.QueuePicker(this), null);
      else if (this.countChildrenWithState(dD.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(dD.ConnectivityState.TRANSIENT_FAILURE, new eOA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(dD.ConnectivityState.IDLE, new eOA.QueuePicker(this), null);
      for (let A of this.children)
        if (A.getConnectivityState() === dD.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      if (nw2(dD.ConnectivityState[this.currentState] + " -> " + dD.ConnectivityState[A]), A === dD.ConnectivityState.READY) this.currentReadyPicker = Q;
      else this.currentReadyPicker = null;
      this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    resetSubchannelList() {
      for (let A of this.children) A.destroy();
      this.children = []
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof h81)) return !1;
      if (!A.ok) {
        if (this.children.length === 0) this.updateState(dD.ConnectivityState.TRANSIENT_FAILURE, new eOA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      let Z = Math.random() * A.value.length | 0,
        I = Zk5(A.value, Z);
      if (this.resetSubchannelList(), I.length === 0) {
        let Y = `No addresses resolved. Resolution note: ${G}`;
        this.updateState(dD.ConnectivityState.TRANSIENT_FAILURE, new eOA.UnavailablePicker({
          details: Y
        }), Y)
      }
      nw2("Connect to endpoint list " + I.map(iw2.endpointToString)), this.updatesPaused = !0, this.children = I.map((Y) => new Bk5.LeafLoadBalancer(Y, this.childChannelControlHelper, B, G));
      for (let Y of this.children) Y.startConnecting();
      return this.updatesPaused = !1, this.calculateAndUpdateState(), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      this.resetSubchannelList()
    }
    getTypeName() {
      return f81
    }
  }
  rw2.RoundRobinLoadBalancer = H40;

  function Ik5() {
    (0, aw2.registerLoadBalancerType)(f81, H40, h81)
  }
})
// @from(Start 11084548, End 11099670)
Yq2 = z((Zq2) => {
  var C40;
  Object.defineProperty(Zq2, "__esModule", {
    value: !0
  });
  Zq2.OutlierDetectionLoadBalancer = Zq2.OutlierDetectionLoadBalancingConfig = void 0;
  Zq2.setup = zk5;
  var Jk5 = mE(),
    ew2 = E6(),
    W0A = aOA(),
    Aq2 = X40(),
    Wk5 = li(),
    Xk5 = y41(),
    Vk5 = Ph(),
    E40 = eU(),
    Fk5 = iOA(),
    Kk5 = zZ(),
    Dk5 = "outlier_detection";

  function XK(A) {
    Kk5.trace(ew2.LogVerbosity.DEBUG, Dk5, A)
  }
  var $40 = "outlier_detection",
    Hk5 = ((C40 = process.env.GRPC_EXPERIMENTAL_ENABLE_OUTLIER_DETECTION) !== null && C40 !== void 0 ? C40 : "true") === "true",
    Ck5 = {
      stdev_factor: 1900,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 100
    },
    Ek5 = {
      threshold: 85,
      enforcement_percentage: 100,
      minimum_hosts: 5,
      request_volume: 50
    };

  function RJA(A, Q, B, G) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) {
      let Z = G ? `${G}.${Q}` : Q;
      throw Error(`outlier detection config ${Z} parse error: expected ${B}, got ${typeof A[Q]}`)
    }
  }

  function z40(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (Q in A && A[Q] !== void 0) {
      if (!(0, W0A.isDuration)(A[Q])) throw Error(`outlier detection config ${G} parse error: expected Duration, got ${typeof A[Q]}`);
      if (!(A[Q].seconds >= 0 && A[Q].seconds <= 315576000000 && A[Q].nanos >= 0 && A[Q].nanos <= 999999999)) throw Error(`outlier detection config ${G} parse error: values out of range for non-negative Duaration`)
    }
  }

  function g81(A, Q, B) {
    let G = B ? `${B}.${Q}` : Q;
    if (RJA(A, Q, "number", B), Q in A && A[Q] !== void 0 && !(A[Q] >= 0 && A[Q] <= 100)) throw Error(`outlier detection config ${G} parse error: value out of range for percentage (0-100)`)
  }
  class ARA {
    constructor(A, Q, B, G, Z, I, Y) {
      if (this.childPolicy = Y, Y.getLoadBalancerName() === "pick_first") throw Error("outlier_detection LB policy cannot have a pick_first child policy");
      this.intervalMs = A !== null && A !== void 0 ? A : 1e4, this.baseEjectionTimeMs = Q !== null && Q !== void 0 ? Q : 30000, this.maxEjectionTimeMs = B !== null && B !== void 0 ? B : 300000, this.maxEjectionPercent = G !== null && G !== void 0 ? G : 10, this.successRateEjection = Z ? Object.assign(Object.assign({}, Ck5), Z) : null, this.failurePercentageEjection = I ? Object.assign(Object.assign({}, Ek5), I) : null
    }
    getLoadBalancerName() {
      return $40
    }
    toJsonObject() {
      var A, Q;
      return {
        outlier_detection: {
          interval: (0, W0A.msToDuration)(this.intervalMs),
          base_ejection_time: (0, W0A.msToDuration)(this.baseEjectionTimeMs),
          max_ejection_time: (0, W0A.msToDuration)(this.maxEjectionTimeMs),
          max_ejection_percent: this.maxEjectionPercent,
          success_rate_ejection: (A = this.successRateEjection) !== null && A !== void 0 ? A : void 0,
          failure_percentage_ejection: (Q = this.failurePercentageEjection) !== null && Q !== void 0 ? Q : void 0,
          child_policy: [this.childPolicy.toJsonObject()]
        }
      }
    }
    getIntervalMs() {
      return this.intervalMs
    }
    getBaseEjectionTimeMs() {
      return this.baseEjectionTimeMs
    }
    getMaxEjectionTimeMs() {
      return this.maxEjectionTimeMs
    }
    getMaxEjectionPercent() {
      return this.maxEjectionPercent
    }
    getSuccessRateEjectionConfig() {
      return this.successRateEjection
    }
    getFailurePercentageEjectionConfig() {
      return this.failurePercentageEjection
    }
    getChildPolicy() {
      return this.childPolicy
    }
    static createFromJson(A) {
      var Q;
      if (z40(A, "interval"), z40(A, "base_ejection_time"), z40(A, "max_ejection_time"), g81(A, "max_ejection_percent"), "success_rate_ejection" in A && A.success_rate_ejection !== void 0) {
        if (typeof A.success_rate_ejection !== "object") throw Error("outlier detection config success_rate_ejection must be an object");
        RJA(A.success_rate_ejection, "stdev_factor", "number", "success_rate_ejection"), g81(A.success_rate_ejection, "enforcement_percentage", "success_rate_ejection"), RJA(A.success_rate_ejection, "minimum_hosts", "number", "success_rate_ejection"), RJA(A.success_rate_ejection, "request_volume", "number", "success_rate_ejection")
      }
      if ("failure_percentage_ejection" in A && A.failure_percentage_ejection !== void 0) {
        if (typeof A.failure_percentage_ejection !== "object") throw Error("outlier detection config failure_percentage_ejection must be an object");
        g81(A.failure_percentage_ejection, "threshold", "failure_percentage_ejection"), g81(A.failure_percentage_ejection, "enforcement_percentage", "failure_percentage_ejection"), RJA(A.failure_percentage_ejection, "minimum_hosts", "number", "failure_percentage_ejection"), RJA(A.failure_percentage_ejection, "request_volume", "number", "failure_percentage_ejection")
      }
      if (!("child_policy" in A) || !Array.isArray(A.child_policy)) throw Error("outlier detection config child_policy must be an array");
      let B = (0, Wk5.selectLbConfigFromList)(A.child_policy);
      if (!B) throw Error("outlier detection config child_policy: no valid recognized policy found");
      return new ARA(A.interval ? (0, W0A.durationToMs)(A.interval) : null, A.base_ejection_time ? (0, W0A.durationToMs)(A.base_ejection_time) : null, A.max_ejection_time ? (0, W0A.durationToMs)(A.max_ejection_time) : null, (Q = A.max_ejection_percent) !== null && Q !== void 0 ? Q : null, A.success_rate_ejection, A.failure_percentage_ejection, B)
    }
  }
  Zq2.OutlierDetectionLoadBalancingConfig = ARA;
  class Qq2 extends Fk5.BaseSubchannelWrapper {
    constructor(A, Q) {
      super(A);
      this.mapEntry = Q, this.refCount = 0
    }
    ref() {
      this.child.ref(), this.refCount += 1
    }
    unref() {
      if (this.child.unref(), this.refCount -= 1, this.refCount <= 0) {
        if (this.mapEntry) {
          let A = this.mapEntry.subchannelWrappers.indexOf(this);
          if (A >= 0) this.mapEntry.subchannelWrappers.splice(A, 1)
        }
      }
    }
    eject() {
      this.setHealthy(!1)
    }
    uneject() {
      this.setHealthy(!0)
    }
    getMapEntry() {
      return this.mapEntry
    }
    getWrappedSubchannel() {
      return this.child
    }
  }

  function U40() {
    return {
      success: 0,
      failure: 0
    }
  }
  class Bq2 {
    constructor() {
      this.activeBucket = U40(), this.inactiveBucket = U40()
    }
    addSuccess() {
      this.activeBucket.success += 1
    }
    addFailure() {
      this.activeBucket.failure += 1
    }
    switchBuckets() {
      this.inactiveBucket = this.activeBucket, this.activeBucket = U40()
    }
    getLastSuccesses() {
      return this.inactiveBucket.success
    }
    getLastFailures() {
      return this.inactiveBucket.failure
    }
  }
  class Gq2 {
    constructor(A, Q) {
      this.wrappedPicker = A, this.countCalls = Q
    }
    pick(A) {
      let Q = this.wrappedPicker.pick(A);
      if (Q.pickResultType === Vk5.PickResultType.COMPLETE) {
        let B = Q.subchannel,
          G = B.getMapEntry();
        if (G) {
          let Z = Q.onCallEnded;
          if (this.countCalls) Z = (I, Y, J) => {
            var W;
            if (I === ew2.Status.OK) G.counter.addSuccess();
            else G.counter.addFailure();
            (W = Q.onCallEnded) === null || W === void 0 || W.call(Q, I, Y, J)
          };
          return Object.assign(Object.assign({}, Q), {
            subchannel: B.getWrappedSubchannel(),
            onCallEnded: Z
          })
        } else return Object.assign(Object.assign({}, Q), {
          subchannel: B.getWrappedSubchannel()
        })
      } else return Q
    }
  }
  class w40 {
    constructor(A) {
      this.entryMap = new E40.EndpointMap, this.latestConfig = null, this.timerStartTime = null, this.childBalancer = new Xk5.ChildLoadBalancerHandler((0, Aq2.createChildChannelControlHelper)(A, {
        createSubchannel: (Q, B) => {
          let G = A.createSubchannel(Q, B),
            Z = this.entryMap.getForSubchannelAddress(Q),
            I = new Qq2(G, Z);
          if ((Z === null || Z === void 0 ? void 0 : Z.currentEjectionTimestamp) !== null) I.eject();
          return Z === null || Z === void 0 || Z.subchannelWrappers.push(I), I
        },
        updateState: (Q, B, G) => {
          if (Q === Jk5.ConnectivityState.READY) A.updateState(Q, new Gq2(B, this.isCountingEnabled()), G);
          else A.updateState(Q, B, G)
        }
      })), this.ejectionTimer = setInterval(() => {}, 0), clearInterval(this.ejectionTimer)
    }
    isCountingEnabled() {
      return this.latestConfig !== null && (this.latestConfig.getSuccessRateEjectionConfig() !== null || this.latestConfig.getFailurePercentageEjectionConfig() !== null)
    }
    getCurrentEjectionPercent() {
      let A = 0;
      for (let Q of this.entryMap.values())
        if (Q.currentEjectionTimestamp !== null) A += 1;
      return A * 100 / this.entryMap.size
    }
    runSuccessRateCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getSuccessRateEjectionConfig();
      if (!Q) return;
      XK("Running success rate check");
      let B = Q.request_volume,
        G = 0,
        Z = [];
      for (let [V, F] of this.entryMap.entries()) {
        let K = F.counter.getLastSuccesses(),
          D = F.counter.getLastFailures();
        if (XK("Stats for " + (0, E40.endpointToString)(V) + ": successes=" + K + " failures=" + D + " targetRequestVolume=" + B), K + D >= B) G += 1, Z.push(K / (K + D))
      }
      if (XK("Found " + G + " success rate candidates; currentEjectionPercent=" + this.getCurrentEjectionPercent() + " successRates=[" + Z + "]"), G < Q.minimum_hosts) return;
      let I = Z.reduce((V, F) => V + F) / Z.length,
        Y = 0;
      for (let V of Z) {
        let F = V - I;
        Y += F * F
      }
      let J = Y / Z.length,
        W = Math.sqrt(J),
        X = I - W * (Q.stdev_factor / 1000);
      XK("stdev=" + W + " ejectionThreshold=" + X);
      for (let [V, F] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let K = F.counter.getLastSuccesses(),
          D = F.counter.getLastFailures();
        if (K + D < B) continue;
        let H = K / (K + D);
        if (XK("Checking candidate " + V + " successRate=" + H), H < X) {
          let C = Math.random() * 100;
          if (XK("Candidate " + V + " randomNumber=" + C + " enforcement_percentage=" + Q.enforcement_percentage), C < Q.enforcement_percentage) XK("Ejecting candidate " + V), this.eject(F, A)
        }
      }
    }
    runFailurePercentageCheck(A) {
      if (!this.latestConfig) return;
      let Q = this.latestConfig.getFailurePercentageEjectionConfig();
      if (!Q) return;
      XK("Running failure percentage check. threshold=" + Q.threshold + " request volume threshold=" + Q.request_volume);
      let B = 0;
      for (let G of this.entryMap.values()) {
        let Z = G.counter.getLastSuccesses(),
          I = G.counter.getLastFailures();
        if (Z + I >= Q.request_volume) B += 1
      }
      if (B < Q.minimum_hosts) return;
      for (let [G, Z] of this.entryMap.entries()) {
        if (this.getCurrentEjectionPercent() >= this.latestConfig.getMaxEjectionPercent()) break;
        let I = Z.counter.getLastSuccesses(),
          Y = Z.counter.getLastFailures();
        if (XK("Candidate successes=" + I + " failures=" + Y), I + Y < Q.request_volume) continue;
        if (Y * 100 / (Y + I) > Q.threshold) {
          let W = Math.random() * 100;
          if (XK("Candidate " + G + " randomNumber=" + W + " enforcement_percentage=" + Q.enforcement_percentage), W < Q.enforcement_percentage) XK("Ejecting candidate " + G), this.eject(Z, A)
        }
      }
    }
    eject(A, Q) {
      A.currentEjectionTimestamp = new Date, A.ejectionTimeMultiplier += 1;
      for (let B of A.subchannelWrappers) B.eject()
    }
    uneject(A) {
      A.currentEjectionTimestamp = null;
      for (let Q of A.subchannelWrappers) Q.uneject()
    }
    switchAllBuckets() {
      for (let A of this.entryMap.values()) A.counter.switchBuckets()
    }
    startTimer(A) {
      var Q, B;
      this.ejectionTimer = setTimeout(() => this.runChecks(), A), (B = (Q = this.ejectionTimer).unref) === null || B === void 0 || B.call(Q)
    }
    runChecks() {
      let A = new Date;
      if (XK("Ejection timer running"), this.switchAllBuckets(), !this.latestConfig) return;
      this.timerStartTime = A, this.startTimer(this.latestConfig.getIntervalMs()), this.runSuccessRateCheck(A), this.runFailurePercentageCheck(A);
      for (let [Q, B] of this.entryMap.entries())
        if (B.currentEjectionTimestamp === null) {
          if (B.ejectionTimeMultiplier > 0) B.ejectionTimeMultiplier -= 1
        } else {
          let G = this.latestConfig.getBaseEjectionTimeMs(),
            Z = this.latestConfig.getMaxEjectionTimeMs(),
            I = new Date(B.currentEjectionTimestamp.getTime());
          if (I.setMilliseconds(I.getMilliseconds() + Math.min(G * B.ejectionTimeMultiplier, Math.max(G, Z))), I < new Date) XK("Unejecting " + Q), this.uneject(B)
        }
    }
    updateAddressList(A, Q, B, G) {
      if (!(Q instanceof ARA)) return !1;
      if (XK("Received update with config: " + JSON.stringify(Q.toJsonObject(), void 0, 2)), A.ok) {
        for (let I of A.value)
          if (!this.entryMap.has(I)) XK("Adding map entry for " + (0, E40.endpointToString)(I)), this.entryMap.set(I, {
            counter: new Bq2,
            currentEjectionTimestamp: null,
            ejectionTimeMultiplier: 0,
            subchannelWrappers: []
          });
        this.entryMap.deleteMissing(A.value)
      }
      let Z = Q.getChildPolicy();
      if (this.childBalancer.updateAddressList(A, Z, B, G), Q.getSuccessRateEjectionConfig() || Q.getFailurePercentageEjectionConfig())
        if (this.timerStartTime) {
          XK("Previous timer existed. Replacing timer"), clearTimeout(this.ejectionTimer);
          let I = Q.getIntervalMs() - (new Date().getTime() - this.timerStartTime.getTime());
          this.startTimer(I)
        } else XK("Starting new timer"), this.timerStartTime = new Date, this.startTimer(Q.getIntervalMs()), this.switchAllBuckets();
      else {
        XK("Counting disabled. Cancelling timer."), this.timerStartTime = null, clearTimeout(this.ejectionTimer);
        for (let I of this.entryMap.values()) this.uneject(I), I.ejectionTimeMultiplier = 0
      }
      return this.latestConfig = Q, !0
    }
    exitIdle() {
      this.childBalancer.exitIdle()
    }
    resetBackoff() {
      this.childBalancer.resetBackoff()
    }
    destroy() {
      clearTimeout(this.ejectionTimer), this.childBalancer.destroy()
    }
    getTypeName() {
      return $40
    }
  }
  Zq2.OutlierDetectionLoadBalancer = w40;

  function zk5() {
    if (Hk5)(0, Aq2.registerLoadBalancerType)($40, w40, ARA)
  }
})
// @from(Start 11099676, End 11101149)
Vq2 = z((Wq2) => {
  Object.defineProperty(Wq2, "__esModule", {
    value: !0
  });
  Wq2.PriorityQueue = void 0;
  var TJA = 0,
    q40 = (A) => Math.floor(A / 2),
    u81 = (A) => A * 2 + 1,
    QRA = (A) => A * 2 + 2;
  class Jq2 {
    constructor(A = (Q, B) => Q > B) {
      this.comparator = A, this.heap = []
    }
    size() {
      return this.heap.length
    }
    isEmpty() {
      return this.size() == 0
    }
    peek() {
      return this.heap[TJA]
    }
    push(...A) {
      return A.forEach((Q) => {
        this.heap.push(Q), this.siftUp()
      }), this.size()
    }
    pop() {
      let A = this.peek(),
        Q = this.size() - 1;
      if (Q > TJA) this.swap(TJA, Q);
      return this.heap.pop(), this.siftDown(), A
    }
    replace(A) {
      let Q = this.peek();
      return this.heap[TJA] = A, this.siftDown(), Q
    }
    greater(A, Q) {
      return this.comparator(this.heap[A], this.heap[Q])
    }
    swap(A, Q) {
      [this.heap[A], this.heap[Q]] = [this.heap[Q], this.heap[A]]
    }
    siftUp() {
      let A = this.size() - 1;
      while (A > TJA && this.greater(A, q40(A))) this.swap(A, q40(A)), A = q40(A)
    }
    siftDown() {
      let A = TJA;
      while (u81(A) < this.size() && this.greater(u81(A), A) || QRA(A) < this.size() && this.greater(QRA(A), A)) {
        let Q = QRA(A) < this.size() && this.greater(QRA(A), u81(A)) ? QRA(A) : u81(A);
        this.swap(A, Q), A = Q
      }
    }
  }
  Wq2.PriorityQueue = Jq2
})
// @from(Start 11101155, End 11111886)
$q2 = z((zq2) => {
  Object.defineProperty(zq2, "__esModule", {
    value: !0
  });
  zq2.WeightedRoundRobinLoadBalancingConfig = void 0;
  zq2.setup = Sk5;
  var VK = mE(),
    wk5 = E6(),
    Oq = aOA(),
    Dq2 = li(),
    qk5 = oOA(),
    Nk5 = zZ(),
    Hq2 = j81(),
    PJA = Ph(),
    Lk5 = Vq2(),
    Fq2 = eU(),
    Mk5 = "weighted_round_robin";

  function N40(A) {
    Nk5.trace(wk5.LogVerbosity.DEBUG, Mk5, A)
  }
  var L40 = "weighted_round_robin",
    Ok5 = 1e4,
    Rk5 = 1e4,
    Tk5 = 180000,
    Pk5 = 1000,
    jk5 = 1;

  function Kq2(A, Q, B) {
    if (Q in A && A[Q] !== void 0 && typeof A[Q] !== B) throw Error(`weighted round robin config ${Q} parse error: expected ${B}, got ${typeof A[Q]}`)
  }

  function m81(A, Q) {
    if (Q in A && A[Q] !== void 0 && A[Q] !== null) {
      let B;
      if ((0, Oq.isDuration)(A[Q])) B = A[Q];
      else if ((0, Oq.isDurationMessage)(A[Q])) B = (0, Oq.durationMessageToDuration)(A[Q]);
      else if (typeof A[Q] === "string") {
        let G = (0, Oq.parseDuration)(A[Q]);
        if (!G) throw Error(`weighted round robin config ${Q}: failed to parse duration string ${A[Q]}`);
        B = G
      } else throw Error(`weighted round robin config ${Q}: expected duration, got ${typeof A[Q]}`);
      return (0, Oq.durationToMs)(B)
    }
    return null
  }
  class BRA {
    constructor(A, Q, B, G, Z, I) {
      this.enableOobLoadReport = A !== null && A !== void 0 ? A : !1, this.oobLoadReportingPeriodMs = Q !== null && Q !== void 0 ? Q : Ok5, this.blackoutPeriodMs = B !== null && B !== void 0 ? B : Rk5, this.weightExpirationPeriodMs = G !== null && G !== void 0 ? G : Tk5, this.weightUpdatePeriodMs = Math.max(Z !== null && Z !== void 0 ? Z : Pk5, 100), this.errorUtilizationPenalty = I !== null && I !== void 0 ? I : jk5
    }
    getLoadBalancerName() {
      return L40
    }
    toJsonObject() {
      return {
        enable_oob_load_report: this.enableOobLoadReport,
        oob_load_reporting_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.oobLoadReportingPeriodMs)),
        blackout_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.blackoutPeriodMs)),
        weight_expiration_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.weightExpirationPeriodMs)),
        weight_update_period: (0, Oq.durationToString)((0, Oq.msToDuration)(this.weightUpdatePeriodMs)),
        error_utilization_penalty: this.errorUtilizationPenalty
      }
    }
    static createFromJson(A) {
      if (Kq2(A, "enable_oob_load_report", "boolean"), Kq2(A, "error_utilization_penalty", "number"), A.error_utilization_penalty < 0) throw Error("weighted round robin config error_utilization_penalty < 0");
      return new BRA(A.enable_oob_load_report, m81(A, "oob_load_reporting_period"), m81(A, "blackout_period"), m81(A, "weight_expiration_period"), m81(A, "weight_update_period"), A.error_utilization_penalty)
    }
    getEnableOobLoadReport() {
      return this.enableOobLoadReport
    }
    getOobLoadReportingPeriodMs() {
      return this.oobLoadReportingPeriodMs
    }
    getBlackoutPeriodMs() {
      return this.blackoutPeriodMs
    }
    getWeightExpirationPeriodMs() {
      return this.weightExpirationPeriodMs
    }
    getWeightUpdatePeriodMs() {
      return this.weightUpdatePeriodMs
    }
    getErrorUtilizationPenalty() {
      return this.errorUtilizationPenalty
    }
  }
  zq2.WeightedRoundRobinLoadBalancingConfig = BRA;
  class Cq2 {
    constructor(A, Q) {
      this.metricsHandler = Q, this.queue = new Lk5.PriorityQueue((Z, I) => Z.deadline < I.deadline);
      let B = A.filter((Z) => Z.weight > 0),
        G;
      if (B.length < 2) G = 1;
      else {
        let Z = 0;
        for (let {
            weight: I
          }
          of B) Z += I;
        G = Z / B.length
      }
      for (let Z of A) {
        let I = Z.weight > 0 ? 1 / Z.weight : G;
        this.queue.push({
          endpointName: Z.endpointName,
          picker: Z.picker,
          period: I,
          deadline: Math.random() * I
        })
      }
    }
    pick(A) {
      let Q = this.queue.pop();
      this.queue.push(Object.assign(Object.assign({}, Q), {
        deadline: Q.deadline + Q.period
      }));
      let B = Q.picker.pick(A);
      if (B.pickResultType === PJA.PickResultType.COMPLETE)
        if (this.metricsHandler) return Object.assign(Object.assign({}, B), {
          onCallEnded: (0, Hq2.createMetricsReader)((G) => this.metricsHandler(G, Q.endpointName), B.onCallEnded)
        });
        else {
          let G = B.subchannel;
          return Object.assign(Object.assign({}, B), {
            subchannel: G.getWrappedSubchannel()
          })
        }
      else return B
    }
  }
  class Eq2 {
    constructor(A) {
      this.channelControlHelper = A, this.latestConfig = null, this.children = new Map, this.currentState = VK.ConnectivityState.IDLE, this.updatesPaused = !1, this.lastError = null, this.weightUpdateTimer = null
    }
    countChildrenWithState(A) {
      let Q = 0;
      for (let B of this.children.values())
        if (B.child.getConnectivityState() === A) Q += 1;
      return Q
    }
    updateWeight(A, Q) {
      var B, G;
      let {
        rps_fractional: Z,
        application_utilization: I
      } = Q;
      if (I > 0 && Z > 0) I += Q.eps / Z * ((G = (B = this.latestConfig) === null || B === void 0 ? void 0 : B.getErrorUtilizationPenalty()) !== null && G !== void 0 ? G : 0);
      let Y = I === 0 ? 0 : Z / I;
      if (Y === 0) return;
      let J = new Date;
      if (A.nonEmptySince === null) A.nonEmptySince = J;
      A.lastUpdated = J, A.weight = Y
    }
    getWeight(A) {
      if (!this.latestConfig) return 0;
      let Q = new Date().getTime();
      if (Q - A.lastUpdated.getTime() >= this.latestConfig.getWeightExpirationPeriodMs()) return A.nonEmptySince = null, 0;
      let B = this.latestConfig.getBlackoutPeriodMs();
      if (B > 0 && (A.nonEmptySince === null || Q - A.nonEmptySince.getTime() < B)) return 0;
      return A.weight
    }
    calculateAndUpdateState() {
      if (this.updatesPaused || !this.latestConfig) return;
      if (this.countChildrenWithState(VK.ConnectivityState.READY) > 0) {
        let A = [];
        for (let [B, G] of this.children) {
          if (G.child.getConnectivityState() !== VK.ConnectivityState.READY) continue;
          A.push({
            endpointName: B,
            picker: G.child.getPicker(),
            weight: this.getWeight(G)
          })
        }
        N40("Created picker with weights: " + A.map((B) => B.endpointName + ":" + B.weight).join(","));
        let Q;
        if (!this.latestConfig.getEnableOobLoadReport()) Q = (B, G) => {
          let Z = this.children.get(G);
          if (Z) this.updateWeight(Z, B)
        };
        else Q = null;
        this.updateState(VK.ConnectivityState.READY, new Cq2(A, Q), null)
      } else if (this.countChildrenWithState(VK.ConnectivityState.CONNECTING) > 0) this.updateState(VK.ConnectivityState.CONNECTING, new PJA.QueuePicker(this), null);
      else if (this.countChildrenWithState(VK.ConnectivityState.TRANSIENT_FAILURE) > 0) {
        let A = `weighted_round_robin: No connection established. Last error: ${this.lastError}`;
        this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker({
          details: A
        }), A)
      } else this.updateState(VK.ConnectivityState.IDLE, new PJA.QueuePicker(this), null);
      for (let {
          child: A
        }
        of this.children.values())
        if (A.getConnectivityState() === VK.ConnectivityState.IDLE) A.exitIdle()
    }
    updateState(A, Q, B) {
      N40(VK.ConnectivityState[this.currentState] + " -> " + VK.ConnectivityState[A]), this.currentState = A, this.channelControlHelper.updateState(A, Q, B)
    }
    updateAddressList(A, Q, B, G) {
      var Z, I;
      if (!(Q instanceof BRA)) return !1;
      if (!A.ok) {
        if (this.children.size === 0) this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker(A.error), A.error.details);
        return !0
      }
      if (A.value.length === 0) {
        let W = `No addresses resolved. Resolution note: ${G}`;
        return this.updateState(VK.ConnectivityState.TRANSIENT_FAILURE, new PJA.UnavailablePicker({
          details: W
        }), W), !1
      }
      N40("Connect to endpoint list " + A.value.map(Fq2.endpointToString));
      let Y = new Date,
        J = new Set;
      this.updatesPaused = !0, this.latestConfig = Q;
      for (let W of A.value) {
        let X = (0, Fq2.endpointToString)(W);
        J.add(X);
        let V = this.children.get(X);
        if (!V) V = {
          child: new qk5.LeafLoadBalancer(W, (0, Dq2.createChildChannelControlHelper)(this.channelControlHelper, {
            updateState: (F, K, D) => {
              if (this.currentState === VK.ConnectivityState.READY && F !== VK.ConnectivityState.READY) this.channelControlHelper.requestReresolution();
              if (F === VK.ConnectivityState.READY) V.nonEmptySince = null;
              if (D) this.lastError = D;
              this.calculateAndUpdateState()
            },
            createSubchannel: (F, K) => {
              let D = this.channelControlHelper.createSubchannel(F, K);
              if (V === null || V === void 0 ? void 0 : V.oobMetricsListener) return new Hq2.OrcaOobMetricsSubchannelWrapper(D, V.oobMetricsListener, this.latestConfig.getOobLoadReportingPeriodMs());
              else return D
            }
          }), B, G),
          lastUpdated: Y,
          nonEmptySince: null,
          weight: 0,
          oobMetricsListener: null
        }, this.children.set(X, V);
        if (Q.getEnableOobLoadReport()) V.oobMetricsListener = (F) => {
          this.updateWeight(V, F)
        };
        else V.oobMetricsListener = null
      }
      for (let [W, X] of this.children)
        if (J.has(W)) X.child.startConnecting();
        else X.child.destroy(), this.children.delete(W);
      if (this.updatesPaused = !1, this.calculateAndUpdateState(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer);
      return this.weightUpdateTimer = (I = (Z = setInterval(() => {
        if (this.currentState === VK.ConnectivityState.READY) this.calculateAndUpdateState()
      }, Q.getWeightUpdatePeriodMs())).unref) === null || I === void 0 ? void 0 : I.call(Z), !0
    }
    exitIdle() {}
    resetBackoff() {}
    destroy() {
      for (let A of this.children.values()) A.child.destroy();
      if (this.children.clear(), this.weightUpdateTimer) clearInterval(this.weightUpdateTimer)
    }
    getTypeName() {
      return L40
    }
  }

  function Sk5() {
    (0, Dq2.registerLoadBalancerType)(L40, Eq2, BRA)
  }
})
// @from(Start 11111892, End 11118500)
GRA = z((zG) => {
  Object.defineProperty(zG, "__esModule", {
    value: !0
  });
  zG.experimental = zG.ServerMetricRecorder = zG.ServerInterceptingCall = zG.ResponderBuilder = zG.ServerListenerBuilder = zG.addAdminServicesToServer = zG.getChannelzHandlers = zG.getChannelzServiceDefinition = zG.InterceptorConfigurationError = zG.InterceptingCall = zG.RequesterBuilder = zG.ListenerBuilder = zG.StatusBuilder = zG.getClientChannel = zG.ServerCredentials = zG.Server = zG.setLogVerbosity = zG.setLogger = zG.load = zG.loadObject = zG.CallCredentials = zG.ChannelCredentials = zG.waitForClientReady = zG.closeClient = zG.Channel = zG.makeGenericClientConstructor = zG.makeClientConstructor = zG.loadPackageDefinition = zG.Client = zG.compressionAlgorithms = zG.propagate = zG.connectivityState = zG.status = zG.logVerbosity = zG.Metadata = zG.credentials = void 0;
  var d81 = O41();
  Object.defineProperty(zG, "CallCredentials", {
    enumerable: !0,
    get: function() {
      return d81.CallCredentials
    }
  });
  var kk5 = N20();
  Object.defineProperty(zG, "Channel", {
    enumerable: !0,
    get: function() {
      return kk5.ChannelImplementation
    }
  });
  var yk5 = w90();
  Object.defineProperty(zG, "compressionAlgorithms", {
    enumerable: !0,
    get: function() {
      return yk5.CompressionAlgorithms
    }
  });
  var xk5 = mE();
  Object.defineProperty(zG, "connectivityState", {
    enumerable: !0,
    get: function() {
      return xk5.ConnectivityState
    }
  });
  var c81 = AJA();
  Object.defineProperty(zG, "ChannelCredentials", {
    enumerable: !0,
    get: function() {
      return c81.ChannelCredentials
    }
  });
  var wq2 = q20();
  Object.defineProperty(zG, "Client", {
    enumerable: !0,
    get: function() {
      return wq2.Client
    }
  });
  var M40 = E6();
  Object.defineProperty(zG, "logVerbosity", {
    enumerable: !0,
    get: function() {
      return M40.LogVerbosity
    }
  });
  Object.defineProperty(zG, "status", {
    enumerable: !0,
    get: function() {
      return M40.Status
    }
  });
  Object.defineProperty(zG, "propagate", {
    enumerable: !0,
    get: function() {
      return M40.Propagate
    }
  });
  var qq2 = zZ(),
    O40 = f41();
  Object.defineProperty(zG, "loadPackageDefinition", {
    enumerable: !0,
    get: function() {
      return O40.loadPackageDefinition
    }
  });
  Object.defineProperty(zG, "makeClientConstructor", {
    enumerable: !0,
    get: function() {
      return O40.makeClientConstructor
    }
  });
  Object.defineProperty(zG, "makeGenericClientConstructor", {
    enumerable: !0,
    get: function() {
      return O40.makeClientConstructor
    }
  });
  var vk5 = YK();
  Object.defineProperty(zG, "Metadata", {
    enumerable: !0,
    get: function() {
      return vk5.Metadata
    }
  });
  var bk5 = Dw2();
  Object.defineProperty(zG, "Server", {
    enumerable: !0,
    get: function() {
      return bk5.Server
    }
  });
  var fk5 = T81();
  Object.defineProperty(zG, "ServerCredentials", {
    enumerable: !0,
    get: function() {
      return fk5.ServerCredentials
    }
  });
  var hk5 = zw2();
  Object.defineProperty(zG, "StatusBuilder", {
    enumerable: !0,
    get: function() {
      return hk5.StatusBuilder
    }
  });
  zG.credentials = {
    combineChannelCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    combineCallCredentials: (A, ...Q) => {
      return Q.reduce((B, G) => B.compose(G), A)
    },
    createInsecure: c81.ChannelCredentials.createInsecure,
    createSsl: c81.ChannelCredentials.createSsl,
    createFromSecureContext: c81.ChannelCredentials.createFromSecureContext,
    createFromMetadataGenerator: d81.CallCredentials.createFromMetadataGenerator,
    createFromGoogleCredential: d81.CallCredentials.createFromGoogleCredential,
    createEmpty: d81.CallCredentials.createEmpty
  };
  var gk5 = (A) => A.close();
  zG.closeClient = gk5;
  var uk5 = (A, Q, B) => A.waitForReady(Q, B);
  zG.waitForClientReady = uk5;
  var mk5 = (A, Q) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  zG.loadObject = mk5;
  var dk5 = (A, Q, B) => {
    throw Error("Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead")
  };
  zG.load = dk5;
  var ck5 = (A) => {
    qq2.setLogger(A)
  };
  zG.setLogger = ck5;
  var pk5 = (A) => {
    qq2.setLoggerVerbosity(A)
  };
  zG.setLogVerbosity = pk5;
  var lk5 = (A) => {
    return wq2.Client.prototype.getChannel.call(A)
  };
  zG.getClientChannel = lk5;
  var p81 = $20();
  Object.defineProperty(zG, "ListenerBuilder", {
    enumerable: !0,
    get: function() {
      return p81.ListenerBuilder
    }
  });
  Object.defineProperty(zG, "RequesterBuilder", {
    enumerable: !0,
    get: function() {
      return p81.RequesterBuilder
    }
  });
  Object.defineProperty(zG, "InterceptingCall", {
    enumerable: !0,
    get: function() {
      return p81.InterceptingCall
    }
  });
  Object.defineProperty(zG, "InterceptorConfigurationError", {
    enumerable: !0,
    get: function() {
      return p81.InterceptorConfigurationError
    }
  });
  var Nq2 = ti();
  Object.defineProperty(zG, "getChannelzServiceDefinition", {
    enumerable: !0,
    get: function() {
      return Nq2.getChannelzServiceDefinition
    }
  });
  Object.defineProperty(zG, "getChannelzHandlers", {
    enumerable: !0,
    get: function() {
      return Nq2.getChannelzHandlers
    }
  });
  var ik5 = v41();
  Object.defineProperty(zG, "addAdminServicesToServer", {
    enumerable: !0,
    get: function() {
      return ik5.addAdminServicesToServer
    }
  });
  var R40 = Q40();
  Object.defineProperty(zG, "ServerListenerBuilder", {
    enumerable: !0,
    get: function() {
      return R40.ServerListenerBuilder
    }
  });
  Object.defineProperty(zG, "ResponderBuilder", {
    enumerable: !0,
    get: function() {
      return R40.ResponderBuilder
    }
  });
  Object.defineProperty(zG, "ServerInterceptingCall", {
    enumerable: !0,
    get: function() {
      return R40.ServerInterceptingCall
    }
  });
  var nk5 = j81();
  Object.defineProperty(zG, "ServerMetricRecorder", {
    enumerable: !0,
    get: function() {
      return nk5.ServerMetricRecorder
    }
  });
  var ak5 = X40();
  zG.experimental = ak5;
  var sk5 = _90(),
    rk5 = hw2(),
    ok5 = lw2(),
    tk5 = oOA(),
    ek5 = tw2(),
    Ay5 = Yq2(),
    Qy5 = $q2(),
    By5 = ti();
  (() => {
    sk5.setup(), rk5.setup(), ok5.setup(), tk5.setup(), ek5.setup(), Ay5.setup(), Qy5.setup(), By5.setup()
  })()
})
// @from(Start 11118506, End 11119161)
Rq2 = z((Mq2) => {
  Object.defineProperty(Mq2, "__esModule", {
    value: !0
  });
  Mq2.createServiceClientConstructor = void 0;
  var Fy5 = GRA();

  function Ky5(A, Q) {
    let B = {
      export: {
        path: A,
        requestStream: !1,
        responseStream: !1,
        requestSerialize: (G) => {
          return G
        },
        requestDeserialize: (G) => {
          return G
        },
        responseSerialize: (G) => {
          return G
        },
        responseDeserialize: (G) => {
          return G
        }
      }
    };
    return Fy5.makeGenericClientConstructor(B, Q)
  }
  Mq2.createServiceClientConstructor = Ky5
})
// @from(Start 11119167, End 11121458)
ZRA = z((Tq2) => {
  Object.defineProperty(Tq2, "__esModule", {
    value: !0
  });
  Tq2.createOtlpGrpcExporterTransport = Tq2.GrpcExporterTransport = Tq2.createEmptyMetadata = Tq2.createSslCredentials = Tq2.createInsecureCredentials = void 0;
  var Dy5 = 0,
    Hy5 = 2;

  function Cy5(A) {
    return A === "gzip" ? Hy5 : Dy5
  }

  function Ey5() {
    let {
      credentials: A
    } = GRA();
    return A.createInsecure()
  }
  Tq2.createInsecureCredentials = Ey5;

  function zy5(A, Q, B) {
    let {
      credentials: G
    } = GRA();
    return G.createSsl(A, Q, B)
  }
  Tq2.createSslCredentials = zy5;

  function Uy5() {
    let {
      Metadata: A
    } = GRA();
    return new A
  }
  Tq2.createEmptyMetadata = Uy5;
  class T40 {
    _parameters;
    _client;
    _metadata;
    constructor(A) {
      this._parameters = A
    }
    shutdown() {
      this._client?.close()
    }
    send(A, Q) {
      let B = Buffer.from(A);
      if (this._client == null) {
        let {
          createServiceClientConstructor: G
        } = Rq2();
        try {
          this._metadata = this._parameters.metadata()
        } catch (I) {
          return Promise.resolve({
            status: "failure",
            error: I
          })
        }
        let Z = G(this._parameters.grpcPath, this._parameters.grpcName);
        try {
          this._client = new Z(this._parameters.address, this._parameters.credentials(), {
            "grpc.default_compression_algorithm": Cy5(this._parameters.compression)
          })
        } catch (I) {
          return Promise.resolve({
            status: "failure",
            error: I
          })
        }
      }
      return new Promise((G) => {
        let Z = Date.now() + Q;
        if (this._metadata == null) return G({
          error: Error("metadata was null"),
          status: "failure"
        });
        this._client.export(B, this._metadata, {
          deadline: Z
        }, (I, Y) => {
          if (I) G({
            status: "failure",
            error: I
          });
          else G({
            data: Y,
            status: "success"
          })
        })
      })
    }
  }
  Tq2.GrpcExporterTransport = T40;

  function $y5(A) {
    return new T40(A)
  }
  Tq2.createOtlpGrpcExporterTransport = $y5
})
// @from(Start 11121464, End 11121600)
_q2 = z((jq2) => {
  Object.defineProperty(jq2, "__esModule", {
    value: !0
  });
  jq2.VERSION = void 0;
  jq2.VERSION = "0.204.0"
})
// @from(Start 11121606, End 11123557)
hq2 = z((bq2) => {
  Object.defineProperty(bq2, "__esModule", {
    value: !0
  });
  bq2.getOtlpGrpcDefaultConfiguration = bq2.mergeOtlpGrpcConfigurationWithDefaults = bq2.validateAndNormalizeUrl = void 0;
  var xq2 = sk(),
    IRA = ZRA(),
    My5 = _q2(),
    Oy5 = UA("url"),
    kq2 = K9();

  function vq2(A) {
    if (A = A.trim(), !A.match(/^([\w]{1,8}):\/\//)) A = `https://${A}`;
    let B = new Oy5.URL(A);
    if (B.protocol === "unix:") return A;
    if (B.pathname && B.pathname !== "/") kq2.diag.warn("URL path should not be set when using grpc, the path part of the URL will be ignored.");
    if (B.protocol !== "" && !B.protocol?.match(/^(http)s?:$/)) kq2.diag.warn("URL protocol should be http(s)://. Using http://.");
    return B.host
  }
  bq2.validateAndNormalizeUrl = vq2;

  function yq2(A, Q) {
    for (let [B, G] of Object.entries(Q.getMap()))
      if (A.get(B).length < 1) A.set(B, G)
  }

  function Ry5(A, Q, B) {
    let G = A.url ?? Q.url ?? B.url;
    return {
      ...(0, xq2.mergeOtlpSharedConfigurationWithDefaults)(A, Q, B),
      metadata: () => {
        let Z = B.metadata();
        return yq2(Z, A.metadata?.().clone() ?? (0, IRA.createEmptyMetadata)()), yq2(Z, Q.metadata?.() ?? (0, IRA.createEmptyMetadata)()), Z
      },
      url: vq2(G),
      credentials: A.credentials ?? Q.credentials?.(G) ?? B.credentials(G)
    }
  }
  bq2.mergeOtlpGrpcConfigurationWithDefaults = Ry5;

  function Ty5() {
    return {
      ...(0, xq2.getSharedConfigurationDefaults)(),
      metadata: () => {
        let A = (0, IRA.createEmptyMetadata)();
        return A.set("User-Agent", `OTel-OTLP-Exporter-JavaScript/${My5.VERSION}`), A
      },
      url: "http://localhost:4317",
      credentials: (A) => {
        if (A.startsWith("http://")) return () => (0, IRA.createInsecureCredentials)();
        else return () => (0, IRA.createSslCredentials)()
      }
    }
  }
  bq2.getOtlpGrpcDefaultConfiguration = Ty5
})
// @from(Start 11123563, End 11126631)
lq2 = z((cq2) => {
  Object.defineProperty(cq2, "__esModule", {
    value: !0
  });
  cq2.getOtlpGrpcConfigurationFromEnv = void 0;
  var gq2 = e6(),
    YRA = ZRA(),
    Sy5 = mi(),
    _y5 = UA("fs"),
    ky5 = UA("path"),
    mq2 = K9();

  function P40(A, Q) {
    if (A != null && A !== "") return A;
    if (Q != null && Q !== "") return Q;
    return
  }

  function yy5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_HEADERS`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_HEADERS?.trim(),
      G = (0, gq2.parseKeyPairsIntoRecord)(Q),
      Z = (0, gq2.parseKeyPairsIntoRecord)(B);
    if (Object.keys(G).length === 0 && Object.keys(Z).length === 0) return;
    let I = Object.assign({}, Z, G),
      Y = (0, YRA.createEmptyMetadata)();
    for (let [J, W] of Object.entries(I)) Y.set(J, W);
    return Y
  }

  function xy5(A) {
    let Q = yy5(A);
    if (Q == null) return;
    return () => Q
  }

  function vy5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_ENDPOINT`]?.trim(),
      B = process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.trim();
    return P40(Q, B)
  }

  function by5(A) {
    let Q = process.env[`OTEL_EXPORTER_OTLP_${A}_INSECURE`]?.toLowerCase().trim(),
      B = process.env.OTEL_EXPORTER_OTLP_INSECURE?.toLowerCase().trim();
    return P40(Q, B) === "true"
  }

  function j40(A, Q, B) {
    let G = process.env[A]?.trim(),
      Z = process.env[Q]?.trim(),
      I = P40(G, Z);
    if (I != null) try {
      return _y5.readFileSync(ky5.resolve(process.cwd(), I))
    } catch {
      mq2.diag.warn(B);
      return
    } else return
  }

  function fy5(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CLIENT_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE", "Failed to read client certificate chain file")
  }

  function hy5(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CLIENT_KEY`, "OTEL_EXPORTER_OTLP_CLIENT_KEY", "Failed to read client certificate private key file")
  }

  function uq2(A) {
    return j40(`OTEL_EXPORTER_OTLP_${A}_CERTIFICATE`, "OTEL_EXPORTER_OTLP_CERTIFICATE", "Failed to read root certificate file")
  }

  function dq2(A) {
    let Q = hy5(A),
      B = fy5(A),
      G = uq2(A),
      Z = Q != null && B != null;
    if (G != null && !Z) return mq2.diag.warn("Client key and certificate must both be provided, but one was missing - attempting to create credentials from just the root certificate"), (0, YRA.createSslCredentials)(uq2(A));
    return (0, YRA.createSslCredentials)(G, Q, B)
  }

  function gy5(A) {
    if (by5(A)) return (0, YRA.createInsecureCredentials)();
    return dq2(A)
  }

  function uy5(A) {
    return {
      ...(0, Sy5.getSharedConfigurationFromEnvironment)(A),
      metadata: xy5(A),
      url: vy5(A),
      credentials: (Q) => {
        if (Q.startsWith("http://")) return () => {
          return (0, YRA.createInsecureCredentials)()
        };
        else if (Q.startsWith("https://")) return () => {
          return dq2(A)
        };
        return () => {
          return gy5(A)
        }
      }
    }
  }
  cq2.getOtlpGrpcConfigurationFromEnv = uy5
})
// @from(Start 11126637, End 11127440)
sq2 = z((nq2) => {
  Object.defineProperty(nq2, "__esModule", {
    value: !0
  });
  nq2.convertLegacyOtlpGrpcOptions = void 0;
  var my5 = K9(),
    iq2 = hq2(),
    dy5 = ZRA(),
    cy5 = lq2();

  function py5(A, Q) {
    if (A.headers) my5.diag.warn("Headers cannot be set when using grpc");
    let B = A.credentials;
    return (0, iq2.mergeOtlpGrpcConfigurationWithDefaults)({
      url: A.url,
      metadata: () => {
        return A.metadata ?? (0, dy5.createEmptyMetadata)()
      },
      compression: A.compression,
      timeoutMillis: A.timeoutMillis,
      concurrencyLimit: A.concurrencyLimit,
      credentials: B != null ? () => B : void 0
    }, (0, cy5.getOtlpGrpcConfigurationFromEnv)(Q), (0, iq2.getOtlpGrpcDefaultConfiguration)())
  }
  nq2.convertLegacyOtlpGrpcOptions = py5
})
// @from(Start 11127446, End 11127951)
tq2 = z((rq2) => {
  Object.defineProperty(rq2, "__esModule", {
    value: !0
  });
  rq2.createOtlpGrpcExportDelegate = void 0;
  var ly5 = sk(),
    iy5 = ZRA();

  function ny5(A, Q, B, G) {
    return (0, ly5.createOtlpNetworkExportDelegate)(A, Q, (0, iy5.createOtlpGrpcExporterTransport)({
      address: A.url,
      compression: A.compression,
      credentials: A.credentials,
      metadata: A.metadata,
      grpcName: B,
      grpcPath: G
    }))
  }
  rq2.createOtlpGrpcExportDelegate = ny5
})
// @from(Start 11127957, End 11128486)
i81 = z((l81) => {
  Object.defineProperty(l81, "__esModule", {
    value: !0
  });
  l81.createOtlpGrpcExportDelegate = l81.convertLegacyOtlpGrpcOptions = void 0;
  var ay5 = sq2();
  Object.defineProperty(l81, "convertLegacyOtlpGrpcOptions", {
    enumerable: !0,
    get: function() {
      return ay5.convertLegacyOtlpGrpcOptions
    }
  });
  var sy5 = tq2();
  Object.defineProperty(l81, "createOtlpGrpcExportDelegate", {
    enumerable: !0,
    get: function() {
      return sy5.createOtlpGrpcExportDelegate
    }
  })
})
// @from(Start 11128492, End 11129011)
GN2 = z((QN2) => {
  Object.defineProperty(QN2, "__esModule", {
    value: !0
  });
  QN2.OTLPMetricExporter = void 0;
  var oy5 = w41(),
    eq2 = i81(),
    ty5 = tk();
  class AN2 extends oy5.OTLPMetricExporterBase {
    constructor(A) {
      super((0, eq2.createOtlpGrpcExportDelegate)((0, eq2.convertLegacyOtlpGrpcOptions)(A ?? {}, "METRICS"), ty5.ProtobufMetricsSerializer, "MetricsExportService", "/opentelemetry.proto.collector.metrics.v1.MetricsService/Export"), A)
    }
  }
  QN2.OTLPMetricExporter = AN2
})
// @from(Start 11129017, End 11129299)
ZN2 = z((S40) => {
  Object.defineProperty(S40, "__esModule", {
    value: !0
  });
  S40.OTLPMetricExporter = void 0;
  var ey5 = GN2();
  Object.defineProperty(S40, "OTLPMetricExporter", {
    enumerable: !0,
    get: function() {
      return ey5.OTLPMetricExporter
    }
  })
})
// @from(Start 11129305, End 11134065)
y40 = z((WN2) => {
  Object.defineProperty(WN2, "__esModule", {
    value: !0
  });
  WN2.PrometheusSerializer = void 0;
  var Qx5 = K9(),
    X0A = vi(),
    IN2 = e6();

  function a81(A) {
    return A.replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
  }

  function YN2(A = "") {
    if (typeof A !== "string") A = JSON.stringify(A);
    return a81(A).replace(/"/g, "\\\"")
  }
  var Bx5 = /[^a-z0-9_]/gi,
    Gx5 = /_{2,}/g;

  function k40(A) {
    return A.replace(Bx5, "_").replace(Gx5, "_")
  }

  function _40(A, Q) {
    if (!A.endsWith("_total") && Q.dataPointType === X0A.DataPointType.SUM && Q.isMonotonic) A = A + "_total";
    return A
  }

  function Zx5(A) {
    if (A === 1 / 0) return "+Inf";
    else if (A === -1 / 0) return "-Inf";
    else return `${A}`
  }

  function Ix5(A) {
    switch (A.dataPointType) {
      case X0A.DataPointType.SUM:
        if (A.isMonotonic) return "counter";
        return "gauge";
      case X0A.DataPointType.GAUGE:
        return "gauge";
      case X0A.DataPointType.HISTOGRAM:
        return "histogram";
      default:
        return "untyped"
    }
  }

  function n81(A, Q, B, G, Z) {
    let I = !1,
      Y = "";
    for (let [J, W] of Object.entries(Q)) {
      let X = k40(J);
      I = !0, Y += `${Y.length>0?",":""}${X}="${YN2(W)}"`
    }
    if (Z)
      for (let [J, W] of Object.entries(Z)) {
        let X = k40(J);
        I = !0, Y += `${Y.length>0?",":""}${X}="${YN2(W)}"`
      }
    if (I) A += `{${Y}}`;
    return `${A} ${Zx5(B)}${G!==void 0?" "+String(G):""}
`
  }
  var Yx5 = "# no registered metrics";
  class JN2 {
    _prefix;
    _appendTimestamp;
    _additionalAttributes;
    _withResourceConstantLabels;
    constructor(A, Q = !1, B) {
      if (A) this._prefix = A + "_";
      this._appendTimestamp = Q, this._withResourceConstantLabels = B
    }
    serialize(A) {
      let Q = "";
      this._additionalAttributes = this._filterResourceConstantLabels(A.resource.attributes, this._withResourceConstantLabels);
      for (let B of A.scopeMetrics) Q += this._serializeScopeMetrics(B);
      if (Q === "") Q += Yx5;
      return this._serializeResource(A.resource) + Q
    }
    _filterResourceConstantLabels(A, Q) {
      if (Q) {
        let B = {};
        for (let [G, Z] of Object.entries(A))
          if (G.match(Q)) B[G] = Z;
        return B
      }
      return
    }
    _serializeScopeMetrics(A) {
      let Q = "";
      for (let B of A.metrics) Q += this._serializeMetricData(B) + `
`;
      return Q
    }
    _serializeMetricData(A) {
      let Q = k40(a81(A.descriptor.name));
      if (this._prefix) Q = `${this._prefix}${Q}`;
      let B = A.dataPointType;
      Q = _40(Q, A);
      let G = `# HELP ${Q} ${a81(A.descriptor.description||"description missing")}`,
        Z = A.descriptor.unit ? `
# UNIT ${Q} ${a81(A.descriptor.unit)}` : "",
        I = `# TYPE ${Q} ${Ix5(A)}`,
        Y = "";
      switch (B) {
        case X0A.DataPointType.SUM:
        case X0A.DataPointType.GAUGE: {
          Y = A.dataPoints.map((J) => this._serializeSingularDataPoint(Q, A, J)).join("");
          break
        }
        case X0A.DataPointType.HISTOGRAM: {
          Y = A.dataPoints.map((J) => this._serializeHistogramDataPoint(Q, A, J)).join("");
          break
        }
        default:
          Qx5.diag.error(`Unrecognizable DataPointType: ${B} for metric "${Q}"`)
      }
      return `${G}${Z}
${I}
${Y}`.trim()
    }
    _serializeSingularDataPoint(A, Q, B) {
      let G = "";
      A = _40(A, Q);
      let {
        value: Z,
        attributes: I
      } = B, Y = (0, IN2.hrTimeToMilliseconds)(B.endTime);
      return G += n81(A, I, Z, this._appendTimestamp ? Y : void 0, this._additionalAttributes), G
    }
    _serializeHistogramDataPoint(A, Q, B) {
      let G = "";
      A = _40(A, Q);
      let {
        attributes: Z,
        value: I
      } = B, Y = (0, IN2.hrTimeToMilliseconds)(B.endTime);
      for (let V of ["count", "sum"]) {
        let F = I[V];
        if (F != null) G += n81(A + "_" + V, Z, F, this._appendTimestamp ? Y : void 0, this._additionalAttributes)
      }
      let J = 0,
        W = I.buckets.counts.entries(),
        X = !1;
      for (let [V, F] of W) {
        J += F;
        let K = I.buckets.boundaries[V];
        if (K === void 0 && X) break;
        if (K === 1 / 0) X = !0;
        G += n81(A + "_bucket", Z, J, this._appendTimestamp ? Y : void 0, Object.assign({}, this._additionalAttributes ?? {}, {
          le: K === void 0 || K === 1 / 0 ? "+Inf" : String(K)
        }))
      }
      return G
    }
    _serializeResource(A) {
      return `# HELP target_info Target metadata
# TYPE target_info gauge
${n81("target_info",A.attributes,1).trim()}
`
    }
  }
  WN2.PrometheusSerializer = JN2
})
// @from(Start 11134071, End 11137598)
KN2 = z((VN2) => {
  Object.defineProperty(VN2, "__esModule", {
    value: !0
  });
  VN2.PrometheusExporter = void 0;
  var JRA = K9(),
    Jx5 = e6(),
    x40 = vi(),
    Wx5 = UA("http"),
    Xx5 = y40(),
    Vx5 = UA("url");
  class Zn extends x40.MetricReader {
    static DEFAULT_OPTIONS = {
      host: void 0,
      port: 9464,
      endpoint: "/metrics",
      prefix: "",
      appendTimestamp: !1,
      withResourceConstantLabels: void 0
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
    constructor(A = {}, Q = () => {}) {
      super({
        aggregationSelector: (G) => {
          return {
            type: x40.AggregationType.DEFAULT
          }
        },
        aggregationTemporalitySelector: (G) => x40.AggregationTemporality.CUMULATIVE,
        metricProducers: A.metricProducers
      });
      this._host = A.host || process.env.OTEL_EXPORTER_PROMETHEUS_HOST || Zn.DEFAULT_OPTIONS.host, this._port = A.port || Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT) || Zn.DEFAULT_OPTIONS.port, this._prefix = A.prefix || Zn.DEFAULT_OPTIONS.prefix, this._appendTimestamp = typeof A.appendTimestamp === "boolean" ? A.appendTimestamp : Zn.DEFAULT_OPTIONS.appendTimestamp;
      let B = A.withResourceConstantLabels || Zn.DEFAULT_OPTIONS.withResourceConstantLabels;
      if (this._server = (0, Wx5.createServer)(this._requestHandler).unref(), this._serializer = new Xx5.PrometheusSerializer(this._prefix, this._appendTimestamp, B), this._baseUrl = `http://${this._host}:${this._port}/`, this._endpoint = (A.endpoint || Zn.DEFAULT_OPTIONS.endpoint).replace(/^([^/])/, "/$1"), A.preventServerStart !== !0) this.startServer().then(Q, (G) => {
        JRA.diag.error(G), Q(G)
      });
      else if (Q) queueMicrotask(Q)
    }
    async onForceFlush() {}
    onShutdown() {
      return this.stopServer()
    }
    stopServer() {
      if (!this._server) return JRA.diag.debug("Prometheus stopServer() was called but server was never started."), Promise.resolve();
      else return new Promise((A) => {
        this._server.close((Q) => {
          if (!Q) JRA.diag.debug("Prometheus exporter was stopped");
          else if (Q.code !== "ERR_SERVER_NOT_RUNNING")(0, Jx5.globalErrorHandler)(Q);
          A()
        })
      })
    }
    startServer() {
      return this._startServerPromise ??= new Promise((A, Q) => {
        this._server.once("error", Q), this._server.listen({
          port: this._port,
          host: this._host
        }, () => {
          JRA.diag.debug(`Prometheus exporter server started: ${this._host}:${this._port}/${this._endpoint}`), A()
        })
      }), this._startServerPromise
    }
    getMetricsRequestHandler(A, Q) {
      this._exportMetrics(Q)
    }
    _requestHandler = (A, Q) => {
      if (A.url != null && new Vx5.URL(A.url, this._baseUrl).pathname === this._endpoint) this._exportMetrics(Q);
      else this._notFound(Q)
    };
    _exportMetrics = (A) => {
      A.statusCode = 200, A.setHeader("content-type", "text/plain"), this.collect().then((Q) => {
        let {
          resourceMetrics: B,
          errors: G
        } = Q;
        if (G.length) JRA.diag.error("PrometheusExporter: metrics collection errors", ...G);
        A.end(this._serializer.serialize(B))
      }, (Q) => {
        A.end(`# failed to export metrics: ${Q}`)
      })
    };
    _notFound = (A) => {
      A.statusCode = 404, A.end()
    }
  }
  VN2.PrometheusExporter = Zn
})
// @from(Start 11137604, End 11138079)
DN2 = z((s81) => {
  Object.defineProperty(s81, "__esModule", {
    value: !0
  });
  s81.PrometheusSerializer = s81.PrometheusExporter = void 0;
  var Fx5 = KN2();
  Object.defineProperty(s81, "PrometheusExporter", {
    enumerable: !0,
    get: function() {
      return Fx5.PrometheusExporter
    }
  });
  var Kx5 = y40();
  Object.defineProperty(s81, "PrometheusSerializer", {
    enumerable: !0,
    get: function() {
      return Kx5.PrometheusSerializer
    }
  })
})
// @from(Start 11138085, End 11138221)
EN2 = z((HN2) => {
  Object.defineProperty(HN2, "__esModule", {
    value: !0
  });
  HN2.VERSION = void 0;
  HN2.VERSION = "0.204.0"
})
// @from(Start 11138227, End 11138785)
qN2 = z(($N2) => {
  Object.defineProperty($N2, "__esModule", {
    value: !0
  });
  $N2.OTLPLogExporter = void 0;
  var Hx5 = sk(),
    Cx5 = tk(),
    zN2 = mi(),
    Ex5 = EN2();
  class UN2 extends Hx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, zN2.createOtlpHttpExportDelegate)((0, zN2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Ex5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Cx5.ProtobufLogsSerializer))
    }
  }
  $N2.OTLPLogExporter = UN2
})
// @from(Start 11138791, End 11139064)
NN2 = z((v40) => {
  Object.defineProperty(v40, "__esModule", {
    value: !0
  });
  v40.OTLPLogExporter = void 0;
  var zx5 = qN2();
  Object.defineProperty(v40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return zx5.OTLPLogExporter
    }
  })
})
// @from(Start 11139070, End 11139343)
LN2 = z((b40) => {
  Object.defineProperty(b40, "__esModule", {
    value: !0
  });
  b40.OTLPLogExporter = void 0;
  var $x5 = NN2();
  Object.defineProperty(b40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return $x5.OTLPLogExporter
    }
  })
})
// @from(Start 11139349, End 11139622)
MN2 = z((f40) => {
  Object.defineProperty(f40, "__esModule", {
    value: !0
  });
  f40.OTLPLogExporter = void 0;
  var qx5 = LN2();
  Object.defineProperty(f40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return qx5.OTLPLogExporter
    }
  })
})
// @from(Start 11139628, End 11140115)
jN2 = z((TN2) => {
  Object.defineProperty(TN2, "__esModule", {
    value: !0
  });
  TN2.OTLPLogExporter = void 0;
  var ON2 = i81(),
    Lx5 = tk(),
    Mx5 = sk();
  class RN2 extends Mx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, ON2.createOtlpGrpcExportDelegate)((0, ON2.convertLegacyOtlpGrpcOptions)(A, "LOGS"), Lx5.ProtobufLogsSerializer, "LogsExportService", "/opentelemetry.proto.collector.logs.v1.LogsService/Export"))
    }
  }
  TN2.OTLPLogExporter = RN2
})
// @from(Start 11140121, End 11140394)
SN2 = z((h40) => {
  Object.defineProperty(h40, "__esModule", {
    value: !0
  });
  h40.OTLPLogExporter = void 0;
  var Ox5 = jN2();
  Object.defineProperty(h40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return Ox5.OTLPLogExporter
    }
  })
})
// @from(Start 11140400, End 11140536)
yN2 = z((_N2) => {
  Object.defineProperty(_N2, "__esModule", {
    value: !0
  });
  _N2.VERSION = void 0;
  _N2.VERSION = "0.204.0"
})
// @from(Start 11140542, End 11141090)
hN2 = z((bN2) => {
  Object.defineProperty(bN2, "__esModule", {
    value: !0
  });
  bN2.OTLPLogExporter = void 0;
  var Tx5 = sk(),
    Px5 = tk(),
    jx5 = yN2(),
    xN2 = mi();
  class vN2 extends Tx5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, xN2.createOtlpHttpExportDelegate)((0, xN2.convertLegacyHttpOptions)(A, "LOGS", "v1/logs", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${jx5.VERSION}`,
        "Content-Type": "application/json"
      }), Px5.JsonLogsSerializer))
    }
  }
  bN2.OTLPLogExporter = vN2
})
// @from(Start 11141096, End 11141369)
gN2 = z((g40) => {
  Object.defineProperty(g40, "__esModule", {
    value: !0
  });
  g40.OTLPLogExporter = void 0;
  var Sx5 = hN2();
  Object.defineProperty(g40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return Sx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141375, End 11141648)
uN2 = z((u40) => {
  Object.defineProperty(u40, "__esModule", {
    value: !0
  });
  u40.OTLPLogExporter = void 0;
  var kx5 = gN2();
  Object.defineProperty(u40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return kx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141654, End 11141927)
mN2 = z((m40) => {
  Object.defineProperty(m40, "__esModule", {
    value: !0
  });
  m40.OTLPLogExporter = void 0;
  var xx5 = uN2();
  Object.defineProperty(m40, "OTLPLogExporter", {
    enumerable: !0,
    get: function() {
      return xx5.OTLPLogExporter
    }
  })
})
// @from(Start 11141933, End 11142093)
pN2 = z((dN2) => {
  Object.defineProperty(dN2, "__esModule", {
    value: !0
  });
  dN2.ExceptionEventName = void 0;
  dN2.ExceptionEventName = "exception"
})
// @from(Start 11142099, End 11148788)
aN2 = z((iN2) => {
  Object.defineProperty(iN2, "__esModule", {
    value: !0
  });
  iN2.SpanImpl = void 0;
  var KO = K9(),
    GC = e6(),
    V0A = qt(),
    bx5 = pN2();
  class lN2 {
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
      code: KO.SpanStatusCode.UNSET
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
      let Q = Date.now();
      if (this._spanContext = A.spanContext, this._performanceStartTime = GC.otperformance.now(), this._performanceOffset = Q - (this._performanceStartTime + (0, GC.getTimeOrigin)()), this._startTimeProvided = A.startTime != null, this._spanLimits = A.spanLimits, this._attributeValueLengthLimit = this._spanLimits.attributeValueLengthLimit || 0, this._spanProcessor = A.spanProcessor, this.name = A.name, this.parentSpanContext = A.parentSpanContext, this.kind = A.kind, this.links = A.links || [], this.startTime = this._getTime(A.startTime ?? Q), this.resource = A.resource, this.instrumentationScope = A.scope, A.attributes != null) this.setAttributes(A.attributes);
      this._spanProcessor.onStart(this, A.context)
    }
    spanContext() {
      return this._spanContext
    }
    setAttribute(A, Q) {
      if (Q == null || this._isSpanEnded()) return this;
      if (A.length === 0) return KO.diag.warn(`Invalid attribute key: ${A}`), this;
      if (!(0, GC.isAttributeValue)(Q)) return KO.diag.warn(`Invalid attribute value set for key: ${A}`), this;
      let {
        attributeCountLimit: B
      } = this._spanLimits;
      if (B !== void 0 && Object.keys(this.attributes).length >= B && !Object.prototype.hasOwnProperty.call(this.attributes, A)) return this._droppedAttributesCount++, this;
      return this.attributes[A] = this._truncateToSize(Q), this
    }
    setAttributes(A) {
      for (let [Q, B] of Object.entries(A)) this.setAttribute(Q, B);
      return this
    }
    addEvent(A, Q, B) {
      if (this._isSpanEnded()) return this;
      let {
        eventCountLimit: G
      } = this._spanLimits;
      if (G === 0) return KO.diag.warn("No events allowed."), this._droppedEventsCount++, this;
      if (G !== void 0 && this.events.length >= G) {
        if (this._droppedEventsCount === 0) KO.diag.debug("Dropping extra events.");
        this.events.shift(), this._droppedEventsCount++
      }
      if ((0, GC.isTimeInput)(Q)) {
        if (!(0, GC.isTimeInput)(B)) B = Q;
        Q = void 0
      }
      let Z = (0, GC.sanitizeAttributes)(Q);
      return this.events.push({
        name: A,
        attributes: Z,
        time: this._getTime(B),
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
        }, this.status.message != null && typeof A.message !== "string") KO.diag.warn(`Dropping invalid status.message of type '${typeof A.message}', expected 'string'`), delete this.status.message;
      return this
    }
    updateName(A) {
      if (this._isSpanEnded()) return this;
      return this.name = A, this
    }
    end(A) {
      if (this._isSpanEnded()) {
        KO.diag.error(`${this.name} ${this._spanContext.traceId}-${this._spanContext.spanId} - You can only call end() on a span once.`);
        return
      }
      if (this._ended = !0, this.endTime = this._getTime(A), this._duration = (0, GC.hrTimeDuration)(this.startTime, this.endTime), this._duration[0] < 0) KO.diag.warn("Inconsistent start and end time, startTime > endTime. Setting span duration to 0ms.", this.startTime, this.endTime), this.endTime = this.startTime.slice(), this._duration = [0, 0];
      if (this._droppedEventsCount > 0) KO.diag.warn(`Dropped ${this._droppedEventsCount} events because eventCountLimit reached`);
      this._spanProcessor.onEnd(this)
    }
    _getTime(A) {
      if (typeof A === "number" && A <= GC.otperformance.now()) return (0, GC.hrTime)(A + this._performanceOffset);
      if (typeof A === "number") return (0, GC.millisToHrTime)(A);
      if (A instanceof Date) return (0, GC.millisToHrTime)(A.getTime());
      if ((0, GC.isTimeInputHrTime)(A)) return A;
      if (this._startTimeProvided) return (0, GC.millisToHrTime)(Date.now());
      let Q = GC.otperformance.now() - this._performanceStartTime;
      return (0, GC.addHrTimes)(this.startTime, (0, GC.millisToHrTime)(Q))
    }
    isRecording() {
      return this._ended === !1
    }
    recordException(A, Q) {
      let B = {};
      if (typeof A === "string") B[V0A.ATTR_EXCEPTION_MESSAGE] = A;
      else if (A) {
        if (A.code) B[V0A.ATTR_EXCEPTION_TYPE] = A.code.toString();
        else if (A.name) B[V0A.ATTR_EXCEPTION_TYPE] = A.name;
        if (A.message) B[V0A.ATTR_EXCEPTION_MESSAGE] = A.message;
        if (A.stack) B[V0A.ATTR_EXCEPTION_STACKTRACE] = A.stack
      }
      if (B[V0A.ATTR_EXCEPTION_TYPE] || B[V0A.ATTR_EXCEPTION_MESSAGE]) this.addEvent(bx5.ExceptionEventName, B, Q);
      else KO.diag.warn(`Failed to record an exception ${A}`)
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
        KO.diag.warn(`Cannot execute the operation on ended Span {traceId: ${this._spanContext.traceId}, spanId: ${this._spanContext.spanId}}`, A)
      }
      return this._ended
    }
    _truncateToLimitUtil(A, Q) {
      if (A.length <= Q) return A;
      return A.substring(0, Q)
    }
    _truncateToSize(A) {
      let Q = this._attributeValueLengthLimit;
      if (Q <= 0) return KO.diag.warn(`Attribute value limit must be positive, got ${Q}`), A;
      if (typeof A === "string") return this._truncateToLimitUtil(A, Q);
      if (Array.isArray(A)) return A.map((B) => typeof B === "string" ? this._truncateToLimitUtil(B, Q) : B);
      return A
    }
  }
  iN2.SpanImpl = lN2
})
// @from(Start 11148794, End 11149124)
WRA = z((sN2) => {
  Object.defineProperty(sN2, "__esModule", {
    value: !0
  });
  sN2.SamplingDecision = void 0;
  var fx5;
  (function(A) {
    A[A.NOT_RECORD = 0] = "NOT_RECORD", A[A.RECORD = 1] = "RECORD", A[A.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED"
  })(fx5 = sN2.SamplingDecision || (sN2.SamplingDecision = {}))
})
// @from(Start 11149130, End 11149470)
r81 = z((oN2) => {
  Object.defineProperty(oN2, "__esModule", {
    value: !0
  });
  oN2.AlwaysOffSampler = void 0;
  var hx5 = WRA();
  class rN2 {
    shouldSample() {
      return {
        decision: hx5.SamplingDecision.NOT_RECORD
      }
    }
    toString() {
      return "AlwaysOffSampler"
    }
  }
  oN2.AlwaysOffSampler = rN2
})
// @from(Start 11149476, End 11149821)
o81 = z((AL2) => {
  Object.defineProperty(AL2, "__esModule", {
    value: !0
  });
  AL2.AlwaysOnSampler = void 0;
  var gx5 = WRA();
  class eN2 {
    shouldSample() {
      return {
        decision: gx5.SamplingDecision.RECORD_AND_SAMPLED
      }
    }
    toString() {
      return "AlwaysOnSampler"
    }
  }
  AL2.AlwaysOnSampler = eN2
})
// @from(Start 11149827, End 11151639)
p40 = z((ZL2) => {
  Object.defineProperty(ZL2, "__esModule", {
    value: !0
  });
  ZL2.ParentBasedSampler = void 0;
  var t81 = K9(),
    ux5 = e6(),
    BL2 = r81(),
    c40 = o81();
  class GL2 {
    _root;
    _remoteParentSampled;
    _remoteParentNotSampled;
    _localParentSampled;
    _localParentNotSampled;
    constructor(A) {
      if (this._root = A.root, !this._root)(0, ux5.globalErrorHandler)(Error("ParentBasedSampler must have a root sampler configured")), this._root = new c40.AlwaysOnSampler;
      this._remoteParentSampled = A.remoteParentSampled ?? new c40.AlwaysOnSampler, this._remoteParentNotSampled = A.remoteParentNotSampled ?? new BL2.AlwaysOffSampler, this._localParentSampled = A.localParentSampled ?? new c40.AlwaysOnSampler, this._localParentNotSampled = A.localParentNotSampled ?? new BL2.AlwaysOffSampler
    }
    shouldSample(A, Q, B, G, Z, I) {
      let Y = t81.trace.getSpanContext(A);
      if (!Y || !(0, t81.isSpanContextValid)(Y)) return this._root.shouldSample(A, Q, B, G, Z, I);
      if (Y.isRemote) {
        if (Y.traceFlags & t81.TraceFlags.SAMPLED) return this._remoteParentSampled.shouldSample(A, Q, B, G, Z, I);
        return this._remoteParentNotSampled.shouldSample(A, Q, B, G, Z, I)
      }
      if (Y.traceFlags & t81.TraceFlags.SAMPLED) return this._localParentSampled.shouldSample(A, Q, B, G, Z, I);
      return this._localParentNotSampled.shouldSample(A, Q, B, G, Z, I)
    }
    toString() {
      return `ParentBased{root=${this._root.toString()}, remoteParentSampled=${this._remoteParentSampled.toString()}, remoteParentNotSampled=${this._remoteParentNotSampled.toString()}, localParentSampled=${this._localParentSampled.toString()}, localParentNotSampled=${this._localParentNotSampled.toString()}}`
    }
  }
  ZL2.ParentBasedSampler = GL2
})
// @from(Start 11151645, End 11152656)
l40 = z((WL2) => {
  Object.defineProperty(WL2, "__esModule", {
    value: !0
  });
  WL2.TraceIdRatioBasedSampler = void 0;
  var mx5 = K9(),
    YL2 = WRA();
  class JL2 {
    _ratio;
    _upperBound;
    constructor(A = 0) {
      this._ratio = A, this._ratio = this._normalize(A), this._upperBound = Math.floor(this._ratio * 4294967295)
    }
    shouldSample(A, Q) {
      return {
        decision: (0, mx5.isValidTraceId)(Q) && this._accumulate(Q) < this._upperBound ? YL2.SamplingDecision.RECORD_AND_SAMPLED : YL2.SamplingDecision.NOT_RECORD
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
      let Q = 0;
      for (let B = 0; B < A.length / 8; B++) {
        let G = B * 8,
          Z = parseInt(A.slice(G, G + 8), 16);
        Q = (Q ^ Z) >>> 0
      }
      return Q
    }
  }
  WL2.TraceIdRatioBasedSampler = JL2
})
// @from(Start 11152662, End 11155590)
a40 = z((HL2) => {
  Object.defineProperty(HL2, "__esModule", {
    value: !0
  });
  HL2.buildSamplerFromEnv = HL2.loadDefaultConfig = void 0;
  var n40 = K9(),
    Fy = e6(),
    VL2 = r81(),
    i40 = o81(),
    e81 = p40(),
    FL2 = l40(),
    Ky;
  (function(A) {
    A.AlwaysOff = "always_off", A.AlwaysOn = "always_on", A.ParentBasedAlwaysOff = "parentbased_always_off", A.ParentBasedAlwaysOn = "parentbased_always_on", A.ParentBasedTraceIdRatio = "parentbased_traceidratio", A.TraceIdRatio = "traceidratio"
  })(Ky || (Ky = {}));
  var A61 = 1;

  function dx5() {
    return {
      sampler: DL2(),
      forceFlushTimeoutMillis: 30000,
      generalLimits: {
        attributeValueLengthLimit: (0, Fy.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Fy.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? 128
      },
      spanLimits: {
        attributeValueLengthLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? 1 / 0,
        attributeCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? 128,
        linkCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_LINK_COUNT_LIMIT") ?? 128,
        eventCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_EVENT_COUNT_LIMIT") ?? 128,
        attributePerEventCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_EVENT_COUNT_LIMIT") ?? 128,
        attributePerLinkCountLimit: (0, Fy.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_PER_LINK_COUNT_LIMIT") ?? 128
      }
    }
  }
  HL2.loadDefaultConfig = dx5;

  function DL2() {
    let A = (0, Fy.getStringFromEnv)("OTEL_TRACES_SAMPLER") ?? Ky.ParentBasedAlwaysOn;
    switch (A) {
      case Ky.AlwaysOn:
        return new i40.AlwaysOnSampler;
      case Ky.AlwaysOff:
        return new VL2.AlwaysOffSampler;
      case Ky.ParentBasedAlwaysOn:
        return new e81.ParentBasedSampler({
          root: new i40.AlwaysOnSampler
        });
      case Ky.ParentBasedAlwaysOff:
        return new e81.ParentBasedSampler({
          root: new VL2.AlwaysOffSampler
        });
      case Ky.TraceIdRatio:
        return new FL2.TraceIdRatioBasedSampler(KL2());
      case Ky.ParentBasedTraceIdRatio:
        return new e81.ParentBasedSampler({
          root: new FL2.TraceIdRatioBasedSampler(KL2())
        });
      default:
        return n40.diag.error(`OTEL_TRACES_SAMPLER value "${A}" invalid, defaulting to "${Ky.ParentBasedAlwaysOn}".`), new e81.ParentBasedSampler({
          root: new i40.AlwaysOnSampler
        })
    }
  }
  HL2.buildSamplerFromEnv = DL2;

  function KL2() {
    let A = (0, Fy.getNumberFromEnv)("OTEL_TRACES_SAMPLER_ARG");
    if (A == null) return n40.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${A61}.`), A61;
    if (A < 0 || A > 1) return n40.diag.error(`OTEL_TRACES_SAMPLER_ARG=${A} was given, but it is out of range ([0..1]), defaulting to ${A61}.`), A61;
    return A
  }
})
// @from(Start 11155596, End 11157018)
s40 = z((zL2) => {
  Object.defineProperty(zL2, "__esModule", {
    value: !0
  });
  zL2.reconfigureLimits = zL2.mergeConfig = zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = void 0;
  var EL2 = a40(),
    Q61 = e6();
  zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT = 128;
  zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT = 1 / 0;

  function px5(A) {
    let Q = {
        sampler: (0, EL2.buildSamplerFromEnv)()
      },
      B = (0, EL2.loadDefaultConfig)(),
      G = Object.assign({}, B, Q, A);
    return G.generalLimits = Object.assign({}, B.generalLimits, A.generalLimits || {}), G.spanLimits = Object.assign({}, B.spanLimits, A.spanLimits || {}), G
  }
  zL2.mergeConfig = px5;

  function lx5(A) {
    let Q = Object.assign({}, A.spanLimits);
    return Q.attributeCountLimit = A.spanLimits?.attributeCountLimit ?? A.generalLimits?.attributeCountLimit ?? (0, Q61.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_COUNT_LIMIT") ?? (0, Q61.getNumberFromEnv)("OTEL_ATTRIBUTE_COUNT_LIMIT") ?? zL2.DEFAULT_ATTRIBUTE_COUNT_LIMIT, Q.attributeValueLengthLimit = A.spanLimits?.attributeValueLengthLimit ?? A.generalLimits?.attributeValueLengthLimit ?? (0, Q61.getNumberFromEnv)("OTEL_SPAN_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? (0, Q61.getNumberFromEnv)("OTEL_ATTRIBUTE_VALUE_LENGTH_LIMIT") ?? zL2.DEFAULT_ATTRIBUTE_VALUE_LENGTH_LIMIT, Object.assign({}, A, {
      spanLimits: Q
    })
  }
  zL2.reconfigureLimits = lx5
})
// @from(Start 11157024, End 11161747)
ML2 = z((NL2) => {
  Object.defineProperty(NL2, "__esModule", {
    value: !0
  });
  NL2.BatchSpanProcessorBase = void 0;
  var jJA = K9(),
    Dy = e6();
  class qL2 {
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
    constructor(A, Q) {
      if (this._exporter = A, this._maxExportBatchSize = typeof Q?.maxExportBatchSize === "number" ? Q.maxExportBatchSize : (0, Dy.getNumberFromEnv)("OTEL_BSP_MAX_EXPORT_BATCH_SIZE") ?? 512, this._maxQueueSize = typeof Q?.maxQueueSize === "number" ? Q.maxQueueSize : (0, Dy.getNumberFromEnv)("OTEL_BSP_MAX_QUEUE_SIZE") ?? 2048, this._scheduledDelayMillis = typeof Q?.scheduledDelayMillis === "number" ? Q.scheduledDelayMillis : (0, Dy.getNumberFromEnv)("OTEL_BSP_SCHEDULE_DELAY") ?? 5000, this._exportTimeoutMillis = typeof Q?.exportTimeoutMillis === "number" ? Q.exportTimeoutMillis : (0, Dy.getNumberFromEnv)("OTEL_BSP_EXPORT_TIMEOUT") ?? 30000, this._shutdownOnce = new Dy.BindOnceFuture(this._shutdown, this), this._maxExportBatchSize > this._maxQueueSize) jJA.diag.warn("BatchSpanProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize"), this._maxExportBatchSize = this._maxQueueSize
    }
    forceFlush() {
      if (this._shutdownOnce.isCalled) return this._shutdownOnce.promise;
      return this._flushAll()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & jJA.TraceFlags.SAMPLED) === 0) return;
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
        if (this._droppedSpansCount === 0) jJA.diag.debug("maxQueueSize reached, dropping spans");
        this._droppedSpansCount++;
        return
      }
      if (this._droppedSpansCount > 0) jJA.diag.warn(`Dropped ${this._droppedSpansCount} spans because maxQueueSize reached`), this._droppedSpansCount = 0;
      this._finishedSpans.push(A), this._maybeStartTimer()
    }
    _flushAll() {
      return new Promise((A, Q) => {
        let B = [],
          G = Math.ceil(this._finishedSpans.length / this._maxExportBatchSize);
        for (let Z = 0, I = G; Z < I; Z++) B.push(this._flushOneBatch());
        Promise.all(B).then(() => {
          A()
        }).catch(Q)
      })
    }
    _flushOneBatch() {
      if (this._clearTimer(), this._finishedSpans.length === 0) return Promise.resolve();
      return new Promise((A, Q) => {
        let B = setTimeout(() => {
          Q(Error("Timeout"))
        }, this._exportTimeoutMillis);
        jJA.context.with((0, Dy.suppressTracing)(jJA.context.active()), () => {
          let G;
          if (this._finishedSpans.length <= this._maxExportBatchSize) G = this._finishedSpans, this._finishedSpans = [];
          else G = this._finishedSpans.splice(0, this._maxExportBatchSize);
          let Z = () => this._exporter.export(G, (Y) => {
              if (clearTimeout(B), Y.code === Dy.ExportResultCode.SUCCESS) A();
              else Q(Y.error ?? Error("BatchSpanProcessor: span export failed"))
            }),
            I = null;
          for (let Y = 0, J = G.length; Y < J; Y++) {
            let W = G[Y];
            if (W.resource.asyncAttributesPending && W.resource.waitForAsyncAttributes) I ??= [], I.push(W.resource.waitForAsyncAttributes())
          }
          if (I === null) Z();
          else Promise.all(I).then(Z, (Y) => {
            (0, Dy.globalErrorHandler)(Y), Q(Y)
          })
        })
      })
    }
    _maybeStartTimer() {
      if (this._isExporting) return;
      let A = () => {
        this._isExporting = !0, this._flushOneBatch().finally(() => {
          if (this._isExporting = !1, this._finishedSpans.length > 0) this._clearTimer(), this._maybeStartTimer()
        }).catch((Q) => {
          this._isExporting = !1, (0, Dy.globalErrorHandler)(Q)
        })
      };
      if (this._finishedSpans.length >= this._maxExportBatchSize) return A();
      if (this._timer !== void 0) return;
      this._timer = setTimeout(() => A(), this._scheduledDelayMillis), (0, Dy.unrefTimer)(this._timer)
    }
    _clearTimer() {
      if (this._timer !== void 0) clearTimeout(this._timer), this._timer = void 0
    }
  }
  NL2.BatchSpanProcessorBase = qL2
})
// @from(Start 11161753, End 11161997)
PL2 = z((RL2) => {
  Object.defineProperty(RL2, "__esModule", {
    value: !0
  });
  RL2.BatchSpanProcessor = void 0;
  var nx5 = ML2();
  class OL2 extends nx5.BatchSpanProcessorBase {
    onShutdown() {}
  }
  RL2.BatchSpanProcessor = OL2
})
// @from(Start 11162003, End 11162603)
xL2 = z((kL2) => {
  Object.defineProperty(kL2, "__esModule", {
    value: !0
  });
  kL2.RandomIdGenerator = void 0;
  var ax5 = 8,
    SL2 = 16;
  class _L2 {
    generateTraceId = jL2(SL2);
    generateSpanId = jL2(ax5)
  }
  kL2.RandomIdGenerator = _L2;
  var B61 = Buffer.allocUnsafe(SL2);

  function jL2(A) {
    return function() {
      for (let B = 0; B < A / 4; B++) B61.writeUInt32BE(Math.random() * 4294967296 >>> 0, B * 4);
      for (let B = 0; B < A; B++)
        if (B61[B] > 0) break;
        else if (B === A - 1) B61[A - 1] = 1;
      return B61.toString("hex", 0, A)
    }
  }
})
// @from(Start 11162609, End 11163075)
vL2 = z((G61) => {
  Object.defineProperty(G61, "__esModule", {
    value: !0
  });
  G61.RandomIdGenerator = G61.BatchSpanProcessor = void 0;
  var sx5 = PL2();
  Object.defineProperty(G61, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return sx5.BatchSpanProcessor
    }
  });
  var rx5 = xL2();
  Object.defineProperty(G61, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return rx5.RandomIdGenerator
    }
  })
})
// @from(Start 11163081, End 11163528)
r40 = z((Z61) => {
  Object.defineProperty(Z61, "__esModule", {
    value: !0
  });
  Z61.RandomIdGenerator = Z61.BatchSpanProcessor = void 0;
  var bL2 = vL2();
  Object.defineProperty(Z61, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return bL2.BatchSpanProcessor
    }
  });
  Object.defineProperty(Z61, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return bL2.RandomIdGenerator
    }
  })
})
// @from(Start 11163534, End 11166496)
uL2 = z((hL2) => {
  Object.defineProperty(hL2, "__esModule", {
    value: !0
  });
  hL2.Tracer = void 0;
  var cD = K9(),
    I61 = e6(),
    ex5 = aN2(),
    Av5 = s40(),
    Qv5 = r40();
  class fL2 {
    _sampler;
    _generalLimits;
    _spanLimits;
    _idGenerator;
    instrumentationScope;
    _resource;
    _spanProcessor;
    constructor(A, Q, B, G) {
      let Z = (0, Av5.mergeConfig)(Q);
      this._sampler = Z.sampler, this._generalLimits = Z.generalLimits, this._spanLimits = Z.spanLimits, this._idGenerator = Q.idGenerator || new Qv5.RandomIdGenerator, this._resource = B, this._spanProcessor = G, this.instrumentationScope = A
    }
    startSpan(A, Q = {}, B = cD.context.active()) {
      if (Q.root) B = cD.trace.deleteSpan(B);
      let G = cD.trace.getSpan(B);
      if ((0, I61.isTracingSuppressed)(B)) return cD.diag.debug("Instrumentation suppressed, returning Noop Span"), cD.trace.wrapSpanContext(cD.INVALID_SPAN_CONTEXT);
      let Z = G?.spanContext(),
        I = this._idGenerator.generateSpanId(),
        Y, J, W;
      if (!Z || !cD.trace.isSpanContextValid(Z)) J = this._idGenerator.generateTraceId();
      else J = Z.traceId, W = Z.traceState, Y = Z;
      let X = Q.kind ?? cD.SpanKind.INTERNAL,
        V = (Q.links ?? []).map((U) => {
          return {
            context: U.context,
            attributes: (0, I61.sanitizeAttributes)(U.attributes)
          }
        }),
        F = (0, I61.sanitizeAttributes)(Q.attributes),
        K = this._sampler.shouldSample(B, J, A, X, F, V);
      W = K.traceState ?? W;
      let D = K.decision === cD.SamplingDecision.RECORD_AND_SAMPLED ? cD.TraceFlags.SAMPLED : cD.TraceFlags.NONE,
        H = {
          traceId: J,
          spanId: I,
          traceFlags: D,
          traceState: W
        };
      if (K.decision === cD.SamplingDecision.NOT_RECORD) return cD.diag.debug("Recording is off, propagating context in a non-recording span"), cD.trace.wrapSpanContext(H);
      let C = (0, I61.sanitizeAttributes)(Object.assign(F, K.attributes));
      return new ex5.SpanImpl({
        resource: this._resource,
        scope: this.instrumentationScope,
        context: B,
        spanContext: H,
        name: A,
        kind: X,
        links: V,
        parentSpanContext: Y,
        attributes: C,
        startTime: Q.startTime,
        spanProcessor: this._spanProcessor,
        spanLimits: this._spanLimits
      })
    }
    startActiveSpan(A, Q, B, G) {
      let Z, I, Y;
      if (arguments.length < 2) return;
      else if (arguments.length === 2) Y = Q;
      else if (arguments.length === 3) Z = Q, Y = B;
      else Z = Q, I = B, Y = G;
      let J = I ?? cD.context.active(),
        W = this.startSpan(A, Z, J),
        X = cD.trace.setSpan(J, W);
      return cD.context.with(X, Y, void 0, W)
    }
    getGeneralLimits() {
      return this._generalLimits
    }
    getSpanLimits() {
      return this._spanLimits
    }
  }
  hL2.Tracer = fL2
})
// @from(Start 11166502, End 11167477)
pL2 = z((dL2) => {
  Object.defineProperty(dL2, "__esModule", {
    value: !0
  });
  dL2.MultiSpanProcessor = void 0;
  var Bv5 = e6();
  class mL2 {
    _spanProcessors;
    constructor(A) {
      this._spanProcessors = A
    }
    forceFlush() {
      let A = [];
      for (let Q of this._spanProcessors) A.push(Q.forceFlush());
      return new Promise((Q) => {
        Promise.all(A).then(() => {
          Q()
        }).catch((B) => {
          (0, Bv5.globalErrorHandler)(B || Error("MultiSpanProcessor: forceFlush failed")), Q()
        })
      })
    }
    onStart(A, Q) {
      for (let B of this._spanProcessors) B.onStart(A, Q)
    }
    onEnd(A) {
      for (let Q of this._spanProcessors) Q.onEnd(A)
    }
    shutdown() {
      let A = [];
      for (let Q of this._spanProcessors) A.push(Q.shutdown());
      return new Promise((Q, B) => {
        Promise.all(A).then(() => {
          Q()
        }, B)
      })
    }
  }
  dL2.MultiSpanProcessor = mL2
})
// @from(Start 11167483, End 11169704)
sL2 = z((nL2) => {
  Object.defineProperty(nL2, "__esModule", {
    value: !0
  });
  nL2.BasicTracerProvider = nL2.ForceFlushState = void 0;
  var Gv5 = e6(),
    Zv5 = t3A(),
    Iv5 = uL2(),
    Yv5 = a40(),
    Jv5 = pL2(),
    Wv5 = s40(),
    SJA;
  (function(A) {
    A[A.resolved = 0] = "resolved", A[A.timeout = 1] = "timeout", A[A.error = 2] = "error", A[A.unresolved = 3] = "unresolved"
  })(SJA = nL2.ForceFlushState || (nL2.ForceFlushState = {}));
  class iL2 {
    _config;
    _tracers = new Map;
    _resource;
    _activeSpanProcessor;
    constructor(A = {}) {
      let Q = (0, Gv5.merge)({}, (0, Yv5.loadDefaultConfig)(), (0, Wv5.reconfigureLimits)(A));
      this._resource = Q.resource ?? (0, Zv5.defaultResource)(), this._config = Object.assign({}, Q, {
        resource: this._resource
      });
      let B = [];
      if (A.spanProcessors?.length) B.push(...A.spanProcessors);
      this._activeSpanProcessor = new Jv5.MultiSpanProcessor(B)
    }
    getTracer(A, Q, B) {
      let G = `${A}@${Q||""}:${B?.schemaUrl||""}`;
      if (!this._tracers.has(G)) this._tracers.set(G, new Iv5.Tracer({
        name: A,
        version: Q,
        schemaUrl: B?.schemaUrl
      }, this._config, this._resource, this._activeSpanProcessor));
      return this._tracers.get(G)
    }
    forceFlush() {
      let A = this._config.forceFlushTimeoutMillis,
        Q = this._activeSpanProcessor._spanProcessors.map((B) => {
          return new Promise((G) => {
            let Z, I = setTimeout(() => {
              G(Error(`Span processor did not completed within timeout period of ${A} ms`)), Z = SJA.timeout
            }, A);
            B.forceFlush().then(() => {
              if (clearTimeout(I), Z !== SJA.timeout) Z = SJA.resolved, G(Z)
            }).catch((Y) => {
              clearTimeout(I), Z = SJA.error, G(Y)
            })
          })
        });
      return new Promise((B, G) => {
        Promise.all(Q).then((Z) => {
          let I = Z.filter((Y) => Y !== SJA.resolved);
          if (I.length > 0) G(I);
          else B()
        }).catch((Z) => G([Z]))
      })
    }
    shutdown() {
      return this._activeSpanProcessor.shutdown()
    }
  }
  nL2.BasicTracerProvider = iL2
})
// @from(Start 11169710, End 11170925)
eL2 = z((oL2) => {
  Object.defineProperty(oL2, "__esModule", {
    value: !0
  });
  oL2.ConsoleSpanExporter = void 0;
  var o40 = e6();
  class rL2 {
    export (A, Q) {
      return this._sendSpans(A, Q)
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
        timestamp: (0, o40.hrTimeToMicroseconds)(A.startTime),
        duration: (0, o40.hrTimeToMicroseconds)(A.duration),
        attributes: A.attributes,
        status: A.status,
        events: A.events,
        links: A.links
      }
    }
    _sendSpans(A, Q) {
      for (let B of A) console.dir(this._exportInfo(B), {
        depth: 3
      });
      if (Q) return Q({
        code: o40.ExportResultCode.SUCCESS
      })
    }
  }
  oL2.ConsoleSpanExporter = rL2
})
// @from(Start 11170931, End 11171718)
ZM2 = z((BM2) => {
  Object.defineProperty(BM2, "__esModule", {
    value: !0
  });
  BM2.InMemorySpanExporter = void 0;
  var AM2 = e6();
  class QM2 {
    _finishedSpans = [];
    _stopped = !1;
    export (A, Q) {
      if (this._stopped) return Q({
        code: AM2.ExportResultCode.FAILED,
        error: Error("Exporter has been stopped")
      });
      this._finishedSpans.push(...A), setTimeout(() => Q({
        code: AM2.ExportResultCode.SUCCESS
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
  BM2.InMemorySpanExporter = QM2
})
// @from(Start 11171724, End 11173060)
WM2 = z((YM2) => {
  Object.defineProperty(YM2, "__esModule", {
    value: !0
  });
  YM2.SimpleSpanProcessor = void 0;
  var Xv5 = K9(),
    Y61 = e6();
  class IM2 {
    _exporter;
    _shutdownOnce;
    _pendingExports;
    constructor(A) {
      this._exporter = A, this._shutdownOnce = new Y61.BindOnceFuture(this._shutdown, this), this._pendingExports = new Set
    }
    async forceFlush() {
      if (await Promise.all(Array.from(this._pendingExports)), this._exporter.forceFlush) await this._exporter.forceFlush()
    }
    onStart(A, Q) {}
    onEnd(A) {
      if (this._shutdownOnce.isCalled) return;
      if ((A.spanContext().traceFlags & Xv5.TraceFlags.SAMPLED) === 0) return;
      let Q = this._doExport(A).catch((B) => (0, Y61.globalErrorHandler)(B));
      this._pendingExports.add(Q), Q.finally(() => this._pendingExports.delete(Q))
    }
    async _doExport(A) {
      if (A.resource.asyncAttributesPending) await A.resource.waitForAsyncAttributes?.();
      let Q = await Y61.internal._export(this._exporter, [A]);
      if (Q.code !== Y61.ExportResultCode.SUCCESS) throw Q.error ?? Error(`SimpleSpanProcessor: span export failed (status ${Q})`)
    }
    shutdown() {
      return this._shutdownOnce.call()
    }
    _shutdown() {
      return this._exporter.shutdown()
    }
  }
  YM2.SimpleSpanProcessor = IM2
})
// @from(Start 11173066, End 11173381)
KM2 = z((VM2) => {
  Object.defineProperty(VM2, "__esModule", {
    value: !0
  });
  VM2.NoopSpanProcessor = void 0;
  class XM2 {
    onStart(A, Q) {}
    onEnd(A) {}
    shutdown() {
      return Promise.resolve()
    }
    forceFlush() {
      return Promise.resolve()
    }
  }
  VM2.NoopSpanProcessor = XM2
})
// @from(Start 11173387, End 11175687)
HM2 = z((B$) => {
  Object.defineProperty(B$, "__esModule", {
    value: !0
  });
  B$.SamplingDecision = B$.TraceIdRatioBasedSampler = B$.ParentBasedSampler = B$.AlwaysOnSampler = B$.AlwaysOffSampler = B$.NoopSpanProcessor = B$.SimpleSpanProcessor = B$.InMemorySpanExporter = B$.ConsoleSpanExporter = B$.RandomIdGenerator = B$.BatchSpanProcessor = B$.BasicTracerProvider = void 0;
  var Vv5 = sL2();
  Object.defineProperty(B$, "BasicTracerProvider", {
    enumerable: !0,
    get: function() {
      return Vv5.BasicTracerProvider
    }
  });
  var DM2 = r40();
  Object.defineProperty(B$, "BatchSpanProcessor", {
    enumerable: !0,
    get: function() {
      return DM2.BatchSpanProcessor
    }
  });
  Object.defineProperty(B$, "RandomIdGenerator", {
    enumerable: !0,
    get: function() {
      return DM2.RandomIdGenerator
    }
  });
  var Fv5 = eL2();
  Object.defineProperty(B$, "ConsoleSpanExporter", {
    enumerable: !0,
    get: function() {
      return Fv5.ConsoleSpanExporter
    }
  });
  var Kv5 = ZM2();
  Object.defineProperty(B$, "InMemorySpanExporter", {
    enumerable: !0,
    get: function() {
      return Kv5.InMemorySpanExporter
    }
  });
  var Dv5 = WM2();
  Object.defineProperty(B$, "SimpleSpanProcessor", {
    enumerable: !0,
    get: function() {
      return Dv5.SimpleSpanProcessor
    }
  });
  var Hv5 = KM2();
  Object.defineProperty(B$, "NoopSpanProcessor", {
    enumerable: !0,
    get: function() {
      return Hv5.NoopSpanProcessor
    }
  });
  var Cv5 = r81();
  Object.defineProperty(B$, "AlwaysOffSampler", {
    enumerable: !0,
    get: function() {
      return Cv5.AlwaysOffSampler
    }
  });
  var Ev5 = o81();
  Object.defineProperty(B$, "AlwaysOnSampler", {
    enumerable: !0,
    get: function() {
      return Ev5.AlwaysOnSampler
    }
  });
  var zv5 = p40();
  Object.defineProperty(B$, "ParentBasedSampler", {
    enumerable: !0,
    get: function() {
      return zv5.ParentBasedSampler
    }
  });
  var Uv5 = l40();
  Object.defineProperty(B$, "TraceIdRatioBasedSampler", {
    enumerable: !0,
    get: function() {
      return Uv5.TraceIdRatioBasedSampler
    }
  });
  var $v5 = WRA();
  Object.defineProperty(B$, "SamplingDecision", {
    enumerable: !0,
    get: function() {
      return $v5.SamplingDecision
    }
  })
})
// @from(Start 11175693, End 11175829)
zM2 = z((CM2) => {
  Object.defineProperty(CM2, "__esModule", {
    value: !0
  });
  CM2.VERSION = void 0;
  CM2.VERSION = "0.204.0"
})
// @from(Start 11175835, End 11176402)
NM2 = z((wM2) => {
  Object.defineProperty(wM2, "__esModule", {
    value: !0
  });
  wM2.OTLPTraceExporter = void 0;
  var qv5 = sk(),
    Nv5 = tk(),
    Lv5 = zM2(),
    UM2 = mi();
  class $M2 extends qv5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, UM2.createOtlpHttpExportDelegate)((0, UM2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${Lv5.VERSION}`,
        "Content-Type": "application/x-protobuf"
      }), Nv5.ProtobufTraceSerializer))
    }
  }
  wM2.OTLPTraceExporter = $M2
})
// @from(Start 11176408, End 11176687)
LM2 = z((t40) => {
  Object.defineProperty(t40, "__esModule", {
    value: !0
  });
  t40.OTLPTraceExporter = void 0;
  var Mv5 = NM2();
  Object.defineProperty(t40, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Mv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11176693, End 11176972)
MM2 = z((e40) => {
  Object.defineProperty(e40, "__esModule", {
    value: !0
  });
  e40.OTLPTraceExporter = void 0;
  var Rv5 = LM2();
  Object.defineProperty(e40, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Rv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11176978, End 11177257)
OM2 = z((A80) => {
  Object.defineProperty(A80, "__esModule", {
    value: !0
  });
  A80.OTLPTraceExporter = void 0;
  var Pv5 = MM2();
  Object.defineProperty(A80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return Pv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11177263, End 11177760)
SM2 = z((PM2) => {
  Object.defineProperty(PM2, "__esModule", {
    value: !0
  });
  PM2.OTLPTraceExporter = void 0;
  var RM2 = i81(),
    Sv5 = tk(),
    _v5 = sk();
  class TM2 extends _v5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, RM2.createOtlpGrpcExportDelegate)((0, RM2.convertLegacyOtlpGrpcOptions)(A, "TRACES"), Sv5.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
    }
  }
  PM2.OTLPTraceExporter = TM2
})
// @from(Start 11177766, End 11178045)
_M2 = z((Q80) => {
  Object.defineProperty(Q80, "__esModule", {
    value: !0
  });
  Q80.OTLPTraceExporter = void 0;
  var kv5 = SM2();
  Object.defineProperty(Q80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return kv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11178051, End 11178187)
xM2 = z((kM2) => {
  Object.defineProperty(kM2, "__esModule", {
    value: !0
  });
  kM2.VERSION = void 0;
  kM2.VERSION = "0.204.0"
})
// @from(Start 11178193, End 11178750)
gM2 = z((fM2) => {
  Object.defineProperty(fM2, "__esModule", {
    value: !0
  });
  fM2.OTLPTraceExporter = void 0;
  var xv5 = sk(),
    vv5 = xM2(),
    bv5 = tk(),
    vM2 = mi();
  class bM2 extends xv5.OTLPExporterBase {
    constructor(A = {}) {
      super((0, vM2.createOtlpHttpExportDelegate)((0, vM2.convertLegacyHttpOptions)(A, "TRACES", "v1/traces", {
        "User-Agent": `OTel-OTLP-Exporter-JavaScript/${vv5.VERSION}`,
        "Content-Type": "application/json"
      }), bv5.JsonTraceSerializer))
    }
  }
  fM2.OTLPTraceExporter = bM2
})
// @from(Start 11178756, End 11179035)
uM2 = z((B80) => {
  Object.defineProperty(B80, "__esModule", {
    value: !0
  });
  B80.OTLPTraceExporter = void 0;
  var fv5 = gM2();
  Object.defineProperty(B80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return fv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179041, End 11179320)
mM2 = z((G80) => {
  Object.defineProperty(G80, "__esModule", {
    value: !0
  });
  G80.OTLPTraceExporter = void 0;
  var gv5 = uM2();
  Object.defineProperty(G80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return gv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179326, End 11179605)
dM2 = z((Z80) => {
  Object.defineProperty(Z80, "__esModule", {
    value: !0
  });
  Z80.OTLPTraceExporter = void 0;
  var mv5 = mM2();
  Object.defineProperty(Z80, "OTLPTraceExporter", {
    enumerable: !0,
    get: function() {
      return mv5.OTLPTraceExporter
    }
  })
})
// @from(Start 11179607, End 11179802)
class I80 {
  error(A, ...Q) {
    AA(Error(A))
  }
  warn(A, ...Q) {
    AA(Error(A))
  }
  info(A, ...Q) {
    return
  }
  debug(A, ...Q) {
    return
  }
  verbose(A, ...Q) {
    return
  }
}
// @from(Start 11179807, End 11179832)
cM2 = L(() => {
  g1()
})
// @from(Start 11179834, End 11180718)
async function pv5() {
  let A = DI();
  if (A.error) throw g(`Metrics opt-out check failed: ${A.error}`), Error(`Auth error: ${A.error}`);
  let Q = {
    "Content-Type": "application/json",
    "User-Agent": TV(),
    ...A.headers
  };
  try {
    let G = await YQ.get("https://api.anthropic.com/api/claude_code/organizations/metrics_enabled", {
      headers: Q,
      timeout: 5000
    });
    return g(`Metrics opt-out API response: enabled=${G.data.metrics_logging_enabled}, vcsLinking=${G.data.vcs_account_linking_enabled}`), {
      enabled: G.data.metrics_logging_enabled,
      vcsAccountLinkingEnabled: G.data.vcs_account_linking_enabled,
      hasError: !1
    }
  } catch (B) {
    return g(`Failed to check metrics opt-out status: ${B instanceof Error?B.message:String(B)}`), AA(B), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Start 11180719, End 11180938)
async function J61() {
  try {
    return await lv5()
  } catch (A) {
    return g("Metrics check failed, defaulting to disabled"), {
      enabled: !1,
      vcsAccountLinkingEnabled: !1,
      hasError: !0
    }
  }
}
// @from(Start 11180943, End 11180956)
cv5 = 3600000
// @from(Start 11180960, End 11180963)
lv5
// @from(Start 11180969, End 11181050)
Y80 = L(() => {
  O3();
  hbA();
  AE();
  V0();
  g1();
  lv5 = fbA(pv5, cv5)
})
// @from(Start 11181052, End 11184687)
class W80 {
  endpoint;
  timeout;
  pendingExports = [];
  isShutdown = !1;
  constructor(A = {}) {
    this.endpoint = "https://api.anthropic.com/api/claude_code/metrics", this.timeout = A.timeout || 5000
  }
  async export (A, Q) {
    if (this.isShutdown) {
      Q({
        code: _JA.ExportResultCode.FAILED,
        error: Error("Exporter has been shutdown")
      });
      return
    }
    let B = this.doExport(A, Q);
    this.pendingExports.push(B), B.finally(() => {
      let G = this.pendingExports.indexOf(B);
      if (G > -1) this.pendingExports.splice(G, 1)
    })
  }
  async doExport(A, Q) {
    try {
      if (!(await J61()).enabled) {
        g("Metrics export disabled by organization setting"), Q({
          code: _JA.ExportResultCode.SUCCESS
        });
        return
      }
      let G = this.transformMetricsForInternal(A),
        Z = DI();
      if (Z.error) {
        g(`Metrics export failed: ${Z.error}`), Q({
          code: _JA.ExportResultCode.FAILED,
          error: Error(Z.error)
        });
        return
      }
      let I = {
          "Content-Type": "application/json",
          "User-Agent": TV(),
          ...Z.headers
        },
        Y = await YQ.post(this.endpoint, G, {
          timeout: this.timeout,
          headers: I
        });
      g("BigQuery metrics exported successfully"), g(`BigQuery API Response: ${JSON.stringify(Y.data,null,2)}`), Q({
        code: _JA.ExportResultCode.SUCCESS
      })
    } catch (B) {
      g(`BigQuery metrics export failed: ${B instanceof Error?B.message:String(B)}`), AA(B), Q({
        code: _JA.ExportResultCode.FAILED,
        error: B instanceof Error ? B : Error("Unknown export error")
      })
    }
  }
  transformMetricsForInternal(A) {
    let Q = A.resource.attributes,
      B = {
        "service.name": Q["service.name"] || "claude-code",
        "service.version": Q["service.version"] || "unknown",
        "os.type": Q["os.type"] || "unknown",
        "os.version": Q["os.version"] || "unknown",
        "host.arch": Q["host.arch"] || "unknown",
        "aggregation.temporality": this.selectAggregationTemporality() === J80.AggregationTemporality.DELTA ? "delta" : "cumulative"
      };
    if (Q["wsl.version"]) B["wsl.version"] = Q["wsl.version"];
    if (BB()) {
      B["user.customer_type"] = "claude_ai";
      let Z = f4();
      if (Z) B["user.subscription_type"] = Z
    } else B["user.customer_type"] = "api";
    return {
      resource_attributes: B,
      metrics: A.scopeMetrics.flatMap((Z) => Z.metrics.map((I) => ({
        name: I.descriptor.name,
        description: I.descriptor.description,
        unit: I.descriptor.unit,
        data_points: this.extractDataPoints(I)
      })))
    }
  }
  extractDataPoints(A) {
    return (A.dataPoints || []).filter((B) => typeof B.value === "number").map((B) => ({
      attributes: this.convertAttributes(B.attributes),
      value: B.value,
      timestamp: this.hrTimeToISOString(B.endTime || B.startTime || [Date.now() / 1000, 0])
    }))
  }
  async shutdown() {
    this.isShutdown = !0, await this.forceFlush(), g("BigQuery metrics exporter shutdown complete")
  }
  async forceFlush() {
    await Promise.all(this.pendingExports), g("BigQuery metrics exporter flush complete")
  }
  convertAttributes(A) {
    let Q = {};
    if (A) {
      for (let [B, G] of Object.entries(A))
        if (G !== void 0 && G !== null) Q[B] = String(G)
    }
    return Q
  }
  hrTimeToISOString(A) {
    let [Q, B] = A;
    return new Date(Q * 1000 + B / 1e6).toISOString()
  }
  selectAggregationTemporality() {
    return J80.AggregationTemporality.DELTA
  }
}
// @from(Start 11184692, End 11184695)
J80
// @from(Start 11184697, End 11184700)
_JA
// @from(Start 11184706, End 11184812)
pM2 = L(() => {
  O3();
  V0();
  g1();
  AE();
  Y80();
  gB();
  J80 = BA(vi(), 1), _JA = BA(e6(), 1)
})
// @from(Start 11184815, End 11184928)
function X80(A) {
  let Q = iv5[A],
    B = process.env[A];
  if (B === void 0) return Q;
  return B === "true"
}
// @from(Start 11184930, End 11185792)
function kJA() {
  let A = hb(),
    Q = e1(),
    B = {
      "user.id": A
    };
  if (X80("OTEL_METRICS_INCLUDE_SESSION_ID")) B["session.id"] = Q;
  if (X80("OTEL_METRICS_INCLUDE_VERSION")) B["app.version"] = {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION;
  let G = t6();
  if (G) {
    let {
      organizationUuid: Z,
      emailAddress: I,
      accountUuid: Y
    } = G;
    if (Z) B["organization.id"] = Z;
    if (I) B["user.email"] = I;
    if (Y && X80("OTEL_METRICS_INCLUDE_ACCOUNT_UUID")) B["user.account_uuid"] = Y
  }
  if (WU.terminal) B["terminal.type"] = WU.terminal;
  return B
}
// @from(Start 11185797, End 11185800)
iv5
// @from(Start 11185806, End 11185991)
W61 = L(() => {
  _0();
  jQ();
  It();
  gB();
  iv5 = {
    OTEL_METRICS_INCLUDE_SESSION_ID: !0,
    OTEL_METRICS_INCLUDE_VERSION: !1,
    OTEL_METRICS_INCLUDE_ACCOUNT_UUID: !0
  }
})
// @from(Start 11186052, End 11186108)
function Cy(A) {
  return A.spanContext().spanId || ""
}
// @from(Start 11186110, End 11186183)
function NP() {
  return Y0(process.env.ENABLE_ENHANCED_TELEMETRY_BETA)
}
// @from(Start 11186185, End 11186276)
function Hy() {
  return eX.trace.getTracer("com.anthropic.claude_code.tracing", "1.0.0")
}
// @from(Start 11186278, End 11186363)
function FRA(A, Q = {}) {
  return {
    ...kJA(),
    "span.type": A,
    ...Q
  }
}
// @from(Start 11186365, End 11186876)
function nM2(A) {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let Q = Hy(),
    G = Y0(process.env.OTEL_LOG_USER_PROMPTS) ? A : "<REDACTED>";
  lM2++;
  let Z = FRA("interaction", {
      user_prompt: G,
      user_prompt_length: A.length,
      "interaction.sequence": lM2
    }),
    I = Q.startSpan("claude_code.interaction", {
      attributes: Z
    }),
    Y = Cy(I);
  return dE.set(Y, {
    span: I,
    startTime: Date.now(),
    attributes: Z
  }), XRA.enterWith(I), I
}
// @from(Start 11186878, End 11187199)
function X61() {
  if (!NP()) return;
  let A = XRA.getStore();
  if (!A) return;
  let Q = Cy(A),
    B = dE.get(Q);
  if (!B) return;
  if (B.ended) return;
  let G = Date.now() - B.startTime;
  B.span.setAttributes({
    "interaction.duration_ms": G
  }), B.span.end(), B.ended = !0, dE.delete(Q), XRA.exit(() => {})
}
// @from(Start 11187201, End 11187706)
function aM2(A) {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let Q = Hy(),
    B = XRA.getStore(),
    G = FRA("llm_request", {
      model: A,
      "llm_request.context": B ? "interaction" : "standalone"
    }),
    Z = B ? eX.trace.setSpan(eX.context.active(), B) : eX.context.active(),
    I = Q.startSpan("claude_code.llm_request", {
      attributes: G
    }, Z),
    Y = Cy(I);
  return dE.set(Y, {
    span: I,
    startTime: Date.now(),
    attributes: G
  }), I
}
// @from(Start 11187708, End 11188752)
function V80(A) {
  if (!NP()) return;
  let Q;
  for (let [, I] of Array.from(dE.entries()).reverse())
    if (I.attributes["span.type"] === "llm_request") {
      Q = I;
      break
    } if (!Q) return;
  let G = {
    duration_ms: Date.now() - Q.startTime
  };
  if (A) {
    if (A.inputTokens !== void 0) G.input_tokens = A.inputTokens;
    if (A.outputTokens !== void 0) G.output_tokens = A.outputTokens;
    if (A.cacheReadTokens !== void 0) G.cache_read_tokens = A.cacheReadTokens;
    if (A.cacheCreationTokens !== void 0) G.cache_creation_tokens = A.cacheCreationTokens;
    if (A.success !== void 0) G.success = A.success;
    if (A.statusCode !== void 0) G.status_code = A.statusCode;
    if (A.error !== void 0) G.error = A.error;
    if (A.attempt !== void 0) G.attempt = A.attempt;
    if (A.modelResponse !== void 0) {
      let I = Boolean(process.env.OTEL_LOG_MODEL_RESPONSE);
      G.model_response = I ? A.modelResponse : "<REDACTED>"
    }
  }
  Q.span.setAttributes(G), Q.span.end();
  let Z = Cy(Q.span);
  dE.delete(Z)
}
// @from(Start 11188754, End 11189219)
function sM2(A, Q) {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let B = Hy(),
    G = XRA.getStore(),
    Z = FRA("tool", {
      tool_name: A,
      ...Q
    }),
    I = G ? eX.trace.setSpan(eX.context.active(), G) : eX.context.active(),
    Y = B.startSpan("claude_code.tool", {
      attributes: Z
    }, I),
    J = Cy(Y);
  return dE.set(J, {
    span: Y,
    startTime: Date.now(),
    attributes: Z
  }), VRA.enterWith(Y), Y
}
// @from(Start 11189221, End 11189656)
function rM2() {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let A = Hy(),
    Q = VRA.getStore(),
    B = FRA("tool.blocked_on_user"),
    G = Q ? eX.trace.setSpan(eX.context.active(), Q) : eX.context.active(),
    Z = A.startSpan("claude_code.tool.blocked_on_user", {
      attributes: B
    }, G),
    I = Cy(Z);
  return dE.set(I, {
    span: Z,
    startTime: Date.now(),
    attributes: B
  }), Z
}
// @from(Start 11189658, End 11190062)
function F80(A, Q) {
  if (!NP()) return;
  let B;
  for (let [, Y] of Array.from(dE.entries()).reverse())
    if (Y.attributes["span.type"] === "tool.blocked_on_user") {
      B = Y;
      break
    } if (!B) return;
  let Z = {
    duration_ms: Date.now() - B.startTime
  };
  if (A) Z.decision = A;
  if (Q) Z.source = Q;
  B.span.setAttributes(Z), B.span.end();
  let I = Cy(B.span);
  dE.delete(I)
}
// @from(Start 11190064, End 11190487)
function oM2() {
  if (!NP()) return eX.trace.getActiveSpan() || Hy().startSpan("dummy");
  let A = Hy(),
    Q = VRA.getStore(),
    B = FRA("tool.execution"),
    G = Q ? eX.trace.setSpan(eX.context.active(), Q) : eX.context.active(),
    Z = A.startSpan("claude_code.tool.execution", {
      attributes: B
    }, G),
    I = Cy(Z);
  return dE.set(I, {
    span: Z,
    startTime: Date.now(),
    attributes: B
  }), Z
}
// @from(Start 11190489, End 11190950)
function K80(A) {
  if (!NP()) return;
  let Q;
  for (let [, I] of Array.from(dE.entries()).reverse())
    if (I.attributes["span.type"] === "tool.execution") {
      Q = I;
      break
    } if (!Q) return;
  let G = {
    duration_ms: Date.now() - Q.startTime
  };
  if (A) {
    if (A.success !== void 0) G.success = A.success;
    if (A.error !== void 0) G.error = A.error
  }
  Q.span.setAttributes(G), Q.span.end();
  let Z = Cy(Q.span);
  dE.delete(Z)
}
// @from(Start 11190952, End 11191308)
function V61() {
  if (!NP()) return;
  let A;
  for (let [, G] of Array.from(dE.entries()).reverse())
    if (G.attributes["span.type"] === "tool") {
      A = G;
      break
    } if (!A) return;
  let Q = Date.now() - A.startTime;
  A.span.setAttributes({
    duration_ms: Q
  }), A.span.end();
  let B = Cy(A.span);
  dE.delete(B), VRA.exit(() => {})
}
// @from(Start 11191310, End 11191515)
function av5(A, Q = nv5) {
  if (A.length <= Q) return {
    content: A,
    truncated: !1
  };
  return {
    content: A.slice(0, Q) + `

[TRUNCATED - Content exceeds 60KB limit]`,
    truncated: !0
  }
}
// @from(Start 11191517, End 11191582)
function sv5() {
  return Y0(process.env.OTEL_LOG_TOOL_CONTENT)
}
// @from(Start 11191584, End 11191965)
function tM2(A, Q) {
  if (!NP() || !sv5()) return;
  let B = VRA.getStore();
  if (!B) return;
  let G = {};
  for (let [Z, I] of Object.entries(Q))
    if (typeof I === "string") {
      let {
        content: Y,
        truncated: J
      } = av5(I);
      if (G[Z] = Y, J) G[`${Z}_truncated`] = !0, G[`${Z}_original_length`] = I.length
    } else G[Z] = I;
  B.addEvent(A, G)
}
// @from(Start 11191970, End 11191972)
eX
// @from(Start 11191974, End 11191977)
XRA
// @from(Start 11191979, End 11191982)
VRA
// @from(Start 11191984, End 11191986)
dE
// @from(Start 11191988, End 11191995)
lM2 = 0
// @from(Start 11191999, End 11192010)
nv5 = 61440
// @from(Start 11192016, End 11192114)
F0A = L(() => {
  W61();
  hQ();
  eX = BA(K9(), 1), XRA = new iM2, VRA = new iM2, dE = new Map
})
// @from(Start 11192117, End 11192411)
function ev5() {
  if (l0()?.otelHeadersHelper) process.env.OTEL_EXPORTER_OTLP_HEADERS = Object.entries(r4B()).map(([Q, B]) => `${Q}=${B}`).join(",");
  if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE) process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta"
}
// @from(Start 11192413, End 11193919)
function Ab5() {
  let A = (process.env.OTEL_METRICS_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || rv5.toString()),
    B = [];
  for (let G of A)
    if (G === "console") {
      let Z = new F61.ConsoleMetricExporter,
        I = Z.export.bind(Z);
      Z.export = (Y, J) => {
        if (Y.resource && Y.resource.attributes) g(`
=== Resource Attributes ===`), g(JSON.stringify(Y.resource.attributes)), g(`===========================
`);
        return I(Y, J)
      }, B.push(Z)
    } else if (G === "otlp") {
    let Z = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      I = z80();
    switch (Z) {
      case "grpc":
        B.push(new AO2.OTLPMetricExporter);
        break;
      case "http/json":
        B.push(new QO2.OTLPMetricExporter(I));
        break;
      case "http/protobuf":
        B.push(new eM2.OTLPMetricExporter(I));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Z}`)
    }
  } else if (G === "prometheus") B.push(new BO2.PrometheusExporter);
  else throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`);
  return B.map((G) => {
    if ("export" in G) return new E80.PeriodicExportingMetricReader({
      exporter: G,
      exportIntervalMillis: Q
    });
    return G
  })
}
// @from(Start 11193921, End 11194790)
function Qb5() {
  let A = (process.env.OTEL_LOGS_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = [];
  for (let B of A)
    if (B === "console") Q.push(new xJA.ConsoleLogRecordExporter);
    else if (B === "otlp") {
    let G = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Z = z80();
    switch (G) {
      case "grpc":
        Q.push(new ZO2.OTLPLogExporter);
        break;
      case "http/json":
        Q.push(new IO2.OTLPLogExporter(Z));
        break;
      case "http/protobuf":
        Q.push(new GO2.OTLPLogExporter(Z));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`)
    }
  } else throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${B}`);
  return Q
}
// @from(Start 11194792, End 11195670)
function Bb5() {
  let A = (process.env.OTEL_TRACES_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = [];
  for (let B of A)
    if (B === "console") Q.push(new vJA.ConsoleSpanExporter);
    else if (B === "otlp") {
    let G = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Z = z80();
    switch (G) {
      case "grpc":
        Q.push(new JO2.OTLPTraceExporter);
        break;
      case "http/json":
        Q.push(new WO2.OTLPTraceExporter(Z));
        break;
      case "http/protobuf":
        Q.push(new YO2.OTLPTraceExporter(Z));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`)
    }
  } else throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${B}`);
  return Q
}
// @from(Start 11195672, End 11195744)
function D80() {
  return Y0(process.env.CLAUDE_CODE_ENABLE_TELEMETRY)
}
// @from(Start 11195746, End 11195887)
function Gb5() {
  let A = new W80;
  return new E80.PeriodicExportingMetricReader({
    exporter: A,
    exportIntervalMillis: 300000
  })
}
// @from(Start 11195889, End 11195997)
function Zb5() {
  let A = f4(),
    Q = BB() && (A === "enterprise" || A === "team");
  return a4B() || Q
}
// @from(Start 11195999, End 11199920)
function XO2() {
  M9("telemetry_init_start"), ev5(), yJA.diag.setLogger(new I80, yJA.DiagLogLevel.ERROR);
  let A = [];
  if (D80()) A.push(...Ab5());
  if (Zb5()) A.push(Gb5());
  let Q = dQ(),
    B = {
      [In.ATTR_SERVICE_NAME]: "claude-code",
      [In.ATTR_SERVICE_VERSION]: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION
    };
  if (Q === "wsl") {
    let K = ds();
    if (K) B["wsl.version"] = K
  }
  let G = LP.resourceFromAttributes(B),
    Z = LP.resourceFromAttributes(LP.osDetector.detect().attributes || {}),
    I = LP.hostDetector.detect(),
    Y = I.attributes?.[In.SEMRESATTRS_HOST_ARCH] ? {
      [In.SEMRESATTRS_HOST_ARCH]: I.attributes[In.SEMRESATTRS_HOST_ARCH]
    } : {},
    J = LP.resourceFromAttributes(Y),
    W = LP.resourceFromAttributes(LP.envDetector.detect().attributes || {}),
    X = G.merge(Z).merge(J).merge(W),
    V = new F61.MeterProvider({
      resource: X,
      views: [],
      readers: A
    });
  if (cE0(V), D80()) {
    let K = Qb5();
    if (K.length > 0) {
      let D = new xJA.LoggerProvider({
        resource: X,
        processors: K.map((C) => new xJA.BatchLogRecordProcessor(C, {
          scheduledDelayMillis: parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || ov5.toString())
        }))
      });
      H80.logs.setGlobalLoggerProvider(D), gE0(D);
      let H = H80.logs.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.0.59",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
      }.VERSION);
      mE0(H), process.on("beforeExit", async () => {
        await D?.forceFlush()
      }), process.on("exit", () => {
        D?.forceFlush()
      })
    }
  }
  if (D80()) {
    if (Y0(process.env.ENABLE_ENHANCED_TELEMETRY_BETA)) {
      let K = Bb5();
      if (K.length > 0) {
        let D = K.map((C) => new vJA.BatchSpanProcessor(C, {
            scheduledDelayMillis: parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL || tv5.toString())
          })),
          H = new vJA.BasicTracerProvider({
            resource: X,
            spanProcessors: D
          });
        yJA.trace.setGlobalTracerProvider(H), pE0(H)
      }
    }
  }
  return PG(async () => {
    let K = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
    try {
      X61();
      let D = [V.shutdown()],
        H = SX1();
      if (H) D.push(H.shutdown());
      let C = _X1();
      if (C) D.push(C.shutdown());
      await Promise.race([Promise.all(D), new Promise((E, U) => setTimeout(() => U(Error("OpenTelemetry shutdown timeout")), K))])
    } catch (D) {
      if (D instanceof Error && D.message.includes("timeout")) g(`
OpenTelemetry telemetry flush timed out after ${K}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${K}ms
`, {
        level: "error"
      });
      throw D
    }
  }), V.getMeter("com.anthropic.claude_code", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.0.59",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues"
  }.VERSION)
}
// @from(Start 11199921, End 11200664)
async function VO2() {
  let A = dE0();
  if (!A) return;
  let Q = parseInt(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS || "5000");
  try {
    let B = [A.forceFlush()],
      G = SX1();
    if (G) B.push(G.forceFlush());
    let Z = _X1();
    if (Z) B.push(Z.forceFlush());
    await Promise.race([Promise.all(B), new Promise((I, Y) => setTimeout(() => Y(Error("OpenTelemetry flush timeout")), Q))]), g("Telemetry flushed successfully")
  } catch (B) {
    if (B instanceof Error && B.message.includes("timeout")) g(`Telemetry flush timed out after ${Q}ms. Some metrics may not be exported.`, {
      level: "warn"
    });
    else g(`Telemetry flush failed: ${B instanceof Error?B.message:String(B)}`, {
      level: "error"
    })
  }
}
// @from(Start 11200666, End 11201046)
function z80() {
  let A = Sc(),
    Q = XT(),
    B = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!A || B && qiA(B)) return Q ? {
    httpAgentOptions: Q
  } : {};
  return {
    httpAgentOptions: (Z) => {
      return Q ? new C80.HttpsProxyAgent(A, {
        cert: Q.cert,
        key: Q.key,
        passphrase: Q.passphrase
      }) : new C80.HttpsProxyAgent(A)
    }
  }
}
// @from(Start 11201051, End 11201054)
yJA
// @from(Start 11201056, End 11201059)
H80
// @from(Start 11201061, End 11201064)
F61
// @from(Start 11201066, End 11201069)
eM2
// @from(Start 11201071, End 11201074)
AO2
// @from(Start 11201076, End 11201079)
QO2
// @from(Start 11201081, End 11201084)
BO2
// @from(Start 11201086, End 11201089)
E80
// @from(Start 11201091, End 11201094)
xJA
// @from(Start 11201096, End 11201099)
GO2
// @from(Start 11201101, End 11201104)
ZO2
// @from(Start 11201106, End 11201109)
IO2
// @from(Start 11201111, End 11201114)
vJA
// @from(Start 11201116, End 11201119)
YO2
// @from(Start 11201121, End 11201124)
JO2
// @from(Start 11201126, End 11201129)
WO2
// @from(Start 11201131, End 11201133)
LP
// @from(Start 11201135, End 11201137)
In
// @from(Start 11201139, End 11201142)
C80
// @from(Start 11201144, End 11201155)
rv5 = 60000
// @from(Start 11201159, End 11201169)
ov5 = 5000
// @from(Start 11201173, End 11201183)
tv5 = 5000
// @from(Start 11201189, End 11201698)
U80 = L(() => {
  cM2();
  pM2();
  HH();
  _c();
  gB();
  _0();
  F0A();
  Q3();
  gB();
  MB();
  V0();
  js();
  v3A();
  hQ();
  yJA = BA(K9(), 1), H80 = BA(Ef1(), 1), F61 = BA(vi(), 1), eM2 = BA(lD2(), 1), AO2 = BA(ZN2(), 1), QO2 = BA(w41(), 1), BO2 = BA(DN2(), 1), E80 = BA(vi(), 1), xJA = BA(sf1(), 1), GO2 = BA(MN2(), 1), ZO2 = BA(SN2(), 1), IO2 = BA(mN2(), 1), vJA = BA(HM2(), 1), YO2 = BA(OM2(), 1), JO2 = BA(_M2(), 1), WO2 = BA(dM2(), 1), LP = BA(t3A(), 1), In = BA(qt(), 1), C80 = BA(LEA(), 1)
})
// @from(Start 11201700, End 11202037)
async function w80({
  clearOnboarding: A = !1
}) {
  await VO2(), i4B(), Fw().delete(), K61();
  let B = N1();
  if (A) {
    if (B.hasCompletedOnboarding = !1, B.subscriptionNoticeCount = 0, B.hasAvailableSubscription = !1, B.customApiKeyResponses?.approved) B.customApiKeyResponses.approved = []
  }
  B.oauthAccount = void 0, c0(B)
}
// @from(Start 11202042, End 11202045)
$80
// @from(Start 11202047, End 11202151)
K61 = () => {
    M6.cache?.clear?.(), x4A(), TCB(), KCB(), Zt.cache?.clear?.(), yi.cache?.clear?.()
  }
// @from(Start 11202155, End 11202158)
FO2
// @from(Start 11202164, End 11202834)
D61 = L(() => {
  jQ();
  Bh();
  nt();
  hA();
  gB();
  mbA();
  CS();
  u2();
  gb();
  kW();
  hYA();
  U80();
  unA();
  $80 = BA(VA(), 1);
  FO2 = {
    type: "local-jsx",
    name: "logout",
    description: "Sign out from your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
    isHidden: !1,
    async call() {
      if (!gH()) await kJ();
      await w80({
        clearOnboarding: !0
      });
      let A = $80.createElement($, null, "Successfully logged out from your Anthropic account.");
      return setTimeout(() => {
        l5(0, "logout")
      }, 200), A
    },
    userFacingName() {
      return "logout"
    }
  }
})
// @from(Start 11202836, End 11205367)
class KRA {
  codeVerifier;
  authCodeListener = null;
  port = null;
  manualAuthCodeResolver = null;
  constructor() {
    this.codeVerifier = RY2()
  }
  async startOAuthFlow(A, Q) {
    this.authCodeListener = new jQ0, this.port = await this.authCodeListener.start();
    let B = TY2(this.codeVerifier),
      G = PY2(),
      Z = {
        codeChallenge: B,
        state: G,
        port: this.port,
        loginWithClaudeAi: Q?.loginWithClaudeAi,
        inferenceOnly: Q?.inferenceOnly,
        orgUUID: Q?.orgUUID
      },
      I = oz1({
        ...Z,
        isManual: !0
      }),
      Y = oz1({
        ...Z,
        isManual: !1
      }),
      J = await this.waitForAuthorizationCode(G, async () => {
        await A(I), await cZ(Y)
      }),
      W = this.authCodeListener?.hasPendingResponse() ?? !1;
    GA("tengu_oauth_auth_code_received", {
      automatic: W
    });
    try {
      let X = await Lo0(J, G, this.codeVerifier, this.port, !W, Q?.expiresIn);
      await w80({
        clearOnboarding: !1
      });
      let V = await tz1(X.access_token);
      if (X.account) ez1({
        accountUuid: X.account.uuid,
        emailAddress: X.account.email_address,
        organizationUuid: X.organization?.uuid,
        displayName: V.displayName,
        hasExtraUsageEnabled: V.hasExtraUsageEnabled ?? void 0
      });
      if (W) {
        let F = cbA(X.scope);
        this.authCodeListener?.handleSuccessRedirect(F)
      }
      return this.formatTokens(X, V.subscriptionType, V.rateLimitTier)
    } catch (X) {
      if (W) this.authCodeListener?.handleErrorRedirect();
      throw X
    } finally {
      this.authCodeListener?.close()
    }
  }
  async waitForAuthorizationCode(A, Q) {
    return new Promise((B, G) => {
      this.manualAuthCodeResolver = B, this.authCodeListener?.waitForAuthorization(A, Q).then((Z) => {
        this.manualAuthCodeResolver = null, B(Z)
      }).catch((Z) => {
        this.manualAuthCodeResolver = null, G(Z)
      })
    })
  }
  handleManualAuthCodeInput(A) {
    if (this.manualAuthCodeResolver) this.manualAuthCodeResolver(A.authorizationCode), this.manualAuthCodeResolver = null, this.authCodeListener?.close()
  }
  formatTokens(A, Q, B) {
    return {
      accessToken: A.access_token,
      refreshToken: A.refresh_token,
      expiresAt: Date.now() + A.expires_in * 1000,
      scopes: cbA(A.scope),
      subscriptionType: Q,
      rateLimitTier: B
    }
  }
  cleanup() {
    this.authCodeListener?.close(), this.manualAuthCodeResolver = null
  }
}
// @from(Start 11205372, End 11205440)
q80 = L(() => {
  gM();
  OY2();
  jY2();
  AL();
  D61();
  q0()
})
// @from(Start 11205443, End 11205514)
function dV(A, Q) {
  return A.flatMap((B, G) => G ? [Q(G), B] : [B])
}
// @from(Start 11205515, End 11205947)
async function Ib5() {
  try {
    if (Y0(process.env.CLAUDE_CODE_USE_BEDROCK) || Y0(process.env.CLAUDE_CODE_USE_VERTEX) || Y0(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !0;
    return await YQ.get("https://api.anthropic.com/api/hello", {
      timeout: 5000,
      headers: {
        "Cache-Control": "no-cache"
      }
    }), !0
  } catch (A) {
    if (!(A instanceof Nn0)) return !0;
    return A.code !== "EHOSTUNREACH"
  }
}
// @from(Start 11205949, End 11206352)
function N80() {
  let [A, Q] = H61.useState(null);
  return H61.useEffect(() => {
    let B = !0;
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let G = async () => {
      if (!B) return;
      let I = await Ib5();
      if (B) Q(I)
    };
    G();
    let Z = setInterval(G, Yb5);
    return () => {
      B = !1, clearInterval(Z)
    }
  }, []), {
    isConnected: A
  }
}
// @from(Start 11206357, End 11206360)
H61
// @from(Start 11206362, End 11206373)
Yb5 = 30000
// @from(Start 11206379, End 11206433)
KO2 = L(() => {
  O3();
  hQ();
  H61 = BA(VA(), 1)
})
// @from(Start 11206435, End 11208118)
class bJA {
  activeOperations = new Set;
  lastUserActivityTime = 0;
  lastCLIRecordedTime = Date.now();
  isCLIActive = !1;
  USER_ACTIVITY_TIMEOUT_MS = 5000;
  static instance = null;
  static getInstance() {
    if (!bJA.instance) bJA.instance = new bJA;
    return bJA.instance
  }
  recordUserActivity() {
    if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
      let Q = (Date.now() - this.lastUserActivityTime) / 1000;
      if (Q > 0) {
        let B = jX1();
        if (B) {
          let G = this.USER_ACTIVITY_TIMEOUT_MS / 1000;
          if (Q < G) B.add(Q, {
            type: "user"
          })
        }
      }
    }
    this.lastUserActivityTime = Date.now()
  }
  startCLIActivity(A) {
    if (this.activeOperations.has(A)) this.endCLIActivity(A);
    let Q = this.activeOperations.size === 0;
    if (this.activeOperations.add(A), Q) this.isCLIActive = !0, this.lastCLIRecordedTime = Date.now()
  }
  endCLIActivity(A) {
    if (this.activeOperations.delete(A), this.activeOperations.size === 0) {
      let Q = Date.now(),
        B = (Q - this.lastCLIRecordedTime) / 1000;
      if (B > 0) {
        let G = jX1();
        if (G) G.add(B, {
          type: "cli"
        })
      }
      this.lastCLIRecordedTime = Q, this.isCLIActive = !1
    }
  }
  async trackOperation(A, Q) {
    this.startCLIActivity(A);
    try {
      return await Q()
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
// @from(Start 11208123, End 11208126)
DRA
// @from(Start 11208132, End 11208184)
L80 = L(() => {
  _0();
  DRA = bJA.getInstance()
})
// @from(Start 11208187, End 11208967)
function Yn({
  todos: A,
  isStandalone: Q = !1
}) {
  if (A.length === 0) return null;
  let B = FK.createElement(FK.Fragment, null, A.map((G, Z) => {
    let I = G.status === "completed" ? H1.checkboxOn : H1.checkboxOff;
    return FK.createElement(S, {
      key: Z
    }, FK.createElement($, {
      dimColor: G.status === "completed"
    }, I, " "), FK.createElement($, {
      bold: G.status === "in_progress",
      dimColor: G.status === "completed",
      strikethrough: G.status === "completed"
    }, G.content))
  }));
  if (Q) return FK.createElement(S, {
    flexDirection: "column",
    marginTop: 1,
    marginLeft: 2
  }, FK.createElement($, {
    bold: !0,
    dimColor: !0
  }, "Todos"), B);
  return FK.createElement(S, {
    flexDirection: "column"
  }, B)
}
// @from(Start 11208972, End 11208974)
FK
// @from(Start 11208980, End 11209033)
HRA = L(() => {
  hA();
  V9();
  FK = BA(VA(), 1)
})
// @from(Start 11209036, End 11209726)
function DO2({
  streamMode: A
}) {
  let [Q, B] = CRA.useState(null), [G, Z] = CRA.useState(null);
  if (CRA.useEffect(() => {
      if (A === "thinking" && Q === null) B(Date.now());
      else if (A !== "thinking" && Q !== null) Z(Date.now() - Q), B(null)
    }, [A, Q]), A === "thinking") return MP.createElement(S, {
    marginTop: 1
  }, MP.createElement($, {
    dimColor: !0
  }, "∴ Thinking…"));
  if (G !== null) return MP.createElement(S, {
    marginTop: 1
  }, MP.createElement($, {
    dimColor: !0
  }, "∴ Thought for ", Math.max(1, Math.round(G / 1000)), "s (", MP.createElement($, {
    dimColor: !0,
    bold: !0
  }, "ctrl+o"), " ", "to show thinking)"));
  return null
}
// @from(Start 11209731, End 11209733)
MP
// @from(Start 11209735, End 11209738)
CRA
// @from(Start 11209744, End 11209808)
HO2 = L(() => {
  hA();
  MP = BA(VA(), 1), CRA = BA(VA(), 1)
})
// @from(Start 11209811, End 11210017)
function ERA() {
  if (process.env.TERM === "xterm-ghostty") return ["·", "✢", "✳", "✶", "✻", "*"];
  return process.platform === "darwin" ? ["·", "✢", "✳", "✶", "✻", "✽"] : ["·", "✢", "*", "✶", "✻", "✽"]
}
// @from(Start 11210019, End 11210184)
function K0A(A, Q, B) {
  return {
    r: Math.round(A.r + (Q.r - A.r) * B),
    g: Math.round(A.g + (Q.g - A.g) * B),
    b: Math.round(A.b + (Q.b - A.b) * B)
  }
}
// @from(Start 11210186, End 11210242)
function fJA(A) {
  return `rgb(${A.r},${A.g},${A.b})`
}
// @from(Start 11210244, End 11210453)
function O80({
  char: A,
  flashOpacity: Q
}) {
  let Z = K0A({
    r: 215,
    g: 119,
    b: 87
  }, {
    r: 245,
    g: 149,
    b: 117
  }, Q);
  return M80.createElement($, {
    color: fJA(Z)
  }, A)
}
// @from(Start 11210458, End 11210461)
M80
// @from(Start 11210467, End 11210513)
R80 = L(() => {
  hA();
  M80 = BA(VA(), 1)
})
// @from(Start 11210516, End 11211493)
function T80({
  message: A,
  mode: Q,
  isConnected: B,
  messageColor: G,
  glimmerIndex: Z,
  flashOpacity: I,
  shimmerColor: Y,
  stalledIntensity: J = 0
}) {
  if (!A) return null;
  if (B === !1) return hJ.createElement($, {
    color: G
  }, A, " ");
  if (J > 0) {
    let V = K0A({
        r: 215,
        g: 119,
        b: 87
      }, {
        r: 171,
        g: 43,
        b: 63
      }, J),
      F = fJA(V);
    return hJ.createElement(hJ.Fragment, null, hJ.createElement($, {
      color: F
    }, A), hJ.createElement($, {
      color: F
    }, " "))
  }
  return hJ.createElement(hJ.Fragment, null, A.split("").map((W, X) => {
    if (Q === "tool-use") return hJ.createElement(O80, {
      key: X,
      char: W,
      flashOpacity: I
    });
    else return hJ.createElement(AGA, {
      key: X,
      char: W,
      index: X,
      glimmerIndex: Z,
      messageColor: G,
      shimmerColor: Y
    })
  }), hJ.createElement($, {
    color: G
  }, " "))
}
// @from(Start 11211498, End 11211500)
hJ
// @from(Start 11211506, End 11211569)
CO2 = L(() => {
  hA();
  R80();
  KrA();
  hJ = BA(VA(), 1)
})
// @from(Start 11211572, End 11212259)
function P80({
  frame: A,
  messageColor: Q,
  stalledIntensity: B = 0,
  isConnected: G
}) {
  let Z = zO2[A % zO2.length];
  if (G === !1) return Rq.createElement(S, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, Rq.createElement($, {
    color: Q
  }, Z));
  if (B > 0) {
    let J = K0A({
      r: 215,
      g: 119,
      b: 87
    }, {
      r: 171,
      g: 43,
      b: 63
    }, B);
    return Rq.createElement(S, {
      flexWrap: "wrap",
      height: 1,
      width: 2
    }, Rq.createElement($, {
      color: fJA(J)
    }, Z))
  }
  return Rq.createElement(S, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, Rq.createElement($, {
    color: Q
  }, Z))
}
// @from(Start 11212264, End 11212266)
Rq
// @from(Start 11212268, End 11212271)
EO2
// @from(Start 11212273, End 11212276)
zO2
// @from(Start 11212282, End 11212379)
UO2 = L(() => {
  hA();
  Rq = BA(VA(), 1), EO2 = ERA(), zO2 = [...EO2, ...[...EO2].reverse()]
})
// @from(Start 11212382, End 11212601)
function j80(A) {
  let [Q, B] = $O2.useState(0);
  return CI(() => {
    if (A === "tool-use") B(() => {
      let G = Date.now() / 1000;
      return (Math.sin(G * Math.PI) + 1) / 2
    });
    else B(0)
  }, 50), Q
}
// @from(Start 11212606, End 11212609)
$O2
// @from(Start 11212615, End 11212661)
wO2 = L(() => {
  JE();
  $O2 = BA(VA(), 1)
})
// @from(Start 11212664, End 11213240)
function S80(A, Q = !1) {
  let [B, G] = D0A.useState(0), [Z, I] = D0A.useState(0), Y = D0A.useRef(A);
  D0A.useEffect(() => {
    if (A > Y.current) G(0), I(0), Y.current = A
  }, [A]), CI(() => {
    if (A > 0 && A === Y.current && !Q) G((X) => X + 100);
    else if (A === 0 || Q) G(0)
  }, 100);
  let J = B > 3000 && !Q,
    W = J ? Math.min((B - 3000) / 2000, 1) : 0;
  return CI(() => {
    I((X) => {
      let V = W,
        F = V - X;
      if (Math.abs(F) < 0.01) return V;
      return X + F * 0.1
    })
  }, 50), {
    isStalled: J,
    stalledIntensity: Z
  }
}
// @from(Start 11213245, End 11213248)
D0A
// @from(Start 11213254, End 11213300)
qO2 = L(() => {
  JE();
  D0A = BA(VA(), 1)
})
// @from(Start 11213306, End 11213386)
NO2 = L(() => {
  R80();
  KrA();
  CO2();
  UO2();
  Lm1();
  wO2();
  qO2()
})
// @from(Start 11213389, End 11217108)
function OO2({
  mode: A,
  elapsedTimeMs: Q,
  spinnerTip: B,
  currentResponseLength: G,
  overrideColor: Z,
  overrideShimmerColor: I,
  overrideMessage: Y,
  spinnerSuffix: J,
  verbose: W,
  todos: X,
  hasActiveTools: V = !1
}) {
  let F = Vb5(),
    [K, D] = OP.useState(0),
    [H, C] = OP.useState(0),
    [E] = OQ(),
    {
      isConnected: U
    } = N80(),
    {
      columns: q
    } = WB(),
    w = X?.find((OA) => OA.status === "in_progress"),
    N = X?.find((OA) => OA.status === "pending"),
    R = OP.useMemo(() => as(F), [F]),
    T = (Y ?? w?.activeForm ?? R) + "…",
    {
      isStalled: y,
      stalledIntensity: v
    } = S80(G, V),
    x = T$A(A, T, U, y),
    p = j80(A),
    u = OP.useRef(G);
  OP.useEffect(() => {
    let OA = "spinner-" + A;
    return DRA.startCLIActivity(OA), () => {
      DRA.endCLIActivity(OA)
    }
  }, [A]), OP.useEffect(() => {
    u.current = G
  }, [G]), CI(() => {
    if (!U) {
      D(4);
      return
    }
    D((OA) => OA + 1)
  }, 120), CI(() => {
    C((OA) => {
      let mA = u.current - OA;
      if (mA <= 0) return OA;
      let wA;
      if (mA < 70) wA = 1;
      else if (mA < 200) wA = Math.max(2, Math.ceil(mA * 0.08));
      else wA = 18;
      return Math.min(OA + wA, u.current)
    })
  }, 10);
  let e = T.length + 2,
    l = 16,
    k = q > e + 20,
    m = X && X.length > 0 && k && q > e + l + 25,
    o = (W || Q > Wb5) && k && q > e + l + (m ? 25 : 0) + 25,
    IA = [...k ? [sB.createElement($, {
      dimColor: !0,
      key: "esc"
    }, sB.createElement(E4, {
      shortcut: "esc",
      action: "interrupt",
      bold: !0
    }))] : [], ...J ? [sB.createElement($, {
      dimColor: !0,
      key: "suffix"
    }, J)] : [], ...m ? [sB.createElement($, {
      dimColor: !0,
      key: "todo"
    }, sB.createElement(E4, {
      shortcut: "ctrl+t",
      action: `${E.showExpandedTodos?"hide":"show"} todos`,
      bold: !0
    }))] : [], ...o ? [sB.createElement($, {
      dimColor: !0,
      key: "elapsedTime"
    }, eC(Q)), sB.createElement(S, {
      flexDirection: "row",
      key: "tokens"
    }, sB.createElement(Xb5, {
      mode: A,
      key: "spinnerMode"
    }), sB.createElement($, {
      dimColor: !0
    }, JZ(Math.round(H / 4)), " tokens"))] : []];
  if (U === !1) IA.push(sB.createElement(S, {
    key: "offline"
  }, sB.createElement($, {
    color: "error",
    bold: !0
  }, "offline")));
  let FA = Z ?? (U === !1 ? "inactive" : "claude"),
    zA = I ?? "claudeShimmer",
    NA = IA.length > 0 ? sB.createElement(sB.Fragment, null, sB.createElement($, {
      dimColor: !0
    }, "("), dV(IA, (OA) => sB.createElement($, {
      dimColor: !0,
      key: `separator-${OA}`
    }, " ", "·", " ")), sB.createElement($, {
      dimColor: !0
    }, ")")) : null;
  return sB.createElement(S, {
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start"
  }, sB.createElement(DO2, {
    streamMode: A
  }), sB.createElement(S, {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
    width: "100%"
  }, sB.createElement(P80, {
    frame: K,
    messageColor: FA,
    stalledIntensity: v,
    isConnected: U
  }), sB.createElement(T80, {
    message: T,
    mode: A,
    isConnected: U,
    messageColor: FA,
    glimmerIndex: x,
    flashOpacity: p,
    shimmerColor: zA,
    stalledIntensity: v
  }), NA), E.showExpandedTodos && X && X.length > 0 ? sB.createElement(S, {
    width: "100%",
    flexDirection: "column"
  }, sB.createElement(S0, null, sB.createElement(Yn, {
    todos: X
  }))) : N || B ? sB.createElement(S, {
    width: "100%"
  }, sB.createElement(S0, null, sB.createElement($, {
    dimColor: !0
  }, N ? `Next: ${N.content}` : `Tip: ${B}`))) : null)
}
// @from(Start 11217110, End 11217526)
function Xb5({
  mode: A
}) {
  switch (A) {
    case "tool-input":
    case "tool-use":
    case "responding":
    case "thinking":
      return sB.createElement(S, {
        width: 2
      }, sB.createElement($, {
        dimColor: !0
      }, H1.arrowDown));
    case "requesting":
      return sB.createElement(S, {
        width: 2
      }, sB.createElement($, {
        dimColor: !0
      }, H1.arrowUp))
  }
}
// @from(Start 11217528, End 11217831)
function g4() {
  let [A, Q] = OP.useState(0), {
    isConnected: B
  } = N80();
  return CI(() => {
    Q((Z) => (Z + 1) % MO2.length)
  }, 120), sB.createElement(S, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, sB.createElement($, {
    color: B === !1 ? "inactive" : "text"
  }, MO2[A]))
}
// @from(Start 11217833, End 11217898)
function Vb5() {
  return snA("tengu_spinner_words", Jb5).words
}
// @from(Start 11217903, End 11217905)
sB
// @from(Start 11217907, End 11217909)
OP
// @from(Start 11217911, End 11217914)
LO2
// @from(Start 11217916, End 11217919)
MO2
// @from(Start 11217921, End 11217924)
Jb5
// @from(Start 11217926, End 11217937)
Wb5 = 30000
// @from(Start 11217943, End 11219321)
DY = L(() => {
  hA();
  LxA();
  JE();
  V9();
  KO2();
  L80();
  u2();
  q8();
  HRA();
  z9();
  i8();
  HO2();
  dF();
  NO2();
  sB = BA(VA(), 1), OP = BA(VA(), 1), LO2 = ERA(), MO2 = [...LO2, ...[...LO2].reverse()], Jb5 = {
    words: ["Accomplishing", "Actioning", "Actualizing", "Baking", "Booping", "Brewing", "Calculating", "Cerebrating", "Channelling", "Churning", "Clauding", "Coalescing", "Cogitating", "Computing", "Combobulating", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Deciphering", "Deliberating", "Determining", "Discombobulating", "Doing", "Effecting", "Elucidating", "Enchanting", "Envisioning", "Finagling", "Flibbertigibbeting", "Forging", "Forming", "Frolicking", "Generating", "Germinating", "Hatching", "Herding", "Honking", "Ideating", "Imagining", "Incubating", "Inferring", "Manifesting", "Marinating", "Meandering", "Moseying", "Mulling", "Mustering", "Musing", "Noodling", "Percolating", "Perusing", "Philosophising", "Pontificating", "Pondering", "Processing", "Puttering", "Puzzling", "Reticulating", "Ruminating", "Scheming", "Schlepping", "Shimmying", "Simmering", "Smooshing", "Spelunking", "Spinning", "Stewing", "Sussing", "Synthesizing", "Thinking", "Tinkering", "Transmuting", "Unfurling", "Unravelling", "Vibing", "Wandering", "Whirring", "Wibbling", "Working", "Wrangling"]
  }
})
// @from(Start 11219327, End 11220660)
zRA = z((Db5) => {
  function Fb5(A, Q, B) {
    if (B === void 0) B = Array.prototype;
    if (A && typeof B.find === "function") return B.find.call(A, Q);
    for (var G = 0; G < A.length; G++)
      if (Object.prototype.hasOwnProperty.call(A, G)) {
        var Z = A[G];
        if (Q.call(void 0, Z, G, A)) return Z
      }
  }

  function _80(A, Q) {
    if (Q === void 0) Q = Object;
    return Q && typeof Q.freeze === "function" ? Q.freeze(A) : A
  }

  function Kb5(A, Q) {
    if (A === null || typeof A !== "object") throw TypeError("target is not an object");
    for (var B in Q)
      if (Object.prototype.hasOwnProperty.call(Q, B)) A[B] = Q[B];
    return A
  }
  var RO2 = _80({
      HTML: "text/html",
      isHTML: function(A) {
        return A === RO2.HTML
      },
      XML_APPLICATION: "application/xml",
      XML_TEXT: "text/xml",
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      XML_SVG_IMAGE: "image/svg+xml"
    }),
    TO2 = _80({
      HTML: "http://www.w3.org/1999/xhtml",
      isHTML: function(A) {
        return A === TO2.HTML
      },
      SVG: "http://www.w3.org/2000/svg",
      XML: "http://www.w3.org/XML/1998/namespace",
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
  Db5.assign = Kb5;
  Db5.find = Fb5;
  Db5.freeze = _80;
  Db5.MIME_TYPE = RO2;
  Db5.NAMESPACE = TO2
})
// @from(Start 11220666, End 11248690)
d80 = z((kb5) => {
  var vO2 = zRA(),
    Ey = vO2.find,
    URA = vO2.NAMESPACE;

  function $b5(A) {
    return A !== ""
  }

  function wb5(A) {
    return A ? A.split(/[\t\n\f\r ]+/).filter($b5) : []
  }

  function qb5(A, Q) {
    if (!A.hasOwnProperty(Q)) A[Q] = !0;
    return A
  }

  function PO2(A) {
    if (!A) return [];
    var Q = wb5(A);
    return Object.keys(Q.reduce(qb5, {}))
  }

  function Nb5(A) {
    return function(Q) {
      return A && A.indexOf(Q) !== -1
    }
  }

  function wRA(A, Q) {
    for (var B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) Q[B] = A[B]
  }

  function Z$(A, Q) {
    var B = A.prototype;
    if (!(B instanceof Q)) {
      let Z = function() {};
      var G = Z;
      Z.prototype = Q.prototype, Z = new Z, wRA(B, Z), A.prototype = B = Z
    }
    if (B.constructor != A) {
      if (typeof A != "function") console.error("unknown Class:" + A);
      B.constructor = A
    }
  }
  var I$ = {},
    RP = I$.ELEMENT_NODE = 1,
    gJA = I$.ATTRIBUTE_NODE = 2,
    C61 = I$.TEXT_NODE = 3,
    bO2 = I$.CDATA_SECTION_NODE = 4,
    fO2 = I$.ENTITY_REFERENCE_NODE = 5,
    Lb5 = I$.ENTITY_NODE = 6,
    hO2 = I$.PROCESSING_INSTRUCTION_NODE = 7,
    gO2 = I$.COMMENT_NODE = 8,
    uO2 = I$.DOCUMENT_NODE = 9,
    mO2 = I$.DOCUMENT_TYPE_NODE = 10,
    gh = I$.DOCUMENT_FRAGMENT_NODE = 11,
    Mb5 = I$.NOTATION_NODE = 12,
    ZC = {},
    KK = {},
    bsG = ZC.INDEX_SIZE_ERR = (KK[1] = "Index size error", 1),
    fsG = ZC.DOMSTRING_SIZE_ERR = (KK[2] = "DOMString size error", 2),
    G$ = ZC.HIERARCHY_REQUEST_ERR = (KK[3] = "Hierarchy request error", 3),
    hsG = ZC.WRONG_DOCUMENT_ERR = (KK[4] = "Wrong document", 4),
    gsG = ZC.INVALID_CHARACTER_ERR = (KK[5] = "Invalid character", 5),
    usG = ZC.NO_DATA_ALLOWED_ERR = (KK[6] = "No data allowed", 6),
    msG = ZC.NO_MODIFICATION_ALLOWED_ERR = (KK[7] = "No modification allowed", 7),
    dO2 = ZC.NOT_FOUND_ERR = (KK[8] = "Not found", 8),
    dsG = ZC.NOT_SUPPORTED_ERR = (KK[9] = "Not supported", 9),
    jO2 = ZC.INUSE_ATTRIBUTE_ERR = (KK[10] = "Attribute in use", 10),
    csG = ZC.INVALID_STATE_ERR = (KK[11] = "Invalid state", 11),
    psG = ZC.SYNTAX_ERR = (KK[12] = "Syntax error", 12),
    lsG = ZC.INVALID_MODIFICATION_ERR = (KK[13] = "Invalid modification", 13),
    isG = ZC.NAMESPACE_ERR = (KK[14] = "Invalid namespace", 14),
    nsG = ZC.INVALID_ACCESS_ERR = (KK[15] = "Invalid access", 15);

  function fW(A, Q) {
    if (Q instanceof Error) var B = Q;
    else if (B = this, Error.call(this, KK[A]), this.message = KK[A], Error.captureStackTrace) Error.captureStackTrace(this, fW);
    if (B.code = A, Q) this.message = this.message + ": " + Q;
    return B
  }
  fW.prototype = Error.prototype;
  wRA(ZC, fW);

  function hh() {}
  hh.prototype = {
    length: 0,
    item: function(A) {
      return A >= 0 && A < this.length ? this[A] : null
    },
    toString: function(A, Q) {
      for (var B = [], G = 0; G < this.length; G++) hJA(this[G], B, A, Q);
      return B.join("")
    },
    filter: function(A) {
      return Array.prototype.filter.call(this, A)
    },
    indexOf: function(A) {
      return Array.prototype.indexOf.call(this, A)
    }
  };

  function uJA(A, Q) {
    this._node = A, this._refresh = Q, x80(this)
  }

  function x80(A) {
    var Q = A._node._inc || A._node.ownerDocument._inc;
    if (A._inc !== Q) {
      var B = A._refresh(A._node);
      if (AR2(A, "length", B.length), !A.$$length || B.length < A.$$length) {
        for (var G = B.length; G in A; G++)
          if (Object.prototype.hasOwnProperty.call(A, G)) delete A[G]
      }
      wRA(B, A), A._inc = Q
    }
  }
  uJA.prototype.item = function(A) {
    return x80(this), this[A] || null
  };
  Z$(uJA, hh);

  function E61() {}

  function cO2(A, Q) {
    var B = A.length;
    while (B--)
      if (A[B] === Q) return B
  }

  function SO2(A, Q, B, G) {
    if (G) Q[cO2(Q, G)] = B;
    else Q[Q.length++] = B;
    if (A) {
      B.ownerElement = A;
      var Z = A.ownerDocument;
      if (Z) G && iO2(Z, A, G), Ob5(Z, A, B)
    }
  }

  function _O2(A, Q, B) {
    var G = cO2(Q, B);
    if (G >= 0) {
      var Z = Q.length - 1;
      while (G < Z) Q[G] = Q[++G];
      if (Q.length = Z, A) {
        var I = A.ownerDocument;
        if (I) iO2(I, A, B), B.ownerElement = null
      }
    } else throw new fW(dO2, Error(A.tagName + "@" + B))
  }
  E61.prototype = {
    length: 0,
    item: hh.prototype.item,
    getNamedItem: function(A) {
      var Q = this.length;
      while (Q--) {
        var B = this[Q];
        if (B.nodeName == A) return B
      }
    },
    setNamedItem: function(A) {
      var Q = A.ownerElement;
      if (Q && Q != this._ownerElement) throw new fW(jO2);
      var B = this.getNamedItem(A.nodeName);
      return SO2(this._ownerElement, this, A, B), B
    },
    setNamedItemNS: function(A) {
      var Q = A.ownerElement,
        B;
      if (Q && Q != this._ownerElement) throw new fW(jO2);
      return B = this.getNamedItemNS(A.namespaceURI, A.localName), SO2(this._ownerElement, this, A, B), B
    },
    removeNamedItem: function(A) {
      var Q = this.getNamedItem(A);
      return _O2(this._ownerElement, this, Q), Q
    },
    removeNamedItemNS: function(A, Q) {
      var B = this.getNamedItemNS(A, Q);
      return _O2(this._ownerElement, this, B), B
    },
    getNamedItemNS: function(A, Q) {
      var B = this.length;
      while (B--) {
        var G = this[B];
        if (G.localName == Q && G.namespaceURI == A) return G
      }
      return null
    }
  };

  function pO2() {}
  pO2.prototype = {
    hasFeature: function(A, Q) {
      return !0
    },
    createDocument: function(A, Q, B) {
      var G = new qRA;
      if (G.implementation = this, G.childNodes = new hh, G.doctype = B || null, B) G.appendChild(B);
      if (Q) {
        var Z = G.createElementNS(A, Q);
        G.appendChild(Z)
      }
      return G
    },
    createDocumentType: function(A, Q, B) {
      var G = new $61;
      return G.name = A, G.nodeName = A, G.publicId = Q || "", G.systemId = B || "", G
    }
  };

  function UG() {}
  UG.prototype = {
    firstChild: null,
    lastChild: null,
    previousSibling: null,
    nextSibling: null,
    attributes: null,
    parentNode: null,
    childNodes: null,
    ownerDocument: null,
    nodeValue: null,
    namespaceURI: null,
    prefix: null,
    localName: null,
    insertBefore: function(A, Q) {
      return z61(this, A, Q)
    },
    replaceChild: function(A, Q) {
      if (z61(this, A, Q, aO2), Q) this.removeChild(Q)
    },
    removeChild: function(A) {
      return nO2(this, A)
    },
    appendChild: function(A) {
      return this.insertBefore(A, null)
    },
    hasChildNodes: function() {
      return this.firstChild != null
    },
    cloneNode: function(A) {
      return y80(this.ownerDocument || this, this, A)
    },
    normalize: function() {
      var A = this.firstChild;
      while (A) {
        var Q = A.nextSibling;
        if (Q && Q.nodeType == C61 && A.nodeType == C61) this.removeChild(Q), A.appendData(Q.data);
        else A.normalize(), A = Q
      }
    },
    isSupported: function(A, Q) {
      return this.ownerDocument.implementation.hasFeature(A, Q)
    },
    hasAttributes: function() {
      return this.attributes.length > 0
    },
    lookupPrefix: function(A) {
      var Q = this;
      while (Q) {
        var B = Q._nsMap;
        if (B) {
          for (var G in B)
            if (Object.prototype.hasOwnProperty.call(B, G) && B[G] === A) return G
        }
        Q = Q.nodeType == gJA ? Q.ownerDocument : Q.parentNode
      }
      return null
    },
    lookupNamespaceURI: function(A) {
      var Q = this;
      while (Q) {
        var B = Q._nsMap;
        if (B) {
          if (Object.prototype.hasOwnProperty.call(B, A)) return B[A]
        }
        Q = Q.nodeType == gJA ? Q.ownerDocument : Q.parentNode
      }
      return null
    },
    isDefaultNamespace: function(A) {
      var Q = this.lookupPrefix(A);
      return Q == null
    }
  };

  function lO2(A) {
    return A == "<" && "&lt;" || A == ">" && "&gt;" || A == "&" && "&amp;" || A == '"' && "&quot;" || "&#" + A.charCodeAt() + ";"
  }
  wRA(I$, UG);
  wRA(I$, UG.prototype);

  function $RA(A, Q) {
    if (Q(A)) return !0;
    if (A = A.firstChild)
      do
        if ($RA(A, Q)) return !0; while (A = A.nextSibling)
  }

  function qRA() {
    this.ownerDocument = this
  }

  function Ob5(A, Q, B) {
    A && A._inc++;
    var G = B.namespaceURI;
    if (G === URA.XMLNS) Q._nsMap[B.prefix ? B.localName : ""] = B.value
  }

  function iO2(A, Q, B, G) {
    A && A._inc++;
    var Z = B.namespaceURI;
    if (Z === URA.XMLNS) delete Q._nsMap[B.prefix ? B.localName : ""]
  }

  function v80(A, Q, B) {
    if (A && A._inc) {
      A._inc++;
      var G = Q.childNodes;
      if (B) G[G.length++] = B;
      else {
        var Z = Q.firstChild,
          I = 0;
        while (Z) G[I++] = Z, Z = Z.nextSibling;
        G.length = I, delete G[G.length]
      }
    }
  }

  function nO2(A, Q) {
    var {
      previousSibling: B,
      nextSibling: G
    } = Q;
    if (B) B.nextSibling = G;
    else A.firstChild = G;
    if (G) G.previousSibling = B;
    else A.lastChild = B;
    return Q.parentNode = null, Q.previousSibling = null, Q.nextSibling = null, v80(A.ownerDocument, A), Q
  }

  function Rb5(A) {
    return A && (A.nodeType === UG.DOCUMENT_NODE || A.nodeType === UG.DOCUMENT_FRAGMENT_NODE || A.nodeType === UG.ELEMENT_NODE)
  }

  function Tb5(A) {
    return A && (zy(A) || b80(A) || uh(A) || A.nodeType === UG.DOCUMENT_FRAGMENT_NODE || A.nodeType === UG.COMMENT_NODE || A.nodeType === UG.PROCESSING_INSTRUCTION_NODE)
  }

  function uh(A) {
    return A && A.nodeType === UG.DOCUMENT_TYPE_NODE
  }

  function zy(A) {
    return A && A.nodeType === UG.ELEMENT_NODE
  }

  function b80(A) {
    return A && A.nodeType === UG.TEXT_NODE
  }

  function kO2(A, Q) {
    var B = A.childNodes || [];
    if (Ey(B, zy) || uh(Q)) return !1;
    var G = Ey(B, uh);
    return !(Q && G && B.indexOf(G) > B.indexOf(Q))
  }

  function yO2(A, Q) {
    var B = A.childNodes || [];

    function G(I) {
      return zy(I) && I !== Q
    }
    if (Ey(B, G)) return !1;
    var Z = Ey(B, uh);
    return !(Q && Z && B.indexOf(Z) > B.indexOf(Q))
  }

  function Pb5(A, Q, B) {
    if (!Rb5(A)) throw new fW(G$, "Unexpected parent node type " + A.nodeType);
    if (B && B.parentNode !== A) throw new fW(dO2, "child not in parent");
    if (!Tb5(Q) || uh(Q) && A.nodeType !== UG.DOCUMENT_NODE) throw new fW(G$, "Unexpected node type " + Q.nodeType + " for parent node type " + A.nodeType)
  }

  function jb5(A, Q, B) {
    var G = A.childNodes || [],
      Z = Q.childNodes || [];
    if (Q.nodeType === UG.DOCUMENT_FRAGMENT_NODE) {
      var I = Z.filter(zy);
      if (I.length > 1 || Ey(Z, b80)) throw new fW(G$, "More than one element or text in fragment");
      if (I.length === 1 && !kO2(A, B)) throw new fW(G$, "Element in fragment can not be inserted before doctype")
    }
    if (zy(Q)) {
      if (!kO2(A, B)) throw new fW(G$, "Only one element can be added and only after doctype")
    }
    if (uh(Q)) {
      if (Ey(G, uh)) throw new fW(G$, "Only one doctype is allowed");
      var Y = Ey(G, zy);
      if (B && G.indexOf(Y) < G.indexOf(B)) throw new fW(G$, "Doctype can only be inserted before an element");
      if (!B && Y) throw new fW(G$, "Doctype can not be appended since element is present")
    }
  }

  function aO2(A, Q, B) {
    var G = A.childNodes || [],
      Z = Q.childNodes || [];
    if (Q.nodeType === UG.DOCUMENT_FRAGMENT_NODE) {
      var I = Z.filter(zy);
      if (I.length > 1 || Ey(Z, b80)) throw new fW(G$, "More than one element or text in fragment");
      if (I.length === 1 && !yO2(A, B)) throw new fW(G$, "Element in fragment can not be inserted before doctype")
    }
    if (zy(Q)) {
      if (!yO2(A, B)) throw new fW(G$, "Only one element can be added and only after doctype")
    }
    if (uh(Q)) {
      let W = function(X) {
        return uh(X) && X !== B
      };
      var J = W;
      if (Ey(G, W)) throw new fW(G$, "Only one doctype is allowed");
      var Y = Ey(G, zy);
      if (B && G.indexOf(Y) < G.indexOf(B)) throw new fW(G$, "Doctype can only be inserted before an element")
    }
  }

  function z61(A, Q, B, G) {
    if (Pb5(A, Q, B), A.nodeType === UG.DOCUMENT_NODE)(G || jb5)(A, Q, B);
    var Z = Q.parentNode;
    if (Z) Z.removeChild(Q);
    if (Q.nodeType === gh) {
      var I = Q.firstChild;
      if (I == null) return Q;
      var Y = Q.lastChild
    } else I = Y = Q;
    var J = B ? B.previousSibling : A.lastChild;
    if (I.previousSibling = J, Y.nextSibling = B, J) J.nextSibling = I;
    else A.firstChild = I;
    if (B == null) A.lastChild = Y;
    else B.previousSibling = Y;
    do I.parentNode = A; while (I !== Y && (I = I.nextSibling));
    if (v80(A.ownerDocument || A, A), Q.nodeType == gh) Q.firstChild = Q.lastChild = null;
    return Q
  }

  function Sb5(A, Q) {
    if (Q.parentNode) Q.parentNode.removeChild(Q);
    if (Q.parentNode = A, Q.previousSibling = A.lastChild, Q.nextSibling = null, Q.previousSibling) Q.previousSibling.nextSibling = Q;
    else A.firstChild = Q;
    return A.lastChild = Q, v80(A.ownerDocument, A, Q), Q
  }
  qRA.prototype = {
    nodeName: "#document",
    nodeType: uO2,
    doctype: null,
    documentElement: null,
    _inc: 1,
    insertBefore: function(A, Q) {
      if (A.nodeType == gh) {
        var B = A.firstChild;
        while (B) {
          var G = B.nextSibling;
          this.insertBefore(B, Q), B = G
        }
        return A
      }
      if (z61(this, A, Q), A.ownerDocument = this, this.documentElement === null && A.nodeType === RP) this.documentElement = A;
      return A
    },
    removeChild: function(A) {
      if (this.documentElement == A) this.documentElement = null;
      return nO2(this, A)
    },
    replaceChild: function(A, Q) {
      if (z61(this, A, Q, aO2), A.ownerDocument = this, Q) this.removeChild(Q);
      if (zy(A)) this.documentElement = A
    },
    importNode: function(A, Q) {
      return eO2(this, A, Q)
    },
    getElementById: function(A) {
      var Q = null;
      return $RA(this.documentElement, function(B) {
        if (B.nodeType == RP) {
          if (B.getAttribute("id") == A) return Q = B, !0
        }
      }), Q
    },
    getElementsByClassName: function(A) {
      var Q = PO2(A);
      return new uJA(this, function(B) {
        var G = [];
        if (Q.length > 0) $RA(B.documentElement, function(Z) {
          if (Z !== B && Z.nodeType === RP) {
            var I = Z.getAttribute("class");
            if (I) {
              var Y = A === I;
              if (!Y) {
                var J = PO2(I);
                Y = Q.every(Nb5(J))
              }
              if (Y) G.push(Z)
            }
          }
        });
        return G
      })
    },
    createElement: function(A) {
      var Q = new H0A;
      Q.ownerDocument = this, Q.nodeName = A, Q.tagName = A, Q.localName = A, Q.childNodes = new hh;
      var B = Q.attributes = new E61;
      return B._ownerElement = Q, Q
    },
    createDocumentFragment: function() {
      var A = new w61;
      return A.ownerDocument = this, A.childNodes = new hh, A
    },
    createTextNode: function(A) {
      var Q = new f80;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createComment: function(A) {
      var Q = new h80;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createCDATASection: function(A) {
      var Q = new g80;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createProcessingInstruction: function(A, Q) {
      var B = new m80;
      return B.ownerDocument = this, B.tagName = B.nodeName = B.target = A, B.nodeValue = B.data = Q, B
    },
    createAttribute: function(A) {
      var Q = new U61;
      return Q.ownerDocument = this, Q.name = A, Q.nodeName = A, Q.localName = A, Q.specified = !0, Q
    },
    createEntityReference: function(A) {
      var Q = new u80;
      return Q.ownerDocument = this, Q.nodeName = A, Q
    },
    createElementNS: function(A, Q) {
      var B = new H0A,
        G = Q.split(":"),
        Z = B.attributes = new E61;
      if (B.childNodes = new hh, B.ownerDocument = this, B.nodeName = Q, B.tagName = Q, B.namespaceURI = A, G.length == 2) B.prefix = G[0], B.localName = G[1];
      else B.localName = Q;
      return Z._ownerElement = B, B
    },
    createAttributeNS: function(A, Q) {
      var B = new U61,
        G = Q.split(":");
      if (B.ownerDocument = this, B.nodeName = Q, B.name = Q, B.namespaceURI = A, B.specified = !0, G.length == 2) B.prefix = G[0], B.localName = G[1];
      else B.localName = Q;
      return B
    }
  };
  Z$(qRA, UG);

  function H0A() {
    this._nsMap = {}
  }
  H0A.prototype = {
    nodeType: RP,
    hasAttribute: function(A) {
      return this.getAttributeNode(A) != null
    },
    getAttribute: function(A) {
      var Q = this.getAttributeNode(A);
      return Q && Q.value || ""
    },
    getAttributeNode: function(A) {
      return this.attributes.getNamedItem(A)
    },
    setAttribute: function(A, Q) {
      var B = this.ownerDocument.createAttribute(A);
      B.value = B.nodeValue = "" + Q, this.setAttributeNode(B)
    },
    removeAttribute: function(A) {
      var Q = this.getAttributeNode(A);
      Q && this.removeAttributeNode(Q)
    },
    appendChild: function(A) {
      if (A.nodeType === gh) return this.insertBefore(A, null);
      else return Sb5(this, A)
    },
    setAttributeNode: function(A) {
      return this.attributes.setNamedItem(A)
    },
    setAttributeNodeNS: function(A) {
      return this.attributes.setNamedItemNS(A)
    },
    removeAttributeNode: function(A) {
      return this.attributes.removeNamedItem(A.nodeName)
    },
    removeAttributeNS: function(A, Q) {
      var B = this.getAttributeNodeNS(A, Q);
      B && this.removeAttributeNode(B)
    },
    hasAttributeNS: function(A, Q) {
      return this.getAttributeNodeNS(A, Q) != null
    },
    getAttributeNS: function(A, Q) {
      var B = this.getAttributeNodeNS(A, Q);
      return B && B.value || ""
    },
    setAttributeNS: function(A, Q, B) {
      var G = this.ownerDocument.createAttributeNS(A, Q);
      G.value = G.nodeValue = "" + B, this.setAttributeNode(G)
    },
    getAttributeNodeNS: function(A, Q) {
      return this.attributes.getNamedItemNS(A, Q)
    },
    getElementsByTagName: function(A) {
      return new uJA(this, function(Q) {
        var B = [];
        return $RA(Q, function(G) {
          if (G !== Q && G.nodeType == RP && (A === "*" || G.tagName == A)) B.push(G)
        }), B
      })
    },
    getElementsByTagNameNS: function(A, Q) {
      return new uJA(this, function(B) {
        var G = [];
        return $RA(B, function(Z) {
          if (Z !== B && Z.nodeType === RP && (A === "*" || Z.namespaceURI === A) && (Q === "*" || Z.localName == Q)) G.push(Z)
        }), G
      })
    }
  };
  qRA.prototype.getElementsByTagName = H0A.prototype.getElementsByTagName;
  qRA.prototype.getElementsByTagNameNS = H0A.prototype.getElementsByTagNameNS;
  Z$(H0A, UG);

  function U61() {}
  U61.prototype.nodeType = gJA;
  Z$(U61, UG);

  function NRA() {}
  NRA.prototype = {
    data: "",
    substringData: function(A, Q) {
      return this.data.substring(A, A + Q)
    },
    appendData: function(A) {
      A = this.data + A, this.nodeValue = this.data = A, this.length = A.length
    },
    insertData: function(A, Q) {
      this.replaceData(A, 0, Q)
    },
    appendChild: function(A) {
      throw Error(KK[G$])
    },
    deleteData: function(A, Q) {
      this.replaceData(A, Q, "")
    },
    replaceData: function(A, Q, B) {
      var G = this.data.substring(0, A),
        Z = this.data.substring(A + Q);
      B = G + B + Z, this.nodeValue = this.data = B, this.length = B.length
    }
  };
  Z$(NRA, UG);

  function f80() {}
  f80.prototype = {
    nodeName: "#text",
    nodeType: C61,
    splitText: function(A) {
      var Q = this.data,
        B = Q.substring(A);
      Q = Q.substring(0, A), this.data = this.nodeValue = Q, this.length = Q.length;
      var G = this.ownerDocument.createTextNode(B);
      if (this.parentNode) this.parentNode.insertBefore(G, this.nextSibling);
      return G
    }
  };
  Z$(f80, NRA);

  function h80() {}
  h80.prototype = {
    nodeName: "#comment",
    nodeType: gO2
  };
  Z$(h80, NRA);

  function g80() {}
  g80.prototype = {
    nodeName: "#cdata-section",
    nodeType: bO2
  };
  Z$(g80, NRA);

  function $61() {}
  $61.prototype.nodeType = mO2;
  Z$($61, UG);

  function sO2() {}
  sO2.prototype.nodeType = Mb5;
  Z$(sO2, UG);

  function rO2() {}
  rO2.prototype.nodeType = Lb5;
  Z$(rO2, UG);

  function u80() {}
  u80.prototype.nodeType = fO2;
  Z$(u80, UG);

  function w61() {}
  w61.prototype.nodeName = "#document-fragment";
  w61.prototype.nodeType = gh;
  Z$(w61, UG);

  function m80() {}
  m80.prototype.nodeType = hO2;
  Z$(m80, UG);

  function oO2() {}
  oO2.prototype.serializeToString = function(A, Q, B) {
    return tO2.call(A, Q, B)
  };
  UG.prototype.toString = tO2;

  function tO2(A, Q) {
    var B = [],
      G = this.nodeType == 9 && this.documentElement || this,
      Z = G.prefix,
      I = G.namespaceURI;
    if (I && Z == null) {
      var Z = G.lookupPrefix(I);
      if (Z == null) var Y = [{
        namespace: I,
        prefix: null
      }]
    }
    return hJA(this, B, A, Q, Y), B.join("")
  }

  function xO2(A, Q, B) {
    var G = A.prefix || "",
      Z = A.namespaceURI;
    if (!Z) return !1;
    if (G === "xml" && Z === URA.XML || Z === URA.XMLNS) return !1;
    var I = B.length;
    while (I--) {
      var Y = B[I];
      if (Y.prefix === G) return Y.namespace !== Z
    }
    return !0
  }

  function k80(A, Q, B) {
    A.push(" ", Q, '="', B.replace(/[<>&"\t\n\r]/g, lO2), '"')
  }

  function hJA(A, Q, B, G, Z) {
    if (!Z) Z = [];
    if (G)
      if (A = G(A), A) {
        if (typeof A == "string") {
          Q.push(A);
          return
        }
      } else return;
    switch (A.nodeType) {
      case RP:
        var I = A.attributes,
          Y = I.length,
          U = A.firstChild,
          J = A.tagName;
        B = URA.isHTML(A.namespaceURI) || B;
        var W = J;
        if (!B && !A.prefix && A.namespaceURI) {
          var X;
          for (var V = 0; V < I.length; V++)
            if (I.item(V).name === "xmlns") {
              X = I.item(V).value;
              break
            } if (!X)
            for (var F = Z.length - 1; F >= 0; F--) {
              var K = Z[F];
              if (K.prefix === "" && K.namespace === A.namespaceURI) {
                X = K.namespace;
                break
              }
            }
          if (X !== A.namespaceURI)
            for (var F = Z.length - 1; F >= 0; F--) {
              var K = Z[F];
              if (K.namespace === A.namespaceURI) {
                if (K.prefix) W = K.prefix + ":" + J;
                break
              }
            }
        }
        Q.push("<", W);
        for (var D = 0; D < Y; D++) {
          var H = I.item(D);
          if (H.prefix == "xmlns") Z.push({
            prefix: H.localName,
            namespace: H.value
          });
          else if (H.nodeName == "xmlns") Z.push({
            prefix: "",
            namespace: H.value
          })
        }
        for (var D = 0; D < Y; D++) {
          var H = I.item(D);
          if (xO2(H, B, Z)) {
            var C = H.prefix || "",
              E = H.namespaceURI;
            k80(Q, C ? "xmlns:" + C : "xmlns", E), Z.push({
              prefix: C,
              namespace: E
            })
          }
          hJA(H, Q, B, G, Z)
        }
        if (J === W && xO2(A, B, Z)) {
          var C = A.prefix || "",
            E = A.namespaceURI;
          k80(Q, C ? "xmlns:" + C : "xmlns", E), Z.push({
            prefix: C,
            namespace: E
          })
        }
        if (U || B && !/^(?:meta|link|img|br|hr|input)$/i.test(J)) {
          if (Q.push(">"), B && /^script$/i.test(J))
            while (U) {
              if (U.data) Q.push(U.data);
              else hJA(U, Q, B, G, Z.slice());
              U = U.nextSibling
            } else
              while (U) hJA(U, Q, B, G, Z.slice()), U = U.nextSibling;
          Q.push("</", W, ">")
        } else Q.push("/>");
        return;
      case uO2:
      case gh:
        var U = A.firstChild;
        while (U) hJA(U, Q, B, G, Z.slice()), U = U.nextSibling;
        return;
      case gJA:
        return k80(Q, A.name, A.value);
      case C61:
        return Q.push(A.data.replace(/[<&>]/g, lO2));
      case bO2:
        return Q.push("<![CDATA[", A.data, "]]>");
      case gO2:
        return Q.push("<!--", A.data, "-->");
      case mO2:
        var {
          publicId: q, systemId: w
        } = A;
        if (Q.push("<!DOCTYPE ", A.name), q) {
          if (Q.push(" PUBLIC ", q), w && w != ".") Q.push(" ", w);
          Q.push(">")
        } else if (w && w != ".") Q.push(" SYSTEM ", w, ">");
        else {
          var N = A.internalSubset;
          if (N) Q.push(" [", N, "]");
          Q.push(">")
        }
        return;
      case hO2:
        return Q.push("<?", A.target, " ", A.data, "?>");
      case fO2:
        return Q.push("&", A.nodeName, ";");
      default:
        Q.push("??", A.nodeName)
    }
  }

  function eO2(A, Q, B) {
    var G;
    switch (Q.nodeType) {
      case RP:
        G = Q.cloneNode(!1), G.ownerDocument = A;
      case gh:
        break;
      case gJA:
        B = !0;
        break
    }
    if (!G) G = Q.cloneNode(!1);
    if (G.ownerDocument = A, G.parentNode = null, B) {
      var Z = Q.firstChild;
      while (Z) G.appendChild(eO2(A, Z, B)), Z = Z.nextSibling
    }
    return G
  }

  function y80(A, Q, B) {
    var G = new Q.constructor;
    for (var Z in Q)
      if (Object.prototype.hasOwnProperty.call(Q, Z)) {
        var I = Q[Z];
        if (typeof I != "object") {
          if (I != G[Z]) G[Z] = I
        }
      } if (Q.childNodes) G.childNodes = new hh;
    switch (G.ownerDocument = A, G.nodeType) {
      case RP:
        var Y = Q.attributes,
          J = G.attributes = new E61,
          W = Y.length;
        J._ownerElement = G;
        for (var X = 0; X < W; X++) G.setAttributeNode(y80(A, Y.item(X), !0));
        break;
      case gJA:
        B = !0
    }
    if (B) {
      var V = Q.firstChild;
      while (V) G.appendChild(y80(A, V, B)), V = V.nextSibling
    }
    return G
  }

  function AR2(A, Q, B) {
    A[Q] = B
  }
  try {
    if (Object.defineProperty) {
      let A = function(Q) {
        switch (Q.nodeType) {
          case RP:
          case gh:
            var B = [];
            Q = Q.firstChild;
            while (Q) {
              if (Q.nodeType !== 7 && Q.nodeType !== 8) B.push(A(Q));
              Q = Q.nextSibling
            }
            return B.join("");
          default:
            return Q.nodeValue
        }
      };
      _b5 = A, Object.defineProperty(uJA.prototype, "length", {
        get: function() {
          return x80(this), this.$$length
        }
      }), Object.defineProperty(UG.prototype, "textContent", {
        get: function() {
          return A(this)
        },
        set: function(Q) {
          switch (this.nodeType) {
            case RP:
            case gh:
              while (this.firstChild) this.removeChild(this.firstChild);
              if (Q || String(Q)) this.appendChild(this.ownerDocument.createTextNode(Q));
              break;
            default:
              this.data = Q, this.value = Q, this.nodeValue = Q
          }
        }
      }), AR2 = function(Q, B, G) {
        Q["$$" + B] = G
      }
    }
  } catch (A) {}
  var _b5;
  kb5.DocumentType = $61;
  kb5.DOMException = fW;
  kb5.DOMImplementation = pO2;
  kb5.Element = H0A;
  kb5.Node = UG;
  kb5.NodeList = hh;
  kb5.XMLSerializer = oO2
})
// @from(Start 1407929, End 1415590)
rD1 = z((f47, Fh0) => {
  var u1 = OS0();
  u1.registerLanguage("1c", TS0());
  u1.registerLanguage("abnf", jS0());
  u1.registerLanguage("accesslog", kS0());
  u1.registerLanguage("actionscript", xS0());
  u1.registerLanguage("ada", bS0());
  u1.registerLanguage("angelscript", hS0());
  u1.registerLanguage("apache", uS0());
  u1.registerLanguage("applescript", lS0());
  u1.registerLanguage("arcade", nS0());
  u1.registerLanguage("arduino", sS0());
  u1.registerLanguage("armasm", oS0());
  u1.registerLanguage("xml", Q_0());
  u1.registerLanguage("asciidoc", Z_0());
  u1.registerLanguage("aspectj", Y_0());
  u1.registerLanguage("autohotkey", W_0());
  u1.registerLanguage("autoit", V_0());
  u1.registerLanguage("avrasm", K_0());
  u1.registerLanguage("awk", H_0());
  u1.registerLanguage("axapta", E_0());
  u1.registerLanguage("bash", U_0());
  u1.registerLanguage("basic", w_0());
  u1.registerLanguage("bnf", N_0());
  u1.registerLanguage("brainfuck", M_0());
  u1.registerLanguage("c-like", R_0());
  u1.registerLanguage("c", P_0());
  u1.registerLanguage("cal", S_0());
  u1.registerLanguage("capnproto", k_0());
  u1.registerLanguage("ceylon", x_0());
  u1.registerLanguage("clean", b_0());
  u1.registerLanguage("clojure", h_0());
  u1.registerLanguage("clojure-repl", u_0());
  u1.registerLanguage("cmake", d_0());
  u1.registerLanguage("coffeescript", p_0());
  u1.registerLanguage("coq", i_0());
  u1.registerLanguage("cos", a_0());
  u1.registerLanguage("cpp", r_0());
  u1.registerLanguage("crmsh", t_0());
  u1.registerLanguage("crystal", Ak0());
  u1.registerLanguage("csharp", Bk0());
  u1.registerLanguage("csp", Zk0());
  u1.registerLanguage("css", Yk0());
  u1.registerLanguage("d", Wk0());
  u1.registerLanguage("markdown", Vk0());
  u1.registerLanguage("dart", Kk0());
  u1.registerLanguage("delphi", Hk0());
  u1.registerLanguage("diff", Ek0());
  u1.registerLanguage("django", Uk0());
  u1.registerLanguage("dns", wk0());
  u1.registerLanguage("dockerfile", Nk0());
  u1.registerLanguage("dos", Mk0());
  u1.registerLanguage("dsconfig", Rk0());
  u1.registerLanguage("dts", Pk0());
  u1.registerLanguage("dust", Sk0());
  u1.registerLanguage("ebnf", kk0());
  u1.registerLanguage("elixir", xk0());
  u1.registerLanguage("elm", bk0());
  u1.registerLanguage("ruby", gk0());
  u1.registerLanguage("erb", mk0());
  u1.registerLanguage("erlang-repl", ck0());
  u1.registerLanguage("erlang", lk0());
  u1.registerLanguage("excel", nk0());
  u1.registerLanguage("fix", sk0());
  u1.registerLanguage("flix", ok0());
  u1.registerLanguage("fortran", ek0());
  u1.registerLanguage("fsharp", Qy0());
  u1.registerLanguage("gams", Gy0());
  u1.registerLanguage("gauss", Iy0());
  u1.registerLanguage("gcode", Jy0());
  u1.registerLanguage("gherkin", Xy0());
  u1.registerLanguage("glsl", Fy0());
  u1.registerLanguage("gml", Dy0());
  u1.registerLanguage("go", Cy0());
  u1.registerLanguage("golo", zy0());
  u1.registerLanguage("gradle", $y0());
  u1.registerLanguage("groovy", qy0());
  u1.registerLanguage("haml", Ly0());
  u1.registerLanguage("handlebars", Ry0());
  u1.registerLanguage("haskell", Py0());
  u1.registerLanguage("haxe", Sy0());
  u1.registerLanguage("hsp", ky0());
  u1.registerLanguage("htmlbars", vy0());
  u1.registerLanguage("http", fy0());
  u1.registerLanguage("hy", gy0());
  u1.registerLanguage("inform7", my0());
  u1.registerLanguage("ini", ly0());
  u1.registerLanguage("irpf90", ny0());
  u1.registerLanguage("isbl", sy0());
  u1.registerLanguage("java", oy0());
  u1.registerLanguage("javascript", Ax0());
  u1.registerLanguage("jboss-cli", Bx0());
  u1.registerLanguage("json", Zx0());
  u1.registerLanguage("julia", Yx0());
  u1.registerLanguage("julia-repl", Wx0());
  u1.registerLanguage("kotlin", Vx0());
  u1.registerLanguage("lasso", Kx0());
  u1.registerLanguage("latex", Hx0());
  u1.registerLanguage("ldif", Ex0());
  u1.registerLanguage("leaf", Ux0());
  u1.registerLanguage("less", Nx0());
  u1.registerLanguage("lisp", Mx0());
  u1.registerLanguage("livecodeserver", Rx0());
  u1.registerLanguage("livescript", Px0());
  u1.registerLanguage("llvm", Sx0());
  u1.registerLanguage("lsl", kx0());
  u1.registerLanguage("lua", xx0());
  u1.registerLanguage("makefile", bx0());
  u1.registerLanguage("mathematica", mx0());
  u1.registerLanguage("matlab", cx0());
  u1.registerLanguage("maxima", lx0());
  u1.registerLanguage("mel", nx0());
  u1.registerLanguage("mercury", sx0());
  u1.registerLanguage("mipsasm", ox0());
  u1.registerLanguage("mizar", ex0());
  u1.registerLanguage("perl", Gv0());
  u1.registerLanguage("mojolicious", Iv0());
  u1.registerLanguage("monkey", Jv0());
  u1.registerLanguage("moonscript", Xv0());
  u1.registerLanguage("n1ql", Fv0());
  u1.registerLanguage("nginx", Dv0());
  u1.registerLanguage("nim", Cv0());
  u1.registerLanguage("nix", zv0());
  u1.registerLanguage("node-repl", $v0());
  u1.registerLanguage("nsis", qv0());
  u1.registerLanguage("objectivec", Lv0());
  u1.registerLanguage("ocaml", Ov0());
  u1.registerLanguage("openscad", Tv0());
  u1.registerLanguage("oxygene", jv0());
  u1.registerLanguage("parser3", _v0());
  u1.registerLanguage("pf", yv0());
  u1.registerLanguage("pgsql", vv0());
  u1.registerLanguage("php", fv0());
  u1.registerLanguage("php-template", gv0());
  u1.registerLanguage("plaintext", mv0());
  u1.registerLanguage("pony", cv0());
  u1.registerLanguage("powershell", lv0());
  u1.registerLanguage("processing", nv0());
  u1.registerLanguage("profile", sv0());
  u1.registerLanguage("prolog", ov0());
  u1.registerLanguage("properties", ev0());
  u1.registerLanguage("protobuf", Qb0());
  u1.registerLanguage("puppet", Gb0());
  u1.registerLanguage("purebasic", Ib0());
  u1.registerLanguage("python", Jb0());
  u1.registerLanguage("python-repl", Xb0());
  u1.registerLanguage("q", Fb0());
  u1.registerLanguage("qml", Db0());
  u1.registerLanguage("r", Cb0());
  u1.registerLanguage("reasonml", zb0());
  u1.registerLanguage("rib", $b0());
  u1.registerLanguage("roboconf", qb0());
  u1.registerLanguage("routeros", Lb0());
  u1.registerLanguage("rsl", Ob0());
  u1.registerLanguage("ruleslanguage", Tb0());
  u1.registerLanguage("rust", jb0());
  u1.registerLanguage("sas", _b0());
  u1.registerLanguage("scala", yb0());
  u1.registerLanguage("scheme", vb0());
  u1.registerLanguage("scilab", fb0());
  u1.registerLanguage("scss", gb0());
  u1.registerLanguage("shell", mb0());
  u1.registerLanguage("smali", cb0());
  u1.registerLanguage("smalltalk", lb0());
  u1.registerLanguage("sml", nb0());
  u1.registerLanguage("sqf", sb0());
  u1.registerLanguage("sql_more", ob0());
  u1.registerLanguage("sql", Af0());
  u1.registerLanguage("stan", Bf0());
  u1.registerLanguage("stata", Zf0());
  u1.registerLanguage("step21", Yf0());
  u1.registerLanguage("stylus", Wf0());
  u1.registerLanguage("subunit", Vf0());
  u1.registerLanguage("swift", $f0());
  u1.registerLanguage("taggerscript", qf0());
  u1.registerLanguage("yaml", Lf0());
  u1.registerLanguage("tap", Of0());
  u1.registerLanguage("tcl", Pf0());
  u1.registerLanguage("thrift", Sf0());
  u1.registerLanguage("tp", kf0());
  u1.registerLanguage("twig", xf0());
  u1.registerLanguage("typescript", uf0());
  u1.registerLanguage("vala", df0());
  u1.registerLanguage("vbnet", lf0());
  u1.registerLanguage("vbscript", af0());
  u1.registerLanguage("vbscript-html", rf0());
  u1.registerLanguage("verilog", tf0());
  u1.registerLanguage("vhdl", Ah0());
  u1.registerLanguage("vim", Bh0());
  u1.registerLanguage("x86asm", Zh0());
  u1.registerLanguage("xl", Yh0());
  u1.registerLanguage("xquery", Wh0());
  u1.registerLanguage("zephir", Vh0());
  Fh0.exports = u1
})
// @from(Start 1415592, End 1416521)
class Kh0 {
  cache = new Map;
  maxCacheSize = 1000;
  readFile(A) {
    let Q = RA(),
      B;
    try {
      B = Q.statSync(A)
    } catch (J) {
      throw this.cache.delete(A), J
    }
    let G = A,
      Z = this.cache.get(G);
    if (Z && Z.mtime === B.mtimeMs) return {
      content: Z.content,
      encoding: Z.encoding
    };
    let I = CH(A),
      Y = Q.readFileSync(A, {
        encoding: I
      }).replaceAll(`\r
`, `
`);
    if (this.cache.set(G, {
        content: Y,
        encoding: I,
        mtime: B.mtimeMs
      }), this.cache.size > this.maxCacheSize) {
      let J = this.cache.keys().next().value;
      if (J) this.cache.delete(J)
    }
    return {
      content: Y,
      encoding: I
    }
  }
  clear() {
    this.cache.clear()
  }
  invalidate(A) {
    this.cache.delete(A)
  }
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}
// @from(Start 1416526, End 1416529)
Dh0
// @from(Start 1416535, End 1416585)
Hh0 = L(() => {
  AQ();
  R9();
  Dh0 = new Kh0
})
// @from(Start 1416591, End 1417070)
Eh0 = z((m47, Ch0) => {
  Ch0.exports = function(Q) {
    return Q.map(function(B) {
      if (B === "") return "''";
      if (B && typeof B === "object") return B.op.replace(/(.)/g, "\\$1");
      if (/["\s\\]/.test(B) && !/'/.test(B)) return "'" + B.replace(/(['])/g, "\\$1") + "'";
      if (/["'\s]/.test(B)) return '"' + B.replace(/(["\\$`!])/g, "\\$1") + '"';
      return String(B).replace(/([A-Za-z]:)?([#!"$&'()*,:;<=>?@[\\\]^`{|}])/g, "$1\\$2")
    }).join(" ")
  }
})
// @from(Start 1417076, End 1420626)
Lh0 = z((d47, Nh0) => {
  var qh0 = "(?:" + ["\\|\\|", "\\&\\&", ";;", "\\|\\&", "\\<\\(", "\\<\\<\\<", ">>", ">\\&", "<\\&", "[&;()|<>]"].join("|") + ")",
    zh0 = new RegExp("^" + qh0 + "$"),
    Uh0 = "|&;()<> \\t",
    TQ4 = '"((\\\\"|[^"])*?)"',
    PQ4 = "'((\\\\'|[^'])*?)'",
    jQ4 = /^#$/,
    $h0 = "'",
    wh0 = '"',
    oD1 = "$",
    ps = "",
    SQ4 = 4294967296;
  for (BxA = 0; BxA < 4; BxA++) ps += (SQ4 * Math.random()).toString(16);
  var BxA, _Q4 = new RegExp("^" + ps);

  function kQ4(A, Q) {
    var B = Q.lastIndex,
      G = [],
      Z;
    while (Z = Q.exec(A))
      if (G.push(Z), Q.lastIndex === Z.index) Q.lastIndex += 1;
    return Q.lastIndex = B, G
  }

  function yQ4(A, Q, B) {
    var G = typeof A === "function" ? A(B) : A[B];
    if (typeof G > "u" && B != "") G = "";
    else if (typeof G > "u") G = "$";
    if (typeof G === "object") return Q + ps + JSON.stringify(G) + ps;
    return Q + G
  }

  function xQ4(A, Q, B) {
    if (!B) B = {};
    var G = B.escape || "\\",
      Z = "(\\" + G + `['"` + Uh0 + `]|[^\\s'"` + Uh0 + "])+",
      I = new RegExp(["(" + qh0 + ")", "(" + Z + "|" + TQ4 + "|" + PQ4 + ")+"].join("|"), "g"),
      Y = kQ4(A, I);
    if (Y.length === 0) return [];
    if (!Q) Q = {};
    var J = !1;
    return Y.map(function(W) {
      var X = W[0];
      if (!X || J) return;
      if (zh0.test(X)) return {
        op: X
      };
      var V = !1,
        F = !1,
        K = "",
        D = !1,
        H;

      function C() {
        H += 1;
        var q, w, N = X.charAt(H);
        if (N === "{") {
          if (H += 1, X.charAt(H) === "}") throw Error("Bad substitution: " + X.slice(H - 2, H + 1));
          if (q = X.indexOf("}", H), q < 0) throw Error("Bad substitution: " + X.slice(H));
          w = X.slice(H, q), H = q
        } else if (/[*@#?$!_-]/.test(N)) w = N, H += 1;
        else {
          var R = X.slice(H);
          if (q = R.match(/[^\w\d_]/), !q) w = R, H = X.length;
          else w = R.slice(0, q.index), H += q.index - 1
        }
        return yQ4(Q, "", w)
      }
      for (H = 0; H < X.length; H++) {
        var E = X.charAt(H);
        if (D = D || !V && (E === "*" || E === "?"), F) K += E, F = !1;
        else if (V)
          if (E === V) V = !1;
          else if (V == $h0) K += E;
        else if (E === G)
          if (H += 1, E = X.charAt(H), E === wh0 || E === G || E === oD1) K += E;
          else K += G + E;
        else if (E === oD1) K += C();
        else K += E;
        else if (E === wh0 || E === $h0) V = E;
        else if (zh0.test(E)) return {
          op: X
        };
        else if (jQ4.test(E)) {
          J = !0;
          var U = {
            comment: A.slice(W.index + H + 1)
          };
          if (K.length) return [K, U];
          return [U]
        } else if (E === G) F = !0;
        else if (E === oD1) K += C();
        else K += E
      }
      if (D) return {
        op: "glob",
        pattern: K
      };
      return K
    }).reduce(function(W, X) {
      return typeof X > "u" ? W : W.concat(X)
    }, [])
  }
  Nh0.exports = function(Q, B, G) {
    var Z = xQ4(Q, B, G);
    if (typeof B !== "function") return Z;
    return Z.reduce(function(I, Y) {
      if (typeof Y === "object") return I.concat(Y);
      var J = Y.split(RegExp("(" + ps + ".*?" + ps + ")", "g"));
      if (J.length === 1) return I.concat(J[0]);
      return I.concat(J.filter(Boolean).map(function(W) {
        if (_Q4.test(W)) return JSON.parse(W.split(ps)[1]);
        return W
      }))
    }, [])
  }
})
// @from(Start 1420632, End 1420694)
GxA = z((vQ4) => {
  vQ4.quote = Eh0();
  vQ4.parse = Lh0()
})
// @from(Start 1420697, End 1420999)
function JW(A, Q) {
  try {
    return {
      success: !0,
      tokens: typeof Q === "function" ? K9A.parse(A, Q) : K9A.parse(A, Q)
    }
  } catch (B) {
    if (B instanceof Error) AA(B);
    return {
      success: !1,
      error: B instanceof Error ? B.message : "Unknown parse error"
    }
  }
}
// @from(Start 1421001, End 1421888)
function hQ4(A) {
  try {
    let Q = A.map((G, Z) => {
      if (G === null || G === void 0) return String(G);
      let I = typeof G;
      if (I === "string") return G;
      if (I === "number" || I === "boolean") return String(G);
      if (I === "object") throw Error(`Cannot quote argument at index ${Z}: object values are not supported`);
      if (I === "symbol") throw Error(`Cannot quote argument at index ${Z}: symbol values are not supported`);
      if (I === "function") throw Error(`Cannot quote argument at index ${Z}: function values are not supported`);
      throw Error(`Cannot quote argument at index ${Z}: unsupported type ${I}`)
    });
    return {
      success: !0,
      quoted: K9A.quote(Q)
    }
  } catch (Q) {
    if (Q instanceof Error) AA(Q);
    return {
      success: !1,
      error: Q instanceof Error ? Q.message : "Unknown quote error"
    }
  }
}
// @from(Start 1421890, End 1422337)
function z8(A) {
  let Q = hQ4([...A]);
  if (Q.success) return Q.quoted;
  try {
    let B = A.map((G) => {
      if (G === null || G === void 0) return String(G);
      let Z = typeof G;
      if (Z === "string" || Z === "number" || Z === "boolean") return String(G);
      return JSON.stringify(G)
    });
    return K9A.quote(B)
  } catch (B) {
    if (B instanceof Error) AA(B);
    throw Error("Failed to quote shell arguments safely")
  }
}
// @from(Start 1422342, End 1422345)
K9A
// @from(Start 1422351, End 1422397)
dK = L(() => {
  g1();
  K9A = BA(GxA(), 1)
})
// @from(Start 1422530, End 1422649)
function tD1(A) {
  try {
    return ZxA(`dir "${A}"`, {
      stdio: "pipe"
    }), !0
  } catch {
    return !1
  }
}
// @from(Start 1422651, End 1423332)
function gQ4(A) {
  if (A === "git") {
    let Q = ["C:\\Program Files\\Git\\cmd\\git.exe", "C:\\Program Files (x86)\\Git\\cmd\\git.exe"];
    for (let B of Q)
      if (tD1(B)) return B
  }
  try {
    let B = ZxA(`where.exe ${A}`, {
        stdio: "pipe",
        encoding: "utf8"
      }).trim().split(`\r
`).filter(Boolean),
      G = W0().toLowerCase();
    for (let Z of B) {
      let I = D9A.resolve(Z).toLowerCase();
      if (D9A.dirname(I).toLowerCase() === G || I.startsWith(G + D9A.sep)) {
        g(`Skipping potentially malicious executable in current directory: ${Z}`);
        continue
      }
      return Z
    }
    return null
  } catch {
    return null
  }
}
// @from(Start 1423337, End 1423469)
Oh0 = () => {
    if (dQ() === "windows") {
      let A = eD1();
      process.env.SHELL = A, g(`Using bash path: "${A}"`)
    }
  }
// @from(Start 1423473, End 1423476)
eD1
// @from(Start 1423478, End 1423596)
rj = (A) => {
    let Q = z8([A]);
    return ZxA(`cygpath -u ${Q}`, {
      shell: eD1()
    }).toString().trim()
  }
// @from(Start 1423600, End 1423719)
Rh0 = (A) => {
    let Q = z8([A]);
    return ZxA(`cygpath -w ${Q}`, {
      shell: eD1()
    }).toString().trim()
  }
// @from(Start 1423725, End 1424509)
H9A = L(() => {
  l2();
  dK();
  Q3();
  V0();
  U2();
  eD1 = s1(() => {
    if (process.env.CLAUDE_CODE_GIT_BASH_PATH) {
      if (tD1(process.env.CLAUDE_CODE_GIT_BASH_PATH)) return process.env.CLAUDE_CODE_GIT_BASH_PATH;
      console.error(`Claude Code was unable to find CLAUDE_CODE_GIT_BASH_PATH path "${process.env.CLAUDE_CODE_GIT_BASH_PATH}"`), process.exit(1)
    }
    let A = gQ4("git");
    if (A) {
      let Q = Mh0.join(A, "..", "..", "bin", "bash.exe");
      if (tD1(Q)) return Q
    }
    console.error("Claude Code on Windows requires git-bash (https://git-scm.com/downloads/win). If installed but not in PATH, set environment variable pointing to your bash.exe, similar to: CLAUDE_CODE_GIT_BASH_PATH=C:\\Program Files\\Git\\bin\\bash.exe"), process.exit(1)
  })
})
// @from(Start 1424666, End 1425300)
function b9(A, Q) {
  let B = Q ?? W0() ?? RA().cwd();
  if (typeof A !== "string") throw TypeError(`Path must be a string, received ${typeof A}`);
  if (typeof B !== "string") throw TypeError(`Base directory must be a string, received ${typeof B}`);
  if (A.includes("\x00") || B.includes("\x00")) throw Error("Path contains null bytes");
  let G = A.trim();
  if (!G) return Ph0(B);
  if (G === "~") return Th0();
  if (G.startsWith("~/")) return mQ4(Th0(), G.slice(2));
  let Z = G;
  if (dQ() === "windows" && G.match(/^\/[a-z]\//i)) try {
    Z = Rh0(G)
  } catch {
    Z = G
  }
  if (uQ4(Z)) return Ph0(Z);
  return dQ4(B, Z)
}
// @from(Start 1425302, End 1425423)
function Zv(A) {
  let Q = b9(A);
  try {
    if (RA().statSync(Q).isDirectory()) return Q
  } catch {}
  return cQ4(Q)
}
// @from(Start 1425425, End 1425490)
function C9A(A) {
  return /(?:^|[\\/])\.\.(?:[\\/]|$)/.test(A)
}
// @from(Start 1425495, End 1425544)
yI = L(() => {
  U2();
  AQ();
  Q3();
  H9A()
})
// @from(Start 1425547, End 1425633)
function pQ4(A) {
  var Q = A == null ? 0 : A.length;
  return Q ? A[Q - 1] : void 0
}
// @from(Start 1425638, End 1425640)
dC
// @from(Start 1425646, End 1425675)
E9A = L(() => {
  dC = pQ4
})
// @from(Start 1425710, End 1426151)
function AH1() {
  let {
    env: A
  } = jh0, {
    TERM: Q,
    TERM_PROGRAM: B
  } = A;
  if (jh0.platform !== "win32") return Q !== "linux";
  return Boolean(A.WT_SESSION) || Boolean(A.TERMINUS_SUBLIME) || A.ConEmuTask === "{cmd::Cmder}" || B === "Terminus-Sublime" || B === "vscode" || Q === "xterm-256color" || Q === "alacritty" || Q === "rxvt-unicode" || Q === "rxvt-unicode-256color" || A.TERMINAL_EMULATOR === "JetBrains-JediTerm"
}
// @from(Start 1426156, End 1426170)
Sh0 = () => {}
// @from(Start 1426176, End 1426179)
_h0
// @from(Start 1426181, End 1426184)
kh0
// @from(Start 1426186, End 1426189)
lQ4
// @from(Start 1426191, End 1426194)
iQ4
// @from(Start 1426196, End 1426199)
nQ4
// @from(Start 1426201, End 1426204)
aQ4
// @from(Start 1426206, End 1426209)
sQ4
// @from(Start 1426211, End 1426213)
H1
// @from(Start 1426215, End 1426218)
V87
// @from(Start 1426224, End 1433291)
V9 = L(() => {
  Sh0();
  _h0 = {
    circleQuestionMark: "(?)",
    questionMarkPrefix: "(?)",
    square: "█",
    squareDarkShade: "▓",
    squareMediumShade: "▒",
    squareLightShade: "░",
    squareTop: "▀",
    squareBottom: "▄",
    squareLeft: "▌",
    squareRight: "▐",
    squareCenter: "■",
    bullet: "●",
    dot: "․",
    ellipsis: "…",
    pointerSmall: "›",
    triangleUp: "▲",
    triangleUpSmall: "▴",
    triangleDown: "▼",
    triangleDownSmall: "▾",
    triangleLeftSmall: "◂",
    triangleRightSmall: "▸",
    home: "⌂",
    heart: "♥",
    musicNote: "♪",
    musicNoteBeamed: "♫",
    arrowUp: "↑",
    arrowDown: "↓",
    arrowLeft: "←",
    arrowRight: "→",
    arrowLeftRight: "↔",
    arrowUpDown: "↕",
    almostEqual: "≈",
    notEqual: "≠",
    lessOrEqual: "≤",
    greaterOrEqual: "≥",
    identical: "≡",
    infinity: "∞",
    subscriptZero: "₀",
    subscriptOne: "₁",
    subscriptTwo: "₂",
    subscriptThree: "₃",
    subscriptFour: "₄",
    subscriptFive: "₅",
    subscriptSix: "₆",
    subscriptSeven: "₇",
    subscriptEight: "₈",
    subscriptNine: "₉",
    oneHalf: "½",
    oneThird: "⅓",
    oneQuarter: "¼",
    oneFifth: "⅕",
    oneSixth: "⅙",
    oneEighth: "⅛",
    twoThirds: "⅔",
    twoFifths: "⅖",
    threeQuarters: "¾",
    threeFifths: "⅗",
    threeEighths: "⅜",
    fourFifths: "⅘",
    fiveSixths: "⅚",
    fiveEighths: "⅝",
    sevenEighths: "⅞",
    line: "─",
    lineBold: "━",
    lineDouble: "═",
    lineDashed0: "┄",
    lineDashed1: "┅",
    lineDashed2: "┈",
    lineDashed3: "┉",
    lineDashed4: "╌",
    lineDashed5: "╍",
    lineDashed6: "╴",
    lineDashed7: "╶",
    lineDashed8: "╸",
    lineDashed9: "╺",
    lineDashed10: "╼",
    lineDashed11: "╾",
    lineDashed12: "−",
    lineDashed13: "–",
    lineDashed14: "‐",
    lineDashed15: "⁃",
    lineVertical: "│",
    lineVerticalBold: "┃",
    lineVerticalDouble: "║",
    lineVerticalDashed0: "┆",
    lineVerticalDashed1: "┇",
    lineVerticalDashed2: "┊",
    lineVerticalDashed3: "┋",
    lineVerticalDashed4: "╎",
    lineVerticalDashed5: "╏",
    lineVerticalDashed6: "╵",
    lineVerticalDashed7: "╷",
    lineVerticalDashed8: "╹",
    lineVerticalDashed9: "╻",
    lineVerticalDashed10: "╽",
    lineVerticalDashed11: "╿",
    lineDownLeft: "┐",
    lineDownLeftArc: "╮",
    lineDownBoldLeftBold: "┓",
    lineDownBoldLeft: "┒",
    lineDownLeftBold: "┑",
    lineDownDoubleLeftDouble: "╗",
    lineDownDoubleLeft: "╖",
    lineDownLeftDouble: "╕",
    lineDownRight: "┌",
    lineDownRightArc: "╭",
    lineDownBoldRightBold: "┏",
    lineDownBoldRight: "┎",
    lineDownRightBold: "┍",
    lineDownDoubleRightDouble: "╔",
    lineDownDoubleRight: "╓",
    lineDownRightDouble: "╒",
    lineUpLeft: "┘",
    lineUpLeftArc: "╯",
    lineUpBoldLeftBold: "┛",
    lineUpBoldLeft: "┚",
    lineUpLeftBold: "┙",
    lineUpDoubleLeftDouble: "╝",
    lineUpDoubleLeft: "╜",
    lineUpLeftDouble: "╛",
    lineUpRight: "└",
    lineUpRightArc: "╰",
    lineUpBoldRightBold: "┗",
    lineUpBoldRight: "┖",
    lineUpRightBold: "┕",
    lineUpDoubleRightDouble: "╚",
    lineUpDoubleRight: "╙",
    lineUpRightDouble: "╘",
    lineUpDownLeft: "┤",
    lineUpBoldDownBoldLeftBold: "┫",
    lineUpBoldDownBoldLeft: "┨",
    lineUpDownLeftBold: "┥",
    lineUpBoldDownLeftBold: "┩",
    lineUpDownBoldLeftBold: "┪",
    lineUpDownBoldLeft: "┧",
    lineUpBoldDownLeft: "┦",
    lineUpDoubleDownDoubleLeftDouble: "╣",
    lineUpDoubleDownDoubleLeft: "╢",
    lineUpDownLeftDouble: "╡",
    lineUpDownRight: "├",
    lineUpBoldDownBoldRightBold: "┣",
    lineUpBoldDownBoldRight: "┠",
    lineUpDownRightBold: "┝",
    lineUpBoldDownRightBold: "┡",
    lineUpDownBoldRightBold: "┢",
    lineUpDownBoldRight: "┟",
    lineUpBoldDownRight: "┞",
    lineUpDoubleDownDoubleRightDouble: "╠",
    lineUpDoubleDownDoubleRight: "╟",
    lineUpDownRightDouble: "╞",
    lineDownLeftRight: "┬",
    lineDownBoldLeftBoldRightBold: "┳",
    lineDownLeftBoldRightBold: "┯",
    lineDownBoldLeftRight: "┰",
    lineDownBoldLeftBoldRight: "┱",
    lineDownBoldLeftRightBold: "┲",
    lineDownLeftRightBold: "┮",
    lineDownLeftBoldRight: "┭",
    lineDownDoubleLeftDoubleRightDouble: "╦",
    lineDownDoubleLeftRight: "╥",
    lineDownLeftDoubleRightDouble: "╤",
    lineUpLeftRight: "┴",
    lineUpBoldLeftBoldRightBold: "┻",
    lineUpLeftBoldRightBold: "┷",
    lineUpBoldLeftRight: "┸",
    lineUpBoldLeftBoldRight: "┹",
    lineUpBoldLeftRightBold: "┺",
    lineUpLeftRightBold: "┶",
    lineUpLeftBoldRight: "┵",
    lineUpDoubleLeftDoubleRightDouble: "╩",
    lineUpDoubleLeftRight: "╨",
    lineUpLeftDoubleRightDouble: "╧",
    lineUpDownLeftRight: "┼",
    lineUpBoldDownBoldLeftBoldRightBold: "╋",
    lineUpDownBoldLeftBoldRightBold: "╈",
    lineUpBoldDownLeftBoldRightBold: "╇",
    lineUpBoldDownBoldLeftRightBold: "╊",
    lineUpBoldDownBoldLeftBoldRight: "╉",
    lineUpBoldDownLeftRight: "╀",
    lineUpDownBoldLeftRight: "╁",
    lineUpDownLeftBoldRight: "┽",
    lineUpDownLeftRightBold: "┾",
    lineUpBoldDownBoldLeftRight: "╂",
    lineUpDownLeftBoldRightBold: "┿",
    lineUpBoldDownLeftBoldRight: "╃",
    lineUpBoldDownLeftRightBold: "╄",
    lineUpDownBoldLeftBoldRight: "╅",
    lineUpDownBoldLeftRightBold: "╆",
    lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
    lineUpDoubleDownDoubleLeftRight: "╫",
    lineUpDownLeftDoubleRightDouble: "╪",
    lineCross: "╳",
    lineBackslash: "╲",
    lineSlash: "╱"
  }, kh0 = {
    tick: "✔",
    info: "ℹ",
    warning: "⚠",
    cross: "✘",
    squareSmall: "◻",
    squareSmallFilled: "◼",
    circle: "◯",
    circleFilled: "◉",
    circleDotted: "◌",
    circleDouble: "◎",
    circleCircle: "ⓞ",
    circleCross: "ⓧ",
    circlePipe: "Ⓘ",
    radioOn: "◉",
    radioOff: "◯",
    checkboxOn: "☒",
    checkboxOff: "☐",
    checkboxCircleOn: "ⓧ",
    checkboxCircleOff: "Ⓘ",
    pointer: "❯",
    triangleUpOutline: "△",
    triangleLeft: "◀",
    triangleRight: "▶",
    lozenge: "◆",
    lozengeOutline: "◇",
    hamburger: "☰",
    smiley: "㋡",
    mustache: "෴",
    star: "★",
    play: "▶",
    nodejs: "⬢",
    oneSeventh: "⅐",
    oneNinth: "⅑",
    oneTenth: "⅒"
  }, lQ4 = {
    tick: "√",
    info: "i",
    warning: "‼",
    cross: "×",
    squareSmall: "□",
    squareSmallFilled: "■",
    circle: "( )",
    circleFilled: "(*)",
    circleDotted: "( )",
    circleDouble: "( )",
    circleCircle: "(○)",
    circleCross: "(×)",
    circlePipe: "(│)",
    radioOn: "(*)",
    radioOff: "( )",
    checkboxOn: "[×]",
    checkboxOff: "[ ]",
    checkboxCircleOn: "(×)",
    checkboxCircleOff: "( )",
    pointer: ">",
    triangleUpOutline: "∆",
    triangleLeft: "◄",
    triangleRight: "►",
    lozenge: "♦",
    lozengeOutline: "◊",
    hamburger: "≡",
    smiley: "☺",
    mustache: "┌─┐",
    star: "✶",
    play: "►",
    nodejs: "♦",
    oneSeventh: "1/7",
    oneNinth: "1/9",
    oneTenth: "1/10"
  }, iQ4 = {
    ..._h0,
    ...kh0
  }, nQ4 = {
    ..._h0,
    ...lQ4
  }, aQ4 = AH1(), sQ4 = aQ4 ? iQ4 : nQ4, H1 = sQ4, V87 = Object.entries(kh0)
})
// @from(Start 1433294, End 1433804)
function NV(A) {
  let Q = /^---\s*\n([\s\S]*?)---\s*\n?/,
    B = A.match(Q);
  if (!B) return {
    frontmatter: {},
    content: A
  };
  let G = B[1] || "",
    Z = A.slice(B[0].length),
    I = {},
    Y = G.split(`
`);
  for (let J of Y) {
    let W = J.indexOf(":");
    if (W > 0) {
      let X = J.slice(0, W).trim(),
        V = J.slice(W + 1).trim();
      if (X) {
        let F = V.replace(/^["']|["']$/g, "");
        I[X] = F
      }
    }
  }
  return {
    frontmatter: I,
    content: Z
  }
}
// @from(Start 1433806, End 1434210)
function yh0(A) {
  let Q = [],
    B = "",
    G = 0;
  for (let I = 0; I < A.length; I++) {
    let Y = A[I];
    if (Y === "{") G++, B += Y;
    else if (Y === "}") G--, B += Y;
    else if (Y === "," && G === 0) {
      let J = B.trim();
      if (J) Q.push(J);
      B = ""
    } else B += Y
  }
  let Z = B.trim();
  if (Z) Q.push(Z);
  return Q.filter((I) => I.length > 0).flatMap((I) => xh0(I))
}
// @from(Start 1434212, End 1434511)
function xh0(A) {
  let Q = A.match(/^([^{]*)\{([^}]+)\}(.*)$/);
  if (!Q) return [A];
  let B = Q[1] || "",
    G = Q[2] || "",
    Z = Q[3] || "",
    I = G.split(",").map((J) => J.trim()),
    Y = [];
  for (let J of I) {
    let W = B + J + Z,
      X = xh0(W);
    Y.push(...X)
  }
  return Y
}
// @from(Start 1434513, End 1434810)
function Pm(A) {
  switch (A) {
    case "userSettings":
      return "user";
    case "projectSettings":
      return "project";
    case "localSettings":
      return "project, gitignored";
    case "flagSettings":
      return "cli flag";
    case "policySettings":
      return "managed"
  }
}
// @from(Start 1434812, End 1435254)
function vh0(A) {
  if (A === "") return [];
  let Q = A.split(",").map((G) => G.trim()),
    B = [];
  for (let G of Q) switch (G) {
    case "user":
      B.push("userSettings");
      break;
    case "project":
      B.push("projectSettings");
      break;
    case "local":
      B.push("localSettings");
      break;
    default:
      throw Error(`Invalid setting source: ${G}. Valid options are: user, project, local`)
  }
  return B
}
// @from(Start 1435256, End 1435381)
function ls() {
  let A = Qz0(),
    Q = new Set(A);
  return Q.add("policySettings"), Q.add("flagSettings"), Array.from(Q)
}
// @from(Start 1435383, End 1435427)
function EH(A) {
  return ls().includes(A)
}
// @from(Start 1435432, End 1435434)
iN
// @from(Start 1435436, End 1435498)
bh0 = "https://json.schemastore.org/claude-code-settings.json"
// @from(Start 1435504, End 1435623)
LV = L(() => {
  _0();
  iN = ["userSettings", "projectSettings", "localSettings", "flagSettings", "policySettings"]
})
// @from(Start 1435626, End 1435908)
function oQ4(A, Q) {
  if (!A || !A.permissions) return [];
  let {
    permissions: B
  } = A, G = [];
  for (let Z of rQ4) {
    let I = B[Z];
    if (I)
      for (let Y of I) G.push({
        source: Q,
        ruleBehavior: Z,
        ruleValue: nN(Y)
      })
  }
  return G
}
// @from(Start 1435910, End 1435994)
function IxA() {
  let A = [];
  for (let Q of ls()) A.push(...YxA(Q));
  return A
}
// @from(Start 1435996, End 1436051)
function YxA(A) {
  let Q = OB(A);
  return oQ4(Q, A)
}
// @from(Start 1436053, End 1436568)
function fh0(A) {
  let Q = B3(A.ruleValue),
    B = OB(A.source);
  if (!B || !B.permissions) return !1;
  let G = B.permissions[A.ruleBehavior];
  if (!G || !G.includes(Q)) return !1;
  try {
    let Z = {
        ...B,
        permissions: {
          ...B.permissions,
          [A.ruleBehavior]: G.filter((Y) => Y !== Q)
        }
      },
      {
        error: I
      } = cB(A.source, Z);
    if (I) return !1;
    return !0
  } catch (Z) {
    return AA(Z instanceof Error ? Z : Error(String(Z))), !1
  }
}
// @from(Start 1436570, End 1436675)
function tQ4() {
  return {
    permissions: {
      allow: [],
      deny: [],
      ask: []
    }
  }
}
// @from(Start 1436677, End 1437231)
function JxA({
  ruleValues: A,
  ruleBehavior: Q
}, B) {
  if (A.length < 1) return !0;
  let G = A.map(B3),
    Z = OB(B) || tQ4();
  try {
    let I = Z.permissions || {},
      Y = I[Q] || [],
      J = new Set(Y),
      W = G.filter((F) => !J.has(F));
    if (W.length === 0) return !0;
    let X = {
        ...Z,
        permissions: {
          ...I,
          [Q]: [...Y, ...W]
        }
      },
      V = cB(B, X);
    if (V.error) throw V.error;
    return !0
  } catch (I) {
    return AA(I instanceof Error ? I : Error(String(I))), !1
  }
}
// @from(Start 1437236, End 1437239)
rQ4
// @from(Start 1437245, End 1437327)
is = L(() => {
  g1();
  AZ();
  LV();
  MB();
  rQ4 = ["allow", "deny", "ask"]
})
// @from(Start 1437369, End 1437550)
function z9A(A) {
  if (!A) return [];
  return A.flatMap((Q) => {
    switch (Q.type) {
      case "addRules":
        return Q.rules;
      default:
        return []
    }
  })
}
// @from(Start 1437552, End 1440064)
function UF(A, Q) {
  switch (Q.type) {
    case "setMode":
      return g(`Applying permission update: Setting mode to '${Q.mode}'`), {
        ...A,
        mode: Q.mode
      };
    case "addRules": {
      let B = Q.rules.map((Z) => B3(Z));
      g(`Applying permission update: Adding ${Q.rules.length} ${Q.behavior} rule(s) to destination '${Q.destination}': ${JSON.stringify(B)}`);
      let G = Q.behavior === "allow" ? "alwaysAllowRules" : Q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
      return {
        ...A,
        [G]: {
          ...A[G],
          [Q.destination]: [...A[G][Q.destination] || [], ...B]
        }
      }
    }
    case "replaceRules": {
      let B = Q.rules.map((Z) => B3(Z));
      g(`Replacing all ${Q.behavior} rules for destination '${Q.destination}' with ${Q.rules.length} rule(s): ${JSON.stringify(B)}`);
      let G = Q.behavior === "allow" ? "alwaysAllowRules" : Q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules";
      return {
        ...A,
        [G]: {
          ...A[G],
          [Q.destination]: B
        }
      }
    }
    case "addDirectories": {
      g(`Applying permission update: Adding ${Q.directories.length} director${Q.directories.length===1?"y":"ies"} with destination '${Q.destination}': ${JSON.stringify(Q.directories)}`);
      let B = new Map(A.additionalWorkingDirectories);
      for (let G of Q.directories) B.set(G, {
        path: G,
        source: Q.destination
      });
      return {
        ...A,
        additionalWorkingDirectories: B
      }
    }
    case "removeRules": {
      let B = Q.rules.map((J) => B3(J));
      g(`Applying permission update: Removing ${Q.rules.length} ${Q.behavior} rule(s) from source '${Q.destination}': ${JSON.stringify(B)}`);
      let G = Q.behavior === "allow" ? "alwaysAllowRules" : Q.behavior === "deny" ? "alwaysDenyRules" : "alwaysAskRules",
        Z = A[G][Q.destination] || [],
        I = new Set(B),
        Y = Z.filter((J) => !I.has(J));
      return {
        ...A,
        [G]: {
          ...A[G],
          [Q.destination]: Y
        }
      }
    }
    case "removeDirectories": {
      g(`Applying permission update: Removing ${Q.directories.length} director${Q.directories.length===1?"y":"ies"}: ${JSON.stringify(Q.directories)}`);
      let B = new Map(A.additionalWorkingDirectories);
      for (let G of Q.directories) B.delete(G);
      return {
        ...A,
        additionalWorkingDirectories: B
      }
    }
    default:
      return A
  }
}
// @from(Start 1440066, End 1440144)
function jm(A, Q) {
  let B = A;
  for (let G of Q) B = UF(B, G);
  return B
}
// @from(Start 1440146, End 1440247)
function WxA(A) {
  return A === "localSettings" || A === "userSettings" || A === "projectSettings"
}
// @from(Start 1440249, End 1442338)
function Iv(A) {
  if (!WxA(A.destination)) return;
  switch (g(`Persisting permission update: ${A.type} to source '${A.destination}'`), A.type) {
    case "addRules": {
      g(`Persisting ${A.rules.length} ${A.behavior} rule(s) to ${A.destination}`), JxA({
        ruleValues: A.rules,
        ruleBehavior: A.behavior
      }, A.destination);
      break
    }
    case "addDirectories": {
      g(`Persisting ${A.directories.length} director${A.directories.length===1?"y":"ies"} to ${A.destination}`);
      let B = OB(A.destination)?.permissions?.additionalDirectories || [],
        G = A.directories.filter((Z) => !B.includes(Z));
      if (G.length > 0) {
        let Z = [...B, ...G];
        cB(A.destination, {
          permissions: {
            additionalDirectories: Z
          }
        })
      }
      break
    }
    case "removeRules": {
      g(`Removing ${A.rules.length} ${A.behavior} rule(s) from ${A.destination}`);
      let G = (OB(A.destination)?.permissions || {})[A.behavior] || [],
        Z = new Set(A.rules.map(B3)),
        I = G.filter((Y) => !Z.has(Y));
      cB(A.destination, {
        permissions: {
          [A.behavior]: I
        }
      });
      break
    }
    case "removeDirectories": {
      g(`Removing ${A.directories.length} director${A.directories.length===1?"y":"ies"} from ${A.destination}`);
      let B = OB(A.destination)?.permissions?.additionalDirectories || [],
        G = new Set(A.directories),
        Z = B.filter((I) => !G.has(I));
      cB(A.destination, {
        permissions: {
          additionalDirectories: Z
        }
      });
      break
    }
    case "setMode": {
      g(`Persisting mode '${A.mode}' to ${A.destination}`), cB(A.destination, {
        permissions: {
          defaultMode: A.mode
        }
      });
      break
    }
    case "replaceRules": {
      g(`Replacing all ${A.behavior} rules in ${A.destination} with ${A.rules.length} rule(s)`);
      let Q = A.rules.map(B3);
      cB(A.destination, {
        permissions: {
          [A.behavior]: Q
        }
      });
      break
    }
  }
}
// @from(Start 1442340, End 1442384)
function QKA(A) {
  for (let Q of A) Iv(Q)
}
// @from(Start 1442386, End 1442772)
function XxA(A, Q = "session") {
  try {
    if (RA().statSync(A).isDirectory()) {
      let G = VxA(A);
      if (G === "/") return;
      return {
        type: "addRules",
        rules: [{
          toolName: "Read",
          ruleContent: eQ4.isAbsolute(G) ? `/${G}/**` : `${G}/**`
        }],
        behavior: "allow",
        destination: Q
      }
    }
  } catch {}
  return
}
// @from(Start 1442777, End 1442841)
cK = L(() => {
  AZ();
  V0();
  MB();
  is();
  AQ();
  EJ()
})
// @from(Start 1442844, End 1442913)
function GKA(A, Q) {
  return A instanceof Error && A.message === Q
}
// @from(Start 1442918, End 1442921)
BKA
// @from(Start 1442923, End 1442925)
oj
// @from(Start 1442927, End 1442929)
WW
// @from(Start 1442931, End 1442933)
mz
// @from(Start 1442935, End 1442937)
tj
// @from(Start 1442939, End 1442941)
XI
// @from(Start 1442947, End 1443897)
RZ = L(() => {
  BKA = class BKA extends Error {
    constructor(A) {
      super(A);
      this.name = this.constructor.name
    }
  };
  oj = class oj extends Error {};
  WW = class WW extends Error {
    constructor(A) {
      super(A);
      this.name = "AbortError"
    }
  };
  mz = class mz extends Error {
    filePath;
    defaultConfig;
    constructor(A, Q, B) {
      super(A);
      this.name = "ConfigParseError", this.filePath = Q, this.defaultConfig = B
    }
  };
  tj = class tj extends Error {
    stdout;
    stderr;
    code;
    interrupted;
    constructor(A, Q, B, G) {
      super("Shell command failed");
      this.stdout = A;
      this.stderr = Q;
      this.code = B;
      this.interrupted = G;
      this.name = "ShellError"
    }
  };
  XI = class XI extends Error {
    formattedMessage;
    constructor(A, Q) {
      super(A);
      this.formattedMessage = Q;
      this.name = "TeleportOperationError"
    }
  }
})
// @from(Start 1443903, End 1443914)
C9 = "Bash"
// @from(Start 1443917, End 1444225)
function kQ(A, Q) {
  if (!process.env.SRT_DEBUG) return;
  let B = Q?.level || "info",
    G = "[SandboxDebug]";
  switch (B) {
    case "error":
      console.error(`${G} ${A}`);
      break;
    case "warn":
      console.warn(`${G} ${A}`);
      break;
    default:
      console.error(`${G} ${A}`)
  }
}
// @from(Start 1444457, End 1447122)
function hh0(A) {
  let Q = AB4();
  return Q.on("connect", async (B, G) => {
    G.on("error", (Z) => {
      kQ(`Client socket error: ${Z.message}`, {
        level: "error"
      })
    });
    try {
      let [Z, I] = B.url.split(":"), Y = I === void 0 ? void 0 : parseInt(I, 10);
      if (!Z || !Y) {
        kQ(`Invalid CONNECT request: ${B.url}`, {
          level: "error"
        }), G.end(`HTTP/1.1 400 Bad Request\r
\r
`);
        return
      }
      if (!await A.filter(Y, Z, G)) {
        kQ(`Connection blocked to ${Z}:${Y}`, {
          level: "error"
        }), G.end(`HTTP/1.1 403 Forbidden\r
Content-Type: text/plain\r
X-Proxy-Error: blocked-by-allowlist\r
\r
Connection blocked by network allowlist`);
        return
      }
      let W = GB4(Y, Z, () => {
        G.write(`HTTP/1.1 200 Connection Established\r
\r
`), W.pipe(G), G.pipe(W)
      });
      W.on("error", (X) => {
        kQ(`CONNECT tunnel failed: ${X.message}`, {
          level: "error"
        }), G.end(`HTTP/1.1 502 Bad Gateway\r
\r
`)
      }), G.on("error", (X) => {
        kQ(`Client socket error: ${X.message}`, {
          level: "error"
        }), W.destroy()
      }), G.on("end", () => W.end()), W.on("end", () => G.end())
    } catch (Z) {
      kQ(`Error handling CONNECT: ${Z}`, {
        level: "error"
      }), G.end(`HTTP/1.1 500 Internal Server Error\r
\r
`)
    }
  }), Q.on("request", async (B, G) => {
    try {
      let Z = new ZB4(B.url),
        I = Z.hostname,
        Y = Z.port ? parseInt(Z.port, 10) : Z.protocol === "https:" ? 443 : 80;
      if (!await A.filter(Y, I, B.socket)) {
        kQ(`HTTP request blocked to ${I}:${Y}`, {
          level: "error"
        }), G.writeHead(403, {
          "Content-Type": "text/plain",
          "X-Proxy-Error": "blocked-by-allowlist"
        }), G.end("Connection blocked by network allowlist");
        return
      }
      let X = (Z.protocol === "https:" ? BB4 : QB4)({
        hostname: I,
        port: Y,
        path: Z.pathname + Z.search,
        method: B.method,
        headers: {
          ...B.headers,
          host: Z.host
        }
      }, (V) => {
        G.writeHead(V.statusCode, V.headers), V.pipe(G)
      });
      X.on("error", (V) => {
        if (kQ(`Proxy request failed: ${V.message}`, {
            level: "error"
          }), !G.headersSent) G.writeHead(502, {
          "Content-Type": "text/plain"
        }), G.end("Bad Gateway")
      }), B.pipe(X)
    } catch (Z) {
      kQ(`Error handling HTTP request: ${Z}`, {
        level: "error"
      }), G.writeHead(500, {
        "Content-Type": "text/plain"
      }), G.end("Internal Server Error")
    }
  }), Q
}
// @from(Start 1447127, End 1447141)
gh0 = () => {}
// @from(Start 1447147, End 1454901)
ih0 = z((h87, lh0) => {
  var {
    create: IB4,
    defineProperty: FxA,
    getOwnPropertyDescriptor: YB4,
    getOwnPropertyNames: JB4,
    getPrototypeOf: WB4
  } = Object, XB4 = Object.prototype.hasOwnProperty, VB4 = (A, Q) => {
    for (var B in Q) FxA(A, B, {
      get: Q[B],
      enumerable: !0
    })
  }, uh0 = (A, Q, B, G) => {
    if (Q && typeof Q === "object" || typeof Q === "function") {
      for (let Z of JB4(Q))
        if (!XB4.call(A, Z) && Z !== B) FxA(A, Z, {
          get: () => Q[Z],
          enumerable: !(G = YB4(Q, Z)) || G.enumerable
        })
    }
    return A
  }, mh0 = (A, Q, B) => (B = A != null ? IB4(WB4(A)) : {}, uh0(Q || !A || !A.__esModule ? FxA(B, "default", {
    value: A,
    enumerable: !0
  }) : B, A)), FB4 = (A) => uh0(FxA({}, "__esModule", {
    value: !0
  }), A), dh0 = {};
  VB4(dh0, {
    Socks5Server: () => ph0,
    createServer: () => CB4,
    defaultConnectionHandler: () => BH1
  });
  lh0.exports = FB4(dh0);
  var KB4 = mh0(UA("net")),
    ch0 = ((A) => {
      return A[A.connect = 1] = "connect", A[A.bind = 2] = "bind", A[A.udp = 3] = "udp", A
    })(ch0 || {}),
    QH1 = ((A) => {
      return A[A.REQUEST_GRANTED = 0] = "REQUEST_GRANTED", A[A.GENERAL_FAILURE = 1] = "GENERAL_FAILURE", A[A.CONNECTION_NOT_ALLOWED = 2] = "CONNECTION_NOT_ALLOWED", A[A.NETWORK_UNREACHABLE = 3] = "NETWORK_UNREACHABLE", A[A.HOST_UNREACHABLE = 4] = "HOST_UNREACHABLE", A[A.CONNECTION_REFUSED = 5] = "CONNECTION_REFUSED", A[A.TTL_EXPIRED = 6] = "TTL_EXPIRED", A[A.COMMAND_NOT_SUPPORTED = 7] = "COMMAND_NOT_SUPPORTED", A[A.ADDRESS_TYPE_NOT_SUPPORTED = 8] = "ADDRESS_TYPE_NOT_SUPPORTED", A
    })(QH1 || {}),
    DB4 = class {
      constructor(A, Q) {
        this.errorHandler = () => {}, this.metadata = {}, this.socket = Q, this.server = A, Q.on("error", this.errorHandler), Q.pause(), this.handleGreeting()
      }
      readBytes(A) {
        return new Promise((Q) => {
          let B = Buffer.allocUnsafe(A),
            G = 0,
            Z = (I) => {
              let Y = Math.min(I.length, A - G);
              if (I.copy(B, G, 0, Y), G += Y, G < A) return;
              this.socket.removeListener("data", Z), this.socket.push(I.subarray(Y)), Q(B), this.socket.pause()
            };
          this.socket.on("data", Z), this.socket.resume()
        })
      }
      async handleGreeting() {
        if ((await this.readBytes(1)).readUInt8() !== 5) return this.socket.destroy();
        let Q = (await this.readBytes(1)).readUInt8();
        if (Q > 128 || Q === 0) return this.socket.destroy();
        let B = await this.readBytes(Q),
          G = this.server.authHandler ? 2 : 0;
        if (!B.includes(G)) return this.socket.write(Buffer.from([5, 255])), this.socket.destroy();
        if (this.socket.write(Buffer.from([5, G])), this.server.authHandler) this.handleUserPassword();
        else this.handleConnectionRequest()
      }
      async handleUserPassword() {
        await this.readBytes(1);
        let A = (await this.readBytes(1)).readUint8(),
          Q = (await this.readBytes(A)).toString(),
          B = (await this.readBytes(1)).readUint8(),
          G = (await this.readBytes(B)).toString();
        this.username = Q, this.password = G;
        let Z = !1,
          I = () => {
            if (Z) return;
            Z = !0, this.socket.write(Buffer.from([1, 0])), this.handleConnectionRequest()
          },
          Y = () => {
            if (Z) return;
            Z = !0, this.socket.write(Buffer.from([1, 1])), this.socket.destroy()
          },
          J = await this.server.authHandler(this, I, Y);
        if (J === !0) I();
        else if (J === !1) Y()
      }
      async handleConnectionRequest() {
        await this.readBytes(1);
        let A = (await this.readBytes(1))[0],
          Q = ch0[A];
        if (!Q) return this.socket.destroy();
        this.command = Q, await this.readBytes(1);
        let B = (await this.readBytes(1)).readUInt8(),
          G = "";
        switch (B) {
          case 1:
            G = (await this.readBytes(4)).join(".");
            break;
          case 3:
            let X = (await this.readBytes(1)).readUInt8();
            G = (await this.readBytes(X)).toString();
            break;
          case 4:
            let V = await this.readBytes(16);
            for (let F = 0; F < 16; F++) {
              if (F % 2 === 0 && F > 0) G += ":";
              G += `${V[F]<16?"0":""}${V[F].toString(16)}`
            }
            break;
          default:
            this.socket.destroy();
            return
        }
        let Z = (await this.readBytes(2)).readUInt16BE();
        if (!this.server.supportedCommands.has(Q)) return this.socket.write(Buffer.from([5, 7])), this.socket.destroy();
        this.destAddress = G, this.destPort = Z;
        let I = !1,
          Y = () => {
            if (I) return;
            I = !0, this.connect()
          };
        if (!this.server.rulesetValidator) return Y();
        let J = () => {
            if (I) return;
            I = !0, this.socket.write(Buffer.from([5, 2, 0, 1, 0, 0, 0, 0, 0, 0])), this.socket.destroy()
          },
          W = await this.server.rulesetValidator(this, Y, J);
        if (W === !0) Y();
        else if (W === !1) J()
      }
      connect() {
        this.socket.removeListener("error", this.errorHandler), this.server.connectionHandler(this, (A) => {
          if (QH1[A] === void 0) throw Error(`"${A}" is not a valid status.`);
          if (this.socket.write(Buffer.from([5, QH1[A], 0, 1, 0, 0, 0, 0, 0, 0])), A !== "REQUEST_GRANTED") this.socket.destroy()
        }), this.socket.resume()
      }
    },
    HB4 = mh0(UA("net"));

  function BH1(A, Q) {
    if (A.command !== "connect") return Q("COMMAND_NOT_SUPPORTED");
    A.socket.on("error", () => {});
    let B = HB4.default.createConnection({
      host: A.destAddress,
      port: A.destPort
    });
    B.setNoDelay();
    let G = !1;
    return B.on("error", (Z) => {
      if (!G) switch (Z.code) {
        case "EINVAL":
        case "ENOENT":
        case "ENOTFOUND":
        case "ETIMEDOUT":
        case "EADDRNOTAVAIL":
        case "EHOSTUNREACH":
          Q("HOST_UNREACHABLE");
          break;
        case "ENETUNREACH":
          Q("NETWORK_UNREACHABLE");
          break;
        case "ECONNREFUSED":
          Q("CONNECTION_REFUSED");
          break;
        default:
          Q("GENERAL_FAILURE")
      }
    }), B.on("ready", () => {
      G = !0, Q("REQUEST_GRANTED"), A.socket.pipe(B).pipe(A.socket)
    }), A.socket.on("close", () => B.destroy()), B
  }
  var ph0 = class {
    constructor() {
      this.supportedCommands = new Set(["connect"]), this.connectionHandler = BH1, this.server = KB4.default.createServer((A) => {
        A.setNoDelay(), this._handleConnection(A)
      })
    }
    listen(...A) {
      return this.server.listen(...A), this
    }
    close(A) {
      return this.server.close(A), this
    }
    setAuthHandler(A) {
      return this.authHandler = A, this
    }
    disableAuthHandler() {
      return this.authHandler = void 0, this
    }
    setRulesetValidator(A) {
      return this.rulesetValidator = A, this
    }
    disableRulesetValidator() {
      return this.rulesetValidator = void 0, this
    }
    setConnectionHandler(A) {
      return this.connectionHandler = A, this
    }
    useDefaultConnectionHandler() {
      return this.connectionHandler = BH1, this
    }
    _handleConnection(A) {
      return new DB4(this, A), this
    }
  };

  function CB4(A) {
    let Q = new ph0;
    if (A?.auth) Q.setAuthHandler((B) => {
      return B.username === A.auth.username && B.password === A.auth.password
    });
    if (A?.port) Q.listen(A.port, A.hostname);
    return Q
  }
})
// @from(Start 1454904, End 1456669)
function ah0(A) {
  let Q = nh0.createServer();
  return Q.setRulesetValidator(async (B) => {
    try {
      let {
        destAddress: G,
        destPort: Z
      } = B;
      if (kQ(`Connection request to ${G}:${Z}`), !await A.filter(Z, G)) return kQ(`Connection blocked to ${G}:${Z}`, {
        level: "error"
      }), !1;
      return kQ(`Connection allowed to ${G}:${Z}`), !0
    } catch (G) {
      return kQ(`Error validating connection: ${G}`, {
        level: "error"
      }), !1
    }
  }), {
    server: Q,
    getPort() {
      try {
        let B = Q?.server;
        if (B && typeof B?.address === "function") {
          let G = B.address();
          if (G && typeof G === "object" && "port" in G) return G.port
        }
      } catch (B) {
        kQ(`Error getting port: ${B}`, {
          level: "error"
        })
      }
      return
    },
    listen(B, G) {
      return new Promise((Z, I) => {
        let Y = () => {
          let J = this.getPort();
          if (J) kQ(`SOCKS proxy listening on ${G}:${J}`), Z(J);
          else I(Error("Failed to get SOCKS proxy server port"))
        };
        Q.listen(B, G, Y)
      })
    },
    async close() {
      return new Promise((B, G) => {
        Q.close((Z) => {
          if (Z) {
            let I = Z.message?.toLowerCase() || "";
            if (!(I.includes("not running") || I.includes("already closed") || I.includes("not listening"))) {
              G(Z);
              return
            }
          }
          B()
        })
      })
    },
    unref() {
      try {
        let B = Q?.server;
        if (B && typeof B?.unref === "function") B.unref()
      } catch (B) {
        kQ(`Error calling unref: ${B}`, {
          level: "error"
        })
      }
    }
  }
}
// @from(Start 1456674, End 1456677)
nh0
// @from(Start 1456683, End 1456722)
sh0 = L(() => {
  nh0 = BA(ih0(), 1)
})
// @from(Start 1456725, End 1456742)
function EB4() {}
// @from(Start 1456747, End 1456750)
ZKA
// @from(Start 1456756, End 1456786)
GH1 = L(() => {
  ZKA = EB4
})
// @from(Start 1456789, End 1456925)
function zB4(A, Q) {
  var B = -1,
    G = A == null ? 0 : A.length;
  while (++B < G)
    if (Q(A[B], B, A) === !1) break;
  return A
}
// @from(Start 1456930, End 1456933)
rh0
// @from(Start 1456939, End 1456969)
oh0 = L(() => {
  rh0 = zB4
})
// @from(Start 1456972, End 1457119)
function UB4(A, Q, B, G) {
  var Z = A.length,
    I = B + (G ? 1 : -1);
  while (G ? I-- : ++I < Z)
    if (Q(A[I], I, A)) return I;
  return -1
}
// @from(Start 1457124, End 1457127)
th0
// @from(Start 1457133, End 1457163)
eh0 = L(() => {
  th0 = UB4
})
// @from(Start 1457166, End 1457202)
function $B4(A) {
  return A !== A
}
// @from(Start 1457207, End 1457210)
Ag0
// @from(Start 1457216, End 1457246)
Qg0 = L(() => {
  Ag0 = $B4
})
// @from(Start 1457249, End 1457369)
function wB4(A, Q, B) {
  var G = B - 1,
    Z = A.length;
  while (++G < Z)
    if (A[G] === Q) return G;
  return -1
}
// @from(Start 1457374, End 1457377)
Bg0
// @from(Start 1457383, End 1457413)
Gg0 = L(() => {
  Bg0 = wB4
})
// @from(Start 1457416, End 1457490)
function qB4(A, Q, B) {
  return Q === Q ? Bg0(A, Q, B) : th0(A, Ag0, B)
}
// @from(Start 1457495, End 1457498)
Zg0
// @from(Start 1457504, End 1457561)
Ig0 = L(() => {
  eh0();
  Qg0();
  Gg0();
  Zg0 = qB4
})
// @from(Start 1457564, End 1457656)
function NB4(A, Q) {
  var B = A == null ? 0 : A.length;
  return !!B && Zg0(A, Q, 0) > -1
}
// @from(Start 1457661, End 1457664)
Yg0
// @from(Start 1457670, End 1457709)
Jg0 = L(() => {
  Ig0();
  Yg0 = NB4
})
// @from(Start 1457712, End 1457781)
function LB4(A) {
  return b7(A) || rx(A) || !!(Wg0 && A && A[Wg0])
}
// @from(Start 1457786, End 1457789)
Wg0
// @from(Start 1457791, End 1457794)
Xg0
// @from(Start 1457800, End 1457900)
Vg0 = L(() => {
  ws();
  FFA();
  uC();
  Wg0 = EF ? EF.isConcatSpreadable : void 0;
  Xg0 = LB4
})
// @from(Start 1457903, End 1458171)
function Fg0(A, Q, B, G, Z) {
  var I = -1,
    Y = A.length;
  B || (B = Xg0), Z || (Z = []);
  while (++I < Y) {
    var J = A[I];
    if (Q > 0 && B(J))
      if (Q > 1) Fg0(J, Q - 1, B, G, Z);
      else dBA(Z, J);
    else if (!G) Z[Z.length] = J
  }
  return Z
}
// @from(Start 1458176, End 1458179)
Kg0
// @from(Start 1458185, End 1458233)
Dg0 = L(() => {
  h_A();
  Vg0();
  Kg0 = Fg0
})
// @from(Start 1458236, End 1458319)
function MB4(A) {
  var Q = A == null ? 0 : A.length;
  return Q ? Kg0(A, 1) : []
}
// @from(Start 1458324, End 1458327)
Hg0
// @from(Start 1458333, End 1458372)
Cg0 = L(() => {
  Dg0();
  Hg0 = MB4
})
// @from(Start 1458375, End 1458436)
function OB4(A) {
  return fkA(bkA(A, void 0, Hg0), A + "")
}
// @from(Start 1458441, End 1458444)
Eg0
// @from(Start 1458450, End 1458507)
zg0 = L(() => {
  Cg0();
  aX1();
  sX1();
  Eg0 = OB4
})
// @from(Start 1458510, End 1458751)
function RB4(A, Q, B) {
  var G = -1,
    Z = A.length;
  if (Q < 0) Q = -Q > Z ? 0 : Z + Q;
  if (B = B > Z ? Z : B, B < 0) B += Z;
  Z = Q > B ? 0 : B - Q >>> 0, Q >>>= 0;
  var I = Array(Z);
  while (++G < Z) I[G] = A[G + Q];
  return I
}
// @from(Start 1458756, End 1458759)
KxA
// @from(Start 1458765, End 1458795)
ZH1 = L(() => {
  KxA = RB4
})
// @from(Start 1458798, End 1458910)
function TB4(A, Q, B) {
  var G = A.length;
  return B = B === void 0 ? G : B, !Q && B >= G ? A : KxA(A, Q, B)
}
// @from(Start 1458915, End 1458918)
Ug0
// @from(Start 1458924, End 1458963)
$g0 = L(() => {
  ZH1();
  Ug0 = TB4
})
// @from(Start 1458966, End 1459006)
function bB4(A) {
  return vB4.test(A)
}
// @from(Start 1459011, End 1459034)
PB4 = "\\ud800-\\udfff"
// @from(Start 1459038, End 1459061)
jB4 = "\\u0300-\\u036f"
// @from(Start 1459065, End 1459088)
SB4 = "\\ufe20-\\ufe2f"
// @from(Start 1459092, End 1459115)
_B4 = "\\u20d0-\\u20ff"
// @from(Start 1459119, End 1459122)
kB4
// @from(Start 1459124, End 1459146)
yB4 = "\\ufe0e\\ufe0f"
// @from(Start 1459150, End 1459165)
xB4 = "\\u200d"
// @from(Start 1459169, End 1459172)
vB4
// @from(Start 1459174, End 1459177)
DxA
// @from(Start 1459183, End 1459287)
IH1 = L(() => {
  kB4 = jB4 + SB4 + _B4, vB4 = RegExp("[" + xB4 + PB4 + kB4 + yB4 + "]");
  DxA = bB4
})
// @from(Start 1459290, End 1459330)
function fB4(A) {
  return A.split("")
}
// @from(Start 1459335, End 1459338)
wg0
// @from(Start 1459344, End 1459374)
qg0 = L(() => {
  wg0 = fB4
})
// @from(Start 1459377, End 1459424)
function rB4(A) {
  return A.match(sB4) || []
}
// @from(Start 1459429, End 1459452)
Ng0 = "\\ud800-\\udfff"
// @from(Start 1459456, End 1459479)
hB4 = "\\u0300-\\u036f"
// @from(Start 1459483, End 1459506)
gB4 = "\\ufe20-\\ufe2f"
// @from(Start 1459510, End 1459533)
uB4 = "\\u20d0-\\u20ff"
// @from(Start 1459537, End 1459540)
mB4
// @from(Start 1459542, End 1459564)
dB4 = "\\ufe0e\\ufe0f"
// @from(Start 1459568, End 1459571)
cB4
// @from(Start 1459573, End 1459576)
YH1
// @from(Start 1459578, End 1459610)
JH1 = "\\ud83c[\\udffb-\\udfff]"
// @from(Start 1459614, End 1459617)
pB4
// @from(Start 1459619, End 1459622)
Lg0
// @from(Start 1459624, End 1459663)
Mg0 = "(?:\\ud83c[\\udde6-\\uddff]){2}"
// @from(Start 1459667, End 1459709)
Og0 = "[\\ud800-\\udbff][\\udc00-\\udfff]"
// @from(Start 1459713, End 1459728)
lB4 = "\\u200d"
// @from(Start 1459732, End 1459735)
Rg0
// @from(Start 1459737, End 1459740)
Tg0
// @from(Start 1459742, End 1459745)
iB4
// @from(Start 1459747, End 1459750)
nB4
// @from(Start 1459752, End 1459755)
aB4
// @from(Start 1459757, End 1459760)
sB4
// @from(Start 1459762, End 1459765)
Pg0
// @from(Start 1459771, End 1460203)
jg0 = L(() => {
  mB4 = hB4 + gB4 + uB4, cB4 = "[" + Ng0 + "]", YH1 = "[" + mB4 + "]", pB4 = "(?:" + YH1 + "|" + JH1 + ")", Lg0 = "[^" + Ng0 + "]", Rg0 = pB4 + "?", Tg0 = "[" + dB4 + "]?", iB4 = "(?:" + lB4 + "(?:" + [Lg0, Mg0, Og0].join("|") + ")" + Tg0 + Rg0 + ")*", nB4 = Tg0 + Rg0 + iB4, aB4 = "(?:" + [Lg0 + YH1 + "?", YH1, Mg0, Og0, cB4].join("|") + ")", sB4 = RegExp(JH1 + "(?=" + JH1 + ")|" + aB4 + nB4, "g");
  Pg0 = rB4
})
// @from(Start 1460206, End 1460259)
function oB4(A) {
  return DxA(A) ? Pg0(A) : wg0(A)
}
// @from(Start 1460264, End 1460267)
Sg0
// @from(Start 1460273, End 1460330)
_g0 = L(() => {
  qg0();
  IH1();
  jg0();
  Sg0 = oB4
})
// @from(Start 1460333, End 1460536)
function tB4(A) {
  return function(Q) {
    Q = eBA(Q);
    var B = DxA(Q) ? Sg0(Q) : void 0,
      G = B ? B[0] : Q.charAt(0),
      Z = B ? Ug0(B, 1).join("") : Q.slice(1);
    return G[A]() + Z
  }
}
// @from(Start 1460541, End 1460544)
kg0
// @from(Start 1460550, End 1460616)
yg0 = L(() => {
  $g0();
  IH1();
  _g0();
  VkA();
  kg0 = tB4
})
// @from(Start 1460622, End 1460625)
eB4
// @from(Start 1460627, End 1460630)
xg0
// @from(Start 1460636, End 1460701)
vg0 = L(() => {
  yg0();
  eB4 = kg0("toUpperCase"), xg0 = eB4
})
// @from(Start 1460704, End 1460758)
function A24(A) {
  return xg0(eBA(A).toLowerCase())
}
// @from(Start 1460763, End 1460766)
IKA
// @from(Start 1460772, End 1460820)
WH1 = L(() => {
  VkA();
  vg0();
  IKA = A24
})
// @from(Start 1460823, End 1460875)
function Q24(A, Q) {
  return A && mN(Q, fN(Q), A)
}
// @from(Start 1460880, End 1460883)
bg0
// @from(Start 1460889, End 1460935)
fg0 = L(() => {
  Ss();
  Ms();
  bg0 = Q24
})
// @from(Start 1460938, End 1460990)
function B24(A, Q) {
  return A && mN(Q, uj(Q), A)
}
// @from(Start 1460995, End 1460998)
hg0
// @from(Start 1461004, End 1461051)
gg0 = L(() => {
  Ss();
  E2A();
  hg0 = B24
})
// @from(Start 1461054, End 1461102)
function G24(A, Q) {
  return mN(A, cBA(A), Q)
}
// @from(Start 1461107, End 1461110)
ug0
// @from(Start 1461116, End 1461163)
mg0 = L(() => {
  Ss();
  d_A();
  ug0 = G24
})
// @from(Start 1461169, End 1461172)
Z24
// @from(Start 1461174, End 1461177)
I24
// @from(Start 1461179, End 1461182)
HxA
// @from(Start 1461188, End 1461399)
XH1 = L(() => {
  h_A();
  ykA();
  d_A();
  DX1();
  Z24 = Object.getOwnPropertySymbols, I24 = !Z24 ? m_A : function(A) {
    var Q = [];
    while (A) dBA(Q, cBA(A)), A = H2A(A);
    return Q
  }, HxA = I24
})
// @from(Start 1461402, End 1461450)
function Y24(A, Q) {
  return mN(A, HxA(A), Q)
}
// @from(Start 1461455, End 1461458)
dg0
// @from(Start 1461464, End 1461511)
cg0 = L(() => {
  Ss();
  XH1();
  dg0 = Y24
})
// @from(Start 1461514, End 1461558)
function J24(A) {
  return g_A(A, uj, HxA)
}
// @from(Start 1461563, End 1461566)
CxA
// @from(Start 1461572, End 1461629)
VH1 = L(() => {
  FX1();
  XH1();
  E2A();
  CxA = J24
})
// @from(Start 1461632, End 1461810)
function V24(A) {
  var Q = A.length,
    B = new A.constructor(Q);
  if (Q && typeof A[0] == "string" && X24.call(A, "index")) B.index = A.index, B.input = A.input;
  return B
}
// @from(Start 1461815, End 1461818)
W24
// @from(Start 1461820, End 1461823)
X24
// @from(Start 1461825, End 1461828)
pg0
// @from(Start 1461834, End 1461916)
lg0 = L(() => {
  W24 = Object.prototype, X24 = W24.hasOwnProperty;
  pg0 = V24
})
// @from(Start 1461919, End 1462039)
function F24(A, Q) {
  var B = Q ? D2A(A.buffer) : A.buffer;
  return new A.constructor(B, A.byteOffset, A.byteLength)
}
// @from(Start 1462044, End 1462047)
ig0
// @from(Start 1462053, End 1462092)
ng0 = L(() => {
  SkA();
  ig0 = F24
})
// @from(Start 1462095, End 1462204)
function D24(A) {
  var Q = new A.constructor(A.source, K24.exec(A));
  return Q.lastIndex = A.lastIndex, Q
}
// @from(Start 1462209, End 1462212)
K24
// @from(Start 1462214, End 1462217)
ag0
// @from(Start 1462223, End 1462269)
sg0 = L(() => {
  K24 = /\w*$/;
  ag0 = D24
})
// @from(Start 1462272, End 1462331)
function H24(A) {
  return og0 ? Object(og0.call(A)) : {}
}
// @from(Start 1462336, End 1462339)
rg0
// @from(Start 1462341, End 1462344)
og0
// @from(Start 1462346, End 1462349)
tg0
// @from(Start 1462355, End 1462463)
eg0 = L(() => {
  ws();
  rg0 = EF ? EF.prototype : void 0, og0 = rg0 ? rg0.valueOf : void 0;
  tg0 = H24
})
// @from(Start 1462466, End 1462998)
function x24(A, Q, B) {
  var G = A.constructor;
  switch (Q) {
    case L24:
      return D2A(A);
    case C24:
    case E24:
      return new G(+A);
    case M24:
      return ig0(A, B);
    case O24:
    case R24:
    case T24:
    case P24:
    case j24:
    case S24:
    case _24:
    case k24:
    case y24:
      return _kA(A, B);
    case z24:
      return new G;
    case U24:
    case q24:
      return new G(A);
    case $24:
      return ag0(A);
    case w24:
      return new G;
    case N24:
      return tg0(A)
  }
}
// @from(Start 1463003, End 1463027)
C24 = "[object Boolean]"
// @from(Start 1463031, End 1463052)
E24 = "[object Date]"
// @from(Start 1463056, End 1463076)
z24 = "[object Map]"
// @from(Start 1463080, End 1463103)
U24 = "[object Number]"
// @from(Start 1463107, End 1463130)
$24 = "[object RegExp]"
// @from(Start 1463134, End 1463154)
w24 = "[object Set]"
// @from(Start 1463158, End 1463181)
q24 = "[object String]"
// @from(Start 1463185, End 1463208)
N24 = "[object Symbol]"
// @from(Start 1463212, End 1463240)
L24 = "[object ArrayBuffer]"
// @from(Start 1463244, End 1463269)
M24 = "[object DataView]"
// @from(Start 1463273, End 1463302)
O24 = "[object Float32Array]"
// @from(Start 1463306, End 1463335)
R24 = "[object Float64Array]"
// @from(Start 1463339, End 1463365)
T24 = "[object Int8Array]"
// @from(Start 1463369, End 1463396)
P24 = "[object Int16Array]"
// @from(Start 1463400, End 1463427)
j24 = "[object Int32Array]"
// @from(Start 1463431, End 1463458)
S24 = "[object Uint8Array]"
// @from(Start 1463462, End 1463496)
_24 = "[object Uint8ClampedArray]"
// @from(Start 1463500, End 1463528)
k24 = "[object Uint16Array]"
// @from(Start 1463532, End 1463560)
y24 = "[object Uint32Array]"
// @from(Start 1463564, End 1463567)
Au0
// @from(Start 1463573, End 1463648)
Qu0 = L(() => {
  SkA();
  ng0();
  sg0();
  eg0();
  pX1();
  Au0 = x24
})
// @from(Start 1463651, End 1463701)
function b24(A) {
  return qV(A) && ox(A) == v24
}
// @from(Start 1463706, End 1463726)
v24 = "[object Map]"
// @from(Start 1463730, End 1463733)
Bu0
// @from(Start 1463739, End 1463786)
Gu0 = L(() => {
  EFA();
  yj();
  Bu0 = b24
})
// @from(Start 1463792, End 1463795)
Zu0
// @from(Start 1463797, End 1463800)
f24
// @from(Start 1463802, End 1463805)
Iu0
// @from(Start 1463811, End 1463918)
Yu0 = L(() => {
  Gu0();
  i_A();
  s_A();
  Zu0 = vj && vj.isMap, f24 = Zu0 ? lBA(Zu0) : Bu0, Iu0 = f24
})
// @from(Start 1463921, End 1463971)
function g24(A) {
  return qV(A) && ox(A) == h24
}
// @from(Start 1463976, End 1463996)
h24 = "[object Set]"
// @from(Start 1464000, End 1464003)
Ju0
// @from(Start 1464009, End 1464056)
Wu0 = L(() => {
  EFA();
  yj();
  Ju0 = g24
})
// @from(Start 1464062, End 1464065)
Xu0
// @from(Start 1464067, End 1464070)
u24
// @from(Start 1464072, End 1464075)
Vu0
// @from(Start 1464081, End 1464188)
Fu0 = L(() => {
  Wu0();
  i_A();
  s_A();
  Xu0 = vj && vj.isSet, u24 = Xu0 ? lBA(Xu0) : Ju0, Vu0 = u24
})
// @from(Start 1464191, End 1465171)
function ExA(A, Q, B, G, Z, I) {
  var Y, J = Q & m24,
    W = Q & d24,
    X = Q & c24;
  if (B) Y = Z ? B(A, G, Z, I) : B(A);
  if (Y !== void 0) return Y;
  if (!SY(A)) return A;
  var V = b7(A);
  if (V) {
    if (Y = pg0(A), !J) return kkA(A, Y)
  } else {
    var F = ox(A),
      K = F == Du0 || F == a24;
    if (xj(A)) return OFA(A, J);
    if (F == Hu0 || F == Ku0 || K && !Z) {
      if (Y = W || K ? {} : xkA(A), !J) return W ? dg0(A, hg0(Y, A)) : ug0(A, bg0(Y, A))
    } else {
      if (!TZ[F]) return Z ? A : {};
      Y = Au0(A, F, J)
    }
  }
  I || (I = new kj);
  var D = I.get(A);
  if (D) return D;
  if (I.set(A, Y), Vu0(A)) A.forEach(function(E) {
    Y.add(ExA(E, Q, B, E, A, I))
  });
  else if (Iu0(A)) A.forEach(function(E, U) {
    Y.set(U, ExA(E, Q, B, U, A, I))
  });
  var H = X ? W ? CxA : CFA : W ? uj : fN,
    C = V ? void 0 : H(A);
  return rh0(C || A, function(E, U) {
    if (C) U = E, E = A[U];
    Qm(Y, U, ExA(E, Q, B, U, A, I))
  }), Y
}
// @from(Start 1465176, End 1465183)
m24 = 1
// @from(Start 1465187, End 1465194)
d24 = 2
// @from(Start 1465198, End 1465205)
c24 = 4
// @from(Start 1465209, End 1465235)
Ku0 = "[object Arguments]"
// @from(Start 1465239, End 1465261)
p24 = "[object Array]"
// @from(Start 1465265, End 1465289)
l24 = "[object Boolean]"
// @from(Start 1465293, End 1465314)
i24 = "[object Date]"
// @from(Start 1465318, End 1465340)
n24 = "[object Error]"
// @from(Start 1465344, End 1465369)
Du0 = "[object Function]"
// @from(Start 1465373, End 1465407)
a24 = "[object GeneratorFunction]"
// @from(Start 1465411, End 1465431)
s24 = "[object Map]"
// @from(Start 1465435, End 1465458)
r24 = "[object Number]"
// @from(Start 1465462, End 1465485)
Hu0 = "[object Object]"
// @from(Start 1465489, End 1465512)
o24 = "[object RegExp]"
// @from(Start 1465516, End 1465536)
t24 = "[object Set]"
// @from(Start 1465540, End 1465563)
e24 = "[object String]"
// @from(Start 1465567, End 1465590)
A94 = "[object Symbol]"
// @from(Start 1465594, End 1465618)
Q94 = "[object WeakMap]"
// @from(Start 1465622, End 1465650)
B94 = "[object ArrayBuffer]"
// @from(Start 1465654, End 1465679)
G94 = "[object DataView]"
// @from(Start 1465683, End 1465712)
Z94 = "[object Float32Array]"
// @from(Start 1465716, End 1465745)
I94 = "[object Float64Array]"
// @from(Start 1465749, End 1465775)
Y94 = "[object Int8Array]"
// @from(Start 1465779, End 1465806)
J94 = "[object Int16Array]"
// @from(Start 1465810, End 1465837)
W94 = "[object Int32Array]"
// @from(Start 1465841, End 1465868)
X94 = "[object Uint8Array]"
// @from(Start 1465872, End 1465906)
V94 = "[object Uint8ClampedArray]"
// @from(Start 1465910, End 1465938)
F94 = "[object Uint16Array]"
// @from(Start 1465942, End 1465970)
K94 = "[object Uint32Array]"
// @from(Start 1465974, End 1465976)
TZ
// @from(Start 1465978, End 1465981)
zxA
// @from(Start 1465987, End 1466485)
FH1 = L(() => {
  VFA();
  oh0();
  TFA();
  fg0();
  gg0();
  cX1();
  lX1();
  mg0();
  cg0();
  UX1();
  VH1();
  EFA();
  lg0();
  Qu0();
  iX1();
  uC();
  KFA();
  Yu0();
  bN();
  Fu0();
  Ms();
  E2A();
  TZ = {};
  TZ[Ku0] = TZ[p24] = TZ[B94] = TZ[G94] = TZ[l24] = TZ[i24] = TZ[Z94] = TZ[I94] = TZ[Y94] = TZ[J94] = TZ[W94] = TZ[s24] = TZ[r24] = TZ[Hu0] = TZ[o24] = TZ[t24] = TZ[e24] = TZ[A94] = TZ[X94] = TZ[V94] = TZ[F94] = TZ[K94] = !0;
  TZ[n24] = TZ[Du0] = TZ[Q94] = !1;
  zxA = ExA
})
// @from(Start 1466488, End 1466534)
function C94(A) {
  return zxA(A, D94 | H94)
}
// @from(Start 1466539, End 1466546)
D94 = 1
// @from(Start 1466550, End 1466557)
H94 = 4
// @from(Start 1466561, End 1466563)
Yv
// @from(Start 1466569, End 1466607)
UxA = L(() => {
  FH1();
  Yv = C94
})
// @from(Start 1466610, End 1466760)
function E94(A, Q, B, G) {
  var Z = -1,
    I = A == null ? 0 : A.length;
  while (++Z < I) {
    var Y = A[Z];
    Q(G, Y, B(Y), A)
  }
  return G
}
// @from(Start 1466765, End 1466768)
Cu0
// @from(Start 1466774, End 1466804)
Eu0 = L(() => {
  Cu0 = E94
})
// @from(Start 1466807, End 1466857)
function z94(A, Q) {
  return A && TkA(A, Q, fN)
}
// @from(Start 1466862, End 1466865)
$xA
// @from(Start 1466871, End 1466918)
KH1 = L(() => {
  dX1();
  Ms();
  $xA = z94
})
// @from(Start 1466921, End 1467181)
function U94(A, Q) {
  return function(B, G) {
    if (B == null) return B;
    if (!bj(B)) return A(B, G);
    var Z = B.length,
      I = Q ? Z : -1,
      Y = Object(B);
    while (Q ? I-- : ++I < Z)
      if (G(Y[I], I, Y) === !1) break;
    return B
  }
}
// @from(Start 1467186, End 1467189)
zu0
// @from(Start 1467195, End 1467234)
Uu0 = L(() => {
  aBA();
  zu0 = U94
})
// @from(Start 1467240, End 1467243)
$94
// @from(Start 1467245, End 1467248)
wxA
// @from(Start 1467254, End 1467318)
DH1 = L(() => {
  KH1();
  Uu0();
  $94 = zu0($xA), wxA = $94
})
// @from(Start 1467321, End 1467414)
function w94(A, Q, B, G) {
  return wxA(A, function(Z, I, Y) {
    Q(G, Z, B(Z), Y)
  }), G
}
// @from(Start 1467419, End 1467422)
$u0
// @from(Start 1467428, End 1467467)
wu0 = L(() => {
  DH1();
  $u0 = w94
})
// @from(Start 1467470, End 1467609)
function q94(A, Q) {
  return function(B, G) {
    var Z = b7(B) ? Cu0 : $u0,
      I = Q ? Q() : {};
    return Z(B, A, hj(G, 2), I)
  }
}
// @from(Start 1467614, End 1467617)
qu0
// @from(Start 1467623, End 1467688)
Nu0 = L(() => {
  Eu0();
  wu0();
  G2A();
  uC();
  qu0 = q94
})
// @from(Start 1467691, End 1467825)
function N94(A, Q, B) {
  var G = -1,
    Z = A == null ? 0 : A.length;
  while (++G < Z)
    if (B(Q, A[G])) return !0;
  return !1
}
// @from(Start 1467830, End 1467833)
Lu0
// @from(Start 1467839, End 1467869)
Mu0 = L(() => {
  Lu0 = N94
})
// @from(Start 1467872, End 1467982)
function L94(A, Q) {
  var B = [];
  return wxA(A, function(G, Z, I) {
    if (Q(G, Z, I)) B.push(G)
  }), B
}
// @from(Start 1467987, End 1467990)
Ou0
// @from(Start 1467996, End 1468035)
Ru0 = L(() => {
  DH1();
  Ou0 = L94
})
// @from(Start 1468038, End 1468111)
function M94(A, Q) {
  return tBA(Q, function(B) {
    return A[B]
  })
}
// @from(Start 1468116, End 1468119)
Tu0
// @from(Start 1468125, End 1468164)
Pu0 = L(() => {
  XkA();
  Tu0 = M94
})
// @from(Start 1468167, End 1468226)
function O94(A) {
  return A == null ? [] : Tu0(A, fN(A))
}
// @from(Start 1468231, End 1468234)
ju0
// @from(Start 1468240, End 1468287)
Su0 = L(() => {
  Pu0();
  Ms();
  ju0 = O94
})
// @from(Start 1468290, End 1468362)
function R94(A, Q) {
  return Q.length < 2 ? A : Q2A(A, KxA(Q, 0, -1))
}
// @from(Start 1468367, End 1468370)
_u0
// @from(Start 1468376, End 1468424)
ku0 = L(() => {
  FkA();
  ZH1();
  _u0 = R94
})
// @from(Start 1468427, End 1468468)
function T94(A, Q) {
  return sBA(A, Q)
}
// @from(Start 1468473, End 1468476)
HH1
// @from(Start 1468482, End 1468521)
yu0 = L(() => {
  ZkA();
  HH1 = T94
})
// @from(Start 1468524, End 1468643)
function P94(A, Q) {
  var B = {};
  return Q = hj(Q, 3), $xA(A, function(G, Z, I) {
    Am(B, Z, Q(G, Z, I))
  }), B
}
// @from(Start 1468648, End 1468650)
ns
// @from(Start 1468656, End 1468712)
qxA = L(() => {
  LFA();
  KH1();
  G2A();
  ns = P94
})
// @from(Start 1468715, End 1469105)
function S94(A) {
  if (typeof A != "function") throw TypeError(j94);
  return function() {
    var Q = arguments;
    switch (Q.length) {
      case 0:
        return !A.call(this);
      case 1:
        return !A.call(this, Q[0]);
      case 2:
        return !A.call(this, Q[0], Q[1]);
      case 3:
        return !A.call(this, Q[0], Q[1], Q[2])
    }
    return !A.apply(this, Q)
  }
}
// @from(Start 1469110, End 1469137)
j94 = "Expected a function"
// @from(Start 1469141, End 1469144)
xu0
// @from(Start 1469150, End 1469180)
vu0 = L(() => {
  xu0 = S94
})
// @from(Start 1469183, End 1469276)
function _94(A, Q) {
  return Q = fj(Q, A), A = _u0(A, Q), A == null || delete A[hN(dC(Q))]
}
// @from(Start 1469281, End 1469284)
bu0
// @from(Start 1469290, End 1469355)
fu0 = L(() => {
  A2A();
  E9A();
  ku0();
  Rs();
  bu0 = _94
})
// @from(Start 1469358, End 1469406)
function k94(A) {
  return C2A(A) ? void 0 : A
}
// @from(Start 1469411, End 1469414)
hu0
// @from(Start 1469420, End 1469459)
gu0 = L(() => {
  vkA();
  hu0 = k94
})
// @from(Start 1469465, End 1469472)
y94 = 1
// @from(Start 1469476, End 1469483)
x94 = 2
// @from(Start 1469487, End 1469494)
v94 = 4
// @from(Start 1469498, End 1469501)
b94
// @from(Start 1469503, End 1469506)
uu0
// @from(Start 1469512, End 1469926)
mu0 = L(() => {
  XkA();
  FH1();
  fu0();
  A2A();
  Ss();
  gu0();
  zg0();
  VH1();
  b94 = Eg0(function(A, Q) {
    var B = {};
    if (A == null) return B;
    var G = !1;
    if (Q = tBA(Q, function(I) {
        return I = fj(I, A), G || (G = I.length > 1), I
      }), mN(A, CxA(A), B), G) B = zxA(B, y94 | x94 | v94, hu0);
    var Z = Q.length;
    while (Z--) bu0(B, Q[Z]);
    return B
  }), uu0 = b94
})
// @from(Start 1469929, End 1470381)
function f94(A, Q, B, G) {
  if (!SY(A)) return A;
  Q = fj(Q, A);
  var Z = -1,
    I = Q.length,
    Y = I - 1,
    J = A;
  while (J != null && ++Z < I) {
    var W = hN(Q[Z]),
      X = B;
    if (W === "__proto__" || W === "constructor" || W === "prototype") return A;
    if (Z != Y) {
      var V = J[W];
      if (X = G ? G(V, W, J) : void 0, X === void 0) X = SY(V) ? V : nu(Q[Z + 1]) ? [] : {}
    }
    Qm(J, W, X), J = J[W]
  }
  return A
}
// @from(Start 1470386, End 1470389)
du0
// @from(Start 1470395, End 1470468)
cu0 = L(() => {
  TFA();
  A2A();
  DFA();
  bN();
  Rs();
  du0 = f94
})
// @from(Start 1470474, End 1470477)
h94
// @from(Start 1470479, End 1470482)
pu0
// @from(Start 1470488, End 1470644)
lu0 = L(() => {
  Nu0();
  h94 = qu0(function(A, Q, B) {
    A[B ? 0 : 1].push(Q)
  }, function() {
    return [
      [],
      []
    ]
  }), pu0 = h94
})
// @from(Start 1470647, End 1470707)
function m94(A, Q) {
  return A + g94(u94() * (Q - A + 1))
}
// @from(Start 1470712, End 1470715)
g94
// @from(Start 1470717, End 1470720)
u94
// @from(Start 1470722, End 1470725)
iu0
// @from(Start 1470731, End 1470800)
nu0 = L(() => {
  g94 = Math.floor, u94 = Math.random;
  iu0 = m94
})
// @from(Start 1470803, End 1470883)
function d94(A, Q) {
  var B = b7(A) ? u_A : Ou0;
  return B(A, xu0(hj(Q, 3)))
}
// @from(Start 1470888, End 1470891)
CH1
// @from(Start 1470897, End 1470971)
au0 = L(() => {
  KX1();
  Ru0();
  G2A();
  uC();
  vu0();
  CH1 = d94
})
// @from(Start 1470974, End 1471052)
function c94(A) {
  var Q = A.length;
  return Q ? A[iu0(0, Q - 1)] : void 0
}
// @from(Start 1471057, End 1471060)
NxA
// @from(Start 1471066, End 1471105)
EH1 = L(() => {
  nu0();
  NxA = c94
})
// @from(Start 1471108, End 1471148)
function p94(A) {
  return NxA(ju0(A))
}
// @from(Start 1471153, End 1471156)
su0
// @from(Start 1471162, End 1471210)
ru0 = L(() => {
  EH1();
  Su0();
  su0 = p94
})
// @from(Start 1471213, End 1471275)
function l94(A) {
  var Q = b7(A) ? NxA : su0;
  return Q(A)
}
// @from(Start 1471280, End 1471282)
as
// @from(Start 1471288, End 1471343)
LxA = L(() => {
  EH1();
  ru0();
  uC();
  as = l94
})
// @from(Start 1471346, End 1471456)
function i94(A, Q, B, G) {
  return G = typeof G == "function" ? G : void 0, A == null ? A : du0(A, Q, B, G)
}
// @from(Start 1471461, End 1471464)
ou0
// @from(Start 1471470, End 1471509)
tu0 = L(() => {
  cu0();
  ou0 = i94
})
// @from(Start 1471515, End 1471526)
n94 = 1 / 0
// @from(Start 1471530, End 1471533)
a94
// @from(Start 1471535, End 1471538)
eu0
// @from(Start 1471544, End 1471698)
Am0 = L(() => {
  $X1();
  GH1();
  f_A();
  a94 = !(au && 1 / mBA(new au([, -0]))[1] == n94) ? ZKA : function(A) {
    return new au(A)
  }, eu0 = a94
})
// @from(Start 1471701, End 1472300)
function r94(A, Q, B) {
  var G = -1,
    Z = Yg0,
    I = A.length,
    Y = !0,
    J = [],
    W = J;
  if (B) Y = !1, Z = Lu0;
  else if (I >= s94) {
    var X = Q ? null : eu0(A);
    if (X) return mBA(X);
    Y = !1, Z = v_A, W = new x_A
  } else W = Q ? [] : J;
  A: while (++G < I) {
    var V = A[G],
      F = Q ? Q(V) : V;
    if (V = B || V !== 0 ? V : 0, Y && F === F) {
      var K = W.length;
      while (K--)
        if (W[K] === F) continue A;
      if (Q) W.push(F);
      J.push(V)
    } else if (!Z(W, F, B)) {
      if (W !== J) W.push(F);
      J.push(V)
    }
  }
  return J
}
// @from(Start 1472305, End 1472314)
s94 = 200
// @from(Start 1472318, End 1472321)
Qm0
// @from(Start 1472327, End 1472411)
Bm0 = L(() => {
  YX1();
  Jg0();
  Mu0();
  JX1();
  Am0();
  f_A();
  Qm0 = r94
})
// @from(Start 1472414, End 1472483)
function o94(A, Q) {
  return A && A.length ? Qm0(A, hj(Q, 2)) : []
}
// @from(Start 1472488, End 1472491)
U9A
// @from(Start 1472497, End 1472545)
MxA = L(() => {
  G2A();
  Bm0();
  U9A = o94
})
// @from(Start 1472548, End 1472723)
function t94(A, Q, B) {
  var G = -1,
    Z = A.length,
    I = Q.length,
    Y = {};
  while (++G < Z) {
    var J = G < I ? Q[G] : void 0;
    B(Y, A[G], J)
  }
  return Y
}
// @from(Start 1472728, End 1472731)
Gm0
// @from(Start 1472737, End 1472767)
Zm0 = L(() => {
  Gm0 = t94
})
// @from(Start 1472770, End 1472827)
function e94(A, Q) {
  return Gm0(A || [], Q || [], Qm)
}
// @from(Start 1472832, End 1472835)
Im0
// @from(Start 1472841, End 1472889)
Ym0 = L(() => {
  TFA();
  Zm0();
  Im0 = e94
})
// @from(Start 1472895, End 1472929)
$9A = L(() => {
  UxA();
  l2()
})
// @from(Start 1472932, End 1473142)
function aN() {
  switch (process.platform) {
    case "darwin":
      return "macos";
    case "linux":
      return "linux";
    case "win32":
      return "windows";
    default:
      return "unknown"
  }
}
// @from(Start 1473247, End 1473400)
function Jm0() {
  try {
    return A44("which", ["rg"], {
      stdio: "ignore",
      timeout: 1000
    }).status === 0
  } catch {
    return !1
  }
}
// @from(Start 1473401, End 1473893)
async function Wm0(A, Q, B, G = {
  command: "rg"
}) {
  let {
    command: Z,
    args: I = []
  } = G;
  return new Promise((Y, J) => {
    Q44(Z, [...I, ...A, Q], {
      maxBuffer: 20000000,
      signal: B,
      timeout: 1e4
    }, (W, X, V) => {
      if (!W) {
        Y(X.trim().split(`
`).filter(Boolean));
        return
      }
      if (W.code === 1) {
        Y([]);
        return
      }
      J(Error(`ripgrep failed with exit code ${W.code}: ${V||W.message}`))
    })
  })
}
// @from(Start 1473898, End 1473912)
zH1 = () => {}
// @from(Start 1474009, End 1474111)
function OxA() {
  return [...B44.filter((A) => A !== ".git"), ".claude/commands", ".claude/agents"]
}
// @from(Start 1474113, End 1474157)
function wH1(A) {
  return A.toLowerCase()
}
// @from(Start 1474159, End 1474259)
function qR(A) {
  return A.includes("*") || A.includes("?") || A.includes("[") || A.includes("]")
}
// @from(Start 1474261, End 1474314)
function JKA(A) {
  return A.replace(/\/\*\*$/, "")
}
// @from(Start 1474316, End 1474924)
function NR(A) {
  let Q = process.cwd(),
    B = A;
  if (A === "~") B = UH1();
  else if (A.startsWith("~/")) B = UH1() + A.slice(1);
  else if (A.startsWith("./") || A.startsWith("../")) B = ej.resolve(Q, A);
  else if (!ej.isAbsolute(A)) B = ej.resolve(Q, A);
  if (qR(B)) {
    let G = B.split(/[*?[\]]/)[0];
    if (G && G !== "/") {
      let Z = G.endsWith("/") ? G.slice(0, -1) : ej.dirname(G);
      try {
        let I = $H1.realpathSync(Z),
          Y = B.slice(Z.length);
        return I + Y
      } catch {}
    }
    return B
  }
  try {
    B = $H1.realpathSync(B)
  } catch {}
  return B
}
// @from(Start 1474926, End 1475162)
function WKA() {
  let A = UH1();
  return ["/dev/stdout", "/dev/stderr", "/dev/null", "/dev/tty", "/dev/dtracehelper", "/dev/autofs_nowait", "/tmp/claude", "/private/tmp/claude", ej.join(A, ".npm/_logs"), ej.join(A, ".claude/debug")]
}
// @from(Start 1475164, End 1476338)
function RxA(A, Q) {
  let B = ["SANDBOX_RUNTIME=1", "TMPDIR=/tmp/claude"];
  if (!A && !Q) return B;
  let G = ["localhost", "127.0.0.1", "::1", "*.local", ".local", "169.254.0.0/16", "10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"].join(",");
  if (B.push(`NO_PROXY=${G}`), B.push(`no_proxy=${G}`), A) B.push(`HTTP_PROXY=http://localhost:${A}`), B.push(`HTTPS_PROXY=http://localhost:${A}`), B.push(`http_proxy=http://localhost:${A}`), B.push(`https_proxy=http://localhost:${A}`);
  if (Q) {
    if (B.push(`ALL_PROXY=socks5h://localhost:${Q}`), B.push(`all_proxy=socks5h://localhost:${Q}`), aN() === "macos") B.push(`GIT_SSH_COMMAND="ssh -o ProxyCommand='nc -X 5 -x localhost:${Q} %h %p'"`);
    if (B.push(`FTP_PROXY=socks5h://localhost:${Q}`), B.push(`ftp_proxy=socks5h://localhost:${Q}`), B.push(`RSYNC_PROXY=localhost:${Q}`), B.push(`DOCKER_HTTP_PROXY=http://localhost:${A||Q}`), B.push(`DOCKER_HTTPS_PROXY=http://localhost:${A||Q}`), A) B.push("CLOUDSDK_PROXY_TYPE=https"), B.push("CLOUDSDK_PROXY_ADDRESS=localhost"), B.push(`CLOUDSDK_PROXY_PORT=${A}`);
    B.push(`GRPC_PROXY=socks5h://localhost:${Q}`), B.push(`grpc_proxy=socks5h://localhost:${Q}`)
  }
  return B
}
// @from(Start 1476340, End 1476429)
function TxA(A) {
  let Q = A.slice(0, 100);
  return Buffer.from(Q).toString("base64")
}
// @from(Start 1476431, End 1476501)
function Xm0(A) {
  return Buffer.from(A, "base64").toString("utf8")
}
// @from(Start 1476506, End 1476509)
YKA
// @from(Start 1476511, End 1476514)
B44
// @from(Start 1476520, End 1476702)
w9A = L(() => {
  YKA = [".gitconfig", ".gitmodules", ".bashrc", ".bash_profile", ".zshrc", ".zprofile", ".profile", ".ripgreprc", ".mcp.json"], B44 = [".git", ".vscode", ".idea"]
})
// @from(Start 1476848, End 1477465)
function Km0() {
  let A = process.arch;
  switch (A) {
    case "x64":
    case "x86_64":
      return "x64";
    case "arm64":
    case "aarch64":
      return "arm64";
    case "ia32":
    case "x86":
      return kQ("[SeccompFilter] 32-bit x86 (ia32) is not currently supported due to missing socketcall() syscall blocking. The current seccomp filter only blocks socket(AF_UNIX, ...), but on 32-bit x86, socketcall() can be used to bypass this.", {
        level: "error"
      }), null;
    default:
      return kQ(`[SeccompFilter] Unsupported architecture: ${A}. Only x64 and arm64 are supported.`), null
  }
}
// @from(Start 1477467, End 1478056)
function NH1() {
  let A = Km0();
  if (!A) return kQ(`[SeccompFilter] Cannot find pre-generated BPF filter: unsupported architecture ${process.arch}`), null;
  kQ(`[SeccompFilter] Detected architecture: ${A}`);
  let Q = Vm0(Fm0(import.meta.url)),
    B = Sm("vendor", "seccomp", A, "unix-block.bpf"),
    G = [Sm(Q, B), Sm(Q, "..", "..", B), Sm(Q, "..", B)];
  for (let Z of G)
    if (qH1.existsSync(Z)) return kQ(`[SeccompFilter] Found pre-generated BPF filter: ${Z} (${A})`), Z;
  return kQ(`[SeccompFilter] Pre-generated BPF filter not found in any expected location (${A})`), null
}
// @from(Start 1478058, End 1478662)
function PxA() {
  let A = Km0();
  if (!A) return kQ(`[SeccompFilter] Cannot find apply-seccomp binary: unsupported architecture ${process.arch}`), null;
  kQ(`[SeccompFilter] Looking for apply-seccomp binary for architecture: ${A}`);
  let Q = Vm0(Fm0(import.meta.url)),
    B = Sm("vendor", "seccomp", A, "apply-seccomp"),
    G = [Sm(Q, B), Sm(Q, "..", "..", B), Sm(Q, "..", B)];
  for (let Z of G)
    if (qH1.existsSync(Z)) return kQ(`[SeccompFilter] Found apply-seccomp binary: ${Z} (${A})`), Z;
  return kQ(`[SeccompFilter] apply-seccomp binary not found in any expected location (${A})`), null
}
// @from(Start 1478664, End 1478931)
function Dm0() {
  let A = NH1();
  if (A) return kQ("[SeccompFilter] Using pre-generated BPF filter"), A;
  return kQ("[SeccompFilter] Pre-generated BPF filter not available for this architecture. Only x64 and arm64 are supported.", {
    level: "error"
  }), null
}
// @from(Start 1478933, End 1478951)
function LH1(A) {}
// @from(Start 1478956, End 1478970)
Hm0 = () => {}
// @from(Start 1479213, End 1480483)
async function Z44(A = {
  command: "rg"
}, Q = RH1, B) {
  let G = process.cwd(),
    Z = new AbortController,
    I = B ?? Z.signal,
    Y = OxA(),
    J = [...YKA.map((V) => AS.resolve(G, V)), ...Y.map((V) => AS.resolve(G, V)), AS.resolve(G, ".git/hooks"), AS.resolve(G, ".git/config")],
    W = [];
  for (let V of YKA) W.push("--iglob", V);
  for (let V of Y) W.push("--iglob", `**/${V}/**`);
  W.push("--iglob", "**/.git/hooks/**"), W.push("--iglob", "**/.git/config");
  let X = [];
  try {
    X = await Wm0(["--files", "--hidden", "--max-depth", String(Q), ...W, "-g", "!**/node_modules/**"], G, I, A)
  } catch (V) {
    kQ(`[Sandbox] ripgrep scan failed: ${V}`)
  }
  for (let V of X) {
    let F = AS.resolve(G, V),
      K = !1;
    for (let D of [...Y, ".git"]) {
      let H = wH1(D),
        C = F.split(AS.sep),
        E = C.findIndex((U) => wH1(U) === H);
      if (E !== -1) {
        if (D === ".git") {
          let U = C.slice(0, E + 1).join(AS.sep);
          if (V.includes(".git/hooks")) J.push(AS.join(U, "hooks"));
          else if (V.includes(".git/config")) J.push(AS.join(U, "config"))
        } else J.push(C.slice(0, E + 1).join(AS.sep));
        K = !0;
        break
      }
    }
    if (!K) J.push(F)
  }
  return [...new Set(J)]
}
// @from(Start 1480485, End 1480623)
function I44() {
  if (Um0) return;
  process.on("exit", () => {
    for (let A of OH1) try {
      LH1(A)
    } catch {}
  }), Um0 = !0
}
// @from(Start 1480625, End 1481309)
function $m0(A = !1) {
  try {
    let Q = MH1("which", ["bwrap"], {
        stdio: "ignore",
        timeout: 1000
      }),
      B = MH1("which", ["socat"], {
        stdio: "ignore",
        timeout: 1000
      }),
      G = Q.status === 0 && B.status === 0;
    if (!A) {
      let Z = NH1() !== null,
        I = PxA() !== null;
      if (!Z || !I) kQ(`[Sandbox Linux] Seccomp filtering not available (missing binaries for ${process.arch}). Sandbox will run without Unix socket blocking (allowAllUnixSockets mode). This is less restrictive but still provides filesystem and network isolation.`, {
        level: "warn"
      })
    }
    return G
  } catch {
    return !1
  }
}
// @from(Start 1481310, End 1483494)
async function wm0(A, Q) {
  let B = G44(8).toString("hex"),
    G = zm0(Em0(), `claude-http-${B}.sock`),
    Z = zm0(Em0(), `claude-socks-${B}.sock`),
    I = [`UNIX-LISTEN:${G},fork,reuseaddr`, `TCP:localhost:${A},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  kQ(`Starting HTTP bridge: socat ${I.join(" ")}`);
  let Y = Cm0("socat", I, {
    stdio: "ignore"
  });
  if (!Y.pid) throw Error("Failed to start HTTP bridge process");
  Y.on("error", (V) => {
    kQ(`HTTP bridge process error: ${V}`, {
      level: "error"
    })
  }), Y.on("exit", (V, F) => {
    kQ(`HTTP bridge process exited with code ${V}, signal ${F}`, {
      level: V === 0 ? "info" : "error"
    })
  });
  let J = [`UNIX-LISTEN:${Z},fork,reuseaddr`, `TCP:localhost:${Q},keepalive,keepidle=10,keepintvl=5,keepcnt=3`];
  kQ(`Starting SOCKS bridge: socat ${J.join(" ")}`);
  let W = Cm0("socat", J, {
    stdio: "ignore"
  });
  if (!W.pid) {
    if (Y.pid) try {
      process.kill(Y.pid, "SIGTERM")
    } catch {}
    throw Error("Failed to start SOCKS bridge process")
  }
  W.on("error", (V) => {
    kQ(`SOCKS bridge process error: ${V}`, {
      level: "error"
    })
  }), W.on("exit", (V, F) => {
    kQ(`SOCKS bridge process exited with code ${V}, signal ${F}`, {
      level: V === 0 ? "info" : "error"
    })
  });
  let X = 5;
  for (let V = 0; V < X; V++) {
    if (!Y.pid || Y.killed || !W.pid || W.killed) throw Error("Linux bridge process died unexpectedly");
    try {
      if (LR.existsSync(G) && LR.existsSync(Z)) {
        kQ(`Linux bridges ready after ${V+1} attempts`);
        break
      }
    } catch (F) {
      kQ(`Error checking sockets (attempt ${V+1}): ${F}`, {
        level: "error"
      })
    }
    if (V === X - 1) {
      if (Y.pid) try {
        process.kill(Y.pid, "SIGTERM")
      } catch {}
      if (W.pid) try {
        process.kill(W.pid, "SIGTERM")
      } catch {}
      throw Error(`Failed to create bridge sockets after ${X} attempts`)
    }
    await new Promise((F) => setTimeout(F, V * 100))
  }
  return {
    httpSocketPath: G,
    socksSocketPath: Z,
    httpBridgeProcess: Y,
    socksBridgeProcess: W,
    httpProxyPort: A,
    socksProxyPort: Q
  }
}
// @from(Start 1483496, End 1484221)
function Y44(A, Q, B, G, Z) {
  let I = Z || "bash",
    Y = [`socat TCP-LISTEN:3128,fork,reuseaddr UNIX-CONNECT:${A} >/dev/null 2>&1 &`, `socat TCP-LISTEN:1080,fork,reuseaddr UNIX-CONNECT:${Q} >/dev/null 2>&1 &`, 'trap "kill %1 %2 2>/dev/null; exit" EXIT'];
  if (G) {
    let J = PxA();
    if (!J) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
    let W = ss.default.quote([J, G, I, "-c", B]),
      X = [...Y, W].join(`
`);
    return `${I} -c ${ss.default.quote([X])}`
  } else {
    let J = [...Y, `eval ${ss.default.quote([B])}`].join(`
`);
    return `${I} -c ${ss.default.quote([J])}`
  }
}
// @from(Start 1484222, End 1485654)
async function J44(A, Q, B = {
  command: "rg"
}, G = RH1, Z) {
  let I = [];
  if (Q) {
    I.push("--ro-bind", "/", "/");
    let J = [];
    for (let X of Q.allowOnly || []) {
      let V = NR(X);
      if (kQ(`[Sandbox Linux] Processing write path: ${X} -> ${V}`), V.startsWith("/dev/")) {
        kQ(`[Sandbox Linux] Skipping /dev path: ${V}`);
        continue
      }
      if (!LR.existsSync(V)) {
        kQ(`[Sandbox Linux] Skipping non-existent write path: ${V}`);
        continue
      }
      I.push("--bind", V, V), J.push(V)
    }
    let W = [...Q.denyWithinAllow || [], ...await Z44(B, G, Z)];
    for (let X of W) {
      let V = NR(X);
      if (V.startsWith("/dev/")) continue;
      if (!LR.existsSync(V)) {
        kQ(`[Sandbox Linux] Skipping non-existent deny path: ${V}`);
        continue
      }
      if (J.some((K) => V.startsWith(K + "/") || V === K)) I.push("--ro-bind", V, V);
      else kQ(`[Sandbox Linux] Skipping deny path not within allowed paths: ${V}`)
    }
  } else I.push("--bind", "/", "/");
  let Y = [...A?.denyOnly || []];
  if (LR.existsSync("/etc/ssh/ssh_config.d")) Y.push("/etc/ssh/ssh_config.d");
  for (let J of Y) {
    let W = NR(J);
    if (!LR.existsSync(W)) {
      kQ(`[Sandbox Linux] Skipping non-existent read deny path: ${W}`);
      continue
    }
    if (LR.statSync(W).isDirectory()) I.push("--tmpfs", W);
    else I.push("--ro-bind", "/dev/null", W)
  }
  return I
}
// @from(Start 1485655, End 1488879)
async function qm0(A) {
  let {
    command: Q,
    needsNetworkRestriction: B,
    httpSocketPath: G,
    socksSocketPath: Z,
    httpProxyPort: I,
    socksProxyPort: Y,
    readConfig: J,
    writeConfig: W,
    enableWeakerNestedSandbox: X,
    allowAllUnixSockets: V,
    binShell: F,
    ripgrepConfig: K = {
      command: "rg"
    },
    mandatoryDenySearchDepth: D = RH1,
    abortSignal: H
  } = A, C = J && J.denyOnly.length > 0, E = W !== void 0;
  if (!B && !C && !E) return Q;
  let U = [],
    q = void 0;
  try {
    if (!V)
      if (q = Dm0() ?? void 0, !q) kQ("[Sandbox Linux] Seccomp filter not available (missing binaries). Continuing without Unix socket blocking - sandbox will still provide filesystem and network isolation but Unix sockets will be allowed.", {
        level: "warn"
      });
      else {
        if (!q.includes("/vendor/seccomp/")) OH1.add(q), I44();
        kQ("[Sandbox Linux] Generated seccomp BPF filter for Unix socket blocking")
      }
    else if (V) kQ("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
    if (B) {
      if (U.push("--unshare-net"), G && Z) {
        if (!LR.existsSync(G)) throw Error(`Linux HTTP bridge socket does not exist: ${G}. The bridge process may have died. Try reinitializing the sandbox.`);
        if (!LR.existsSync(Z)) throw Error(`Linux SOCKS bridge socket does not exist: ${Z}. The bridge process may have died. Try reinitializing the sandbox.`);
        U.push("--bind", G, G), U.push("--bind", Z, Z);
        let x = RxA(3128, 1080);
        if (U.push(...x.flatMap((p) => {
            let u = p.indexOf("="),
              e = p.slice(0, u),
              l = p.slice(u + 1);
            return ["--setenv", e, l]
          })), I !== void 0) U.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(I));
        if (Y !== void 0) U.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(Y))
      }
    }
    let w = await J44(J, W, K, D, H);
    if (U.push(...w), U.push("--dev", "/dev"), U.push("--unshare-pid"), !X) U.push("--proc", "/proc");
    let N = F || "bash",
      R = MH1("which", [N], {
        encoding: "utf8"
      });
    if (R.status !== 0) throw Error(`Shell '${N}' not found in PATH`);
    let T = R.stdout.trim();
    if (U.push("--", T, "-c"), B && G && Z) {
      let x = Y44(G, Z, Q, q, T);
      U.push(x)
    } else if (q) {
      let x = PxA();
      if (!x) throw Error("apply-seccomp binary not found. This should have been caught earlier. Ensure vendor/seccomp/{x64,arm64}/apply-seccomp binaries are included in the package.");
      let p = ss.default.quote([x, q, T, "-c", Q]);
      U.push(p)
    } else U.push(Q);
    let y = ss.default.quote(["bwrap", ...U]),
      v = [];
    if (B) v.push("network");
    if (C || E) v.push("filesystem");
    if (q) v.push("seccomp(unix-block)");
    return kQ(`[Sandbox Linux] Wrapped command with bwrap (${v.join(", ")} restrictions)`), y
  } catch (w) {
    if (q && !q.includes("/vendor/seccomp/")) {
      OH1.delete(q);
      try {
        LH1(q)
      } catch (N) {
        kQ(`[Sandbox Linux] Failed to clean up seccomp filter on error: ${N}`, {
          level: "error"
        })
      }
    }
    throw w
  }
}
// @from(Start 1488884, End 1488886)
ss
// @from(Start 1488888, End 1488895)
RH1 = 3
// @from(Start 1488899, End 1488902)
OH1
// @from(Start 1488904, End 1488912)
Um0 = !1
// @from(Start 1488918, End 1489000)
Nm0 = L(() => {
  zH1();
  w9A();
  Hm0();
  ss = BA(GxA(), 1);
  OH1 = new Set
})
// @from(Start 1489099, End 1489445)
function V44() {
  let A = process.cwd(),
    Q = [];
  for (let B of YKA) Q.push(Jv.resolve(A, B)), Q.push(`**/${B}`);
  for (let B of OxA()) Q.push(Jv.resolve(A, B)), Q.push(`**/${B}/**`);
  return Q.push(Jv.resolve(A, ".git/hooks")), Q.push(Jv.resolve(A, ".git/config")), Q.push("**/.git/hooks/**"), Q.push("**/.git/config"), [...new Set(Q)]
}
// @from(Start 1489447, End 1489750)
function jxA(A) {
  return "^" + A.replace(/[.^$+{}()|\\]/g, "\\$&").replace(/\[([^\]]*?)$/g, "\\[$1").replace(/\*\*\//g, "__GLOBSTAR_SLASH__").replace(/\*\*/g, "__GLOBSTAR__").replace(/\*/g, "[^/]*").replace(/\?/g, "[^/]").replace(/__GLOBSTAR_SLASH__/g, "(.*/)?").replace(/__GLOBSTAR__/g, ".*") + "$"
}
// @from(Start 1489752, End 1489809)
function F44(A) {
  return `CMD64_${TxA(A)}_END_${Om0}`
}
// @from(Start 1489811, End 1489993)
function Lm0(A) {
  let Q = [],
    B = Jv.dirname(A);
  while (B !== "/" && B !== ".") {
    Q.push(B);
    let G = Jv.dirname(B);
    if (G === B) break;
    B = G
  }
  return Q
}
// @from(Start 1489995, End 1490792)
function Rm0(A, Q) {
  let B = [];
  for (let G of A) {
    let Z = NR(G);
    if (qR(Z)) {
      let I = jxA(Z);
      B.push("(deny file-write-unlink", `  (regex ${t$(I)})`, `  (with message "${Q}"))`);
      let Y = Z.split(/[*?[\]]/)[0];
      if (Y && Y !== "/") {
        let J = Y.endsWith("/") ? Y.slice(0, -1) : Jv.dirname(Y);
        B.push("(deny file-write-unlink", `  (literal ${t$(J)})`, `  (with message "${Q}"))`);
        for (let W of Lm0(J)) B.push("(deny file-write-unlink", `  (literal ${t$(W)})`, `  (with message "${Q}"))`)
      }
    } else {
      B.push("(deny file-write-unlink", `  (subpath ${t$(Z)})`, `  (with message "${Q}"))`);
      for (let I of Lm0(Z)) B.push("(deny file-write-unlink", `  (literal ${t$(I)})`, `  (with message "${Q}"))`)
    }
  }
  return B
}
// @from(Start 1490794, End 1491222)
function K44(A, Q) {
  if (!A) return ["(allow file-read*)"];
  let B = [];
  B.push("(allow file-read*)");
  for (let G of A.denyOnly || []) {
    let Z = NR(G);
    if (qR(Z)) {
      let I = jxA(Z);
      B.push("(deny file-read*", `  (regex ${t$(I)})`, `  (with message "${Q}"))`)
    } else B.push("(deny file-read*", `  (subpath ${t$(Z)})`, `  (with message "${Q}"))`)
  }
  return B.push(...Rm0(A.denyOnly || [], Q)), B
}
// @from(Start 1491224, End 1492063)
function D44(A, Q) {
  if (!A) return ["(allow file-write*)"];
  let B = [],
    G = C44();
  for (let I of G) {
    let Y = NR(I);
    B.push("(allow file-write*", `  (subpath ${t$(Y)})`, `  (with message "${Q}"))`)
  }
  for (let I of A.allowOnly || []) {
    let Y = NR(I);
    if (qR(Y)) {
      let J = jxA(Y);
      B.push("(allow file-write*", `  (regex ${t$(J)})`, `  (with message "${Q}"))`)
    } else B.push("(allow file-write*", `  (subpath ${t$(Y)})`, `  (with message "${Q}"))`)
  }
  let Z = [...A.denyWithinAllow || [], ...V44()];
  for (let I of Z) {
    let Y = NR(I);
    if (qR(Y)) {
      let J = jxA(Y);
      B.push("(deny file-write*", `  (regex ${t$(J)})`, `  (with message "${Q}"))`)
    } else B.push("(deny file-write*", `  (subpath ${t$(Y)})`, `  (with message "${Q}"))`)
  }
  return B.push(...Rm0(Z, Q)), B
}
// @from(Start 5253319, End 5254668)
Ef1 = z((db) => {
  Object.defineProperty(db, "__esModule", {
    value: !0
  });
  db.logs = db.ProxyLoggerProvider = db.ProxyLogger = db.NoopLoggerProvider = db.NOOP_LOGGER_PROVIDER = db.NoopLogger = db.NOOP_LOGGER = db.SeverityNumber = void 0;
  var jA6 = Q7B();
  Object.defineProperty(db, "SeverityNumber", {
    enumerable: !0,
    get: function() {
      return jA6.SeverityNumber
    }
  });
  var M7B = KnA();
  Object.defineProperty(db, "NOOP_LOGGER", {
    enumerable: !0,
    get: function() {
      return M7B.NOOP_LOGGER
    }
  });
  Object.defineProperty(db, "NoopLogger", {
    enumerable: !0,
    get: function() {
      return M7B.NoopLogger
    }
  });
  var O7B = DnA();
  Object.defineProperty(db, "NOOP_LOGGER_PROVIDER", {
    enumerable: !0,
    get: function() {
      return O7B.NOOP_LOGGER_PROVIDER
    }
  });
  Object.defineProperty(db, "NoopLoggerProvider", {
    enumerable: !0,
    get: function() {
      return O7B.NoopLoggerProvider
    }
  });
  var SA6 = Ff1();
  Object.defineProperty(db, "ProxyLogger", {
    enumerable: !0,
    get: function() {
      return SA6.ProxyLogger
    }
  });
  var _A6 = Kf1();
  Object.defineProperty(db, "ProxyLoggerProvider", {
    enumerable: !0,
    get: function() {
      return _A6.ProxyLoggerProvider
    }
  });
  var kA6 = L7B();
  db.logs = kA6.LogsAPI.getInstance()
})
// @from(Start 5254674, End 5255209)
BUA = z((T7B) => {
  Object.defineProperty(T7B, "__esModule", {
    value: !0
  });
  T7B.isTracingSuppressed = T7B.unsuppressTracing = T7B.suppressTracing = void 0;
  var yA6 = K9(),
    zf1 = (0, yA6.createContextKey)("OpenTelemetry SDK Context Key SUPPRESS_TRACING");

  function xA6(A) {
    return A.setValue(zf1, !0)
  }
  T7B.suppressTracing = xA6;

  function vA6(A) {
    return A.deleteValue(zf1)
  }
  T7B.unsuppressTracing = vA6;

  function bA6(A) {
    return A.getValue(zf1) === !0
  }
  T7B.isTracingSuppressed = bA6
})
// @from(Start 5255215, End 5255815)
Uf1 = z((j7B) => {
  Object.defineProperty(j7B, "__esModule", {
    value: !0
  });
  j7B.BAGGAGE_MAX_TOTAL_LENGTH = j7B.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = j7B.BAGGAGE_MAX_NAME_VALUE_PAIRS = j7B.BAGGAGE_HEADER = j7B.BAGGAGE_ITEMS_SEPARATOR = j7B.BAGGAGE_PROPERTIES_SEPARATOR = j7B.BAGGAGE_KEY_PAIR_SEPARATOR = void 0;
  j7B.BAGGAGE_KEY_PAIR_SEPARATOR = "=";
  j7B.BAGGAGE_PROPERTIES_SEPARATOR = ";";
  j7B.BAGGAGE_ITEMS_SEPARATOR = ",";
  j7B.BAGGAGE_HEADER = "baggage";
  j7B.BAGGAGE_MAX_NAME_VALUE_PAIRS = 180;
  j7B.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS = 4096;
  j7B.BAGGAGE_MAX_TOTAL_LENGTH = 8192
})
// @from(Start 5255821, End 5257404)
$f1 = z((k7B) => {
  Object.defineProperty(k7B, "__esModule", {
    value: !0
  });
  k7B.parseKeyPairsIntoRecord = k7B.parsePairKeyValue = k7B.getKeyPairs = k7B.serializeKeyPairs = void 0;
  var lA6 = K9(),
    Et = Uf1();

  function iA6(A) {
    return A.reduce((Q, B) => {
      let G = `${Q}${Q!==""?Et.BAGGAGE_ITEMS_SEPARATOR:""}${B}`;
      return G.length > Et.BAGGAGE_MAX_TOTAL_LENGTH ? Q : G
    }, "")
  }
  k7B.serializeKeyPairs = iA6;

  function nA6(A) {
    return A.getAllEntries().map(([Q, B]) => {
      let G = `${encodeURIComponent(Q)}=${encodeURIComponent(B.value)}`;
      if (B.metadata !== void 0) G += Et.BAGGAGE_PROPERTIES_SEPARATOR + B.metadata.toString();
      return G
    })
  }
  k7B.getKeyPairs = nA6;

  function _7B(A) {
    let Q = A.split(Et.BAGGAGE_PROPERTIES_SEPARATOR);
    if (Q.length <= 0) return;
    let B = Q.shift();
    if (!B) return;
    let G = B.indexOf(Et.BAGGAGE_KEY_PAIR_SEPARATOR);
    if (G <= 0) return;
    let Z = decodeURIComponent(B.substring(0, G).trim()),
      I = decodeURIComponent(B.substring(G + 1).trim()),
      Y;
    if (Q.length > 0) Y = (0, lA6.baggageEntryMetadataFromString)(Q.join(Et.BAGGAGE_PROPERTIES_SEPARATOR));
    return {
      key: Z,
      value: I,
      metadata: Y
    }
  }
  k7B.parsePairKeyValue = _7B;

  function aA6(A) {
    let Q = {};
    if (typeof A === "string" && A.length > 0) A.split(Et.BAGGAGE_ITEMS_SEPARATOR).forEach((B) => {
      let G = _7B(B);
      if (G !== void 0 && G.value.length > 0) Q[G.key] = G.value
    });
    return Q
  }
  k7B.parseKeyPairsIntoRecord = aA6
})
// @from(Start 5257410, End 5258746)
f7B = z((v7B) => {
  Object.defineProperty(v7B, "__esModule", {
    value: !0
  });
  v7B.W3CBaggagePropagator = void 0;
  var wf1 = K9(),
    tA6 = BUA(),
    zt = Uf1(),
    qf1 = $f1();
  class x7B {
    inject(A, Q, B) {
      let G = wf1.propagation.getBaggage(A);
      if (!G || (0, tA6.isTracingSuppressed)(A)) return;
      let Z = (0, qf1.getKeyPairs)(G).filter((Y) => {
          return Y.length <= zt.BAGGAGE_MAX_PER_NAME_VALUE_PAIRS
        }).slice(0, zt.BAGGAGE_MAX_NAME_VALUE_PAIRS),
        I = (0, qf1.serializeKeyPairs)(Z);
      if (I.length > 0) B.set(Q, zt.BAGGAGE_HEADER, I)
    }
    extract(A, Q, B) {
      let G = B.get(Q, zt.BAGGAGE_HEADER),
        Z = Array.isArray(G) ? G.join(zt.BAGGAGE_ITEMS_SEPARATOR) : G;
      if (!Z) return A;
      let I = {};
      if (Z.length === 0) return A;
      if (Z.split(zt.BAGGAGE_ITEMS_SEPARATOR).forEach((J) => {
          let W = (0, qf1.parsePairKeyValue)(J);
          if (W) {
            let X = {
              value: W.value
            };
            if (W.metadata) X.metadata = W.metadata;
            I[W.key] = X
          }
        }), Object.entries(I).length === 0) return A;
      return wf1.propagation.setBaggage(A, wf1.propagation.createBaggage(I))
    }
    fields() {
      return [zt.BAGGAGE_HEADER]
    }
  }
  v7B.W3CBaggagePropagator = x7B
})
// @from(Start 5258752, End 5259221)
m7B = z((g7B) => {
  Object.defineProperty(g7B, "__esModule", {
    value: !0
  });
  g7B.AnchoredClock = void 0;
  class h7B {
    _monotonicClock;
    _epochMillis;
    _performanceMillis;
    constructor(A, Q) {
      this._monotonicClock = Q, this._epochMillis = A.now(), this._performanceMillis = Q.now()
    }
    now() {
      let A = this._monotonicClock.now() - this._performanceMillis;
      return this._epochMillis + A
    }
  }
  g7B.AnchoredClock = h7B
})
// @from(Start 5259227, End 5260556)
a7B = z((i7B) => {
  Object.defineProperty(i7B, "__esModule", {
    value: !0
  });
  i7B.isAttributeValue = i7B.isAttributeKey = i7B.sanitizeAttributes = void 0;
  var d7B = K9();

  function eA6(A) {
    let Q = {};
    if (typeof A !== "object" || A == null) return Q;
    for (let [B, G] of Object.entries(A)) {
      if (!c7B(B)) {
        d7B.diag.warn(`Invalid attribute key: ${B}`);
        continue
      }
      if (!p7B(G)) {
        d7B.diag.warn(`Invalid attribute value set for key: ${B}`);
        continue
      }
      if (Array.isArray(G)) Q[B] = G.slice();
      else Q[B] = G
    }
    return Q
  }
  i7B.sanitizeAttributes = eA6;

  function c7B(A) {
    return typeof A === "string" && A.length > 0
  }
  i7B.isAttributeKey = c7B;

  function p7B(A) {
    if (A == null) return !0;
    if (Array.isArray(A)) return A16(A);
    return l7B(A)
  }
  i7B.isAttributeValue = p7B;

  function A16(A) {
    let Q;
    for (let B of A) {
      if (B == null) continue;
      if (!Q) {
        if (l7B(B)) {
          Q = typeof B;
          continue
        }
        return !1
      }
      if (typeof B === Q) continue;
      return !1
    }
    return !0
  }

  function l7B(A) {
    switch (typeof A) {
      case "number":
      case "boolean":
      case "string":
        return !0
    }
    return !1
  }
})
// @from(Start 5260562, End 5261168)
Nf1 = z((s7B) => {
  Object.defineProperty(s7B, "__esModule", {
    value: !0
  });
  s7B.loggingErrorHandler = void 0;
  var G16 = K9();

  function Z16() {
    return (A) => {
      G16.diag.error(I16(A))
    }
  }
  s7B.loggingErrorHandler = Z16;

  function I16(A) {
    if (typeof A === "string") return A;
    else return JSON.stringify(Y16(A))
  }

  function Y16(A) {
    let Q = {},
      B = A;
    while (B !== null) Object.getOwnPropertyNames(B).forEach((G) => {
      if (Q[G]) return;
      let Z = B[G];
      if (Z) Q[G] = String(Z)
    }), B = Object.getPrototypeOf(B);
    return Q
  }
})
// @from(Start 5261174, End 5261550)
AGB = z((t7B) => {
  Object.defineProperty(t7B, "__esModule", {
    value: !0
  });
  t7B.globalErrorHandler = t7B.setGlobalErrorHandler = void 0;
  var J16 = Nf1(),
    o7B = (0, J16.loggingErrorHandler)();

  function W16(A) {
    o7B = A
  }
  t7B.setGlobalErrorHandler = W16;

  function X16(A) {
    try {
      o7B(A)
    } catch {}
  }
  t7B.globalErrorHandler = X16
})
// @from(Start 5261556, End 5262737)
YGB = z((ZGB) => {
  Object.defineProperty(ZGB, "__esModule", {
    value: !0
  });
  ZGB.getStringListFromEnv = ZGB.getBooleanFromEnv = ZGB.getStringFromEnv = ZGB.getNumberFromEnv = void 0;
  var QGB = K9(),
    BGB = UA("util");

  function F16(A) {
    let Q = process.env[A];
    if (Q == null || Q.trim() === "") return;
    let B = Number(Q);
    if (isNaN(B)) {
      QGB.diag.warn(`Unknown value ${(0,BGB.inspect)(Q)} for ${A}, expected a number, using defaults`);
      return
    }
    return B
  }
  ZGB.getNumberFromEnv = F16;

  function GGB(A) {
    let Q = process.env[A];
    if (Q == null || Q.trim() === "") return;
    return Q
  }
  ZGB.getStringFromEnv = GGB;

  function K16(A) {
    let Q = process.env[A]?.trim().toLowerCase();
    if (Q == null || Q === "") return !1;
    if (Q === "true") return !0;
    else if (Q === "false") return !1;
    else return QGB.diag.warn(`Unknown value ${(0,BGB.inspect)(Q)} for ${A}, expected 'true' or 'false', falling back to 'false' (default)`), !1
  }
  ZGB.getBooleanFromEnv = K16;

  function D16(A) {
    return GGB(A)?.split(",").map((Q) => Q.trim()).filter((Q) => Q !== "")
  }
  ZGB.getStringListFromEnv = D16
})
// @from(Start 5262743, End 5262930)
XGB = z((JGB) => {
  Object.defineProperty(JGB, "__esModule", {
    value: !0
  });
  JGB._globalThis = void 0;
  JGB._globalThis = typeof globalThis === "object" ? globalThis : global
})
// @from(Start 5262936, End 5263120)
KGB = z((VGB) => {
  Object.defineProperty(VGB, "__esModule", {
    value: !0
  });
  VGB.otperformance = void 0;
  var z16 = UA("perf_hooks");
  VGB.otperformance = z16.performance
})
// @from(Start 5263126, End 5263260)
CGB = z((DGB) => {
  Object.defineProperty(DGB, "__esModule", {
    value: !0
  });
  DGB.VERSION = void 0;
  DGB.VERSION = "2.1.0"
})
// @from(Start 5263266, End 5263610)
Lf1 = z((EGB) => {
  Object.defineProperty(EGB, "__esModule", {
    value: !0
  });
  EGB.createConstMap = void 0;

  function U16(A) {
    let Q = {},
      B = A.length;
    for (let G = 0; G < B; G++) {
      let Z = A[G];
      if (Z) Q[String(Z).toUpperCase().replace(/[-.]/g, "_")] = Z
    }
    return Q
  }
  EGB.createConstMap = U16
})
// @from(Start 5263616, End 5294213)
HWB = z((JWB) => {
  Object.defineProperty(JWB, "__esModule", {
    value: !0
  });
  JWB.SEMATTRS_NET_HOST_CARRIER_ICC = JWB.SEMATTRS_NET_HOST_CARRIER_MNC = JWB.SEMATTRS_NET_HOST_CARRIER_MCC = JWB.SEMATTRS_NET_HOST_CARRIER_NAME = JWB.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = JWB.SEMATTRS_NET_HOST_CONNECTION_TYPE = JWB.SEMATTRS_NET_HOST_NAME = JWB.SEMATTRS_NET_HOST_PORT = JWB.SEMATTRS_NET_HOST_IP = JWB.SEMATTRS_NET_PEER_NAME = JWB.SEMATTRS_NET_PEER_PORT = JWB.SEMATTRS_NET_PEER_IP = JWB.SEMATTRS_NET_TRANSPORT = JWB.SEMATTRS_FAAS_INVOKED_REGION = JWB.SEMATTRS_FAAS_INVOKED_PROVIDER = JWB.SEMATTRS_FAAS_INVOKED_NAME = JWB.SEMATTRS_FAAS_COLDSTART = JWB.SEMATTRS_FAAS_CRON = JWB.SEMATTRS_FAAS_TIME = JWB.SEMATTRS_FAAS_DOCUMENT_NAME = JWB.SEMATTRS_FAAS_DOCUMENT_TIME = JWB.SEMATTRS_FAAS_DOCUMENT_OPERATION = JWB.SEMATTRS_FAAS_DOCUMENT_COLLECTION = JWB.SEMATTRS_FAAS_EXECUTION = JWB.SEMATTRS_FAAS_TRIGGER = JWB.SEMATTRS_EXCEPTION_ESCAPED = JWB.SEMATTRS_EXCEPTION_STACKTRACE = JWB.SEMATTRS_EXCEPTION_MESSAGE = JWB.SEMATTRS_EXCEPTION_TYPE = JWB.SEMATTRS_DB_SQL_TABLE = JWB.SEMATTRS_DB_MONGODB_COLLECTION = JWB.SEMATTRS_DB_REDIS_DATABASE_INDEX = JWB.SEMATTRS_DB_HBASE_NAMESPACE = JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = JWB.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = JWB.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = JWB.SEMATTRS_DB_CASSANDRA_TABLE = JWB.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = JWB.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = JWB.SEMATTRS_DB_CASSANDRA_KEYSPACE = JWB.SEMATTRS_DB_MSSQL_INSTANCE_NAME = JWB.SEMATTRS_DB_OPERATION = JWB.SEMATTRS_DB_STATEMENT = JWB.SEMATTRS_DB_NAME = JWB.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = JWB.SEMATTRS_DB_USER = JWB.SEMATTRS_DB_CONNECTION_STRING = JWB.SEMATTRS_DB_SYSTEM = JWB.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = void 0;
  JWB.SEMATTRS_MESSAGING_DESTINATION_KIND = JWB.SEMATTRS_MESSAGING_DESTINATION = JWB.SEMATTRS_MESSAGING_SYSTEM = JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = JWB.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = JWB.SEMATTRS_AWS_DYNAMODB_COUNT = JWB.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = JWB.SEMATTRS_AWS_DYNAMODB_SEGMENT = JWB.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = JWB.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = JWB.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = JWB.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = JWB.SEMATTRS_AWS_DYNAMODB_SELECT = JWB.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = JWB.SEMATTRS_AWS_DYNAMODB_LIMIT = JWB.SEMATTRS_AWS_DYNAMODB_PROJECTION = JWB.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = JWB.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = JWB.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = JWB.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = JWB.SEMATTRS_HTTP_CLIENT_IP = JWB.SEMATTRS_HTTP_ROUTE = JWB.SEMATTRS_HTTP_SERVER_NAME = JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = JWB.SEMATTRS_HTTP_USER_AGENT = JWB.SEMATTRS_HTTP_FLAVOR = JWB.SEMATTRS_HTTP_STATUS_CODE = JWB.SEMATTRS_HTTP_SCHEME = JWB.SEMATTRS_HTTP_HOST = JWB.SEMATTRS_HTTP_TARGET = JWB.SEMATTRS_HTTP_URL = JWB.SEMATTRS_HTTP_METHOD = JWB.SEMATTRS_CODE_LINENO = JWB.SEMATTRS_CODE_FILEPATH = JWB.SEMATTRS_CODE_NAMESPACE = JWB.SEMATTRS_CODE_FUNCTION = JWB.SEMATTRS_THREAD_NAME = JWB.SEMATTRS_THREAD_ID = JWB.SEMATTRS_ENDUSER_SCOPE = JWB.SEMATTRS_ENDUSER_ROLE = JWB.SEMATTRS_ENDUSER_ID = JWB.SEMATTRS_PEER_SERVICE = void 0;
  JWB.DBSYSTEMVALUES_FILEMAKER = JWB.DBSYSTEMVALUES_DERBY = JWB.DBSYSTEMVALUES_FIREBIRD = JWB.DBSYSTEMVALUES_ADABAS = JWB.DBSYSTEMVALUES_CACHE = JWB.DBSYSTEMVALUES_EDB = JWB.DBSYSTEMVALUES_FIRSTSQL = JWB.DBSYSTEMVALUES_INGRES = JWB.DBSYSTEMVALUES_HANADB = JWB.DBSYSTEMVALUES_MAXDB = JWB.DBSYSTEMVALUES_PROGRESS = JWB.DBSYSTEMVALUES_HSQLDB = JWB.DBSYSTEMVALUES_CLOUDSCAPE = JWB.DBSYSTEMVALUES_HIVE = JWB.DBSYSTEMVALUES_REDSHIFT = JWB.DBSYSTEMVALUES_POSTGRESQL = JWB.DBSYSTEMVALUES_DB2 = JWB.DBSYSTEMVALUES_ORACLE = JWB.DBSYSTEMVALUES_MYSQL = JWB.DBSYSTEMVALUES_MSSQL = JWB.DBSYSTEMVALUES_OTHER_SQL = JWB.SemanticAttributes = JWB.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = JWB.SEMATTRS_MESSAGE_COMPRESSED_SIZE = JWB.SEMATTRS_MESSAGE_ID = JWB.SEMATTRS_MESSAGE_TYPE = JWB.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = JWB.SEMATTRS_RPC_JSONRPC_ERROR_CODE = JWB.SEMATTRS_RPC_JSONRPC_REQUEST_ID = JWB.SEMATTRS_RPC_JSONRPC_VERSION = JWB.SEMATTRS_RPC_GRPC_STATUS_CODE = JWB.SEMATTRS_RPC_METHOD = JWB.SEMATTRS_RPC_SERVICE = JWB.SEMATTRS_RPC_SYSTEM = JWB.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = JWB.SEMATTRS_MESSAGING_KAFKA_PARTITION = JWB.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = JWB.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = JWB.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = JWB.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = JWB.SEMATTRS_MESSAGING_CONSUMER_ID = JWB.SEMATTRS_MESSAGING_OPERATION = JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = JWB.SEMATTRS_MESSAGING_CONVERSATION_ID = JWB.SEMATTRS_MESSAGING_MESSAGE_ID = JWB.SEMATTRS_MESSAGING_URL = JWB.SEMATTRS_MESSAGING_PROTOCOL_VERSION = JWB.SEMATTRS_MESSAGING_PROTOCOL = JWB.SEMATTRS_MESSAGING_TEMP_DESTINATION = void 0;
  JWB.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = JWB.FaasDocumentOperationValues = JWB.FAASDOCUMENTOPERATIONVALUES_DELETE = JWB.FAASDOCUMENTOPERATIONVALUES_EDIT = JWB.FAASDOCUMENTOPERATIONVALUES_INSERT = JWB.FaasTriggerValues = JWB.FAASTRIGGERVALUES_OTHER = JWB.FAASTRIGGERVALUES_TIMER = JWB.FAASTRIGGERVALUES_PUBSUB = JWB.FAASTRIGGERVALUES_HTTP = JWB.FAASTRIGGERVALUES_DATASOURCE = JWB.DbCassandraConsistencyLevelValues = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = JWB.DbSystemValues = JWB.DBSYSTEMVALUES_COCKROACHDB = JWB.DBSYSTEMVALUES_MEMCACHED = JWB.DBSYSTEMVALUES_ELASTICSEARCH = JWB.DBSYSTEMVALUES_GEODE = JWB.DBSYSTEMVALUES_NEO4J = JWB.DBSYSTEMVALUES_DYNAMODB = JWB.DBSYSTEMVALUES_COSMOSDB = JWB.DBSYSTEMVALUES_COUCHDB = JWB.DBSYSTEMVALUES_COUCHBASE = JWB.DBSYSTEMVALUES_REDIS = JWB.DBSYSTEMVALUES_MONGODB = JWB.DBSYSTEMVALUES_HBASE = JWB.DBSYSTEMVALUES_CASSANDRA = JWB.DBSYSTEMVALUES_COLDFUSION = JWB.DBSYSTEMVALUES_H2 = JWB.DBSYSTEMVALUES_VERTICA = JWB.DBSYSTEMVALUES_TERADATA = JWB.DBSYSTEMVALUES_SYBASE = JWB.DBSYSTEMVALUES_SQLITE = JWB.DBSYSTEMVALUES_POINTBASE = JWB.DBSYSTEMVALUES_PERVASIVE = JWB.DBSYSTEMVALUES_NETEZZA = JWB.DBSYSTEMVALUES_MARIADB = JWB.DBSYSTEMVALUES_INTERBASE = JWB.DBSYSTEMVALUES_INSTANTDB = JWB.DBSYSTEMVALUES_INFORMIX = void 0;
  JWB.MESSAGINGOPERATIONVALUES_RECEIVE = JWB.MessagingDestinationKindValues = JWB.MESSAGINGDESTINATIONKINDVALUES_TOPIC = JWB.MESSAGINGDESTINATIONKINDVALUES_QUEUE = JWB.HttpFlavorValues = JWB.HTTPFLAVORVALUES_QUIC = JWB.HTTPFLAVORVALUES_SPDY = JWB.HTTPFLAVORVALUES_HTTP_2_0 = JWB.HTTPFLAVORVALUES_HTTP_1_1 = JWB.HTTPFLAVORVALUES_HTTP_1_0 = JWB.NetHostConnectionSubtypeValues = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NR = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = JWB.NetHostConnectionTypeValues = JWB.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = JWB.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = JWB.NETHOSTCONNECTIONTYPEVALUES_CELL = JWB.NETHOSTCONNECTIONTYPEVALUES_WIRED = JWB.NETHOSTCONNECTIONTYPEVALUES_WIFI = JWB.NetTransportValues = JWB.NETTRANSPORTVALUES_OTHER = JWB.NETTRANSPORTVALUES_INPROC = JWB.NETTRANSPORTVALUES_PIPE = JWB.NETTRANSPORTVALUES_UNIX = JWB.NETTRANSPORTVALUES_IP = JWB.NETTRANSPORTVALUES_IP_UDP = JWB.NETTRANSPORTVALUES_IP_TCP = JWB.FaasInvokedProviderValues = JWB.FAASINVOKEDPROVIDERVALUES_GCP = JWB.FAASINVOKEDPROVIDERVALUES_AZURE = JWB.FAASINVOKEDPROVIDERVALUES_AWS = void 0;
  JWB.MessageTypeValues = JWB.MESSAGETYPEVALUES_RECEIVED = JWB.MESSAGETYPEVALUES_SENT = JWB.RpcGrpcStatusCodeValues = JWB.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = JWB.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = JWB.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = JWB.RPCGRPCSTATUSCODEVALUES_INTERNAL = JWB.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = JWB.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = JWB.RPCGRPCSTATUSCODEVALUES_ABORTED = JWB.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = JWB.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = JWB.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = JWB.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = JWB.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = JWB.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = JWB.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = JWB.RPCGRPCSTATUSCODEVALUES_UNKNOWN = JWB.RPCGRPCSTATUSCODEVALUES_CANCELLED = JWB.RPCGRPCSTATUSCODEVALUES_OK = JWB.MessagingOperationValues = JWB.MESSAGINGOPERATIONVALUES_PROCESS = void 0;
  var GM = Lf1(),
    UGB = "aws.lambda.invoked_arn",
    $GB = "db.system",
    wGB = "db.connection_string",
    qGB = "db.user",
    NGB = "db.jdbc.driver_classname",
    LGB = "db.name",
    MGB = "db.statement",
    OGB = "db.operation",
    RGB = "db.mssql.instance_name",
    TGB = "db.cassandra.keyspace",
    PGB = "db.cassandra.page_size",
    jGB = "db.cassandra.consistency_level",
    SGB = "db.cassandra.table",
    _GB = "db.cassandra.idempotence",
    kGB = "db.cassandra.speculative_execution_count",
    yGB = "db.cassandra.coordinator.id",
    xGB = "db.cassandra.coordinator.dc",
    vGB = "db.hbase.namespace",
    bGB = "db.redis.database_index",
    fGB = "db.mongodb.collection",
    hGB = "db.sql.table",
    gGB = "exception.type",
    uGB = "exception.message",
    mGB = "exception.stacktrace",
    dGB = "exception.escaped",
    cGB = "faas.trigger",
    pGB = "faas.execution",
    lGB = "faas.document.collection",
    iGB = "faas.document.operation",
    nGB = "faas.document.time",
    aGB = "faas.document.name",
    sGB = "faas.time",
    rGB = "faas.cron",
    oGB = "faas.coldstart",
    tGB = "faas.invoked_name",
    eGB = "faas.invoked_provider",
    AZB = "faas.invoked_region",
    QZB = "net.transport",
    BZB = "net.peer.ip",
    GZB = "net.peer.port",
    ZZB = "net.peer.name",
    IZB = "net.host.ip",
    YZB = "net.host.port",
    JZB = "net.host.name",
    WZB = "net.host.connection.type",
    XZB = "net.host.connection.subtype",
    VZB = "net.host.carrier.name",
    FZB = "net.host.carrier.mcc",
    KZB = "net.host.carrier.mnc",
    DZB = "net.host.carrier.icc",
    HZB = "peer.service",
    CZB = "enduser.id",
    EZB = "enduser.role",
    zZB = "enduser.scope",
    UZB = "thread.id",
    $ZB = "thread.name",
    wZB = "code.function",
    qZB = "code.namespace",
    NZB = "code.filepath",
    LZB = "code.lineno",
    MZB = "http.method",
    OZB = "http.url",
    RZB = "http.target",
    TZB = "http.host",
    PZB = "http.scheme",
    jZB = "http.status_code",
    SZB = "http.flavor",
    _ZB = "http.user_agent",
    kZB = "http.request_content_length",
    yZB = "http.request_content_length_uncompressed",
    xZB = "http.response_content_length",
    vZB = "http.response_content_length_uncompressed",
    bZB = "http.server_name",
    fZB = "http.route",
    hZB = "http.client_ip",
    gZB = "aws.dynamodb.table_names",
    uZB = "aws.dynamodb.consumed_capacity",
    mZB = "aws.dynamodb.item_collection_metrics",
    dZB = "aws.dynamodb.provisioned_read_capacity",
    cZB = "aws.dynamodb.provisioned_write_capacity",
    pZB = "aws.dynamodb.consistent_read",
    lZB = "aws.dynamodb.projection",
    iZB = "aws.dynamodb.limit",
    nZB = "aws.dynamodb.attributes_to_get",
    aZB = "aws.dynamodb.index_name",
    sZB = "aws.dynamodb.select",
    rZB = "aws.dynamodb.global_secondary_indexes",
    oZB = "aws.dynamodb.local_secondary_indexes",
    tZB = "aws.dynamodb.exclusive_start_table",
    eZB = "aws.dynamodb.table_count",
    AIB = "aws.dynamodb.scan_forward",
    QIB = "aws.dynamodb.segment",
    BIB = "aws.dynamodb.total_segments",
    GIB = "aws.dynamodb.count",
    ZIB = "aws.dynamodb.scanned_count",
    IIB = "aws.dynamodb.attribute_definitions",
    YIB = "aws.dynamodb.global_secondary_index_updates",
    JIB = "messaging.system",
    WIB = "messaging.destination",
    XIB = "messaging.destination_kind",
    VIB = "messaging.temp_destination",
    FIB = "messaging.protocol",
    KIB = "messaging.protocol_version",
    DIB = "messaging.url",
    HIB = "messaging.message_id",
    CIB = "messaging.conversation_id",
    EIB = "messaging.message_payload_size_bytes",
    zIB = "messaging.message_payload_compressed_size_bytes",
    UIB = "messaging.operation",
    $IB = "messaging.consumer_id",
    wIB = "messaging.rabbitmq.routing_key",
    qIB = "messaging.kafka.message_key",
    NIB = "messaging.kafka.consumer_group",
    LIB = "messaging.kafka.client_id",
    MIB = "messaging.kafka.partition",
    OIB = "messaging.kafka.tombstone",
    RIB = "rpc.system",
    TIB = "rpc.service",
    PIB = "rpc.method",
    jIB = "rpc.grpc.status_code",
    SIB = "rpc.jsonrpc.version",
    _IB = "rpc.jsonrpc.request_id",
    kIB = "rpc.jsonrpc.error_code",
    yIB = "rpc.jsonrpc.error_message",
    xIB = "message.type",
    vIB = "message.id",
    bIB = "message.compressed_size",
    fIB = "message.uncompressed_size";
  JWB.SEMATTRS_AWS_LAMBDA_INVOKED_ARN = UGB;
  JWB.SEMATTRS_DB_SYSTEM = $GB;
  JWB.SEMATTRS_DB_CONNECTION_STRING = wGB;
  JWB.SEMATTRS_DB_USER = qGB;
  JWB.SEMATTRS_DB_JDBC_DRIVER_CLASSNAME = NGB;
  JWB.SEMATTRS_DB_NAME = LGB;
  JWB.SEMATTRS_DB_STATEMENT = MGB;
  JWB.SEMATTRS_DB_OPERATION = OGB;
  JWB.SEMATTRS_DB_MSSQL_INSTANCE_NAME = RGB;
  JWB.SEMATTRS_DB_CASSANDRA_KEYSPACE = TGB;
  JWB.SEMATTRS_DB_CASSANDRA_PAGE_SIZE = PGB;
  JWB.SEMATTRS_DB_CASSANDRA_CONSISTENCY_LEVEL = jGB;
  JWB.SEMATTRS_DB_CASSANDRA_TABLE = SGB;
  JWB.SEMATTRS_DB_CASSANDRA_IDEMPOTENCE = _GB;
  JWB.SEMATTRS_DB_CASSANDRA_SPECULATIVE_EXECUTION_COUNT = kGB;
  JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_ID = yGB;
  JWB.SEMATTRS_DB_CASSANDRA_COORDINATOR_DC = xGB;
  JWB.SEMATTRS_DB_HBASE_NAMESPACE = vGB;
  JWB.SEMATTRS_DB_REDIS_DATABASE_INDEX = bGB;
  JWB.SEMATTRS_DB_MONGODB_COLLECTION = fGB;
  JWB.SEMATTRS_DB_SQL_TABLE = hGB;
  JWB.SEMATTRS_EXCEPTION_TYPE = gGB;
  JWB.SEMATTRS_EXCEPTION_MESSAGE = uGB;
  JWB.SEMATTRS_EXCEPTION_STACKTRACE = mGB;
  JWB.SEMATTRS_EXCEPTION_ESCAPED = dGB;
  JWB.SEMATTRS_FAAS_TRIGGER = cGB;
  JWB.SEMATTRS_FAAS_EXECUTION = pGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_COLLECTION = lGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_OPERATION = iGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_TIME = nGB;
  JWB.SEMATTRS_FAAS_DOCUMENT_NAME = aGB;
  JWB.SEMATTRS_FAAS_TIME = sGB;
  JWB.SEMATTRS_FAAS_CRON = rGB;
  JWB.SEMATTRS_FAAS_COLDSTART = oGB;
  JWB.SEMATTRS_FAAS_INVOKED_NAME = tGB;
  JWB.SEMATTRS_FAAS_INVOKED_PROVIDER = eGB;
  JWB.SEMATTRS_FAAS_INVOKED_REGION = AZB;
  JWB.SEMATTRS_NET_TRANSPORT = QZB;
  JWB.SEMATTRS_NET_PEER_IP = BZB;
  JWB.SEMATTRS_NET_PEER_PORT = GZB;
  JWB.SEMATTRS_NET_PEER_NAME = ZZB;
  JWB.SEMATTRS_NET_HOST_IP = IZB;
  JWB.SEMATTRS_NET_HOST_PORT = YZB;
  JWB.SEMATTRS_NET_HOST_NAME = JZB;
  JWB.SEMATTRS_NET_HOST_CONNECTION_TYPE = WZB;
  JWB.SEMATTRS_NET_HOST_CONNECTION_SUBTYPE = XZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_NAME = VZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_MCC = FZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_MNC = KZB;
  JWB.SEMATTRS_NET_HOST_CARRIER_ICC = DZB;
  JWB.SEMATTRS_PEER_SERVICE = HZB;
  JWB.SEMATTRS_ENDUSER_ID = CZB;
  JWB.SEMATTRS_ENDUSER_ROLE = EZB;
  JWB.SEMATTRS_ENDUSER_SCOPE = zZB;
  JWB.SEMATTRS_THREAD_ID = UZB;
  JWB.SEMATTRS_THREAD_NAME = $ZB;
  JWB.SEMATTRS_CODE_FUNCTION = wZB;
  JWB.SEMATTRS_CODE_NAMESPACE = qZB;
  JWB.SEMATTRS_CODE_FILEPATH = NZB;
  JWB.SEMATTRS_CODE_LINENO = LZB;
  JWB.SEMATTRS_HTTP_METHOD = MZB;
  JWB.SEMATTRS_HTTP_URL = OZB;
  JWB.SEMATTRS_HTTP_TARGET = RZB;
  JWB.SEMATTRS_HTTP_HOST = TZB;
  JWB.SEMATTRS_HTTP_SCHEME = PZB;
  JWB.SEMATTRS_HTTP_STATUS_CODE = jZB;
  JWB.SEMATTRS_HTTP_FLAVOR = SZB;
  JWB.SEMATTRS_HTTP_USER_AGENT = _ZB;
  JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH = kZB;
  JWB.SEMATTRS_HTTP_REQUEST_CONTENT_LENGTH_UNCOMPRESSED = yZB;
  JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH = xZB;
  JWB.SEMATTRS_HTTP_RESPONSE_CONTENT_LENGTH_UNCOMPRESSED = vZB;
  JWB.SEMATTRS_HTTP_SERVER_NAME = bZB;
  JWB.SEMATTRS_HTTP_ROUTE = fZB;
  JWB.SEMATTRS_HTTP_CLIENT_IP = hZB;
  JWB.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES = gZB;
  JWB.SEMATTRS_AWS_DYNAMODB_CONSUMED_CAPACITY = uZB;
  JWB.SEMATTRS_AWS_DYNAMODB_ITEM_COLLECTION_METRICS = mZB;
  JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_READ_CAPACITY = dZB;
  JWB.SEMATTRS_AWS_DYNAMODB_PROVISIONED_WRITE_CAPACITY = cZB;
  JWB.SEMATTRS_AWS_DYNAMODB_CONSISTENT_READ = pZB;
  JWB.SEMATTRS_AWS_DYNAMODB_PROJECTION = lZB;
  JWB.SEMATTRS_AWS_DYNAMODB_LIMIT = iZB;
  JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTES_TO_GET = nZB;
  JWB.SEMATTRS_AWS_DYNAMODB_INDEX_NAME = aZB;
  JWB.SEMATTRS_AWS_DYNAMODB_SELECT = sZB;
  JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEXES = rZB;
  JWB.SEMATTRS_AWS_DYNAMODB_LOCAL_SECONDARY_INDEXES = oZB;
  JWB.SEMATTRS_AWS_DYNAMODB_EXCLUSIVE_START_TABLE = tZB;
  JWB.SEMATTRS_AWS_DYNAMODB_TABLE_COUNT = eZB;
  JWB.SEMATTRS_AWS_DYNAMODB_SCAN_FORWARD = AIB;
  JWB.SEMATTRS_AWS_DYNAMODB_SEGMENT = QIB;
  JWB.SEMATTRS_AWS_DYNAMODB_TOTAL_SEGMENTS = BIB;
  JWB.SEMATTRS_AWS_DYNAMODB_COUNT = GIB;
  JWB.SEMATTRS_AWS_DYNAMODB_SCANNED_COUNT = ZIB;
  JWB.SEMATTRS_AWS_DYNAMODB_ATTRIBUTE_DEFINITIONS = IIB;
  JWB.SEMATTRS_AWS_DYNAMODB_GLOBAL_SECONDARY_INDEX_UPDATES = YIB;
  JWB.SEMATTRS_MESSAGING_SYSTEM = JIB;
  JWB.SEMATTRS_MESSAGING_DESTINATION = WIB;
  JWB.SEMATTRS_MESSAGING_DESTINATION_KIND = XIB;
  JWB.SEMATTRS_MESSAGING_TEMP_DESTINATION = VIB;
  JWB.SEMATTRS_MESSAGING_PROTOCOL = FIB;
  JWB.SEMATTRS_MESSAGING_PROTOCOL_VERSION = KIB;
  JWB.SEMATTRS_MESSAGING_URL = DIB;
  JWB.SEMATTRS_MESSAGING_MESSAGE_ID = HIB;
  JWB.SEMATTRS_MESSAGING_CONVERSATION_ID = CIB;
  JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES = EIB;
  JWB.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_COMPRESSED_SIZE_BYTES = zIB;
  JWB.SEMATTRS_MESSAGING_OPERATION = UIB;
  JWB.SEMATTRS_MESSAGING_CONSUMER_ID = $IB;
  JWB.SEMATTRS_MESSAGING_RABBITMQ_ROUTING_KEY = wIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_MESSAGE_KEY = qIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_CONSUMER_GROUP = NIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_CLIENT_ID = LIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_PARTITION = MIB;
  JWB.SEMATTRS_MESSAGING_KAFKA_TOMBSTONE = OIB;
  JWB.SEMATTRS_RPC_SYSTEM = RIB;
  JWB.SEMATTRS_RPC_SERVICE = TIB;
  JWB.SEMATTRS_RPC_METHOD = PIB;
  JWB.SEMATTRS_RPC_GRPC_STATUS_CODE = jIB;
  JWB.SEMATTRS_RPC_JSONRPC_VERSION = SIB;
  JWB.SEMATTRS_RPC_JSONRPC_REQUEST_ID = _IB;
  JWB.SEMATTRS_RPC_JSONRPC_ERROR_CODE = kIB;
  JWB.SEMATTRS_RPC_JSONRPC_ERROR_MESSAGE = yIB;
  JWB.SEMATTRS_MESSAGE_TYPE = xIB;
  JWB.SEMATTRS_MESSAGE_ID = vIB;
  JWB.SEMATTRS_MESSAGE_COMPRESSED_SIZE = bIB;
  JWB.SEMATTRS_MESSAGE_UNCOMPRESSED_SIZE = fIB;
  JWB.SemanticAttributes = (0, GM.createConstMap)([UGB, $GB, wGB, qGB, NGB, LGB, MGB, OGB, RGB, TGB, PGB, jGB, SGB, _GB, kGB, yGB, xGB, vGB, bGB, fGB, hGB, gGB, uGB, mGB, dGB, cGB, pGB, lGB, iGB, nGB, aGB, sGB, rGB, oGB, tGB, eGB, AZB, QZB, BZB, GZB, ZZB, IZB, YZB, JZB, WZB, XZB, VZB, FZB, KZB, DZB, HZB, CZB, EZB, zZB, UZB, $ZB, wZB, qZB, NZB, LZB, MZB, OZB, RZB, TZB, PZB, jZB, SZB, _ZB, kZB, yZB, xZB, vZB, bZB, fZB, hZB, gZB, uZB, mZB, dZB, cZB, pZB, lZB, iZB, nZB, aZB, sZB, rZB, oZB, tZB, eZB, AIB, QIB, BIB, GIB, ZIB, IIB, YIB, JIB, WIB, XIB, VIB, FIB, KIB, DIB, HIB, CIB, EIB, zIB, UIB, $IB, wIB, qIB, NIB, LIB, MIB, OIB, RIB, TIB, PIB, jIB, SIB, _IB, kIB, yIB, xIB, vIB, bIB, fIB]);
  var hIB = "other_sql",
    gIB = "mssql",
    uIB = "mysql",
    mIB = "oracle",
    dIB = "db2",
    cIB = "postgresql",
    pIB = "redshift",
    lIB = "hive",
    iIB = "cloudscape",
    nIB = "hsqldb",
    aIB = "progress",
    sIB = "maxdb",
    rIB = "hanadb",
    oIB = "ingres",
    tIB = "firstsql",
    eIB = "edb",
    AYB = "cache",
    QYB = "adabas",
    BYB = "firebird",
    GYB = "derby",
    ZYB = "filemaker",
    IYB = "informix",
    YYB = "instantdb",
    JYB = "interbase",
    WYB = "mariadb",
    XYB = "netezza",
    VYB = "pervasive",
    FYB = "pointbase",
    KYB = "sqlite",
    DYB = "sybase",
    HYB = "teradata",
    CYB = "vertica",
    EYB = "h2",
    zYB = "coldfusion",
    UYB = "cassandra",
    $YB = "hbase",
    wYB = "mongodb",
    qYB = "redis",
    NYB = "couchbase",
    LYB = "couchdb",
    MYB = "cosmosdb",
    OYB = "dynamodb",
    RYB = "neo4j",
    TYB = "geode",
    PYB = "elasticsearch",
    jYB = "memcached",
    SYB = "cockroachdb";
  JWB.DBSYSTEMVALUES_OTHER_SQL = hIB;
  JWB.DBSYSTEMVALUES_MSSQL = gIB;
  JWB.DBSYSTEMVALUES_MYSQL = uIB;
  JWB.DBSYSTEMVALUES_ORACLE = mIB;
  JWB.DBSYSTEMVALUES_DB2 = dIB;
  JWB.DBSYSTEMVALUES_POSTGRESQL = cIB;
  JWB.DBSYSTEMVALUES_REDSHIFT = pIB;
  JWB.DBSYSTEMVALUES_HIVE = lIB;
  JWB.DBSYSTEMVALUES_CLOUDSCAPE = iIB;
  JWB.DBSYSTEMVALUES_HSQLDB = nIB;
  JWB.DBSYSTEMVALUES_PROGRESS = aIB;
  JWB.DBSYSTEMVALUES_MAXDB = sIB;
  JWB.DBSYSTEMVALUES_HANADB = rIB;
  JWB.DBSYSTEMVALUES_INGRES = oIB;
  JWB.DBSYSTEMVALUES_FIRSTSQL = tIB;
  JWB.DBSYSTEMVALUES_EDB = eIB;
  JWB.DBSYSTEMVALUES_CACHE = AYB;
  JWB.DBSYSTEMVALUES_ADABAS = QYB;
  JWB.DBSYSTEMVALUES_FIREBIRD = BYB;
  JWB.DBSYSTEMVALUES_DERBY = GYB;
  JWB.DBSYSTEMVALUES_FILEMAKER = ZYB;
  JWB.DBSYSTEMVALUES_INFORMIX = IYB;
  JWB.DBSYSTEMVALUES_INSTANTDB = YYB;
  JWB.DBSYSTEMVALUES_INTERBASE = JYB;
  JWB.DBSYSTEMVALUES_MARIADB = WYB;
  JWB.DBSYSTEMVALUES_NETEZZA = XYB;
  JWB.DBSYSTEMVALUES_PERVASIVE = VYB;
  JWB.DBSYSTEMVALUES_POINTBASE = FYB;
  JWB.DBSYSTEMVALUES_SQLITE = KYB;
  JWB.DBSYSTEMVALUES_SYBASE = DYB;
  JWB.DBSYSTEMVALUES_TERADATA = HYB;
  JWB.DBSYSTEMVALUES_VERTICA = CYB;
  JWB.DBSYSTEMVALUES_H2 = EYB;
  JWB.DBSYSTEMVALUES_COLDFUSION = zYB;
  JWB.DBSYSTEMVALUES_CASSANDRA = UYB;
  JWB.DBSYSTEMVALUES_HBASE = $YB;
  JWB.DBSYSTEMVALUES_MONGODB = wYB;
  JWB.DBSYSTEMVALUES_REDIS = qYB;
  JWB.DBSYSTEMVALUES_COUCHBASE = NYB;
  JWB.DBSYSTEMVALUES_COUCHDB = LYB;
  JWB.DBSYSTEMVALUES_COSMOSDB = MYB;
  JWB.DBSYSTEMVALUES_DYNAMODB = OYB;
  JWB.DBSYSTEMVALUES_NEO4J = RYB;
  JWB.DBSYSTEMVALUES_GEODE = TYB;
  JWB.DBSYSTEMVALUES_ELASTICSEARCH = PYB;
  JWB.DBSYSTEMVALUES_MEMCACHED = jYB;
  JWB.DBSYSTEMVALUES_COCKROACHDB = SYB;
  JWB.DbSystemValues = (0, GM.createConstMap)([hIB, gIB, uIB, mIB, dIB, cIB, pIB, lIB, iIB, nIB, aIB, sIB, rIB, oIB, tIB, eIB, AYB, QYB, BYB, GYB, ZYB, IYB, YYB, JYB, WYB, XYB, VYB, FYB, KYB, DYB, HYB, CYB, EYB, zYB, UYB, $YB, wYB, qYB, NYB, LYB, MYB, OYB, RYB, TYB, PYB, jYB, SYB]);
  var _YB = "all",
    kYB = "each_quorum",
    yYB = "quorum",
    xYB = "local_quorum",
    vYB = "one",
    bYB = "two",
    fYB = "three",
    hYB = "local_one",
    gYB = "any",
    uYB = "serial",
    mYB = "local_serial";
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ALL = _YB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_EACH_QUORUM = kYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_QUORUM = yYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_QUORUM = xYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ONE = vYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_TWO = bYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_THREE = fYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_ONE = hYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_ANY = gYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_SERIAL = uYB;
  JWB.DBCASSANDRACONSISTENCYLEVELVALUES_LOCAL_SERIAL = mYB;
  JWB.DbCassandraConsistencyLevelValues = (0, GM.createConstMap)([_YB, kYB, yYB, xYB, vYB, bYB, fYB, hYB, gYB, uYB, mYB]);
  var dYB = "datasource",
    cYB = "http",
    pYB = "pubsub",
    lYB = "timer",
    iYB = "other";
  JWB.FAASTRIGGERVALUES_DATASOURCE = dYB;
  JWB.FAASTRIGGERVALUES_HTTP = cYB;
  JWB.FAASTRIGGERVALUES_PUBSUB = pYB;
  JWB.FAASTRIGGERVALUES_TIMER = lYB;
  JWB.FAASTRIGGERVALUES_OTHER = iYB;
  JWB.FaasTriggerValues = (0, GM.createConstMap)([dYB, cYB, pYB, lYB, iYB]);
  var nYB = "insert",
    aYB = "edit",
    sYB = "delete";
  JWB.FAASDOCUMENTOPERATIONVALUES_INSERT = nYB;
  JWB.FAASDOCUMENTOPERATIONVALUES_EDIT = aYB;
  JWB.FAASDOCUMENTOPERATIONVALUES_DELETE = sYB;
  JWB.FaasDocumentOperationValues = (0, GM.createConstMap)([nYB, aYB, sYB]);
  var rYB = "alibaba_cloud",
    oYB = "aws",
    tYB = "azure",
    eYB = "gcp";
  JWB.FAASINVOKEDPROVIDERVALUES_ALIBABA_CLOUD = rYB;
  JWB.FAASINVOKEDPROVIDERVALUES_AWS = oYB;
  JWB.FAASINVOKEDPROVIDERVALUES_AZURE = tYB;
  JWB.FAASINVOKEDPROVIDERVALUES_GCP = eYB;
  JWB.FaasInvokedProviderValues = (0, GM.createConstMap)([rYB, oYB, tYB, eYB]);
  var AJB = "ip_tcp",
    QJB = "ip_udp",
    BJB = "ip",
    GJB = "unix",
    ZJB = "pipe",
    IJB = "inproc",
    YJB = "other";
  JWB.NETTRANSPORTVALUES_IP_TCP = AJB;
  JWB.NETTRANSPORTVALUES_IP_UDP = QJB;
  JWB.NETTRANSPORTVALUES_IP = BJB;
  JWB.NETTRANSPORTVALUES_UNIX = GJB;
  JWB.NETTRANSPORTVALUES_PIPE = ZJB;
  JWB.NETTRANSPORTVALUES_INPROC = IJB;
  JWB.NETTRANSPORTVALUES_OTHER = YJB;
  JWB.NetTransportValues = (0, GM.createConstMap)([AJB, QJB, BJB, GJB, ZJB, IJB, YJB]);
  var JJB = "wifi",
    WJB = "wired",
    XJB = "cell",
    VJB = "unavailable",
    FJB = "unknown";
  JWB.NETHOSTCONNECTIONTYPEVALUES_WIFI = JJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_WIRED = WJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_CELL = XJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_UNAVAILABLE = VJB;
  JWB.NETHOSTCONNECTIONTYPEVALUES_UNKNOWN = FJB;
  JWB.NetHostConnectionTypeValues = (0, GM.createConstMap)([JJB, WJB, XJB, VJB, FJB]);
  var KJB = "gprs",
    DJB = "edge",
    HJB = "umts",
    CJB = "cdma",
    EJB = "evdo_0",
    zJB = "evdo_a",
    UJB = "cdma2000_1xrtt",
    $JB = "hsdpa",
    wJB = "hsupa",
    qJB = "hspa",
    NJB = "iden",
    LJB = "evdo_b",
    MJB = "lte",
    OJB = "ehrpd",
    RJB = "hspap",
    TJB = "gsm",
    PJB = "td_scdma",
    jJB = "iwlan",
    SJB = "nr",
    _JB = "nrnsa",
    kJB = "lte_ca";
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GPRS = KJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EDGE = DJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_UMTS = HJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA = CJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_0 = EJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_A = zJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_CDMA2000_1XRTT = UJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSDPA = $JB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSUPA = wJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPA = qJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IDEN = NJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EVDO_B = LJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE = MJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_EHRPD = OJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_HSPAP = RJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_GSM = TJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_TD_SCDMA = PJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_IWLAN = jJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NR = SJB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_NRNSA = _JB;
  JWB.NETHOSTCONNECTIONSUBTYPEVALUES_LTE_CA = kJB;
  JWB.NetHostConnectionSubtypeValues = (0, GM.createConstMap)([KJB, DJB, HJB, CJB, EJB, zJB, UJB, $JB, wJB, qJB, NJB, LJB, MJB, OJB, RJB, TJB, PJB, jJB, SJB, _JB, kJB]);
  var yJB = "1.0",
    xJB = "1.1",
    vJB = "2.0",
    bJB = "SPDY",
    fJB = "QUIC";
  JWB.HTTPFLAVORVALUES_HTTP_1_0 = yJB;
  JWB.HTTPFLAVORVALUES_HTTP_1_1 = xJB;
  JWB.HTTPFLAVORVALUES_HTTP_2_0 = vJB;
  JWB.HTTPFLAVORVALUES_SPDY = bJB;
  JWB.HTTPFLAVORVALUES_QUIC = fJB;
  JWB.HttpFlavorValues = {
    HTTP_1_0: yJB,
    HTTP_1_1: xJB,
    HTTP_2_0: vJB,
    SPDY: bJB,
    QUIC: fJB
  };
  var hJB = "queue",
    gJB = "topic";
  JWB.MESSAGINGDESTINATIONKINDVALUES_QUEUE = hJB;
  JWB.MESSAGINGDESTINATIONKINDVALUES_TOPIC = gJB;
  JWB.MessagingDestinationKindValues = (0, GM.createConstMap)([hJB, gJB]);
  var uJB = "receive",
    mJB = "process";
  JWB.MESSAGINGOPERATIONVALUES_RECEIVE = uJB;
  JWB.MESSAGINGOPERATIONVALUES_PROCESS = mJB;
  JWB.MessagingOperationValues = (0, GM.createConstMap)([uJB, mJB]);
  var dJB = 0,
    cJB = 1,
    pJB = 2,
    lJB = 3,
    iJB = 4,
    nJB = 5,
    aJB = 6,
    sJB = 7,
    rJB = 8,
    oJB = 9,
    tJB = 10,
    eJB = 11,
    AWB = 12,
    QWB = 13,
    BWB = 14,
    GWB = 15,
    ZWB = 16;
  JWB.RPCGRPCSTATUSCODEVALUES_OK = dJB;
  JWB.RPCGRPCSTATUSCODEVALUES_CANCELLED = cJB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNKNOWN = pJB;
  JWB.RPCGRPCSTATUSCODEVALUES_INVALID_ARGUMENT = lJB;
  JWB.RPCGRPCSTATUSCODEVALUES_DEADLINE_EXCEEDED = iJB;
  JWB.RPCGRPCSTATUSCODEVALUES_NOT_FOUND = nJB;
  JWB.RPCGRPCSTATUSCODEVALUES_ALREADY_EXISTS = aJB;
  JWB.RPCGRPCSTATUSCODEVALUES_PERMISSION_DENIED = sJB;
  JWB.RPCGRPCSTATUSCODEVALUES_RESOURCE_EXHAUSTED = rJB;
  JWB.RPCGRPCSTATUSCODEVALUES_FAILED_PRECONDITION = oJB;
  JWB.RPCGRPCSTATUSCODEVALUES_ABORTED = tJB;
  JWB.RPCGRPCSTATUSCODEVALUES_OUT_OF_RANGE = eJB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNIMPLEMENTED = AWB;
  JWB.RPCGRPCSTATUSCODEVALUES_INTERNAL = QWB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNAVAILABLE = BWB;
  JWB.RPCGRPCSTATUSCODEVALUES_DATA_LOSS = GWB;
  JWB.RPCGRPCSTATUSCODEVALUES_UNAUTHENTICATED = ZWB;
  JWB.RpcGrpcStatusCodeValues = {
    OK: dJB,
    CANCELLED: cJB,
    UNKNOWN: pJB,
    INVALID_ARGUMENT: lJB,
    DEADLINE_EXCEEDED: iJB,
    NOT_FOUND: nJB,
    ALREADY_EXISTS: aJB,
    PERMISSION_DENIED: sJB,
    RESOURCE_EXHAUSTED: rJB,
    FAILED_PRECONDITION: oJB,
    ABORTED: tJB,
    OUT_OF_RANGE: eJB,
    UNIMPLEMENTED: AWB,
    INTERNAL: QWB,
    UNAVAILABLE: BWB,
    DATA_LOSS: GWB,
    UNAUTHENTICATED: ZWB
  };
  var IWB = "SENT",
    YWB = "RECEIVED";
  JWB.MESSAGETYPEVALUES_SENT = IWB;
  JWB.MESSAGETYPEVALUES_RECEIVED = YWB;
  JWB.MessageTypeValues = (0, GM.createConstMap)([IWB, YWB])
})
// @from(Start 5294219, End 5294954)
CWB = z((Ut) => {
  var E96 = Ut && Ut.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    z96 = Ut && Ut.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) E96(Q, A, B)
    };
  Object.defineProperty(Ut, "__esModule", {
    value: !0
  });
  z96(HWB(), Ut)
})
// @from(Start 5294960, End 5310066)
pVB = z((uVB) => {
  Object.defineProperty(uVB, "__esModule", {
    value: !0
  });
  uVB.SEMRESATTRS_K8S_STATEFULSET_NAME = uVB.SEMRESATTRS_K8S_STATEFULSET_UID = uVB.SEMRESATTRS_K8S_DEPLOYMENT_NAME = uVB.SEMRESATTRS_K8S_DEPLOYMENT_UID = uVB.SEMRESATTRS_K8S_REPLICASET_NAME = uVB.SEMRESATTRS_K8S_REPLICASET_UID = uVB.SEMRESATTRS_K8S_CONTAINER_NAME = uVB.SEMRESATTRS_K8S_POD_NAME = uVB.SEMRESATTRS_K8S_POD_UID = uVB.SEMRESATTRS_K8S_NAMESPACE_NAME = uVB.SEMRESATTRS_K8S_NODE_UID = uVB.SEMRESATTRS_K8S_NODE_NAME = uVB.SEMRESATTRS_K8S_CLUSTER_NAME = uVB.SEMRESATTRS_HOST_IMAGE_VERSION = uVB.SEMRESATTRS_HOST_IMAGE_ID = uVB.SEMRESATTRS_HOST_IMAGE_NAME = uVB.SEMRESATTRS_HOST_ARCH = uVB.SEMRESATTRS_HOST_TYPE = uVB.SEMRESATTRS_HOST_NAME = uVB.SEMRESATTRS_HOST_ID = uVB.SEMRESATTRS_FAAS_MAX_MEMORY = uVB.SEMRESATTRS_FAAS_INSTANCE = uVB.SEMRESATTRS_FAAS_VERSION = uVB.SEMRESATTRS_FAAS_ID = uVB.SEMRESATTRS_FAAS_NAME = uVB.SEMRESATTRS_DEVICE_MODEL_NAME = uVB.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = uVB.SEMRESATTRS_DEVICE_ID = uVB.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = uVB.SEMRESATTRS_CONTAINER_IMAGE_TAG = uVB.SEMRESATTRS_CONTAINER_IMAGE_NAME = uVB.SEMRESATTRS_CONTAINER_RUNTIME = uVB.SEMRESATTRS_CONTAINER_ID = uVB.SEMRESATTRS_CONTAINER_NAME = uVB.SEMRESATTRS_AWS_LOG_STREAM_ARNS = uVB.SEMRESATTRS_AWS_LOG_STREAM_NAMES = uVB.SEMRESATTRS_AWS_LOG_GROUP_ARNS = uVB.SEMRESATTRS_AWS_LOG_GROUP_NAMES = uVB.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = uVB.SEMRESATTRS_AWS_ECS_TASK_REVISION = uVB.SEMRESATTRS_AWS_ECS_TASK_FAMILY = uVB.SEMRESATTRS_AWS_ECS_TASK_ARN = uVB.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = uVB.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = uVB.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = uVB.SEMRESATTRS_CLOUD_PLATFORM = uVB.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = uVB.SEMRESATTRS_CLOUD_REGION = uVB.SEMRESATTRS_CLOUD_ACCOUNT_ID = uVB.SEMRESATTRS_CLOUD_PROVIDER = void 0;
  uVB.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = uVB.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = uVB.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = uVB.CLOUDPLATFORMVALUES_AZURE_AKS = uVB.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = uVB.CLOUDPLATFORMVALUES_AZURE_VM = uVB.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = uVB.CLOUDPLATFORMVALUES_AWS_LAMBDA = uVB.CLOUDPLATFORMVALUES_AWS_EKS = uVB.CLOUDPLATFORMVALUES_AWS_ECS = uVB.CLOUDPLATFORMVALUES_AWS_EC2 = uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = uVB.CloudProviderValues = uVB.CLOUDPROVIDERVALUES_GCP = uVB.CLOUDPROVIDERVALUES_AZURE = uVB.CLOUDPROVIDERVALUES_AWS = uVB.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = uVB.SemanticResourceAttributes = uVB.SEMRESATTRS_WEBENGINE_DESCRIPTION = uVB.SEMRESATTRS_WEBENGINE_VERSION = uVB.SEMRESATTRS_WEBENGINE_NAME = uVB.SEMRESATTRS_TELEMETRY_AUTO_VERSION = uVB.SEMRESATTRS_TELEMETRY_SDK_VERSION = uVB.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = uVB.SEMRESATTRS_TELEMETRY_SDK_NAME = uVB.SEMRESATTRS_SERVICE_VERSION = uVB.SEMRESATTRS_SERVICE_INSTANCE_ID = uVB.SEMRESATTRS_SERVICE_NAMESPACE = uVB.SEMRESATTRS_SERVICE_NAME = uVB.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = uVB.SEMRESATTRS_PROCESS_RUNTIME_VERSION = uVB.SEMRESATTRS_PROCESS_RUNTIME_NAME = uVB.SEMRESATTRS_PROCESS_OWNER = uVB.SEMRESATTRS_PROCESS_COMMAND_ARGS = uVB.SEMRESATTRS_PROCESS_COMMAND_LINE = uVB.SEMRESATTRS_PROCESS_COMMAND = uVB.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = uVB.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = uVB.SEMRESATTRS_PROCESS_PID = uVB.SEMRESATTRS_OS_VERSION = uVB.SEMRESATTRS_OS_NAME = uVB.SEMRESATTRS_OS_DESCRIPTION = uVB.SEMRESATTRS_OS_TYPE = uVB.SEMRESATTRS_K8S_CRONJOB_NAME = uVB.SEMRESATTRS_K8S_CRONJOB_UID = uVB.SEMRESATTRS_K8S_JOB_NAME = uVB.SEMRESATTRS_K8S_JOB_UID = uVB.SEMRESATTRS_K8S_DAEMONSET_NAME = uVB.SEMRESATTRS_K8S_DAEMONSET_UID = void 0;
  uVB.TelemetrySdkLanguageValues = uVB.TELEMETRYSDKLANGUAGEVALUES_WEBJS = uVB.TELEMETRYSDKLANGUAGEVALUES_RUBY = uVB.TELEMETRYSDKLANGUAGEVALUES_PYTHON = uVB.TELEMETRYSDKLANGUAGEVALUES_PHP = uVB.TELEMETRYSDKLANGUAGEVALUES_NODEJS = uVB.TELEMETRYSDKLANGUAGEVALUES_JAVA = uVB.TELEMETRYSDKLANGUAGEVALUES_GO = uVB.TELEMETRYSDKLANGUAGEVALUES_ERLANG = uVB.TELEMETRYSDKLANGUAGEVALUES_DOTNET = uVB.TELEMETRYSDKLANGUAGEVALUES_CPP = uVB.OsTypeValues = uVB.OSTYPEVALUES_Z_OS = uVB.OSTYPEVALUES_SOLARIS = uVB.OSTYPEVALUES_AIX = uVB.OSTYPEVALUES_HPUX = uVB.OSTYPEVALUES_DRAGONFLYBSD = uVB.OSTYPEVALUES_OPENBSD = uVB.OSTYPEVALUES_NETBSD = uVB.OSTYPEVALUES_FREEBSD = uVB.OSTYPEVALUES_DARWIN = uVB.OSTYPEVALUES_LINUX = uVB.OSTYPEVALUES_WINDOWS = uVB.HostArchValues = uVB.HOSTARCHVALUES_X86 = uVB.HOSTARCHVALUES_PPC64 = uVB.HOSTARCHVALUES_PPC32 = uVB.HOSTARCHVALUES_IA64 = uVB.HOSTARCHVALUES_ARM64 = uVB.HOSTARCHVALUES_ARM32 = uVB.HOSTARCHVALUES_AMD64 = uVB.AwsEcsLaunchtypeValues = uVB.AWSECSLAUNCHTYPEVALUES_FARGATE = uVB.AWSECSLAUNCHTYPEVALUES_EC2 = uVB.CloudPlatformValues = uVB.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = uVB.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = void 0;
  var $t = Lf1(),
    EWB = "cloud.provider",
    zWB = "cloud.account.id",
    UWB = "cloud.region",
    $WB = "cloud.availability_zone",
    wWB = "cloud.platform",
    qWB = "aws.ecs.container.arn",
    NWB = "aws.ecs.cluster.arn",
    LWB = "aws.ecs.launchtype",
    MWB = "aws.ecs.task.arn",
    OWB = "aws.ecs.task.family",
    RWB = "aws.ecs.task.revision",
    TWB = "aws.eks.cluster.arn",
    PWB = "aws.log.group.names",
    jWB = "aws.log.group.arns",
    SWB = "aws.log.stream.names",
    _WB = "aws.log.stream.arns",
    kWB = "container.name",
    yWB = "container.id",
    xWB = "container.runtime",
    vWB = "container.image.name",
    bWB = "container.image.tag",
    fWB = "deployment.environment",
    hWB = "device.id",
    gWB = "device.model.identifier",
    uWB = "device.model.name",
    mWB = "faas.name",
    dWB = "faas.id",
    cWB = "faas.version",
    pWB = "faas.instance",
    lWB = "faas.max_memory",
    iWB = "host.id",
    nWB = "host.name",
    aWB = "host.type",
    sWB = "host.arch",
    rWB = "host.image.name",
    oWB = "host.image.id",
    tWB = "host.image.version",
    eWB = "k8s.cluster.name",
    AXB = "k8s.node.name",
    QXB = "k8s.node.uid",
    BXB = "k8s.namespace.name",
    GXB = "k8s.pod.uid",
    ZXB = "k8s.pod.name",
    IXB = "k8s.container.name",
    YXB = "k8s.replicaset.uid",
    JXB = "k8s.replicaset.name",
    WXB = "k8s.deployment.uid",
    XXB = "k8s.deployment.name",
    VXB = "k8s.statefulset.uid",
    FXB = "k8s.statefulset.name",
    KXB = "k8s.daemonset.uid",
    DXB = "k8s.daemonset.name",
    HXB = "k8s.job.uid",
    CXB = "k8s.job.name",
    EXB = "k8s.cronjob.uid",
    zXB = "k8s.cronjob.name",
    UXB = "os.type",
    $XB = "os.description",
    wXB = "os.name",
    qXB = "os.version",
    NXB = "process.pid",
    LXB = "process.executable.name",
    MXB = "process.executable.path",
    OXB = "process.command",
    RXB = "process.command_line",
    TXB = "process.command_args",
    PXB = "process.owner",
    jXB = "process.runtime.name",
    SXB = "process.runtime.version",
    _XB = "process.runtime.description",
    kXB = "service.name",
    yXB = "service.namespace",
    xXB = "service.instance.id",
    vXB = "service.version",
    bXB = "telemetry.sdk.name",
    fXB = "telemetry.sdk.language",
    hXB = "telemetry.sdk.version",
    gXB = "telemetry.auto.version",
    uXB = "webengine.name",
    mXB = "webengine.version",
    dXB = "webengine.description";
  uVB.SEMRESATTRS_CLOUD_PROVIDER = EWB;
  uVB.SEMRESATTRS_CLOUD_ACCOUNT_ID = zWB;
  uVB.SEMRESATTRS_CLOUD_REGION = UWB;
  uVB.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE = $WB;
  uVB.SEMRESATTRS_CLOUD_PLATFORM = wWB;
  uVB.SEMRESATTRS_AWS_ECS_CONTAINER_ARN = qWB;
  uVB.SEMRESATTRS_AWS_ECS_CLUSTER_ARN = NWB;
  uVB.SEMRESATTRS_AWS_ECS_LAUNCHTYPE = LWB;
  uVB.SEMRESATTRS_AWS_ECS_TASK_ARN = MWB;
  uVB.SEMRESATTRS_AWS_ECS_TASK_FAMILY = OWB;
  uVB.SEMRESATTRS_AWS_ECS_TASK_REVISION = RWB;
  uVB.SEMRESATTRS_AWS_EKS_CLUSTER_ARN = TWB;
  uVB.SEMRESATTRS_AWS_LOG_GROUP_NAMES = PWB;
  uVB.SEMRESATTRS_AWS_LOG_GROUP_ARNS = jWB;
  uVB.SEMRESATTRS_AWS_LOG_STREAM_NAMES = SWB;
  uVB.SEMRESATTRS_AWS_LOG_STREAM_ARNS = _WB;
  uVB.SEMRESATTRS_CONTAINER_NAME = kWB;
  uVB.SEMRESATTRS_CONTAINER_ID = yWB;
  uVB.SEMRESATTRS_CONTAINER_RUNTIME = xWB;
  uVB.SEMRESATTRS_CONTAINER_IMAGE_NAME = vWB;
  uVB.SEMRESATTRS_CONTAINER_IMAGE_TAG = bWB;
  uVB.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT = fWB;
  uVB.SEMRESATTRS_DEVICE_ID = hWB;
  uVB.SEMRESATTRS_DEVICE_MODEL_IDENTIFIER = gWB;
  uVB.SEMRESATTRS_DEVICE_MODEL_NAME = uWB;
  uVB.SEMRESATTRS_FAAS_NAME = mWB;
  uVB.SEMRESATTRS_FAAS_ID = dWB;
  uVB.SEMRESATTRS_FAAS_VERSION = cWB;
  uVB.SEMRESATTRS_FAAS_INSTANCE = pWB;
  uVB.SEMRESATTRS_FAAS_MAX_MEMORY = lWB;
  uVB.SEMRESATTRS_HOST_ID = iWB;
  uVB.SEMRESATTRS_HOST_NAME = nWB;
  uVB.SEMRESATTRS_HOST_TYPE = aWB;
  uVB.SEMRESATTRS_HOST_ARCH = sWB;
  uVB.SEMRESATTRS_HOST_IMAGE_NAME = rWB;
  uVB.SEMRESATTRS_HOST_IMAGE_ID = oWB;
  uVB.SEMRESATTRS_HOST_IMAGE_VERSION = tWB;
  uVB.SEMRESATTRS_K8S_CLUSTER_NAME = eWB;
  uVB.SEMRESATTRS_K8S_NODE_NAME = AXB;
  uVB.SEMRESATTRS_K8S_NODE_UID = QXB;
  uVB.SEMRESATTRS_K8S_NAMESPACE_NAME = BXB;
  uVB.SEMRESATTRS_K8S_POD_UID = GXB;
  uVB.SEMRESATTRS_K8S_POD_NAME = ZXB;
  uVB.SEMRESATTRS_K8S_CONTAINER_NAME = IXB;
  uVB.SEMRESATTRS_K8S_REPLICASET_UID = YXB;
  uVB.SEMRESATTRS_K8S_REPLICASET_NAME = JXB;
  uVB.SEMRESATTRS_K8S_DEPLOYMENT_UID = WXB;
  uVB.SEMRESATTRS_K8S_DEPLOYMENT_NAME = XXB;
  uVB.SEMRESATTRS_K8S_STATEFULSET_UID = VXB;
  uVB.SEMRESATTRS_K8S_STATEFULSET_NAME = FXB;
  uVB.SEMRESATTRS_K8S_DAEMONSET_UID = KXB;
  uVB.SEMRESATTRS_K8S_DAEMONSET_NAME = DXB;
  uVB.SEMRESATTRS_K8S_JOB_UID = HXB;
  uVB.SEMRESATTRS_K8S_JOB_NAME = CXB;
  uVB.SEMRESATTRS_K8S_CRONJOB_UID = EXB;
  uVB.SEMRESATTRS_K8S_CRONJOB_NAME = zXB;
  uVB.SEMRESATTRS_OS_TYPE = UXB;
  uVB.SEMRESATTRS_OS_DESCRIPTION = $XB;
  uVB.SEMRESATTRS_OS_NAME = wXB;
  uVB.SEMRESATTRS_OS_VERSION = qXB;
  uVB.SEMRESATTRS_PROCESS_PID = NXB;
  uVB.SEMRESATTRS_PROCESS_EXECUTABLE_NAME = LXB;
  uVB.SEMRESATTRS_PROCESS_EXECUTABLE_PATH = MXB;
  uVB.SEMRESATTRS_PROCESS_COMMAND = OXB;
  uVB.SEMRESATTRS_PROCESS_COMMAND_LINE = RXB;
  uVB.SEMRESATTRS_PROCESS_COMMAND_ARGS = TXB;
  uVB.SEMRESATTRS_PROCESS_OWNER = PXB;
  uVB.SEMRESATTRS_PROCESS_RUNTIME_NAME = jXB;
  uVB.SEMRESATTRS_PROCESS_RUNTIME_VERSION = SXB;
  uVB.SEMRESATTRS_PROCESS_RUNTIME_DESCRIPTION = _XB;
  uVB.SEMRESATTRS_SERVICE_NAME = kXB;
  uVB.SEMRESATTRS_SERVICE_NAMESPACE = yXB;
  uVB.SEMRESATTRS_SERVICE_INSTANCE_ID = xXB;
  uVB.SEMRESATTRS_SERVICE_VERSION = vXB;
  uVB.SEMRESATTRS_TELEMETRY_SDK_NAME = bXB;
  uVB.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE = fXB;
  uVB.SEMRESATTRS_TELEMETRY_SDK_VERSION = hXB;
  uVB.SEMRESATTRS_TELEMETRY_AUTO_VERSION = gXB;
  uVB.SEMRESATTRS_WEBENGINE_NAME = uXB;
  uVB.SEMRESATTRS_WEBENGINE_VERSION = mXB;
  uVB.SEMRESATTRS_WEBENGINE_DESCRIPTION = dXB;
  uVB.SemanticResourceAttributes = (0, $t.createConstMap)([EWB, zWB, UWB, $WB, wWB, qWB, NWB, LWB, MWB, OWB, RWB, TWB, PWB, jWB, SWB, _WB, kWB, yWB, xWB, vWB, bWB, fWB, hWB, gWB, uWB, mWB, dWB, cWB, pWB, lWB, iWB, nWB, aWB, sWB, rWB, oWB, tWB, eWB, AXB, QXB, BXB, GXB, ZXB, IXB, YXB, JXB, WXB, XXB, VXB, FXB, KXB, DXB, HXB, CXB, EXB, zXB, UXB, $XB, wXB, qXB, NXB, LXB, MXB, OXB, RXB, TXB, PXB, jXB, SXB, _XB, kXB, yXB, xXB, vXB, bXB, fXB, hXB, gXB, uXB, mXB, dXB]);
  var cXB = "alibaba_cloud",
    pXB = "aws",
    lXB = "azure",
    iXB = "gcp";
  uVB.CLOUDPROVIDERVALUES_ALIBABA_CLOUD = cXB;
  uVB.CLOUDPROVIDERVALUES_AWS = pXB;
  uVB.CLOUDPROVIDERVALUES_AZURE = lXB;
  uVB.CLOUDPROVIDERVALUES_GCP = iXB;
  uVB.CloudProviderValues = (0, $t.createConstMap)([cXB, pXB, lXB, iXB]);
  var nXB = "alibaba_cloud_ecs",
    aXB = "alibaba_cloud_fc",
    sXB = "aws_ec2",
    rXB = "aws_ecs",
    oXB = "aws_eks",
    tXB = "aws_lambda",
    eXB = "aws_elastic_beanstalk",
    AVB = "azure_vm",
    QVB = "azure_container_instances",
    BVB = "azure_aks",
    GVB = "azure_functions",
    ZVB = "azure_app_service",
    IVB = "gcp_compute_engine",
    YVB = "gcp_cloud_run",
    JVB = "gcp_kubernetes_engine",
    WVB = "gcp_cloud_functions",
    XVB = "gcp_app_engine";
  uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_ECS = nXB;
  uVB.CLOUDPLATFORMVALUES_ALIBABA_CLOUD_FC = aXB;
  uVB.CLOUDPLATFORMVALUES_AWS_EC2 = sXB;
  uVB.CLOUDPLATFORMVALUES_AWS_ECS = rXB;
  uVB.CLOUDPLATFORMVALUES_AWS_EKS = oXB;
  uVB.CLOUDPLATFORMVALUES_AWS_LAMBDA = tXB;
  uVB.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK = eXB;
  uVB.CLOUDPLATFORMVALUES_AZURE_VM = AVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_CONTAINER_INSTANCES = QVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_AKS = BVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_FUNCTIONS = GVB;
  uVB.CLOUDPLATFORMVALUES_AZURE_APP_SERVICE = ZVB;
  uVB.CLOUDPLATFORMVALUES_GCP_COMPUTE_ENGINE = IVB;
  uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_RUN = YVB;
  uVB.CLOUDPLATFORMVALUES_GCP_KUBERNETES_ENGINE = JVB;
  uVB.CLOUDPLATFORMVALUES_GCP_CLOUD_FUNCTIONS = WVB;
  uVB.CLOUDPLATFORMVALUES_GCP_APP_ENGINE = XVB;
  uVB.CloudPlatformValues = (0, $t.createConstMap)([nXB, aXB, sXB, rXB, oXB, tXB, eXB, AVB, QVB, BVB, GVB, ZVB, IVB, YVB, JVB, WVB, XVB]);
  var VVB = "ec2",
    FVB = "fargate";
  uVB.AWSECSLAUNCHTYPEVALUES_EC2 = VVB;
  uVB.AWSECSLAUNCHTYPEVALUES_FARGATE = FVB;
  uVB.AwsEcsLaunchtypeValues = (0, $t.createConstMap)([VVB, FVB]);
  var KVB = "amd64",
    DVB = "arm32",
    HVB = "arm64",
    CVB = "ia64",
    EVB = "ppc32",
    zVB = "ppc64",
    UVB = "x86";
  uVB.HOSTARCHVALUES_AMD64 = KVB;
  uVB.HOSTARCHVALUES_ARM32 = DVB;
  uVB.HOSTARCHVALUES_ARM64 = HVB;
  uVB.HOSTARCHVALUES_IA64 = CVB;
  uVB.HOSTARCHVALUES_PPC32 = EVB;
  uVB.HOSTARCHVALUES_PPC64 = zVB;
  uVB.HOSTARCHVALUES_X86 = UVB;
  uVB.HostArchValues = (0, $t.createConstMap)([KVB, DVB, HVB, CVB, EVB, zVB, UVB]);
  var $VB = "windows",
    wVB = "linux",
    qVB = "darwin",
    NVB = "freebsd",
    LVB = "netbsd",
    MVB = "openbsd",
    OVB = "dragonflybsd",
    RVB = "hpux",
    TVB = "aix",
    PVB = "solaris",
    jVB = "z_os";
  uVB.OSTYPEVALUES_WINDOWS = $VB;
  uVB.OSTYPEVALUES_LINUX = wVB;
  uVB.OSTYPEVALUES_DARWIN = qVB;
  uVB.OSTYPEVALUES_FREEBSD = NVB;
  uVB.OSTYPEVALUES_NETBSD = LVB;
  uVB.OSTYPEVALUES_OPENBSD = MVB;
  uVB.OSTYPEVALUES_DRAGONFLYBSD = OVB;
  uVB.OSTYPEVALUES_HPUX = RVB;
  uVB.OSTYPEVALUES_AIX = TVB;
  uVB.OSTYPEVALUES_SOLARIS = PVB;
  uVB.OSTYPEVALUES_Z_OS = jVB;
  uVB.OsTypeValues = (0, $t.createConstMap)([$VB, wVB, qVB, NVB, LVB, MVB, OVB, RVB, TVB, PVB, jVB]);
  var SVB = "cpp",
    _VB = "dotnet",
    kVB = "erlang",
    yVB = "go",
    xVB = "java",
    vVB = "nodejs",
    bVB = "php",
    fVB = "python",
    hVB = "ruby",
    gVB = "webjs";
  uVB.TELEMETRYSDKLANGUAGEVALUES_CPP = SVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_DOTNET = _VB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_ERLANG = kVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_GO = yVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_JAVA = xVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_NODEJS = vVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_PHP = bVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_PYTHON = fVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_RUBY = hVB;
  uVB.TELEMETRYSDKLANGUAGEVALUES_WEBJS = gVB;
  uVB.TelemetrySdkLanguageValues = (0, $t.createConstMap)([SVB, _VB, kVB, yVB, xVB, vVB, bVB, fVB, hVB, gVB])
})
// @from(Start 5310072, End 5310807)
lVB = z((wt) => {
  var i86 = wt && wt.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    n86 = wt && wt.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) i86(Q, A, B)
    };
  Object.defineProperty(wt, "__esModule", {
    value: !0
  });
  n86(pVB(), wt)
})
// @from(Start 5310813, End 5323287)
rVB = z((iVB) => {
  Object.defineProperty(iVB, "__esModule", {
    value: !0
  });
  iVB.ATTR_EXCEPTION_TYPE = iVB.ATTR_EXCEPTION_STACKTRACE = iVB.ATTR_EXCEPTION_MESSAGE = iVB.ATTR_EXCEPTION_ESCAPED = iVB.ERROR_TYPE_VALUE_OTHER = iVB.ATTR_ERROR_TYPE = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_POH = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = iVB.ATTR_DOTNET_GC_HEAP_GENERATION = iVB.DB_SYSTEM_NAME_VALUE_POSTGRESQL = iVB.DB_SYSTEM_NAME_VALUE_MYSQL = iVB.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = iVB.DB_SYSTEM_NAME_VALUE_MARIADB = iVB.ATTR_DB_SYSTEM_NAME = iVB.ATTR_DB_STORED_PROCEDURE_NAME = iVB.ATTR_DB_RESPONSE_STATUS_CODE = iVB.ATTR_DB_QUERY_TEXT = iVB.ATTR_DB_QUERY_SUMMARY = iVB.ATTR_DB_OPERATION_NAME = iVB.ATTR_DB_OPERATION_BATCH_SIZE = iVB.ATTR_DB_NAMESPACE = iVB.ATTR_DB_COLLECTION_NAME = iVB.ATTR_CODE_STACKTRACE = iVB.ATTR_CODE_LINE_NUMBER = iVB.ATTR_CODE_FUNCTION_NAME = iVB.ATTR_CODE_FILE_PATH = iVB.ATTR_CODE_COLUMN_NUMBER = iVB.ATTR_CLIENT_PORT = iVB.ATTR_CLIENT_ADDRESS = iVB.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = iVB.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = iVB.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = iVB.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = iVB.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = iVB.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = iVB.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = iVB.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = void 0;
  iVB.OTEL_STATUS_CODE_VALUE_ERROR = iVB.ATTR_OTEL_STATUS_CODE = iVB.ATTR_OTEL_SCOPE_VERSION = iVB.ATTR_OTEL_SCOPE_NAME = iVB.NETWORK_TYPE_VALUE_IPV6 = iVB.NETWORK_TYPE_VALUE_IPV4 = iVB.ATTR_NETWORK_TYPE = iVB.NETWORK_TRANSPORT_VALUE_UNIX = iVB.NETWORK_TRANSPORT_VALUE_UDP = iVB.NETWORK_TRANSPORT_VALUE_TCP = iVB.NETWORK_TRANSPORT_VALUE_QUIC = iVB.NETWORK_TRANSPORT_VALUE_PIPE = iVB.ATTR_NETWORK_TRANSPORT = iVB.ATTR_NETWORK_PROTOCOL_VERSION = iVB.ATTR_NETWORK_PROTOCOL_NAME = iVB.ATTR_NETWORK_PEER_PORT = iVB.ATTR_NETWORK_PEER_ADDRESS = iVB.ATTR_NETWORK_LOCAL_PORT = iVB.ATTR_NETWORK_LOCAL_ADDRESS = iVB.JVM_THREAD_STATE_VALUE_WAITING = iVB.JVM_THREAD_STATE_VALUE_TIMED_WAITING = iVB.JVM_THREAD_STATE_VALUE_TERMINATED = iVB.JVM_THREAD_STATE_VALUE_RUNNABLE = iVB.JVM_THREAD_STATE_VALUE_NEW = iVB.JVM_THREAD_STATE_VALUE_BLOCKED = iVB.ATTR_JVM_THREAD_STATE = iVB.ATTR_JVM_THREAD_DAEMON = iVB.JVM_MEMORY_TYPE_VALUE_NON_HEAP = iVB.JVM_MEMORY_TYPE_VALUE_HEAP = iVB.ATTR_JVM_MEMORY_TYPE = iVB.ATTR_JVM_MEMORY_POOL_NAME = iVB.ATTR_JVM_GC_NAME = iVB.ATTR_JVM_GC_ACTION = iVB.ATTR_HTTP_ROUTE = iVB.ATTR_HTTP_RESPONSE_STATUS_CODE = iVB.ATTR_HTTP_RESPONSE_HEADER = iVB.ATTR_HTTP_REQUEST_RESEND_COUNT = iVB.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = iVB.HTTP_REQUEST_METHOD_VALUE_TRACE = iVB.HTTP_REQUEST_METHOD_VALUE_PUT = iVB.HTTP_REQUEST_METHOD_VALUE_POST = iVB.HTTP_REQUEST_METHOD_VALUE_PATCH = iVB.HTTP_REQUEST_METHOD_VALUE_OPTIONS = iVB.HTTP_REQUEST_METHOD_VALUE_HEAD = iVB.HTTP_REQUEST_METHOD_VALUE_GET = iVB.HTTP_REQUEST_METHOD_VALUE_DELETE = iVB.HTTP_REQUEST_METHOD_VALUE_CONNECT = iVB.HTTP_REQUEST_METHOD_VALUE_OTHER = iVB.ATTR_HTTP_REQUEST_METHOD = iVB.ATTR_HTTP_REQUEST_HEADER = void 0;
  iVB.ATTR_USER_AGENT_ORIGINAL = iVB.ATTR_URL_SCHEME = iVB.ATTR_URL_QUERY = iVB.ATTR_URL_PATH = iVB.ATTR_URL_FULL = iVB.ATTR_URL_FRAGMENT = iVB.ATTR_TELEMETRY_SDK_VERSION = iVB.ATTR_TELEMETRY_SDK_NAME = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_GO = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = iVB.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = iVB.ATTR_TELEMETRY_SDK_LANGUAGE = iVB.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = iVB.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = iVB.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = iVB.ATTR_SIGNALR_TRANSPORT = iVB.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = iVB.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = iVB.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = iVB.ATTR_SIGNALR_CONNECTION_STATUS = iVB.ATTR_SERVICE_VERSION = iVB.ATTR_SERVICE_NAME = iVB.ATTR_SERVER_PORT = iVB.ATTR_SERVER_ADDRESS = iVB.ATTR_OTEL_STATUS_DESCRIPTION = iVB.OTEL_STATUS_CODE_VALUE_OK = void 0;
  iVB.ATTR_ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT = "aspnetcore.diagnostics.exception.result";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_ABORTED = "aborted";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_HANDLED = "handled";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_SKIPPED = "skipped";
  iVB.ASPNETCORE_DIAGNOSTICS_EXCEPTION_RESULT_VALUE_UNHANDLED = "unhandled";
  iVB.ATTR_ASPNETCORE_DIAGNOSTICS_HANDLER_TYPE = "aspnetcore.diagnostics.handler.type";
  iVB.ATTR_ASPNETCORE_RATE_LIMITING_POLICY = "aspnetcore.rate_limiting.policy";
  iVB.ATTR_ASPNETCORE_RATE_LIMITING_RESULT = "aspnetcore.rate_limiting.result";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ACQUIRED = "acquired";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_ENDPOINT_LIMITER = "endpoint_limiter";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_GLOBAL_LIMITER = "global_limiter";
  iVB.ASPNETCORE_RATE_LIMITING_RESULT_VALUE_REQUEST_CANCELED = "request_canceled";
  iVB.ATTR_ASPNETCORE_REQUEST_IS_UNHANDLED = "aspnetcore.request.is_unhandled";
  iVB.ATTR_ASPNETCORE_ROUTING_IS_FALLBACK = "aspnetcore.routing.is_fallback";
  iVB.ATTR_ASPNETCORE_ROUTING_MATCH_STATUS = "aspnetcore.routing.match_status";
  iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_FAILURE = "failure";
  iVB.ASPNETCORE_ROUTING_MATCH_STATUS_VALUE_SUCCESS = "success";
  iVB.ATTR_ASPNETCORE_USER_IS_AUTHENTICATED = "aspnetcore.user.is_authenticated";
  iVB.ATTR_CLIENT_ADDRESS = "client.address";
  iVB.ATTR_CLIENT_PORT = "client.port";
  iVB.ATTR_CODE_COLUMN_NUMBER = "code.column.number";
  iVB.ATTR_CODE_FILE_PATH = "code.file.path";
  iVB.ATTR_CODE_FUNCTION_NAME = "code.function.name";
  iVB.ATTR_CODE_LINE_NUMBER = "code.line.number";
  iVB.ATTR_CODE_STACKTRACE = "code.stacktrace";
  iVB.ATTR_DB_COLLECTION_NAME = "db.collection.name";
  iVB.ATTR_DB_NAMESPACE = "db.namespace";
  iVB.ATTR_DB_OPERATION_BATCH_SIZE = "db.operation.batch.size";
  iVB.ATTR_DB_OPERATION_NAME = "db.operation.name";
  iVB.ATTR_DB_QUERY_SUMMARY = "db.query.summary";
  iVB.ATTR_DB_QUERY_TEXT = "db.query.text";
  iVB.ATTR_DB_RESPONSE_STATUS_CODE = "db.response.status_code";
  iVB.ATTR_DB_STORED_PROCEDURE_NAME = "db.stored_procedure.name";
  iVB.ATTR_DB_SYSTEM_NAME = "db.system.name";
  iVB.DB_SYSTEM_NAME_VALUE_MARIADB = "mariadb";
  iVB.DB_SYSTEM_NAME_VALUE_MICROSOFT_SQL_SERVER = "microsoft.sql_server";
  iVB.DB_SYSTEM_NAME_VALUE_MYSQL = "mysql";
  iVB.DB_SYSTEM_NAME_VALUE_POSTGRESQL = "postgresql";
  iVB.ATTR_DOTNET_GC_HEAP_GENERATION = "dotnet.gc.heap.generation";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN0 = "gen0";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN1 = "gen1";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_GEN2 = "gen2";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_LOH = "loh";
  iVB.DOTNET_GC_HEAP_GENERATION_VALUE_POH = "poh";
  iVB.ATTR_ERROR_TYPE = "error.type";
  iVB.ERROR_TYPE_VALUE_OTHER = "_OTHER";
  iVB.ATTR_EXCEPTION_ESCAPED = "exception.escaped";
  iVB.ATTR_EXCEPTION_MESSAGE = "exception.message";
  iVB.ATTR_EXCEPTION_STACKTRACE = "exception.stacktrace";
  iVB.ATTR_EXCEPTION_TYPE = "exception.type";
  var a86 = (A) => `http.request.header.${A}`;
  iVB.ATTR_HTTP_REQUEST_HEADER = a86;
  iVB.ATTR_HTTP_REQUEST_METHOD = "http.request.method";
  iVB.HTTP_REQUEST_METHOD_VALUE_OTHER = "_OTHER";
  iVB.HTTP_REQUEST_METHOD_VALUE_CONNECT = "CONNECT";
  iVB.HTTP_REQUEST_METHOD_VALUE_DELETE = "DELETE";
  iVB.HTTP_REQUEST_METHOD_VALUE_GET = "GET";
  iVB.HTTP_REQUEST_METHOD_VALUE_HEAD = "HEAD";
  iVB.HTTP_REQUEST_METHOD_VALUE_OPTIONS = "OPTIONS";
  iVB.HTTP_REQUEST_METHOD_VALUE_PATCH = "PATCH";
  iVB.HTTP_REQUEST_METHOD_VALUE_POST = "POST";
  iVB.HTTP_REQUEST_METHOD_VALUE_PUT = "PUT";
  iVB.HTTP_REQUEST_METHOD_VALUE_TRACE = "TRACE";
  iVB.ATTR_HTTP_REQUEST_METHOD_ORIGINAL = "http.request.method_original";
  iVB.ATTR_HTTP_REQUEST_RESEND_COUNT = "http.request.resend_count";
  var s86 = (A) => `http.response.header.${A}`;
  iVB.ATTR_HTTP_RESPONSE_HEADER = s86;
  iVB.ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
  iVB.ATTR_HTTP_ROUTE = "http.route";
  iVB.ATTR_JVM_GC_ACTION = "jvm.gc.action";
  iVB.ATTR_JVM_GC_NAME = "jvm.gc.name";
  iVB.ATTR_JVM_MEMORY_POOL_NAME = "jvm.memory.pool.name";
  iVB.ATTR_JVM_MEMORY_TYPE = "jvm.memory.type";
  iVB.JVM_MEMORY_TYPE_VALUE_HEAP = "heap";
  iVB.JVM_MEMORY_TYPE_VALUE_NON_HEAP = "non_heap";
  iVB.ATTR_JVM_THREAD_DAEMON = "jvm.thread.daemon";
  iVB.ATTR_JVM_THREAD_STATE = "jvm.thread.state";
  iVB.JVM_THREAD_STATE_VALUE_BLOCKED = "blocked";
  iVB.JVM_THREAD_STATE_VALUE_NEW = "new";
  iVB.JVM_THREAD_STATE_VALUE_RUNNABLE = "runnable";
  iVB.JVM_THREAD_STATE_VALUE_TERMINATED = "terminated";
  iVB.JVM_THREAD_STATE_VALUE_TIMED_WAITING = "timed_waiting";
  iVB.JVM_THREAD_STATE_VALUE_WAITING = "waiting";
  iVB.ATTR_NETWORK_LOCAL_ADDRESS = "network.local.address";
  iVB.ATTR_NETWORK_LOCAL_PORT = "network.local.port";
  iVB.ATTR_NETWORK_PEER_ADDRESS = "network.peer.address";
  iVB.ATTR_NETWORK_PEER_PORT = "network.peer.port";
  iVB.ATTR_NETWORK_PROTOCOL_NAME = "network.protocol.name";
  iVB.ATTR_NETWORK_PROTOCOL_VERSION = "network.protocol.version";
  iVB.ATTR_NETWORK_TRANSPORT = "network.transport";
  iVB.NETWORK_TRANSPORT_VALUE_PIPE = "pipe";
  iVB.NETWORK_TRANSPORT_VALUE_QUIC = "quic";
  iVB.NETWORK_TRANSPORT_VALUE_TCP = "tcp";
  iVB.NETWORK_TRANSPORT_VALUE_UDP = "udp";
  iVB.NETWORK_TRANSPORT_VALUE_UNIX = "unix";
  iVB.ATTR_NETWORK_TYPE = "network.type";
  iVB.NETWORK_TYPE_VALUE_IPV4 = "ipv4";
  iVB.NETWORK_TYPE_VALUE_IPV6 = "ipv6";
  iVB.ATTR_OTEL_SCOPE_NAME = "otel.scope.name";
  iVB.ATTR_OTEL_SCOPE_VERSION = "otel.scope.version";
  iVB.ATTR_OTEL_STATUS_CODE = "otel.status_code";
  iVB.OTEL_STATUS_CODE_VALUE_ERROR = "ERROR";
  iVB.OTEL_STATUS_CODE_VALUE_OK = "OK";
  iVB.ATTR_OTEL_STATUS_DESCRIPTION = "otel.status_description";
  iVB.ATTR_SERVER_ADDRESS = "server.address";
  iVB.ATTR_SERVER_PORT = "server.port";
  iVB.ATTR_SERVICE_NAME = "service.name";
  iVB.ATTR_SERVICE_VERSION = "service.version";
  iVB.ATTR_SIGNALR_CONNECTION_STATUS = "signalr.connection.status";
  iVB.SIGNALR_CONNECTION_STATUS_VALUE_APP_SHUTDOWN = "app_shutdown";
  iVB.SIGNALR_CONNECTION_STATUS_VALUE_NORMAL_CLOSURE = "normal_closure";
  iVB.SIGNALR_CONNECTION_STATUS_VALUE_TIMEOUT = "timeout";
  iVB.ATTR_SIGNALR_TRANSPORT = "signalr.transport";
  iVB.SIGNALR_TRANSPORT_VALUE_LONG_POLLING = "long_polling";
  iVB.SIGNALR_TRANSPORT_VALUE_SERVER_SENT_EVENTS = "server_sent_events";
  iVB.SIGNALR_TRANSPORT_VALUE_WEB_SOCKETS = "web_sockets";
  iVB.ATTR_TELEMETRY_SDK_LANGUAGE = "telemetry.sdk.language";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_CPP = "cpp";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_DOTNET = "dotnet";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_ERLANG = "erlang";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_GO = "go";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_JAVA = "java";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS = "nodejs";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PHP = "php";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_PYTHON = "python";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUBY = "ruby";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_RUST = "rust";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_SWIFT = "swift";
  iVB.TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS = "webjs";
  iVB.ATTR_TELEMETRY_SDK_NAME = "telemetry.sdk.name";
  iVB.ATTR_TELEMETRY_SDK_VERSION = "telemetry.sdk.version";
  iVB.ATTR_URL_FRAGMENT = "url.fragment";
  iVB.ATTR_URL_FULL = "url.full";
  iVB.ATTR_URL_PATH = "url.path";
  iVB.ATTR_URL_QUERY = "url.query";
  iVB.ATTR_URL_SCHEME = "url.scheme";
  iVB.ATTR_USER_AGENT_ORIGINAL = "user_agent.original"
})
// @from(Start 5323293, End 5329341)
AFB = z((oVB) => {
  Object.defineProperty(oVB, "__esModule", {
    value: !0
  });
  oVB.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = oVB.METRIC_KESTREL_UPGRADED_CONNECTIONS = oVB.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = oVB.METRIC_KESTREL_REJECTED_CONNECTIONS = oVB.METRIC_KESTREL_QUEUED_REQUESTS = oVB.METRIC_KESTREL_QUEUED_CONNECTIONS = oVB.METRIC_KESTREL_CONNECTION_DURATION = oVB.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = oVB.METRIC_KESTREL_ACTIVE_CONNECTIONS = oVB.METRIC_JVM_THREAD_COUNT = oVB.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = oVB.METRIC_JVM_MEMORY_USED = oVB.METRIC_JVM_MEMORY_LIMIT = oVB.METRIC_JVM_MEMORY_COMMITTED = oVB.METRIC_JVM_GC_DURATION = oVB.METRIC_JVM_CPU_TIME = oVB.METRIC_JVM_CPU_RECENT_UTILIZATION = oVB.METRIC_JVM_CPU_COUNT = oVB.METRIC_JVM_CLASS_UNLOADED = oVB.METRIC_JVM_CLASS_LOADED = oVB.METRIC_JVM_CLASS_COUNT = oVB.METRIC_HTTP_SERVER_REQUEST_DURATION = oVB.METRIC_HTTP_CLIENT_REQUEST_DURATION = oVB.METRIC_DOTNET_TIMER_COUNT = oVB.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = oVB.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = oVB.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = oVB.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = oVB.METRIC_DOTNET_PROCESS_CPU_TIME = oVB.METRIC_DOTNET_PROCESS_CPU_COUNT = oVB.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = oVB.METRIC_DOTNET_JIT_COMPILED_METHODS = oVB.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = oVB.METRIC_DOTNET_JIT_COMPILATION_TIME = oVB.METRIC_DOTNET_GC_PAUSE_TIME = oVB.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = oVB.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = oVB.METRIC_DOTNET_GC_COLLECTIONS = oVB.METRIC_DOTNET_EXCEPTIONS = oVB.METRIC_DOTNET_ASSEMBLY_COUNT = oVB.METRIC_DB_CLIENT_OPERATION_DURATION = oVB.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = oVB.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = oVB.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = oVB.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = void 0;
  oVB.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = void 0;
  oVB.METRIC_ASPNETCORE_DIAGNOSTICS_EXCEPTIONS = "aspnetcore.diagnostics.exceptions";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_ACTIVE_REQUEST_LEASES = "aspnetcore.rate_limiting.active_request_leases";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_QUEUED_REQUESTS = "aspnetcore.rate_limiting.queued_requests";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_TIME_IN_QUEUE = "aspnetcore.rate_limiting.request.time_in_queue";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUEST_LEASE_DURATION = "aspnetcore.rate_limiting.request_lease.duration";
  oVB.METRIC_ASPNETCORE_RATE_LIMITING_REQUESTS = "aspnetcore.rate_limiting.requests";
  oVB.METRIC_ASPNETCORE_ROUTING_MATCH_ATTEMPTS = "aspnetcore.routing.match_attempts";
  oVB.METRIC_DB_CLIENT_OPERATION_DURATION = "db.client.operation.duration";
  oVB.METRIC_DOTNET_ASSEMBLY_COUNT = "dotnet.assembly.count";
  oVB.METRIC_DOTNET_EXCEPTIONS = "dotnet.exceptions";
  oVB.METRIC_DOTNET_GC_COLLECTIONS = "dotnet.gc.collections";
  oVB.METRIC_DOTNET_GC_HEAP_TOTAL_ALLOCATED = "dotnet.gc.heap.total_allocated";
  oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_FRAGMENTATION_SIZE = "dotnet.gc.last_collection.heap.fragmentation.size";
  oVB.METRIC_DOTNET_GC_LAST_COLLECTION_HEAP_SIZE = "dotnet.gc.last_collection.heap.size";
  oVB.METRIC_DOTNET_GC_LAST_COLLECTION_MEMORY_COMMITTED_SIZE = "dotnet.gc.last_collection.memory.committed_size";
  oVB.METRIC_DOTNET_GC_PAUSE_TIME = "dotnet.gc.pause.time";
  oVB.METRIC_DOTNET_JIT_COMPILATION_TIME = "dotnet.jit.compilation.time";
  oVB.METRIC_DOTNET_JIT_COMPILED_IL_SIZE = "dotnet.jit.compiled_il.size";
  oVB.METRIC_DOTNET_JIT_COMPILED_METHODS = "dotnet.jit.compiled_methods";
  oVB.METRIC_DOTNET_MONITOR_LOCK_CONTENTIONS = "dotnet.monitor.lock_contentions";
  oVB.METRIC_DOTNET_PROCESS_CPU_COUNT = "dotnet.process.cpu.count";
  oVB.METRIC_DOTNET_PROCESS_CPU_TIME = "dotnet.process.cpu.time";
  oVB.METRIC_DOTNET_PROCESS_MEMORY_WORKING_SET = "dotnet.process.memory.working_set";
  oVB.METRIC_DOTNET_THREAD_POOL_QUEUE_LENGTH = "dotnet.thread_pool.queue.length";
  oVB.METRIC_DOTNET_THREAD_POOL_THREAD_COUNT = "dotnet.thread_pool.thread.count";
  oVB.METRIC_DOTNET_THREAD_POOL_WORK_ITEM_COUNT = "dotnet.thread_pool.work_item.count";
  oVB.METRIC_DOTNET_TIMER_COUNT = "dotnet.timer.count";
  oVB.METRIC_HTTP_CLIENT_REQUEST_DURATION = "http.client.request.duration";
  oVB.METRIC_HTTP_SERVER_REQUEST_DURATION = "http.server.request.duration";
  oVB.METRIC_JVM_CLASS_COUNT = "jvm.class.count";
  oVB.METRIC_JVM_CLASS_LOADED = "jvm.class.loaded";
  oVB.METRIC_JVM_CLASS_UNLOADED = "jvm.class.unloaded";
  oVB.METRIC_JVM_CPU_COUNT = "jvm.cpu.count";
  oVB.METRIC_JVM_CPU_RECENT_UTILIZATION = "jvm.cpu.recent_utilization";
  oVB.METRIC_JVM_CPU_TIME = "jvm.cpu.time";
  oVB.METRIC_JVM_GC_DURATION = "jvm.gc.duration";
  oVB.METRIC_JVM_MEMORY_COMMITTED = "jvm.memory.committed";
  oVB.METRIC_JVM_MEMORY_LIMIT = "jvm.memory.limit";
  oVB.METRIC_JVM_MEMORY_USED = "jvm.memory.used";
  oVB.METRIC_JVM_MEMORY_USED_AFTER_LAST_GC = "jvm.memory.used_after_last_gc";
  oVB.METRIC_JVM_THREAD_COUNT = "jvm.thread.count";
  oVB.METRIC_KESTREL_ACTIVE_CONNECTIONS = "kestrel.active_connections";
  oVB.METRIC_KESTREL_ACTIVE_TLS_HANDSHAKES = "kestrel.active_tls_handshakes";
  oVB.METRIC_KESTREL_CONNECTION_DURATION = "kestrel.connection.duration";
  oVB.METRIC_KESTREL_QUEUED_CONNECTIONS = "kestrel.queued_connections";
  oVB.METRIC_KESTREL_QUEUED_REQUESTS = "kestrel.queued_requests";
  oVB.METRIC_KESTREL_REJECTED_CONNECTIONS = "kestrel.rejected_connections";
  oVB.METRIC_KESTREL_TLS_HANDSHAKE_DURATION = "kestrel.tls_handshake.duration";
  oVB.METRIC_KESTREL_UPGRADED_CONNECTIONS = "kestrel.upgraded_connections";
  oVB.METRIC_SIGNALR_SERVER_ACTIVE_CONNECTIONS = "signalr.server.active_connections";
  oVB.METRIC_SIGNALR_SERVER_CONNECTION_DURATION = "signalr.server.connection.duration"
})
// @from(Start 5329347, End 5329501)
GFB = z((QFB) => {
  Object.defineProperty(QFB, "__esModule", {
    value: !0
  });
  QFB.EVENT_EXCEPTION = void 0;
  QFB.EVENT_EXCEPTION = "exception"
})
// @from(Start 5329507, End 5330313)
qt = z((VT) => {
  var C76 = VT && VT.__createBinding || (Object.create ? function(A, Q, B, G) {
      if (G === void 0) G = B;
      var Z = Object.getOwnPropertyDescriptor(Q, B);
      if (!Z || ("get" in Z ? !Q.__esModule : Z.writable || Z.configurable)) Z = {
        enumerable: !0,
        get: function() {
          return Q[B]
        }
      };
      Object.defineProperty(A, G, Z)
    } : function(A, Q, B, G) {
      if (G === void 0) G = B;
      A[G] = Q[B]
    }),
    GUA = VT && VT.__exportStar || function(A, Q) {
      for (var B in A)
        if (B !== "default" && !Object.prototype.hasOwnProperty.call(Q, B)) C76(Q, A, B)
    };
  Object.defineProperty(VT, "__esModule", {
    value: !0
  });
  GUA(CWB(), VT);
  GUA(lVB(), VT);
  GUA(rVB(), VT);
  GUA(AFB(), VT);
  GUA(GFB(), VT)
})
// @from(Start 5330319, End 5330504)
YFB = z((ZFB) => {
  Object.defineProperty(ZFB, "__esModule", {
    value: !0
  });
  ZFB.ATTR_PROCESS_RUNTIME_NAME = void 0;
  ZFB.ATTR_PROCESS_RUNTIME_NAME = "process.runtime.name"
})
// @from(Start 5330510, End 5330923)
XFB = z((JFB) => {
  Object.defineProperty(JFB, "__esModule", {
    value: !0
  });
  JFB.SDK_INFO = void 0;
  var E76 = CGB(),
    HnA = qt(),
    z76 = YFB();
  JFB.SDK_INFO = {
    [HnA.ATTR_TELEMETRY_SDK_NAME]: "opentelemetry",
    [z76.ATTR_PROCESS_RUNTIME_NAME]: "node",
    [HnA.ATTR_TELEMETRY_SDK_LANGUAGE]: HnA.TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
    [HnA.ATTR_TELEMETRY_SDK_VERSION]: E76.VERSION
  }
})
// @from(Start 5330929, End 5331104)
KFB = z((VFB) => {
  Object.defineProperty(VFB, "__esModule", {
    value: !0
  });
  VFB.unrefTimer = void 0;

  function U76(A) {
    A.unref()
  }
  VFB.unrefTimer = U76
})
// @from(Start 5331110, End 5332527)
DFB = z((R_) => {
  Object.defineProperty(R_, "__esModule", {
    value: !0
  });
  R_.unrefTimer = R_.SDK_INFO = R_.otperformance = R_._globalThis = R_.getStringListFromEnv = R_.getNumberFromEnv = R_.getBooleanFromEnv = R_.getStringFromEnv = void 0;
  var CnA = YGB();
  Object.defineProperty(R_, "getStringFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getStringFromEnv
    }
  });
  Object.defineProperty(R_, "getBooleanFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getBooleanFromEnv
    }
  });
  Object.defineProperty(R_, "getNumberFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getNumberFromEnv
    }
  });
  Object.defineProperty(R_, "getStringListFromEnv", {
    enumerable: !0,
    get: function() {
      return CnA.getStringListFromEnv
    }
  });
  var $76 = XGB();
  Object.defineProperty(R_, "_globalThis", {
    enumerable: !0,
    get: function() {
      return $76._globalThis
    }
  });
  var w76 = KGB();
  Object.defineProperty(R_, "otperformance", {
    enumerable: !0,
    get: function() {
      return w76.otperformance
    }
  });
  var q76 = XFB();
  Object.defineProperty(R_, "SDK_INFO", {
    enumerable: !0,
    get: function() {
      return q76.SDK_INFO
    }
  });
  var N76 = KFB();
  Object.defineProperty(R_, "unrefTimer", {
    enumerable: !0,
    get: function() {
      return N76.unrefTimer
    }
  })
})
// @from(Start 5332533, End 5333865)
Mf1 = z((T_) => {
  Object.defineProperty(T_, "__esModule", {
    value: !0
  });
  T_.getStringListFromEnv = T_.getNumberFromEnv = T_.getStringFromEnv = T_.getBooleanFromEnv = T_.unrefTimer = T_.otperformance = T_._globalThis = T_.SDK_INFO = void 0;
  var mc = DFB();
  Object.defineProperty(T_, "SDK_INFO", {
    enumerable: !0,
    get: function() {
      return mc.SDK_INFO
    }
  });
  Object.defineProperty(T_, "_globalThis", {
    enumerable: !0,
    get: function() {
      return mc._globalThis
    }
  });
  Object.defineProperty(T_, "otperformance", {
    enumerable: !0,
    get: function() {
      return mc.otperformance
    }
  });
  Object.defineProperty(T_, "unrefTimer", {
    enumerable: !0,
    get: function() {
      return mc.unrefTimer
    }
  });
  Object.defineProperty(T_, "getBooleanFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getBooleanFromEnv
    }
  });
  Object.defineProperty(T_, "getStringFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getStringFromEnv
    }
  });
  Object.defineProperty(T_, "getNumberFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getNumberFromEnv
    }
  });
  Object.defineProperty(T_, "getStringListFromEnv", {
    enumerable: !0,
    get: function() {
      return mc.getStringListFromEnv
    }
  })
})
// @from(Start 5333871, End 5336221)
$FB = z((zFB) => {
  Object.defineProperty(zFB, "__esModule", {
    value: !0
  });
  zFB.addHrTimes = zFB.isTimeInput = zFB.isTimeInputHrTime = zFB.hrTimeToMicroseconds = zFB.hrTimeToMilliseconds = zFB.hrTimeToNanoseconds = zFB.hrTimeToTimeStamp = zFB.hrTimeDuration = zFB.timeInputToHrTime = zFB.hrTime = zFB.getTimeOrigin = zFB.millisToHrTime = void 0;
  var Of1 = Mf1(),
    HFB = 9,
    O76 = 6,
    R76 = Math.pow(10, O76),
    EnA = Math.pow(10, HFB);

  function ZUA(A) {
    let Q = A / 1000,
      B = Math.trunc(Q),
      G = Math.round(A % 1000 * R76);
    return [B, G]
  }
  zFB.millisToHrTime = ZUA;

  function Rf1() {
    let A = Of1.otperformance.timeOrigin;
    if (typeof A !== "number") {
      let Q = Of1.otperformance;
      A = Q.timing && Q.timing.fetchStart
    }
    return A
  }
  zFB.getTimeOrigin = Rf1;

  function CFB(A) {
    let Q = ZUA(Rf1()),
      B = ZUA(typeof A === "number" ? A : Of1.otperformance.now());
    return EFB(Q, B)
  }
  zFB.hrTime = CFB;

  function T76(A) {
    if (Tf1(A)) return A;
    else if (typeof A === "number")
      if (A < Rf1()) return CFB(A);
      else return ZUA(A);
    else if (A instanceof Date) return ZUA(A.getTime());
    else throw TypeError("Invalid input type")
  }
  zFB.timeInputToHrTime = T76;

  function P76(A, Q) {
    let B = Q[0] - A[0],
      G = Q[1] - A[1];
    if (G < 0) B -= 1, G += EnA;
    return [B, G]
  }
  zFB.hrTimeDuration = P76;

  function j76(A) {
    let Q = HFB,
      B = `${"0".repeat(Q)}${A[1]}Z`,
      G = B.substring(B.length - Q - 1);
    return new Date(A[0] * 1000).toISOString().replace("000Z", G)
  }
  zFB.hrTimeToTimeStamp = j76;

  function S76(A) {
    return A[0] * EnA + A[1]
  }
  zFB.hrTimeToNanoseconds = S76;

  function _76(A) {
    return A[0] * 1000 + A[1] / 1e6
  }
  zFB.hrTimeToMilliseconds = _76;

  function k76(A) {
    return A[0] * 1e6 + A[1] / 1000
  }
  zFB.hrTimeToMicroseconds = k76;

  function Tf1(A) {
    return Array.isArray(A) && A.length === 2 && typeof A[0] === "number" && typeof A[1] === "number"
  }
  zFB.isTimeInputHrTime = Tf1;

  function y76(A) {
    return Tf1(A) || typeof A === "number" || A instanceof Date
  }
  zFB.isTimeInput = y76;

  function EFB(A, Q) {
    let B = [A[0] + Q[0], A[1] + Q[1]];
    if (B[1] >= EnA) B[1] -= EnA, B[0] += 1;
    return B
  }
  zFB.addHrTimes = EFB
})
// @from(Start 5336227, End 5336499)
qFB = z((wFB) => {
  Object.defineProperty(wFB, "__esModule", {
    value: !0
  });
  wFB.ExportResultCode = void 0;
  var l76;
  (function(A) {
    A[A.SUCCESS = 0] = "SUCCESS", A[A.FAILED = 1] = "FAILED"
  })(l76 = wFB.ExportResultCode || (wFB.ExportResultCode = {}))
})
// @from(Start 5336505, End 5337505)
RFB = z((MFB) => {
  Object.defineProperty(MFB, "__esModule", {
    value: !0
  });
  MFB.CompositePropagator = void 0;
  var NFB = K9();
  class LFB {
    _propagators;
    _fields;
    constructor(A = {}) {
      this._propagators = A.propagators ?? [], this._fields = Array.from(new Set(this._propagators.map((Q) => typeof Q.fields === "function" ? Q.fields() : []).reduce((Q, B) => Q.concat(B), [])))
    }
    inject(A, Q, B) {
      for (let G of this._propagators) try {
        G.inject(A, Q, B)
      } catch (Z) {
        NFB.diag.warn(`Failed to inject with ${G.constructor.name}. Err: ${Z.message}`)
      }
    }
    extract(A, Q, B) {
      return this._propagators.reduce((G, Z) => {
        try {
          return Z.extract(G, Q, B)
        } catch (I) {
          NFB.diag.warn(`Failed to extract with ${Z.constructor.name}. Err: ${I.message}`)
        }
        return G
      }, A)
    }
    fields() {
      return this._fields.slice()
    }
  }
  MFB.CompositePropagator = LFB
})
// @from(Start 5337511, End 5338016)
jFB = z((TFB) => {
  Object.defineProperty(TFB, "__esModule", {
    value: !0
  });
  TFB.validateValue = TFB.validateKey = void 0;
  var jf1 = "[_0-9a-z-*/]",
    i76 = `[a-z]${jf1}{0,255}`,
    n76 = `[a-z0-9]${jf1}{0,240}@[a-z]${jf1}{0,13}`,
    a76 = new RegExp(`^(?:${i76}|${n76})$`),
    s76 = /^[ -~]{0,255}[!-~]$/,
    r76 = /,|=/;

  function o76(A) {
    return a76.test(A)
  }
  TFB.validateKey = o76;

  function t76(A) {
    return s76.test(A) && !r76.test(A)
  }
  TFB.validateValue = t76
})
// @from(Start 5338022, End 5339536)
_f1 = z((xFB) => {
  Object.defineProperty(xFB, "__esModule", {
    value: !0
  });
  xFB.TraceState = void 0;
  var SFB = jFB(),
    _FB = 32,
    AG6 = 512,
    kFB = ",",
    yFB = "=";
  class Sf1 {
    _internalState = new Map;
    constructor(A) {
      if (A) this._parse(A)
    }
    set(A, Q) {
      let B = this._clone();
      if (B._internalState.has(A)) B._internalState.delete(A);
      return B._internalState.set(A, Q), B
    }
    unset(A) {
      let Q = this._clone();
      return Q._internalState.delete(A), Q
    }
    get(A) {
      return this._internalState.get(A)
    }
    serialize() {
      return this._keys().reduce((A, Q) => {
        return A.push(Q + yFB + this.get(Q)), A
      }, []).join(kFB)
    }
    _parse(A) {
      if (A.length > AG6) return;
      if (this._internalState = A.split(kFB).reverse().reduce((Q, B) => {
          let G = B.trim(),
            Z = G.indexOf(yFB);
          if (Z !== -1) {
            let I = G.slice(0, Z),
              Y = G.slice(Z + 1, B.length);
            if ((0, SFB.validateKey)(I) && (0, SFB.validateValue)(Y)) Q.set(I, Y)
          }
          return Q
        }, new Map), this._internalState.size > _FB) this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, _FB))
    }
    _keys() {
      return Array.from(this._internalState.keys()).reverse()
    }
    _clone() {
      let A = new Sf1;
      return A._internalState = new Map(this._internalState), A
    }
  }
  xFB.TraceState = Sf1
})
// @from(Start 5339542, End 5341385)
uFB = z((hFB) => {
  Object.defineProperty(hFB, "__esModule", {
    value: !0
  });
  hFB.W3CTraceContextPropagator = hFB.parseTraceParent = hFB.TRACE_STATE_HEADER = hFB.TRACE_PARENT_HEADER = void 0;
  var znA = K9(),
    QG6 = BUA(),
    BG6 = _f1();
  hFB.TRACE_PARENT_HEADER = "traceparent";
  hFB.TRACE_STATE_HEADER = "tracestate";
  var GG6 = "00",
    ZG6 = "(?!ff)[\\da-f]{2}",
    IG6 = "(?![0]{32})[\\da-f]{32}",
    YG6 = "(?![0]{16})[\\da-f]{16}",
    JG6 = "[\\da-f]{2}",
    WG6 = new RegExp(`^\\s?(${ZG6})-(${IG6})-(${YG6})-(${JG6})(-.*)?\\s?$`);

  function bFB(A) {
    let Q = WG6.exec(A);
    if (!Q) return null;
    if (Q[1] === "00" && Q[5]) return null;
    return {
      traceId: Q[2],
      spanId: Q[3],
      traceFlags: parseInt(Q[4], 16)
    }
  }
  hFB.parseTraceParent = bFB;
  class fFB {
    inject(A, Q, B) {
      let G = znA.trace.getSpanContext(A);
      if (!G || (0, QG6.isTracingSuppressed)(A) || !(0, znA.isSpanContextValid)(G)) return;
      let Z = `${GG6}-${G.traceId}-${G.spanId}-0${Number(G.traceFlags||znA.TraceFlags.NONE).toString(16)}`;
      if (B.set(Q, hFB.TRACE_PARENT_HEADER, Z), G.traceState) B.set(Q, hFB.TRACE_STATE_HEADER, G.traceState.serialize())
    }
    extract(A, Q, B) {
      let G = B.get(Q, hFB.TRACE_PARENT_HEADER);
      if (!G) return A;
      let Z = Array.isArray(G) ? G[0] : G;
      if (typeof Z !== "string") return A;
      let I = bFB(Z);
      if (!I) return A;
      I.isRemote = !0;
      let Y = B.get(Q, hFB.TRACE_STATE_HEADER);
      if (Y) {
        let J = Array.isArray(Y) ? Y.join(",") : Y;
        I.traceState = new BG6.TraceState(typeof J === "string" ? J : void 0)
      }
      return znA.trace.setSpanContext(A, I)
    }
    fields() {
      return [hFB.TRACE_PARENT_HEADER, hFB.TRACE_STATE_HEADER]
    }
  }
  hFB.W3CTraceContextPropagator = fFB
})
// @from(Start 5341391, End 5342012)
pFB = z((dFB) => {
  Object.defineProperty(dFB, "__esModule", {
    value: !0
  });
  dFB.getRPCMetadata = dFB.deleteRPCMetadata = dFB.setRPCMetadata = dFB.RPCType = void 0;
  var VG6 = K9(),
    kf1 = (0, VG6.createContextKey)("OpenTelemetry SDK Context Key RPC_METADATA"),
    FG6;
  (function(A) {
    A.HTTP = "http"
  })(FG6 = dFB.RPCType || (dFB.RPCType = {}));

  function KG6(A, Q) {
    return A.setValue(kf1, Q)
  }
  dFB.setRPCMetadata = KG6;

  function DG6(A) {
    return A.deleteValue(kf1)
  }
  dFB.deleteRPCMetadata = DG6;

  function HG6(A) {
    return A.getValue(kf1)
  }
  dFB.getRPCMetadata = HG6
})
// @from(Start 5342018, End 5343232)
oFB = z((sFB) => {
  Object.defineProperty(sFB, "__esModule", {
    value: !0
  });
  sFB.isPlainObject = void 0;
  var zG6 = "[object Object]",
    UG6 = "[object Null]",
    $G6 = "[object Undefined]",
    wG6 = Function.prototype,
    lFB = wG6.toString,
    qG6 = lFB.call(Object),
    NG6 = Object.getPrototypeOf,
    iFB = Object.prototype,
    nFB = iFB.hasOwnProperty,
    Nt = Symbol ? Symbol.toStringTag : void 0,
    aFB = iFB.toString;

  function LG6(A) {
    if (!MG6(A) || OG6(A) !== zG6) return !1;
    let Q = NG6(A);
    if (Q === null) return !0;
    let B = nFB.call(Q, "constructor") && Q.constructor;
    return typeof B == "function" && B instanceof B && lFB.call(B) === qG6
  }
  sFB.isPlainObject = LG6;

  function MG6(A) {
    return A != null && typeof A == "object"
  }

  function OG6(A) {
    if (A == null) return A === void 0 ? $G6 : UG6;
    return Nt && Nt in Object(A) ? RG6(A) : TG6(A)
  }

  function RG6(A) {
    let Q = nFB.call(A, Nt),
      B = A[Nt],
      G = !1;
    try {
      A[Nt] = void 0, G = !0
    } catch {}
    let Z = aFB.call(A);
    if (G)
      if (Q) A[Nt] = B;
      else delete A[Nt];
    return Z
  }

  function TG6(A) {
    return aFB.call(A)
  }
})
// @from(Start 5343238, End 5345666)
ZKB = z((BKB) => {
  Object.defineProperty(BKB, "__esModule", {
    value: !0
  });
  BKB.merge = void 0;
  var tFB = oFB(),
    PG6 = 20;

  function jG6(...A) {
    let Q = A.shift(),
      B = new WeakMap;
    while (A.length > 0) Q = AKB(Q, A.shift(), 0, B);
    return Q
  }
  BKB.merge = jG6;

  function yf1(A) {
    if (qnA(A)) return A.slice();
    return A
  }

  function AKB(A, Q, B = 0, G) {
    let Z;
    if (B > PG6) return;
    if (B++, wnA(A) || wnA(Q) || QKB(Q)) Z = yf1(Q);
    else if (qnA(A)) {
      if (Z = A.slice(), qnA(Q))
        for (let I = 0, Y = Q.length; I < Y; I++) Z.push(yf1(Q[I]));
      else if (IUA(Q)) {
        let I = Object.keys(Q);
        for (let Y = 0, J = I.length; Y < J; Y++) {
          let W = I[Y];
          Z[W] = yf1(Q[W])
        }
      }
    } else if (IUA(A))
      if (IUA(Q)) {
        if (!SG6(A, Q)) return Q;
        Z = Object.assign({}, A);
        let I = Object.keys(Q);
        for (let Y = 0, J = I.length; Y < J; Y++) {
          let W = I[Y],
            X = Q[W];
          if (wnA(X))
            if (typeof X > "u") delete Z[W];
            else Z[W] = X;
          else {
            let V = Z[W],
              F = X;
            if (eFB(A, W, G) || eFB(Q, W, G)) delete Z[W];
            else {
              if (IUA(V) && IUA(F)) {
                let K = G.get(V) || [],
                  D = G.get(F) || [];
                K.push({
                  obj: A,
                  key: W
                }), D.push({
                  obj: Q,
                  key: W
                }), G.set(V, K), G.set(F, D)
              }
              Z[W] = AKB(Z[W], X, B, G)
            }
          }
        }
      } else Z = Q;
    return Z
  }

  function eFB(A, Q, B) {
    let G = B.get(A[Q]) || [];
    for (let Z = 0, I = G.length; Z < I; Z++) {
      let Y = G[Z];
      if (Y.key === Q && Y.obj === A) return !0
    }
    return !1
  }

  function qnA(A) {
    return Array.isArray(A)
  }

  function QKB(A) {
    return typeof A === "function"
  }

  function IUA(A) {
    return !wnA(A) && !qnA(A) && !QKB(A) && typeof A === "object"
  }

  function wnA(A) {
    return typeof A === "string" || typeof A === "number" || typeof A === "boolean" || typeof A > "u" || A instanceof Date || A instanceof RegExp || A === null
  }

  function SG6(A, Q) {
    if (!(0, tFB.isPlainObject)(A) || !(0, tFB.isPlainObject)(Q)) return !1;
    return !0
  }
})
// @from(Start 5345672, End 5346288)
JKB = z((IKB) => {
  Object.defineProperty(IKB, "__esModule", {
    value: !0
  });
  IKB.callWithTimeout = IKB.TimeoutError = void 0;
  class NnA extends Error {
    constructor(A) {
      super(A);
      Object.setPrototypeOf(this, NnA.prototype)
    }
  }
  IKB.TimeoutError = NnA;

  function _G6(A, Q) {
    let B, G = new Promise(function(I, Y) {
      B = setTimeout(function() {
        Y(new NnA("Operation timed out."))
      }, Q)
    });
    return Promise.race([A, G]).then((Z) => {
      return clearTimeout(B), Z
    }, (Z) => {
      throw clearTimeout(B), Z
    })
  }
  IKB.callWithTimeout = _G6
})
// @from(Start 5346294, End 5346697)
FKB = z((XKB) => {
  Object.defineProperty(XKB, "__esModule", {
    value: !0
  });
  XKB.isUrlIgnored = XKB.urlMatches = void 0;

  function WKB(A, Q) {
    if (typeof Q === "string") return A === Q;
    else return !!A.match(Q)
  }
  XKB.urlMatches = WKB;

  function yG6(A, Q) {
    if (!Q) return !1;
    for (let B of Q)
      if (WKB(A, B)) return !0;
    return !1
  }
  XKB.isUrlIgnored = yG6
})
// @from(Start 5346703, End 5347162)
CKB = z((DKB) => {
  Object.defineProperty(DKB, "__esModule", {
    value: !0
  });
  DKB.Deferred = void 0;
  class KKB {
    _promise;
    _resolve;
    _reject;
    constructor() {
      this._promise = new Promise((A, Q) => {
        this._resolve = A, this._reject = Q
      })
    }
    get promise() {
      return this._promise
    }
    resolve(A) {
      this._resolve(A)
    }
    reject(A) {
      this._reject(A)
    }
  }
  DKB.Deferred = KKB
})
// @from(Start 5347168, End 5347960)
$KB = z((zKB) => {
  Object.defineProperty(zKB, "__esModule", {
    value: !0
  });
  zKB.BindOnceFuture = void 0;
  var vG6 = CKB();
  class EKB {
    _callback;
    _that;
    _isCalled = !1;
    _deferred = new vG6.Deferred;
    constructor(A, Q) {
      this._callback = A, this._that = Q
    }
    get isCalled() {
      return this._isCalled
    }
    get promise() {
      return this._deferred.promise
    }
    call(...A) {
      if (!this._isCalled) {
        this._isCalled = !0;
        try {
          Promise.resolve(this._callback.call(this._that, ...A)).then((Q) => this._deferred.resolve(Q), (Q) => this._deferred.reject(Q))
        } catch (Q) {
          this._deferred.reject(Q)
        }
      }
      return this._deferred.promise
    }
  }
  zKB.BindOnceFuture = EKB
})
// @from(Start 5347966, End 5348648)
LKB = z((qKB) => {
  Object.defineProperty(qKB, "__esModule", {
    value: !0
  });
  qKB.diagLogLevelFromString = void 0;
  var cb = K9(),
    wKB = {
      ALL: cb.DiagLogLevel.ALL,
      VERBOSE: cb.DiagLogLevel.VERBOSE,
      DEBUG: cb.DiagLogLevel.DEBUG,
      INFO: cb.DiagLogLevel.INFO,
      WARN: cb.DiagLogLevel.WARN,
      ERROR: cb.DiagLogLevel.ERROR,
      NONE: cb.DiagLogLevel.NONE
    };

  function bG6(A) {
    if (A == null) return;
    let Q = wKB[A.toUpperCase()];
    if (Q == null) return cb.diag.warn(`Unknown log level "${A}", expected one of ${Object.keys(wKB)}, using default`), cb.DiagLogLevel.INFO;
    return Q
  }
  qKB.diagLogLevelFromString = bG6
})
// @from(Start 5348654, End 5349029)
TKB = z((OKB) => {
  Object.defineProperty(OKB, "__esModule", {
    value: !0
  });
  OKB._export = void 0;
  var MKB = K9(),
    fG6 = BUA();

  function hG6(A, Q) {
    return new Promise((B) => {
      MKB.context.with((0, fG6.suppressTracing)(MKB.context.active()), () => {
        A.export(Q, (G) => {
          B(G)
        })
      })
    })
  }
  OKB._export = hG6
})