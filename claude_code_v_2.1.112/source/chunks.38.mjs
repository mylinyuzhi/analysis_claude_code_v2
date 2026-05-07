
// @from(Ln 91332, Col 4)
wl6 = p((ov6) => {
    var kAq = gU(),
        YW1 = XE(),
        KW1 = eP1(),
        cB3 = sj(),
        TAq = JE();
    class NAq {
        config;
        middlewareStack = kAq.constructStack();
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
    var qW1 = "***SensitiveInformation***";

    function _W1(q, K) {
        if (K == null) return K;
        let _ = cB3.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return qW1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return qW1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return qW1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = _W1(O, z[A]);
            return Y
        }
        return K
    }
    class AW1 {
        middlewareStack = kAq.constructStack();
        schema;
        static classBuilder() {
            return new EAq
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
                    [KW1.SMITHY_CONTEXT_KEY]: {
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
    class EAq {
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
            return K = class extends AW1 {
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
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? _W1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? _W1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var lB3 = "***SensitiveInformation***",
        nB3 = (q, K) => {
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
    class rv6 extends Error {
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
            return rv6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === rv6) return rv6.isInstance(q);
            if (rv6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var yAq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        LAq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = rB3(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw yAq(O, K)
        },
        iB3 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                LAq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        rB3 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        oB3 = (q) => {
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
        VAq = !1,
        aB3 = (q) => {
            if (q && !VAq && parseInt(q.substring(1, q.indexOf("."))) < 16) VAq = !0
        },
        sB3 = (q) => {
            let K = [];
            for (let _ in KW1.AlgorithmId) {
                let z = KW1.AlgorithmId[_];
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
        tB3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        eB3 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        qp3 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        hAq = (q) => {
            return Object.assign(sB3(q), eB3(q))
        },
        Kp3 = hAq,
        _p3 = (q) => {
            return Object.assign(tB3(q), qp3(q))
        },
        zp3 = (q) => Array.isArray(q) ? q : [q],
        RAq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = RAq(q[_]);
            return q
        },
        Yp3 = (q) => {
            return q != null
        };
    class SAq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function CAq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, wp3(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            bAq(z, null, A, O)
        }
        return z
    }
    var Ap3 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        Op3 = (q, K) => {
            let _ = {};
            for (let z in K) bAq(_, q, K, z);
            return _
        },
        wp3 = (q, K, _) => {
            return CAq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        bAq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = $p3, $ = jp3, j = z] = O;
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
        $p3 = (q) => q != null,
        jp3 = (q) => q,
        Hp3 = (q) => {
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
        Jp3 = (q) => q.toISOString().replace(".000Z", "Z"),
        zW1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(zW1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = zW1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(ov6, "collectBody", {
        enumerable: !0,
        get: function() {
            return YW1.collectBody
        }
    });
    Object.defineProperty(ov6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return YW1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(ov6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return YW1.resolvedPath
        }
    });
    ov6.Client = NAq;
    ov6.Command = AW1;
    ov6.NoOpLogger = SAq;
    ov6.SENSITIVE_STRING = lB3;
    ov6.ServiceException = rv6;
    ov6._json = zW1;
    ov6.convertMap = Ap3;
    ov6.createAggregatedClient = nB3;
    ov6.decorateServiceException = yAq;
    ov6.emitWarningIfUnsupportedVersion = aB3;
    ov6.getArrayIfSingleItem = zp3;
    ov6.getDefaultClientConfiguration = Kp3;
    ov6.getDefaultExtensionConfiguration = hAq;
    ov6.getValueFromTextNode = RAq;
    ov6.isSerializableHeaderValue = Yp3;
    ov6.loadConfigsForDefaultMode = oB3;
    ov6.map = CAq;
    ov6.resolveDefaultRuntimeConfig = _p3;
    ov6.serializeDateTime = Jp3;
    ov6.serializeFloat = Hp3;
    ov6.take = Op3;
    ov6.throwDefaultError = LAq;
    ov6.withBaseException = iB3;
    Object.keys(TAq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(ov6, q)) Object.defineProperty(ov6, q, {
            enumerable: !0,
            get: function() {
                return TAq[q]
            }
        })
    })
})
// @from(Ln 91802, Col 4)
$W1 = p((IAq) => {
    Object.defineProperty(IAq, "__esModule", {
        value: !0
    });
    IAq.resolveHttpAuthSchemeConfig = IAq.defaultBedrockHttpAuthSchemeProvider = IAq.defaultBedrockHttpAuthSchemeParametersProvider = void 0;
    var up3 = k$(),
        OW1 = FO(),
        wW1 = Dv(),
        mp3 = async (q, K, _) => {
            return {
                operation: (0, wW1.getSmithyContext)(K).operation,
                region: await (0, wW1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    IAq.defaultBedrockHttpAuthSchemeParametersProvider = mp3;

    function Bp3(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "bedrock",
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

    function pp3(q) {
        return {
            schemeId: "smithy.api#httpBearerAuth",
            propertiesExtractor: ({
                profile: K,
                filepath: _,
                configFilepath: z,
                ignoreCache: Y
            }, A) => ({
                identityProperties: {
                    profile: K,
                    filepath: _,
                    configFilepath: z,
                    ignoreCache: Y
                }
            })
        }
    }
    var Fp3 = (q) => {
        let K = [];
        switch (q.operation) {
            default:
                K.push(Bp3(q)), K.push(pp3(q))
        }
        return K
    };
    IAq.defaultBedrockHttpAuthSchemeProvider = Fp3;
    var gp3 = (q) => {
        let K = (0, OW1.memoizeIdentityProvider)(q.token, OW1.isIdentityExpired, OW1.doesIdentityRequireRefresh),
            _ = (0, up3.resolveAwsSdkSigV4Config)(q);
        return Object.assign(_, {
            authSchemePreference: (0, wW1.normalizeProvider)(q.authSchemePreference ?? []),
            token: K
        })
    };
    IAq.resolveHttpAuthSchemeConfig = gp3
})
// @from(Ln 91873, Col 4)
uAq = p((hwO, dp3) => {
    dp3.exports = {
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
// @from(Ln 91971, Col 4)
mAq = p((lp3) => {
    var cp3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    lp3.isArrayBuffer = cp3
})
// @from(Ln 91975, Col 4)
HW1 = p((ap3) => {
    var ip3 = mAq(),
        jW1 = d6("buffer"),
        rp3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!ip3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return jW1.Buffer.from(q, K, _)
        },
        op3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? jW1.Buffer.from(q, K) : jW1.Buffer.from(q)
        };
    ap3.fromArrayBuffer = rp3;
    ap3.fromString = op3
})
// @from(Ln 91989, Col 4)
FAq = p((BAq) => {
    Object.defineProperty(BAq, "__esModule", {
        value: !0
    });
    BAq.fromBase64 = void 0;
    var ep3 = HW1(),
        qF3 = /^[A-Za-z0-9+/]*={0,2}$/,
        KF3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!qF3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, ep3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    BAq.fromBase64 = KF3
})
// @from(Ln 92004, Col 4)
QAq = p((gAq) => {
    Object.defineProperty(gAq, "__esModule", {
        value: !0
    });
    gAq.toBase64 = void 0;
    var _F3 = HW1(),
        zF3 = nw(),
        YF3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, zF3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, _F3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    gAq.toBase64 = YF3
})
// @from(Ln 92020, Col 4)
lAq = p(($l6) => {
    var dAq = FAq(),
        cAq = QAq();
    Object.keys(dAq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call($l6, q)) Object.defineProperty($l6, q, {
            enumerable: !0,
            get: function() {
                return dAq[q]
            }
        })
    });
    Object.keys(cAq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call($l6, q)) Object.defineProperty($l6, q, {
            enumerable: !0,
            get: function() {
                return cAq[q]
            }
        })
    })
})
// @from(Ln 92040, Col 4)
wOq = p((AOq) => {
    Object.defineProperty(AOq, "__esModule", {
        value: !0
    });
    AOq.ruleSet = void 0;
    var _Oq = "required",
        aU = "fn",
        sU = "argv",
        sv6 = "ref",
        nAq = !0,
        iAq = "isSet",
        Hl6 = "booleanEquals",
        av6 = "error",
        jl6 = "endpoint",
        BV = "tree",
        JW1 = "PartitionResult",
        rAq = {
            [_Oq]: !1,
            type: "string"
        },
        oAq = {
            [_Oq]: !0,
            default: !1,
            type: "boolean"
        },
        aAq = {
            [sv6]: "Endpoint"
        },
        zOq = {
            [aU]: Hl6,
            [sU]: [{
                [sv6]: "UseFIPS"
            }, !0]
        },
        YOq = {
            [aU]: Hl6,
            [sU]: [{
                [sv6]: "UseDualStack"
            }, !0]
        },
        oU = {},
        sAq = {
            [aU]: "getAttr",
            [sU]: [{
                [sv6]: JW1
            }, "supportsFIPS"]
        },
        tAq = {
            [aU]: Hl6,
            [sU]: [!0, {
                [aU]: "getAttr",
                [sU]: [{
                    [sv6]: JW1
                }, "supportsDualStack"]
            }]
        },
        eAq = [zOq],
        qOq = [YOq],
        KOq = [{
            [sv6]: "Region"
        }],
        AF3 = {
            version: "1.0",
            parameters: {
                Region: rAq,
                UseDualStack: oAq,
                UseFIPS: oAq,
                Endpoint: rAq
            },
            rules: [{
                conditions: [{
                    [aU]: iAq,
                    [sU]: [aAq]
                }],
                rules: [{
                    conditions: eAq,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: av6
                }, {
                    rules: [{
                        conditions: qOq,
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: av6
                    }, {
                        endpoint: {
                            url: aAq,
                            properties: oU,
                            headers: oU
                        },
                        type: jl6
                    }],
                    type: BV
                }],
                type: BV
            }, {
                rules: [{
                    conditions: [{
                        [aU]: iAq,
                        [sU]: KOq
                    }],
                    rules: [{
                        conditions: [{
                            [aU]: "aws.partition",
                            [sU]: KOq,
                            assign: JW1
                        }],
                        rules: [{
                            conditions: [zOq, YOq],
                            rules: [{
                                conditions: [{
                                    [aU]: Hl6,
                                    [sU]: [nAq, sAq]
                                }, tAq],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: oU,
                                            headers: oU
                                        },
                                        type: jl6
                                    }],
                                    type: BV
                                }],
                                type: BV
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: av6
                            }],
                            type: BV
                        }, {
                            conditions: eAq,
                            rules: [{
                                conditions: [{
                                    [aU]: Hl6,
                                    [sU]: [sAq, nAq]
                                }],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock-fips.{Region}.{PartitionResult#dnsSuffix}",
                                            properties: oU,
                                            headers: oU
                                        },
                                        type: jl6
                                    }],
                                    type: BV
                                }],
                                type: BV
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: av6
                            }],
                            type: BV
                        }, {
                            conditions: qOq,
                            rules: [{
                                conditions: [tAq],
                                rules: [{
                                    rules: [{
                                        endpoint: {
                                            url: "https://bedrock.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                            properties: oU,
                                            headers: oU
                                        },
                                        type: jl6
                                    }],
                                    type: BV
                                }],
                                type: BV
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: av6
                            }],
                            type: BV
                        }, {
                            rules: [{
                                endpoint: {
                                    url: "https://bedrock.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: oU,
                                    headers: oU
                                },
                                type: jl6
                            }],
                            type: BV
                        }],
                        type: BV
                    }],
                    type: BV
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: av6
                }],
                type: BV
            }]
        };
    AOq.ruleSet = AF3
})
// @from(Ln 92238, Col 4)
HOq = p(($Oq) => {
    Object.defineProperty($Oq, "__esModule", {
        value: !0
    });
    $Oq.defaultEndpointResolver = void 0;
    var OF3 = QU(),
        XW1 = dm(),
        wF3 = wOq(),
        $F3 = new XW1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        jF3 = (q, K = {}) => {
            return $F3.get(q, () => (0, XW1.resolveEndpoint)(wF3.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    $Oq.defaultEndpointResolver = jF3;
    XW1.customEndpointFunctions.aws = OF3.awsEndpointFunctions
})
// @from(Ln 92259, Col 4)
WOq = p((MOq) => {
    Object.defineProperty(MOq, "__esModule", {
        value: !0
    });
    MOq.getRuntimeConfig = void 0;
    var HF3 = k$(),
        JF3 = Ao(),
        XF3 = FO(),
        MF3 = wl6(),
        PF3 = jb(),
        JOq = lAq(),
        XOq = nw(),
        WF3 = $W1(),
        DF3 = HOq(),
        ZF3 = (q) => {
            return {
                apiVersion: "2023-04-20",
                base64Decoder: q?.base64Decoder ?? JOq.fromBase64,
                base64Encoder: q?.base64Encoder ?? JOq.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? DF3.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? WF3.defaultBedrockHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new HF3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#httpBearerAuth"),
                    signer: new XF3.HttpBearerAuthSigner
                }],
                logger: q?.logger ?? new MF3.NoOpLogger,
                protocol: q?.protocol ?? new JF3.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.bedrock"
                }),
                serviceId: q?.serviceId ?? "Bedrock",
                urlParser: q?.urlParser ?? PF3.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? XOq.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? XOq.toUtf8
            }
        };
    MOq.getRuntimeConfig = ZF3
})
// @from(Ln 92303, Col 4)
VOq = p((vOq) => {
    Object.defineProperty(vOq, "__esModule", {
        value: !0
    });
    vOq.getRuntimeConfig = void 0;
    var fF3 = IV(),
        GF3 = fF3.__importDefault(uAq()),
        MW1 = k$(),
        vF3 = uO6(),
        DOq = xW8(),
        ZOq = Ko(),
        G08 = KM(),
        TF3 = FO(),
        VF3 = _o(),
        fOq = rZ(),
        BO6 = jE(),
        GOq = wE(),
        kF3 = zo(),
        NF3 = lU(),
        EF3 = WOq(),
        yF3 = wl6(),
        LF3 = wo(),
        hF3 = wl6(),
        RF3 = (q) => {
            (0, hF3.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, LF3.resolveDefaultsModeConfig)(q),
                _ = () => K().then(yF3.loadConfigsForDefaultMode),
                z = (0, EF3.getRuntimeConfig)(q);
            (0, MW1.emitWarningIfUnsupportedVersion)(process.version);
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
                authSchemePreference: q?.authSchemePreference ?? (0, BO6.loadConfig)(MW1.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? kF3.calculateBodyLength,
                credentialDefaultProvider: q?.credentialDefaultProvider ?? vF3.defaultProvider,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, ZOq.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: GF3.default.version
                }),
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (A) => A.getIdentityProvider("aws.auth#sigv4"),
                    signer: new MW1.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#httpBearerAuth",
                    identityProvider: (A) => A.getIdentityProvider("smithy.api#httpBearerAuth") || (async (O) => {
                        try {
                            return await (0, DOq.fromEnvSigningName)({
                                signingName: "bedrock"
                            })()
                        } catch (w) {
                            return await (0, DOq.nodeProvider)(O)(O)
                        }
                    }),
                    signer: new TF3.HttpBearerAuthSigner
                }],
                maxAttempts: q?.maxAttempts ?? (0, BO6.loadConfig)(fOq.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, BO6.loadConfig)(G08.NODE_REGION_CONFIG_OPTIONS, {
                    ...G08.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: GOq.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, BO6.loadConfig)({
                    ...fOq.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || NF3.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? VF3.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? GOq.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, BO6.loadConfig)(G08.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, BO6.loadConfig)(G08.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, BO6.loadConfig)(ZOq.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    vOq.getRuntimeConfig = RF3
})
// @from(Ln 92385, Col 4)
yOq = p((uF3) => {
    var SF3 = eP1(),
        CF3 = (q) => {
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
        bF3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class kOq {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = SF3.FieldPosition.HEADER,
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
    class NOq {
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
    class v08 {
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
            let K = new v08({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = IF3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return v08.clone(this)
        }
    }

    function IF3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class EOq {
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

    function xF3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    uF3.Field = kOq;
    uF3.Fields = NOq;
    uF3.HttpRequest = v08;
    uF3.HttpResponse = EOq;
    uF3.getHttpHandlerExtensionConfiguration = CF3;
    uF3.isValidHostname = xF3;
    uF3.resolveHttpHandlerRuntimeConfig = bF3
})