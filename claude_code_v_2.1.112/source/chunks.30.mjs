
// @from(Ln 74226, Col 4)
$7q = p((mM3) => {
    var BH1 = iP8(),
        M76 = FO(),
        t1q = jP(),
        LM3 = $E(),
        e1q = mH1(),
        q7q = (q) => BH1.HttpResponse.isInstance(q) ? q.headers?.date ?? q.headers?.Date : void 0,
        pH1 = (q) => new Date(Date.now() + q),
        hM3 = (q, K) => Math.abs(pH1(K).getTime() - q) >= 300000,
        K7q = (q, K) => {
            let _ = Date.parse(q);
            if (hM3(_, K)) return _ - Date.now();
            return K
        },
        vc6 = (q, K) => {
            if (!K) throw Error(`Property \`${q}\` is not resolved for AWS SDK SigV4Auth`);
            return K
        },
        FH1 = async (q) => {
            let K = vc6("context", q.context),
                _ = vc6("config", q.config),
                z = K.endpointV2?.properties?.authSchemes?.[0],
                A = await vc6("signer", _.signer)(z),
                O = q?.signingRegion,
                w = q?.signingRegionSet,
                $ = q?.signingName;
            return {
                config: _,
                signer: A,
                signingRegion: O,
                signingRegionSet: w,
                signingName: $
            }
        };
    class _W8 {
        async sign(q, K, _) {
            if (!BH1.HttpRequest.isInstance(q)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let z = await FH1(_),
                {
                    config: Y,
                    signer: A
                } = z,
                {
                    signingRegion: O,
                    signingName: w
                } = z,
                $ = _.context;
            if ($?.authSchemes?.length ?? !1) {
                let [H, J] = $.authSchemes;
                if (H?.name === "sigv4a" && J?.name === "sigv4") O = J?.signingRegion ?? O, w = J?.signingName ?? w
            }
            return await A.sign(q, {
                signingDate: pH1(Y.systemClockOffset),
                signingRegion: O,
                signingService: w
            })
        }
        errorHandler(q) {
            return (K) => {
                let _ = K.ServerTime ?? q7q(K.$response);
                if (_) {
                    let z = vc6("config", q.config),
                        Y = z.systemClockOffset;
                    if (z.systemClockOffset = K7q(_, z.systemClockOffset), z.systemClockOffset !== Y && K.$metadata) K.$metadata.clockSkewCorrected = !0
                }
                throw K
            }
        }
        successHandler(q, K) {
            let _ = q7q(q);
            if (_) {
                let z = vc6("config", K.config);
                z.systemClockOffset = K7q(_, z.systemClockOffset)
            }
        }
    }
    var RM3 = _W8;
    class A7q extends _W8 {
        async sign(q, K, _) {
            if (!BH1.HttpRequest.isInstance(q)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let {
                config: z,
                signer: Y,
                signingRegion: A,
                signingRegionSet: O,
                signingName: w
            } = await FH1(_), j = (await z.sigv4aSigningRegionSet?.() ?? O ?? [A]).join(",");
            return await Y.sign(q, {
                signingDate: pH1(z.systemClockOffset),
                signingRegion: j,
                signingService: w
            })
        }
    }
    var _7q = (q) => typeof q === "string" && q.length > 0 ? q.split(",").map((K) => K.trim()) : [],
        O7q = (q) => `AWS_BEARER_TOKEN_${q.replace(/[\s-]/g,"_").toUpperCase()}`,
        z7q = "AWS_AUTH_SCHEME_PREFERENCE",
        Y7q = "auth_scheme_preference",
        SM3 = {
            environmentVariableSelector: (q, K) => {
                if (K?.signingName) {
                    if (O7q(K.signingName) in q) return ["httpBearerAuth"]
                }
                if (!(z7q in q)) return;
                return _7q(q[z7q])
            },
            configFileSelector: (q) => {
                if (!(Y7q in q)) return;
                return _7q(q[Y7q])
            },
            default: []
        },
        CM3 = (q) => {
            return q.sigv4aSigningRegionSet = M76.normalizeProvider(q.sigv4aSigningRegionSet), q
        },
        bM3 = {
            environmentVariableSelector(q) {
                if (q.AWS_SIGV4A_SIGNING_REGION_SET) return q.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((K) => K.trim());
                throw new t1q.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
                    tryNextLink: !0
                })
            },
            configFileSelector(q) {
                if (q.sigv4a_signing_region_set) return (q.sigv4a_signing_region_set ?? "").split(",").map((K) => K.trim());
                throw new t1q.ProviderError("sigv4a_signing_region_set not set in profile.", {
                    tryNextLink: !0
                })
            },
            default: void 0
        },
        w7q = (q) => {
            let K = q.credentials,
                _ = !!q.credentials,
                z = void 0;
            Object.defineProperty(q, "credentials", {
                set(j) {
                    if (j && j !== K && j !== z) _ = !0;
                    K = j;
                    let H = xM3(q, {
                            credentials: K,
                            credentialDefaultProvider: q.credentialDefaultProvider
                        }),
                        J = uM3(q, H);
                    if (_ && !J.attributed) z = async (X) => J(X).then((M) => LM3.setCredentialFeature(M, "CREDENTIALS_CODE", "e")), z.memoized = J.memoized, z.configBound = J.configBound, z.attributed = !0;
                    else z = J
                },
                get() {
                    return z
                },
                enumerable: !0,
                configurable: !0
            }), q.credentials = K;
            let {
                signingEscapePath: Y = !0,
                systemClockOffset: A = q.systemClockOffset || 0,
                sha256: O
            } = q, w;
            if (q.signer) w = M76.normalizeProvider(q.signer);
            else if (q.regionInfoProvider) w = () => M76.normalizeProvider(q.region)().then(async (j) => [await q.regionInfoProvider(j, {
                useFipsEndpoint: await q.useFipsEndpoint(),
                useDualstackEndpoint: await q.useDualstackEndpoint()
            }) || {}, j]).then(([j, H]) => {
                let {
                    signingRegion: J,
                    signingService: X
                } = j;
                q.signingRegion = q.signingRegion || J || H, q.signingName = q.signingName || X || q.serviceId;
                let M = {
                    ...q,
                    credentials: q.credentials,
                    region: q.signingRegion,
                    service: q.signingName,
                    sha256: O,
                    uriEscapePath: Y
                };
                return new(q.signerConstructor || e1q.SignatureV4)(M)
            });
            else w = async (j) => {
                j = Object.assign({}, {
                    name: "sigv4",
                    signingName: q.signingName || q.defaultSigningName,
                    signingRegion: await M76.normalizeProvider(q.region)(),
                    properties: {}
                }, j);
                let {
                    signingRegion: H,
                    signingName: J
                } = j;
                q.signingRegion = q.signingRegion || H, q.signingName = q.signingName || J || q.serviceId;
                let X = {
                    ...q,
                    credentials: q.credentials,
                    region: q.signingRegion,
                    service: q.signingName,
                    sha256: O,
                    uriEscapePath: Y
                };
                return new(q.signerConstructor || e1q.SignatureV4)(X)
            };
            return Object.assign(q, {
                systemClockOffset: A,
                signingEscapePath: Y,
                signer: w
            })
        },
        IM3 = w7q;

    function xM3(q, {
        credentials: K,
        credentialDefaultProvider: _
    }) {
        let z;
        if (K)
            if (!K?.memoized) z = M76.memoizeIdentityProvider(K, M76.isIdentityExpired, M76.doesIdentityRequireRefresh);
            else z = K;
        else if (_) z = M76.normalizeProvider(_(Object.assign({}, q, {
            parentClientConfig: q
        })));
        else z = async () => {
            throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
        };
        return z.memoized = !0, z
    }

    function uM3(q, K) {
        if (K.configBound) return K;
        let _ = async (z) => K({
            ...z,
            callerClientConfig: q
        });
        return _.memoized = K.memoized, _.configBound = !0, _
    }
    mM3.AWSSDKSigV4Signer = RM3;
    mM3.AwsSdkSigV4ASigner = A7q;
    mM3.AwsSdkSigV4Signer = _W8;
    mM3.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = SM3;
    mM3.NODE_SIGV4A_CONFIG_OPTIONS = bM3;
    mM3.getBearerTokenEnvKey = O7q;
    mM3.resolveAWSSDKSigV4Config = IM3;
    mM3.resolveAwsSdkSigV4AConfig = CM3;
    mM3.resolveAwsSdkSigV4Config = w7q;
    mM3.validateSigningProperties = FH1
})
// @from(Ln 74469, Col 4)
j7q = p((tM3) => {
    tM3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(tM3.HttpAuthLocation || (tM3.HttpAuthLocation = {}));
    tM3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(tM3.HttpApiKeyAuthLocation || (tM3.HttpApiKeyAuthLocation = {}));
    tM3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(tM3.EndpointURLScheme || (tM3.EndpointURLScheme = {}));
    tM3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(tM3.AlgorithmId || (tM3.AlgorithmId = {}));
    var iM3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => tM3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => tM3.AlgorithmId.MD5,
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
        rM3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        oM3 = (q) => {
            return iM3(q)
        },
        aM3 = (q) => {
            return rM3(q)
        };
    tM3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(tM3.FieldPosition || (tM3.FieldPosition = {}));
    var sM3 = "__smithy_context";
    tM3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(tM3.IniSectionType || (tM3.IniSectionType = {}));
    tM3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(tM3.RequestHandlerProtocol || (tM3.RequestHandlerProtocol = {}));
    tM3.SMITHY_CONTEXT_KEY = sM3;
    tM3.getDefaultClientConfiguration = oM3;
    tM3.resolveDefaultRuntimeConfig = aM3
})
// @from(Ln 74534, Col 4)
M7q = p((wP3) => {
    var _P3 = j7q(),
        zP3 = (q) => {
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
        YP3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class H7q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = _P3.FieldPosition.HEADER,
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
    class J7q {
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
    class zW8 {
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
            let K = new zW8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = AP3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return zW8.clone(this)
        }
    }

    function AP3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class X7q {
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

    function OP3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    wP3.Field = H7q;
    wP3.Fields = J7q;
    wP3.HttpRequest = zW8;
    wP3.HttpResponse = X7q;
    wP3.getHttpHandlerExtensionConfiguration = zP3;
    wP3.isValidHostname = OP3;
    wP3.resolveHttpHandlerRuntimeConfig = YP3
})
// @from(Ln 74676, Col 4)
nr = p((fP3) => {
    var WP3 = M7q();

    function DP3(q) {
        return q
    }
    var P7q = (q) => (K) => async (_) => {
        if (!WP3.HttpRequest.isInstance(_.request)) return K(_);
        let {
            request: z
        } = _, {
            handlerProtocol: Y = ""
        } = q.requestHandler.metadata || {};
        if (Y.indexOf("h2") >= 0 && !z.headers[":authority"]) delete z.headers.host, z.headers[":authority"] = z.hostname + (z.port ? ":" + z.port : "");
        else if (!z.headers.host) {
            let A = z.hostname;
            if (z.port != null) A += `:${z.port}`;
            z.headers.host = A
        }
        return K(_)
    }, W7q = {
        name: "hostHeaderMiddleware",
        step: "build",
        priority: "low",
        tags: ["HOST"],
        override: !0
    }, ZP3 = (q) => ({
        applyToStack: (K) => {
            K.add(P7q(q), W7q)
        }
    });
    fP3.getHostHeaderPlugin = ZP3;
    fP3.hostHeaderMiddleware = P7q;
    fP3.hostHeaderMiddlewareOptions = W7q;
    fP3.resolveHostHeaderConfig = DP3
})
// @from(Ln 74712, Col 4)
ir = p((NP3) => {
    var D7q = () => (q, K) => async (_) => {
        try {
            let z = await q(_),
                {
                    clientName: Y,
                    commandName: A,
                    logger: O,
                    dynamoDbDocumentClientOptions: w = {}
                } = K,
                {
                    overrideInputFilterSensitiveLog: $,
                    overrideOutputFilterSensitiveLog: j
                } = w,
                H = $ ?? K.inputFilterSensitiveLog,
                J = j ?? K.outputFilterSensitiveLog,
                {
                    $metadata: X,
                    ...M
                } = z.output;
            return O?.info?.({
                clientName: Y,
                commandName: A,
                input: H(_.input),
                output: J(M),
                metadata: X
            }), z
        } catch (z) {
            let {
                clientName: Y,
                commandName: A,
                logger: O,
                dynamoDbDocumentClientOptions: w = {}
            } = K, {
                overrideInputFilterSensitiveLog: $
            } = w, j = $ ?? K.inputFilterSensitiveLog;
            throw O?.error?.({
                clientName: Y,
                commandName: A,
                input: j(_.input),
                error: z,
                metadata: z.$metadata
            }), z
        }
    }, Z7q = {
        name: "loggerMiddleware",
        tags: ["LOGGER"],
        step: "initialize",
        override: !0
    }, kP3 = (q) => ({
        applyToStack: (K) => {
            K.add(D7q(), Z7q)
        }
    });
    NP3.getLoggerPlugin = kP3;
    NP3.loggerMiddleware = D7q;
    NP3.loggerMiddlewareOptions = Z7q
})
// @from(Ln 74770, Col 4)
G7q = p((hP3) => {
    var Vc6 = {
            REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
            X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
            TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID")
        },
        nH1 = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
    if (!nH1) globalThis.awslambda = globalThis.awslambda || {};
    class YW8 {
        static PROTECTED_KEYS = Vc6;
        isProtectedKey(q) {
            return Object.values(Vc6).includes(q)
        }
        getRequestId() {
            return this.get(Vc6.REQUEST_ID) ?? "-"
        }
        getXRayTraceId() {
            return this.get(Vc6.X_RAY_TRACE_ID)
        }
        getTenantId() {
            return this.get(Vc6.TENANT_ID)
        }
    }
    class f7q extends YW8 {
        currentContext;
        getContext() {
            return this.currentContext
        }
        hasContext() {
            return this.currentContext !== void 0
        }
        get(q) {
            return this.currentContext?.[q]
        }
        set(q, K) {
            if (this.isProtectedKey(q)) throw Error(`Cannot modify protected Lambda context field: ${String(q)}`);
            this.currentContext = this.currentContext || {}, this.currentContext[q] = K
        }
        run(q, K) {
            this.currentContext = q;
            try {
                return K()
            } finally {
                this.currentContext = void 0
            }
        }
    }
    class rH1 extends YW8 {
        als;
        static async create() {
            let q = new rH1,
                K = await import("node:async_hooks");
            return q.als = new K.AsyncLocalStorage, q
        }
        getContext() {
            return this.als.getStore()
        }
        hasContext() {
            return this.als.getStore() !== void 0
        }
        get(q) {
            return this.als.getStore()?.[q]
        }
        set(q, K) {
            if (this.isProtectedKey(q)) throw Error(`Cannot modify protected Lambda context field: ${String(q)}`);
            let _ = this.als.getStore();
            if (!_) throw Error("No context available");
            _[q] = K
        }
        run(q, K) {
            return this.als.run(q, K)
        }
    }
    hP3.InvokeStore = void 0;
    (function(q) {
        let K = null;
        async function _() {
            if (!K) K = (async () => {
                let Y = "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await rH1.create() : new f7q;
                if (!nH1 && globalThis.awslambda?.InvokeStore) return globalThis.awslambda.InvokeStore;
                else if (!nH1 && globalThis.awslambda) return globalThis.awslambda.InvokeStore = Y, Y;
                else return Y
            })();
            return K
        }
        q.getInstanceAsync = _, q._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? {
            reset: () => {
                if (K = null, globalThis.awslambda?.InvokeStore) delete globalThis.awslambda.InvokeStore;
                globalThis.awslambda = {}
            }
        } : void 0
    })(hP3.InvokeStore || (hP3.InvokeStore = {}));
    hP3.InvokeStoreBase = YW8
})
// @from(Ln 74864, Col 4)
v7q = p((uP3) => {
    uP3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(uP3.HttpAuthLocation || (uP3.HttpAuthLocation = {}));
    uP3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(uP3.HttpApiKeyAuthLocation || (uP3.HttpApiKeyAuthLocation = {}));
    uP3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(uP3.EndpointURLScheme || (uP3.EndpointURLScheme = {}));
    uP3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(uP3.AlgorithmId || (uP3.AlgorithmId = {}));
    var SP3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => uP3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => uP3.AlgorithmId.MD5,
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
        CP3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        bP3 = (q) => {
            return SP3(q)
        },
        IP3 = (q) => {
            return CP3(q)
        };
    uP3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(uP3.FieldPosition || (uP3.FieldPosition = {}));
    var xP3 = "__smithy_context";
    uP3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(uP3.IniSectionType || (uP3.IniSectionType = {}));
    uP3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(uP3.RequestHandlerProtocol || (uP3.RequestHandlerProtocol = {}));
    uP3.SMITHY_CONTEXT_KEY = xP3;
    uP3.getDefaultClientConfiguration = bP3;
    uP3.resolveDefaultRuntimeConfig = IP3
})
// @from(Ln 74929, Col 4)
N7q = p((cP3) => {
    var FP3 = v7q(),
        gP3 = (q) => {
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
        UP3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class T7q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = FP3.FieldPosition.HEADER,
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
    class V7q {
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
    class AW8 {
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
            let K = new AW8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = QP3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return AW8.clone(this)
        }
    }

    function QP3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class k7q {
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

    function dP3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    cP3.Field = T7q;
    cP3.Fields = V7q;
    cP3.HttpRequest = AW8;
    cP3.HttpResponse = k7q;
    cP3.getHttpHandlerExtensionConfiguration = gP3;
    cP3.isValidHostname = dP3;
    cP3.resolveHttpHandlerRuntimeConfig = UP3
})
// @from(Ln 75071, Col 4)
L7q = p((E7q) => {
    Object.defineProperty(E7q, "__esModule", {
        value: !0
    });
    E7q.recursionDetectionMiddleware = void 0;
    var tP3 = G7q(),
        eP3 = N7q(),
        KJ1 = "X-Amzn-Trace-Id",
        qW3 = "AWS_LAMBDA_FUNCTION_NAME",
        KW3 = "_X_AMZN_TRACE_ID",
        _W3 = () => (q) => async (K) => {
            let {
                request: _
            } = K;
            if (!eP3.HttpRequest.isInstance(_)) return q(K);
            let z = Object.keys(_.headers ?? {}).find((H) => H.toLowerCase() === KJ1.toLowerCase()) ?? KJ1;
            if (_.headers.hasOwnProperty(z)) return q(K);
            let Y = process.env[qW3],
                A = process.env[KW3],
                $ = (await tP3.InvokeStore.getInstanceAsync())?.getXRayTraceId() ?? A,
                j = (H) => typeof H === "string" && H.length > 0;
            if (j(Y) && j($)) _.headers[KJ1] = $;
            return q({
                ...K,
                request: _
            })
        };
    E7q.recursionDetectionMiddleware = _W3
})
// @from(Ln 75100, Col 4)
rr = p((zJ1) => {
    var _J1 = L7q(),
        zW3 = {
            step: "build",
            tags: ["RECURSION_DETECTION"],
            name: "recursionDetectionMiddleware",
            override: !0,
            priority: "low"
        },
        YW3 = (q) => ({
            applyToStack: (K) => {
                K.add(_J1.recursionDetectionMiddleware(), zW3)
            }
        });
    zJ1.getRecursionDetectionPlugin = YW3;
    Object.keys(_J1).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(zJ1, q)) Object.defineProperty(zJ1, q, {
            enumerable: !0,
            get: function() {
                return _J1[q]
            }
        })
    })
})
// @from(Ln 75124, Col 4)
h7q = p((JW3) => {
    JW3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(JW3.HttpAuthLocation || (JW3.HttpAuthLocation = {}));
    JW3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(JW3.HttpApiKeyAuthLocation || (JW3.HttpApiKeyAuthLocation = {}));
    JW3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(JW3.EndpointURLScheme || (JW3.EndpointURLScheme = {}));
    JW3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(JW3.AlgorithmId || (JW3.AlgorithmId = {}));
    var OW3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => JW3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => JW3.AlgorithmId.MD5,
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
        wW3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        $W3 = (q) => {
            return OW3(q)
        },
        jW3 = (q) => {
            return wW3(q)
        };
    JW3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(JW3.FieldPosition || (JW3.FieldPosition = {}));
    var HW3 = "__smithy_context";
    JW3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(JW3.IniSectionType || (JW3.IniSectionType = {}));
    JW3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(JW3.RequestHandlerProtocol || (JW3.RequestHandlerProtocol = {}));
    JW3.SMITHY_CONTEXT_KEY = HW3;
    JW3.getDefaultClientConfiguration = $W3;
    JW3.resolveDefaultRuntimeConfig = jW3
})
// @from(Ln 75189, Col 4)
dm = p((xW3) => {
    var JJ1 = h7q();
    class R7q {
        capacity;
        data = new Map;
        parameters = [];
        constructor({
            size: q,
            params: K
        }) {
            if (this.capacity = q ?? 50, K) this.parameters = K
        }
        get(q, K) {
            let _ = this.hash(q);
            if (_ === !1) return K();
            if (!this.data.has(_)) {
                if (this.data.size > this.capacity + 10) {
                    let z = this.data.keys(),
                        Y = 0;
                    while (!0) {
                        let {
                            value: A,
                            done: O
                        } = z.next();
                        if (this.data.delete(A), O || ++Y > 10) break
                    }
                }
                this.data.set(_, K())
            }
            return this.data.get(_)
        }
        size() {
            return this.data.size
        }
        hash(q) {
            let K = "",
                {
                    parameters: _
                } = this;
            if (_.length === 0) return !1;
            for (let z of _) {
                let Y = String(q[z] ?? "");
                if (Y.includes("|;")) return !1;
                K += Y + "|;"
            }
            return K
        }
    }
    var WW3 = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"),
        S7q = (q) => WW3.test(q) || q.startsWith("[") && q.endsWith("]"),
        DW3 = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"),
        MJ1 = (q, K = !1) => {
            if (!K) return DW3.test(q);
            let _ = q.split(".");
            for (let z of _)
                if (!MJ1(z)) return !1;
            return !0
        },
        XJ1 = {},
        Ec6 = "endpoints";

    function P76(q) {
        if (typeof q !== "object" || q == null) return q;
        if ("ref" in q) return `$${P76(q.ref)}`;
        if ("fn" in q) return `${q.fn}(${(q.argv||[]).map(P76).join(", ")})`;
        return JSON.stringify(q, null, 2)
    }
    class xV extends Error {
        constructor(q) {
            super(q);
            this.name = "EndpointError"
        }
    }
    var ZW3 = (q, K) => q === K,
        fW3 = (q) => {
            let K = q.split("."),
                _ = [];
            for (let z of K) {
                let Y = z.indexOf("[");
                if (Y !== -1) {
                    if (z.indexOf("]") !== z.length - 1) throw new xV(`Path: '${q}' does not end with ']'`);
                    let A = z.slice(Y + 1, -1);
                    if (Number.isNaN(parseInt(A))) throw new xV(`Invalid array index: '${A}' in path: '${q}'`);
                    if (Y !== 0) _.push(z.slice(0, Y));
                    _.push(A)
                } else _.push(z)
            }
            return _
        },
        C7q = (q, K) => fW3(K).reduce((_, z) => {
            if (typeof _ !== "object") throw new xV(`Index '${z}' in '${K}' not found in '${JSON.stringify(q)}'`);
            else if (Array.isArray(_)) return _[parseInt(z)];
            return _[z]
        }, q),
        GW3 = (q) => q != null,
        vW3 = (q) => !q,
        HJ1 = {
            [JJ1.EndpointURLScheme.HTTP]: 80,
            [JJ1.EndpointURLScheme.HTTPS]: 443
        },
        TW3 = (q) => {
            let K = (() => {
                try {
                    if (q instanceof URL) return q;
                    if (typeof q === "object" && "hostname" in q) {
                        let {
                            hostname: X,
                            port: M,
                            protocol: P = "",
                            path: W = "",
                            query: D = {}
                        } = q, Z = new URL(`${P}//${X}${M?`:${M}`:""}${W}`);
                        return Z.search = Object.entries(D).map(([G, f]) => `${G}=${f}`).join("&"), Z
                    }
                    return new URL(q)
                } catch (X) {
                    return null
                }
            })();
            if (!K) return console.error(`Unable to parse ${JSON.stringify(q)} as a whatwg URL.`), null;
            let _ = K.href,
                {
                    host: z,
                    hostname: Y,
                    pathname: A,
                    protocol: O,
                    search: w
                } = K;
            if (w) return null;
            let $ = O.slice(0, -1);
            if (!Object.values(JJ1.EndpointURLScheme).includes($)) return null;
            let j = S7q(Y),
                H = _.includes(`${z}:${HJ1[$]}`) || typeof q === "string" && q.includes(`${z}:${HJ1[$]}`),
                J = `${z}${H?`:${HJ1[$]}`:""}`;
            return {
                scheme: $,
                authority: J,
                path: A,
                normalizedPath: A.endsWith("/") ? A : `${A}/`,
                isIp: j
            }
        },
        VW3 = (q, K) => q === K,
        kW3 = (q, K, _, z) => {
            if (K >= _ || q.length < _) return null;
            if (!z) return q.substring(K, _);
            return q.substring(q.length - _, q.length - K)
        },
        NW3 = (q) => encodeURIComponent(q).replace(/[!*'()]/g, (K) => `%${K.charCodeAt(0).toString(16).toUpperCase()}`),
        EW3 = {
            booleanEquals: ZW3,
            getAttr: C7q,
            isSet: GW3,
            isValidHostLabel: MJ1,
            not: vW3,
            parseURL: TW3,
            stringEquals: VW3,
            substring: kW3,
            uriEncode: NW3
        },
        b7q = (q, K) => {
            let _ = [],
                z = {
                    ...K.endpointParams,
                    ...K.referenceRecord
                },
                Y = 0;
            while (Y < q.length) {
                let A = q.indexOf("{", Y);
                if (A === -1) {
                    _.push(q.slice(Y));
                    break
                }
                _.push(q.slice(Y, A));
                let O = q.indexOf("}", A);
                if (O === -1) {
                    _.push(q.slice(A));
                    break
                }
                if (q[A + 1] === "{" && q[O + 1] === "}") _.push(q.slice(A + 1, O)), Y = O + 2;
                let w = q.substring(A + 1, O);
                if (w.includes("#")) {
                    let [$, j] = w.split("#");
                    _.push(C7q(z[$], j))
                } else _.push(z[w]);
                Y = O + 1
            }
            return _.join("")
        },
        yW3 = ({
            ref: q
        }, K) => {
            return {
                ...K.endpointParams,
                ...K.referenceRecord
            } [q]
        },
        OW8 = (q, K, _) => {
            if (typeof q === "string") return b7q(q, _);
            else if (q.fn) return x7q.callFunction(q, _);
            else if (q.ref) return yW3(q, _);
            throw new xV(`'${K}': ${String(q)} is not a string, function or reference.`)
        },
        I7q = ({
            fn: q,
            argv: K
        }, _) => {
            let z = K.map((A) => ["boolean", "number"].includes(typeof A) ? A : x7q.evaluateExpression(A, "arg", _)),
                Y = q.split(".");
            if (Y[0] in XJ1 && Y[1] != null) return XJ1[Y[0]][Y[1]](...z);
            return EW3[q](...z)
        },
        x7q = {
            evaluateExpression: OW8,
            callFunction: I7q
        },
        LW3 = ({
            assign: q,
            ...K
        }, _) => {
            if (q && q in _.referenceRecord) throw new xV(`'${q}' is already defined in Reference Record.`);
            let z = I7q(K, _);
            return _.logger?.debug?.(`${Ec6} evaluateCondition: ${P76(K)} = ${P76(z)}`), {
                result: z === "" ? !0 : !!z,
                ...q != null && {
                    toAssign: {
                        name: q,
                        value: z
                    }
                }
            }
        },
        PJ1 = (q = [], K) => {
            let _ = {};
            for (let z of q) {
                let {
                    result: Y,
                    toAssign: A
                } = LW3(z, {
                    ...K,
                    referenceRecord: {
                        ...K.referenceRecord,
                        ..._
                    }
                });
                if (!Y) return {
                    result: Y
                };
                if (A) _[A.name] = A.value, K.logger?.debug?.(`${Ec6} assign: ${A.name} := ${P76(A.value)}`)
            }
            return {
                result: !0,
                referenceRecord: _
            }
        },
        hW3 = (q, K) => Object.entries(q).reduce((_, [z, Y]) => ({
            ..._,
            [z]: Y.map((A) => {
                let O = OW8(A, "Header value entry", K);
                if (typeof O !== "string") throw new xV(`Header '${z}' value '${O}' is not a string`);
                return O
            })
        }), {}),
        u7q = (q, K) => Object.entries(q).reduce((_, [z, Y]) => ({
            ..._,
            [z]: B7q.getEndpointProperty(Y, K)
        }), {}),
        m7q = (q, K) => {
            if (Array.isArray(q)) return q.map((_) => m7q(_, K));
            switch (typeof q) {
                case "string":
                    return b7q(q, K);
                case "object":
                    if (q === null) throw new xV(`Unexpected endpoint property: ${q}`);
                    return B7q.getEndpointProperties(q, K);
                case "boolean":
                    return q;
                default:
                    throw new xV(`Unexpected endpoint property type: ${typeof q}`)
            }
        },
        B7q = {
            getEndpointProperty: m7q,
            getEndpointProperties: u7q
        },
        RW3 = (q, K) => {
            let _ = OW8(q, "Endpoint URL", K);
            if (typeof _ === "string") try {
                return new URL(_)
            } catch (z) {
                throw console.error(`Failed to construct URL with ${_}`, z), z
            }
            throw new xV(`Endpoint URL must be a string, got ${typeof _}`)
        },
        SW3 = (q, K) => {
            let {
                conditions: _,
                endpoint: z
            } = q, {
                result: Y,
                referenceRecord: A
            } = PJ1(_, K);
            if (!Y) return;
            let O = {
                    ...K,
                    referenceRecord: {
                        ...K.referenceRecord,
                        ...A
                    }
                },
                {
                    url: w,
                    properties: $,
                    headers: j
                } = z;
            return K.logger?.debug?.(`${Ec6} Resolving endpoint from template: ${P76(z)}`), {
                ...j != null && {
                    headers: hW3(j, O)
                },
                ...$ != null && {
                    properties: u7q($, O)
                },
                url: RW3(w, O)
            }
        },
        CW3 = (q, K) => {
            let {
                conditions: _,
                error: z
            } = q, {
                result: Y,
                referenceRecord: A
            } = PJ1(_, K);
            if (!Y) return;
            throw new xV(OW8(z, "Error", {
                ...K,
                referenceRecord: {
                    ...K.referenceRecord,
                    ...A
                }
            }))
        },
        p7q = (q, K) => {
            for (let _ of q)
                if (_.type === "endpoint") {
                    let z = SW3(_, K);
                    if (z) return z
                } else if (_.type === "error") CW3(_, K);
            else if (_.type === "tree") {
                let z = F7q.evaluateTreeRule(_, K);
                if (z) return z
            } else throw new xV(`Unknown endpoint rule: ${_}`);
            throw new xV("Rules evaluation failed")
        },
        bW3 = (q, K) => {
            let {
                conditions: _,
                rules: z
            } = q, {
                result: Y,
                referenceRecord: A
            } = PJ1(_, K);
            if (!Y) return;
            return F7q.evaluateRules(z, {
                ...K,
                referenceRecord: {
                    ...K.referenceRecord,
                    ...A
                }
            })
        },
        F7q = {
            evaluateRules: p7q,
            evaluateTreeRule: bW3
        },
        IW3 = (q, K) => {
            let {
                endpointParams: _,
                logger: z
            } = K, {
                parameters: Y,
                rules: A
            } = q;
            K.logger?.debug?.(`${Ec6} Initial EndpointParams: ${P76(_)}`);
            let O = Object.entries(Y).filter(([, j]) => j.default != null).map(([j, H]) => [j, H.default]);
            if (O.length > 0)
                for (let [j, H] of O) _[j] = _[j] ?? H;
            let w = Object.entries(Y).filter(([, j]) => j.required).map(([j]) => j);
            for (let j of w)
                if (_[j] == null) throw new xV(`Missing required parameter: '${j}'`);
            let $ = p7q(A, {
                endpointParams: _,
                logger: z,
                referenceRecord: {}
            });
            return K.logger?.debug?.(`${Ec6} Resolved endpoint: ${P76($)}`), $
        };
    xW3.EndpointCache = R7q;
    xW3.EndpointError = xV;
    xW3.customEndpointFunctions = XJ1;
    xW3.isIpAddress = S7q;
    xW3.isValidHostLabel = MJ1;
    xW3.resolveEndpoint = IW3
})
// @from(Ln 75593, Col 4)
QU = p((wW8) => {
    var Gv6 = dm(),
        UW3 = jb(),
        U7q = (q, K = !1) => {
            if (K) {
                for (let _ of q.split("."))
                    if (!U7q(_)) return !1;
                return !0
            }
            if (!Gv6.isValidHostLabel(q)) return !1;
            if (q.length < 3 || q.length > 63) return !1;
            if (q !== q.toLowerCase()) return !1;
            if (Gv6.isIpAddress(q)) return !1;
            return !0
        },
        g7q = ":",
        QW3 = "/",
        dW3 = (q) => {
            let K = q.split(g7q);
            if (K.length < 6) return null;
            let [_, z, Y, A, O, ...w] = K;
            if (_ !== "arn" || z === "" || Y === "" || w.join(g7q) === "") return null;
            let $ = w.map((j) => j.split(QW3)).flat();
            return {
                partition: z,
                service: Y,
                region: A,
                accountId: O,
                resourceId: $
            }
        },
        cW3 = [{
            id: "aws",
            outputs: {
                dnsSuffix: "amazonaws.com",
                dualStackDnsSuffix: "api.aws",
                implicitGlobalRegion: "us-east-1",
                name: "aws",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^(us|eu|ap|sa|ca|me|af|il|mx)\\-\\w+\\-\\d+$",
            regions: {
                "af-south-1": {
                    description: "Africa (Cape Town)"
                },
                "ap-east-1": {
                    description: "Asia Pacific (Hong Kong)"
                },
                "ap-east-2": {
                    description: "Asia Pacific (Taipei)"
                },
                "ap-northeast-1": {
                    description: "Asia Pacific (Tokyo)"
                },
                "ap-northeast-2": {
                    description: "Asia Pacific (Seoul)"
                },
                "ap-northeast-3": {
                    description: "Asia Pacific (Osaka)"
                },
                "ap-south-1": {
                    description: "Asia Pacific (Mumbai)"
                },
                "ap-south-2": {
                    description: "Asia Pacific (Hyderabad)"
                },
                "ap-southeast-1": {
                    description: "Asia Pacific (Singapore)"
                },
                "ap-southeast-2": {
                    description: "Asia Pacific (Sydney)"
                },
                "ap-southeast-3": {
                    description: "Asia Pacific (Jakarta)"
                },
                "ap-southeast-4": {
                    description: "Asia Pacific (Melbourne)"
                },
                "ap-southeast-5": {
                    description: "Asia Pacific (Malaysia)"
                },
                "ap-southeast-6": {
                    description: "Asia Pacific (New Zealand)"
                },
                "ap-southeast-7": {
                    description: "Asia Pacific (Thailand)"
                },
                "aws-global": {
                    description: "aws global region"
                },
                "ca-central-1": {
                    description: "Canada (Central)"
                },
                "ca-west-1": {
                    description: "Canada West (Calgary)"
                },
                "eu-central-1": {
                    description: "Europe (Frankfurt)"
                },
                "eu-central-2": {
                    description: "Europe (Zurich)"
                },
                "eu-north-1": {
                    description: "Europe (Stockholm)"
                },
                "eu-south-1": {
                    description: "Europe (Milan)"
                },
                "eu-south-2": {
                    description: "Europe (Spain)"
                },
                "eu-west-1": {
                    description: "Europe (Ireland)"
                },
                "eu-west-2": {
                    description: "Europe (London)"
                },
                "eu-west-3": {
                    description: "Europe (Paris)"
                },
                "il-central-1": {
                    description: "Israel (Tel Aviv)"
                },
                "me-central-1": {
                    description: "Middle East (UAE)"
                },
                "me-south-1": {
                    description: "Middle East (Bahrain)"
                },
                "mx-central-1": {
                    description: "Mexico (Central)"
                },
                "sa-east-1": {
                    description: "South America (Sao Paulo)"
                },
                "us-east-1": {
                    description: "US East (N. Virginia)"
                },
                "us-east-2": {
                    description: "US East (Ohio)"
                },
                "us-west-1": {
                    description: "US West (N. California)"
                },
                "us-west-2": {
                    description: "US West (Oregon)"
                }
            }
        }, {
            id: "aws-cn",
            outputs: {
                dnsSuffix: "amazonaws.com.cn",
                dualStackDnsSuffix: "api.amazonwebservices.com.cn",
                implicitGlobalRegion: "cn-northwest-1",
                name: "aws-cn",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^cn\\-\\w+\\-\\d+$",
            regions: {
                "aws-cn-global": {
                    description: "aws-cn global region"
                },
                "cn-north-1": {
                    description: "China (Beijing)"
                },
                "cn-northwest-1": {
                    description: "China (Ningxia)"
                }
            }
        }, {
            id: "aws-eusc",
            outputs: {
                dnsSuffix: "amazonaws.eu",
                dualStackDnsSuffix: "api.amazonwebservices.eu",
                implicitGlobalRegion: "eusc-de-east-1",
                name: "aws-eusc",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^eusc\\-(de)\\-\\w+\\-\\d+$",
            regions: {
                "eusc-de-east-1": {
                    description: "EU (Germany)"
                }
            }
        }, {
            id: "aws-iso",
            outputs: {
                dnsSuffix: "c2s.ic.gov",
                dualStackDnsSuffix: "api.aws.ic.gov",
                implicitGlobalRegion: "us-iso-east-1",
                name: "aws-iso",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-global": {
                    description: "aws-iso global region"
                },
                "us-iso-east-1": {
                    description: "US ISO East"
                },
                "us-iso-west-1": {
                    description: "US ISO WEST"
                }
            }
        }, {
            id: "aws-iso-b",
            outputs: {
                dnsSuffix: "sc2s.sgov.gov",
                dualStackDnsSuffix: "api.aws.scloud",
                implicitGlobalRegion: "us-isob-east-1",
                name: "aws-iso-b",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-b-global": {
                    description: "aws-iso-b global region"
                },
                "us-isob-east-1": {
                    description: "US ISOB East (Ohio)"
                },
                "us-isob-west-1": {
                    description: "US ISOB West"
                }
            }
        }, {
            id: "aws-iso-e",
            outputs: {
                dnsSuffix: "cloud.adc-e.uk",
                dualStackDnsSuffix: "api.cloud-aws.adc-e.uk",
                implicitGlobalRegion: "eu-isoe-west-1",
                name: "aws-iso-e",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-e-global": {
                    description: "aws-iso-e global region"
                },
                "eu-isoe-west-1": {
                    description: "EU ISOE West"
                }
            }
        }, {
            id: "aws-iso-f",
            outputs: {
                dnsSuffix: "csp.hci.ic.gov",
                dualStackDnsSuffix: "api.aws.hci.ic.gov",
                implicitGlobalRegion: "us-isof-south-1",
                name: "aws-iso-f",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
            regions: {
                "aws-iso-f-global": {
                    description: "aws-iso-f global region"
                },
                "us-isof-east-1": {
                    description: "US ISOF EAST"
                },
                "us-isof-south-1": {
                    description: "US ISOF SOUTH"
                }
            }
        }, {
            id: "aws-us-gov",
            outputs: {
                dnsSuffix: "amazonaws.com",
                dualStackDnsSuffix: "api.aws",
                implicitGlobalRegion: "us-gov-west-1",
                name: "aws-us-gov",
                supportsDualStack: !0,
                supportsFIPS: !0
            },
            regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
            regions: {
                "aws-us-gov-global": {
                    description: "aws-us-gov global region"
                },
                "us-gov-east-1": {
                    description: "AWS GovCloud (US-East)"
                },
                "us-gov-west-1": {
                    description: "AWS GovCloud (US-West)"
                }
            }
        }],
        lW3 = "1.1",
        Q7q = {
            partitions: cW3,
            version: lW3
        },
        d7q = Q7q,
        c7q = "",
        l7q = (q) => {
            let {
                partitions: K
            } = d7q;
            for (let z of K) {
                let {
                    regions: Y,
                    outputs: A
                } = z;
                for (let [O, w] of Object.entries(Y))
                    if (O === q) return {
                        ...A,
                        ...w
                    }
            }
            for (let z of K) {
                let {
                    regionRegex: Y,
                    outputs: A
                } = z;
                if (new RegExp(Y).test(q)) return {
                    ...A
                }
            }
            let _ = K.find((z) => z.id === "aws");
            if (!_) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
            return {
                ..._.outputs
            }
        },
        n7q = (q, K = "") => {
            d7q = q, c7q = K
        },
        nW3 = () => {
            n7q(Q7q, "")
        },
        iW3 = () => c7q,
        i7q = {
            isVirtualHostableS3Bucket: U7q,
            parseArn: dW3,
            partition: l7q
        };
    Gv6.customEndpointFunctions.aws = i7q;
    var rW3 = (q) => {
            if (typeof q.endpointProvider !== "function") throw Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
            let {
                endpoint: K
            } = q;
            if (K === void 0) q.endpoint = async () => {
                return r7q(q.endpointProvider({
                    Region: typeof q.region === "function" ? await q.region() : q.region,
                    UseDualStack: typeof q.useDualstackEndpoint === "function" ? await q.useDualstackEndpoint() : q.useDualstackEndpoint,
                    UseFIPS: typeof q.useFipsEndpoint === "function" ? await q.useFipsEndpoint() : q.useFipsEndpoint,
                    Endpoint: void 0
                }, {
                    logger: q.logger
                }))
            };
            return q
        },
        r7q = (q) => UW3.parseUrl(q.url);
    Object.defineProperty(wW8, "EndpointError", {
        enumerable: !0,
        get: function() {
            return Gv6.EndpointError
        }
    });
    Object.defineProperty(wW8, "isIpAddress", {
        enumerable: !0,
        get: function() {
            return Gv6.isIpAddress
        }
    });
    Object.defineProperty(wW8, "resolveEndpoint", {
        enumerable: !0,
        get: function() {
            return Gv6.resolveEndpoint
        }
    });
    wW8.awsEndpointFunctions = i7q;
    wW8.getUserAgentPrefix = iW3;
    wW8.partition = l7q;
    wW8.resolveDefaultAwsRegionalEndpointsConfig = rW3;
    wW8.setPartitionInfo = n7q;
    wW8.toEndpointV1 = r7q;
    wW8.useDefaultPartitionInfo = nW3
})
// @from(Ln 75982, Col 4)
o7q = p((w03) => {
    w03.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(w03.HttpAuthLocation || (w03.HttpAuthLocation = {}));
    w03.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(w03.HttpApiKeyAuthLocation || (w03.HttpApiKeyAuthLocation = {}));
    w03.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(w03.EndpointURLScheme || (w03.EndpointURLScheme = {}));
    w03.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(w03.AlgorithmId || (w03.AlgorithmId = {}));
    var _03 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => w03.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => w03.AlgorithmId.MD5,
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
        z03 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        Y03 = (q) => {
            return _03(q)
        },
        A03 = (q) => {
            return z03(q)
        };
    w03.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(w03.FieldPosition || (w03.FieldPosition = {}));
    var O03 = "__smithy_context";
    w03.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(w03.IniSectionType || (w03.IniSectionType = {}));
    w03.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(w03.RequestHandlerProtocol || (w03.RequestHandlerProtocol = {}));
    w03.SMITHY_CONTEXT_KEY = O03;
    w03.getDefaultClientConfiguration = Y03;
    w03.resolveDefaultRuntimeConfig = A03
})
// @from(Ln 76047, Col 4)
e7q = p((D03) => {
    var J03 = o7q(),
        X03 = (q) => {
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
        M03 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class a7q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = J03.FieldPosition.HEADER,
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
    class s7q {
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
    class $W8 {
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
            let K = new $W8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = P03(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return $W8.clone(this)
        }
    }

    function P03(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class t7q {
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

    function W03(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    D03.Field = a7q;
    D03.Fields = s7q;
    D03.HttpRequest = $W8;
    D03.HttpResponse = t7q;
    D03.getHttpHandlerExtensionConfiguration = X03;
    D03.isValidHostname = W03;
    D03.resolveHttpHandlerRuntimeConfig = M03
})
// @from(Ln 76189, Col 4)
Kqq = p((E03) => {
    var qqq = typeof TextEncoder == "function" ? new TextEncoder : null,
        N03 = (q) => {
            if (typeof q === "string") {
                if (qqq) return qqq.encode(q).byteLength;
                let K = q.length;
                for (let _ = K - 1; _ >= 0; _--) {
                    let z = q.charCodeAt(_);
                    if (z > 127 && z <= 2047) K++;
                    else if (z > 2047 && z <= 65535) K += 2;
                    if (z >= 56320 && z <= 57343) _--
                }
                return K
            } else if (typeof q.byteLength === "number") return q.byteLength;
            else if (typeof q.size === "number") return q.size;
            throw Error(`Body Length computation failed for ${q}`)
        };
    E03.calculateBodyLength = N03
})
// @from(Ln 76208, Col 4)
xJ1 = p((o03) => {
    var MW8 = JE(),
        Aqq = nw(),
        hc6 = XE(),
        L03 = Ac6(),
        h03 = Kqq(),
        vv6 = sj(),
        R03 = Dv(),
        Oqq = rj1(),
        JW8 = 0,
        XW8 = 1,
        vO6 = 2,
        W76 = 3,
        Lc6 = 4,
        jW8 = 5,
        wqq = 6,
        TJ1 = 7,
        $qq = 20,
        NJ1 = 21,
        jqq = 22,
        S03 = 23,
        yJ1 = 24,
        TO6 = 25,
        VO6 = 26,
        D76 = 27,
        LJ1 = 31;

    function Tv6(q) {
        return typeof Buffer < "u" ? Buffer.alloc(q) : new Uint8Array(q)
    }
    var hJ1 = Symbol("@smithy/core/cbor::tagSymbol");

    function RJ1(q) {
        return q[hJ1] = !0, q
    }
    var C03 = typeof TextDecoder < "u",
        b03 = typeof Buffer < "u",
        iw = Tv6(0),
        sr = new DataView(iw.buffer, iw.byteOffset, iw.byteLength),
        _qq = C03 ? new TextDecoder : null,
        Jz = 0;

    function I03(q) {
        iw = q, sr = new DataView(iw.buffer, iw.byteOffset, iw.byteLength)
    }

    function tr(q, K) {
        if (q >= K) throw Error("unexpected end of (decode) payload.");
        let _ = (iw[q] & 224) >> 5,
            z = iw[q] & 31;
        switch (_) {
            case JW8:
            case XW8:
            case wqq:
                let Y, A;
                if (z < 24) Y = z, A = 1;
                else switch (z) {
                    case yJ1:
                    case TO6:
                    case VO6:
                    case D76:
                        let O = Jqq[z],
                            w = O + 1;
                        if (A = w, K - q < w) throw Error(`countLength ${O} greater than remaining buf len.`);
                        let $ = q + 1;
                        if (O === 1) Y = iw[$];
                        else if (O === 2) Y = sr.getUint16($);
                        else if (O === 4) Y = sr.getUint32($);
                        else Y = sr.getBigUint64($);
                        break;
                    default:
                        throw Error(`unexpected minor value ${z}.`)
                }
                if (_ === JW8) return Jz = A, VJ1(Y);
                else if (_ === XW8) {
                    let O;
                    if (typeof Y === "bigint") O = BigInt(-1) - Y;
                    else O = -1 - Y;
                    return Jz = A, VJ1(O)
                } else if (z === 2 || z === 3) {
                    let O = Rc6(q + A, K),
                        w = BigInt(0),
                        $ = q + A + Jz;
                    for (let j = $; j < $ + O; ++j) w = w << BigInt(8) | BigInt(iw[j]);
                    return Jz = A + Jz + O, z === 3 ? -w - BigInt(1) : w
                } else if (z === 4) {
                    let O = tr(q + A, K),
                        [w, $] = O,
                        j = $ < 0 ? -1 : 1,
                        H = "0".repeat(Math.abs(w) + 1) + String(BigInt(j) * BigInt($)),
                        J, X = $ < 0 ? "-" : "";
                    if (J = w === 0 ? H : H.slice(0, H.length + w) + "." + H.slice(w), J = J.replace(/^0+/g, ""), J === "") J = "0";
                    if (J[0] === ".") J = "0" + J;
                    return J = X + J, Jz = A + Jz, MW8.nv(J)
                } else {
                    let O = tr(q + A, K);
                    return Jz = A + Jz, RJ1({
                        tag: VJ1(Y),
                        value: O
                    })
                }
            case W76:
            case jW8:
            case Lc6:
            case vO6:
                if (z === LJ1) switch (_) {
                    case W76:
                        return B03(q, K);
                    case jW8:
                        return Q03(q, K);
                    case Lc6:
                        return g03(q, K);
                    case vO6:
                        return p03(q, K)
                } else switch (_) {
                    case W76:
                        return m03(q, K);
                    case jW8:
                        return U03(q, K);
                    case Lc6:
                        return F03(q, K);
                    case vO6:
                        return SJ1(q, K)
                }
                default: return d03(q, K)
        }
    }

    function Hqq(q, K, _) {
        if (b03 && q.constructor?.name === "Buffer") return q.toString("utf-8", K, _);
        if (_qq) return _qq.decode(q.subarray(K, _));
        return Aqq.toUtf8(q.subarray(K, _))
    }

    function x03(q) {
        let K = Number(q);
        if (K < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < K) console.warn(Error(`@smithy/core/cbor - truncating BigInt(${q}) to ${K} with loss of precision.`));
        return K
    }
    var Jqq = {
        [yJ1]: 1,
        [TO6]: 2,
        [VO6]: 4,
        [D76]: 8
    };

    function u03(q, K) {
        let _ = q >> 7,
            z = (q & 124) >> 2,
            Y = (q & 3) << 8 | K,
            A = _ === 0 ? 1 : -1,
            O, w;
        if (z === 0)
            if (Y === 0) return 0;
            else O = Math.pow(2, -14), w = 0;
        else if (z === 31)
            if (Y === 0) return A * (1 / 0);
            else return NaN;
        else O = Math.pow(2, z - 15), w = 1;
        return w += Y / 1024, A * (O * w)
    }

    function Rc6(q, K) {
        let _ = iw[q] & 31;
        if (_ < 24) return Jz = 1, _;
        if (_ === yJ1 || _ === TO6 || _ === VO6 || _ === D76) {
            let z = Jqq[_];
            if (Jz = z + 1, K - q < Jz) throw Error(`countLength ${z} greater than remaining buf len.`);
            let Y = q + 1;
            if (z === 1) return iw[Y];
            else if (z === 2) return sr.getUint16(Y);
            else if (z === 4) return sr.getUint32(Y);
            return x03(sr.getBigUint64(Y))
        }
        throw Error(`unexpected minor value ${_}.`)
    }

    function m03(q, K) {
        let _ = Rc6(q, K),
            z = Jz;
        if (q += z, K - q < _) throw Error(`string len ${_} greater than remaining buf len.`);
        let Y = Hqq(iw, q, q + _);
        return Jz = z + _, Y
    }

    function B03(q, K) {
        q += 1;
        let _ = [];
        for (let z = q; q < K;) {
            if (iw[q] === 255) {
                let $ = Tv6(_.length);
                return $.set(_, 0), Jz = q - z + 2, Hqq($, 0, $.length)
            }
            let Y = (iw[q] & 224) >> 5,
                A = iw[q] & 31;
            if (Y !== W76) throw Error(`unexpected major type ${Y} in indefinite string.`);
            if (A === LJ1) throw Error("nested indefinite string.");
            let O = SJ1(q, K);
            q += Jz;
            for (let $ = 0; $ < O.length; ++$) _.push(O[$])
        }
        throw Error("expected break marker.")
    }

    function SJ1(q, K) {
        let _ = Rc6(q, K),
            z = Jz;
        if (q += z, K - q < _) throw Error(`unstructured byte string len ${_} greater than remaining buf len.`);
        let Y = iw.subarray(q, q + _);
        return Jz = z + _, Y
    }

    function p03(q, K) {
        q += 1;
        let _ = [];
        for (let z = q; q < K;) {
            if (iw[q] === 255) {
                let $ = Tv6(_.length);
                return $.set(_, 0), Jz = q - z + 2, $
            }
            let Y = (iw[q] & 224) >> 5,
                A = iw[q] & 31;
            if (Y !== vO6) throw Error(`unexpected major type ${Y} in indefinite string.`);
            if (A === LJ1) throw Error("nested indefinite string.");
            let O = SJ1(q, K);
            q += Jz;
            for (let $ = 0; $ < O.length; ++$) _.push(O[$])
        }
        throw Error("expected break marker.")
    }

    function F03(q, K) {
        let _ = Rc6(q, K),
            z = Jz;
        q += z;
        let Y = q,
            A = Array(_);
        for (let O = 0; O < _; ++O) {
            let w = tr(q, K),
                $ = Jz;
            A[O] = w, q += $
        }
        return Jz = z + (q - Y), A
    }

    function g03(q, K) {
        q += 1;
        let _ = [];
        for (let z = q; q < K;) {
            if (iw[q] === 255) return Jz = q - z + 2, _;
            let Y = tr(q, K);
            q += Jz, _.push(Y)
        }
        throw Error("expected break marker.")
    }

    function U03(q, K) {
        let _ = Rc6(q, K),
            z = Jz;
        q += z;
        let Y = q,
            A = {};
        for (let O = 0; O < _; ++O) {
            if (q >= K) throw Error("unexpected end of map payload.");
            let w = (iw[q] & 224) >> 5;
            if (w !== W76) throw Error(`unexpected major type ${w} for map key at index ${q}.`);
            let $ = tr(q, K);
            q += Jz;
            let j = tr(q, K);
            q += Jz, A[$] = j
        }
        return Jz = z + (q - Y), A
    }

    function Q03(q, K) {
        q += 1;
        let _ = q,
            z = {};
        for (; q < K;) {
            if (q >= K) throw Error("unexpected end of map payload.");
            if (iw[q] === 255) return Jz = q - _ + 2, z;
            let Y = (iw[q] & 224) >> 5;
            if (Y !== W76) throw Error(`unexpected major type ${Y} for map key.`);
            let A = tr(q, K);
            q += Jz;
            let O = tr(q, K);
            q += Jz, z[A] = O
        }
        throw Error("expected break marker.")
    }

    function d03(q, K) {
        let _ = iw[q] & 31;
        switch (_) {
            case NJ1:
            case $qq:
                return Jz = 1, _ === NJ1;
            case jqq:
                return Jz = 1, null;
            case S03:
                return Jz = 1, null;
            case TO6:
                if (K - q < 3) throw Error("incomplete float16 at end of buf.");
                return Jz = 3, u03(iw[q + 1], iw[q + 2]);
            case VO6:
                if (K - q < 5) throw Error("incomplete float32 at end of buf.");
                return Jz = 5, sr.getFloat32(q + 1);
            case D76:
                if (K - q < 9) throw Error("incomplete float64 at end of buf.");
                return Jz = 9, sr.getFloat64(q + 1);
            default:
                throw Error(`unexpected minor value ${_}.`)
        }
    }

    function VJ1(q) {
        if (typeof q === "number") return q;
        let K = Number(q);
        if (Number.MIN_SAFE_INTEGER <= K && K <= Number.MAX_SAFE_INTEGER) return K;
        return q
    }
    var zqq = typeof Buffer < "u",
        c03 = 2048,
        j9 = Tv6(c03),
        ar = new DataView(j9.buffer, j9.byteOffset, j9.byteLength),
        f5 = 0;

    function kJ1(q) {
        if (j9.byteLength - f5 < q)
            if (f5 < 16000000) EJ1(Math.max(j9.byteLength * 4, j9.byteLength + q));
            else EJ1(j9.byteLength + q + 16000000)
    }

    function Yqq() {
        let q = Tv6(f5);
        return q.set(j9.subarray(0, f5), 0), f5 = 0, q
    }

    function EJ1(q) {
        let K = j9;
        if (j9 = Tv6(q), K)
            if (K.copy) K.copy(j9, 0, 0, K.byteLength);
            else j9.set(K, 0);
        ar = new DataView(j9.buffer, j9.byteOffset, j9.byteLength)
    }

    function or(q, K) {
        if (K < 24) j9[f5++] = q << 5 | K;
        else if (K < 256) j9[f5++] = q << 5 | 24, j9[f5++] = K;
        else if (K < 65536) j9[f5++] = q << 5 | TO6, ar.setUint16(f5, K), f5 += 2;
        else if (K < 4294967296) j9[f5++] = q << 5 | VO6, ar.setUint32(f5, K), f5 += 4;
        else j9[f5++] = q << 5 | D76, ar.setBigUint64(f5, typeof K === "bigint" ? K : BigInt(K)), f5 += 8
    }

    function l03(q) {
        let K = [q];
        while (K.length) {
            let _ = K.pop();
            if (kJ1(typeof _ === "string" ? _.length * 4 : 64), typeof _ === "string") {
                if (zqq) or(W76, Buffer.byteLength(_)), f5 += j9.write(_, f5);
                else {
                    let z = Aqq.fromUtf8(_);
                    or(W76, z.byteLength), j9.set(z, f5), f5 += z.byteLength
                }
                continue
            } else if (typeof _ === "number") {
                if (Number.isInteger(_)) {
                    let z = _ >= 0,
                        Y = z ? JW8 : XW8,
                        A = z ? _ : -_ - 1;
                    if (A < 24) j9[f5++] = Y << 5 | A;
                    else if (A < 256) j9[f5++] = Y << 5 | 24, j9[f5++] = A;
                    else if (A < 65536) j9[f5++] = Y << 5 | TO6, j9[f5++] = A >> 8, j9[f5++] = A;
                    else if (A < 4294967296) j9[f5++] = Y << 5 | VO6, ar.setUint32(f5, A), f5 += 4;
                    else j9[f5++] = Y << 5 | D76, ar.setBigUint64(f5, BigInt(A)), f5 += 8;
                    continue
                }
                j9[f5++] = TJ1 << 5 | D76, ar.setFloat64(f5, _), f5 += 8;
                continue
            } else if (typeof _ === "bigint") {
                let z = _ >= 0,
                    Y = z ? JW8 : XW8,
                    A = z ? _ : -_ - BigInt(1),
                    O = Number(A);
                if (O < 24) j9[f5++] = Y << 5 | O;
                else if (O < 256) j9[f5++] = Y << 5 | 24, j9[f5++] = O;
                else if (O < 65536) j9[f5++] = Y << 5 | TO6, j9[f5++] = O >> 8, j9[f5++] = O & 255;
                else if (O < 4294967296) j9[f5++] = Y << 5 | VO6, ar.setUint32(f5, O), f5 += 4;
                else if (A < BigInt("18446744073709551616")) j9[f5++] = Y << 5 | D76, ar.setBigUint64(f5, A), f5 += 8;
                else {
                    let w = A.toString(2),
                        $ = new Uint8Array(Math.ceil(w.length / 8)),
                        j = A,
                        H = 0;
                    while ($.byteLength - ++H >= 0) $[$.byteLength - H] = Number(j & BigInt(255)), j >>= BigInt(8);
                    if (kJ1($.byteLength * 2), j9[f5++] = z ? 194 : 195, zqq) or(vO6, Buffer.byteLength($));
                    else or(vO6, $.byteLength);
                    j9.set($, f5), f5 += $.byteLength
                }
                continue
            } else if (_ === null) {
                j9[f5++] = TJ1 << 5 | jqq;
                continue
            } else if (typeof _ === "boolean") {
                j9[f5++] = TJ1 << 5 | (_ ? NJ1 : $qq);
                continue
            } else if (typeof _ > "u") throw Error("@smithy/core/cbor: client may not serialize undefined value.");
            else if (Array.isArray(_)) {
                for (let z = _.length - 1; z >= 0; --z) K.push(_[z]);
                or(Lc6, _.length);
                continue
            } else if (typeof _.byteLength === "number") {
                kJ1(_.length * 2), or(vO6, _.length), j9.set(_, f5), f5 += _.byteLength;
                continue
            } else if (typeof _ === "object") {
                if (_ instanceof MW8.NumericValue) {
                    let Y = _.string.indexOf("."),
                        A = Y === -1 ? 0 : Y - _.string.length + 1,
                        O = BigInt(_.string.replace(".", ""));
                    j9[f5++] = 196, K.push(O), K.push(A), or(Lc6, 2);
                    continue
                }
                if (_[hJ1])
                    if ("tag" in _ && "value" in _) {
                        K.push(_.value), or(wqq, _.tag);
                        continue
                    } else throw Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(_));
                let z = Object.keys(_);
                for (let Y = z.length - 1; Y >= 0; --Y) {
                    let A = z[Y];
                    K.push(_[A]), K.push(A)
                }
                or(jW8, z.length);
                continue
            }
            throw Error(`data type ${_?.constructor?.name??typeof _} not compatible for encoding.`)
        }
    }
    var PW8 = {
            deserialize(q) {
                return I03(q), tr(0, q.length)
            },
            serialize(q) {
                try {
                    return l03(q), Yqq()
                } catch (K) {
                    throw Yqq(), K
                }
            },
            resizeEncodingBuffer(q) {
                EJ1(q)
            }
        },
        Xqq = (q, K) => {
            return hc6.collectBody(q, K).then(async (_) => {
                if (_.length) try {
                    return PW8.deserialize(_)
                } catch (z) {
                    throw Object.defineProperty(z, "$responseBodyText", {
                        value: K.utf8Encoder(_)
                    }), z
                }
                return {}
            })
        },
        HW8 = (q) => {
            return RJ1({
                tag: 1,
                value: q.getTime() / 1000
            })
        },
        n03 = async (q, K) => {
            let _ = await Xqq(q, K);
            return _.message = _.message ?? _.Message, _
        }, Mqq = (q, K) => {
            let _ = (Y) => {
                let A = Y;
                if (typeof A === "number") A = A.toString();
                if (A.indexOf(",") >= 0) A = A.split(",")[0];
                if (A.indexOf(":") >= 0) A = A.split(":")[0];
                if (A.indexOf("#") >= 0) A = A.split("#")[1];
                return A
            };
            if (K.__type !== void 0) return _(K.__type);
            let z = Object.keys(K).find((Y) => Y.toLowerCase() === "code");
            if (z && K[z] !== void 0) return _(K[z])
        }, i03 = (q) => {
            if (String(q.headers["smithy-protocol"]).toLowerCase() !== "rpc-v2-cbor") throw Error("Malformed RPCv2 CBOR response, status: " + q.statusCode)
        }, r03 = async (q, K, _, z, Y) => {
            let {
                hostname: A,
                protocol: O = "https",
                port: w,
                path: $
            } = await q.endpoint(), j = {
                protocol: O,
                hostname: A,
                port: w,
                method: "POST",
                path: $.endsWith("/") ? $.slice(0, -1) + _ : $ + _,
                headers: {
                    ...K
                }
            };
            if (z !== void 0) j.hostname = z;
            if (Y !== void 0) {
                j.body = Y;
                try {
                    j.headers["content-length"] = String(h03.calculateBodyLength(Y))
                } catch (H) {}
            }
            return new L03.HttpRequest(j)
        };
    class CJ1 extends hc6.SerdeContext {
        createSerializer() {
            let q = new bJ1;
            return q.setSerdeContext(this.serdeContext), q
        }
        createDeserializer() {
            let q = new IJ1;
            return q.setSerdeContext(this.serdeContext), q
        }
    }
    class bJ1 extends hc6.SerdeContext {
        value;
        write(q, K) {
            this.value = this.serialize(q, K)
        }
        serialize(q, K) {
            let _ = vv6.NormalizedSchema.of(q);
            if (K == null) {
                if (_.isIdempotencyToken()) return MW8.generateIdempotencyToken();
                return K
            }
            if (_.isBlobSchema()) {
                if (typeof K === "string") return (this.serdeContext?.base64Decoder ?? Oqq.fromBase64)(K);
                return K
            }
            if (_.isTimestampSchema()) {
                if (typeof K === "number" || typeof K === "bigint") return HW8(new Date(Number(K) / 1000 | 0));
                return HW8(K)
            }
            if (typeof K === "function" || typeof K === "object") {
                let z = K;
                if (_.isListSchema() && Array.isArray(z)) {
                    let A = !!_.getMergedTraits().sparse,
                        O = [],
                        w = 0;
                    for (let $ of z) {
                        let j = this.serialize(_.getValueSchema(), $);
                        if (j != null || A) O[w++] = j
                    }
                    return O
                }
                if (z instanceof Date) return HW8(z);
                let Y = {};
                if (_.isMapSchema()) {
                    let A = !!_.getMergedTraits().sparse;
                    for (let O of Object.keys(z)) {
                        let w = this.serialize(_.getValueSchema(), z[O]);
                        if (w != null || A) Y[O] = w
                    }
                } else if (_.isStructSchema())
                    for (let [A, O] of _.structIterator()) {
                        let w = this.serialize(O, z[A]);
                        if (w != null) Y[A] = w
                    } else if (_.isDocumentSchema())
                        for (let A of Object.keys(z)) Y[A] = this.serialize(_.getValueSchema(), z[A]);
                return Y
            }
            return K
        }
        flush() {
            let q = PW8.serialize(this.value);
            return this.value = void 0, q
        }
    }
    class IJ1 extends hc6.SerdeContext {
        read(q, K) {
            let _ = PW8.deserialize(K);
            return this.readValue(q, _)
        }
        readValue(q, K) {
            let _ = vv6.NormalizedSchema.of(q);
            if (_.isTimestampSchema() && typeof K === "number") return MW8._parseEpochTimestamp(K);
            if (_.isBlobSchema()) {
                if (typeof K === "string") return (this.serdeContext?.base64Decoder ?? Oqq.fromBase64)(K);
                return K
            }
            if (typeof K > "u" || typeof K === "boolean" || typeof K === "number" || typeof K === "string" || typeof K === "bigint" || typeof K === "symbol") return K;
            else if (typeof K === "function" || typeof K === "object") {
                if (K === null) return null;
                if ("byteLength" in K) return K;
                if (K instanceof Date) return K;
                if (_.isDocumentSchema()) return K;
                if (_.isListSchema()) {
                    let Y = [],
                        A = _.getValueSchema(),
                        O = !!_.getMergedTraits().sparse;
                    for (let w of K) {
                        let $ = this.readValue(A, w);
                        if ($ != null || O) Y.push($)
                    }
                    return Y
                }
                let z = {};
                if (_.isMapSchema()) {
                    let Y = !!_.getMergedTraits().sparse,
                        A = _.getValueSchema();
                    for (let O of Object.keys(K)) {
                        let w = this.readValue(A, K[O]);
                        if (w != null || Y) z[O] = w
                    }
                } else if (_.isStructSchema())
                    for (let [Y, A] of _.structIterator()) {
                        let O = this.readValue(A, K[Y]);
                        if (O != null) z[Y] = O
                    }
                return z
            } else return K
        }
    }
    class Pqq extends hc6.RpcProtocol {
        codec = new CJ1;
        serializer = this.codec.createSerializer();
        deserializer = this.codec.createDeserializer();
        constructor({
            defaultNamespace: q
        }) {
            super({
                defaultNamespace: q
            })
        }
        getShapeId() {
            return "smithy.protocols#rpcv2Cbor"
        }
        getPayloadCodec() {
            return this.codec
        }
        async serializeRequest(q, K, _) {
            let z = await super.serializeRequest(q, K, _);
            if (Object.assign(z.headers, {
                    "content-type": this.getDefaultContentType(),
                    "smithy-protocol": "rpc-v2-cbor",
                    accept: this.getDefaultContentType()
                }), vv6.deref(q.input) === "unit") delete z.body, delete z.headers["content-type"];
            else {
                if (!z.body) this.serializer.write(15, {}), z.body = this.serializer.flush();
                try {
                    z.headers["content-length"] = String(z.body.byteLength)
                } catch (w) {}
            }
            let {
                service: Y,
                operation: A
            } = R03.getSmithyContext(_), O = `/service/${Y}/operation/${A}`;
            if (z.path.endsWith("/")) z.path += O.slice(1);
            else z.path += O;
            return z
        }
        async deserializeResponse(q, K, _) {
            return super.deserializeResponse(q, K, _)
        }
        async handleError(q, K, _, z, Y) {
            let A = Mqq(_, z) ?? "Unknown",
                O = this.options.defaultNamespace;
            if (A.includes("#"))[O] = A.split("#");
            let w = {
                    $metadata: Y,
                    $fault: _.statusCode <= 500 ? "client" : "server"
                },
                $ = vv6.TypeRegistry.for(O),
                j;
            try {
                j = $.getSchema(A)
            } catch (W) {
                if (z.Message) z.message = z.Message;
                let D = vv6.TypeRegistry.for("smithy.ts.sdk.synthetic." + O),
                    Z = D.getBaseException();
                if (Z) {
                    let G = D.getErrorCtor(Z);
                    throw Object.assign(new G({
                        name: A
                    }), w, z)
                }
                throw Object.assign(Error(A), w, z)
            }
            let H = vv6.NormalizedSchema.of(j),
                J = $.getErrorCtor(j),
                X = z.message ?? z.Message ?? "Unknown",
                M = new J(X),
                P = {};
            for (let [W, D] of H.structIterator()) P[W] = this.deserializer.readValue(D, z[W]);
            throw Object.assign(M, w, {
                $fault: H.getMergedTraits().error,
                message: X
            }, P)
        }
        getDefaultContentType() {
            return "application/cbor"
        }
    }
    o03.CborCodec = CJ1;
    o03.CborShapeDeserializer = IJ1;
    o03.CborShapeSerializer = bJ1;
    o03.SmithyRpcV2CborProtocol = Pqq;
    o03.buildHttpRpcRequest = r03;
    o03.cbor = PW8;
    o03.checkCborResponse = i03;
    o03.dateToTag = HW8;
    o03.loadSmithyRpcV2CborErrorCode = Mqq;
    o03.parseCborBody = Xqq;
    o03.parseCborErrorBody = n03;
    o03.tag = RJ1;
    o03.tagSymbol = hJ1
})