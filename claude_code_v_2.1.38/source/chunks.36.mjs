
// @from(Ln 93628, Col 0)
function mB8(A) {
    let q = mC(),
        K = {
            ...q && {
                cert: q.cert,
                key: q.key,
                passphrase: q.passphrase
            }
        };
    if (J6(process.env.CLAUDE_CODE_PROXY_RESOLVES_HOSTS)) K.lookup = (Y, z, w) => {
        w(null, Y, tD3(z))
    };
    return new bo6.HttpsProxyAgent(A, K)
}
// @from(Ln 93643, Col 0)
function w81(A) {
    let q = Vg();
    if (!q) return;
    if (PL1(A)) return;
    return mB8(q)
}
// @from(Ln 93650, Col 0)
function H81(A) {
    let q = Vg();
    if (!q) return;
    if (PL1(A)) return;
    return q
}
// @from(Ln 93657, Col 0)
function $81() {
    let A = Vg(),
        q = xo6();
    if (A) {
        if (typeof Bun < "u") return {
            proxy: A,
            ...q
        };
        return {
            dispatcher: FB8(A)
        }
    }
    return q
}
// @from(Ln 93672, Col 0)
function OA6() {
    let A = Vg(),
        q = uB8();
    if ($A6 !== void 0) sA.interceptors.request.eject($A6), $A6 = void 0;
    if (sA.defaults.proxy = void 0, sA.defaults.httpAgent = void 0, sA.defaults.httpsAgent = void 0, A) {
        sA.defaults.proxy = !1;
        let K = mB8(A);
        $A6 = sA.interceptors.request.use((Y) => {
            if (Y.url && PL1(Y.url))
                if (q) Y.httpsAgent = q, Y.httpAgent = q;
                else delete Y.httpsAgent, delete Y.httpAgent;
            else Y.httpsAgent = K, Y.httpAgent = K;
            return Y
        }), HA6(FB8(A))
    } else if (q) {
        sA.defaults.httpsAgent = q;
        let K = xo6();
        if (K.dispatcher) HA6(K.dispatcher)
    }
}
// @from(Ln 93692, Col 0)
async function uo6() {
    let A = Vg();
    if (!A) return {};
    let [{
        NodeHttpHandler: q
    }, {
        defaultProvider: K
    }] = await Promise.all([Promise.resolve().then(() => o(cf(), 1)), Promise.resolve().then(() => o(xA1(), 1))]), Y = new bo6.HttpsProxyAgent(A), z = new q({
        httpAgent: Y,
        httpsAgent: Y
    });
    return {
        requestHandler: z,
        credentials: K({
            clientConfig: {
                requestHandler: z
            }
        })
    }
}
// @from(Ln 93712, Col 4)
bo6
// @from(Ln 93712, Col 9)
FB8
// @from(Ln 93712, Col 14)
$A6
// @from(Ln 93713, Col 4)
bb = v(() => {
    y5();
    zq();
    ho6();
    YO1();
    hA();
    bo6 = o(Dk1(), 1);
    FB8 = KA((A) => {
        let q = mC(),
            K = {
                httpProxy: A,
                httpsProxy: A,
                noProxy: process.env.NO_PROXY || process.env.no_proxy
            };
        if (q) K.connect = {
            cert: q.cert,
            key: q.key,
            passphrase: q.passphrase
        };
        return new So6(K)
    })
})
// @from(Ln 93735, Col 4)
po6 = R((w03) => {
    w03.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(w03.HttpAuthLocation || (w03.HttpAuthLocation = {}));
    w03.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(w03.HttpApiKeyAuthLocation || (w03.HttpApiKeyAuthLocation = {}));
    w03.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(w03.EndpointURLScheme || (w03.EndpointURLScheme = {}));
    w03.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(w03.AlgorithmId || (w03.AlgorithmId = {}));
    var A03 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => w03.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => w03.AlgorithmId.MD5,
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
        q03 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        K03 = (A) => {
            return A03(A)
        },
        Y03 = (A) => {
            return q03(A)
        };
    w03.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(w03.FieldPosition || (w03.FieldPosition = {}));
    var z03 = "__smithy_context";
    w03.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(w03.IniSectionType || (w03.IniSectionType = {}));
    w03.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(w03.RequestHandlerProtocol || (w03.RequestHandlerProtocol = {}));
    w03.SMITHY_CONTEXT_KEY = z03;
    w03.getDefaultClientConfiguration = K03;
    w03.resolveDefaultRuntimeConfig = Y03
})
// @from(Ln 93800, Col 4)
GL1 = R((wO1) => {
    var UB8 = wb(),
        no6 = rf(),
        co6 = po6(),
        _03 = R$(),
        QB8 = nf();
    class pB8 {
        config;
        middlewareStack = UB8.constructStack();
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
    var do6 = "***SensitiveInformation***";

    function lo6(A, q) {
        if (q == null) return q;
        let K = _03.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return do6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return do6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return do6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = lo6(H, Y[w]);
            return z
        }
        return q
    }
    class ro6 {
        middlewareStack = UB8.constructStack();
        schema;
        static classBuilder() {
            return new dB8
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
                    [co6.SMITHY_CONTEXT_KEY]: {
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
    class dB8 {
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
            return q = class extends ro6 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? lo6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? lo6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var J03 = "***SensitiveInformation***",
        X03 = (A, q) => {
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
    class zO1 extends Error {
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
            return zO1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === zO1) return zO1.isInstance(A);
            if (zO1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var cB8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        lB8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = j03(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw cB8(H, q)
        },
        D03 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                lB8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        j03 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        M03 = (A) => {
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
        gB8 = !1,
        P03 = (A) => {
            if (A && !gB8 && parseInt(A.substring(1, A.indexOf("."))) < 16) gB8 = !0
        },
        W03 = (A) => {
            let q = [];
            for (let K in co6.AlgorithmId) {
                let Y = co6.AlgorithmId[K];
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
        G03 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        Z03 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        f03 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        iB8 = (A) => {
            return Object.assign(W03(A), Z03(A))
        },
        V03 = iB8,
        N03 = (A) => {
            return Object.assign(G03(A), f03(A))
        },
        T03 = (A) => Array.isArray(A) ? A : [A],
        nB8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = nB8(A[K]);
            return A
        },
        v03 = (A) => {
            return A != null
        };
    class rB8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function oB8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, L03(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            aB8(Y, null, w, H)
        }
        return Y
    }
    var E03 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        k03 = (A, q) => {
            let K = {};
            for (let Y in q) aB8(K, A, q, Y);
            return K
        },
        L03 = (A, q, K) => {
            return oB8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        aB8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = R03, O = y03, _ = Y] = H;
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
        R03 = (A) => A != null,
        y03 = (A) => A,
        C03 = (A) => {
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
        S03 = (A) => A.toISOString().replace(".000Z", "Z"),
        io6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(io6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = io6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(wO1, "collectBody", {
        enumerable: !0,
        get: function() {
            return no6.collectBody
        }
    });
    Object.defineProperty(wO1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return no6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(wO1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return no6.resolvedPath
        }
    });
    wO1.Client = pB8;
    wO1.Command = ro6;
    wO1.NoOpLogger = rB8;
    wO1.SENSITIVE_STRING = J03;
    wO1.ServiceException = zO1;
    wO1._json = io6;
    wO1.convertMap = E03;
    wO1.createAggregatedClient = X03;
    wO1.decorateServiceException = cB8;
    wO1.emitWarningIfUnsupportedVersion = P03;
    wO1.getArrayIfSingleItem = T03;
    wO1.getDefaultClientConfiguration = V03;
    wO1.getDefaultExtensionConfiguration = iB8;
    wO1.getValueFromTextNode = nB8;
    wO1.isSerializableHeaderValue = v03;
    wO1.loadConfigsForDefaultMode = M03;
    wO1.map = oB8;
    wO1.resolveDefaultRuntimeConfig = N03;
    wO1.serializeDateTime = S03;
    wO1.serializeFloat = C03;
    wO1.take = k03;
    wO1.throwDefaultError = lB8;
    wO1.withBaseException = D03;
    Object.keys(QB8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(wO1, A)) Object.defineProperty(wO1, A, {
            enumerable: !0,
            get: function() {
                return QB8[A]
            }
        })
    })
})
// @from(Ln 94270, Col 4)
so6 = R((sB8) => {
    Object.defineProperty(sB8, "__esModule", {
        value: !0
    });
    sB8.resolveHttpAuthSchemeConfig = sB8.defaultBedrockHttpAuthSchemeProvider = sB8.defaultBedrockHttpAuthSchemeParametersProvider = void 0;
    var Aj3 = YH(),
        oo6 = lz(),
        ao6 = iP(),
        qj3 = async (A, q, K) => {
            return {
                operation: (0, ao6.getSmithyContext)(q).operation,
                region: await (0, ao6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    sB8.defaultBedrockHttpAuthSchemeParametersProvider = qj3;

    function Kj3(A) {
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

    function Yj3(A) {
        return {
            schemeId: "smithy.api#httpBearerAuth",
            propertiesExtractor: ({
                profile: q,
                filepath: K,
                configFilepath: Y,
                ignoreCache: z
            }, w) => ({
                identityProperties: {
                    profile: q,
                    filepath: K,
                    configFilepath: Y,
                    ignoreCache: z
                }
            })
        }
    }
    var zj3 = (A) => {
        let q = [];
        switch (A.operation) {
            default:
                q.push(Kj3(A)), q.push(Yj3(A))
        }
        return q
    };
    sB8.defaultBedrockHttpAuthSchemeProvider = zj3;
    var wj3 = (A) => {
        let q = (0, oo6.memoizeIdentityProvider)(A.token, oo6.isIdentityExpired, oo6.doesIdentityRequireRefresh),
            K = (0, Aj3.resolveAwsSdkSigV4Config)(A);
        return Object.assign(K, {
            authSchemePreference: (0, ao6.normalizeProvider)(A.authSchemePreference ?? []),
            token: q
        })
    };
    sB8.resolveHttpAuthSchemeConfig = wj3
})
// @from(Ln 94341, Col 4)
eB8 = R((t42, Oj3) => {
    Oj3.exports = {
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
// @from(Ln 94439, Col 4)
Am8 = R((Jj3) => {
    var _j3 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    Jj3.isArrayBuffer = _j3
})
// @from(Ln 94443, Col 4)
eo6 = R((Pj3) => {
    var Dj3 = Am8(),
        to6 = h1("buffer"),
        jj3 = (A, q = 0, K = A.byteLength - q) => {
            if (!Dj3.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return to6.Buffer.from(A, q, K)
        },
        Mj3 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? to6.Buffer.from(A, q) : to6.Buffer.from(A)
        };
    Pj3.fromArrayBuffer = jj3;
    Pj3.fromString = Mj3
})
// @from(Ln 94457, Col 4)
Ym8 = R((qm8) => {
    Object.defineProperty(qm8, "__esModule", {
        value: !0
    });
    qm8.fromBase64 = void 0;
    var Zj3 = eo6(),
        fj3 = /^[A-Za-z0-9+/]*={0,2}$/,
        Vj3 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!fj3.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, Zj3.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    qm8.fromBase64 = Vj3
})
// @from(Ln 94472, Col 4)
Hm8 = R((zm8) => {
    Object.defineProperty(zm8, "__esModule", {
        value: !0
    });
    zm8.toBase64 = void 0;
    var Nj3 = eo6(),
        Tj3 = Z2(),
        vj3 = (A) => {
            let q;
            if (typeof A === "string") q = (0, Tj3.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, Nj3.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    zm8.toBase64 = vj3
})
// @from(Ln 94488, Col 4)
_m8 = R((ZL1) => {
    var $m8 = Ym8(),
        Om8 = Hm8();
    Object.keys($m8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZL1, A)) Object.defineProperty(ZL1, A, {
            enumerable: !0,
            get: function() {
                return $m8[A]
            }
        })
    });
    Object.keys(Om8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(ZL1, A)) Object.defineProperty(ZL1, A, {
            enumerable: !0,
            get: function() {
                return Om8[A]
            }
        })
    })
})
// @from(Ln 94508, Col 4)
km8 = R((vm8) => {
    Object.defineProperty(vm8, "__esModule", {
        value: !0
    });
    vm8.ruleSet = void 0;
    var Vm8 = "required",
        Bb = "fn",
        mb = "argv",
        $O1 = "ref",
        Jm8 = !0,
        Xm8 = "isSet",
        VL1 = "booleanEquals",
        HO1 = "error",
        fL1 = "endpoint",
        gG = "tree",
        Aa6 = "PartitionResult",
        Dm8 = {
            [Vm8]: !1,
            type: "string"
        },
        jm8 = {
            [Vm8]: !0,
            default: !1,
            type: "boolean"
        },
        Mm8 = {
            [$O1]: "Endpoint"
        },
        Nm8 = {
            [Bb]: VL1,
            [mb]: [{
                [$O1]: "UseFIPS"
            }, !0]
        },
        Tm8 = {
            [Bb]: VL1,
            [mb]: [{
                [$O1]: "UseDualStack"
            }, !0]
        },
        ub = {},
        Pm8 = {
            [Bb]: "getAttr",
            [mb]: [{
                [$O1]: Aa6
            }, "supportsFIPS"]
        },
        Wm8 = {
            [Bb]: VL1,
            [mb]: [!0, {
                [Bb]: "getAttr",
                [mb]: [{
                    [$O1]: Aa6
                }, "supportsDualStack"]
            }]
        },
        Gm8 = [Nm8],
        Zm8 = [Tm8],
        fm8 = [{
            [$O1]: "Region"
        }],
        Ej3 = {
            version: "1.0",
            parameters: {
                Region: Dm8,
                UseDualStack: jm8,
                UseFIPS: jm8,
                Endpoint: Dm8
            },
            rules: [{
                conditions: [{
                    [Bb]: Xm8,
                    [mb]: [Mm8]
                }],
                rules: [{
                    conditions: Gm8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: HO1
                }, {
                    rules: [{
                        conditions: Zm8,
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: HO1
                    }, {
                        endpoint: {
                            url: Mm8,
                            properties: ub,
                            headers: ub
                        },
                        type: fL1
                    }],
                    type: gG
                }],
                type: gG
            }, {
                rules: [{
                    conditions: [{
                        [Bb]: Xm8,
                        [mb]: fm8
                    }],
                    rules: [{
                        conditions: [{
                            [Bb]: "aws.partition",
                            [mb]: fm8,
                            assign: Aa6
                        }],
                        rules: [{
                            conditions: [Nm8, Tm8],
                            rules: [{
                                conditions: [{
                                    [Bb]: VL1,
                                    [mb]: [Jm8, Pm8]
                                }, Wm8],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: ub,
                                            headers: ub
                                        },
                                        type: fL1
                                    }],
                                    type: gG
                                }],
                                type: gG
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: HO1
                            }],
                            type: gG
                        }, {
                            conditions: Gm8,
                            rules: [{
                                conditions: [{
                                    [Bb]: VL1,
                                    [mb]: [Pm8, Jm8]
                                }],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-fips.{Region}.{PartitionResult#dnsSuffix}",
                                            properties: ub,
                                            headers: ub
                                        },
                                        type: fL1
                                    }],
                                    type: gG
                                }],
                                type: gG
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: HO1
                            }],
                            type: gG
                        }, {
                            conditions: Zm8,
                            rules: [{
                                conditions: [Wm8],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: ub,
                                            headers: ub
                                        },
                                        type: fL1
                                    }],
                                    type: gG
                                }],
                                type: gG
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: HO1
                            }],
                            type: gG
                        }, {
                            rules: [{
                                endpoint: {
                                    url: "https://bedrock.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: ub,
                                    headers: ub
                                },
                                type: fL1
                            }],
                            type: gG
                        }],
                        type: gG
                    }],
                    type: gG
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: HO1
                }],
                type: gG
            }]
        };
    vm8.ruleSet = Ej3
})
// @from(Ln 94706, Col 4)
ym8 = R((Lm8) => {
    Object.defineProperty(Lm8, "__esModule", {
        value: !0
    });
    Lm8.defaultEndpointResolver = void 0;
    var kj3 = zb(),
        qa6 = GC(),
        Lj3 = km8(),
        Rj3 = new qa6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        yj3 = (A, q = {}) => {
            return Rj3.get(A, () => (0, qa6.resolveEndpoint)(Lj3.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    Lm8.defaultEndpointResolver = yj3;
    qa6.customEndpointFunctions.aws = kj3.awsEndpointFunctions
})
// @from(Ln 94727, Col 4)
xm8 = R((hm8) => {
    Object.defineProperty(hm8, "__esModule", {
        value: !0
    });
    hm8.getRuntimeConfig = void 0;
    var Cj3 = YH(),
        Sj3 = eQ(),
        hj3 = lz(),
        Ij3 = GL1(),
        xj3 = fk(),
        Cm8 = _m8(),
        Sm8 = Z2(),
        bj3 = so6(),
        uj3 = ym8(),
        Bj3 = (A) => {
            return {
                apiVersion: "2023-04-20",
                base64Decoder: A?.base64Decoder ?? Cm8.fromBase64,
                base64Encoder: A?.base64Encoder ?? Cm8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? uj3.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? bj3.defaultBedrockHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new Cj3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#httpBearerAuth"),
                    signer: new hj3.HttpBearerAuthSigner
                }],
                logger: A?.logger ?? new Ij3.NoOpLogger,
                protocol: A?.protocol ?? new Sj3.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.bedrock"
                }),
                serviceId: A?.serviceId ?? "Bedrock",
                urlParser: A?.urlParser ?? xj3.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? Sm8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? Sm8.toUtf8
            }
        };
    hm8.getRuntimeConfig = Bj3
})
// @from(Ln 94771, Col 4)
gm8 = R((Fm8) => {
    Object.defineProperty(Fm8, "__esModule", {
        value: !0
    });
    Fm8.getRuntimeConfig = void 0;
    var mj3 = n2(),
        Fj3 = mj3.__importDefault(eB8()),
        Ka6 = YH(),
        Qj3 = xA1(),
        bm8 = Ve1(),
        um8 = oQ(),
        _A6 = YJ(),
        gj3 = lz(),
        Uj3 = aQ(),
        Bm8 = qM(),
        O81 = af(),
        mm8 = cf(),
        pj3 = sQ(),
        dj3 = _b(),
        cj3 = xm8(),
        lj3 = GL1(),
        ij3 = qg(),
        nj3 = GL1(),
        rj3 = (A) => {
            (0, nj3.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, ij3.resolveDefaultsModeConfig)(A),
                K = () => q().then(lj3.loadConfigsForDefaultMode),
                Y = (0, cj3.getRuntimeConfig)(A);
            (0, Ka6.emitWarningIfUnsupportedVersion)(process.version);
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
                authSchemePreference: A?.authSchemePreference ?? (0, O81.loadConfig)(Ka6.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? pj3.calculateBodyLength,
                credentialDefaultProvider: A?.credentialDefaultProvider ?? Qj3.defaultProvider,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, um8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: Fj3.default.version
                }),
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (w) => w.getIdentityProvider("aws.auth#sigv4"),
                    signer: new Ka6.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (w) => w.getIdentityProvider("smithy.api#httpBearerAuth") || (async (H) => {
                        try {
                            return await (0, bm8.fromEnvSigningName)({
                                signingName: "bedrock"
                            })()
                        } catch ($) {
                            return await (0, bm8.nodeProvider)(H)(H)
                        }
                    }),
                    signer: new gj3.HttpBearerAuthSigner
                }],
                maxAttempts: A?.maxAttempts ?? (0, O81.loadConfig)(Bm8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, O81.loadConfig)(_A6.NODE_REGION_CONFIG_OPTIONS, {
                    ..._A6.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: mm8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, O81.loadConfig)({
                    ...Bm8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || dj3.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? Uj3.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? mm8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, O81.loadConfig)(_A6.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, O81.loadConfig)(_A6.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, O81.loadConfig)(um8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    Fm8.getRuntimeConfig = rj3
})
// @from(Ln 94853, Col 4)
cm8 = R((AM3) => {
    var oj3 = po6(),
        aj3 = (A) => {
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
        sj3 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class Um8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = oj3.FieldPosition.HEADER,
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
    class pm8 {
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
    class JA6 {
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
            let q = new JA6({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = tj3(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return JA6.clone(this)
        }
    }

    function tj3(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class dm8 {
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

    function ej3(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    AM3.Field = Um8;
    AM3.Fields = pm8;
    AM3.HttpRequest = JA6;
    AM3.HttpResponse = dm8;
    AM3.getHttpHandlerExtensionConfiguration = aj3;
    AM3.isValidHostname = ej3;
    AM3.resolveHttpHandlerRuntimeConfig = sj3
})