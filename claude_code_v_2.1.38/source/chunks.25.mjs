
// @from(Ln 71052, Col 4)
gE1 = R((iH1) => {
    var jZ8 = wb(),
        Tc6 = rf(),
        fc6 = Gc6(),
        egK = R$(),
        XZ8 = nf();
    class MZ8 {
        config;
        middlewareStack = jZ8.constructStack();
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
    var Zc6 = "***SensitiveInformation***";

    function Vc6(A, q) {
        if (q == null) return q;
        let K = egK.NormalizedSchema.of(A);
        if (K.getMergedTraits().sensitive) return Zc6;
        if (K.isListSchema()) {
            if (!!K.getValueSchema().getMergedTraits().sensitive) return Zc6
        } else if (K.isMapSchema()) {
            if (!!K.getKeySchema().getMergedTraits().sensitive || !!K.getValueSchema().getMergedTraits().sensitive) return Zc6
        } else if (K.isStructSchema() && typeof q === "object") {
            let Y = q,
                z = {};
            for (let [w, H] of K.structIterator())
                if (Y[w] != null) z[w] = Vc6(H, Y[w]);
            return z
        }
        return q
    }
    class vc6 {
        middlewareStack = jZ8.constructStack();
        schema;
        static classBuilder() {
            return new PZ8
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
                    [fc6.SMITHY_CONTEXT_KEY]: {
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
    class PZ8 {
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
            return q = class extends vc6 {
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
                        inputFilterSensitiveLog: A._inputFilterSensitiveLog ?? (w ? Vc6.bind(null, H) : (O) => O),
                        outputFilterSensitiveLog: A._outputFilterSensitiveLog ?? (w ? Vc6.bind(null, $) : (O) => O),
                        smithyContext: A._smithyContext,
                        additionalContext: A._additionalContext
                    })
                }
                serialize = A._serializer;
                deserialize = A._deserializer
            }
        }
    }
    var AUK = "***SensitiveInformation***",
        qUK = (A, q) => {
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
    class lH1 extends Error {
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
            return lH1.prototype.isPrototypeOf(q) || Boolean(q.$fault) && Boolean(q.$metadata) && (q.$fault === "client" || q.$fault === "server")
        }
        static[Symbol.hasInstance](A) {
            if (!A) return !1;
            let q = A;
            if (this === lH1) return lH1.isInstance(A);
            if (lH1.isInstance(A)) {
                if (q.name && this.name) return this.prototype.isPrototypeOf(A) || q.name === this.name;
                return this.prototype.isPrototypeOf(A)
            }
            return !1
        }
    }
    var WZ8 = (A, q = {}) => {
            Object.entries(q).filter(([, Y]) => Y !== void 0).forEach(([Y, z]) => {
                if (A[Y] == null || A[Y] === "") A[Y] = z
            });
            let K = A.message || A.Message || "UnknownError";
            return A.message = K, delete A.Message, A
        },
        GZ8 = ({
            output: A,
            parsedBody: q,
            exceptionCtor: K,
            errorCode: Y
        }) => {
            let z = YUK(A),
                w = z.httpStatusCode ? z.httpStatusCode + "" : void 0,
                H = new K({
                    name: q?.code || q?.Code || Y || w || "UnknownError",
                    $fault: "client",
                    $metadata: z
                });
            throw WZ8(H, q)
        },
        KUK = (A) => {
            return ({
                output: q,
                parsedBody: K,
                errorCode: Y
            }) => {
                GZ8({
                    output: q,
                    parsedBody: K,
                    exceptionCtor: A,
                    errorCode: Y
                })
            }
        },
        YUK = (A) => ({
            httpStatusCode: A.statusCode,
            requestId: A.headers["x-amzn-requestid"] ?? A.headers["x-amzn-request-id"] ?? A.headers["x-amz-request-id"],
            extendedRequestId: A.headers["x-amz-id-2"],
            cfId: A.headers["x-amz-cf-id"]
        }),
        zUK = (A) => {
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
        DZ8 = !1,
        wUK = (A) => {
            if (A && !DZ8 && parseInt(A.substring(1, A.indexOf("."))) < 16) DZ8 = !0
        },
        HUK = (A) => {
            let q = [];
            for (let K in fc6.AlgorithmId) {
                let Y = fc6.AlgorithmId[K];
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
        $UK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        OUK = (A) => {
            return {
                setRetryStrategy(q) {
                    A.retryStrategy = q
                },
                retryStrategy() {
                    return A.retryStrategy
                }
            }
        },
        _UK = (A) => {
            let q = {};
            return q.retryStrategy = A.retryStrategy(), q
        },
        ZZ8 = (A) => {
            return Object.assign(HUK(A), OUK(A))
        },
        JUK = ZZ8,
        XUK = (A) => {
            return Object.assign($UK(A), _UK(A))
        },
        DUK = (A) => Array.isArray(A) ? A : [A],
        fZ8 = (A) => {
            for (let K in A)
                if (A.hasOwnProperty(K) && A[K]["#text"] !== void 0) A[K] = A[K]["#text"];
                else if (typeof A[K] === "object" && A[K] !== null) A[K] = fZ8(A[K]);
            return A
        },
        jUK = (A) => {
            return A != null
        };
    class VZ8 {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function NZ8(A, q, K) {
        let Y, z, w;
        if (typeof q > "u" && typeof K > "u") Y = {}, w = A;
        else if (Y = A, typeof q === "function") return z = q, w = K, WUK(Y, z, w);
        else w = q;
        for (let H of Object.keys(w)) {
            if (!Array.isArray(w[H])) {
                Y[H] = w[H];
                continue
            }
            TZ8(Y, null, w, H)
        }
        return Y
    }
    var MUK = (A) => {
            let q = {};
            for (let [K, Y] of Object.entries(A || {})) q[K] = [, Y];
            return q
        },
        PUK = (A, q) => {
            let K = {};
            for (let Y in q) TZ8(K, A, q, Y);
            return K
        },
        WUK = (A, q, K) => {
            return NZ8(A, Object.entries(K).reduce((Y, [z, w]) => {
                if (Array.isArray(w)) Y[z] = w;
                else if (typeof w === "function") Y[z] = [q, w()];
                else Y[z] = [q, w];
                return Y
            }, {}))
        },
        TZ8 = (A, q, K, Y) => {
            if (q !== null) {
                let H = K[Y];
                if (typeof H === "function") H = [, H];
                let [$ = GUK, O = ZUK, _ = Y] = H;
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
        GUK = (A) => A != null,
        ZUK = (A) => A,
        fUK = (A) => {
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
        VUK = (A) => A.toISOString().replace(".000Z", "Z"),
        Nc6 = (A) => {
            if (A == null) return {};
            if (Array.isArray(A)) return A.filter((q) => q != null).map(Nc6);
            if (typeof A === "object") {
                let q = {};
                for (let K of Object.keys(A)) {
                    if (A[K] == null) continue;
                    q[K] = Nc6(A[K])
                }
                return q
            }
            return A
        };
    Object.defineProperty(iH1, "collectBody", {
        enumerable: !0,
        get: function() {
            return Tc6.collectBody
        }
    });
    Object.defineProperty(iH1, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return Tc6.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(iH1, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return Tc6.resolvedPath
        }
    });
    iH1.Client = MZ8;
    iH1.Command = vc6;
    iH1.NoOpLogger = VZ8;
    iH1.SENSITIVE_STRING = AUK;
    iH1.ServiceException = lH1;
    iH1._json = Nc6;
    iH1.convertMap = MUK;
    iH1.createAggregatedClient = qUK;
    iH1.decorateServiceException = WZ8;
    iH1.emitWarningIfUnsupportedVersion = wUK;
    iH1.getArrayIfSingleItem = DUK;
    iH1.getDefaultClientConfiguration = JUK;
    iH1.getDefaultExtensionConfiguration = ZZ8;
    iH1.getValueFromTextNode = fZ8;
    iH1.isSerializableHeaderValue = jUK;
    iH1.loadConfigsForDefaultMode = zUK;
    iH1.map = NZ8;
    iH1.resolveDefaultRuntimeConfig = XUK;
    iH1.serializeDateTime = VUK;
    iH1.serializeFloat = fUK;
    iH1.take = PUK;
    iH1.throwDefaultError = GZ8;
    iH1.withBaseException = KUK;
    Object.keys(XZ8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(iH1, A)) Object.defineProperty(iH1, A, {
            enumerable: !0,
            get: function() {
                return XZ8[A]
            }
        })
    })
})
// @from(Ln 71522, Col 4)
kc6 = R((vZ8) => {
    Object.defineProperty(vZ8, "__esModule", {
        value: !0
    });
    vZ8.resolveHttpAuthSchemeConfig = vZ8.defaultSSOHttpAuthSchemeProvider = vZ8.defaultSSOHttpAuthSchemeParametersProvider = void 0;
    var cUK = YH(),
        Ec6 = iP(),
        lUK = async (A, q, K) => {
            return {
                operation: (0, Ec6.getSmithyContext)(q).operation,
                region: await (0, Ec6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    vZ8.defaultSSOHttpAuthSchemeParametersProvider = lUK;

    function iUK(A) {
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

    function Ne1(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var nUK = (A) => {
        let q = [];
        switch (A.operation) {
            case "GetRoleCredentials": {
                q.push(Ne1(A));
                break
            }
            case "ListAccountRoles": {
                q.push(Ne1(A));
                break
            }
            case "ListAccounts": {
                q.push(Ne1(A));
                break
            }
            case "Logout": {
                q.push(Ne1(A));
                break
            }
            default:
                q.push(iUK(A))
        }
        return q
    };
    vZ8.defaultSSOHttpAuthSchemeProvider = nUK;
    var rUK = (A) => {
        let q = (0, cUK.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, Ec6.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    vZ8.resolveHttpAuthSchemeConfig = rUK
})
// @from(Ln 71593, Col 4)
kZ8 = R((m62, sUK) => {
    sUK.exports = {
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
// @from(Ln 71689, Col 4)
LZ8 = R((eUK) => {
    var tUK = (A) => typeof ArrayBuffer === "function" && A instanceof ArrayBuffer || Object.prototype.toString.call(A) === "[object ArrayBuffer]";
    eUK.isArrayBuffer = tUK
})
// @from(Ln 71693, Col 4)
Rc6 = R((zpK) => {
    var qpK = LZ8(),
        Lc6 = h1("buffer"),
        KpK = (A, q = 0, K = A.byteLength - q) => {
            if (!qpK.isArrayBuffer(A)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof A} (${A})`);
            return Lc6.Buffer.from(A, q, K)
        },
        YpK = (A, q) => {
            if (typeof A !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof A} (${A})`);
            return q ? Lc6.Buffer.from(A, q) : Lc6.Buffer.from(A)
        };
    zpK.fromArrayBuffer = KpK;
    zpK.fromString = YpK
})
// @from(Ln 71707, Col 4)
CZ8 = R((RZ8) => {
    Object.defineProperty(RZ8, "__esModule", {
        value: !0
    });
    RZ8.fromBase64 = void 0;
    var $pK = Rc6(),
        OpK = /^[A-Za-z0-9+/]*={0,2}$/,
        _pK = (A) => {
            if (A.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!OpK.exec(A)) throw TypeError("Invalid base64 string.");
            let q = (0, $pK.fromString)(A, "base64");
            return new Uint8Array(q.buffer, q.byteOffset, q.byteLength)
        };
    RZ8.fromBase64 = _pK
})
// @from(Ln 71722, Col 4)
IZ8 = R((SZ8) => {
    Object.defineProperty(SZ8, "__esModule", {
        value: !0
    });
    SZ8.toBase64 = void 0;
    var JpK = Rc6(),
        XpK = Z2(),
        DpK = (A) => {
            let q;
            if (typeof A === "string") q = (0, XpK.fromUtf8)(A);
            else q = A;
            if (typeof q !== "object" || typeof q.byteOffset !== "number" || typeof q.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, JpK.fromArrayBuffer)(q.buffer, q.byteOffset, q.byteLength).toString("base64")
        };
    SZ8.toBase64 = DpK
})
// @from(Ln 71738, Col 4)
uZ8 = R((UE1) => {
    var xZ8 = CZ8(),
        bZ8 = IZ8();
    Object.keys(xZ8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(UE1, A)) Object.defineProperty(UE1, A, {
            enumerable: !0,
            get: function() {
                return xZ8[A]
            }
        })
    });
    Object.keys(bZ8).forEach(function(A) {
        if (A !== "default" && !Object.prototype.hasOwnProperty.call(UE1, A)) Object.defineProperty(UE1, A, {
            enumerable: !0,
            get: function() {
                return bZ8[A]
            }
        })
    })
})
// @from(Ln 71758, Col 4)
tZ8 = R((aZ8) => {
    Object.defineProperty(aZ8, "__esModule", {
        value: !0
    });
    aZ8.ruleSet = void 0;
    var iZ8 = "required",
        Lk = "fn",
        Rk = "argv",
        oH1 = "ref",
        BZ8 = !0,
        mZ8 = "isSet",
        pE1 = "booleanEquals",
        nH1 = "error",
        rH1 = "endpoint",
        Kg = "tree",
        yc6 = "PartitionResult",
        Cc6 = "getAttr",
        FZ8 = {
            [iZ8]: !1,
            type: "string"
        },
        QZ8 = {
            [iZ8]: !0,
            default: !1,
            type: "boolean"
        },
        gZ8 = {
            [oH1]: "Endpoint"
        },
        nZ8 = {
            [Lk]: pE1,
            [Rk]: [{
                [oH1]: "UseFIPS"
            }, !0]
        },
        rZ8 = {
            [Lk]: pE1,
            [Rk]: [{
                [oH1]: "UseDualStack"
            }, !0]
        },
        kk = {},
        UZ8 = {
            [Lk]: Cc6,
            [Rk]: [{
                [oH1]: yc6
            }, "supportsFIPS"]
        },
        oZ8 = {
            [oH1]: yc6
        },
        pZ8 = {
            [Lk]: pE1,
            [Rk]: [!0, {
                [Lk]: Cc6,
                [Rk]: [oZ8, "supportsDualStack"]
            }]
        },
        dZ8 = [nZ8],
        cZ8 = [rZ8],
        lZ8 = [{
            [oH1]: "Region"
        }],
        jpK = {
            version: "1.0",
            parameters: {
                Region: FZ8,
                UseDualStack: QZ8,
                UseFIPS: QZ8,
                Endpoint: FZ8
            },
            rules: [{
                conditions: [{
                    [Lk]: mZ8,
                    [Rk]: [gZ8]
                }],
                rules: [{
                    conditions: dZ8,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: nH1
                }, {
                    conditions: cZ8,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: nH1
                }, {
                    endpoint: {
                        url: gZ8,
                        properties: kk,
                        headers: kk
                    },
                    type: rH1
                }],
                type: Kg
            }, {
                conditions: [{
                    [Lk]: mZ8,
                    [Rk]: lZ8
                }],
                rules: [{
                    conditions: [{
                        [Lk]: "aws.partition",
                        [Rk]: lZ8,
                        assign: yc6
                    }],
                    rules: [{
                        conditions: [nZ8, rZ8],
                        rules: [{
                            conditions: [{
                                [Lk]: pE1,
                                [Rk]: [BZ8, UZ8]
                            }, pZ8],
                            rules: [{
                                endpoint: {
                                    url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: kk,
                                    headers: kk
                                },
                                type: rH1
                            }],
                            type: Kg
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: nH1
                        }],
                        type: Kg
                    }, {
                        conditions: dZ8,
                        rules: [{
                            conditions: [{
                                [Lk]: pE1,
                                [Rk]: [UZ8, BZ8]
                            }],
                            rules: [{
                                conditions: [{
                                    [Lk]: "stringEquals",
                                    [Rk]: [{
                                        [Lk]: Cc6,
                                        [Rk]: [oZ8, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://portal.sso.{Region}.amazonaws.com",
                                    properties: kk,
                                    headers: kk
                                },
                                type: rH1
                            }, {
                                endpoint: {
                                    url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: kk,
                                    headers: kk
                                },
                                type: rH1
                            }],
                            type: Kg
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: nH1
                        }],
                        type: Kg
                    }, {
                        conditions: cZ8,
                        rules: [{
                            conditions: [pZ8],
                            rules: [{
                                endpoint: {
                                    url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: kk,
                                    headers: kk
                                },
                                type: rH1
                            }],
                            type: Kg
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: nH1
                        }],
                        type: Kg
                    }, {
                        endpoint: {
                            url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
                            properties: kk,
                            headers: kk
                        },
                        type: rH1
                    }],
                    type: Kg
                }],
                type: Kg
            }, {
                error: "Invalid Configuration: Missing Region",
                type: nH1
            }]
        };
    aZ8.ruleSet = jpK
})
// @from(Ln 71954, Col 4)
qf8 = R((eZ8) => {
    Object.defineProperty(eZ8, "__esModule", {
        value: !0
    });
    eZ8.defaultEndpointResolver = void 0;
    var MpK = zb(),
        Sc6 = GC(),
        PpK = tZ8(),
        WpK = new Sc6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        GpK = (A, q = {}) => {
            return WpK.get(A, () => (0, Sc6.resolveEndpoint)(PpK.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    eZ8.defaultEndpointResolver = GpK;
    Sc6.customEndpointFunctions.aws = MpK.awsEndpointFunctions
})
// @from(Ln 71975, Col 4)
Hf8 = R((zf8) => {
    Object.defineProperty(zf8, "__esModule", {
        value: !0
    });
    zf8.getRuntimeConfig = void 0;
    var ZpK = YH(),
        fpK = eQ(),
        VpK = lz(),
        NpK = gE1(),
        TpK = fk(),
        Kf8 = uZ8(),
        Yf8 = Z2(),
        vpK = kc6(),
        EpK = qf8(),
        kpK = (A) => {
            return {
                apiVersion: "2019-06-10",
                base64Decoder: A?.base64Decoder ?? Kf8.fromBase64,
                base64Encoder: A?.base64Encoder ?? Kf8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? EpK.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? vpK.defaultSSOHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new ZpK.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new VpK.NoAuthSigner
                }],
                logger: A?.logger ?? new NpK.NoOpLogger,
                protocol: A?.protocol ?? new fpK.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.sso"
                }),
                serviceId: A?.serviceId ?? "SSO",
                urlParser: A?.urlParser ?? TpK.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? Yf8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? Yf8.toUtf8
            }
        };
    zf8.getRuntimeConfig = kpK
})
// @from(Ln 72019, Col 4)
jf8 = R((Xf8) => {
    Object.defineProperty(Xf8, "__esModule", {
        value: !0
    });
    Xf8.getRuntimeConfig = void 0;
    var LpK = n2(),
        RpK = LpK.__importDefault(kZ8()),
        $f8 = YH(),
        Of8 = oQ(),
        Te1 = YJ(),
        ypK = aQ(),
        _f8 = qM(),
        vA1 = af(),
        Jf8 = cf(),
        CpK = sQ(),
        SpK = _b(),
        hpK = Hf8(),
        IpK = gE1(),
        xpK = qg(),
        bpK = gE1(),
        upK = (A) => {
            (0, bpK.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, xpK.resolveDefaultsModeConfig)(A),
                K = () => q().then(IpK.loadConfigsForDefaultMode),
                Y = (0, hpK.getRuntimeConfig)(A);
            (0, $f8.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, vA1.loadConfig)($f8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? CpK.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, Of8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: RpK.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, vA1.loadConfig)(_f8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, vA1.loadConfig)(Te1.NODE_REGION_CONFIG_OPTIONS, {
                    ...Te1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: Jf8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, vA1.loadConfig)({
                    ..._f8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || SpK.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? ypK.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? Jf8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, vA1.loadConfig)(Te1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, vA1.loadConfig)(Te1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, vA1.loadConfig)(Of8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    Xf8.getRuntimeConfig = upK
})
// @from(Ln 72079, Col 4)
Gf8 = R((UpK) => {
    var BpK = Gc6(),
        mpK = (A) => {
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
        FpK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class Mf8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = BpK.FieldPosition.HEADER,
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
    class Pf8 {
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
    class ve1 {
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
            let q = new ve1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = QpK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return ve1.clone(this)
        }
    }

    function QpK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class Wf8 {
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

    function gpK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    UpK.Field = Mf8;
    UpK.Fields = Pf8;
    UpK.HttpRequest = ve1;
    UpK.HttpResponse = Wf8;
    UpK.getHttpHandlerExtensionConfiguration = mpK;
    UpK.isValidHostname = gpK;
    UpK.resolveHttpHandlerRuntimeConfig = FpK
})
// @from(Ln 72221, Col 4)
bf8 = R((bc6) => {
    var Zf8 = BQ(),
        opK = mQ(),
        apK = FQ(),
        ff8 = $b(),
        spK = YJ(),
        dE1 = lz(),
        aH1 = R$(),
        tpK = rQ(),
        cE1 = ZC(),
        Vf8 = qM(),
        TC = gE1(),
        Nf8 = kc6(),
        epK = jf8(),
        Tf8 = fC(),
        vf8 = Gf8(),
        AdK = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "awsssoportal"
            })
        },
        Ee1 = {
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
        qdK = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y
            } = A;
            return {
                setHttpAuthScheme(z) {
                    let w = q.findIndex((H) => H.schemeId === z.schemeId);
                    if (w === -1) q.push(z);
                    else q.splice(w, 1, z)
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
        KdK = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        YdK = (A, q) => {
            let K = Object.assign(Tf8.getAwsRegionExtensionConfiguration(A), TC.getDefaultExtensionConfiguration(A), vf8.getHttpHandlerExtensionConfiguration(A), qdK(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, Tf8.resolveAwsRegionExtensionConfiguration(K), TC.resolveDefaultRuntimeConfig(K), vf8.resolveHttpHandlerRuntimeConfig(K), KdK(K))
        };
    class lE1 extends TC.Client {
        config;
        constructor(...[A]) {
            let q = epK.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = AdK(q),
                Y = ff8.resolveUserAgentConfig(K),
                z = Vf8.resolveRetryConfig(Y),
                w = spK.resolveRegionConfig(z),
                H = Zf8.resolveHostHeaderConfig(w),
                $ = cE1.resolveEndpointConfig(H),
                O = Nf8.resolveHttpAuthSchemeConfig($),
                _ = YdK(O, A?.extensions || []);
            this.config = _, this.middlewareStack.use(aH1.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(ff8.getUserAgentPlugin(this.config)), this.middlewareStack.use(Vf8.getRetryPlugin(this.config)), this.middlewareStack.use(tpK.getContentLengthPlugin(this.config)), this.middlewareStack.use(Zf8.getHostHeaderPlugin(this.config)), this.middlewareStack.use(opK.getLoggerPlugin(this.config)), this.middlewareStack.use(apK.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(dE1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: Nf8.defaultSSOHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (J) => new dE1.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": J.credentials
                })
            })), this.middlewareStack.use(dE1.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var sH1 = class A extends TC.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        Ef8 = class A extends sH1 {
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
        kf8 = class A extends sH1 {
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
        Lf8 = class A extends sH1 {
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
        Rf8 = class A extends sH1 {
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
        zdK = "AccountInfo",
        wdK = "AccountListType",
        HdK = "AccessTokenType",
        $dK = "GetRoleCredentials",
        OdK = "GetRoleCredentialsRequest",
        _dK = "GetRoleCredentialsResponse",
        JdK = "InvalidRequestException",
        XdK = "Logout",
        DdK = "ListAccounts",
        jdK = "ListAccountsRequest",
        MdK = "ListAccountRolesRequest",
        PdK = "ListAccountRolesResponse",
        WdK = "ListAccountsResponse",
        GdK = "ListAccountRoles",
        ZdK = "LogoutRequest",
        fdK = "RoleCredentials",
        VdK = "RoleInfo",
        NdK = "RoleListType",
        TdK = "ResourceNotFoundException",
        vdK = "SecretAccessKeyType",
        EdK = "SessionTokenType",
        kdK = "TooManyRequestsException",
        LdK = "UnauthorizedException",
        ke1 = "accountId",
        RdK = "accessKeyId",
        ydK = "accountList",
        CdK = "accountName",
        Le1 = "accessToken",
        yf8 = "account_id",
        Re1 = "client",
        ye1 = "error",
        SdK = "emailAddress",
        hdK = "expiration",
        Ce1 = "http",
        Se1 = "httpError",
        he1 = "httpHeader",
        EA1 = "httpQuery",
        Ie1 = "message",
        Cf8 = "maxResults",
        Sf8 = "max_result",
        xe1 = "nextToken",
        hf8 = "next_token",
        IdK = "roleCredentials",
        xdK = "roleList",
        If8 = "roleName",
        bdK = "role_name",
        xf8 = "smithy.ts.sdk.synthetic.com.amazonaws.sso",
        udK = "secretAccessKey",
        BdK = "sessionToken",
        be1 = "x-amz-sso_bearer_token",
        Nw = "com.amazonaws.sso",
        ue1 = [0, Nw, HdK, 8, 0],
        mdK = [0, Nw, vdK, 8, 0],
        FdK = [0, Nw, EdK, 8, 0],
        QdK = [3, Nw, zdK, 0, [ke1, CdK, SdK],
            [0, 0, 0]
        ],
        gdK = [3, Nw, OdK, 0, [If8, ke1, Le1],
            [
                [0, {
                    [EA1]: bdK
                }],
                [0, {
                    [EA1]: yf8
                }],
                [() => ue1, {
                    [he1]: be1
                }]
            ]
        ],
        UdK = [3, Nw, _dK, 0, [IdK],
            [
                [() => odK, 0]
            ]
        ],
        pdK = [-3, Nw, JdK, {
                [ye1]: Re1,
                [Se1]: 400
            },
            [Ie1],
            [0]
        ];
    aH1.TypeRegistry.for(Nw).registerError(pdK, Ef8);
    var ddK = [3, Nw, MdK, 0, [xe1, Cf8, Le1, ke1],
            [
                [0, {
                    [EA1]: hf8
                }],
                [1, {
                    [EA1]: Sf8
                }],
                [() => ue1, {
                    [he1]: be1
                }],
                [0, {
                    [EA1]: yf8
                }]
            ]
        ],
        cdK = [3, Nw, PdK, 0, [xe1, xdK],
            [0, () => KcK]
        ],
        ldK = [3, Nw, jdK, 0, [xe1, Cf8, Le1],
            [
                [0, {
                    [EA1]: hf8
                }],
                [1, {
                    [EA1]: Sf8
                }],
                [() => ue1, {
                    [he1]: be1
                }]
            ]
        ],
        idK = [3, Nw, WdK, 0, [xe1, ydK],
            [0, () => qcK]
        ],
        ndK = [3, Nw, ZdK, 0, [Le1],
            [
                [() => ue1, {
                    [he1]: be1
                }]
            ]
        ],
        rdK = [-3, Nw, TdK, {
                [ye1]: Re1,
                [Se1]: 404
            },
            [Ie1],
            [0]
        ];
    aH1.TypeRegistry.for(Nw).registerError(rdK, kf8);
    var odK = [3, Nw, fdK, 0, [RdK, udK, BdK, hdK],
            [0, [() => mdK, 0],
                [() => FdK, 0], 1
            ]
        ],
        adK = [3, Nw, VdK, 0, [If8, ke1],
            [0, 0]
        ],
        sdK = [-3, Nw, kdK, {
                [ye1]: Re1,
                [Se1]: 429
            },
            [Ie1],
            [0]
        ];
    aH1.TypeRegistry.for(Nw).registerError(sdK, Lf8);
    var tdK = [-3, Nw, LdK, {
            [ye1]: Re1,
            [Se1]: 401
        },
        [Ie1],
        [0]
    ];
    aH1.TypeRegistry.for(Nw).registerError(tdK, Rf8);
    var edK = "unit",
        AcK = [-3, xf8, "SSOServiceException", 0, [],
            []
        ];
    aH1.TypeRegistry.for(xf8).registerError(AcK, sH1);
    var qcK = [1, Nw, wdK, 0, () => QdK],
        KcK = [1, Nw, NdK, 0, () => adK],
        YcK = [9, Nw, $dK, {
            [Ce1]: ["GET", "/federation/credentials", 200]
        }, () => gdK, () => UdK],
        zcK = [9, Nw, GdK, {
            [Ce1]: ["GET", "/assignment/roles", 200]
        }, () => ddK, () => cdK],
        wcK = [9, Nw, DdK, {
            [Ce1]: ["GET", "/assignment/accounts", 200]
        }, () => ldK, () => idK],
        HcK = [9, Nw, XdK, {
            [Ce1]: ["POST", "/logout", 200]
        }, () => ndK, () => edK];
    class hc6 extends TC.Command.classBuilder().ep(Ee1).m(function(A, q, K, Y) {
        return [cE1.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").sc(YcK).build() {}
    class Be1 extends TC.Command.classBuilder().ep(Ee1).m(function(A, q, K, Y) {
        return [cE1.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").sc(zcK).build() {}
    class me1 extends TC.Command.classBuilder().ep(Ee1).m(function(A, q, K, Y) {
        return [cE1.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").sc(wcK).build() {}
    class Ic6 extends TC.Command.classBuilder().ep(Ee1).m(function(A, q, K, Y) {
        return [cE1.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").sc(HcK).build() {}
    var $cK = {
        GetRoleCredentialsCommand: hc6,
        ListAccountRolesCommand: Be1,
        ListAccountsCommand: me1,
        LogoutCommand: Ic6
    };
    class xc6 extends lE1 {}
    TC.createAggregatedClient($cK, xc6);
    var OcK = dE1.createPaginator(lE1, Be1, "nextToken", "nextToken", "maxResults"),
        _cK = dE1.createPaginator(lE1, me1, "nextToken", "nextToken", "maxResults");
    Object.defineProperty(bc6, "$Command", {
        enumerable: !0,
        get: function() {
            return TC.Command
        }
    });
    Object.defineProperty(bc6, "__Client", {
        enumerable: !0,
        get: function() {
            return TC.Client
        }
    });
    bc6.GetRoleCredentialsCommand = hc6;
    bc6.InvalidRequestException = Ef8;
    bc6.ListAccountRolesCommand = Be1;
    bc6.ListAccountsCommand = me1;
    bc6.LogoutCommand = Ic6;
    bc6.ResourceNotFoundException = kf8;
    bc6.SSO = xc6;
    bc6.SSOClient = lE1;
    bc6.SSOServiceException = sH1;
    bc6.TooManyRequestsException = Lf8;
    bc6.UnauthorizedException = Rf8;
    bc6.paginateListAccountRoles = OcK;
    bc6.paginateListAccounts = _cK
})
// @from(Ln 72605, Col 4)
Bf8 = R((uc6) => {
    var uf8 = bf8();
    Object.defineProperty(uc6, "GetRoleCredentialsCommand", {
        enumerable: !0,
        get: function() {
            return uf8.GetRoleCredentialsCommand
        }
    });
    Object.defineProperty(uc6, "SSOClient", {
        enumerable: !0,
        get: function() {
            return uf8.SSOClient
        }
    })
})
// @from(Ln 72620, Col 4)
Qe1 = R((kcK) => {
    var vC = wX(),
        Fe1 = Ob(),
        mf8 = of(),
        vcK = Ve1(),
        Qf8 = (A) => A && (typeof A.sso_start_url === "string" || typeof A.sso_account_id === "string" || typeof A.sso_session === "string" || typeof A.sso_region === "string" || typeof A.sso_role_name === "string"),
        iE1 = !1,
        Ff8 = async ({
            ssoStartUrl: A,
            ssoSession: q,
            ssoAccountId: K,
            ssoRegion: Y,
            ssoRoleName: z,
            ssoClient: w,
            clientConfig: H,
            parentClientConfig: $,
            profile: O,
            filepath: _,
            configFilepath: J,
            ignoreCache: X,
            logger: D
        }) => {
            let j, M = "To refresh this SSO session run aws sso login with the corresponding profile.";
            if (q) try {
                let b = await vcK.fromSso({
                    profile: O,
                    filepath: _,
                    configFilepath: J,
                    ignoreCache: X
                })();
                j = {
                    accessToken: b.token,
                    expiresAt: new Date(b.expiration).toISOString()
                }
            } catch (b) {
                throw new vC.CredentialsProviderError(b.message, {
                    tryNextLink: iE1,
                    logger: D
                })
            } else try {
                j = await Fe1.getSSOTokenFromFile(A)
            } catch (b) {
                throw new vC.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
                    tryNextLink: iE1,
                    logger: D
                })
            }
            if (new Date(j.expiresAt).getTime() - Date.now() <= 0) throw new vC.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
                tryNextLink: iE1,
                logger: D
            });
            let {
                accessToken: P
            } = j, {
                SSOClient: W,
                GetRoleCredentialsCommand: G
            } = await Promise.resolve().then(function() {
                return Bf8()
            }), f = w || new W(Object.assign({}, H ?? {}, {
                logger: H?.logger ?? $?.logger,
                region: H?.region ?? Y,
                userAgentAppId: H?.userAgentAppId ?? $?.userAgentAppId
            })), Z;
            try {
                Z = await f.send(new G({
                    accountId: K,
                    roleName: z,
                    accessToken: P
                }))
            } catch (b) {
                throw new vC.CredentialsProviderError(b, {
                    tryNextLink: iE1,
                    logger: D
                })
            }
            let {
                roleCredentials: {
                    accessKeyId: N,
                    secretAccessKey: T,
                    sessionToken: k,
                    expiration: y,
                    credentialScope: B,
                    accountId: S
                } = {}
            } = Z;
            if (!N || !T || !k || !y) throw new vC.CredentialsProviderError("SSO returns an invalid temporary credential.", {
                tryNextLink: iE1,
                logger: D
            });
            let m = {
                accessKeyId: N,
                secretAccessKey: T,
                sessionToken: k,
                expiration: new Date(y),
                ...B && {
                    credentialScope: B
                },
                ...S && {
                    accountId: S
                }
            };
            if (q) mf8.setCredentialFeature(m, "CREDENTIALS_SSO", "s");
            else mf8.setCredentialFeature(m, "CREDENTIALS_SSO_LEGACY", "u");
            return m
        }, gf8 = (A, q) => {
            let {
                sso_start_url: K,
                sso_account_id: Y,
                sso_region: z,
                sso_role_name: w
            } = A;
            if (!K || !Y || !z || !w) throw new vC.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(A).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
                tryNextLink: !1,
                logger: q
            });
            return A
        }, EcK = (A = {}) => async ({
            callerClientConfig: q
        } = {}) => {
            A.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
            let {
                ssoStartUrl: K,
                ssoAccountId: Y,
                ssoRegion: z,
                ssoRoleName: w,
                ssoSession: H
            } = A, {
                ssoClient: $
            } = A, O = Fe1.getProfileName({
                profile: A.profile ?? q?.profile
            });
            if (!K && !Y && !z && !w && !H) {
                let J = (await Fe1.parseKnownFiles(A))[O];
                if (!J) throw new vC.CredentialsProviderError(`Profile ${O} was not found.`, {
                    logger: A.logger
                });
                if (!Qf8(J)) throw new vC.CredentialsProviderError(`Profile ${O} is not configured with SSO credentials.`, {
                    logger: A.logger
                });
                if (J?.sso_session) {
                    let G = (await Fe1.loadSsoSessionData(A))[J.sso_session],
                        f = ` configurations in profile ${O} and sso-session ${J.sso_session}`;
                    if (z && z !== G.sso_region) throw new vC.CredentialsProviderError("Conflicting SSO region" + f, {
                        tryNextLink: !1,
                        logger: A.logger
                    });
                    if (K && K !== G.sso_start_url) throw new vC.CredentialsProviderError("Conflicting SSO start_url" + f, {
                        tryNextLink: !1,
                        logger: A.logger
                    });
                    J.sso_region = G.sso_region, J.sso_start_url = G.sso_start_url
                }
                let {
                    sso_start_url: X,
                    sso_account_id: D,
                    sso_region: j,
                    sso_role_name: M,
                    sso_session: P
                } = gf8(J, A.logger);
                return Ff8({
                    ssoStartUrl: X,
                    ssoSession: P,
                    ssoAccountId: D,
                    ssoRegion: j,
                    ssoRoleName: M,
                    ssoClient: $,
                    clientConfig: A.clientConfig,
                    parentClientConfig: A.parentClientConfig,
                    profile: O,
                    filepath: A.filepath,
                    configFilepath: A.configFilepath,
                    ignoreCache: A.ignoreCache,
                    logger: A.logger
                })
            } else if (!K || !Y || !z || !w) throw new vC.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
                tryNextLink: !1,
                logger: A.logger
            });
            else return Ff8({
                ssoStartUrl: K,
                ssoSession: H,
                ssoAccountId: Y,
                ssoRegion: z,
                ssoRoleName: w,
                ssoClient: $,
                clientConfig: A.clientConfig,
                parentClientConfig: A.parentClientConfig,
                profile: O,
                filepath: A.filepath,
                configFilepath: A.configFilepath,
                ignoreCache: A.ignoreCache,
                logger: A.logger
            })
        };
    kcK.fromSSO = EcK;
    kcK.isSsoProfile = Qf8;
    kcK.validateSsoProfile = gf8
})
// @from(Ln 72819, Col 4)
Uf8 = R((bcK) => {
    bcK.HttpAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(bcK.HttpAuthLocation || (bcK.HttpAuthLocation = {}));
    bcK.HttpApiKeyAuthLocation = void 0;
    (function(A) {
        A.HEADER = "header", A.QUERY = "query"
    })(bcK.HttpApiKeyAuthLocation || (bcK.HttpApiKeyAuthLocation = {}));
    bcK.EndpointURLScheme = void 0;
    (function(A) {
        A.HTTP = "http", A.HTTPS = "https"
    })(bcK.EndpointURLScheme || (bcK.EndpointURLScheme = {}));
    bcK.AlgorithmId = void 0;
    (function(A) {
        A.MD5 = "md5", A.CRC32 = "crc32", A.CRC32C = "crc32c", A.SHA1 = "sha1", A.SHA256 = "sha256"
    })(bcK.AlgorithmId || (bcK.AlgorithmId = {}));
    var CcK = (A) => {
            let q = [];
            if (A.sha256 !== void 0) q.push({
                algorithmId: () => bcK.AlgorithmId.SHA256,
                checksumConstructor: () => A.sha256
            });
            if (A.md5 != null) q.push({
                algorithmId: () => bcK.AlgorithmId.MD5,
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
        ScK = (A) => {
            let q = {};
            return A.checksumAlgorithms().forEach((K) => {
                q[K.algorithmId()] = K.checksumConstructor()
            }), q
        },
        hcK = (A) => {
            return CcK(A)
        },
        IcK = (A) => {
            return ScK(A)
        };
    bcK.FieldPosition = void 0;
    (function(A) {
        A[A.HEADER = 0] = "HEADER", A[A.TRAILER = 1] = "TRAILER"
    })(bcK.FieldPosition || (bcK.FieldPosition = {}));
    var xcK = "__smithy_context";
    bcK.IniSectionType = void 0;
    (function(A) {
        A.PROFILE = "profile", A.SSO_SESSION = "sso-session", A.SERVICES = "services"
    })(bcK.IniSectionType || (bcK.IniSectionType = {}));
    bcK.RequestHandlerProtocol = void 0;
    (function(A) {
        A.HTTP_0_9 = "http/0.9", A.HTTP_1_0 = "http/1.0", A.TDS_8_0 = "tds/8.0"
    })(bcK.RequestHandlerProtocol || (bcK.RequestHandlerProtocol = {}));
    bcK.SMITHY_CONTEXT_KEY = xcK;
    bcK.getDefaultClientConfiguration = hcK;
    bcK.resolveDefaultRuntimeConfig = IcK
})
// @from(Ln 72884, Col 4)
lf8 = R((dcK) => {
    var FcK = Uf8(),
        QcK = (A) => {
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
        gcK = (A) => {
            return {
                httpHandler: A.httpHandler()
            }
        };
    class pf8 {
        name;
        kind;
        values;
        constructor({
            name: A,
            kind: q = FcK.FieldPosition.HEADER,
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
    class df8 {
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
    class ge1 {
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
            let q = new ge1({
                ...A,
                headers: {
                    ...A.headers
                }
            });
            if (q.query) q.query = UcK(q.query);
            return q
        }
        static isInstance(A) {
            if (!A) return !1;
            let q = A;
            return "method" in q && "protocol" in q && "hostname" in q && "path" in q && typeof q.query === "object" && typeof q.headers === "object"
        }
        clone() {
            return ge1.clone(this)
        }
    }

    function UcK(A) {
        return Object.keys(A).reduce((q, K) => {
            let Y = A[K];
            return {
                ...q,
                [K]: Array.isArray(Y) ? [...Y] : Y
            }
        }, {})
    }
    class cf8 {
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

    function pcK(A) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(A)
    }
    dcK.Field = pf8;
    dcK.Fields = df8;
    dcK.HttpRequest = ge1;
    dcK.HttpResponse = cf8;
    dcK.getHttpHandlerExtensionConfiguration = QcK;
    dcK.isValidHostname = pcK;
    dcK.resolveHttpHandlerRuntimeConfig = gcK
})
// @from(Ln 73026, Col 4)
dc6 = R((if8) => {
    Object.defineProperty(if8, "__esModule", {
        value: !0
    });
    if8.resolveHttpAuthSchemeConfig = if8.defaultSigninHttpAuthSchemeProvider = if8.defaultSigninHttpAuthSchemeParametersProvider = void 0;
    var scK = YH(),
        pc6 = iP(),
        tcK = async (A, q, K) => {
            return {
                operation: (0, pc6.getSmithyContext)(q).operation,
                region: await (0, pc6.normalizeProvider)(A.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    if8.defaultSigninHttpAuthSchemeParametersProvider = tcK;

    function ecK(A) {
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

    function AlK(A) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var qlK = (A) => {
        let q = [];
        switch (A.operation) {
            case "CreateOAuth2Token": {
                q.push(AlK(A));
                break
            }
            default:
                q.push(ecK(A))
        }
        return q
    };
    if8.defaultSigninHttpAuthSchemeProvider = qlK;
    var KlK = (A) => {
        let q = (0, scK.resolveAwsSdkSigV4Config)(A);
        return Object.assign(q, {
            authSchemePreference: (0, pc6.normalizeProvider)(A.authSchemePreference ?? [])
        })
    };
    if8.resolveHttpAuthSchemeConfig = KlK
})
// @from(Ln 73085, Col 4)
wV8 = R((YV8) => {
    Object.defineProperty(YV8, "__esModule", {
        value: !0
    });
    YV8.ruleSet = void 0;
    var KV8 = "required",
        oP = "fn",
        aP = "argv",
        Yg = "ref",
        rf8 = !0,
        of8 = "isSet",
        kA1 = "booleanEquals",
        tH1 = "error",
        pi = "endpoint",
        EC = "tree",
        de1 = "PartitionResult",
        cc6 = "stringEquals",
        af8 = {
            [KV8]: !0,
            default: !1,
            type: "boolean"
        },
        sf8 = {
            [KV8]: !1,
            type: "string"
        },
        tf8 = {
            [Yg]: "Endpoint"
        },
        lc6 = {
            [oP]: kA1,
            [aP]: [{
                [Yg]: "UseFIPS"
            }, !0]
        },
        ic6 = {
            [oP]: kA1,
            [aP]: [{
                [Yg]: "UseDualStack"
            }, !0]
        },
        rP = {},
        nc6 = {
            [oP]: "getAttr",
            [aP]: [{
                [Yg]: de1
            }, "name"]
        },
        Ue1 = {
            [oP]: kA1,
            [aP]: [{
                [Yg]: "UseFIPS"
            }, !1]
        },
        pe1 = {
            [oP]: kA1,
            [aP]: [{
                [Yg]: "UseDualStack"
            }, !1]
        },
        ef8 = {
            [oP]: "getAttr",
            [aP]: [{
                [Yg]: de1
            }, "supportsFIPS"]
        },
        AV8 = {
            [oP]: kA1,
            [aP]: [!0, {
                [oP]: "getAttr",
                [aP]: [{
                    [Yg]: de1
                }, "supportsDualStack"]
            }]
        },
        qV8 = [{
            [Yg]: "Region"
        }],
        wlK = {
            version: "1.0",
            parameters: {
                UseDualStack: af8,
                UseFIPS: af8,
                Endpoint: sf8,
                Region: sf8
            },
            rules: [{
                conditions: [{
                    [oP]: of8,
                    [aP]: [tf8]
                }],
                rules: [{
                    conditions: [lc6],
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: tH1
                }, {
                    rules: [{
                        conditions: [ic6],
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: tH1
                    }, {
                        endpoint: {
                            url: tf8,
                            properties: rP,
                            headers: rP
                        },
                        type: pi
                    }],
                    type: EC
                }],
                type: EC
            }, {
                rules: [{
                    conditions: [{
                        [oP]: of8,
                        [aP]: qV8
                    }],
                    rules: [{
                        conditions: [{
                            [oP]: "aws.partition",
                            [aP]: qV8,
                            assign: de1
                        }],
                        rules: [{
                            conditions: [{
                                [oP]: cc6,
                                [aP]: [nc6, "aws"]
                            }, Ue1, pe1],
                            endpoint: {
                                url: "https://{Region}.signin.aws.amazon.com",
                                properties: rP,
                                headers: rP
                            },
                            type: pi
                        }, {
                            conditions: [{
                                [oP]: cc6,
                                [aP]: [nc6, "aws-cn"]
                            }, Ue1, pe1],
                            endpoint: {
                                url: "https://{Region}.signin.amazonaws.cn",
                                properties: rP,
                                headers: rP
                            },
                            type: pi
                        }, {
                            conditions: [{
                                [oP]: cc6,
                                [aP]: [nc6, "aws-us-gov"]
                            }, Ue1, pe1],
                            endpoint: {
                                url: "https://{Region}.signin.amazonaws-us-gov.com",
                                properties: rP,
                                headers: rP
                            },
                            type: pi
                        }, {
                            conditions: [lc6, ic6],
                            rules: [{
                                conditions: [{
                                    [oP]: kA1,
                                    [aP]: [rf8, ef8]
                                }, AV8],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                        properties: rP,
                                        headers: rP
                                    },
                                    type: pi
                                }],
                                type: EC
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: tH1
                            }],
                            type: EC
                        }, {
                            conditions: [lc6, pe1],
                            rules: [{
                                conditions: [{
                                    [oP]: kA1,
                                    [aP]: [ef8, rf8]
                                }],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
                                        properties: rP,
                                        headers: rP
                                    },
                                    type: pi
                                }],
                                type: EC
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: tH1
                            }],
                            type: EC
                        }, {
                            conditions: [Ue1, ic6],
                            rules: [{
                                conditions: [AV8],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                        properties: rP,
                                        headers: rP
                                    },
                                    type: pi
                                }],
                                type: EC
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: tH1
                            }],
                            type: EC
                        }, {
                            endpoint: {
                                url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
                                properties: rP,
                                headers: rP
                            },
                            type: pi
                        }],
                        type: EC
                    }],
                    type: EC
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: tH1
                }],
                type: EC
            }]
        };
    YV8.ruleSet = wlK
})
// @from(Ln 73321, Col 4)
OV8 = R((HV8) => {
    Object.defineProperty(HV8, "__esModule", {
        value: !0
    });
    HV8.defaultEndpointResolver = void 0;
    var HlK = zb(),
        rc6 = GC(),
        $lK = wV8(),
        OlK = new rc6.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        _lK = (A, q = {}) => {
            return OlK.get(A, () => (0, rc6.resolveEndpoint)($lK.ruleSet, {
                endpointParams: A,
                logger: q.logger
            }))
        };
    HV8.defaultEndpointResolver = _lK;
    rc6.customEndpointFunctions.aws = HlK.awsEndpointFunctions
})
// @from(Ln 73342, Col 4)
jV8 = R((XV8) => {
    Object.defineProperty(XV8, "__esModule", {
        value: !0
    });
    XV8.getRuntimeConfig = void 0;
    var JlK = YH(),
        XlK = eQ(),
        DlK = lz(),
        jlK = uG(),
        MlK = fk(),
        _V8 = We1(),
        JV8 = Z2(),
        PlK = dc6(),
        WlK = OV8(),
        GlK = (A) => {
            return {
                apiVersion: "2023-01-01",
                base64Decoder: A?.base64Decoder ?? _V8.fromBase64,
                base64Encoder: A?.base64Encoder ?? _V8.toBase64,
                disableHostPrefix: A?.disableHostPrefix ?? !1,
                endpointProvider: A?.endpointProvider ?? WlK.defaultEndpointResolver,
                extensions: A?.extensions ?? [],
                httpAuthSchemeProvider: A?.httpAuthSchemeProvider ?? PlK.defaultSigninHttpAuthSchemeProvider,
                httpAuthSchemes: A?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (q) => q.getIdentityProvider("aws.auth#sigv4"),
                    signer: new JlK.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (q) => q.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new DlK.NoAuthSigner
                }],
                logger: A?.logger ?? new jlK.NoOpLogger,
                protocol: A?.protocol ?? new XlK.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.signin"
                }),
                serviceId: A?.serviceId ?? "Signin",
                urlParser: A?.urlParser ?? MlK.parseUrl,
                utf8Decoder: A?.utf8Decoder ?? JV8.fromUtf8,
                utf8Encoder: A?.utf8Encoder ?? JV8.toUtf8
            }
        };
    XV8.getRuntimeConfig = GlK
})
// @from(Ln 73386, Col 4)
VV8 = R((ZV8) => {
    Object.defineProperty(ZV8, "__esModule", {
        value: !0
    });
    ZV8.getRuntimeConfig = void 0;
    var ZlK = n2(),
        flK = ZlK.__importDefault(De1()),
        MV8 = YH(),
        PV8 = oQ(),
        ce1 = YJ(),
        VlK = aQ(),
        WV8 = qM(),
        LA1 = af(),
        GV8 = cf(),
        NlK = sQ(),
        TlK = _b(),
        vlK = jV8(),
        ElK = uG(),
        klK = qg(),
        LlK = uG(),
        RlK = (A) => {
            (0, LlK.emitWarningIfUnsupportedVersion)(process.version);
            let q = (0, klK.resolveDefaultsModeConfig)(A),
                K = () => q().then(ElK.loadConfigsForDefaultMode),
                Y = (0, vlK.getRuntimeConfig)(A);
            (0, MV8.emitWarningIfUnsupportedVersion)(process.version);
            let z = {
                profile: A?.profile,
                logger: Y.logger
            };
            return {
                ...Y,
                ...A,
                runtime: "node",
                defaultsMode: q,
                authSchemePreference: A?.authSchemePreference ?? (0, LA1.loadConfig)(MV8.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, z),
                bodyLengthChecker: A?.bodyLengthChecker ?? NlK.calculateBodyLength,
                defaultUserAgentProvider: A?.defaultUserAgentProvider ?? (0, PV8.createDefaultUserAgentProvider)({
                    serviceId: Y.serviceId,
                    clientVersion: flK.default.version
                }),
                maxAttempts: A?.maxAttempts ?? (0, LA1.loadConfig)(WV8.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, A),
                region: A?.region ?? (0, LA1.loadConfig)(ce1.NODE_REGION_CONFIG_OPTIONS, {
                    ...ce1.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...z
                }),
                requestHandler: GV8.NodeHttpHandler.create(A?.requestHandler ?? K),
                retryMode: A?.retryMode ?? (0, LA1.loadConfig)({
                    ...WV8.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await K()).retryMode || TlK.DEFAULT_RETRY_MODE
                }, A),
                sha256: A?.sha256 ?? VlK.Hash.bind(null, "sha256"),
                streamCollector: A?.streamCollector ?? GV8.streamCollector,
                useDualstackEndpoint: A?.useDualstackEndpoint ?? (0, LA1.loadConfig)(ce1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, z),
                useFipsEndpoint: A?.useFipsEndpoint ?? (0, LA1.loadConfig)(ce1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, z),
                userAgentAppId: A?.userAgentAppId ?? (0, LA1.loadConfig)(PV8.NODE_APP_ID_CONFIG_OPTIONS, z)
            }
        };
    ZV8.getRuntimeConfig = RlK
})
// @from(Ln 73446, Col 4)
lV8 = R((ql6) => {
    var NV8 = BQ(),
        ylK = mQ(),
        ClK = FQ(),
        TV8 = $b(),
        SlK = YJ(),
        oc6 = lz(),
        eH1 = R$(),
        hlK = rQ(),
        FV8 = ZC(),
        vV8 = qM(),
        di = uG(),
        EV8 = dc6(),
        IlK = VV8(),
        kV8 = fC(),
        LV8 = fe1(),
        xlK = (A) => {
            return Object.assign(A, {
                useDualstackEndpoint: A.useDualstackEndpoint ?? !1,
                useFipsEndpoint: A.useFipsEndpoint ?? !1,
                defaultSigningName: "signin"
            })
        },
        blK = {
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
        ulK = (A) => {
            let {
                httpAuthSchemes: q,
                httpAuthSchemeProvider: K,
                credentials: Y
            } = A;
            return {
                setHttpAuthScheme(z) {
                    let w = q.findIndex((H) => H.schemeId === z.schemeId);
                    if (w === -1) q.push(z);
                    else q.splice(w, 1, z)
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
        BlK = (A) => {
            return {
                httpAuthSchemes: A.httpAuthSchemes(),
                httpAuthSchemeProvider: A.httpAuthSchemeProvider(),
                credentials: A.credentials()
            }
        },
        mlK = (A, q) => {
            let K = Object.assign(kV8.getAwsRegionExtensionConfiguration(A), di.getDefaultExtensionConfiguration(A), LV8.getHttpHandlerExtensionConfiguration(A), ulK(A));
            return q.forEach((Y) => Y.configure(K)), Object.assign(A, kV8.resolveAwsRegionExtensionConfiguration(K), di.resolveDefaultRuntimeConfig(K), LV8.resolveHttpHandlerRuntimeConfig(K), BlK(K))
        };
    class ac6 extends di.Client {
        config;
        constructor(...[A]) {
            let q = IlK.getRuntimeConfig(A || {});
            super(q);
            this.initConfig = q;
            let K = xlK(q),
                Y = TV8.resolveUserAgentConfig(K),
                z = vV8.resolveRetryConfig(Y),
                w = SlK.resolveRegionConfig(z),
                H = NV8.resolveHostHeaderConfig(w),
                $ = FV8.resolveEndpointConfig(H),
                O = EV8.resolveHttpAuthSchemeConfig($),
                _ = mlK(O, A?.extensions || []);
            this.config = _, this.middlewareStack.use(eH1.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(TV8.getUserAgentPlugin(this.config)), this.middlewareStack.use(vV8.getRetryPlugin(this.config)), this.middlewareStack.use(hlK.getContentLengthPlugin(this.config)), this.middlewareStack.use(NV8.getHostHeaderPlugin(this.config)), this.middlewareStack.use(ylK.getLoggerPlugin(this.config)), this.middlewareStack.use(ClK.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(oc6.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: EV8.defaultSigninHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (J) => new oc6.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": J.credentials
                })
            })), this.middlewareStack.use(oc6.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var A$1 = class A extends di.ServiceException {
            constructor(q) {
                super(q);
                Object.setPrototypeOf(this, A.prototype)
            }
        },
        QV8 = class A extends A$1 {
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
        gV8 = class A extends A$1 {
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
        UV8 = class A extends A$1 {
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
        pV8 = class A extends A$1 {
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
        FlK = "AccessDeniedException",
        QlK = "AccessToken",
        glK = "CreateOAuth2Token",
        UlK = "CreateOAuth2TokenRequest",
        plK = "CreateOAuth2TokenRequestBody",
        dlK = "CreateOAuth2TokenResponseBody",
        clK = "CreateOAuth2TokenResponse",
        llK = "InternalServerException",
        ilK = "RefreshToken",
        nlK = "TooManyRequestsError",
        rlK = "ValidationException",
        RV8 = "accessKeyId",
        yV8 = "accessToken",
        sc6 = "client",
        CV8 = "clientId",
        SV8 = "codeVerifier",
        olK = "code",
        ci = "error",
        hV8 = "expiresIn",
        IV8 = "grantType",
        alK = "http",
        tc6 = "httpError",
        xV8 = "idToken",
        RT = "jsonName",
        ie1 = "message",
        le1 = "refreshToken",
        bV8 = "redirectUri",
        slK = "server",
        uV8 = "secretAccessKey",
        BV8 = "sessionToken",
        dV8 = "smithy.ts.sdk.synthetic.com.amazonaws.signin",
        tlK = "tokenInput",
        elK = "tokenOutput",
        mV8 = "tokenType",
        BG = "com.amazonaws.signin",
        cV8 = [0, BG, ilK, 8, 0],
        AiK = [-3, BG, FlK, {
                [ci]: sc6
            },
            [ci, ie1],
            [0, 0]
        ];
    eH1.TypeRegistry.for(BG).registerError(AiK, QV8);
    var qiK = [3, BG, QlK, 8, [RV8, uV8, BV8],
            [
                [0, {
                    [RT]: RV8
                }],
                [0, {
                    [RT]: uV8
                }],
                [0, {
                    [RT]: BV8
                }]
            ]
        ],
        KiK = [3, BG, UlK, 0, [tlK],
            [
                [() => YiK, 16]
            ]
        ],
        YiK = [3, BG, plK, 0, [CV8, IV8, olK, bV8, SV8, le1],
            [
                [0, {
                    [RT]: CV8
                }],
                [0, {
                    [RT]: IV8
                }], 0, [0, {
                    [RT]: bV8
                }],
                [0, {
                    [RT]: SV8
                }],
                [() => cV8, {
                    [RT]: le1
                }]
            ]
        ],
        ziK = [3, BG, clK, 0, [elK],
            [
                [() => wiK, 16]
            ]
        ],
        wiK = [3, BG, dlK, 0, [yV8, mV8, hV8, le1, xV8],
            [
                [() => qiK, {
                    [RT]: yV8
                }],
                [0, {
                    [RT]: mV8
                }],
                [1, {
                    [RT]: hV8
                }],
                [() => cV8, {
                    [RT]: le1
                }],
                [0, {
                    [RT]: xV8
                }]
            ]
        ],
        HiK = [-3, BG, llK, {
                [ci]: slK,
                [tc6]: 500
            },
            [ci, ie1],
            [0, 0]
        ];
    eH1.TypeRegistry.for(BG).registerError(HiK, gV8);
    var $iK = [-3, BG, nlK, {
            [ci]: sc6,
            [tc6]: 429
        },
        [ci, ie1],
        [0, 0]
    ];
    eH1.TypeRegistry.for(BG).registerError($iK, UV8);
    var OiK = [-3, BG, rlK, {
            [ci]: sc6,
            [tc6]: 400
        },
        [ci, ie1],
        [0, 0]
    ];
    eH1.TypeRegistry.for(BG).registerError(OiK, pV8);
    var _iK = [-3, dV8, "SigninServiceException", 0, [],
        []
    ];
    eH1.TypeRegistry.for(dV8).registerError(_iK, A$1);
    var JiK = [9, BG, glK, {
        [alK]: ["POST", "/v1/token", 200]
    }, () => KiK, () => ziK];
    class ec6 extends di.Command.classBuilder().ep(blK).m(function(A, q, K, Y) {
        return [FV8.getEndpointPlugin(K, A.getEndpointParameterInstructions())]
    }).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(JiK).build() {}
    var XiK = {
        CreateOAuth2TokenCommand: ec6
    };
    class Al6 extends ac6 {}
    di.createAggregatedClient(XiK, Al6);
    var DiK = {
        AUTHCODE_EXPIRED: "AUTHCODE_EXPIRED",
        INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
        INVALID_REQUEST: "INVALID_REQUEST",
        SERVER_ERROR: "server_error",
        TOKEN_EXPIRED: "TOKEN_EXPIRED",
        USER_CREDENTIALS_CHANGED: "USER_CREDENTIALS_CHANGED"
    };
    Object.defineProperty(ql6, "$Command", {
        enumerable: !0,
        get: function() {
            return di.Command
        }
    });
    Object.defineProperty(ql6, "__Client", {
        enumerable: !0,
        get: function() {
            return di.Client
        }
    });
    ql6.AccessDeniedException = QV8;
    ql6.CreateOAuth2TokenCommand = ec6;
    ql6.InternalServerException = gV8;
    ql6.OAuth2ErrorCode = DiK;
    ql6.Signin = Al6;
    ql6.SigninClient = ac6;
    ql6.SigninServiceException = A$1;
    ql6.TooManyRequestsError = UV8;
    ql6.ValidationException = pV8
})