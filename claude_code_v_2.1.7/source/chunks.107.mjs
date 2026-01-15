
// @from(Ln 308372, Col 0)
class xH0 {
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
        code: W6A.ExportResultCode.FAILED,
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
      if (!(eZ(!0) || p2())) {
        k("BigQuery metrics export: trust not established, skipping"), Q({
          code: W6A.ExportResultCode.SUCCESS
        });
        return
      }
      if (!(await UI1()).enabled) {
        k("Metrics export disabled by organization setting"), Q({
          code: W6A.ExportResultCode.SUCCESS
        });
        return
      }
      let Z = this.transformMetricsForInternal(A),
        Y = CJ();
      if (Y.error) {
        k(`Metrics export failed: ${Y.error}`), Q({
          code: W6A.ExportResultCode.FAILED,
          error: Error(Y.error)
        });
        return
      }
      let J = {
          "Content-Type": "application/json",
          "User-Agent": PD(),
          ...Y.headers
        },
        X = await xQ.post(this.endpoint, Z, {
          timeout: this.timeout,
          headers: J
        });
      k("BigQuery metrics exported successfully"), k(`BigQuery API Response: ${eA(X.data,null,2)}`), Q({
        code: W6A.ExportResultCode.SUCCESS
      })
    } catch (B) {
      k(`BigQuery metrics export failed: ${B instanceof Error?B.message:String(B)}`), e(B), Q({
        code: W6A.ExportResultCode.FAILED,
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
        "aggregation.temporality": this.selectAggregationTemporality() === SH0.AggregationTemporality.DELTA ? "delta" : "cumulative"
      };
    if (Q["wsl.version"]) B["wsl.version"] = Q["wsl.version"];
    if (qB()) {
      B["user.customer_type"] = "claude_ai";
      let Z = N6();
      if (Z) B["user.subscription_type"] = Z
    } else B["user.customer_type"] = "api";
    return {
      resource_attributes: B,
      metrics: A.scopeMetrics.flatMap((Z) => Z.metrics.map((Y) => ({
        name: Y.descriptor.name,
        description: Y.descriptor.description,
        unit: Y.descriptor.unit,
        data_points: this.extractDataPoints(Y)
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
    this.isShutdown = !0, await this.forceFlush(), k("BigQuery metrics exporter shutdown complete")
  }
  async forceFlush() {
    await Promise.all(this.pendingExports), k("BigQuery metrics exporter flush complete")
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
    return SH0.AggregationTemporality.DELTA
  }
}
// @from(Ln 308491, Col 4)
SH0
// @from(Ln 308491, Col 9)
W6A
// @from(Ln 308492, Col 4)
hw2 = w(() => {
  j5();
  T1();
  v1();
  qz();
  PH0();
  Q2();
  GQ();
  C0();
  A0();
  SH0 = c(sr(), 1), W6A = c(h8(), 1)
})
// @from(Ln 308505, Col 0)
function TS5() {
  if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE) process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta"
}
// @from(Ln 308509, Col 0)
function PS5() {
  let A = (process.env.OTEL_METRICS_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = parseInt(process.env.OTEL_METRIC_EXPORT_INTERVAL || jS5.toString()),
    B = [];
  for (let G of A)
    if (G === "console") {
      let Z = new GkA.ConsoleMetricExporter,
        Y = Z.export.bind(Z);
      Z.export = (J, X) => {
        if (J.resource && J.resource.attributes) k(`
=== Resource Attributes ===`), k(eA(J.resource.attributes)), k(`===========================
`);
        return Y(J, X)
      }, B.push(Z)
    } else if (G === "otlp") {
    let Z = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Y = hH0();
    switch (Z) {
      case "grpc":
        B.push(new uw2.OTLPMetricExporter);
        break;
      case "http/json":
        B.push(new mw2.OTLPMetricExporter(Y));
        break;
      case "http/protobuf":
        B.push(new gw2.OTLPMetricExporter(Y));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Z}`)
    }
  } else if (G === "prometheus") B.push(new dw2.PrometheusExporter);
  else throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`);
  return B.map((G) => {
    if ("export" in G) return new kH0.PeriodicExportingMetricReader({
      exporter: G,
      exportIntervalMillis: Q
    });
    return G
  })
}
// @from(Ln 308550, Col 0)
function SS5() {
  let A = (process.env.OTEL_LOGS_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = [];
  for (let B of A)
    if (B === "console") Q.push(new Us.ConsoleLogRecordExporter);
    else if (B === "otlp") {
    let G = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Z = hH0();
    switch (G) {
      case "grpc":
        Q.push(new pw2.OTLPLogExporter);
        break;
      case "http/json":
        Q.push(new bH0.OTLPLogExporter(Z));
        break;
      case "http/protobuf":
        Q.push(new cw2.OTLPLogExporter(Z));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`)
    }
  } else throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${B}`);
  return Q
}
// @from(Ln 308575, Col 0)
function xS5() {
  let A = (process.env.OTEL_TRACES_EXPORTER || "").trim().split(",").filter(Boolean),
    Q = [];
  for (let B of A)
    if (B === "console") Q.push(new qs.ConsoleSpanExporter);
    else if (B === "otlp") {
    let G = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
      Z = hH0();
    switch (G) {
      case "grpc":
        Q.push(new iw2.OTLPTraceExporter);
        break;
      case "http/json":
        Q.push(new fH0.OTLPTraceExporter(Z));
        break;
      case "http/protobuf":
        Q.push(new lw2.OTLPTraceExporter(Z));
        break;
      default:
        throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${G}`)
    }
  } else throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${B}`);
  return Q
}
// @from(Ln 308600, Col 0)
function yH0() {
  return a1(process.env.CLAUDE_CODE_ENABLE_TELEMETRY)
}
// @from(Ln 308604, Col 0)
function yS5() {
  let A = new xH0;
  return new kH0.PeriodicExportingMetricReader({
    exporter: A,
    exportIntervalMillis: 300000
  })
}
// @from(Ln 308612, Col 0)
function vS5() {
  let A = N6(),
    Q = qB() && (A === "enterprise" || A === "team");
  return kBB() || Q
}
// @from(Ln 308618, Col 0)
function kS5(A) {
  let Q = process.env.BETA_TRACING_ENDPOINT;
  if (!Q) return;
  let B = {
      url: `${Q}/v1/traces`
    },
    G = {
      url: `${Q}/v1/logs`
    },
    Z = new fH0.OTLPTraceExporter(B),
    Y = new qs.BatchSpanProcessor(Z, {
      scheduledDelayMillis: aw2
    }),
    J = new qs.BasicTracerProvider({
      resource: A,
      spanProcessors: [Y]
    });
  K6A.trace.setGlobalTracerProvider(J), Zq1(J);
  let X = new bH0.OTLPLogExporter(G),
    I = new Us.LoggerProvider({
      resource: A,
      processors: [new Us.BatchLogRecordProcessor(X, {
        scheduledDelayMillis: nw2
      })]
    });
  BkA.logs.setGlobalLoggerProvider(I), Qq1(I);
  let D = BkA.logs.getLogger("com.anthropic.claude_code.events", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION);
  Bq1(D), process.on("beforeExit", async () => {
    await I?.forceFlush(), await J?.forceFlush()
  }), process.on("exit", () => {
    I?.forceFlush(), J?.forceFlush()
  })
}
// @from(Ln 308659, Col 0)
function ow2() {
  x9("telemetry_init_start"), TS5(), K6A.diag.setLogger(new TH0, K6A.DiagLogLevel.ERROR);
  let A = [];
  if (yH0()) A.push(...PS5());
  if (vS5()) A.push(yS5());
  let Q = $Q(),
    B = {
      [Cs.ATTR_SERVICE_NAME]: "claude-code",
      [Cs.ATTR_SERVICE_VERSION]: {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION
    };
  if (Q === "wsl") {
    let V = Z1A();
    if (V) B["wsl.version"] = V
  }
  let G = iS.resourceFromAttributes(B),
    Z = iS.resourceFromAttributes(iS.osDetector.detect().attributes || {}),
    Y = iS.hostDetector.detect(),
    J = Y.attributes?.[Cs.SEMRESATTRS_HOST_ARCH] ? {
      [Cs.SEMRESATTRS_HOST_ARCH]: Y.attributes[Cs.SEMRESATTRS_HOST_ARCH]
    } : {},
    X = iS.resourceFromAttributes(J),
    I = iS.resourceFromAttributes(iS.envDetector.detect().attributes || {}),
    D = G.merge(Z).merge(X).merge(I);
  if (JK()) {
    kS5(D);
    let V = new GkA.MeterProvider({
      resource: D,
      views: [],
      readers: A
    });
    return Gq1(V), C6(async () => {
      let H = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
      try {
        IyA();
        let E = RdA(),
          z = t5A(),
          $ = [];
        if (E) $.push(E.forceFlush());
        if (z) $.push(z.forceFlush());
        await Promise.all($);
        let O = [V.shutdown()];
        if (E) O.push(E.shutdown());
        if (z) O.push(z.shutdown());
        await Promise.race([Promise.all(O), new Promise((L, M) => setTimeout(() => M(Error("OpenTelemetry shutdown timeout")), H))])
      } catch {}
    }), V.getMeter("com.anthropic.claude_code", {
      ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
      PACKAGE_URL: "@anthropic-ai/claude-code",
      README_URL: "https://code.claude.com/docs/en/overview",
      VERSION: "2.1.7",
      FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
      BUILD_TIME: "2026-01-13T22:55:21Z"
    }.VERSION)
  }
  let W = new GkA.MeterProvider({
    resource: D,
    views: [],
    readers: A
  });
  if (Gq1(W), yH0()) {
    let V = SS5();
    if (V.length > 0) {
      let F = new Us.LoggerProvider({
        resource: D,
        processors: V.map((E) => new Us.BatchLogRecordProcessor(E, {
          scheduledDelayMillis: parseInt(process.env.OTEL_LOGS_EXPORT_INTERVAL || nw2.toString())
        }))
      });
      BkA.logs.setGlobalLoggerProvider(F), Qq1(F);
      let H = BkA.logs.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.7",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-01-13T22:55:21Z"
      }.VERSION);
      Bq1(H), process.on("beforeExit", async () => {
        await F?.forceFlush(), await t5A()?.forceFlush()
      }), process.on("exit", () => {
        F?.forceFlush(), t5A()?.forceFlush()
      })
    }
  }
  if (yH0()) {
    if (aZ1.ENHANCED_TELEMETRY_BETA) {
      let V = xS5();
      if (V.length > 0) {
        let F = V.map((E) => new qs.BatchSpanProcessor(E, {
            scheduledDelayMillis: parseInt(process.env.OTEL_TRACES_EXPORT_INTERVAL || aw2.toString())
          })),
          H = new qs.BasicTracerProvider({
            resource: D,
            spanProcessors: F
          });
        K6A.trace.setGlobalTracerProvider(H), Zq1(H)
      }
    }
  }
  return C6(async () => {
    let V = parseInt(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS || "2000");
    try {
      IyA();
      let F = [W.shutdown()],
        H = RdA();
      if (H) F.push(H.shutdown());
      let E = t5A();
      if (E) F.push(E.shutdown());
      await Promise.race([Promise.all(F), new Promise((z, $) => setTimeout(() => $(Error("OpenTelemetry shutdown timeout")), V))])
    } catch (F) {
      if (F instanceof Error && F.message.includes("timeout")) k(`
OpenTelemetry telemetry flush timed out after ${V}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${V}ms
`, {
        level: "error"
      });
      throw F
    }
  }), W.getMeter("com.anthropic.claude_code", {
    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
    PACKAGE_URL: "@anthropic-ai/claude-code",
    README_URL: "https://code.claude.com/docs/en/overview",
    VERSION: "2.1.7",
    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
    BUILD_TIME: "2026-01-13T22:55:21Z"
  }.VERSION)
}
// @from(Ln 308799, Col 0)
async function rw2() {
  let A = mb0();
  if (!A) return;
  let Q = parseInt(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS || "5000");
  try {
    let B = [A.forceFlush()],
      G = RdA();
    if (G) B.push(G.forceFlush());
    let Z = t5A();
    if (Z) B.push(Z.forceFlush());
    await Promise.race([Promise.all(B), new Promise((Y, J) => setTimeout(() => J(Error("OpenTelemetry flush timeout")), Q))]), k("Telemetry flushed successfully")
  } catch (B) {
    if (B instanceof Error && B.message.includes("timeout")) k(`Telemetry flush timed out after ${Q}ms. Some metrics may not be exported.`, {
      level: "warn"
    });
    else k(`Telemetry flush failed: ${B instanceof Error?B.message:String(B)}`, {
      level: "error"
    })
  }
}
// @from(Ln 308820, Col 0)
function bS5() {
  let A = {},
    Q = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (Q)
    for (let B of Q.split(",")) {
      let [G, ...Z] = B.split("=");
      if (G && Z.length > 0) A[G.trim()] = Z.join("=").trim()
    }
  return A
}
// @from(Ln 308831, Col 0)
function hH0() {
  let A = bn(),
    Q = tT(),
    B = jQ(),
    G = {},
    Z = bS5();
  if (B?.otelHeadersHelper) G.headers = async () => {
    let X = fBB();
    return {
      ...Z,
      ...X
    }
  };
  else if (Object.keys(Z).length > 0) G.headers = async () => Z;
  let Y = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!A || Y && leA(Y)) {
    if (Q) G.httpAgentOptions = Q;
    return G
  }
  let J = (X) => {
    return Q ? new vH0.HttpsProxyAgent(A, {
      cert: Q.cert,
      key: Q.key,
      passphrase: Q.passphrase
    }) : new vH0.HttpsProxyAgent(A)
  };
  return G.httpAgentOptions = J, G
}
// @from(Ln 308859, Col 4)
K6A
// @from(Ln 308859, Col 9)
BkA
// @from(Ln 308859, Col 14)
GkA
// @from(Ln 308859, Col 19)
gw2
// @from(Ln 308859, Col 24)
uw2
// @from(Ln 308859, Col 29)
mw2
// @from(Ln 308859, Col 34)
dw2
// @from(Ln 308859, Col 39)
kH0
// @from(Ln 308859, Col 44)
Us
// @from(Ln 308859, Col 48)
cw2
// @from(Ln 308859, Col 53)
pw2
// @from(Ln 308859, Col 58)
bH0
// @from(Ln 308859, Col 63)
qs
// @from(Ln 308859, Col 67)
lw2
// @from(Ln 308859, Col 72)
iw2
// @from(Ln 308859, Col 77)
fH0
// @from(Ln 308859, Col 82)
iS
// @from(Ln 308859, Col 86)
Cs
// @from(Ln 308859, Col 90)
vH0
// @from(Ln 308859, Col 95)
jS5 = 60000
// @from(Ln 308860, Col 2)
nw2 = 5000
// @from(Ln 308861, Col 2)
aw2 = 5000
// @from(Ln 308862, Col 4)
gH0 = w(() => {
  fw2();
  hw2();
  nX();
  fn();
  Q2();
  C0();
  hr();
  rZ1();
  c3();
  Q2();
  GB();
  T1();
  aAA();
  cJA();
  fQ();
  uI0();
  A0();
  K6A = c(p9(), 1), BkA = c(Ga1(), 1), GkA = c(sr(), 1), gw2 = c(rK2(), 1), uw2 = c(Wq2(), 1), mw2 = c(xJ1(), 1), dw2 = c(Uq2(), 1), kH0 = c(sr(), 1), Us = c(ka1(), 1), cw2 = c(_q2(), 1), pw2 = c(yq2(), 1), bH0 = c(mq2(), 1), qs = c(Hw2(), 1), lw2 = c(ww2(), 1), iw2 = c(jw2(), 1), fH0 = c(bw2(), 1), iS = c($XA(), 1), Cs = c(bQA(), 1), vH0 = c(ELA(), 1)
})
// @from(Ln 308882, Col 4)
dkZ
// @from(Ln 308882, Col 9)
sw2
// @from(Ln 308883, Col 4)
tw2 = w(() => {
  j9();
  dkZ = m.object({
    checksum: m.string(),
    version: m.string().optional()
  }), sw2 = m.object({
    uuid: m.string(),
    checksum: m.string(),
    settings: m.record(m.string(), m.unknown())
  })
})
// @from(Ln 308895, Col 0)
function ew2({
  isDisabled: A = !1,
  visibleOptionCount: Q = 5,
  options: B,
  defaultValue: G = [],
  onChange: Z,
  onCancel: Y,
  onFocus: J,
  focusValue: X,
  submitButtonText: I,
  onSubmit: D
}) {
  let [W, K] = V6A.useState(G), [V, F] = V6A.useState(!1), [H, E] = V6A.useState(() => {
    let L = new Map;
    return B.forEach((M) => {
      if (M.type === "input" && M.initialValue) L.set(M.value, M.initialValue)
    }), L
  }), z = V6A.useCallback((L) => {
    let M = typeof L === "function" ? L(W) : L;
    K(M), Z?.(M)
  }, [W, Z]), $ = hZ1({
    visibleOptionCount: Q,
    options: B,
    initialFocusValue: void 0,
    onFocus: J,
    focusValue: X
  }), O = V6A.useCallback((L, M) => {
    E((j) => {
      let x = new Map(j);
      return x.set(L, M), x
    });
    let _ = B.find((j) => j.value === L);
    if (_ && _.type === "input") _.onChange(M);
    z((j) => {
      if (M) {
        if (!j.includes(L)) return [...j, L];
        return j
      } else return j.filter((x) => x !== L)
    })
  }, [B, z]);
  return J0((L, M) => {
    let j = B.find((b) => b.value === $.focusedValue)?.type === "input";
    if (j) {
      if (!(M.upArrow || M.downArrow || M.escape || M.tab || M.return || M.ctrl && (L === "n" || L === "p" || M.return))) return
    }
    let x = B[B.length - 1]?.value;
    if (M.tab && !M.shift) {
      if (I && D && $.focusedValue === x && !V) F(!0);
      else if (!V) $.focusNextOption();
      return
    }
    if (M.tab && M.shift) {
      if (I && D && V) F(!1), $.focusOption(x);
      else $.focusPreviousOption();
      return
    }
    if (M.downArrow || M.ctrl && L === "n" || !M.ctrl && !M.shift && L === "j") {
      if (I && D && $.focusedValue === x && !V) F(!0);
      else if (!V) $.focusNextOption();
      return
    }
    if (M.upArrow || M.ctrl && L === "p" || !M.ctrl && !M.shift && L === "k") {
      if (I && D && V) F(!1), $.focusOption(x);
      else $.focusPreviousOption();
      return
    }
    if (M.pageDown) {
      $.focusNextPage();
      return
    }
    if (M.pageUp) {
      $.focusPreviousPage();
      return
    }
    if (M.return || L === " ") {
      if (M.ctrl && M.return && j && D) {
        D();
        return
      }
      if (V && D) {
        D();
        return
      }
      if ($.focusedValue !== void 0) {
        let b = W.includes($.focusedValue) ? W.filter((S) => S !== $.focusedValue) : [...W, $.focusedValue];
        z(b)
      }
      return
    }
    if (/^[0-9]+$/.test(L)) {
      let b = parseInt(L) - 1;
      if (b >= 0 && b < B.length) {
        let S = B[b].value,
          u = W.includes(S) ? W.filter((f) => f !== S) : [...W, S];
        z(u)
      }
      return
    }
    if (M.escape) Y()
  }, {
    isActive: !A
  }), {
    ...$,
    selectedValues: W,
    inputValues: H,
    isSubmitFocused: V,
    updateInputValue: O,
    onCancel: Y
  }
}
// @from(Ln 309005, Col 4)
V6A
// @from(Ln 309006, Col 4)
AL2 = w(() => {
  fA();
  TI0();
  V6A = c(QA(), 1)
})
// @from(Ln 309012, Col 0)
function qI1({
  isDisabled: A = !1,
  visibleOptionCount: Q = 5,
  options: B,
  defaultValue: G = [],
  onCancel: Z,
  onChange: Y,
  onFocus: J,
  focusValue: X,
  submitButtonText: I,
  onSubmit: D
}) {
  let W = ew2({
      isDisabled: A,
      visibleOptionCount: Q,
      options: B,
      defaultValue: G,
      onChange: Y,
      onCancel: Z,
      onFocus: J,
      focusValue: X,
      submitButtonText: I,
      onSubmit: D
    }),
    K = B.length.toString().length;
  return tz.default.createElement(T, {
    flexDirection: "column"
  }, tz.default.createElement(T, {
    flexDirection: "column"
  }, W.visibleOptions.map((V, F) => {
    let H = W.focusedValue === V.value && !W.isSubmitFocused,
      E = W.selectedValues.includes(V.value),
      z = V.index === W.visibleFromIndex,
      $ = V.index === W.visibleToIndex - 1,
      O = W.visibleToIndex < B.length,
      L = W.visibleFromIndex > 0,
      M = W.visibleFromIndex + F + 1;
    if (V.type === "input") {
      let _ = W.inputValues.get(V.value) || "";
      return tz.default.createElement(T, {
        key: String(V.value),
        gap: 1
      }, tz.default.createElement(zVA, {
        option: V,
        isFocused: H,
        isSelected: !1,
        shouldShowDownArrow: O && $,
        shouldShowUpArrow: L && z,
        maxIndexWidth: K,
        index: M,
        inputValue: _,
        onInputChange: (j) => {
          W.updateInputValue(V.value, j)
        },
        onSubmit: () => {},
        onExit: () => {
          Z()
        },
        layout: "compact"
      }, tz.default.createElement(C, {
        color: E ? "success" : void 0
      }, "[", E ? tA.tick : " ", "]", " ")))
    }
    return tz.default.createElement(T, {
      key: String(V.value),
      gap: 1
    }, tz.default.createElement(yr, {
      isFocused: H,
      isSelected: !1,
      shouldShowDownArrow: O && $,
      shouldShowUpArrow: L && z,
      description: V.description
    }, tz.default.createElement(C, {
      dimColor: !0
    }, `${M}.`.padEnd(K)), tz.default.createElement(C, {
      color: E ? "success" : void 0
    }, "[", E ? tA.tick : " ", "]"), tz.default.createElement(C, {
      color: H ? "suggestion" : void 0
    }, V.label)))
  })), I && D && tz.default.createElement(T, {
    marginTop: 0,
    gap: 1
  }, W.isSubmitFocused ? tz.default.createElement(C, {
    color: "suggestion"
  }, tA.pointer) : tz.default.createElement(C, null, " "), tz.default.createElement(T, {
    marginLeft: 3
  }, tz.default.createElement(C, {
    color: W.isSubmitFocused ? "suggestion" : void 0,
    bold: !0
  }, I))))
}
// @from(Ln 309103, Col 4)
tz
// @from(Ln 309104, Col 4)
uH0 = w(() => {
  B2();
  fA();
  PI0();
  bZ1();
  AL2();
  tz = c(QA(), 1)
})
// @from(Ln 309112, Col 4)
u8 = w(() => {
  W8();
  uH0()
})
// @from(Ln 309117, Col 0)
function pFA({
  title: A,
  subtitle: Q,
  color: B = "permission"
}) {
  return Ac.createElement(T, {
    flexDirection: "column"
  }, Ac.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, Ac.createElement(C, {
    bold: !0,
    color: B
  }, A), Q !== void 0 && Ac.createElement(C, {
    wrap: "truncate-start"
  }, Q)))
}
// @from(Ln 309134, Col 4)
Ac
// @from(Ln 309135, Col 4)
NI1 = w(() => {
  fA();
  Ac = c(QA(), 1)
})
// @from(Ln 309140, Col 0)
function QL2(A) {
  if (!A) return fS5;
  let Q = fb[A];
  if (Q) return Q;
  return `ansi:${A}`
}
// @from(Ln 309146, Col 4)
fS5 = "cyan_FOR_SUBAGENTS_ONLY"
// @from(Ln 309147, Col 4)
mH0 = w(() => {
  EO()
})
// @from(Ln 309151, Col 0)
function BL2({
  name: A,
  color: Q
}) {
  let B = QL2(Q);
  return F6A.createElement(T, {
    flexDirection: "row",
    gap: 1
  }, F6A.createElement(C, {
    color: B
  }, xJ, " ", F6A.createElement(C, {
    bold: !0
  }, A)))
}
// @from(Ln 309165, Col 4)
F6A
// @from(Ln 309166, Col 4)
GL2 = w(() => {
  fA();
  vS();
  mH0();
  F6A = c(QA(), 1)
})
// @from(Ln 309173, Col 0)
function VY({
  title: A,
  subtitle: Q,
  color: B = "permission",
  titleColor: G,
  innerPaddingX: Z = 1,
  workerBadge: Y,
  titleRight: J,
  children: X
}) {
  return wO.createElement(T, {
    flexDirection: "column",
    borderStyle: "round",
    borderColor: B,
    borderLeft: !1,
    borderRight: !1,
    borderBottom: !1,
    marginTop: 1
  }, wO.createElement(T, {
    paddingX: 1,
    flexDirection: "column"
  }, Y && wO.createElement(BL2, {
    name: Y.name,
    color: Y.color
  }), wO.createElement(T, {
    justifyContent: "space-between"
  }, wO.createElement(pFA, {
    title: A,
    subtitle: Q,
    color: G
  }), J)), wO.createElement(T, {
    flexDirection: "column",
    paddingX: Z
  }, X))
}
// @from(Ln 309208, Col 4)
wO
// @from(Ln 309209, Col 4)
dN = w(() => {
  fA();
  NI1();
  GL2();
  wO = c(QA(), 1)
})
// @from(Ln 309215, Col 4)
ZL2
// @from(Ln 309215, Col 9)
H6A
// @from(Ln 309216, Col 4)
wI1 = w(() => {
  ZL2 = ["apiKeyHelper", "awsAuthRefresh", "awsCredentialExport", "otelHeadersHelper", "statusLine"], H6A = new Set(["ANTHROPIC_CUSTOM_HEADERS", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_DEFAULT_OPUS_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_FOUNDRY_API_KEY", "ANTHROPIC_MODEL", "ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION", "ANTHROPIC_SMALL_FAST_MODEL", "AWS_DEFAULT_REGION", "AWS_PROFILE", "AWS_REGION", "BASH_DEFAULT_TIMEOUT_MS", "BASH_MAX_OUTPUT_LENGTH", "BASH_MAX_TIMEOUT_MS", "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR", "CLAUDE_BASH_NO_LOGIN", "CLAUDE_CODE_API_KEY_HELPER_TTL_MS", "CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS", "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "CLAUDE_CODE_DISABLE_TERMINAL_TITLE", "CLAUDE_CODE_ENABLE_TELEMETRY", "CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL", "CLAUDE_CODE_MAX_OUTPUT_TOKENS", "CLAUDE_CODE_SKIP_BEDROCK_AUTH", "CLAUDE_CODE_SKIP_FOUNDRY_AUTH", "CLAUDE_CODE_SKIP_VERTEX_AUTH", "CLAUDE_CODE_SUBAGENT_MODEL", "CLAUDE_CODE_USE_BEDROCK", "CLAUDE_CODE_USE_FOUNDRY", "CLAUDE_CODE_USE_VERTEX", "DISABLE_AUTOUPDATER", "DISABLE_BUG_COMMAND", "DISABLE_COST_WARNINGS", "DISABLE_ERROR_REPORTING", "DISABLE_TELEMETRY", "ENABLE_EXPERIMENTAL_MCP_CLI", "ENABLE_TOOL_SEARCH", "MAX_MCP_OUTPUT_TOKENS", "MAX_THINKING_TOKENS", "MCP_TIMEOUT", "MCP_TOOL_TIMEOUT", "OTEL_EXPORTER_OTLP_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_HEADERS", "OTEL_EXPORTER_OTLP_LOGS_PROTOCOL", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE", "OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY", "OTEL_EXPORTER_OTLP_METRICS_HEADERS", "OTEL_EXPORTER_OTLP_METRICS_PROTOCOL", "OTEL_EXPORTER_OTLP_PROTOCOL", "OTEL_EXPORTER_OTLP_TRACES_HEADERS", "OTEL_LOG_USER_PROMPTS", "OTEL_LOGS_EXPORT_INTERVAL", "OTEL_LOGS_EXPORTER", "OTEL_METRIC_EXPORT_INTERVAL", "OTEL_METRICS_EXPORTER", "OTEL_METRICS_INCLUDE_ACCOUNT_UUID", "OTEL_METRICS_INCLUDE_SESSION_ID", "OTEL_METRICS_INCLUDE_VERSION", "OTEL_RESOURCE_ATTRIBUTES", "USE_BUILTIN_RIPGREP", "VERTEX_REGION_CLAUDE_3_5_HAIKU", "VERTEX_REGION_CLAUDE_3_5_SONNET", "VERTEX_REGION_CLAUDE_3_7_SONNET", "VERTEX_REGION_CLAUDE_4_0_OPUS", "VERTEX_REGION_CLAUDE_4_0_SONNET", "VERTEX_REGION_CLAUDE_4_1_OPUS", "VERTEX_REGION_CLAUDE_HAIKU_4_5"])
})
// @from(Ln 309220, Col 0)
function lFA(A) {
  if (!A) return {
    shellSettings: {},
    envVars: {},
    hasHooks: !1
  };
  let Q = {};
  for (let Z of ZL2) {
    let Y = A[Z];
    if (typeof Y === "string" && Y.length > 0) Q[Z] = Y
  }
  let B = {};
  if (A.env && typeof A.env === "object") {
    for (let [Z, Y] of Object.entries(A.env))
      if (typeof Y === "string" && Y.length > 0) {
        if (!H6A.has(Z.toUpperCase())) B[Z] = Y
      }
  }
  let G = A.hooks !== void 0 && A.hooks !== null && typeof A.hooks === "object" && Object.keys(A.hooks).length > 0;
  return {
    shellSettings: Q,
    envVars: B,
    hasHooks: G,
    hooks: G ? A.hooks : void 0
  }
}
// @from(Ln 309247, Col 0)
function LI1(A) {
  return Object.keys(A.shellSettings).length > 0 || Object.keys(A.envVars).length > 0 || A.hasHooks
}
// @from(Ln 309251, Col 0)
function YL2(A, Q) {
  let B = lFA(A),
    G = lFA(Q);
  if (!LI1(G)) return !1;
  if (!LI1(B)) return !0;
  let Z = eA({
      shellSettings: B.shellSettings,
      envVars: B.envVars,
      hooks: B.hooks
    }),
    Y = eA({
      shellSettings: G.shellSettings,
      envVars: G.envVars,
      hooks: G.hooks
    });
  return Z !== Y
}
// @from(Ln 309269, Col 0)
function JL2(A) {
  let Q = [];
  for (let B of Object.keys(A.shellSettings)) Q.push(B);
  for (let B of Object.keys(A.envVars)) Q.push(B);
  if (A.hasHooks) Q.push("hooks");
  return Q
}
// @from(Ln 309276, Col 4)
dH0 = w(() => {
  wI1();
  A0()
})
// @from(Ln 309281, Col 0)
function XL2({
  settings: A,
  onAccept: Q,
  onReject: B
}) {
  let G = lFA(A),
    Z = JL2(G),
    Y = MQ();
  J0((X, I) => {
    if (I.escape) {
      B();
      return
    }
  });

  function J(X) {
    if (X === "exit") {
      B();
      return
    }
    Q()
  }
  return $E.default.createElement(VY, {
    color: "warning",
    titleColor: "warning",
    title: "Managed settings require approval"
  }, $E.default.createElement(T, {
    flexDirection: "column",
    gap: 1,
    paddingTop: 1
  }, $E.default.createElement(C, null, "Your organization has configured managed settings that could allow execution of arbitrary code or interception of your prompts and responses."), $E.default.createElement(T, {
    flexDirection: "column"
  }, $E.default.createElement(C, {
    dimColor: !0
  }, "Settings requiring approval:"), Z.map((X, I) => $E.default.createElement(T, {
    key: I,
    paddingLeft: 2
  }, $E.default.createElement(C, null, $E.default.createElement(C, {
    dimColor: !0
  }, "· "), $E.default.createElement(C, null, X))))), $E.default.createElement(C, null, "Only accept if you trust your organization's IT administration and expect these settings to be configured."), $E.default.createElement(k0, {
    options: [{
      label: "Yes, I trust these settings",
      value: "accept"
    }, {
      label: "No, exit Claude Code",
      value: "exit"
    }],
    onChange: (X) => J(X),
    onCancel: () => J("exit")
  }), $E.default.createElement(C, {
    dimColor: !0
  }, Y.pending ? $E.default.createElement($E.default.Fragment, null, "Press ", Y.keyName, " again to exit") : $E.default.createElement($E.default.Fragment, null, "Enter to confirm · Esc to exit"))))
}
// @from(Ln 309334, Col 4)
$E
// @from(Ln 309335, Col 4)
IL2 = w(() => {
  fA();
  u8();
  dN();
  E9();
  dH0();
  $E = c(QA(), 1)
})
// @from(Ln 309350, Col 0)
function uS5() {
  if (Qc !== null) return Qc;
  if (process.stdin.isTTY) {
    Qc = void 0;
    return
  }
  if (a1(!1)) {
    Qc = void 0;
    return
  }
  if (process.argv.includes("mcp")) {
    Qc = void 0;
    return
  }
  if (process.platform === "win32") {
    Qc = void 0;
    return
  }
  try {
    let A = hS5("/dev/tty", "r"),
      Q = new gS5(A);
    return Q.isTTY = !0, Qc = Q, Qc
  } catch (A) {
    e(A), Qc = void 0;
    return
  }
}
// @from(Ln 309378, Col 0)
function FY(A = !1) {
  let Q = uS5(),
    B = {
      exitOnCtrlC: A
    };
  if (Q) B.stdin = Q;
  return B
}
// @from(Ln 309386, Col 4)
Qc = null
// @from(Ln 309387, Col 4)
Kf = w(() => {
  fQ();
  v1()
})
// @from(Ln 309392, Col 0)
function dS5(A, Q) {
  let {
    addNotification: B,
    removeNotification: G
  } = S4();
  cN.useEffect(() => {
    if (A.length === 0) {
      G("keybinding-config-warning");
      return
    }
    let Y = A.filter((I) => I.severity === "error").length,
      J = A.filter((I) => I.severity === "warning").length,
      X;
    if (Y > 0 && J > 0) X = `Found ${Y} keybinding error${Y>1?"s":""} and ${J} warning${J>1?"s":""}`;
    else if (Y > 0) X = `Found ${Y} keybinding error${Y>1?"s":""}`;
    else X = `Found ${J} keybinding warning${J>1?"s":""}`;
    X += " · /doctor for details", B({
      key: "keybinding-config-warning",
      text: X,
      color: Y > 0 ? "error" : "warning",
      priority: Y > 0 ? "immediate" : "high",
      timeoutMs: 60000
    })
  }, [A, Q, B, G])
}
// @from(Ln 309418, Col 0)
function vJ({
  children: A
}) {
  let [{
    bindings: Q,
    warnings: B
  }, G] = cN.useState(() => {
    let K = FB0();
    return k(`[keybindings] KeybindingSetup initialized with ${K.bindings.length} bindings, ${K.warnings.length} warnings`), K
  }), [Z, Y] = cN.useState(!1);
  dS5(B, Z);
  let [J, X] = cN.useState(null), I = cN.useRef(null), D = cN.useCallback(() => {
    if (I.current) clearTimeout(I.current), I.current = null
  }, []), W = cN.useCallback((K) => {
    if (D(), K !== null) I.current = setTimeout(() => {
      k("[keybindings] Chord timeout - cancelling"), X(null)
    }, mS5);
    X(K)
  }, [D]);
  return cN.useEffect(() => {
    mOB();
    let K = dOB((V) => {
      Y(!0), G(V), k(`[keybindings] Reloaded: ${V.bindings.length} bindings, ${V.warnings.length} warnings`)
    });
    return () => {
      K(), D()
    }
  }, [D]), cN.default.createElement(xOB, {
    bindings: Q,
    pendingChord: J,
    setPendingChord: W
  }, A)
}
// @from(Ln 309451, Col 4)
cN
// @from(Ln 309451, Col 8)
mS5 = 1000
// @from(Ln 309452, Col 4)
Bc = w(() => {
  m21();
  XDA();
  T1();
  HY();
  cN = c(QA(), 1)
})
// @from(Ln 309459, Col 0)
async function DL2(A, Q) {
  if (!Q || !LI1(lFA(Q))) return "no_check_needed";
  if (!YL2(A, Q)) return "no_check_needed";
  if (!e5A()) return "no_check_needed";
  return l("tengu_managed_settings_security_dialog_shown", {}), new Promise((B) => {
    (async () => {
      let {
        unmount: G
      } = await Y5(OI1.default.createElement(b5, null, OI1.default.createElement(vJ, null, OI1.default.createElement(XL2, {
        settings: Q,
        onAccept: () => {
          l("tengu_managed_settings_security_dialog_accepted", {}), G(), B("approved")
        },
        onReject: () => {
          l("tengu_managed_settings_security_dialog_rejected", {}), G(), B("rejected")
        }
      }))), FY(!1))
    })()
  })
}
// @from(Ln 309480, Col 0)
function WL2(A) {
  if (A === "rejected") return f6(1), !1;
  return !0
}
// @from(Ln 309484, Col 4)
OI1
// @from(Ln 309485, Col 4)
KL2 = w(() => {
  fA();
  IL2();
  hB();
  C0();
  Z0();
  yJ();
  dH0();
  Kf();
  Bc();
  OI1 = c(QA(), 1)
})
// @from(Ln 309508, Col 0)
function FL2() {
  if (E6A) return;
  if (Zc()) E6A = new Promise((A) => {
    Gc = A, setTimeout(() => {
      if (Gc) k("Remote settings: Loading promise timed out, resolving anyway"), Gc(), Gc = null
    }, aS5)
  })
}
// @from(Ln 309517, Col 0)
function MI1() {
  return cS5(zQ(), lS5)
}
// @from(Ln 309521, Col 0)
function oS5() {
  return `${v9().BASE_API_URL}/api/claude_code/settings`
}
// @from(Ln 309525, Col 0)
function pH0(A) {
  if (Array.isArray(A)) return A.map(pH0);
  if (A !== null && typeof A === "object") {
    let Q = {};
    for (let B of Object.keys(A).sort()) Q[B] = pH0(A[B]);
    return Q
  }
  return A
}
// @from(Ln 309535, Col 0)
function rS5(A) {
  let Q = pH0(A),
    B = eA(Q);
  return `sha256:${pS5("sha256").update(B).digest("hex")}`
}
// @from(Ln 309541, Col 0)
function Zc() {
  if (R4() !== "firstParty") return !1;
  if (!kEQ()) return !1;
  try {
    let {
      key: Q
    } = Oz({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
    if (Q) return !0
  } catch {}
  let A = g4();
  if (!A?.accessToken) return !1;
  if (!A.scopes?.includes(PGA)) return !1;
  if (A.subscriptionType !== "enterprise") return !1;
  return !0
}
// @from(Ln 309559, Col 0)
function iH0() {
  return Zc()
}
// @from(Ln 309562, Col 0)
async function HL2() {
  if (E6A) await E6A
}
// @from(Ln 309566, Col 0)
function sS5() {
  try {
    let {
      key: Q
    } = Oz({
      skipRetrievingKeyFromApiKeyHelper: !0
    });
    if (Q) return {
      headers: {
        "x-api-key": Q
      }
    }
  } catch {}
  let A = g4();
  if (A?.accessToken) return {
    headers: {
      Authorization: `Bearer ${A.accessToken}`,
      "anthropic-beta": zi
    }
  };
  return {
    headers: {},
    error: "No authentication available"
  }
}
// @from(Ln 309591, Col 0)
async function tS5(A) {
  let Q = null;
  for (let B = 1; B <= cH0 + 1; B++) {
    if (Q = await eS5(A), Q.success) return Q;
    if (Q.skipRetry) return Q;
    if (B > cH0) return Q;
    let G = fSA(B);
    k(`Remote settings: Retry ${B}/${cH0} after ${G}ms`), await QKA(G)
  }
  return Q
}
// @from(Ln 309602, Col 0)
async function eS5(A) {
  try {
    await xR();
    let Q = sS5();
    if (Q.error) return {
      success: !1,
      error: "Authentication required for remote settings",
      skipRetry: !0
    };
    let B = oS5(),
      G = {
        ...Q.headers,
        "User-Agent": PD()
      };
    if (A) G["If-None-Match"] = `"${A}"`;
    let Z = await xQ.get(B, {
      headers: G,
      timeout: iS5,
      validateStatus: (X) => X === 200 || X === 304 || X === 404
    });
    if (Z.status === 304) return k("Remote settings: Using cached settings (304)"), {
      success: !0,
      settings: null,
      checksum: A
    };
    if (Z.status === 404) return k("Remote settings: No settings found (404)"), {
      success: !0,
      settings: {},
      checksum: void 0
    };
    let Y = sw2.safeParse(Z.data);
    if (!Y.success) return k(`Remote settings: Invalid response format - ${Y.error.message}`), {
      success: !1,
      error: "Invalid remote settings format"
    };
    let J = Ld.safeParse(Y.data.settings);
    if (!J.success) return k(`Remote settings: Settings validation failed - ${J.error.message}`), {
      success: !1,
      error: "Invalid settings structure"
    };
    return k("Remote settings: Fetched successfully"), {
      success: !0,
      settings: J.data,
      checksum: Y.data.checksum
    }
  } catch (Q) {
    if (xQ.isAxiosError(Q)) {
      let B = Q;
      if (B.response?.status === 404) return {
        success: !0,
        settings: {},
        checksum: ""
      };
      if (B.response?.status === 401 || B.response?.status === 403) return {
        success: !1,
        error: "Not authorized for remote settings",
        skipRetry: !0
      };
      if (B.code === "ECONNABORTED") return {
        success: !1,
        error: "Remote settings request timeout"
      };
      if (B.code === "ECONNREFUSED" || B.code === "ENOTFOUND") return {
        success: !1,
        error: "Cannot connect to server"
      }
    }
    return {
      success: !1,
      error: Q instanceof Error ? Q.message : "Unknown error"
    }
  }
}
// @from(Ln 309676, Col 0)
function EL2() {
  try {
    let A = MI1();
    if (!lH0(A)) return null;
    let Q = nK(A),
      B = c5(Q, !1);
    if (!B || typeof B !== "object" || Array.isArray(B)) return null;
    return B
  } catch {
    return null
  }
}
// @from(Ln 309689, Col 0)
function Ax5(A) {
  try {
    let Q = MI1();
    yR(Q, eA(A, null, 2), {
      encoding: "utf-8",
      mode: 384
    }), k(`Remote settings: Saved to ${Q}`)
  } catch (Q) {
    k(`Remote settings: Failed to save - ${Q instanceof Error?Q.message:"unknown error"}`)
  }
}
// @from(Ln 309701, Col 0)
function nH0() {
  CL2(), LO = null, E6A = null, Gc = null;
  try {
    let A = MI1();
    if (lH0(A)) VL2(A)
  } catch {}
}
// @from(Ln 309708, Col 0)
async function aH0() {
  if (!Zc()) return null;
  let A = EL2(),
    Q = A ? rS5(A) : void 0;
  try {
    let B = await tS5(Q);
    if (!B.success) {
      if (A) return k("Remote settings: Using stale cache after fetch failure"), LO = A, A;
      return null
    }
    if (B.settings === null && A) return k("Remote settings: Cache still valid (304 Not Modified)"), LO = A, A;
    let G = B.settings || {};
    if (Object.keys(G).length > 0) {
      let Y = await DL2(A, G);
      if (!WL2(Y)) return k("Remote settings: User rejected new settings, using cached settings"), A;
      return LO = G, Ax5(G), k("Remote settings: Applied new settings successfully"), G
    }
    LO = G;
    try {
      let Y = MI1();
      if (lH0(Y)) VL2(Y), k("Remote settings: Deleted cached file (404 response)")
    } catch (Y) {
      k(`Remote settings: Failed to delete cached file - ${Y instanceof Error?Y.message:"unknown error"}`)
    }
    return G
  } catch {
    if (A) return k("Remote settings: Using stale cache after error"), LO = A, A;
    return null
  }
}
// @from(Ln 309739, Col 0)
function oH0() {
  if (!Zc()) return null;
  if (LO) return LO;
  let A = EL2();
  if (A) return LO = A, A;
  return null
}
// @from(Ln 309746, Col 0)
async function zL2() {
  if (Zc() && !E6A) E6A = new Promise((A) => {
    Gc = A
  });
  try {
    let A = await aH0();
    if (Zc()) Bx5();
    if (A !== null) vP(), HC.notifyChange("policySettings")
  } finally {
    if (Gc) Gc(), Gc = null
  }
}
// @from(Ln 309758, Col 0)
async function $L2() {
  if (nH0(), !Zc()) {
    vP(), HC.notifyChange("policySettings");
    return
  }
  await aH0(), k("Remote settings: Refreshed after auth change"), vP(), HC.notifyChange("policySettings")
}
// @from(Ln 309765, Col 0)
async function Qx5() {
  if (!Zc()) return;
  let A = LO ? eA(LO) : null;
  try {
    if (await aH0(), (LO ? eA(LO) : null) !== A) k("Remote settings: Changed during background poll"), vP(), HC.notifyChange("policySettings")
  } catch {}
}
// @from(Ln 309773, Col 0)
function Bx5() {
  if (ZkA !== null) return;
  if (!Zc()) return;
  ZkA = setInterval(() => {
    Qx5()
  }, nS5), C6(async () => CL2())
}
// @from(Ln 309781, Col 0)
function CL2() {
  if (ZkA !== null) clearInterval(ZkA), ZkA = null
}
// @from(Ln 309784, Col 4)
lS5 = "remote-settings.json"
// @from(Ln 309785, Col 2)
iS5 = 1e4
// @from(Ln 309786, Col 2)
cH0 = 5
// @from(Ln 309787, Col 2)
nS5 = 3600000
// @from(Ln 309788, Col 2)
ZkA = null
// @from(Ln 309789, Col 2)
E6A = null
// @from(Ln 309790, Col 2)
Gc = null
// @from(Ln 309791, Col 2)
aS5 = 30000
// @from(Ln 309792, Col 2)
LO = null
// @from(Ln 309793, Col 4)
iFA = w(() => {
  j5();
  qz();
  T1();
  JX();
  Q2();
  wd();
  tw2();
  fQ();
  MD();
  y9();
  vI();
  hSA();
  _9A();
  WBA();
  GB();
  nX();
  KL2();
  A0()
})
// @from(Ln 309813, Col 0)
async function sH0({
  clearOnboarding: A = !1
}) {
  await rw2(), await yBB(), ZL().delete(), RI1(), S0((B) => {
    let G = {
      ...B
    };
    if (A) {
      if (G.hasCompletedOnboarding = !1, G.subscriptionNoticeCount = 0, G.hasAvailableSubscription = !1, G.customApiKeyResponses?.approved) G.customApiKeyResponses = {
        ...G.customApiKeyResponses,
        approved: []
      }
    }
    return G.oauthAccount = void 0, G
  })
}
// @from(Ln 309829, Col 4)
rH0
// @from(Ln 309829, Col 9)
RI1 = () => {
    g4.cache?.clear?.(), VA1(), CeQ(), FKB(), RQA.cache?.clear?.(), or.cache?.clear?.(), nH0()
  }
// @from(Ln 309832, Col 2)
UL2
// @from(Ln 309833, Col 4)
_I1 = w(() => {
  GQ();
  Xd();
  sBA();
  fA();
  Q2();
  lnA();
  RR();
  BI();
  Ou();
  yJ();
  sVA();
  gH0();
  iFA();
  w6();
  rH0 = c(QA(), 1);
  UL2 = {
    type: "local-jsx",
    name: "logout",
    description: "Sign out from your Anthropic account",
    isEnabled: () => !process.env.DISABLE_LOGOUT_COMMAND,
    isHidden: !1,
    async call() {
      if (!Tz()) await sI();
      await sH0({
        clearOnboarding: !0
      });
      let A = rH0.createElement(C, null, "Successfully logged out from your Anthropic account.");
      return setTimeout(() => {
        f6(0, "logout")
      }, 200), A
    },
    userFacingName() {
      return "logout"
    }
  }
})
// @from(Ln 309870, Col 0)
class YkA {
  codeVerifier;
  authCodeListener = null;
  port = null;
  manualAuthCodeResolver = null;
  constructor() {
    this.codeVerifier = UZ2()
  }
  async startOAuthFlow(A, Q) {
    this.authCodeListener = new eD0, this.port = await this.authCodeListener.start();
    let B = qZ2(this.codeVerifier),
      G = NZ2(),
      Z = {
        codeChallenge: B,
        state: G,
        port: this.port,
        loginWithClaudeAi: Q?.loginWithClaudeAi,
        inferenceOnly: Q?.inferenceOnly,
        orgUUID: Q?.orgUUID
      },
      Y = oT1({
        ...Z,
        isManual: !0
      }),
      J = oT1({
        ...Z,
        isManual: !1
      }),
      X = await this.waitForAuthorizationCode(G, async () => {
        await A(Y), await i7(J)
      }),
      I = this.authCodeListener?.hasPendingResponse() ?? !1;
    l("tengu_oauth_auth_code_received", {
      automatic: I
    });
    try {
      let D = await MEQ(X, G, this.codeVerifier, this.port, !I, Q?.expiresIn);
      await sH0({
        clearOnboarding: !1
      });
      let W = await sT1(D.access_token);
      if (D.account) tT1({
        accountUuid: D.account.uuid,
        emailAddress: D.account.email_address,
        organizationUuid: D.organization?.uuid,
        displayName: W.displayName,
        hasExtraUsageEnabled: W.hasExtraUsageEnabled ?? void 0
      });
      if (I) {
        let K = nnA(D.scope);
        this.authCodeListener?.handleSuccessRedirect(K)
      }
      return this.formatTokens(D, W.subscriptionType, W.rateLimitTier)
    } catch (D) {
      if (I) this.authCodeListener?.handleErrorRedirect();
      throw D
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
      scopes: nnA(A.scope),
      subscriptionType: Q,
      rateLimitTier: B
    }
  }
  cleanup() {
    this.authCodeListener?.close(), this.manualAuthCodeResolver = null
  }
}
// @from(Ln 309956, Col 4)
tH0 = w(() => {
  TN();
  CZ2();
  wZ2();
  JL();
  _I1();
  Z0()
})
// @from(Ln 309964, Col 0)
async function Gx5() {
  try {
    if (a1(process.env.CLAUDE_CODE_USE_BEDROCK) || a1(process.env.CLAUDE_CODE_USE_VERTEX) || a1(process.env.CLAUDE_CODE_USE_FOUNDRY)) return !0;
    return await xQ.get("https://api.anthropic.com/api/hello", {
      timeout: 5000,
      headers: {
        "Cache-Control": "no-cache"
      }
    }), !0
  } catch (A) {
    if (!(A instanceof k5Q)) return !0;
    return A.code !== "EHOSTUNREACH"
  }
}
// @from(Ln 309979, Col 0)
function eH0() {
  let [A, Q] = jI1.useState(null);
  return jI1.useEffect(() => {
    let B = !0;
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return;
    let G = async () => {
      if (!B) return;
      let Y = await Gx5();
      if (B) Q(Y)
    };
    G();
    let Z = setInterval(G, Zx5);
    return () => {
      B = !1, clearInterval(Z)
    }
  }, []), {
    isConnected: A
  }
}
// @from(Ln 309998, Col 4)
jI1
// @from(Ln 309998, Col 9)
Zx5 = 30000
// @from(Ln 309999, Col 4)
qL2 = w(() => {
  j5();
  fQ();
  jI1 = c(QA(), 1)
})
// @from(Ln 310004, Col 0)
class nFA {
  activeOperations = new Set;
  lastUserActivityTime = 0;
  lastCLIRecordedTime = Date.now();
  isCLIActive = !1;
  USER_ACTIVITY_TIMEOUT_MS = 5000;
  static instance = null;
  static getInstance() {
    if (!nFA.instance) nFA.instance = new nFA;
    return nFA.instance
  }
  recordUserActivity() {
    if (!this.isCLIActive && this.lastUserActivityTime !== 0) {
      let Q = (Date.now() - this.lastUserActivityTime) / 1000;
      if (Q > 0) {
        let B = Aq1();
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
        let G = Aq1();
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
// @from(Ln 310064, Col 4)
JkA
// @from(Ln 310065, Col 4)
AE0 = w(() => {
  C0();
  JkA = nFA.getInstance()
})
// @from(Ln 310069, Col 4)
NL2
// @from(Ln 310070, Col 4)
wL2 = w(() => {
  NL2 = ["Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking", "Beaming", "Beboppin'", "Befuddling", "Billowing", "Blanching", "Bloviating", "Boogieing", "Boondoggling", "Booping", "Bootstrapping", "Brewing", "Burrowing", "Calculating", "Canoodling", "Caramelizing", "Cascading", "Catapulting", "Cerebrating", "Channeling", "Channelling", "Choreographing", "Churning", "Clauding", "Coalescing", "Cogitating", "Combobulating", "Composing", "Computing", "Concocting", "Considering", "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Crystallizing", "Cultivating", "Deciphering", "Deliberating", "Determining", "Dilly-dallying", "Discombobulating", "Doing", "Doodling", "Drizzling", "Ebbing", "Effecting", "Elucidating", "Embellishing", "Enchanting", "Envisioning", "Evaporating", "Fermenting", "Fiddle-faddling", "Finagling", "Flambéing", "Flibbertigibbeting", "Flowing", "Flummoxing", "Fluttering", "Forging", "Forming", "Frolicking", "Frosting", "Gallivanting", "Galloping", "Garnishing", "Generating", "Germinating", "Gitifying", "Grooving", "Gusting", "Harmonizing", "Hashing", "Hatching", "Herding", "Honking", "Hullaballooing", "Hyperspacing", "Ideating", "Imagining", "Improvising", "Incubating", "Inferring", "Infusing", "Ionizing", "Jitterbugging", "Julienning", "Kneading", "Leavening", "Levitating", "Lollygagging", "Manifesting", "Marinating", "Meandering", "Metamorphosing", "Misting", "Moonwalking", "Moseying", "Mulling", "Mustering", "Musing", "Nebulizing", "Nesting", "Noodling", "Nucleating", "Orbiting", "Orchestrating", "Osmosing", "Perambulating", "Percolating", "Perusing", "Philosophising", "Photosynthesizing", "Pollinating", "Pondering", "Pontificating", "Pouncing", "Precipitating", "Prestidigitating", "Processing", "Proofing", "Propagating", "Puttering", "Puzzling", "Quantumizing", "Razzle-dazzling", "Razzmatazzing", "Recombobulating", "Reticulating", "Roosting", "Ruminating", "Sautéing", "Scampering", "Schlepping", "Scurrying", "Seasoning", "Shenaniganing", "Shimmying", "Simmering", "Skedaddling", "Sketching", "Slithering", "Smooshing", "Sock-hopping", "Spelunking", "Spinning", "Sprouting", "Stewing", "Sublimating", "Swirling", "Swooping", "Symbioting", "Synthesizing", "Tempering", "Thinking", "Thundering", "Tinkering", "Tomfoolering", "Topsy-turvying", "Transfiguring", "Transmuting", "Twisting", "Undulating", "Unfurling", "Unravelling", "Vibing", "Waddling", "Wandering", "Warping", "Whatchamacalliting", "Whirlpooling", "Whirring", "Whisking", "Wibbling", "Working", "Wrangling", "Zesting", "Zigzagging"]
})
// @from(Ln 310074, Col 0)
function Ns({
  todos: A,
  isStandalone: Q = !1
}) {
  if (A.length === 0) return null;
  let B = jX.createElement(jX.Fragment, null, A.map((G, Z) => {
    let Y = G.status === "completed" ? tA.checkboxOn : tA.checkboxOff;
    return jX.createElement(T, {
      key: Z
    }, jX.createElement(C, {
      dimColor: G.status === "completed"
    }, Y, " "), jX.createElement(C, {
      bold: G.status === "in_progress",
      dimColor: G.status === "completed",
      strikethrough: G.status === "completed"
    }, G.content))
  }));
  if (Q) return jX.createElement(T, {
    flexDirection: "column",
    marginTop: 1,
    marginLeft: 2
  }, jX.createElement(T, null, jX.createElement(C, {
    bold: !0,
    dimColor: !0
  }, "Todos"), jX.createElement(C, {
    dimColor: !0
  }, " · ", jX.createElement(F0, {
    shortcut: "ctrl+t",
    action: "hide todos",
    bold: !0
  }))), B);
  return jX.createElement(T, {
    flexDirection: "column"
  }, B)
}
// @from(Ln 310109, Col 4)
jX
// @from(Ln 310110, Col 4)
XkA = w(() => {
  fA();
  B2();
  e9();
  jX = c(QA(), 1)
})
// @from(Ln 310117, Col 0)
function TI1({
  tasks: A,
  isStandalone: Q = !1
}) {
  let [B] = a0();
  return null
}
// @from(Ln 310125, Col 0)
function Yx5(A) {
  switch (A) {
    case "completed":
      return {
        icon: tA.tick, color: "success"
      };
    case "in_progress":
      return {
        icon: tA.squareSmallFilled, color: "claude"
      };
    case "pending":
      return {
        icon: tA.squareSmall, color: void 0
      }
  }
}
// @from(Ln 310142, Col 0)
function Jx5({
  task: A,
  ownerColor: Q,
  openBlockers: B
}) {
  let G = A.status === "completed",
    Z = A.status === "in_progress",
    {
      icon: Y,
      color: J
    } = Yx5(A.status);
  return X7.createElement(T, null, X7.createElement(C, {
    color: J
  }, Y, " "), X7.createElement(C, {
    dimColor: !0
  }, "#", A.id, " "), X7.createElement(C, {
    bold: Z,
    strikethrough: G,
    dimColor: G || B.length > 0
  }, A.subject), A.owner && X7.createElement(C, null, " (", Q ? X7.createElement(C, {
    color: Q
  }, A.owner) : A.owner, ")"), B.length > 0 && X7.createElement(C, {
    dimColor: !0
  }, " ", tA.pointerSmall, " blocked by", " ", [...B].sort((X, I) => parseInt(X, 10) - parseInt(I, 10)).map((X) => `#${X}`).join(", ")))
}
// @from(Ln 310167, Col 4)
X7
// @from(Ln 310168, Col 4)
QE0 = w(() => {
  fA();
  B2();
  hB();
  EO();
  z21();
  e9();
  X7 = c(QA(), 1)
})
// @from(Ln 310182, Col 0)
function SI1() {
  let [A] = a0(), {
    teamContext: Q
  } = A, [, B] = PI1.useState(0);
  if (PI1.useEffect(() => {
      if (!Gm() || Q && !Dx5(Q)) return;
      HY0();
      let G = null,
        Z = null,
        Y = null,
        J = null;

      function X() {
        let V = PIA(),
          F = RBA(V);
        if (IkA = F, F.some((E) => E.status !== "completed") || F.length === 0) {
          if (aFA = null, G) clearTimeout(G), G = null
        } else if (aFA === null) aFA = Date.now(), G = setTimeout(() => {
          let E = RBA(V);
          if (E.length > 0 && E.every(($) => $.status === "completed")) OCB(V), IkA = [], aFA = null;
          B(($) => $ + 1)
        }, LL2);
        if (B((E) => E + 1), Y) clearTimeout(Y);
        Y = setTimeout(I, Kx5)
      }

      function I() {
        if (Z) clearTimeout(Z);
        Z = setTimeout(X, Wx5)
      }
      X();
      let D = wCB(I),
        W = PIA(),
        K = La(W);
      if (Ix5(K)) try {
        J = Xx5(K, I)
      } catch {}
      return () => {
        if (D(), J) J.close();
        if (Y) clearTimeout(Y);
        if (Z) clearTimeout(Z);
        if (G) clearTimeout(G)
      }
    }, [Q]), !IkA || IkA.length === 0) return;
  if (aFA !== null && Date.now() - aFA >= LL2) return;
  return IkA
}
// @from(Ln 310229, Col 4)
PI1
// @from(Ln 310229, Col 9)
Dx5 = () => !1
// @from(Ln 310230, Col 2)
LL2 = 5000
// @from(Ln 310231, Col 2)
Wx5 = 50
// @from(Ln 310232, Col 2)
Kx5 = 5000
// @from(Ln 310233, Col 2)
aFA = null
// @from(Ln 310234, Col 2)
IkA = void 0
// @from(Ln 310235, Col 4)
BE0 = w(() => {
  Oa();
  Dd();
  hB();
  PI1 = c(QA(), 1)
})
// @from(Ln 310242, Col 0)
function DkA() {
  if (process.env.TERM === "xterm-ghostty") return ["·", "✢", "✳", "✶", "✻", "*"];
  return process.platform === "darwin" ? ["·", "✢", "✳", "✶", "✻", "✽"] : ["·", "✢", "*", "✶", "✻", "✽"]
}
// @from(Ln 310247, Col 0)
function z6A(A, Q, B) {
  return {
    r: Math.round(A.r + (Q.r - A.r) * B),
    g: Math.round(A.g + (Q.g - A.g) * B),
    b: Math.round(A.b + (Q.b - A.b) * B)
  }
}
// @from(Ln 310255, Col 0)
function oFA(A) {
  return `rgb(${A.r},${A.g},${A.b})`
}
// @from(Ln 310259, Col 0)
function ZE0({
  char: A,
  flashOpacity: Q
}) {
  let Z = z6A({
    r: 215,
    g: 119,
    b: 87
  }, {
    r: 245,
    g: 149,
    b: 117
  }, Q);
  return GE0.createElement(C, {
    color: oFA(Z)
  }, A)
}
// @from(Ln 310276, Col 4)
GE0
// @from(Ln 310277, Col 4)
YE0 = w(() => {
  fA();
  GE0 = c(QA(), 1)
})
// @from(Ln 310282, Col 0)
function ws({
  char: A,
  index: Q,
  glimmerIndex: B,
  messageColor: G,
  shimmerColor: Z
}) {
  let Y = Q === B,
    J = Math.abs(Q - B) === 1;
  return JE0.createElement(C, {
    color: Y || J ? Z : G
  }, A)
}
// @from(Ln 310295, Col 4)
JE0
// @from(Ln 310296, Col 4)
WkA = w(() => {
  fA();
  JE0 = c(QA(), 1)
})
// @from(Ln 310301, Col 0)
function XE0({
  message: A,
  mode: Q,
  isConnected: B,
  messageColor: G,
  glimmerIndex: Z,
  flashOpacity: Y,
  shimmerColor: J,
  stalledIntensity: X = 0
}) {
  if (!A) return null;
  if (B === !1) return AD.createElement(C, {
    color: G
  }, A, " ");
  if (X > 0) {
    let W = z6A({
        r: 215,
        g: 119,
        b: 87
      }, {
        r: 171,
        g: 43,
        b: 63
      }, X),
      K = oFA(W);
    return AD.createElement(AD.Fragment, null, AD.createElement(C, {
      color: K
    }, A), AD.createElement(C, {
      color: K
    }, " "))
  }
  return AD.createElement(AD.Fragment, null, A.split("").map((I, D) => {
    if (Q === "tool-use") return AD.createElement(ZE0, {
      key: D,
      char: I,
      flashOpacity: Y
    });
    else return AD.createElement(ws, {
      key: D,
      char: I,
      index: D,
      glimmerIndex: Z,
      messageColor: G,
      shimmerColor: J
    })
  }), AD.createElement(C, {
    color: G
  }, " "))
}
// @from(Ln 310350, Col 4)
AD
// @from(Ln 310351, Col 4)
OL2 = w(() => {
  fA();
  YE0();
  WkA();
  AD = c(QA(), 1)
})
// @from(Ln 310358, Col 0)
function KkA({
  frame: A,
  messageColor: Q,
  stalledIntensity: B = 0,
  isConnected: G
}) {
  let Z = RL2[A % RL2.length];
  if (G === !1) return OO.createElement(T, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, OO.createElement(C, {
    color: Q
  }, Z));
  if (B > 0) {
    let X = z6A({
      r: 215,
      g: 119,
      b: 87
    }, {
      r: 171,
      g: 43,
      b: 63
    }, B);
    return OO.createElement(T, {
      flexWrap: "wrap",
      height: 1,
      width: 2
    }, OO.createElement(C, {
      color: oFA(X)
    }, Z))
  }
  return OO.createElement(T, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, OO.createElement(C, {
    color: Q
  }, Z))
}
// @from(Ln 310398, Col 4)
OO
// @from(Ln 310398, Col 8)
ML2
// @from(Ln 310398, Col 13)
RL2
// @from(Ln 310399, Col 4)
IE0 = w(() => {
  fA();
  OO = c(QA(), 1), ML2 = DkA(), RL2 = [...ML2, ...[...ML2].reverse()]
})
// @from(Ln 310404, Col 0)
function $6A(A, Q, B, G, Z) {
  let Y = rFA.useRef(Date.now()),
    [J, X] = rFA.useState(Z ?? (A === "requesting" ? -1 : 10)),
    I = rFA.useMemo(() => {
      if (A === "requesting") return 50;
      return 200
    }, [A]);
  return XZ(() => {
    if (B === !1 || G) return;
    let D = Date.now() - Y.current,
      W = Math.floor(D / I),
      K = Q.length,
      V = K + 20;
    if (A === "requesting") {
      let F = W % V - 10;
      X(F)
    } else {
      let F = K + 10 - W % V;
      X(F)
    }
  }, I), J
}
// @from(Ln 310426, Col 4)
rFA
// @from(Ln 310427, Col 4)
xI1 = w(() => {
  oK();
  rFA = c(QA(), 1)
})
// @from(Ln 310432, Col 0)
function DE0(A) {
  let [Q, B] = _L2.useState(0);
  return XZ(() => {
    if (A === "tool-use") B(() => {
      let G = Date.now() / 1000;
      return (Math.sin(G * Math.PI) + 1) / 2
    });
    else B(0)
  }, 50), Q
}
// @from(Ln 310442, Col 4)
_L2
// @from(Ln 310443, Col 4)
jL2 = w(() => {
  oK();
  _L2 = c(QA(), 1)
})
// @from(Ln 310448, Col 0)
function WE0(A, Q = !1) {
  let [B, G] = Ls.useState(0), [Z, Y] = Ls.useState(0), J = Ls.useRef(A), X = Ls.useRef(Date.now());
  Ls.useEffect(() => {
    if (A > J.current) G(0), Y(0), J.current = A
  }, [A]), XZ(() => {
    if (Q) G(0);
    else if (A > 0) {
      if (A === J.current) G((W) => W + 100)
    } else {
      let W = Date.now() - X.current;
      G(W)
    }
  }, 100);
  let I = B > 3000 && !Q,
    D = I ? Math.min((B - 3000) / 2000, 1) : 0;
  return XZ(() => {
    Y((W) => {
      let K = D,
        V = K - W;
      if (Math.abs(V) < 0.01) return K;
      return W + V * 0.1
    })
  }, 50), {
    isStalled: I,
    stalledIntensity: Z
  }
}
// @from(Ln 310475, Col 4)
Ls
// @from(Ln 310476, Col 4)
TL2 = w(() => {
  oK();
  Ls = c(QA(), 1)
})
// @from(Ln 310480, Col 4)
PL2 = w(() => {
  YE0();
  WkA();
  OL2();
  IE0();
  xI1();
  jL2();
  TL2()
})
// @from(Ln 310490, Col 0)
function vL2({
  mode: A,
  elapsedTimeMs: Q,
  spinnerTip: B,
  currentResponseLength: G,
  overrideColor: Z,
  overrideShimmerColor: Y,
  overrideMessage: J,
  spinnerSuffix: X,
  verbose: I,
  todos: D,
  hasActiveTools: W = !1
}) {
  let [K, V] = MO.useState(0), [F, H] = MO.useState(0), [E] = a0(), {
    isConnected: z
  } = eH0(), {
    columns: $
  } = ZB(), O = SI1(), L = Fx5(E.tasks).filter(($1) => $1.status === "running").length > 0, [M, _] = MO.useState(null), j = MO.useRef(null);
  MO.useEffect(() => {
    let $1 = null,
      i1 = null;
    if (A === "thinking") {
      if (j.current === null) j.current = Date.now(), _("thinking")
    } else if (j.current !== null) {
      let Q0 = Date.now() - j.current,
        c0 = Date.now() - j.current,
        b0 = Math.max(0, 2000 - c0);
      j.current = null;
      let UA = () => {
        _(Q0), i1 = setTimeout(() => _(null), 2000)
      };
      if (b0 > 0) $1 = setTimeout(UA, b0);
      else UA()
    }
    return () => {
      if ($1) clearTimeout($1);
      if (i1) clearTimeout(i1)
    }
  }, [A]);
  let x = Gm() ? O?.find(($1) => $1.status === "in_progress") : D?.find(($1) => $1.status === "in_progress"),
    b = Gm() ? O?.find(($1) => $1.status === "pending") : D?.find(($1) => $1.status === "pending"),
    [S] = MO.useState(() => Wg(NL2)),
    u = (J ?? x?.activeForm ?? S) + "…",
    {
      isStalled: f,
      stalledIntensity: AA
    } = WE0(G, W),
    n = $6A(A, u, z, f),
    y = DE0(A),
    p = MO.useRef(G);
  MO.useEffect(() => {
    let $1 = "spinner-" + A;
    return JkA.startCLIActivity($1), () => {
      JkA.endCLIActivity($1)
    }
  }, [A]), MO.useEffect(() => {
    p.current = G
  }, [G]), XZ(() => {
    if (!z) {
      V(4);
      return
    }
    V(($1) => $1 + 1)
  }, 120), XZ(() => {
    H(($1) => {
      let i1 = p.current - $1;
      if (i1 <= 0) return $1;
      let Q0;
      if (i1 < 70) Q0 = 1;
      else if (i1 < 200) Q0 = Math.max(2, Math.ceil(i1 * 0.08));
      else Q0 = 18;
      return Math.min($1 + Q0, p.current)
    })
  }, 10);
  let GA = A9(u) + 2,
    WA = M === "thinking" ? "thinking" : typeof M === "number" ? `thought for ${Math.max(1,Math.round(M/1000))}s` : null,
    MA = WA ? A9(WA) : 0,
    TA = QI(Q),
    bA = A9(TA),
    jA = J3("app:interrupt", "Global", "esc"),
    OA = "interrupt",
    IA = A9(`${jA} to ${OA}`),
    HA = X8(Math.round(F / 4)),
    ZA = `${tA.arrowDown} ${HA} tokens`,
    zA = A9(ZA),
    wA = O && O.length > 0 ? "tasks" : "todos",
    _A = J3("app:toggleTodos", "Global", "ctrl+t"),
    s = `${E.showExpandedTodos?"hide":"show"} ${wA}`,
    t = A9(`${_A} to ${s}`),
    BA = A9(" · "),
    DA = M !== null,
    CA = I || Q > yL2,
    FA = I || Q > yL2,
    xA = O && O.length > 0 || D && D.length > 0,
    mA = $ - GA - 5,
    G1 = DA && mA > MA,
    J1 = G1 ? MA + BA : 0,
    SA = CA && mA > J1 + bA,
    A1 = J1 + (SA ? bA + BA : 0),
    n1 = mA > A1 + IA,
    S1 = A1 + (n1 ? IA + BA : 0),
    L0 = FA && mA > S1 + zA,
    VQ = S1 + (L0 ? zA + BA : 0),
    t0 = xA && mA > VQ + t,
    QQ = [...n1 ? [I2.createElement(C, {
      dimColor: !0,
      key: "esc"
    }, I2.createElement(F0, {
      shortcut: jA,
      action: OA,
      bold: !0
    }))] : [], ...X ? [I2.createElement(C, {
      dimColor: !0,
      key: "suffix"
    }, X)] : [], ...t0 ? [I2.createElement(C, {
      dimColor: !0,
      key: "todo"
    }, I2.createElement(F0, {
      shortcut: _A,
      action: s,
      bold: !0
    }))] : [], ...SA ? [I2.createElement(C, {
      dimColor: !0,
      key: "elapsedTime"
    }, TA)] : [], ...L0 ? [I2.createElement(T, {
      flexDirection: "row",
      key: "tokens"
    }, I2.createElement(Hx5, {
      mode: A,
      key: "spinnerMode"
    }), I2.createElement(C, {
      dimColor: !0
    }, HA, " tokens"))] : [], ...G1 && WA ? [I2.createElement(C, {
      dimColor: !0,
      key: "thinking"
    }, WA)] : []];
  if (z === !1) QQ.push(I2.createElement(T, {
    key: "offline"
  }, I2.createElement(C, {
    color: "error",
    bold: !0
  }, "offline")));
  let y1 = Z ?? (z === !1 ? "inactive" : "claude"),
    qQ = Y ?? "claudeShimmer",
    K1 = QQ.length > 0 ? I2.createElement(I2.Fragment, null, I2.createElement(C, {
      dimColor: !0
    }, "("), I2.createElement(vQ, null, QQ), I2.createElement(C, {
      dimColor: !0
    }, ")")) : null;
  return I2.createElement(T, {
    flexDirection: "column",
    width: "100%",
    alignItems: "flex-start"
  }, I2.createElement(T, {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
    width: "100%"
  }, I2.createElement(KkA, {
    frame: K,
    messageColor: y1,
    stalledIntensity: AA,
    isConnected: z
  }), I2.createElement(XE0, {
    message: u,
    mode: A,
    isConnected: z,
    messageColor: y1,
    glimmerIndex: n,
    flashOpacity: y,
    shimmerColor: qQ,
    stalledIntensity: AA
  }), K1), L ? I2.createElement(Vx5, {
    frame: K
  }) : E.showExpandedTodos && O && O.length > 0 ? I2.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, I2.createElement(x0, null, I2.createElement(TI1, {
    tasks: O
  }))) : E.showExpandedTodos && D && D.length > 0 ? I2.createElement(T, {
    width: "100%",
    flexDirection: "column"
  }, I2.createElement(x0, null, I2.createElement(Ns, {
    todos: D
  }))) : b || B ? I2.createElement(T, {
    width: "100%"
  }, I2.createElement(x0, null, I2.createElement(C, {
    dimColor: !0
  }, b ? `Next: ${"subject"in b?b.subject:b.content}` : `Tip: ${B}`))) : null)
}
// @from(Ln 310681, Col 0)
function Hx5({
  mode: A
}) {
  switch (A) {
    case "tool-input":
    case "tool-use":
    case "responding":
    case "thinking":
      return I2.createElement(T, {
        width: 2
      }, I2.createElement(C, {
        dimColor: !0
      }, tA.arrowDown));
    case "requesting":
      return I2.createElement(T, {
        width: 2
      }, I2.createElement(C, {
        dimColor: !0
      }, tA.arrowUp))
  }
}
// @from(Ln 310703, Col 0)
function W9() {
  let [A, Q] = MO.useState(0), {
    isConnected: B
  } = eH0();
  return XZ(() => {
    Q((Z) => (Z + 1) % xL2.length)
  }, 120), I2.createElement(T, {
    flexWrap: "wrap",
    height: 1,
    width: 2
  }, I2.createElement(C, {
    color: B === !1 ? "inactive" : "text"
  }, xL2[A]))
}
// @from(Ln 310717, Col 4)
I2
// @from(Ln 310717, Col 8)
MO
// @from(Ln 310717, Col 12)
Vx5 = null
// @from(Ln 310718, Col 2)
Fx5 = () => []
// @from(Ln 310719, Col 2)
SL2
// @from(Ln 310719, Col 7)
xL2
// @from(Ln 310719, Col 12)
yL2 = 30000
// @from(Ln 310720, Col 4)
yG = w(() => {
  fA();
  HUA();
  oK();
  B2();
  qL2();
  AE0();
  wL2();
  c4();
  XkA();
  QE0();
  BE0();
  Oa();
  hB();
  P4();
  e9();
  NX();
  K6();
  PL2();
  UC();
  I2 = c(QA(), 1), MO = c(QA(), 1), SL2 = DkA(), xL2 = [...SL2, ...[...SL2].reverse()]
})
// @from(Ln 310742, Col 4)
VkA = U(($x5) => {
  function Ex5(A, Q, B) {
    if (B === void 0) B = Array.prototype;
    if (A && typeof B.find === "function") return B.find.call(A, Q);
    for (var G = 0; G < A.length; G++)
      if (Object.prototype.hasOwnProperty.call(A, G)) {
        var Z = A[G];
        if (Q.call(void 0, Z, G, A)) return Z
      }
  }

  function KE0(A, Q) {
    if (Q === void 0) Q = Object;
    return Q && typeof Q.freeze === "function" ? Q.freeze(A) : A
  }

  function zx5(A, Q) {
    if (A === null || typeof A !== "object") throw TypeError("target is not an object");
    for (var B in Q)
      if (Object.prototype.hasOwnProperty.call(Q, B)) A[B] = Q[B];
    return A
  }
  var kL2 = KE0({
      HTML: "text/html",
      isHTML: function (A) {
        return A === kL2.HTML
      },
      XML_APPLICATION: "application/xml",
      XML_TEXT: "text/xml",
      XML_XHTML_APPLICATION: "application/xhtml+xml",
      XML_SVG_IMAGE: "image/svg+xml"
    }),
    bL2 = KE0({
      HTML: "http://www.w3.org/1999/xhtml",
      isHTML: function (A) {
        return A === bL2.HTML
      },
      SVG: "http://www.w3.org/2000/svg",
      XML: "http://www.w3.org/XML/1998/namespace",
      XMLNS: "http://www.w3.org/2000/xmlns/"
    });
  $x5.assign = zx5;
  $x5.find = Ex5;
  $x5.freeze = KE0;
  $x5.MIME_TYPE = kL2;
  $x5.NAMESPACE = bL2
})
// @from(Ln 310789, Col 4)
wE0 = U((bx5) => {
  var pL2 = VkA(),
    Vf = pL2.find,
    FkA = pL2.NAMESPACE;

  function Lx5(A) {
    return A !== ""
  }

  function Ox5(A) {
    return A ? A.split(/[\t\n\f\r ]+/).filter(Lx5) : []
  }

  function Mx5(A, Q) {
    if (!A.hasOwnProperty(Q)) A[Q] = !0;
    return A
  }

  function fL2(A) {
    if (!A) return [];
    var Q = Ox5(A);
    return Object.keys(Q.reduce(Mx5, {}))
  }

  function Rx5(A) {
    return function (Q) {
      return A && A.indexOf(Q) !== -1
    }
  }

  function EkA(A, Q) {
    for (var B in A)
      if (Object.prototype.hasOwnProperty.call(A, B)) Q[B] = A[B]
  }

  function lN(A, Q) {
    var B = A.prototype;
    if (!(B instanceof Q)) {
      let Z = function () {};
      var G = Z;
      Z.prototype = Q.prototype, Z = new Z, EkA(B, Z), A.prototype = B = Z
    }
    if (B.constructor != A) {
      if (typeof A != "function") console.error("unknown Class:" + A);
      B.constructor = A
    }
  }
  var iN = {},
    nS = iN.ELEMENT_NODE = 1,
    tFA = iN.ATTRIBUTE_NODE = 2,
    yI1 = iN.TEXT_NODE = 3,
    lL2 = iN.CDATA_SECTION_NODE = 4,
    iL2 = iN.ENTITY_REFERENCE_NODE = 5,
    _x5 = iN.ENTITY_NODE = 6,
    nL2 = iN.PROCESSING_INSTRUCTION_NODE = 7,
    aL2 = iN.COMMENT_NODE = 8,
    oL2 = iN.DOCUMENT_NODE = 9,
    rL2 = iN.DOCUMENT_TYPE_NODE = 10,
    Jc = iN.DOCUMENT_FRAGMENT_NODE = 11,
    jx5 = iN.NOTATION_NODE = 12,
    ez = {},
    yF = {},
    thZ = ez.INDEX_SIZE_ERR = (yF[1] = "Index size error", 1),
    ehZ = ez.DOMSTRING_SIZE_ERR = (yF[2] = "DOMString size error", 2),
    pN = ez.HIERARCHY_REQUEST_ERR = (yF[3] = "Hierarchy request error", 3),
    AgZ = ez.WRONG_DOCUMENT_ERR = (yF[4] = "Wrong document", 4),
    QgZ = ez.INVALID_CHARACTER_ERR = (yF[5] = "Invalid character", 5),
    BgZ = ez.NO_DATA_ALLOWED_ERR = (yF[6] = "No data allowed", 6),
    GgZ = ez.NO_MODIFICATION_ALLOWED_ERR = (yF[7] = "No modification allowed", 7),
    sL2 = ez.NOT_FOUND_ERR = (yF[8] = "Not found", 8),
    ZgZ = ez.NOT_SUPPORTED_ERR = (yF[9] = "Not supported", 9),
    hL2 = ez.INUSE_ATTRIBUTE_ERR = (yF[10] = "Attribute in use", 10),
    YgZ = ez.INVALID_STATE_ERR = (yF[11] = "Invalid state", 11),
    JgZ = ez.SYNTAX_ERR = (yF[12] = "Syntax error", 12),
    XgZ = ez.INVALID_MODIFICATION_ERR = (yF[13] = "Invalid modification", 13),
    IgZ = ez.NAMESPACE_ERR = (yF[14] = "Invalid namespace", 14),
    DgZ = ez.INVALID_ACCESS_ERR = (yF[15] = "Invalid access", 15);

  function sD(A, Q) {
    if (Q instanceof Error) var B = Q;
    else if (B = this, Error.call(this, yF[A]), this.message = yF[A], Error.captureStackTrace) Error.captureStackTrace(this, sD);
    if (B.code = A, Q) this.message = this.message + ": " + Q;
    return B
  }
  sD.prototype = Error.prototype;
  EkA(ez, sD);

  function Yc() {}
  Yc.prototype = {
    length: 0,
    item: function (A) {
      return A >= 0 && A < this.length ? this[A] : null
    },
    toString: function (A, Q) {
      for (var B = [], G = 0; G < this.length; G++) sFA(this[G], B, A, Q);
      return B.join("")
    },
    filter: function (A) {
      return Array.prototype.filter.call(this, A)
    },
    indexOf: function (A) {
      return Array.prototype.indexOf.call(this, A)
    }
  };

  function eFA(A, Q) {
    this._node = A, this._refresh = Q, HE0(this)
  }

  function HE0(A) {
    var Q = A._node._inc || A._node.ownerDocument._inc;
    if (A._inc !== Q) {
      var B = A._refresh(A._node);
      if (DO2(A, "length", B.length), !A.$$length || B.length < A.$$length) {
        for (var G = B.length; G in A; G++)
          if (Object.prototype.hasOwnProperty.call(A, G)) delete A[G]
      }
      EkA(B, A), A._inc = Q
    }
  }
  eFA.prototype.item = function (A) {
    return HE0(this), this[A] || null
  };
  lN(eFA, Yc);

  function vI1() {}

  function tL2(A, Q) {
    var B = A.length;
    while (B--)
      if (A[B] === Q) return B
  }

  function gL2(A, Q, B, G) {
    if (G) Q[tL2(Q, G)] = B;
    else Q[Q.length++] = B;
    if (A) {
      B.ownerElement = A;
      var Z = A.ownerDocument;
      if (Z) G && QO2(Z, A, G), Tx5(Z, A, B)
    }
  }

  function uL2(A, Q, B) {
    var G = tL2(Q, B);
    if (G >= 0) {
      var Z = Q.length - 1;
      while (G < Z) Q[G] = Q[++G];
      if (Q.length = Z, A) {
        var Y = A.ownerDocument;
        if (Y) QO2(Y, A, B), B.ownerElement = null
      }
    } else throw new sD(sL2, Error(A.tagName + "@" + B))
  }
  vI1.prototype = {
    length: 0,
    item: Yc.prototype.item,
    getNamedItem: function (A) {
      var Q = this.length;
      while (Q--) {
        var B = this[Q];
        if (B.nodeName == A) return B
      }
    },
    setNamedItem: function (A) {
      var Q = A.ownerElement;
      if (Q && Q != this._ownerElement) throw new sD(hL2);
      var B = this.getNamedItem(A.nodeName);
      return gL2(this._ownerElement, this, A, B), B
    },
    setNamedItemNS: function (A) {
      var Q = A.ownerElement,
        B;
      if (Q && Q != this._ownerElement) throw new sD(hL2);
      return B = this.getNamedItemNS(A.namespaceURI, A.localName), gL2(this._ownerElement, this, A, B), B
    },
    removeNamedItem: function (A) {
      var Q = this.getNamedItem(A);
      return uL2(this._ownerElement, this, Q), Q
    },
    removeNamedItemNS: function (A, Q) {
      var B = this.getNamedItemNS(A, Q);
      return uL2(this._ownerElement, this, B), B
    },
    getNamedItemNS: function (A, Q) {
      var B = this.length;
      while (B--) {
        var G = this[B];
        if (G.localName == Q && G.namespaceURI == A) return G
      }
      return null
    }
  };

  function eL2() {}
  eL2.prototype = {
    hasFeature: function (A, Q) {
      return !0
    },
    createDocument: function (A, Q, B) {
      var G = new zkA;
      if (G.implementation = this, G.childNodes = new Yc, G.doctype = B || null, B) G.appendChild(B);
      if (Q) {
        var Z = G.createElementNS(A, Q);
        G.appendChild(Z)
      }
      return G
    },
    createDocumentType: function (A, Q, B) {
      var G = new fI1;
      return G.name = A, G.nodeName = A, G.publicId = Q || "", G.systemId = B || "", G
    }
  };

  function FZ() {}
  FZ.prototype = {
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
    insertBefore: function (A, Q) {
      return kI1(this, A, Q)
    },
    replaceChild: function (A, Q) {
      if (kI1(this, A, Q, GO2), Q) this.removeChild(Q)
    },
    removeChild: function (A) {
      return BO2(this, A)
    },
    appendChild: function (A) {
      return this.insertBefore(A, null)
    },
    hasChildNodes: function () {
      return this.firstChild != null
    },
    cloneNode: function (A) {
      return FE0(this.ownerDocument || this, this, A)
    },
    normalize: function () {
      var A = this.firstChild;
      while (A) {
        var Q = A.nextSibling;
        if (Q && Q.nodeType == yI1 && A.nodeType == yI1) this.removeChild(Q), A.appendData(Q.data);
        else A.normalize(), A = Q
      }
    },
    isSupported: function (A, Q) {
      return this.ownerDocument.implementation.hasFeature(A, Q)
    },
    hasAttributes: function () {
      return this.attributes.length > 0
    },
    lookupPrefix: function (A) {
      var Q = this;
      while (Q) {
        var B = Q._nsMap;
        if (B) {
          for (var G in B)
            if (Object.prototype.hasOwnProperty.call(B, G) && B[G] === A) return G
        }
        Q = Q.nodeType == tFA ? Q.ownerDocument : Q.parentNode
      }
      return null
    },
    lookupNamespaceURI: function (A) {
      var Q = this;
      while (Q) {
        var B = Q._nsMap;
        if (B) {
          if (Object.prototype.hasOwnProperty.call(B, A)) return B[A]
        }
        Q = Q.nodeType == tFA ? Q.ownerDocument : Q.parentNode
      }
      return null
    },
    isDefaultNamespace: function (A) {
      var Q = this.lookupPrefix(A);
      return Q == null
    }
  };

  function AO2(A) {
    return A == "<" && "&lt;" || A == ">" && "&gt;" || A == "&" && "&amp;" || A == '"' && "&quot;" || "&#" + A.charCodeAt() + ";"
  }
  EkA(iN, FZ);
  EkA(iN, FZ.prototype);

  function HkA(A, Q) {
    if (Q(A)) return !0;
    if (A = A.firstChild)
      do
        if (HkA(A, Q)) return !0; while (A = A.nextSibling)
  }

  function zkA() {
    this.ownerDocument = this
  }

  function Tx5(A, Q, B) {
    A && A._inc++;
    var G = B.namespaceURI;
    if (G === FkA.XMLNS) Q._nsMap[B.prefix ? B.localName : ""] = B.value
  }

  function QO2(A, Q, B, G) {
    A && A._inc++;
    var Z = B.namespaceURI;
    if (Z === FkA.XMLNS) delete Q._nsMap[B.prefix ? B.localName : ""]
  }

  function EE0(A, Q, B) {
    if (A && A._inc) {
      A._inc++;
      var G = Q.childNodes;
      if (B) G[G.length++] = B;
      else {
        var Z = Q.firstChild,
          Y = 0;
        while (Z) G[Y++] = Z, Z = Z.nextSibling;
        G.length = Y, delete G[G.length]
      }
    }
  }

  function BO2(A, Q) {
    var {
      previousSibling: B,
      nextSibling: G
    } = Q;
    if (B) B.nextSibling = G;
    else A.firstChild = G;
    if (G) G.previousSibling = B;
    else A.lastChild = B;
    return Q.parentNode = null, Q.previousSibling = null, Q.nextSibling = null, EE0(A.ownerDocument, A), Q
  }

  function Px5(A) {
    return A && (A.nodeType === FZ.DOCUMENT_NODE || A.nodeType === FZ.DOCUMENT_FRAGMENT_NODE || A.nodeType === FZ.ELEMENT_NODE)
  }

  function Sx5(A) {
    return A && (Ff(A) || zE0(A) || Xc(A) || A.nodeType === FZ.DOCUMENT_FRAGMENT_NODE || A.nodeType === FZ.COMMENT_NODE || A.nodeType === FZ.PROCESSING_INSTRUCTION_NODE)
  }

  function Xc(A) {
    return A && A.nodeType === FZ.DOCUMENT_TYPE_NODE
  }

  function Ff(A) {
    return A && A.nodeType === FZ.ELEMENT_NODE
  }

  function zE0(A) {
    return A && A.nodeType === FZ.TEXT_NODE
  }

  function mL2(A, Q) {
    var B = A.childNodes || [];
    if (Vf(B, Ff) || Xc(Q)) return !1;
    var G = Vf(B, Xc);
    return !(Q && G && B.indexOf(G) > B.indexOf(Q))
  }

  function dL2(A, Q) {
    var B = A.childNodes || [];

    function G(Y) {
      return Ff(Y) && Y !== Q
    }
    if (Vf(B, G)) return !1;
    var Z = Vf(B, Xc);
    return !(Q && Z && B.indexOf(Z) > B.indexOf(Q))
  }

  function xx5(A, Q, B) {
    if (!Px5(A)) throw new sD(pN, "Unexpected parent node type " + A.nodeType);
    if (B && B.parentNode !== A) throw new sD(sL2, "child not in parent");
    if (!Sx5(Q) || Xc(Q) && A.nodeType !== FZ.DOCUMENT_NODE) throw new sD(pN, "Unexpected node type " + Q.nodeType + " for parent node type " + A.nodeType)
  }

  function yx5(A, Q, B) {
    var G = A.childNodes || [],
      Z = Q.childNodes || [];
    if (Q.nodeType === FZ.DOCUMENT_FRAGMENT_NODE) {
      var Y = Z.filter(Ff);
      if (Y.length > 1 || Vf(Z, zE0)) throw new sD(pN, "More than one element or text in fragment");
      if (Y.length === 1 && !mL2(A, B)) throw new sD(pN, "Element in fragment can not be inserted before doctype")
    }
    if (Ff(Q)) {
      if (!mL2(A, B)) throw new sD(pN, "Only one element can be added and only after doctype")
    }
    if (Xc(Q)) {
      if (Vf(G, Xc)) throw new sD(pN, "Only one doctype is allowed");
      var J = Vf(G, Ff);
      if (B && G.indexOf(J) < G.indexOf(B)) throw new sD(pN, "Doctype can only be inserted before an element");
      if (!B && J) throw new sD(pN, "Doctype can not be appended since element is present")
    }
  }

  function GO2(A, Q, B) {
    var G = A.childNodes || [],
      Z = Q.childNodes || [];
    if (Q.nodeType === FZ.DOCUMENT_FRAGMENT_NODE) {
      var Y = Z.filter(Ff);
      if (Y.length > 1 || Vf(Z, zE0)) throw new sD(pN, "More than one element or text in fragment");
      if (Y.length === 1 && !dL2(A, B)) throw new sD(pN, "Element in fragment can not be inserted before doctype")
    }
    if (Ff(Q)) {
      if (!dL2(A, B)) throw new sD(pN, "Only one element can be added and only after doctype")
    }
    if (Xc(Q)) {
      let I = function (D) {
        return Xc(D) && D !== B
      };
      var X = I;
      if (Vf(G, I)) throw new sD(pN, "Only one doctype is allowed");
      var J = Vf(G, Ff);
      if (B && G.indexOf(J) < G.indexOf(B)) throw new sD(pN, "Doctype can only be inserted before an element")
    }
  }

  function kI1(A, Q, B, G) {
    if (xx5(A, Q, B), A.nodeType === FZ.DOCUMENT_NODE)(G || yx5)(A, Q, B);
    var Z = Q.parentNode;
    if (Z) Z.removeChild(Q);
    if (Q.nodeType === Jc) {
      var Y = Q.firstChild;
      if (Y == null) return Q;
      var J = Q.lastChild
    } else Y = J = Q;
    var X = B ? B.previousSibling : A.lastChild;
    if (Y.previousSibling = X, J.nextSibling = B, X) X.nextSibling = Y;
    else A.firstChild = Y;
    if (B == null) A.lastChild = J;
    else B.previousSibling = J;
    do Y.parentNode = A; while (Y !== J && (Y = Y.nextSibling));
    if (EE0(A.ownerDocument || A, A), Q.nodeType == Jc) Q.firstChild = Q.lastChild = null;
    return Q
  }

  function vx5(A, Q) {
    if (Q.parentNode) Q.parentNode.removeChild(Q);
    if (Q.parentNode = A, Q.previousSibling = A.lastChild, Q.nextSibling = null, Q.previousSibling) Q.previousSibling.nextSibling = Q;
    else A.firstChild = Q;
    return A.lastChild = Q, EE0(A.ownerDocument, A, Q), Q
  }
  zkA.prototype = {
    nodeName: "#document",
    nodeType: oL2,
    doctype: null,
    documentElement: null,
    _inc: 1,
    insertBefore: function (A, Q) {
      if (A.nodeType == Jc) {
        var B = A.firstChild;
        while (B) {
          var G = B.nextSibling;
          this.insertBefore(B, Q), B = G
        }
        return A
      }
      if (kI1(this, A, Q), A.ownerDocument = this, this.documentElement === null && A.nodeType === nS) this.documentElement = A;
      return A
    },
    removeChild: function (A) {
      if (this.documentElement == A) this.documentElement = null;
      return BO2(this, A)
    },
    replaceChild: function (A, Q) {
      if (kI1(this, A, Q, GO2), A.ownerDocument = this, Q) this.removeChild(Q);
      if (Ff(A)) this.documentElement = A
    },
    importNode: function (A, Q) {
      return IO2(this, A, Q)
    },
    getElementById: function (A) {
      var Q = null;
      return HkA(this.documentElement, function (B) {
        if (B.nodeType == nS) {
          if (B.getAttribute("id") == A) return Q = B, !0
        }
      }), Q
    },
    getElementsByClassName: function (A) {
      var Q = fL2(A);
      return new eFA(this, function (B) {
        var G = [];
        if (Q.length > 0) HkA(B.documentElement, function (Z) {
          if (Z !== B && Z.nodeType === nS) {
            var Y = Z.getAttribute("class");
            if (Y) {
              var J = A === Y;
              if (!J) {
                var X = fL2(Y);
                J = Q.every(Rx5(X))
              }
              if (J) G.push(Z)
            }
          }
        });
        return G
      })
    },
    createElement: function (A) {
      var Q = new C6A;
      Q.ownerDocument = this, Q.nodeName = A, Q.tagName = A, Q.localName = A, Q.childNodes = new Yc;
      var B = Q.attributes = new vI1;
      return B._ownerElement = Q, Q
    },
    createDocumentFragment: function () {
      var A = new hI1;
      return A.ownerDocument = this, A.childNodes = new Yc, A
    },
    createTextNode: function (A) {
      var Q = new $E0;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createComment: function (A) {
      var Q = new CE0;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createCDATASection: function (A) {
      var Q = new UE0;
      return Q.ownerDocument = this, Q.appendData(A), Q
    },
    createProcessingInstruction: function (A, Q) {
      var B = new NE0;
      return B.ownerDocument = this, B.tagName = B.nodeName = B.target = A, B.nodeValue = B.data = Q, B
    },
    createAttribute: function (A) {
      var Q = new bI1;
      return Q.ownerDocument = this, Q.name = A, Q.nodeName = A, Q.localName = A, Q.specified = !0, Q
    },
    createEntityReference: function (A) {
      var Q = new qE0;
      return Q.ownerDocument = this, Q.nodeName = A, Q
    },
    createElementNS: function (A, Q) {
      var B = new C6A,
        G = Q.split(":"),
        Z = B.attributes = new vI1;
      if (B.childNodes = new Yc, B.ownerDocument = this, B.nodeName = Q, B.tagName = Q, B.namespaceURI = A, G.length == 2) B.prefix = G[0], B.localName = G[1];
      else B.localName = Q;
      return Z._ownerElement = B, B
    },
    createAttributeNS: function (A, Q) {
      var B = new bI1,
        G = Q.split(":");
      if (B.ownerDocument = this, B.nodeName = Q, B.name = Q, B.namespaceURI = A, B.specified = !0, G.length == 2) B.prefix = G[0], B.localName = G[1];
      else B.localName = Q;
      return B
    }
  };
  lN(zkA, FZ);

  function C6A() {
    this._nsMap = {}
  }
  C6A.prototype = {
    nodeType: nS,
    hasAttribute: function (A) {
      return this.getAttributeNode(A) != null
    },
    getAttribute: function (A) {
      var Q = this.getAttributeNode(A);
      return Q && Q.value || ""
    },
    getAttributeNode: function (A) {
      return this.attributes.getNamedItem(A)
    },
    setAttribute: function (A, Q) {
      var B = this.ownerDocument.createAttribute(A);
      B.value = B.nodeValue = "" + Q, this.setAttributeNode(B)
    },
    removeAttribute: function (A) {
      var Q = this.getAttributeNode(A);
      Q && this.removeAttributeNode(Q)
    },
    appendChild: function (A) {
      if (A.nodeType === Jc) return this.insertBefore(A, null);
      else return vx5(this, A)
    },
    setAttributeNode: function (A) {
      return this.attributes.setNamedItem(A)
    },
    setAttributeNodeNS: function (A) {
      return this.attributes.setNamedItemNS(A)
    },
    removeAttributeNode: function (A) {
      return this.attributes.removeNamedItem(A.nodeName)
    },
    removeAttributeNS: function (A, Q) {
      var B = this.getAttributeNodeNS(A, Q);
      B && this.removeAttributeNode(B)
    },
    hasAttributeNS: function (A, Q) {
      return this.getAttributeNodeNS(A, Q) != null
    },
    getAttributeNS: function (A, Q) {
      var B = this.getAttributeNodeNS(A, Q);
      return B && B.value || ""
    },
    setAttributeNS: function (A, Q, B) {
      var G = this.ownerDocument.createAttributeNS(A, Q);
      G.value = G.nodeValue = "" + B, this.setAttributeNode(G)
    },
    getAttributeNodeNS: function (A, Q) {
      return this.attributes.getNamedItemNS(A, Q)
    },
    getElementsByTagName: function (A) {
      return new eFA(this, function (Q) {
        var B = [];
        return HkA(Q, function (G) {
          if (G !== Q && G.nodeType == nS && (A === "*" || G.tagName == A)) B.push(G)
        }), B
      })
    },
    getElementsByTagNameNS: function (A, Q) {
      return new eFA(this, function (B) {
        var G = [];
        return HkA(B, function (Z) {
          if (Z !== B && Z.nodeType === nS && (A === "*" || Z.namespaceURI === A) && (Q === "*" || Z.localName == Q)) G.push(Z)
        }), G
      })
    }
  };
  zkA.prototype.getElementsByTagName = C6A.prototype.getElementsByTagName;
  zkA.prototype.getElementsByTagNameNS = C6A.prototype.getElementsByTagNameNS;
  lN(C6A, FZ);

  function bI1() {}
  bI1.prototype.nodeType = tFA;
  lN(bI1, FZ);

  function $kA() {}
  $kA.prototype = {
    data: "",
    substringData: function (A, Q) {
      return this.data.substring(A, A + Q)
    },
    appendData: function (A) {
      A = this.data + A, this.nodeValue = this.data = A, this.length = A.length
    },
    insertData: function (A, Q) {
      this.replaceData(A, 0, Q)
    },
    appendChild: function (A) {
      throw Error(yF[pN])
    },
    deleteData: function (A, Q) {
      this.replaceData(A, Q, "")
    },
    replaceData: function (A, Q, B) {
      var G = this.data.substring(0, A),
        Z = this.data.substring(A + Q);
      B = G + B + Z, this.nodeValue = this.data = B, this.length = B.length
    }
  };
  lN($kA, FZ);

  function $E0() {}
  $E0.prototype = {
    nodeName: "#text",
    nodeType: yI1,
    splitText: function (A) {
      var Q = this.data,
        B = Q.substring(A);
      Q = Q.substring(0, A), this.data = this.nodeValue = Q, this.length = Q.length;
      var G = this.ownerDocument.createTextNode(B);
      if (this.parentNode) this.parentNode.insertBefore(G, this.nextSibling);
      return G
    }
  };
  lN($E0, $kA);

  function CE0() {}
  CE0.prototype = {
    nodeName: "#comment",
    nodeType: aL2
  };
  lN(CE0, $kA);

  function UE0() {}
  UE0.prototype = {
    nodeName: "#cdata-section",
    nodeType: lL2
  };
  lN(UE0, $kA);

  function fI1() {}
  fI1.prototype.nodeType = rL2;
  lN(fI1, FZ);

  function ZO2() {}
  ZO2.prototype.nodeType = jx5;
  lN(ZO2, FZ);

  function YO2() {}
  YO2.prototype.nodeType = _x5;
  lN(YO2, FZ);

  function qE0() {}
  qE0.prototype.nodeType = iL2;
  lN(qE0, FZ);

  function hI1() {}
  hI1.prototype.nodeName = "#document-fragment";
  hI1.prototype.nodeType = Jc;
  lN(hI1, FZ);

  function NE0() {}
  NE0.prototype.nodeType = nL2;
  lN(NE0, FZ);

  function JO2() {}
  JO2.prototype.serializeToString = function (A, Q, B) {
    return XO2.call(A, Q, B)
  };
  FZ.prototype.toString = XO2;

  function XO2(A, Q) {
    var B = [],
      G = this.nodeType == 9 && this.documentElement || this,
      Z = G.prefix,
      Y = G.namespaceURI;
    if (Y && Z == null) {
      var Z = G.lookupPrefix(Y);
      if (Z == null) var J = [{
        namespace: Y,
        prefix: null
      }]
    }
    return sFA(this, B, A, Q, J), B.join("")
  }

  function cL2(A, Q, B) {
    var G = A.prefix || "",
      Z = A.namespaceURI;
    if (!Z) return !1;
    if (G === "xml" && Z === FkA.XML || Z === FkA.XMLNS) return !1;
    var Y = B.length;
    while (Y--) {
      var J = B[Y];
      if (J.prefix === G) return J.namespace !== Z
    }
    return !0
  }

  function VE0(A, Q, B) {
    A.push(" ", Q, '="', B.replace(/[<>&"\t\n\r]/g, AO2), '"')
  }

  function sFA(A, Q, B, G, Z) {
    if (!Z) Z = [];
    if (G)
      if (A = G(A), A) {
        if (typeof A == "string") {
          Q.push(A);
          return
        }
      } else return;
    switch (A.nodeType) {
      case nS:
        var Y = A.attributes,
          J = Y.length,
          $ = A.firstChild,
          X = A.tagName;
        B = FkA.isHTML(A.namespaceURI) || B;
        var I = X;
        if (!B && !A.prefix && A.namespaceURI) {
          var D;
          for (var W = 0; W < Y.length; W++)
            if (Y.item(W).name === "xmlns") {
              D = Y.item(W).value;
              break
            } if (!D)
            for (var K = Z.length - 1; K >= 0; K--) {
              var V = Z[K];
              if (V.prefix === "" && V.namespace === A.namespaceURI) {
                D = V.namespace;
                break
              }
            }
          if (D !== A.namespaceURI)
            for (var K = Z.length - 1; K >= 0; K--) {
              var V = Z[K];
              if (V.namespace === A.namespaceURI) {
                if (V.prefix) I = V.prefix + ":" + X;
                break
              }
            }
        }
        Q.push("<", I);
        for (var F = 0; F < J; F++) {
          var H = Y.item(F);
          if (H.prefix == "xmlns") Z.push({
            prefix: H.localName,
            namespace: H.value
          });
          else if (H.nodeName == "xmlns") Z.push({
            prefix: "",
            namespace: H.value
          })
        }
        for (var F = 0; F < J; F++) {
          var H = Y.item(F);
          if (cL2(H, B, Z)) {
            var E = H.prefix || "",
              z = H.namespaceURI;
            VE0(Q, E ? "xmlns:" + E : "xmlns", z), Z.push({
              prefix: E,
              namespace: z
            })
          }
          sFA(H, Q, B, G, Z)
        }
        if (X === I && cL2(A, B, Z)) {
          var E = A.prefix || "",
            z = A.namespaceURI;
          VE0(Q, E ? "xmlns:" + E : "xmlns", z), Z.push({
            prefix: E,
            namespace: z
          })
        }
        if ($ || B && !/^(?:meta|link|img|br|hr|input)$/i.test(X)) {
          if (Q.push(">"), B && /^script$/i.test(X))
            while ($) {
              if ($.data) Q.push($.data);
              else sFA($, Q, B, G, Z.slice());
              $ = $.nextSibling
            } else
              while ($) sFA($, Q, B, G, Z.slice()), $ = $.nextSibling;
          Q.push("</", I, ">")
        } else Q.push("/>");
        return;
      case oL2:
      case Jc:
        var $ = A.firstChild;
        while ($) sFA($, Q, B, G, Z.slice()), $ = $.nextSibling;
        return;
      case tFA:
        return VE0(Q, A.name, A.value);
      case yI1:
        return Q.push(A.data.replace(/[<&>]/g, AO2));
      case lL2:
        return Q.push("<![CDATA[", A.data, "]]>");
      case aL2:
        return Q.push("<!--", A.data, "-->");
      case rL2:
        var {
          publicId: O, systemId: L
        } = A;
        if (Q.push("<!DOCTYPE ", A.name), O) {
          if (Q.push(" PUBLIC ", O), L && L != ".") Q.push(" ", L);
          Q.push(">")
        } else if (L && L != ".") Q.push(" SYSTEM ", L, ">");
        else {
          var M = A.internalSubset;
          if (M) Q.push(" [", M, "]");
          Q.push(">")
        }
        return;
      case nL2:
        return Q.push("<?", A.target, " ", A.data, "?>");
      case iL2:
        return Q.push("&", A.nodeName, ";");
      default:
        Q.push("??", A.nodeName)
    }
  }

  function IO2(A, Q, B) {
    var G;
    switch (Q.nodeType) {
      case nS:
        G = Q.cloneNode(!1), G.ownerDocument = A;
      case Jc:
        break;
      case tFA:
        B = !0;
        break
    }
    if (!G) G = Q.cloneNode(!1);
    if (G.ownerDocument = A, G.parentNode = null, B) {
      var Z = Q.firstChild;
      while (Z) G.appendChild(IO2(A, Z, B)), Z = Z.nextSibling
    }
    return G
  }

  function FE0(A, Q, B) {
    var G = new Q.constructor;
    for (var Z in Q)
      if (Object.prototype.hasOwnProperty.call(Q, Z)) {
        var Y = Q[Z];
        if (typeof Y != "object") {
          if (Y != G[Z]) G[Z] = Y
        }
      } if (Q.childNodes) G.childNodes = new Yc;
    switch (G.ownerDocument = A, G.nodeType) {
      case nS:
        var J = Q.attributes,
          X = G.attributes = new vI1,
          I = J.length;
        X._ownerElement = G;
        for (var D = 0; D < I; D++) G.setAttributeNode(FE0(A, J.item(D), !0));
        break;
      case tFA:
        B = !0
    }
    if (B) {
      var W = Q.firstChild;
      while (W) G.appendChild(FE0(A, W, B)), W = W.nextSibling
    }
    return G
  }

  function DO2(A, Q, B) {
    A[Q] = B
  }
  try {
    if (Object.defineProperty) {
      let A = function (Q) {
        switch (Q.nodeType) {
          case nS:
          case Jc:
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
      kx5 = A, Object.defineProperty(eFA.prototype, "length", {
        get: function () {
          return HE0(this), this.$$length
        }
      }), Object.defineProperty(FZ.prototype, "textContent", {
        get: function () {
          return A(this)
        },
        set: function (Q) {
          switch (this.nodeType) {
            case nS:
            case Jc:
              while (this.firstChild) this.removeChild(this.firstChild);
              if (Q || String(Q)) this.appendChild(this.ownerDocument.createTextNode(Q));
              break;
            default:
              this.data = Q, this.value = Q, this.nodeValue = Q
          }
        }
      }), DO2 = function (Q, B, G) {
        Q["$$" + B] = G
      }
    }
  } catch (A) {}
  var kx5;
  bx5.DocumentType = fI1;
  bx5.DOMException = sD;
  bx5.DOMImplementation = eL2;
  bx5.Element = C6A;
  bx5.Node = FZ;
  bx5.NodeList = Yc;
  bx5.XMLSerializer = JO2
})