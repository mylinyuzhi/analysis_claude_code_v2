
// @from(Ln 64084, Col 4)
ZC = R((TyK) => {
    var cj8 = pj8(),
        dj8 = fk(),
        JyK = lz(),
        Ke1 = iP(),
        XyK = yQ6(),
        DyK = async (A) => {
            let q = A?.Bucket || "";
            if (typeof A.Bucket === "string") A.Bucket = q.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
            if (GyK(q)) {
                if (A.ForcePathStyle === !0) throw Error("Path-style addressing cannot be used with ARN buckets")
            } else if (!WyK(q) || q.indexOf(".") !== -1 && !String(A.Endpoint).startsWith("http:") || q.toLowerCase() !== q || q.length < 3) A.ForcePathStyle = !0;
            if (A.DisableMultiRegionAccessPoints) A.disableMultiRegionAccessPoints = !0, A.DisableMRAP = !0;
            return A
        }, jyK = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/, MyK = /(\d+\.){3}\d+/, PyK = /\.\./, WyK = (A) => jyK.test(A) && !MyK.test(A) && !PyK.test(A), GyK = (A) => {
            let [q, K, Y, , , z] = A.split(":"), w = q === "arn" && A.split(":").length >= 6, H = Boolean(w && K && Y && z);
            if (w && !H) throw Error(`Invalid ARN: ${A} was an invalid ARN.`);
            return H
        }, ZyK = (A, q, K) => {
            let Y = async () => {
                let z = K[A] ?? K[q];
                if (typeof z === "function") return z();
                return z
            };
            if (A === "credentialScope" || q === "CredentialScope") return async () => {
                let z = typeof K.credentials === "function" ? await K.credentials() : K.credentials;
                return z?.credentialScope ?? z?.CredentialScope
            };
            if (A === "accountId" || q === "AccountId") return async () => {
                let z = typeof K.credentials === "function" ? await K.credentials() : K.credentials;
                return z?.accountId ?? z?.AccountId
            };
            if (A === "endpoint" || q === "endpoint") return async () => {
                if (K.isCustomEndpoint === !1) return;
                let z = await Y();
                if (z && typeof z === "object") {
                    if ("url" in z) return z.url.href;
                    if ("hostname" in z) {
                        let {
                            protocol: w,
                            hostname: H,
                            port: $,
                            path: O
                        } = z;
                        return `${w}//${H}${$?":"+$:""}${O}`
                    }
                }
                return z
            };
            return Y
        }, Gp6 = (A) => {
            if (typeof A === "object") {
                if ("url" in A) return dj8.parseUrl(A.url);
                return A
            }
            return dj8.parseUrl(A)
        }, lj8 = async (A, q, K, Y) => {
            if (!K.isCustomEndpoint) {
                let H;
                if (K.serviceConfiguredEndpoint) H = await K.serviceConfiguredEndpoint();
                else H = await cj8.getEndpointFromConfig(K.serviceId);
                if (H) K.endpoint = () => Promise.resolve(Gp6(H)), K.isCustomEndpoint = !0
            }
            let z = await ij8(A, q, K);
            if (typeof K.endpointProvider !== "function") throw Error("config.endpointProvider is not set.");
            return K.endpointProvider(z, Y)
        }, ij8 = async (A, q, K) => {
            let Y = {},
                z = q?.getEndpointParameterInstructions?.() || {};
            for (let [w, H] of Object.entries(z)) switch (H.type) {
                case "staticContextParams":
                    Y[w] = H.value;
                    break;
                case "contextParams":
                    Y[w] = A[H.name];
                    break;
                case "clientContextParams":
                case "builtInParams":
                    Y[w] = await ZyK(H.name, w, K)();
                    break;
                case "operationContextParams":
                    Y[w] = H.get(A);
                    break;
                default:
                    throw Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(H))
            }
            if (Object.keys(z).length === 0) Object.assign(Y, K);
            if (String(K.serviceId).toLowerCase() === "s3") await DyK(Y);
            return Y
        }, nj8 = ({
            config: A,
            instructions: q
        }) => {
            return (K, Y) => async (z) => {
                if (A.isCustomEndpoint) JyK.setFeature(Y, "ENDPOINT_OVERRIDE", "N");
                let w = await lj8(z.input, {
                    getEndpointParameterInstructions() {
                        return q
                    }
                }, {
                    ...A
                }, Y);
                Y.endpointV2 = w, Y.authSchemes = w.properties?.authSchemes;
                let H = Y.authSchemes?.[0];
                if (H) {
                    Y.signing_region = H.signingRegion, Y.signing_service = H.signingName;
                    let O = Ke1.getSmithyContext(Y)?.selectedHttpAuthScheme?.httpAuthOption;
                    if (O) O.signingProperties = Object.assign(O.signingProperties || {}, {
                        signing_region: H.signingRegion,
                        signingRegion: H.signingRegion,
                        signing_service: H.signingName,
                        signingName: H.signingName,
                        signingRegionSet: H.signingRegionSet
                    }, H.properties)
                }
                return K({
                    ...z
                })
            }
        }, rj8 = {
            step: "serialize",
            tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
            name: "endpointV2Middleware",
            override: !0,
            relation: "before",
            toMiddleware: XyK.serializerMiddlewareOption.name
        }, fyK = (A, q) => ({
            applyToStack: (K) => {
                K.addRelativeTo(nj8({
                    config: A,
                    instructions: q
                }), rj8)
            }
        }), VyK = (A) => {
            let q = A.tls ?? !0,
                {
                    endpoint: K,
                    useDualstackEndpoint: Y,
                    useFipsEndpoint: z
                } = A,
                w = K != null ? async () => Gp6(await Ke1.normalizeProvider(K)()): void 0, $ = Object.assign(A, {
                    endpoint: w,
                    tls: q,
                    isCustomEndpoint: !!K,
                    useDualstackEndpoint: Ke1.normalizeProvider(Y ?? !1),
                    useFipsEndpoint: Ke1.normalizeProvider(z ?? !1)
                }), O = void 0;
            return $.serviceConfiguredEndpoint = async () => {
                if (A.serviceId && !O) O = cj8.getEndpointFromConfig(A.serviceId);
                return O
            }, $
        }, NyK = (A) => {
            let {
                endpoint: q
            } = A;
            if (q === void 0) A.endpoint = async () => {
                throw Error("@smithy/middleware-endpoint: (default endpointRuleSet) endpoint is not set - you must configure an endpoint.")
            };
            return A
        };
    TyK.endpointMiddleware = nj8;
    TyK.endpointMiddlewareOptions = rj8;
    TyK.getEndpointFromInstructions = lj8;
    TyK.getEndpointPlugin = fyK;
    TyK.resolveEndpointConfig = VyK;
    TyK.resolveEndpointRequiredConfig = NyK;
    TyK.resolveParams = ij8;
    TyK.toEndpointV1 = Gp6
})
// @from(Ln 64253, Col 4)
fp6 = R((gyK) => {
    var hyK = ["AuthFailure", "InvalidSignatureException", "RequestExpired", "RequestInTheFuture", "RequestTimeTooSkewed", "SignatureDoesNotMatch"],
        IyK = ["BandwidthLimitExceeded", "EC2ThrottledException", "LimitExceededException", "PriorRequestNotComplete", "ProvisionedThroughputExceededException", "RequestLimitExceeded", "RequestThrottled", "RequestThrottledException", "SlowDown", "ThrottledException", "Throttling", "ThrottlingException", "TooManyRequestsException", "TransactionInProgressException"],
        xyK = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"],
        byK = [500, 502, 503, 504],
        uyK = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"],
        ByK = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"],
        oj8 = (A) => A?.$retryable !== void 0,
        myK = (A) => hyK.includes(A.name),
        aj8 = (A) => A.$metadata?.clockSkewCorrected,
        sj8 = (A) => {
            let q = new Set(["Failed to fetch", "NetworkError when attempting to fetch resource", "The Internet connection appears to be offline", "Load failed", "Network request failed"]);
            if (!(A && A instanceof TypeError)) return !1;
            return q.has(A.message)
        },
        FyK = (A) => A.$metadata?.httpStatusCode === 429 || IyK.includes(A.name) || A.$retryable?.throttling == !0,
        Zp6 = (A, q = 0) => oj8(A) || aj8(A) || xyK.includes(A.name) || uyK.includes(A?.code || "") || ByK.includes(A?.code || "") || byK.includes(A.$metadata?.httpStatusCode || 0) || sj8(A) || A.cause !== void 0 && q <= 10 && Zp6(A.cause, q + 1),
        QyK = (A) => {
            if (A.$metadata?.httpStatusCode !== void 0) {
                let q = A.$metadata.httpStatusCode;
                if (500 <= q && q <= 599 && !Zp6(A)) return !0;
                return !1
            }
            return !1
        };
    gyK.isBrowserNetworkError = sj8;
    gyK.isClockSkewCorrectedError = aj8;
    gyK.isClockSkewError = myK;
    gyK.isRetryableByTrait = oj8;
    gyK.isServerError = QyK;
    gyK.isThrottlingError = FyK;
    gyK.isTransientError = Zp6
})
// @from(Ln 64286, Col 4)
_b = R((eyK) => {
    var ryK = fp6();
    eyK.RETRY_MODES = void 0;
    (function(A) {
        A.STANDARD = "standard", A.ADAPTIVE = "adaptive"
    })(eyK.RETRY_MODES || (eyK.RETRY_MODES = {}));
    var Vp6 = 3,
        oyK = eyK.RETRY_MODES.STANDARD;
    class Ye1 {
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
                await new Promise((K) => Ye1.setTimeoutFn(K, q))
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
            if (this.updateMeasuredRate(), ryK.isThrottlingError(A)) {
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
    var LE1 = 100,
        Tp6 = 20000,
        ej8 = 500,
        Np6 = 500,
        AM8 = 5,
        qM8 = 10,
        KM8 = 1,
        ayK = "amz-sdk-invocation-id",
        syK = "amz-sdk-request",
        tyK = () => {
            let A = LE1;
            return {
                computeNextBackoffDelay: (Y) => {
                    return Math.floor(Math.min(Tp6, Math.random() * 2 ** Y * A))
                },
                setDelayBase: (Y) => {
                    A = Y
                }
            }
        },
        tj8 = ({
            retryDelay: A,
            retryCount: q,
            retryCost: K
        }) => {
            return {
                getRetryCount: () => q,
                getRetryDelay: () => Math.min(Tp6, A),
                getRetryCost: () => K
            }
        };
    class ze1 {
        maxAttempts;
        mode = eyK.RETRY_MODES.STANDARD;
        capacity = Np6;
        retryBackoffStrategy = tyK();
        maxAttemptsProvider;
        constructor(A) {
            this.maxAttempts = A, this.maxAttemptsProvider = typeof A === "function" ? A : async () => A
        }
        async acquireInitialRetryToken(A) {
            return tj8({
                retryDelay: LE1,
                retryCount: 0
            })
        }
        async refreshRetryTokenForRetry(A, q) {
            let K = await this.getMaxAttempts();
            if (this.shouldRetry(A, q, K)) {
                let Y = q.errorType;
                this.retryBackoffStrategy.setDelayBase(Y === "THROTTLING" ? ej8 : LE1);
                let z = this.retryBackoffStrategy.computeNextBackoffDelay(A.getRetryCount()),
                    w = q.retryAfterHint ? Math.max(q.retryAfterHint.getTime() - Date.now() || 0, z) : z,
                    H = this.getCapacityCost(Y);
                return this.capacity -= H, tj8({
                    retryDelay: w,
                    retryCount: A.getRetryCount() + 1,
                    retryCost: H
                })
            }
            throw Error("No retry token available")
        }
        recordSuccess(A) {
            this.capacity = Math.max(Np6, this.capacity + (A.getRetryCost() ?? KM8))
        }
        getCapacity() {
            return this.capacity
        }
        async getMaxAttempts() {
            try {
                return await this.maxAttemptsProvider()
            } catch (A) {
                return console.warn(`Max attempts provider could not resolve. Using default of ${Vp6}`), Vp6
            }
        }
        shouldRetry(A, q, K) {
            return A.getRetryCount() + 1 < K && this.capacity >= this.getCapacityCost(q.errorType) && this.isRetryableError(q.errorType)
        }
        getCapacityCost(A) {
            return A === "TRANSIENT" ? qM8 : AM8
        }
        isRetryableError(A) {
            return A === "THROTTLING" || A === "TRANSIENT"
        }
    }
    class YM8 {
        maxAttemptsProvider;
        rateLimiter;
        standardRetryStrategy;
        mode = eyK.RETRY_MODES.ADAPTIVE;
        constructor(A, q) {
            this.maxAttemptsProvider = A;
            let {
                rateLimiter: K
            } = q ?? {};
            this.rateLimiter = K ?? new Ye1, this.standardRetryStrategy = new ze1(A)
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
    class zM8 extends ze1 {
        computeNextBackoffDelay;
        constructor(A, q = LE1) {
            super(typeof A === "function" ? A : async () => A);
            if (typeof q === "number") this.computeNextBackoffDelay = () => q;
            else this.computeNextBackoffDelay = q
        }
        async refreshRetryTokenForRetry(A, q) {
            let K = await super.refreshRetryTokenForRetry(A, q);
            return K.getRetryDelay = () => this.computeNextBackoffDelay(K.getRetryCount()), K
        }
    }
    eyK.AdaptiveRetryStrategy = YM8;
    eyK.ConfiguredRetryStrategy = zM8;
    eyK.DEFAULT_MAX_ATTEMPTS = Vp6;
    eyK.DEFAULT_RETRY_DELAY_BASE = LE1;
    eyK.DEFAULT_RETRY_MODE = oyK;
    eyK.DefaultRateLimiter = Ye1;
    eyK.INITIAL_RETRY_TOKENS = Np6;
    eyK.INVOCATION_ID_HEADER = ayK;
    eyK.MAXIMUM_RETRY_DELAY = Tp6;
    eyK.NO_RETRY_INCREMENT = KM8;
    eyK.REQUEST_HEADER = syK;
    eyK.RETRY_COST = AM8;
    eyK.StandardRetryStrategy = ze1;
    eyK.THROTTLING_RETRY_DELAY_BASE = ej8;
    eyK.TIMEOUT_RETRY_COST = qM8
})
// @from(Ln 64511, Col 4)
Cp6 = R((VCK) => {
    VCK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(VCK.HttpAuthLocation || (VCK.HttpAuthLocation = {}));
    VCK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(VCK.HttpApiKeyAuthLocation || (VCK.HttpApiKeyAuthLocation = {}));
    VCK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(VCK.EndpointURLScheme || (VCK.EndpointURLScheme = {}));
    VCK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(VCK.AlgorithmId || (VCK.AlgorithmId = {}));
    var PCK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => VCK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => VCK.AlgorithmId.MD5,
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
        WCK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        GCK = (A) => {
            return PCK(A)
        },
        ZCK = (A) => {
            return WCK(A)
        };
    VCK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(VCK.FieldPosition || (VCK.FieldPosition = {}));
    var fCK = "__smithy_context";
    VCK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(VCK.IniSectionType || (VCK.IniSectionType = {}));
    VCK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(VCK.RequestHandlerProtocol || (VCK.RequestHandlerProtocol = {}));
    VCK.SMITHY_CONTEXT_KEY = fCK;
    VCK.getDefaultClientConfiguration = GCK;
    VCK.resolveDefaultRuntimeConfig = ZCK
})
// @from(Ln 64576, Col 4)
OM8 = R((CCK) => {
    var ECK = Cp6(),
        kCK = (A) => {
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
        LCK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class wM8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = ECK.FieldPosition.HEADER,
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
    class HM8 {
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
    class we1 {
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
            let q = new we1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = RCK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return we1.clone(this)
        }
    }

    function RCK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class $M8 {
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

    function yCK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    CCK.Field = wM8;
    CCK.Fields = HM8;
    CCK.HttpRequest = we1;
    CCK.HttpResponse = $M8;
    CCK.getHttpHandlerExtensionConfiguration = kCK;
    CCK.isValidHostname = yCK;
    CCK.resolveHttpHandlerRuntimeConfig = LCK
})
// @from(Ln 64718, Col 4)
NM8 = R((IH1) => {
    var XM8 = wb(),
        bp6 = rf(),
        hp6 = Cp6(),
        mCK = R$(),
        _M8 = nf();
    class DM8 {
        config;
        middlewareStack = XM8.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                w = Y === void 0 && this.config.cacheMiddleware === !0,
                H;
            if (w) {
                if (!this.handlers) this.handlers = new WeakMap;
                let $ = this.handlers;
                if ($.has(A.constructor)) H = $.get(A.constructor);
                else H = A.resolveMiddleware(this.middlewareStack, this.config, Y), $.set(A.constructor, H)
            } else delete this.handlers, H = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) H(A).then(($) => z(null, $.output), ($) => z($)).catch(() => {});
            else return H(A).then(($) => $.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var Sp6 = "***SensitiveInformation***";

    function Ip6(A, q) {
        if (q == null) return q;
        let K = mCK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return Sp6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return Sp6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return Sp6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = Ip6(H, Y[w]);
            return z
        }
        return q
    }
    class up6 {
        middlewareStack = XM8.constructStack();
        schema;
        static classBuilder() {
            return new jM8
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: w,
            inputFilterSensitiveLog: H,
            outputFilterSensitiveLog: $,
            smithyContext: O,
            additionalContext: _,
            CommandCtor: J
        }) {
            for (let P of Y.bind(this)(J, A, q, K)) this.middlewareStack.use(P);
            let X = A.concat(this.middlewareStack),
                {
                    logger: D
                } = q,
                j = {
                    logger: D,
                    clientName: z,
                    commandName: w,
                    inputFilterSensitiveLog: H,
                    outputFilterSensitiveLog: $,
                    [hp6.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...O
                    },
                    ..._
                },
                {
                    requestHandler: M
                } = q;
            return X.resolve((P) => M.handle(P.request, K || {}), j)
        }
    }
    class jM8 {
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
            return q = class extends up6 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let w = A._operationSchema,
                        H = w?.[4] ?? w?.input,
                        $ = w?.[5] ?? w?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? Ip6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? Ip6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var FCK = "***SensitiveInformation***",
        QCK = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(H, $, O) {
                        let _ = new Y(H);
                        if (typeof $ === "function") this.send(_, $);
                        else if (typeof O === "function") {
                            if (typeof $ !== "object") throw Error(`Expected http options but got ${typeof $}`);
                            this.send(_, $ || {}, O)
                        } else return this.send(_, $)
                    }, w = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[w] = z
            }
        };
    class hH1 extends Error {
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
            return hH1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === hH1) return hH1.isInstance(A);
            if (hH1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var MM8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        PM8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = UCK(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw MM8(H, q)
        },
        gCK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                PM8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        UCK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        pCK = (A) => {
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
        JM8 = !1,
        dCK = (A) => {
            if (A && !JM8 && parseInt(A.substring(1, A.indexOf("."))) < 16) JM8 = !0
        },
        cCK = (A) => {
            let q = [];
            for (let K in hp6.AlgorithmId) {
                let Y = hp6.AlgorithmId[K];
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
        lCK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        iCK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        nCK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        WM8 = (A) => {
            return Object.assign(cCK(A), iCK(A))
        },
        rCK = WM8,
        oCK = (A) => {
            return Object.assign(lCK(A), nCK(A))
        },
        aCK = (A) => Array.isArray(A) ? A : [A],
        GM8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = GM8(A[K]);
            return A
        },
        sCK = (A) => {
            return A != null
        };
    class ZM8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function fM8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, ASK(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            VM8(Y, null, w, H)
        }
        return Y
    }
    var tCK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        eCK = (A, q) => {
            let K = {};
            for (let Y in q) VM8(K, A, q, Y);
            return K
        },
        ASK = (A, q, K) => {
            return fM8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        VM8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = qSK, O = KSK, _ = Y] = H;
                if (typeof $ === "function" && $(q[_]) || typeof $ !== "function" && !!$) A[Y] = O(q[_]);
                return
            }
            let [z, w] = K[Y];
            if (typeof w === "function") {
                let H, $ = z === void 0 && (H = w()) != null,
                    O = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if ($) A[Y] = H;
                else if (O) A[Y] = w()
            } else {
                let H = z === void 0 && w != null,
                    $ = typeof z === "function" && !!z(w) || typeof z !== "function" && !!z;
                if (H || $) A[Y] = w
            }
        },
        qSK = (A) => A != null,
        KSK = (A) => A,
        YSK = (A) => {
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
        zSK = (A) => A.toISOString().replace(".000Z", "Z"),
        xp6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(xp6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = xp6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(IH1, "collectBody", {
        enumerable: !0,
        get: function() {
            return bp6.collectBody
        }
    });
    Object.defineProperty(IH1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return bp6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(IH1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return bp6.resolvedPath
        }
    });
    IH1.Client = DM8;
    IH1.Command = up6;
    IH1.NoOpLogger = ZM8;
    IH1.SENSITIVE_STRING = FCK;
    IH1.ServiceException = hH1;
    IH1._json = xp6;
    IH1.convertMap = tCK;
    IH1.createAggregatedClient = QCK;
    IH1.decorateServiceException = MM8;
    IH1.emitWarningIfUnsupportedVersion = dCK;
    IH1.getArrayIfSingleItem = aCK;
    IH1.getDefaultClientConfiguration = rCK;
    IH1.getDefaultExtensionConfiguration = WM8;
    IH1.getValueFromTextNode = GM8;
    IH1.isSerializableHeaderValue = sCK;
    IH1.loadConfigsForDefaultMode = pCK;
    IH1.map = fM8;
    IH1.resolveDefaultRuntimeConfig = oCK;
    IH1.serializeDateTime = zSK;
    IH1.serializeFloat = YSK;
    IH1.take = eCK;
    IH1.throwDefaultError = PM8;
    IH1.withBaseException = gCK;
    Object.keys(_M8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(IH1, A)) Object.defineProperty(IH1, A, {
            enumerable: !0,
            get: function() {
                return _M8[A]
            }
        })
    })
})
// @from(Ln 65188, Col 4)
EM8 = R((TM8) => {
    Object.defineProperty(TM8, "__esModule", {
        value: !0
    });
    TM8.isStreamingPayload = void 0;
    var ySK = h1("stream"),
        CSK = (A) => A?.body instanceof ySK.Readable || typeof ReadableStream < "u" && A?.body instanceof ReadableStream;
    TM8.isStreamingPayload = CSK
})
// @from(Ln 65197, Col 4)
qM = R((pSK) => {
    var EO = _b(),
        xH1 = OM8(),
        mi = fp6(),
        LM8 = Yg6(),
        kM8 = iP(),
        SSK = NM8(),
        hSK = EM8(),
        ISK = (A, q) => {
            let K = A,
                Y = EO.NO_RETRY_INCREMENT,
                z = EO.RETRY_COST,
                w = EO.TIMEOUT_RETRY_COST,
                H = A,
                $ = (X) => X.name === "TimeoutError" ? w : z,
                O = (X) => $(X) <= H;
            return Object.freeze({
                hasRetryTokens: O,
                retrieveRetryTokens: (X) => {
                    if (!O(X)) throw Error("No retry token available");
                    let D = $(X);
                    return H -= D, D
                },
                releaseRetryTokens: (X) => {
                    H += X ?? Y, H = Math.min(H, K)
                }
            })
        },
        RM8 = (A, q) => Math.floor(Math.min(EO.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** q * A)),
        yM8 = (A) => {
            if (!A) return !1;
            return mi.isRetryableByTrait(A) || mi.isClockSkewError(A) || mi.isThrottlingError(A) || mi.isTransientError(A)
        },
        CM8 = (A) => {
            if (A instanceof Error) return A;
            if (A instanceof Object) return Object.assign(Error(), A);
            if (typeof A === "string") return Error(A);
            return Error(`AWS SDK error wrapper for ${A}`)
        };
    class Fp6 {
        maxAttemptsProvider;
        retryDecider;
        delayDecider;
        retryQuota;
        mode = EO.RETRY_MODES.STANDARD;
        constructor(A, q) {
            this.maxAttemptsProvider = A, this.retryDecider = q?.retryDecider ?? yM8, this.delayDecider = q?.delayDecider ?? RM8, this.retryQuota = q?.retryQuota ?? ISK(EO.INITIAL_RETRY_TOKENS)
        }
        shouldRetry(A, q, K) {
            return q < K && this.retryDecider(A) && this.retryQuota.hasRetryTokens(A)
        }
        async getMaxAttempts() {
            let A;
            try {
                A = await this.maxAttemptsProvider()
            } catch (q) {
                A = EO.DEFAULT_MAX_ATTEMPTS
            }
            return A
        }
        async retry(A, q, K) {
            let Y, z = 0,
                w = 0,
                H = await this.getMaxAttempts(),
                {
                    request: $
                } = q;
            if (xH1.HttpRequest.isInstance($)) $.headers[EO.INVOCATION_ID_HEADER] = LM8.v4();
            while (!0) try {
                if (xH1.HttpRequest.isInstance($)) $.headers[EO.REQUEST_HEADER] = `attempt=${z+1}; max=${H}`;
                if (K?.beforeRequest) await K.beforeRequest();
                let {
                    response: O,
                    output: _
                } = await A(q);
                if (K?.afterRequest) K.afterRequest(O);
                return this.retryQuota.releaseRetryTokens(Y), _.$metadata.attempts = z + 1, _.$metadata.totalRetryDelay = w, {
                    response: O,
                    output: _
                }
            } catch (O) {
                let _ = CM8(O);
                if (z++, this.shouldRetry(_, z, H)) {
                    Y = this.retryQuota.retrieveRetryTokens(_);
                    let J = this.delayDecider(mi.isThrottlingError(_) ? EO.THROTTLING_RETRY_DELAY_BASE : EO.DEFAULT_RETRY_DELAY_BASE, z),
                        X = xSK(_.$response),
                        D = Math.max(X || 0, J);
                    w += D, await new Promise((j) => setTimeout(j, D));
                    continue
                }
                if (!_.$metadata) _.$metadata = {};
                throw _.$metadata.attempts = z, _.$metadata.totalRetryDelay = w, _
            }
        }
    }
    var xSK = (A) => {
        if (!xH1.HttpResponse.isInstance(A)) return;
        let q = Object.keys(A.headers).find((w) => w.toLowerCase() === "retry-after");
        if (!q) return;
        let K = A.headers[q],
            Y = Number(K);
        if (!Number.isNaN(Y)) return Y * 1000;
        return new Date(K).getTime() - Date.now()
    };
    class SM8 extends Fp6 {
        rateLimiter;
        constructor(A, q) {
            let {
                rateLimiter: K,
                ...Y
            } = q ?? {};
            super(A, Y);
            this.rateLimiter = K ?? new EO.DefaultRateLimiter, this.mode = EO.RETRY_MODES.ADAPTIVE
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
    var Bp6 = "AWS_MAX_ATTEMPTS",
        mp6 = "max_attempts",
        bSK = {
            environmentVariableSelector: (A) => {
                let q = A[Bp6];
                if (!q) return;
                let K = parseInt(q);
                if (Number.isNaN(K)) throw Error(`Environment variable ${Bp6} mast be a number, got "${q}"`);
                return K
            },
            configFileSelector: (A) => {
                let q = A[mp6];
                if (!q) return;
                let K = parseInt(q);
                if (Number.isNaN(K)) throw Error(`Shared config file entry ${mp6} mast be a number, got "${q}"`);
                return K
            },
            default: EO.DEFAULT_MAX_ATTEMPTS
        },
        uSK = (A) => {
            let {
                retryStrategy: q,
                retryMode: K,
                maxAttempts: Y
            } = A, z = kM8.normalizeProvider(Y ?? EO.DEFAULT_MAX_ATTEMPTS);
            return Object.assign(A, {
                maxAttempts: z,
                retryStrategy: async () => {
                    if (q) return q;
                    if (await kM8.normalizeProvider(K)() === EO.RETRY_MODES.ADAPTIVE) return new EO.AdaptiveRetryStrategy(z);
                    return new EO.StandardRetryStrategy(z)
                }
            })
        },
        hM8 = "AWS_RETRY_MODE",
        IM8 = "retry_mode",
        BSK = {
            environmentVariableSelector: (A) => A[hM8],
            configFileSelector: (A) => A[IM8],
            default: EO.DEFAULT_RETRY_MODE
        },
        xM8 = () => (A) => async (q) => {
            let {
                request: K
            } = q;
            if (xH1.HttpRequest.isInstance(K)) delete K.headers[EO.INVOCATION_ID_HEADER], delete K.headers[EO.REQUEST_HEADER];
            return A(q)
        }, bM8 = {
            name: "omitRetryHeadersMiddleware",
            tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
            relation: "before",
            toMiddleware: "awsAuthMiddleware",
            override: !0
        }, mSK = (A) => ({
            applyToStack: (q) => {
                q.addRelativeTo(xM8(), bM8)
            }
        }), uM8 = (A) => (q, K) => async (Y) => {
            let z = await A.retryStrategy(),
                w = await A.maxAttempts();
            if (FSK(z)) {
                z = z;
                let H = await z.acquireInitialRetryToken(K.partition_id),
                    $ = Error(),
                    O = 0,
                    _ = 0,
                    {
                        request: J
                    } = Y,
                    X = xH1.HttpRequest.isInstance(J);
                if (X) J.headers[EO.INVOCATION_ID_HEADER] = LM8.v4();
                while (!0) try {
                    if (X) J.headers[EO.REQUEST_HEADER] = `attempt=${O+1}; max=${w}`;
                    let {
                        response: D,
                        output: j
                    } = await q(Y);
                    return z.recordSuccess(H), j.$metadata.attempts = O + 1, j.$metadata.totalRetryDelay = _, {
                        response: D,
                        output: j
                    }
                } catch (D) {
                    let j = QSK(D);
                    if ($ = CM8(D), X && hSK.isStreamingPayload(J)) throw (K.logger instanceof SSK.NoOpLogger ? console : K.logger)?.warn("An error was encountered in a non-retryable streaming request."), $;
                    try {
                        H = await z.refreshRetryTokenForRetry(H, j)
                    } catch (P) {
                        if (!$.$metadata) $.$metadata = {};
                        throw $.$metadata.attempts = O + 1, $.$metadata.totalRetryDelay = _, $
                    }
                    O = H.getRetryCount();
                    let M = H.getRetryDelay();
                    _ += M, await new Promise((P) => setTimeout(P, M))
                }
            } else {
                if (z = z, z?.mode) K.userAgent = [...K.userAgent || [],
                    ["cfg/retry-mode", z.mode]
                ];
                return z.retry(q, Y)
            }
        }, FSK = (A) => typeof A.acquireInitialRetryToken < "u" && typeof A.refreshRetryTokenForRetry < "u" && typeof A.recordSuccess < "u", QSK = (A) => {
            let q = {
                    error: A,
                    errorType: gSK(A)
                },
                K = mM8(A.$response);
            if (K) q.retryAfterHint = K;
            return q
        }, gSK = (A) => {
            if (mi.isThrottlingError(A)) return "THROTTLING";
            if (mi.isTransientError(A)) return "TRANSIENT";
            if (mi.isServerError(A)) return "SERVER_ERROR";
            return "CLIENT_ERROR"
        }, BM8 = {
            name: "retryMiddleware",
            tags: ["RETRY"],
            step: "finalizeRequest",
            priority: "high",
            override: !0
        }, USK = (A) => ({
            applyToStack: (q) => {
                q.add(uM8(A), BM8)
            }
        }), mM8 = (A) => {
            if (!xH1.HttpResponse.isInstance(A)) return;
            let q = Object.keys(A.headers).find((w) => w.toLowerCase() === "retry-after");
            if (!q) return;
            let K = A.headers[q],
                Y = Number(K);
            if (!Number.isNaN(Y)) return new Date(Y * 1000);
            return new Date(K)
        };
    pSK.AdaptiveRetryStrategy = SM8;
    pSK.CONFIG_MAX_ATTEMPTS = mp6;
    pSK.CONFIG_RETRY_MODE = IM8;
    pSK.ENV_MAX_ATTEMPTS = Bp6;
    pSK.ENV_RETRY_MODE = hM8;
    pSK.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = bSK;
    pSK.NODE_RETRY_MODE_CONFIG_OPTIONS = BSK;
    pSK.StandardRetryStrategy = Fp6;
    pSK.defaultDelayDecider = RM8;
    pSK.defaultRetryDecider = yM8;
    pSK.getOmitRetryHeadersPlugin = mSK;
    pSK.getRetryAfterHint = mM8;
    pSK.getRetryPlugin = USK;
    pSK.omitRetryHeadersMiddleware = xM8;
    pSK.omitRetryHeadersMiddlewareOptions = bM8;
    pSK.resolveRetryConfig = uSK;
    pSK.retryMiddleware = uM8;
    pSK.retryMiddlewareOptions = BM8
})
// @from(Ln 65473, Col 4)
lp6 = R((DhK) => {
    DhK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(DhK.HttpAuthLocation || (DhK.HttpAuthLocation = {}));
    DhK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(DhK.HttpApiKeyAuthLocation || (DhK.HttpApiKeyAuthLocation = {}));
    DhK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(DhK.EndpointURLScheme || (DhK.EndpointURLScheme = {}));
    DhK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(DhK.AlgorithmId || (DhK.AlgorithmId = {}));
    var $hK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => DhK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => DhK.AlgorithmId.MD5,
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
        OhK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        _hK = (A) => {
            return $hK(A)
        },
        JhK = (A) => {
            return OhK(A)
        };
    DhK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(DhK.FieldPosition || (DhK.FieldPosition = {}));
    var XhK = "__smithy_context";
    DhK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(DhK.IniSectionType || (DhK.IniSectionType = {}));
    DhK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(DhK.RequestHandlerProtocol || (DhK.RequestHandlerProtocol = {}));
    DhK.SMITHY_CONTEXT_KEY = XhK;
    DhK.getDefaultClientConfiguration = _hK;
    DhK.resolveDefaultRuntimeConfig = JhK
})
// @from(Ln 65538, Col 4)
fA1 = R((uH1) => {
    var gM8 = wb(),
        ap6 = rf(),
        np6 = lp6(),
        WhK = R$(),
        FM8 = nf();
    class UM8 {
        config;
        middlewareStack = gM8.constructStack();
        initConfig;
        handlers;
        constructor(A) {
            this.config = A
        }
        send(A, q, K) {
            let Y = typeof q !== "function" ? q : void 0,
                z = typeof q === "function" ? q : K,
                w = Y === void 0 && this.config.cacheMiddleware === !0,
                H;
            if (w) {
                if (!this.handlers) this.handlers = new WeakMap;
                let $ = this.handlers;
                if ($.has(A.constructor)) H = $.get(A.constructor);
                else H = A.resolveMiddleware(this.middlewareStack, this.config, Y), $.set(A.constructor, H)
            } else delete this.handlers, H = A.resolveMiddleware(this.middlewareStack, this.config, Y);
            if (z) H(A).then(($) => z(null, $.output), ($) => z($)).catch(() => {});
            else return H(A).then(($) => $.output)
        }
        destroy() {
            this.config?.requestHandler?.destroy?.(), delete this.handlers
        }
    }
    var ip6 = "***SensitiveInformation***";

    function rp6(A, q) {
        if (q == null) return q;
        let K = WhK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return ip6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return ip6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return ip6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = rp6(H, Y[w]);
            return z
        }
        return q
    }
    class sp6 {
        middlewareStack = gM8.constructStack();
        schema;
        static classBuilder() {
            return new pM8
        }
        resolveMiddlewareWithContext(A, q, K, {
            middlewareFn: Y,
            clientName: z,
            commandName: w,
            inputFilterSensitiveLog: H,
            outputFilterSensitiveLog: $,
            smithyContext: O,
            additionalContext: _,
            CommandCtor: J
        }) {
            for (let P of Y.bind(this)(J, A, q, K)) this.middlewareStack.use(P);
            let X = A.concat(this.middlewareStack),
                {
                    logger: D
                } = q,
                j = {
                    logger: D,
                    clientName: z,
                    commandName: w,
                    inputFilterSensitiveLog: H,
                    outputFilterSensitiveLog: $,
                    [np6.SMITHY_CONTEXT_KEY]: {
                        commandInstance: this,
                        ...O
                    },
                    ..._
                },
                {
                    requestHandler: M
                } = q;
            return X.resolve((P) => M.handle(P.request, K || {}), j)
        }
    }
    class pM8 {
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
            return q = class extends sp6 {
                input;
                static getEndpointParameterInstructions() {
                    return A._ep
                }
                constructor(...[K]) {
                    super();
                    this.input = K ?? {}, A._init(this), this.schema = A._operationSchema
                }
                resolveMiddleware(K, Y, z) {
                    let w = A._operationSchema,
                        H = w?.[4] ?? w?.input,
                        $ = w?.[5] ?? w?.output;
                    return this.resolveMiddlewareWithContext(K, Y, z, {
                        CommandCtor: q,
                        middlewareFn: A._middlewareFn,
                        clientName: A._clientName,
                        commandName: A._commandName,
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? rp6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? rp6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var GhK = "***SensitiveInformation***",
        ZhK = (A, q) => {
            for (let K of Object.keys(A)) {
                let Y = A[K],
                    z = async function(H, $, O) {
                        let _ = new Y(H);
                        if (typeof $ === "function") this.send(_, $);
                        else if (typeof O === "function") {
                            if (typeof $ !== "object") throw Error(`Expected http options but got ${typeof $}`);
                            this.send(_, $ || {}, O)
                        } else return this.send(_, $)
                    }, w = (K[0].toLowerCase() + K.slice(1)).replace(/Command$/, "");
                q.prototype[w] = z
            }
        };
    class bH1 extends Error {
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
            return bH1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === bH1) return bH1.isInstance(A);
            if (bH1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var dM8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        cM8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = VhK(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw dM8(H, q)
        },
        fhK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                cM8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        VhK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        NhK = (A) => {
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
        QM8 = !1,
        ThK = (A) => {
            if (A && !QM8 && parseInt(A.substring(1, A.indexOf("."))) < 16) QM8 = !0
        },
        vhK = (A) => {
            let q = [];
            for (let K in np6.AlgorithmId) {
                let Y = np6.AlgorithmId[K];
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
        EhK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        khK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        LhK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        lM8 = (A) => {
            return Object.assign(vhK(A), khK(A))
        },
        RhK = lM8,
        yhK = (A) => {
            return Object.assign(EhK(A), LhK(A))
        },
        ChK = (A) => Array.isArray(A) ? A : [A],
        iM8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = iM8(A[K]);
            return A
        },
        ShK = (A) => {
            return A != null
        };
    class nM8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function rM8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, xhK(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            oM8(Y, null, w, H)
        }
        return Y
    }
    var hhK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        IhK = (A, q) => {
            let K = {};
            for (let Y in q) oM8(K, A, q, Y);
            return K
        },
        xhK = (A, q, K) => {
            return rM8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        oM8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = bhK, O = uhK, _ = Y] = H;
                if (typeof $ === "function" && $(q[_]) || typeof $ !== "function" && !!$) A[Y] = O(q[_]);
                return
            }
            let [z, w] = K[Y];
            if (typeof w === "function") {
                let H, $ = z === void 0 && (H = w()) != null,
                    O = typeof z === "function" && !!z(void 0) || typeof z !== "function" && !!z;
                if ($) A[Y] = H;
                else if (O) A[Y] = w()
            } else {
                let H = z === void 0 && w != null,
                    $ = typeof z === "function" && !!z(w) || typeof z !== "function" && !!z;
                if (H || $) A[Y] = w
            }
        },
        bhK = (A) => A != null,
        uhK = (A) => A,
        BhK = (A) => {
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
        mhK = (A) => A.toISOString().replace(".000Z", "Z"),
        op6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(op6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = op6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(uH1, "collectBody", {
        enumerable: !0,
        get: function() {
            return ap6.collectBody
        }
    });
    Object.defineProperty(uH1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return ap6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(uH1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return ap6.resolvedPath
        }
    });
    uH1.Client = UM8;
    uH1.Command = sp6;
    uH1.NoOpLogger = nM8;
    uH1.SENSITIVE_STRING = GhK;
    uH1.ServiceException = bH1;
    uH1._json = op6;
    uH1.convertMap = hhK;
    uH1.createAggregatedClient = ZhK;
    uH1.decorateServiceException = dM8;
    uH1.emitWarningIfUnsupportedVersion = ThK;
    uH1.getArrayIfSingleItem = ChK;
    uH1.getDefaultClientConfiguration = RhK;
    uH1.getDefaultExtensionConfiguration = lM8;
    uH1.getValueFromTextNode = iM8;
    uH1.isSerializableHeaderValue = ShK;
    uH1.loadConfigsForDefaultMode = NhK;
    uH1.map = rM8;
    uH1.resolveDefaultRuntimeConfig = yhK;
    uH1.serializeDateTime = mhK;
    uH1.serializeFloat = BhK;
    uH1.take = IhK;
    uH1.throwDefaultError = cM8;
    uH1.withBaseException = fhK;
    Object.keys(FM8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(uH1, A)) Object.defineProperty(uH1, A, {
            enumerable: !0,
            get: function() {
                return FM8[A]
            }
        })
    })
})
// @from(Ln 66008, Col 4)
ep6 = R((sM8) => {
    Object.defineProperty(sM8, "__esModule", {
        value: !0
    });
    sM8.resolveHttpAuthSchemeConfig = sM8.resolveStsAuthConfig = sM8.defaultSTSHttpAuthSchemeProvider = sM8.defaultSTSHttpAuthSchemeParametersProvider = void 0;
    var $IK = YH(),
        tp6 = iP(),
        OIK = Ad6(),
        _IK = async (A, q, K) => {
            return {
                operation: (0, tp6.getSmithyContext)(q).operation,
                region: await (0, tp6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    sM8.defaultSTSHttpAuthSchemeParametersProvider = _IK;

    function JIK(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "sts",
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

    function aM8(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var XIK = (A) => {
        let q = [];
        switch (A.operation) {
            case "AssumeRoleWithSAML": {
                q.push(aM8(A));
                break
            }
            case "AssumeRoleWithWebIdentity": {
                q.push(aM8(A));
                break
            }
            default:
                q.push(JIK(A))
        }
        return q
    };
    sM8.defaultSTSHttpAuthSchemeProvider = XIK;
    var DIK = (A) => Object.assign(A, {
        stsClientCtor: OIK.STSClient
    });
    sM8.resolveStsAuthConfig = DIK;
    var jIK = (A) => {
        let q = sM8.resolveStsAuthConfig(A),
            K = (0, $IK.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, tp6.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    sM8.resolveHttpAuthSchemeConfig = jIK
})
// @from(Ln 66077, Col 4)
qd6 = R((AP8) => {
    Object.defineProperty(AP8, "__esModule", {
        value: !0
    });
    AP8.commonParams = AP8.resolveClientEndpointParameters = void 0;
    var WIK = (A) => {
        return Object.assign(A, {
            useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
            useFipsEndpoint: A.useFipsEndpoint ?? !1,
            useGlobalEndpoint: A.useGlobalEndpoint ?? !1,
            defaultSigningName: "sts"
        })
    };
    AP8.resolveClientEndpointParameters = WIK;
    AP8.commonParams = {
        UseGlobalEndpoint: {
            type: "builtInParams",
            name: "useGlobalEndpoint"
        },
        UseFIPS: {
            type: "builtInParams",
            name: "useFipsEndpoint"
        },
        Endpoint: {
            type: "builtInParams",
            name: "endpoint"
        },
        Region: {
            type: "builtInParams",
            name: "region"
        },
        UseDualStack: {
            type: "builtInParams",
            name: "useDualstackEndpoint"
        }
    }
})
// @from(Ln 66114, Col 4)
KP8 = R((r12, ZIK) => {
    ZIK.exports = {
        name: "@aws-sdk/client-sts",
        description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-sts",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "rimraf ./dist-types tsconfig.types.tsbuildinfo && tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
            test: "yarn g:vitest run",
            "test:watch": "yarn g:vitest watch"
        },
        main: "./dist-cjs/index.js",
        types: "./dist-types/index.d.ts",
        module: "./dist-es/index.js",
        sideEffects: !1,
        dependencies: {
            "@aws-crypto/sha256-browser": "5.2.0",
            "@aws-crypto/sha256-js": "5.2.0",
            "@aws-sdk/core": "3.936.0",
            "@aws-sdk/credential-provider-node": "3.936.0",
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
            "@tsconfig/node18": "18.2.4",
            "@types/node": "^18.19.69",
            concurrently: "7.0.0",
            "downlevel-dts": "0.10.1",
            rimraf: "3.0.2",
            typescript: "~5.8.3"
        },
        engines: {
            node: ">=18.0.0"
        },
        typesVersions: {
            "<4.0": {
                "dist-types/*": ["dist-types/ts3.4/*"]
            }
        },
        files: ["dist-*/**"],
        author: {
            name: "AWS SDK for JavaScript Team",
            url: "https://aws.amazon.com/javascript/"
        },
        license: "Apache-2.0",
        browser: {
            "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
        },
        "react-native": {
            "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
        },
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-sts"
        }
    }
})
// @from(Ln 66213, Col 4)
He1 = R((TIK) => {
    var fIK = of(),
        VIK = wX(),
        YP8 = "AWS_ACCESS_KEY_ID",
        zP8 = "AWS_SECRET_ACCESS_KEY",
        wP8 = "AWS_SESSION_TOKEN",
        HP8 = "AWS_CREDENTIAL_EXPIRATION",
        $P8 = "AWS_CREDENTIAL_SCOPE",
        OP8 = "AWS_ACCOUNT_ID",
        NIK = (A) => async () => {
            A?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
            let q = process.env[YP8],
                K = process.env[zP8],
                Y = process.env[wP8],
                z = process.env[HP8],
                w = process.env[$P8],
                H = process.env[OP8];
            if (q && K) {
                let $ = {
                    accessKeyId: q,
                    secretAccessKey: K,
                    ...Y && {
                        sessionToken: Y
                    },
                    ...z && {
                        expiration: new Date(z)
                    },
                    ...w && {
                        credentialScope: w
                    },
                    ...H && {
                        accountId: H
                    }
                };
                return fIK.setCredentialFeature($, "CREDENTIALS_ENV_VARS", "g"), $
            }
            throw new VIK.CredentialsProviderError("Unable to find environment variable credentials.", {
                logger: A?.logger
            })
        };
    TIK.ENV_ACCOUNT_ID = OP8;
    TIK.ENV_CREDENTIAL_SCOPE = $P8;
    TIK.ENV_EXPIRATION = HP8;
    TIK.ENV_KEY = YP8;
    TIK.ENV_SECRET = zP8;
    TIK.ENV_SESSION = wP8;
    TIK.fromEnv = NIK
})
// @from(Ln 66261, Col 4)
VA1 = R((zxK) => {
    var Jb = wX(),
        SIK = h1("url"),
        hIK = h1("buffer"),
        IIK = h1("http"),
        wd6 = af(),
        xIK = fk();

    function SE1(A) {
        return new Promise((q, K) => {
            let Y = IIK.request({
                method: "GET",
                ...A,
                hostname: A.hostname?.replace(/^\[(.+)\]$/, "$1")
            });
            Y.on("error", (z) => {
                K(Object.assign(new Jb.ProviderError("Unable to connect to instance metadata service"), z)), Y.destroy()
            }), Y.on("timeout", () => {
                K(new Jb.ProviderError("TimeoutError from instance metadata service")), Y.destroy()
            }), Y.on("response", (z) => {
                let {
                    statusCode: w = 400
                } = z;
                if (w < 200 || 300 <= w) K(Object.assign(new Jb.ProviderError("Error response received from instance metadata service"), {
                    statusCode: w
                })), Y.destroy();
                let H = [];
                z.on("data", ($) => {
                    H.push($)
                }), z.on("end", () => {
                    q(hIK.Buffer.concat(H)), Y.destroy()
                })
            }), Y.end()
        })
    }
    var DP8 = (A) => Boolean(A) && typeof A === "object" && typeof A.AccessKeyId === "string" && typeof A.SecretAccessKey === "string" && typeof A.Token === "string" && typeof A.Expiration === "string",
        jP8 = (A) => ({
            accessKeyId: A.AccessKeyId,
            secretAccessKey: A.SecretAccessKey,
            sessionToken: A.Token,
            expiration: new Date(A.Expiration),
            ...A.AccountId && {
                accountId: A.AccountId
            }
        }),
        MP8 = 1000,
        PP8 = 0,
        Hd6 = ({
            maxRetries: A = PP8,
            timeout: q = MP8
        }) => ({
            maxRetries: A,
            timeout: q
        }),
        Yd6 = (A, q) => {
            let K = A();
            for (let Y = 0; Y < q; Y++) K = K.catch(A);
            return K
        },
        $e1 = "AWS_CONTAINER_CREDENTIALS_FULL_URI",
        Oe1 = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
        zd6 = "AWS_CONTAINER_AUTHORIZATION_TOKEN",
        bIK = (A = {}) => {
            let {
                timeout: q,
                maxRetries: K
            } = Hd6(A);
            return () => Yd6(async () => {
                let Y = await QIK({
                        logger: A.logger
                    }),
                    z = JSON.parse(await uIK(q, Y));
                if (!DP8(z)) throw new Jb.CredentialsProviderError("Invalid response received from instance metadata service.", {
                    logger: A.logger
                });
                return jP8(z)
            }, K)
        },
        uIK = async (A, q) => {
            if (process.env[zd6]) q.headers = {
                ...q.headers,
                Authorization: process.env[zd6]
            };
            return (await SE1({
                ...q,
                timeout: A
            })).toString()
        }, BIK = "169.254.170.2", mIK = {
            localhost: !0,
            "127.0.0.1": !0
        }, FIK = {
            "http:": !0,
            "https:": !0
        }, QIK = async ({
            logger: A
        }) => {
            if (process.env[Oe1]) return {
                hostname: BIK,
                path: process.env[Oe1]
            };
            if (process.env[$e1]) {
                let q = SIK.parse(process.env[$e1]);
                if (!q.hostname || !(q.hostname in mIK)) throw new Jb.CredentialsProviderError(`${q.hostname} is not a valid container metadata service hostname`, {
                    tryNextLink: !1,
                    logger: A
                });
                if (!q.protocol || !(q.protocol in FIK)) throw new Jb.CredentialsProviderError(`${q.protocol} is not a valid container metadata service protocol`, {
                    tryNextLink: !1,
                    logger: A
                });
                return {
                    ...q,
                    port: q.port ? parseInt(q.port, 10) : void 0
                }
            }
            throw new Jb.CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${Oe1} or ${$e1} environment variable is set`, {
                tryNextLink: !1,
                logger: A
            })
        };
    class $d6 extends Jb.CredentialsProviderError {
        tryNextLink;
        name = "InstanceMetadataV1FallbackError";
        constructor(A, q = !0) {
            super(A, q);
            this.tryNextLink = q, Object.setPrototypeOf(this, $d6.prototype)
        }
    }
    zxK.Endpoint = void 0;
    (function(A) {
        A.IPv4 = "http://169.254.169.254", A.IPv6 = "http://[fd00:ec2::254]"
    })(zxK.Endpoint || (zxK.Endpoint = {}));
    var gIK = "AWS_EC2_METADATA_SERVICE_ENDPOINT",
        UIK = "ec2_metadata_service_endpoint",
        pIK = {
            environmentVariableSelector: (A) => A[gIK],
            configFileSelector: (A) => A[UIK],
            default: void 0
        },
        BH1;
    (function(A) {
        A.IPv4 = "IPv4", A.IPv6 = "IPv6"
    })(BH1 || (BH1 = {}));
    var dIK = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE",
        cIK = "ec2_metadata_service_endpoint_mode",
        lIK = {
            environmentVariableSelector: (A) => A[dIK],
            configFileSelector: (A) => A[cIK],
            default: BH1.IPv4
        },
        WP8 = async () => xIK.parseUrl(await iIK() || await nIK()), iIK = async () => wd6.loadConfig(pIK)(), nIK = async () => {
            let A = await wd6.loadConfig(lIK)();
            switch (A) {
                case BH1.IPv4:
                    return zxK.Endpoint.IPv4;
                case BH1.IPv6:
                    return zxK.Endpoint.IPv6;
                default:
                    throw Error(`Unsupported endpoint mode: ${A}. Select from ${Object.values(BH1)}`)
            }
        }, rIK = 300, oIK = 300, aIK = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html", _P8 = (A, q) => {
            let K = rIK + Math.floor(Math.random() * oIK),
                Y = new Date(Date.now() + K * 1000);
            q.warn(`Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(Y)}.
For more information, please visit: ` + aIK);
            let z = A.originalExpiration ?? A.expiration;
            return {
                ...A,
                ...z ? {
                    originalExpiration: z
                } : {},
                expiration: Y
            }
        }, sIK = (A, q = {}) => {
            let K = q?.logger || console,
                Y;
            return async () => {
                let z;
                try {
                    if (z = await A(), z.expiration && z.expiration.getTime() < Date.now()) z = _P8(z, K)
                } catch (w) {
                    if (Y) K.warn("Credential renew failed: ", w), z = _P8(Y, K);
                    else throw w
                }
                return Y = z, z
            }
        }, GP8 = "/latest/meta-data/iam/security-credentials/", tIK = "/latest/api/token", Kd6 = "AWS_EC2_METADATA_V1_DISABLED", JP8 = "ec2_metadata_v1_disabled", XP8 = "x-aws-ec2-metadata-token", eIK = (A = {}) => sIK(AxK(A), {
            logger: A.logger
        }), AxK = (A = {}) => {
            let q = !1,
                {
                    logger: K,
                    profile: Y
                } = A,
                {
                    timeout: z,
                    maxRetries: w
                } = Hd6(A),
                H = async ($, O) => {
                    if (q || O.headers?.[XP8] == null) {
                        let X = !1,
                            D = !1,
                            j = await wd6.loadConfig({
                                environmentVariableSelector: (M) => {
                                    let P = M[Kd6];
                                    if (D = !!P && P !== "false", P === void 0) throw new Jb.CredentialsProviderError(`${Kd6} not set in env, checking config file next.`, {
                                        logger: A.logger
                                    });
                                    return D
                                },
                                configFileSelector: (M) => {
                                    let P = M[JP8];
                                    return X = !!P && P !== "false", X
                                },
                                default: !1
                            }, {
                                profile: Y
                            })();
                        if (A.ec2MetadataV1Disabled || j) {
                            let M = [];
                            if (A.ec2MetadataV1Disabled) M.push("credential provider initialization (runtime option ec2MetadataV1Disabled)");
                            if (X) M.push(`config file profile (${JP8})`);
                            if (D) M.push(`process environment variable (${Kd6})`);
                            throw new $d6(`AWS EC2 Metadata v1 fallback has been blocked by AWS SDK configuration in the following: [${M.join(", ")}].`)
                        }
                    }
                    let J = (await Yd6(async () => {
                        let X;
                        try {
                            X = await KxK(O)
                        } catch (D) {
                            if (D.statusCode === 401) q = !1;
                            throw D
                        }
                        return X
                    }, $)).trim();
                    return Yd6(async () => {
                        let X;
                        try {
                            X = await YxK(J, O, A)
                        } catch (D) {
                            if (D.statusCode === 401) q = !1;
                            throw D
                        }
                        return X
                    }, $)
                };
            return async () => {
                let $ = await WP8();
                if (q) return K?.debug("AWS SDK Instance Metadata", "using v1 fallback (no token fetch)"), H(w, {
                    ...$,
                    timeout: z
                });
                else {
                    let O;
                    try {
                        O = (await qxK({
                            ...$,
                            timeout: z
                        })).toString()
                    } catch (_) {
                        if (_?.statusCode === 400) throw Object.assign(_, {
                            message: "EC2 Metadata token request returned error"
                        });
                        else if (_.message === "TimeoutError" || [403, 404, 405].includes(_.statusCode)) q = !0;
                        return K?.debug("AWS SDK Instance Metadata", "using v1 fallback (initial)"), H(w, {
                            ...$,
                            timeout: z
                        })
                    }
                    return H(w, {
                        ...$,
                        headers: {
                            [XP8]: O
                        },
                        timeout: z
                    })
                }
            }
        }, qxK = async (A) => SE1({
            ...A,
            path: tIK,
            method: "PUT",
            headers: {
                "x-aws-ec2-metadata-token-ttl-seconds": "21600"
            }
        }), KxK = async (A) => (await SE1({
            ...A,
            path: GP8
        })).toString(), YxK = async (A, q, K) => {
            let Y = JSON.parse((await SE1({
                ...q,
                path: GP8 + A
            })).toString());
            if (!DP8(Y)) throw new Jb.CredentialsProviderError("Invalid response received from instance metadata service.", {
                logger: K.logger
            });
            return jP8(Y)
        };
    zxK.DEFAULT_MAX_RETRIES = PP8;
    zxK.DEFAULT_TIMEOUT = MP8;
    zxK.ENV_CMDS_AUTH_TOKEN = zd6;
    zxK.ENV_CMDS_FULL_URI = $e1;
    zxK.ENV_CMDS_RELATIVE_URI = Oe1;
    zxK.fromContainerMetadata = bIK;
    zxK.fromInstanceMetadata = eIK;
    zxK.getInstanceMetadataEndpoint = WP8;
    zxK.httpRequest = SE1;
    zxK.providerConfigFromInit = Hd6
})
// @from(Ln 66571, Col 4)
VP8 = R((ZP8) => {
    Object.defineProperty(ZP8, "__esModule", {
        value: !0
    });
    ZP8.checkUrl = void 0;
    var PxK = wX(),
        WxK = "169.254.170.2",
        GxK = "169.254.170.23",
        ZxK = "[fd00:ec2::23]",
        fxK = (A, q) => {
            if (A.protocol === "https:") return;
            if (A.hostname === WxK || A.hostname === GxK || A.hostname === ZxK) return;
            if (A.hostname.includes("[")) {
                if (A.hostname === "[::1]" || A.hostname === "[0000:0000:0000:0000:0000:0000:0000:0001]") return
            } else {
                if (A.hostname === "localhost") return;
                let K = A.hostname.split("."),
                    Y = (z) => {
                        let w = parseInt(z, 10);
                        return 0 <= w && w <= 255
                    };
                if (K[0] === "127" && Y(K[1]) && Y(K[2]) && Y(K[3]) && K.length === 4) return
            }
            throw new PxK.CredentialsProviderError(`URL not accepted. It must either be HTTPS or match one of the following:
  - loopback CIDR 127.0.0.0/8 or [::1/128]
  - ECS container host 169.254.170.2
  - EKS container host 169.254.170.23 or [fd00:ec2::23]`, {
                logger: q
            })
        };
    ZP8.checkUrl = fxK
})
// @from(Ln 66603, Col 4)
Md6 = R((kxK) => {
    kxK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(kxK.HttpAuthLocation || (kxK.HttpAuthLocation = {}));
    kxK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(kxK.HttpApiKeyAuthLocation || (kxK.HttpApiKeyAuthLocation = {}));
    kxK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(kxK.EndpointURLScheme || (kxK.EndpointURLScheme = {}));
    kxK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(kxK.AlgorithmId || (kxK.AlgorithmId = {}));
    var VxK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => kxK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => kxK.AlgorithmId.MD5,
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
        NxK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        TxK = (A) => {
            return VxK(A)
        },
        vxK = (A) => {
            return NxK(A)
        };
    kxK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(kxK.FieldPosition || (kxK.FieldPosition = {}));
    var ExK = "__smithy_context";
    kxK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(kxK.IniSectionType || (kxK.IniSectionType = {}));
    kxK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(kxK.RequestHandlerProtocol || (kxK.RequestHandlerProtocol = {}));
    kxK.SMITHY_CONTEXT_KEY = ExK;
    kxK.getDefaultClientConfiguration = TxK;
    kxK.resolveDefaultRuntimeConfig = vxK
})