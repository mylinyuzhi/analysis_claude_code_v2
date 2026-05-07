
// @from(Ln 81675, Col 4)
lU = p((ev3) => {
    var rv3 = DX1();
    ev3.RETRY_MODES = void 0;
    (function(q) {
        q.STANDARD = "standard", q.ADAPTIVE = "adaptive"
    })(ev3.RETRY_MODES || (ev3.RETRY_MODES = {}));
    var ZX1 = 3,
        ov3 = ev3.RETRY_MODES.STANDARD;
    class kW8 {
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
        constructor(q) {
            this.beta = q?.beta ?? 0.7, this.minCapacity = q?.minCapacity ?? 1, this.minFillRate = q?.minFillRate ?? 0.5, this.scaleConstant = q?.scaleConstant ?? 0.4, this.smooth = q?.smooth ?? 0.8;
            let K = this.getCurrentTimeInSeconds();
            this.lastThrottleTime = K, this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds()), this.fillRate = this.minFillRate, this.maxCapacity = this.minCapacity
        }
        getCurrentTimeInSeconds() {
            return Date.now() / 1000
        }
        async getSendToken() {
            return this.acquireTokenBucket(1)
        }
        async acquireTokenBucket(q) {
            if (!this.enabled) return;
            if (this.refillTokenBucket(), q > this.currentCapacity) {
                let K = (q - this.currentCapacity) / this.fillRate * 1000;
                await new Promise((_) => kW8.setTimeoutFn(_, K))
            }
            this.currentCapacity = this.currentCapacity - q
        }
        refillTokenBucket() {
            let q = this.getCurrentTimeInSeconds();
            if (!this.lastTimestamp) {
                this.lastTimestamp = q;
                return
            }
            let K = (q - this.lastTimestamp) * this.fillRate;
            this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + K), this.lastTimestamp = q
        }
        updateClientSendingRate(q) {
            let K;
            if (this.updateMeasuredRate(), rv3.isThrottlingError(q)) {
                let z = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
                this.lastMaxRate = z, this.calculateTimeWindow(), this.lastThrottleTime = this.getCurrentTimeInSeconds(), K = this.cubicThrottle(z), this.enableTokenBucket()
            } else this.calculateTimeWindow(), K = this.cubicSuccess(this.getCurrentTimeInSeconds());
            let _ = Math.min(K, 2 * this.measuredTxRate);
            this.updateTokenBucketRate(_)
        }
        calculateTimeWindow() {
            this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 0.3333333333333333))
        }
        cubicThrottle(q) {
            return this.getPrecise(q * this.beta)
        }
        cubicSuccess(q) {
            return this.getPrecise(this.scaleConstant * Math.pow(q - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate)
        }
        enableTokenBucket() {
            this.enabled = !0
        }
        updateTokenBucketRate(q) {
            this.refillTokenBucket(), this.fillRate = Math.max(q, this.minFillRate), this.maxCapacity = Math.max(q, this.minCapacity), this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity)
        }
        updateMeasuredRate() {
            let q = this.getCurrentTimeInSeconds(),
                K = Math.floor(q * 2) / 2;
            if (this.requestCount++, K > this.lastTxRateBucket) {
                let _ = this.requestCount / (K - this.lastTxRateBucket);
                this.measuredTxRate = this.getPrecise(_ * this.smooth + this.measuredTxRate * (1 - this.smooth)), this.requestCount = 0, this.lastTxRateBucket = K
            }
        }
        getPrecise(q) {
            return parseFloat(q.toFixed(8))
        }
    }
    var uc6 = 100,
        GX1 = 20000,
        qKq = 500,
        fX1 = 500,
        KKq = 5,
        _Kq = 10,
        zKq = 1,
        av3 = "amz-sdk-invocation-id",
        sv3 = "amz-sdk-request",
        tv3 = () => {
            let q = uc6;
            return {
                computeNextBackoffDelay: (z) => {
                    return Math.floor(Math.min(GX1, Math.random() * 2 ** z * q))
                },
                setDelayBase: (z) => {
                    q = z
                }
            }
        },
        e4q = ({
            retryDelay: q,
            retryCount: K,
            retryCost: _
        }) => {
            return {
                getRetryCount: () => K,
                getRetryDelay: () => Math.min(GX1, q),
                getRetryCost: () => _
            }
        };
    class NW8 {
        maxAttempts;
        mode = ev3.RETRY_MODES.STANDARD;
        capacity = fX1;
        retryBackoffStrategy = tv3();
        maxAttemptsProvider;
        constructor(q) {
            this.maxAttempts = q, this.maxAttemptsProvider = typeof q === "function" ? q : async () => q
        }
        async acquireInitialRetryToken(q) {
            return e4q({
                retryDelay: uc6,
                retryCount: 0
            })
        }
        async refreshRetryTokenForRetry(q, K) {
            let _ = await this.getMaxAttempts();
            if (this.shouldRetry(q, K, _)) {
                let z = K.errorType;
                this.retryBackoffStrategy.setDelayBase(z === "THROTTLING" ? qKq : uc6);
                let Y = this.retryBackoffStrategy.computeNextBackoffDelay(q.getRetryCount()),
                    A = K.retryAfterHint ? Math.max(K.retryAfterHint.getTime() - Date.now() || 0, Y) : Y,
                    O = this.getCapacityCost(z);
                return this.capacity -= O, e4q({
                    retryDelay: A,
                    retryCount: q.getRetryCount() + 1,
                    retryCost: O
                })
            }
            throw Error("No retry token available")
        }
        recordSuccess(q) {
            this.capacity = Math.max(fX1, this.capacity + (q.getRetryCost() ?? zKq))
        }
        getCapacity() {
            return this.capacity
        }
        async getMaxAttempts() {
            try {
                return await this.maxAttemptsProvider()
            } catch (q) {
                return console.warn(`Max attempts provider could not resolve. Using default of ${ZX1}`), ZX1
            }
        }
        shouldRetry(q, K, _) {
            return q.getRetryCount() + 1 < _ && this.capacity >= this.getCapacityCost(K.errorType) && this.isRetryableError(K.errorType)
        }
        getCapacityCost(q) {
            return q === "TRANSIENT" ? _Kq : KKq
        }
        isRetryableError(q) {
            return q === "THROTTLING" || q === "TRANSIENT"
        }
    }
    class YKq {
        maxAttemptsProvider;
        rateLimiter;
        standardRetryStrategy;
        mode = ev3.RETRY_MODES.ADAPTIVE;
        constructor(q, K) {
            this.maxAttemptsProvider = q;
            let {
                rateLimiter: _
            } = K ?? {};
            this.rateLimiter = _ ?? new kW8, this.standardRetryStrategy = new NW8(q)
        }
        async acquireInitialRetryToken(q) {
            return await this.rateLimiter.getSendToken(), this.standardRetryStrategy.acquireInitialRetryToken(q)
        }
        async refreshRetryTokenForRetry(q, K) {
            return this.rateLimiter.updateClientSendingRate(K), this.standardRetryStrategy.refreshRetryTokenForRetry(q, K)
        }
        recordSuccess(q) {
            this.rateLimiter.updateClientSendingRate({}), this.standardRetryStrategy.recordSuccess(q)
        }
    }
    class AKq extends NW8 {
        computeNextBackoffDelay;
        constructor(q, K = uc6) {
            super(typeof q === "function" ? q : async () => q);
            if (typeof K === "number") this.computeNextBackoffDelay = () => K;
            else this.computeNextBackoffDelay = K
        }
        async refreshRetryTokenForRetry(q, K) {
            let _ = await super.refreshRetryTokenForRetry(q, K);
            return _.getRetryDelay = () => this.computeNextBackoffDelay(_.getRetryCount()), _
        }
    }
    ev3.AdaptiveRetryStrategy = YKq;
    ev3.ConfiguredRetryStrategy = AKq;
    ev3.DEFAULT_MAX_ATTEMPTS = ZX1;
    ev3.DEFAULT_RETRY_DELAY_BASE = uc6;
    ev3.DEFAULT_RETRY_MODE = ov3;
    ev3.DefaultRateLimiter = kW8;
    ev3.INITIAL_RETRY_TOKENS = fX1;
    ev3.INVOCATION_ID_HEADER = av3;
    ev3.MAXIMUM_RETRY_DELAY = GX1;
    ev3.NO_RETRY_INCREMENT = zKq;
    ev3.REQUEST_HEADER = sv3;
    ev3.RETRY_COST = KKq;
    ev3.StandardRetryStrategy = NW8;
    ev3.THROTTLING_RETRY_DELAY_BASE = qKq;
    ev3.TIMEOUT_RETRY_COST = _Kq
})
// @from(Ln 81900, Col 4)
yX1 = p((vT3) => {
    vT3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(vT3.HttpAuthLocation || (vT3.HttpAuthLocation = {}));
    vT3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(vT3.HttpApiKeyAuthLocation || (vT3.HttpApiKeyAuthLocation = {}));
    vT3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(vT3.EndpointURLScheme || (vT3.EndpointURLScheme = {}));
    vT3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(vT3.AlgorithmId || (vT3.AlgorithmId = {}));
    var WT3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => vT3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => vT3.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        DT3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        ZT3 = (q) => {
            return WT3(q)
        },
        fT3 = (q) => {
            return DT3(q)
        };
    vT3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(vT3.FieldPosition || (vT3.FieldPosition = {}));
    var GT3 = "__smithy_context";
    vT3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(vT3.IniSectionType || (vT3.IniSectionType = {}));
    vT3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(vT3.RequestHandlerProtocol || (vT3.RequestHandlerProtocol = {}));
    vT3.SMITHY_CONTEXT_KEY = GT3;
    vT3.getDefaultClientConfiguration = ZT3;
    vT3.resolveDefaultRuntimeConfig = fT3
})
// @from(Ln 81965, Col 4)
jKq = p((RT3) => {
    var NT3 = yX1(),
        ET3 = (q) => {
            return {
                setHttpHandler(K) {
                    q.httpHandler = K
                },
                httpHandler() {
                    return q.httpHandler
                },
                updateHttpClientConfig(K, _) {
                    q.httpHandler?.updateHttpClientConfig(K, _)
                },
                httpHandlerConfigs() {
                    return q.httpHandler.httpHandlerConfigs()
                }
            }
        },
        yT3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class OKq {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = NT3.FieldPosition.HEADER,
            values: _ = []
        }) {
            this.name = q, this.kind = K, this.values = _
        }
        add(q) {
            this.values.push(q)
        }
        set(q) {
            this.values = q
        }
        remove(q) {
            this.values = this.values.filter((K) => K !== q)
        }
        toString() {
            return this.values.map((q) => q.includes(",") || q.includes(" ") ? `"${q}"` : q).join(", ")
        }
        get() {
            return this.values
        }
    }
    class wKq {
        entries = {};
        encoding;
        constructor({
            fields: q = [],
            encoding: K = "utf-8"
        }) {
            q.forEach(this.setField.bind(this)), this.encoding = K
        }
        setField(q) {
            this.entries[q.name.toLowerCase()] = q
        }
        getField(q) {
            return this.entries[q.toLowerCase()]
        }
        removeField(q) {
            delete this.entries[q.toLowerCase()]
        }
        getByType(q) {
            return Object.values(this.entries).filter((K) => K.kind === q)
        }
    }
    class EW8 {
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
        constructor(q) {
            this.method = q.method || "GET", this.hostname = q.hostname || "localhost", this.port = q.port, this.query = q.query || {}, this.headers = q.headers || {}, this.body = q.body, this.protocol = q.protocol ? q.protocol.slice(-1) !== ":" ? `${q.protocol}:` : q.protocol : "https:", this.path = q.path ? q.path.charAt(0) !== "/" ? `/${q.path}` : q.path : "/", this.username = q.username, this.password = q.password, this.fragment = q.fragment
        }
        static clone(q) {
            let K = new EW8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = LT3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return EW8.clone(this)
        }
    }

    function LT3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class $Kq {
        statusCode;
        reason;
        headers;
        body;
        constructor(q) {
            this.statusCode = q.statusCode, this.reason = q.reason, this.headers = q.headers || {}, this.body = q.body
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return typeof K.statusCode === "number" && typeof K.headers === "object"
        }
    }

    function hT3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    RT3.Field = OKq;
    RT3.Fields = wKq;
    RT3.HttpRequest = EW8;
    RT3.HttpResponse = $Kq;
    RT3.getHttpHandlerExtensionConfiguration = ET3;
    RT3.isValidHostname = hT3;
    RT3.resolveHttpHandlerRuntimeConfig = yT3
})
// @from(Ln 82107, Col 4)
VKq = p((Lv6) => {
    var XKq = gU(),
        CX1 = XE(),
        hX1 = yX1(),
        BT3 = sj(),
        HKq = JE();
    class MKq {
        config;
        middlewareStack = XKq.constructStack();
        initConfig;
        handlers;
        constructor(q) {
            this.config = q
        }
        send(q, K, _) {
            let z = typeof K !== "function" ? K : void 0,
                Y = typeof K === "function" ? K : _,
                A = z === void 0 && this.config.cacheMiddleware === !0,
                O;
            if (A) {
                if (!this.handlers) this.handlers = new WeakMap;
                let w = this.handlers;
                if (w.has(q.constructor)) O = w.get(q.constructor);
                else O = q.resolveMiddleware(this.middlewareStack, this.config, z), w.set(q.constructor, O)
            } else delete this.handlers, O = q.resolveMiddleware(this.middlewareStack, this.config, z);
            if (Y) O(q).then((w) => Y(null, w.output), (w) => Y(w)).catch(() => {});
            else return O(q).then((w) => w.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var LX1 = "***SensitiveInformation***";

    function RX1(q, K) {
        if (K == null) return K;
        let _ = BT3.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return LX1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return LX1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return LX1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = RX1(O, z[A]);
            return Y
        }
        return K
    }
    class bX1 {
        middlewareStack = XKq.constructStack();
        schema;
        static classBuilder() {
            return new PKq
        }
        resolveMiddlewareWithContext(q, K, _, {
            middlewareFn: z,
            clientName: Y,
            commandName: A,
            inputFilterSensitiveLog: O,
            outputFilterSensitiveLog: w,
            smithyContext: $,
            additionalContext: j,
            CommandCtor: H
        }) {
            for (let W of z.bind(this)(H, q, K, _)) this.middlewareStack.use(W);
            let J = q.concat(this.middlewareStack),
                {
                    logger: X
                } = K,
                M = {
                    logger: X,
                    clientName: Y,
                    commandName: A,
                    inputFilterSensitiveLog: O,
                    outputFilterSensitiveLog: w,
                    [hX1.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...j
                },
                {
                    requestHandler: P
                } = K;
            return J.resolve((W) => P.handle(W.request, _ || {}), M)
        }
    }
    class PKq {
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
        init(q) {
            this._init = q
        }
        ep(q) {
            return this._ep = q, this
        }
        m(q) {
            return this._middlewareFn = q, this
        }
        s(q, K, _ = {}) {
            return this._smithyContext = {
                service: q,
                operation: K,
                ..._
            }, this
        }
        c(q = {}) {
            return this._additionalContext = q, this
        }
        n(q, K) {
            return this._clientName = q, this._commandName = K, this
        }
        f(q = (_) => _, K = (_) => _) {
            return this._inputFilterSensitiveLog = q, this._outputFilterSensitiveLog = K, this
        }
        ser(q) {
            return this._serializer = q, this
        }
        de(q) {
            return this._deserializer = q, this
        }
        sc(q) {
            return this._operationSchema = q, this._smithyContext.operationSchema = q, this
        }
        build() {
            let q = this,
                K;
            return K = class extends bX1 {
                input;
                static getEndpointParameterInstructions() {
                    return q._ep
                }
                constructor(...[_]) {
                    super();
                    this.input = _ ?? {}, q._init(this), this.schema = q._operationSchema
                }
                resolveMiddleware(_, z, Y) {
                    let A = q._operationSchema,
                        O = A?.[4] ?? A?.input,
                        w = A?.[5] ?? A?.output;
                    return this.resolveMiddlewareWithContext(_, z, Y, {
                        CommandCtor: K,
                        middlewareFn: q._middlewareFn,
                        clientName: q._clientName,
                        commandName: q._commandName,
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? RX1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? RX1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var pT3 = "***SensitiveInformation***",
        FT3 = (q, K) => {
            for (let _ of Object.keys(q)) {
                let z = q[_],
                    Y = async function(O, w, $) {
                        let j = new z(O);
                        if (typeof w === "function") this.send(j, w);
                        else if (typeof $ === "function") {
                            if (typeof w !== "object") throw Error(`Expected http options but got ${typeof w}`);
                            this.send(j, w || {}, $)
                        } else return this.send(j, w)
                    }, A = (_[0].toLowerCase() + _.slice(1)).replace(/Command$/, "");
                K.prototype[A] = Y
            }
        };
    class yv6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(q) {
            super(q.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return yv6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === yv6) return yv6.isInstance(q);
            if (yv6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var WKq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        DKq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = UT3(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw WKq(O, K)
        },
        gT3 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                DKq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        UT3 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        QT3 = (q) => {
            switch (q) {
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
        JKq = !1,
        dT3 = (q) => {
            if (q && !JKq && parseInt(q.substring(1, q.indexOf("."))) < 16) JKq = !0
        },
        cT3 = (q) => {
            let K = [];
            for (let _ in hX1.AlgorithmId) {
                let z = hX1.AlgorithmId[_];
                if (q[z] === void 0) continue;
                K.push({
                    algorithmId: () => z,
                    checksumConstructor: () => q[z]
                })
            }
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        lT3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        nT3 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        iT3 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        ZKq = (q) => {
            return Object.assign(cT3(q), nT3(q))
        },
        rT3 = ZKq,
        oT3 = (q) => {
            return Object.assign(lT3(q), iT3(q))
        },
        aT3 = (q) => Array.isArray(q) ? q : [q],
        fKq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = fKq(q[_]);
            return q
        },
        sT3 = (q) => {
            return q != null
        };
    class GKq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function vKq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, qV3(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            TKq(z, null, A, O)
        }
        return z
    }
    var tT3 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        eT3 = (q, K) => {
            let _ = {};
            for (let z in K) TKq(_, q, K, z);
            return _
        },
        qV3 = (q, K, _) => {
            return vKq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        TKq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = KV3, $ = _V3, j = z] = O;
                if (typeof w === "function" && w(K[j]) || typeof w !== "function" && !!w) q[z] = $(K[j]);
                return
            }
            let [Y, A] = _[z];
            if (typeof A === "function") {
                let O, w = Y === void 0 && (O = A()) != null,
                    $ = typeof Y === "function" && !!Y(void 0) || typeof Y !== "function" && !!Y;
                if (w) q[z] = O;
                else if ($) q[z] = A()
            } else {
                let O = Y === void 0 && A != null,
                    w = typeof Y === "function" && !!Y(A) || typeof Y !== "function" && !!Y;
                if (O || w) q[z] = A
            }
        },
        KV3 = (q) => q != null,
        _V3 = (q) => q,
        zV3 = (q) => {
            if (q !== q) return "NaN";
            switch (q) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return q
            }
        },
        YV3 = (q) => q.toISOString().replace(".000Z", "Z"),
        SX1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(SX1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = SX1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(Lv6, "collectBody", {
        enumerable: !0,
        get: function() {
            return CX1.collectBody
        }
    });
    Object.defineProperty(Lv6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return CX1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Lv6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return CX1.resolvedPath
        }
    });
    Lv6.Client = MKq;
    Lv6.Command = bX1;
    Lv6.NoOpLogger = GKq;
    Lv6.SENSITIVE_STRING = pT3;
    Lv6.ServiceException = yv6;
    Lv6._json = SX1;
    Lv6.convertMap = tT3;
    Lv6.createAggregatedClient = FT3;
    Lv6.decorateServiceException = WKq;
    Lv6.emitWarningIfUnsupportedVersion = dT3;
    Lv6.getArrayIfSingleItem = aT3;
    Lv6.getDefaultClientConfiguration = rT3;
    Lv6.getDefaultExtensionConfiguration = ZKq;
    Lv6.getValueFromTextNode = fKq;
    Lv6.isSerializableHeaderValue = sT3;
    Lv6.loadConfigsForDefaultMode = QT3;
    Lv6.map = vKq;
    Lv6.resolveDefaultRuntimeConfig = oT3;
    Lv6.serializeDateTime = YV3;
    Lv6.serializeFloat = zV3;
    Lv6.take = eT3;
    Lv6.throwDefaultError = DKq;
    Lv6.withBaseException = gT3;
    Object.keys(HKq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Lv6, q)) Object.defineProperty(Lv6, q, {
            enumerable: !0,
            get: function() {
                return HKq[q]
            }
        })
    })
})
// @from(Ln 82577, Col 4)
EKq = p((kKq) => {
    Object.defineProperty(kKq, "__esModule", {
        value: !0
    });
    kKq.isStreamingPayload = void 0;
    var hV3 = d6("stream"),
        RV3 = (q) => q?.body instanceof hV3.Readable || typeof ReadableStream < "u" && q?.body instanceof ReadableStream;
    kKq.isStreamingPayload = RV3
})
// @from(Ln 82586, Col 4)
rZ = p((QV3) => {
    var KJ = lU(),
        hv6 = jKq(),
        v76 = DX1(),
        LKq = xj1(),
        yKq = Dv(),
        SV3 = VKq(),
        CV3 = EKq(),
        bV3 = (q, K) => {
            let _ = q,
                z = KJ.NO_RETRY_INCREMENT,
                Y = KJ.RETRY_COST,
                A = KJ.TIMEOUT_RETRY_COST,
                O = q,
                w = (J) => J.name === "TimeoutError" ? A : Y,
                $ = (J) => w(J) <= O;
            return Object.freeze({
                hasRetryTokens: $,
                retrieveRetryTokens: (J) => {
                    if (!$(J)) throw Error("No retry token available");
                    let X = w(J);
                    return O -= X, X
                },
                releaseRetryTokens: (J) => {
                    O += J ?? z, O = Math.min(O, _)
                }
            })
        },
        hKq = (q, K) => Math.floor(Math.min(KJ.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** K * q)),
        RKq = (q) => {
            if (!q) return !1;
            return v76.isRetryableByTrait(q) || v76.isClockSkewError(q) || v76.isThrottlingError(q) || v76.isTransientError(q)
        },
        SKq = (q) => {
            if (q instanceof Error) return q;
            if (q instanceof Object) return Object.assign(Error(), q);
            if (typeof q === "string") return Error(q);
            return Error(`AWS SDK error wrapper for ${q}`)
        };
    class uX1 {
        maxAttemptsProvider;
        retryDecider;
        delayDecider;
        retryQuota;
        mode = KJ.RETRY_MODES.STANDARD;
        constructor(q, K) {
            this.maxAttemptsProvider = q, this.retryDecider = K?.retryDecider ?? RKq, this.delayDecider = K?.delayDecider ?? hKq, this.retryQuota = K?.retryQuota ?? bV3(KJ.INITIAL_RETRY_TOKENS)
        }
        shouldRetry(q, K, _) {
            return K < _ && this.retryDecider(q) && this.retryQuota.hasRetryTokens(q)
        }
        async getMaxAttempts() {
            let q;
            try {
                q = await this.maxAttemptsProvider()
            } catch (K) {
                q = KJ.DEFAULT_MAX_ATTEMPTS
            }
            return q
        }
        async retry(q, K, _) {
            let z, Y = 0,
                A = 0,
                O = await this.getMaxAttempts(),
                {
                    request: w
                } = K;
            if (hv6.HttpRequest.isInstance(w)) w.headers[KJ.INVOCATION_ID_HEADER] = LKq.v4();
            while (!0) try {
                if (hv6.HttpRequest.isInstance(w)) w.headers[KJ.REQUEST_HEADER] = `attempt=${Y+1}; max=${O}`;
                if (_?.beforeRequest) await _.beforeRequest();
                let {
                    response: $,
                    output: j
                } = await q(K);
                if (_?.afterRequest) _.afterRequest($);
                return this.retryQuota.releaseRetryTokens(z), j.$metadata.attempts = Y + 1, j.$metadata.totalRetryDelay = A, {
                    response: $,
                    output: j
                }
            } catch ($) {
                let j = SKq($);
                if (Y++, this.shouldRetry(j, Y, O)) {
                    z = this.retryQuota.retrieveRetryTokens(j);
                    let H = this.delayDecider(v76.isThrottlingError(j) ? KJ.THROTTLING_RETRY_DELAY_BASE : KJ.DEFAULT_RETRY_DELAY_BASE, Y),
                        J = IV3(j.$response),
                        X = Math.max(J || 0, H);
                    A += X, await new Promise((M) => setTimeout(M, X));
                    continue
                }
                if (!j.$metadata) j.$metadata = {};
                throw j.$metadata.attempts = Y, j.$metadata.totalRetryDelay = A, j
            }
        }
    }
    var IV3 = (q) => {
        if (!hv6.HttpResponse.isInstance(q)) return;
        let K = Object.keys(q.headers).find((A) => A.toLowerCase() === "retry-after");
        if (!K) return;
        let _ = q.headers[K],
            z = Number(_);
        if (!Number.isNaN(z)) return z * 1000;
        return new Date(_).getTime() - Date.now()
    };
    class CKq extends uX1 {
        rateLimiter;
        constructor(q, K) {
            let {
                rateLimiter: _,
                ...z
            } = K ?? {};
            super(q, z);
            this.rateLimiter = _ ?? new KJ.DefaultRateLimiter, this.mode = KJ.RETRY_MODES.ADAPTIVE
        }
        async retry(q, K) {
            return super.retry(q, K, {
                beforeRequest: async () => {
                    return this.rateLimiter.getSendToken()
                },
                afterRequest: (_) => {
                    this.rateLimiter.updateClientSendingRate(_)
                }
            })
        }
    }
    var IX1 = "AWS_MAX_ATTEMPTS",
        xX1 = "max_attempts",
        xV3 = {
            environmentVariableSelector: (q) => {
                let K = q[IX1];
                if (!K) return;
                let _ = parseInt(K);
                if (Number.isNaN(_)) throw Error(`Environment variable ${IX1} mast be a number, got "${K}"`);
                return _
            },
            configFileSelector: (q) => {
                let K = q[xX1];
                if (!K) return;
                let _ = parseInt(K);
                if (Number.isNaN(_)) throw Error(`Shared config file entry ${xX1} mast be a number, got "${K}"`);
                return _
            },
            default: KJ.DEFAULT_MAX_ATTEMPTS
        },
        uV3 = (q) => {
            let {
                retryStrategy: K,
                retryMode: _,
                maxAttempts: z
            } = q, Y = yKq.normalizeProvider(z ?? KJ.DEFAULT_MAX_ATTEMPTS);
            return Object.assign(q, {
                maxAttempts: Y,
                retryStrategy: async () => {
                    if (K) return K;
                    if (await yKq.normalizeProvider(_)() === KJ.RETRY_MODES.ADAPTIVE) return new KJ.AdaptiveRetryStrategy(Y);
                    return new KJ.StandardRetryStrategy(Y)
                }
            })
        },
        bKq = "AWS_RETRY_MODE",
        IKq = "retry_mode",
        mV3 = {
            environmentVariableSelector: (q) => q[bKq],
            configFileSelector: (q) => q[IKq],
            default: KJ.DEFAULT_RETRY_MODE
        },
        xKq = () => (q) => async (K) => {
            let {
                request: _
            } = K;
            if (hv6.HttpRequest.isInstance(_)) delete _.headers[KJ.INVOCATION_ID_HEADER], delete _.headers[KJ.REQUEST_HEADER];
            return q(K)
        }, uKq = {
            name: "omitRetryHeadersMiddleware",
            tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
            relation: "before",
            toMiddleware: "awsAuthMiddleware",
            override: !0
        }, BV3 = (q) => ({
            applyToStack: (K) => {
                K.addRelativeTo(xKq(), uKq)
            }
        }), mKq = (q) => (K, _) => async (z) => {
            let Y = await q.retryStrategy(),
                A = await q.maxAttempts();
            if (pV3(Y)) {
                Y = Y;
                let O = await Y.acquireInitialRetryToken(_.partition_id),
                    w = Error(),
                    $ = 0,
                    j = 0,
                    {
                        request: H
                    } = z,
                    J = hv6.HttpRequest.isInstance(H);
                if (J) H.headers[KJ.INVOCATION_ID_HEADER] = LKq.v4();
                while (!0) try {
                    if (J) H.headers[KJ.REQUEST_HEADER] = `attempt=${$+1}; max=${A}`;
                    let {
                        response: X,
                        output: M
                    } = await K(z);
                    return Y.recordSuccess(O), M.$metadata.attempts = $ + 1, M.$metadata.totalRetryDelay = j, {
                        response: X,
                        output: M
                    }
                } catch (X) {
                    let M = FV3(X);
                    if (w = SKq(X), J && CV3.isStreamingPayload(H)) throw (_.logger instanceof SV3.NoOpLogger ? console : _.logger)?.warn("An error was encountered in a non-retryable streaming request."), w;
                    try {
                        O = await Y.refreshRetryTokenForRetry(O, M)
                    } catch (W) {
                        if (!w.$metadata) w.$metadata = {};
                        throw w.$metadata.attempts = $ + 1, w.$metadata.totalRetryDelay = j, w
                    }
                    $ = O.getRetryCount();
                    let P = O.getRetryDelay();
                    j += P, await new Promise((W) => setTimeout(W, P))
                }
            } else {
                if (Y = Y, Y?.mode) _.userAgent = [..._.userAgent || [],
                    ["cfg/retry-mode", Y.mode]
                ];
                return Y.retry(K, z)
            }
        }, pV3 = (q) => typeof q.acquireInitialRetryToken < "u" && typeof q.refreshRetryTokenForRetry < "u" && typeof q.recordSuccess < "u", FV3 = (q) => {
            let K = {
                    error: q,
                    errorType: gV3(q)
                },
                _ = pKq(q.$response);
            if (_) K.retryAfterHint = _;
            return K
        }, gV3 = (q) => {
            if (v76.isThrottlingError(q)) return "THROTTLING";
            if (v76.isTransientError(q)) return "TRANSIENT";
            if (v76.isServerError(q)) return "SERVER_ERROR";
            return "CLIENT_ERROR"
        }, BKq = {
            name: "retryMiddleware",
            tags: ["RETRY"],
            step: "finalizeRequest",
            priority: "high",
            override: !0
        }, UV3 = (q) => ({
            applyToStack: (K) => {
                K.add(mKq(q), BKq)
            }
        }), pKq = (q) => {
            if (!hv6.HttpResponse.isInstance(q)) return;
            let K = Object.keys(q.headers).find((A) => A.toLowerCase() === "retry-after");
            if (!K) return;
            let _ = q.headers[K],
                z = Number(_);
            if (!Number.isNaN(z)) return new Date(z * 1000);
            return new Date(_)
        };
    QV3.AdaptiveRetryStrategy = CKq;
    QV3.CONFIG_MAX_ATTEMPTS = xX1;
    QV3.CONFIG_RETRY_MODE = IKq;
    QV3.ENV_MAX_ATTEMPTS = IX1;
    QV3.ENV_RETRY_MODE = bKq;
    QV3.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = xV3;
    QV3.NODE_RETRY_MODE_CONFIG_OPTIONS = mV3;
    QV3.StandardRetryStrategy = uX1;
    QV3.defaultDelayDecider = hKq;
    QV3.defaultRetryDecider = RKq;
    QV3.getOmitRetryHeadersPlugin = BV3;
    QV3.getRetryAfterHint = pKq;
    QV3.getRetryPlugin = UV3;
    QV3.omitRetryHeadersMiddleware = xKq;
    QV3.omitRetryHeadersMiddlewareOptions = uKq;
    QV3.resolveRetryConfig = uV3;
    QV3.retryMiddleware = mKq;
    QV3.retryMiddlewareOptions = BKq
})
// @from(Ln 82862, Col 4)
QX1 = p((Xk3) => {
    Xk3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(Xk3.HttpAuthLocation || (Xk3.HttpAuthLocation = {}));
    Xk3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(Xk3.HttpApiKeyAuthLocation || (Xk3.HttpApiKeyAuthLocation = {}));
    Xk3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(Xk3.EndpointURLScheme || (Xk3.EndpointURLScheme = {}));
    Xk3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(Xk3.AlgorithmId || (Xk3.AlgorithmId = {}));
    var wk3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => Xk3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => Xk3.AlgorithmId.MD5,
                checksumConstructor: () => q.md5
            });
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        $k3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        jk3 = (q) => {
            return wk3(q)
        },
        Hk3 = (q) => {
            return $k3(q)
        };
    Xk3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(Xk3.FieldPosition || (Xk3.FieldPosition = {}));
    var Jk3 = "__smithy_context";
    Xk3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(Xk3.IniSectionType || (Xk3.IniSectionType = {}));
    Xk3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(Xk3.RequestHandlerProtocol || (Xk3.RequestHandlerProtocol = {}));
    Xk3.SMITHY_CONTEXT_KEY = Jk3;
    Xk3.getDefaultClientConfiguration = jk3;
    Xk3.resolveDefaultRuntimeConfig = Hk3
})
// @from(Ln 82927, Col 4)
uV = p((Sv6) => {
    var UKq = gU(),
        iX1 = XE(),
        cX1 = QX1(),
        Dk3 = sj(),
        FKq = JE();
    class QKq {
        config;
        middlewareStack = UKq.constructStack();
        initConfig;
        handlers;
        constructor(q) {
            this.config = q
        }
        send(q, K, _) {
            let z = typeof K !== "function" ? K : void 0,
                Y = typeof K === "function" ? K : _,
                A = z === void 0 && this.config.cacheMiddleware === !0,
                O;
            if (A) {
                if (!this.handlers) this.handlers = new WeakMap;
                let w = this.handlers;
                if (w.has(q.constructor)) O = w.get(q.constructor);
                else O = q.resolveMiddleware(this.middlewareStack, this.config, z), w.set(q.constructor, O)
            } else delete this.handlers, O = q.resolveMiddleware(this.middlewareStack, this.config, z);
            if (Y) O(q).then((w) => Y(null, w.output), (w) => Y(w)).catch(() => {});
            else return O(q).then((w) => w.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var dX1 = "***SensitiveInformation***";

    function lX1(q, K) {
        if (K == null) return K;
        let _ = Dk3.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return dX1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return dX1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return dX1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = lX1(O, z[A]);
            return Y
        }
        return K
    }
    class rX1 {
        middlewareStack = UKq.constructStack();
        schema;
        static classBuilder() {
            return new dKq
        }
        resolveMiddlewareWithContext(q, K, _, {
            middlewareFn: z,
            clientName: Y,
            commandName: A,
            inputFilterSensitiveLog: O,
            outputFilterSensitiveLog: w,
            smithyContext: $,
            additionalContext: j,
            CommandCtor: H
        }) {
            for (let W of z.bind(this)(H, q, K, _)) this.middlewareStack.use(W);
            let J = q.concat(this.middlewareStack),
                {
                    logger: X
                } = K,
                M = {
                    logger: X,
                    clientName: Y,
                    commandName: A,
                    inputFilterSensitiveLog: O,
                    outputFilterSensitiveLog: w,
                    [cX1.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...$
                    },
                    ...j
                },
                {
                    requestHandler: P
                } = K;
            return J.resolve((W) => P.handle(W.request, _ || {}), M)
        }
    }
    class dKq {
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
        init(q) {
            this._init = q
        }
        ep(q) {
            return this._ep = q, this
        }
        m(q) {
            return this._middlewareFn = q, this
        }
        s(q, K, _ = {}) {
            return this._smithyContext = {
                service: q,
                operation: K,
                ..._
            }, this
        }
        c(q = {}) {
            return this._additionalContext = q, this
        }
        n(q, K) {
            return this._clientName = q, this._commandName = K, this
        }
        f(q = (_) => _, K = (_) => _) {
            return this._inputFilterSensitiveLog = q, this._outputFilterSensitiveLog = K, this
        }
        ser(q) {
            return this._serializer = q, this
        }
        de(q) {
            return this._deserializer = q, this
        }
        sc(q) {
            return this._operationSchema = q, this._smithyContext.operationSchema = q, this
        }
        build() {
            let q = this,
                K;
            return K = class extends rX1 {
                input;
                static getEndpointParameterInstructions() {
                    return q._ep
                }
                constructor(...[_]) {
                    super();
                    this.input = _ ?? {}, q._init(this), this.schema = q._operationSchema
                }
                resolveMiddleware(_, z, Y) {
                    let A = q._operationSchema,
                        O = A?.[4] ?? A?.input,
                        w = A?.[5] ?? A?.output;
                    return this.resolveMiddlewareWithContext(_, z, Y, {
                        CommandCtor: K,
                        middlewareFn: q._middlewareFn,
                        clientName: q._clientName,
                        commandName: q._commandName,
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? lX1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? lX1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var Zk3 = "***SensitiveInformation***",
        fk3 = (q, K) => {
            for (let _ of Object.keys(q)) {
                let z = q[_],
                    Y = async function(O, w, $) {
                        let j = new z(O);
                        if (typeof w === "function") this.send(j, w);
                        else if (typeof $ === "function") {
                            if (typeof w !== "object") throw Error(`Expected http options but got ${typeof w}`);
                            this.send(j, w || {}, $)
                        } else return this.send(j, w)
                    }, A = (_[0].toLowerCase() + _.slice(1)).replace(/Command$/, "");
                K.prototype[A] = Y
            }
        };
    class Rv6 extends Error {
        $fault;
        $response;
        $retryable;
        $metadata;
        constructor(q) {
            super(q.message);
            Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype), this.name = q.name, this.$fault = q.$fault, this.$metadata = q.$metadata
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return Rv6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === Rv6) return Rv6.isInstance(q);
            if (Rv6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var cKq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        lKq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = vk3(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw cKq(O, K)
        },
        Gk3 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                lKq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        vk3 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        Tk3 = (q) => {
            switch (q) {
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
        gKq = !1,
        Vk3 = (q) => {
            if (q && !gKq && parseInt(q.substring(1, q.indexOf("."))) < 16) gKq = !0
        },
        kk3 = (q) => {
            let K = [];
            for (let _ in cX1.AlgorithmId) {
                let z = cX1.AlgorithmId[_];
                if (q[z] === void 0) continue;
                K.push({
                    algorithmId: () => z,
                    checksumConstructor: () => q[z]
                })
            }
            return {
                addChecksumAlgorithm(_) {
                    K.push(_)
                },
                checksumAlgorithms() {
                    return K
                }
            }
        },
        Nk3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        Ek3 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        yk3 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        nKq = (q) => {
            return Object.assign(kk3(q), Ek3(q))
        },
        Lk3 = nKq,
        hk3 = (q) => {
            return Object.assign(Nk3(q), yk3(q))
        },
        Rk3 = (q) => Array.isArray(q) ? q : [q],
        iKq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = iKq(q[_]);
            return q
        },
        Sk3 = (q) => {
            return q != null
        };
    class rKq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function oKq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, Ik3(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            aKq(z, null, A, O)
        }
        return z
    }
    var Ck3 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        bk3 = (q, K) => {
            let _ = {};
            for (let z in K) aKq(_, q, K, z);
            return _
        },
        Ik3 = (q, K, _) => {
            return oKq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        aKq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = xk3, $ = uk3, j = z] = O;
                if (typeof w === "function" && w(K[j]) || typeof w !== "function" && !!w) q[z] = $(K[j]);
                return
            }
            let [Y, A] = _[z];
            if (typeof A === "function") {
                let O, w = Y === void 0 && (O = A()) != null,
                    $ = typeof Y === "function" && !!Y(void 0) || typeof Y !== "function" && !!Y;
                if (w) q[z] = O;
                else if ($) q[z] = A()
            } else {
                let O = Y === void 0 && A != null,
                    w = typeof Y === "function" && !!Y(A) || typeof Y !== "function" && !!Y;
                if (O || w) q[z] = A
            }
        },
        xk3 = (q) => q != null,
        uk3 = (q) => q,
        mk3 = (q) => {
            if (q !== q) return "NaN";
            switch (q) {
                case 1 / 0:
                    return "Infinity";
                case -1 / 0:
                    return "-Infinity";
                default:
                    return q
            }
        },
        Bk3 = (q) => q.toISOString().replace(".000Z", "Z"),
        nX1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(nX1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = nX1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(Sv6, "collectBody", {
        enumerable: !0,
        get: function() {
            return iX1.collectBody
        }
    });
    Object.defineProperty(Sv6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return iX1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Sv6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return iX1.resolvedPath
        }
    });
    Sv6.Client = QKq;
    Sv6.Command = rX1;
    Sv6.NoOpLogger = rKq;
    Sv6.SENSITIVE_STRING = Zk3;
    Sv6.ServiceException = Rv6;
    Sv6._json = nX1;
    Sv6.convertMap = Ck3;
    Sv6.createAggregatedClient = fk3;
    Sv6.decorateServiceException = cKq;
    Sv6.emitWarningIfUnsupportedVersion = Vk3;
    Sv6.getArrayIfSingleItem = Rk3;
    Sv6.getDefaultClientConfiguration = Lk3;
    Sv6.getDefaultExtensionConfiguration = nKq;
    Sv6.getValueFromTextNode = iKq;
    Sv6.isSerializableHeaderValue = Sk3;
    Sv6.loadConfigsForDefaultMode = Tk3;
    Sv6.map = oKq;
    Sv6.resolveDefaultRuntimeConfig = hk3;
    Sv6.serializeDateTime = Bk3;
    Sv6.serializeFloat = mk3;
    Sv6.take = bk3;
    Sv6.throwDefaultError = lKq;
    Sv6.withBaseException = Gk3;
    Object.keys(FKq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Sv6, q)) Object.defineProperty(Sv6, q, {
            enumerable: !0,
            get: function() {
                return FKq[q]
            }
        })
    })
})
// @from(Ln 83397, Col 4)
aX1 = p((sKq) => {
    Object.defineProperty(sKq, "__esModule", {
        value: !0
    });
    sKq.resolveHttpAuthSchemeConfig = sKq.defaultSSOOIDCHttpAuthSchemeProvider = sKq.defaultSSOOIDCHttpAuthSchemeParametersProvider = void 0;
    var wN3 = k$(),
        oX1 = Dv(),
        $N3 = async (q, K, _) => {
            return {
                operation: (0, oX1.getSmithyContext)(K).operation,
                region: await (0, oX1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    sKq.defaultSSOOIDCHttpAuthSchemeParametersProvider = $N3;

    function jN3(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sso-oauth",
                region: q.region
            },
            propertiesExtractor: (K, _) => ({
                signingProperties: {
                    config: K,
                    context: _
                }
            })
        }
    }

    function HN3(q) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var JN3 = (q) => {
        let K = [];
        switch (q.operation) {
            case "CreateToken": {
                K.push(HN3(q));
                break
            }
            default:
                K.push(jN3(q))
        }
        return K
    };
    sKq.defaultSSOOIDCHttpAuthSchemeProvider = JN3;
    var XN3 = (q) => {
        let K = (0, wN3.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, oX1.normalizeProvider)(q.authSchemePreference ?? [])
        })
    };
    sKq.resolveHttpAuthSchemeConfig = XN3
})
// @from(Ln 83456, Col 4)
yW8 = p((YOO, WN3) => {
    WN3.exports = {
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
// @from(Ln 83575, Col 4)
Ko = p((TN3) => {
    var eKq = d6("os"),
        sX1 = d6("process"),
        DN3 = cU(),
        q5q = {
            isCrtAvailable: !1
        },
        ZN3 = () => {
            if (q5q.isCrtAvailable) return ["md/crt-avail"];
            return null
        },
        K5q = ({
            serviceId: q,
            clientVersion: K
        }) => {
            return async (_) => {
                let z = [
                        ["aws-sdk-js", K],
                        ["ua", "2.1"],
                        [`os/${eKq.platform()}`, eKq.release()],
                        ["lang/js"],
                        ["md/nodejs", `${sX1.versions.node}`]
                    ],
                    Y = ZN3();
                if (Y) z.push(Y);
                if (q) z.push([`api/${q}`, K]);
                if (sX1.env.AWS_EXECUTION_ENV) z.push([`exec-env/${sX1.env.AWS_EXECUTION_ENV}`]);
                let A = await _?.userAgentAppId?.();
                return A ? [...z, [`app/${A}`]] : [...z]
            }
        },
        fN3 = K5q,
        _5q = "AWS_SDK_UA_APP_ID",
        z5q = "sdk_ua_app_id",
        GN3 = "sdk-ua-app-id",
        vN3 = {
            environmentVariableSelector: (q) => q[_5q],
            configFileSelector: (q) => q[z5q] ?? q[GN3],
            default: DN3.DEFAULT_UA_APP_ID
        };
    TN3.NODE_APP_ID_CONFIG_OPTIONS = vN3;
    TN3.UA_APP_ID_ENV_NAME = _5q;
    TN3.UA_APP_ID_INI_NAME = z5q;
    TN3.createDefaultUserAgentProvider = K5q;
    TN3.crtAvailability = q5q;
    TN3.defaultUserAgent = fN3
})
// @from(Ln 83622, Col 4)
Y5q = p((RN3) => {
    var hN3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    RN3.isArrayBuffer = hN3
})
// @from(Ln 83626, Col 4)
A5q = p((xN3) => {
    var CN3 = Y5q(),
        tX1 = d6("buffer"),
        bN3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!CN3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return tX1.Buffer.from(q, K, _)
        },
        IN3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? tX1.Buffer.from(q, K) : tX1.Buffer.from(q)
        };
    xN3.fromArrayBuffer = bN3;
    xN3.fromString = IN3
})
// @from(Ln 83640, Col 4)
_o = p((FN3) => {
    var eX1 = A5q(),
        BN3 = nw(),
        pN3 = d6("buffer"),
        O5q = d6("crypto");
    class $5q {
        algorithmIdentifier;
        secret;
        hash;
        constructor(q, K) {
            this.algorithmIdentifier = q, this.secret = K, this.reset()
        }
        update(q, K) {
            this.hash.update(BN3.toUint8Array(w5q(q, K)))
        }
        digest() {
            return Promise.resolve(this.hash.digest())
        }
        reset() {
            this.hash = this.secret ? O5q.createHmac(this.algorithmIdentifier, w5q(this.secret)) : O5q.createHash(this.algorithmIdentifier)
        }
    }

    function w5q(q, K) {
        if (pN3.Buffer.isBuffer(q)) return q;
        if (typeof q === "string") return eX1.fromString(q, K);
        if (ArrayBuffer.isView(q)) return eX1.fromArrayBuffer(q.buffer, q.byteOffset, q.byteLength);
        return eX1.fromArrayBuffer(q)
    }
    FN3.Hash = $5q
})
// @from(Ln 83671, Col 4)
zo = p((QN3) => {
    var qM1 = d6("node:fs"),
        UN3 = (q) => {
            if (!q) return 0;
            if (typeof q === "string") return Buffer.byteLength(q);
            else if (typeof q.byteLength === "number") return q.byteLength;
            else if (typeof q.size === "number") return q.size;
            else if (typeof q.start === "number" && typeof q.end === "number") return q.end + 1 - q.start;
            else if (q instanceof qM1.ReadStream) {
                if (q.path != null) return qM1.lstatSync(q.path).size;
                else if (typeof q.fd === "number") return qM1.fstatSync(q.fd).size
            }
            throw Error(`Body Length computation failed for ${q}`)
        };
    QN3.calculateBodyLength = UN3
})