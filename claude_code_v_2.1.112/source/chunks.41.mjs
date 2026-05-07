
// @from(Ln 100117, Col 4)
sHq = p((oHq) => {
    Object.defineProperty(oHq, "__esModule", {
        value: !0
    });
    oHq.ruleSet = void 0;
    var nHq = "required",
        zQ = "fn",
        YQ = "argv",
        HT6 = "ref",
        mHq = !0,
        BHq = "isSet",
        xl6 = "booleanEquals",
        jT6 = "error",
        Il6 = "endpoint",
        pV = "tree",
        mZ1 = "PartitionResult",
        pHq = {
            [nHq]: !1,
            type: "string"
        },
        FHq = {
            [nHq]: !0,
            default: !1,
            type: "boolean"
        },
        gHq = {
            [HT6]: "Endpoint"
        },
        iHq = {
            [zQ]: xl6,
            [YQ]: [{
                [HT6]: "UseFIPS"
            }, !0]
        },
        rHq = {
            [zQ]: xl6,
            [YQ]: [{
                [HT6]: "UseDualStack"
            }, !0]
        },
        _Q = {},
        UHq = {
            [zQ]: "getAttr",
            [YQ]: [{
                [HT6]: mZ1
            }, "supportsFIPS"]
        },
        QHq = {
            [zQ]: xl6,
            [YQ]: [!0, {
                [zQ]: "getAttr",
                [YQ]: [{
                    [HT6]: mZ1
                }, "supportsDualStack"]
            }]
        },
        dHq = [iHq],
        cHq = [rHq],
        lHq = [{
            [HT6]: "Region"
        }],
        uP9 = {
            version: "1.0",
            parameters: {
                Region: pHq,
                UseDualStack: FHq,
                UseFIPS: FHq,
                Endpoint: pHq
            },
            rules: [{
                conditions: [{
                    [zQ]: BHq,
                    [YQ]: [gHq]
                }],
                rules: [{
                    conditions: dHq,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: jT6
                }, {
                    rules: [{
                        conditions: cHq,
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: jT6
                    }, {
                        endpoint: {
                            url: gHq,
                            properties: _Q,
                            headers: _Q
                        },
                        type: Il6
                    }],
                    type: pV
                }],
                type: pV
            }, {
                rules: [{
                    conditions: [{
                        [zQ]: BHq,
                        [YQ]: lHq
                    }],
                    rules: [{
                        conditions: [{
                            [zQ]: "aws.partition",
                            [YQ]: lHq,
                            assign: mZ1
                        }],
                        rules: [{
                            conditions: [iHq, rHq],
                            rules: [{
                                conditions: [{
                                    [zQ]: xl6,
                                    [YQ]: [mHq, UHq]
                                }, QHq],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: _Q,
                                            headers: _Q
                                        },
                                        type: Il6
                                    }],
                                    type: pV
                                }],
                                type: pV
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: jT6
                            }],
                            type: pV
                        }, {
                            conditions: dHq,
                            rules: [{
                                conditions: [{
                                    [zQ]: xl6,
                                    [YQ]: [UHq, mHq]
                                }],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime-fips.{Region}.{PartitionResult#dnsSuffix}",
                                            properties: _Q,
                                            headers: _Q
                                        },
                                        type: Il6
                                    }],
                                    type: pV
                                }],
                                type: pV
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: jT6
                            }],
                            type: pV
                        }, {
                            conditions: cHq,
                            rules: [{
                                conditions: [QHq],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-runtime.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: _Q,
                                            headers: _Q
                                        },
                                        type: Il6
                                    }],
                                    type: pV
                                }],
                                type: pV
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: jT6
                            }],
                            type: pV
                        }, {
                            rules: [{
                                endpoint: {
                                    url: "https://bedrock-runtime.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: _Q,
                                    headers: _Q
                                },
                                type: Il6
                            }],
                            type: pV
                        }],
                        type: pV
                    }],
                    type: pV
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: jT6
                }],
                type: pV
            }]
        };
    oHq.ruleSet = uP9
})
// @from(Ln 100315, Col 4)
qJq = p((tHq) => {
    Object.defineProperty(tHq, "__esModule", {
        value: !0
    });
    tHq.defaultEndpointResolver = void 0;
    var mP9 = QU(),
        BZ1 = dm(),
        BP9 = sHq(),
        pP9 = new BZ1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        FP9 = (q, K = {}) => {
            return pP9.get(q, () => (0, BZ1.resolveEndpoint)(BP9.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    tHq.defaultEndpointResolver = FP9;
    BZ1.customEndpointFunctions.aws = mP9.awsEndpointFunctions
})
// @from(Ln 100336, Col 4)
AJq = p((zJq) => {
    Object.defineProperty(zJq, "__esModule", {
        value: !0
    });
    zJq.getRuntimeConfig = void 0;
    var gP9 = k$(),
        UP9 = Ao(),
        QP9 = FO(),
        dP9 = Sl6(),
        cP9 = jb(),
        KJq = uHq(),
        _Jq = nw(),
        lP9 = CZ1(),
        nP9 = qJq(),
        iP9 = (q) => {
            return {
                apiVersion: "2023-09-30",
                base64Decoder: q?.base64Decoder ?? KJq.fromBase64,
                base64Encoder: q?.base64Encoder ?? KJq.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? nP9.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? lP9.defaultBedrockRuntimeHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new gP9.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#httpBearerAuth"),
                    signer: new QP9.HttpBearerAuthSigner
                }],
                logger: q?.logger ?? new dP9.NoOpLogger,
                protocol: q?.protocol ?? new UP9.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.bedrockruntime"
                }),
                serviceId: q?.serviceId ?? "Bedrock Runtime",
                urlParser: q?.urlParser ?? cP9.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? _Jq.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? _Jq.toUtf8
            }
        };
    zJq.getRuntimeConfig = iP9
})
// @from(Ln 100380, Col 4)
XJq = p((HJq) => {
    Object.defineProperty(HJq, "__esModule", {
        value: !0
    });
    HJq.getRuntimeConfig = void 0;
    var rP9 = IV(),
        oP9 = rP9.__importDefault(vHq()),
        pZ1 = k$(),
        aP9 = uO6(),
        sP9 = kHq(),
        OJq = xW8(),
        wJq = Ko(),
        vD8 = KM(),
        tP9 = FO(),
        eP9 = EHq(),
        qW9 = _o(),
        $Jq = rZ(),
        nO6 = jE(),
        jJq = wE(),
        KW9 = zo(),
        _W9 = lU(),
        zW9 = AJq(),
        YW9 = Sl6(),
        AW9 = wo(),
        OW9 = Sl6(),
        wW9 = (q) => {
            (0, OW9.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, AW9.resolveDefaultsModeConfig)(q),
                _ = () => K().then(YW9.loadConfigsForDefaultMode),
                z = (0, zW9.getRuntimeConfig)(q);
            (0, pZ1.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger,
                signingName: "bedrock"
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, nO6.loadConfig)(pZ1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? KW9.calculateBodyLength,
                credentialDefaultProvider: q?.credentialDefaultProvider ?? aP9.defaultProvider,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, wJq.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: oP9.default.version
                }),
                eventStreamPayloadHandlerProvider: q?.eventStreamPayloadHandlerProvider ?? sP9.eventStreamPayloadHandlerProvider,
                eventStreamSerdeProvider: q?.eventStreamSerdeProvider ?? eP9.eventStreamSerdeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (A) => A.getIdentityProvider("aws.auth#sigv4"),
                    signer: new pZ1.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (A) => A.getIdentityProvider("smithy.api#httpBearerAuth") || (async (O) => {
                        try {
                            return await (0, OJq.fromEnvSigningName)({
                                signingName: "bedrock"
                            })()
                        } catch (w) {
                            return await (0, OJq.nodeProvider)(O)(O)
                        }
                    }),
                    signer: new tP9.HttpBearerAuthSigner
                }],
                maxAttempts: q?.maxAttempts ?? (0, nO6.loadConfig)($Jq.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, nO6.loadConfig)(vD8.NODE_REGION_CONFIG_OPTIONS, {
                    ...vD8.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: jJq.NodeHttp2Handler.create(q?.requestHandler ?? (async () => ({
                    ...await _(),
                    disableConcurrentStreams: !0
                }))),
                retryMode: q?.retryMode ?? (0, nO6.loadConfig)({
                    ...$Jq.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || _W9.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? qW9.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? jJq.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, nO6.loadConfig)(vD8.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, nO6.loadConfig)(vD8.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, nO6.loadConfig)(wJq.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    HJq.getRuntimeConfig = wW9
})
// @from(Ln 100469, Col 4)
DJq = p((MW9) => {
    var $W9 = VZ1(),
        jW9 = (q) => {
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
        HW9 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class MJq {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = $W9.FieldPosition.HEADER,
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
    class PJq {
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
    class TD8 {
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
            let K = new TD8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = JW9(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return TD8.clone(this)
        }
    }

    function JW9(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class WJq {
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

    function XW9(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    MW9.Field = MJq;
    MW9.Fields = PJq;
    MW9.HttpRequest = TD8;
    MW9.HttpResponse = WJq;
    MW9.getHttpHandlerExtensionConfiguration = jW9;
    MW9.isValidHostname = XW9;
    MW9.resolveHttpHandlerRuntimeConfig = HW9
})
// @from(Ln 100611, Col 4)
aD8 = p((Lf1) => {
    var SJq = qjq(),
        ZJq = nr(),
        TW9 = ir(),
        VW9 = rr(),
        fJq = cU(),
        CJq = YHq(),
        kW9 = KM(),
        VD8 = FO(),
        GE = sj(),
        NW9 = AHq(),
        EW9 = qo(),
        qB = cm(),
        GJq = rZ(),
        eZ = Sl6(),
        vJq = CZ1(),
        yW9 = XJq(),
        TJq = lm(),
        VJq = DJq(),
        LW9 = (q) => {
            return Object.assign(q, {
                useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
                useFipsEndpoint: q.useFipsEndpoint ?? !1,
                defaultSigningName: "bedrock"
            })
        },
        AQ = {
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
        },
        hW9 = (q) => {
            let {
                httpAuthSchemes: K,
                httpAuthSchemeProvider: _,
                credentials: z,
                token: Y
            } = q;
            return {
                setHttpAuthScheme(A) {
                    let O = K.findIndex((w) => w.schemeId === A.schemeId);
                    if (O === -1) K.push(A);
                    else K.splice(O, 1, A)
                },
                httpAuthSchemes() {
                    return K
                },
                setHttpAuthSchemeProvider(A) {
                    _ = A
                },
                httpAuthSchemeProvider() {
                    return _
                },
                setCredentials(A) {
                    z = A
                },
                credentials() {
                    return z
                },
                setToken(A) {
                    Y = A
                },
                token() {
                    return Y
                }
            }
        },
        RW9 = (q) => {
            return {
                httpAuthSchemes: q.httpAuthSchemes(),
                httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
                credentials: q.credentials(),
                token: q.token()
            }
        },
        SW9 = (q, K) => {
            let _ = Object.assign(TJq.getAwsRegionExtensionConfiguration(q), eZ.getDefaultExtensionConfiguration(q), VJq.getHttpHandlerExtensionConfiguration(q), hW9(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, TJq.resolveAwsRegionExtensionConfiguration(_), eZ.resolveDefaultRuntimeConfig(_), VJq.resolveHttpHandlerRuntimeConfig(_), RW9(_))
        };
    class ND8 extends eZ.Client {
        config;
        constructor(...[q]) {
            let K = yW9.getRuntimeConfig(q || {});
            super(K);
            this.initConfig = K;
            let _ = LW9(K),
                z = fJq.resolveUserAgentConfig(_),
                Y = GJq.resolveRetryConfig(z),
                A = kW9.resolveRegionConfig(Y),
                O = ZJq.resolveHostHeaderConfig(A),
                w = qB.resolveEndpointConfig(O),
                $ = NW9.resolveEventStreamSerdeConfig(w),
                j = vJq.resolveHttpAuthSchemeConfig($),
                H = SJq.resolveEventStreamConfig(j),
                J = CJq.resolveWebSocketConfig(H),
                X = SW9(J, q?.extensions || []);
            this.config = X, this.middlewareStack.use(GE.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(fJq.getUserAgentPlugin(this.config)), this.middlewareStack.use(GJq.getRetryPlugin(this.config)), this.middlewareStack.use(EW9.getContentLengthPlugin(this.config)), this.middlewareStack.use(ZJq.getHostHeaderPlugin(this.config)), this.middlewareStack.use(TW9.getLoggerPlugin(this.config)), this.middlewareStack.use(VW9.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(VD8.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: vJq.defaultBedrockRuntimeHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (M) => new VD8.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": M.credentials,
                    "smithy.api#httpBearerAuth": M.token
                })
            })), this.middlewareStack.use(VD8.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var vE = class q extends eZ.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        bJq = class q extends vE {
            name = "AccessDeniedException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "AccessDeniedException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        IJq = class q extends vE {
            name = "InternalServerException";
            $fault = "server";
            constructor(K) {
                super({
                    name: "InternalServerException",
                    $fault: "server",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        xJq = class q extends vE {
            name = "ThrottlingException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ThrottlingException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        uJq = class q extends vE {
            name = "ValidationException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ValidationException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        mJq = class q extends vE {
            name = "ConflictException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ConflictException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        BJq = class q extends vE {
            name = "ResourceNotFoundException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ResourceNotFoundException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        pJq = class q extends vE {
            name = "ServiceQuotaExceededException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ServiceQuotaExceededException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        FJq = class q extends vE {
            name = "ServiceUnavailableException";
            $fault = "server";
            constructor(K) {
                super({
                    name: "ServiceUnavailableException",
                    $fault: "server",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        gJq = class q extends vE {
            name = "ModelErrorException";
            $fault = "client";
            originalStatusCode;
            resourceName;
            constructor(K) {
                super({
                    name: "ModelErrorException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.originalStatusCode = K.originalStatusCode, this.resourceName = K.resourceName
            }
        },
        UJq = class q extends vE {
            name = "ModelNotReadyException";
            $fault = "client";
            $retryable = {};
            constructor(K) {
                super({
                    name: "ModelNotReadyException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        QJq = class q extends vE {
            name = "ModelTimeoutException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ModelTimeoutException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        dJq = class q extends vE {
            name = "ModelStreamErrorException";
            $fault = "client";
            originalStatusCode;
            originalMessage;
            constructor(K) {
                super({
                    name: "ModelStreamErrorException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.originalStatusCode = K.originalStatusCode, this.originalMessage = K.originalMessage
            }
        },
        CW9 = "Accept",
        bW9 = "AccessDeniedException",
        IW9 = "ApplyGuardrail",
        xW9 = "ApplyGuardrailRequest",
        uW9 = "ApplyGuardrailResponse",
        mW9 = "AsyncInvokeMessage",
        BW9 = "AsyncInvokeOutputDataConfig",
        pW9 = "AsyncInvokeSummary",
        FW9 = "AsyncInvokeS3OutputDataConfig",
        gW9 = "AsyncInvokeSummaries",
        UW9 = "AnyToolChoice",
        QW9 = "AutoToolChoice",
        dW9 = "Body",
        cW9 = "BidirectionalInputPayloadPart",
        lW9 = "BidirectionalOutputPayloadPart",
        nW9 = "Citation",
        iW9 = "ContentBlocks",
        rW9 = "ContentBlockDelta",
        oW9 = "ContentBlockDeltaEvent",
        aW9 = "ContentBlockStart",
        sW9 = "ContentBlockStartEvent",
        tW9 = "ContentBlockStopEvent",
        eW9 = "ContentBlock",
        q09 = "CitationsConfig",
        K09 = "CitationsContentBlock",
        _09 = "CitationsDelta",
        z09 = "ConflictException",
        Y09 = "CitationGeneratedContent",
        A09 = "CitationGeneratedContentList",
        O09 = "CitationLocation",
        w09 = "ConverseMetrics",
        $09 = "ConverseOutput",
        j09 = "CachePointBlock",
        H09 = "ConverseRequest",
        J09 = "ConverseResponse",
        X09 = "ConverseStream",
        M09 = "CitationSourceContent",
        P09 = "CitationSourceContentDelta",
        W09 = "CitationSourceContentList",
        D09 = "CitationSourceContentListDelta",
        Z09 = "ConverseStreamMetrics",
        f09 = "ConverseStreamMetadataEvent",
        G09 = "ConverseStreamOutput",
        v09 = "ConverseStreamRequest",
        T09 = "ConverseStreamResponse",
        V09 = "ConverseStreamTrace",
        k09 = "ConverseTrace",
        N09 = "CountTokensInput",
        E09 = "ConverseTokensRequest",
        y09 = "CountTokensRequest",
        L09 = "CountTokensResponse",
        gZ1 = "Content-Type",
        h09 = "CountTokens",
        R09 = "Citations",
        S09 = "Converse",
        C09 = "DocumentBlock",
        b09 = "DocumentContentBlocks",
        I09 = "DocumentContentBlock",
        x09 = "DocumentCharLocation",
        u09 = "DocumentChunkLocation",
        m09 = "DocumentPageLocation",
        B09 = "DocumentSource",
        p09 = "GuardrailAssessment",
        F09 = "GetAsyncInvoke",
        g09 = "GetAsyncInvokeRequest",
        U09 = "GetAsyncInvokeResponse",
        Q09 = "GuardrailAssessmentList",
        d09 = "GuardrailAssessmentListMap",
        c09 = "GuardrailAssessmentMap",
        l09 = "GuardrailAutomatedReasoningDifferenceScenarioList",
        n09 = "GuardrailAutomatedReasoningFinding",
        i09 = "GuardrailAutomatedReasoningFindingList",
        r09 = "GuardrailAutomatedReasoningImpossibleFinding",
        o09 = "GuardrailAutomatedReasoningInvalidFinding",
        a09 = "GuardrailAutomatedReasoningInputTextReference",
        s09 = "GuardrailAutomatedReasoningInputTextReferenceList",
        t09 = "GuardrailAutomatedReasoningLogicWarning",
        e09 = "GuardrailAutomatedReasoningNoTranslationsFinding",
        qD9 = "GuardrailAutomatedReasoningPolicyAssessment",
        KD9 = "GuardrailAutomatedReasoningRule",
        _D9 = "GuardrailAutomatedReasoningRuleList",
        zD9 = "GuardrailAutomatedReasoningScenario",
        YD9 = "GuardrailAutomatedReasoningSatisfiableFinding",
        AD9 = "GuardrailAutomatedReasoningStatementList",
        OD9 = "GuardrailAutomatedReasoningStatementLogicContent",
        wD9 = "GuardrailAutomatedReasoningStatementNaturalLanguageContent",
        $D9 = "GuardrailAutomatedReasoningStatement",
        jD9 = "GuardrailAutomatedReasoningTranslation",
        HD9 = "GuardrailAutomatedReasoningTranslationAmbiguousFinding",
        JD9 = "GuardrailAutomatedReasoningTooComplexFinding",
        XD9 = "GuardrailAutomatedReasoningTranslationList",
        MD9 = "GuardrailAutomatedReasoningTranslationOption",
        PD9 = "GuardrailAutomatedReasoningTranslationOptionList",
        WD9 = "GuardrailAutomatedReasoningValidFinding",
        DD9 = "GuardrailConfiguration",
        ZD9 = "GuardrailContentBlock",
        fD9 = "GuardrailContentBlockList",
        GD9 = "GuardrailConverseContentBlock",
        vD9 = "GuardrailContentFilter",
        TD9 = "GuardrailContentFilterList",
        VD9 = "GuardrailContextualGroundingFilter",
        kD9 = "GuardrailContextualGroundingFilters",
        ND9 = "GuardrailContextualGroundingPolicyAssessment",
        ED9 = "GuardrailConverseImageBlock",
        yD9 = "GuardrailConverseImageSource",
        LD9 = "GuardrailContentPolicyAssessment",
        hD9 = "GuardrailConverseTextBlock",
        RD9 = "GuardrailCustomWord",
        SD9 = "GuardrailCustomWordList",
        CD9 = "GuardrailCoverage",
        bD9 = "GuardrailImageBlock",
        ID9 = "GuardrailImageCoverage",
        xD9 = "GuardrailInvocationMetrics",
        uD9 = "GuardrailImageSource",
        mD9 = "GuardrailManagedWord",
        BD9 = "GuardrailManagedWordList",
        pD9 = "GuardrailOutputContent",
        FD9 = "GuardrailOutputContentList",
        gD9 = "GuardrailPiiEntityFilter",
        UD9 = "GuardrailPiiEntityFilterList",
        QD9 = "GuardrailRegexFilter",
        dD9 = "GuardrailRegexFilterList",
        cD9 = "GuardrailStreamConfiguration",
        lD9 = "GuardrailSensitiveInformationPolicyAssessment",
        nD9 = "GuardrailTopic",
        iD9 = "GuardrailTraceAssessment",
        rD9 = "GuardrailTextBlock",
        oD9 = "GuardrailTextCharactersCoverage",
        aD9 = "GuardrailTopicList",
        sD9 = "GuardrailTopicPolicyAssessment",
        tD9 = "GuardrailUsage",
        eD9 = "GuardrailWordPolicyAssessment",
        qZ9 = "ImageBlock",
        KZ9 = "InferenceConfiguration",
        _Z9 = "InvokeModel",
        zZ9 = "InvokeModelRequest",
        YZ9 = "InvokeModelResponse",
        AZ9 = "InvokeModelTokensRequest",
        OZ9 = "InvokeModelWithBidirectionalStream",
        wZ9 = "InvokeModelWithBidirectionalStreamInput",
        $Z9 = "InvokeModelWithBidirectionalStreamOutput",
        jZ9 = "InvokeModelWithBidirectionalStreamRequest",
        HZ9 = "InvokeModelWithBidirectionalStreamResponse",
        JZ9 = "InvokeModelWithResponseStream",
        XZ9 = "InvokeModelWithResponseStreamRequest",
        MZ9 = "InvokeModelWithResponseStreamResponse",
        PZ9 = "ImageSource",
        WZ9 = "InternalServerException",
        DZ9 = "ListAsyncInvokes",
        ZZ9 = "ListAsyncInvokesRequest",
        fZ9 = "ListAsyncInvokesResponse",
        GZ9 = "Message",
        vZ9 = "ModelErrorException",
        TZ9 = "ModelInputPayload",
        VZ9 = "ModelNotReadyException",
        kZ9 = "MessageStartEvent",
        NZ9 = "ModelStreamErrorException",
        EZ9 = "MessageStopEvent",
        yZ9 = "ModelTimeoutException",
        LZ9 = "Messages",
        hZ9 = "PartBody",
        RZ9 = "PerformanceConfiguration",
        SZ9 = "PayloadPart",
        CZ9 = "PromptRouterTrace",
        bZ9 = "PromptVariableMap",
        IZ9 = "PromptVariableValues",
        xZ9 = "ReasoningContentBlock",
        uZ9 = "ReasoningContentBlockDelta",
        mZ9 = "RequestMetadata",
        BZ9 = "ResourceNotFoundException",
        pZ9 = "ResponseStream",
        FZ9 = "ReasoningTextBlock",
        gZ9 = "StartAsyncInvoke",
        UZ9 = "StartAsyncInvokeRequest",
        QZ9 = "StartAsyncInvokeResponse",
        dZ9 = "SystemContentBlocks",
        cZ9 = "SystemContentBlock",
        lZ9 = "S3Location",
        nZ9 = "ServiceQuotaExceededException",
        iZ9 = "SearchResultBlock",
        rZ9 = "SearchResultContentBlock",
        oZ9 = "SearchResultContentBlocks",
        aZ9 = "SearchResultLocation",
        sZ9 = "ServiceTier",
        tZ9 = "SpecificToolChoice",
        eZ9 = "SystemTool",
        qf9 = "ServiceUnavailableException",
        Kf9 = "Tag",
        _f9 = "ToolConfiguration",
        zf9 = "ToolChoice",
        Yf9 = "ThrottlingException",
        Af9 = "ToolInputSchema",
        Of9 = "TagList",
        wf9 = "ToolResultBlock",
        $f9 = "ToolResultBlocksDelta",
        jf9 = "ToolResultBlockDelta",
        Hf9 = "ToolResultBlockStart",
        Jf9 = "ToolResultContentBlocks",
        Xf9 = "ToolResultContentBlock",
        Mf9 = "ToolSpecification",
        Pf9 = "TokenUsage",
        Wf9 = "ToolUseBlock",
        Df9 = "ToolUseBlockDelta",
        Zf9 = "ToolUseBlockStart",
        ff9 = "Tools",
        Gf9 = "Tool",
        vf9 = "VideoBlock",
        Tf9 = "ValidationException",
        Vf9 = "VideoSource",
        kf9 = "WebLocation",
        Nf9 = "X-Amzn-Bedrock-Accept",
        Ef9 = "X-Amzn-Bedrock-Content-Type",
        cJq = "X-Amzn-Bedrock-GuardrailIdentifier",
        lJq = "X-Amzn-Bedrock-GuardrailVersion",
        ED8 = "X-Amzn-Bedrock-PerformanceConfig-Latency",
        yD8 = "X-Amzn-Bedrock-Service-Tier",
        nJq = "X-Amzn-Bedrock-Trace",
        U76 = "action",
        yf9 = "asyncInvokeSummaries",
        UZ1 = "additionalModelRequestFields",
        iJq = "additionalModelResponseFieldPaths",
        rJq = "additionalModelResponseFields",
        oJq = "actionReason",
        Lf9 = "automatedReasoningPolicy",
        hf9 = "automatedReasoningPolicyUnits",
        Rf9 = "automatedReasoningPolicies",
        aJq = "accept",
        Sf9 = "any",
        Cf9 = "assessments",
        bf9 = "auto",
        Q76 = "bytes",
        sJq = "bucketOwner",
        rO6 = "body",
        OQ = "client",
        If9 = "contentBlockDelta",
        QZ1 = "contentBlockIndex",
        xf9 = "contentBlockStart",
        uf9 = "contentBlockStop",
        mf9 = "citationsContent",
        Bf9 = "claimsFalseScenario",
        pf9 = "contextualGroundingPolicy",
        Ff9 = "contextualGroundingPolicyUnits",
        gf9 = "contentPolicy",
        Uf9 = "contentPolicyImageUnits",
        Qf9 = "contentPolicyUnits",
        dZ1 = "cachePoint",
        tJq = "contradictingRules",
        df9 = "cacheReadInputTokens",
        cZ1 = "clientRequestToken",
        LD8 = "contentType",
        eJq = "claimsTrueScenario",
        cf9 = "customWords",
        lf9 = "cacheWriteInputTokens",
        lZ1 = "chunk",
        nZ1 = "citations",
        nf9 = "citation",
        qXq = "claims",
        JT6 = "content",
        if9 = "context",
        KXq = "confidence",
        rf9 = "converse",
        of9 = "delta",
        af9 = "documentChar",
        sf9 = "documentChunk",
        iZ1 = "documentIndex",
        tf9 = "documentPage",
        ef9 = "differenceScenarios",
        oO6 = "detected",
        qG9 = "description",
        KG9 = "domain",
        _Xq = "document",
        Rb = "error",
        zXq = "endTime",
        _G9 = "enabled",
        hD8 = "end",
        ml6 = "format",
        YXq = "failureMessage",
        zG9 = "filterStrength",
        YG9 = "findings",
        AXq = "filters",
        OXq = "guardrail",
        wXq = "guardrailCoverage",
        $Xq = "guardrailConfig",
        jXq = "guardContent",
        Bl6 = "guardrailIdentifier",
        AG9 = "guardrailProcessingLatency",
        pl6 = "guardrailVersion",
        HXq = "guarded",
        wQ = "http",
        Sb = "httpError",
        MP = "httpHeader",
        iO6 = "httpQuery",
        rZ1 = "input",
        RD8 = "invocationArn",
        OG9 = "inputAssessment",
        JXq = "inferenceConfig",
        wG9 = "invocationMetrics",
        $G9 = "invokedModelId",
        jG9 = "invokeModel",
        HG9 = "inputSchema",
        oZ1 = "internalServerException",
        XXq = "inputTokens",
        JG9 = "identifier",
        XG9 = "images",
        SD8 = "image",
        MG9 = "impossible",
        PG9 = "invalid",
        MXq = "json",
        WG9 = "key",
        DG9 = "kmsKeyId",
        PXq = "location",
        WXq = "latencyMs",
        DXq = "lastModifiedTime",
        CD8 = "logicWarning",
        ZG9 = "latency",
        fG9 = "logic",
        ph = "message",
        ZXq = "modelArn",
        aO6 = "modelId",
        GG9 = "modelInput",
        vG9 = "modelOutput",
        kJq = "maxResults",
        TG9 = "messageStart",
        aZ1 = "modelStreamErrorException",
        VG9 = "messageStop",
        kG9 = "maxTokens",
        fXq = "modelTimeoutException",
        NG9 = "managedWordLists",
        bD8 = "match",
        sZ1 = "messages",
        GXq = "metrics",
        EG9 = "metadata",
        d76 = "name",
        yG9 = "naturalLanguage",
        FZ1 = "nextToken",
        LG9 = "noTranslations",
        hG9 = "outputs",
        RG9 = "outputAssessments",
        tZ1 = "outputDataConfig",
        SG9 = "originalMessage",
        CG9 = "outputScope",
        vXq = "originalStatusCode",
        bG9 = "outputTokens",
        IG9 = "options",
        xG9 = "output",
        TXq = "premises",
        ID8 = "performanceConfig",
        xD8 = "performanceConfigLatency",
        uG9 = "piiEntities",
        VXq = "promptRouter",
        kXq = "promptVariables",
        mG9 = "policyVersionArn",
        NXq = "qualifiers",
        BG9 = "regex",
        EXq = "reasoningContent",
        yXq = "redactedContent",
        LXq = "requestMetadata",
        pG9 = "resourceName",
        FG9 = "reasoningText",
        gG9 = "regexes",
        hXq = "role",
        Wo = "source",
        NJq = "sortBy",
        RXq = "sourceContent",
        EJq = "statusEquals",
        UG9 = "sensitiveInformationPolicy",
        QG9 = "sensitiveInformationPolicyFreeUnits",
        dG9 = "sensitiveInformationPolicyUnits",
        eZ1 = "s3Location",
        yJq = "sortOrder",
        cG9 = "s3OutputDataConfig",
        lG9 = "streamProcessingMode",
        SXq = "stopReason",
        nG9 = "searchResultIndex",
        iG9 = "searchResultLocation",
        CXq = "searchResult",
        rG9 = "supportingRules",
        oG9 = "stopSequences",
        bXq = "submitTime",
        LJq = "submitTimeAfter",
        hJq = "submitTimeBefore",
        c76 = "serviceTier",
        aG9 = "systemTool",
        sG9 = "s3Uri",
        qf1 = "serviceUnavailableException",
        tG9 = "satisfiable",
        eG9 = "score",
        IXq = "server",
        xXq = "signature",
        uXq = "smithy.ts.sdk.synthetic.com.amazonaws.bedrockruntime",
        uD8 = "status",
        Fl6 = "start",
        qv9 = "statements",
        Kv9 = "stream",
        mD8 = "streaming",
        Kf1 = "system",
        Cb = "type",
        _v9 = "translationAmbiguous",
        _f1 = "toolConfig",
        zv9 = "textCharacters",
        Yv9 = "toolChoice",
        Av9 = "tooComplex",
        zf1 = "throttlingException",
        Ov9 = "topicPolicy",
        wv9 = "topicPolicyUnits",
        $v9 = "topP",
        Yf1 = "toolResult",
        jv9 = "toolSpec",
        Hv9 = "totalTokens",
        Af1 = "toolUse",
        BD8 = "toolUseId",
        Jv9 = "tags",
        PP = "text",
        Xv9 = "temperature",
        Mv9 = "threshold",
        Of1 = "title",
        mXq = "total",
        Pv9 = "tools",
        Wv9 = "tool",
        Dv9 = "topics",
        XT6 = "trace",
        pD8 = "translation",
        Zv9 = "translations",
        FD8 = "usage",
        fv9 = "untranslatedClaims",
        Gv9 = "untranslatedPremises",
        vv9 = "uri",
        Tv9 = "url",
        Vv9 = "value",
        wf1 = "validationException",
        kv9 = "valid",
        BXq = "video",
        Nv9 = "web",
        Ev9 = "wordPolicy",
        yv9 = "wordPolicyUnits",
        K1 = "com.amazonaws.bedrockruntime",
        pXq = [0, K1, mW9, 8, 0],
        gD8 = [0, K1, dW9, 8, 21],
        Lv9 = [0, K1, OD9, 8, 0],
        FXq = [0, K1, wD9, 8, 0],
        hv9 = [0, K1, TZ9, 8, 15],
        $f1 = [0, K1, hZ9, 8, 21],
        Rv9 = [-3, K1, bW9, {
                [Rb]: OQ,
                [Sb]: 403
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(Rv9, bJq);
    var Sv9 = [3, K1, UW9, 0, [],
            []
        ],
        Cv9 = [3, K1, xW9, 0, [Bl6, pl6, Wo, JT6, CG9],
            [
                [0, 1],
                [0, 1], 0, [() => bV9, 0], 0
            ]
        ],
        bv9 = [3, K1, uW9, 0, [FD8, U76, oJq, hG9, Cf9, wXq],
            [() => lXq, 0, 0, () => BV9, [() => eXq, 0], () => dXq]
        ],
        Iv9 = [3, K1, FW9, 0, [sG9, DG9, sJq],
            [0, 0, 0]
        ],
        xv9 = [3, K1, pW9, 0, [RD8, ZXq, cZ1, uD8, YXq, bXq, DXq, zXq, tZ1],
            [0, 0, 0, 0, [() => pXq, 0], 5, 5, 5, () => Df1]
        ],
        uv9 = [3, K1, QW9, 0, [],
            []
        ],
        mv9 = [3, K1, cW9, 8, [Q76],
            [
                [() => $f1, 0]
            ]
        ],
        Bv9 = [3, K1, lW9, 8, [Q76],
            [
                [() => $f1, 0]
            ]
        ],
        jf1 = [3, K1, j09, 0, [Cb],
            [0]
        ],
        pv9 = [3, K1, nW9, 0, [Of1, Wo, RXq, PXq],
            [0, 0, () => NV9, () => _Mq]
        ],
        gXq = [3, K1, q09, 0, [_G9],
            [2]
        ],
        Fv9 = [3, K1, K09, 0, [JT6, nZ1],
            [() => VV9, () => kV9]
        ],
        gv9 = [3, K1, _09, 0, [Of1, Wo, RXq, PXq],
            [0, 0, () => EV9, () => _Mq]
        ],
        Uv9 = [3, K1, P09, 0, [PP],
            [0]
        ],
        Qv9 = [-3, K1, z09, {
                [Rb]: OQ,
                [Sb]: 400
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(Qv9, mJq);
    var dv9 = [3, K1, oW9, 0, [of9, QZ1],
            [
                [() => sV9, 0], 1
            ]
        ],
        cv9 = [3, K1, sW9, 0, [Fl6, QZ1],
            [() => tV9, 1]
        ],
        lv9 = [3, K1, tW9, 0, [QZ1],
            [1]
        ],
        nv9 = [3, K1, w09, 0, [WXq],
            [1]
        ],
        iv9 = [3, K1, H09, 0, [aO6, sZ1, Kf1, JXq, _f1, $Xq, UZ1, kXq, iJq, LXq, ID8, c76],
            [
                [0, 1],
                [() => Pf1, 0],
                [() => Wf1, 0], () => iXq, () => Xf1, () => TT9, 15, [() => qMq, 0], 64, [() => KMq, 0], () => cD8, () => lD8
            ]
        ],
        rv9 = [3, K1, J09, 0, [xG9, SXq, FD8, GXq, rJq, XT6, ID8, c76],
            [
                [() => eV9, 0], 0, () => sXq, () => nv9, 15, [() => KT9, 0], () => cD8, () => lD8
            ]
        ],
        ov9 = [3, K1, f09, 0, [FD8, GXq, XT6, ID8, c76],
            [() => sXq, () => av9, [() => ev9, 0], () => cD8, () => lD8]
        ],
        av9 = [3, K1, Z09, 0, [WXq],
            [1]
        ],
        sv9 = [3, K1, v09, 0, [aO6, sZ1, Kf1, JXq, _f1, $Xq, UZ1, kXq, iJq, LXq, ID8, c76],
            [
                [0, 1],
                [() => Pf1, 0],
                [() => Wf1, 0], () => iXq, () => Xf1, () => BT9, 15, [() => qMq, 0], 64, [() => KMq, 0], () => cD8, () => lD8
            ]
        ],
        tv9 = [3, K1, T09, 0, [Kv9],
            [
                [() => qk9, 16]
            ]
        ],
        ev9 = [3, K1, V09, 0, [OXq, VXq],
            [
                [() => cXq, 0], () => oXq
            ]
        ],
        qT9 = [3, K1, E09, 0, [sZ1, Kf1, _f1, UZ1],
            [
                [() => Pf1, 0],
                [() => Wf1, 0], () => Xf1, 15
            ]
        ],
        KT9 = [3, K1, k09, 0, [OXq, VXq],
            [
                [() => cXq, 0], () => oXq
            ]
        ],
        _T9 = [3, K1, y09, 0, [aO6, rZ1],
            [
                [0, 1],
                [() => Kk9, 0]
            ]
        ],
        zT9 = [3, K1, L09, 0, [XXq],
            [1]
        ],
        UXq = [3, K1, C09, 0, [ml6, d76, Wo, if9, nZ1],
            [0, 0, () => zk9, 0, () => gXq]
        ],
        YT9 = [3, K1, x09, 0, [iZ1, Fl6, hD8],
            [1, 1, 1]
        ],
        AT9 = [3, K1, u09, 0, [iZ1, Fl6, hD8],
            [1, 1, 1]
        ],
        OT9 = [3, K1, m09, 0, [iZ1, Fl6, hD8],
            [1, 1, 1]
        ],
        wT9 = [3, K1, g09, 0, [RD8],
            [
                [0, 1]
            ]
        ],
        $T9 = [3, K1, U09, 0, [RD8, ZXq, cZ1, uD8, YXq, bXq, DXq, zXq, tZ1],
            [0, 0, 0, 0, [() => pXq, 0], 5, 5, 5, () => Df1]
        ],
        QXq = [3, K1, p09, 0, [Ov9, gf9, Ev9, UG9, pf9, Lf9, wG9],
            [() => UT9, () => kT9, () => QT9, () => mT9, () => ET9, [() => MT9, 0], () => CT9]
        ],
        jT9 = [3, K1, r09, 0, [pD8, tJq, CD8],
            [
                [() => gl6, 0], () => Mf1, [() => UD8, 0]
            ]
        ],
        HT9 = [3, K1, a09, 0, [PP],
            [
                [() => FXq, 0]
            ]
        ],
        JT9 = [3, K1, o09, 0, [pD8, tJq, CD8],
            [
                [() => gl6, 0], () => Mf1, [() => UD8, 0]
            ]
        ],
        UD8 = [3, K1, t09, 0, [Cb, TXq, qXq],
            [0, [() => ul6, 0],
                [() => ul6, 0]
            ]
        ],
        XT9 = [3, K1, e09, 0, [],
            []
        ],
        MT9 = [3, K1, qD9, 0, [YG9],
            [
                [() => RV9, 0]
            ]
        ],
        PT9 = [3, K1, KD9, 0, [JG9, mG9],
            [0, 0]
        ],
        WT9 = [3, K1, YD9, 0, [pD8, eJq, Bf9, CD8],
            [
                [() => gl6, 0],
                [() => kD8, 0],
                [() => kD8, 0],
                [() => UD8, 0]
            ]
        ],
        kD8 = [3, K1, zD9, 0, [qv9],
            [
                [() => ul6, 0]
            ]
        ],
        DT9 = [3, K1, $D9, 0, [fG9, yG9],
            [
                [() => Lv9, 0],
                [() => FXq, 0]
            ]
        ],
        ZT9 = [3, K1, JD9, 0, [],
            []
        ],
        gl6 = [3, K1, jD9, 0, [TXq, qXq, Gv9, fv9, KXq],
            [
                [() => ul6, 0],
                [() => ul6, 0],
                [() => RJq, 0],
                [() => RJq, 0], 1
            ]
        ],
        fT9 = [3, K1, HD9, 0, [IG9, ef9],
            [
                [() => CV9, 0],
                [() => hV9, 0]
            ]
        ],
        GT9 = [3, K1, MD9, 0, [Zv9],
            [
                [() => SV9, 0]
            ]
        ],
        vT9 = [3, K1, WD9, 0, [pD8, eJq, rG9, CD8],
            [
                [() => gl6, 0],
                [() => kD8, 0], () => Mf1, [() => UD8, 0]
            ]
        ],
        TT9 = [3, K1, DD9, 0, [Bl6, pl6, XT6],
            [0, 0, 0]
        ],
        VT9 = [3, K1, vD9, 0, [Cb, KXq, zG9, U76, oO6],
            [0, 0, 0, 0, 2]
        ],
        kT9 = [3, K1, LD9, 0, [AXq],
            [() => IV9]
        ],
        NT9 = [3, K1, VD9, 0, [Cb, Mv9, eG9, U76, oO6],
            [0, 1, 1, 0, 2]
        ],
        ET9 = [3, K1, ND9, 0, [AXq],
            [() => xV9]
        ],
        yT9 = [3, K1, ED9, 8, [ml6, Wo],
            [0, [() => Ok9, 0]]
        ],
        LT9 = [3, K1, hD9, 0, [PP, NXq],
            [0, 64]
        ],
        dXq = [3, K1, CD9, 0, [zv9, XG9],
            [() => FT9, () => ST9]
        ],
        hT9 = [3, K1, RD9, 0, [bD8, U76, oO6],
            [0, 0, 2]
        ],
        RT9 = [3, K1, bD9, 8, [ml6, Wo],
            [0, [() => wk9, 0]]
        ],
        ST9 = [3, K1, ID9, 0, [HXq, mXq],
            [1, 1]
        ],
        CT9 = [3, K1, xD9, 0, [AG9, FD8, wXq],
            [1, () => lXq, () => dXq]
        ],
        bT9 = [3, K1, mD9, 0, [bD8, Cb, U76, oO6],
            [0, 0, 0, 2]
        ],
        IT9 = [3, K1, pD9, 0, [PP],
            [0]
        ],
        xT9 = [3, K1, gD9, 0, [bD8, Cb, U76, oO6],
            [0, 0, 0, 2]
        ],
        uT9 = [3, K1, QD9, 0, [d76, bD8, BG9, U76, oO6],
            [0, 0, 0, 0, 2]
        ],
        mT9 = [3, K1, lD9, 0, [uG9, gG9],
            [() => pV9, () => FV9]
        ],
        BT9 = [3, K1, cD9, 0, [Bl6, pl6, XT6, lG9],
            [0, 0, 0, 0]
        ],
        pT9 = [3, K1, rD9, 0, [PP, NXq],
            [0, 64]
        ],
        FT9 = [3, K1, oD9, 0, [HXq, mXq],
            [1, 1]
        ],
        gT9 = [3, K1, nD9, 0, [d76, Cb, U76, oO6],
            [0, 0, 0, 2]
        ],
        UT9 = [3, K1, sD9, 0, [Dv9],
            [() => gV9]
        ],
        cXq = [3, K1, iD9, 0, [vG9, OG9, RG9, oJq],
            [64, [() => iV9, 0],
                [() => nV9, 0], 0
            ]
        ],
        lXq = [3, K1, tD9, 0, [wv9, Qf9, yv9, dG9, QG9, Ff9, Uf9, hf9, Rf9],
            [1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        QT9 = [3, K1, eD9, 0, [cf9, NG9],
            [() => uV9, () => mV9]
        ],
        nXq = [3, K1, qZ9, 0, [ml6, Wo],
            [0, () => $k9]
        ],
        iXq = [3, K1, KZ9, 0, [kG9, Xv9, $v9, oG9],
            [1, 1, 1, 64]
        ],
        QD8 = [-3, K1, WZ9, {
                [Rb]: IXq,
                [Sb]: 500
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(QD8, IJq);
    var dT9 = [3, K1, zZ9, 0, [rO6, LD8, aJq, aO6, XT6, Bl6, pl6, xD8, c76],
            [
                [() => gD8, 16],
                [0, {
                    [MP]: gZ1
                }],
                [0, {
                    [MP]: CW9
                }],
                [0, 1],
                [0, {
                    [MP]: nJq
                }],
                [0, {
                    [MP]: cJq
                }],
                [0, {
                    [MP]: lJq
                }],
                [0, {
                    [MP]: ED8
                }],
                [0, {
                    [MP]: yD8
                }]
            ]
        ],
        cT9 = [3, K1, YZ9, 0, [rO6, LD8, xD8, c76],
            [
                [() => gD8, 16],
                [0, {
                    [MP]: gZ1
                }],
                [0, {
                    [MP]: ED8
                }],
                [0, {
                    [MP]: yD8
                }]
            ]
        ],
        lT9 = [3, K1, AZ9, 0, [rO6],
            [
                [() => gD8, 0]
            ]
        ],
        nT9 = [3, K1, jZ9, 0, [aO6, rO6],
            [
                [0, 1],
                [() => jk9, 16]
            ]
        ],
        iT9 = [3, K1, HZ9, 0, [rO6],
            [
                [() => Hk9, 16]
            ]
        ],
        rT9 = [3, K1, XZ9, 0, [rO6, LD8, aJq, aO6, XT6, Bl6, pl6, xD8, c76],
            [
                [() => gD8, 16],
                [0, {
                    [MP]: gZ1
                }],
                [0, {
                    [MP]: Nf9
                }],
                [0, 1],
                [0, {
                    [MP]: nJq
                }],
                [0, {
                    [MP]: cJq
                }],
                [0, {
                    [MP]: lJq
                }],
                [0, {
                    [MP]: ED8
                }],
                [0, {
                    [MP]: yD8
                }]
            ]
        ],
        oT9 = [3, K1, MZ9, 0, [rO6, LD8, xD8, c76],
            [
                [() => Pk9, 16],
                [0, {
                    [MP]: Ef9
                }],
                [0, {
                    [MP]: ED8
                }],
                [0, {
                    [MP]: yD8
                }]
            ]
        ],
        aT9 = [3, K1, ZZ9, 0, [LJq, hJq, EJq, kJq, FZ1, NJq, yJq],
            [
                [5, {
                    [iO6]: LJq
                }],
                [5, {
                    [iO6]: hJq
                }],
                [0, {
                    [iO6]: EJq
                }],
                [1, {
                    [iO6]: kJq
                }],
                [0, {
                    [iO6]: FZ1
                }],
                [0, {
                    [iO6]: NJq
                }],
                [0, {
                    [iO6]: yJq
                }]
            ]
        ],
        sT9 = [3, K1, fZ9, 0, [FZ1, yf9],
            [0, [() => TV9, 0]]
        ],
        rXq = [3, K1, GZ9, 0, [hXq, JT6],
            [0, [() => yV9, 0]]
        ],
        tT9 = [3, K1, kZ9, 0, [hXq],
            [0]
        ],
        eT9 = [3, K1, EZ9, 0, [SXq, rJq],
            [0, 15]
        ],
        qV9 = [-3, K1, vZ9, {
                [Rb]: OQ,
                [Sb]: 424
            },
            [ph, vXq, pG9],
            [0, 1, 0]
        ];
    GE.TypeRegistry.for(K1).registerError(qV9, gJq);
    var KV9 = [-3, K1, VZ9, {
            [Rb]: OQ,
            [Sb]: 429
        },
        [ph],
        [0]
    ];
    GE.TypeRegistry.for(K1).registerError(KV9, UJq);
    var dD8 = [-3, K1, NZ9, {
            [Rb]: OQ,
            [Sb]: 424
        },
        [ph, vXq, SG9],
        [0, 1, 0]
    ];
    GE.TypeRegistry.for(K1).registerError(dD8, dJq);
    var Hf1 = [-3, K1, yZ9, {
            [Rb]: OQ,
            [Sb]: 408
        },
        [ph],
        [0]
    ];
    GE.TypeRegistry.for(K1).registerError(Hf1, QJq);
    var _V9 = [3, K1, SZ9, 8, [Q76],
            [
                [() => $f1, 0]
            ]
        ],
        cD8 = [3, K1, RZ9, 0, [ZG9],
            [0]
        ],
        oXq = [3, K1, CZ9, 0, [$G9],
            [0]
        ],
        zV9 = [3, K1, FZ9, 8, [PP, xXq],
            [0, 0]
        ],
        YV9 = [-3, K1, BZ9, {
                [Rb]: OQ,
                [Sb]: 404
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(YV9, BJq);
    var Jf1 = [3, K1, lZ9, 0, [vv9, sJq],
            [0, 0]
        ],
        aXq = [3, K1, iZ9, 0, [Wo, Of1, JT6, nZ1],
            [0, 0, () => UV9, () => gXq]
        ],
        AV9 = [3, K1, rZ9, 0, [PP],
            [0]
        ],
        OV9 = [3, K1, aZ9, 0, [nG9, Fl6, hD8],
            [1, 1, 1]
        ],
        wV9 = [-3, K1, nZ9, {
                [Rb]: OQ,
                [Sb]: 400
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(wV9, pJq);
    var lD8 = [3, K1, sZ9, 0, [Cb],
            [0]
        ],
        nD8 = [-3, K1, qf9, {
                [Rb]: IXq,
                [Sb]: 503
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(nD8, FJq);
    var $V9 = [3, K1, tZ9, 0, [d76],
            [0]
        ],
        jV9 = [3, K1, UZ9, 0, [cZ1, aO6, GG9, tZ1, Jv9],
            [
                [0, 4], 0, [() => hv9, 0], () => Df1, () => QV9
            ]
        ],
        HV9 = [3, K1, QZ9, 0, [RD8],
            [0]
        ],
        JV9 = [3, K1, eZ9, 0, [d76],
            [0]
        ],
        XV9 = [3, K1, Kf9, 0, [WG9, Vv9],
            [0, 0]
        ],
        iD8 = [-3, K1, Yf9, {
                [Rb]: OQ,
                [Sb]: 429
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(iD8, xJq);
    var sXq = [3, K1, Pf9, 0, [XXq, bG9, Hv9, df9, lf9],
            [1, 1, 1, 1, 1]
        ],
        Xf1 = [3, K1, _f9, 0, [Pv9, Yv9],
            [() => lV9, () => Zk9]
        ],
        MV9 = [3, K1, wf9, 0, [BD8, JT6, uD8, Cb],
            [0, () => cV9, 0, 0]
        ],
        PV9 = [3, K1, Hf9, 0, [BD8, Cb, uD8],
            [0, 0, 0]
        ],
        WV9 = [3, K1, Mf9, 0, [d76, qG9, HG9],
            [0, 0, () => fk9]
        ],
        DV9 = [3, K1, Wf9, 0, [BD8, d76, rZ1, Cb],
            [0, 0, 15, 0]
        ],
        ZV9 = [3, K1, Df9, 0, [rZ1],
            [0]
        ],
        fV9 = [3, K1, Zf9, 0, [BD8, d76, Cb],
            [0, 0, 0]
        ],
        rD8 = [-3, K1, Tf9, {
                [Rb]: OQ,
                [Sb]: 400
            },
            [ph],
            [0]
        ];
    GE.TypeRegistry.for(K1).registerError(rD8, uJq);
    var tXq = [3, K1, vf9, 0, [ml6, Wo],
            [0, () => Tk9]
        ],
        GV9 = [3, K1, kf9, 0, [Tv9, KG9],
            [0, 0]
        ],
        vV9 = [-3, uXq, "BedrockRuntimeServiceException", 0, [],
            []
        ];
    GE.TypeRegistry.for(uXq).registerError(vV9, vE);
    var TV9 = [1, K1, gW9, 0, [() => xv9, 0]],
        VV9 = [1, K1, A09, 0, () => rV9],
        kV9 = [1, K1, R09, 0, () => pv9],
        NV9 = [1, K1, W09, 0, () => oV9],
        EV9 = [1, K1, D09, 0, () => Uv9],
        yV9 = [1, K1, iW9, 0, [() => aV9, 0]],
        LV9 = [1, K1, b09, 0, () => _k9],
        eXq = [1, K1, Q09, 0, [() => QXq, 0]],
        hV9 = [1, K1, l09, 0, [() => kD8, 0]],
        RV9 = [1, K1, i09, 0, [() => Yk9, 0]],
        RJq = [1, K1, s09, 0, [() => HT9, 0]],
        Mf1 = [1, K1, _D9, 0, () => PT9],
        ul6 = [1, K1, AD9, 0, [() => DT9, 0]],
        SV9 = [1, K1, XD9, 0, [() => gl6, 0]],
        CV9 = [1, K1, PD9, 0, [() => GT9, 0]],
        bV9 = [1, K1, fD9, 0, [() => Ak9, 0]],
        IV9 = [1, K1, TD9, 0, () => VT9],
        xV9 = [1, K1, kD9, 0, () => NT9],
        uV9 = [1, K1, SD9, 0, () => hT9],
        mV9 = [1, K1, BD9, 0, () => bT9],
        BV9 = [1, K1, FD9, 0, () => IT9],
        pV9 = [1, K1, UD9, 0, () => xT9],
        FV9 = [1, K1, dD9, 0, () => uT9],
        gV9 = [1, K1, aD9, 0, () => gT9],
        Pf1 = [1, K1, LZ9, 0, [() => rXq, 0]],
        UV9 = [1, K1, oZ9, 0, () => AV9],
        Wf1 = [1, K1, dZ9, 0, [() => Wk9, 0]],
        QV9 = [1, K1, Of9, 0, () => XV9],
        dV9 = [1, K1, $f9, 0, () => Gk9],
        cV9 = [1, K1, Jf9, 0, () => vk9],
        lV9 = [1, K1, ff9, 0, () => Dk9],
        nV9 = [2, K1, d09, 0, [0, 0],
            [() => eXq, 0]
        ],
        iV9 = [2, K1, c09, 0, [0, 0],
            [() => QXq, 0]
        ],
        qMq = [2, K1, bZ9, 8, 0, () => Jk9],
        KMq = [2, K1, mZ9, 8, 0, 0],
        Df1 = [3, K1, BW9, 0, [cG9],
            [() => Iv9]
        ],
        rV9 = [3, K1, Y09, 0, [PP],
            [0]
        ],
        _Mq = [3, K1, O09, 0, [Nv9, af9, tf9, sf9, iG9],
            [() => GV9, () => YT9, () => OT9, () => AT9, () => OV9]
        ],
        oV9 = [3, K1, M09, 0, [PP],
            [0]
        ],
        aV9 = [3, K1, eW9, 0, [PP, SD8, _Xq, BXq, Af1, Yf1, jXq, dZ1, EXq, mf9, CXq],
            [0, () => nXq, () => UXq, () => tXq, () => DV9, () => MV9, [() => zMq, 0], () => jf1, [() => Xk9, 0], () => Fv9, () => aXq]
        ],
        sV9 = [3, K1, rW9, 0, [PP, Af1, Yf1, EXq, nf9],
            [0, () => ZV9, () => dV9, [() => Mk9, 0], () => gv9]
        ],
        tV9 = [3, K1, aW9, 0, [Af1, Yf1],
            [() => fV9, () => PV9]
        ],
        eV9 = [3, K1, $09, 0, [ph],
            [
                [() => rXq, 0]
            ]
        ],
        qk9 = [3, K1, G09, {
                [mD8]: 1
            },
            [TG9, xf9, If9, uf9, VG9, EG9, oZ1, aZ1, wf1, zf1, qf1],
            [() => tT9, () => cv9, [() => dv9, 0], () => lv9, () => eT9, [() => ov9, 0],
                [() => QD8, 0],
                [() => dD8, 0],
                [() => rD8, 0],
                [() => iD8, 0],
                [() => nD8, 0]
            ]
        ],
        Kk9 = [3, K1, N09, 0, [jG9, rf9],
            [
                [() => lT9, 0],
                [() => qT9, 0]
            ]
        ],
        _k9 = [3, K1, I09, 0, [PP],
            [0]
        ],
        zk9 = [3, K1, B09, 0, [Q76, eZ1, PP, JT6],
            [21, () => Jf1, 0, () => LV9]
        ],
        Yk9 = [3, K1, n09, 0, [kv9, PG9, tG9, MG9, _v9, Av9, LG9],
            [
                [() => vT9, 0],
                [() => JT9, 0],
                [() => WT9, 0],
                [() => jT9, 0],
                [() => fT9, 0], () => ZT9, () => XT9
            ]
        ],
        Ak9 = [3, K1, ZD9, 0, [PP, SD8],
            [() => pT9, [() => RT9, 0]]
        ],
        zMq = [3, K1, GD9, 0, [PP, SD8],
            [() => LT9, [() => yT9, 0]]
        ],
        Ok9 = [3, K1, yD9, 8, [Q76],
            [21]
        ],
        wk9 = [3, K1, uD9, 8, [Q76],
            [21]
        ],
        $k9 = [3, K1, PZ9, 0, [Q76, eZ1],
            [21, () => Jf1]
        ],
        jk9 = [3, K1, wZ9, {
                [mD8]: 1
            },
            [lZ1],
            [
                [() => mv9, 0]
            ]
        ],
        Hk9 = [3, K1, $Z9, {
                [mD8]: 1
            },
            [lZ1, oZ1, aZ1, wf1, zf1, fXq, qf1],
            [
                [() => Bv9, 0],
                [() => QD8, 0],
                [() => dD8, 0],
                [() => rD8, 0],
                [() => iD8, 0],
                [() => Hf1, 0],
                [() => nD8, 0]
            ]
        ],
        Jk9 = [3, K1, IZ9, 0, [PP],
            [0]
        ],
        Xk9 = [3, K1, xZ9, 8, [FG9, yXq],
            [
                [() => zV9, 0], 21
            ]
        ],
        Mk9 = [3, K1, uZ9, 8, [PP, yXq, xXq],
            [0, 21, 0]
        ],
        Pk9 = [3, K1, pZ9, {
                [mD8]: 1
            },
            [lZ1, oZ1, aZ1, wf1, zf1, fXq, qf1],
            [
                [() => _V9, 0],
                [() => QD8, 0],
                [() => dD8, 0],
                [() => rD8, 0],
                [() => iD8, 0],
                [() => Hf1, 0],
                [() => nD8, 0]
            ]
        ],
        Wk9 = [3, K1, cZ9, 0, [PP, jXq, dZ1],
            [0, [() => zMq, 0], () => jf1]
        ],
        Dk9 = [3, K1, Gf9, 0, [jv9, aG9, dZ1],
            [() => WV9, () => JV9, () => jf1]
        ],
        Zk9 = [3, K1, zf9, 0, [bf9, Sf9, Wv9],
            [() => uv9, () => Sv9, () => $V9]
        ],
        fk9 = [3, K1, Af9, 0, [MXq],
            [15]
        ],
        Gk9 = [3, K1, jf9, 0, [PP],
            [0]
        ],
        vk9 = [3, K1, Xf9, 0, [MXq, PP, SD8, _Xq, BXq, CXq],
            [15, 0, () => nXq, () => UXq, () => tXq, () => aXq]
        ],
        Tk9 = [3, K1, Vf9, 0, [Q76, eZ1],
            [21, () => Jf1]
        ],
        Vk9 = [9, K1, IW9, {
            [wQ]: ["POST", "/guardrail/{guardrailIdentifier}/version/{guardrailVersion}/apply", 200]
        }, () => Cv9, () => bv9],
        kk9 = [9, K1, S09, {
            [wQ]: ["POST", "/model/{modelId}/converse", 200]
        }, () => iv9, () => rv9],
        Nk9 = [9, K1, X09, {
            [wQ]: ["POST", "/model/{modelId}/converse-stream", 200]
        }, () => sv9, () => tv9],
        Ek9 = [9, K1, h09, {
            [wQ]: ["POST", "/model/{modelId}/count-tokens", 200]
        }, () => _T9, () => zT9],
        yk9 = [9, K1, F09, {
            [wQ]: ["GET", "/async-invoke/{invocationArn}", 200]
        }, () => wT9, () => $T9],
        Lk9 = [9, K1, _Z9, {
            [wQ]: ["POST", "/model/{modelId}/invoke", 200]
        }, () => dT9, () => cT9],
        hk9 = [9, K1, OZ9, {
            [wQ]: ["POST", "/model/{modelId}/invoke-with-bidirectional-stream", 200]
        }, () => nT9, () => iT9],
        Rk9 = [9, K1, JZ9, {
            [wQ]: ["POST", "/model/{modelId}/invoke-with-response-stream", 200]
        }, () => rT9, () => oT9],
        Sk9 = [9, K1, DZ9, {
            [wQ]: ["GET", "/async-invoke", 200]
        }, () => aT9, () => sT9],
        Ck9 = [9, K1, gZ9, {
            [wQ]: ["POST", "/async-invoke", 200]
        }, () => jV9, () => HV9];
    class Zf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ApplyGuardrail", {}).n("BedrockRuntimeClient", "ApplyGuardrailCommand").sc(Vk9).build() {}
    class ff1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "Converse", {}).n("BedrockRuntimeClient", "ConverseCommand").sc(kk9).build() {}
    class Gf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ConverseStream", {
        eventStream: {
            output: !0
        }
    }).n("BedrockRuntimeClient", "ConverseStreamCommand").sc(Nk9).build() {}
    class vf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "CountTokens", {}).n("BedrockRuntimeClient", "CountTokensCommand").sc(Ek9).build() {}
    class Tf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "GetAsyncInvoke", {}).n("BedrockRuntimeClient", "GetAsyncInvokeCommand").sc(yk9).build() {}
    class Vf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModel", {}).n("BedrockRuntimeClient", "InvokeModelCommand").sc(Lk9).build() {}
    class kf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions()), SJq.getEventStreamPlugin(_), CJq.getWebSocketPlugin(_, {
            headerPrefix: "x-amz-bedrock-"
        })]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithBidirectionalStream", {
        eventStream: {
            input: !0,
            output: !0
        }
    }).n("BedrockRuntimeClient", "InvokeModelWithBidirectionalStreamCommand").sc(hk9).build() {}
    class Nf1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "InvokeModelWithResponseStream", {
        eventStream: {
            output: !0
        }
    }).n("BedrockRuntimeClient", "InvokeModelWithResponseStreamCommand").sc(Rk9).build() {}
    class oD8 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "ListAsyncInvokes", {}).n("BedrockRuntimeClient", "ListAsyncInvokesCommand").sc(Sk9).build() {}
    class Ef1 extends eZ.Command.classBuilder().ep(AQ).m(function(q, K, _, z) {
        return [qB.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AmazonBedrockFrontendService", "StartAsyncInvoke", {}).n("BedrockRuntimeClient", "StartAsyncInvokeCommand").sc(Ck9).build() {}
    var bk9 = {
        ApplyGuardrailCommand: Zf1,
        ConverseCommand: ff1,
        ConverseStreamCommand: Gf1,
        CountTokensCommand: vf1,
        GetAsyncInvokeCommand: Tf1,
        InvokeModelCommand: Vf1,
        InvokeModelWithBidirectionalStreamCommand: kf1,
        InvokeModelWithResponseStreamCommand: Nf1,
        ListAsyncInvokesCommand: oD8,
        StartAsyncInvokeCommand: Ef1
    };
    class yf1 extends ND8 {}
    eZ.createAggregatedClient(bk9, yf1);
    var Ik9 = VD8.createPaginator(ND8, oD8, "nextToken", "nextToken", "maxResults"),
        xk9 = {
            COMPLETED: "Completed",
            FAILED: "Failed",
            IN_PROGRESS: "InProgress"
        },
        uk9 = {
            SUBMISSION_TIME: "SubmissionTime"
        },
        mk9 = {
            ASCENDING: "Ascending",
            DESCENDING: "Descending"
        },
        Bk9 = {
            JPEG: "jpeg",
            PNG: "png"
        },
        pk9 = {
            GROUNDING_SOURCE: "grounding_source",
            GUARD_CONTENT: "guard_content",
            QUERY: "query"
        },
        Fk9 = {
            FULL: "FULL",
            INTERVENTIONS: "INTERVENTIONS"
        },
        gk9 = {
            INPUT: "INPUT",
            OUTPUT: "OUTPUT"
        },
        Uk9 = {
            GUARDRAIL_INTERVENED: "GUARDRAIL_INTERVENED",
            NONE: "NONE"
        },
        Qk9 = {
            ALWAYS_FALSE: "ALWAYS_FALSE",
            ALWAYS_TRUE: "ALWAYS_TRUE"
        },
        dk9 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        ck9 = {
            HIGH: "HIGH",
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            NONE: "NONE"
        },
        lk9 = {
            HIGH: "HIGH",
            LOW: "LOW",
            MEDIUM: "MEDIUM",
            NONE: "NONE"
        },
        nk9 = {
            HATE: "HATE",
            INSULTS: "INSULTS",
            MISCONDUCT: "MISCONDUCT",
            PROMPT_ATTACK: "PROMPT_ATTACK",
            SEXUAL: "SEXUAL",
            VIOLENCE: "VIOLENCE"
        },
        ik9 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        rk9 = {
            GROUNDING: "GROUNDING",
            RELEVANCE: "RELEVANCE"
        },
        ok9 = {
            ANONYMIZED: "ANONYMIZED",
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        ak9 = {
            ADDRESS: "ADDRESS",
            AGE: "AGE",
            AWS_ACCESS_KEY: "AWS_ACCESS_KEY",
            AWS_SECRET_KEY: "AWS_SECRET_KEY",
            CA_HEALTH_NUMBER: "CA_HEALTH_NUMBER",
            CA_SOCIAL_INSURANCE_NUMBER: "CA_SOCIAL_INSURANCE_NUMBER",
            CREDIT_DEBIT_CARD_CVV: "CREDIT_DEBIT_CARD_CVV",
            CREDIT_DEBIT_CARD_EXPIRY: "CREDIT_DEBIT_CARD_EXPIRY",
            CREDIT_DEBIT_CARD_NUMBER: "CREDIT_DEBIT_CARD_NUMBER",
            DRIVER_ID: "DRIVER_ID",
            EMAIL: "EMAIL",
            INTERNATIONAL_BANK_ACCOUNT_NUMBER: "INTERNATIONAL_BANK_ACCOUNT_NUMBER",
            IP_ADDRESS: "IP_ADDRESS",
            LICENSE_PLATE: "LICENSE_PLATE",
            MAC_ADDRESS: "MAC_ADDRESS",
            NAME: "NAME",
            PASSWORD: "PASSWORD",
            PHONE: "PHONE",
            PIN: "PIN",
            SWIFT_CODE: "SWIFT_CODE",
            UK_NATIONAL_HEALTH_SERVICE_NUMBER: "UK_NATIONAL_HEALTH_SERVICE_NUMBER",
            UK_NATIONAL_INSURANCE_NUMBER: "UK_NATIONAL_INSURANCE_NUMBER",
            UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER: "UK_UNIQUE_TAXPAYER_REFERENCE_NUMBER",
            URL: "URL",
            USERNAME: "USERNAME",
            US_BANK_ACCOUNT_NUMBER: "US_BANK_ACCOUNT_NUMBER",
            US_BANK_ROUTING_NUMBER: "US_BANK_ROUTING_NUMBER",
            US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER: "US_INDIVIDUAL_TAX_IDENTIFICATION_NUMBER",
            US_PASSPORT_NUMBER: "US_PASSPORT_NUMBER",
            US_SOCIAL_SECURITY_NUMBER: "US_SOCIAL_SECURITY_NUMBER",
            VEHICLE_IDENTIFICATION_NUMBER: "VEHICLE_IDENTIFICATION_NUMBER"
        },
        sk9 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        tk9 = {
            DENY: "DENY"
        },
        ek9 = {
            BLOCKED: "BLOCKED",
            NONE: "NONE"
        },
        qN9 = {
            PROFANITY: "PROFANITY"
        },
        KN9 = {
            DISABLED: "disabled",
            ENABLED: "enabled",
            ENABLED_FULL: "enabled_full"
        },
        _N9 = {
            DEFAULT: "default"
        },
        zN9 = {
            CSV: "csv",
            DOC: "doc",
            DOCX: "docx",
            HTML: "html",
            MD: "md",
            PDF: "pdf",
            TXT: "txt",
            XLS: "xls",
            XLSX: "xlsx"
        },
        YN9 = {
            JPEG: "jpeg",
            PNG: "png"
        },
        AN9 = {
            GROUNDING_SOURCE: "grounding_source",
            GUARD_CONTENT: "guard_content",
            QUERY: "query"
        },
        ON9 = {
            GIF: "gif",
            JPEG: "jpeg",
            PNG: "png",
            WEBP: "webp"
        },
        wN9 = {
            FLV: "flv",
            MKV: "mkv",
            MOV: "mov",
            MP4: "mp4",
            MPEG: "mpeg",
            MPG: "mpg",
            THREE_GP: "three_gp",
            WEBM: "webm",
            WMV: "wmv"
        },
        $N9 = {
            ERROR: "error",
            SUCCESS: "success"
        },
        jN9 = {
            SERVER_TOOL_USE: "server_tool_use"
        },
        HN9 = {
            ASSISTANT: "assistant",
            USER: "user"
        },
        JN9 = {
            OPTIMIZED: "optimized",
            STANDARD: "standard"
        },
        XN9 = {
            DEFAULT: "default",
            FLEX: "flex",
            PRIORITY: "priority"
        },
        MN9 = {
            CONTENT_FILTERED: "content_filtered",
            END_TURN: "end_turn",
            GUARDRAIL_INTERVENED: "guardrail_intervened",
            MAX_TOKENS: "max_tokens",
            MODEL_CONTEXT_WINDOW_EXCEEDED: "model_context_window_exceeded",
            STOP_SEQUENCE: "stop_sequence",
            TOOL_USE: "tool_use"
        },
        PN9 = {
            ASYNC: "async",
            SYNC: "sync"
        },
        WN9 = {
            DISABLED: "DISABLED",
            ENABLED: "ENABLED",
            ENABLED_FULL: "ENABLED_FULL"
        };
    Object.defineProperty(Lf1, "$Command", {
        enumerable: !0,
        get: function() {
            return eZ.Command
        }
    });
    Object.defineProperty(Lf1, "__Client", {
        enumerable: !0,
        get: function() {
            return eZ.Client
        }
    });
    Lf1.AccessDeniedException = bJq;
    Lf1.ApplyGuardrailCommand = Zf1;
    Lf1.AsyncInvokeStatus = xk9;
    Lf1.BedrockRuntime = yf1;
    Lf1.BedrockRuntimeClient = ND8;
    Lf1.BedrockRuntimeServiceException = vE;
    Lf1.CachePointType = _N9;
    Lf1.ConflictException = mJq;
    Lf1.ConversationRole = HN9;
    Lf1.ConverseCommand = ff1;
    Lf1.ConverseStreamCommand = Gf1;
    Lf1.CountTokensCommand = vf1;
    Lf1.DocumentFormat = zN9;
    Lf1.GetAsyncInvokeCommand = Tf1;
    Lf1.GuardrailAction = Uk9;
    Lf1.GuardrailAutomatedReasoningLogicWarningType = Qk9;
    Lf1.GuardrailContentFilterConfidence = ck9;
    Lf1.GuardrailContentFilterStrength = lk9;
    Lf1.GuardrailContentFilterType = nk9;
    Lf1.GuardrailContentPolicyAction = dk9;
    Lf1.GuardrailContentQualifier = pk9;
    Lf1.GuardrailContentSource = gk9;
    Lf1.GuardrailContextualGroundingFilterType = rk9;
    Lf1.GuardrailContextualGroundingPolicyAction = ik9;
    Lf1.GuardrailConverseContentQualifier = AN9;
    Lf1.GuardrailConverseImageFormat = YN9;
    Lf1.GuardrailImageFormat = Bk9;
    Lf1.GuardrailManagedWordType = qN9;
    Lf1.GuardrailOutputScope = Fk9;
    Lf1.GuardrailPiiEntityType = ak9;
    Lf1.GuardrailSensitiveInformationPolicyAction = ok9;
    Lf1.GuardrailStreamProcessingMode = PN9;
    Lf1.GuardrailTopicPolicyAction = sk9;
    Lf1.GuardrailTopicType = tk9;
    Lf1.GuardrailTrace = KN9;
    Lf1.GuardrailWordPolicyAction = ek9;
    Lf1.ImageFormat = ON9;
    Lf1.InternalServerException = IJq;
    Lf1.InvokeModelCommand = Vf1;
    Lf1.InvokeModelWithBidirectionalStreamCommand = kf1;
    Lf1.InvokeModelWithResponseStreamCommand = Nf1;
    Lf1.ListAsyncInvokesCommand = oD8;
    Lf1.ModelErrorException = gJq;
    Lf1.ModelNotReadyException = UJq;
    Lf1.ModelStreamErrorException = dJq;
    Lf1.ModelTimeoutException = QJq;
    Lf1.PerformanceConfigLatency = JN9;
    Lf1.ResourceNotFoundException = BJq;
    Lf1.ServiceQuotaExceededException = pJq;
    Lf1.ServiceTierType = XN9;
    Lf1.ServiceUnavailableException = FJq;
    Lf1.SortAsyncInvocationBy = uk9;
    Lf1.SortOrder = mk9;
    Lf1.StartAsyncInvokeCommand = Ef1;
    Lf1.StopReason = MN9;
    Lf1.ThrottlingException = xJq;
    Lf1.ToolResultStatus = $N9;
    Lf1.ToolUseType = jN9;
    Lf1.Trace = WN9;
    Lf1.ValidationException = uJq;
    Lf1.VideoFormat = wN9;
    Lf1.paginateListAsyncInvokes = Ik9
})
// @from(Ln 102493, Col 0)
function l76(q, K) {
    return q.find((_) => _.includes(K)) ?? null
}
// @from(Ln 102496, Col 0)
async function YMq() {
    let {
        BedrockClient: q
    } = await Promise.resolve().then(() => K6(Nl6(), 1)), K = oL(), _ = S6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), z = {
        region: K,
        ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
            endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
        },
        ...await iv6(),
        ..._ && {
            requestHandler: new(await Promise.resolve().then(() => K6(wE(), 1))).NodeHttpHandler,
            httpAuthSchemes: [{
                schemeId: "smithy.api#noAuth",
                identityProvider: () => async () => ({}),
                signer: new(await Promise.resolve().then(() => K6(FO(), 1))).NoAuthSigner
            }],
            httpAuthSchemeProvider: () => [{
                schemeId: "smithy.api#noAuth"
            }]
        }
    };
    if (!_ && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
        let Y = await bb();
        if (Y) z.credentials = {
            accessKeyId: Y.accessKeyId,
            secretAccessKey: Y.secretAccessKey,
            sessionToken: Y.sessionToken
        }
    }
    return new q(z)
}
// @from(Ln 102527, Col 0)
async function AMq() {
    let {
        BedrockRuntimeClient: q
    } = await Promise.resolve().then(() => K6(aD8(), 1)), K = oL(), _ = S6(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH), z = {
        region: K,
        ...process.env.ANTHROPIC_BEDROCK_BASE_URL && {
            endpoint: process.env.ANTHROPIC_BEDROCK_BASE_URL
        },
        ...await iv6(),
        ..._ && {
            requestHandler: new(await Promise.resolve().then(() => K6(wE(), 1))).NodeHttpHandler,
            httpAuthSchemes: [{
                schemeId: "smithy.api#noAuth",
                identityProvider: () => async () => ({}),
                signer: new(await Promise.resolve().then(() => K6(FO(), 1))).NoAuthSigner
            }],
            httpAuthSchemeProvider: () => [{
                schemeId: "smithy.api#noAuth"
            }]
        }
    };
    if (!_ && !process.env.AWS_BEARER_TOKEN_BEDROCK) {
        let Y = await bb();
        if (Y) z.credentials = {
            accessKeyId: Y.accessKeyId,
            secretAccessKey: Y.secretAccessKey,
            sessionToken: Y.sessionToken
        }
    }
    return new q(z)
}
// @from(Ln 102559, Col 0)
function hf1(q) {
    return q.startsWith("anthropic.")
}
// @from(Ln 102563, Col 0)
function EE9(q) {
    if (!q.startsWith("arn:")) return q;
    let K = q.lastIndexOf("/");
    if (K === -1) return q;
    return q.substring(K + 1)
}
// @from(Ln 102570, Col 0)
function tD8(q) {
    let K = EE9(q);
    for (let _ of NE9)
        if (K.startsWith(`${_}.anthropic.`)) return _;
    return
}
// @from(Ln 102577, Col 0)
function MT6(q, K) {
    let _ = tD8(q);
    if (_) return q.replace(`${_}.`, `${K}.`);
    if (hf1(q)) return `${K}.${q}`;
    return q
}
// @from(Ln 102584, Col 0)
function eD8(q) {
    let K = q ?? "";
    if (K.startsWith("us-") && !K.startsWith("us-gov-")) return "us";
    if (K.startsWith("eu-")) return "eu";
    if (K.startsWith("ap-")) return "apac";
    return "global"
}
// @from(Ln 102591, Col 4)
Ul6
// @from(Ln 102591, Col 9)
sD8
// @from(Ln 102591, Col 14)
NE9
// @from(Ln 102592, Col 4)
n76 = L(() => {
    U4();
    T7();
    Q8();
    U8();
    _M();
    Ul6 = P1(async function() {
        let [q, {
            ListInferenceProfilesCommand: K
        }] = await Promise.all([YMq(), Promise.resolve().then(() => K6(Nl6(), 1))]), _ = [], z;
        try {
            do {
                let Y = new K({
                        ...z && {
                            nextToken: z
                        },
                        typeEquals: "SYSTEM_DEFINED"
                    }),
                    A = await q.send(Y, {
                        abortSignal: AbortSignal.timeout(8000)
                    });
                if (A.inferenceProfileSummaries) _.push(...A.inferenceProfileSummaries);
                z = A.nextToken
            } while (z);
            return _.filter((Y) => Y.inferenceProfileId?.includes("anthropic")).map((Y) => Y.inferenceProfileId).filter(Boolean)
        } catch (Y) {
            throw j6(Y), Y
        }
    });
    sD8 = P1(async function(q) {
        try {
            let [K, {
                GetInferenceProfileCommand: _
            }] = await Promise.all([YMq(), Promise.resolve().then(() => K6(Nl6(), 1))]), z = new _({
                inferenceProfileIdentifier: q
            }), Y = await K.send(z);
            if (!Y.models || Y.models.length === 0) return null;
            let A = Y.models[0];
            if (!A?.modelArn) return null;
            let O = A.modelArn.lastIndexOf("/");
            return O >= 0 ? A.modelArn.substring(O + 1) : A.modelArn
        } catch (K) {
            return j6(K), null
        }
    });
    NE9 = ["us", "eu", "apac", "global"]
})
// @from(Ln 102640, Col 0)
function wMq(q) {
    let K = q.toLowerCase();
    for (let _ of Object.values(qA))
        for (let z of Object.values(_))
            if (typeof z === "string" && z.toLowerCase() === K) return _;
    return null
}
// @from(Ln 102647, Col 4)
Rf1
// @from(Ln 102647, Col 9)
Sf1
// @from(Ln 102647, Col 14)
Cf1
// @from(Ln 102647, Col 19)
bf1
// @from(Ln 102647, Col 24)
If1
// @from(Ln 102647, Col 29)
xf1
// @from(Ln 102647, Col 34)
uf1
// @from(Ln 102647, Col 39)
mf1
// @from(Ln 102647, Col 44)
Bf1
// @from(Ln 102647, Col 49)
pf1
// @from(Ln 102647, Col 54)
qZ8
// @from(Ln 102647, Col 59)
Ff1
// @from(Ln 102647, Col 64)
qA
// @from(Ln 102647, Col 68)
B2O
// @from(Ln 102647, Col 73)
OMq
// @from(Ln 102648, Col 4)
i76 = L(() => {
    Rf1 = {
        firstParty: "claude-3-7-sonnet-20250219",
        bedrock: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
        vertex: "claude-3-7-sonnet@20250219",
        foundry: "claude-3-7-sonnet",
        anthropicAws: "claude-3-7-sonnet-20250219",
        mantle: null
    }, Sf1 = {
        firstParty: "claude-3-5-sonnet-20241022",
        bedrock: "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
        vertex: "claude-3-5-sonnet-v2@20241022",
        foundry: "claude-3-5-sonnet",
        anthropicAws: "claude-3-5-sonnet-20241022",
        mantle: null
    }, Cf1 = {
        firstParty: "claude-3-5-haiku-20241022",
        bedrock: "us.anthropic.claude-3-5-haiku-20241022-v1:0",
        vertex: "claude-3-5-haiku@20241022",
        foundry: "claude-3-5-haiku",
        anthropicAws: "claude-3-5-haiku-20241022",
        mantle: null
    }, bf1 = {
        firstParty: "claude-haiku-4-5-20251001",
        bedrock: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        vertex: "claude-haiku-4-5@20251001",
        foundry: "claude-haiku-4-5",
        anthropicAws: "claude-haiku-4-5-20251001",
        mantle: "anthropic.claude-haiku-4-5"
    }, If1 = {
        firstParty: "claude-sonnet-4-20250514",
        bedrock: "us.anthropic.claude-sonnet-4-20250514-v1:0",
        vertex: "claude-sonnet-4@20250514",
        foundry: "claude-sonnet-4",
        anthropicAws: "claude-sonnet-4-20250514",
        mantle: null
    }, xf1 = {
        firstParty: "claude-sonnet-4-5-20250929",
        bedrock: "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
        vertex: "claude-sonnet-4-5@20250929",
        foundry: "claude-sonnet-4-5",
        anthropicAws: "claude-sonnet-4-5-20250929",
        mantle: null
    }, uf1 = {
        firstParty: "claude-sonnet-4-6",
        bedrock: "us.anthropic.claude-sonnet-4-6",
        vertex: "claude-sonnet-4-6",
        foundry: "claude-sonnet-4-6",
        anthropicAws: "claude-sonnet-4-6",
        mantle: null
    }, mf1 = {
        firstParty: "claude-opus-4-20250514",
        bedrock: "us.anthropic.claude-opus-4-20250514-v1:0",
        vertex: "claude-opus-4@20250514",
        foundry: "claude-opus-4",
        anthropicAws: "claude-opus-4-20250514",
        mantle: null
    }, Bf1 = {
        firstParty: "claude-opus-4-1-20250805",
        bedrock: "us.anthropic.claude-opus-4-1-20250805-v1:0",
        vertex: "claude-opus-4-1@20250805",
        foundry: "claude-opus-4-1",
        anthropicAws: "claude-opus-4-1-20250805",
        mantle: null
    }, pf1 = {
        firstParty: "claude-opus-4-5-20251101",
        bedrock: "us.anthropic.claude-opus-4-5-20251101-v1:0",
        vertex: "claude-opus-4-5@20251101",
        foundry: "claude-opus-4-5",
        anthropicAws: "claude-opus-4-5-20251101",
        mantle: null
    }, qZ8 = {
        firstParty: "claude-opus-4-6",
        bedrock: "us.anthropic.claude-opus-4-6-v1",
        vertex: "claude-opus-4-6",
        foundry: "claude-opus-4-6",
        anthropicAws: "claude-opus-4-6",
        mantle: null
    }, Ff1 = {
        firstParty: "claude-opus-4-7",
        bedrock: "us.anthropic.claude-opus-4-7",
        vertex: "claude-opus-4-7",
        foundry: "claude-opus-4-7",
        anthropicAws: "claude-opus-4-7",
        mantle: "anthropic.claude-opus-4-7"
    }, qA = {
        haiku35: Cf1,
        haiku45: bf1,
        sonnet35: Sf1,
        sonnet37: Rf1,
        sonnet40: If1,
        sonnet45: xf1,
        sonnet46: uf1,
        opus40: mf1,
        opus41: Bf1,
        opus45: pf1,
        opus46: qZ8,
        opus47: Ff1
    }, B2O = Object.values(qA).map((q) => q.firstParty), OMq = Object.fromEntries(Object.entries(qA).map(([q, K]) => [K.firstParty, q]))
})
// @from(Ln 102749, Col 0)
function pq() {
    return S6(process.env.CLAUDE_CODE_USE_BEDROCK) ? "bedrock" : S6(process.env.CLAUDE_CODE_USE_FOUNDRY) ? "foundry" : S6(process.env.CLAUDE_CODE_USE_ANTHROPIC_AWS) ? "anthropicAws" : S6(process.env.CLAUDE_CODE_USE_MANTLE) ? "mantle" : S6(process.env.CLAUDE_CODE_USE_VERTEX) ? "vertex" : "firstParty"
}
// @from(Ln 102753, Col 0)
function KB() {
    return pq()
}
// @from(Ln 102757, Col 0)
function KZ8() {
    if (pq() === "bedrock" && S6(process.env.CLAUDE_CODE_USE_MANTLE)) return "mantle";
    return null
}
// @from(Ln 102762, Col 0)
function yE9(q) {
    return q.startsWith("anthropic.") && !/-v\d+(:\d+)?$/.test(q)
}
// @from(Ln 102766, Col 0)
function YM(q) {
    if (q) {
        let K = KZ8();
        if (K) {
            if (K === "mantle" && yE9(q)) return K;
            let _ = pq(),
                z = wMq(q);
            if (z && z[_] === null && z[K] !== null) return K
        }
    }
    return pq()
}
// @from(Ln 102779, Col 0)
function KA(q = pq()) {
    return q === "firstParty" || q === "anthropicAws"
}
// @from(Ln 102783, Col 0)
function $Q(q = pq()) {
    return q === "firstParty" || q === "anthropicAws" || q === "foundry" || q === "mantle"
}
// @from(Ln 102787, Col 0)
function Aj() {
    let q = process.env.ANTHROPIC_BASE_URL;
    if (!q) return !0;
    try {
        let K = new URL(q).host;
        return ["api.anthropic.com"].includes(K)
    } catch {
        return !1
    }
}
// @from(Ln 102797, Col 4)
x9 = L(() => {
    Q8();
    i76()
})
// @from(Ln 102802, Col 0)
function _Z8(q) {
    let K = gf1.find((Y) => qA[Y][q] !== null),
        _ = q === "bedrock" ? eD8(oL()) : void 0,
        z = {};
    for (let Y of gf1) {
        let A = qA[Y][q] ?? (K ? qA[K][q] : qA[Y].firstParty);
        z[Y] = _ ? MT6(A, _) : A
    }
    return z
}
// @from(Ln 102812, Col 0)
async function LE9() {
    let q = _Z8("bedrock"),
        K;
    try {
        K = await Ul6()
    } catch (z) {
        return j6(z), q
    }
    if (!K?.length) return q;
    let _ = {};
    for (let z of gf1) {
        let Y = qA[z].firstParty;
        _[z] = l76(K, Y) || q[z]
    }
    return _
}
// @from(Ln 102829, Col 0)
function $Mq(q) {
    let K = v7().modelOverrides;
    if (!K) return q;
    let _ = {
        ...q
    };
    for (let [z, Y] of Object.entries(K)) {
        let A = OMq[z];
        if (A && Y) _[A] = Y
    }
    return _
}
// @from(Ln 102842, Col 0)
function zZ8(q) {
    let K;
    try {
        K = v7().modelOverrides
    } catch {
        return q
    }
    if (!K) return q;
    for (let [_, z] of Object.entries(K))
        if (z === q) return _;
    return q
}
// @from(Ln 102855, Col 0)
function hE9() {
    if (kD6() !== null) return;
    if (pq() !== "bedrock") {
        nB6(_Z8(pq()));
        return
    }
    jMq()
}
// @from(Ln 102864, Col 0)
function ZO() {
    let q = kD6();
    if (q === null) return hE9(), $Mq(_Z8(pq()));
    return $Mq(q)
}
// @from(Ln 102869, Col 0)
async function YZ8() {
    if (kD6() !== null) return;
    if (pq() !== "bedrock") {
        nB6(_Z8(pq()));
        return
    }
    await jMq()
}
// @from(Ln 102877, Col 4)
gf1
// @from(Ln 102877, Col 9)
jMq
// @from(Ln 102878, Col 4)
jQ = L(() => {
    y8();
    Q8();
    U8();
    a1();
    n76();
    i76();
    x9();
    gf1 = Object.keys(qA);
    jMq = y16(async () => {
        if (kD6() !== null) return;
        try {
            let q = await LE9();
            nB6(q)
        } catch (q) {
            j6(q)
        }
    })
})
// @from(Ln 102898, Col 0)
function AZ8() {
    if (S6(process.env.DISABLE_COST_WARNINGS)) return !1;
    if (i7()) return !1;
    let K = xb(),
        _ = FV() !== null;
    if (!K.hasToken && !_) return !1;
    let z = H8(),
        Y = z.oauthAccount?.organizationRole,
        A = z.oauthAccount?.workspaceRole;
    if (!Y || !A) return !1;
    return ["admin", "billing"].includes(Y) || ["workspace_admin", "workspace_billing"].includes(A)
}
// @from(Ln 102911, Col 0)
function Ib() {
    if (HMq !== null) return HMq;
    if (!i7()) return !1;
    let q = MK();
    if (q === "max" || q === "pro") return !0;
    let _ = H8().oauthAccount?.organizationRole;
    return !!_ && ["admin", "billing", "owner", "primary_owner"].includes(_)
}
// @from(Ln 102919, Col 4)
HMq = null
// @from(Ln 102920, Col 4)
HQ = L(() => {
    T7();
    h1();
    Q8()
})
// @from(Ln 102926, Col 0)
function XMq() {
    return null
}
// @from(Ln 102930, Col 0)
function MMq(q) {
    let K = XMq();
    if (!K) return q;
    let _ = new globalThis.Headers(q);
    return Object.entries(K).forEach(([z, Y]) => {
        if (Y !== void 0) _.set(z, Y)
    }), _
}
// @from(Ln 102939, Col 0)
function PT6() {
    return !1
}
// @from(Ln 102943, Col 0)
function PMq() {
    return null
}
// @from(Ln 102947, Col 0)
function WMq() {
    return null
}
// @from(Ln 102951, Col 0)
function DMq() {
    return Ql6 && JMq !== null && !1
}
// @from(Ln 102955, Col 0)
function ZMq() {
    return null
}
// @from(Ln 102958, Col 4)
RE9
// @from(Ln 102958, Col 9)
Ql6 = !1
// @from(Ln 102959, Col 4)
JMq = null
// @from(Ln 102960, Col 4)
SE9 = null
// @from(Ln 102961, Col 4)
CE9 = "max"
// @from(Ln 102962, Col 4)
bE9 = null
// @from(Ln 102963, Col 4)
dl6 = L(() => {
    HQ();
    RE9 = {}
})
// @from(Ln 102967, Col 0)
async function fMq() {
    let K = H8().oauthAccount?.accountUuid,
        _ = FV();
    if (!K || !_) return;
    let z = `${r7().BASE_API_URL}/api/claude_cli_profile`;
    try {
        return (await Z1.get(z, {
            headers: {
                "x-api-key": _,
                "anthropic-beta": eJ
            },
            params: {
                account_uuid: K
            },
            timeout: 1e4
        })).data
    } catch (Y) {
        j6(Y)
    }
}
// @from(Ln 102987, Col 0)
async function JQ(q) {
    let K = `${r7().BASE_API_URL}/api/oauth/profile`;
    try {
        return (await Z1.get(K, {
            headers: {
                Authorization: `Bearer ${q}`,
                "Content-Type": "application/json"
            },
            timeout: 1e4
        })).data
    } catch (_) {
        j6(_)
    }
}
// @from(Ln 103001, Col 4)
WT6 = L(() => {
    CK();
    z3();
    T7();
    h1();
    U8()
})
// @from(Ln 103008, Col 4)
ZT6 = {}
// @from(Ln 103024, Col 0)
function ub(q) {
    return Boolean(q?.includes(dC))
}
// @from(Ln 103028, Col 0)
function cl6(q) {
    return q?.split(" ").filter(Boolean) ?? []
}
// @from(Ln 103032, Col 0)
function OZ8({
    codeChallenge: q,
    state: K,
    port: _,
    isManual: z,
    loginWithClaudeAi: Y,
    inferenceOnly: A,
    orgUUID: O,
    loginHint: w,
    loginMethod: $
}) {
    let j = Y ? r7().CLAUDE_AI_AUTHORIZE_URL : r7().CONSOLE_AUTHORIZE_URL,
        H = new URL(j);
    H.searchParams.append("code", "true"), H.searchParams.append("client_id", r7().CLIENT_ID), H.searchParams.append("response_type", "code"), H.searchParams.append("redirect_uri", z ? r7().MANUAL_REDIRECT_URL : `http://localhost:${_}/callback`);
    let J = A ? [dC] : AY1;
    if (H.searchParams.append("scope", J.join(" ")), H.searchParams.append("code_challenge", q), H.searchParams.append("code_challenge_method", "S256"), H.searchParams.append("state", K), O) H.searchParams.append("orgUUID", O);
    if (w) H.searchParams.append("login_hint", w);
    if ($) H.searchParams.append("login_method", $);
    return H.toString()
}
// @from(Ln 103052, Col 0)
async function Uf1(q, K, _, z, Y = !1, A) {
    let O = {
        grant_type: "authorization_code",
        code: q,
        redirect_uri: Y ? r7().MANUAL_REDIRECT_URL : `http://localhost:${z}/callback`,
        client_id: r7().CLIENT_ID,
        code_verifier: _,
        state: K
    };
    if (A !== void 0) O.expires_in = A;
    let w = await Z1.post(r7().TOKEN_URL, O, {
        headers: {
            "Content-Type": "application/json"
        },
        timeout: 15000
    });
    if (w.status !== 200) throw Error(w.status === 401 ? "Authentication failed: Invalid authorization code" : `Token exchange failed (${w.status}): ${w.statusText}`);
    return d("tengu_oauth_token_exchange_success", {}), w.data
}
// @from(Ln 103071, Col 0)
async function ll6(q, {
    scopes: K
} = {}) {
    let _ = {
        grant_type: "refresh_token",
        refresh_token: q,
        client_id: r7().CLIENT_ID,
        scope: ((K?.length) ? K : dH8).join(" ")
    };
    try {
        let z = await Z1.post(r7().TOKEN_URL, _, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 15000
        });
        if (z.status !== 200) throw Error(`Token refresh failed: ${z.statusText}`);
        let Y = z.data,
            {
                access_token: A,
                refresh_token: O = q,
                expires_in: w
            } = Y,
            $ = Date.now() + w * 1000,
            j = cl6(Y.scope);
        d("tengu_oauth_token_refresh_success", {});
        let H = H8(),
            J = o7(),
            M = H.oauthAccount?.billingType !== void 0 && H.oauthAccount?.accountCreatedAt !== void 0 && H.oauthAccount?.subscriptionCreatedAt !== void 0 && J?.subscriptionType != null && J?.rateLimitTier != null ? null : await wZ8(A);
        if (M && H.oauthAccount) {
            let P = {};
            if (M.displayName !== void 0) P.displayName = M.displayName;
            if (typeof M.hasExtraUsageEnabled === "boolean") P.hasExtraUsageEnabled = M.hasExtraUsageEnabled;
            if (M.billingType !== null) P.billingType = M.billingType;
            if (M.accountCreatedAt !== void 0) P.accountCreatedAt = M.accountCreatedAt;
            if (M.subscriptionCreatedAt !== void 0) P.subscriptionCreatedAt = M.subscriptionCreatedAt;
            if (Object.keys(P).length > 0) d8((W) => ({
                ...W,
                oauthAccount: W.oauthAccount ? {
                    ...W.oauthAccount,
                    ...P
                } : W.oauthAccount
            }))
        }
        return {
            accessToken: A,
            refreshToken: O,
            expiresAt: $,
            scopes: j,
            subscriptionType: M?.subscriptionType ?? J?.subscriptionType ?? null,
            rateLimitTier: M?.rateLimitTier ?? J?.rateLimitTier ?? null,
            profile: M?.rawProfile,
            tokenAccount: Y.account ? {
                uuid: Y.account.uuid,
                emailAddress: Y.account.email_address,
                organizationUuid: Y.organization?.uuid
            } : void 0
        }
    } catch (z) {
        let Y = Z1.isAxiosError(z) && z.response?.data ? JSON.stringify(z.response.data) : void 0;
        throw d("tengu_oauth_token_refresh_failure", {
            error: b6(z),
            ...Y && {
                responseBody: Y
            }
        }), z
    }
}
// @from(Ln 103139, Col 0)
async function Qf1(q) {
    let K = await Z1.get(r7().ROLES_URL, {
        headers: {
            Authorization: `Bearer ${q}`
        }
    });
    if (K.status !== 200) throw Error(`Failed to fetch user roles: ${K.statusText}`);
    let _ = K.data;
    if (!H8().oauthAccount) throw Error("OAuth account information not found in config");
    d8((Y) => ({
        ...Y,
        oauthAccount: Y.oauthAccount ? {
            ...Y.oauthAccount,
            organizationRole: _.organization_role,
            workspaceRole: _.workspace_role,
            organizationName: _.organization_name
        } : Y.oauthAccount
    })), d("tengu_oauth_roles_stored", {
        org_role: _.organization_role
    })
}