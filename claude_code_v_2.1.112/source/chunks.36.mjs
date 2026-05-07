
// @from(Ln 86252, Col 4)
cc6 = p((mv6) => {
    var i3q = gU(),
        bM1 = XE(),
        RM1 = LM1(),
        Fh3 = sj(),
        l3q = JE();
    class r3q {
        config;
        middlewareStack = i3q.constructStack();
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
    var hM1 = "***SensitiveInformation***";

    function SM1(q, K) {
        if (K == null) return K;
        let _ = Fh3.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return hM1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return hM1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return hM1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = SM1(O, z[A]);
            return Y
        }
        return K
    }
    class IM1 {
        middlewareStack = i3q.constructStack();
        schema;
        static classBuilder() {
            return new o3q
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
                    [RM1.SMITHY_CONTEXT_KEY]: {
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
    class o3q {
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
            return K = class extends IM1 {
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
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? SM1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? SM1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var gh3 = "***SensitiveInformation***",
        Uh3 = (q, K) => {
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
    class uv6 extends Error {
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
            return uv6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === uv6) return uv6.isInstance(q);
            if (uv6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var a3q = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        s3q = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = dh3(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw a3q(O, K)
        },
        Qh3 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                s3q({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        dh3 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        ch3 = (q) => {
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
        n3q = !1,
        lh3 = (q) => {
            if (q && !n3q && parseInt(q.substring(1, q.indexOf("."))) < 16) n3q = !0
        },
        nh3 = (q) => {
            let K = [];
            for (let _ in RM1.AlgorithmId) {
                let z = RM1.AlgorithmId[_];
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
        ih3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        rh3 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        oh3 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        t3q = (q) => {
            return Object.assign(nh3(q), rh3(q))
        },
        ah3 = t3q,
        sh3 = (q) => {
            return Object.assign(ih3(q), oh3(q))
        },
        th3 = (q) => Array.isArray(q) ? q : [q],
        e3q = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = e3q(q[_]);
            return q
        },
        eh3 = (q) => {
            return q != null
        };
    class q9q {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function K9q(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, _R3(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            _9q(z, null, A, O)
        }
        return z
    }
    var qR3 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        KR3 = (q, K) => {
            let _ = {};
            for (let z in K) _9q(_, q, K, z);
            return _
        },
        _R3 = (q, K, _) => {
            return K9q(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        _9q = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = zR3, $ = YR3, j = z] = O;
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
        zR3 = (q) => q != null,
        YR3 = (q) => q,
        AR3 = (q) => {
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
        OR3 = (q) => q.toISOString().replace(".000Z", "Z"),
        CM1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(CM1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = CM1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(mv6, "collectBody", {
        enumerable: !0,
        get: function() {
            return bM1.collectBody
        }
    });
    Object.defineProperty(mv6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return bM1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(mv6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return bM1.resolvedPath
        }
    });
    mv6.Client = r3q;
    mv6.Command = IM1;
    mv6.NoOpLogger = q9q;
    mv6.SENSITIVE_STRING = gh3;
    mv6.ServiceException = uv6;
    mv6._json = CM1;
    mv6.convertMap = qR3;
    mv6.createAggregatedClient = Uh3;
    mv6.decorateServiceException = a3q;
    mv6.emitWarningIfUnsupportedVersion = lh3;
    mv6.getArrayIfSingleItem = th3;
    mv6.getDefaultClientConfiguration = ah3;
    mv6.getDefaultExtensionConfiguration = t3q;
    mv6.getValueFromTextNode = e3q;
    mv6.isSerializableHeaderValue = eh3;
    mv6.loadConfigsForDefaultMode = ch3;
    mv6.map = K9q;
    mv6.resolveDefaultRuntimeConfig = sh3;
    mv6.serializeDateTime = OR3;
    mv6.serializeFloat = AR3;
    mv6.take = KR3;
    mv6.throwDefaultError = s3q;
    mv6.withBaseException = Qh3;
    Object.keys(l3q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(mv6, q)) Object.defineProperty(mv6, q, {
            enumerable: !0,
            get: function() {
                return l3q[q]
            }
        })
    })
})
// @from(Ln 86722, Col 4)
uM1 = p((z9q) => {
    Object.defineProperty(z9q, "__esModule", {
        value: !0
    });
    z9q.resolveHttpAuthSchemeConfig = z9q.defaultSSOHttpAuthSchemeProvider = z9q.defaultSSOHttpAuthSchemeParametersProvider = void 0;
    var SR3 = k$(),
        xM1 = Dv(),
        CR3 = async (q, K, _) => {
            return {
                operation: (0, xM1.getSmithyContext)(K).operation,
                region: await (0, xM1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    z9q.defaultSSOHttpAuthSchemeParametersProvider = CR3;

    function bR3(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "awsssoportal",
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

    function uW8(q) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var IR3 = (q) => {
        let K = [];
        switch (q.operation) {
            case "GetRoleCredentials": {
                K.push(uW8(q));
                break
            }
            case "ListAccountRoles": {
                K.push(uW8(q));
                break
            }
            case "ListAccounts": {
                K.push(uW8(q));
                break
            }
            case "Logout": {
                K.push(uW8(q));
                break
            }
            default:
                K.push(bR3(q))
        }
        return K
    };
    z9q.defaultSSOHttpAuthSchemeProvider = IR3;
    var xR3 = (q) => {
        let K = (0, SR3.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, xM1.normalizeProvider)(q.authSchemePreference ?? [])
        })
    };
    z9q.resolveHttpAuthSchemeConfig = xR3
})
// @from(Ln 86793, Col 4)
A9q = p((SOO, BR3) => {
    BR3.exports = {
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
// @from(Ln 86889, Col 4)
O9q = p((FR3) => {
    var pR3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    FR3.isArrayBuffer = pR3
})
// @from(Ln 86893, Col 4)
BM1 = p((cR3) => {
    var UR3 = O9q(),
        mM1 = d6("buffer"),
        QR3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!UR3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return mM1.Buffer.from(q, K, _)
        },
        dR3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? mM1.Buffer.from(q, K) : mM1.Buffer.from(q)
        };
    cR3.fromArrayBuffer = QR3;
    cR3.fromString = dR3
})
// @from(Ln 86907, Col 4)
j9q = p((w9q) => {
    Object.defineProperty(w9q, "__esModule", {
        value: !0
    });
    w9q.fromBase64 = void 0;
    var iR3 = BM1(),
        rR3 = /^[A-Za-z0-9+/]*={0,2}$/,
        oR3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!rR3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, iR3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    w9q.fromBase64 = oR3
})
// @from(Ln 86922, Col 4)
X9q = p((H9q) => {
    Object.defineProperty(H9q, "__esModule", {
        value: !0
    });
    H9q.toBase64 = void 0;
    var aR3 = BM1(),
        sR3 = nw(),
        tR3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, sR3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, aR3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    H9q.toBase64 = tR3
})
// @from(Ln 86938, Col 4)
W9q = p((lc6) => {
    var M9q = j9q(),
        P9q = X9q();
    Object.keys(M9q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(lc6, q)) Object.defineProperty(lc6, q, {
            enumerable: !0,
            get: function() {
                return M9q[q]
            }
        })
    });
    Object.keys(P9q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(lc6, q)) Object.defineProperty(lc6, q, {
            enumerable: !0,
            get: function() {
                return P9q[q]
            }
        })
    })
})
// @from(Ln 86958, Col 4)
b9q = p((S9q) => {
    Object.defineProperty(S9q, "__esModule", {
        value: !0
    });
    S9q.ruleSet = void 0;
    var y9q = "required",
        fb = "fn",
        Gb = "argv",
        Fv6 = "ref",
        D9q = !0,
        Z9q = "isSet",
        nc6 = "booleanEquals",
        Bv6 = "error",
        pv6 = "endpoint",
        $o = "tree",
        pM1 = "PartitionResult",
        FM1 = "getAttr",
        f9q = {
            [y9q]: !1,
            type: "string"
        },
        G9q = {
            [y9q]: !0,
            default: !1,
            type: "boolean"
        },
        v9q = {
            [Fv6]: "Endpoint"
        },
        L9q = {
            [fb]: nc6,
            [Gb]: [{
                [Fv6]: "UseFIPS"
            }, !0]
        },
        h9q = {
            [fb]: nc6,
            [Gb]: [{
                [Fv6]: "UseDualStack"
            }, !0]
        },
        Zb = {},
        T9q = {
            [fb]: FM1,
            [Gb]: [{
                [Fv6]: pM1
            }, "supportsFIPS"]
        },
        R9q = {
            [Fv6]: pM1
        },
        V9q = {
            [fb]: nc6,
            [Gb]: [!0, {
                [fb]: FM1,
                [Gb]: [R9q, "supportsDualStack"]
            }]
        },
        k9q = [L9q],
        N9q = [h9q],
        E9q = [{
            [Fv6]: "Region"
        }],
        eR3 = {
            version: "1.0",
            parameters: {
                Region: f9q,
                UseDualStack: G9q,
                UseFIPS: G9q,
                Endpoint: f9q
            },
            rules: [{
                conditions: [{
                    [fb]: Z9q,
                    [Gb]: [v9q]
                }],
                rules: [{
                    conditions: k9q,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: Bv6
                }, {
                    conditions: N9q,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: Bv6
                }, {
                    endpoint: {
                        url: v9q,
                        properties: Zb,
                        headers: Zb
                    },
                    type: pv6
                }],
                type: $o
            }, {
                conditions: [{
                    [fb]: Z9q,
                    [Gb]: E9q
                }],
                rules: [{
                    conditions: [{
                        [fb]: "aws.partition",
                        [Gb]: E9q,
                        assign: pM1
                    }],
                    rules: [{
                        conditions: [L9q, h9q],
                        rules: [{
                            conditions: [{
                                [fb]: nc6,
                                [Gb]: [D9q, T9q]
                            }, V9q],
                            rules: [{
                                endpoint: {
                                    url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: Zb,
                                    headers: Zb
                                },
                                type: pv6
                            }],
                            type: $o
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: Bv6
                        }],
                        type: $o
                    }, {
                        conditions: k9q,
                        rules: [{
                            conditions: [{
                                [fb]: nc6,
                                [Gb]: [T9q, D9q]
                            }],
                            rules: [{
                                conditions: [{
                                    [fb]: "stringEquals",
                                    [Gb]: [{
                                        [fb]: FM1,
                                        [Gb]: [R9q, "name"]
                                    }, "aws-us-gov"]
                                }],
                                endpoint: {
                                    url: "https://portal.sso.{Region}.amazonaws.com",
                                    properties: Zb,
                                    headers: Zb
                                },
                                type: pv6
                            }, {
                                endpoint: {
                                    url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: Zb,
                                    headers: Zb
                                },
                                type: pv6
                            }],
                            type: $o
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: Bv6
                        }],
                        type: $o
                    }, {
                        conditions: N9q,
                        rules: [{
                            conditions: [V9q],
                            rules: [{
                                endpoint: {
                                    url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: Zb,
                                    headers: Zb
                                },
                                type: pv6
                            }],
                            type: $o
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: Bv6
                        }],
                        type: $o
                    }, {
                        endpoint: {
                            url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}",
                            properties: Zb,
                            headers: Zb
                        },
                        type: pv6
                    }],
                    type: $o
                }],
                type: $o
            }, {
                error: "Invalid Configuration: Missing Region",
                type: Bv6
            }]
        };
    S9q.ruleSet = eR3
})
// @from(Ln 87154, Col 4)
u9q = p((I9q) => {
    Object.defineProperty(I9q, "__esModule", {
        value: !0
    });
    I9q.defaultEndpointResolver = void 0;
    var qS3 = QU(),
        gM1 = dm(),
        KS3 = b9q(),
        _S3 = new gM1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        zS3 = (q, K = {}) => {
            return _S3.get(q, () => (0, gM1.resolveEndpoint)(KS3.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    I9q.defaultEndpointResolver = zS3;
    gM1.customEndpointFunctions.aws = qS3.awsEndpointFunctions
})
// @from(Ln 87175, Col 4)
g9q = p((p9q) => {
    Object.defineProperty(p9q, "__esModule", {
        value: !0
    });
    p9q.getRuntimeConfig = void 0;
    var YS3 = k$(),
        AS3 = Ao(),
        OS3 = FO(),
        wS3 = cc6(),
        $S3 = jb(),
        m9q = W9q(),
        B9q = nw(),
        jS3 = uM1(),
        HS3 = u9q(),
        JS3 = (q) => {
            return {
                apiVersion: "2019-06-10",
                base64Decoder: q?.base64Decoder ?? m9q.fromBase64,
                base64Encoder: q?.base64Encoder ?? m9q.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? HS3.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? jS3.defaultSSOHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new YS3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new OS3.NoAuthSigner
                }],
                logger: q?.logger ?? new wS3.NoOpLogger,
                protocol: q?.protocol ?? new AS3.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.sso"
                }),
                serviceId: q?.serviceId ?? "SSO",
                urlParser: q?.urlParser ?? $S3.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? B9q.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? B9q.toUtf8
            }
        };
    p9q.getRuntimeConfig = JS3
})
// @from(Ln 87219, Col 4)
i9q = p((l9q) => {
    Object.defineProperty(l9q, "__esModule", {
        value: !0
    });
    l9q.getRuntimeConfig = void 0;
    var XS3 = IV(),
        MS3 = XS3.__importDefault(A9q()),
        U9q = k$(),
        Q9q = Ko(),
        mW8 = KM(),
        PS3 = _o(),
        d9q = rZ(),
        EO6 = jE(),
        c9q = wE(),
        WS3 = zo(),
        DS3 = lU(),
        ZS3 = g9q(),
        fS3 = cc6(),
        GS3 = wo(),
        vS3 = cc6(),
        TS3 = (q) => {
            (0, vS3.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, GS3.resolveDefaultsModeConfig)(q),
                _ = () => K().then(fS3.loadConfigsForDefaultMode),
                z = (0, ZS3.getRuntimeConfig)(q);
            (0, U9q.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, EO6.loadConfig)(U9q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? WS3.calculateBodyLength,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, Q9q.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: MS3.default.version
                }),
                maxAttempts: q?.maxAttempts ?? (0, EO6.loadConfig)(d9q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, EO6.loadConfig)(mW8.NODE_REGION_CONFIG_OPTIONS, {
                    ...mW8.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: c9q.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, EO6.loadConfig)({
                    ...d9q.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || DS3.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? PS3.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? c9q.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, EO6.loadConfig)(mW8.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, EO6.loadConfig)(mW8.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, EO6.loadConfig)(Q9q.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    l9q.getRuntimeConfig = TS3
})
// @from(Ln 87279, Col 4)
s9q = p((LS3) => {
    var VS3 = LM1(),
        kS3 = (q) => {
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
        NS3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class r9q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = VS3.FieldPosition.HEADER,
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
    class o9q {
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
    class BW8 {
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
            let K = new BW8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = ES3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return BW8.clone(this)
        }
    }

    function ES3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class a9q {
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

    function yS3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    LS3.Field = r9q;
    LS3.Fields = o9q;
    LS3.HttpRequest = BW8;
    LS3.HttpResponse = a9q;
    LS3.getHttpHandlerExtensionConfiguration = kS3;
    LS3.isValidHostname = yS3;
    LS3.resolveHttpHandlerRuntimeConfig = NS3
})
// @from(Ln 87421, Col 4)
P_q = p((cM1) => {
    var t9q = nr(),
        uS3 = ir(),
        mS3 = rr(),
        e9q = cU(),
        BS3 = KM(),
        ic6 = FO(),
        gv6 = sj(),
        pS3 = qo(),
        rc6 = cm(),
        q_q = rZ(),
        rm = cc6(),
        K_q = uM1(),
        FS3 = i9q(),
        __q = lm(),
        z_q = s9q(),
        gS3 = (q) => {
            return Object.assign(q, {
                useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
                useFipsEndpoint: q.useFipsEndpoint ?? !1,
                defaultSigningName: "awsssoportal"
            })
        },
        pW8 = {
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
        US3 = (q) => {
            let {
                httpAuthSchemes: K,
                httpAuthSchemeProvider: _,
                credentials: z
            } = q;
            return {
                setHttpAuthScheme(Y) {
                    let A = K.findIndex((O) => O.schemeId === Y.schemeId);
                    if (A === -1) K.push(Y);
                    else K.splice(A, 1, Y)
                },
                httpAuthSchemes() {
                    return K
                },
                setHttpAuthSchemeProvider(Y) {
                    _ = Y
                },
                httpAuthSchemeProvider() {
                    return _
                },
                setCredentials(Y) {
                    z = Y
                },
                credentials() {
                    return z
                }
            }
        },
        QS3 = (q) => {
            return {
                httpAuthSchemes: q.httpAuthSchemes(),
                httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
                credentials: q.credentials()
            }
        },
        dS3 = (q, K) => {
            let _ = Object.assign(__q.getAwsRegionExtensionConfiguration(q), rm.getDefaultExtensionConfiguration(q), z_q.getHttpHandlerExtensionConfiguration(q), US3(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, __q.resolveAwsRegionExtensionConfiguration(_), rm.resolveDefaultRuntimeConfig(_), z_q.resolveHttpHandlerRuntimeConfig(_), QS3(_))
        };
    class oc6 extends rm.Client {
        config;
        constructor(...[q]) {
            let K = FS3.getRuntimeConfig(q || {});
            super(K);
            this.initConfig = K;
            let _ = gS3(K),
                z = e9q.resolveUserAgentConfig(_),
                Y = q_q.resolveRetryConfig(z),
                A = BS3.resolveRegionConfig(Y),
                O = t9q.resolveHostHeaderConfig(A),
                w = rc6.resolveEndpointConfig(O),
                $ = K_q.resolveHttpAuthSchemeConfig(w),
                j = dS3($, q?.extensions || []);
            this.config = j, this.middlewareStack.use(gv6.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(e9q.getUserAgentPlugin(this.config)), this.middlewareStack.use(q_q.getRetryPlugin(this.config)), this.middlewareStack.use(pS3.getContentLengthPlugin(this.config)), this.middlewareStack.use(t9q.getHostHeaderPlugin(this.config)), this.middlewareStack.use(uS3.getLoggerPlugin(this.config)), this.middlewareStack.use(mS3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(ic6.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: K_q.defaultSSOHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (H) => new ic6.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": H.credentials
                })
            })), this.middlewareStack.use(ic6.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var Uv6 = class q extends rm.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        Y_q = class q extends Uv6 {
            name = "InvalidRequestException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "InvalidRequestException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        A_q = class q extends Uv6 {
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
        O_q = class q extends Uv6 {
            name = "TooManyRequestsException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "TooManyRequestsException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        w_q = class q extends Uv6 {
            name = "UnauthorizedException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "UnauthorizedException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        cS3 = "AccountInfo",
        lS3 = "AccountListType",
        nS3 = "AccessTokenType",
        iS3 = "GetRoleCredentials",
        rS3 = "GetRoleCredentialsRequest",
        oS3 = "GetRoleCredentialsResponse",
        aS3 = "InvalidRequestException",
        sS3 = "Logout",
        tS3 = "ListAccounts",
        eS3 = "ListAccountsRequest",
        qC3 = "ListAccountRolesRequest",
        KC3 = "ListAccountRolesResponse",
        _C3 = "ListAccountsResponse",
        zC3 = "ListAccountRoles",
        YC3 = "LogoutRequest",
        AC3 = "RoleCredentials",
        OC3 = "RoleInfo",
        wC3 = "RoleListType",
        $C3 = "ResourceNotFoundException",
        jC3 = "SecretAccessKeyType",
        HC3 = "SessionTokenType",
        JC3 = "TooManyRequestsException",
        XC3 = "UnauthorizedException",
        FW8 = "accountId",
        MC3 = "accessKeyId",
        PC3 = "accountList",
        WC3 = "accountName",
        gW8 = "accessToken",
        $_q = "account_id",
        UW8 = "client",
        QW8 = "error",
        DC3 = "emailAddress",
        ZC3 = "expiration",
        dW8 = "http",
        cW8 = "httpError",
        lW8 = "httpHeader",
        yO6 = "httpQuery",
        nW8 = "message",
        j_q = "maxResults",
        H_q = "max_result",
        iW8 = "nextToken",
        J_q = "next_token",
        fC3 = "roleCredentials",
        GC3 = "roleList",
        X_q = "roleName",
        vC3 = "role_name",
        M_q = "smithy.ts.sdk.synthetic.com.amazonaws.sso",
        TC3 = "secretAccessKey",
        VC3 = "sessionToken",
        rW8 = "x-amz-sso_bearer_token",
        S2 = "com.amazonaws.sso",
        oW8 = [0, S2, nS3, 8, 0],
        kC3 = [0, S2, jC3, 8, 0],
        NC3 = [0, S2, HC3, 8, 0],
        EC3 = [3, S2, cS3, 0, [FW8, WC3, DC3],
            [0, 0, 0]
        ],
        yC3 = [3, S2, rS3, 0, [X_q, FW8, gW8],
            [
                [0, {
                    [yO6]: vC3
                }],
                [0, {
                    [yO6]: $_q
                }],
                [() => oW8, {
                    [lW8]: rW8
                }]
            ]
        ],
        LC3 = [3, S2, oS3, 0, [fC3],
            [
                [() => uC3, 0]
            ]
        ],
        hC3 = [-3, S2, aS3, {
                [QW8]: UW8,
                [cW8]: 400
            },
            [nW8],
            [0]
        ];
    gv6.TypeRegistry.for(S2).registerError(hC3, Y_q);
    var RC3 = [3, S2, qC3, 0, [iW8, j_q, gW8, FW8],
            [
                [0, {
                    [yO6]: J_q
                }],
                [1, {
                    [yO6]: H_q
                }],
                [() => oW8, {
                    [lW8]: rW8
                }],
                [0, {
                    [yO6]: $_q
                }]
            ]
        ],
        SC3 = [3, S2, KC3, 0, [iW8, GC3],
            [0, () => QC3]
        ],
        CC3 = [3, S2, eS3, 0, [iW8, j_q, gW8],
            [
                [0, {
                    [yO6]: J_q
                }],
                [1, {
                    [yO6]: H_q
                }],
                [() => oW8, {
                    [lW8]: rW8
                }]
            ]
        ],
        bC3 = [3, S2, _C3, 0, [iW8, PC3],
            [0, () => UC3]
        ],
        IC3 = [3, S2, YC3, 0, [gW8],
            [
                [() => oW8, {
                    [lW8]: rW8
                }]
            ]
        ],
        xC3 = [-3, S2, $C3, {
                [QW8]: UW8,
                [cW8]: 404
            },
            [nW8],
            [0]
        ];
    gv6.TypeRegistry.for(S2).registerError(xC3, A_q);
    var uC3 = [3, S2, AC3, 0, [MC3, TC3, VC3, ZC3],
            [0, [() => kC3, 0],
                [() => NC3, 0], 1
            ]
        ],
        mC3 = [3, S2, OC3, 0, [X_q, FW8],
            [0, 0]
        ],
        BC3 = [-3, S2, JC3, {
                [QW8]: UW8,
                [cW8]: 429
            },
            [nW8],
            [0]
        ];
    gv6.TypeRegistry.for(S2).registerError(BC3, O_q);
    var pC3 = [-3, S2, XC3, {
            [QW8]: UW8,
            [cW8]: 401
        },
        [nW8],
        [0]
    ];
    gv6.TypeRegistry.for(S2).registerError(pC3, w_q);
    var FC3 = "unit",
        gC3 = [-3, M_q, "SSOServiceException", 0, [],
            []
        ];
    gv6.TypeRegistry.for(M_q).registerError(gC3, Uv6);
    var UC3 = [1, S2, lS3, 0, () => EC3],
        QC3 = [1, S2, wC3, 0, () => mC3],
        dC3 = [9, S2, iS3, {
            [dW8]: ["GET", "/federation/credentials", 200]
        }, () => yC3, () => LC3],
        cC3 = [9, S2, zC3, {
            [dW8]: ["GET", "/assignment/roles", 200]
        }, () => RC3, () => SC3],
        lC3 = [9, S2, tS3, {
            [dW8]: ["GET", "/assignment/accounts", 200]
        }, () => CC3, () => bC3],
        nC3 = [9, S2, sS3, {
            [dW8]: ["POST", "/logout", 200]
        }, () => IC3, () => FC3];
    class UM1 extends rm.Command.classBuilder().ep(pW8).m(function(q, K, _, z) {
        return [rc6.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "GetRoleCredentials", {}).n("SSOClient", "GetRoleCredentialsCommand").sc(dC3).build() {}
    class aW8 extends rm.Command.classBuilder().ep(pW8).m(function(q, K, _, z) {
        return [rc6.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccountRoles", {}).n("SSOClient", "ListAccountRolesCommand").sc(cC3).build() {}
    class sW8 extends rm.Command.classBuilder().ep(pW8).m(function(q, K, _, z) {
        return [rc6.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "ListAccounts", {}).n("SSOClient", "ListAccountsCommand").sc(lC3).build() {}
    class QM1 extends rm.Command.classBuilder().ep(pW8).m(function(q, K, _, z) {
        return [rc6.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("SWBPortalService", "Logout", {}).n("SSOClient", "LogoutCommand").sc(nC3).build() {}
    var iC3 = {
        GetRoleCredentialsCommand: UM1,
        ListAccountRolesCommand: aW8,
        ListAccountsCommand: sW8,
        LogoutCommand: QM1
    };
    class dM1 extends oc6 {}
    rm.createAggregatedClient(iC3, dM1);
    var rC3 = ic6.createPaginator(oc6, aW8, "nextToken", "nextToken", "maxResults"),
        oC3 = ic6.createPaginator(oc6, sW8, "nextToken", "nextToken", "maxResults");
    Object.defineProperty(cM1, "$Command", {
        enumerable: !0,
        get: function() {
            return rm.Command
        }
    });
    Object.defineProperty(cM1, "__Client", {
        enumerable: !0,
        get: function() {
            return rm.Client
        }
    });
    cM1.GetRoleCredentialsCommand = UM1;
    cM1.InvalidRequestException = Y_q;
    cM1.ListAccountRolesCommand = aW8;
    cM1.ListAccountsCommand = sW8;
    cM1.LogoutCommand = QM1;
    cM1.ResourceNotFoundException = A_q;
    cM1.SSO = dM1;
    cM1.SSOClient = oc6;
    cM1.SSOServiceException = Uv6;
    cM1.TooManyRequestsException = O_q;
    cM1.UnauthorizedException = w_q;
    cM1.paginateListAccountRoles = rC3;
    cM1.paginateListAccounts = oC3
})
// @from(Ln 87805, Col 4)
D_q = p((lM1) => {
    var W_q = P_q();
    Object.defineProperty(lM1, "GetRoleCredentialsCommand", {
        enumerable: !0,
        get: function() {
            return W_q.GetRoleCredentialsCommand
        }
    });
    Object.defineProperty(lM1, "SSOClient", {
        enumerable: !0,
        get: function() {
            return W_q.SSOClient
        }
    })
})
// @from(Ln 87820, Col 4)
eW8 = p((Jb3) => {
    var om = jP(),
        tW8 = pU(),
        Z_q = $E(),
        jb3 = xW8(),
        G_q = (q) => q && (typeof q.sso_start_url === "string" || typeof q.sso_account_id === "string" || typeof q.sso_session === "string" || typeof q.sso_region === "string" || typeof q.sso_role_name === "string"),
        ac6 = !1,
        f_q = async ({
            ssoStartUrl: q,
            ssoSession: K,
            ssoAccountId: _,
            ssoRegion: z,
            ssoRoleName: Y,
            ssoClient: A,
            clientConfig: O,
            parentClientConfig: w,
            profile: $,
            filepath: j,
            configFilepath: H,
            ignoreCache: J,
            logger: X
        }) => {
            let M, P = "To refresh this SSO session run aws sso login with the corresponding profile.";
            if (K) try {
                let x = await jb3.fromSso({
                    profile: $,
                    filepath: j,
                    configFilepath: H,
                    ignoreCache: J
                })();
                M = {
                    accessToken: x.token,
                    expiresAt: new Date(x.expiration).toISOString()
                }
            } catch (x) {
                throw new om.CredentialsProviderError(x.message, {
                    tryNextLink: ac6,
                    logger: X
                })
            } else try {
                M = await tW8.getSSOTokenFromFile(q)
            } catch (x) {
                throw new om.CredentialsProviderError("The SSO session associated with this profile is invalid. To refresh this SSO session run aws sso login with the corresponding profile.", {
                    tryNextLink: ac6,
                    logger: X
                })
            }
            if (new Date(M.expiresAt).getTime() - Date.now() <= 0) throw new om.CredentialsProviderError("The SSO session associated with this profile has expired. To refresh this SSO session run aws sso login with the corresponding profile.", {
                tryNextLink: ac6,
                logger: X
            });
            let {
                accessToken: W
            } = M, {
                SSOClient: D,
                GetRoleCredentialsCommand: Z
            } = await Promise.resolve().then(function() {
                return D_q()
            }), G = A || new D(Object.assign({}, O ?? {}, {
                logger: O?.logger ?? w?.logger,
                region: O?.region ?? z,
                userAgentAppId: O?.userAgentAppId ?? w?.userAgentAppId
            })), f;
            try {
                f = await G.send(new Z({
                    accountId: _,
                    roleName: Y,
                    accessToken: W
                }))
            } catch (x) {
                throw new om.CredentialsProviderError(x, {
                    tryNextLink: ac6,
                    logger: X
                })
            }
            let {
                roleCredentials: {
                    accessKeyId: v,
                    secretAccessKey: V,
                    sessionToken: k,
                    expiration: N,
                    credentialScope: R,
                    accountId: h
                } = {}
            } = f;
            if (!v || !V || !k || !N) throw new om.CredentialsProviderError("SSO returns an invalid temporary credential.", {
                tryNextLink: ac6,
                logger: X
            });
            let C = {
                accessKeyId: v,
                secretAccessKey: V,
                sessionToken: k,
                expiration: new Date(N),
                ...R && {
                    credentialScope: R
                },
                ...h && {
                    accountId: h
                }
            };
            if (K) Z_q.setCredentialFeature(C, "CREDENTIALS_SSO", "s");
            else Z_q.setCredentialFeature(C, "CREDENTIALS_SSO_LEGACY", "u");
            return C
        }, v_q = (q, K) => {
            let {
                sso_start_url: _,
                sso_account_id: z,
                sso_region: Y,
                sso_role_name: A
            } = q;
            if (!_ || !z || !Y || !A) throw new om.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(q).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, {
                tryNextLink: !1,
                logger: K
            });
            return q
        }, Hb3 = (q = {}) => async ({
            callerClientConfig: K
        } = {}) => {
            q.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
            let {
                ssoStartUrl: _,
                ssoAccountId: z,
                ssoRegion: Y,
                ssoRoleName: A,
                ssoSession: O
            } = q, {
                ssoClient: w
            } = q, $ = tW8.getProfileName({
                profile: q.profile ?? K?.profile
            });
            if (!_ && !z && !Y && !A && !O) {
                let H = (await tW8.parseKnownFiles(q))[$];
                if (!H) throw new om.CredentialsProviderError(`Profile ${$} was not found.`, {
                    logger: q.logger
                });
                if (!G_q(H)) throw new om.CredentialsProviderError(`Profile ${$} is not configured with SSO credentials.`, {
                    logger: q.logger
                });
                if (H?.sso_session) {
                    let Z = (await tW8.loadSsoSessionData(q))[H.sso_session],
                        G = ` configurations in profile ${$} and sso-session ${H.sso_session}`;
                    if (Y && Y !== Z.sso_region) throw new om.CredentialsProviderError("Conflicting SSO region" + G, {
                        tryNextLink: !1,
                        logger: q.logger
                    });
                    if (_ && _ !== Z.sso_start_url) throw new om.CredentialsProviderError("Conflicting SSO start_url" + G, {
                        tryNextLink: !1,
                        logger: q.logger
                    });
                    H.sso_region = Z.sso_region, H.sso_start_url = Z.sso_start_url
                }
                let {
                    sso_start_url: J,
                    sso_account_id: X,
                    sso_region: M,
                    sso_role_name: P,
                    sso_session: W
                } = v_q(H, q.logger);
                return f_q({
                    ssoStartUrl: J,
                    ssoSession: W,
                    ssoAccountId: X,
                    ssoRegion: M,
                    ssoRoleName: P,
                    ssoClient: w,
                    clientConfig: q.clientConfig,
                    parentClientConfig: q.parentClientConfig,
                    profile: $,
                    filepath: q.filepath,
                    configFilepath: q.configFilepath,
                    ignoreCache: q.ignoreCache,
                    logger: q.logger
                })
            } else if (!_ || !z || !Y || !A) throw new om.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', {
                tryNextLink: !1,
                logger: q.logger
            });
            else return f_q({
                ssoStartUrl: _,
                ssoSession: O,
                ssoAccountId: z,
                ssoRegion: Y,
                ssoRoleName: A,
                ssoClient: w,
                clientConfig: q.clientConfig,
                parentClientConfig: q.parentClientConfig,
                profile: $,
                filepath: q.filepath,
                configFilepath: q.configFilepath,
                ignoreCache: q.ignoreCache,
                logger: q.logger
            })
        };
    Jb3.fromSSO = Hb3;
    Jb3.isSsoProfile = G_q;
    Jb3.validateSsoProfile = v_q
})
// @from(Ln 88019, Col 4)
T_q = p((vb3) => {
    vb3.HttpAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(vb3.HttpAuthLocation || (vb3.HttpAuthLocation = {}));
    vb3.HttpApiKeyAuthLocation = void 0;
    (function(q) {
        q.HEADER = "header", q.QUERY = "query"
    })(vb3.HttpApiKeyAuthLocation || (vb3.HttpApiKeyAuthLocation = {}));
    vb3.EndpointURLScheme = void 0;
    (function(q) {
        q.HTTP = "http", q.HTTPS = "https"
    })(vb3.EndpointURLScheme || (vb3.EndpointURLScheme = {}));
    vb3.AlgorithmId = void 0;
    (function(q) {
        q.MD5 = "md5", q.CRC32 = "crc32", q.CRC32C = "crc32c", q.SHA1 = "sha1", q.SHA256 = "sha256"
    })(vb3.AlgorithmId || (vb3.AlgorithmId = {}));
    var Wb3 = (q) => {
            let K = [];
            if (q.sha256 !== void 0) K.push({
                algorithmId: () => vb3.AlgorithmId.SHA256,
                checksumConstructor: () => q.sha256
            });
            if (q.md5 != null) K.push({
                algorithmId: () => vb3.AlgorithmId.MD5,
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
        Db3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        Zb3 = (q) => {
            return Wb3(q)
        },
        fb3 = (q) => {
            return Db3(q)
        };
    vb3.FieldPosition = void 0;
    (function(q) {
        q[q.HEADER = 0] = "HEADER", q[q.TRAILER = 1] = "TRAILER"
    })(vb3.FieldPosition || (vb3.FieldPosition = {}));
    var Gb3 = "__smithy_context";
    vb3.IniSectionType = void 0;
    (function(q) {
        q.PROFILE = "profile", q.SSO_SESSION = "sso-session", q.SERVICES = "services"
    })(vb3.IniSectionType || (vb3.IniSectionType = {}));
    vb3.RequestHandlerProtocol = void 0;
    (function(q) {
        q.HTTP_0_9 = "http/0.9", q.HTTP_1_0 = "http/1.0", q.TDS_8_0 = "tds/8.0"
    })(vb3.RequestHandlerProtocol || (vb3.RequestHandlerProtocol = {}));
    vb3.SMITHY_CONTEXT_KEY = Gb3;
    vb3.getDefaultClientConfiguration = Zb3;
    vb3.resolveDefaultRuntimeConfig = fb3
})
// @from(Ln 88084, Col 4)
E_q = p((Rb3) => {
    var Nb3 = T_q(),
        Eb3 = (q) => {
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
        yb3 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class V_q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = Nb3.FieldPosition.HEADER,
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
    class k_q {
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
    class q08 {
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
            let K = new q08({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = Lb3(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return q08.clone(this)
        }
    }

    function Lb3(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class N_q {
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

    function hb3(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    Rb3.Field = V_q;
    Rb3.Fields = k_q;
    Rb3.HttpRequest = q08;
    Rb3.HttpResponse = N_q;
    Rb3.getHttpHandlerExtensionConfiguration = Eb3;
    Rb3.isValidHostname = hb3;
    Rb3.resolveHttpHandlerRuntimeConfig = yb3
})
// @from(Ln 88226, Col 4)
eM1 = p((y_q) => {
    Object.defineProperty(y_q, "__esModule", {
        value: !0
    });
    y_q.resolveHttpAuthSchemeConfig = y_q.defaultSigninHttpAuthSchemeProvider = y_q.defaultSigninHttpAuthSchemeParametersProvider = void 0;
    var Bb3 = k$(),
        tM1 = Dv(),
        pb3 = async (q, K, _) => {
            return {
                operation: (0, tM1.getSmithyContext)(K).operation,
                region: await (0, tM1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    y_q.defaultSigninHttpAuthSchemeParametersProvider = pb3;

    function Fb3(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "signin",
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

    function gb3(q) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var Ub3 = (q) => {
        let K = [];
        switch (q.operation) {
            case "CreateOAuth2Token": {
                K.push(gb3(q));
                break
            }
            default:
                K.push(Fb3(q))
        }
        return K
    };
    y_q.defaultSigninHttpAuthSchemeProvider = Ub3;
    var Qb3 = (q) => {
        let K = (0, Bb3.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, tM1.normalizeProvider)(q.authSchemePreference ?? [])
        })
    };
    y_q.resolveHttpAuthSchemeConfig = Qb3
})
// @from(Ln 88285, Col 4)
F_q = p((B_q) => {
    Object.defineProperty(B_q, "__esModule", {
        value: !0
    });
    B_q.ruleSet = void 0;
    var m_q = "required",
        Gv = "fn",
        vv = "argv",
        jo = "ref",
        h_q = !0,
        R_q = "isSet",
        LO6 = "booleanEquals",
        Qv6 = "error",
        N76 = "endpoint",
        am = "tree",
        z08 = "PartitionResult",
        qP1 = "stringEquals",
        S_q = {
            [m_q]: !0,
            default: !1,
            type: "boolean"
        },
        C_q = {
            [m_q]: !1,
            type: "string"
        },
        b_q = {
            [jo]: "Endpoint"
        },
        KP1 = {
            [Gv]: LO6,
            [vv]: [{
                [jo]: "UseFIPS"
            }, !0]
        },
        _P1 = {
            [Gv]: LO6,
            [vv]: [{
                [jo]: "UseDualStack"
            }, !0]
        },
        fv = {},
        zP1 = {
            [Gv]: "getAttr",
            [vv]: [{
                [jo]: z08
            }, "name"]
        },
        K08 = {
            [Gv]: LO6,
            [vv]: [{
                [jo]: "UseFIPS"
            }, !1]
        },
        _08 = {
            [Gv]: LO6,
            [vv]: [{
                [jo]: "UseDualStack"
            }, !1]
        },
        I_q = {
            [Gv]: "getAttr",
            [vv]: [{
                [jo]: z08
            }, "supportsFIPS"]
        },
        x_q = {
            [Gv]: LO6,
            [vv]: [!0, {
                [Gv]: "getAttr",
                [vv]: [{
                    [jo]: z08
                }, "supportsDualStack"]
            }]
        },
        u_q = [{
            [jo]: "Region"
        }],
        lb3 = {
            version: "1.0",
            parameters: {
                UseDualStack: S_q,
                UseFIPS: S_q,
                Endpoint: C_q,
                Region: C_q
            },
            rules: [{
                conditions: [{
                    [Gv]: R_q,
                    [vv]: [b_q]
                }],
                rules: [{
                    conditions: [KP1],
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: Qv6
                }, {
                    rules: [{
                        conditions: [_P1],
                        error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                        type: Qv6
                    }, {
                        endpoint: {
                            url: b_q,
                            properties: fv,
                            headers: fv
                        },
                        type: N76
                    }],
                    type: am
                }],
                type: am
            }, {
                rules: [{
                    conditions: [{
                        [Gv]: R_q,
                        [vv]: u_q
                    }],
                    rules: [{
                        conditions: [{
                            [Gv]: "aws.partition",
                            [vv]: u_q,
                            assign: z08
                        }],
                        rules: [{
                            conditions: [{
                                [Gv]: qP1,
                                [vv]: [zP1, "aws"]
                            }, K08, _08],
                            endpoint: {
                                url: "https://{Region}.signin.aws.amazon.com",
                                properties: fv,
                                headers: fv
                            },
                            type: N76
                        }, {
                            conditions: [{
                                [Gv]: qP1,
                                [vv]: [zP1, "aws-cn"]
                            }, K08, _08],
                            endpoint: {
                                url: "https://{Region}.signin.amazonaws.cn",
                                properties: fv,
                                headers: fv
                            },
                            type: N76
                        }, {
                            conditions: [{
                                [Gv]: qP1,
                                [vv]: [zP1, "aws-us-gov"]
                            }, K08, _08],
                            endpoint: {
                                url: "https://{Region}.signin.amazonaws-us-gov.com",
                                properties: fv,
                                headers: fv
                            },
                            type: N76
                        }, {
                            conditions: [KP1, _P1],
                            rules: [{
                                conditions: [{
                                    [Gv]: LO6,
                                    [vv]: [h_q, I_q]
                                }, x_q],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                        properties: fv,
                                        headers: fv
                                    },
                                    type: N76
                                }],
                                type: am
                            }, {
                                error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                                type: Qv6
                            }],
                            type: am
                        }, {
                            conditions: [KP1, _08],
                            rules: [{
                                conditions: [{
                                    [Gv]: LO6,
                                    [vv]: [I_q, h_q]
                                }],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin-fips.{Region}.{PartitionResult#dnsSuffix}",
                                        properties: fv,
                                        headers: fv
                                    },
                                    type: N76
                                }],
                                type: am
                            }, {
                                error: "FIPS is enabled but this partition does not support FIPS",
                                type: Qv6
                            }],
                            type: am
                        }, {
                            conditions: [K08, _P1],
                            rules: [{
                                conditions: [x_q],
                                rules: [{
                                    endpoint: {
                                        url: "https://signin.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                        properties: fv,
                                        headers: fv
                                    },
                                    type: N76
                                }],
                                type: am
                            }, {
                                error: "DualStack is enabled but this partition does not support DualStack",
                                type: Qv6
                            }],
                            type: am
                        }, {
                            endpoint: {
                                url: "https://signin.{Region}.{PartitionResult#dnsSuffix}",
                                properties: fv,
                                headers: fv
                            },
                            type: N76
                        }],
                        type: am
                    }],
                    type: am
                }, {
                    error: "Invalid Configuration: Missing Region",
                    type: Qv6
                }],
                type: am
            }]
        };
    B_q.ruleSet = lb3
})
// @from(Ln 88521, Col 4)
Q_q = p((g_q) => {
    Object.defineProperty(g_q, "__esModule", {
        value: !0
    });
    g_q.defaultEndpointResolver = void 0;
    var nb3 = QU(),
        YP1 = dm(),
        ib3 = F_q(),
        rb3 = new YP1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        ob3 = (q, K = {}) => {
            return rb3.get(q, () => (0, YP1.resolveEndpoint)(ib3.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    g_q.defaultEndpointResolver = ob3;
    YP1.customEndpointFunctions.aws = nb3.awsEndpointFunctions
})
// @from(Ln 88542, Col 4)
i_q = p((l_q) => {
    Object.defineProperty(l_q, "__esModule", {
        value: !0
    });
    l_q.getRuntimeConfig = void 0;
    var ab3 = k$(),
        sb3 = Ao(),
        tb3 = FO(),
        eb3 = uV(),
        qI3 = jb(),
        d_q = SW8(),
        c_q = nw(),
        KI3 = eM1(),
        _I3 = Q_q(),
        zI3 = (q) => {
            return {
                apiVersion: "2023-01-01",
                base64Decoder: q?.base64Decoder ?? d_q.fromBase64,
                base64Encoder: q?.base64Encoder ?? d_q.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? _I3.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? KI3.defaultSigninHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new ab3.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new tb3.NoAuthSigner
                }],
                logger: q?.logger ?? new eb3.NoOpLogger,
                protocol: q?.protocol ?? new sb3.AwsRestJsonProtocol({
                    defaultNamespace: "com.amazonaws.signin"
                }),
                serviceId: q?.serviceId ?? "Signin",
                urlParser: q?.urlParser ?? qI3.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? c_q.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? c_q.toUtf8
            }
        };
    l_q.getRuntimeConfig = zI3
})
// @from(Ln 88586, Col 4)
qzq = p((t_q) => {
    Object.defineProperty(t_q, "__esModule", {
        value: !0
    });
    t_q.getRuntimeConfig = void 0;
    var YI3 = IV(),
        AI3 = YI3.__importDefault(yW8()),
        r_q = k$(),
        o_q = Ko(),
        Y08 = KM(),
        OI3 = _o(),
        a_q = rZ(),
        hO6 = jE(),
        s_q = wE(),
        wI3 = zo(),
        $I3 = lU(),
        jI3 = i_q(),
        HI3 = uV(),
        JI3 = wo(),
        XI3 = uV(),
        MI3 = (q) => {
            (0, XI3.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, JI3.resolveDefaultsModeConfig)(q),
                _ = () => K().then(HI3.loadConfigsForDefaultMode),
                z = (0, jI3.getRuntimeConfig)(q);
            (0, r_q.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, hO6.loadConfig)(r_q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? wI3.calculateBodyLength,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, o_q.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: AI3.default.version
                }),
                maxAttempts: q?.maxAttempts ?? (0, hO6.loadConfig)(a_q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, hO6.loadConfig)(Y08.NODE_REGION_CONFIG_OPTIONS, {
                    ...Y08.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: s_q.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, hO6.loadConfig)({
                    ...a_q.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || $I3.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? OI3.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? s_q.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, hO6.loadConfig)(Y08.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, hO6.loadConfig)(Y08.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, hO6.loadConfig)(o_q.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    t_q.getRuntimeConfig = MI3
})
// @from(Ln 88646, Col 4)
Ezq = p((JP1) => {
    var Kzq = nr(),
        PI3 = ir(),
        WI3 = rr(),
        _zq = cU(),
        DI3 = KM(),
        AP1 = FO(),
        dv6 = sj(),
        ZI3 = qo(),
        fzq = cm(),
        zzq = rZ(),
        E76 = uV(),
        Yzq = eM1(),
        fI3 = qzq(),
        Azq = lm(),
        Ozq = IW8(),
        GI3 = (q) => {
            return Object.assign(q, {
                useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
                useFipsEndpoint: q.useFipsEndpoint ?? !1,
                defaultSigningName: "signin"
            })
        },
        vI3 = {
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
        TI3 = (q) => {
            let {
                httpAuthSchemes: K,
                httpAuthSchemeProvider: _,
                credentials: z
            } = q;
            return {
                setHttpAuthScheme(Y) {
                    let A = K.findIndex((O) => O.schemeId === Y.schemeId);
                    if (A === -1) K.push(Y);
                    else K.splice(A, 1, Y)
                },
                httpAuthSchemes() {
                    return K
                },
                setHttpAuthSchemeProvider(Y) {
                    _ = Y
                },
                httpAuthSchemeProvider() {
                    return _
                },
                setCredentials(Y) {
                    z = Y
                },
                credentials() {
                    return z
                }
            }
        },
        VI3 = (q) => {
            return {
                httpAuthSchemes: q.httpAuthSchemes(),
                httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
                credentials: q.credentials()
            }
        },
        kI3 = (q, K) => {
            let _ = Object.assign(Azq.getAwsRegionExtensionConfiguration(q), E76.getDefaultExtensionConfiguration(q), Ozq.getHttpHandlerExtensionConfiguration(q), TI3(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, Azq.resolveAwsRegionExtensionConfiguration(_), E76.resolveDefaultRuntimeConfig(_), Ozq.resolveHttpHandlerRuntimeConfig(_), VI3(_))
        };
    class OP1 extends E76.Client {
        config;
        constructor(...[q]) {
            let K = fI3.getRuntimeConfig(q || {});
            super(K);
            this.initConfig = K;
            let _ = GI3(K),
                z = _zq.resolveUserAgentConfig(_),
                Y = zzq.resolveRetryConfig(z),
                A = DI3.resolveRegionConfig(Y),
                O = Kzq.resolveHostHeaderConfig(A),
                w = fzq.resolveEndpointConfig(O),
                $ = Yzq.resolveHttpAuthSchemeConfig(w),
                j = kI3($, q?.extensions || []);
            this.config = j, this.middlewareStack.use(dv6.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(_zq.getUserAgentPlugin(this.config)), this.middlewareStack.use(zzq.getRetryPlugin(this.config)), this.middlewareStack.use(ZI3.getContentLengthPlugin(this.config)), this.middlewareStack.use(Kzq.getHostHeaderPlugin(this.config)), this.middlewareStack.use(PI3.getLoggerPlugin(this.config)), this.middlewareStack.use(WI3.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(AP1.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: Yzq.defaultSigninHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (H) => new AP1.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": H.credentials
                })
            })), this.middlewareStack.use(AP1.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var cv6 = class q extends E76.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        Gzq = class q extends cv6 {
            name = "AccessDeniedException";
            $fault = "client";
            error;
            constructor(K) {
                super({
                    name: "AccessDeniedException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error
            }
        },
        vzq = class q extends cv6 {
            name = "InternalServerException";
            $fault = "server";
            error;
            constructor(K) {
                super({
                    name: "InternalServerException",
                    $fault: "server",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error
            }
        },
        Tzq = class q extends cv6 {
            name = "TooManyRequestsError";
            $fault = "client";
            error;
            constructor(K) {
                super({
                    name: "TooManyRequestsError",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error
            }
        },
        Vzq = class q extends cv6 {
            name = "ValidationException";
            $fault = "client";
            error;
            constructor(K) {
                super({
                    name: "ValidationException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype), this.error = K.error
            }
        },
        NI3 = "AccessDeniedException",
        EI3 = "AccessToken",
        yI3 = "CreateOAuth2Token",
        LI3 = "CreateOAuth2TokenRequest",
        hI3 = "CreateOAuth2TokenRequestBody",
        RI3 = "CreateOAuth2TokenResponseBody",
        SI3 = "CreateOAuth2TokenResponse",
        CI3 = "InternalServerException",
        bI3 = "RefreshToken",
        II3 = "TooManyRequestsError",
        xI3 = "ValidationException",
        wzq = "accessKeyId",
        $zq = "accessToken",
        wP1 = "client",
        jzq = "clientId",
        Hzq = "codeVerifier",
        uI3 = "code",
        y76 = "error",
        Jzq = "expiresIn",
        Xzq = "grantType",
        mI3 = "http",
        $P1 = "httpError",
        Mzq = "idToken",
        uh = "jsonName",
        O08 = "message",
        A08 = "refreshToken",
        Pzq = "redirectUri",
        BI3 = "server",
        Wzq = "secretAccessKey",
        Dzq = "sessionToken",
        kzq = "smithy.ts.sdk.synthetic.com.amazonaws.signin",
        pI3 = "tokenInput",
        FI3 = "tokenOutput",
        Zzq = "tokenType",
        mV = "com.amazonaws.signin",
        Nzq = [0, mV, bI3, 8, 0],
        gI3 = [-3, mV, NI3, {
                [y76]: wP1
            },
            [y76, O08],
            [0, 0]
        ];
    dv6.TypeRegistry.for(mV).registerError(gI3, Gzq);
    var UI3 = [3, mV, EI3, 8, [wzq, Wzq, Dzq],
            [
                [0, {
                    [uh]: wzq
                }],
                [0, {
                    [uh]: Wzq
                }],
                [0, {
                    [uh]: Dzq
                }]
            ]
        ],
        QI3 = [3, mV, LI3, 0, [pI3],
            [
                [() => dI3, 16]
            ]
        ],
        dI3 = [3, mV, hI3, 0, [jzq, Xzq, uI3, Pzq, Hzq, A08],
            [
                [0, {
                    [uh]: jzq
                }],
                [0, {
                    [uh]: Xzq
                }], 0, [0, {
                    [uh]: Pzq
                }],
                [0, {
                    [uh]: Hzq
                }],
                [() => Nzq, {
                    [uh]: A08
                }]
            ]
        ],
        cI3 = [3, mV, SI3, 0, [FI3],
            [
                [() => lI3, 16]
            ]
        ],
        lI3 = [3, mV, RI3, 0, [$zq, Zzq, Jzq, A08, Mzq],
            [
                [() => UI3, {
                    [uh]: $zq
                }],
                [0, {
                    [uh]: Zzq
                }],
                [1, {
                    [uh]: Jzq
                }],
                [() => Nzq, {
                    [uh]: A08
                }],
                [0, {
                    [uh]: Mzq
                }]
            ]
        ],
        nI3 = [-3, mV, CI3, {
                [y76]: BI3,
                [$P1]: 500
            },
            [y76, O08],
            [0, 0]
        ];
    dv6.TypeRegistry.for(mV).registerError(nI3, vzq);
    var iI3 = [-3, mV, II3, {
            [y76]: wP1,
            [$P1]: 429
        },
        [y76, O08],
        [0, 0]
    ];
    dv6.TypeRegistry.for(mV).registerError(iI3, Tzq);
    var rI3 = [-3, mV, xI3, {
            [y76]: wP1,
            [$P1]: 400
        },
        [y76, O08],
        [0, 0]
    ];
    dv6.TypeRegistry.for(mV).registerError(rI3, Vzq);
    var oI3 = [-3, kzq, "SigninServiceException", 0, [],
        []
    ];
    dv6.TypeRegistry.for(kzq).registerError(oI3, cv6);
    var aI3 = [9, mV, yI3, {
        [mI3]: ["POST", "/v1/token", 200]
    }, () => QI3, () => cI3];
    class jP1 extends E76.Command.classBuilder().ep(vI3).m(function(q, K, _, z) {
        return [fzq.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("Signin", "CreateOAuth2Token", {}).n("SigninClient", "CreateOAuth2TokenCommand").sc(aI3).build() {}
    var sI3 = {
        CreateOAuth2TokenCommand: jP1
    };
    class HP1 extends OP1 {}
    E76.createAggregatedClient(sI3, HP1);
    var tI3 = {
        AUTHCODE_EXPIRED: "AUTHCODE_EXPIRED",
        INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
        INVALID_REQUEST: "INVALID_REQUEST",
        SERVER_ERROR: "server_error",
        TOKEN_EXPIRED: "TOKEN_EXPIRED",
        USER_CREDENTIALS_CHANGED: "USER_CREDENTIALS_CHANGED"
    };
    Object.defineProperty(JP1, "$Command", {
        enumerable: !0,
        get: function() {
            return E76.Command
        }
    });
    Object.defineProperty(JP1, "__Client", {
        enumerable: !0,
        get: function() {
            return E76.Client
        }
    });
    JP1.AccessDeniedException = Gzq;
    JP1.CreateOAuth2TokenCommand = jP1;
    JP1.InternalServerException = vzq;
    JP1.OAuth2ErrorCode = tI3;
    JP1.Signin = HP1;
    JP1.SigninClient = OP1;
    JP1.SigninServiceException = cv6;
    JP1.TooManyRequestsError = Tzq;
    JP1.ValidationException = Vzq
})