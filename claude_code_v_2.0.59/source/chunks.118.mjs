
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