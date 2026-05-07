
// @from(Ln 76924, Col 4)
UJ1 = p((kv6) => {
    var Zqq = gU(),
        FJ1 = XE(),
        mJ1 = PH1(),
        jD3 = sj(),
        Wqq = JE();
    class fqq {
        config;
        middlewareStack = Zqq.constructStack();
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
    var uJ1 = "***SensitiveInformation***";

    function BJ1(q, K) {
        if (K == null) return K;
        let _ = jD3.NormalizedSchema.of(q);
        if (_.getMergedTraits().sensitive) return uJ1;
        if (_.isListSchema()) {
            if (!!_.getValueSchema().getMergedTraits().sensitive) return uJ1
        } else if (_.isMapSchema()) {
            if (!!_.getKeySchema().getMergedTraits().sensitive || !!_.getValueSchema().getMergedTraits().sensitive) return uJ1
        } else if (_.isStructSchema() && typeof K === "object") {
            let z = K,
                Y = {};
            for (let [A, O] of _.structIterator())
                if (z[A] != null) Y[A] = BJ1(O, z[A]);
            return Y
        }
        return K
    }
    class gJ1 {
        middlewareStack = Zqq.constructStack();
        schema;
        static classBuilder() {
            return new Gqq
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
                    [mJ1.SMITHY_CONTEXT_KEY]: {
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
    class Gqq {
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
            return K = class extends gJ1 {
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
                        inputFilterSensitiveLog: q._inputFilterSensitiveLog ?? (A ? BJ1.bind(null, O) : ($) => $),
                        outputFilterSensitiveLog: q._outputFilterSensitiveLog ?? (A ? BJ1.bind(null, w) : ($) => $),
                        smithyContext: q._smithyContext,
                        additionalContext: q._additionalContext
                    })
                }
                serialize = q._serializer;
                deserialize = q._deserializer
            }
        }
    }
    var HD3 = "***SensitiveInformation***",
        JD3 = (q, K) => {
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
    class Vv6 extends Error {
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
            return Vv6.prototype.isPrototypeOf(K) || Boolean(K.$fault) && Boolean(K.$metadata) && (K.$fault === "client" || K.$fault === "server")
        }
        static[Symbol.hasInstance](q) {
            if (!q) return !1;
            let K = q;
            if (this === Vv6) return Vv6.isInstance(q);
            if (Vv6.isInstance(q)) {
                if (K.name && this.name) return this.prototype.isPrototypeOf(q) || K.name === this.name;
                return this.prototype.isPrototypeOf(q)
            }
            return !1
        }
    }
    var vqq = (q, K = {}) => {
            Object.entries(K).filter(([, z]) => z !== void 0).forEach(([z, Y]) => {
                if (q[z] == null || q[z] === "") q[z] = Y
            });
            let _ = q.message || q.Message || "UnknownError";
            return q.message = _, delete q.Message, q
        },
        Tqq = ({
            output: q,
            parsedBody: K,
            exceptionCtor: _,
            errorCode: z
        }) => {
            let Y = MD3(q),
                A = Y.httpStatusCode ? Y.httpStatusCode + "" : void 0,
                O = new _({
                    name: K?.code || K?.Code || z || A || "UnknownError",
                    $fault: "client",
                    $metadata: Y
                });
            throw vqq(O, K)
        },
        XD3 = (q) => {
            return ({
                output: K,
                parsedBody: _,
                errorCode: z
            }) => {
                Tqq({
                    output: K,
                    parsedBody: _,
                    exceptionCtor: q,
                    errorCode: z
                })
            }
        },
        MD3 = (q) => ({
            httpStatusCode: q.statusCode,
            requestId: q.headers["x-amzn-requestid"] ?? q.headers["x-amzn-request-id"] ?? q.headers["x-amz-request-id"],
            extendedRequestId: q.headers["x-amz-id-2"],
            cfId: q.headers["x-amz-cf-id"]
        }),
        PD3 = (q) => {
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
        Dqq = !1,
        WD3 = (q) => {
            if (q && !Dqq && parseInt(q.substring(1, q.indexOf("."))) < 16) Dqq = !0
        },
        DD3 = (q) => {
            let K = [];
            for (let _ in mJ1.AlgorithmId) {
                let z = mJ1.AlgorithmId[_];
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
        ZD3 = (q) => {
            let K = {};
            return q.checksumAlgorithms().forEach((_) => {
                K[_.algorithmId()] = _.checksumConstructor()
            }), K
        },
        fD3 = (q) => {
            return {
                setRetryStrategy(K) {
                    q.retryStrategy = K
                },
                retryStrategy() {
                    return q.retryStrategy
                }
            }
        },
        GD3 = (q) => {
            let K = {};
            return K.retryStrategy = q.retryStrategy(), K
        },
        Vqq = (q) => {
            return Object.assign(DD3(q), fD3(q))
        },
        vD3 = Vqq,
        TD3 = (q) => {
            return Object.assign(ZD3(q), GD3(q))
        },
        VD3 = (q) => Array.isArray(q) ? q : [q],
        kqq = (q) => {
            for (let _ in q)
                if (q.hasOwnProperty(_) && q[_]["#text"] !== void 0) q[_] = q[_]["#text"];
                else if (typeof q[_] === "object" && q[_] !== null) q[_] = kqq(q[_]);
            return q
        },
        kD3 = (q) => {
            return q != null
        };
    class Nqq {
        trace() {}
        debug() {}
        info() {}
        warn() {}
        error() {}
    }

    function Eqq(q, K, _) {
        let z, Y, A;
        if (typeof K > "u" && typeof _ > "u") z = {}, A = q;
        else if (z = q, typeof K === "function") return Y = K, A = _, yD3(z, Y, A);
        else A = K;
        for (let O of Object.keys(A)) {
            if (!Array.isArray(A[O])) {
                z[O] = A[O];
                continue
            }
            yqq(z, null, A, O)
        }
        return z
    }
    var ND3 = (q) => {
            let K = {};
            for (let [_, z] of Object.entries(q || {})) K[_] = [, z];
            return K
        },
        ED3 = (q, K) => {
            let _ = {};
            for (let z in K) yqq(_, q, K, z);
            return _
        },
        yD3 = (q, K, _) => {
            return Eqq(q, Object.entries(_).reduce((z, [Y, A]) => {
                if (Array.isArray(A)) z[Y] = A;
                else if (typeof A === "function") z[Y] = [K, A()];
                else z[Y] = [K, A];
                return z
            }, {}))
        },
        yqq = (q, K, _, z) => {
            if (K !== null) {
                let O = _[z];
                if (typeof O === "function") O = [, O];
                let [w = LD3, $ = hD3, j = z] = O;
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
        LD3 = (q) => q != null,
        hD3 = (q) => q,
        RD3 = (q) => {
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
        SD3 = (q) => q.toISOString().replace(".000Z", "Z"),
        pJ1 = (q) => {
            if (q == null) return {};
            if (Array.isArray(q)) return q.filter((K) => K != null).map(pJ1);
            if (typeof q === "object") {
                let K = {};
                for (let _ of Object.keys(q)) {
                    if (q[_] == null) continue;
                    K[_] = pJ1(q[_])
                }
                return K
            }
            return q
        };
    Object.defineProperty(kv6, "collectBody", {
        enumerable: !0,
        get: function() {
            return FJ1.collectBody
        }
    });
    Object.defineProperty(kv6, "extendedEncodeURIComponent", {
        enumerable: !0,
        get: function() {
            return FJ1.extendedEncodeURIComponent
        }
    });
    Object.defineProperty(kv6, "resolvedPath", {
        enumerable: !0,
        get: function() {
            return FJ1.resolvedPath
        }
    });
    kv6.Client = fqq;
    kv6.Command = gJ1;
    kv6.NoOpLogger = Nqq;
    kv6.SENSITIVE_STRING = HD3;
    kv6.ServiceException = Vv6;
    kv6._json = pJ1;
    kv6.convertMap = ND3;
    kv6.createAggregatedClient = JD3;
    kv6.decorateServiceException = vqq;
    kv6.emitWarningIfUnsupportedVersion = WD3;
    kv6.getArrayIfSingleItem = VD3;
    kv6.getDefaultClientConfiguration = vD3;
    kv6.getDefaultExtensionConfiguration = Vqq;
    kv6.getValueFromTextNode = kqq;
    kv6.isSerializableHeaderValue = kD3;
    kv6.loadConfigsForDefaultMode = PD3;
    kv6.map = Eqq;
    kv6.resolveDefaultRuntimeConfig = TD3;
    kv6.serializeDateTime = SD3;
    kv6.serializeFloat = RD3;
    kv6.take = ED3;
    kv6.throwDefaultError = Tqq;
    kv6.withBaseException = XD3;
    Object.keys(Wqq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(kv6, q)) Object.defineProperty(kv6, q, {
            enumerable: !0,
            get: function() {
                return Wqq[q]
            }
        })
    })
})
// @from(Ln 77394, Col 4)
Lqq = p((KZ3) => {
    var qZ3 = (q) => typeof ArrayBuffer === "function" && q instanceof ArrayBuffer || Object.prototype.toString.call(q) === "[object ArrayBuffer]";
    KZ3.isArrayBuffer = qZ3
})
// @from(Ln 77398, Col 4)
dJ1 = p((OZ3) => {
    var zZ3 = Lqq(),
        QJ1 = d6("buffer"),
        YZ3 = (q, K = 0, _ = q.byteLength - K) => {
            if (!zZ3.isArrayBuffer(q)) throw TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof q} (${q})`);
            return QJ1.Buffer.from(q, K, _)
        },
        AZ3 = (q, K) => {
            if (typeof q !== "string") throw TypeError(`The "input" argument must be of type string. Received type ${typeof q} (${q})`);
            return K ? QJ1.Buffer.from(q, K) : QJ1.Buffer.from(q)
        };
    OZ3.fromArrayBuffer = YZ3;
    OZ3.fromString = AZ3
})
// @from(Ln 77412, Col 4)
Sqq = p((hqq) => {
    Object.defineProperty(hqq, "__esModule", {
        value: !0
    });
    hqq.fromBase64 = void 0;
    var jZ3 = dJ1(),
        HZ3 = /^[A-Za-z0-9+/]*={0,2}$/,
        JZ3 = (q) => {
            if (q.length * 3 % 4 !== 0) throw TypeError("Incorrect padding on base64 string.");
            if (!HZ3.exec(q)) throw TypeError("Invalid base64 string.");
            let K = (0, jZ3.fromString)(q, "base64");
            return new Uint8Array(K.buffer, K.byteOffset, K.byteLength)
        };
    hqq.fromBase64 = JZ3
})
// @from(Ln 77427, Col 4)
Iqq = p((Cqq) => {
    Object.defineProperty(Cqq, "__esModule", {
        value: !0
    });
    Cqq.toBase64 = void 0;
    var XZ3 = dJ1(),
        MZ3 = nw(),
        PZ3 = (q) => {
            let K;
            if (typeof q === "string") K = (0, MZ3.fromUtf8)(q);
            else K = q;
            if (typeof K !== "object" || typeof K.byteOffset !== "number" || typeof K.byteLength !== "number") throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
            return (0, XZ3.fromArrayBuffer)(K.buffer, K.byteOffset, K.byteLength).toString("base64")
        };
    Cqq.toBase64 = PZ3
})
// @from(Ln 77443, Col 4)
cJ1 = p((Sc6) => {
    var xqq = Sqq(),
        uqq = Iqq();
    Object.keys(xqq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Sc6, q)) Object.defineProperty(Sc6, q, {
            enumerable: !0,
            get: function() {
                return xqq[q]
            }
        })
    });
    Object.keys(uqq).forEach(function(q) {
        if (q !== "default" && !Object.prototype.hasOwnProperty.call(Sc6, q)) Object.defineProperty(Sc6, q, {
            enumerable: !0,
            get: function() {
                return uqq[q]
            }
        })
    })
})