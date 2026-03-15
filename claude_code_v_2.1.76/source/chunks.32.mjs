
// @from(Ln 77580, Col 4)
Tu = x((a55) => {
    var l55 = L68();
    a55.RETRY_MODES = void 0;
    (function(A) {
        A.STANDARD = "standard", A.ADAPTIVE = "adaptive"
    })(a55.RETRY_MODES || (a55.RETRY_MODES = {}));
    var R68 = 3,
        i55 = a55.RETRY_MODES.STANDARD;
    class cq1 {
        static setTimeoutFn = setTimeout;
        beta;
        minCapacity;
        minFillRate;
        scaleConstant;
        smooth;
        currentCapacity = 0;
        enabled = !1;
        lastMaxRate = 0;
        measuredTxRate = 0;
        requestCount = 0;
        fillRate;
        lastThrottleTime;
        lastTimestamp = 0;
        lastTxRateBucket;
        maxCapacity;
        timeWindow = 0;
        constructor(A) {
            this.beta = A?.beta ?? 0.7, this.minCapacity = A?.minCapacity ?? 1, this.minFillRate = A?.minFillRate ?? 0.5, this.scaleConstant = A?.scaleConstant ?? 0.4, this.smooth = A?.smooth ?? 0.8;
            let q = this.getCurrentTimeInSeconds();
            this.lastThrottleTime = q, this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity
        }
        getCurrentTimeInSeconds() {
            return Date.now() / 1000
        }
        async getSendToken() {
            return this.acquireTokenBucket(1)
        }
        async acquireTokenBucket(A) {
            if (!this.enabled) return;
            if (this.refillTokenBucket(), A > this.currentCapacity) {
                let q = (A - this.currentCapacity) / this.fillRate * 1000;
                await new Promise((K) => cq1.setTimeoutFn(K, q))
            }
            this.currentCapacity = this.currentCapacity - A
        }
        refillTokenBucket() {
            let A = this.getCurrentTimeInSeconds();
            if (!this.lastTimestamp) {
                this.lastTimestamp = A;
                return
            }
            let q = (A - this.lastTimestamp) * this.fillRate;
            this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + q), this.lastTimestamp = A
        }
        updateClientSendingRate(A) {
            let q;
            if (this.updateMeasuredRate(), l55.isThrottlingError(A)) {
                let Y = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
                this.lastMaxRate = Y, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), q = this.cubicThrottle(Y), this.enableTokenBucket()
            } else this.calculateTimeWindow(), q = this.cubicSuccess(this.getCurrentTimeInSeconds());
            let K = Math.min(q, 2 * this.measuredTxRate);
            this.updateTokenBucketRate(K)
        }
        calculateTimeWindow() {
            this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 0.3333333333333333))
        }
        cubicThrottle(A) {
            return this.getPrecise(A * this.beta)
        }
        cubicSuccess(A) {
            return this.getPrecise(this.scaleConstant * Math.pow(A - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate)
        }
        enableTokenBucket() {
            this.enabled = !0
        }
        updateTokenBucketRate(A) {
            this.refillTokenBucket(), this.fillRate = Math.max(A, this.minFillRate), this.maxCapacity = Math.max(A, this.minCapacity), this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity)
        }
        updateMeasuredRate() {
            let A = this.getCurrentTimeInSeconds(),
                q = Math.floor(A * 2) / 2;
            if (this.requestCount++, q > this.lastTxRateBucket) {
                let K = this.requestCount / (q - this.lastTxRateBucket);
                this.measuredTxRate = this.getPrecise(K * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = q
            }
        }
        getPrecise(A) {
            return parseFloat(A.toFixed(8))
        }
    }
    var ZS6 = 100,
        S68 = 20000,
        HlA = 500,
        h68 = 500,
        jlA = 5,
        JlA = 10,
        MlA = 1,
        n55 = "amz-sdk-invocation-id",
        r55 = "amz-sdk-request",
        o55 = () => {
            let A = ZS6;
            return {
                computeNextBackoffDelay: (Y) => {
                    return Math.floor(Math.min(S68, Math.random() * 2 ** Y * A))
                },
                setDelayBase: (Y) => {
                    A = Y
                }
            }
        },
        $lA = ({
            retryDelay: A,
            retryCount: q,
            retryCost: K
        }) => {
            return {
                getRetryCount: () => q,
                getRetryDelay: () => Math.min(S68, A),
                getRetryCost: () => K
            }
        };
    class lq1 {
        maxAttempts;
        mode = a55.RETRY_MODES.STANDARD;
        capacity = h68;
        retryBackoffStrategy = o55();
        maxAttemptsProvider;
        constructor(A) {
            this.maxAttempts = A, this.maxAttemptsProvider = typeof A === "function" ? A : async () => A
        }
        async acquireInitialRetryToken(A) {
            return $lA({
                retryDelay: ZS6,
                retryCount: 0
            })
        }
        async refreshRetryTokenForRetry(A, q) {
            let K = await this.getMaxAttempts();
            if (this.shouldRetry(A, q, K)) {
                let Y = q.errorType;
                this.retryBackoffStrategy.setDelayBase(Y === "THROTTLING" ? HlA : ZS6);
                let z = this.retryBackoffStrategy.computeNextBackoffDelay(A.getRetryCount()),
                    _ = q.retryAfterHint ? Math.max(q.retryAfterHint.getTime() - Date.now() || 0, z) : z,
                    w = this.getCapacityCost(Y);
                return this.capacity -= w, $lA({
                    retryDelay: _,
                    retryCount: A.getRetryCount() + 1,
                    retryCost: w
                })
            }
            throw Error("No retry token available")
        }
        recordSuccess(A) {
            this.capacity = Math.max(h68, this.capacity + (A.getRetryCost() ?? MlA))
        }
        getCapacity() {
            return this.capacity
        }
        async getMaxAttempts() {
            try {
                return await this.maxAttemptsProvider()
            } catch (A) {
                return console.warn(`Max attempts provider could not resolve. Using default of ${R68}`), R68
            }
        }
        shouldRetry(A, q, K) {
            return A.getRetryCount() + 1 < K && this.capacity >= this.getCapacityCost(q.errorType) && this.isRetryableError(q.errorType)
        }
        getCapacityCost(A) {
            return A === "TRANSIENT" ? JlA : jlA
        }
        isRetryableError(A) {
            return A === "THROTTLING" || A === "TRANSIENT"
        }
    }
    class DlA {
        maxAttemptsProvider;
        rateLimiter;
        standardRetryStrategy;
        mode = a55.RETRY_MODES.ADAPTIVE;
        constructor(A, q) {
            this.maxAttemptsProvider = A;
            let {
                rateLimiter: K
            } = q ?? {};
            this.rateLimiter = K ?? new cq1, this.standardRetryStrategy = new lq1(A)
        }
        async acquireInitialRetryToken(A) {
            return await this.rateLimiter.getSendToken(), this.standardRetryStrategy.acquireInitialRetryToken(A)
        }
        async refreshRetryTokenForRetry(A, q) {
            return this.rateLimiter.updateClientSendingRate(q), this.standardRetryStrategy.refreshRetryTokenForRetry(A, q)
        }
        recordSuccess(A) {
            this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(A)
        }
    }
    class XlA extends lq1 {
        computeNextBackoffDelay;
        constructor(A, q = ZS6) {
            super(typeof A === "function" ? A : async () => A);
            if (typeof q === "number") this.computeNextBackoffDelay = () => q;
            else this.computeNextBackoffDelay = q
        }
        async refreshRetryTokenForRetry(A, q) {
            let K = await super.refreshRetryTokenForRetry(A, q);
            return K.getRetryDelay = () => this.computeNextBackoffDelay(K.getRetryCount()), K
        }
    }
    a55.AdaptiveRetryStrategy = DlA;
    a55.ConfiguredRetryStrategy = XlA;
    a55.DEFAULT_MAX_ATTEMPTS = R68;
    a55.DEFAULT_RETRY_DELAY_BASE = ZS6;
    a55.DEFAULT_RETRY_MODE = i55;
    a55.DefaultRateLimiter = cq1;
    a55.INITIAL_RETRY_TOKENS = h68;
    a55.INVOCATION_ID_HEADER = n55;
    a55.MAXIMUM_RETRY_DELAY = S68;
    a55.NO_RETRY_INCREMENT = MlA;
    a55.REQUEST_HEADER = r55;
    a55.RETRY_COST = jlA;
    a55.StandardRetryStrategy = lq1;
    a55.THROTTLING_RETRY_DELAY_BASE = HlA;
    a55.TIMEOUT_RETRY_COST = JlA
})
// @from(Ln 77805, Col 4)
B68 = x((Z35) => {
    Z35.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Z35.HttpAuthLocation || (Z35.HttpAuthLocation = {}));
    Z35.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(Z35.HttpApiKeyAuthLocation || (Z35.HttpApiKeyAuthLocation = {}));
    Z35.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(Z35.EndpointURLScheme || (Z35.EndpointURLScheme = {}));
    Z35.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(Z35.AlgorithmId || (Z35.AlgorithmId = {}));
    var M35 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => Z35.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => Z35.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        D35 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        X35 = (A) => {
            return M35(A)
        },
        P35 = (A) => {
            return D35(A)
        };
    Z35.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(Z35.FieldPosition || (Z35.FieldPosition = {}));
    var W35 = "__smithy_context";
    Z35.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(Z35.IniSectionType || (Z35.IniSectionType = {}));
    Z35.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(Z35.RequestHandlerProtocol || (Z35.RequestHandlerProtocol = {}));
    Z35.SMITHY_CONTEXT_KEY = W35;
    Z35.getDefaultClientConfiguration = X35;
    Z35.resolveDefaultRuntimeConfig = P35
})
// @from(Ln 77870, Col 4)
GlA = x((y35) => {
    var v35 = B68(),
        N35 = (A) => {
            return {
                setHttpHandler(q) {
                    A.httpHandler = q
                },
                httpHandler() {
                    return A.httpHandler
                },
                updateHttpClientConfig(q, K) {
                    A.httpHandler?.updateHttpClientConfig(q, K)
                },
                httpHandlerConfigs() {
                    return A.httpHandler.httpHandlerConfigs()
                }
            }
        },
        V35 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class PlA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = v35.FieldPosition.HEADER,
            values: K = []
        }) {
            this.name = A, this.kind = q, this.values = K
        }
        add(A) {
            this.values.push(A)
        }
        set(A) {
            this.values = A
        }
        remove(A) {
            this.values = this.values.filter((q) => q !== A)
        }
        toString() {
            return this.values.map((A) => A.includes(",") || A.includes(" ") ? `"${A}"` : A).join(", ")
        }
        get() {
            return this.values
        }
    }
    class WlA {
        entries = {};
        encoding;
        constructor({
            fields: A = [],
            encoding: q = "utf-8"
        }) {
            A.forEach(this.setField.bind(this)), this.encoding = q
        }
        setField(A) {
            this.entries[A.name.toLowerCase()] = A
        }
        getField(A) {
            return this.entries[A.toLowerCase()]
        }
        removeField(A) {
            delete this.entries[A.toLowerCase()]
        }
        getByType(A) {
            return Object.values(this.entries).filter((q) => q.kind === A)
        }
    }
    class iq1 {
        method;
        protocol;
        hostname;
        port;
        path;
        query;
        headers;
        username;
        password;
        fragment;
        body;
        constructor(A) {
            this.method = A.method || "GET", this.hostname = A.hostname || "localhost", this.port = A.port, this.query = A.query || {}, this.headers = A.headers || {}, this.body = A.body, this.protocol = A.protocol ? A.protocol.slice(-1) !== ":" ? `${A.protocol}:` : A.protocol : "https:", this.path = A.path ? A.path.charAt(0) !== "/" ? `/${A.path}` : A.path : "/", this.username = A.username, this.password = A.password, this.fragment = A.fragment
        }
        static clone(A) {
            let q = new iq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = k35(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return iq1.clone(this)
        }
    }

    function k35(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class ZlA {
        statusCode;
        reason;
        headers;
        body;
        constructor(A) {
            this.statusCode = A.statusCode, this.reason = A.reason, this.headers = A.headers || {}, this.body = A.body
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return typeof q.statusCode === "number" && typeof q.headers === "object"
        }
    }

    function E35(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    y35.Field = PlA;
    y35.Fields = WlA;
    y35.HttpRequest = iq1;
    y35.HttpResponse = ZlA;
    y35.getHttpHandlerExtensionConfiguration = N35;
    y35.isValidHostname = E35;
    y35.resolveHttpHandlerRuntimeConfig = V35
})
// @from(Ln 78012, Col 4)
ClA = x((Nj6) => {
    var vlA = Pu(),
        U68 = pT(),
        F68 = B68(),
        x35 = dO(),
        flA = FT();
    class NlA {
        config;
        middlewareStack = vlA.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                _ = Y === void 0 && this.config.cacheMiddleware === !0,
                w;
            if (_) {
                if (!this.handlers) this.handlers = new WeakMap;
                let O = this.handlers;
                if (O.has(A.constructor)) w = O.get(A.constructor);
                else w = A.resolveMiddleware(this.middlewareStack, this.config, Y), O.set(A.constructor, w)
            } else delete this.handlers, w = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) w(A).then((O) => z(null, O.output), (O) => z(O)).catch(() => {});
            else return w(A).then((O) => O.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var g68 = "***SensitiveInformation***";

    function p68(A, q) {
        if (q == null) return q;
        let K = x35.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return g68;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return g68
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return g68
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = p68(w, Y[_]);
            return z
        }
        return q
    }
    class d68 {
        middlewareStack = vlA.constructStack();
        schema;
        static classBuilder() {
            return new VlA
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: _,
            inputFilterSensitiveLog: w,
            outputFilterSensitiveLog: O,
            smithyContext: $,
            additionalContext: H,
            CommandCtor: j
        }) {
            for (let P of Y.bind(this)(j, A, q, K)) this.middlewareStack.use(P);
            let J = A.concat(this.middlewareStack),
                {
                    logger: M
                } = q,
                D = {
                    logger: M,
                    clientName: z,
                    commandName: _,
                    inputFilterSensitiveLog: w,
                    outputFilterSensitiveLog: O,
                    [F68.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...H
                },
                {
                    requestHandler: X
                } = q;
            return J.resolve((P) => X.handle(P.request, K || {}), D)
        }
    }
    class VlA {
        _init = () => {};
        _ep = {};
        _middlewareFn = () => [];
        _commandName = "";
        _clientName = "";
        _additionalContext = {};
        _smithyContext = {};
        _inputFilterSensitiveLog = void 0;
        _outputFilterSensitiveLog = void 0;
        _serializer = null;
        _deserializer = null;
        _operationSchema;
        init(A) {
            this._init = A
        }
        ep(A) {
            return this._ep = A, this
        }
        m(A) {
            return this._middlewareFn = A, this
        }
        s(A, q, K = {}) {
            return this._smithyContext = {
                service: A,
                operation: q,
                ...K
            }, this
        }
        c(A = {}) {
            return this._additionalContext = A, this
        }
        n(A, q) {
            return this._clientName = A, this._commandName = q, this
        }
        f(A = (K) => K, q = (K) => K) {
            return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = q, this
        }
        ser(A) {
            return this._serializer = A, this
        }
        de(A) {
            return this._deserializer = A, this
        }
        sc(A) {
            return this._operationSchema = A, this._smithyContext.operationSchema = A, this
        }
        build() {
            let A = this,
                q;
            return q = class extends d68 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let _ = A._operationSchema,
                        w = _?.[4] ?? _?.input,
                        O = _?.[5] ?? _?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? p68.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? p68.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var u35 = "***SensitiveInformation***",
        m35 = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        };
    class vj6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(A) {
            super(A.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return vj6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === vj6) return vj6.isInstance(A);
            if (vj6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var klA = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        ElA = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = g35(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw klA(w, q)
        },
        B35 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                ElA({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        g35 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        F35 = (A) => {
            switch (A) {
                case "standard":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "in-region":
                    return {
                        retryMode: "standard", connectionTimeout: 1100
                    };
                case "cross-region":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "mobile":
                    return {
                        retryMode: "standard", connectionTimeout: 30000
                    };
                default:
                    return {}
            }
        },
        TlA = !1,
        p35 = (A) => {
            if (A && !TlA && parseInt(A.substring(1, A.indexOf("."))) < 16) TlA = !0
        },
        Q35 = (A) => {
            let q = [];
            for (let K in F68.AlgorithmId) {
                let Y = F68.AlgorithmId[K];
                if (A[Y] === void 0) continue;
                q.push({
                    algorithmId: () => Y,
                    checksumConstructor: () => A[Y]
                })
            }
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        U35 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        d35 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        c35 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        ylA = (A) => {
            return Object.assign(Q35(A), d35(A))
        },
        l35 = ylA,
        i35 = (A) => {
            return Object.assign(U35(A), c35(A))
        },
        n35 = (A) => Array.isArray(A) ? A : [A],
        LlA = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = LlA(A[K]);
            return A
        },
        r35 = (A) => {
            return A != null
        };
    class RlA {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function hlA(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, s35(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            SlA(Y, null, _, w)
        }
        return Y
    }
    var o35 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        a35 = (A, q) => {
            let K = {};
            for (let Y in q) SlA(K, A, q, Y);
            return K
        },
        s35 = (A, q, K) => {
            return hlA(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        SlA = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = t35, $ = e35, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        },
        t35 = (A) => A != null,
        e35 = (A) => A,
        A95 = (A) => {
            if (A !== A) return "NaN";
            switch (A) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return A
            }
        },
        q95 = (A) => A.toISOString().replace(".000Z", "Z"),
        Q68 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Q68);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Q68(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(Nj6, "collectBody", {
        enumerable: !0,
        get: function() {
            return U68.collectBody
        }
    });
    Object.defineProperty(Nj6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return U68.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Nj6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return U68.resolvedPath
        }
    });
    Nj6.Client = NlA;
    Nj6.Command = d68;
    Nj6.NoOpLogger = RlA;
    Nj6.SENSITIVE_STRING = u35;
    Nj6.ServiceException = vj6;
    Nj6._json = Q68;
    Nj6.convertMap = o35;
    Nj6.createAggregatedClient = m35;
    Nj6.decorateServiceException = klA;
    Nj6.emitWarningIfUnsupportedVersion = p35;
    Nj6.getArrayIfSingleItem = n35;
    Nj6.getDefaultClientConfiguration = l35;
    Nj6.getDefaultExtensionConfiguration = ylA;
    Nj6.getValueFromTextNode = LlA;
    Nj6.isSerializableHeaderValue = r35;
    Nj6.loadConfigsForDefaultMode = F35;
    Nj6.map = hlA;
    Nj6.resolveDefaultRuntimeConfig = i35;
    Nj6.serializeDateTime = q95;
    Nj6.serializeFloat = A95;
    Nj6.take = a35;
    Nj6.throwDefaultError = ElA;
    Nj6.withBaseException = B35;
    Object.keys(flA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Nj6, A)) Object.defineProperty(Nj6, A, {
            enumerable: !0,
            get: function() {
                return flA[A]
            }
        })
    })
})
// @from(Ln 78482, Col 4)
xlA = x((IlA) => {
    Object.defineProperty(IlA, "__esModule", {
        value: !0
    });
    IlA.isStreamingPayload = void 0;
    var E95 = x6("stream"),
        y95 = (A) => A?.body instanceof E95.Readable || typeof ReadableStream < "u" && A?.body instanceof ReadableStream;
    IlA.isStreamingPayload = y95
})
// @from(Ln 78491, Col 4)
kP = x((F95) => {
    var m$ = Tu(),
        Vj6 = GlA(),
        ar = L68(),
        mlA = ls1(),
        ulA = VW(),
        L95 = ClA(),
        R95 = xlA(),
        h95 = (A, q) => {
            let K = A,
                Y = m$.NO_RETRY_INCREMENT,
                z = m$.RETRY_COST,
                _ = m$.TIMEOUT_RETRY_COST,
                w = A,
                O = (J) => J.name === "TimeoutError" ? _ : z,
                $ = (J) => O(J) <= w;
            return Object.freeze({
                hasRetryTokens: $,
                retrieveRetryTokens: (J) => {
                    if (!$(J)) throw Error("No retry token available");
                    let M = O(J);
                    return w -= M, M
                },
                releaseRetryTokens: (J) => {
                    w += J ?? Y, w = Math.min(w, K)
                }
            })
        },
        BlA = (A, q) => Math.floor(Math.min(m$.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** q * A)),
        glA = (A) => {
            if (!A) return !1;
            return ar.isRetryableByTrait(A) || ar.isClockSkewError(A) || ar.isThrottlingError(A) || ar.isTransientError(A)
        },
        FlA = (A) => {
            if (A instanceof Error) return A;
            if (A instanceof Object) return Object.assign(Error(), A);
            if (typeof A === "string") return Error(A);
            return Error(`AWS SDK error wrapper for ${A}`)
        };
    class i68 {
        maxAttemptsProvider;
        retryDecider;
        delayDecider;
        retryQuota;
        mode = m$.RETRY_MODES.STANDARD;
        constructor(A, q) {
            this.maxAttemptsProvider = A, this.retryDecider = q?.retryDecider ?? glA, this.delayDecider = q?.delayDecider ?? BlA, this.retryQuota = q?.retryQuota ?? h95(m$.INITIAL_RETRY_TOKENS)
        }
        shouldRetry(A, q, K) {
            return q < K && this.retryDecider(A) && this.retryQuota.hasRetryTokens(A)
        }
        async getMaxAttempts() {
            let A;
            try {
                A = await this.maxAttemptsProvider()
            } catch (q) {
                A = m$.DEFAULT_MAX_ATTEMPTS
            }
            return A
        }
        async retry(A, q, K) {
            let Y, z = 0,
                _ = 0,
                w = await this.getMaxAttempts(),
                {
                    request: O
                } = q;
            if (Vj6.HttpRequest.isInstance(O)) O.headers[m$.INVOCATION_ID_HEADER] = mlA.v4();
            while (!0) try {
                if (Vj6.HttpRequest.isInstance(O)) O.headers[m$.REQUEST_HEADER] = `attempt=${z+1}; max=${w}`;
                if (K?.beforeRequest) await K.beforeRequest();
                let {
                    response: $,
                    output: H
                } = await A(q);
                if (K?.afterRequest) K.afterRequest($);
                return this.retryQuota.releaseRetryTokens(Y), H.$metadata.attempts = z + 1, H.$metadata.totalRetryDelay = _, {
                    response: $,
                    output: H
                }
            } catch ($) {
                let H = FlA($);
                if (z++, this.shouldRetry(H, z, w)) {
                    Y = this.retryQuota.retrieveRetryTokens(H);
                    let j = this.delayDecider(ar.isThrottlingError(H) ? m$.THROTTLING_RETRY_DELAY_BASE : m$.DEFAULT_RETRY_DELAY_BASE, z),
                        J = S95(H.$response),
                        M = Math.max(J || 0, j);
                    _ += M, await new Promise((D) => setTimeout(D, M));
                    continue
                }
                if (!H.$metadata) H.$metadata = {};
                throw H.$metadata.attempts = z, H.$metadata.totalRetryDelay = _, H
            }
        }
    }
    var S95 = (A) => {
        if (!Vj6.HttpResponse.isInstance(A)) return;
        let q = Object.keys(A.headers).find((_) => _.toLowerCase() === "retry-after");
        if (!q) return;
        let K = A.headers[q],
            Y = Number(K);
        if (!Number.isNaN(Y)) return Y * 1000;
        return new Date(K).getTime() - Date.now()
    };
    class plA extends i68 {
        rateLimiter;
        constructor(A, q) {
            let {
                rateLimiter: K,
                ...Y
            } = q ?? {};
            super(A, Y);
            this.rateLimiter = K ?? new m$.DefaultRateLimiter, this.mode = m$.RETRY_MODES.ADAPTIVE
        }
        async retry(A, q) {
            return super.retry(A, q, {
                beforeRequest: async () => {
                    return this.rateLimiter.getSendToken()
                },
                afterRequest: (K) => {
                    this.rateLimiter.updateClientSendingRate(K)
                }
            })
        }
    }
    var c68 = "AWS_MAX_ATTEMPTS",
        l68 = "max_attempts",
        C95 = {
            environmentVariableSelector: (A) => {
                let q = A[c68];
                if (!q) return;
                let K = parseInt(q);
                if (Number.isNaN(K)) throw Error(`Environment variable ${c68} mast be a number, got "${q}"`);
                return K
            },
            configFileSelector: (A) => {
                let q = A[l68];
                if (!q) return;
                let K = parseInt(q);
                if (Number.isNaN(K)) throw Error(`Shared config file entry ${l68} mast be a number, got "${q}"`);
                return K
            },
            default: m$.DEFAULT_MAX_ATTEMPTS
        },
        I95 = (A) => {
            let {
                retryStrategy: q,
                retryMode: K,
                maxAttempts: Y
            } = A, z = ulA.normalizeProvider(Y ?? m$.DEFAULT_MAX_ATTEMPTS);
            return Object.assign(A, {
                maxAttempts: z,
                retryStrategy: async () => {
                    if (q) return q;
                    if (await ulA.normalizeProvider(K)() === m$.RETRY_MODES.ADAPTIVE) return new m$.AdaptiveRetryStrategy(z);
                    return new m$.StandardRetryStrategy(z)
                }
            })
        },
        QlA = "AWS_RETRY_MODE",
        UlA = "retry_mode",
        b95 = {
            environmentVariableSelector: (A) => A[QlA],
            configFileSelector: (A) => A[UlA],
            default: m$.DEFAULT_RETRY_MODE
        },
        dlA = () => (A) => async (q) => {
            let {
                request: K
            } = q;
            if (Vj6.HttpRequest.isInstance(K)) delete K.headers[m$.INVOCATION_ID_HEADER], delete K.headers[m$.REQUEST_HEADER];
            return A(q)
        }, clA = {
            name: "omitRetryHeadersMiddleware",
            tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
            relation: "before",
            toMiddleware: "awsAuthMiddleware",
            override: !0
        }, x95 = (A) => ({
            applyToStack: (q) => {
                q.addRelativeTo(dlA(), clA)
            }
        }), llA = (A) => (q, K) => async (Y) => {
            let z = await A.retryStrategy(),
                _ = await A.maxAttempts();
            if (u95(z)) {
                z = z;
                let w = await z.acquireInitialRetryToken(K.partition_id),
                    O = Error(),
                    $ = 0,
                    H = 0,
                    {
                        request: j
                    } = Y,
                    J = Vj6.HttpRequest.isInstance(j);
                if (J) j.headers[m$.INVOCATION_ID_HEADER] = mlA.v4();
                while (!0) try {
                    if (J) j.headers[m$.REQUEST_HEADER] = `attempt=${$+1}; max=${_}`;
                    let {
                        response: M,
                        output: D
                    } = await q(Y);
                    return z.recordSuccess(w), D.$metadata.attempts = $ + 1, D.$metadata.totalRetryDelay = H, {
                        response: M,
                        output: D
                    }
                } catch (M) {
                    let D = m95(M);
                    if (O = FlA(M), J && R95.isStreamingPayload(j)) throw (K.logger instanceof L95.NoOpLogger ? console : K.logger)?.warn("An error was encountered in a non-retryable streaming request."), O;
                    try {
                        w = await z.refreshRetryTokenForRetry(w, D)
                    } catch (P) {
                        if (!O.$metadata) O.$metadata = {};
                        throw O.$metadata.attempts = $ + 1, O.$metadata.totalRetryDelay = H, O
                    }
                    $ = w.getRetryCount();
                    let X = w.getRetryDelay();
                    H += X, await new Promise((P) => setTimeout(P, X))
                }
            } else {
                if (z = z, z?.mode) K.userAgent = [...K.userAgent || [],
                    ["cfg/retry-mode", z.mode]
                ];
                return z.retry(q, Y)
            }
        }, u95 = (A) => typeof A.acquireInitialRetryToken < "u" && typeof A.refreshRetryTokenForRetry < "u" && typeof A.recordSuccess < "u", m95 = (A) => {
            let q = {
                    error: A,
                    errorType: B95(A)
                },
                K = nlA(A.$response);
            if (K) q.retryAfterHint = K;
            return q
        }, B95 = (A) => {
            if (ar.isThrottlingError(A)) return "THROTTLING";
            if (ar.isTransientError(A)) return "TRANSIENT";
            if (ar.isServerError(A)) return "SERVER_ERROR";
            return "CLIENT_ERROR"
        }, ilA = {
            name: "retryMiddleware",
            tags: ["RETRY"],
            step: "finalizeRequest",
            priority: "high",
            override: !0
        }, g95 = (A) => ({
            applyToStack: (q) => {
                q.add(llA(A), ilA)
            }
        }), nlA = (A) => {
            if (!Vj6.HttpResponse.isInstance(A)) return;
            let q = Object.keys(A.headers).find((_) => _.toLowerCase() === "retry-after");
            if (!q) return;
            let K = A.headers[q],
                Y = Number(K);
            if (!Number.isNaN(Y)) return new Date(Y * 1000);
            return new Date(K)
        };
    F95.AdaptiveRetryStrategy = plA;
    F95.CONFIG_MAX_ATTEMPTS = l68;
    F95.CONFIG_RETRY_MODE = UlA;
    F95.ENV_MAX_ATTEMPTS = c68;
    F95.ENV_RETRY_MODE = QlA;
    F95.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = C95;
    F95.NODE_RETRY_MODE_CONFIG_OPTIONS = b95;
    F95.StandardRetryStrategy = i68;
    F95.defaultDelayDecider = BlA;
    F95.defaultRetryDecider = glA;
    F95.getOmitRetryHeadersPlugin = x95;
    F95.getRetryAfterHint = nlA;
    F95.getRetryPlugin = g95;
    F95.omitRetryHeadersMiddleware = dlA;
    F95.omitRetryHeadersMiddlewareOptions = clA;
    F95.resolveRetryConfig = I95;
    F95.retryMiddleware = llA;
    F95.retryMiddlewareOptions = ilA
})
// @from(Ln 78767, Col 4)
e68 = x((HY5) => {
    HY5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(HY5.HttpAuthLocation || (HY5.HttpAuthLocation = {}));
    HY5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(HY5.HttpApiKeyAuthLocation || (HY5.HttpApiKeyAuthLocation = {}));
    HY5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(HY5.EndpointURLScheme || (HY5.EndpointURLScheme = {}));
    HY5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(HY5.AlgorithmId || (HY5.AlgorithmId = {}));
    var zY5 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => HY5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => HY5.AlgorithmId.MD5,
                checksumConstructor: () => A.md5
            });
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        _Y5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        wY5 = (A) => {
            return zY5(A)
        },
        OY5 = (A) => {
            return _Y5(A)
        };
    HY5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(HY5.FieldPosition || (HY5.FieldPosition = {}));
    var $Y5 = "__smithy_context";
    HY5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(HY5.IniSectionType || (HY5.IniSectionType = {}));
    HY5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(HY5.RequestHandlerProtocol || (HY5.RequestHandlerProtocol = {}));
    HY5.SMITHY_CONTEXT_KEY = $Y5;
    HY5.getDefaultClientConfiguration = wY5;
    HY5.resolveDefaultRuntimeConfig = OY5
})
// @from(Ln 78832, Col 4)
fG = x((Ej6) => {
    var alA = Pu(),
        z18 = pT(),
        q18 = e68(),
        DY5 = dO(),
        rlA = FT();
    class slA {
        config;
        middlewareStack = alA.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                _ = Y === void 0 && this.config.cacheMiddleware === !0,
                w;
            if (_) {
                if (!this.handlers) this.handlers = new WeakMap;
                let O = this.handlers;
                if (O.has(A.constructor)) w = O.get(A.constructor);
                else w = A.resolveMiddleware(this.middlewareStack, this.config, Y), O.set(A.constructor, w)
            } else delete this.handlers, w = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) w(A).then((O) => z(null, O.output), (O) => z(O)).catch(() => {});
            else return w(A).then((O) => O.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var A18 = "***SensitiveInformation***";

    function K18(A, q) {
        if (q == null) return q;
        let K = DY5.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return A18;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return A18
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return A18
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = K18(w, Y[_]);
            return z
        }
        return q
    }
    class _18 {
        middlewareStack = alA.constructStack();
        schema;
        static classBuilder() {
            return new tlA
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: _,
            inputFilterSensitiveLog: w,
            outputFilterSensitiveLog: O,
            smithyContext: $,
            additionalContext: H,
            CommandCtor: j
        }) {
            for (let P of Y.bind(this)(j, A, q, K)) this.middlewareStack.use(P);
            let J = A.concat(this.middlewareStack),
                {
                    logger: M
                } = q,
                D = {
                    logger: M,
                    clientName: z,
                    commandName: _,
                    inputFilterSensitiveLog: w,
                    outputFilterSensitiveLog: O,
                    [q18.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...H
                },
                {
                    requestHandler: X
                } = q;
            return J.resolve((P) => X.handle(P.request, K || {}), D)
        }
    }
    class tlA {
        _init = () => {};
        _ep = {};
        _middlewareFn = () => [];
        _commandName = "";
        _clientName = "";
        _additionalContext = {};
        _smithyContext = {};
        _inputFilterSensitiveLog = void 0;
        _outputFilterSensitiveLog = void 0;
        _serializer = null;
        _deserializer = null;
        _operationSchema;
        init(A) {
            this._init = A
        }
        ep(A) {
            return this._ep = A, this
        }
        m(A) {
            return this._middlewareFn = A, this
        }
        s(A, q, K = {}) {
            return this._smithyContext = {
                service: A,
                operation: q,
                ...K
            }, this
        }
        c(A = {}) {
            return this._additionalContext = A, this
        }
        n(A, q) {
            return this._clientName = A, this._commandName = q, this
        }
        f(A = (K) => K, q = (K) => K) {
            return this._inputFilterSensitiveLog = A, this._outputFilterSensitiveLog = q, this
        }
        ser(A) {
            return this._serializer = A, this
        }
        de(A) {
            return this._deserializer = A, this
        }
        sc(A) {
            return this._operationSchema = A, this._smithyContext.operationSchema = A, this
        }
        build() {
            let A = this,
                q;
            return q = class extends _18 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let _ = A._operationSchema,
                        w = _?.[4] ?? _?.input,
                        O = _?.[5] ?? _?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? K18.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? K18.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var XY5 = "***SensitiveInformation***",
        PY5 = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(w, O, $) {
                        let H = new Y(w);
                        if (typeof O === "function") this.send(H, O);
                        else if (typeof $ === "function") {
                            if (typeof O !== "object") throw Error(`Expected http options but got ${typeof O}`);
                            this.send(H, O || {}, $)
                        } else return this.send(H, O)
                    }, _ = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[_] = z
            }
        };
    class kj6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(A) {
            super(A.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = A.name, this.$fault = A.$fault, this.$metadata = A.$metadata
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return kj6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === kj6) return kj6.isInstance(A);
            if (kj6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var elA = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        AiA = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = ZY5(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw elA(w, q)
        },
        WY5 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                AiA({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        ZY5 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        GY5 = (A) => {
            switch (A) {
                case "standard":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "in-region":
                    return {
                        retryMode: "standard", connectionTimeout: 1100
                    };
                case "cross-region":
                    return {
                        retryMode: "standard", connectionTimeout: 3100
                    };
                case "mobile":
                    return {
                        retryMode: "standard", connectionTimeout: 30000
                    };
                default:
                    return {}
            }
        },
        olA = !1,
        fY5 = (A) => {
            if (A && !olA && parseInt(A.substring(1, A.indexOf("."))) < 16) olA = !0
        },
        TY5 = (A) => {
            let q = [];
            for (let K in q18.AlgorithmId) {
                let Y = q18.AlgorithmId[K];
                if (A[Y] === void 0) continue;
                q.push({
                    algorithmId: () => Y,
                    checksumConstructor: () => A[Y]
                })
            }
            return {
                addChecksumAlgorithm(K) {
                    q.push(K)
                },
                checksumAlgorithms() {
                    return q
                }
            }
        },
        vY5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        NY5 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        VY5 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        qiA = (A) => {
            return Object.assign(TY5(A), NY5(A))
        },
        kY5 = qiA,
        EY5 = (A) => {
            return Object.assign(vY5(A), VY5(A))
        },
        yY5 = (A) => Array.isArray(A) ? A : [A],
        KiA = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = KiA(A[K]);
            return A
        },
        LY5 = (A) => {
            return A != null
        };
    class YiA {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function ziA(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, SY5(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            _iA(Y, null, _, w)
        }
        return Y
    }
    var RY5 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        hY5 = (A, q) => {
            let K = {};
            for (let Y in q) _iA(K, A, q, Y);
            return K
        },
        SY5 = (A, q, K) => {
            return ziA(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        _iA = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = CY5, $ = IY5, H = Y] = w;
                if (typeof O === "function" && O(q[H]) || typeof O !== "function" && !!O) A[Y] = $(q[H]);
                return
            }
            let [z, _] = K[Y];
            if (typeof _ === "function") {
                let w, O = z === void 0 && (w = _()) != null,
                    $ = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if (O) A[Y] = w;
                else if ($) A[Y] = _()
            } else {
                let w = z === void 0 && _ != null,
                    O = typeof z === "function" && !!z(_) || typeof z !== "function" && !!z;
                if (w || O) A[Y] = _
            }
        },
        CY5 = (A) => A != null,
        IY5 = (A) => A,
        bY5 = (A) => {
            if (A !== A) return "NaN";
            switch (A) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return A
            }
        },
        xY5 = (A) => A.toISOString().replace(".000Z", "Z"),
        Y18 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Y18);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Y18(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(Ej6, "collectBody", {
        enumerable: !0,
        get: function() {
            return z18.collectBody
        }
    });
    Object.defineProperty(Ej6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return z18.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Ej6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return z18.resolvedPath
        }
    });
    Ej6.Client = slA;
    Ej6.Command = _18;
    Ej6.NoOpLogger = YiA;
    Ej6.SENSITIVE_STRING = XY5;
    Ej6.ServiceException = kj6;
    Ej6._json = Y18;
    Ej6.convertMap = RY5;
    Ej6.createAggregatedClient = PY5;
    Ej6.decorateServiceException = elA;
    Ej6.emitWarningIfUnsupportedVersion = fY5;
    Ej6.getArrayIfSingleItem = yY5;
    Ej6.getDefaultClientConfiguration = kY5;
    Ej6.getDefaultExtensionConfiguration = qiA;
    Ej6.getValueFromTextNode = KiA;
    Ej6.isSerializableHeaderValue = LY5;
    Ej6.loadConfigsForDefaultMode = GY5;
    Ej6.map = ziA;
    Ej6.resolveDefaultRuntimeConfig = EY5;
    Ej6.serializeDateTime = xY5;
    Ej6.serializeFloat = bY5;
    Ej6.take = hY5;
    Ej6.throwDefaultError = AiA;
    Ej6.withBaseException = WY5;
    Object.keys(rlA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Ej6, A)) Object.defineProperty(Ej6, A, {
            enumerable: !0,
            get: function() {
                return rlA[A]
            }
        })
    })
})
// @from(Ln 79302, Col 4)
O18 = x((wiA) => {
    Object.defineProperty(wiA, "__esModule", {
        value: !0
    });
    wiA.resolveHttpAuthSchemeConfig = wiA.defaultSSOOIDCHttpAuthSchemeProvider = wiA.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
    var zz5 = Nw(),
        w18 = VW(),
        _z5 = async (A, q, K) => {
            return {
                operation: (0, w18.getSmithyContext)(q).operation,
                region: await (0, w18.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    wiA.defaultSSOOIDCHttpAuthSchemeParametersProvider = _z5;

    function wz5(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sso-oauth",
                region: A.region
            },
            propertiesExtractor: (q, K) => ({
                signingProperties: {
                    config: q,
                    context: K
                }
            })
        }
    }

    function Oz5(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var $z5 = (A) => {
        let q = [];
        switch (A.operation) {
            case "CreateToken": {
                q.push(Oz5(A));
                break
            }
            default:
                q.push(wz5(A))
        }
        return q
    };
    wiA.defaultSSOOIDCHttpAuthSchemeProvider = $z5;
    var Hz5 = (A) => {
        let q = (0, zz5.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, w18.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    wiA.resolveHttpAuthSchemeConfig = Hz5
})
// @from(Ln 79361, Col 4)
nq1 = x((zJ_, Mz5) => {
    Mz5.exports = {
        name: "@aws-sdk/nested-clients",
        version: "3.936.0",
        description: "Nested clients for AWS SDK packages.",
        main: "./dist-cjs/index.js",
        module: "./dist-es/index.js",
        types: "./dist-types/index.d.ts",
        scripts: {
            build: "yarn lint && concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline nested-clients",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            lint: "node ../../scripts/validation/submodules-linter.js --pkg nested-clients",
            test: "yarn g:vitest run",
            "test:watch": "yarn g:vitest watch"
        },
        engines: {
            node: ">=18.0.0"
        },
        sideEffects: !1,
        author: {
            name: "AWS SDK for JavaScript Team",
            url: "https://aws.amazon.com/javascript/"
        },
        license: "Apache-2.0",
        dependencies: {
            "@aws-crypto/sha256-browser": "5.2.0",
            "@aws-crypto/sha256-js": "5.2.0",
            "@aws-sdk/core": "3.936.0",
            "@aws-sdk/middleware-host-header": "3.936.0",
            "@aws-sdk/middleware-logger": "3.936.0",
            "@aws-sdk/middleware-recursion-detection": "3.936.0",
            "@aws-sdk/middleware-user-agent": "3.936.0",
            "@aws-sdk/region-config-resolver": "3.936.0",
            "@aws-sdk/types": "3.936.0",
            "@aws-sdk/util-endpoints": "3.936.0",
            "@aws-sdk/util-user-agent-browser": "3.936.0",
            "@aws-sdk/util-user-agent-node": "3.936.0",
            "@smithy/config-resolver": "^4.4.3",
            "@smithy/core": "^3.18.5",
            "@smithy/fetch-http-handler": "^5.3.6",
            "@smithy/hash-node": "^4.2.5",
            "@smithy/invalid-dependency": "^4.2.5",
            "@smithy/middleware-content-length": "^4.2.5",
            "@smithy/middleware-endpoint": "^4.3.12",
            "@smithy/middleware-retry": "^4.4.12",
            "@smithy/middleware-serde": "^4.2.6",
            "@smithy/middleware-stack": "^4.2.5",
            "@smithy/node-config-provider": "^4.3.5",
            "@smithy/node-http-handler": "^4.4.5",
            "@smithy/protocol-http": "^5.3.5",
            "@smithy/smithy-client": "^4.9.8",
            "@smithy/types": "^4.9.0",
            "@smithy/url-parser": "^4.2.5",
            "@smithy/util-base64": "^4.3.0",
            "@smithy/util-body-length-browser": "^4.2.0",
            "@smithy/util-body-length-node": "^4.2.1",
            "@smithy/util-defaults-mode-browser": "^4.3.11",
            "@smithy/util-defaults-mode-node": "^4.2.14",
            "@smithy/util-endpoints": "^3.2.5",
            "@smithy/util-middleware": "^4.2.5",
            "@smithy/util-retry": "^4.2.5",
            "@smithy/util-utf8": "^4.2.0",
            tslib: "^2.6.2"
        },
        devDependencies: {
            concurrently: "7.0.0",
            "downlevel-dts": "0.10.1",
            rimraf: "3.0.2",
            typescript: "~5.8.3"
        },
        typesVersions: {
            "<4.0": {
                "dist-types/*": ["dist-types/ts3.4/*"]
            }
        },
        files: ["./signin.d.ts", "./signin.js", "./sso-oidc.d.ts", "./sso-oidc.js", "./sts.d.ts", "./sts.js", "dist-*/**"],
        browser: {
            "./dist-es/submodules/signin/runtimeConfig": "./dist-es/submodules/signin/runtimeConfig.browser",
            "./dist-es/submodules/sso-oidc/runtimeConfig": "./dist-es/submodules/sso-oidc/runtimeConfig.browser",
            "./dist-es/submodules/sts/runtimeConfig": "./dist-es/submodules/sts/runtimeConfig.browser"
        },
        "react-native": {},
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/packages/nested-clients",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "packages/nested-clients"
        },
        exports: {
            "./package.json": "./package.json",
            "./sso-oidc": {
                types: "./dist-types/submodules/sso-oidc/index.d.ts",
                module: "./dist-es/submodules/sso-oidc/index.js",
                node: "./dist-cjs/submodules/sso-oidc/index.js",
                import: "./dist-es/submodules/sso-oidc/index.js",
                require: "./dist-cjs/submodules/sso-oidc/index.js"
            },
            "./sts": {
                types: "./dist-types/submodules/sts/index.d.ts",
                module: "./dist-es/submodules/sts/index.js",
                node: "./dist-cjs/submodules/sts/index.js",
                import: "./dist-es/submodules/sts/index.js",
                require: "./dist-cjs/submodules/sts/index.js"
            },
            "./signin": {
                types: "./dist-types/submodules/signin/index.d.ts",
                module: "./dist-es/submodules/signin/index.js",
                node: "./dist-cjs/submodules/signin/index.js",
                import: "./dist-es/submodules/signin/index.js",
                require: "./dist-cjs/submodules/signin/index.js"
            }
        }
    }
})
// @from(Ln 79480, Col 4)
kQ = x((Gz5) => {
    var $iA = x6("os"),
        $18 = x6("process"),
        Dz5 = fu(),
        HiA = {
            isCrtAvailable: !1
        },
        Xz5 = () => {
            if (HiA.isCrtAvailable) return ["md/crt-avail"];
            return null
        },
        jiA = ({
            serviceId: A,
            clientVersion: q
        }) => {
            return async (K) => {
                let Y = [
                        ["aws-sdk-js", q],
                        ["ua", "2.1"],
                        [`os/${$iA.platform()}`, $iA.release()],
                        ["lang/js"],
                        ["md/nodejs", `${$18.versions.node}`]
                    ],
                    z = Xz5();
                if (z) Y.push(z);
                if (A) Y.push([`api/${A}`, q]);
                if ($18.env.AWS_EXECUTION_ENV) Y.push([`exec-env/${$18.env.AWS_EXECUTION_ENV}`]);
                let _ = await K?.userAgentAppId?.();
                return _ ? [...Y, [`app/${_}`]] : [...Y]
            }
        },
        Pz5 = jiA,
        JiA = "AWS_SDK_UA_APP_ID",
        MiA = "sdk_ua_app_id",
        Wz5 = "sdk-ua-app-id",
        Zz5 = {
            environmentVariableSelector: (A) => A[JiA],
            configFileSelector: (A) => A[MiA] ?? A[Wz5],
            default: Dz5.DEFAULT_UA_APP_ID
        };
    Gz5.NODE_APP_ID_CONFIG_OPTIONS = Zz5;
    Gz5.UA_APP_ID_ENV_NAME = JiA;
    Gz5.UA_APP_ID_INI_NAME = MiA;
    Gz5.createDefaultUserAgentProvider = jiA;
    Gz5.crtAvailability = HiA;
    Gz5.defaultUserAgent = Pz5
})
// @from(Ln 79527, Col 4)
DiA = x((yz5) => {
    var Ez5 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    yz5.isArrayBuffer = Ez5
})
// @from(Ln 79531, Col 4)
XiA = x((Cz5) => {
    var Rz5 = DiA(),
        H18 = x6("buffer"),
        hz5 = (A, q = 0, K = A.byteLength - q) => {
            if (!Rz5.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return H18.Buffer.from(A, q, K)
        },
        Sz5 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? H18.Buffer.from(A, q) : H18.Buffer.from(A)
        };
    Cz5.fromArrayBuffer = hz5;
    Cz5.fromString = Sz5
})
// @from(Ln 79545, Col 4)
EQ = x((mz5) => {
    var j18 = XiA(),
        xz5 = C_(),
        uz5 = x6("buffer"),
        PiA = x6("crypto");
    class ZiA {
        algorithmIdentifier;
        secret;
        hash;
        constructor(A, q) {
            this.algorithmIdentifier = A, this.secret = q, this.reset()
        }
        update(A, q) {
            this.hash.update(xz5.toUint8Array(WiA(A, q)))
        }
        digest() {
            return Promise.resolve(this.hash.digest())
        }
        reset() {
            this.hash = this.secret ? PiA.createHmac(this.algorithmIdentifier, WiA(this.secret)) : PiA.createHash(this.algorithmIdentifier)
        }
    }

    function WiA(A, q) {
        if (uz5.Buffer.isBuffer(A)) return A;
        if (typeof A === "string") return j18.fromString(A, q);
        if (ArrayBuffer.isView(A)) return j18.fromArrayBuffer(A.buffer, A.byteOffset, A.byteLength);
        return j18.fromArrayBuffer(A)
    }
    mz5.Hash = ZiA
})
// @from(Ln 79576, Col 4)
yQ = x((Fz5) => {
    var J18 = x6("node:fs"),
        gz5 = (A) => {
            if (!A) return 0;
            if (typeof A === "string") return Buffer.byteLength(A);
            else if (typeof A.byteLength === "number") return A.byteLength;
            else if (typeof A.size === "number") return A.size;
            else if (typeof A.start === "number" && typeof A.end === "number") return A.end + 1 - A.start;
            else if (A instanceof J18.ReadStream) {
                if (A.path != null) return J18.lstatSync(A.path).size;
                else if (typeof A.fd === "number") return J18.fstatSync(A.fd).size
            }
            throw Error(`Body Length computation failed for ${A}`)
        };
    Fz5.calculateBodyLength = gz5
})