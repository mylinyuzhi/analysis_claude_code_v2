
// @from(Ln 324052, Col 4)
K87 = p((q87) => {
    Object.defineProperty(q87, "__esModule", {
        value: !0
    });
    q87.OTLPLogExporter = void 0;
    var piz = u3K();
    Object.defineProperty(q87, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return piz.OTLPLogExporter
        }
    })
})
// @from(Ln 324065, Col 4)
g3K = p((p3K) => {
    Object.defineProperty(p3K, "__esModule", {
        value: !0
    });
    p3K.OTLPLogExporter = void 0;
    var giz = Al(),
        Uiz = $l(),
        m3K = Xt();
    class B3K extends giz.OTLPExporterBase {
        constructor(q = {}) {
            super((0, m3K.createOtlpHttpExportDelegate)((0, m3K.convertLegacyHttpOptions)(q, "LOGS", "v1/logs", {
                "Content-Type": "application/x-protobuf"
            }), Uiz.ProtobufLogsSerializer))
        }
    }
    p3K.OTLPLogExporter = B3K
})
// @from(Ln 324082, Col 4)
U3K = p((_87) => {
    Object.defineProperty(_87, "__esModule", {
        value: !0
    });
    _87.OTLPLogExporter = void 0;
    var Qiz = g3K();
    Object.defineProperty(_87, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return Qiz.OTLPLogExporter
        }
    })
})
// @from(Ln 324095, Col 4)
Q3K = p((z87) => {
    Object.defineProperty(z87, "__esModule", {
        value: !0
    });
    z87.OTLPLogExporter = void 0;
    var ciz = U3K();
    Object.defineProperty(z87, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return ciz.OTLPLogExporter
        }
    })
})
// @from(Ln 324108, Col 4)
d3K = p((Y87) => {
    Object.defineProperty(Y87, "__esModule", {
        value: !0
    });
    Y87.OTLPLogExporter = void 0;
    var niz = Q3K();
    Object.defineProperty(Y87, "OTLPLogExporter", {
        enumerable: !0,
        get: function() {
            return niz.OTLPLogExporter
        }
    })
})
// @from(Ln 324121, Col 4)
r3K = p((n3K) => {
    Object.defineProperty(n3K, "__esModule", {
        value: !0
    });
    n3K.OTLPTraceExporter = void 0;
    var c3K = _p8(),
        riz = $l(),
        oiz = Al();
    class l3K extends oiz.OTLPExporterBase {
        constructor(q = {}) {
            super((0, c3K.createOtlpGrpcExportDelegate)((0, c3K.convertLegacyOtlpGrpcOptions)(q, "TRACES"), riz.ProtobufTraceSerializer, "TraceExportService", "/opentelemetry.proto.collector.trace.v1.TraceService/Export"))
        }
    }
    n3K.OTLPTraceExporter = l3K
})
// @from(Ln 324136, Col 4)
o3K = p((A87) => {
    Object.defineProperty(A87, "__esModule", {
        value: !0
    });
    A87.OTLPTraceExporter = void 0;
    var aiz = r3K();
    Object.defineProperty(A87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return aiz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324149, Col 4)
q9K = p((t3K) => {
    Object.defineProperty(t3K, "__esModule", {
        value: !0
    });
    t3K.OTLPTraceExporter = void 0;
    var tiz = Al(),
        eiz = $l(),
        a3K = Xt();
    class s3K extends tiz.OTLPExporterBase {
        constructor(q = {}) {
            super((0, a3K.createOtlpHttpExportDelegate)((0, a3K.convertLegacyHttpOptions)(q, "TRACES", "v1/traces", {
                "Content-Type": "application/json"
            }), eiz.JsonTraceSerializer))
        }
    }
    t3K.OTLPTraceExporter = s3K
})
// @from(Ln 324166, Col 4)
K9K = p((O87) => {
    Object.defineProperty(O87, "__esModule", {
        value: !0
    });
    O87.OTLPTraceExporter = void 0;
    var qrz = q9K();
    Object.defineProperty(O87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return qrz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324179, Col 4)
_9K = p((w87) => {
    Object.defineProperty(w87, "__esModule", {
        value: !0
    });
    w87.OTLPTraceExporter = void 0;
    var _rz = K9K();
    Object.defineProperty(w87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return _rz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324192, Col 4)
j87 = p(($87) => {
    Object.defineProperty($87, "__esModule", {
        value: !0
    });
    $87.OTLPTraceExporter = void 0;
    var Yrz = _9K();
    Object.defineProperty($87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return Yrz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324205, Col 4)
w9K = p((A9K) => {
    Object.defineProperty(A9K, "__esModule", {
        value: !0
    });
    A9K.OTLPTraceExporter = void 0;
    var Orz = Al(),
        wrz = $l(),
        z9K = Xt();
    class Y9K extends Orz.OTLPExporterBase {
        constructor(q = {}) {
            super((0, z9K.createOtlpHttpExportDelegate)((0, z9K.convertLegacyHttpOptions)(q, "TRACES", "v1/traces", {
                "Content-Type": "application/x-protobuf"
            }), wrz.ProtobufTraceSerializer))
        }
    }
    A9K.OTLPTraceExporter = Y9K
})
// @from(Ln 324222, Col 4)
$9K = p((H87) => {
    Object.defineProperty(H87, "__esModule", {
        value: !0
    });
    H87.OTLPTraceExporter = void 0;
    var $rz = w9K();
    Object.defineProperty(H87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return $rz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324235, Col 4)
j9K = p((J87) => {
    Object.defineProperty(J87, "__esModule", {
        value: !0
    });
    J87.OTLPTraceExporter = void 0;
    var Hrz = $9K();
    Object.defineProperty(J87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return Hrz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324248, Col 4)
H9K = p((X87) => {
    Object.defineProperty(X87, "__esModule", {
        value: !0
    });
    X87.OTLPTraceExporter = void 0;
    var Xrz = j9K();
    Object.defineProperty(X87, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return Xrz.OTLPTraceExporter
        }
    })
})
// @from(Ln 324261, Col 4)
D87 = {}
// @from(Ln 324273, Col 0)
function P87(q, K) {
    return new Promise((_, z) => {
        setTimeout((Y, A) => Y(new W87(A)), q, z, K).unref()
    })
}
// @from(Ln 324279, Col 0)
function P9K() {
    if (!process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE) process.env.OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE = "delta"
}
// @from(Ln 324283, Col 0)
function Op8(q) {
    return (q || "").trim().split(",").filter(Boolean).map((K) => K.trim()).filter((K) => K !== "none")
}
// @from(Ln 324286, Col 0)
async function Wrz() {
    let q = Op8(process.env.OTEL_METRICS_EXPORTER),
        K = ui(process.env.OTEL_METRIC_EXPORT_INTERVAL, Prz),
        _ = [];
    for (let z of q)
        if (z === "console") {
            let Y = new g36.ConsoleMetricExporter,
                A = Y.export.bind(Y);
            Y.export = (O, w) => {
                if (O.resource && O.resource.attributes) E(`
=== Resource Attributes ===`), E(I6(O.resource.attributes)), E(`===========================
`);
                return A(O, w)
            }, _.push(Y)
        } else if (z === "otlp") {
        let Y = process.env.OTEL_EXPORTER_OTLP_METRICS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            A = wp8();
        switch (Y) {
            case "grpc": {
                let {
                    OTLPMetricExporter: O
                } = await Promise.resolve().then(() => K6(A3K(), 1));
                _.push(new O);
                break
            }
            case "http/json": {
                let {
                    OTLPMetricExporter: O
                } = await Promise.resolve().then(() => K6(Sm8(), 1));
                _.push(new O(A));
                break
            }
            case "http/protobuf": {
                let {
                    OTLPMetricExporter: O
                } = await Promise.resolve().then(() => K6(M3K(), 1));
                _.push(new O(A));
                break
            }
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${Y}`)
        }
    } else if (z === "prometheus") {
        let {
            PrometheusExporter: Y
        } = await Promise.resolve().then(() => K6(V3K(), 1));
        _.push(new Y)
    } else throw Error(`Unknown exporter type set in OTEL_EXPORTER_OTLP_METRICS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${z}`);
    return _.map((z) => {
        if ("export" in z) return new g36.PeriodicExportingMetricReader({
            exporter: z,
            exportIntervalMillis: K
        });
        return z
    })
}
// @from(Ln 324342, Col 0)
async function W9K() {
    let q = Op8(process.env.OTEL_LOGS_EXPORTER),
        K = process.env.OTEL_EXPORTER_OTLP_LOGS_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
        _ = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    E(`[3P telemetry] getOtlpLogExporters: types=${I6(q)}, protocol=${K}, endpoint=${_}`);
    let z = [];
    for (let Y of q)
        if (Y === "console") z.push(new U36.ConsoleLogRecordExporter);
        else if (Y === "otlp") {
        let A = wp8();
        switch (K) {
            case "grpc": {
                let {
                    OTLPLogExporter: O
                } = await Promise.resolve().then(() => K6(h3K(), 1));
                z.push(new O);
                break
            }
            case "http/json": {
                let {
                    OTLPLogExporter: O
                } = await Promise.resolve().then(() => K6(K87(), 1));
                z.push(new O(A));
                break
            }
            case "http/protobuf": {
                let {
                    OTLPLogExporter: O
                } = await Promise.resolve().then(() => K6(d3K(), 1));
                z.push(new O(A));
                break
            }
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_LOGS_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${K}`)
        }
    } else throw Error(`Unknown exporter type set in OTEL_LOGS_EXPORTER env var: ${Y}`);
    return z
}
// @from(Ln 324380, Col 0)
async function Drz() {
    let q = Op8(process.env.OTEL_TRACES_EXPORTER),
        K = [];
    for (let _ of q)
        if (_ === "console") K.push(new Q36.ConsoleSpanExporter);
        else if (_ === "otlp") {
        let z = process.env.OTEL_EXPORTER_OTLP_TRACES_PROTOCOL?.trim() || process.env.OTEL_EXPORTER_OTLP_PROTOCOL?.trim(),
            Y = wp8();
        switch (z) {
            case "grpc": {
                let {
                    OTLPTraceExporter: A
                } = await Promise.resolve().then(() => K6(o3K(), 1));
                K.push(new A);
                break
            }
            case "http/json": {
                let {
                    OTLPTraceExporter: A
                } = await Promise.resolve().then(() => K6(j87(), 1));
                K.push(new A(Y));
                break
            }
            case "http/protobuf": {
                let {
                    OTLPTraceExporter: A
                } = await Promise.resolve().then(() => K6(H9K(), 1));
                K.push(new A(Y));
                break
            }
            default:
                throw Error(`Unknown protocol set in OTEL_EXPORTER_OTLP_TRACES_PROTOCOL or OTEL_EXPORTER_OTLP_PROTOCOL env var: ${z}`)
        }
    } else throw Error(`Unknown exporter type set in OTEL_TRACES_EXPORTER env var: ${_}`);
    return K
}
// @from(Ln 324417, Col 0)
function D9K() {
    return S6(process.env.CLAUDE_CODE_ENABLE_TELEMETRY)
}
// @from(Ln 324421, Col 0)
function Zrz() {
    let q = new Ds1;
    return new g36.PeriodicExportingMetricReader({
        exporter: q,
        exportIntervalMillis: 300000
    })
}
// @from(Ln 324429, Col 0)
function frz() {
    let q = MK(),
        K = i7() && (q === "enterprise" || q === "team");
    return x26() || K
}
// @from(Ln 324434, Col 0)
async function Grz(q) {
    let K = process.env.BETA_TRACING_ENDPOINT;
    if (!K) return;
    let [{
        OTLPTraceExporter: _
    }, {
        OTLPLogExporter: z
    }] = await Promise.all([Promise.resolve().then(() => K6(j87(), 1)), Promise.resolve().then(() => K6(K87(), 1))]), Y = {
        url: `${K}/v1/traces`
    }, A = {
        url: `${K}/v1/logs`
    }, O = new _(Y), w = new Q36.BatchSpanProcessor(O, {
        scheduledDelayMillis: M9K
    }), $ = new Q36.BasicTracerProvider({
        resource: q,
        spanProcessors: [w]
    });
    Nt.trace.setGlobalTracerProvider($), dO8($);
    let j = new z(A),
        H = new U36.LoggerProvider({
            resource: q,
            processors: [new U36.BatchLogRecordProcessor(j, {
                scheduledDelayMillis: X9K
            })]
        });
    Bq8.logs.setGlobalLoggerProvider(H), gO8(H);
    let J = Bq8.logs.getLogger("com.anthropic.claude_code.events", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION);
    UO8(J), process.on("beforeExit", async () => {
        await H?.forceFlush(), await $?.forceFlush()
    }), process.on("exit", () => {
        H?.forceFlush(), $?.forceFlush()
    })
}
// @from(Ln 324474, Col 0)
async function vrz() {
    if (XK("telemetry_init_start"), P9K(), Nt.propagation.setGlobalPropagator(new J9K.W3CTraceContextPropagator), wT7())
        for (let M of ["OTEL_METRICS_EXPORTER", "OTEL_LOGS_EXPORTER", "OTEL_TRACES_EXPORTER"]) {
            let P = process.env[M];
            if (P?.includes("console")) process.env[M] = P.split(",").map((W) => W.trim()).filter((W) => W !== "console").join(",")
        }
    Nt.diag.setLogger(new Zs1, Nt.DiagLogLevel.ERROR), Tb4();
    let q = [],
        K = D9K();
    if (E(`[3P telemetry] isTelemetryEnabled=${K} (CLAUDE_CODE_ENABLE_TELEMETRY=${process.env.CLAUDE_CODE_ENABLE_TELEMETRY})`), K) q.push(...await Wrz());
    if (frz()) q.push(Zrz());
    let _ = y1(),
        z = {
            [F36.ATTR_SERVICE_NAME]: "claude-code",
            [F36.ATTR_SERVICE_VERSION]: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION
        };
    if (_ === "wsl") {
        let M = EA6();
        if (M) z["wsl.version"] = M
    }
    let Y = yF.resourceFromAttributes(z),
        A = yF.resourceFromAttributes(yF.osDetector.detect().attributes || {}),
        O = yF.hostDetector.detect(),
        w = O.attributes?.[F36.SEMRESATTRS_HOST_ARCH] ? {
            [F36.SEMRESATTRS_HOST_ARCH]: O.attributes[F36.SEMRESATTRS_HOST_ARCH]
        } : {},
        $ = yF.resourceFromAttributes(w),
        j = yF.resourceFromAttributes(yF.envDetector.detect().attributes || {}),
        H = Y.merge(A).merge($).merge(j);
    if (hJ()) {
        Grz(H).catch((W) => E(`Beta tracing init failed: ${W}`, {
            level: "error"
        }));
        let M = new g36.MeterProvider({
            resource: H,
            views: [],
            readers: q
        });
        return QO8(M), eq(async () => {
            let W = ui(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS, 2000);
            try {
                Uc();
                let D = oB6(),
                    Z = PY6(),
                    G = [M.shutdown()];
                if (D) G.push(D.forceFlush().then(() => D.shutdown()));
                if (Z) G.push(Z.forceFlush().then(() => Z.shutdown()));
                await Promise.race([Promise.all(G), P87(W, "OpenTelemetry shutdown timeout")])
            } catch {}
        }), M.getMeter("com.anthropic.claude_code", {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION)
    }
    let J = new g36.MeterProvider({
        resource: H,
        views: [],
        readers: q
    });
    if (QO8(J), K) {
        let M = await W9K();
        if (E(`[3P telemetry] Created ${M.length} log exporter(s)`), M.length > 0) {
            let P = new U36.LoggerProvider({
                resource: H,
                processors: M.map((D) => new U36.BatchLogRecordProcessor(D, {
                    scheduledDelayMillis: ui(process.env.OTEL_LOGS_EXPORT_INTERVAL, X9K)
                }))
            });
            Bq8.logs.setGlobalLoggerProvider(P), gO8(P);
            let W = Bq8.logs.getLogger("com.anthropic.claude_code.events", {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION);
            UO8(W), E("[3P telemetry] Event logger set successfully"), process.on("beforeExit", async () => {
                await P?.forceFlush(), await PY6()?.forceFlush()
            }), process.on("exit", () => {
                P?.forceFlush(), PY6()?.forceFlush()
            })
        }
    }
    if (K && si1()) {
        let M = await Drz();
        if (M.length > 0) {
            let P = M.map((D) => new Q36.BatchSpanProcessor(D, {
                    scheduledDelayMillis: ui(process.env.OTEL_TRACES_EXPORT_INTERVAL, M9K)
                })),
                W = new Q36.BasicTracerProvider({
                    resource: H,
                    spanProcessors: P
                });
            Nt.trace.setGlobalTracerProvider(W), dO8(W)
        }
    }
    return eq(async () => {
        let M = ui(process.env.CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS, 2000);
        try {
            Uc();
            let P = [J.shutdown()],
                W = oB6();
            if (W) P.push(W.shutdown());
            let D = PY6();
            if (D) P.push(D.shutdown());
            await Promise.race([Promise.all(P), P87(M, "OpenTelemetry shutdown timeout")])
        } catch (P) {
            if (P instanceof Error && P.message.includes("timeout")) E(`
OpenTelemetry telemetry flush timed out after ${M}ms

To resolve this issue, you can:
1. Increase the timeout by setting CLAUDE_CODE_OTEL_SHUTDOWN_TIMEOUT_MS env var (e.g., 5000 for 5 seconds)
2. Check if your OpenTelemetry backend is experiencing scalability issues
3. Disable OpenTelemetry by unsetting CLAUDE_CODE_ENABLE_TELEMETRY env var

Current timeout: ${M}ms
`, {
                level: "error"
            });
            throw P
        }
    }), J.getMeter("com.anthropic.claude_code", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.VERSION)
}
// @from(Ln 324616, Col 0)
async function Trz() {
    let q = Y81();
    if (!q) return;
    let K = ui(process.env.CLAUDE_CODE_OTEL_FLUSH_TIMEOUT_MS, 5000);
    try {
        let _ = [q.forceFlush()],
            z = oB6();
        if (z) _.push(z.forceFlush());
        let Y = PY6();
        if (Y) _.push(Y.forceFlush());
        await Promise.race([Promise.all(_), P87(K, "OpenTelemetry flush timeout")]), E("Telemetry flushed successfully")
    } catch (_) {
        if (_ instanceof W87) E(`Telemetry flush timed out after ${K}ms. Some metrics may not be exported.`, {
            level: "warn"
        });
        else E(`Telemetry flush failed: ${b6(_)}`, {
            level: "error"
        })
    }
}
// @from(Ln 324637, Col 0)
function Z9K() {
    let q = {},
        K = process.env.OTEL_EXPORTER_OTLP_HEADERS;
    if (K)
        for (let _ of K.split(",")) {
            let [z, ...Y] = _.split("=");
            if (z && Y.length > 0) q[z.trim()] = Y.join("=").trim()
        }
    return q
}
// @from(Ln 324648, Col 0)
function wp8() {
    let q = ME(),
        K = $b(),
        _ = y7(),
        z = {},
        Y = Z9K();
    if (_?.otelHeadersHelper) z.headers = async () => {
        let $ = KS1();
        return {
            ...Y,
            ...$
        }
    };
    else if (Object.keys(Y).length > 0) z.headers = async () => Y;
    let A = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!q || A && Xo(A)) {
        let $ = Im();
        if (K || $) z.httpAgentOptions = {
            ...K,
            ...$ && {
                ca: $
            }
        };
        return z
    }
    let O = Im(),
        w = ($) => {
            return K || O ? new M87.HttpsProxyAgent(q, {
                ...K && {
                    cert: K.cert,
                    key: K.key,
                    passphrase: K.passphrase
                },
                ...O && {
                    ca: O
                }
            }) : new M87.HttpsProxyAgent(q)
        };
    return z.httpAgentOptions = w, z
}
// @from(Ln 324688, Col 4)
Nt
// @from(Ln 324688, Col 8)
Bq8
// @from(Ln 324688, Col 13)
J9K
// @from(Ln 324688, Col 18)
yF
// @from(Ln 324688, Col 22)
U36
// @from(Ln 324688, Col 27)
g36
// @from(Ln 324688, Col 32)
Q36
// @from(Ln 324688, Col 37)
F36
// @from(Ln 324688, Col 42)
M87
// @from(Ln 324688, Col 47)
Prz = 60000
// @from(Ln 324689, Col 4)
X9K = 5000
// @from(Ln 324690, Col 4)
M9K = 5000
// @from(Ln 324691, Col 4)
W87
// @from(Ln 324692, Col 4)
Z87 = L(() => {
    y8();
    T7();
    NK();
    cQ6();
    R9();
    K8();
    Q8();
    m8();
    Qm();
    _M();
    a1();
    e8();
    ag();
    h18();
    Ha4();
    Ja4();
    ih6();
    Qc();
    Nt = K6($5(), 1), Bq8 = K6(bC1(), 1), J9K = K6(t_(), 1), yF = K6(Bk6(), 1), U36 = K6(uC1(), 1), g36 = K6(pJ6(), 1), Q36 = K6(Aa4(), 1), F36 = K6(i26(), 1), M87 = K6(dQ6(), 1);
    W87 = class W87 extends Error {}
})
// @from(Ln 324714, Col 4)
f9K = {}
// @from(Ln 324720, Col 0)
async function pq8({
    clearOnboarding: q = !1
}) {
    let {
        flushTelemetry: K
    } = await Promise.resolve().then(() => (Z87(), D87));
    await K(), await qS1(), t3().delete(), await $p8(), d8((z) => {
        let Y = {
            ...z
        };
        if (q) {
            if (Y.hasCompletedOnboarding = !1, Y.subscriptionNoticeCount = 0, Y.hasAvailableSubscription = !1, Y.customApiKeyResponses?.approved) Y.customApiKeyResponses = {
                ...Y.customApiKeyResponses,
                approved: []
            }
        }
        return Y.oauthAccount = void 0, Y
    })
}
// @from(Ln 324739, Col 0)
async function $p8() {
    o7.cache?.clear?.(), j78(), ZV8(), CV8(), Rk6(), $2.cache.clear?.(), O$6(), j36.cache?.clear?.(), OF.cache?.clear?.(), await rc4(), await v87()
}
// @from(Ln 324742, Col 0)
async function Vrz() {
    await pq8({
        clearOnboarding: !0
    });
    let q = f87.createElement(T, null, "Successfully logged out from your Anthropic account.");
    return setTimeout(() => {
        j5(0, "logout")
    }, 200), q
}
// @from(Ln 324751, Col 4)
f87
// @from(Ln 324752, Col 4)
G87 = L(() => {
    kJ6();
    hk();
    g6();
    B1();
    mR6();
    J2();
    tR6();
    T7();
    pv();
    h1();
    CY();
    _46();
    bV8();
    B26();
    f87 = K6(P6(), 1)
})
// @from(Ln 324769, Col 0)
async function G9K() {
    try {
        if (H8().claudeCodeFirstTokenDate !== void 0) return;
        let K = OH();
        if (K.error) {
            j6(Error(`Failed to get auth headers: ${K.error}`));
            return
        }
        let z = `${r7().BASE_API_URL}/api/organization/claude_code_first_token_date`,
            A = (await Z1.get(z, {
                headers: {
                    ...K.headers,
                    "User-Agent": yA()
                },
                timeout: 1e4
            })).data?.first_token_date ?? null;
        if (A !== null) {
            let O = new Date(A).getTime();
            if (isNaN(O)) {
                j6(Error(`Received invalid first_token_date from API: ${A}`));
                return
            }
        }
        d8((O) => ({
            ...O,
            claudeCodeFirstTokenDate: A
        }))
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 324800, Col 4)
v9K = L(() => {
    CK();
    z3();
    h1();
    Zf();
    U8()
})
// @from(Ln 324808, Col 0)
function krz(q) {
    let K;
    try {
        K = new URL(q)
    } catch (_) {
        throw Error(`Invalid URL format: ${q}`)
    }
    if (K.protocol !== "http:" && K.protocol !== "https:") throw Error(`Invalid URL protocol: must use http:// or https://, got ${K.protocol}`)
}
// @from(Ln 324817, Col 0)
async function lS6(q) {
    try {
        let K = process.platform;
        if (K === "win32") {
            let {
                code: Y
            } = await w1("explorer", [q]);
            return Y === 0
        }
        let _ = K === "darwin" ? "open" : "xdg-open",
            {
                code: z
            } = await w1(_, [q]);
        return z === 0
    } catch (K) {
        return !1
    }
}
// @from(Ln 324835, Col 0)
async function J3(q) {
    try {
        krz(q);
        let K = process.env.BROWSER,
            _ = process.platform;
        if (_ === "win32") {
            if (K) {
                let {
                    code: Y
                } = await w1(K, [`"${q}"`]);
                return Y === 0
            }
            let {
                code: z
            } = await w1("rundll32", ["url,OpenURL", q], {});
            return z === 0
        } else {
            let z = K || (_ === "darwin" ? "open" : "xdg-open"),
                {
                    code: Y
                } = await w1(z, [q]);
            return Y === 0
        }
    } catch (K) {
        return !1
    }
}
// @from(Ln 324862, Col 4)
Nj = L(() => {
    Q4()
})
// @from(Ln 324868, Col 4)
T87
// @from(Ln 324869, Col 4)
T9K = L(() => {
    C8();
    z3();
    U8();
    YD();
    T87 = class T87 {
        localServer;
        port = 0;
        promiseResolver = null;
        promiseRejecter = null;
        expectedState = null;
        pendingResponse = null;
        callbackPath;
        constructor(q = "/callback") {
            this.localServer = Nrz(), this.callbackPath = q
        }
        async start(q) {
            return new Promise((K, _) => {
                this.localServer.once("error", (z) => {
                    _(Error(`Failed to start OAuth callback server: ${z.message}`))
                }), this.localServer.listen(q ?? 0, "localhost", () => {
                    let z = this.localServer.address();
                    this.port = z.port, K(this.port)
                })
            })
        }
        getPort() {
            return this.port
        }
        hasPendingResponse() {
            return this.pendingResponse !== null
        }
        async waitForAuthorization(q, K) {
            return new Promise((_, z) => {
                this.promiseResolver = _, this.promiseRejecter = z, this.expectedState = q, this.startLocalListener(K)
            })
        }
        handleSuccessRedirect(q, K) {
            if (!this.pendingResponse) return;
            if (K) {
                K(this.pendingResponse, q), this.pendingResponse = null, d("tengu_oauth_automatic_redirect", {
                    custom_handler: !0
                });
                return
            }
            let _ = ub(q) ? r7().CLAUDEAI_SUCCESS_URL : r7().CONSOLE_SUCCESS_URL;
            this.pendingResponse.writeHead(302, {
                Location: _
            }), this.pendingResponse.end(), this.pendingResponse = null, d("tengu_oauth_automatic_redirect", {})
        }
        handleErrorRedirect() {
            if (!this.pendingResponse) return;
            let q = r7().CLAUDEAI_SUCCESS_URL;
            this.pendingResponse.writeHead(302, {
                Location: q
            }), this.pendingResponse.end(), this.pendingResponse = null, d("tengu_oauth_automatic_redirect_error", {})
        }
        startLocalListener(q) {
            this.localServer.on("request", this.handleRedirect.bind(this)), this.localServer.on("error", this.handleError.bind(this)), q()
        }
        handleRedirect(q, K) {
            let _ = new URL(q.url || "", `http://${q.headers.host||"localhost"}`);
            if (_.pathname !== this.callbackPath) {
                K.writeHead(404), K.end();
                return
            }
            let z = _.searchParams.get("code") ?? void 0,
                Y = _.searchParams.get("state") ?? void 0;
            this.validateAndRespond(z, Y, K)
        }
        validateAndRespond(q, K, _) {
            if (!q) {
                _.writeHead(400), _.end("Authorization code not found"), this.reject(Error("No authorization code received"));
                return
            }
            if (K !== this.expectedState) {
                _.writeHead(400), _.end("Invalid state parameter"), this.reject(Error("Invalid state parameter"));
                return
            }
            this.pendingResponse = _, this.resolve(q)
        }
        handleError(q) {
            j6(q), this.close(), this.reject(q)
        }
        resolve(q) {
            if (this.promiseResolver) this.promiseResolver(q), this.promiseResolver = null, this.promiseRejecter = null
        }
        reject(q) {
            if (this.promiseRejecter) this.promiseRejecter(q), this.promiseResolver = null, this.promiseRejecter = null
        }
        close() {
            if (this.pendingResponse) this.handleErrorRedirect();
            if (this.localServer) this.localServer.removeAllListeners(), this.localServer.close()
        } [Symbol.dispose]() {
            this.close()
        }
    }
})
// @from(Ln 324972, Col 0)
function V87(q) {
    return q.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")
}
// @from(Ln 324976, Col 0)
function k9K() {
    return V87(V9K(32))
}
// @from(Ln 324980, Col 0)
function N9K(q) {
    let K = Erz("sha256");
    return K.update(q), V87(K.digest())
}
// @from(Ln 324985, Col 0)
function E9K() {
    return V87(V9K(32))
}
// @from(Ln 324988, Col 4)
y9K = () => {}
// @from(Ln 324989, Col 0)
class Et {
    codeVerifier;
    authCodeListener = null;
    port = null;
    manualAuthCodeResolver = null;
    constructor() {
        this.codeVerifier = k9K()
    }
    async startOAuthFlow(q, K) {
        this.authCodeListener = new T87, this.port = await this.authCodeListener.start();
        let _ = N9K(this.codeVerifier),
            z = E9K(),
            Y = {
                codeChallenge: _,
                state: z,
                port: this.port,
                loginWithClaudeAi: K?.loginWithClaudeAi,
                inferenceOnly: K?.inferenceOnly,
                orgUUID: K?.orgUUID,
                loginHint: K?.loginHint,
                loginMethod: K?.loginMethod
            },
            A = OZ8({
                ...Y,
                isManual: !0
            }),
            O = OZ8({
                ...Y,
                isManual: !1
            }),
            w = await this.waitForAuthorizationCode(z, async () => {
                if (K?.skipBrowserOpen) await q(A, O);
                else await q(A), await J3(O)
            }),
            $ = this.authCodeListener?.hasPendingResponse() ?? !1;
        d("tengu_oauth_auth_code_received", {
            automatic: $
        });
        try {
            let j = await Uf1(w, z, this.codeVerifier, this.port, !$, K?.expiresIn),
                H = await wZ8(j.access_token);
            if ($) {
                let J = cl6(j.scope);
                this.authCodeListener?.handleSuccessRedirect(J)
            }
            return this.formatTokens(j, H.subscriptionType, H.rateLimitTier, H.rawProfile)
        } catch (j) {
            if ($) this.authCodeListener?.handleErrorRedirect();
            throw j
        } finally {
            this.authCodeListener?.close()
        }
    }
    async waitForAuthorizationCode(q, K) {
        return new Promise((_, z) => {
            this.manualAuthCodeResolver = _, this.authCodeListener?.waitForAuthorization(q, K).then((Y) => {
                this.manualAuthCodeResolver = null, _(Y)
            }).catch((Y) => {
                this.manualAuthCodeResolver = null, z(Y)
            })
        })
    }
    handleManualAuthCodeInput(q) {
        if (this.manualAuthCodeResolver) this.manualAuthCodeResolver(q.authorizationCode), this.manualAuthCodeResolver = null, this.authCodeListener?.close()
    }
    formatTokens(q, K, _, z) {
        return {
            accessToken: q.access_token,
            refreshToken: q.refresh_token,
            expiresAt: Date.now() + q.expires_in * 1000,
            scopes: cl6(q.scope),
            subscriptionType: K,
            rateLimitTier: _,
            profile: z,
            tokenAccount: q.account ? {
                uuid: q.account.uuid,
                emailAddress: q.account.email_address,
                organizationUuid: q.organization?.uuid
            } : void 0
        }
    }
    cleanup() {
        this.authCodeListener?.close(), this.manualAuthCodeResolver = null
    }
}
// @from(Ln 325074, Col 4)
Fq8 = L(() => {
    C8();
    Nj();
    T9K();
    YD();
    y9K()
})
// @from(Ln 325085, Col 0)
function qw(q) {
    let K = s(5),
        {
            children: _
        } = q,
        {
            exit: z
        } = hI(),
        Y, A;
    if (K[0] !== z) Y = () => {
        let w = setTimeout(z, 0);
        return () => clearTimeout(w)
    }, A = [z], K[0] = z, K[1] = Y, K[2] = A;
    else Y = K[1], A = K[2];
    L9K.useLayoutEffect(Y, A);
    let O;
    if (K[3] !== _) O = d36.createElement(d36.Fragment, null, _), K[3] = _, K[4] = O;
    else O = K[4];
    return O
}
// @from(Ln 325105, Col 0)
async function gq8(q, K) {
    let _ = "",
        z = !1,
        Y = new Lrz;
    if (K !== void 0) Y.columns = K;
    return Y.on("data", (O) => {
        if (z) return;
        z = !0, _ = O.toString()
    }), await (await eB(d36.createElement(qw, null, q), {
        stdout: Y,
        patchConsole: !1
    })).waitUntilExit(), _
}
// @from(Ln 325118, Col 0)
async function h9K(q, K) {
    let _ = await gq8(q, K);
    return MO(_)
}
// @from(Ln 325122, Col 4)
d36
// @from(Ln 325122, Col 9)
L9K
// @from(Ln 325123, Col 4)
yt = L(() => {
    o6();
    mN();
    g6();
    d36 = K6(P6(), 1), L9K = K6(P6(), 1)
})
// @from(Ln 325138, Col 0)
function jp8() {
    return Uq8(A7(), "local")
}
// @from(Ln 325142, Col 0)
function S9K() {
    return Uq8(jp8(), "claude")
}
// @from(Ln 325146, Col 0)
function C9K() {
    return (process.argv[1] || "").includes("/.claude/local/node_modules/")
}
// @from(Ln 325149, Col 0)
async function R9K(q, K, _) {
    try {
        return await Srz(q, K, {
            encoding: "utf8",
            flag: "wx",
            mode: _
        }), !0
    } catch (z) {
        if (Q1(z) === "EEXIST") return !1;
        throw z
    }
}
// @from(Ln 325161, Col 0)
async function Crz() {
    try {
        let q = jp8();
        await V8().mkdir(q), await R9K(Uq8(q, "package.json"), I6({
            name: "claude-local",
            version: "0.0.1",
            private: !0
        }, null, 2));
        let K = Uq8(q, "claude");
        if (await R9K(K, `#!/bin/sh
exec "${q}/node_modules/.bin/claude" "$@"`, 493)) await Rrz(K, 493);
        return !0
    } catch (q) {
        return j6(q), !1
    }
}
// @from(Ln 325177, Col 0)
async function Qq8(q, K) {
    try {
        if (!await Crz()) return "install_failed";
        let _ = K ? K : q === "stable" ? "stable" : "latest",
            z = await M7("npm", ["install", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}@${_}`], {
                cwd: jp8(),
                maxBuffer: 1e6
            });
        if (z.code !== 0) {
            let Y = Error(`Failed to install Claude CLI package: ${z.stderr}`);
            return j6(Y), z.code === 190 ? "in_progress" : "install_failed"
        }
        return d8((Y) => ({
            ...Y,
            installMethod: "local"
        })), "success"
    } catch (_) {
        return j6(_), "install_failed"
    }
}
// @from(Ln 325197, Col 0)
async function AX6() {
    try {
        return await hrz(Uq8(jp8(), "node_modules", ".bin", "claude")), !0
    } catch {
        return !1
    }
}
// @from(Ln 325205, Col 0)
function nS6() {
    let q = process.env.SHELL || "";
    if (q.includes("zsh")) return "zsh";
    if (q.includes("bash")) return "bash";
    if (q.includes("fish")) return "fish";
    return "unknown"
}
// @from(Ln 325212, Col 4)
OX6 = L(() => {
    h1();
    Q8();
    m8();
    Q4();
    Yq();
    U8();
    e8()
})
// @from(Ln 325233, Col 0)
function c36(q) {
    let K = q?.homedir ?? b9K(),
        z = (q?.env ?? process.env).ZDOTDIR || K;
    return {
        zsh: k87(z, ".zshrc"),
        bash: k87(K, ".bashrc"),
        fish: k87(K, ".config/fish/config.fish")
    }
}
// @from(Ln 325243, Col 0)
function Hp8(q) {
    let K = !1;
    return {
        filtered: q.filter((z) => {
            if (I9K.test(z)) {
                let Y = z.match(/alias\s+claude\s*=\s*["']([^"']+)["']/);
                if (!Y) Y = z.match(/alias\s+claude\s*=\s*([^#\n]+)/);
                if (Y && Y[1]) {
                    if (Y[1].trim() === S9K()) return K = !0, !1
                }
            }
            return !0
        }),
        hadAlias: K
    }
}
// @from(Ln 325259, Col 0)
async function dq8(q) {
    try {
        return (await Irz(q, {
            encoding: "utf8"
        })).split(`
`)
    } catch (K) {
        if (D5(K)) return null;
        throw K
    }
}
// @from(Ln 325270, Col 0)
async function Jp8(q, K) {
    let _ = await brz(q, "w");
    try {
        await _.writeFile(K.join(`
`), {
            encoding: "utf8"
        }), await _.datasync()
    } finally {
        await _.close()
    }
}
// @from(Ln 325281, Col 0)
async function N87(q) {
    let K = c36(q);
    for (let _ of Object.values(K)) {
        let z = await dq8(_);
        if (!z) continue;
        for (let Y of z)
            if (I9K.test(Y)) {
                let A = Y.match(/alias\s+claude=["']?([^"'\s]+)/);
                if (A && A[1]) return A[1]
            }
    }
    return null
}
// @from(Ln 325294, Col 0)
async function x9K(q) {
    let K = await N87(q);
    if (!K) return null;
    let _ = q?.homedir ?? b9K(),
        z = K.startsWith("~") ? K.replace("~", _) : K;
    try {
        let Y = await xrz(z);
        if (Y.isFile() || Y.isSymbolicLink()) return K
    } catch {}
    return null
}
// @from(Ln 325305, Col 4)
I9K
// @from(Ln 325306, Col 4)
Xp8 = L(() => {
    m8();
    OX6();
    I9K = /^\s*alias\s+claude\s*=/
})
// @from(Ln 325324, Col 0)
async function B9K() {
    try {
        let q = await Kd("tengu_version_config", {
            minVersion: "0.0.0"
        });
        if (q.minVersion && Qa({
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION, q.minVersion)) console.error(`
It looks like your version of Claude Code (${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION}) needs an update.
A newer version (${q.minVersion} or higher) is required to continue.

To update, please run:
    claude update

This will ensure you have access to the latest features and improvements.
`), j5(1)
    } catch (q) {
        j6(q)
    }
}
// @from(Ln 325349, Col 0)
async function l36() {
    return (await F9K()).external || void 0
}
// @from(Ln 325352, Col 0)
async function p9K() {
    return (await F9K()).external_message || void 0
}
// @from(Ln 325355, Col 0)
async function F9K() {
    try {
        return await Kd("tengu_max_version_config", {})
    } catch (q) {
        return j6(q), {}
    }
}
// @from(Ln 325363, Col 0)
function Lt(q) {
    let _ = v7()?.minimumVersion;
    if (!_) return !1;
    let z = !QW(q, _);
    if (z) E(`Skipping update to ${q} - below minimumVersion ${_}`);
    return z
}
// @from(Ln 325371, Col 0)
function g9K() {
    return Brz(A7(), ".update.lock")
}
// @from(Ln 325374, Col 0)
async function Frz() {
    let q = V8(),
        K = g9K();
    try {
        let _ = await q.stat(K);
        if (Date.now() - _.mtimeMs < m9K) return !1;
        try {
            let Y = await q.stat(K);
            if (Date.now() - Y.mtimeMs < m9K) return !1;
            await q.unlink(K)
        } catch (Y) {
            if (!t1(Y)) return j6(Y), !1
        }
    } catch (_) {
        if (!t1(_)) return j6(_), !1
    }
    try {
        return await u9K(K, `${process.pid}`, {
            encoding: "utf8",
            flag: "wx"
        }), !0
    } catch (_) {
        let z = Q1(_);
        if (z === "EEXIST") return !1;
        if (z === "ENOENT") try {
            return await q.mkdir(A7()), await u9K(K, `${process.pid}`, {
                encoding: "utf8",
                flag: "wx"
            }), !0
        } catch (Y) {
            if (Q1(Y) === "EEXIST") return !1;
            return j6(Y), !1
        }
        return j6(_), !1
    }
}
// @from(Ln 325410, Col 0)
async function grz() {
    let q = V8(),
        K = g9K();
    try {
        if (await q.readFile(K, {
                encoding: "utf8"
            }) === `${process.pid}`) await q.unlink(K)
    } catch (_) {
        if (t1(_)) return;
        j6(_)
    }
}
// @from(Ln 325422, Col 0)
async function Urz() {
    let q = X7.isRunningWithBun(),
        K = null;
    if (q) K = await M7("bun", ["pm", "bin", "-g"], {
        cwd: lq8()
    });
    else K = await M7("npm", ["-g", "config", "get", "prefix"], {
        cwd: lq8()
    });
    if (K.code !== 0) return j6(Error(`Failed to check ${q?"bun":"npm"} permissions`)), null;
    return K.stdout.trim()
}
// @from(Ln 325434, Col 0)
async function U9K() {
    try {
        let q = await Urz();
        if (!q) return {
            hasPermissions: !1,
            npmPrefix: null
        };
        try {
            return await mrz(q, urz.W_OK), {
                hasPermissions: !0,
                npmPrefix: q
            }
        } catch {
            return j6(new cq8("Insufficient permissions for global npm install.")), {
                hasPermissions: !1,
                npmPrefix: q
            }
        }
    } catch (q) {
        return j6(q), {
            hasPermissions: !1,
            npmPrefix: null
        }
    }
}
// @from(Ln 325459, Col 0)
async function iS6(q) {
    let K = q === "stable" ? "stable" : "latest",
        _ = await M7("npm", ["view", `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}@${K}`, "version", "--prefer-online"], {
            abortSignal: AbortSignal.timeout(5000),
            cwd: lq8()
        });
    if (_.code !== 0) {
        if (E(`npm view failed with code ${_.code}`), _.stderr) E(`npm stderr: ${_.stderr.trim()}`);
        else E("npm stderr: (empty)");
        if (_.stdout) E(`npm stdout: ${_.stdout.trim()}`);
        return null
    }
    return _.stdout.trim() || null
}
// @from(Ln 325473, Col 0)
async function Q9K() {
    let q = await M7("npm", ["view", {
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.PACKAGE_URL, "dist-tags", "--json", "--prefer-online"], {
        abortSignal: AbortSignal.timeout(5000),
        cwd: lq8()
    });
    if (q.code !== 0) return E(`npm view dist-tags failed with code ${q.code}`), {
        latest: null,
        stable: null
    };
    try {
        let K = n8(q.stdout.trim());
        return {
            latest: typeof K.latest === "string" ? K.latest : null,
            stable: typeof K.stable === "string" ? K.stable : null
        }
    } catch (K) {
        return E(`Failed to parse dist-tags: ${K}`), {
            latest: null,
            stable: null
        }
    }
}
// @from(Ln 325502, Col 0)
async function nq8(q) {
    if (o3()) return null;
    try {
        return (await Z1.get(`${prz}/${q}`, {
            timeout: 5000,
            responseType: "text"
        })).data.trim()
    } catch (K) {
        return E(`Failed to fetch ${q} from GCS: ${K}`), null
    }
}
// @from(Ln 325513, Col 0)
async function Qrz(q) {
    if (o3()) return null;
    try {
        let _ = (await Z1.get(`https://formulae.brew.sh/api/cask/${q}.json`, {
            timeout: 5000,
            responseType: "json"
        })).data?.version;
        return typeof _ === "string" ? _ : null
    } catch (K) {
        return E(`Failed to fetch ${q} from formulae.brew.sh: ${K}`), null
    }
}
// @from(Ln 325525, Col 0)
async function Mp8(q, K) {
    let [_, z] = await Promise.all([Qrz(q), nq8(K)]);
    return _ ?? z
}
// @from(Ln 325529, Col 0)
async function d9K() {
    let [q, K] = await Promise.all([nq8("latest"), nq8("stable")]);
    return {
        latest: q,
        stable: K
    }
}
// @from(Ln 325536, Col 0)
async function iq8(q) {
    if (!await Frz()) return j6(new cq8("Another process is currently installing an update")), d("tengu_auto_updater_lock_contention", {
        pid: process.pid,
        currentVersion: {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION
    }), "in_progress";
    try {
        if (await drz(), !X7.isRunningWithBun() && X7.isNpmFromWindowsPath()) return j6(Error("Windows NPM detected in WSL environment")), d("tengu_auto_updater_windows_npm_in_wsl", {
            currentVersion: {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.VERSION
        }), console.error(`
Error: Windows NPM detected in WSL

You're running Claude Code in WSL but using the Windows NPM installation from /mnt/c/.
This configuration is not supported for updates.

To fix this issue:
  1. Install Node.js within your Linux distribution: e.g. sudo apt install nodejs npm
  2. Make sure Linux NPM is in your PATH before the Windows version
  3. Try updating again with 'claude update'
`), "install_failed";
        let K = q ? `${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}@${q}` : {
                ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                PACKAGE_URL: "@anthropic-ai/claude-code",
                README_URL: "https://code.claude.com/docs/en/overview",
                VERSION: "2.1.112",
                FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                BUILD_TIME: "2026-04-16T18:33:19Z"
            }.PACKAGE_URL,
            _ = X7.isRunningWithBun() ? "bun" : "npm",
            z = await M7(_, ["install", "-g", K], {
                cwd: lq8()
            });
        if (z.code !== 0) {
            let Y = `${z.stdout} ${z.stderr}`;
            if (/\b(EACCES|EPERM|permission denied)\b/i.test(Y)) return j6(new cq8("Insufficient permissions for global npm install.")), "no_permissions";
            let A = new cq8(`Failed to install new version of claude: ${Y}`);
            return j6(A), "install_failed"
        }
        return d8((Y) => ({
            ...Y,
            installMethod: "global"
        })), "success"
    } finally {
        await grz()
    }
}
// @from(Ln 325595, Col 0)
async function drz() {
    let q = c36();
    for (let [, K] of Object.entries(q)) try {
        let _ = await dq8(K);
        if (!_) continue;
        let {
            filtered: z,
            hadAlias: Y
        } = Hp8(_);
        if (Y) await Jp8(K, z), E(`Removed claude alias from ${K}`)
    } catch (_) {
        E(`Failed to remove alias from ${K}: ${_}`, {
            level: "error"
        })
    }
}
// @from(Ln 325611, Col 4)
prz = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 325612, Col 4)
cq8
// @from(Ln 325612, Col 9)
m9K = 300000
// @from(Ln 325613, Col 4)
ht = L(() => {
    CK();
    B1();
    C8();
    h1();
    K8();
    D_();
    Q8();
    m8();
    Q4();
    Yq();
    CY();
    U8();
    G$();
    a1();
    Xp8();
    e8();
    cq8 = class cq8 extends sp6 {}
})
// @from(Ln 325636, Col 0)
function Wp8(q, K) {
    return K.includes(q.id) || q.idLike.some((_) => K.includes(_))
}
// @from(Ln 325640, Col 0)
function E87() {
    let q = process.execPath || process.argv[0] || "";
    if (/[/\\]mise[/\\]installs[/\\]/i.test(q)) return E(`Detected mise installation: ${q}`), !0;
    return !1
}
// @from(Ln 325646, Col 0)
function y87() {
    let q = process.execPath || process.argv[0] || "";
    if (/[/\\]\.?asdf[/\\]installs[/\\]/i.test(q)) return E(`Detected asdf installation: ${q}`), !0;
    return !1
}
// @from(Ln 325652, Col 0)
function rS6() {
    let q = y1();
    if (q !== "macos" && q !== "linux" && q !== "wsl") return !1;
    let K = process.execPath || process.argv[0] || "";
    if (K.includes("/Caskroom/")) return E(`Detected Homebrew cask installation: ${K}`), !0;
    return !1
}
// @from(Ln 325660, Col 0)
function Dp8() {
    return (process.execPath || process.argv[0] || "").match(/\/Caskroom\/([^/]+)\//)?.[1] ?? null
}
// @from(Ln 325664, Col 0)
function L87() {
    if (y1() !== "windows") return !1;
    let K = process.execPath || process.argv[0] || "",
        _ = [/Microsoft[/\\]WinGet[/\\]Packages/i, /Microsoft[/\\]WinGet[/\\]Links/i];
    for (let z of _)
        if (z.test(K)) return E(`Detected winget installation: ${K}`), !0;
    return !1
}
// @from(Ln 325672, Col 4)
Pp8
// @from(Ln 325672, Col 9)
h87
// @from(Ln 325672, Col 14)
R87
// @from(Ln 325672, Col 19)
S87
// @from(Ln 325672, Col 24)
C87
// @from(Ln 325672, Col 29)
oS6
// @from(Ln 325673, Col 4)
Zp8 = L(() => {
    U4();
    K8();
    Q4();
    NK();
    Pp8 = P1(async () => {
        try {
            let q = await crz("/etc/os-release", "utf8"),
                K = q.match(/^ID=["']?(\S+?)["']?\s*$/m),
                _ = q.match(/^ID_LIKE=["']?(.+?)["']?\s*$/m);
            return {
                id: K?.[1] ?? "",
                idLike: _?.[1]?.split(" ") ?? []
            }
        } catch {
            return null
        }
    });
    h87 = P1(async () => {
        if (y1() !== "linux") return !1;
        let K = await Pp8();
        if (K && !Wp8(K, ["arch"])) return !1;
        let _ = process.execPath || process.argv[0] || "",
            z = await w1("pacman", ["-Qo", _], {
                timeout: 5000,
                useCwd: !1
            });
        if (z.code === 0 && z.stdout) return E(`Detected pacman installation: ${z.stdout.trim()}`), !0;
        return !1
    }), R87 = P1(async () => {
        if (y1() !== "linux") return !1;
        let K = await Pp8();
        if (K && !Wp8(K, ["debian"])) return !1;
        let _ = process.execPath || process.argv[0] || "",
            z = await w1("dpkg", ["-S", _], {
                timeout: 5000,
                useCwd: !1
            });
        if (z.code === 0 && z.stdout) return E(`Detected deb installation: ${z.stdout.trim()}`), !0;
        return !1
    }), S87 = P1(async () => {
        if (y1() !== "linux") return !1;
        let K = await Pp8();
        if (K && !Wp8(K, ["fedora", "rhel", "suse"])) return !1;
        let _ = process.execPath || process.argv[0] || "",
            z = await w1("rpm", ["-qf", _], {
                timeout: 5000,
                useCwd: !1
            });
        if (z.code === 0 && z.stdout) return E(`Detected rpm installation: ${z.stdout.trim()}`), !0;
        return !1
    }), C87 = P1(async () => {
        if (y1() !== "linux") return !1;
        let K = await Pp8();
        if (K && !Wp8(K, ["alpine"])) return !1;
        let _ = process.execPath || process.argv[0] || "",
            z = await w1("apk", ["info", "--who-owns", _], {
                timeout: 5000,
                useCwd: !1
            });
        if (z.code === 0 && z.stdout) return E(`Detected apk installation: ${z.stdout.trim()}`), !0;
        return !1
    }), oS6 = P1(async () => {
        if (rS6()) return "homebrew";
        if (L87()) return "winget";
        if (E87()) return "mise";
        if (y87()) return "asdf";
        if (await h87()) return "pacman";
        if (await C87()) return "apk";
        if (await R87()) return "deb";
        if (await S87()) return "rpm";
        return "unknown"
    })
})
// @from(Ln 325761, Col 0)
function irz() {
    let q = process.argv[1] || "",
        K = process.execPath || process.argv[0] || "";
    if (y1() === "windows") q = q.split(oq8.sep).join(rq8.sep), K = K.split(oq8.sep).join(rq8.sep);
    return [q, K]
}
// @from(Ln 325767, Col 0)
async function Rt() {
    let [q] = irz();
    if (v$()) {
        if (rS6() || L87() || E87() || y87() || await h87() || await R87() || await S87() || await C87()) return "package-manager";
        return "native"
    }
    if (C9K()) return "npm-local";
    if (["/usr/local/lib/node_modules", "/usr/lib/node_modules", "/opt/homebrew/lib/node_modules", "/opt/homebrew/bin", "/usr/local/bin", "/.nvm/versions/node/"].some((Y) => q.includes(Y))) return "npm-global";
    if (q.includes("/npm/") || q.includes("/nvm/")) return "npm-global";
    let _ = await ij("npm config get prefix", {
            reject: !1
        }),
        z = _.exitCode === 0 ? _.stdout.trim() : null;
    if (z && q.startsWith(z)) return "npm-global";
    return "unknown"
}
// @from(Ln 325783, Col 0)
async function rrz() {
    if (v$()) {
        try {
            return await c9K(process.execPath)
        } catch {}
        try {
            let q = await oA("claude");
            if (q) return q
        } catch {}
        try {
            return await V8().stat(LF(wX6(), ".local/bin/claude")), LF(wX6(), ".local/bin/claude")
        } catch {}
        return "native"
    }
    try {
        return process.argv[0] || "unknown"
    } catch {
        return "unknown"
    }
}
// @from(Ln 325804, Col 0)
function orz() {
    try {
        if (v$()) return process.execPath || "unknown";
        return process.argv[1] || "unknown"
    } catch {
        return "unknown"
    }
}
// @from(Ln 325812, Col 0)
async function arz() {
    let q = V8(),
        K = [],
        _ = LF(wX6(), ".claude", "local");
    if (await AX6()) K.push({
        type: "npm-local",
        path: _
    });
    let z = ["@anthropic-ai/claude-code"];
    if ({
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.PACKAGE_URL && {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.PACKAGE_URL !== "@anthropic-ai/claude-code") z.push({
        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
        PACKAGE_URL: "@anthropic-ai/claude-code",
        README_URL: "https://code.claude.com/docs/en/overview",
        VERSION: "2.1.112",
        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
        BUILD_TIME: "2026-04-16T18:33:19Z"
    }.PACKAGE_URL);
    let Y = await w1("npm", ["-g", "config", "get", "prefix"]);
    if (Y.code === 0 && Y.stdout) {
        let w = Y.stdout.trim(),
            $ = y1() === "windows",
            j = $ ? LF(w, "claude") : LF(w, "bin", "claude"),
            H = !1;
        try {
            await q.stat(j), H = !0
        } catch {}
        if (H) {
            let J = !1;
            try {
                if ((await c9K(j)).includes("/Caskroom/")) J = rS6()
            } catch {}
            if (!J) K.push({
                type: "npm-global",
                path: j
            })
        } else
            for (let J of z) {
                let X = $ ? LF(w, "node_modules", J) : LF(w, "lib", "node_modules", J);
                try {
                    await q.stat(X), K.push({
                        type: "npm-global-orphan",
                        path: X
                    })
                } catch {}
            }
    }
    let A = LF(wX6(), ".local", "bin", "claude");
    try {
        await q.stat(A), K.push({
            type: "native",
            path: A
        })
    } catch {}
    if (H8().installMethod === "native") {
        let w = LF(wX6(), ".local", "share", "claude");
        try {
            if (await q.stat(w), !K.some(($) => $.type === "native")) K.push({
                type: "native",
                path: w
            })
        } catch {}
    }
    return K
}
// @from(Ln 325890, Col 0)
async function srz(q) {
    let K = [];
    try {
        let A = await lrz(LF(SW(), "managed-settings.json"), "utf-8"),
            O = n8(A),
            w = O && typeof O === "object" ? O.strictPluginOnlyCustomization : void 0;
        if (w !== void 0 && typeof w !== "boolean")
            if (!Array.isArray(w)) K.push({
                issue: `managed-settings.json: strictPluginOnlyCustomization has an invalid value (expected true or an array, got ${typeof w})`,
                fix: `The field is silently ignored (schema .catch rescues it). Set it to true, or an array of: ${YG6.join(", ")}.`
            });
            else {
                let $ = w.filter((j) => typeof j === "string" && !YG6.includes(j));
                if ($.length > 0) K.push({
                    issue: `managed-settings.json: strictPluginOnlyCustomization has ${$.length} value(s) this client doesn't recognize: ${$.map(String).join(", ")}`,
                    fix: `These are silently ignored (forwards-compat). Known surfaces for this version: ${YG6.join(", ")}. Either remove them, or this client is older than the managed-settings intended.`
                })
            }
    } catch {}
    let _ = H8();
    if (q === "development") return K;
    if (q === "native") {
        let O = (process.env.PATH || "").split(nrz),
            w = wX6(),
            $ = LF(w, ".local", "bin"),
            j = $;
        if (y1() === "windows") j = $.split(oq8.sep).join(rq8.sep);
        if (!O.some((J) => {
                let X = J;
                if (y1() === "windows") X = J.split(oq8.sep).join(rq8.sep);
                let M = X.replace(/\/+$/, ""),
                    P = J.replace(/[/\\]+$/, "");
                return M === j || P === "~/.local/bin" || P === "$HOME/.local/bin"
            }))
            if (y1() === "windows") {
                let X = $.split(rq8.sep).join(oq8.sep);
                K.push({
                    issue: `Native installation exists but ${X} is not in your PATH`,
                    fix: "Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal."
                })
            } else {
                let X = nS6(),
                    P = c36()[X],
                    W = P ? P.replace(wX6(), "~") : "your shell config file";
                K.push({
                    issue: "Native installation exists but ~/.local/bin is not in your PATH",
                    fix: `Run: echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${W} then open a new terminal or run: source ${W}`
                })
            }
    }
    if (!S6(process.env.DISABLE_INSTALLATION_CHECKS)) {
        if (q === "npm-local" && _.installMethod !== "local") K.push({
            issue: `Running from local installation but config install method is '${_.installMethod??"not set"}'`,
            fix: "Consider using native installation: claude install"
        });
        if (q === "native" && _.installMethod !== "native") K.push({
            issue: `Running native installation but config install method is '${_.installMethod??"not set"}'`,
            fix: "Run claude install to update configuration"
        })
    }
    if (q === "npm-global" && await AX6()) K.push({
        issue: "Local installation exists but not being used",
        fix: "Consider using native installation: claude install"
    });
    let z = await N87(),
        Y = await x9K();
    if (q === "npm-local") {
        if (!await oA("claude") && !Y)
            if (z) K.push({
                issue: "Local installation not accessible",
                fix: `Alias exists but points to invalid target: ${z}. Update alias: alias claude="~/.claude/local/claude"`
            });
            else K.push({
                issue: "Local installation not accessible",
                fix: 'Create alias: alias claude="~/.claude/local/claude"'
            })
    }
    return K
}
// @from(Ln 325969, Col 0)
async function trz() {
    if (process.platform !== "darwin") return null;
    let q = "Claude Code-doctor-probe",
        K = _B(),
        _ = Buffer.from("probe", "utf-8").toString("hex"),
        z = `add-generic-password -U -a "${K}" -s "${q}" -X "${_}"
`,
        Y = await Xh("security", ["-i"], {
            input: z,
            reject: !1,
            timeout: 5000
        });
    if (Y.exitCode === 0) return Xh("security", ["delete-generic-password", "-a", K, "-s", q], {
        reject: !1,
        timeout: 5000
    }), null;
    let A = (Y.stderr || Y.stdout || "").trim().replace(/\s*\n\s*/g, "; ");
    return {
        issue: `macOS Keychain is not writable${A?` (${A})`:""}. Console login will fail to save your API key.`,
        fix: "Run: security unlock-keychain ~/Library/Keychains/login.keychain-db — if that doesn't fix it, your login keychain password may be out of sync with your account password: open Keychain Access, select the 'login' keychain, then Edit → Change Password for Keychain 'login'."
    }
}
// @from(Ln 325992, Col 0)
function erz() {
    if (y1() !== "linux") return [];
    let q = [],
        K = Z7.getLinuxGlobPatternWarnings();
    if (K.length > 0) {
        let _ = K.slice(0, 3).join(", "),
            z = K.length - 3,
            Y = z > 0 ? `${_} (${z} more)` : _;
        q.push({
            issue: "Glob patterns in sandbox permission rules are not fully supported on Linux",
            fix: `Found ${K.length} pattern(s): ${Y}. On Linux, glob patterns in Edit/Read rules will be ignored.`
        })
    }
    return q
}
// @from(Ln 326007, Col 0)
async function $X6({
    probeKeychain: q = !1
} = {}) {
    let K = await Rt(),
        _ = {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION ? {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION : "unknown",
        z = await rrz(),
        Y = orz(),
        A = await arz(),
        O = await srz(K);
    if (O.push(...erz()), q) {
        let P = await trz();
        if (P) O.push(P)
    }
    if (K === "native") {
        let P = A.filter((D) => D.type === "npm-global" || D.type === "npm-global-orphan" || D.type === "npm-local"),
            W = y1() === "windows";
        for (let D of P)
            if (D.type === "npm-global") {
                let Z = "npm -g uninstall @anthropic-ai/claude-code";
                if ({
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.112",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-04-16T18:33:19Z"
                    }.PACKAGE_URL && {
                        ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                        PACKAGE_URL: "@anthropic-ai/claude-code",
                        README_URL: "https://code.claude.com/docs/en/overview",
                        VERSION: "2.1.112",
                        FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                        BUILD_TIME: "2026-04-16T18:33:19Z"
                    }.PACKAGE_URL !== "@anthropic-ai/claude-code") Z += ` && npm -g uninstall ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.PACKAGE_URL}`;
                O.push({
                    issue: `Leftover npm global installation at ${D.path}`,
                    fix: `Run: ${Z}`
                })
            } else if (D.type === "npm-global-orphan") O.push({
            issue: `Orphaned npm global package at ${D.path}`,
            fix: W ? `Run: rmdir /s /q "${D.path}"` : `Run: rm -rf ${D.path}`
        });
        else if (D.type === "npm-local") O.push({
            issue: `Leftover npm local installation at ${D.path}`,
            fix: W ? `Run: rmdir /s /q "${D.path}"` : `Run: rm -rf ${D.path}`
        })
    }
    let $ = H8().installMethod || "not set",
        j = null;
    if (K === "npm-global") {
        if (j = (await U9K()).hasPermissions, !j && !j$6()) O.push({
            issue: "Insufficient permissions for auto-updates",
            fix: "Do one of: (1) Re-install node without sudo, or (2) Use `claude install` for native installation"
        })
    }
    let H = aH4(),
        J = {
            working: H.working ?? !0,
            mode: H.mode,
            systemPath: H.mode === "system" ? H.path : null
        },
        X = K === "package-manager" ? await oS6() : void 0;
    return {
        installationType: K,
        version: _,
        installationPath: z,
        invokedBinary: Y,
        configInstallMethod: $,
        autoUpdates: (() => {
            let P = j$6();
            return P ? `disabled (${eo6(P)})` : "enabled"
        })(),
        hasUpdatePermissions: j,
        multipleInstallations: A,
        warnings: O,
        packageManager: X,
        ripgrepStatus: J
    }
}
// @from(Ln 326100, Col 4)
n36 = L(() => {
    ht();
    h1();
    n7();
    Q8();
    Q4();
    Yq();
    OX6();
    Zp8();
    NK();
    BI();
    NV();
    yY();
    r76();
    Rm();
    Th();
    Xp8();
    e8();
    n0()
})
// @from(Ln 326127, Col 0)
function Gp8(q) {
    return {
        env: q?.env ?? process.env,
        home: q?.homedir ?? process.env.HOME ?? qoz()
    }
}
// @from(Ln 326134, Col 0)
function vp8(q) {
    let {
        env: K,
        home: _
    } = Gp8(q);
    return K.XDG_STATE_HOME ?? fp8(_, ".local", "state")
}
// @from(Ln 326142, Col 0)
function l9K(q) {
    let {
        env: K,
        home: _
    } = Gp8(q);
    return K.XDG_CACHE_HOME ?? fp8(_, ".cache")
}
// @from(Ln 326150, Col 0)
function aS6(q) {
    let {
        env: K,
        home: _
    } = Gp8(q);
    return K.XDG_DATA_HOME ?? fp8(_, ".local", "share")
}
// @from(Ln 326158, Col 0)
function sS6(q) {
    let {
        home: K
    } = Gp8(q);
    return fp8(K, ".local", "bin")
}
// @from(Ln 326164, Col 4)
aq8 = () => {}
// @from(Ln 326175, Col 0)
async function Ooz(q = "latest", K, _) {
    let z = Date.now();
    try {
        let Y = await Z1.get(`${K}/${q}`, {
                timeout: 30000,
                responseType: "text",
                ..._
            }),
            A = Date.now() - z;
        return d("tengu_version_check_success", {
            latency_ms: A
        }), Y.data.trim()
    } catch (Y) {
        let A = Date.now() - z,
            O = Y instanceof Error ? Y.message : String(Y),
            w;
        if (Z1.isAxiosError(Y) && Y.response) w = Y.response.status;
        d("tengu_version_check_failure", {
            latency_ms: A,
            http_status: w,
            is_timeout: O.includes("timeout")
        });
        let $ = Error(`Failed to fetch version from ${K}/${q}: ${O}`);
        throw j6($), $
    }
}
// @from(Ln 326201, Col 0)
async function Tp8(q) {
    if (/^v?\d+\.\d+\.\d+(-\S+)?$/.test(q)) {
        let _ = q.startsWith("v") ? q.slice(1) : q;
        if (/^99\.99\./.test(_)) throw Error(`Version ${_} is not available for installation. Use 'stable' or 'latest'.`);
        return _
    }
    let K = q;
    if (K !== "stable" && K !== "latest" && K !== "rc") throw Error(`Invalid channel: ${q}. Use 'latest' or 'stable'`);
    if (K === "rc") throw Error(`Invalid channel: ${q}. Use 'stable' or 'latest'`);
    return Ooz(K, n9K)
}
// @from(Ln 326213, Col 0)
function $oz() {
    return Number(process.env.CLAUDE_CODE_STALL_TIMEOUT_MS_FOR_TESTING) || woz
}
// @from(Ln 326216, Col 0)
async function joz(q, K, _, z = {}) {
    let Y;
    for (let A = 1; A <= b87; A++) {
        let O = new AbortController,
            w, $ = () => {
                if (w) clearTimeout(w), w = void 0
            },
            j = () => {
                $(), w = setTimeout((H) => H.abort(), $oz(), O)
            };
        try {
            j();
            let H = await Z1.get(q, {
                timeout: 300000,
                responseType: "arraybuffer",
                signal: O.signal,
                onDownloadProgress: () => {
                    j()
                },
                ...z
            });
            $();
            let J = _oz("sha256");
            J.update(H.data);
            let X = J.digest("hex");
            if (X !== K) throw Error(`Checksum mismatch: expected ${K}, got ${X}`);
            await Yoz(_, Buffer.from(H.data)), await zoz(_, 493);
            return
        } catch (H) {
            $();
            let J = Z1.isCancel(H);
            if (J) Y = new i9K;
            else Y = r1(H);
            if (J && A < b87) {
                E(`Download stalled on attempt ${A}/${b87}, retrying...`), await l7(1000);
                continue
            }
            throw Y
        }
    }
    throw Y ?? Error("Download failed after all retries")
}
// @from(Ln 326258, Col 0)
async function Hoz(q, K, _, z) {
    let Y = V8();
    await Y.rm(K, {
        recursive: !0,
        force: !0
    });
    let A = Vl(),
        O = Date.now();
    d("tengu_binary_download_attempt", {});
    let w;
    try {
        w = (await Z1.get(`${_}/${q}/manifest.json`, {
            timeout: 1e4,
            responseType: "json",
            ...z
        })).data
    } catch (M) {
        let P = Date.now() - O,
            W = M instanceof Error ? M.message : String(M),
            D;
        if (Z1.isAxiosError(M) && M.response) D = M.response.status;
        throw d("tengu_binary_manifest_fetch_failure", {
            latency_ms: P,
            http_status: D,
            is_timeout: W.includes("timeout")
        }), j6(Error(`Failed to fetch manifest from ${_}/${q}/manifest.json: ${W}`)), M
    }
    let $ = w.platforms[A];
    if (!$) throw d("tengu_binary_platform_not_found", {}), Error(`Platform ${A} not found in manifest for version ${q}`);
    let j = $.checksum,
        H = Vp8(A),
        J = `${_}/${q}/${A}/${H}`;
    await Y.mkdir(K);
    let X = Aoz(K, H);
    try {
        await joz(J, j, X, z || {});
        let M = Date.now() - O;
        d("tengu_binary_download_success", {
            latency_ms: M
        })
    } catch (M) {
        let P = Date.now() - O,
            W = M instanceof Error ? M.message : String(M),
            D;
        if (Z1.isAxiosError(M) && M.response) D = M.response.status;
        throw d("tengu_binary_download_failure", {
            latency_ms: P,
            http_status: D,
            is_timeout: W.includes("timeout"),
            is_checksum_mismatch: W.includes("Checksum mismatch")
        }), j6(Error(`Failed to download binary from ${J}: ${W}`)), M
    }
}
// @from(Ln 326311, Col 0)
async function r9K(q, K) {
    return await Hoz(q, K, n9K), "binary"
}
// @from(Ln 326314, Col 4)
n9K = "https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases"
// @from(Ln 326315, Col 4)
woz = 60000
// @from(Ln 326316, Col 4)
b87 = 3
// @from(Ln 326317, Col 4)
i9K
// @from(Ln 326318, Col 4)
I87 = L(() => {
    CK();
    C8();
    K8();
    m8();
    Q4();
    Yq();
    U8();
    e8();
    x87();
    i9K = class i9K extends Error {
        constructor() {
            super("Download stalled: no data received for 60 seconds");
            this.name = "StallTimeoutError"
        }
    }
})
// @from(Ln 326340, Col 0)
function i36() {
    return !c5(void 0)
}
// @from(Ln 326344, Col 0)
function kp8(q) {
    if (q <= 1) return !1;
    try {
        return process.kill(q, 0), !0
    } catch {
        return !1
    }
}
// @from(Ln 326353, Col 0)
function Moz(q, K) {
    if (!kp8(q)) return !1;
    if (q === process.pid) return !0;
    try {
        let _ = FZq(q);
        if (!_) return !0;
        let z = _.toLowerCase(),
            Y = K.toLowerCase();
        return z.includes("claude") || z.includes(Y)
    } catch {
        return !0
    }
}
// @from(Ln 326367, Col 0)
function jX6(q) {
    let K = V8();
    try {
        let _ = K.readFileSync(q, {
            encoding: "utf8"
        });
        if (!_ || _.trim() === "") return null;
        let z = n8(_);
        if (typeof z.pid !== "number" || !z.version || !z.execPath) return null;
        return z
    } catch {
        return null
    }
}
// @from(Ln 326382, Col 0)
function sq8(q) {
    let K = jX6(q);
    if (!K) return !1;
    let {
        pid: _,
        execPath: z
    } = K;
    if (!kp8(_)) return !1;
    if (!Moz(_, z)) return E(`Lock PID ${_} is running but does not appear to be Claude - treating as stale`), !1;
    let Y = V8();
    try {
        let A = Y.statSync(q);
        if (Date.now() - A.mtimeMs > Xoz) {
            if (!kp8(_)) return !1
        }
    } catch {}
    return !0
}
// @from(Ln 326401, Col 0)
function Poz(q, K) {
    let _ = V8(),
        z = `${q}.tmp.${process.pid}.${Date.now()}`;
    try {
        aJ(z, I6(K, null, 2), {
            encoding: "utf8",
            flush: !0
        }), _.renameSync(z, q)
    } catch (Y) {
        try {
            _.unlinkSync(z)
        } catch {}
        throw Y
    }
}
// @from(Ln 326416, Col 0)
async function a9K(q, K) {
    let _ = V8(),
        z = Joz(q);
    if (sq8(K)) {
        let A = jX6(K);
        return E(`Cannot acquire lock for ${z} - held by PID ${A?.pid}`), null
    }
    let Y = {
        pid: process.pid,
        version: z,
        execPath: process.execPath,
        acquiredAt: Date.now()
    };
    try {
        if (Poz(K, Y), jX6(K)?.pid !== process.pid) return null;
        return E(`Acquired PID lock for ${z} (PID ${process.pid})`), () => {
            try {
                if (jX6(K)?.pid === process.pid) _.unlinkSync(K), E(`Released PID lock for ${z}`)
            } catch (O) {
                E(`Failed to release lock for ${z}: ${O}`)
            }
        }
    } catch (A) {
        return E(`Failed to acquire lock for ${z}: ${A}`), null
    }
}
// @from(Ln 326442, Col 0)
async function s9K(q, K) {
    let _ = await a9K(q, K);
    if (!_) return !1;
    let z = () => {
        try {
            _()
        } catch {}
    };
    return process.on("exit", z), process.on("SIGINT", z), process.on("SIGTERM", z), !0
}
// @from(Ln 326452, Col 0)
async function t9K(q, K, _) {
    let z = await a9K(q, K);
    if (!z) return !1;
    try {
        return await _(), !0
    } finally {
        z()
    }
}
// @from(Ln 326462, Col 0)
function e9K(q) {
    let K = V8(),
        _ = [];
    try {
        let z = K.readdirStringSync(q).filter((Y) => Y.endsWith(".lock"));
        for (let Y of z) {
            let A = o9K(q, Y),
                O = jX6(A);
            if (O) _.push({
                version: O.version,
                pid: O.pid,
                isProcessRunning: kp8(O.pid),
                execPath: O.execPath,
                acquiredAt: new Date(O.acquiredAt),
                lockFilePath: A
            })
        }
    } catch (z) {
        if (t1(z)) return _;
        j6(r1(z))
    }
    return _
}
// @from(Ln 326486, Col 0)
function Np8(q) {
    let K = V8(),
        _ = 0;
    try {
        let z = K.readdirStringSync(q).filter((Y) => Y.endsWith(".lock"));
        for (let Y of z) {
            let A = o9K(q, Y);
            try {
                if (K.lstatSync(A).isDirectory()) K.rmSync(A, {
                    recursive: !0,
                    force: !0
                }), _++, E(`Cleaned up legacy directory lock: ${Y}`);
                else if (!sq8(A)) K.unlinkSync(A), _++, E(`Cleaned up stale lock: ${Y}`)
            } catch {}
        }
    } catch (z) {
        if (t1(z)) return 0;
        j6(r1(z))
    }
    return _
}
// @from(Ln 326507, Col 4)
Xoz = 7200000
// @from(Ln 326508, Col 4)
u87 = L(() => {
    K8();
    Q8();
    m8();
    Yq();
    Ow6();
    U8();
    e8()
})
// @from(Ln 326550, Col 0)
function Vl() {
    let q = X7.platform,
        K = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : null;
    if (!K) {
        let _ = Error(`Unsupported architecture: ${process.arch}`);
        throw E(`Native installer does not support architecture: ${process.arch}`, {
            level: "error"
        }), _
    }
    if (Eoz) K = "arm64";
    if (q === "linux" && UE.isMuslEnvironment()) return `linux-${K}-musl`;
    return `${q}-${K}`
}
// @from(Ln 326564, Col 0)
function Vp8(q) {
    return q.startsWith("win32") ? "claude.exe" : "claude"
}
// @from(Ln 326568, Col 0)
function Nl() {
    let q = Vl(),
        K = Vp8(q);
    return {
        versions: eP(aS6(), "claude", "versions"),
        staging: eP(l9K(), "claude", "staging"),
        locks: eP(vp8(), "claude", "locks"),
        executable: eP(sS6(), K)
    }
}
// @from(Ln 326578, Col 0)
async function JX6(q) {
    try {
        let K = await kl(q);
        if (!K.isFile() || K.size === 0) return !1;
        if (process.platform === "win32") return !0;
        return (K.mode & Doz.S_IXUSR) !== 0
    } catch {
        return !1
    }
}
// @from(Ln 326588, Col 0)
async function F87(q) {
    let K = Nl(),
        _ = [K.versions, K.staging, K.locks];
    await Promise.all(_.map((A) => XX6(A, {
        recursive: !0
    })));
    let z = r36(K.executable);
    await XX6(z, {
        recursive: !0
    });
    let Y = eP(K.versions, q);
    try {
        await Voz(Y, "", {
            encoding: "utf8",
            flag: "wx"
        })
    } catch (A) {
        if (Q1(A) !== "EEXIST") throw A
    }
    return {
        stagingPath: eP(K.staging, q),
        installPath: Y
    }
}
// @from(Ln 326612, Col 0)
async function O_K(q, K, _ = 0) {
    let z = Nl(),
        Y = tq8(z, q);
    if (await XX6(z.locks, {
            recursive: !0
        }), i36()) {
        let O = 0,
            w = _ + 1,
            $ = _ > 0 ? 1000 : 100,
            j = _ > 0 ? 5000 : 500;
        while (O < w) {
            if (await t9K(q, Y, async () => {
                    try {
                        await K()
                    } catch (J) {
                        throw j6(J), J
                    }
                })) return d("tengu_version_lock_acquired", {
                is_pid_based: !0,
                is_lifetime_lock: !1,
                attempts: O + 1
            }), !0;
            if (O++, O < w) {
                let J = Math.min($ * Math.pow(2, O - 1), j);
                await l7(J)
            }
        }
        return d("tengu_version_lock_failed", {
            is_pid_based: !0,
            is_lifetime_lock: !1,
            attempts: w
        }), hp8(q, Error("Lock held by another process")), !1
    }
    let A = null;
    try {
        try {
            A = await Jj(q, {
                stale: p87,
                retries: {
                    retries: _,
                    minTimeout: _ > 0 ? 1000 : 100,
                    maxTimeout: _ > 0 ? 5000 : 500
                },
                lockfilePath: Y,
                onCompromised: (O) => {
                    E(`NON-FATAL: Version lock was compromised during operation: ${O.message}`, {
                        level: "info"
                    })
                }
            })
        } catch (O) {
            return d("tengu_version_lock_failed", {
                is_pid_based: !1,
                is_lifetime_lock: !1
            }), hp8(q, O), !1
        }
        try {
            return await K(), d("tengu_version_lock_acquired", {
                is_pid_based: !1,
                is_lifetime_lock: !1
            }), !0
        } catch (O) {
            throw j6(O), O
        }
    } finally {
        if (A) await A()
    }
}
// @from(Ln 326680, Col 0)
async function w_K(q, K) {
    await XX6(r36(K), {
        recursive: !0
    });
    let _ = `${K}.tmp.${process.pid}.${Date.now()}`;
    try {
        await B87(q, _), await foz(_, 493), await Lp8(_, K), E(`Atomically installed binary to ${K}`)
    } catch (z) {
        try {
            await St(_)
        } catch {}
        throw z
    }
}
// @from(Ln 326694, Col 0)
async function yoz(q, K) {
    try {
        let _ = eP(q, "node_modules", "@anthropic-ai"),
            Y = (await yp8(_)).find((O) => O.startsWith("claude-cli-native-"));
        if (!Y) throw d("tengu_native_install_package_failure", {
            stage_find_package: !0,
            error_package_not_found: !0
        }), Error("Could not find platform-specific native package");
        let A = eP(_, Y, "cli");
        try {
            await kl(A)
        } catch {
            throw d("tengu_native_install_package_failure", {
                stage_binary_exists: !0,
                error_binary_not_found: !0
            }), Error("Native binary not found in staged package")
        }
        await w_K(A, K), await Rp8(q, {
            recursive: !0,
            force: !0
        }), d("tengu_native_install_package_success", {})
    } catch (_) {
        let z = b6(_);
        if (!z.includes("Could not find platform-specific") && !z.includes("Native binary not found")) d("tengu_native_install_package_failure", {
            stage_atomic_move: !0,
            error_move_failed: !0
        });
        throw j6(r1(_)), _
    }
}
// @from(Ln 326724, Col 0)
async function Loz(q, K) {
    try {
        let _ = Vl(),
            z = Vp8(_),
            Y = eP(q, z);
        try {
            await kl(Y)
        } catch {
            throw d("tengu_native_install_binary_failure", {
                stage_binary_exists: !0,
                error_binary_not_found: !0
            }), Error("Staged binary not found")
        }
        await w_K(Y, K), await Rp8(q, {
            recursive: !0,
            force: !0
        }), d("tengu_native_install_binary_success", {})
    } catch (_) {
        if (!b6(_).includes("Staged binary not found")) d("tengu_native_install_binary_failure", {
            stage_atomic_move: !0,
            error_move_failed: !0
        });
        throw j6(r1(_)), _
    }
}
// @from(Ln 326749, Col 0)
async function hoz(q, K, _) {
    if (_ === "npm") await yoz(q, K);
    else await Loz(q, K)
}
// @from(Ln 326753, Col 0)
async function q_K(q, K) {
    let {
        stagingPath: _,
        installPath: z
    } = await F87(q), {
        executable: Y
    } = Nl(), A = S6("true") ? `${_}.${process.pid}.${Date.now()}` : _, O = !await $_K(q) || K;
    if (O) {
        E(K ? `Force reinstalling native installer version ${q}` : `Downloading native installer version ${q}`);
        let $ = await r9K(q, A);
        await hoz(A, z, $)
    } else E(`Version ${q} already installed, updating symlink`);
    if (await Coz(Y), !await boz(Y, z) && !await JX6(Y)) {
        let $ = !1;
        try {
            await kl(z), $ = !0
        } catch {}
        throw Error(`Failed to create executable at ${Y}. Source file exists: ${$}. Check write permissions to ${Y}.`)
    }
    return O
}
// @from(Ln 326774, Col 0)
async function $_K(q) {
    let {
        installPath: K
    } = await F87(q);
    return JX6(K)
}
// @from(Ln 326781, Col 0)
function Roz() {
    try {
        let q = u8("tengu_canary", {});
        return typeof q.external === "string" && A_K.valid(q.external) || null
    } catch (q) {
        return E(`getCanaryVersion: GB read failed, falling through: ${b6(q)}`), null
    }
}
// @from(Ln 326789, Col 0)
async function Soz(q, K = !1) {
    let _ = Date.now(),
        z = await Tp8(q),
        {
            executable: Y
        } = Nl();
    E(`Checking for native installer update to version ${z}`);
    let A = await l36(),
        O = !/^v?\d+\.\d+\.\d+(-\S+)?$/.test(q);
    if (q === "latest") {
        let j = Roz(),
            H = j && A && RP(j, A);
        if (j && RP(j, z) && !H) E(`Native installer: canary ${j} active, overriding ${z}`), z = j;
        else if (H) E(`Native installer: canary ${j} exceeds maxVersion ${A}, not applying`)
    }
    if (!K) {
        if (A && RP(z, A)) {
            if (E(`Native installer: maxVersion ${A} is set, capping update from ${z} to ${A}`), QW({
                    ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
                    PACKAGE_URL: "@anthropic-ai/claude-code",
                    README_URL: "https://code.claude.com/docs/en/overview",
                    VERSION: "2.1.112",
                    FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
                    BUILD_TIME: "2026-04-16T18:33:19Z"
                }.VERSION, A)) return E(`Native installer: current version ${{ISSUES_EXPLAINER:"report the issue at https://github.com/anthropics/claude-code/issues",PACKAGE_URL:"@anthropic-ai/claude-code",README_URL:"https://code.claude.com/docs/en/overview",VERSION:"2.1.112",FEEDBACK_CHANNEL:"https://github.com/anthropics/claude-code/issues",BUILD_TIME:"2026-04-16T18:33:19Z"}.VERSION} is already at or above maxVersion ${A}, skipping update`), d("tengu_native_update_skipped_max_version", {
                latency_ms: Date.now() - _,
                max_version: A,
                available_version: z
            }), {
                success: !0,
                wasSkipped: !0,
                latestVersion: z
            };
            z = A
        }
    }
    if (!K && z === {
            ISSUES_EXPLAINER: "report the issue at https://github.com/anthropics/claude-code/issues",
            PACKAGE_URL: "@anthropic-ai/claude-code",
            README_URL: "https://code.claude.com/docs/en/overview",
            VERSION: "2.1.112",
            FEEDBACK_CHANNEL: "https://github.com/anthropics/claude-code/issues",
            BUILD_TIME: "2026-04-16T18:33:19Z"
        }.VERSION && await $_K(z) && await JX6(Y)) return E(`Found ${z} at ${Y}, skipping install`), d("tengu_native_update_complete", {
        latency_ms: Date.now() - _,
        was_new_install: !1,
        was_force_reinstall: !1,
        was_already_running: !0
    }), {
        success: !0,
        wasSkipped: !0,
        latestVersion: z
    };
    if (!K && Lt(z)) return d("tengu_native_update_skipped_minimum_version", {
        latency_ms: Date.now() - _,
        target_version: z
    }), {
        success: !0,
        wasSkipped: !0,
        latestVersion: z
    };
    let w = !1,
        $;
    if (S6("true")) w = await q_K(z, K), $ = Date.now() - _;
    else {
        let {
            installPath: j
        } = await F87(z);
        if (K) await xoz(j);
        let H = await O_K(j, async () => {
            w = await q_K(z, K)
        }, 3);
        if ($ = Date.now() - _, !H) {
            let J = Nl(),
                X;
            if (i36()) {
                let M = tq8(J, j);
                if (sq8(M)) X = jX6(M)?.pid
            }
            return d("tengu_native_update_lock_failed", {
                latency_ms: $,
                lock_holder_pid: X
            }), {
                success: !1,
                latestVersion: z,
                lockFailed: !0,
                lockHolderPid: X
            }
        }
    }
    return d("tengu_native_update_complete", {
        latency_ms: $,
        was_new_install: w,
        was_force_reinstall: K
    }), E(`Successfully updated to version ${z}`), {
        success: !0,
        latestVersion: z
    }
}
// @from(Ln 326888, Col 0)
async function Coz(q) {
    try {
        await voz(q), E(`Removed empty directory at ${q}`)
    } catch (K) {
        let _ = Q1(K);
        if (_ !== "ENOTDIR" && _ !== "ENOENT" && _ !== "ENOTEMPTY") E(`Could not remove directory at ${q}: ${K}`)
    }
}
// @from(Ln 326896, Col 0)
async function boz(q, K) {
    if (Vl().startsWith("win32")) try {
        let O = r36(q);
        await XX6(O, {
            recursive: !0
        });
        let w;
        try {
            w = await kl(q)
        } catch {}
        if (w) {
            try {
                let j = await kl(K);
                if (w.size === j.size) return !1
            } catch {}
            let $ = `${q}.old.${Date.now()}`;
            await Lp8(q, $);
            try {
                await B87(K, q);
                try {
                    await St($)
                } catch {}
            } catch (j) {
                try {
                    await Lp8($, q)
                } catch (H) {
                    let J = Error(`Failed to restore old executable: ${H}`, {
                        cause: j
                    });
                    throw j6(J), J
                }
                throw j
            }
        } else try {
            await B87(K, q)
        } catch ($) {
            if (t1($)) throw Error(`Source file does not exist: ${K}`);
            throw $
        }
        return !0
    } catch (O) {
        return j6(Error(`Failed to copy executable from ${K} to ${q}: ${O}`)), !1
    }
    let Y = r36(q);
    try {
        await XX6(Y, {
            recursive: !0
        }), E(`Created directory ${Y} for symlink`)
    } catch (O) {
        return j6(Error(`Failed to create directory ${Y}: ${O}`)), !1
    }
    let A = `${q}.tmp.${process.pid}.${Date.now()}`;
    try {
        return await Toz(K, A), await Lp8(A, q), E(`Atomically updated symlink ${q} -> ${K}`), !0
    } catch (O) {
        try {
            await St(A)
        } catch {}
        return j6(Error(`Failed to create symlink from ${q} to ${K}: ${O}`)), !1
    }
}
// @from(Ln 326957, Col 0)
async function MX6(q = !1) {
    if (S6(process.env.DISABLE_INSTALLATION_CHECKS)) return [];
    let K = await Rt();
    if (K === "development") return [];
    let _ = H8();
    if (!(q || K === "native" || _.installMethod === "native")) return [];
    let Y = Nl(),
        A = [],
        O = r36(Y.executable),
        w = HX6(O),
        j = Vl().startsWith("win32");
    try {
        await Zoz(O)
    } catch {
        A.push({
            message: `installMethod is native, but directory ${O} does not exist`,
            userActionRequired: !0,
            type: "error"
        })
    }
    if (j) {
        if (!await JX6(Y.executable)) A.push({
            message: `installMethod is native, but claude command is missing or invalid at ${Y.executable}`,
            userActionRequired: !0,
            type: "error"
        })
    } else try {
        let J = await z_K(Y.executable),
            X = HX6(r36(Y.executable), J);
        if (!await JX6(X)) A.push({
            message: `Claude symlink points to missing or invalid binary: ${J}`,
            userActionRequired: !0,
            type: "error"
        })
    } catch (J) {
        if (t1(J)) A.push({
            message: `installMethod is native, but claude command not found at ${Y.executable}`,
            userActionRequired: !0,
            type: "error"
        });
        else if (!await JX6(Y.executable)) A.push({
            message: `${Y.executable} exists but is not a valid Claude binary`,
            userActionRequired: !0,
            type: "error"
        })
    }
    if (!(process.env.PATH || "").split(Noz).some((J) => {
            try {
                let X = HX6(J);
                if (j) return X.toLowerCase() === w.toLowerCase();
                return X === w
            } catch {
                return !1
            }
        }))
        if (j) {
            let J = O.replaceAll("/", "\\");
            A.push({
                message: `Native installation exists but ${J} is not in your PATH. Add it by opening: System Properties → Environment Variables → Edit User PATH → New → Add the path above. Then restart your terminal.`,
                userActionRequired: !0,
                type: "path"
            })
        } else {
            let J = nS6(),
                M = c36()[J],
                P = M ? M.replace(Y_K(), "~") : "your shell config file";
            A.push({
                message: `Native installation exists but ~/.local/bin is not in your PATH. Run:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${P} && source ${P}`,
                userActionRequired: !0,
                type: "path"
            })
        } return A
}
// @from(Ln 327033, Col 0)
function PX6(q, K = !1) {
    if (K) return K_K(q, K);
    if (Ep8) return E("installLatest: joining in-flight call"), Ep8;
    let _ = K_K(q, K);
    Ep8 = _;
    let z = () => {
        Ep8 = null
    };
    return _.then(z, z), _
}
// @from(Ln 327043, Col 0)
async function K_K(q, K = !1) {
    let _ = await Soz(q, K);
    if (!_.success) return {
        latestVersion: null,
        wasUpdated: !1,
        lockFailed: _.lockFailed,
        lockHolderPid: _.lockHolderPid
    };
    if (H8().installMethod !== "native") d8((Y) => ({
        ...Y,
        installMethod: "native",
        autoUpdates: !1,
        autoUpdatesProtectedForNative: !0
    })), E('Native installer: Set installMethod to "native" and disabled legacy auto-updater for protection');
    return eq8(), {
        latestVersion: _.latestVersion,
        wasUpdated: _.success && !_.wasSkipped,
        wasSkipped: _.wasSkipped,
        lockFailed: !1
    }
}
// @from(Ln 327064, Col 0)
async function Ioz(q) {
    try {
        let K = await z_K(q),
            _ = HX6(r36(q), K);
        if (await JX6(_)) return _
    } catch {}
    return null
}
// @from(Ln 327073, Col 0)
function tq8(q, K) {
    let _ = koz(K);
    return eP(q.locks, `${_}.lock`)
}