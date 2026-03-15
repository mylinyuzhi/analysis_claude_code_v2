
// @from(Ln 302202, Col 4)
qb4 = x((VS8) => {
    Object.defineProperty(VS8, "__esModule", {
        value: !0
    });
    VS8.OTLPTraceExporter = void 0;
    var D2Y = Ab4();
    Object.defineProperty(VS8, "OTLPTraceExporter", {
        enumerable: !0,
        get: function() {
            return D2Y.OTLPTraceExporter
        }
    })
})
// @from(Ln 302215, Col 0)
class kS8 {
    error(A, ...q) {
        _6(Error(A)), k(`[3P telemetry] OTEL diag error: ${A}`, {
            level: "error"
        })
    }
    warn(A, ...q) {
        _6(Error(A)), k(`[3P telemetry] OTEL diag warn: ${A}`, {
            level: "warn"
        })
    }
    info(A, ...q) {
        return
    }
    debug(A, ...q) {
        return
    }
    verbose(A, ...q) {
        return
    }
}
// @from(Ln 302236, Col 4)
Kb4 = E(() => {
    k1();
    H1()
})
// @from(Ln 302240, Col 0)
async function Yb4() {
    let A = QO();
    if (A.error) throw Error(`Auth error: ${A.error}`);
    let q = {
            "Content-Type": "application/json",
            "User-Agent": pO(),
            ...A.headers
        },
        K = "https://api.anthropic.com/api/claude_code/organizations/metrics_enabled";
    return (await X8.get(K, {
        headers: q,
        timeout: 5000
    })).data
}
// @from(Ln 302254, Col 0)
async function W2Y() {
    if (process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC) return {
        enabled: !1,
        hasError: !1
    };
    try {
        let A;
        try {
            A = await Yb4()
        } catch (q) {
            if (X8.isAxiosError(q) && (q.response?.status === 401 || q.response?.status === 403 && typeof q.response?.data === "string" && q.response.data.includes("OAuth token has been revoked"))) {
                let Y = sA()?.accessToken;
                if (Y) await DG(Y), A = await Yb4();
                else throw q
            } else throw q
        }
        return k(`Metrics opt-out API response: enabled=${A.metrics_logging_enabled}`), {
            enabled: A.metrics_logging_enabled,
            hasError: !1
        }
    } catch (A) {
        return k(`Failed to check metrics opt-out status: ${_1(A)}`), _6(A), {
            enabled: !1,
            hasError: !0
        }
    }
}
// @from(Ln 302281, Col 0)
async function zb4() {
    let A = await Z2Y();
    if (A.hasError) return A;
    let q = X1().metricsStatusCache;
    if (q !== void 0 && q.enabled === A.enabled && Date.now() - q.timestamp < _b4) return A;
    return d1((Y) => ({
        ...Y,
        metricsStatusCache: {
            enabled: A.enabled,
            timestamp: Date.now()
        }
    })), A
}
// @from(Ln 302294, Col 0)
async function wb4() {
    if (iA() && !XG()) return {
        enabled: !1,
        hasError: !1
    };
    let A = X1().metricsStatusCache;
    if (A) {
        if (Date.now() - A.timestamp > _b4) zb4().catch(_6);
        return {
            enabled: A.enabled,
            hasError: !1
        }
    }
    return zb4()
}
// @from(Ln 302309, Col 4)
P2Y = 3600000
// @from(Ln 302310, Col 4)
_b4 = 86400000
// @from(Ln 302311, Col 4)
Z2Y
// @from(Ln 302312, Col 4)
Ob4 = E(() => {
    kK();
    Up();
    RM();
    H1();
    k1();
    fA();
    s8();
    k8();
    Z2Y = WjA(W2Y, P2Y)
})
// @from(Ln 302323, Col 0)
class yS8 {
    endpoint;
    timeout;
    pendingExports = [];
    isShutdown = !1;
    constructor(A = {}) {
        this.endpoint = "https://api.anthropic.com/api/claude_code/metrics", this.timeout = A.timeout || 5000
    }
    async export (A, q) {
        if (this.isShutdown) {
            q({
                code: HY6.ExportResultCode.FAILED,
                error: Error("Exporter has been shutdown")
            });
            return
        }
        let K = this.doExport(A, q);
        this.pendingExports.push(K), K.finally(() => {
            let Y = this.pendingExports.indexOf(K);
            if (Y > -1) this.pendingExports.splice(Y, 1)
        })
    }
    async doExport(A, q) {
        try {
            if (!(l_() || q7())) {
                k("BigQuery metrics export: trust not established, skipping"), q({
                    code: HY6.ExportResultCode.SUCCESS
                });
                return
            }
            if (!(await wb4()).enabled) {
                k("Metrics export disabled by organization setting"), q({
                    code: HY6.ExportResultCode.SUCCESS
                });
                return
            }
            let z = this.transformMetricsForInternal(A),
                _ = QO();
            if (_.error) {
                k(`Metrics export failed: ${_.error}`), q({
                    code: HY6.ExportResultCode.FAILED,
                    error: Error(_.error)
                });
                return
            }
            let w = {
                    "Content-Type": "application/json",
                    "User-Agent": pO(),
                    ..._.headers
                },
                O = await X8.post(this.endpoint, z, {
                    timeout: this.timeout,
                    headers: w
                });
            k("BigQuery metrics exported successfully"), k(`BigQuery API Response: ${B6(O.data,null,2)}`), q({
                code: HY6.ExportResultCode.SUCCESS
            })
        } catch (K) {
            k(`BigQuery metrics export failed: ${_1(K)}`), _6(K), q({
                code: HY6.ExportResultCode.FAILED,
                error: K instanceof Error ? K : Error("Unknown export error")
            })
        }
    }
    transformMetricsForInternal(A) {
        let q = A.resource.attributes,
            K = {
                "service.name": q["service.name"] || "claude-code",
                "service.version": q["service.version"] || "unknown",
                "os.type": q["os.type"] || "unknown",
                "os.version": q["os.version"] || "unknown",
                "host.arch": q["host.arch"] || "unknown",
                "aggregation.temporality": this.selectAggregationTemporality() === ES8.AggregationTemporality.DELTA ? "delta" : "cumulative"
            };
        if (q["wsl.version"]) K["wsl.version"] = q["wsl.version"];
        if (iA()) {
            K["user.customer_type"] = "claude_ai";
            let z = CK();
            if (z) K["user.subscription_type"] = z
        } else K["user.customer_type"] = "api";
        return {
            resource_attributes: K,
            metrics: A.scopeMetrics.flatMap((z) => z.metrics.map((_) => ({
                name: _.descriptor.name,
                description: _.descriptor.description,
                unit: _.descriptor.unit,
                data_points: this.extractDataPoints(_)
            })))
        }
    }
    extractDataPoints(A) {
        return (A.dataPoints || []).filter((K) => typeof K.value === "number").map((K) => ({
            attributes: this.convertAttributes(K.attributes),
            value: K.value,
            timestamp: this.hrTimeToISOString(K.endTime || K.startTime || [Date.now() / 1000, 0])
        }))
    }
    async shutdown() {
        this.isShutdown = !0, await this.forceFlush(), k("BigQuery metrics exporter shutdown complete")
    }
    async forceFlush() {
        await Promise.all(this.pendingExports), k("BigQuery metrics exporter flush complete")
    }
    convertAttributes(A) {
        let q = {};
        if (A) {
            for (let [K, Y] of Object.entries(A))
                if (Y !== void 0 && Y !== null) q[K] = String(Y)
        }
        return q
    }
    hrTimeToISOString(A) {
        let [q, K] = A;
        return new Date(q * 1000 + K / 1e6).toISOString()
    }
    selectAggregationTemporality() {
        return ES8.AggregationTemporality.DELTA
    }
}
// @from(Ln 302442, Col 4)
ES8
// @from(Ln 302442, Col 9)
HY6
// @from(Ln 302443, Col 4)
$b4 = E(() => {
    kK();
    H1();
    k1();
    RM();
    Ob4();
    fA();
    k8();
    T1();
    g1();
    s8();
    ES8 = t(ue(), 1), HY6 = t(K9(), 1)
})
// @from(Ln 302456, Col 4)
Jb4 = x((Hb4) => {
    Object.defineProperty(Hb4, "__esModule", {
        value: !0
    });
    Hb4.VERSION = void 0;
    Hb4.VERSION = "0.208.0"
})
// @from(Ln 302463, Col 4)
a3 = x((Pb4) => {
    Object.defineProperty(Pb4, "__esModule", {
        value: !0
    });
    Pb4.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = Pb4.DEFAULT_MAX_SEND_MESSAGE_LENGTH = Pb4.Propagate = Pb4.LogVerbosity = Pb4.Status = void 0;
    var Mb4;
    (function(A) {
        A[A.OK = 0] = "OK", A[A.CANCELLED = 1] = "CANCELLED", A[A.UNKNOWN = 2] = "UNKNOWN", A[A.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", A[A.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", A[A.NOT_FOUND = 5] = "NOT_FOUND", A[A.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", A[A.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", A[A.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", A[A.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", A[A.ABORTED = 10] = "ABORTED", A[A.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", A[A.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", A[A.INTERNAL = 13] = "INTERNAL", A[A.UNAVAILABLE = 14] = "UNAVAILABLE", A[A.DATA_LOSS = 15] = "DATA_LOSS", A[A.UNAUTHENTICATED = 16] = "UNAUTHENTICATED"
    })(Mb4 || (Pb4.Status = Mb4 = {}));
    var Db4;
    (function(A) {
        A[A.DEBUG = 0] = "DEBUG", A[A.INFO = 1] = "INFO", A[A.ERROR = 2] = "ERROR", A[A.NONE = 3] = "NONE"
    })(Db4 || (Pb4.LogVerbosity = Db4 = {}));
    var Xb4;
    (function(A) {
        A[A.DEADLINE = 1] = "DEADLINE", A[A.CENSUS_STATS_CONTEXT = 2] = "CENSUS_STATS_CONTEXT", A[A.CENSUS_TRACING_CONTEXT = 4] = "CENSUS_TRACING_CONTEXT", A[A.CANCELLATION = 8] = "CANCELLATION", A[A.DEFAULTS = 65535] = "DEFAULTS"
    })(Xb4 || (Pb4.Propagate = Xb4 = {}));
    Pb4.DEFAULT_MAX_SEND_MESSAGE_LENGTH = -1;
    Pb4.DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4194304
})
// @from(Ln 302483, Col 4)
LS8 = x((h0w, N2Y) => {
    N2Y.exports = {
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
// @from(Ln 302558, Col 4)
zw = x((fb4) => {
    var RS8, hS8, SS8, CS8;
    Object.defineProperty(fb4, "__esModule", {
        value: !0
    });
    fb4.log = fb4.setLoggerVerbosity = fb4.setLogger = fb4.getLogger = void 0;
    fb4.trace = b2Y;
    fb4.isTracerEnabled = Gb4;
    var Qe = a3(),
        V2Y = x6("process"),
        k2Y = LS8().version,
        E2Y = {
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
        jY6 = E2Y,
        VG6 = Qe.LogVerbosity.ERROR,
        y2Y = (hS8 = (RS8 = process.env.GRPC_NODE_VERBOSITY) !== null && RS8 !== void 0 ? RS8 : process.env.GRPC_VERBOSITY) !== null && hS8 !== void 0 ? hS8 : "";
    switch (y2Y.toUpperCase()) {
        case "DEBUG":
            VG6 = Qe.LogVerbosity.DEBUG;
            break;
        case "INFO":
            VG6 = Qe.LogVerbosity.INFO;
            break;
        case "ERROR":
            VG6 = Qe.LogVerbosity.ERROR;
            break;
        case "NONE":
            VG6 = Qe.LogVerbosity.NONE;
            break;
        default:
    }
    var L2Y = () => {
        return jY6
    };
    fb4.getLogger = L2Y;
    var R2Y = (A) => {
        jY6 = A
    };
    fb4.setLogger = R2Y;
    var h2Y = (A) => {
        VG6 = A
    };
    fb4.setLoggerVerbosity = h2Y;
    var S2Y = (A, ...q) => {
        let K;
        if (A >= VG6) {
            switch (A) {
                case Qe.LogVerbosity.DEBUG:
                    K = jY6.debug;
                    break;
                case Qe.LogVerbosity.INFO:
                    K = jY6.info;
                    break;
                case Qe.LogVerbosity.ERROR:
                    K = jY6.error;
                    break
            }
            if (!K) K = jY6.error;
            if (K) K.bind(jY6)(...q)
        }
    };
    fb4.log = S2Y;
    var C2Y = (CS8 = (SS8 = process.env.GRPC_NODE_TRACE) !== null && SS8 !== void 0 ? SS8 : process.env.GRPC_TRACE) !== null && CS8 !== void 0 ? CS8 : "",
        IS8 = new Set,
        Zb4 = new Set;
    for (let A of C2Y.split(","))
        if (A.startsWith("-")) Zb4.add(A.substring(1));
        else IS8.add(A);
    var I2Y = IS8.has("all");

    function b2Y(A, q, K) {
        if (Gb4(q)) fb4.log(A, new Date().toISOString() + " | v" + k2Y + " " + V2Y.pid + " | " + q + " | " + K)
    }

    function Gb4(A) {
        return !Zb4.has(A) && (I2Y || IS8.has(A))
    }
})
// @from(Ln 302645, Col 4)
xf1 = x((Tb4) => {
    Object.defineProperty(Tb4, "__esModule", {
        value: !0
    });
    Tb4.getErrorMessage = F2Y;
    Tb4.getErrorCode = p2Y;

    function F2Y(A) {
        if (A instanceof Error) return A.message;
        else return String(A)
    }

    function p2Y(A) {
        if (typeof A === "object" && A !== null && "code" in A && typeof A.code === "number") return A.code;
        else return null
    }
})
// @from(Ln 302662, Col 4)
LX = x((Vb4) => {
    Object.defineProperty(Vb4, "__esModule", {
        value: !0
    });
    Vb4.Metadata = void 0;
    var d2Y = zw(),
        c2Y = a3(),
        l2Y = xf1(),
        i2Y = /^[:0-9a-z_.-]+$/,
        n2Y = /^[ -~]*$/;

    function r2Y(A) {
        return i2Y.test(A)
    }

    function o2Y(A) {
        return n2Y.test(A)
    }

    function Nb4(A) {
        return A.endsWith("-bin")
    }

    function a2Y(A) {
        return !A.startsWith("grpc-")
    }

    function uf1(A) {
        return A.toLowerCase()
    }

    function vb4(A, q) {
        if (!r2Y(A)) throw Error('Metadata key "' + A + '" contains illegal characters');
        if (q !== null && q !== void 0)
            if (Nb4(A)) {
                if (!Buffer.isBuffer(q)) throw Error("keys that end with '-bin' must have Buffer values")
            } else {
                if (Buffer.isBuffer(q)) throw Error("keys that don't end with '-bin' must have String values");
                if (!o2Y(q)) throw Error('Metadata string value "' + q + '" contains illegal characters')
            }
    }
    class mf1 {
        constructor(A = {}) {
            this.internalRepr = new Map, this.opaqueData = new Map, this.options = A
        }
        set(A, q) {
            A = uf1(A), vb4(A, q), this.internalRepr.set(A, [q])
        }
        add(A, q) {
            A = uf1(A), vb4(A, q);
            let K = this.internalRepr.get(A);
            if (K === void 0) this.internalRepr.set(A, [q]);
            else K.push(q)
        }
        remove(A) {
            A = uf1(A), this.internalRepr.delete(A)
        }
        get(A) {
            return A = uf1(A), this.internalRepr.get(A) || []
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
            let A = new mf1(this.options),
                q = A.internalRepr;
            for (let [K, Y] of this.internalRepr) {
                let z = Y.map((_) => {
                    if (Buffer.isBuffer(_)) return Buffer.from(_);
                    else return _
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
                A[q] = K.map(s2Y)
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
            let q = new mf1;
            for (let K of Object.keys(A)) {
                if (K.charAt(0) === ":") continue;
                let Y = A[K];
                try {
                    if (Nb4(K)) {
                        if (Array.isArray(Y)) Y.forEach((z) => {
                            q.add(K, Buffer.from(z, "base64"))
                        });
                        else if (Y !== void 0)
                            if (a2Y(K)) Y.split(",").forEach((z) => {
                                q.add(K, Buffer.from(z.trim(), "base64"))
                            });
                            else q.add(K, Buffer.from(Y, "base64"))
                    } else if (Array.isArray(Y)) Y.forEach((z) => {
                        q.add(K, z)
                    });
                    else if (Y !== void 0) q.add(K, Y)
                } catch (z) {
                    let _ = `Failed to add metadata entry ${K}: ${Y}. ${(0,l2Y.getErrorMessage)(z)}. For more information see https://github.com/grpc/grpc-node/issues/1173`;
                    (0, d2Y.log)(c2Y.LogVerbosity.ERROR, _)
                }
            }
            return q
        }
    }
    Vb4.Metadata = mf1;
    var s2Y = (A) => {
        return Buffer.isBuffer(A) ? A.toString("base64") : A
    }
})
// @from(Ln 302805, Col 4)
gf1 = x((Eb4) => {
    Object.defineProperty(Eb4, "__esModule", {
        value: !0
    });
    Eb4.CallCredentials = void 0;
    var xS8 = LX();

    function t2Y(A) {
        return "getRequestHeaders" in A && typeof A.getRequestHeaders === "function"
    }
    class kG6 {
        static createFromMetadataGenerator(A) {
            return new uS8(A)
        }
        static createFromGoogleCredential(A) {
            return kG6.createFromMetadataGenerator((q, K) => {
                let Y;
                if (t2Y(A)) Y = A.getRequestHeaders(q.service_url);
                else Y = new Promise((z, _) => {
                    A.getRequestMetadata(q.service_url, (w, O) => {
                        if (w) {
                            _(w);
                            return
                        }
                        if (!O) {
                            _(Error("Headers not set by metadata plugin"));
                            return
                        }
                        z(O)
                    })
                });
                Y.then((z) => {
                    let _ = new xS8.Metadata;
                    for (let w of Object.keys(z)) _.add(w, z[w]);
                    K(null, _)
                }, (z) => {
                    K(z)
                })
            })
        }
        static createEmpty() {
            return new mS8
        }
    }
    Eb4.CallCredentials = kG6;
    class Bf1 extends kG6 {
        constructor(A) {
            super();
            this.creds = A
        }
        async generateMetadata(A) {
            let q = new xS8.Metadata,
                K = await Promise.all(this.creds.map((Y) => Y.generateMetadata(A)));
            for (let Y of K) q.merge(Y);
            return q
        }
        compose(A) {
            return new Bf1(this.creds.concat([A]))
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof Bf1) return this.creds.every((q, K) => q._equals(A.creds[K]));
            else return !1
        }
    }
    class uS8 extends kG6 {
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
            return new Bf1([this, A])
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof uS8) return this.metadataGenerator === A.metadataGenerator;
            else return !1
        }
    }
    class mS8 extends kG6 {
        generateMetadata(A) {
            return Promise.resolve(new xS8.Metadata)
        }
        compose(A) {
            return A
        }
        _equals(A) {
            return A instanceof mS8
        }
    }
})
// @from(Ln 302904, Col 4)
gS8 = x((Rb4) => {
    Object.defineProperty(Rb4, "__esModule", {
        value: !0
    });
    Rb4.CIPHER_SUITES = void 0;
    Rb4.getDefaultRootsData = AwY;
    var e2Y = x6("fs");
    Rb4.CIPHER_SUITES = process.env.GRPC_SSL_CIPHER_SUITES;
    var Lb4 = process.env.GRPC_DEFAULT_SSL_ROOTS_FILE_PATH,
        BS8 = null;

    function AwY() {
        if (Lb4) {
            if (BS8 === null) BS8 = e2Y.readFileSync(Lb4);
            return BS8
        }
        return null
    }
})
// @from(Ln 302923, Col 4)
Nf = x((Cb4) => {
    Object.defineProperty(Cb4, "__esModule", {
        value: !0
    });
    Cb4.parseUri = YwY;
    Cb4.splitHostPort = zwY;
    Cb4.combineHostPort = _wY;
    Cb4.uriToString = wwY;
    var KwY = /^(?:([A-Za-z0-9+.-]+):)?(?:\/\/([^/]*)\/)?(.+)$/;

    function YwY(A) {
        let q = KwY.exec(A);
        if (q === null) return null;
        return {
            scheme: q[1],
            authority: q[2],
            path: q[3]
        }
    }
    var Sb4 = /^\d+$/;

    function zwY(A) {
        if (A.startsWith("[")) {
            let q = A.indexOf("]");
            if (q === -1) return null;
            let K = A.substring(1, q);
            if (K.indexOf(":") === -1) return null;
            if (A.length > q + 1)
                if (A[q + 1] === ":") {
                    let Y = A.substring(q + 2);
                    if (Sb4.test(Y)) return {
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
                if (Sb4.test(q[1])) return {
                    host: q[0],
                    port: +q[1]
                };
                else return null;
            else return {
                host: A
            }
        }
    }

    function _wY(A) {
        if (A.port === void 0) return A.host;
        else if (A.host.includes(":")) return `[${A.host}]:${A.port}`;
        else return `${A.host}:${A.port}`
    }

    function wwY(A) {
        let q = "";
        if (A.scheme !== void 0) q += A.scheme + ":";
        if (A.authority !== void 0) q += "//" + A.authority + "/";
        return q += A.path, q
    }
})
// @from(Ln 302989, Col 4)
Ob = x((Ib4) => {
    Object.defineProperty(Ib4, "__esModule", {
        value: !0
    });
    Ib4.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = void 0;
    Ib4.registerResolver = JwY;
    Ib4.registerDefaultScheme = MwY;
    Ib4.createResolver = DwY;
    Ib4.getDefaultAuthority = XwY;
    Ib4.mapUriDefaultScheme = PwY;
    var pS8 = Nf();
    Ib4.CHANNEL_ARGS_CONFIG_SELECTOR_KEY = "grpc.internal.config_selector";
    var EG6 = {},
        FS8 = null;

    function JwY(A, q) {
        EG6[A] = q
    }

    function MwY(A) {
        FS8 = A
    }

    function DwY(A, q, K) {
        if (A.scheme !== void 0 && A.scheme in EG6) return new EG6[A.scheme](A, q, K);
        else throw Error(`No resolver could be created for target ${(0,pS8.uriToString)(A)}`)
    }

    function XwY(A) {
        if (A.scheme !== void 0 && A.scheme in EG6) return EG6[A.scheme].getDefaultAuthority(A);
        else throw Error(`Invalid target ${(0,pS8.uriToString)(A)}`)
    }

    function PwY(A) {
        if (A.scheme === void 0 || !(A.scheme in EG6))
            if (FS8 !== null) return {
                scheme: FS8,
                authority: void 0,
                path: (0, pS8.uriToString)(A)
            };
            else return null;
        return A
    }
})
// @from(Ln 303033, Col 4)
LG6 = x((Bb4) => {
    Object.defineProperty(Bb4, "__esModule", {
        value: !0
    });
    Bb4.ChannelCredentials = void 0;
    Bb4.createCertificateProviderChannelCredentials = kwY;
    var rU6 = x6("tls"),
        Qf1 = gf1(),
        US8 = gS8(),
        xb4 = Nf(),
        vwY = Ob(),
        NwY = zw(),
        VwY = a3();

    function QS8(A, q) {
        if (A && !(A instanceof Buffer)) throw TypeError(`${q}, if provided, must be a Buffer.`)
    }
    class yG6 {
        compose(A) {
            return new pf1(this, A)
        }
        static createSsl(A, q, K, Y) {
            var z;
            if (QS8(A, "Root certificate"), QS8(q, "Private key"), QS8(K, "Certificate chain"), q && !K) throw Error("Private key must be given with accompanying certificate chain");
            if (!q && K) throw Error("Certificate chain must be given with accompanying private key");
            let _ = (0, rU6.createSecureContext)({
                ca: (z = A !== null && A !== void 0 ? A : (0, US8.getDefaultRootsData)()) !== null && z !== void 0 ? z : void 0,
                key: q !== null && q !== void 0 ? q : void 0,
                cert: K !== null && K !== void 0 ? K : void 0,
                ciphers: US8.CIPHER_SUITES
            });
            return new Ff1(_, Y !== null && Y !== void 0 ? Y : {})
        }
        static createFromSecureContext(A, q) {
            return new Ff1(A, q !== null && q !== void 0 ? q : {})
        }
        static createInsecure() {
            return new dS8
        }
    }
    Bb4.ChannelCredentials = yG6;
    class dS8 extends yG6 {
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
            return A instanceof dS8
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
                    return K !== null && K !== void 0 ? K : Qf1.CallCredentials.createEmpty()
                },
                destroy() {}
            }
        }
    }

    function ub4(A, q, K, Y) {
        var z, _;
        let w = {
                secureContext: A
            },
            O = K;
        if ("grpc.http_connect_target" in Y) {
            let J = (0, xb4.parseUri)(Y["grpc.http_connect_target"]);
            if (J) O = J
        }
        let $ = (0, vwY.getDefaultAuthority)(O),
            H = (0, xb4.splitHostPort)($),
            j = (z = H === null || H === void 0 ? void 0 : H.host) !== null && z !== void 0 ? z : $;
        if (w.host = j, q.checkServerIdentity) w.checkServerIdentity = q.checkServerIdentity;
        if (q.rejectUnauthorized !== void 0) w.rejectUnauthorized = q.rejectUnauthorized;
        if (w.ALPNProtocols = ["h2"], Y["grpc.ssl_target_name_override"]) {
            let J = Y["grpc.ssl_target_name_override"],
                M = (_ = w.checkServerIdentity) !== null && _ !== void 0 ? _ : rU6.checkServerIdentity;
            w.checkServerIdentity = (D, X) => {
                return M(J, X)
            }, w.servername = J
        } else w.servername = j;
        if (Y["grpc-node.tls_enable_trace"]) w.enableTrace = !0;
        return w
    }
    class mb4 {
        constructor(A, q) {
            this.connectionOptions = A, this.callCredentials = q
        }
        connect(A) {
            let q = Object.assign({
                socket: A
            }, this.connectionOptions);
            return new Promise((K, Y) => {
                let z = (0, rU6.connect)(q, () => {
                    var _;
                    if (((_ = this.connectionOptions.rejectUnauthorized) !== null && _ !== void 0 ? _ : !0) && !z.authorized) {
                        Y(z.authorizationError);
                        return
                    }
                    K({
                        socket: z,
                        secure: !0
                    })
                });
                z.on("error", (_) => {
                    Y(_)
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
    class Ff1 extends yG6 {
        constructor(A, q) {
            super();
            this.secureContext = A, this.verifyOptions = q
        }
        _isSecure() {
            return !0
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof Ff1) return this.secureContext === A.secureContext && this.verifyOptions.checkServerIdentity === A.verifyOptions.checkServerIdentity;
            else return !1
        }
        _createSecureConnector(A, q, K) {
            let Y = ub4(this.secureContext, this.verifyOptions, A, q);
            return new mb4(Y, K !== null && K !== void 0 ? K : Qf1.CallCredentials.createEmpty())
        }
    }
    class nU6 extends yG6 {
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
            if (A instanceof nU6) return this.caCertificateProvider === A.caCertificateProvider && this.identityCertificateProvider === A.identityCertificateProvider && ((q = this.verifyOptions) === null || q === void 0 ? void 0 : q.checkServerIdentity) === ((K = A.verifyOptions) === null || K === void 0 ? void 0 : K.checkServerIdentity);
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
            return this.ref(), new nU6.SecureConnectorImpl(this, A, q, K !== null && K !== void 0 ? K : Qf1.CallCredentials.createEmpty())
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
                return (0, rU6.createSecureContext)({
                    ca: this.latestCaUpdate.caCertificate,
                    key: (A = this.latestIdentityUpdate) === null || A === void 0 ? void 0 : A.privateKey,
                    cert: (q = this.latestIdentityUpdate) === null || q === void 0 ? void 0 : q.certificate,
                    ciphers: US8.CIPHER_SUITES
                })
            } catch (K) {
                return (0, NwY.log)(VwY.LogVerbosity.ERROR, "Failed to createSecureContext with error " + K.message), null
            }
        }
    }
    nU6.SecureConnectorImpl = class {
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
                let z = ub4(Y, this.parent.verifyOptions, this.channelTarget, this.options),
                    _ = Object.assign({
                        socket: A
                    }, z),
                    w = () => {
                        K(Error("Socket closed"))
                    },
                    O = (H) => {
                        K(H)
                    },
                    $ = (0, rU6.connect)(_, () => {
                        var H;
                        if ($.removeListener("close", w), $.removeListener("error", O), ((H = this.parent.verifyOptions.rejectUnauthorized) !== null && H !== void 0 ? H : !0) && !$.authorized) {
                            K($.authorizationError);
                            return
                        }
                        q({
                            socket: $,
                            secure: !0
                        })
                    });
                $.once("close", w), $.once("error", O)
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

    function kwY(A, q, K) {
        return new nU6(A, q, K !== null && K !== void 0 ? K : {})
    }
    class pf1 extends yG6 {
        constructor(A, q) {
            super();
            if (this.channelCredentials = A, this.callCredentials = q, !A._isSecure()) throw Error("Cannot compose insecure credentials")
        }
        compose(A) {
            let q = this.callCredentials.compose(A);
            return new pf1(this.channelCredentials, q)
        }
        _isSecure() {
            return !0
        }
        _equals(A) {
            if (this === A) return !0;
            if (A instanceof pf1) return this.channelCredentials._equals(A.channelCredentials) && this.callCredentials._equals(A.callCredentials);
            else return !1
        }
        _createSecureConnector(A, q, K) {
            let Y = this.callCredentials.compose(K !== null && K !== void 0 ? K : Qf1.CallCredentials.createEmpty());
            return this.channelCredentials._createSecureConnector(A, q, Y)
        }
    }
})
// @from(Ln 303320, Col 4)
de = x((pb4) => {
    Object.defineProperty(pb4, "__esModule", {
        value: !0
    });
    pb4.createChildChannelControlHelper = RwY;
    pb4.registerLoadBalancerType = hwY;
    pb4.registerDefaultLoadBalancerType = SwY;
    pb4.createLoadBalancer = CwY;
    pb4.isLoadBalancerNameRegistered = IwY;
    pb4.parseLoadBalancingConfig = Fb4;
    pb4.getDefaultConfig = bwY;
    pb4.selectLbConfigFromList = xwY;
    var ywY = zw(),
        LwY = a3();

    function RwY(A, q) {
        var K, Y, z, _, w, O, $, H, j, J;
        return {
            createSubchannel: (Y = (K = q.createSubchannel) === null || K === void 0 ? void 0 : K.bind(q)) !== null && Y !== void 0 ? Y : A.createSubchannel.bind(A),
            updateState: (_ = (z = q.updateState) === null || z === void 0 ? void 0 : z.bind(q)) !== null && _ !== void 0 ? _ : A.updateState.bind(A),
            requestReresolution: (O = (w = q.requestReresolution) === null || w === void 0 ? void 0 : w.bind(q)) !== null && O !== void 0 ? O : A.requestReresolution.bind(A),
            addChannelzChild: (H = ($ = q.addChannelzChild) === null || $ === void 0 ? void 0 : $.bind(q)) !== null && H !== void 0 ? H : A.addChannelzChild.bind(A),
            removeChannelzChild: (J = (j = q.removeChannelzChild) === null || j === void 0 ? void 0 : j.bind(q)) !== null && J !== void 0 ? J : A.removeChannelzChild.bind(A)
        }
    }
    var Ue = {},
        oU6 = null;

    function hwY(A, q, K) {
        Ue[A] = {
            LoadBalancer: q,
            LoadBalancingConfig: K
        }
    }

    function SwY(A) {
        oU6 = A
    }

    function CwY(A, q) {
        let K = A.getLoadBalancerName();
        if (K in Ue) return new Ue[K].LoadBalancer(q);
        else return null
    }

    function IwY(A) {
        return A in Ue
    }

    function Fb4(A) {
        let q = Object.keys(A);
        if (q.length !== 1) throw Error("Provided load balancing config has multiple conflicting entries");
        let K = q[0];
        if (K in Ue) try {
            return Ue[K].LoadBalancingConfig.createFromJson(A[K])
        } catch (Y) {
            throw Error(`${K}: ${Y.message}`)
        } else throw Error(`Unrecognized load balancing config name ${K}`)
    }

    function bwY() {
        if (!oU6) throw Error("No default load balancer type registered");
        return new Ue[oU6].LoadBalancingConfig
    }

    function xwY(A, q = !1) {
        for (let K of A) try {
            return Fb4(K)
        } catch (Y) {
            (0, ywY.log)(LwY.LogVerbosity.DEBUG, "Config parsing failed with error", Y.message);
            continue
        }
        if (q)
            if (oU6) return new Ue[oU6].LoadBalancingConfig;
            else return null;
        else return null
    }
})
// @from(Ln 303398, Col 4)
cS8 = x((db4) => {
    Object.defineProperty(db4, "__esModule", {
        value: !0
    });
    db4.validateRetryThrottling = Qb4;
    db4.validateServiceConfig = Ub4;
    db4.extractAndSelectServiceConfig = twY;
    var dwY = x6("os"),
        Uf1 = a3(),
        df1 = /^\d+(\.\d{1,9})?s$/,
        cwY = "node";

    function lwY(A) {
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

    function iwY(A) {
        if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config retry policy: maxAttempts must be an integer at least 2");
        if (!("initialBackoff" in A) || typeof A.initialBackoff !== "string" || !df1.test(A.initialBackoff)) throw Error("Invalid method config retry policy: initialBackoff must be a string consisting of a positive integer or decimal followed by s");
        if (!("maxBackoff" in A) || typeof A.maxBackoff !== "string" || !df1.test(A.maxBackoff)) throw Error("Invalid method config retry policy: maxBackoff must be a string consisting of a positive integer or decimal followed by s");
        if (!("backoffMultiplier" in A) || typeof A.backoffMultiplier !== "number" || A.backoffMultiplier <= 0) throw Error("Invalid method config retry policy: backoffMultiplier must be a number greater than 0");
        if (!(("retryableStatusCodes" in A) && Array.isArray(A.retryableStatusCodes))) throw Error("Invalid method config retry policy: retryableStatusCodes is required");
        if (A.retryableStatusCodes.length === 0) throw Error("Invalid method config retry policy: retryableStatusCodes must be non-empty");
        for (let q of A.retryableStatusCodes)
            if (typeof q === "number") {
                if (!Object.values(Uf1.Status).includes(q)) throw Error("Invalid method config retry policy: retryableStatusCodes value not in status code range")
            } else if (typeof q === "string") {
            if (!Object.values(Uf1.Status).includes(q.toUpperCase())) throw Error("Invalid method config retry policy: retryableStatusCodes value not a status code name")
        } else throw Error("Invalid method config retry policy: retryableStatusCodes value must be a string or number");
        return {
            maxAttempts: A.maxAttempts,
            initialBackoff: A.initialBackoff,
            maxBackoff: A.maxBackoff,
            backoffMultiplier: A.backoffMultiplier,
            retryableStatusCodes: A.retryableStatusCodes
        }
    }

    function nwY(A) {
        if (!("maxAttempts" in A) || !Number.isInteger(A.maxAttempts) || A.maxAttempts < 2) throw Error("Invalid method config hedging policy: maxAttempts must be an integer at least 2");
        if ("hedgingDelay" in A && (typeof A.hedgingDelay !== "string" || !df1.test(A.hedgingDelay))) throw Error("Invalid method config hedging policy: hedgingDelay must be a string consisting of a positive integer followed by s");
        if ("nonFatalStatusCodes" in A && Array.isArray(A.nonFatalStatusCodes))
            for (let K of A.nonFatalStatusCodes)
                if (typeof K === "number") {
                    if (!Object.values(Uf1.Status).includes(K)) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not in status code range")
                } else if (typeof K === "string") {
            if (!Object.values(Uf1.Status).includes(K.toUpperCase())) throw Error("Invalid method config hedging policy: nonFatalStatusCodes value not a status code name")
        } else throw Error("Invalid method config hedging policy: nonFatalStatusCodes value must be a string or number");
        let q = {
            maxAttempts: A.maxAttempts
        };
        if (A.hedgingDelay) q.hedgingDelay = A.hedgingDelay;
        if (A.nonFatalStatusCodes) q.nonFatalStatusCodes = A.nonFatalStatusCodes;
        return q
    }

    function rwY(A) {
        var q;
        let K = {
            name: []
        };
        if (!("name" in A) || !Array.isArray(A.name)) throw Error("Invalid method config: invalid name array");
        for (let Y of A.name) K.name.push(lwY(Y));
        if ("waitForReady" in A) {
            if (typeof A.waitForReady !== "boolean") throw Error("Invalid method config: invalid waitForReady");
            K.waitForReady = A.waitForReady
        }
        if ("timeout" in A)
            if (typeof A.timeout === "object") {
                if (!("seconds" in A.timeout) || typeof A.timeout.seconds !== "number") throw Error("Invalid method config: invalid timeout.seconds");
                if (!("nanos" in A.timeout) || typeof A.timeout.nanos !== "number") throw Error("Invalid method config: invalid timeout.nanos");
                K.timeout = A.timeout
            } else if (typeof A.timeout === "string" && df1.test(A.timeout)) {
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
            else K.retryPolicy = iwY(A.retryPolicy);
        else if ("hedgingPolicy" in A) K.hedgingPolicy = nwY(A.hedgingPolicy);
        return K
    }

    function Qb4(A) {
        if (!("maxTokens" in A) || typeof A.maxTokens !== "number" || A.maxTokens <= 0 || A.maxTokens > 1000) throw Error("Invalid retryThrottling: maxTokens must be a number in (0, 1000]");
        if (!("tokenRatio" in A) || typeof A.tokenRatio !== "number" || A.tokenRatio <= 0) throw Error("Invalid retryThrottling: tokenRatio must be a number greater than 0");
        return {
            maxTokens: +A.maxTokens.toFixed(3),
            tokenRatio: +A.tokenRatio.toFixed(3)
        }
    }

    function owY(A) {
        if (!(typeof A === "object" && A !== null)) throw Error(`Invalid loadBalancingConfig: unexpected type ${typeof A}`);
        let q = Object.keys(A);
        if (q.length > 1) throw Error(`Invalid loadBalancingConfig: unexpected multiple keys ${q}`);
        if (q.length === 0) throw Error("Invalid loadBalancingConfig: load balancing policy name required");
        return {
            [q[0]]: A[q[0]]
        }
    }

    function Ub4(A) {
        let q = {
            loadBalancingConfig: [],
            methodConfig: []
        };
        if ("loadBalancingPolicy" in A)
            if (typeof A.loadBalancingPolicy === "string") q.loadBalancingPolicy = A.loadBalancingPolicy;
            else throw Error("Invalid service config: invalid loadBalancingPolicy");
        if ("loadBalancingConfig" in A)
            if (Array.isArray(A.loadBalancingConfig))
                for (let Y of A.loadBalancingConfig) q.loadBalancingConfig.push(owY(Y));
            else throw Error("Invalid service config: invalid loadBalancingConfig");
        if ("methodConfig" in A) {
            if (Array.isArray(A.methodConfig))
                for (let Y of A.methodConfig) q.methodConfig.push(rwY(Y))
        }
        if ("retryThrottling" in A) q.retryThrottling = Qb4(A.retryThrottling);
        let K = [];
        for (let Y of q.methodConfig)
            for (let z of Y.name) {
                for (let _ of K)
                    if (z.service === _.service && z.method === _.method) throw Error(`Invalid service config: duplicate name ${z.service}/${z.method}`);
                K.push(z)
            }
        return q
    }

    function awY(A) {
        if (!("serviceConfig" in A)) throw Error("Invalid service config choice: missing service config");
        let q = {
            serviceConfig: Ub4(A.serviceConfig)
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

    function swY(A, q) {
        if (!Array.isArray(A)) throw Error("Invalid service config list");
        for (let K of A) {
            let Y = awY(K);
            if (typeof Y.percentage === "number" && q > Y.percentage) continue;
            if (Array.isArray(Y.clientHostname)) {
                let z = !1;
                for (let _ of Y.clientHostname)
                    if (_ === dwY.hostname()) z = !0;
                if (!z) continue
            }
            if (Array.isArray(Y.clientLanguage)) {
                let z = !1;
                for (let _ of Y.clientLanguage)
                    if (_ === cwY) z = !0;
                if (!z) continue
            }
            return Y.serviceConfig
        }
        throw Error("No matching service config found")
    }

    function twY(A, q) {
        for (let K of A)
            if (K.length > 0 && K[0].startsWith("grpc_config=")) {
                let Y = K.join("").substring(12),
                    z = JSON.parse(Y);
                return swY(z, q)
            } return null
    }
})
// @from(Ln 303611, Col 4)
Vf = x((lb4) => {
    Object.defineProperty(lb4, "__esModule", {
        value: !0
    });
    lb4.ConnectivityState = void 0;
    var cb4;
    (function(A) {
        A[A.IDLE = 0] = "IDLE", A[A.CONNECTING = 1] = "CONNECTING", A[A.READY = 2] = "READY", A[A.TRANSIENT_FAILURE = 3] = "TRANSIENT_FAILURE", A[A.SHUTDOWN = 4] = "SHUTDOWN"
    })(cb4 || (lb4.ConnectivityState = cb4 = {}))
})
// @from(Ln 303621, Col 4)
pc = x((ob4) => {
    Object.defineProperty(ob4, "__esModule", {
        value: !0
    });
    ob4.QueuePicker = ob4.UnavailablePicker = ob4.PickResultType = void 0;
    var KOY = LX(),
        YOY = a3(),
        cf1;
    (function(A) {
        A[A.COMPLETE = 0] = "COMPLETE", A[A.QUEUE = 1] = "QUEUE", A[A.TRANSIENT_FAILURE = 2] = "TRANSIENT_FAILURE", A[A.DROP = 3] = "DROP"
    })(cf1 || (ob4.PickResultType = cf1 = {}));
    class nb4 {
        constructor(A) {
            this.status = Object.assign({
                code: YOY.Status.UNAVAILABLE,
                details: "No connection established",
                metadata: new KOY.Metadata
            }, A)
        }
        pick(A) {
            return {
                pickResultType: cf1.TRANSIENT_FAILURE,
                subchannel: null,
                status: this.status,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    ob4.UnavailablePicker = nb4;
    class rb4 {
        constructor(A, q) {
            this.loadBalancer = A, this.childPicker = q, this.calledExitIdle = !1
        }
        pick(A) {
            if (!this.calledExitIdle) process.nextTick(() => {
                this.loadBalancer.exitIdle()
            }), this.calledExitIdle = !0;
            if (this.childPicker) return this.childPicker.pick(A);
            else return {
                pickResultType: cf1.QUEUE,
                subchannel: null,
                status: null,
                onCallStarted: null,
                onCallEnded: null
            }
        }
    }
    ob4.QueuePicker = rb4
})
// @from(Ln 303671, Col 4)
RG6 = x((sb4) => {
    Object.defineProperty(sb4, "__esModule", {
        value: !0
    });
    sb4.BackoffTimeout = void 0;
    var wOY = a3(),
        OOY = zw(),
        $OY = "backoff",
        HOY = 1000,
        jOY = 1.6,
        JOY = 120000,
        MOY = 0.2;

    function DOY(A, q) {
        return Math.random() * (q - A) + A
    }
    class lf1 {
        constructor(A, q) {
            if (this.callback = A, this.initialDelay = HOY, this.multiplier = jOY, this.maxDelay = JOY, this.jitter = MOY, this.running = !1, this.hasRef = !0, this.startTime = new Date, this.endTime = new Date, this.id = lf1.getNextId(), q) {
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
            OOY.trace(wOY.LogVerbosity.DEBUG, $OY, "{" + this.id + "} " + A)
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
            this.nextDelay = A + DOY(-q, q)
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
    sb4.BackoffTimeout = lf1;
    lf1.nextId = 0
})
// @from(Ln 303744, Col 4)
if1 = x((Ax4) => {
    Object.defineProperty(Ax4, "__esModule", {
        value: !0
    });
    Ax4.ChildLoadBalancerHandler = void 0;
    var XOY = de(),
        POY = Vf(),
        WOY = "child_load_balancer_helper";
    class eb4 {
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
                        if (q === POY.ConnectivityState.CONNECTING) return;
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
                let _ = new this.ChildPolicyHelper(this),
                    w = (0, XOY.createLoadBalancer)(q, _);
                if (_.setChild(w), this.currentChild === null) this.currentChild = w, z = this.currentChild;
                else {
                    if (this.pendingChild) this.pendingChild.destroy();
                    this.pendingChild = w, z = this.pendingChild
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
            return WOY
        }
    }
    Ax4.ChildLoadBalancerHandler = eb4
})
// @from(Ln 303828, Col 4)
Ox4 = x((_x4) => {
    Object.defineProperty(_x4, "__esModule", {
        value: !0
    });
    _x4.ResolvingLoadBalancer = void 0;
    var ZOY = de(),
        GOY = cS8(),
        zN = Vf(),
        Kx4 = Ob(),
        aU6 = pc(),
        fOY = RG6(),
        lS8 = a3(),
        TOY = LX(),
        vOY = zw(),
        NOY = a3(),
        VOY = Nf(),
        kOY = if1(),
        EOY = "resolving_load_balancer";

    function Yx4(A) {
        vOY.trace(NOY.LogVerbosity.DEBUG, EOY, A)
    }
    var yOY = ["SERVICE_AND_METHOD", "SERVICE", "EMPTY"];

    function LOY(A, q, K, Y) {
        for (let z of K.name) switch (Y) {
            case "EMPTY":
                if (!z.service && !z.method) return !0;
                break;
            case "SERVICE":
                if (z.service === A && !z.method) return !0;
                break;
            case "SERVICE_AND_METHOD":
                if (z.service === A && z.method === q) return !0
        }
        return !1
    }

    function ROY(A, q, K, Y) {
        for (let z of K)
            if (LOY(A, q, z, Y)) return z;
        return null
    }

    function hOY(A) {
        return {
            invoke(q, K) {
                var Y, z;
                let _ = q.split("/").filter(($) => $.length > 0),
                    w = (Y = _[0]) !== null && Y !== void 0 ? Y : "",
                    O = (z = _[1]) !== null && z !== void 0 ? z : "";
                if (A && A.methodConfig)
                    for (let $ of yOY) {
                        let H = ROY(w, O, A.methodConfig, $);
                        if (H) return {
                            methodConfig: H,
                            pickInformation: {},
                            status: lS8.Status.OK,
                            dynamicFilterFactories: []
                        }
                    }
                return {
                    methodConfig: {
                        name: []
                    },
                    pickInformation: {},
                    status: lS8.Status.OK,
                    dynamicFilterFactories: []
                }
            },
            unref() {}
        }
    }
    class zx4 {
        constructor(A, q, K, Y, z) {
            if (this.target = A, this.channelControlHelper = q, this.channelOptions = K, this.onSuccessfulResolution = Y, this.onFailedResolution = z, this.latestChildState = zN.ConnectivityState.IDLE, this.latestChildPicker = new aU6.QueuePicker(this), this.latestChildErrorMessage = null, this.currentState = zN.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1, K["grpc.service_config"]) this.defaultServiceConfig = (0, GOY.validateServiceConfig)(JSON.parse(K["grpc.service_config"]));
            else this.defaultServiceConfig = {
                loadBalancingConfig: [],
                methodConfig: []
            };
            this.updateState(zN.ConnectivityState.IDLE, new aU6.QueuePicker(this), null), this.childLoadBalancer = new kOY.ChildLoadBalancerHandler({
                createSubchannel: q.createSubchannel.bind(q),
                requestReresolution: () => {
                    if (this.backoffTimeout.isRunning()) Yx4("requestReresolution delayed by backoff timer until " + this.backoffTimeout.getEndTime().toISOString()), this.continueResolving = !0;
                    else this.updateResolution()
                },
                updateState: (w, O, $) => {
                    this.latestChildState = w, this.latestChildPicker = O, this.latestChildErrorMessage = $, this.updateState(w, O, $)
                },
                addChannelzChild: q.addChannelzChild.bind(q),
                removeChannelzChild: q.removeChannelzChild.bind(q)
            }), this.innerResolver = (0, Kx4.createResolver)(A, this.handleResolverResult.bind(this), K);
            let _ = {
                initialDelay: K["grpc.initial_reconnect_backoff_ms"],
                maxDelay: K["grpc.max_reconnect_backoff_ms"]
            };
            this.backoffTimeout = new fOY.BackoffTimeout(() => {
                if (this.continueResolving) this.updateResolution(), this.continueResolving = !1;
                else this.updateState(this.latestChildState, this.latestChildPicker, this.latestChildErrorMessage)
            }, _), this.backoffTimeout.unref()
        }
        handleResolverResult(A, q, K, Y) {
            var z, _;
            this.backoffTimeout.stop(), this.backoffTimeout.reset();
            let w = !0,
                O = null;
            if (K === null) O = this.defaultServiceConfig;
            else if (K.ok) O = K.value;
            else if (this.previousServiceConfig !== null) O = this.previousServiceConfig;
            else w = !1, this.handleResolutionFailure(K.error);
            if (O !== null) {
                let $ = (z = O === null || O === void 0 ? void 0 : O.loadBalancingConfig) !== null && z !== void 0 ? z : [],
                    H = (0, ZOY.selectLbConfigFromList)($, !0);
                if (H === null) w = !1, this.handleResolutionFailure({
                    code: lS8.Status.UNAVAILABLE,
                    details: "All load balancer options in service config are not compatible",
                    metadata: new TOY.Metadata
                });
                else w = this.childLoadBalancer.updateAddressList(A, H, Object.assign(Object.assign({}, this.channelOptions), q), Y)
            }
            if (w) this.onSuccessfulResolution(O, (_ = q[Kx4.CHANNEL_ARGS_CONFIG_SELECTOR_KEY]) !== null && _ !== void 0 ? _ : hOY(O));
            return w
        }
        updateResolution() {
            if (this.innerResolver.updateResolution(), this.currentState === zN.ConnectivityState.IDLE) this.updateState(zN.ConnectivityState.CONNECTING, this.latestChildPicker, this.latestChildErrorMessage);
            this.backoffTimeout.runOnce()
        }
        updateState(A, q, K) {
            if (Yx4((0, VOY.uriToString)(this.target) + " " + zN.ConnectivityState[this.currentState] + " -> " + zN.ConnectivityState[A]), A === zN.ConnectivityState.IDLE) q = new aU6.QueuePicker(this, q);
            this.currentState = A, this.channelControlHelper.updateState(A, q, K)
        }
        handleResolutionFailure(A) {
            if (this.latestChildState === zN.ConnectivityState.IDLE) this.updateState(zN.ConnectivityState.TRANSIENT_FAILURE, new aU6.UnavailablePicker(A), A.details), this.onFailedResolution(A)
        }
        exitIdle() {
            if (this.currentState === zN.ConnectivityState.IDLE || this.currentState === zN.ConnectivityState.TRANSIENT_FAILURE)
                if (this.backoffTimeout.isRunning()) this.continueResolving = !0;
                else this.updateResolution();
            this.childLoadBalancer.exitIdle()
        }
        updateAddressList(A, q) {
            throw Error("updateAddressList not supported on ResolvingLoadBalancer")
        }
        resetBackoff() {
            this.backoffTimeout.reset(), this.childLoadBalancer.resetBackoff()
        }
        destroy() {
            this.childLoadBalancer.destroy(), this.innerResolver.destroy(), this.backoffTimeout.reset(), this.backoffTimeout.stop(), this.latestChildState = zN.ConnectivityState.IDLE, this.latestChildPicker = new aU6.QueuePicker(this), this.currentState = zN.ConnectivityState.IDLE, this.previousServiceConfig = null, this.continueResolving = !1
        }
        getTypeName() {
            return "resolving_load_balancer"
        }
    }
    _x4.ResolvingLoadBalancer = zx4
})
// @from(Ln 303983, Col 4)
jx4 = x(($x4) => {
    Object.defineProperty($x4, "__esModule", {
        value: !0
    });
    $x4.recognizedOptions = void 0;
    $x4.channelOptionsEqual = SOY;
    $x4.recognizedOptions = {
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

    function SOY(A, q) {
        let K = Object.keys(A).sort(),
            Y = Object.keys(q).sort();
        if (K.length !== Y.length) return !1;
        for (let z = 0; z < K.length; z += 1) {
            if (K[z] !== Y[z]) return !1;
            if (A[K[z]] !== q[Y[z]]) return !1
        }
        return !0
    }
})
// @from(Ln 304033, Col 4)
_N = x((Px4) => {
    Object.defineProperty(Px4, "__esModule", {
        value: !0
    });
    Px4.EndpointMap = void 0;
    Px4.isTcpSubchannelAddress = tU6;
    Px4.subchannelAddressEqual = nf1;
    Px4.subchannelAddressToString = Mx4;
    Px4.stringToSubchannelAddress = bOY;
    Px4.endpointEqual = xOY;
    Px4.endpointToString = uOY;
    Px4.endpointHasAddress = Dx4;
    var Jx4 = x6("net");

    function tU6(A) {
        return "port" in A
    }

    function nf1(A, q) {
        if (!A && !q) return !0;
        if (!A || !q) return !1;
        if (tU6(A)) return tU6(q) && A.host === q.host && A.port === q.port;
        else return !tU6(q) && A.path === q.path
    }

    function Mx4(A) {
        if (tU6(A))
            if ((0, Jx4.isIPv6)(A.host)) return "[" + A.host + "]:" + A.port;
            else return A.host + ":" + A.port;
        else return A.path
    }
    var IOY = 443;

    function bOY(A, q) {
        if ((0, Jx4.isIP)(A)) return {
            host: A,
            port: q !== null && q !== void 0 ? q : IOY
        };
        else return {
            path: A
        }
    }

    function xOY(A, q) {
        if (A.addresses.length !== q.addresses.length) return !1;
        for (let K = 0; K < A.addresses.length; K++)
            if (!nf1(A.addresses[K], q.addresses[K])) return !1;
        return !0
    }

    function uOY(A) {
        return "[" + A.addresses.map(Mx4).join(", ") + "]"
    }

    function Dx4(A, q) {
        for (let K of A.addresses)
            if (nf1(K, q)) return !0;
        return !1
    }

    function sU6(A, q) {
        if (A.addresses.length !== q.addresses.length) return !1;
        for (let K of A.addresses) {
            let Y = !1;
            for (let z of q.addresses)
                if (nf1(K, z)) {
                    Y = !0;
                    break
                } if (!Y) return !1
        }
        return !0
    }
    class Xx4 {
        constructor() {
            this.map = new Set
        }
        get size() {
            return this.map.size
        }
        getForSubchannelAddress(A) {
            for (let q of this.map)
                if (Dx4(q.key, A)) return q.value;
            return
        }
        deleteMissing(A) {
            let q = [];
            for (let K of this.map) {
                let Y = !1;
                for (let z of A)
                    if (sU6(z, K.key)) Y = !0;
                if (!Y) q.push(K.value), this.map.delete(K)
            }
            return q
        }
        get(A) {
            for (let q of this.map)
                if (sU6(A, q.key)) return q.value;
            return
        }
        set(A, q) {
            for (let K of this.map)
                if (sU6(A, K.key)) {
                    K.value = q;
                    return
                } this.map.add({
                key: A,
                value: q
            })
        }
        delete(A) {
            for (let q of this.map)
                if (sU6(A, q.key)) {
                    this.map.delete(q);
                    return
                }
        }
        has(A) {
            for (let q of this.map)
                if (sU6(A, q.key)) return !0;
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
    Px4.EndpointMap = Xx4
})
// @from(Ln 304166, Col 4)
Ex4 = x((kx4) => {
    Object.defineProperty(kx4, "t", {
        value: !0
    });
    class iS8 {
        constructor(A, q, K = 1) {
            this.i = void 0, this.h = void 0, this.o = void 0, this.u = A, this.l = q, this.p = K
        }
        I() {
            let A = this,
                q = A.o.o === A;
            if (q && A.p === 1) A = A.h;
            else if (A.i) {
                A = A.i;
                while (A.h) A = A.h
            } else {
                if (q) return A.o;
                let K = A.o;
                while (K.i === A) A = K, K = A.o;
                A = K
            }
            return A
        }
        B() {
            let A = this;
            if (A.h) {
                A = A.h;
                while (A.i) A = A.i;
                return A
            } else {
                let q = A.o;
                while (q.h === A) A = q, q = A.o;
                if (A.h !== q) return q;
                else return A
            }
        }
        _() {
            let A = this.o,
                q = this.h,
                K = q.i;
            if (A.o === this) A.o = q;
            else if (A.i === this) A.i = q;
            else A.h = q;
            if (q.o = A, q.i = this, this.o = q, this.h = K, K) K.o = this;
            return q
        }
        g() {
            let A = this.o,
                q = this.i,
                K = q.h;
            if (A.o === this) A.o = q;
            else if (A.i === this) A.i = q;
            else A.h = q;
            if (q.o = A, q.h = this, this.o = q, this.i = K, K) K.o = this;
            return q
        }
    }
    class Zx4 extends iS8 {
        constructor() {
            super(...arguments);
            this.M = 1
        }
        _() {
            let A = super._();
            return this.O(), A.O(), A
        }
        g() {
            let A = super.g();
            return this.O(), A.O(), A
        }
        O() {
            if (this.M = 1, this.i) this.M += this.i.M;
            if (this.h) this.M += this.h.M
        }
    }
    class Gx4 {
        constructor(A = 0) {
            this.iteratorType = A
        }
        equals(A) {
            return this.T === A.T
        }
    }
    class fx4 {
        constructor() {
            this.m = 0
        }
        get length() {
            return this.m
        }
        size() {
            return this.m
        }
        empty() {
            return this.m === 0
        }
    }
    class Tx4 extends fx4 {}

    function JY6() {
        throw RangeError("Iterator access denied!")
    }
    class vx4 extends Tx4 {
        constructor(A = function(K, Y) {
            if (K < Y) return -1;
            if (K > Y) return 1;
            return 0
        }, q = !1) {
            super();
            this.v = void 0, this.A = A, this.enableIndex = q, this.N = q ? Zx4 : iS8, this.C = new this.N
        }
        R(A, q) {
            let K = this.C;
            while (A) {
                let Y = this.A(A.u, q);
                if (Y < 0) A = A.h;
                else if (Y > 0) K = A, A = A.i;
                else return A
            }
            return K
        }
        K(A, q) {
            let K = this.C;
            while (A)
                if (this.A(A.u, q) <= 0) A = A.h;
                else K = A, A = A.i;
            return K
        }
        L(A, q) {
            let K = this.C;
            while (A) {
                let Y = this.A(A.u, q);
                if (Y < 0) K = A, A = A.h;
                else if (Y > 0) A = A.i;
                else return A
            }
            return K
        }
        k(A, q) {
            let K = this.C;
            while (A)
                if (this.A(A.u, q) < 0) K = A, A = A.h;
                else A = A.i;
            return K
        }
        P(A) {
            while (!0) {
                let q = A.o;
                if (q === this.C) return;
                if (A.p === 1) {
                    A.p = 0;
                    return
                }
                if (A === q.i) {
                    let K = q.h;
                    if (K.p === 1)
                        if (K.p = 0, q.p = 1, q === this.v) this.v = q._();
                        else q._();
                    else if (K.h && K.h.p === 1) {
                        if (K.p = q.p, q.p = 0, K.h.p = 0, q === this.v) this.v = q._();
                        else q._();
                        return
                    } else if (K.i && K.i.p === 1) K.p = 1, K.i.p = 0, K.g();
                    else K.p = 1, A = q
                } else {
                    let K = q.i;
                    if (K.p === 1)
                        if (K.p = 0, q.p = 1, q === this.v) this.v = q.g();
                        else q.g();
                    else if (K.i && K.i.p === 1) {
                        if (K.p = q.p, q.p = 0, K.i.p = 0, q === this.v) this.v = q.g();
                        else q.g();
                        return
                    } else if (K.h && K.h.p === 1) K.p = 1, K.h.p = 0, K._();
                    else K.p = 1, A = q
                }
            }
        }
        S(A) {
            if (this.m === 1) {
                this.clear();
                return
            }
            let q = A;
            while (q.i || q.h) {
                if (q.h) {
                    q = q.h;
                    while (q.i) q = q.i
                } else q = q.i;
                let Y = A.u;
                A.u = q.u, q.u = Y;
                let z = A.l;
                A.l = q.l, q.l = z, A = q
            }
            if (this.C.i === q) this.C.i = q.o;
            else if (this.C.h === q) this.C.h = q.o;
            this.P(q);
            let K = q.o;
            if (q === K.i) K.i = void 0;
            else K.h = void 0;
            if (this.m -= 1, this.v.p = 0, this.enableIndex)
                while (K !== this.C) K.M -= 1, K = K.o
        }
        U(A) {
            let q = typeof A === "number" ? A : void 0,
                K = typeof A === "function" ? A : void 0,
                Y = typeof A > "u" ? [] : void 0,
                z = 0,
                _ = this.v,
                w = [];
            while (w.length || _)
                if (_) w.push(_), _ = _.i;
                else {
                    if (_ = w.pop(), z === q) return _;
                    Y && Y.push(_), K && K(_, z, this), z += 1, _ = _.h
                } return Y
        }
        j(A) {
            while (!0) {
                let q = A.o;
                if (q.p === 0) return;
                let K = q.o;
                if (q === K.i) {
                    let Y = K.h;
                    if (Y && Y.p === 1) {
                        if (Y.p = q.p = 0, K === this.v) return;
                        K.p = 1, A = K;
                        continue
                    } else if (A === q.h) {
                        if (A.p = 0, A.i) A.i.o = q;
                        if (A.h) A.h.o = K;
                        if (q.h = A.i, K.i = A.h, A.i = q, A.h = K, K === this.v) this.v = A, this.C.o = A;
                        else {
                            let z = K.o;
                            if (z.i === K) z.i = A;
                            else z.h = A
                        }
                        A.o = K.o, q.o = A, K.o = A, K.p = 1
                    } else {
                        if (q.p = 0, K === this.v) this.v = K.g();
                        else K.g();
                        K.p = 1;
                        return
                    }
                } else {
                    let Y = K.i;
                    if (Y && Y.p === 1) {
                        if (Y.p = q.p = 0, K === this.v) return;
                        K.p = 1, A = K;
                        continue
                    } else if (A === q.i) {
                        if (A.p = 0, A.i) A.i.o = K;
                        if (A.h) A.h.o = q;
                        if (K.h = A.i, q.i = A.h, A.i = K, A.h = q, K === this.v) this.v = A, this.C.o = A;
                        else {
                            let z = K.o;
                            if (z.i === K) z.i = A;
                            else z.h = A
                        }
                        A.o = K.o, q.o = A, K.o = A, K.p = 1
                    } else {
                        if (q.p = 0, K === this.v) this.v = K._();
                        else K._();
                        K.p = 1;
                        return
                    }
                }
                if (this.enableIndex) q.O(), K.O(), A.O();
                return
            }
        }
        q(A, q, K) {
            if (this.v === void 0) return this.m += 1, this.v = new this.N(A, q, 0), this.v.o = this.C, this.C.o = this.C.i = this.C.h = this.v, this.m;
            let Y, z = this.C.i,
                _ = this.A(z.u, A);
            if (_ === 0) return z.l = q, this.m;
            else if (_ > 0) z.i = new this.N(A, q), z.i.o = z, Y = z.i, this.C.i = Y;
            else {
                let w = this.C.h,
                    O = this.A(w.u, A);
                if (O === 0) return w.l = q, this.m;
                else if (O < 0) w.h = new this.N(A, q), w.h.o = w, Y = w.h, this.C.h = Y;
                else {
                    if (K !== void 0) {
                        let $ = K.T;
                        if ($ !== this.C) {
                            let H = this.A($.u, A);
                            if (H === 0) return $.l = q, this.m;
                            else if (H > 0) {
                                let j = $.I(),
                                    J = this.A(j.u, A);
                                if (J === 0) return j.l = q, this.m;
                                else if (J < 0)
                                    if (Y = new this.N(A, q), j.h === void 0) j.h = Y, Y.o = j;
                                    else $.i = Y, Y.o = $
                            }
                        }
                    }
                    if (Y === void 0) {
                        Y = this.v;
                        while (!0) {
                            let $ = this.A(Y.u, A);
                            if ($ > 0) {
                                if (Y.i === void 0) {
                                    Y.i = new this.N(A, q), Y.i.o = Y, Y = Y.i;
                                    break
                                }
                                Y = Y.i
                            } else if ($ < 0) {
                                if (Y.h === void 0) {
                                    Y.h = new this.N(A, q), Y.h.o = Y, Y = Y.h;
                                    break
                                }
                                Y = Y.h
                            } else return Y.l = q, this.m
                        }
                    }
                }
            }
            if (this.enableIndex) {
                let w = Y.o;
                while (w !== this.C) w.M += 1, w = w.o
            }
            return this.j(Y), this.m += 1, this.m
        }
        H(A, q) {
            while (A) {
                let K = this.A(A.u, q);
                if (K < 0) A = A.h;
                else if (K > 0) A = A.i;
                else return A
            }
            return A || this.C
        }
        clear() {
            this.m = 0, this.v = void 0, this.C.o = void 0, this.C.i = this.C.h = void 0
        }
        updateKeyByIterator(A, q) {
            let K = A.T;
            if (K === this.C) JY6();
            if (this.m === 1) return K.u = q, !0;
            let Y = K.B().u;
            if (K === this.C.i) {
                if (this.A(Y, q) > 0) return K.u = q, !0;
                return !1
            }
            let z = K.I().u;
            if (K === this.C.h) {
                if (this.A(z, q) < 0) return K.u = q, !0;
                return !1
            }
            if (this.A(z, q) >= 0 || this.A(Y, q) <= 0) return !1;
            return K.u = q, !0
        }
        eraseElementByPos(A) {
            if (A < 0 || A > this.m - 1) throw RangeError();
            let q = this.U(A);
            return this.S(q), this.m
        }
        eraseElementByKey(A) {
            if (this.m === 0) return !1;
            let q = this.H(this.v, A);
            if (q === this.C) return !1;
            return this.S(q), !0
        }
        eraseElementByIterator(A) {
            let q = A.T;
            if (q === this.C) JY6();
            let K = q.h === void 0;
            if (A.iteratorType === 0) {
                if (K) A.next()
            } else if (!K || q.i === void 0) A.next();
            return this.S(q), A
        }
        getHeight() {
            if (this.m === 0) return 0;

            function A(q) {
                if (!q) return 0;
                return Math.max(A(q.i), A(q.h)) + 1
            }
            return A(this.v)
        }
    }
    class Nx4 extends Gx4 {
        constructor(A, q, K) {
            super(K);
            if (this.T = A, this.C = q, this.iteratorType === 0) this.pre = function() {
                if (this.T === this.C.i) JY6();
                return this.T = this.T.I(), this
            }, this.next = function() {
                if (this.T === this.C) JY6();
                return this.T = this.T.B(), this
            };
            else this.pre = function() {
                if (this.T === this.C.h) JY6();
                return this.T = this.T.B(), this
            }, this.next = function() {
                if (this.T === this.C) JY6();
                return this.T = this.T.I(), this
            }
        }
        get index() {
            let A = this.T,
                q = this.C.o;
            if (A === this.C) {
                if (q) return q.M - 1;
                return 0
            }
            let K = 0;
            if (A.i) K += A.i.M;
            while (A !== q) {
                let Y = A.o;
                if (A === Y.h) {
                    if (K += 1, Y.i) K += Y.i.M
                }
                A = Y
            }
            return K
        }
        isAccessible() {
            return this.T !== this.C
        }
    }
    class $b extends Nx4 {
        constructor(A, q, K, Y) {
            super(A, q, Y);
            this.container = K
        }
        get pointer() {
            if (this.T === this.C) JY6();
            let A = this;
            return new Proxy([], {
                get(q, K) {
                    if (K === "0") return A.T.u;
                    else if (K === "1") return A.T.l;
                    return q[0] = A.T.u, q[1] = A.T.l, q[K]
                },
                set(q, K, Y) {
                    if (K !== "1") throw TypeError("prop must be 1");
                    return A.T.l = Y, !0
                }
            })
        }
        copy() {
            return new $b(this.T, this.C, this.container, this.iteratorType)
        }
    }
    class Vx4 extends vx4 {
        constructor(A = [], q, K) {
            super(q, K);
            let Y = this;
            A.forEach(function(z) {
                Y.setElement(z[0], z[1])
            })
        }
        begin() {
            return new $b(this.C.i || this.C, this.C, this)
        }
        end() {
            return new $b(this.C, this.C, this)
        }
        rBegin() {
            return new $b(this.C.h || this.C, this.C, this, 1)
        }
        rEnd() {
            return new $b(this.C, this.C, this, 1)
        }
        front() {
            if (this.m === 0) return;
            let A = this.C.i;
            return [A.u, A.l]
        }
        back() {
            if (this.m === 0) return;
            let A = this.C.h;
            return [A.u, A.l]
        }
        lowerBound(A) {
            let q = this.R(this.v, A);
            return new $b(q, this.C, this)
        }
        upperBound(A) {
            let q = this.K(this.v, A);
            return new $b(q, this.C, this)
        }
        reverseLowerBound(A) {
            let q = this.L(this.v, A);
            return new $b(q, this.C, this)
        }
        reverseUpperBound(A) {
            let q = this.k(this.v, A);
            return new $b(q, this.C, this)
        }
        forEach(A) {
            this.U(function(q, K, Y) {
                A([q.u, q.l], K, Y)
            })
        }
        setElement(A, q, K) {
            return this.q(A, q, K)
        }
        getElementByPos(A) {
            if (A < 0 || A > this.m - 1) throw RangeError();
            let q = this.U(A);
            return [q.u, q.l]
        }
        find(A) {
            let q = this.H(this.v, A);
            return new $b(q, this.C, this)
        }
        getElementByKey(A) {
            return this.H(this.v, A).l
        }
        union(A) {
            let q = this;
            return A.forEach(function(K) {
                q.setElement(K[0], K[1])
            }), this.m
        }*[Symbol.iterator]() {
            let A = this.m,
                q = this.U();
            for (let K = 0; K < A; ++K) {
                let Y = q[K];
                yield [Y.u, Y.l]
            }
        }
    }
    kx4.OrderedMap = Vx4
})
// @from(Ln 304696, Col 4)
rf1 = x((Lx4) => {
    Object.defineProperty(Lx4, "__esModule", {
        value: !0
    });
    Lx4.registerAdminService = cOY;
    Lx4.addAdminServicesToServer = lOY;
    var yx4 = [];

    function cOY(A, q) {
        yx4.push({
            getServiceDefinition: A,
            getHandlers: q
        })
    }

    function lOY(A) {
        for (let {
                getServiceDefinition: q,
                getHandlers: K
            }
            of yx4) A.addService(q(), K())
    }
})
// @from(Ln 304719, Col 4)
xx4 = x((Ix4) => {
    Object.defineProperty(Ix4, "__esModule", {
        value: !0
    });
    Ix4.ClientDuplexStreamImpl = Ix4.ClientWritableStreamImpl = Ix4.ClientReadableStreamImpl = Ix4.ClientUnaryCallImpl = void 0;
    Ix4.callErrorFromStatus = oOY;
    var rOY = x6("events"),
        nS8 = x6("stream"),
        eU6 = a3();

    function oOY(A, q) {
        let K = `${A.code} ${eU6.Status[A.code]}: ${A.details}`,
            z = `${Error(K).stack}
for call at
${q}`;
        return Object.assign(Error(K), A, {
            stack: z
        })
    }
    class Rx4 extends rOY.EventEmitter {
        constructor() {
            super()
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(eU6.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
    }
    Ix4.ClientUnaryCallImpl = Rx4;
    class hx4 extends nS8.Readable {
        constructor(A) {
            super({
                objectMode: !0
            });
            this.deserialize = A
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(eU6.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
        _read(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.startRead()
        }
    }
    Ix4.ClientReadableStreamImpl = hx4;
    class Sx4 extends nS8.Writable {
        constructor(A) {
            super({
                objectMode: !0
            });
            this.serialize = A
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(eU6.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
        _write(A, q, K) {
            var Y;
            let z = {
                    callback: K
                },
                _ = Number(q);
            if (!Number.isNaN(_)) z.flags = _;
            (Y = this.call) === null || Y === void 0 || Y.sendMessageWithContext(z, A)
        }
        _final(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.halfClose(), A()
        }
    }
    Ix4.ClientWritableStreamImpl = Sx4;
    class Cx4 extends nS8.Duplex {
        constructor(A, q) {
            super({
                objectMode: !0
            });
            this.serialize = A, this.deserialize = q
        }
        cancel() {
            var A;
            (A = this.call) === null || A === void 0 || A.cancelWithStatus(eU6.Status.CANCELLED, "Cancelled on client")
        }
        getPeer() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getPeer()) !== null && q !== void 0 ? q : "unknown"
        }
        getAuthContext() {
            var A, q;
            return (q = (A = this.call) === null || A === void 0 ? void 0 : A.getAuthContext()) !== null && q !== void 0 ? q : null
        }
        _read(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.startRead()
        }
        _write(A, q, K) {
            var Y;
            let z = {
                    callback: K
                },
                _ = Number(q);
            if (!Number.isNaN(_)) z.flags = _;
            (Y = this.call) === null || Y === void 0 || Y.sendMessageWithContext(z, A)
        }
        _final(A) {
            var q;
            (q = this.call) === null || q === void 0 || q.halfClose(), A()
        }
    }
    Ix4.ClientDuplexStreamImpl = Cx4
})