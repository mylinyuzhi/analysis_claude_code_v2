
// @from(Ln 87556, Col 4)
XA8 = x((ptA) => {
    Object.defineProperty(ptA, "__esModule", {
        value: !0
    });
    ptA.resolveHttpAuthSchemeConfig = ptA.defaultBedrockHttpAuthSchemeProvider = ptA.defaultBedrockHttpAuthSchemeParametersProvider = void 0;
    var SW5 = Nw(),
        MA8 = w_(),
        DA8 = VW(),
        CW5 = async (A, q, K) => {
            return {
                operation: (0, DA8.getSmithyContext)(q).operation,
                region: await (0, DA8.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    ptA.defaultBedrockHttpAuthSchemeParametersProvider = CW5;

    function IW5(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "bedrock",
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

    function bW5(A) {
        return {
            schemeId: "smithy.api#httpBearerAuth",
            propertiesExtractor: ({
                profile: q,
                filepath: K,
                configFilepath: Y,
                ignoreCache: z
            }, _) => ({
                identityProperties: {
                    profile: q,
                    filepath: K,
                    configFilepath: Y,
                    ignoreCache: z
                }
            })
        }
    }
    var xW5 = (A) => {
        let q = [];
        switch (A.operation) {
            default:
                q.push(IW5(A)), q.push(bW5(A))
        }
        return q
    };
    ptA.defaultBedrockHttpAuthSchemeProvider = xW5;
    var uW5 = (A) => {
        let q = (0, MA8.memoizeIdentityProvider)(A.token, MA8.isIdentityExpired, MA8.doesIdentityRequireRefresh),
            K = (0, SW5.resolveAwsSdkSigV4Config)(A);
        return Object.assign(K, {
            authSchemePreference: (0, DA8.normalizeProvider)(A.authSchemePreference ?? []),
            token: q
        })
    };
    ptA.resolveHttpAuthSchemeConfig = uW5
})
// @from(Ln 87627, Col 4)
UtA = x((LM_, gW5) => {
    gW5.exports = {
        name: "@aws-sdk/client-bedrock",
        description: "AWS SDK for JavaScript Bedrock Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-bedrock",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo bedrock"
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
            "@aws-sdk/token-providers": "3.936.0",
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
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-bedrock",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-bedrock"
        }
    }
})
// @from(Ln 87725, Col 4)
dtA = x((pW5) => {
    var FW5 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    pW5.isArrayBuffer = FW5
})
// @from(Ln 87729, Col 4)
WA8 = x((lW5) => {
    var UW5 = dtA(),
        PA8 = x6("buffer"),
        dW5 = (A, q = 0, K = A.byteLength - q) => {
            if (!UW5.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return PA8.Buffer.from(A, q, K)
        },
        cW5 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? PA8.Buffer.from(A, q) : PA8.Buffer.from(A)
        };
    lW5.fromArrayBuffer = dW5;
    lW5.fromString = cW5
})
// @from(Ln 87743, Col 4)
itA = x((ctA) => {
    Object.defineProperty(ctA, "__esModule", {
        value: !0
    });
    ctA.fromBase64 = void 0;
    var rW5 = WA8(),
        oW5 = /^[A-Za-z0-9+/]*={0,2}$/,
        aW5 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!oW5.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, rW5.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    ctA.fromBase64 = aW5
})
// @from(Ln 87758, Col 4)
otA = x((ntA) => {
    Object.defineProperty(ntA, "__esModule", {
        value: !0
    });
    ntA.toBase64 = void 0;
    var sW5 = WA8(),
        tW5 = C_(),
        eW5 = (A) => {
            let q;
            if (typeof A === "string") q = (0, tW5.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, sW5.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    ntA.toBase64 = eW5
})
// @from(Ln 87774, Col 4)
ttA = x((US6) => {
    var atA = itA(),
        stA = otA();
    Object.keys(atA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(US6, A)) Object.defineProperty(US6, A, {
            enumerable: !0,
            get: function() {
                return atA[A]
            }
        })
    });
    Object.keys(stA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(US6, A)) Object.defineProperty(US6, A, {
            enumerable: !0,
            get: function() {
                return stA[A]
            }
        })
    })
})
// @from(Ln 87794, Col 4)
XeA = x((MeA) => {
    Object.defineProperty(MeA, "__esModule", {
        value: !0
    });
    MeA.ruleSet = void 0;
    var HeA = "required",
        Eu = "fn",
        yu = "argv",
        cj6 = "ref",
        etA = !0,
        AeA = "isSet",
        cS6 = "booleanEquals",
        dj6 = "error",
        dS6 = "endpoint",
        vG = "tree",
        ZA8 = "PartitionResult",
        qeA = {
            [HeA]: !1,
            type: "string"
        },
        KeA = {
            [HeA]: !0,
            default: !1,
            type: "boolean"
        },
        YeA = {
            [cj6]: "Endpoint"
        },
        jeA = {
            [Eu]: cS6,
            [yu]: [{
                [cj6]: "UseFIPS"
            }, !0]
        },
        JeA = {
            [Eu]: cS6,
            [yu]: [{
                [cj6]: "UseDualStack"
            }, !0]
        },
        ku = {},
        zeA = {
            [Eu]: "getAttr",
            [yu]: [{
                [cj6]: ZA8
            }, "supportsFIPS"]
        },
        _eA = {
            [Eu]: cS6,
            [yu]: [!0, {
                [Eu]: "getAttr",
                [yu]: [{
                    [cj6]: ZA8
                }, "supportsDualStack"]
            }]
        },
        weA = [jeA],
        OeA = [JeA],
        $eA = [{
            [cj6]: "Region"
        }],
        AZ5 = {
            version: "1.0",
            parameters: {
                Region: qeA,
                UseDualStack: KeA,
                UseFIPS: KeA,
                Endpoint: qeA
            },
            rules: [{
                conditions: [{
                    [Eu]: AeA,
                    [yu]: [YeA]
                }],
                rules: [{
                    conditions: weA,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: dj6
                }, {
                    rules: [{
                        conditions: OeA,
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: dj6
                    }, {
                        endpoint: {
                            url: YeA,
                            properties: ku,
                            headers: ku
                        },
                        type: dS6
                    }],
                    type: vG
                }],
                type: vG
            }, {
                rules: [{
                    conditions: [{
                        [Eu]: AeA,
                        [yu]: $eA
                    }],
                    rules: [{
                        conditions: [{
                            [Eu]: "aws.partition",
                            [yu]: $eA,
                            assign: ZA8
                        }],
                        rules: [{
                            conditions: [jeA, JeA],
                            rules: [{
                                conditions: [{
                                    [Eu]: cS6,
                                    [yu]: [etA, zeA]
                                }, _eA],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: ku,
                                            headers: ku
                                        },
                                        type: dS6
                                    }],
                                    type: vG
                                }],
                                type: vG
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: dj6
                            }],
                            type: vG
                        }, {
                            conditions: weA,
                            rules: [{
                                conditions: [{
                                    [Eu]: cS6,
                                    [yu]: [zeA, etA]
                                }],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-fips.{Region}.{PartitionResult#dnsSuffix}",
                                            properties: ku,
                                            headers: ku
                                        },
                                        type: dS6
                                    }],
                                    type: vG
                                }],
                                type: vG
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: dj6
                            }],
                            type: vG
                        }, {
                            conditions: OeA,
                            rules: [{
                                conditions: [_eA],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: ku,
                                            headers: ku
                                        },
                                        type: dS6
                                    }],
                                    type: vG
                                }],
                                type: vG
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: dj6
                            }],
                            type: vG
                        }, {
                            rules: [{
                                endpoint: {
                                    url: "https://bedrock.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: ku,
                                    headers: ku
                                },
                                type: dS6
                            }],
                            type: vG
                        }],
                        type: vG
                    }],
                    type: vG
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: dj6
                }],
                type: vG
            }]
        };
    MeA.ruleSet = AZ5
})
// @from(Ln 87992, Col 4)
ZeA = x((PeA) => {
    Object.defineProperty(PeA, "__esModule", {
        value: !0
    });
    PeA.defaultEndpointResolver = void 0;
    var qZ5 = Zu(),
        GA8 = nS(),
        KZ5 = XeA(),
        YZ5 = new GA8.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        zZ5 = (A, q = {}) => {
            return YZ5.get(A, () => (0, GA8.resolveEndpoint)(KZ5.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    PeA.defaultEndpointResolver = zZ5;
    GA8.customEndpointFunctions.aws = qZ5.awsEndpointFunctions
})
// @from(Ln 88013, Col 4)
NeA = x((TeA) => {
    Object.defineProperty(TeA, "__esModule", {
        value: !0
    });
    TeA.getRuntimeConfig = void 0;
    var _Z5 = Nw(),
        wZ5 = RQ(),
        OZ5 = w_(),
        $Z5 = QS6(),
        HZ5 = hy(),
        GeA = ttA(),
        feA = C_(),
        jZ5 = XA8(),
        JZ5 = ZeA(),
        MZ5 = (A) => {
            return {
                apiVersion: "2023-04-20",
                base64Decoder: A?.base64Decoder ?? GeA.fromBase64,
                base64Encoder: A?.base64Encoder ?? GeA.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? JZ5.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? jZ5.defaultBedrockHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new _Z5.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#httpBearerAuth"),
                    signer: new OZ5.HttpBearerAuthSigner
                }],
                logger: A?.logger ?? new $Z5.NoOpLogger,
                protocol: A?.protocol ?? new wZ5.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.bedrock"
                }),
                serviceId: A?.serviceId ?? "Bedrock",
                urlParser: A?.urlParser ?? HZ5.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? feA.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? feA.toUtf8
            }
        };
    TeA.getRuntimeConfig = MZ5
})
// @from(Ln 88057, Col 4)
heA = x((LeA) => {
    Object.defineProperty(LeA, "__esModule", {
        value: !0
    });
    LeA.getRuntimeConfig = void 0;
    var DZ5 = _2(),
        XZ5 = DZ5.__importDefault(UtA()),
        fA8 = Nw(),
        PZ5 = P46(),
        VeA = qK1(),
        keA = kQ(),
        gK1 = Nj(),
        WZ5 = w_(),
        ZZ5 = EQ(),
        EeA = kP(),
        Z46 = BT(),
        yeA = uT(),
        GZ5 = yQ(),
        fZ5 = Tu(),
        TZ5 = NeA(),
        vZ5 = QS6(),
        NZ5 = SQ(),
        VZ5 = QS6(),
        kZ5 = (A) => {
            (0, VZ5.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, NZ5.resolveDefaultsModeConfig)(A),
                K = () => q().then(vZ5.loadConfigsForDefaultMode),
                Y = (0, TZ5.getRuntimeConfig)(A);
            (0, fA8.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger,
                signingName: "bedrock"
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, Z46.loadConfig)(fA8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? GZ5.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? PZ5.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, keA.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: XZ5.default.version
                }),
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (_) => _.getIdentityProvider("aws.auth#sigv4"),
                    signer: new fA8.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (_) => _.getIdentityProvider("smithy.api#httpBearerAuth") || (async (w) => {
                        try {
                            return await (0, VeA.fromEnvSigningName)({
                                signingName: "bedrock"
                            })()
                        } catch (O) {
                            return await (0, VeA.nodeProvider)(w)(w)
                        }
                    }),
                    signer: new WZ5.HttpBearerAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, Z46.loadConfig)(EeA.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, Z46.loadConfig)(gK1.NODE_REGION_CONFIG_OPTIONS, {
                    ...gK1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: yeA.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, Z46.loadConfig)({
                    ...EeA.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || fZ5.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? ZZ5.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? yeA.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, Z46.loadConfig)(gK1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, Z46.loadConfig)(gK1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, Z46.loadConfig)(keA.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    LeA.getRuntimeConfig = kZ5
})
// @from(Ln 88139, Col 4)
beA = x((SZ5) => {
    var EZ5 = _A8(),
        yZ5 = (A) => {
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
        LZ5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class SeA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = EZ5.FieldPosition.HEADER,
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
    class CeA {
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
    class FK1 {
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
            let q = new FK1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = RZ5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return FK1.clone(this)
        }
    }

    function RZ5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class IeA {
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

    function hZ5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    SZ5.Field = SeA;
    SZ5.Fields = CeA;
    SZ5.HttpRequest = FK1;
    SZ5.HttpResponse = IeA;
    SZ5.getHttpHandlerExtensionConfiguration = yZ5;
    SZ5.isValidHostname = hZ5;
    SZ5.resolveHttpHandlerRuntimeConfig = LZ5
})