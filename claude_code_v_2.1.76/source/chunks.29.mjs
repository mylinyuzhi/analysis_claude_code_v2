
// @from(Ln 70763, Col 4)
ZUA = x((b65) => {
    var rt1 = Xq1(),
        dr = w_(),
        OUA = vJ(),
        k65 = mT(),
        $UA = nt1(),
        HUA = (A) => rt1.HttpResponse.isInstance(A) ? A.headers?.date ?? A.headers?.Date : void 0,
        ot1 = (A) => new Date(Date.now() + A),
        E65 = (A, q) => Math.abs(ot1(q).getTime() - A) >= 300000,
        jUA = (A, q) => {
            let K = Date.parse(A);
            if (E65(K, q)) return K - Date.now();
            return q
        },
        KS6 = (A, q) => {
            if (!q) throw Error(`Property \`${A}\` is not resolved for AWS SDK SigV4Auth`);
            return q
        },
        at1 = async (A) => {
            let q = KS6("context", A.context),
                K = KS6("config", A.config),
                Y = q.endpointV2?.properties?.authSchemes?.[0],
                _ = await KS6("signer", K.signer)(Y),
                w = A?.signingRegion,
                O = A?.signingRegionSet,
                $ = A?.signingName;
            return {
                config: K,
                signer: _,
                signingRegion: w,
                signingRegionSet: O,
                signingName: $
            }
        };
    class Vq1 {
        async sign(A, q, K) {
            if (!rt1.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let Y = await at1(K),
                {
                    config: z,
                    signer: _
                } = Y,
                {
                    signingRegion: w,
                    signingName: O
                } = Y,
                $ = K.context;
            if ($?.authSchemes?.length ?? !1) {
                let [j, J] = $.authSchemes;
                if (j?.name === "sigv4a" && J?.name === "sigv4") w = J?.signingRegion ?? w, O = J?.signingName ?? O
            }
            return await _.sign(A, {
                signingDate: ot1(z.systemClockOffset),
                signingRegion: w,
                signingService: O
            })
        }
        errorHandler(A) {
            return (q) => {
                let K = q.ServerTime ?? HUA(q.$response);
                if (K) {
                    let Y = KS6("config", A.config),
                        z = Y.systemClockOffset;
                    if (Y.systemClockOffset = jUA(K, Y.systemClockOffset), Y.systemClockOffset !== z && q.$metadata) q.$metadata.clockSkewCorrected = !0
                }
                throw q
            }
        }
        successHandler(A, q) {
            let K = HUA(A);
            if (K) {
                let Y = KS6("config", q.config);
                Y.systemClockOffset = jUA(K, Y.systemClockOffset)
            }
        }
    }
    var y65 = Vq1;
    class XUA extends Vq1 {
        async sign(A, q, K) {
            if (!rt1.HttpRequest.isInstance(A)) throw Error("The request is not an instance of `HttpRequest` and cannot be signed");
            let {
                config: Y,
                signer: z,
                signingRegion: _,
                signingRegionSet: w,
                signingName: O
            } = await at1(K), H = (await Y.sigv4aSigningRegionSet?.() ?? w ?? [_]).join(",");
            return await z.sign(A, {
                signingDate: ot1(Y.systemClockOffset),
                signingRegion: H,
                signingService: O
            })
        }
    }
    var JUA = (A) => typeof A === "string" && A.length > 0 ? A.split(",").map((q) => q.trim()) : [],
        PUA = (A) => `AWS_BEARER_TOKEN_${A.replace(/[\s-]/g,"_").toUpperCase()}`,
        MUA = "AWS_AUTH_SCHEME_PREFERENCE",
        DUA = "auth_scheme_preference",
        L65 = {
            environmentVariableSelector: (A, q) => {
                if (q?.signingName) {
                    if (PUA(q.signingName) in A) return ["httpBearerAuth"]
                }
                if (!(MUA in A)) return;
                return JUA(A[MUA])
            },
            configFileSelector: (A) => {
                if (!(DUA in A)) return;
                return JUA(A[DUA])
            },
            default: []
        },
        R65 = (A) => {
            return A.sigv4aSigningRegionSet = dr.normalizeProvider(A.sigv4aSigningRegionSet), A
        },
        h65 = {
            environmentVariableSelector(A) {
                if (A.AWS_SIGV4A_SIGNING_REGION_SET) return A.AWS_SIGV4A_SIGNING_REGION_SET.split(",").map((q) => q.trim());
                throw new OUA.ProviderError("AWS_SIGV4A_SIGNING_REGION_SET not set in env.", {
                    tryNextLink: !0
                })
            },
            configFileSelector(A) {
                if (A.sigv4a_signing_region_set) return (A.sigv4a_signing_region_set ?? "").split(",").map((q) => q.trim());
                throw new OUA.ProviderError("sigv4a_signing_region_set not set in profile.", {
                    tryNextLink: !0
                })
            },
            default: void 0
        },
        WUA = (A) => {
            let q = A.credentials,
                K = !!A.credentials,
                Y = void 0;
            Object.defineProperty(A, "credentials", {
                set(H) {
                    if (H && H !== q && H !== Y) K = !0;
                    q = H;
                    let j = C65(A, {
                            credentials: q,
                            credentialDefaultProvider: A.credentialDefaultProvider
                        }),
                        J = I65(A, j);
                    if (K && !J.attributed) Y = async (M) => J(M).then((D) => k65.setCredentialFeature(D, "CREDENTIALS_CODE", "e")), Y.memoized = J.memoized, Y.configBound = J.configBound, Y.attributed = !0;
                    else Y = J
                },
                get() {
                    return Y
                },
                enumerable: !0,
                configurable: !0
            }), A.credentials = q;
            let {
                signingEscapePath: z = !0,
                systemClockOffset: _ = A.systemClockOffset || 0,
                sha256: w
            } = A, O;
            if (A.signer) O = dr.normalizeProvider(A.signer);
            else if (A.regionInfoProvider) O = () => dr.normalizeProvider(A.region)().then(async (H) => [await A.regionInfoProvider(H, {
                useFipsEndpoint: await A.useFipsEndpoint(),
                useDualstackEndpoint: await A.useDualstackEndpoint()
            }) || {}, H]).then(([H, j]) => {
                let {
                    signingRegion: J,
                    signingService: M
                } = H;
                A.signingRegion = A.signingRegion || J || j, A.signingName = A.signingName || M || A.serviceId;
                let D = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: w,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || $UA.SignatureV4)(D)
            });
            else O = async (H) => {
                H = Object.assign({}, {
                    name: "sigv4",
                    signingName: A.signingName || A.defaultSigningName,
                    signingRegion: await dr.normalizeProvider(A.region)(),
                    properties: {}
                }, H);
                let {
                    signingRegion: j,
                    signingName: J
                } = H;
                A.signingRegion = A.signingRegion || j, A.signingName = A.signingName || J || A.serviceId;
                let M = {
                    ...A,
                    credentials: A.credentials,
                    region: A.signingRegion,
                    service: A.signingName,
                    sha256: w,
                    uriEscapePath: z
                };
                return new(A.signerConstructor || $UA.SignatureV4)(M)
            };
            return Object.assign(A, {
                systemClockOffset: _,
                signingEscapePath: z,
                signer: O
            })
        },
        S65 = WUA;

    function C65(A, {
        credentials: q,
        credentialDefaultProvider: K
    }) {
        let Y;
        if (q)
            if (!q?.memoized) Y = dr.memoizeIdentityProvider(q, dr.isIdentityExpired, dr.doesIdentityRequireRefresh);
            else Y = q;
        else if (K) Y = dr.normalizeProvider(K(Object.assign({}, A, {
            parentClientConfig: A
        })));
        else Y = async () => {
            throw Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.")
        };
        return Y.memoized = !0, Y
    }

    function I65(A, q) {
        if (q.configBound) return q;
        let K = async (Y) => q({
            ...Y,
            callerClientConfig: A
        });
        return K.memoized = q.memoized, K.configBound = !0, K
    }
    b65.AWSSDKSigV4Signer = y65;
    b65.AwsSdkSigV4ASigner = XUA;
    b65.AwsSdkSigV4Signer = Vq1;
    b65.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = L65;
    b65.NODE_SIGV4A_CONFIG_OPTIONS = h65;
    b65.getBearerTokenEnvKey = PUA;
    b65.resolveAWSSDKSigV4Config = S65;
    b65.resolveAwsSdkSigV4AConfig = R65;
    b65.resolveAwsSdkSigV4Config = WUA;
    b65.validateSigningProperties = at1
})
// @from(Ln 71006, Col 4)
GUA = x((o65) => {
    o65.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(o65.HttpAuthLocation || (o65.HttpAuthLocation = {}));
    o65.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(o65.HttpApiKeyAuthLocation || (o65.HttpApiKeyAuthLocation = {}));
    o65.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(o65.EndpointURLScheme || (o65.EndpointURLScheme = {}));
    o65.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(o65.AlgorithmId || (o65.AlgorithmId = {}));
    var c65 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => o65.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => o65.AlgorithmId.MD5,
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
        l65 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        i65 = (A) => {
            return c65(A)
        },
        n65 = (A) => {
            return l65(A)
        };
    o65.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(o65.FieldPosition || (o65.FieldPosition = {}));
    var r65 = "__smithy_context";
    o65.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(o65.IniSectionType || (o65.IniSectionType = {}));
    o65.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(o65.RequestHandlerProtocol || (o65.RequestHandlerProtocol = {}));
    o65.SMITHY_CONTEXT_KEY = r65;
    o65.getDefaultClientConfiguration = i65;
    o65.resolveDefaultRuntimeConfig = n65
})
// @from(Ln 71071, Col 4)
NUA = x((z15) => {
    var e65 = GUA(),
        A15 = (A) => {
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
        q15 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class fUA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = e65.FieldPosition.HEADER,
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
    class TUA {
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
    class kq1 {
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
            let q = new kq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = K15(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return kq1.clone(this)
        }
    }

    function K15(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class vUA {
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

    function Y15(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    z15.Field = fUA;
    z15.Fields = TUA;
    z15.HttpRequest = kq1;
    z15.HttpResponse = vUA;
    z15.getHttpHandlerExtensionConfiguration = A15;
    z15.isValidHostname = Y15;
    z15.resolveHttpHandlerRuntimeConfig = q15
})
// @from(Ln 71213, Col 4)
PQ = x((P15) => {
    var M15 = NUA();

    function D15(A) {
        return A
    }
    var VUA = (A) => (q) => async (K) => {
        if (!M15.HttpRequest.isInstance(K.request)) return q(K);
        let {
            request: Y
        } = K, {
            handlerProtocol: z = ""
        } = A.requestHandler.metadata || {};
        if (z.indexOf("h2") >= 0 && !Y.headers[":authority"]) delete Y.headers.host, Y.headers[":authority"] = Y.hostname + (Y.port ? ":" + Y.port : "");
        else if (!Y.headers.host) {
            let _ = Y.hostname;
            if (Y.port != null) _ += `:${Y.port}`;
            Y.headers.host = _
        }
        return q(K)
    }, kUA = {
        name: "hostHeaderMiddleware",
        step: "build",
        priority: "low",
        tags: ["HOST"],
        override: !0
    }, X15 = (A) => ({
        applyToStack: (q) => {
            q.add(VUA(A), kUA)
        }
    });
    P15.getHostHeaderPlugin = X15;
    P15.hostHeaderMiddleware = VUA;
    P15.hostHeaderMiddlewareOptions = kUA;
    P15.resolveHostHeaderConfig = D15
})
// @from(Ln 71249, Col 4)
WQ = x((v15) => {
    var EUA = () => (A, q) => async (K) => {
        try {
            let Y = await A(K),
                {
                    clientName: z,
                    commandName: _,
                    logger: w,
                    dynamoDbDocumentClientOptions: O = {}
                } = q,
                {
                    overrideInputFilterSensitiveLog: $,
                    overrideOutputFilterSensitiveLog: H
                } = O,
                j = $ ?? q.inputFilterSensitiveLog,
                J = H ?? q.outputFilterSensitiveLog,
                {
                    $metadata: M,
                    ...D
                } = Y.output;
            return w?.info?.({
                clientName: z,
                commandName: _,
                input: j(K.input),
                output: J(D),
                metadata: M
            }), Y
        } catch (Y) {
            let {
                clientName: z,
                commandName: _,
                logger: w,
                dynamoDbDocumentClientOptions: O = {}
            } = q, {
                overrideInputFilterSensitiveLog: $
            } = O, H = $ ?? q.inputFilterSensitiveLog;
            throw w?.error?.({
                clientName: z,
                commandName: _,
                input: H(K.input),
                error: Y,
                metadata: Y.$metadata
            }), Y
        }
    }, yUA = {
        name: "loggerMiddleware",
        tags: ["LOGGER"],
        step: "initialize",
        override: !0
    }, T15 = (A) => ({
        applyToStack: (q) => {
            q.add(EUA(), yUA)
        }
    });
    v15.getLoggerPlugin = T15;
    v15.loggerMiddleware = EUA;
    v15.loggerMiddlewareOptions = yUA
})
// @from(Ln 71307, Col 4)
RUA = x((E15) => {
    var zS6 = {
            REQUEST_ID: Symbol.for("_AWS_LAMBDA_REQUEST_ID"),
            X_RAY_TRACE_ID: Symbol.for("_AWS_LAMBDA_X_RAY_TRACE_ID"),
            TENANT_ID: Symbol.for("_AWS_LAMBDA_TENANT_ID")
        },
        Ye1 = ["true", "1"].includes(process.env?.AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA ?? "");
    if (!Ye1) globalThis.awslambda = globalThis.awslambda || {};
    class Eq1 {
        static PROTECTED_KEYS = zS6;
        isProtectedKey(A) {
            return Object.values(zS6).includes(A)
        }
        getRequestId() {
            return this.get(zS6.REQUEST_ID) ?? "-"
        }
        getXRayTraceId() {
            return this.get(zS6.X_RAY_TRACE_ID)
        }
        getTenantId() {
            return this.get(zS6.TENANT_ID)
        }
    }
    class LUA extends Eq1 {
        currentContext;
        getContext() {
            return this.currentContext
        }
        hasContext() {
            return this.currentContext !== void 0
        }
        get(A) {
            return this.currentContext?.[A]
        }
        set(A, q) {
            if (this.isProtectedKey(A)) throw Error(`Cannot modify protected Lambda context field: ${String(A)}`);
            this.currentContext = this.currentContext || {}, this.currentContext[A] = q
        }
        run(A, q) {
            this.currentContext = A;
            try {
                return q()
            } finally {
                this.currentContext = void 0
            }
        }
    }
    class _e1 extends Eq1 {
        als;
        static async create() {
            let A = new _e1,
                q = await import("node:async_hooks");
            return A.als = new q.AsyncLocalStorage, A
        }
        getContext() {
            return this.als.getStore()
        }
        hasContext() {
            return this.als.getStore() !== void 0
        }
        get(A) {
            return this.als.getStore()?.[A]
        }
        set(A, q) {
            if (this.isProtectedKey(A)) throw Error(`Cannot modify protected Lambda context field: ${String(A)}`);
            let K = this.als.getStore();
            if (!K) throw Error("No context available");
            K[A] = q
        }
        run(A, q) {
            return this.als.run(A, q)
        }
    }
    E15.InvokeStore = void 0;
    (function(A) {
        let q = null;
        async function K() {
            if (!q) q = (async () => {
                let z = "AWS_LAMBDA_MAX_CONCURRENCY" in process.env ? await _e1.create() : new LUA;
                if (!Ye1 && globalThis.awslambda?.InvokeStore) return globalThis.awslambda.InvokeStore;
                else if (!Ye1 && globalThis.awslambda) return globalThis.awslambda.InvokeStore = z, z;
                else return z
            })();
            return q
        }
        A.getInstanceAsync = K, A._testing = process.env.AWS_LAMBDA_BENCHMARK_MODE === "1" ? {
            reset: () => {
                if (q = null, globalThis.awslambda?.InvokeStore) delete globalThis.awslambda.InvokeStore;
                globalThis.awslambda = {}
            }
        } : void 0
    })(E15.InvokeStore || (E15.InvokeStore = {}));
    E15.InvokeStoreBase = Eq1
})
// @from(Ln 71401, Col 4)
hUA = x((I15) => {
    I15.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(I15.HttpAuthLocation || (I15.HttpAuthLocation = {}));
    I15.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(I15.HttpApiKeyAuthLocation || (I15.HttpApiKeyAuthLocation = {}));
    I15.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(I15.EndpointURLScheme || (I15.EndpointURLScheme = {}));
    I15.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(I15.AlgorithmId || (I15.AlgorithmId = {}));
    var L15 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => I15.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => I15.AlgorithmId.MD5,
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
        R15 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        h15 = (A) => {
            return L15(A)
        },
        S15 = (A) => {
            return R15(A)
        };
    I15.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(I15.FieldPosition || (I15.FieldPosition = {}));
    var C15 = "__smithy_context";
    I15.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(I15.IniSectionType || (I15.IniSectionType = {}));
    I15.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(I15.RequestHandlerProtocol || (I15.RequestHandlerProtocol = {}));
    I15.SMITHY_CONTEXT_KEY = C15;
    I15.getDefaultClientConfiguration = h15;
    I15.resolveDefaultRuntimeConfig = S15
})
// @from(Ln 71466, Col 4)
bUA = x((Q15) => {
    var m15 = hUA(),
        B15 = (A) => {
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
        g15 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class SUA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = m15.FieldPosition.HEADER,
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
    class CUA {
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
    class yq1 {
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
            let q = new yq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = F15(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return yq1.clone(this)
        }
    }

    function F15(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class IUA {
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

    function p15(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    Q15.Field = SUA;
    Q15.Fields = CUA;
    Q15.HttpRequest = yq1;
    Q15.HttpResponse = IUA;
    Q15.getHttpHandlerExtensionConfiguration = B15;
    Q15.isValidHostname = p15;
    Q15.resolveHttpHandlerRuntimeConfig = g15
})
// @from(Ln 71608, Col 4)
mUA = x((xUA) => {
    Object.defineProperty(xUA, "__esModule", {
        value: !0
    });
    xUA.recursionDetectionMiddleware = void 0;
    var o15 = RUA(),
        a15 = bUA(),
        Me1 = "X-Amzn-Trace-Id",
        s15 = "AWS_LAMBDA_FUNCTION_NAME",
        t15 = "_X_AMZN_TRACE_ID",
        e15 = () => (A) => async (q) => {
            let {
                request: K
            } = q;
            if (!a15.HttpRequest.isInstance(K)) return A(q);
            let Y = Object.keys(K.headers ?? {}).find((j) => j.toLowerCase() === Me1.toLowerCase()) ?? Me1;
            if (K.headers.hasOwnProperty(Y)) return A(q);
            let z = process.env[s15],
                _ = process.env[t15],
                $ = (await o15.InvokeStore.getInstanceAsync())?.getXRayTraceId() ?? _,
                H = (j) => typeof j === "string" && j.length > 0;
            if (H(z) && H($)) K.headers[Me1] = $;
            return A({
                ...q,
                request: K
            })
        };
    xUA.recursionDetectionMiddleware = e15
})
// @from(Ln 71637, Col 4)
ZQ = x((Xe1) => {
    var De1 = mUA(),
        A85 = {
            step: "build",
            tags: ["RECURSION_DETECTION"],
            name: "recursionDetectionMiddleware",
            override: !0,
            priority: "low"
        },
        q85 = (A) => ({
            applyToStack: (q) => {
                q.add(De1.recursionDetectionMiddleware(), A85)
            }
        });
    Xe1.getRecursionDetectionPlugin = q85;
    Object.keys(De1).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Xe1, A)) Object.defineProperty(Xe1, A, {
            enumerable: !0,
            get: function() {
                return De1[A]
            }
        })
    })
})
// @from(Ln 71661, Col 4)
BUA = x(($85) => {
    $85.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })($85.HttpAuthLocation || ($85.HttpAuthLocation = {}));
    $85.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })($85.HttpApiKeyAuthLocation || ($85.HttpApiKeyAuthLocation = {}));
    $85.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })($85.EndpointURLScheme || ($85.EndpointURLScheme = {}));
    $85.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })($85.AlgorithmId || ($85.AlgorithmId = {}));
    var Y85 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => $85.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => $85.AlgorithmId.MD5,
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
        z85 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        _85 = (A) => {
            return Y85(A)
        },
        w85 = (A) => {
            return z85(A)
        };
    $85.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })($85.FieldPosition || ($85.FieldPosition = {}));
    var O85 = "__smithy_context";
    $85.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })($85.IniSectionType || ($85.IniSectionType = {}));
    $85.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })($85.RequestHandlerProtocol || ($85.RequestHandlerProtocol = {}));
    $85.SMITHY_CONTEXT_KEY = O85;
    $85.getDefaultClientConfiguration = _85;
    $85.resolveDefaultRuntimeConfig = w85
})
// @from(Ln 71726, Col 4)
nS = x((C85) => {
    var Ne1 = BUA();
    class gUA {
        capacity;
        data = new Map;
        parameters = [];
        constructor({
            size: A,
            params: q
        }) {
            if (this.capacity = A ?? 50, q) this.parameters = q
        }
        get(A, q) {
            let K = this.hash(A);
            if (K === !1) return q();
            if (!this.data.has(K)) {
                if (this.data.size > this.capacity + 10) {
                    let Y = this.data.keys(),
                        z = 0;
                    while (!0) {
                        let {
                            value: _,
                            done: w
                        } = Y.next();
                        if (this.data.delete(_), w || ++z > 10) break
                    }
                }
                this.data.set(K, q())
            }
            return this.data.get(K)
        }
        size() {
            return this.data.size
        }
        hash(A) {
            let q = "",
                {
                    parameters: K
                } = this;
            if (K.length === 0) return !1;
            for (let Y of K) {
                let z = String(A[Y] ?? "");
                if (z.includes("|;")) return !1;
                q += z + "|;"
            }
            return q
        }
    }
    var M85 = new RegExp("^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$"),
        FUA = (A) => M85.test(A) || A.startsWith("[") && A.endsWith("]"),
        D85 = new RegExp("^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$"),
        ke1 = (A, q = !1) => {
            if (!q) return D85.test(A);
            let K = A.split(".");
            for (let Y of K)
                if (!ke1(Y)) return !1;
            return !0
        },
        Ve1 = {},
        OS6 = "endpoints";

    function cr(A) {
        if (typeof A !== "object" || A == null) return A;
        if ("ref" in A) return `$${cr(A.ref)}`;
        if ("fn" in A) return `${A.fn}(${(A.argv||[]).map(cr).join(", ")})`;
        return JSON.stringify(A, null, 2)
    }
    class GG extends Error {
        constructor(A) {
            super(A);
            this.name = "EndpointError"
        }
    }
    var X85 = (A, q) => A === q,
        P85 = (A) => {
            let q = A.split("."),
                K = [];
            for (let Y of q) {
                let z = Y.indexOf("[");
                if (z !== -1) {
                    if (Y.indexOf("]") !== Y.length - 1) throw new GG(`Path: '${A}' does not end with ']'`);
                    let _ = Y.slice(z + 1, -1);
                    if (Number.isNaN(parseInt(_))) throw new GG(`Invalid array index: '${_}' in path: '${A}'`);
                    if (z !== 0) K.push(Y.slice(0, z));
                    K.push(_)
                } else K.push(Y)
            }
            return K
        },
        pUA = (A, q) => P85(q).reduce((K, Y) => {
            if (typeof K !== "object") throw new GG(`Index '${Y}' in '${q}' not found in '${JSON.stringify(A)}'`);
            else if (Array.isArray(K)) return K[parseInt(Y)];
            return K[Y]
        }, A),
        W85 = (A) => A != null,
        Z85 = (A) => !A,
        ve1 = {
            [Ne1.EndpointURLScheme.HTTP]: 80,
            [Ne1.EndpointURLScheme.HTTPS]: 443
        },
        G85 = (A) => {
            let q = (() => {
                try {
                    if (A instanceof URL) return A;
                    if (typeof A === "object" && "hostname" in A) {
                        let {
                            hostname: M,
                            port: D,
                            protocol: X = "",
                            path: P = "",
                            query: W = {}
                        } = A, Z = new URL(`${X}//${M}${D?`:${D}`:""}${P}`);
                        return Z.search = Object.entries(W).map(([G, f]) => `${G}=${f}`).join("&"), Z
                    }
                    return new URL(A)
                } catch (M) {
                    return null
                }
            })();
            if (!q) return console.error(`Unable to parse ${JSON.stringify(A)} as a whatwg URL.`), null;
            let K = q.href,
                {
                    host: Y,
                    hostname: z,
                    pathname: _,
                    protocol: w,
                    search: O
                } = q;
            if (O) return null;
            let $ = w.slice(0, -1);
            if (!Object.values(Ne1.EndpointURLScheme).includes($)) return null;
            let H = FUA(z),
                j = K.includes(`${Y}:${ve1[$]}`) || typeof A === "string" && A.includes(`${Y}:${ve1[$]}`),
                J = `${Y}${j?`:${ve1[$]}`:""}`;
            return {
                scheme: $,
                authority: J,
                path: _,
                normalizedPath: _.endsWith("/") ? _ : `${_}/`,
                isIp: H
            }
        },
        f85 = (A, q) => A === q,
        T85 = (A, q, K, Y) => {
            if (q >= K || A.length < K) return null;
            if (!Y) return A.substring(q, K);
            return A.substring(A.length - K, A.length - q)
        },
        v85 = (A) => encodeURIComponent(A).replace(/[!*'()]/g, (q) => `%${q.charCodeAt(0).toString(16).toUpperCase()}`),
        N85 = {
            booleanEquals: X85,
            getAttr: pUA,
            isSet: W85,
            isValidHostLabel: ke1,
            not: Z85,
            parseURL: G85,
            stringEquals: f85,
            substring: T85,
            uriEncode: v85
        },
        QUA = (A, q) => {
            let K = [],
                Y = {
                    ...q.endpointParams,
                    ...q.referenceRecord
                },
                z = 0;
            while (z < A.length) {
                let _ = A.indexOf("{", z);
                if (_ === -1) {
                    K.push(A.slice(z));
                    break
                }
                K.push(A.slice(z, _));
                let w = A.indexOf("}", _);
                if (w === -1) {
                    K.push(A.slice(_));
                    break
                }
                if (A[_ + 1] === "{" && A[w + 1] === "}") K.push(A.slice(_ + 1, w)), z = w + 2;
                let O = A.substring(_ + 1, w);
                if (O.includes("#")) {
                    let [$, H] = O.split("#");
                    K.push(pUA(Y[$], H))
                } else K.push(Y[O]);
                z = w + 1
            }
            return K.join("")
        },
        V85 = ({
            ref: A
        }, q) => {
            return {
                ...q.endpointParams,
                ...q.referenceRecord
            } [A]
        },
        Lq1 = (A, q, K) => {
            if (typeof A === "string") return QUA(A, K);
            else if (A.fn) return dUA.callFunction(A, K);
            else if (A.ref) return V85(A, K);
            throw new GG(`'${q}': ${String(A)} is not a string, function or reference.`)
        },
        UUA = ({
            fn: A,
            argv: q
        }, K) => {
            let Y = q.map((_) => ["boolean", "number"].includes(typeof _) ? _ : dUA.evaluateExpression(_, "arg", K)),
                z = A.split(".");
            if (z[0] in Ve1 && z[1] != null) return Ve1[z[0]][z[1]](...Y);
            return N85[A](...Y)
        },
        dUA = {
            evaluateExpression: Lq1,
            callFunction: UUA
        },
        k85 = ({
            assign: A,
            ...q
        }, K) => {
            if (A && A in K.referenceRecord) throw new GG(`'${A}' is already defined in Reference Record.`);
            let Y = UUA(q, K);
            return K.logger?.debug?.(`${OS6} evaluateCondition: ${cr(q)} = ${cr(Y)}`), {
                result: Y === "" ? !0 : !!Y,
                ...A != null && {
                    toAssign: {
                        name: A,
                        value: Y
                    }
                }
            }
        },
        Ee1 = (A = [], q) => {
            let K = {};
            for (let Y of A) {
                let {
                    result: z,
                    toAssign: _
                } = k85(Y, {
                    ...q,
                    referenceRecord: {
                        ...q.referenceRecord,
                        ...K
                    }
                });
                if (!z) return {
                    result: z
                };
                if (_) K[_.name] = _.value, q.logger?.debug?.(`${OS6} assign: ${_.name} := ${cr(_.value)}`)
            }
            return {
                result: !0,
                referenceRecord: K
            }
        },
        E85 = (A, q) => Object.entries(A).reduce((K, [Y, z]) => ({
            ...K,
            [Y]: z.map((_) => {
                let w = Lq1(_, "Header value entry", q);
                if (typeof w !== "string") throw new GG(`Header '${Y}' value '${w}' is not a string`);
                return w
            })
        }), {}),
        cUA = (A, q) => Object.entries(A).reduce((K, [Y, z]) => ({
            ...K,
            [Y]: iUA.getEndpointProperty(z, q)
        }), {}),
        lUA = (A, q) => {
            if (Array.isArray(A)) return A.map((K) => lUA(K, q));
            switch (typeof A) {
                case "string":
                    return QUA(A, q);
                case "object":
                    if (A === null) throw new GG(`Unexpected endpoint property: ${A}`);
                    return iUA.getEndpointProperties(A, q);
                case "boolean":
                    return A;
                default:
                    throw new GG(`Unexpected endpoint property type: ${typeof A}`)
            }
        },
        iUA = {
            getEndpointProperty: lUA,
            getEndpointProperties: cUA
        },
        y85 = (A, q) => {
            let K = Lq1(A, "Endpoint URL", q);
            if (typeof K === "string") try {
                return new URL(K)
            } catch (Y) {
                throw console.error(`Failed to construct URL with ${K}`, Y), Y
            }
            throw new GG(`Endpoint URL must be a string, got ${typeof K}`)
        },
        L85 = (A, q) => {
            let {
                conditions: K,
                endpoint: Y
            } = A, {
                result: z,
                referenceRecord: _
            } = Ee1(K, q);
            if (!z) return;
            let w = {
                    ...q,
                    referenceRecord: {
                        ...q.referenceRecord,
                        ..._
                    }
                },
                {
                    url: O,
                    properties: $,
                    headers: H
                } = Y;
            return q.logger?.debug?.(`${OS6} Resolving endpoint from template: ${cr(Y)}`), {
                ...H != null && {
                    headers: E85(H, w)
                },
                ...$ != null && {
                    properties: cUA($, w)
                },
                url: y85(O, w)
            }
        },
        R85 = (A, q) => {
            let {
                conditions: K,
                error: Y
            } = A, {
                result: z,
                referenceRecord: _
            } = Ee1(K, q);
            if (!z) return;
            throw new GG(Lq1(Y, "Error", {
                ...q,
                referenceRecord: {
                    ...q.referenceRecord,
                    ..._
                }
            }))
        },
        nUA = (A, q) => {
            for (let K of A)
                if (K.type === "endpoint") {
                    let Y = L85(K, q);
                    if (Y) return Y
                } else if (K.type === "error") R85(K, q);
            else if (K.type === "tree") {
                let Y = rUA.evaluateTreeRule(K, q);
                if (Y) return Y
            } else throw new GG(`Unknown endpoint rule: ${K}`);
            throw new GG("Rules evaluation failed")
        },
        h85 = (A, q) => {
            let {
                conditions: K,
                rules: Y
            } = A, {
                result: z,
                referenceRecord: _
            } = Ee1(K, q);
            if (!z) return;
            return rUA.evaluateRules(Y, {
                ...q,
                referenceRecord: {
                    ...q.referenceRecord,
                    ..._
                }
            })
        },
        rUA = {
            evaluateRules: nUA,
            evaluateTreeRule: h85
        },
        S85 = (A, q) => {
            let {
                endpointParams: K,
                logger: Y
            } = q, {
                parameters: z,
                rules: _
            } = A;
            q.logger?.debug?.(`${OS6} Initial EndpointParams: ${cr(K)}`);
            let w = Object.entries(z).filter(([, H]) => H.default != null).map(([H, j]) => [H, j.default]);
            if (w.length > 0)
                for (let [H, j] of w) K[H] = K[H] ?? j;
            let O = Object.entries(z).filter(([, H]) => H.required).map(([H]) => H);
            for (let H of O)
                if (K[H] == null) throw new GG(`Missing required parameter: '${H}'`);
            let $ = nUA(_, {
                endpointParams: K,
                logger: Y,
                referenceRecord: {}
            });
            return q.logger?.debug?.(`${OS6} Resolved endpoint: ${cr($)}`), $
        };
    C85.EndpointCache = gUA;
    C85.EndpointError = GG;
    C85.customEndpointFunctions = Ve1;
    C85.isIpAddress = FUA;
    C85.isValidHostLabel = ke1;
    C85.resolveEndpoint = S85
})
// @from(Ln 72130, Col 4)
Zu = x((Rq1) => {
    var Xj6 = nS(),
        g85 = hy(),
        aUA = (A, q = !1) => {
            if (q) {
                for (let K of A.split("."))
                    if (!aUA(K)) return !1;
                return !0
            }
            if (!Xj6.isValidHostLabel(A)) return !1;
            if (A.length < 3 || A.length > 63) return !1;
            if (A !== A.toLowerCase()) return !1;
            if (Xj6.isIpAddress(A)) return !1;
            return !0
        },
        oUA = ":",
        F85 = "/",
        p85 = (A) => {
            let q = A.split(oUA);
            if (q.length < 6) return null;
            let [K, Y, z, _, w, ...O] = q;
            if (K !== "arn" || Y === "" || z === "" || O.join(oUA) === "") return null;
            let $ = O.map((H) => H.split(F85)).flat();
            return {
                partition: Y,
                service: z,
                region: _,
                accountId: w,
                resourceId: $
            }
        },
        Q85 = [{
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
        U85 = "1.1",
        sUA = {
            partitions: Q85,
            version: U85
        },
        tUA = sUA,
        eUA = "",
        AdA = (A) => {
            let {
                partitions: q
            } = tUA;
            for (let Y of q) {
                let {
                    regions: z,
                    outputs: _
                } = Y;
                for (let [w, O] of Object.entries(z))
                    if (w === A) return {
                        ..._,
                        ...O
                    }
            }
            for (let Y of q) {
                let {
                    regionRegex: z,
                    outputs: _
                } = Y;
                if (new RegExp(z).test(A)) return {
                    ..._
                }
            }
            let K = q.find((Y) => Y.id === "aws");
            if (!K) throw Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
            return {
                ...K.outputs
            }
        },
        qdA = (A, q = "") => {
            tUA = A, eUA = q
        },
        d85 = () => {
            qdA(sUA, "")
        },
        c85 = () => eUA,
        KdA = {
            isVirtualHostableS3Bucket: aUA,
            parseArn: p85,
            partition: AdA
        };
    Xj6.customEndpointFunctions.aws = KdA;
    var l85 = (A) => {
            if (typeof A.endpointProvider !== "function") throw Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
            let {
                endpoint: q
            } = A;
            if (q === void 0) A.endpoint = async () => {
                return YdA(A.endpointProvider({
                    Region: typeof A.region === "function" ? await A.region() : A.region,
                    UseDualStack: typeof A.useDualstackEndpoint === "function" ? await A.useDualstackEndpoint() : A.useDualstackEndpoint,
                    UseFIPS: typeof A.useFipsEndpoint === "function" ? await A.useFipsEndpoint() : A.useFipsEndpoint,
                    Endpoint: void 0
                }, {
                    logger: A.logger
                }))
            };
            return A
        },
        YdA = (A) => g85.parseUrl(A.url);
    Object.defineProperty(Rq1, "EndpointError", {
        enumerable: !0,
        get: function() {
            return Xj6.EndpointError
        }
    });
    Object.defineProperty(Rq1, "isIpAddress", {
        enumerable: !0,
        get: function() {
            return Xj6.isIpAddress
        }
    });
    Object.defineProperty(Rq1, "resolveEndpoint", {
        enumerable: !0,
        get: function() {
            return Xj6.resolveEndpoint
        }
    });
    Rq1.awsEndpointFunctions = KdA;
    Rq1.getUserAgentPrefix = c85;
    Rq1.partition = AdA;
    Rq1.resolveDefaultAwsRegionalEndpointsConfig = l85;
    Rq1.setPartitionInfo = qdA;
    Rq1.toEndpointV1 = YdA;
    Rq1.useDefaultPartitionInfo = d85
})
// @from(Ln 72519, Col 4)
zdA = x((zA5) => {
    zA5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(zA5.HttpAuthLocation || (zA5.HttpAuthLocation = {}));
    zA5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(zA5.HttpApiKeyAuthLocation || (zA5.HttpApiKeyAuthLocation = {}));
    zA5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(zA5.EndpointURLScheme || (zA5.EndpointURLScheme = {}));
    zA5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(zA5.AlgorithmId || (zA5.AlgorithmId = {}));
    var e85 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => zA5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => zA5.AlgorithmId.MD5,
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
        AA5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        qA5 = (A) => {
            return e85(A)
        },
        KA5 = (A) => {
            return AA5(A)
        };
    zA5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(zA5.FieldPosition || (zA5.FieldPosition = {}));
    var YA5 = "__smithy_context";
    zA5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(zA5.IniSectionType || (zA5.IniSectionType = {}));
    zA5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(zA5.RequestHandlerProtocol || (zA5.RequestHandlerProtocol = {}));
    zA5.SMITHY_CONTEXT_KEY = YA5;
    zA5.getDefaultClientConfiguration = qA5;
    zA5.resolveDefaultRuntimeConfig = KA5
})
// @from(Ln 72584, Col 4)
$dA = x((DA5) => {
    var $A5 = zdA(),
        HA5 = (A) => {
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
        jA5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class _dA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = $A5.FieldPosition.HEADER,
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
    class wdA {
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
    class hq1 {
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
            let q = new hq1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = JA5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return hq1.clone(this)
        }
    }

    function JA5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class OdA {
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

    function MA5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    DA5.Field = _dA;
    DA5.Fields = wdA;
    DA5.HttpRequest = hq1;
    DA5.HttpResponse = OdA;
    DA5.getHttpHandlerExtensionConfiguration = HA5;
    DA5.isValidHostname = MA5;
    DA5.resolveHttpHandlerRuntimeConfig = jA5
})
// @from(Ln 72726, Col 4)
jdA = x((NA5) => {
    var HdA = typeof TextEncoder == "function" ? new TextEncoder : null,
        vA5 = (A) => {
            if (typeof A === "string") {
                if (HdA) return HdA.encode(A).byteLength;
                let q = A.length;
                for (let K = q - 1; K >= 0; K--) {
                    let Y = A.charCodeAt(K);
                    if (Y > 127 && Y <= 2047) q++;
                    else if (Y > 2047 && Y <= 65535) q += 2;
                    if (Y >= 56320 && Y <= 57343) K--
                }
                return q
            } else if (typeof A.byteLength === "number") return A.byteLength;
            else if (typeof A.size === "number") return A.size;
            throw Error(`Body Length computation failed for ${A}`)
        };
    NA5.calculateBodyLength = vA5
})
// @from(Ln 72745, Col 4)
le1 = x((iA5) => {
    var xq1 = FT(),
        XdA = C_(),
        jS6 = pT(),
        kA5 = Qh6(),
        EA5 = jdA(),
        Pj6 = dO(),
        yA5 = VW(),
        PdA = _t1(),
        Iq1 = 0,
        bq1 = 1,
        A46 = 2,
        lr = 3,
        HS6 = 4,
        Sq1 = 5,
        WdA = 6,
        Ie1 = 7,
        ZdA = 20,
        ue1 = 21,
        GdA = 22,
        LA5 = 23,
        Be1 = 24,
        q46 = 25,
        K46 = 26,
        ir = 27,
        ge1 = 31;

    function Wj6(A) {
        return typeof Buffer < "u" ? Buffer.alloc(A) : new Uint8Array(A)
    }
    var Fe1 = Symbol("@smithy/core/cbor::tagSymbol");

    function pe1(A) {
        return A[Fe1] = !0, A
    }
    var RA5 = typeof TextDecoder < "u",
        hA5 = typeof Buffer < "u",
        w2 = Wj6(0),
        TQ = new DataView(w2.buffer, w2.byteOffset, w2.byteLength),
        JdA = RA5 ? new TextDecoder : null,
        z9 = 0;

    function SA5(A) {
        w2 = A, TQ = new DataView(w2.buffer, w2.byteOffset, w2.byteLength)
    }

    function vQ(A, q) {
        if (A >= q) throw Error("unexpected end of (decode) payload.");
        let K = (w2[A] & 224) >> 5,
            Y = w2[A] & 31;
        switch (K) {
            case Iq1:
            case bq1:
            case WdA:
                let z, _;
                if (Y < 24) z = Y, _ = 1;
                else switch (Y) {
                    case Be1:
                    case q46:
                    case K46:
                    case ir:
                        let w = TdA[Y],
                            O = w + 1;
                        if (_ = O, q - A < O) throw Error(`countLength ${w} greater than remaining buf len.`);
                        let $ = A + 1;
                        if (w === 1) z = w2[$];
                        else if (w === 2) z = TQ.getUint16($);
                        else if (w === 4) z = TQ.getUint32($);
                        else z = TQ.getBigUint64($);
                        break;
                    default:
                        throw Error(`unexpected minor value ${Y}.`)
                }
                if (K === Iq1) return z9 = _, be1(z);
                else if (K === bq1) {
                    let w;
                    if (typeof z === "bigint") w = BigInt(-1) - z;
                    else w = -1 - z;
                    return z9 = _, be1(w)
                } else if (Y === 2 || Y === 3) {
                    let w = JS6(A + _, q),
                        O = BigInt(0),
                        $ = A + _ + z9;
                    for (let H = $; H < $ + w; ++H) O = O << BigInt(8) | BigInt(w2[H]);
                    return z9 = _ + z9 + w, Y === 3 ? -O - BigInt(1) : O
                } else if (Y === 4) {
                    let w = vQ(A + _, q),
                        [O, $] = w,
                        H = $ < 0 ? -1 : 1,
                        j = "0".repeat(Math.abs(O) + 1) + String(BigInt(H) * BigInt($)),
                        J, M = $ < 0 ? "-" : "";
                    if (J = O === 0 ? j : j.slice(0, j.length + O) + "." + j.slice(O), J = J.replace(/^0+/g, ""), J === "") J = "0";
                    if (J[0] === ".") J = "0" + J;
                    return J = M + J, z9 = _ + z9, xq1.nv(J)
                } else {
                    let w = vQ(A + _, q);
                    return z9 = _ + z9, pe1({
                        tag: be1(z),
                        value: w
                    })
                }
            case lr:
            case Sq1:
            case HS6:
            case A46:
                if (Y === ge1) switch (K) {
                    case lr:
                        return xA5(A, q);
                    case Sq1:
                        return FA5(A, q);
                    case HS6:
                        return BA5(A, q);
                    case A46:
                        return uA5(A, q)
                } else switch (K) {
                    case lr:
                        return bA5(A, q);
                    case Sq1:
                        return gA5(A, q);
                    case HS6:
                        return mA5(A, q);
                    case A46:
                        return Qe1(A, q)
                }
                default: return pA5(A, q)
        }
    }

    function fdA(A, q, K) {
        if (hA5 && A.constructor?.name === "Buffer") return A.toString("utf-8", q, K);
        if (JdA) return JdA.decode(A.subarray(q, K));
        return XdA.toUtf8(A.subarray(q, K))
    }

    function CA5(A) {
        let q = Number(A);
        if (q < Number.MIN_SAFE_INTEGER || Number.MAX_SAFE_INTEGER < q) console.warn(Error(`@smithy/core/cbor - truncating BigInt(${A}) to ${q} with loss of precision.`));
        return q
    }
    var TdA = {
        [Be1]: 1,
        [q46]: 2,
        [K46]: 4,
        [ir]: 8
    };

    function IA5(A, q) {
        let K = A >> 7,
            Y = (A & 124) >> 2,
            z = (A & 3) << 8 | q,
            _ = K === 0 ? 1 : -1,
            w, O;
        if (Y === 0)
            if (z === 0) return 0;
            else w = Math.pow(2, -14), O = 0;
        else if (Y === 31)
            if (z === 0) return _ * (1 / 0);
            else return NaN;
        else w = Math.pow(2, Y - 15), O = 1;
        return O += z / 1024, _ * (w * O)
    }

    function JS6(A, q) {
        let K = w2[A] & 31;
        if (K < 24) return z9 = 1, K;
        if (K === Be1 || K === q46 || K === K46 || K === ir) {
            let Y = TdA[K];
            if (z9 = Y + 1, q - A < z9) throw Error(`countLength ${Y} greater than remaining buf len.`);
            let z = A + 1;
            if (Y === 1) return w2[z];
            else if (Y === 2) return TQ.getUint16(z);
            else if (Y === 4) return TQ.getUint32(z);
            return CA5(TQ.getBigUint64(z))
        }
        throw Error(`unexpected minor value ${K}.`)
    }

    function bA5(A, q) {
        let K = JS6(A, q),
            Y = z9;
        if (A += Y, q - A < K) throw Error(`string len ${K} greater than remaining buf len.`);
        let z = fdA(w2, A, A + K);
        return z9 = Y + K, z
    }

    function xA5(A, q) {
        A += 1;
        let K = [];
        for (let Y = A; A < q;) {
            if (w2[A] === 255) {
                let $ = Wj6(K.length);
                return $.set(K, 0), z9 = A - Y + 2, fdA($, 0, $.length)
            }
            let z = (w2[A] & 224) >> 5,
                _ = w2[A] & 31;
            if (z !== lr) throw Error(`unexpected major type ${z} in indefinite string.`);
            if (_ === ge1) throw Error("nested indefinite string.");
            let w = Qe1(A, q);
            A += z9;
            for (let $ = 0; $ < w.length; ++$) K.push(w[$])
        }
        throw Error("expected break marker.")
    }

    function Qe1(A, q) {
        let K = JS6(A, q),
            Y = z9;
        if (A += Y, q - A < K) throw Error(`unstructured byte string len ${K} greater than remaining buf len.`);
        let z = w2.subarray(A, A + K);
        return z9 = Y + K, z
    }

    function uA5(A, q) {
        A += 1;
        let K = [];
        for (let Y = A; A < q;) {
            if (w2[A] === 255) {
                let $ = Wj6(K.length);
                return $.set(K, 0), z9 = A - Y + 2, $
            }
            let z = (w2[A] & 224) >> 5,
                _ = w2[A] & 31;
            if (z !== A46) throw Error(`unexpected major type ${z} in indefinite string.`);
            if (_ === ge1) throw Error("nested indefinite string.");
            let w = Qe1(A, q);
            A += z9;
            for (let $ = 0; $ < w.length; ++$) K.push(w[$])
        }
        throw Error("expected break marker.")
    }

    function mA5(A, q) {
        let K = JS6(A, q),
            Y = z9;
        A += Y;
        let z = A,
            _ = Array(K);
        for (let w = 0; w < K; ++w) {
            let O = vQ(A, q),
                $ = z9;
            _[w] = O, A += $
        }
        return z9 = Y + (A - z), _
    }

    function BA5(A, q) {
        A += 1;
        let K = [];
        for (let Y = A; A < q;) {
            if (w2[A] === 255) return z9 = A - Y + 2, K;
            let z = vQ(A, q);
            A += z9, K.push(z)
        }
        throw Error("expected break marker.")
    }

    function gA5(A, q) {
        let K = JS6(A, q),
            Y = z9;
        A += Y;
        let z = A,
            _ = {};
        for (let w = 0; w < K; ++w) {
            if (A >= q) throw Error("unexpected end of map payload.");
            let O = (w2[A] & 224) >> 5;
            if (O !== lr) throw Error(`unexpected major type ${O} for map key at index ${A}.`);
            let $ = vQ(A, q);
            A += z9;
            let H = vQ(A, q);
            A += z9, _[$] = H
        }
        return z9 = Y + (A - z), _
    }

    function FA5(A, q) {
        A += 1;
        let K = A,
            Y = {};
        for (; A < q;) {
            if (A >= q) throw Error("unexpected end of map payload.");
            if (w2[A] === 255) return z9 = A - K + 2, Y;
            let z = (w2[A] & 224) >> 5;
            if (z !== lr) throw Error(`unexpected major type ${z} for map key.`);
            let _ = vQ(A, q);
            A += z9;
            let w = vQ(A, q);
            A += z9, Y[_] = w
        }
        throw Error("expected break marker.")
    }

    function pA5(A, q) {
        let K = w2[A] & 31;
        switch (K) {
            case ue1:
            case ZdA:
                return z9 = 1, K === ue1;
            case GdA:
                return z9 = 1, null;
            case LA5:
                return z9 = 1, null;
            case q46:
                if (q - A < 3) throw Error("incomplete float16 at end of buf.");
                return z9 = 3, IA5(w2[A + 1], w2[A + 2]);
            case K46:
                if (q - A < 5) throw Error("incomplete float32 at end of buf.");
                return z9 = 5, TQ.getFloat32(A + 1);
            case ir:
                if (q - A < 9) throw Error("incomplete float64 at end of buf.");
                return z9 = 9, TQ.getFloat64(A + 1);
            default:
                throw Error(`unexpected minor value ${K}.`)
        }
    }

    function be1(A) {
        if (typeof A === "number") return A;
        let q = Number(A);
        if (Number.MIN_SAFE_INTEGER <= q && q <= Number.MAX_SAFE_INTEGER) return q;
        return A
    }
    var MdA = typeof Buffer < "u",
        QA5 = 2048,
        O5 = Wj6(QA5),
        fQ = new DataView(O5.buffer, O5.byteOffset, O5.byteLength),
        bq = 0;

    function xe1(A) {
        if (O5.byteLength - bq < A)
            if (bq < 16000000) me1(Math.max(O5.byteLength * 4, O5.byteLength + A));
            else me1(O5.byteLength + A + 16000000)
    }

    function DdA() {
        let A = Wj6(bq);
        return A.set(O5.subarray(0, bq), 0), bq = 0, A
    }

    function me1(A) {
        let q = O5;
        if (O5 = Wj6(A), q)
            if (q.copy) q.copy(O5, 0, 0, q.byteLength);
            else O5.set(q, 0);
        fQ = new DataView(O5.buffer, O5.byteOffset, O5.byteLength)
    }

    function GQ(A, q) {
        if (q < 24) O5[bq++] = A << 5 | q;
        else if (q < 256) O5[bq++] = A << 5 | 24, O5[bq++] = q;
        else if (q < 65536) O5[bq++] = A << 5 | q46, fQ.setUint16(bq, q), bq += 2;
        else if (q < 4294967296) O5[bq++] = A << 5 | K46, fQ.setUint32(bq, q), bq += 4;
        else O5[bq++] = A << 5 | ir, fQ.setBigUint64(bq, typeof q === "bigint" ? q : BigInt(q)), bq += 8
    }

    function UA5(A) {
        let q = [A];
        while (q.length) {
            let K = q.pop();
            if (xe1(typeof K === "string" ? K.length * 4 : 64), typeof K === "string") {
                if (MdA) GQ(lr, Buffer.byteLength(K)), bq += O5.write(K, bq);
                else {
                    let Y = XdA.fromUtf8(K);
                    GQ(lr, Y.byteLength), O5.set(Y, bq), bq += Y.byteLength
                }
                continue
            } else if (typeof K === "number") {
                if (Number.isInteger(K)) {
                    let Y = K >= 0,
                        z = Y ? Iq1 : bq1,
                        _ = Y ? K : -K - 1;
                    if (_ < 24) O5[bq++] = z << 5 | _;
                    else if (_ < 256) O5[bq++] = z << 5 | 24, O5[bq++] = _;
                    else if (_ < 65536) O5[bq++] = z << 5 | q46, O5[bq++] = _ >> 8, O5[bq++] = _;
                    else if (_ < 4294967296) O5[bq++] = z << 5 | K46, fQ.setUint32(bq, _), bq += 4;
                    else O5[bq++] = z << 5 | ir, fQ.setBigUint64(bq, BigInt(_)), bq += 8;
                    continue
                }
                O5[bq++] = Ie1 << 5 | ir, fQ.setFloat64(bq, K), bq += 8;
                continue
            } else if (typeof K === "bigint") {
                let Y = K >= 0,
                    z = Y ? Iq1 : bq1,
                    _ = Y ? K : -K - BigInt(1),
                    w = Number(_);
                if (w < 24) O5[bq++] = z << 5 | w;
                else if (w < 256) O5[bq++] = z << 5 | 24, O5[bq++] = w;
                else if (w < 65536) O5[bq++] = z << 5 | q46, O5[bq++] = w >> 8, O5[bq++] = w & 255;
                else if (w < 4294967296) O5[bq++] = z << 5 | K46, fQ.setUint32(bq, w), bq += 4;
                else if (_ < BigInt("18446744073709551616")) O5[bq++] = z << 5 | ir, fQ.setBigUint64(bq, _), bq += 8;
                else {
                    let O = _.toString(2),
                        $ = new Uint8Array(Math.ceil(O.length / 8)),
                        H = _,
                        j = 0;
                    while ($.byteLength - ++j >= 0) $[$.byteLength - j] = Number(H & BigInt(255)), H >>= BigInt(8);
                    if (xe1($.byteLength * 2), O5[bq++] = Y ? 194 : 195, MdA) GQ(A46, Buffer.byteLength($));
                    else GQ(A46, $.byteLength);
                    O5.set($, bq), bq += $.byteLength
                }
                continue
            } else if (K === null) {
                O5[bq++] = Ie1 << 5 | GdA;
                continue
            } else if (typeof K === "boolean") {
                O5[bq++] = Ie1 << 5 | (K ? ue1 : ZdA);
                continue
            } else if (typeof K > "u") throw Error("@smithy/core/cbor: client may not serialize undefined value.");
            else if (Array.isArray(K)) {
                for (let Y = K.length - 1; Y >= 0; --Y) q.push(K[Y]);
                GQ(HS6, K.length);
                continue
            } else if (typeof K.byteLength === "number") {
                xe1(K.length * 2), GQ(A46, K.length), O5.set(K, bq), bq += K.byteLength;
                continue
            } else if (typeof K === "object") {
                if (K instanceof xq1.NumericValue) {
                    let z = K.string.indexOf("."),
                        _ = z === -1 ? 0 : z - K.string.length + 1,
                        w = BigInt(K.string.replace(".", ""));
                    O5[bq++] = 196, q.push(w), q.push(_), GQ(HS6, 2);
                    continue
                }
                if (K[Fe1])
                    if ("tag" in K && "value" in K) {
                        q.push(K.value), GQ(WdA, K.tag);
                        continue
                    } else throw Error("tag encountered with missing fields, need 'tag' and 'value', found: " + JSON.stringify(K));
                let Y = Object.keys(K);
                for (let z = Y.length - 1; z >= 0; --z) {
                    let _ = Y[z];
                    q.push(K[_]), q.push(_)
                }
                GQ(Sq1, Y.length);
                continue
            }
            throw Error(`data type ${K?.constructor?.name??typeof K} not compatible for encoding.`)
        }
    }
    var uq1 = {
            deserialize(A) {
                return SA5(A), vQ(0, A.length)
            },
            serialize(A) {
                try {
                    return UA5(A), DdA()
                } catch (q) {
                    throw DdA(), q
                }
            },
            resizeEncodingBuffer(A) {
                me1(A)
            }
        },
        vdA = (A, q) => {
            return jS6.collectBody(A, q).then(async (K) => {
                if (K.length) try {
                    return uq1.deserialize(K)
                } catch (Y) {
                    throw Object.defineProperty(Y, "$responseBodyText", {
                        value: q.utf8Encoder(K)
                    }), Y
                }
                return {}
            })
        },
        Cq1 = (A) => {
            return pe1({
                tag: 1,
                value: A.getTime() / 1000
            })
        },
        dA5 = async (A, q) => {
            let K = await vdA(A, q);
            return K.message = K.message ?? K.Message, K
        }, NdA = (A, q) => {
            let K = (z) => {
                let _ = z;
                if (typeof _ === "number") _ = _.toString();
                if (_.indexOf(",") >= 0) _ = _.split(",")[0];
                if (_.indexOf(":") >= 0) _ = _.split(":")[0];
                if (_.indexOf("#") >= 0) _ = _.split("#")[1];
                return _
            };
            if (q.__type !== void 0) return K(q.__type);
            let Y = Object.keys(q).find((z) => z.toLowerCase() === "code");
            if (Y && q[Y] !== void 0) return K(q[Y])
        }, cA5 = (A) => {
            if (String(A.headers["smithy-protocol"]).toLowerCase() !== "rpc-v2-cbor") throw Error("Malformed RPCv2 CBOR response, status: " + A.statusCode)
        }, lA5 = async (A, q, K, Y, z) => {
            let {
                hostname: _,
                protocol: w = "https",
                port: O,
                path: $
            } = await A.endpoint(), H = {
                protocol: w,
                hostname: _,
                port: O,
                method: "POST",
                path: $.endsWith("/") ? $.slice(0, -1) + K : $ + K,
                headers: {
                    ...q
                }
            };
            if (Y !== void 0) H.hostname = Y;
            if (z !== void 0) {
                H.body = z;
                try {
                    H.headers["content-length"] = String(EA5.calculateBodyLength(z))
                } catch (j) {}
            }
            return new kA5.HttpRequest(H)
        };
    class Ue1 extends jS6.SerdeContext {
        createSerializer() {
            let A = new de1;
            return A.setSerdeContext(this.serdeContext), A
        }
        createDeserializer() {
            let A = new ce1;
            return A.setSerdeContext(this.serdeContext), A
        }
    }
    class de1 extends jS6.SerdeContext {
        value;
        write(A, q) {
            this.value = this.serialize(A, q)
        }
        serialize(A, q) {
            let K = Pj6.NormalizedSchema.of(A);
            if (q == null) {
                if (K.isIdempotencyToken()) return xq1.generateIdempotencyToken();
                return q
            }
            if (K.isBlobSchema()) {
                if (typeof q === "string") return (this.serdeContext?.base64Decoder ?? PdA.fromBase64)(q);
                return q
            }
            if (K.isTimestampSchema()) {
                if (typeof q === "number" || typeof q === "bigint") return Cq1(new Date(Number(q) / 1000 | 0));
                return Cq1(q)
            }
            if (typeof q === "function" || typeof q === "object") {
                let Y = q;
                if (K.isListSchema() && Array.isArray(Y)) {
                    let _ = !!K.getMergedTraits().sparse,
                        w = [],
                        O = 0;
                    for (let $ of Y) {
                        let H = this.serialize(K.getValueSchema(), $);
                        if (H != null || _) w[O++] = H
                    }
                    return w
                }
                if (Y instanceof Date) return Cq1(Y);
                let z = {};
                if (K.isMapSchema()) {
                    let _ = !!K.getMergedTraits().sparse;
                    for (let w of Object.keys(Y)) {
                        let O = this.serialize(K.getValueSchema(), Y[w]);
                        if (O != null || _) z[w] = O
                    }
                } else if (K.isStructSchema())
                    for (let [_, w] of K.structIterator()) {
                        let O = this.serialize(w, Y[_]);
                        if (O != null) z[_] = O
                    } else if (K.isDocumentSchema())
                        for (let _ of Object.keys(Y)) z[_] = this.serialize(K.getValueSchema(), Y[_]);
                return z
            }
            return q
        }
        flush() {
            let A = uq1.serialize(this.value);
            return this.value = void 0, A
        }
    }
    class ce1 extends jS6.SerdeContext {
        read(A, q) {
            let K = uq1.deserialize(q);
            return this.readValue(A, K)
        }
        readValue(A, q) {
            let K = Pj6.NormalizedSchema.of(A);
            if (K.isTimestampSchema() && typeof q === "number") return xq1._parseEpochTimestamp(q);
            if (K.isBlobSchema()) {
                if (typeof q === "string") return (this.serdeContext?.base64Decoder ?? PdA.fromBase64)(q);
                return q
            }
            if (typeof q > "u" || typeof q === "boolean" || typeof q === "number" || typeof q === "string" || typeof q === "bigint" || typeof q === "symbol") return q;
            else if (typeof q === "function" || typeof q === "object") {
                if (q === null) return null;
                if ("byteLength" in q) return q;
                if (q instanceof Date) return q;
                if (K.isDocumentSchema()) return q;
                if (K.isListSchema()) {
                    let z = [],
                        _ = K.getValueSchema(),
                        w = !!K.getMergedTraits().sparse;
                    for (let O of q) {
                        let $ = this.readValue(_, O);
                        if ($ != null || w) z.push($)
                    }
                    return z
                }
                let Y = {};
                if (K.isMapSchema()) {
                    let z = !!K.getMergedTraits().sparse,
                        _ = K.getValueSchema();
                    for (let w of Object.keys(q)) {
                        let O = this.readValue(_, q[w]);
                        if (O != null || z) Y[w] = O
                    }
                } else if (K.isStructSchema())
                    for (let [z, _] of K.structIterator()) {
                        let w = this.readValue(_, q[z]);
                        if (w != null) Y[z] = w
                    }
                return Y
            } else return q
        }
    }
    class VdA extends jS6.RpcProtocol {
        codec = new Ue1;
        serializer = this.codec.createSerializer();
        deserializer = this.codec.createDeserializer();
        constructor({
            defaultNamespace: A
        }) {
            super({
                defaultNamespace: A
            })
        }
        getShapeId() {
            return "smithy.protocols#rpcv2Cbor"
        }
        getPayloadCodec() {
            return this.codec
        }
        async serializeRequest(A, q, K) {
            let Y = await super.serializeRequest(A, q, K);
            if (Object.assign(Y.headers, {
                    "content-type": this.getDefaultContentType(),
                    "smithy-protocol": "rpc-v2-cbor",
                    accept: this.getDefaultContentType()
                }), Pj6.deref(A.input) === "unit") delete Y.body, delete Y.headers["content-type"];
            else {
                if (!Y.body) this.serializer.write(15, {}), Y.body = this.serializer.flush();
                try {
                    Y.headers["content-length"] = String(Y.body.byteLength)
                } catch (O) {}
            }
            let {
                service: z,
                operation: _
            } = yA5.getSmithyContext(K), w = `/service/${z}/operation/${_}`;
            if (Y.path.endsWith("/")) Y.path += w.slice(1);
            else Y.path += w;
            return Y
        }
        async deserializeResponse(A, q, K) {
            return super.deserializeResponse(A, q, K)
        }
        async handleError(A, q, K, Y, z) {
            let _ = NdA(K, Y) ?? "Unknown",
                w = this.options.defaultNamespace;
            if (_.includes("#"))[w] = _.split("#");
            let O = {
                    $metadata: z,
                    $fault: K.statusCode <= 500 ? "client" : "server"
                },
                $ = Pj6.TypeRegistry.for(w),
                H;
            try {
                H = $.getSchema(_)
            } catch (P) {
                if (Y.Message) Y.message = Y.Message;
                let W = Pj6.TypeRegistry.for("smithy.ts.sdk.synthetic." + w),
                    Z = W.getBaseException();
                if (Z) {
                    let G = W.getErrorCtor(Z);
                    throw Object.assign(new G({
                        name: _
                    }), O, Y)
                }
                throw Object.assign(Error(_), O, Y)
            }
            let j = Pj6.NormalizedSchema.of(H),
                J = $.getErrorCtor(H),
                M = Y.message ?? Y.Message ?? "Unknown",
                D = new J(M),
                X = {};
            for (let [P, W] of j.structIterator()) X[P] = this.deserializer.readValue(W, Y[P]);
            throw Object.assign(D, O, {
                $fault: j.getMergedTraits().error,
                message: M
            }, X)
        }
        getDefaultContentType() {
            return "application/cbor"
        }
    }
    iA5.CborCodec = Ue1;
    iA5.CborShapeDeserializer = ce1;
    iA5.CborShapeSerializer = de1;
    iA5.SmithyRpcV2CborProtocol = VdA;
    iA5.buildHttpRpcRequest = lA5;
    iA5.cbor = uq1;
    iA5.checkCborResponse = cA5;
    iA5.dateToTag = Cq1;
    iA5.loadSmithyRpcV2CborErrorCode = NdA;
    iA5.parseCborBody = vdA;
    iA5.parseCborErrorBody = dA5;
    iA5.tag = pe1;
    iA5.tagSymbol = Fe1
})