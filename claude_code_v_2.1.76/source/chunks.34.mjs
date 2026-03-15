
// @from(Ln 82157, Col 4)
yS6 = x((Cj6) => {
    var KrA = Pu(),
        d18 = pT(),
        p18 = g18(),
        mO5 = dO(),
        ArA = FT();
    class YrA {
        config;
        middlewareStack = KrA.constructStack();
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
    var F18 = "***SensitiveInformation***";

    function Q18(A, q) {
        if (q == null) return q;
        let K = mO5.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return F18;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return F18
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return F18
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [_, w] of K.structIterator())
                if (Y[_] != null) z[_] = Q18(w, Y[_]);
            return z
        }
        return q
    }
    class c18 {
        middlewareStack = KrA.constructStack();
        schema;
        static classBuilder() {
            return new zrA
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
                    [p18.SMITHY_CONTEXT_KEY]: {
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
    class zrA {
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
            return q = class extends c18 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (_ ? Q18.bind(null, w) : ($) => $),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (_ ? Q18.bind(null, O) : ($) => $),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var BO5 = "***SensitiveInformation***",
        gO5 = (A, q) => {
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
    class Sj6 extends Error {
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
            return Sj6.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === Sj6) return Sj6.isInstance(A);
            if (Sj6.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var _rA = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        wrA = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = pO5(A),
                _ = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                w = new K({
                    name: q?.code || q?.Code || Y || _ || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw _rA(w, q)
        },
        FO5 = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                wrA({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        pO5 = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        QO5 = (A) => {
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
        qrA = !1,
        UO5 = (A) => {
            if (A && !qrA && parseInt(A.substring(1, A.indexOf("."))) < 16) qrA = !0
        },
        dO5 = (A) => {
            let q = [];
            for (let K in p18.AlgorithmId) {
                let Y = p18.AlgorithmId[K];
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
        cO5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        lO5 = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        iO5 = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        OrA = (A) => {
            return Object.assign(dO5(A), lO5(A))
        },
        nO5 = OrA,
        rO5 = (A) => {
            return Object.assign(cO5(A), iO5(A))
        },
        oO5 = (A) => Array.isArray(A) ? A : [A],
        $rA = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = $rA(A[K]);
            return A
        },
        aO5 = (A) => {
            return A != null
        };
    class HrA {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function jrA(A, q, K) {
        let Y, z, _;
        if (typeof q > "u" && typeof K > "u") Y = {}, _ = A;
        else if (Y = A, typeof q === "function") return z = q, _ = K, eO5(Y, z, _);
        else _ = q;
        for (let w of Object.keys(_)) {
            if (!Array.isArray(_[w])) {
                Y[w] = _[w];
                continue
            }
            JrA(Y, null, _, w)
        }
        return Y
    }
    var sO5 = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        tO5 = (A, q) => {
            let K = {};
            for (let Y in q) JrA(K, A, q, Y);
            return K
        },
        eO5 = (A, q, K) => {
            return jrA(A, Object.entries(K).reduce((Y, [z, _]) => {
                if (Array.isArray(_)) Y[z] = _;
                else if (typeof _ === "function") Y[z] = [q, _()];
                else Y[z] = [q, _];
                return Y
            }, {}))
        },
        JrA = (A, q, K, Y) => {
            if (q !== null) {
                let w = K[Y];
                if (typeof w === "function") w = [, w];
                let [O = A$5, $ = q$5, H = Y] = w;
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
        A$5 = (A) => A != null,
        q$5 = (A) => A,
        K$5 = (A) => {
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
        Y$5 = (A) => A.toISOString().replace(".000Z", "Z"),
        U18 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(U18);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = U18(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(Cj6, "collectBody", {
        enumerable: !0,
        get: function() {
            return d18.collectBody
        }
    });
    Object.defineProperty(Cj6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return d18.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(Cj6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return d18.resolvedPath
        }
    });
    Cj6.Client = YrA;
    Cj6.Command = c18;
    Cj6.NoOpLogger = HrA;
    Cj6.SENSITIVE_STRING = BO5;
    Cj6.ServiceException = Sj6;
    Cj6._json = U18;
    Cj6.convertMap = sO5;
    Cj6.createAggregatedClient = gO5;
    Cj6.decorateServiceException = _rA;
    Cj6.emitWarningIfUnsupportedVersion = UO5;
    Cj6.getArrayIfSingleItem = oO5;
    Cj6.getDefaultClientConfiguration = nO5;
    Cj6.getDefaultExtensionConfiguration = OrA;
    Cj6.getValueFromTextNode = $rA;
    Cj6.isSerializableHeaderValue = aO5;
    Cj6.loadConfigsForDefaultMode = QO5;
    Cj6.map = jrA;
    Cj6.resolveDefaultRuntimeConfig = rO5;
    Cj6.serializeDateTime = Y$5;
    Cj6.serializeFloat = K$5;
    Cj6.take = tO5;
    Cj6.throwDefaultError = wrA;
    Cj6.withBaseException = FO5;
    Object.keys(ArA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(Cj6, A)) Object.defineProperty(Cj6, A, {
            enumerable: !0,
            get: function() {
                return ArA[A]
            }
        })
    })
})
// @from(Ln 82627, Col 4)
i18 = x((MrA) => {
    Object.defineProperty(MrA, "__esModule", {
        value: !0
    });
    MrA.resolveHttpAuthSchemeConfig = MrA.defaultSSOHttpAuthSchemeProvider = MrA.defaultSSOHttpAuthSchemeParametersProvider = void 0;
    var L$5 = Nw(),
        l18 = VW(),
        R$5 = async (A, q, K) => {
            return {
                operation: (0, l18.getSmithyContext)(q).operation,
                region: await (0, l18.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    MrA.defaultSSOHttpAuthSchemeParametersProvider = R$5;

    function h$5(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "awsssoportal",
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

    function KK1(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var S$5 = (A) => {
        let q = [];
        switch (A.operation) {
            case "GetRoleCredentials": {
                q.push(KK1(A));
                break
            }
            case "ListAccountRoles": {
                q.push(KK1(A));
                break
            }
            case "ListAccounts": {
                q.push(KK1(A));
                break
            }
            case "Logout": {
                q.push(KK1(A));
                break
            }
            default:
                q.push(h$5(A))
        }
        return q
    };
    MrA.defaultSSOHttpAuthSchemeProvider = S$5;
    var C$5 = (A) => {
        let q = (0, L$5.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, l18.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    MrA.resolveHttpAuthSchemeConfig = C$5
})
// @from(Ln 82698, Col 4)
XrA = x((SJ_, x$5) => {
    x$5.exports = {
        name: "@aws-sdk/client-sso",
        description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-sso",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
        },
        main: "./dist-cjs/index.js",
        types: "./dist-types/index.d.ts",
        module: "./dist-es/index.js",
        sideEffects: !1,
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
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-sso"
        }
    }
})
// @from(Ln 82794, Col 4)
PrA = x((m$5) => {
    var u$5 = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    m$5.isArrayBuffer = u$5
})
// @from(Ln 82798, Col 4)
r18 = x((Q$5) => {
    var g$5 = PrA(),
        n18 = x6("buffer"),
        F$5 = (A, q = 0, K = A.byteLength - q) => {
            if (!g$5.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return n18.Buffer.from(A, q, K)
        },
        p$5 = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? n18.Buffer.from(A, q) : n18.Buffer.from(A)
        };
    Q$5.fromArrayBuffer = F$5;
    Q$5.fromString = p$5
})
// @from(Ln 82812, Col 4)
GrA = x((WrA) => {
    Object.defineProperty(WrA, "__esModule", {
        value: !0
    });
    WrA.fromBase64 = void 0;
    var c$5 = r18(),
        l$5 = /^[A-Za-z0-9+/]*={0,2}$/,
        i$5 = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!l$5.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, c$5.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    WrA.fromBase64 = i$5
})
// @from(Ln 82827, Col 4)
vrA = x((frA) => {
    Object.defineProperty(frA, "__esModule", {
        value: !0
    });
    frA.toBase64 = void 0;
    var n$5 = r18(),
        r$5 = C_(),
        o$5 = (A) => {
            let q;
            if (typeof A === "string") q = (0, r$5.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, n$5.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    frA.toBase64 = o$5
})
// @from(Ln 82843, Col 4)
krA = x((LS6) => {
    var NrA = GrA(),
        VrA = vrA();
    Object.keys(NrA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(LS6, A)) Object.defineProperty(LS6, A, {
            enumerable: !0,
            get: function() {
                return NrA[A]
            }
        })
    });
    Object.keys(VrA).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(LS6, A)) Object.defineProperty(LS6, A, {
            enumerable: !0,
            get: function() {
                return VrA[A]
            }
        })
    })
})
// @from(Ln 82863, Col 4)
QrA = x((FrA) => {
    Object.defineProperty(FrA, "__esModule", {
        value: !0
    });
    FrA.ruleSet = void 0;
    var urA = "required",
        gy = "fn",
        Fy = "argv",
        xj6 = "ref",
        ErA = !0,
        yrA = "isSet",
        RS6 = "booleanEquals",
        Ij6 = "error",
        bj6 = "endpoint",
        CQ = "tree",
        o18 = "PartitionResult",
        a18 = "getAttr",
        LrA = {
            [urA]: !1,
            type: "string"
        },
        RrA = {
            [urA]: !0,
            default: !1,
            type: "boolean"
        },
        hrA = {
            [xj6]: "Endpoint"
        },
        mrA = {
            [gy]: RS6,
            [Fy]: [{
                [xj6]: "UseFIPS"
            }, !0]
        },
        BrA = {
            [gy]: RS6,
            [Fy]: [{
                [xj6]: "UseDualStack"
            }, !0]
        },
        By = {},
        SrA = {
            [gy]: a18,
            [Fy]: [{
                [xj6]: o18
            }, "supportsFIPS"]
        },
        grA = {
            [xj6]: o18
        },
        CrA = {
            [gy]: RS6,
            [Fy]: [!0, {
                [gy]: a18,
                [Fy]: [grA, "supportsDualStack"]
            }]
        },
        IrA = [mrA],
        brA = [BrA],
        xrA = [{
            [xj6]: "Region"
        }],
        a$5 = {
            version: "1.0",
            parameters: {
                Region: LrA,
                UseDualStack: RrA,
                UseFIPS: RrA,
                Endpoint: LrA
            },
            rules: [{
                conditions: [{
                    [gy]: yrA,
                    [Fy]: [hrA]
                }],
                rules: [{
                    conditions: IrA,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: Ij6
                }, {
                    conditions: brA,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: Ij6
                }, {
                    endpoint: {
                        url: hrA,
                        properties: By,
                        headers: By
                    },
                    type: bj6
                }],
                type: CQ
            }, {
                conditions: [{
                    [gy]: yrA,
                    [Fy]: xrA
                }],
                rules: [{
                    conditions: [{
                        [gy]: "aws.partition",
                        [Fy]: xrA,
                        assign: o18
                    }],
                    rules: [{
                        conditions: [mrA, BrA],
                        rules: [{
                            conditions: [{
                                [gy]: RS6,
                                [Fy]: [ErA, SrA]
                            }, CrA],
                            rules: [{
                                endpoint: {
                                    url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: By,
                                    headers: By
                                },
                                type: bj6
                            }],
                            type: CQ
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: Ij6
                        }],
                        type: CQ
                    }, {
                        conditions: IrA,
                        rules: [{
                            conditions: [{
                                [gy]: RS6,
                                [Fy]: [SrA, ErA]
                            }],
                            rules: [{
                                conditions: [{
                                    [gy]: "stringEquals",
                                    [Fy]: [{
                                        [gy]: a18,
                                        [Fy]: [grA, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://portal.sso.{Region}.amazonaws.com",
                                    properties: By,
                                    headers: By
                                },
                                type: bj6
                            }, {
                                endpoint: {
                                    url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: By,
                                    headers: By
                                },
                                type: bj6
                            }],
                            type: CQ
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: Ij6
                        }],
                        type: CQ
                    }, {
                        conditions: brA,
                        rules: [{
                            conditions: [CrA],
                            rules: [{
                                endpoint: {
                                    url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: By,
                                    headers: By
                                },
                                type: bj6
                            }],
                            type: CQ
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: Ij6
                        }],
                        type: CQ
                    }, {
                        endpoint: {
                            url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
                            properties: By,
                            headers: By
                        },
                        type: bj6
                    }],
                    type: CQ
                }],
                type: CQ
            }, {
                error: "Invalid Configuration: Missing Region",
                type: Ij6
            }]
        };
    FrA.ruleSet = a$5
})
// @from(Ln 83059, Col 4)
crA = x((UrA) => {
    Object.defineProperty(UrA, "__esModule", {
        value: !0
    });
    UrA.defaultEndpointResolver = void 0;
    var s$5 = Zu(),
        s18 = nS(),
        t$5 = QrA(),
        e$5 = new s18.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        AH5 = (A, q = {}) => {
            return e$5.get(A, () => (0, s18.resolveEndpoint)(t$5.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    UrA.defaultEndpointResolver = AH5;
    s18.customEndpointFunctions.aws = s$5.awsEndpointFunctions
})
// @from(Ln 83080, Col 4)
orA = x((nrA) => {
    Object.defineProperty(nrA, "__esModule", {
        value: !0
    });
    nrA.getRuntimeConfig = void 0;
    var qH5 = Nw(),
        KH5 = RQ(),
        YH5 = w_(),
        zH5 = yS6(),
        _H5 = hy(),
        lrA = krA(),
        irA = C_(),
        wH5 = i18(),
        OH5 = crA(),
        $H5 = (A) => {
            return {
                apiVersion: "2019-06-10",
                base64Decoder: A?.base64Decoder ?? lrA.fromBase64,
                base64Encoder: A?.base64Encoder ?? lrA.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? OH5.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? wH5.defaultSSOHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new qH5.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new YH5.NoAuthSigner
                }],
                logger: A?.logger ?? new zH5.NoOpLogger,
                protocol: A?.protocol ?? new KH5.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.sso"
                }),
                serviceId: A?.serviceId ?? "SSO",
                urlParser: A?.urlParser ?? _H5.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? irA.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? irA.toUtf8
            }
        };
    nrA.getRuntimeConfig = $H5
})
// @from(Ln 83124, Col 4)
KoA = x((AoA) => {
    Object.defineProperty(AoA, "__esModule", {
        value: !0
    });
    AoA.getRuntimeConfig = void 0;
    var HH5 = _2(),
        jH5 = HH5.__importDefault(XrA()),
        arA = Nw(),
        srA = kQ(),
        YK1 = Nj(),
        JH5 = EQ(),
        trA = kP(),
        _46 = BT(),
        erA = uT(),
        MH5 = yQ(),
        DH5 = Tu(),
        XH5 = orA(),
        PH5 = yS6(),
        WH5 = SQ(),
        ZH5 = yS6(),
        GH5 = (A) => {
            (0, ZH5.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, WH5.resolveDefaultsModeConfig)(A),
                K = () => q().then(PH5.loadConfigsForDefaultMode),
                Y = (0, XH5.getRuntimeConfig)(A);
            (0, arA.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, _46.loadConfig)(arA.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? MH5.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, srA.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: jH5.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, _46.loadConfig)(trA.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, _46.loadConfig)(YK1.NODE_REGION_CONFIG_OPTIONS, {
                    ...YK1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: erA.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, _46.loadConfig)({
                    ...trA.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || DH5.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? JH5.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? erA.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, _46.loadConfig)(YK1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, _46.loadConfig)(YK1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, _46.loadConfig)(srA.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    AoA.getRuntimeConfig = GH5
})
// @from(Ln 83184, Col 4)
woA = x((kH5) => {
    var fH5 = g18(),
        TH5 = (A) => {
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
        vH5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class YoA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = fH5.FieldPosition.HEADER,
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
    class zoA {
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
    class zK1 {
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
            let q = new zK1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = NH5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return zK1.clone(this)
        }
    }

    function NH5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class _oA {
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

    function VH5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    kH5.Field = YoA;
    kH5.Fields = zoA;
    kH5.HttpRequest = zK1;
    kH5.HttpResponse = _oA;
    kH5.getHttpHandlerExtensionConfiguration = TH5;
    kH5.isValidHostname = VH5;
    kH5.resolveHttpHandlerRuntimeConfig = vH5
})
// @from(Ln 83326, Col 4)
VoA = x((q88) => {
    var OoA = PQ(),
        IH5 = WQ(),
        bH5 = ZQ(),
        $oA = fu(),
        xH5 = Nj(),
        hS6 = w_(),
        uj6 = dO(),
        uH5 = VQ(),
        SS6 = rS(),
        HoA = kP(),
        tS = yS6(),
        joA = i18(),
        mH5 = KoA(),
        JoA = oS(),
        MoA = woA(),
        BH5 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "awsssoportal"
            })
        },
        _K1 = {
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
        gH5 = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y
            } = A;
            return {
                setHttpAuthScheme(z) {
                    let _ = q.findIndex((w) => w.schemeId === z.schemeId);
                    if (_ === -1) q.push(z);
                    else q.splice(_, 1, z)
                },
                httpAuthSchemes() {
                    return q
                },
                setHttpAuthSchemeProvider(z) {
                    K = z
                },
                httpAuthSchemeProvider() {
                    return K
                },
                setCredentials(z) {
                    Y = z
                },
                credentials() {
                    return Y
                }
            }
        },
        FH5 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        pH5 = (A, q) => {
            let K = Object.assign(JoA.getAwsRegionExtensionConfiguration(A), tS.getDefaultExtensionConfiguration(A), MoA.getHttpHandlerExtensionConfiguration(A), gH5(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, JoA.resolveAwsRegionExtensionConfiguration(K), tS.resolveDefaultRuntimeConfig(K), MoA.resolveHttpHandlerRuntimeConfig(K), FH5(K))
        };
    class CS6 extends tS.Client {
        config;
        constructor(...[A]) {
            let q = mH5.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = BH5(q),
                Y = $oA.resolveUserAgentConfig(K),
                z = HoA.resolveRetryConfig(Y),
                _ = xH5.resolveRegionConfig(z),
                w = OoA.resolveHostHeaderConfig(_),
                O = SS6.resolveEndpointConfig(w),
                $ = joA.resolveHttpAuthSchemeConfig(O),
                H = pH5($, A?.extensions || []);
            this.config = H, this.middlewareStack.use(uj6.getSchemaSerdePlugin(this.config)), this.middlewareStack.use($oA.getUserAgentPlugin(this.config)), this.middlewareStack.use(HoA.getRetryPlugin(this.config)), this.middlewareStack.use(uH5.getContentLengthPlugin(this.config)), this.middlewareStack.use(OoA.getHostHeaderPlugin(this.config)), this.middlewareStack.use(IH5.getLoggerPlugin(this.config)), this.middlewareStack.use(bH5.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(hS6.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: joA.defaultSSOHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new hS6.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials
                })
            })), this.middlewareStack.use(hS6.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var mj6 = class A extends tS.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        DoA = class A extends mj6 {
            name = "InvalidRequestException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "InvalidRequestException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        XoA = class A extends mj6 {
            name = "ResourceNotFoundException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "ResourceNotFoundException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        PoA = class A extends mj6 {
            name = "TooManyRequestsException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "TooManyRequestsException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        WoA = class A extends mj6 {
            name = "UnauthorizedException";
            $fault = "client";
            constructor(q) {
                super({
                    name: "UnauthorizedException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        QH5 = "AccountInfo",
        UH5 = "AccountListType",
        dH5 = "AccessTokenType",
        cH5 = "GetRoleCredentials",
        lH5 = "GetRoleCredentialsRequest",
        iH5 = "GetRoleCredentialsResponse",
        nH5 = "InvalidRequestException",
        rH5 = "Logout",
        oH5 = "ListAccounts",
        aH5 = "ListAccountsRequest",
        sH5 = "ListAccountRolesRequest",
        tH5 = "ListAccountRolesResponse",
        eH5 = "ListAccountsResponse",
        Aj5 = "ListAccountRoles",
        qj5 = "LogoutRequest",
        Kj5 = "RoleCredentials",
        Yj5 = "RoleInfo",
        zj5 = "RoleListType",
        _j5 = "ResourceNotFoundException",
        wj5 = "SecretAccessKeyType",
        Oj5 = "SessionTokenType",
        $j5 = "TooManyRequestsException",
        Hj5 = "UnauthorizedException",
        wK1 = "accountId",
        jj5 = "accessKeyId",
        Jj5 = "accountList",
        Mj5 = "accountName",
        OK1 = "accessToken",
        ZoA = "account_id",
        $K1 = "client",
        HK1 = "error",
        Dj5 = "emailAddress",
        Xj5 = "expiration",
        jK1 = "http",
        JK1 = "httpError",
        MK1 = "httpHeader",
        w46 = "httpQuery",
        DK1 = "message",
        GoA = "maxResults",
        foA = "max_result",
        XK1 = "nextToken",
        ToA = "next_token",
        Pj5 = "roleCredentials",
        Wj5 = "roleList",
        voA = "roleName",
        Zj5 = "role_name",
        NoA = "smithy.ts.sdk.synthetic.com.amazonaws.sso",
        Gj5 = "secretAccessKey",
        fj5 = "sessionToken",
        PK1 = "x-amz-sso_bearer_token",
        B2 = "com.amazonaws.sso",
        WK1 = [0, B2, dH5, 8, 0],
        Tj5 = [0, B2, wj5, 8, 0],
        vj5 = [0, B2, Oj5, 8, 0],
        Nj5 = [3, B2, QH5, 0, [wK1, Mj5, Dj5],
            [0, 0, 0]
        ],
        Vj5 = [3, B2, lH5, 0, [voA, wK1, OK1],
            [
                [0, {
                    [w46]: Zj5
                }],
                [0, {
                    [w46]: ZoA
                }],
                [() => WK1, {
                    [MK1]: PK1
                }]
            ]
        ],
        kj5 = [3, B2, iH5, 0, [Pj5],
            [
                [() => Ij5, 0]
            ]
        ],
        Ej5 = [-3, B2, nH5, {
                [HK1]: $K1,
                [JK1]: 400
            },
            [DK1],
            [0]
        ];
    uj6.TypeRegistry.for(B2).registerError(Ej5, DoA);
    var yj5 = [3, B2, sH5, 0, [XK1, GoA, OK1, wK1],
            [
                [0, {
                    [w46]: ToA
                }],
                [1, {
                    [w46]: foA
                }],
                [() => WK1, {
                    [MK1]: PK1
                }],
                [0, {
                    [w46]: ZoA
                }]
            ]
        ],
        Lj5 = [3, B2, tH5, 0, [XK1, Wj5],
            [0, () => Fj5]
        ],
        Rj5 = [3, B2, aH5, 0, [XK1, GoA, OK1],
            [
                [0, {
                    [w46]: ToA
                }],
                [1, {
                    [w46]: foA
                }],
                [() => WK1, {
                    [MK1]: PK1
                }]
            ]
        ],
        hj5 = [3, B2, eH5, 0, [XK1, Jj5],
            [0, () => gj5]
        ],
        Sj5 = [3, B2, qj5, 0, [OK1],
            [
                [() => WK1, {
                    [MK1]: PK1
                }]
            ]
        ],
        Cj5 = [-3, B2, _j5, {
                [HK1]: $K1,
                [JK1]: 404
            },
            [DK1],
            [0]
        ];
    uj6.TypeRegistry.for(B2).registerError(Cj5, XoA);
    var Ij5 = [3, B2, Kj5, 0, [jj5, Gj5, fj5, Xj5],
            [0, [() => Tj5, 0],
                [() => vj5, 0], 1
            ]
        ],
        bj5 = [3, B2, Yj5, 0, [voA, wK1],
            [0, 0]
        ],
        xj5 = [-3, B2, $j5, {
                [HK1]: $K1,
                [JK1]: 429
            },
            [DK1],
            [0]
        ];
    uj6.TypeRegistry.for(B2).registerError(xj5, PoA);
    var uj5 = [-3, B2, Hj5, {
            [HK1]: $K1,
            [JK1]: 401
        },
        [DK1],
        [0]
    ];
    uj6.TypeRegistry.for(B2).registerError(uj5, WoA);
    var mj5 = "unit",
        Bj5 = [-3, NoA, "SSOServiceException", 0, [],
            []
        ];
    uj6.TypeRegistry.for(NoA).registerError(Bj5, mj6);
    var gj5 = [1, B2, UH5, 0, () => Nj5],
        Fj5 = [1, B2, zj5, 0, () => bj5],
        pj5 = [9, B2, cH5, {
            [jK1]: ["GET", "/federation/credentials", 200]
        }, () => Vj5, () => kj5],
        Qj5 = [9, B2, Aj5, {
            [jK1]: ["GET", "/assignment/roles", 200]
        }, () => yj5, () => Lj5],
        Uj5 = [9, B2, oH5, {
            [jK1]: ["GET", "/assignment/accounts", 200]
        }, () => Rj5, () => hj5],
        dj5 = [9, B2, rH5, {
            [jK1]: ["POST", "/logout", 200]
        }, () => Sj5, () => mj5];
    class t18 extends tS.Command.classBuilder().ep(_K1).m(function(A, q, K, Y) {
        return [SS6.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").sc(pj5).build() {}
    class ZK1 extends tS.Command.classBuilder().ep(_K1).m(function(A, q, K, Y) {
        return [SS6.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").sc(Qj5).build() {}
    class GK1 extends tS.Command.classBuilder().ep(_K1).m(function(A, q, K, Y) {
        return [SS6.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").sc(Uj5).build() {}
    class e18 extends tS.Command.classBuilder().ep(_K1).m(function(A, q, K, Y) {
        return [SS6.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").sc(dj5).build() {}
    var cj5 = {
        GetRoleCredentialsCommand: t18,
        ListAccountRolesCommand: ZK1,
        ListAccountsCommand: GK1,
        LogoutCommand: e18
    };
    class A88 extends CS6 {}
    tS.createAggregatedClient(cj5, A88);
    var lj5 = hS6.createPaginator(CS6, ZK1, "nextToken", "nextToken", "maxResults"),
        ij5 = hS6.createPaginator(CS6, GK1, "nextToken", "nextToken", "maxResults");
    Object.defineProperty(q88, "$Command", {
        enumerable: !0,
        get: function() {
            return tS.Command
        }
    });
    Object.defineProperty(q88, "__Client", {
        enumerable: !0,
        get: function() {
            return tS.Client
        }
    });
    q88.GetRoleCredentialsCommand = t18;
    q88.InvalidRequestException = DoA;
    q88.ListAccountRolesCommand = ZK1;
    q88.ListAccountsCommand = GK1;
    q88.LogoutCommand = e18;
    q88.ResourceNotFoundException = XoA;
    q88.SSO = A88;
    q88.SSOClient = CS6;
    q88.SSOServiceException = mj6;
    q88.TooManyRequestsException = PoA;
    q88.UnauthorizedException = WoA;
    q88.paginateListAccountRoles = lj5;
    q88.paginateListAccounts = ij5
})
// @from(Ln 83710, Col 4)
EoA = x((K88) => {
    var koA = VoA();
    Object.defineProperty(K88, "GetRoleCredentialsCommand", {
        enumerable: !0,
        get: function() {
            return koA.GetRoleCredentialsCommand
        }
    });
    Object.defineProperty(K88, "SSOClient", {
        enumerable: !0,
        get: function() {
            return koA.SSOClient
        }
    })
})
// @from(Ln 83725, Col 4)
TK1 = x(($J5) => {
    var eS = vJ(),
        fK1 = Du(),
        yoA = mT(),
        wJ5 = qK1(),
        RoA = (A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"),
        IS6 = !1,
        LoA = async ({
            ssoStartUrl: A,
            ssoSession: q,
            ssoAccountId: K,
            ssoRegion: Y,
            ssoRoleName: z,
            ssoClient: _,
            clientConfig: w,
            parentClientConfig: O,
            profile: $,
            filepath: H,
            configFilepath: j,
            ignoreCache: J,
            logger: M
        }) => {
            let D, X = "To refresh this SSO session run aws sso login with the corresponding profile.";
            if (q) try {
                let I = await wJ5.fromSso({
                    profile: $,
                    filepath: H,
                    configFilepath: j,
                    ignoreCache: J
                })();
                D = {
                    accessToken: I.token,
                    expiresAt: new Date(I.expiration).toISOString()
                }
            } catch (I) {
                throw new eS.CredentialsProviderError(I.message, {
                    tryNextLink: IS6,
                    logger: M
                })
            } else try {
                D = await fK1.getSSOTokenFromFile(A)
            } catch (I) {
                throw new eS.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
                    tryNextLink: IS6,
                    logger: M
                })
            }
            if (new Date(D.expiresAt).getTime() - Date.now() <= 0) throw new eS.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
                tryNextLink: IS6,
                logger: M
            });
            let {
                accessToken: P
            } = D, {
                SSOClient: W,
                GetRoleCredentialsCommand: Z
            } = await Promise.resolve().then(function() {
                return EoA()
            }), G = _ || new W(Object.assign({}, w ?? {}, {
                logger: w?.logger ?? O?.logger,
                region: w?.region ?? Y,
                userAgentAppId: w?.userAgentAppId ?? O?.userAgentAppId
            })), f;
            try {
                f = await G.send(new Z({
                    accountId: K,
                    roleName: z,
                    accessToken: P
                }))
            } catch (I) {
                throw new eS.CredentialsProviderError(I, {
                    tryNextLink: IS6,
                    logger: M
                })
            }
            let {
                roleCredentials: {
                    accessKeyId: v,
                    secretAccessKey: N,
                    sessionToken: V,
                    expiration: L,
                    credentialScope: h,
                    accountId: R
                } = {}
            } = f;
            if (!v || !N || !V || !L) throw new eS.CredentialsProviderError("SSO returns an invalid temporary credential.", {
                tryNextLink: IS6,
                logger: M
            });
            let u = {
                accessKeyId: v,
                secretAccessKey: N,
                sessionToken: V,
                expiration: new Date(L),
                ...h && {
                    credentialScope: h
                },
                ...R && {
                    accountId: R
                }
            };
            if (q) yoA.setCredentialFeature(u, "CREDENTIALS_SSO", "s");
            else yoA.setCredentialFeature(u, "CREDENTIALS_SSO_LEGACY", "u");
            return u
        }, hoA = (A, q) => {
            let {
                sso_start_url: K,
                sso_account_id: Y,
                sso_region: z,
                sso_role_name: _
            } = A;
            if (!K || !Y || !z || !_) throw new eS.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
                tryNextLink: !1,
                logger: q
            });
            return A
        }, OJ5 = (A = {}) => async ({
            callerClientConfig: q
        } = {}) => {
            A.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
            let {
                ssoStartUrl: K,
                ssoAccountId: Y,
                ssoRegion: z,
                ssoRoleName: _,
                ssoSession: w
            } = A, {
                ssoClient: O
            } = A, $ = fK1.getProfileName({
                profile: A.profile ?? q?.profile
            });
            if (!K && !Y && !z && !_ && !w) {
                let j = (await fK1.parseKnownFiles(A))[$];
                if (!j) throw new eS.CredentialsProviderError(`Profile ${$} was not found.`, {
                    logger: A.logger
                });
                if (!RoA(j)) throw new eS.CredentialsProviderError(`Profile ${$} is not configured with SSO credentials.`, {
                    logger: A.logger
                });
                if (j?.sso_session) {
                    let Z = (await fK1.loadSsoSessionData(A))[j.sso_session],
                        G = ` configurations in profile ${$} and sso-session ${j.sso_session}`;
                    if (z && z !== Z.sso_region) throw new eS.CredentialsProviderError("Conflicting SSO region" + G, {
                        tryNextLink: !1,
                        logger: A.logger
                    });
                    if (K && K !== Z.sso_start_url) throw new eS.CredentialsProviderError("Conflicting SSO start_url" + G, {
                        tryNextLink: !1,
                        logger: A.logger
                    });
                    j.sso_region = Z.sso_region, j.sso_start_url = Z.sso_start_url
                }
                let {
                    sso_start_url: J,
                    sso_account_id: M,
                    sso_region: D,
                    sso_role_name: X,
                    sso_session: P
                } = hoA(j, A.logger);
                return LoA({
                    ssoStartUrl: J,
                    ssoSession: P,
                    ssoAccountId: M,
                    ssoRegion: D,
                    ssoRoleName: X,
                    ssoClient: O,
                    clientConfig: A.clientConfig,
                    parentClientConfig: A.parentClientConfig,
                    profile: $,
                    filepath: A.filepath,
                    configFilepath: A.configFilepath,
                    ignoreCache: A.ignoreCache,
                    logger: A.logger
                })
            } else if (!K || !Y || !z || !_) throw new eS.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
                tryNextLink: !1,
                logger: A.logger
            });
            else return LoA({
                ssoStartUrl: K,
                ssoSession: w,
                ssoAccountId: Y,
                ssoRegion: z,
                ssoRoleName: _,
                ssoClient: O,
                clientConfig: A.clientConfig,
                parentClientConfig: A.parentClientConfig,
                profile: $,
                filepath: A.filepath,
                configFilepath: A.configFilepath,
                ignoreCache: A.ignoreCache,
                logger: A.logger
            })
        };
    $J5.fromSSO = OJ5;
    $J5.isSsoProfile = RoA;
    $J5.validateSsoProfile = hoA
})
// @from(Ln 83924, Col 4)
SoA = x((ZJ5) => {
    ZJ5.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ZJ5.HttpAuthLocation || (ZJ5.HttpAuthLocation = {}));
    ZJ5.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(ZJ5.HttpApiKeyAuthLocation || (ZJ5.HttpApiKeyAuthLocation = {}));
    ZJ5.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(ZJ5.EndpointURLScheme || (ZJ5.EndpointURLScheme = {}));
    ZJ5.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(ZJ5.AlgorithmId || (ZJ5.AlgorithmId = {}));
    var MJ5 = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => ZJ5.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => ZJ5.AlgorithmId.MD5,
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
        DJ5 = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        XJ5 = (A) => {
            return MJ5(A)
        },
        PJ5 = (A) => {
            return DJ5(A)
        };
    ZJ5.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(ZJ5.FieldPosition || (ZJ5.FieldPosition = {}));
    var WJ5 = "__smithy_context";
    ZJ5.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(ZJ5.IniSectionType || (ZJ5.IniSectionType = {}));
    ZJ5.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(ZJ5.RequestHandlerProtocol || (ZJ5.RequestHandlerProtocol = {}));
    ZJ5.SMITHY_CONTEXT_KEY = WJ5;
    ZJ5.getDefaultClientConfiguration = XJ5;
    ZJ5.resolveDefaultRuntimeConfig = PJ5
})
// @from(Ln 83989, Col 4)
xoA = x((yJ5) => {
    var vJ5 = SoA(),
        NJ5 = (A) => {
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
        VJ5 = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class CoA {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = vJ5.FieldPosition.HEADER,
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
    class IoA {
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
    class vK1 {
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
            let q = new vK1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = kJ5(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return vK1.clone(this)
        }
    }

    function kJ5(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class boA {
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

    function EJ5(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    yJ5.Field = CoA;
    yJ5.Fields = IoA;
    yJ5.HttpRequest = vK1;
    yJ5.HttpResponse = boA;
    yJ5.getHttpHandlerExtensionConfiguration = NJ5;
    yJ5.isValidHostname = EJ5;
    yJ5.resolveHttpHandlerRuntimeConfig = VJ5
})
// @from(Ln 84131, Col 4)
j88 = x((uoA) => {
    Object.defineProperty(uoA, "__esModule", {
        value: !0
    });
    uoA.resolveHttpAuthSchemeConfig = uoA.defaultSigninHttpAuthSchemeProvider = uoA.defaultSigninHttpAuthSchemeParametersProvider = void 0;
    var xJ5 = Nw(),
        H88 = VW(),
        uJ5 = async (A, q, K) => {
            return {
                operation: (0, H88.getSmithyContext)(q).operation,
                region: await (0, H88.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    uoA.defaultSigninHttpAuthSchemeParametersProvider = uJ5;

    function mJ5(A) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "signin",
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

    function BJ5(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var gJ5 = (A) => {
        let q = [];
        switch (A.operation) {
            case "CreateOAuth2Token": {
                q.push(BJ5(A));
                break
            }
            default:
                q.push(mJ5(A))
        }
        return q
    };
    uoA.defaultSigninHttpAuthSchemeProvider = gJ5;
    var FJ5 = (A) => {
        let q = (0, xJ5.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, H88.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    uoA.resolveHttpAuthSchemeConfig = FJ5
})
// @from(Ln 84190, Col 4)
roA = x((ioA) => {
    Object.defineProperty(ioA, "__esModule", {
        value: !0
    });
    ioA.ruleSet = void 0;
    var loA = "required",
        yW = "fn",
        LW = "argv",
        IQ = "ref",
        BoA = !0,
        goA = "isSet",
        O46 = "booleanEquals",
        Bj6 = "error",
        Ao = "endpoint",
        AC = "tree",
        kK1 = "PartitionResult",
        J88 = "stringEquals",
        FoA = {
            [loA]: !0,
            default: !1,
            type: "boolean"
        },
        poA = {
            [loA]: !1,
            type: "string"
        },
        QoA = {
            [IQ]: "Endpoint"
        },
        M88 = {
            [yW]: O46,
            [LW]: [{
                [IQ]: "UseFIPS"
            }, !0]
        },
        D88 = {
            [yW]: O46,
            [LW]: [{
                [IQ]: "UseDualStack"
            }, !0]
        },
        EW = {},
        X88 = {
            [yW]: "getAttr",
            [LW]: [{
                [IQ]: kK1
            }, "name"]
        },
        NK1 = {
            [yW]: O46,
            [LW]: [{
                [IQ]: "UseFIPS"
            }, !1]
        },
        VK1 = {
            [yW]: O46,
            [LW]: [{
                [IQ]: "UseDualStack"
            }, !1]
        },
        UoA = {
            [yW]: "getAttr",
            [LW]: [{
                [IQ]: kK1
            }, "supportsFIPS"]
        },
        doA = {
            [yW]: O46,
            [LW]: [!0, {
                [yW]: "getAttr",
                [LW]: [{
                    [IQ]: kK1
                }, "supportsDualStack"]
            }]
        },
        coA = [{
            [IQ]: "Region"
        }],
        UJ5 = {
            version: "1.0",
            parameters: {
                UseDualStack: FoA,
                UseFIPS: FoA,
                Endpoint: poA,
                Region: poA
            },
            rules: [{
                conditions: [{
                    [yW]: goA,
                    [LW]: [QoA]
                }],
                rules: [{
                    conditions: [M88],
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: Bj6
                }, {
                    rules: [{
                        conditions: [D88],
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: Bj6
                    }, {
                        endpoint: {
                            url: QoA,
                            properties: EW,
                            headers: EW
                        },
                        type: Ao
                    }],
                    type: AC
                }],
                type: AC
            }, {
                rules: [{
                    conditions: [{
                        [yW]: goA,
                        [LW]: coA
                    }],
                    rules: [{
                        conditions: [{
                            [yW]: "aws.partition",
                            [LW]: coA,
                            assign: kK1
                        }],
                        rules: [{
                            conditions: [{
                                [yW]: J88,
                                [LW]: [X88, "aws"]
                            }, NK1, VK1],
                            endpoint: {
                                url: "https://{Region}.signin.aws.amazon.com",
                                properties: EW,
                                headers: EW
                            },
                            type: Ao
                        }, {
                            conditions: [{
                                [yW]: J88,
                                [LW]: [X88, "aws-cn"]
                            }, NK1, VK1],
                            endpoint: {
                                url: "https://{Region}.signin.amazonaws.cn",
                                properties: EW,
                                headers: EW
                            },
                            type: Ao
                        }, {
                            conditions: [{
                                [yW]: J88,
                                [LW]: [X88, "aws-us-gov"]
                            }, NK1, VK1],
                            endpoint: {
                                url: "https://{Region}.signin.amazonaws-us-gov.com",
                                properties: EW,
                                headers: EW
                            },
                            type: Ao
                        }, {
                            conditions: [M88, D88],
                            rules: [{
                                conditions: [{
                                    [yW]: O46,
                                    [LW]: [BoA, UoA]
                                }, doA],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                        properties: EW,
                                        headers: EW
                                    },
                                    type: Ao
                                }],
                                type: AC
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: Bj6
                            }],
                            type: AC
                        }, {
                            conditions: [M88, VK1],
                            rules: [{
                                conditions: [{
                                    [yW]: O46,
                                    [LW]: [UoA, BoA]
                                }],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
                                        properties: EW,
                                        headers: EW
                                    },
                                    type: Ao
                                }],
                                type: AC
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: Bj6
                            }],
                            type: AC
                        }, {
                            conditions: [NK1, D88],
                            rules: [{
                                conditions: [doA],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                        properties: EW,
                                        headers: EW
                                    },
                                    type: Ao
                                }],
                                type: AC
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: Bj6
                            }],
                            type: AC
                        }, {
                            endpoint: {
                                url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
                                properties: EW,
                                headers: EW
                            },
                            type: Ao
                        }],
                        type: AC
                    }],
                    type: AC
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: Bj6
                }],
                type: AC
            }]
        };
    ioA.ruleSet = UJ5
})
// @from(Ln 84426, Col 4)
soA = x((ooA) => {
    Object.defineProperty(ooA, "__esModule", {
        value: !0
    });
    ooA.defaultEndpointResolver = void 0;
    var dJ5 = Zu(),
        P88 = nS(),
        cJ5 = roA(),
        lJ5 = new P88.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        iJ5 = (A, q = {}) => {
            return lJ5.get(A, () => (0, P88.resolveEndpoint)(cJ5.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    ooA.defaultEndpointResolver = iJ5;
    P88.customEndpointFunctions.aws = dJ5.awsEndpointFunctions
})
// @from(Ln 84447, Col 4)
KaA = x((AaA) => {
    Object.defineProperty(AaA, "__esModule", {
        value: !0
    });
    AaA.getRuntimeConfig = void 0;
    var nJ5 = Nw(),
        rJ5 = RQ(),
        oJ5 = w_(),
        aJ5 = fG(),
        sJ5 = hy(),
        toA = sq1(),
        eoA = C_(),
        tJ5 = j88(),
        eJ5 = soA(),
        AM5 = (A) => {
            return {
                apiVersion: "2023-01-01",
                base64Decoder: A?.base64Decoder ?? toA.fromBase64,
                base64Encoder: A?.base64Encoder ?? toA.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? eJ5.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? tJ5.defaultSigninHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new nJ5.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new oJ5.NoAuthSigner
                }],
                logger: A?.logger ?? new aJ5.NoOpLogger,
                protocol: A?.protocol ?? new rJ5.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.signin"
                }),
                serviceId: A?.serviceId ?? "Signin",
                urlParser: A?.urlParser ?? sJ5.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? eoA.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? eoA.toUtf8
            }
        };
    AaA.getRuntimeConfig = AM5
})
// @from(Ln 84491, Col 4)
HaA = x((OaA) => {
    Object.defineProperty(OaA, "__esModule", {
        value: !0
    });
    OaA.getRuntimeConfig = void 0;
    var qM5 = _2(),
        KM5 = qM5.__importDefault(nq1()),
        YaA = Nw(),
        zaA = kQ(),
        EK1 = Nj(),
        YM5 = EQ(),
        _aA = kP(),
        $46 = BT(),
        waA = uT(),
        zM5 = yQ(),
        _M5 = Tu(),
        wM5 = KaA(),
        OM5 = fG(),
        $M5 = SQ(),
        HM5 = fG(),
        jM5 = (A) => {
            (0, HM5.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, $M5.resolveDefaultsModeConfig)(A),
                K = () => q().then(OM5.loadConfigsForDefaultMode),
                Y = (0, wM5.getRuntimeConfig)(A);
            (0, YaA.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, $46.loadConfig)(YaA.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? zM5.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, zaA.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: KM5.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, $46.loadConfig)(_aA.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, $46.loadConfig)(EK1.NODE_REGION_CONFIG_OPTIONS, {
                    ...EK1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: waA.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, $46.loadConfig)({
                    ..._aA.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || _M5.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? YM5.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? waA.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, $46.loadConfig)(EK1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, $46.loadConfig)(EK1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, $46.loadConfig)(zaA.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    OaA.getRuntimeConfig = jM5
})
// @from(Ln 84551, Col 4)
xaA = x((N88) => {
    var jaA = PQ(),
        JM5 = WQ(),
        MM5 = ZQ(),
        JaA = fu(),
        DM5 = Nj(),
        W88 = w_(),
        gj6 = dO(),
        XM5 = VQ(),
        LaA = rS(),
        MaA = kP(),
        qo = fG(),
        DaA = j88(),
        PM5 = HaA(),
        XaA = oS(),
        PaA = AK1(),
        WM5 = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "signin"
            })
        },
        ZM5 = {
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
        GM5 = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y
            } = A;
            return {
                setHttpAuthScheme(z) {
                    let _ = q.findIndex((w) => w.schemeId === z.schemeId);
                    if (_ === -1) q.push(z);
                    else q.splice(_, 1, z)
                },
                httpAuthSchemes() {
                    return q
                },
                setHttpAuthSchemeProvider(z) {
                    K = z
                },
                httpAuthSchemeProvider() {
                    return K
                },
                setCredentials(z) {
                    Y = z
                },
                credentials() {
                    return Y
                }
            }
        },
        fM5 = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        TM5 = (A, q) => {
            let K = Object.assign(XaA.getAwsRegionExtensionConfiguration(A), qo.getDefaultExtensionConfiguration(A), PaA.getHttpHandlerExtensionConfiguration(A), GM5(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, XaA.resolveAwsRegionExtensionConfiguration(K), qo.resolveDefaultRuntimeConfig(K), PaA.resolveHttpHandlerRuntimeConfig(K), fM5(K))
        };
    class Z88 extends qo.Client {
        config;
        constructor(...[A]) {
            let q = PM5.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = WM5(q),
                Y = JaA.resolveUserAgentConfig(K),
                z = MaA.resolveRetryConfig(Y),
                _ = DM5.resolveRegionConfig(z),
                w = jaA.resolveHostHeaderConfig(_),
                O = LaA.resolveEndpointConfig(w),
                $ = DaA.resolveHttpAuthSchemeConfig(O),
                H = TM5($, A?.extensions || []);
            this.config = H, this.middlewareStack.use(gj6.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(JaA.getUserAgentPlugin(this.config)), this.middlewareStack.use(MaA.getRetryPlugin(this.config)), this.middlewareStack.use(XM5.getContentLengthPlugin(this.config)), this.middlewareStack.use(jaA.getHostHeaderPlugin(this.config)), this.middlewareStack.use(JM5.getLoggerPlugin(this.config)), this.middlewareStack.use(MM5.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(W88.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: DaA.defaultSigninHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (j) => new W88.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": j.credentials
                })
            })), this.middlewareStack.use(W88.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var Fj6 = class A extends qo.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        RaA = class A extends Fj6 {
            name = "AccessDeniedException";
            $fault = "client";
            error;
            constructor(q) {
                super({
                    name: "AccessDeniedException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error
            }
        },
        haA = class A extends Fj6 {
            name = "InternalServerException";
            $fault = "server";
            error;
            constructor(q) {
                super({
                    name: "InternalServerException",
                    $fault: "server",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error
            }
        },
        SaA = class A extends Fj6 {
            name = "TooManyRequestsError";
            $fault = "client";
            error;
            constructor(q) {
                super({
                    name: "TooManyRequestsError",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error
            }
        },
        CaA = class A extends Fj6 {
            name = "ValidationException";
            $fault = "client";
            error;
            constructor(q) {
                super({
                    name: "ValidationException",
                    $fault: "client",
                    ...q
                });
                Object.setPrototypeOf(this, A.prototype), this.error = q.error
            }
        },
        vM5 = "AccessDeniedException",
        NM5 = "AccessToken",
        VM5 = "CreateOAuth2Token",
        kM5 = "CreateOAuth2TokenRequest",
        EM5 = "CreateOAuth2TokenRequestBody",
        yM5 = "CreateOAuth2TokenResponseBody",
        LM5 = "CreateOAuth2TokenResponse",
        RM5 = "InternalServerException",
        hM5 = "RefreshToken",
        SM5 = "TooManyRequestsError",
        CM5 = "ValidationException",
        WaA = "accessKeyId",
        ZaA = "accessToken",
        G88 = "client",
        GaA = "clientId",
        faA = "codeVerifier",
        IM5 = "code",
        Ko = "error",
        TaA = "expiresIn",
        vaA = "grantType",
        bM5 = "http",
        f88 = "httpError",
        NaA = "idToken",
        QV = "jsonName",
        LK1 = "message",
        yK1 = "refreshToken",
        VaA = "redirectUri",
        xM5 = "server",
        kaA = "secretAccessKey",
        EaA = "sessionToken",
        IaA = "smithy.ts.sdk.synthetic.com.amazonaws.signin",
        uM5 = "tokenInput",
        mM5 = "tokenOutput",
        yaA = "tokenType",
        TG = "com.amazonaws.signin",
        baA = [0, TG, hM5, 8, 0],
        BM5 = [-3, TG, vM5, {
                [Ko]: G88
            },
            [Ko, LK1],
            [0, 0]
        ];
    gj6.TypeRegistry.for(TG).registerError(BM5, RaA);
    var gM5 = [3, TG, NM5, 8, [WaA, kaA, EaA],
            [
                [0, {
                    [QV]: WaA
                }],
                [0, {
                    [QV]: kaA
                }],
                [0, {
                    [QV]: EaA
                }]
            ]
        ],
        FM5 = [3, TG, kM5, 0, [uM5],
            [
                [() => pM5, 16]
            ]
        ],
        pM5 = [3, TG, EM5, 0, [GaA, vaA, IM5, VaA, faA, yK1],
            [
                [0, {
                    [QV]: GaA
                }],
                [0, {
                    [QV]: vaA
                }], 0, [0, {
                    [QV]: VaA
                }],
                [0, {
                    [QV]: faA
                }],
                [() => baA, {
                    [QV]: yK1
                }]
            ]
        ],
        QM5 = [3, TG, LM5, 0, [mM5],
            [
                [() => UM5, 16]
            ]
        ],
        UM5 = [3, TG, yM5, 0, [ZaA, yaA, TaA, yK1, NaA],
            [
                [() => gM5, {
                    [QV]: ZaA
                }],
                [0, {
                    [QV]: yaA
                }],
                [1, {
                    [QV]: TaA
                }],
                [() => baA, {
                    [QV]: yK1
                }],
                [0, {
                    [QV]: NaA
                }]
            ]
        ],
        dM5 = [-3, TG, RM5, {
                [Ko]: xM5,
                [f88]: 500
            },
            [Ko, LK1],
            [0, 0]
        ];
    gj6.TypeRegistry.for(TG).registerError(dM5, haA);
    var cM5 = [-3, TG, SM5, {
            [Ko]: G88,
            [f88]: 429
        },
        [Ko, LK1],
        [0, 0]
    ];
    gj6.TypeRegistry.for(TG).registerError(cM5, SaA);
    var lM5 = [-3, TG, CM5, {
            [Ko]: G88,
            [f88]: 400
        },
        [Ko, LK1],
        [0, 0]
    ];
    gj6.TypeRegistry.for(TG).registerError(lM5, CaA);
    var iM5 = [-3, IaA, "SigninServiceException", 0, [],
        []
    ];
    gj6.TypeRegistry.for(IaA).registerError(iM5, Fj6);
    var nM5 = [9, TG, VM5, {
        [bM5]: ["POST", "/v1/token", 200]
    }, () => FM5, () => QM5];
    class T88 extends qo.Command.classBuilder().ep(ZM5).m(function(A, q, K, Y) {
        return [LaA.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(nM5).build() {}
    var rM5 = {
        CreateOAuth2TokenCommand: T88
    };
    class v88 extends Z88 {}
    qo.createAggregatedClient(rM5, v88);
    var oM5 = {
        AUTHCODE_EXPIRED: "AUTHCODE_EXPIRED",
        INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
        INVALID_REQUEST: "INVALID_REQUEST",
        SERVER_ERROR: "server_error",
        TOKEN_EXPIRED: "TOKEN_EXPIRED",
        USER_CREDENTIALS_CHANGED: "USER_CREDENTIALS_CHANGED"
    };
    Object.defineProperty(N88, "$Command", {
        enumerable: !0,
        get: function() {
            return qo.Command
        }
    });
    Object.defineProperty(N88, "__Client", {
        enumerable: !0,
        get: function() {
            return qo.Client
        }
    });
    N88.AccessDeniedException = RaA;
    N88.CreateOAuth2TokenCommand = T88;
    N88.InternalServerException = haA;
    N88.OAuth2ErrorCode = oM5;
    N88.Signin = v88;
    N88.SigninClient = Z88;
    N88.SigninServiceException = Fj6;
    N88.TooManyRequestsError = SaA;
    N88.ValidationException = CaA
})