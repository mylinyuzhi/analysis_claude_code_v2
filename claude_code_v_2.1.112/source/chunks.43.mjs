
// @from(Ln 105861, Col 4)
qn6 = p((VT6) => {
    var uWq = gU(),
        tG1 = XE(),
        oG1 = iG1(),
        IC9 = sj(),
        IWq = JE();
    class mWq {
        config;
        middlewareStack = uWq.constructStack();
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
    var rG1 = "***SensitiveInformation***";

    function aG1(q, K) {
        if (K == null) return K;
        let _ = IC9.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return rG1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return rG1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return rG1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = aG1(O, z[A]);
            return Y
        }
        return K
    }
    class eG1 {
        middlewareStack = uWq.constructStack();
        schema;
        static classBuilder() {
            return new BWq
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
                    [oG1.SMITHY_CONTEXT_KEY]: {
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
    class BWq {
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
            return K = class extends eG1 {
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
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? aG1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? aG1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var xC9 = "***SensitiveInformation***",
        uC9 = (q, K) => {
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
    class TT6 extends Error {
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
            return TT6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === TT6) return TT6.isInstance(q);
            if (TT6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var pWq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        FWq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = BC9(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw pWq(O, K)
        },
        mC9 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                FWq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        BC9 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        pC9 = (q) => {
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
        xWq = !1,
        FC9 = (q) => {
            if (q && !xWq && parseInt(q.substring(1, q.indexOf("."))) < 16) xWq = !0
        },
        gC9 = (q) => {
            let K = [];
            for (let _ in oG1.AlgorithmId) {
                let z = oG1.AlgorithmId[_];
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
        UC9 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        QC9 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        dC9 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        gWq = (q) => {
            return Object.assign(gC9(q), QC9(q))
        },
        cC9 = gWq,
        lC9 = (q) => {
            return Object.assign(UC9(q), dC9(q))
        },
        nC9 = (q) => Array.isArray(q) ? q : [q],
        UWq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = UWq(q[_]);
            return q
        },
        iC9 = (q) => {
            return q != null
        };
    class QWq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function dWq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, aC9(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            cWq(z, null, A, O)
        }
        return z
    }
    var rC9 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        oC9 = (q, K) => {
            let _ = {};
            for (let z in K) cWq(_, q, K, z);
            return _
        },
        aC9 = (q, K, _) => {
            return dWq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        cWq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = sC9, $ = tC9, j = z] = O;
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
        sC9 = (q) => q != null,
        tC9 = (q) => q,
        eC9 = (q) => {
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
        qb9 = (q) => q.toISOString().replace(".000Z", "Z"),
        sG1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(sG1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = sG1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(VT6, "collectBody", {
        enumerable: !0,
        get: function() {
            return tG1.collectBody
        }
    });
    Object.defineProperty(VT6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return tG1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(VT6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return tG1.resolvedPath
        }
    });
    VT6.Client = mWq;
    VT6.Command = eG1;
    VT6.NoOpLogger = QWq;
    VT6.SENSITIVE_STRING = xC9;
    VT6.ServiceException = TT6;
    VT6._json = sG1;
    VT6.convertMap = rC9;
    VT6.createAggregatedClient = uC9;
    VT6.decorateServiceException = pWq;
    VT6.emitWarningIfUnsupportedVersion = FC9;
    VT6.getArrayIfSingleItem = nC9;
    VT6.getDefaultClientConfiguration = cC9;
    VT6.getDefaultExtensionConfiguration = gWq;
    VT6.getValueFromTextNode = UWq;
    VT6.isSerializableHeaderValue = iC9;
    VT6.loadConfigsForDefaultMode = pC9;
    VT6.map = dWq;
    VT6.resolveDefaultRuntimeConfig = lC9;
    VT6.serializeDateTime = qb9;
    VT6.serializeFloat = eC9;
    VT6.take = oC9;
    VT6.throwDefaultError = FWq;
    VT6.withBaseException = mC9;
    Object.keys(IWq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(VT6, q)) Object.defineProperty(VT6, q, {
            enumerable: !0,
            get: function() {
                return IWq[q]
            }
        })
    })
})
// @from(Ln 106331, Col 4)
Kv1 = p((lWq) => {
    Object.defineProperty(lWq, "__esModule", {
        value: !0
    });
    lWq.resolveHttpAuthSchemeConfig = lWq.defaultCognitoIdentityHttpAuthSchemeProvider = lWq.defaultCognitoIdentityHttpAuthSchemeParametersProvider = void 0;
    var Nb9 = k$(),
        qv1 = Dv(),
        Eb9 = async (q, K, _) => {
            return {
                operation: (0, qv1.getSmithyContext)(K).operation,
                region: await (0, qv1.normalizeProvider)(q.region)() || (() => {
                    throw Error("expected `region` to be configured for `aws.auth#sigv4`")
                })()
            }
        };
    lWq.defaultCognitoIdentityHttpAuthSchemeParametersProvider = Eb9;

    function yb9(q) {
        return {
            schemeId: "aws.auth#sigv4",
            signingProperties: {
                name: "cognito-identity",
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

    function vZ8(q) {
        return {
            schemeId: "smithy.api#noAuth"
        }
    }
    var Lb9 = (q) => {
        let K = [];
        switch (q.operation) {
            case "GetCredentialsForIdentity": {
                K.push(vZ8(q));
                break
            }
            case "GetId": {
                K.push(vZ8(q));
                break
            }
            case "GetOpenIdToken": {
                K.push(vZ8(q));
                break
            }
            case "UnlinkIdentity": {
                K.push(vZ8(q));
                break
            }
            default:
                K.push(yb9(q))
        }
        return K
    };
    lWq.defaultCognitoIdentityHttpAuthSchemeProvider = Lb9;
    var hb9 = (q) => {
        let K = (0, Nb9.resolveAwsSdkSigV4Config)(q);
        return Object.assign(K, {
            authSchemePreference: (0, qv1.normalizeProvider)(q.authSchemePreference ?? [])
        })
    };
    lWq.resolveHttpAuthSchemeConfig = hb9
})
// @from(Ln 106402, Col 4)
iWq = p((AjO, Cb9) => {
    Cb9.exports = {
        name: "@aws-sdk/client-cognito-identity",
        description: "AWS SDK for JavaScript Cognito Identity Client for Node.js, Browser and React Native",
        version: "3.936.0",
        scripts: {
            build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
            "build:cjs": "node ../../scripts/compilation/inline client-cognito-identity",
            "build:es": "tsc -p tsconfig.es.json",
            "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
            "build:types": "tsc -p tsconfig.types.json",
            "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
            clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
            "extract:docs": "api-extractor run --local",
            "generate:client": "node ../../scripts/generate-clients/single-service --solo cognito-identity",
            "test:e2e": "yarn g:vitest run -c vitest.config.e2e.mts --mode development",
            "test:e2e:watch": "yarn g:vitest watch -c vitest.config.e2e.mts"
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
            "@aws-sdk/client-iam": "3.936.0",
            "@tsconfig/node18": "18.2.4",
            "@types/chai": "^4.2.11",
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
        homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-cognito-identity",
        repository: {
            type: "git",
            url: "https://github.com/aws/aws-sdk-js-v3.git",
            directory: "clients/client-cognito-identity"
        }
    }
})
// @from(Ln 106503, Col 4)
rWq = p((Ib9) => {
    var bb9 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    Ib9.isArrayBuffer = bb9
})
// @from(Ln 106507, Col 4)
zv1 = p((pb9) => {
    var ub9 = rWq(),
        _v1 = d6("buffer"),
        mb9 = (q, K = 0, _ = q.byteLength - K) => {
            if (!ub9.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return _v1.Buffer.from(q, K, _)
        },
        Bb9 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? _v1.Buffer.from(q, K) : _v1.Buffer.from(q)
        };
    pb9.fromArrayBuffer = mb9;
    pb9.fromString = Bb9
})
// @from(Ln 106521, Col 4)
sWq = p((oWq) => {
    Object.defineProperty(oWq, "__esModule", {
        value: !0
    });
    oWq.fromBase64 = void 0;
    var Ub9 = zv1(),
        Qb9 = /^[A-Za-z0-9+/]*={0,2}$/,
        db9 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!Qb9.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, Ub9.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    oWq.fromBase64 = db9
})
// @from(Ln 106536, Col 4)
q0q = p((tWq) => {
    Object.defineProperty(tWq, "__esModule", {
        value: !0
    });
    tWq.toBase64 = void 0;
    var cb9 = zv1(),
        lb9 = nw(),
        nb9 = (q) => {
            let K;
            if (typeof q === "string") K = (0, lb9.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, cb9.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    tWq.toBase64 = nb9
})
// @from(Ln 106552, Col 4)
z0q = p((Kn6) => {
    var K0q = sWq(),
        _0q = q0q();
    Object.keys(K0q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Kn6, q)) Object.defineProperty(Kn6, q, {
            enumerable: !0,
            get: function() {
                return K0q[q]
            }
        })
    });
    Object.keys(_0q).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Kn6, q)) Object.defineProperty(Kn6, q, {
            enumerable: !0,
            get: function() {
                return _0q[q]
            }
        })
    })
})
// @from(Ln 106572, Col 4)
v0q = p((f0q) => {
    Object.defineProperty(f0q, "__esModule", {
        value: !0
    });
    f0q.ruleSet = void 0;
    var P0q = "required",
        Ev = "fn",
        yv = "argv",
        NT6 = "ref",
        Y0q = !0,
        A0q = "isSet",
        Yn6 = "booleanEquals",
        kT6 = "error",
        PQ = "endpoint",
        Do = "tree",
        Yv1 = "PartitionResult",
        Av1 = "getAttr",
        _n6 = "stringEquals",
        O0q = {
            [P0q]: !1,
            type: "string"
        },
        w0q = {
            [P0q]: !0,
            default: !1,
            type: "boolean"
        },
        $0q = {
            [NT6]: "Endpoint"
        },
        W0q = {
            [Ev]: Yn6,
            [yv]: [{
                [NT6]: "UseFIPS"
            }, !0]
        },
        D0q = {
            [Ev]: Yn6,
            [yv]: [{
                [NT6]: "UseDualStack"
            }, !0]
        },
        WP = {},
        zn6 = {
            [NT6]: "Region"
        },
        j0q = {
            [Ev]: Av1,
            [yv]: [{
                [NT6]: Yv1
            }, "supportsFIPS"]
        },
        Z0q = {
            [NT6]: Yv1
        },
        H0q = {
            [Ev]: Yn6,
            [yv]: [!0, {
                [Ev]: Av1,
                [yv]: [Z0q, "supportsDualStack"]
            }]
        },
        J0q = [W0q],
        X0q = [D0q],
        M0q = [zn6],
        ib9 = {
            version: "1.0",
            parameters: {
                Region: O0q,
                UseDualStack: w0q,
                UseFIPS: w0q,
                Endpoint: O0q
            },
            rules: [{
                conditions: [{
                    [Ev]: A0q,
                    [yv]: [$0q]
                }],
                rules: [{
                    conditions: J0q,
                    error: "Invalid Configuration: FIPS and custom endpoint are not supported",
                    type: kT6
                }, {
                    conditions: X0q,
                    error: "Invalid Configuration: Dualstack and custom endpoint are not supported",
                    type: kT6
                }, {
                    endpoint: {
                        url: $0q,
                        properties: WP,
                        headers: WP
                    },
                    type: PQ
                }],
                type: Do
            }, {
                conditions: [{
                    [Ev]: A0q,
                    [yv]: M0q
                }],
                rules: [{
                    conditions: [{
                        [Ev]: "aws.partition",
                        [yv]: M0q,
                        assign: Yv1
                    }],
                    rules: [{
                        conditions: [W0q, D0q],
                        rules: [{
                            conditions: [{
                                [Ev]: Yn6,
                                [yv]: [Y0q, j0q]
                            }, H0q],
                            rules: [{
                                conditions: [{
                                    [Ev]: _n6,
                                    [yv]: [zn6, "us-east-1"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-east-1.amazonaws.com",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }, {
                                conditions: [{
                                    [Ev]: _n6,
                                    [yv]: [zn6, "us-east-2"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-east-2.amazonaws.com",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }, {
                                conditions: [{
                                    [Ev]: _n6,
                                    [yv]: [zn6, "us-west-1"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-west-1.amazonaws.com",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }, {
                                conditions: [{
                                    [Ev]: _n6,
                                    [yv]: [zn6, "us-west-2"]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity-fips.us-west-2.amazonaws.com",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }, {
                                endpoint: {
                                    url: "https://cognito-identity-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }],
                            type: Do
                        }, {
                            error: "FIPS and DualStack are enabled, but this partition does not support one or both",
                            type: kT6
                        }],
                        type: Do
                    }, {
                        conditions: J0q,
                        rules: [{
                            conditions: [{
                                [Ev]: Yn6,
                                [yv]: [j0q, Y0q]
                            }],
                            rules: [{
                                endpoint: {
                                    url: "https://cognito-identity-fips.{Region}.{PartitionResult#dnsSuffix}",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }],
                            type: Do
                        }, {
                            error: "FIPS is enabled but this partition does not support FIPS",
                            type: kT6
                        }],
                        type: Do
                    }, {
                        conditions: X0q,
                        rules: [{
                            conditions: [H0q],
                            rules: [{
                                conditions: [{
                                    [Ev]: _n6,
                                    [yv]: ["aws", {
                                        [Ev]: Av1,
                                        [yv]: [Z0q, "name"]
                                    }]
                                }],
                                endpoint: {
                                    url: "https://cognito-identity.{Region}.amazonaws.com",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }, {
                                endpoint: {
                                    url: "https://cognito-identity.{Region}.{PartitionResult#dualStackDnsSuffix}",
                                    properties: WP,
                                    headers: WP
                                },
                                type: PQ
                            }],
                            type: Do
                        }, {
                            error: "DualStack is enabled but this partition does not support DualStack",
                            type: kT6
                        }],
                        type: Do
                    }, {
                        endpoint: {
                            url: "https://cognito-identity.{Region}.{PartitionResult#dnsSuffix}",
                            properties: WP,
                            headers: WP
                        },
                        type: PQ
                    }],
                    type: Do
                }],
                type: Do
            }, {
                error: "Invalid Configuration: Missing Region",
                type: kT6
            }]
        };
    f0q.ruleSet = ib9
})
// @from(Ln 106814, Col 4)
k0q = p((T0q) => {
    Object.defineProperty(T0q, "__esModule", {
        value: !0
    });
    T0q.defaultEndpointResolver = void 0;
    var rb9 = QU(),
        Ov1 = dm(),
        ob9 = v0q(),
        ab9 = new Ov1.EndpointCache({
            size: 50,
            params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"]
        }),
        sb9 = (q, K = {}) => {
            return ab9.get(q, () => (0, Ov1.resolveEndpoint)(ob9.ruleSet, {
                endpointParams: q,
                logger: K.logger
            }))
        };
    T0q.defaultEndpointResolver = sb9;
    Ov1.customEndpointFunctions.aws = rb9.awsEndpointFunctions
})
// @from(Ln 106835, Col 4)
h0q = p((y0q) => {
    Object.defineProperty(y0q, "__esModule", {
        value: !0
    });
    y0q.getRuntimeConfig = void 0;
    var tb9 = k$(),
        eb9 = Ao(),
        qI9 = FO(),
        KI9 = qn6(),
        _I9 = jb(),
        N0q = z0q(),
        E0q = nw(),
        zI9 = Kv1(),
        YI9 = k0q(),
        AI9 = (q) => {
            return {
                apiVersion: "2014-06-30",
                base64Decoder: q?.base64Decoder ?? N0q.fromBase64,
                base64Encoder: q?.base64Encoder ?? N0q.toBase64,
                disableHostPrefix: q?.disableHostPrefix ?? !1,
                endpointProvider: q?.endpointProvider ?? YI9.defaultEndpointResolver,
                extensions: q?.extensions ?? [],
                httpAuthSchemeProvider: q?.httpAuthSchemeProvider ?? zI9.defaultCognitoIdentityHttpAuthSchemeProvider,
                httpAuthSchemes: q?.httpAuthSchemes ?? [{
                    schemeId: "aws.auth#sigv4",
                    identityProvider: (K) => K.getIdentityProvider("aws.auth#sigv4"),
                    signer: new tb9.AwsSdkSigV4Signer
                }, {
                    schemeId: "smithy.api#noAuth",
                    identityProvider: (K) => K.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                    signer: new qI9.NoAuthSigner
                }],
                logger: q?.logger ?? new KI9.NoOpLogger,
                protocol: q?.protocol ?? new eb9.AwsJson1_1Protocol({
                    defaultNamespace: "com.amazonaws.cognitoidentity",
                    serviceTarget: "AWSCognitoIdentityService",
                    awsQueryCompatible: !1
                }),
                serviceId: q?.serviceId ?? "Cognito Identity",
                urlParser: q?.urlParser ?? _I9.parseUrl,
                utf8Decoder: q?.utf8Decoder ?? E0q.fromUtf8,
                utf8Encoder: q?.utf8Encoder ?? E0q.toUtf8
            }
        };
    y0q.getRuntimeConfig = AI9
})
// @from(Ln 106881, Col 4)
u0q = p((I0q) => {
    Object.defineProperty(I0q, "__esModule", {
        value: !0
    });
    I0q.getRuntimeConfig = void 0;
    var OI9 = IV(),
        wI9 = OI9.__importDefault(iWq()),
        R0q = k$(),
        $I9 = uO6(),
        S0q = Ko(),
        TZ8 = KM(),
        jI9 = _o(),
        C0q = rZ(),
        _w6 = jE(),
        b0q = wE(),
        HI9 = zo(),
        JI9 = lU(),
        XI9 = h0q(),
        MI9 = qn6(),
        PI9 = wo(),
        WI9 = qn6(),
        DI9 = (q) => {
            (0, WI9.emitWarningIfUnsupportedVersion)(process.version);
            let K = (0, PI9.resolveDefaultsModeConfig)(q),
                _ = () => K().then(MI9.loadConfigsForDefaultMode),
                z = (0, XI9.getRuntimeConfig)(q);
            (0, R0q.emitWarningIfUnsupportedVersion)(process.version);
            let Y = {
                profile: q?.profile,
                logger: z.logger
            };
            return {
                ...z,
                ...q,
                runtime: "node",
                defaultsMode: K,
                authSchemePreference: q?.authSchemePreference ?? (0, _w6.loadConfig)(R0q.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, Y),
                bodyLengthChecker: q?.bodyLengthChecker ?? HI9.calculateBodyLength,
                credentialDefaultProvider: q?.credentialDefaultProvider ?? $I9.defaultProvider,
                defaultUserAgentProvider: q?.defaultUserAgentProvider ?? (0, S0q.createDefaultUserAgentProvider)({
                    serviceId: z.serviceId,
                    clientVersion: wI9.default.version
                }),
                maxAttempts: q?.maxAttempts ?? (0, _w6.loadConfig)(C0q.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, q),
                region: q?.region ?? (0, _w6.loadConfig)(TZ8.NODE_REGION_CONFIG_OPTIONS, {
                    ...TZ8.NODE_REGION_CONFIG_FILE_OPTIONS,
                    ...Y
                }),
                requestHandler: b0q.NodeHttpHandler.create(q?.requestHandler ?? _),
                retryMode: q?.retryMode ?? (0, _w6.loadConfig)({
                    ...C0q.NODE_RETRY_MODE_CONFIG_OPTIONS,
                    default: async () => (await _()).retryMode || JI9.DEFAULT_RETRY_MODE
                }, q),
                sha256: q?.sha256 ?? jI9.Hash.bind(null, "sha256"),
                streamCollector: q?.streamCollector ?? b0q.streamCollector,
                useDualstackEndpoint: q?.useDualstackEndpoint ?? (0, _w6.loadConfig)(TZ8.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, Y),
                useFipsEndpoint: q?.useFipsEndpoint ?? (0, _w6.loadConfig)(TZ8.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, Y),
                userAgentAppId: q?.userAgentAppId ?? (0, _w6.loadConfig)(S0q.NODE_APP_ID_CONFIG_OPTIONS, Y)
            }
        };
    I0q.getRuntimeConfig = DI9
})
// @from(Ln 106943, Col 4)
F0q = p((VI9) => {
    var ZI9 = iG1(),
        fI9 = (q) => {
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
        GI9 = (q) => {
            return {
                httpHandler: q.httpHandler()
            }
        };
    class m0q {
        name;
        kind;
        values;
        constructor({
            name: q,
            kind: K = ZI9.FieldPosition.HEADER,
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
    class B0q {
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
    class VZ8 {
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
            let K = new VZ8({
                ...q,
                headers: {
                    ...q.headers
                }
            });
            if (K.query) K.query = vI9(K.query);
            return K
        }
        static isInstance(q) {
            if (!q) return !1;
            let K = q;
            return "method" in K && "protocol" in K && "hostname" in K && "path" in K && typeof K.query === "object" && typeof K.headers === "object"
        }
        clone() {
            return VZ8.clone(this)
        }
    }

    function vI9(q) {
        return Object.keys(q).reduce((K, _) => {
            let z = q[_];
            return {
                ...K,
                [_]: Array.isArray(z) ? [...z] : z
            }
        }, {})
    }
    class p0q {
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

    function TI9(q) {
        return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(q)
    }
    VI9.Field = m0q;
    VI9.Fields = B0q;
    VI9.HttpRequest = VZ8;
    VI9.HttpResponse = p0q;
    VI9.getHttpHandlerExtensionConfiguration = fI9;
    VI9.isValidHostname = TI9;
    VI9.resolveHttpHandlerRuntimeConfig = GI9
})
// @from(Ln 107085, Col 4)
TDq = p((xv1) => {
    var g0q = nr(),
        SI9 = ir(),
        CI9 = rr(),
        U0q = cU(),
        bI9 = KM(),
        kZ8 = FO(),
        Qh = sj(),
        II9 = qo(),
        qH = cm(),
        Q0q = rZ(),
        QO = qn6(),
        d0q = Kv1(),
        xI9 = u0q(),
        c0q = lm(),
        l0q = F0q(),
        uI9 = (q) => {
            return Object.assign(q, {
                useDualstackEndpoint: q.useDualstackEndpoint ?? !1,
                useFipsEndpoint: q.useFipsEndpoint ?? !1,
                defaultSigningName: "cognito-identity"
            })
        },
        zJ = {
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
        mI9 = (q) => {
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
        BI9 = (q) => {
            return {
                httpAuthSchemes: q.httpAuthSchemes(),
                httpAuthSchemeProvider: q.httpAuthSchemeProvider(),
                credentials: q.credentials()
            }
        },
        pI9 = (q, K) => {
            let _ = Object.assign(c0q.getAwsRegionExtensionConfiguration(q), QO.getDefaultExtensionConfiguration(q), l0q.getHttpHandlerExtensionConfiguration(q), mI9(q));
            return K.forEach((z) => z.configure(_)), Object.assign(q, c0q.resolveAwsRegionExtensionConfiguration(_), QO.resolveDefaultRuntimeConfig(_), l0q.resolveHttpHandlerRuntimeConfig(_), BI9(_))
        };
    class EZ8 extends QO.Client {
        config;
        constructor(...[q]) {
            let K = xI9.getRuntimeConfig(q || {});
            super(K);
            this.initConfig = K;
            let _ = uI9(K),
                z = U0q.resolveUserAgentConfig(_),
                Y = Q0q.resolveRetryConfig(z),
                A = bI9.resolveRegionConfig(Y),
                O = g0q.resolveHostHeaderConfig(A),
                w = qH.resolveEndpointConfig(O),
                $ = d0q.resolveHttpAuthSchemeConfig(w),
                j = pI9($, q?.extensions || []);
            this.config = j, this.middlewareStack.use(Qh.getSchemaSerdePlugin(this.config)), this.middlewareStack.use(U0q.getUserAgentPlugin(this.config)), this.middlewareStack.use(Q0q.getRetryPlugin(this.config)), this.middlewareStack.use(II9.getContentLengthPlugin(this.config)), this.middlewareStack.use(g0q.getHostHeaderPlugin(this.config)), this.middlewareStack.use(SI9.getLoggerPlugin(this.config)), this.middlewareStack.use(CI9.getRecursionDetectionPlugin(this.config)), this.middlewareStack.use(kZ8.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
                httpAuthSchemeParametersProvider: d0q.defaultCognitoIdentityHttpAuthSchemeParametersProvider,
                identityProviderConfigProvider: async (H) => new kZ8.DefaultIdentityProviderConfig({
                    "aws.auth#sigv4": H.credentials
                })
            })), this.middlewareStack.use(kZ8.getHttpSigningPlugin(this.config))
        }
        destroy() {
            super.destroy()
        }
    }
    var dh = class q extends QO.ServiceException {
            constructor(K) {
                super(K);
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        n0q = class q extends dh {
            name = "InternalErrorException";
            $fault = "server";
            constructor(K) {
                super({
                    name: "InternalErrorException",
                    $fault: "server",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        i0q = class q extends dh {
            name = "InvalidParameterException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "InvalidParameterException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        r0q = class q extends dh {
            name = "LimitExceededException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "LimitExceededException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        o0q = class q extends dh {
            name = "NotAuthorizedException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "NotAuthorizedException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        a0q = class q extends dh {
            name = "ResourceConflictException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ResourceConflictException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        s0q = class q extends dh {
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
        t0q = class q extends dh {
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
        e0q = class q extends dh {
            name = "ExternalServiceException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ExternalServiceException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        qDq = class q extends dh {
            name = "InvalidIdentityPoolConfigurationException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "InvalidIdentityPoolConfigurationException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        KDq = class q extends dh {
            name = "DeveloperUserAlreadyRegisteredException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "DeveloperUserAlreadyRegisteredException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        _Dq = class q extends dh {
            name = "ConcurrentModificationException";
            $fault = "client";
            constructor(K) {
                super({
                    name: "ConcurrentModificationException",
                    $fault: "client",
                    ...K
                });
                Object.setPrototypeOf(this, q.prototype)
            }
        },
        zDq = "AllowClassicFlow",
        FI9 = "AccountId",
        gI9 = "AccessKeyId",
        UI9 = "AmbiguousRoleResolution",
        YDq = "AllowUnauthenticatedIdentities",
        ADq = "Credentials",
        QI9 = "CreationDate",
        dI9 = "ClientId",
        cI9 = "CognitoIdentityProvider",
        lI9 = "CreateIdentityPoolInput",
        nI9 = "CognitoIdentityProviderList",
        ODq = "CognitoIdentityProviders",
        iI9 = "CreateIdentityPool",
        rI9 = "ConcurrentModificationException",
        oI9 = "CustomRoleArn",
        aI9 = "Claim",
        sI9 = "DeleteIdentities",
        tI9 = "DeleteIdentitiesInput",
        eI9 = "DescribeIdentityInput",
        qx9 = "DeleteIdentityPool",
        Kx9 = "DeleteIdentityPoolInput",
        _x9 = "DescribeIdentityPoolInput",
        zx9 = "DescribeIdentityPool",
        Yx9 = "DeleteIdentitiesResponse",
        Ax9 = "DescribeIdentity",
        yZ8 = "DeveloperProviderName",
        Ox9 = "DeveloperUserAlreadyRegisteredException",
        wDq = "DeveloperUserIdentifier",
        wx9 = "DeveloperUserIdentifierList",
        $x9 = "DestinationUserIdentifier",
        jx9 = "Expiration",
        Hx9 = "ErrorCode",
        Jx9 = "ExternalServiceException",
        Xx9 = "GetCredentialsForIdentity",
        Mx9 = "GetCredentialsForIdentityInput",
        Px9 = "GetCredentialsForIdentityResponse",
        Wx9 = "GetId",
        Dx9 = "GetIdInput",
        Zx9 = "GetIdentityPoolRoles",
        fx9 = "GetIdentityPoolRolesInput",
        Gx9 = "GetIdentityPoolRolesResponse",
        vx9 = "GetIdResponse",
        Tx9 = "GetOpenIdToken",
        Vx9 = "GetOpenIdTokenForDeveloperIdentity",
        kx9 = "GetOpenIdTokenForDeveloperIdentityInput",
        Nx9 = "GetOpenIdTokenForDeveloperIdentityResponse",
        Ex9 = "GetOpenIdTokenInput",
        yx9 = "GetOpenIdTokenResponse",
        Lx9 = "GetPrincipalTagAttributeMap",
        hx9 = "GetPrincipalTagAttributeMapInput",
        Rx9 = "GetPrincipalTagAttributeMapResponse",
        Sx9 = "HideDisabled",
        Cx9 = "Identities",
        bx9 = "IdentityDescription",
        Ix9 = "InternalErrorException",
        gV = "IdentityId",
        xx9 = "InvalidIdentityPoolConfigurationException",
        ux9 = "IdentityIdsToDelete",
        mx9 = "IdentitiesList",
        Bx9 = "IdentityPool",
        px9 = "InvalidParameterException",
        OD = "IdentityPoolId",
        Fx9 = "IdentityPoolsList",
        wv1 = "IdentityPoolName",
        LZ8 = "IdentityProviderName",
        gx9 = "IdentityPoolShortDescription",
        Ux9 = "IdentityProviderToken",
        $Dq = "IdentityPoolTags",
        Qx9 = "IdentityPools",
        ET6 = "Logins",
        dx9 = "LookupDeveloperIdentity",
        cx9 = "LookupDeveloperIdentityInput",
        lx9 = "LookupDeveloperIdentityResponse",
        nx9 = "LimitExceededException",
        ix9 = "ListIdentities",
        rx9 = "ListIdentitiesInput",
        ox9 = "ListIdentityPools",
        ax9 = "ListIdentityPoolsInput",
        sx9 = "ListIdentityPoolsResponse",
        tx9 = "ListIdentitiesResponse",
        ex9 = "LoginsMap",
        qu9 = "LastModifiedDate",
        Ku9 = "ListTagsForResource",
        _u9 = "ListTagsForResourceInput",
        zu9 = "ListTagsForResourceResponse",
        Yu9 = "LoginsToRemove",
        Au9 = "MergeDeveloperIdentities",
        Ou9 = "MergeDeveloperIdentitiesInput",
        wu9 = "MergeDeveloperIdentitiesResponse",
        $v1 = "MaxResults",
        $u9 = "MappingRulesList",
        ju9 = "MappingRule",
        Hu9 = "MatchType",
        Ju9 = "NotAuthorizedException",
        yT6 = "NextToken",
        jDq = "OpenIdConnectProviderARNs",
        Xu9 = "OIDCToken",
        Mu9 = "ProviderName",
        hZ8 = "PrincipalTags",
        HDq = "Roles",
        jv1 = "ResourceArn",
        Pu9 = "RoleARN",
        Wu9 = "RulesConfiguration",
        Du9 = "ResourceConflictException",
        Zu9 = "RulesConfigurationType",
        JDq = "RoleMappings",
        fu9 = "RoleMappingMap",
        Gu9 = "RoleMapping",
        vu9 = "ResourceNotFoundException",
        Tu9 = "Rules",
        Vu9 = "SetIdentityPoolRoles",
        ku9 = "SetIdentityPoolRolesInput",
        Nu9 = "SecretKey",
        Eu9 = "SecretKeyString",
        XDq = "SupportedLoginProviders",
        MDq = "SamlProviderARNs",
        yu9 = "SetPrincipalTagAttributeMap",
        Lu9 = "SetPrincipalTagAttributeMapInput",
        hu9 = "SetPrincipalTagAttributeMapResponse",
        Ru9 = "ServerSideTokenCheck",
        Su9 = "SessionToken",
        Cu9 = "SourceUserIdentifier",
        PDq = "Token",
        bu9 = "TokenDuration",
        Iu9 = "TagKeys",
        xu9 = "TooManyRequestsException",
        uu9 = "TagResource",
        mu9 = "TagResourceInput",
        Bu9 = "TagResourceResponse",
        WDq = "Tags",
        pu9 = "Type",
        Hv1 = "UseDefaults",
        Fu9 = "UnlinkDeveloperIdentity",
        gu9 = "UnlinkDeveloperIdentityInput",
        Uu9 = "UnlinkIdentity",
        Qu9 = "UnprocessedIdentityIds",
        du9 = "UnprocessedIdentityIdList",
        cu9 = "UnlinkIdentityInput",
        lu9 = "UnprocessedIdentityId",
        nu9 = "UpdateIdentityPool",
        iu9 = "UntagResource",
        ru9 = "UntagResourceInput",
        ou9 = "UntagResourceResponse",
        au9 = "Value",
        WQ = "client",
        AB = "error",
        DQ = "httpError",
        OB = "message",
        su9 = "server",
        DDq = "smithy.ts.sdk.synthetic.com.amazonaws.cognitoidentity",
        wq = "com.amazonaws.cognitoidentity",
        tu9 = [0, wq, Ux9, 8, 0],
        ZDq = [0, wq, Xu9, 8, 0],
        eu9 = [0, wq, Eu9, 8, 0],
        qm9 = [3, wq, cI9, 0, [Mu9, dI9, Ru9],
            [0, 0, 2]
        ],
        Km9 = [-3, wq, rI9, {
                [AB]: WQ,
                [DQ]: 400
            },
            [OB],
            [0]
        ];
    Qh.TypeRegistry.for(wq).registerError(Km9, _Dq);
    var _m9 = [3, wq, lI9, 0, [wv1, YDq, zDq, XDq, yZ8, jDq, ODq, MDq, $Dq],
            [0, 2, 2, 128, 0, 64, () => GDq, 64, 128]
        ],
        zm9 = [3, wq, ADq, 0, [gI9, Nu9, Su9, jx9],
            [0, [() => eu9, 0], 0, 4]
        ],
        Ym9 = [3, wq, tI9, 0, [ux9],
            [64]
        ],
        Am9 = [3, wq, Yx9, 0, [Qu9],
            [() => AB9]
        ],
        Om9 = [3, wq, Kx9, 0, [OD],
            [0]
        ],
        wm9 = [3, wq, eI9, 0, [gV],
            [0]
        ],
        $m9 = [3, wq, _x9, 0, [OD],
            [0]
        ],
        jm9 = [-3, wq, Ox9, {
                [AB]: WQ,
                [DQ]: 400
            },
            [OB],
            [0]
        ];
    Qh.TypeRegistry.for(wq).registerError(jm9, KDq);
    var Hm9 = [-3, wq, Jx9, {
            [AB]: WQ,
            [DQ]: 400
        },
        [OB],
        [0]
    ];
    Qh.TypeRegistry.for(wq).registerError(Hm9, e0q);
    var Jm9 = [3, wq, Mx9, 0, [gV, ET6, oI9],
            [0, [() => An6, 0], 0]
        ],
        Xm9 = [3, wq, Px9, 0, [gV, ADq],
            [0, [() => zm9, 0]]
        ],
        Mm9 = [3, wq, fx9, 0, [OD],
            [0]
        ],
        Pm9 = [3, wq, Gx9, 0, [OD, HDq, JDq],
            [0, 128, () => vDq]
        ],
        Wm9 = [3, wq, Dx9, 0, [FI9, OD, ET6],
            [0, 0, [() => An6, 0]]
        ],
        Dm9 = [3, wq, vx9, 0, [gV],
            [0]
        ],
        Zm9 = [3, wq, kx9, 0, [OD, gV, ET6, hZ8, bu9],
            [0, 0, [() => An6, 0], 128, 1]
        ],
        fm9 = [3, wq, Nx9, 0, [gV, PDq],
            [0, [() => ZDq, 0]]
        ],
        Gm9 = [3, wq, Ex9, 0, [gV, ET6],
            [0, [() => An6, 0]]
        ],
        vm9 = [3, wq, yx9, 0, [gV, PDq],
            [0, [() => ZDq, 0]]
        ],
        Tm9 = [3, wq, hx9, 0, [OD, LZ8],
            [0, 0]
        ],
        Vm9 = [3, wq, Rx9, 0, [OD, LZ8, Hv1, hZ8],
            [0, 0, 2, 128]
        ],
        fDq = [3, wq, bx9, 0, [gV, ET6, QI9, qu9],
            [0, 64, 4, 4]
        ],
        NZ8 = [3, wq, Bx9, 0, [OD, wv1, YDq, zDq, XDq, yZ8, jDq, ODq, MDq, $Dq],
            [0, 0, 2, 2, 128, 0, 64, () => GDq, 64, 128]
        ],
        km9 = [3, wq, gx9, 0, [OD, wv1],
            [0, 0]
        ],
        Nm9 = [-3, wq, Ix9, {
                [AB]: su9
            },
            [OB],
            [0]
        ];
    Qh.TypeRegistry.for(wq).registerError(Nm9, n0q);
    var Em9 = [-3, wq, xx9, {
            [AB]: WQ,
            [DQ]: 400
        },
        [OB],
        [0]
    ];
    Qh.TypeRegistry.for(wq).registerError(Em9, qDq);
    var ym9 = [-3, wq, px9, {
            [AB]: WQ,
            [DQ]: 400
        },
        [OB],
        [0]
    ];
    Qh.TypeRegistry.for(wq).registerError(ym9, i0q);
    var Lm9 = [-3, wq, nx9, {
            [AB]: WQ,
            [DQ]: 400
        },
        [OB],
        [0]
    ];
    Qh.TypeRegistry.for(wq).registerError(Lm9, r0q);
    var hm9 = [3, wq, rx9, 0, [OD, $v1, yT6, Sx9],
            [0, 1, 0, 2]
        ],
        Rm9 = [3, wq, tx9, 0, [OD, Cx9, yT6],
            [0, () => _B9, 0]
        ],
        Sm9 = [3, wq, ax9, 0, [$v1, yT6],
            [1, 0]
        ],
        Cm9 = [3, wq, sx9, 0, [Qx9, yT6],
            [() => zB9, 0]
        ],
        bm9 = [3, wq, _u9, 0, [jv1],
            [0]
        ],
        Im9 = [3, wq, zu9, 0, [WDq],
            [128]
        ],
        xm9 = [3, wq, cx9, 0, [OD, gV, wDq, $v1, yT6],
            [0, 0, 0, 1, 0]
        ],
        um9 = [3, wq, lx9, 0, [gV, wx9, yT6],
            [0, 64, 0]
        ],
        mm9 = [3, wq, ju9, 0, [aI9, Hu9, au9, Pu9],
            [0, 0, 0, 0]
        ],
        Bm9 = [3, wq, Ou9, 0, [Cu9, $x9, yZ8, OD],
            [0, 0, 0, 0]
        ],
        pm9 = [3, wq, wu9, 0, [gV],
            [0]
        ],
        Fm9 = [-3, wq, Ju9, {
                [AB]: WQ,
                [DQ]: 403
            },
            [OB],
            [0]
        ];
    Qh.TypeRegistry.for(wq).registerError(Fm9, o0q);
    var gm9 = [-3, wq, Du9, {
            [AB]: WQ,
            [DQ]: 409
        },
        [OB],
        [0]
    ];
    Qh.TypeRegistry.for(wq).registerError(gm9, a0q);
    var Um9 = [-3, wq, vu9, {
            [AB]: WQ,
            [DQ]: 404
        },
        [OB],
        [0]
    ];
    Qh.TypeRegistry.for(wq).registerError(Um9, t0q);
    var Qm9 = [3, wq, Gu9, 0, [pu9, UI9, Wu9],
            [0, 0, () => dm9]
        ],
        dm9 = [3, wq, Zu9, 0, [Tu9],
            [() => YB9]
        ],
        cm9 = [3, wq, ku9, 0, [OD, HDq, JDq],
            [0, 128, () => vDq]
        ],
        lm9 = [3, wq, Lu9, 0, [OD, LZ8, Hv1, hZ8],
            [0, 0, 2, 128]
        ],
        nm9 = [3, wq, hu9, 0, [OD, LZ8, Hv1, hZ8],
            [0, 0, 2, 128]
        ],
        im9 = [3, wq, mu9, 0, [jv1, WDq],
            [0, 128]
        ],
        rm9 = [3, wq, Bu9, 0, [],
            []
        ],
        om9 = [-3, wq, xu9, {
                [AB]: WQ,
                [DQ]: 429
            },
            [OB],
            [0]
        ];
    Qh.TypeRegistry.for(wq).registerError(om9, s0q);
    var am9 = [3, wq, gu9, 0, [gV, OD, yZ8, wDq],
            [0, 0, 0, 0]
        ],
        sm9 = [3, wq, cu9, 0, [gV, ET6, Yu9],
            [0, [() => An6, 0], 64]
        ],
        tm9 = [3, wq, lu9, 0, [gV, Hx9],
            [0, 0]
        ],
        em9 = [3, wq, ru9, 0, [jv1, Iu9],
            [0, 64]
        ],
        qB9 = [3, wq, ou9, 0, [],
            []
        ],
        RZ8 = "unit",
        KB9 = [-3, DDq, "CognitoIdentityServiceException", 0, [],
            []
        ];
    Qh.TypeRegistry.for(DDq).registerError(KB9, dh);
    var GDq = [1, wq, nI9, 0, () => qm9],
        _B9 = [1, wq, mx9, 0, () => fDq],
        zB9 = [1, wq, Fx9, 0, () => km9],
        YB9 = [1, wq, $u9, 0, () => mm9],
        AB9 = [1, wq, du9, 0, () => tm9],
        An6 = [2, wq, ex9, 0, [0, 0],
            [() => tu9, 0]
        ],
        vDq = [2, wq, fu9, 0, 0, () => Qm9],
        OB9 = [9, wq, iI9, 0, () => _m9, () => NZ8],
        wB9 = [9, wq, sI9, 0, () => Ym9, () => Am9],
        $B9 = [9, wq, qx9, 0, () => Om9, () => RZ8],
        jB9 = [9, wq, Ax9, 0, () => wm9, () => fDq],
        HB9 = [9, wq, zx9, 0, () => $m9, () => NZ8],
        JB9 = [9, wq, Xx9, 0, () => Jm9, () => Xm9],
        XB9 = [9, wq, Wx9, 0, () => Wm9, () => Dm9],
        MB9 = [9, wq, Zx9, 0, () => Mm9, () => Pm9],
        PB9 = [9, wq, Tx9, 0, () => Gm9, () => vm9],
        WB9 = [9, wq, Vx9, 0, () => Zm9, () => fm9],
        DB9 = [9, wq, Lx9, 0, () => Tm9, () => Vm9],
        ZB9 = [9, wq, ix9, 0, () => hm9, () => Rm9],
        fB9 = [9, wq, ox9, 0, () => Sm9, () => Cm9],
        GB9 = [9, wq, Ku9, 0, () => bm9, () => Im9],
        vB9 = [9, wq, dx9, 0, () => xm9, () => um9],
        TB9 = [9, wq, Au9, 0, () => Bm9, () => pm9],
        VB9 = [9, wq, Vu9, 0, () => cm9, () => RZ8],
        kB9 = [9, wq, yu9, 0, () => lm9, () => nm9],
        NB9 = [9, wq, uu9, 0, () => im9, () => rm9],
        EB9 = [9, wq, Fu9, 0, () => am9, () => RZ8],
        yB9 = [9, wq, Uu9, 0, () => sm9, () => RZ8],
        LB9 = [9, wq, iu9, 0, () => em9, () => qB9],
        hB9 = [9, wq, nu9, 0, () => NZ8, () => NZ8];
    class Jv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "CreateIdentityPool", {}).n("CognitoIdentityClient", "CreateIdentityPoolCommand").sc(OB9).build() {}
    class Xv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentities", {}).n("CognitoIdentityClient", "DeleteIdentitiesCommand").sc(wB9).build() {}
    class Mv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DeleteIdentityPool", {}).n("CognitoIdentityClient", "DeleteIdentityPoolCommand").sc($B9).build() {}
    class Pv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentity", {}).n("CognitoIdentityClient", "DescribeIdentityCommand").sc(jB9).build() {}
    class Wv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "DescribeIdentityPool", {}).n("CognitoIdentityClient", "DescribeIdentityPoolCommand").sc(HB9).build() {}
    class Dv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetCredentialsForIdentity", {}).n("CognitoIdentityClient", "GetCredentialsForIdentityCommand").sc(JB9).build() {}
    class Zv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetId", {}).n("CognitoIdentityClient", "GetIdCommand").sc(XB9).build() {}
    class fv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetIdentityPoolRoles", {}).n("CognitoIdentityClient", "GetIdentityPoolRolesCommand").sc(MB9).build() {}
    class Gv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdToken", {}).n("CognitoIdentityClient", "GetOpenIdTokenCommand").sc(PB9).build() {}
    class vv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetOpenIdTokenForDeveloperIdentity", {}).n("CognitoIdentityClient", "GetOpenIdTokenForDeveloperIdentityCommand").sc(WB9).build() {}
    class Tv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "GetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "GetPrincipalTagAttributeMapCommand").sc(DB9).build() {}
    class Vv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentities", {}).n("CognitoIdentityClient", "ListIdentitiesCommand").sc(ZB9).build() {}
    class SZ8 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListIdentityPools", {}).n("CognitoIdentityClient", "ListIdentityPoolsCommand").sc(fB9).build() {}
    class kv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "ListTagsForResource", {}).n("CognitoIdentityClient", "ListTagsForResourceCommand").sc(GB9).build() {}
    class Nv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "LookupDeveloperIdentity", {}).n("CognitoIdentityClient", "LookupDeveloperIdentityCommand").sc(vB9).build() {}
    class Ev1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "MergeDeveloperIdentities", {}).n("CognitoIdentityClient", "MergeDeveloperIdentitiesCommand").sc(TB9).build() {}
    class yv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetIdentityPoolRoles", {}).n("CognitoIdentityClient", "SetIdentityPoolRolesCommand").sc(VB9).build() {}
    class Lv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "SetPrincipalTagAttributeMap", {}).n("CognitoIdentityClient", "SetPrincipalTagAttributeMapCommand").sc(kB9).build() {}
    class hv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "TagResource", {}).n("CognitoIdentityClient", "TagResourceCommand").sc(NB9).build() {}
    class Rv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkDeveloperIdentity", {}).n("CognitoIdentityClient", "UnlinkDeveloperIdentityCommand").sc(EB9).build() {}
    class Sv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UnlinkIdentity", {}).n("CognitoIdentityClient", "UnlinkIdentityCommand").sc(yB9).build() {}
    class Cv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UntagResource", {}).n("CognitoIdentityClient", "UntagResourceCommand").sc(LB9).build() {}
    class bv1 extends QO.Command.classBuilder().ep(zJ).m(function(q, K, _, z) {
        return [qH.getEndpointPlugin(_, q.getEndpointParameterInstructions())]
    }).s("AWSCognitoIdentityService", "UpdateIdentityPool", {}).n("CognitoIdentityClient", "UpdateIdentityPoolCommand").sc(hB9).build() {}
    var RB9 = {
        CreateIdentityPoolCommand: Jv1,
        DeleteIdentitiesCommand: Xv1,
        DeleteIdentityPoolCommand: Mv1,
        DescribeIdentityCommand: Pv1,
        DescribeIdentityPoolCommand: Wv1,
        GetCredentialsForIdentityCommand: Dv1,
        GetIdCommand: Zv1,
        GetIdentityPoolRolesCommand: fv1,
        GetOpenIdTokenCommand: Gv1,
        GetOpenIdTokenForDeveloperIdentityCommand: vv1,
        GetPrincipalTagAttributeMapCommand: Tv1,
        ListIdentitiesCommand: Vv1,
        ListIdentityPoolsCommand: SZ8,
        ListTagsForResourceCommand: kv1,
        LookupDeveloperIdentityCommand: Nv1,
        MergeDeveloperIdentitiesCommand: Ev1,
        SetIdentityPoolRolesCommand: yv1,
        SetPrincipalTagAttributeMapCommand: Lv1,
        TagResourceCommand: hv1,
        UnlinkDeveloperIdentityCommand: Rv1,
        UnlinkIdentityCommand: Sv1,
        UntagResourceCommand: Cv1,
        UpdateIdentityPoolCommand: bv1
    };
    class Iv1 extends EZ8 {}
    QO.createAggregatedClient(RB9, Iv1);
    var SB9 = kZ8.createPaginator(EZ8, SZ8, "NextToken", "NextToken", "MaxResults"),
        CB9 = {
            AUTHENTICATED_ROLE: "AuthenticatedRole",
            DENY: "Deny"
        },
        bB9 = {
            ACCESS_DENIED: "AccessDenied",
            INTERNAL_SERVER_ERROR: "InternalServerError"
        },
        IB9 = {
            CONTAINS: "Contains",
            EQUALS: "Equals",
            NOT_EQUAL: "NotEqual",
            STARTS_WITH: "StartsWith"
        },
        xB9 = {
            RULES: "Rules",
            TOKEN: "Token"
        };
    Object.defineProperty(xv1, "$Command", {
        enumerable: !0,
        get: function() {
            return QO.Command
        }
    });
    Object.defineProperty(xv1, "__Client", {
        enumerable: !0,
        get: function() {
            return QO.Client
        }
    });
    xv1.AmbiguousRoleResolutionType = CB9;
    xv1.CognitoIdentity = Iv1;
    xv1.CognitoIdentityClient = EZ8;
    xv1.CognitoIdentityServiceException = dh;
    xv1.ConcurrentModificationException = _Dq;
    xv1.CreateIdentityPoolCommand = Jv1;
    xv1.DeleteIdentitiesCommand = Xv1;
    xv1.DeleteIdentityPoolCommand = Mv1;
    xv1.DescribeIdentityCommand = Pv1;
    xv1.DescribeIdentityPoolCommand = Wv1;
    xv1.DeveloperUserAlreadyRegisteredException = KDq;
    xv1.ErrorCode = bB9;
    xv1.ExternalServiceException = e0q;
    xv1.GetCredentialsForIdentityCommand = Dv1;
    xv1.GetIdCommand = Zv1;
    xv1.GetIdentityPoolRolesCommand = fv1;
    xv1.GetOpenIdTokenCommand = Gv1;
    xv1.GetOpenIdTokenForDeveloperIdentityCommand = vv1;
    xv1.GetPrincipalTagAttributeMapCommand = Tv1;
    xv1.InternalErrorException = n0q;
    xv1.InvalidIdentityPoolConfigurationException = qDq;
    xv1.InvalidParameterException = i0q;
    xv1.LimitExceededException = r0q;
    xv1.ListIdentitiesCommand = Vv1;
    xv1.ListIdentityPoolsCommand = SZ8;
    xv1.ListTagsForResourceCommand = kv1;
    xv1.LookupDeveloperIdentityCommand = Nv1;
    xv1.MappingRuleMatchType = IB9;
    xv1.MergeDeveloperIdentitiesCommand = Ev1;
    xv1.NotAuthorizedException = o0q;
    xv1.ResourceConflictException = a0q;
    xv1.ResourceNotFoundException = t0q;
    xv1.RoleMappingType = xB9;
    xv1.SetIdentityPoolRolesCommand = yv1;
    xv1.SetPrincipalTagAttributeMapCommand = Lv1;
    xv1.TagResourceCommand = hv1;
    xv1.TooManyRequestsException = s0q;
    xv1.UnlinkDeveloperIdentityCommand = Rv1;
    xv1.UnlinkIdentityCommand = Sv1;
    xv1.UntagResourceCommand = Cv1;
    xv1.UpdateIdentityPoolCommand = bv1;
    xv1.paginateListIdentityPools = SB9
})
// @from(Ln 107915, Col 4)
mv1 = p((CZ8) => {
    var uv1 = TDq();
    Object.defineProperty(CZ8, "CognitoIdentityClient", {
        enumerable: !0,
        get: function() {
            return uv1.CognitoIdentityClient
        }
    });
    Object.defineProperty(CZ8, "GetCredentialsForIdentityCommand", {
        enumerable: !0,
        get: function() {
            return uv1.GetCredentialsForIdentityCommand
        }
    });
    Object.defineProperty(CZ8, "GetIdCommand", {
        enumerable: !0,
        get: function() {
            return uv1.GetIdCommand
        }
    })
})
// @from(Ln 107936, Col 4)
pv1 = p((Sp9) => {
    var bZ8 = jP();

    function VDq(q) {
        return Promise.all(Object.keys(q).reduce((K, _) => {
            let z = q[_];
            if (typeof z === "string") K.push([_, z]);
            else K.push(z().then((Y) => [_, Y]));
            return K
        }, [])).then((K) => K.reduce((_, [z, Y]) => {
            return _[z] = Y, _
        }, {}))
    }

    function kDq(q) {
        return async (K) => {
            q.logger?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
            let {
                GetCredentialsForIdentityCommand: _,
                CognitoIdentityClient: z
            } = await Promise.resolve().then(function() {
                return mv1()
            }), Y = (j) => q.clientConfig?.[j] ?? q.parentClientConfig?.[j] ?? K?.callerClientConfig?.[j], {
                Credentials: {
                    AccessKeyId: A = kp9(q.logger),
                    Expiration: O,
                    SecretKey: w = Ep9(q.logger),
                    SessionToken: $
                } = Np9(q.logger)
            } = await (q.client ?? new z(Object.assign({}, q.clientConfig ?? {}, {
                region: Y("region"),
                profile: Y("profile"),
                userAgentAppId: Y("userAgentAppId")
            }))).send(new _({
                CustomRoleArn: q.customRoleArn,
                IdentityId: q.identityId,
                Logins: q.logins ? await VDq(q.logins) : void 0
            }));
            return {
                identityId: q.identityId,
                accessKeyId: A,
                secretAccessKey: w,
                sessionToken: $,
                expiration: O
            }
        }
    }

    function kp9(q) {
        throw new bZ8.CredentialsProviderError("Response from Amazon Cognito contained no access key ID", {
            logger: q
        })
    }

    function Np9(q) {
        throw new bZ8.CredentialsProviderError("Response from Amazon Cognito contained no credentials", {
            logger: q
        })
    }

    function Ep9(q) {
        throw new bZ8.CredentialsProviderError("Response from Amazon Cognito contained no secret key", {
            logger: q
        })
    }
    var Bv1 = "IdentityIds";
    class NDq {
        dbName;
        constructor(q = "aws:cognito-identity-ids") {
            this.dbName = q
        }
        getItem(q) {
            return this.withObjectStore("readonly", (K) => {
                let _ = K.get(q);
                return new Promise((z) => {
                    _.onerror = () => z(null), _.onsuccess = () => z(_.result ? _.result.value : null)
                })
            }).catch(() => null)
        }
        removeItem(q) {
            return this.withObjectStore("readwrite", (K) => {
                let _ = K.delete(q);
                return new Promise((z, Y) => {
                    _.onerror = () => Y(_.error), _.onsuccess = () => z()
                })
            })
        }
        setItem(q, K) {
            return this.withObjectStore("readwrite", (_) => {
                let z = _.put({
                    id: q,
                    value: K
                });
                return new Promise((Y, A) => {
                    z.onerror = () => A(z.error), z.onsuccess = () => Y()
                })
            })
        }
        getDb() {
            let q = self.indexedDB.open(this.dbName, 1);
            return new Promise((K, _) => {
                q.onsuccess = () => {
                    K(q.result)
                }, q.onerror = () => {
                    _(q.error)
                }, q.onblocked = () => {
                    _(Error("Unable to access DB"))
                }, q.onupgradeneeded = () => {
                    let z = q.result;
                    z.onerror = () => {
                        _(Error("Failed to create object store"))
                    }, z.createObjectStore(Bv1, {
                        keyPath: "id"
                    })
                }
            })
        }
        withObjectStore(q, K) {
            return this.getDb().then((_) => {
                let z = _.transaction(Bv1, q);
                return z.oncomplete = () => _.close(), new Promise((Y, A) => {
                    z.onerror = () => A(z.error), Y(K(z.objectStore(Bv1)))
                }).catch((Y) => {
                    throw _.close(), Y
                })
            })
        }
    }
    class EDq {
        store;
        constructor(q = {}) {
            this.store = q
        }
        getItem(q) {
            if (q in this.store) return this.store[q];
            return null
        }
        removeItem(q) {
            delete this.store[q]
        }
        setItem(q, K) {
            this.store[q] = K
        }
    }
    var yp9 = new EDq;

    function Lp9() {
        if (typeof self === "object" && self.indexedDB) return new NDq;
        if (typeof window === "object" && window.localStorage) return window.localStorage;
        return yp9
    }

    function hp9({
        accountId: q,
        cache: K = Lp9(),
        client: _,
        clientConfig: z,
        customRoleArn: Y,
        identityPoolId: A,
        logins: O,
        userIdentifier: w = !O || Object.keys(O).length === 0 ? "ANONYMOUS" : void 0,
        logger: $,
        parentClientConfig: j
    }) {
        $?.debug("@aws-sdk/credential-provider-cognito-identity - fromCognitoIdentity");
        let H = w ? `aws:cognito-identity-credentials:${A}:${w}` : void 0,
            J = async (X) => {
                let {
                    GetIdCommand: M,
                    CognitoIdentityClient: P
                } = await Promise.resolve().then(function() {
                    return mv1()
                }), W = (G) => z?.[G] ?? j?.[G] ?? X?.callerClientConfig?.[G], D = _ ?? new P(Object.assign({}, z ?? {}, {
                    region: W("region"),
                    profile: W("profile"),
                    userAgentAppId: W("userAgentAppId")
                })), Z = H && await K.getItem(H);
                if (!Z) {
                    let {
                        IdentityId: G = Rp9($)
                    } = await D.send(new M({
                        AccountId: q,
                        IdentityPoolId: A,
                        Logins: O ? await VDq(O) : void 0
                    }));
                    if (Z = G, H) Promise.resolve(K.setItem(H, Z)).catch(() => {})
                }
                return J = kDq({
                    client: D,
                    customRoleArn: Y,
                    logins: O,
                    identityId: Z
                }), J(X)
            };
        return (X) => J(X).catch(async (M) => {
            if (H) Promise.resolve(K.removeItem(H)).catch(() => {});
            throw M
        })
    }

    function Rp9(q) {
        throw new bZ8.CredentialsProviderError("Response from Amazon Cognito contained no identity ID", {
            logger: q
        })
    }
    Sp9.fromCognitoIdentity = kDq;
    Sp9.fromCognitoIdentityPool = hp9
})
// @from(Ln 108144, Col 4)
hDq = p((yDq) => {
    Object.defineProperty(yDq, "__esModule", {
        value: !0
    });
    yDq.fromCognitoIdentity = void 0;
    var Ip9 = pv1(),
        xp9 = (q) => (0, Ip9.fromCognitoIdentity)({
            ...q
        });
    yDq.fromCognitoIdentity = xp9
})
// @from(Ln 108155, Col 4)
CDq = p((RDq) => {
    Object.defineProperty(RDq, "__esModule", {
        value: !0
    });
    RDq.fromCognitoIdentityPool = void 0;
    var up9 = pv1(),
        mp9 = (q) => (0, up9.fromCognitoIdentityPool)({
            ...q
        });
    RDq.fromCognitoIdentityPool = mp9
})
// @from(Ln 108166, Col 4)
xDq = p((bDq) => {
    Object.defineProperty(bDq, "__esModule", {
        value: !0
    });
    bDq.fromContainerMetadata = void 0;
    var Bp9 = PO6(),
        pp9 = (q) => {
            return q?.logger?.debug("@smithy/credential-provider-imds", "fromContainerMetadata"), (0, Bp9.fromContainerMetadata)(q)
        };
    bDq.fromContainerMetadata = pp9
})
// @from(Ln 108177, Col 4)
BDq = p((uDq) => {
    Object.defineProperty(uDq, "__esModule", {
        value: !0
    });
    uDq.fromEnv = void 0;
    var Fp9 = GP8(),
        gp9 = (q) => (0, Fp9.fromEnv)(q);
    uDq.fromEnv = gp9
})
// @from(Ln 108186, Col 4)
gDq = p((pDq) => {
    Object.defineProperty(pDq, "__esModule", {
        value: !0
    });
    pDq.fromIni = void 0;
    var Up9 = pP1(),
        Qp9 = (q = {}) => (0, Up9.fromIni)({
            ...q
        });
    pDq.fromIni = Qp9
})
// @from(Ln 108197, Col 4)
dDq = p((UDq) => {
    Object.defineProperty(UDq, "__esModule", {
        value: !0
    });
    UDq.fromInstanceMetadata = void 0;
    var dp9 = $E(),
        cp9 = PO6(),
        lp9 = (q) => {
            return q?.logger?.debug("@smithy/credential-provider-imds", "fromInstanceMetadata"), async () => (0, cp9.fromInstanceMetadata)(q)().then((K) => (0, dp9.setCredentialFeature)(K, "CREDENTIALS_IMDS", "0"))
        };
    UDq.fromInstanceMetadata = lp9
})
// @from(Ln 108209, Col 4)
nDq = p((cDq) => {
    Object.defineProperty(cDq, "__esModule", {
        value: !0
    });
    cDq.fromLoginCredentials = void 0;
    var np9 = DP1(),
        ip9 = (q) => (0, np9.fromLoginCredentials)({
            ...q
        });
    cDq.fromLoginCredentials = ip9
})
// @from(Ln 108220, Col 4)
Fv1 = p((iDq) => {
    Object.defineProperty(iDq, "__esModule", {
        value: !0
    });
    iDq.fromNodeProviderChain = void 0;
    var rp9 = uO6(),
        op9 = (q = {}) => (0, rp9.defaultProvider)({
            ...q
        });
    iDq.fromNodeProviderChain = op9
})
// @from(Ln 108231, Col 4)
sDq = p((oDq) => {
    Object.defineProperty(oDq, "__esModule", {
        value: !0
    });
    oDq.fromProcess = void 0;
    var ap9 = M08(),
        sp9 = (q) => (0, ap9.fromProcess)(q);
    oDq.fromProcess = sp9
})
// @from(Ln 108240, Col 4)
qZq = p((tDq) => {
    Object.defineProperty(tDq, "__esModule", {
        value: !0
    });
    tDq.fromSSO = void 0;
    var tp9 = eW8(),
        ep9 = (q = {}) => {
            return (0, tp9.fromSSO)({
                ...q
            })
        };
    tDq.fromSSO = ep9
})
// @from(Ln 108253, Col 4)
_Zq = p((IZ8) => {
    Object.defineProperty(IZ8, "__esModule", {
        value: !0
    });
    IZ8.STSClient = IZ8.AssumeRoleCommand = void 0;
    var KZq = X08();
    Object.defineProperty(IZ8, "AssumeRoleCommand", {
        enumerable: !0,
        get: function() {
            return KZq.AssumeRoleCommand
        }
    });
    Object.defineProperty(IZ8, "STSClient", {
        enumerable: !0,
        get: function() {
            return KZq.STSClient
        }
    })
})
// @from(Ln 108272, Col 4)
AZq = p((ZQ) => {
    var KF9 = ZQ && ZQ.__createBinding || (Object.create ? function(q, K, _, z) {
            if (z === void 0) z = _;
            var Y = Object.getOwnPropertyDescriptor(K, _);
            if (!Y || ("get" in Y ? !K.__esModule : Y.writable || Y.configurable)) Y = {
                enumerable: !0,
                get: function() {
                    return K[_]
                }
            };
            Object.defineProperty(q, z, Y)
        } : function(q, K, _, z) {
            if (z === void 0) z = _;
            q[z] = K[_]
        }),
        _F9 = ZQ && ZQ.__setModuleDefault || (Object.create ? function(q, K) {
            Object.defineProperty(q, "default", {
                enumerable: !0,
                value: K
            })
        } : function(q, K) {
            q.default = K
        }),
        zF9 = ZQ && ZQ.__importStar || function() {
            var q = function(K) {
                return q = Object.getOwnPropertyNames || function(_) {
                    var z = [];
                    for (var Y in _)
                        if (Object.prototype.hasOwnProperty.call(_, Y)) z[z.length] = Y;
                    return z
                }, q(K)
            };
            return function(K) {
                if (K && K.__esModule) return K;
                var _ = {};
                if (K != null) {
                    for (var z = q(K), Y = 0; Y < z.length; Y++)
                        if (z[Y] !== "default") KF9(_, K, z[Y])
                }
                return _F9(_, K), _
            }
        }();
    Object.defineProperty(ZQ, "__esModule", {
        value: !0
    });
    ZQ.fromTemporaryCredentials = void 0;
    var YF9 = FO(),
        zZq = jP(),
        AF9 = "us-east-1",
        OF9 = (q, K, _) => {
            let z;
            return async (Y = {}) => {
                let {
                    callerClientConfig: A
                } = Y, O = q.clientConfig?.profile ?? A?.profile, w = q.logger ?? A?.logger;
                w?.debug("@aws-sdk/credential-providers - fromTemporaryCredentials (STS)");
                let $ = {
                    ...q.params,
                    RoleSessionName: q.params.RoleSessionName ?? "aws-sdk-js-" + Date.now()
                };
                if ($?.SerialNumber) {
                    if (!q.mfaCodeProvider) throw new zZq.CredentialsProviderError("Temporary credential requires multi-factor authentication, but no MFA code callback was provided.", {
                        tryNextLink: !1,
                        logger: w
                    });
                    $.TokenCode = await q.mfaCodeProvider($?.SerialNumber)
                }
                let {
                    AssumeRoleCommand: j,
                    STSClient: H
                } = await Promise.resolve().then(() => zF9(_Zq()));
                if (!z) {
                    let X = typeof K === "function" ? K() : void 0,
                        M = [q.masterCredentials, q.clientConfig?.credentials, void A?.credentials, A?.credentialDefaultProvider?.(), X],
                        P = "STS client default credentials";
                    if (M[0]) P = "options.masterCredentials";
                    else if (M[1]) P = "options.clientConfig.credentials";
                    else if (M[2]) throw P = "caller client's credentials", Error("fromTemporaryCredentials recursion in callerClientConfig.credentials");
                    else if (M[3]) P = "caller client's credentialDefaultProvider";
                    else if (M[4]) P = "AWS SDK default credentials";
                    let W = [q.clientConfig?.region, A?.region, await _?.({
                            profile: O
                        }), AF9],
                        D = "default partition's default region";
                    if (W[0]) D = "options.clientConfig.region";
                    else if (W[1]) D = "caller client's region";
                    else if (W[2]) D = "file or env region";
                    let Z = [YZq(q.clientConfig?.requestHandler), YZq(A?.requestHandler)],
                        G = "STS default requestHandler";
                    if (Z[0]) G = "options.clientConfig.requestHandler";
                    else if (Z[1]) G = "caller client's requestHandler";
                    w?.debug?.(`@aws-sdk/credential-providers - fromTemporaryCredentials STS client init with ${D}=${await(0,YF9.normalizeProvider)(xZ8(W))()}, ${P}, ${G}.`), z = new H({
                        userAgentAppId: A?.userAgentAppId,
                        ...q.clientConfig,
                        credentials: xZ8(M),
                        logger: w,
                        profile: O,
                        region: xZ8(W),
                        requestHandler: xZ8(Z)
                    })
                }
                if (q.clientPlugins)
                    for (let X of q.clientPlugins) z.middlewareStack.use(X);
                let {
                    Credentials: J
                } = await z.send(new j($));
                if (!J || !J.AccessKeyId || !J.SecretAccessKey) throw new zZq.CredentialsProviderError(`Invalid response from STS.assumeRole call with role ${$.RoleArn}`, {
                    logger: w
                });
                return {
                    accessKeyId: J.AccessKeyId,
                    secretAccessKey: J.SecretAccessKey,
                    sessionToken: J.SessionToken,
                    expiration: J.Expiration,
                    credentialScope: J.CredentialScope
                }
            }
        };
    ZQ.fromTemporaryCredentials = OF9;
    var YZq = (q) => {
            return q?.metadata?.handlerProtocol === "h2" ? void 0 : q
        },
        xZ8 = (q) => {
            for (let K of q)
                if (K !== void 0) return K
        }
})
// @from(Ln 108399, Col 4)
$Zq = p((OZq) => {
    Object.defineProperty(OZq, "__esModule", {
        value: !0
    });
    OZq.fromTemporaryCredentials = void 0;
    var wF9 = KM(),
        $F9 = jE(),
        jF9 = Fv1(),
        HF9 = AZq(),
        JF9 = (q) => {
            return (0, HF9.fromTemporaryCredentials)(q, jF9.fromNodeProviderChain, async ({
                profile: K = process.env.AWS_PROFILE
            }) => (0, $F9.loadConfig)({
                environmentVariableSelector: (_) => _.AWS_REGION,
                configFileSelector: (_) => {
                    return _.region
                },
                default: () => {
                    return
                }
            }, {
                ...wF9.NODE_REGION_CONFIG_FILE_OPTIONS,
                profile: K
            })())
        };
    OZq.fromTemporaryCredentials = JF9
})
// @from(Ln 108426, Col 4)
JZq = p((jZq) => {
    Object.defineProperty(jZq, "__esModule", {
        value: !0
    });
    jZq.fromTokenFile = void 0;
    var XF9 = Kl6(),
        MF9 = (q = {}) => (0, XF9.fromTokenFile)({
            ...q
        });
    jZq.fromTokenFile = MF9
})
// @from(Ln 108437, Col 4)
PZq = p((XZq) => {
    Object.defineProperty(XZq, "__esModule", {
        value: !0
    });
    XZq.fromWebToken = void 0;
    var PF9 = Kl6(),
        WF9 = (q) => (0, PF9.fromWebToken)({
            ...q
        });
    XZq.fromWebToken = WF9
})
// @from(Ln 108448, Col 4)
LT6 = p((_f) => {
    Object.defineProperty(_f, "__esModule", {
        value: !0
    });
    _f.fromHttp = void 0;
    var EE = IV();
    EE.__exportStar(bWq(), _f);
    EE.__exportStar(hDq(), _f);
    EE.__exportStar(CDq(), _f);
    EE.__exportStar(xDq(), _f);
    EE.__exportStar(BDq(), _f);
    var DF9 = lP8();
    Object.defineProperty(_f, "fromHttp", {
        enumerable: !0,
        get: function() {
            return DF9.fromHttp
        }
    });
    EE.__exportStar(gDq(), _f);
    EE.__exportStar(dDq(), _f);
    EE.__exportStar(nDq(), _f);
    EE.__exportStar(Fv1(), _f);
    EE.__exportStar(sDq(), _f);
    EE.__exportStar(qZq(), _f);
    EE.__exportStar($Zq(), _f);
    EE.__exportStar(JZq(), _f);
    EE.__exportStar(PZq(), _f)
})
// @from(Ln 108477, Col 0)
function WZq(q) {
    return q?.name === "CredentialsProviderError"
}
// @from(Ln 108481, Col 0)
function DZq(q) {
    if (!q || typeof q !== "object") return !1;
    let K = q;
    if (!K.Credentials || typeof K.Credentials !== "object") return !1;
    let _ = K.Credentials;
    return typeof _.AccessKeyId === "string" && typeof _.SecretAccessKey === "string" && typeof _.SessionToken === "string" && _.AccessKeyId.length > 0 && _.SecretAccessKey.length > 0 && _.SessionToken.length > 0
}
// @from(Ln 108488, Col 0)
async function gv1() {
    let {
        STSClient: q,
        GetCallerIdentityCommand: K
    } = await Promise.resolve().then(() => K6(FG1(), 1));
    await new q().send(new K({}))
}
// @from(Ln 108495, Col 0)
async function ZZq() {
    try {
        E("Clearing AWS credential provider cache");
        let {
            fromIni: q
        } = await Promise.resolve().then(() => K6(LT6(), 1));
        await q({
            ignoreCache: !0
        })(), E("AWS credential provider cache refreshed")
    } catch (q) {
        E("Failed to clear AWS credential cache (this is expected if no credentials are configured)")
    }
}
// @from(Ln 108508, Col 4)
Uv1 = L(() => {
    K8()
})
// @from(Ln 108511, Col 0)
class wD {
    static instance = null;
    status = {
        isAuthenticating: !1,
        output: []
    };
    changed = l5();
    static getInstance() {
        if (!wD.instance) wD.instance = new wD;
        return wD.instance
    }
    getStatus() {
        return {
            ...this.status,
            output: [...this.status.output]
        }
    }
    startAuthentication() {
        this.status = {
            isAuthenticating: !0,
            output: []
        }, this.changed.emit(this.getStatus())
    }
    addOutput(q) {
        this.status.output.push(q), this.changed.emit(this.getStatus())
    }
    setError(q) {
        this.status.error = q, this.changed.emit(this.getStatus())
    }
    endAuthentication(q) {
        if (q) this.status = {
            isAuthenticating: !1,
            output: []
        };
        else this.status.isAuthenticating = !1;
        this.changed.emit(this.getStatus())
    }
    subscribe = this.changed.subscribe;
    static reset() {
        if (wD.instance) wD.instance.changed.clear(), wD.instance = null
    }
}
// @from(Ln 108553, Col 4)
uZ8 = L(() => {
    nH()
})
// @from(Ln 108556, Col 4)
mZ8 = "claude-code-20250219"
// @from(Ln 108557, Col 4)
fZq = "interleaved-thinking-2025-05-14"
// @from(Ln 108558, Col 4)
Zo = "context-1m-2025-08-07"
// @from(Ln 108559, Col 4)
BZ8 = "context-management-2025-06-27"
// @from(Ln 108560, Col 4)
t76 = "structured-outputs-2025-12-15"
// @from(Ln 108561, Col 4)
Qv1 = "web-search-2025-03-05"
// @from(Ln 108562, Col 4)
GZq = "advanced-tool-use-2025-11-20"
// @from(Ln 108563, Col 4)
vZq = "tool-search-tool-2025-10-19"
// @from(Ln 108564, Col 4)
dv1 = "effort-2025-11-24"
// @from(Ln 108565, Col 4)
cv1 = "task-budgets-2026-03-13"
// @from(Ln 108566, Col 4)
On6 = "prompt-caching-scope-2026-01-05"
// @from(Ln 108567, Col 4)
lv1 = "fast-mode-2026-02-01"
// @from(Ln 108568, Col 4)
pZ8 = "redact-thinking-2026-02-12"
// @from(Ln 108569, Col 4)
TZq = ""
// @from(Ln 108570, Col 4)
hT6 = "afk-mode-2026-01-31"
// @from(Ln 108571, Col 4)
nv1 = "advisor-tool-2026-03-01"
// @from(Ln 108572, Col 4)
iv1
// @from(Ln 108572, Col 9)
rv1
// @from(Ln 108573, Col 4)
e76 = L(() => {
    iv1 = new Set(["interleaved-thinking-2025-05-14", "context-1m-2025-08-07", "tool-search-tool-2025-10-19"]), rv1 = new Set(["claude-code-20250219", "interleaved-thinking-2025-05-14", "context-management-2025-06-27"])
})
// @from(Ln 108577, Col 0)
function q5() {
    if (pq() !== "firstParty") return !1;
    return !S6(process.env.CLAUDE_CODE_DISABLE_FAST_MODE)
}
// @from(Ln 108582, Col 0)
function av1() {
    return S6(process.env.CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK)
}
// @from(Ln 108586, Col 0)
function AM() {
    if (!q5()) return !1;
    return ST6() === null
}